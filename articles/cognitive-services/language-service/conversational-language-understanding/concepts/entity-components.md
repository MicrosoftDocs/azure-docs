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
ms.date: 11/02/2021
ms.author: aahi
ms.custom: language-service-clu, ignite-fall-2021
---

# Entity components

In Conversational Language Understanding, entities are relevant pieces of information that are extracted from your utterances. An entity can be extracted by different methods. They can be learned through context, matched from a list, or detected by a prebuilt recognized entity. Every entity in your project is composed of one or more of these methods, which are defined as your entity's components. When an entity is defined by more than one component, their predictions can overlap. You can determine the behavior of an entity prediction when its components overlap by using a fixed set of options in the **Overlap Method**.

## Component types

An entity component determines a way you can extract the entity. An entity can simply contain one component, which would determine the only method that would be used to extract the entity, or multiple components to expand the ways in which the entity is defined and extracted.

### Learned component

The learned component uses the entity tags you label your utterances with to train a machine learned model. The model learns to predict where the entity is, based on the context within the utterance. Your labels provide examples of where the entity is expected to be present in an utterance, based on the meaning of the words around it and as the words that were labeled. This component is only defined if you add labels by tagging utterances for the entity. If you do not tag any utterances with the entity, it will not have a learned component.

:::image type="content" source="../media/learned-component.png" alt-text="A screenshot showing an example of learned components for entities." lightbox="../media/learned-component.png":::

### List component

The list component represents a fixed, closed set of related words along with their synonyms. The component performs an exact text match against the list of values you provide as synonyms. Each synonym belongs to a "list key" which can be used as the normalized, standard value for the synonym that will return in the output if the list component is matched. List keys are **not** used for matching.


:::image type="content" source="../media/list-component.png" alt-text="A screenshot showing an example of list components for entities." lightbox="../media/list-component.png":::

### Prebuilt component

The prebuilt component allows you to select from a library of common types such as numbers, datetimes, and names. When added, a prebuilt component is automatically detected. You can have up to 5 prebuilt components per entity. See [the list of supported prebuilt components](../prebuilt-component-reference.md) for more information.


:::image type="content" source="../media/prebuilt-component.png" alt-text="A screenshot showing an example of prebuilt components for entities." lightbox="../media/prebuilt-component.png":::


## Overlap methods

When multiple components are defined for an entity, their predictions may overlap. When an overlap occurs, each entity's final prediction is determined by one of the following options.

### Longest overlap

When two or more components are found in the text and the overlap method is used, the component with the **longest set of characters** is returned.

This option is best used when you're interested in extracting the longest possible prediction by the different components. This method guarantees that whenever there is confusion (overlap), the returned component will be the longest.

#### Examples

If "Palm Beach" was matched by the List component and "Palm Beach Extension" was predicted by the Learned component, then "**Palm Beach Extension**" is returned because it is the longest set of characters in this overlap.

:::image type="content" source="../media/return-longest-overlap-example-1.svg" alt-text="A screenshot showing an example of longest overlap results for components." lightbox="../media/return-longest-overlap-example-1.svg":::

If "Palm Beach" was matched by the List component and "Beach Extension" was predicted by the Learned component, then "**Beach Extension**" is returned because it is the component with longest set of characters in this overlap.

:::image type="content" source="../media/return-longest-overlap-example-2.svg" alt-text="A screenshot showing a second example of longest overlap results for components." lightbox="../media/return-longest-overlap-example-2.svg":::

If "Palm Beach" was matched from the List component and "Extension" was predicted by the Learned component, then 2 separate instances of the entities are returned, as there is no overlap between them: one for "**Palm Beach**" and one for "**Extension**", as no overlap has occurred in this instance.

:::image type="content" source="../media/return-longest-overlap-example-3.svg" alt-text="A screenshot showing a third example of longest overlap results for components." lightbox="../media/return-longest-overlap-example-3.svg":::

### Exact overlap

