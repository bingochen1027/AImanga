from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

OUT = "/Users/christinaliu/Documents/AImanga/planning/one-page-overview/website-function-overview.png"
W, H = 1080, 1450

FONT_REG = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
FONT_BOLD = "/System/Library/Fonts/STHeiti Medium.ttc"


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REG, size=size)


def text_size(draw, text, fnt):
    box = draw.textbbox((0, 0), text, font=fnt)
    return box[2] - box[0], box[3] - box[1]


def rounded(draw, box, r, fill, outline=None, width=1):
    draw.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


def add_shadow(base, box, radius=28, color=(37, 99, 235, 30), blur=16, offset=(0, 10)):
    x1, y1, x2, y2 = box
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    d.rounded_rectangle((x1 + offset[0], y1 + offset[1], x2 + offset[0], y2 + offset[1]), radius=radius, fill=color)
    layer = layer.filter(ImageFilter.GaussianBlur(blur))
    base.alpha_composite(layer)


def draw_gradient_text(base, xy, text, fnt, c1="#2563EB", c2="#A855F7"):
    x, y = xy
    dummy = ImageDraw.Draw(base)
    tw, th = text_size(dummy, text, fnt)
    mask = Image.new("L", (tw + 8, th + 12), 0)
    md = ImageDraw.Draw(mask)
    md.text((4, 0), text, font=fnt, fill=255)
    grad = Image.new("RGBA", mask.size, (0, 0, 0, 0))
    px = grad.load()
    c1_rgb = tuple(int(c1[i:i+2], 16) for i in (1, 3, 5))
    c2_rgb = tuple(int(c2[i:i+2], 16) for i in (1, 3, 5))
    for gx in range(grad.size[0]):
        t = gx / max(1, grad.size[0] - 1)
        rgb = tuple(int(c1_rgb[i] * (1 - t) + c2_rgb[i] * t) for i in range(3))
        for gy in range(grad.size[1]):
            px[gx, gy] = (*rgb, mask.getpixel((gx, gy)))
    base.alpha_composite(grad, (x - 4, y))


def draw_wrapped(draw, xy, text, fnt, fill, max_width, line_gap=6, max_lines=3):
    x, y = xy
    lines, cur = [], ""
    for ch in text:
        test = cur + ch
        if text_size(draw, test, fnt)[0] <= max_width:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = ch
    if cur:
        lines.append(cur)
    for line in lines[:max_lines]:
        draw.text((x, y), line, font=fnt, fill=fill)
        y += fnt.size + line_gap


def make_background():
    bg = Image.new("RGBA", (W, H), "#F8FBFF")
    p = bg.load()
    for y in range(H):
        t = y / H
        for x in range(W):
            s = x / W
            r = int(248 * (1 - t) + 255 * t - 8 * s)
            g = int(251 * (1 - t) + 255 * t - 2 * s)
            b = int(255 * (1 - t) + 255 * t)
            p[x, y] = (max(235, r), max(240, g), min(255, b), 255)
    for box, color, blur in [
        ((-180, -160, 420, 420), (124, 58, 237, 34), 34),
        ((670, -120, 1280, 500), (37, 99, 235, 42), 44),
        ((750, 910, 1300, 1520), (6, 182, 212, 24), 56),
    ]:
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        d.ellipse(box, fill=color)
        layer = layer.filter(ImageFilter.GaussianBlur(blur))
        bg.alpha_composite(layer)
    return bg


