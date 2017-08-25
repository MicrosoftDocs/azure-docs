---
title: Train and test your LUIS app | Microsoft Docs
description: Use Language Understanding Intelligent Services (LUIS) to continuously work on your application to refine it and improve its language understanding.
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 03/01/2017
ms.author: cahann
---

# Train and test your app

## Train to teach your app
You should continuously work on your application to refine it and improve its language understanding. If you make updates by adding, editing, or deleting entities, intents, or utterances to your LUIS app, you need to train your app before testing and publishing. When you train a LUIS app, LUIS generalizes from the examples you have labeled, and learns to recognize the relevant intents and entities in the future, which improves its classification accuracy. 

Training and testing is an iterative process. After you train your LUIS app, you test it with sample utterances to see if the intents and entities are recognized correctly. If not, make updates to the LUIS app, train and test again. 

Typically, before retraining, you will want to relabel any utterances in which LUIS failed to identify the expected intents and entities. You can find the utterances to relabel using the following procedures:
 
  * **Interactive testing**: The [interactive testing pane](#interactive-testing) lets you type in an utterance and displays the intents and entities that your LUIS app detects.
  * **Suggested utterances**: Relabeling suggested utterances that LUIS identifies for you.
  * **Review utterances from users**: LUIS provides a log of all utterances from users that have been passed to the LUIS app endpoint. This log includes the intents and entities you can review to see if they've been correctly identified.
  

In addition to relabeling utterances, you may also try adding new utterances, editing the intent or entity types, and adding features to your LUIS app to improve performance. <!-- (add this if we have content showing a performance increase) or adding composite or list entities. -->

### Train your current model
To start the iterative process of training, you first need to train your LUIS app at least once. 

1. Access your app by clicking its name on **My Apps** page. 

2. In your app, click **Train & Test** in the left panel. 
3. On the **Test App** page, click **Train Application** to train the LUIS app on the latest updates.

    ![Train & Test App page](./Images/Train_Test-app.JPG)

<!-- The following note refers to what might cause the error message "Training failed: FewLabels for model: <ModelName>" -->

    >[!NOTE]
    >If you have one or more intents in your app that do not contain example utterances, you cannot train your app until you add utterances for all your intents. For more information, see [Add example utterances](Add-example-utterances.md).

## Test your app
LUIS provides two types of testing: interactive testing and batch testing. You can use either of them by using the corresponding tab on the **Test App** page.

### Access the Test App page

1. Access your app  by clicking its name on **My Apps** page, 
2. Click **Train & Test** in your application's left panel to access the **Test App** page. 

- If you haven't already trained your current model on recent updates, then your test page looks like this screenshot:

    ![Train app before testing](./Images/TestApp-trainfirst.JPG)
- If your model is trained, your test page looks like this screenshot:

    ![Train & Test App page](./Images/Train_Test-app.JPG)


## Interactive Testing
Interactive testing enables you to test both the current and published versions of your app and compare their results in one screen. Interactive testing runs by default on the current trained model only. For a published model, interactive testing is disabled and needs your action to enable it, because it is counted in hits and will be deducted from your key balance. 

The **Interactive Testing** tab is divided into two sections (as in the screenshot):

![Train & Test App page](./Images/Train_Test-app.JPG)

* **The test view**, on the left side of the screen, where you can type the test utterance in the text box and press Enter to submit it to your app. 

* **The result view**, on the right side of the screen, where your LUIS app returns the test result, which is the predicted interpretation of the utterance. 

In an interactive test, you submit individual test utterances and view the returned result for each utterance separately. 

### Perform interactive testing on the current model
<!-- TODO: Add explicit example here that can start with a JSON file to import. We should demonstrate both labeling an intent that's mislabeled, or an entity that isn't recognized. -->
The following screenshot shows how test results appear in the **Interactive Testing** tab, in which "book me a flight to Boston tomorrow" is entered as a test utterance:

    ![Interactive testing of current model](./Images/TestApp-interactive-current.JPG)

 The testing result includes the top scoring intent identified in the utterance, with its certainty score, as well as other intents existing in your model with their certainty scores. The identified entities will also be displayed within the utterance and you can control their view by selecting your preferred view from the **Labels view** list at the top of the test console.

### Example: Relabel and retrain utterances
When you perform interactive testing, you may find that LUIS doesn't detect the intent or entities that you expect in some utterances. The following steps walk you through relabeling an utterance and retraining.

#### Relabel an intent
1. Import the sample LUIS app [Travel Agent - Sample 1](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/Examples-BookFlight/travel-agent-sample-01.json). This LUIS app has only a few sample utterances and is meant to provides a starting point for training. It has the following intents:
 * BookFlight
 * Weather.GetForecast
 * None 

2. On the **Test App** page, in the **Interactive Testing** tab, type in `buy a plane ticket to bangor me` and press Enter. Instead of the `BookFlight` intent, the test results show `Weather.GetForecast`.

    ![Interactive testing identifies the wrong intent](./media/interactive-incorrect-intent.png)

3. To teach LUIS that `buy a plane ticket to bangor me` should be mapped to the `BookFlight` intent instead of `Weather.GetForecast`, go to the **Intents** page, click the **BookFlight** intent, type "buy a plane ticket to bangor me" into the text box, and press Enter. Click **Save**.

4. Go back to the **Train & Test** page and click **Train application**.

5. Type `buy a plane ticket to bangor me` in the text box and click enter. Now the intent should be correctly detected as `BookFlight`.

#### Relabel an entity
1. Import the sample LUIS app [Choose a color - Sample 1](https://github.com/Microsoft/LUIS-Samples/blob/master/documentation-samples/Examples-Colors/sample-choose-color-01.json). This LUIS app has a "RequestColorItem" intent that is supposed to recognize requests like "Find me a blue shirt" and  extract a color entity.

2. On the **Test App** page, in the **Interactive Testing** tab, type in `find brown shoes` and press Enter. Notice that the test results didn't recognize `brown` as a color entity.

    ![Interactive testing fails to recognize an entity](./media/interactive-no-entity.png)


3. Now you need to teach LUIS that `brown` in the utterance `find brown shoes` should be mapped to the `color` entity. Go to the **Intents** page, click the **RequestColorItem** intent, type "find brown shoes" into the text box, and press Enter. 

4. Click on the word `brown` and choose the **color** entity from the drop-down list. Click **Save**.
    ![label the word brown as a color entity](./media/interactive-label-entity.png)

5. Go back to the **Train & Test** page and click **Train application**.

6. Type `find brown shoes` in the text box and click enter. Now the color entity should be correctly detected.
    ![Testing identifies the brown as a color entity](./media/interactive-corrected-entity.png)

<!-- TIP: The confidence score has also increased. -->

### Perform interactive testing on current and published models

1. On the **Test App** page, **Interactive Testing** tab, click **Enable published model** check box and then click **Yes** in the following confirmation message:

    ![Confirm Published Model Test](./Images/TestApp-ConfirmPublishedTest.JPG)

    >[!NOTE] 
    >If you do not have a published version of your application, the **Enable published model** check box will be disabled. 

2. Type "book me a flight to Boston tomorrow" as your test utterance and press Enter. The result view on the right side will be split horizontally into two parts (as in the following screenshot) to display results of the test utterance in both the current and published models. 

    ![Interactive testing of both current & published models](./Images/TestApp-interactive-both.JPG)
3. To view the test result of your published app in JSON format, click **Raw JSON view**. This looks like the following screenshot.

    ![Published model test result in JSON format](./Images/TestApp-JSON-result.JPG)

In case of interactive testing on both trained and published models together, an entity may have a different prediction in each model. In the test result, this entity will be distinguished by a red underline. If you hover over the underlined entity, you can view the entity prediction in both trained and published models.

![Different entity prediction in both models](./Images/TestApp-interactive-both-diffentity.JPG)

>[!NOTE]
>About the interactive testing console:
 >- You can type as many test utterances as you want in the test view; only one utterance at a time.
 >- The result view shows the result of the latest utterance. 
 >- To review the result of a previous utterance, just click it in the test view and its result will be displayed on the right. 
 >- To clear all the entered test utterances and their results from the test console, click **Reset Console** on the top right corner of the console. 


## Batch Testing
Batch testing enables you to run a comprehensive test on your current trained model to measure its performance in language understanding. In batch testing, you submit a large number of test utterances collectively in a batch file, known as a *dataset*. The dataset file should be written in JSON format and contains a maximum of 1000 utterances. All you need to do is to import this file to your app and run it to perform the test. Your LUIS app will return the result, enabling you to access detailed analysis of all utterances included in the batch.

You can import up to 10 dataset files to a single LUIS app. It is recommended that the utterances included in the dataset should be different from the example utterances you previously added while building your app. 
 
The following procedures will guide you on how to import a dataset file, run a batch test on your current trained app using the imported dataset, and finally to access the test results in a detailed visualized view.

### Import a dataset file

1. On the **Test App** page, click **Batch Testing**, and then click **Import dataset**. The **Import dataset** dialog box appears.

    ![Import Dataset File](./Images/BatchTest-importset.JPG)

2. In **Dataset name**, type a name for your dataset file (For example "DataSet1").

3. To learn more about the supported syntax for dataset files to be imported, click **learn about the supported dataset syntax link**. The **Import dataset** dialog box will be expanded displaying the allowed syntax. To collapse the dialog and hide syntax, just click the link again.

    ![Dataset Allowed Syntax](./Images/BatchTest-datasetSyntx.JPG)

4. Click **Choose File** to choose the dataset file you want to import, and then click **Save**. The dataset file will be added.

    ![List of datasets](./Images/BatchTest-datasetList.JPG)

5. To rename, delete or download the imported dataset, you can use these buttons respectively: **Rename Dataset** ![Rename Dataset button](./Images/Rename-Intent-btn.JPG), **Delete Dataset** ![Delete Dataset button](./Images/trashbin-button.JPG) and **Download Dataset JSON** ![Download Dataset button](./Images/BatchTest-downloadDataset.JPG).

### Run a batch test on your trained app

- Click **Test** next to the dataset you've just imported. Soon, the test result of the dataset will be displayed.

    ![Batch Test Result](./Images/BatchTest-result.JPG)

    In the above screenshot:
 
    - **Status** of the dataset shows whether or not the dataset result contains errors. In the above example, an error sign is displayed indicating that there are errors in one or more utterances. If the test result contains no errors, a green sign will be displayed instead. 
    - **Utterance Count** is the total number of utterances included in the dataset file.
    - **Last Test Date** is the date of the latest test run for this dataset. 
    - **Last Test Success** displays the percentage of correct predictions resulting from the test.

### Access test result details in a visualized view
 
1. Click the **See results** link that appears as a result of running the test (see the above screenshot). A scatter graph (confusion matrix) is displayed, where the data points represent the utterances in the dataset. Green points indicate correct prediction and red ones indicate incorrect prediction. 

    ![Visualized Batch Test Result](./Images/BatchTest-resultgraph.JPG) 

    >[!NOTE]
    >The filtering panel on the right side of the screen displays a list of all intents and entities in the app, with a green point for intents/entities which were predicted correctly in all dataset utterances, and a red one for those with errors. Also, for each intent/entity, you can see the number of correct predictions out of the total utterances. For example, in the above screenshot, the entity "Location (4/9)" has 4 correct predictions out of 9, so it has 5 errors.
  
2. To filter the view by a specific intent/entity, click on your target intent/entity in the filtering panel. The data points and their distribution will be updated according to your selection. For example, the following screenshot displays results for the "GetWeather" intent.
 
    ![Visualized Batch Test Result](./Images/BatchTest-resultgraph2.JPG) 

    >[!NOTE]
    >Hovering over a data point shows the certainty score of its prediction.
 
    The graph contains 4 sections representing the possible cases of your application's prediction:

    - **True Positive (TP):** The data points in this section represent utterances in which your app correctly predicted the existence of the target intent/entity. 
    - **True Negative (TN):** The data points in this section represent utterances in which your app correctly predicted the absence of the target intent/entity.
    - **False Positive (FP):** The data points in this section represent utterances in which your app incorrectly predicted the existence of the target intent/entity.
    - **False Negative (FN):** The data points in this section represent utterances in which your app incorrectly predicted the absence of the target intent/entity.

    This means that data points on the **False Positive** & **False Negative** sections indicate errors, which should be investigated. On the other hand, if all data points are on the **True Positive** and **True Negative** sections, then your application's performance is perfect on this dataset.
 
3. Click a data point to retrieve its corresponding utterance in the utterances table at the bottom of the page. To display all utterances in a section, click the section title (e.g. True Positive, False Negative, ..etc.) 

    For example, the following screenshot shows the results for the "None" intent when one of its data points is clicked, so the utterance "weather forecast for tomorrow" is displayed. This utterance falls under the **True Negative** section as your app correctly predicted that the "None" intent is not present in this utterance. 

    ![Visualized Batch Test Result](./Images/BatchTest-resultgraph3.JPG) 
  
Thus, a batch test helps you view the performance of each intent and entity in your current trained model on a specific set of utterances. This helps you take appropriate actions, when required, to improve performance, such as adding more example utterances to an intent if your app frequently fails to identify it.

## Next steps

If testing indicates that your LUIS app doesn't recognize the correct intents and entities, you can try to improve your LUIS app's performance by labeling more utterances or adding features. 

* [Label suggested utterances with LUIS](Label-Suggested-Utterances.md) 
* [Use features to improve your LUIS app's performance](Add-Features.md) 
