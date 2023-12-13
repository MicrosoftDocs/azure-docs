---
title: Definitions and terms used for Custom Named Entity Recognition (NER)
titleSuffix: Azure AI services
description: Definitions and terms you may encounter when building AI models using Custom Named Entity Recognition
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 05/06/2022
ms.author: aahi
ms.custom: language-service-custom-ner, ignite-fall-2021, event-tier1-build-2022
---

# Custom named entity recognition definitions and terms

Use this article to learn about some of the definitions and terms you may encounter when using custom NER.

## Entity

An entity is a span of text that indicates a certain type of information. The text span can consist of one or more words. In the scope of custom NER, entities represent the information that the user wants to extract from the text. Developers tag entities within their data with the needed entities before passing it to the model for training. For example "Invoice number", "Start date", "Shipment number", "Birthplace", "Origin city", "Supplier name" or "Client address".

For example, in the sentence "*John borrowed 25,000 USD from Fred.*" the entities might be: 

| Entity name/type | Entity |
|--|--|
| Borrower Name | *John* |
| Lender Name | *Fred* |
| Loan Amount | *25,000 USD* |

## F1 score
The F1 score is a function of Precision and Recall. It's needed when you seek a balance between [precision](#precision) and [recall](#recall).

## Model

A model is an object that is trained to do a certain task, in this case custom entity recognition. Models are trained by providing labeled data to learn from so they can later be used for recognition tasks.

* **Model training** is the process of teaching your model what to extract based on your labeled data.
* **Model evaluation** is the process that happens right after training to know how well does your model perform.
* **Deployment** is the process of assigning your model to a deployment to make it available for use via the [prediction API](https://aka.ms/ct-runtime-swagger).

## Precision
Measures how precise/accurate your model is. It's the ratio between the correctly identified positives (true positives) and all identified positives. The precision metric reveals how many of the predicted classes are correctly labeled.

## Project

A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Azure resource being used.
As a prerequisite to creating a custom entity extraction project, you have to connect your resource to a storage account with your dataset when you [create a new project](how-to/create-project.md). Your project automatically includes all the `.txt` files available in your container.

Within your project you can do the following actions:

* **Label your data**: The process of labeling your data so that when you train your model it learns what you want to extract.
* **Build and train your model**: The core step of your project, where your model starts learning from your labeled data. 
* **View model evaluation details**: Review your model performance to decide if there is room for improvement, or you are satisfied with the results.
* **Deployment**: After you have reviewed the model's performance and decided it can be used in your environment, you need to assign it to a deployment to use it. Assigning the model to a deployment makes it available for use through the [prediction API](https://aka.ms/ct-runtime-swagger). 
* **Test model**: After deploying your model, test your deployment in [Language Studio](https://aka.ms/LanguageStudio) to see how it would perform in production.

## Recall
Measures the model's ability to predict actual positive classes. It's the ratio between the predicted true positives and what was actually tagged. The recall metric reveals how many of the predicted classes are correct.

## Next steps

* [Data and service limits](service-limits.md).
* [Custom NER overview](../overview.md).
