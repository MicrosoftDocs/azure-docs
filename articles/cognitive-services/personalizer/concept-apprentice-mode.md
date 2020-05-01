---
title: Apprentice mode - Personalizer
description:
ms.topic: conceptual
ms.date: 05/01/2020
---

# Use Apprentice mode to train Personalizer without affecting your existing application

Due to the nature of **real-world** Reinforcement Learning, a Personalizer model can only be trained in a production environment. When deploying a new use case, the Personalizer model is not performing efficiently because it takes time for the model to be sufficiently trained.  **Apprentice mode** is a learning behavior that eases this situation and allows you to gain confidence in the model – without the developer changing any code.

[!INCLUDE [Important Blue Box - Apprentice mode pricing tier](./includes/important-apprentice-mode.md)]

## What is Apprentice mode?

Similar to how an apprentice learns from a master, and with experience can get better; Apprentice mode is a _behavior_ that lets Personalizer learn by observing the results obtained from existing application logic.

Personalizer trains by mimicking the same output as the application. As more events flow, Personalizer can _catch up_ to the existing application without impacting the existing logic and outcomes. Metrics, available from the Azure portal and the API, help you understand the performance as the model learns.

Once Personalizer has learned and attained a certain level of understanding, the developer can change the behavior from Apprentice mode to Online mode. At that time, Personalizer starts influencing the actions in the Rank API.

## Purpose of Apprentice Mode

Apprentice mode gives you trust in the Personalizer service and its machine learning capabilities, and provides reassurance that the service is sent information that can be learned from – without risking online traffic.

The two main reasons to use Apprentice mode are:

* Mitigating **Cold Starts**: Apprentice mode helps manage and assess the cost of a "new" model's learning time -  when it is not returning the best action and not achieved a satisfactory level of effectiveness of around 75-85%.
* **Validating Action and Context Features**: Features sent in actions and context may be inadequate or inaccurate - too little, too much, incorrect, or too specific to train Personalizer to attain the ideal effectiveness rate. Use [feature evaluations](concept-feature-evaluation.md) to find and fix issues with features.

## When should you use Apprentice mode?

Use Apprentice mode to train Personalizer to improve its effectiveness through the following scenarios while leaving the experience of your users unaffected by Personalizer:

* You are implementing Personalizer in a new use case.
* You have significantly changed the features you send in Context or Actions.
* You have significantly changed when and how you calculate rewards.

Apprentice mode is not an effective way of measuring the impact Personalizer is having on reward scores. To measure how effective Personalizer is at choosing the best possible action for each Rank call, use [Offline evaluations](concepts-offline-evaluation.md).

## Who should use Apprentice mode?

Apprentice mode is useful for developers, data scientists and business decision makers:

* **Developers** can use Apprentice mode to make sure the Rank and Reward APIs are being used correctly in the application, and that features being sent to Personalizer from the application contains no bugs, or non-relevant features such as a timestamp or UserID element.

* **Data scientists** can use Apprentice mode to validate that the features are effective to train the Personalizer models, that the reward wait times aren’t too long or short.

* **Business Decision Makers** can use Apprentice mode to assess the potential of Personalizer to improve results (i.e. rewards) compared to existing business logic. This allows them to make a informed decision impacting user experience, where real revenue and user satisfaction are at stake.

## Comparing Behaviors - Apprentice mode and Online mode

Learning when in Apprentice mode differs from Online mode in the following ways.

|Area|Apprentice mode|Online mode|
|--|--|--|
|Impact on User Experience|You can use existing user behavior to train Personalizer by letting it observe (not affect) what your **default action** would have been and the reward it obtained. This means your users’ experience and the business results from them won’t be impacted.|Display top action returned from Rank call to affect user behavior.|
|Learning speed|Personalizer will learn more slowly when in Apprentice mode than when learning in Online mode. Apprentice mode can only learn by observing the rewards obtained by your **default action**, which limits the speed of learning, as no exploration can be performed.|Learns faster because it can both exploit the current model and explore for new trends.|
|Learning effectiveness "Ceiling"|Personalizer can approximate, very rarely match, and never exceed the performance of your base business logic (the reward total achieved by the **default action** of each Rank call).|Personalizer should exceed applications baseline, and over time where it stalls you should conduct on offline evaluation and feature evaluation to continue to get improvements to the model. |
|Rank API value for rewardActionId|The users' experience doesn’t get impacted, as _rewardActionId_ is always the first action you send in the Rank request. In other words, the Rank API does nothing visible for your application during Apprentice mode. Reward APIs in your application should not change how it uses the Reward API between one mode and another.|Users' experience will be changed by the _rewardActionId_ that Personalizer chooses for your application. |
|Evaluations|Personalizer keeps a comparison of the reward totals that your default business logic is getting, and the reward totals Personalizer would be getting if in Online mode at that point. A comparison is available in the Azure portal for that resource|Evaluate Personalizer’s effectiveness by running [Offline evaluations](concepts-offline-evaluation.md), which let you compare the total rewards Personalizer has achieved against the potential rewards of the application’s baseline.|

A note about apprentice mode's effectiveness:

* Personalizer's effectiveness in Apprentice mode will rarely achieve near 100% of the application's baseline; and never exceed it.
* Best practices would be not to try to get to 100% attainment; but a range of 75 – 85% should be targeted depending on the use case.

## Using Apprentice mode to train with historical data

If you have a significant amount of historical data, you’d like to use to train Personalizer, you can use Apprentice mode to replay the data through Personalizer.

Set up the Personalizer in Apprentice Mode and create a script that calls Rank with the actions and context features from the historical data. Call the Reward API based on your calculations of the records in this data. You will need approximately 50,000 historical events to see some results but 500,000 is recommended for higher confidence in the results.

When training from historical data, it is recommended that the data sent in (features for context and actions, their layout in the JSON used for Rank requests, and the calculation of reward in this training data set), matches the data (features and calculation of reward) available from the existing application.

Offline and post-facto data tends to be more incomplete and noisier and differs in format. While training from historical data is possible, the results from doing so may be inconclusive and not a good predictor of how well Personalizer will learn, especially if the features vary between past data and the existing application.

Typically for Personalizer, when compared to training with historical data, changing behavior to Apprentice mode and learning from an existing application is a more effective path to having an effective model, with less labor, data engineering, and cleanup work.

## Using Apprentice Mode versus A/B Tests

It is only useful to do A/B tests of Personalizer treatments once it has been validated and is learning in Online mode. In Apprentice mode, only the **default action** is used, which means all users would effectively see the control experience.

Even if Personalizer is just the _treatment_, the same challenge is present when validating the data is good for training Personalizer. Apprentice mode could be used instead, with 100% of traffic, and with all users getting the control (unaffected) experience.

Once you have a use case using Personalizer and learning online, A/B experiments allow you to do controlled cohorts and scientific comparison of results that may be more complex than the signals used for rewards. An example question an A/B test could answer is: `In a retail website, Personalizer optimizes a layout and gets more users to _check out_ earlier, but does this reduce total revenue per transaction?`

## Next steps

* Learn about [active and inactive events](concept-active-inactive-events.md)