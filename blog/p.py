posts = [
    ("productive-procrastination", "Productive Procrastination", "August 12", ["procrastination", "productivity"]),
    ("learning-systems", "Building Learning Systems", "August 13", ["learning", "systems"]),
    ("habit-design", "Design Your Habits", "August 14", ["habits", "design"]),
    ("growth-architecture", "Personal Growth Architecture", "August 15", ["growth", "architecture"]),
    ("performance-optimization", "Performance Optimization", "August 16", ["performance", "optimization"]),
    ("mindful-productivity", "Mindful Productivity", "August 17", ["mindfulness", "productivity"]),
    ("continuous-improvement", "Continuous Improvement Daily", "August 18", ["improvement", "continuous"]),
    ("learning-stack", "Building Your Learning Stack", "August 19", ["learning", "stack"]),
    ("focus-architecture", "Focus Architecture", "August 20", ["focus", "architecture"]),
    ("adaptive-learning", "Adaptive Learning Strategies", "August 21", ["learning", "adaptive"]),
]
for slug, title, date, tags in posts:
    html = f'''<!DOCTYPE html>
<html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>{title}</title>
<style>:root{{--p:#6366f1;--b:#0f172a;--c:#1e293b;--t:#f8fafc;--m:#94a3b8}}{*{margin:0;padding:0}}body{{font-family:-apple-system,sans-serif;background:var(--b);color:var(--t);line-height:1.8;padding:20px}}.x{{max-width:800px;margin:0 auto}}h1{{font-size:2rem;margin-bottom:20px}}.y{{color:var(--m);font-size:1.2rem}}.z{{background:linear-gradient(135deg,var(--p),#8b5cf6);padding:30px;border-radius:15px;text-align:center}}.z a{{display:inline-block;background:white;color:var(--p);padding:10px 25px;border-radius:25px;text-decoration:none}}.w{{display:flex;gap:10px;flex-wrap:wrap;margin-top:20px}}.w span{{background:var(--c);padding:5px 12px;border-radius:15px;font-size:0.8rem;color:var(--m)}}</style><link rel="manifest" href="../manifest.json">
</head><body><div class="x"><h1>{title}</h1><p class="y">Content coming soon.</p><div class="z"><a href="../subscribe.html">Subscribe</a></div><div class="w">{" ".join([f"<span>{t}</span>" for t in tags])}</div></div></body></html>'''
    with open(f"{slug}.html", 'w') as f:
        f.write(html)
    print(slug)
