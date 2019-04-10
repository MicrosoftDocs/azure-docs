---
title: Conversational context
titleSuffix: Azure Cognitive Services
description: 
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.topic: article 
ms.date: 05/07/2019
ms.author: diberry
#
---

# Conversational context from a parent question to child questions

## What is conversational context?

Conversational context is the ability to manage a question within the context of questions asked before and after that question. 

When you design your client application (chat bot) conversations, a user may ask a question that needs to be filtered or refined in order to determine the correct answer. This flow through the questions is possible by selecting child questions for the context.

When the user asks the question, QnA Maker returns the answer _and_ any child questions. This allows you to present the child questions as choices. 

## Example conversational context with chat bot

A chat bot can be used to manage the conversation, question by question, with the user to determine the correct and final answer.

![Conversation from parent question to possible child questions in bot](../media/conversational-context/conversation-in-bot.png)

In the preceding image, the user's question needs to be refined before returning the answer. In the knowledge base, the question (#1), has four child questions, presented in the chat bot as four choices (#2). 

When the user selects a choice (#3), then the next list of refining choices (#4) is presented. This can continue (#5) until the correct and final answer (#6) is determined.

## Metadata filters are applied first, then context is determined

In the knowledge base a question can link to contextual child questions and have metadata. When a question has both, the metadata filters are applied first, then the child answers are returned. 