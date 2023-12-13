---
title: Make data-driven policies and influence decision-making 
titleSuffix: Azure Machine Learning
description: Make data-driven decisions and policies with the Responsible AI dashboard's integration of the causal analysis tool EconML. 
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

# Make data-driven policies and influence decision-making

Machine learning models are powerful in identifying patterns in data and making predictions. But they offer little support for estimating how the real-world outcome changes in the presence of an intervention. 

Practitioners have become increasingly focused on using historical data to inform their future decisions and business interventions. For example, how would the revenue be affected if a corporation pursued a new pricing strategy? Would a new medication improve a patient's condition, all else equal?

The *causal inference* component of the [Responsible AI dashboard](concept-responsible-ai-dashboard.md) addresses these questions by estimating the effect of a feature on an outcome of interest on average, across a population or a cohort, and on an individual level. It also helps construct promising interventions by simulating feature responses to various interventions and creating rules to determine which population cohorts would benefit from an intervention. Collectively, these functionalities allow decision-makers to apply new policies and effect real-world change.

The capabilities of this component come from the [EconML](https://github.com/Microsoft/EconML) package. It estimates heterogeneous treatment effects from observational data via the [double machine learning](https://econml.azurewebsites.net/spec/estimation/dml.html) technique.

Use causal inference when you need to:

- Identify the features that have the most direct effect on your outcome of interest.
- Decide what overall treatment policy to take to maximize real-world impact on an outcome of interest.
- Understand how individuals with certain feature values would respond to a particular treatment policy.

## How are causal inference insights generated?

>[!NOTE]
> Only historical data is required to generate causal insights. The causal effects computed based on the treatment features are purely a data property. So, a trained model is optional when you're computing the causal effects.

Double machine learning is a method for estimating heterogeneous treatment effects when all potential confounders/controls (factors that simultaneously had a direct effect on the treatment decision in the collected data and the observed outcome) are observed but either of the following problems exists:

- There are too many for classical statistical approaches to be applicable. That is, they're *high-dimensional*.
- Their effect on the treatment and outcome can't be satisfactorily modeled by parametric functions. That is, they're *non-parametric*. 

You can use machine learning techniques to address both problems. For an example, see [Chernozhukov2016](https://econml.azurewebsites.net/spec/references.html#chernozhukov2016).

Double machine learning reduces the problem by first estimating two predictive tasks:

- Predicting the outcome from the controls
- Predicting the treatment from the controls  

Then the method combines these two predictive models in a final-stage estimation to create a model of the heterogeneous treatment effect. This approach allows for arbitrary machine learning algorithms to be used for the two predictive tasks while maintaining many favorable statistical properties related to the final model. These properties include small mean squared error, asymptotic normality, and construction of confidence intervals.

## What other tools does Microsoft provide for causal inference?

- [Project Azua](https://www.microsoft.com/research/project/project_azua/) provides a novel framework that focuses on end-to-end causal inference. 

  Azua's DECI (deep end-to-end causal inference) technology is a single model that can simultaneously do causal discovery and causal inference. The user provides data, and the model can output the causal relationships among all variables. 
  
  By itself, this approach can provide insights into the data. It enables the calculation of metrics such as individual treatment effect (ITE), average treatment effect (ATE), and conditional average treatment effect (CATE). You can then use these calculations to make optimal decisions. 

  The framework is scalable for large data, in terms of both the number of variables and the number of data points. It can also handle missing data entries with mixed statistical types.

- [EconML](https://www.microsoft.com/research/project/econml/) powers the back end of the Responsible AI dashboard's causal inference component. It's a Python package that applies machine learning techniques to estimate individualized causal responses from observational or experimental data. 

  The suite of estimation methods in EconML represents the latest advances in causal machine learning. By incorporating individual machine learning steps into interpretable causal models, these methods improve the reliability of what-if predictions and make causal analysis quicker and easier for a broad set of users.

- [DoWhy](https://py-why.github.io/dowhy/) is a Python library that aims to spark causal thinking and analysis. DoWhy provides a principled four-step interface for causal inference that focuses on explicitly modeling causal assumptions and validating them as much as possible. 

  The key feature of DoWhy is its state-of-the-art refutation API that can automatically test causal assumptions for any estimation method. It makes inference more robust and accessible to non-experts. 

  DoWhy supports estimation of the average causal effect for back-door, front-door, instrumental variable, and other identification methods. It also supports estimation of the CATE through an integration with the EconML library.

## Next steps

- Learn how to generate the Responsible AI dashboard via [CLI and SDK](how-to-responsible-ai-dashboard-sdk-cli.md) or [Azure Machine Learning studio UI](how-to-responsible-ai-dashboard-ui.md).
- Explore the [supported causal inference visualizations](how-to-responsible-ai-dashboard.md#causal-analysis) of the Responsible AI dashboard.
- Learn how to generate a [Responsible AI scorecard](how-to-responsible-ai-scorecard.md) based on the insights observed in the Responsible AI dashboard.
