---
title: Review user utterances - LUIS
titleSuffix: Azure Cognitive Services
description: Review utterances captured by active learning to select intent and mark entities for read-world utterances; accept changes, train, and publish.
services: cognitive-services

manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: how-to
ms.date: 04/16/2021

---

# How to improve the LUIS app by reviewing endpoint utterances

The process of reviewing endpoint utterances for correct predictions is called [Active learning](luis-concept-review-endpoint-utterances.md). Active learning captures endpoint queries and selects user's endpoint utterances that it is unsure of. You review these utterances to select the intent and mark entities for these real-world utterances. Accept these changes into your example utterances then train and publish. LUIS then identifies utterances more accurately.

## Log user queries to enable active learning

To enable active learning, you must log user queries. This is accomplished by calling the [endpoint query](luis-get-started-create-app.md#query-the-v3-api-prediction-endpoint) with the `log=true` querystring parameter and value.

Use the LUIS portal to construct the correct endpoint query.

1. Sign in to the [LUIS portal](https://www.luis.ai), and select your **Subscription** and **Authoring resource** to see the apps assigned to that authoring resource.
1. Open your app by selecting its name on **My Apps** page.
1. Go to the **Manage** section, then select **Azure resources**.
1. For the assigned prediction resource, select **Change query parameters**.

    > [!div class="mx-imgBorder"]
    > ![Screenshot shows the Change query parameters link.](./media/luis-tutorial-review-endpoint-utterances/azure-portal-change-query-url-settings.png)

1. Toggle **Save logs** then save by selecting **Done**.

    > [!div class="mx-imgBorder"]
    > ![Use LUIS portal to save logs, which is required for active learning.](./media/luis-tutorial-review-endpoint-utterances/luis-portal-manage-azure-resource-save-logs.png)

     This action changes the example URL by adding the `log=true` querystring parameter. Copy and use the changed example query URL when making prediction queries to the runtime endpoint.

## Correct intent predictions to align utterances

Each utterance has a suggested intent displayed in the **Aligned intent** column.

> [!div class="mx-imgBorder"]
> [![Review endpoint utterances that LUIS is unsure of](./media/label-suggested-utterances/review-endpoint-utterances.png)](./media/label-suggested-utterances/review-endpoint-utterances.png#lightbox)

If you agree with that intent, select the check mark. If you disagree with the suggestion, select the correct intent from the aligned intent drop-down list, then select on the check mark to the right of the aligned intent. After you select on the check mark, the utterance is moved to the intent and removed from the **Review Endpoint Utterances** list.

> [!TIP]
> It is important to go to the Intent details page to review and correct the entity predictions from all example utterances from the **Review Endpoint Utterances** list.

## Delete utterance

Each utterance can be deleted from the review list. Once deleted, it will not appear in the list again. This is true even if the user enters the same utterance from the endpoint.

If you are unsure if you should delete the utterance, either move it to the None intent, or create a new intent such as `miscellaneous` and move the utterance to that intent.

## Disable active learning

To disable active learning, don't log user queries. This is accomplished by setting the [endpoint query](luis-get-started-create-app.md#query-the-v3-api-prediction-endpoint) with the `log=false` querystring parameter and value or not using the querystring value because the default value is false.

## Next steps

To test how performance improves after you label suggested utterances, you can access the test console by selecting **Test** in the top panel. For instructions on how to test your app using the test console, see [Train and test your app](luis-interactive-test.md).
