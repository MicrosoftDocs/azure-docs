---
title: "Quickstart: Document Intelligence (formerly Form Recognizer) JavaScript SDK (beta) | v3.0"
titleSuffix: Azure AI services
description: Form and document processing, data extraction, and analysis using Document Intelligence JavaScript client library SDKs v3.0 
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
---
<!-- markdownlint-disable MD025 -->

[SDK reference](https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-ai-form-recognizer/4.0.0/index.html) | [API reference](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-form-recognizer) | [Samples](https://github.com/witemple-msft/azure-sdk-for-js/tree/7e3196f7e529212a6bc329f5f06b0831bf4cc174/sdk/formrecognizer/ai-form-recognizer/samples/v4) |[Supported REST API versions](../../sdk-overview.md)

In this quickstart you'll, use the following features to analyze and extract data and values from forms and documents:

* [**General document**](#general-document-model)—Analyze and extract key-value pairs, and selection marks from documents.

* [**Layout**](#layout-model)—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes in documents, without the need to train a model.

* [**Prebuilt Invoice**](#prebuilt-model)—Analyze and extract common fields from specific document types using a pretrained invoice model.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. For more information, *see* [Node.js in Visual Studio Code](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial)

* The latest LTS version of [Node.js](https://nodejs.org/)

* An Azure AI services or Document Intelligence resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Document Intelligence resource, in the Azure portal, to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    > Create an Azure AI services resource if you plan to access multiple Azure AI services under a single endpoint/key. For Document Intelligence access only, create a Document Intelligence resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Document Intelligence API. You paste your key and endpoint into the code later in the quickstart:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=quickstart&Section=prerequisites) -->

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
    npm i @azure/ai-form-recognizer@4.1.0-beta.1 @azure/identity
    ```

    * Your app's `package.json` file is updated with the dependencies.

1. Create a file named `index.js` in the application directory.

    > [!TIP]
    >
    > * You can create a new file using PowerShell.
    > * Open a PowerShell window in your project directory by holding down the Shift key and right-clicking the folder.
    > * Type the following command **New-Item index.js**.

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the setup.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=quickstart&Section=setup) -->

## Build your application

To interact with the Document Intelligence service, you need to create an instance of the `DocumentAnalysisClient` class. To do so, you create an `AzureKeyCredential` with your `key` from the Azure portal and a `DocumentAnalysisClient` instance with the `AzureKeyCredential` and your Document Intelligence `endpoint`.

1. Open the `index.js` file in Visual Studio Code or your favorite IDE and select one of the following code samples to copy and paste into your application:

    * [**General document**](#general-document-model)

    * [**Layout**](#layout-model)

    * [**Prebuilt Invoice**](#prebuilt-model)

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../ai-services/security-features.md).

<!-- markdownlint-disable MD036 -->

## General document model

Extract text, tables, structure, and key-value pairs from documents.

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file from a URL**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * To analyze a given file from a URL, you'll use the `beginAnalyzeDocuments` method and pass in `prebuilt-document` as the model Id.
> * We've added the file URL value to the `formUrl` variable near the top of the file.

**Add the following code sample to the `index.js` file. Make sure you update the key and endpoint variables with values from your Azure portal Document Intelligence instance:**

```javascript

  const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

  // set `<your-key>` and `<your-endpoint>` variables with the values from the Azure portal.
  const key = "<your-key>";
  const endpoint = "<your-endpoint>";

  // sample document
  const formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf"

  async function main() {
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

    const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-document", formUrl);

    const {keyValuePairs} = await poller.pollUntilDone();

    if (!keyValuePairs || keyValuePairs.length <= 0) {
        console.log("No key-value pairs were extracted from the document.");
    } else {
        console.log("Key-Value Pairs:");
        for (const {key, value, confidence} of keyValuePairs) {
            console.log("- Key  :", `"${key.content}"`);
            console.log("  Value:", `"${(value && value.content) || "<undefined>"}" (${confidence})`);
        }
    }

}

main().catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
});

```

**Run your application**

Once you've added a code sample to your application, run your program:

1. Navigate to the folder where you have your Document Intelligence application (form-recognizer-app).

1. Type the following command in your terminal:

    ```console
    node index.js
    ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=quickstart&Section=run-general-document) -->

### General document model output

Here's a snippet of the expected output:

```console
Key-Value Pairs:
- Key  : "For the Quarterly Period Ended"
  Value: "March 31, 2020" (0.35)
- Key  : "From"
  Value: "1934" (0.119)
- Key  : "to"
  Value: "<undefined>" (0.317)
- Key  : "Commission File Number"
  Value: "001-37845" (0.87)
- Key  : "(I.R.S. ID)"
  Value: "91-1144442" (0.87)
- Key  : "Class"
  Value: "Common Stock, $0.00000625 par value per share" (0.748)
- Key  : "Outstanding as of April 24, 2020"
  Value: "7,583,440,247 shares" (0.838)
```

To view the entire output, visit the Azure samples repository on GitHub to view the [general document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/v3-javascript-sdk-general-document-output.md)

## Layout model

Extract text, selection marks, text styles, table structures, and bounding region coordinates from documents.

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file from a URL**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * We've added the file URL value to the `formUrl` variable near the top of the file.
> * To analyze a given file from a URL, you'll use the `beginAnalyzeDocuments` method and pass in `prebuilt-layout` as the model Id.

**Add the following code sample to the `index.js` file. Make sure you update the key and endpoint variables with values from your Azure portal Document Intelligence instance:**

```javascript

 const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

    // set `<your-key>` and `<your-endpoint>` variables with the values from the Azure portal.
    const key = "<your-key>";
    const endpoint = "<your-endpoint>";

    // sample document
  const formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf"

  async function main() {
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

    const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-layout", formUrl);

    const {
        pages,
        tables
    } = await poller.pollUntilDone();

    if (pages.length <= 0) {
        console.log("No pages were extracted from the document.");
    } else {
        console.log("Pages:");
        for (const page of pages) {
            console.log("- Page", page.pageNumber, `(unit: ${page.unit})`);
            console.log(`  ${page.width}x${page.height}, angle: ${page.angle}`);
            console.log(`  ${page.lines.length} lines, ${page.words.length} words`);
        }
    }

    if (tables.length <= 0) {
        console.log("No tables were extracted from the document.");
    } else {
        console.log("Tables:");
        for (const table of tables) {
            console.log(
                `- Extracted table: ${table.columnCount} columns, ${table.rowCount} rows (${table.cells.length} cells)`
            );
        }
    }
}

main().catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
});

```

**Run your application**

Once you've added a code sample to your application, run your program:

1. Navigate to the folder where you have your Document Intelligence application (form-recognizer-app).

1. Type the following command in your terminal:

    ```console
    node index.js
    ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=quickstart&Section=run-layout) -->

### Layout model output

Here's a snippet of the expected output:

```console
Pages:
- Page 1 (unit: inch)
  8.5x11, angle: 0
  69 lines, 425 words
Tables:
- Extracted table: 3 columns, 5 rows (15 cells)
```

To view the entire output, visit the Azure samples repository on GitHub to view the [layout model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/v3-javascript-sdk-layout-output.md)

## Prebuilt model

In this example, we analyze an invoice using the **prebuilt-invoice** model.

> [!TIP]
> You aren't limited to invoices—there are several prebuilt models to choose from, each of which has its own set of supported fields. The model to use for the analyze operation depends on the type of document to be analyzed. See [**model data extraction**](../../concept-model-overview.md#model-data-extraction).

> [!div class="checklist"]
>
> * Analyze an invoice using the prebuilt-invoice model. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.
> * We've added the file URL value to the `invoiceUrl` variable at the top of the file.
> * To analyze a given file at a URI, you'll use the `beginAnalyzeDocuments` method and pass `PrebuiltModels.Invoice` as the model Id. The returned value is a `result` object containing data about the submitted document.
> * For simplicity, all the key-value pairs that the service returns are not shown here. To see the list of all supported fields and corresponding types, see our [Invoice](../../concept-invoice.md#field-extraction) concept page.

```javascript

 const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

  // set `<your-key>` and `<your-endpoint>` variables with the values from the Azure portal.
      const key = "<your-key>";
      const endpoint = "<your-endpoint>";
// sample document
    invoiceUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf"

async function main() {
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

    const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-invoice", invoiceUrl);

    const {
        pages,
        tables
    } = await poller.pollUntilDone();

    if (pages.length <= 0) {
        console.log("No pages were extracted from the document.");
    } else {
        console.log("Pages:");
        for (const page of pages) {
            console.log("- Page", page.pageNumber, `(unit: ${page.unit})`);
            console.log(`  ${page.width}x${page.height}, angle: ${page.angle}`);
            console.log(`  ${page.lines.length} lines, ${page.words.length} words`);
        }
    }

    if (tables.length <= 0) {
        console.log("No tables were extracted from the document.");
    } else {
        console.log("Tables:");
        for (const table of tables) {
            console.log(
                `- Extracted table: ${table.columnCount} columns, ${table.rowCount} rows (${table.cells.length} cells)`
            );
        }
    }
}

main().catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
});
```

**Run your application**

Once you've added a code sample to your application, run your program:

1. Navigate to the folder where you have your Document Intelligence application (form-recognizer-app).

1. Type the following command in your terminal:

    ```console
    node index.js
    ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue when running the application.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=javascript&Product=FormRecognizer&Page=quickstart&Section=run-prebuilt) -->

### Prebuilt model output

Here's a snippet of the expected output:

```console
  Vendor Name: CONTOSO LTD.
  Customer Name: MICROSOFT CORPORATION
  Invoice Date: 2019-11-15T00:00:00.000Z
  Due Date: 2019-12-15T00:00:00.000Z
  Items:
  - <no product code>
    Description: Test for 23 fields
    Quantity: 1
    Date: undefined
    Unit: undefined
    Unit Price: 1
    Tax: undefined
    Amount: 100
```

To view the entire output, visit the Azure samples repository on GitHub to view the [prebuilt invoice model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/javascript/FormRecognizer/v3-javascript-sdk-prebuilt-invoice-output.md)
