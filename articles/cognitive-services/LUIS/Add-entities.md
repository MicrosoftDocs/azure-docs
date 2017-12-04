---
title: Add entities in LUIS apps | Microsoft Docs
description: Add entities (key data in your application's domain) in Language Understanding (LUIS) apps.
services: cognitive-services
author: cahann
manager: hsalama

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 12/01/2017
ms.author: cahann
---

# Manage entities
Entities describe information relevant to the [intent](luis-concept-intent.md), and may be essential for your app to perform its task. 

You can add, edit, or delete entities in your app through the **Entities list** on the **Entities** page. LUIS offers two main types of entities: [prebuilt entities](luis-reference-prebuilt-entities.md), and your own custom entities.

## Add prebuilt entity

1. Open the TravelAgent app by clicking its name on **My Apps** page, and then click **Entities** in the left panel. 
2. On the **Entities** page, click **Manage prebuilt entities**.

    ![Entities Page - Add first entity](./media/add-entities/manage-prebuilt-entities-button.png)

3. In **Add or remove prebuilt entities** dialog box, click the **number** and **datetimeV2** prebuilt entities. Then click **Done**.

    ![Add prebuilt entity dialog box](./media/add-entities/list-of-prebuilt-entities.png)


## Add simple entities
A simple entity is a generic entity that describes a single concept. 

1. Open the TravelAgent app by clicking its name on **My Apps** page, and then click **Entities** in the left panel. 
2. On the **Entities** page, click **Create new entity**.
3. In the **Add Entity** dialog box, type "Airline" in the **Entity name** box,  select **Simple** from the **Entity type** list, and then click **Done**.

    ![Add Entity Dialog box - Simple](./media/add-entities/create-simple-airline-entity.png)


## Add hierarchical entities
A hierarchical entity defines a relationship between a category and its members.

To add hierarchical entities, complete the following steps. Make sure to add the child entities at the same time that you create the parent entity. You can add up to 10 child entities for each parent.

1. Open the TravelAgent app by clicking its name on **My Apps** page, and then click **Entities** in the left panel. 
2. On the **Entities** page, click **Create new entity**.
3. In the **Add Entity** dialog box, type "Location" in the **Entity name** box, and then select **Hierarchical** from the **Entity type** list.

    ![Add hierarchical entity](./media/add-entities/hier-location-entity-creation.png)

4. Click **Add Child**, and then type "FromLocation" in **Child #1** box. 
5. Click **Add Child**, and then type "ToLocation" in **Child #2** box. 
    >[!NOTE]
    >To delete a child, click the trash bin icon next to it.

6. Click **Done**.

    >[!NOTE]
    >Child entity names must be unique across all entities in a single app. Two different hierarchical entities may not contain child entities with the same name. 

## Add composite entities
You can also define relationships between entities by creating composite entities. A composite entity is created by combining two or more existing entities and treating them as one entity. 

1. Add the prebuilt entity "number". For instructions, see [Add Prebuilt Entities](#add-prebuilt-entity). 
2. Add the hierarchical entity "Category", including the subtypes: "adult", "child" and "infant". Add the hierarchical entity "TravelClass" including "first", "business" and "economy". For more instructions, see [Add hierarchical entities](#add-hierarchical-entities). 

3. Open the TravelAgent app by clicking its name on **My Apps** page and click **Entities** in the app's left panel.
4. On the **Entities** page, click **Create new entity** to create a custom entity.
5. In the **Add Entity** dialog box, type "TicketsOrder" in the **Entity name** box, and then select **Composite** from the **Entity type** list.
6. Click **Add Child** to add a new child.
7. In **Child #1**, select the entity "number" from the list.
8. In **Child #2**, select the parent entity "Category" from the list. 
9. In **Child #3**, select the parent entity "TravelClass" from the list. 

    ![Add composite entity](./media/add-entities/ticketsorder-composite-entity.png)

10. Click **Done**.

    >[!NOTE]
    >To delete a child, click the trash button next to it.


## Add list entities
A list entity is an entity that is defined by a list of all its values. 

1. Open the TravelAgent app by clicking its name on **My Apps** page and click **Entities** in the app's left panel.
2. On the **Entities** page, click **Create new entity**.
3. In the **Add Entity** dialog box, type "Menu" in the **Entity name** box and select **List** as the **Entity type**.
 
    ![Add a list entity](./media/add-entities/menu-list-dialog.png)
  
4. Click **Done**. The list entity "Menu" is added and the details page where you add exact text matches is displayed. 

    ![List entity details page](./media/add-entities/menu-list-dialog-after.png)

5. On the "Menu" list entity page, type a new value to represent Airline menu items. For example, EgyptAir with exact matches of "Hindu", "Hot Diabetic". After typing each matching text, press Enter.

![Add list entity values](./media/add-entities/menu-list-eqyptair-synonyms.png)
 
## Import list entity values

 1. On the "Menu" list entity page, click **Import Lists**.
 2. In **Import New Entries** dialog box, click **Choose File** and select the JSON file that includes the list.

    ![Import list entity values](./media/add-entities/menu-list-import-json-dialog-with-file.png)

    >[!NOTE]
    >LUIS imports files with the extension ".json" only.

 3. To learn about the supported list syntax in JSON, click **Learn about supported list syntax** to expand the dialog and display an example of allowed syntax. To collapse the dialog and hide syntax, click the link title again.

 4. Click **Done**.

An example of valid json for an entity list is shown in the following JSON-formatted code:

```
[
    {
        "canonicalForm": "Egypt",
        "list": [
            "Cairo",
            "Alexandria"
        ]
    },
    {
        "canonicalForm": "USA",
        "list": [
            "California",
            "Texas"
        ]
    }
]  
```

## Edit entity name
On the **Entities** list page, select the entity in the list. This action takes you to the **Entity** page.

* On the **Entity** page, you edit the entity name by selecting the edit icon next to the entity name. The entity type is not editable. 

## Delete entity

* On the **Entity** page, click the **Delete Entity** button. Then, click **Ok** in the confirmation message to confirm deletion.
 
    ![Delete Entity](./media/add-entities/entity-delete.png)

    >[!NOTE]
    >* Deleting a hierarchical entity deletes all its children entities.
    >* Deleting a composite entity deletes only the composite and breaks the composite relationship, but doesn't delete the entities forming it.

## Search utterances
Type the search text in the search box at the top right corner of the utterances list and press Enter. The utterances list is updated to display only the utterances including your search text. For example, in the following screenshot, only the utterances that contain the search word "adult" are displayed.  

![Labeled Utterances for an entity](./media/add-entities/entity-search-utterance.png)

## Next steps
Now that you have added intents, utterances and entities, you have a basic LUIS app. Learn how to [add features](Add-Features.md) to improve the app.
 
