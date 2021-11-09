---
title: Develop Azure Functions with Media Services v3
description: This article shows how to start developing Azure Functions with Media Services v3 using Visual Studio Code.
services: media-services
author: xpouyat
ms.service: media-services
ms.workload: media
ms.devlang: dotnet
ms.topic: article
ms.date: 06/09/2021
ms.author: xpouyat
ms.custom: devx-track-csharp
---

# Develop Azure Functions with Media Services v3

[!INCLUDE [media services api v3 logo](./includes/v3-hr.md)]

This article shows you how to get started with creating Azure Functions that use Media Services. The Azure Function defined in this article encodes a video file with Media Encoder Standard. As soon as the encoding job has been created, the function returns the job name and output asset name. To review Azure Functions, see [Overview](../../azure-functions/functions-overview.md) and other topics in the **Azure Functions** section.

If you want to explore and deploy existing Azure Functions that use Azure Media Services, check out [Media Services Azure Functions](https://github.com/Azure-Samples/media-services-v3-dotnet-core-functions-integration). This repository contains examples that use Media Services to show workflows related to ingesting content directly from blob storage, encoding, and live streaming operations.

## Prerequisites

- Before you can create your first function, you need to have an active Azure account. If you don't already have an Azure account, [free accounts are available](https://azure.microsoft.com/free/).
- If you are going to create Azure Functions that perform actions on your Azure Media Services (AMS) account or listen to events sent by Media Services, you should create an AMS account, as described [here](account-create-how-to.md).
- Install [Visual Studio Code](https://code.visualstudio.com/) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).

This article explains how to create a C# .NET 5 function that communicates with Azure Media Services. To create a function with another language, look to this [article](../../azure-functions/functions-develop-vs-code.md).

### Run local requirements

These prerequisites are only required to run and debug your functions locally. They aren't required to create or publish projects to Azure Functions.

- [.NET Core 3.1 and .NET 5 SDKs](https://dotnet.microsoft.com/download/dotnet).

- The [Azure Functions Core Tools](../../azure-functions/functions-run-local.md#install-the-azure-functions-core-tools) version 3.x or later. The Core Tools package is downloaded and installed automatically when you start the project locally. Core Tools includes the entire Azure Functions runtime, so download and installation might take some time.

- The [C# extension](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp) for Visual Studio Code.

## Install the Azure Functions extension

You can use the Azure Functions extension to create and test functions and deploy them to Azure.

1. In Visual Studio Code, open **Extensions** and search for **Azure functions**, or select this link in Visual Studio Code: [`vscode:extension/ms-azuretools.vscode-azurefunctions`](vscode:extension/ms-azuretools.vscode-azurefunctions).

1. Select **Install** to install the extension for Visual Studio Code:

    ![Install the extension for Azure Functions](./Media/integrate-azure-functions-dotnet-how-to/vscode-install-extension.png)

1. After installation, select the Azure icon on the Activity bar. You should see an Azure Functions area in the Side Bar.

    ![Azure Functions area in the Side Bar](./Media/integrate-azure-functions-dotnet-how-to/azure-functions-window-vscode.png)

## Create an Azure Functions project

The Functions extension lets you create a function app project, along with your first function. The following steps show how to create an HTTP-triggered function in a new Functions project. HTTP trigger is the simplest function trigger template to demonstrate.

1. From **Azure: Functions**, select the **Create Function** icon:

    ![Create a function](./Media/integrate-azure-functions-dotnet-how-to/create-function.png)

1. Select the folder for your function app project, and then **Select C# for your function project** and **.NET 5 Isolated** for the runtime.

1. Select the **HTTP trigger** function template.

    ![Choose the HTTP trigger template](./Media/integrate-azure-functions-dotnet-how-to/create-function-choose-template.png)

1. Type **HttpTriggerEncode** for the function name and select Enter, accept **Company.Function** for the namespace then select **Function** for the access rights. This authorization level requires you to provide a [function key](../../azure-functions/functions-bindings-http-webhook-trigger.md#authorization-keys) when you call the function endpoint.

    ![Select Function authorization](./Media/integrate-azure-functions-dotnet-how-to/create-function-auth.png)

    A function is created in your chosen language and in the template for an HTTP-triggered function.

    ![HTTP-triggered function template in Visual Studio Code](./Media/integrate-azure-functions-dotnet-how-to/new-function-full.png)

## Install Media Services and other extensions

Run the dotnet add package command in the Terminal window to install the extension packages that you need in your project. The following command installs the Media Services package and other extensions needed by the sample.

```bash
dotnet add package Azure.Storage.Blobs
dotnet add package Microsoft.Azure.Management.Media
dotnet add package Azure.Identity
```

## Generated project files

The project template creates a project in your chosen language and installs required dependencies. The new project has these files:

* **host.json**: Lets you configure the Functions host. These settings apply when you're running functions locally and when you're running them in Azure. For more information, see [host.json reference](./../../azure-functions/functions-host-json.md).

* **local.settings.json**: Maintains settings used when you're running functions locally. These settings are used only when you're running functions locally.

    >[!IMPORTANT]
    >Because the local.settings.json file can contain secrets, you need to exclude it from your project source control.

* **HttpTriggerEncode.cs** class file that implements the function.

### HttpTriggerEncode.cs

This is the C# code for your function. Its role is to take a Media Services asset or a source URL and launches an encoding job with Media Services. It uses a Transform that is created if it does not exist. When it is created, it used the preset provided in the input body. 

>[!IMPORTANT]
>Replace the full content of HttpTriggerEncode.cs file with [`HttpTriggerEncode.cs` from this repository](https://github.com/Azure-Samples/media-services-v3-dotnet-core-functions-integration/blob/main/Tutorial/HttpTriggerEncode.cs).

Once you are done defining your function, select **Save and Run**.

The source code for the **Run** method of the function is:

[!code-csharp[Main](../../../media-services-v3-dotnet-core-functions-integration/Tutorial/HttpTriggerEncode.cs#Run)]

### local.settings.json

Update the file with the following content (and replace the values).

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated",
    "AadClientId": "00000000-0000-0000-0000-000000000000",
    "AadEndpoint": "https://login.microsoftonline.com",
    "AadSecret": "00000000-0000-0000-0000-000000000000",
    "AadTenantId": "00000000-0000-0000-0000-000000000000",
    "AccountName": "amsaccount",
    "ArmAadAudience": "https://management.core.windows.net/",
    "ArmEndpoint": "https://management.azure.com/",
    "ResourceGroup": "amsResourceGroup",
    "SubscriptionId": "00000000-0000-0000-0000-000000000000"
  }
}
```

## Test your function

When you run the function locally in VS Code, the function should be exposed as: 

```url
http://localhost:7071/api/HttpTriggerEncode
```

To test it, you can use Postman to do a POST on this URL using a JSON input body.

JSON input body example:

```json
{
    "inputUrl":"https://nimbuscdn-nimbuspm.streaming.mediaservices.windows.net/2b533311-b215-4409-80af-529c3e853622/Ignite-short.mp4",
    "transformName" : "TransformAS",
    "builtInPreset" :"AdaptiveStreaming"
 }
```

The function should return 200 OK with an output body containing the job and output asset names.

![Test the function with Postman](./Media/integrate-azure-functions-dotnet-how-to/postman.png)

## Next steps

At this point, you are ready to start developing functions that call Media Services API.

For more information and a complete sample of using Azure Functions with Azure Media Services v3, see the [Media Services v3 Azure Functions sample](https://github.com/Azure-Samples/media-services-v3-dotnet-core-functions-integration/tree/main/Functions).
