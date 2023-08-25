---
title: How to use train and test
description:  Learn how to train and test the application.
ms.service: cognitive-services
ms.author: aahi
author: aahill
ms.manager: nitinme
ms.subservice: language-understanding
ms.topic: how-to
ms.date: 01/10/2022
---

# Train and test your LUIS app

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]


Training is the process of teaching your Language Understanding (LUIS) app to extract intent and entities from user utterances. Training comes after you make updates to the model, such as: adding, editing, labeling, or deleting entities, intents, or utterances.

Training and testing an app is an iterative process. After you train your LUIS app, you test it with sample utterances to see if the intents and entities are recognized correctly. If they're not, you should make updates to the LUIS app, then train and test again.

Training is applied to the active version in the LUIS portal.

## How to train interactively

Before you start training your app in the [LUIS portal](https://www.luis.ai/), make sure every intent has at least one utterance. You must train your LUIS app at least once to test it.

1. Access your app by selecting its name on the  **My Apps**  page.
2. In your app, select  **Train**  in the top-right part of the screen.
3. When training is complete, a notification appears at the top of the browser.

>[!Note]
>The training dates and times are in GMT + 2.

## Start the training process

> [!TIP]
>You do not need to train after every single change. Training should be done after a group of changes are applied to the model, or if you want to test or publish the app.

To train your app in the LUIS portal, you only need to select the **Train** button on the top-right corner of the screen.

Training with the REST APIs is a two-step process.

1. Send an HTTP POST [request for training](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c45).
2. Request the [training status](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5890b47c39e2bb052c5b9c46) with an HTTP GET request.

In order to know when training is complete, you must poll the status until all models are successfully trained.

## Test Your application

Testing is the process of providing sample utterances to LUIS and getting a response of recognized intents and entities. You can test your LUIS app interactively one utterance at a time, or provide a set of utterances. While testing, you can compare the current active model's prediction response to the published model's prediction response.

Testing an app is an iterative process. After training your LUIS app, test it with sample utterances to see if the intents and entities are recognized correctly. If they're not, make updates to the LUIS app, train, and test again.

## Interactive testing

Interactive testing is done from the  **Test**  panel of the LUIS portal. You can enter an utterance to see how intents and entities are identified and scored. If LUIS isn't predicting an utterance's intents and entities as you would expect, copy the utterance to the  **Intent**  page as a new utterance. Then label parts of that utterance for entities to train your LUIS app.

See [batch testing](../luis-how-to-batch-test.md) if you are testing more than one utterance at a time, and the [Prediction scores](../luis-concept-prediction-score.md) article to learn more about prediction scores.


## Test an utterance

The test utterance should not be exactly the same as any example utterances in the app. The test utterance should include word choice, phrase length, and entity usage you expect for a user.

1. Sign in to the [LUIS portal](https://www.luis.ai/), and select your  **Subscription**  and  **Authoring resource**  to see the apps assigned to that authoring resource.
2. Open your app by selecting its name on  **My Apps**  page.
3. Select **Test** in the top-right corner of the screen for your app, and a panel will slide into view.

:::image type="content" source="../media/luis-how-to-interactive-test/test.png" alt-text="Train & Test App pag" lightbox="../media/luis-how-to-interactive-test/test.png":::

4. Enter an utterance in the text box and press the enter button on the keyboard. You can test a single utterance in the **Test** box, or multiple utterances as a batch in the **Batch testing panel**.
5. The utterance, its top intent, and score are added to the list of utterances under the text box. In the above example, this is displayed as 'None (0.43)'.

## Inspect the prediction

Inspect the test result details in the  **Inspect**  panel.

1. With the  **Test**  panel open, select  **Inspect**  for an utterance you want to compare. **Inspect** is located next to the utterance's top intent and score. Refer to the above image.

2. The  **Inspection**  panel will appear. The panel includes the top scoring intent and any identified entities. The panel shows the prediction of the selected utterance.

:::image type="content" source="../media/luis-how-to-interactive-test/inspect-panel.png" alt-text="Partial screenshot of Test Inspect panel" lightbox="../media/luis-how-to-interactive-test/inspect-panel.png":::

> [!TIP]
>From the inspection panel, you can add the test utterance to an intent by selecting  **Add to example utterances**.

## Change deterministic training settings using the version settings API

Use the [Version settings API](https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/versions-update-application-version-settings) with the UseAllTrainingData set to *true* to turn off deterministic training.

## Change deterministic training settings using the LUIS portal

Log into the [LUIS portal](https://www.luis.ai/) and select your app. Select  **Manage**  at the top of the screen, then select  **Settings.** Enable or disable the  **use non-deterministic training**  option. When disabled, training will use all available data. Training will only use a _random_ sample of data from other intents as negative data when training each intent

:::image type="content" source="../media/non-determinstic-training.png" alt-text="A button for enabling or disabling non deterministic training." lightbox="../media/non-determinstic-training.png":::

## View sentiment results

If sentiment analysis is configured on the [**Publish**](publish.md) page, the test results will include the sentiment found in the utterance.

## Correct matched pattern's intent

If you are using [Patterns](../concepts/patterns-features.md) and the utterance matched is a pattern, but the wrong intent was predicted, select the  **Edit**  link by the pattern and select the correct intent.

## Compare with published version

You can test the active version of your app with the published [endpoint](../luis-glossary.md#endpoint) version. In the  **Inspect**  panel, select  **Compare with published**. 
> [!NOTE]
> Any testing against the published model is deducted from your Azure subscription quota balance.

:::image type="content" source="../media/luis-how-to-interactive-test/inspect-panel-compare.png" alt-text="Compare with published" lightbox="../media/luis-how-to-interactive-test/inspect-panel-compare.png":::

## View endpoint JSON in test panel

You can view the endpoint JSON returned for the comparison by selecting the **Show JSON view** in the top-right corner of the panel.


## Next steps

If testing requires testing a batch of utterances, See [batch testing](../luis-how-to-batch-test.md).

If testing indicates that your LUIS app doesn't recognize the correct intents and entities, you can work to improve your LUIS app's accuracy by labeling more utterances or adding features.

* [Improve your application](./improve-application.md)
* [Publishing your application](./publish.md)
