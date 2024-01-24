---
title: Monitoring models in production
titleSuffix: Azure Machine Learning
description: Monitor the performance of models deployed to production on Azure Machine Learning.
services: machine-learning
author: ahughes-msft
ms.author: alehughes
ms.service: machine-learning
ms.subservice: mlops
ms.reviewer: mopeakande
reviewer: msakande
ms.topic: conceptual
ms.date: 01/21/2024
ms.custom: devplatv2
---

# Model monitoring with Azure Machine Learning

In this article, you will learn about model monitoring in Azure Machine Learning, the signals and metrics you can monitor, and the recommended practices for using model monitoring.

Model monitoring is the last step in the machine learning end-to-end lifecycle. This step tracks model performance in production and aims to understand it from both data science and operational perspectives. Unlike traditional software systems, the behavior of machine learning systems is governed not just by rules specified in code, but also by model behavior learned from data. Data distribution changes, training-serving skew, data quality issues, shifts in environments, or consumer behavior changes can all cause models to become stale and their performance to degrade to the point that they fail to add business value or start to cause serious compliance issues in highly regulated environments.

To implement monitoring, Azure Machine Learning acquires monitoring signals through data analysis on streamed production inference data and reference data. The reference data can include historical training data, validation data, or ground truth data. Each monitoring signal has one or more metrics. Users can set thresholds for these metrics in order to receive alerts via Azure Machine Learning or Azure EventGrid about model or data anomalies. These alerts can prompt users to analyze or troubleshoot monitoring signals in Azure Machine Learning studio for continuous model quality improvement.

## Capabilities of model monitoring

Azure Machine Learning provides the following capabilities for continuous model monitoring:

* **Built-in monitoring signals**. Model monitoring provides built-in monitoring signals for tabular data. These monitoring signals include data drift, prediction drift, data quality, feature attribution drift, and model performance.  
* **Out-of-box model monitoring setup with Azure Machine Learning online endpoint**. If you deploy your model to production in an Azure Machine Learning online endpoint, Azure Machine Learning collects production inference data automatically and uses it for continuous monitoring.
* **Use of multiple monitoring signals for a broad view**. You can easily include several monitoring signals in one monitoring setup. For each monitoring signal, you can select your preferred metric(s) and fine-tune an alert threshold.
* **Use of recent past production data or training data as reference data for comparison**. For monitoring signals, Azure Machine Learning lets you set reference data using recent past production data or training data.
* **Monitoring of top N features for data drift or data quality**. If you use training data as the reference data, you can define data drift or data quality signals layering over feature importance.
* **Flexibility to define your monitoring signal**. If the built-in monitoring signals aren't suitable for your business scenario, you can define your own monitoring signal with a custom monitoring signal component.
* **Flexibility to use production inference data from any source**. If you deploy models outside of Azure Machine Learning, or if you deploy models to Azure Machine Learning batch endpoints, you can collect production inference data. You can then use the inference data in Azure Machine Learning for model monitoring.

### Customize lookback window size and offset

With Azure Machine Learning model monitoring, you can use smart defaults for your **lookback window size** and **lookback window offset**, or you can customize them to meet the needs of your scenario. 

The **lookback window size** is defined as the duration of time (in ISO 8601 format) for your production or reference data window looking back from the date of your monitoring run. For example, a **lookback window size** of 'P7D' (7 days) for a monitor running on 1/7 at 3:15pm UTC means that the monitor will use data from 1/1 at 3:15pm UTC to 1/7 at 3:15pm UTC. Both rolling windows and fixed windows are supported.

The **lookback window offset** is defined as the duration amount of time (in ISO 8601 format) to offset the end of your data window from the date of your monitoring run. For example, if your monitor is scheduled to run weekly on Mondays at 3:15pm UTC, but you don't want to use data from the weekend in your monitoring run, you can use a **lookback window size** of 'P5D' (5 days) and a **lookback window offset** of 'P2D' (2 days). Then, your data window will be Monday a week prior at 3:15pm UTC to Friday at 3:15pm UTC. The below diagram illustrates this scenario: 

