---
title: Image Moderation API in Azure Content Moderator | Microsoft Docs
description: Use the Image Moderation API to moderate inappropriate images
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 08/06/2017
ms.author: sajagtap
---

# Image Moderation API overview

Use Content Moderator’s Image Moderation API [(see API reference)](api-reference.md "Content Moderator API Reference") to moderate images for adult and racy content. Scan images for text content and extract that text, and detect faces. You can match images against custom and shared lists, and block frequently-posted offensive content.

## Evaluating for adult and racy content

The Image Moderation API’s **Evaluate** operation returns a confidence score (between 0 and 1) and Boolean data (true or false) to predict whether the image contains potential adult or racy content. When you call the API with your image (file or URL), the returned information includes this information:
- The adult or racy confidence score (between 0 and 1).
- A Boolean value (true or false) based on default thresholds.

## Detecting text with Optical Character Recognition (OCR)

The **Optical Character Recognition (OCR)** operation predicts the presence of text content in an image and extracts it for text moderation, among other uses. You can specify the language. If you do not specify a language, the detection defaults to English.

The response includes this information:
- The original text.
- The detected text elements with their confidence scores.


## Detecting faces

Detecting faces is important because you may not want your users to upload any personally identifiable information (PII) and risk their privacy and your brand. Using the Detect faces operation, you can detect potential faces and the number of potential faces in each image.

A response includes this information:

- Faces count
- List of locations of faces detected

## Matching against your custom list

In many online communities, after users upload images or other type of content, offensive items may get shared multiple times over the following days, weeks, and months. The costs of repeatedly scanning and filtering out the same image or even slightly modified versions of the image from multiple places can be expensive and error-prone.

Instead of moderating the same image multiple times, you can add the offensive images to your custom list of blocked content. That way, your content moderation system can compare incoming images against your custom list of images and stop any further processing right away.

The Match operation allows fuzzy matching of incoming images against any of your custom lists, created and managed using the List operations.

If a match is found, the operation returns the identifier and the moderation tags of the matched image. The response includes this information:

- Match score (between 0 and 1)
- Matched image
- Image tags (assigned during a previous moderation)
- Image labels

## Creating and managing your custom lists

As mentioned previously, if the images are already tagged, you would match repeated content against pre-approved or pre-rejected images, without having to go through the moderation-and-review workflow.
The Content Moderator provides a complete [Image List Management API](try-image-list-api.md) with operations for creating and deleting lists, and for adding and removing images from those lists.

## Next steps

Test drive the Image Moderation API by using the [Try Image Moderation API](try-image-api.md) article.
