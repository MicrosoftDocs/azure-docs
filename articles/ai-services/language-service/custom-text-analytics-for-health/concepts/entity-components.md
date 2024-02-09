---
title: Entity components in custom Text Analytics for health
titleSuffix: Azure AI services
description: Learn how custom Text Analytics for health extracts entities from text
#services: cognitive-services
author: aahill
manager: nitinme
ms.service: azure-ai-language
ms.topic: conceptual
ms.date: 04/14/2023
ms.author: aahi
ms.custom: language-service-custom-ta4h
---

# Entity components in custom text analytics for health

In custom Text Analytics for health, entities are relevant pieces of information that are extracted from your unstructured input text. An entity can be extracted by different methods. They can be learned through context, matched from a list, or detected by a prebuilt recognized entity. Every entity in your project is composed of one or more of these methods, which are defined as your entity's components. When an entity is defined by more than one component, their predictions can overlap. You can determine the behavior of an entity prediction when its components overlap by using a fixed set of options in the **Entity options**.

## Component types

An entity component determines a way you can extract the entity. An entity can contain one component, which would determine the only method that would be used to extract the entity, or multiple components to expand the ways in which the entity is defined and extracted. 

The [Text Analytics for health entities](../../text-analytics-for-health/concepts/health-entity-categories.md) are automatically loaded into your project as entities with prebuilt components. You can define list components for entities with prebuilt components but you can't add learned components. Similarly, you can create new entities with learned and list components, but you can't populate them with additional prebuilt components.

### Learned component

The learned component uses the entity tags you label your text with to train a machine learned model. The model learns to predict where the entity is, based on the context within the text. Your labels provide examples of where the entity is expected to be present in text, based on the meaning of the words around it and as the words that were labeled. This component is only defined if you add labels to your data for the entity. If you do not label any data, it will not have a learned component.

The Text Analytics for health entities, which by default have prebuilt components can't be extended with learned components, meaning they do not require or accept further labeling to function.

:::image type="content" source="../media/learned-component.png" alt-text="A screenshot showing an example of learned components for entities." lightbox="../media/learned-component.png":::

### List component

The list component represents a fixed, closed set of related words along with their synonyms. The component performs an exact text match against the list of values you provide as synonyms. Each synonym belongs to a "list key", which can be used as the normalized, standard value for the synonym that will return in the output if the list component is matched. List keys are **not** used for matching.

In multilingual projects, you can specify a different set of synonyms for each language. While using the prediction API, you can specify the language in the input request, which will only match the synonyms associated to that language.


:::image type="content" source="../media/list-component.png" alt-text="A screenshot showing an example of list components for entities." lightbox="../media/list-component.png":::

### Prebuilt component

The [Text Analytics for health entities](../../text-analytics-for-health/concepts/health-entity-categories.md) are automatically loaded into your project as entities with prebuilt components. You can define list components for entities with prebuilt components but you cannot add learned components. Similarly, you can create new entities with learned and list components, but you cannot populate them with additional prebuilt components. Entities with prebuilt components are pretrained and can extract information relating to their categories without any labels.

:::image type="content" source="../media/prebuilt-component.png" alt-text="A screenshot showing an example of prebuilt components for entities." lightbox="../media/prebuilt-component.png":::


## Entity options

When multiple components are defined for an entity, their predictions may overlap. When an overlap occurs, each entity's final prediction is determined by one of the following options.

### Combine components

Combine components as one entity when they overlap by taking the union of all the components.

Use this to combine all components when they overlap. When components are combined, you get all the extra information that’s tied to a list or prebuilt component when they are present.

#### Example

Suppose you have an entity called Software that has a list component, which contains “Proseware OS” as an entry. In your input data, you have “I want to buy Proseware OS 9” with “Proseware OS 9” tagged as Software:

:::image type="content" source="../media/union-overlap-example-1.svg" alt-text="A screenshot showing a learned and list entity overlapped." lightbox="../media/union-overlap-example-1.svg":::

By using combine components, the entity will return with the full context as “Proseware OS 9” along with the key from the list component:

:::image type="content" source="../media/union-overlap-example-1-part-2.svg" alt-text="A screenshot showing the result of a combined component." lightbox="../media/union-overlap-example-1-part-2.svg":::

Suppose you had the same utterance but only “OS 9” was predicted by the learned component:

:::image type="content" source="../media/union-overlap-example-2.svg" alt-text="A screenshot showing an utterance with O S 9 predicted by the learned component." lightbox="../media/union-overlap-example-2.svg":::

With combine components, the entity will still return as “Proseware OS 9” with the key from the list component:

:::image type="content" source="../media/union-overlap-example-2-part-2.svg" alt-text="A screenshot showing the returned software entity." lightbox="../media/union-overlap-example-2-part-2.svg":::


### Don't combine components

Each overlapping component will return as a separate instance of the entity. Apply your own logic after prediction with this option.

#### Example

Suppose you have an entity called Software that has a list component, which contains “Proseware Desktop” as an entry. In your labeled data, you have “I want to buy Proseware Desktop Pro” with “Proseware Desktop Pro” labeled as Software:

:::image type="content" source="../media/separated-overlap-example-1.svg" alt-text="A screenshot showing an example of a learned and list entity overlapped." lightbox="../media/separated-overlap-example-1.svg":::

When you do not combine components, the entity will return twice:

:::image type="content" source="../media/separated-overlap-example-1-part-2.svg" alt-text="A screenshot showing the entity returned twice." lightbox="../media/separated-overlap-example-1-part-2.svg":::


## How to use components and options

Components give you the flexibility to define your entity in more than one way. When you combine components, you make sure that each component is represented and you reduce the number of entities returned in your predictions. 

A common practice is to extend a prebuilt component with a list of values that the prebuilt might not support. For example, if you have a **Medication Name** entity, which has a `Medication.Name` prebuilt component added to it, the entity may not predict all the medication names specific to your domain. You can use a list component to extend the values of the Medication Name entity and thereby extending the prebuilt with your own values of Medication Names.

Other times you may be interested in extracting an entity through context such as a **medical device**. You would label for the learned component of the medical device to learn _where_ a medical device is based on its position within the sentence. You may also have a list of medical devices that you already know before hand that you'd like to always extract. Combining both components in one entity allows you to get both options for the entity.

When you do not combine components, you allow every component to act as an independent entity extractor. One way of using this option is to separate the entities extracted from a list to the ones extracted through the learned or prebuilt components to handle and treat them differently.


## Next steps

* [Entities with prebuilt components](../../text-analytics-for-health/concepts/health-entity-categories.md)
