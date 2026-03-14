import os
import random
import datetime
import subprocess

# Go to blog dir
os.chdir('/root/.openclaw/workspace/motivational-quote/blog')

topics = ["resilience", "focus", "mindset", "habits", "growth", "productivity", "leadership", "discipline"]
adjectives = ["Unstoppable", "Limitless", "Profound", "Daily", "Strategic", "Mindful", "Essential", "Radical"]

topic = random.choice(topics)
adj = random.choice(adjectives)
date_str = datetime.datetime.now().strftime("%B %d, %Y")
slug = f"{adj.lower()}-{topic}-{int(datetime.datetime.now().timestamp())}"
title = f"{adj} {topic.title()}: A Daily Guide"

html = f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>{title}</title>
<style>:root{{--primary:#6366f1;--bg:#0f172a;--card-bg:#1e293b;--text:#f8fafc;--text-muted:#94a3b8;--border:#334155}}{{*{{margin:0;padding:0}}body{{font-family:-apple-system,sans-serif;background:var(--bg);color:var(--text);line-height:1.8;padding:20px}}.container{{max-width:800px;margin:0 auto}}header{{text-align:center;padding:40px 0;border-bottom:1px solid var(--border);margin-bottom:40px}}.logo{{font-size:1.5rem;font-weight:700;background:linear-gradient(135deg,var(--primary),#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}}.nav{{display:flex;justify-content:center;gap:20px;margin-top:20px}}.nav a{{color:var(--text-muted);text-decoration:none}}h1{{font-size:2.2rem;margin-bottom:20px}}</style>
</head>
<body><div class="container"><header><a href="../" class="logo">Motivational Quote</a><nav class="nav"><a href="../">Home</a><a href="./">Blog</a></nav></header><article><p style="color:var(--text-muted)">{date_str}</p><h1>{title}</h1><p>Daily insight on {topic}. Check back for full content.</p></article></div></body></html>"""

with open(f"{slug}.html", "w") as f:
    f.write(html)

# Update git
os.chdir('/root/.openclaw/workspace/motivational-quote')
subprocess.run(["git", "add", "blog/"])
subprocess.run(["git", "commit", "-m", f"Auto-daily blog post: {title}"])
subprocess.run(["git", "push"])
print(f"Successfully published {slug}.html")
