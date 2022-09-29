---
title: Apprentice mode - Personalizer
description: Learn how to use apprentice mode to gain confidence in a model without changing any code.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 07/26/2022
---

# Use Apprentice mode to train Personalizer without affecting your existing application

When deploying a new Personalizer resource, it is initialized with an untrained Reinforcement Learning (RL) model. That is, it has not yet learned from any data and therefore will not perform well in practice. This is known as the "cold start" problem and is resolved over time by training the model with real data from your production environment. **Apprentice mode** is a learning behavior that helps mitigate the "cold start" problem, and allows you to gain confidence in the model _before_ it makes decisions in production, all without requiring any code change. 


[!INCLUDE [Important Blue Box - Apprentice mode pricing tier](./includes/important-apprentice-mode.md)]

## What is Apprentice mode?

Similar to how an apprentice can learn a craft by observing an expert, Apprentice mode enables Personalizer to learn by observing the decisions made by your application's current logic. The Personalizer model trains by mimicking the same decision output as the application. With each Rank API call, Personalizer can learn without impacting the existing logic and outcomes. Metrics, available from the Azure portal and the API, help you understand the performance as the model learns. Specifically, how well Personalize is matching your existing logic.

Once Personalizer has learned and attained a certain level of understanding, the developer can change the behavior from Apprentice mode to Online mode. At that time, Personalizer starts influencing the actions in the Rank API to learn how to make even smarter decisions than your current logic.

## Purpose of Apprentice Mode

Apprentice mode provides additional trust in the Personalizer service and reassurance that the data sent to Personalizer is valuable for training the model –  without risking or affecting your online traffic and customer experiences.

The two main reasons to use Apprentice mode are:

* Mitigating **Cold Starts**: Apprentice mode helps mitigate the cost of a training a "new" model in production by learning without the need to make uninformed decisions. The model is informed by your existing application logic.
* **Validating Action and Context Features**: Context and Action features may be inadequate, inaccurate, or sub-optimally engineered. If there are too few, too many, incorrect, noisy, or malformed features, Personalize will have difficulty training a well performing model. Performing [feature evaluations](concept-feature-evaluation.md) while in Apprentice mode, enables you to discover how effective the features are at training Personalizer and can identify areas for improving feature quality.

## When should you use Apprentice mode?

Use Apprentice mode to train Personalizer to improve its effectiveness through the following scenarios while leaving the experience of your users unaffected by Personalizer:

* You are implementing Personalizer in a new use case.
* You have significantly changed the Context or Action features.

However, Apprentice mode is not an effective way of measuring the impact Personalizer is having on improving your average reward or business metrics. It can only evaluate how well the service is learning your existing logic given the current data you are providing. To measure how effective Personalizer is at choosing the best possible action for each Rank call, use [Offline evaluations](concepts-offline-evaluation.md).

## Who should use Apprentice mode?

Apprentice mode is useful for developers, data scientists, and business decision makers:

* **Developers** can use Apprentice mode to ensure the Rank and Reward APIs are implemented correctly in the application, and that features being sent to Personalizer are free from errors and common mistakes (such as including timestamps or unique user identifiers).

* **Data scientists** can use Apprentice mode to validate that the features are effective at training the Personalizer models.

* **Business Decision Makers** can use Apprentice mode to assess the potential of Personalizer to improve results (i.e. rewards) compared to existing business logic. Specifically, whether or not Personalizer can learn from the provided data before going into Online mode. This allows them to make an informed decisions about impacting user experience, where real revenue and user satisfaction are at stake.

## Comparing Behaviors - Apprentice mode and Online mode

Learning when in Apprentice mode differs from Online mode in the following ways.

|Area|Apprentice mode|Online mode|
|--|--|--|
|Impact on User Experience| The users' experience and business metrics will not change. Personalizer is trained by observing the **default actions**, or current logic, of your application without affecting them. | Your users' experience may change as the decision is made by Personalizer and not your default action.|
|Learning speed|Personalizer will learn more slowly when in Apprentice mode compared to learning in Online mode. Apprentice mode can only learn by observing the rewards obtained by your default action without [exploration](concepts-exploration.md), which limits how much Personalizer can learn.|Learns faster because it can both _exploit_ the best action from the current model and _explore_ other actions for potentially better results.|
|Learning effectiveness "Ceiling"|Personalizer can only approximate, and never exceed, the performance of your application's current logic (the total average reward achieved by the default action). However, this approximation ceiling is reduced by exploration. For example, it is unlikely that Personalizer will achieve 100% match with your current application's logic, and is recommended that once 60%-80% matching is achieved, Personalizer can be switched to Online mode.|Personalizer should exceed the performance of your current application logic. If Personalizer's performance stalls over time, you can conduct on [offline evaluation](concepts-offline-evaluation.md) and [feature evaluation](concept-feature-evaluation.md) to pursue additional improvement. |
|Rank API return value for rewardActionId| The _rewardActionId_ will always be the Id of the default action. That is, the action you send as the first action in the Rank API request JSON. In other words, the Rank API does nothing visible for your application during Apprentice mode. |The  _rewardActionId_ will be one of the Ids provided in then Rank API call as determined by the Personalizer model.|
|Evaluations|Personalizer keeps a comparison of the reward totals received by your current application logic, and the reward totals Personalizer would be getting if it was in Online mode at that point. This comparison is available to view in the Azure portal.|Evaluate Personalizer’s effectiveness by running [Offline evaluations](concepts-offline-evaluation.md), which let you compare the total rewards Personalizer has achieved against the potential rewards of the application’s baseline.|

