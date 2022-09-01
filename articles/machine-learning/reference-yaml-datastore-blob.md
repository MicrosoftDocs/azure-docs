---
title: 'CLI (v2) Azure Blob datastore YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Azure Blob datastore YAML schema.
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

# CLI (v2) Azure Blob datastore YAML schema

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/azureBlob.schema.json.



[!INCLUDE [schema note](../../includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `type` | string | **Required.** The type of datastore. | `azure_blob` | |
| `name` | string | **Required.** Name of the datastore. | | |
| `description` | string | Description of the datastore. | | |
| `tags` | object | Dictionary of tags for the datastore. | | |
| `account_name` | string | **Required.** Name of the Azure storage account. | | |
| `container_name` | string | **Required.** Name of the container. | | |
| `endpoint` | string | Endpoint suffix of the storage service, which is used for creating the storage account endpoint URL by combining the storage account name and `endpoint`. Example storage account URL: `https://<storage-account-name>.blob.core.windows.net`. | | `core.windows.net` |
| `protocol` | string | Protocol to use to connect to the container. | `https`, `wasbs` | `https` |
| `credentials` | object | Credential-based authentication credentials for connecting to the Azure storage account. You can provide either an account key or a shared access signature (SAS) token. Credential secrets are stored in the workspace key vault. | | |
| `credentials.account_key` | string | The account key for accessing the storage account. **One of `credentials.account_key` or `credentials.sas_token` is required if `credentials` is specified.** | | |
| `credentials.sas_token` | string | The SAS token for accessing the storage account. **One of `credentials.account_key` or `credentials.sas_token` is required if `credentials` is specified.** | | |

## Remarks

The `az ml datastore` command can be used for managing Azure Machine Learning datastores.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/resources/datastore). Several are shown below.

## YAML: identity-based access

:::code language="yaml" source="~/azureml-examples-main/cli/resources/datastore/blob-credless.yml":::

## YAML: account key

:::code language="yaml" source="~/azureml-examples-main/cli/resources/datastore/blob.yml":::

## YAML: wasbs protocol

:::code language="yaml" source="~/azureml-examples-main/cli/resources/datastore/blob-protocol.yml":::

## YAML: sas token

:::code language="yaml" source="~/azureml-examples-main/cli/resources/datastore/blob-sas.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
