---
title: Monitoring models in production (preview)
titleSuffix: Azure Machine Learning
description: Monitor the performance of models deployed to production on Azure Machine Learning.
services: machine-learning
author: Bozhong68
ms.author: bozhlin
ms.service: machine-learning
ms.subservice: mlops
ms.reviewer: mopeakande
reviewer: msakande
ms.topic: conceptual
ms.date: 05/23/2023
ms.custom: devplatv2
---

# Model monitoring with Azure Machine Learning (preview)

In this article, you'll learn about model monitoring in Azure Machine Learning, the signals and metrics you can monitor, and the recommended practices for using model monitoring.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

Model monitoring is the last step in the machine learning end-to-end lifecycle. This step tracks model performance in production and aims to understand it from both data science and operational perspectives. Unlike traditional software systems, the behavior of machine learning systems is governed not just by rules specified in code, but also by model behavior learned from data. Data distribution changes, training-serving skew, data quality issues, shift in environment, or consumer behavior changes can all cause models to become stale and their performance to degrade to the point that they fail to add business value or start to cause serious compliance issues in highly regulated environments.

To implement monitoring, Azure Machine Learning acquires monitoring signals through data analysis on streamed production inference data and reference data. The reference data can include historical training data, validation data, or ground truth data. Each monitoring signal has one or more metrics. Users can set thresholds for these metrics in order to receive alerts via Azure Machine Learning or Azure Monitor about model or data anomalies. These alerts can prompt users to analyze or troubleshoot monitoring signals in Azure Machine Learning studio for continuous model quality improvement.

## Capabilities of model monitoring

Azure Machine Learning provides the following capabilities for continuous model monitoring:

* **Built-in monitoring signals**. Model monitoring provides built-in monitoring signals for tabular data. These monitoring signals include data drift, prediction drift, data quality, and feature attribution drift.
* **Out-of-box model monitoring setup with Azure Machine Learning online endpoint**. If you deploy your model to production in an Azure Machine Learning online endpoint, Azure Machine Learning collects production inference data automatically and uses it for continuous monitoring.
* **Use of multiple monitoring signals for a broad view**. You can easily include several monitoring signals in one monitoring setup. For each monitoring signal, you can select your preferred metric(s) and fine-tune an alert threshold.
* **Use of recent past production data or training data as comparison baseline dataset**. For model signals and metrics, Azure Machine Learning lets you set these datasets as the baseline dataset for comparison.
* **Monitoring of data drift or data quality for top n features**. If you use training data as the comparison baseline dataset, you can define data drift or data quality layering over feature importance.
* **Monitoring of data drift for a population subset**. For some ML models, data drift can occur only for a subset of the population. This can make data drift go undetected and its impact subtle. For such ML models, it's important to monitor drift for specific subsets of the population.
* **Flexibility to define your monitoring signal**. If the built-in monitoring signals aren't suitable for your business scenario, you can define your own monitoring signal with a custom monitoring signal component.
* **Flexibility to bring your own production inference data**. If you deploy models outside of Azure Machine Learning, or if you deploy models to Azure Machine Learning batch endpoints, you can collect production inference data and use that data in Azure Machine Learning for model monitoring.
* **Flexibility to select data window**. You have the flexibility to select a data window for both the target dataset and the baseline dataset.
    * By default, the data window for production inference data (the target dataset) is your monitoring frequency. That is, all data collected in the past monitoring period before the monitoring job is run will be used as the target dataset. You can use `data_window_size` to adjust the data window for the target dataset if needed.
    * By default, the data window for the baseline dataset is the full dataset. You can adjust the data window by using either the date range or the `trailing_days` parameter.

## Monitoring signals and metrics

Azure Machine Learning model monitoring (preview) supports the following list of monitoring signals and metrics:

|Monitoring signal | Description | Metrics | Model tasks (supported data format) | Target dataset | Baseline dataset |
|--|--|--|--|--|--|
| Data drift | Data drift tracks changes in the distribution of a model's input data by comparing it to the model's training data or recent past production data. | Jensen-Shannon Distance, Population Stability Index, Normalized Wasserstein Distance, Two-Sample Kolmogorov-Smirnov Test, Pearson's Chi-Squared Test | Classification (tabular data), Regression (tabular data) | Production data - model inputs | Recent past production data or training data |
| Prediction drift | Prediction drift tracks changes in the distribution of a model's prediction outputs by comparing it to validation or test labeled data or recent past production data. | Jensen-Shannon Distance, Population Stability Index, Normalized Wasserstein Distance, Chebyshev Distance, Two-Sample Kolmogorov-Smirnov Test, Pearson's Chi-Squared Test | Classification (tabular data), Regression (tabular data) | Production data - model outputs | Recent past production data or validation data |
| Data quality | Data quality tracks the data integrity of a model's input by comparing it to the model's training data or recent past production data. The data quality checks include checking for null values, type mismatch, or out-of-bounds of values. | Null value rate, data type error rate, out-of-bounds rate | Classification (tabular data), Regression (tabular data) | production data - model inputs | Recent past production data or training data |
| Feature attribution drift | Feature attribution drift tracks the importance or contributions of features to prediction outputs in production by comparing it to feature importance at training time | Normalized discounted cumulative gain | Classification (tabular data), Regression (tabular data) | Production data - model inputs & outputs (*see the following note*) | Training data (required) |

