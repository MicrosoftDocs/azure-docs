---
title: Auto-train a time-series forecast model
titleSuffix: Azure Machine Learning
description: Learn how to use Azure Machine Learning to train a time-series forecasting regression model using automated machine learning.
services: machine-learning
author: nibaccam
ms.author: nibaccam
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom: contperf-fy21q1, automl
ms.date: 08/20/2020
---

# Auto-train a time-series forecast model


In this article, you learn how to configure and train a time-series forecasting regression model using automated machine learning, AutoML, in the [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/). 

To do so, you: 

> [!div class="checklist"]
> * Prepare data for time series modeling.
> * Configure specific time-series parameters in an [`AutoMLConfig`](/python/api/azureml-train-automl-client/azureml.train.automl.automlconfig.automlconfig) object.
> * Run predictions with time-series data.

For a low code experience, see the [Tutorial: Forecast demand with automated machine learning](tutorial-automated-ml-forecast.md) for a time-series forecasting example using automated machine learning in the [Azure Machine Learning studio](https://ml.azure.com/).

Unlike classical time series methods, in automated ML, past time-series values are "pivoted" to become additional dimensions for the regressor together with other predictors. This approach incorporates multiple contextual variables and their relationship to one another during training. Since multiple factors can influence a forecast, this method aligns itself well with real world forecasting scenarios. For example, when forecasting sales, interactions of historical trends, exchange rate, and price all jointly drive the sales outcome. 

## Prerequisites

For this article you need, 

* An Azure Machine Learning workspace. To create the workspace, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

* This article assumes some familiarity with setting up an automated machine learning experiment. Follow the [tutorial](tutorial-auto-train-models.md) or [how-to](how-to-configure-auto-train.md) to see the main automated machine learning experiment design patterns.

## Preparing data

The most important difference between a forecasting regression task type and regression task type within AutoML is including a feature in your data that represents a valid time series. A regular time series has a well-defined and consistent frequency and has a value at every sample point in a continuous time span. 

Consider the following snapshot of a file `sample.csv`.
This data set is of daily sales data for a company that has two different stores, A, and B. 

Additionally, there are features for

 *  `week_of_year`: allows the model to detect weekly seasonality.
* `day_datetime`: represents a clean time series with daily frequency.
* `sales_quantity`: the target column for running predictions. 

```output
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
```


Read the data into a Pandas dataframe, then use the `to_datetime` function to ensure the time series is a `datetime` type.

```python
import pandas as pd
data = pd.read_csv("sample.csv")
data["day_datetime"] = pd.to_datetime(data["day_datetime"])
```

In this case, the data is already sorted ascending by the time field `day_datetime`. However, when setting up an experiment, ensure the desired time column is sorted in ascending order to build a valid time series. 

The following code, 
* Assumes the data contains 1,000 records, and makes a deterministic split in the data to create training and test data sets. 
* Identifies the label column as `sales_quantity`.
* Separates the label field from `test_data` to form the `test_target` set.

```python
train_data = data.iloc[:950]
test_data = data.iloc[-50:]

label =  "sales_quantity"
 
test_labels = test_data.pop(label).values
```

> [!IMPORTANT]
> When training a model for forecasting future values, ensure all the features used in training can be used when running predictions for your intended horizon. <br> <br>For example, when creating a demand forecast, including a feature for current stock price could massively increase training accuracy. However, if you intend to forecast with a long horizon, you may not be able to accurately predict future stock values corresponding to future time-series points, and model accuracy could suffer.

<a name="config"></a>

## Training and validation data

You can specify separate train and validation sets directly in the `AutoMLConfig` object.   Learn more about the [AutoMLConfig](#configure-experiment).

For time series forecasting, only **Rolling Origin Cross Validation (ROCV)** is  used for validation by default. Pass the training and validation data together, and set the number of cross validation folds with the `n_cross_validations` parameter in your `AutoMLConfig`. ROCV divides the series into training and validation data using an origin time point. Sliding the origin in time generates the cross-validation folds. This strategy preserves the time series data integrity and eliminates the risk of data leakage

![rolling origin cross validation](./media/how-to-auto-train-forecast/ROCV.svg)

You can also bring your own validation data, learn more in [Configure data splits and cross-validation in AutoML](how-to-configure-cross-validation-data-splits.md#provide-validation-data).


```python
automl_config = AutoMLConfig(task='forecasting',
                             n_cross_validations=3,
                             ...
                             **time_series_settings)
```

Learn more about how AutoML applies cross validation to [prevent over-fitting models](concept-manage-ml-pitfalls.md#prevent-over-fitting).

## Configure experiment

The [`AutoMLConfig`](/python/api/azureml-train-automl-client/azureml.train.automl.automlconfig.automlconfig) object defines the settings and data necessary for an automated machine learning task. Configuration for a forecasting model is similar to the setup of a standard regression model, but certain models, configuration options, and featurization steps exist specifically for time-series data. 

### Supported models
Automated machine learning automatically tries different models and algorithms as part of the model creation and tuning process. As a user, there is no need for you to specify the algorithm. For forecasting experiments, both native time-series and deep learning models are part of the recommendation system. The following table summarizes this subset of models. 

>[!Tip]
> Traditional regression models are also tested as part of the recommendation system for forecasting experiments. See the [supported model table](how-to-configure-auto-train.md#supported-models) for the full list of models. 

Models| Description | Benefits
----|----|---
Prophet (Preview)|Prophet works best with time series that have strong seasonal effects and several seasons of historical data. To leverage this model, install it locally using `pip install fbprophet`. | Accurate & fast, robust to outliers, missing data, and dramatic changes in your time series.
Auto-ARIMA (Preview)|Auto-Regressive Integrated Moving Average (ARIMA) performs best, when the data is stationary. This means that its statistical properties like the mean and variance are constant over the entire set. For example, if you flip a coin, then the probability of you getting heads is 50%, regardless if you flip today, tomorrow, or next year.| Great for univariate series, since the past values are used to predict the future values.
ForecastTCN (Preview)| ForecastTCN is a neural network model designed to tackle the most demanding forecasting tasks. It captures nonlinear local and global trends in your data and relationships between time series.|Capable of leveraging complex trends in your data and readily scales to the largest of datasets.

### Configuration settings

Similar to a regression problem, you define standard training parameters like task type, number of iterations, training data, and number of cross-validations. For forecasting tasks, there are additional parameters that must be set that affect the experiment. 

The following table summarizes these additional parameters. See the [ForecastingParameter class reference documentation](/python/api/azureml-automl-core/azureml.automl.core.forecasting_parameters.forecastingparameters) for syntax design patterns.

| Parameter&nbsp;name | Description | Required |
|-------|-------|-------|
|`time_column_name`|Used to specify the datetime column in the input data used for building the time series and inferring its frequency.|✓|
|`forecast_horizon`|Defines how many periods forward you would like to forecast. The horizon is in units of the time series frequency. Units are based on the time interval of your training data, for example, monthly, weekly that the forecaster should predict out.|✓|
|`enable_dnn`|[Enable Forecasting DNNs]().||
|`time_series_id_column_names`|The column name(s) used to uniquely identify the time series in data that has multiple rows with the same timestamp. If time series identifiers are not defined, the data set is assumed to be one time-series. To learn more about single time-series, see the [energy_demand_notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/automated-machine-learning/forecasting-energy-demand).||
|`freq`| The time series dataset frequency. This parameter represents the period with which events are expected to occur, such as daily, weekly, yearly, etc. The frequency must be a [pandas offset alias](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#dateoffset-objects). Learn more about [frequency].(#frequency--target-data-aggregation)||
|`target_lags`|Number of rows to lag the target values based on the frequency of the data. The lag is represented as a list or single integer. Lag should be used when the relationship between the independent variables and dependent variable doesn't match up or correlate by default. ||
|`feature_lags`| The features to lag will be automatically decided by automated ML when `target_lags` are set and `feature_lags` is set to `auto`. Enabling feature lags may help to improve accuracy. Feature lags are disabled by default. ||
|`target_rolling_window_size`|*n* historical periods to use to generate forecasted values, <= training set size. If omitted, *n* is the full training set size. Specify this parameter when you only want to consider a certain amount of history when training the model. Learn more about [target rolling window aggregation](#target-rolling-window-aggregation).||
|`short_series_handling_config`| Enables short time series handling to avoid failing during training due to insufficient data. Short series handling is set to `auto` by default. Learn more about [short series handling](#short-series-handling).||
|`target_aggregation_function`| The function to be used to aggregate the time series target column to conform to the frequency specified via the `freq` parameter. The `freq` parameter must be set, in order to use the `target_aggregation_function`. Defaults to `None`; for most scenarios using `sum` is sufficient.<br> Learn more about [target column aggregation](#frequency--target-data-aggregation). 


The following code, 
* Leverages the [`ForecastingParameters`](/python/api/azureml-automl-core/azureml.automl.core.forecasting_parameters.forecastingparameters) class to define the forecasting parameters for your experiment training
* Sets the `time_column_name` to the `day_datetime` field in the data set. 
* Defines the `time_series_id_column_names` parameter to `"store"`. This ensures that **two separate time-series groups** are created for the data; one for store A and B.
* Sets the `forecast_horizon` to 50 in order to predict for the entire test set. 
* Sets a forecast window to 10 periods with `target_rolling_window_size`
* Specifies a single lag on the target values for two periods ahead with the `target_lags` parameter. 
* Sets `target_lags` to the recommended "auto" setting, which will automatically detect this value for you.

```python
from azureml.automl.core.forecasting_parameters import ForecastingParameters

forecasting_parameters = ForecastingParameters(time_column_name='day_datetime', 
                                               forecast_horizon=50,
                                               time_series_id_column_names=["store"],
                                               freq='W',
                                               target_lags='auto',
                                               target_rolling_window_size=10)
                                              
```

These `forecasting_parameters` are then passed into your standard `AutoMLConfig` object along with the `forecasting` task type, primary metric, exit criteria, and training data. 

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
                             **forecasting_parameters)
```

The amount of data required to successfully train a forecasting model with automated ML is influenced by the `forecast_horizon`, `n_cross_validations`, and `target_lags` or `target_rolling_window_size` values specified when you configure your `AutoMLConfig`. 

The following formula calculates the amount of historic data that what would be needed to construct time series features.

Minimum historic data required: (2x `forecast_horizon`) + #`n_cross_validations` + max(max(`target_lags`), `target_rolling_window_size`)

An Error exception will be raised for any series in the dataset that does not meet the required amount of historic data for the relevant settings specified. 

### Featurization steps

In every automated machine learning experiment, automatic scaling and normalization techniques are applied to your data by default. These techniques are types of **featurization** that help *certain* algorithms that are sensitive to features on different scales. Learn more about default featurization steps in [Featurization in AutoML](how-to-configure-auto-features.md#automatic-featurization)

However, the following steps are performed only for `forecasting` task types:

* Detect time-series sample frequency (for example, hourly, daily, weekly) and create new records for absent time points to make the series continuous.
* Impute missing values in the target (via forward-fill) and feature columns (using median column values)
* Create features based on time series identifiers to enable fixed effects across different series
* Create time-based features to assist in learning seasonal patterns
* Encode categorical variables to numeric quantities

To get a summary of what features are created as result of these steps, see [Featurization transparency](how-to-configure-auto-features.md#featurization-transparency)

> [!NOTE]
> Automated machine learning featurization steps (feature normalization, handling missing data,
> converting text to numeric, etc.) become part of the underlying model. When using the model for
> predictions, the same featurization steps applied during training are applied to
> your input data automatically.

#### Customize featurization

You also have the option to customize your featurization settings to ensure that the data and features that are used to train your ML model result in relevant predictions. 

Supported customizations for `forecasting` tasks include:

|Customization|Definition|
|--|--|
|**Column purpose update**|Override the auto-detected feature type for the specified column.|
|**Transformer parameter update** |Update the parameters for the specified transformer. Currently supports *Imputer* (fill_value and median).|
|**Drop columns** |Specifies columns to drop from being featurized.|

To customize featurizations with the SDK, specify `"featurization": FeaturizationConfig` in your `AutoMLConfig` object. Learn more about [custom featurizations](how-to-configure-auto-features.md#customize-featurization).

>[!NOTE]
> The **drop columns** functionality is deprecated as of SDK version 1.19. Drop columns from your dataset as part of data cleansing, prior to consuming it in your automated ML experiment. 

```python
featurization_config = FeaturizationConfig()

# `logQuantity` is a leaky feature, so we remove it.
featurization_config.drop_columns = ['logQuantitity']

# Force the CPWVOL5 feature to be of numeric type.
featurization_config.add_column_purpose('CPWVOL5', 'Numeric')

# Fill missing values in the target column, Quantity, with zeroes.
featurization_config.add_transformer_params('Imputer', ['Quantity'], {"strategy": "constant", "fill_value": 0})

# Fill mising values in the `INCOME` column with median value.
featurization_config.add_transformer_params('Imputer', ['INCOME'], {"strategy": "median"})
```

If you're using the Azure Machine Learning studio for your experiment, see [how to customize featurization in the studio](how-to-use-automated-ml-for-ml-models.md#customize-featurization).

## Optional configurations

Additional optional configurations are available for forecasting tasks, such as enabling deep learning and specifying a target rolling window aggregation. 

### Frequency & target data aggregation

Leverage the frequency, `freq`, parameter to help avoid failures caused by irregular data, that is data that doesn't follow a set cadence, like hourly or daily data. 

For highly irregular data or for varying business needs, users can optionally set their desired forecast frequency, `freq`, and specify the `target_aggregation_function` to aggregate the target column of the time series. Leverage these two settings in your `AutoMLConfig` object can help save some time on data preparation. 

When the `target_aggregation_function` parameter is used,
* The target column values are aggregated based on the specified operation. Typically, `sum` is appropriate for most scenarios.

* Numerical predictor columns in your data are aggregated by sum, mean, minimum value, and maximum value. As a result, automated ML generates new columns suffixed with the aggregation function name and applies the selected aggregate operation. 

* For categorical predictor columns, the data is aggregated by mode, the most prominent category in the window.

* Date predictor columns are aggregated by minimum value, maximum value and mode. 

Supported aggregation operations for target column values include:

|Function | description
|---|---
|`sum`| Sum of target values
|`mean`| Mean or average of target values
|`min`| Minimum value of a target  
|`max`| Maximum value of a target  

### Enable deep learning

> [!NOTE]
> DNN support for forecasting in Automated Machine Learning is in **preview** and not supported for local runs.

You can also apply deep learning with deep neural networks, DNNs, to improve the scores of your model. Automated ML's deep learning allows for forecasting univariate and multivariate time series data.

Deep learning models have three intrinsic capabilities:
1. They can learn from arbitrary mappings from inputs to outputs
1. They support multiple inputs and outputs
1. They can automatically extract patterns in input data that spans over long sequences. 

To enable deep learning, set the `enable_dnn=True` in the `AutoMLConfig` object.

```python
automl_config = AutoMLConfig(task='forecasting',
                             enable_dnn=True,
                             ...
                             **forecasting_parameters)
```
> [!Warning]
> When you enable DNN for experiments created with the SDK, [best model explanations](how-to-machine-learning-interpretability-automl.md) are disabled.

To enable DNN for an AutoML experiment created in the Azure Machine Learning studio, see the [task type settings in the studio how-to](how-to-use-automated-ml-for-ml-models.md#create-and-run-experiment).

View the [Beverage Production Forecasting notebook](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-beer-remote/auto-ml-forecasting-beer-remote.ipynb) for a detailed code example using DNNs.

### Target rolling window aggregation
Often the best information a forecaster can have is the recent value of the target.  Target rolling window aggregations allow you to add a rolling aggregation of data values as features. Generating and using these features as extra contextual data helps with the accuracy of the train model.

For example, say you want to predict energy demand. You might want to add a rolling window feature of three days to account for thermal changes of heated spaces. In this example, create this window by setting `target_rolling_window_size= 3` in the `AutoMLConfig` constructor. 

The table shows resulting feature engineering that occurs when window aggregation is applied. Columns for **minimum, maximum,** and **sum** are generated on a sliding window of three based on the defined settings. Each row has a new calculated feature, in the case of the timestamp for September 8, 2017 4:00am the maximum, minimum, and sum values are calculated using the **demand values** for September 8, 2017 1:00AM - 3:00AM. This window of three shifts along to populate data for the remaining rows.

![target rolling window](./media/how-to-auto-train-forecast/target-roll.svg)

View a Python code example applying the [target rolling window aggregate feature](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-energy-demand/auto-ml-forecasting-energy-demand.ipynb).

### Short series handling

Automated ML considers a time series a **short series** if there are not enough data points to conduct the train and validation phases of model development. The number of data points varies for each experiment, and depends on  the max_horizon, the number of cross validation splits, and the length of the model lookback, that is the maximum of history that's needed to construct the time-series features. For the exact calculation, see the [short_series_handling_configuration reference documentation](/python/api/azureml-automl-core/azureml.automl.core.forecasting_parameters.forecastingparameters#short-series-handling-configuration).

Automated ML offers short series handling by default with the `short_series_handling_configuration` parameter in the `ForecastingParameters` object. 

To enable short series handling,  the `freq` parameter must also be defined. To define an hourly frequency, we will set `freq='H'`. View the frequency string options [here](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#dateoffset-objects). To change the default behavior, `short_series_handling_configuration = 'auto'`, update the `short_series_handling_configuration` parameter in your `ForecastingParameter` object.  

```python
from azureml.automl.core.forecasting_parameters import ForecastingParameters

forecast_parameters = ForecastingParameters(time_column_name='day_datetime', 
                                            forecast_horizon=50,
                                            short_series_handling_configuration='auto',
                                            freq = 'H',
                                            target_lags='auto')
```
The following table summarizes the available settings for `short_series_handling_config`.
 
|Setting|Description
|---|---
|`auto`| The following is the default behavior for short series handling <li> *If all series are short*, pad the data. <br> <li> *If not all series are short*, drop the short series. 
|`pad`| If `short_series_handling_config = pad`, then automated ML adds random values to each short series found. The following lists the column types and what they are padded with: <li>Object columns with NaNs <li> Numeric columns  with 0 <li> Boolean/logic columns with False <li> The target column is padded with random values with mean of zero and standard deviation of 1. 
|`drop`| If `short_series_handling_config = drop`, then automated ML drops the short series, and it will not be used for training or prediction. Predictions for these series will return NaN's.
|`None`| No series is padded or dropped

>[!WARNING]
>Padding may impact the accuracy of the resulting model, since we are introducing artificial data just to get past training without failures. <br> <br> If many of the series are short, then you may also see some impact in explainability results

## Run the experiment 

When you have your `AutoMLConfig` object ready, you can submit the experiment. After the model finishes, retrieve the best run iteration.

```python
ws = Workspace.from_config()
experiment = Experiment(ws, "Tutorial-automl-forecasting")
local_run = experiment.submit(automl_config, show_output=True)
best_run, fitted_model = local_run.get_output()
```
 
## Forecasting with best model

Use the best model iteration to forecast values for the test data set.

The `forecast()` function allows specifications of when predictions should start, unlike the `predict()`, which is typically used for classification and regression tasks.

In the following example, you first replace all values in `y_pred` with `NaN`. The forecast origin will be at the end of training data in this case. However, if you replaced only the second half of `y_pred` with `NaN`, the function would leave the numerical values in the first half unmodified, but forecast the `NaN` values in the second half. The function returns both the forecasted values and the aligned features.

You can also use the `forecast_destination` parameter in the `forecast()` function to forecast values up until a specified date.

```python
label_query = test_labels.copy().astype(np.float)
label_query.fill(np.nan)
label_fcst, data_trans = fitted_model.forecast(
    test_data, label_query, forecast_destination=pd.Timestamp(2019, 1, 8))
```

Calculate root mean squared error (RMSE) between the `actual_labels` actual values, and the forecasted values in `predict_labels`.

```python
from sklearn.metrics import mean_squared_error
from math import sqrt

rmse = sqrt(mean_squared_error(actual_labels, predict_labels))
rmse
```

Now that the overall model accuracy has been determined, the most realistic next step is to use the model to forecast unknown future values. 

Supply a data set in the same format as the test set `test_data` but with future datetimes, and the resulting prediction set is the forecasted values for each time-series step. Assume the last time-series records in the data set were for 12/31/2018. To forecast demand for the next day (or as many periods as you need to forecast, <= `forecast_horizon`), create a single time series record for each store for 01/01/2019.

```output
day_datetime,store,week_of_year
01/01/2019,A,1
01/01/2019,A,1
```

Repeat the necessary steps to load this future data to a dataframe and then run `best_run.forecast(test_data)` to predict future values.

> [!NOTE]
> In-sample predictions are not supported for forecasting with automated ML when `target_lags` and/or `target_rolling_window_size` are enabled.


## Example notebooks
See the [forecasting sample notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/automated-machine-learning) for detailed code examples of advanced forecasting configuration including:

* [holiday detection and featurization](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-bike-share/auto-ml-forecasting-bike-share.ipynb)
* [rolling-origin cross validation](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-energy-demand/auto-ml-forecasting-energy-demand.ipynb)
* [configurable lags](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-bike-share/auto-ml-forecasting-bike-share.ipynb)
* [rolling window aggregate features](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-energy-demand/auto-ml-forecasting-energy-demand.ipynb)
* [DNN](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/forecasting-beer-remote/auto-ml-forecasting-beer-remote.ipynb)

## Next steps

* Learn more about [how and where to deploy a model](how-to-deploy-and-where.md).
* Learn about [Interpretability: model explanations in automated machine learning (preview)](how-to-machine-learning-interpretability-automl.md). 
* Learn how to train multiple models with AutoML in the [Many Models Solution Accelerator](https://aka.ms/many-models).
* Follow the [tutorial](tutorial-auto-train-models.md) for an end to end example for creating experiments with automated machine learning.
