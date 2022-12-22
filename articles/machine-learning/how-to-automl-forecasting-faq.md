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
ms.topic: how-to
ms.custom: contperf-fy21q1, automl, FY21Q4-aml-seo-hack, sdkv1, event-tier1-build-2022
ms.date: 12/15/2022
---

# Frequently asked questions about forecasting in AutoML
This article answers common questions about forecasting in AutoML. Please see the [methods overview article](./how-to-automl-forecasting-methods.md) for more general information about forecasting methodology in AutoML. Instructions and examples for training forecasting models in AutoML can be found in our [set up AutoML for time series forecasting](./how-to-auto-train-forecast.md) article.

#### How do I start building forecasting models in AutoML?
You can start by reading our guide on [setting up AutoML to train a time-series forecasting model with Python](./how-to-auto-train-forecast.md). We've also provided hands-on examples in several jupyter notebooks:  
1. [Bike share example](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-bike-share/auto-ml-forecasting-bike-share.ipynb)
2. [Forecasting using deep learning](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-github-dau/auto-ml-forecasting-github-dau.ipynb)
3. [Many models](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-many-models/auto-ml-forecasting-many-models.ipynb) 
4. [Forecasting Recipes](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-recipes-univariate/auto-ml-forecasting-univariate-recipe-experiment-settings.ipynb)
5. [Advanced forecasting scenarios](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-forecast-function/auto-ml-forecasting-function.ipynb)

#### Why is AutoML slow on my data?

We're always working to make it faster and more scalable! To work as a general forecasting platform, AutoML undertakes a lot of tasks such as extensive data validations, complex feature engineering, rolling origin cross-validation, and sweeping over a large variety of models. 

