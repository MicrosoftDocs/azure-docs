---
title: Language Understanding (LUIS) limits | Microsoft Docs
titleSuffix: Azure
description:  This article contains known limits of LUIS.
services: cognitive-services
author: v-geberr
manager: kamran.iqbal

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 02/06/2018
ms.author: v-geberr;
---
# Limits

|Area|Limit|
|--|:--|--|
|[Batch testing][batch-testing]| 10 datasets, 1000 utterances per dataset|
| [Composite entities](./luis-concept-entity-types.md) | Parent: 30, child: 10|
| [Hierarchical](./luis-concept-entity-types.md)|Parent: 30, child: 10|
|[Intents][intents]|500|
| [List entities](./luis-concept-entity-types.md) | Parent: 50, child: 20,000 items | 
| [Phrase list][phrase-list]|10 phrase lists, 5,000 items per list|
| [Prebuilt entities](./Pre-builtEntities.md) | no limit|
| [Simple](./luis-concept-entity-types.md)| 30|
| [Utterance][utterances] | 500 characters|
| [Utterances][utterances] | 15,000|




[batch-testing]:luis-concept-test.md#batch-testing
[intents]:luis-concept-intent.md
[phrase-list]:luis-concept-feature.md
[utterances]:luis-concept.utterance.md