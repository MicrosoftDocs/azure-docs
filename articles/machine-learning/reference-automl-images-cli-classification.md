---
title: 'CLI (v2) Automated ML Image Classification job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Automated ML Image Classification job YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-ignite-2022

ms.author: rasavage
author: rsavage2
ms.date: 10/11/2022
ms.reviewer: ssalgado
---

# CLI (v2) Automated ML image classification job YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlsdk2.blob.core.windows.net/preview/0.0.1/autoMLImageClassificationJob.schema.json.



[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If the user uses the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of the file enables the user to invoke schema and resource completions. | | |
| `type` | const | **Required.** The type of job. | `automl` | `automl` |
| `task` | const | **Required.** The type of AutoML task. | `image_classification` | `image_classification` |
| `name` | string | Name of the job. Must be unique across all jobs in the workspace. If omitted, Azure Machine Learning will autogenerate a GUID for the name. | | |
| `display_name` | string | Display name of the job in the studio UI. Can be non-unique within the workspace. If omitted, Azure Machine Learning will autogenerate a human-readable adjective-noun identifier for the display name. | | |
| `experiment_name` | string | Experiment name to organize the job under. Each job's run record will be organized under the corresponding experiment in the studio's "Experiments" tab. If omitted, Azure Machine Learning will default it to the name of the working directory where the job was created. | | |
| `description` | string | Description of the job. | | |
| `tags` | object | Dictionary of tags for the job. | | |
| `compute` | string | Name of the compute target to execute the job on. This compute can be either a reference to an existing compute in the workspace (using the `azureml:<compute_name>` syntax) or `local` to designate local execution. For more information on compute for AutoML image jobs, see [Compute to run experiment](./how-to-auto-train-image-models.md?tabs=cli#compute-to-run-experiment) section.<br> <br>  *Note:* jobs in pipeline don't support `local` as `compute`. * | | `local` |
| `log_verbosity` | number | Different levels of log verbosity. |`not_set`, `debug`, `info`, `warning`, `error`, `critical` | `info` |
| `primary_metric` | string |  The metric that AutoML will optimize for model selection. |`accuracy` | `accuracy` |
| `target_column_name` | string |  **Required.** The name of the column to target for predictions. It must always be specified. This parameter is applicable to `training_data` and `validation_data`. | |  |
| `training_data` | object |  **Required.** The data to be used within the job. It should contain both training feature columns and a target column. The parameter training_data must always be provided. For more information on keys and their descriptions, see [Training or validation data](#training-or-validation-data) section. For an example, see [Consume data](./how-to-auto-train-image-models.md?tabs=cli#consume-data) section. | |  |
| `validation_data` | object |  The validation data to be used within the job. It should contain both training features and label column (optionally a sample weights column). If `validation_data` is specified, then `training_data` and `target_column_name` parameters must be specified. For more information on keys and their descriptions, see [Training or validation data](#training-or-validation-data) section. For an example, see [Consume data](./how-to-auto-train-image-models.md?tabs=cli#consume-data) section| |  |
| `validation_data_size` | float |  What fraction of the data to hold out for validation when user validation data isn't specified. | A value in range (0.0, 1.0) |  |
| `limits` | object | Dictionary of limit configurations of the job. The key is name for the limit within the context of the job and the value is limit value. For more information, see [Configure your experiment settings](./how-to-auto-train-image-models.md?tabs=cli#job-limits) section. | | |
| `training_parameters` | object | Dictionary containing training parameters for the job. Provide an object that has keys as listed in following sections. <br> - [Model agnostic hyperparameters](./reference-automl-images-hyperparameters.md#model-agnostic-hyperparameters) <br> - [Image classification (multi-class and multi-label) specific hyperparameters](./reference-automl-images-hyperparameters.md#image-classification-multi-class-and-multi-label-specific-hyperparameters). <br> <br> For an example, see [Supported model architectures](./how-to-auto-train-image-models.md?tabs=cli#supported-model-architectures) section. | | |
| `sweep` | object | Dictionary containing sweep parameters for the job. It has two keys - `sampling_algorithm` (**required**) and `early_termination`. For more information and an example, see [Sampling methods for the sweep](./how-to-auto-train-image-models.md?tabs=cli#sampling-methods-for-the-sweep), [Early termination policies](./how-to-auto-train-image-models.md?tabs=cli#early-termination-policies) sections. | | |
| `search_space` | object | Dictionary of the hyperparameter search space. The key is the name of the hyperparameter and the value is the parameter expression. The user can find the possible hyperparameters from parameters specified for `training_parameters` key. For an example, see [Sweeping hyperparameters for your model](./how-to-auto-train-image-models.md?tabs=cli#manually-sweeping-model-hyperparameters) section. | | |
| `search_space.<hyperparameter>` | object | There are two types of hyperparameters: <br> - **Discrete Hyperparameters**: Discrete hyperparameters are specified as a [`choice`](./reference-yaml-job-sweep.md#choice) among discrete values. `choice` can be one or more comma-separated values, a `range` object, or any arbitrary `list` object. Advanced discrete hyperparameters can also be specified using a distribution - [`randint`](./reference-yaml-job-sweep.md#randint), [`qlognormal`, `qnormal`](./reference-yaml-job-sweep.md#qlognormal-qnormal), [`qloguniform`, `quniform`](./reference-yaml-job-sweep.md#qloguniform-quniform). For more information, see this [section](./how-to-tune-hyperparameters.md#discrete-hyperparameters). <br> - **Continuous hyperparameters**: Continuous hyperparameters are specified as a distribution over a continuous range of values. Currently supported distributions are - [`lognormal`, `normal`](./reference-yaml-job-sweep.md#lognormal-normal), [`loguniform`](./reference-yaml-job-sweep.md#loguniform), [`uniform`](./reference-yaml-job-sweep.md#uniform). For more information, see this [section](./how-to-tune-hyperparameters.md#continuous-hyperparameters). <br> <br> See [Parameter expressions](./reference-yaml-job-sweep.md#parameter-expressions) for the set of possible expressions to use.  | | |
| `outputs` | object | Dictionary of output configurations of the job. The key is a name for the output within the context of the job and the value is the output configuration. | | |
| `outputs.best_model` | object | Dictionary of output configurations for best model. For more information, see [Best model output configuration](#best-model-output-configuration). | | |


### Training or validation data

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `description` | string | The detailed information that describes this input data. | | |
| `path` | string | Path can be a `file` path, `folder` path or `pattern` for paths. `pattern` specifies a search pattern to allow globbing(`*` and `**`) of files and folders containing data. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, and `adl`. For more information on how to use the `azureml://` URI format, see [Core yaml syntax](./reference-yaml-core-syntax.md). URI of the location of the artifact file. If this URI doesn't have a scheme (for example, http:, azureml: etc.), then it's considered a local reference and the file it points to is uploaded to the default workspace blob-storage as the entity is created.  | | |
| `mode` | string | Dataset delivery mechanism. | `direct` | `direct` |
| `type` | const |  In order to generate computer vision models, the user needs to bring labeled image data as input for model training in the form of an MLTable. | mltable | mltable|

### Best model output configuration

| Key | Type | Description | Allowed values |Default value |
| --- | ---- | ----------- | -------------- | ------------ |
| `type` | string | **Required.** Type of best model. AutoML allows only mlflow models. | `mlflow_model` | `mlflow_model` |
| `path` | string | **Required.** URI of the location where the model-artifact file(s) are stored. If this URI doesn't have a scheme (for example, http:, azureml: etc.), then it's considered a local reference and the file it points to is uploaded to the default workspace blob-storage as the entity is created. |  |  |
| `storage_uri` | string | The HTTP URL of the Model. Use this URL with `az storage copy -s THIS_URL -d DESTINATION_PATH --recursive` to download the data.  | | |

## Remarks

The `az ml job` command can be used for managing Azure Machine Learning jobs.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs). Examples relevant to image classification job are linked below.  

## YAML: AutoML image classification job

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/automl-standalone-jobs/cli-automl-image-classification-multiclass-task-fridge-items/cli-automl-image-classification-multiclass-task-fridge-items.yml":::

## YAML: AutoML image classification pipeline job

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/automl/image-multiclass-classification-fridge-items-pipeline/pipeline.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
