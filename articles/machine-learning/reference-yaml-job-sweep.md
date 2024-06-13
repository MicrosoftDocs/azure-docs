---
title: 'CLI (v2) sweep job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) sweep job YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, devx-track-python, update-code5
ms.author: amipatel
author: amibp
ms.date: 03/05/2024
ms.reviewer: franksolomon
---

# CLI (v2) sweep job YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/sweepJob.schema.json.


[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, you can invoke schema and resource completions if you include `$schema` at the top of your file. | | |
| `type` | const | **Required.** The type of job. | `sweep` | `sweep` |
| `name` | string | Name of the job. Must be unique across all jobs in the workspace. If omitted, Azure Machine Learning autogenerates a GUID for the name. | | |
| `display_name` | string | Display name of the job in the studio UI. Can be non-unique within the workspace. If omitted, Azure Machine Learning autogenerates a human-readable adjective-noun identifier for the display name. | | |
| `experiment_name` | string | Organize the job under the experiment name. The run record of each job is organized under the corresponding experiment in the "Experiments" tab of the studio. If omitted, Azure Machine Learning defaults `experiment_name` to the name of the working directory where the job was created. | | |
| `description` | string | Description of the job. | | |
| `tags` | object | Dictionary of tags for the job. | | |
| `sampling_algorithm` | object | **Required.** The hyperparameter sampling algorithm to use over the `search_space`. One of [RandomSamplingAlgorithm](#randomsamplingalgorithm), [GridSamplingAlgorithm](#gridsamplingalgorithm),or [BayesianSamplingAlgorithm](#bayesiansamplingalgorithm). | | |
| `search_space` | object | **Required.** Dictionary of the hyperparameter search space. The hyperparameter name is the key, and the value is the parameter expression. <br><br> Hyperparameters can be referenced in the `trial.command` with the `${{ search_space.<hyperparameter> }}` expression. | | |
| `search_space.<hyperparameter>` | object | Visit [Parameter expressions](#parameter-expressions) for the set of possible expressions to use. | | |
| `objective.primary_metric` | string | **Required.** The name of the primary metric reported by each trial job. The metric must be logged in the user's training script, using `mlflow.log_metric()` with the same corresponding metric name. | | |
| `objective.goal` | string | **Required.** The optimization goal of the `objective.primary_metric`. | `maximize`, `minimize` | |
| `early_termination` | object | The early termination policy to use. A trial job is canceled when the criteria of the specified policy are met. If omitted, no early termination policy is applied. One of [BanditPolicy](#banditpolicy), [MedianStoppingPolicy](#medianstoppingpolicy),or [TruncationSelectionPolicy](#truncationselectionpolicy). | | |
| `limits` | object | Limits for the sweep job. See [Attributes of the `limits` key](#attributes-of-the-limits-key). | | |
| `compute` | string | **Required.** Name of the compute target on which to execute the job, with the `azureml:<compute_name>` syntax. | | |
| `trial` | object | **Required.** The job template for each trial. Each trial job is provided with a different combination of hyperparameter values that the system samples from the `search_space`. Visit [Attributes of the `trial` key](#attributes-of-the-trial-key). | | |
| `inputs` | object | Dictionary of inputs to the job. The key is a name for the input within the context of the job and the value is the input value. <br><br> Inputs can be referenced in the `command` using the `${{ inputs.<input_name> }}` expression. | | |
| `inputs.<input_name>` | number, integer, boolean, string, or object | One of a literal value (of type number, integer, boolean, or string) or an object that contains a [job input data specification](#job-inputs). | | |
| `outputs` | object | Dictionary of output configurations of the job. The key is a name for the output within the context of the job and the value is the output configuration. <br><br> Outputs can be referenced in the `command` using the `${{ outputs.<output_name> }}` expression. | |
| `outputs.<output_name>` | object | You can leave the object empty, and in that case, by default the output is of `uri_folder` type and Azure Machine Learning system-generates an output location for the output. All files to the output directory are written via read-write mount. To specify a different mode for the output, provide an object that contains the [job output specification](#job-outputs). | |
| `identity` | object | The identity is used for data accessing. It can be [User Identity Configuration](#useridentityconfiguration), [Managed Identity Configuration](#managedidentityconfiguration) or None. For UserIdentityConfiguration, the identity of job submitter is used to access input data and write result to output folder. Otherwise, the managed identity of the compute target is used. | |

### Sampling algorithms

#### RandomSamplingAlgorithm

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | const | **Required.** The type of sampling algorithm. | `random` | |
| `seed` | integer | A random seed to use to initialize the random number generation. If omitted, the default seed value is null. | | |
| `rule` | string | The type of random sampling to use. The default, `random`, uses simple uniform random sampling, while `sobol` uses the Sobol quasi-random sequence. | `random`, `sobol` | `random` |

#### GridSamplingAlgorithm

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The sampling algorithm type. | `grid` |

#### BayesianSamplingAlgorithm

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The sampling algorithm type. | `bayesian` |

### Early termination policies

#### BanditPolicy

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | const | **Required.** The policy type. | `bandit` | |
| `slack_factor` | number | The ratio used to calculate the allowed distance from the best performing trial. **One of `slack_factor` or `slack_amount` is required.** | | |
| `slack_amount` | number | The absolute distance allowed from the best performing trial. **One of `slack_factor` or `slack_amount` is required.** | | |
| `evaluation_interval` | integer | The frequency for applying the policy. | | `1` |
| `delay_evaluation` | integer | The number of intervals for which to delay the first policy evaluation. If specified, the policy applies on every multiple of `evaluation_interval` that is greater than or equal to `delay_evaluation`. | | `0` |

#### MedianStoppingPolicy

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | const | **Required.** The policy type. | `median_stopping` | |
| `evaluation_interval` | integer | The frequency for applying the policy. | | `1` |
| `delay_evaluation` | integer | The number of intervals for which to delay the first policy evaluation. If specified, the policy applies on every multiple of `evaluation_interval` that is greater than or equal to `delay_evaluation`. | | `0` |

#### TruncationSelectionPolicy

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | const | **Required.** The policy type. | `truncation_selection` | |
| `truncation_percentage` | integer | **Required.** The percentage of trial jobs to cancel at each evaluation interval. | | |
| `evaluation_interval` | integer | The frequency for applying the policy. | | `1` |
| `delay_evaluation` | integer | The number of intervals for which to delay the first policy evaluation. If specified, the policy applies on every multiple of `evaluation_interval` that is greater than or equal to `delay_evaluation`. | | `0` |

### Parameter expressions

#### Choice

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The expression type. | `choice` |
| `values` | array | **Required.** The list of discrete values from which to choose. | |

#### Randint

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The expression type. | `randint` |
| `upper` | integer | **Required.** The exclusive upper bound for the range of integers. | |

#### Qlognormal, qnormal

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The expression type. | `qlognormal`, `qnormal` |
| `mu` | number | **Required.** The mean of the normal distribution. | |
| `sigma` | number | **Required.** The standard deviation of the normal distribution. | |
| `q` | integer | **Required.** The smoothing factor. | |

#### Qloguniform, quniform

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The expression type. | `qloguniform`, `quniform` |
| `min_value` | number | **Required.** The minimum value in the range (inclusive). | |
| `max_value` | number | **Required.** The maximum value in the range (inclusive). | |
| `q` | integer | **Required.** The smoothing factor. | |

#### Lognormal, normal

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The expression type. | `lognormal`, `normal` |
| `mu` | number | **Required.** The mean of the normal distribution. | |
| `sigma` | number | **Required.** The standard deviation of the normal distribution. | |

#### Loguniform

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The expression type. | `loguniform` |
| `min_value` | number | **Required.** The minimum value in the range is `exp(min_value)` (inclusive). | |
| `max_value` | number | **Required.** The maximum value in the range is `exp(max_value)` (inclusive). | |

#### Uniform

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The expression type. | `uniform` |
| `min_value` | number | **Required.** The minimum value in the range (inclusive). | |
| `max_value` | number | **Required.** The maximum value in the range (inclusive). | |

### Attributes of the `limits` key

| Key | Type | Description | Default value |
| --- | ---- | ----------- | ------------- |
| `max_total_trials` | integer | The maximum number of trial jobs. | `1000` |
| `max_concurrent_trials` | integer | The maximum number of trial jobs that can run concurrently. | Defaults to `max_total_trials`. |
| `timeout` | integer | The maximum time in seconds, that the entire sweep job is allowed to run. Once this limit is reached, the system cancels the sweep job, including all of its trials. | `5184000` |
| `trial_timeout` | integer | The maximum time in seconds each trial job is allowed to run. Once this limit is reached, the system cancels the trial. | |

### Attributes of the `trial` key

| Key | Type | Description | Default value |
| --- | ---- | ----------- | ------------- |
| `command` | string | **Required.** The command to execute. | |
| `code` | string | Local path to the source code directory to be uploaded and used for the job. | |
| `environment` | string or object | **Required.** The environment to use for the job. This value can be either a reference to an existing versioned environment in the workspace or an inline environment specification. <br> <br> To reference an existing environment, use the `azureml:<environment-name>:<environment-version>` syntax. <br><br> To define an environment inline, follow the [Environment schema](reference-yaml-environment.md#yaml-syntax). Exclude the `name` and `version` properties because inline environments don't support them. | |
| `environment_variables` | object | Dictionary of environment variable name-value pairs to set on the process where the command is executed. | |
| `distribution` | object | The distribution configuration for distributed training scenarios. One of [Mpi Configuration](#mpiconfiguration), [PyTorch Configuration](#pytorchconfiguration), or [TensorFlow Configuration](#tensorflowconfiguration). | |
| `resources.instance_count` | integer | The number of nodes to use for the job. | `1` |

#### Distribution configurations

##### MpiConfiguration

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** Distribution type.  | `mpi` |
| `process_count_per_instance` | integer | **Required.** The number of processes per node to launch for the job.  | |

##### PyTorchConfiguration

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | const | **Required.** Distribution type.  | `pytorch` | |
| `process_count_per_instance` | integer | The number of processes per node to launch for the job. | |  `1` |

##### TensorFlowConfiguration

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | const | **Required.** Distribution type.  | `tensorflow` |
| `worker_count` | integer | The number of workers to launch for the job. | | Defaults to `resources.instance_count`. |
| `parameter_server_count` | integer | The number of parameter servers to launch for the job. | | `0` |

### Job inputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The type of job input. Specify `uri_file` for input data that points to a single file source, or `uri_folder` for input data that points to a folder source. For more information, visit [Learn more about data access.](concept-data.md)| `uri_file`, `uri_folder`, `mltable`, `mlflow_model` | `uri_folder` |
| `path` | string | The path to the data to use as input. This value can be specified in a few ways: <br><br> - A local path to the data source file or folder, for example, `path: ./iris.csv`. The data uploads during job submission. <br><br> - A URI of a cloud path to the file or folder to use as the input. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, `adl`. For more information about use of the `azureml://` URI format, visit [Core yaml syntax](reference-yaml-core-syntax.md). <br><br> - An existing registered Azure Machine Learning data asset to use as the input. To reference a registered data asset, use the `azureml:<data_name>:<data_version>` syntax or `azureml:<data_name>@latest` (to reference the latest version of that data asset) - for example, `path: azureml:cifar10-data:1` or `path: azureml:cifar10-data@latest`. | | |
| `mode` | string | Mode of how the data should be delivered to the compute target. <br><br> For read-only mount (`ro_mount`), the data is consumed as a mount path. A folder is mounted as a folder and a file is mounted as a file. Azure Machine Learning resolves the input to the mount path. <br><br> For `download` mode, the data is downloaded to the compute target. Azure Machine Learning resolves the input to the downloaded path. <br><br> For just the URL of the storage location of the data artifact or artifacts, instead of mounting or downloading the data itself, use the `direct` mode. This passes in the URL of the storage location as the job input. In this case, you're fully responsible for handling credentials to access the storage. | `ro_mount`, `download`, `direct` | `ro_mount` |

### Job outputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The job output type. For the default `uri_folder` type, the output corresponds to a folder. | `uri_file`, `uri_folder`, `mltable`, `mlflow_model`  | `uri_folder` |
| `mode` | string | Mode of the delivery of the output file or files to the destination storage. For the read-write mount mode (`rw_mount`), the output directory is a mounted directory. For the upload mode, all files written are uploaded at the end of the job. | `rw_mount`, `upload` | `rw_mount` |

### Identity configurations

#### UserIdentityConfiguration

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** Identity type.  | `user_identity` |

#### ManagedIdentityConfiguration

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** Identity type.  | `managed` or `managed_identity` |

## Remarks

You can use the `az ml job` command to manage Azure Machine Learning jobs.

## Examples

Visit the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs) for examples. Several are shown here:

## YAML: hello sweep

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-sweep.yml":::

## YAML: basic Python model hyperparameter tuning

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/scikit-learn/iris/job-sweep.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
