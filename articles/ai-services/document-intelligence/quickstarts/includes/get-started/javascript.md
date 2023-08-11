---
title: "Quickstart: Document Intelligence (formerly Form Recognizer) JavaScript SDK v2.1"
titleSuffix: Azure AI services
description: Form and document processing, data extraction, and analysis using Document Intelligence JavaScript client library v2.1
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
---

[Reference documentation](/javascript/api/overview/azure/ai-form-recognizer-readme?view=azure-node-latest&preserve-view=true) | [Library source code](https://github.com/Azure/azure-sdk-for-js/blob/master/sdk/formrecognizer/ai-form-recognizer/) | [Package (npm)](https://www.npmjs.com/package/@azure/ai-form-recognizer) | [Samples](https://github.com/Azure/azure-sdk-for-js/tree/master/sdk/formrecognizer/ai-form-recognizer/samples)

In this quickstart, you use the following APIs to extract structured data from forms and documents:

* [Layout](#try-it-layout-model)

* [Invoice](#try-it-prebuilt-model)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* The latest version of [Visual Studio Code](https://code.visualstudio.com/) or your preferred IDE.

* The latest LTS version of [Node.js](https://nodejs.org/)

* An Azure AI services or Document Intelligence resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Document Intelligence resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

    > [!TIP]
    > Create an Azure AI services resource if you plan to access multiple Azure AI services under a single endpoint/key. For Document Intelligence access only, create a Document Intelligence resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Document Intelligence API. You paste your key and endpoint into the code later in the quickstart:

  :::image type="content" source="../../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

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
    npm install @azure/ai-form-recognizer
    ```

    Your app's `package.json` file is updated with the dependencies.

1. Create a file named `index.js`, open it, and import the following libraries:

    ```javascript
    const { FormRecognizerClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
    ```

1. Create variables for your resource's Azure endpoint and key:

    ```javascript
    const key = "PASTE_YOUR_FORM_RECOGNIZER_KEY_HERE";
    const endpoint = "PASTE_YOUR_FORM_RECOGNIZER_ENDPOINT_HERE";
    ```

1. At this point, your JavaScript application should contain the following lines of code:

    ```javascript

    const { FormRecognizerClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");

    const endpoint = "PASTE_YOUR_FORM_RECOGNIZER_ENDPOINT_HERE";
    const key = "PASTE_YOUR_FORM_RECOGNIZER_KEY_HERE";
    ```

### Select a code sample to copy and paste into your application:

* [**Layout**](#try-it-layout-model)

* [**Prebuilt Invoice**](#try-it-prebuilt-model)

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../../ai-services/security-features.md).

## **Try it**: Layout model

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file at a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.
> * We've added the file URI value to the `formUrl` variable near the top of the file.
> * To analyze a given file at a URI, you'll use the `beginRecognizeContent` method.

### Add the following code to your layout application on the line below the `key` variable

```javascript
const formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf";

const formUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf";

async function recognizeContent() {
    const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(key));
    const poller = await client.beginRecognizeContentFromUrl(formUrl);
    const pages = await poller.pollUntilDone();

    if (!pages || pages.length === 0) {
        throw new Error("Expecting non-empty list of pages!");
    }

    for (const page of pages) {
        console.log(
            `Page ${page.pageNumber}: width ${page.width} and height ${page.height} with unit ${page.unit}`
        );
        for (const table of page.tables) {
            for (const cell of table.cells) {
                console.log(`cell [${cell.rowIndex},${cell.columnIndex}] has text ${cell.text}`);
            }
        }
    }
}

recognizeContent().catch((err) => {
    console.error("The sample encountered an error:", err);
});

```

## **Try it**: Prebuilt model

This sample demonstrates how to analyze data from certain types of common documents with pretrained models, using an invoice as an example. *See* our prebuilt concept page for a complete list of [**invoice fields**](../../../concept-invoice.md#field-extraction)

> [!div class="checklist"]
>
> * For this example, we wll analyze an invoice document using a prebuilt model. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.
> * We've added the file URI value to the `invoiceUrl` variable at the top of the file.
> * To analyze a given file at a URI, you'll use the `beginRecognizeInvoices` method.
> * For simplicity, all the fields that the service returns are not shown here. To see the list of all supported fields and corresponding types, see our [Invoice](../../../concept-invoice.md#field-extraction) concept page.

### Choose a prebuilt model

You aren't limited to invoices—there are several prebuilt models to choose from, each of which has its own set of supported fields. The model to use for the analyze operation depends on the type of document to be analyzed. Here are the prebuilt models currently supported by the Document Intelligence service:

* [**Invoice**](../../../concept-invoice.md): extracts text, selection marks, tables, fields, and key information from invoices.
* [**Receipt**](../../../concept-receipt.md): extracts text and key information from receipts.
* [**ID document**](../../../concept-id-document.md): extracts text and key information from driver licenses and international passports.
* [**Business-card**](../../../concept-business-card.md): extracts text and key information from business cards.

### Add the following code to your prebuilt invoice application below the `key` variable

```javascript

const invoiceUrl = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf";

async function recognizeInvoices() {

    const client = new FormRecognizerClient(endpoint, new AzureKeyCredential(key));

    const poller = await client.beginRecognizeInvoicesFromUrl(invoiceUrl);
    const [invoice] = await poller.pollUntilDone();

    if (invoice === undefined) {
        throw new Error("Failed to extract data from at least one invoice.");
    }

    /**
     * This is a helper function for printing a simple field with an elemental type.
     */
    function fieldToString(field) {
        const {
            name,
            valueType,
            value,
            confidence
        } = field;
        return `${name} (${valueType}): '${value}' with confidence ${confidence}'`;
    }

    console.log("Invoice fields:");

    /**
     * Invoices contain a lot of optional fields, but they are all of elemental types
     * such as strings, numbers, and dates, so we will just enumerate them all.
     */
    for (const [name, field] of Object.entries(invoice.fields)) {
        if (field.valueType !== "array" && field.valueType !== "object") {
            console.log(`- ${name} ${fieldToString(field)}`);
        }
    }

    // Invoices also support nested line items, so we can iterate over them.
    let idx = 0;

    console.log("- Items:");

    const items = invoice.fields["Items"]?.value;
    for (const item of items ?? []) {
        const value = item.value;

        // Each item has several subfields that are nested within the item. We'll
        // map over this list of the subfields and filter out any fields that
        // weren't found. Not all fields will be returned every time, only those
        // that the service identified for the particular document in question.

        const subFields = [
                "Description",
                "Quantity",
                "Unit",
                "UnitPrice",
                "ProductCode",
                "Date",
                "Tax",
                "Amount"
            ]
            .map((fieldName) => value[fieldName])
            .filter((field) => field !== undefined);

        console.log(
            [
                `  - Item #${idx}`,
                // Now we will convert those fields into strings to display
                ...subFields.map((field) => `    - ${fieldToString(field)}`)
            ].join("\n")
        );
    }
}

recognizeInvoices().catch((err) => {
    console.error("The sample encountered an error:", err);
});

```
