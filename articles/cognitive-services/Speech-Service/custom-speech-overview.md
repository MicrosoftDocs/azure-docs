---
title: "Custom Speech overview - Speech service"
titleSuffix: Azure Cognitive Services
description: Custom Speech is a set of online tools that allow you to evaluate and improve our speech-to-text accuracy for your applications, tools, and products. All it takes to get started are a handful of test audio files. Follow the links below to start creating a custom speech-to-text experience.
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/11/2020
ms.author: trbye
---

# What is Custom Speech?

[Custom Speech](https://aka.ms/customspeech) is a set of UI-based tools that allow you to evaluate and improve Microsoft's speech-to-text accuracy for your applications and products. All it takes to get started are a handful of test audio files. Follow the links below to start creating a custom speech-to-text experience.

## What's in Custom Speech?

Before you can do anything with Custom Speech, you'll need an Azure account and a Speech service subscription. Once you've got an account, you can prep your data, train and test your models, inspect recognition quality, evaluate accuracy, and ultimately deploy and use the custom speech-to-text model.

This diagram highlights the pieces that make up the [Custom Speech portal](https://aka.ms/customspeech). Use the links below to learn more about each step.

![Highlights the different components that make up the Custom Speech portal.](./media/custom-speech/custom-speech-overview.png)

1. [Subscribe and create a project](#set-up-your-azure-account) - Create an Azure account and subscribe to the Speech service. This unified subscription gives you access to speech-to-text, text-to-speech, speech translation, and the [Custom Speech portal](https://speech.microsoft.com/customspeech). Then, using your Speech service subscription, create your first Custom Speech project.

1. [Upload test data](how-to-custom-speech-test-data.md) - Upload test data (audio files) to evaluate Microsoft's speech-to-text offering for your applications, tools, and products.

1. [Inspect recognition quality](how-to-custom-speech-inspect-data.md) - Use the [Custom Speech portal](https://speech.microsoft.com/customspeech) to play back uploaded audio and inspect the speech recognition quality of your test data. For quantitative measurements, see [Inspect data](how-to-custom-speech-inspect-data.md).

1. [Evaluate and improve accuracy](how-to-custom-speech-evaluate-data.md) - Evaluate and improve the accuracy of the speech-to-text model. The [Custom Speech portal](https://speech.microsoft.com/customspeech) will provide a *Word Error Rate*, which can be used to determine if additional training is required. If you're satisfied with the accuracy, you can use the Speech service APIs directly. If you'd like to improve accuracy by a relative average of 5% - 20%, use the **Training** tab in the portal to upload additional training data, such as human-labeled transcripts and related text.

1. [Train and deploy a model](how-to-custom-speech-train-model.md) - Improve the accuracy of your speech-to-text model by providing written transcripts (10-1,000 hours) and related text (<200 MB) along with your audio test data. This data helps to train the speech-to-text model. After training, retest, and if you're satisfied with the result, you can deploy your model to a custom endpoint.

## Set up your Azure account

An Azure account and Speech service subscription are required before you can use the [Custom Speech portal](https://speech.microsoft.com/customspeech) to create a custom model. If you don't have an account and subscription, [try the Speech service for free](overview.md#try-the-speech-service-for-free).

> [!NOTE]
> Please be sure to create standard (S0) subscriptions, free (F0) subscriptions are not supported.

Once you've created an Azure account and a Speech service subscription, you'll need to sign in to [Custom Speech portal](https://speech.microsoft.com/customspeech) and connect your subscription.

1. Sign-in to the [Custom Speech portal](https://aka.ms/custom-speech).
1. Select the subscription you need to work on and create a speech project.
1. If you'd like to modify your subscription, use the **cog** icon located in the top navigation.

## How to create a project

Content like data, models, tests, and endpoints are organized into **Projects** in the [Custom Speech portal](https://speech.microsoft.com/customspeech). Each project is specific to a domain and country/language. For example, you may create a project for call centers that use English in the United States.

To create your first project, select the **Speech-to-text/Custom speech**, then click **New Project**. Follow the instructions provided by the wizard to create your project. After you've created a project, you should see four tabs: **Data**, **Testing**, **Training**, and **Deployment**. Use the links provided in [Next steps](#next-steps) to learn how to use each tab.

> [!IMPORTANT]
> The [Custom Speech portal](https://aka.ms/custom-speech) was recently updated! If you created previous data, models, tests, and published endpoints in the CRIS.ai portal or with APIs, you need to create a new project in the new portal to connect to these old entities.

## Model lifecycle

Custom speech uses both **base models** and **custom models**. Each language has one or more **base models**. Generally, when a new speech model is released to the regular speech service it is also imported to the Custom Speech service as a new **base model**. They are typically updated every 3-6 months, and older models become less useful over time as the newest model usually has higher accuracy.

In contrast, **custom models** are created by adapting a chosen base model to a particular customer scenario. You may keep using a particular custom model for an extended period of time once you've arrived at one that meets your needs, but we recommend that you periodically update to the latest base model and retrain with additional data.

Other key terms related to the model lifecycle include:

* **Adaptation**: taking a base model and customizing it to your domain/scenario using text data and/or audio data
* **Decoding**: using a model and performing speech recognition (decoding audio into text)
* **Endpoint**: a user-specific deployment of either a base model or a custom model that is *only* accessible by a given user.

### Expiration timeline

As new models and new functionality become available and older, less accurate models are retired, see the following timelines for model and endpoint expiration:

**Base models** 

* Adaptation: available for 1 year. Once the model is imported, it is available for 1 year to create custom models. After 1 year, new custom models must be created from a newer base model version.  
* Decoding: available for 2 years after import. This means you can create an endpoint, and use batch transcription for 2 years with this model. 
* Endpoints: available on the same timeline as decoding

**Custom models**

* Decoding: available for 2 years after the model has been created. This means you can use the custom model for 2 years (batch/realtime/testing) after it is created. After 2 years, **you should retrain your model**, because most often the base model will have been deprecated for adaptation.  
* Endpoints: available on the same timeline as decoding

When either a base model or custom model expires, it will always fall back to the **newest base model version**. Thus, your implementation will never break, but it may become less accurate for *your specific data* if custom models reach expiration. You can see the expiration for a model in the following places in the Custom Speech portal:

* Model training summary
* Model training detail
* Deployment summary
* Deployment detail

You can also check the expiration dates via the [`GetModel`](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetModel) and [`GetBaseModel`](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModel) custom speech APIs under the `deprecationDates` property in the JSON response.

Note that you can upgrade the model on a custom speech endpoint without downtime by changing the model used by the endpoint in the deployment section of the custom speech portal, or via the custom speech API.

## Next steps

* [Prepare and test your data](how-to-custom-speech-test-data.md)
* [Inspect your data](how-to-custom-speech-inspect-data.md)
* [Evaluate and improve model accuracy](how-to-custom-speech-evaluate-data.md)
* [Train and deploy a model](how-to-custom-speech-train-model.md)
