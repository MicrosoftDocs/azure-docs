---
title: Understand LUIS best practices - Azure | Microsoft Docs
description: Learn the LUIS best practices to get the best results.
services: cognitive-services
author: v-geberr
manager: kaiqb

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/15/2018
ms.author: v-geberr;
---
# Best practices
Along with using the [authoring cycle](luis-concept-app-iteration.md), use these best practices to have great predictions with LUIS.

## Intents
It is a best practice to use only as many intents as you need to perform the functions of your app. The general rule is to create an intent when this intent would trigger an action in calling application or bot. 

The intents should be specific while being generic enough not to be overlapping. If multiple intents are semantically close, consider merging them.

If you define too many intents, it becomes harder for LUIS to classify utterances correctly. If you define too few, they may be so general as to be overlapping. <!-- You add and manage your intents from the **Intents** page that is accessed by clicking **Intents** in your application's left panel.-->

## Entities
Create an entity when the calling application or bot needs some parameters required to execute an action. 

## Utterances
Begin with 10-15 utterances per intent, but not more. Each utterance should be different enough from the other utterances in the intent that each utterance is equally informative. The **None** intent should have between 10 and 20 percent of the total utterances in the application. 

In each iteration of the model, do not add a large quantity of utterances. Add utterances in quantities of tens. Train, publish, and test again. 

## Next steps

* Learn how to [add and manage intents](Add-intents.md) in your LUIS app.
