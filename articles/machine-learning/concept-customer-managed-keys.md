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

Azure Machine Learning is built on top of multiple Azure services. Although the stored data is encrypted through encryption keys that Microsoft provides, you can enhance security by also providing your own (customer-managed) keys. The keys that you provide are stored in Azure Key Vault.

[!INCLUDE [machine-learning-customer-managed-keys.md](includes/machine-learning-customer-managed-keys.md)]

In addition to customer-managed keys, Azure Machine Learning provides an [hbi_workspace flag](/python/api/azure-ai-ml/azure.ai.ml.entities.workspace). Enabling this flag reduces the amount of data that Microsoft collects for diagnostic purposes and enables [extra encryption in Microsoft-managed environments](../security/fundamentals/encryption-atrest.md). This flag also enables the following behaviors:

* Starts encrypting the local scratch disk in your Azure Machine Learning compute cluster, if you didn't create any previous clusters in that subscription. Otherwise, you need to raise a support ticket to enable encryption of the scratch disk for your compute clusters.
* Cleans up your local scratch disk between jobs.
* Securely passes credentials for your storage account, container registry, and Secure Shell (SSH) account from the execution layer to your compute clusters by using your key vault.

The `hbi_workspace` flag doesn't affect encryption in transit. It affects only encryption at rest.

## Prerequisites

* An Azure subscription.
* An Azure Key Vault instance. The key vault contains the keys for encrypting your services.

The key vault instance must enable soft delete and purge protection. The managed identity for the services that you help secure by using a customer-managed key must have the following permissions in Key Vault:

* Wrap Key
* Unwrap Key
* Get

For example, the managed identity for Azure Cosmos DB would need to have those permissions to the key vault.

## Limitations

* After you create a workspace, you can't update the customer-managed key for resources that the workspace depends on.
* Resources that Microsoft manages in your subscription can't transfer ownership to you.
* You can't delete Microsoft-managed resources that you use for customer-managed keys without also deleting your workspace.

> [!WARNING]
> Don't delete the resource group that contains the Azure Cosmos DB instance, or any of the resources that are automatically created in this group. If you need to delete the resource group or Microsoft-managed services in it, you must delete the Azure Machine Learning workspace that uses it. The resource group's resources are deleted when you delete the associated workspace.

## Storage of workspace metadata

The following resources store metadata for your workspace:

| Service | How it's used |
| ----- | ----- |
| Azure Cosmos DB | Stores job history data |
| Azure AI Search | Stores indices that are used to help query your machine learning content |
| Azure Storage | Stores other metadata, such as Azure Machine Learning pipeline data |

Your Azure Machine Learning workspace reads and writes data by using its managed identity. This identity is granted access to the resources through a role assignment (Azure role-based access control) on the data resources. The encryption key that you provide is used to encrypt data that's stored on Microsoft-managed resources. It's also used to create indices for Azure AI Search at runtime.

## Customer-managed keys

When you _don't_ use a customer-managed key, Microsoft creates and manages these resources in a Microsoft-owned Azure subscription and uses a Microsoft-managed key to encrypt the data.

When you use a customer-managed key, these resources are in your Azure subscription and encrypted with your key. While they exist in your subscription, Microsoft manages these resources. They're automatically created and configured when you create your Azure Machine Learning workspace.

These Microsoft-managed resources are located in a new Azure resource group that's created in your subscription. This group is in addition to the resource group for your workspace. This resource group contains the Microsoft-managed resources that your key is used with. The formula for naming the resource group is `<Azure Machine Learning workspace resource group name><GUID>`.

> [!TIP]
> The [Request Units](../cosmos-db/request-units.md) for Azure Cosmos DB automatically scale as needed.

If your Azure Machine Learning workspace uses a private endpoint, this resource group also contains a Microsoft-managed Azure virtual network. This virtual network helps secure communications between the managed services and the workspace. You _can't provide your own virtual network_ for use with the Microsoft-managed resources. You also _can't modify the virtual network_. For example, you can't change the IP address range that it uses.

