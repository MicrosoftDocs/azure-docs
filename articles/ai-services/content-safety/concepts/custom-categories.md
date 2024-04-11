---
title: "TBD in Azure AI Content Safety"
titleSuffix: Azure AI services
description: Learn about content TBDs and how you can use Azure AI Content Safety to handle them on your platform.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2024
ms.topic: conceptual
ms.date: 04/11/2024
ms.author: pafarley
---


## basic
The Azure AI Content Safety Custom Category feature empowers users to create and manage their own content categories for enhanced moderation and filtering. This feature enables customers to define categories specific to their needs, provide sample data, train a custom machine learning model, and utilize it to classify new content according to the predefined categories.

The Azure AI Content Safety Custom Category feature is designed to provide a streamlined process for creating, training, and using custom content classification models. Here's an in-depth look at the underlying workflow:

## auto-reviewer

## TBD features

## Limitations - basic

### Language availability


### Input limitations


## Limitations
| Object           | Limitation   |
| ---------------- | ------------ |
| Support language | English only |
|     Number of categories per user             |         5     |
|         Number of category version per category         |        5      |
|       Number of concurrent build (process) per category           |       1       |
|       Inference RPS           |    10          |
|        Customized category number in one text analyze request          |       5       |
|        Number of samples for a category version          |        At least 50, at most 10K (no dupilicated samples allowed)      |
|       Sample file           |     At most 128000 bytes         |
|       Length of a sample           |           125K characters   |
|        Length of deinition          |         1000 characters     |
|       Length of category name           |          128 characters    |
|           Length of blob url       |          at most 500 characters    |



### Regions


## Next steps

Follow the how-to guide to use the Azure AI Content Safety TBD API.

* [Use the TBD API](../how-to/TBD-response.md)


