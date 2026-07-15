G.U.M ENTERPRISES — HOW TO UPDATE YOUR CATALOGUE
====================================================

Everything shown in the "Our Catalogue" section on the homepage
is driven by ONE file:

    /catalogue.json

You do NOT need any coding to add products, videos, or recipes.
Just follow the steps below.


------------------------------------------------------------
STEP 1 — Add your media file (optional)
------------------------------------------------------------

Drop the file into:

    /catalogue/media/   (for videos, recipe photos, product photos)

Example:  /catalogue/media/spiced-peanut-butter.jpg
          /catalogue/media/how-its-made.mp4
          /catalogue/media/recipe-toast.jpg


------------------------------------------------------------
STEP 2 — Open catalogue.json and add an entry
------------------------------------------------------------

There are three lists:  "products", "videos", "recipes".

>>> To add a PRODUCT, add a new block inside "products": [ ... ]

    {
      "title": "My New Product",
      "description": "Short tagline that appears under the title.",
      "image": "/catalogue/media/my-product.jpg",
      "badge": "New",                    (optional: "New" | "Bestseller" | "Soon" | "")
      "order_link": "https://wa.me/916303882238?text=I%20want%20to%20order%20My%20Product"
    }

>>> To add a VIDEO, add a new block inside "videos": [ ... ]

    Option A — an MP4 file you uploaded:
    {
      "title": "How our Peanut Butter is Made",
      "description": "A short behind-the-scenes look.",
      "src": "/catalogue/media/how-its-made.mp4",
      "type": "mp4",
      "poster": "/catalogue/media/thumb.jpg"   (optional preview image)
    }

    Option B — a YouTube video (get the embed URL from YouTube → Share → Embed):
    {
      "title": "Brand Story",
      "description": "Our journey in one minute.",
      "src": "https://www.youtube.com/embed/dQw4w9WgXcQ",
      "type": "youtube",
      "poster": ""
    }

>>> To add a RECIPE, add a new block inside "recipes": [ ... ]

    {
      "title": "Spiced Peanut Butter Smoothie",
      "description": "Creamy, filling, ready in 3 minutes.",
      "image": "/catalogue/media/recipe-smoothie.jpg",
      "time": "3 min",
      "steps": [
        "Add 1 cup milk to a blender.",
        "Add 2 tbsp Spiced Peanut Butter, 1 banana, 1 tsp honey.",
        "Blend until smooth. Serve chilled."
      ]
    }


------------------------------------------------------------
STEP 3 — Save and refresh
------------------------------------------------------------

Save the file. Refresh the website. Your new item appears
automatically at the top of the correct tab.

Tips:
- Keep product photos square-ish for the cleanest look
  (recommended: 1200 x 1200 px, .jpg or .png).
- Keep videos under ~50 MB for fast loading on mobile.
- Commas matter: every block ends with "}" and blocks are
  separated by a "," except the last one.
- If the page doesn't update, hard-refresh (Ctrl+Shift+R) to
  clear the cache.

Need help? Just tell us what you want to add and we'll set
it up for you.
