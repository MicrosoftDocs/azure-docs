---
title: Model sweeping and selection for forecasting in AutoML
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning's AutoML searches for and selects forecasting models
services: machine-learning
author: ctian-msft
ms.author: chuantian
ms.reviewer: ssalgado 
ms.service: machine-learning
ms.subservice: automl
ms.topic: how-to
ms.custom: contperf-fy21q1, automl, FY21Q4-aml-seo-hack, sdkv1, event-tier1-build-2022
ms.date: 12/15/2022
---

# Model sweeping and selection for forecasting in AutoML
This article focuses on how AutoML searches for and selects forecasting models. Please see the [methods overview article](./how-to-automl-forecasting-methods.md) for more general information about forecasting methodology in AutoML. Instructions and examples for training forecasting models in AutoML can be found in our [set up AutoML for time series forecasting](./how-to-auto-train-forecast.md) article.

## Model Sweeping
The central task for AutoML is to train and evaluate several models and choose the best one with respect to the given primary metric. The word "model" here refers to both the model class - such as ARIMA or Random Forest - and the specific hyper-parameter settings which distinguish models within a class. For instance, ARIMA refers to a class of models that share a mathematical template and a set of statistical assumptions. Training, or fitting, an ARIMA model requires a list of positive integers that specify the precise mathematical form of the model; these are the hyper-parameters. ARIMA(1, 0, 1) and ARIMA(2, 1, 2) have the same class, but different hyper-parameters and, so, can be separately fit with the training data and evaluated against each other. AutoML searches, or _sweeps_, over different model classes and within classes by varying hyper-parameters.

The following table shows the different hyper-parameter sweeping methods that AutoML uses for different model classes:

Model class group | Model type | Hyper-parameter sweeping method
---- | ---- | ----
Naive, Seasonal Naive, Average, Seasonal Average | Time series | No sweeping within class due to model simplicity
Exponential Smoothing, ARIMA(X) | Time series | Grid search for within-class sweeping
Prophet | Regression | No sweeping within class
Linear SGD, LARS LASSO, Elastic Net, K Nearest Neighbors, Decision Tree, Random Forest, Extremely Randomized Trees, Gradient Boosted Trees, LightGBM, XGBoost | Regression | AutoML's [model recommendation service](https://www.microsoft.com/research/publication/probabilistic-matrix-factorization-for-automated-machine-learning/) dynamically explores hyper-parameter spaces
Temporal Convolutional Network | Regression | Static list of models followed by random search over network size, dropout ratio, and learning rate.

For a description of the different model types, see the [forecasting models](./how-to-automl-forecasting-methods.md#forecasting-models-in-automl) section of the methods overview article.

The amount of sweeping that AutoML does depends on the forecasting job configuration. You can specify the stopping criteria as a time limit or a limit on the number of trials, or equivalently the number of models. Early termination logic can be used in both cases to stop sweeping if the primary metric is not improving.

## Model selection
AutoML forecasting model search and selection proceeds in the following three phases:

1. Sweep over time series models and select the best model from _each class_ using [penalized likelihood methods](https://otexts.com/fpp3/arima-estimation.html#information-criteria).
2. Sweep over regression models and rank them, along with the best time series models from phase 1, according to their primary metric values from validation sets.
3. Build an ensemble model from the top ranked models, calculate its validation metric, and rank it with the other models.

The model with the top ranked metric value at the end of phase 3 is designated the best model.

> [!IMPORTANT]
> AutoML's final phase of model selection always calculates metrics on **out-of-sample** data. That is, data that was not used to fit the models. This helps to protect against over-fitting.

AutoML has two validation configurations - cross-validation and explicit validation data. In the cross-validation case, AutoML uses the input configuration to create data splits into training and validation folds. Time order must be preserved in these splits, so AutoML uses so-called **Rolling Origin Cross Validation** which divides the series into training and validation data using an origin time point. Sliding the origin in time generates the cross-validation folds. This strategy preserves the time series data integrity and mitigates the risk of information leakage.  

:::image type="content" source="media/how-to-auto-train-forecast/rolling-origin-cross-validation.png" alt-text="Diagram showing cross validation folds separating the training and validation sets based on the cross validation step size.":::

Cross-validation for forecasting jobs is configured by setting the number of cross-validation folds and, optionally, the number of time periods between two consecutive cross-validation folds. These are respectively named `n_cross_validations` and `cv_step_size` in the AutoML SDK. Both parameters have "auto" settings wherein AutoML determines their values based on data heuristics. For example, here we can create an [AutoMLConfig](#configure-experiment) object with automatic cross-validation settings:

[!INCLUDE [sdk v1](../../includes/machine-learning-sdk-v1.md)]

```python
automl_config = AutoMLConfig(task='forecasting',
                             training_data= training_data,
                             n_cross_validations="auto", # Can also be a positive integer
                             cv_step_size = "auto", # Can also be a positive integer
                             ...
                             **time_series_settings)
```
You can also bring your own validation data, and specify it in `AutoMLConfig`. Learn more in [Configure data splits and cross-validation in AutoML](how-to-configure-cross-validation-data-splits.md#provide-validation-data).