def draw_glass_hero(base):
    hero = Image.new("RGBA", (430, 430), (0, 0, 0, 0))
    d = ImageDraw.Draw(hero)
    for i, alpha in enumerate([26, 34, 42, 54]):
        d.rounded_rectangle((40 - i * 4, 44 - i * 4, 350 + i * 4, 354 + i * 4), 44 + i * 2, outline=(94, 129, 255, alpha), width=8)
    d.rounded_rectangle((42, 42, 350, 350), 48, fill=(255, 255, 255, 92), outline=(104, 139, 255, 92), width=4)
    d.rounded_rectangle((64, 64, 328, 328), 38, outline=(255, 255, 255, 160), width=3)
    # puzzle-like white form
    d.rounded_rectangle((128, 122, 264, 258), 34, fill=(255, 255, 255, 238))
    d.ellipse((175, 76, 229, 130), fill=(255, 255, 255, 238))
    d.ellipse((175, 249, 229, 303), fill=(235, 244, 255, 255))
    d.ellipse((84, 163, 138, 217), fill=(255, 255, 255, 238))
    d.ellipse((254, 163, 308, 217), fill=(221, 232, 255, 255))
    # blue/purple depth
    d.rounded_rectangle((132, 130, 270, 266), 34, outline=(37, 99, 235, 82), width=10)
    d.ellipse((255, 165, 305, 215), outline=(124, 58, 237, 90), width=9)
    hero = hero.filter(ImageFilter.GaussianBlur(0.2)).rotate(-8, resample=Image.Resampling.BICUBIC, expand=True)
    base.alpha_composite(hero, (590, 58))
    draw = ImageDraw.Draw(base)
    # floating tiles
    add_shadow(base, (875, 60, 965, 146), 22, (124, 58, 237, 70), 12, (0, 10))
    rounded(draw, (875, 60, 965, 146), 22, "#7C5CFF")
    draw.text((894, 82), "</>", font=font(26, True), fill="#FFFFFF")
    add_shadow(base, (895, 310, 1000, 405), 22, (37, 99, 235, 55), 12, (0, 10))
    rounded(draw, (895, 310, 1000, 405), 22, "#2563EB")
    draw.line((920, 370, 940, 345, 960, 355, 978, 330), fill="#FFFFFF", width=7)
    draw.line((920, 382, 984, 382), fill="#FFFFFF", width=5)


def feature_card(base, idx, x, y, title, body, icon, accent):
    draw = ImageDraw.Draw(base)
    w, h = 188, 218
    add_shadow(base, (x, y, x + w, y + h), 24, (37, 99, 235, 18), 10, (0, 8))
    rounded(draw, (x, y, x + w, y + h), 24, "#FFFFFF", "#E5EEFF", 1)
    rounded(draw, (x + 16, y + 14, x + 58, y + 52), 14, accent)
    draw.text((x + 24, y + 20), f"{idx:02d}", font=font(17, True), fill="#FFFFFF")
    # icon bubble
    rounded(draw, (x + 58, y + 64, x + 130, y + 136), 25, "#F2F7FF", "#E0E9FF", 1)
    draw.text((x + 82, y + 82), icon, font=font(32, True), fill=accent)
    tw, _ = text_size(draw, title, font(21, True))
    draw.text((x + (w - tw) / 2, y + 150), title, font=font(21, True), fill="#0F172A")
    lines_y = y + 182
    draw_wrapped(draw, (x + 22, lines_y), body, font(15), "#334155", w - 44, 4, 2)
    draw.line((x + 76, y + h - 16, x + 112, y + h - 16), fill=accent, width=3)


def step_panel(base, idx, x, y, title, body, icon, accent):
    draw = ImageDraw.Draw(base)
    w, h = 270, 180
    rounded(draw, (x, y, x + w, y + h), 22, "#FFFFFF", "#E5EEFF", 1)
    rounded(draw, (x + 18, y + 18, x + 52, y + 52), 17, accent)
    draw.text((x + 30, y + 24), str(idx), font=font(17, True), fill="#FFFFFF")
    draw.text((x + 70, y + 22), title, font=font(20, True), fill="#0F172A")
    rounded(draw, (x + 78, y + 66, x + 192, y + 128), 18, "#F4F7FF", "#E4ECFF", 1)
    draw.text((x + 118, y + 78), icon, font=font(34, True), fill=accent)
    draw_wrapped(draw, (x + 38, y + 132), body, font(15), "#334155", w - 76, 4, 2)


img = make_background()
draw = ImageDraw.Draw(img)

