---
title: Phrase lists
titleSuffix: Language Understanding - Azure Cognitive Services
description: Use Language Understanding (LUIS) to add app features that can improve the detection or prediction of intents and entities that categories and patterns
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 01/16/2019
ms.author: diberry
---

# Use phrase lists to boost signal of word list

You can add features to your LUIS app to improve its accuracy. Features help LUIS by providing hints that certain words and phrases are part of an app domain vocabulary. 

A [phrase list](luis-concept-feature.md) includes a group of values (words or phrases) that belong to the same class and must be treated similarly (for example, names of cities or products). What LUIS learns about one of them is automatically applied to the others as well. This list is not a closed list entity (exact text matches) of matched words.

A phrase list adds to the vocabulary of the app domain as a second signal to LUIS about those words.

## Add phrase list

LUIS allows up to 10 phrase lists per app. 

1. Open your app by clicking its name on **My Apps** page, and then click **Build**, then click **Phrase lists** in your app's left panel. 

2. On the **Phrase lists** page, click **Create new phrase list**. 
 
3. In the **Add Phrase List** dialog box, type "Cities" as the name of the phrase list. In the **Value** box, type the values of the phrase list. You can type one value at a time, or a set of values separated by commas, and then press **Enter**.

    ![Add phrase list Cities](./media/luis-add-features/add-phrase-list-cities.png)

4. LUIS can propose related values to add to your phrase list. Click **Recommend** to get a group of proposed values that are semantically related to the added value(s). You can click any of the proposed values, or click **Add All** to add them all.

    ![Phrase List Proposed Values - add all](./media/luis-add-features/related-values.png)

5. Click **These values are interchangeable** if the added phrase list values are alternatives that can be used interchangeably.

    ![Phrase List Proposed Values - select interchangeable box](./media/luis-add-features/interchangeable.png)

6. Click **Save**. The "Cities" phrase list is added to the **Phrase lists** page.

<a name="edit-phrase-list"></a>
<a name="delete-phrase-list"></a>
<a name="deactivate-phrase-list"></a>

> [!Note]
> You can delete, or deactivate a phrase list from the contextual toolbar on the **Phrase lists** page.

## Next steps

After adding, editing, deleting, or deactivating a phrase list, [train and test the app](luis-interactive-test.md) again to see if performance improves.
