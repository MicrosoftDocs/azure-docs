---
title: Machine learning in Azure Custom Decision Service (tutorial) | Microsoft Docs
description: A tutorial for machine learning in Azure Custom Decision Service, a cloud-based API for contextual decision-making.
services: cognitive-services
author: slivkins
manager: slivkins

ms.service: cognitive-services
ms.topic: article
ms.date: 07/05/2017
ms.author: slivkins;marcozo;alekh
---

# Machine learning in Custom Decision Service (tutorial)

This tutorial covers the advanced machine learning functionality in Custom Decision Service. For now, this funtionality is only available in private previw. The tutorial consists of two parts: [featurization](#featurization-concepts-and-implementation) and [feature specification](#feature-specification). Featurization refers to representing your data as "features" for machine learning.

By default, machine learning in Custom Decision Service is transparent to the customer. Features are automatically extracted from your content, and a standard reinforcement learning algorithm is used. Feature extraction leverages several other Microsoft Cognitive Services: 
[Entity Linking](../entitylinking/home.md),
[Text Analytics](../Text-Analytics/overview.md),
[Emotion](../emotion/home.md), and
[Computer Vision](../computer-vision/home.md). This tutorial can be skipped if only the default functionality is used.

## Featurization: concepts and implementation

Custom Decision Service makes decisions one by one. Each decision involves choosing among several alternatives, a.k.a., actions. Depending on the application, the decision may choose a single action or a (short) ranked list of actions. 

As a running example, we use personalizing the selection of articles on the front page of a website. Here, actions correspond to articles, and each decision is which articles to show to a given user.

Each action is represented by a vector of properties, henceforth called *features*. You can specify new features, in addition to the features extracted automatically. You can also instruct Custom Decision Service to log some features, but ignore them for machine learning.

#### Feature representation

You can specify features in a format most natural for your application, be it a number, a string, or an array. These features are called "native features." Custom Decision Service translates each native feature into one or more numeric features, called "internal features."

You can customize some aspects of this translation:

- a string can be represented as a bit vector: an internal feature is created for each word in the string, and its value is set to "true."
- a feature can be represented as a bit vector: each bit is set if and only if the feature lies in a specified range of values (see [1-hot encoding](#1-hot-encoding)).

While native features may have meaningful ids, such as 'age' or 'zipcode', internal features are nameless. Ids of native features are ignored in the translation.

#### Shared vs. action-dependent features

Some features refer to the entire decision, and are the same for all actions. We call them *shared features*. Some other features are specific to a particular action. We call them *action-dependent features* (ADFs).

In the running example, shared features could describe the user and/or the state of the world. For example, geolocation, age and gender of the user, and which major events are happening right now. Action-dependent features could describe the properties of a given article, such as the topics covered by this article.

#### Interacting features

Features often "interact": the effect of one depends on others. For example, feature X is whether the user is interested in sports. Feature Y is whether a given article is about sports. Then the effect of feature Y is highly dependent on feature X.

To account for interaction between features X and Y, create a *quadratic* feature whose value is X\*Y. (We also say, "cross" X and Y.) You can choose which pairs of features are crossed. 

[!TIP] A shared feature should be crossed with some action-dependent features in order to influence the ranking of actions. An action-dependent feature should be crossed with some shared features in order to contribute to personalization. 

In other words, a shared feature not crossed with any ADFs influences each action in the same way. An ADF not crossed with any shared feature influences each decision in the same way.

#### 1-hot encoding

You can choose to represent some features as bit vectors, where each bit corresponds to a range of possible values. This bit is set to 1 if and only if the feature lies in this range. Thus, there is one "hot" bit that is set to 1, and the others are set to 0. This representation is commonly known as *1-hot encoding*.

The 1-hot encoding is typical for categorical features such as zipcode, which do not have an inherently meaningful numerical representation. It is also advisable for numerical features whose influence on the reward is likely to be non-linear. For example, a given article could be relevant to a particular age group, and irrelevant to anyone older or younger. 

In slightly more depth, our machine learning algorithms treat all possible values of a feature in a uniform way: via a common multiplicative coefficient. The 1-hot encoding allows each range of values to receive a more individual treatment. 

When choosing the ranges for the 1-hot encoding, keep in mind that all values within each range is treated uniformly. Making the ranges smaller leads to better rewards once enough data is collected, but may increase the amount of data needed to converge to better rewards.

#### Estimated average as a feature

As a thought experiment, what would be the average reward of a given action if it were chosen for all decisions? Such average reward could be used as a measure of the "overall quality" of this action. It is not known exactly whenever other actions have been chosen instead in some decisions. However, it can be estimated via reinforcement learning techniques. The quality of this estimate typically improves over time.

You can choose to include this "estimated average reward" as a feature for a given action. Then Custom Decision Service would automatically update this estimate as new data arrives. This feature is called the *marginal feature* of this action.

#### Implementation via namespaces

You can specify the featurization concepts discussed previously via a "VW arguments string" on the Portal. Custom Decision Service provides a flexible syntax based on the [Vowpal Wabbit](http://hunch.net/~vw/) command line.

Central to the implementation is the concept of  *namespace*: a named subset of features. Each feature belongs to exactly one namespace. When a native feature is translated into multiple internal features, all internal features are grouped into the same namespace.

A namespace can be specified explicitly when the feature is specified. Else, the namespace is set to 'default'. Native features in different namespaces are treated as distinct, even if they have the same name.

[!IMPORTANT]
While long, descriptive namespace ids are common, the system truncates each id to the first letter. Thus, all namespaces whose id starts with the same letter are treated as the same "logical namespace." In what follows, namespace ids are single letters.

The implementation details are as follows:

- To cross namespaces `x` and `y`, write `-q xy` or `--quadratic xy`. Then each feature in `x` is crossed with each feature in `y`. Here `x` and `y` are literally two letters. 

- To ignore all features in namespace `x`, write `--ignore x`. 

## Feature specification

You can specify features using a simple JSON format:

```
{
"<name>":<value>, "<name>":<value>, ... ,
"namespace1": {"<name>":<value>,  ... },
"namespace2": {"<name>":<value>,  ... },
...
}
```

Here `<name>` and `<value>` stand for feature name and feature value, respectively. `<value>` can be a string, an integer, a float, a boolean, or an  array. A feature not wrapped into a namespace is automatically assigned into the 'default' namespace.

To represent a string as a bit vector over words, use a special syntax `"_text":"string"` instead of 
`"<name>":<value>`. Then a separate internal feature with value `1` is created for each word in the string.

If `<name>` starts with "_" (and is not `"_text"`), then the feature is ignored.