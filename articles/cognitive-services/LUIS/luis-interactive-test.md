---
title: Test app in LUIS portal
description: Use Language Understanding (LUIS) to continuously work on your application to refine it and improve its language understanding.
ms.topic: conceptual
ms.date: 11/19/2019
---

# Test your LUIS app in the LUIS portal

[Testing](luis-concept-test.md) an app is an iterative process. After training your LUIS app, test it with sample utterances to see if the intents and entities are recognized correctly. If they're not, make updates to the LUIS app, train, and test again.

[!INCLUDE [Uses preview portal](includes/uses-portal-preview.md)]

<!-- anchors for H2 name changes -->
<a name="train-your-app"></a>
<a name="test-your-app"></a>
<a name="access-the-test-page"></a>
<a name="luis-interactive-testing"></a>

## Train before testing

In order to test against the most recent version of the active app, select **Train** from the top menu, before testing.

## Test an utterance

The test utterance should not be exactly the same as any example utterances in the app. The test utterance should include word choice, phrase length, and entity usage you expect for a user.

1. Access your app by selecting its name on the **My Apps** page.

1. To access the **Test** slide-out panel, select **Test** in your application's top panel.

    > [!div class="mx-imgBorder"]
    > ![Train & Test App page](./media/luis-how-to-interactive-test/test.png)

1. Enter an utterance in the text box and select Enter. You can type as many test utterances as you want in the **Test**, but only one utterance at a time.

1. The utterance, its top intent, and score are added to the list of utterances under the text box.

    ![Interactive testing identifies the wrong intent](./media/luis-how-to-interactive-test/test-weather-1.png)

## Inspect score

You inspect details of the test result in the **Inspect** panel.

1. With the **Test** slide-out panel open, select **Inspect** for an utterance you want to compare.

    ![Select Inspect button to see more details about the test results](./media/luis-how-to-interactive-test/inspect.png)

1. The **Inspection** panel appears. The panel includes the top scoring intent as well as any identified entities. The panel shows the result of the selected utterance.

    ![The panel includes the top scoring intent as well as any identified entities. The panel shows the result of the selected utterance.](./media/luis-how-to-interactive-test/inspect-panel.png)

## Correct top scoring intent

1. If the top scoring intent is incorrect, select the **Edit** button.

1.  In the drop-down list, select the correct intent for the utterance.

    ![Select correct intent](./media/luis-how-to-interactive-test/intent-select.png)

## View sentiment results

If **Sentiment analysis** is configured on the **[Publish](luis-how-to-publish-app.md#enable-sentiment-analysis)** page, the test results include the sentiment found in the utterance.

![Image of Test pane with sentiment analysis](./media/luis-how-to-interactive-test/sentiment.png)

## Correct matched pattern's intent

If you are using [Patterns](luis-concept-patterns.md) and the utterance matched a pattern, but the wrong intent was predicted, select the **Edit** link by the pattern, then select the correct intent.

## Compare with published version

You can test the active version of your app with the published [endpoint](luis-glossary.md#endpoint) version. In the **Inspect** panel, select **Compare with published**. Any testing against the published model is deducted from your Azure subscription quota balance.

![Compare with published](./media/luis-how-to-interactive-test/inspect-panel-compare.png)

## View endpoint JSON in test panel
You can view the endpoint JSON returned for the comparison by selecting the **Show JSON view**.

![Published JSON response](./media/luis-how-to-interactive-test/inspect-panel-compare-json.png)

## Additional settings in test panel

### LUIS endpoint

If you have several LUIS endpoints, use the **Additional Settings** link on the Test's Published pane to change the endpoint used for testing. If you are not sure which endpoint to use, select the default **Starter_Key**.

> [!div class="mx-imgBorder"]
> ![Test panel with Additional Settings link highlighted](media/luis-how-to-interactive-test/additional-settings-v3-settings.png)


## Batch testing
See batch testing [concepts](luis-concept-batch-test.md) and learn [how to](luis-how-to-batch-test.md) test a batch of utterances.

## Next steps

If testing indicates that your LUIS app doesn't recognize the correct intents and entities, you can work to improve your LUIS app's accuracy by labeling more utterances or adding features.

* [Label suggested utterances with LUIS](luis-how-to-review-endpoint-utterances.md)
* [Use features to improve your LUIS app's performance](luis-how-to-add-features.md)
