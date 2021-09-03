---
title: Custom text extraction data limits
titleSuffix: Azure Cognitive Services
description: Learn about the data and service limits when using custom text extraction.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: conceptual
ms.date: 08/17/2021
ms.author: aahi
---

# Custom text extraction limits

Use this article to learn about the data and service limits when using custom text extraction.

## File limits

* You can only use `.txt`. files for custom text. If your data is in another format, you can use the [CLUtils parse command](https://github.com/microsoft/CogSLanguageUtilities/blob/main/CLUtils/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ParseCommand/README.md) to open your document and extract the text.

* All files uploaded in your container must contain data. Empty files are not allowed for training.

## APIs limits

* When using the Authoring API, there is a maximum of 10 POST requests and 100 GET requests per minute.

* When using the Analyze API, there is a maximum of 20 GET or POST requests per minute.

* The maximum file size per request is 125,000 characters. You can send up to 25 files as long as they collectively do not exceed 125,000 characters.

> [!NOTE]
> If you need to send larger files than the limit allows, you can break the text into smaller chunks of text before sending them to the API. You can use the [Chunk command from CLUtils](https://github.com/microsoft/CogSLanguageUtilities/tree/main/CLUtils/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ChunkCommand) for this process.

## Text analytics resource

* You can only connect 1 storage account per resource. This process is irreversible. If you connect a storage account to your resource you cannot unlink it later.

* You can have up to 500 projects per resource.

* Project names have to be unique within the same resource across both custom extraction and [custom classification](../../custom-classification/overview.md).

## Project

* You can only connect 1 storage container for each project. This process is irreversible. If you connect a container to your project you cannot disconnect it later.

* You can only have 1 [tags file](../how-to/tag-data.md) per project. You cannot change to a different tags file later. You can only update the tags within your project.

* You cannot rename your project after creation.

* You must have minimum of 10 files in your project for the [model evaluation](../how-to/view-model-evaluation.md) process to be successful.

* You can have up to 10 trained models per project.

* Model names have to be unique within the same project.

* You cannot rename your model after creation.

* You can only train one model at a time per project.

* You can have only 1 deployed model per project.

* Your tagged entity length cannot exceed 128 tokens.

## Naming limits

| Attribute | Limits |
|--|--|
| Project name |  You can only use letters `(a-z, A-Z)`, numbers `(0-9)` with no spaces. |
| Model name |  You can only use letters `(a-z, A-Z)`, numbers `(0-9)` with no spaces. |
| Entity names| You can only use letters `(a-z, A-Z)`, numbers `(0-9)` and symbols `@ # _ . , ^ \ [ ]` |
| File names | You can only use letters `(a-z, A-Z)`, numbers `(0-9)` with no spaces. |

## Next steps

[Custom text extraction overview](../overview.md)
