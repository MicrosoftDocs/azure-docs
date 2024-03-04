---
title: Document Intelligence US mortgage document
titleSuffix: Azure AI services
description: Use Document Intelligence mortgage model to analyze and extract key fields from mortgage documents.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: conceptual
ms.date: 02/29/2024
ms.author: bemabonsu
monikerRange: '>=doc-intel-4.0.0'
---
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD049 -->
<!-- markdownlint-disable MD001 -->

# Document Intelligence mortgage documents model

**This content applies to:** ![checkmark](media/yes-icon.png) **v4.0 (preview)** ![checkmark](media/yes-icon.png)

The Document Intelligence Mortgage model uses powerful Optical Character Recognition (OCR) capabilities to analyze and extract key fields from mortgage documents. Mortgage documents can be of various formats and quality including. The API analyzes document text from mortgage documents and returns a structured JSON data representation. The model currently supports English-language document formats.

**Supported document types:**

* 1003 End-User License Agreement (EULA)
* Form 1008
* Mortgage closing disclosure

## Automated Mortgage documents processing

Automated mortgage  card processing is the process of extracting key  fields from bank cards. Historically, bank card analysis process is achieved manually and, hence, very time consuming. Accurate extraction of key data from bank cards s is typically the first and one of the most critical steps in the contract automation process.

## Development options

::: moniker range="doc-intel-4.0.0"

Document Intelligence v4.0 (2024-02-29-preview) supports the following tools, applications, and libraries:

| Feature | Resources | Model ID |
|----------|-------------|-----------|
|**Mortgage model**|&bullet; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com)</br>&bullet;  [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-10-31-preview&preserve-view=true&tabs=HTTP)</br>&bullet;  [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)</br>&bullet;  [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-4.0.0&preserve-view=true)|**&bullet; prebuilt-mortgage.us.1003</br>&bullet; prebuilt-mortgage.us.1008</br>&bullet; prebuilt-mortgage.us.closingDisclosure**|
::: moniker-end

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Try Mortgage document data extraction

To see how data extraction works for the mortgage documents service, you need the following resources:

* An Azure subscription—you can [create one for free](https://azure.microsoft.com/free/cognitive-services/).

* A [Document Intelligence instance](https://portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (`F0`) to try the service. After your resource deploys, select **Go to resource** to get your key and endpoint.

 :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot of keys and endpoint location in the Azure portal.":::

## Document Intelligence Studio

1. On the Document Intelligence Studio home page, select **mortgage**.

1. You can analyze the sample mortgage documents or upload your own files.

1. Select the **Run analysis** button and, if necessary, configure the **Analyze options**:

    :::image type="content" source="media/studio/run-analysis-analyze-options.png" alt-text="Screenshot of Run analysis and Analyze options buttons in the Document Intelligence Studio.":::

> [!div class="nextstepaction"]
> [Try Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)

## Supported languages and locales

*See* our [Language Support—prebuilt models](language-support-prebuilt.md) page for a complete list of supported languages.

## Field extraction 1003 End-User License Agreement (EULA)

The following are the fields extracted from a 1003 EULA form in the JSON output response.

|Name| Type | Description | Example output |
|:-----|:----|:----|:---:|
| LenderLoanNumber| String |Lender loan number or universal loan identifier | 10Bx939c5543TqA1144M999143X38 |
| AgencyCaseNumber| String | Agency case number| 115894 |
| Borrower| Object | An object that contains the borrower's identity markers such as name, SSN, birth date. |  |
| Co-Borrower| Object | An object that contains the Co-Borrower's names, and signed date.|  |
| CurrentEmployment| Object | An Object that contains information about the current employment including: Employer name, Employer Phone number, Employer address.|  |
| Loan| Object | An object that contains loan information including: amount, purpose type, refinance type.| |
| Property | object | An object that contains information about the property including: address, number of units, value.|  |

The 1003 EULA key-value pairs and line items extracted are in the `documentResults` section of the JSON output.

## Field extraction Form 1008

The following are the fields extracted from a 1008 form in the JSON output response.

|Name| Type | Description | Example output |
|:-----|:----|:----|:---:|
| Borrower | Object | An object that contains information about the borrower including: name, and number of borrowers.|  |
| Property | Object | An object that contains information about the property including: address, occupancy status, sales price.|  |
| Mortgage | Object | An object that contains information about the mortgage including: Loan type, amortization type, loan purpose type.|  |
| Underwriting | Object | An object that contains information about the underwriting information including: underwriter name, appraiser name, borrower income.|  |
| Seller | Object | An object that contains information about the seller including: Name, address, number.|  |

The form 1008 key-value pairs and line items extracted are in the `documentResults` section of the JSON output.

## Field extraction mortgage closing disclosure

The following are the fields extracted from a mortgage closing disclosure form in the JSON output response.

|Name| Type | Description | Example output |
|:-----|:----|:----|:---:|
| Closing| Object | An object that contains information about the closing information including: Issue date, Closing date, Disbursement date.  |
| Transaction | Object | An object that contains information about the transaction information including: Borrowers name, Borrowers address, Seller name.|  |
| Loan | Object | An object that contains loan information including: term, purpose, product. | |


The mortgage closing disclosure key-value pairs and line items extracted are in the `documentResults` section of the JSON output.

## Next steps

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio).

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.
