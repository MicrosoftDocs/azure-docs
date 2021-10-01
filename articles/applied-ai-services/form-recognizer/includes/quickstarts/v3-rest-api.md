> [!IMPORTANT]
>
> * This quickstart targets REST API version **v3.0**.
>

| [Form Recognizer REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) | [Azure REST API reference](/rest/api/azure/) |

Azure Cognitive Services Form Recognizer is a cloud service that uses machine learning to extract and analyze form fields, text, and tables in form documents. The REST API supports the following models and capabilities:

### Form Recognizer models

* Layout—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes in forms documents, without the need to train a model.
* Document—Analyze and extract text, tables, structure, key-value pairs and named entities.|
* Custom forms—Analyze and extract form fields and other content from your custom forms, using models you trained with your own form types.
* Invoices—Analyze and extract common fields from invoices, using a pre-trained invoice model.
* Receipts—Analyze and extract common fields from receipts, using a pre-trained receipt model.
* ID documents—Analyze and extract common fields from ID documents like passports or driver's licenses, using a pre-trained ID documents model.
* Business Cards—Analyze and extract common fields from business cards, using a pre-trained business cards model.


In this quickstart you'll use following features to analyze and extract data and values from forms and documents:

* [**Layout**](#analyze-layout) model

* [**General document**](#analyze-document) model

* [**Invoice model**](#analyze-invoice) model

## Prerequisites

* [cURL](https://curl.haxx.se/windows/) installed.

* [PowerShell version 6.0+](/powershell/scripting/install/installing-powershell-core-on-windows), or a similar command-line application.

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).

* Once you have your Azure subscription, [create a Form Recognizer resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal to get your key and endpoint. After it deploys, click **Go to resource**.

  * You will need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart.

  * You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

  * An **image of or URL for a form document**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.

  * An **image of or URL for an invoice document**. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.

## Analyze layout

You can use Form Recognizer to analyze and extract tables, selection marks, text, and structure in documents, without needing to train a model. For more information about layout extraction, see the [Layout conceptual guide](../../concept-layout.md). Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint that you obtained with your Form Recognizer subscription.
1. Replace `{subscription key}` with the subscription key you copied from the previous step.
1. Replace `\"{your-document-url}` with one of the example URLs.

#### Request

```bash
TODO
```

#### Operation-Location

You'll receive a `202 (Success)` response that includes an **Operation-Location** header. The value of this header contains a result ID that you can use to query the status of the asynchronous operation and get the results:

https://<span></span>cognitiveservice/formrecognizer/v2.1/layout/analyzeResults/**{resultId}**. 

In the following example, as part of the URL, the string after `analyzeResults/` is the result ID.

```console
TODO
```

### Get layout results

After you've called the **[Analyze Layout](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeLayoutAsync)** API, you call the **[Get Analyze Layout Result](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/GetAnalyzeLayoutResult)** API to get the status of the operation and the extracted data. Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint that you obtained with your Form Recognizer subscription.
1. Replace `{subscription key}` with the subscription key you copied from the previous step.
1. Replace `{resultId}` with the result ID from the previous step.
<!-- markdownlint-disable MD024 -->

#### Request

```bash
TODO
```

#### Response

You'll receive a `200 (success)` response with JSON content.

* The `"readResults"` node contains every line of text with its respective bounding box placement on the page.
* The `selectionMarks` node shows every selection mark (checkbox, radio mark) and whether its status is "selected" or "unselected".
* The `"pageResults"` section includes the tables extracted. For each table, the text, row, and column index, row and column spanning, bounding box, and more are extracted.

## Analyze document

## Analyze invoice

You can use Form Recognizer to extract field text and semantic values from a given invoice document.  To start analyzing an invoice, use the cURL command below. For more information about invoice analysis, see the [prebuilt conceptual guide](../../concept-v3-prebuilt.md). To start analyzing an invoice, call the **[Analyze Invoice](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/5ed8c9843c2794cbb1a96291)** API using the cURL command below. Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint that you obtained with your Form Recognizer subscription.
1. Replace `{your invoice URL}` with the URL address of an invoice document.
1. Replace `{subscription key}` with your subscription key.

#### Request

```bash
TODO
```

#### Operation-Location

You'll receive a `202 (Success)` response that includes an **Operation-Location** header. The value of this header contains a result ID that you can use to query the status of the asynchronous operation and get the results:

 _https://<span></span>cognitiveservice/formrecognizer/v2.1/prebuilt/receipt/analyzeResults/**{resultId}**_

In the following example, as part of the URL, the string after `analyzeResults/` is the result ID:

```console
TODO
```

### Get invoice results

After you've called the **Analyze Invoice** API, you call the **[Get Analyze Invoice Result](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/5ed8c9acb78c40a2533aee83)** API to get the status of the operation and the extracted data. Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint that you obtained with your Form Recognizer subscription key. You can find it on your Form Recognizer resource **Overview** tab.
1. Replace `{resultId}` with the result ID from the previous step.
1. Replace `{subscription key}` with your subscription key.

#### Request

```bash
TODO
```

### Response

You'll receive a `200 (Success)` response with JSON output.

* The `"readResults"` field contains every line of text that was extracted from the invoice.
* The `"pageResults"` includes the tables and selections marks extracted from the invoice.
* The `"documentResults"` field contains key/value information for the most relevant parts of the invoice.

## Next steps

In this quickstart, you used the Form Recognizer REST API to analyze forms in different ways. Next, explore the reference documentation to learn about Form Recognizer API in more depth.

> [!div class="nextstepaction"]
> [REST API reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm)