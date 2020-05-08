---
title: 'Assess and mitigate fairness in machine learning models'
titleSuffix: Azure Machine Learning
description: Learn about fairness in machine learning models and how the Fairlearn Python package can help you build fairer models. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: luquinta
author: luisquintanilla
ms.date: 05/02/2020
#Customer intent: As a data scientist, I want to learn about assessing and mitigating fairness in machine learning models.
---

# Fairness in machine learning models

Learn about fairness in machine learning and how the Fairlearn open-source Python package can help you build models that are more fair.

## What is fairness in machine learning systems?

Artificial intelligence and machine learning systems can display unfair behavior. One way to define unfair behavior is by its harm, or impact on people. There are many types of harm that AI systems can give rise to. Two common types of AI-caused harms are:

- Harm of allocation: An AI system extends or withholds opportunities, resources, or information. Examples include hiring, school admissions, and lending where a model might be much better at picking good candidates among a specific group of people than among other groups.

- Harm of quality-of-service: An AI system does not work as well for one group of people as it does for another. As an example, a voice recognition system might fail to work as well for women as it does for men.

To reduce unfair behavior in AI systems, you have to assess and mitigate these harms.

>[!NOTE]
> Fairness is a socio-technical challenge. Many aspects of fairness, such as justice and due process, are not captured in quantitative fairness metrics. Also, many quantitative fairness metrics can't all be satisfied simultaneously. The goal is to enable humans to assess different mitigation strategies and then make trade-offs that are appropriate to their scenario.

## Fairness assessment and mitigation with Fairlearn

Fairlearn is an open-source Python package that allows machine learning systems developers to assess their systems' fairness and mitigate the observed fairness issues.

Fairlearn has two components:

- Assessment Dashboard: A Jupyter notebook widget for assessing how a model's predictions affect different groups. It also enables comparing multiple models by using fairness and performance metrics.
- Mitigation Algorithms: A set of algorithms to mitigate unfairness in binary classification and regression.

Together, these components enable data scientists and business leaders to navigate any trade-offs between fairness and performance, and to select the mitigation strategy that best fits their needs.

## Fairness assessment

In Fairlearn, fairness is conceptualized though an approach known as **group fairness**, which asks: Which groups of individuals are at risk for experiencing harms?

The relevant groups, also known as subpopulations, are defined through **sensitive features** or sensitive attributes. Sensitive features are passed to a Fairlearn estimator as a vector or a matrix called `sensitive_features`. The term suggests that the system designer should be sensitive to these features when assessing group fairness. Something to be mindful of is whether these features contain privacy implications due to personally identifiable information. But the word "sensitive" doesn't imply that these features shouldn't be used to make predictions.

During assessment phase, fairness is quantified through disparity metrics. **Disparity metrics** can evaluate and compare model's behavior across different groups either as ratios or as differences. Fairlearn supports two classes of disparity metrics:


- Disparity in model performance: These sets of metrics calculate the disparity (difference) in the values of the selected performance metric across different subgroups. Some examples include:

  - disparity in accuracy rate
  - disparity in error rate
  - disparity in precision
  - disparity in recall
  - disparity in MAE
  - many others

- Disparity in selection rate: This metric contains the difference in selection rate among different subgroups. An example of this is disparity in loan approval rate. Selection rate means the fraction of datapoints in each class classified as 1 (in binary classification) or distribution of prediction values (in regression).

## Unfairness mitigation

### Parity constraints

Fairlearn includes a variety of unfairness mitigation algorithms. These algorithms support a set of constraints on the predictor's behavior called **parity constraints** or criteria. Parity constraints require some aspects of the predictor behavior to be comparable across the groups that sensitive features define (e.g., different races). Fairlearn's mitigation algorithms use such parity constraints to mitigate the observed fairness issues.

Fairlearn supports the following types of parity constraints:

|Parity constraint  | Purpose  |Machine learning task  |
|---------|---------|---------|
|Demographic parity     |  Mitigate allocation harms | Binary classification, Regression |
|Equalized odds  | Diagnose allocation and quality-of-service harms | Binary classification        |
|Bounded group loss     |  Mitigate quality-of-service harms | Regression |

### Mitigation algorithms

Fairlearn provides postprocessing and reduction unfairness mitigation algorithms:

- Reduction: These algorithms take a standard black-box ML estimator (e.g., a LightGBM model) and generate a set of retrained models using a sequence of re-weighted training datasets. For example, applicants of a certain gender might be up-weighted or down-weighted to retrain models and reduce disparities across different gender groups. Users can then pick a model that provides the best trade-off between accuracy (or other performance metric) and disparity, which generally would need to be based on business rules and cost calculations.  
- Post-processing: These algorithms take an existing classifier and the sensitive feature as input. Then, they derive a transformation of the classifier's prediction to enforce the specified fairness constraints. The biggest advantage of threshold optimization is its simplicity and flexibility as it does not need to retrain the model. 

| Algorithm | Description | Machine learning task | Sensitive features | Supported parity constraints | Algorithm Type |
| --- | --- | --- | --- | --- | --- |
| `ExponentiatedGradient` | Black-box approach to fair classification described in [A Reductions Approach to Fair Classification](https://arxiv.org/abs/1803.02453) | Binary classification | Categorical | [Demographic parity](#parity-constraints), [equalized odds](#parity-constraints) | Reduction |
| `GridSearch` | Black-box approach described in [A Reductions Approach to Fair Classification](https://arxiv.org/abs/1803.02453)| Binary classification | Binary | [Demographic parity](#parity-constraints), [equalized odds](#parity-constraints) | Reduction |
| `GridSearch` | Black-box approach that implements a grid-search variant of Fair Regression with the algorithm for bounded group loss described in [Fair Regression: Quantitative Definitions and Reduction-based Algorithms](https://arxiv.org/abs/1905.12843) | Regression | Binary | [Bounded group loss](#parity-constraints) | Reduction |
| `ThresholdOptimizer` | Postprocessing algorithm based on the paper [Equality of Opportunity in Supervised Learning](https://arxiv.org/abs/1610.02413). This technique takes as input an existing classifier and the sensitive feature, and derives a monotone transformation of the classifier's prediction to enforce the specified parity constraints. | Binary classification | Categorical | [Demographic parity](#parity-constraints), [equalized odds](#parity-constraints) | Post-processing |

## Next steps

- To learn how to use the different components, check out the [Fairlearn GitHub repository](https://github.com/fairlearn/fairlearn/) and [sample notebooks](https://github.com/fairlearn/fairlearn/tree/master/notebooks).
- Learn about preserving data privacy by using [Differential privacy and the WhisperNoise package](concept-differential-privacy.md).