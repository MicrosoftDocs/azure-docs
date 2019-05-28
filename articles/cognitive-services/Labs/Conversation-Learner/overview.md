---
title: What is Conversation Learner? - Microsoft Cognitive Services | Microsoft Docs
titleSuffix: Azure
description: Learn about Conversation Learner and how it works.
services: cognitive-services
author: nitinme
manager: nolachar
ms.service: cognitive-services
ms.subservice: conversation-learner
ms.topic: article
ms.date: 04/30/2018
ms.author: nitinme
---

# What is Conversation Learner?

Conversation Learner enables you to build and teach conversational interfaces that learn from example interactions. 

Unlike traditional approaches, Conversation Learner considers the end-to-end context of a dialogue to improve responses and deliver more compelling user experiences. Spanning a broad set of task-oriented use cases, Conversation Learner applies machine learning behind the scenes to make bots and intelligent agents less likely to frustrate users, incur additional customer service costs, and spur more intuitive interactions.

Developers start by entering prototypical dialogs they want to imitate. The Model learns as more dialogs are entered. Once the Model is working well, the Bot can be deployed to end users. Conversation Learner logs conversations with users, and the developer can review them. If mistakes are spotted, the developer can make an on-the-spot correction, and the model is retrained and available for use immediately.

This approach reduces manual coding of dialogue control logic and enables business owners or domain experts to contribute to a conversational interface without prior machine learning knowledge. Whether it’s deployed as part of a bot, smart device, or intelligent agent, Conversation Learner can rapidly iterate new skills, behaviors, or competencies and quickly improve their quality. 

Conversation Learner empowers developers to increase speed-to-market and drive successful dialogues across multiple conversational channels through the Microsoft Bot Framework, or standalone using their own infrastructure.

Summary and highlights:

- Conversation Learner is an AI-first way of building task-oriented bots.​

- It relies on an end-to-end recurrent neural network (LSTM), and learns directly from multi-turn examples of conversations. 

- Enables designers, developers, business users, and call center workers to build and maintain bots. 

- Provides the ability to express business rules and common sense in code.​

- During teaching sessions, the neural network model is used to score the next set of expected actions in the conversation. The bot developer can then select the correct action, and train the network to provide the proper response.
 
- After training is complete, the developer can use the log dialogs from the user interactions to make corrections to bot responses and retrain the model. ​​​

- Can call domain-specific and third-party APIs to complete tasks​.

