---
title: Characteristics and limitations of Personalizer
titleSuffix: Azure AI services
description: Characteristics and limitations of Personalizer
author: jcodella
ms.author: jacodel
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.date: 05/23/2022
ms.topic: conceptual
---


# Characteristics and limitations of Personalizer

Azure AI Personalizer can work in many scenarios. To understand where you can apply Personalizer, make sure the requirements of your scenario meet the [expectations for Personalizer to work](where-can-you-use-personalizer.md#expectations-required-to-use-personalizer). To understand whether Personalizer should be used and how to integrate it into your applications, see [Use Cases for Personalizer](responsible-use-cases.md). You'll find criteria and guidance on choosing use cases, designing features, and reward functions for your uses of Personalizer.

Before you read this article, it's helpful to understand some background information about [how Personalizer works](how-personalizer-works.md).


## Select features for Personalizer

Personalizing content depends on having useful information about the content and the user. For some applications and industries, some user features can be directly or indirectly considered discriminatory and potentially illegal. See the [Personalizer integration and responsible use guidelines](responsible-guidance-integration.md) on assessing features to use with Personalizer.


## Computing rewards for Personalizer

Personalizer learns to improve action choices based on the reward score provided by your application business logic.
A well-built reward score will act as a short-term proxy to a business goal that's tied to an organization's mission.
For example, rewarding on clicks will make Personalizer seek clicks at the expense of everything else, even if what's clicked is distracting to the user or not tied to a business outcome.
In contrast, a news site might want to set rewards tied to something more meaningful than clicks, such as "Did the user spend enough time to read the content?" or "Did the user click relevant articles or references?" With Personalizer, it's easy to tie metrics closely to rewards. However, you will need to be careful not to confound short-term user engagement with desired outcomes.


## Unintended consequences from reward scores

Even if built with the best intentions reward scores might create unexpected consequences or unintended results because of how Personalizer ranks content.

Consider the following examples:

- Rewarding video content personalization on the percentage of the video length watched will probably tend to rank shorter videos higher than longer videos.
- Rewarding social media shares, without sentiment analysis of how it's shared or the content itself, might lead to ranking offensive, unmoderated, or inflammatory content. This type of content tends to incite a lot of engagement but is often damaging.
- Rewarding the action on user interface elements that users don't expect to change might interfere with the usability and predictability of the user interface. For example, buttons that change location or purpose without warning might make it harder for certain groups of users to stay productive.

Implement these best practices:

- Run offline experiments with your system by using different reward approaches to understand impact and side effects.
- Evaluate your reward functions, and ask yourself how a naïve person might alter its interpretation which may result in unintentional or undesirable outcomes.
- Archive information and assets, such as models, learning policies, and other data, that Personalizer uses to function, so that results can be reproducible.


## General guidelines to understand and improve performance

Because Personalizer is based on Reinforcement Learning and learns from rewards to make better choices over time, performance isn't measured in traditional supervised learning terms used in classifiers, such as precision and recall. The performance of Personalizer is directly measured as the sum of reward scores it receives from your application via the Reward API.

When you use Personalizer, the product user interface in the Azure portal provides performance information so you can monitor and act on it. The performance can be seen in the following ways:

- If Personalizer is in Online Learning mode, you can perform [offline evaluations](concepts-offline-evaluation.md).
- If Personalizer is in [Apprentice mode](concept-apprentice-mode.md), you can see the performance metrics (events imitated and rewards imitated) in the Evaluation pane in the Azure portal.

We recommend you perform frequent offline evaluations to maintain oversight. This task will help you monitor trends and ensure effectiveness. For example, you could decide to temporarily put Personalizer in Apprentice Mode if reward performance has a dip.

### Personalizer performance estimates shown in Offline Evaluations: Limitations

We define the "performance" of Personalizer as the total rewards it obtains during use. Personalizer performance estimates shown in Offline Evaluations are computed instead of measured. It is important to understand the limitations of these estimates:

- The estimates are based on past data, so future performance may vary as the world and your users change.
- The estimates for baseline performance are computed probabilistically. For this reason, the confidence band for the baseline average reward is important. The estimate will get more precise with more events. If you use a smaller number of actions in each Rank call the performance estimate may increase in confidence as there is a higher probability that Personalizer may choose any one of them (including the baseline action) for every event.
- Personalizer constantly trains a model in near real time to improve the actions chosen for each event, and as a result, it will affect the total rewards obtained. The model performance will vary over time, depending on the recent past training data.
- Exploration and action choice are stochastic processes guided by the Personalizer model. The random numbers used for these stochastic processes are seeded from the Event Id. To ensure reproducibility of explore-exploit and other stochastic processes, use the same Event Id.
- Online performance may be capped by [exploration](concepts-exploration.md). Lowering exploration settings will limit how much information is harvested to stay on top of changing trends and usage patterns, so the balance depends on each use case.  Some use cases merit starting off with higher exploration settings and reducing them over time (e.g., start with 30% and reduce to 10%).


### Check existing models that might accidentally bias Personalizer

Existing recommendations, customer segmentation, and propensity model outputs can be used by your application as inputs to Personalizer. Personalizer learns to disregard features that don't contribute to rewards. Review and evaluate any propensity models to determine if they're good at predicting rewards and contain strong biases that might generate harm as a side effect. For example, look for recommendations that might be based on harmful stereotypes. Consider using tools such as [FairLearn](https://fairlearn.org/) to facilitate the process.


## Proactive assessments during your project lifecycle

Consider creating methods for team members, users, and business owners to report concerns regarding responsible use and a process that prioritizes their resolution. Consider treating tasks for responsible use just like other crosscutting tasks in the application lifecycle, such as tasks related to user experience, security, or DevOps.  Tasks related to responsible use and their requirements shouldn’t be afterthoughts. Responsible use should be discussed and implemented throughout the application lifecycle.


## Next steps

- [Responsible use and integration](responsible-guidance-integration.md)
- [Offline evaluations](concepts-offline-evaluation.md)
- [Features for context and actions](concepts-features.md)
