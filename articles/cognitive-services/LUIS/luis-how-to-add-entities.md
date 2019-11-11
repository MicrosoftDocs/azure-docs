---
title: Add entities - LUIS
titleSuffix: Azure Cognitive Services
description: Create entities to extract key data from user utterances in Language Understanding (LUIS) apps. Extracted entity data is used by the client application to fullfil customer requests. 
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 11/11/2019
ms.author: diberry
---

# Add entities to extract data 

Create entities to extract key data from user utterances in Language Understanding (LUIS) apps. Extracted entity data is used by the client application to fullfil customer requests.

The entity represents a word or phrase inside the utterance that you want extracted. Entities describe information relevant to the intent, and sometimes they are essential for your app to perform its task. You can create entities when you add an example utterance to an intent or apart from (before or after) adding an example utterance to an intent.

You can add, edit, or delete entities in your LUIS app on the **Entities** page or while labeling an utterance in the **Intent details page**. 

[!INCLUDE [Uses preview portal](includes/uses-portal-preview.md)]

## Creating is not the same as labeling an entity

You first need to create an entity before you can label the entity in the example utterance. 

You can create the entity from the **Entities** page, or you can create an entity as part of labeling the entity in the example utterance on the **Intent details page**. Both methods create entities. 

You can only _label_ an entity in an example utterance from the 

## Create a machine-learned entity

To take advantage of [decomposable entity concepts](luis-concept-model.md#v3-authoring-model-decomposition), start with the machine-learned entity. Follow the [machine-learned entity tutorial](tutorial-machine-learned-entity.md) for steps on how to create this type of entity. 

## Create text-matching entity

Text-matching entities provide several ways to extract data:

* Exact text match using a list entity
* Regular expression match using a regular expression entity
* Prebuilt entity or prebuilt domain entity to match data types (number, email, date) or subject domains
* Pattern.any to match entities that may be easily confused with the surrounding text  


<a name="add-list-entities"></a>

### Add list entities for exact matches

List entities represent a fixed, closed set of related words. 

For a Human Resources app, you can have a list of all departments along with any synonyms for the departments. You don't have to know all the values when you create the entity. You can add more after reviewing real user utterances with synonyms.

1. From the **Build** section, select **Entities** in the left panel, and then select **Create new entity**.

1. In the **Add Entity** dialog box, type `Department` in the **Entity name** box and select **List** as the **Entity type**. Select **Done**.
  
1. The list entity page allows you to add normalized names. In the **Values** textbox, enter a department name for the list, such as `HumanResources` then press Enter on the keyboard. 

1. To the right of the normalized value, enter synonyms, pressing Enter on the keyboard after each item.

1. If you want more normalized items for the list, select **Recommend** to see options from the [semantic dictionary](luis-glossary.md#semantic-dictionary).

    ![Screenshot of selecting Recommend feature to see options](./media/add-entities/hr-list-2.png)


1. Select an item in the recommended list to add it as a normalized value or select **Add all** to add all the items. 
    You can import values into an existing list entity using the following JSON format:

    ```JSON
    [
        {
            "canonicalForm": "Blue",
            "list": [
                "navy",
                "royal",
                "baby"
            ]
        },
        {
            "canonicalForm": "Green",
            "list": [
                "kelly",
                "forest",
                "avacado"
            ]
        }
    ]  
    ```

### Add a role to distinguish different contexts

A role is a named subtype based on context. It is available in all entities including prebuilt and non-machine-learned entities. 

The syntax for a role is **`{Entityname:Rolename}`** where the entity name is followed by a colon, then the role name. For example, `Move {personName} from {Location:Origin} to {Location:Destination}`.

1. From the **Build** section, select **Entities** in the left panel.

1. Select **Create new entity**. Enter the name of `Location`. Select the type **Simple** and select **Done**. 

1. Select **Entities** from the left panel, then select the new entity **Location** created in the previous step.

1. In the **Role name** textbox, enter the name of the role `Origin` and enter. Add a second role name of `Destination`. 

    ![Screenshot of adding Origin role to Location entity](./media/add-entities/roles-enter-role-name-text.png)



<a name="add-pattern-any-entities"></a>

### Add Pattern.any entities to capture free-form entities

[Pattern.any](luis-concept-entity-types.md) entities are only valid in [patterns](luis-how-to-model-intent-pattern.md), not intents. This type of entity helps LUIS find the end of entities of varying length and word choice. Because this entity is used in a pattern, LUIS knows where the end of the entity is in the utterance template.

If an app has a `FindHumanResourcesForm` intent, the extracted form title may interfere with the intent prediction. In order to clarify which words are in the form title, use a Pattern.any within a pattern. The LUIS prediction begins with the utterance. First, the utterance is checked and matched for entities, when the entities are found, then the pattern is checked and matched. 

In the utterance `Where is Request relocation from employee new to the company on the server?`, the form title is tricky because it is not contextually obvious where the title ends and where the rest of the utterance begins. Titles can be any order of words including a single word, complex phrases with punctuation, and nonsensical ordering of words. A pattern allows you to create an entity where the full and exact entity can be extracted. Once the title is found, the `FindHumanResourcesForm` intent is predicted because that is the intent for the pattern.

1. From the **Build** section, select **Entities** in the left panel, and then select **Create new entity**.

1. In the **Add Entity** dialog box, enter `HumanResourcesFormTitle` in the **Entity name** box, and select **Pattern.any** as the **Entity type**.

    To use the pattern.any entity, add a pattern on the **Patterns** page, in the **Improve app performance** section, with the correct curly brace syntax, such as `Where is **{HumanResourcesFormTitle}** on the server?`.

    If you find that your pattern, when it includes a Pattern.any, extracts entities incorrectly, use an [explicit list](luis-concept-patterns.md#explicit-lists) to correct this problem. 

<a name="add-a-role-to-pattern-based-entity"></a>


<a name="change-entity-type"></a>

## Do not change entity type

LUIS does not allow you to change the type of the entity because it doesn't know what to add or remove to construct that entity. In order to change the type, it is better to create a new entity of the correct type with a slightly different name. Once the entity is created, in each utterance, remove the old labeled entity name and add the new entity name. Once all the utterances have been relabeled, delete the old entity. 

<a name="create-a-pattern-from-an-utterance"></a>

## Create and label entity on Intent's detail page

You can create and label and entity in the Intent's detail page. This allows you to, after training, see how the entity is applied to the remaining example utterances. 

## Labeling entities in example utterances

When you select text in the example utterance to label for an entity, an in-place pop-up menu appears. Use this menu to either create or select an entity. 

You can't label entity types that use text matching because they are labeled automatically. 


## Learn more about creating and labeling entities

[!INCLUDE [Create and label entities in machine-learned tutorial](includes/decomposable-tutorial-links.md)]

## Next steps

For more information about prebuilt entities, see the [Recognizers-Text](https://github.com/Microsoft/Recognizers-Text) project. 

For information about how the entity appears in the JSON endpoint query response, see [Data Extraction](luis-concept-data-extraction.md)

Now that you have added intents, utterances and entities, you have a basic LUIS app. Learn how to [train](luis-how-to-train.md), [test](luis-interactive-test.md), and [publish](luis-how-to-publish-app.md) your app.
 