Azure Machine Learning model monitoring provides the following configuration options for you to customize the **lookback window size** and **lookback window offset**: 

* **Customize lookback window size**. You have the flexibility to select a lookback window size for both the production data and the reference data. 
    * By default, the **lookback window size** for production data is your monitoring frequency. That is, all data collected in the past monitoring period before the monitoring job is run will be analyzed. You can use the `production_data.data_window.lookback_window_size` property to adjust the rolling data window for the production data, if needed.
    * By default, the data window for the reference data is the full dataset. You can adjust the reference **lookback window size** with the `reference_data.data_window.lookback_window_size` property. 
    * To specify a fixed data window, you can use the properties `reference_data.data_window.window_start_date` and `reference_data.data_window.window_end_date`.
* **Customize lookback window offset**. You have the flexibility to select a 
**lookback window offset** for your data window for both the production data and the reference data. You can use the offset for granular control over the data your monitor uses. The offset only applies to rolling data windows. 
    * By default, the offset for production data is 'P0D' (0 days). You can modify this offset with the `production_data.data_window.lookback_window_offset` property. 
    * By default, the offset for reference data is 2 times the `production_data.data_window.lookback_window_size`. This is to ensure there is enough reference data for statistically meaningful monitoring results. You can modify this offset with the `reference_data.data_window.lookback_window_offset` property. 

## Monitoring signals and metrics

Azure Machine Learning model monitoring supports the following list of monitoring signals and metrics:

> [!IMPORTANT]
> The **Feature Attribution Drift**, **Model Performance**, and **Generation Safety & Quality** signals are currently in public preview. These preview versions are provided without service-level agreements, and we don't recommend them for production workloads. Certain features might not be supported or might have constrained capabilities.
>
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

|Monitoring signal | Description | Metrics | Model tasks (supported data format) | Production data | Reference data |
|--|--|--|--|--|--|
| Data drift | Data drift tracks changes in the distribution of a model's input data by comparing it to the model's training data or recent past production data. | Jensen-Shannon Distance, Population Stability Index, Normalized Wasserstein Distance, Two-Sample Kolmogorov-Smirnov Test, Pearson's Chi-Squared Test | Classification (tabular data), Regression (tabular data) | Production data - model inputs | Recent past production data or training data |
| Prediction drift | Prediction drift tracks changes in the distribution of a model's prediction outputs by comparing it to validation or test labeled data or recent past production data. | Jensen-Shannon Distance, Population Stability Index, Normalized Wasserstein Distance, Chebyshev Distance, Two-Sample Kolmogorov-Smirnov Test, Pearson's Chi-Squared Test | Classification (tabular data), Regression (tabular data) | Production data - model outputs | Recent past production data or validation data |
| Data quality | Data quality tracks the data integrity of a model's input by comparing it to the model's training data or recent past production data. The data quality checks include checking for null values, type mismatch, or out-of-bounds of values. | Null value rate, data type error rate, out-of-bounds rate | Classification (tabular data), Regression (tabular data) | production data - model inputs | Recent past production data or training data |
| Feature attribution drift (preview) | Feature attribution drift tracks the contribution of features to predictions (also known as feature importance) during production by comparing it with feature importance during training.| Normalized discounted cumulative gain | Classification (tabular data), Regression (tabular data) | Production data - model inputs & outputs | Training data (required) |
| Model performance - Classification (preview) | Model performance tracks the objective performance of a model's output in production by comparing it to collected ground truth data. | Accuracy, Precision, Recall, F1 Score | Classification (tabular data) | Production data - model outputs | Ground truth data (required) |
| Model performance - Regression (preview) | Model performance tracks the objective performance of a model's output in production by comparing it to collected ground truth data. | Mean Absolute Error (MAE), Mean Squared Error (MSE), Root Mean Squared Error (RMSE) | Regression (tabular data) | Production data - model outputs | Ground truth data (required) |
|[Generative AI: Generation safety and quality](./prompt-flow/how-to-monitor-generative-ai-applications.md) (preview)|Evaluates generative AI applications for safety & quality using GPT-assisted metrics.| Groundedness, relevance, fluency, similarity, coherence| Question & Answering | prompt, completion, context, and annotation template |N/A|

