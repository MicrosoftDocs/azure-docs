---
title: "Custom categories in Azure AI Content Safety"
titleSuffix: Azure AI services
description: Learn about custom content categories and how you can use Azure AI Content Safety to handle them on your platform.
#services: cognitive-services
author: PatrickFarley
manager: nitinme
ms.service: azure-ai-content-safety
ms.custom: build-2024
ms.topic: conceptual
ms.date: 04/11/2024
ms.author: pafarley
---

# Custom categories 

The Azure AI Content Safety Custom Category feature lets you create and manage your own content categories for enhanced moderation and filtering. This feature enables customers to define categories specific to their needs, provide sample data, train a custom machine learning model, and use it to classify new content according to the predefined categories.

## Types of analysis

| API        | Functionality   |
| :--------- | :------------ |
| Customized categories | Create, get, and delete a customized category or list all customized categories for further annotation task |

## How it works

The Azure AI Content Safety Custom Category feature provides a streamlined process for creating, training, and using custom content classification models. Here's an in-depth look at the underlying workflow:

### Step 1: Definition and setup
 
When you define a custom category, you need to teach the AI what type of content you want to identify. This involves providing a clear **category name** and a detailed **definition** that encapsulates the content's characteristics.

Then, you collect a balanced dataset with **positive** and (optionally)**negative examples** to help the AI to learn the nuances of your category. This data should be representative of the variety of content that the model will encounter in a real-world scenario.

### Step 2: Model training
 
Once your dataset is ready, the Azure AI Content Safety service uses it to train a new model. During training, the AI analyzes the data and learns to distinguish between content that matches the category and content that doesn't.

### Step 3: Model inferencing
 
After training, you need to evaluate the model to ensure it meets your accuracy requirements. Test the model with new content that it hasn't received before. The evaluation phase helps you identify any potential adjustments you need to make deploying the model into a production environment.

## Limitations

### Input limitations

| Object           | Limitation   |
| ---------------- | ------------ |
| Supported languages | English only |
|     Number of categories per user     |         5     |
|         Number of versions per category   |        5      |
|       Number of concurrent builds (processes) per category      |       1       |
|       Inference operations per second           |    10          |
|        Number of custom categories in one text analyze request          |       5       |
|        Number of samples in a category version          |        minimum 50, maximum 10K (no dupilicate samples allowed)      |
|       Sample file size       |     maximum 128000 bytes         |
|       Length of a text sample           |          maximum 125K characters   |
|        Length of a category definition          |       maximum 1000 characters     |
|       Length of a category name           |         maximum 128 characters    |
|       Length of a blob url       |          maximum 500 characters    |



## Next steps

Follow the how-to guide to create custom categories in Azure AI Content Safety.

* [Use custom category API](../how-to/custom-category.md)


