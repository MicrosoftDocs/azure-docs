---
title: Credit/Debit Card data extraction – Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Automate tax document data extraction with Document Intelligence's tax document models.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/21/2023
ms.author: lajanuar
monikerRange: '>=doc-intel-3.0.0'
---

<!-- markdownlint-disable MD033 -->

# Document Intelligence Credit/Debit Card model

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [preview-version-notice](includes/preview-notice.md)]

**This content applies to:**![checkmark](media/yes-icon.png) **v4.0 (preview)** | **Previous version:** ![blue-checkmark](media/blue-yes-icon.png) [**v3.1 (GA)**](?view=doc-intel-3.1.0&preserve-view=tru)
:::moniker-end

The Document Intelligence Credit/debit model uses powerful Optical Character Recognition (OCR) capabilities to analyze and extract key fields from credit and debit cards. Credit cards and debit cards can be of various formats and quality including phone-captured images, scanned documents, and digital PDFs. The API analyzes document text; extracts key information such as Card Number, Issuing Bank, and Expiration Date; and returns a structured JSON data representation. The model currently supports English-language document formats.

## Automated Credit/Debit Card processing

Automated Credit/Debit card processing is the process of extracting key  fields from bank cards. Historically, bank card analysis process is achieved manually and, hence, very time consuming. Accurate extraction of key data from bank cards s is typically the first and one of the most critical steps in the contract automation process.

## Development options

::: moniker range="doc-intel-4.0.0"

Document Intelligence v4.0 (2024-02-29-preview) supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Contract model**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-10-31-preview&preserve-view=true&tabs=HTTP)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)|**prebuilt-creditCard**|
::: moniker-end

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Try Credit/Debit card document data extraction

To see how data extraction works for the Credit/Debit card service, you need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/)

* A [Document Intelligence instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

## Document Intelligence Studio

1. On the Document Intelligence Studio home page, select **Credit/Debit Card**

1. You can analyze the sample tax documents or upload your own files.

1. Select the **Run analysis** button and, if necessary, configure the **Analyze options** :

    :::image type="content" source="media/studio/run-analysis-analyze-options.png" alt-text="Screenshot of Run analysis and Analyze options buttons in the Document Intelligence Studio.":::

> [!div class="nextstepaction"]
> [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)

## Supported languages and locales

*See* our [Language Support—prebuilt models](language-support-prebuilt.md) page for a complete list of supported languages.

## Field extraction

The following are the fields extracted from a contract in the JSON output response. 

|Name| Type | Description | Example output |
|:-----|:----|:----|:---:|
| CardNumber | String | A unique identifier for the card| 4275 0000 0000 0000 |
| IssuingBank | String | The name of the bank that issued the card| Woodgrove Bank |
| PaymentNetwork | String |The payment network that processes the card transaction| VISA |
| CardHolderName | String |The name of the person who owns the card| JOHN SMITH |
| CardHolderCompanyName | The name of the company that the card is associated with | CONTOSO SOFTWARE |
| ValidDate | Date | Valid from date | 01/16 |
| ExpirationDate | Date | Expiration date| 01/19 |
| CardVerificationValue | String | Card verification value (CVV) | 764 |
| CustomerServicePhoneNumbers | Array | List of support numbers | +1 (987) 123-456 |

The bank cards key-value pairs and line items extracted are in the `documentResults` section of the JSON output.

## Next steps

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.
