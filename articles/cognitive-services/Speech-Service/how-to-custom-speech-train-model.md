---
title: Train a model for Custom Speech - Speech service
titleSuffix: Azure Cognitive Services
description: Training a speech-to-text model can improve recognition accuracy for Microsoft's baseline model or a custom model. A model is trained using human-labeled transcriptions and related text.
services: cognitive-services
author: erhopf
manager: nitinme

ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 09/06/2019
ms.author: erhopf
---

# Train a model for Custom Speech

Training a speech-to-text model can improve recognition accuracy for Microsoft's baseline model. A model is trained using human-labeled transcriptions and related text. These datasets along with previously uploaded audio data, are used to refine and train the speech-to-text model.

## Use training to resolve accuracy issues

If you're encountering recognition issues with your model, using human-labeled transcripts and related data for additional training can help to improve accuracy. Use this table to determine which dataset to use to address your issue(s):

| Use case | Data type |
| -------- | --------- |
| Improve recognition accuracy on industry-specific vocabulary and grammar, such as medical terminology or IT jargon. | Related text (sentences/utterances) |
| Define the phonetic and displayed form of a word or term that has nonstandard pronunciation, such as product names or acronyms. | Related text (pronunciation) |
| Improve recognition accuracy on speaking styles, accents, or specific background noises. | Audio + human-labeled transcripts |

> [!IMPORTANT]
> If you haven't uploaded a data set, please see [Prepare and test your data](how-to-custom-speech-test-data.md). This document provides instructions for uploading data, and guidelines for creating high-quality datasets.

## Train and evaluate a model

The first step to train a model is to upload training data. Use [Prepare and test your data](how-to-custom-speech-test-data.md) for step-by-step instructions to prepare human-labeled transcriptions and related text (utterances and pronunciations). After you've uploaded training data, follow these instructions to start training your model:

1. Sign in to the [Custom Speech portal](https://speech.microsoft.com/customspeech).
2. Navigate to **Speech-to-text > Custom Speech > [name of project] > Training**.
3. Click **Train model**.
4. Next, give your training a **Name** and **Description**.
5. From the **Scenario and Baseline model** drop-down menu, select the scenario that best fits your domain. If you're unsure of which scenario to choose, select **General**. The baseline model is the starting point for training. The latest model is usually the best choice.
6. From the **Select training data** page, choose one or multiple audio + human-labeled transcription datasets that you'd like to use for training.
7. Once the training is complete, you can choose to perform accuracy testing on the newly trained model. This step is optional.
8. Select **Create** to build your custom model.

The Training table displays a new entry that corresponds to this newly created model. The table also displays the status: Processing, Succeeded, Failed.

## Evaluate the accuracy of a trained model

You can inspect the data and evaluate model accuracy using these documents:

- [Inspect your data](how-to-custom-speech-inspect-data.md)
- [Evaluate your data](how-to-custom-speech-evaluate-data.md)

If you chose to test accuracy, it's important to select an acoustic dataset that's different from the one you used with your model to get a realistic sense of the model's performance.

## Next steps

- [Deploy your model](how-to-custom-speech-deploy-model.md)

## Additional resources

- [Prepare and test your data](how-to-custom-speech-test-data.md)
- [Inspect your data](how-to-custom-speech-inspect-data.md)
- [Evaluate your data](how-to-custom-speech-evaluate-data.md)
- [Train your model](how-to-custom-speech-train-model.md)
