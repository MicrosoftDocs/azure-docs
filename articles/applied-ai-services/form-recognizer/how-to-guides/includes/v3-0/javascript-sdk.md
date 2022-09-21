---
title: "Use Form Recognizer SDK for JavaScript / .NET (REST API v3.0)"
description: 'Use the Form Recognizer SDK for JavaScript (REST API v3.0) to create a forms processing app that extracts key data from documents.'
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

[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-ai-form-recognizer/4.0.0/index.html) | [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-form-recognizer) | [Samples](https://github.com/witemple-msft/azure-sdk-for-js/tree/7e3196f7e529212a6bc329f5f06b0831bf4cc174/sdk/formrecognizer/ai-form-recognizer/samples/v4) |[Supported REST API versions](../../../sdk-overview.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. For more information, *see* [Node.js in Visual Studio Code](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial)

* The latest LTS version of [Node.js](https://nodejs.org/about/releases/)

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource, in the Azure portal, to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    > Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

* You'll need a document file at a URL. For this project, you can use the sample forms provided in the table below for each feature:

    **Sample documents**

    | **Feature**   | **{modelID}**   | **{document-url}** |
    | --- | --- |--|
    | **Read model** | prebuilt-read | [Sample brochure](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png) |
    | **Layout model** | prebuilt-layout | [Sample booking confirmation](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png) |
    | **General document model** | prebuilt-document | [Sample SEC report](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) |
    | **W-2 form model**  | prebuilt-tax.us.w2 | [Sample W-2 form](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png) |
    | **Invoice model**  | prebuilt-invoice | [Sample invoice](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf) |
    | **Receipt model**  | prebuilt-receipt | [Sample receipt](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png) |
    | **ID document model**  | prebuilt-idDocument | [Sample ID document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png) |
    | **Business card model**  | prebuilt-businessCard | [Sample business card](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/de5e0d8982ab754823c54de47a47e8e499351523/curl/form-recognizer/rest-api/business_card.jpg) |

## Set up

1. Create a new Node.js Express application: In a console window (such as cmd, PowerShell, or Bash), create and navigate to a new directory for your app named `form-recognizer-app`.

    ```console
    mkdir form-recognizer-app && cd form-recognizer-app
    ```

1. Run the `npm init` command to initialize the application and scaffold your project.

    ```console
    npm init
    ```

1. Specify your project's attributes using the prompts presented in the terminal.

    * The most important attributes are name, version number, and entry point.
    * We recommend keeping `index.js` for the entry point name. The description, test command, GitHub repository, keywords, author, and license information are optional attributes—they can be skipped for this project.
    * Accept the suggestions in parentheses by selecting **Return** or **Enter**.
    * After you've completed the prompts, a `package.json` file will be created in your form-recognizer-app directory.

1. Install the `ai-form-recognizer` client library and `azure/identity` npm packages:

    ```console
    npm i @azure/ai-form-recognizer @azure/identity
    ```

    * Your app's `package.json` file will be updated with the dependencies.

1. Create a file named `index.js` in the application directory.

    > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Type the following command **New-Item index.js**.

## Build your application

To interact with the Form Recognizer service, you'll need to create an instance of the `DocumentAnalysisClient` class. To do so, you'll create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentAnalysisClient` instance with the `AzureKeyCredential` and your Form Recognizer `endpoint`.

Open the `index.js` file in Visual Studio Code or your favorite IDE and select one of the following code samples to copy and paste into your application:

* The [prebuilt-read](#read-model) model is at the core of all Form Recognizer models and can detect lines, words, locations, and languages. Layout, general document, prebuilt, and custom models all use the read model as a foundation for extracting texts from documents.

* The [prebuilt-layout](#layout-model) model extracts text and text locations, tables, selection marks, and structure information from documents and images.

* The [prebuilt-document](#general-document-model) model extracts key-value pairs, tables, and selection marks from documents and can be used as an alternative to training a custom model without labels.

* The [prebuilt-tax.us.w2](#w2-model) model extracts information reported on US Internal Revenue Service (IRS) tax forms.

* The [prebuilt-invoice](#invoice-model) model extracts information reported on US Internal Revenue Service (IRS) tax forms.

* The [prebuilt-receipt](#receipt-model) model extracts key information from printed and handwritten sales receipts.

* The [prebuilt-idDocument](#id-document-model) model extracts key information from US Drivers Licenses, international passport biographical pages, US state IDs, social security cards, and permanent resident (green) cards.

* The [prebuilt-businessCard](#business-card-model) model extracts key information from business card images.

## Read model

## Layout model

## General document model

## W2 model

## Invoice model

## Receipt-model

## ID document model

## Business card model