Note: It is unlikely for Personalizer to achieve a 100% performance match with the application's existing logic, and never exceed it. Performance matching of 60%-80% should be sufficient to switch Personalizer to Online mode.

## Limitations of Apprentice Mode
Apprentice Mode trains Personalizer model by attempting to imitate your existing application's logic, using the Context and Action features present in the Rank calls. The following factors will affect Apprentice mode's ability to learn.

### Scenarios where Apprentice Mode May Not be Appropriate:

#### Editorially chosen Content:
In some scenarios such as news or entertainment, the baseline item could be manually assigned by an editorial team. This means humans are using their knowledge about the broader world, and understanding of what may be appealing content, to choose specific articles or media out of a pool, and flagging them as "preferred" or "hero" articles. Because these editors are not an algorithm, and the factors considered by editors can be nuanced and not included as Context or Action features. Apprentice mode is unlikely to be able to predict the next baseline action. In these situations you can:

* Test Personalizer in Online Mode: Apprentice mode not predicting baselines does not imply Personalizer cannot achieve as-good or even better results. Consider putting Personalizer in Online Mode for a period of time or in an A/B test if you have the infrastructure, and then run an Offline Evaluation to assess the difference.
* Add editorial considerations and recommendations as features: Ask your editors what factors influence their choices, and see if you can add those as features in your context and action. For example, editors in a media company may highlight content while a certain celebrity is in the news: This knowledge could be added as a Context feature.

### Factors that will improve and accelerate Apprentice Mode
If apprentice mode is learning and attaining a matching performance above zero, however, performance is improving very slowly (not getting to 60% to 80% matched rewards within two weeks), it is possible that there is too little data being sent to Personalizer. The following steps may help facilitate faster learning:

1. Adding differentiating features: You can do a visual inspection of the actions in a Rank call and their features. Does the baseline action have features that are differentiated from other actions? If they look mostly the same, add more features that will make them less similar.
2. Reducing Actions per Event: Personalizer will use the "% of Rank calls to use for exploration" setting to discover preferences and trends. When a Rank call has more actions, the chance of any particular Action being chosen for exploration becomes lower. Reducing the number of actions sent in each Rank call to a smaller number (under 10) can be a temporary adjustment that may indicate whether or not Apprentice Mode has sufficient data to learn.


## Using Apprentice mode to train with historical data

If you have a significant amount of historical data that you would like to use to train Personalizer, you can use Apprentice mode to replay the data through Personalizer.

Set up the Personalizer in Apprentice Mode and create a script that calls Rank with the actions and context features from the historical data. Call the Reward API based on your calculations of the records in this data. You'll need approximately 50,000 historical events to see some results but 500,000 is recommended for higher confidence in the results.

When training from historical data, it is recommended that the data sent in (features for context and actions, their layout in the JSON used for Rank requests, and the calculation of reward in this training data set), matches the data (features and calculation of reward) available from the existing application.

Offline and post-facto data tends to be more incomplete and noisier and differs in format. While training from historical data is possible, the results from doing so may be inconclusive and not a good predictor of how well Personalizer will learn, especially if the features vary between past data and the existing application.

Typically for Personalizer, when compared to training with historical data, changing behavior to Apprentice mode and learning from an existing application is a more effective path to having an effective model, with less labor, data engineering, and cleanup work.

## Using Apprentice Mode versus A/B Tests

It is only useful to do A/B tests of Personalizer treatments once it has been validated and is learning in Online mode. In Apprentice mode, only the default action is used, which means all users would effectively see the control experience.

Even if Personalizer is just the _treatment_, the same challenge is present when validating the data is good for training Personalizer. Apprentice mode could be used instead, with 100% of traffic, and with all users getting the control (unaffected) experience.

Once you have a use case using Personalizer and learning online, A/B experiments allow you to do controlled cohorts and scientific comparison of results that may be more complex than the signals used for rewards. An example question an A/B test could answer is: `In a retail website, Personalizer optimizes a layout and gets more users to _check out_ earlier, but does this reduce total revenue per transaction?`

## Are rank calls used

## Next steps

* Learn about [active and inactive events](concept-active-inactive-events.md)
