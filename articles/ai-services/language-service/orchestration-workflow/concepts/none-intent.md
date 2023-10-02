---
title: Orchestration workflow none intent
titleSuffix: Azure AI services
description: Learn about the default None intent in orchestration workflow.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 06/03/2022
ms.author: aahi
ms.custom:  language-service-orchestration
ms.reviewer: haelhamm
---

# The "None" intent in orchestration workflow

Every project in orchestration workflow includes a default None intent. The None intent is a required intent and can't be deleted or renamed. The intent is meant to categorize any utterances that do not belong to any of your other custom intents. 

An utterance can be predicted as the None intent if the top scoring intent's score is **lower** than the None score threshold. It can also be predicted if the utterance is similar to examples added to the None intent. 

## None score threshold

You can go to the **project settings** of any project and set the **None score threshold**. The threshold is a decimal score from **0.0** to **1.0**. 

For any query and utterance, the highest scoring intent ends up **lower** than the threshold score, the top intent will be automatically replaced with the None intent. The scores of all the other intents remain unchanged.

The score should be set according to your own observations of prediction scores, as they may vary by project. A higher threshold score forces the utterances to be more similar to the examples you have in your training data.

When you export a project's JSON file, the None score threshold is defined in the _**"settings"**_ parameter of the JSON as the _**"confidenceThreshold"**_, which accepts a decimal value between 0.0 and 1.0.

The default score for Orchestration Workflow projects is set at **0.5** when creating new project in Language Studio.

> [!NOTE]
> During model evaluation of your test set, the None score threshold is not applied.

## Adding examples to the None intent

The None intent is also treated like any other intent in your project. If there are utterances that you want predicted as None, consider adding similar examples to them in your training data. For example, if you would like to categorize utterances that are not important to your project as None, then add those utterances to your intent. 

## Next steps

[Orchestration workflow overview](../overview.md)
