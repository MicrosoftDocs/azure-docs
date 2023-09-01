---
title: Orchestration workflow limits
titleSuffix: Azure AI services
description: Learn about the data, region, and throughput limits for Orchestration workflow
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 10/12/2022
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021, mentions_regions
---

# Orchestration workflow limits

Use this article to learn about the data and service limits when using orchestration workflow.

## Language resource limits

* Your Language resource has to be created in one of the [supported regions](#regional-availability).

* Pricing tiers

  |Tier|Description|Limit|
  |--|--|--|
  |F0 |Free tier|You are only allowed one Language resource with the F0 tier per subscription.|
  |S |Paid tier|You can have up to 100 Language resources in the S tier per region.| 


See [pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-service/) for more information.

* You can have up to **500** projects per resource.

* Project names have to be unique within the same resource across all custom features.

## Regional availability

Orchestration workflow is only available in some Azure regions. Some regions are available for **both authoring and prediction**, while other regions are **prediction only**. Language resources in authoring regions allow you to create, edit, train, and deploy your projects. Language resources in prediction regions allow you to get [predictions from a deployment](../concepts/custom-features/multi-region-deployment.md). 

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
|F|Training time| 1 hour per month|
|S|Training time| Unlimited, Pay as you go |
|F|Prediction Calls| 5,000 request per month  |
|S|Prediction Calls| Unlimited, Pay as you go |

## Data limits

The following limits are observed for orchestration workflow.

|Item|Lower Limit| Upper Limit |
| --- | --- | --- |
|Count of utterances per project | 1 | 15,000|
|Utterance length in characters | 1 | 500 |
|Count of intents per project | 1 | 500|
|Count of trained models per project| 0 | 10 |
|Count of deployments per project| 0 | 10 |

## Naming limits

| Attribute | Limits |
|--|--|
| Project name |  You can only use letters `(a-z, A-Z)`, and numbers `(0-9)` , symbols  `_ . -`, with no spaces. Maximum allowed length is 50 characters. |
| Model name |  You can only use letters `(a-z, A-Z)`, numbers `(0-9)` and symbols `_ . -`. Maximum allowed length is 50 characters.  |
| Deployment name |  You can only use letters `(a-z, A-Z)`, numbers `(0-9)` and symbols `_ . -`. Maximum allowed length is 50 characters.  |
| Intent name| You can only use letters `(a-z, A-Z)`, numbers `(0-9)` and all symbols except ":", `$ & %  * (  ) + ~ # / ?`. Maximum allowed length is 50 characters.|


## Next steps

* [Orchestration workflow overview](overview.md)
