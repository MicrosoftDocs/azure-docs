---
title: How to use intents in LUIS
description:  Learn how to use intents with LUIS.
ms.service: azure-ai-language
ms.author: aahi
author: aahill
ms.manager: nitinme
ms.subservice: azure-ai-luis
ms.topic: how-to
ms.date: 01/07/2022
---


# Add intents to determine user intention of utterances

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]


Add [intents](../concepts/intents.md) to your LUIS app to identify groups of questions or commands that have the same intention.

## Add an intent to your app

1. Sign in to the [LUIS portal](https://www.luis.ai/), and select your  **Subscription**  and  **Authoring resource**  to see the apps assigned to that authoring resource.
2. Open your app by selecting its name on the **My Apps** page.
3. Select **Build** from the top navigation bar, then select **Intents** from the left panel.
4. On the **Intents** page, select **+ Create**.
5. In the **Create new intent** dialog box, enter the intent name, for example *ModifyOrder*, and select **Done**.

    :::image type="content" source="../media/luis-how-to-add-intents/Addintent-dialogbox.png" alt-text="A screenshot showing the add intent dialog box." lightbox="../media/luis-how-to-add-intents/Addintent-dialogbox.png":::

The intent needs [example utterances](../concepts/utterances.md) in order to predict utterances at the published prediction endpoint.

## Add an example utterance

Example utterances are text examples of user questions or commands. To teach Language Understanding (LUIS) when to predict the intent, you need to add example utterances. Carefully consider each utterance you add. Each utterance added should be different than the examples that are already added to the intent..

On the intent details page, enter a relevant utterance you expect from your users, such as "*I want to change my pizza order to large please*" in the text box below the intent name, and then press Enter.
   
:::image type="content" source="../media/luis-how-to-add-intents/add-new-utterance-to-intent.png" alt-text="A screenshot of the intents details page, with a highlighted utterance." lightbox="../media/luis-how-to-add-intents/add-new-utterance-to-intent.png":::

LUIS converts all utterances to lowercase and adds spaces around [tokens](../luis-language-support.md#tokenization), such as hyphens.

## Intent prediction errors

An intent prediction error is determined when an utterance is not predicted with the trained app for the intent.

1. To find utterance prediction errors and fix them, use the **Incorrect** and **Unclear**  filter options.

    :::image type="content" source="../media/luis-how-to-add-intents/find-intent-prediction-errors.png" alt-text="A screenshot showing how to find and fix utterance prediction errors, using the filter option." lightbox="../media/luis-how-to-add-intents/find-intent-prediction-errors.png":::

2. To display the score value on the Intent details page, select  **Show details intent scores**  from the  **View**  menu.

When the filters and view are applied and there are example utterances with errors, the example utterance list will show the utterances and the issues.

Each row shows the current training's prediction score for the example utterance, and the nearest other intent score, which is the difference between these two scores.

> [!Tip]
> To fix intent prediction errors, use the [Summary dashboard](../luis-how-to-use-dashboard.md). The summary dashboard provides analysis for the active version's last training and offers the top suggestions to fix your model.

## Add a prebuilt intent

Now imagine you want to quickly create a confirmation intent. You can use one of the prebuilt intents to create a confirmation intent.

1. On the  **Intents**  page, select  **Add prebuilt domain intent**  from the toolbar above the intents list.
2. Select an intent from the pop-up dialog.
    :::image type="content" source="../media/luis-prebuilt-domains/add-prebuilt-domain-intents.png" alt-text="A screenshot showing the menu for adding prebuilt intents." lightbox="../media/luis-prebuilt-domains/add-prebuilt-domain-intents.png":::

3. Select the  **Done**  button.

## Next steps

* [Add entities](entities.md)
* [Label entities](label-utterances.md)
* [Train and test](train-test.md)
