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
keywords: automated data processing, document processing, automated data entry, forms processing
#Customer intent: As a developer of form-processing software, I want to learn what the Form Recognizer service does so I can determine if I should use it.
---

# What is Azure Form Recognizer? 

Azure Form Recognizer is an [Azure Applied AI Service](../../applied-ai-services/index.yml) that enables you to build automated document processing software using machine learning technology. You quickly get accurate results that are tailored to your specific content without excessive manual intervention or extensive data science expertise. Use Form Recognizer to automate your data processing in applications and workflows, enhance data-driven strategies, and enrich document search capabilities.

Form Recognizer easily identifies, extracts, and analyzes the following document data:

* Table structure and content.
* Form elements and field values.
* Typed and handwritten alphanumeric text.
* Relationships between elements.
* Key/value pairs
* Element location with bounding box coordinates.

This documentation contains the following article types:

* [**Concepts**](concept-layout.md) provide in-depth explanations of the service functionality and features.
* [**Quickstarts**](quickstarts/client-library.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](build-training-data-set.md) contain instructions for using the service in more specific or customized ways.
* [**Tutorials**](tutorial-ai-builder.md) are longer guides that show you how to use the service as a component in broader business solutions.

## Form Recognizer features and development options


### [Form Recognizer v2.1](#tab/v2.1)