All components must overlap at the **exact same characters** in the text for the entity to return. If one of the defined components is not matched or predicted, the entity will not return.

This option is best when you have a strict entity that needs to have several components detected at the same time to be extracted.

#### Examples

If "Palm Beach" was matched by the list component and "Palm Beach" was predicted by the learned component, and those were the only 2 components defined in the entity, then "**Palm Beach**" is returned because all the components overlapped at the exact same characters.

:::image type="content" source="../media/require-exact-overlap-example-1.svg" alt-text="A screenshot showing an example of exact overlap results for components." lightbox="../media/require-exact-overlap-example-1.svg":::

If "Palm Beach" was matched by the list component and "Beach Extension" was predicted by the learned component, then the entity is **not** returned because all the components did not overlap at the exact same characters.

:::image type="content" source="../media/require-exact-overlap-example-2.svg" alt-text="A screenshot showing a second example of exact overlap results for components." lightbox="../media/require-exact-overlap-example-2.svg":::

If "Palm Beach" was matched from the list component and "Extension" was predicted by the learned component, then the entity is **not** returned because no overlap has occurred in this instance.

:::image type="content" source="../media/require-exact-overlap-example-3.svg" alt-text="A screenshot showing a third example of exact overlap results for components." lightbox="../media/require-exact-overlap-example-3.svg":::

### Union overlap

When two or more components are found in the text and overlap, the **union** of the components' spans are returned.

This option is best when you're optimizing for recall and attempting to get the longest possible match that can be combined.

#### Examples

If "Palm Beach" was matched by the list component and "Palm Beach Extension" was predicted by the learned component, then "**Palm Beach Extension**" is returned because the first character at the beginning of the overlap is the "P" in "Palm", and the last letter at the end of the overlapping components is the "n" in "Extension".

:::image type="content" source="../media/return-union-example-1.svg" alt-text="A screenshot showing an example of union overlap results for components." lightbox="../media/return-union-example-1.svg":::

If "Palm Beach" was matched by the list component and "Beach Extension" was predicted by the learned component, then "**Palm Beach Extension**" is returned because the first character at the beginning of the overlap is the "P" in "Palm", and the last letter at the end of the overlapping components is the "n" in "Extension".

:::image type="content" source="../media/return-union-example-2.svg" alt-text="A screenshot showing a second example of union overlap results for components." lightbox="../media/return-union-example-2.svg":::

If "New York" was predicted by the prebuilt component, "York Beach" was matched by the list component, and "Beach Extension" was predicted by the learned component, then " __**New York Beach Extension**__" is returned because the first character at the beginning of the overlap is the "N" in "New" and the last letter at the end of the overlapping components is the "n" in "Extension".

:::image type="content" source="../media/return-union-example-3.svg" alt-text="A screenshot showing a third example of union overlap results for components." lightbox="../media/return-union-example-3.svg":::

### Return all separately

Every component's match or prediction is returned as a **separate instance** of the entity.

This option is best when you'd like to apply your own overlap logic for the entity after the prediction.

#### Examples

If "Palm Beach" was matched by the list component and "Palm Beach Extension" was predicted by the learned component, then the entity returns two instances: one for "**Palm Beach**" and another for "**Palm Beach Extension**".

:::image type="content" source="../media/return-all-overlaps-example-1.svg" alt-text="A screenshot showing an example of returning all overlap results for components." lightbox="../media/return-all-overlaps-example-1.svg":::

If "New York" was predicted by the prebuilt component, "York Beach" was matched by the list component, and "Beach Extension" was predicted by the learned component, then the entity returns with 3 instances: one for "**New York**", one for "**York Beach**", and one for "**Beach Extension**".

:::image type="content" source="../media/return-all-overlaps-example-2.svg" alt-text="A screenshot showing a second example of returning all overlap results for components." lightbox="../media/return-all-overlaps-example-2.svg":::

## Next steps

[Supported prebuilt components](../prebuilt-component-reference.md)
