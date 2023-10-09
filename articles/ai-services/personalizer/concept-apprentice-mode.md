---
title: Apprentice mode - Personalizer
description: Learn how to use apprentice mode to gain confidence in a model without changing any code.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: azure-ai-personalizer
ms.topic: conceptual
ms.date: 07/26/2022
---

# Use Apprentice mode to train Personalizer without affecting your existing application

[!INCLUDE [Deprecation announcement](includes/deprecation.md)]

When deploying a new Personalizer resource, it's initialized with an untrained, or blank model. That is, it hasn't learned from any data and therefore won't perform well in practice. This is known as the "cold start" problem and is resolved over time by training the model with real data from your production environment. **Apprentice mode** is a learning behavior that helps mitigate the "cold start" problem, and allows you to gain confidence in the model _before_ it makes decisions in production, all without requiring any code change. 

<!-- 
[!INCLUDE [Important Blue Box - Apprentice mode pricing tier](./includes/important-apprentice-mode.md)] -->

## What is Apprentice mode?

Similar to how an apprentice can learn a craft by observing an expert, Apprentice mode enables Personalizer to learn by observing the decisions made by your application's current logic. The Personalizer model trains by mimicking the same decision output as the application. With each Rank API call, Personalizer can learn without impacting the existing logic and outcomes. Metrics, available from the Azure portal and the API, help you understand the performance as the model learns. Specifically, how well Personalize is matching your existing logic (also known as the baseline policy).

Once Personalizer is able to reasonably match your existing logic 60-80% of the time, you can change the behavior from Apprentice mode to *Online mode*. At that time, Personalizer returns the best actions in the Rank API as determined by the underlying model and can learn how to make better decisions than your baseline policy.

## Why use Apprentice mode?

Apprentice mode provides a way for your model to mimic your existing decision logic before it makes online decisions used by your application. This helps to mitigate the aforementioned cold start problem and provides you with more trust in the Personalizer service and reassurance that the data sent to Personalizer is valuable for training the model. This is done without risking or affecting your online traffic and customer experiences.

The two main reasons to use Apprentice mode are:

* Mitigating **Cold Starts**: Apprentice mode helps mitigate the cost of a training a "new" model in production by learning without the need to make uninformed decisions. The model learns to mimic your existing application logic.
* **Validating Action and Context Features**: Context and Action features may be inadequate, inaccurate, or suboptimally engineered. If there are too few, too many, incorrect, noisy, or malformed features, Personalize will have difficulty training a well performing model. Conducting a [feature evaluation](how-to-feature-evaluation.md) while in Apprentice mode, enables you to discover how effective the features are at training Personalizer and can identify areas for improving feature quality.

## When should you use Apprentice mode?

Use Apprentice mode to train Personalizer to improve its effectiveness through the following scenarios while leaving the experience of your users unaffected by Personalizer:

* You're implementing Personalizer in a new scenario.
* You've made major changes to the Context or Action features.

However, Apprentice mode isn't an effective way of measuring the impact Personalizer can have on improving the average reward or your business KPIs. It can only evaluate how well the service is learning your existing logic given the current data you're providing. To measure how effective Personalizer is at choosing the best possible action for each Rank call, Personalizer must be in Online mode, or you can use [Offline evaluations](concepts-offline-evaluation.md) over a period of time when Personalizer was in Online mode.

## Who should use Apprentice mode?

Apprentice mode is useful for developers, data scientists, and business decision makers:

* **Developers** can use Apprentice mode to ensure the Rank and Reward APIs are implemented correctly in the application, and that features being sent to Personalizer are free from errors and common mistakes. Learn more about creating good [Context and Action features](concepts-features.md).

* **Data scientists** can use Apprentice mode to validate that the features are effective at training the Personalizer models. That is, the features contain useful information that allow Personalizer to learn the existing decision logic.

* **Business Decision Makers** can use Apprentice mode to assess the potential of Personalizer to improve results (that is, rewards) compared to existing business logic. Specifically, whether or not Personalizer can learn from the provided data before going into Online mode. This allows them to make an informed decision about impacting user experience, where real revenue and user satisfaction are at stake.

## Comparing Behaviors - Apprentice mode and Online mode

Learning when in Apprentice mode differs from Online mode in the following ways.

