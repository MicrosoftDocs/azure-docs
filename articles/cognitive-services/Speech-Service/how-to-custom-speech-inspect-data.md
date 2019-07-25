---
title: "Inspect data quality for Custom Speech - Speech Services"
titlesuffix: Azure Cognitive Services
description: "Custom Speech provides tools that allow you to visually inspect the recognition quality of a model by comparing audio data with the corresponding recognition result. From the Custom Speech portal, you can play back uploaded audio and determine if the provided recognition result is correct.  This tool allows you to quickly inspect quality of Microsoft's baseline speech-to-text model or a trained custom model without having to transcribe any audio data."
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 07/05/2019
ms.author: erhopf
---

# Inspect Custom Speech data

> [!NOTE]
> This page assumes you've read [Prepare test data for Custom Speech](how-to-custom-speech-test-data.md) and have uploaded a dataset for inspection.

Custom Speech provides tools that allow you to visually inspect the recognition quality of a model by comparing audio data with the corresponding recognition result. From the Custom Speech portal, you can play back uploaded audio and determine if the provided recognition result is correct. This tool allows you to quickly inspect quality of Microsoft's baseline speech-to-text model or a trained custom model without having to transcribe any audio data.

In this document, you'll learn how to visually inspect the quality of a model using the training data you previously uploaded.

On this page, you'll learn how to visually inspect the quality of Microsoft's baseline speech-to-text model and/or a custom model that you've trained. You'll use the data you uploaded to the **Data** tab for testing.

## Create a test

Follow these instructions to create a test:

1. Navigate to **Speech-to-text > Custom Speech > Testing**.
2. Click **Add Test**.
3. Select **Inspect quality (Audio-only data)**. Give the test a name, description, and select your audio dataset.
4. Select up to two models that you'd like to test.
5. Click **Create**.

After a test has been successfully created, you can compare the models side by side.

## Side-by-side model comparisons

When the test status is *Succeeded*, click in the test item name to see details of the test. This detail page lists all the utterances in your dataset, indicating the recognition results of the two models alongside the transcription from the submitted dataset.

To help inspect the side-by-side comparison, you can toggle various error types including insertion, deletion, and substitution. By listening to the audio and comparing recognition results in each column (showing human-labeled transcription and the results of two speech-to-text models), you can decide which model meets your needs and where improvements are needed.

Inspecting quality testing is useful to validate if the quality of a speech recognition endpoint is enough for an application.  For an objective measure of accuracy, requiring transcribed audio, follow the instructions found in [Evaluate Accuracy](how-to-custom-speech-evaluate-data.md).

## Next steps

* [Evaluate your data](how-to-custom-speech-evaluate-data.md)
* [Train your model](how-to-custom-speech-train-model.md)
* [Deploy your model](how-to-custom-speech-deploy-model.md)

## Additional resources

* [Prepare test data for Custom Speech](how-to-custom-speech-test-data.md)
