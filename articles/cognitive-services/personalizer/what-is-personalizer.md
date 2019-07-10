---
title: What is Personalizer?
titleSuffix: Azure Cognitive Services
description: Personalizer is a cloud-based API service that allows you to choose the best experience to show to your users, learning from their real-time behavior. 
services: cognitive-services
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: overview
ms.date: 05/07/2019
ms.author: edjez
#Customer intent: 
---

# What is Personalizer?

Azure Personalizer is a cloud-based API service that allows you to choose the best experience to show to your users, learning from their real-time behavior.

* Provide information about your users and content and receive the top action to show your users. 
* No need to clean and label data before using Personalizer.
* Provide feedback to Personalizer when it is convenient to you. 
* View real-time analytics. 
* Use Personalizer as part of a larger data science effort to validate existing experiments.

## How does Personalizer work?

Personalizer uses machine learning models to discover what action to rank highest in a context. Your client application provides a list of possible actions, with information about them; and information about the context, which may include information about the user, device, etc. Personalizer determines the action to take. Once your client application uses the chosen action, it provides feedback to Personalizer in the form of a reward score. After the feedback loop is complete, Personalizer automatically updates its own model used for future ranks.

## How do I use the Personalizer?

![Using Personalizer to choose which video to show to a user](media/what-is-personalizer/personalizer-example-highlevel.png)

1. Choose an experience in your app to personalize.
1. Create and configure the Personalization Service in the Azure portal
1. Use SDK to call Personalizer with information (_features_) about your users, and the content (_actions_). You don't need to provide clean, labeled data before using Personalizer. 
1. In the client application, show the user the action selected by Personalizer.
1. Use SDK to provide feedback to Personalizer indicating if the user selected Personalizer's action. This is a _reward score_, typically between -1 and 1.
1. View analytics in the Azure portal to evaluate how the system is working and how your data is helping personalization.

## Where can I use Personalizer?

For example, your client application can add Personalizer to:

* Personalize what article is highlighted on a news website.    
* Optimize ad placement on a website.
* Display a personalized "recommended item" on a shopping website.
* Suggest user interface elements such as filters to apply to a specific photo.
* Choose a chat bot's response to clarify user intent or suggest an action.
* Prioritize suggestions of what a user should do as the next step in a business process.

## Personalization for developers

Personalizer Service has two APIs:

* Send information (_features_) about your users and the content (_actions_) to personalize. Personalizer responds with the top action.
* Send feedback to Personalizer about how well the ranking worked as a number typically between 0 and 1 (the previous section said -1 and 1). 

![Basic sequence of events for Personalization](media/what-is-personalizer/personalization-intro.png)

## Next steps

* [Quickstart: Create a feedback loop in C#](csharp-quickstart-commandline-feedback-loop.md)
* [Use the interactive demo](https://personalizationdemo.azurewebsites.net/)
