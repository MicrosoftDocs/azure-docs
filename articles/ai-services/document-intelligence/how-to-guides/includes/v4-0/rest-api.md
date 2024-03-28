---
title: "Use Azure AI Document Intelligence (formerly Form Recognizer) REST API v3.0"
description: Use the Document Intelligence REST API v3.0 to create a forms processing app that extracts key data from documents.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: include
ms.date: 11/21/2023
ms.author: lajanuar
---

> [!NOTE]
>
> This project targets Azure AI Document Intelligence API version 3.1 and uses cURL to execute REST API calls.

[Document Intelligence REST API](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP) | [Azure SDKs](https://azure.github.io/azure-sdk/releases/latest/index.html) | [Supported SDKs](../../../sdk-overview-v3-1.md)

## Prerequisites

- An Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services/).
- The cURL command line tool installed. Windows 10 and Windows 11 ship with a copy of cURL. At a command prompt, type the following cURL command. If the help options display, cURL is installed in your Windows environment.

  ```console
  curl -help
  ```

  If cURL isn't installed, you can get it here:

  - [Windows](https://curl.haxx.se/windows/)
  - [Mac or Linux](https://curl.se/)

- An Azure AI services or Document Intelligence resource. Create a <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer" title="Create a Document Intelligence resource." target="_blank">single-service</a> or <a href="https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne" title="Create a multiple Document Intelligence resource." target="_blank">multi-service</a>. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.
- The key and endpoint from the resource you create to connect your application to the Azure Document Intelligence service.

  1. After your resource deploys, select **Go to resource**.
  1. In the left navigation menu, select **Keys and Endpoint**.
  1. Copy one of the keys and the **Endpoint** for use later in this article.

  :::image type="content" source="../../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=rest&Product=FormRecognizer&Page=how-to&Section=prerequisites) -->

[!INCLUDE [environment-variables](set-environment-variables.md)]

## Analyze documents and get results

A POST request is used to analyze documents with a prebuilt or custom model. A GET request is used to retrieve the result of a document analysis call. The `modelId` is used with POST and `resultId` with GET operations.

Use the following table as a reference. Replace *\<modelId>* and *\<document-url>* with your desired values:

| Model   | modelId   | description | document-url |
| --- | --- |--|--|
| **Read model** | prebuilt-read |Sample brochure|`https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png`|
| **Layout model** | prebuilt-layout |Sample booking confirmation|`https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png` |
| **W-2 form model**  | prebuilt-tax.us.w2 | Sample W-2 form| `https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png`|
| **Invoice model**  | prebuilt-invoice | Sample invoice| `https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf` |
| **Receipt model**  | prebuilt-receipt | Sample receipt| `https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png` |
| **ID document model**  | prebuilt-idDocument | Sample ID document| `https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png` |

## POST request

Open a console window and run the following cURL command. The commands include the endpoint and key environment variables previously created in the set environment variables section. Replace those variables if your variable names differ. Remember to replace the *\<modelId>* and *\<document-url>* parameters.

```console
curl -i -X POST "%FR_ENDPOINT%formrecognizer/documentModels/<modelId>:analyze?api-version=2023-07-31" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: %FR_KEY%" --data-ascii "{'urlSource': '<document-url>'}"
```

To enable add-on capabilities, use the `features` query parameter in the POST request. There are four add-on capabilities available with the `2023-07-31` (GA) release: *ocr.highResolution*, *ocr.formula*, *ocr.font*, and *queryFields.premium*. To learn more about each of the capabilities, see [Custom models](../../../concept-accuracy-confidence.md).

You can only call the *highResolution*, *formula*, and *font* capabilities for the Read and Layout model, and the *queryFields* capability for the General Documents model. The following example shows how to call the *highResolution*, *formula*, and *font* capabilities for the Layout model.

```bash
curl -i -X POST "%FR_ENDPOINT%formrecognizer/documentModels/prebuilt-layout:analyze?features=ocr.highResolution,ocr.formula,ocr.font?api-version=2023-07-31" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: %FR_KEY%" --data-ascii "{'urlSource': '<document-url>'}"
```

### POST response

You receive a `202 (Success)` response that includes an `Operation-location` header. Use the value of this header to retrieve the response results.

:::image type="content" source="../../../media/how-to/rest-get-response.png" alt-text="Screenshot shows a POST response with the operation location highlighted.":::

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the POST request.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=rest&Product=FormRecognizer&Page=how-to&Section=post-request-analyze) -->

### Get analyze result (GET Request)

After you call the [Analyze document](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP) API, call the [`Get analyze` result}(/rest/api/aiservices/document-models/get-analyze-result?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP) API to get the status of the operation and the extracted data.

<!-- markdownlint-disable MD024 -->

The cURL command line tool doesn't format API responses that contain JSON content, which can make the content difficult to read. To format the JSON response, include the pipe character followed by a JSON formatting tool with your GET request.

#### [Windows](#tab/windows)

Use the NodeJS *json tool* as a JSON formatter for cURL. If you don't have [Node.js](https://nodejs.org/) installed, download and install the latest version.

1. Open a console window and install the json tool by using the following command:

   ```console
   npm install -g jsontool
   ```

1. Pretty print the JSON output by including the pipe character `| json` with your GET requests.

   ```console
   curl -i -X GET "<endpoint>formrecognizer/documentModels/prebuilt-read/analyzeResults/0e49604a-2d8e-4b15-b6b8-bb456e5d3e0a?api-version=2023-07-31"-H "Ocp-Apim-Subscription-Key: <subscription key>" | json
   ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the GET request.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=windows&Product=FormRecognizer&Page=how-to&Section=format-json) -->

#### [macOS](#tab/macOS)

The *json_pp* command tool ships with macOS and can be used as a JSON formatter for cURL.

- Pretty print the JSON output by including `| json_pp` with your GET requests.

  ```console
  curl -i -X GET "{endpoint}formrecognizer/documentModels/prebuilt-read/analyzeResults/0e49604a-2d8e-4b15-b6b8-bb456e5d3e0a?api-version=2023-07-31"-H "Ocp-Apim-Subscription-Key: <subscription key>" | json_pp
  ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with formatting.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=macos&Product=FormRecognizer&Page=how-to&Section=format-json) -->

