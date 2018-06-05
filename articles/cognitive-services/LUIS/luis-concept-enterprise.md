---
title: Enterprise concepts for a LUIS app - Azure | Microsoft Docs
description: Understand design concepts for large LUIS apps.
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 06/05/2018
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

## When you need to have more than 500 intents
For example, let's say you're developing an office assistant that has over 500 intents. If 200 intents relate to scheduling meetings, 200 are about reminders, 200 are about getting information about colleagues, and 200 are for sending email, group intents so that each group is in a single app, then create a top-level app containing each intent. Use the [dispatch tool and architecture](#dispatch-tool-and-architecture) to build the top-level app. Then change your bot to use the cascading call as show in the [dispatch tutorial][dispatcher-application-tutorial]. 

## When you need to combine several LUIS and QnA maker apps
If you have several LUIS and QnA maker apps that need to respond to a bot, use the [dispatch tool](#dispatch-tool-and-architecture) to build the top-level app. Then change your bot to use the cascading call as show in the [dispatch tutorial][dispatcher-application-tutorial]. 

## Dispatch tool and model
Use the [Dispatch][dispatch-tool] command-line tool, found in [BotBuilder-tools](https://github.com/Microsoft/botbuilder-tools) to combine multiple LUIS and/or QnA Maker apps into a parent LUIS app. This approach allows you to have a parent domain including all subjects and different child subject domains in separate apps. 

![Conceptual image of dispatch architecture](./media/luis-concept-enterprise/dispatch-architecture.png)

The parent domain is noted in LUIS as a **V Dispatch** app. 

![Screenshot of LUIS apps list with LUIS app created by dispatch tool](./media/luis-concept-enterprise/dispatch.png)

The chatbot receives the utterance, then sends to the parent LUIS app for prediction. The top predicted intent from the parent app determines which child LUIS app is called next. The chatbot sends the utterance to the child app for a more specific prediction.

Understand how this hierarchy of calls is made from the Bot Builder v4 [dispatcher-application-tutorial][dispatcher-application-tutorial].  

## Next steps

* Learn how to [test a batch](luis-how-to-batch-test.md)

[LUIS]:luis-reference-regions.md
[dispatcher-application-tutorial]:https://aka.ms/bot-dispatch
[dispatch-tool]:https://github.com/Microsoft/botbuilder-tools/tree/master/Dispatch