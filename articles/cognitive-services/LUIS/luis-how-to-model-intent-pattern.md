---
title: Patterns add accuracy
titleSuffix: Language Understanding - Azure Cognitive Services
description: Add pattern templates to improve prediction accuracy in Language Understanding (LUIS) applications.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 04/01/2019
ms.author: diberry
---

# How to add patterns to improve prediction accuracy
After a LUIS app receives endpoint utterances, use a [pattern](luis-concept-patterns.md) to improve prediction accuracy for utterances that reveal a pattern in word order and word choice. Patterns use specific [syntax](luis-concept-patterns.md#pattern-syntax) to indicate the location of: [entities](luis-concept-entity-types.md), entity [roles](luis-concept-roles.md), and optional text.

## Add template utterance to create pattern
1. Open your app by selecting its name on **My Apps** page, and then select **Patterns** in the left panel, under **Improve app performance**.

    ![Screenshot of Patterns List](./media/luis-how-to-model-intent-pattern/patterns-1.png)

2. Select the correct intent for the pattern. 

    ![Select intent](./media/luis-how-to-model-intent-pattern/patterns-2.png)

3. In the template textbox, type the template utterance and select Enter. When you want to enter the entity name, use the correct pattern entity syntax. Begin the entity syntax with `{`. The list of entities displays. Select the correct entity, and then select Enter. 

    ![Screenshot of entity for pattern](./media/luis-how-to-model-intent-pattern/patterns-3.png)

    If your entity includes a [role](luis-concept-roles.md), indicate the role with a single colon, `:`, after the entity name, such as `{Location:Origin}`. The list of roles for the entities displays in a list. Select the role, and then select Enter. 

    ![Screenshot of entity with role](./media/luis-how-to-model-intent-pattern/patterns-4.png)

    After you select the correct entity, finish entering the pattern, and then select Enter. When you are done entering patterns, [train](luis-how-to-train.md) your app.

    ![Screenshot of entered pattern with both types of entities](./media/luis-how-to-model-intent-pattern/patterns-5.png)

## Train your app after changing model with patterns
After you add, edit, remove, or reassign a pattern, [train](luis-how-to-train.md) and [publish](luis-how-to-publish-app.md) your app for your changes to affect endpoint queries. 

<a name="search-patterns"></a>
<a name="edit-a-pattern"></a>
<a name="reassign-individual-pattern-to-different-intent"></a>
<a name="reassign-several-patterns-to-different-intent"></a>
<a name="delete-a-single-pattern"></a>
<a name="delete-several-patterns"></a>
<a name="filter-pattern-list-by-entity"></a>
<a name="filter-pattern-list-by-intent"></a>
<a name="remove-entity-or-intent-filter"></a>
<a name="add-pattern-from-existing-utterance-on-intent-or-entity-page"></a>

## Use contextual toolbar

The contextual toolbar above the patterns list allows you to:

* Search for patterns
* Edit a pattern
* Reassign individual pattern to different intent
* Reassign several patterns to different intent
* Delete-a-single-pattern
* Delete several patterns
* Filter pattern list by entity
* Filter-pattern-list-by-intent
* Remove entity or intent filter
* Add pattern from existing utterance on intent or entity page

## Next steps

* Learn how to [build a pattern](luis-tutorial-pattern.md) with a pattern.any and roles with a tutorial.
* Learn how to [train](luis-how-to-train.md) your app.
