---
title: Train a Custom Speech model - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to train Custom Speech models. Training a speech-to-text model can improve recognition accuracy for the Microsoft baseline model or a custom model.
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

# Train a Custom Speech model

In this article, you'll learn how to train Custom Speech models. Training a speech-to-text model can improve recognition accuracy for the Microsoft baseline model. You use human-labeled transcriptions and related text to train a model. And you use these datasets, along with previously uploaded audio data, to refine and train the speech-to-text model.

> [!NOTE]
> You pay to use Custom Speech models, but you are not charged for training a model.

## Train and evaluate a model

The first step in training a model is to upload [training and testing datasets](./how-to-custom-speech-test-and-train.md). After you upload training data, follow these instructions to start training your model:

You will first select a baseline model that is the starting point for a new model. Then select the datasets you’d like to use for training. It can take several minutes to generate the new model.

1. Sign in to the [Speech Studio](https://speech.microsoft.com/customspeech). If you plan to train a model with audio + human-labeled transcription datasets, pick a Speech subscription in a region with dedicated hardware for training.

1. Select **Custom Speech** > Your project name > **Train custom models**.
1. Select **Train a new model**.
1. On the **Select a baseline model** page, select a baseline model, and then select **Next**. If you are unsure, select the most recent model from the top of the list. 

    > [!NOTE]
    > Take note of the **Expiration for adaptation** date. This is the last date that you can use the model for training. For more information, see [Model and endpoint lifecycle](./how-to-custom-speech-model-and-endpoint-lifecycle.md).

1. On the **Choose data** page, select one or more datasets that you want to use for training. If there aren't any datasets available, cancel the setup, and then go to the **Speech datasets** menu to [upload datasets](how-to-custom-speech-upload-data.md).
1. Enter a **Name** and **Description**, and then select **Next**.
1. Optionally, check the **Add test in the next step** box. You can skip this step and create tests later. For more information, see [Test recognition quality](how-to-custom-speech-inspect-data.md) and [Test model accuracy](how-to-custom-speech-evaluate-data.md).
1. Select **Save and close** to kick off the build for your custom model.

The training table displays a new entry for the new model. The table also displays the status: *Processing*, *Succeeded*, or *Failed*.

For more information, see the [how-to article](how-to-custom-speech-evaluate-data.md) about evaluating and improving Custom Speech model accuracy. If you choose to test accuracy, it's important to select an acoustic dataset that's different from the one you used with your model. This approach can provide a more realistic sense of the model's performance.

> [!NOTE]
> Both baseline models and custom models can be used only up to a certain date (see [Model and endpoint lifecycle](./how-to-custom-speech-model-and-endpoint-lifecycle.md)). Speech Studio displays this date in the **Expiration** column for each model and endpoint. After that date, a request to an endpoint or to batch transcription might fail or fall back to baseline model.
>
> Retrain your model by using the most recent baseline model to benefit from accuracy improvements and to avoid allowing your model to expire.

## Next steps

- [Test recognition quality](how-to-custom-speech-inspect-data.md)
- [Test model accuracy](how-to-custom-speech-evaluate-data.md)
* [Deploy a model](how-to-custom-speech-deploy-model.md)
