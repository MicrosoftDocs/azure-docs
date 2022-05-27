---
title: Train a Custom Speech model - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to train Custom Speech models. Training a speech-to-text model can improve recognition accuracy for the Microsoft base model or a custom model.
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

In this article, you'll learn how to train a Custom Speech model to improve recognition accuracy from the Microsoft base model. Training a model is typically an iterative process. You will first select a base model that is the starting point for a new model. You train a model with [datasets](./how-to-custom-speech-test-and-train.md) that can include text and audio, and then you test and refine the model with more data.

You can use a custom model for a limited time after it's trained and [deployed](how-to-custom-speech-deploy-model.md). You must periodically recreate and adapt your custom model from the latest base model to take advantage of the improved accuracy and quality. For more information, see [Model and endpoint lifecycle](./how-to-custom-speech-model-and-endpoint-lifecycle.md).

> [!NOTE]
> You pay to use Custom Speech models, but you are not charged for training a model.

## Train the model

If you plan to train a model with audio data, use a Speech resource in a [region](regions.md#speech-to-text-pronunciation-assessment-text-to-speech-and-translation) with dedicated hardware for training.

After you've uploaded [training datasets](./how-to-custom-speech-test-and-train.md), follow these instructions to start training your model:

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech). 
1. Select **Custom Speech** > Your project name > **Train custom models**.
1. Select **Train a new model**.
1. On the **Select a baseline model** page, select a base model, and then select **Next**. If you aren't sure, select the most recent model from the top of the list. 

    > [!IMPORTANT]
    > Take note of the **Expiration for adaptation** date. This is the last date that you can use the base model for training. For more information, see [Model and endpoint lifecycle](./how-to-custom-speech-model-and-endpoint-lifecycle.md).

1. On the **Choose data** page, select one or more datasets that you want to use for training. If there aren't any datasets available, cancel the setup, and then go to the **Speech datasets** menu to [upload datasets](how-to-custom-speech-upload-data.md).
1. Enter a name and description for your custom model, and then select **Next**.
1. Optionally, check the **Add test in the next step** box. If you skip this step, you can run the same tests later. For more information, see [Test recognition quality](how-to-custom-speech-inspect-data.md) and [Test model quantitatively](how-to-custom-speech-evaluate-data.md).
1. Select **Save and close** to kick off the build for your custom model.

On the main **Train custom models** page, details about the new model are displayed in a table, such as name, description, status (*Processing*, *Succeeded*, or *Failed*), and expiration date. 

> [!IMPORTANT]
> Take note of the date in the **Expiration** column. This is the last date that you can use your custom model for speech recognition. For more information, see [Model and endpoint lifecycle](./how-to-custom-speech-model-and-endpoint-lifecycle.md).

## Next steps

- [Test recognition quality](how-to-custom-speech-inspect-data.md)
- [Test model quantitatively](how-to-custom-speech-evaluate-data.md)
- [Deploy a model](how-to-custom-speech-deploy-model.md)
