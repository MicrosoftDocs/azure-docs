---
title: What is Computer Vision? - Computer Vision
titleSuffix: Azure Cognitive Services
description: The Computer Vision service provides developers with access to advanced algorithms for processing images and returning information. 
services: cognitive-services 
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services 
ms.subservice: computer-vision 
ms.topic: overview
ms.date: 05/27/2020
ms.author: pafarley
ms.custom: seodec18
#Customer intent: As a developer, I want to evaluate image processing functionality, so that I can determine if it will work for my information extraction or object detection scenarios.
---

# What is Computer Vision?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

Azure's Computer Vision service provides developers with access to advanced algorithms that process images and return information based on the visual features you're interested in. For example, Computer Vision can determine whether an image contains adult content, find specific brands or objects, or find human faces.

You can use Computer Vision in your application through a client library SDK or by calling the REST API directly. This page broadly covers what you can do with Computer Vision.

## Computer Vision for digital asset management

Computer Vision can power many digital asset management (DAM) scenarios. DAM is the business process of organizing, storing, and retrieving rich media assets and managing digital rights and permissions. For example, a company may want to group and identify images based on visible logos, faces, objects, colors, and so on. Or, you might want to automatically [generate captions for images](./Tutorials/storage-lab-tutorial.md) and attach keywords so they're searchable. For an all-in-one DAM solution using Cognitive Services, Azure Cognitive Search, and intelligent reporting, see the [Knowledge Mining Solution Accelerator Guide](https://github.com/Azure-Samples/azure-search-knowledge-mining) on GitHub. For other DAM examples, see the [Computer Vision Solution Templates](https://github.com/Azure-Samples/Cognitive-Services-Vision-Solution-Templates) repository.

## Analyze images for insight

You can analyze images to provide insights about their visual features and characteristics. All of the features in the table below are provided by the [Analyze Image](https://westcentralus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa) API.

| Action | Description |
| ------ | ----------- |
|**[Tag visual features](concept-tagging-images.md)**|Identify and tag visual features in an image, from a set of thousands of recognizable objects, living things, scenery, and actions. When the tags are ambiguous or not common knowledge, the API response provides hints to clarify the context of the tag. Tagging isn't limited to the main subject, such as a person in the foreground, but also includes the setting (indoor or outdoor), furniture, tools, plants, animals, accessories, gadgets, and so on.|
|**[Detect objects](concept-object-detection.md)**| Object detection is similar to tagging, but the API returns the bounding box coordinates for each tag applied. For example, if an image contains a dog, cat and person, the Detect operation will list those objects together with their coordinates in the image. You can use this functionality to process further relationships between the objects in an image. It also lets you know when there are multiple instances of the same tag in an image.|
|**[Detect brands](concept-brand-detection.md)**|Identify commercial brands in images or videos from a database of thousands of global logos. You can use this feature, for example, to discover which brands are most popular on social media or most prevalent in media product placement.|
|**[Categorize an image](concept-categorizing-images.md)**|Identify and categorize an entire image, using a [category taxonomy](Category-Taxonomy.md) with parent/child hereditary hierarchies. Categories can be used alone, or with our new tagging models.<br/>Currently, English is the only supported language for tagging and categorizing images.|
|**[Describe an image](concept-describing-images.md)**|Generate a description of an entire image in human-readable language, using complete sentences. Computer Vision's algorithms generate various descriptions based on the objects identified in the image. The descriptions are each evaluated and a confidence score generated. A list is then returned ordered from highest confidence score to lowest.|
|**[Detect faces](concept-detecting-faces.md)** |Detect faces in an image and provide information about each detected face. Computer Vision returns the coordinates, rectangle, gender, and age for each detected face.<br/>Computer Vision provides a subset of the [Face](/azure/cognitive-services/face/) service functionality. You can use the Face service for more detailed analysis, such as facial identification and pose detection.|
|**[Detect image types](concept-detecting-image-types.md)**|Detect characteristics about an image, such as whether an image is a line drawing or the likelihood of whether an image is clip art.|
|**[Detect domain-specific content](concept-detecting-domain-content.md)**|Use domain models to detect and identify domain-specific content in an image, such as celebrities and landmarks. For example, if an image contains people, Computer Vision can use a domain model for celebrities to determine if the people detected in the image are known celebrities.|
|**[Detect the color scheme](concept-detecting-color-schemes.md)**|Analyze color usage within an image. Computer Vision can determine whether an image is black & white or color and, for color images, identify the dominant and accent colors.|
|**[Generate a thumbnail](concept-generating-thumbnails.md)**|Analyze the contents of an image to generate an appropriate thumbnail for that image. Computer Vision first generates a high-quality thumbnail and then analyzes the objects within the image to determine the *area of interest*. Computer Vision then crops the image to fit the requirements of the area of interest. The generated thumbnail can be presented using an aspect ratio that is different from the aspect ratio of the original image, depending on your needs.|
|**[Get the area of interest](concept-generating-thumbnails.md#area-of-interest)**|Analyze the contents of an image to return the coordinates of the *area of interest*. Instead of cropping the image and generating a thumbnail, Computer Vision returns the bounding box coordinates of the region, so the calling application can modify the original image as desired.|

## Extract text from images

You can use the Computer Vision [Read](concept-recognizing-text.md#read-api) API to extract printed and handwritten text from images into a machine-readable character stream. The Read API uses the latest models and works with text on a variety of surfaces and backgrounds, such as receipts, posters, business cards, letters, and whiteboards. It currently works for seven different languages (see [Language support](./language-support.md)).

You can also use the [optical character recognition (OCR)](concept-recognizing-text.md#ocr-optical-character-recognition-api) API to extract printed text in several languages. If needed, OCR corrects the rotation of the recognized text and provides the frame coordinates of each word. OCR supports 25 languages and automatically detects the language of the recognized text.

## Moderate content in images

You can use Computer Vision to [detect adult content](concept-detecting-adult-content.md) in an image and return confidence scores for different classifications. The threshold for flagging content can be set on a sliding scale to accommodate your preferences.

## Use containers

[Use Computer Vision containers](computer-vision-how-to-install-containers.md) to recognize printed and handwritten text locally by installing a standardized Docker container closer to your data.

## Image requirements

Computer Vision can analyze images that meet the following requirements:

- The image must be presented in JPEG, PNG, GIF, or BMP format
- The file size of the image must be less than 4 megabytes (MB)
- The dimensions of the image must be greater than 50 x 50 pixels
  - For the Read API, the dimensions of the image must be between 50 x 50 and 10000 x 10000 pixels.

## Data privacy and security

As with all of the Cognitive Services, developers using the Computer Vision service should be aware of Microsoft's policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

Get started with Computer Vision by following a quickstart guide:

- [Quickstart: Computer Vision .NET client library](./quickstarts-sdk/client-library.md?pivots=programming-language-csharp)
- [Quickstart: Computer Vision Python client library](./quickstarts-sdk/client-library.md?pivots=programming-language-python)
- [Quickstart: Computer Vision Java client library](./quickstarts-sdk/client-library.md?pivots=programming-language-java)
