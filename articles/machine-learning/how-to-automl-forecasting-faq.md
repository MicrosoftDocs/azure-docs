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

### What if my time series data does not have regularly spaced observations?

AutoML's timeseries models all require data with regularly spaced observations in time. Regularly spaced, here, includes cases like monthly or yearly observations where the number of days between observations may vary. Essentially, AutoML just needs to be able to infer a time series frequency. There are two cases where time dependent data may not meet this requirement:

1. The data does have a well defined frequency, but there are missing observations that create gaps in the series. In this case, AutoML will attempt to detect the frequency, fill in new observations for the gaps, and impute missing target and feature values therein. The imputation methods can be optionally configured by the user via SDK settings or through the Web UI. For more details on configuring imputation, see [here](https://learn.microsoft.com/azure/machine-learning/how-to-auto-train-forecast#customize-featurization)
2. The data does not have a well defined frequency; that is, the duration between observations does not have a discernible pattern. Transactional data, like that from a Point-of-Sales system, is one example. In this case, you can set AutoML to aggregate your data to a chosen frequency. You can choose a regular frequency that best suites the data and the modeling objectives (hourly, daily, monthly, etc.). For more details on aggregation, see [here](https://learn.microsoft.com/azure/machine-learning/how-to-auto-train-forecast#frequency--target-data-aggregation).

### Why is AutoML so slow for my data?

We're always working to make it faster and more scalable! But it is true that AutoML does a lot of processing that you might not consider if you were just hacking on your laptop. For example: extensive data validations, complex feature engineering, rolling origin (cross-)validation, and sweeping over a large variety of models. In the case of timeseries data, we do many of these computations per series. If your data contains many series, this can become a large computation. Please see our [Forecasting at scale](https://learn.microsoft.com/azure/machine-learning/how-to-auto-train-forecast#forecasting-at-scale) documentation for details on how to scale and accelerate your training jobs. Also, read about [the success of our scaling approach](https://techcommunity.microsoft.com/t5/ai-machine-learning-blog/automated-machine-learning-on-the-m5-forecasting-competition/ba-p/2933391) on a high-profile competition data set.

### What modeling configuration should I use?

There are four configurations supported by AutoML forecasting.
1.  Default Auto ML.

    This is recommended if the dataset has less number of time series. This is the first configuration that should be tried in Azure Auto ML using a small dataset. Classical models would be trained for each time series. For Machine Learning models, one model would be trained for all the time series.

    This configuration helps in cross learning and forecasting for grains that have less historical data. Availability of meta data can further help in the modelling. Also, it is less computationally expensive. 
    Advantages:
    -   Simple and easy to use.
    -   Less computation time and compute
    -   Cross learning across time series
  
    Disadvantages:

    - Accuracy drops as the number of time series increases.
    - Under fitting time series patterns that are underrepresented in the dataset.
    - If there are unrelated time series in the dataset, the model might learn the noise.

2.  Many Models: 
    
    This allows users to train and manage millions of models in parallel. Separate models are trained for each time series. It is recommended when the number of time series is high and there is no cross learning/ hierarchy in the data.
    
    Advantages:
    - Scalability
    - Higher accuracy
  
    Disadvantages:
    - No cross learning across time series
    - For short time series, there can be over-fitting issues.However, ROCV would reduce it.

3. Hierarchical Time Series (HTS): 

    If the meta data has a tree like structure, one should use hierarchical time series solution. This is built on top of the Many Models Solution. 
    HTS is not recommended on leaf node as it is equivalent to Many Models Solution. 

4. Deep Learning: 
   
   Applicable for large datasets where there are a minimum of 1000 rows. This is a global model, i.e. single model is trained for all the time series in the dataset. It also helps cross learning across time series and does not need external features.

### How can I prevent over-fitting and data leakage?

Azure Auto ML uses Rolling Origin Cross Validation which reduces the modelling-based over-fitting issues to a great extent. However, there can be over-fitting issues due to the data. 
- The input data should not contain columns that are derived from the target. 
- Using deep learning models for small number of short time series. Many models can over-fit the time series that have short history. Increasing the cv_step_size and n_cv_folds helps in reducing over-fitting.
- Features available during training but unavailable in the forecast horizon will lead to poor predictions. In our next version, we are proposing a solution to handle missing features in forecast horizon (Coming soon). 

### How and where to start? What should be my steps for forecasting using Azure AutoML?

It is recommended to initially go through [Set up AutoML to train a time-series forecasting model with Python](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-auto-train-forecast). Post that the following notebooks should be executed with the required data in sequence based on the accuracy requirements.
1. [Bike share notebook](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-bike-share/auto-ml-forecasting-bike-share.ipynb)
2. [Forecasting Recipes forecasting-recipes-univariate](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-recipes-univariate/auto-ml-forecasting-univariate-recipe-experiment-settings.ipynb)
3. [Advanced modelling parameters](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-forecast-function/auto-ml-forecasting-function.ipynb)
4. [Many models](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-many-models/auto-ml-forecasting-many-models.ipynb) 
5. [Forecasting using Deep Learning](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-github-dau/auto-ml-forecasting-github-dau.ipynb)


### How do I choose the primary metric? Which output metrics should I look at?

Forecasting supports normalized_mean_absolute_error (MAE), normalized_root_mean_squared_error(RMSE), r2_score,and spearman_correlation. However, R2 not a good metric for forecasting and should be avoided.
  
RMSE heavily penalizes the outliers. If there are few timestamps with poor forecasts and all other timestamps with great forecasts, RMSE will inflate the error metric. If the use case demands that occasional large mistakes should be avoided, then one should use RMSE. However, if errors should be treated equally, then MAE should be used. RMSE optimizes the mean function, whereas MAE optimizes the median.


### How can I improve the accuracy of my model?

It is important to understand which modeling configuration is appropriate for the available data. 
- If the data is extremely granular then aggregating the data at a higher level and generating the forecasts is a good option. The aggregation could be based on frequency or meta data properties. Forecasting at lower granularity introduces a lot of noise in the model. 
- Using back-test notebooks to evaluate the forecast quality over several forecasting cycles. This ensures that the accuracy is not due to strange behaviors in a single forecast horizon.
- Understanding if the models are under-fitting or over-fitting by comparing the training and forecast metrics. Post that updating the model parameters appropriately.
- Adding external features based on business understanding.
- Increasing the forecast horizon etc.
- Looking at the appropriate forecasting accuracy metrics.
- Increase the number of iterations (add the exact parameters)
- Adding complex model parameters

### How can I speed up model training and selection?

- Disable classical models
- Remove configs like lags
- Reduce 
  - number of iterations
  - iteration_timeout_minutes
  - experiment_timeout_hours
  - cross validation parameters (cv_step_size and n_cross_validations)
- Enable_early_stopping

### What can I do if I get an Out-Of-Memory error?

There can be two types of memory issues:
- RAM Out of Memory 
- Disk Out of Memory

RAM Out of Memory can be resolved by upgrading the VM. In SDK, the amount of free memory should be atleast 10 times larger than the raw data size. 30 times the size of raw data seems to be a reasonable memory requirement. If the data size is the problem, it means that user data is at least 467 Mb and one should try the ManyModel solution.

Disk Out of Memory can be resoved by deleting the compute cluster and creating a new one.

### What are the advanced forecasting scenarios that are supported?

We support scenarios like 
- Forecasting further than forecast horizon using 
  - Recursive forecasts 
  - Rolling forecasts
- Forecast quantile prediction
- Forecasting with/without gap between train and test data
- Automatic stationarity fix (??)
For more details, refer [this notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-forecast-function/auto-ml-forecasting-function.ipynb)

### How to export forecasts? (.csv vs UI etc.)

### How do I view the output metrics and visualization for the forecasts for various configurations like default AutoML, MM, HTS, TCN etc. Where to find the plots and accuracy metrics at different levels of hierarchy for HTS?

To be updated

### Where to look for Logs and which logs are important for the customer? 

User error in main run page—to std error log 
a.	single model: driver log
b.	many model: each node has its own user logs describe  log structure readme.

### What is an experiment/ WS/ sweep job – DNN run inside child run? What is job? Link to Azure






