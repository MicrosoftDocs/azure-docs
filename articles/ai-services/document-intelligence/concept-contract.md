---
title: Contract data extraction – Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Automate tax document data extraction with Document Intelligence's tax document models.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: 'doc-intel-3.1.0'
---

<!-- markdownlint-disable MD033 -->

# Document Intelligence contract model

[!INCLUDE [applies to v3.1](includes/applies-to-v3-1.md)]

The Document Intelligence contract model uses powerful Optical Character Recognition (OCR) capabilities to analyze and extract key fields and line items from a select group of important contract entities. Contracts can be of various formats and quality including phone-captured images, scanned documents, and digital PDFs. The API analyzes document text; extracts key information such as Parties, Jurisdictions, Contract ID, and Title; and returns a structured JSON data representation. The model currently supports certain English tax document formats.

## Automated contract processing

Automated contract processing is the process of extracting key contract fields from documents. Historically, the contract analysis process has been done manually and, hence, very time consuming. Accurate extraction of key data from contracts is typically the first and one of the most critical steps in the contract automation process.

## Development options

Document Intelligence v3.0 supports the following tools:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Contract model** | &#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br> &#9679; [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</br> &#9679; [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br> &#9679; [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br> &#9679; [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br> &#9679; [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)|**prebuilt-contract**|

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Try contract document data extraction

See how data, including customer information, vendor details, and line items, is extracted from contracts. You need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Form Recognizer instance (Document Intelligence forthcoming)](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

## Document Intelligence Studio

1. On the Document Intelligence Studio home page, select **Tax Documents**

1. You can analyze the sample tax documents or select the **+ Add** button to upload your own sample.

1. Select the **Analyze** button:

    :::image type="content" source="media/studio/invoice-analyze.png" alt-text="Screenshot of the analyze invoice menu.":::

> [!div class="nextstepaction"]
> [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)

## Supported languages and locales

>[!NOTE]
> Document Intelligence auto-detects language and locale data.

| Supported languages | Details |
|:----------------------|:---------|
| English (en) | United States (us)|

## Field extraction

The following are the fields extracted from a contract in the JSON output response. 

|Name| Type | Description | Example output |
|:-----|:----|:----|:---:|
| Title | String | Contract title| Service agreement |
| ContractId | String | Contract title| AB12956 |
| Parties | Array |List of legal parties| |
| ExecutionDate | Date |Date when the agreement was fully signed and agreed upon by all parties|`On this twenty-third day of February two thousand and twenty two` |
| ExpirationDate | Date |Date when the contract ends to be in effect| One year |
| RenewalDate | Date |Date when the contract needs to be renewed| `On this twenty-third day of February two thousand and twenty two` |
| Jurisdictions | Array | List of jurisdictions| |

The contract key-value pairs and line items extracted are in the `documentResults` section of the JSON output.

## Next steps

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

