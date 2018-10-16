---
title: Azure Government AI and Cognitive Services | Microsoft Docs
description: This provides a comparision of features and guidance on developing applications for Azure Government
services: azure-government
cloud: gov
documentationcenter: ''
author: jglixon

ms.service: azure-government
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: azure-government
ms.date: 9/28/2018
ms.author: jglixon

---
# Azure Government AI and Cognitive Services

## Cognitive Services 
The following Cognitive Services APIs are currently in Public Preview in Azure Government. 	The following Cognitive Services APIs are currently in Azure Government:
- Computer Vision API	- Translator Text API (General Availabilty)
- Face API	- Computer Vision API (Public Preview)
- Translator Speech API	- Face API (Public Preview)

### Quickstarts
The [Azure Government Cognitive Services Quickstart](documentation-government-cognitiveservices.md) will guide you through getting started with provisioning an account and accessing the APIs.

### Variations in General Availability

#### Language

##### Translator Text API (Text Translation): 
The following variations exist for Translator Text API from Commercial Azure:
- Endpoint: https://api.cognitive.microsofttranslator.us
- Auth Token Service: https://virginia.api.cognitive.microsoft.us/sts/v1.0/issueToken
- Available SKUs: S1
- Custom Translator and the Translator Hub are not supported.
 
For more information, please see [public documentation](../cognitive-services/translator/translator-info-overview.md) and [public API documentation](https://docs.microsoft.com/azure/cognitive-services/Translator/reference/v3-0-reference) for Translator Text API.

### Variations in Public Preview
The following Cognitive Services APIs are currently in Public Preview in Azure Government. Provisioning and management for the following APIs are available through PowerShell and CLI only (**no Portal Support**).
- Computer Vision API
- Face API

> [!IMPORTANT]
> Billing for the Computer Vision API and the Face API will begin on 11/1/2018.

#### Vision

##### Computer Vision API
The following variations exist for Computer Vision API from Commercial Azure:
- Endpoint URL: https://virginia.api.cognitive.microsoft.us/vision/v1.0/
- Available SKUs: S1

For more information, please see [public documentation](../cognitive-services/computer-vision/index.yml) and [public API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/56f91f2d778daf23d8ec6739/operations/56f91f2e778daf14a499e1fa) for Computer Vision API.
 
##### Face API
The following variations exist for Face API from Commercial Azure:
- Endpoint: https://virginia.api.cognitive.microsoft.us/face/v1.0/
- Available SKUs: S0
 
For more information, please see [public documentation](../cognitive-services/Face/index.yml) and [public API documentation](https://westus.dev.cognitive.microsoft.com/docs/services/563879b61984550e40cbbe8d/operations/563879b61984550f30395236) for Face API.

### Data Considerations
Data considerations for Cognitive Services are not yet available. 

## Next Steps
* Subscribe to the [Azure Government blog](https://blogs.msdn.microsoft.com/azuregov/)
* Get help on Stack Overflow by using the [azure-gov](https://stackoverflow.com/questions/tagged/azure-gov) tag
* Give us feedback or request new features via the [Azure Government feedback forum](https://feedback.azure.com/forums/558487-azure-government) 