## Data quality metrics details

The data quality monitoring signal tracks the data integrity of a model's input. It does so by calculating three metrics, as defined below: 

**Null value rate**: The rate of null values in the model's input for each feature. For example, if the monitoring production data window contains 100 rows and the value for a specific feature `temperature` is null for 10 of those rows, the **Null value rate** for `temperature` would be 10%. 
- Azure Machine Learning supports calculating the **Null value rate** for all feature data types. 

**Data type error rate**: The rate of data type differences between the current production data window and the reference data. Azure Machine Learning model monitoring will infer the data type for each feature from the reference data during each monitoring run. For example, if the type for a feature `temperature` is inferred to be IntegerType from the reference data, but in the production data window 10 out of 100 values for `temperature` are not IntegerType (perhaps they are strings, etc.), then the **Data type error rate** for `temperature` would be 10%. 
- Azure Machine Learning supports calculating the **Data type error rate** for the following list of data types (PySpark): ShortType, BooleanType, BinaryType, DoubleType, TimestampType, StringType, IntegerType, FloatType, ByteType, LongType, DateType
- If the data type for a feature is not contained in this list, Azure Machine Learning model monitoring will still run but will not compute the **Data type error rate** for that specific feature.

**Out-of-bounds rate**: The rate of values for each feature which fall outside of the appropriate range or set determined by the reference data. Azure Machine Learning model monitoring will determine the acceptable range or set for each feature from the reference data during each monitoring run. For numerical features, the appropriate range is a numerical interval of the mininum value in the reference dataset to the maximum value, such as [0, 100]. For categorical features, the appropriate range is a set of all values contained in the reference dataset, such as [`red`, `yellow`, `green`] for a feature `color`. For example, if you have a numerical feature `temperature` where all values fall within the range [37, 77] in the reference dataset, but in the production data window 10 out of 100 values for `temperature` fall outside of the range [37, 77], then the **Out-of-bounds** rate for `temperature` will be 10%. 
- Azure Machine Learning supports calculating the **Out-of-bounds rate** for the following list of data types (PySpark): StringType, IntegerType, DoubleType, ByteType, LongType, FloatType
- If the data type for a features is not contained in this list, Azure Machine Learning model monitoring will still run but will not compute the **Out-of-bounds rate** for that specific feature.

Azure Machine Learning model monitoring supports precision up to 0.00001 for these data quality metric calculations. 

## How model monitoring works in Azure Machine Learning

Azure Machine Learning acquires monitoring signals by performing statistical computations on production inference data and reference data. This reference data can include the model's training data, validation data, or ground truth data, while the production inference data refers to the model's input and output data collected in production.

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

## Integrate Azure Machine Learning model monitoring with Azure EventGrid

You can use events generated by Azure Machine Learning model monitoring runs to set up event driven applications, processes, or CI/CD workflows with [Azure EventGrid](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-use-event-grid?view=azureml-api-2). When drift, data quality issues, or model performance degredation is detected by your model monitor, you can track these events with Azure EventGrid and take action programmatically. For example, if the Accuracy of your classification model dips below a certain threshold in production, you can use Azure EventGrid to begin a re-training job using collected ground truth data. To learn how to integrate Azure Machine Learning with Azure EventGrid, see - [Perform continuous model monitoring in Azure Machine Learning](how-to-monitor-model-performance.md).

## Next steps

- [Perform continuous model monitoring in Azure Machine Learning](how-to-monitor-model-performance.md)
- [Model data collection](concept-data-collection.md)
- [Collect production inference data](how-to-collect-production-data.md)
- [Model monitoring for generative AI applications](./prompt-flow/how-to-monitor-generative-ai-applications.md)