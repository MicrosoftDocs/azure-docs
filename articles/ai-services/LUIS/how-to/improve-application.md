---
title: How to improve LUIS application
description:  Learn how to improve LUIS application
ms.service: cognitive-services
ms.author: aahi
author: aahill
ms.manager: nitinme
ms.subservice: language-understanding
ms.topic: how-to
ms.date: 01/07/2022
---

# How to improve a LUIS app

[!INCLUDE [deprecation notice](../includes/deprecation-notice.md)]


Use this article to learn how you can improve your LUIS apps, such as reviewing for correct predictions, and working with optional text in utterances. 

## Active Learning

The process of reviewing endpoint utterances for correct predictions is called Active learning. Active learning captures queries that are sent to the endpoint, and selects user utterances that it is unsure of. You review these utterances to select the intent and mark the entities for these real-world utterances. Then you can accept these changes into your app's example utterances, then [train](./train-test.md) and [publish](./publish.md) the app. This helps LUIS identify utterances more accurately.

## Log user queries to enable active learning

To enable active learning, you must log user queries. This is accomplished by calling the [endpoint query](../luis-get-started-create-app.md#query-the-v3-api-prediction-endpoint) with the `log=true` query string parameter and value.

> [!Note]
> To disable active learning, don't log user queries. You can change the query parameters by setting log=false in the endpoint query or omit the log parameter because the default value is false for the V3 endpoint.

Use the LUIS portal to construct the correct endpoint query.

1. Sign in to the [LUIS portal](https://www.luis.ai/), and select your  **Subscription**  and  **Authoring resource**  to see the apps assigned to that authoring resource.
2. Open your app by selecting its name on  **My Apps**  page.
3. Go to the  **Manage**  section, then select  **Azure resources**.
4. For the assigned prediction resource, select  **Change query parameters**

:::image type="content" source="../media/luis-tutorial-review-endpoint-utterances/azure-portal-change-query-url-settings.png" alt-text="A screenshot showing the change query parameters link." lightbox="../media/luis-tutorial-review-endpoint-utterances/azure-portal-change-query-url-settings.png":::

5. Toggle  **Save logs**  then save by selecting  **Done**.

:::image type="content" source="../media/luis-tutorial-review-endpoint-utterances/luis-portal-manage-azure-resource-save-logs.png" alt-text="A screenshot showing how to use LUIS portal to save logs, which are required for active learning." lightbox="../media/luis-tutorial-review-endpoint-utterances/luis-portal-manage-azure-resource-save-logs.png":::

This action changes the example URL by adding the `log=true` query string parameter. Copy and use the changed example query URL when making prediction queries to the runtime endpoint.

## Correct predictions to align utterances

Each utterance has a suggested intent displayed in the  **Predicted Intent**  column, and the suggested entities in dotted bounding boxes.

:::image type="content" source="../media/label-suggested-utterances/review-endpoint-utterances.png" alt-text="A screenshot showing the page to review endpoint utterances that LUIS is unsure of" lightbox="../media/label-suggested-utterances/review-endpoint-utterances.png":::

If you agree with the predicted intent and entities, select the check mark next to the utterance. If the check mark is disabled, this means that there is nothing to confirm.
If you disagree with the suggested intent, select the correct intent from the predicted intent's drop-down list. If you disagree with the suggested entities, start labeling them. After you are done, select the check mark next to the utterance to confirm what you labeled. Select  **save utterance**  to move it from the review list and add it its respective intent.

If you are unsure if you should delete the utterance, either move it to the "*None*" intent, or create a new intent such as *miscellaneous* and move the utterance it.

## Working with optional text and prebuilt entities

Suppose you have a Human Resources app that handles queries about an organization's personnel. It might allow for current and future dates in the utterance text - text that uses `s`, `'s`, and `?`.

If you create an "*OrganizationChart*" intent, you might consider the following example utterances:

|Intent|Example utterances with optional text and prebuilt entities|
|:--|:--|
|OrgChart-Manager|"Who was Jill Jones manager on March 3?"|
|OrgChart-Manager|"Who is Jill Jones manager now?"|
|OrgChart-Manager|"Who will be Jill Jones manager in a month?"|
|OrgChart-Manager|"Who will be Jill Jones manager on March 3?"|

Each of these examples uses:
* A verb tense: "_was_", "_is_", "_will be_"
* A date: "_March 3_", "_now_", "_in a month_" 

LUIS needs these to make predictions correctly. Notice that the last two examples in the table use almost the same text except for "_in_" and "_on_".

Using patterns, the following example template utterances would allow for optional information:

|Intent|Example utterances with optional text and prebuilt entities|
|:--|:--|
|OrgChart-Manager|Who was {EmployeeListEntity}['s] manager [[on]{datetimeV2}?]|
|OrgChart-Manager|Who is {EmployeeListEntity}['s] manager [[on]{datetimeV2}?]|

The optional square brackets syntax "*[ ]*" lets you add optional text to the template utterance and can be nested in a second level "*[ [ ] ]*" and include entities or text.

> [!CAUTION]
> Remember that entities are found first, then the pattern is matched.

### Next Steps:

To test how performance improves, you can access the test console by selecting  **Test**  in the top panel. For instructions on how to test your app using the test console, see [Train and test your app](train-test.md).
