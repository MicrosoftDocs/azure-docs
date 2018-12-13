---
title: Detecting color schemes - Computer Vision
titleSuffix: Azure Cognitive Services
description: Concepts related to detecting the color scheme in images using the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: conceptual
ms.date: 08/29/2018
ms.author: pafarley
---

# Detecting color schemes

Computer Vision extracts colors from an image. The colors are then analyzed in three different contexts: the dominant foreground color, the dominant background color, and the dominant colors for the image as a whole. They are grouped into 12 dominant accent colors. Those accent colors are black, blue, brown, gray, green, orange, pink, purple, red, teal, white, and yellow. Computer Vision analyzes the colors extracted from an image to return an accent color that represents the most vibrant color for the image to viewers, through a combination of dominant colors and saturation. Depending on the colors in an image, simple black and white or accent colors may be returned in hexadecimal color codes. Computer Vision also returns a boolean value that indicates whether an image is black & white.

## Color scheme detection examples

The following example illustrates the JSON response returned by Computer Vision when detecting the color scheme of the example image. In this case, the example image is not a black & white image, but the dominant foreground and background colors are black, and the dominant colors for the image as a whole are black and white.

![Outdoor Mountain](./Images/mountain_vista.png)

```json
{
    "color": {
        "dominantColorForeground": "Black",
        "dominantColorBackground": "Black",
        "dominantColors": ["Black", "White"],
        "accentColor": "BB6D10",
        "isBwImg": false
    },
    "requestId": "0dc394bf-db50-4871-bdcc-13707d9405ea",
    "metadata": {
        "height": 202,
        "width": 300,
        "format": "Jpeg"
    }
}
```

### Dominant color examples

The following table describes the dominant foreground, background, and image colors for each example image as returned by Computer Vision.

| Image | Dominant colors |
|-------|-----------------|
|![Vision Analyze Flower](./Images/flower.png)| Foreground: Black<br/>Background: White<br/>Colors: Black, White, Green|
![Vision Analyze Train Station](./Images/train_station.png) | Foreground: Black<br/>Background: Black<br/>Colors: Black |

### Accent color examples

 The following table describes the accent color, as a hexadecimal HTML color value, for each example image as returned by Computer Vision.

| Image | Accent color |
|-------|--------------|
|![Outdoor Mountain](./Images/mountain_vista.png) | #BB6D10 |
|![Vision Analyze Flower](./Images/flower.png) | #C6A205 |
|![Vision Analyze Train Station](./Images/train_station.png) | #474A84 |

### Black & white detection examples

The following table indicates whether each example image is black & white, as returned by Computer Vision.

| Image | Black & white? |
|-------|----------------|
|![Vision Analyze Building](./Images/bw_buildings.png) | true |
|![Vision Analyze House Yard](./Images/house_yard.png) | false |

## Next steps

Learn concepts about [detecting image types](concept-detecting-image-types.md).