---
title: Image Moderator API for Content Moderator | Microsoft Docs
description: Use the Image Moderator API to moderate inappropriate images and implement optical character recognition and face detection.
services: cognitive-services
author: sanjeev3
manager: mikemcca

ms.service: cognitive-services
ms.technology: content-moderator
ms.topic: article
ms.date: 11/21/2016
ms.author: sajagtap
---

# Image Moderation API #

Use Content Moderator’s image moderation API [(see API reference)](api-reference.md "Content Moderator API Reference") to moderate images for adult and racy content. Match against custom and shared lists and implement optical character recognition (OCR) and face detection.

## Evaluating for adult and racy content ##

The Content Moderator API’s **Evaluate** operation returns a classification scores (between 0 and 1) and Boolean data (true or false) to indicate whether the image contains adult or racy content. For example, when you call the API with your image (file or URL), you get back information that includes:

- The match score (between 0 and 1)
- A Boolean value (true or false) based on default thresholds and actual score

## Detecting text with Optical Character Recognition (OCR) ##

The Optical Character Recognition (**OCR**) capability detects text content in an image and extracts it for search and numerous other purposes. If you do not specify a language, the detection defaults to English.

A response includes:

- The original text
- The detected text elements with their confidence scores

## Detecting faces ##

Detecting faces is important in the context of content moderation because you may not want your users to upload any personally identifiable information (PII) and risk their privacy and your brand. Using the Detect faces operation, you can detect the probability of finding faces and their count in each image.

A response includes:

- Faces count
- List of locations of faces detected

## Matching against your custom list ##

In many online communities, after users upload images or other type of content, the offensive may get shared multiple times over the following days, weeks, and months. The costs of repeatedly scanning and filtering out the same image or even slightly modified versions of the image from multiple places can be expensive and error-prone.

Instead of moderating the same image multiple times, you may want to add the offensive images to your custom list of blocked content. That way, your content moderation system can compare incoming images against your custom list of images and stop any further processing right away.

The **Match** operation allows fuzzy matching of incoming images against any of your custom lists, created and managed using the List operations.

If found, the operation returns the identifier and the moderation tags of the matched image. The information includes:

- Match score (between 0 & 1)
- Matched image
- Image tags (assigned during a previous moderation)
- Image labels

## Creating and managing your custom lists ##

As mentioned previously, if the images are already tagged, you would match repeated content against pre-approved or pre-rejected images, without having to go through the moderation-and-review workflow.

The Content Moderator provides a complete list management API with operations for creating and deleting lists, and for adding and removing images from those lists.

A typical sequence of operations would be to:

1. Create a list.
1. Add images to your list.
1. Match images against the ones in the list.
1. Delete image from the list.
1. Delete the list.
