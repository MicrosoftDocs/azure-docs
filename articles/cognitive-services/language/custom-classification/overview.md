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
ms.date: 07/15/2021
ms.author: aahi
---

# What is custom text classification?

Custom text classification is one of the features offered by Azure Cognitive Service for language. Custom text classification abstracts away the need for in-house AI expertise, and lets you more easily build models that work on your data. 

Your data can be previously annotated documents, or ones that you upload and tag within the [Language Studio](https://language.azure.com). By building a custom classification model, you can predict the class or classes that 
 your data belongs to. Custom text classification supports two types of projects:
* **Single label classification**: You can only assign one class for each file of your dataset. For example, if a file is a movie script, it could only classified as "*Action*", "*Thriller*" or "*Romance*".

* **Multiple label classification**: You can assign *multiple* classes for each file of your dataset. For example, if a file is a movie script, it could be classified as  "*Action*" or "*Action*" and "*Thriller*".

## Custom text Classification

**Use Custom text classification to triage support tickets** 

Creating automation to triage support tickets is a time and effort consuming task. With custom text classification models you can save both valuable time and effort by classifying the support tickets to be routed to relevant departments automatically.


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

Use the [quickstart article](quickstart/using-language-studio.md) to start sending requests to the API.  
