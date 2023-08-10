---
title: Custom Named Entity Recognition (NER) service limits
titleSuffix: Azure AI services
description: Learn about the data and service limits when using Custom Named Entity Recognition (NER).
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 05/06/2022
ms.author: aahi
ms.custom: language-service-custom-ner, references_regions, ignite-fall-2021, event-tier1-build-2022
---

# Custom named entity recognition service limits

Use this article to learn about the data and service limits when using custom NER.

## Language resource limits

* Your Language resource has to be created in one of the [supported regions](#regional-availability).

* Your resource must be one of the supported pricing tiers:
    
    |Tier|Description|Limit|
    |--|--|--|
    |F0 |Free tier|You are only allowed one F0 tier Language resource per subscription.|
    |S |Paid tier|You can have unlimited Language S tier resources per subscription. | 
    
    
* You can only connect 1 storage account per resource. This process is irreversible. If you connect a storage account to your resource, you cannot unlink it later. Learn more about [connecting a storage account](how-to/create-project.md#create-language-resource-and-connect-storage-account)

* You can have up to 500 projects per resource.

* Project names have to be unique within the same resource across all custom features.

## Regional availability 

Custom named entity recognition is only available in some Azure regions. Some regions are available for **both authoring and prediction**, while other regions are **prediction only**. Language resources in authoring regions allow you to create, edit, train, and deploy your projects. Language resources in prediction regions allow you to get [predictions from a deployment](../concepts/custom-features/multi-region-deployment.md).

| Region             | Authoring | Prediction  |
|--------------------|-----------|-------------|
| Australia East     | ✓         | ✓           |
| Brazil South       |           | ✓           |
| Canada Central     |           | ✓           |
| Central India      | ✓         | ✓           |
| Central US         |           | ✓           |
| East Asia          |           | ✓           |
| East US            | ✓         | ✓           |
| East US 2          | ✓         | ✓           |
| France Central     |           | ✓           |
| Japan East         |           | ✓           |
| Japan West         |           | ✓           |
| Jio India West     |           | ✓           |
| Korea Central      |           | ✓           |
| North Central US   |           | ✓           |
| North Europe       | ✓         | ✓           |
| Norway East        |           | ✓           |
| Qatar Central      |           | ✓           |
| South Africa North |           | ✓           |
| South Central US   | ✓         | ✓           |
| Southeast Asia     |           | ✓           |
| Sweden Central     |           | ✓           |
| Switzerland North  | ✓         | ✓           |
| UAE North          |           | ✓           |
| UK South           | ✓         | ✓           |
| West Central US    |           | ✓           |
| West Europe        | ✓         | ✓           |
| West US            |            | ✓           |
| West US 2          | ✓         | ✓           |
| West US 3          | ✓         | ✓           |


## API limits

|Item|Request type| Maximum limit|
|:-|:-|:-|
|Authoring API|POST|10 per minute|
|Authoring API|GET|100 per minute|
|Prediction API|GET/POST|1,000 per minute|
|Document size|--|125,000 characters. You can send up to 25 documents as long as they collectively do not exceed 125,000 characters|

> [!TIP]
> If you need to send larger files than the limit allows, you can break the text into smaller chunks of text before sending them to the API. You use can the [chunk command from CLUtils](https://github.com/microsoft/CognitiveServicesLanguageUtilities/blob/main/CustomTextAnalytics.CLUtils/Solution/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ChunkCommand/README.md) for this process.

## Quota limits

|Pricing tier |Item |Limit |
| --- | --- | ---|
|F|Training time| 1 hour per month |
|S|Training time| Unlimited, Pay as you go |
|F|Prediction Calls| 5,000 text records per month  |
|S|Prediction Calls| Unlimited, Pay as you go |

## Document limits

* You can only use `.txt`. files. If your data is in another format, you can use the [CLUtils parse command](https://github.com/microsoft/CognitiveServicesLanguageUtilities/blob/main/CustomTextAnalytics.CLUtils/Solution/CogSLanguageUtilities.ViewLayer.CliCommands/Commands/ParseCommand/README.md) to open your document and extract the text.

* All files uploaded in your container must contain data. Empty files are not allowed for training.

* All files should be available at the root of your container.

## Data limits

The following limits are observed for the custom named entity recognition.

|Item|Lower Limit| Upper Limit |
| --- | --- | --- |
|Documents count | 10 | 100,000 |
|Document length in characters | 1 | 128,000 characters; approximately 28,000 words or 56 pages. |
|Count of entity types | 1 | 200 |
|Entity length in characters | 1 | 500 |
|Count of trained models per project| 0 | 10 |
|Count of deployments per project| 0 | 10 |

## Naming limits

| Item | Limits |
|--|--|
| Project name |  You can only use letters `(a-z, A-Z)`, and numbers `(0-9)` ,symbols  `_ . -`,with no spaces. Maximum allowed length is 50 characters. |
| Model name |  You can only use letters `(a-z, A-Z)`, numbers `(0-9)` and symbols `_ . -`. Maximum allowed length is 50 characters.  |
| Deployment name |  You can only use letters `(a-z, A-Z)`, numbers `(0-9)` and symbols `_ . -`. Maximum allowed length is 50 characters.  |
| Entity name| You can only use letters `(a-z, A-Z)`, numbers `(0-9)` and all symbols except ":", `$ & %  * (  ) + ~ # / ?`. Maximum allowed length is 50 characters.|
| Document name | You can only use letters `(a-z, A-Z)`, and numbers `(0-9)` with no spaces. |


## Next steps

* [Custom NER overview](overview.md)
