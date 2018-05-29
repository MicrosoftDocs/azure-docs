---
title: Computer Vision API cURL quickstart summary | Microsoft Docs
titleSuffix: "Microsoft Cognitive Services"
description: In these quickstarts, you analyze an image, create a thumbnail, and extract printed text using Computer Vision with cURL in Cognitive Services.
services: cognitive-services
author: noellelacharite
manager: nolachar
ms.service: cognitive-services
ms.component: computer-vision
ms.topic: quickstart
ms.date: 05/24/2018
ms.author: nolachar
---
# Quickstart: Summary

These quickstarts provide information and code samples to help you quickly get started using the Computer Vision API with cURL to accomplish the following tasks:

* [Analyze an image](curl-analyze.md)
* [Intelligently generate a thumbnail](curl-thumb.md)
* [Detect and extract printed text from an image](curl-print-text.md)

>[!NOTE]
>The commands given to cURL must be specified without line-breaks and are displayed as such in these quickstarts. The commands are long and require horizontal scrolling of the screen.

The syntax of a cURL command as displayed is as follows:

```json
curl -H "Ocp-Apim-Subscription-Key: <Subscription Key>"
     -H "Content-Type: <media type>"
     "Request URL"
     -d "{\"url\":\"imageURL\"}"
```

Example:

```json
curl -H "Ocp-Apim-Subscription-Key: 0123456789abcdef0123456789abcdef"
     -H "Content-Type: application/json"
     "https://westcentralus.api.cognitive.microsoft.com/vision/v2.0/analyze?visualFeatures=Description"
     -d "{\"url\":\"http://upload.wikimedia.org/wikipedia/commons/3/3c/Shaki_waterfall.jpg\"}"
```
