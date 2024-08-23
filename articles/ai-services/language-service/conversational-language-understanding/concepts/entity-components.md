---
title: Entity components in conversational language understanding
titleSuffix: Azure AI services
description: Learn how conversational language understanding extracts entities from text.
#services: cognitive-services
author: jboback
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 12/19/2023
ms.author: jboback
ms.custom: language-service-clu
---

# Entity components

In conversational language understanding, entities are relevant pieces of information that are extracted from your utterances. An entity can be extracted by different methods. They can be learned through context, matched from a list, or detected by a prebuilt recognized entity. Every entity in your project is composed of one or more of these methods, which are defined as your entity's components. 

When an entity is defined by more than one component, their predictions can overlap. You can determine the behavior of an entity prediction when its components overlap by using a fixed set of options in the *entity options*.

## Component types

An entity component determines a way that you can extract the entity. An entity can contain one component, which determines the only method to be used to extract the entity. An entity can also contain multiple components to expand the ways in which the entity is defined and extracted.

### Learned component

The learned component uses the entity tags you label your utterances with to train a machine-learned model. The model learns to predict where the entity is based on the context within the utterance. Your labels provide examples of where the entity is expected to be present in an utterance, based on the meaning of the words around it and as the words that were labeled. 

This component is only defined if you add labels by tagging utterances for the entity. If you don't tag any utterances with the entity, it doesn't have a learned component.

:::image type="content" source="../media/learned-component.png" alt-text="Screenshot that shows an example of learned components for entities." lightbox="../media/learned-component.png":::

### List component

The list component represents a fixed, closed set of related words along with their synonyms. The component performs an exact text match against the list of values you provide as synonyms. Each synonym belongs to a *list key*, which can be used as the normalized, standard value for the synonym that returns in the output if the list component is matched. List keys *aren't* used for matching.

In multilingual projects, you can specify a different set of synonyms for each language. When you use the prediction API, you can specify the language in the input request, which only matches the synonyms associated to that language.

:::image type="content" source="../media/list-component.png" alt-text="Screenshot that shows an example of list components for entities." lightbox="../media/list-component.png":::

### Prebuilt component

The prebuilt component allows you to select from a library of common types such as numbers, datetimes, and names. When added, a prebuilt component is automatically detected. You can have up to five prebuilt components per entity. For more information, see [the list of supported prebuilt components](../prebuilt-component-reference.md).

:::image type="content" source="../media/prebuilt-component.png" alt-text="Screenshot that shows an example of prebuilt components for entities." lightbox="../media/prebuilt-component.png":::

### Regex component

The regex component matches regular expressions to capture consistent patterns. When added, any text that matches the regular expression is extracted. You can have multiple regular expressions within the same entity, each with a different key identifier. A matched expression returns the key as part of the prediction response.

In multilingual projects, you can specify a different expression for each language. When you use the prediction API, you can specify the language in the input request, which only matches the regular expression associated to that language.

:::image type="content" source="../media/regex-component.png" alt-text="Screenshot that shows an example of regex components for entities." lightbox="../media/prebuilt-component.png":::

## Entity options

When multiple components are defined for an entity, their predictions might overlap. When an overlap occurs, each entity's final prediction is determined by one of the following options.

### Combine components

Combine components as one entity when they overlap by taking the union of all the components.

Use this option to combine all components when they overlap. When components are combined, you get all the extra information that's tied to a list or prebuilt component when they're present.

#### Example

Suppose you have an entity called **Software** that has a list component, which contains "Proseware OS" as an entry. In your utterance data, you have "I want to buy Proseware OS 9" with "Proseware OS 9" tagged as **Software**:

:::image type="content" source="../media/union-overlap-example-1.svg" alt-text="Screenshot that shows a learned and list entity overlapped." lightbox="../media/union-overlap-example-1.svg":::

By using combined components, the entity returns with the full context as "Proseware OS 9" along with the key from the list component:

:::image type="content" source="../media/union-overlap-example-1-part-2.svg" alt-text="Screenshot that shows the result of a combined component." lightbox="../media/union-overlap-example-1-part-2.svg":::

