---
title: "How to use the read model with the Form Recognizer REST API"
description: Use the Form Recognizer prebuilt-read model and REST API to extract printed and handwritten text from documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 04/13/2022
ms.author: lajanuar
recommendations: false
---

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

* [cURL](https://curl.haxx.se/windows/) installed.

* [PowerShell version 7.*+](/powershell/scripting/install/installing-powershell-on-windows?view=powershell-7.2&preserve-view=true), or a similar command-line application. To check your PowerShell version, type `Get-Host | Select-Object Version`.

* A Cognitive Services or Form Recognizer resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource in the Azure portal to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!TIP]
> Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'lll need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart:

  :::image type="content" source="../../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

## Read Model

Form Recognizer v3.0 consolidates the analyze document (POST) and get result (GET) requests into single operations. The `modelId` is used for POST and `resultId` for GET operations.

> [!div class="checklist"]
>
> * For this example, you'll need a **form document file from a URI**. You can use our [sample form document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png) for this quickstart.
> * We've added the file URI value to the POST curl command below.

### POST Request

Before you run the following cURL command, make the following changes:

1. Replace `{endpoint}` with the endpoint value from your Form Recognizer instance in the Azure portal.
1. Replace `{key}` with the key value from your Form Recognizer instance in the Azure portal.

```bash
curl -v -i POST "{endpoint}/formrecognizer/documentModels/prebuilt-read:analyze?api-version=2022-01-30-preview" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: {key}" --data-ascii "{'urlSource': 'https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png'}"
```

#### Operation-Location

You'll receive a `202 (Success)` response that includes an **Operation-Location** header. The value of this header contains a `resultID` that can be queried to get the status of the asynchronous operation:

:::image type="content" source="../../media/quickstarts/operation-location-result-id.png" alt-text="{alt-text}":::

### Get Request

After you've called the [**Analyze document**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument) API, call the [**Get analyze result**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/GetAnalyzeDocumentResult) API to get the status of the operation and the extracted data. Before you run the command, make these changes:

1. Replace `{endpoint}` with the endpoint value from your Form Recognizer instance in the Azure portal.
1. Replace `{key}` with the key value from your Form Recognizer instance in the Azure portal.
1. Replace `{resultID}` with the result ID from the [Operation-Location](#operation-location) header.

```bash
curl -v -X GET "{endpoint}/formrecognizer/documentModels/prebuilt-read/analyzeResults/{resultId}?api-version=2022-01-30-preview" -H "Ocp-Apim-Subscription-Key: {key}"
```

### Read Model Output

You'll receive a `200 (Success)` response with JSON output. The first field, `"status"`, indicates the status of the operation. If the operation isn't complete, the value of `"status"` will be `"running"` or `"notStarted"`, and you should call the API again, either manually or through a script. We recommend an interval of one second or more between calls.

```json
{
    "status": "succeeded",
    "createdDateTime": "2022-04-08T00:36:48Z",
    "lastUpdatedDateTime": "2022-04-08T00:36:50Z",
    "analyzeResult": {
        "apiVersion": "2022-01-30-preview",
        "modelId": "prebuilt-read",
        "stringIndexType": "textElements",
        "content": "While healthcare is still in the early stages of its Al journey, we\nare seeing...",
        "pages": [
            {
                "pageNumber": 1,
                "angle": 0,
                "width": 915,
                "height": 1190,
                "unit": "pixel",
                "words": [
                    {
                        "content": "While",
                        "boundingBox": [
                            260,
                            56,
                            307,
                            56,
                            306,
                            76,
                            260,
                            76
                        ],
                        "confidence": 0.999,
                        "span": {
                            "offset": 0,
                            "length": 5
                        }
                    }
                ]
            }
        ]
    }
}
```

To view the entire output,visit the Azure samples repository on GitHub to view the [read model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/curl/FormRecognizer/v3-rest-sdk-read-output.md).

## Next step
Try the layout model, which can extract selection marks and table structures in addition to what the read model offers.

> [!div class="nextstepaction"]
> [Use the Layout Model](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument)
