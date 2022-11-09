---
title: "Features: Action and context - Personalizer" 
titleSuffix: Azure Cognitive Services
description: Personalizer uses features, information about actions and context, to make better ranking suggestions. Features can be very generic, or specific to an item.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 10/14/2019
---

# Features are information about actions and context

The Personalizer service works by learning what your application should show to users in a given context.

Personalizer uses **features**, which is information about the **current context** to choose the best **action**. The features represent all information you think may help personalize to achieve higher rewards. Features can be very generic, or specific to an item. 

For example, you may have a **feature** about:

* The _user persona_ such as a `Sports_Shopper`. This should not be an individual user ID. 
* The _content_ such as if a video is a `Documentary`, a `Movie`, or a `TV Series`, or whether a retail item is available in store.
* The _current_ period of time such as which day of the week it is.

Personalizer does not prescribe, limit, or fix what features you can send for actions and context:

* You can send some features for some actions and not for others, if you don't have them. For example, TV series may have attributes movies don't have.
* You may have some features available only some times. For example, a mobile application may provide more information than a web page. 
* Over time, you may add and remove features about context and actions. Personalizer continues to learn from available information.
* There must be at least one feature for the context. Personalizer does not support an empty context. If you only send a fixed context every time, Personalizer will choose the action for rankings only regarding the features in the actions.
* For categorical features, you don't need to define the possible values, and you don't need to pre-define ranges for numerical values.

