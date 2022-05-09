---
title: What is Azure Form Recognizer? (updated)
titleSuffix: Azure Applied AI Services
description: The Azure Form Recognizer service allows you to identify and extract key/value pairs and table data from your form documents, as well as extract major information from sales receipts and business cards.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 03/08/2022
ms.author: lajanuar
recommendations: false
keywords: automated data processing, document processing, automated data entry, forms processing
#Customer intent: As a developer of form-processing software, I want to learn what the Form Recognizer service does so I can determine if I should use it.
ms.custom: ignite-fall-2021
---
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
# What is Azure Form Recognizer?

Azure Form Recognizer is a cloud-based [Azure Applied AI Service](../../applied-ai-services/index.yml) that uses machine-learning models to extract key-value pairs, text, and tables from your documents. Form Recognizer analyzes your forms and documents, extracts text and data, maps field relationships as key-value pairs, and returns a structured JSON output. You quickly get accurate results that are tailored to your specific content without excessive manual intervention or extensive data science expertise. Use Form Recognizer to automate your data processing in applications and workflows, enhance data-driven strategies, and enrich document search capabilities.

Form Recognizer uses the following models to easily identify, extract, and analyze document data:

**Document analysis models**

* [**Read model**](concept-read.md) | Extract printed and handwritten text lines, words, locations, and detected languages from documents and images.
* [**Layout model**](concept-layout.md) | Extract text, tables, selection marks, and structure information from documents (PDF and TIFF) and images (JPG, PNG, and BMP).
* [**General document model**](concept-general-document.md) | Extract key-value pairs, selection marks, and entities from documents.

**Prebuilt models**

* [**W-2 form model**](concept-w2.md) | Extract text and key information from US W2 tax forms.
* [**Invoice model**](concept-invoice.md) | Extract text, selection marks, tables, key-value pairs, and key information from invoices.
* [**Receipt model**](concept-receipt.md) | Extract text and key information from receipts.
* [**ID document model**](concept-id-document.md) | Extract text and key information from driver licenses and international passports.
* [**Business card model**](concept-business-card.md) | Extract text and key information from business cards.

**Custom models**

* [**Custom model**](concept-custom.md) | Extract and analyze distinct data and use cases from forms and documents specific to your business.
* [**Composed model**](concept-model-overview.md) | Compose a collection of custom models and assign them to a single model built from your form types.

## Which Form Recognizer feature should I use?

This section helps you decide which Form Recognizer v3.0 supported feature you should use for your application:

