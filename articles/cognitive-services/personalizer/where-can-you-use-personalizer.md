---
title: Scenario assessment - Personalizer
titleSuffix: Azure Cognitive Services
description: Personalizer can be applied in any situation where your application can select the right item, action, or product to display - in order to make the experience better, achieve better business results, or improve productivity.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 02/18/2020
ms.author: diberry
---
# Where can you use Personalizer?

Use Personalizer in any situation where your application needs to select the right item, action, or product to display - in order to make the experience better, achieve better business results, or improve productivity.

Personalizer uses machine learning to select which action to show the user. The selection can vary drastically depending on the quantity, quality, and distribution of data sent to the service.

### Checklist for applying Personalizer


You can apply Personalizer in situations where:

* You have a business or usability goal for your application.
* You have a place in your application where making a contextual decision of what to show to users will improve that goal.
* The best choice can and should be learned from collective user behavior and total reward score.
* The use of machine learning for personalization follows [responsible use guidelines](ethics-responsible-use.md) and choices you chose.
* The contextual decision can be expressed as ranking the best option (action) from a limited set of choices.
* How well the ranked choice worked for your application can be determined by measuring some aspect of user behavior, and expressing it in a _[reward score](concept-rewards.md)_.
* The reward score doesn't bring in too many confounding or external factors. The experiment duration is low enough that the reward score can be computed while it's still relevant.
* You can express the context for the rank as a list of at least 5 [features](concepts-features.md) that you think would help make the right choice, and that doesn't include personally identifiable information. (PII).
* You have information about each content choice, _action_, as a list of at least 5 [features](concepts-features.md) that you think will help Personalizer make the right choice.
* Your application can retain data for long enough to accumulate a history of at least 100,000 interactions.


## Example use cases for Personalizer

* Intent clarification & disambiguation: help your users have a better experience when their intent is not clear by providing an option that is personalized to each user.
* Default suggestions for menus & options: have the bot suggest the most likely item in a personalized way as a first step, instead of presenting an impersonal menu or list of alternatives.
* Bot traits & tone: for bots that can vary tone, verbosity, and writing style, consider varying these traits in a personalized ways.
* Notification & alert content: decide what text to use for alerts in order to engage users more.
* Notification & alert timing: have personalized learning of when to send notifications to users to engage them more.

## How to use Personalizer in a web application

Adding a loop to a web application includes:

* Determine which experience to personalize, what actions and features you have, what context features to use, and what reward you'll set.
* Add a reference to the Personalization SDK in your application.
* Call the Rank API when you are ready to personalize.
* Store the eventId. You send a reward with the Reward API later.
1. Call Activate for the event once you're sure the user has seen your personalized page.
1. Wait for user selection of ranked content.
1. Call Reward API to specify how well the output of the Rank API did.

## How to use Personalizer with a chat bot

In this example, you will see how to use Personalization to make a default suggestion instead of sending the user down a series of menus or choices every time.

