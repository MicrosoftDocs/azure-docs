---
title: Add example utterances in LUIS apps | Microsoft Docs
titleSuffix: Azure
description: Learn how to add utterances in Language Understanding (LUIS) applications.
services: cognitive-services
author: v-geberr
manager: kaiqb
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 03/26/2018
ms.author: v-geberr
---

# Add example utterances in LUIS apps

Utterances are examples of user questions or commands. To teach Language Understanding (LUIS) apps, you need to add [example utterances](luis-concept-utterance.md) to an [intent](luis-concept-intent.md).

Generally, you add an utterance first, and then you create entities and label utterances on the intent page. If you would rather create entities first, see [Add entities](Add-entities.md).

The following example uses the "BookFlight" intent in the TravelAgent app. 

## Add an utterance

1. Open the TravelAgent app by selecting its name on the **My Apps** page. Then select **Intents** in the left panel. 

2. On the **Intents** page, select the intent name **BookFlight** to open the details page.

3. Type `book 2 adult business tickets to Paris tomorrow on Air France` as a new utterance in the text box, and then press Enter. 
 
    >[!NOTE]
    >LUIS converts all utterances to lowercase.

    ![Screenshot of Intents details page, with utterance highlighted](./media/add-example-utterances/add-new-utterance-to-intent.png) 

Utterances are added to the utterances list for the current intent. 

## Edit an utterance

To edit an utterance, select the three dots (...) icon at the right end of the line for that utterance, and then select **Edit**. 

![Screenshot of Intents details page, with three dots icon highlighted](./media/add-example-utterances/edit-utterance.png) 

## Delete an utterance

To delete an utterance, select the three dots (...) icon at the right end of the line for that utterance, and then select **Delete**. 

![Screenshot of Intents details page, with Delete option highlighted](./media/add-example-utterances/delete-utterance-ddl.png)

## Reassign an utterance
Adding an utterance to an intent means that it is labeled under that intent. You can change the intent label of one or more utterances by moving them to another intent. To change the intent label, select the utterances, and then select **Reassign predicted intent**. Then select the intent where you want to move them.

![Screenshot of Intents details page, with Reassign option highlighted](./media/add-example-utterances/reassign-utterance.png) 

## Add simple entity label
In the following procedure, you create and label custom entities within the following utterance on the intent page:

```
book me 2 adult business tickets to Paris tomorrow on Air France
```

1. Select "Air France" in the utterance to label it as a simple entity.

    > [!NOTE]
    > When selecting words to label them as entities:
    > * For a single word, just select it. 
    > * For a set of two or more words, select at the beginning and then at the end of the set.

2. In the entity drop-down box that appears, you can either select an existing entity or add a new entity. To add a new entity, type its name in the text box, and then select **Create new entity**. To create the simple entity "Airline," type "Airline" in the text box and then select **Done**.
 
    ![Screenshot of Intents details page, with simple entity labeling option highlighted](./media/add-example-utterances/create-airline-simple-entity.png)

> [!TIP]
> Try the simple entity [quickstart](luis-quickstart-primary-and-secondary-data.md) to learn more.

## Add hierarchical entity and label

When booking a plane ticket, you can specify the city "Paris" as a location to or a location from. For LUIS to understand both entity types, this step builds a hierarchical entity. 

1. Select "Paris" in the same utterance, and then create the entity "Location". "Location" is a hierarchical entity, containing "ToLocation" and "FromLocation" as simple entity types.

    ![Screenshot of Create Hierarchical Entity Labeling dialog box](./media/add-example-utterances/create-location-hierarchical-entity.png)

    The text "Paris" is now labeled as a top-level hierarchical entity. 

2. After the hierarchical entity is created, select "Paris", and change the entity from "Location" to "ToLocation".

    ![Screenshot of Intents details page, with ToLocation entity highlighted](./media/add-example-utterances/label-tolocation.png)

    To learn more about hierarchical entities and how to add them, see [Add entities](Add-entities.md).

> [!TIP]
> Try the hierarchical [quickstart](luis-quickstart-intent-and-hier-entity.md) to learn more.

## Add list entity and label

A list entity identifies known synonyms of words. Add a list entity for the different seat types: first, business, and economy. When labeling an utterance by creating a new list entity, you create the list with one item in the list, such as "business". 

1. In the utterance, 
`book me 2 adult business tickets to Paris tomorrow on Air France`,
select **business**, and then create a new entity named "Seat".  

    ![Screenshot of Intents details page, with Create new entity highlighted](./media/add-example-utterances/list-seat-type-entity-create-new-entity.png)

2. In the **What type of entity do you want to create?** dialog box, add `Bus.`, `bus`, and `biz`.

    ![Screenshot of What type of entity do you want to create dialog box](./media/add-example-utterances/list-seat-type-entity.png)

3. Select **Done**.

The **Seat** list entity contains one item of business, with synonyms `Bus.`, `bus`, and `biz`. 

> [!TIP]
> Try the list entity [quickstart](luis-quickstart-intent-and-list-entity.md) to learn more.

