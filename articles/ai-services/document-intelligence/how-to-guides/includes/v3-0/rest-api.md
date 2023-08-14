---
title: "Use Azure AI Document Intelligence (formerly Form Recognizer) REST API v3.0"
description: Use the Document Intelligence REST API v3.0 to create a forms processing app that extracts key data from documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 07/18/2023
ms.author: lajanuar
---

> [!IMPORTANT]
>
> * This project targets Azure AI Document Intelligence API version **3.0** using cURL to execute REST API calls.

| [Document Intelligence REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument) | [Azure SDKS](https://azure.github.io/azure-sdk/releases/latest/index.html) | [Supported SDKs](../../../sdk-overview.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

* The cURL command line tool installed.

    > [!NOTE]
    > Windows 10 and Windows 11 ship with a copy of cURL.
    >
    > To check, open the command prompt and type the following cURL command. If the help options display, cURL is installed in your Windows environment.

    ```console
       curl -help
    ```

   If cURL isn't installed, follow these links:
  * [Windows](https://curl.haxx.se/windows/)
  * [Mac or Linux](https://learn2torials.com/thread/how-to-install-curl-on-mac-or-linux-(ubuntu)-or-windows)

* A Document Intelligence (single-service) or Azure AI services (multi-service) resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Document Intelligence resource, in the Azure portal, to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.



* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Document Intelligence API. You paste your key and endpoint into the code later in the quickstart:

  :::image type="content" source="../../../media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the prerequisites.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=rest&Product=FormRecognizer&Page=how-to&Section=prerequisites) -->

[!INCLUDE [environment-variables](set-environment-variables.md)]

## Analyze documents and get results

 A POST request is used to analyze documents with a prebuilt or custom model. A GET request is used to retrieve the result of a document analysis call. The `modelId` is used with POST and `resultId` with GET operations.

### Analyze document (POST Request)

Using the following table as a reference, replace `{modelID}` and `{document-url}` with your desired values:

| **Model**   | **{modelID}**   | desciption|**{document-url}** |
| --- | --- |--|--|
| **Read model** | prebuilt-read |Sample brochure|`https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png`|
| **Layout model** | prebuilt-layout |Sample booking confirmation|`https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png` |
| **General document model** | prebuilt-document | Sample SEC report|`https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf` |
| **W-2 form model**  | prebuilt-tax.us.w2 | Sample W-2 form| `https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png`|
| **Invoice model**  | prebuilt-invoice | Sample invoice| `https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf` |
| **Receipt model**  | prebuilt-receipt | Sample receipt| `https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png` |
| **ID document model**  | prebuilt-idDocument | Sample ID document| `https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png` |
| **Business card model**  | prebuilt-businessCard | Sample business card|`https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/de5e0d8982ab754823c54de47a47e8e499351523/curl/form-recognizer/rest-api/business_card.jpg`|

## POST request

Open a command prompt and run the following cURL command. We've added the endpoint and key environment variables previously created in the set environment variables section. Replace those variables if your variable names differ. Remember to replace the `{modelID}` and `{document-url}` parameters.

```bash
curl -i -X POST "%FR_ENDPOINT%formrecognizer/documentModels/{modelID}:analyze?api-version=2023-07-31" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: %FR_KEY%" --data-ascii "{'urlSource': '{document-url}'}"
```

   **Enable add-on capabilities

   To enable add-on capabilities, use the `features` query parameter in the POST request. There are four add-on capabilities available for the 2023-02-28-preview: *ocr.highResolution*, *ocr.formula*, *ocr.font*, and *queryFields.premium*. To learn more about each of the capabilities, visit the [Add-On Capabilities concept page](../../../concept-accuracy-confidence.md). You can only call the highResolution, formula and font capabilities for the Read and Layout model, and the queryFields capability for the General Documents model. The following example shows how to call the highResolution, formula and font capabilities for the Layout model.

   ```bash
   curl -i -X POST "%FR_ENDPOINT%formrecognizer/documentModels/prebuilt-layout:analyze?features=ocr.highResolution,ocr.formula,ocr.font?api-version=2023-02-28-preview" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: %FR_KEY%" --data-ascii "{'urlSource': '{document-url}'}"
   ```

### POST response

You receive a `202 (Success)` response that includes an **Operation-location** header. You use the value of this header to retrieve the response results.

:::image type="content" source="../../../media/how-to/rest-get-response.png" alt-text="{alt-text}":::

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the POST request.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=rest&Product=FormRecognizer&Page=how-to&Section=post-request-analyze) -->

### Get analyze results (GET Request)

After you've called the [**Analyze document**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/AnalyzeDocument) API, you'll call the [**Get analyze result**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2023-07-31/operations/GetAnalyzeDocumentResult) API to get the status of the operation and the extracted data.

<!-- markdownlint-disable MD024 -->

#### Format the cURL JSON response

 The curl command line tool doesn't format API responses containing JSON document, which can make the content difficult to read. You can format the JSON response by including the pipe character followed by JSON formatting tool with your GET request.

#### [Windows](#tab/windows)

* Use the NodeJS **json tool** as a JSON formatter for curl.

* If you don't have [Node.js](https://nodejs.org/) installed, download and install the latest version.

* Open a new command prompt and install the **json tool** with the following command:

   ```console
  npm install -g jsontool
  ```

* Pretty print the JSON output by including the pipe character `| json` with your GET requests.

  **Example**:

  ```console
   curl -i -X GET "{endpoint}formrecognizer/documentModels/prebuilt-read/analyzeResults/6f000000-a2xx-4dxx-95xx-869xyxyxyxyx?api-version=2023-07-31"-H "Ocp-Apim-Subscription-Key: {subscription key}" | json

  ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with the GET request.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=windows&Product=FormRecognizer&Page=how-to&Section=format-json) -->

#### [macOS](#tab/macOS)

* The **json_pp** command tool ships with macOS and can be used as a JSON formatter for curl.

* Pretty print the JSON output by including `| json_pp` with your GET requests.

  **Example**:

  ```console
  curl -i -X GET "{endpoint}formrecognizer/documentModels/prebuilt-read/analyzeResults/6f000000-a2xx-4dxx-95xx-869xyxyxyxyx?api-version=2023-07-31"-H "Ocp-Apim-Subscription-Key: {subscription key}" | json_pp
  ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with formatting.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=macos&Product=FormRecognizer&Page=how-to&Section=format-json) -->

#### [Linux](#tab/linux)

* The **json_pp** command line tool is preinstalled in most Linux distributions. If it's not included, you can use your distribution's package manager to install it.

* Pretty print the JSON output by including `| json_pp` with your GET requests.

  **Example**:

  ```console
  curl -i -X GET "{endpoint}formrecognizer/documentModels/prebuilt-read/analyzeResults/6f000000-a2xx-4dxx-95xx-869xyxyxyxyx?api-version=2023-07-31"-H "Ocp-Apim-Subscription-Key: {subscription key}" | json_pp
  ```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with formatting.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=linux&Product=FormRecognizer&Page=how-to&Section=format-json) -->