* Get the [code](https://github.com/Azure-Samples/cognitive-services-personalizer-samples/tree/master/samples/ChatbotExample) for this sample.
* Set up your bot solution. Make sure to publish your LUIS application.
* Manage Rank and Reward API calls for bot.
    * Add code to manage LUIS intent processing. If the **None** is returned as the top intent or the top intent's score is below your business logic threshold, send the intents list to Personalizer to Rank the intents.
    * Show intent list to user as selectable links with the first intent being the top-ranked intent from Rank API response.
    * Capture the user's selection and send this in the Reward API call.

### Recommended bot patterns

* Make Personalizer Rank API calls every time a disambiguation is needed, as opposed to caching results for each user. The result of disambiguating intent may change over time for one person, and allowing the Rank API to explore variances will accelerate overall learning.
* Choose an interaction that is common with many users so that you have enough data to personalize. For example, introductory questions may be better fits than smaller clarifications deep in the conversation graph that only a few users may get to.
* Use Rank API calls to enable "first suggestion is right" conversations, where the user gets asked "Would you like X?" or "Did you mean X?" and the user can just confirm; as opposed to giving options to the user where they must choose from a menu. For example User:"I'd like to order a coffee" Bot:"Would you like a double espresso?". This way the reward signal is also strong as it pertains directly to the one suggestion.

## How to use Personalizer with a recommendation solution

Use your recommendation engine to filter down a large catalog to a few items which can then be presented as 30 possible actions sent to the Rank API.

You can use recommendation engines with Personalizer:

* Set up the [recommendation solution](https://github.com/Microsoft/Recommenders/).
* When displaying a page, invoke the Recommendation Model to get a short list of recommendations.
* Call Personalization to Rank the Output of Recommendation Solution.
* Send feedback about your user action with the Reward API call.


## Pitfalls to avoid

* Don't use Personalizer where the personalized behavior isn't something that can be discovered across all users but rather something that should be remembered for specific users, or comes from a user-specific list of alternatives. For example, using Personalizer to suggest a first pizza order from a list of 20 possible menu items is useful, but which contact to call from the users' contact list when requiring help with childcare (such as "Grandma") is not something that is personalizable across your user base.


## Adding content safeguards to your application

If your application allows for large variances in content shown to users, and some of that content may be unsafe or inappropriate for some users, you should plan ahead to make sure that the right safeguards are in place to prevent your users from seeing unacceptable content. The best pattern to implement safeguards is:
    * Obtain the list of actions to rank.
    * Filter out the ones that are not viable for the audience.
    * Only rank these viable actions.
    * Display the top ranked action to the user.

In some architectures, the above sequence may be hard to implement. In that case, there is an alternative approach to implementing safeguards after ranking, but a provision needs to be made so actions that falls outside the safeguard are not used to train the Personalizer model.

* Obtain the list of actions to rank, with learning deactivated.
* Rank actions.
* Check if the top action is viable.
    * If the top action is viable, activate learning for this rank, then show it to the user.
    * If the top action is not viable, do not activate learning for this ranking, and decide through your own logic or alternative approaches what to show to the user. Even if you use the second-best ranked option, do not activate learning for this ranking.

## Verifying adequate effectiveness of Personalizer

You can monitor the effectiveness of Personalizer periodically by performing [offline evaluations](how-to-offline-evaluation.md)

## Next steps

Understand [where you can use Personalizer](where-can-you-use-personalizer.md).
Perform [Offline Evaluations](how-to-offline-evaluation.md)

## Machine learning considerations for applying Personalizer

Personalizer is based on reinforcement learning, an approach to machine learning that is taught by feedback you give it.

Personalizer will learn best in situations where:

* There's enough events to stay on top of optimal personalization if the problem drifts over time (such as preferences in news or fashion). Personalizer will adapt to continuous change in the real world, but results won't be optimal if there's not enough events and data to learn from to discover and settle on new patterns. You should choose a use case that happens often enough. Consider looking for use cases that happen at least 500 times per day.
* Context and actions have enough  [features](concepts-features.md) to facilitate learning.
* There are fewer than 50 actions to rank per call.
* Your data retention settings allow Personalizer to collect enough data to perform offline evaluations and policy optimization. This is typically at least 50,000 data points.

## Monitor effectiveness of Personalizer

You can monitor the effectiveness of Personalizer periodically by performing [offline evaluations](concepts-offline-evaluation.md).

## Use Personalizer with recommendation engines

Many companies use recommendation engines, marketing and campaigning tools, audience segmentation and clustering, collaborative filtering, and other means to recommend products from a large catalog to customers.

The [Microsoft Recommenders GitHub repository](https://github.com/Microsoft/Recommenders) provides examples and best practices for building recommendation systems, provided as Jupyter notebooks. It provides working examples for preparing data, building models, evaluating, tuning, and operationalizing the recommendation engines, for many common approaches including xDeepFM, SAR, ALS, RBM, DKN.

Personalizer can work with a recommendation engine when it's present.

* Recommendation engines take large amounts of items (for example, 500,000) and recommend a subset (such as the top 20) from hundreds or thousands of options.
* Personalizer takes a small number of actions with lots of information about them and ranks them in real time for a given rich context, while most recommendation engines only use a few attributes about users, products and their interactions.
* Personalizer is designed to autonomously explore user preferences all the time, which will yield better results where content is changing rapidly, such as news, live events, live community content, content with daily updates, or seasonal content.

A common use is to take the output of a recommendation engine (for example, the top 20 products for a certain customer) and use that as the input actions for Personalizer.

## Next steps

[Ethics & responsible use](ethics-responsible-use.md).