---
title: Train your LUIS version 
titleSuffix: Azure Cognitive Services
description: Training is the process of teaching your Language Understanding (LUIS) app version to improve its natural language understanding. Train your LUIS app after updates to the model such as adding, editing, labeling, or deleting entities, intents, or utterances.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/24/2018
ms.author: diberry
---

# Train your LUIS app version

Training is the process of teaching your Language Understanding (LUIS) app to improve its natural language understanding. Train your LUIS app after updates to the model such as adding, editing, labeling, or deleting entities, intents, or utterances. 

<!--
When you train a LUIS app by example, LUIS generalizes from the examples you have labeled, and it learns to recognize the relevant intents and entities. This teaches LUIS to improve classification accuracy in the future. -->

Training and [testing](luis-concept-test.md) an app is an iterative process. After you train your LUIS app, you test it with sample utterances to see if the intents and entities are recognized correctly. If they're not, make updates to the LUIS app, train, and test again. 

## How to train
To start the iterative process, you first need to train your LUIS app at least once. Make sure every intent has at least one utterance before training.

1. Access your app by selecting its name on the **My Apps** page. 

2. In your app, select **Train** in the top panel. 

3. When training is complete, a green notification bar appears at the top of the browser.

<!-- The following note refers to what might cause the error message "Training failed: FewLabels for model: <ModelName>" -->

>[!NOTE]
>If you have one or more intents in your app that do not contain example utterances, you cannot train your app. Add utterances for all your intents. For more information, see [Add example utterances](luis-how-to-add-example-utterances.md).

## Train with all data
Training uses a small percentage of negative sampling. If you want to use all data instead of the small negative sampling, use the [Version settings API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/versions-update-application-version-settings) with the `UseAllTrainingData` set to true to turn this feature off. 

## Next steps

* [Label suggested utterances with LUIS](luis-how-to-review-endoint-utt.md) 
* [Use features to improve your LUIS app's performance](luis-how-to-add-features.md) 