> [!NOTE]
> For 'feature attribution drift' signal (during Preview), the user must create a custom data asset of type 'uri_folder' that contains joined inputs and outputs (Model Data Collector can be leveraged). Additionally, 'target_column_name' is also a required field, which specifies the prediction column in your training dataset. 
  
## How model monitoring works in Azure Machine Learning

Azure Machine Learning acquires monitoring signals by performing statistical computations on production inference data and reference data. This reference data can include the model's training data or validation data, while the production inference data refers to the model's input and output data collected in production.

The following steps describe an example of the statistical computation used to acquire monitoring signals about data drift for a model that's in production.

* For a feature in the training data, calculate the statistical distribution of its values. This distribution is the baseline distribution.
* Calculate the statistical distribution of the feature's latest values that are seen in production.
* Compare the distribution of the feature's latest values in production against the baseline distribution by performing a statistical test or calculating a distance score.
* When the test statistic or the distance score between the two distributions exceeds a user-specified threshold, Azure Machine Learning identifies the anomaly and notifies the user.

### Enabling model monitoring

Take the following steps to enable model monitoring in Azure Machine Learning:

* **Enable production inference data collection.** If you deploy a model to an Azure Machine Learning online endpoint, you can enable production inference data collection by using Azure Machine Learning [Model Data Collection](concept-data-collection.md). However, if you deploy a model outside of Azure Machine Learning or to an Azure Machine Learning batch endpoint, you're responsible for collecting production inference data. You can then use this data for Azure Machine Learning model monitoring.
* **Set up model monitoring.** You can use SDK/CLI 2.0 or the studio UI to easily set up model monitoring. During the setup, you can specify your preferred monitoring signals and metrics and set the alert threshold for each metric.  
* **View and analyze model monitoring results.** Once model monitoring is set up, a monitoring job is scheduled to run at your specified frequency. Each run computes and evaluates metrics for all selected monitoring signals and triggers alert notifications when any specified threshold is exceeded. You can follow the link in the alert notification to your Azure Machine Learning workspace to view and analyze monitoring results.

## Recommended best practices for model monitoring

Each machine learning model and its use cases are unique. Therefore, model monitoring is unique for each situation. The following is a list of recommended best practices for model monitoring:
* **Start model monitoring as soon as your model is deployed to production.** 
* **Work with data scientists that are familiar with the model to set up model monitoring.** These data scientists have insight into the model and its use cases and are best positioned to recommend monitoring signals and metrics as well as set the right alert thresholds for each metric—to avoid alert fatigue.
* **Include multiple monitoring signals in your monitoring setup.** With multiple monitoring signals, you get both a broad view and granular view of monitoring. For example, you can combine both data drift and feature attribution drift signals to get an early warning about your model performance issue. With data drift cohort analysis signal, you can get a granular view about a certain data segment.
* **Use model training data as the baseline dataset.** For comparison based on the baseline dataset, Azure Machine Learning allows you to use the recent past production data or historical data (such as training data or validation data). For a meaningful comparison, we recommend that you use the training data as the comparison baseline for data drift and data quality. For prediction drift, use the validation data as the comparison baseline.
* **Specify the monitoring frequency based on how your production data will grow over time**. For example, if your production model has much traffic daily, and the daily data accumulation is sufficient for you to monitor, then you can set the monitoring frequency to daily. Otherwise, you can consider a weekly or monthly monitoring frequency, based on the growth of your production data over time.
* **Monitor the top N important features or a subset of features.** If you use training data as the comparison baseline, by default, Azure Machine Learning monitors data drift or data quality for the top 10 important features. For models that have a large number of features, consider monitoring a subset of those features to reduce computation cost and monitoring noise.

## Next steps

- [Perform continuous model monitoring in Azure Machine Learning](how-to-monitor-model-performance.md)
- [Model data collection](concept-data-collection.md)
- [Collect production inference data](how-to-collect-production-data.md)
