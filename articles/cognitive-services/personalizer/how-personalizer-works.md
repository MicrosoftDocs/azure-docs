---
title: How Personalizer Works
titleSuffix: Personalizer - Azure Cognitive Services
description: Personalizer uses machine learning to discover what action to use in a context. Each learning loop has a model that is trained exclusively on data that you have sent to it via Rank and Reward calls. Every learning loop is completely independent of each other.
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: overview
ms.date: 05/07/2019
ms.author: edjez
---

# How Personalizer Works

## Introduction

Personalizer uses machine learning to discover what action to use in a context. Each learning loop has a model that is trained exclusively on data that you have sent to it via **Rank** and **Reward** calls. Every learning loop is completely independent of each other.

When calling **Rank**, the Personalizer service decides to use either:

* The current model to decide the best action based on past data.
* Or perform exploration.

When calling **Reward**, the Personalizer service:

* Collects data to train the model by recording the features and reward scores of each rank call.
* Uses that data to update the model, following machine learning parameters specified in the _Learning Policy_.


## Architecture

The following image shows the architectural flow of calling the Rank and Reward calls:

![alt text](./media/how-personalizer-works/personalization-how-it-works.png "How Personalization Works")

1. Personalizer uses an internal AI model to determine the rank of the action.
1. The service decides whether to exploit the current model or explore new choices for the model.  
1. The ranking result is sent to EventHub.
1. When Personalizer receives the reward, the reward is sent to EventHub. 
1. The rank and reward are correlated.
1. The AI model is updated based on the correlation results.
1. The inference engine is updated with the new model. 

## Asynchronous learning
The asynchronous learning architecture of Personalizer allows it to scale to high-volume systems, while at the same time allowing developers to choose when new learning models are used.

<!-- implementation details -->

Personalizer uses Azure Event Hubs to send high-volume messages to the learning algorithm:
1. One message gets sent for a rank event, with the list of actions, and context with their corresponding features, and an eventId (which you provide or gets generated automatically).
1. One message gets sent with the reward associated with the ranking event.

These messages get correlated in the backend and used to train the model. Then the model gets picked up automatically for use at an interval you specify in settings.

## Research behind personalizer

Personalizer is based on cutting-edge science and research in the area of [Reinforcement Learning](concepts-reinforcement-learning.md) including papers, research activities, and ongoing areas of exploration in Microsoft Research.