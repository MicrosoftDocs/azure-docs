---
title: 'CLI (v2) Automated ML text classification job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) automated ML text classification job YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-ignite-2022

ms.author: xiaoxiaoli
author: xiaoxiaoli
ms.date: 12/22/2022
ms.reviewer: ssalgado
---

# CLI (v2) Automated ML text classification job YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

Every Azure Machine Learning entity has a schematized YAML representation. You can create a new entity from a YAML configuration file with a `.yml` or `.yaml` extension.

This article provides a reference for some syntax concepts you will encounter while configuring these YAML files for NLP text classification jobs.

The source JSON schema can be found at https://azuremlsdk2.blob.core.windows.net/preview/0.0.1/autoMLNLPTextClassificationJob.schema.json



## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | Represents the location/url to load the YAML schema. If the user uses the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of the file enables the user to invoke schema and resource completions. | | |
| `type` | const | **Required.** The type of job. | `automl` | `automl` |
| `task` | const | **Required.** The type of AutoML task. <br> Task description of text classification: <br> There are multiple possible classes and each sample can be classified as exactly one class. The task is to predict the correct class for each sample. For example, classifying a movie script as "Comedy" or "Romantic". | `text_classification` |  |
| `name` | string | Name of the job. Must be unique across all jobs in the workspace. If omitted, Azure Machine Learning will autogenerate a GUID for the name. | | |
| `display_name` | string | Display name of the job in the studio UI. Can be non-unique within the workspace. If omitted, Azure Machine Learning will autogenerate a human-readable adjective-noun identifier for the display name. | | |
| `experiment_name` | string | Experiment name to organize the job under. Each job's run record will be organized under the corresponding experiment in the studio's "Experiments" tab. If omitted, Azure Machine Learning will default it to the name of the working directory where the job was created. | | |
| `description` | string | Description of the job. | | |
| `tags` | object | Dictionary of tags for the job. | | |
| `compute` | string | Name of the compute target to execute the job on. To reference an existing compute in the workspace, we use syntax: `azureml:<compute_name>` | | |
| `log_verbosity` | number | Different levels of log verbosity. |`not_set`, `debug`, `info`, `warning`, `error`, `critical` | `info` |
| `primary_metric` | string |  The metric that AutoML will optimize for model selection. |`accuracy`,<br> `auc_weighted`,  <br> `precision_score_weighted` | `accuracy` |
| `target_column_name` | string |  **Required.** The name of the column to target for predictions. It must always be specified. This parameter is applicable to `training_data` and `validation_data`. | |  |
| `training_data` | object |  **Required.** The data to be used within the job. For multi-class classification, the dataset can contain several text columns and exactly one label column. | |  |
| `validation_data` | object | **Required.** The validation data to be used within the job. It should be consistent with the training data in terms of the set of columns, data type for each column, order of columns from left to right and at least two unique labels. <br> *Note*: the column names within each dataset should be unique.| | |
| `limits` | object | Dictionary of limit configurations of the job. Parameters in this section: `max_concurrent_trials`, `max_nodes`, `max_trials`, `timeout_minutes`, `trial_timeout_minutes`. See [limits](#limits) for detail.| | |
| `training_parameters` | object | Dictionary containing training parameters for the job. <br> See [supported hyperparameters](#supported-hyperparameters) for detail. <br> *Note*: Hyperparameters set in the `training_parameters` are fixed across all sweeping runs and thus don't need to be included in the search space. | | |
| `sweep` | object | Dictionary containing sweep parameters for the job. It has two keys - `sampling_algorithm` (**required**) and `early_termination`. For more information, see [model sweeping and hyperparameter tuning](./how-to-auto-train-nlp-models.md?tabs=cli#model-sweeping-and-hyperparameter-tuning-preview) sections. | | |
| `search_space` | object | Dictionary of the hyperparameter search space. The key is the name of the hyperparameter and the value is the parameter expression. All parameters that are fixable via `training_parameters` are supported here (to be instead swept over). See  [supported hyperparameters](#supported-hyperparameters) for more detail. <br> There are two types of hyperparameters: <br> - **Discrete Hyperparameters**: Discrete hyperparameters are specified as a [`choice`](./reference-yaml-job-sweep.md#choice) among discrete values. `choice` can be one or more comma-separated values, a `range` object, or any arbitrary `list` object. Advanced discrete hyperparameters can also be specified using a distribution - [`randint`](./reference-yaml-job-sweep.md#randint), [`qlognormal`, `qnormal`](./reference-yaml-job-sweep.md#qlognormal-qnormal), [`qloguniform`, `quniform`](./reference-yaml-job-sweep.md#qloguniform-quniform). For more information, see this [section](./how-to-tune-hyperparameters.md#discrete-hyperparameters). <br> - **Continuous hyperparameters**: Continuous hyperparameters are specified as a distribution over a continuous range of values. Currently supported distributions are - [`lognormal`, `normal`](./reference-yaml-job-sweep.md#lognormal-normal), [`loguniform`](./reference-yaml-job-sweep.md#loguniform), [`uniform`](./reference-yaml-job-sweep.md#uniform). For more information, see this [section](./how-to-tune-hyperparameters.md#continuous-hyperparameters). <br> <br> See [parameter expressions](./reference-yaml-job-sweep.md#parameter-expressions) for the set of possible expressions to use.  | | |
| `outputs` | object | Dictionary of output configurations of the job. The key is a name for the output within the context of the job and the value is the output configuration. | | |
| `outputs.best_model` | object | Dictionary of output configurations for best model. For more information, see [Best model output configuration](#best-model-output-configuration). | | |

Other syntax used in configurations:

### Limits

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `max_concurrent_trials` | integer | Represents the maximum number of trials (children jobs) that would be executed in parallel. | | `1` |
| `max_trials` | integer | Represents the maximum number of trials an AutoML nlp job can try to run a training algorithm with different combination of hyperparameters. | | `1` |
| `timeout_minutes ` | integer | Represents the maximum amount of time in minutes that the submitted AutoML NLP job can take to run . After this, the job will get terminated. The default timeout in AutoML NLP jobs is 7 days. | | `10080`|
| `trial_timeout_minutes ` | integer | Represents the maximum amount of time in minutes that each trial (child job) in the submitted AutoML job can take run. After this, the child job will get terminated.  | | |
|`max_nodes`| integer | The maximum number of nodes from the backing compute cluster to leverage for the job.| | `1` |

### Supported hyperparameters

The following table describes the hyperparameters that AutoML NLP supports. 

| Parameter name | Description | Syntax |
|-------|---------|---------| 
| gradient_accumulation_steps | The number of backward operations whose gradients are to be summed up before performing one step of gradient descent by calling the optimizer’s step function. <br><br> This is leveraged to use an effective batch size which is gradient_accumulation_steps times larger than the maximum size that fits the GPU. | Must be a positive integer.
| learning_rate | Initial learning rate. | Must be a float in the range (0, 1). |
| learning_rate_scheduler |Type of learning rate scheduler. | Must choose from `linear, cosine, cosine_with_restarts, polynomial, constant, constant_with_warmup`.  |
| model_name | Name of one of the supported models.  | Must choose from `bert_base_cased, bert_base_uncased, bert_base_multilingual_cased, bert_base_german_cased, bert_large_cased, bert_large_uncased, distilbert_base_cased, distilbert_base_uncased, roberta_base, roberta_large, distilroberta_base, xlm_roberta_base, xlm_roberta_large, xlnet_base_cased, xlnet_large_cased`. |
| number_of_epochs | Number of training epochs. | Must be a positive integer. |
| training_batch_size | Training batch size. | Must be a positive integer. |
| validation_batch_size | Validation batch size. | Must be a positive integer. |
| warmup_ratio | Ratio of total training steps used for a linear warmup from 0 to learning_rate.  | Must be a float in the range [0, 1]. |
| weight_decay | Value of weight decay when optimizer is sgd, adam, or adamw. | Must be a float in the range [0, 1]. |

### Training or validation data

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `description` | string | The detailed information that describes this input data. | | |
| `path` | string | The path from where data should be loaded. Path can be a `file` path, `folder` path or `pattern` for paths. `pattern` specifies a search pattern to allow globbing(`*` and `**`) of files and folders containing data. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, and `adl`. For more information on how to use the `azureml://` URI format, see [core yaml syntax](./reference-yaml-core-syntax.md). URI of the location of the artifact file. If this URI doesn't have a scheme (for example, http:, azureml: etc.), then it's considered a local reference and the file it points to is uploaded to the default workspace blob-storage as the entity is created.  | | |
| `mode` | string | Dataset delivery mechanism. | `direct` | `direct` |
| `type` | const |  In order to generate nlp models, the user needs to bring training data in the form of an MLTable. For more information, see [preparing data](./how-to-auto-train-nlp-models.md#preparing-data) | mltable | mltable|

### Best model output configuration

| Key | Type | Description | Allowed values |Default value |
| --- | ---- | ----------- | -------------- | ------------ |
| `type` | string | **Required.** Type of best model. AutoML allows only mlflow models. | `mlflow_model` | `mlflow_model` |
| `path` | string | **Required.** URI of the location where the model-artifact file(s) are stored. If this URI doesn't have a scheme (for example, http:, azureml: etc.), then it's considered a local reference and the file it points to is uploaded to the default workspace blob-storage as the entity is created. |  |  |
| `storage_uri` | string | The HTTP URL of the Model. Use this URL with `az storage copy -s THIS_URL -d DESTINATION_PATH --recursive` to download the data.  | | |

## Remarks

The `az ml job` command can be used for managing Azure Machine Learning jobs.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs). Examples relevant to text classification job are linked below.  

## YAML: AutoML text classification job

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/automl-standalone-jobs/cli-automl-text-classification-newsgroup/cli-automl-text-classification-newsgroup.yml":::

## YAML: AutoML text classification pipeline job

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/automl/cli-automl-text-classification-newsgroup-pipeline/pipeline.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
