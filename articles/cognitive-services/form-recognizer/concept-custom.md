---
title: Custom models - Form Recognizer
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

Form Recognizer uses advanced machine learning technology to analyze and extract data from your forms and documents. A Form Recognizer model is a representation of extracted data that is used as a reference for analyzing your specific content. There are two types of Form recognizer models:

* **Custom models**. Form Recognizer custom models represent extracted data from _forms_ specific to your business. Custom models must be trained to analyze your distinct form data.

* **Prebuilt models**. Form Recognizer currently supports prebuilt models for _receipts, business cards, identification cards_, and _invoices_. Prebuilt models detect and extract information from document images and return the extracted data in a structured JSON output.

## What does a custom model do?

With Form Recognizer, you can train a model that will extract information from forms that are relevant for your use case. You only need five examples of the same form type to get started. Your custom model can be trained with or without labeled datasets.

## Create, use, and manage your custom model

At a high level, the steps for building, training, and using your custom model are as follows:

> [!div class="nextstepaction"]
> [1. Assemble your training dataset](build-training-data-set.md#custom-model-input-requirements)

Building a custom model begins with establishing your training dataset. You'll need a minimum of five completed forms of the same type for your sample dataset. They can be of different file types and contain both text and handwriting. Your forms must be of the same type of document and follow the [input requirements](build-training-data-set.md#custom-model-input-requirements) for Form Recognizer.  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&#129155;

> [!div class="nextstepaction"]
> [2. Upload your training dataset](build-training-data-set.md#upload-your-training-data)

You'll need to upload your training data to an Azure blob storage container. If you don't know how to create an Azure storage account with a container, *see* [Azure Storage quickstart for Azure portal](../../storage/blobs/storage-quickstart-blobs-portal.md). Use the free pricing tier (F0) to try the service, and upgrade later to a paid tier for production.  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&#129155;
> [!div class="nextstepaction"]
> [3. Train your custom model](quickstarts/client-library.md#train-a-custom-model)

You can train your model [without](quickstarts/client-library.md#train-a-model-without-labels) or [with](quickstarts/client-library.md#train-a-model-with-labels) labeled data sets. Unlabeled datasets rely solely on the Layout API to detect and identify key information without added human input. Labeled datasets also rely on the Layout API, but supplementary human input is included such as your specific labels and field locations. To use both labeled and unlabeled data, start with at least five completed forms of the same type for the labeled training data and then add unlabeled data to the required data set.  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&#129155;  

>[!div class="nextstepaction"]
> [4. Analyze documents with your custom model](quickstarts/client-library.md#analyze-forms-with-a-custom-model)

Test your newly trained model by using a form that wasn't part of the training dataset. You can continue to do further training to improve the performance of your custom model.  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&#129155;

> [!div class="nextstepaction"]
> [5. Manage your custom models](quickstarts/client-library.md#manage-custom-models)

At any time, you can view a list of all the custom models under your subscription, retrieve information about a specific custom model, or delete a custom model from your account.

## Next steps

View **[Form Recognizer API reference](https://westcentralus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1-preview-3/operations/5ed8c9843c2794cbb1a96291)** documentation to learn more.
>
