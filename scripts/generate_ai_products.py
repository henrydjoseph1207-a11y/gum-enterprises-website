"""
One-off script: use Gemini Nano Banana to restyle raw product photos into
elegant premium product photography, matching the "Bharat ka Spiced Peanut
Butter" reference (warm wood shelf, potted greens, subtle golden light,
premium editorial feel), while preserving the actual LOONEWOLF label details.

Outputs saved to /app/frontend/public/catalogue/media/
"""

import asyncio
import base64
import os
from pathlib import Path

from dotenv import load_dotenv
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent

load_dotenv("/app/backend/.env")

MEDIA_DIR = Path("/app/frontend/public/catalogue/media")

STYLE_REFERENCE = (
    "Editorial premium product photograph in the exact visual style of a luxury Indian "
    "brand catalog: warm natural window light, rich wooden shelf, small terracotta pots "
    "with green plants softly out of focus in the background, soft golden hour glow, "
    "subtle vignette, cinematic depth of field with the product tack-sharp in the "
    "foreground, tasteful glass jar or matte pouch presentation, minimal props "
    "(a few peanuts, a wooden spoon, a small hessian cloth), earthy amber, cream and "
    "olive green color palette, high-end lifestyle photography, 4k, crisp detail. "
    "IMPORTANT: Preserve the exact LOONEWOLF label design, all wording, logo, badges, "
    "product name and weight exactly as shown in the reference photograph — do not "
    "invent new text and do not change the label."
)

TARGETS = [
    {
        "src": MEDIA_DIR / "classic-smooth-peanut-butter.jpg",
        "out": MEDIA_DIR / "classic-smooth-peanut-butter-ai.jpg",
        "prompt": (
            f"{STYLE_REFERENCE} The product is a glass jar of LOONEWOLF Classic Smooth "
            "Peanut Butter (510 g) with a golden metal lid. Show the jar centered, "
            "slightly rotated to reveal the label, on a rich wooden shelf. In the "
            "background: blurred wooden slats, one or two small potted plants, a "
            "hessian cloth. Foreground props: a small wooden spoon holding smooth "
            "peanut butter, a few whole peanuts scattered. Warm, appetizing, editorial."
        ),
        "session": "classic-smooth-pb-ai",
    },
    {
        "src": MEDIA_DIR / "jaggery-peanuts.jpg",
        "out": MEDIA_DIR / "jaggery-peanuts-ai.jpg",
        "prompt": (
            f"{STYLE_REFERENCE} The product is a matte kraft-paper LOONEWOLF pouch of "
            "'Roasted Peanuts with Jaggery' with the dark label showing peanuts + "
            "jaggery graphic. Show the pouch upright, slightly turned, on a wooden "
            "shelf. In the background: blurred wooden slats and a few softly out-of-"
            "focus terracotta pots with greens. Foreground props: a small ceramic "
            "bowl of jaggery-coated peanuts, a few whole peanuts, a small wooden "
            "spoon. Warm amber/olive palette, cinematic, appetizing, editorial."
        ),
        "session": "jaggery-peanuts-ai",
    },
]


async def restyle(target: dict) -> None:
    src: Path = target["src"]
    out: Path = target["out"]
    if not src.exists():
        print(f"[skip] source not found: {src}")
        return

    with src.open("rb") as f:
        img_b64 = base64.b64encode(f.read()).decode("utf-8")

    api_key = os.getenv("EMERGENT_LLM_KEY")
    chat = LlmChat(
        api_key=api_key,
        session_id=target["session"],
        system_message=(
            "You are a premium product photographer. You restyle amateur product "
            "photos into elegant editorial-quality photographs while faithfully "
            "preserving the product label, wording and branding."
        ),
    ).with_model("gemini", "gemini-3-pro-image-preview").with_params(
        modalities=["image", "text"]
    )

    msg = UserMessage(
        text=target["prompt"],
        file_contents=[ImageContent(img_b64)],
    )

    text, images = await chat.send_message_multimodal_response(msg)
    print(f"[{target['session']}] text: {text[:120] if text else '<none>'}")
    if not images:
        print(f"[{target['session']}] no image returned")
        return
    img = images[0]
    out.write_bytes(base64.b64decode(img["data"]))
    print(f"[{target['session']}] saved -> {out} ({out.stat().st_size // 1024} KB)")


async def main() -> None:
    for target in TARGETS:
        await restyle(target)


if __name__ == "__main__":
    asyncio.run(main())
