---
title: Reward score - Personalizer
description: The reward score indicates how well the personalization choice, RewardActionID, resulted for the user. The value of the reward score is determined by your business logic, based on observations of user behavior. Personalizer trains its machine learning models by evaluating the rewards.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.date: 02/20/2020
ms.topic: conceptual
---

# Reward scores indicate success of personalization

The reward score indicates how well the personalization choice, [RewardActionID](/rest/api/personalizer/1.0/rank/rank#response), resulted for the user. The value of the reward score is determined by your business logic, based on observations of user behavior.

Personalizer trains its machine learning models by evaluating the rewards.

Learn [how to](how-to-settings.md#configure-rewards-for-the-feedback-loop) configure the default reward score in the Azure portal for your Personalizer resource.

## Use Reward API to send reward score to Personalizer

Rewards are sent to Personalizer by the [Reward API](/rest/api/personalizer/1.0/events/reward). Typically, a reward is a number from 0 to 1. A negative reward, with the value of -1, is possible in certain scenarios and should only be used if you are experienced with reinforcement learning (RL). Personalizer trains the model to achieve the highest possible sum of rewards over time.

Rewards are sent after the user behavior has happened, which could be days later. The maximum amount of time Personalizer will wait until an event is considered to have no reward or a default reward is configured with the [Reward Wait Time](#reward-wait-time) in the Azure portal.

If the reward score for an event hasn't been received within the **Reward Wait Time**, then the **Default Reward** will be applied. Typically, the **[Default Reward](how-to-settings.md#configure-reward-settings-for-the-feedback-loop-based-on-use-case)** is configured to be zero.


## Behaviors and data to consider for rewards

Consider these signals and behaviors for the context of the reward score:

* Direct user input for suggestions when options are involved ("Do you mean X?").
* Session length.
* Time between sessions.
* Sentiment analysis of the user's interactions.
* Direct questions and mini surveys where the bot asks the user for feedback about usefulness, accuracy.
* Response to alerts, or delay to response to alerts.

## Composing reward scores

A Reward score must be computed in your business logic. The score can be represented as:

* A single number sent once
* A score sent immediately (such as 0.8) and an additional score sent later (typically 0.2).

## Default Rewards

If no reward is received within the [Reward Wait Time](#reward-wait-time), the duration since the Rank call, Personalizer implicitly applies the **Default Reward** to that Rank event.

## Building up rewards with multiple factors

For effective personalization, you can build up the reward score based on multiple factors.

For example, you could apply these rules for personalizing a list of video content:

|User behavior|Partial score value|
|--|--|
|The user clicked on the top item.|+0.5 reward|
|The user opened the actual content of that item.|+0.3 reward|
|The user watched 5 minutes of the content or 30%, whichever is longer.|+0.2 reward|
|||

You can then send the total reward to the API.

## Calling the Reward API multiple times

You can also call the Reward API using the same event ID, sending different reward scores. When Personalizer gets those rewards, it determines the final reward for that event by aggregating them as specified in the Personalizer configuration.

Aggregation values:

*  **First**: Takes the first reward score received for the event, and discards the rest.
* **Sum**: Takes all reward scores collected for the eventId, and adds them together.

All rewards for an event, which are received after the **Reward Wait Time**, are discarded and do not affect the training of models.

By adding up reward scores, your final reward may be outside the expected score range. This won't make the service fail.

## Best Practices for calculating reward score

* **Consider true indicators of successful personalization**: It is easy to think in terms of clicks, but a good reward is based on what you want your users to *achieve* instead of what you want people to *do*.  For example, rewarding on clicks may lead to selecting content that is clickbait prone.

* **Use a reward score for how good the personalization worked**: Personalizing a movie suggestion would hopefully result in the user watching the movie and giving it a high rating. Since the movie rating probably depends on many things (the quality of the acting, the mood of the user), it is not a good reward signal for how well *the personalization* worked. The user watching the first few minutes of the movie, however, may be a better signal of personalization effectiveness and sending a reward of 1 after 5 minutes will be a better signal.

* **Rewards only apply to RewardActionID**: Personalizer applies the rewards to understand the efficacy of the action specified in RewardActionID. If you choose to display other actions and the user selects them, the reward should be zero.

* **Consider unintended consequences**: Create reward functions that lead to responsible outcomes with [ethics and responsible use](responsible-use-cases.md).

* **Use Incremental Rewards**: Adding partial rewards for smaller user behaviors helps Personalizer to achieving better rewards. This incremental reward allows the algorithm to know it's getting closer to engaging the user in the final desired behavior.
    * If you are showing a list of movies, if the user hovers over the first one for a while to see more information, you can determine that some user-engagement happened. The behavior can count with a reward score of 0.1.
    * If the user opened the page and then exited, the reward score can be 0.2.

## Reward wait time

Personalizer will correlate the information of a Rank call with the rewards sent in Reward calls to train the model, which may come at different times. Personalizer waits for the reward score for a defined limited time, starting when the corresponding Rank call occured. This is done even if the Rank call was made using deferred activation](concept-active-inactive-events.md).

If the **Reward Wait Time** expires and there has been no reward information, a default reward is applied to that event for training. You can select a reward wait time of 10 minutes, 4 hours, 12 hours, or 24 hours. If your scenario requires longer reward wait times (e.g., for marketing email campaigns) we are offering a private preview of longer wait times. Open a support ticket in the Azure portal to get in contact with team and see if you qualify and it can be offered to you.

## Best practices for reward wait time

Follow these recommendations for better results.

* Make the Reward Wait Time as short as you can, while leaving enough time to get user feedback.

* Don't choose a duration that is shorter than the time needed to get feedback. For example, if some of your rewards come in after a user has watched 1 minute of a video, the experiment length should be at least double that.

## Next steps

* [Reinforcement learning](concepts-reinforcement-learning.md)
* [Try the Rank API](https://westus2.dev.cognitive.microsoft.com/docs/services/personalizer-api/operations/Rank/console)
* [Try the Reward API](https://westus2.dev.cognitive.microsoft.com/docs/services/personalizer-api/operations/Reward)
