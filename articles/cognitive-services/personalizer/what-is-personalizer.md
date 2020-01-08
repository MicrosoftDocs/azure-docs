---
title: What is Personalizer?
titleSuffix: Azure Cognitive Services
description: Personalizer is a cloud-based API service that allows you to choose the best experience to show to your users, learning from their real-time behavior.
services: cognitive-services
author: diberry
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: overview
ms.date: 01/09/2020
ms.author: diberry
#Customer intent:
---

# What is Personalizer?

Azure Personalizer is a cloud-based API service that helps your client application choose the best, single _content_ item to show each user. The service selects the best item, from content items, based on real-time information you provide about content and context.

After you present the content item to your user, your system monitors user behavior and reports back to Personalizer to improve its ability to select the best content.

**Content** can be any unit of information such as text, images, urls, or emails that you want to select from to show to your user.

Personalizer **is** a service:

* that doesn't require cleaned and labeled content
* that doesn't persist and manage user profile information
* that doesn't log individual users' preferences or history

## How does Personalizer select the best content item?

Personalizer uses reinforcement learning to select from your content (_actions_). Actions are the content items, such as news articles, specific movies, or products to choose from.

The **Rank** call takes the action item, along with features of the action, and context features to select the top action item:

* **Actions with features** - content items with features specific to each item
* **Context features** - features of your users, their context or their environment when using your app -

The Rank call returns the ID of which content item, __action__, to show to the user, in the **Reward Action ID** field.

Several example scenarios are:

|Content type|**Actions (with features)**|**Context features**|Returned Returned Action ID|
|--|--|--|--|
|News list|a. `The president...` (national, politics, [text])<br>b. `Premier league ...` (global, sports, [text, image, video])<br> c. `Hurricane in the ...` (regional, weather, [text,image]|Device news is read from<br>Month, or season<br>|a `The president...`|
|Movies list|1. `Star wars` (1977, [action, adventure, fantasy], George Lucas)<br>2. `Hoop dreams` (1994, [documentary, sports], Steve James<br>3. `Casablanca` (1942, [romance, drama, war], Michael Curtiz)|Device movie is watched from<br>screen size<br>Type of user<br>|3. `Casablanca`|
|Products list|i. `Product A` (3 kg, $$$$, deliver in 24 hours)<br>ii. `Product B` (20 kg, $$, 2 week shipping with customs)<br>iii. `Product C` (3 kg, $$$, delivery in 48 hours)|Device shopping  is read from<br>Spending tier of user<br>Month, or season|ii. `Product B`|


## Personalizer can rank content from a recommendation engine

Personalizer can be used _with_ your existing recommendation engine as a last-step ranker, selecting the _top_ choice of content, from the list of choices provided by the recommendation engine. Learn how to [use Personalizer with recommendation engines](where-can-you-use-personalizer.md#use-personalizer-with-recommendation-engines).

## When to call Personalizer

Personalizer's **Rank** [API](https://go.microsoft.com/fwlink/?linkid=2092082) is called _every time_ you present content, in real-time. This is known as an **event**, noted with an _event ID_.

Personalizer's **Reward** [API](https://westus2.dev.cognitive.microsoft.com/docs/services/personalizer-api/operations/Reward) can be called in real-time or delayed to better fit your infrastructure. You determine the reward score based on your business needs. That can be a single value such as 1 for good, and 0 for bad, or an algorithm you create based on your business needs.


## Personalizer content requirements

* You have a limited set of content (30 to 50 items) to select a single content item from. If you have a larger list, use a recommendation engine to reduce the list down to 30 to 50 items.
* You have information describing the content you want ranked: _actions_ and _context_ - explained below.
* Your scenario has enough real-time events (~4K/day) which need a selection from Personalizer.

## How do you get started?

1. Design and plan for content, **_actions_**, and **_context_**. Determine the reward algorithm for the **_reward_** score.
1. Each Personalizer Resource you create is considered 1 Learning Loop. The loop is the combination of both the Rank and Reward calls for that content.
1. Add Personalizer to your website or content system:
    1. Add a **Rank** call to Personalizer in your application, website, or system to determine the ranking of content before the content is shown to the user.
    1. Display ranked content to user.
    1. Collect information about how the user behaved when presented with the ranked content, such as:
        * Immediately selected top-ranked content
        * Or selected other content
        * Or paused, scrolling around indecisively, before selecting  content
    1. Add a **Reward** call
        * Immediately after showing your content
        * Or sometime later in an offline system


## Next steps

* [What's new in Personalizer?](whats-new.md)
* [How Personalizer works](how-personalizer-works.md)
* [What is Reinforcement Learning?](concepts-reinforcement-learning.md)
* [Learn about features and actions for the Rank request](concepts-features.md)
* [Learn about determining the score for the Reward request](concept-rewards.md)
* [Use the interactive demo](https://personalizationdemo.azurewebsites.net/)
