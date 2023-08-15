---
title: Reinforcement Learning - Personalizer
titleSuffix: Azure AI services
description: Personalizer uses information about actions and current context to make better ranking suggestions. The information about these actions and context are attributes or properties that are referred to as features.
author: jcodella
ms.author: jacodel
ms.manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 05/07/2019
---
# What is Reinforcement Learning?

Reinforcement Learning is an approach to machine learning that learns behaviors by getting feedback from its use.
 
Reinforcement Learning works by:

* Providing an opportunity or degree of freedom to enact a behavior - such as making decisions or choices.
* Providing contextual information about the environment and choices.
* Providing feedback about how well the behavior achieves a certain goal.

While there are many subtypes and styles of reinforcement learning, this is how the concept works in Personalizer:

* Your application provides the opportunity to show one piece of content from a list of alternatives.
* Your application provides information about each alternative and the context of the user.
* Your application computes a _reward score_.

Unlike some approaches to reinforcement learning, Personalizer doesn't require a simulation to work in. Its learning algorithms are designed to react to an outside world (versus control it) and learn from each data point with an understanding that it's a unique opportunity that cost time and money to create, and that there's a non-zero regret (loss of possible reward) if suboptimal performance happens.

## What type of reinforcement learning algorithms does Personalizer use?

The current version of Personalizer uses **contextual bandits**, an approach to reinforcement learning that is framed around making decisions or choices between discrete actions, in a given context.

The _decision memory_, the model that has been trained to capture the best possible decision, given a context, uses a set of linear models. These have repeatedly shown business results and are a proven approach, partially because they can learn from the real world very rapidly without needing multi-pass training, and partially because they can complement supervised learning models and deep neural network models.

The explore / best action traffic allocation is made randomly following the percentage set for exploration, and the default algorithm for exploration is epsilon-greedy.

### History of Contextual Bandits

John Langford coined the name Contextual Bandits (Langford and Zhang [2007]) to describe a tractable subset of reinforcement learning and has worked on a half-dozen papers improving our understanding of how to learn in this paradigm:

* Beygelzimer et al. [2011]
* Dudík et al. [2011a, b]
* Agarwal et al. [2014, 2012]
* Beygelzimer and Langford [2009]
* Li et al. [2010]

John has also given several tutorials previously on topics such as Joint Prediction (ICML 2015), Contextual Bandit Theory (NIPS 2013), Active Learning (ICML 2009), and Sample Complexity Bounds (ICML 2003)

## What machine learning frameworks does Personalizer use?

Personalizer currently uses [Vowpal Wabbit](https://github.com/VowpalWabbit/vowpal_wabbit/wiki) as the foundation for the machine learning. This framework allows for maximum throughput and lowest latency when making personalization ranks and training the model with all events.

## References

* [Making Contextual Decisions with Low Technical Debt](https://arxiv.org/abs/1606.03966)
* [A Reductions Approach to Fair Classification](https://arxiv.org/abs/1803.02453)
* [Efficient Contextual Bandits in Non-stationary Worlds](https://arxiv.org/abs/1708.01799)
* [Residual Loss Prediction: Reinforcement: learning With No Incremental Feedback](https://openreview.net/pdf?id=HJNMYceCW)
* [Mapping Instructions and Visual Observations to Actions with Reinforcement Learning](https://arxiv.org/abs/1704.08795)
* [Learning to Search Better Than Your Teacher](https://arxiv.org/abs/1502.02206)

## Next steps

[Offline evaluation](concepts-offline-evaluation.md) 
