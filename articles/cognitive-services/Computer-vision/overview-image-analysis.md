---
title: What is Image Analysis?
titleSuffix: Azure Cognitive Services
description: The Image Analysis service uses pre-trained AI models to extract many different visual features from images. 
services: cognitive-services 
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services 
ms.subservice: computer-vision 
ms.topic: overview
ms.date: 03/30/2021
ms.author: pafarley
keywords: computer vision, computer vision applications, computer vision service
---

# What is Image Analysis?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

The Computer Vision Image Analysis service can extract a wide variety of visual features from your images. For example, it can determine whether an image contains adult content, find specific brands or objects, or find human faces.

You can use Image Analysis through a client library SDK or by calling the [REST API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v2-ga/operations/5d986960601faab4bf452005) directly. Follow the [quickstart](quickstarts-sdk/image-analysis-client-library.md) to get started.

This documentation contains the following types of articles:
* The [quickstarts](./quickstarts-sdk/image-analysis-client-library.md) are step-by-step instructions that let you make calls to the service and get results in a short period of time. 
* The [how-to guides](./Vision-API-How-to-Topics/HowToCallVisionAPI.md) contain instructions for using the service in more specific or customized ways.
* The [conceptual articles](concept-tagging-images.md) provide in-depth explanations of the service's functionality and features.
* The [tutorials](./tutorials/storage-lab-tutorial.md) are longer guides that show you how to use this service as a component in broader business solutions.

## Image Analysis features

You can analyze images to provide insights about their visual features and characteristics. All of the features in the list below are provided by the [Analyze Image](https://westcentralus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2-ga/operations/56f91f2e778daf14a499f21b) API. Follow a [quickstart](./quickstarts-sdk/image-analysis-client-library.md) to get started.


### Tag visual features

Identify and tag visual features in an image, from a set of thousands of recognizable objects, living things, scenery, and actions. When the tags are ambiguous or not common knowledge, the API response provides hints to clarify the context of the tag. Tagging isn't limited to the main subject, such as a person in the foreground, but also includes the setting (indoor or outdoor), furniture, tools, plants, animals, accessories, gadgets, and so on. [Tag visual features](concept-tagging-images.md)

### Detect objects

Object detection is similar to tagging, but the API returns the bounding box coordinates for each tag applied. For example, if an image contains a dog, cat and person, the Detect operation will list those objects together with their coordinates in the image. You can use this functionality to process further relationships between the objects in an image. It also lets you know when there are multiple instances of the same tag in an image. [Detect objects](concept-object-detection.md)

### Detect brands

Identify commercial brands in images or videos from a database of thousands of global logos. You can use this feature, for example, to discover which brands are most popular on social media or most prevalent in media product placement. [Detect brands](concept-brand-detection.md)

### Categorize an image

Identify and categorize an entire image, using a [category taxonomy](Category-Taxonomy.md) with parent/child hereditary hierarchies. Categories can be used alone, or with our new tagging models.<br/>Currently, English is the only supported language for tagging and categorizing images. [Categorize an image](concept-categorizing-images.md)

### Describe an image

Generate a description of an entire image in human-readable language, using complete sentences. Computer Vision's algorithms generate various descriptions based on the objects identified in the image. The descriptions are each evaluated and a confidence score generated. A list is then returned ordered from highest confidence score to lowest. [Describe an image](concept-describing-images.md)

### Detect faces

Detect faces in an image and provide information about each detected face. Computer Vision returns the coordinates, rectangle, gender, and age for each detected face.<br/>Computer Vision provides a subset of the [Face](../face/index.yml) service functionality. You can use the Face service for more detailed analysis, such as facial identification and pose detection. [Detect faces](concept-detecting-faces.md)

### Detect image types

Detect characteristics about an image, such as whether an image is a line drawing or the likelihood of whether an image is clip art. [Detect image types](concept-detecting-image-types.md)

### Detect domain-specific content

Use domain models to detect and identify domain-specific content in an image, such as celebrities and landmarks. For example, if an image contains people, Computer Vision can use a domain model for celebrities to determine if the people detected in the image are known celebrities. [Detect domain-specific content](concept-detecting-domain-content.md)

### Detect the color scheme

Analyze color usage within an image. Computer Vision can determine whether an image is black & white or color and, for color images, identify the dominant and accent colors. [Detect the color scheme](concept-detecting-color-schemes.md)

### Generate a thumbnail

Analyze the contents of an image to generate an appropriate thumbnail for that image. Computer Vision first generates a high-quality thumbnail and then analyzes the objects within the image to determine the *area of interest*. Computer Vision then crops the image to fit the requirements of the area of interest. The generated thumbnail can be presented using an aspect ratio that is different from the aspect ratio of the original image, depending on your needs. [Generate a thumbnail](concept-generating-thumbnails.md)

### Get the area of interest

Analyze the contents of an image to return the coordinates of the *area of interest*. Instead of cropping the image and generating a thumbnail, Computer Vision returns the bounding box coordinates of the region, so the calling application can modify the original image as desired. [Get the area of interest](concept-generating-thumbnails.md#area-of-interest)

## Moderate content in images

You can use Computer Vision to [detect adult content](concept-detecting-adult-content.md) in an image and return confidence scores for different classifications. The threshold for flagging content can be set on a sliding scale to accommodate your preferences.

## Image requirements

Image Analysis works on images that meet the following requirements:

- The image must be presented in JPEG, PNG, GIF, or BMP format
- The file size of the image must be less than 4 megabytes (MB)
- The dimensions of the image must be greater than 50 x 50 pixels

## Data privacy and security

As with all of the Cognitive Services, developers using the Computer Vision service should be aware of Microsoft's policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

Get started with Image Analysis by following the quickstart guide in your preferred development language:

- [Quickstart: Computer Vision REST API or client libraries](./quickstarts-sdk/image-analysis-client-library.md)
