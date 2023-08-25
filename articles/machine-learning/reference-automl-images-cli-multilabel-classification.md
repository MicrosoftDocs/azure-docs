---
title: 'CLI (v2) Automated ML Image Multi-Label Classification job YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Automated ML Image Multi-Label Classification job YAML schema.
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

# CLI (v2) Automated ML image multi-Label classification job YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlsdk2.blob.core.windows.net/preview/0.0.1/autoMLImageClassificationMultilabelJob.schema.json.



[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

For information on all the keys in Yaml syntax, see [Yaml syntax](./reference-automl-images-cli-classification.md#yaml-syntax) of image classification task. Here we only describe the keys that have different values as compared to what's specified for image classification task.

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `task` | const | **Required.** The type of AutoML task. | `image_classification_multilabel` | `image_classification_multilabel` |
| `primary_metric` | string |  The metric that AutoML will optimize for model selection. |`iou` | `iou` |

## Remarks

The `az ml job` command can be used for managing Azure Machine Learning jobs.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs). Examples relevant to image multi-label classification job are shown below.

## YAML: AutoML image multi-label classification job

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/automl-standalone-jobs/cli-automl-image-classification-multilabel-task-fridge-items/cli-automl-image-classification-multilabel-task-fridge-items.yml":::

## YAML: AutoML image multi-label classification pipeline job

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/automl/image-multilabel-classification-fridge-items-pipeline/pipeline.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
