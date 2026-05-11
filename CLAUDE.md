# Žugić Dental Clinic — Project Rules

## 3D Models
**Always download real 3D models — never procedurally generate them.**
Downloaded models look professional and realistic; generated geometry looks generic.

When a 3D object is needed:
1. Search GitHub, Poly Pizza (poly.pizza), Sketchfab (free/CC), or similar for a `.glb` or `.gltf` file
2. Verify a direct download URL exists and the license is permissive (MIT, CC0, CC-BY)
3. Download and self-host the file — do not hotlink from source repos
4. Use Three.js to render it; apply a custom material if the model's own materials need improvement

## Stack
- Static HTML / CSS / JS — no framework, no bundler
- GSAP 3 + ScrollTrigger (cdnjs CDN)
- Three.js r128 UMD build (jsdelivr CDN) for 3D; GLTFLoader loaded from same CDN
- Google Fonts: Cormorant Garamond (headings) + Inter (body)
- Deployed to GitHub Pages (`gh-pages` branch)

## Mobile
- 3D WebGL is disabled below 768 px — SVG fallback is shown instead
- Always test layout at 375 px, 768 px, and 1280 px widths

## Language
- All visible text must be in **Serbian** (Latin script)
- Do not switch to English in UI copy

## Contact details (verified)
- Phone: 011 783 9034 / 063 107 7654
- Address: Generala Rajevskog 1, Vračar, Beograd
- Hours: Pon–Pet 12:00–19:00
