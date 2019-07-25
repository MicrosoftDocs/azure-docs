---
title: Add example utterances
titleSuffix: Language Understanding - Azure Cognitive Services
description: Example utterances are text examples of user questions or commands. To teach Language Understanding (LUIS), you need to add example utterances to an intent.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 04/01/2019
ms.author: diberry
---

# Add an entity to example utterances 

Example utterances are text examples of user questions or commands. To teach Language Understanding (LUIS), you need to add [example utterances](luis-concept-utterance.md) to an [intent](luis-concept-intent.md).

Usually, you add an example utterance to an intent first, and then you create entities and label utterances on the **Intents** page. If you would rather create entities first, see [Add entities](luis-how-to-add-entities.md).

## Marking entities in example utterances

When you select text in the example utterance to mark for an entity, an in-place pop-up menu appears. Use this menu to either create or select an entity. 

Certain entity types, such as prebuilt entities and regular expression entities, cannot be tagged in the example utterance because they are tagged automatically. 

## Add a simple entity

In the following procedure, you create and tag a custom entity within the following utterance on the **Intents** page:

```text
Are there any SQL server jobs?
```

1. Select `SQL server` in the utterance to label it as a simple entity. In the entity drop-down box that appears, you can either select an existing entity or add a new entity. To add a new entity, type its name `Job` in the text box, and then select **Create new entity**.

    ![Screenshot of entering entity name](./media/luis-how-to-add-example-utterances/create-simple-entity.png)

    > [!NOTE]
    > When selecting words to tag as entities:
    > * For a single word, just select it. 
    > * For a set of two or more words, select the first word and then the final word.

1. In the **What type of entity do you want to create?** pop-up box, verify the entity name and select the **Simple** entity type, and then select **Done**.

    A [phrase list](luis-concept-feature.md) is commonly used to boost the signal of a simple entity.

## Add a list entity

List entities represent a set of exact text matches of related words in your system. 

For a company's department list, you can have normalized values: `Accounting` and `Human Resources`. Each normalized name has synonyms. For a department, these synonyms can include any department acronyms, numbers, or slang. You don't have to know all the values when you create the entity. You can add more after reviewing real user utterances with synonyms.

1. In an example utterance on the **Intents** page, select the word or phrase that you want in the new list. When the entity drop-down appears, enter the name for the new list entity in the top textbox, then select **Create new entity**.   

