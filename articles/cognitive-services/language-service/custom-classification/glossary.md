---
title: Definitions used in custom text classification
titleSuffix: Azure Cognitive Services
description: Learn about definitions used in custom text classification.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-custom-classification, ignite-fall-2021
---

# Terms and definitions used in custom text classification 

Learn about definitions used in custom text classification. 

## Project

A project is a work area for building your custom AI models based on your data. Your project can only be accessed by you and others who have contributor access to the Azure resource being used.
As a prerequisite to creating a Custom text classification project, you have to [connect your resource to a storage account](how-to/create-project.md).
As part of the project creation flow, you need connect it to a blob container where you have uploaded your dataset. Your project automatically includes all the `.txt` files available in your container. You can have multiple models within your project all built on the same dataset. See the [service limits](service-limits.md) article for more information.

Within your project you can do the following operations:

* [Tag your data](./how-to/tag-data.md): The process of tagging each file of your dataset with the respective class/classes so that when you train your model it learns how to classify your files.
* [Build and train your model](./how-to/train-model.md): The core step of your project. In this step, your model starts learning from your tagged data. 
* [View the model evaluation details](./how-to/view-model-evaluation.md): Review your model performance to decide if there is room for improvement or you are satisfied with the results.
* [Improve the model (optional)](./how-to/improve-model.md): Determine what went wrong with your model and improve performance.
* [Deploy the model](quickstart.md?pivots=language-studio#deploy-your-model): Make your model available for use. 
* [Test model](quickstart.md?pivots=language-studio#test-your-model): Test your model and see how it performs.

### Project types

Custom text classification supports two types of projects

* **Single label classification**: You can only assign one class for each file of your dataset. For example, if it is a movie script, your file can only be `Action`, `Thriller` or `Romance`.

* **Multiple label classification**: You can assign **multiple** classes for each file of your dataset. For example, if it is a movie script, your file can be `Action` or `Action` and `Thriller` or `Romance`.

## Model

A model is an object that is trained to do a certain task, in our case custom text classification. Models are trained by providing tagged data to learn from so they can later be used for classifying text. After you're satisfied with the model's performance, it can be deployed, which makes it [available for consumption](https://aka.ms/ct-runtime-swagger).

## Class

A class is a user defined category that is used to indicate the overall classification of the text. You will tag your data with your assigned classes before passing it to the model for training. 
