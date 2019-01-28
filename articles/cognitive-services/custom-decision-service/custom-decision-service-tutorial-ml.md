---
title: "Tutorial: Featurization and feature specification - Custom Decision Service"
titlesuffix: Azure Cognitive Services
description: A tutorial for machine learning featurization and feature specification in Custom Decision Service.
services: cognitive-services
author: slivkins
manager: cgronlun

ms.service: cognitive-services
ms.component: custom-decision-service
ms.topic: tutorial
ms.date: 05/08/2018
ms.author: slivkins
---

# Tutorial: Featurization and feature specification

This tutorial addresses the advanced machine learning functionality in Custom Decision Service. The tutorial consists of two parts: [featurization](#featurization-concepts-and-implementation) and [feature specification](#feature-specification-format-and-apis). Featurization refers to representing your data as "features" for machine learning. Feature specification covers the JSON format and the ancillary APIs for specifying features.

By default, machine learning in Custom Decision Service is transparent to the customer. Features are automatically extracted from your content, and a standard reinforcement learning algorithm is used. Feature extraction leverages several other Azure Cognitive Services:
[Entity Linking](../entitylinking/home.md),
[Text Analytics](../text-analytics/overview.md),
[Emotion](../emotion/home.md), and
[Computer Vision](../computer-vision/home.md). This tutorial can be skipped if only the default functionality is used.

## Featurization: concepts and implementation

Custom Decision Service makes decisions one by one. Each decision involves choosing among several alternatives, a.k.a., actions. Depending on the application, the decision may choose a single action or a (short) ranked list of actions.

For instance, personalizing the selection of articles on the front page of a website. Here, actions correspond to articles, and each decision is which articles to show to a given user.

Each action is represented by a vector of properties, henceforth called *features*. You can specify new features, in addition to the features extracted automatically. You can also instruct Custom Decision Service to log some features, but ignore them for machine learning.

### Native vs. internal features

You can specify features in a format most natural for your application, be it a number, a string, or an array. These features are called "native features." Custom Decision Service translates each native feature into one or more numeric features, called "internal features."

The translation into internal features is as follows:

- numeric features stay the same.
- a numeric array translates to several numeric features, one for each element of the array.
- a string-valued feature `"Name":"Value"` is by default translated into a feature with name `"NameValue"` and value 1.
- Optionally, a string can be represented as [bag-of-words](https://en.wikipedia.org/wiki/Bag-of-words_model). Then an internal feature is created for each word in the string, whose value is the number of occurrences of this word.
- Zero-valued internal features are omitted.

### Shared vs. action-dependent features

Some features refer to the entire decision, and are the same for all actions. We call them *shared features*. Some other features are specific to a particular action. We call them *action-dependent features* (ADFs).

In the running example, shared features could describe the user and/or the state of the world. Features like geolocation, age and gender of the user, and which major events are happening right now. Action-dependent features could describe the properties of a given article, such as the topics covered by this article.

### Interacting features

Features often "interact": the effect of one depends on others. For example, feature X is whether the user is interested in sports. Feature Y is whether a given article is about sports. Then the effect of feature Y is highly dependent on feature X.

To account for interaction between features X and Y, create a *quadratic* feature whose value is X\*Y. (We also say, "cross" X and Y.) You can choose which pairs of features are crossed.

> [!TIP]
> A shared feature should be crossed with action-dependent features in order to influence their rank. An action-dependent feature should be crossed with shared features in order to contribute to personalization.

In other words, a shared feature not crossed with any ADFs influences each action in the same way. An ADF not crossed with any shared feature influences each decision too. These types of features may reduce the variance of reward estimates.

### Implementation via namespaces

You can implement crossed features (as well as other featurization concepts) via the "VW command line" on the Portal. The syntax is based on the [Vowpal Wabbit](http://hunch.net/~vw/) command line.

Central to the implementation is the concept of *namespace*: a named subset of features. Each feature belongs to exactly one namespace. The namespace can be specified explicitly when the feature value is provided to Custom Decision Service. It is the only way to refer to a feature in the VW command line.

A namespace is either "shared" or "action-dependent": either it consists only of shared features, or it consists only of action-dependent features of the same action.

> [!TIP]
> It is a good practice to wrap features in explicitly specified namespaces. Group related features in the same namespace.

If the namespace is not provided, the feature is automatically assigned to the default namespace.

> [!IMPORTANT]
> Features and namespaces do not need to be consistent across actions. In particular, a namespace can have different features for different actions. Moreover, a given namespace can be defined for some actions and not for some others.

Multiple internal features that came from the same string-valued native feature are grouped into the same namespace. Any two native features that lie in different namespaces are treated as distinct, even if they have the same feature name.

> [!IMPORTANT]
> While long, descriptive namespace IDs are common, the VW command line does not distinguish between namespaces whose id starts with the same letter. In what follows, namespace IDs are single letters, such as `x` and `y`.

The implementation details are as follows:

- To cross namespaces `x` and `y`, write `-q xy` or `--quadratic xy`. Then each feature in `x` is crossed with each feature in `y`. Use `-q x:` to cross `x` with every namespace, and `-q ::` to cross all pairs of namespaces.

- To ignore all features in namespace `x`, write `--ignore x`.

These commands are applied to each action separately, whenever the namespaces are defined.

### Estimated average as a feature

As a thought experiment, what would be the average reward of a given action if it were chosen for all decisions? Such average reward could be used as a measure of the "overall quality" of this action. It is not known exactly whenever other actions have been chosen instead in some decisions. However, it can be estimated via reinforcement learning techniques. The quality of this estimate typically improves over time.

You can choose to include this "estimated average reward" as a feature for a given action. Then Custom Decision Service would automatically update this estimate as new data arrives. This feature is called the *marginal feature* of this action. Marginal features can be used for machine learning and for audit.

To add marginal features, write `--marginal <namespace>` in the VW command line. Define `<namespace>` in JSON as follows:

```json
{<namespace>: {"mf_name":1 "action_id":1}
```

Insert this namespace along with other action-dependent features of a given action. Provide this definition for each decision, using the same `mf_name` and `action_id` for all decisions.

The marginal feature is added for each action with `<namespace>`. The `action_id` can be any feature name that uniquely identifies the action. The feature name is set to `mf_name`. In particular, marginal features with different `mf_name` are treated as different features — a different weight is learned for each `mf_name`.

The default usage is that `mf_name` is the same for all actions. Then one weight is learned for all marginal features.

You can also specify multiple marginal features for the same action, with same values but different feature names.

```json
{<namespace>: {"mf_name1":1 "action_id":1 "mf_name2":1 "action_id":1}}
```

### 1-hot encoding

You can choose to represent some features as bit vectors, where each bit corresponds to a range of possible values. This bit is set to 1 if and only if the feature lies in this range. Thus, there is one "hot" bit that is set to 1, and the others are set to 0. This representation is commonly known as *1-hot encoding*.

The 1-hot encoding is typical for categorical features such as "geographical region" that do not have an inherently meaningful numerical representation. It is also advisable for numerical features whose influence on the reward is likely to be non-linear. For example, a given article could be relevant to a particular age group, and irrelevant to anyone older or younger.

Any string-valued feature is 1-hot encoded by default: a distinct internal feature is created for every possible value. Automatic 1-hot encoding for numerical features and/or with customized ranges are not currently provided.

> [!TIP]
> The machine learning algorithms treat all possible values of a given internal feature in a uniform way: via a common "weight." The 1-hot encoding allows a separate "weight" for each range of values. Making the ranges smaller leads to better rewards once enough data is collected, but may increase the amount of data needed to converge to better rewards.

## Feature specification: format and APIs

You can specify features via several ancillary APIs. All APIs use a common JSON format. Below are the APIs and the format on a conceptual level. The specification is complemented by a Swagger schema.

The basic JSON template for feature specification is as follows:

```json
{
"<name>":<value>, "<name>":<value>, ... ,
"namespace1": {"<name>":<value>, ... },
"namespace2": {"<name>":<value>, ... },
...
}
```

Here `<name>` and `<value>` stand for feature name and feature value, respectively. `<value>` can be a string, an integer, a float, a boolean, or an array. A feature not wrapped into a namespace is automatically assigned into the default namespace.

To represent a string as a bag-of-words, use a special syntax `"_text":"string"` instead of `"<name>":<value>`. Effectively, a separate internal feature is created for each word in the string. Its value is the number of occurrences of this word.

If `<name>` starts with "_" (and is not `"_text"`), then the feature is ignored.

> [!TIP]
> Sometimes you merge features from multiple JSON sources. For convenience, you can represent them as follows:
>
> ```json
> {
> "source1":<features>,
> "source2":<features>,
> ...
> }
> ```

Here `<features>` refers to the basic feature specification defined previously. Deeper levels of "nesting" are allowed, too. Custom Decision Service automatically finds the "deepest" JSON objects that can be interpreted as `<features>`.

#### Feature Set API

Feature Set API returns a list of features in the JSON format described previously. You can use several Feature Set API endpoints. Each endpoint is identified by feature set id and a URL. The mapping between feature set IDs and URLs is set on the Portal.

Call Feature Set API by inserting the corresponding feature set id in the appropriate place in JSON. For action-dependent features, the call is automatically parameterized by the action id. You can specify several feature set IDs for the same action.

#### Action Set API (JSON version)

Action Set API has a version in which actions and features are specified in JSON. Features can be specified explicitly and/or via Feature Set APIs. Shared features can be specified once for all actions.

#### Ranking API (HTTP POST call)

Ranking API has a version that uses HTTP POST call. The body of this call specifies actions and features via a flexible JSON syntax.

Actions can be specified explicitly and/or via action set IDs. Whenever an action set id is encountered, a call to the corresponding Action Set API endpoint is executed.

As for Action Set API, features can be specified explicitly and/or via Feature Set APIs. Shared features can be specified once for all actions.