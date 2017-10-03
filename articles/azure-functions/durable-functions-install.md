---
title: Install the Durable Functions extension for Azure Functions
description: Learn how to install the Durable Functions extension for Azure Functions, for portal development or Visual Studio development.
services: functions
author: cgillum
manager: cfowler
editor: ''
tags: ''
keywords:
ms.service: functions
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: multiple
ms.workload: na
ms.date: 09/29/2017
ms.author: cgillum
---

# Install the Durable Functions extension

The [Durable Functions](durable-functions-overview.md) extension for Azure Functions is provided in the NuGet package [Microsoft.Azure.WebJobs.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask). The details of how to install the package depend on which development tools you use to develop your app. 

## Visual Studio 2017 (Recommended)

Visual Studio currently provides the best experience for developing apps that use Durable Functions.  Your functions can be run locally and can also be published to Azure. Here's how to get started:

1. Install the [latest version of Visual Studio](https://www.visualstudio.com/downloads/) (version 15.3 or greater). Include the Azure tools in your setup options.
2. Download the [Visual Studio Sample App .zip file](https://azure.github.io/azure-functions-durable-extension/files/VSDFSampleApp.zip). The sample project references the Durable Extensions NuGet package.

If you prefer to start with a new Function App project that you create yourself, add the following NuGet package reference to your *.csproj* file:

```xml
<PackageReference Include="Microsoft.Azure.WebJobs.Extensions.DurableTask" Version="1.0.0-beta" />
```

## Azure portal

If you're using the Azure portal for development, create a new function and select the **Durable Orchestration Trigger - C#** template. This template downloads the extension from NuGet.org and creates a new orchestrator function.

## Other development tools

Directions for using other development tools, such as Visual Studio Code, are not available yet.

## Next steps

> [!div class="nextstepaction"]
> [Examine and run a function chaining sample](durable-functions-sequence.md)


