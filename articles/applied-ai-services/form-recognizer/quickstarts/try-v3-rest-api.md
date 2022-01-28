---
title: "Quickstart: Form Recognizer REST API | Preview"
titleSuffix: Azure Applied AI Services
description: Form and document processing, data extraction, and analysis using Form Recognizer REST API v3.0 (preview)
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: quickstart
ms.date: 01/28/2022
ms.author: lajanuar
ms.custom: ignite-fall-2021, mode-api
---

# Get started: Form Recognizer REST API v3.0 | Preview

>[!NOTE]
> Form Recognizer v3.0 is currently in public preview. Some features may not be supported or have limited capabilities.

| [Form Recognizer REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument) | [Azure REST API reference](/rest/api/azure/) |

Get started with Azure Form Recognizer using the C# programming language. Azure Form Recognizer is a cloud-based Azure Applied AI Service that uses machine learning to extract and analyze form fields, text, and tables from your documents. You can easily call Form Recognizer models by integrating our client library SDks into your workflows and applications. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

To learn more about Form Recognizer features and development options, visit our [Overview](../overview.md#form-recognizer-features-and-development-options) page.
## Form Recognizer models

 The REST API supports the following models and capabilities:

* 🆕General document—Analyze and extract text, tables, structure, key-value pairs, and named entities.|
* Layout—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes in forms documents, without the need to train a model.
* Custom—Analyze and extract form fields and other content from your custom forms, using models you trained with your own form types.
* Invoices—Analyze and extract common fields from invoices, using a pre-trained invoice model.
* Receipts—Analyze and extract common fields from receipts, using a pre-trained receipt model.
* ID documents—Analyze and extract common fields from ID documents like passports or driver's licenses, using a pre-trained ID documents model.
* Business Cards—Analyze and extract common fields from business cards, using a pre-trained business cards model.

## Analyze document

Form Recognizer v3.0 consolidates the analyze document and get analyze result (GET) operations for layout, prebuilt models, and custom models into a single pair of operations by assigning `modelIds` to the POST and GET operations:

```http
POST /documentModels/{modelId}:analyze

GET /documentModels/{modelId}/analyzeResults/{resultId}
```

The following table illustrates the updates to the REST API calls.

|Feature| v2.1 | v3.0|
|-----|-----|----|
|General document | n/a |`/documentModels/prebuilt-document:analyze` |
|Layout |`/layout/analyze` | ``/documentModels/prebuilt-layout:analyze``|
|Invoice | `/prebuilt/invoice/analyze` | `/documentModels/prebuilt-invoice:analyze` |
|Receipt | `/prebuilt/receipt/analyze` | `/documentModels/prebuilt-receipt:analyze` |
|ID document| `/prebuilt/idDocument/analyze` | `/documentModels/prebuilt-idDocument:analyze`|
|Business card| `/prebuilt/businessCard/analyze`  | `/documentModels/prebuilt-businessCard:analyze` |
|Custom| `/custom/{modelId}/analyze` |`/documentModels/{modelId}:analyze`|

In this quickstart you'll use following features to analyze and extract data and values from forms and documents:

* [🆕 **General document**](#try-it-general-document-model)—Analyze and extract text, tables, structure, key-value pairs, and named entities.

* [**Layout**](#try-it-layout-model)—Analyze and extract tables, lines, words, and selection marks like radio buttons and check boxes in forms documents, without the need to train a model.

* [**Prebuilt Model**](#try-it-prebuilt-model)—Analyze and extract data from common document types, using a pre-trained model.

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

* [cURL](https://curl.haxx.se/windows/) installed.

* [PowerShell version 6.0+](/powershell/scripting/install/installing-powershell-core-on-windows), or a similar command-line application.

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!TIP]
> Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'lll need a single-service resource if you intend to use [Azure Active Directory authentication](../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart:

  :::image type="content" source="../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

### Select a code sample to copy and paste into your application:

* [**General document**](#try-it-general-document-model)

* [**Layout**](#try-it-layout-model)

* [**Prebuilt Model**](#try-it-prebuilt-model)

> [!IMPORTANT]
>
> Remember to remove the key from your code when you're done, and never post it publicly. For production, use secure methods to store and access your credentials. See the Cognitive Services [security](../../../cognitive-services/cognitive-services-security.md) article for more information.

## **Try it**: General document model

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file at a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart. Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint that you obtained with your Form Recognizer subscription.
1. Replace `{subscription key}` with the subscription key you copied from the previous step.
1. Replace `{your-document-url}` with a sample form document URL.

#### Request

```bash
curl -v -i POST "https://{endpoint}/formrecognizer/documentModels/prebuilt-document:analyze?api-version=2021-09-30-preview" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: {subscription key}" --data-ascii "{'urlSource': '{your-document-url}'}"
```

#### Operation-Location

You'll receive a `202 (Success)` response that includes an **Operation-Location** header. The value of this header contains a result ID that you can use to query the status of the asynchronous operation and get the results:

https://{host}/formrecognizer/documentModels/{modelId}/analyzeResults/**{resultId}**?api-version=2021-09-30-preview

### Get general document results

After you've called the **[Analyze document](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)** API, call the **[Get analyze result](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/GetAnalyzeDocumentResult)** API to get the status of the operation and the extracted data. Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint that you obtained with your Form Recognizer subscription.
1. Replace `{subscription key}` with the subscription key you copied from the previous step.
1. Replace `{resultId}` with the result ID from the previous step.
<!-- markdownlint-disable MD024 -->

#### Request

```bash
curl -v -X GET "https://{endpoint}/formrecognizer/documentModels/prebuilt-document/analyzeResults/{resultId}?api-version=2021-09-30-preview" -H "Ocp-Apim-Subscription-Key: {subscription key}"
```

### Examine the response

You'll receive a `200 (Success)` response with JSON output. The first field, `"status"`, indicates the status of the operation. If the operation is not complete, the value of `"status"` will be `"running"` or `"notStarted"`, and you should call the API again, either manually or through a script. We recommend an interval of one second or more between calls.

The `"analyzeResults"` node contains all of the recognized text. Text is organized by page, lines, tables, key-value pairs, and entities.

#### Sample response

```json
{
    "status": "succeeded",
    "createdDateTime": "2021-09-28T16:52:51Z",
    "lastUpdatedDateTime": "2021-09-28T16:53:08Z",
    "analyzeResult": {
        "apiVersion": "2021-09-30-preview",
        "modelId": "prebuilt-document",
        "stringIndexType": "textElements",
        "content": "content extracted",
        "pages": [
            {
                "pageNumber": 1,
                "angle": 0,
                "width": 8.4722,
                "height": 11,
                "unit": "inch",
                "words": [
                    {
                        "content": "Case",
                        "boundingBox": [
                            1.3578,
                            0.2244,
                            1.7328,
                            0.2244,
                            1.7328,
                            0.3502,
                            1.3578,
                            0.3502
                        ],
                        "confidence": 1,
                        "span": {
                            "offset": 0,
                            "length": 4
                        }
                    }

                ],
                "lines": [
                    {
                        "content": "Case",
                        "boundingBox": [
                            1.3578,
                            0.2244,
                            3.2879,
                            0.2244,
                            3.2879,
                            0.3502,
                            1.3578,
                            0.3502
                        ],
                        "spans": [
                            {
                                "offset": 0,
                                "length": 22
                            }
                        ]
                    }
                ]
            }
        ],
        "tables": [
            {
                "rowCount": 8,
                "columnCount": 3,
                "cells": [
                    {
                        "kind": "columnHeader",
                        "rowIndex": 0,
                        "columnIndex": 0,
                        "rowSpan": 1,
                        "columnSpan": 1,
                        "content": "Applicant's Name:",
                        "boundingRegions": [
                            {
                                "pageNumber": 1,
                                "boundingBox": [
                                    1.9198,
                                    4.277,
                                    3.3621,
                                    4.2715,
                                    3.3621,
                                    4.5034,
                                    1.9198,
                                    4.5089
                                ]
                            }
                        ],
                        "spans": [
                            {
                                "offset": 578,
                                "length": 17
                            }
                        ]
                    }
                ],
                "spans": [
                    {
                        "offset": 578,
                        "length": 300
                    },
                    {
                        "offset": 1358,
                        "length": 10
                    }
                ]
            }
        ],
        "keyValuePairs": [
            {
                "key": {
                    "content": "Case",
                    "boundingRegions": [
                        {
                            "pageNumber": 1,
                            "boundingBox": [
                                1.3578,
                                0.2244,
                                1.7328,
                                0.2244,
                                1.7328,
                                0.3502,
                                1.3578,
                                0.3502
                            ]
                        }
                    ],
                    "spans": [
                        {
                            "offset": 0,
                            "length": 4
                        }
                    ]
                },
                "value": {
                    "content": "A Case",
                    "boundingRegions": [
                        {
                            "pageNumber": 1,
                            "boundingBox": [
                                1.8026,
                                0.2276,
                                3.2879,
                                0.2276,
                                3.2879,
                                0.3502,
                                1.8026,
                                0.3502
                            ]
                        }
                    ],
                    "spans": [
                        {
                            "offset": 5,
                            "length": 17
                        }
                    ]
                },
                "confidence": 0.867
            }
        ],
        "entities": [
            {
                "category": "Person",
                "content": "Jim Smith",
                "boundingRegions": [
                    {
                        "pageNumber": 1,
                        "boundingBox": [
                            3.4672,
                            4.3255,
                            5.7118,
                            4.3255,
                            5.7118,
                            4.4783,
                            3.4672,
                            4.4783
                        ]
                    }
                ],
                "confidence": 0.93,
                "spans": [
                    {
                        "offset": 596,
                        "length": 21
                    }
                ]
            }
        ],
        "styles": [
            {
                "isHandwritten": true,
                "confidence": 0.95,
                "spans": [
                    {
                        "offset": 565,
                        "length": 12
                    },
                    {
                        "offset": 3493,
                        "length": 1
                    }
                ]
            }
        ]
    }
}

```

## **Try it**: Layout model

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file at a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) for this quickstart.

 Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint that you obtained with your Form Recognizer subscription.
1. Replace `{subscription key}` with the subscription key you copied from the previous step.
1. Replace `"{your-document-url}` with one of the example URLs.

#### Request

```bash
curl -v -i POST "https://{endpoint}/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2021-09-30-preview" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: {subscription key}" --data-ascii "{'urlSource': '{your-document-url}'}"

```

#### Operation-Location

You'll receive a `202 (Success)` response that includes an **Operation-Location** header. The value of this header contains a result ID that you can use to query the status of the asynchronous operation and get the results:

`https://{host}/formrecognizer/documentModels/{modelId}/analyzeResults/**{resultId}**?api-version=2021-09-30-preview`

### Get layout results

After you've called the **[Analyze document](https://westus.api.cognitive.microsoft.com/formrecognizer/documentModels/prebuilt-layout:analyze?api-version=2021-09-30-preview&stringIndexType=textElements)** API, call the **[Get analyze result](https://westus.api.cognitive.microsoft.com/formrecognizer/documentModels/prebuilt-layout/analyzeResults/{resultId}?api-version=2021-09-30-preview)** API to get the status of the operation and the extracted data. Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint that you obtained with your Form Recognizer subscription.
1. Replace `{subscription key}` with the subscription key you copied from the previous step.
1. Replace `{resultId}` with the result ID from the previous step.
<!-- markdownlint-disable MD024 -->

#### Request

```bash
curl -v -X GET "https://{endpoint}/formrecognizer/documentModels/prebuilt-layout/analyzeResults/{resultId}?api-version=2021-09-30-preview" -H "Ocp-Apim-Subscription-Key: {subscription key}"
```

### Examine the response

You'll receive a `200 (Success)` response with JSON output. The first field, `"status"`, indicates the status of the operation. If the operation is not complete, the value of `"status"` will be `"running"` or `"notStarted"`, and you should call the API again, either manually or through a script. We recommend an interval of one second or more between calls.

## **Try it**: Prebuilt model

This sample demonstrates how to analyze data from certain common document types with a pre-trained model, using an invoice as an example.

> [!div class="checklist"]
>
> * For this example, we wll analyze an invoice document using a prebuilt model. You can use our [sample invoice document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf) for this quickstart.

##### Choose the invoice prebuilt model ID

You are not limited to invoices—there are several prebuilt models to choose from, each of which has its own set of supported fields. The model to use for the analyze operation depends on the type of document to be analyzed. Here are the model IDs for the prebuilt models currently supported by the Form Recognizer service:

* **prebuilt-invoice**: extracts text, selection marks, tables, key-value pairs, and key information from invoices.
* **prebuilt-businessCard**: extracts text and key information from business cards.
* **prebuilt-idDocument**: extracts text and key information from driver licenses and international passports.
* **prebuilt-receipt**: extracts text and key information from receipts.

Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint that you obtained with your Form Recognizer subscription.
1. Replace `{subscription key}` with the subscription key you copied from the previous step.
1. Replace `\"{your-document-url}` with a sample invoice URL:

    ```http
    https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf
    ```

#### Request

```bash
curl -v -i POST "https://{endpoint}/formrecognizer/documentModels/prebuilt-invoice:analyze?api-version=2021-09-30-preview" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: {subscription key}" --data-ascii "{'urlSource': '{your-document-url}'}"
```

#### Operation-Location

You'll receive a `202 (Success)` response that includes an **Operation-Location** header. The value of this header contains a result ID that you can use to query the status of the asynchronous operation and get the results:

https://{host}/formrecognizer/documentModels/{modelId}/analyzeResults/**{resultId}**?api-version=2021-09-30-preview

### Get invoice results

After you've called the **[Analyze document](https://westus.api.cognitive.microsoft.com/formrecognizer/documentModels/prebuilt-invoice:analyze?api-version=2021-09-30-preview&stringIndexType=textElements)** API, call the **[Get analyze result](https://westus.api.cognitive.microsoft.com/formrecognizer/documentModels/prebuilt-invoice/analyzeResults/{resultId}?api-version=2021-09-30-preview)** API to get the status of the operation and the extracted data. Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint that you obtained with your Form Recognizer subscription.
1. Replace `{subscription key}` with the subscription key you copied from the previous step.
1. Replace `{resultId}` with the result ID from the previous step.
<!-- markdownlint-disable MD024 -->

#### Request

```bash
curl -v -X GET "https://{endpoint}/formrecognizer/documentModels/prebuilt-invoice/analyzeResults/{resultId}?api-version=2021-09-30-preview" -H "Ocp-Apim-Subscription-Key: {subscription key}"
```

### Examine the response

You'll receive a `200 (Success)` response with JSON output. The first field, `"status"`, indicates the status of the operation. If the operation is not complete, the value of `"status"` will be `"running"` or `"notStarted"`, and you should call the API again, either manually or through a script. We recommend an interval of one second or more between calls.

### Improve results

[!INCLUDE [improve results](../includes/improve-results-unlabeled.md)]

## Manage custom models

### Get a list of models

The preview v3.0  [List models](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/GetModels) request returns a paged list of prebuilt models in addition to custom models. Only models with status of succeeded are included. In-progress or failed models can be enumerated via the [List Operations](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/GetOperations) request. Use the nextLink property to access the next page of models, if any. To get more information about each returned model, including the list of supported documents and their fields, pass the modelId to the [Get Model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/GetOperations)request.

```bash
curl -v -X GET "https://{endpoint}/formrecognizer/documentModels?api-version=2021-09-30-preview"
```

### Get a specific model

The preview v3.0 [Get model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/GetModel) retrieves information about a specific model with a status of succeeded. For failed and in-progress models, use the [Get Operation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/GetOperation) to track the status of model creation operations and any resulting errors.

```bash
curl -v -X GET "https://{endpoint}/formrecognizer/documentModels/{modelId}?api-version=2021-09-30-preview" -H "Ocp-Apim-Subscription-Key: {subscription key}"
```

### Delete a Model

The preview v3.0 [Delete model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/DeleteModel) request removes the custom model and the modelId can no longer be accessed by future operations.  New models can be created using the same modelId without conflict.

```bash
curl -v -X DELETE "https://{endpoint}/formrecognizer/documentModels/{modelId}?api-version=2021-09-30-preview" -H "Ocp-Apim-Subscription-Key: {subscription key}"
```

## Next steps

In this quickstart, you used the Form Recognizer REST API preview (v3.0) to analyze forms in different ways. Next, explore the reference documentation to learn about Form Recognizer API in more depth.

> [!div class="nextstepaction"]
> [REST API preview (v3.0) reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)
