---
title: 'CLI (v2) Automated ML Forecasting command job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Forecasting command job YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-ignite-2022
ms.date: 03/08/2023
ms.author: rasavage
author: rsavage2
ms.reviewer: ssalgado
---

# CLI (v2) Automated ML Forecasting command job YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/autoMLForecastingJob.schema.json



[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax


| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The location/url to load the YAML schema.<br>If the user uses the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of the file enables the user to invoke schema and resource completions. | | |
| `compute` | string | **Required.** <br>The name of the AML compute infrastructure to execute the job on. <br> The compute can be either a reference to an existing compute machine in the workspace <br>*Note:* jobs in pipeline don't support 'local' as `compute`. The 'local' here means that compute instance created in user's Azure Machine Learning studio workspace. | 1. pattern `[^azureml:<compute_name>]` to use existing compute,<br>2.`'local'` to use local execution | `'local'` |
| `limits` | object | Represents a dictionary object consisting of limit configurations of the Automated ML tabular job.<br>The key is name for the limit within the context of the job and the value is limit value. See [limits](#limits) to find out the properties of this object.|  |  |
| `name` | string |  The name of the submitted Automated ML job.<br>It must be unique across all jobs in the workspace. If not specified, Azure Machine Learning autogenerates a GUID for the name. | | |
| `description` | string | The description of the Automated ML job. | | |
| `display_name` | string | The name of the job that user wants to display in the studio UI. It can be non-unique within the workspace. If it's omitted, Azure Machine Learning autogenerates a human-readable adjective-noun identifier for the display name. | | |
| `experiment_name` | string | The name of the experiment.<br>Experiments are records of your ML training jobs on Azure. Experiments contain the results of your runs, along with logs, charts, and graphs. Each job's run record is organized under the corresponding experiment in the studio's "Experiments" tab. | | Name of the working directory in which it was created|
| `environment_variables` | object | A dictionary object of environment variables to set on the process where the command is being executed. |  |  |
| `outputs` | object | Represents a dictionary of output configurations of the job. The key is a name for the output within the context of the job and the value is the output configuration. See [job output](#job-outputs) to find out properties of this object.|  |  |  
| `log_files` | object | A dictionary object containing logs of an Automated ML job execution | | |
| `log_verbosity` | string | The level of log verbosity for writing to the log file.<br>The acceptable values are defined in the Python [logging library](https://docs.python.org/3/library/logging.html).| `'not_set'`, `'debug'`, `'info'`, `'warning'`, `'error'`, `'critical'` | `'info'` |
| `type` | const | **Required.** <br>The type of job. | `automl` | `automl` |
| `task` | const | **Required.** <br>The type of Automated ML task to execute.| `forecasting` | `forecasting` |
| `target_column_name` | string |  **Required.** <br>Represents the name of the column to be forecasted. The Automated ML job raises an error if not specified.|  |  |
| `featurization` | object | A dictionary object defining the configuration of custom featurization. In case it isn't created, the Automated ML config applies auto featurization. See [featurization](#featurization) to see the properties of this object. |  |  |
| `forecasting` | object | A dictionary object defining the settings of forecasting job. See [forecasting](#forecasting) to find out the properties of this object.|  |  |
| `n_cross_validations` | string or integer | The number of cross validations to perform during model/pipeline selection if `validation_data` isn't specified.<br>In case both `validation_data` and this parameter isn't provided or set to `None`, then Automated ML job set it to `auto` by default. In case `distributed_featurization` is enabled and `validation_data` isn't specified, then it's set to 2 by default.  | `'auto'`, [int] | `None` |
| `primary_metric` | string | A metric that Automated ML optimizes for Time Series Forecasting model selection.<br>If `allowed_training_algorithms` has 'tcn_forecaster' to use for training, then Automated ML only supports  in 'normalized_root_mean_squared_error' and 'normalized_mean_absolute_error' to be used as primary_metric.| `"spearman_correlation"`, `"normalized_root_mean_squared_error"`, `"r2_score"` `"normalized_mean_absolute_error"`| `"normalized_root_mean_squared_error"` |
| `training` | object | A dictionary object defining the configuration that is used in model training. <br> Check [training](#training) to find out the properties of this object.|  |  |
| `training_data` | object | **Required**<br>A dictionary object containing the MLTable configuration defining training data to be used in as input for model training. This data is a subset of data and should be composed of both independent features/columns and target feature/column. The user can use a registered MLTable in the workspace using the format ':' (e.g Input(mltable='my_mltable:1')) OR can use a local file or folder as a MLTable(e.g Input(mltable=MLTable(local_path="./data")). This object must be provided. If target feature isn't present in source file, then Automated ML throws an error. Check [training or validation or test data](#training-or-validation-or-test-data) to find out the properties of this object. | | |
| `validation_data` | object | A dictionary object containing the MLTable configuration defining validation data to be used within Automated ML experiment for cross validation. It should be composed of both independent features/columns and target feature/column if this object is provided. Samples in training data and validation data can't overlap in a fold. <br>See [training or validation or test data](#training-or-validation-or-test-data) to find out the properties of this object. In case this object isn't defined, then Automated ML uses `n_cross_validations` to split validation data from training data defined in `training_data` object.| | |
| `test_data` | object | A dictionary object containing the MLTable configuration defining test data to be used in test run for predictions in using best model and evaluates the model using defined metrics. It should be composed of only independent features used in training data (without target feature) if this object is provided. <br> Check [training or validation or test data](#training-or-validation-or-test-data) to find out the properties of this object. If it isn't provided, then Automated ML uses other built-in methods to suggest best model to use for inferencing. | | |



## limits

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `enable_early_termination` | boolean | Represents whether to enable of experiment termination if the loss score doesn't improve after 'x' number of iterations.<br>In an Automated ML job, no early stopping is applied on first 20 iterations. The early stopping window starts only after first 20 iterations. | `true`, `false` | `true` |
| `max_concurrent_trials` | integer | The maximum number of trials (children jobs) that would be executed in parallel. It's highly recommended to set the number of concurrent runs to the number of nodes in the cluster (aml compute defined in `compute`). | | `1` |
| `max_trials` | integer | Represents the maximum number of trials an Automated ML job can try to run a training algorithm with different combination of hyperparameters. Its default value is set to 1000. If `enable_early_termination` is defined, then the number of trials used to run training algorithms can be smaller.| | `1000` |
| `max_cores_per_trial` | integer | Represents the maximum number of cores per that are available to be used by each trial. Its default value is set to -1, which means all cores are used in the process.| | `-1` |
| `timeout_minutes ` | integer | The maximum amount of time in minutes that the submitted Automated ML job can take to run. After the specified amount of time, the job is terminated. This timeout includes setup, featurization, training runs, ensembling and model explainability (if provided) of all trials. <br> Note that it doesn't include the ensembling and model explainability runs at the end of the process if the job fails to get completed within provided `timeout_minutes` since these features are available once all the trials (children jobs) are done. <br> Its default value is set to 360 minutes (6 hours). To specify a timeout less than or equal to 1 hour (60 minutes), the user should make sure dataset's size isn't greater than 10,000,000 (rows times column) or an error results. | | `360` |
| `trial_timeout_minutes ` | integer | The maximum amount of time in minutes that each trial (child job) in the submitted Automated ML job can take run. After the specified amount of time, the child job will get terminated. | |`30`|
| `exit_score` | float | The score to achieve by an experiment. The experiment terminates after the specified score is reached. If not specified (no criteria), the experiment runs until no further progress is made on the defined `primary metric`. | | |



## forecasting

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `time_column_name` | string | **Required** <br>The name of the column in the dataset that corresponds to the time axis of each time series. The input dataset for training, validation or test must contain this column if the task is `forecasting`. If not provided or set to `None`, Automated ML forecasting job throws an error and terminate the experiment. | | |
| `forecast_horizon` | string or integer | The maximum forecast horizon in units of time-series frequency. These units are based on the inferred time interval of your training data, (Ex: monthly, weekly) that the forecaster uses to predict. If it is set to None or `auto`, then its default value is set to 1, meaning 't+1' from the last timestamp t in the input data. | `auto`, [int] | 1 |
| `frequency` | string | The frequency at which the forecast generation is desired, for example daily, weekly, yearly, etc. <br>If it isn't specified or set to None, then its default value is inferred from the dataset time index. The user can set its value greater than dataset's inferred frequency, but not less than it. For example, if dataset's frequency is daily, it can take values like daily, weekly, monthly, but not hourly as hourly is less than daily(24 hours).<br> Refer to [pandas documentation](https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#dateoffset-objects) for more information.|  | `None` |
| `time_series_id_column_names` | string or list(strings) | The names of columns in the data to be used to group data into multiple time series. If time_series_id_column_names is not defined or set to None, the Automated ML uses auto-detection logic to detect the columns.|  | `None` |
| `feature_lags` | string | Represents if user wants to generate lags automatically for the provided numeric features. The default is set to `auto`, meaning that Automated ML uses autocorrelation-based heuristics to automatically select lag orders and generate corresponding lag features for all numeric features. "None" means no lags are generated for any numeric features.| `'auto'`, `None` | `None` |
| `country_or_region_for_holidays` | string | The country or region to be used to generate holiday features. These characters should be represented in ISO 3166 two-letter country/region codes, for example 'US' or 'GB'. The list of the ISO codes can be found at [https://wikipedia.org/wiki/List_of_ISO_3166_country_codes](https://wikipedia.org/wiki/List_of_ISO_3166_country_codes).  | `None` |
| `cv_step_size` | string or integer | The number of periods between the origin_time of one CV fold and the next fold. For example, if it is set to 3 for daily data, the origin time for each fold is three days apart. If it set to None or not specified, then it's set to `auto` by default. If it is of integer type, minimum value it can take is 1 else it raises an error. | `auto`, [int] | `auto` |
| `seasonality` | string or integer | The time series seasonality as an integer multiple of the series frequency. If seasonality is not specified, its value is set to `'auto'`, meaning it is inferred automatically by Automated ML. If this parameter is not set to `None`, the Automated ML assumes time series as non-seasonal, which is equivalent to setting it as integer value 1. | `'auto'`, [int] | `auto` | 
| `short_series_handling_config` | string | Represents how Automated ML should handle short time series if specified. It takes following values: <br><ul><li>`'auto'` : short series is padded if there are no long series, otherwise short series is dropped.</li><li>`'pad'`: all the short series is padded with zeros.</li><li>`'drop'`: all the short series is dropped.</li><li> `None`: the short series is not modified.</li><ul>| `'auto'`, `'pad'`, `'drop'`, `None` | `auto` |
| `target_aggregate_function` | string | Represents the aggregate function to be used to aggregate the target column in time series and generate the forecasts at specified frequency (defined in `freq`). If this parameter is set, but the `freq` parameter is not set, then an error is raised. It is omitted or set to None, then no aggregation is applied.| `'sum'`, `'max'`, `'min'`, `'mean'` | `auto` |
| `target_lags` | string or integer or list(integer) | The number of past/historical periods to use to lag from the target values based on the dataset frequency. By default, this parameter is turned off. The `'auto'` setting allows system to use automatic heuristic based lag. <br>This lag property should be used when the relationship between the independent variables and dependent variable do not correlate by default. For more information, see [Lagged features for time series forecasting in Automated ML](./concept-automl-forecasting-lags.md).| `'auto'`, [int] | `None` |
| `target_rolling_window_size` | string or integer | The number of past observations to use for creating a rolling window average of the target column. When forecasting, this parameter represents n historical periods to use to generate forecasted values, <= training set size. If omitted, n is the full training set size. Specify this parameter when you only want to consider a certain amount of history when training the model. | `'auto'`, integer, `None` | `None` |
| `use_stl` | string | The components to generate by applying STL decomposition on time series.If not provided or set to None, no time series component is generated.<br>use_stl can take two values: <br>`'season'` : to generate season component. <br>`'season_trend'` : to generate both season Automated ML and trend components. | `'season'`, `'seasontrend'` | `None` |



## training or validation or test data

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `datastore` | string | The name of the datastore where data is uploaded by user. | | |
| `path` | string | The path from where data should be loaded. It can be a `file` path, `folder` path or `pattern` for paths. <br>`pattern` specifies a search pattern to allow globbing(`*` and `**`) of files and folders containing data. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, and `adl`. For more information, see [Core yaml syntax](./reference-yaml-core-syntax.md) to understand how to use the `azureml://` URI format. URI of the location of the artifact file. If this URI doesn't have a scheme (for example, http:, azureml: etc.), then it's considered a local reference and the file it points to is uploaded to the default workspace blob-storage as the entity is created.  | | |
| `type` | const | The type of input data. In order to generate computer vision models, the user needs to bring labeled image data as input for model training in the form of an MLTable. | `mltable` | `mltable`|




## training

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `allowed_training_algorithms` | list(string) | A list of Time Series Forecasting algorithms to try out as base model for model training in an experiment. If it is omitted or set to None, then all supported algorithms are used during experiment, except algorithms specified in `blocked_training_algorithms`.| `'auto_arima'`, `'prophet'`, `'naive'`,`'seasonal_naive'`, `'average'`, `'seasonal_average'`, `'exponential_smoothing'`, `'arimax'`, `'tcn_forecaster'`, `'elastic_net'`, `'gradient_boosting'`, `'decision_tree'`, `'knn'`, `'lasso_lars'`, `'sgd'`, `'random_forest'`, `'extreme_random_trees'`, `'light_gbm'`, `'xg_boost_regressor'` | `None` |
| `blocked_training_algorithms` | list(string) | A list of Time Series Forecasting algorithms to not run as base model while model training in an experiment. If it is omitted or set to None, then all supported algorithms are used during model training. | `'auto_arima'`, `'prophet'`, `'naive'`, `'seasonal_naive'`, `'average'`, `'seasonal_average'`, `'exponential_smoothing'`, `'arimax'`,`'tcn_forecaster'`, `'elastic_net'`, `'gradient_boosting'`, `'decision_tree'`, `'knn'`, `'lasso_lars'`, `'sgd'`, `'random_forest'`, `'extreme_random_trees'`, `'light_gbm'`, `'xg_boost_regressor'` | `None` |
| `enable_dnn_training` | boolean | A flag to turn on or off the inclusion of DNN based models to try out during model selection.| `True`, `False` | `False` |
| `enable_model_explainability` | boolean |  Represents a flag to turn on model explainability like feature importance, of best model evaluated by Automated ML system. | `True`, `False` | `True` |
| `enable_vote_ensemble` | boolean | A flag to enable or disable the ensembling of some base models using Voting algorithm. For more information about ensembles, see [Set up Auto train](./how-to-configure-auto-train.md). | `true`, `false` | `true` |
| `enable_stack_ensemble` | boolean | A flag to enable or disable ensembling of some base models using Stacking algorithm. In forecasting tasks, this flag is turned off by default, to avoid risks of overfitting due to small training set used in fitting the meta learner. For more information about ensembles, see [Set up Auto train](./how-to-configure-auto-train.md). | `true`, `false` | `false` |



## featurization

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `mode` | string | The featurization mode to be used by Automated ML job.<br>Setting it to: <br> `'auto'` indicates whether featurization step should be done automatically<br>`'off'` indicates no featurization<`'custom'` indicates whether customized featurization should be used. <br><br> Note: If the input data is sparse, featurization cannot be turned on. | `'auto'`, `'off'`, `'custom'` | `None` |
| `blocked_transformers` | list(string) | A list of transformer names to be blocked during featurization step by Automated ML, if featurization `mode` is set to 'custom'. | `'text_target_encoder'`, `'one_hot_encoder'`, `'cat_target_encoder'`, `'tf_idf'`, `'wo_e_target_encoder'`, `'label_encoder'`, `'word_embedding'`, `'naive_bayes'`, `'count_vectorizer'`, `'hash_one_hot_encoder'` | `None` |
| `column_name_and_types` | object | A dictionary object consisting of column names as dict key and feature types used to update column purpose as associated value, if featurization `mode` is set to 'custom'.|  |  |
| `transformer_params` | object | A nested dictionary object consisting of transformer name as key and corresponding customization parameters on dataset columns for featurization, if featurization `mode` is set to 'custom'.<br>The forecasting only supports `imputer` transformer for customization.<br> Check out [column_transformers](#column_transformers) to find out how to create customization parameters. |  | `None` |



## column_transformers

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `fields` | list(string) |A list of column names on which provided `transformer_params` should be applied.|  |  |
| `parameters` | object | A dictionary object consisting of 'strategy' as key and value as imputation strategy.<br> More details on how it can be provided, is provided in examples [here](#quick-links-for-further-reference). |  |  |



## Job outputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The type of job output. For the default `uri_folder` type, the output corresponds to a folder. | `uri_folder` , `mlflow_model`, `custom_model`| `uri_folder` |
| `mode` | string | The mode of how output file(s) are delivered to the destination storage. For read-write mount mode (`rw_mount`) the output directory is a mounted directory. For upload mode, the file(s) written are uploaded at the end of the job. | `rw_mount`, `upload` | `rw_mount` |



### How to run forecasting job via CLI
```
az ml job create --file [YOUR_CLI_YAML_FILE] --workspace-name [YOUR_AZURE_WORKSPACE] --resource-group [YOUR_AZURE_RESOURCE_GROUP] --subscription [YOUR_AZURE_SUBSCRIPTION]
```

### Quick links for further reference:
* [Install and use the CLI (v2)](how-to-configure-cli.md)
* [How to run an Automated ML job via CLI]()
* [How to auto train forecasts](./how-to-auto-train-forecast.md)
* CLI Forecasting examples:<br>[Orange Juice Sale Forecasting](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/automl-standalone-jobs/cli-automl-forecasting-orange-juice-sales) <br> [Energy Demand Forecasting](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/automl-standalone-jobs/cli-automl-forecasting-task-energy-demand) <br> [Bike Share Demand Forecasting](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/automl-standalone-jobs/cli-automl-forecasting-bike-share) <br> [GitHub Daily Active Users Forecast](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/automl-standalone-jobs/cli-automl-forecasting-task-github-dau)
