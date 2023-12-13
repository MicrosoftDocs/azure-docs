---
title: Counterfactuals analysis and what-if
titleSuffix: Azure Machine Learning
description: Generate diverse counterfactual examples with feature perturbations to see minimal changes required to achieve desired prediction with the Responsible AI dashboard's integration of DiCE machine learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: rai
ms.topic:  how-to
ms.author: mesameki
author: mesameki
ms.reviewer: lagayhar
ms.date: 08/17/2022
ms.custom: responsible-ml, event-tier1-build-2022
---

# Counterfactuals analysis and what-if

What-if counterfactuals address the question of what the model would predict if you changed the action input. They enable understanding and debugging of a machine learning model in terms of how it reacts to input (feature) changes. 

Standard interpretability techniques approximate a machine learning model or rank features by their predictive importance. By contrast, counterfactual analysis "interrogates" a model to determine what changes to a particular data point would flip the model decision. 

Such an analysis helps in disentangling the impact of correlated features in isolation. It also helps you get a more nuanced understanding of how much of a feature change is needed to see a model decision flip for classification models and a decision change for regression models.

The *counterfactual analysis and what-if* component of the [Responsible AI dashboard](concept-responsible-ai-dashboard.md) has two functions:

- Generate a set of examples with minimal changes to a particular point such that they change the model's prediction (showing the closest data points with opposite model predictions).
- Enable users to generate their own what-if perturbations to understand how the model reacts to feature changes.

One of the top differentiators of the Responsible AI dashboard's counterfactual analysis component is the fact that you can identify which features to vary and their permissible ranges for valid and logical counterfactual examples.

The capabilities of this component come from the [DiCE](https://github.com/interpretml/DiCE) package. 

Use what-if counterfactuals when you need to:

- Examine fairness and reliability criteria as a decision evaluator by perturbing sensitive attributes such as gender and ethnicity, and then observing whether model predictions change.
- Debug specific input instances in depth.
- Provide solutions to users and determine what they can do to get a desirable outcome from the model.

## How are counterfactual examples generated?

To generate counterfactuals, DiCE implements a few model-agnostic techniques. These methods apply to any opaque-box classifier or regressor. They're based on sampling nearby points to an input point, while optimizing a loss function based on proximity (and optionally, sparsity, diversity, and feasibility). Currently supported methods are:

- [Randomized search](http://interpret.ml/DiCE/notebooks/DiCE_model_agnostic_CFs.html#1.-Independent-random-sampling-of-features): This method samples points randomly near a query point and returns counterfactuals as points whose predicted label is the desired class.
- [Genetic search](http://interpret.ml/DiCE/notebooks/DiCE_model_agnostic_CFs.html#2.-Genetic-Algorithm): This method samples points by using a genetic algorithm, given the combined objective of optimizing proximity to the query point, changing as few features as possible, and seeking diversity among the generated counterfactuals.
- [KD tree search](http://interpret.ml/DiCE/notebooks/DiCE_model_agnostic_CFs.html#3.-Querying-a-KD-Tree): This algorithm returns counterfactuals from the training dataset. It constructs a KD tree over the training data points based on a distance function and then returns the closest points to a particular query point that yields the desired predicted label.

## Next steps

- Learn how to generate the Responsible AI dashboard via [CLIv2 and SDKv2](how-to-responsible-ai-dashboard-sdk-cli.md) or [studio UI](how-to-responsible-ai-dashboard-ui.md).
- Explore the [supported counterfactual analysis and what-if perturbation visualizations](how-to-responsible-ai-dashboard.md#counterfactual-what-if) of the Responsible AI dashboard.
- Learn how to generate a [Responsible AI scorecard](how-to-responsible-ai-scorecard.md) based on the insights observed in the Responsible AI dashboard.
