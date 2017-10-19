---
title: Azure Government AI and Cognitive Services | Microsoft Docs
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: jglixon
manager: zakramer

ms.assetid: c00ccd0c-0345-49ee-84f0-15262ff05923
ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 7/25/2017
ms.author: jglixon

---
# Azure Government AI and Cognitive Services

## Cognitive Services 
The following Cognitive Services APIs are currently in Public Preview in Azure Government. 
- Computer Vision API
- Face API
- Translator Speech API
- Translator Text API

Email AzureGovFeedback@microsoft.com if you run into any issues using these APIs.
 

### Variations
- Provisioning and management for the following APIs are available through PowerShell and CLI only (no UI).

#### Vision

##### Computer Vision API
The following variations exist for Computer Vision API from Commercial Azure:
- Endpoint URL: https://virginia.api.cognitive.microsoft.us/vision/v1.0/
- Available SKUs: F0, S0, S1

For more information, please see [public documentation](../cognitive-services/computer-vision/index.md) and [public API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa) for Computer Vision API.
 
##### Face API
The following variations exist for Face API from Commercial Azure:
- Endpoint: https://virginia.api.cognitive.microsoft.us/face/v1.0/
- Available SKUs: F0, S0
 
For more information, please see [public documentation](../cognitive-services/Face/index.md) and [public API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) for Face API.

##### Emotion API
Emotion API is being deprecated and all of its technology has been incorporated to Face API.
 
#### Speech
 
##### Translator Speech API (Speech Translation): 
The following variations exist for Translator Speech API from Commercial Azure:
- Endpoint: https://dev.microsofttranslator.us
- Auth Token Service: https://virginia.api.cognitive.microsoft.us/sts/v1.0/issueToken
- Available SKUs: F0, S1, S2, S3, S4
 
For more information, please see [public documentation](../cognitive-services/Speech/Home.md) and [public API documentation](http://docs.microsofttranslator.com/speech-translate.html) for Bing Speech API.
 
#### Language
 
##### Translator Text API (Text Translation): 
The following variations exist for Translator Text API from Commercial Azure:
- Endpoint: https://api.microsofttranslator.us
- Auth Token Service: https://virginia.api.cognitive.microsoft.us/sts/v1.0/issueToken
- Available SKUs: F0, S1, S2, S3, S4
- Translator Hub, Web Widget, and Collaboration Translation Framework (CTF) are not supported.
 
For more information, please see [public documentation](../cognitive-services/translator/translator-info-overview.md) and [public API documentation](http://docs.microsofttranslator.com/text-translate.html) for Translator Text API.


### Data Considerations
Data considerations for Cognitive Services are not yet available. 

## Next Steps
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the [azure-gov](https://stackoverflow.com/questions/tagged/azure-gov) tag
* Give us feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government) 

