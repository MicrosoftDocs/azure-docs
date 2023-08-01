---
title: Color scheme detection - Azure AI Vision
titleSuffix: Azure AI services
description: Concepts related to detecting the color scheme in images using the Azure AI Vision API.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: conceptual
ms.date: 11/17/2021
ms.author: pafarley
ms.custom: seodec18
---

# Color schemes detection

Azure AI Vision analyzes the colors in an image to provide three different attributes: the dominant foreground color, the dominant background color, and the larger set of dominant colors in the image. The set of possible returned colors is: black, blue, brown, gray, green, orange, pink, purple, red, teal, white, and yellow.

Azure AI Vision also extracts an accent color, which represents the most vibrant color in the image, based on a combination of the dominant color set and saturation. The accent color is returned as a hexadecimal HTML color code (for example, `#00CC00`).

Azure AI Vision also returns a boolean value indicating whether the image is a black-and-white image.

## Color scheme detection examples

The following example illustrates the JSON response returned by Azure AI Vision when it detects the color scheme of an image. 

> [!NOTE]
> In this case, the example image is not a black and white image, but the dominant foreground and background colors are black, and the dominant colors for the image as a whole are black and white.

![Outdoor Mountain at sunset, with a person's silhouette](./Images/mountain_vista.png)

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

The following table shows the returned foreground, background, and image colors for each sample image.

| Image | Dominant colors |
|-------|-----------------|
|![A white flower with a green background](./Images/flower.png)| Foreground: Black<br/>Background: White<br/>Colors: Black, White, Green|
![A train running through a station](./Images/train_station.png) | Foreground: Black<br/>Background: Black<br/>Colors: Black |

### Accent color examples

 The following table shows the returned accent color, as a hexadecimal HTML color value, for each example image.

| Image | Accent color |
|-------|--------------|
|![A person standing on a mountain rock at sunset](./Images/mountain_vista.png) | #BB6D10 |
|![A white flower with a green background](./Images/flower.png) | #C6A205 |
|![A train running through a station](./Images/train_station.png) | #474A84 |

### Black and white detection examples

The following table shows Azure AI Vision's black and white evaluation in the sample images.

| Image | Black & white? |
|-------|----------------|
|![A black and white picture of buildings in Manhattan](./Images/bw_buildings.png) | true |
|![A blue house and the front yard](./Images/house_yard.png) | false |

## Use the API

The color scheme detection feature is part of the [Analyze Image](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f21b) API. You can call this API through a native SDK or through REST calls. Include `Color` in the **visualFeatures** query parameter. Then, when you get the full JSON response, simply parse the string for the contents of the `"color"` section.

* [Quickstart: Vision REST API or client libraries](./quickstarts-sdk/image-analysis-client-library.md?pivots=programming-language-csharp)
