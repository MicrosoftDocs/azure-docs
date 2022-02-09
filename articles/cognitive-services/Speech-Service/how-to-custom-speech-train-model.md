---
title: Train and deploy a Custom Speech model - Speech service
titleSuffix: Azure Cognitive Services
description: Learn how to train and deploy Custom Speech models. Training a speech-to-text model can improve recognition accuracy for the Microsoft baseline model or a custom model.
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 01/23/2022
ms.author: eur
ms.custom: ignite-fall-2021
---

# Train and deploy a Custom Speech model

In this article, you'll learn how to train and deploy Custom Speech models. Training a speech-to-text model can improve recognition accuracy for the Microsoft baseline model. You use human-labeled transcriptions and related text to train a model. And you use these datasets, along with previously uploaded audio data, to refine and train the speech-to-text model.

## Use training to resolve accuracy problems

If you're encountering recognition problems with a base model, you can use human-labeled transcripts and related data to train a custom model and help improve accuracy. To determine which dataset to use to address your problems, refer to the following table:

| Use case | Data type |
| -------- | --------- |
| Improve recognition accuracy on industry-specific vocabulary and grammar, such as medical terminology or IT jargon. | Plain text or structured text data |
| Define the phonetic and displayed form of a word or term that has nonstandard pronunciation, such as product names or acronyms. | Pronunciation data or phonetic pronunciation in structured text |
| Improve recognition accuracy on speaking styles, accents, or specific background noises. | Audio + human-labeled transcripts |
| | |

## Train and evaluate a model

The first step in training a model is to upload training data. For step-by-step instructions for preparing human-labeled transcriptions and related text (utterances and pronunciations), see [Prepare and test your data](./how-to-custom-speech-test-and-train.md). After you upload training data, follow these instructions to start training your model:

1. Sign in to the [Custom Speech portal](https://speech.microsoft.com/customspeech). If you plan to train a model with audio + human-labeled transcription datasets, pick a Speech subscription in a [region with dedicated hardware](custom-speech-overview.md#set-up-your-azure-account) for training.

1. Go to **Speech-to-text** > **Custom Speech** > **[name of project]** > **Training**.

1. Select **Train model**.

1. Give your training a **Name** and **Description**.

1. In the **Scenario and Baseline model** list, select the scenario that best fits your domain. If you're not sure which scenario to choose, select **General**. The baseline model is the starting point for training. The most recent model is usually the best choice.

1. On the **Select training data** page, choose one or more related text datasets or audio + human-labeled transcription datasets that you want to use for training.

   > [!NOTE]
   > When you train a new model, start with related text. Training with audio + human-labeled transcription might take much longer (up to [several days](how-to-custom-speech-evaluate-data.md#add-audio-with-human-labeled-transcripts)).

   > [!NOTE]
   > Not all base models support training with audio. If a base model doesn't support it, the Speech service will use only the text from the transcripts and ignore the audio. For a list of base models that support training with audio data, see [Language support](language-support.md#speech-to-text).

   > [!NOTE]
   > In cases when you change the base model used for training, and you have audio in the training dataset, *always* check to see whether the new selected base model [supports training with audio data](language-support.md#speech-to-text). If the previously used base model didn't support training with audio data, and the training dataset contains audio, training time with the new base model will *drastically* increase, and might easily go from several hours to several days and more. This is especially true if your Speech service subscription is *not* in a [region with the dedicated hardware](custom-speech-overview.md#set-up-your-azure-account) for training.
   >
   > If you face the issue described in the preceding paragraph, you can quickly decrease the training time by reducing the amount of audio in the dataset or removing it completely and leaving only the text. We recommend the latter option if your Speech service subscription is *not* in a [region with the dedicated hardware](custom-speech-overview.md#set-up-your-azure-account) for training.

1. After training is complete, you can do accuracy testing on the newly trained model. This step is optional.
1. Select **Create** to build your custom model.

The **Training** table displays a new entry that corresponds to the new model. The table also displays the status: *Processing*, *Succeeded*, or *Failed*.

For more information, see the [how-to article](how-to-custom-speech-evaluate-data.md) about evaluating and improving Custom Speech model accuracy. If you choose to test accuracy, it's important to select an acoustic dataset that's different from the one you used with your model. This approach can provide a more realistic sense of the model's performance.

> [!NOTE]
> Both base models and custom models can be used only up to a certain date (see [Model and endpoint lifecycle](./how-to-custom-speech-model-and-endpoint-lifecycle.md)). Speech Studio displays this date in the **Expiration** column for each model and endpoint. After that date, a request to an endpoint or to batch transcription might fail or fall back to base model.
>
> Retrain your model by using the most recent base model to benefit from accuracy improvements and to avoid allowing your model to expire.

## Deploy a custom model

After you upload and inspect data, evaluate accuracy, and train a custom model, you can deploy a custom endpoint to use with your apps, tools, and products. 

1. To create a custom endpoint, sign in to the [Custom Speech portal](https://speech.microsoft.com/customspeech). 

1. On the **Custom Speech** menu at the top of the page, select **Deployment**. 

   If this is your first run, you'll notice that there are no endpoints listed in the table. After you create an endpoint, you use this page to track each deployed endpoint.

1. Select **Add endpoint**, and then enter a **Name** and **Description** for your custom endpoint. 

1. Select the custom model that you want to associate with the endpoint. 

   You can also enable logging from this page. Logging allows you to monitor endpoint traffic. If logging is disabled, traffic won't be stored.

   ![Screenshot showing the selected `Log content from this endpoint` checkbox on the `New endpoint` page.](./media/custom-speech/custom-speech-deploy-model.png)

    > [!NOTE]
    > Remember to accept the terms of use and pricing details.

1. Select **Create**. 

   This action returns you to the **Deployment** page. The table now includes an entry that corresponds to your custom endpoint. The endpoint’s status shows its current state. It can take up to 30 minutes to instantiate a new endpoint that uses your custom models. When the status of the deployment changes to **Complete**, the endpoint is ready to use.

   After your endpoint is deployed, the endpoint name appears as a link. 

1. Select the endpoint link to view information specific to it, such as the endpoint key, endpoint URL, and sample code. 

   Note the expiration date, and update the endpoint's model before that date to ensure uninterrupted service.

## View logging data

Logging data is available for export from the endpoint's page, under **Deployments**.

> [!NOTE]
> Logging data is available on Microsoft-owned storage for 30 days, after which it will be removed. If a customer-owned storage account is linked to the Cognitive Services subscription, the logging data won't be automatically deleted.

## Additional resources

- [Learn how to use your custom model](how-to-specify-source-language.md)
- [Inspect your data](how-to-custom-speech-inspect-data.md)
- [Evaluate your data](how-to-custom-speech-evaluate-data.md)
