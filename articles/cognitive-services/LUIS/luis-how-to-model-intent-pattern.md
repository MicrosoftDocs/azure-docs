---
title: Add pattern templates in LUIS apps | Microsoft Docs
titleSuffix: Azure
description: Learn how to add pattern templates in Language Understanding (LUIS) applications to improve prediction accuracy.
services: cognitive-services
author: v-geberr
manager: kaiqb 

ms.service: cognitive-services
ms.technology: luis
ms.topic: article
ms.date: 05/07/2018
ms.author: v-geberr;
---

# How to add Patterns to improve prediction accuracy
After a LUIS app receives endpoint utterances, use Patterns to improve prediction accuracy for utterances that reveal a pattern in word order. 

## Add patterns
1. Open your app by selecting its name on **My Apps** page, and then select **Patterns** in the left panel, under **Improve app performance**.

    ![Screenshot of Patterns List](./media/luis-how-to-model-intent-pattern/patterns-1.png)

2. Select the correct intent for the pattern. 

    ![Select intent](./media/luis-how-to-model-intent-pattern/patterns-2.png)

3. In the template textbox, type the utterance template and select Enter. When you want to enter the entity name, enter `{`. The list of entities displays. Select the correct entity. 

    ![Screenshot of entity for pattern](./media/luis-how-to-model-intent-pattern/patterns-3.png)

    If your entity includes a role, indicate the role with a single colon, `:`, after the entity name, such as `{Location:Origin}`. The list of roles for the entities displays in a list. Select the role. 

    ![Screenshot of entity with role](./media/luis-how-to-model-intent-pattern/patterns-4.png)

    After you select the correct entity, finish entering the pattern.

    ![Screenshot of entered pattern with both types of entities](./media/luis-how-to-model-intent-pattern/patterns-5.png)

## Search patterns
Searching allows you to find patterns that contain text.  

1. Select the magnifying glass icon.

    ![Screenshot of Patterns page with search tool icon highlighted](./media/luis-how-to-model-intent-pattern/search-icon.png)

    Type the search text in the search box at the top right corner of the patterns list and select Enter. The patterns list is updated to display only the patterns including your search text.

    ![Screenshot of Patterns page with search text in search box highlighted](./media/luis-how-to-model-intent-pattern/search-text.png)

    To cancel the search and restore your full list of patterns, delete the search text you've typed.

## Edit a pattern
1. To edit a pattern, select the three dots (...) icon at the right end of the line for that pattern then select **Edit**. 

    ![Screenshot of Edit pattern](./media/luis-how-to-model-intent-pattern/patterns-three-dots.png) 

2. Enter any changes in the text box. 

    WAITING FOR UX FIX FOR THIS IMAGE

## Reassign individual pattern to different intent

To reassign a single pattern to a different intent, select the intent list box to the right off the pattern text, and select a different intent.

![Screenshot of reassigning individual pattern to different intent](./media/luis-how-to-model-intent-pattern/reassign-individual-pattern.png)

## Reassign several patterns to different intent

To reassign several patterns to a different intent, select the checkbox to the left of each pattern or select the top checkbox. The **Reassign intent** option displays on the tool bar. Select the correct intent for the patterns. 

![Screenshot of reassigning several patterns to different intent](./media/luis-how-to-model-intent-pattern/reassign-many-patterns.png)

## Delete a single pattern

1. To delete a pattern, select the three dots (...) icon at the right end of the line for that pattern then select **Delete**. 

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

## Entity syntax in patterns
Entities in patterns are surrounded by curly brackets. Patterns can include entities, and entities with roles. Pattern.any is an entity only used in patterns. The syntax for each of these is explained in the following sections.

### Syntax to add an entity to a pattern template
To add an entity into the pattern template, surround the entity name with curly braces, such as `Who does {Employee} manage?`. 

### Syntax to add an entity and role to a pattern template
An entity role is denoted as `{entity:role}` with the entity name followed by a colon, then the role name. To add an entity with a role into the pattern template, surround the entity role name with curly braces, such as `Book a ticket from {Location.Origin} to {Location.Destination}`. 

### Syntax to add a pattern.any to pattern template
The Pattern.any entity allows you to add an entity of varying length to the pattern. As long as the pattern template is followed, the pattern.any can be any length. 

To add a **Pattern.any** entity into the pattern template, surround the Pattern.any entity with the curly braces, such as `How much does {Booktitle} cost and what format is it available in?`.  

|Book titles in the pattern|
|--|
|How much does **steal this book** cost and what format is it available in?|
|How much does **ask** cost and what format is it available in?|
|How much does **The Curious Incident of the Dog in the Night-Time** cost and what format is it available in?| 

In these book title examples, the contextual words of the book title are not confusing to LUIS. LUIS knows where the book title ends because it is in a pattern and marked with a Pattern.any entity.