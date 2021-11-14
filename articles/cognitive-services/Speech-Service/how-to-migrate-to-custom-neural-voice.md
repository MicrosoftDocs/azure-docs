---
title: Migrate from custom voice to custom neural voice - Speech service
titleSuffix: Azure Cognitive Services
description: This document helps users migrate from custom voice to custom neural voice.
services: cognitive-services
author: sally-baolian
manager: nitinme
ms.service: cognitive-services
ms.subservice: speech-service
ms.topic: conceptual
ms.date: 11/12/2021
ms.author: v-baolianzou
---

# Migrate from custom voice to custom neural voice

> [!IMPORTANT]
> The standard/non-neural training tier of custom voice is deprecated. Existing standard tier non-neural models can be used through the end of February 2024. Starting in March 2024 we will only support custom neural voice. 

The custom neural voice lets you build higher-quality voice models while requiring less data. You can develop more realistic, natural, and conversational voices. Your customers and end users will benefit from the latest Text-to-Speech technology, in a responsible way. 

|Custom voice  |Custom neural voice | 
|--|--|
| The standard, or "traditional," method of custom voice breaks down spoken language into phonetic snippets that can be remixed and matched using classical programming or statistical methods.  | Custom neural voice synthesizes speech using deep neural networks that have "learned" the way phonetics are combined in natural human speech rather than using classical programming or statistical methods.|
| Custom voice requires a large volume of voice data to produce a more human-like voice model. With fewer recorded lines, a standard custom voice model will tend to sound more obviously robotic. |The custom neural voice capability enables you to create a unique brand voice in multiple languages and styles by using a small set of recordings.|

## Action required

Before you can migrate to custom neural voice, your [application](https://aka.ms/customneural) must be accepted. Access to the custom neural voice service is subject to Microsoft's sole discretion based on our eligibility criteria. You must commit to using custom neural voice in alignment with our [Responsible AI principles](https://microsoft.com/ai/responsible-ai) and the [code of conduct](/legal/cognitive-services/speech-service/tts-code-of-conduct?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext).

1. Learn more about our [policy on the limit access](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) and then [apply here](https://aka.ms/customneural).  
2. Once your application is approved, you will be provided with the access to the "neural" training feature. Make sure you log in to [Speech Studio](https://speech.microsoft.com) using the same Azure subscription that you provide in your application. 
    > [!IMPORTANT]
    > To protect voice talent and prevent training of voice models with unauthorized recording or without the acknowledgement from the voice talent, we require the customer to upload a recorded statement of the voice talent giving their consent. When preparing your recording script, make sure you include this sentence. 
    >
    > “I [state your first and last name] am aware that recordings of my voice will be used by [state the name of the company] to create and use a synthetic version of my voice.”
    >
    > This sentence must be uploaded to the **Set up voice talent** tab as a verbal consent file. It will be used to verify if the recordings in your training datasets are done by the same person that makes the consent.
3. After the custom neural voice model is created, deploy the voice model to a new endpoint. To create a new custom voice endpoint with your neural voice model, go to **Text-to-Speech > Custom Voice > Deploy model**. Select **Deploy models** and enter a **Name** and **Description** for your custom endpoint. Then select the custom neural voice model you would like to associate with this endpoint and confirm the deployment.  
4. Update your code in your apps if you have created a new endpoint with a new model. 

## Deprecated custom voice details



### Regional support for custom voices

If you've created a custom voice font, use the endpoint that you've created. You can also use the endpoints listed below, replacing the `{deploymentId}` with the deployment ID for your voice model.

| Region | Endpoint |
|--------|----------|
| Australia East | `https://australiaeast.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Brazil South | `https://brazilsouth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Canada Central | `https://canadacentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Central US | `https://centralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| East Asia | `https://eastasia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| East US | `https://eastus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| East US 2 | `https://eastus2.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| France Central | `https://francecentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| India Central | `https://centralindia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Japan East | `https://japaneast.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Japan West | `https://japanwest.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Korea Central | `https://koreacentral.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| North Central US | `https://northcentralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| North Europe | `https://northeurope.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| South Central US | `https://southcentralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| Southeast Asia | `https://southeastasia.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| UK South | `https://uksouth.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West Europe | `https://westeurope.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West Central US | `https://westcentralus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West US | `https://westus.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |
| West US 2 | `https://westus2.voice.speech.microsoft.com/cognitiveservices/v1?deploymentId={deploymentId}` |

## Next steps

> [!div class="nextstepaction"]
> [Try out custom neural voice](custom-neural-voice.md)
