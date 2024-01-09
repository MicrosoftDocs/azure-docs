---
title: How to build a Conversational Language Understanding project schema
titleSuffix: Azure AI services
description: Use this article to start building a Conversational Language Understanding project schema
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: how-to
ms.date: 12/19/2023
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# How to build your project schema
 
In conversational language understanding projects, the *schema* is defined as the combination of intents and entities within your project. Schema design is a crucial part of your project's success. When creating a schema, you want think about which intents and entities should be included in your project.

## Guidelines and recommendations

Consider the following guidelines when picking intents for your project:

  1. Create distinct, separable intents. An intent is best described as action the user wants to perform. Think of the project you're building and identify all the different actions your users may take when interacting with your project. Sending, calling, and canceling are all actions that are best represented as different intents. "Canceling an order" and "canceling an appointment" are very similar, with the distinction being *what* they are canceling. Those two actions should be represented under the same intent, *Cancel*.
  
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

## Add intents

To build a project schema within [Language Studio](https://aka.ms/languageStudio):

1. Select **Schema definition** from the left side menu.

2. From the top pivots, you can change the view to be **Intents** or **Entities**.

2. To create an intent, select **Add** from the top menu. You will be prompted to type in a name before completing creating the intent.

3. Repeat the above step to create all the intents to capture all the actions that you think the user will want to perform while using the project.

    :::image type="content" source="../media/build-schema-page.png" alt-text="A screenshot showing the schema creation page for conversation projects in Language Studio." lightbox="../media/build-schema-page.png":::

4. When you select the intent, you will be directed to the [Data labeling](tag-utterances.md) page,  with a filter set for the intent you selected. You can add examples for intents and label them with entities.
    
## Add entities

1. Move to **Entities** pivot from the top of the page.

2. To add an entity, select **Add** from the top menu. You will be prompted to type in a name before completing creating the entity.

3. After creating an entity, you'll be routed to the entity details page where you can define the composition settings for this entity.

4. Every entity can be defined by multiple components: learned, list or prebuilt. A learned component is added to all your entities once you label them in your utterances.

   :::image type="content" source="../media/entity-details.png" alt-text="A screenshot showing the entity details page for conversation projects in Language Studio." lightbox="../media/entity-details.png":::
   
5.You can add a [list](../concepts/entity-components.md#list-component) or [prebuilt](../concepts/entity-components.md#prebuilt-component) component to each entity. 

### Add prebuilt component

To add a **prebuilt** component, select **Add new prebuilt** and from the drop-down menu, select the prebuilt type to you want to add to this entity.

   <!--:::image type="content" source="../media/add-prebuilt-component.png" alt-text="A screenshot showing a prebuilt-component in Language Studio." lightbox="../media/add-prebuilt-component.png":::-->
   
### Add list component

To add a **list** component, select **Add new list**. You can add multiple lists to each entity.

1. To create a new list, in the *Enter value* text box enter this is the normalized value that will be returned when any of the synonyms values is extracted.

2. From the *language* drop-down menu, select the language of the synonyms list and start typing in your synonyms and hit enter after each one. It is recommended to have synonyms lists in multiple languages.

   <!--:::image type="content" source="../media/add-list-component.png" alt-text="A screenshot showing a list component in Language Studio." lightbox="../media/add-list-component.png":::-->
   
### Define entity options

Change to the **Entity options** pivot in the entity details page. When multiple components are defined for an entity, their predictions may overlap. When an overlap occurs, each entity's final prediction is determined based on the [entity option](../concepts/entity-components.md#entity-options) you select in this step. Select the one that you want to apply to this entity and select the **Save** button at the top.

   <!--:::image type="content" source="../media/entity-options.png" alt-text="A screenshot showing an entity option in Language Studio." lightbox="../media/entity-options.png":::-->


After you create your entities, you can come back and edit them. You can **Edit entity components** or **delete** them by selecting this option from the top menu.
 
## Next Steps

* [Add utterances and label your data](tag-utterances.md)
