---
title: What is Azure Form Recognizer? (updated)
titleSuffix: Azure Applied AI Services
description: The Azure Form Recognizer service allows you to identify and extract key/value pairs and table data from your form documents, as well as extract major information from sales receipts and business cards.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 07/11/2022
ms.author: lajanuar
recommendations: false
keywords: automated data processing, document processing, automated data entry, forms processing
#Customer intent: As a developer of form-processing software, I want to learn what the Form Recognizer service does so I can determine if I should use it.
---
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->
# What is Azure Form Recognizer?

Azure Form Recognizer is a cloud-based [Azure Applied AI Service](../../applied-ai-services/index.yml) that analyzes forms and documents, extracts text and data, and maps field relationships as key-value pairs.

| Model type | Model name |
|------------|-----------|
|**Document analysis models**| &#9679; [**Read model**](concept-read.md)</br> &#9679; [**General document model**](concept-general-document.md)</br> &#9679; [**Layout model**](concept-layout.md) </br>  |
| **Prebuilt models** | &#9679; [**W-2 form model**](concept-w2.md) </br>&#9679; [**Invoice model**](concept-invoice.md)</br>&#9679; [**Receipt model**](concept-receipt.md) </br>&#9679; [**ID document model**](concept-id-document.md) </br>&#9679; [**Business card model**](concept-business-card.md) </br>
| **Custom models** | &#9679; [**Custom model**](concept-custom.md) </br>&#9679; [**Composed model**](concept-model-overview.md)|

## Which Form Recognizer feature should I use?

This section helps you decide which Form Recognizer v3.0 supported feature you should use for your application:

| Type of document | Data to extract |Document format | Your best solution |
| -----------------|-------------------| ----------|-------------------|
|**Unstructured document** like a contract or letter.|You want to extract primarily text lines, words, locations, and detected languages from a text-based document (not tables, selection marks, and/or structure).|</li></ul>The document is composed in a [supported language](language-support.md#read-layout-and-custom-form-template-model).| <ul><li>Use the [**Read (preview)**](concept-read.md) model for text-only extraction.|
|**Any document that includes structural types like tables and selection marks** like a questionnaire, report, or study.|In addition to text, you need to extract structure information like tables, selection marks, paragraphs, titles, headings, and subheadings|The document is composed in a [supported language](language-support.md#read-layout-and-custom-form-template-model)|<ul><li>Use the [**Layout**](concept-layout.md) model if you also need structure information like pages, tables, barcodes and element location.</li></ul>
|**Structured document** like an invoice or questionnaire.|You want to extract key-value pairs, selection marks, and tables from a structured document.|The document is mostly structured and contains fields and values that may not be covered by the other prebuilt models.|<ul><li>Use the [**General document (preview)**](concept-general-document.md) model for a typical structured document.</li></ul>
|**Industry-standard form or document**, like a credit or job application.|You want to extract key-value pairs, from customary documents including those not covered by the scenario-specific prebuilt models without having to train a custom model.|The form or document is a standardized format commonly used in business or industry.| <ul><li>Use the [**General document (preview)**](concept-general-document.md) model to extract the fields found in the layout model as well as key-value pairs.</li></ul>
|**U.S. W-2 form**|You want to extract key information such as salary, wages, and taxes withheld from US W2 tax forms.</li></ul> |The W-2 document is composed in United States English (en-US) text.|<ul><li>Use the [**W-2 Form**](concept-w2.md) model</li></ul>.
|**Invoice**|You want to extract key information such as customer name, billing address, and amount due from invoices.</li></ul> |The invoice document is formatted in a [supported language](language-support.md#invoice-model).|<ul><li>Use the [**Invoice**](concept-invoice.md) model.</li></ul>
 |**Receipt**|You want to extract key information such as merchant name, merchant phone number, transaction date, and transaction total from a sales or single-page hotel receipt.</li></ul> |The receipt is formatted in English text|<ul><li> Use the [**Receipt**](concept-receipt.md) model.</li></ul>|
|**Business card**|You want to extract key information such as first name, last name, company name, email address, and phone number  from business cards.</li></ul>|The business card document formatted in English or Japanese text. | <ul><li>Use the [**Business Card**](concept-business-card.md) model.</li></ul>|
|**ID document**|You want to extract key information such as first name, last name, and date of birth from US drivers' licenses or international passports. |Your ID document is a US driver's license or the biographical page from an international passport (not a visa).| Use the [**ID document**](concept-id-document.md) model.</li></ul>|
|**Custom document**| You want to extract data from a document where the fields and values are complex and highly variable and aren't covered by the scenario-specfic prebuilt models.|

>[!Tip]
>
> * If you're still unsure as to which model to use, try the General document model. 
> * The General document model extracts all the same fields as the layout model (pages, tables, styles) as well as key-value pairs It's powered by the Read OCR model to detect lines, words, locations, and languages.

## Form Recognizer features and development options

### [Form Recognizer preview (v3.0)](#tab/v3-0)

The following features  and development options are supported by the Form Recognizer service v3.0. You can Use Form Recognizer to automate your data processing in applications and workflows, enhance data-driven strategies, and enrich document search capabilities. Use the links in the table to learn more about each feature and browse the API references.

| Feature | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[🆕 **Read**](concept-read.md)|Extract text lines, words, detected languages, and handwritten style if detected.| <ul><li>Contract processing. </li><li>Financial or medical report processing.</li></ul>|<ul ><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/read)</li><li>[**REST API**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-rest-api)</li><li>[**C# SDK**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-csharp)</li><li>[**Python SDK**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-python)</li><li>[**Java SDK**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-java)</li><li>[**JavaScript**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-javascript)</li></ul> |
|[🆕 **General document model**](concept-general-document.md)|Extract text, tables, structure, and key-value pairs.|<ul><li>Key-value pair extraction.</li><li>Form processing.</li><li>Survey data collection and analysis.</li></ul>|<ul ><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/document)</li><li>[**REST API**](quickstarts/try-v3-rest-api.md#reference-table)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#general-document-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#general-document-model)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md#general-document-model)</li><li>[**JavaScript**](quickstarts/try-v3-javascript-sdk.md#general-document-model)</li></ul> |
|[**Layout model**](concept-layout.md) | Extract text, selection marks, and tables structures, along with their bounding box coordinates, from forms and documents.</br></br> Layout API has been updated to a prebuilt model. |<ul><li>Document indexing and retrieval by structure.</li><li>Preprocessing prior to OCR analysis.</li></ul> |<ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/layout)</li><li>[**REST API**](quickstarts/try-v3-rest-api.md#reference-table)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#layout-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#layout-model)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md#layout-model)</li><li>[**JavaScript**](quickstarts/try-v3-javascript-sdk.md#layout-model)</li></ul>|
|[**Custom model (updated)**](concept-custom.md) | Extraction and analysis of data from forms and documents specific to distinct business data and use cases.</br></br>Custom model API v3.0 supports **signature detection for custom template (custom form) models**.</br></br>Custom model API v3.0 now supports two model types:ul><li>[**Custom Template model**](concept-custom-template.md) (custom form) is used to analyze structured and semi-structured documents.</li><li> [**Custom Neural model**](concept-custom-neural.md) (custom document) is used to analyze unstructured documents.</li></ul>|<ul><li>Identification and compilation of data, unique to your business, impacted by a regulatory change or market event.</li><li>Identification and analysis of previously overlooked unique data.</li></ul> |[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</li><li>[**REST API**](quickstarts/try-v3-rest-api.md)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md)</li><li>[**JavaScript**](quickstarts/try-v3-javascript-sdk.md)</li></ul>|
|[🆕 **W-2 Form**](concept-w2.md) | Extract information reported in each box on a W-2 form.|<ul><li>Automated tax document management.</li><li>Mortgage loan application processing.</li></ul> |<ul ><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2)<li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#prebuilt-model)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md#prebuilt-model)</li><li>[**JavaScript**](quickstarts/try-v3-javascript-sdk.md#prebuilt-model)</li></ul> |
|[**Invoice model**](concept-invoice.md) | Automated data processing and extraction of key information from sales invoices. |<ul><li>Accounts payable processing.</li><li>Automated tax recording and reporting.</li></ul> |<ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)</li><li>[**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-06-30-preview/operations/AnalyzeDocument)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#prebuilt-model)</li></ul>|
|[**Receipt model (updated)**](concept-receipt.md) | Automated data processing and extraction of key information from sales receipts.</br></br>Receipt model v3.0 supports processing of **single-page hotel receipts**.|<ul><li>Expense management.</li><li>Consumer behavior data analysis.</li><li>Customer loyalty program.</li><li>Merchandise return processing.</li><li>Automated tax recording and reporting.</li></ul> |<ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)</li><li>[**REST API**](quickstarts/try-v3-rest-api.md)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#prebuilt-model)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md#prebuilt-model)</li><li>[**JavaScript**](quickstarts/try-v3-javascript-sdk.md#prebuilt-model)</li></ul>|
|[**ID document model (updated)**](concept-id-document.md) |Automated data processing and extraction of key information from US driver's licenses and international passports.</br></br>Prebuilt ID document API supports the **extraction of endorsements, restrictions, and vehicle classifications from US driver's licenses**. |<ul><li>Know your customer (KYC) financial services guidelines compliance.</li><li>Medical account management.</li><li>Identity checkpoints and gateways.</li><li>Hotel registration.</li></ul> |<ul><li> [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)</li><li>[**REST API**](quickstarts/try-v3-rest-api.md)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#prebuilt-model)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md#prebuilt-model)</li><li>[**JavaScript**](quickstarts/try-v3-javascript-sdk.md#prebuilt-model)</li></ul>|
|[**Business card model**](concept-business-card.md) |Automated data processing and extraction of key information from business cards.|<ul><li>Sales lead and marketing management.</li></ul> |<ul><li>[**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)</li><li>[**REST API**](quickstarts/try-v3-rest-api.md)</li><li>[**C# SDK**](quickstarts/try-v3-csharp-sdk.md#prebuilt-model)</li><li>[**Python SDK**](quickstarts/try-v3-python-sdk.md#prebuilt-model)</li><li>[**Java SDK**](quickstarts/try-v3-java-sdk.md#prebuilt-model)</li><li>[**JavaScript**](quickstarts/try-v3-javascript-sdk.md#prebuilt-model)</li></ul>|

### [Form Recognizer GA (v2.1)](#tab/v2-1)

 >[!TIP]
 >
 > * For an enhanced experience and advanced model quality, try the [Form Recognizer v3.0 Studio (preview)](https://formrecognizer.appliedai.azure.com/studio).
 > * The v3.0 Studio supports any model trained with v2.1 labeled data.
 > * You can refer to the API migration guide for detailed information about migrating from v2.1 to v3.0.

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
> * Explore the [**REST API reference documentation**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-06-30-preview/operations/AnalyzeDocument) to learn more.
> * If you're familiar with a previous version of the API, see the [**What's new**](./whats-new.md) article to learn of recent changes.

### [Form Recognizer v2.1](#tab/v2-1)

> [!div class="checklist"]
>
> * Try our [**Sample Labeling online tool**](https://aka.ms/fott-2.1-ga/)
> * Follow our [**client library / REST API quickstart**](./quickstarts/try-sdk-rest-api.md) to get started extracting data from your documents. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.
> * Explore the [**REST API reference documentation**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) to learn more.
> * If you're familiar with a previous version of the API, see the [**What's new**](./whats-new.md) article to learn of recent changes.

---