Features are sent as part of the JSON payload in a [Rank API](https://westus2.dev.cognitive.microsoft.com/docs/services/personalizer-api/operations/Rank) call. Each Rank call is associated with a personalization _event_. By default, Personalizer will automatically assign an event ID and return it in the Rank response. This default behavior is recommended for most users, however, if you need to create your own unique event ID (for example, using a GUID), then you can provide it in the Rank call as an argument. 

## Supported feature types

Personalizer supports features of string, numeric, and boolean types. It is very likely that your application will mostly use string features, with a few exceptions.

### How choice of feature type affects Machine Learning in Personalizer

* **Strings**: For string types, every combination of key and value is treated as a One-Hot feature (e.g. genre:"ScienceFiction" and genre:"Documentary" would create two new  input features for the machine learning model.
* **Numeric**: You should use numerical values when the number is a magnitude that should proportionally affect the personalization result. This is very scenario dependent. In a simplified example e.g. when personalizing a retail experience, NumberOfPetsOwned could be a feature that is numeric as you may want people with 2 or 3 pets to influence the personalization result twice or thrice as much as having 1 pet. Features that are based on numeric units but where the meaning isn't linear - such as Age, Temperature, or Person Height - are best encoded as strings. For example DayOfMonth would be a string with "1","2"..."31". If you have many categories The feature quality can typically be improved by using ranges. For example, Age could be encoded as "Age":"0-5", "Age":"6-10", etc.
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

You can name feature namespaces following your own conventions as long as they are valid JSON keys. Namespaces are used to organize features into distinct sets, and to disambiguate features with similar names. You can think of namespaces as a 'prefix' that is added to feature names. Namespaces cannot be nested.


In the following JSON, `user`, `environment`, `device`, and `activity` are feature namespaces. 

> [!Note]
> Currently we strongly recommend using names for feature namespaces that are UTF-8 based and start with different letters. For example, `user`, `environment`, `device`, and `activity` start with `u`, `e`, `d`, and `a`. Currently having namespaces with same first characters could result in collisions in indexes used for machine learning.

JSON objects can include nested JSON objects and simple property/values. An array can be included only if the array items are numbers. 

```JSON
{
    "contextFeatures": [
        { 
            "user": {
                "profileType":"AnonymousUser",
                "latlong": ["47.6,-122.1"]
            }
        },
        {
            "environment": {
                "dayOfMonth": "28",
                "monthOfYear": "8",
                "timeOfDay": "13:00",
                "weather": "sunny"
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
                "itemsInCart": 3,
                "cartValue": 250,
                "appliedCoupon": true
            }
        }
    ]
}
```

### Restrictions in character sets for namespaces

The string you use for naming the namespace must follow some restrictions: 
* It can't be unicode.
* You can use some of the printable symbols with codes < 256 for the namespace names. 
* You can't use symbols with codes < 32 (not printable), 32 (space), 58 (colon), 124 (pipe), and 126–140.
* It should not start with an underscore "_" or the feature will be ignored.

## How to make feature sets more effective for Personalizer

A good feature set helps Personalizer learn how to predict the action that will drive the highest reward. 

Consider sending features to the Personalizer Rank API that follow these recommendations:

* Use categorical and string types for features that are not a magnitude. 

* There are enough features to drive personalization. The more precisely targeted the content needs to be, the more features are needed.

* There are enough features of diverse *densities*. A feature is *dense* if many items are grouped in a few buckets. For example, thousands of videos can be classified as "Long" (over 5 min long) and "Short" (under 5 min long). This is a *very dense* feature. On the other hand, the same thousands of items can have an attribute called "Title", which will almost never have the same value from one item to another. This is a very non-dense or *sparse* feature.  

Having features of high density helps the Personalizer extrapolate learning from one item to another. But if there are only a few features and they are too dense, the Personalizer will try to precisely target content with only a few buckets to choose from.

### Improve feature sets 

Analyze the user behavior by doing an Offline Evaluation. This allows you to look at past data to see what features are heavily contributing to positive rewards versus those that are contributing less. You can see what features are helping, and it will be up to you and your application to find better features to send to Personalizer to improve results even further.

These following sections are common practices for improving features sent to Personalizer.

#### Make features more dense

It is possible to improve your feature sets by editing them to make them larger and more or less dense.

For example, a timestamp down to the second is a very sparse feature. It could be made more dense (effective) by classifying times into "morning", "midday", "afternoon", etc.

Location information also typically benefits from creating broader classifications. For example, a Latitude-Longitude coordinate such as Lat: 47.67402° N, Long: 122.12154° W is too precise, and forces the model to learn latitude and longitude as distinct dimensions. When you are trying to personalize based on location information, it helps to group location information in larger sectors. An easy way to do that is to choose an appropriate rounding precision for the Lat-Long numbers, and combine latitude and longitude into "areas" by making them into one string. For example, a good way to represent 47.67402° N, Long: 122.12154° W in regions approximately a few kilometers wide would be "location":"34.3 , 12.1".


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

* [Entity Linking](../text-analytics/index.yml)
* [Language service](../language-service/index.yml)
* [Emotion](../face/overview.md)
* [Computer Vision](../computer-vision/overview.md)

## Actions represent a list of options

Each action:

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

## Inference Explainability
Personalizer can help you to understand which features of a chosen action are the most and least influential to then model during inference. When enabled, inference explainability includes feature scores from the underlying model into the Rank API response, so your application receives this information at the time of inference.
Feature scores empower you to better understand the relationship between features and the decisions made by Personalizer. They can be used to provide insight to your end-users into why a particular recommendation was made, or to further analyze how the data is being used by the underlying model.

Setting the service configuration flag IsInferenceExplainabilityEnabled in your service configuration enables Personalizer to include feature values and weights in the Rank API response. To update your current service configuration, use the [Service Configuration – Update API](/rest/api/personalizer/1.1preview1/service-configuration/update?tabs=HTTP). In the JSON request body, include your current service configuration and add the additional entry: `“IsInferenceExplainabilityEnabled”: true`. If you don’t know your current service configuration, you can obtain it from the [Service Configuration – Get API](/rest/api/personalizer/1.1preview1/service-configuration/get?tabs=HTTP)

```JSON
{
  "rewardWaitTime": "PT10M",
  "defaultReward": 0,
  "rewardAggregation": "earliest",
  "explorationPercentage": 0.2,
  "modelExportFrequency": "PT5M",
  "logMirrorEnabled": true,
  "logMirrorSasUri": "https://testblob.blob.core.windows.net/container?se=2020-08-13T00%3A00Z&sp=rwl&spr=https&sv=2018-11-09&sr=c&sig=signature",
  "logRetentionDays": 7,
  "lastConfigurationEditDate": "0001-01-01T00:00:00Z",
  "learningMode": "Online",
  "isAutoOptimizationEnabled": true,
  "autoOptimizationFrequency": "P7D",
  "autoOptimizationStartDate": "2019-01-19T00:00:00Z",
"isInferenceExplainabilityEnabled": true
}
```

### How to interpret feature scores?
Enabling inference explainability will add a collection to the JSON response from the Rank API called *inferenceExplanation*. This contains a list of feature names and values that were submitted in the Rank request, along with feature scores learned by Personalizer’s underlying model. The feature scores provide you with insight on how influential each feature was in the model choosing the action.

```JSON

{
  "ranking": [
    {
      "id": "EntertainmentArticle",
      "probability": 0.8
    },
    {
      "id": "SportsArticle",
      "probability": 0.10
    },
    {
      "id": "NewsArticle",
      "probability": 0.10
    }
  ],
 "eventId": "75269AD0-BFEE-4598-8196-C57383D38E10",
 "rewardActionId": "EntertainmentArticle",
 "inferenceExplanation": [
    {
        "id”: "EntertainmentArticle",
        "features": [
            {
                "name": "user.profileType",
                "score": 3.0
            },
            {
                "name": "user.latLong",
                "score": -4.3
            },
            {
                "name": "user.profileType^user.latLong",
                "score" : 12.1
            },
        ]
  ]
}
```

In the example above, three action IDs are returned in the _ranking_ collection along with their respective probabilities scores. The action with the largest probability is the _best action_ as determined by the model trained on data sent to the Personalizer APIs, which in this case is `"id": "EntertainmentArticle"`. The action ID can be seen again in the _inferenceExplanation_ collection, along with the feature names and scores determined by the model for that action and the features and values sent to the Rank API. 

Recall that Personalizer will either return the _best action_ or an _exploratory action_ chosen by the exploration policy. The best action is the one that the model has determined has the highest probability of maximizing the average reward, whereas exploratory actions are chosen among the set of all possible actions provided in the Rank API call. Actions taken during exploration do not leverage the feature scores in determining which action to take, therefore **feature scores for exploratory actions should not be used to gain an understanding of why the action was taken.** [You can learn more about exploration here](./concepts-exploration.md).

For the best actions returned by Personalizer, the feature scores can provide general insight where:
* Larger positive scores provide more support for the model choosing this action. 
* Larger negative scores provide more support for the model not choosing this action.
* Scores close to zero have a small effect on the decision to choose this action.

### Important considerations for Inference Explainability
* **Increased latency.** Currently, enabling _Inference Explainability_ may significantly increase the latency of Rank API calls due to processing of the feature information. Run experiments and measure the latency in your scenario to see if it satisfies your application’s latency requirements. 
* **Correlated Features.** Features that are highly correlated with each other can reduce the utility of feature scores. For example, suppose Feature A is highly correlated with Feature B. It may be that Feature A’s score is a large positive value while Feature B’s score is a large negative value. In this case, the two features may effectively cancel each other out and have little to no impact on the model. While Personalizer is very robust to highly correlated features, when using _Inference Explainability_, ensure that features sent to Personalizer are not highly correlated
* **Default exploration only.**	Currently, Inference Explainability supports only the default exploration algorithm at this time.

## Next steps

[Reinforcement learning](concepts-reinforcement-learning.md)