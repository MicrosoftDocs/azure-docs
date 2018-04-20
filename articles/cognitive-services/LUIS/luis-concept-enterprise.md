---
title: Enterprise concepts for a LUIS app - Azure | Microsoft Docs
description: Understand design concepts for large LUIS apps.
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 03/15/2018
ms.author: v-geberr
---

# Enterprise strategies for a LUIS app
Review these design strategies for your enterprise app.

## When you expect LUIS requests beyond the quota
If your LUIS app request rate exceeds the allowed [quota rate](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/), spread the load to more LUIS apps with the same app definition. Export the original LUIS app, then import the app back into separate apps. Each app has its own app ID. When you publish, instead of using the same key across all apps, create a separate key for each app. Balance the load across all apps so that no single app is overwhelmed. Add [Application Insights](luis-tutorial-bot-csharp-appinsights.md) to monitor usage. 

In order to get the same top intent between all the apps, make sure the intent prediction between the first and second intent is wide enough that LUIS is not confused, giving different results between apps for minor variations in utterances. 

Designate a single app as the master. Any utterances that are suggested for review should be added to the master app then moved back to all the other apps. This is either a full export of the app, or loading the labeled utterances from the master to the children. Loading can be done from either the [LUIS][LUIS] website or the authoring API for a [single utterance](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c08) or for a [batch](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c09). 

Schedule a periodic [review of endpoint utterances](label-suggested-utterances.md) for active learning, such as every two weeks, then retrain and republish. 

## When your monolithic app returns wrong intent
If your app is meant to predict a wide variety of user utterances, consider implementing the dispatcher model. The parent app indicates top-level categories of questions. Create a child app for each subcategory. The child app breaks up the subcategory into relevant intents. Breaking up a monolithic app allows LUIS to focus detection between intents successfully instead of getting confused between intents across the top level and intents between the top level and sublevels. 

Schedule a periodic [review of endpoint utterances](label-suggested-utterances.md) for active learning, such as every two weeks, then retrain and republish. 

## Next steps

* Learn how to [test a batch](luis-how-to-batch-test.md)

[LUIS]:luis-reference-regions.md
