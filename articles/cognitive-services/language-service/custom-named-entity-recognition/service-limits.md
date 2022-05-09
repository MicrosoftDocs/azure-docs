---
title: Custom Named Entity Recognition (NER) service limits
titleSuffix: Azure Cognitive Services
description: Learn about the data and service limits when using Custom Named Entity Recognition (NER).
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 04/05/2022
ms.author: aahi
ms.custom: language-service-custom-ner, references_regions, ignite-fall-2021
---

# Custom Named Entity Recognition (NER) service limits

Use this article to learn about the data and service limits when using Custom NER.

## File limits

* You can only use `.txt`. files. If your data is in another format, you can use the [CLUtils parse command](https://github.com/microsoft/CognitiveServicesLanguageUtilities/blob/main/CustomTextAnalytics.CLUtils/Solution/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ParseCommand/README.md) to open your document and extract the text.

* All files uploaded in your container must contain data. Empty files are not allowed for training.

* All files should be available at the root of your container.

* Maximum allowed length for your file is 128,000 characters, which is approximately 28,000 words or 56 pages.

* Your [training dataset](how-to/train-model.md) should include at least 10 files and not more than 100,000 files.

## APIs limits

* The Authoring API has a maximum of 10 POST requests and 100 GET requests per minute.

* The Analyze API has a maximum of 20 GET or POST requests per minute.

* The maximum file size per request is 125,000 characters. You can send up to 25 files as long as they collectively do not exceed 125,000 characters.

> [!NOTE]
> If you need to send larger files than the limit allows, you can break the text into smaller chunks of text before sending them to the API. You can use the [Chunk command from CLUtils](https://github.com/microsoft/CognitiveServicesLanguageUtilities/blob/main/CustomTextAnalytics.CLUtils/Solution/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ChunkCommand/README.md) for this process.

## Azure resource limits

* You can only connect 1 storage account per resource. This process is irreversible. If you connect a storage account to your resource, you cannot unlink it later.

* You can have up to 500 projects per resource.

* Project names have to be unique within the same resource across both custom NER and [custom text classification](../custom-classification/overview.md).

## Regional availability 

Custom text classification is only available select Azure regions. When you create an [Azure resource](how-to/create-project.md), it must be deployed into one of the following regions:
* **West US 2**
* **West Europe**
    
## Project limits

* You can only connect 1 storage account for each project. This process is irreversible. If you connect a storage account to your project, you cannot disconnect it later.

* You can only have 1 [tags file](how-to/tag-data.md) per project. You cannot change to a different tags file later. You can only update the tags within your project.

* You cannot rename your project after creation.

* Your project name must only contain alphanumeric characters (letters and numbers). Spaces and special characters are not allowed. Project names can have a maximum of 50 characters.

* You must have minimum of 10 tagged files in your project and a maximum of 100,000 files.

* You can have up to 50 trained models per project.

* Model names have to be unique within the same project.

* Model names must only contain alphanumeric characters, only letters and numbers, no spaces or special characters are allowed). Model name must have a maximum of 50 characters.

* You cannot rename your model after creation.

* You can only train one model at a time per project.

## Entity limits

* Your tagged entity is recommended not to exceed 10 words but the maximum allowed is 100 characters.

* You must have at least 1 entity type in your project and the maximum is 200 entity types.

* It is recommended to have around 200 tagged instances per entity and you must have a minimum of 10 of tagged instances per entity.

* Entity names must have a maximum of 50 characters. 

## Naming limits

| Attribute | Limits |
|--|--|
| Project name |  You can only use letters `(a-z, A-Z)`, and numbers `(0-9)` with no spaces. Maximum length allowed is 50 characters. |
| Model name |  You can only use letters `(a-z, A-Z)`, and numbers `(0-9)` with no spaces. Maximum length allowed is 50 characters. |
| Entity name | You can only use letters `(a-z, A-Z)`, and numbers `(0-9)` and symbols `@ # _ . , ^ \ [ ]`. Maximum length allowed is 50 characters. |
| File name | You can only use letters `(a-z, A-Z)`, and numbers `(0-9)` with no spaces. |

## Next steps

[Custom NER overview](../overview.md)
