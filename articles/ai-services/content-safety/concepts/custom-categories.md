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

## CC
The Azure AI Content Safety Custom Category feature empowers users to create and manage their own content categories for enhanced moderation and filtering. This feature enables customers to define categories specific to their needs, provide sample data, train a custom machine learning model, and utilize it to classify new content according to the predefined categories.

The Azure AI Content Safety Custom Category feature is designed to provide a streamlined process for creating, training, and using custom content classification models. Here's an in-depth look at the underlying workflow:

## AR

With their extensive capabilities of natural language understanding, GPT-4 models have reached human parity in understanding harmful content policies/community guidelines and performing harmful content annotation tasks that are adapted to each customer's use case. The adaptive annotation API in Azure AI Content Safety allows you to create customized categories based on your community guidelines and then annotate text according to those categories.

## Types of analysis

| API      | Functionality   |
| :--------- | :------------ |
| Customized Categories | Create, get, and delete a customized category or list all customized categories for further annotation task |
| Adaptive Annotate | Annotate input text with specified customized category |

## How it works

### CC 
The Azure AI Content Safety Custom Category feature is designed to provide a streamlined process for creating, training, and using custom content classification models. Here's an in-depth look at the underlying workflow:

#### Step 1: Definition and Setup
 
When you define a custom category, you are essentially instructing the AI on what type of content you want to identify. This involves providing a clear **category name** and a detailed **definition** that encapsulates the content's characteristics. The setup phase is crucial, as it lays the groundwork for the AI to understand your specific moderation needs.

Then, collect a balanced dataset with both **positive** and (optional)**negative examples** allows the AI to learn the nuances of the category. This data should be representative of the variety of content that the model will encounter in a real-world scenario.

#### Step 2: Model Training
 
Once you have your dataset ready, the Azure AI Content Safety service uses it to train a new model. During training, the AI analyzes the data, learning to distinguish between content that matches the custom category and content that does not.

#### Step 3: Model Inferencing
 
After training, you need to evaluate the model to ensure it meets your accuracy requirements. This is done by testing the model with new content that it hasn't seen before. The evaluation phase helps you identify any potential adjustments needed before deploying the model into a production environment.

### auto reviewer

Community guideline

Community guidelines refer to a set of rules or standards that are established by an online community or social media platform to govern the behavior of its users. These guidelines are designed to ensure that all users are treated with respect, and that harmful or offensive content is not posted or shared. They may include rules around hate speech, harassment, nudity, violence, or other types of content that may be deemed inappropriate. Users who violate community guidelines may face consequences such as having their account suspended or banned.

Category

A category refers to a specific type of prohibited content or behavior that is outlined in the guidelines. Categories may include things like hate speech, harassment, threats, nudity or sexually explicit content, violence, spam, or other forms of prohibited content. These categories are typically defined in broad terms to encompass a range of different behaviors and types of content that are considered to be problematic. By outlining specific categories of prohibited content, community guidelines provide users with a clear understanding of what is and is not allowed on the platform and help to create a safer and more positive online community.

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


