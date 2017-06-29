---
title: Connecting to Media Services Account using REST API | Microsoft Docs
description: This topic demonstrates how to connect to Media Services uisng REST API.
services: media-services
documentationcenter: ''
author: Juliako
manager: erikre
editor: ''

ms.assetid: 79dc64f1-15d8-4a81-b9d9-3d3c44d2e1e8
ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: dotnet
ms.topic: article
ms.date: 06/28/2017
ms.author: juliako

---
# Connecting to Media Services Account using Media Services REST API

The Azure Media Services API is a RESTful API, to perform operations on media resources, you can use REST API or available client SDKs. Azure Media Services (AMS) provides Media Services client SDK for .NET. To be authorized to access AMS resources/API, you must first be authenticated. 

AMS supports Azure Active Directory [(AAD) based authentication](../active-directory/active-directory-whatis.md). The Azure Media REST service requires that the User or Application making REST API requests must have either **contributor** or **owner** level access to the resources. For more information, see [Get started with Role-Based Access Control in the Azure portal](../active-directory/role-based-access-control-what-is.md).  

>[!IMPORTANT]
>AMS currently supports ACS authentication model. However, ACS auth is going to be deprecated on June 1st, 2018. We recommend that you migrate to AAD authentication model as soon as possible.

## Next steps

For more information, see [Accessing Azure Media Services API with AAD authentication overview](media-services-use-aad-auth-to-access-ams-api).
