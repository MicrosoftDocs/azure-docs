---
title: What is Personalizer?
description: Personalizer is a cloud-based service that allows you to choose the best experience to show to your users, learning from their real-time behavior.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: overview
ms.date: 07/06/2022
ms.custom: cog-serv-seo-aug-2020
keywords: personalizer, Azure personalizer, machine learning 
---

# What is Personalizer?

Azure Personalizer helps your applications make smarter decisions quickly and at scale using **reinforcement learning**. Personalizer can determine the best actions to take in a variety of scenarios:
* E-commerce: What product to suggest to customers that maximizes the likelihood of a purchase?
* Content recommendation: What article should be shown to website visitors to increase click-through rate?
* Content design: Where to place a a website advertisement to optimize engagement
* Communication: When to send notifications to maximize likelihood of response

Personalizer processes information about the state of an application or scenario (*context*) and a list of possible decisions  and related information (*actions*) to determine the best decision to make. 

When your application receives feedback indicating the value of that decision (for example, whether a user clicked on an article or purchased a suggested product), your applications sends that to PErsonalizer to train the RL model. 

To get started with the Personalizer REST API, follow the [**quickstart guide**](quickstart-personalizer-sdk.md), or try Personalizer with this [interactive demo](https://personalizerdevdemo.azurewebsites.net/).



This documentation contains the following types of articles:

* [**Quickstarts**](quickstart-personalizer-sdk.md) provide step-by-step instructions to guide you through setup and making sample API requests to the service.  
* [**Concepts**](how-personalizer-works.md) give detailed explanations of the service functionalities and features.  
* [**How-to guides**](how-to-settings.md) contain instructions for using additional capabilities  of the service and further customization to your scenario. 
* [**Code samples**](https://github.com/Azure-Samples/cognitive-services-personalizer-samples) provide code snippets and modules that demonstrate how to use Personalizer and help you to easily interface your application with the service.
* [**Tutorials**](tutorial-use-personalizer-web-app.md) are longer guides that walk you through implementation of Personalizer as a part of a broader business solution.  


## How does Personalizer work?

Personalizer uses reinforcement learning (RL) to select the best action based on the behavior and reward scores given across all users. Actions can be any discrete decision that Personalizer can make such as news articles, movies, products.

Personalizer consists of two primary APIs:

The **Rank** [API](https://go.microsoft.com/fwlink/?linkid=2092082) is called by your application each time there is a decision to be made. You provide the rank call a set of actions, sets of features that describe each of your actions, and a set of features that describe the current context of the system or users. A call to the rank API is is known as an **event** and noted with a unique _event ID_. Personalizer returns the best action to take as determined by the underlying model to maximize your average reward.


The **Reward** [API](https://westus2.dev.cognitive.microsoft.com/docs/services/personalizer-api/operations/Reward) is called by your application whenever there is feedback that can help Personalizer learn if the action returned in the *Rank* call provides value. For example, if a user clicked on the suggested news article, or completed the purchase of a chosen product. The *Reward* call can be in real-time (as soon as the decision is made) or delayed to better fit the logic of your scenario.

You determine the reward score based on your business needs. The reward score can be a real-valued number between 0 and 1. In a simple example, 0 can indicate a 'bad' or undesirable outcome, and 1 can represent a "good" or desired outcome. The reward function can also be generated  by an algorithm or rules in your application that align with your business goals or metrics.


### Example scenarios

Let's take a look at a few scenarios where Personalizer can be used to select the best content to render for a user.

|Content type|Actions (with features)|Context features|Returned Reward Action ID<br>(display this content)|
|--|--|--|--|
|News list|a. `The president...` (national, politics, [text])<br>b. `Premier League ...` (global, sports, [text, image, video])<br> c. `Hurricane in the ...` (regional, weather, [text,image]|Device news is read from<br>Month, or season<br>|a `The president...`|
|Movies list|1. `Star Wars` (1977, [action, adventure, fantasy], George Lucas)<br>2. `Hoop Dreams` (1994, [documentary, sports], Steve James<br>3. `Casablanca` (1942, [romance, drama, war], Michael Curtiz)|Device movie is watched from<br>screen size<br>Type of user<br>|3. `Casablanca`|
|Products list|i. `Product A` (3 kg, $$$$, deliver in 24 hours)<br>ii. `Product B` (20 kg, $$, 2 week shipping with customs)<br>iii. `Product C` (3 kg, $$$, delivery in 48 hours)|Device shopping  is read from<br>Spending tier of user<br>Month, or season|ii. `Product B`|

Personalizer used reinforcement learning to select the single best action, known as _reward action ID_. The machine learning model uses: 

* A trained model - information previously received from the personalize service used to improve the machine learning model
* Current data - specific actions with features and context features


## Scenario requirements

Use Personalizer when your scenario has:

* Has a limited set of actions or items to select from in each personalization event. For lower latency, we recommend no more than ~50 actions in each Rank API call. If you have a larger set of possible actions, we recommend [using a recommendation engine](where-can-you-use-personalizer.md#how-to-use-personalizer-with-a-recommendation-solution) or another mechanism to reduce the list down before calling the Rank API. 
* Has information describing each action: _actions with features_
* Has information describing the _context_, that is, state of your applications and/or users: _context features_
* Has a sufficient data/traffic to enable Personalizer to learn. A rule-of-thumb is a minimum of ~1k/day events for Personalizer to be learn effectively. If Personalizer doesn't receive the minimum traffic required, the service takes longer to determine the best actions. 

Note that since Personalizer uses collective information across all users to learn the best contextually dependent actions in near real-time, the service does not:
* Persist and manage user profile information
* Log individual users' preferences or history
* Require cleaned and labeled content

## How to design for and implement Personalizer

1. [Design](concepts-features.md) and plan **_actions_**, and **_context_**. Determine the reward algorithm for the **_reward_** score.
1. Each [Personalizer Resource](how-to-settings.md) you create is defined as one _Learning Loop). The loop will receive the both the Rank and Reward calls for that content or user experience.

    |Resource type| Purpose|
    |--|--|
    |[Apprentice mode](concept-apprentice-mode.md) `E0`|Train the Personalizer model without impacting your existing application, then deploy to _Online mode_ learning behavior to a production environment|
    |Standard, `S0`|Online learning behavior in a production environment|
    |Free, `F0`| Try Online learning behavior in a limited non-production environment|

1. Add Personalizer to your application, website, or system:
    1. Add a **Rank** call to Personalizer in your application, website, or system to determine best, single action or content item before it is shown to the user.
    1. Display best, content item, as which is the returned _reward action ID_, to user.
    1. Apply _business logic_ to user behavior data to determine the **reward** score, such as:

    |Behavior|Calculated reward score|
    |--|--|
    |User selected best, single _content_ item (reward action ID)|**1**|
    |User selected other content|**0**|
    |User paused, scrolling around indecisively, before selecting best, single _content_ item (reward action ID)|**0.5**|

    1. Add a **Reward** call sending a reward score between 0 and 1
        * Immediately after showing your content
        * Or sometime later in an offline system
    1. [Evaluate your loop](concepts-offline-evaluation.md) with an offline evaluation after a period of use. An offline evaluation allows you to test and assess the effectiveness of the Personalizer Service without changing your code or affecting user experience.

## Reference 

* [Personalizer C#/.NET SDK](/dotnet/api/overview/azure/cognitiveservices/client/personalizer)
* [Personalizer Go SDK](https://github.com/Azure/azure-sdk-for-go/tree/master/services/preview)
* [Personalizer JavaScript SDK](/javascript/api/@azure/cognitiveservices-personalizer/)
* [Personalizer Python SDK](/python/api/overview/azure/cognitiveservices/personalizer)
* [REST APIs](https://westus2.dev.cognitive.microsoft.com/docs/services/personalizer-api/operations/Rank)

## Next steps

> [!div class="nextstepaction"]
> [How Personalizer works](how-personalizer-works.md)
> [What is Reinforcement Learning?](concepts-reinforcement-learning.md)
