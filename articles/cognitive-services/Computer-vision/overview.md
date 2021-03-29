---
title: What is Computer Vision?
titleSuffix: Azure Cognitive Services
description: The Computer Vision service provides you with access to advanced algorithms for processing images and returning information. 
services: cognitive-services 
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services 
ms.subservice: computer-vision 
ms.topic: overview
ms.date: 03/29/2021
ms.author: pafarley
ms.custom: [seodec18, cog-serv-seo-aug-2020, contperf-fy21q2]
keywords: computer vision, computer vision applications, computer vision service
#Customer intent: As a developer, I want to evaluate image processing functionality, so that I can determine if it will work for my information extraction or object detection scenarios.
---

# What is Computer Vision?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

Azure's Computer Vision service gives you access to advanced algorithms that process images and return information based on the visual features you're interested in. 

| Service|Description|
|---|---|
|[Optical Character Recognition (OCR)](tbd)|The [Optical Character Recognition (OCR)](concept-recognizing-text.md) service extracts text from images. You can use the new Read API to extract printed and handwritten text from photos and documents. It uses deep-learning-based models and works with text on a variety of surfaces and backgrounds. These include business documents, invoices, receipts, posters, business cards, letters, and whiteboards. The OCR APIs support extracting printed text in [several languages](./language-support.md). Follow the [OCR quickstart](tbd) to get started.|
|[Image Analysis](tbd)| The Image Analysis service extracts many visual features from images, such as objects, faces, adult content, and auto-generated text descriptions. Follow the [Image Analyis quickstart](tbd) to get started.|
| [Spatial Analysis](tbd)| The Spatial Analysis service analyzes the presence and movement of people on a video feed and produces events that other systems can respond to. Follow the [Spatial Analysis quickstart](tbd) to get started.|

## Computer Vision for digital asset management

Computer Vision can power many digital asset management (DAM) scenarios. DAM is the business process of organizing, storing, and retrieving rich media assets and managing digital rights and permissions. For example, a company may want to group and identify images based on visible logos, faces, objects, colors, and so on. Or, you might want to automatically [generate captions for images](./Tutorials/storage-lab-tutorial.md) and attach keywords so they're searchable. For an all-in-one DAM solution using Cognitive Services, Azure Cognitive Search, and intelligent reporting, see the [Knowledge Mining Solution Accelerator Guide](https://github.com/Azure-Samples/azure-search-knowledge-mining) on GitHub. For other DAM examples, see the [Computer Vision Solution Templates](https://github.com/Azure-Samples/Cognitive-Services-Vision-Solution-Templates) repository.

## Image requirements

Computer Vision can analyze images that meet the following requirements:

- The image must be presented in JPEG, PNG, GIF, or BMP format
- The file size of the image must be less than 4 megabytes (MB)
- The dimensions of the image must be greater than 50 x 50 pixels
  - For the Read API, the dimensions of the image must be between 50 x 50 and 10000 x 10000 pixels.

## Get started

Follow a quickstart to implement and run a service in the development language of your choice in less than 10 minutes.

* Quickstart: Optical character recognition (OCR)
* Quickstart: Image Analysis
* Quickstart: Spatial Analysis

## Data privacy and security

As with all of the Cognitive Services, developers using the Computer Vision service should be aware of Microsoft's policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

Get started with Computer Vision by following a quickstart guide in your preferred development language:

- [Quickstart: Computer Vision REST API or client libraries](./quickstarts-sdk/client-library.md)
- [Quickstart: Computer Vision REST API or client libraries](./quickstarts-sdk/client-library.md)
- [Quickstart: Computer Vision REST API or client libraries](./quickstarts-sdk/client-library.md)
