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
ms.date: 05/11/2020
ms.author: jglixon

---
# Azure Government AI and Machine Learning

This article outlines variations and considerations when using **Cognitive Services** and the **Azure Bot Service** in the Azure Government environment.

The following AI and Cognitive Services are generally available in Azure Government: 

- Computer Vision
- Custom Vision
- Face
- Speech
- Translator
- Language Understanding
- QnA Maker
- Text Analytics
- Content Moderator
- Personalizer
- Azure Bot Service

## Vision

### Computer Vision

For more information, see the [global Azure documentation](../cognitive-services/computer-vision/index.yml) and [Computer Vision API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa).

### Custom Vision

Variations in Azure Government:

- Custom Vision Portal: https://www.customvision.azure.us

For more information, see the [global Azure documentation](https://go.microsoft.com/fwlink/?linkid=848046), [Custom Vision Training API reference](https://go.microsoft.com/fwlink/?linkid=865445), and [Custom Vision Prediction API reference](https://go.microsoft.com/fwlink/?linkid=865446)
 
### Face

For more information, see the [global Azure documentation](../cognitive-services/face/index.yml) and [Face API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

## Speech

### Speech service

Variations in Azure Government:

**Endpoints**:

* Virginia: `https://usgovvirginia.stt.speech.azure.us`
* Arizona: `https://usgovarizona.stt.speech.azure.us`

**Auth Token Service**:

* Virginia: `https://usgovvirginia.api.cognitive.microsoft.us/sts/v1.0/issueToken`
* Arizona: `https://usgovarizona.api.cognitive.microsoft.us/sts/v1.0/issueToken`

**Custom Speech Portal**:

* https://speech.azure.us
 
For more information, see What is the Speech service.  

## Language
 
### Translator (text translation): 

Variations in Azure Government:

- Endpoint:  https://api.cognitive.microsofttranslator.us
- Auth Token Service: 
     - `https://usgovvirginia.api.cognitive.microsoft.us/sts/v1.0/issueToken`
     - `https://usgovarizona.api.cognitive.microsoft.us/sts/v1.0/issueToken`
- Custom Translator is not supported.
 
For more information, see the [global Azure documentation](../cognitive-services/translator/translator-info-overview.md) and [Translator API documentation](https://docs.microsoft.com/azure/cognitive-services/Translator/reference/v3-0-reference).

### Language Understanding (LUIS)

Variations in Azure Government:

- LUIS portal: https://luis.azure.us
- Speech Requests and Prebuilt Domains are not currently available
- Speech Priming is not currently available

For more information, see [global Azure documentation](../cognitive-services/luis/what-is-luis.md) for Language Understanding.

### QnA Maker

Variations in Azure Government:

- QnA Maker portal: https://qnamaker.azure.us

For more information, see [global Azure documentation](../cognitive-services/QnAMaker/Overview/overview.md) for QnA Maker.

### Text Analytics

For more information, see [global Azure documentation](../cognitive-services/text-analytics/index.yml) for Text Analytics.

## Decision

### Content Moderator

Variations in Azure Government:

- The Review UI and Review APIs are not available at this time
 
For more information, see the [global Azure documentation](../cognitive-services/content-moderator/overview.md) and [Content Moderator API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66c).


### Personalizer

For more information, see [global Azure documentation](../cognitive-services/personalizer/index.yml) for Personalizer.

## Azure Bot Service

Variations in Azure Government:

The service URL endpoints for Azure Bot Service apps created in Azure Government are different from those apps created in the Azure public cloud:

- Bot Service Endpoints:    *.botframework.azure.us
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
- Speech Services

For more information, see [global Azure documentation](https://aka.ms/botdocs/) for Bot Service.

## Data Considerations

Data considerations for Cognitive Services and Azure Bot Service are not yet available. 

## Next Steps
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the [azure-gov](https://stackoverflow.com/questions/tagged/azure-gov) tag
* Give us feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government) 
