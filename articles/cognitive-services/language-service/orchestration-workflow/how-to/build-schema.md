---
title: How to build an orchestration workflow project schema
titleSuffix: Azure Cognitive Services
description: Use this article to start building an orchestration project schema
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/03/2022
ms.author: aahi
ms.custom: language-service-orchestration
---

# How to build your project schema
 
In orchestration workflows, the *schema* is defined as the combination of intents and entities within your project. Schema design is a crucial part of your project's success. When creating a schema, you want think about which intents should be included in your project.

## Guidelines and recommendations

Consider the following guidelines when picking intents for your project:
When picking intents for your project, create distinct, separable intents. An intent is best described as a user's desired overall action. Think of the project you're building and identify all the different actions your users may take when interacting with your project. Sending, calling, and canceling are all actions that are best represented as different intents. "Canceling an order" and "canceling an appointment" are very similar, with the distinction being *what* they are canceling. Those two actions should be represented under the same intent.
  
You can *"send"* a *message*, *"send"* an *email*, or *"send"* a package. Creating an intent to capture each of those requirements will not scale over time, and you should use entities to identify *what* the user was sending. The combination of intents and entities should determine your conversation flow. 

For example, consider a company where the bot developers have identified the three most common actions their users take when using a calendar: 

* Setup new meetings 
* Respond to meeting requests 
* Cancel meetings 

They might create an intent to represent each of these actions. They might also include entities to help complete these actions, such as:

* Meeting attendants
* Date
* Meeting durations


For **orchestration workflow** projects, you can only create intents. The orchestration workflow project is intended to route to other target services that may be enabled with entity extraction to complete the conversation flow. You can add new intents that are connected to other services _or_ create intents that aren't connected to any service (a disconnected intent). 

By adding a disconnected intent, you allow the orchestrator to route to that intent, and return without calling into an additional service. You must provide training examples for disconnected intents. You can only connect to projects that are owned by the same Azure resource. 

Continuing the example from earlier, the developers for a bot might realize that for each skill of their bot (which includes: calendar actions, email actions, and a company FAQ), they need an intent that connects to each of those skills.  

## Build project schema for orchestration workflow projects

To build a project schema for orchestration workflow projects: 

1. Select **Add** in the **Build Schema** page. You will be prompted for a name and to define a connection for the intent, if any. If you would like to connect an intent you must provide:
    1. **Service Type**: LUIS, Custom Question Answering (QnA), or Conversational Language Understanding.
    2. **Project Name**: The project you want the intent to connect to.
    3. **Version for utterances** (Only for LUIS): which LUIS version should be used to train the orchestrator classification model.

    :::image type="content" source="../media/orchestration-intent.png" alt-text="A screenshot showing the intent creation modal for orchestration projects in Language Studio." lightbox="../media/orchestration-intent.png":::

> [!IMPORTANT]
> * Connected intents cannot be selected because you cannot add training examples to a connected intent, as it already uses the target project's data to train its intent classification.
> * You will only be able to connect to target services that are owned by the same resource.

## Next Steps
* [Tag utterances](tag-utterances.md)
