---
title: Actions, Context - Concept
titleSuffix: Personalizer - Azure Cognitive Services
description: The Personalizer service works by learning what your application should show to users in a given context. Your application provides a list of options, called actions, when calling the Rank API. 
services: cognitive-services
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: overview
ms.date: 05/07/2019
ms.author: edjez
---
# Actions and context

The Personalizer service works by learning what your application should show to users in a given context. Your application provides a list of options, called actions, when calling the Rank API. 

Personalizer uses information about the current context to choose the best action. The context is a dictionary of features that represent all information you think may help personalize and achieve higher rewards.

## Actions represent a list of options

Each action:

* Has an ID.
* Has a list of features.
* The list of features can be large (hundreds) but we recommend evaluating feature effectiveness to remove features that aren't contributing to getting rewards. 
* The features in the actions may or may not have any correlation with features in the Context used by Personalizer.
* Features for actions may be present in some actions and not others. 
* Features for a certain action ID may be available one day, but later on become unavailable. Personalizer's machine learning algorithms will perform better when there are stable feature sets, but Rank calls will not fail if the feature set changes over time.

Do not send in more than 50 actions when Ranking actions. These may be the same 50 actions every time, or they may change. For example, if you have a product catalog of 10,000 items for an e-commerce application, you may use a recommendation or filtering engine to determine the top 40 a customer may like, and use Personalizer to find the one that will generate the most reward (for example, the user will add to the basket) for the current context.


## Examples of actions

The actions you send to the Rank API will depend on what you are trying to personalize.

Here are some examples:

* Personalize what article is highlighted on a news website: Each action is a potential news article.
* Optimize ad placement on a website - Each action will be a layout or rules to crate a layout for the ads (for example, on the top, on the right, small images, big images). 
* Display personalized ranking of recommended items on a shopping website: Each action is a specific product.
* Suggest user interface elements such as filters to apply to a specific photo: Each action may be a different filter.
* Choose a chat bot's response to clarify user intent or suggest an action: Each action is an option of how to interpret the response.
* Choose what to show at the top of a list of search results: Each action is one of the top few search results.

## Sending actions to the Rank API

An action is expressed as JSON object sent in to the Rank API:

```json
{
    "id": "pasta",
    "features": [
        {
          "taste": "salty",
          "spiceLevel": "medium"
        },
        {
          "nutritionLevel": 5,
          "cuisine": "italian"
        }
    ]
 }
```

When calling Rank, you will send multiple actions to choose from:

```json

"actions": [
    {
      "id": "pasta",
      "features": [
        {
          "taste": "salty",
          "spiceLevel": "medium"
        },
        {
          "nutritionLevel": 5,
          "cuisine": "italian"
        }
      ]
    },
    {
      "id": "ice cream",
      "features": [
        {
          "taste": "sweet",
          "spiceLevel": "none"
        },
        {
          "nutritionalLevel": 2
        }
      ]
    },
    {
      "id": "juice",
      "features": [
        {
          "taste": "sweet",
          "spiceLevel": "none"
        },
        {
          "nutritionLevel": 5
        },
        {
          "drink": true
        }
      ]
    },
    {
      "id": "salad",
      "features": [
        {
          "taste": "salty",
          "spiceLevel": "low"
        },
        {
          "nutritionLevel": 8
        }
      ]
    }
  ]

```

<!--
### Example in C#

To build a JSON object like the above, you can use the RankableAction classes in *Microsoft.Azure.CognitiveServices.Personalization.Models* as follows:

```csharp
    using Microsoft.Azure.CognitiveServices.Personalization;
    using Microsoft.Azure.CognitiveServices.Personalization.Models;

    ...
    ...

       static IList<RankableAction> GetActions()
        {
            IList<RankableAction> actions = new List<RankableAction>
            {
                new RankableAction
                {
                    Id = "pasta",
                    Features =
                    new List<object>() { new { taste = "salty", spiceLevel = "medium" }, new { nutritionLevel = 5, cuisine = "italian" } }
                },

                new RankableAction
                {
                    Id = "ice cream",
                    Features =
                    new List<object>() { new { taste = "sweet", spiceLevel = "none" }, new { nutritionalLevel = 2 } }
                },

                new RankableAction
                {
                    Id = "juice",
                    Features =
                    new List<object>() { new { taste = "sweet", spiceLevel = "none" }, new { nutritionLevel = 5 }, new { drink = true } }
                },

                new RankableAction
                {
                    Id = "salad",
                    Features =
                    new List<object>() { new { taste = "salty", spiceLevel = "low" }, new { nutritionLevel = 8 } }
                }
            };

            return actions;
        }
```
-->

## Examples of features for actions

The following are good examples of features for actions. These will depend a lot on each application.

* Features with characteristics of the actions. For example, is it a movie or a tv series?
* Features about how users may have interacted with this action in the past. For example, this movie is mostly seen by people in demographics A or B, it is typically played no more than one time.
* Features about the characteristics of how the user *sees* the actions. For example, does the poster for the movie shown in the thumbnail include faces, cars, or landscapes?

## Loading actions and features

Features from actions may typically come from content management systems, catalogs, and recommender systems. Your application is responsible for loading the information about the actions from the relevant databases and systems you may have. If your actions don't change or getting them loaded every time has an unnecessary impact on performance, you can add logic in your application to cache this information.


## Using Cognitive Services to generate features for actions

If your application may benefit from richer features generated at scale, you may also use Cognitive Services to analyze content, images, and user patterns and create additional attributes. For example:

* Use Text Analytics to extract entities that are being discussed in a news article.
* Use Vision services to determine items in a picture.
* Use Anomaly Detector to establish failure potential in different products displayed in service.
* Use Sentiment Analysis to establish the tone / sentiment of an article, or the sentiment of a preview sentence that a user sees.

## Preventing actions from being ranked

In some cases, there are actions that you don't want to display to users. The best way to prevent an action from being ranked as topmost is not to include it in the action list to the Rank API in the first place.

In some cases, it can only be determined later in your business logic if a resulting Action of a Rank is to be shown to a user. For these cases, you should use _Inactive Events_.

## Examples of context information

Information in the Context depends on each application and use case, but it typically may include information such as:

* Demographic and profile information about your user.
* Information extracted from http headers such as user agent, or derived from http information such as reverse geographic lookups based on IP addresses.
* Information about the current time, such as day of the week, weekend or not, morning or afternoon, holiday season or not, etc.
* Information extracted from mobile applications, such as location, movement, or battery level.
* Historical aggregates of the behavior of users - such as what are the movie genres this user has viewed the most.

Your application is responsible for loading the information about the context from the relevant databases, sensors, and systems you may have. If your context information doesn't change, you can add logic in your application to cache this information, before sending it to the Rank API.

##  Sending context to the Rank API

Context is expressed as a JSON object that is sent to the Rank API

```json
"contextFeatures": [
    {
      "timeOfDay": "noon",
      "weather": "sunny"
    },
    {
      "device": "mobile"
    }
  ]
```

## Next steps:

Use [offline evaluation](concepts-offline-evaluation.md) to improve your Personalizer loop