|Area|Apprentice mode|Online mode|
|--|--|--|
|Impact on User Experience| The users' experience and business metrics won't change. Personalizer is trained by observing the **baseline actions** of your current application logic, without affecting them. | Your users' experience may change as the decision is made by Personalizer and not your baseline action.|
|Learning speed|Personalizer will learn more slowly when in Apprentice mode compared to learning in Online mode. Apprentice mode can only learn by observing the rewards obtained by your default action without [exploration](concepts-exploration.md), which limits how much Personalizer can learn.|Learns faster because it can both _exploit_ the best action from the current model and _explore_ other actions for potentially better results.|
|Learning effectiveness "Ceiling"|Personalizer can only approximate, and never exceed, the performance of your application's current logic (the total average reward achieved by the baseline action). It's unlikely that Personalizer will achieve 100% match with your current application's logic, and is recommended that once 60%-80% matching is achieved, Personalizer should be switched to Online mode.|Personalizer should exceed the performance of your baseline application logic. If Personalizer's performance stalls over time, you can conduct on [offline evaluation](concepts-offline-evaluation.md) and [feature evaluation](how-to-feature-evaluation.md) to pursue additional improvements. |
|Rank API return value for rewardActionId| The _rewardActionId_ will always be the Id of the default action. That is, the action you send as the first action in the Rank API request JSON. In other words, the Rank API does nothing visible for your application during Apprentice mode. |The  _rewardActionId_ will be one of the Ids provided in then Rank API call as determined by the Personalizer model.|
|Evaluations|Personalizer keeps a comparison of the reward totals received by your current application logic, and the reward totals Personalizer would be getting if it was in Online mode at that point. This comparison is available to view in the _Monitor_ blade of your Personalizer resource in the Azure portal.|Evaluate Personalizer’s effectiveness by running [Offline evaluations](concepts-offline-evaluation.md), which let you compare the total rewards Personalizer has achieved against the potential rewards of the application’s baseline.|

Note that Personalizer is unlikely to achieve a 100% performance match with the application's baseline logic, and it will never exceed it. Performance matching of 60%-80% should be sufficient to switch Personalizer to Online mode, where Personalizer can learn better decisions and exceed the performance of your application's baseline logic.

## Limitations of Apprentice Mode
Apprentice Mode trains Personalizer model by attempting to imitate your existing application's baseline logic, using the Context and Action features present in the Rank calls. The following factors will affect Apprentice mode's ability to learn.

### Scenarios where Apprentice Mode May Not be Appropriate:

#### Editorially chosen Content:
In some scenarios such as news or entertainment, the baseline item could be manually assigned by an editorial team. This means humans are using their knowledge about the broader world, and understanding of what may be appealing content, to choose specific articles or media out of a pool, and flagging them as "preferred" or "hero" articles. Because these editors aren't an algorithm, and the factors considered by editors can be subjective and possibly unrelated to the Context or Action features. In this case, Apprentice mode may have difficulty in predicting the baseline action. In these situations you can:

* Test Personalizer in Online Mode: Consider putting Personalizer in Online Mode for time or in an A/B test if you have the infrastructure, and then run an Offline Evaluation to assess the difference between your application's baseline logic and Personalizer.
* Add editorial considerations and recommendations as features: Ask your editors what factors influence their choices, and see if you can add those as features in your context and action. For example, editors in a media company may highlight content when a certain celebrity is often in the news: This knowledge could be added as a Context feature.

### Factors that will improve and accelerate Apprentice Mode
If apprentice mode is learning and attaining a matching performance above zero, but performance is improving slowly (not getting to 60% to 80% matched rewards within two weeks), it's possible that there's too little data being sent to Personalizer. The following steps may help facilitate faster learning:

1. Adding differentiating features: You can do a visual inspection of the actions in a Rank call and their features. Does the baseline action have features that are differentiated from other actions? If they look mostly the same, add more features that will increase the diversity of the feature values.
2. Reducing Actions per Event: Personalizer will use the "% of Rank calls to use for exploration" setting to discover preferences and trends. When a Rank call has more actions, the chance of any particular Action being chosen for exploration becomes lower. Reducing the number of actions sent in each Rank call to a smaller number (under 10) can be a temporary adjustment that may indicate whether or not Apprentice Mode has sufficient data to learn.

## Using Apprentice mode to train with historical data

If you have a significant amount of historical data that you would like to use to train Personalizer, you can use Apprentice mode to replay the data through Personalizer.

Set up the Personalizer in Apprentice Mode and create a script that calls Rank with the actions and context features from the historical data. Call the Reward API based on your calculations of the records in this data. You may need approximately 50,000 historical events to see Personalizer attain a 60-80% match with your application's baseline logic. You may be able to achieve satisfactory results with fewer or more events.

When training from historical data, it's recommended that the data sent in [features for context and actions, their layout in the JSON used for Rank requests, and the calculation of reward in this training data set], matches the data [features and calculation of reward] available from your existing application.

Offline and historical data tends to be more incomplete and noisier and can differ in format from your in-production (or online) scenario. While training from historical data is possible, the results from doing so may be inconclusive and aren't necessarily a good predictor of how well Personalizer will learn in Online mode, especially if the features vary between the historical data and the current scenario.

## Using Apprentice Mode versus A/B Tests

It's only useful to do A/B tests of Personalizer treatments once it has been validated and is learning in Online mode, since in  Apprentice mode, only the baseline action is used, and the existing logic is learned. This essentially means Personalizer is returning the action of the "control" arm of your A/B test, hence an A/B test in Apprentice mode has no value.

Once you have a use case using Personalizer and learning online, A/B experiments can allow you to create controlled cohorts and conduct comparisons of results that may be more complex than the signals used for rewards. An example question an A/B test could answer is: "In a retail website, Personalizer optimizes a layout and gets more users to _check out_ earlier, but does this reduce total revenue per transaction?"

## Next steps

* Learn about [active and inactive events](concept-active-inactive-events.md)
