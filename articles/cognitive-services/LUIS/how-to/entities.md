---
title: How to use entities in LUIS
description:  Learn how to use entities with LUIS.
ms.service: cognitive-services
ms.author: aahi
author: aahill
ms.manager: nitinme
ms.subservice: language-understanding
ms.topic: how-to
ms.date: 01/05/2022
---

# Add entities to extract data

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]


Create entities to extract key data from user utterances in Language Understanding (LUIS) apps. Extracted entity data is used by your client application to fulfill customer requests.

The entity represents a word or phrase inside the utterance that you want extracted. Entities describe information relevant to the intent, and sometimes they are essential for your app to perform its task.

## How to create a new entity

The following process works for [machine learned entities](../concepts/entities.md#machine-learned-ml-entity), [list entities](../concepts/entities.md#list-entity), and [regular expression entities](../concepts/entities.md#regex-entity).

1. Sign in to the [LUIS portal](https://www.luis.ai/), and select your  **Subscription**  and  **Authoring resource**  to see the apps assigned to that authoring resource.
2. Open your app by selecting its name on  **My Apps**  page.
3. Select **Build** from the top navigation menu, then select **Entities** from the left panel, Select  **+ Create** , then select the entity type.
4. Continue configuring the entity. Select  **Create**  when you are done.

## Create a machine learned entity
Following the pizza example, we would need to create a "PizzaOrder" entity to extract pizza orders from utterances.

1. Select **Build** from the top navigation menu, then select **Entities** from the left panel
2. In the  **Create an entity type**  dialog box, enter the name of the entity and select  [**Machine learned**](../concepts/entities.md#machine-learned-ml-entity) , select. To add sub-entities, select  **Add structure**. Then select  **Create**.

    :::image type="content" source="../media/add-entities/machine-learned-entity-with-structure.png" alt-text="A screenshot creating a machine learned entity." lightbox="../media/add-entities/machine-learned-entity-with-structure.png":::

    A pizza order might include many details, like quantity and type. To add these details, we would create a subentity.

3. In  **Add subentities** , add a subentity by selecting the  **+**  on the parent entity row.

    :::image type="content" source="../media/add-entities/machine-learned-entity-with-subentities.png" alt-text="A screenshot of adding subentities." lightbox="../media/add-entities/machine-learned-entity-with-subentities.png":::

4. Select  **Create**  to finish the creation process.

## Add a feature to a machine learned entity
Some entities include many details. Imagine a "PizzaOrder" entity, it may include "_ToppingModifiers_" or "_FullPizzaWithModifiers_". These could be added as features to a machine learned entity.

1. Select **Build** from the top navigation bar, then select **Entities** from the left panel.
2. Add a feature by selecting  **+ Add feature**  on the entity or subentity row.
3. Select one of the existing entities and phrase lists.
4. If the entity should only be extracted if the feature is found, select the asterisk for that feature.

    :::image type="content" source="../media/add-entities/machine-learned-entity-schema-with-features.png" alt-text="A screenshot of adding feature to entity." lightbox="../media/add-entities/machine-learned-entity-schema-with-features.png":::

## Create a regular expression entity
For extracting structured text or a predefined sequence of alphanumeric values, use regular expression entities. For example, _OrderNumber_ could be predefined to be exactly 5 characters with type numbers ranging between 0 and 9.

1. Select **Build** from the top navigation bar, then select **Intents** from the left panel
2. Select  **+ Create**.
3. In the  **Create an entity type**  dialog box, enter the name of the entity and select  **RegEx** , enter the regular expression in the  **Regex**  field and select  **Create**.
 
    :::image type="content" source="../media/add-entities/add-regular-expression-entity.png" alt-text="A screenshot of creating a regular expression entity." lightbox="../media/add-entities/add-regular-expression-entity.png":::

## Create a list entity

List entities represent a fixed, closed set of related words. While you, as the author, can change the list, LUIS won't grow or shrink the list. You can also import to an existing list entity using a [list entity .json format](../reference-entity-list.md#example-json-to-import-into-list-entity).

Use the procedure to create a list entity. Once the list entity is created, you don't need to label example utterances in an intent. List items and synonyms are matched using exact text. A "_Size_" entity could be of type list, and it will include different sizes like "_small_", "_medium_", "_large_" and "_family_".

1. From the  **Build**  section, select  **Entities**  in the left panel, and then select  **+ Create**.
2. In the  **Create an entity type**  dialog box, enter the name of the entity, such as _Size_ and select  **List**.
3. In the  **Create a list entity**  dialog box, in the  **Add new sublist....** , enter the list item name, such as _large_. Also, you can add synonyms to a list item like _huge_ and _mega_ for item _large_.

    :::image type="content" source="../media/add-entities/create-list-entity-colors.png" alt-text="Create a list of sizes as a list entity in the Entity detail page." lightbox="../media/add-entities/create-list-entity-colors.png":::

4. When you are finished adding list items and synonyms, select  **Create**.

When you are done with a group of changes to the app, remember to  **Train**  the app. Do not train the app after a single change.

> [!NOTE]
> This procedure demonstrates creating and labeling a list entity from an example utterance in the **Intent detail** page. You can also create the same entity from the **Entities** page.

## Add a prebuilt domain entity

1. Select  **Entities**  in the left side.
2. On the  **Entities**  page, select  **Add prebuilt domain entity**.
3. In  **Add prebuilt domain models**  dialog box, select the prebuilt domain entity.
4. Select  **Done**. After the entity is added, you do not need to train the app.

## Add a prebuilt entity
To recognize common types of information, add a [prebuilt entity](../concepts/entities.md#prebuilt-entities)
1. Select  **Entities**  in the left side.
2. On the  **Entities**  page, select  **Add prebuilt entity**.
3. In  **Add prebuilt entities**  dialog box, select the prebuilt entity.

    :::image type="content" source="../media/luis-prebuilt-domains/add-prebuilt-entity.png" alt-text="A screenshot showing the dialog box for a prebuilt entity." lightbox="../media/luis-prebuilt-domains/add-prebuilt-entity.png":::

4. Select  **Done**. After the entity is added, you do not need to train the app.

## Add a role to distinguish different contexts
A role is a named subtype of an entity, based on context. In the following utterance, there are two locations, and each is specified semantically by the words around it such as to and from:

_Pick up the pizza order from Seattle and deliver to New York City._

In this procedure, add origin and destination roles to a prebuilt geographyV2 entity.

1. From the  **Build**  section, select  **Entities**  in the left panel.
2. Select  **+ Add prebuilt entity**. Select  **geographyV2**  then select  **Done**. A prebuilt entity will be added to the app.

If you find that your pattern, when it includes a Pattern.any, extracts entities incorrectly, use an [explicit list](../reference-pattern-syntax.md#explicit-lists) to correct this problem.

1. Select the newly added prebuilt geographyV2 entity from the  **Entities**  page list of entities.
2. To add a new role, select  **+**  next to  **No roles added**.
3. In the  **Type role...**  textbox, enter the name of the role Origin then enter. Add a second role name of Destination then enter.

    :::image type="content" source="../media/how-to-add-entities/add-role-to-prebuilt-geographyv2-entity.png" alt-text="A screenshot showing how to add an origin role to a location entity." lightbox="../media/how-to-add-entities//add-role-to-prebuilt-geographyv2-entity.png":::

The role is added to the prebuilt entity but isn't added to any utterances using that entity.

## Create a pattern.any entity
Patterns are designed to improve accuracy when multiple utterances are very similar. A pattern allows you to gain more accuracy for an intent without providing several more utterances. The  [**Pattern.any**](../concepts/entities.md#patternany-entity) entity is only available with patterns. See the [patterns article](../concepts/patterns-features.md) for more information. 

## Next steps

* [Label your example utterances](label-utterances.md)
* [Train and test your application](train-test.md)
