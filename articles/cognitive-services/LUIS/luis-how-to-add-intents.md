---
title: Add intents - LUIS
titleSuffix: Azure Cognitive Services
description: Add intents to your LUIS app to identify groups of questions or commands that have the same intentions. 
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 11/08/2019
ms.author: diberry
ms.service: cognitive-services
---

# Add intents to determine user intention of utterances

Add [intents](luis-concept-intent.md) to your LUIS app to identify groups of questions or commands that have the same intention. 

Intents are managed from top navigation bar's **Build** section, then from the left panel's **Intents**. 

[!INCLUDE [Uses preview portal](includes/uses-portal-preview.md)]

## Add intent

1. In the [LUIS preview portal](https://preview.luis.ai), select **Build** to view intents. 
1. On the **Intents** page, select **+ Create**.
1. In the **Create new intent** dialog box, enter the intent name, for example `ModifyOrder`, and select **Done**.

    > [!div class="mx-imgBorder"]
    > ![Add Intent](./media/luis-how-to-add-intents/Addintent-dialogbox.png)

    The intent needs example utterances.

## Add an example utterance

Example utterances are text examples of user questions or commands. To teach Language Understanding (LUIS) when to predict this intent, you need to add example utterances to an intent. LUIS needs in the range of 15 to 30 example utterances to begin understanding the intent. Do not add example utterances in bulk. Each utterance should be carefully chosen for how it is different than examples already in the intent. 

1. On the intent details page, enter a relevant utterance you expect from your users, such as `Deliver a large cheese pizza` in the text box below the intent name, and then press Enter.
 
    > [!div class="mx-imgBorder"]
    > ![Screenshot of Intents details page, with utterance highlighted](./media/luis-how-to-add-intents/add-new-utterance-to-intent.png) 

    LUIS converts all utterances to lowercase and adds spaces around [tokens](luis-language-support.md#tokenization) such as hyphens.

<a name="#intent-prediction-discrepancy-errors"></a>

## Intent prediction errors 

An example utterance in an intent might have an intent prediction error between the intent the example utterance is currently in and the intent determined during training. 

To find utterance prediction errors and fix them, use the **Filter** options of Incorrect and Unclear combined with the **View** option of **Detailed view**. 

![To find utterance prediction errors and fix them, use the Filter option.](./media/luis-how-to-add-intents/find-intent-prediction-errors.png)

When the filters and view are applied, and there are example utterances with errors, the example utterance list shows the utterances and the issues.

> [!div class="mx-imgBorder"]
> ![![When the filters and view are applied, and there are example utterances with errors, the example utterance list shows the utterances and the issues.](./media/luis-how-to-add-intents/find-errors-in-utterances.png)](./media/luis-how-to-add-intents/find-errors-in-utterances.png#lightbox)

Each row shows the current training's prediction score for the example utterance, the nearest rival's score, which is the difference in these two scores. 

### Fixing intents

To learn how to fix intent prediction errors, use the [Summary Dashboard](luis-how-to-use-dashboard.md). The summary dashboard provides analysis for the active version's last training and offers the top suggestions to fix your model.  

## Using the contextual toolbar

The context toolbar provides other actions:

* Edit or delete example utterance
* Reassign example utterance to a different intent
* Filters and views: only show utterances containing filtered entities or view optional details
* Search through example utterances

## Train your app after changing model with intents

After you add, edit, or remove intents, [train](luis-how-to-train.md) and [publish](luis-how-to-publish-app.md) your app so that your changes are applied to endpoint queries. Do not train after every single change. Train after a group of changes. 

## Next steps

Learn more about adding [example utterances](luis-how-to-add-example-utterances.md) with entities. 
