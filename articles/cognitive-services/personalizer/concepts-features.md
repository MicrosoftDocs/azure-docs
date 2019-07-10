---
title: "Features: Action and context - Personalizer" 
titleSuffix: Azure Cognitive Services
description: Personalizer uses features, information about actions and context, to make better ranking suggestions. Features can be very generic, or specific to an item.
services: cognitive-services
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 06/24/2019
ms.author: edjez
---

# Features are information about actions and context

The Personalizer service works by learning what your application should show to users in a given context.

Personalizer uses **features**, which is information about the **current context** to choose the best **action**. The features represent all information you think may help personalize to achieve higher rewards. Features can be very generic, or specific to an item. 

For example, you may have a **feature** about:

* The _user_ such as a `UserID`. 
* The _content_ such as if a video is a `Documentary`, a `Movie`, or a `TV Series`, or whether a retail item is available in store.
* The _current_ period of time such as which day of the week it is.

Personalizer does not prescribe, limit, or fix what features you can send for actions and context:

* You can send some features for some actions and not for others, if you don't have them. For example, TV series may have attributes movies don't have.
* You may have some features available only some times. For example, a mobile application may provide more information than a web page. 
* Over time, you may add and remove features about context and actions. Personalizer continues to learn from available information.
* There must be at least one feature for the context. Personalizer does not support an empty context. If you only send a fixed context every time, Personalizer will choose the action for rankings only regarding the features in the actions. 
* Personalizer will try to choose actions that work best for everyone at any time.

## Supported feature types

Personalizer supports features of string, numeric, and boolean types.

### How choice of feature type affects Machine Learning in Personalizer

* **Strings**: For string types, every combination of key and value creates new weights in the Personalizer machine learning model. 
* **Numeric**: You should use numerical values when the number should proportionally affect the personalization result. This is very scenario dependent. In a simplified example e.g. when personalizing a retail experience, NumberOfPetsOwned could be a feature that is numeric as you may want people with 2 or 3 pets to influence the personalization result twice or thrice as much as having 1 pet. Features that are based on numeric units but where the meaning isn't linear - such as Age, Temperature, or Person Height - are best encoded as strings, and the feature quality can typically be improved by using ranges. For example, Age could be encoded as "Age":"0-5", "Age":"6-10", etc.
* **Boolean** values sent with value of "false" act as if they hadn't been sent at all.

Features that are not present should be omitted from the request. Avoid sending features with a null value, because it will be processed as existing and with a value of "null" when training the model.

## Categorize features with namespaces

Personalizer takes in features organized into namespaces. You determine, in your application, if namespaces are used and what they should be. Namespaces are used to group features about a similar topic, or features that come from a certain source.

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

In the following JSON, `user`, `state`, and `device` are feature namespaces.

JSON objects can include nested JSON objects and simple property/values. An array can be included only if the array items are numbers. 

```JSON
{
    "contextFeatures": [
        { 
            "user": {
                "name":"Doug",
                "latlong": [47.6, -122.1]
            }
        },
        {
            "state": {
                "timeOfDay": "noon",
                "weather": "sunny"
            }
        },
        {
            "device": {
                "mobile":true,
                "Windows":true
            }
        }
    ]
}
```

## How to make feature sets more effective for Personalizer

A good feature set helps Personalizer learn how to predict the action that will drive the highest reward. 

Consider sending features to the Personalizer Rank API that follow these recommendations:

* There are enough features to drive personalization. The more precisely targeted the content needs to be, the more features are needed.

* There are enough features of diverse *densities*. A feature is *dense* if many items are grouped in a few buckets. For example, thousands of videos can be classified as "Long" (over 5 min long) and "Short" (under 5 min long). This is a *very dense* feature. On the other hand, the same thousands of items can have an attribute called "Title", which will almost never have the same value from one item to another. This is a very non-dense or *sparse* feature.  

Having features of high density helps the Personalizer extrapolate learning from one item to another. But if there are only a few features and they are too dense, the Personalizer will try to precisely target content with only a few buckets to choose from.

### Improve feature sets 

Analyze the user behavior by doing an Offline Evaluation. This allows you to look at past data to see what features are heavily contributing to positive rewards versus those that are contributing less. You can see what features are helping, and it will be up to you and your application to find better features to send to Personalizer to improve results even further.

These following sections are common practices for improving features sent to Personalizer.

#### Make features more dense

It is possible to improve your feature sets by editing them to make them larger and more or less dense.

For example, a timestamp down to the second is a very sparse feature. It could be made more dense (effective) by classifying times into "morning", "midday", "afternoon", etc.


#### Expand feature sets with extrapolated information

You can also get more features by thinking of unexplored attributes that can be derived from information you already have. For example, in a fictitious movie list personalization, is it possible that a weekend vs weekday elicits different behavior from users? Time could be expanded to have a "weekend" or "weekday" attribute. Do national cultural holidays drive attention to certain movie types? For example, a "Halloween" attribute is useful in places where it is relevant. Is it possible that rainy weather has significant impact on the choice of a movie for many people? With time and place, a weather service could provide that information and you can add it as an extra feature. 

#### Expand feature sets with artificial intelligence and cognitive services

Artificial Intelligence and ready-to-run Cognitive Services can be a very powerful addition to the Personalizer. 

