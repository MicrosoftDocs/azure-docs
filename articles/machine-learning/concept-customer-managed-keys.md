---
title: Customer-managed keys
titleSuffix: Azure Machine Learning
description: 'Learn about using customer-managed keys to improve data security with Azure Machine Learning.'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: conceptual
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 09/12/2023
ms.custom: engagement-fy23
monikerRange: 'azureml-api-2 || azureml-api-1'
---
# Customer-managed keys for Azure Machine Learning

Azure Machine Learning is built on top of multiple Azure services. While the data is stored securely using encryption keys that Microsoft provides, you can enhance security by also providing your own (customer-managed) keys. The keys you provide are stored securely using Azure Key Vault.

[!INCLUDE [machine-learning-customer-managed-keys.md](includes/machine-learning-customer-managed-keys.md)]

In addition to customer-managed keys, Azure Machine Learning also provides a [hbi_workspace flag](/python/api/azure-ai-ml/azure.ai.ml.entities.workspace). Enabling this flag reduces the amount of data Microsoft collects for diagnostic purposes and enables [extra encryption in Microsoft-managed environments](../security/fundamentals/encryption-atrest.md). This flag also enables the following behaviors:

* Starts encrypting the local scratch disk in your Azure Machine Learning compute cluster, provided you haven't created any previous clusters in that subscription. Else, you need to raise a support ticket to enable encryption of the scratch disk of your compute clusters.
* Cleans up your local scratch disk between jobs.
* Securely passes credentials for your storage account, container registry, and SSH account from the execution layer to your compute clusters using your key vault.

> [!TIP]
> The `hbi_workspace` flag does not impact encryption in transit, only encryption at rest.

## Prerequisites

* An Azure subscription.
* An Azure Key Vault instance. The key vault contains the key(s) used to encrypt your services.

    * The key vault instance must enable soft delete and purge protection.
    * The managed identity for the services secured by a customer-managed key must have the following permissions in key vault:

        * wrap key
        * unwrap key
        * get

        For example, the managed identity for Azure Cosmos DB would need to have those permissions to the key vault.

## Limitations

* The customer-managed key for resources the workspace depends on can't be updated after workspace creation.
* Resources managed by Microsoft in your subscription can't transfer ownership to you.
* You can't delete Microsoft-managed resources used for customer-managed keys without also deleting your workspace.

## How workspace metadata is stored

The following resources store metadata for your workspace:

| Service | How it's used |
| ----- | ----- |
| Azure Cosmos DB | Stores job history data. |
| Azure AI Search | Stores indices that are used to help query your machine learning content. |
| Azure Storage Account | Stores other metadata such as Azure Machine Learning pipelines data. |

Your Azure Machine Learning workspace reads and writes data using its managed identity. This identity is granted access to the resources using a role assignment (Azure role-based access control) on the data resources. The encryption key you provide is used to encrypt data that is stored on Microsoft-managed resources. It's also used to create indices for Azure AI Search, which are created at runtime.

## Customer-managed keys

When you __don't use a customer-managed key__, Microsoft creates and manages these resources in a Microsoft owned Azure subscription and uses a Microsoft-managed key to encrypt the data. 

When you __use a customer-managed key__, these resources are _in your Azure subscription_ and encrypted with your key. While they exist in your subscription, these resources are __managed by Microsoft__. They're automatically created and configured when you create your Azure Machine Learning workspace.

> [!IMPORTANT]
> When using a customer-managed key, the costs for your subscription will be higher because these resources are in your subscription. To estimate the cost, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

These Microsoft-managed resources are located in a new Azure resource group is created in your subscription. This group is in addition to the resource group for your workspace. This resource group will contain the Microsoft-managed resources that your key is used with. The resource group will be named using the formula of `<Azure Machine Learning workspace resource group name><GUID>`.

> [!TIP]
> * The [__Request Units__](../cosmos-db/request-units.md) for the Azure Cosmos DB automatically scale as needed.
> * If your Azure Machine Learning workspace uses a private endpoint, this resource group will also contain a Microsoft-managed Azure Virtual Network. This VNet is used to secure communications between the managed services and the workspace. You __cannot provide your own VNet for use with the Microsoft-managed resources__. You also __cannot modify the virtual network__. For example, you cannot change the IP address range that it uses.

