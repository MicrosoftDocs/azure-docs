---
title: 'CLI (v2) Automated ML Image Classification job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Automated ML Image Classification job YAML schema.
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

# CLI (v2) Automated ML Image Classification job YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlsdk2.blob.core.windows.net/preview/0.0.1/autoMLImageClassificationJob.schema.json.



[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If the users uses the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of the file enables the user to invoke schema and resource completions. | | |
| `type` | const | **Required.** The type of job. | `automl` | `automl` |
| `task` | const | **Required.** The type of automl task. | `image_classification` | `image_classification` |
| `name` | string | Name of the job. Must be unique across all jobs in the workspace. If omitted, Azure ML will autogenerate a GUID for the name. | | |
| `display_name` | string | Display name of the job in the studio UI. Can be non-unique within the workspace. If omitted, Azure ML will autogenerate a human-readable adjective-noun identifier for the display name. | | |
| `experiment_name` | string | Experiment name to organize the job under. Each job's run record will be organized under the corresponding experiment in the studio's "Experiments" tab. If omitted, Azure ML will default it to the name of the working directory where the job was created. | | |
| `description` | string | Description of the job. | | |
| `tags` | object | Dictionary of tags for the job. | | |
| `compute` | string | Name of the compute target to execute the job on. This can be either a reference to an existing compute in the workspace (using the `azureml:<compute_name>` syntax) or `local` to designate local execution. **Note:** jobs in pipeline don't support `local` as `compute` | | `local` |
| `log_verbosity` | number | Different levels of log verbosity. |`not_set`, `debug`, `info`, `warning`, `error`, `critical` | `info` |
| `primary_metric` | string |  The metric that AutoML will optimize for model selection. |`accuracy`, `auc_weighted`, `average_precision_score_weighted`, `norm_macro_recall`, `precision_score_weighted` | `accuracy` |
| `target_column_name` | string |  **Required.** The name of the column to target for predictions. It must always be specified. This parameter is applicable to `training_data` and `validation_data`. | |  |
| `training_data` | object |  **Required.** The data to be used within the job. It should contain both training feature columns and a target column. the parameter training_data must always be provided. Refer to [Training or Validation Data](#training-or-validation-data) section for further details on how to write this object.| |  |
| `validation_data` | object |  The validation data to be used within the job. It should contain both training features and label column (optionally a sample weights column). If 'validation_data' is specified, then 'training_data' and 'target_column_name' parameters must be specified. Refer to [Training or Validation Data](#training-or-validation-data) for further details on how to write this object.| |  |
| `validation_data_size` | float |  What fraction of the data to hold out for validation when user validation data is not specified. | A value in range (0.0, 1.0) |  |
| `limits` | object | Dictionary of limit configurations of the job. The key is name for the limit within the ocntext of the job and the value is limit value. If the user wants to specify a different mode for the output, provide an object containing the [Limits](#limits). | | |
| `training_parameters` | object | Dictionary containing training parameters for the job. Provide an object which has keys as listed in  [Training Parameters](#training-parameters) section. | | |
| `sweep` | object | Dictionary containing sweep parameters for the job. Provide an object which has keys as listed in [Sweep Parameters](#sweep-parameters) section. | | |
| `search_space` | object | Dictionary containing search space (or, range of values) for tuning hyperparameters for the job. Provide an object which has keys as listed in [Search Space Parameters](#search-space-parameters) secion. | | |
| `outputs` | object | Dictionary containing search space (or, range of values) for tuning hyperparameters for the job. Provide an object which has keys as listed in [Search Space Parameters](#search-space-parameters) secion. | | |


### Limits

| Key | Type | Description | Allowed values |Default value |
| --- | ---- | ----------- | -------------- | ------------ |
| `max_trials` | integer | The maximum total number of different algorithm and parameter combinations (trials) to try during an AutoML job. If using `enable_early_termination` the number of trials used can be smaller.  | | 1000 |
| `max_concurrent_trials` | integer | Represents the maximum number of trials (children jobs) that would be executed in parallel. | | 1 |
| `timeout_minutes` | integer | Maximum amount of time in minutes that the whole AutoML job can take before the job terminates. This timeout includes setup, featurization and training runs but does not include the ensembling and model explainability runs at the end of the process since those actions need to happen once all the trials (children jobs) are done. If not specified, the default job's total timeout is 6 days (8,640 minutes). To specify a timeout less than or equal to 1 hour (60 minutes), the user should make sure dataset's size is not greater than 10,000,000 (rows times column) or an error results. | | 8640 |


### Training Or Validation Data

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `description` | string | The detailed information that describes this input data. | | |
| `path` | sring | Path can be a `file` path, `folder` path or `pattern` for paths. `pattern` specifies a search pattern to allow globbing(* and *\*) of files and folders containing data. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, and `adl`. See [Core yaml syntax](https://learn.microsoft.com/en-us/azure/machine-learning/reference-yaml-core-syntax) for more information on how to use the `azureml://` URI format. URI of the location of the artifact file. If this URI does not have a scheme (e.g. http:, azureml:, etc.), then it is considered a local reference and the file it points to is uploaded to the default workspace blob-storage as the entity is created.  | | |
| `mode` | string | | |
| `type` | const |  In order to generate computer vision models, the user needs to bring labeled image data as input for model training in the form of an MLTable. | mltable | mltable|

### Training Parameters
This section describes the hyperparameters available specifically for computer vision tasks in automated ML experiments.

With support for computer vision tasks, you can control the model algorithm and sweep hyperparameters. These model algorithms and hyperparameters are passed in as the parameter space for the sweep. While many of the hyperparameters exposed are model-agnostic, there are instances where hyperparameters are model-specific or task-specific.

Please note that the `training_parameters` object can have properties from [Model Specific Hyperparameters](#model-specific-hyperparameters), [Model Agnostic Hyperparameters](#model-agnostic-hyperparameters) and [Image Classification (multi-class and multi-label) Specific Hyperparameters](#image-classification-multi-class-and-multi-label-specific-hyperparameters).

#### Model Specific Hyperparameters
This table summarizes hyperparameters specific to the `yolov5` algorithm.

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `validation_metric_type` | string | Metric computation method to use for validation metrics. |  `none`, `coco`, `voc`, `coco_voc` | `voc` |
| `validation_iou_threshold` | float | IOU threshold for box matching when computing validation metrics.  | A value in the range [0.1, 1]. | 0.5 |
| `image_size` | integer | Image size for train and validation. <br> <br> *Note: training run may get into CUDA OOM if the size is too big*. | | 640 |
| `model_size` | string | Model size. <br><br> *Note: training run may get into CUDA OOM if the model size is too big*. | `small`, `medium`, `large`, `extra_large` | `medium` |
| `multi_scale` | integer | Enable multi-scale image by varying image size by +/- 50%. <br> <br> *Note: training run may get into CUDA OOM if no sufficient GPU memory*. | 0, 1 | 0 |
| `box_score_threshold` | float | During inference, only return proposals with a score greater than `box_score_threshold`. The score is the multiplication of the objectness score and classification probability. | A value in the range [0, 1] | 0.1 |
| `nms_iou_threshold` | float | IOU threshold used during inference in non-maximum suppression post processing.| A value in the range [0, 1] | 0.5 |
| `tile_grid_size` | integer | The grid size to use for tiling each image. <br>*Note: tile_grid_size must not be None to enable [small object detection](how-to-use-automl-small-object-detect.md) logic*<br> Should be passed as a string in '3x2' format. Example: --tile_grid_size '3x2' |  | No Default |
| `tile_overlap_ratio` | float | Overlap ratio between adjacent tiles in each dimension. | A value in the range of [0, 1) | 0.25 |
| `tile_predictions_nms_threshold` | float | The IOU threshold to use to perform NMS while merging predictions from tiles and image. Used in validation/ inference. | A value in the range of [0, 1] | 0.25 |

This table summarizes hyperparameters specific to the `maskrcnn_*` for instance segmentation during inference.

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `mask_pixel_score_threshold` | float | Score cutoff for considering a pixel as part of the mask of an object. | | 0.5 |
| `max_number_of_polygon_points` | integer | Maximum number of (x, y) coordinate pairs in polygon after converting from a mask. | | 100 |
| `export_as_image` | bool | Export masks as images. | `True`, `False` | False |
| `image_type` | string | Type of image to export mask as.  | `jpg`, `png`, `bmp` | `jpg` |

#### Model Agnostic Hyperparameters
The following table describes the hyperparameters that are model agnostic.

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
|`ams_gradient` | Enable `ams_gradient` when optimizer is `adam` or `adamw`.| 0, 1| 0 |
|`advanced_settings` | | | |
|`beta1` | float | Value of `beta1` when optimizer is `adam` or `adamw`. | A value in the range [0, 1] | 0.9 |
|`beta2` | float | Value of `beta2` when optimizer is `adam` or `adamw`. | A value in the range [0, 1] | 0.999 |
|`checkpoint_frequency`| integer | Frequency to store model checkpoints. | | Checkpoint at epoch with best primary metric on validation.|
|`checkpoint_run_id`| string | The run ID of the experiment that has a pretrained checkpoint for incremental training.| | no default  |
|`distributed`| bool | | 0, 1 | 0 |
| `early_stopping` | integer | Enable early stopping logic during training. |  `0`, `1` | `1` |
| `early_stopping_delay` | integer | Minimum number of epochs or validation evaluations to wait<br>before primary metric improvement is tracked for early stopping. | | 5 |
| `early_stopping_patience` | integer | Minimum number of epochs or validation evaluations with<br>no primary metric improvement before the run is stopped. | | 5 |
|`evaluation_frequency`| integer | Frequency to evaluate validation dataset to get metric scores. | | 1 |
|`enable_onnx_normalization`| bool | | 0, 1 | 0 |
| `gradient_accumulation_step` | integer | Gradient accumulation means running a configured number of `gradient_accumulation_step` without updating the model weights while accumulating the gradients of those steps, and then using the accumulated gradients to compute the weight updates. | | 1 |
|`layers_to_freeze`| integer | How many layers to freeze for your model. For instance, passing 2 as value for `seresnext` means freezing layer0 and layer1 referring to the below supported model layer info. <br>- ` 'resnet': [('conv1.', 'bn1.'), 'layer1.', 'layer2.', 'layer3.', 'layer4.'],`<br>- `'mobilenetv2': ['features.0.', 'features.1.', 'features.2.', 'features.3.', 'features.4.', 'features.5.', 'features.6.', 'features.7.', 'features.8.', 'features.9.', 'features.10.', 'features.11.', 'features.12.', 'features.13.', 'features.14.', 'features.15.', 'features.16.', 'features.17.', 'features.18.'],`<br>- ` 'seresnext': ['layer0.', 'layer1.', 'layer2.', 'layer3.', 'layer4.'],`<br>- `'vit': ['patch_embed', 'blocks.0.', 'blocks.1.', 'blocks.2.', 'blocks.3.', 'blocks.4.', 'blocks.5.', 'blocks.6.','blocks.7.', 'blocks.8.', 'blocks.9.', 'blocks.10.', 'blocks.11.'],`<br>- `'yolov5_backbone': ['model.0.', 'model.1.', 'model.2.', 'model.3.', 'model.4.','model.5.', 'model.6.', 'model.7.', 'model.8.', 'model.9.'],`<br>- `'resnet_backbone': ['backbone.body.conv1.', 'backbone.body.layer1.', 'backbone.body.layer2.','backbone.body.layer3.', 'backbone.body.layer4.']` | | no default  |
| `learning_rate` | float | Initial learning rate. | A value  in the range [0, 1] | Multi-class: 0.01 <br>(except *vit-variants*: <br> `vits16r224`: 0.0125<br>`vitb16r224`: 0.0125<br>`vitl16r224`: 0.001) <br><br> Multi-label: 0.035 <br>(except *vit-variants*:<br>`vits16r224`: 0.025<br>`vitb16r224`: 0.025 <br>`vitl16r224`: 0.002) <br><br> Object detection: 0.005 <br>(except `yolov5`: 0.01) <br><br> Instance segmentation: 0.005  |
| `learning_rate_scheduler` | string | Type of learning rate scheduler. | `none`, `warmup_cosine`, `step`. | `warmup_cosine` |
| `momentum` | float | Value of momentum when optimizer is `sgd`. | A value in the range [0, 1] | 0.9 |
|`nesterov`| integer | Enable `nesterov` when optimizer is `sgd`. | 0, 1 | 1 |
| `number_of_epochs` | integer | Number of training epochs. | | 15 <br> (except `yolov5`: 30) |
| `number_of_workers` | integer | Number of workers. | |  |
| `optimizer` | string | Type of optimizer. | `sgd`, `adam`, `adamw`  | `sgd` |
| `random_seed` | integer | | | |
| `step_lr_gamma` | float | Value of gamma when learning rate scheduler is `step`.| A value in the range [0, 1] | 0.5 |
| `step_lr_step_size` | integer | Value of step size when learning rate scheduler is `step`. | | 5 |
| `training_batch_size` | integer | Training batch size. <br> <br> *Note: The defaults are largest batch size that can be used on 12 GiB GPU memory*. | | Multi-class/multi-label: 78 <br>(except *vit-variants*: <br> `vits16r224`: 128 <br>`vitb16r224`: 48 <br>`vitl16r224`:10)<br><br>Object detection: 2 <br>(except `yolov5`: 16) <br><br> Instance segmentation: 2 |
| `validation_batch_size` | integer | Validation batch size.<br> <br> *Note: The defaults are largest batch size that can be used on 12 GiB GPU memory*. | | Multi-class/multi-label: 78 <br>(except *vit-variants*: <br> `vits16r224`: 128 <br>`vitb16r224`: 48 <br>`vitl16r224`:10)<br><br>Object detection: 1 <br>(except `yolov5`: 16) <br><br> Instance segmentation: 1|
| `warmup_cosine_lr_cycles` | float | Value of cosine cycle when learning rate scheduler is `warmup_cosine`. | A value in the range [0, 1] | 0.45 |
| `warmup_cosine_lr_warmup_epochs` | integer | Value of warmup epochs when learning rate scheduler is `warmup_cosine`. | | 2 |
| `weight_decay` | float | Value of weight decay when optimizer is `sgd`, `adam`, or `adamw`. | A value in the range [0, 1] | 1e-4 |



#### Image Classification (Multi-Class and Multi-Label) Specific Hyperparameters

| Key | Type | Description | Allowed values |Default value |
| --- | ---- | ----------- | -------------- | ------------ |
| `model_name` | string | Model name to be used for image classification task at hand. | `mobilenetv2`, `resnet18`, `resnet34`, `resnet50`, `resnet101`, `resnet152`, `resnest50`, `resnest101`, `seresnext`, `vits16r224`, `vitb16r224`, `vitl16r224` | |
| `training_crop_size` | integer | Image crop size that's input to your neural network for train dataset. <br><br> Notes: <br>- `seresnext` doesn't take an arbitrary size. <br>- ViT-variants should have the same `validation_crop_size` and `training_crop_size`. <br>- Training run may get into CUDA OOM if the size is too big.|  | 224|
| `validation_crop_size` | integer | Image crop size that's input to your neural network for validation dataset. <br><br> Notes: <br>- `seresnext` doesn't take an arbitrary size. <br>- ViT-variants should have the same `validation_crop_size` and `training_crop_size`. <br>- Training run may get into CUDA OOM if the size is too big.| | 224 |
| `validation_resize_size` | integer | Image size to which to resize before cropping for validation dataset. <br><br> Notes: <br>- `seresnext` doesn't take an arbitrary size. <br>- Training run may get into CUDA OOM if the size is too big. | | 256 |
| `weighted_loss` | integer | - `0` for no weighted loss. <br>- `1` for weighted loss with sqrt (class_weights). <br>- `2` for weighted loss with class_weights. | 0, 1, 2 | 0 |

### Sweep Parameters
When using AutoML for Images, we can perform a hyperparameter sweep over a defined parameter space to find the optimal model. If hyperparameter values are not specified, then default values are used for the specified algorithm. 

| Key | Type | Description | Allowed values |Default value |
| --- | ---- | ----------- | -------------- | ------------ |
| `sampling_algorithm` | string | **Required.** When sweeping hyperparameters, the user needs to specify the sampling method to use for sweeping over the defined parameter space. <br> Notes: <br> - Currently only random and grid sampling support conditional hyperparameter spaces. | `random`, `grid`, `bayesian` | `grid` |
| `early_termination` | object | You can automatically end poorly performing runs with an early termination policy. Early termination improves computational efficiency, saving compute resources that would have been otherwise spent on less promising configurations. Automated ML for images supports the following early termination policies using the early_termination parameter. If no termination policy is specified, all configurations are run to completion. Supported early termination policy types are `bandit`, `median_stopping`, `truncation_selection`. By default, bandit policy is used. For the details on individual early termination policies, please refer to the [Bandit Early Termination Policy](#bandit-early-termination-policy), [Median Stopping Early Termination Policy](#median-stopping-early-termination-policy), [Truncation Selection Early Termination Policy](#truncation-selection-early-termination-policy) below. |  | |

#### Bandit Early Termination Policy
Bandit Policy is based on slack factor/slack amount and evaluation interval. Bandit policy ends a job when the primary metric isn't within the specified slack factor/slack amount of the most successful job. For further details on Bandit policy, please refer to [documentation](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-tune-hyperparameters#bandit-policy)

| Key | Type | Description | Allowed values |Default value |
| --- | ---- | ----------- | -------------- | ------------ |
| `type` | string | **Required.** Type of early termination policy. | `bandit` | `bandit` |
| `slack_factor` | number | The ratio used to calculate the slack or the allowed distance from the best performing trial. **One of `slack_factor` or `slack_amount` is required.** | | |
| `slack_amount` | number | The absolute slack or distance allowed from the best performing trial. **One of `slack_factor` or `slack_amount` is required.** | | |
| `evaluation_interval` | integer |  The frequency for applying the policy. | | |
| `delay_evaluation` | integer | Delays the first policy evaluation for a specified number of intervals. | | |

#### Median Stopping Early Termination Policy
Median Stopping is an early termination policy based on running averages of primary metrics reported by the jobs. For further details on Median Stopping policy, please refer to [documentation](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-tune-hyperparameters#median-stopping-policy)

| Key | Type | Description | Allowed values |Default value |
| --- | ---- | ----------- | -------------- | ------------ |
| `type` | string | **Required.** Type of early termination policy. | `median_stopping` | `median_stopping` |
| `evaluation_interval` | integer | The frequency for applying the policy. | | |
| `delay_evaluation` | integer |  Delays the first policy evaluation for a specified number of intervals. | | |

#### Truncation Selection Early Termination Policy
Truncation Selection policy cancels a percentage of lowest performing jobs at each evaluation interval. jobs are compared using the primary metric.. For further details on Median Stopping policy, please refer to [documentation](https://learn.microsoft.com/en-us/azure/machine-learning/how-to-tune-hyperparameters#truncation-selection-policy)

| Key | Type | Description | Allowed values |Default value |
| --- | ---- | ----------- | -------------- | ------------ |
| `type` | string | **Required.** Type of early termination policy. | `truncation_selection` | `truncation_selection` |
| `truncation_percentage` | integer | **Required.** The percentage of lowest performing jobs to terminate at each evaluation interval. | [1, 99] |  |
| `evaluation_interval` | integer | The frequency for applying the policy. | | |
| `delay_evaluation` | integer |  Delays the first policy evaluation for a specified number of intervals. | | |
| `exclude_finished_jobs` | integer |  Specifies whether to exclude finished jobs when applying the policy. | | |


### Search Space Parameter 
This section describes the objects for tuning hyperparameters by exploring the range of values defined for each hyperparameter. There are two types of hyperparameters: 
- **Discrete Hyperparameters**: Discrete hyperparameters are specified as a `Choice` among discrete values. `Choice` can be one or more comma-separated values, a `range` object, or any arbitrary `list` object. 
- **Continuous hyperparameters**: Continuous hyperparameters are specified as a distribution over a continuous range of values. Currently supported distributions namely are - `Uniform(min_value, max_value)`, `LogUniform(min_value, max_value)`, `Normal(mu, sigma)`, `LogNormal(mu, sigma)`

Below is the list of Hyperparameters that are common across all Automated ML Computer Vision Tasks. The user should find the details on each of these hyper parameters in [Training Parameter](#training-parameter) section.
- `ams_gradient`
- `advanced_settings`
- `augmentations`
- `beta1`
- `beta2`
- `distributed`
- `early_stopping`
- `early_stopping_delay`
- `early_stopping_patience`
- `evaluation_frequency`
- `enable_onnx_normalization`
- `gradient_accumulation_step`
- `layers_to_freeze`
- `learning_rate`
- `learning_rate_scheduler`
- `momentum`
- `nesterov`
- `number_of_epochs`
- `number_of_workers`
- `optimizer`
- `random_seed`
- `step_lr_gamma`
- `step_lr_step_size`
- `training_batch_size`
- `validation_batch_size`
- `warmup_cosine_lr_cycles`
- `warmup_cosine_lr_warmup_epochs`
- `weight_decay`

Below are the details on Hyperparameters that are specific to Image Classification task. The user should find the details on each of these hyper parameters in [Training Parameter](#training-parameter) section.
- `model_name`
- `training_crop_size`
- `validation_crop_size`
- `validation_resize_size`
- `weighted_loss`

##### choice

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of expression. | `choice` |
| `values` | array | **Required.** The list of discrete values to choose from. | |


##### randint

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of expression. | `randint` |
| `upper` | integer | **Required.** The exclusive upper bound for the range of integers. | |

##### qlognormal, qnormal

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of expression. | `qlognormal`, `qnormal` |
| `mu` | number | **Required.** The mean of the normal distribution. | |
| `sigma` | number | **Required.** The standard deviation of the normal distribution. | |
| `q` | integer | **Required.** The smoothing factor. | |

##### qloguniform, quniform

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of expression. | `qloguniform`, `quniform` |
| `min_value` | number | **Required.** The minimum value in the range (inclusive). | |
| `max_value` | number | **Required.** The maximum value in the range (inclusive). | |
| `q` | integer | **Required.** The smoothing factor. | |

##### lognormal, normal

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of expression. | `lognormal`, `normal` |
| `mu` | number | **Required.** The mean of the normal distribution. | |
| `sigma` | number | **Required.** The standard deviation of the normal distribution. | |

##### loguniform

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of expression. | `loguniform` |
| `min_value` | number | **Required.** The minimum value in the range will be `exp(min_value)` (inclusive). | |
| `max_value` | number | **Required.** The maximum value in the range will be `exp(max_value)` (inclusive). | |

##### uniform

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `type` | const | **Required.** The type of expression. | `uniform` |
| `min_value` | number | **Required.** The minimum value in the range (inclusive). | |
| `max_value` | number | **Required.** The maximum value in the range (inclusive). | |


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