Suppose you had the same utterance, but only "OS 9" was predicted by the learned component:

:::image type="content" source="../media/union-overlap-example-2.svg" alt-text="Screenshot that shows an utterance with O S 9 predicted by the learned component." lightbox="../media/union-overlap-example-2.svg":::

With combined components, the entity still returns as "Proseware OS 9" with the key from the list component:

:::image type="content" source="../media/union-overlap-example-2-part-2.svg" alt-text="Screenshot that shows the returned Software entity." lightbox="../media/union-overlap-example-2-part-2.svg":::

### Don't combine components

Each overlapping component returns as a separate instance of the entity. Apply your own logic after prediction with this option.

#### Example

Suppose you have an entity called **Software** that has a list component, which contains "Proseware Desktop" as an entry. In your utterance data, you have "I want to buy Proseware Desktop Pro" with "Proseware Desktop Pro" tagged as **Software**:

:::image type="content" source="../media/separated-overlap-example-1.svg" alt-text="Screenshot that shows an example of a learned and list entity overlapped." lightbox="../media/separated-overlap-example-1.svg":::

When you don't combine components, the entity returns twice:

:::image type="content" source="../media/separated-overlap-example-1-part-2.svg" alt-text="Screenshot that shows the entity returned twice." lightbox="../media/separated-overlap-example-1-part-2.svg":::

### Required components

Sometimes an entity can be defined by multiple components but requires one or more of them to be present. Every component can be set as *required*, which means the entity *won't* be returned if that component wasn't present. For example, if you have an entity with a list component and a required learned component, it's guaranteed that any returned entity includes a learned component. If it doesn't, the entity isn't returned.

Required components are most frequently used with learned components because they can restrict the other component types to a specific context, which is commonly associated to *roles*. You can also require all components to make sure that every component is present for an entity.

In Language Studio, every component in an entity has a toggle next to it that allows you to set it as required.

#### Example

Suppose you have an entity called **Ticket Quantity** that attempts to extract the number of tickets you want to reserve for flights, for utterances such as "Book **two** tickets tomorrow to Cairo."

Typically, you add a prebuilt component for `Quantity.Number` that already extracts all numbers. If your entity was only defined with the prebuilt component, it also extracts other numbers as part of the **Ticket Quantity** entity, such as "Book **two** tickets tomorrow to Cairo at **3** PM."

To resolve this scenario, you label a learned component in your training data for all the numbers that are meant to be **Ticket Quantity**. The entity now has two components: the prebuilt component that knows all numbers, and the learned one that predicts where the ticket quantity is in a sentence. If you require the learned component, you make sure that **Ticket Quantity** only returns when the learned component predicts it in the right context. If you also require the prebuilt component, you can then guarantee that the returned **Ticket Quantity** entity is both a number and in the correct position.

## Use components and options

Components give you the flexibility to define your entity in more than one way. When you combine components, you make sure that each component is represented and you reduce the number of entities returned in your predictions.

A common practice is to extend a prebuilt component with a list of values that the prebuilt might not support. For example, if you have an **Organization** entity, which has a `General.Organization` prebuilt component added to it, the entity might not predict all the organizations specific to your domain. You can use a list component to extend the values of the **Organization** entity and extend the prebuilt component with your own organizations.

Other times, you might be interested in extracting an entity through context, such as a **Product** in a retail project. You label the learned component of the product to learn _where_ a product is based on its position within the sentence. You might also have a list of products that you already know beforehand that you want to always extract. Combining both components in one entity allows you to get both options for the entity.

When you don't combine components, you allow every component to act as an independent entity extractor. One way of using this option is to separate the entities extracted from a list to the ones extracted through the learned or prebuilt components to handle and treat them differently.

> [!NOTE]
> Previously during the public preview of the service, there were four available options: **Longest overlap**, **Exact overlap**, **Union overlap**, and **Return all separately**. **Longest overlap** and **Exact overlap** are deprecated and are only supported for projects that previously had those options selected. **Union overlap** has been renamed to **Combine components**, while **Return all separately** has been renamed to **Do not combine components**.

## Related content

- [Supported prebuilt components](../prebuilt-component-reference.md)