## Add synonyms to the list entity 
Add a synonym to the list entity by selecting the word or phrase in the utterance.

1. Add a new utterance to the BookFlight intent, `Book an economy class seat to seattle`. This utterance has a new Seat list item, `economy`.
2. Select the word **economy** in the utterance, and then select **Seat** in the pop-up dialog box. Then select **Create a new synonym**.

    ![Screenshot of Intents details page, with Create a new synonym highlighted](./media/add-example-utterances/list-seat-type-entity-add-new-synonyn.png)

## Wrap entities in composite label
In the following procedure, you create and label a composite entity named `TicketsOrder` for the existing utterance:

`book me 2 adult business tickets to Paris tomorrow on Air France`

The composite entity contains three child entities: number (of tickets), Seat, and Category. (You created the Seat hierarchical category [earlier](#add-list-entity-and-label)). Label the word "business" as a Seat category. 

1. Follow these [steps](Add-entities.md#add-prebuilt-entity) to add the **number** prebuilt entity. After the entity is created, the `2` in the utterance is blue, indicating it is a labeled entity. Prebuilt entities are labeled by LUIS. 

2. Follow these [steps](#add-hierarchical-entity-and-label) to create a **Category** hierarchical entity, with values of Adult, Child, and Infant. Label the word "adult" as a Category entity. At this point, all three words should be labeled with the blue background. 

3. Select **number**.

    ![Screenshot of BookFlight Intent page, with number highlighted](./media/add-example-utterances/composite-wrap-1.png)

4. In the pop-up menu, select **Wrap in composite entity**.

    ![Screenshot of menu, with Wrap in composite entity highlighted](./media/add-example-utterances/composite-wrap-2.png)

5. Select the third word in phrase, **business**. A green bar appears below the entire phrase. 

6. Enter `TicketsOrder`, and then select **Create new composite**.

    ![Screenshot of BookFlight Intent page, with Create new composite highlighted](./media/add-example-utterances/composite-wrap-3.png)

7. In the **What type of entity do you want to create?** dialog box, enter the three existing entity children: number, Category, and Seat. 

    ![Screenshot of What type of entity do you want to create dialog box](./media/add-example-utterances/composite-wrap-4.png)

8. Select **Done**. 

9. Verify the new composite entity by hovering on the green bar under the three words. The composite name **TicketsOrder** appears.

    ![Screenshot of BookFlight Intent page, with TicketsOrder highlighted](./media/add-example-utterances/composite-wrap-final.png)

> [!TIP]
> Try the composite [tutorial](luis-tutorial-composite-entity.md) to learn more.

## Remove your custom entity label

To remove your own custom entity label from an utterance, select the entity in the utterance. Then select **Remove Label** in the entity drop-down box that appears.

![Screenshot of Intents details page, with Remove Label highlighted](./media/add-example-utterances/remove-label.png) 

Custom list entities cannot be removed, because they are predicted by LUIS.

## Add prebuilt entity label
If you add the prebuilt entities to your LUIS app, you don't need to label utterances with these entities. To learn more about prebuilt entities and how to add them, see [Add entities](Add-entities.md#add-prebuilt-entity).

## Add regular expression entity label
If you add the regular expression entities to your LUIS app, you don't need to label utterances with these entities. To learn more about regular expression entities and how to add them, see [Add entities](Add-entities.md#add-regular-expression-entities).

## Add pattern.any entity label
If you add the pattern.any entities to your LUIS app, you don't need to label utterances with these entities. To learn more about pattern.any entities and how to add them, see [Add entities](Add-entities.md#add-patternany-entity-label).

## Search in utterances
You can search for utterances that contain text (words or phrases). For example, you might notice an error that involves a particular word, and you want to find all examples that include that particular word. 

Type the word or phrase in the search box at the top right corner of the utterances list, and press Enter. The utterances list updates, to display only the utterances that include your search text. 

To cancel the search and restore your full list of utterances, delete the search text you've typed.

## Filter by intent prediction discrepancy errors
An utterance in an intent might have a discrepancy between the selected intent and the prediction score. LUIS indicates this discrepancy with a red box around the score. To filter the utterance list to only utterances with an intent prediction discrepancy, select **Errors**. 

![Screenshot of BookFlight Intent page, with prediction discrepancy score highlighted](./media/add-example-utterances/score-discrepancy.png) 

## Filter by entity type
Use the **Entity** drop-down list to filter the utterances by entity. The new filter is shown under **Filters**. To remove the filter, select the blue filter box with that word or phrase.  

![Screenshot of Intents page, with entity type filter highlighted](./media/add-example-utterances/entity-type-filter.png) 

## Switch to token view
Toggle **Tokens View** to view the tokens instead of the entity type names. On the keyboard, you can also use Control+E to toggle the view. 

![Screenshot of BookFlight intent, with Token View highlighted](./media/add-example-utterances/tokens-view.png)

## Next steps

After labeling utterances in your intents, you can now create a [composite entity](Add-entities.md).
