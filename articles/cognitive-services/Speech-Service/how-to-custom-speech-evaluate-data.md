---
title: "Evaluate accuracy for Custom Speech - Speech Services"
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

# Evaluate Custom Speech accuracy

In this document you'll learn how to quantitatively measure the quality of Microsoft's speech-to-text model or your custom model. Audio + human-labeled transcription data is required to test accuracy, and 30 minutes to 5 hours of representative audio should be provided.

## What is Word Error Rate (WER)?

The industry standard to measure model accuracy is *Word Error Rate* (WER). WER counts the number of incorrect words identified during recognition, then divides by the total number of word provided in the human-labeled transcript. Finally, that number is multiplied by 100% to calculate the WER.

![WER formula](./media/custom-speech/custom-speech-wer-formula.png)

Incorrectly identified words fall into three categories:

* Insertion (I): Words that are incorrectly added in the hypothesis transcript
* Deletion (D): Words that are undetected in the hypothesis transcript
* Substitution (S): Words that were substituted between reference and hypothesis

Here's an example:

![Example of incorrectly identified words](./media/custom-speech/custom-speech-dis-words.png)

## Resolve errors and improve WER

You can use the WER from the machine recognition results to evaluate the quality of the model you are using with your app, tool, or product. A WER of 5%-10% is considered to be good quality and is ready to use. A WER of 20% is generally acceptable, however you may want to consider additional training. A WER of 30% or more signals poor quality and requires customization and training.

How the errors are distributed is important. When many deletion errors are encountered, it's usually due to weak audio signal strength. To resolve this issue, you'll need to collect audio data closer to the source. Insertion errors mean that the audio was recorded in a noisy environment and crosstalk may be present, causing recognition issues. Substitution errors are usually encountered when an insufficient sample of domain-specific terms have been provided as either human-labeled transcriptions or related text.

Moreover, you may drill down to file details and look at individual files to get a sense which type of errors exist, so that you can pick out some typical cases and get specific targets to improve.

## Side-by-side comparison

Choosing two models during accuracy evaluation enables side-by-side comparison of those models, allowing you to compare WER and inspect recognition results. In most cases it is recommended to test between a custom model and a baseline, helping you understand how the custom model benefited from your training data. Side-by-side comparison can also be used between two custom models to determine which is best for certain categories of data.

To create a test that offers side-by-side comparison, start by navigating to the 'Testing' tab and click 'Add test'. Select the 'Evaluate Accuracy' option and enter a name and description for your test. Next, select the appropriate audio + transcription data as your testing data, this will be used as the input audio that the speech-to-text models will attempt to recognize. Finally, select the custom model you want to test, along with a baseline model or another custom model, before creating the test.

Once the test has completed (indicated by the 'Succeeded' status in the table of tests) you will find a WER number for both models included in your test. Click on the test name to view the testing detail page. This detail page lists all the utterances in your dataset, indicating the recognition results of the two models alongside the transcription from the submitted dataset. To help inspect the side-by-side comparison, you can toggle various error types including insertion, deletion, and substitution. It is recommended to play the associated audio files, especially for long audio files, during your inspection by clicking the 'Play' icon and listening to the original audio. By listening to the audio and comparing recognition results in each column (showing human-labeled transcription and the results of two speech-to-text models), you can decide which model meets your needs and where improvements are needed.

## Next steps

* [Train your model](how-to-custom-speech-train-model.md)
* [Deploy your model](how-to-custom-speech-deploy-model.md)

## Additional resources

* [Prepare and test your data](how-to-custom-speech-test-data.md)
* [Inspect your data](how-to-custom-speech-inspect-data.md)
