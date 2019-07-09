---
title: Scenario assessment - Personalizer
titleSuffix: Azure Cognitive Services
description: Personalizer can be applied in any situation where your application can select the right item, action, or product to display - in order to make the experience better, achieve better business results, or improve productivity.
services: cognitive-services
author: edjez
manager: nitinme
ms.service: cognitive-services
ms.subservice: personalizer
ms.topic: conceptual
ms.date: 05/07/2019
ms.author: edjez
---
# Where can you use Personalizer?

Use Personalizer in any situation where your application needs to select the right item, action, or product to display - in order to make the experience better, achieve better business results, or improve productivity. 

Personalizer uses machine learning to select which action to show the user. The selection can vary drastically depending on the quantity, quality, and distribution of data sent to the service.

### Checklist for applying Personalizer


You can apply Personalizer in situations where:

* You have a business or usability goal for your application.
* You have a place in your application where making a contextual decision of what to show to users will improve that goal.
* The best choice can and should be learned from collective user behavior and total reward score.
* The use of machine learning for personalization follows [responsible use guidelines](ethics-responsible-use.md) and choices you chose.
* The contextual decision can be expressed as ranking the best option (action) from a limited set of choices.
* How well the ranked choice worked for your application can be determined by measuring some aspect of user behavior, and expressing it in a _reward score_. This is a number between -1 and 1.
* The reward score doesn't bring in too many confounding or external factors. The experiment duration is low enough that the reward score can be computed while it's still relevant.
* You can express the context for the rank as a list of at least 5 [features](concepts-features.md) that you think would help make the right choice, and that doesn't include personally identifiable information. (PII).
* You have information about each content choice, _action_, as a list of at least 5 [features](concepts-features.md) that you think will help Personalizer make the right choice.
* Your application can retain data for long enough to accumulate a history of at least 100,000 interactions.

## Machine learning considerations for applying Personalizer

Personalizer is based on reinforcement learning, an approach to machine learning that is taught by feedback you give it. 

Personalizer will learn best in situations where:

* There's enough events to stay on top of optimal personalization if the problem drifts over time (such as preferences in news or fashion). Personalizer will adapt to continuous change in the real world, but results won't be optimal if there's not enough events and data to learn from to discover and settle on new patterns. You should choose a use case that happens often enough. Consider looking for use cases that happen at least 500 times per day.
* Context and actions have enough  [features](concepts-features.md) to facilitate learning.
* There are fewer than 50 actions to rank per call.
* Your data retention settings allow Personalizer to collect enough data to perform offline evaluations and policy optimization. This is typically at least 50,000 data points.

## Monitor effectiveness of Personalizer

You can monitor the effectiveness of Personalizer periodically by performing [offline evaluations](concepts-offline-evaluation.md).

## Use Personalizer with recommendation engines

Many companies use recommendation engines, marketing and campaigning tools, audience segmentation and clustering, collaborative filtering, and other means to recommend products from a large catalog to customers.

The [Microsoft Recommenders GitHub repository](https://github.com/Microsoft/Recommenders) provides examples and best practices for building recommendation systems, provided as Jupyter notebooks. It provides working examples for preparing data, building models, evaluating, tuning, and operationalizing the recommendation engines, for many common approaches including xDeepFM, SAR, ALS, RBM, DKN.

Personalizer can work with a recommendation engine when it's present.

* Recommendation engines take large amounts of items (for example, 500,000) and recommend a subset (such as the top 20) from hundreds or thousands of options.
* Personalizer takes a small number of actions with lots of information about them and ranks them in real time for a given rich context, while most recommendation engines only use a few attributes about users, products and their interactions.
* Personalizer is designed to autonomously explore user preferences all the time, which will yield better results where content is changing rapidly, such as news, live events, live community content, content with daily updates, or seasonal content.

A common use is to take the output of a recommendation engine (for example, the top 20 products for a certain customer) and use that as the input actions for Personalizer.

## Next steps

[Ethics & responsible use](ethics-responsible-use.md).