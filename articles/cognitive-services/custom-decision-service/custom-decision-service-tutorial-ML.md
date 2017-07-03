---
title: Machine learning in Azure Custom Decision Service (tutorial) | Microsoft Docs
description: A tutorial for machine learning in Azure Custom Decision Service, a cloud-based API for contextual decision-making.
services: cognitive-services
author: slivkins
manager: slivkins

ms.service: cognitive-services
ms.topic: article
ms.date: 06/14/2017
ms.author: slivkins;marcozo;alekh
---

# Machine learning in Custom Decision Service (tutorial)

This tutorial covers the advanced machine learning functionality in Custom Decision Service. It consists of three parts: [concepts related to featurization](#featurization-concepts), [implementation of these concepts](#featurization-implementation), and [options and parameters for machine learning](#options-and-parameters-for-machine-learning). Featurization refers to representing your data as "features" for machine learning.

By default, machine learning in Custom Decision Service is transparent to the customer. Features are automatically extracted from your content, and a standard reinforcement learning algorithm is used. Feature extraction leverages several other Microsoft Cognitive Services: 
[Entity Linking](../entitylinking/home.md),
[Text Analytics](../Text-Analytics/overview.md),
[Emotion](../emotion/home.md), and
[Computer Vision](../computer-vision/home.md). This tutorial can be skipped if only the default functionality is used.

## Featurization (concepts)

Custom Decision Service makes decisions one by one. Each decision involves choosing among several alternatives, a.k.a., actions. Depending on the application, the decision may choose a single action or a (short) ranked list of actions. 

As a running example, we use personalizing the selection of articles on the front page of a website. Here, actions correspond to articles, and each decision is which articles to show to a given user.

Each action is represented by a vector of numbers, called *features*. Some features are inherently "numerical", for example, relevance of this article to a particular topic. Some features such as zipcode are "categorical": they distinguish between several possible "categories" that do not have an inherent numerical meaning.

#### Shared vs. action-dependent features

Some features refer to the entire decision, and are the same for all actions. We call them *shared features*. Some other features are specific to a particular action. We call them *action-dependent features* (ADFs).

In the running example, shared features could describe the user and/or the state of the world. For example, geolocation, age and gender of the user, and which major events are happening right now. Action-dependent features could describe the properties of a given article, such as the topics covered by this article.

#### Interacting features

Features often "interact": the effect of one depends on others. For example, feature X is whether the user is interested in sports. Feature Y is whether a given article is about sports. Then the effect of feature Y is highly dependent on feature X.

To account for interaction between features X and Y, create a *quadratic* feature whose value is X\*Y. (We also say, "cross" X and Y.) You can choose which pairs of features are crossed. 

A shared feature should be crossed with some action-dependent features in order to influence the ranking of actions. An action-dependent feature should be crossed with some shared features in order to contribute to personalization. In other words, a shared feature not crossed with any ADFs influences each action in the same way. An ADF not crossed with any shared feature influences each decision in the same way.

For convenience, you can cross two *subsets* of features. Then each feature in one subset is crossed with each feature in another subset.

#### 1-hot encoding

You can choose to represent some features as bit vectors, where each bit corresponds to a range of possible values. This bit is set to 1 if and only if the feature lies in this range. Thus, there is one "hot" bit that is set to 1, and the others are set to 0. This representation is commonly known as *1-hot encoding*.

The 1-hot encoding is typical for categorical features such as zipcode. It is also advisable for numerical features whose influence on the reward is likely to be non-linear. For example, a given article could be relevant to a particular age group, and irrelevant to anyone older or younger. 

In slightly more depth, our machine learning algorithms treat all possible values of a feature in a uniform way: via a common multiplicative coefficient. The 1-hot encoding allows each range of values to receive a more individual treatment. 

When choosing the ranges for the 1-hot encoding, keep in mind that all values within each range is treated uniformly. Making the ranges smaller leads to better rewards once enough data is collected, but may increase the amount of data needed to converge to better rewards.

#### Estimated average as a feature

As a thought experiment, what would be the average reward of a given action if it were chosen for all decisions? Such average reward could be used as a measure of the "overall quality" of this action. It is not known exactly whenever other actions have been chosen instead in some decisions. However, it can be estimated via reinforcement learning techniques. The quality of this estimate typically improves over time.

You can choose to include this "estimated average reward" as a feature for a given action. Then Custom Decision Service would automatically update this estimate as new data arrives. This feature is called the *marginal feature* of this action.

## Featurization (implementation)

## Options and parameters for machine learning