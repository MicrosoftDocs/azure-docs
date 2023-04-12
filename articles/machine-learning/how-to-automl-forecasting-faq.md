---
title: Frequently asked questions about forecasting in AutoML 
titleSuffix: Azure Machine Learning
description: Read answers to frequently asked questions about forecasting in AutoML
services: machine-learning
author: samgos93
ms.author: sagoswami
ms.reviewer: ssalgado 
ms.service: machine-learning
ms.subservice: automl
ms.topic: faq
ms.custom: contperf-fy21q1, automl, FY21Q4-aml-seo-hack, sdkv2, event-tier1-build-2022
ms.date: 01/27/2023
---

# Frequently asked questions about forecasting in AutoML

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

This article answers common questions about forecasting in AutoML. See the [methods overview article](./concept-automl-forecasting-methods.md) for more general information about forecasting methodology in AutoML. Instructions and examples for training forecasting models in AutoML can be found in our [set up AutoML for time series forecasting](./how-to-auto-train-forecast.md) article.

## How do I start building forecasting models in AutoML?
You can start by reading our guide on [setting up AutoML to train a time-series forecasting model with Python](./how-to-auto-train-forecast.md). We've also provided hands-on examples in several Jupyter notebooks:  
1. [Bike share example](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/automl-standalone-jobs/automl-forecasting-task-bike-share/auto-ml-forecasting-bike-share.ipynb)
2. [Forecasting using deep learning](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/automl-standalone-jobs/automl-forecasting-github-dau/auto-ml-forecasting-github-dau.ipynb)
3. [Many models](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-many-models/auto-ml-forecasting-many-models.ipynb) 
4. [Forecasting Recipes](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-recipes-univariate/auto-ml-forecasting-univariate-recipe-experiment-settings.ipynb)
5. [Advanced forecasting scenarios](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-forecast-function/auto-ml-forecasting-function.ipynb)

## Why is AutoML slow on my data?

We're always working to make it faster and more scalable! To work as a general forecasting platform, AutoML does extensive data validations, complex feature engineering, and searches over a large model space. This complexity can require a lot of time, depending on the data and the configuration. 

