---
title: "Inspect and evaluate data quality for Custom Speech - Speech Services"
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

# Inspect test data

> [!NOTE]
> This page assumes you've read [Prepare test data for Custom Speech](how-to-custom-speech-test-data.md) and have uploaded a dataset for inspection.

Custom Speech provides tools that allow you visually inspect recognition quality by aligning audio data with the corresponding recognition result, so that you can play back the audio and determine if the recognized text is correct, all from your browser. This allows you to evaluate recognition quality of Microsoft's baseline model or a custom model without having to transcribe any audio data.

On this page, you'll learn how to visually inspect the quality of Microsoft's baseline speech-to-text model and/or a custom model that you've trained. You'll use the data you uploaded to the **Data** tab for testing.

The following sections cover:

* How to create a test
* Side-by-side model comparisons
* Finding and resolving issues

<< THIS PROBABLY NEEDS TO BE ADJUSTED >>

## Create a test

Follow these instructions to create a test:

1. Navigate to **Speech-to-text/Custom Speech/Testing**.
2. Click **Add Test**.
3. Select **Inspect quality (Audio-only data)**. Give the test a name, description, and select your audio dataset.
4. Select up to two models that you'd like to test.
5. Click **Create**.

After test creations succeeds, you can compare the models side-by-side.

## Side-by-side model comparisons

When the test status is Succeeded, click in the test item name to gain more testing insights. You will see all the audios in your dataset has been recognized to speech with the model(s) you selected. You can play the audios and listen to the machine transcripts, to find out whether the selected model(s) quality is good to use.

For long audios, you may click in the certain audio item to playback the audio and inspect the transcript, by playing back the audio, the corresponding machine transcript sentence would be floating so that you can listen and see effectively.

If you have selected two models to test, you will see two columns of machine transcripts. You can choose one of the result to be the reference result, and the differentiations in the other transcript will be marked with color.  

Inspecting quality testing is useful in doing a sanity check to validate the quality of a speech recognition endpoint is enough for an application.  For an objective measure of accuracy, you will need to transcribe some audio and follow the instructions found in Testing: Evaluate Accuracy.

## Next steps

* [Inspect and evaluate your data quality](placeholder)
* [Train your model](placeholder)
* [Deploy your model](placeholder)
