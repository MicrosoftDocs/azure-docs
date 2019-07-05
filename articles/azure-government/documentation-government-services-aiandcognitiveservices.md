---
title: Azure Government AI and Cognitive Services | Microsoft Docs
description: This article provides a comparison of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: jglixon

ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 10/23/2018
ms.author: jglixon

---
# Azure Government AI and Machine Learning

This article outlines variations and considerations when using **Cognitive Services** and the **Azure Bot Service** in the Azure Government environment.

The following AI and Cognitive Services are generally available in Azure Government: 

- Computer Vision
- Face
- Content Moderator
- Speech
- Translator Text
- Language Understanding
- Azure Bot Service

> [!IMPORTANT]
> Billing for Computer Vision, Face, Translator Text, Content Moderator, and Language Understanding will begin on 11/1/2018.

## Vision

### Computer Vision

Variations in Azure Government:

- Endpoint URL: https://virginia.api.cognitive.microsoft.us/vision/v2.0/
- Available SKUs: S1

For more information, see the [global Azure documentation](../cognitive-services/computer-vision/index.yml) and [Computer Vision API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa).
 
### Face

Variations in Azure Government:

- Endpoint: https://virginia.api.cognitive.microsoft.us/face/v1.0/
- Available SKUs: S0

For more information, see the [global Azure documentation](../cognitive-services/face/index.yml) and [Face API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

## Content Moderator

Variations in Azure Government:

- Endpoint: https://virginia.api.cognitive.microsoft.us/contentmoderator
- The Review UI and Review APIs are not available at this time
- Available SKUs: S0
 
For more information, see the [global Azure documentation](../cognitive-services/content-moderator/overview.md) and [Content Moderator API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66c).

## Speech

### Speech Services

Variations in Azure Government:

- Endpoint:  https://virginia.stt.speech.azure.us
- Auth Token Service: https://virginia.api.cognitive.microsoft.us/sts/v1.0/issueToken 
- Custom Speech Portal: https://virginia.cris.azure.us/Home/CustomSpeech
- Available SKUs: S0
- Supported features:
  - Speech-to-Text 
  - Custom Speech (Acoustic/language adaptation)
  - Text-to-Speech 
  - Speech Translator
- Unsupported features
  - Custom Voice
  - Neural voices for Text-to-speech
- Supported locales: 
  Locales for the following languages are supported. 
  - Arabic (ar-*)
  - Chinese (zh-*)
  - English (en-*)
  - French (fr-*)
  - German (de-*)
  - Hindi
  - Korean
  - Russian
  - Spanish (es-*)

See details of supported locales by features in [Language and region support for the Speech Services](https://docs.microsoft.com/azure/cognitive-services/speech-service/language-support).

## Language
 
### Translator Text (Text Translation): 

Variations in Azure Government:

- Endpoint:  https://api.cognitive.microsofttranslator.us
- Auth Token Service: https://virginia.api.cognitive.microsoft.us/sts/v1.0/issueToken
- Available SKUs: S1
- Custom Translator and Translator Hub are not supported.
 
For more information, see the [global Azure documentation](../cognitive-services/translator/translator-info-overview.md) and [Translator Text API documentation](https://docs.microsoft.com/azure/cognitive-services/Translator/reference/v3-0-reference).

### Language Understanding (LUIS)

Variations in Azure Government:

- Endpoint: https://virginia.api.cognitive.microsoft.us/luis/v2.0
- LUIS portal: https://luis.azure.us
- Available SKUs: S0
- Speech Requests, Speech Priming, Spell Check, and Prebuilt Domains are not currently available

For more information, see [global Azure documentation](../cognitive-services/luis/what-is-luis.md) for Language Understanding.

## Azure Bot Service

Variations in Azure Government:

The service URL endpoints for Azure Bot Service apps created in Azure Government are different from those apps created in the Azure public cloud:

- Bot Service Endpoints:	*.botframework.azure.us
- Bot Authentication Endpoint: login.microsoftonline.us

Some Bot Service features available in the public cloud are not yet available in Azure Government:
- BotBuilder V3 Bot Templates
- Channels
  - Cortana channel
  - Skype for Business Channel
  - Teams Channel
  - Slack Channel
  - Office 365 Email Channel
  - Facebook Messenger Channel
  - Telegram Channel
  - Kik Messenger Channel
  - GroupMe Channel
  - Skype Channel
- Application Insights related capabilities including the Analytics Tab 
- Speech Priming Feature
- Payment Card Feature

Commonly used services in bot applications that are currently unavailable in Azure Government:
- Application Insights
- Azure Search
- QnA Maker Cognitive Service
- Speech Services Cognitive Service

For more information, see [global Azure documentation](https://aka.ms/botdocs/) for Bot Service.

## Data Considerations

Data considerations for Cognitive Services and Azure Bot Service are not yet available. 

## Next Steps
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the [azure-gov](https://stackoverflow.com/questions/tagged/azure-gov) tag
* Give us feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government) 

