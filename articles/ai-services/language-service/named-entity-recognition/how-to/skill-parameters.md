---
title: Named entity recognition skill parameters
titleSuffix: Azure AI services
description: Learn about skill parameters for named entity recognition.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.custom:
ms.topic: how-to
ms.date: 03/21/2024
ms.author: jboback
---

# Learn about named entity recognition skill parameters

Use this article to get an overview of the different API parameters used to adjust the input to a NER API call.

## InclusionList parameter

The “inclusionList” parameter allows for you to specify which of the NER entity tags, listed here [link to Preview API table], you would like included in the entity list output in your inference JSON listing out all words and categorizations recognized by the NER service. By default, all recognized entities will be listed.

## ExclusionList parameter

The “exclusionList” parameter allows for you to specify which of the NER entity tags, listed here [link to Preview API table], you would like excluded in the entity list output in your inference JSON listing out all words and categorizations recognized by the NER service. By default, all recognized entities will be listed.

## Example

To do: work with Bidisha & Mikael to update with a good example

## overlapPolicy parameter

The “overlapPolicy” parameter allows for you to specify how you like the NER service to respond to recognized words/phrases that fall into more than one category. 

By default, the overlapPolicy parameter will be set to “matchLongest”. This option will categorize the extracted word/phrase under the entity category that can encompass the longest span of the extracted word/phrase (longest defined by the most number of characters included).

The alternative option for this parameter is “allowOverlap”, where all possible entity categories will be listed. 
Parameters by supported API version

|Parameter                                                   |API versions which support            |
|------------------------------------------------------------|--------------------------------------|
|inclusionList                                               |2023-04-15-preview, 2023-11-15-preview|
|exclusionList                                               |2023-04-15-preview, 2023-11-15-preview|
|Overlap policy                                              |2023-04-15-preview, 2023-11-15-preview|
|[Entity resolution](link to archived Entity Resolution page)|2022-10-01-preview                    |

## Next steps

* See [Configure containers](../../concepts/configure-containers.md) for configuration settings.