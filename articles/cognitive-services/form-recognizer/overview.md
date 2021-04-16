---
title: What is Form Recognizer?
titleSuffix: Azure Cognitive Services
description: The Azure Form Recognizer service allows you to identify and extract key/value pairs and table data from your form documents, as well as extract major information from sales receipts and business cards.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 03/15/2021
ms.author: lajanuar
ms.custom: cog-serv-seo-aug-2020
keywords: automated data processing, document processing, automated data entry, forms processing
#Customer intent: As a developer of form-processing software, I want to learn what the Form Recognizer service does so I can determine if I should use it.
---

# What is Form Recognizer?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

Azure Form Recognizer is a cognitive service that lets you build automated data processing software using machine learning technology. Identify and extract text, key/value pairs, selection marks, tables, and structure from your documents&mdash;the service outputs structured data that includes the relationships in the original file, bounding boxes, confidence and more. You quickly get accurate results that are tailored to your specific content without heavy manual intervention or extensive data science expertise. Use Form Recognizer to automate data entry in your applications and enrich your documents search capabilities.

Form Recognizer is composed of custom document processing models, prebuilt models for invoices, receipts, IDs and business cards, and the layout model. You can call Form Recognizer models by using a REST API or client library SDKs to reduce complexity and integrate it into your workflow or application.

This documentation contains the following article types:  

* [**Quickstarts**](quickstarts/client-library.md) are getting-started instructions to guide you through making requests to the service.  
* [**How-to guides**](build-training-data-set.md) contain instructions for using the service in more specific or customized ways.  
* [**Concepts**](concept-layout.md) provide in-depth explanations of the service functionality and features.  
* [**Tutorials**](tutorial-bulk-processing.md) are longer guides that show you how to use the service as a component in broader business solutions.  

## Form Recognizer features

With Form Recognizer, you can easily extract and analyze form data with these features:

