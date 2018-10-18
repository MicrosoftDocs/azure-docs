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
ms.date: 10/18/2018
ms.author: jglixon

---
# Azure Government AI and Cognitive Services

## Cognitive Services 

The following Cognitive Services are generally available in Azure Government: 

- Computer Vision
- Face
- Content Moderator
- Translator Text
- Language Understanding

> [!IMPORTANT]
> Billing for Computer Vision, Face, Translator Text, Content Moderator, and Language Understanding will begin on 11/1/2018.

#### Vision

##### Computer Vision API
The following variations exist for Computer Vision API from global Azure:

- Endpoint URL: https://virginia.api.cognitive.microsoft.us/vision/v2.0/
- Available SKUs: S1

For more information, see the [global Azure documentation](../cognitive-services/computer-vision/index.yml) and [Computer Vision API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa) for Computer Vision API.
 
##### Content Moderator

The following variations exist for Face API from global Azure:

- Endpoint: https://virginia.api.cognitive.microsoft.us/contentmoderator
- The Review UI and Review APIs are not available at this time
- Available SKUs: S0
 
For more information, see the [global Azure documentation](../cognitive-services/content-moderator/overview.md).

#### Language
 
##### Translator Text (Text Translation): 

The following variations exist for Translator Text API from global Azure:

- Endpoint:  https://api.cognitive.microsofttranslator.us
- Auth Token Service: https://virginia.api.cognitive.microsoft.us/sts/v1.0/issueToken
- Available SKUs: S1
- Custom Translator and Translator Hub are not supported.
 
For more information, see the [global Azure documentation](../cognitive-services/translator/translator-info-overview.md) for Translator Text.

##### Language Understanding (LUIS)

The following variations exist for Language Understanding from global Azure:

- Endpoint: https://virginia.api.cognitive.microsoft.us/luis/v2.0
- LUIS portal: https://luis.azure.us
- Available SKUs: S0

For more information, see [global Azure documentation](../cognitive-services/luis/what-is-luis.md) for Language Understanding.

#### Speech (Preview)

### Data Considerations

Data considerations for Cognitive Services are not yet available. 

##### Translator Speech (Speech Translation):

The following variations exist for Translator Speech from global Azure:

- Endpoint: https://docs.microsoft.com/azure/cognitive-services/translator-speech/
- Auth Token Service: https://virginia.api.cognitive.microsoft.us/sts/v1.0/issueToken
- Provisioning and management are available through PowerShell and CLI only (no Azure portal support)
- Available SKUs: S1, S2, S3, S4

For more information, see the [global Azure documentation](../cognitive-services/speech/home.md) for Translator Speech. 

## Next Steps
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the [azure-gov](https://stackoverflow.com/questions/tagged/azure-gov) tag
* Give us feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government) 

