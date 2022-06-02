---
title: Test recognition quality of a Custom Speech model - Speech service
titleSuffix: Azure Cognitive Services
description: Custom Speech lets you qualitatively inspect the recognition quality of a model. You can play back uploaded audio and determine if the provided recognition result is correct.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 05/08/2022
ms.author: eur
---

# Test recognition quality of a Custom Speech model

You can inspect the recognition quality of a Custom Speech model in the [Speech Studio](https://aka.ms/speechstudio/customspeech). You can play back uploaded audio and determine if the provided recognition result is correct. After a test has been successfully created, you can see how a model transcribed the audio dataset, or compare results from two models side by side.

> [!TIP]
> You can also use the [online transcription editor](how-to-custom-speech-transcription-editor.md) to create and refine labeled audio datasets.

## Create a test

Follow these instructions to create a test:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech).
1. Navigate to **Speech Studio** > **Custom Speech** and select your project name from the list.
1. Select **Test models** > **Create new test**.
1. Select **Inspect quality (Audio-only data)** > **Next**. 
1. Choose an audio dataset that you'd like to use for testing, and then select **Next**. If there aren't any datasets available, cancel the setup, and then go to the **Speech datasets** menu to [upload datasets](how-to-custom-speech-upload-data.md).

    :::image type="content" source="media/custom-speech/custom-speech-choose-test-data.png" alt-text="Review your keyword":::

1. Choose one or two models to evaluate and compare accuracy.
1. Enter the test name and description, and then select **Next**.
1. Review your settings, and then select **Save and close**.

[!INCLUDE [service-pricing-advisory](includes/service-pricing-advisory.md)]



## Side-by-side model comparisons

When the test status is *Succeeded*, select the test item name to see details of the test. This detail page lists all the utterances in your dataset, and shows the recognition results of the two models you are comparing.

To help inspect the side-by-side comparison, you can toggle various error types including insertion, deletion, and substitution. By listening to the audio and comparing recognition results in each column (showing human-labeled transcription and the results of two speech-to-text models), you can decide which model meets your needs and where improvements are needed.

Side-by-side model testing is useful to validate which speech recognition model is best for an application. For an objective measure of accuracy, requiring transcribed audio, see [Test model quantitatively](how-to-custom-speech-evaluate-data.md).

## Next steps

- [Test model quantitatively](how-to-custom-speech-evaluate-data.md)
- [Train your model](how-to-custom-speech-train-model.md)
- [Deploy your model](./how-to-custom-speech-train-model.md)

