---
title: Test recognition quality of a Custom Speech model - Speech service
titleSuffix: Azure Cognitive Services
description: Custom Speech lets you visually inspect the recognition quality of a model. You can play back uploaded audio and determine if the provided recognition result is correct.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 02/12/2021
ms.author: eur
---

# Test recognition quality of a Custom Speech model

Custom Speech lets you visually inspect the recognition quality of a model in the [Speech Studio](https://aka.ms/speechstudio/customspeech). You can play back uploaded audio and determine if the provided recognition result is correct. This tool helps you inspect quality of Microsoft's baseline speech-to-text model, inspect a trained custom model, or compare transcription by two models.

This article describes how to visually inspect the quality of Microsoft's baseline speech-to-text model or custom models that you've trained. You'll also see how to use the online transcription editor to create and refine labeled audio datasets.

## Prerequisites

You've read [Prepare test data for Custom Speech](./how-to-custom-speech-test-and-train.md) and have uploaded a dataset for inspection.

## Create a test

Follow these instructions to create a test:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech).
1. Navigate to **Speech Studio** > **Custom Speech** and select your project name from the list.
1. Select **Test models** > **Create new test**.
1. Select **Inspect quality (Audio-only data)** > **Next**. 
1. Choose an audio dataset that you'd like to use for testing, then select **Next**.

    :::image type="content" source="media/custom-speech/custom-speech-choose-test-data.png" alt-text="Review your keyword":::

1. Choose one or two models to evaluate and compare accuracy.
1. Enter the test name and description, then select **Next**.
1. Review your settings, then select **Save and close**.

After a test has been successfully created, you can see how a model transcribes the audio dataset you specified, or compare results from two models side by side.

[!INCLUDE [service-pricing-advisory](includes/service-pricing-advisory.md)]

## Side-by-side model comparisons

When the test status is _Succeeded_, select the test item name to see details of the test. This detail page lists all the utterances in your dataset, and shows the recognition results of the two models you are comparing.

To help inspect the side-by-side comparison, you can toggle various error types including insertion, deletion, and substitution. By listening to the audio and comparing recognition results in each column (showing human-labeled transcription and the results of two speech-to-text models), you can decide which model meets your needs and where improvements are needed.

Side-by-side model testing is useful to validate which speech recognition model is best for an application. For an objective measure of accuracy, requiring transcribed audio, follow the instructions found in [Evaluate Accuracy](how-to-custom-speech-evaluate-data.md).

## Online transcription editor

The online transcription editor allows you to easily work with audio transcriptions in Custom Speech. The main use cases of the editor are as follows: 

* You only have audio data, but want to build accurate audio + human-labeled datasets from scratch to use in model training.
* You already have audio + human-labeled datasets, but there are errors or defects in the transcription. The editor allows you to quickly modify the transcriptions to get best training accuracy.

The only requirement to use the transcription editor is to have audio data uploaded (either audio-only, or audio + transcription).

### Import datasets to Editor

To import data into the Editor, first navigate to **Custom Speech > [Your project] > Speech datasets > Editor**

:::image type="content" source="media/custom-speech/custom-speech-editor.png" alt-text="Custom speech editor":::

Next, use the following steps to import data.

1. Select **Import data**
1. Create a new dataset(s) and give it a description
1. Select datasets. You can select audio data only, audio + human-labeled data, or both.
1. For audio-only data, you can use the default models to automatically generate machine transcription after importing to the editor.
1. Select **Import**

After data has been successfully imported, you can select datasets and start editing.

> [!TIP]
> You can also import datasets into the Editor directly by selecting datasets and selecting **Export to Editor**

### Edit transcription by listening to audio

After the data upload has succeeded, select each item name to see details of the data. You can also use **Previous** and **Next** to move between each file.

The detail page lists all the segments in each audio file, and you can select the desired utterance. For each utterance, you can play back the audio and examine the transcripts, and edit the transcriptions if you find any insertion, deletion, or substitution errors. See the [data evaluation how-to](how-to-custom-speech-evaluate-data.md) for more detail on error types.

:::image type="content" source="media/custom-speech/custom-speech-editor-detail.png" alt-text="Custom speech editor details":::

After you've made edits, select **Save**.

### Export datasets from the Editor

To export datasets back to the **Data** tab, navigate to the data detail page and select  **Export** to export all the files as a new dataset. You can also filter the files by last edited time, audio durations, etc. to partially select the desired files. 

The files exported to Data will be used as a brand-new dataset and will not affect any of the existing data/training/testing entities.

## Next steps

- [Evaluate your data](how-to-custom-speech-evaluate-data.md)
- [Train your model](how-to-custom-speech-train-model.md)
- [Improve your model](./how-to-custom-speech-evaluate-data.md)
- [Deploy your model](./how-to-custom-speech-train-model.md)

## Additional resources

- [Prepare test data for Custom Speech](./how-to-custom-speech-test-and-train.md)
