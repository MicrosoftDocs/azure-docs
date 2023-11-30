---
title: "Features: Action and Context - Personalizer" 
titleSuffix: Azure AI services
description: Personalizer uses features, information about actions and context, to make better ranking suggestions. Features can be generic, or specific to an item.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: azure-ai-personalizer
ms.topic: conceptual
ms.date: 12/28/2022
---

# Context and actions

[!INCLUDE [Deprecation announcement](includes/deprecation.md)]

Personalizer works by learning what your application should show to users in a given context. Context and actions are the two most important pieces of information that you pass into Personalizer. The **context** represents the information you have about the current user or the state of your system, and the **actions** are the options to be chosen from.

## Context

Information for the _context_ depends on each application and use case, but it typically may include information such as:

* Demographic and profile information about your user.
* Information extracted from HTTP headers such as user agent, or derived from HTTP information such as reverse geographic lookups based on IP addresses.
* Information about the current time, such as day of the week, weekend or not, morning or afternoon, holiday season or not, etc.
* Information extracted from mobile applications, such as location, movement, or battery level.
* Historical aggregates of the behavior of users - such as what are the movie genres this user has viewed the most.
* Information about the state of the system.

Your application is responsible for loading the information about the context from the relevant databases, sensors, and systems you may have. If your context information doesn't change, you can add logic in your application to cache this information, before sending it to the Rank API.

## Actions

Actions represent a list of options.

Don't send in more than 50 actions when Ranking actions. They may be the same 50 actions every time, or they may change. For example, if you have a product catalog of 10,000 items for an e-commerce application, you may use a recommendation or filtering engine to determine the top 40 a customer may like, and use Personalizer to find the one that will generate the most reward for the current context.

### Examples of actions

The actions you send to the Rank API will depend on what you are trying to personalize.

Here are some examples:

|Purpose|Action|
|--|--|
|Personalize which article is highlighted on a news website.|Each action is a potential news article.|
|Optimize ad placement on a website.|Each action will be a layout or rules to create a layout for the ads (for example, on the top, on the right, small images, large images).|
|Display personalized ranking of recommended items on a shopping website.|Each action is a specific product.|
|Suggest user interface elements such as filters to apply to a specific photo.|Each action may be a different filter.|
|Choose a chat bot's response to clarify user intent or suggest an action.|Each action is an option of how to interpret the response.|
|Choose what to show at the top of a list of search results|Each action is one of the top few search results.|

### Load actions from the client application

Features from actions may typically come from content management systems, catalogs, and recommender systems. Your application is responsible for loading the information about the actions from the relevant databases and systems you have. If your actions don't change or getting them loaded every time has an unnecessary impact on performance, you can add logic in your application to cache this information.

### Prevent actions from being ranked

In some cases, there are actions that you don't want to display to users. The best way to prevent an action from being ranked is by adding it to the [Excluded Actions](/dotnet/api/microsoft.azure.cognitiveservices.personalizer.models.rankrequest.excludedactions) list, or not passing it to the Rank Request.

In some cases, you might not want events to be trained on by default. In other words, you only want to train events when a specific condition is met. For example, The personalized part of your webpage is below the fold (users have to scroll before interacting with the personalized content). In this case you'll render the entire page, but only want an event to be trained on when the user scrolls and has a chance to interact with the personalized content. For these cases, you should [Defer Event Activation](concept-active-inactive-events.md) to avoid assigning default reward (and training) events that the end user didn't have a chance to interact with.

## Features

Both the **context** and possible **actions** are described using **features**. The features represent all information you think is important for the decision making process to maximize rewards. A good starting point is to imagine you're tasked with selecting the best action at each timestamp and ask yourself: "What information do I need to make an informed decision? What information do I have available to describe the context and each possible action?" Features can be generic, or specific to an item.

Personalizer does not prescribe, limit, or fix what features you can send for actions and context:

