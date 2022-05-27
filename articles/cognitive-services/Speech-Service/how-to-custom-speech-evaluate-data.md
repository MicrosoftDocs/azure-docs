---
title: Test accuracy of a Custom Speech model - Speech service
titleSuffix: Azure Cognitive Services
description: In this article, you learn how to quantitatively measure and improve the quality of our speech-to-text model or your custom model.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: how-to
ms.date: 05/08/2022
ms.author: eur
ms.custom: ignite-fall-2021
---

# Test accuracy of a Custom Speech model

In this article, you learn how to quantitatively measure and improve the accuracy of the Microsoft speech-to-text model or your own custom models. [Audio + human-labeled transcript](how-to-custom-speech-test-and-train.md#audio--human-labeled-transcript-data-for-training-or-testing) data is required to test accuracy, and 30 minutes to 5 hours of representative audio should be provided. 

## Create a test

You can test the accuracy of your custom model by creating a test. A test requires a collection of audio files and their corresponding transcriptions. You can compare a custom model's accuracy a Microsoft speech-to-text base model or another custom model.

Follow these steps to create a test:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech).
1. Select **Custom Speech** > Your project name > **Test models**.
1. Select **Create new test**.
1. Select **Evaluate accuracy** > **Next**. 
1. Select one audio + human-labeled transcription dataset, and then select **Next**. If there aren't any datasets available, cancel the setup, and then go to the **Speech datasets** menu to [upload datasets](how-to-custom-speech-upload-data.md).
    
    > [!NOTE]
    > It's important to select an acoustic dataset that's different from the one you used with your model. This approach can provide a more realistic sense of the model's performance.

1. Select up to two models to evaluate, and then select **Next**.
1. Enter the test name and description, and then select **Next**.
1. Review the test details, and then select **Save and close**.

After your test has been successfully created, you can compare the [word error rate (WER)](#evaluate-word-error-rate) and recognition results side by side.

## Side-by-side comparison

After the test is complete, as indicated by the status change to *Succeeded*, you'll find a WER number for both models included in your test. Select the test name to view the test details page. This page lists all the utterances in your dataset and the recognition results of the two models, alongside the transcription from the submitted dataset. 

To inspect the side-by-side comparison, you can toggle various error types, including insertion, deletion, and substitution. By listening to the audio and comparing recognition results in each column, which display the human-labeled transcription and the results for two speech-to-text models, you can decide which model meets your needs and determine where additional training and improvements are required.

## Evaluate word error rate

The industry standard for measuring model accuracy is [word error rate (WER)](https://en.wikipedia.org/wiki/Word_error_rate). WER counts the number of incorrect words identified during recognition, divides the sum by the total number of words provided in the human-labeled transcript (shown in the following formula as N), and then multiplies that quotient by 100 to calculate the error rate as a percentage.

![Screenshot showing the WER formula.](./media/custom-speech/custom-speech-wer-formula.png)

Incorrectly identified words fall into three categories:

* Insertion (I): Words that are incorrectly added in the hypothesis transcript
* Deletion (D): Words that are undetected in the hypothesis transcript
* Substitution (S): Words that were substituted between reference and hypothesis

Here's an example:

![Screenshot showing an example of incorrectly identified words.](./media/custom-speech/custom-speech-dis-words.png)

If you want to replicate WER measurements locally, you can use the sclite tool from the [NIST Scoring Toolkit (SCTK)](https://github.com/usnistgov/SCTK).

## Resolve errors and improve WER

You can use the WER calculation from the machine recognition results to evaluate the quality of the model you're using with your app, tool, or product. A WER of 5-10% is considered to be good quality and is ready to use. A WER of 20% is acceptable, but you might want to consider additional training. A WER of 30% or more signals poor quality and requires customization and training.

How the errors are distributed is important. When many deletion errors are encountered, it's usually because of weak audio signal strength. To resolve this issue, you need to collect audio data closer to the source. Insertion errors mean that the audio was recorded in a noisy environment and crosstalk might be present, causing recognition issues. Substitution errors are often encountered when an insufficient sample of domain-specific terms has been provided as either human-labeled transcriptions or related text.

By analyzing individual files, you can determine what type of errors exist, and which errors are unique to a specific file. Understanding issues at the file level will help you target improvements.

## Example scenario outcomes

Speech recognition scenarios vary by audio quality and language (vocabulary and speaking style). The following table examines four common scenarios:

| Scenario | Audio quality | Vocabulary | Speaking style |
|----------|---------------|------------|----------------|
| Call center | Low, 8&nbsp;kHz, could be two people on one audio channel, could be compressed | Narrow, unique to domain and products | Conversational, loosely structured |
| Voice assistant, such as Cortana, or a drive-through window | High, 16&nbsp;kHz | Entity-heavy (song titles, products, locations) | Clearly stated words and phrases |
| Dictation (instant message, notes, search) | High, 16&nbsp;kHz | Varied | Note-taking |
| Video closed captioning | Varied, including varied microphone use, added music | Varied, from meetings, recited speech, musical lyrics | Read, prepared, or loosely structured |

Different scenarios produce different quality outcomes. The following table examines how content from these four scenarios rates in the [WER](how-to-custom-speech-evaluate-data.md). The table shows which error types are most common in each scenario. The insertion, substitution, and deletion error rates help you determine what kind of data to add to improve the model.

| Scenario | Speech recognition quality | Insertion errors | Deletion errors | Substitution errors |
|--- |--- |--- |--- |--- |
| Call center | Medium<br>(<&nbsp;30%&nbsp;WER) | Low, except when other people talk in the background | Can be high. Call centers can be noisy, and overlapping speakers can confuse the model | Medium. Products and people's names can cause these errors |
| Voice assistant | High<br>(can be <&nbsp;10%&nbsp;WER) | Low | Low | Medium, due to song titles, product names, or locations |
| Dictation | High<br>(can be <&nbsp;10%&nbsp;WER) | Low | Low | High |
| Video closed captioning | Depends on video type (can be <&nbsp;50%&nbsp;WER) | Low | Can be high because of music, noises, microphone quality | Jargon might cause these errors |


## Next steps

* [Train a model](how-to-custom-speech-train-model.md)
* [Deploy a model](how-to-custom-speech-deploy-model.md)
* [Use the online transcription editor](how-to-custom-speech-transcription-editor.md)
