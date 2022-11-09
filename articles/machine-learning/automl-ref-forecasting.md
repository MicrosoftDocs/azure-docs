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

The source JSON schema can be found at https://azuremlsdk2.blob.core.windows.net/preview/0.0.1/autoMLForecastingJob.schema.json.



[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If the user uses the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of the file enables the user to invoke schema and resource completions. | | |
| `compute` | string | **Required.** Name of the AML compute infrastructure to execute the job on. This compute can be either a reference to an existing compute machine in the workspace *Note:* jobs in pipeline don't support 'local' as `compute`. * | 1. pattern `'[^azureml:<compute_name>]' to use existing compute, <br>2.`'local'` to use local execution | `'local'` |
| `name` | string |  The name of the Job/Run. Must be unique across all jobs in the workspace. If not specified, Azure ML will generate a random string as the name. | ?? | ?? |
| `description` | string | Description of the job. | | |
| `display_name` | string | Display name of the job in the studio UI. Can be non-unique within the workspace. If omitted, Azure ML will autogenerate a human-readable adjective-noun identifier for the display name. | | |
| `experiment_name` | string | The name of the Experiment. An Experiment is like a folder with multiple runs in Azure ML Workspace that should be related to the same logical machine learning experiment. For example, if a user runs this notebook multiple times, there will be multiple runs associated with the same Experiment name. Each job's run record will be organized under the corresponding experiment in the studio's "Experiments" tab. If omitted, Azure ML will default it to the name of the working directory where the job was created. | | |
| `log_files` | object(string) | Dictionary containing logs of execution |  |  |
| `log_verbosity` | string | Different levels of log verbosity. | 'not_set','debug','info','warning','error','critical' |  |
| `type` | string | **Required.** The type of job. | 'automl' | 'automl' |
| `environment_variables` | object(strings) | Dictionary of environment variable key-value pairs to set on the process where the command is executed. |  |  |
| `outputs` | object | Dictionary of output configurations of the job. The key is a name for the output within the context of the job and the value is the output configuration. <br><br> Outputs can be referenced in the `command` using the `${{ outputs.<output_name> }}` expression.|  |  |  
| `creation_context` | object | ?? | ?? | ?? |
| `environment_id` | string | ?? |  ?? | ?? |
| `resources` | object |  Job resource configuration  | ?? | ?? |
| `services` | object |  Job service configuration  | ?? | ?? |
| `status` | string |  ??  | ?? | ?? |
| `tags` | object |  ??  | ?? | ?? |
| `properties` | properties(string) |  ??  | ?? | ?? |
| `id` | string | ?? | pattern `"[^azureml:.*]"` | ?? |
| `identity` | ?? | ?? | ?? | ?? |
| `target_column_name` | string |  **Required.** The name of the target/label column. It must always be specified.|  |  |
| `task` | string | **Required.** The type of AutoML task to execute. | 'forecasting' | 'forecasting' |
| `cv_split_column_names` | list(string) | List of names of the columns that contain custom cross validation split. Each of the CV split columns represents one CV split where each row are either marked 1 for training or 0 for validation. This parameter is applicable to ``training_data`` parameter for custom cross validation purposes.For more information, see `Configure data splits and cross-validation in automated machine learning <https://docs.microsoft.com/azure/machine-learning/how-to-configure-cross-validation-data-splits>`. | list(string), None | None |
| `featurization` | object | Dictionary containing the featurization config. See [featurization](#featurization) to see the properties of this object. |  |  |
| `forecasting` | object | Dictionary containing the forecasting settings config. See [forecasting](#forecasting) to see the properties of this object.|  |  |
| `limits` | object | Dictionary of limit configurations of the job. The key is name for the limit within the context of the job and the value is limit value. See [limits](#limits) to see the properties of this object.|  |  |
| `n_cross_validations` | string or integer | 
Number of cross-validation folds to use for model/pipeline selection when user validation data is not specified.The default value is "auto", in which case AutoMl determines the number of cross-validations automatically, if a validation set is not provided. Or, users could specify an integer value. OR ---------- Number of cross validations to perform when user validation data is not specified. Specify `validation_data` to provide validation data, otherwise set `n_cross_validations` or `validation_size` to extract validation data out of the specified training data.For more information, see `Configure data splits and cross-validation in automated machine learning <https://docs.microsoft.com/azure/machine-learning/how-to-configure-cross-validation-data-splits>`__. | 'auto', integer,None | None |
| `primary_metric` | string | The metric that AutoML will optimize for Time Series Forecasting model selection. If not specified, then AutoML use normalized RMSE for forecasting tasks.| "spearman_correlation", "normalized_root_mean_squared_error", "r2_score", "normalized_mean_absolute_error" | None |
| `test_data` | object | The test data to be used for a test run that will automatically be started after model training is complete. The test run will get predictions using the best model and will compute metrics given these predictions. If this parameter or the ``test_size`` parameter are not specified then no test run will be executed automatically after model training is completed. Test data should contain both features and label column. If ``test_data`` is specified then the ``label_column_name`` parameter must be specified. |  | None |
| `test_data_size` | float | Specifies what fraction of the training data to hold out for test data for a test run that will automatically be started after model training is complete. The test run will get predictions using the best model and will compute metrics given these predictions. If ``test_size`` is specified at the same time as ``validation_size``, then the test data is split from ``training_data`` before the validation data is split. For example, if ``validation_size=0.1``, ``test_size=0.1`` and the original training data has 1000 rows, then the test data will have 100 rows, the validation data will contain 90 rows and the training data will have 810 rows. Forecasting does not currently support specifying a test dataset using a train/test split. If this parameter or the ``test_data`` parameter are not specified then no test run will be executed automatically after model training is completed. |  0.0 < size_value < 1.0 | None |
| `training` | object | Dictionary containing the parameters that will be used in training the model. |  |  |
| `training_data` | object | The subset of data to be used as input for model training. It should contain both training features and a label column (optionally a sample weights column). If ``training_data`` is specified, then the ``label_column_name``(or ``target_column_name``) parameter must also be specified. |  | None |
| `validation_data` | object | The validation data to be used within the experiment for cross validation.It should contain both training features and label column (optionally a sample weights column). If ``validation_data`` is specified, then ``training_data`` and ``label_column_name`` parameters must be specified. For more information, see `Configure data splits and cross-validation in automated machine learning <https://docs.microsoft.com/azure/machine-learning/how-to-configure-cross-validation-data-splits>`__.Please note that samples in training data and validation data can not overlap in a fold.|  | None |
| `validation_data_size` | float | Specifies the fraction of data to hold out as validation dataset when client has not passed validation dataset explicitly. Specify ``validation_data`` to provide validation data, otherwise set ``n_cross_validations`` or ``validation_size`` to extract validation data out of the specified training data.For more information, see `Configure data splits and cross-validation in automated machine learning <https://docs.microsoft.com/azure/machine-learning/how-to-configure-cross-validation-data-splits>`__.| 0.0 <= size_value <= 1.0 | None |
| `weight_column_name` | string | The name of the sample weight column. Automated ML supports a weighted column as an input, causing rows in the data to be weighted up or down. This parameter is applicable to ``training_data`` and ``validation_data`` parameters. |  | None |


### limits

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `enable_early_termination` | boolean | Whether to enable early termination of experiment if the score is not improving  some x number of iterations. In AutoML job, no early stopping is applied on first 20 iterations. early stopping window starts only after first 20 iterations. | True, False | True |
| `max_concurrent_trials` | integer | Maximum number of trials (children jobs) that would be executed in parallel. |  | None |
| `max_cores_per_trial` | integer | Maximum number of cores per iteration (or trials) |  | None |
| `max_trials` | integer | The maximum number of different algorithm and parameter combinations (trials) to try during an AutoML job. If user is using `enable_early_termination`, then the number of trials used can be smaller. |  | None |
| `timeout_minutes ` | integer | Maximum amount of time in minutes that the whole AutoML job can take before the job terminates. This timeout includes setup, featurization and training runs but doesn't include the ensembling and model explainability runs at the end of the process since those actions need to happen once all the trials (children jobs) are done. If not specified, the default job's total timeout is six days (8,640 minutes). To specify a timeout less than or equal to 1 hour (60 minutes), the user should make sure dataset's size isn't greater than 10,000,000 (rows times column) or an error results. |  | None |
| `trial_timeout_minutes ` | integer | Maximum time in minutes that each trial (child job) can run for before it terminates. If not specified, a value of one month or 43200 minutes is used. |  | None |
| `exit_score` | float | Target score for experiment. The experiment terminates after this score is reached. If not specified (no criteria), the experiment runs until no further progress is made on the primary metric. For for more information on exit criteria, see this `article <https://docs.microsoft.com/azure/machine-learning/how-to-configure-auto-train#exit-criteria>`. | | None |

### forecasting

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `country_or_region_for_holidays` | string or None | The country/region used to generate holiday features. These should be ISO 3166 two-letter country/region codes, for example 'US' or 'GB'. |  | None |
| `cv_step_size` | integer or None | Number of periods between the origin_time of one CV fold and the next fold. For example, if n_step = 3 for daily data, the origin time for each fold will be three days apart. |  | None |
| `feature_lags` | string or None| Flag for generating lags for the numeric features | "auto", None | None |
| `forecast_horizon` | string or integer or None | The desired maximum forecast horizon in units of time-series frequency. Units are based on the time interval of your training data, e.g., monthly, weekly that the forecaster should predict out. When task type is forecasting, this parameter is required.| string, integer, None | None |
| `frequency` | string or None | Forecast frequency. When forecasting, this parameter represents the period with which the forecast is desired, for example daily, weekly, yearly, etc. The forecast frequency is dataset frequency by default. You can optionally set it to greater (but not lesser) than dataset frequency. We'll aggregate the data and generate the results at forecast frequency. For example, for daily data, you can set the frequency to be daily, weekly or monthly, but not hourly. The frequency needs to be a pandas offset alias.Please refer to pandas documentation for more information:https://pandas.pydata.org/pandas-docs/stable/user_guide/timeseries.html#dateoffset-objects | string, None | None |
| `seasonality` | string or integer | Set time series seasonality as an integer multiple of the series frequency. If seasonality is set to 'auto', it will be inferred. If set to None, the time series is assumed non-seasonal which is equivalent to seasonality=1| 'auto', integer, None | None | 
| `short_series_handling_config` | string | The parameter defining how if AutoML should handle short time series. Possible values: <br>'auto' : short series will be padded if there are no long series,otherwise short series will be dropped.<br>'pad': all the short series will be padded with zeros.<br>'drop': all the short series will be dropped.<br> None:the short series will not be modified.| "auto","pad","drop", None | None |
| `target_aggregate_function` | string | The function to be used to aggregate the time series target column to conform to a user specified frequency. If the target_aggregation_function is set, but the `freq` parameter is not set, the error is raised. The possible target aggregation functions are: "sum", "max", "min" and "mean". | "sum","max","min","mean", None | None |
| `target_lags` | string or integer or list(integer) | The number of past periods to lag from the target column. Use 'auto' to use the automatic heuristic based lag. | string,"auto",None | None |
| `target_rolling_window_size` | string or integer | The number of past periods used to create a rolling window average of the target column. | string, integer,"auto",None | None |
| `time_column_name` | string | The name(header) of the time column. This parameter is required when forecasting to specify the datetime column in the input data used for building the time series and inferring its frequency. |  | None |
| `time_series_id_column_names` | string or list(string) | The names of columns used to group a timeseries. |  | None |
| `use_stl` | string | Configure STL Decomposition of the time-series target column. use_stl can take two values: 'season' - only generate season component and 'season_trend' - generate both season and trend components. |"season", "seasontrend", None | None |


### Distribution configurations

#### MpiConfiguration

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** Distribution type.  | `mpi` |
| `process_count_per_instance` | integer | **Required.** The number of processes per node to launch for the job.  | |

#### PyTorchConfiguration

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | const | **Required.** Distribution type.  | `pytorch` | |
| `process_count_per_instance` | integer | The number of processes per node to launch for the job. | |  `1` |

#### TensorFlowConfiguration

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | const | **Required.** Distribution type.  | `tensorflow` |
| `worker_count` | integer | The number of workers to launch for the job. | | Defaults to `resources.instance_count`. |
| `parameter_server_count` | integer | The number of parameter servers to launch for the job. | | `0` |

### Job inputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The type of job input. Specify `uri_file` for input data that points to a single file source, or `uri_folder` for input data that points to a folder source. | `uri_file`, `uri_folder`, `mlflow_model`, `custom_model`| `uri_folder` |
| `path` | string | The path to the data to use as input. This can be specified in a few ways: <br><br> - A local path to the data source file or folder, e.g. `path: ./iris.csv`. The data will get uploaded during job submission. <br><br> - A URI of a cloud path to the file or folder to use as the input. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, `adl`. See [Core yaml syntax](reference-yaml-core-syntax.md) for more information on how to use the `azureml://` URI format. <br><br> - An existing registered Azure ML data asset to use as the input. To reference a registered data asset use the `azureml:<data_name>:<data_version>` syntax or `azureml:<data_name>@latest` (to reference the latest version of that data asset), e.g. `path: azureml:cifar10-data:1` or `path: azureml:cifar10-data@latest`. | | |
| `mode` | string | Mode of how the data should be delivered to the compute target. <br><br> For read-only mount (`ro_mount`), the data will be consumed as a mount path. A folder will be mounted as a folder and a file will be mounted as a file. Azure ML will resolve the input to the mount path. <br><br> For `download` mode the data will be downloaded to the compute target. Azure ML will resolve the input to the downloaded path. <br><br> If you only want the URL of the storage location of the data artifact(s) rather than mounting or downloading the data itself, you can use the `direct` mode. This will pass in the URL of the storage location as the job input. Note that in this case you are fully responsible for handling credentials to access the storage. | `ro_mount`, `download`, `direct` | `ro_mount` |

### Job outputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The type of job output. For the default `uri_folder` type, the output will correspond to a folder. | `uri_folder` , `mlflow_model`, `custom_model`| `uri_folder` |
| `mode` | string | Mode of how output file(s) will get delivered to the destination storage. For read-write mount mode (`rw_mount`) the output directory will be a mounted directory. For upload mode the file(s) written will get uploaded at the end of the job. | `rw_mount`, `upload` | `rw_mount` |

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
