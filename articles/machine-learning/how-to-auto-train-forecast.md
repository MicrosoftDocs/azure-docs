---
title: Set up AutoML for time-series forecasting
titleSuffix: Azure Machine Learning
description: Set up Azure Machine Learning automated ML to train time-series forecasting models with the Azure Machine Learning Python SDK.
services: machine-learning
author: EricWrightAtWork 
ms.author: erwright
ms.reviewer: ssalgado 
ms.service: machine-learning
ms.subservice: automl
ms.topic: how-to
ms.custom: contperf-fy21q1, automl, FY21Q4-aml-seo-hack, sdkv2, event-tier1-build-2022
ms.date: 11/18/2021
show_latex: true
---

# Set up AutoML to train a time-series forecasting model with Python

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

In this article, you'll learn how to set up AutoML training for time-series forecasting models with Azure Machine Learning automated ML in the [Azure Machine Learning Python SDK](/python/api/overview/azure/ai-ml-readme).

To do so, you: 

> [!div class="checklist"]
> * Prepare data for training.
> * Configure specific time-series parameters in a [Forecasting Job](/python/api/azure-ai-ml/azure.ai.ml.automl.forecastingjob).
> * Get predictions from trained time-series models.

For a low code experience, see the [Tutorial: Forecast demand with automated machine learning](tutorial-automated-ml-forecast.md) for a time-series forecasting example using automated ML in the [Azure Machine Learning studio](https://ml.azure.com/).

AutoML uses standard machine learning models along with well-known time series models to create forecasts. Our approach incorporates multiple contextual variables and their relationship to one another during training. Since multiple factors can influence a forecast, this method aligns itself well with real world forecasting scenarios. For example, when forecasting sales, interactions of historical trends, exchange rate, and price can all jointly drive the sales outcome. For more details, see our article on [forecasting methods](./concept-automl-forecasting-methods.md). 

## Prerequisites

For this article you need, 

* An Azure Machine Learning workspace. To create the workspace, see [Create workspace resources](quickstart-create-resources.md).

* The ability to launch AutoML training jobs. Follow the [how-to guide for setting up AutoML](how-to-configure-auto-train.md) for details.

    [!INCLUDE [automl-sdk-version](../../includes/machine-learning-automl-sdk-version.md)]

## Training and validation data

Input data for AutoML forecasting must contain valid time series in tabular format. Each variable must have its own corresponding column in the data table. AutoML requires at least two columns: a **time column** representing the time axis and the **target column** which is the quantity to forecast. Additional columns can serve as predictors. For more details, see [how AutoML uses your data](./concept-automl-forecasting-methods.md#how-automl-uses-your-data). 

> [!IMPORTANT]
> When training a model for forecasting future values, ensure all the features used in training can be used when running predictions for your intended horizon. <br> <br>For example, when creating a demand forecast, including a feature for current stock price could massively increase training accuracy. However, if you intend to forecast with a long horizon, you may not be able to accurately predict future stock values corresponding to future time-series points, and model accuracy could suffer.

AutoML forecasting jobs require that your training data is represented as an **MLTable** object. An MLTable specifies a data source and steps for loading the data. For more information and use cases, see the [MLTable how-to guide](./how-to-mltable.md). As a simple example, suppose your training data is contained in a CSV file in a local directory, `./train_data/timeseries_train.csv`. You can define a new MLTable by copying the following YAML code to a new file, `./train_data/MLTable`:

```yml
$schema: https://azuremlschemas.azureedge.net/latest/MLTable.schema.json

type: mltable
paths:
    - file: ./timeseries_train.csv

transformations:
    - read_delimited:
        delimiter: ','
        encoding: ascii
```

You can now define an input data object, which is required to start a training job, using the AzureML Python SDK as follows: 

```python
from azure.ai.ml.constants import AssetTypes
from azure.ai.ml import Input

# Training MLTable defined locally, with local data to be uploaded
my_training_data_input = Input(
    type=AssetTypes.MLTABLE, path="./train_data"
)
```

You can specify [validation data](concept-automated-ml.md#training-validation-and-test-data) in a similar way, by creating a MLTable and an input data object. Alternatively, if you do not supply validation data, AutoML automatically creates cross-validation splits from your training data to use for model selection. See our article on [forecasting model selection](./concept-automl-forecasting-sweeping.md#model-selection) for more details. Also see [training data length requirements](./concept-automl-forecasting-methods.md#data-length-requirements) for details on the how much training data you need to successfully train a forecasting model.

Learn more about how AutoML applies cross validation to [prevent over fitting](concept-manage-ml-pitfalls.md#prevent-overfitting).

## Compute to run experiment
AutoML leverages AzureML compute which is a fully managed compute resource that can be used to run the training job. In the following example, a compute cluster named `cpu-compute` is created:

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/configuration.ipynb?name=create-cpu-compute)]

## Configure experiment

There are several options that you can use to configure your AutoML forecasting experiment. These configuration parameters are set in the automl.forecasting() task method. You can also set job training settings and exit criteria with the set_training() and set_limits() functions, respectively.

The following example shows the required parameters for a forecasting task with normalized root mean squared error as the primary metric with the number of cross-validation folds to be automatically determined from the training data.

```python
from azure.ai.ml import automl

# note that the below is a code snippet -- you might have to modify the variable values to run it successfully
forecasting_job = automl.forecasting(
    compute=compute_name,
    experiment_name=exp_name,
    training_data=my_training_data_input,
    target_column_name=target_column_name,
    primary_metric="NormalizedRootMeanSquaredError",
    n_cross_validations="auto",
)

# Limits are all optional
forecasting_job.set_limits(
    timeout_minutes=120,
    trial_timeout_minutes=30,
    max_concurrent_trials=4,
)
```

### Configuration settings
Forecasting tasks have many settings that are specific to forecasting. To set these, use the set_forecast_settings() method of a ForecastingJob. In the following example, we provide the name of the time column in the training data and set the forecast horizon: 

```python
# Forecasting specific configuration
forecasting_job.set_forecast_settings(
    time_column_name=time_column_name,
    forecast_horizon=24
)
```

The time column name is a required setting and you should generally set the forecast horizon according to your prediction scenario. Other settings are optional and reviewed in the [optional settings](#optional-configurations) section.

### Optional configurations

Additional optional configurations are available for forecasting tasks, such as enabling deep learning and specifying a target rolling window aggregation. A complete list of additional parameters is available in the [forecast_settings API doc](/python/api/azure-ai-ml/azure.ai.ml.automl.forecastingjob#azure-ai-ml-automl-forecastingjob-set-forecast-settings) for a full list of settings.

#### Enable deep learning

AutoML ships with a custom deep neural network (DNN) model called `ForecastTCN`. This model is a [temporal convolutional network](https://arxiv.org/abs/1803.01271), or TCN, that applies common imaging task methods to time series modeling. Namely, one-dimensional "causal" convolutions form the backbone of the network and enable the model to learn complex patterns over long durations in the training history.  

:::image type="content" source="media/how-to-auto-train-forecast/TCN-basic.png" alt-text="Diagram showing major components of AutoML's ForecastTCN.":::

The ForecastTCN often achieves higher accuracy than standard time series models when there are thousands or more observations in the training history. However, it also takes longer to train and sweep over ForecastTCN models due to their higher capacity.

You can enable the ForecastTCN in AutoML by setting the `enable_dnn_training` flag in the set_training() method as follows:

```python
# Include ForecastTCN models in the model search
forecasting_job.set_training(
    enable_dnn_training=True
)
```

To enable DNN for an AutoML experiment created in the Azure Machine Learning studio, see the [task type settings in the studio UI how-to](how-to-use-automated-ml-for-ml-models.md#create-and-run-experiment).

> [!NOTE]
> * When you enable DNN for experiments created with the SDK, [best model explanations](how-to-machine-learning-interpretability-automl.md) are disabled.
> * DNN support for forecasting in Automated Machine Learning is not supported for runs initiated in Databricks.
> * GPU compute types are recommended when DNN training is enabled 

#### Target rolling window aggregation

Recent values of the target are often impactful features in a forecasting model. Rolling window aggregations allow you to add rolling aggregations of data values as features. Generating and using these features as extra contextual data helps with the accuracy of the train model.

Consider an energy demand forecasting scenario where weather data and historical demand are available.
The table shows resulting feature engineering that occurs when window aggregation over the most recent three hours is applied. Columns for **minimum, maximum,** and **sum** are generated on a sliding window of three based on the defined settings. Each row has a new calculated feature, in the case of the timestamp for September 8, 2017 4:00am the maximum, minimum, and sum values are calculated using the **demand values** for September 8, 2017 1:00AM - 3:00AM. This window of three shifts along to populate data for the remaining rows.

![target rolling window](./media/how-to-auto-train-forecast/target-roll.svg)

You can enable rolling window aggregation features and set the window size through the set_forecast_settings() method. In the following sample, we set the window size to "auto" so that AutoML will automatically determine a good value through data heuristics. 

```python
forecasting_job.set_forecast_settings(
    ...,  # other settings
    target_rolling_window_size='auto'
)
```

#### Short series handling

Automated ML considers a time series a **short series** if there are not enough data points to conduct the train and validation phases of model development. See [training data length requirements](./concept-automl-forecasting-methods.md#data-length-requirements) for more details on length requirements.

AutoML has several actions it can take for short series. These are configurable with the `short_series_handling_config` setting. The default value is "auto." The following table describes the settings:

|Setting|Description
|---|---
|`auto`| This is the default value of the setting. <li> *If all series are short*, pad the data. <br> <li> *If not all series are short*, drop the short series. 
|`pad`| If `short_series_handling_config = pad`, then automated ML adds random values to each short series found. The following lists the column types and what they are padded with: <li>Object columns with NaNs <li> Numeric columns  with 0 <li> Boolean/logic columns with False <li> The target column is padded with random values with mean of zero and standard deviation of 1. 
|`drop`| If `short_series_handling_config = drop`, then automated ML drops the short series, and it will not be used for training or prediction. Predictions for these series will return NaN's.
|`None`| No series is padded or dropped

In the following example, we set the short series handling so that all short series are padded to the minimum length:

```python
forecasting_job.set_forecast_settings(
    ...,  # other settings
    short_series_handling_config='pad'
)
```

>[!WARNING]
>Padding may impact the accuracy of the resulting model, since we are introducing artificial data just to get past training without failures. <br> <br> If many of the series are short, then you may also see some impact in explainability results

#### Frequency & target data aggregation

Leverage the frequency and data aggregation options to avoid failures caused by irregular data. Your data is irregular if it doesn't follow a set cadence in time, like hourly or daily. Point-of-sales data is a good example of irregular data. In these cases, AutoML can aggregate your data to a desired frequency and then build a forecasting model from the aggregates. 

You need to set the `frequency` and `target_aggregate_function` settings to handle irregular data. The frequency settings accepts [Pandas DateOffset strings](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#dateoffset-objects) as input. Supported values for the aggregation function are:

|Function | Description
|---|---
|`sum`| Sum of target values
|`mean`| Mean or average of target values
|`min`| Minimum value of a target  
|`max`| Maximum value of a target  

* The target column values are aggregated based on the specified operation. Typically, sum is appropriate for most scenarios.
* Numerical predictor columns in your data are aggregated by sum, mean, minimum value, and maximum value. As a result, automated ML generates new columns suffixed with the aggregation function name and applies the selected aggregate operation.
* For categorical predictor columns, the data is aggregated by mode, the most prominent category in the window.
* Date predictor columns are aggregated by minimum value, maximum value and mode.

The following example sets the frequency to hourly and the aggregation function to summation:

```python
# Aggregate the data to hourly frequency
forecasting_job.set_forecast_settings(
    ...,  # other settings
    frequency='H',
    target_aggregate_function='sum'
)
```

### Custom featurization

By default, AutoML augments training data with engineered features to increase the accuracy of the models. See [automated feature engineering](./concept-automl-forecasting-methods.md#automated-feature-engineering) for information. Some of the preprocessing steps can be customized using the `set_featurization()` method of the forecasting job.

Supported customizations for forecasting include:

|Customization|Definition|
|--|--|
|**Column purpose update**|Override the auto-detected feature type for the specified column.|
|**Transformer parameter update**|Update the parameters for the specified *Imputer* (fill_value and median).|

For example, suppose you have a retail demand scenario where the data includes features like price, an "on sale" flag, and a product type. The following sample shows how you can set customized types and imputers for these features:

```python
from azure.ai.ml.automl import ColumnTransformer

# Customize imputation methods for price and is_on_sale features
# Median value imputation for price, constant value of zero for is_on_sale
transformer_params = {
    "imputer": [
        ColumnTransformer(fields=["price"], parameters={"strategy": "median"}),
        ColumnTransformer(fields=["is_on_sale"], parameters={"strategy": "constant", "fill_value": 0}),
    ],
}

# Set the featurization
# Ensure that product_type feature is interpreted as categorical
forecasting_job.set_featurization(
    mode="custom",
    transformer_params=transformer_params,
    column_name_and_types={"product_type": "Categorical"},
)
```

If you're using the Azure Machine Learning studio for your experiment, see [how to customize featurization in the studio](how-to-use-automated-ml-for-ml-models.md#customize-featurization).

## Run the experiment 

After all settings are configured, you can launch the forecasting job via the `mlcient` as follows:

```python
# Submit the AutoML job
returned_job = ml_client.jobs.create_or_update(
    forecasting_job
)

print(f"Created job: {returned_job}")
``` 
 
## Forecasting with a trained model

Use the best model iteration to forecast values for data that wasn't used to train the model.
  
### Evaluating model accuracy with a rolling forecast

Before you put a model into production, you should evaluate its accuracy on a test set held out from the training data. A best practice procedure is a so-called rolling evaluation which rolls the trained forecaster forward in time over the test set, averaging error metrics over several prediction windows to obtain statistically robust estimates for some set of chosen metrics. Ideally, the test set for the evaluation is long relative to the model's forecast horizon. Estimates of forecasting error may otherwise be statistically noisy and, therefore, less reliable.

For example, suppose you train a model on daily sales to predict demand up to two weeks (14 days) into the future. If there is sufficient historic data available, you might reserve the final several months to even a year of the data for the test set. The rolling evaluation begins by generating a 14-day-ahead forecast for the first two weeks of the test set. Then, the forecaster is advanced by some number of days into the test set and you generate another 14-day-ahead forecast from the new position. The process continues until you get to the end of the test set.

To do a rolling evaluation, you call the `rolling_forecast` method of the `fitted_model`, then compute desired metrics on the result. For example, assume you have test set features in a pandas DataFrame called `test_features_df` and the test set actual values of the target in a numpy array called `test_target`. A rolling evaluation using the mean squared error is shown in the following code sample:

```python
from sklearn.metrics import mean_squared_error
rolling_forecast_df = fitted_model.rolling_forecast(
    test_features_df, test_target, step=1)
mse = mean_squared_error(
    rolling_forecast_df[fitted_model.actual_column_name], rolling_forecast_df[fitted_model.forecast_column_name])
```

In this sample, the step size for the rolling forecast is set to one which means that the forecaster is advanced one period, or one day in our demand prediction example, at each iteration. The total number of forecasts returned by `rolling_forecast` thus depends on the length of the test set and this step size. For more details and examples see the [rolling_forecast() documentation](/python/api/azureml-training-tabular/azureml.training.tabular.models.forecasting_pipeline_wrapper_base.forecastingpipelinewrapperbase#azureml-training-tabular-models-forecasting-pipeline-wrapper-base-forecastingpipelinewrapperbase-rolling-forecast) and the [Forecasting away from training data notebook](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-forecast-function/auto-ml-forecasting-function.ipynb). 
    
### Prediction into the future

The [forecast_quantiles()](/python/api/azureml-train-automl-client/azureml.train.automl.model_proxy.modelproxy#forecast-quantiles-x-values--typing-any--y-values--typing-union-typing-any--nonetype----none--forecast-destination--typing-union-typing-any--nonetype----none--ignore-data-errors--bool---false-----azureml-data-abstract-dataset-abstractdataset) function allows specifications of when predictions should start, unlike the `predict()` method, which is typically used for classification and regression tasks. The forecast_quantiles() method by default generates a point forecast or a mean/median forecast which doesn't have a cone of uncertainty around it. Learn more in the [Forecasting away from training data notebook](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-forecast-function/auto-ml-forecasting-function.ipynb).

In the following example, you first replace all values in `y_pred` with `NaN`. The forecast origin is at the end of training data in this case. However, if you replaced only the second half of `y_pred` with `NaN`, the function would leave the numerical values in the first half unmodified, but forecast the `NaN` values in the second half. The function returns both the forecasted values and the aligned features.

You can also use the `forecast_destination` parameter in the `forecast_quantiles()` function to forecast values up to a specified date.

```python
label_query = test_labels.copy().astype(np.float)
label_query.fill(np.nan)
label_fcst, data_trans = fitted_model.forecast_quantiles(
    test_dataset, label_query, forecast_destination=pd.Timestamp(2019, 1, 8))
```

Often customers want to understand the predictions at a specific quantile of the distribution. For example, when the forecast is used to control inventory like grocery items or virtual machines for a cloud service. In such cases, the control point is usually something like "we want the item to be in stock and not run out 99% of the time". The following demonstrates how to specify which quantiles you'd like to see for your predictions, such as 50th or 95th percentile. If you don't specify a quantile, like in the aforementioned code example, then only the 50th percentile predictions are generated. 

```python
# specify which quantiles you would like 
fitted_model.quantiles = [0.05,0.5, 0.9]
fitted_model.forecast_quantiles(
    test_dataset, label_query, forecast_destination=pd.Timestamp(2019, 1, 8))
```

You can calculate model metrics like, root mean squared error (RMSE) or mean absolute percentage error (MAPE) to help you estimate the models performance. See the Evaluate section of the [Bike share demand notebook](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-bike-share/auto-ml-forecasting-bike-share.ipynb) for an example. 

After the overall model accuracy has been determined, the most realistic next step is to use the model to forecast unknown future values. 

Supply a data set in the same format as the test set `test_dataset` but with future datetimes, and the resulting prediction set is the forecasted values for each time-series step. Assume the last time-series records in the data set were for 12/31/2018. To forecast demand for the next day (or as many periods as you need to forecast, <= `forecast_horizon`), create a single time series record for each store for 01/01/2019.

```output
day_datetime,store,week_of_year
01/01/2019,A,1
01/01/2019,A,1
```

Repeat the necessary steps to load this future data to a dataframe and then run `best_run.forecast_quantiles(test_dataset)` to predict future values.

> [!NOTE]
> In-sample predictions are not supported for forecasting with automated ML when `target_lags` and/or `target_rolling_window_size` are enabled.

## Forecasting at scale

[!INCLUDE [sdk v1](../../includes/machine-learning-sdk-v1.md)]

> [!IMPORTANT]
> Many models and hierarchical time series are currently only supported in AzureML v1. Support for AzureML v2 is in progress.

There are scenarios where a single machine learning model is insufficient and multiple machine learning models are needed. For instance, predicting sales for each individual store for a brand, or tailoring an experience to individual users. Building a model for each instance can lead to improved results on many machine learning problems. 

Grouping is a concept in time series forecasting that allows time series to be combined to train an individual model per group. This approach can be particularly helpful if you have time series which require smoothing, filling or entities in the group that can benefit from history or trends from other entities. Many models and hierarchical time series forecasting are solutions powered by automated machine learning for these large scale forecasting scenarios. 

### Many models

The Azure Machine Learning many models solution with automated machine learning allows users to train and manage millions of models in parallel. Many models The solution accelerator leverages [Azure Machine Learning pipelines](concept-ml-pipelines.md) to train the model. Specifically, a [Pipeline](/python/api/azureml-pipeline-core/azureml.pipeline.core.pipeline%28class%29) object and [ParalleRunStep](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.parallelrunstep) are used and require specific configuration parameters set through the [ParallelRunConfig](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.parallelrunconfig). 


The following diagram shows the workflow for the many models solution. 

![Many models concept diagram](./media/how-to-auto-train-forecast/many-models.svg)

The following code demonstrates the key parameters users need to set up their many models run. See the [Many Models- Automated ML notebook](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-many-models/auto-ml-forecasting-many-models.ipynb) for a many models forecasting example 

```python
from azureml.train.automl.runtime._many_models.many_models_parameters import ManyModelsTrainParameters

partition_column_names = ['Store', 'Brand']
automl_settings = {"task" : 'forecasting',
                   "primary_metric" : 'normalized_root_mean_squared_error',
                   "iteration_timeout_minutes" : 10, #This needs to be changed based on the dataset. Explore how long training is taking before setting this value 
                   "iterations" : 15,
                   "experiment_timeout_hours" : 1,
                   "label_column_name" : 'Quantity',
                   "n_cross_validations" : "auto", # Could be customized as an integer
                   "cv_step_size" : "auto", # Could be customized as an integer
                   "time_column_name": 'WeekStarting',
                   "max_horizon" : 6,
                   "track_child_runs": False,
                   "pipeline_fetch_max_batch_size": 15,}

mm_paramters = ManyModelsTrainParameters(automl_settings=automl_settings, partition_column_names=partition_column_names)

```

### Hierarchical time series forecasting

In most applications, customers have a need to understand their forecasts at a macro and micro level of the business; whether that be predicting sales of products at different geographic locations, or understanding the expected workforce demand for different organizations at a company. The ability to train a machine learning model to intelligently forecast on hierarchy data is essential. 

A hierarchical time series is a structure in which each of the unique series are arranged into a hierarchy based on dimensions such as, geography or product type. The following example shows data with unique attributes that form a hierarchy. Our hierarchy is defined by: the product type such as headphones or tablets, the product category which splits product types into accessories and devices, and the region the products are sold in. 

![Example raw data table for hierarchical data](./media/how-to-auto-train-forecast/hierarchy-data-table.svg)
 
To further visualize this, the leaf levels of the hierarchy contain all the time series with unique combinations of attribute values. Each higher level in the hierarchy considers one less dimension for defining the time series and aggregates each set of child nodes from the lower level into a parent node.
 
![Hierarchy visual for data](./media/how-to-auto-train-forecast/data-tree.svg)

The hierarchical time series solution is built on top of the Many Models Solution and share a similar configuration setup.

The following code demonstrates the key parameters to set up your hierarchical time series forecasting runs. See the [Hierarchical time series- Automated ML notebook](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-hierarchical-timeseries/auto-ml-forecasting-hierarchical-timeseries.ipynb), for an end to end example. 

```python

from azureml.train.automl.runtime._hts.hts_parameters import HTSTrainParameters

model_explainability = True

engineered_explanations = False # Define your hierarchy. Adjust the settings below based on your dataset.
hierarchy = ["state", "store_id", "product_category", "SKU"]
training_level = "SKU"# Set your forecast parameters. Adjust the settings below based on your dataset.
time_column_name = "date"
label_column_name = "quantity"
forecast_horizon = 7


automl_settings = {"task" : "forecasting",
                   "primary_metric" : "normalized_root_mean_squared_error",
                   "label_column_name": label_column_name,
                   "time_column_name": time_column_name,
                   "forecast_horizon": forecast_horizon,
                   "hierarchy_column_names": hierarchy,
                   "hierarchy_training_level": training_level,
                   "track_child_runs": False,
                   "pipeline_fetch_max_batch_size": 15,
                   "model_explainability": model_explainability,# The following settings are specific to this sample and should be adjusted according to your own needs.
                   "iteration_timeout_minutes" : 10,
                   "iterations" : 10,
                   "n_cross_validations" : "auto", # Could be customized as an integer
                   "cv_step_size" : "auto", # Could be customized as an integer
                   }

hts_parameters = HTSTrainParameters(
    automl_settings=automl_settings,
    hierarchy_column_names=hierarchy,
    training_level=training_level,
    enable_engineered_explanations=engineered_explanations
)
```

## Example notebooks

See the [forecasting sample notebooks](https://github.com/Azure/azureml-examples/tree/main/v1/python-sdk/tutorials/automl-with-azureml) for detailed code examples of advanced forecasting configuration including:

* [holiday detection and featurization](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-bike-share/auto-ml-forecasting-bike-share.ipynb)
* [rolling-origin cross validation](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-energy-demand/auto-ml-forecasting-energy-demand.ipynb)
* [configurable lags](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-bike-share/auto-ml-forecasting-bike-share.ipynb)
* [rolling window aggregate features](https://github.com/Azure/azureml-examples/blob/main/v1/python-sdk/tutorials/automl-with-azureml/forecasting-energy-demand/auto-ml-forecasting-energy-demand.ipynb)


## Next steps

* Learn more about [How to deploy an AutoML model to an online endpoint](how-to-deploy-automl-endpoint.md).
* Learn about [Interpretability: model explanations in automated machine learning (preview)](how-to-machine-learning-interpretability-automl.md).
* Learn about [how AutoML builds forecasting models](./concept-automl-forecasting-methods.md). 

