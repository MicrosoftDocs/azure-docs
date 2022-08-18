---
title: Machine learning fairness (preview)
titleSuffix: Azure Machine Learning
description: Learn about machine learning fairness and how the Fairlearn Python package can help you assess and mitigate unfairness. 
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: conceptual
ms.author: mesameki
author: mesameki
ms.date: 08/17/2022
ms.custom: responsible-ml
#Customer intent: As a data scientist, I want to learn about machine learning fairness and how to assess and mitigate unfairness in machine learning models.
---

# Model performance and fairness (preview)

This article describes methods you can use for understanding your model performance and fairness in Azure Machine Learning.

## What is machine learning fairness?

Artificial intelligence and machine learning systems can display unfair behavior. One way to define unfair behavior is by its harm, or impact on people. There are many types of harm that AI systems can give rise to. To learn more, [NeurIPS 2017 keynote by Kate Crawford](https://www.youtube.com/watch?v=fMym_BKWQzk).

Two common types of AI-caused harms are:

- Harm of allocation: An AI system extends or withholds opportunities, resources, or information for certain groups. Examples include hiring, school admissions, and lending where a model might be much better at picking good candidates among a specific group of people than among other groups.

- Harm of quality-of-service: An AI system doesn't work as well for one group of people as it does for another. As an example, a voice recognition system might fail to work as well for women as it does for men.

To reduce unfair behavior in AI systems, you have to assess and mitigate these harms. The model overview component of the [Responsible AI dashboard](concept-responsible-ai-dashboard.md) contributes to the “identify” stage of the model lifecycle by generating various model performance metrics for your entire dataset, your identified cohorts of data, and across subgroups identified in terms of **sensitive features** or sensitive attributes.

>[!NOTE]
> Fairness is a socio-technical challenge. Many aspects of fairness, such as justice and due process, are not captured in quantitative fairness metrics. Also, many quantitative fairness metrics can't all be satisfied simultaneously. The goal of the Fairlearn open-source package is to enable humans to assess the different impact and mitigation strategies. Ultimately, it is up to the human users building artificial intelligence and machine learning models to make trade-offs that are appropriate to their scenario.

In this component of the Responsible AI dashboard, fairness is conceptualized through an approach known as **group fairness**, which asks: Which groups of individuals are at risk for experiencing harm? The term **sensitive features** suggests that the system designer should be sensitive to these features when assessing group fairness. 

During the assessment phase, fairness is quantified through disparity metrics. **Disparity metrics** can evaluate and compare model behavior across different groups either as ratios or as differences. The Responsible AI dashboard supports two classes of disparity metrics:

- Disparity in model performance: These sets of metrics calculate the disparity (difference) in the values of the selected performance metric across different subgroups of data. Some examples include:

  - disparity in accuracy rate
  - disparity in error rate
  - disparity in precision
  - disparity in recall
  - disparity in MAE
  - many others

- Disparity in selection rate: This metric contains the difference in selection rate (favorable prediction) among different subgroups. An example of this is disparity in loan approval rate. Selection rate means the fraction of data points in each class classified as 1 (in binary classification) or distribution of prediction values (in regression).

The fairness assessment capabilities of this component are founded by the [Fairlearn](https://fairlearn.org/) package, providing a collection of model fairness assessment metrics and unfairness mitigation algorithms.

>[!NOTE]
> A fairness assessment is not a purely technical exercise.  The Fairlearn open-source package can help you assess the fairness of a model, but it will not perform the assessment for you.  The Fairlearn open-source package helps identify quantitative metrics to assess fairness, but developers must also perform a qualitative analysis to evaluate the fairness of their own models.  The sensitive features noted above is an example of this kind of qualitative analysis.

## Mitigate unfairness in machine learning models

Upon understanding your model's fairness issues, you can use [Fairlearn](https://fairlearn.org/)'s mitigation algorithms to mitigate your observed fairness issues.

The Fairlearn open-source package includes various unfairness mitigation algorithms. These algorithms support a set of constraints on the predictor's behavior called **parity constraints** or criteria. Parity constraints require some aspects of the predictor behavior to be comparable across the groups that sensitive features define (for example, different races). The mitigation algorithms in the Fairlearn open-source package use such parity constraints to mitigate the observed fairness issues.

>[!NOTE]
> Mitigating unfairness in a model means reducing the unfairness, but this technical mitigation cannot eliminate this unfairness completely.  The unfairness mitigation algorithms in the Fairlearn open-source package can provide suggested mitigation strategies to help reduce unfairness in a machine learning model, but they are not solutions to eliminate unfairness completely.  There may be other parity constraints or criteria that should be considered for each particular developer's machine learning model. Developers using Azure Machine Learning must determine for themselves if the mitigation sufficiently eliminates any unfairness in their intended use and deployment of machine learning models.  

The Fairlearn open-source package supports the following types of parity constraints:

|Parity constraint  | Purpose  |Machine learning task  |
|---------|---------|---------|
|Demographic parity     |  Mitigate allocation harms | Binary classification, Regression |
|Equalized odds  | Diagnose allocation and quality-of-service harms | Binary classification        |
|Equal opportunity | Diagnose allocation and quality-of-service harms | Binary classification        |
|Bounded group loss     |  Mitigate quality-of-service harms | Regression |

### Mitigation algorithms

The Fairlearn open-source package provides postprocessing and reduction unfairness mitigation algorithms:

- Reduction: These algorithms take a standard black-box machine learning estimator (for example, a LightGBM model) and generate a set of retrained models using a sequence of reweighted training datasets. For example, applicants of a certain gender might be up-weighted or down-weighted to retrain models and reduce disparities across different gender groups. Users can then pick a model that provides the best trade-off between accuracy (or other performance metric) and disparity, which generally would need to be based on business rules and cost calculations.  
- Post-processing: These algorithms take an existing classifier and the sensitive feature as input. Then, they derive a transformation of the classifier's prediction to enforce the specified fairness constraints. The biggest advantage of threshold optimization is its simplicity and flexibility as it doesn’t need to retrain the model.

| Algorithm | Description | Machine learning task | Sensitive features | Supported parity constraints | Algorithm Type |
| --- | --- | --- | --- | --- | --- |
| `ExponentiatedGradient` | Black-box approach to fair classification described in [A Reductions Approach to Fair Classification](https://arxiv.org/abs/1803.02453) | Binary classification | Categorical | Demographic parity, equalized odds| Reduction |
| `GridSearch` | Black-box approach described in [A Reductions Approach to Fair Classification](https://arxiv.org/abs/1803.02453)| Binary classification | Binary | Demographic parity, equalized odds | Reduction |
| `GridSearch` | Black-box approach that implements a grid-search variant of Fair Regression with the algorithm for bounded group loss described in [Fair Regression: Quantitative Definitions and Reduction-based Algorithms](https://arxiv.org/abs/1905.12843) | Regression | Binary | Bounded group loss| Reduction |
| `ThresholdOptimizer` | Postprocessing algorithm based on the paper [Equality of Opportunity in Supervised Learning](https://arxiv.org/abs/1610.02413). This technique takes as input an existing classifier and the sensitive feature, and derives a monotone transformation of the classifier's prediction to enforce the specified parity constraints. | Binary classification | Categorical | Demographic parity, equalized odds| Post-processing |

## Next steps

- Learn how to generate the Responsible AI dashboard via [CLIv2 and SDKv2](how-to-responsible-ai-dashboard-sdk-cli.md) or [studio UI](how-to-responsible-ai-dashboard-ui.md).
- Explore the [supported model overview and fairness assessment visualizations](how-to-responsible-ai-dashboard.md#model-overview) of the Responsible AI dashboard.
- Learn how to generate a [Responsible AI scorecard](how-to-responsible-ai-scorecard.md) based on the insights observed in the Responsible AI dashboard.
- Learn how to use the different components by checking out the [Fairlearn's GitHub](https://github.com/fairlearn/fairlearn/), [user guide](https://fairlearn.github.io/main/user_guide/index.html), [examples](https://fairlearn.github.io/main/auto_examples/index.html), and [sample notebooks](https://github.com/fairlearn/fairlearn/tree/master/notebooks).
