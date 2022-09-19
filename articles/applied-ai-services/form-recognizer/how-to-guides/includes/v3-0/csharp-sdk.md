---
title: "Use Form Recognizer SDK for C# / .NET (REST API v3.0)"
description: 'Use the Form Recognizer SDK for C# / .NET (REST API v3.0) to create a forms processing app that extracts key data from documents.'
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 09/16/2022
ms.author: lajanuar
ms.custom: devx-track-csharp
---

<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->

> [!IMPORTANT]
>
> This project targets Form Recognizer REST API version **3.0**.

[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/dotnet/Azure.AI.FormRecognizer/4.0.0/index.html)|[API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.FormRecognizer/4.0.0) | [Samples](https://github.com/Azure/azure-sdk-for-net/blob/Azure.AI.FormRecognizer_4.0.0/sdk/formrecognizer/Azure.AI.FormRecognizer/samples/README.md) | [Supported REST API versions](../../../sdk-overview.md)


## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* The current version of [Visual Studio IDE](https://visualstudio.microsoft.com/vs/). <!-- or [.NET Core](https://dotnet.microsoft.com/download). -->

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource, in the Azure portal, to get your key and endpoint.

* You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!TIP]
> Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

## Set up

1. Start Visual Studio.

1. On the start page, choose Create a new project.

    :::image type="content" source="../../media/quickstarts/start-window.png" alt-text="Screenshot: Visual Studio start window.":::

1. On the **Create a new project page**, enter **console** in the search box. Choose the **Console Application** template, then choose **Next**.

    :::image type="content" source="../../media/quickstarts/create-new-project.png" alt-text="Screenshot: Visual Studio's create new project page.":::

1. In the **Configure your new project** dialog window, enter `formRecognizer_quickstart` in the Project name box. Then choose Next.

    :::image type="content" source="../../media/quickstarts/configure-new-project.png" alt-text="Screenshot: Visual Studio's configure new project dialog window.":::

1. In the **Additional information** dialog window, select **.NET 6.0 (Long-term support)**, and then select **Create**.

    :::image type="content" source="../../media/quickstarts/additional-information.png" alt-text="Screenshot: Visual Studio's additional information dialog window.":::

### Install the client library with NuGet

 1. Right-click on your **formRecognizer_quickstart** project and select **Manage NuGet Packages...** .

    :::image type="content" source="../../media/quickstarts/select-nuget-package.png" alt-text="Screenshot of select NuGet package window in Visual Studio.":::

 1. Select the Browse tab and type Azure.AI.FormRecognizer.

     :::image type="content" source="../../media/quickstarts/azure-nuget-package.png" alt-text="Screenshot of select pre-release NuGet package in Visual Studio.":::

 1. Select version **4.0.0** from the dropdown menu and install the package in your project.
<!-- --- -->

## Build your application

To interact with the Form Recognizer service, you'll need to create an instance of the `DocumentAnalysisClient` class. To do so, you'll create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentAnalysisClient`  instance with the `AzureKeyCredential` and your Form Recognizer `endpoint`.

> [!NOTE]
>
> * Starting with .NET 6, new projects using the `console` template generate a new program style that differs from previous versions.
> * The new output uses recent C# features that simplify the code you need to write.
> * When you use the newer version, you only need to write the body of the `Main` method. You don't need to include top-level statements, global using directives, or implicit using directives.
> * For more information, *see* [**New C# templates generate top-level statements**](/dotnet/core/tutorials/top-level-templates).

1. Open the **Program.cs** file.

1. Delete the pre-existing code, including the line `Console.Writeline("Hello World!")`, and select one of the following code samples to copy and paste into your application's Program.cs file:

## Read model

## Layout model

## General document model

## W2 model

## Invoice model

## Receipt-model

## ID document model

## Business card model
