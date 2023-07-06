---
title: Definitions used in conversational language understanding
titleSuffix: Azure AI services
description: Learn about definitions used in conversational language understanding.
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: overview
ms.date: 05/13/2022
ms.author: aahi
ms.custom: language-service-custom-classification
---

# Terms and definitions used in conversation language understanding 

Use this article to learn about some of the definitions and terms you may encounter when using conversation language understanding. 

## Entity
Entities are words in utterances that describe information used to fulfill or identify an intent. If your entity is complex and you would like your model to identify specific parts, you can break your model into subentities. For example, you might want your model to predict an address, but also the subentities of street, city, state, and zipcode. 

## F1 score
The F1 score is a function of Precision and Recall. It's needed when you seek a balance between [precision](#precision) and [recall](#recall).

## Intent
An intent represents a task or action the user wants to perform. It's a purpose or goal expressed in a user's input, such as booking a flight, or paying a bill.

## List entity
A list entity represents a fixed, closed set of related words along with their synonyms. List entities are exact matches, unlike machined learned entities.

The entity will be predicted if a word in the list entity is included in the list. For example, if you have a list entity called "size" and you have the words "small, medium, large" in the list, then the size entity will be predicted for all utterances where the words "small", "medium", or "large" are used regardless of the context.

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

## Regular expression
A regular expression entity represents a regular expression. Regular expression entities are exact matches.

## Schema
Schema is defined as the combination of intents and entities within your project. Schema design is a crucial part of your project's success. When creating a schema, you want think about which intents and entities should be included in your project

## Training data
Training data is the set of information that is needed to train a model.

## Utterance

An utterance is user input that is short text representative of a sentence in a conversation. It is a natural language phrase such as "book 2 tickets to Seattle next Tuesday". Example utterances are added to train the model and the model predicts on new utterance at runtime


## Next steps

* [Data and service limits](service-limits.md).
* [Conversation language understanding overview](../overview.md).
