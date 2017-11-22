---
title: Install the Durable Functions extension and samples - Azure
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
ms.author: azfuncdf
---

# Install the Durable Functions extension and samples (Azure Functions)

The [Durable Functions](durable-functions-overview.md) extension for Azure Functions is provided in the NuGet package [Microsoft.Azure.WebJobs.Extensions.DurableTask](https://www.nuget.org/packages/Microsoft.Azure.WebJobs.Extensions.DurableTask). This article shows how to install the package and a set of samples for the following development environments:

* Visual Studio 2017 (Recommended) 
* Azure portal

## Visual Studio 2017

Visual Studio currently provides the best experience for developing apps that use Durable Functions.  Your functions can be run locally and can also be published to Azure. You can start with an empty project or with a set of sample functions.

### Prerequisites

* Install the [latest version of Visual Studio](https://www.visualstudio.com/downloads/) (version 15.3 or greater). Include the Azure tools in your setup options.

### Start with sample functions

1. Download the [Sample App .zip file for Visual Studio](https://azure.github.io/azure-functions-durable-extension/files/VSDFSampleApp.zip). You don't need to add the NuGet reference because the sample project already has it.
2. Install and run [Azure Storage Emulator](https://docs.microsoft.com/azure/storage/storage-use-emulator) version 5.2 or later. Alternatively, you can update the *local.appsettings.json* file with real Azure Storage connection strings.
3. Open the project in Visual Studio 2017. 
4. For instructions on how to run the sample, start with [Function chaining - Hello sequence sample](durable-functions-sequence.md). The sample can be run locally or published to Azure.

### Start with an empty project
 
Follow the same directions as for starting with the sample, but do the following steps instead of downloading the *.zip* file:

1. Create a Function App project.
2. Add the following NuGet package reference to your *.csproj* file:

   ```xml
   <PackageReference Include="Microsoft.Azure.WebJobs.Extensions.DurableTask" Version="1.0.0-beta" />
   ```

## Azure portal

If you prefer, you can use the Azure portal for Durable Functions development.

### Create an orchestrator function

1. Create a new function app at [functions.azure.com](https://functions.azure.com/signin).
2. Configure the function app to [use the 2.0 runtime version](functions-versions.md).
3. Create a new function, and select the **Durable Functions Orchestrator - C#** template.
4. Under **Extensions not installed**, click **Install** to download the extension from NuGet.org.

### Copy sample code to the function app

1. Download the [DFSampleApp.zip](https://github.com/Azure/azure-functions-durable-extension/raw/master/docfx/files/DFSampleApp.zip) file.
2. Unzip the sample file into `D:\home\site\wwwroot` in the function app, using Kudu or FTP.

## Next steps

> [!div class="nextstepaction"]
> [Run the function chaining sample](durable-functions-sequence.md)
