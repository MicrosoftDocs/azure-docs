---
title: Counterfactuals analysis and what-if
titleSuffix: Azure Machine Learning
description: Generate diverse counterfactual examples with feature perturbations to see minimal changes required to achieve desired prediction with the Responsible AI dashboard's integration of DiceML.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.author: mesameki
author: mesameki
ms.date: 08/17/2022
ms.custom: responsible-ml, event-tier1-build-2022
---

# Counterfactuals analysis and what-if (preview)

What-if counterfactuals address the question of “what would the model predict if the action input is changed”, enabling understanding and debugging of a machine learning model in terms of how it reacts to input (feature) changes. Compared with approximating a machine learning model or ranking features by their predictive importance (which standard interpretability techniques do), counterfactual analysis “interrogates” a model to determine what changes to a particular datapoint would flip the model decision. Such an analysis helps in disentangling the impact of different correlated features in isolation or for acquiring a more nuanced understanding of how much of a feature change is needed to see a model decision flip for classification models and decision change for regression models.

The Counterfactual Analysis and what-if component of the [Responsible AI dashboard](concept-responsible-ai-dashboard.md) consists of two functionalities:

- Generating a set of examples with minimal changes to a given point such that they change the model's prediction (showing the closest data points with opposite model predictions)
- Enabling users to generate their own what-if perturbations to understand how the model reacts to features’ changes.

One of the top differentiators of the Responsible AI dashboard's counterfactual analysis component is the fact that you can identify which features to vary and their permissible ranges for valid and logical counterfactual examples.



The capabilities of this component are founded by the [DiCE](https://github.com/interpretml/DiCE) package. 


Use What-If Counterfactuals when you need to:

- Examine fairness and reliability criteria as a decision evaluator (by perturbing sensitive attributes such as gender, ethnicity, etc., and observing whether model predictions change).
- Debug specific input instances in depth.
- Provide solutions to end users and determine what they can do to get a desirable outcome from the model next time.

## How are counterfactual examples generated?

To generate counterfactuals, DiCE implements a few model-agnostic techniques. These methods apply to any opaque-box classifier or regressor. They're based on sampling nearby points to an input point, while optimizing a loss function based on proximity (and optionally, sparsity, diversity, and feasibility). Currently supported methods are:

- [Randomized Search](http://interpret.ml/DiCE/notebooks/DiCE_model_agnostic_CFs.html#1.-Independent-random-sampling-of-features): Samples points randomly near the given query point and returns counterfactuals as those points whose predicted label is the desired class.
- [Genetic Search](http://interpret.ml/DiCE/notebooks/DiCE_model_agnostic_CFs.html#2.-Genetic-Algorithm): Samples points using a genetic algorithm, given the combined objective of optimizing proximity to the given query point, changing as few features as possible, and diversity among the counterfactuals generated.
- [KD Tree Search](http://interpret.ml/DiCE/notebooks/DiCE_model_agnostic_CFs.html#3.-Querying-a-KD-Tree) (For counterfactuals from a given training dataset): This algorithm returns counterfactuals from the training dataset. It constructs a KD tree over the training data points based on a distance function and then returns the closest points to a given query point that yields the desired predicted label.

## Next steps

- Learn how to generate the Responsible AI dashboard via [CLIv2 and SDKv2](how-to-responsible-ai-dashboard-sdk-cli.md) or [studio UI](how-to-responsible-ai-dashboard-ui.md).
- Explore the [supported counterfactual analysis and what-if perturbation visualizations](how-to-responsible-ai-dashboard.md#counterfactual-what-if) of the Responsible AI dashboard.
- Learn how to generate a [Responsible AI scorecard](how-to-responsible-ai-scorecard.md) based on the insights observed in the Responsible AI dashboard.
