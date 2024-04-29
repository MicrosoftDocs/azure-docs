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
ms.date: 01/29/2024
ms.custom: devplatv2
---

# Model monitoring with Azure Machine Learning

In this article, you learn about model monitoring in Azure Machine Learning, the signals and metrics you can monitor, and the recommended practices for using model monitoring.

## The case for model monitoring

Model monitoring is the last step in the machine learning end-to-end lifecycle. This step tracks model performance in production and aims to understand the performance from both data science and operational perspectives. 

Unlike traditional software systems, the behavior of machine learning systems is governed not just by rules specified in code, but also by model behavior learned from data. Therefore, data distribution changes, training-serving skew, data quality issues, shifts in environments, or consumer behavior changes can all cause a model to become stale. When a model becomes stale, its performance can degrade to the point that it fails to add business value or starts to cause serious compliance issues in highly regulated environments.

## Limitations of model monitoring in Azure Machine Learning

Azure Machine Learning model monitoring supports only the use of credential-based authentication (e.g., SAS token) to access data contained in datastores. To learn more about datastores and authentication modes, see [Data administration](how-to-administrate-data-authentication.md).

## How model monitoring works in Azure Machine Learning

To implement monitoring, Azure Machine Learning acquires monitoring signals by performing statistical computations on streamed production inference data and reference data. The reference data can be historical training data, validation data, or ground truth data. On the other hand, the production inference data refers to the model's input and output data collected in production. 

Each monitoring signal has one or more metrics. Users can set thresholds for these metrics in order to receive alerts via Azure Machine Learning or Azure Event Grid about model or data anomalies. These alerts can prompt users to analyze or troubleshoot monitoring signals in Azure Machine Learning studio for continuous model quality improvement.

The following steps describe an example of the statistical computation used to acquire a built-in monitoring signal, such as data drift, for a model that's in production.

* For a feature in the training data, calculate the statistical distribution of its values. This distribution is the baseline distribution for the feature.
* Calculate the statistical distribution of the feature's latest values that are seen in production.
* Compare the distribution of the feature's latest values in production with the baseline distribution by performing a statistical test or calculating a distance score.
* When the test statistic or the distance score between the two distributions exceeds a user-specified threshold, Azure Machine Learning identifies the anomaly and notifies the user.

### Model monitoring setup

To enable and use model monitoring in Azure Machine Learning:

1. **Enable production inference data collection.** If you deploy a model to an Azure Machine Learning online endpoint, you can enable production inference data collection by using Azure Machine Learning [model data collection](concept-data-collection.md). However, if you deploy a model outside of Azure Machine Learning or to an Azure Machine Learning batch endpoint, you're responsible for collecting production inference data. You can then use this data for Azure Machine Learning model monitoring.
1. **Set up model monitoring.** You can use Azure Machine Learning SDK/CLI 2.0 or the studio UI to easily set up model monitoring. During the setup, you can specify your preferred monitoring signals and customize metrics and thresholds for each signal.  
1. **View and analyze model monitoring results.** Once model monitoring is set up, Azure Machine Learning schedules a monitoring job to run at your specified frequency. Each run computes and evaluates metrics for all selected monitoring signals and triggers alert notifications when any specified threshold is exceeded. You can follow the link in the alert notification to view and analyze monitoring results in your Azure Machine Learning workspace.

## Capabilities of model monitoring

Azure Machine Learning provides the following capabilities for continuous model monitoring:

* **Built-in monitoring signals**. Model monitoring provides built-in monitoring signals for tabular data. These monitoring signals include data drift, prediction drift, data quality, feature attribution drift, and model performance.  
* **Out-of-box model monitoring setup with Azure Machine Learning online endpoint**. If you deploy your model to production in an Azure Machine Learning online endpoint, Azure Machine Learning collects production inference data automatically and uses it for continuous monitoring.
* **Use of multiple monitoring signals for a broad view**. You can easily include several monitoring signals in one monitoring setup. For each monitoring signal, you can select your preferred metric(s) and fine-tune an alert threshold.
* **Use of training data or recent, past production data as reference data for comparison**. For monitoring signals, Azure Machine Learning lets you set reference data using training data or recent, past production data.
* **Monitoring of top N features for data drift or data quality**. If you use training data as the reference data, you can define data drift or data quality signals layered over feature importance.
* **Flexibility to define your monitoring signal**. If the built-in monitoring signals aren't suitable for your business scenario, you can define your own monitoring signal with a custom monitoring signal component.
* **Flexibility to use production inference data from any source**. If you deploy models outside of Azure Machine Learning, or if you deploy models to Azure Machine Learning batch endpoints, you can collect production inference data to use in Azure Machine Learning for model monitoring.

