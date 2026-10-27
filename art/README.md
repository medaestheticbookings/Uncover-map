# Character artwork

The characters in the game are currently drawn as vectors in code. They are a
stand-in. Real artwork replaces them here, one file at a time.

## How to add a character

1. Make a **square** image, **512 × 512**, with a **transparent background**.
2. Save it as WebP (or PNG, then convert) named exactly after the id in the
   left column below — `knight.webp`, `dragon.webp` — and put it in this folder.
3. Run `node tools/art-manifest.mjs` from the repo root.
4. Commit and push. The game picks it up on the next load.

Anything not in this folder keeps its vector, so the set can be replaced a few
at a time rather than all at once.

## What the image has to do

It is shown at about 44 px on a phone, on top of a map, over fog that is nearly
black. So:

- The figure fills the frame top to bottom, standing, facing the viewer.
- Keep a little empty margin so nothing is clipped by the circular marker.
- Strong silhouette and a light rim, or it disappears against dark fog.
- No ground, no scenery, no shadow baked in — the game adds its own.
- No text, no logo, no frame.

## The shared style line

Put this in front of every prompt so the nineteen look like one set:

> Full-body character illustration, medieval fantasy, standing facing forward,
> centered, transparent background, no ground or scenery, semi-realistic
> painterly game art with clean readable silhouette and soft rim light,
> rich saturated colour, detailed cloth and metal, square 1:1 composition,
> high detail, no text, no watermark, no frame.

## The nineteen

| file | level | prompt (after the style line) |
| --- | --- | --- |
| `walk.webp` | 1 | A young village man in a simple linen tunic, leather belt, worn boots, open friendly face, walking stick in one hand. |
| `woman.webp` | 1 | A young village woman in a long woollen dress and apron, braided hair, a shawl over the shoulders, calm confident expression. |
| `slim.webp` | 3 | A lean scout in a dark green hooded cloak, light leather armour, a map case at the hip, alert watchful face half-shadowed by the hood. |
| `athletic.webp` | 5 | A ranger in forest-green leathers with a longbow in hand and a quiver of arrows on the back, bracers, hood down, weathered face. |
| `strong.webp` | 8 | A broad-shouldered blacksmith in a scorched leather apron over bare arms, heavy hammer resting on one shoulder, soot on the forearms. |
| `fat.webp` | 8 | A cheerful heavy-set innkeeper in a stained white shirt and brown waistcoat, a tankard in one hand, rosy face, warm smile. |
| `bard.webp` | 12 | A travelling bard in a plum velvet doublet and feathered cap, a lute held across the body, an easy theatrical grin. |
| `squire.webp` | 16 | A young squire in a padded gambeson and half-plate, a kite shield bearing a simple device, a sword at the belt, eager earnest face. |
| `monk.webp` | 20 | An elderly monk in a coarse brown habit with a rope belt, hood back, long white beard, a wooden staff, serene expression. |
| `huntsman.webp` | 25 | A huntsman in fur-trimmed leathers and a green cap, a boar spear in hand, a hunting horn at the hip, weather-beaten face. |
| `knight.webp` | 30 | A knight in full polished steel plate, visor raised to show the face, a longsword point-down in both hands, a blue surcoat. |
| `wizard.webp` | 35 | A wizard in deep violet robes embroidered with silver stars, a tall pointed hat, a gnarled staff topped with a glowing stone, long grey beard. |
| `wolf.webp` | 40 | A large dire wolf standing in profile with the head turned to the viewer, thick grey-black fur, amber eyes, powerful shoulders, bared teeth. |
| `paladin.webp` | 45 | A paladin in gilded white-and-gold plate armour, a winged helm, a glowing greatsword held upright, a faint halo of warm light. |
| `assassin.webp` | 50 | An assassin in matte black layered cloth, face masked below the eyes, twin daggers reversed in the hands, lithe crouched readiness. |
| `horse.webp` | 55 | An armoured rider seated on a chestnut warhorse in barding, lance held upright, the horse in a steady walk, seen from the side-front. |
| `dragon.webp` | 65 | A young wyvern-built dragon standing with wings half-spread, emerald scales with a bronze underbelly, long neck, golden slit eyes, smoke at the nostrils. |
| `dragonrider.webp` | 80 | An armoured rider seated on the neck of a large green dragon, wings spread wide, reins in one hand and a spear in the other, dramatic and heroic. |
| `unicorn.webp` | 95 | A white unicorn with a long spiral pearl horn, flowing silver mane and tail, faint luminous glow, standing proud. |

## A note on colour

The colour swatches in the game tint the vector characters. A drawn image is
not tinted — it keeps the colours it was painted with. That is deliberate: real
artwork should not be recoloured by a filter. The swatch still sets the colour
of everything else that is yours.
