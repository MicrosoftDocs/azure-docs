---
title: "Get started: Azure AI Document Intelligence (formerly Form Recognizer) REST API v2.1"
description: Use the Document Intelligence REST API v2.1 to create a forms processing app that extracts key/value pairs and table data from your custom documents.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: include
ms.date: 11/15/2023
ms.author: lajanuar
---
<!-- markdownlint-disable MD001 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD034 -->

| [Document Intelligence REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) | [Azure REST API reference](/rest/api/azure/) |

In this quickstart, you use the following APIs to extract structured data from forms and documents:

* [Layout](#try-it-layout-model)

* [Invoice](#try-it-prebuilt-model)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

* [cURL](https://curl.haxx.se/windows/) installed.

* [PowerShell version 6.0+](/powershell/scripting/install/installing-powershell-core-on-windows), or a similar command-line application.

* An Azure AI services or Document Intelligence resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Document Intelligence resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

  > [!TIP]
  > Create an Azure AI services resource if you plan to access multiple Azure AI services under a single endpoint/key. For Document Intelligence access only, create a Document Intelligence resource. Please note that you'll  need a single-service resource if you intend to use [Microsoft Entra authentication](../../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Document Intelligence API. You paste your key and endpoint into the code later in the quickstart:

  :::image type="content" source="../../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

### Select a code sample to copy and paste into your application:

* [**Layout**](#try-it-layout-model)

* [**Prebuilt Invoice**](#try-it-prebuilt-model)

> [!IMPORTANT]
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use a secure way of storing and accessing your credentials like [Azure Key Vault](../../../../../key-vault/general/overview.md). For more information, *see* Azure AI services [security](../../../../../ai-services/security-features.md).

## **Try it**: Layout model

> [!div class="checklist"]
>
> * For this example, you'll need a **document file at a URI**. You can use our [sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.

1. Replace `{endpoint}` with the endpoint that you obtained with your Document Intelligence subscription.
1. Replace `{key}` with the key you copied from the previous step.
1. Replace `\"{your-document-url}` with a sample document URL:

```http
https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf
```

#### Request

```bash
curl -v -i POST "https://{endpoint}/formrecognizer/v2.1/layout/analyze" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: {key}" --data-ascii "{​​​​​​​'urlSource': '{your-document-url}'}​​​​​​​​"
```

#### Operation-Location

You receive a `202 (Success)` response that includes an **Operation-Location** header. The value of this header contains a result ID that you can use to query the status of the asynchronous operation and get the results:

https://<span></span>cognitiveservice/formrecognizer/v2.1/layout/analyzeResults/**{resultId}**.

In the following example, as part of the URL, the string after `analyzeResults/` is the result ID.

```console
https://cognitiveservice/formrecognizer/v2/layout/analyzeResults/54f0b076-4e38-43e5-81bd-b85b8835fdfb
```

### Get layout results

After you've called the **[Analyze Layout](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeLayoutAsync)** API, you call the **[Get Analyze Layout Result](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/GetAnalyzeLayoutResult)** API to get the status of the operation and the extracted data. Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint that you obtained with your Document Intelligence subscription.
1. Replace `{key}` with the key you copied from the previous step.
1. Replace `{resultId}` with the result ID from the previous step.
<!-- markdownlint-disable MD024 -->

#### Request

```bash
curl -v -X GET "https://{endpoint}/formrecognizer/v2.1/layout/analyzeResults/{resultId}" -H "Ocp-Apim-Subscription-Key: {key}"
```

### Examine the results

You receive a `200 (success)` response with JSON content.

See the following invoice image and its corresponding JSON output.

* The `"readResults"` node contains every line of text with its respective bounding box placement on the page.
* The `selectionMarks` node shows every selection mark (checkbox, radio mark) and whether its status is `selected` or `unselected`.
* The `"pageResults"` section includes the tables extracted. For each table, the text, row, and column index, row and column spanning, bounding box, and more are extracted.

:::image type="content" source="../../../media/contoso-invoice.png" alt-text="Contoso project statement document with a table.":::

#### Response body

You can view the [full sample output on GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/curl/form-recognizer/sample-layout-output.json).

## **Try it**: Prebuilt model

> [!div class="checklist"]
>
> * For this example, we wll analyze an invoice document using a prebuilt model. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.

### Choose a prebuilt model

You aren't limited to invoices—there are several prebuilt models to choose from, each of which has its own set of supported fields. The model to use for the analyze operation depends on the type of document to be analyzed. Here are the prebuilt models currently supported by the Document Intelligence service:

* [**Invoice**](../../../concept-invoice.md): extracts text, selection marks, tables, fields, and key information from invoices.
* [**Receipt**](../../../concept-receipt.md): extracts text and key information from receipts.
* [**ID document**](../../../concept-id-document.md): extracts text and key information from driver licenses and international passports.
* [**Business-card**](../../../concept-business-card.md): extracts text and key information from business cards.

Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint that you obtained with your Document Intelligence subscription.
1. Replace `{key}` with the key you copied from the previous step.
1. Replace `\"{your-document-url}` with a sample invoice URL:

    ```http
    https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf
    ```

#### Request

```bash
curl -v -i POST https://{endpoint}/formrecognizer/v2.1/prebuilt/invoice/analyze" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key:  {key}" --data-ascii "{​​​​​​​'urlSource': '{your invoice URL}'}​​​​​​​​"
```

#### Operation-Location

You receive a `202 (Success)` response that includes an **Operation-Location** header. The value of this header contains a result ID that you can use to query the status of the asynchronous operation and get the results:

 _https://<span></span>cognitiveservice/formrecognizer/v2.1/prebuilt/receipt/analyzeResults/**{resultId}**_

In the following example, as part of the URL, the string after `analyzeResults/` is the result ID:

```console
https://cognitiveservice/formrecognizer/v2.1/prebuilt/invoice/analyzeResults/54f0b076-4e38-43e5-81bd-b85b8835fdfb
```

### Get invoice results

After you've called the **Analyze Invoice** API, you call the **[Get Analyze Invoice Result](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/5ed8c9acb78c40a2533aee83)** API to get the status of the operation and the extracted data. Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint that you obtained with your Document Intelligence key. You can find it on your Document Intelligence resource **Overview** tab.
1. Replace `{resultId}` with the result ID from the previous step.
1. Replace `{key}` with your key.

#### Request

```bash
curl -v -X GET "https://{endpoint}/formrecognizer/v2.1/prebuilt/invoice/analyzeResults/{resultId}" -H "Ocp-Apim-Subscription-Key: {key}"
```

### Examine the response

You receive a `200 (Success)` response with JSON output.

* The `"readResults"` field contains every line of text that was extracted from the invoice.
* The `"pageResults"` includes the tables and selections marks extracted from the invoice.
* The `"documentResults"` field contains key/value information for the most relevant parts of the invoice.

See the [Sample invoice](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/tree/master/curl/form-recognizer/sample-invoice.pdf) document.

#### Response body

See the [full sample output on GitHub](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/curl/form-recognizer/sample-invoice-output.json).
