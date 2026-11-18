METERTROPHIC CJ — 3D CHARACTER PORTFOLIO (V4 / EIGHT-ANGLE UPDATE)

WHAT CHANGED IN THIS VERSION
- Added all eight generated portrait angles, split into individual transparent PNG files under assets/angles/.
- The fallback character is now an interactive 8-view turntable: drag horizontally, use the arrow buttons, or use the keyboard arrow keys.
- A gentle automatic turntable cycle runs when the portrait is idle (unless reduced motion is enabled).
- The original Three.js GLB loader remains in place for a true rigged character when a rigged model is supplied.
- Facial expression buttons are disabled until a compatible rigged model with facial blendshapes is loaded; they are not fake CSS expressions.

HOW TO RUN
1. Extract the ZIP.
2. Open the folder in VS Code.
3. Run index.html with Live Server.
4. Internet is required for Three.js and Google Fonts CDN resources.

IMPORTANT TECHNICAL DISTINCTION
The eight views improve the portrait reference and let the website show a convincing multi-angle turntable. They are still eight rendered images, not a continuous 3D mesh. They cannot independently deform the face, blink, speak, or move a skeleton. The site supports those capabilities through Three.js once a real rigged GLB with facial morph targets is placed at:
  assets/models/character.glb

For a true character, the GLB needs:
- A humanoid armature / skeleton and animation clips for body movement.
- Head and spine bones for tracking.
- Facial morph targets (blendshapes), ideally ARKit-compatible names such as eyeBlinkLeft, eyeBlinkRight, jawOpen, mouthSmileLeft, mouthSmileRight, browInnerUp, browDownLeft and browDownRight.

The 8 views are included as modeling references for a 3D artist or image-to-3D service. A single generated multi-view sheet does not guarantee exact hidden geometry or a production-ready facial rig.

PROJECT FILES
- index.html, style.css, script.js: portfolio interface.
- character3d.js: Three.js GLB loading, skeleton tracking and facial blendshape controls.
- angle-viewer.js: interactive eight-angle fallback turntable.
- assets/angles/: eight separated portrait views.
- assets/metertrophic-cj.png: original stylized portrait fallback asset.
- assets/models/: add character.glb here when a fully rigged model is ready.

Before publishing, replace placeholder contact email and add real project/music links.
