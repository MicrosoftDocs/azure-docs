---
title: 'CLI (v2) Automated ML Image Multi-Label Classification job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Automated ML Image Multi-Label Classification job YAML schema.
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

# CLI (v2) Automated ML Image Multi-Label Classification job YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlsdk2.blob.core.windows.net/preview/0.0.1/autoMLImageClassificationMultilabelJob.schema.json.



[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If the user uses the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of the file enables the user to invoke schema and resource completions. | | |
| `type` | const | **Required.** The type of job. | `automl` | `automl` |
| `task` | const | **Required.** The type of AutoML task. | `image_classification_multilabel` | `image_classification_multilabel` |
| `name` | string | Name of the job. Must be unique across all jobs in the workspace. If omitted, Azure ML will autogenerate a GUID for the name. | | |
| `display_name` | string | Display name of the job in the studio UI. Can be non-unique within the workspace. If omitted, Azure ML will autogenerate a human-readable adjective-noun identifier for the display name. | | |
| `experiment_name` | string | Experiment name to organize the job under. Each job's run record will be organized under the corresponding experiment in the studio's "Experiments" tab. If omitted, Azure ML will default it to the name of the working directory where the job was created. | | |
| `description` | string | Description of the job. | | |
| `tags` | object | Dictionary of tags for the job. | | |
| `compute` | string | Name of the compute target to execute the job on. This compucan be either a reference to an existing compute in the workspace (using the `azureml:<compute_name>` syntax) or `local` to designate local execution. For further details on compute for AutoML image jobs, refer to [Compute to run experiment](./how-to-auto-train-image-models.md?tabs=cli#compute-to-run-experiment) section.<br> <br>  *Note:* jobs in pipeline don't support `local` as `compute`. * | | `local` |
| `log_verbosity` | number | Different levels of log verbosity. |`not_set`, `debug`, `info`, `warning`, `error`, `critical` | `info` |
| `primary_metric` | string |  The metric that AutoML will optimize for model selection. |`iou` | `iou` |
| `target_column_name` | string |  **Required.** The name of the column to target for predictions. It must always be specified. This parameter is applicable to `training_data` and `validation_data`. | |  |
| `training_data` | object |  **Required.** The data to be used within the job. It should contain both training feature columns and a target column. the parameter training_data must always be provided. For more infomration, see [Training or Validation Data](./automl-ref-image-classification.md#training-or-validation-data) to understand how to write this object.| |  |
| `validation_data` | object |  The validation data to be used within the job. It should contain both training features and label column (optionally a sample weights column). If `validation_data` is specified, then `training_data` and `target_column_name` parameters must be specified. For more infomration, see [Training or Validation Data](./automl-ref-image-classification.md#training-or-validation-data) to understand how to write this object.| |  |
| `validation_data_size` | float |  What fraction of the data to hold out for validation when user validation data isn't specified. | A value in range (0.0, 1.0) |  |
| `limits` | object | Dictionary of limit configurations of the job. The key is name for the limit within the context of the job and the value is limit value. If the user wants to specify a different mode for the output, provide an object containing the [Limits](./automl-ref-image-classification.md#limits). | | |
| `training_parameters` | object | Dictionary containing training parameters for the job. Provide an object that has keys as listed in [Training Parameters](#training-parameters). For an example, refer to [Configure your experiment settings](./how-to-auto-train-image-models.md?tabs=cli#configure-your-experiment-settings) section. | | |
| `sweep` | object | Dictionary containing sweep parameters for the job. Provide an object that has keys as listed in [Sweep Parameters](./automl-ref-image-classification.md#sweep-parameters). For an example, refer to [Sampling methods for the sweep](./how-to-auto-train-image-models.md?tabs=cli#sampling-methods-for-the-sweep) section. | | |
| `search_space` | object | Dictionary of the hyperparameter search space. The key is the name of the hyperparameter and the value is the parameter expression. The user can find the possible hyperparameters in [Training Parameters](#training-parameters). For an example, refer to [Sweeping hyperparameters for your model](./how-to-auto-train-image-models.md?tabs=cli#sweeping-hyperparameters-for-your-model) section.  | | |
| `search_space.<hyperparameter>` | object | See [Parameter expressions](./reference-yaml-job-sweep.md#parameter-expressions) for the set of possible expressions to use. <br>- For discrete hyperparameters, the user should use [`choice` parameter expression](./reference-yaml-job-sweep.md#choice). <br>- For continuous hyperparameters, the user should use one of the following parameter-expressions according to the distribution that user wants to explore, [`randint`](./reference-yaml-job-sweep.md#randint), [`qlognormal`, `qnormal`](./reference-yaml-job-sweep.md#qlognormal-qnormal), [`lohnormal`, `normal`](./reference-yaml-job-sweep.md#lognormal-normal), [`loguniform`](./reference-yaml-job-sweep.md#loguniform), [`uniform`](./reference-yaml-job-sweep.md#uniform).  | | |
| `outputs` | object | Dictionary of output configurations of the job. The key is a name for the output within the context of the job and the value is the output configuration. | | |
| `outputs.best_model` | object | Dictionary of output configurations for best model. For further details, refer to [Best Model Output Configuration](./automl-ref-image-classification.md#best-model-output-configuration). | | |


### Training Parameters

While many of the hyperparameters exposed are model-agnostic, there are instances where hyperparameters are model-specific or task-specific. Note that the `training_parameters` object can have properties from [Model Agnostic Hyperparameters](./automl-ref-image-classification.md#model-agnostic-hyperparameters) and [Image Classification (multi-class and multi-label) Specific Hyperparameters](#image-classification-multi-class-and-multi-label-specific-hyperparameters).

Refer to [Discrete and Continuous Hyperparameters](./automl-ref-image-classification.md#discrete-and-continuous-hyperparameters) section for a brief introduction on these. 

#### Image Classification (Multi-Class and Multi-Label) Specific Hyperparameters

| Key | Type | Description | Allowed values |Default value |
| --- | ---- | ----------- | -------------- | ------------ |
| `model_name` | string | Model name to be used for image classification task at hand. | `mobilenetv2`, `resnet18`, `resnet34`, `resnet50`, `resnet101`, `resnet152`, `resnest50`, `resnest101`, `seresnext`, `vits16r224`, `vitb16r224`, `vitl16r224` | `seresnext` |
| `training_crop_size` | integer | Image crop size that's input to your neural network for train dataset. <br><br> Notes: <br>- `seresnext` doesn't take an arbitrary size. <br>- ViT-variants should have the same `validation_crop_size` and `training_crop_size`. <br>- Training run may get into CUDA OOM if the size is too large.|  | 224|
| `validation_crop_size` | integer | Image crop size that's input to your neural network for validation dataset. <br><br> Notes: <br>- `seresnext` doesn't take an arbitrary size. <br>- ViT-variants should have the same `validation_crop_size` and `training_crop_size`. <br>- Training run may get into CUDA OOM if the size is too large.| | 224 |
| `validation_resize_size` | integer | Image size to which to resize before cropping for validation dataset. <br><br> Notes: <br>- `seresnext` doesn't take an arbitrary size. <br>- Training run may get into CUDA OOM if the size is too large. | | 256 |
| `weighted_loss` | integer | - `0` for no weighted loss. <br>- `1` for weighted loss with sqrt (class_weights). <br>- `2` for weighted loss with class_weights. | 0, 1, 2 | 0 |


## Remarks

The `az ml job` command can be used for managing Azure Machine Learning jobs.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs). Examples relevant to image multi-label classification job are shown below.


## YAML: AutoML image multi-label classification job

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/automl-standalone-jobs/cli-automl-image-classification-multilablel-task-fridge-items/cli-automl-image-classification-multilablel-task-fridge-items.yml":::

## YAML: AutoML image multi-label classification pipeline job

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/automl/image-multilabel-classification-fridge-items-pipeline/pipeline.yml":::


## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
