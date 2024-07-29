---
title: "Custom categories in Azure AI Content Safety"
titleSuffix: Azure AI services
description: Learn about custom content categories and the different ways you can use Azure AI Content Safety to handle them on your platform.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2024
ms.topic: conceptual
ms.date: 07/05/2024
ms.author: pafarley
---

# Custom categories 

Azure AI Content Safety lets you create and manage your own content moderation categories for enhanced moderation and filtering that matches your specific policies or use cases.

## Types of customization

There are multiple ways to define and use custom categories, which are detailed and compared in this section.

| API        | Functionality   |
| :--------- | :------------ |
| [Custom categories (standard) API](#custom-categories-standard-api) | Use a customizable machine learning model to create, get, query, and delete a customized category. Or, list all your customized categories for further annotation tasks. |
| [Custom categories (rapid) API](#custom-categories-rapid-api) | Use a large language model (LLM) to quickly learn specific content patterns in emerging content incidents. |

### Custom categories (standard) API

The Custom categories (standard) API enables customers to define categories specific to their needs, provide sample data, train a custom machine learning model, and use it to classify new content according to the learned categories. 

This is the standard workflow for customization with machine learning models. Depending on the training data quality, it can reach very good performance levels, but it can take up to several hours to train the model.

This implementation works on text content, not image content.

### Custom categories (rapid) API

The Custom categories (rapid) API is designed to be quicker and more flexible than the standard method. It's meant to be used for identifying, analyzing, containing, eradicating, and recovering from cyber incidents that involve inappropriate or harmful content on online platforms. 

An incident may involve a set of emerging content patterns (text, image, or other modalities) that violate Microsoft community guidelines or the customers' own policies and expectations. These incidents need to be mitigated quickly and accurately to avoid potential live site issues or harm to users and communities. 

This implementation works on text content and image content.

> [!TIP]
> One way to deal with emerging content incidents is to use [Blocklists](/azure/ai-services/content-safety/how-to/use-blocklist), but that only allows exact text matching and no image matching. The Custom categories (rapid) API offers the following advanced capabilities:
- semantic text matching using embedding search with a lightweight classifier
- image matching with a lightweight object-tracking model and embedding search.


## How it works

#### [Custom categories (standard) API](#tab/standard)

The Azure AI Content Safety custom category feature uses a multi-step process for creating, training, and using custom content classification models. Here's a look at the workflow:

### Step 1: Definition and setup
 
When you define a custom category, you need to teach the AI what type of content you want to identify. This involves providing a clear **category name** and a detailed **definition** that encapsulates the content's characteristics.

Then, you collect a balanced dataset with **positive** and (optionally) **negative** examples to help the AI to learn the nuances of your category. This data should be representative of the variety of content that the model will encounter in a real-world scenario.

### Step 2: Model training
 
After you prepare your dataset and define categories, the Azure AI Content Safety service trains a new machine learning model. This model uses your definitions and uploaded dataset to perform data augmentation using a large language model. As a result, the training dataset is made larger and of higher quality. During training, the AI model analyzes the data and learns to differentiate between content that aligns with the specified category and content that does not.

### Step 3: Model inferencing
 
After training, you need to evaluate the model to ensure it meets your accuracy requirements. Test the model with new content that it hasn't received before. The evaluation phase helps you identify any potential adjustments you need to make deploying the model into a production environment.

### Step 4: Model usage

You use the **analyzeCustomCategory** API to analyze text content and determine whether it matches the custom category you've defined. The service will return a Boolean indicating whether the content aligns with the specified category

#### [Custom categories (rapid) API](#tab/rapid)

To use the custom category (rapid) API, you first create an **incident** object with a text description. Then, you upload any number of image or text samples to the incident. The LLM on the backend will then use these to evaluate future input content. No training step is needed.

You can include your defined incident in a regular text analysis or image analysis request. The service will indicate whether the submitted content is an instance of your incident. The service can still do other content moderation tasks in the same API call.

---

## Limitations

### Language availability

The Custom categories APIs support all languages that are supported by Content Safety text moderation. See [Language support](/azure/ai-services/content-safety/language-support).

### Input limitations

#### [Custom categories (standard) API](#tab/standard)


See the following table for the input limitations of the custom categories (standard) API:

| Object           | Limitation   |
| ---------------- | ------------ |
| Supported languages | English only |
|  Number of categories per user     |         3     |
|  Number of versions per category   |        3      |
|  Number of concurrent builds (processes) per category      |       1       |
|  Inference operations per second           |    5         |
|  Number of samples in a category version          |        Positive samples(required): minimum 50, maximum 5K<br>In total (both negative and positive samples): 10K<br>No duplicate samples allowed.      |
| Sample file size       |     maximum 128000 bytes         |
| Length of a text sample           |          maximum 125K characters   |
| Length of a category definition          |       maximum 1000 chars     |
|Length of a category name           |         maximum 128 characters    |
|Length of a blob url       |          maximum 500 characters    |

#### [Custom categories (rapid) API](#tab/rapid)

See the following table for the input limitations of the custom categories (rapid) API:

| Object     | Limitation      |
| :------------ | :----------- |
| Maximum length of an incident name | 100 characters | 
| Maximum number of text/image samples per incident | 1000 |
| Maximum size of each sample | Text: 500 characters<br>Image: 4 MB  |
| Maximum number of text or image incidents per resource| 100 |  
| Supported Image formats | BMP, GIF, JPEG, PNG, TIF, WEBP |

### Region availability

To use these APIs, you must create your Azure AI Content Safety resource in one of the supported regions. See [Region availability](../overview.md#region-availability).


## Next steps

Follow a how-to guide to use the Azure AI Content Safety APIs to create custom categories.

* [Use custom category (standard) API](../how-to/custom-categories.md)
* [Use the custom categories (rapid) API](../how-to/custom-categories-rapid.md)



