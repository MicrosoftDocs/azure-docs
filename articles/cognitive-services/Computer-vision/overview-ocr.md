---
title: What is Optical character recognition?
titleSuffix: Azure Cognitive Services
description: The optical character recognition (OCR) service extracts visible text in an image and returns it as structured strings.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: computer-vision
ms.topic: overview
ms.date: 09/23/2022
ms.author: pafarley
ms.custom: seodec18, devx-track-csharp, ignite-2022
---

# What is Optical character recognition?

Optical character recognition (OCR) allows you to extract printed or handwritten text from images, such as posters, street signs and product labels, as well as from documents like articles, reports, forms, and invoices. Microsoft's **Read** OCR technology is built on top of multiple deep learning models supported by universal script-based models for global language support. This allows them to extract printed and handwritten text in [several languages](./language-support.md), including mixed languages and writing styles. **Read** is available as cloud service and on-premises container for deployment flexibility. With the latest preview, it's also available as a synchronous API for single, non-document, image-only scenarios with performance enhancements that make it easier to implement OCR-assisted user experiences.

## How is OCR related to intelligent document processing (IDP)?

OCR typically refers to the foundational technology focusing on extracting text while delegating the extraction of structure, relationships, key-values, entities, and other document-centric insights to intelligent document processing service like [Form Recognizer](../../applied-ai-services/form-recognizer/overview.md). Form Recognizer includes a document-optimized version of **Read** as its OCR engine while delegating to other models for higher-end insights. If you are extracting text from scanned and digital documents, use [Form Recognizer Read OCR](../../applied-ai-services/form-recognizer/concept-read.md).

[!INCLUDE [read-editions](includes/read-editions.md)]

## Start with Vision Studio

Try out OCR by using Vision Studio.

> [!div class="nextstepaction"]
> [Try Vision Studio](https://portal.vision.cognitive.azure.com/)

:::image type="content" source="Images/vision-studio-ocr-demo.png" alt-text="Screenshot: Read OCR demo in Vision Studio.":::

## Supported languages

Both **Read** versions available today in Computer Vision support several languages for printed and handwritten text. OCR for printed text includes support for English, French, German, Italian, Portuguese, Spanish, Chinese, Japanese, Korean, Russian, Arabic, Hindi, and other international languages that use Latin, Cyrillic, Arabic, and Devanagari scripts. OCR for handwritten text includes support for English, Chinese Simplified, French, German, Italian, Japanese, Korean, Portuguese, and Spanish languages.

Refer to the full list of [OCR-supported languages](./language-support.md#optical-character-recognition-ocr).

## Read OCR common features

The Read OCR model is available in Computer Vision and Form Recognizer with common baseline capabilities while optimizing for respective scenarios. The following list summarizes the common features:

* Printed and handwritten text extraction in supported languages
* Pages, text lines and words with location and confidence scores
* Support for mixed languages, mixed mode (print and handwritten)
* Available as Distroless Docker container for on-premises deployment

## Use the cloud APIs or deploy on-premises

The cloud APIs are the preferred option for most customers because of their ease of integration and fast productivity out of the box. Azure and the Computer Vision service handle scale, performance, data security, and compliance needs while you focus on meeting your customers' needs.

For on-premises deployment, the [Read Docker container (preview)](./computer-vision-how-to-install-containers.md) enables you to deploy the Computer Vision v3.2 generally available OCR capabilities in your own local environment. Containers are great for specific security and data governance requirements.

> [!WARNING]
> The Computer Vision [ocr](https://westus.dev.cognitive.microsoft.com/docs/services/computer-vision-v3-2/operations/56f91f2e778daf14a499f20d) and [RecognizeText](https://westus.dev.cognitive.microsoft.com/docs/services/5cd27ec07268f6c679a3e641/operations/587f2c6a1540550560080311) operations are no longer supported and should not be used.

## Data privacy and security

As with all of the Cognitive Services, developers using the Computer Vision service should be aware of Microsoft's policies on customer data. See the [Cognitive Services page](https://www.microsoft.com/trustcenter/cloudservices/cognitiveservices) on the Microsoft Trust Center to learn more.

## Next steps

- For general (non-document) images, try the [Computer Vision 4.0 preview Image Analysis REST API quickstart](./concept-ocr.md).
- For PDF, Office and HTML documents and document images, start with [Form Recognizer Read](../../applied-ai-services/form-recognizer/concept-read.md).
- Looking for the previous GA version? Refer to the [Computer Vision 3.2 GA SDK or REST API quickstarts](./quickstarts-sdk/client-library.md).
