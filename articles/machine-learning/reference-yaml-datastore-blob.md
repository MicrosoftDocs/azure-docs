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
ms.date: 02/14/2023
ms.reviewer: franksolomon
---

# CLI (v2) Azure Blob datastore YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

See the source JSON schema at https://azuremlschemas.azureedge.net/latest/azureBlob.schema.json.

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning Visual Studio Code extension to author the YAML file, you can invoke schema and resource completions if you include `$schema` at the top of your file. | | |
| `type` | string | **Required.** The datastore type. | `azure_blob` | |
| `name` | string | **Required.** The datastore name. | | |
| `description` | string |  The datastore description. | | |
| `tags` | object | The datastore tag dictionary. | | |
| `account_name` | string | **Required.** The Azure storage account name. | | |
| `container_name` | string | **Required.** The container name. | | |
| `endpoint` | string | The endpoint suffix of the storage service, used for creation of the storage account endpoint URL. It combines the storage account name and `endpoint`. Example storage account URL: `https://<storage-account-name>.blob.core.windows.net`. | | `core.windows.net` |
| `protocol` | string | Protocol for connection to the container. | `https`, `wasbs` | `https` |
| `credentials` | object | Credential-based authentication credentials for connection to the Azure storage account. An account key or a shared access signature (SAS) token will work. The workspace key vault stores the credential secrets. | | |
| `credentials.account_key` | string | The account key used for storage account access. **One of `credentials.account_key` or `credentials.sas_token` is required if `credentials` is specified.** | | |
| `credentials.sas_token` | string | The SAS token for accessing the storage account. **One of `credentials.account_key` or `credentials.sas_token` is required if `credentials` is specified.** | | |

## Remarks

You can use the `az ml datastore` command to manage Azure Machine Learning datastores.

## Examples

See examples in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/resources/datastore). Several are shown here:

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
