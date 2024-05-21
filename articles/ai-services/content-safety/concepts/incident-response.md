---
title: "Incident response in Azure AI Content Safety"
titleSuffix: Azure AI services
description: Learn about content incidents and how you can use Azure AI Content Safety to handle them on your platform.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2024
ms.topic: conceptual
ms.date: 04/11/2024
ms.author: pafarley
---

# Incident response

In content moderation scenarios, incident response is the process of identifying, analyzing, containing, eradicating, and recovering from cyber incidents that involve inappropriate or harmful content on online platforms. 

An incident may involve a set of emerging content patterns (text, image, or other modalities) that violate Microsoft community guidelines or the customers' own policies and expectations. These incidents need to be mitigated quickly and accurately to avoid potential live site issues or harm to users and communities. 

## Incident response API features

One way to deal with emerging content incidents is to use [Blocklists](/azure/ai-services/content-safety/how-to/use-blocklist), but that only allows exact text matching and no image matching. The Azure AI Content Safety incident response API offers the following advanced capabilities:
- semantic text matching using embedding search with a lightweight classifier
- image matching with a lightweight object-tracking model and embedding search.

## How it works 

First, you use the API to create an incident object with a description. Then you add any number of image or text samples to the incident. No training step is needed.

Then, you can include your defined incident in a regular text analysis or image analysis request. The service will indicate whether the submitted content is an instance of your incident. The service can still do other content moderation tasks in the same API call.

## Limitations

### Language availability

The text incident response API supports all languages that are supported by Content Safety text moderation. See [Language support](/azure/ai-services/content-safety/language-support).

### Input limitations

See the following table for the input limitations of the incident response API:

| Object     | Limitation      |
| :------------ | :----------- |
| Maximum length of an incident name | 100 characters | 
| Maximum number of text/image samples per incident | 1000 |
| Maximum size of each sample | Text: 500 characters<br>Image: 4 MB  |
| Maximum number of text or image incidents per resource| 100 |  
| Supported Image formats | BMP, GIF, JPEG, PNG, TIF, WEBP |

### Region availability

To use this API, you must create your Azure AI Content Safety resource in one of the supported regions:
- East US
- Sweden Central

## Next steps

Follow the how-to guide to use the Azure AI Content Safety incident response API.

* [Use the incident response API](../how-to/incident-response.md)
