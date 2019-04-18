---
title: "Train a model for Custom Speech - Speech Services"
titlesuffix: Azure Cognitive Services
description: TBD
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: erhopf
---

# Train a model

**<< TODO - Erik: edit/rephrase >>**

Training a speech recognition model is necessary to improve its accuracy.  This is done by taking Audio+human-labeled transcript and/or Related Text datasets uploaded to Data and having the machine incorporate into its model.  The more in-domain datasets you incorporate (data that is related to what users will speak into your application) in training the better the trained model will perform.  But likewise if you incorporate unrelated data, it may hurt accuracy.

## Resolve accuracy issues

Adding different datasets to training helps resolve accuracy issues.  Use the guide below to determine which datasets to add to train your model.

| Use case | Data type | Data quantity |
|----------|-----------|---------------|
| Proper names are misrecognized | Relate text (sentences/utterances) | 10MB to 500MB |
| Words are misrecognized because of an accent | Related text (pronunciation) | Provide the misrecognized words |
| Common words are deleted or completely misrecognized | Audio + human-labeled transcripts | 10 to 1,000 transcription hours |

> [!IMPORTANT]
> If you haven't uploaded a data set, please see [Prepare and test your data](how-to-custom-speech-test-data.md). This document provides instructions for uploading data, and guidelines for creating high-quality datasets.

## Train and evaluate a model

**<< TODO - Erik: edit/rephrase >>**

Once you have uploaded the training data, click Train model button in the Training tab to start a new model customization.

First and as always, give your model a name with some suggestive description. Next, in the Scenario and Baseline model drop-down list, select a scenario that fits your business domain. If you are not sure about the scenario, just select “General”. The baseline model is the starting point for your customization. You may use the latest one if you don’t have any preference here.

Next, in the Select training data page, select one or multiple audio + transcript datasets that you want to use to perform the customization.

When the processing is complete, you can optionally choose to perform accuracy testing of your new model in the next step. If so, in the next page, choose a testing type. As before, Inspect quality requires only audio data as test set;  Evaluate accuracy requires audio and transcript data as test set, which will give you a quantitated error rate to help you evaluate whether the model is better than others. The testing steps are similar to training steps, you will enter a test name with descriptions, and select the certain type of test data.
If you perform accuracy testing, to get a realistic sense of the model’s performance, it's important to select an acoustic dataset that's different from the one you used for the model creation. Testing the accuracy on the training data doesn't allow you to evaluate how the adapted model performs under real conditions. The result will be too optimistic.

When you're ready to start running the customization process, select Create.
The Training table displays a new entry that corresponds to this new model. The table also displays the status of the process:  Processing, Succeeded, or Failed.

## Next steps

* [Deploy your model](placeholder)
