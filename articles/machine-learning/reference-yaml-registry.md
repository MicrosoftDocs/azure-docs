---
title: 'CLI (v2) registry YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) registry YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, build-2023

author: fkriti
ms.author: kritifaujdar
ms.date: 05/23/2023
ms.reviewer: larryfr
---

# CLI (v2) registry YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at [https://azuremlschemasprod.azureedge.net/latest/registry.schema.json](https://azuremlschemasprod.azureedge.net/latest/registry.schema.json).



[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `name` | string | **Required.** Name of the registry. | | |
| `tags` | object | Dictionary of tags for the registry. | | |
| `location` | string | **Required.** The primary location of the registry. | | |
| `replication_locations` | object | **Required.** List of locations where the associated resources of the registry will be replicated. The list must include the primary location of registry. | | |
| `public_network_access` | string | Whether public endpoint access is allowed if the registry will be using Private Link. | `enabled`, `disabled` | `enabled` |

## Remarks

The `az ml registry` command can be used for managing Azure Machine Learning registries.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/resources/registry). Several are shown in the following sections.

## YAML: basic

:::code language="yaml" source="~/azureml-examples-main/cli/resources/registry/registry.yml":::

## YAML: with storage options

:::code language="yaml" source="~/azureml-examples-main/cli/resources/registry/registry-storage-options.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
