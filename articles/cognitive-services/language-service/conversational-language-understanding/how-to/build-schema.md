---
title: How to build a Conversational Language Understanding project schema
titleSuffix: Azure Cognitive Services
description: Use this article to start building a Conversational Language Understanding project schema
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: how-to
ms.date: 03/03/2022
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# How to build your project schema
 
In Conversational Language Understanding, the *schema* is defined as the combination of intents and entities within your project. Schema design is a crucial part of your project's success. When creating a schema, you want think about which intents and entities should be included in your project.

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
* Meeting durations

## Build project schema for conversation projects

To build a project schema for conversation projects:

1. Select the **Intents** or **Entities** tab in the Build Schema page, and select **Add**. You will be prompted for a name before completing the creation of the intent or entity. 

2. Clicking on an intent will take you to the [tag utterances](tag-utterances.md) page, where you can add examples for intents, and label examples entities.

    :::image type="content" source="../media/build-schema-page.png" alt-text="A screenshot showing the schema creation page for conversation projects in Language Studio." lightbox="../media/build-schema-page.png":::
    
3. After creating an entity, you'll be routed to the entity details page. Every component is defined by multiple components. You can label examples in the tag utterances page to train a learned component, add a list of values to match against in the list component, or add a set of prebuilt components from the available library. Learn more about components [here](../concepts/entity-components.md)

    :::image type="content" source="../media/entity-details.png" alt-text="A screenshot showing the entity details page for conversation projects in Language Studio." lightbox="../media/entity-details.png":::

## Next Steps
* [Tag utterances](tag-utterances.md)
