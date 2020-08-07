---
title: Inspect data quality for Custom Speech - Speech service
titleSuffix: Azure Cognitive Services
description: Custom Speech provides tools that allow you to visually inspect the recognition quality of a model by comparing audio data with the corresponding recognition result. You can play back uploaded audio and determine if the provided recognition result is correct.
services: cognitive-services
author: erhopf
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 12/02/2019
ms.author: erhopf
---

# Inspect Custom Speech data

> [!NOTE]
> This page assumes you've read [Prepare test data for Custom Speech](how-to-custom-speech-test-data.md) and have uploaded a dataset for inspection.

Custom Speech provides tools that allow you to visually inspect the recognition quality of a model by comparing audio data with the corresponding recognition result. From the [Custom Speech portal](https://speech.microsoft.com/customspeech), you can play back uploaded audio and determine if the provided recognition result is correct. This tool helps you inspect quality of Microsoft's baseline speech-to-text model, inspect a trained custom model, or compare transcription by two models.

In this document, you'll learn how to visually inspect the quality of a model using the training data you previously uploaded.

On this page, you'll learn how to visually inspect the quality of Microsoft's baseline speech-to-text model and/or a custom model that you've trained. You'll use the data you uploaded to the **Data** tab for testing.

## Create a test

Follow these instructions to create a test:

1. Sign in to the [Custom Speech portal](https://speech.microsoft.com/customspeech).
2. Navigate to **Speech-to-text > Custom Speech > [name of project] > Testing**.
3. Click **Add Test**.
4. Select **Inspect quality (Audio-only data)**. Give the test a name, description, and select your audio dataset.
5. Select up to two models that you'd like to test.
6. Click **Create**.

After a test has been successfully created, you can see how a model
transcribes the audio dataset you specified, or compare results from two models side by side.

[!INCLUDE [service-pricing-advisory](includes/service-pricing-advisory.md)]

## Side-by-side model comparisons

When the test status is _Succeeded_, click in the test item name to see details of the test. This detail page lists all the utterances in your dataset, and shows the recognition results of the two models you are comparing.

To help inspect the side-by-side comparison, you can toggle various error types including insertion, deletion, and substitution. By listening to the audio and comparing recognition results in each column (showing human-labeled transcription and the results of two speech-to-text models), you can decide which model meets your needs and where improvements are needed.

Side-by-side model testing is useful to validate which speech recognition model is best for an application. For an objective measure of accuracy, requiring transcribed audio, follow the instructions found in [Evaluate Accuracy](how-to-custom-speech-evaluate-data.md).

## Next steps

- [Evaluate your data](how-to-custom-speech-evaluate-data.md)
- [Train your model](how-to-custom-speech-train-model.md)
- [Improve your model](how-to-custom-speech-improve-accuracy.md)
- [Deploy your model](how-to-custom-speech-deploy-model.md)

## Additional resources

- [Prepare test data for Custom Speech](how-to-custom-speech-test-data.md)
