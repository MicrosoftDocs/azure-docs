---
title: Monitor models in production (preview)
titleSuffix: Azure Machine Learning
description: Monitor the performance of models deployed to production on Azure Machine Learning.
services: machine-learning
author: Bozhong68
ms.author: bozhlin
ms.service: machine-learning
ms.subservice: mlops
ms.reviewer: mopeakande
reviewer: msakande
ms.topic: concept-article 
ms.date: 05/03/2023
ms.custom: devplatv2, event-tier1-build-2023
---

# Model monitoring with Azure Machine Learning (preview)

Model monitoring is the last step in the machine learning end-to-end lifecycle. This step tracks and aims to understand model performance in production from both data science and operational perspectives. Unlike traditional software systems, the behavior of ML systems is governed not just by rules specified in code, but also by model behavior learned from data. Data distribution changes, training-serving skew, data quality issues, shift in enviroment or consumer behavior changes can all cause model performance degradation or models becoming stale that stops adding business value or brings serious compliance issues in highly regulated environments.

Azure Machine Learning model monitoring solution acquires monitoring signals through data analyis on streamed production inference data and reference data such as historical training data, validation data, or ground truth data. Each montioring signal has one or more metrics, and user can set threshold for those metrics to alert model or data anomoly issues via Azure Machine Learning or Azure Monitor, which prompts user to analyze/troubleshoot monitoring signals in Azure Machine Learning studio UI for continuous model quality improvement.

## Monitoring signals and metrics

Azure Machine Learning model monitoring (preview) supports the following list of monitoring signals and metrics:

|Monitoring signal | Description | Metrics | Supported data format model tasks | Target dataset | Baseline dataset |
|--|--|--|--|--|--|
| Data Drift | Data drift tracks model input data distribution change by comparing it to model training data or recent past production data | Jensen-Shannon Distance, Population Stability Index, Normalized Wasserstein Distance, Two-Sample Kolmogorov-Smirnov Test, Pearson's Chi-Squared Test | tabular classification, tabular regression | production data - model inputs | recent past production data or training data |
| Prediction Drift | Prediction drift tracks prediction results data distribution change by comparing it to validation/test label data or recent past production data | Jensen-Shannon Distance, Population Stability Index, Normalized Wasserstein Distance, Chebyshev Distance, Two-Sample Kolmogorov-Smirnov Test, Pearson's Chi-Squared Test | tabular classification, tabular regression | Production data - model outputs | recent past production data or validation data |
| Data Quality | Data quality tracks model input data integrity by comparing to model training data or recent past production data, such as null value checking, type mismatch, or out of bound of value checking | null value rate, type error rate, out-of-bound rate | tabular classification, tabular regression | production data - model inputs | recent past production data or training data |
| Feature Attribution Drift | Feature attribution drfit tracks feature importance change in production by comparing it to feature importance at training time | normalized discounted cumulative gain | tabular classification, tabular regression | production data | training data |

## How it works

Azure Machine Learning acquires monitoring signals by performing statistical computaton on production inference data and reference data such as model training data or validation data. The production inference data refers to model inputs and model outputs data collected in production. The following is one example of statiscal computation process for acquiring monitoring signal about data drift in production model:
* Calculate the baseline statical distribution of the feature's values in training data.
* Calculate the statical distribution of the latest feature's values seen in production.
* Compare the distribution of the latest feature's values in production against the baseline distribution by calculating a distance score or by performing a statistical test.
* When the distance score between two statistical distributions or the statical test exceeds the threshold specified by user, model monitoring identifies the anomaly and notifies user.

To enable Azure Machine Learning model monitoring, you can take the following steps:

* **Production inference data collection.** If you deploy model as Azure Machine Learning online endpoint, you can enable production inference data collection using Azure Machine Learning Model Data Collection. If you deploy model az Azure Machine Learning batch endpoint or deploy model outside of Azure Machine Learning, you are responsible for production inference data collection and then use it for Azure Machine Learning model monitoring.
* **Setup model monitoring.** You can use SDK/CLI 2.0 or Studio UI to easily setup model monitoring. In the process of model monitoring setup, you can select your preferred monitoring signals and metrics, and set threshold for each metric for alerting.  
* **View and analyze model monitoring result.** Once model monitoring is setup, monitoring job is scheduled to run at your specified frequency. Each run will compute and evaluate metrics for all selected monitoring signals, and trigger alert notification when any specified threshold is exceeded. With this automatic alert notification, you can follow link easily to Azure Machine Learning workspace to view and analyze monitoring results.   

## Recommended best practices

Each ML model and it use cases are unique, and each model monitoring requires specific considersation for that unique situation. Base on customer experience and our learning, we recommend following best practices for model monitoring:
* **Start model monitoring as soon as model is put in production.** 
* **Engage your data scientists who are familiar with the model for model monitoring setup.** Data scientists who have insight about the model and use cases are in the best position to recommend monitoring signals and metrics, and set proper alerting threshold for each metric to avoid alert fatigue. 
* **Include multiple monitoring signals in your monitoring setup.** With multiple monitoring signals, you get a broadview monitoring as well as granular point of view at the same time. For example, combining both data drift and feature attribute drift signals, you will get an early warning about your model performance issue; with data drift cohort analysis signal, you get a granualar point of view about certain data segment.
* **Use model training data as baseline dataset.** For comparison baseline dataset, Azure Machine Learning supports choices of recent past production data or historical data such as training data or valiation data. For a meaningful comparison, we recommend training data as comparison baseline for data drift, validation data as comparison baseline for prediction drift, and training data as comparison baseline for data quality.
* **Monitoring frequency.** You can select monitoring fequency based on how your production data size will grow over time. For example, if your production model has a lot of traffic each day, and the daily data accumulation is sufficient for you to monitor, then you can setup daily monitoring frequency. Otherwise, you can consider weekly or monthly monitoring frequency based on your production data size growth over time.   
* **Monitor top n feature importance or a subset of features.** If you use training data as comparison baseline, by default Azure Machine Learning will monitor data drift or data quality for top 10 important features. Some models might have large number of features, and you may want to monitor a subset of features only to reduce computation cost and monitoring noise.

## Next steps

- [Perform continuous model monitoring in Azure Machine Learning](how-to-monitor-model-performance.md)


### Other resources

- [Model data collection](concept-data-collection.md)
- [Collect production inference data](how-to-collect-inference-data.md)


### Examples

All Azure Machine Learning examples can be found in [https://github.com/Azure/azureml-examples.git](https://github.com/Azure/azureml-examples).

For Azure Machine Learning model monitoring examples:
* Explore out-of-box model monitoring example with Azure Machine Learning online endpoint 
* Explore advanced model monitoring setup with training data as comparison baseline