---
title: "Custom Speech overview - Speech service"
titleSuffix: Azure Cognitive Services
description: Custom Speech is a set of online tools that allow you to evaluate and improve the Microsoft speech-to-text accuracy for your applications, tools, and products. 
services: cognitive-services
author: trevorbye
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/11/2020
ms.author: trbye
ms.custom: contperfq2
---

# What is Custom Speech?

[Custom Speech](https://aka.ms/customspeech) is a set of UI-based tools that allow you to evaluate and improve the Microsoft speech-to-text accuracy for your applications and products. All it takes to get started is a handful of test audio files. Follow the links in this article to start creating a custom speech-to-text experience.

## What's in Custom Speech?

Before you can do anything with Custom Speech, you'll need an Azure account and a Speech service subscription. After you have an account, you can prep your data, train and test your models, inspect recognition quality, evaluate accuracy, and ultimately deploy and use the custom speech-to-text model.

This diagram highlights the pieces that make up the [Custom Speech portal](https://aka.ms/customspeech). Use the links below to learn more about each step.

![Diagram that highlights the components that make up the Custom Speech portal.](./media/custom-speech/custom-speech-overview.png)

1. [Subscribe and create a project](#set-up-your-azure-account). Create an Azure account and subscribe to the Speech service. This unified subscription gives you access to speech-to-text, text-to-speech, speech translation, and the [Custom Speech portal](https://speech.microsoft.com/customspeech). Then use your Speech service subscription to create your first Custom Speech project.

1. [Upload test data](./how-to-custom-speech-test-and-train.md). Upload test data (audio files) to evaluate the Microsoft speech-to-text offering for your applications, tools, and products.

1. [Inspect recognition quality](how-to-custom-speech-inspect-data.md). Use the [Custom Speech portal](https://speech.microsoft.com/customspeech) to play back uploaded audio and inspect the speech recognition quality of your test data. For quantitative measurements, see [Inspect data](how-to-custom-speech-inspect-data.md).

1. [Evaluate and improve accuracy](how-to-custom-speech-evaluate-data.md). Evaluate and improve the accuracy of the speech-to-text model. The [Custom Speech portal](https://speech.microsoft.com/customspeech) will provide a *Word Error Rate*, which you can use to determine if additional training is required. If you're satisfied with the accuracy, you can use the Speech service APIs directly. If you want to improve accuracy by a relative average of 5% to 20%, use the **Training** tab in the portal to upload additional training data, like human-labeled transcripts and related text.

1. [Train and deploy a model](how-to-custom-speech-train-model.md). Improve the accuracy of your speech-to-text model by providing written transcripts (10 to 1,000 hours) and related text (<200 MB) along with your audio test data. This data helps to train the speech-to-text model. After training, retest. If you're satisfied with the result, you can deploy your model to a custom endpoint.

## Set up your Azure account

You need to have an Azure account and Speech service subscription before you can use the [Custom Speech portal](https://speech.microsoft.com/customspeech) to create a custom model. If you don't have an account and subscription, [try the Speech service for free](overview.md#try-the-speech-service-for-free).

> [!NOTE]
> Please be sure to create a standard (S0) subscription. Free (F0) subscriptions aren't supported.

After you create an Azure account and a Speech service subscription, you'll need to sign in to the [Custom Speech portal](https://speech.microsoft.com/customspeech) and connect your subscription.

1. Sign in to the [Custom Speech portal](https://aka.ms/custom-speech).
1. Select the subscription you need to work in and create a speech project.
1. If you want to modify your subscription, select the cog button in the top menu.

## How to create a project

Content like data, models, tests, and endpoints are organized into *projects* in the [Custom Speech portal](https://speech.microsoft.com/customspeech). Each project is specific to a domain and country/language. For example, you might create a project for call centers that use English in the United States.

To create your first project, select **Speech-to-text/Custom speech**, and then select **New Project**. Follow the instructions provided by the wizard to create your project. After you create a project, you should see four tabs: **Data**, **Testing**, **Training**, and **Deployment**. Use the links provided in [Next steps](#next-steps) to learn how to use each tab.

> [!IMPORTANT]
> The [Custom Speech portal](https://aka.ms/custom-speech) was recently updated! If you created previous data, models, tests, and published endpoints in the CRIS.ai portal or with APIs, you need to create a new project in the new portal to connect to these old entities.

## Model lifecycle

Custom Speech uses both *base models* and *custom models*. Each language has one or more base models. Generally, when a new speech model is released to the regular speech service, it's also imported to the Custom Speech service as a new base model. They're updated every 3 to 6 months. Older models typically become less useful over time because the newest model usually has higher accuracy.

In contrast, custom models are created by adapting a chosen base model to a particular customer scenario. You can keep using a particular custom model for a long time after you have one that meets your needs. But we recommend that you periodically update to the latest base model and retrain it over time with additional data. 

Other key terms related to the model lifecycle include:

* **Adaptation**: Taking a base model and customizing it to your domain/scenario by using text data and/or audio data.
* **Decoding**: Using a model and performing speech recognition (decoding audio into text).
* **Endpoint**: A user-specific deployment of either a base model or a custom model that's accessible *only* to a given user.

### Expiration timeline

As new models and new functionality become available and older, less accurate models are retired, see the following timelines for model and endpoint expiration:

**Base models** 

* Adaptation: Available for one year. After the model is imported, it's available for one year to create custom models. After one year, new custom models must be created from a newer base model version.  
* Decoding: Available for two years after import. So you can create an endpoint and use batch transcription for two years with this model. 
* Endpoints: Available on the same timeline as decoding.

**Custom models**

* Decoding: Available for two years after the model is created. So you can use the custom model for two years (batch/realtime/testing) after it's created. After two years, *you should retrain your model* because the base model will usually have been deprecated for adaptation.  
* Endpoints: Available on the same timeline as decoding.

When either a base model or custom model expires, it will always fall back to the *newest base model version*. So your implementation will never break, but it might become less accurate for *your specific data* if custom models reach expiration. You can see the expiration for a model in the following places in the Custom Speech portal:

* Model training summary
* Model training detail
* Deployment summary
* Deployment detail

You can also check the expiration dates via the [`GetModel`](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetModel) and [`GetBaseModel`](https://westus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/GetBaseModel) custom speech APIs under the `deprecationDates` property in the JSON response.

Note that you can upgrade the model on a custom speech endpoint without downtime by changing the model used by the endpoint in the deployment section of the custom speech portal, or via the custom speech API.

## Next steps

* [Prepare and test your data](./how-to-custom-speech-test-and-train.md)
* [Inspect your data](how-to-custom-speech-inspect-data.md)
* [Evaluate and improve model accuracy](how-to-custom-speech-evaluate-data.md)
* [Train and deploy a model](how-to-custom-speech-train-model.md)