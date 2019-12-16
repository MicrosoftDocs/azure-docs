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
ms.date: 10/23/2019
ms.author: diberry
#Customer intent:
---

# What is Personalizer?

Azure Personalizer is a cloud-based API service that helps your client application choose the best _content_ to show each user. The service **ranks** your content, in real-time, based on information your provide. After you present the ranked content to your user, return a **reward** to the Personalizer service so it can continue to improve its ability to rank content.

**Content** can be any unit of information such as text, images, urls, or emails that you want to rank in order to show the top-ranked item to your user.

## When to use Personalizer

* You have content you want presented in a ranked order. No need to clean and label the data before sending to Personalizer.
* You have information describing the content (_actions_ and _context_ - explained below).
* You have enough real-time traffic (~XK transactions/day) to give to Personalizer to rank the content.

Personalizer is not a service to persist and manage user profile information, or to log individual users' preferences or history.

## How does Personalizer rank your content?

Personalizer uses reinforcement learning to rank information about your content and its context.

* Content ID - any string representation of your content
* Actions - information about the content
* Context - information about the context information

You need to determine the information groups for actions and context based on your scenario. Several example scenarios are:

|Content|Actions|Context|
|--|--|--|
|News|News type<br>Subject<br>Content type (text, image, video)|Device news is read from<br>Time of day, month, or season<br>|
|Movies|Movie genre<br>Main actors<br>Directory<br>Film rating<br>length|Device movie is watched from<br>screen size<br>Time of day, month, or season<br>|
|Products|Price<br>Size<br>Availability<br>Time to package<br>Time to ship<br>On Sale|Device shopping  is read from<br>Spending tier of user<br>Time of day, month, or season|

## Personalizer can rank content from the recommendation engine

Personalizer can be used _with_ your existing recommendation engine as a last-step ranker, selecting the _top_ choice of content, from the list of choices provided by the recommendation engine. Learn how to [use Personalizer with recommendation engines]().

## Call Personalizer in real-time

Personalizer's **Rank** API is called _every time_ you present content, in real-time. This is known as an **event**, noted with an _event ID_.

Personalizer's **Reward** API can be called in real-time or delayed to better fit your infrastructure. You determine the reward score based on your business needs. That can be a single value such as 1 for good, and 0 for bad, or an algorithm you create based on your business needs.

## How do you get started?

[architectural image]

1. Design and plan for content, **_actions_**, and **_context_**. Determine the reward algorithm for the **_reward_** score.
1. Create a Personalizer resource in the Azure portal. This is also known as a _learning loop_. The loop is the combination of both the Rank and Reward calls for each _event_.
1. Add Personalizer to your website or content system:
    1. Add a **Rank** call to Personalizer in your application, website or system to determine the ranking of content before the content is shown to the user.
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
