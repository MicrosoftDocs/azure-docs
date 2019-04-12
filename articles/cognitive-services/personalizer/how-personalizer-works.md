---
title: How Personalizer Works
titleSuffix: Personalizer - Azure Cognitive Services
description: Personalizer uses machine learning to discover what action to use in a context. Each Personalizer Loop has a model that is trained exclusively on data that you have sent to it via Rank and Reward calls. Every Personalizer Loop is completely independent of each other.
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

Personalizer uses machine learning to discover what action to use in a context. Each Personalizer Loop has a model that is trained exclusively on data that you have sent to it via Rank and Reward calls. Every Personalizer Loop is completely independent of each other.

Whan calling Rank, the Personalizer service will decide to either use the model to come up with the best action based on past data, or perform [exploration](concepts-exploration.md).

The model gets trained constantly and automatically. Personalizer collects data to train the model by recording the features and reward scores of each rank call. It then uses that data to update the model, following machine learning parameters specified in the Learning Policy.


## Architecture

![alt text](images/personalization-how-it-works.png "How Personalization Works")

## Asynchronous Learning
The asynchronous learning architecture of Personalizer allows it to scale to high-volume systems, while at the same time giving control to developers as to when new learning models are used.

Personalizer uses Azure Event Hubs to send high-volume messages to the learning algorithm:
1. One message gets sent for a rank event, with the list of actions, and context with their corresponding features, and an eventId (which you provide or gets generated automatically).
1. One message gets sent with the reward associated with the ranking event.

These messages get correlated in the backend and used to train the model. Then the model gets picked up automatically for use at an interval you specify in settings.

## Research Behind Personalizer

Personalizer is based on cutting-edge science and research in the area of [Reinforcement Learning](concepts-reinforcement-learning.md). See this page for references to papers, research activities, and ongoing areas of exploration in Microsoft Research.