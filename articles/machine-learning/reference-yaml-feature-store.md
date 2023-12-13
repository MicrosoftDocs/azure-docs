---
title: 'CLI (v2) feature store YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) feature store YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.topic: reference
author: qjxu
ms.author: qiax
ms.reviewer: franksolomon
ms.date: 05/23/2023
ms.custom: cliv2, build-2023
---

# CLI (v2) feature store YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax


| Key | Type | Description | Allowed values | Default value |
|--|--|--|--|--|
| $schema | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including $schema at the top of your file enables you to invoke schema and resource completions. |  |  |
| name | string | **Required.** Name of the feature store. |  |  |
| compute_runtime | object | The compute runtime configuration used for materialization job. |  |  |
| compute_runtime.spark_runtime_version | string | The Azure Machine Learning Spark runtime version. | 3.2 | 3.2 |
| offline_store | object |  |  |  |
| offline_store.type | string | **Required** if offline_store is provided. The type of offline store. Only data lake gen2 type of storage is supported. | azure_data_lake_gen2 |  |
| offline_store.target | string | **Required** if offline_store is provided. The datalake Gen2 storage URI in the format of `/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.Storage/storageAccounts/<account>/blobServices/default/containers/<container>`. |  |  |
| materialization_identity | object | The user-assigned managed identity that used for the materialization job. This identity needs to be granted necessary roles to access Feature Store service, the data source and the offline storage. |  |  |
| materialization_identity.client_id | string | The client ID for your user-assigned managed identity. |  |  |
| materialization_identity.resource_id | string | The resource ID for your user-assigned managed identity. |  |  |
| materialization_identity.principal_id | string | the principal ID for your user-assigned managed identity.|  |  |
| description | string | Description of the feature store. |  |  |
| tags | object | Dictionary of tags for the feature store. |  |  |
| display_name | string | Display name of the feature store in the studio UI. Can be nonunique within the resource group. |  |  |
| location | string | The location of the feature store. |  | The resource group location. |
| resource_group | string |The resource group containing the feature store. If the resource group doesn't exist, a new one is created. |  |  |

You can include other [workspace properties](reference-yaml-workspace.md).

## Remarks

The `az ml feature-store` command can be used for managing Azure Machine Learning feature store workspaces.
## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli). Some common examples are shown in below.

## YAML basic

```yaml
$schema: http://azureml/sdk-2-0/FeatureStore.json
name: mktg-feature-store
location: eastus
```

## YAML with offline store configuration

```yaml
$schema: http://azureml/sdk-2-0/FeatureStore.json
name: mktg-feature-store

compute_runtime:
    spark_runtime_version: 3.2

offline_store:
    type: azure_data_lake_gen2
    target: /subscriptions/<sub-id>/resourceGroups/<rg>/providers/Microsoft.Storage/storageAccounts/<account_name>/blobServices/default/containers/<container_name>

materialization_identity:
    client_id: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    resource_id: /subscriptions/<sub-id>/resourceGroups/<rg>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<uai-name>

# Many of workspace parameters will also be supported:
location: eastus
display_name: marketing feature store
tags:
  foo: bar
```

## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
- [Troubleshoot managed feature store](troubleshooting-managed-feature-store.md)
