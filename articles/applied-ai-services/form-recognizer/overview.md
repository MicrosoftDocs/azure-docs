---
title: What is Azure Form Recognizer? (updated)
titleSuffix: Azure Applied AI Services
description: The Azure Form Recognizer service allows you to identify and extract key/value pairs and table data from your form documents, as well as extract major information from sales receipts and business cards.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 08/20/2021
ms.author: lajanuar
recommendations: false
keywords: automated data processing, document processing, automated data entry, forms processing
#Customer intent: As a developer of form-processing software, I want to learn what the Form Recognizer service does so I can determine if I should use it.
---
<!-- markdownlint-disable MD033 -->
<!-- markdownlint-disable MD024 -->
# What is Azure Form Recognizer?

Azure Form Recognizer is an [Azure Applied AI Service](../../applied-ai-services/index.yml) that enables you to build automated document processing software using machine learning technology. Form Recognizer analyzes your forms and documents, extracts text and data, maps field relationships as key-value pairs, and returns a structured JSON output. You quickly get accurate results that are tailored to your specific content without excessive manual intervention or extensive data science expertise. Use Form Recognizer to automate your data processing in applications and workflows, enhance data-driven strategies, and enrich document search capabilities.

Form Recognizer easily identifies, extracts, and analyzes the following document data:

* Table structure and content.
* Form elements and field values.
* Typed and handwritten alphanumeric text.
* Relationships between elements.
* Key/value pairs
* Element location with bounding box coordinates.

This documentation contains the following article types:

* [**Concepts**](concept-layout.md) provide in-depth explanations of the service functionality and features.
* [**Quickstarts**](quickstarts/try-sdk-rest-api.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](build-training-data-set.md) contain instructions for using the service in more specific or customized ways.
* [**Tutorials**](tutorial-ai-builder.md) are longer guides that show you how to use the service as a component in broader business solutions.

## Form Recognizer features and development options

### [Form Recognizer v2.1](#tab/v2-1)

The following features are supported by the Form Recognizer service v2.1. Use the links in the table to learn more about each feature and browse the API references.

| Feature | Description | Development options <img width=300/>|
|----------|--------------|-------------------------|
|[**Layout API**](concept-layout.md) | Extraction and analysis of text, selection marks, and table structures,  along with their bounding box coordinates, from forms and documents. | <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/layout-analyze)</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-layout)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?branch=main&tabs=layout#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Business card model**](concept-prebuilt.md#business-card) | Automated data processing and extraction of key information from business cards.| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-business-cards)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=business-card#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**ID document model**](concept-prebuilt.md#id-document) | Automated data processing and extraction of key information from US driver's licenses and international passports.| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-identity-id-documents)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=id-document#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Invoice model**](concept-prebuilt.md#invoice) | Automated data processing and extraction of key information from sales invoices. | <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-invoices)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=invoice#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Receipt model**](concept-prebuilt.md#receipt) | Automated data processing and extraction of key information from sales receipts.| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-receipts)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=receipt#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Custom model**](concept-prebuilt.md#business-card) | Extraction and analysis of data from forms and documents specific to distinct business data and use cases.| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net)</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-forms-with-a-custom-model)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=custom#run-the-container-with-the-docker-compose-up-command)</li></ul>|

### [Form Recognizer v3.0](#tab/v3-0)

The following features  and development options are supported by the Form Recognizer service v3.0. Use the links in the table to learn more about each feature and browse the API references.

