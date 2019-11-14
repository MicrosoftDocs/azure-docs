---
title: descriptors - LUIS
titleSuffix: Azure Cognitive Services
description: Use Language Understanding (LUIS) to add app features that can improve the detection or prediction of intents and entities that categories and patterns
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: conceptual
ms.date: 11/14/2019
ms.author: diberry
---

# Use descriptors to boost signal of word list

You can add features to your LUIS app to improve its accuracy. Features help LUIS by providing hints that certain words and phrases are part of an app domain vocabulary. 

A [descriptor](luis-concept-feature.md) (phrase list) includes a group of values (words or phrases) that belong to the same class and must be treated similarly (for example, names of cities or products). What LUIS learns about one of them is automatically applied to the others as well. This list is not the same thing as a [list entity](reference-entity-list.md) (exact text matches) of matched words.

A descriptor adds to the vocabulary of the app domain as a second signal to LUIS about those words.

Review [feature concepts](luis-concept-feature.md) to understand when and why to use a descriptor. 

[!INCLUDE [Uses preview portal](includes/uses-portal-preview.md)]

## Add descriptor

1. Open your app by clicking its name on **My Apps** page, and then click **Build**, then click **Descriptors** in your app's left panel. 

1. On the **Descriptors** page, click **+ Add Descriptor**. 
 
1. In the **Create new phrase list descriptor** dialog box, type `Cities` as the name of the descriptor. In the **Value** box, type the values of the descriptors. You can type one value at a time, or a set of values separated by commas, and then press **Enter**.

    ![Add descriptor Cities](./media/luis-add-features/add-phrase-list-cities.png)

1. LUIS can propose related values to add to your descriptor. Click **Recommend** to get a group of proposed values that are semantically related to the added value(s). You can click any of the proposed values, or click **Add All** to add them all.

    ![Descriptor Proposed Values - add all](./media/luis-add-features/related-values.png)

1. Click **These values are interchangeable** if the added descriptor values are alternatives that can be used interchangeably.

    ![Descriptor Proposed Values - select interchangeable box](./media/luis-add-features/interchangeable.png)

1. Click **Done**. The "Cities" descriptor is added to the **Descriptors** page.

<a name="edit-phrase-list"></a>
<a name="delete-phrase-list"></a>
<a name="deactivate-phrase-list"></a>

> [!Note]
> You can delete, or deactivate a descriptor from the contextual toolbar on the **Descriptors** page.

## Next steps

After adding, editing, deleting, or deactivating a descriptor, [train and test the app](luis-interactive-test.md) again to see if performance improves.
