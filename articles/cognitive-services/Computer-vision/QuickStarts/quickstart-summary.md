---
title: Computer Vision Quickstart Summary
titleSuffix: "Azure Cognitive Services"
description: In these quickstarts, you analyze an image, create a thumbnail, and extract printed and handwritten text using the Computer Vision API.
services: cognitive-services
author: PatrickFarley
manager: cgronlun

ms.service: cognitive-services
ms.component: computer-vision
ms.topic: quickstart
ms.date: 08/28/2018
ms.author: pafarley
---
# Quickstart: Summary

These quickstarts provide information and code samples to help you quickly get started using the Computer Vision service.

The samples make direct HTTP calls to the Computer Vision API. See the *SDK Quickstarts* section for samples using the Computer Vision client libraries, which provide convenience methods that wrap the HTTP calls.

To rapidly experiment with the Computer Vision APIs, try the [Open API testing console](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa/console).

You can use the Computer Vision service to accomplish the following tasks:

* Analyze a remote image
* Analyze a local image
* Detect celebrities and landmarks (domain models)
* Intelligently generate a thumbnail
* Detect and extract printed text (OCR) from an image
* Detect and extract handwritten text from an image

The code in each sample is similar. However, they highlight different Computer Vision features along with different techniques for exchanging data with the service, such as:

* _Generate a thumbnail_ returns an image as a byte array in the body of the response.
* _Analyze a local image_ requires the image to be included in the request as a byte array.
* _Extract handwritten text_ requires two calls to retrieve the text.

## Summary

| Quickstart               | Request Parameters                          | Response          |
| ------------------------ | ------------------------------------------- | ----------------  |
| Analyze a remote image   | visualFeatures=Categories,Description,Color | JSON string       |
| Analyze a local image    | data=image_data (byte array)                | JSON string       |
| Detect celebrities       | model=celebrities                           | JSON string       |
| Generate a thumbnail     | width=200&height=150&smartCropping=true     | byte array        |
| Extract printed text     | language=unk&detectOrientation=true         | JSON string       |
| Extract handwritten text | handwriting=true                            | URL, JSON string  |

## Next steps

Explore the Computer Vision APIs used to analyze an image, detect celebrities and landmarks, create a thumbnail, and extract printed and handwritten text.

> [!div class="nextstepaction"]
> [Explore Computer Vision APIs](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44)