* **[Layout API](#layout-api)** - Extract text, selection marks, and tables structures, along with their bounding box coordinates, from documents.
* **[Custom models](#custom-models)** - Extract text, key/value pairs, selection marks, and table data from forms. These models are trained with your own data, so they're tailored to your forms.

* **[Prebuilt models](#prebuilt-models)** - Extract data from unique document types using prebuilt models. Currently available are the following prebuilt models

  * [Invoices](./concept-invoices.md)
  * [Sales receipts](./concept-receipts.md)
  * [Business cards](./concept-business-cards.md)
  * [Identification (ID) cards](./concept-identification-cards.md)


## Get started

Use the Sample Form Recognizer Tool to try out Layout, Pre-built models and train a custom model for your documents. You will need an Azure subscription ([**create one for free**](https://azure.microsoft.com/free/cognitive-services)) and a [**Form Recognizer resource**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) endpoint and key to try out the Form Recognizer service.

### [v2.1 preview](#tab/v2-1)

> [!div class="nextstepaction"]
> [Try Form Recognizer](https://fott-preview.azurewebsites.net/)

### [v2.0](#tab/v2-0)

> [!div class="nextstepaction"]
> [Try Form Recognizer](https://fott.azurewebsites.net/)

---
Follow the [Client library / REST API quickstart](./quickstarts/client-library.md) to get started extracting data from your documents. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

You can also use the REST samples (GitHub) to get started - 

* Extract text, selection marks, and table structure from documents
  * [Extract layout data - Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/rest/python-layout.md)
* Train custom models and extract form data
  * [Train without labels - Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/rest/python-train-extract.md)
  * [Train with labels - Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/rest/python-labeled-data.md)
* Extract data from invoices
  * [Extract invoice data - Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/rest/python-invoices.md)
* Extract data from sales receipts
  * [Extract receipt data - Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/rest/python-receipts.md)
* Extract data from business cards
  * [Extract business card data - Python](https://github.com/Azure-Samples/cognitive-services-quickstart-code/blob/master/python/FormRecognizer/rest/python-business-cards.md)

### Review the REST APIs

You'll use the following APIs to train models and extract structured data from forms.

|Name |Description |
|---|---|
| **Analyze Layout** | Analyze a document passed in as a stream to extract text, selection marks, tables, and structure from the document |
| **Train Custom Model**| Train a new model to analyze your forms by using five forms of the same type. Set the _useLabelFile_ parameter to `true` to train with manually labeled data. |
| **Analyze Form** |Analyze a form passed in as a stream to extract text, key/value pairs, and tables from the form with your custom model.  |
| **Analyze Invoice** | Analyze an invoice to extract key information, tables, and other invoice text.|
| **Analyze Receipt** | Analyze a receipt document to extract key information, and other receipt text.|
| **Analyze ID** | Analyze an ID card document to extract key information, and other identification card text.|
| **Analyze Business Card** | Analyze a business card to extract key information and text.|

### [v2.1 preview](#tab/v2-1)

Explore the [REST API reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1-preview-3/operations/AnalyzeWithCustomForm) to learn more. If you're familiar with a previous version of the API, see the [What's new](./whats-new.md) article to learn about recent changes.

### [v2.0](#tab/v2-0)

Explore the [REST API reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2/operations/AnalyzeLayoutAsync) to learn more. If you're familiar with a previous version of the API, see the [What's new](./whats-new.md) article to learn about recent changes.

---

## Layout API

Form Recognizer can extract text, selection marks, and table structure (the row and column numbers associated with the text) using high-definition optical character recognition (OCR) and an enhanced deep learning  model from documents. See the [Layout](./concept-layout.md) conceptual guide for more info.

:::image type="content" source="./media/tables-example.jpg" alt-text="tables example" lightbox="./media/tables-example.jpg":::

## Custom models

Form Recognizer custom models train to your own data, and you only need five sample input forms to start. A trained document processing model can output structured data that includes the relationships in the original form document. After you train the model, you can test and retrain it and eventually use it to reliably extract data from more forms according to your needs.

You have the following options when you train custom models: training with labeled data and without labeled data.

### Train without labels

Form Recognizer uses unsupervised learning to understand the layout and relationships between fields and entries in your forms. When you submit your input forms, the algorithm clusters the forms by type, discovers what keys and tables are present, and associates values to keys and entries to tables. Training without labels doesn't require manual data labeling or intensive coding and maintenance, and we recommend you try this method first.

See [Build a training data set](./build-training-data-set.md) for tips on how to collect your training documents.

### Train with labels

When you train with labeled data, the model uses supervised learning to extract values of interest, using the labeled forms you provide. Labeled data results in better-performing models and can produce models that work with complex forms or forms containing values without keys.

Form Recognizer uses the [Layout API](#layout-api) to learn the expected sizes and positions of printed and handwritten text elements and extract tables. Then it uses user-specified labels to learn the key/value associations and tables in the documents. We recommend that you use five manually labeled forms of the same type (same structure) to get started when training a new model and add more labeled data as needed to improve the model accuracy. Form Recognizer enables training a model to extract key value pairs and tables using supervised learning capabilities. 

[Get started with Train with labels](./quickstarts/label-tool.md)

> [!VIDEO https://channel9.msdn.com/Shows/Docs-Azure/Azure-Form-Recognizer/player]

## Prebuilt models

Form Recognizer also includes Prebuilt models for automated data processing of unique form types.

### Prebuilt Invoice model

The Prebuilt Invoice model extracts data from invoices in various formats and returns structured data. This model extracts key information such as the invoice ID, customer details, vendor details, ship to, bill to, total, tax, subtotal, line items and more. In addition, the prebuilt invoice model is trained to analyze and return all of the text and tables on the invoice. See the [Invoices](./concept-invoices.md) conceptual guide for more info.

:::image type="content" source="./media/overview-invoices.jpg" alt-text="sample invoice" lightbox="./media/overview-invoices.jpg":::

### Prebuilt Receipt model

The Prebuilt Receipt model is used for reading English sales receipts from Australia, Canada, Great Britain, India, and the United States&mdash;the type used by restaurants, gas stations, retail, and so on. This model extracts key information such as the time and date of the transaction, merchant information, amounts of taxes, line items, totals and more. In addition, the prebuilt receipt model is trained to analyze and return all of the text on a receipt. See the [Receipts](./concept-receipts.md) conceptual guide for more info.

:::image type="content" source="./media/overview-receipt.jpg" alt-text="sample receipt" lightbox="./media/overview-receipt.jpg":::

### Prebuilt Identification (ID) cards model

The Identification (ID) cards model enables you to extract key information from world-wide passports and US driver licenses. It extracts data such as the document ID, expiration date of birth, date of expiration, name, country, region, machine-readable zone and more. See the [Identification (ID) cards](./concept-identification-cards.md) conceptual guide for more info.

:::image type="content" source="./media/overview-id.jpg" alt-text="sample identification card" lightbox="./media/overview-id.jpg":::

### Prebuilt Business Cards model

The Business Cards model enables you to extract information such as the person's name, job title, address, email, company, and phone numbers from business cards in English. See the [Business cards](./concept-business-cards.md) conceptual guide for more info.

:::image type="content" source="./media/overview-business-card.jpg" alt-text="sample business card" lightbox="./media/overview-business-card.jpg":::

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Deploy on premises using Docker containers

[Use Form Recognizer containers (preview)](form-recognizer-container-howto.md) to deploy API features on-premises. This Docker container enables you to bring the service closer to your data for compliance, security, or other operational reasons.

## Service availability and redundancy

### Is Form Recognizer service zone-resilient?

Yes. The Form Recognizer service is zone-resilient by default.

### How do I configure the Form Recognizer service to be zone-resilient?

No customer configuration is necessary to enable zone-resiliency. Zone-resiliency for Form Recognizer resources is available by default and managed by the service itself.

## Data privacy and security

As with all the cognitive services, developers using the Form Recognizer service should be aware of Microsoft policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

Try our online tool and quickstart to learn more about the Form Recognizer service.

* [**Form Recognizer tool**](https://fott-preview.azurewebsites.net/)
* [**Client library and REST API quickstart**](quickstarts/client-library.md)
