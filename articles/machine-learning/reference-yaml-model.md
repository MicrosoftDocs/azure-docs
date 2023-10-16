---
title: 'CLI (v2) model YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) model YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022

author: Abeomor
ms.author: osomorog
ms.date: 03/31/2022
ms.reviewer: larryfr
---

# CLI (v2) model YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/model.schema.json.



[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `$schema` | string | The YAML schema. | |
| `name` | string | **Required.** Name of the model. | |
| `version` | int | Version of the model. If omitted, Azure Machine Learning will autogenerate a version. | |
| `description` | string | Description of the model. | |
| `tags` | object | Dictionary of tags for the model. | |
| `path` | string | Either a local path to the model file(s), or the URI of a cloud path to the model file(s). This can point to either a file or a directory. | |
| `type` | string | Storage format type of the model. Applicable for no-code deployment scenarios. | `custom_model`, `mlflow_model`, `triton_model` |
| `flavors` | object | Flavors of the model. Each model storage format type may have one or more supported flavors. Applicable for no-code deployment scenarios. | |

## Remarks

The `az ml model` command can be used for managing Azure Machine Learning models.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/assets/model). Several are shown below.

## YAML: local file

:::code language="yaml" source="~/azureml-examples-main/cli/assets/model/local-file.yml":::

## YAML: local folder in MLflow format

:::code language="yaml" source="~/azureml-examples-main/cli/assets/model/local-mlflow.yml":::

- [Install and use the CLI (v2)](how-to-configure-cli.md)
