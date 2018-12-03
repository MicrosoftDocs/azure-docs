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

This article outlines variations and considerations when using **Cognitive Services** in the Azure Government environment.

The following Cognitive Services are generally available in Azure Government: 

- Computer Vision
- Face
- Content Moderator
- Translator Text
- Language Understanding

> [!IMPORTANT]
> Billing for Computer Vision, Face, Translator Text, Content Moderator, and Language Understanding will begin on 11/1/2018.

### Vision

#### Computer Vision

Variations in Azure Government:

- Endpoint URL: https://virginia.api.cognitive.microsoft.us/vision/v2.0/
- Available SKUs: S1

For more information, see the [global Azure documentation](../cognitive-services/computer-vision/index.yml) and [Computer Vision API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/5adf991815e1060e6355ad44/operations/56f91f2e778daf14a499e1fa).
 
#### Face

Variations in Azure Government:

- Endpoint: https://virginia.api.cognitive.microsoft.us/face/v1.0/
- Available SKUs: S0

For more information, see the [global Azure documentation](../cognitive-services/face/index.yml) and [Face API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236).

#### Content Moderator

Variations in Azure Government:

- Endpoint: https://virginia.api.cognitive.microsoft.us/contentmoderator
- The Review UI and Review APIs are not available at this time
- Available SKUs: S0
 
For more information, see the [global Azure documentation](../cognitive-services/content-moderator/overview.md) and [Content Moderator API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/57cf753a3f9b070c105bd2c1/operations/57cf753a3f9b070868a1f66c).

### Language
 
#### Translator Text (Text Translation): 

Variations in Azure Government:

- Endpoint:  https://api.cognitive.microsofttranslator.us
- Auth Token Service: https://virginia.api.cognitive.microsoft.us/sts/v1.0/issueToken
- Available SKUs: S1
- Custom Translator and Translator Hub are not supported.
 
For more information, see the [global Azure documentation](../cognitive-services/translator/translator-info-overview.md) and [Translator Text API documentation](https://docs.microsoft.com/azure/cognitive-services/Translator/reference/v3-0-reference).

#### Language Understanding (LUIS)

Variations in Azure Government:

- Endpoint: https://virginia.api.cognitive.microsoft.us/luis/v2.0
- LUIS portal: https://luis.azure.us
- Available SKUs: S0
- Speech Requests, Speech Priming, Spell Check, and Prebuilt Domains are not currently available

For more information, see [global Azure documentation](../cognitive-services/luis/what-is-luis.md) for Language Understanding.

### Speech (currently in Public Preview)

#### Translator Speech (Speech Translation)

Variations in Azure Government:

- Endpoint: https://docs.microsoft.com/azure/cognitive-services/translator-speech/
- Auth Token Service: https://virginia.api.cognitive.microsoft.us/sts/v1.0/issueToken
- Provisioning and management are available through PowerShell and CLI only (no Azure portal support)
- Available SKUs: S1, S2, S3, S4

For more information, see the [global Azure documentation](../cognitive-services/speech/home.md) for Translator Speech. 

### Data Considerations

Data considerations for Cognitive Services are not yet available. 

## Next Steps
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the [azure-gov](https://stackoverflow.com/questions/tagged/azure-gov) tag
* Give us feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government) 

