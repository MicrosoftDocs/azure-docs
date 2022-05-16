---
title: "Quickstart: Form Recognizer REST API v3.0 | Preview"
titleSuffix: Azure Applied AI Services
description: Form and document processing, data extraction, and analysis using Form Recognizer REST API v3.0 (preview)
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 03/24/2022
ms.author: lajanuar
---

# Get started: Form Recognizer REST API 2022-01-30-preview

<!-- markdownlint-disable MD036 -->

>[!NOTE]
> Form Recognizer v3.0 is currently in public preview. Some features may not be supported or have limited capabilities.
The current API version is ```2022-01-30-preview```.

| [Form Recognizer REST API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument) | [Azure SDKS](https://azure.github.io/azure-sdk/releases/latest/index.html) |

Get started with Azure Form Recognizer using the REST API. Azure Form Recognizer is a cloud-based Azure Applied AI Service that uses machine learning to extract key-value pairs, text, and tables from your documents. You can easily call Form Recognizer models using the REST API or by integrating our client library SDks into your workflows and applications. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

To learn more about Form Recognizer features and development options, visit our [Overview](../overview.md#form-recognizer-features-and-development-options) page.

## Form Recognizer models

 The REST API supports the following models and capabilities:

**Document Analysis**

* 🆕 Read—Analyze and extract printed and handwritten text lines, words, locations, and detected languages.  
* 🆕General document—Analyze and extract text, tables, structure, key-value pairs, and named entities.
* Layout—Analyze and extract tables, lines, words, and selection marks from documents, without the need to train a model.

**Prebuilt Models**

* 🆕 W-2—Analyze and extract fields from W-2 tax documents, using a pre-trained W-2 model.
* Invoices—Analyze and extract common fields from invoices, using a pre-trained invoice model.
* Receipts—Analyze and extract common fields from receipts, using a pre-trained receipt model.
* ID documents—Analyze and extract common fields from ID documents like passports or driver's licenses, using a pre-trained ID documents model.
* Business Cards—Analyze and extract common fields from business cards, using a pre-trained business cards model.

**Custom Models**

* Custom—Analyze and extract form fields and other content from your custom forms, using models you trained with your own form types.
* Composed custom—Compose a collection of custom models and assign them to a single model built from your form types.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

* [cURL](https://curl.haxx.se/windows/) installed.

* [PowerShell version 7.*+](/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.2&preserve-view=true), or a similar command-line application. To check your PowerShell version, type `Get-Host | Select-Object Version`.

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!TIP]
> Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'lll need a single-service resource if you intend to use [Azure Active Directory authentication](../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart:

  :::image type="content" source="../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::
  
## Analyze documents and get results

 Form Recognizer v3.0 consolidates the analyze document (POST) and get result (GET) requests into single operations. The `modelId` is used for POST and `resultId` for GET operations.

### Analyze document (POST Request)

Before you run the cURL command, make the following changes:

1. Replace `{endpoint}` with the endpoint value from your Form Recognizer instance in the Azure portal.

1. Replace `{key}` with the key value from your Form Recognizer instance in the Azure portal.

1. Using the table below as a reference, replace `{modelID}` and `{your-document-url}` with your desired values.

1. You'll need a document file at a URL. For this quickstart, you can use the sample forms provided in the below table for each feature.

#### POST request

```bash
curl -v -i POST "{endpoint}/formrecognizer/documentModels/{modelID}:analyze?api-version=2022-01-30-preview" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: {key}" --data-ascii "{'urlSource': '{your-document-url}'}"
```

#### Reference table

| **Feature**   | **{modelID}**   | **{your-document-url}** |
| --- | --- |--|
| General Document | prebuilt-document | [Sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) |
| Read | prebuilt-read | [Sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png) |
| Layout | prebuilt-layout | [Sample document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png) |
| W-2  | prebuilt-tax.us.w2 | [Sample W-2](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png) |
| Invoices  | prebuilt-invoice | [Sample invoice](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf) |
| Receipts  | prebuilt-receipt | [Sample receipt](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png) |
| ID Documents  | prebuilt-idDocument | [Sample ID document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png) |
| Business Cards  | prebuilt-businessCard | [Sample business card](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/de5e0d8982ab754823c54de47a47e8e499351523/curl/form-recognizer/rest-api/business_card.jpg) |

#### Operation-Location

You'll receive a `202 (Success)` response that includes an **Operation-Location** header. The value of this header contains a `resultID` that can be queried to get the status of the asynchronous operation:

:::image type="content" source="../media/quickstarts/operation-location-result-id.png" alt-text="{alt-text}":::

### Get analyze results (GET Request)

After you've called the [**Analyze document**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument) API, call the [**Get analyze result**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/GetAnalyzeDocumentResult) API to get the status of the operation and the extracted data. Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint value from your Form Recognizer instance in the Azure portal.
1. Replace `{key}` with the key value from your Form Recognizer instance in the Azure portal.
1. Replace `{modelID}` with the same model name you used to analyze your document.
1. Replace `{resultID}` with the result ID from the [Operation-Location](#operation-location) header.
<!-- markdownlint-disable MD024 -->

#### GET request

```bash
curl -v -X GET "{endpoint}/formrecognizer/documentModels/{model name}/analyzeResults/{resultId}?api-version=2022-01-30-preview" -H "Ocp-Apim-Subscription-Key: {key}"
```

#### Examine the response

You'll receive a `200 (Success)` response with JSON output. The first field, `"status"`, indicates the status of the operation. If the operation isn't complete, the value of `"status"` will be `"running"` or `"notStarted"`, and you should call the API again, either manually or through a script. We recommend an interval of one second or more between calls.

#### Sample response for prebuilt-invoice

```json
{
    "status": "succeeded",
    "createdDateTime": "2022-03-25T19:31:37Z",
    "lastUpdatedDateTime": "2022-03-25T19:31:43Z",
    "analyzeResult": {
        "apiVersion": "2022-01-30-preview",
        "modelId": "prebuilt-invoice",
        "stringIndexType": "textElements"...
    ..."pages": [
            {
                "pageNumber": 1,
                "angle": 0,
                "width": 8.5,
                "height": 11,
                "unit": "inch",
                "words": [
                    {
                        "content": "CONTOSO",
                        "boundingBox": [
                            0.5911,
                            0.6857,
                            1.7451,
                            0.6857,
                            1.7451,
                            0.8664,
                            0.5911,
                            0.8664
                        ],
                        "confidence": 1,
                        "span": {
                            "offset": 0,
                            "length": 7
                        }
                    },
}
```

#### Supported document fields

The prebuilt models extract pre-defined sets of document fields. See [Model data extraction](../concept-model-overview.md#model-data-extraction) for extracted field names, types, descriptions, and examples.

## Next steps

In this quickstart, you used the Form Recognizer REST API preview (v3.0) to analyze forms in different ways. Next, further explore the latest reference documentation to learn more about the Form Recognizer API.

> [!div class="nextstepaction"]
> [REST API preview (v3.0) reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument)
