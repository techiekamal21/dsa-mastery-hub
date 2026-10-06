import re
import os

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html_path = os.path.join(base_dir, "index.html")
js_path = os.path.join(base_dir, "app.js")

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

get_by_id = re.findall(r"document\.getElementById\(['\"]([^'\"]+)['\"]\)", js)
html_ids = set(re.findall(r"id=['\"]([^'\"]+)['\"]", html))

missing = [gid for gid in set(get_by_id) if gid not in html_ids]
print(f"Total getElementById calls: {len(get_by_id)}")
print(f"Unique DOM IDs referenced in JS: {len(set(get_by_id))}")
print(f"Missing IDs in index.html: {missing}")

if not missing:
    print("SUCCESS: 100% DOM alignment between app.js and index.html!")
else:
    print("WARNING: Some elements are missing.")
