---
title: Features concept
titleSuffix: Personalizer - Azure Cognitive Services
description: Personalizer uses information about actions and current context to make better ranking suggestions. The information about these actions and context are attributes or properties that are referred to as **features**.
services: cognitive-services
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: overview
ms.date: 05/07/2019
ms.author: edjez
---
# Features

Personalizer uses information about **actions** and **context** to make better ranking suggestions. The information about these actions and context are properties known as **features**.

Features can be very generic, or specific to an item. For example, you may have a feature about:

* The _user_ such as a `UserID`. 
* The _content_ such as if a video is a `Documentary`, a `Movie`, or a `TV Series`, or whether a retail item is available in store.
* The _current_ period of time such as which day of the week it is.

Personalizer does not prescribe, limit or fix what features you can send for actions and context:

* You can send some features for some actions and not for others, if you don't have them. For example, TV series may have attributes movies don't have.
* You may have some features available only some times. For example, a mobile application may provide more information than a web page. 
* Over time, you may add and remove features about context and actions. Personalizer continues to learn from available information.
* There must be at least one feature for the context. Personalizer does not support an empty context. If you only send a fixed context every time, Personalizer will choose the action for rankings only regarding the features in the actions. Personalizer will try to choose actions that work best for everyone at anytime.

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

* There are enough features of diverse *densities*. A feature is *dense* if a lot of items are grouped in a few buckets. For example, thousands of videos can be classified as "Long" (over 5 min long) and "Short" (under 5 min long). This is a *very dense* feature. On the other hand, the same thousands of items can have an attribute called "Title", which will almost never have the same value from one item to another. This is a very non-dense or *sparse* feature.  

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

## More Information