---
title: Understand your datasets
titleSuffix: Azure Machine Learning
description: Perform exploratory data analysis to understand feature biases and imbalances by using the Responsible AI dashboard's data analysis.
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic:  how-to
ms.author: mesameki
author: mesameki
ms.reviewer: lagayhar
ms.date: 11/09/2022
ms.custom: responsible-ml, event-tier1-build-2022
---

# Understand your datasets

Machine learning models "learn" from historical decisions and actions captured in training data. As a result, their performance in real-world scenarios is heavily influenced by the data they're trained on. When feature distribution in a dataset is skewed, it can cause a model to incorrectly predict data points that belong to an underrepresented group or to be optimized along an inappropriate metric.

For example, while a model was training an AI system for predicting house prices, the training set was representing 75 percent of newer houses that had less than median prices. As a result, it was much less accurate in successfully identifying more expensive historic houses. The fix was to add older and expensive houses to the training data and augment the features to include insights about historical value. That data augmentation improved results.

The data analysis component of the [Responsible AI dashboard](concept-responsible-ai-dashboard.md) helps visualize datasets based on predicted and actual outcomes, error groups, and specific features. It helps you identify issues of overrepresentation and underrepresentation and to see how data is clustered in the dataset. Data visualizations consist of aggregate plots or individual data points.

## When to use data analysis

Use data analysis when you need to:

- Explore your dataset statistics by selecting different filters to slice your data into different dimensions (also known as cohorts).
- Understand the distribution of your dataset across different cohorts and feature groups.
- Determine whether your findings related to fairness, error analysis, and causality (derived from other dashboard components) are a result of your dataset's distribution.
- Decide in which areas to collect more data to mitigate errors that come from representation issues, label noise, feature noise, label bias, and similar factors.

## Next steps

- Learn how to generate the Responsible AI dashboard via [CLI and SDK](how-to-responsible-ai-insights-sdk-cli.md) or [Azure Machine Learning studio UI](how-to-responsible-ai-insights-ui.md).
- Explore the [supported data analysis visualizations](how-to-responsible-ai-dashboard.md#data-analysis) of the Responsible AI dashboard.
- Learn how to generate a [Responsible AI scorecard](how-to-responsible-ai-scorecard.md) based on the insights observed in the Responsible AI dashboard.
