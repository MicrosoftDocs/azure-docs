---
title: Azure Media Services v3 SDKs - Azure
description: This article provides an overview of how to start developing with  Media Services v3 API using SDKs/tools.
services: media-services
documentationcenter: na
author: Juliako
manager: femila
editor: ''
tags: ''
keywords: azure media services, stream, broadcast, live, offline

ms.service: media-services
ms.devlang: multiple
ms.topic: overview
ms.tgt_pltfrm: multiple
ms.workload: media
ms.date: 02/12/2019
ms.author: juliako
ms.custom: 
---

# Start developing with Media Services v3 API using SDKs/tools

As a developer, you can use Media Services [REST API](https://aka.ms/ams-v3-rest-ref) or client libraries that allow you to interact with the REST API to easily create, manage, and maintain custom media workflows. The Media Services v3 API is based on the [OpenAPI specification](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/mediaservices/resource-manager/Microsoft.Media) (formerly known as a Swagger).

## Start with SDKs/tools

Azure Media Services supports the following SDKs/tools 

|API references|SDKs/Tools|Examples|
|---|---|---|---|
|[REST ref](https://aka.ms/ams-v3-rest-ref)|[REST SDK](https://aka.ms/ams-v3-rest-sdk)|[REST Postman examples](https://github.com/Azure-Samples/media-services-v3-rest-postman)<br/>[Azure Resource Manager based REST API](https://github.com/Azure-Samples/media-services-v3-arm-templates)|
|[Azure CLI ref](https://aka.ms/ams-v3-cli-ref)|[Azure CLI](https://aka.ms/ams-v3-cli)|[Azure CLI examples](cli-samples.md)|
|[.NET ref](https://aka.ms/ams-v3-dotnet-ref)|[.NET SDK](https://aka.ms/ams-v3-dotnet-sdk)|[.NET examples](https://github.com/Azure-Samples/media-services-v3-dotnet-tutorials)|
||[.NET Core SDK](https://aka.ms/ams-v3-dotnet-sdk) (Choose the **.NET CLI** tab)|[.NET Core examples](https://github.com/Azure-Samples/media-services-v3-dotnet-core-tutorials)|
|[Java ref](https://aka.ms/ams-v3-java-ref)|[Java SDK](https://aka.ms/ams-v3-java-sdk)||
|[Node.js ref](https://aka.ms/ams-v3-nodejs-ref)|[Node.js SDK](https://aka.ms/ams-v3-nodejs-sdk)|[Node.js samples](https://github.com/Azure-Samples/media-services-v3-node-tutorials)|
|[Python ref](https://aka.ms/ams-v3-python-ref)|[Python SDK](https://aka.ms/ams-v3-python-sdk)||
|[Go ref](https://aka.ms/ams-v3-go-ref)|[Go SDK](https://aka.ms/ams-v3-go-sdk)||
|Ruby|[Ruby SDK](https://aka.ms/ams-v3-ruby-sdk)||

### Azure Media Services Explorer

[Azure Media Services Explorer](https://github.com/Azure/Azure-Media-Services-Explorer) (AMSE) is a tool available to Windows customers who want to learn about Media Services. AMSE is a Winforms/C# application that does upload, download, encode, stream VOD and live content with Media Services. The AMSE tool is for clients who want to test Media Services without writing any code. The AMSE code is provided as a resource for customers who want to develop with Media Services.

AMSE is an Open Source project, support is provided by the community (issues can be reported to https://github.com/Azure/Azure-Media-Services-Explorer/issues). This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact opencode@microsoft.com with any additional questions or comments.
 
## Next steps

- [Create an account - CLI](create-account-cli-how-to.md)
- [Access APIs - CLI](access-api-cli-how-to.md)
- [Tutorial: Upload, encode, and stream videos using .NET](stream-files-tutorial-with-api.md) 