By preprocessing your items using artificial intelligence services, you can automatically extract information that is likely to be relevant for personalization.

For example:

* You can run a movie file via [Video Indexer](https://azure.microsoft.com/services/media-services/video-indexer/) to extract scene elements, text, sentiment, and many other attributes. These attributes can then be made more dense to reflect characteristics that the original item metadata didn't have. 
* Images can be run through object detection, faces through sentiment, etc.
* Information in text can be augmented by extracting entities, sentiment, expanding entities with Bing knowledge graph, etc.

You can use several other [Azure Cognitive Services](https://www.microsoft.com/cognitive-services), like

* [Entity Linking](../entitylinking/home.md)
* [Text Analytics](../text-analytics/overview.md)
* [Emotion](../emotion/home.md)
* [Computer Vision](../computer-vision/home.md)

## Actions represent a list of options

Each action:

* Has an ID.
* Has a list of features.
* The list of features can be large (hundreds) but we recommend evaluating feature effectiveness to remove features that aren't contributing to getting rewards. 
* The features in the **actions** may or may not have any correlation with features in the **context** used by Personalizer.
* Features for actions may be present in some actions and not others. 
* Features for a certain action ID may be available one day, but later on become unavailable. 

Personalizer's machine learning algorithms will perform better when there are stable feature sets, but Rank calls will not fail if the feature set changes over time.

Do not send in more than 50 actions when Ranking actions. These may be the same 50 actions every time, or they may change. For example, if you have a product catalog of 10,000 items for an e-commerce application, you may use a recommendation or filtering engine to determine the top 40 a customer may like, and use Personalizer to find the one that will generate the most reward (for example, the user will add to the basket) for the current context.


### Examples of actions

The actions you send to the Rank API will depend on what you are trying to personalize.

Here are some examples:

|Purpose|Action|
|--|--|
|Personalize which article is highlighted on a news website.|Each action is a potential news article.|
|Optimize ad placement on a website.|Each action will be a layout or rules to create a layout for the ads (for example, on the top, on the right, small images, big images).|
|Display personalized ranking of recommended items on a shopping website.|Each action is a specific product.|
|Suggest user interface elements such as filters to apply to a specific photo.|Each action may be a different filter.|
|Choose a chat bot's response to clarify user intent or suggest an action.|Each action is an option of how to interpret the response.|
|Choose what to show at the top of a list of search results|Each action is one of the top few search results.|


### Examples of features for actions

The following are good examples of features for actions. These will depend a lot on each application.

* Features with characteristics of the actions. For example, is it a movie or a tv series?
* Features about how users may have interacted with this action in the past. For example, this movie is mostly seen by people in demographics A or B, it is typically played no more than one time.
* Features about the characteristics of how the user *sees* the actions. For example, does the poster for the movie shown in the thumbnail include faces, cars, or landscapes?

### Load actions from the client application

Features from actions may typically come from content management systems, catalogs, and recommender systems. Your application is responsible for loading the information about the actions from the relevant databases and systems you have. If your actions don't change or getting them loaded every time has an unnecessary impact on performance, you can add logic in your application to cache this information.

### Prevent actions from being ranked

In some cases, there are actions that you don't want to display to users. The best way to prevent an action from being ranked as topmost is not to include it in the action list to the Rank API in the first place.

In some cases, it can only be determined later in your business logic if a resulting _action_ of a Rank API call is to be shown to a user. For these cases, you should use _Inactive Events_.

## JSON format for actions

When calling Rank, you will send multiple actions to choose from:

JSON objects can include nested JSON objects and simple property/values. An array can be included only if the array items are numbers. 

```json
{
    "actions": [
    {
      "id": "pasta",
      "features": [
        {
          "taste": "salty",
          "spiceLevel": "medium",
          "grams": [400,800]
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
          "spiceLevel": "none",
          "grams": [150, 300, 450]
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
          "spiceLevel": "none",
          "grams": [300, 600, 900]
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
          "spiceLevel": "low",
          "grams": [300, 600]
        },
        {
          "nutritionLevel": 8
        }
      ]
    }
  ]
}
```

## Examples of context information

Information for the _context_ depends on each application and use case, but it typically may include information such as:

* Demographic and profile information about your user.
* Information extracted from HTTP headers such as user agent, or derived from HTTP information such as reverse geographic lookups based on IP addresses.
* Information about the current time, such as day of the week, weekend or not, morning or afternoon, holiday season or not, etc.
* Information extracted from mobile applications, such as location, movement, or battery level.
* Historical aggregates of the behavior of users - such as what are the movie genres this user has viewed the most.

Your application is responsible for loading the information about the context from the relevant databases, sensors, and systems you may have. If your context information doesn't change, you can add logic in your application to cache this information, before sending it to the Rank API.

## JSON format for context 

Context is expressed as a JSON object that is sent to the Rank API:

JSON objects can include nested JSON objects and simple property/values. An array can be included only if the array items are numbers. 

```JSON
{
    "contextFeatures": [
        { 
            "user": {
                "name":"Doug"
            }
        },
        {
            "state": {
                "timeOfDay": "noon",
                "weather": "sunny"
            }
        },
        {
            "device": {
                "mobile":true,
                "Windows":true,
                "screensize": [1680,1050]
                }
            }
        }
    ]
}
```

## Next steps

[Reinforcement learning](concepts-reinforcement-learning.md) 
