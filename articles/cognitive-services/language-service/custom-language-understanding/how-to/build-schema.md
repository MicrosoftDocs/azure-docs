---
title: How to build a Custom Language Understanding project schema 
titleSuffix: Azure Cognitive Services
description: Use this article to start building a Custom Language Understanding project schema
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: text-analytics
ms.topic: overview
ms.date: 11/02/2021
ms.author: aahi
---

# How to build your project schema
 
In Custom Language Understanding, the *schema* is defined as the combination of intents and entities within your project. Schema design is a crucial part of your project's success. When creating a schema, you want think about which intents and entities should be included in your project.

## Guidelines and recommendations

Consider the following guidelines when picking intents for your project:

  1. Create distinct, separable intents. An intent is best described as a user's desired overall action. Think of the project you're building and identify all the different actions your users may take when interacting with your project. Sending, calling, and canceling are all actions that are best represented as different intents. "Canceling an order" and "canceling an appointment" are very similar, with the distinction being *what* they are canceling. Those two actions should be represented under the same intent.
  
  2. Create entities to extract relevant pieces of information within your text. The entities should be used to capture the relevant information needed to fulfill your user's action. For example, *order* or *appointment* could be different things a user is trying to cancel, and you should create an entity to capture that piece of information.

You can *"send"* a *message*, *"send"* an *email*, or *"send"* a package. Creating an intent to capture each of those requirements will not scale over time, and you should use entities to identify *what* the user was sending. The combination of intents and entities should determine your conversation flow. 

For example, consider a company where the bot developers have identified the three most common actions their users take when using a calendar: 

* Setup new meetings 
* Respond to meeting requests 
* Cancel meetings 

They might create an intent to represent each of these actions. They might also include entities to help complete these actions, such as:

* Meeting attendants
* Date
* Meeting duration
* name


For orchestration workflow projects, you can only create intents. The orchestration workflow project is intended to route to other target services that may be enabled with entity extraction to complete the conversation flow. You can add new intents that are connected to other services _or_ create intents that aren't connected to any service (a disconnected intent). 

By adding a disconnected intent, you allow the orchestrator to route to that intent, and return without calling into an additional service, indicating the intent it routed to. You must provide training examples for disconnected intents. You can only connect to projects that are owned by the same Azure resource. 

Continuing the example from earlier, the developers for a bot might realize that for each skill of their bot (which includes: calendar actions, email actions, and a company FAQ), they need an intent that connects to it.  

## Build project schema for conversation projects

To build a project schema for conversation projects:

1. Select the **Intents** or **Entities** tab in the Build Schema page, and select **Add**. You will be prompted for a name before completing the creation of the intent or entity. 

2. Clicking on an intent will take you to the [tag utterances](tag-utterances.md) page, where you can add examples for intents, and label examples entities.

    :::image type="content" source="../media/build-schema-page.png" alt-text="A screenshot showing the schema creation page for conversation projects in Language Studio." lightbox="../media/build-schema-page.png":::

## Build project schema for orchestration workflow projects

To build a project schema for orchestration workflow projects: 

1. Select **Add** in the **Build Schema** page. You will be prompted for a name and to define a connection for the intent, if any. If you would like to connect an intent you must provide:
    1. **Service Type**: LUIS, Custom Question Answering, or Custom Language Understanding.
    2. **Project Name**: The project you want the intent to connect to.
    3. **Version for utterances** (Only for LUIS): which LUIS version should be used to train the orchestrator classification model.

Clicking on the intent will take you to the [tag utterances](tag-utterances.md) page, where you can add examples for intents. 

> [!IMPORTANT]
> * Connected intents cannot be selecated because you cannot add training examples to a connected intent, as it already uses the target project's data to train its intent classification.
> * You will only be able to connect to target services that are owned by the same resource. If you want to connect to a LUIS application, see [LUIS application backwards compatibility](../concepts/backwards-compatibility.md).

## Next Steps
* [Tag utterances](tag-utterances.md)



