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
ms.date: 02/14/2023
ms.reviewer: franksolomon
---

# CLI (v2) Azure Data Lake Gen1 YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

See the source JSON schema at https://azuremlschemas.azureedge.net/latest/azureDataLakeGen1.schema.json.

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning Visual Studio Code extension to author the YAML file, you can invoke schema and resource completions if you include `$schema` at the top of your file. | | |
| `type` | string | **Required.** The datastore type. | `azure_data_lake_gen1` | |
| `name` | string | **Required.** The datastore name. | | |
| `description` | string | The datastore description. | | |
| `tags` | object | The datastore tag dictionary. | | |
| `store_name` | string | **Required.** The Azure Data Lake Storage Gen1 account name. | | |
| `credentials` | object | Service principal credentials to connect to the Azure storage account. Credential secrets are stored in the workspace key vault. | | |
| `credentials.tenant_id` | string | The service principal tenant ID. **Required if `credentials` is specified.** | | |
| `credentials.client_id` | string | The service principal client ID. **Required if `credentials` is specified.** | | |
| `credentials.client_secret` | string | The service principal client secret. **Required if `credentials` is specified.** | | |
| `credentials.resource_url` | string | The resource URL that determines which operations the Azure Data Lake Storage Gen1 account performs. | | `https://datalake.azure.net/` |
| `credentials.authority_url` | string | The authority URL used for user authentication. | | `https://login.microsoftonline.com` |

## Remarks

You can use the `az ml datastore` command to manage Azure Machine Learning datastores.

## Examples

See examples in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/resources/datastore). Several are shown here:

## YAML: identity-based access

:::code language="yaml" source="~/azureml-examples-main/cli/resources/datastore/adls-gen1-credless.yml":::

## YAML: tenant ID, client ID, client secret

:::code language="yaml" source="~/azureml-examples-main/cli/resources/datastore/adls-gen1.yml":::

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
