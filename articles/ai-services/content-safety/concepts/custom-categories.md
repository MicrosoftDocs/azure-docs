---
title: "TBD in Azure AI Content Safety"
titleSuffix: Azure AI services
description: Learn about content TBDs and how you can use Azure AI Content Safety to handle them on your platform.
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

The Azure AI Content Safety Custom Category feature empowers users to create and manage their own content categories for enhanced moderation and filtering. This feature enables customers to define categories specific to their needs, provide sample data, train a custom machine learning model, and utilize it to classify new content according to the predefined categories.

The Azure AI Content Safety Custom Category feature is designed to provide a streamlined process for creating, training, and using custom content classification models. Here's an in-depth look at the underlying workflow:

## Types of analysis

| API      | Functionality   |
| :--------- | :------------ |
| Customized categories | Create, get, and delete a customized category or list all customized categories for further annotation task |

## How it works

The Azure AI Content Safety Custom Category feature is designed to provide a streamlined process for creating, training, and using custom content classification models. Here's an in-depth look at the underlying workflow:

#### Step 1: Definition and Setup
 
When you define a custom category, you are essentially instructing the AI on what type of content you want to identify. This involves providing a clear **category name** and a detailed **definition** that encapsulates the content's characteristics. The setup phase is crucial, as it lays the groundwork for the AI to understand your specific moderation needs.

Then, collect a balanced dataset with both **positive** and (optional)**negative examples** allows the AI to learn the nuances of the category. This data should be representative of the variety of content that the model will encounter in a real-world scenario.

#### Step 2: Model Training
 
Once you have your dataset ready, the Azure AI Content Safety service uses it to train a new model. During training, the AI analyzes the data, learning to distinguish between content that matches the custom category and content that does not.

#### Step 3: Model Inferencing
 
After training, you need to evaluate the model to ensure it meets your accuracy requirements. This is done by testing the model with new content that it hasn't seen before. The evaluation phase helps you identify any potential adjustments needed before deploying the model into a production environment.

## Limitations - CC

### Language availability

AR:
Currently this API is only available in English. While users can try guidelines in other languages, we don't guarantee the output. We output the reasoning in the language of provided guidelines by default.

### Input limitations


## Limitations
| Object           | Limitation   |
| ---------------- | ------------ |
| Support language | English only |
|     Number of categories per user     |         5     |
|         Number of category version per category   |        5      |
|       Number of concurrent build (process) per category      |       1       |
|       Inference RPS           |    10          |
|        Customized category number in one text analyze request          |       5       |
|        Number of samples for a category version          |        At least 50, at most 10K (no dupilicated samples allowed)      |
|       Sample file           |     At most 128000 bytes         |
|       Length of a sample           |           125K characters   |
|        Length of deinition          |         1000 characters     |
|       Length of category name           |          128 characters    |
|           Length of blob url       |          at most 500 characters    |



### Regions


## Next steps

Follow the how-to guide to create custom categories in Azure AI Content Safety.

* [Use custom category API](../how-to/custom-category.md)


