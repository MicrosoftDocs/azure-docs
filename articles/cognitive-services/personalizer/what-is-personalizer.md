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

Azure Personalizer is a cloud-based API service that helps your client application choose the best _content_ to show each user. The service **ranks** your content, in real-time, based on information you provide. After you present the ranked content to your user, and your user selects from the content choices, return a **reward** to the Personalizer service indicating if the user selected the content Personalizer ranked highest, so it can continue to improve its ability to rank content.

**Content** can be any unit of information such as text, images, urls, or emails that you want to rank in order to show the top-ranked item to your user.

Personalizer is not a service:

* Requiring cleaned and labeled content
* To persist and manage user profile information
* To log individual users' preferences or history

## Personalizer content requirements

* You have a limited set of content (30 to 50 items) you want presented in a ranked order. If you have a larger list, use a recommendation engine to reduce the list down to 30 to 50 items.
* You have information describing the content you want ranked: _actions_ and _context_ - explained below.
* You have enough real-time traffic (~4K transactions/day) to give to Personalizer to rank the content.

## How does Personalizer rank your content?

Personalizer uses reinforcement learning to rank information about your content (_actions_). Actions are the content items, such as news articles, specific movies, or products to choose from.

The rank call takes the action item, along with the its action features and context features to select the top action item:

* **Actions with features** - content items with features specific to each item
* **Context features** - features of the context

Several example scenarios are:

|Content type|**Actions (with features)**|**Context features**|
|--|--|--|
|News list|`The president...` (national, politics, [text])<br>`Premier football league ...` (global, sports, [text, image, video])<br> `Hurricane in the ...` (regional, weather, [text,image]|Device news is read from<br>Month, or season<br>|
|Movies list|`Star wars` (1977, [action, adventure, fantasy], George Lucas)<br>`Hoop dreams` (1994, [documentary, sports], Steve James<br>`Casa blanca` (1942, [romance, drama, war], Michael Curtiz)|Device movie is watched from<br>screen size<br>Month, or season<br>|
|Products list|`Product A` ($$$$, deliver in 24 hours, 3 kg)<br>`Product b` ($$, 2 week shipping with customs, 20 kb)<br>`Product C` ($$$, delivery in 48 hours, 3 kg)|Device shopping  is read from<br>Spending tier of user<br>Month, or season|



## Personalizer can rank content from a recommendation engine

Personalizer can be used _with_ your existing recommendation engine as a last-step ranker, selecting the _top_ choice of content, from the list of choices provided by the recommendation engine. Learn how to [use Personalizer with recommendation engines](where-can-you-use-personalizer.md#use-personalizer-with-recommendation-engines).

## When to call Personalizer

Personalizer's **Rank** [API](https://go.microsoft.com/fwlink/?linkid=2092082) is called _every time_ you present content, in real-time. This is known as an **event**, noted with an _event ID_.

Personalizer's **Reward** API can be called in real-time or delayed to better fit your infrastructure. You determine the reward score based on your business needs. That can be a single value such as 1 for good, and 0 for bad, or an algorithm you create based on your business needs.

## How do you get started?

1. Design and plan for content, **_actions_**, and **_context_**. Determine the reward algorithm for the **_reward_** score.
1. Each Personalizer Resource you create is considered 1 Learning Loop. The loop is the combination of both the Rank and Reward calls for each _event_.
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
* [How Personalizer works?](how-personalizer-works.md)
* [What is Reinforcement Learning?](concepts-reinforcement-learning.md)
* [Learn about features and actions for the Rank request](concepts-features.md)
* [Learn about determining the score for the Reward request](concept-rewards.md)
* [Use the interactive demo](https://personalizationdemo.azurewebsites.net/)
