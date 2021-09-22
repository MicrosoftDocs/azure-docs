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
| `version` | string | Version of the dataset. If omitted, Azure ML will autogenerate a version. | |
| `description` | string | Description of the dataset. | |
| `tags` | object | Dictionary of tags for the dataset. | |
| `local_path` | string | Absolute or relative path of a single local file or folder from which the dataset is created. **One of `local_path` or `paths` is required.** | |
| `paths` | array | A list of URI sources from which the dataset is created. Each entry in the list should adhere to the schema defined in [Dataset source path](#dataset-source-path). Currently, only a single source is supported.  **One of `local_path` or `paths` is required.** | |

### Dataset source path
| Key | Type | Description |
| --- | ---- | ----------- |
| `file` | string | URI to a single file used as a source for the dataset. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, and `adl`. See [Core yaml syntax]() for more information on how to use the `azureml://` URI format. **One of `file` or `folder` is required.** |
| `folder` | string | URI to a folder used as a source for the dataset. Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, and `adl`. See [Core yaml syntax]() for more information on how to use the `azureml://` URI format. **One of `file` or `folder` is required.** |

## Remarks

The `az ml dataset` commands can be used for managing Azure Machine Learning datasets.

## Schema

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/dataset.schema.json. The schema is provided below in JSON and YAML formats for convenience.

# [JSON](#tab/json)

:::code language="json" source="~/azureml-examples-cli-preview/cli/.schemas/jsons/latest/dataset.schema.json":::

# [YAML](#tab/yaml)

:::code language="yaml" source="~/azureml-examples-cli-preview/cli/.schemas/yamls/latest/dataset.schema.yml":::

---

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
