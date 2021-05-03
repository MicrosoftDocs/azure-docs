---
title: Keyword recognition - Speech service
titleSuffix: Azure Cognitive Services
description: An overview of the features, capabilities, and restrictions for keyword recognition using the Speech Software Development Kit (SDK).
services: cognitive-services
author: hasyashah
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 04/30/2021
ms.author: hasshah
ms.custom: devx-track-csharp
---

# Keyword recognition

Keyword recognition refers to speech technology that recognizes the existence of a word or short phrase within a given stream of audio. It is often synonymously referred to as keyword spotting (KWS). The most common use case of keyword recognition is voice activation of virtual assistants. For example, "Hey Cortana" is the keyword for the Cortana assistant. Upon recognition of the keyword, a scenario-specific action is carried out. For virtual assistant scenarios, a common resulting action is speech recognition of audio that follows the keyword.

Generally, virtual assistants are always listening. Keyword recognition acts as a privacy boundary for the user. A keyword requirement acts as a gate that prevents unrelated user audio from crossing the local device to the cloud.

To balance accuracy, latency, and computational complexity, keyword recognition is implemented as a multi-stage system. For all stages beyond the first, audio is only processed if the stage prior to it believed to have recognized the keyword of interest.

The current system is designed with multiple stages spanning across the edge and cloud:

![Multiple stages of keyword recognition across edge and cloud.](media/custom-keyword/keyword-recognition-multi-stage.png)

Accuracy of keyword recognition is measured via the following metrics:
1. **Correct accept rate (CA)** – Measures the system’s ability to recognize the keyword when it is spoken by an end-user. This is also known as the true positive rate. 
2. **False accept rate (FA)** – Measures the system’s ability to filter out audio that is not the keyword spoken by an end-user. This is also known as the false positive rate.

The goal is to maximize the correct accept rate while minimizing the false accept rate. The current system is designed to detect a keyword or phrase preceded by a short amount of silence. Detecting a keyword in the middle of a sentence or utterance is not supported.

## Custom Keyword

The Custom Keyword portal on Speech Studio allows you to generate keyword recognition models that execute at the edge by specifying any word or short phrase that best represents your brand or product. You can further personalize your keyword model by choosing the right pronunciations. There is no cost to using Custom Keyword for generating models, or for running models on-device with the Speech SDK. To learn more, read [Custom Keyword for on-device models](custom-keyword-overview.md).

## Keyword Verification

Keyword Verification is a cloud service that reduces the impact of false accepts from on-device models with robust models running on Azure. It is always used in combination with Speech-to-Text, and there is no cost to using Keyword Verification beyond the cost of Speech-to-Text. To learn more, read [Keyword Verification](keyword-verification-overview.md).

## Speech SDK integration and scenarios

The Speech SDK facilitates easy use of personalized on-device keyword recognition models generated with Custom Keyword and the Keyword Verification service. To ensure your product needs can be met, the SDK supports two scenarios:

| Scenario | Description | Samples |
| -------- | ----------- | ------- |
| End-to-end keyword recognition with Speech-to-Text | Best suited for products that will use a customized on-device keyword model from Custom Keyword with Azure Speech’s Keyword Verification and Speech-to-Text services. This is the most common scenario. | [Voice assistant sample code.](https://github.com/Azure-Samples/Cognitive-Services-Voice-Assistant) <br> [Tutorial: Voice enable your assistant built using Azure Bot Service with the C# Speech SDK.](https://docs.microsoft.com/azure/cognitive-services/speech-service/tutorial-voice-enable-your-bot-speech-sdk) <br> [Tutorial: Create a Custom Commands application with simple voice commands.](https://docs.microsoft.com/azure/cognitive-services/speech-service/how-to-develop-custom-commands-application) |
| Offline keyword recognition | Best suited for products without network connectivity that will use a customized on-device keyword model from Custom Keyword. | [C# on Windows UWP sample.](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/csharp/uwp/keyword-recognizer) <br> [Java on Android sample.](https://github.com/Azure-Samples/cognitive-services-speech-sdk/tree/master/quickstart/java/android/keyword-recognizer)

## Next steps

* [Learn more about Custom Keyword and on-device keyword recognition models.](custom-keyword-overview.md)
* [Learn more about the Keyword Verification service.](keyword-verification-overview.md)
* [Get the Speech SDK.](speech-sdk.md)
* [Learn more about Voice Assistants.](voice-assistants.md)
