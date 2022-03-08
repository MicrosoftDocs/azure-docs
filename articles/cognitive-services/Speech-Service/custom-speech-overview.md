---
title: Custom Speech overview - Speech service
titleSuffix: Azure Cognitive Services
description: Custom Speech is a set of online tools that allows you to evaluate and improve the Microsoft speech-to-text accuracy for your applications, tools, and products. 
services: cognitive-services
author: eric-urban
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: overview
ms.date: 01/23/2022
ms.author: eur
ms.custom: contperf-fy21q2, references_regions
---

# What is Custom Speech?

With Custom Speech, you can evaluate and improve the Microsoft speech-to-text accuracy for your applications and products. 

Speech recognition models that are provided by Microsoft are referred to as base models. When you make a speech recognition request, the current base model for each [supported language](language-support.md) is used by default. Base models are updated periodically to improve accuracy and quality. 

Custom Speech models are created by adapting a chosen base model with data from your particular customer scenario. Once you create a custom model, the speech recognition accuracy and quality will remain consistent, even if the base model from which it was adapted gets updated.  

## What's in Custom Speech?

With Custom Speech, you can upload your own data, train and test models, inspect recognition quality, evaluate accuracy, and then deploy and use the custom model.

This diagram highlights the pieces that make up the [Custom Speech area of the Speech Studio](https://aka.ms/speechstudio/customspeech).

![Diagram that highlights the components that make up the Custom Speech area of the Speech Studio.](./media/custom-speech/custom-speech-overview.png)

Here's more information about the sequence of steps that the diagram shows:

1. [Subscribe and create a project](#set-up-your-azure-account). Create an Azure account and subscribe to the Speech service. This unified subscription gives you access to speech-to-text, text-to-speech, speech translation, and the [Speech Studio](https://speech.microsoft.com/customspeech). Then use your Speech service subscription to create your first Custom Speech project.

1. [Upload test data](./how-to-custom-speech-upload-data.md). Upload test data (audio files) to evaluate the Microsoft speech-to-text offering for your applications, tools, and products.

1. [Inspect recognition quality](how-to-custom-speech-inspect-data.md). Use the [Speech Studio](https://speech.microsoft.com/customspeech) to play back uploaded audio and inspect the speech recognition quality of your test data. For quantitative measurements, see [Inspect data](how-to-custom-speech-inspect-data.md).

1. [Evaluate and improve accuracy](how-to-custom-speech-evaluate-data.md). Evaluate and improve the accuracy of the speech-to-text model. The [Speech Studio](https://speech.microsoft.com/customspeech) provides a *word error rate*, which you can use to determine if additional training is required. If you're satisfied with the accuracy, you can use the Speech service APIs directly. If you want to improve accuracy by a relative average of 5 through 20 percent, use the **Training** tab in the portal to upload additional training data, like human-labeled transcripts and related text.

1. [Train and deploy a model](how-to-custom-speech-train-model.md). Improve the accuracy of your speech-to-text model by providing written transcripts (from 10 to 1,000 hours), and related text (<200 MB), along with your audio test data. This data helps to train the speech-to-text model. After training, retest. If you're satisfied with the result, you can deploy your model to a custom endpoint.

## Model and endpoint lifecycle

Older models typically become less useful over time because the newest model usually has higher accuracy. Therefore, base models as well as custom models and endpoints created through the portal are subject to expiration after one year for adaptation, and two years for decoding. For more information, see [Model and endpoint lifecycle](./how-to-custom-speech-model-and-endpoint-lifecycle.md).

## Create a project

You need to have an Azure account and Speech resource to create a custom model.

> [!div class="checklist"]
> * Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)
> * <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices"  title="Create a Speech resource"  target="_blank">Create a Speech resource</a> in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

For your Speech resource, choose a region with dedicated hardware available for training audio data. This reduces the time it takes to train a model and allows you to use more audio for training. As needed, you can use the [CopyModelToSubscription REST API](https://centralus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CopyModelToSubscription) to copy your trained model to another region later.

In these regions, the Speech service will use up to 20 hours of audio for training; in other regions, it will only use up to 8 hours.

| Region | Region identifier |
| ----- | ----- | ----- |
| Australia East | `australiaeast` |
| Canada Central | `canadacentral` |
| Central India | `centralindia` |
| East US | `eastus` |
| East US 2 | `eastus2` |
| North Central US | `northcentralus` |
| North Europe | `northeurope` |
| South Central US | `southcentralus` |
| Southeast Asia | `southeastasia` |
| UK South | `uksouth` |
| US Gov Arizona | `usgovarizona` |
| US Gov Virginia | `usgovvirginia` |
| West Europe | `westeurope` |
| West US 2 | `westus2` |

Content like data, models, tests, and endpoints are organized into projects in the [Speech Studio](https://speech.microsoft.com/customspeech). Each project is specific to a domain and country or language. For example, you might create a project for call centers that use English in the United States.

1. Sign in to the [Speech Studio](https://aka.ms/speechstudio/customspeech).
1. Select the subscription and Speech resource to work with. 
1. Select **Speech-to-text** > **Custom speech**, and then select **New Project**. 
1. Follow the instructions provided by the wizard to create your project. 

After you create a project, you should see four tabs: **Data**, **Testing**, **Training**, and **Deployment**. 

## Next steps

* [Prepare and test your data](./how-to-custom-speech-test-and-train.md)
* [Evaluate and improve model accuracy](how-to-custom-speech-evaluate-data.md)
* [Train and deploy a model](how-to-custom-speech-train-model.md)
