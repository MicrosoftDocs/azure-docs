---
title: Migrate from custom voice to custom neural voice - Speech service
titleSuffix: Azure AI services
description: This document helps users migrate from custom voice to custom neural voice.
author: eric-urban
ms.author: eur
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 1/21/2024
ms.reviewer: v-baolianzou
---

# Migrate from custom voice to custom neural voice

> [!IMPORTANT]
> The standard non-neural training tier of custom voice is retired as of February 29, 2024. You could have used a non-neural custom voice with your Speech resource prior to February 29, 2024. Now you can only use custom neural voice with your Speech resources. If you have a non-neural custom voice, you must migrate to custom neural voice.

The custom neural voice lets you build higher-quality voice models while requiring less data. You can develop more realistic, natural, and conversational voices. Your customers and end users benefit from the latest Text to speech technology, in a responsible way. 

|Custom voice |Custom neural voice | 
|--|--|
| The standard, or "traditional," method of custom voice breaks down spoken language into phonetic snippets that can be remixed and matched using classical programming or statistical methods.  | Custom neural voice synthesizes speech using deep neural networks that have "learned" the way phonetics are combined in natural human speech--rather than using classical programming or statistical methods.|
| Custom voice<sup>1</sup>  requires a large volume of voice data to produce a more human-like voice model. With fewer recorded lines, a standard custom voice model tends to sound more obviously robotic. |The custom neural voice capability enables you to create a unique brand voice in multiple languages and styles by using a small set of recordings.|

<sup>1</sup> When creating a custom voice model, the maximum number of data files allowed to be imported per subscription is 10 .zip files for free subscription (F0) users, and 500 for standard subscription (S0) users. 

## Action required

Before you can migrate to custom neural voice, your [application](https://aka.ms/customneural) must be accepted. Access to the custom neural voice service is subject to Microsoft's sole discretion based on our eligibility criteria. You must commit to using custom neural voice in alignment with our [Responsible AI principles](https://microsoft.com/ai/responsible-ai) and the [code of conduct](/legal/cognitive-services/speech-service/tts-code-of-conduct?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext).

> [!TIP]
> Even without an Azure account, you can listen to voice samples in [Speech Studio](https://aka.ms/customvoice) and determine the right voice for your business needs.

1. Learn more about our [policy on the limit access](/legal/cognitive-services/speech-service/custom-neural-voice/limited-access-custom-neural-voice?context=%2fazure%2fcognitive-services%2fspeech-service%2fcontext%2fcontext) and then [apply here](https://aka.ms/customneural).  
1. Once your application is approved, you are provided with the access to the "neural" training feature. Make sure you sign in to [Speech Studio](https://aka.ms/speechstudio/customvoice) using the same Azure subscription that you provide in your application. 
1. Before you can [train](professional-voice-train-voice.md) and [deploy](professional-voice-deploy-endpoint.md) a custom voice model, you must [create a voice talent profile](professional-voice-create-consent.md). The profile requires an audio file recorded by the voice talent consenting to the usage of their speech data to train a custom voice model. 
1. Update your code in your apps if you created a new endpoint with a new model. 

## Custom voice details (deprecated)

Read the following sections for details on custom voice.

### Language support

Custom voice supports the following languages (locales).

| Language | Locale |
|--------|----------|
|Chinese (Mandarin, Simplified)|`zh-CN`|
|Chinese (Mandarin, Simplified), English bilingual|`zh-CN` bilingual|
|English (India)|`en-IN`|
|English (United Kingdom)|`en-GB`|
|English (United States)|`en-US`|
|French (France)|`fr-FR`|
|German (Germany)|`de-DE`|
|Italian (Italy)|`it-IT`|
|Portuguese (Brazil)|`pt-BR`|
|Spanish (Mexico)|`es-MX`|

### Regional support

If you created a custom voice font, use the endpoint that you created. You can also use the endpoints listed in this section, replacing the `{deploymentId}` with the deployment ID for your voice model.

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