---

## GET request

Before you run the following command, make these changes:

1. Replace `{POST response}` with the Operation-location header from the [POST response](#post-response).

1. Replace `FR_KEY` with the variable name for your environment variable if it differs.

* Replace `{POST response}` with the Operation-location header from the [POST response](#post-response).

* Replace `FR_KEY` with the variable for your environment variable if differs from the name in the code.

* Replace `{json-tool}` with your JSON formatting tool.

```bash
curl -i -X GET "{POST response}" -H "Ocp-Apim-Subscription-Key: %FR_KEY%" | `{json-tool}`
```

<!-- > [!div class="nextstepaction"]
> [I &#8203;ran into an issue with formatting.](https://microsoft.qualtrics.com/jfe/form/SV_0Cl5zkG3CnDjq6O?PLanguage=rest&Product=FormRecognizer&Page=how-to&Section=get-request-results) -->

### Examine the response

You receive a `200 (Success)` response with JSON output. The first field, `"status"`, indicates the status of the operation. If the operation isn't complete, the value of `"status"` is `"running"` or `"notStarted"`, and you should call the API again, either manually or through a script. We recommend an interval of one second or more between calls.

Visit the Azure samples repository on GitHub to view the GET response for each of the Document Intelligence models:

| **Model**   | **Output URL**|
| --- | --- |
| **Read model** | [Read model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/rest/FormRecognizer/how-to-guide/read-model-output.json) |
| **Layout model** | [Layout model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/rest/FormRecognizer/how-to-guide/layout-model-output.json) |
| **General document model** | [General document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/rest/FormRecognizer/how-to-guide/general-document-model-output.json) |
| **W-2 tax model**  | [W-2 tax model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/rest/FormRecognizer/how-to-guide/w2-tax-model-output.json) |
| **Invoice model**  | [Invoice model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/rest/FormRecognizer/how-to-guide/invoice-model-output.json) |
| **Receipt model**  | [Receipt model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/rest/FormRecognizer/how-to-guide/receipt-model-output.json) |
| **ID document model**  | [ID document model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/rest/FormRecognizer/how-to-guide/id-document-model-output.json) |
| **Business card model**  | [Business card model output](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/rest/FormRecognizer/how-to-guide/business-card-model-output.json)|
