---
title: 'CLI (v2) Azure Files datastore YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Azure Files datastore YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022

author: ynpandey
ms.author: yogipandey
ms.date: 12/18/2023
ms.reviewer: franksolomon
---

# CLI (v2) Azure Files datastore YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/azureFile.schema.json.

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, include `$schema` at the top of your file to invoke schema and resource completions. | | |
| `type` | string | **Required.** The datastore type. | `azure_file` | |
| `name` | string | **Required.** The datastore name. | | |
| `description` | string | The datastore description. | | |
| `tags` | object | The datastore tag dictionary. | | |
| `account_name` | string | **Required.** The Azure storage account name. | | |
| `file_share_name` | string | **Required.** The file share name. | | |
| `endpoint` | string | Endpoint suffix of the storage service. This is used to create the storage account endpoint URL. It combines the storage account name and `endpoint`. Example storage account URL: `https://<storage-account-name>.file.core.windows.net`. | | `core.windows.net` |
| `protocol` | string | Protocol to use to connect to the file share. | `https` | `https` |
| `credentials` | object | Credential-based authentication credentials to connect to the Azure storage account. Provide either an account key or a shared access signature (SAS) token for this. Credential secrets are stored in the workspace key vault. | | |
| `credentials.account_key` | string | The account key to access the storage account. **One of either`credentials.account_key` or `credentials.sas_token` is required if `credentials` is specified.** | | |
| `credentials.sas_token` | string | The SAS token to access the storage account. **One of `credentials.account_key` or `credentials.sas_token` is required if `credentials` is specified.** | | |

## Remarks

The `az ml datastore` command can be used for managing Azure Machine Learning datastores.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/resources/datastore). Several are shown below.

## YAML: account key

:::code language="yaml" source="~/azureml-examples-main/cli/resources/datastore/file.yml":::

## YAML: sas token

:::code language="yaml" source="~/azureml-examples-main/cli/resources/datastore/file-sas.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
