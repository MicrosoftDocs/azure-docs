---
title: Test your LUIS app inside the LUIS portal
titleSuffix: Azure Cognitive Services
description: Use Language Understanding (LUIS) to continuously work on your application to refine it and improve its language understanding.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/06/2018
ms.author: diberry
---

# Test your LUIS app
<a name="train-your-app"></a>
[Testing](luis-concept-test.md) an app is an iterative process. After training your LUIS app, test it with sample utterances to see if the intents and entities are recognized correctly. If they're not, make updates to the LUIS app, train, and test again. 

<!-- anchors for H2 name changes -->
<a name="test-your-app"></a>
<a name="access-the-test-page"></a>
<a name="luis-interactive-testing"></a>
## Test an utterance

1. Access your app by selecting its name on the **My Apps** page. 

2. To access the **Test** slide-out panel, select **Test** in your application's top panel.

    ![Train & Test App page](./media/luis-how-to-interactive-test/test.png)

3. Enter an utterance in the text box and select Enter. You can type as many test utterances as you want in the **Test**, but only one utterance at a time.

4. The utterance, its top intent, and score are added to the list of utterances under the text box.

    ![Interactive testing identifies the wrong intent](./media/luis-how-to-interactive-test/test-weather-1.png)

## Clear test panel
To clear all the entered test utterances and their results from the test console, select **Start over** at the upper-left corner of the **Test panel**. 

## Close test panel
To close the **Test** panel, select the **Test** button again.

## Inspect score
You inspect details of the test result in the **Inspect** panel. 
 
1. With the **Test** slide-out panel open, select **Inspect** for an utterance you want to compare. 

    ![Inspect button](./media/luis-how-to-interactive-test/inspect.png)

2. The **Inspection** panel appears. The panel includes the top scoring intent as well as any identified entities. The panel shows the result of the selected utterance.

    ![Inspect button](./media/luis-how-to-interactive-test/inspect-panel.png)

## Correct top scoring intent

1. If the top scoring intent is incorrect, select the **Edit** button.

2.  In the drop-down list, select the correct intent for the utterance.

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

<!--Service name is 'Bing Spell Check v7 API' in the portal-->
## Additional settings in test panel

### LUIS endpoint
If you have several LUIS endpoints, use the **Additional Settings** link on the Test's Published pane to change the endpoint used for testing. If you are not sure which endpoint to use, select the default **Starter_Key**. 

![Test panel with Additional Settings link highlighted](./media/luis-how-to-interactive-test/interactive-with-spell-check-service-key.png)


### View Bing Spell Check corrections in test panel
Requirements to view the spelling corrections: 

* Published app
* Bing Spell Check [service key](https://azure.microsoft.com/try/cognitive-services/?api=spellcheck-api). The service key is not stored and needs to be reset for each browser session. 

Use the following procedure to include the [Bing Spell Check v7](https://azure.microsoft.com/services/cognitive-services/spell-check/) service  in the Test pane results. 

1. In the **Test** pane, enter an utterance. When the utterance is predicted, select **[Inspect](#inspect-score)** underneath the utterance you entered. 

2. When the **Inspect** panel opens, select **[Compare with Published](#compare-with-published-version)**. 

3. When the **Published** panel opens, select **[Additional Settings](#additional-settings-in-test-panel)**.

4. In the pop-up dialog, enter your **Bing Spell Check** service key. 
    ![Enter Bing Spell Check service key](./media/luis-how-to-interactive-test/interactive-with-spell-check-service-key.png)

5. Enter a query with an incorrect spelling such as `book flite to seattle` and select enter. The incorrect spelling of the word `flite` is replaced in the query sent to LUIS and the resulting JSON shows both the original query, as `query`, and the corrected spelling in the query, as `alteredQuery`.

    ![Corrected spelling JSON](./media/luis-how-to-interactive-test/interactive-with-spell-check-results.png)

<a name="json-file-with-no-duplicates"></a>
<a name="import-a-dataset-file-for-batch-testing"></a>
<a name="export-rename-delete-or-download-dataset"></a>
<a name="run-a-batch-test-on-your-trained-app"></a>
<a name="access-batch-test-result-details-in-a-visualized-view"></a>
<a name="filter-chart-results-by-intent-or-entity"></a>
<a name="investigate-false-sections"></a>
<a name="view single-point utterance data"></a>
<a name="relabel-utterances-and-retrain"></a>
<a name="false-test-results"></a>
## Batch testing
See batch testing [concepts](luis-concept-batch-test.md) and learn [how to](luis-how-to-batch-test.md) test a batch of utterances.

## Next steps

If testing indicates that your LUIS app doesn't recognize the correct intents and entities, you can work to improve your LUIS app's accuracy by labeling more utterances or adding features. 

* [Label suggested utterances with LUIS](luis-how-to-review-endoint-utt.md) 
* [Use features to improve your LUIS app's performance](luis-how-to-add-features.md) 
