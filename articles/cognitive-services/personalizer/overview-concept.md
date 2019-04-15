---
title: Concepts 
titleSuffix: Personalizer - Azure Cognitive Services
description: 
services: cognitive-services
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: overview
ms.date: 05/07/2019
ms.author: edjez
---

# Concepts for Personalizer

### Introduction

When using Personalizer, create a learning loop for each part or behavior of your application you want to personalize.

For each loop, **call the Rank API with** base on the current context, with:

* List of possible actions: content items from which to select top action.
* List of [context features](concepts-features.md): data about user, content, and context. 
* List of actions to ignore.  

The service returns the top action, the _Reward Action_,  to show to your users. Your client application will write business logic that measures the user behavior and derives a [reward score](reward-concept.md). You will then send the Reward score to Personalizer via the **Reward API**.

<!-- this returned action needs a name - personalized action, primary action, returned action, suggested action -->


### Common Concepts

<!-- please find something other than Personalizer loop -->

* **Learning Loop**: You can create a learning loop for every part of your application that can benefit from personalization. If you have more than one experience to personalize, create a loop for each. 

* **Actions**: Actions are the content items, products, promotions, etc. to choose from. Personalizer will choose which one you show users, the _Reward action_, via the Rank API. Each action can have features for it.

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

* **Reward**: A measure of how the user responded to the Rank API returned action, as a score between 0 and 1. Zero indicates the user did not choose the Rank API returned action. . The 0 to 1 value is set by your business logic based on how the choice helped achieve the goals of personalization. 

* **Exploration**: The Personalizer service avoids drift, stagnation, and can adapt to ongoing user behavior by exploring. The Personalizer service is exploring when, instead of returning the best action, it chooses a different action for the user. 

* **Experiment Duration**: The time the Personalizer service waits for a reward, starting from the moment the Rank call happened for that event. <!-- this can be set in config correct? anything settable, let's call out -->

* **Inactive Events**: An inactive event is one where you called Rank, but you're not sure the user will ever see the result, due to client application decisions. Inactive events allow you to create and store personalization results, then decide to discard them later without impacting the machine learning model.

* **Model**: A Personalizer model captures all data learned about user behavior, getting training data from the combination of the arguments you send to Rank and Reward calls, and with a training behavior determined by the Learning Policy. <!-- what does this last part add to the sentence, "training behavior determined by the learning policy"? You are trying to say something about learning policy and the model but it needs to be more clear. -->

# Next Steps

Understand [how the Personalizer service works](how-personalizer-works.md), in order to get the best results or to troubleshoot issues.