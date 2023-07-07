---
title: Conversational Language Understanding limits
titleSuffix: Azure AI services
description: Learn about the data, region, and throughput limits for Conversational Language Understanding
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 10/12/2022
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021, references_regions
---

# Conversational language understanding limits

Use this article to learn about the data and service limits when using conversational language understanding.

## Language resource limits

* Your Language resource must be one of the following [pricing tiers](https://azure.microsoft.com/pricing/details/cognitive-services/language-service/):

  |Tier|Description|Limit|
  |--|--|--|
  |F0|Free tier|You are only allowed **one** F0 Language resource **per subscription**.|
  |S |Paid tier|You can have up to 100 Language resources in the S tier per region.| 


See [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-service/) for more information.

* You can have up to **500** projects per resource.

* Project names have to be unique within the same resource across all custom features.

### Regional availability

Conversational language understanding is only available in some Azure regions. Some regions are available for **both authoring and prediction**, while other regions are **prediction only**. Language resources in authoring regions allow you to create, edit, train, and deploy your projects. Language resources in prediction regions allow you to get [predictions from a deployment](../concepts/custom-features/multi-region-deployment.md).

| Region             | Authoring | Prediction  |
|--------------------|-----------|-------------|
| Australia East     | ✓         | ✓           |
| Brazil South       |           | ✓           |
| Canada Central     |           | ✓           |
| Central India      | ✓         | ✓           |
| Central US         |           | ✓           |
| China East 2       | ✓         | ✓           |
| China North 2      |           | ✓           |
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

## Quota limits

|Pricing tier |Item |Limit |
| --- | --- | ---|
|F|Training time| 1 hour per month  |
|S|Training time| Unlimited, Pay as you go |
|F|Prediction Calls| 5,000 request per month  |
|S|Prediction Calls| Unlimited, Pay as you go |

## Data limits

The following limits are observed for the conversational language understanding.

|Item|Lower Limit| Upper Limit |
| --- | --- | --- |
|Number of utterances per project | 1 | 25,000|
|Utterance length in characters (authoring) | 1 | 500 |
|Utterance length in characters (prediction) | 1 | 1000 |
|Number of intents per project | 1 | 500|
|Number of entities per project | 0 | 350|
|Number of list synonyms per entity| 0 | 20,000 |
|Number of list synonyms per project| 0 | 2,000,000 |
|Number of prebuilt components per entity| 0 | 7 |
|Number of regular expressions per project| 0 | 20 |
|Number of trained models per project| 0 | 10 |
|Number of deployments per project| 0 | 10 |

## Naming limits

| Item | Limits |
|--|--|
| Project name |  You can only use letters `(a-z, A-Z)`, and numbers `(0-9)` , symbols  `_ . -`, with no spaces. Maximum allowed length is 50 characters. |
| Model name |  You can only use letters `(a-z, A-Z)`, numbers `(0-9)` and symbols `_ . -`. Maximum allowed length is 50 characters.  |
| Deployment name |  You can only use letters `(a-z, A-Z)`, numbers `(0-9)` and symbols `_ . -`. Maximum allowed length is 50 characters.  |
| Intent name| You can only use letters `(a-z, A-Z)`, numbers `(0-9)` and all symbols except ":", `$ & %  * (  ) + ~ # / ?`. Maximum allowed length is 50 characters.|
| Entity name| You can only use letters `(a-z, A-Z)`, numbers `(0-9)` and all symbols except ":", `$ & %  * (  ) + ~ # / ?`. Maximum allowed length is 50 characters.|

## Next steps

* [Conversational language understanding overview](overview.md)
