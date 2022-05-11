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
ms.date: 05/10/2022
ms.custom: responsible-ai
#Customer intent: As a data scientist, I want to learn about machine learning fairness and how to assess and mitigate unfairness in machine learning models.
---

# Why is model fairness important to model debugging?

Artificial Intelligence (AI) has transformed modern life via previously unthinkable feats, from self-driving cars and machines that can master the ancient boardgame Go to more “everyday” developments, such as customer support chatbots and personalized product recommendations. But, at the same time, these new opportunities have also raised new challenges; among these, most notably, are challenges that have highlighted the potential for AI systems to treat people unfairly. Indeed, the fairness of AI systems is one of the key concerns facing society as AI plays an increasingly significant role in our daily lives.  

One way to define unfair behavior is by its harm, or impact on people. There are many types of harm that AI systems can give rise to. See this [Microsoft Research webinar](https://www.microsoft.com/research/video/fairness-related-harms-in-ai-systems-examples-assessment-and-mitigation/) to learn more. 

Two common types of AI-caused harm are:

- Harm of allocation: An AI system extends or withholds opportunities, resources, or information for certain groups. Examples include hiring, school admissions, and lending where a model might be much better at picking good candidates among a specific group of people than among other groups. 
- Harm of quality-of-service: An AI system does not work as well for one group of people as it does for another. As an example, a voice recognition system might fail to work as well for women as it does for men. 

To reduce unfair behavior in AI systems, you must assess and mitigate these harms. 

The model overview component of the [Responsible AI dashboard](./concept-responsible-ai-dashboard.md) contributes to the “identify” stage of the model lifecycle workflow by evaluating the performance of your model across different sub-pockets of data. It enables exploring the distribution of your prediction values and the values of your model performance metrics across different pre-built dataset cohorts, while allowing you to run a comparative analysis of model performance across sensitive feature sub-cohorts (e.g., performance across different genders, income levels).

The capabilities of this component are founded by [Fairlearn](https://fairlearn.org/) capabilities on assessing and mitigating model fairness issues.

  

**Use model overview and fairness when you need to…**

- Understand your overall model performance and metrics. 
- Explore how your model is treating different subgroups represented in your dataset. 
- Explore your model fairness insights by understanding model performance disparities across sensitive groups (e.g., age, gender).


##  How to assess your model fairness? 

Fairness is conceptualized through an approach known as **group fairness**, which asks: Which groups of individuals are at risk for experiencing harms? The relevant groups, also known as subpopulations, are defined through **sensitive features** or sensitive attributes.  

>[!NOTE]
> A fairness assessment is not a purely technical exercise. The fairness assessment capabilities of the Responsible AI dashboard can help you assess the fairness of a model, but it will not perform the assessment for you. It helps identify quantitative metrics to assess fairness, but developers must also perform a qualitative analysis to evaluate the fairness of their own models.  

During assessment phase, fairness is quantified through disparity metrics. **Disparity metrics** can evaluate and compare model's behavior across different groups either as ratios or as differences. The Fairlearn open-source package supports two classes of disparity metrics:


- Disparity in model performance: These sets of metrics calculate the disparity (difference) in the values of the selected performance metric across different subgroups. Some examples include:

  - disparity in accuracy rate
  - disparity in error rate
  - disparity in precision
  - disparity in recall
  - disparity in MAE
  - many others

- Disparity in selection rate: This metric contains the difference in selection rate among different subgroups. An example of this is disparity in loan approval rate. Selection rate means the fraction of datapoints in each class classified as 1 (in binary classification) or distribution of prediction values (in regression).

## Mitigate unfairness in machine learning models
You can use the [Fairlearn](https://fairlearn.org/) open-source package to mitigate your model fairness issues by selecting a parity constraint and a postprocessing and/or reduction unfairness mitigation algorithm: 

### Parity constraints

The Fairlearn open-source package includes a variety of unfairness mitigation algorithms. These algorithms support a set of constraints on the predictor's behavior called **parity constraints** or criteria. Parity constraints require some aspects of the predictor behavior to be comparable across the groups that sensitive features define (for example, different races). The mitigation algorithms in the Fairlearn open-source package use such parity constraints to mitigate the observed fairness issues.

>[!NOTE]
> Mitigating unfairness in a model means reducing the unfairness, but this technical mitigation cannot eliminate this unfairness completely.  The unfairness mitigation algorithms in the Fairlearn open-source package can provide suggested mitigation strategies to help reduce unfairness in a machine learning model, but they are not solutions to eliminate unfairness completely.  There may be other parity constraints or criteria that should be considered for each particular developer's machine learning model. Developers using Azure Machine Learning must determine for themselves if the mitigation sufficiently eliminates any unfairness in their intended use and deployment of machine learning models.  

The Fairlearn open-source package supports the following types of parity constraints: 

| Parity constraint  | Purpose                                          | Machine learning task             |
|--------------------|--------------------------------------------------|-----------------------------------|
| Demographic parity | Mitigate allocation harms                        | Binary classification, Regression |
| Equalized odds     | Diagnose allocation and quality-of-service harms | Binary classification             |
| Equal opportunity  | Diagnose allocation and quality-of-service harms | Binary classification             |
| Bounded group loss | Mitigate quality-of-service harms                | Regression                        |

### Mitigation algorithms

The Fairlearn open-source package provides postprocessing and reduction unfairness mitigation algorithms:

- Reduction: These algorithms take a standard black-box machine learning estimator (for example, a LightGBM model) and generate a set of retrained models using a sequence of re-weighted training datasets. For example, applicants of a certain gender might be up-weighted or down-weighted to retrain models and reduce disparities across different gender groups. Users can then pick a model that provides the best trade-off between accuracy (or other performance metric) and disparity, which generally would need to be based on business rules and cost calculations.  
- Post-processing: These algorithms take an existing classifier and the sensitive feature as input. Then, they derive a transformation of the classifier's prediction to enforce the specified fairness constraints. The biggest advantage of threshold optimization is its simplicity and flexibility as it doesn’t need to retrain the model.

| Algorithm | Description | Machine learning task | Sensitive features | Supported parity constraints | Algorithm Type |
| --- | --- | --- | --- | --- | --- |
| `ExponentiatedGradient` | Black-box approach to fair classification described in [A Reductions Approach to Fair Classification](https://arxiv.org/abs/1803.02453) | Binary classification | Categorical | [Demographic parity](#parity-constraints), [equalized odds](#parity-constraints) | Reduction |
| `GridSearch` | Black-box approach described in [A Reductions Approach to Fair Classification](https://arxiv.org/abs/1803.02453)| Binary classification | Binary | [Demographic parity](#parity-constraints), [equalized odds](#parity-constraints) | Reduction |
| `GridSearch` | Black-box approach that implements a grid-search variant of Fair Regression with the algorithm for bounded group loss described in [Fair Regression: Quantitative Definitions and Reduction-based Algorithms](https://arxiv.org/abs/1905.12843) | Regression | Binary | [Bounded group loss](#parity-constraints) | Reduction |
| `ThresholdOptimizer` | Postprocessing algorithm based on the paper [Equality of Opportunity in Supervised Learning](https://arxiv.org/abs/1610.02413). This technique takes as input an existing classifier and the sensitive feature, and derives a monotone transformation of the classifier's prediction to enforce the specified parity constraints. | Binary classification | Categorical | [Demographic parity](#parity-constraints), [equalized odds](#parity-constraints) | Post-processing |

## Next steps

- See the how-to guide for generating a Responsible AI dashboard with model overview and fairness assessment via [CLIv2 and SDKv2](./how-to-responsible-ai-dashboard-SDK.md) or [studio UI](./how-to-responsible-ai-dashboard.md).
- See the how-to generate a [Responsible AI scorecard](./how-to-responsible-ai-scorecard.md) based on the insights observed in the Responsible AI dashboard.
