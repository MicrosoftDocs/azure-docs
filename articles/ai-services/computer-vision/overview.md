---
title: What is Azure AI Vision?
titleSuffix: Azure AI services
description: The Azure AI Vision service provides you with access to advanced algorithms for processing images and returning information. 
services: cognitive-services 
author: PatrickFarley
manager: nitinme

ms.service: azure-ai-vision
ms.topic: overview
ms.date: 07/04/2023
ms.author: pafarley
ms.custom: [seodec18, cog-serv-seo-aug-2020, contperf-fy21q2]
keywords: Azure AI Vision, Azure AI Vision applications, Azure AI Vision service
#Customer intent: As a developer, I want to evaluate image processing functionality, so that I can determine if it will work for my information extraction or object detection scenarios.
---

# What is Azure AI Vision?

[!INCLUDE [Azure AI services rebrand](../includes/rebrand-note.md)]

Azure's Azure AI Vision service gives you access to advanced algorithms that process images and return information based on the visual features you're interested in. 

| Service|Description|
|---|---|
| [Optical Character Recognition (OCR)](overview-ocr.md)|The Optical Character Recognition (OCR) service extracts text from images. You can use the new Read API to extract printed and handwritten text from photos and documents. It uses deep-learning-based models and works with text on various surfaces and backgrounds. These include business documents, invoices, receipts, posters, business cards, letters, and whiteboards. The OCR APIs support extracting printed text in [several languages](./language-support.md). Follow the [OCR quickstart](quickstarts-sdk/client-library.md) to get started.|
|[Image Analysis](overview-image-analysis.md)| The Image Analysis service extracts many visual features from images, such as objects, faces, adult content, and auto-generated text descriptions. Follow the [Image Analysis quickstart](quickstarts-sdk/image-analysis-client-library-40.md) to get started.|
| [Face](overview-identity.md) | The Face service provides AI algorithms that detect, recognize, and analyze human faces in images. Facial recognition software is important in many different scenarios, such as identification, touchless access control, and face blurring for privacy. Follow the [Face quickstart](quickstarts-sdk/identity-client-library.md) to get started. |
| [Spatial Analysis](intro-to-spatial-analysis-public-preview.md)| The Spatial Analysis service analyzes the presence and movement of people on a video feed and produces events that other systems can respond to. Install the [Spatial Analysis container](spatial-analysis-container.md) to get started.|

## Azure AI Vision for digital asset management

Azure AI Vision can power many digital asset management (DAM) scenarios. DAM is the business process of organizing, storing, and retrieving rich media assets and managing digital rights and permissions. For example, a company may want to group and identify images based on visible logos, faces, objects, colors, and so on. Or, you might want to automatically [generate captions for images](./Tutorials/storage-lab-tutorial.md) and attach keywords so they're searchable. For an all-in-one DAM solution using Azure AI services, Azure Cognitive Search, and intelligent reporting, see the [Knowledge Mining Solution Accelerator Guide](https://github.com/Azure-Samples/azure-search-knowledge-mining) on GitHub. For other DAM examples, see the [Azure AI Vision Solution Templates](https://github.com/Azure-Samples/Cognitive-Services-Vision-Solution-Templates) repository.

## Getting started

Use [Vision Studio](https://portal.vision.cognitive.azure.com/) to try out Azure AI Vision features quickly in your web browser.

To get started building Azure AI Vision into your app, follow a quickstart.
* [Quickstart: Optical character recognition (OCR)](quickstarts-sdk/client-library.md)
* [Quickstart: Image Analysis](quickstarts-sdk/image-analysis-client-library.md)
* [Quickstart: Spatial Analysis container](spatial-analysis-container.md)

## Image requirements

Azure AI Vision can analyze images that meet the following requirements:

- The image must be presented in JPEG, PNG, GIF, or BMP format
- The file size of the image must be less than 4 megabytes (MB)
- The dimensions of the image must be greater than 50 x 50 pixels
  - For the Read API, the dimensions of the image must be between 50 x 50 and 10,000 x 10,000 pixels.

## Data privacy and security

As with all of the Azure AI services, developers using the Azure AI Vision service should be aware of Microsoft's policies on customer data. See the [Azure AI services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

Follow a quickstart to implement and run a service in your preferred development language.

* [Quickstart: Optical character recognition (OCR)](quickstarts-sdk/client-library.md)
* [Quickstart: Image Analysis](quickstarts-sdk/image-analysis-client-library-40.md)
* [Quickstart: Face](quickstarts-sdk/identity-client-library.md)
* [Quickstart: Spatial Analysis container](spatial-analysis-container.md)
