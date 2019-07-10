---
title: How Personalizer Works - Personalizer
titleSuffix: Azure Cognitive Services
description: Personalizer uses machine learning to discover what action to use in a context. Each learning loop has a model that is trained exclusively on data that you have sent to it via Rank and Reward calls. Every learning loop is completely independent of each other.
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 06/07/2019
ms.author: edjez
---

# How Personalizer works

Personalizer uses machine learning to discover what action to use in a context. Each learning loop has a model that is trained exclusively on data that you have sent to it via **Rank** and **Reward** calls. Every learning loop is completely independent of each other. Create a learning loop for each part or behavior of your application you want to personalize.

For each loop, **call the Rank API with** based on the current context, with:

* List of possible actions: content items from which to select top action.
* List of [context features](concepts-features.md): contextually relevant data such as user, content, and context.

The **Rank** API decides to use either:

* _Exploit_: The current model to decide the best action based on past data.
* _Explore_: Select a different action instead of the top action.

The **Reward** API:

* Collects data to train the model by recording the features and reward scores of each rank call.
* Uses that data to update the model based on settings specified in the _Learning Policy_.

## Architecture

The following image shows the architectural flow of calling the Rank and Reward calls:

![alt text](./media/how-personalizer-works/personalization-how-it-works.png "How Personalization Works")

1. Personalizer uses an internal AI model to determine the rank of the action.
1. The service decides whether to exploit the current model or explore new choices for the model.  
1. The ranking result is sent to EventHub.
1. When Personalizer receives the reward, the reward is sent to EventHub. 
1. The rank and reward are correlated.
1. The AI model is updated based on the correlation results.
1. The inference engine is updated with the new model. 

## Research behind Personalizer

Personalizer is based on cutting-edge science and research in the area of [Reinforcement Learning](concepts-reinforcement-learning.md) including papers, research activities, and ongoing areas of exploration in Microsoft Research.

## Terminology

* **Learning Loop**: You can create a learning loop for every part of your application that can benefit from personalization. If you have more than one experience to personalize, create a loop for each. 

* **Actions**: Actions are the content items, such as products or promotions,  to choose from. Personalizer chooses the top action to show to your users, known as the _Reward action_, via the Rank API. Each action can have features submitted with the Rank request.

* **Context**: To provide a more accurate rank, provide information about your context, for example:
    * Your user.
    * The device they are on. 
    * The current time.
    * Other data about the current situation.
    * Historical data about the user or context.

    Your specific application may have different context information. 

* **[Features](concepts-features.md)**: A unit of information about a content item or a user context.

* **Reward**: A measure of how the user responded to the Rank API returned action, as a score between 0 and 1. The 0 to 1 value is set by your business logic, based on how the choice helped achieve your business goals of personalization. 

* **Exploration**: The Personalizer service is exploring when, instead of returning the best action, it chooses a different action for the user. The Personalizer service avoids drift, stagnation, and can adapt to ongoing user behavior by exploring. 

* **Experiment Duration**: The amount of time the Personalizer service waits for a reward, starting from the moment the Rank call happened for that event.

* **Inactive Events**: An inactive event is one where you called Rank, but you're not sure the user will ever see the result, due to client application decisions. Inactive events allow you to create and store personalization results, then decide to discard them later without impacting the machine learning model.

* **Model**: A Personalizer model captures all data learned about user behavior, getting training data from the combination of the arguments you send to Rank and Reward calls, and with a training behavior determined by the Learning Policy. 

## Example use cases for Personalizer

* Intent clarification & disambiguation: help your users have a better experience when their intent is not clear by providing an option that is personalized to each user.
* Default suggestions for menus & options: have the bot suggest the most likely item in a personalized way as a first step, instead of presenting an impersonal menu or list of alternatives.
* Bot traits & tone: for bots that can vary tone, verbosity, and writing style, consider varying these traits in a personalized ways.
* Notification & alert content: decide what text to use for alerts in order to engage users more.
* Notification & alert timing: have personalized learning of when to send notifications to users to engage them more.

## Checklist for Applying Personalizer

You can apply Personalizer in situations where:

* You have a business or usability goal for your application.
* You have a place in your application where making a contextual decision of what to show to users will improve that goal.
* The best choice can and should be learned from collective user behavior and total reward score.
* The use of machine learning for personalization follows [responsible use guidelines](ethics-responsible-use.md) and choices for your team.
* The decision can be expressed as ranking the best option ([action](concepts-features.md#actions-represent-a-list-of-options) from a limited set of choices.
* How well that choice worked can be computed by your business logic, by measuring some aspect of user behavior, and expressing it in a number between -1 and 1.
* The reward score doesn't bring in too many confounding or external factors, specifically the experiment duration is low enough that the reward score can be computed while it's still relevant.
* You can express the context for the rank as a dictionary of at least 5 features that you think would help make the right choice, and that doesn't include personally identifiable information.
* You have information about each action as a dictionary of at least 5 attributes or features that you think will help Personalizer make the right choice.
* You can retain data for long enough to accumulate a history of at least 100,000 interactions.

## Machine learning considerations for applying Personalizer

Personalizer is based on reinforcement learning, an approach to machine learning that gets taught by feedback you give it. 

Personalizer will learn best in situations where:
* There's enough events to stay on top of optimal personalization if the problem drifts over time (such as preferences in news or fashion). Personalizer will adapt to continuous change in the real world, but results won't be optimal if there's not enough events and data to learn from to discover and settle on new patterns. You should choose a use case that happens often enough. Consider looking for use cases that happen at least 500 times per day.
* Context and actions have enough  features to facilitate learning.
* There are less than 50 actions for rank per call.
* Your data retention settings allow Personalizer to collect enough data to perform offline evaluations and policy optimization. This is typically at least 50,000 data points.

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
The best pattern to implement safeguards is:
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