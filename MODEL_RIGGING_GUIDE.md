# Getting the character to a true facially-rigged 3D model

## Reference material needed
A single selfie is enough to start an AI 3D approximation, but not enough to reconstruct the exact back/side of the head or body. For a closer likeness, capture:
- straight-on neutral face, evenly lit;
- left and right 45-degree face views;
- left and right profile views;
- full-body front, side and back views in a relaxed A-pose, with arms slightly away from the torso;
- optional expression references: smile, raised brows, closed eyes, open mouth.

Use the same haircut, earrings and clothing where possible. Avoid beauty filters, portrait blur and harsh flash.

## Body model and rig
Image-to-3D tools can create a textured mesh. Their auto-rigging can add a body skeleton and motion clips. Examples:
- Meshy image-to-3D + rigging cookbook: https://www.meshy.ai/developers/cookbook/recipes/rig-3d-character/
- Tripo auto-rig docs: https://developers.tripo3d.com/en/docs/animations-rig

These are body-rig workflows. They do not promise facial blendshapes.

## Facial rig requirement
In Blender, create shape keys (morph targets) on the head mesh and test them individually. Minimum set:
- eyeBlinkLeft, eyeBlinkRight
- jawOpen
- mouthSmileLeft, mouthSmileRight
- browInnerUp, browDownLeft, browDownRight
- mouthFrownLeft, mouthFrownRight
- mouthPucker or mouthFunnel

For lip-sync, add viseme shapes (AA, EE, IH, OH, OU, FV, MBP, etc.). Export as GLB with morph targets and the body armature included. The web viewer maps these to the expression buttons and blink animation.

## Final integration
Export the final file as `assets/models/character.glb`. Test body animation and each shape key in Blender before using it on the website. A model that has bones but no facial shape keys will move its body but cannot independently animate facial expressions.
