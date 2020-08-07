---
title: Assess and mitigate fairness issues in machine learning models
titleSuffix: Azure Machine Learning
description: Learn about fairness in machine learning models and how the Fairlearn Python package can help you build fairer models. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: luquinta
author: luisquintanilla
ms.date: 06/30/2020
#Customer intent: As a data scientist, I want to learn about assessing and mitigating fairness in machine learning models.
---

# Build fairer machine learning models

Learn about fairness in machine learning and how the [Fairlearn](https://fairlearn.github.io/) open-source Python package can help you build models that are more fair. If you are not making an effort to understand fairness issues and to assess fairness when building machine learning models, you may build models that produce unfair results. 

The following summary of the [user guide](https://fairlearn.github.io/user_guide/index.html) for the Fairlearn open-source package, describes how to use it to assess the fairness of the AI systems that you are building.  The Fairlearn open-source package can also offer options to help mitigate, or help to reduce, any fairness issues you observe.  See the [how-to](how-to-machine-learning-fairness-aml.md) and [sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/contrib/fairness) to enable fairness assessment of AI systems during training on Azure Machine Learning.


## What is fairness in machine learning systems?

>[!NOTE]
> Fairness is a socio-technical challenge. Many aspects of fairness, such as justice and due process, are not captured in quantitative fairness metrics. Also, many quantitative fairness metrics can't all be satisfied simultaneously. The goal with the Fairlearn open-source package is to enable humans to assess different impact and mitigation strategies. Ultimately, it is up to the human users building artificial intelligence and machine learning models to make trade-offs that are appropriate to their scenario.

Artificial intelligence and machine learning systems can display unfair behavior. One way to define unfair behavior is by its harm, or impact on people. There are many types of harm that AI systems can give rise to. See the [NeurIPS 2017 keynote by Kate Crawford](https://www.youtube.com/watch?v=fMym_BKWQzk) to learn more.

Two common types of AI-caused harms are:

- Harm of allocation: An AI system extends or withholds opportunities, resources, or information for certain groups. Examples include hiring, school admissions, and lending where a model might be much better at picking good candidates among a specific group of people than among other groups.

- Harm of quality-of-service: An AI system does not work as well for one group of people as it does for another. As an example, a voice recognition system might fail to work as well for women as it does for men.

To reduce unfair behavior in AI systems, you have to assess and mitigate these harms.


## Fairness assessment and mitigation with Fairlearn

Fairlearn is an open-source Python package that allows machine learning systems developers to assess their systems' fairness and mitigate the observed fairness issues.

The Fairlearn open-source package has two components:

- Assessment Dashboard: A Jupyter notebook widget for assessing how a model's predictions affect different groups. It also enables comparing multiple models by using fairness and performance metrics.
- Mitigation Algorithms: A set of algorithms to mitigate unfairness in binary classification and regression.

Together, these components enable data scientists and business leaders to navigate any trade-offs between fairness and performance, and to select the mitigation strategy that best fits their needs.

## Fairness assessment
In the Fairlearn open-source package, fairness is conceptualized though an approach known as **group fairness**, which asks: Which groups of individuals are at risk for experiencing harms? The relevant groups, also known as subpopulations, are defined through **sensitive features** or sensitive attributes. Sensitive features are passed to an estimator in the Fairlearn open-source package as a vector or a matrix called  `sensitive_features`. The term suggests that the system designer should be sensitive to these features when assessing group fairness. 

Something to be mindful of is whether these features contain privacy implications due to private data. But the word "sensitive" doesn't imply that these features shouldn't be used to make predictions.

>[!NOTE]
> A fairness assessment is not a purely technical exercise.  The Fairlearn open-source package can help you assess the fairness of a model, but it will not perform the assessment for you.  The Fairlearn open-source package helps identify quantitative metrics to assess fairness, but developers must also perform a qualitative analysis to evaluate the fairness of their own models.  The sensitive features noted above is an example of this kind of qualitative analysis.     

During assessment phase, fairness is quantified through disparity metrics. **Disparity metrics** can evaluate and compare model's behavior across different groups either as ratios or as differences. The Fairlearn open-source package supports two classes of disparity metrics:


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

The Fairlearn open-source package includes a variety of unfairness mitigation algorithms. These algorithms support a set of constraints on the predictor's behavior called **parity constraints** or criteria. Parity constraints require some aspects of the predictor behavior to be comparable across the groups that sensitive features define (e.g., different races). The mitigation algorithms in the Fairlearn open-source package use such parity constraints to mitigate the observed fairness issues.

>[!NOTE]
> Mitigating unfairness in a model means reducing the unfairness, but this technical mitigation cannot eliminate this unfairness completely.  The unfairness mitigation algorithms in the Fairlearn open-source package can provide suggested mitigation strategies to help reduce unfairness in a machine learning model, but they are not solutions to eliminate unfairness completely.  There may be other parity constraints or criteria that should be considered for each particular developer’s machine learning model. Developers using Azure Machine Learning must determine for themselves if the mitigation sufficiently eliminates any unfairness in their intended use and deployment of machine learning models.  

The Fairlearn open-source package supports the following types of parity constraints: 

|Parity constraint  | Purpose  |Machine learning task  |
|---------|---------|---------|
|Demographic parity     |  Mitigate allocation harms | Binary classification, Regression |
|Equalized odds  | Diagnose allocation and quality-of-service harms | Binary classification        |
|Equal opportunity | Diagnose allocation and quality-of-service harms | Binary classification        |
|Bounded group loss     |  Mitigate quality-of-service harms | Regression |



### Mitigation algorithms

The Fairlearn open-source package provides postprocessing and reduction unfairness mitigation algorithms:

- Reduction: These algorithms take a standard black-box machine learning estimator (e.g., a LightGBM model) and generate a set of retrained models using a sequence of re-weighted training datasets. For example, applicants of a certain gender might be up-weighted or down-weighted to retrain models and reduce disparities across different gender groups. Users can then pick a model that provides the best trade-off between accuracy (or other performance metric) and disparity, which generally would need to be based on business rules and cost calculations.  
- Post-processing: These algorithms take an existing classifier and the sensitive feature as input. Then, they derive a transformation of the classifier's prediction to enforce the specified fairness constraints. The biggest advantage of threshold optimization is its simplicity and flexibility as it does not need to retrain the model. 

| Algorithm | Description | Machine learning task | Sensitive features | Supported parity constraints | Algorithm Type |
| --- | --- | --- | --- | --- | --- |
| `ExponentiatedGradient` | Black-box approach to fair classification described in [A Reductions Approach to Fair Classification](https://arxiv.org/abs/1803.02453) | Binary classification | Categorical | [Demographic parity](#parity-constraints), [equalized odds](#parity-constraints) | Reduction |
| `GridSearch` | Black-box approach described in [A Reductions Approach to Fair Classification](https://arxiv.org/abs/1803.02453)| Binary classification | Binary | [Demographic parity](#parity-constraints), [equalized odds](#parity-constraints) | Reduction |
| `GridSearch` | Black-box approach that implements a grid-search variant of Fair Regression with the algorithm for bounded group loss described in [Fair Regression: Quantitative Definitions and Reduction-based Algorithms](https://arxiv.org/abs/1905.12843) | Regression | Binary | [Bounded group loss](#parity-constraints) | Reduction |
| `ThresholdOptimizer` | Postprocessing algorithm based on the paper [Equality of Opportunity in Supervised Learning](https://arxiv.org/abs/1610.02413). This technique takes as input an existing classifier and the sensitive feature, and derives a monotone transformation of the classifier's prediction to enforce the specified parity constraints. | Binary classification | Categorical | [Demographic parity](#parity-constraints), [equalized odds](#parity-constraints) | Post-processing |

## Next steps

- Learn how to use the different components by checking out the Fairlearn's [GitHub](https://github.com/fairlearn/fairlearn/), [user guide](https://fairlearn.github.io/user_guide/index.html), [examples](https://fairlearn.github.io/auto_examples/notebooks/index.html), and [sample notebooks](https://github.com/fairlearn/fairlearn/tree/master/notebooks).
- Learn [how to](how-to-machine-learning-fairness-aml.md) enable fairness assessment of machine learning models in Azure Machine Learning.
- See the [sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/contrib/fairness) for additional fairness assessment scenarios in Azure Machine Learning. 
