---
title: Reward score - Personalizer
titleSuffix: Azure Cognitive Services
description: The reward score indicates how well the personalization choice, RewardActionID, resulted for the user. The value of the reward score is determined by your business logic, based on observations of user behavior. Personalizer trains it's machine learning models by evaluating the rewards.
services: cognitive-services
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: overview
ms.date: 05/13/2019
ms.author: edjez
---

# Reward scores indicate success of personalization

The reward score indicates how well the personalization choice, [RewardActionID](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/personalizer/events/rank#rankresponse), resulted for the user. The value of the reward score is determined by your business logic, based on observations of user behavior.

Personalizer trains it's machine learning models by evaluating the rewards. 

## Use Reward API to send reward score to Personalizer

Rewards are sent to Personalizer by the [Reward API](https://docs.microsoft.com/en-us/rest/api/cognitiveservices/personalizer/events/reward). A reward is a number from -1 and 1. Personalizer trains the model to achieve the highest possible sum of rewards over time.

Rewards are sent after the user behavior has happened, which could be days later. The maximum amount of time Personalizer will wait until an event is considered to have no reward or a default reward is [configured](how-to-settings.md) with the [Reward Wait Time](concepts-experiment-duration.md).

If the reward score for an event hasn't been received within the **Reward Wait Time**, then the **Default Reward** will be applied. Typically, the **[Default Reward](personalizer/how-to-settings.md#configure-reward-settings-for-the-feedback-loop-based-on-use-case)** is configured to be zero.

## Composing reward scores

A Reward score must be computed in your business logic. The score can be represented as a single number sent once or as a score sent immediately (0.8) and an additional score later (typically 0.2).

## Building up rewards with multiple factors  

Rewards can be any number from -1 and 1. You can build up the reward score for effective personalization based on multiple factors. 

For example, you could apply these rules for personalizing a list of video content:
* The user clicked on the top item: +0.5 reward
* The user opened the actual content of that item: +0.3 reward
* The user watched 5 minutes of the content or 30%, whichever is longer: +0.2 reward

You can then send the total reward to the API.

## Default Rewards

If the [Reward Wait Time](#reward-wait-time) goes by since the Rank call and no reward is received, Personalizer implicitly applies the Default Reward to that Rank event.

## Calling the Reward API multiple times

You can also call the Reward API using the same event ID, sending different reward scores. When Personalizer gets those rewards, it will compute the final reward for that event by aggregating them as specified in the Personalizer settings.

You can aggregate multiple reward scores with the following functions:

*  **First**: Takes the first reward score received for the event, and discards the rest.
* **Sum**: Takes all reward scores collected for the eventId, and adds them.

All rewards for an event which are received after the **Reward Wait Time** are discarded and do not affect the training of models.

By adding up reward scores, your final reward may end up being higher than 1 or lower than -1. This won't make the service fail.

## Best Practices for calculating reward score

* **Consider true indicators of successful personalization**: It is easy to think in terms of clicks, but a good reward is based on what you want your users to *achieve* instead of what you want people to *do*.  For example, rewarding on clicks may lead to selecting content that is clickbait prone.

* **Use a reward score for how good the personalization worked**: Personalizing a movie suggestion would hopefully result in the user watching the movie and giving it a high rating. Since the movie rating probably depends on many things (the quality of the acting, the mood of the user), it is not a good reward signal for how well *the personalization* worked. The user watching the first few minutes of the movie, however, may be a better signal of personalization effectiveness and sending a reward of 1 after 5 minutes will be a better signal.

* **Rewards only apply to RewardActionID**: Personalization Service applies the rewards to understand the efficacy of the action specified in RewardActionID. If you choose to display other actions and the user clicks on them, the reward should be zero.

* **Consider unintended consequences**: Create reward functions that lead to responsible outcomes with [ethics and responsible use](ethics-responsible-use.md).

* **Use Incremental Rewards**: Adding partial rewards for smaller user behaviors may help cue the Personalizer training to achieving better rewards. This incremental reward allows the algorithm to know it's getting closer to engaging the user in the final desired behavior.
    * If you are showing a list of movies, if the user hovers over the first one for a while to see a "popup" with more information, you can determine that some user-engagement happened. The behavior can count with a reward score of 0.1. 
    * If the user opened the page and then exited, the reward score can be 0.2. 

## Reward wait time

Personalizer will correlate the information of a Rank call with the rewards sent in Reward calls to train the model. 

These may come at different times from the application, so Personalizer will wait for a limited time, starting when the Rank call happened, to collect Reward information.

This time begins with the Rank API call, even if it was made as an inactive event, and activated later.

If the Reward Wait Time expires, and there has been no reward information, a default reward is applied to that event for training.

The maximum duration is 6 days.

## Best practices for setting reward wait time

Follow these recommendations for better results.

* Make the Reward Wait Time as short as you can, while leaving enough time to get user feedback. 

* Setting a Reward Wait Time too high will cause Personalizer to unnecessarily store more data counts against storage quota.

<!--@Edjez - storage quota? -->

* Don't choose a duration that is shorter than the time needed to get feedback. For example, if some of your rewards come in after a user has watched 1 minute of a video, the experiment length should be at least double that.

## Next steps

* [Reinforcement learning](concepts-reinforcement-learning.md) 
* [Try the Rank API](https://westus2.dev.cognitive.microsoft.com/docs/services/personalizer-api/operations/Rank/console)
* [Try the Reward API](https://westus2.dev.cognitive.microsoft.com/docs/services/personalizer-api/operations/Reward)