| Feature | Description | Development options<img width=300/> |
|----------|--------------|-------------------------|
|[🆕 **General document model**](concept-v3-prebuilt.md#general-document)|Extract text, tables, structure, key-value pairs and named entities.|<ul ><li>[**Form Recognizer Studio**]()</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-layout)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li></ul> |
|[**Layout model**](concept-layout.md) | Extract text, selection marks, and tables structures, along with their bounding box coordinates, from forms and documents.</br></br> Layout API has been updated to a prebuilt model. | <ul><li>[**Form Recognizer Studio**]()</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-layout)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li></ul>|
|[**Custom model (updated)**](concept-v3-prebuilt.md#custom-model) | Extraction and analysis of data from forms and documents specific to distinct business data and use cases.</br></br>Custom model API v3.0 supports **signature detection for custom forms**.</li></ul>| <ul><li>[**Form Recognizer Studio**](https://fott-2-1.azurewebsites.net)</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-forms-with-a-custom-model)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li></ul>|
|[**Receipt model (updated)**](concept-v3-prebuilt.md#receipt) | Automated data processing and extraction of key information from sales receipts.</br></br>Prebuilt receipt API v3.0 supports processing of **single-page hotel receipts**.| <ul><li>[**Form Recognizer Studio**]()</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-receipts)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li></ul>|
|[**ID document model (updated)**](concept-v3-prebuilt.md#id-document) |Automated data processing and extraction of key information from US driver's licenses and international passports.</br></br>Prebuilt ID document API suports the **extraction of endorsements, restrictions, and vehicle classifications from US driver's licenses**. |<ul><li> [**Form Recognizer Studio**]()</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-identity-id-documents)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li></ul>|
|[**Invoice model**](concept-prebuilt.md#invoice) | Automated data processing and extraction of key information from sales invoices. | <ul><li>[**Form Recognizer Studio**]()</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-invoices)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li></ul>|
|[**Business card model**](concept-prebuilt.md#business-card) |Automated data processing and extraction of key information from business cards.| <ul><li>[**Form Recognizer Studio**]()</li><li>[**REST API**](quickstarts/try-sdk-rest-api.md?pivots=programming-language-rest-api#analyze-business-cards)</li><li>[**Client-library SDK**](quickstarts/try-sdk-rest-api.md)</li></ul>|

---

## Prerequisites

* You'll need an Azure subscription—[**create one for free**](https://azure.microsoft.com/free/cognitive-services).

* Once you have your subscription, create a [**Form Recognizer resource**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

* Finally, you'll need to retrieve your resource **endpoint URL** and **API key** from the Azure portal to try out the Form Recognizer service:

  :::image type="content" source="media/containers/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint window in the Azure portal.":::

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## REST API workflows

| Document type | Considerations | Solution<img width=300/> |
| -----------------|-------------------| ----------|
|<ul><li>**Identity document**</li></ul>| Is your document a US driver's license or an international passport?| <ul><li>Yes → [Use **Prebuilt identity document model**](concept-prebuilt.md#id-document)</li><li>No → [Use **Prebuilt layout**](concept-layout.md) </li></ul>|
|<ul><li>**Invoice**</li><li>**Receipt**</li><li>**Business card**</li></ul>| Is your document composed of English-text? | <ul><li>Yes → Use corresponding, [**Prebuilt Invoice**](concept-prebuilt.md#invoice), [**Prebuilt Receipt**](concept-prebuilt.md#receipt), or [**Prebuilt Business Card**](concept-prebuilt.md#business-card) models</li><li>No → [Use **Prebuilt layout**](concept-layout.md) </li></ul>|
|<ul><li>**Form**</li></ul>| Is your form an industry-standarsd format commonly used in your business or industry?| Yes → [Use **Prebuilt layout**](concept-prebuilt.md#id-document)</li><li>No → [Train and build a custom model**](concept-layout.md) 

## Data privacy and security

As with all the cognitive services, developers using the Form Recognizer service should be aware of Microsoft policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more. </br></br>

Form Recognizer doesn't store or process customer data outside the region where the customer deploys the service instance.

## Next steps

### [Form Recognizer v2.1](#tab/v2-1)

> [!div class="checklist"]
>
> * Try our [**Sample Labeling online tool**](https://aka.ms/fott-2.1-ga/)
> * Follow our [**client library / REST API quickstart**](./quickstarts/try-sdk-rest-api.md) to get started extracting data from your documents. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.
> * Explore the [**REST API reference documentation**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) to learn more. 
> If you're familiar with a previous version of the API, see the [**What's new**](./whats-new.md) article to learn about recent changes.

### [Form Recognizer v3.0](#tab/v3-0)

> [!div class="checklist"]
>
> * Try our [**Form Recognizer Studio**]()
> * Follow our [**Client library SDKs quickstart (preview)](quickstarts/try-v3-client-libraries-sdk.md) to get started extracting data from your documents. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.
> * Explore the [**REST API reference documentation**]() to learn more. 
> If you're familiar with a previous version of the API, see the [**What's new**](./whats-new.md) article to learn about recent changes.

---
