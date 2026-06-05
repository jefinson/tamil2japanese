"""
Run this script on your Windows PC to generate proper app icons
with real Tamil (அ) and Japanese (あ) characters.

Requirements:
  pip install Pillow

Font needed:
  - For Tamil: Install "Noto Sans Tamil" from https://fonts.google.com/noto/specimen/Noto+Sans+Tamil
    Save the .ttf to C:/Windows/Fonts/ (double-click to install)
  - For Japanese: Windows already includes "Yu Gothic" or "Meiryo"

Then run:
  python generate_icon.py
"""

from PIL import Image, ImageDraw, ImageFont
import os

# ── Font paths (Windows) ──
# Tamil font — install Noto Sans Tamil first, or try NirmalaUI which ships with Windows
TAMIL_FONT_CANDIDATES = [
    "C:/Windows/Fonts/NotoSansTamil-Regular.ttf",  # if you installed it
    "C:/Windows/Fonts/NotoSansTamil-Bold.ttf",
    "C:/Windows/Fonts/nirmala.ttf",                # ships with Windows 10/11, has Tamil
    "C:/Windows/Fonts/NirmalaUI.ttf",
]

JAPANESE_FONT_CANDIDATES = [
    "C:/Windows/Fonts/YuGothB.ttc",     # Yu Gothic Bold — beautiful
    "C:/Windows/Fonts/meiryob.ttc",     # Meiryo Bold
    "C:/Windows/Fonts/msgothic.ttc",    # MS Gothic
    "C:/Windows/Fonts/YuGothic-Bold.ttf",
]

def find_font(candidates):
    for path in candidates:
        if os.path.exists(path):
            print(f"  Using font: {path}")
            return path
    return None

tamil_path   = find_font(TAMIL_FONT_CANDIDATES)
japanese_path = find_font(JAPANESE_FONT_CANDIDATES)

if not tamil_path:
    print("WARNING: No Tamil font found. Install Noto Sans Tamil from Google Fonts.")
    print("  https://fonts.google.com/noto/specimen/Noto+Sans+Tamil")
if not japanese_path:
    print("WARNING: No Japanese font found.")

def draw_rounded_rect(draw, xy, radius, fill):
    x1, y1, x2, y2 = xy
    draw.rectangle([x1+radius, y1, x2-radius, y2], fill=fill)
    draw.rectangle([x1, y1+radius, x2, y2-radius], fill=fill)
    for cx, cy in [(x1,y1),(x2-radius*2,y1),(x1,y2-radius*2),(x2-radius*2,y2-radius*2)]:
        draw.ellipse([cx, cy, cx+radius*2, cy+radius*2], fill=fill)

def create_icon(size, with_bg=True):
    BG     = (26, 10, 46, 255)
    WHITE  = (255, 255, 255, 255)
    PURPLE = (155, 111, 208, 255)
    MID    = (107, 63, 160, 255)

    img  = Image.new("RGBA", (size, size), (0,0,0,0))
    draw = ImageDraw.Draw(img)
    s    = size

    if with_bg:
        draw_rounded_rect(draw, [0, 0, s, s], radius=s//7, fill=BG)

    # Card size
    cw = int(s * 0.30)
    ch = int(s * 0.38)
    cr = s // 18
    ly = int(s * 0.25)

    # Left white card
    lx = int(s * 0.13)
    draw_rounded_rect(draw, [lx, ly, lx+cw, ly+ch], radius=cr, fill=WHITE)

    # Right purple card
    rx = int(s * 0.57)
    draw_rounded_rect(draw, [rx, ly, rx+cw, ly+ch], radius=cr, fill=PURPLE)

    # Tamil அ on left card
    ta_size = int(ch * 0.65)
    if tamil_path:
        try:
            ta_font = ImageFont.truetype(tamil_path, ta_size)
            bbox = draw.textbbox((0,0), "அ", font=ta_font)
            tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
            tx = lx + cw//2 - tw//2 - bbox[0]
            ty = ly + ch//2 - th//2 - bbox[1]
            draw.text((tx, ty), "அ", font=ta_font, fill=BG)
        except Exception as e:
            print(f"Tamil render error: {e}")
            # Fallback: "T"
            fb = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", ta_size)
            draw.text((lx + cw//2, ly + ch//2), "T", font=fb, fill=BG, anchor="mm")
    else:
        # Fallback
        fb = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", ta_size)
        draw.text((lx + cw//2, ly + ch//2), "T", font=fb, fill=BG, anchor="mm")

    # Japanese あ on right card
    ja_size = int(ch * 0.62)
    if japanese_path:
        try:
            ja_font = ImageFont.truetype(japanese_path, ja_size)
            bbox = draw.textbbox((0,0), "あ", font=ja_font)
            tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
            tx = rx + cw//2 - tw//2 - bbox[0]
            ty = ly + ch//2 - th//2 - bbox[1]
            draw.text((tx, ty), "あ", font=ja_font, fill=BG)
        except Exception as e:
            print(f"Japanese render error: {e}")
            fb = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", ja_size)
            draw.text((rx + cw//2, ly + ch//2), "J", font=fb, fill=BG, anchor="mm")
    else:
        fb = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", ja_size)
        draw.text((rx + cw//2, ly + ch//2), "J", font=fb, fill=BG, anchor="mm")

    # Bidirectional arrow (two rows: → on top, ← below)
    ax1 = lx + cw + int(s * 0.025)
    ax2 = rx - int(s * 0.025)
    ay  = ly + ch // 2
    aw  = max(4, s//100)   # shaft width
    ah  = max(16, s//48)   # arrowhead size
    gap = max(8, s//64)    # gap between the two arrows

    # Top arrow: → (left to right)
    ay1 = ay - gap
    draw.line([ax1 + ah, ay1, ax2 - ah, ay1], fill=PURPLE, width=aw)
    draw.polygon([(ax2, ay1), (ax2-ah, ay1-ah//2), (ax2-ah, ay1+ah//2)], fill=PURPLE)

    # Bottom arrow: ← (right to left)
    ay2 = ay + gap
    draw.line([ax1 + ah, ay2, ax2 - ah, ay2], fill=PURPLE, width=aw)
    draw.polygon([(ax1, ay2), (ax1+ah, ay2-ah//2), (ax1+ah, ay2+ah//2)], fill=PURPLE)

    return img

# Output folder — same as assets/
out_dir = os.path.dirname(os.path.abspath(__file__))
assets  = os.path.join(out_dir, "assets")
os.makedirs(assets, exist_ok=True)

print("Generating icon.png (1024×1024)...")
icon = create_icon(1024, with_bg=True)
icon.save(os.path.join(assets, "icon.png"))

print("Generating adaptive-icon.png (1024×1024, transparent bg)...")
adaptive = create_icon(1024, with_bg=False)
adaptive.save(os.path.join(assets, "adaptive-icon.png"))

print("Generating splash.png (1284×2778)...")
splash = Image.new("RGBA", (1284, 2778), (26, 10, 46, 255))
logo = create_icon(600, with_bg=False)
splash.paste(logo, ((1284-600)//2, (2778-600)//2), logo)
splash.save(os.path.join(assets, "splash.png"))

print("\nDone! Files saved to assets/")
print("  assets/icon.png")
print("  assets/adaptive-icon.png")
print("  assets/splash.png")
