---
title: Document Intelligence marriage certificate
titleSuffix: Azure AI services
description: Automate marriage certificate data extraction with Document Intelligence's marriage certificate model.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 04/23/2024
ms.author: lajanuar
monikerRange: '>=doc-intel-4.0.0'
---
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD049 -->
<!-- markdownlint-disable MD001 -->

# Document Intelligence marriage certificate model

**This content applies to:** ![checkmark](media/yes-icon.png) **v4.0 (preview)** ![checkmark](media/yes-icon.png)

The Document Intelligence Marriage Certificate model uses powerful Optical Character Recognition (OCR) capabilities to analyze and extract key fields from Marriage Certificates. Marriage certificates  can be of various formats and quality including phone-captured images, scanned documents, and digital PDFs. The API analyzes document text; extracts key information such as Spouse names, Issue date, and marriage place; and returns a structured JSON data representation. The model currently supports English-language document formats.

## Automated marriage certificate processing

Automated marriage certificate processing is the process of extracting key  fields from Marriage certificates. Historically, the marriage certificate analysis process is achieved manually and, hence, very time consuming. Accurate extraction of key data from marriage certificates is typically the first and one of the most critical steps in the marriage certificate automation process.

## Development options

::: moniker range="doc-intel-4.0.0"

Document Intelligence v4.0 (2024-02-29-preview) supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**prebuilt-marriageCertificate.us**|&bullet; [**Document Intelligence Studio**](https://documentintelligence.ai.azure.com/studio/prebuilt?formCategory=marriageCertificate.us&formType=marriageCertificate.us)</br>&bullet;  [**REST API**](/rest/api/aiservices/operation-groups?view=rest-aiservices-2024-02-29-preview&preserve-view=true)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)|**prebuilt-marriageCertificate.us**|
::: moniker-end

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Try marriage certificate document data extraction

To see how data extraction works for the marriage certificate card service, you need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/).

* A [Document Intelligence instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

## Document Intelligence Studio

1. On the Document Intelligence Studio home page, select **Marriage Certificate**.

1. You can analyze the sample Marriage certificates or upload your own files.

1. Select the **Run analysis** button and, if necessary, configure the **Analyze options**:

    :::image type="content" source="media/studio/run-analysis-analyze-options.png" alt-text="Screenshot of Run analysis and Analyze options buttons in the Document Intelligence Studio.":::

> [!div class="nextstepaction"]
> [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)

## Supported languages and locales

*See* our [Language Support—prebuilt models](language-support-prebuilt.md) page for a complete list of supported languages.

## Field extraction

The following are the fields extracted from a marriage certificate  in the JSON output response. 

|Name| Type | Description | Example output |
|:-----|:----|:----|:---:|
| `Spouse1FirstName` | String | Spouse 1's first name| Wesley |
| `Spouse1MiddleName` | String | Spouse 1's middle name| M. |
| `Spouse1LastName` | String | Spouse 1's surname| Perry |
| `Spouse1Age` | Integer | Spouse 1's age| 26 |
| `Spouse1BirthDate` | Date | Spouse 1's birth date| Nov. 16, 1997 |
| `Spouse1Address` | Address |Spouse 1's address| 4292 Don Jackson Lane, Bloomfield Township, Michigan 48302 |
| `Spouse1BirthPlace`| String | Spouse 1's birth place| Michigan |
| `Spouse2FirstName` | String | Spouse 2's first name| Beth |
| `Spouse2MiddleName` | String | Spouse 2's middle name| R. |
| `Spouse2LastName` | String | Spouse 2's surname| Mason |
| `Spouse2Age` | Integer | Spouse 2's age| 23 |
| `Spouse2BirthDate` | Date | Spouse 2's birth date| Jul. 22, 2000 |
| `Spouse2Address` | Address |Spouse 2's address| 2671 Comfort Court, Madison, Wisconsin 53704 |
| `Spouse2BirthPlace`| String | Spouse 2's birth place| Wisconsin |
| `DocumentNumber`| String | Document number | 01976/202 |
| `IssueDate` | Date | Issue date of the certificate | Oct. 10, 2023 |
| `IssuePlace` | String | Issue place of the certificate | 2398 Echo Lane, Hastings, Michigan 49058 |
| `MarriageDate`| Date | Marriage date | Oct. 10, 2023 |
| `MarriagePlace` | String | Marriage place | 105 Coal Street, Galloway, Wisconsin 54432 |

The marriage certificate key-value pairs and line items extracted are in the `documentResults` section of the JSON output.

## Next steps

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio).

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.