> [!IMPORTANT]
> If your subscription doesn't have enough quota for these services, a failure will occur.
>
> When you use a customer-managed key, the costs for your subscription are higher because these resources are in your subscription. To estimate the cost, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

## Storage of compute data

Azure Machine Learning uses compute resources to train and deploy machine learning models. The following table describes the compute options and how each one encrypts data:

:::moniker range="azureml-api-1"
| Compute | Encryption |
| ----- | ----- |
| Azure Container Instances | Data is encrypted with a Microsoft-managed key or a customer-managed key.</br>For more information, see [Encrypt deployment data](../container-instances/container-instances-encrypt-data.md). |
| Azure Kubernetes Service | Data is encrypted with a Microsoft-managed key or a customer-managed key.</br>For more information, see [Bring your own keys with Azure disks in Azure Kubernetes Service](../aks/azure-disk-customer-managed-keys.md). |
| Azure Machine Learning compute instance | The local scratch disk is encrypted if you enable the `hbi_workspace` flag for the workspace. |
| Azure Machine Learning compute cluster | The OS disk is encrypted in Azure Storage with Microsoft-managed keys. The temporary disk is encrypted if you enable the `hbi_workspace` flag for the workspace. |
:::moniker-end
:::moniker range="azureml-api-2"
| Compute | Encryption |
| ----- | ----- |
| Azure Kubernetes Service | Data is encrypted with a Microsoft-managed key or a customer-managed key.</br>For more information, see [Bring your own keys with Azure disks in Azure Kubernetes Service](../aks/azure-disk-customer-managed-keys.md). |
| Azure Machine Learning compute instance | The local scratch disk is encrypted if you enable the `hbi_workspace` flag for the workspace. |
| Azure Machine Learning compute cluster | The OS disk is encrypted in Azure Storage with Microsoft-managed keys. The temporary disk is encrypted if you enable the `hbi_workspace` flag for the workspace. |
:::moniker-end

### Compute cluster

The OS disk for each compute node that's stored in Azure Storage is encrypted with Microsoft-managed keys in Azure Machine Learning storage accounts. This compute target is ephemeral, and clusters are typically scaled down when no jobs are queued. The underlying virtual machine is deprovisioned, and the OS disk is deleted. Azure Disk Encryption isn't supported for the OS disk.

Each virtual machine also has a local temporary disk for OS operations. If you want, you can use the disk to stage training data. If you create the workspace with the `hbi_workspace` parameter set to `TRUE`, the temporary disk is encrypted. This environment is short lived (only during your job), and encryption support is limited to system-managed keys only.

### Compute instance

The OS disk for compute instance is encrypted with Microsoft-managed keys in Azure Machine Learning storage accounts. If you create the workspace with the `hbi_workspace` parameter set to `TRUE`, the local temporary disk on the compute instance is encrypted with Microsoft-managed keys. Customer-managed key encryption is not supported for OS and temporary disks.

### HBI_workspace flag

You can set the `hbi_workspace` flag only when you create a workspace. You can't change it for an existing workspace.

When you set this flag to `TRUE`, it might increase the difficulty of troubleshooting problems because less telemetry data is sent to Microsoft. There's less visibility into success rates or problem types. Microsoft might not be able to react as proactively when this flag is `TRUE`.

To enable the `hbi_workspace` flag when you're creating an Azure Machine Learning workspace, follow the steps in one of the following articles:

* [Create and manage a workspace by using the Azure portal or the Python SDK](how-to-manage-workspace.md)
* [Create and manage a workspace by using the Azure CLI](how-to-manage-workspace-cli.md)
* [Create a workspace by using HashiCorp Terraform](how-to-manage-workspace-terraform.md)
* [Create a workspace by using Azure Resource Manager templates](how-to-create-workspace-template.md)

## Next steps

* [Configure customer-managed keys with Azure Machine Learning](how-to-setup-customer-managed-keys.md)
