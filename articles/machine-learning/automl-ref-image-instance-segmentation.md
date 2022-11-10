---
title: 'CLI (v2) Automated ML Image Instance Segmentation job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Automated ML Image Instance Segmentation job YAML schema.
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

# CLI (v2) Automated ML Image Instance Segmentation job YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlsdk2.blob.core.windows.net/preview/0.0.1/autoMLImageInstanceSegmentationJob.schema.json.



[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If the user uses the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of the file enables the user to invoke schema and resource completions. | | |
| `type` | const | **Required.** The type of job. | `automl` | `automl` |
| `task` | const | **Required.** The type of AutoML task. | `image_instance_segmentation` | `image_instance_segmentation` |
| `name` | string | Name of the job. Must be unique across all jobs in the workspace. If omitted, Azure ML will autogenerate a GUID for the name. | | |
| `display_name` | string | Display name of the job in the studio UI. Can be non-unique within the workspace. If omitted, Azure ML will autogenerate a human-readable adjective-noun identifier for the display name. | | |
| `experiment_name` | string | Experiment name to organize the job under. Each job's run record will be organized under the corresponding experiment in the studio's "Experiments" tab. If omitted, Azure ML will default it to the name of the working directory where the job was created. | | |
| `description` | string | Description of the job. | | |
| `tags` | object | Dictionary of tags for the job. | | |
| `compute` | string | Name of the compute target to execute the job on. This compucan be either a reference to an existing compute in the workspace (using the `azureml:<compute_name>` syntax) or `local` to designate local execution. For further details on compute for AutoML image jobs, refer to [Compute to run experiment](./how-to-auto-train-image-models.md?tabs=cli#compute-to-run-experiment) section.<br> <br>  *Note:* jobs in pipeline don't support `local` as `compute`. * | | `local` |
| `log_verbosity` | number | Different levels of log verbosity. |`not_set`, `debug`, `info`, `warning`, `error`, `critical` | `info` |
| `primary_metric` | string |  The metric that AutoML will optimize for model selection. |`mean_average_precision` | `mean_average_precision` |
| `target_column_name` | string |  **Required.** The name of the column to target for predictions. It must always be specified. This parameter is applicable to `training_data` and `validation_data`. | |  |
| `training_data` | object |  **Required.** The data to be used within the job. It should contain both training feature columns and a target column. the parameter training_data must always be provided. For more infomration, see [Training or Validation Data](./automl-ref-image-classification.md#training-or-validation-data) to understand how to write this object.| |  |
| `validation_data` | object |  The validation data to be used within the job. It should contain both training features and label column (optionally a sample weights column). If `validation_data` is specified, then `training_data` and `target_column_name` parameters must be specified. For more infomration, see [Training or Validation Data](./automl-ref-image-classification.md#training-or-validation-data) to understand how to write this object.| |  |
| `validation_data_size` | float |  What fraction of the data to hold out for validation when user validation data isn't specified. | A value in range (0.0, 1.0) |  |
| `limits` | object | Dictionary of limit configurations of the job. The key is name for the limit within the context of the job and the value is limit value. If the user wants to specify a different mode for the output, provide an object containing the [Limits](./automl-ref-image-classification.md#limits). | | |
| `training_parameters` | object | Dictionary containing training parameters for the job. Provide an object that has keys as listed in [Training Parameters](#training-parameters).For an example, refer to [Configure your experiment settings](./how-to-auto-train-image-models.md?tabs=cli#configure-your-experiment-settings) section. | | |
| `sweep` | object | Dictionary containing sweep parameters for the job. Provide an object that has keys as listed in [Sweep Parameters](./automl-ref-image-classification.md#sweep-parameters). For an example, refer to [Sampling methods for the sweep](./how-to-auto-train-image-models.md?tabs=cli#sampling-methods-for-the-sweep) section. | | |
| `search_space` | object | Dictionary of the hyperparameter search space. The key is the name of the hyperparameter and the value is the parameter expression. The user can find the possible hyperparameters in [Training Parameters](#training-parameters). For an example, refer to [Sweeping hyperparameters for your model](./how-to-auto-train-image-models.md?tabs=cli#sweeping-hyperparameters-for-your-model) section. | | |
| `search_space.<hyperparameter>` | object | See [Parameter expressions](./reference-yaml-job-sweep.md#parameter-expressions) for the set of possible expressions to use. <br>- For discrete hyperparameters, the user should use [`choice` parameter expression](./reference-yaml-job-sweep.md#choice). <br>- For continuous hyperparameters, the user should use one of the following parameter-expressions according to the distribution that user wants to explore, [`randint`](./reference-yaml-job-sweep.md#randint), [`qlognormal`, `qnormal`](./reference-yaml-job-sweep.md#qlognormal-qnormal), [`lohnormal`, `normal`](./reference-yaml-job-sweep.md#lognormal-normal), [`loguniform`](./reference-yaml-job-sweep.md#loguniform), [`uniform`](./reference-yaml-job-sweep.md#uniform).  | | |
| `outputs` | object | Dictionary of output configurations of the job. The key is a name for the output within the context of the job and the value is the output configuration. | | |
| `outputs.best_model` | object | Dictionary of output configurations for best model. For further details, refer to [Best Model Output Configuration](./automl-ref-image-classification.md#best-model-output-configuration). | | |


### Training Parameters

Note that the `training_parameters` object can have properties from [Model Specific Hyperparameters](#model-specific-hyperparameters), [Model Agnostic Hyperparameters](./automl-ref-image-classification.md#model-agnostic-hyperparameters) and [Image Instance Segmentation Task Specific Hyperparameters](#image-instance-segmentation-task-specific-hyperparameters).

Refer to [Discrete and Continuous Hyperparameters](./automl-ref-image-classification.md#discrete-and-continuous-hyperparameters) section for a brief introduction on these. 

#### Model Specific Hyperparameters

This table summarizes hyperparameters specific to the `maskrcnn_*`.

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `mask_pixel_score_threshold` | float | Score cutoff for considering a pixel as part of the mask of an object. | | 0.5 |
| `max_number_of_polygon_points` | integer | Maximum number of (x, y) coordinate pairs in polygon after converting from a mask. | | 100 |
| `export_as_image` | bool | Export masks as images. | `True`, `False` | False |
| `image_type` | string | Type of image to export mask as.  | `jpg`, `png`, `bmp` | `jpg` |

#### Image Instance Segmentation Task Specific Hyperparameters

The following hyperparameters are for instance segmentation tasks.

| Key | Type | Description | Allowed values |Default value |
| --- | ---- | ----------- | -------------- | ------------ |
| `model_name` | string | Model name to be used for image instance segmentation task at hand. | `maskrcnn_resnet18_fpn`, `maskrcnn_resnet34_fpn`, `maskrcnn_resnet50_fpn`, `maskrcnn_resnet101_fpn`, `maskrcnn_resnet152_fpn` | `maskrcnn_resnet50_fpn` |
| `box_detections_per_img` | integer | Maximum number of detections per image, for all classes. | | 100 |
| `box_score_threshold` | float | During inference, only return proposals with a score greater than `box_score_threshold`. The score is the multiplication of the objectness score and classification probability. | A value in the range [0, 1] | 0.1 |
| `min_size` | integer | Minimum size of the image to be rescaled before feeding it to the backbone. <br> <br> *Note: <br>- training run may get into CUDA OOM if the size is too large.*| | 600 |
| `max_size` | integer | Maximum size of the image to be rescaled before feeding it to the backbone. <br> <br> *Note: <br>- training run may get into CUDA OOM if the size is too large.* | | 1333 |
| `nms_iou_threshold` | float | IOU (intersection over union) threshold used in non-maximum suppression (NMS) for the prediction head. Used during inference. | A value in the range [0, 1] | 0.5 |
| `tile_grid_size` | integer | The grid size to use for tiling each image. <br> <br> *Note: <br>- `tile_grid_size` must not be None to enable [small object detection](how-to-use-automl-small-object-detect.md) logic. `tile_grid_size` should be passed as a string in 'mxn' format, for example: `--tile_grid_size '3x2'`*. |  | No Default |
| `tile_overlap_ratio` | float | Overlap ratio between adjacent tiles in each dimension. <br> <br> *Note: This setting isn't supported for the 'yolov5' algorithm.* | A value in the range of \[0, 1) | 0.25 |
| `tile_predictions_nms_threshold` | float | The IOU threshold to use to perform NMS while merging predictions from tiles and image. Used in validation/ inference. | A value in the range of [0, 1] | 0.25 |
| `validation_iou_threshold` | float | IOU threshold for box matching when computing validation metrics.  | A value in the range [0.1, 1]. | 0.5 |
| `validation_metric_type` | string | Metric computation method to use for validation metrics. |  `none`, `coco`, `voc`, `coco_voc` | `voc` |


## Remarks

The `az ml job` command can be used for managing Azure Machine Learning jobs.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs). Examples relevant to image instance segmentation job are shown below.

## YAML: AutoML image instance segmentation job

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/automl-standalone-jobs/cli-automl-image-instance-segmentation-task-fridge-items/cli-automl-image-instance-segmentation-task-fridge-items.yml":::

## YAML: AutoML image instance segmentation pipeline job

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/automl/image-instance-segmentation-fridge-items-pipeline/pipeline.yml":::


## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
