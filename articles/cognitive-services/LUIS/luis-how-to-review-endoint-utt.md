---
title: Review endpoint utterances  for Language Understanding (LUIS) 
titleSuffix: Azure Cognitive Services
description: The breakthrough feature of LUIS is the concept of active learning. Once your LUIS has endpoint queries, active learning improves the quality of the results by selects utterances that it is unsure of. If you label these utterances, train, and publish, then LUIS identifies utterances more accurately.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/06/2018
ms.author: diberry
---

# Review endpoint utterances

The breakthrough feature of LUIS is the [concept](luis-concept-review-endpoint-utterances.md) of active learning. Once your LUIS has endpoint queries, LUIS uses active learning to improve the quality of the results. In the active learning process, LUIS examines all the endpoint utterances, and selects utterances that it is unsure of. If you label these utterances, train, and publish, then LUIS identifies utterances more accurately. 

## Filter utterances
1. Open your app (for example, TravelAgent) by selecting its name on **My Apps** page, then select **Build** in the top bar.

2. Under the **Improve app performance**, select **Review endpoint utterances**.

3. On the **Review endpoint utterances** page, select in the **Filter list by intent or entity** text box. This drop-down list includes all intents under **INTENTS** and all entities under **ENTITIES**.

    ![Utterances filter](./media/label-suggested-utterances/filter.png)

4. Select a category (intents or entities) in the drop-down list and review the utterances.

    ![Intent utterances](./media/label-suggested-utterances/intent-utterances.png)

## Label entities
LUIS replaces entity tokens (words) with entity names highlighted in blue. If an utterance has unlabeled entities, label them in the utterance. 

1. Select on the word(s) in the utterance. 

2. Select an entity from the list.

    ![Label entity](./media/label-suggested-utterances/label-entity.png)

## Align single utterance

Each utterance has a suggested intent displayed in the **Aligned intent** column. 

1. If you agree with that suggestion, select on the check mark.

    ![Keep aligned intent](./media/label-suggested-utterances/align-intent-check.png)

2. If you disagree with the suggestion, select the correct intent from the aligned intent drop-down list, then select on the check mark to the right of the aligned intent. 

    ![Align intent](./media/label-suggested-utterances/align-intent.png)

3. After you select on the check mark, the utterance is removed from the list. 

## Align several utterances

To align several utterances, check the box to the left of the utterances, then select on the **Add selected** button. 

![Align several](./media/label-suggested-utterances/add-selected.png)

## Verify aligned intent
You can verify the utterance was aligned with the correct intent by going to the **Intents** page, select the intent name, and reviewing the utterances. The utterance from **Review endpoint utterances** is in the list.

## Delete utterance
Each utterance can be deleted from the review list. Once deleted, it will not appear in the list again. This is true even if the user enters the same utterance from the endpoint. 

If you are unsure if you should delete the utterance, either move it to the None intent, or create a new intent such as "miscellaneous" and move the utterance to that intent. 

## Delete several utterances
To delete several utterances, select each item and select on the trash bin to the right of the **Add selected** button.

![Delete several](./media/label-suggested-utterances/delete-several.png)

## Next steps

To test how performance improves after you label suggested utterances, you can access the test console by selecting **Test** in the top panel. For instructions on how to test your app using the test console, see [Train and test your app](luis-interactive-test.md).