#### [Linux](#tab/linux)

The *json_pp* command line tool is preinstalled in most Linux distributions. If it isn't included, you can use your distribution's package manager to install it.

- Pretty print the JSON output by including `| json_pp` with your `GET` requests.

  ```console
  curl -i -X GET "<endpoint>formrecognizer/documentModels/prebuilt-read/analyzeResults/0e49604a-2d8e-4b15-b6b8-bb456e5d3e0a?api-version=2023-07-31"-H "Ocp-Apim-Subscription-Key: <subscription key>" | json_pp
  ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with formatting.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=linux&Product=FormRecognizer&Page=how-to&Section=format-json) -->

---

## GET request

Before you run the following command, make these changes:

- Replace *\<POST response>* with the `Operation-location` header from the [POST response](#post-response).
- Replace *\<FR_KEY* with the variable for your environment variable if it differs from the name in the code.
- Replace *\<json-tool> with your JSON formatting tool.

```console
curl -i -X GET "<POST response>" -H "Ocp-Apim-Subscription-Key: %FR_KEY%" | `<json-tool>`
```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with formatting.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=rest&Product=FormRecognizer&Page=how-to&Section=get-request-results) -->

### Examine the response

You receive a `200 (Success)` response with JSON output. The first field, `status`, indicates the status of the operation. If the operation isn't complete, the value of `status` is `running` or `notStarted`. Call the API again, either manually or through a script. We recommend an interval of one second or more between calls.

Visit the Azure samples repository on GitHub to view the `GET` response for each of the Document Intelligence models:

| Model | Output URL |
| --- | --- |
| **Read model** | [Read model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/rest/FormRecognizer/how-to-guide/read-model-output.json) |
| **Layout model** | [Layout model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/rest/FormRecognizer/how-to-guide/layout-model-output.json) |
| **W-2 tax model**  | [W-2 tax model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/rest/FormRecognizer/how-to-guide/w2-tax-model-output.json) |
| **Invoice model**  | [Invoice model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/rest/FormRecognizer/how-to-guide/invoice-model-output.json) |
| **Receipt model**  | [Receipt model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/rest/FormRecognizer/how-to-guide/receipt-model-output.json) |
| **ID document model**  | [ID document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/rest/FormRecognizer/how-to-guide/id-document-model-output.json) |
