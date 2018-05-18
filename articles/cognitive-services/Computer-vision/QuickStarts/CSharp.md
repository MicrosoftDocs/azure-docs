---
title: Computer Vision API C# quickstart | Microsoft Docs
titleSuffix: "Microsoft Cognitive Services"
description: In this quickstart, you analyze an image using Computer Vision with C# in Cognitive Services.
services: cognitive-services
author: noellelacharite
manager: nolachar
ms.service: cognitive-services
ms.component: computer-vision
ms.topic: quickstart
ms.date: 05/10/2018
ms.author: nolachar
---
# Quickstart: Summary

These quickstarts provide information and code samples to help you quickly get started using the Computer Vision API with C# to accomplish the following tasks:

* [Analyze an image](CSharp-analyze.md)
* [Intelligently generate a thumbnail](CSharp-thumb.md)
* [Detect and extract printed text from an image](CSharp-print-text.md)
* [Detect and extract handwritten text from an image](CSharp-hand-text.md)

The code in these samples is similar, which is expected since the majority of the work is setting up the request, and retrieving and displaying the response. The differences appear in the request parameters sent and the response received. These differences are summarized in the following table:

| Quickstart               | Request Parameters                          | Response          |
| ------------------------ | ------------------------------------------- | ----------------  |
| Analyze an image         | visualFeatures=Categories,Description,Color | JSON string       |
| Generate a thumbnail     | width=200&height=150&smartCropping=true     | byte array        |
| Extract printed text     | language=unk&detectOrientation=true         | JSON string       |
| Extract handwritten text | handwriting=true                            | URL, JSON string* |

&ast; Two API calls are required. The first call returns a URL, which is used by the second call to get the text.