| What type of document do you want to analyze?| How is the document formatted? | Your best solution |
| -----------------|-------------------| ----------|
|<ul><li>**W-2 Form**</li></yl>| Is your W-2 document composed in United States English (en-US) text?|<ul><li>If **Yes**, use the [**W-2 Form**](concept-w2.md) model.<li>If **No**, use the [**Layout**](concept-layout.md) or [**General document (preview)**](concept-general-document.md) model.</li></ul>|
|<ul><li>**Text-only document**</li></yl>| Is your text-only document _printed_ in a [supported language](language-support.md#read-layout-and-custom-form-template-model) or, if handwritten, is it composed in English?|<ul><li>If **Yes**, use the [**Read**](concept-invoice.md) model.<li>If **No**, use the [**Layout**](concept-layout.md) or [**General document (preview)**](concept-general-document.md) model.</li></ul>
|<ul><li>**Invoice**</li></yl>| Is your invoice document composed in English or Spanish text?|<ul><li>If **Yes**, use the [**Invoice**](concept-invoice.md) model.<li>If **No**, use the [**Layout**](concept-layout.md) or [**General document (preview)**](concept-general-document.md) model.</li></ul>
|<ul><li>**Receipt**</li><li>**Business card**</li></ul>| Is your receipt or business card document composed in English text? | <ul><li>If **Yes**, use the [**Receipt**](concept-receipt.md) or [**Business Card**](concept-business-card.md) model.</li><li>If **No**, use the [**Layout**](concept-layout.md) or [**General document (preview)**](concept-general-document.md) model.</li></ul>|
|<ul><li>**ID document**</li></ul>| Is your ID document a US driver's license or an international passport?| <ul><li>If **Yes**, use the [**ID document**](concept-id-document.md) model.</li><li>If **No**, use the[**Layout**](concept-layout.md) or [**General document (preview)**](concept-general-document.md) model</li></ul>|
 |<ul><li>**Form** or **Document**</li></ul>| Is your form or document an industry-standard format commonly used in your business or industry?| <ul><li>If **Yes**, use the [**Layout**](concept-layout.md) or [**General document (preview)**](concept-general-document.md).</li><li>If **No**, you can [**Train and build a custom model**](quickstarts/try-sample-label-tool.md#train-a-custom-form-model).

## Form Recognizer features and development options

### [Form Recognizer preview (v3.0)](#tab/v3-0)

The following features  and development options are supported by the Form Recognizer service v3.0. Use the links in the table to learn more about each feature and browse the API references.

| Feature | Description | Development options |
|----------|--------------|-------------------------|
|[🆕 **Read**](concept-read.md)|Extract text lines, words, detected languages, and handwritten style if detected.|<ul ><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/read)</li><li>[**REST API**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-rest-api)</li><li>[**C# SDK**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-csharp)</li><li>[**Python SDK**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-python)</li><li>[**Java SDK**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-java)</li><li>[**JavaScript**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-javascript)</li></ul> |
|[🆕 **W-2 Form**](concept-w2.md) | Extract information reported in each box on a W-2 form.|<ul ><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2)<li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#prebuilt-model)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md#prebuilt-model)</li><li>[**JavaScript**](quickstarts/try-v3-javascript-sdk.md#prebuilt-model)</li></ul> |
|[🆕 **General document model**](concept-general-document.md)|Extract text, tables, structure, key-value pairs and, named entities.|<ul ><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/document)</li><li>[**REST API**](quickstarts/try-v3-rest-api.md#reference-table)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#general-document-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#general-document-model)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md#general-document-model)</li><li>[**JavaScript**](quickstarts/try-v3-javascript-sdk.md#general-document-model)</li></ul> |
|[**Layout model**](concept-layout.md) | Extract text, selection marks, and tables structures, along with their bounding box coordinates, from forms and documents.</br></br> Layout API has been updated to a prebuilt model. | <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/layout)</li><li>[**REST API**](quickstarts/try-v3-rest-api.md#reference-table)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#layout-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#layout-model)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md#layout-model)</li><li>[**JavaScript**](quickstarts/try-v3-javascript-sdk.md#layout-model)</li></ul>|
|[**Custom model (updated)**](concept-custom.md) | Extraction and analysis of data from forms and documents specific to distinct business data and use cases.<ul><li>Custom model API v3.0 supports **signature detection for custom template (custom form) models**.</br></br></li><li>Custom model API v3.0 offers a new model type **Custom Neural** or custom document to analyze unstructured documents.</li></ul>| [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</li><li>[**REST API**](quickstarts/try-v3-rest-api.md)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md)</li><li>[**JavaScript**](quickstarts/try-v3-javascript-sdk.md)</li></ul>|
|[**Invoice model**](concept-invoice.md) | Automated data processing and extraction of key information from sales invoices. | <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#prebuilt-model)</li></ul>|
|[**Receipt model (updated)**](concept-receipt.md) | Automated data processing and extraction of key information from sales receipts.</br></br>Receipt model v3.0 supports processing of **single-page hotel receipts**.| <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)</li><li>[**REST API**](quickstarts/try-v3-rest-api.md)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#prebuilt-model)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md#prebuilt-model)</li><li>[**JavaScript**](quickstarts/try-v3-javascript-sdk.md#prebuilt-model)</li></ul>|
|[**ID document model (updated)**](concept-id-document.md) |Automated data processing and extraction of key information from US driver's licenses and international passports.</br></br>Prebuilt ID document API supports the **extraction of endorsements, restrictions, and vehicle classifications from US driver's licenses**. |<ul><li> [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)</li><li>[**REST API**](quickstarts/try-v3-rest-api.md)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#prebuilt-model)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md#prebuilt-model)</li><li>[**JavaScript**](quickstarts/try-v3-javascript-sdk.md#prebuilt-model)</li></ul>|
|[**Business card model**](concept-business-card.md) |Automated data processing and extraction of key information from business cards.| <ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)</li><li>[**REST API**](quickstarts/try-v3-rest-api.md)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#prebuilt-model)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md#prebuilt-model)</li><li>[**JavaScript**](quickstarts/try-v3-javascript-sdk.md#prebuilt-model)</li></ul>|