> [!IMPORTANT]
> If your subscription does not have enough quota for these services, a failure will occur.

> [!WARNING]
> __Don't delete the resource group__ that contains this Azure Cosmos DB instance, or any of the resources automatically created in this group. If you need to delete the resource group or Microsoft-managed services in it, you must delete the Azure Machine Learning workspace that uses it. The resource group resources are deleted when the associated workspace is deleted.

## How compute data is stored

Azure Machine Learning uses compute resources to train and deploy machine learning models. The following table describes the compute options and how data is encrypted by each one:

:::moniker range="azureml-api-1"
| Compute | Encryption |
| ----- | ----- |
| Azure Container Instance | Data is encrypted by a Microsoft-managed key or a customer-managed key.</br>For more information, see [Encrypt data with a customer-managed key](../container-instances/container-instances-encrypt-data.md). |
| Azure Kubernetes Service | Data is encrypted by a Microsoft-managed key or a customer-managed key.</br>For more information, see [Bring your own keys with Azure disks in Azure Kubernetes Services](../aks/azure-disk-customer-managed-keys.md). |
| Azure Machine Learning compute instance | Local scratch disk is encrypted if the `hbi_workspace` flag is enabled for the workspace. |
| Azure Machine Learning compute cluster | OS disk encrypted in Azure Storage with Microsoft-managed keys. Temporary disk is encrypted if the `hbi_workspace` flag is enabled for the workspace. |
:::moniker-end
:::moniker range="azureml-api-2"
| Compute | Encryption |
| ----- | ----- |
| Azure Kubernetes Service | Data is encrypted by a Microsoft-managed key or a customer-managed key.</br>For more information, see [Bring your own keys with Azure disks in Azure Kubernetes Services](../aks/azure-disk-customer-managed-keys.md). |
| Azure Machine Learning compute instance | Local scratch disk is encrypted if the `hbi_workspace` flag is enabled for the workspace. |
| Azure Machine Learning compute cluster | OS disk encrypted in Azure Storage with Microsoft-managed keys. Temporary disk is encrypted if the `hbi_workspace` flag is enabled for the workspace. |
:::moniker-end

**Compute cluster**
The OS disk for each compute node stored in Azure Storage is encrypted with Microsoft-managed keys in Azure Machine Learning storage accounts. This compute target is ephemeral, and clusters are typically scaled down when no jobs are queued. The underlying virtual machine is de-provisioned, and the OS disk is deleted. Azure Disk Encryption isn't supported for the OS disk. 

Each virtual machine also has a local temporary disk for OS operations. If you want, you can use the disk to stage training data. If the workspace was created with the `hbi_workspace` parameter set to `TRUE`, the temporary disk is encrypted. This environment is short-lived (only during your job) and encryption support is limited to system-managed keys only.

**Compute instance**
The OS disk for compute instance is encrypted with Microsoft-managed keys in Azure Machine Learning storage accounts. If the workspace was created with the `hbi_workspace` parameter set to `TRUE`, the local temporary disk on compute instance is encrypted with Microsoft managed keys. Customer managed key encryption isn't supported for OS and temp disk.

### HBI_workspace flag

* The `hbi_workspace` flag can only be set when a workspace is created. It can't be changed for an existing workspace.
* When this flag is set to True, it may increase the difficulty of troubleshooting issues because less telemetry data is sent to Microsoft. There's less visibility into success rates or problem types. Microsoft may not be able to react as proactively when this flag is True.

To enable the `hbi_workspace` flag when creating an Azure Machine Learning workspace, follow the steps in one of the following articles:

* [How to create and manage a workspace](how-to-manage-workspace.md).
* [How to create and manage a workspace using the Azure CLI](how-to-manage-workspace-cli.md).
* [How to create a workspace using Hashicorp Terraform](how-to-manage-workspace-terraform.md).
* [How to create a workspace using Azure Resource Manager templates](how-to-create-workspace-template.md).

## Next Steps

* [How to configure customer-managed keys with Azure Machine Learning](how-to-setup-customer-managed-keys.md).