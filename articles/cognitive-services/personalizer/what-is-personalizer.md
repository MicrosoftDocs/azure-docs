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

Azure Personalizer is a cloud-based API service that allows you to choose the best experience to show to your users, learning from their collective real-time behavior.

* Provide information about your users and content and receive the top action to show your users. 
* No need to clean and label data before using Personalizer.
* Provide feedback to Personalizer when it is convenient to you. 
* View real-time analytics. 

See a demonstration of [how Personalizer works](https://personalizercontentdemo.azurewebsites.net/)

## How does Personalizer work?

Personalizer uses machine learning models to discover what action to rank highest in a context. Your client application provides a list of possible actions, with information about them; and information about the context, which may include information about the user, device, etc. Personalizer determines the action to take. Once your client application uses the chosen action, it provides feedback to Personalizer in the form of a reward score. After the feedback is received, Personalizer automatically updates its own model used for future ranks. Over time, Personalizer will train one model that can suggest the best action to choose in each context based on their features.

## How do I use the Personalizer?

![Using Personalizer to choose which video to show to a user](media/what-is-personalizer/personalizer-example-highlevel.png)

1. Choose an experience in your app to personalize.
1. Create and configure an instance of the Personalization Service in the Azure portal. Each instance is a Personalizer Loop.
1. Use the [Rank API](https://westus2.dev.cognitive.microsoft.com/docs/services/personalizer-api/operations/Rank) to call Personalizer with information (_features_) about your users, and the content (_actions_). You don't need to provide clean, labeled data before using Personalizer. APIs can be called directly or using SDKs available for different programming languages.
1. In the client application, show the user the action selected by Personalizer.
1. Use the [Reward API](https://westus2.dev.cognitive.microsoft.com/docs/services/personalizer-api/operations/Reward) to provide feedback to Personalizer indicating if the user selected Personalizer's action. This is a _[reward score](concept-rewards.md)_.
1. View analytics in the Azure portal to evaluate how the system is working and how your data is helping personalization.

## Where can I use Personalizer?

For example, your client application can add Personalizer to:

* Personalize what article is highlighted on a news website.    
* Optimize ad placement on a website.
* Display a personalized "recommended item" on a shopping website.
* Suggest user interface elements such as filters to apply to a specific photo.
* Choose a chat bot's response to clarify user intent or suggest an action.
* Prioritize suggestions of what a user should do as the next step in a business process.

Personalizer is not a service to persist and manage user profile information, or to log individual users' preferences or history. Personalizer learns from each interaction's features in the action of a context in a single model that can obtain maximum rewards when similar features occur. 

## Personalization for developers

Personalizer Service has two APIs:

* Send information (_features_) about your users and the content (_actions_) to personalize. Personalizer responds with the top action.
* Send feedback to Personalizer about how well the ranking worked as a [reward score](concept-rewards.md). 

![Basic sequence of events for Personalization](media/what-is-personalizer/personalization-intro.png)

## Next steps

* [What's new in Personalizer?](whats-new.md)
* [How Personalizer works?](how-personalizer-works.md)
* [What is Reinforcement Learning?](concepts-reinforcement-learning.md)
* [Learn about features and actions for the Rank request](concepts-features.md)
* [Learn about determining the score for the Reward request](concept-rewards.md)
* [Use the interactive demo](https://personalizationdemo.azurewebsites.net/)
