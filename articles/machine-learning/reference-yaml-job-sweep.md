---
title: 'CLI (v2) sweep job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) sweep job YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022, devx-track-python
ms.author: amipatel
author: amibp
ms.date: 11/28/2022
ms.reviewer: larryfr
---

# CLI (v2) sweep job YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/sweepJob.schema.json.



[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `type` | const | **Required.** The type of job. | `sweep` | `sweep` |
| `name` | string | Name of the job. Must be unique across all jobs in the workspace. If omitted, Azure Machine Learning will autogenerate a GUID for the name. | | |
| `display_name` | string | Display name of the job in the studio UI. Can be non-unique within the workspace. If omitted, Azure Machine Learning will autogenerate a human-readable adjective-noun identifier for the display name. | | |
| `experiment_name` | string | Experiment name to organize the job under. Each job's run record will be organized under the corresponding experiment in the studio's "Experiments" tab. If omitted, Azure Machine Learning will default it to the name of the working directory where the job was created. | | |
| `description` | string | Description of the job. | | |
| `tags` | object | Dictionary of tags for the job. | | |
| `sampling_algorithm` | object | **Required.** The hyperparameter sampling algorithm to use over the `search_space`. One of [RandomSamplingAlgorithm](#randomsamplingalgorithm), [GridSamplingAlgorithm](#gridsamplingalgorithm),or [BayesianSamplingAlgorithm](#bayesiansamplingalgorithm). | | |
| `search_space` | object | **Required.** Dictionary of the hyperparameter search space. The key is the name of the hyperparameter and the value is the parameter expression. <br><br> Hyperparameters can be referenced in the `trial.command` using the `${{ search_space.<hyperparameter> }}` expression. | | |
| `search_space.<hyperparameter>` | object | See [Parameter expressions](#parameter-expressions) for the set of possible expressions to use. | | |
| `objective.primary_metric` | string | **Required.** The name of the primary metric reported by each trial job. The metric must be logged in the user's training script using `mlflow.log_metric()` with the same corresponding metric name. | | |
| `objective.goal` | string | **Required.** The optimization goal of the `objective.primary_metric`. | `maximize`, `minimize` | |
| `early_termination` | object | The early termination policy to use. A trial job is canceled when the criteria of the specified policy are met. If omitted, no early termination policy will be applied. One of [BanditPolicy](#banditpolicy), [MedianStoppingPolicy](#medianstoppingpolicy),or [TruncationSelectionPolicy](#truncationselectionpolicy). | | |
| `limits` | object | Limits for the sweep job. See [Attributes of the `limits` key](#attributes-of-the-limits-key). | | |
| `compute` | string | **Required.** Name of the compute target to execute the job on, using the `azureml:<compute_name>` syntax. | | |
| `trial` | object | **Required.** The job template for each trial. Each trial job will be provided with a different combination of hyperparameter values that the system samples from the `search_space`. See [Attributes of the `trial` key](#attributes-of-the-trial-key). | | |
| `inputs` | object | Dictionary of inputs to the job. The key is a name for the input within the context of the job and the value is the input value. <br><br> Inputs can be referenced in the `command` using the `${{ inputs.<input_name> }}` expression. | | |
| `inputs.<input_name>` | number, integer, boolean, string or object | One of a literal value (of type number, integer, boolean, or string) or an object containing a [job input data specification](#job-inputs). | | |
| `outputs` | object | Dictionary of output configurations of the job. The key is a name for the output within the context of the job and the value is the output configuration. <br><br> Outputs can be referenced in the `command` using the `${{ outputs.<output_name> }}` expression. | |
| `outputs.<output_name>` | object | You can leave the object empty, in which case by default the output will be of type `uri_folder` and Azure Machine Learning will system-generate an output location for the output. File(s) to the output directory will be written via read-write mount. If you want to specify a different mode for the output, provide an object containing the [job output specification](#job-outputs). | |
| `identity` | object | The identity is used for data accessing. It can be [UserIdentityConfiguration](#useridentityconfiguration), [ManagedIdentityConfiguration](#managedidentityconfiguration) or None. If UserIdentityConfiguration, the identity of job submitter will be used to access input data and write result to output folder, otherwise, the managed identity of the compute target will be used. | |

### Sampling algorithms

#### RandomSamplingAlgorithm

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | const | **Required.** The type of sampling algorithm. | `random` | |
| `seed` | integer | A random seed to use for initializing the random number generation. If omitted, the default seed value will be null. | | |
| `rule` | string | The type of random sampling to use. The default, `random`, will use simple uniform random sampling, while `sobol` will use the Sobol quasirandom sequence. | `random`, `sobol` | `random` |

#### GridSamplingAlgorithm

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of sampling algorithm. | `grid` |

#### BayesianSamplingAlgorithm

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of sampling algorithm. | `bayesian` |

### Early termination policies

#### BanditPolicy

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | const | **Required.** The type of policy. | `bandit` | |
| `slack_factor` | number | The ratio used to calculate the allowed distance from the best performing trial. **One of `slack_factor` or `slack_amount` is required.** | | |
| `slack_amount` | number | The absolute distance allowed from the best performing trial. **One of `slack_factor` or `slack_amount` is required.** | | |
| `evaluation_interval` | integer | The frequency for applying the policy. | | `1` |
| `delay_evaluation` | integer | The number of intervals for which to delay the first policy evaluation. If specified, the policy applies on every multiple of `evaluation_interval` that is greater than or equal to `delay_evaluation`. | | `0` |

#### MedianStoppingPolicy

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | const | **Required.** The type of policy. | `median_stopping` | |
| `evaluation_interval` | integer | The frequency for applying the policy. | | `1` |
| `delay_evaluation` | integer | The number of intervals for which to delay the first policy evaluation. If specified, the policy applies on every multiple of `evaluation_interval` that is greater than or equal to `delay_evaluation`. | | `0` |

#### TruncationSelectionPolicy

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | const | **Required.** The type of policy. | `truncation_selection` | |
| `truncation_percentage` | integer | **Required.** The percentage of trial jobs to cancel at each evaluation interval. | | |
| `evaluation_interval` | integer | The frequency for applying the policy. | | `1` |
| `delay_evaluation` | integer | The number of intervals for which to delay the first policy evaluation. If specified, the policy applies on every multiple of `evaluation_interval` that is greater than or equal to `delay_evaluation`. | | `0` |

### Parameter expressions

#### choice

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of expression. | `choice` |
| `values` | array | **Required.** The list of discrete values to choose from. | |

#### randint

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of expression. | `randint` |
| `upper` | integer | **Required.** The exclusive upper bound for the range of integers. | |

#### qlognormal, qnormal

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of expression. | `qlognormal`, `qnormal` |
| `mu` | number | **Required.** The mean of the normal distribution. | |
| `sigma` | number | **Required.** The standard deviation of the normal distribution. | |
| `q` | integer | **Required.** The smoothing factor. | |

#### qloguniform, quniform

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of expression. | `qloguniform`, `quniform` |
| `min_value` | number | **Required.** The minimum value in the range (inclusive). | |
| `max_value` | number | **Required.** The maximum value in the range (inclusive). | |
| `q` | integer | **Required.** The smoothing factor. | |

#### lognormal, normal

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of expression. | `lognormal`, `normal` |
| `mu` | number | **Required.** The mean of the normal distribution. | |
| `sigma` | number | **Required.** The standard deviation of the normal distribution. | |

#### loguniform

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of expression. | `loguniform` |
| `min_value` | number | **Required.** The minimum value in the range will be `exp(min_value)` (inclusive). | |
| `max_value` | number | **Required.** The maximum value in the range will be `exp(max_value)` (inclusive). | |

#### uniform

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of expression. | `uniform` |
| `min_value` | number | **Required.** The minimum value in the range (inclusive). | |
| `max_value` | number | **Required.** The maximum value in the range (inclusive). | |

### Attributes of the `limits` key

| Key | Type | Description | Default value |
| --- | ---- | ----------- | ------------- |
| `max_total_trials` | integer | The maximum number of trial jobs. | `1000` |
| `max_concurrent_trials` | integer | The maximum number of trial jobs that can run concurrently. | Defaults to `max_total_trials`. |
| `timeout` | integer | The maximum time in seconds the entire sweep job is allowed to run. Once this limit is reached, the system will cancel the sweep job, including all its trials. | `5184000` |
| `trial_timeout` | integer | The maximum time in seconds each trial job is allowed to run. Once this limit is reached, the system will cancel the trial. | |

### Attributes of the `trial` key

| Key | Type | Description | Default value |
| --- | ---- | ----------- | ------------- |
| `command` | string | **Required.** The command to execute. | |
| `code` | string | Local path to the source code directory to be uploaded and used for the job. | |
| `environment` | string or object | **Required.** The environment to use for the job. This can be either a reference to an existing versioned environment in the workspace or an inline environment specification. <br> <br> To reference an existing environment, use the `azureml:<environment-name>:<environment-version>` syntax. <br><br> To define an environment inline, follow the [Environment schema](reference-yaml-environment.md#yaml-syntax). Exclude the `name` and `version` properties as they aren't supported for inline environments. | |
| `environment_variables` | object | Dictionary of environment variable name-value pairs to set on the process where the command is executed. | |
| `distribution` | object | The distribution configuration for distributed training scenarios. One of [MpiConfiguration](#mpiconfiguration), [PyTorchConfiguration](#pytorchconfiguration), or [TensorFlowConfiguration](#tensorflowconfiguration). | |
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
| `type` | string | The type of job input. Specify `uri_file` for input data that points to a single file source, or `uri_folder` for input data that points to a folder source. [Learn more about data access.](concept-data.md)| `uri_file`, `uri_folder`, `mltable`, `mlflow_model` | `uri_folder` |
| `path` | string | The path to the data to use as input. This can be specified in a few ways: <br><br> - A local path to the data source file or folder, for example, `path: ./iris.csv`. The data will get uploaded during job submission. <br><br> - A URI of a cloud path to the file or folder to use as the input. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, `adl`. For more information on using the `azureml://` URI format, see [Core yaml syntax](reference-yaml-core-syntax.md). <br><br> - An existing registered Azure Machine Learning data asset to use as the input. To reference a registered data asset, use the `azureml:<data_name>:<data_version>` syntax or `azureml:<data_name>@latest` (to reference the latest version of that data asset), for example, `path: azureml:cifar10-data:1` or `path: azureml:cifar10-data@latest`. | | |
| `mode` | string | Mode of how the data should be delivered to the compute target. <br><br> For read-only mount (`ro_mount`), the data will be consumed as a mount path. A folder will be mounted as a folder and a file will be mounted as a file. Azure Machine Learning will resolve the input to the mount path. <br><br> For `download` mode the data will be downloaded to the compute target. Azure Machine Learning will resolve the input to the downloaded path. <br><br> If you only want the URL of the storage location of the data artifact(s) rather than mounting or downloading the data itself, you can use the `direct` mode. This will pass in the URL of the storage location as the job input. In this case you're fully responsible for handling credentials to access the storage. | `ro_mount`, `download`, `direct` | `ro_mount` |

### Job outputs

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `type` | string | The type of job output. For the default `uri_folder` type, the output will correspond to a folder. | `uri_file`, `uri_folder`, `mltable`, `mlflow_model`  | `uri_folder` |
| `mode` | string | Mode of how output file(s) will get delivered to the destination storage. For read-write mount mode (`rw_mount`) the output directory will be a mounted directory. For upload mode the file(s) written will get uploaded at the end of the job. | `rw_mount`, `upload` | `rw_mount` |

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

The `az ml job` command can be used for managing Azure Machine Learning jobs.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs). Several are shown below.

## YAML: hello sweep

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/basics/hello-sweep.yml":::

## YAML: basic Python model hyperparameter tuning

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/single-step/scikit-learn/iris/job-sweep.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
