---
title: Personal health entities 
titleSuffix: Azure Cognitive Services
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.topic: include 
ms.date: 03/30/2020
ms.author: aahi
---

## Health information categories (Preview):

The following entity categories are returned when [detecting confidential health information](../../how-tos/text-analytics-how-to-entity-linking.md#named-entity-recognition-versions-and-features) using NER. This feature is included in the Text Analytics API v3.1 preview. 

> [!NOTE]
> * These entity types are returned when using version 3.1 of the API to detect health information with the `domain=phi` parameter and model version `2020-04-01` or later.
> * These entity types are only detected and returned on English text.


| Category | Subcategory | Description | Examples | Starting model version |
|----------|-------------|-------------|----------|------------------------|
| Person   | N/A         | Names of people.        | Bill Gates, Marie Curie | 2020-04-01 |
|Organization | Stock exchange | Stock exchange groups. | Major stock exchange names and abbreviations. | 2020-04-01 |
| Organization | Sports | Sports-related organizations. | Popular leagues, clubs, and associations. | 2020-04-01 | 
|Organization | Medical | Medical companies and groups | Contoso Pharmaceuticals | 2020-04-01 | 
| Address | N/A | Full addresses. | 1234 Main St. Buffalo, NY 98052 | 2020-04-01 |
| URL | N/A | URLs to websites. | `https://www.bing.com` | 2020-04-01 |
| DateTime | Date | Dates in time. | May 2nd 2017, 05/02/2017 | 2020-04-01 |
| ICD-10-CM | N/A | Entities relating to the International Classification of Diseases, Tenth Revision  | | 2020-04-01 |
| ICD-9-CM | N/A | Entities relating to the International Classification of Diseases, Ninth Revision  | | 2020-04-01 |

## Identification

This entity category includes financial information and official forms of identification. This category can be returned as health information starting with model version `2020-04-01`. Subtypes are listed below. 

[!INCLUDE [supported identification entities](./identification-entities.md)]