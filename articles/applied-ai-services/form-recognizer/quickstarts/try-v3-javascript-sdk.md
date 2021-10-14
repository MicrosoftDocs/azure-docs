---
title: "Quickstart: Form Recognizer JavaScript SDK v3.0 | Preview"
titleSuffix: Azure Applied AI Services
description: Form and document processing, data extraction, and analysis using Form Recognizer JavaScript client library SDKs v3.0 (preview)
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 10/13/2021
ms.author: lajanuar
recommendations: false
---

# Quickstart: Form Recognizer JavaScript client library SDKs v3.0 | Preview

>[!NOTE]
> Form Recognizer v3.0 is currently in public preview. Some features may not be supported or have limited capabilities.

[Reference documentation](https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-ai-form-recognizer/4.0.0-beta.1/index.html) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/formrecognizer/ai-form-recognizer/src) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.FormRecognizer) | [Samples](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-form-recognizer_4.0.0-beta.1/sdk/formrecognizer/ai-form-recognizer/README.md)

Get started with Azure Form Recognizer using the JavaScript programming language. Azure Form Recognizer is an [Azure Applied AI Service](../../../applied-ai-services/index.yml) cloud service that uses machine learning to extract and analyze form fields, text, and tables from your documents. You can easily call Form Recognizer models by integrating our client library SDks into your workflows and applications. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

To learn more about Form Recognizer features and development options, visit our [Overview](../overview.md#form-recognizer-features-and-development-options) page.

In this quickstart you'll use following features to analyze and extract data and values from forms and documents:

* [🆕 **General document**](#try-it-general-document-model)—Analyze and extract text, tables, structure, key-value pairs and named entities.

* [**Layout**](#try-it-layout-model)—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes in forms documents, without the need to train a model.

* [**Prebuilt Invoice**](#try-it-prebuilt-invoice-model)Analyze and extract common fields from invoices, using a pre-trained invoice model.

> [!IMPORTANT]
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use secure methods to store and access your credentials. See the Cognitive Services [security](../../../cognitive-services/cognitive-services-security.md) article for more information.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. <!-- or [.NET Core](https://dotnet.microsoft.com/download). -->

* The latest LTS version of [Node.js](https://nodejs.org/about/releases/)

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    > Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'lll need a single-service resource if you intend to use [Azure Active Directory authentication](/azure/active-directory/authentication/overview-authentication).

* After your resource deploys, click **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart:

  :::image type="content" source="../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

## Set up

1. Create a new Node.js application. In a console window (such as cmd, PowerShell, or Bash), create a new directory for your app, and navigate to it.

    ```console
    mkdir form-recognizer-app && cd form-recognizer-app
    ```

1. Run the `npm init` command to create a node application with a `package.json` file.

    ```console
    npm init
    ```

1. Install the `ai-form-recognizer`  client library npm package:

    ```console
    npm install @azure/ai-form-recognizer@4.0.0-beta.1
    ```

    * Your app's `package.json` file will be updated with the dependencies.

1. Create a file named `index.js`, open it, and import the following libraries:

    ```javascript
    import { DocumentAnalysisClient, AzureKeyCredential  } from "@azure/ai-form-recognizer";
    import { DefaultAzureCredential } from "@azure/identity";
    ```

1. Create variables for your resource's Azure endpoint and key:

    ```javascript
    const apiKey = "PASTE_YOUR_FORM_RECOGNIZER_SUBSCRIPTION_KEY_HERE";
    const endpoint = "PASTE_YOUR_FORM_RECOGNIZER_ENDPOINT_HERE";
    ```

1. Build your application

    ```javascript
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

    ```

## **Try it**: General document model

## **Try it**: Layout model

## **Try it**: Prebuilt invoice model