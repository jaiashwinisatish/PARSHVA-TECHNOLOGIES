# Video Assets for Venture Studio Section

The Venture Studio section requires the following video assets to be placed in the `public/` folder:

## Required Files

1. **venture-studio-video.mp4** - Main background video
2. **venture-studio-poster.jpg** - Fallback poster image

## Video Specifications

### Video File (venture-studio-video.mp4)
- **Format**: MP4 (H.264 codec for maximum compatibility)
- **Resolution**: 1920x1080 (1080p) or higher
- **Aspect Ratio**: 16:9
- **Duration**: 10-30 seconds (looping)
- **Frame Rate**: 24fps or 30fps
- **Bitrate**: 3-5 Mbps (optimized for web)
- **File Size**: Under 5MB (ideally 2-3MB)
- **Audio**: None (video should be silent)

### Poster Image (venture-studio-poster.jpg)
- **Format**: JPEG or WebP
- **Resolution**: 1920x1080 (same as video)
- **Quality**: 80-90% (compressed for web)
- **File Size**: Under 500KB

## Recommended Video Sources

### Free Stock Video Websites
- **Pexels Videos**: https://www.pexels.com/videos/
- **Pixabay Videos**: https://pixabay.com/videos/
- **Coverr**: https://coverr.co/
- **Videvo**: https://www.videvo.net/

### Premium Options
- **Storyblocks**: https://www.storyblocks.com/
- **Shutterstock**: https://www.shutterstock.com/video/
- **Adobe Stock**: https://stock.adobe.com/video

## Search Keywords

Use these keywords to find suitable technology-themed videos:
- "neural network"
- "data visualization"
- "digital particles"
- "abstract technology"
- "futuristic architecture"
- "circuit board"
- "server room"
- "cloud computing"
- "holographic"
- "digital mesh"

## Video Style Guidelines

The video should be:
- **Elegant and minimal**: Avoid flashy or distracting effects
- **Dark or neutral tones**: Works best with the dark gradient overlay
- **Slow and smooth**: Gentle movements, not fast-paced
- **Looping**: Should seamlessly loop without visible cuts
- **Professional**: High-quality, corporate-appropriate

## Conversion and Optimization Tools

### Video Compression
- **Handbrake** (Free): https://handbrake.fr/
- **FFmpeg** (Free, command-line): https://ffmpeg.org/
- **CloudConvert**: https://cloudconvert.com/

### Image Optimization
- **Squoosh** (Free, by Google): https://squoosh.app/
- **TinyJPG**: https://tinyjpg.com/
- **ImageOptim** (Mac): https://imageoptim.com/

## FFmpeg Command Example

```bash
ffmpeg -i input-video.mp4 -c:v libx264 -preset slow -crf 28 -vf "scale=1920:1080" -an venture-studio-video.mp4
```

## Alternative: WebM Format

For better compression, you can also use WebM format. Update the component to support both:

```tsx
<video>
  <source src="/venture-studio-video.webm" type="video/webm" />
  <source src="/venture-studio-video.mp4" type="video/mp4" />
</video>
```

## Testing

After adding the files:
1. Clear your browser cache
2. Refresh the page
3. Check that the video loads and plays smoothly
4. Test on mobile devices
5. Verify the poster image displays while video loads
6. Test with `prefers-reduced-motion` enabled
