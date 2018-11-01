---
title: Add pattern templates instead of more utterances in LUIS apps
titleSuffix: Azure Cognitive Services
description: Learn how to add pattern templates in Language Understanding (LUIS) applications to improve prediction accuracy.
services: cognitive-services
author: diberry
manager: cgronlun

ms.service: cognitive-services
ms.component: language-understanding
ms.topic: conceptual
ms.date: 09/06/2018
ms.author: diberry
---

# How to add Patterns to improve prediction accuracy
After a LUIS app receives endpoint utterances, use the [concept](luis-concept-patterns.md) of Patterns to improve prediction accuracy for utterances that reveal a pattern in word order and word choice. Patterns use [entities](luis-concept-entity-types.md) and their roles to extract data using specific pattern syntax. 

## Add template utterance to create pattern
1. Open your app by selecting its name on **My Apps** page, and then select **Patterns** in the left panel, under **Improve app performance**.

    ![Screenshot of Patterns List](./media/luis-how-to-model-intent-pattern/patterns-1.png)

2. Select the correct intent for the pattern. 

    ![Select intent](./media/luis-how-to-model-intent-pattern/patterns-2.png)

3. In the template textbox, type the template utterance and select Enter. When you want to enter the entity name, use the correct pattern entity syntax. Begin the entity syntax with `{`. The list of entities displays. Select the correct entity, and then select Enter. 

    ![Screenshot of entity for pattern](./media/luis-how-to-model-intent-pattern/patterns-3.png)

    If your entity includes a role, indicate the role with a single colon, `:`, after the entity name, such as `{Location:Origin}`. The list of roles for the entities displays in a list. Select the role, and then select Enter. 

    ![Screenshot of entity with role](./media/luis-how-to-model-intent-pattern/patterns-4.png)

    After you select the correct entity, finish entering the pattern, and then select Enter. When you are done entering patterns, [train](luis-how-to-train.md) your app.

    ![Screenshot of entered pattern with both types of entities](./media/luis-how-to-model-intent-pattern/patterns-5.png)

## Search patterns
Searching allows you to find patterns that contain some given text.  

1. Select the magnifying glass icon.

    ![Screenshot of Patterns page with search tool icon highlighted](./media/luis-how-to-model-intent-pattern/search-icon.png)

    Type the search text in the search box at the top right corner of the patterns list and select Enter. The patterns list is updated to display only the patterns including your search text.

    ![Screenshot of Patterns page with search text in search box highlighted](./media/luis-how-to-model-intent-pattern/search-text.png)

    To cancel the search and restore your full list of patterns, delete the search text you've typed.

<!-- TBD: should I be able to click on the magnifying glass again to close the search box? It doesn't reset the list. -->

## Edit a pattern
1. To edit a pattern, select the ellipsis (***...***) button at the right end of the line for that pattern, then select **Edit**. 

    ![Screenshot of Edit menu item in pattern row](./media/luis-how-to-model-intent-pattern/patterns-three-dots.png) 

2. Enter any changes in the text box. When you are done, select enter. When you are done editing patterns, [train](luis-how-to-train.md) your app.

    ![Screenshot of editing pattern](./media/luis-how-to-model-intent-pattern/edit-pattern.png)

## Reassign individual pattern to different intent

To reassign a single pattern to a different intent, select the intent list box to the right of the pattern text, and select a different intent.

![Screenshot of reassigning individual pattern to different intent](./media/luis-how-to-model-intent-pattern/reassign-individual-pattern.png)

## Reassign several patterns to different intent

To reassign several patterns to a different intent, select the checkbox to the left of each pattern or select the top checkbox. The **Reassign intent** option displays on the tool bar. Select the correct intent for the patterns. 

![Screenshot of reassigning several patterns to different intent](./media/luis-how-to-model-intent-pattern/reassign-many-patterns.png)

## Delete a single pattern

1. To delete a pattern, select the ellipsis (***...***) button at the right end of the line for that pattern, then select **Delete**. 

    ![Screenshot of Delete utterance](./media/luis-how-to-model-intent-pattern/patterns-three-dots-ddl.png)

2. Select **Ok** to confirm the deletion.

    ![Screenshot of Delete confirmation](./media/luis-how-to-model-intent-pattern/confirm-delete.png)

## Delete several patterns

1. To delete several patterns, select the checkbox to the left of each pattern or select the top checkbox. The **Delete patterns(s)** option displays on the tool bar. Select **Delete patterns(s)**.  

    ![Screenshot of deleting several patterns](./media/luis-how-to-model-intent-pattern/delete-many-patterns.png)

2. The **Delete patterns** confirmation dialog appears. Select **Ok** to finish the deletion.

    ![Screenshot of deleting several patterns](./media/luis-how-to-model-intent-pattern/delete-many-patterns-confirmation.png)

## Filter pattern list by entity

To filter the list of patterns by a specific entity, select **Entity filters** in the toolbar above the patterns. 

![Screenshot of filtering patterns by entity](./media/luis-how-to-model-intent-pattern/filter-entities-1.png)

After the filter is applied, the entity name appears below the tool bar. 

## Filter pattern list by intent

To filter the list of patterns by a specific intent, select **Intent filters** in the toolbar above the patterns. 

![Screenshot of filtering patterns by intent](./media/luis-how-to-model-intent-pattern/filter-intents-1.png)

After the filter is applied, the intent name appears below the tool bar. 

## Remove entity or intent filter
When the pattern list is filtered, the entity or intent name appears below the toolbar. To remove the filter, select the name.

![Screenshot of filtered patterns by entity](./media/luis-how-to-model-intent-pattern/filter-entities-2.png)

The filter is removed and all patterns display. 

## Add pattern from existing utterance on intent or entity page
You can create a pattern from an existing utterance on either the **Intent** or **Entity** page. All utterances on any intent or entity page are displayed in a list with the right column providing access to utterance-level options such as **Edit**, **Delete**, and **Add as pattern**.

1. On the selected row of the utterance, select the ellipsis (***...***) button to the right of the utterance, and select **Add as pattern**.

    [![](./media/luis-how-to-model-intent-pattern/add-pattern-from-utterance.png "Screenshot of utterances table with Add pattern highlighted in options menu")](./media/luis-how-to-model-intent-pattern/add-pattern-from-utterance.png)

2. Modify the pattern according to the [syntax rules](luis-concept-patterns.md#pattern-syntax). If the utterance you selected is labeled with entities, those entities are already in the pattern with the correct syntax.

    ![Screenshot of filtered patterns by entity](./media/luis-how-to-model-intent-pattern/confirm-patterns-modal.png)

## Train your app after changing model with patterns
After you add, edit, remove, or reassign a pattern, [train](luis-how-to-train.md) and [publish](luis-how-to-publish-app.md) your app for your changes to affect endpoint queries. 

## Next steps

* Learn how to [build a pattern](luis-tutorial-pattern.md) with a pattern.any and roles.
* Learn how to [train](luis-how-to-train.md) your app.