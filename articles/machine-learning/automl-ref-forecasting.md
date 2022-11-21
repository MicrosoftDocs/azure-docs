---
title: 'CLI (v2) command job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) command job YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-ignite-2022

ms.author: shoja
author: shouryaj
ms.date: 10/11/2022
ms.reviewer: ssalgado
---

# CLI (v2) command job YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/autoMLForecastingJob.schema.json



[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| ``$schema`` | string | The YAML schema. If the user uses the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of the file enables the user to invoke schema and resource completions. | | |
| `compute` | string | **Required.** Name of the AML compute infrastructure to execute the job on. This compute can be either a reference to an existing compute machine in the workspace *Note:* jobs in pipeline don't support 'local' as `compute`. * | 1. pattern `[^azureml:<compute_name>]` to use existing compute, <br>2.`'local'` to use local execution | `'local'` |
| ``name`` | string |  The name of the Job/Run. Must be unique across all jobs in the workspace. If not specified, Azure ML will autogenerate a GUID for the name. | | |
| `description` | string | Description of the job. | | |
| `display_name` | string | Display name of the job in the studio UI. Can be non-unique within the workspace. If omitted, Azure ML will autogenerate a human-readable adjective-noun identifier for the display name. | | |
| `experiment_name` | string | The name of the Experiment. An Experiment is like a folder with multiple runs in Azure ML Workspace that should be related to the same logical machine learning experiment. For example, if a user runs this notebook multiple times, there will be multiple runs associated with the same Experiment name. Each job's run record will be organized under the corresponding experiment in the studio's "Experiments" tab. If omitted, Azure ML will default it to the name of the working directory where the job was created. | | |
| `log_files` | object | Dictionary containing logs of AutoML job execution | | |
| `log_verbosity` | string | Different levels of log verbosity. (The verbosity level for writing to the log file. The default is INFO or 20. Acceptable values are defined in the Python logging library <https://docs.python.org/3/library/logging.html>).| `'not_set'`,`'debug'`,`'info'`,`'warning'`,`'error'`,`'critical'` | `'info'` |
| `type` | const | **Required.** The type of job. | `automl` | |
| `environment_variables` | object | Dictionary of environment variable key-value pairs to set on the process where the command is executed. |  |  |
| `outputs` | object | Dictionary of output configurations of the job. The key is a name for the output within the context of the job and the value is the output configuration. See [job output](#output) to find out properties of this object.|  |  |  
| `target_column_name` | string |  **Required.** The name of the target/label column. It must always be specified.|  |  |
| `task` | const | **Required.** The type of AutoML task to execute. | `forecasting` | |
| `cv_split_column_names` | list(string) | List of names of the columns that contain custom cross validation split. Each of the CV split columns represents one CV split where each row are either marked 1 for training or 0 for validation. This parameter is applicable to `training_data` parameter for custom cross validation purposes. | | None |
| `featurization` | object | Dictionary containing the featurization config. See [featurization](#featurization) to see the properties of this object. |  |  |
| `forecasting` | object | Dictionary containing the forecasting settings config. See [forecasting](#forecasting) to see the properties of this object.|  |  |
| `limits` | object | Dictionary of limit configurations of the job. The key is name for the limit within the context of the job and the value is limit value. See [limits](#limits) to see the properties of this object.|  |  |
| `n_cross_validations` | string or integer | Number of cross validations to perform during model/pipeline selection when user validation data is not specified. Specify `validation_data` to provide validation data, otherwise set `n_cross_validations` or `validation_data_size` to extract validation data out of the specified training data. The default value is `auto`, in which case AutoMl determines the number of cross-validations automatically. | `'auto'`, integer, `None` | `'auto'` |
| `primary_metric` | string | The metric that AutoML will optimize for Time Series Forecasting model selection. If not specified, then AutoML use normalized RMSE for forecasting tasks.| `"spearman_correlation"`, `"normalized_root_mean_squared_error"`, `"r2_score"`, `"normalized_mean_absolute_error"` | |
| `test_data` | object | The test data to be used for a test run that will automatically be started after model training is complete. The test run will get predictions using the best model and will compute metrics given these predictions. If this parameter or the `test_data_size` parameter are not specified then no test run will be executed automatically after model training is completed. Test data should contain both features and label column. If `test_data` is specified then the `target_column_name` parameter must be specified. See [training or validation or test data](#training-data-or-validation-data-test-data) to find out the properties of this object. | | |
| `test_data_size` | float | Specifies what fraction of the training data to hold out for test data for a test run that will automatically be started after model training is complete. The test run will get predictions using the best model and will compute metrics given these predictions. If `test_data_size` is specified at the same time as `validation_data_size`, then the test data is split from `training_data` before the validation data is split. For example, if `validation_size=0.1`, `test_data_size=0.1` and the original training data has 1000 rows, then the test data will have 100 rows, the validation data will contain 90 rows and the training data will have 810 rows. **Forecasting does not currently support specifying a test dataset using a train/test split.** If this parameter or the `test_data` parameter are not specified then no test run will be executed automatically after model training is completed. |  0.0 < size_value < 1.0 | |
| `training` | object | Dictionary containing the configuration parameters that will be used in training the model. |  |  |
| `training_data` | object | The subset of data to be used as input for model training. It should contain both training features and a label/target column (optionally a sample weights column). If `training_data` is specified, then the `target_column_name` parameter must also be specified. See [training or validation or test data](#training-data-or-validation-data-test-data) to find out the properties of this object. | | |
| `validation_data` | object | The validation data to be used within the experiment for cross validation.It should contain both training features and label column (optionally a sample weights column). If `validation_data` is specified, then `training_data` and `target_column_name` parameters must be specified. Please note that samples in training data and validation data can not overlap in a fold. See [training or validation or test data](#training-data-or-validation-data-test-data) to find out the properties of this object. |  | |
| `validation_data_size` | float | Specifies the fraction of data to hold out as validation dataset when client has not passed validation dataset explicitly. Specify `validation_data` to provide validation data, otherwise set `n_cross_validations` or `validation_data_size` to extract validation data out of the specified training data. | 0.0 <= size_value <= 1.0 | |
| `weight_column_name` | string | The name of the sample weight column. Automated ML supports a weighted column as an input, causing rows in the data to be weighted up or down. This parameter is applicable to `training_data`` and `validation_data` parameters. | | |


### limits

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `enable_early_termination` | boolean | Whether to enable early termination of experiment if the score is not improving  some x number of iterations. In AutoML job, no early stopping is applied on first 20 iterations. early stopping window starts only after first 20 iterations. | True, False | True |
| `max_concurrent_trials` | integer | Maximum number of trials (children jobs) that would be executed in parallel. | | |
| `max_cores_per_trial` | integer | Maximum number of cores per iteration (or trials) | | |
| `max_trials` | integer | The maximum number of different algorithm and parameter combinations (trials) to try during an AutoML job. If user is using `enable_early_termination`, then the number of trials used can be smaller. | | |
| `timeout_minutes ` | integer | Maximum amount of time in minutes that the whole AutoML job can take before the job terminates. This timeout includes setup, featurization and training runs but doesn't include the ensembling and model explainability runs at the end of the process since those actions need to happen once all the trials (children jobs) are done. If not specified, the default job's total timeout is six days (8,640 minutes). To specify a timeout less than or equal to 1 hour (60 minutes), the user should make sure dataset's size isn't greater than 10,000,000 (rows times column) or an error results. | | |
| `trial_timeout_minutes ` | integer | Maximum time in minutes that each trial (child job) can run for before it terminates. If not specified, a value of one month or 43200 minutes is used. | | |
| `exit_score` | float | Target score for experiment. The experiment terminates after this score is reached. If not specified (no criteria), the experiment runs until no further progress is made on the primary metric. | |  |


### forecasting

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `country_or_region_for_holidays` | string | The country/region used to generate holiday features. These should be ISO 3166 two-letter country/region codes, for example 'US' or 'GB'. |  | None |
| `cv_step_size` | integer | Number of periods between the origin_time of one CV fold and the next fold. For example, if n_step = 3 for daily data, the origin time for each fold will be three days apart. |  | None |
| `feature_lags` | string | Flag for generating lags for the numeric features | `'auto'`, `None` | `None` |
| `forecast_horizon` | **Required.** string or integer or None | The desired maximum forecast horizon in units of time-series frequency. Units are based on the time interval of your training data, e.g., monthly, weekly that the forecaster should predict out. When task type is forecasting, this parameter is required.| string, integer, None | None |
| `frequency` | string or None | Forecast frequency. When forecasting, this parameter represents the period with which the forecast is desired, for example daily, weekly, yearly, etc. The forecast frequency is dataset frequency by default. You can optionally set it to greater (but not lesser) than dataset frequency. We'll aggregate the data and generate the results at forecast frequency. For example, for daily data, you can set the frequency to be daily, weekly or monthly, but not hourly. The frequency needs to be a pandas offset alias.Please refer to pandas documentation for more information:https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#dateoffset-objects | string, None | None |
| `seasonality` | string or integer | Set time series seasonality as an integer multiple of the series frequency. If seasonality is set to `'auto'`, it will be inferred. If this parameter is not set, the AutoML will assume time series as non-seasonal which is equivalent to seasonality=1| `'auto'`, integer, `None` | `None` | 
| `short_series_handling_config` | string | The parameter defining how if AutoML should handle short time series. Possible values: <br>`'auto'` : short series will be padded if there are no long series,otherwise short series will be dropped.<br>`'pad'`: all the short series will be padded with zeros.<br>`'drop'`: all the short series will be dropped.<br> `None`:the short series will not be modified.| `'auto'`,`'pad'`,`'drop'`, `None` | `None` |
| `target_aggregate_function` | string | The function to be used to aggregate the time series target column to conform to a user specified frequency. If the target_aggregation_function is set, but the `freq` parameter is not set, the error is raised. | `'sum'`,`'max'`,`'min'`,`'mean'` | `None` |
| `target_lags` | string or integer or list(integer) | The number of past periods to lag from the target column. Use `'auto'` to use the automatic heuristic based lag. | `'auto'`,integer, `None` | `None` |
| `target_rolling_window_size` | string or integer | The number of past periods used to create a rolling window average of the target column. When forecasting, this parameter represents n historical periods to use to generate forecasted values, <= training set size. If omitted, n is the full training set size. Specify this parameter when you only want to consider a certain amount of history when training the model. | `'auto'`, integer, `None` | `None` |
| `time_column_name` | string | The name(header) of the time column. This parameter is required when forecasting to specify the datetime column in the input data used for building the time series and inferring its frequency. |  | `None` |
| `time_series_id_column_names` | string or list(string) | The names of columns used to group a timeseries. It can be used to create multiple series. If time_series_id_column_names is not defined, the data set is assumed to be one time-series. |  | `None` |
| `use_stl` | string | Configure STL Decomposition of the time-series target column. use_stl can take two values: <br>`'season'` - only generate season component . <br>`'season_trend'` - generate both season and trend components. | `'season'`, `'seasontrend'` | `None` |


### training or validation or test data

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `datastore` | string | Name of the datastore to upload to. | | |
| `path` | string | Path can be a `file` path, `folder` path or `pattern` for paths. `pattern` specifies a search pattern to allow globbing(* and **) of files and folders containing data. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, and `adl`. For more information, see [Core yaml syntax](https://learn.microsoft.com/en-us/azure/machine-learning/reference-yaml-core-syntax) to understand how to use the `azureml://` URI format. URI of the location of the artifact file. If this URI doesn't have a scheme (for example, http:, azureml: etc.), then it's considered a local reference and the file it points to is uploaded to the default workspace blob-storage as the entity is created.  | | | 
| `mode` | string |  | `'download'`, `'ro_mount'`, `'eval_mount'`, `'eval_download'`, `'direct'` |  |
| `type` | const | In order to generate computer vision models, the user needs to bring labeled image data as input for model training in the form of an MLTable. | `mltable` | `mltable`|


### training

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `allowed_training_algorithms` | list(string) | A list of Time Series Forecasting algorithms (base model) to try in the multiple trials while training. If not specified, then all algorithms supported for the task are used minus any specified in `blocked_training_algorithms`. The supported models for each task type are described in the :class:`azureml.train.automl.constants.SupportedModels` class. | `'auto_arima'`, `'prophet'`, `'naive'`,`'seasonal_naive'`, `'average'`, `'seasonal_average'`, `'exponential_smoothing'`, `'arimax'`, `'tcn_forecaster'`, `'elastic_net'`, `'gradient_boosting'`, `'decision_tree'`, `'knn'`, `'lasso_lars'`, `'sgd'`, `'random_forest'`, `'extreme_random_trees'`, `'light_gbm'`, `'xg_boost_regressor'` | `None` |
| `blocked_training_algorithms` | list(string) | A list of Time Series Forecasting algorithms (base model) to ignore in while training in AutoML job. The training algorithm must be one of the algorithms listed in the :class:`azureml.train.automl.constants.SupportedModels` class. | `'auto_arima'`, `'prophet'`, `'naive'`, `'seasonal_naive'`, `'average'`, `'seasonal_average'`, `'exponential_smoothing'`, `'arimax'`,`'tcn_forecaster'`, `'elastic_net'`, `'gradient_boosting'`, `'decision_tree'`, `'knn'`, `'lasso_lars'`, `'sgd'`, `'random_forest'`, `'extreme_random_trees'`, `'light_gbm'`, `'xg_boost_regressor'` | `None` |
| `enable_dnn_training` | boolean | Whether to include DNN based models during model selection. The default in the init is None. However, the default is True for DNN NLP tasks, and it's False for all other AutoML tasks.  | `True`, `False` | `False` |
| `enable_model_explainability` | boolean |  Flag to turn on explainability on model like feature importance. | `True`, `False` | `False` |
| `enable_onnx_compatible_models` | boolean | Flag to enable or disable enforcing the ONXX compatible models. For more information about Open Neural Network Exchange (ONNX) and Azure Machine Learning, see this `article <https://docs.microsoft.com/azure/machine-learning/concept-onnx>`.| `True`, `False` | `False` |
| `enable_stack_ensemble` | boolean | Flag to enable/disable StackEnsemble iteration. If `enable_onnx_compatible_models` flag is being set, then StackEnsemble iteration will be disabled. Similarly, for Timeseries tasks, StackEnsemble iteration will be disabled by default, to avoid risks of overfitting due to small training set used in fitting the meta learner. For more information about ensembles, see `Ensemble configuration <https://docs.microsoft.com/azure/machine-learning/how-to-configure-auto-train#ensemble>`_ | `True`, `False` | `False` |
| `enable_vote_ensemble` | boolean | Whether to enable/disable VotingEnsemble iteration. The default is True. For more information about ensembles, see `Ensemble configuration <https://docs.microsoft.com/azure/machine-learning/how-to-configure-auto-train#ensemble>`. | `True`, `False` | `True` |
| `ensemble_model_download_timeout_minutes` | integer | During VotingEnsemble and StackEnsemble model generation, multiple fitted models from the previous child runs are downloaded. Configure this parameter with a higher value than 300 secs, if more time is needed. | | |
| `stack_ensemble_settings` | object | Dictionary containing stack ensemble settings for stack ensemble run. See [stack_ensemble_settings](#stack_ensemble_settings) for the properties in this object. |  |  |


### featurization

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `blocked_transformers` | list(string) | Specifies a list of transformer names given by user to be blocked during featurization by AutoML . The transformers must be one of the transformers listed in the :class:`azureml.automl.core.constants.SupportedTransformers` class BLOCKED_TRANSFORMERS attribute | `'text_target_encoder'`,`'one_hot_encoder'`,`'cat_target_encoder'`,`'tf_idf'`,`'wo_e_target_encoder'`,`'label_encoder'`,`'word_embedding'`,`'naive_bayes'`,`'count_vectorizer'`,`'hash_one_hot_encoder'` | `None` |
| `column_name_and_types` | object | Dictionary of column name and its type. the key is the column name and value is the type like int, float, datetime, etc.|  |  |
| `dataset_language` | string | Three character ISO 639-3 code for the language(s) contained in the dataset.The languages other than English are only supported if you use GPU-enabled compute.  The langugage_code 'mul' should be used if the dataset contains multiple languages. To find ISO 639-3 codes for different languages, please refer to https://en.wikipedia.org/wiki/List_of_ISO_639-3_codes. | | |
| `mode` | string | Defines featurization modes that are used in AutoML. <br>`'auto'` indicates whether featurization step should be done automatically, <br>`'off'`if not to use, <br>`'custom'` to indicate whether customized featurization should be used. Note: If the input data is sparse, featurization cannot be turned on. | `'auto'`,`'off'`,`'custom'` | `None` |
| `transformer_params` | object | A dictionary of transformer and corresponding customization parameters for featurization. This parameter is can be set if `mode` is set to `'custom'` | | `None` |


### column_transformers

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `fields` | list(string) | Transformer name. Forecasting task only supports simple imputation  | | |
| `parameters` | object | A dictionary of parameter options and value pairs to apply for the transformation. |  |  |


### Job outputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The type of job output. For the default `uri_folder` type, the output will correspond to a folder. | `'uri_file'`, `'uri_folder'` , `'mlflow_model'`, `'custom_model'`, `'mltable'`,`'triton_model'`| `'uri_folder'` |
| `mode` | string | Mode of how output file(s) will get delivered to the destination storage. For read-write mount mode (`rw_mount`) the output directory will be a mounted directory. For upload mode the file(s) written will get uploaded at the end of the job. | `'rw_mount'`, `'upload'`,`'mount'`, `'direct'` | `'rw_mount'` |
| `path` | string | AutoML job output storage path | | |


## Remarks

The `az ml job` command can be used for managing Azure Machine Learning jobs.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs). Several are shown below.

## YAML: hello world

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world.yml":::

## YAML: display name, experiment name, description, and tags

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-org.yml":::

## YAML: environment variables

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-env-var.yml":::

## YAML: source code

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-code.yml":::

## YAML: literal inputs

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-input.yml":::

## YAML: write to default outputs

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-output.yml":::

## YAML: write to named data output

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-world-output-data.yml":::

## YAML: datastore URI file input

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-iris-datastore-file.yml":::

## YAML: datastore URI folder input

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-iris-datastore-folder.yml":::

## YAML: URI file input

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-iris-file.yml":::

## YAML: URI folder input

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-iris-folder.yml":::

## YAML: Notebook via papermill

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-notebook.yml":::

## YAML: basic Python model training

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/scikit-learn/iris/job.yml":::

## YAML: basic R model training with local Docker build context

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/r/iris/job.yml":::

## YAML: distributed PyTorch

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/pytorch/cifar-distributed/job.yml":::

## YAML: distributed TensorFlow

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/tensorflow/mnist-distributed/job.yml":::

## YAML: distributed MPI

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/tensorflow/mnist-distributed-horovod/job.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
