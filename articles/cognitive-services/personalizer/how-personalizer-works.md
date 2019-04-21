---
title: How Personalizer Works
titleSuffix: Personalizer - Azure Cognitive Services
description: Personalizer uses machine learning to discover what action to use in a context. Each learning loop has a model that is trained exclusively on data that you have sent to it via Rank and Reward calls. Every learning loop is completely independent of each other.
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: overview
ms.date: 05/07/2019
ms.author: edjez
---

# How Personalizer Works

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

## Research behind personalizer

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

* **[Features](concepts-features.md)**: A unit of information about a content item or a user context. For example, this JSON represents three examples of feature information:
    
    ```JSON
    {
        "Video Genre": "Documentary", 
        "Premium User": "y",
        "UserID: 12345"
    }
    ```

* **Reward**: A measure of how the user responded to the Rank API returned action, as a score between 0 and 1. The 0 to 1 value is set by your business logic, based on how the choice helped achieve your business goals of personalization. 

* **Exploration**: The Personalizer service is exploring when, instead of returning the best action, it chooses a different action for the user. The Personalizer service avoids drift, stagnation, and can adapt to ongoing user behavior by exploring. 

* **Experiment Duration**: The amount of time the Personalizer service waits for a reward, starting from the moment the Rank call happened for that event.

* **Inactive Events**: An inactive event is one where you called Rank, but you're not sure the user will ever see the result, due to client application decisions. Inactive events allow you to create and store personalization results, then decide to discard them later without impacting the machine learning model.

* **Model**: A Personalizer model captures all data learned about user behavior, getting training data from the combination of the arguments you send to Rank and Reward calls, and with a training behavior determined by the Learning Policy. 

## Next Steps

Understand [where you can use Personalizer](where-can-you-use-personalizer.md).