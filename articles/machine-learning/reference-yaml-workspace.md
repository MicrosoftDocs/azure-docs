---
title: 'CLI (v2) workspace YAML schema'
titleSuffix: Azure Machine Learning
description: Reference documentation for the CLI (v2) workspace YAML schema.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022

author: deeikele
ms.author: deeikele
ms.date: 10/21/2021
ms.reviewer: scottpolly
---

# CLI (v2) workspace YAML schema

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

The source JSON schema can be found at https://azuremlschemas.azureedge.net/latest/workspace.schema.json.



[!INCLUDE [schema note](includes/machine-learning-preview-old-json-schema-note.md)]

## YAML syntax

| Key | Type | Description | Allowed values | Default value |
| --- | ---- | ----------- | -------------- | ------- |
| `$schema` | string | The YAML schema. If you use the Azure Machine Learning VS Code extension to author the YAML file, including `$schema` at the top of your file enables you to invoke schema and resource completions. | | |
| `name` | string | **Required.** Name of the workspace. | | |
| `display_name` | string | Display name of the workspace in the studio UI. Can be non-unique within the resource group. | | |
| `description` | string | Description of the workspace. | | |
| `tags` | object | Dictionary of tags for the workspace. | | |
| `location` | string | The location of the workspace. If omitted, defaults to the resource group location. | | |
| `resource_group` | string | **Required.** The resource group containing the workspace. If the resource group does not exist, a new one will be created. | | |
| `hbi_workspace` | boolean | Whether the customer data is of high business impact (HBI), containing sensitive business information. For more information, see [Data encryption at rest](concept-data-encryption.md#encryption-at-rest). | | `false` |
| `storage_account` | string | The fully qualified resource ID of an existing Azure storage account to use as the default storage account for the workspace. A storage account with premium storage or hierarchical namespace cannot be used as the default storage account. If omitted, a new storage account will be created. | | |
| `container_registry` | string | The fully qualified resource ID of an existing Azure container registry to use as the default container registry for the workspace. Azure Machine Learning uses Azure Container Registry (ACR) for managing container images used for training and deployment. If omitted, a new container registry will be created. Creation is lazy loaded, so the container registry gets created the first time it is needed for an operation for either training or deployment. | | |
| `key_vault` | string | The fully qualified resource ID of an existing Azure key vault to use as the default key vault for the workspace. If omitted, a new key vault will be created. | | |
| `application_insights` | string | The fully qualified resource ID of an existing Azure application insights to use as the default application insights for the workspace. If omitted, a new application insights will be created. | | |
| `customer_managed_key` | object | Azure Machine Learning stores metadata in an Azure Cosmos DB instance. By default the data is encrypted at rest with Microsoft-managed keys. To use your own customer-managed key for encryption, specify the customer-managed key information in this section. For more information, see [Data encryption for Azure Cosmos DB](concept-data-encryption.md#azure-cosmos-db). | | |
| `customer_managed_key.key_vault` | string | The fully qualified resource ID of the key vault containing the customer-managed key. This key vault can be different than the default workspace key vault specified in `key_vault`.| | |
| `customer_managed_key.key_uri` | string | The key URI of the customer-managed key to encrypt data at rest. The URI format is `https://<keyvault-dns-name>/keys/<key-name>/<key-version>`. | | |
| `image_build_compute` | string | Name of the compute target to use for building environment Docker images when the container registry is behind a VNet. For more information, see [Secure workspace resources behind VNets](how-to-secure-workspace-vnet.md#enable-azure-container-registry-acr). | | |
| `public_network_access` | string | Whether public endpoint access is allowed if the workspace will be using Private Link. For more information, see [Enable public access when behind VNets](how-to-configure-private-link.md#enable-public-access). | `enabled`, `disabled` | `disabled` |
| `managed_network` | object | Azure Machine Learning Workspace managed network isolation. For more information, see [Workspace managed network isolation](how-to-managed-network.md). | | | 

## Remarks

The `az ml workspace` command can be used for managing Azure Machine Learning workspaces.

## Examples

Examples are available in the [examples GitHub repository](https://github.com/Azure/azureml-examples/tree/main/cli/resources/workspace). Several are shown below.

## YAML: basic

:::code language="yaml" source="~/azureml-examples-main/cli/resources/workspace/basic.yml":::

## YAML: with existing resources

:::code language="yaml" source="~/azureml-examples-main/cli/resources/workspace/with-existing-resources.yml":::

## YAML: customer-managed key

:::code language="yaml" source="~/azureml-examples-main/cli/resources/workspace/cmk.yml":::

## YAML: private link

:::code language="yaml" source="~/azureml-examples-main/cli/resources/workspace/privatelink.yml":::

## YAML: high business impact

:::code language="yaml" source="~/azureml-examples-main/cli/resources/workspace/hbi.yml":::

## YAML: managed network with allow internet outbound

:::code language="yaml" source="~/azureml-examples-main/cli/resources/workspace/mvnet-allow-internet-outbound.yml":::

## YAML: managed network with allow only approved outbound

:::code language="yaml" source="~/azureml-examples-main/cli/resources/workspace/mvnet-allow-only-approved-outbound.yml":::


## Next steps

- [Install and use the CLI (v2)](how-to-configure-cli.md)
