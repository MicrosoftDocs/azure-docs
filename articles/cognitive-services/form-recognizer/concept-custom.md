---
title: Custom Models - Form Recognizer
titleSuffix: Azure Cognitive Services
description: Learn concepts related to Form Recognizer API custom models- usage and limits.
services: cognitive-services
author: laujan
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 03/15/2021
ms.author: lajanuar
---

# Form Recognizer custom models

Form Recognizer uses model-based machine learning technology to analyze and extract data from your documents. A Form Recognizer model is a representation of extracted data that is used as a reference for analyzing your specific content. There are two types of Form recognizer models:

* **Prebuilt models**. Form Recognizer currently supports prebuilt models for receipts, business cards, and invoices. Prebuilt models detect and extract information from document images and return the extracted data in a structured JSON output.

* **Custom models**. A Form Recognizer custom model represents extracted data that is specific to your business. Custom models must be trained to analyze your distinct data.

## Assemble your training dataset

 Building a custom model begins with establishing your training dataset. You'll need a minimum of five completed forms of the same type for your sample dataset. Your forms can be of different file types but must be of the same type of document and follow the input requirements for Form Recognizer. *See* [Custom model input requirements](build-training-data-set.md#custom-model-input-requirements).

 Custom models use the [Layout API]((concept-layout#try-it-out) ) to analyze data and structure from documents. The Layout API uses [Optical Character Recognition (OCR)](../computer-vision/concept-recognizing-text) to extract information from varied documents and return a structured data representation.

Your custom model can be trained with or without labeled datasets. Unlabeled datasets rely solely on the Layout API to detect and identify key information without added human input. Labeled datasets also rely on the Layout API, but supplementary human input is included such as your specific labels and field locations. If you want to use both labeled and unlabeled documents, you must start with at least five complete documents of the same type for the labeled training data and then add unlabeled documents to the required data set.

## Build and use your custom model

At a high level, the steps for building training, and using your custom model are as follows:

> [!div class="nextstepaction"]
> [1. Upload your training data](build-training-data-set.md#upload-your-training-data)  

You'll upload your training data to an Azure blob storage container.  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&#129155;

> [!div class="nextstepaction"]
> [2. Train your custom model](quickstarts/client-library.md#train-a-custom-model)  

You can train your model [with](quickstarts/client-library.md#train-a-model-with-labels) or [without](quickstarts/client-library.md#train-a-model-without-labels) labels.  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&#129155;

>[!div class="nextstepaction"]
> [3. Analyze documents with your custom model](quickstarts/client-library.md#analyze-forms-with-a-custom-model)  

Once your model is trained, you can test  and refine to ensure it meets your expectations.  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&#129155;

> [!div class="nextstepaction"]
> [4. Manage your custom models](quickstarts/client-library.md#manage-custom-models)  

You can view, retrieve, or delete your custom models at any time.

## Next steps

View our API documentation to learn more about Form Recognizer:

**[Form Recognizer API](https://westcentralus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1-preview-2/operations/5ed8c9843c2794cbb1a96291)**

>
