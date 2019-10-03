---
title: Generate a thumbnail sprite with Azure Media Services | Microsoft Docs
description: This topic shows how to generate a thumbnail sprite with Azure Media Services.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.date: 03/14/2019
ms.author: juliako
---

# Generate a thumbnail sprite  

You can use Media Encoder Standard to generate a thumbnail sprite, which is a JPEG file that contains multiple small resolution thumbnails stitched together into a single (large) image, together with a VTT file. This VTT file specifies the time range in the input video that each thumbnail represents, together with the size and coordinates of that thumbnail within the large JPEG file. Video players use the VTT file and sprite image to show a 'visual' seekbar, providing a viewer with visual feedback when scrubbing back and forward along the video timeline.

In order to use Media Encoder Standard to generate Thumbnail Sprite, the preset:

1. Must use JPG thumbnail image format
2. Must specify Start/Step/Range values as either timestamps, or % values (and not frame counts) 
    
    1. It is okay to mix timestamps and % values

3. Must have the SpriteColumn value, as a non-negative number greater than or equal to 1

    1. If SpriteColumn is set to M >= 1, the output image is a rectangle with M columns. If the number of thumbnails generated via #2 is not an exact multiple of M, the last row will be incomplete, and left with black pixels.  

Here is an example:

```json
{
    "Version": 1.0,
    "Codecs": [
    {
      "Start": "00:00:01",
      "Type": "JpgImage",
      "Step": "5%",
      "Range": "100%",
      "JpgLayers": [
        {
          "Type": "JpgLayer",
          "Width": "10%",
          "Height": "10%",
          "Quality": 90
        }
      ],
      "SpriteColumn": 10
    }
      ],
      "Outputs": [
        {
          "FileName": "{Basename}_{Index}{Extension}",
          "Format": {
            "Type": "JpgFormat"
          }
        }
   ]
}
```

## Known Issues

1.	It's not possible to generate a sprite image with a single row of images (SpriteColumn = 1 results in an image with a single column).
2.	Chunking of the sprite images into moderately sized JPEG images is not supported yet. Hence, care must be taken to limit the number of thumbnails and their size, so that the resultant stitched Thumbnail Sprite is around 8M pixels or less.
3.	Azure Media Player supports sprites on Microsoft Edge, Chrome, and Firefox browsers. VTT parsing is not supported in IE11.

## Next steps

[Encode content](media-services-encode-asset.md)
