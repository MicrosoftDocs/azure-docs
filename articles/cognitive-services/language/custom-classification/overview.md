---
title: What is custom classification in Language Services - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn how use custom text classification with the Language Services API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 09/20/2021
ms.author: aahi
---

# What is custom text classification?

Custom text classification is one of the features offered by [Azure Cognitive Service for language](../overview.md). Custom text classification simplifies many of the details required for building a custom model, and lets you focus on building a model around your data. 


Your data can be previously annotated documents, or ones that you upload and tag within the [Language Studio](https://language.azure.com). By building a custom classification model, you can predict the class or classes that your data belongs to. Custom text classification supports two types of projects:


* **Single label classification**: You can only assign one class for each file of your dataset. For example, if a file is a movie script, it could only classified as "*Action*", "*Thriller*" or "*Romance*".

* **Multiple label classification**: You can assign *multiple* classes for each file of your dataset. For example, if a file is a movie script, it could be classified as  "*Action*" or "*Action*" and "*Thriller*".

## Example: Use custom text classification to triage support tickets

Creating automation to triage support tickets can be a time consuming and difficult task. With custom text classification models, you can save both time and effort by automatically classifying support tickets to be routed to relevant departments.

## Application development lifecycle

Creating a custom classification application typically involves several different steps. 

:::image type="content" source="media/development-lifecycle.png" alt-text="The development lifecycle" lightbox="media/development-lifecycle.png":::

Follow these steps to get the most out of your model:

1. **Define schema**: Know your data and identify the classes you want differentiate between, avoid ambiguity.

2. **Tag data**: The quality of data tagging is a key factor in determining model performance. Tag all the files you want to include in training. Files that belong to the same class should always have the same class, if you have a file that can fall into two classes use  **Multiple class classification** projects. Avoid class ambiguity, make sure that your classes are clearly separable from each other, especially with Single class classification projects.

3. **Train model**: Your model starts learning from your tagged data.

4. **View model evaluation details**: View the evaluation details for your model to determine how well it performs when introduced to new data.

5. **Improve model**: Work on improving your model performance by examining the incorrect model predictions and examining data distribution.

6. **Deploy model**: Deploying a model makes it available for use via the Analyze API.

7. **Classify text**: Use your custom modeled for text classification tasks.

## Next steps

Use the [quickstart article](quickstart.md) to start sending requests using Language Studio.  
