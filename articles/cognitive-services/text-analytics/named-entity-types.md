---
title: Supported Categories for Named Entity Recognition
titleSuffix: Azure Cognitive Services
description: Learn about the supported entity categories in the Text Analytics API.
services: cognitive-services
author: aahill

manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: article
ms.date: 08/11/2021
ms.author: aahi
---

# Supported entity categories in the Text Analytics API v3

Use this article to find the entity categories that can be returned by [Named Entity Recognition](how-tos/text-analytics-how-to-entity-linking.md) (NER). NER runs a predictive model to identify and categorize named entities from an input document.

NER v3.1 is also available, which includes the ability to detect personal (`PII`) and health (`PHI`) information. Additionally, click on the **Health** tab to see a list of supported categories in Text Analytics for health. 

You can find a list of types returned by version 2.1 in the [migration guide](migration-guide.md?tabs=named-entity-recognition)

## Entity categories

#### [General](#tab/general)

[!INCLUDE [supported entity types - general](./includes/entity-types/general-entities.md)]

#### [PII](#tab/personal)

[!INCLUDE [supported entity types - personally identifying information](./includes/entity-types/personal-information-entities.md)]

#### [Health](#tab/health)

[!INCLUDE [biomedical entity types](./includes/entity-types/health-entities.md)]

***

## Next steps

* [How to use Named Entity Recognition in Text Analytics](how-tos/text-analytics-how-to-entity-linking.md)