draw.text((50, 54), "漫剧工场", font=font(82, True), fill="#070B2A")
draw_gradient_text(img, (50, 152), "官网的", font(45, True), "#070B2A", "#070B2A")
draw_gradient_text(img, (235, 128), "8", font(86, True), "#2563EB", "#A855F7")
draw.text((300, 152), "个功能入口", font=font(45, True), fill="#070B2A")
rounded(draw, (50, 240, 545, 296), 28, "#2563EB")
rounded(draw, (51, 240, 545, 296), 28, "#2563EB")
pill = Image.new("RGBA", (495, 56), (0, 0, 0, 0))
pd = ImageDraw.Draw(pill)
for x in range(495):
    t = x / 494
    r = int(37 * (1 - t) + 168 * t)
    g = int(99 * (1 - t) + 85 * t)
    b = int(235 * (1 - t) + 247 * t)
    pd.line((x, 0, x, 56), fill=(r, g, b, 255))
mask = Image.new("L", (495, 56), 0)
ImageDraw.Draw(mask).rounded_rectangle((0, 0, 495, 56), 28, fill=255)
img.paste(pill, (50, 240), mask)
draw = ImageDraw.Draw(img)
draw.text((86, 253), "覆盖获客｜创作｜资产｜投放增长", font=font(22, True), fill="#FFFFFF")
draw.text((54, 326), "让新手能开始，让项目能沉淀，让成本能看见。", font=font(25, True), fill="#0F172A")

draw_glass_hero(img)
draw = ImageDraw.Draw(img)

features = [
    ("首页", "快速说明价值", "首", "#2563EB"),
    ("产品功能", "七步看懂流程", "能", "#7C3AED"),
    ("模板中心", "从模板开始", "模", "#DB45B5"),
    ("案例中心", "案例建立信任", "案", "#0EA5E9"),
    ("价格", "按需升级", "价", "#F97316"),
    ("个人中心", "管理项目权益", "我", "#4F46E5"),
    ("工作台", "引导完成创作", "作", "#16A34A"),
    ("投放包", "生成增长素材", "投", "#2563EB"),
]

start_x, gap_x = 40, 18
start_y, gap_y = 470, 18
for i, (title, body, icon, accent) in enumerate(features, start=1):
    col = (i - 1) % 4
    row = (i - 1) // 4
    feature_card(img, i, start_x + col * (188 + gap_x), start_y + row * (218 + gap_y), title, body, icon, accent)

# Bottom steps card
add_shadow(img, (40, 985, 1040, 1396), 32, (37, 99, 235, 24), 16, (0, 10))
rounded(draw, (40, 985, 1040, 1396), 32, "#FFFFFF", "#E4ECFF", 1)
rounded(draw, (250, 1020, 284, 1054), 12, "#2563EB")
draw.text((258, 1024), "启", font=font(19, True), fill="#FFFFFF")
draw.text((318, 1016), "3 步完成第一集，", font=font(37, True), fill="#070B2A")
draw_gradient_text(img, (640, 1004), "5 分钟快速上手", font(45, True), "#2563EB", "#7C3AED")
draw.line((648, 1062, 930, 1046), fill="#7C3AED", width=3)

step_panel(img, 1, 82, 1110, "选择入口", "首页、模板或案例都能开始", "入", "#2563EB")
draw.text((370, 1178), "→", font=font(42, True), fill="#CBD5E1")
step_panel(img, 2, 405, 1110, "进入工作台", "按问题确认题材、时长与目标", "作", "#7C3AED")
draw.text((694, 1178), "→", font=font(42, True), fill="#CBD5E1")
step_panel(img, 3, 728, 1110, "生成档案", "产出剧本方向和项目档案", "成", "#2563EB")

draw.text((128, 1352), "先跑通最短路径，再扩展视频生成、团队协作和投放数据回流。", font=font(22, True), fill="#0F172A")
draw.text((332, 1404), "漫剧工场｜智能漫剧创作与增长官网", font=font(18), fill="#64748B")

os.makedirs(os.path.dirname(OUT), exist_ok=True)
img.convert("RGB").save(OUT, quality=96)
print(OUT)
