---
title: Train and deploy a Custom Speech model - Speech service
titleSuffix: Azure Cognitive Services
description: In this article, you learn how to train and deploy Custom Speech models. Training a speech-to-text model can improve recognition accuracy for Microsoft's baseline model or a custom model. A model is trained using human-labeled transcriptions and related text.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/11/2020
ms.author: trbye
---

# Train and deploy a Custom Speech model

In this article, you learn how to train and deploy Custom Speech models. Training a speech-to-text model can improve recognition accuracy for Microsoft's baseline model. A model is trained using human-labeled transcriptions and related text. These datasets along with previously uploaded audio data, are used to refine and train the speech-to-text model.

## Use training to resolve accuracy issues

If you're encountering recognition issues with a base model, using human-labeled transcripts and related data to train a custom model can help to improve accuracy. Use this table to determine which dataset to use to address your issue(s):

| Use case | Data type |
| -------- | --------- |
| Improve recognition accuracy on industry-specific vocabulary and grammar, such as medical terminology or IT jargon. | Related text (sentences/utterances) |
| Define the phonetic and displayed form of a word or term that has nonstandard pronunciation, such as product names or acronyms. | Related text (pronunciation) |
| Improve recognition accuracy on speaking styles, accents, or specific background noises. | Audio + human-labeled transcripts |

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

See the [how-to](how-to-custom-speech-evaluate-data.md) on evaluating and improving Custom Speech model accuracy. If you chose to test accuracy, it's important to select an acoustic dataset that's different from the one you used with your model to get a realistic sense of the model's performance.

## Deploy a custom model

After you've uploaded and inspected data, evaluated accuracy, and trained a custom model, you can deploy a custom endpoint to use with your apps, tools, and products. 

To create a new custom endpoint, sign in to the [Custom Speech portal](https://speech.microsoft.com/customspeech) and select **Deployment** from the Custom Speech menu at the top of the page. If this is your first run, you'll notice that there are no endpoints listed in the table. After you've created an endpoint, you use this page to track each deployed endpoint.

Next, select **Add endpoint** and enter a **Name** and **Description** for your custom endpoint. Then select the custom model that you'd like to associate with this endpoint. From this page, you can also enable logging. Logging allows you to monitor endpoint traffic. If disabled, traffic won't be stored.

![How to deploy a model](./media/custom-speech/custom-speech-deploy-model.png)

> [!NOTE]
> Don't forget to accept the terms of use and pricing details.

Next, select **Create**. This action returns you to the **Deployment** page. The table now includes an entry that corresponds to your custom endpoint. The endpoint’s status shows its current state. It can take up to 30 minutes to instantiate a new endpoint using your custom models. When the status of the deployment changes to **Complete**, the endpoint is ready to use.

After your endpoint is deployed, the endpoint name appears as a link. Click the link to display information specific to your endpoint, such as the endpoint key, endpoint URL, and sample code.

## View logging data

Logging data is available for download under **Endpoint > Details**.
> [!NOTE]
>The logging data is available for 30 days on Microsoft owned storage and will be removed afterwards. In case a customer owned storage account is linked to the cognitive services subscription, the logging data will not be automatically deleted.

## Next steps

* Learn [how to use your custom model](how-to-specify-source-language.md).

## Additional resources

- [Prepare and test your data](how-to-custom-speech-test-data.md)
- [Inspect your data](how-to-custom-speech-inspect-data.md)
- [Evaluate your data](how-to-custom-speech-evaluate-data.md)