One common source of slow runtime is training AutoML with default settings on data containing numerous time series. The cost of many forecasting methods scales with the number of series. For example, methods like Exponential Smoothing and Prophet [train a model for each time series](./concept-automl-forecasting-methods.md#model-grouping) in the training data. **The Many Models feature of AutoML scales to these scenarios** by distributing training jobs across a compute cluster and has been successfully applied to data with millions of time series. For more information, see the [forecasting at scale](./how-to-auto-train-forecast.md#forecasting-at-scale) article. You can also read about [the success of Many Models](https://techcommunity.microsoft.com/t5/ai-machine-learning-blog/automated-machine-learning-on-the-m5-forecasting-competition/ba-p/2933391) on a high-profile competition data set.

## How can I make AutoML faster?
See the ["why is AutoML slow on my data"](#why-is-automl-slow-on-my-data) answer to understand why it may be slow in your case.
Consider the following configuration changes that may speed up your job:
- [Block time series models](./how-to-auto-train-forecast.md#model-search-settings) like ARIMA and Prophet
- Turn off look-back features like lags and rolling windows
- Reduce 
  - number of trials/iterations
  - trial/iteration timeout
  - experiment timeout
  - number of cross validation folds.
- Ensure that early termination is enabled.
  
## What modeling configuration should I use?

There are four basic configurations supported by AutoML forecasting:

|Configuration|Scenario|Pros|Cons|
|--|--|--|--|
|**Default AutoML**|Recommended if the dataset has a small number of time series that have roughly similar historic behavior.|- Simple to configure from code/SDK or Azure Machine Learning studio <br><br> - AutoML has the chance to cross-learn across different time series since the regression models pool all series together in training. See the [model grouping](./concept-automl-forecasting-methods.md#model-grouping) section for more information.|- Regression models may be less accurate if the time series in the training data have divergent behavior <br> <br> - Time series models may take a long time to train if there are a large number of series in the training data. See the ["why is AutoML slow on my data"](#why-is-automl-slow-on-my-data) answer for more information.|
|**AutoML with deep learning**|Recommended for datasets with more than 1000 observations and, potentially, numerous time series exhibiting complex patterns. When enabled, AutoML will sweep over [temporal convolutional neural network (TCN) models](./concept-automl-forecasting-deep-learning.md#introduction-to-tcnforecaster) during training. See the [enable deep learning](./how-to-auto-train-forecast.md#enable-deep-learning) section for more information.|- Simple to configure from code/SDK or Azure Machine Learning studio <br> <br> - Cross-learning opportunities since the TCN pools data over all series <br> <br> - Potentially higher accuracy due to the large capacity of DNN models. See the [forecasting models in AutoML](./concept-automl-forecasting-methods.md#forecasting-models-in-automl) section for more information.|- Training can take much longer due to the complexity of DNN models <br> <br> - Series with small amounts of history are unlikely to benefit from these models.|
|**Many Models**|Recommended if you need to train and manage a large number of forecasting models in a scalable way. See the [forecasting at scale](./how-to-auto-train-forecast.md#forecasting-at-scale) section for more information.|- Scalable <br> <br> - Potentially higher accuracy when time series have divergent behavior from one another.|- No cross-learning across time series <br> <br> - You can't configure or launch Many Models jobs from Azure Machine Learning studio, only the code/SDK experience is currently available.|
|**Hierarchical Time Series**|HTS is recommended if the series in your data have nested, hierarchical structure and you need to train or make forecasts at aggregated levels of the hierarchy. See the [hierarchical time series forecasting](how-to-auto-train-forecast.md#hierarchical-time-series-forecasting) section for more information.|- Training at aggregated levels can reduce noise in the leaf node time series and potentially lead to higher accuracy models. <br> <br> - Forecasts can be retrieved for any level of the hierarchy by aggregating or dis-aggregating forecasts from the training level.|- You need to provide the aggregation level for training. AutoML doesn't currently have an algorithm to find an optimal level.|

> [!NOTE]
> We recommend using compute nodes with GPUs when deep learning is enabled to best take advantage of high DNN capacity. Training time can be much faster in comparison to nodes with only CPUs. See the GPU optimized compute article for more information.
    
> [!NOTE]
> HTS is designed for tasks where training or prediction is required at aggregated levels in the hierarchy. For hierarchical data requiring only leaf node training and prediction, use [Many Models](./how-to-auto-train-forecast.md#many-models) instead.

## How can I prevent over-fitting and data leakage?

AutoML uses machine learning best practices, such as cross-validated model selection, that mitigate many over-fitting issues. However, there are other potential sources of over-fitting:

- The input data contains **feature columns that are derived from the target with a simple formula**. For example, a feature that is an exact multiple of the target can result in a nearly perfect training score. The model, however, will likely not generalize to out-of-sample data. We advise you to explore the data prior to model training and to drop columns that "leak" the target information.
- The training data uses **features that are not known into the future**, up to the forecast horizon. AutoML's regression models currently assume all features are known to the forecast horizon. We advise you to explore your data prior to training and remove any feature columns that are only known historically.
- There are **significant structural differences - regime changes - between the training, validation, or test portions of the data**. For example, consider the effect of the COVID-19 pandemic on demand for almost any good during 2020 and 2021; this is a classic example of a regime change. Over-fitting due to regime change is the most challenging issue to address because it's highly scenario dependent and can require deep knowledge to identify. As a first line of defense, try to reserve 10 - 20% of the total history for validation, or cross-validation, data. It isn't always possible to reserve this amount of validation data if the training history is short, but is a best practice. See our guide on [configuring validation](./how-to-auto-train-forecast.md#training-and-validation-data) for more information.


## What if my time series data doesn't have regularly spaced observations?

AutoML's forecasting models all require that training data have regularly spaced observations with respect to the calendar. This requirement includes cases like monthly or yearly observations where the number of days between observations may vary. There are two cases where time dependent data may not meet this requirement:

- The data has a well defined frequency, but **there are missing observations that create gaps in the series**. In this case, AutoML will attempt to detect the frequency, fill in new observations for the gaps, and impute missing target and feature values therein. The imputation methods can be optionally configured by the user via SDK settings or through the Web UI. See the [custom featurization](./how-to-auto-train-forecast.md#custom-featurization) 
guide for more information on configuring imputation.

- **The data doesn't have a well defined frequency**. That is, the duration between observations doesn't have a discernible pattern. Transactional data, like that from a point-of-sales system, is one example. In this case, you can set AutoML to aggregate your data to a chosen frequency. You can choose a regular frequency that best suites the data and the modeling objectives. See the [data aggregation](./how-to-auto-train-forecast.md#frequency--target-data-aggregation) section for more information.

## How do I choose the primary metric?

The primary metric is very important since its value on validation data determines the best model during [ sweeping and selection](./concept-automl-forecasting-sweeping.md). **Normalized root mean squared error (NRMSE) or normalized mean absolute error (NMAE) are usually the best choices for the primary metric** in forecasting tasks. To choose between them, note that RMSE penalizes outliers in the training data more than MAE because it uses the square of the error. The NMAE may be a better choice if you want the model to be less sensitive to outliers. See the [regression and forecasting metrics](./how-to-understand-automated-ml.md#regressionforecasting-metrics) guide for more information.

> [!NOTE]
> We do not recommend using the R2 score, or _R_<sup>2</sup>, as a primary metric for forecasting.

> [!NOTE]
> AutoML doesn't support custom, or user-provided functions for the primary metric. You must choose one of the predefined primary metrics that AutoML supports. 

## How can I improve the accuracy of my model?

- Ensure that you're configuring AutoML the best way for your data. See the [model configuration](#what-modeling-configuration-should-i-use) answer for more information.
- Check out the [forecasting recipes notebook](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-recipes-univariate/auto-ml-forecasting-univariate-recipe-experiment-settings.ipynb) for step-by-step guides on how to build and improve forecast models.  
- Evaluate the model using back-tests over several forecasting cycles. This procedure gives a more robust estimate of forecasting error and gives you a baseline to measure improvements against. See our [back-testing notebook](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-backtest-single-model/auto-ml-forecasting-backtest-single-model.ipynb) for an example.
- If the data is noisy, consider aggregating it to a coarser frequency to increase the signal-to-noise ratio. See the [data aggregation](./how-to-auto-train-forecast.md#frequency--target-data-aggregation) guide for more information.
- Add new features that may help predict the target. Subject matter expertise can help greatly when selecting training data.
- Compare validation and test metric values and determine if the selected model is under-fitting or over-fitting the data. This knowledge can guide you to a better training configuration. For example, you might determine that you need to use more cross-validation folds in response to over-fitting.

## Will AutoML always select the same best model given the same training data and configuration?

[AutoML's model search process](./concept-automl-forecasting-sweeping.md#model-sweeping) is not deterministic, so it does not always select the same model given the same data and configuration.  

## How do I fix an Out-Of-Memory error?

There are two types of memory issues:
- RAM Out-of-Memory 
- Disk Out-of-Memory

First, ensure that you're configuring AutoML in the best way for your data. See the [model configuration](#what-modeling-configuration-should-i-use) answer for more information.

For default AutoML settings, RAM Out-of-Memory may be fixed by using compute nodes with more RAM. A useful rule-of-thumb is that the amount of free RAM should be at least 10 times larger than the raw data size to run AutoML with default settings. 

Disk Out-of-Memory errors may be resolved by deleting the compute cluster and creating a new one.

## What advanced forecasting scenarios are supported by AutoML?

We support the following advanced prediction scenarios:
- Quantile forecasts
- Robust model evaluation via [rolling forecasts](./how-to-auto-train-forecast.md#evaluating-model-accuracy-with-a-rolling-forecast)
- Forecasting beyond the forecast horizon
- Forecasting when there's a gap in time between training and forecasting periods.

See the [advanced forecasting scenarios notebook](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-forecast-function/auto-ml-forecasting-function.ipynb) for examples and details.

## How do I view metrics from forecasting training jobs?

See our [metrics in studio UI](how-to-log-view-metrics.md#view-jobsruns-information-in-the-studio) guide for finding training and validation metric values. You can view metrics for any forecasting model trained in AutoML by navigating to a model from the AutoML job UI in the studio and clicking on the "metrics" tab.

:::image type="content" source="media/how-to-automl-forecasting-faq/metrics_UI.png" alt-text="A view of the metric interface for an AutoML forecasting model.":::

## How do I debug failures with forecasting training jobs?

If your AutoML forecasting job fails, you'll see an error message in the studio UI that may help to diagnose and fix the problem. The best source of information about the failure beyond the error message is the driver log for the job. Check out the [run logs](how-to-log-view-metrics.md#view-and-download-diagnostic-logs) guide for instructions on finding driver logs.

> [!NOTE]
> For Many Models or HTS job, training is usually on multi-node compute clusters. Logs for these jobs are present for each node IP address. You will need to search for error logs in each node in this case. The error logs, along with the driver logs, are in the `user_logs` folder for each node IP. 

## How do I deploy model from forecasting training jobs?

Model from forecasting training jobs can be deployed in either of the two ways:

- Online Endpoint
    - Please refer [this link](./how-to-deploy-automl-endpoint.md) for online deployment.
    - You can check the scoring file used in the deployment or click on the "Test" tab on the endpoint page in the studio to understand the structure of input that is expected by the deployment.
    - You can refer [this notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/automl-standalone-jobs/automl-forecasting-task-energy-demand/automl-forecasting-task-energy-demand-advanced-mlflow.ipynb) to see an example.
- Batch Endpoint
    - Please refer [this link](./how-to-use-batch-endpoint.md) for batch deployment.
    - It requires you to develop a custom scoring script.
    - You can refer [this notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/automl-standalone-jobs/automl-forecasting-orange-juice-sales/automl-forecasting-orange-juice-sales-mlflow.ipynb) to see an example.

For UI deployments, we encourage to use either of the two options:
- Real-time endpoint
- Batch endpoint

:::image type="content" source="media/how-to-automl-forecasting-faq/deployment-ui.png" alt-text="A view of the possible deployment options for an AutoML forecasting model.":::

**Please don't use the 1st option i.e. "Real-time-endpoint (quick)"**.

> [!NOTE]
> As of now, we don't support deploying MLflow model from forecasting training jobs through SDK, CLI, or UI. You will run into errors if you try this.

## What is a workspace / environment / experiment/ compute instance / compute target? 

If you aren't familiar with Azure Machine Learning concepts, start with the ["What is Azure Machine Learning"](overview-what-is-azure-machine-learning.md) article and the [workspaces](./concept-workspace.md) article.

## Next steps
* Learn more about [how to set up AutoML to train a time-series forecasting model](./how-to-auto-train-forecast.md).
* Learn about [calendar features for time series forecasting in AutoML](./concept-automl-forecasting-calendar-features.md).
* Learn about [how AutoML uses machine learning to build forecasting models](./concept-automl-forecasting-methods.md).
* Learn about [AutoML Forecasting Lagged Features](./concept-automl-forecasting-lags.md).
