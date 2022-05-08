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
ms.date: 05/08/2022
ms.author: eur
ms.custom: contperf-fy21q2, references_regions
---

# What is Custom Speech?

With Custom Speech, you can evaluate and improve the Microsoft speech-to-text accuracy for your applications and products. 

Out of the box, speech to text utilizes a Universal Language Model as a baseline model that is trained with Microsoft-owned data and reflects commonly used spoken language. This baseline model is pre-trained with dialects and phonetics representing a variety of common domains. As a result, consuming the baseline model requires no additional configuration and works very well in most scenarios. When you make a speech recognition request, the current baseline model for each [supported language](language-support.md) is used by default.

The baseline model may not be sufficient if the audio contains ambient noise or includes a lot of industry and domain-specific jargon. In these cases, you can create and train custom speech models with acoustic, language, and pronunciation data. Custom speech models are private and can offer a competitive advantage. 

There are a few approaches to using speech-to-text models:
- The baseline model applies when the audio is clear of ambient noise and the speech transcribed consists of commonly spoken language.
- A custom model augments the baseline model to include domain-specific vocabulary shared across all areas of the custom domain.
- Multiple custom models can be used when the custom domain has multiple areas, each with a specific vocabulary.

For more information, see [Choose a model for Custom Speech](how-to-custom-speech-choose-model.md).

## How does it work?

With Custom Speech, you can upload your own data, test and train a custom model, compare accuracy between models, and deploy a model to a custom endpoint.

![Diagram that highlights the components that make up the Custom Speech area of the Speech Studio.](./media/custom-speech/custom-speech-overview.png)

Here's more information about the sequence of steps shown in the previous diagram:

1. [Choose a model](how-to-custom-speech-choose-model.md) and create a Custom Speech project. Use a <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices" title="Create a Speech resource" target="_blank">Speech resource</a> that you create in the Azure portal.
1. [Upload test data](./how-to-custom-speech-upload-data.md). Upload test data (audio files) to evaluate the Microsoft speech-to-text offering for your applications, tools, and products.
1. [Test recognition quality](how-to-custom-speech-inspect-data.md). Use the [Speech Studio](https://speech.microsoft.com/customspeech) to play back uploaded audio and inspect the speech recognition quality of your test data. For quantitative measurements, see [Inspect data](how-to-custom-speech-inspect-data.md).
1. [Test model accuracy](how-to-custom-speech-evaluate-data.md). Evaluate and improve the accuracy of the speech-to-text model. The Speech service provides a word error rate (WER), which you can use to determine if additional training is required. 
1. [Train a model](how-to-custom-speech-train-model.md). Provide written transcripts and related text, along with the corresponding audio data. Testing a model before and after training is optional but recommended.
1. [Deploy a model](how-to-custom-speech-deploy-model.md). Once you're satisfied with the test results, deploy the model to a custom endpoint.

If you will train a custom model with audio data, choose a Speech resource [region](regions.md#speech-to-text-text-to-speech-and-translation) with dedicated hardware available for training audio data. In regions with dedicated hardware for Custom Speech training, the Speech service will use up to 20 hours of your audio training data, and can process about 10 hours of data per day. In other regions, the Speech service uses up to 8 hours of your audio data, and can process about 1 hour of data per day. After the model is trained, you can copy the model to another region as needed with the [CopyModelToSubscription](https://eastus.dev.cognitive.microsoft.com/docs/services/speech-to-text-api-v3-0/operations/CopyModelToSubscription) REST API.

## Next steps

* [Choose a model](how-to-custom-speech-choose-model.md) 
* [Upload test data](./how-to-custom-speech-upload-data.md)
* [Train a model](how-to-custom-speech-train-model.md)
