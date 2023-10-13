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
ms.date: 09/15/2023
ms.custom: devplatv2
---

# Model monitoring with Azure Machine Learning (preview)

In this article, you learn about model monitoring in Azure Machine Learning, the signals and metrics you can monitor, and the recommended practices for using model monitoring.

[!INCLUDE [machine-learning-preview-generic-disclaimer](includes/machine-learning-preview-generic-disclaimer.md)]

Model monitoring is the last step in the machine learning end-to-end lifecycle. This step tracks model performance in production and aims to understand it from both data science and operational perspectives. Unlike traditional software systems, the behavior of machine learning systems is governed not just by rules specified in code, but also by model behavior learned from data. Data distribution changes, training-serving skew, data quality issues, shift in environment, or consumer behavior changes can all cause models to become stale and their performance to degrade to the point that they fail to add business value or start to cause serious compliance issues in highly regulated environments.

To implement monitoring, Azure Machine Learning acquires monitoring signals through data analysis on streamed production inference data and reference data. The reference data can include historical training data, validation data, or ground truth data. Each monitoring signal has one or more metrics. Users can set thresholds for these metrics in order to receive alerts via Azure Machine Learning or Azure Monitor about model or data anomalies. These alerts can prompt users to analyze or troubleshoot monitoring signals in Azure Machine Learning studio for continuous model quality improvement.

## Capabilities of model monitoring

Azure Machine Learning provides the following capabilities for continuous model monitoring:

* **Built-in monitoring signals**. Model monitoring provides built-in monitoring signals for tabular data. These monitoring signals include data drift, prediction drift, data quality, and feature attribution drift.
* **Out-of-box model monitoring setup with Azure Machine Learning online endpoint**. If you deploy your model to production in an Azure Machine Learning online endpoint, Azure Machine Learning collects production inference data automatically and uses it for continuous monitoring.
* **Use of multiple monitoring signals for a broad view**. You can easily include several monitoring signals in one monitoring setup. For each monitoring signal, you can select your preferred metric(s) and fine-tune an alert threshold.
* **Use of recent past production data or training data as reference data for comparison**. For monitoring signals, Azure Machine Learning lets you set reference data using recent past production data or training data.
* **Monitoring of top N features for data drift or data quality**. If you use training data as the reference data, you can define data drift or data quality signals layering over feature importance.
* **Flexibility to define your monitoring signal**. If the built-in monitoring signals aren't suitable for your business scenario, you can define your own monitoring signal with a custom monitoring signal component.
* **Flexibility to use production inference data from any source**. If you deploy models outside of Azure Machine Learning, or if you deploy models to Azure Machine Learning batch endpoints, you can collect production inference data. You can then use the inference data in Azure Machine Learning for model monitoring.
* **Flexibility to select data window**. You have the flexibility to select a data window for both the production data and the reference data.
    * By default, the data window for production data is your monitoring frequency. That is, all data collected in the past monitoring period before the monitoring job is run will be analyzed. You can use the `production_data.data_window_size` property to adjust the data window for the production data, if needed.
    * By default, the data window for the reference data is the full dataset. You can adjust the reference data window with the `reference_data.data_window` property. Both rolling data window and fixed data window are supported.

## Monitoring signals and metrics

Azure Machine Learning model monitoring (preview) supports the following list of monitoring signals and metrics:


|Monitoring signal | Description | Metrics | Model tasks (supported data format) | Production data | Reference data |
|--|--|--|--|--|--|
| Data drift | Data drift tracks changes in the distribution of a model's input data by comparing it to the model's training data or recent past production data. | Jensen-Shannon Distance, Population Stability Index, Normalized Wasserstein Distance, Two-Sample Kolmogorov-Smirnov Test, Pearson's Chi-Squared Test | Classification (tabular data), Regression (tabular data) | Production data - model inputs | Recent past production data or training data |
| Prediction drift | Prediction drift tracks changes in the distribution of a model's prediction outputs by comparing it to validation or test labeled data or recent past production data. | Jensen-Shannon Distance, Population Stability Index, Normalized Wasserstein Distance, Chebyshev Distance, Two-Sample Kolmogorov-Smirnov Test, Pearson's Chi-Squared Test | Classification (tabular data), Regression (tabular data) | Production data - model outputs | Recent past production data or validation data |
| Data quality | Data quality tracks the data integrity of a model's input by comparing it to the model's training data or recent past production data. The data quality checks include checking for null values, type mismatch, or out-of-bounds of values. | Null value rate, data type error rate, out-of-bounds rate | Classification (tabular data), Regression (tabular data) | production data - model inputs | Recent past production data or training data |
| Feature attribution drift | Feature attribution drift tracks the contribution of features to predictions (also known as feature importance) during production by comparing it with feature importance during training.| Normalized discounted cumulative gain | Classification (tabular data), Regression (tabular data) | Production data - model inputs & outputs | Training data (required) |
|[Generative AI: Generation safety and quality](./prompt-flow/how-to-monitor-generative-ai-applications.md)|Evaluates generative AI applications for safety & quality using GPT-assisted metrics.| Groundedness, relevance, fluency, similarity, coherence|text_question_answering| prompt, completion, context, and annotation template |N/A|


  
## How model monitoring works in Azure Machine Learning

