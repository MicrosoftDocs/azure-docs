---
title: Auto-train a time-series forecast model
titleSuffix: Azure Machine Learning
description: Learn how to use Azure Machine Learning to train a time-series forecasting regression model using automated machine learning.
services: machine-learning
author: trevorbye
ms.author: trbye
ms.service: machine-learning
ms.subservice: core
ms.reviewer: trbye
ms.topic: conceptual
ms.date: 11/04/2019
---

# Auto-train a time-series forecast model
[!INCLUDE [aml-applies-to-basic-enterprise-sku](../../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn how to train a time-series forecasting regression model using automated machine learning in Azure Machine Learning. Configuring a forecasting model is similar to setting up a standard regression model using automated machine learning, but certain configuration options and pre-processing steps exist for working with time-series data. The following examples show you how to:

* Prepare data for time series modeling
* Configure specific time-series parameters in an [`AutoMLConfig`](/python/api/azureml-train-automl/azureml.train.automl.automlconfig) object
* Run predictions with time-series data

> [!VIDEO https://www.microsoft.com/videoplayer/embed/RE2X1GW]

You can use automated ML to combine techniques and approaches and get a recommended, high-quality time-series forecast. An automated time-series experiment is treated as a multivariate regression problem. Past time-series values are “pivoted” to become additional dimensions for the regressor together with other predictors.

This approach, unlike classical time series methods, has an advantage of naturally incorporating multiple contextual variables and their relationship to one another during training. In real-world forecasting applications, multiple factors can influence a forecast. For example, when forecasting sales, interactions of historical trends, exchange rate and price all jointly drive the sales outcome. A further benefit is that all recent innovations in regression models apply immediately to forecasting.

You can [configure](#config) how far into the future the forecast should extend (the forecast horizon), as well as lags and more. Automated ML learns a single, but often internally branched model for all items in the dataset and prediction horizons. More data is thus available to estimate model parameters and generalization to unseen series becomes possible.

Features extracted from the training data play a critical role. And, automated ML performs standard pre-processing steps and generates additional time-series features to capture seasonal effects and maximize predictive accuracy.

## Time-series and Deep Learning models


Automated ML provides users with both native time-series and deep learning models as part of the recommendation system. These learners include:
+ Prophet
+ Auto-ARIMA
+ ForecastTCN

Automated ML's deep learning allows for forecasting univariate and multivariate time series data.

Deep learning models have three intrinsic capbailities:
1. They can learn from arbitrary mappings from inputs to outputs
1. They support multiple inputs and outputs
1. They can automatically extract patterns in input data that spans over long sequences

Given larger data, deep learning models, such as Microsofts' ForecastTCN, can improve the scores of the resulting model. 

Native time series learners are also provided as part of automated ML. Prophet works best with time series that have strong seasonal effects and several seasons of historical data. Prophet is accurate & fast, robust to outliers, missing data, and dramatic changes in your time series. 

AutoRegressive Integrated Moving Average(ARIMA) is a popular statistical method for time series forecasting. This technique of forecasting is commonly used in short term forecasting scenarios where data shows evidence of trends such as cycles, which can be unpredictable and difficult to model or forecast. Auto-ARIMA transforms your data into stationary data to receive consistent, reliable results.

## Prerequisites

* An Azure Machine Learning workspace. To create the workspace, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).
* This article assumes basic familiarity with setting up an automated machine learning experiment. Follow the [tutorial](tutorial-auto-train-models.md) or [how-to](how-to-configure-auto-train.md) to see the basic automated machine learning experiment design patterns.

## Preparing data

The most important difference between a forecasting regression task type and regression task type within automated machine learning is including a feature in your data that represents a valid time series. A regular time series has a well-defined and consistent frequency and has a value at every sample point in a continuous time span. Consider the following snapshot of a file `sample.csv`.

    day_datetime,store,sales_quantity,week_of_year
    9/3/2018,A,2000,36
    9/3/2018,B,600,36
    9/4/2018,A,2300,36
    9/4/2018,B,550,36
    9/5/2018,A,2100,36
    9/5/2018,B,650,36
    9/6/2018,A,2400,36
    9/6/2018,B,700,36
    9/7/2018,A,2450,36
    9/7/2018,B,650,36

This data set is a simple example of daily sales data for a company that has two different stores, A and B. Additionally, there is a feature for `week_of_year` that will allow the model to detect weekly seasonality. The field `day_datetime` represents a clean time series with daily frequency, and the field `sales_quantity` is the target column for running predictions. Read the data into a Pandas dataframe, then use the `to_datetime` function to ensure the time series is a `datetime` type.

```python
import pandas as pd
data = pd.read_csv("sample.csv")
data["day_datetime"] = pd.to_datetime(data["day_datetime"])
```

In this case the data is already sorted ascending by the time field `day_datetime`. However, when setting up an experiment, ensure the desired time column is sorted in ascending order to build a valid time series. Assume the data contains 1,000 records, and make a deterministic split in the data to create training and test data sets. Identify the label column name and set it to label. In this example the label will be `sales_quantity`. Then separate the label field from `test_data` to form the `test_target` set.

```python
train_data = data.iloc[:950]
test_data = data.iloc[-50:]

label =  "sales_quantity"
 
test_labels = test_data.pop(label).values
```

> [!NOTE]
> When training a model for forecasting future values, ensure all the features used in
> training can be used when running predictions for your intended horizon. For example, when
> creating a demand forecast, including a feature for current stock price could massively
> increase training accuracy. However, if you intend to forecast with a long horizon, you may
> not be able to accurately predict future stock values corresponding to future time-series
> points, and model accuracy could suffer.

<a name="config"></a>
## Configure and run experiment

For forecasting tasks, automated machine learning uses pre-processing and estimation steps that are specific to time-series data. The following pre-processing steps will be executed:

* Detect time-series sample frequency (e.g. hourly, daily, weekly) and create new records for absent time points to make the series continuous.
* Impute missing values in the target (via forward-fill) and feature columns (using median column values)
* Create grain-based features to enable fixed effects across different series
* Create time-based features to assist in learning seasonal patterns
* Encode categorical variables to numeric quantities

The `AutoMLConfig` object defines the settings and data necessary for an automated machine learning task. Similar to a regression problem, you define standard training parameters like task type, number of iterations, training data, and number of cross-validations. For forecasting tasks, there are additional parameters that must be set that affect the experiment. The following table explains each parameter and its usage.

| Param | Description | Required |
|-------|-------|-------|
|`time_column_name`|Used to specify the datetime column in the input data used for building the time series and inferring its frequency.|✓|
|`grain_column_names`|Name(s) defining individual series groups in the input data. If grain is not defined, the data set is assumed to be one time-series.||
|`max_horizon`|Defines the maximum desired forecast horizon in units of time-series frequency. Units are based on the time interval of your training data, e.g. monthly, weekly that the forecaster should predict out.|✓|
|`target_lags`|Number of rows to lag the target values based on the frequency of the data. This is represented as a list or single integer. Lag should be used when the relationship between the independent variables and dependant variable do not match up or correlate by default. For example, when trying to forecast demand for a product, the demand in any month may depend on the price of specific commodities 3 months prior. In this example, you may want to lag the target (demand) negatively by 3 months so that the model is training on the correct relationship.||
|`target_rolling_window_size`|*n* historical periods to use to generate forecasted values, <= training set size. If omitted, *n* is the full training set size. Specify this parameter when you only want to consider a certain amount of history when training the model.||
|`enable_dnn`|Enable Forecasting DNNs.||

See the [reference documentation](https://docs.microsoft.com/python/api/azureml-train-automl/azureml.train.automl.automlconfig?view=azure-ml-py) for more information.

Create the time-series settings as a dictionary object. Set the `time_column_name` to the `day_datetime` field in the data set. Define the `grain_column_names` parameter to ensure that **two separate time-series groups** are created for the data; one for store A and B. Lastly, set the `max_horizon` to 50 in order to predict for the entire test set. Set a forecast window to 10 periods with `target_rolling_window_size`, and specify a single lag on the target values for 2 periods ahead with the `target_lags` parameter.

```python
time_series_settings = {
    "time_column_name": "day_datetime",
    "grain_column_names": ["store"],
    "max_horizon": 50,
    "target_lags": 2,
    "target_rolling_window_size": 10,
    "preprocess": True,
}
```

> [!NOTE]
> Automated machine learning pre-processing steps (feature normalization, handling missing data,
> converting text to numeric, etc.) become part of the underlying model. When using the model for
> predictions, the same pre-processing steps applied during training are applied to
> your input data automatically.

By defining the `grain_column_names` in the code snippet above, AutoML will create two separate time-series groups, also known as multiple time-series. If no grain is defined, AutoML will assume that the dataset is a single time-series. To learn more about single time-series see the [energy_demand_notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/automated-machine-learning/forecasting-energy-demand).

Now create a standard `AutoMLConfig` object, specifying the `forecasting` task type, and submit the experiment. After the model finishes, retrieve the best run iteration.

```python
from azureml.core.workspace import Workspace
from azureml.core.experiment import Experiment
from azureml.train.automl import AutoMLConfig
import logging

automl_config = AutoMLConfig(task='forecasting',
                             primary_metric='normalized_root_mean_squared_error',
                             experiment_timeout_minutes=15,
                             enable_early_stopping=True,
                             training_data=train_data,
                             label_column_name=label,
                             n_cross_validations=5,
                             enable_ensembling=False,
                             verbosity=logging.INFO,
                             **time_series_settings)

ws = Workspace.from_config()
experiment = Experiment(ws, "forecasting_example")
local_run = experiment.submit(automl_config, show_output=True)
best_run, fitted_model = local_run.get_output()
```

See the [energy demand notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-energy-demand/auto-ml-forecasting-energy-demand.ipynb) for detailed code examples of advanced forecasting configuration including:

* holiday detection and featurization
* rolling-origin cross validation
* configurable lags
* rolling window aggregate features

### Configure a DNN enable Forecasting experiment

> [!NOTE]
> DNN support for forecasting in Automated Machine Learning is in Preview.

In order to leverage DNNs for forecasting, you will need to set the `enable_dnn` parameter in the AutoMLConfig to true. 

In order to use DNNs, we recommend using an AML Compute cluster with GPU SKUs and at least 2 nodes as the compute target. 
See the [AML Compute documentation](https://docs.microsoft.com/en-us/azure/machine-learning/service/how-to-set-up-training-targets#amlcompute) for more information. 
See [GPU optimized virtual machine sizes](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/sizes-gpu) for more information on the VM sizes that include GPUs.

To allow sufficient time for the DNN training to complete, we recommend setting the experiment timeout to at least a couple of hours.

### View feature engineering summary

For time-series task types in automated machine learning, you can view details from the feature engineering process. The following code shows each raw feature along with the following attributes:

* Raw feature name
* Number of engineered features formed out of this raw feature
* Type detected
* Whether feature was dropped
* List of feature transformations for the raw feature

```python
fitted_model.named_steps['timeseriestransformer'].get_featurization_summary()
```

## Forecasting with best model

Use the best model iteration to forecast values for the test data set.

```python
predict_labels = fitted_model.predict(test_data)
actual_labels = test_labels.flatten()
```

Alternatively, you can use the `forecast()` function instead of `predict()`, which will allow specifications of when predictions should start. In the following example, you first replace all values in `y_pred` with `NaN`. The forecast origin will be at the end of training data in this case, as it would normally be when using `predict()`. However, if you replaced only the second half of `y_pred` with `NaN`, the function would leave the numerical values in the first half unmodified, but forecast the `NaN` values in the second half. The function returns both the forecasted values and the aligned features.

You can also use the `forecast_destination` parameter in the `forecast()` function to forecast values up until a specified date.

```python
label_query = test_labels.copy().astype(np.float)
label_query.fill(np.nan)
label_fcst, data_trans = fitted_pipeline.forecast(
    test_data, label_query, forecast_destination=pd.Timestamp(2019, 1, 8))
```

Calculate RMSE (root mean squared error) between the `actual_labels` actual values, and the forecasted values in `predict_labels`.

```python
from sklearn.metrics import mean_squared_error
from math import sqrt

rmse = sqrt(mean_squared_error(actual_lables, predict_labels))
rmse
```

Now that the overall model accuracy has been determined, the most realistic next step is to use the model to forecast unknown future values. Simply supply a data set in the same format as the test set `test_data` but with future datetimes, and the resulting prediction set is the forecasted values for each time-series step. Assume the last time-series records in the data set were for 12/31/2018. To forecast demand for the next day (or as many periods as you need to forecast, <= `max_horizon`), create a single time series record for each store for 01/01/2019.

    day_datetime,store,week_of_year
    01/01/2019,A,1
    01/01/2019,A,1

Repeat the necessary steps to load this future data to a dataframe and then run `best_run.predict(test_data)` to predict future values.

> [!NOTE]
> Values cannot be predicted for number of periods greater than the `max_horizon`. The model must be re-trained with a larger horizon to predict future values beyond
> the current horizon.

## Next steps

* Follow the [tutorial](tutorial-auto-train-models.md) to learn how to create experiments with automated machine learning.
* View the [Azure Machine Learning SDK for Python](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py) reference documentation.
