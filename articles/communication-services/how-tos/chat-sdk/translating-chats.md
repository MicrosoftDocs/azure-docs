---
title: Translating chats
titleSuffix: An Azure Communication Services article
description: Learn how to build use cases with the Chat SDK to enable users to chat in different languages and detect sentiment.
author: kperla97
manager: darmour
services: Azure Communication Services

ms.author: kaperla
ms.date: 12/28/2023
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: chat
---

#  Translating chats

Translating chats enables users to communicate in their preferred language.

This article describes how you can use [Azure AI APIs](/azure/ai-services/) with the Chat SDK to build use cases like:

- Enable users to chat with each other in different languages.
- Help a support agent prioritize tickets by detecting a negative sentiment of an incoming message from a customer.
- Analyze the incoming messages for key detection and entity recognition, and prompt relevant info to the user in your app based on the message content.

One way to achieve these use cases is to have your trusted service act as a participant on a chat thread. Let's say you want to enable language translation. This service, illustrated in the following diagram, is responsible for:
1. listening to the messages exchanged by other participants,
2. calling Azure AI APIs to 
3. translate content to desired language, and 
4. sending the translated result as a message in the chat thread.

[![Screenshot showing Azure AI services interacting with Communication Services.](./media/ai-services.png)](./media/ai-services.png#lightbox)

This way, the message history contains both original and translated messages. In the client application, you can add logic to show the original or translated message. See [this quickstart](/azure/ai-services/translator/quickstart-text-rest-api) to understand how to use AI APIs to translate text to different languages. 

## Sentiment analysis 

Similarly for sentiment analysis as the users are having a conversation the Azure AI language service can be used.

## Next steps

* [Troubleshooting](../../concepts/troubleshooting-info.md)
* Help and support [options](../../support.md)
