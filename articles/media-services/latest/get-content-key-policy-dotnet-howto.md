---
title: Get a signing key from a policy using Azure Media Services v3 .NET
description: This topic shows how to get a signing key from the existing policy using Media Services v3 .NET SDK.
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: 
ms.topic: article
ms.custom: 
ms.date: 04/15/2019
ms.author: juliako
ms.custom: seodec18

---

# Get a signing key from the existing policy

One of the key design principles of the v3 API is to make the API more secure. v3 APIs do not return secrets or credentials on **Get** or **List** operations. See the detailed explanation here: For more information, see [RBAC and Media Services accounts](rbac-overview.md)

The example in this article shows how to use .NET to get a signing key from the existing policy. 
 
## Download 

Clone a GitHub repository that contains the full .NET sample to your machine using the following command:  

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials.git
 ```
 
The ContentKeyPolicy with secrets example is located in the [EncryptWithDRM](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/tree/master/AMSV3Tutorials/EncryptWithDRM) folder.

## Get ContentKeyPolicy with secrets 

To get to the key, use **GetPolicyPropertiesWithSecretsAsync**, as shown in the example below.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithDRM/Program.cs#GetOrCreateContentKeyPolicy)]

## Next steps

[Design of a multi-DRM content protection system with access control](design-multi-drm-system-with-access-control.md) 
