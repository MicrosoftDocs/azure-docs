---
title: Azure Media Services v3 SDKs - Azure
description: This article provides an overview of how to start developing with  Media Services v3 API using SDKs/tools.
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
ms.date: 03/20/2019
ms.author: juliako
ms.custom: 
---

# Start developing with Media Services v3 API using SDKs/tools

As a developer, you can use Media Services [REST API](https://aka.ms/ams-v3-rest-ref) or client libraries that allow you to interact with the REST API to easily create, manage, and maintain custom media workflows. The [Media Services v3](https://aka.ms/ams-v3-rest-sdk) API is based on the OpenAPI specification (formerly known as a Swagger).

This topic provides links to the SDKs, tools, documentation. It also provides some useful information for different dev env.

## Prerequisites

To start developing against Media Services, you need:

- An active Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.
- [Learn about fundamental concepts](concepts-overview.md)
- [Create a Media Services account](create-account-cli-how-to.md)

## Start developing

Azure Media Services supports the following SDKs/tools 

- [Azure CLI](https://aka.ms/ams-v3-cli) 
- [.NET SDK](https://aka.ms/ams-v3-dotnet-sdk)
- [Java SDK](https://aka.ms/ams-v3-java-sdk)
- [Node.js SDK](https://aka.ms/ams-v3-nodejs-sdk)
- [Python SDK](https://aka.ms/ams-v3-python-sdk)
- [Go SDK](https://aka.ms/ams-v3-go-sdk)
- [Ruby SDK](https://aka.ms/ams-v3-ruby-sdk)

### Azure Media Services Explorer

[Azure Media Services Explorer](https://github.com/Azure/Azure-Media-Services-Explorer) (AMSE) is a tool available to Windows customers who want to learn about Media Services. AMSE is a Winforms/C# application that does upload, download, encode, stream VOD and live content with Media Services. The AMSE tool is for clients who want to test Media Services without writing any code. The AMSE code is provided as a resource for customers who want to develop with Media Services.

AMSE is an Open Source project, support is provided by the community (issues can be reported to https://github.com/Azure/Azure-Media-Services-Explorer/issues). This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact opencode@microsoft.com with any additional questions or comments.

## REST

To start developing with the Media Services REST APIs, install a REST client. For example **Postman**, **Visual Studio Code** with the REST plugin, or **Telerik Fiddler**. We are using [Postman](media-rest-apis-with-postman.md) for Media Services v3 samples.

Explore the Media Services [REST API ref](https://aka.ms/ams-v3-rest-ref) documentation and check out these examples:

- [Tutorial: Encode a remote file based on URL and stream the video - REST](stream-files-tutorial-with-rest.md)
- [Upload files into a Media Services account - REST](upload-files-rest-how-to.md)
- [Create filters with Media Services - REST](filters-dynamic-manifest-rest-howto.md)
- [Azure Resource Manager based REST API](https://github.com/Azure-Samples/media-services-v3-arm-templates)

<!-- ## CLI -->
[!INCLUDE [media-services-cli-instructions](../../../includes/media-services-cli-instructions.md)]

Explore the Media Services [Azure CLI ref](https://aka.ms/ams-v3-cli-ref) documentation and check out these examples:

- [Scale Media Reserved Units - CLI](media-reserved-units-cli-how-to.md)
- [Create a Media Services account - CLI](./scripts/cli-create-account.md) 
- [Reset account credentials - CLI](./scripts/cli-reset-account-credentials.md)
- [Create assets - CLI](./scripts/cli-create-asset.md)
- [Upload a file - CLI](./scripts/cli-upload-file-asset.md)
- [Create transforms - CLI](./scripts/cli-create-transform.md)
- [Create jobs - CLI](./scripts/cli-create-jobs.md)
- [Create EventGrid - CLI](./scripts/cli-create-event-grid.md)
- [Publish an asset - CLI](./scripts/cli-publish-asset.md)
- [Filter - CLI](filters-dynamic-manifest-cli-howto.md)

## .NET

Explore the Media Services [.NET ref](https://aka.ms/ams-v3-dotnet-ref) documentation and check out these examples:

- [Tutorial: Upload, encode, and stream videos - .NET](stream-files-tutorial-with-api.md) 
- [Tutorial: Stream live with Media Services v3 - .NET](stream-live-tutorial-with-api.md)
- [Tutorial: Analyze videos with Media Services v3 - .NET](analyze-videos-tutorial-with-api.md)
- [Create a job input from a local file - .NET](job-input-from-local-file-how-to.md)
- [Create a job input from an HTTPS URL - .NET](job-input-from-http-how-to.md)
- [Encode with a custom Transform - .NET](customize-encoder-presets-how-to.md)
- [Use AES-128 dynamic encryption and the key delivery service - .NET](protect-with-aes128.md)
- [Use DRM dynamic encryption and license delivery service - .NET](protect-with-drm.md)
- [Get a signing key from the existing policy - .NET](get-content-key-policy-dotnet-howto.md)
- [Create filters with Media Services - .NET](filters-dynamic-manifest-dotnet-howto.md)
- [Advanced video on-demand examples of Azure Functions v2 with Media Services v3](https://aka.ms/ams3functions)

## Java

Review the Media Services [Java ref](https://aka.ms/ams-v3-java-ref) documentation.

## Node.js

Explore the Media Services [Node.js ref](https://aka.ms/ams-v3-nodejs-ref) documentation and check out [samples](https://github.com/Azure-Samples/media-services-v3-node-tutorials) that show how to use Media Services API with node.js.

## Python

Review the Media Services [Python ref](https://aka.ms/ams-v3-python-ref) documentation.

## Go

Review the Media Services [Go ref](https://aka.ms/ams-v3-go-ref) documentation.

## Next steps

- [Create an account - CLI](create-account-cli-how-to.md)
- [Access APIs - CLI](access-api-cli-how-to.md)

