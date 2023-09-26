---
title: Use the Offline Evaluation method - Personalizer
titleSuffix: Azure AI services
description: This article will explain how to use offline evaluation to measure effectiveness of your app and analyze your learning loop.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: azure-ai-personalizer
ms.topic: conceptual
ms.date: 02/20/2020
---

# Offline evaluation

Offline evaluation is a method that allows you to test and assess the effectiveness of the Personalizer Service without changing your code or affecting user experience. Offline evaluation uses past data, sent from your application to the Rank and Reward APIs, to compare how different ranks have performed.

Offline evaluation is performed on a date range. The range can finish as late as the current time. The beginning of the range can't be more than the number of days specified for [data retention](how-to-settings.md).

Offline evaluation can help you answer the following questions:

* How effective are Personalizer ranks for successful personalization?
    * What are the average rewards achieved by the Personalizer online machine learning policy?
    * How does Personalizer compare to the effectiveness of what the application would have done by default?
    * What would have been the comparative effectiveness of a random choice for Personalization?
    * What would have been the comparative effectiveness of different learning policies specified manually?
* Which features of the context are contributing more or less to successful personalization?
* Which features of the actions are contributing more or less to successful personalization?

In addition, Offline Evaluation can be used to discover more optimized learning policies that Personalizer can use to improve results in the future.

Offline evaluations do not provide guidance as to the percentage of events to use for exploration.

## Prerequisites for offline evaluation

The following are important considerations for the representative offline evaluation:

* Have enough data. The recommended minimum is at least 50,000 events.
* Collect data from periods with representative user behavior and traffic.

## Discovering the optimized learning policy

Personalizer can use the offline evaluation process to discover a more optimal learning policy automatically.

After performing the offline evaluation, you can see the comparative effectiveness of Personalizer with that new policy compared to the current online policy. You can then apply that learning policy to make it effective immediately in Personalizer, by downloading it and uploading it in the Models and Policy panel. You can also download it for future analysis or use.

Current policies included in the evaluation:

| Learning settings | Purpose|
|--|--|
|**Online Policy**| The current Learning Policy used in Personalizer |
|**Baseline**|The application's default (as determined by the first Action sent in Rank calls)|
|**Random Policy**|An imaginary Rank behavior that always returns random choice of Actions from the supplied ones.|
|**Custom Policies**|Additional Learning Policies uploaded when starting the evaluation.|
|**Optimized Policy**|If the evaluation was started with the option to discover an optimized policy, it will also be compared, and you will be able to download it or make it the online learning policy, replacing the current one.|

## Understanding the relevance of offline evaluation results

When you run an offline evaluation, it is very important to analyze _confidence bounds_ of the results. If they are wide, it means your application hasn’t received enough data for the reward estimates to be precise or significant. As the system accumulates more data, and you run offline evaluations over longer periods, the confidence intervals become narrower.

## How offline evaluations are done

Offline Evaluations are done using a method called **Counterfactual Evaluation**.

Personalizer is built on the assumption that users' behavior (and thus rewards) are impossible to predict retrospectively (Personalizer can't know what would have happened if the user had been shown something different than what they did see), and only to learn from measured rewards.

This is the conceptual process used for evaluations:

```
[For a given _learning policy), such as the online learning policy, uploaded learning policies, or optimized candidate policies]:
{
    Initialize a virtual instance of Personalizer with that policy and a blank model;

    [For every chronological event in the logs]
    {
        - Perform a Rank call

        - Compare the reward of the results against the logged user behavior.
            - If they match, train the model on the observed reward in the logs.
            - If they don't match, then what the user would have done is unknown, so the event is discarded and not used for training or measurement.

    }

    Add up the rewards and statistics that were predicted, do some aggregation to aid visualizations, and save the results.
}
```

The offline evaluation only uses observed user behavior. This process discards large volumes of data, especially if your application does Rank calls with large numbers of actions.


## Evaluation of features

Offline evaluations can provide information about how much of the specific features for actions or context are weighing for higher rewards. The information is computed using the evaluation against the given time period and data, and may vary with time.

We recommend looking at feature evaluations and asking:

* What other, additional, features could your application or system provide along the lines of those that are more effective?
* What features can be removed due to low effectiveness? Low effectiveness features add _noise_ into the machine learning.
* Are there any features that are accidentally included? Examples of these are: user identifiable information, duplicate IDs, etc.
* Are there any undesirable features that shouldn't be used to personalize due to regulatory or responsible use considerations? Are there features that could proxy (that is, closely mirror or correlate with) undesirable features?


## Next steps

[Configure Personalizer](how-to-settings.md)
[Run Offline Evaluations](how-to-offline-evaluation.md)
Understand [How Personalizer Works](how-personalizer-works.md)