* Over time, you may add and remove features about context and actions. Personalizer continues to learn from available information.
* For categorical features, there's no need to pre-define the possible values.
* For numeric features, there's no need to pre-define ranges.
* Feature names starting with an underscore `_` will be ignored.
* The list of features can be large (hundreds), but we recommend starting with a concise feature set and expanding as necessary.
* **action** features may or may not have any correlation with **context** features.
* Features that aren't available should be omitted from the request. If the value of a specific feature is not available for a given request, omit the feature for this request.
* Avoid sending features with a null value. A null value will be processed as a string with a value of "null" which is undesired.

It's ok and natural for features to change over time. However, keep in mind that Personalizer's machine learning model adapts based on the features it sees. If you send a request containing all new features, Personalizer's model won't be able to use past events to select the best action for the current event. Having a 'stable' feature set (with recurring features) will help the performance of Personalizer's machine learning algorithms.

### Context features
* Some context features may only be available part of the time. For example, if a user is logged into the online grocery store website, the context will contain features describing purchase history. These features won't be available for a guest user.
* There must be at least one context feature. Personalizer does not support an empty context.
* If the context features are identical for every request, Personalizer will choose the globally best action.

### Action features
* Not all actions need to contain the same features. For example, in the online grocery store scenario, microwavable popcorn will have a "cooking time" feature, while a cucumber won't.
* Features for a certain action ID may be available one day, but later on become unavailable.

Examples:

The following are good examples for action features. These will depend a lot on each application.

* Features with characteristics of the actions. For example, is it a movie or a tv series?
* Features about how users may have interacted with this action in the past. For example, this movie is mostly seen by people in demographics A or B, it's typically played no more than one time.
* Features about the characteristics of how the user *sees* the actions. For example, does the poster for the movie shown in the thumbnail include faces, cars, or landscapes?

## Supported feature types

Personalizer supports features of string, numeric, and boolean types. It's likely that your application will mostly use string features, with a few exceptions.

### How feature types affect machine learning in Personalizer

* **Strings**: For string types, every key-value (feature name, feature value) combination is treated as a One-Hot feature (for example, category:"Produce" and category:"Meat" would internally be represented as different features in the machine learning model).
* **Numeric**: Only use numeric values when the number is a magnitude that should proportionally affect the personalization result. This is very scenario dependent. Features that are based on numeric units but where the meaning isn't linear - such as Age, Temperature, or Person Height - are best encoded as categorical strings. For example Age could be encoded as "Age":"0-5", "Age":"6-10", etc. Height could be bucketed as "Height": "<5'0", "Height": "5'0-5'4", "Height": "5'5-5'11", "Height":"6'0-6-4", "Height":">6'4".
* **Boolean**
* **Arrays** Only numeric arrays are supported.

## Feature engineering

* Use categorical and string types for features that are not a magnitude.
* Make sure there are enough features to drive personalization. The more precisely targeted the content needs to be, the more features are needed.
* There are features of diverse *densities*. A feature is *dense* if many items are grouped in a few buckets. For example, thousands of videos can be classified as "Long" (over 5 min long) and "Short" (under 5 min long). This is a *very dense* feature. On the other hand, the same thousands of items can have an attribute called "Title", which will almost never have the same value from one item to another. This is a very non-dense or *sparse* feature.  

Having features of high density helps Personalizer extrapolate learning from one item to another. But if there are only a few features and they are too dense, Personalizer will try to precisely target content with only a few buckets to choose from.

### Common issues with feature design and formatting

* **Sending features with high cardinality.** Features that have unique values that are not likely to repeat over many events. For example, PII specific to one individual (such as name, phone number, credit card number, IP address) shouldn't be used with Personalizer.
* **Sending user IDs** With large numbers of users, it's unlikely that this information is relevant to Personalizer learning to maximize the average reward score. Sending user IDs (even if non-PII) will likely add more noise to the model and is not recommended.
* **Sending unique values that will rarely occur more than a few times**. It's recommended to bucket your features to a higher level-of-detail. For example, having features such as `"Context.TimeStamp.Day":"Monday"` or `"Context.TimeStamp.Hour":13` can be useful as there are only 7 and 24 unique values, respectively. However, `"Context.TimeStamp":"1985-04-12T23:20:50.52Z"` is very precise and has an extremely large number of unique values, which makes it very difficult for Personalizer to learn from it.

