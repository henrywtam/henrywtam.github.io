# slackr

# Instructions
1. Visit https://henrywtam.github.io/
2. Admire cute puppies
3. Select a photo for a lightbox view
4. Smile :)

# Basics
- Access flickr API
- Displays grid of photo thumbnails
- When photo thumbnail is clicked, photo is displayed in lightbox view
- Can move to previous slide, next slide, or close out during lightbox view (includes keyboard shortcuts)

# Next steps for slackr v2
- Product Feature: 
  - Add search capabilities for terms and return results
  - Look into other flickr APIs to return photos
  - Drag-and-drop (maybe)
- UI/UX:
  - Improve the background, fonts, and spinner
  - Mask with opacity < 1, modal content with opacity (similar to Facebook's design, which I like)
  - Transitions when moving in slide, like fade in/out (maybe)
- Codebase Architecture
  - Backend, which can hide the API_key (security)
  - Potential classes for album and slideshow (and maybe API calls)
  - Creating general component for modal + mask, and using it for slideshow