The following features are supported by the Form Recognizer service v2.1. Use the links in the table to learn more about each feature and browse the API references.
| Feature | Description | Development options <img width=500/>|
|----------|--------------|-------------------------|
|[**Layout**](concept-layout.md) | Extraction and analysis of text, selection marks, and table structures,  along with their bounding box coordinates, from forms and documents. | <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/layout-analyze)</li><li>[**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#analyze-layout)</li><li>[**Client-library SDK**](quickstarts/client-library.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?branch=main&tabs=layout#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Prebuilt business card model**](concept-prebuilt.md#business-card) | Automated data processing and extraction of key information from business cards.| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#analyze-business-cards)</li><li>[**Client-library SDK**](quickstarts/client-library.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=business-card#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Prebuilt identity document model**](concept-prebuilt.md#identity-document) | Automated data processing and extraction of key information from US driver's licenses and international passports.| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#analyze-identity-id-documents)</li><li>[**Client-library SDK**](quickstarts/client-library.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=id-document#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Prebuilt invoice model**](concept-prebuilt.md#invoice) | Automated data processing and extraction of key information from sales invoices. | <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#analyze-invoices)</li><li>[**Client-library SDK**](quickstarts/client-library.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=invoice#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Prebuilt receipt model**](concept-prebuilt.md#receipt) | Automated data processing and extraction of key information from sales receipts.| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net/prebuilts-analyze)</li><li>[**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#analyze-receipts)</li><li>[**Client-library SDK**](quickstarts/client-library.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=receipt#run-the-container-with-the-docker-compose-up-command)</li></ul>|
|[**Custom model**](concept-prebuilt.md#business-card) | Extraction and analysis of data from forms and documents specific to distinct business data and use cases.| <ul><li>[**Form Recognizer labeling tool**](https://fott-2-1.azurewebsites.net)</li><li>[**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#analyze-forms-with-a-custom-model)</li><li>[**Client-library SDK**](quickstarts/client-library.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=custom#run-the-container-with-the-docker-compose-up-command)</li></ul>|

### [Form Recognizer v3.0](#tab/v3.0)

The following features  and development options are supported by the Form Recognizer service v3.0. Use the links in the table to learn more about each feature and browse the API references.

| Feature | Description | Development options<img width=500/> |
|----------|--------------|-------------------------|
|[ 🆕**Prebuilt document**](concept-prebuilt.md#document)|extract text, tables, structure, key-value pairs and named entities.|<ul><li>[**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#analyze-layout)</li><li>[**Client-library SDK**](quickstarts/client-library.md)</li></ul>|
|[**Layout**](concept-layout.md) | Extraction and analysis of text, selection marks, and tables structures, along with their bounding box coordinates, from forms and documents. | <ul><li>[**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#analyze-layout)</li><li>[**Client-library SDK**](quickstarts/client-library.md)</li></ul>|
|[**Prebuilt business card model**](concept-prebuilt.md#business-card) | Automated data processing and extraction of key information from business cards.| <ul><li>[**Form Recognizer Studio**]()</li><li>[**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#analyze-business-cards)</li><li>[**Client-library SDK**](quickstarts/client-library.md)</li></ul>|
|[**Prebuilt identity document model**](concept-prebuilt.md#identity-document) | Automated data processing and extraction of key information from US driver's licenses and international passports.| <ul><li>[**Form Recognizer Studio**]()</li><li>[**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#analyze-identity-id-documents)</li><li>[**Client-library SDK**](quickstarts/client-library.md)</li></ul>|
|[**Prebuilt invoice model**](concept-prebuilt.md#invoice) | Automated data processing and extraction of key information from sales invoices. | <ul><li>[**Form Recognizer Studio**]()</li><li>[**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#analyze-invoices)</li><li>[**Client-library SDK**](quickstarts/client-library.md)</li></ul>|
|[**Prebuilt receipt model**](concept-prebuilt.md#receipt) | Automated data processing and extraction of key information from sales receipts.| <ul><li>[**Form Recognizer Studio**]()</li><li>[**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#analyze-receipts)</li><li>[**Client-library SDK**](quickstarts/client-library.md)</li></ul>|
|[**Custom model**](concept-prebuilt.md#business-card) | Extraction and analysis of data from forms and documents specific to distinct business data and use cases.| <ul><li>[**Form Recognizer Studio**](https://fott-2-1.azurewebsites.net)</li><li>[**REST API**](quickstarts/client-library.md?pivots=programming-language-rest-api#analyze-forms-with-a-custom-model)</li><li>[**Client-library SDK**](quickstarts/client-library.md)</li><li>[**Form Recognizer Docker container**](containers/form-recognizer-container-install-run.md?tabs=custom#run-the-container-with-the-docker-compose-up-command)</li></ul>|
---


## Prerequisites

* You'll need an Azure subscription— [**create one for free**](https://azure.microsoft.com/free/cognitive-services).

* Once you have your subscription, create a [**Form Recognizer resource**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) in the Azure portal. You can use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.

* Finally, you'll need to retrieve your resource **endpoint URL** and **API key** from the Azure portal to try out the Form Recognizer service:

:::image type="content" source="media/keys-and-endpoint.png" alt-text="Screenshot: keys and endpoint window in the Azure portal.":::

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Best practice

1. Your document format must be JPG, PNG, TIFF, or PDF (text or scanned). Text-embedded PDFs are best because there's no possibility of error in character extraction and location.

1. If your document is a US driver's license or an international passport, start with the **identity document prebuilt model**. If not, start with the Layout API.

1. If your document is an English-text **invoice, receipt, or business card**, start with the corresponding prebuilt model. If not, start with the Layout API. *See* [language support](language-support.md)

1. If your document or form is one commonly used in business and industry, start wit the Layout API. If you need to further refine your results, add additional field data with the [Form Recognizer labeling tool](https://fott-2-1.azurewebsites.net/) or [train a custom model](label-tool.md). 

1. If your form or document is unique and/or specific to your business, [train a custom model](quickstarts/get-started-with-form-recognizer.md#train-a-custom-form-model), start by [building a training data set]build-training-data-set.md) and [training a custom model](quickstarts/client-library.md?pivots=programming-language-rest-api#train-a-custom-model) with unlabeled data to see if the desired results or returned or train your model with labeled data.

The diagram below maps document processing best practice workflows:

  :::image type="content" source="media/form-recognizer-decision-tree.png" alt-text="Decision tree diagram.":::

## Data privacy and security

* As with all the cognitive services, developers using the Form Recognizer service should be aware of Microsoft policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

* Form Recognizer doesn't store or process customer data outside the region where the customer deploys the service instance.

## Next steps

* Try our online tool and quickstart to learn more about the Form Recognizer service.

  > [!div class="nextstepaction"]
  > [Try Form Recognizer](https://aka.ms/fott-2.1-ga/)
  >

* Follow the [client library / REST API quickstart](./quickstarts/client-library.md) to get started extracting data from your documents. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

* Explore the [REST API reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) to learn more. If you're familiar with a previous version of the API, see the [What's new](./whats-new.md) article to learn about recent changes.
