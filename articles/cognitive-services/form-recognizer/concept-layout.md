---
title: Invoices - Form Recognizer
titleSuffix: Azure Cognitive Services
description: Learn concepts related to layout analysis with the Form Recognizer API - usage and limits.
services: cognitive-services
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 11/02/2020
ms.author: pafarley
---

# Form Recognizer Layout Service

Azure Form Recognizer can extract text, tables, selection marks and strucutre information from documents using its Layout service. The Layout API enables customers to take document in a variety of formats and return structured data and represntation of the document. It combines our powerful [Optical Character Recognition (OCR)](https://docs.microsoft.com/azure/cognitive-services/computer-vision/concept-recognizing-text) capabilities with document understanding deep learning models to extract text, tables, selection marks and structure of documents. 

## What does the Layout service do?

The Layout API extracts text, tables, selection marks and strucutre information from documents with exceptional accuracy and returns them in an organized structured JSON response. Documents can be from a variety of formats and quality, including  phone-captured images, scanned documents, and digital PDFs. The Layout API will extract the structured output from all of these documents. 

<<<<add image of a document with tables, handwritten and printed, seleciton marks into JSON outpt>>>>

## Try it out

To try out the Form Recognizer Layout Service, go to the online Sample Tool:

> [!div class="nextstepaction"]
> [Try Prebuilt Models](https://fott-preview.azurewebsites.net/)

You will need an Azure subscription ([create one for free](https://azure.microsoft.com/free/cognitive-services)) and a [Form Recognzier resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesFormRecognizer) endpoint and key to try out the Form Recognizer Invoice service. 

![Analayzed Layout example](./media/analyze-layout.png)




