"""
One-off script: generate a cinematic 8-second product showcase clip with
Sora 2 for the LOONEWOLF product line. Style-matched to the AI product
photos (warm wood shelf, terracotta pots, golden hour light, cinematic).

Output: /app/frontend/public/catalogue/media/loonewolf-showcase.mp4
"""

import os
import sys
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath(""))

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

load_dotenv("/app/backend/.env")

PROMPT = (
    "Slow cinematic shot of golden roasted peanuts scattered on a wooden "
    "surface with warm sunlight, shallow depth of field, calm mood, no people."
)

OUTPUT = "/app/frontend/public/catalogue/media/loonewolf-showcase.mp4"
LOG_PATH = "/app/scripts/sora.log"


def main() -> None:
    api_key = os.environ["EMERGENT_LLM_KEY"]
    video_gen = OpenAIVideoGeneration(api_key=api_key)

    print("Requesting Sora 2 video (this can take 2-5 minutes)...")
    video_bytes = video_gen.text_to_video(
        prompt=PROMPT,
        model="sora-2",
        size="1280x720",
        duration=8,
        max_wait_time=900,
    )
    if not video_bytes:
        print("Video generation failed")
        return

    video_gen.save_video(video_bytes, OUTPUT)
    size_mb = os.path.getsize(OUTPUT) / (1024 * 1024)
    print(f"Saved to {OUTPUT} ({size_mb:.2f} MB)")


if __name__ == "__main__":
    main()
