---
title: Summary dashboard
titleSuffix: Language Understanding - Azure Cognitive Services
description: Fix intents with the summary dashboard, a visualized reporting tool.
services: cognitive-services
author: diberry
manager: nitinme
ms.custom: seodec18
ms.service: cognitive-services
ms.subservice: language-understanding
ms.topic: article
ms.date: 05/08/2019
ms.author: diberry
---

# How to use the Summary dashboard to improve your app

Find and fix problems with your trained app's intents. The summary dashboard displays overall app information, with highlights of intents that should be fixed. 

## What issues can be fixed from dashboard?

The three problems addressed in the dashboard are:

|Issue|Explanation|
|--|--|
|Data imbalance|This occurs when the quantity of example utterances varies beyond a significant percent. All intents need to have about the same number of example utterances - except the None intent. It should only have 10%-15% of the total quantity of utterances in the app.|
|Unclear predictions|This occurs when the top intent and the next intent's scores are close enough that they may flip on the next training, due to [negative sampling](luis-how-to-train.md#train-with-all-data). |
|Incorrect predictions|This occurs when an utterance is not predicted for the intent it is in.|

The summary dashboard shows these issues and tells you which intents are effected and suggests what you should do to improve the app. 

## Before app is trained 

Before you train the app, the summary dashboard does not contain any suggestions for fixes. Train your app to see these suggestions.  

## Check your publishing status

The **Publishing status** card contains information about the active version's last training. 

Check that the active version is the version you want to fix. 

![Summary dashboard shows app's external services, published regions, and aggregated endpoint hits.](./media/luis-how-to-use-dashboard/analytics-card-1-shows-app-summary-and-endpoint-hits.png)

This also shows any external services, published regions, and aggregated endpoint hits. 

## Review training evaluation

The **Training evaluation** card contains the aggregated summary of your app's overall accuracy by area. The score indicates its health. 

![The Training evaluation card contains the first area of information about your app's overall accuracy.](./media/luis-how-to-use-dashboard/analytics-card-2-shows-app-overall-accuracy.png)

The chart indicates the correctly predicted intents and the problem areas with different colors. As you improve the app with the suggestions, this score increases. 

The suggested fixes are separated out by problem type and are the most significant for your app. If you would prefer to review and fix issues per intent, use the **[Intents with errors](#intents-with-errors)** card at the bottom of the page. 

Each problem area has intents that need to be fixed. When you select the intent name, the **Intent** page opens with a filter applied to the utterances. This filter allows you to focus on the utterances that are causing the problem.

### Compare changes across versions

Create a new version before making changes to the app. In the new version, make the suggested changes to the intent's example utterances, then train again. On the Summary page's **Training evaluation** card, use the **Show change from trained version** to compare the changes. 

![Compare changes across versions](./media/luis-how-to-use-dashboard/compare-improvement-across-versions.png)

### Fix version by adding or editing example utterances and retraining

The primary method of fixing your app will be to add or edit example utterances and retrain. The new or changed utterances need to follow guidelines for [varied utterances](luis-concept-utterance.md).

Adding example utterances should be done by someone who:

* has a high degree of understanding of what utterances are in the different intents
* knows how utterances in one intent may be confused with another intent
* is able to decide if two intents, which are frequently confused with each other, should be collapsed into a single intent, and the different data pulled out with entities

### Patterns and phrase lists

The analytics page doesn’t indicate when to use [patterns](luis-concept-patterns.md) or [phrase lists](luis-concept-feature.md). If you do add them, it can help with incorrect or unclear predictions but won’t help with data imbalance. 

### Review data imbalance

The **data imbalance** intent list shows intents that need more utterances in order to correct the data imbalance. 

**To fix this issue**:

* Add more utterances to the intent then train again. 

Do not add utterances to the None intent unless that is suggested on the summary dashboard.

> [!Tip]
> Use the third section on the page, **Utterances per intent**, as a quick visual guide of which intents need more utterances.  

### Review incorrect predictions

The **incorrect prediction** intent list shows intents that have utterances which are used as examples for a specific intent, but are predicted for different intents. 

**To fix this issue**:

* Edit utterances to be more specific to the intent and train again.
* Combine intents if utterances are too closely aligned and train again.

### Review unclear predictions

The **unclear prediction** intent list shows intents with utterances with prediction scores that are not far enough way from their nearest rival, that the top intent for the utterance may change on the next training, due to [negative sampling](luis-how-to-train.md#train-with-all-data).

**To fix this issue**;

* Edit utterances to be more specific to the intent and train again.
* Combine intents if utterances are too closely aligned and train again.

## Utterances per intent

This card shows the overall app health across the intents. A healthy app should have a high degree of intents with the same quantity of intents (same vertical height). As you fix intents and retrain, continue to glance at this card for issues.

The following chart shows a well-balanced app with almost no issues to fix.

![The following chart shows a well-balanced app with almost no issues to fix.](./media/luis-how-to-use-dashboard/utterance-per-intent-shows-data-balance.png)

The following chart shows a poorly-balanced app with many issues to fix.

![The following chart shows a well-balanced app with almost no issues to fix.](./media/luis-how-to-use-dashboard/utterance-per-intent-shows-data-imbalance.png)

Hover over each intent's bar to get information about the intent. 

![The following chart shows a well-balanced app with almost no issues to fix.](./media/luis-how-to-use-dashboard/utterances-per-intent-with-details-of-errors.png)

## Intents with errors

This card allows you to review issues for a specific intent. The card is filtered to the most problematic intents, by default, so you know where to focus your efforts.

![The Intents with errors card allows you to review issues for a specific intent. The card is filtered to the most problematic intents, by default, so you know where to focus your efforts.](./media/luis-how-to-use-dashboard/most-problematic-intents-with-errors.png)

The top donut chart shows the issues with the intent across the three problem types. If there are issues in the three problem types, each type has its own chart below, along with any rival intents. 

## Filter intents by issue and percentage

The filter allows you to find intents with specific issue:

|Filter|Suggested percentage|Purpose|
|--|--|--|
|Most problematic intents|-|Start here. Fixing these intents will improve the app more than other fixes.|
|Correct predictions below|60%|Ideally you want correct predictions to be significant. That percentage is customer driven. If you are beginning with LUIS, start with 60%. Any intents that are correct but below 60% need to be fixed. |
|Unclear predictions above|||
|Incorrect predictions above|||

## Next steps