Azure Machine Learning acquires monitoring signals by performing statistical computations on production inference data and reference data. This reference data can include the model's training data or validation data, while the production inference data refers to the model's input and output data collected in production.

The following steps describe an example of the statistical computation used to acquire a data drift signal for a model that's in production.

* For a feature in the training data, calculate the statistical distribution of its values. This distribution is the baseline distribution.
* Calculate the statistical distribution of the feature's latest values that are seen in production.
* Compare the distribution of the feature's latest values in production against the baseline distribution by performing a statistical test or calculating a distance score.
* When the test statistic or the distance score between the two distributions exceeds a user-specified threshold, Azure Machine Learning identifies the anomaly and notifies the user.

### Enabling model monitoring

Take the following steps to enable model monitoring in Azure Machine Learning:

* **Enable production inference data collection.** If you deploy a model to an Azure Machine Learning online endpoint, you can enable production inference data collection by using Azure Machine Learning [Model Data Collection](concept-data-collection.md). However, if you deploy a model outside of Azure Machine Learning or to an Azure Machine Learning batch endpoint, you're responsible for collecting production inference data. You can then use this data for Azure Machine Learning model monitoring.
* **Set up model monitoring.** You can use SDK/CLI 2.0 or the studio UI to easily set up model monitoring. During the setup, you can specify your preferred monitoring signals and customize metrics and thresholds for each signal.  
* **View and analyze model monitoring results.** Once model monitoring is set up, a monitoring job is scheduled to run at your specified frequency. Each run computes and evaluates metrics for all selected monitoring signals and triggers alert notifications when any specified threshold is exceeded. You can follow the link in the alert notification to your Azure Machine Learning workspace to view and analyze monitoring results.

## Recommended best practices for model monitoring

Each machine learning model and its use cases are unique. Therefore, model monitoring is unique for each situation. The following is a list of recommended best practices for model monitoring:
* **Start model monitoring as soon as your model is deployed to production.** 
* **Work with data scientists that are familiar with the model to set up model monitoring.** Data scientists who have insight into the model and its use cases are in the best position to recommend monitoring signals and metrics as well as set the right alert thresholds for each metric (to avoid alert fatigue).
* **Include multiple monitoring signals in your monitoring setup.** With multiple monitoring signals, you get both a broad view and granular view of monitoring. For example, you can combine both data drift and feature attribution drift signals to get an early warning about your model performance issue.
* **Use model training data as the reference data.** For reference data used as the comparison baseline, Azure Machine Learning allows you to use the recent past production data or historical data (such as training data or validation data). For a meaningful comparison, we recommend that you use the training data as the comparison baseline for data drift and data quality. For prediction drift, use the validation data as the comparison baseline.
* **Specify the monitoring frequency based on how your production data will grow over time**. For example, if your production model has much traffic daily, and the daily data accumulation is sufficient for you to monitor, then you can set the monitoring frequency to daily. Otherwise, you can consider a weekly or monthly monitoring frequency, based on the growth of your production data over time.
* **Monitor the top N important features or a subset of features.** If you use training data as the comparison baseline, you can easily configure data drift monitoring or data quality monitoring for the top N features. For models that have a large number of features, consider monitoring a subset of those features to reduce computation cost and monitoring noise.

## Next steps

- [Perform continuous model monitoring in Azure Machine Learning](how-to-monitor-model-performance.md)
- [Model data collection](concept-data-collection.md)
- [Collect production inference data](how-to-collect-production-data.md)
- [Model monitoring for generative AI applications](./prompt-flow/how-to-monitor-generative-ai-applications.md)