from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import hashlib
import re
import json
import math
import os
from datetime import datetime
import sqlite3
import bcrypt as bcrypt_lib
import base64

app = FastAPI(title="RobinCracker API", version="1.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "robin.db")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("""
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            input TEXT,
            output TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS uploads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            filepath TEXT NOT NULL,
            size INTEGER DEFAULT 0,
            entries INTEGER DEFAULT 0,
            encoding TEXT DEFAULT 'utf-8',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    return conn

# Hash Identification
def identify_hash(hash_str: str) -> list:
    s = hash_str.strip()
    l = len(s)
    results = []
    if re.match(r'^[0-9a-f]{32}$', s, re.I):
        results.append({"algorithm": "MD5", "length": 128, "confidence": 95, "note": "Most common 128-bit hash", "example_cmd": "hashcat -m 0"})
    if re.match(r'^[0-9a-f]{40}$', s, re.I):
        results.append({"algorithm": "SHA-1", "length": 160, "confidence": 95, "note": "160-bit hash, 40 hex chars", "example_cmd": "hashcat -m 100"})
    if re.match(r'^[0-9a-f]{56}$', s, re.I):
        results.append({"algorithm": "SHA-224", "length": 224, "confidence": 90, "note": "224-bit SHA-2 variant", "example_cmd": "hashcat -m 1300"})
    if re.match(r'^[0-9a-f]{64}$', s, re.I):
        results.append({"algorithm": "SHA-256", "length": 256, "confidence": 95, "note": "256-bit SHA-2, 64 hex chars", "example_cmd": "hashcat -m 1400"})
    if re.match(r'^[0-9a-f]{96}$', s, re.I):
        results.append({"algorithm": "SHA-384", "length": 384, "confidence": 90, "note": "384-bit SHA-2 variant", "example_cmd": "hashcat -m 10800"})
    if re.match(r'^[0-9a-f]{128}$', s, re.I):
        results.append({"algorithm": "SHA-512", "length": 512, "confidence": 90, "note": "512-bit SHA-2, 128 hex chars", "example_cmd": "hashcat -m 1700"})
    if re.match(r'^$2[aby]$\d{2}$[.\/A-Za-z0-9]{53}$', s):
        results.append({"algorithm": "bcrypt", "length": 448, "confidence": 98, "note": "Blowfish-based, $2y$ prefix", "example_cmd": "hashcat -m 3200"})
    if re.match(r'^$argon2(id|i|d)$', s):
        results.append({"algorithm": "Argon2", "length": 512, "confidence": 95, "note": "Memory-hard modern hash", "example_cmd": "hashcat -m 29300"})
    if re.match(r'^[0-9a-f]{32}$', s, re.I):
        results.append({"algorithm": "NTLM", "length": 128, "confidence": 60, "note": "Could be NTLM or MD5", "example_cmd": "hashcat -m 1000"})
    if re.match(r'^$1$', s):
        results.append({"algorithm": "MD5 Crypt", "length": 128, "confidence": 95, "note": "Unix MD5 password hash ($1$)", "example_cmd": "hashcat -m 500"})
    if re.match(r'^$5$', s):
        results.append({"algorithm": "SHA-256 Crypt", "length": 256, "confidence": 95, "note": "Unix SHA-256 ($5$)", "example_cmd": "hashcat -m 7400"})
    if re.match(r'^$6$', s):
        results.append({"algorithm": "SHA-512 Crypt", "length": 512, "confidence": 95, "note": "Unix SHA-512 ($6$)", "example_cmd": "hashcat -m 1800"})
    return sorted(results, key=lambda x: x["confidence"], reverse=True) if results else [{"algorithm": "Unknown", "length": l * 4, "confidence": 10, "note": "Hash format not recognized"}]

# Password strength calculation
def calc_entropy(password: str) -> dict:
    L = len(password)
    charset = 0
    if re.search(r'[a-z]', password): charset += 26
    if re.search(r'[A-Z]', password): charset += 26
    if re.search(r'[0-9]', password): charset += 10
    if re.search(r'[^a-zA-Z0-9]', password): charset += 33
    if charset == 0: return {"entropy": 0, "charset": 0, "length": L, "crack_times": {}}
    entropy = L * math.log2(charset)
    speeds = {"100 MH/s": 100e6, "1 GH/s": 1e9, "10 GH/s": 10e9, "100 GH/s": 100e9, "1 TH/s": 1e12, "10 TH/s": 10e12}
    crack_times = {}
    for label, speed in speeds.items():
        seconds = (2 ** entropy) / speed
        if seconds < 1: crack_times[label] = "Instant"
        elif seconds < 60: crack_times[label] = f"{seconds:.1f} sec"
        elif seconds < 3600: crack_times[label] = f"{seconds/60:.1f} min"
        elif seconds < 86400: crack_times[label] = f"{seconds/3600:.1f} hrs"
        elif seconds < 31536000: crack_times[label] = f"{seconds/86400:.1f} days"
        else: crack_times[label] = f"{seconds/31536000:.1f} years"
    return {"entropy": round(entropy, 2), "charset": charset, "length": L, "crack_times": crack_times}

# API Routes
@app.get("/api/health")
def health():
    return {"status": "ok", "version": "1.0.0", "timestamp": datetime.now().isoformat()}

@app.post("/api/identify")
def api_identify(hash: str = Form(...)):
    results = identify_hash(hash)
    entropy = 0
    char_set_detected = "hexadecimal"
    if re.match(r'^[0-9a-f]+$', hash.strip(), re.I):
        char_set_detected = "hexadecimal (0-9, a-f)"
        entropy = len(hash.strip()) * 4  # 4 bits per hex char
    
    conn = get_db()
    conn.execute("INSERT INTO history (type, input, output) VALUES (?, ?, ?)",
                 ("identify", hash[:100], json.dumps(results[:3])))
    conn.commit()
    conn.close()
    
    return {
        "results": results,
        "analysis": {
            "length": len(hash.strip()),
            "bits": entropy,
            "char_set": char_set_detected,
            "entropy": entropy,
        }
    }

@app.post("/api/analyze")
def api_analyze(hash: str = Form(...)):
    s = hash.strip()
    chars = set(s)
    has_lower = bool(re.search(r'[a-z]', s))
    has_upper = bool(re.search(r'[A-Z]', s))
    has_digit = bool(re.search(r'[0-9]', s))
    has_special = bool(re.search(r'[^a-zA-Z0-9]', s))
    has_colon = ':' in s
    has_dollar = '$' in s
    
    char_set_size = 0
    if has_lower: char_set_size += 26
    if has_upper: char_set_size += 26
    if has_digit: char_set_size += 10
    if has_special: char_set_size += len([c for c in s if not c.isalnum()])
    
    entropy = len(s) * math.log2(max(char_set_size, 2))
    
    risk = "Low"
    if entropy < 30: risk = "Critical"
    elif entropy < 50: risk = "High"
    elif entropy < 80: risk = "Medium"
    
    complexity = "Very Low"
    if char_set_size > 70: complexity = "Very High"
    elif char_set_size > 50: complexity = "High"
    elif char_set_size > 30: complexity = "Medium"
    elif char_set_size > 10: complexity = "Low"
    
    try:
        is_base64 = bool(base64.b64decode(s, validate=True)) and len(s) > 10 and bool(re.match(r"^[A-Za-z0-9+/=]+$", s))
    except:
        is_base64 = False
    
    conn = get_db()
    conn.execute("INSERT INTO history (type, input, output) VALUES (?, ?, ?)",
                 ("analyze", s[:100], json.dumps({"entropy": round(entropy, 2), "risk": risk})))
    conn.commit()
    conn.close()
    
    return {
        "length": len(s),
        "bits": round(entropy, 2),
        "hex_encoded": bool(re.match(r'^[0-9a-f]+$', s, re.I)),
        "base64_encoded": is_base64,
        "character_set": {
            "size": char_set_size,
            "has_lowercase": has_lower,
            "has_uppercase": has_upper,
            "has_digits": has_digit,
            "has_special": has_special,
            "has_colon": has_colon,
            "has_dollar": has_dollar,
            "unique_chars": len(chars),
        },
        "entropy": round(entropy, 2),
        "risk_level": risk,
        "complexity": complexity,
    }

@app.post("/api/password-strength")
def api_password_strength(password: str = Form(...)):
    result = calc_entropy(password)
    
    strength = "Very Weak"
    if result["entropy"] >= 80: strength = "Very Strong"
    elif result["entropy"] >= 60: strength = "Strong"
    elif result["entropy"] >= 40: strength = "Moderate"
    elif result["entropy"] >= 30: strength = "Weak"
    
    suggestions = []
    if result["length"] < 12: suggestions.append("Increase length to at least 12 characters")
    if result["charset"] < 60: suggestions.append("Add symbols and mixed case for higher entropy")
    if bool(re.search(r'(.)\1{2,}', password)): suggestions.append("Avoid repeated characters (e.g., 'aaa')")
    if bool(re.search(r'(123|abc|qwerty|password)', password.lower())): suggestions.append("Avoid common patterns like '123', 'abc', 'password'")
    if result["length"] < 8: suggestions.append("Password is too short — minimum 8 characters recommended")
    
    conn = get_db()
    conn.execute("INSERT INTO history (type, input, output) VALUES (?, ?, ?)",
                 ("strength", "***", json.dumps({"entropy": result["entropy"], "strength": strength})))
    conn.commit()
    conn.close()
    
    return {
        "entropy": result["entropy"],
        "length": result["length"],
        "charset_size": result["charset"],
        "strength": strength,
        "crack_times": result["crack_times"],
        "suggestions": suggestions,
    }

@app.post("/api/generate-password")
def api_generate_password(length: int = Form(16), charset_type: str = Form("all"), count: int = Form(5)):
    import random
    import string
    char_sets = {
        "lower": string.ascii_lowercase,
        "upper": string.ascii_uppercase,
        "digits": string.digits,
        "symbols": "!@#$%^&*()_+-=[]{}|;:,.<>?",
        "all": string.ascii_letters + string.digits + "!@#$%^&*()_+-=[]{}|;:,.<>?",
        "alphanumeric": string.ascii_letters + string.digits,
        "hex": string.hexdigits,
    }
    chars = char_sets.get(charset_type, string.ascii_letters + string.digits)
    
    passwords = []
    for _ in range(count):
        pwd = ''.join(random.choice(chars) for _ in range(length))
        entropy = len(pwd) * math.log2(len(chars))
        passwords.append({"password": pwd, "entropy": round(entropy, 2)})
    
    return {"passwords": passwords, "length": length, "charset_type": charset_type}

@app.post("/api/convert-hash")
def api_convert_hash(input_str: str = Form(...), from_format: str = Form("hex"), to_format: str = Form("base64")):
    try:
        if from_format == "hex":
            raw = bytes.fromhex(input_str)
        elif from_format == "base64":
            raw = base64.b64decode(input_str)
        elif from_format == "binary":
            raw = int(input_str.replace(' ', ''), 2).to_bytes((len(input_str.replace(' ', '')) + 7) // 8, 'big')
        else:
            raw = input_str.encode()
        
        result = {}
        result["hex"] = raw.hex()
        result["base64"] = base64.b64encode(raw).decode()
        result["binary"] = ' '.join(format(b, '08b') for b in raw)
        result["ascii"] = raw.decode('latin-1')
        result["utf8"] = raw.decode('utf-8', errors='replace')
        result["length"] = len(raw)
        result["bits"] = len(raw) * 8
        
        return {"result": result.get(to_format, result["hex"]), "all_formats": result, "from": from_format, "to": to_format}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Conversion error: {str(e)}")

@app.get("/api/benchmark")
def api_benchmark():
    algorithms = [
        {"name": "MD5", "hashcat_mode": 0, "speed_mh": 60000, "speed_per_sec": "60 billion", "gpu_speed": "60,000 MH/s", "cpu_speed": "500 MH/s", "relative_speed": 1},
        {"name": "SHA-1", "hashcat_mode": 100, "speed_mh": 20000, "speed_per_sec": "20 billion", "gpu_speed": "20,000 MH/s", "cpu_speed": "300 MH/s", "relative_speed": 0.33},
        {"name": "SHA-256", "hashcat_mode": 1400, "speed_mh": 10000, "speed_per_sec": "10 billion", "gpu_speed": "10,000 MH/s", "cpu_speed": "150 MH/s", "relative_speed": 0.17},
        {"name": "SHA-512", "hashcat_mode": 1700, "speed_mh": 4000, "speed_per_sec": "4 billion", "gpu_speed": "4,000 MH/s", "cpu_speed": "80 MH/s", "relative_speed": 0.07},
        {"name": "NTLM", "hashcat_mode": 1000, "speed_mh": 70000, "speed_per_sec": "70 billion", "gpu_speed": "70,000 MH/s", "cpu_speed": "600 MH/s", "relative_speed": 1.17},
        {"name": "bcrypt (cost 5)", "hashcat_mode": 3200, "speed_mh": 0.1, "speed_per_sec": "100,000", "gpu_speed": "0.1 MH/s", "cpu_speed": "0.005 MH/s", "relative_speed": 0.000002},
        {"name": "bcrypt (cost 12)", "hashcat_mode": 3200, "speed_mh": 0.025, "speed_per_sec": "25,000", "gpu_speed": "0.025 MH/s", "cpu_speed": "0.001 MH/s", "relative_speed": 0.0000004},
        {"name": "sha512crypt", "hashcat_mode": 1800, "speed_mh": 0.2, "speed_per_sec": "200,000", "gpu_speed": "0.2 MH/s", "cpu_speed": "0.01 MH/s", "relative_speed": 0.000003},
        {"name": "Argon2id", "hashcat_mode": 29300, "speed_mh": 0.008, "speed_per_sec": "8,000", "gpu_speed": "0.008 MH/s", "cpu_speed": "0.002 MH/s", "relative_speed": 0.0000001},
    ]
    return {"algorithms": algorithms, "note": "Estimated speeds on modern GPU (RTX 4090). Actual speeds vary by hardware."}

@app.post("/api/hashcat-command")
def api_hashcat_command(
    hash_type: str = Form(...), attack_mode: str = Form("0"),
    wordlist: str = Form(""), mask: str = Form(""),
    rules: str = Form(""), session: str = Form(""),
    gpu: str = Form(""), output: str = Form(""),
):
    MODES = {"MD5": "0", "SHA1": "100", "SHA256": "1400", "SHA512": "1700", "bcrypt": "3200", "NTLM": "1000", "sha512crypt": "1800", "Argon2": "29300"}
    ATTACKS = {"Dictionary": "0", "Combination": "1", "Mask": "3", "Hybrid dict+mask": "6", "Hybrid mask+dict": "7"}
    
    mode = MODES.get(hash_type, "0")
    attack = ATTACKS.get(attack_mode, "0")
    
    parts = ["hashcat"]
    parts.append(f"-m {mode}")
    parts.append(f"-a {attack}")
    parts.append("hash.txt")
    if wordlist: parts.append(wordlist)
    if mask: parts.append(mask)
    if rules: parts.append(f"-r {rules}")
    if session: parts.extend(["--session", session])
    if gpu: parts.extend(["-d", gpu])
    if output: parts.extend(["-o", output])
    
    cmd = " ".join(parts)
    return {"command": cmd, "hashcat_mode": int(mode), "attack_mode": int(attack), "explanation": f"Cracks {hash_type} hashes using {attack_mode} attack."}

@app.post("/api/john-command")
def api_john_command(hash_type: str = Form(...), wordlist: str = Form(""), rules: str = Form(""), format_type: str = Form(""), session: str = Form("")):
    FORMATS = {"MD5": "raw-md5", "SHA1": "raw-sha1", "SHA256": "raw-sha256", "SHA512": "raw-sha512", "bcrypt": "bcrypt", "sha512crypt": "sha512crypt", "NTLM": "nt"}
    fmt = FORMATS.get(hash_type, "")
    parts = ["john"]
    if wordlist: parts.extend([f"--wordlist={wordlist}"])
    if rules: parts.extend([f"--rules={rules}"])
    if fmt: parts.extend([f"--format={fmt}"])
    if session: parts.extend([f"--session={session}"])
    parts.append("hash.txt")
    return {"command": " ".join(parts), "format": fmt}

@app.post("/api/upload-dictionary")
async def upload_dictionary(file: UploadFile = File(...)):
    content = await file.read()
    filepath = os.path.join(os.path.dirname(__file__), "uploads", file.filename)
    with open(filepath, "wb") as f:
        f.write(content)
    
    try:
        text = content.decode('utf-8', errors='replace')
        lines = text.splitlines()
        entries = len([l for l in lines if l.strip()])
        size = len(content)
        duplicates = entries - len(set(lines))
        
        conn = get_db()
        conn.execute("INSERT INTO uploads (filename, filepath, size, entries) VALUES (?, ?, ?, ?)",
                     (file.filename, filepath, size, entries))
        conn.commit()
        conn.close()
        
        return {
            "filename": file.filename,
            "size": size,
            "entries": entries,
            "duplicates": max(0, duplicates),
            "encoding": "utf-8",
            "preview": lines[:20],
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {str(e)}")

@app.get("/api/uploads")
def api_uploads():
    conn = get_db()
    rows = conn.execute("SELECT * FROM uploads ORDER BY created_at DESC").fetchall()
    conn.close()
    return {"uploads": [dict(r) for r in rows]}

@app.get("/api/history")
def api_history(limit: int = 50):
    conn = get_db()
    rows = conn.execute("SELECT * FROM history ORDER BY created_at DESC LIMIT ?", (limit,)).fetchall()
    conn.close()
    return {"history": [dict(r) for r in rows]}

@app.post("/api/generate-rules")
def api_generate_rules(base_word: str = Form("password"), rule_type: str = Form("common")):
    RULES = {
        "common": [
            {"rule": ":", "result": base_word, "desc": "No change"},
            {"rule": "c", "result": base_word.capitalize(), "desc": "Capitalize first letter"},
            {"rule": "u", "result": base_word.upper(), "desc": "All uppercase"},
            {"rule": "l", "result": base_word.lower(), "desc": "All lowercase"},
            {"rule": "t", "result": base_word.swapcase(), "desc": "Toggle case"},
            {"rule": "d", "result": base_word + base_word, "desc": "Duplicate word"},
            {"rule": "$1 $2 $3", "result": base_word + "123", "desc": "Append '123'"},
            {"rule": "^! $$", "result": "!" + base_word + "$", "desc": "Prefix !, suffix $"},
            {"rule": "sa@", "result": base_word.replace('a', '@'), "desc": "a → @"},
            {"rule": "ss$", "result": base_word.replace('s', '$'), "desc": "s → $"},
            {"rule": "se3", "result": base_word.replace('e', '3'), "desc": "e → 3"},
            {"rule": "so0", "result": base_word.replace('o', '0'), "desc": "o → 0"},
            {"rule": "si1", "result": base_word.replace('i', '1'), "desc": "i → 1"},
            {"rule": "c $! $!", "result": base_word.capitalize() + "!!", "desc": "Capitalize + append !!"},
        ],
        "leet": [
            {"rule": "sa@ ss$ se3", "result": base_word.replace('a','@').replace('s','$').replace('e','3'), "desc": "Full leet: a→@, s→$, e→3"},
            {"rule": "so0 si1", "result": base_word.replace('o','0').replace('i','1'), "desc": "o→0, i→1"},
        ],
        "hashcat_rules": [
            {"rule": ":", "desc": "No operation — pass-through"},
            {"rule": "l", "desc": "Lowercase all letters"},
            {"rule": "u", "desc": "Uppercase all letters"},
            {"rule": "c", "desc": "Capitalize (first letter upper)"},
            {"rule": "t", "desc": "Toggle case (swap case of all letters)"},
            {"rule": "d", "desc": "Duplicate entire word"},
            {"rule": "p{N}", "desc": "Append N times (e.g., p2 = append twice)"},
            {"rule": "f", "desc": "Reverse case of all letters"},
            {"rule": "r", "desc": "Reverse entire word"},
            {"rule": "$X", "desc": "Append character X at the end"},
            {"rule": "^X", "desc": "Prepend character X at the beginning"},
            {"rule": "sXY", "desc": "Replace all X with Y (sab → replace a with b)"},
            {"rule": "T{N}", "desc": "Toggle case at position N (0-indexed)"},
            {"rule": "DN", "desc": "Delete character at position N"},
            {"rule": "IN X", "desc": "Insert character X at position N"},
            {"rule": "RN", "desc": "Remove (delete) N characters from end"},
            {"rule": "z{N}", "desc": "Duplicate word N times"},
            {"rule": "Z{N}", "desc": "Duplicate first character N times"},
            {"rule": "{", "desc": "Rotate word left"},
            {"rule": "}", "desc": "Rotate word right"},
            {"rule": "_", "desc": "Replace spaces with underscores"},
        ]
    }
    
    rules = RULES.get(rule_type, RULES["common"])
    is_hashcat = rule_type == "hashcat_rules"
    if not is_hashcat:
        rules = rules[:20]  # Limit preview
    
    return {
        "rule_type": rule_type,
        "base_word": base_word,
        "rules": rules,
        "is_hashcat": is_hashcat,
        "export": "hashcat" if rule_type == "hashcat_rules" else "custom",
        "total_rules": len(RULES.get(rule_type, [])),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
