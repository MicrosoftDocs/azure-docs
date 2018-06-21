---
title: Computer Vision API Go quickstart analyze image | Microsoft Docs
titleSuffix: "Microsoft Cognitive Services"
description: In this quickstart, you analyze an image using Computer Vision with Go in Cognitive Services.
services: cognitive-services
author: noellelacharite
manager: nolachar
ms.service: cognitive-services
ms.component: computer-vision
ms.topic: quickstart
ms.date: 06/21/2018
ms.author: nolachar
---
# Quickstart: Analyze an image with Go

In this quickstart, you analyze an image to extract visual features using Computer Vision.

## Prerequisites

To use Computer Vision, you need a subscription key; see [Obtaining Subscription Keys](../Vision-API-How-to-Topics/HowToSubscribe.md).

## Analyze Image request

With the [Analyze Image method](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa), you can extract visual features based on image content. You can upload an image or specify an image URL and choose which features to return, including:

* A detailed list of tags related to the image content.
* A description of image content in a complete sentence.
* The coordinates, gender, and age of any faces contained in the image.
* The ImageType (clip art or a line drawing).
* The dominant color, the accent color, or whether an image is black & white.
* The category defined in this [taxonomy](../Category-Taxonomy.md).
* Does the image contain adult or sexually suggestive content?

To run the sample, do the following steps:

1. Copy the following code into an editor.
1. Replace `<Subscription Key>` with your valid subscription key.
1. Change the `uriBase` value to the location where you got your subscription keys, if necessary.
1. Optionally, change the `imageUrl` value to the image you want to analyze.
1. Optionally, change the response language (`"language": {"en"}`).
1. Save the file with a `.go` extension.
1. Open a command prompt on a computer with Go installed.
1. Build the file, for example: `go build analyze-image.go`.
1. Run the file, for example: `analyze-image`.

```go

```

## Analyze Image response

A successful response is returned in JSON, for example:

```json

```

## Next steps

Explore the Computer Vision APIs used to analyze an image, detect celebrities and landmarks, create a thumbnail, and extract printed and handwritten text.

> [!div class="nextstepaction"]
> [Explore Computer Vision APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44)
