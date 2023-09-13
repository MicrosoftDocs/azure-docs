---
title: 'CLI (v2) Automated ML Image Object Detection job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Automated ML Image Object Detection job YAML schema.
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

# CLI (v2) Automated ML image object detection job YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlsdk2.blob.core.windows.net/preview/0.0.1/autoMLImageObjectDetectionJob.schema.json.



[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

For information on all the keys in Yaml syntax, see [Yaml syntax](./reference-automl-images-cli-classification.md#yaml-syntax) of image classification task. Here we only describe the keys that have different values as compared to what's specified for image classification task.

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `task` | const | **Required.** The type of AutoML task. | `image_object_detection` | `image_object_detection` |
| `primary_metric` | string |  The metric that AutoML will optimize for model selection. |`mean_average_precision` | `mean_average_precision` |
| `training_parameters` | object | Dictionary containing training parameters for the job. Provide an object that has keys as listed in following sections. <br> - [Model Specific Hyperparameters](./reference-automl-images-hyperparameters.md#model-specific-hyperparameters) for yolov5 (if you're using yolov5 for object detection) <br> - [Model agnostic hyperparameters](./reference-automl-images-hyperparameters.md#model-agnostic-hyperparameters) <br> - [Object detection and instance segmentation task specific hyperparameters](./reference-automl-images-hyperparameters.md#object-detection-and-instance-segmentation-task-specific-hyperparameters). <br> <br> For an example, see [Supported model architectures](./how-to-auto-train-image-models.md?tabs=cli#supported-model-architectures) section.| | |

## Remarks

The `az ml job` command can be used for managing Azure Machine Learning jobs.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs). Examples relevant to image object detection job are shown below.

## YAML: AutoML image object detection job

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/automl-standalone-jobs/cli-automl-image-object-detection-task-fridge-items/cli-automl-image-object-detection-task-fridge-items.yml":::

## YAML: AutoML image object detection pipeline job

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/automl/image-object-detection-task-fridge-items-pipeline/pipeline.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
