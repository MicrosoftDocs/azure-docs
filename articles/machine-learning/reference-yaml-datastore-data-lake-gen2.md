---
title: 'CLI (v2) Azure Data Lake Gen2 datastore YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) Azure Data Lake Gen2 datastore YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022

author: ynpandey
ms.author: yogipandey
ms.date: 12/15/2023
ms.reviewer: franksolomon
---

# CLI (v2) Azure Data Lake Gen2 YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at [this resource](https://azuremlschemas.azureedge.net/latest/azureDataLakeGen2.schema.json).

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning Visual Studio Code extension to author the YAML file, you can invoke schema and resource completions if you include `$schema` at the top of your file. | | |
| `type` | string | **Required.**  The datastore type. | `azure_data_lake_gen2` | |
| `name` | string | **Required.**  The datastore name. | | |
| `description` | string | The datastore description. | | |
| `tags` | object | The datastore tag dictionary. | | |
| `account_name` | string | **Required.** The Azure storage account name. | | |
| `filesystem` | string | **Required.** The file system name. The parent directory containing the files and folders, equivalent to an Azure Blog storage container. | | |
| `endpoint` | string | The endpoint suffix of the storage service, used for creation of the storage account endpoint URL. It combines the storage account name and `endpoint`. Example storage account URL: `https://<storage-account-name>.dfs.core.windows.net`. | | `core.windows.net` |
| `protocol` | string | Protocol for connection to the file system. | `https`, `abfss` | `https` |
| `credentials` | object | Service principal credentials for connecting to the Azure storage account. Credential secrets are stored in the workspace key vault. | | |
| `credentials.tenant_id` | string | The service principal tenant ID. **Required if `credentials` is specified.** | | |
| `credentials.client_id` | string | The service principal client ID. **Required if `credentials` is specified.** | | |
| `credentials.client_secret` | string | The service principal client secret. **Required if `credentials` is specified.** | | |
| `credentials.resource_url` | string | The resource URL that specifies the operations that will be performed on the Azure Data Lake Storage Gen2 account. | | `https://storage.azure.com/` |
| `credentials.authority_url` | string | The authority URL used for user authentication. | | `https://login.microsoftonline.com` |

## Remarks

The `az ml datastore` command can be used for managing Azure Machine Learning datastores.

## Examples

You can find examples in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/resources/datastore). Several are shown here:

## YAML: identity-based access

:::code language="yaml" source="~/azureml-examples/cli/resources/datastore/adls-gen2-credless.yml":::

## YAML: tenant ID, client ID, client secret

:::code language="yaml" source="~/azureml-examples/cli/resources/datastore/adls-gen2.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)