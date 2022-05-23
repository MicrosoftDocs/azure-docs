---
title: How to tag utterances in an orchestration workflow project
titleSuffix: Azure Cognitive Services
description: Use this article to tag utterances
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/03/2022
ms.author: aahi
ms.custom: language-service-orchestration
---

# How to tag utterances in orchestration workflow projects

Once you have [built a schema](create-project.md) for your project, you should add training utterances to your project. The utterances should be similar to what your users will use when interacting with the project. When you add an utterance you have to assign which intent it belongs to. You can only add utterances to the created intents within the project and not the connected intents.

## Filter Utterances

Clicking on **Filter** lets you view only the utterances associated to the intents you select in the filter pane.
When clicking on an intent in the [build schema](./create-project.md) page then you'll be moved to the **Tag Utterances** page, with that intent filtered automatically. 

## Next Steps
* [Train and Evaluate Model](./train-model.md)