## Lookback window size and offset

The **lookback window size** is the duration of time (in ISO 8601 format) for your production or reference data window, looking back from the date of your monitoring run.

The **lookback window offset** is the duration of time (in ISO 8601 format) to offset the end of your data window from the date of your monitoring run.

For example, suppose your model is in production and you have a monitor set to run on January 31 at 3:15pm UTC, if you set a production lookback window size of `P7D` (seven days) for the monitor and a production lookback window offset of `P0D` (zero days), the monitor uses data from January 24 at 3:15pm UTC up until January 31 at 3:15pm UTC (the time your monitor runs) in the data window.

Furthermore, for the reference data, if you set the lookback window offset to `P7D` (seven days), the reference data window ends right before the production data window starts, so that there's no overlap. You can then set your reference data lookback window size to be as large as you like. For example, by setting the reference data lookback window size to `P24D` (24 days), the reference data window includes data from January 1 at 3:15pm UTC up until January 24 at 3:15pm UTC. The following figure illustrates this example.

:::image type="content" source="media/how-to-monitor-models/monitoring-period.png" alt-text="A diagram showing the lookback window size and offset for reference and production data." lightbox="media/how-to-monitor-models/monitoring-period.png"::: 

In some cases, you might find it useful to set the _lookback window offset_ for your production data to a number greater than zero days. For example, if your monitor is scheduled to run weekly on Mondays at 3:15pm UTC, but you don't want to use data from the weekend in your monitoring run, you can use a _lookback window size_ of `P5D` (five days) and a _lookback window offset_ of `P2D` (two days). Then, your data window starts on the prior Monday at 3:15pm UTC and ends on Friday at 3:15pm UTC.

In practice, you should ensure that the reference data window and the production data window don't overlap. As shown in the following figure, you can ensure non-overlapping windows by making sure that the reference data lookback window offset (`P10D` or 10 days, in this example) is greater or equal to the sum of the production data's lookback window size and its lookback window offset (seven days total).

:::image type="content" source="media/how-to-monitor-models/lookback-overlap.png" alt-text="A diagram showing non-overlapping reference data and production data windows." lightbox="media/how-to-monitor-models/lookback-overlap.png":::

With Azure Machine Learning model monitoring, you can use smart defaults for your lookback window size and lookback window offset, or you can customize them to meet your needs. Also, both rolling windows and fixed windows are supported.

### Customize lookback window size

You have the flexibility to select a lookback window size for both the production data and the reference data.

* By default, the lookback window size for production data is your monitoring frequency. That is, all data collected in the monitoring period before the monitoring job is run will be analyzed. You can use the `production_data.data_window.lookback_window_size` property to adjust the rolling data window for the production data.

* By default, the lookback window for the reference data is the full dataset. You can use the `reference_data.data_window.lookback_window_size` property to adjust the reference lookback window size.

* To specify a fixed data window for the reference data, you can use the properties `reference_data.data_window.window_start_date` and `reference_data.data_window.window_end_date`.

### Customize lookback window offset

You have the flexibility to select a lookback window offset for your data window for both the production data and the reference data. You can use the offset for granular control over the data your monitor uses. The offset only applies to rolling data windows.

* By default, the offset for production data is `P0D` (zero days). You can modify this offset with the `production_data.data_window.lookback_window_offset` property.

* By default, the offset for reference data is twice the `production_data.data_window.lookback_window_size`. This setting ensures that there's enough reference data for statistically meaningful monitoring results. You can modify this offset with the `reference_data.data_window.lookback_window_offset` property.

