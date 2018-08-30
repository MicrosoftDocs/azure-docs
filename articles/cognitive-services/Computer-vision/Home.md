---
title: Computer Vision for Azure Cognitive Services | Microsoft Docs 
description: Use advanced algorithms in Computer Vision to help you process images and return information in Azure Cognitive Services. 
services: cognitive-services 
author: noellelacharite
manager: nolachar
ms.service: cognitive-services 
ms.component: computer-vision 
ms.topic: overview
ms.date: 08/22/2018 
ms.author: v-deken
#Customer intent: As a developer, I want to evaluate image processing functionality, so that I can determine if it will work for my information extraction or object detection scenarios.
---
# What is Computer Vision?

The cloud-based Computer Vision service provides developers with access to advanced algorithms for processing images and returning information. Computer Vision works with popular image formats, such as JPEG and PNG. To analyze an image, you can either upload an image or specify an image URL. Computer Vision algorithms can analyze the content of an image in different ways, depending on the visual features you're interested in. For example, Computer Vision can determine if an image contains adult or racy content, or find all the faces in an image.

You can use Computer Vision in your application, by either using our [client libraries](quickstarts-sdk/csharp-analyze-sdk.md) to invoke the service, or invoking the [REST API](vision-api-how-to-topics/howtocallvisionapi.md) directly, to:

- [Analyze images for insight](#analyzing-images-for-insight)
- [Extract text from images](#extracting-text-from-images)
- [Moderate content in images](#moderating-content-in-images)

## Analyzing images for insight

You can analyze images using Computer Vision to detect and provide insight about the visual features and characteristics of your images. You can either upload the contents of an image to analyze local images, or you can specify the URL of an image to analyze remote images.

Computer Vision can do the following actions when analyzing an image:

| Action | Description |
| ------ | ----------- |
|**[Tag visual features](quickstarts/csharp-analyze.md)**|Identify and tag visual features in an image, based on more than 2,000 recognizable objects, living beings, scenery, and actions. When tags are ambiguous or not common knowledge, the response provides 'hints' to clarify the meaning of the tag in the context of a known setting. Tagging isn't limited to the main subject, such as a person in the foreground, but also includes the setting (indoor or outdoor), furniture, tools, plants, animals, accessories, gadgets, and so on.|
|**[Categorize an image](quickstarts/csharp-analyze.md)**|Identify and categorize an entire image, using a [category taxonomy](Category-Taxonomy.md) with parent/child hereditary hierarchies. Categories can be used alone, or with our new tagging models.<br/>Currently, English is the only supported language for tagging and categorizing images.|
|**[Describe an image](quickstarts/csharp-analyze.md)**|Generate a description of an entire image in human-readable language, using complete sentences. Computer Vision's algorithms generate various descriptions based on the objects identified in the image. The descriptions are each evaluated and a confidence score generated. A list is then returned ordered from highest confidence score to lowest.<br/>An example of a bot that uses this technology to generate image captions can be found [on GitHub](https://github.com/Microsoft/BotBuilder-Samples/tree/master/CSharp/intelligence-ImageCaption).|
|**[Detect faces](quickstarts/csharp-analyze.md)** |Detect faces in an image and provide information about each detected face. Computer Vision returns the coordinates, rectangle, gender, and age for each detected face.<br/>Computer Vision provides a subset of the functionality that can be found in [Face](/azure/cognitive-services/face/), and you can use the Face service for more detailed analysis, such as facial identification and pose detection.|
|**[Detect image types](quickstarts/csharp-analyze.md)**|Detect characteristics about an image, such as whether an image is a line drawing or the likelihood of whether an image is clip art.|
|**[Detect domain-specific content](quickstarts/python-domain.md)**|Use domain models to detect and identify domain-specific content in an image, such as celebrities and landmarks. For example, if an image contains people, Computer Vision can use a domain model for celebrities included with the service to determine if the people detected in the image match known celebrities.|
|**[Detect the color scheme](quickstarts/csharp-analyze.md)**|Analyze color usage within an image. Computer Vision can determine whether an image is black & white or color and, for color images, identify the dominant and accent colors.|
|**[Generate a thumbnail](quickstarts/csharp-thumb.md)**|Analyze the contents of an image to generate an appropriate thumbnail for that image. Computer Vision first generates a high-quality thumbnail and then analyzes the objects within the image to determine the *region of interest* (ROI). Computer Vision then crops the image to fit the requirements of the region of interest. The generated thumbnail can be presented using an aspect ratio that is different from the aspect ratio of the original image, depending on your needs.|

## Extracting text from images

You can use Computer Vision to [extract text using OCR](quickstarts/csharp-print-text.md) from an image into a machine-readable character stream. If needed, OCR corrects the rotation of the recognized text, in degrees, around the horizontal image axis, and provides the frame coordinates of each word. OCR supports 25 languages, and automatically detects the language of extracted text.

You can also [recognize printed and handwritten text](quickstarts/csharp-hand-text.md) from an image. Computer Vision can detect and extract both printed and handwritten text from images of various objects with different surfaces and backgrounds, such as receipts, posters, business cards, letters, and whiteboards. Currently, recognizing printed and handwritten text is in preview, and English is the only supported language.  

## Moderating content in images

You can use Computer Vision to [detect adult and racy content](quickstarts/csharp-analyze.md) in an image, rating the likelihood that the image contains either adult or racy content and generating a confidence score for both. The filter for adult and racy content detection can be set on a sliding scale to accommodate your preferences.

## Image requirements

Computer Vision can analyze images that meet the following requirements:

- The image must be presented in JPEG, PNG, GIF, or BMP format
- The file size of the image must be less than 4 megabytes (MB)
- The dimensions of the image must be greater than 50 x 50 pixels  
  For OCR, the dimensions of the image must be between 40 x 40 and 3200 x 3200 pixels, and the image can't be bigger than 10 megapixels.

## Next steps

Get started with Computer Vision with one of our quickstarts:

- [Analyze an image](/quickstarts-sdk/csharp-analyze-sdk.md)
- [Extract handwritten text](/quickstarts-sdk/csharp-hand-text-sdk.md)
- [Generate a thumbnail](/quickstarts-sdk/csharp-thumb-sdk.md)
