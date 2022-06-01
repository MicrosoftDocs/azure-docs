---
title: 'CLI (v2) data YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) data YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022

author: ynpandey
ms.author: yogipandey
ms.date: 03/31/2022
ms.reviewer: nibaccam
---

# CLI (v2) data YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/data.schema.json.



[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `name` | string | **Required.** Name of the data asset. | | |
| `version` | string | Version of the dataset. If omitted, Azure ML will autogenerate a version. | | |
| `description` | string | Description of the data asset. | | |
| `tags` | object | Dictionary of tags for the data asset. | | |
| `type` | string | The data asset type. Specify `uri_file` for data that points to a single file source, or `uri_folder` for data that points to a folder source. | `uri_file`, `uri_folder` | `uri_folder` |
| `path` | string | Either a local path to the data source file or folder, or the URI of a cloud path to the data source file or folder. Please ensure that the source provided here is compatible with the `type` specified. <br><br> Supported URI types are `azureml`, `https`, `wasbs`, `abfss`, and `adl`. See [Core yaml syntax](reference-yaml-core-syntax.md) for more information on how to use the `azureml://` URI format. | | |

## Remarks

The `az ml data` commands can be used for managing Azure Machine Learning data assets.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/assets/data). Several are shown below.

## YAML: datastore file

:::code language="yaml" source="~/azureml-examples-main/cli/assets/data/cloud-file.yml":::

## YAML: datastore folder

:::code language="yaml" source="~/azureml-examples-main/cli/assets/data/cloud-folder.yml":::

## YAML: https file

:::code language="yaml" source="~/azureml-examples-main/cli/assets/data/cloud-file-https.yml":::

## YAML: https folder

:::code language="yaml" source="~/azureml-examples-main/cli/assets/data/cloud-folder-https.yml":::

## YAML: wasbs file

:::code language="yaml" source="~/azureml-examples-main/cli/assets/data/cloud-file-wasbs.yml":::

## YAML: wasbs folder

:::code language="yaml" source="~/azureml-examples-main/cli/assets/data/cloud-folder-wasbs.yml":::

## YAML: local file

:::code language="yaml" source="~/azureml-examples-main/cli/assets/data/local-file.yml":::

## YAML: local folder

:::code language="yaml" source="~/azureml-examples-main/cli/assets/data/local-folder.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
