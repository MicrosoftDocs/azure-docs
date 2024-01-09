---
title: What is Azure AI Document Intelligence (formerly Form Recognizer)?
titleSuffix: Azure AI services
description: Azure AI Document Intelligence is a machine-learning based OCR and intelligent document processing service to automate extraction of key data from forms and documents.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: overview
ms.date: 11/22/2023
ms.author: lajanuar
monikerRange: '<=doc-intel-4.0.0'
---


<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD001 -->

# What is Azure AI Document Intelligence?

::: moniker range="doc-intel-4.0.0"
[!INCLUDE [preview-version-notice](includes/preview-notice.md)]

[!INCLUDE [applies to v4.0](includes/applies-to-v40.md)]
::: moniker-end

::: moniker range="doc-intel-3.1.0"
[!INCLUDE [applies to v3.1](includes/applies-to-v31.md)]
::: moniker-end

::: moniker range="doc-intel-3.0.0"
[!INCLUDE [applies to v3.0](includes/applies-to-v30.md)]
::: moniker-end

::: moniker range="doc-intel-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v21.md)]
::: moniker-end

> [!NOTE]
> Form Recognizer is now **Azure AI Document Intelligence**!
>
> * As of July 2023, Azure AI services encompass all of what were previously known as Cognitive Services and Azure Applied AI Services.
> * There are no changes to pricing.
> * The names *Cognitive Services* and *Azure Applied AI* continue to be used in Azure billing, cost analysis, price list, and price APIs.
> * There are no breaking changes to application programming interfaces (APIs) or SDKs.
> * Some platforms are still awaiting the renaming update. All mention of Form Recognizer or Document Intelligence in our documentation refers to the same Azure service.

Azure AI Document Intelligence is a cloud-based [Azure AI service](../../ai-services/index.yml) that enables you to build intelligent document processing solutions. Massive amounts of data, spanning a wide variety of data types, are stored in forms and documents. Document Intelligence enables you to effectively manage the velocity at which data is collected and processed and is key to improved operations, informed data-driven decisions, and enlightened innovation. </br></br>

