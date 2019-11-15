---
title: Label entity example utterance
titleSuffix: Azure Cognitive Services
description: Learn how to label a machine-learned entity with subcomponents in an example utterance in an intent detail page of the LUIS portal. 
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: quickstart
ms.date: 11/15/2019
ms.author: diberry
#Customer intent: As a new user, I want to label a machine-learned entity in an example utterance. 
---

# Label machine-learned entity in an example utterance

Labeling an entity in an example utterance shows LUIS has an example of the entity is and where the entity can appear in the utterance. 

## Plan entities, then create and label

Machine-learned entities can be created from the example utterances or created from the **Entities** page. 

In general, a best practice is to spend time planning the entities before creating a machine-learned entity in the portal. Then create the machine-learned entity from the example utterance with as much detail in the subcomponents and descriptors and constraints as you know at the time. The [decomposable entity tutorial](tutorial-machine-learned-entity.md) demonstrates how to use this method. 

As part of planning the entities, you may know you need text-matching entities (such as prebuilt entities, regular expression entities, or list entities). You can create these from the **Entities** page before they are labeled in example utterances. 

When labeling, you can either label individual entities then build up to a parent machine-learned entity. Or you can start with a parent machine-learned entity and decompose into child entities. 

> [!TIP] 
>Label all words that may indicate an entity, even if the words are not used when extracted in the client application. 

## Labeling machine-learned entity

Consider the phrase, `hi, please I want a cheese pizza in 20 minutes`. 

1. Select the left-most text, then select the right-most text of the entity. The _complete order_ is labeled in the following image.

    > [!div class="mx-imgBorder"]
    > ![Label complete machine-learned entity](media/label-utterances/example-1-label-machine-learned-entity-complete-order.png)

1. Select the entity from the pop-up window. The labeled complete pizza order entity includes all words (from left to right in English) that are labeled. 

> [!TIP]
> The entities available in the pop-up window are relative to the context in which the text appears. For example, if you have a 5-level machine-learned entity, and you are selecting text at the 3rd level (indicated by a labeled entity name under the example utterance), the entities available in the pop-up window are limited to the context of subcomponents of the 3rd level (4th level subcomponents). 

## Review labeled text

After labeling, review the example utterance. LUIS applies the current model to the example utterance after labeling. The solid line indicates the text has been labeled. 

> [!div class="mx-imgBorder"]
> ![Labeled complete machine-learned entity](media/label-utterances/example-1-label-machine-learned-entity-complete-order-labeled.png)

## When to train

If the current model should support your labeled entity, but the example utterance continues to show the text as predicted but not labeled, train your app.  

## Confirm predicted entity

If the visual indicator is above the utterance, it indicates the text is predicted but _not labeled yet_. To turn the prediction into a label, select the utterance, then select **Confirm entity predictions**.

> [!div class="mx-imgBorder"]
> ![Predict complete machine-learned entity](media/label-utterances/example-1-label-machine-learned-entity-complete-order-predicted.png)

## Label subcomponent entity by painting with entity palette cursor

1. In order to correct predictions (entities, which appear above the example utterance), open the entity palette. 

    > [!div class="mx-imgBorder"]
    > ![Entity palette for machine-learned entity](media/label-utterances/pizza-entity-palette-with-pizza-type-selected.png)

1. Select the entity subcomponent. This action is visually indicated with a new cursor. The cursor follows the mouse as you move in the portal. 

    > [!div class="mx-imgBorder"]
    > ![Entity palette for machine-learned entity](media/label-utterances/pizza-type-entity-palette-cursor.png)

1. In the example utterance, _paint_ the entity with the cursor. 

    > [!div class="mx-imgBorder"]
    > ![Entity palette for machine-learned entity](media/label-utterances/paint-subcomponent-with-entity-palette-cursor.png)

## Labeling matching-text entities to a machine-learned entity

Matching-text entities include prebuilt entities, regular expression entities, and list entities. You add these to a machine-learned entity, as constraints to a subcomponent, when you create or edit the machine-learned entity. 

**Once these constraints are added, you do not need to label the matching text in the example utterance.**

## Entity prediction errors

Entity prediction errors show a caution indicator. This indicates the predicted entity doesn't match the labeled entity. 

> [!div class="mx-imgBorder"]
> ![Entity palette for machine-learned entity](media/label-utterances/example-utterance-indicates-a-prediction-error.png)

## Next steps

Use the [dashboard](luis-how-to-use-dashboard.md) and [review endpoint utterances](luis-how-to-review-endpoint-utterances.md) to improve the prediction quality of your app.
