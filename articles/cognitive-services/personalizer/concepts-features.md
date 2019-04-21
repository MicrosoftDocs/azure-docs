---
title: "Features: action and context"
titleSuffix: Personalizer - Azure Cognitive Services
description: Personalizer uses **features**, information about **actions** and **context**, to make better ranking suggestions. Features can be very generic, or specific to an item.
services: cognitive-services
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: overview
ms.date: 05/07/2019
ms.author: edjez
---
# Features are information about actions and context

The Personalizer service works by learning what your application should show to users in a given context.

Personalizer uses information about the current context to choose the best action. The context is a dictionary of features that represent all information you think may help personalize and achieve higher rewards.

Personalizer uses **features**, information about **actions** and **context**, to make better ranking suggestions. Features can be very generic, or specific to an item. 

For example, you may have a **feature** about:

* The _user_ such as a `UserID`. 
* The _content_ such as if a video is a `Documentary`, a `Movie`, or a `TV Series`, or whether a retail item is available in store.
* The _current_ period of time such as which day of the week it is.

Personalizer does not prescribe, limit or fix what features you can send for actions and context:

* You can send some features for some actions and not for others, if you don't have them. For example, TV series may have attributes movies don't have.
* You may have some features available only some times. For example, a mobile application may provide more information than a web page. 
* Over time, you may add and remove features about context and actions. Personalizer continues to learn from available information.
* There must be at least one feature for the context. Personalizer does not support an empty context. If you only send a fixed context every time, Personalizer will choose the action for rankings only regarding the features in the actions. Personalizer will try to choose actions that work best for everyone at any time.

## Supported feature types

Personalizer supports features of string, numeric, and boolean types.

Features that are not present should be omitted from the request. Avoid sending features with a null value, because it will be processed as existing and with a value of "null" when training the model.

## Categorize features with namespaces

Personalizer takes in features organized into namespaces. You you determine in your application if namespaces are used and what they should be. Namespaces are used to group features about a similar topic, or features that come from a certain source.

The following are examples of feature namespaces used by applications:

* User_Profile_from_CRM
* Time
* Mobile_Device_Info
* http_user_agent
* VideoResolution
* UserDeviceInfo
* Weather
* Product_Recommendation_Ratings
* current_time
* NewsArticle_TextAnalytics

You can name feature namespaces following your own conventions as long as they are valid JSON keys.

## Features are represented in JSON format

Features are represented in JSON format. Features for **actions** and **context** are sent following the same conventions. 

The following example shows some common ways to represent features:

```JSON
{
    //WE KNOW THIS IS WRONG
    "contextFeatures": [
        {
            "user":{
                "name":"Doug"
            },
            "object":{
                "color":"brown",
                "weight":"light",
                "temp":70,
                "temp2":[5,4,6],
                "temp3":{},
                "temp4":{"j":5,"g":4,"p":3}
            }
        }
    ],
    "actions": [
        {"id":"bread"},
        {"id":"dog"},
        {"id":"box"},
        {"id":"envelope"}
    ]
}
```

## What makes feature sets more or less effective for Personalizer?

A good feature set for actions and context helps Personalizer learn how to predict the action that will drive the highest reward. 

Analyze the user behavior by doing an Offline Evaluation. This allows you to look at past data to see what features are heavily contributing to positive rewards versus those that are contributing less. <!--See [How To Start an Offline Evaluation](how-to-offline-evaluation.md).-->

Consider sending features to the Personalizer Rank API that follow these recommendations:

* There are enough features to drive personalization. The more precisely targeted the content needs to be, the more features are needed.

* There are enough features of diverse *densities*. A feature is *dense* if many items are grouped in a few buckets. For example, thousands of videos can be classified as "Long" (over 5 min long) and "Short" (under 5 min long). This is a *very dense* feature. On the other hand, the same thousands of items can have an attribute called "Title", which will almost never have the same value from one item to another. This is a very non-dense or *sparse* feature.  

Having features of high density helps the Personalizer extrapolate learning from one item to another. But if there are only a few features and they are too dense, the Personalizer will try to precisely target content with only a few buckets to choose from.


## Improving feature sets 

After you run an Offline Evaluation, you can see what features are helping, and it will be up to you and your application to find better features to send to Personalizer to improve results even further.

These following sections are common practices for improving features sent to Personalizer.

### Making features more dense

It is possible to improve your feature sets by editing them to make them larger and more or less dense.

For example, a timestamp down to the second is a very sparse feature. It could be made more dense by classifying times into "morning", "midday", "afternoon", etc.


### Expanding feature sets with extrapolated information

You can also get more features by thinking of unexplored attributes that can be derived from information you already have. For example, in a fictitious movie list personalization, is it possible that a weekend vs weekday elicit different behavior from users? Time could be expanded to have a "weekend" or "weekday" attribute. Do national cultural holidays drive attention to certain movie types? For example, a "Halloween" attribute is useful in places where it is relevant. Is it possible that rainy weather has significant impact on the choice of a movie for many people? With time and place, a weather service could provide that information and you can add it as an extra feature. 

### Expanding feature sets with artificial intelligence and cognitive services

Artificial Intelligence and ready-to-run Cognitive Services can be a very powerful addition to the Personalizer. 

By pre-processing your items using AI services, you can automatically extract troves of information that is likely to be relevant for personalization.

For example:

* You can run a movie file via [Video Indexer](https://azure.microsoft.com/en-us/services/media-services/video-indexer/) to extract scene elements, text, sentiment, and many other attributes. These attributes can then be made more dense to reflect characteristics that the original item metadata didn't have. 
* Images can be run through object detection, faces through sentiment, etc.
* Information in text can be augmented by extracting entities, sentiment, expanding entities with Bing knowledge graph, etc.

You can use several other [Azure Cognitive Services](https://www.microsoft.com/cognitive-services), like
[Entity Linking](../entitylinking/home.md),
[Text Analytics](../text-analytics/overview.md),
[Emotion](../emotion/home.md), and
[Computer Vision](../computer-vision/home.md).

# Actions represent a list of options

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

[Reinforcement learning](concepts-reinforcement-learning.md) 