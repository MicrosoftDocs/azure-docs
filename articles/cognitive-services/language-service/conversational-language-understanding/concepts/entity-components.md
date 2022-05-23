---
title: Entity components in Conversational Language Understanding
titleSuffix: Azure Cognitive Services
description: Learn how Conversational Language Understanding extracts entities from text
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-service
ms.topic: conceptual
ms.date: 05/13/2022
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# Entity components

In Conversational Language Understanding, entities are relevant pieces of information that are extracted from your utterances. An entity can be extracted by different methods. They can be learned through context, matched from a list, or detected by a prebuilt recognized entity. Every entity in your project is composed of one or more of these methods, which are defined as your entity's components. When an entity is defined by more than one component, their predictions can overlap. You can determine the behavior of an entity prediction when its components overlap by using a fixed set of options in the **Entity options**.

## Component types

An entity component determines a way you can extract the entity. An entity can simply contain one component, which would determine the only method that would be used to extract the entity, or multiple components to expand the ways in which the entity is defined and extracted.

### Learned component

The learned component uses the entity tags you label your utterances with to train a machine learned model. The model learns to predict where the entity is, based on the context within the utterance. Your labels provide examples of where the entity is expected to be present in an utterance, based on the meaning of the words around it and as the words that were labeled. This component is only defined if you add labels by tagging utterances for the entity. If you do not tag any utterances with the entity, it will not have a learned component.

:::image type="content" source="../media/learned-component.png" alt-text="A screenshot showing an example of learned components for entities." lightbox="../media/learned-component.png":::

### List component

The list component represents a fixed, closed set of related words along with their synonyms. The component performs an exact text match against the list of values you provide as synonyms. Each synonym belongs to a "list key", which can be used as the normalized, standard value for the synonym that will return in the output if the list component is matched. List keys are **not** used for matching.

In multilingual projects, you can specify a different set of synonyms for each language. While using the prediction API, you can specify the language in the input request, which will only match the synonyms associated to that language.


:::image type="content" source="../media/list-component.png" alt-text="A screenshot showing an example of list components for entities." lightbox="../media/list-component.png":::

### Prebuilt component

The prebuilt component allows you to select from a library of common types such as numbers, datetimes, and names. When added, a prebuilt component is automatically detected. You can have up to five prebuilt components per entity. See [the list of supported prebuilt components](../prebuilt-component-reference.md) for more information.


:::image type="content" source="../media/prebuilt-component.png" alt-text="A screenshot showing an example of prebuilt components for entities." lightbox="../media/prebuilt-component.png":::


## Entity options

When multiple components are defined for an entity, their predictions may overlap. When an overlap occurs, each entity's final prediction is determined by one of the following options.

### Combine components

Combine components as one entity when they overlap by taking the union of all the components.

Use this to combine all components when they overlap. When components are combined, you get all the extra information that’s tied to a list or prebuilt component when they are present.

#### Example

Suppose you have an entity called Software that has a list component, which contains “Proseware OS” as an entry. In your utterance data, you have “I want to buy Proseware OS 9” with “Proseware OS 9” tagged as Software:

:::image type="content" source="../media/union-overlap-example-1.svg" alt-text="A screenshot showing a learned and list entity overlapped." lightbox="../media/union-overlap-example1.svg":::

By using combine components, the entity will return with the full context as “Proseware OS 9” along with the key from the list component:

:::image type="content" source="../media/union-overlap-example-1-part-2.svg" alt-text="A screenshot showing the result of a combined component." lightbox="../media/union-overlap-example-1-part-2.svg":::

Suppose you had the same utterance but only “OS 9” was predicted by the learned component:

:::image type="content" source="../media/union-overlap-example-2.svg" alt-text="A screenshot showing an utterance with O S 9 predicted by th learned component." lightbox="../media/union-overlap-example-2.svg":::

With combine components, the entity will still return as “Proseware OS 9” with the key from the list component:

:::image type="content" source="../media/union-overlap-example-2-part-2.svg" alt-text="A screenshot showing the returned software entity." lightbox="../media/union-overlap-example-2-part-2.svg":::


### Do not combine components

Each overlapping component will return as a separate instance of the entity. Apply your own logic after prediction with this option.

#### Example

Suppose you have an entity called Software that has a list component, which contains “Proseware Desktop” as an entry. In your utterance data, you have “I want to buy Proseware Desktop Pro” with “Proseware Desktop Pro” tagged as Software:

:::image type="content" source="../media/separated-overlap-example-1.svg" alt-text="A screenshot showing an example of a learned and list entity overlapped." lightbox="../media/separated-overlap-example-1.svg":::

When you do not combine components, the entity will return twice:

:::image type="content" source="../media/separated-overlap-example-1-part-2.svg" alt-text="A screenshot showing the entity returned twice." lightbox="../media/separated-overlap-example-1-part-2.svg":::


> [!NOTE]
> During public preview of the service, there were 4 available options: **Longest overlap**, **Exact overlap**, **Union overlap**, and **Return all separately**. **Longest overlap** and **exact overlap** are deprecated and will only be supported for projects that previously had those options selected. **Union overlap** has been renamed to **Combine components**, while **Return all separately** has been renamed to **Do not combine components**.

## How to use components and options

Components give you the flexibility to define your entity in more than one way. When you combine components, you make sure that each component is represented and you reduce the number of entities returned in your predictions. 

A common practice is to extend a prebuilt component with a list of values that the prebuilt might not support. For example, if you have an **Organization** entity, which has a _General.Organization_ prebuilt component added to it, the entity may not predict all the organizations specific to your domain. You can use a list component to extend the values of the Organization entity and thereby extending the prebuilt with your own organizations.

Other times you may be interested in extracting an entity through context such as a **Product** in a retail project. You would label for the learned component of the product to learn _where_ a product is based on its position within the sentence. You may also have a list of products that you already know before hand that you'd like to always extract. Combining both components in one entity allows you to get both options for the entity.

When you do not combine components, you simply allow every component to act as an independent entity extractor. One way of using this option is to separate the entities extracted from a list to the ones extracted through the learned or prebuilt components to handle and treat them differently.


## Next steps

[Supported prebuilt components](../prebuilt-component-reference.md)
