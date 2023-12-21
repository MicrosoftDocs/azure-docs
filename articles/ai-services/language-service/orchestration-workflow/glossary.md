---
title: Definitions used in orchestration workflow
titleSuffix: Azure AI services
description: Learn about definitions used in orchestration workflow.
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: aahi
ms.custom: language-service-orchestration
---

# Terms and definitions used in orchestration workflow 
Use this article to learn about some of the definitions and terms you may encounter when using orchestration workflow. 

## F1 score
The F1 score is a function of Precision and Recall. It's needed when you seek a balance between [precision](#precision) and [recall](#recall).

## Intent
An intent represents a task or action the user wants to perform. It is a purpose or goal expressed in a user's input, such as booking a flight, or paying a bill.

## Model
A model is an object that's trained to do a certain task, in this case conversation understanding tasks. Models are trained by providing labeled data to learn from so they can later be used to understand utterances.

* **Model evaluation** is the process that happens right after training to know how well does your model perform.
* **Deployment** is the process of assigning your model to a deployment to make it available for use via the [prediction API](https://aka.ms/ct-runtime-swagger).

## Overfitting
Overfitting happens when the model is fixated on the specific examples and is not able to generalize well.

## Precision
Measures how precise/accurate your model is. It's the ratio between the correctly identified positives (true positives) and all identified positives. The precision metric reveals how many of the predicted classes are correctly labeled.

## Project
A project is a work area for building your custom ML models based on your data. Your project can only be accessed by you and others who have access to the Azure resource being used.

## Recall
Measures the model's ability to predict actual positive classes. It's the ratio between the predicted true positives and what was actually tagged. The recall metric reveals how many of the predicted classes are correct.

## Schema
Schema is defined as the combination of intents within your project. Schema design is a crucial part of your project's success. When creating a schema, you want think about which intents should be included in your project

## Training data
Training data is the set of information that is needed to train a model.

## Utterance

An utterance is user input that is short text representative of a sentence in a conversation. It is a natural language phrase such as "book 2 tickets to Seattle next Tuesday". Example utterances are added to train the model and the model predicts on new utterance at runtime


## Next steps

* [Data and service limits](service-limits.md).
* [Orchestration workflow overview](../overview.md).
