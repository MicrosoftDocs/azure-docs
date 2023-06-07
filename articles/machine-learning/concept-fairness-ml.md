---
title: Machine learning fairness
titleSuffix: Azure Machine Learning
description: Learn about machine learning fairness and how the Fairlearn Python package can help you assess and mitigate unfairness. 
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: conceptual
ms.author: mesameki
author: mesameki
ms.reviewer: lagayhar
ms.date: 08/17/2022
ms.custom: responsible-ml, devx-track-python
#Customer intent: As a data scientist, I want to learn about machine learning fairness and how to assess and mitigate unfairness in machine learning models.
---

# Model performance and fairness

This article describes methods that you can use to understand your model performance and fairness in Azure Machine Learning.

## What is machine learning fairness?

Artificial intelligence and machine learning systems can display unfair behavior. One way to define unfair behavior is by its harm, or its impact on people. AI systems can give rise to many types of harm. To learn more, see the [NeurIPS 2017 keynote by Kate Crawford](https://www.youtube.com/watch?v=fMym_BKWQzk).

Two common types of AI-caused harms are:

- **Harm of allocation**: An AI system extends or withholds opportunities, resources, or information for certain groups. Examples include hiring, school admissions, and lending, where a model might be better at picking good candidates among a specific group of people than among other groups.

- **Harm of quality-of-service**: An AI system doesn't work as well for one group of people as it does for another. For example, a voice recognition system might fail to work as well for women as it does for men.

To reduce unfair behavior in AI systems, you have to assess and mitigate these harms. The *model overview* component of the [Responsible AI dashboard](concept-responsible-ai-dashboard.md) contributes to the identification stage of the model lifecycle by generating model performance metrics for your entire dataset and your identified cohorts of data. It generates these metrics across subgroups identified in terms of sensitive features or sensitive attributes.

>[!NOTE]
> Fairness is a socio-technical challenge. Quantitative fairness metrics don't capture many aspects of fairness, such as justice and due process. Also, many quantitative fairness metrics can't all be satisfied simultaneously. 
>
> The goal of the Fairlearn open-source package is to enable humans to assess the impact and mitigation strategies. Ultimately, it's up to the humans who build AI and machine learning models to make trade-offs that are appropriate for their scenarios.

In this component of the Responsible AI dashboard, fairness is conceptualized through an approach known as *group fairness*. This approach asks: "Which groups of individuals are at risk for experiencing harm?" The term *sensitive features* suggests that the system designer should be sensitive to these features when assessing group fairness. 

During the assessment phase, fairness is quantified through *disparity metrics*. These metrics can evaluate and compare model behavior across groups either as ratios or as differences. The Responsible AI dashboard supports two classes of disparity metrics:

- **Disparity in model performance**: These sets of metrics calculate the disparity (difference) in the values of the selected performance metric across subgroups of data. Here are a few examples:

  - Disparity in accuracy rate
  - Disparity in error rate
  - Disparity in precision
  - Disparity in recall
  - Disparity in mean absolute error (MAE)  

- **Disparity in selection rate**: This metric contains the difference in selection rate (favorable prediction) among subgroups. An example of this is disparity in loan approval rate. Selection rate means the fraction of data points in each class classified as 1 (in binary classification) or distribution of prediction values (in regression).

The fairness assessment capabilities of this component come from the [Fairlearn](https://fairlearn.org/) package. Fairlearn provides a collection of model fairness assessment metrics and unfairness mitigation algorithms.

>[!NOTE]
> A fairness assessment is not a purely technical exercise. The Fairlearn open-source package can identify quantitative metrics to help you assess the fairness of a model, but it won't perform the assessment for you.  You must perform a qualitative analysis to evaluate the fairness of your own models. The sensitive features noted earlier are an example of this kind of qualitative analysis.

## Parity constraints for mitigating unfairness

After you understand your model's fairness issues, you can use the mitigation algorithms in the [Fairlearn](https://fairlearn.org/) open-source package to mitigate those issues. These algorithms support a set of constraints on the predictor's behavior called *parity constraints* or criteria. 

Parity constraints require some aspects of the predictor's behavior to be comparable across the groups that sensitive features define (for example, different races). The mitigation algorithms in the Fairlearn open-source package use such parity constraints to mitigate the observed fairness issues.

>[!NOTE]
> The unfairness mitigation algorithms in the Fairlearn open-source package can provide suggested mitigation strategies to reduce unfairness in a machine learning model, but those strategies don't eliminate unfairness. Developers might need to consider other parity constraints or criteria for their machine learning models. Developers who use Azure Machine Learning must determine for themselves if the mitigation sufficiently reduces unfairness in their intended use and deployment of machine learning models.  

The Fairlearn package supports the following types of parity constraints:

|Parity constraint  | Purpose  |Machine learning task  |
|---------|---------|---------|
|Demographic parity     |  Mitigate allocation harms | Binary classification, regression |
|Equalized odds  | Diagnose allocation and quality-of-service harms | Binary classification        |
|Equal opportunity | Diagnose allocation and quality-of-service harms | Binary classification        |
|Bounded group loss     |  Mitigate quality-of-service harms | Regression |

## Mitigation algorithms

The Fairlearn open-source package provides two types of unfairness mitigation algorithms:

- **Reduction**: These algorithms take a standard black-box machine learning estimator (for example, a LightGBM model) and generate a set of retrained models by using a sequence of reweighted training datasets. 

  For example, applicants of a certain gender might be upweighted or downweighted to retrain models and reduce disparities across gender groups. Users can then pick a model that provides the best trade-off between accuracy (or another performance metric) and disparity, based on their business rules and cost calculations.  
- **Post-processing**: These algorithms take an existing classifier and a sensitive feature as input. They then derive a transformation of the classifier's prediction to enforce the specified fairness constraints. The biggest advantage of one post-processing algorithm, threshold optimization, is its simplicity and flexibility because it doesn't need to retrain the model.

| Algorithm | Description | Machine learning task | Sensitive features | Supported parity constraints | Algorithm type |
| --- | --- | --- | --- | --- | --- |
| `ExponentiatedGradient` | Black-box approach to fair classification described in [A Reductions Approach to Fair Classification](https://arxiv.org/abs/1803.02453). | Binary classification | Categorical | Demographic parity, equalized odds| Reduction |
| `GridSearch` | Black-box approach described in [A Reductions Approach to Fair Classification](https://arxiv.org/abs/1803.02453).| Binary classification | Binary | Demographic parity, equalized odds | Reduction |
| `GridSearch` | Black-box approach that implements a grid-search variant of fair regression with the algorithm for bounded group loss described in [Fair Regression: Quantitative Definitions and Reduction-based Algorithms](https://arxiv.org/abs/1905.12843). | Regression | Binary | Bounded group loss| Reduction |
| `ThresholdOptimizer` | Postprocessing algorithm based on the paper [Equality of Opportunity in Supervised Learning](https://arxiv.org/abs/1610.02413). This technique takes as input an existing classifier and a sensitive feature. Then, it derives a monotone transformation of the classifier's prediction to enforce the specified parity constraints. | Binary classification | Categorical | Demographic parity, equalized odds| Post-processing |

## Next steps

- Learn how to generate the Responsible AI dashboard via [CLI and SDK](how-to-responsible-ai-insights-sdk-cli.md) or [Azure Machine Learning studio UI](how-to-responsible-ai-insights-ui.md).
- Explore the [supported model overview and fairness assessment visualizations](how-to-responsible-ai-dashboard.md#model-overview-and-fairness-metrics) of the Responsible AI dashboard.
- Learn how to generate a [Responsible AI scorecard](how-to-responsible-ai-scorecard.md) based on the insights observed in the Responsible AI dashboard.
- Learn how to use the components by checking out Fairlearn's [GitHub repository](https://github.com/fairlearn/fairlearn/), [user guide](https://fairlearn.github.io/main/user_guide/index.html), [examples](https://fairlearn.github.io/main/auto_examples/index.html), and [sample notebooks](https://github.com/fairlearn/fairlearn/blob/main/docs/contributor_guide/contributing_example_notebooks.rst).
