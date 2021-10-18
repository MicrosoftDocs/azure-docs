---
title: "Quickstart: Form Recognizer JavaScript SDK v3.0 | Preview"
titleSuffix: Azure Applied AI Services
description: Form and document processing, data extraction, and analysis using Form Recognizer JavaScript client library SDKs v3.0 (preview)
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 10/16/2021
ms.author: lajanuar
recommendations: false
---

# Quickstart: Form Recognizer JavaScript client library SDKs v3.0 | Preview

>[!NOTE]
> Form Recognizer v3.0 is currently in public preview. Some features may not be supported or have limited capabilities.

[Reference documentation](https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-ai-form-recognizer/4.0.0-beta.1/index.html) | [Library source code](https://github.com/Azure/azure-sdk-for-js/tree/main/sdk/formrecognizer/ai-form-recognizer/src) | [Package (NuGet)](https://www.nuget.org/packages/Azure.AI.FormRecognizer) | [Samples](https://github.com/Azure/azure-sdk-for-js/blob/%40azure/ai-form-recognizer_4.0.0-beta.1/sdk/formrecognizer/ai-form-recognizer/README.md)

Get started with Azure Form Recognizer using the JavaScript programming language. Azure Form Recognizer is a cloud-based Azure Applied AI Service that uses machine learning to extract and analyze form fields, text, and tables from your documents. You can easily call Form Recognizer models by integrating our client library SDks into your workflows and applications. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

To learn more about Form Recognizer features and development options, visit our [Overview](../overview.md#form-recognizer-features-and-development-options) page.

In this quickstart you'll use following features to analyze and extract data and values from forms and documents:

* [🆕 **General document**](#try-it-general-document-model)—Analyze and extract text, tables, structure, key-value pairs, and named entities.

* [**Layout**](#try-it-layout-model)—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes in forms documents, without the need to train a model.

* [**Prebuilt Invoice**](#try-it-prebuilt-invoice-model)Analyze and extract common fields from invoices, using a pre-trained invoice model.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE. 

* The latest LTS version of [Node.js](https://nodejs.org/about/releases/)

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    > Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'lll need a single-service resource if you intend to use [Azure Active Directory authentication](/azure/active-directory/authentication/overview-authentication).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart:

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
    npm install @azure/ai-form-recognizer@4.0.0-beta.1 @azure/identity
    ```

    * Your app's `package.json` file will be updated with the dependencies.

1. Create a file named `index.js`, open it, and add the following libraries:

    ```javascript
   const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");
    ```

1. Create variables for your resource's Azure endpoint and key:

    ```javascript
    const apiKey = "PASTE_YOUR_FORM_RECOGNIZER_SUBSCRIPTION_KEY_HERE";
    const endpoint = "PASTE_YOUR_FORM_RECOGNIZER_ENDPOINT_HERE";
    ```

At this point, your JavaScript application should contain the following lines of code:

```javascript
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

const endpoint = "PASTE_YOUR_FORM_RECOGNIZER_ENDPOINT_HERE";
const apiKey = "PASTE_YOUR_FORM_RECOGNIZER_SUBSCRIPTION_KEY_HERE";
```

### Select a code sample to copy and paste into your application:

* [**General document**](#try-it-general-document-model)

* [**Layout**](#try-it-layout-model)

* [**Prebuilt Invoice**](#try-it-prebuilt-invoice-model)

> [!IMPORTANT]
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use secure methods to store and access your credentials. See our Cognitive Services [security](../../../cognitive-services/cognitive-services-security.md) article for more information.

## **Try it**: General document model

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file at a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * To analyze a given file at a URI, you'll use the `beginExtractGenericDocument` method.
> * We've added the file URI value to the `formUrl` variable near the top of the file.
> * To see the list of all supported fields and corresponding types, see our [General document](../concept-general-document.md#named-entity-recognition-ner-categories) concept page.

### Add the following code to your general document application on the line below the `apiKey` variable

```javascript

const formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf"

async function main() {
    const client = new DocumentAnalysisClient(endpoint, new DefaultAzureCredential(apiKey));

    const poller = await client.beginExtractGenericDocument(formUrl);

    const {
        keyValuePairs,
        entities
    } = await poller.pollUntilDone();

    if (keyValuePairs.length <= 0) {
        console.log("No key-value pairs were extracted from the document.");
    } else {
        console.log("Key-Value Pairs:");
        for (const {
                key,
                value,
                confidence
            } of keyValuePairs) {
            console.log("- Key  :", `"${key.content}"`);
            console.log("  Value:", `"${value?.content ?? "<undefined>"}" (${confidence})`);
        }
    }

    if (entities.length <= 0) {
        console.log("No entities were extracted from the document.");
    } else {
        console.log("Entities:");
        for (const entity of entities) {
            console.log(
                `- "${entity.content}" ${entity.category} - ${entity.subCategory ?? "<none>"} (${
          entity.confidence
        })`
            );
        }
    }
}

main().catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
});
```

## **Try it**: Layout model

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file at a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * We've added the file URI value to the `formUrl` variable near the top of the file.
> * To analyze a given file at a URI, you'll use the `beginExtractLayout` method.

### Add the following code to your layout application on the line below the `apiKey` variable

```javascript

const formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf"

async function main() {
    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

    const poller = await client.beginExtractLayout(formUrl);

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

## **Try it**: Prebuilt invoice model

This sample demonstrates how to analyze data from certain types of common documents with pre-trained models, using an invoice as an example. *See* our prebuilt concept page for a complete list of [**invoice key-value pairs**](../concept-invoice.md#key-value-pair-extraction)

> [!div class="checklist"]
>
> * For this example, you'll need an **invoice document file at a URI**. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.
> * We've added the file URI value to the `invoiceUrl` variable at the top of the file.
> * To analyze a given file at a URI, you'll use the `beginAnalyzeDocuments` method and pass `PrebuiltModels.Invoice` as the model Id. The returned value is a `result` object containing data about the submitted document.
> * For simplicity, all the key-value pairs that the service returns are not shown here. To see the list of all supported fields and corresponding types, see our [Invoice](../concept-invoice.md#key-value-pair-extraction) concept page.

### Choose the invoice prebuilt model ID

You are not limited to invoices—there are several prebuilt models to choose from, each of which has its own set of supported fields. The model to use for the analyze operation depends on the type of document to be analyzed. Here are the model IDs for the prebuilt models currently supported by the Form Recognizer service:

* [**prebuilt-invoice**](../concept-invoice.md): extracts text, selection marks, tables, key-value pairs, and key information from invoices.
* [**prebuilt-receipt**](../concept-receipt.md): extracts text and key information from receipts.
* [**prebuilt-idDocument**](../concept-id-document.md): extracts text and key information from driver licenses and international passports.
* [**prebuilt-businessCard**](../concept-business-card.md): extracts text and key information from business cards.

### Add the following code to your prebuilt invoice application below the `apiKey` variable

```javascript

const {PreBuiltModels} = require("@azure/ai-form-recognizer");

// Use of PrebuiltModels.Receipt above (rather than the raw model ID), adds strong typing of the model's output

const invoiceUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf";

async function main() {

    const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));

    const poller = await client.beginAnalyzeDocuments(PrebuiltModels.Invoice, invoiceUrl);

    const {
        documents: [result]
    } = await poller.pollUntilDone();

    if (result) {
        const invoice = result.fields;

        console.log("Vendor Name:", invoice.vendorName?.value);
        console.log("Customer Name:", invoice.customerName?.value);
        console.log("Invoice Date:", invoice.invoiceDate?.value);
        console.log("Due Date:", invoice.dueDate?.value);

        console.log("Items:");
        for (const {
                properties: item
            } of invoice.items?.values ?? []) {
            console.log("-", item.productCode?.value ?? "<no product code>");
            console.log("  Description:", item.description?.value);
            console.log("  Quantity:", item.quantity?.value);
            console.log("  Date:", item.date?.value);
            console.log("  Unit:", item.unit?.value);
            console.log("  Unit Price:", item.unitPrice?.value);
            console.log("  Tax:", item.tax?.value);
            console.log("  Amount:", item.amount?.value);
        }

        console.log("Subtotal:", invoice.subTotal?.value);
        console.log("Previous Unpaid Balance:", invoice.previousUnpaidBalance?.value);
        console.log("Tax:", invoice.totalTax?.value);
        console.log("Amount Due:", invoice.amountDue?.value);
    } else {
        throw new Error("Expected at least one receipt in the result.");
    }
}

main().catch((error) => {
    console.error("An error occurred:", error);
    process.exit(1);
});

```

## Run your application

1. Navigate to the folder where you have your form recognizer application (form-recognizer-app).

1. Type the following command in your terminal:

```console
node index.js
```

Congratulations! In this quickstart, you used the Form Recognizer JavaScript SDK to analyze various forms in different ways. Next, explore the reference documentation to learn moe about Form Recognizer v3.0 API.

## Next steps

> [!div class="nextstepaction"]
> [REST API v3.0reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)

> [!div class="nextstepaction"]
> [Form Recognizer JavaScript reference library](https://azuresdkdocs.blob.core.windows.net/$web/javascript/azure-ai-form-recognizer/4.0.0-beta.1/index.html)
