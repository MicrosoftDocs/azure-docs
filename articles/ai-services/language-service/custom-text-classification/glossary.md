---
title: Definitions used in custom text classification
titleSuffix: Azure AI services
description: Learn about definitions used in custom text classification.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021, event-tier1-build-2022
---

# Terms and definitions used in custom text classification 

Use this article to learn about some of the definitions and terms you may encounter when using custom text classification. 

## Class

A class is a user-defined category that indicates the overall classification of the text. Developers label their data with their classes before they pass it to the model for training.

## F1 score
The F1 score is a function of Precision and Recall. It's needed when you seek a balance between [precision](#precision) and [recall](#recall).

## Model

A model is an object that's trained to do a certain task, in this case text classification tasks. Models are trained by providing labeled data to learn from so they can later be used for classification tasks.

* **Model training** is the process of teaching your model how to classify documents based on your labeled data.
* **Model evaluation** is the process that happens right after training to know how well does your model perform.
* **Deployment** is the process of assigning your model to a deployment to make it available for use via the [prediction API](https://aka.ms/ct-runtime-swagger).

## Precision
Measures how precise/accurate your model is. It's the ratio between the correctly identified positives (true positives) and all identified positives. The precision metric reveals how many of the predicted classes are correctly labeled.

## Project

A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Azure resource being used.
As a prerequisite to creating a custom text classification project, you have to connect your resource to a storage account with your dataset when you [create a new project](how-to/create-project.md). Your project automatically includes all the `.txt` files available in your container.

Within your project you can do the following:

* **Label your data**: The process of labeling your data so that when you train your model it learns what you want to extract.
* **Build and train your model**: The core step of your project, where your model starts learning from your labeled data. 
* **View model evaluation details**: Review your model performance to decide if there is room for improvement, or you are satisfied with the results.
* **Deployment**: After you have reviewed model performance and decide it's fit to be used in your environment; you need to assign it to a deployment to be able to query it. Assigning the model to a deployment makes it available for use through the [prediction API](https://aka.ms/ct-runtime-swagger). 
* **Test model**: After deploying your model, you can use this operation in [Language Studio](https://aka.ms/LanguageStudio) to try it out your deployment and see how it would perform in production.

### Project types

Custom text classification supports two types of projects

* **Single label classification** - you can assign a single class for each document in your dataset. For example, a movie script could only be classified as "Romance" or "Comedy". 
* **Multi label classification** - you can assign multiple classes for each document in your dataset. For example, a movie script could be classified as "Comedy" or "Romance" and "Comedy".

## Recall
Measures the model's ability to predict actual positive classes. It's the ratio between the predicted true positives and what was actually tagged. The recall metric reveals how many of the predicted classes are correct.


## Next steps

* [Data and service limits](service-limits.md).
* [Custom text classification overview](../overview.md).
