"""Check local links and assets for root and GitHub Pages-style hosting.

Run from any directory: python scripts/check_site.py
"""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
FILES = {p.relative_to(ROOT).as_posix(): p for p in ROOT.rglob("*")
         if p.is_file() and ".git" not in p.parts}
ERRORS = []
REFERENCES = 0

class Page(HTMLParser):
    def __init__(self, name):
        super().__init__(convert_charrefs=True)
        self.name = name
        self.refs = []
        self.ids = set()
        self.scripts = []
        self.image_cards = 0
        self.card_images = 0

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        classes = values.get("class", "").split()
        self.image_cards += "article-card-image" in classes
        self.card_images += tag == "img" and "article-card-bg" in classes
        ident = values.get("id")
        if ident:
            if ident in self.ids:
                ERRORS.append(f"{self.name}: duplicate id {ident}")
            self.ids.add(ident)
        if re.fullmatch(r"h[7-9]", tag):
            ERRORS.append(f"{self.name}: invalid heading {tag}")
        for key in ("href", "src", "poster"):
            if values.get(key):
                self.refs.append(values[key])
        self.refs.extend(re.findall(r"url\(\s*['\"]?([^'\")]+)", values.get("style", "")))
        if tag == "script" and values.get("src"):
            self.scripts.append(values["src"])

    handle_startendtag = handle_starttag

def check_reference(name, value, prefix, fragment=False):
    global REFERENCES
    if value.startswith(("data:", "mailto:", "tel:", "#")):
        return
    base = f"https://example.test{prefix}"
    page_url = urljoin(base, name)
    # Injected shared components deliberately mark links from the site root.
    target = urljoin(base if fragment else page_url,
                     value.lstrip("/") if fragment else value)
    url = urlsplit(target)
    if url.netloc != "example.test":
        return
    REFERENCES += 1
    if not url.path.startswith(prefix):
        ERRORS.append(f"{name}: escapes deployment directory: {value}")
        return
    local = unquote(url.path[len(prefix):]) or "index.html"
    if local not in FILES:
        ERRORS.append(f"{name}: missing or incorrectly cased target: {value} -> {local}")

pages = {name: Page(name) for name in FILES if name.endswith(".html")}
for name, page in pages.items():
    page.feed(FILES[name].read_text(encoding="utf-8-sig"))
    if page.image_cards != page.card_images:
        ERRORS.append(f"{name}: a card is missing its background image")
    fragment = name.startswith("components/")
    if not fragment:
        for mount in ("navbar", "footer"):
            if mount not in page.ids:
                ERRORS.append(f"{name}: missing {mount} mount")
        for loader in ("loadNav.js", "loadFooter.js"):
            if not any(src.endswith(loader) for src in page.scripts):
                ERRORS.append(f"{name}: missing {loader}")
    for prefix in ("/", "/curiouspanda/"):
        for value in page.refs:
            check_reference(name, value, prefix, fragment)
for name, path in FILES.items():
    if name.endswith(".css"):
        for value in re.findall(r"url\(\s*['\"]?([^'\")]+)", path.read_text(encoding="utf-8")):
            for prefix in ("/", "/curiouspanda/"):
                check_reference(name, value, prefix)
if ERRORS:
    print("\n".join(sorted(set(ERRORS))))
    sys.exit(1)
print(f"PASS: {len(pages) - 2} pages, 2 shared components, {REFERENCES} local references; root and project-directory hosting.")