## Monitoring signals and metrics

Azure Machine Learning model monitoring supports the following list of monitoring signals and metrics:

[!INCLUDE [machine-learning-preview-items-disclaimer](includes/machine-learning-preview-items-disclaimer.md)]


|Monitoring signal | Description | Metrics | Model tasks (supported data format) | Production data | Reference data |
|--|--|--|--|--|--|
| Data drift | Data drift tracks changes in the distribution of a model's input data by comparing the distribution to the model's training data or recent, past production data. | Jensen-Shannon Distance, Population Stability Index, Normalized Wasserstein Distance, Two-Sample Kolmogorov-Smirnov Test, Pearson's Chi-Squared Test | Classification (tabular data), Regression (tabular data) | Production data - model inputs | Recent past production data or training data |
| Prediction drift | Prediction drift tracks changes in the distribution of a model's predicted outputs, by comparing the distribution to validation data, labeled test data, or recent past production data. | Jensen-Shannon Distance, Population Stability Index, Normalized Wasserstein Distance, Chebyshev Distance, Two-Sample Kolmogorov-Smirnov Test, Pearson's Chi-Squared Test | Classification (tabular data), Regression (tabular data) | Production data - model outputs | Recent past production data or validation data |
| Data quality | Data quality tracks the data integrity of a model's input by comparing it to the model's training data or recent, past production data. The data quality checks include checking for null values, type mismatch, or out-of-bounds values. | Null value rate, data type error rate, out-of-bounds rate | Classification (tabular data), Regression (tabular data) | production data - model inputs | Recent past production data or training data |
| Feature attribution drift (preview) | Feature attribution drift is based on the contribution of features to predictions (also known as feature importance). Feature attribution drift tracks feature importance during production by comparing it with feature importance during training.| Normalized discounted cumulative gain | Classification (tabular data), Regression (tabular data) | Production data - model inputs & outputs | Training data (required) |
| Model performance - Classification (preview) | Model performance tracks the objective performance of a model's output in production by comparing it to collected ground truth data. | Accuracy, Precision, and Recall | Classification (tabular data) | Production data - model outputs | Ground truth data (required) |
| Model performance - Regression (preview) | Model performance tracks the objective performance of a model's output in production by comparing it to collected ground truth data. | Mean Absolute Error (MAE), Mean Squared Error (MSE), Root Mean Squared Error (RMSE) | Regression (tabular data) | Production data - model outputs | Ground truth data (required) |
|[Generative AI: Generation safety and quality](./prompt-flow/how-to-monitor-generative-ai-applications.md) (preview)|Evaluates generative AI applications for safety and quality, using GPT-assisted metrics.| Groundedness, relevance, fluency, similarity, coherence| Question & Answering | prompt, completion, context, and annotation template |N/A|

### Metrics for the data quality monitoring signal

The data quality monitoring signal tracks the integrity of a model's input data by calculating the three metrics:

- Null value rate
- Data type error rate
- Out-of-bounds rate


#### Null value rate

The _null value rate_ is the rate of null values in the model's input for each feature. For example, if the monitoring production data window contains 100 rows and the value for a specific feature `temperature` is null for 10 of those rows, the null value rate for `temperature` is 10%.

- Azure Machine Learning supports calculating the **Null value rate** for all feature data types. 

#### Data type error rate

The _data type error rate_ is the rate of data type differences between the current production data window and the reference data. During each monitoring run, Azure Machine Learning model monitoring infers the data type for each feature from the reference data. For example, if the data type for a feature `temperature` is inferred to be `IntegerType` from the reference data, but in the production data window, 10 out of 100 values for `temperature` aren't IntegerType (perhaps they're strings), then the data type error rate for `temperature` is  10%. 

- Azure Machine Learning supports calculating the data type error rate for the following data types that are available in PySpark: `ShortType`, `BooleanType`, `BinaryType`, `DoubleType`, `TimestampType`, `StringType`, `IntegerType`, `FloatType`, `ByteType`, `LongType`, and `DateType`.
- If the data type for a feature isn't contained in this list, Azure Machine Learning model monitoring still runs but won't compute the data type error rate for that specific feature.

