---
title: Data drift monitoring (Preview)
titleSuffix: Azure Machine Learning service
description: Learn how Azure Machine Learning service can monitor for data drift.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: jmartens
author: cody-dkdc
ms.author: copeters
ms.date: 06/20/2019
---

# What is data drift monitoring (Preview)?

Data drift is the change in distribution of data. In the context of machine learning, trained machine learning models may experience degraded prediction performance because of drift. Monitoring drift between training data and data used for making predictions can help detect performance problems.

Machine learning models are only as good as the data used to train them. Deploying models to production without monitoring its performance can lead to undetected and detrimental impacts. With data drift monitoring, you can detect and adapt to data drift. 

## When to monitor for data drift?

Metrics we can monitor include:

+ Magnitude of drift (Drift Coefficient)
+ Cause of drift (Drift Contribution by Feature)
+ Distance metrics (Wasserstein, Energy, etc.)

With this monitoring in place, alerting or actions can be set up when drift is detected and the data scientist can investigate the root cause of the issue. 

If you think that the input data for your deployed model may change, you should consider using data drift detection.

## How data drift is monitored in Azure Machine Learning service

Using **Azure Machine Learning service**, data drift is monitored through datasets or deployments. To monitor for data drift, a baseline dataset - usually the training dataset for a model - is specified. A second dataset - usually model input data gathered from a deployment - is tested against the baseline dataset. Both datasets are [profiled](how-to-explore-prepare-data.md#explore-with-summary-statistics) and input to the data drift monitoring service. A machine learning model is trained to detect differences between the two datasets. The model's performance is converted to the drift coefficient, which measures the magnitude of drift between the two datasets. Using [model interpretability](machine-learning-interpretability-explainability.md) the features that contributed to the drift coefficient are computed. From the dataset profile, statistical information about each feature is tracked. 

## Data drift metric output

There are multiple ways to view drift metrics:

* Use the Jupyter widget.
* Use the `get_metrics()` function on any `datadriftRun` object.
* View the metrics in the Azure portal on your model

The following metrics are saved in each run iteration for a data drift task:

|Metric|Description|
--|--|
wasserstein_distance|Statistical distance defined for one-dimensional numerical distribution.|
energy_distance|Statistical distance defined for one-dimensional numerical distribution.|
datadrift_coefficient|Formally Matthews correlation coefficient, a real number ranging from -1 to 1. In the context of drift, 0 indicates no drift and 1 indicates maximum drift.|
datadrift_contribution|Feature importance of features contributing to drift.|

## Next steps

See examples and learn how to monitor for data drift:

+ [Learn how to monitor data drift on models deployed through Azure Kubernetes Service (AKS)](how-to-monitor-data-drift.md)
+ Try out [Jupyter Notebook samples](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/data-drift/)