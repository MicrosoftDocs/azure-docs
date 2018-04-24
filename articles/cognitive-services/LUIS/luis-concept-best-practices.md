---
title: Understand LUIS best practices - Azure | Microsoft Docs
description: Learn the LUIS best practices to get the best results.
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 03/15/2018
ms.author: v-geberr
---
# Best practices
Use these best practices along with using the [authoring cycle](luis-concept-app-iteration.md) when using LUIS.

## Intents
Use only as many [intents](luis-concept-intent.md) as you need to perform the functions of your app. The general rule is to create an intent when this intent would trigger an action in the calling application or bot. 

The intents should be specific. They should not overlapping each other. If multiple intents are semantically close, consider merging them.

If you define too many intents, it becomes harder for LUIS to classify utterances correctly. If you define too few, they may be so general as to be overlapping. 

## Entities
Create an [entity](luis-concept-entity-types.md) when the calling application or bot needs some parameters or data from the utterance required to execute an action. 

## Utterances
Begin with 10-15 [utterances](luis-concept-utterance.md) per intent, but not more. Each utterance should be contextually different enough from the other utterances in the intent that each utterance is equally informative. The **None** intent should have between 10 and 20 percent of the total utterances in the application. Do not leave it empty.

In each iteration of the model, do not add a large quantity of utterances. Add utterances in quantities of tens. [Train](luis-how-to-train.md), [publish](publishapp.md), and [test](train-test.md) again. 

## Next steps

* Learn how to [add and manage intents](Add-intents.md) in your LUIS app.

