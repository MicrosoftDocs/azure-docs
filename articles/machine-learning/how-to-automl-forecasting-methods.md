---
title: Overview of forecasting methods in AutoML
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning's AutoML uses machine learning to build forecasting models
services: machine-learning
author: erwright
ms.author: erwright
ms.reviewer: ssalgado 
ms.service: machine-learning
ms.subservice: automl
ms.topic: how-to
ms.custom: contperf-fy21q1, automl, FY21Q4-aml-seo-hack, sdkv1, event-tier1-build-2022
ms.date: 12/15/2022
---

# Overview of forecasting methods in AutoML
This article focuses on the methods that AutoML uses to prepare time series data and build forecasting models. Instructions and examples for training forecasting models in AutoML can be found in our [set up AutoML for time series forecasting](./how-to-auto-train-forecast.md) article.

AutoML uses a variety of quantitative methods to forecast time series values. These methods can be roughly assigned to two categories:

1. Time series models that use historical values of the target quantity to make predictions into the future.
2. Regression, or explanatory, models that use predictor variables to forecast values of the target.

As an example, consider the problem of forecasting daily demand for a particular brand of orange juice from a grocery store. Let y(t) represent the demand for this brand on day t. A **time series model** predicts demand at t+1 using some function of current and historical demand,

y(t+1) = f(y(t), y(t-1), ..., y(t-s)). 

The function f often has parameters that we tune using observed demand from the past. The amount of history that f uses to make predictions, s, can also be considered a parameter of the model.

The time series model in the orange juice demand example may not be accurate enough since it only uses information about past demand. There are many other factors that likely influence future demand such as price, day of the week, and whether it is a holiday or not. We could obviously list more factors, but we will keep it simple for purposes of demonstration! Now we consider a **regression model** that uses these predictor variables,

y = g(price, day of week, holiday).

Again, g generally has a set of parameters we tune using past values of the demand and the predictors. We omit t from the expression to emphasize that the regression model uses correlational patterns between _contemporaneously_ defined variables to make predictions. That is, to predict y(t+1) from g, we must know which day of the week t+1 falls on, whether it is a holiday, and the orange juice price on day t+1. The first two pieces of information are always easily found by consulting a calendar. A retail price is usually set in advance, so the orange juice price is likely also known at t+1; however, it may not be known ten days into the future at t+10! It is important to understand that the utility of this regression is limited by how far into the future we need forecasts, also called the **forecast horizon**, and to what degree we know the future values of the predictors.

AutoML's forecasting regression models can also be augmented to use historical values of the target and predictors. This creates a hybrid kind of model with characteristics of a time series model and a pure regression model. In this case, we think of historical quantities as just more predictor variables in the regression and we refer to them as **lagged quantities**. The _order_ of the lag refers to how far back the value is known. For example, the current value of an order two lag of the target for our orange juice demand example is the observed juice demand from two days ago.

## Forecasting Models in AutoML
The following table lists the forecasting models implemented in AutoML and what category they belong to:

Time Series Models | Regression Models
-------------------| -----------------
[Naive, Seasonal Naive, Average, Seasonal Average](https://otexts.com/fpp3/simple-methods.html), [ARIMA](https://www.statsmodels.org/dev/generated/statsmodels.tsa.statespace.sarimax.SARIMAX.html), [Exponential Smoothing](https://www.statsmodels.org/dev/generated/statsmodels.tsa.holtwinters.ExponentialSmoothing.html) | [ARIMAX](https://www.statsmodels.org/dev/generated/statsmodels.tsa.statespace.sarimax.SARIMAX.html), [Linear SGD](https://scikit-learn.org/stable/modules/linear_model.html#stochastic-gradient-descent-sgd), [LARS LASSO](https://scikit-learn.org/stable/modules/linear_model.html#lars-lasso), [Elastic Net](https://scikit-learn.org/stable/modules/linear_model.html#elastic-net), [Prophet](https://facebook.github.io/prophet/), [K Nearest Neighbors](https://scikit-learn.org/stable/modules/neighbors.html#nearest-neighbors-regression), [Decision Tree](https://scikit-learn.org/stable/modules/tree.html#regression), [Random Forest](https://scikit-learn.org/stable/modules/ensemble.html#random-forests), [Extremely Randomized Trees](https://scikit-learn.org/stable/modules/ensemble.html#extremely-randomized-trees), [Gradient Boosted Trees](https://scikit-learn.org/stable/modules/ensemble.html#regression), [LightGBM](https://lightgbm.readthedocs.io/en/latest/index.html), [XGBoost](https://xgboost.readthedocs.io/en/latest/parameter.html), Temporal Convolutional Network

The models in each category are listed roughly in order of the complexity of patterns they are able to incorporate; this is also known as the **model capacity**. A Naive model, which simply forecasts the last observed value, has low capacity while the Temporal Convolutional Network (TCN), a deep neural network with potentially millions of tunable parameters, has high capacity.

Importantly, AutoML also includes **ensemble** models which create weighted combinations of the best performing models from the table above to further improve accuracy. For forecasting, we use a [soft voting ensemble](https://scikit-learn.org/stable/modules/ensemble.html#voting-regressor) where composition and weights are found via the [Caruana Ensemble Selection Algorithm](http://www.niculescu-mizil.org/papers/shotgun.icml04.revised.rev2.pdf).

There are two important caveats to mention in regard to forecast model ensembles. The first is that the TCN cannot currently be included in ensembles. Second, AutoML by default disables another method, the **stack ensemble**, which is included with default regression and classification tasks in AutoML. The stack ensemble fits a meta-model on the best model forecasts to find ensemble weights. We've found in internal benchmarking that this strategy has an increased tendency to over fit time series data. This can result in poor generalization, so the stack ensemble is disabled by default. However, it can be enabled if desired in the AutoML configuration.

## How AutoML Uses Your Data

AutoML accepts time series data in tabular, "wide" format; that is, each variable must have its own corresponding column. AutoML requires that one of the columns must be the time axis for the forecasting problem which is parsable into a datetime type. The simplest time series data set consists of a **time column** and a numeric **target column**. The target is the variable one intends to predict into the future. An example of the format in this simple case follows below: 

timestamp | quantity
--------- | --------
2012-01-01 | 100
2012-01-02 | 97
2012-01-03 | 106
...        | ...
2013-12-31 | 347

In more complex cases, the data may contain other columns aligned with the time index. 

timestamp | SKU | price | advertised | quantity
--------- | --- | ----- | ---------- | --------
2012-01-01 | JUICE1 | 3.5 | 0 | 100
2012-01-01 | BREAD3 | 5.76 | 0 | 47
2012-01-02 | JUICE1 | 3.5 | 0 | 97
2012-01-02 | BREAD3 | 5.5 | 1 | 68
... | ... | ... | ... | ...
2013-12-31 | JUICE1 | 3.75 | 0 | 347
2013-12-31 | BREAD3 | 5.7 | 0 | 94

In this example, there is a SKU, a retail price, and a flag indicating whether an item was advertised in addition to the timestamp and target quantity. There are evidently two series in this dataset - one for the JUICE1 SKU and one for the BREAD3 SKU; the `SKU` column is a **time series ID column** since grouping by gives two groups containing a single series each. AutoML can build a variety of time series and regression models from this information! Before sweeping over models, AutoML does basic validation of the input configuration and data as well as augmentation of the data with engineered features.

### Missing Data Handling

AutoML's time series models generally require data with regularly spaced observations in time. Regularly spaced, here, includes cases like monthly or yearly observations where the number of days between observations may vary. Before feeding data to models, then, the data must be full (i.e., no missing values) _and_ regular. This leads to two potential missing data cases:

* A value is missing for some cell in the tabular data
* A _row_ is missing which corresponds with an expected observation given the time series frequency

In the first case, AutoML imputes missing values using common, configurable techniques.

An example of a missing, expected row is shown below:

timestamp | quantity
--------- | --------
2012-01-01 | 100
2012-01-03 | 106
2012-01-04 | 103
...        | ...
2013-12-31 | 347

This series ostensibly has a daily frequency, but there is no observation for 2012-01-02. In this case, AutoML will attempt to fill in the data by adding a new row for 2012-01-02. The new value for the `quantity` column, and any other columns in the data, will then be imputed like other missing values. Clearly, AutoML must know the series frequency in order to fill in observation gaps like this. AutoML automatically detects this frequency, or, optionally, the user can provide it in the configuration.

The imputation method for filling missing values can be configured in the input. The default methods are listed in the following table:

Column Type | Default Imputation Method 
----------- | ---------------
Target      | Forward fill (last observation carried forward)
Numeric Feature     | Median value

Missing values for categorical features are handled during numerical encoding by including an additional category corresponding to a missing value, so imputation is implicit in this case.

### Automated Feature Engineering

AutoML generally adds new columns to user data in an effort to increase modeling accuracy. Engineered feature can include the following:

Feature Group | Default/Optional
------------ | ----------------
Calendrical features derived from the time index (e.g. day of week) | Default
Encoding categorical types to numeric type | Default
Indicator features for holidays associated with a given country or region | Optional
Lags of target quantity | Optional
Lags of feature columns | Optional
Rolling window aggregations (e.g. rolling average) of target quantity | Optional
Seasonal decomposition (STL) | Optional

The user can configure featurization from the AutoML SDK or from the AzureML web interface.

### Model Sweeping

After data has been prepared with missing data handling and feature engineering, AutoML sweeps over a set of models and hyper-parameters using a [model recommendation service](https://www.microsoft.com/research/publication/probabilistic-matrix-factorization-for-automated-machine-learning/). The models are ranked based on validation or cross-validation metrics and then, optionally, the top models may be used in an ensemble model. The best model, or any of the trained models, can be inspected, downloaded, or deployed to produce forecasts as needed. See [Model Sweeping and Selection](./model_sweeping_and_selection.md) for more details.


### Model Grouping
When a dataset contains more than one time series, as in the given data example, there are multiple ways to model that data. For instance, we may simply group by the **time series ID column(s)** and train independent models for each series. A more general approach is to partition the data into groups that may each contain multiple, likely related series and train a model per group. By default, AutoML forecasting uses a mixed approach to model grouping. Time series models, plus ARIMAX and Prophet, assign one series to one group and other regression models assign all series to a single group. The table below summarizes the model groupings in two categories, one-to-one and many-to-one:  

Each Series in Own Group (1:1) | All Series in Single Group (N:1)
-------------------| -----------------
Naive, Seasonal Naive, Average, Seasonal Average, Exponential Smoothing, ARIMA, ARIMAX, Prophet | Linear SGD, LARS LASSO, Elastic Net, K Nearest Neighbors, Decision Tree, Random Forest, Extremely Randomized Trees, Gradient Boosted Trees, LightGBM, XGBoost, Temporal Convolutional Network

More general model groupings are possible via AutoML's [Many Models Solution](https://github.com/Azure/azureml-examples/tree/main/python-sdk/tutorials/automl-with-azureml/forecasting-many-models) and [Hierarchical Time Series Solution](https://github.com/Azure/azureml-examples/tree/main/python-sdk/tutorials/automl-with-azureml/forecasting-hierarchical-timeseries).

### Prediction
