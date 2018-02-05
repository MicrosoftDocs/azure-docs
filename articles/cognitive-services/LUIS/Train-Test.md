---
title: Train and test your LUIS app - Azure | Microsoft Docs
description: Use Language Understanding (LUIS) to continuously work on your application to refine it and improve its language understanding.
services: cognitive-services
author: DeniseMak
manager: rstand

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 02/02/2017
ms.author: v-demak;v-geberr;
---

# Train and test your LUIS app

Training is the process of teaching your Language Understanding (LUIS) app to improve its natural language understanding. You train your LUIS app after you make updates by adding, editing, labeling, or deleting entities, intents, or utterances. 

<!--
When you train a LUIS app by example, LUIS generalizes from the examples you have labeled, and it learns to recognize the relevant intents and entities. This teaches LUIS to improve classification accuracy in the future. -->

Training and [testing](luis-concept-test.md) an app is an iterative process. After you train your LUIS app, you test it with sample utterances to see if the intents and entities are recognized correctly. If they're not, make updates to the LUIS app, train, and test again. 

## Train your app
To start the iterative process of training, you first need to train your LUIS app at least once. 

1. Access your app by selecting its name on the **My Apps** page. 

2. In your app, select **Train** in the top panel. 

    ![Train button](./media/luis-how-to-train-test/train-button.png)

3. When training is complete, a green notification bar appears at the top of the browser.

    ![Train & Test App page](./media/luis-how-to-train-test/train-success.png)

<!-- The following note refers to what might cause the error message "Training failed: FewLabels for model: <ModelName>" -->

>[!NOTE]
>If you have one or more intents in your app that do not contain example utterances, you cannot train your app. Add utterances for all your intents. For more information, see [Add example utterances](Add-example-utterances.md).

<!-- anchors for H2 name changes -->
<a name="test-your-app"></a>
<a name="access-the-test-page"></a>
<a name="interactive-testing"></a>
## Test an utterance

1. Access your app by selecting its name on the **My Apps** page. 
2. Select **Test panel** in your application's top panel to access the **Test panel** slide-out panel.

    ![Train & Test App page](./media/luis-how-to-train-test/test.png)
3. Enter an utterance in the text box and select **Enter**. You can type as many test utterances as you want in the **Test panel**, but only one utterance at a time.
4. The utterance and its top intent and score are added to the list of utterances under the text box. 
    ![Interactive testing identifies the wrong intent](./media/luis-how-to-train-test/test-weather-1.png)

## Clear test panel
To clear all the entered test utterances and their results from the test console, select **Start over** at the upper-left corner of the **Test panel**. 

## Close test panel
To close the **Test** panel, select the **Test** button again.

## Inspect score
You inspect details of the test result in the **Inspect** panel. 
 
1. With the **Test** slide-out panel open, select **Inspect** for an utterance you want to compare. 

    ![Inspect button](./media/luis-how-to-train-test/inspect.png)

2. The **Inspection panel** appears. The panel includes the top scoring intent as well as any identified entities. The panel shows the result of the selected utterance.

    ![Inspect button](./media/luis-how-to-train-test/inspect-panel.png)
 
## Compare with published version
You can test the active version of your app with the published endpoint version. In the **Inspect** panel, select **Compare with published**. Any testing against the published model is deducted from your Azure subscription quota balance. 

![Compare with published](./media/luis-how-to-train-test/inspect-panel-compare.png)

## View endpoint JSON in test panel
You can view the endpoint JSON returned for the comparison by selecting the **Show JSON view**.

![Published JSON response](./media/luis-how-to-train-test/inspect-panel-compare-json.png)

<!--
## Relabel utterances and retrain
When you perform interactive testing, you might find that LUIS doesn't detect the intent or entities the way you expect for some utterances. The following steps walk you through relabeling an utterance and retraining.

### Relabel an utterance to retrain intents and entities
1. Import the sample LUIS app <a href="https://aka.ms/luis-travel-agent-01" target="_blank">Travel Agent - Sample 1</a>. This LUIS app has only a few sample utterances and provides a starting point for training. It has the following intents:
     * BookFlight
    * Weather.GetForecast
    * None 

2. Select the **Train** button in the top bar to train the new app.