#### Out-of-bounds rate

The _out-of-bounds rate_ is the rate of values for each feature, which fall outside of the appropriate range or set determined by the reference data. During each monitoring run, Azure Machine Learning model monitoring determines the acceptable range or set for each feature from the reference data.

- For a numerical feature, the appropriate range is a numerical interval of the minimum value in the reference dataset to the maximum value, such as [0, 100].
- For a categorical feature, such as `color`, the appropriate range is a set of all values contained in the reference dataset, such as [`red`, `yellow`, `green`].

For example, if you have a numerical feature `temperature` where all values fall within the range [37, 77] in the reference dataset, but in the production data window, 10 out of 100 values for `temperature` fall outside of the range [37, 77], then the out-of-bounds rate for `temperature` is 10%.

- Azure Machine Learning supports calculating the out-of-bounds rate for these data types that are available in PySpark: `StringType`, `IntegerType`, `DoubleType`, `ByteType`, `LongType`, and `FloatType`.
- If the data type for a feature isn't contained in this list, Azure Machine Learning model monitoring still runs but won't compute the out-of-bounds rate for that specific feature.

Azure Machine Learning model monitoring supports up to 0.00001 precision for calculations of the null value rate, data type error rate, and out-of-bounds rate.

## Recommended best practices for model monitoring

Each machine learning model and its use cases are unique. Therefore, model monitoring is unique for each situation. The following is a list of recommended best practices for model monitoring:
* **Start model monitoring immediately after you deploy a model to production.** 
* **Work with data scientists that are familiar with the model to set up model monitoring.** Data scientists who have insight into the model and its use cases are in the best position to recommend monitoring signals and metrics and set the right alert thresholds for each metric (to avoid alert fatigue).
* **Include multiple monitoring signals in your monitoring setup.** With multiple monitoring signals, you get both a broad view and granular view of monitoring. For example, you can combine data drift and feature attribution drift signals to get an early warning about your model performance issues.
* **Use model training data as the reference data.** For reference data used as the comparison baseline, Azure Machine Learning allows you to use the recent past production data or historical data (such as training data or validation data). For a meaningful comparison, we recommend that you use the training data as the comparison baseline for data drift and data quality. For prediction drift, use the validation data as the comparison baseline.
* **Specify the monitoring frequency, based on how your production data will grow over time**. For example, if your production model has much traffic daily, and the daily data accumulation is sufficient for you to monitor, then you can set the monitoring frequency to daily. Otherwise, you can consider a weekly or monthly monitoring frequency, based on the growth of your production data over time.
* **Monitor the top N important features or a subset of features.** If you use training data as the comparison baseline, you can easily configure data drift monitoring or data quality monitoring for the top N features. For models that have a large number of features, consider monitoring a subset of those features to reduce computation cost and monitoring noise.
* **Use the model performance signal when you have access to ground truth data.** If you have access to ground truth data (also known as actuals) based on the particulars of your machine learning application, we recommended that you use the model performance signal to compare the ground truth data to your model's output. This comparison provides an objective view into the performance of your model in production.

## Model monitoring integration with Azure Event Grid

You can use events generated by Azure Machine Learning model monitoring runs to set up event-driven applications, processes, or CI/CD workflows with [Azure Event Grid](how-to-use-event-grid.md).

When your model monitor detects drift, data quality issues, or model performance degradation, you can track these events with Event Grid and take action programmatically. For example, if the accuracy of your classification model in production dips below a certain threshold, you can use Event Grid to begin a retraining job that uses collected ground truth data. To learn how to integrate Azure Machine Learning with Event Grid, see [Perform continuous model monitoring in Azure Machine Learning](how-to-monitor-model-performance.md).

## Related content

- [Model data collection](concept-data-collection.md)
- [Collect production inference data](how-to-collect-production-data.md)
- [Model monitoring for generative AI applications](./prompt-flow/how-to-monitor-generative-ai-applications.md)