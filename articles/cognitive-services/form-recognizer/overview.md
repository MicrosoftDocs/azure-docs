---
title: What is Azure Form Recognizer?
titleSuffix: Azure Applied AI Services
description: The Azure Form Recognizer service allows you to identify and extract key/value pairs and table data from your form documents, as well as extract major information from sales receipts and business cards.
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: overview
ms.date: 03/15/2021
ms.author: lajanuar
ms.custom: cog-serv-seo-aug-2020
keywords: automated data processing, document processing, automated data entry, forms processing
#Customer intent: As a developer of form-processing software, I want to learn what the Form Recognizer service does so I can determine if I should use it.
---

# What is Azure Form Recognizer?

[!INCLUDE [TLS 1.2 enforcement](../../../includes/cognitive-services-tls-announcement.md)]

Azure Form Recognizer is a part of [Azure Applied AI Services](../../applied-ai-services/index.yml) that lets you build automated data processing software using machine learning technology. Identify and extract text, key/value pairs, selection marks, tables, and structure from your documents&mdash;the service outputs structured data that includes the relationships in the original file, bounding boxes, confidence and more. You quickly get accurate results that are tailored to your specific content without heavy manual intervention or extensive data science expertise. Use Form Recognizer to automate data entry in your applications and enrich your documents search capabilities.

Form Recognizer is composed of custom document processing models, prebuilt models for invoices, receipts, IDs and business cards, and the layout model. You can call Form Recognizer models by using a REST API or client library SDKs to reduce complexity and integrate it into your workflow or application.

This documentation contains the following article types:

* [**Concepts**](concept-layout.md) provide in-depth explanations of the service functionality and features.
* [**Quickstarts**](quickstarts/client-library.md) are getting-started instructions to guide you through making requests to the service.
* [**How-to guides**](build-training-data-set.md) contain instructions for using the service in more specific or customized ways.
* [**Tutorials**](tutorial-ai-builder.md) are longer guides that show you how to use the service as a component in broader business solutions.

## Form Recognizer features

With Form Recognizer, you can easily extract and analyze document data with these features:

### [Layout](concept-layout.md)

Extract text, selection marks, and tables structures, along with their bounding box coordinates, from documents.

Form Recognizer can extract text, selection marks, and table structure (the row and column numbers associated with the text) using high-definition optical character recognition (OCR) and an enhanced deep learning  model from documents.

:::image type="content" source="./media/tables-example.jpg" alt-text="tables example" lightbox="./media/tables-example.jpg":::

### [Custom models](concept-custom.md)

Extract text, key/value pairs, selection marks, and table data from forms. These models are trained with your own data, so they're tailored to your forms.

Form Recognizer custom models train to your own data, and you only need five sample input forms to start. A trained document processing model can output structured data that includes the relationships in the original form document. After you train the model, you can test and retrain it and eventually use it to reliably extract data from more forms according to your needs.

You have the following options when you train custom models: training with labeled data and without labeled data.

#### Train without labels

Form Recognizer uses unsupervised learning to understand the layout and relationships between fields and entries in your forms. When you submit your input forms, the algorithm clusters the forms by type, discovers what keys and tables are present, and associates values to keys and entries to tables. Training without labels doesn't require manual data labeling or intensive coding and maintenance, and we recommend you try this method first.

See [Build a training data set](./build-training-data-set.md) for tips on how to collect your training documents.

#### Train with labels

When you train with labeled data, the model uses supervised learning to extract values of interest, using the labeled forms you provide. Labeled data results in better-performing models and can produce models that work with complex forms or forms containing values without keys.

Form Recognizer uses the [Layout](#layout) API to learn the expected sizes and positions of printed and handwritten text elements and extract tables. Then it uses user-specified labels to learn the key/value associations and tables in the documents. We recommend that you use five manually labeled forms of the same type (same structure) to get started when training a new model and add more labeled data as needed to improve the model accuracy. Form Recognizer enables training a model to extract key value pairs and tables using supervised learning capabilities.

[Get started with Train with labels](label-tool.md)

> [!VIDEO https://channel9.msdn.com/Shows/Docs-Azure/Azure-Form-Recognizer/player]


### Prebuilt models

 Form Recognizer also includes Prebuilt models for automated data processing of receipts, business cards, invoices, and identity documents.

### [Receipts](concept-receipts.md)

The Prebuilt Receipt model is used for reading English sales receipts from Australia, Canada, Great Britain, India, and the United States&mdash;the type used by restaurants, gas stations, retail, and so on. This model extracts key information such as the time and date of the transaction, merchant information, amounts of taxes, line items, totals and more. In addition, the prebuilt receipt model is trained to analyze and return all of the text on a receipt.

:::image type="content" source="./media/overview-receipt.jpg" alt-text="sample receipt" lightbox="./media/overview-receipt.jpg":::

### [Business cards](concept-business-cards.md)

The Business Cards model enables you to extract information such as the person's name, job title, address, email, company, and phone numbers from business cards in English.

:::image type="content" source="./media/overview-business-card.jpg" alt-text="sample business card" lightbox="./media/overview-business-card.jpg":::

### [Invoices](concept-invoices.md)

The Prebuilt Invoice model extracts data from invoices in various formats and returns structured data. This model extracts key information such as the invoice ID, customer details, vendor details, ship to, bill to, total, tax, subtotal, line items and more. In addition, the prebuilt invoice model is trained to analyze and return all of the text and tables on the invoice.

:::image type="content" source="./media/overview-invoices.jpg" alt-text="sample invoice" lightbox="./media/overview-invoices.jpg":::

### [Identity documents](concept-identification-cards.md)

The Identity documents  (ID) model enables you to extract key information from world-wide passports and US driver licenses. It extracts data such as the document ID, expiration date of birth, date of expiration, name, country, region, machine-readable zone and more.

:::image type="content" source="./media/id-example-drivers-license.jpg" alt-text="sample identification card" lightbox="./media/overview-id.jpg":::

## Get started

Use the Sample Form Recognizer Tool to try out Layout, Pre-built models and train a custom model for your documents. You will need an Azure subscription ([**create one for free**](https://azure.microsoft.com/free/cognitive-services)) and a [**Form Recognizer resource**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) endpoint and key to try out the Form Recognizer service.

>
> [!div class="nextstepaction"]
> [Try Form Recognizer](https://aka.ms/fott-2.1-ga/)
>

Follow the [client library / REST API quickstart](./quickstarts/client-library.md) to get started extracting data from your documents. We recommend that you use the free service when you're learning the technology. Remember that the number of free pages is limited to 500 per month.

Explore the [REST API reference documentation](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) to learn more. If you're familiar with a previous version of the API, see the [What's new](./whats-new.md) article to learn about recent changes.

## Input requirements

[!INCLUDE [input requirements](./includes/input-requirements.md)]

## Service availability and redundancy

### Is Form Recognizer service zone-resilient?

Yes. The Form Recognizer service is zone-resilient by default.

### How do I configure the Form Recognizer service to be zone-resilient?

No customer configuration is necessary to enable zone-resiliency. Zone-resiliency for Form Recognizer resources is available by default and managed by the service itself.

## Data privacy and security

* As with all the cognitive services, developers using the Form Recognizer service should be aware of Microsoft policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

* Form Recognizer doesn't store or process customer data outside the region where the customer deploys the service instance.

## Next steps

Try our online tool and quickstart to learn more about the Form Recognizer service.

* [**Form Recognizer tool**](https://aka.ms/fott-2.1-ga)
* [**Client library and REST API quickstart**](quickstarts/client-library.md)