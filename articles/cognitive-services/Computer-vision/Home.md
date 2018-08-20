---
title: Computer Vision for Azure Cognitive Services | Microsoft Docs 
description: Use advanced algorithms in Computer Vision to help you process images and return information in Azure Cognitive Services. 
services: cognitive-services 
author: noellelacharite
manager: nolachar
ms.service: cognitive-services 
ms.component: computer-vision 
ms.topic: overview
ms.date: 05/25/2018 
ms.author: nolachar
#Customer intent: As a developer, I want to learn more about Computer Vision so that I can add image processing functionality to my application.
---
# What is Computer Vision?

The cloud-based Computer Vision service provides developers with access to advanced algorithms for processing images and returning information. Computer Vision works with popular image formats, and you can either specify an image URL or upload an image to be analyzed. By uploading an image or specifying an image URL, Computer Vision algorithms can analyze the content of an image in different ways based on your inputs and choices, depending on the visual features you're interested in. For example, Computer Vision can determine if an image contains mature content, or find all the faces in an image.

## What can Computer Vision analyze?

Computer Vision can analyze images that meet the following requirements:

- The image must be presented in JPEG, PNG, GIF, or BMP format
- The file size of the image must be less than 4 megabytes (MB)
- The dimensions of the image must be greater than 50 x 50 pixels  
  > For OCR, the dimensions of the image must be between 40 x 40 and 3200 x 3200 pixels, and the image cannot be bigger than 10 megapixels.

## How do I use Computer Vision?

Incorporate Computer Vision into your application, by either using our client libraries to invoke the service, or invoking the REST API directly, to:

- **Tag visual features** in an image, based on more than 2,000 recognizable objects, living beings, scenery, and actions. When tags are ambiguous or not common knowledge, the response provides 'hints' to clarify the meaning of the tag in the context of a known setting. Tagging is not limited to the main subject, such as a person in the foreground, but also includes the setting (indoor or outdoor), furniture, tools, plants, animals, accessories, gadgets etc.
- **Categorize an image** based on a [category taxonomy](Category-Taxonomy.md) with parent/child hereditary hierarchies, as defined in previous versions of the service. Categories can be used alone, or with our new tagging models.  
  > Note: Currently, English is the only supported language for tagging and categorizing images.
- **Describe an image** in human-readable language, using complete sentences. Computer Vision's algorithms generate various descriptions based on the objects identified in the image. The descriptions are each evaluated and a confidence score generated. A list is then returned ordered from highest confidence score to lowest. An example of a bot that uses this technology to generate image captions can be found [here](https://github.com/Microsoft/BotBuilder-Samples/tree/master/CSharp/intelligence-ImageCaption).
- **Detect faces** in an image and provide information about each face, such as the face coordinates, the rectangle for the face, gender, and age. Computer Vision provides a subset of the functionality that can be found in [Face](/azure/cognitive-services/face/), and you can use the Face service for more detailed analysis, such as facial identification and pose detection.
- **Detect image types**, such as whether an image is a line drawing, or rate the likelihood of whether an image is clip art.
- **Detect domain-specific content**, such as celebrities and landmarks, depending on the categorization of an image's content. For example, if an image contains people, Computer Vision can optionally attempt to determine if the people in the image are celebrities by using a domain-specific model supported by the service.
- **Detect the color scheme**, including the dominant and accent colors, of an image. Computer Vision can determine whether an image is black & white or color and, for color images, identify the dominant and accent colors.
- **Detect adult and racy content** in an image, rating the likelihood that the image represents either adult or racy content and generating a confidence score for both. The filter for adult and racy content detection can be set on a sliding scale to accommodate your preferences.
- **Extract text using OCR** from an image into a machine-readable character stream. If needed, OCR corrects the rotation of the recognized text, in degrees, around the horizontal image axis, and provides the frame coordinates of each word. OCR supports 25 languages, and automatically detects the language of extracted text.
- **Recognize printed and handwritten text** from an image. Computer Vision can detect and extract both printed and handwritten text from images of various objects with different surfaces and backgrounds, such as receipts, posters, business cards, letters, and whiteboards.
  > Note: Currently, recognizing printed and handwritten text is currently in preview, and English is the only supported language.
- **Generate a thumbnail** from an image, first generating a high-quality thumbnail and then analyzing the objects within the image. Computer Vision then crops the image to fit the requirements of the 'region of interest' (ROI). The generated thumbnail can be presented using an aspect ratio that is different from the aspect ratio of the original image, depending on your needs.  

## Next steps

Get started with Computer Vision with one of our quickstarts:

- [Analyze an image](/quickstarts/csharp-analyze.md)
- [Extract handwritten text](/quickstarts/csharp-hand-text.md)
- [Generate a thumbnail](/quickstarts/csharp-thumb.md)
