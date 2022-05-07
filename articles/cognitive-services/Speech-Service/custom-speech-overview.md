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

Out of the box, speech to text utilizes a Universal Language Model as a base model that is trained with Microsoft-owned data and reflects commonly used spoken language. This base model is pre-trained with dialects and phonetics representing a variety of common domains. As a result, consuming the base model requires no additional configuration and works very well in most scenarios. When you make a speech recognition request, the current base model for each [supported language](language-support.md) is used by default.

The base model may not be sufficient if the audio contains ambient noise or includes a lot of industry and domain-specific jargon. In these cases, you can create and train custom speech models with acoustic, language, and pronunciation data. Custom speech models are private and can offer a competitive advantage. 

There are a few approaches to using speech-to-text models:
- The base model applies when the audio is clear of ambient noise and the speech transcribed consists of commonly spoken language.
- A custom model augments the base model to include domain-specific vocabulary shared across all areas of the custom domain.
- Multiple custom models can be used when the custom domain has multiple areas, each with a specific vocabulary.

For more information, see [Choose a model for Custom Speech](how-to-custom-speech-choose-model.md).

## How does it work?

With Custom Speech, you can upload your own data, train and test models, inspect recognition quality, evaluate accuracy, and then deploy and use the custom model.

This diagram highlights the pieces that make up the [Custom Speech area of the Speech Studio](https://aka.ms/speechstudio/customspeech).

![Diagram that highlights the components that make up the Custom Speech area of the Speech Studio.](./media/custom-speech/custom-speech-overview.png)

Here's more information about the sequence of steps that the diagram shows:

1. [Choose a model](how-to-custom-speech-choose-model.md) and create a Custom Speech project. Use a <a href="https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesSpeechServices" title="Create a Speech resource" target="_blank">Speech resource</a> that you create in the Azure portal.
1. [Upload test data](./how-to-custom-speech-upload-data.md). Upload test data (audio files) to evaluate the Microsoft speech-to-text offering for your applications, tools, and products.
1. [Test recognition quality](how-to-custom-speech-inspect-data.md). Use the [Speech Studio](https://speech.microsoft.com/customspeech) to play back uploaded audio and inspect the speech recognition quality of your test data. For quantitative measurements, see [Inspect data](how-to-custom-speech-inspect-data.md).
1. [Test model accuracy](how-to-custom-speech-evaluate-data.md). Evaluate and improve the accuracy of the speech-to-text model. The [Speech Studio](https://speech.microsoft.com/customspeech) provides a word error rate (WER), which you can use to determine if additional training is required. If you're satisfied with the accuracy, you can use the Speech service APIs directly. If you want to improve accuracy by a relative average of 5 through 20 percent, use the **Training** tab in the portal to upload additional training data, like human-labeled transcripts and related text.
1. [Train a model](how-to-custom-speech-train-model.md). Improve the accuracy of your speech-to-text model by providing written transcripts (from 10 to 1,000 hours), and related text (<200 MB), along with your audio test data. This data helps to train the speech-to-text model. After training, retest. 
1. [Deploy a model](how-to-custom-speech-deploy-model.md). Once you're satisfied with the test results, you can deploy your model to a custom endpoint.

## Next steps

* [Prepare and test your data](./how-to-custom-speech-test-and-train.md)
* [Evaluate and improve model accuracy](how-to-custom-speech-evaluate-data.md)
* [Train and deploy a model](how-to-custom-speech-train-model.md)
