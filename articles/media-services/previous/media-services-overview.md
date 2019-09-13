---
title: Azure Media Services overview | Microsoft Docs
description: This topic gives an overview of Azure Media Services
services: media-services
documentationcenter: ''
author: Juliako
manager: femila
editor: ''

ms.service: media-services
ms.workload: media
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 04/19/2019
ms.author: juliako

---
# Azure Media Services overview 

> [!div class="op_single_selector" title1="Select the version of Media Services that you are using:"]
> * [Version 3](../latest/media-services-overview.md)
> * [Version 2](media-services-overview.md)

> [!NOTE]
> No new features or functionality are being added to Media Services v2. <br/>Check out the latest version, [Media Services v3](https://docs.microsoft.com/azure/media-services/latest/). Also, see [migration guidance from v2 to v3](../latest/migrate-from-v2-to-v3.md)

Microsoft Azure Media Services (AMS) is an extensible cloud-based platform that enables developers to build scalable media management and delivery applications. Media Services is based on REST APIs that enable you to securely upload, store, encode, and package video or audio content for both on-demand and live streaming delivery to various clients (for example, TV, PC, and mobile devices).

You can build end-to-end workflows using entirely Media Services. You can also choose to use third-party components for some parts of your workflow. For example, encode using a third-party encoder. Then, upload, protect, package, deliver using Media Services. You can choose to stream your content live or deliver content on-demand. 

## Prerequisites

To start using Azure Media Services, you should have the following:

* An Azure account. If you don't have an account, you can create a free trial account in just a couple of minutes. For details, see [Azure Free Trial](https://azure.microsoft.com).
* An Azure Media Services account. For more information, see [Create Account](media-services-portal-create-account.md).
* (Optional) Set up development environment. Choose .NET or REST API for your development environment. For more information, see [Set up environment](media-services-dotnet-how-to-use.md).

	Also, learn how to [connect  programmatically to AMS API](media-services-use-aad-auth-to-access-ams-api.md).
* A standard or premium streaming endpoint in started state.  For more information, see [Managing streaming endpoints](media-services-portal-manage-streaming-endpoints.md)

## SDKs and tools

To build Media Services solutions, you can use:

* [Media Services REST API](https://docs.microsoft.com/rest/api/media/operations/azure-media-services-rest-api-reference)
* One of the available client SDKs:
	* Azure Media Services SDK for .NET
	
		* [NuGet package](https://www.nuget.org/packages/windowsazure.mediaservices/)
		* [Github source code](https://github.com/Azure/azure-sdk-for-media-services)
	* [Azure SDK for Java](https://github.com/Azure/azure-sdk-for-java),
	* [Azure PHP SDK](https://github.com/Azure/azure-sdk-for-php),
	* [Azure Media Services for Node.js](https://github.com/michelle-becker/node-ams-sdk/blob/master/lib/request.js) (This is a non-Microsoft version of a Node.js SDK. It is maintained by a community and currently does not have a 100% coverage of the AMS APIs).
* Existing tools:
	* [Azure portal](https://portal.azure.com/)
	* [Azure-Media-Services-Explorer](https://github.com/Azure/Azure-Media-Services-Explorer) (Azure Media Services Explorer (AMSE) is a Winforms/C# application for Windows)

> [!NOTE]
> To get the latest version of Java SDK and get started developing with Java, see [Get started with the Java client SDK for Media Services](https://docs.microsoft.com/azure/media-services/media-services-java-how-to-use). <br/>
> To download the latest PHP SDK for Media Services, look for version 0.5.7 of the Microsoft/WindowAzure package in the [Packagist repository](https://packagist.org/packages/microsoft/windowsazure#v0.5.7).  

## Code samples

Find multiple code samples in the **Azure Code Samples** gallery: [Azure Media Services code samples](https://azure.microsoft.com/resources/samples/?service=media-services&sort=0).

## Concepts

For Azure Media Services concepts, see [Concepts](media-services-concepts.md).

## Supported scenarios and availability of Media Services across data centers

For detailed information, see [AMS scenarios and availability of features and services across data centers](scenarios-and-availability.md).

## Service Level Agreement (SLA)

For more information, see [Microsoft Azure SLA](https://azure.microsoft.com/support/legal/sla/).

For information about availability in datacenters, see the [Availability](scenarios-and-availability.md#availability) section.

## Support

[Azure Support](https://azure.microsoft.com/support/options/) provides support options for Azure, including Media Services.

## Provide feedback

[!INCLUDE [media-services-user-voice-include](../../../includes/media-services-user-voice-include.md)]
