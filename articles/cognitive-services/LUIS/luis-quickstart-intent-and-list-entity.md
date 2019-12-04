---
title: "Tutorial: List entity - LUIS"
titleSuffix: Azure Cognitive Services
description: Get data that matches a predefined list of items. Each item on the list can have synonyms that also match exactly
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: tutorial
ms.date: 12/04/2019
ms.author: diberry
#Customer intent: As a new user, I want to understand how and why to use the list entity.
---

# Tutorial: Get exact text-matched data from an utterance with list entity

In this tutorial, understand how to get data that exactly matches a predefined list of items.

[!INCLUDE [Uses preview portal](includes/uses-portal-preview.md)]

**In this tutorial, you learn how to:**

<!-- green checkmark -->
> [!div class="checklist"]
> * Import app and use existing intent
> * Add list entity
> * Train, publish, and query app to get extracted data

[!INCLUDE [LUIS Free account](../../../includes/cognitive-services-luis-free-key-short.md)]

## What is a list entity?

A list entity is an exact text match to the words in the utterance. Each item on the list can include a list of synonyms. Use a list entity when you want an exact match.

For this imported pizza application, create a list entity for the different types of pizza crust.

A list entity is a good choice for this type of data when:

* The data values are a known set.
* The set doesn't exceed the maximum LUIS [boundaries](luis-boundaries.md) for this entity type.
* The text in the utterance is an exact match with a synonym or the canonical name. LUIS doesn't use the list beyond exact text matches. Stemming, plurals, and other variations are not resolved with just a list entity. To manage variations, consider using a [pattern](reference-pattern-syntax.md#syntax-to-mark-optional-text-in-a-template-utterance) with the optional text syntax.

> ![CAUTION]
> If you are not sure if you want a list entity or a machine-learned entity with a phrase list as a descriptor, the best and most flexible practice is to use a machine-learned entity with a phrase list as a descriptor. This method allows LUIS to learn and extend the values of the data to extract.

## Import example .json and add utterances

1.  Download and save the [app JSON file](https://github.com/Azure-Samples/cognitive-services-language-understanding/blob/master/documentation-samples/tutorials/machine-learned-entity/pizza-tutorial-with-entities.json).

    [!INCLUDE [Import app steps](includes/import-app-steps.md)]

1. The imported app has an `OrderPizza` intent. Select that intent, and add a few utterances with new crust types:

    |New utterances|
    |--|--|
    |please order a pan crust small pepperoni pizza|
    |3 thin crust hawaiian pizzas|
    |deliver 2 stuffed crust pizzas with bread sticks|
    |one thick crust pizza for pickup|
    |one deep dish pepperoni pizza|

## Crust list entity

Now that the **OrderPizza** intent has example utterances, LUIS needs to understand which words represent the crust types.

Examples of the primary name and synonyms are:

|Canonical name|Synonyms|
|--|--|
|Deep dish|deep<br>deep dish crust<br>thick<br>thick crust|
|Pan|regular<br>original<br>normal<br>regular crust<br>original crust<br>normal crust|
|Stuffed|stuffed crust|
|Thin|thin crust<br>skinny<br>skinny crust|

1. Select **Entities** in the left panel.

1. Select **+ Create**.

1. In the entity pop-up dialog, enter `CrustList` for the entity name, and  **List** for entity type. Select **Next**.

    > [!div class="mx-imgBorder"]
    > ![Screenshot of creating new entity pop-up dialog](media/luis-quickstart-intent-and-list-entity/create-pizza-crust-list-entity.png)

1. On the **Create a list entity** page, enter the canonical names and synonyms for each canonical name then select **Create**.

    > [!div class="mx-imgBorder"]
    > ![Screenshot of adding items to list entity](media/luis-quickstart-intent-and-list-entity/add-pizza-crust-items-list-entity.png)

## Train the app so the changes to the intent can be tested

[!INCLUDE [LUIS How to Train steps](../../../includes/cognitive-services-luis-tutorial-how-to-train.md)]

## Publish the app so the trained model is queryable from the endpoint

[!INCLUDE [LUIS How to Publish steps](../../../includes/cognitive-services-luis-tutorial-how-to-publish.md)]

## Get intent and entity prediction from endpoint

1. [!INCLUDE [LUIS How to get endpoint first step](../../../includes/cognitive-services-luis-tutorial-how-to-get-endpoint.md)]

1. Go to the end of the URL in the address and enter `shift Joe Smith to IT`. The last querystring parameter is `q`, the utterance **q**uery. This utterance is not the same as any of the labeled utterances so it is a good test and should return the `TransferEmployeeToDepartment` intent with `Department` extracted.

   ```json
    {
      "query": "shift Joe Smith to IT",
      "topScoringIntent": {
        "intent": "TransferEmployeeToDepartment",
        "score": 0.9775754
      },
      "intents": [
        {
          "intent": "TransferEmployeeToDepartment",
          "score": 0.9775754
        },
        {
          "intent": "None",
          "score": 0.0154493852
        }
      ],
      "entities": [
        {
          "entity": "it",
          "type": "Department",
          "startIndex": 19,
          "endIndex": 20,
          "resolution": {
            "values": [
              "Information Technology"
            ]
          }
        }
      ]
    }
   ```

## Clean up resources

[!INCLUDE [LUIS How to clean up resources](../../../includes/cognitive-services-luis-tutorial-how-to-clean-up-resources.md)]

## Related information

* [List entity](luis-concept-entity-types.md#list-entity) conceptual information
* [How to train](luis-how-to-train.md)
* [How to publish](luis-how-to-publish-app.md)
* [How to test in LUIS portal](luis-interactive-test.md)


## Next steps
This tutorial created a new intent, added example utterances, then created a list entity to extract exact text matches from utterances. After training, and publishing the app, a query to the endpoint identified the intention and returned the extracted data.

Continue with this app, [adding a composite entity](luis-tutorial-composite-entity.md).

> [!div class="nextstepaction"]
> [Add prebuilt entity with a role to the app](tutorial-entity-roles.md)