### Improve feature sets

Analyze the user behavior by running a [Feature Evaluation Job](how-to-feature-evaluation.md). This allows you to look at past data to see what features are heavily contributing to positive rewards versus those that are contributing less. You can see what features are helping, and it will be up to you and your application to find better features to send to Personalizer to improve results even further.

### Expand feature sets with artificial intelligence and Azure AI services

Artificial Intelligence and ready-to-run Azure AI services can be a very powerful addition to Personalizer.

By preprocessing your items using artificial intelligence services, you can automatically extract information that is likely to be relevant for personalization.

For example:

* You can run a movie file via [Video Indexer](https://azure.microsoft.com/products/ai-video-indexer/) to extract scene elements, text, sentiment, and many other attributes. These attributes can then be made more dense to reflect characteristics that the original item metadata didn't have.
* Images can be run through object detection, faces through sentiment, etc.
* Information in text can be augmented by extracting entities, sentiment, and expanding entities with Bing knowledge graph.

You can use several other [Azure AI services](https://www.microsoft.com/cognitive-services), like

* [Entity Linking](../language-service/entity-linking/overview.md)
* [Language service](../language-service/index.yml)
* [Face](../computer-vision/overview-identity.md)
* [Vision](../computer-vision/overview.md)

### Use embeddings as features

Embeddings from various Machine Learning models have proven to be affective features for Personalizer

* Embeddings from Large Language Models
* Embeddings from Azure AI Vision Models

## Namespaces

Optionally, features can be organized using namespaces (relevant for both context and action features). Namespaces can be used to group features by topic, by source, or any other grouping that makes sense in your application. You determine if namespaces are used and what they should be. Namespaces organize features into distinct sets, and disambiguate features with similar names. You can think of namespaces as a 'prefix' that is added to feature names. Namespaces should not be nested.

The following are examples of feature namespaces used by applications:

* User_Profile_from_CRM
* Time
* Mobile_Device_Info
* http_user_agent
* VideoResolution
* DeviceInfo
* Weather
* Product_Recommendation_Ratings
* current_time
* NewsArticle_TextAnalytics

### Namespace naming conventions and guidelines

* Namespaces should not be nested.
* Namespaces must start with unique ASCII characters (we recommend using names namespaces that are UTF-8 based). Currently having namespaces with same first characters could result in collisions, therefore it's strongly recommended to have your namespaces start with characters that are distinct from each other.
* Namespaces are case sensitive. For example `user` and `User` will be considered different namespaces.
* Feature names can be repeated across namespaces, and will be treated as separate features
* The following characters cannot be used: codes < 32 (not printable), 32 (space), 58 (colon), 124 (pipe), and 126–140.
* All namespaces starting with an underscore `_` will be ignored.

## JSON examples

### Actions
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

### Context

Context is expressed as a JSON object that is sent to the Rank API:

JSON objects can include nested JSON objects and simple property/values. An array can be included only if the array items are numbers.

```JSON
{
    "contextFeatures": [
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
    ]
}
```

### Namespaces

In the following JSON, `user`, `environment`, `device`, and `activity` are namespaces.

> [!Note]
> We strongly recommend using names for feature namespaces that are UTF-8 based and start with different letters. For example, `user`, `environment`, `device`, and `activity` start with `u`, `e`, `d`, and `a`. Currently having namespaces with same first characters could result in collisions.

```JSON
{
    "contextFeatures": [
        { 
            "user": {
                "profileType":"AnonymousUser",
                "Location": "New York, USA"
            }
        },
        {
            "environment": {
                "monthOfYear": "8",
                "timeOfDay": "Afternoon",
                "weather": "Sunny"
            }
        },
        {
            "device": {
                "mobile":true,
                "Windows":true
            }
        },
        {
            "activity" : {
                "itemsInCart": "3-5",
                "cartValue": "250-300",
                "appliedCoupon": true
            }
        }
    ]
}
```

## Next steps

[Reinforcement learning](concepts-reinforcement-learning.md)
