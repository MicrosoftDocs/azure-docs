---
title: What is Azure Form Recognizer
titleSuffix: Azure Applied AI Services
description: Machine-learning based OCR and intelligent document processing understanding service to automate extraction of text, table and structure, and key-value pairs from your forms and documents.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 03/03/2023
ms.author: lajanuar
recommendations: false
---

<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD036 -->

# What is Azure Form Recognizer?

::: moniker range="form-recog-3.0.0"
[!INCLUDE [applies to v3.0](includes/applies-to-v3-0.md)]
::: moniker-end

::: moniker range="form-recog-3.0.0"

Azure Form Recognizer is a cloud-based [Azure Applied AI Service](../../applied-ai-services/index.yml) for developers to build intelligent document processing solutions. Form Recognizer applies machine-learning-based optical character recognition (OCR) and document understanding technologies to classify documents, extract text, tables, structure, and key-value pairs from documents. You can also label and train custom models to automate data extraction from structured, semi-structured, and unstructured documents. To learn more about each model, *see* the Concepts articles:

[!INCLUDE [Models](includes/model-type-name.md)]

## Video: Form Recognizer models

The following video introduces Form Recognizer models and their associated output to help you choose the best model to address your document scenario needs.</br></br>

  > [!VIDEO https://www.microsoft.com/en-us/videoplayer/embed/RE5fX1b]

## Which Form Recognizer model should I use?

This section helps you decide which **Form Recognizer v3.0** supported model you should use for your application:

| Type of document | Data to extract |Document format | Your best solution |
| -----------------|-------------------| ----------|-------------------|
|**A generic document** like a contract or letter.|You want to extract primarily text lines, words, locations, and detected languages.|The document is written or printed in a [supported language](language-support.md#read-layout-and-custom-form-template-model).| [**Read OCR model**](concept-read.md)|
|**A document that includes structural information** like a report or study.|In addition to text, you need to extract structural information like tables, selection marks, paragraphs, titles, headings, and subheadings.|The document is written or printed in a [supported language](language-support.md#read-layout-and-custom-form-template-model)| [**Layout analysis model**](concept-layout.md)
|**A structured or semi-structured document that includes content formatted as fields and values**, like a credit application or survey form.|You want to extract fields and values including ones not covered by the scenario-specific prebuilt models **without having to train a custom model**.| The form or document is a standardized format commonly used in your business or industry and printed in a [supported language](language-support.md#read-layout-and-custom-form-template-model).|[**General document  model**](concept-general-document.md)
|**U.S. W-2 form**|You want to extract key information such as salary, wages, and taxes withheld from US W2 tax forms. |The W-2 document is in United States English (en-US) text.|[**W-2 model**](concept-w2.md)
|**Invoice**|You want to extract key information such as customer name, billing address, and amount due from invoices. |The invoice document is written or printed in a [supported language](language-support.md#invoice-model).|[**Invoice model**](concept-invoice.md)
 |**Receipt**|You want to extract key information such as merchant name, transaction date, and transaction total from a sales or single-page hotel receipt. |The receipt is written or printed in a [supported language](language-support.md#receipt-model). |[**Receipt model**](concept-receipt.md)|
|**Identity document (ID)** like a passport or driver's license. |You want to extract key information such as first name, last name, and date of birth from US drivers' licenses or international passports. |Your ID document is a US driver's license or the biographical page from an international passport (not a visa).| [**Identity document (ID) model**](concept-id-document.md)|
|**Business card**|You want to extract key information such as first name, last name, company name, email address, and phone number from business cards.|The business card document is in English or Japanese text. | [**Business card model**](concept-business-card.md)|
|**Application specific documents**| You want to extract key-value pairs, selection marks, tables, signature fields, and selected regions not extracted by prebuilt or general document models.| You have various documents with structured, semi-structured, and/or unstructured elements.| [**Custom extraction model**](concept-custom.md)|
|**Mixed-type document(s)**| You want to classify documents or split a file into individual documents.| You have various documents with structured, semi-structured, and/or unstructured elements.| [**Custom classification model**](concept-custom.md)|

>[!Tip]
>
> * If you're still unsure which model to use, try the General Document model to extract key-value pairs.
> * The General Document model is powered by the Read OCR engine to detect text lines, words, locations, and languages.
> * General document also extracts the same data as the document layout model (pages, tables, styles).

## Document processing models and development options

> [!NOTE]
>The following document understanding models and development options are supported by the Form Recognizer service v3.0.

You can Use Form Recognizer to automate your document processing in applications and workflows, enhance data-driven strategies, and enrich document search capabilities. Use the links in the table to learn more about each model and browse the API references.

| Model | Description |Automation use cases | Development options |
|----------|--------------|-------------------------|-----------|
|[**Read OCR model**](concept-read.md)|Extract text lines, words, detected languages, and handwritten style if detected.| &#9679; Contract processing. </br>&#9679; Financial or medical report processing.|&#9679; [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/read)</br>&#9679; [**REST API**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-rest-api)</br>&#9679; [**C# SDK**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-csharp)</br>&#9679; [**Python SDK**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-python)</br>&#9679; [**Java SDK**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-java)</br>&#9679; [**JavaScript**](how-to-guides/use-prebuilt-read.md?pivots=programming-language-javascript) |
|[**General document model**](concept-general-document.md)|Extract text, tables, structure, and key-value pairs.|&#9679; Key-value pair extraction.</br>&#9679; Form processing.</br>&#9679; Survey data collection and analysis.|&#9679; [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/document)</br>&#9679; [**REST API**](quickstarts/get-started-v3-sdk-rest-api.md)</br>&#9679; [**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md#general-document-model)</br>&#9679; [**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md#general-document-model)</br>&#9679; [**Java SDK**](quickstarts/get-started-v3-sdk-rest-api.md#general-document-model)</br>&#9679; [**JavaScript**](quickstarts/get-started-v3-sdk-rest-api.md#general-document-model) |
|[**Layout analysis model**](concept-layout.md) | Extract text, selection marks, and tables structures, along with their bounding box coordinates, from forms and documents.</br></br> Layout API has been updated to a prebuilt model. |&#9679; Document indexing and retrieval by structure.</br>&#9679; Preprocessing prior to OCR analysis. |&#9679; [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/layout)</br>&#9679; [**REST API**](quickstarts/get-started-v3-sdk-rest-api.md)</br>&#9679; [**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md#layout-model)</br>&#9679; [**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md#layout-model)</br>&#9679; [**Java SDK**](quickstarts/get-started-v3-sdk-rest-api.md#layout-model)</br>&#9679; [**JavaScript**](quickstarts/get-started-v3-sdk-rest-api.md#layout-model)|
|[**Custom model (updated)**](concept-custom.md) | Classification, extraction and analysis of data from forms and documents specific to distinct business data and use cases. Custom model API v3.0 supports two model types:&#9679; [**Custom Classifier model**](concept-custom-classifier.md)  is used to identify and split document types.</br>&#9679;  [**Custom Extraction model**](concept-custom.md) is used to analyze forms or documents and extract specific fields and tables. [Custom template](concept-custom-template.md) and [custom neural](concept-custom-neural.md) are the two types of custom extraction models.|&#9679; Identification and extraction of data from documents unique to your business, impacted by a regulatory change or market event.</br>&#9679; Identification and analysis of previously overlooked unique data. |&#9679; [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/custommodel/projects)</br>&#9679; [**REST API**](quickstarts/get-started-v3-sdk-rest-api.md)</br>&#9679; [**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md)</br>&#9679; [**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md)</br>&#9679; [**Java SDK**](quickstarts/get-started-v3-sdk-rest-api.md)</br>&#9679; [**JavaScript**](quickstarts/get-started-v3-sdk-rest-api.md)|
|[**W-2 Form**](concept-w2.md) | Extract information reported in each box on a W-2 form.|&#9679; Automated tax document management.</br>&#9679; Mortgage loan application processing. |&#9679; [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=tax.us.w2)&#9679; [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v3-0-preview-2/operations/AnalyzeDocument)</br>&#9679; [**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</br>&#9679; [**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</br>&#9679; [**Java SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</br>&#9679; [**JavaScript**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model) |
|[**Invoice model**](concept-invoice.md) | Automated data processing and extraction of key information from sales invoices. |&#9679; Accounts payable processing.</br>&#9679; Automated tax recording and reporting. |&#9679; [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=invoice)</br>&#9679; [**REST API**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-2022-08-31/operations/AnalyzeDocument)</br>&#9679; [**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</br>&#9679; [**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)|
|[**Receipt model (updated)**](concept-receipt.md) | Automated data processing and extraction of key information from sales receipts.</br></br>Receipt model v3.0 supports processing of **single-page hotel receipts**.|&#9679; Expense management.</br>&#9679; Consumer behavior data analysis.</br>&#9679; Customer loyalty program.</br>&#9679; Merchandise return processing.</br>&#9679; Automated tax recording and reporting. |&#9679; [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=receipt)</br>&#9679; [**REST API**](quickstarts/get-started-v3-sdk-rest-api.md)</br>&#9679; [**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</br>&#9679; [**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</br>&#9679; [**Java SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</br>&#9679; [**JavaScript**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)|
|[**Identity document (ID) model (updated)**](concept-id-document.md) |Automated data processing and extraction of key information from US driver's licenses and international passports.</br></br>Prebuilt ID document API supports the **extraction of endorsements, restrictions, and vehicle classifications from US driver's licenses**. |&#9679; Know your customer (KYC) financial services guidelines compliance.</br>&#9679; Medical account management.</br>&#9679; Identity checkpoints and gateways.</br>&#9679; Hotel registration. |&#9679;  [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=idDocument)</br>&#9679; [**REST API**](quickstarts/get-started-v3-sdk-rest-api.md)</br>&#9679; [**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</br>&#9679; [**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</br>&#9679; [**Java SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</br>&#9679; [**JavaScript**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)|
|[**Business card model**](concept-business-card.md) |Automated data processing and extraction of key information from business cards.|&#9679; Sales lead and marketing management. |&#9679; [**Form Recognizer Studio**](https://formrecognizer.appliedai.azure.com/studio/prebuilt?formType=businessCard)</br>&#9679; [**REST API**](quickstarts/get-started-v3-sdk-rest-api.md)</br>&#9679; [**C# SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</br>&#9679; [**Python SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</br>&#9679; [**Java SDK**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)</br>&#9679; [**JavaScript**](quickstarts/get-started-v3-sdk-rest-api.md#prebuilt-model)|

::: moniker-end

::: moniker range="form-recog-2.1.0"
[!INCLUDE [applies to v2.1](includes/applies-to-v2-1.md)]
::: moniker-end

::: moniker range="form-recog-2.1.0"

Azure Form Recognizer is a cloud-based [Azure Applied AI Service](../../applied-ai-services/index.yml) for developers to build intelligent document processing solutions. Form Recognizer applies machine-learning-based optical character recognition (OCR) and document understanding technologies to extract text, tables, structure, and key-value pairs from documents. You can also label and train custom models to automate data extraction from structured, semi-structured, and unstructured documents. To learn more about each model, *see* the Concepts articles:

| Model type | Model name |
|------------|-----------|
|**Document analysis model**| &#9679; [**Layout analysis model**](concept-layout.md?view=form-recog-2.1.0&preserve-view=true) </br>  |
| **Prebuilt models** | &#9679; [**Invoice model**](concept-invoice.md?view=form-recog-2.1.0&preserve-view=true)</br>&#9679; [**Receipt model**](concept-receipt.md?view=form-recog-2.1.0&preserve-view=true) </br>&#9679; [**Identity document (ID) model**](concept-id-document.md?view=form-recog-2.1.0&preserve-view=true) </br>&#9679; [**Business card model**](concept-business-card.md?view=form-recog-2.1.0&preserve-view=true) </br>
| **Custom models** | &#9679; [**Custom model**](concept-custom.md) </br>&#9679; [**Composed model**](concept-model-overview.md?view=form-recog-2.1.0&preserve-view=true)|

## Which document processing model should I use?

This section helps you decide which Form Recognizer v2.1 supported model you should use for your application:

| Type of document | Data to extract |Document format | Your best solution |
| -----------------|-------------------| ----------|-------------------|
|**A document that includes structural information** like a report or study.|In addition to text, you need to extract structural information like tables and selection marks.|The document is written or printed in a [supported language](language-support.md#read-layout-and-custom-form-template-model)| [**Layout analysis model**](concept-layout.md?view=form-recog-2.1.0&preserve-view=true)
|**Invoice**|You want to extract key information such as customer name, billing address, and amount due from invoices. |The invoice document is written or printed in a [supported language](language-support.md#invoice-model).|[**Invoice model**](concept-invoice.md?view=form-recog-2.1.0&preserve-view=true)
 |**Receipt**|You want to extract key information such as merchant name, transaction date, and transaction total from a sales or single-page hotel receipt. |The receipt is written or printed in a [supported language](language-support.md#receipt-model). |[**Receipt model**](concept-receipt.md?view=form-recog-2.1.0&preserve-view=true)|
|**Identity document (ID)** like a passport or driver's license. |You want to extract key information such as first name, last name, and date of birth from US drivers' licenses or international passports. |Your ID document is a US driver's license or the biographical page from an international passport (not a visa).| [**ID document model**](concept-id-document.md?view=form-recog-2.1.0&preserve-view=true)|
|**Business card**|You want to extract key information such as first name, last name, company name, email address, and phone number from business cards.|The business card document is in English or Japanese text. | [**Business card model**](concept-business-card.md?view=form-recog-2.1.0&preserve-view=true)|
|**Mixed-type document(s)**| You want to extract key-value pairs, selection marks, tables, signature fields, and selected regions not extracted by prebuilt or general document models.| You have various documents with structured, semi-structured, and/or unstructured elements.| [**Custom model**](concept-custom.md?view=form-recog-2.1.0&preserve-view=true)|

## Form Recognizer models and development options

 >[!TIP]
 >
 > * For an enhanced experience and advanced model quality, try the [Form Recognizer v3.0 Studio](https://formrecognizer.appliedai.azure.com/studio).
 > * The v3.0 Studio supports any model trained with v2.1 labeled data.
 > * You can refer to the API migration guide for detailed information about migrating from v2.1 to v3.0.

> [!NOTE]
> The following models  and development options are supported by the Form Recognizer service v2.1.

Use the links in the table to learn more about each model and browse the API references:

| Model| Description | Development options |
|----------|--------------|-------------------------|
|[**Layout analysis**](concept-layout.md?view=form-recog-2.1.0&preserve-view=true) | Extraction and analysis of text, selection marks, tables, and bounding box coordinates, from forms and documents. | &#9679; [**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-layout)</br>&#9679; [**REST API**](quickstarts/get-started-v2-1-sdk-rest-api.md#try-it-layout-model)</br>&#9679; [**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md)</br>&#9679; [**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?branch=main&tabs=layout#run-the-container-with-the-docker-compose-up-command)|
|[**Custom model**](concept-custom.md?view=form-recog-2.1.0&preserve-view=true) | Extraction and analysis of data from forms and documents specific to distinct business data and use cases.| &#9679; [**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#train-a-custom-form-model)</br>&#9679; [**REST API**](quickstarts/get-started-sdks-rest-api.md)</br>&#9679; [**Sample Labeling Tool**](concept-custom.md?view=form-recog-2.1.0&preserve-view=true#build-a-custom-model)</br>&#9679; [**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=custom#run-the-container-with-the-docker-compose-up-command)|
|[**Invoice model**](concept-invoice.md?view=form-recog-2.1.0&preserve-view=true) | Automated data processing and extraction of key information from sales invoices. | &#9679; [**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</br>&#9679; [**REST API**](quickstarts/get-started-v2-1-sdk-rest-api.md#try-it-prebuilt-model)</br>&#9679; [**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md#try-it-prebuilt-model)</br>&#9679; [**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=invoice#run-the-container-with-the-docker-compose-up-command)|
|[**Receipt model**](concept-receipt.md?view=form-recog-2.1.0&preserve-view=true) | Automated data processing and extraction of key information from sales receipts.| &#9679; [**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</br>&#9679; [**REST API**](quickstarts/get-started-v2-1-sdk-rest-api.md#try-it-prebuilt-model)</br>&#9679; [**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md)</br>&#9679; [**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=receipt#run-the-container-with-the-docker-compose-up-command)|
|[**Identity document (ID) model**](concept-id-document.md?view=form-recog-2.1.0&preserve-view=true) | Automated data processing and extraction of key information from US driver's licenses and international passports.| &#9679; [**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</br>&#9679; [**REST API**](quickstarts/get-started-v2-1-sdk-rest-api.md#try-it-prebuilt-model)</br>&#9679; [**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md)</br>&#9679; [**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=id-document#run-the-container-with-the-docker-compose-up-command)|
|[**Business card model**](concept-business-card.md?view=form-recog-2.1.0&preserve-view=true) | Automated data processing and extraction of key information from business cards.| &#9679; [**Form Recognizer labeling tool**](quickstarts/try-sample-label-tool.md#analyze-using-a-prebuilt-model)</br>&#9679; [**REST API**](quickstarts/get-started-v2-1-sdk-rest-api.md#try-it-prebuilt-model)</br>&#9679; [**Client-library SDK**](quickstarts/get-started-sdks-rest-api.md)</br>&#9679; [**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=business-card#run-the-container-with-the-docker-compose-up-command)|

::: moniker-end

## Data privacy and security

 As with all AI services, developers using the Form Recognizer service should be aware of Microsoft policies on customer data. See our [Data, privacy, and security for Form Recognizer](/legal/cognitive-services/form-recognizer/fr-data-privacy-security) page.

## Next steps

::: moniker range="form-recog-3.0.0"

* Try processing your own forms and documents with the [Form Recognizer Studio](https://formrecognizer.appliedai.azure.com/studio)

* Complete a [Form Recognizer quickstart](quickstarts/get-started-sdks-rest-api.md?view=form-recog-3.0.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end

::: moniker range="form-recog-2.1.0"

* Try processing your own forms and documents with the [Form Recognizer Sample Labeling tool](https://fott-2-1.azurewebsites.net/)

* Complete a [Form Recognizer quickstart](quickstarts/get-started-sdks-rest-api.md?view=form-recog-2.1.0&preserve-view=true) and get started creating a document processing app in the development language of your choice.

::: moniker-end