| ✔️ [**Document analysis models**](#document-analysis-models) | ✔️ [**Prebuilt models**](#prebuilt-models) | ✔️ [**Custom models**](#custom-model-overview) |

## Document analysis models

Document analysis models enable text extraction from forms and documents and return structured business-ready content ready for your organization's action, use, or progress.
:::moniker range="doc-intel-4.0.0"
:::row:::
   :::column:::
      :::image type="icon" source="media/overview/icon-read.png" link="#read":::</br>
   [**Read**](#read) | Extract printed </br>and handwritten text.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-layout.png" link="#layout":::</br>
    [**Layout**](#layout) | Extract text </br>and document structure.
   :::column-end:::
  :::row-end:::
:::moniker-end

:::moniker range="<=doc-intel-3.1.0"
:::row:::
   :::column:::
      :::image type="icon" source="media/overview/icon-read.png" link="#read":::</br>
   [**Read**](#read) | Extract printed </br>and handwritten text.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-layout.png" link="#layout":::</br>
    [**Layout**](#layout) | Extract text </br>and document structure.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-general-document.png" link="#general-document":::</br>
    [**General document**](#general-document) | Extract text, </br>structure, and key-value pairs.
   :::column-end:::
:::row-end:::
:::moniker-end

## Prebuilt models

Prebuilt models enable you to add intelligent document processing to your apps and flows without having to train and build your own models.

:::moniker range="doc-intel-4.0.0"
:::row:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-invoice.png" link="#invoice":::</br>
    [**Invoice**](#invoice) | Extract customer </br>and vendor details.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-receipt.png" link="#receipt":::</br>
    [**Receipt**](#receipt) | Extract sales </br>transaction details.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-id-document.png" link="#identity-id":::</br>
    [**Identity**](#identity-id) | Extract identification </br>and verification details.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-insurance-card.png" link="#health-insurance-card":::</br>
    [**Health Insurance card**](#health-insurance-card) | Extract health </br>insurance details.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-contract.png" link="#contract-model":::</br>
    [**Contract**](#contract-model) | Extract agreement</br> and party details.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-w2.png" link="#us-tax-w-2-model":::</br>
    [**US Tax W-2 form**](#us-tax-w-2-model) | Extract taxable </br>compensation details.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-1098.png" link="#us-tax-1098-form":::</br>
    [**US Tax 1098 form**](#us-tax-1098-form) | Extract mortgage interest details.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-1098e.png" link="#us-tax-1098-e-form":::</br>
    [**US Tax 1098-E form**](#us-tax-1098-e-form) | Extract student loan interest details.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-1098t.png" link="#us-tax-1098-t-form":::</br>
    [**US Tax 1098-T form**](#us-tax-1098-t-form) | Extract qualified tuition details.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-1098t.png" link="#us-tax-1098-t-form":::</br>
    [**US Tax 1099 form**](concept-tax-document.md#field-extraction-1099-nec) | Extract information from variations of the 1099 form.
   :::column-end:::
:::row-end:::
:::moniker-end

:::moniker range="<=doc-intel-3.1.0"
:::row:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-invoice.png" link="#invoice":::</br>
    [**Invoice**](#invoice) | Extract customer </br>and vendor details.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-receipt.png" link="#receipt":::</br>
    [**Receipt**](#receipt) | Extract sales </br>transaction details.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-id-document.png" link="#identity-id":::</br>
    [**Identity**](#identity-id) | Extract identification </br>and verification details.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-insurance-card.png" link="#health-insurance-card":::</br>
    [**Health Insurance card**](#health-insurance-card) | Extract health insurance details.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-business-card.png" link="#business-card":::</br>
    [**Business card**](#business-card) | Extract business contact details.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-contract.png" link="#contract-model":::</br>
    [**Contract**](#contract-model) | Extract agreement</br> and party details.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-w2.png" link="#us-tax-w-2-model":::</br>
    [**US Tax W-2 form**](#us-tax-w-2-model) | Extract taxable </br>compensation details.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-1098.png" link="#us-tax-1098-form":::</br>
    [**US Tax 1098 form**](#us-tax-1098-form) | Extract mortgage interest details.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-1098e.png" link="#us-tax-1098-e-form":::</br>
    [**US Tax 1098-E form**](#us-tax-1098-e-form) | Extract student loan interest details.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-1098t.png" link="#us-tax-1098-t-form":::</br>
    [**US Tax 1098-T form**](#us-tax-1098-t-form) | Extract qualified tuition details.
   :::column-end:::
:::row-end:::
:::moniker-end

## Custom models

* Custom models are trained using your labeled datasets to extract distinct data from forms and documents, specific to your use cases.
* Standalone custom models can be combined to create composed models.

:::row:::
    :::column:::
        * **Extraction models**</br>
        ✔️ Custom extraction models are trained to extract labeled fields from documents.
    :::column-end:::
:::row-end:::

:::row:::
   :::column:::
      :::image type="icon" source="media/overview/icon-custom-template.png" link="#custom-template":::</br>
    [**Custom template**](#custom-template) | Extract data from static layouts.
   :::column-end:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-custom-neural.png" link="#custom-neural":::</br>
    [**Custom neural**](#custom-neural) | Extract data from mixed-type documents.
   :::column-end:::
      :::column span="":::
      :::image type="icon" source="media/overview/icon-custom-composed.png" link="#custom-composed":::</br>
    [**Custom composed**](#custom-composed) | Extract data using a collection of models.
   :::column-end:::
:::row-end:::

:::row:::
    :::column:::
        * **Classification model**</br>
         ✔️ Custom classifiers identify document types prior to invoking an extraction model.
    :::column-end:::
:::row-end:::

:::row:::
   :::column span="":::
      :::image type="icon" source="media/overview/icon-custom-classifier.png" link="#custom-classification-model":::</br>
    [**Custom classifier**](#custom-classification-model) | Identify designated document types (classes) </br>prior to invoking an extraction model.
   :::column-end:::
:::row-end:::

## Add-on capabilities

Document Intelligence supports optional features that can be enabled and disabled depending on the document extraction scenario. The following add-on capabilities are available for`2023-07-31 (GA)` and later releases:

* [`ocr.highResolution`](concept-add-on-capabilities.md#high-resolution-extraction)

* [`ocr.formula`](concept-add-on-capabilities.md#formula-extraction)

* [`ocr.font`](concept-add-on-capabilities.md#font-property-extraction)

* [`ocr.barcode`](concept-add-on-capabilities.md#barcode-property-extraction)

Document Intelligence supports optional features that can be enabled and disabled depending on the document extraction scenario. The following add-on capabilities are available for`2023-10-31-preview` and later releases:

* [`queryFields`](concept-add-on-capabilities.md#query-fields)

## Analysis features

|Model ID|Content Extraction|Paragraphs|Paragraph Roles|Selection Marks|Tables|Key-Value Pairs|Languages|Barcodes|Document Analysis|Formulas*|Style Font*|High Resolution*|query fields|
|:----|:----|:----|:----|:----|:----|:----|:----|:----|:----|:----|:----|:----|:----|
|prebuilt-read|✓|✓| | | | |O|O| |O|O|O| |
|prebuilt-layout|✓|✓|✓|✓|✓| |O|O| |O|O|O|✓|
|prebuilt-idDocument|✓| | | | | |O|O|✓|O|O|O|✓|
|prebuilt-invoice|✓| | |✓|✓|O|O|O|✓|O|O|O|✓|
|prebuilt-receipt|✓| | | | | |O|O|✓|O|O|O|✓|
|prebuilt-healthInsuranceCard.us|✓| | | | | |O|O|✓|O|O|O|✓|
|prebuilt-tax.us.w2|✓| | |✓| | |O|O|✓|O|O|O|✓|
|prebuilt-tax.us.1098|✓| | |✓| | |O|O|✓|O|O|O|✓|
|prebuilt-tax.us.1098E|✓| | |✓| | |O|O|✓|O|O|O|✓|
|prebuilt-tax.us.1098T|✓| | |✓| | |O|O|✓|O|O|O|✓|
|prebuilt-tax.us.1099(Variations)|✓| | |✓| | |O|O|✓|O|O|O|✓|
|prebuilt-contract|✓|✓|✓|✓| | |O|O|✓|O|O|O|✓|
|{ customModelName }|✓|✓|✓|✓|✓| |O|O|✓|O|O|O|✓|
|prebuilt-document (**deprecated </br>2023-10-31-preview**)|✓|✓|✓|✓|✓|✓|O|O| |O|O|O| |
|prebuilt-businessCard (**deprecated </br>2023-10-31-preview**)|✓| | | | | | | |✓| | | | |

✓ - Enabled</br>
O - Optional</br>
\* - Premium features incur extra costs

## Models and development options

> [!NOTE]
>The following document understanding models and development options are supported by the Document Intelligence service v3.0.

You can use Document Intelligence to automate document processing in applications and workflows, enhance data-driven strategies, and enrich document search capabilities. Use the links in the table to learn more about each model and browse development options.

### Read

:::image type="content" source="media/overview/analyze-read.png" alt-text="Screenshot of Read model analysis using Document Intelligence Studio.":::

|Model ID| Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**prebuilt-read**](concept-read.md)|&#9679; Extract **text** from documents.</br>&#9679; [Data and field extraction](concept-read.md#read-model-data-extraction)| &#9679; Contract processing. </br>&#9679; Financial or medical report processing.|&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/read)</br>&#9679; [**REST API**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.0.0&preserve-view=true&pivots=programming-language-rest-api)</br>&#9679; [**C# SDK**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.0.0&preserve-view=true&pivots=programming-language-csharp)</br>&#9679; [**Python SDK**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.0.0&preserve-view=true&pivots=programming-language-python)</br>&#9679; [**Java SDK**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.0.0&preserve-view=true&pivots=programming-language-java)</br>&#9679; [**JavaScript**](how-to-guides/use-sdk-rest-api.md?view=doc-intel-3.0.0&preserve-view=true&pivots=programming-language-javascript) |

> [!div class="nextstepaction"]
> [Return to model types](#document-analysis-models)

### Layout

:::image type="content" source="media/overview/analyze-layout.png" alt-text="Screenshot of the layout model analysis using Document Intelligence Studio.":::

| Model ID | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**prebuilt-layout**](concept-layout.md) |&#9679; Extract **text and layout** information from documents.</br>&#9679; [Data and field extraction](concept-layout.md#data-extraction)</br>&#9679; Layout API is updated to a prebuilt model. |&#9679; Document indexing and retrieval by structure.</br>&#9679; Preprocessing prior to OCR analysis. |&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/layout)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&#9679; [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#layout-model)</br>&#9679; [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#layout-model)</br>&#9679; [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#layout-model)</br>&#9679; [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#layout-model)|

> [!div class="nextstepaction"]
> [Return to model types](#document-analysis-models)

::: moniker range="doc-intel-3.1.0 || doc-intel-3.0.0"

### General document

:::image type="content" source="media/overview/analyze-general-document.png" alt-text="Screenshot of General Document model analysis using Document Intelligence Studio.":::

| Model ID | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**prebuilt-document**](concept-general-document.md)|&#9679; Extract **text,layout, and key-value pairs** from documents.</br>&#9679; [Data and field extraction](concept-general-document.md#data-extraction)|&#9679; Key-value pair extraction.</br>&#9679; Form processing.</br>&#9679; Survey data collection and analysis.|&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/document)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)

> [!div class="nextstepaction"]
> [Return to model types](#document-analysis-models)

:::moniker-end
### Invoice

:::image type="content" source="media/overview/analyze-invoice.png" alt-text="Screenshot of Invoice model analysis using Document Intelligence Studio.":::

| Model ID | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**prebuilt-invoice**](concept-invoice.md) |&#9679; Extract key information from invoices.</br>&#9679; [Data and field extraction](concept-invoice.md#field-extraction) |&#9679; Accounts payable processing.</br>&#9679; Automated tax recording and reporting. |&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true&pivots=programming-language-rest-api#analyze-document-post-request)</br>&#9679; [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)|

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

### Receipt

:::image type="content" source="media/overview/analyze-receipt.png" alt-text="Screenshot of Receipt model analysis using Document Intelligence Studio.":::

| Model ID | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**prebuilt-receipt**](concept-receipt.md) |&#9679; Extract key information from receipts.</br>&#9679; [Data and field extraction](concept-receipt.md#field-extraction)</br>&#9679; Receipt model v3.0 supports processing of **single-page hotel receipts**.|&#9679; Expense management.</br>&#9679; Consumer behavior data analysis.</br>&#9679; Customer loyalty program.</br>&#9679; Merchandise return processing.</br>&#9679; Automated tax recording and reporting. |&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true&pivots=programming-language-rest-api#analyze-document-post-request)</br>&#9679; [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)|

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

### Identity (ID)

:::image type="content" source="media/overview/analyze-id-document.png" alt-text="Screenshot of Identity (ID) Document model analysis using Document Intelligence Studio.":::

| Model ID | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**prebuilt-idDocument**](concept-id-document.md) |&#9679; Extract key information from passports and ID cards.</br>&#9679; [Document types](concept-id-document.md#supported-document-types)</br>&#9679; Extract  endorsements, restrictions, and vehicle classifications from US driver's licenses. |&#9679; Know your customer (KYC) financial services guidelines compliance.</br>&#9679; Medical account management.</br>&#9679; Identity checkpoints and gateways.</br>&#9679; Hotel registration. |&#9679;  [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true&pivots=programming-language-rest-api#analyze-document-post-request)</br>&#9679; [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)|

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

### Health insurance card

:::image type="content" source="media/overview/analyze-health-insurance.png" alt-text="Screenshot of Health insurance card model analysis using Document Intelligence Studio.":::

| Model ID | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
| [**prebuilt-healthInsuranceCard.us**](concept-health-insurance-card.md)|&#9679; Extract key information from US health insurance cards.</br>&#9679; [Data and field extraction](concept-health-insurance-card.md#field-extraction)|&#9679; Coverage and eligibility verification. </br>&#9679; Predictive modeling.</br>&#9679; Value-based analytics.|&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=healthInsuranceCard.us)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true&pivots=programming-language-rest-api#analyze-document-post-request)</br>&#9679; [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

### Contract model

:::image type="content" source="media/overview/analyze-contract.png" alt-text="Screenshot of Contract model extraction using Document Intelligence Studio.":::

| Model ID | Description| Development options |
|----------|--------------|-------------------|
|**prebuilt-contract**|Extract contract agreement and party details.|&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=contract)</br>&#9679; [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

### US Tax W-2 model

:::image type="content" source="media/overview/analyze-w2.png" alt-text="Screenshot of W-2 model analysis using Document Intelligence Studio.":::

| Model ID| Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**prebuilt-tax.us.W-2**](concept-w2.md) |&#9679; Extract key information from IRS US W2 tax forms (year 2018-2021).</br>&#9679; [Data and field extraction](concept-w2.md#field-extraction)|&#9679; Automated tax document management.</br>&#9679; Mortgage loan application processing. |&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true&pivots=programming-language-rest-api#analyze-document-post-request)</br>&#9679; [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model) |

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

### US tax 1098 form

:::image type="content" source="media/overview/analyze-1098.png" alt-text="Screenshot of US 1098 tax form analyzed in the Document Intelligence Studio.":::

| Model ID | Description| Development options |
|----------|--------------|-------------------|
|**prebuilt-tax.us.1098**|Extract mortgage interest information and details.|&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.1098)</br>&#9679; [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

### US tax 1098-E form

:::image type="content" source="media/overview/analyze-1098e.png" alt-text="Screenshot of US 1098-E tax form analyzed in the Document Intelligence Studio.":::

| Model ID | Description |Development options |
|----------|--------------|-------------------|
|**prebuilt-tax.us.1098E**|Extract student loan information and details.|&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.1098E)</br>&#9679; [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

### US tax 1098-T form

:::image type="content" source="media/overview/analyze-1098t.png" alt-text="Screenshot of US 1098-T tax form analyzed in the Document Intelligence Studio.":::

| Model ID |Description|Development options |
|----------|--------------|-----------------|
|**prebuilt-tax.us.1098T**|Extract tuition information and details.|&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.1098T)</br>&#9679; [**REST API**](/rest/api/aiservices/document-models/analyze-document?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

### US tax 1099 (and Variations) form

:::image type="content" source="media/overview/analyze-1099.png" alt-text="Screenshot of US 1099 tax form analyzed in the Document Intelligence Studio." lightbox="media/overview/analyze-1099.png":::

| Model ID |Description|Development options |
|----------|--------------|-----------------|
|**prebuilt-tax.us.1099(Variations)**|Extract information from 1099 form variations.|&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio)</br>&#9679; [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services?pattern=intelligence)

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)

::: moniker range="<=doc-intel-3.1.0"

### Business card

:::image type="content" source="media/overview/analyze-business-card.png" alt-text="Screenshot of Business card model analysis using Document Intelligence Studio.":::

| Model ID | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**prebuilt-businessCard**](concept-business-card.md) |&#9679; Extract key information from business cards.</br>&#9679; [Data and field extraction](concept-business-card.md#field-extractions) |&#9679; Sales lead and marketing management. |&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true&pivots=programming-language-rest-api#analyze-document-post-request)</br>&#9679; [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)</br>&#9679; [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true#prebuilt-model)|

> [!div class="nextstepaction"]
> [Return to model types](#prebuilt-models)
::: moniker-end

### Custom model overview

:::image type="content" source="media/overview/custom-train.png" alt-text="Screenshot of Custom model training using Document Intelligence Studio.":::

| About | Description |Automation use cases |Development options |
|----------|--------------|-----------|--------------------------|
|[**Custom model**](concept-custom.md) | Extracts information from forms and documents into structured data based on a model created from a set of representative training document sets.|Extract distinct data from forms and documents specific to your business and use cases.|&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</br>&#9679; [**REST API**](/rest/api/aiservices/document-models/build-model?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br>&#9679; [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&#9679; [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&#9679; [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&#9679; [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)|

> [!div class="nextstepaction"]
> [Return to custom model types](#custom-models)

#### Custom template

:::image type="content" source="media/overview/analyze-custom-template.png" alt-text="Screenshot of Custom Template model analysis using Document Intelligence Studio.":::

  > [!NOTE]
  > To train a custom template model, set the ```buildMode``` property to ```template```.
  > For more information, *see* [Training a template model](concept-custom-template.md#training-a-model)

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**Custom Template model**](concept-custom-template.md) | The custom template model extracts labeled values and fields from structured and semi-structured documents.</br> | Extract key data from highly structured documents with defined visual templates or common visual layouts, forms.| &#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</br>&#9679; [**REST API**](/rest/api/aiservices/document-models/build-model?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br>&#9679; [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&#9679; [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&#9679; [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&#9679; [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)

> [!div class="nextstepaction"]
> [Return to custom model types](#custom-models)

#### Custom neural

:::image type="content" source="media/overview/analyze-custom-neural.png" alt-text="Screenshot of Custom Neural model analysis using Document Intelligence Studio.":::

  > [!NOTE]
  > To train a custom neural model, set the ```buildMode``` property to ```neural```.
  > For more information, *see* [Training a neural model](concept-custom-neural.md#training-a-model)

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
 |[**Custom Neural model**](concept-custom-neural.md)| The custom neural model is used to extract labeled data from structured (surveys, questionnaires), semi-structured (invoices, purchase orders), and unstructured documents (contracts, letters).|Extract text data, checkboxes, and tabular fields from structured and unstructured documents.|[**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</br>&#9679; [**REST API**](/rest/api/aiservices/document-models/build-model?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br>&#9679; [**C# SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&#9679; [**Java SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&#9679; [**JavaScript SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)</br>&#9679; [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)

> [!div class="nextstepaction"]
> [Return to custom model types](#custom-models)

#### Custom composed

:::image type="content" source="media/overview/composed-custom-models.png" alt-text="Screenshot of Composed Custom model list in Document Intelligence Studio.":::

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**Composed custom models**](concept-composed-models.md)| A composed model is created by taking a collection of custom models and assigning them to a single model built from your form types.| Useful when you train several models and want to group them to analyze similar form types like purchase orders.|&#9679; [**Document Intelligence Studio**](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</br>&#9679; [**REST API**](/rest/api/aiservices/document-models/compose-model?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br>&#9679; [**C# SDK**](/dotnet/api/azure.ai.formrecognizer.training.formtrainingclient.startcreatecomposedmodel)</br>&#9679; [**Java SDK**](/java/api/com.azure.ai.formrecognizer.training.formtrainingclient.begincreatecomposedmodel)</br>&#9679; [**JavaScript SDK**](/javascript/api/@azure/ai-form-recognizer/documentmodeladministrationclient?view=azure-node-latest#@azure-ai-form-recognizer-documentmodeladministrationclient-begincomposemodel&preserve-view=true)</br>&#9679; [**Python SDK**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true)

> [!div class="nextstepaction"]
> [Return to custom model types](#custom-models)

::: moniker range=">=doc-intel-3.1.0"
#### Custom classification model

:::image type="content" source="media/overview/custom-classifier-labeling.png" alt-text="{alt-text}":::

| About | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**Composed classification model**](concept-custom-classifier.md)| Custom classification models combine layout and language features to detect, identify, and classify documents within an input file.|&#9679; A loan application packaged containing application form, payslip, and, bank statement.</br>&#9679; A collection of scanned invoices. |&#9679; [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</br>&#9679; [REST API](/rest/api/aiservices/document-classifiers/build-classifier?view=rest-aiservices-2023-07-31&preserve-view=true&tabs=HTTP)</br>

> [!div class="nextstepaction"]
> [Return to custom model types](#custom-models)

:::moniker-end

::: moniker range="doc-intel-2.1.0"

Azure AI Document Intelligence is a cloud-based [Azure AI service](../../ai-services/index.yml) for developers to build intelligent document processing solutions. Document Intelligence applies machine-learning-based optical character recognition (OCR) and document understanding technologies to extract text, tables, structure, and key-value pairs from documents. You can also label and train custom models to automate data extraction from structured, semi-structured, and unstructured documents. To learn more about each model, *see* the Concepts articles:

| Model type | Model name |
|------------|-----------|
|**Document analysis model**| &#9679; [**Layout analysis model**](concept-layout.md?view=doc-intel-2.1.0&preserve-view=true) </br>  |
| **Prebuilt models** | &#9679; [**Invoice model**](concept-invoice.md?view=doc-intel-2.1.0&preserve-view=true)</br>&#9679; [**Receipt model**](concept-receipt.md?view=doc-intel-2.1.0&preserve-view=true) </br>&#9679; [**Identity document (ID) model**](concept-id-document.md?view=doc-intel-2.1.0&preserve-view=true) </br>&#9679; [**Business card model**](concept-business-card.md?view=doc-intel-2.1.0&preserve-view=true) </br>
| **Custom models** | &#9679; [**Custom model**](concept-custom.md) </br>&#9679; [**Composed model**](concept-model-overview.md?view=doc-intel-2.1.0&preserve-view=true)|

::: moniker-end

::: moniker range="doc-intel-2.1.0"

[!INCLUDE [applies to v2.1](includes/applies-to-v21.md)]

## Document Intelligence models and development options

 >[!TIP]
 >
 > * For an enhanced experience and advanced model quality, try the [Document Intelligence v3.0 Studio](https://formrecognizer.appliedai.azure.com/studio).
 > * The v3.0 Studio supports any model trained with v2.1 labeled data.
 > * You can refer to the API migration guide for detailed information about migrating from v2.1 to v3.0.

> [!NOTE]
> The following models  and development options are supported by the Document Intelligence service v2.1.

Use the links in the table to learn more about each model and browse the API references:

| Model| Description | Development options |
|----------|--------------|-------------------------|
|[**Layout analysis**](concept-layout.md?view=doc-intel-2.1.0&preserve-view=true) | Extraction and analysis of text, selection marks, tables, and bounding box coordinates, from forms and documents. | &#9679; [**Document Intelligence labeling tool**](quickstarts/try-sample-label-tool.md#analyze-layout)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true)</br>&#9679; [**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md)</br>&#9679; [**Document Intelligence Docker container**](containers/install-run.md?branch=main&tabs=layout#run-the-container-with-the-docker-compose-up-command)|
|[**Custom model**](concept-custom.md?view=doc-intel-2.1.0&preserve-view=true) | Extraction and analysis of data from forms and documents specific to distinct business data and use cases.| &#9679; [**Document Intelligence labeling tool**](quickstarts/try-sample-label-tool.md#train-a-custom-form-model)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md)</br>&#9679; [**Sample Labeling Tool**](concept-custom.md?view=doc-intel-2.1.0&preserve-view=true#build-a-custom-model)</br>&#9679; [**Document Intelligence Docker container**](containers/install-run.md?tabs=custom#run-the-container-with-the-docker-compose-up-command)|
|[**Invoice model**](concept-invoice.md?view=doc-intel-2.1.0&preserve-view=true) | Automated data processing and extraction of key information from sales invoices. | &#9679; [**Document Intelligence labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true)</br>&#9679; [**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md)</br>&#9679; [**Document Intelligence Docker container**](containers/install-run.md?tabs=invoice#run-the-container-with-the-docker-compose-up-command)|
|[**Receipt model**](concept-receipt.md?view=doc-intel-2.1.0&preserve-view=true) | Automated data processing and extraction of key information from sales receipts.| &#9679; [**Document Intelligence labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true)</br>&#9679; [**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md)</br>&#9679; [**Document Intelligence Docker container**](containers/install-run.md?tabs=receipt#run-the-container-with-the-docker-compose-up-command)|
|[**Identity document (ID) model**](concept-id-document.md?view=doc-intel-2.1.0&preserve-view=true) | Automated data processing and extraction of key information from US driver's licenses and international passports.| &#9679; [**Document Intelligence labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true)</br>&#9679; [**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md)</br>&#9679; [**Document Intelligence Docker container**](containers/install-run.md?tabs=id-document#run-the-container-with-the-docker-compose-up-command)|
|[**Business card model**](concept-business-card.md?view=doc-intel-2.1.0&preserve-view=true) | Automated data processing and extraction of key information from business cards.| &#9679; [**Document Intelligence labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true)</br>&#9679; [**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md)</br>&#9679; [**Document Intelligence Docker container**](containers/install-run.md?tabs=business-card#run-the-container-with-the-docker-compose-up-command)|

::: moniker-end

## Data privacy and security

 As with all AI services, developers using the Document Intelligence service should be aware of Microsoft policies on customer data. See our [Data, privacy, and security for Document Intelligence](/legal/cognitive-services/document-intelligence/data-privacy-security) page.

## Next steps

::: moniker range=">=doc-intel-3.0.0"

* [Choose a Document Intelligence model](choose-model-feature.md)

* Try processing your own forms and documents with the [Document Intelligence Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end

::: moniker range="doc-intel-2.1.0"

* Try processing your own forms and documents with the [Document Intelligence Sample Labeling tool](https://fott-2-1.azurewebsites.net/)

* Complete a [Document Intelligence quickstart](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-2.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end
