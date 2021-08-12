---
title: Definitions used in custom classification in Language Services - Azure Cognitive Services
titleSuffix: Azure Cognitive Services
description: Learn about definitions used in custom text classification with the Language Services API.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 07/15/2021
ms.author: aahi
---

# Custom text classification

Learn about definitions used in the custom text classification feature of Language Services. 

## Project

A project is a work area for building your custom AI models based on your data. Your project can only be accessed by you and other people who have contributor access to the Azure resource you are using.
As a prerequisite to creating a Custom entity extraction project, you have to [connect your resource to a storage account](concepts/development-lifecycle.md).
As part of the project creation flow, you need connect it to a blob container where you have uploaded your dataset. Your project automatically includes all the `.txt` files available in your container. See the [limits](concepts/data-limits.md) article for more information.

Within your project you can do the following operations:

* [Tag your data](./how-to/tag-data.md): The process of tagging each file of your dataset with the respective class/classes so that when you train your model it learns how to classify your files.
* [Build and train your model](./how-to/train-model.md): The core step of your project. In this step, your model starts learning from your tagged data. 
* [View the model evaluation details](./how-to/view-model-evaluation.md): Review your model performance to decide if there is room for improvement or you are satisfied with the results.
* [Improve the model](./how-to/improve-model.md): Determine what went wrong with your model and improve performance.
* [Deploy the model](./how-to/deploy-model.md): Make your model available for use. 
* [Test model](./how-to/test-model.md): Test your model and see how it performs.

### Project types

Custom text classification supports two types of projects

* **Single class classification**: You can only assign one class for each file of your dataset. For example, if it is a movie script, your file can only be `Action`, `Thriller` or `Romance`.

* **Multiple class classification**: You can assign **multiple** classes for each file of your dataset. For example, if it is a movie script, your file can be `Action` or `Action` and `Thriller` or `Romance`.

## Model

A model is an object that has been trained to do a certain task, in our case custom entity extraction.
* **Model training** is the process of teaching your model what to extract based on your tagged data.
* **Model evaluation** is the process that happens right after training to know how well does your model perform.
* **Model deployment** is the process of making it available for use.
