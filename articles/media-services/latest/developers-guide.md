---
title: Azure Media Services v3 SDKs - Azure
description: This article provides an overview of how to start developing with  Media Services v3 API using SDKs.
services: media-services
documentationcenter: na
author: Juliako
manager: femila
editor: ''
tags: ''
keywords: 

ms.service: media-services
ms.devlang: multiple
ms.topic: overview
ms.tgt_pltfrm: multiple
ms.workload: media
ms.date: 04/11/2019
ms.author: juliako
ms.custom: 
---

# Develop against Media Services v3 API using SDKs

As a developer, you can use Media Services [REST API](https://aka.ms/ams-v3-rest-ref) or client libraries that allow you to interact with the REST API to easily create, manage, and maintain custom media workflows. The [Media Services v3](https://aka.ms/ams-v3-rest-sdk) API is based on the OpenAPI specification (formerly known as a Swagger).

> [!NOTE]
> The Azure Media Services v3 SDKs are not guaranteed to be thread-safe. When developing a multi-threaded application, you should add your own thread synchronization logic to protect the client or use a new AzureMediaServicesClient object per thread. You should also be careful of multi-threading issues introduced by optional objects provided by your code to the client (like an HttpClient instance in .NET).

This topic provides links to the SDKs, tools, how-to guides.

## Prerequisites

To start developing against Media Services, you need:

- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- [Learn about fundamental concepts](concepts-overview.md)
- Review [Developing with Media Services v3 APIs](media-services-apis-overview.md)
- [Create a Media Services account - CLI](create-account-cli-how-to.md)

## Start developing with SDKs

### .NET

Use [.NET SDK](https://aka.ms/ams-v3-dotnet-sdk) to  [connect to Media Services](configure-connect-dotnet-howto.md).

Explore the Media Services [.NET reference](https://aka.ms/ams-v3-dotnet-ref) documentation.

### Java

Use [Java SDK](https://aka.ms/ams-v3-java-sdk) to [connect to Media Services](configure-connect-java-howto.md).

Review the Media Services [Java reference](https://aka.ms/ams-v3-java-ref) documentation.

### Node.js

Use [Node.js SDK](https://aka.ms/ams-v3-nodejs-sdk) to [connect to Media Services](configure-connect-nodejs-howto.md).

Explore the Media Services [Node.js reference](https://aka.ms/ams-v3-nodejs-ref) documentation and check out [samples](https://github.com/Azure-Samples/media-services-v3-node-tutorials) that show how to use Media Services API with node.js.

### Python

Use [Python SDK](https://aka.ms/ams-v3-python-sdk).

Review the Media Services [Python reference](https://aka.ms/ams-v3-python-ref) documentation.

### Go

Use [Go SDK](https://aka.ms/ams-v3-go-sdk).

Review the Media Services [Go reference](https://aka.ms/ams-v3-go-ref) documentation.

### Ruby

Use [Ruby SDK](https://aka.ms/ams-v3-ruby-sdk).

## Azure Media Services Explorer

[Azure Media Services Explorer](https://github.com/Azure/Azure-Media-Services-Explorer) (AMSE) is a tool available to Windows customers who want to learn about Media Services. AMSE is a Winforms/C# application that does upload, download, encode, stream VOD and live content with Media Services. The AMSE tool is for clients who want to test Media Services without writing any code. The AMSE code is provided as a resource for customers who want to develop with Media Services.

AMSE is an Open Source project, support is provided by the community (issues can be reported to https://github.com/Azure/Azure-Media-Services-Explorer/issues). This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact opencode@microsoft.com with any additional questions or comments.

## Next steps

[Overview](media-services-overview.md)