### [Form Recognizer GA (v2.1)](#tab/v2-1)

The following features are supported by Form Recognizer v2.1. Use the links in the table to learn more about each feature and browse the API references.

| Feature | Description | Development options |
|----------|--------------|-------------------------|
|[**Layout API**](concept-layout.md) | Extraction and analysis of text, selection marks, tables, and bounding box coordinates, from forms and documents. | <ul><li>[**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-layout)</li><li>[**REST API**](quickstarts/get-started-sdk-rest-api.md#try-it-layout-model)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?branch=main&tabs=layout#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Custom model**](concept-custom.md) | Extraction and analysis of data from forms and documents specific to distinct business data and use cases.| <ul><li>[**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#train-a-custom-form-model)</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md)</li><li>[**Client-library SDK**](how-to-guides/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=custom#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Invoice model**](concept-invoice.md) | Automated data processing and extraction of key information from sales invoices. | <ul><li>[**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</li><li>[**REST API**](quickstarts/get-started-sdk-rest-api.md#try-it-prebuilt-model)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=invoice#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Receipt model**](concept-receipt.md) | Automated data processing and extraction of key information from sales receipts.| <ul><li>[**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</li><li>[**REST API**](quickstarts/get-started-sdk-rest-api.md#try-it-prebuilt-model)</li><li>[**Client-library SDK**](how-to-guides/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=receipt#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**ID document model**](concept-id-document.md) | Automated data processing and extraction of key information from US driver's licenses and international passports.| <ul><li>[**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</li><li>[**REST API**](quickstarts/get-started-sdk-rest-api.md#try-it-prebuilt-model)</li><li>[**Client-library SDK**](how-to-guides/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=id-document#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Business card model**](concept-business-card.md) | Automated data processing and extraction of key information from business cards.| <ul><li>[**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</li><li>[**REST API**](quickstarts/get-started-sdk-rest-api.md#try-it-prebuilt-model)</li><li>[**Client-library SDK**](how-to-guides/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=business-card#run-the-container-with-the-docker-compose-up-command)</li></ul>|

---

## How to use Form Recognizer documentation

This documentation contains the following article types:

* [**Concepts**](concept-layout.md) provide in-depth explanations of the service functionality and features.
* [**Quickstarts**](quickstarts/try-sdk-rest-api.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](how-to-guides/try-sdk-rest-api.md) contain instructions for using the service in more specific or customized ways.
* [**Tutorials**](tutorial-ai-builder.md) are longer guides that show you how to use the service as a component in broader business solutions.

## Data privacy and security

 As with all the cognitive services, developers using the Form Recognizer service should be aware of Microsoft policies on customer data. See our [Data, privacy, and security for Form Recognizer](/legal/cognitive-services/form-recognizer/fr-data-privacy-security) page.

## Next steps

### [Form Recognizer v3.0](#tab/v3-0)

> [!div class="checklist"]
>
> * Try our [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com)
> * Explore the [**REST API reference documentation**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-1/operations/AnalyzeDocument) to learn more.
> * If you're familiar with a previous version of the API, see the [**What's new**](./whats-new.md) article to learn of recent changes.

### [Form Recognizer v2.1](#tab/v2-1)

> [!div class="checklist"]
>
> * Try our [**Sample Labeling online tool**](https://aka.ms/fott-2.1-ga/)
> * Follow our [**client library / REST API quickstart**](./quickstarts/try-sdk-rest-api.md) to get started extracting data from your documents. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.
> * Explore the [**REST API reference documentation**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) to learn more.
> * If you're familiar with a previous version of the API, see the [**What's new**](./whats-new.md) article to learn of recent changes.

---