1. In the **What type of entity do you want to create?** pop-up box, name the entity and select **List** as the type. Add synonyms of this list item, then select **Done**. 

    ![Screenshot of entering list entity synonyms](./media/luis-how-to-add-example-utterances/hr-create-list-2.png)

    You can add more list items or more item synonyms by labeling other utterances, or by editing the entity from the **Entities** in the left navigation. [Editing](luis-how-to-add-entities.md#add-list-entities) the entities gives you the options of entering additional items with corresponding synonyms or importing a list. 

## Add a composite entity

Composite entities are created from existing **Entities** to form a parent entity. 

Assuming the utterance, `Does John Smith work in Seattle?`, a composite utterance can return entity information of the employee name `John Smith`, and the location `Seattle` in a composite entity. The child entities must already exist in the app and be marked in the example utterance before creating the composite entity.

1. To wrap the child entities into a composite entity, select the **first** labeled entity (left-most) in the utterance for the composite entity. A drop-down list appears to show the choices for this selection.

1. Select **Wrap in composite entity** from the drop-down list. 

1. Select the last word of the composite entity (right-most). Notice a green line follows the composite entity. This is the visual indicator for a composite entity and should be under all words in the composite entity from the left-most child entity to the right-most child entity.

1. Enter the composite entity name in the drop-down list.

    When you wrap the entities correctly, a green line is under the entire phrase.

1. Validate the composite entity details on the **What type of entity do you want to create?** pop-up box then select **Done**.

    ![Screenshot of Entity details pop-up](./media/luis-how-to-add-example-utterances/hr-create-composite-3.png)

1. The composite entity displays with both blue highlights for individual entities and a green underline for the entire composite entity. 

    ![Screenshot of Intents details page, with composite entity](./media/luis-how-to-add-example-utterances/hr-create-composite-4.png)

## Add entity's role to utterance

A role is a named subtype of an entity, determined by the context of the utterance. You can mark an entity within an utterance as the entity, or select a role within that entity. Any entity can have roles including custom entities that are machine-learned (simple entities and composite entities), are not machine-learned (prebuilt entities, regular expression entities, list entities). 

Learn [how to mark an utterance with entity roles](tutorial-entity-roles.md) from a hands-on tutorial. 

## Entity status predictions

When you enter a new utterance in the LUIS portal, the utterance may have entity prediction errors. The prediction error is a difference between how an entity is labeled compared with how LUIS has predicted the entity. 

This difference is visually represented in the LUIS portal with a red underline in the utterance. The red underline may appear in entity brackets or outside of brackets. 

![Screenshot of Entity status prediction discrepancy](./media/luis-how-to-add-example-utterances/entity-prediction-error.png)

Select the words that are underlined in red in the utterance. 

The entity box displays the **Entity status** with a red exclamation mark if there is a prediction discrepancy. To see the Entity status with information about the difference between labeled and predicted entities, select **Entity status** then select the item to the right.

![Screenshot of Entity status selection](./media/luis-how-to-add-example-utterances/entity-prediction-error-correction.png)

The red-line can appear at any of the following times:

   * When an utterance is entered but before the entity is labeled
   * When the entity label is applied
   * When the entity label is removed
   * When more than one entity label is predicted for that text 

The following solutions help resolve the entity prediction discrepancy:

|Entity|Visual indicator|Prediction|Solution|
|--|--|--|--|
|Utterance entered, entity isn't labeled yet.|red underline|Prediction is correct.|Label the entity with the predicted value.|
|Unlabeled text|red underline|Incorrect prediction|The current utterances using this incorrect entity need to be reviewed across all intents. The current utterances have mistaught LUIS that this text is the predicted entity.
|Correctly labeled text|blue entity highlight, red underline|Incorrect prediction|Provide more utterances with the correctly labeled entity in a variety of places and usages. The current utterances are either not sufficient to teach LUIS that this is the entity is or similar entities appear in the same context. Similar entity should be combined into a single entity so LUIS isn't confused. Another solution is to add a phrase list to boost the significance of the words. |
|Incorrectly labeled text|blue entity highlight, red underline|Correct prediction| Provide more utterances with the correctly labeled entity in a variety of places and usages. 

## Other actions

You can perform actions on example utterances as a selected group or as an individual item. Groups of selected example utterances change the contextual menu above the list. Single items may use both the contextual menu above the list and the individual contextual ellipsis at the end of each utterance row. 

### Remove entity labels from utterances

You can remove machine-learned entity labels from an utterance on the Intents page. If the entity is not machine-learned, it can't be removed from an utterance. If you need to remove a non-machine-learned entity from the utterance, you need to delete the entity from the entire app. 

To remove a machine-learned entity label from an utterance, select the entity in the utterance. Then select **Remove Label** in the entity drop-down box that appears.

### Add a prebuilt entity label

When you add the prebuilt entities to your LUIS app, you don't need to tag utterances with these entities. To learn more about prebuilt entities and how to add them, see [Add entities](luis-how-to-add-entities.md#add-a-prebuilt-entity-to-your-app).

### Add a regular expression entity label

If you add the regular expression entities to your LUIS app, you don't need to tag utterances with these entities. To learn more about regular expression entities and how to add them, see [Add entities](luis-how-to-add-entities.md#add-regular-expression-entities-for-highly-structured-concepts).


### Create a pattern from an utterance

See [Add pattern from existing utterance on intent or entity page](luis-how-to-model-intent-pattern.md#add-pattern-from-existing-utterance-on-intent-or-entity-page).


### Add a pattern.any entity

If you add the pattern.any entities to your LUIS app, you can't label utterances with these entities. They are only valid in patterns. To learn more about pattern.any entities and how to add them, see [Add entities](luis-how-to-add-entities.md#add-patternany-entities-to-capture-free-form-entities).

## Train your app after changing model with utterances

After you add, edit, or remove utterances, [train](luis-how-to-train.md) and [publish](luis-how-to-publish-app.md) your app for your changes to affect endpoint queries. 

## Next steps

After labeling utterances in your **Intents**, you can now create a [composite entity](luis-how-to-add-entities.md).
