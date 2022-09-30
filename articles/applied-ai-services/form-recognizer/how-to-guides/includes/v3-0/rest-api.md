---
title: "Use Azure Form Recognizer REST API v3.0"
description: Use the Form Recognizer REST API v3.0 to create a forms processing app that extracts key data from documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: include
ms.date: 09/16/2022
ms.author: lajanuar
---

> [!IMPORTANT]
>
> * This project targets Azure Form Recognizer API version **3.0** using cURL to execute REST API calls.

| [Form Recognizer REST API](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) | [Azure SDKS](https://azure.github.io/azure-sdk/releases/latest/index.html) | [Supported SDKs](../../../sdk-overview.md)

## Prerequisites

* Azure subscription - [Create one for free](https://azure.microsoft.com/free/cognitive-services)

* curl command line tool installed.

    > [!NOTE]
    > Windows 10 and Windows 11 ship with a copy of cURL.
    >
    > To check, open the command prompt and type the command below. If the help options display, cURL is installed in your Windows environment.

    ```console
       curl -help
    ```

   If cURL is not installed, follow the links below:
  * [Windows](https://curl.haxx.se/windows/)
  * [Mac or Linux](https://learn2torials.com/thread/how-to-install-curl-on-mac-or-linux-(ubuntu)-or-windows)

* A Form Recognizer (single-service) or Cognitive Services (multi-service) resource. Once you have your Azure subscription, create a [single-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) or [multi-service](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) Form Recognizer resource, in the Azure portal, to get your key and endpoint. You can use the free pricing tier (`F0`) to try the service, and upgrade later to a paid tier for production.

> [!TIP]
> Create a Cognitive Services resource if you plan to access multiple cognitive services under a single endpoint/key. For Form Recognizer access only, create a Form Recognizer resource. Please note that you'll  need a single-service resource if you intend to use [Azure Active Directory authentication](../../../../../active-directory/authentication/overview-authentication.md).

* After your resource deploys, select **Go to resource**. You need the key and endpoint from the resource you create to connect your application to the Form Recognizer API. You'll paste your key and endpoint into the code below later in the quickstart:

  :::image type="content" source="../../../media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint location in the Azure portal.":::

## Set your environment variables

[!INCLUDE [environment-variables](set-environment-variables.md)]

## Analyze documents and get results

 A POST request is used to analyze documents with a prebuilt or custom model. A GET request is used to retrieve the result of a document analysis call. The `modelId` is used with POST and `resultId` with GET operations.

### Analyze document (POST Request)

Using the table below as a reference, replace `{modelID}` and `{document-url}` with your desired values:

| **Feature**   | **{modelID}**   | **{document-url}** |
| --- | --- |--|
| **Read model** | prebuilt-read | [Sample brochure](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/read.png) |
| **Layout model** | prebuilt-layout | [Sample booking confirmation](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/layout.png) |
| **General document model** | prebuilt-document | [Sample SEC report](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-layout.pdf) |
| **W-2 form model**  | prebuilt-tax.us.w2 | [Sample W-2 form](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/w2.png) |
| **Invoice model**  | prebuilt-invoice | [Sample invoice](https://github.com/Azure-Samples/cognitive-services-REST-api-samples/raw/master/curl/form-recognizer/rest-api/invoice.pdf) |
| **Receipt model**  | prebuilt-receipt | [Sample receipt](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/receipt.png) |
| **ID document model**  | prebuilt-idDocument | [Sample ID document](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/rest-api/identity_documents.png) |
| **Business card model**  | prebuilt-businessCard | [Sample business card](https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/de5e0d8982ab754823c54de47a47e8e499351523/curl/form-recognizer/rest-api/business_card.jpg) |

### POST request

At a command prompt, run the following cURL command. We have added the endpoint and key environment variables created in the set environment variables section above. Replace those variables if your's differs from the code below. Remember to replace the `{modelID}` and `{document-url}` parameters.

```bash
curl -i -X POST "%FR_ENDPOINT%formrecognizer/documentModels/{modelID}:analyze?api-version=2022-08-31" -H "Content-Type: application/json" -H "Ocp-Apim-Subscription-Key: %FR_KEY%" --data-ascii "{'urlSource': '{document-url}'}"
```

#### Format the cURL JSON response

 The curl command line tool doesn't format API responses containing JSON document, which can make the content difficult to read. You can format the JSON response by including the pipe character followed by an output processing tool.

#### [Windows](#tab/windows)

### Use NodeJS

* You can use the NodeJS **json tool** as a JSON formatter for curl.

* If you don't have [Node.js](https://nodejs.org/about/releases/) installed, download and install the latest version.

* Open a new command prompt and install the **json tool** with the following command :

   ```console
  npm install -g jsontool
  ```

* Now, you can prettify print JSON output by including `| json ` with your GET requests.

  Example:

  ```console
   curl -i -X GET "{endpoint}formrecognizer/documentModels/prebuilt-read/analyzeResults/6f000000-a2xx-4dxx-95xx-869xyxyxyxyx?api-version=2022-08-31"-H "Ocp-Apim-Subscription-Key: {subscription key}" | json
  ```

#### [macOS](#tab/macOS)

* The **json_pp** command tool ships with macOS and can be used as a JSON formatter for curl.

* You can prettify print the JSON output by including `| json_pp` with your GET requests.

   Example:

 ```console
   curl -i -X GET "{endpoint}formrecognizer/documentModels/prebuilt-read/analyzeResults/6f000000-a2xx-4dxx-95xx-869xyxyxyxyx?api-version=2022-08-31"-H "Ocp-Apim-Subscription-Key: {subscription key}" | json_pp
  ```

#### [Linux](#tab/linux)

* The **json_pp** command line tool is pre-installed in most Linux distributions. If it's not included, you can use your distribution's package manager to install it.

* You can prettify print the JSON output by including `| json_pp` with your GET requests.

Example:

 ```console
   curl -i -X GET "{endpoint}formrecognizer/documentModels/prebuilt-read/analyzeResults/6f000000-a2xx-4dxx-95xx-869xyxyxyxyx?api-version=2022-08-31"-H "Ocp-Apim-Subscription-Key: {subscription key}" | json_pp
  ```

---



#### POST response

You'll receive a `202 (Success)` response that includes an **Operation-location** header. You will use the value of this header to retrieve the response results.

:::image type="content" source="../../../media/how-to/rest-get-response.png" alt-text="{alt-text}":::

### Get analyze results (GET Request)

After you've called the [**Analyze document**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument) API, call the [**Get analyze result**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/GetAnalyzeDocumentResult) API to get the status of the operation and the extracted data. Before you run the command, make these changes:

1. Replace `{POST response}` Operation-location header from the [POST response](#post-response).

1. Replace `{key}` with the key value from your Form Recognizer instance in the Azure portal.

<!-- markdownlint-disable MD024 -->

#### GET request

```bash
curl -v -X GET "{POST response}" -H "Ocp-Apim-Subscription-Key: {key}" | json
```

#### Examine the response

You'll receive a `200 (Success)` response with JSON output. The first field, `"status"`, indicates the status of the operation. If the operation isn't complete, the value of `"status"` will be `"running"` or `"notStarted"`, and you should call the API again, either manually or through a script. We recommend an interval of one second or more between calls.

* The [prebuilt-read](#read-model) model is at the core of all Form Recognizer models and can detect lines, words, locations, and languages. Form Recognizer layout, general document, prebuilt, and custom models all use the read model as a foundation for extracting texts from documents.

* The [prebuilt-layout](#layout-model) model extracts text and text locations, tables, selection marks, and structure information from documents and images.

* The [prebuilt-document](#general-document-model) model extracts key-value pairs, tables, and selection marks from documents and can be used as an alternative to training a custom model without labels.


* The [prebuilt-tax.us.w2](#w2-model) model extracts information reported on US Internal Revenue Service (IRS) tax forms.

* The [prebuilt-invoice](#invoice-model) model extracts information reported on US Internal Revenue Service (IRS) tax forms.

* The [prebuilt-receipt](#receipt-model) model extracts key information from printed and handwritten sales receipts.

* The [prebuilt-idDocument](#id-document-model) model extracts key information from US Drivers Licenses, international passport biographical pages, US state IDs, social security cards, and permanent resident (green) cards.

* The [prebuilt-businessCard](#business-card-model) model extracts key information from business card images.

## Read model

## Layout model

## General document model

## W2 model

## Invoice model

## Receipt-model

## ID document model

## Business card model