3. On the **Test** panel, type in **buy a plane ticket to bangor me** and select Enter. Instead of the **BookFlight** intent, the test results show **Weather.GetForecast**.

    ![Interactive testing identifies the wrong intent](./media/luis-how-to-train-test/test-weather-1.png)

4. You need to teach LUIS that **buy a plane ticket to bangor me** should be mapped to the **BookFlight** intent. You teach LUIS about an utterance's intent by adding the utterance to the correct intent: 

      a. Go to the **Intents** page and select the **BookFlight** intent.

      b. Type **buy a plane ticket to bangor me** into the text box, and then select Enter. 

5. Select the **Train** button in the top bar to train the new app to retry LUIS with this new utterance.

6. Go back to the **Test** panel, type **book a flight to bangor** in the text box, and select Enter. 

    ![Interactive testing identifies the expected intent](./media/luis-how-to-train-test/test-weather-2.png)

   > [!NOTE]
   > In this step, you choose an utterance that's similar to the one you labeled, but *not* exactly the same. This similarity helps to test your LUIS app's ability to generalize.

7. Now the intent should be correctly detected as **BookFlight**. However, **bangor** isn't detected as a location yet.

    ![The intent is correctly identified but the location entity isn't detected](./media/luis-how-to-train-test/test-weather-2-no-entities.png)

8. You need to teach LUIS that **bangor me** in the utterance **buy a plane ticket to bangor me** should be mapped to the **Location** entity for Bangor, Maine: 

      a. Go to the **Intents** page, select the **BookFlight** intent, and find **buy a plane ticket to bangor me** in the list of utterances. 

      b. Select the words **bangor me** and choose the **Location** entity from the entity list.

      c. Select the **Location::ToLocation** hierarchical entity from the drop-down list.
 
    ![label the words bangor me as a Location entity](./media/luis-how-to-train-test/location-tolocation.png)

9. Select the **Train** button in the top bar to train the new app to retry LUIS with this new entity for that utterance.

10. After training succeeds, select **Test**, type **buy a plane ticket to paris** in the text box, and select Enter. Now the location entity is correctly detected.

    ![Testing identifies the location entity](./media/luis-how-to-train-test/test-weather-2-entity-detected.png)

> [!NOTE]
> In this step, you choose an utterance that's similar to the one you labeled, but *not* exactly the same. This similarity helps to test your LUIS app's ability to generalize.

### Perform interactive testing on current and published models
In this section, you publish the existing model, change the model, and then test an utterance to compare the published versus non-published model results.

1. Close the **Test** panel by selecting the **Test** button in the top bar. 

2. On the **Publish** page, publish your model. 

3. Select the **Test** button to reopen the **Test panel**.

4. Type **book me a flight to Boston tomorrow** as your test utterance and select Enter. The LUIS results of the test utterance in both the current and published models are shown in the following image: 

    ![Interactive testing of both current & published models](./media/luis-how-to-train-test/comparison.png)

If you are interactive testing on both trained and published models together, an entity might have a different prediction in each model.

-->


## Batch testing
With batch testing, you can run a comprehensive test on your current trained model to measure its performance in language understanding. In batch testing, you submit a large number of test utterances collectively in a batch file, known as a *dataset*. The dataset file should be written in JSON format and contain a maximum of 1,000 utterances. All you need to do is import this file to your app and run it to perform the test. Your LUIS app returns the result: detailed analysis of all utterances included in the batch.

You can import up to 10 dataset files to a single LUIS app. The utterances included in the dataset should be different from the example utterances you previously added while building your app. 
 
The following procedures guide you on how to import a dataset file, run a batch test on your current trained app by using the imported dataset, and access the test results in a detailed visualized view.

<a name="batch-testing"></a>
## Import a dataset file for batch testing

1. Select **Test** in the top bar, and then select **Batch testing panel**.

    ![Batch Testing Link](./media/luis-how-to-train-test/batch-testing-link.png)

2. Select **Import dataset**. The **Import new dataset** dialog box appears. Select **Choose File** and locate the JSON file that contains the utterances to test.

    ![Import Dataset File](./media/luis-how-to-train-test/batchtest-importset.png)

3. In the **Dataset Name** field, type a name for your dataset file. An example of the JSON in the batch file follows:

    ```JSON
[
    {
        "text": "go to paris",
        "intent": "BookFlight",
        "entities": [
            {
                "entityName": "location",
                "startPos": 6,
                "endPos": 10
            }
        ]
    },
    {
        "text": "drive me home",
        "intent": "None",
        "entities": []
    },
    {
        "text": "book me a flight to paris",
        "intent": "BookFlight",
        "entities": [
            {
                "entity": "Location::ToLocation",
                "startPos": 20,
                "endPos": 24
            }
        ]
    },
    {
        "text": "book a flight from seattle to hong kong",
        "intent": "BookFlight",
        "entities": [
            {
                "entity": "Location::FromLocation",
                "startPos": 19,
                "endPos": 25
            },
            {
                "entity": "Location::ToLocation",
                "startPos": 30,
                "endPos": 38
            }
        ]
    }
]
    ```

4. Select **Done**. The dataset file is added.

## Export, rename, delete, or download dataset
To export, rename, delete, or download the imported dataset, use the three dots (**...**) at the end of the dataset row.

![Dataset Actions](./media/luis-how-to-train-test/batch-testing-options.png)

### Run a batch test on your trained app

Select **Test** next to the dataset you've just imported. This displays the test result of the dataset.

![Batch Test Result](./media/luis-how-to-train-test/run-test.png)

In the preceding screenshot:
 
 - **State** of the dataset shows whether or not the dataset result contains errors. In the preceding example, an error sign is displayed, which indicates that there are errors in one or more utterances. If the test result contains no errors, a green sign displays instead. 
 - **Size** is the total number of utterances included in the dataset file.
 - **Last Run** is the date of the latest test run for this dataset. 
 - **Last Result** displays the percentage of correct predictions that result from the test.

## Access batch test result details in a visualized view
 
1. Select the **See results** link that appears after you run the test. A scatter graph known as an error matrix displays. The data points represent the utterances in the dataset. Green points indicate correct prediction, and red ones indicate incorrect prediction. 

    ![Visualized Batch Test Result](./media/luis-how-to-train-test/graph1.png) 

    >[!NOTE]
    >The filtering panel on the right side of the screen displays a list of all intents and entities in the app, with a green point for intents/entities that were predicted correctly in all dataset utterances, and a red point for those with errors. Also, for each intent/entity, you can see the number of correct predictions out of the total utterances. 
  
2. To filter the view by a specific intent/entity, select your target intent/entity in the filtering panel. The data points and their distribution update according to your selection. 
 
    ![Visualized Batch Test Result](./media/luis-how-to-train-test/filter-by-entity.png) 

    >[!NOTE]
    >Hover over a data point to see the certainty score of its prediction.
 
    The graph contains four sections that represent the possible cases of your application's prediction:

    - **True Positive (TP)**: The data points in this section represent utterances in which your app correctly predicted the existence of the target intent/entity. 
    - **True Negative (TN)**: The data points in this section represent utterances in which your app correctly predicted the absence of the target intent/entity.
    - **False Positive (FP)**: The data points in this section represent utterances in which your app incorrectly predicted the existence of the target intent/entity.
    - **False Negative (FN)**: The data points in this section represent utterances in which your app incorrectly predicted the absence of the target intent/entity.

    This means that data points on the **False Positive** and **False Negative** sections indicate errors, which should be investigated. On the other hand, if all data points are on the **True Positive** and **True Negative** sections, then your application's performance is perfect on this dataset.
 
3. Select a data point to retrieve its corresponding utterance in the utterances table at the bottom of the page. To display all utterances in a section, select the section title.
  
A batch test helps you view the performance of each intent and entity in your current trained model on a specific set of utterances. This helps you take appropriate actions, when required, to improve performance, such as adding more example utterances to an intent if your app frequently fails to identify it.

## Next steps

If testing indicates that your LUIS app doesn't recognize the correct intents and entities, you can work to improve your LUIS app's performance by labeling more utterances or adding features. 

* [Label suggested utterances with LUIS](Label-Suggested-Utterances.md) 
* [Use features to improve your LUIS app's performance](Add-Features.md) 

