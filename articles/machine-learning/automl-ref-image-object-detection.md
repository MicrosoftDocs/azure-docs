---
title: 'CLI (v2) Automated ML Image Object Detection job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Automated ML Image Object Detection job YAML schema.
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

# CLI (v2) Automated ML Image Object Detection job YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlsdk2.blob.core.windows.net/preview/0.0.1/autoMLImageObjectDetectionJob.schema.json.



[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

For information on all the keys in Yaml syntax, refer to [Yaml syntax](./automl-ref-image-classification.md#yaml-syntax) of image classification task. Here we only describe the keys that have differnt values as compared to what's specified for image classification task.

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `task` | const | **Required.** The type of AutoML task. | `image_object_detection` | `image_object_detection` |
| `primary_metric` | string |  The metric that AutoML will optimize for model selection. |`mean_average_precision` | `mean_average_precision` |
| `training_parameters` | object | Dictionary containing training parameters for the job. Provide an object that has keys as listed in [Model Specific Hyperparameters](./reference-automl-images-hyperparameters.md#model-specific-hyperparameters) for yolov5 (if you are using yolov5 for object detection), [Model Agnostic Hyperparameters](./reference-automl-images-hyperparameters.md#model-agnostic-hyperparameters) and [Object Detection and Instance Segmentation Task Specific Hyperparameters](./reference-automl-images-hyperparameters.md#object-detection-and-instance-segmentation-task-specific-hyperparameters). Hyperparameters are of two types - discrete and continuous, refer to [Discrete and Continuous Hyperparameters section](./automl-ref-image-classification.md#discrete-and-continuous-hyperparameters) for a brief introduction. For an example, refer to [Configure your experiment settings](./how-to-auto-train-image-models.md?tabs=cli#configure-your-experiment-settings) section.| | |

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
