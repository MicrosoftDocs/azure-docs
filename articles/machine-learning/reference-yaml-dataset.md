---
title: 'CLI (v2) dataset YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) dataset YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: ynpandey
ms.author: yogipandey
ms.date: 09/20/2021
ms.reviewer: laobri
---

# CLI (v2) dataset YAML schema

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## YAML syntax

| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | |
| `name` | string | **Required.** Name of the dataset. | |
| `description` | string | Description of the dataset. | |
| `tags` | object | Dictionary of tags for the dataset. | |
| `version`	| string | Version of the dataset. If omitted, Azure ML will autogenerate a version. | |
| `local_path` | string | Absolute or relative path of a single local file or folder from which the Dataset is created. **One of `local_path` or `paths` is required.** | |
| `paths` | object | An [array of `file` or `folder` paths](#dataset-paths-array) from which the Dataset is created. Currently, only single `file` or `folder` is supported.  **One of `local_path` or `paths` is required.** | |

### Dataset `paths` array
| Key | Type | Description | Allowed values |
| --- | ---- | ----------- | -------------- |
| `file` | string | URI to a single file used for creating the Dataset. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, `adl`. See [Core yaml syntax]() for more information on how to use the `azureml://` URI format. **One `file` or `folder` URI is required** in the `paths` array. | |
| `folder` | string | URI to a folder  used for creating the Dataset. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, `adl`. See [Core yaml syntax]() for more information on how to use the `azureml://` URI format. **One `file` or `folder` URI is required** in the `paths` array. | |

## Remarks

The `az ml dataset` command can be used for managing Azure Machine Learning datasets.

## Examples

[TODO]

## Schema

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/dataset.schema.json. The schema is provided below in JSON and YAML formats for convenience.

# [JSON](#tab/json)

:::code language="json" source="~/azureml-examples-cli-preview/cli/.schemas/jsons/latest/dataset.schema.json":::

# [YAML](#tab/yaml)

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/.schemas/yamls/latest/dataset.schema.yml":::

---

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
