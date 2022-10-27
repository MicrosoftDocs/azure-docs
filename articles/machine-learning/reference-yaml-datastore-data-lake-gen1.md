---
title: 'CLI (v2) Azure Data Lake Gen1 datastore YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Azure Data Lake Gen1 datastore YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022

author: ynpandey
ms.author: yogipandey
ms.date: 10/21/2021
ms.reviewer: laobri
---

# CLI (v2) Azure Data Lake Gen1 YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/azureDataLakeGen1.schema.json.



[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `type` | string | **Required.** The type of datastore. | `azure_data_lake_gen1` | |
| `name` | string | **Required.** Name of the datastore. | | |
| `description` | string | Description of the datastore. | | |
| `tags` | object | Dictionary of tags for the datastore. | | |
| `store_name` | string | **Required.** Name of the Azure Data Lake Storage Gen1 account. | | |
| `credentials` | object | Service principal credentials for connecting to the Azure storage account. Credential secrets are stored in the workspace key vault. | | |
| `credentials.tenant_id` | string | The tenant ID of the service principal. **Required if `credentials` is specified.** | | |
| `credentials.client_id` | string | The client ID of the service principal. **Required if `credentials` is specified.** | | |
| `credentials.client_secret` | string | The client secret of the service principal. **Required if `credentials` is specified.** | | |
| `credentials.resource_url` | string | The resource URL that determines what operations will be performed on the Azure Data Lake Storage Gen1 account. | | `https://datalake.azure.net/` |
| `credentials.authority_url` | string | The authority URL used to authenticate the user. | | `https://login.microsoftonline.com` |

## Remarks

The `az ml datastore` command can be used for managing Azure Machine Learning datastores.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/resources/datastore). Several are shown below.

## YAML: identity-based access

:::code language="yaml" source="~/azureml-examples-main/cli/resources/datastore/adls-gen1-credless.yml":::

## YAML: tenant ID, client ID, client secret

:::code language="yaml" source="~/azureml-examples-main/cli/resources/datastore/adls-gen1.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
