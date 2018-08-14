---
title: Add features in LUIS applications | Microsoft Docs
description: Use Language Understanding (LUIS) to add app features that can improve the detection or prediction of intents and entities that categories and patterns
services: cognitive-services
author: diberry
manager: cjgronlund
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 03/30/2018
ms.author: diberry
---

# Use features to improve your LUIS app's performance  

You can add features to your LUIS app to improve its accuracy. Features help LUIS by providing hints that certain words and phrases are part of a category. If LUIS learns how to recognize one member of the category, it can treat the others similarly.

## Add phrase list

1. Open your app by clicking its name on **My Apps** page, and then click **Build**, then click **Phrase lists** in your app's left panel. 

    ![Phrase list navigation](./media/luis-add-features/phrase-list-nav.png)

2. On the **Phrase lists** page, click **Create new phrase list**. 
 
    ![Create new phrase list](./media/luis-add-features/create-new-phrase-list.png)
    
3. In the **Add Phrase List** dialog box, type "Cities" as the name of the phrase list. In the **Value** box, type the values of the phrase list. You can type one value at a time, or a set of values separated by commas, and then press **Enter**.

    ![Add phrase list Cities](./media/luis-add-features/add-phrase-list-cities.png)

4. LUIS can propose related values to add to your phrase list. Click **Recommend** to get a group of proposed values that are semantically related to the added value(s). You can click any of the proposed values, or click **Add All** to add them all.

    ![Phrase List Proposed Values](./media/luis-add-features/related-values.png)

5. Click **These values are interchangeable** if the added phrase list values are alternatives that can be used interchangeably.

    ![Phrase List Proposed Values](./media/luis-add-features/interchangeable.png)

6. Click **Save**. The "Cities" phrase list is added to the **Phrase lists** page.

    ![Phrase list added](./media/luis-add-features/phrase-list-cities.png)

## Edit phrase list

Click the name of the phrase list on the **Phrase lists** page. In the **Edit Phrase List** dialog box that opens, make any required editing changes and then click **Save**.

 ![Phrase list added](./media/luis-add-features/edit-phrase-list.png)

## Delete phrase list 

Click the ellipsis (***...***) button at the end of the row, and select **Delete**.

 ![Delete list added](./media/luis-add-features/delete-phrase-list.png)

## Deactivate phrase list 

Click the ellipsis (***...***) button at the end of the row, and select **Deactivate**.

 ![Deactivate list added](./media/luis-add-features/deactivate-phrase-list.png)

## Pattern (regular expression) feature 
**This feature is deprecated**. New pattern features cannot be added to LUIS. Any existing pattern features are supported until May 2018. Contribute to standard LUIS regular expression matching with a PR to the [Recognizers-Text Github repository](https://github.com/Microsoft/Recognizers-Text). 

## Next steps

After adding, editing, deleting, or deactivating a phrase list, [train and test the app](luis-interactive-test.md) again to see if performance improves.
