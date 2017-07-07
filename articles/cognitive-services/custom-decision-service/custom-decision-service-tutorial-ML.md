---
title: Machine learning in Azure Custom Decision Service (tutorial) | Microsoft Docs
description: A tutorial for machine learning in Azure Custom Decision Service, a cloud-based API for contextual decision-making.
services: cognitive-services
author: slivkins
manager: slivkins

ms.service: cognitive-services
ms.topic: article
ms.date: 07/06/2017
ms.author: slivkins;marcozo;alekh
---

# Machine learning in Custom Decision Service (tutorial)

This tutorial addresses the advanced machine learning functionality in Custom Decision Service. For now, this functionality is only available in private preview. The tutorial consists of two parts: [featurization](#featurization-concepts-and-implementation) and [feature specification](#feature-specification). Featurization refers to representing your data as "features" for machine learning. Feature specification covers the JSON format and the ancillary APIs for specifying features.

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

The translation into internal features is as follows:

- numeric features stay the same.
- a numeric array translates to several numeric features, one for each element of the array.
- a string-valued feature `"Name":"Value"` is by default translated  into a feature with name `"NameValue"` and value 1.
- Optionally, a string can be represented as [bag-of-words](https://en.wikipedia.org/wiki/Bag-of-words_model). Then an internal feature is created for each word in the string, and its value is set to the number of occurrences of this word.

#### Shared vs. action-dependent features

Some features refer to the entire decision, and are the same for all actions. We call them *shared features*. Some other features are specific to a particular action. We call them *action-dependent features* (ADFs).

In the running example, shared features could describe the user and/or the state of the world. For example, geolocation, age and gender of the user, and which major events are happening right now. Action-dependent features could describe the properties of a given article, such as the topics covered by this article.

#### Interacting features

Features often "interact": the effect of one depends on others. For example, feature X is whether the user is interested in sports. Feature Y is whether a given article is about sports. Then the effect of feature Y is highly dependent on feature X.

To account for interaction between features X and Y, create a *quadratic* feature whose value is X\*Y. (We also say, "cross" X and Y.) You can choose which pairs of features are crossed. 

[!TIP] A shared feature should be crossed with some action-dependent features in order to influence the ranking of actions. An action-dependent feature should be crossed with some shared features in order to contribute to personalization. 

In other words, a shared feature not crossed with any ADFs influences each action in the same way. An ADF not crossed with any shared feature influences each decision in the same way.

#### Implementation via namespaces

You can implement crossed features (as well as other featurization concepts) via the "VW command line" on the Portal. The syntax is based on the [Vowpal Wabbit](http://hunch.net/~vw/) command line.

Central to the implementation is the concept of  *namespace*: a named subset of features. Each feature belongs to exactly one namespace. The namespace can be specified explicitly when the feature value is provided to Custom Decision Service. It is the only way to refer to a feature in the VW command line.

A namespace is either "shared" or "action-depepdent": either it consists only of shared features, or it consists only of action-dependent features of the same action.

[!TIP] It is a good practice to wrap each feature in an explicitly specified namespace. If the namespace is not provided, the feature is automatically assigned to the default namespace. However, you cannot refer to it from the VW command line. 

[!IMPORTANT] Features and namespaces do not need to be defined consistently across actions. In particular, a namespace can have different features for different actions. Moreover, a given namespace can be defined for some actions and not for some others.

When a native feature such as a string is translated into multiple internal features, all internal features are grouped into the same namespace. Any two native features that lie in different namespaces are treated as distinct, even if they have the same feature name. 

[!IMPORTANT]
While long, descriptive namespace ids are common, the VW command line does not distinguish between namespaces whose id starts with the same letter.  In what follows, namespace ids are single letters, such as `x` and `y`.

The implementation details are as follows:

- To cross namespaces `x` and `y`, write `-q xy` or `--quadratic xy`. Then each feature in `x` is crossed with each feature in `y`. Use `-q x:` to cross `x` with every namespace, and `-q ::` to cross all pairs of namespaces.

- To ignore all features in namespace `x`, write `--ignore x`.

These commands are applied to each action separately, whenever the namespaces are defined.

#### Estimated average as a feature

As a thought experiment, what would be the average reward of a given action if it were chosen for all decisions? Such average reward could be used as a measure of the "overall quality" of this action. It is not known exactly whenever other actions have been chosen instead in some decisions. However, it can be estimated via reinforcement learning techniques. The quality of this estimate typically improves over time.

You can choose to include this "estimated average reward" as a feature for a given action. Then Custom Decision Service would automatically update this estimate as new data arrives. This feature is called the *marginal feature* of this action.

To add marginal features, write `--marginal <namespace>` in the VW command line. 
Define `<namespace>` as follows:

```
{<namespace>: "feature_name":1 "action_id":1}
```

Insert this namespace along with other action-dependent features of a given action. Provide this definition for each decision, using the same `feature_name` and `action_id` for all decisions.

The marginal feature is added for each action with `<namespace>`. The feature name is set to `feature_name`. In particular, marginal features with different `feature_name` are treated as different features. In other words, a different weight is learned for each `feature_name`. 

The default usage is that `feature_name` is the same for all actions. Then one weight is learned for all marginal features.

You can also specify multiple marginal features for the same action, with same values but different feature names.

```
{<namespace>: "fn1":1 "action_id":1 "fn2":1 "action_id":1}
```

#### 1-hot encoding

You can choose to represent some features as bit vectors, where each bit corresponds to a range of possible values. This bit is set to 1 if and only if the feature lies in this range. Thus, there is one "hot" bit that is set to 1, and the others are set to 0. This representation is commonly known as *1-hot encoding*.

The 1-hot encoding is typical for categorical features such as "geographical region" which do not have an inherently meaningful numerical representation. It is also advisable for numerical features whose influence on the reward is likely to be non-linear. For example, a given article could be relevant to a particular age group, and irrelevant to anyone older or younger.

Any string-valued feature is 1-hot encoded by default: a distinct internal feature is created for every possible value. We do not currently provide 1-hot encoding for numerical features and/or with customized ranges.

In slightly more depth, our machine learning algorithms treat all possible values of a feature in a uniform way: via a common multiplicative coefficient. The 1-hot encoding allows each range of values to receive a more individual treatment. 

When choosing the ranges for the 1-hot encoding, keep in mind that all values within each range is treated uniformly. Making the ranges smaller leads to better rewards once enough data is collected, but may increase the amount of data needed to converge to better rewards.

## Feature specification

You can specify features using a simple JSON format and several ancillary APIs. The basic JSON template is as follows:

```
{
"<name>":<value>, "<name>":<value>, ... ,
"namespace1": {"<name>":<value>,  ... },
"namespace2": {"<name>":<value>,  ... },
...
}
```

Here `<name>` and `<value>` stand for feature name and feature value, respectively. `<value>` can be a string, an integer, a float, a boolean, or an  array. A feature not wrapped into a namespace is automatically assigned into the default namespace.

To represent a string as a bit vector over words, use a special syntax `"_text":"string"` instead of 
`"<name>":<value>`. Then a separate internal feature with value `1` is created for each word in the string.

If `<name>` starts with "_" (and is not `"_text"`), then the feature is ignored.

#### Feature Set API 

Feature Set API returns a list of features in the JSON format described previously. Several Feature Set APIs can be used, identified by feature set ids. The mapping between feature set ids and the corresponding URLs is set on the Portal. For action-dependent features, a call to Feature Set API is parameterized by the action id.

#### Action Set API (JSON version)

Action Set API has a version in which actions and features are specified in JSON. Features can be specified explicitly and/or via feature set ids. When a feature set id is encountered, a call to the corresponding Feature Set API is executed.
	
#### Ranking API (HTTP POST call)

Ranking API has a version that uses HTTP POST call. The body of this call specifies actions and features via a flexible JSON syntax. 

The details are as follows:

- Actions can be specified explicitly and/or via action set ids. Whenever an action set id is enountered, a call to the corresponding Action Set API is executed. 
- Likewise, features can be specified explicitly and/or via feature set ids. When a feature set id is encountered, a call to the corresponding Feature Set API is executed.
- Shared features can be specified once for all actions.


