---
title: Terminology - Personalizer
description: Personalizer uses terminology from reinforcement learning. These terms are used in the Azure portal and the APIs.
ms.topic: conceptual
ms.date: 02/18/2020
---
# Terminology

Personalizer uses terminology from reinforcement learning. These terms are used in the Azure portal and the APIs.

## Conceptual terminology

* **Learning Loop**: You create a Personalizer resource, called a _learning loop_, for every part of your application that can benefit from personalization. If you have more than one experience to personalize, create a loop for each.

* **Model**: A Personalizer model captures all data learned about user behavior, getting training data from the combination of the arguments you send to Rank and Reward calls, and with a training behavior determined by the Learning Policy.

## Personalizer configuration

Personalizer is configured from the [Azure portal](https://portal.azure.com).

* **Rewards**: configure the default values for reward wait time, default reward, and reward aggregation policy.

* **Exploration**: configure the percentage of Rank calls to use for exploration

* **Model update frequency**: How often the model is retrained.

* **Data retention**: How many days worth of data to store. This can impact offline evaluations, which are used to improve your learning loop.

## Use Rank and Reward APIs

* **Rank**: Given the actions with features and the context features, use explore or exploit to return the top action (content item).

    * **Actions**: Actions are the content items, such as products or promotions,  to choose from. Personalizer chooses the top action (returned reward action ID) to show to your users via the Rank API.

    * **Context**: To provide a more accurate rank, provide information about your context, for example:
        * Your user.
        * The device they are on.
        * The current time.
        * Other data about the current situation.
        * Historical data about the user or context.

        Your specific application may have different context information.

    * **[Features](concepts-features.md)**: A unit of information about a content item or a user context. Make sure to only use features that are aggregated. Do not use specific times, user IDs, or other non-aggregated data as features.

        * An _action feature_ is metadata about the content.
        * A _context feature_ is metadata about the context in which the content is presented.

* **Exploration**: The Personalizer service is exploring when, instead of returning the best action, it chooses a different action for the user. The Personalizer service avoids drift, stagnation, and can adapt to ongoing user behavior by exploring.

* **Exploitation**: The Personalizer service uses the current model to decide the best action based on past data.

* **Experiment Duration**: The amount of time the Personalizer service waits for a reward, starting from the moment the Rank call happened for that event.

* **Inactive Events**: An inactive event is one where you called Rank, but you're not sure the user will ever see the result, due to client application decisions. Inactive events allow you to create and store personalization results, then decide to discard them later without impacting the machine learning model.


* **Reward**: A measure of how the user responded to the Rank API's returned reward action ID, as a score between 0 to 1. The 0 to 1 value is set by your business logic, based on how the choice helped achieve your business goals of personalization. The learning loop doesn't store this reward as individual user history.

## Offline evaluations

* **Evaluation**: An offline evaluation determines the best learning policy for your loop based on your loop's data.

* **Learning Policy**: How Personalizer trains a model on every event will be determined by some parameters that affect how the machine learning algorithm works. A new learning loop starts with a default **Learning Policy**, which can yield moderate performance. When running [Evaluations](concepts-offline-evaluation.md), Personalizer creates new learning policies specifically optimized to the use cases of your loop. Personalizer will perform significantly better with policies optimized for each specific loop, generated during Evaluation. The learning policy is named _learning settings_ on the **Model and learning settings** for the Personalizer resource in the Azure portal.