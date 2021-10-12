---
title: Custom text classification limits 
titleSuffix: Azure Cognitive Services
description: Learn about the data and rate limits when using custom entity extraction.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 11/02/2021
ms.author: aahi
---

# Custom text classification limits

Use this article to learn about the data and rate limits when using custom entity extraction

## File limits

* You can only use `.txt`. files for custom text classification. If your data is in other format, you can use [CLUtils parse command](https://github.com/microsoft/CogSLanguageUtilities/blob/main/CLUtils/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ParseCommand/README.md) to crack your document and extract the text.

* All files uploaded in your container must contain data, no empty files are allowed for training.

* All files should be available at the root of your container.

* The maximum allowed length for your files is 17,500 characters, which is approximately 3,800 words or 8 pages.

* Your [training dataset](../how-to/train-model.md#data-splits) should include at least 10 files and no more than 1,000,000 files.

## API limits

**Authoring API**

* You can send a maximum of 10 POST requests and 100 GET requests per minute.

**Analyze API**

* You can send a maximum of 20 GET or POST requests per minute.

* The maximum size of files per request is 125,000 characters. You can send up to 25 files, as long as the collective size of them does not exceed 125,000 characters.

> [!NOTE]
> If you need to send larger files than the limit allows, you can break the text into smaller chunks of text before sending them to the API. You use can the [chunk command from CLUtils](https://github.com/microsoft/CogSLanguageUtilities/tree/main/CLUtils/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ChunkCommand) for this process.

## Azure resource limits

* You can only connect 1 storage account per resource. This process is irreversible. If you connect a storage account to your resource you can't disconnect it later.

* You can have up to 500 projects per resource.

* Project names have to be unique within the same resource, across both the custom Named Entity Recognition (NER) and custom text classification features.

## Project limits

* You can only connect 1 storage container for each project. This process is irreversible, if you connect a container to your resource you can't disconnect it later.

* You can have only 1 file of tags per project. You can't change the tags file later, you can only update the tags within your project.

* You can't rename your project after creation.

* You must have minimum of 10 files in your project and a maximum of 1,000,000 files.

* You can have up to 10 trained models per project.

* Model names have to be unique within the same project.

* You can't rename your model after creation.

* You can only train one model at a time per project.

## Classes

* You should have at least 2 classes in your project. The maximum is 200 classes.

* It is recommended to have around 200 tagged instances per class, and you must have a minimum of 10 of tagged instances per class.

## Naming limits

| Attribute | Limits |
|--|--|
| Project name |  You can only use letters `(a-z, A-Z)`, and numbers `(0-9)` with no spaces. |
| Model name |  You can only use letters `(a-z, A-Z)`, and numbers `(0-9)` with no spaces. |
| entity names| You can only use letters `(a-z, A-Z)`, numbers `(0-9)` and symbols `@ # _ . , ^ \ [ ]` |
| File names | You can only use letters `(a-z, A-Z)`, and numbers `(0-9)` with no spaces. |
