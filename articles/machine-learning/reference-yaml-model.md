---
title: 'CLI (v2) model YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) model YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: lostmygithubaccount
ms.author: copeters
ms.date: 10/21/2021
ms.reviewer: laobri
---

# CLI (v2) model YAML schema

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/model.schema.json.

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `$schema` | string | The YAML schema. | |
| `name` | string | **Required.** Name of the model. | |
| `version` | string | Version of the model. If omitted, Azure ML will autogenerate a version. | |
| `description` | string | Description of the model. | |
| `tags` | object | Dictionary of tags for the model. | |
| `local_path` | string | Local path to the model file(s). This can point to either a file or a directory. **One of `local_path` or `model_uri` is required.** | |
| `model_uri` | string | URI of the model file(s). This can point to either a file or directory. **One of `local_path` or `model_uri` is required.** | |
| `model_format` | string | Storage format of the model. Applicable for no-code deployment scenarios. | `custom`, `mlflow`, `triton`, `openai` |
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