One common source of slow runtime is training AutoML with default settings on data containing numerous time series. The cost of many forecasting methods scales with the number of series. For example, methods like Exponential Smoothing and Prophet train a model for each time series in the training data. See the [model grouping](./how-to-automl-forecasting-methods.md#model-grouping) section for more information. **The Many Models feature of AutoML is designed for these cases** and has been successfully applied to data with millions of time series. See the [forecasting at scale](./how-to-auto-train-forecast#forecasting-at-scale) section for more information. You can also read about [the success of our scaling approach](https://techcommunity.microsoft.com/t5/ai-machine-learning-blog/automated-machine-learning-on-the-m5-forecasting-competition/ba-p/2933391) on a high-profile competition data set.

#### How can I made AutoML faster?
See the ["why is AutoML slow on my data"](./how-to-automl-forecasting-faq.md#why-is-automl-slow-on-my-data) answer to understand why it may be slow in your case.
Consider the following simple configuration changes that may speed-up your job:
- Block time series models like ARIMA and Prophet
- Turn off look-back features like lags and rolling windows
- Reduce 
  - number of trials/iterations
  - trial/iteration timeout
  - experiment timeout
  - number of cross validation folds.
- Ensure that early termination is enabled.
  
#### What modeling configuration should I use?

There are four basic configurations supported by AutoML forecasting:
  
1.  **Default AutoML** is recommended if the dataset has a small number of time series that have roughly similar historic behavior.

    Advantages:
    - Simple to configure from code/SDK or AzureML Studio
    - AutoML has the chance to cross-learn across different time series since the regression models pool all series together in training. See the [model grouping](./how-to-automl-forecasting-methods.md#model-grouping) section for more information.


    Disadvantages:

    - Regression models may be less accurate if the time series in the training data have divergent behavior
    - Time series models may take a long time to train if there are a large number of series in the training data. See the ["why is AutoML slow on my data"](./how-to-automl-forecasting-faq.md#why-is-automl-slow-on-my-data) answer for more information.

2. **AutoML with deep learning** is recommended for datasets with more than 1000 observations and, potentially, numerous time series exhibiting complex patterns. When enabled, AutoML will sweep over temporal convolutional neural network (TCN) models during training. See the [enable deep learning](./how-to-auto-train-forecast#enable-deep-learning) section for more information.

    Advantages
    - Simple to configure from code/SDK or AzureML Studio
    - Cross-learning opportunities since the TCN pools data over all series
    - Potentially higher accuracy due to the large capacity of DNN models. See the [forecasting models in AutoML](./how-to-automl-forecasting-methods.md#forecasting-models-in-automl) section for more information.

    Disadvantages
    - Training can take much longer due to the complexity of DNN models
    
    > [!NOTE]
    > We recommend using compute nodes with GPUs when deep learning is enabled to best take advantage of high DNN capacity. Training time can be much faster in comparison to nodes with only CPUs. See the [GPU optimized compute](../virtual-machines/sizes-gpu.md) article for more information.

3.  **Many Models** is recommended if you need to train and manage a large number of forecasting models in a scalable way. See the [forecasting at scale](./how-to-auto-train-forecast#forecasting-at-scale) section for more information. 
    
    Advantages:
    - Scalable
    - Potentially higher accuracy when time series have divergent behavior from one another.
  
    Disadvantages:
    - No cross-learning across time series
    - You cannot configure or launch Many Models jobs from AzureML Studio, only the code/SDK experience is currently available.

4. **Hierarchical Time Series**, or HTS, is recommended if the series in your data have nested, hierarchical structure and you need to train or make forecasts at aggregated levels of the hierarchy. See the [hierarchical time series forecasting](how-to-auto-train-forecast#hierarchical-time-series-forecasting) section for more information. 

    Advantages
    - Training at aggregated levels can reduce noise in the leaf node time series and potentially lead to higher accuracy models
    - Forecasts can be retrieved for any level of the hierarchy by aggregating or disaggregating forecasts from the training level.
    
    Disadvantages
    - You need to provide the aggregation level for training. AutoML does not currently have an algorithm to find an optimal level.
    
    > [!NOTE]  
    > HTS is designed for tasks where training or prediction is required at aggregated levels in the hierarchy. For hierarchical data requiring only leaf node training and prediction, use [Many Models](./how-to-auto-train-forecast#many-models) instead.

#### How can I prevent over-fitting and data leakage?

AutoML uses machine learning best practices, such as cross-validated model selection, that mitigate many over-fitting issues. However, there are other potential sources of over-fitting:

- The input data contains **feature columns that are derived from the target with a simple formula**. For example, a feature that is an exact multiple of the target can result in a nearly perfect training score. The model, however, will likely not generalize to out-of-sample data. We advise you to explore the data prior to model training and to drop columns that "leak" the target information.
- The training data uses **features that are not known into the future**, up to the forecast horizon. AutoML's regression models currently assume all features are known to the forecast horizon. We advise you to explore your data prior to training and remove any feature columns that are only known historically.
- There are **significant structural differences - regime changes - between the training, validation, or test portions of the data**. For example, consider the effect of the COVID-19 pandemic on demand for almost any good during 2020 and 2021; this is a classic example of a regime change. Over-fitting due to regime change is the most challenging issue to address because it is highly scenario dependent and can require deep knowledge to identify. As a first line of defense, try to reserve 10 - 20% of the total history for validation, or cross-validation, data. This is not always possible if the training history is short, but is generally a best practice. See our guide on [configuring validation](./how-to-auto-train-forecast.md#training-and-validation-data) for more information.  

#### What if my time series data does not have regularly spaced observations?

AutoML's forecasting models all require that training data have regularly spaced observations with respect to the calendar. This requirement includes cases like monthly or yearly observations where the number of days between observations may vary. There are two cases where time dependent data may not meet this requirement:

- The data has a well defined frequency, but **there are missing observations that create gaps in the series**. In this case, AutoML will attempt to detect the frequency, fill in new observations for the gaps, and impute missing target and feature values therein. The imputation methods can be optionally configured by the user via SDK settings or through the Web UI. See the [custom featurization](./how-to-auto-train-forecast#customize-featurization) 
guide for more information on configuring imputation.

- **The data does not have a well defined frequency**. That is, the duration between observations does not have a discernible pattern. Transactional data, like that from a point-of-sales system, is one example. In this case, you can set AutoML to aggregate your data to a chosen frequency. You can choose a regular frequency that best suites the data and the modeling objectives. See the [data aggregation](./how-to-auto-train-forecast#frequency--target-data-aggregation) section for more information.

#### How do I choose the primary metric?

The primary metric is very important since its value on validation data determines the best model during [ sweeping and selection](./how-to-automl-forecasting-sweeping.md). **Normalized root mean squared error (NRMSE) or normalized mean absolute error (NMAE) are usually the best choices for the primary metric** in forecasting tasks. To choose between them, note that RMSE penalizes outliers in the training data more than MAE because it uses the square of the error. The NMAE may be a better choice if you want the model to be less sensitive to outliers. See the [regression and forecasting metrics](./how-to-understand-automated-ml.md#regressionforecasting-metrics) guide for more information.

> [!NOTE]
> We do not recommend using the R2 score, or _R_<sup>2</sup>, as a primary metric for forecasting.

> [!NOTE]
> AutoML does not support custom, or user-provided functions for the primary metric. You must choose one of the predefined primary metrics that AutoML supports. 

#### How can I improve the accuracy of my model?

- Ensure that you're configuring AutoML the best way for your data. See the [model configuration](./how-to-automl-forecasting-faq.md#what-modeling-configuration-should-i-use) answer for more information.
- Check out the [forecasting recipes notebook](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-recipes-univariate/auto-ml-forecasting-univariate-recipe-experiment-settings.ipynb) for step-by-step guides on how to build and improve forecast models.  
- Evaluate the model using back-tests over several forecasting cycles. This procedure gives a more robust estimate of forecasting error and gives you a baseline to measure improvements against. See our [back-testing notebook](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-backtest-single-model/auto-ml-forecasting-backtest-single-model.ipynb) for an example.
- If the data is noisy, consider aggregating it to a coarser frequency to increase the signal-to-noise ratio. See the [data aggregation](./how-to-auto-train-forecast.md#frequency--target-data-aggregation) guide for more information.
- Add new features that may help predict the target. Subject matter expertise can help greatly when selecting training data.
- Compare validation and test metric values and determine if the selected model is under-fitting or over-fitting the data. This knowledge can guide you to a better training configuration. For example, you might determine that you need to use more cross-validation folds in response to over-fitting.

### How do I fix an Out-Of-Memory error?

There are two types of memory issues:
- RAM Out-of-Memory 
- Disk Out-of-Memory

First, ensure that you're configuring AutoML in the best way for your data. See the [model configuration](./how-to-automl-forecasting-faq.md#what-modeling-configuration-should-i-use) answer for more information.

For default AutoML settings, RAM Out-of-Memory may be fixed by using compute nodes with more RAM. A useful rule-of-thumb is that the amount of free RAM should be at least 10 times larger than the raw data size to run AutoML with default settings. 

Disk Out-of-Memory errors may be resolved by deleting the compute cluster and creating a new one.

### What advanced forecasting scenarios are supported by AutoML?

We support the following advanced prediction scenarios:
- Quantile forecasts
- Robust model evaluation via [rolling forecasts](./how-to-auto-train-forecast.md#evaluating-model-accuracy-with-a-rolling-forecast)
- Forecasting beyond the forecast horizon
- Forecasting when there is a gap in time between training and forecasting periods.

See the [advanced forecasting scenarios notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-forecast-function/auto-ml-forecasting-function.ipynb) for examples and details.

### How do I view the output metrics, visualization, and logs for the forecasts for various configurations like default AutoML, MM, HTS, TCN etc. 

[Track and monitor training](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-track-monitor-analyze-runs) and [Forecasting Metrics and Visualisations](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-understand-automated-ml) are recommended links to get an overall understanding.

Default AutoML :  
On selecting any model in the Models tab, go to Output+Logs where User logs (std_log.txt) and Outputs can be found. Metrics tab shows the validation metrics and several useful visualizations. 

Many Models :  
Double click on many-models-train. Navigate from the Overview tab to the Child Jobs tab that represent the individual grains that are trained in parallel. Selecting any child job is equivalent to Default Auto ML now. On selecting any Child Jobs, the corresponding Metrics tab contain important visualizations and metrics.To summarize, many-models-train -> Child Jobs -> Child Jobs ->Metrics tab.
The overall logs can be obtained directly at the first layer: many-models-train -> Outputs+Logs tab

HTS :  
Double click on hts-automl-training and continue the same steps as Many Models.

DNN :  
Plots, Metrics and Logs can be found similar to Default AutoML. DNN runs inside Child run. 
TCN-> Child Jobs -> Logs and Vizualisations can be found.

### Where to look for Logs and which logs are important for the customer? 

User error in avaiable in the main run page. Refer std_txt.log. (add details)   
a.	Default AutoML: driver log  
b.	Many Models/ HTS: Each node has its own user logs. The log structure is available in readme.txt file present inside.

### What is workspace/ environments/ experiment/ compute instance/ compute target? 

Here is an useful [link](https://learn.microsoft.com/en-us/azure/machine-learning/concept-workspace) explaining these. [Azure Machine Learning Documentation](https://learn.microsoft.com/en-us/azure/machine-learning/) is a useful place for similar questions.
