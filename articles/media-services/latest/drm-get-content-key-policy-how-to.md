---
title: Get a signing key from a policy
description: This topic shows how to get a signing key from the existing policy using Media Services v3.
author: IngridAtMicrosoft
manager: femila
ms.service: media-services
ms.topic: how-to
ms.date: 03/09/2022
ms.author: inhenkel
---

# Get a signing key from the existing policy

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

One of the key design principles of the v3 API is to make the API more secure. v3 APIs do not return secrets or credentials on **Get** or **List** operations. See the detailed explanation here: For more information, see [Azure RBAC and Media Services accounts](security-rbac-concept.md)

The example in this article shows how to get a signing key from the existing policy.

## Download

Clone a GitHub repository that contains the full .NET sample to your machine using the following command:  

 ```bash
 git clone https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials.git
 ```
 
The ContentKeyPolicy with secrets example is located in the [EncryptWithDRM](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials/tree/main/AMSV3Tutorials/EncryptWithDRM) folder.

## [.NET](#tab/net/)

## Get ContentKeyPolicy with secrets

To get to the key, use **GetPolicyPropertiesWithSecretsAsync**, as shown in the example below.

[!code-csharp[Main](../../../media-services-v3-dotnet-tutorials/AMSV3Tutorials/EncryptWithDRM/Program.cs#GetOrCreateContentKeyPolicy)]

---
