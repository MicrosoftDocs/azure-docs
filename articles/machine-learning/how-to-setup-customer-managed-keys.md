---
title: Use customer-managed keys
titleSuffix: Azure Machine Learning
description: 'Learn how to improve data security with Azure Machine Learning by using customer-managed keys.'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: conceptual
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 01/28/2022
---
# Customer-managed keys for Azure Machine Learning

Azure Machine Learning is built on top of multiple Azure services. While the data is stored securely using encryption keys that Microsoft provides, you can enhance security by also providing your own (customer-managed) keys. The keys you provide are stored securely using Azure Key Vault.

Customer-managed keys are used with the following services that Azure Machine Learning relies on:

| Service | What it’s used for |
| ----- | ----- |
| Azure Cosmos DB | Stores metadata for Azure Machine Learning |
| Azure Search | Stores workspace metadata for Azure Machine Learning |
| Azure Storage | Stores workspace metadata for Azure Machine Learning | 
| Azure Container Instance | Hosting trained models as inference endpoints |
| Azure Kubernetes Service | Hosting trained models as inference endpoints |

> [!TIP]
> While it may be possible to use the same key for everything, using a different key for each service or instance allows you to rotate or revoke the keys without impacting multiple services.

In addition to customer-managed keys, Azure Machine Learning also provides a [hbi_workspace flag](/python/api/azureml-core/azureml.core.workspace%28class%29#create-name--auth-none--subscription-id-none--resource-group-none--location-none--create-resource-group-true--sku--basic---friendly-name-none--storage-account-none--key-vault-none--app-insights-none--container-registry-none--cmk-keyvault-none--resource-cmk-uri-none--hbi-workspace-false--default-cpu-compute-target-none--default-gpu-compute-target-none--exist-ok-false--show-output-true-). Enabling this flag reduces the amount of data Microsoft collects for diagnostic purposes and enables [additional encryption in Microsoft-managed environments](../security/fundamentals/encryption-atrest.md). This flag also enables the following behaviors:

* Starts encrypting the local scratch disk in your Azure Machine Learning compute cluster, provided you haven’t created any previous clusters in that subscription. Else, you need to raise a support ticket to enable encryption of the scratch disk of your compute clusters.
* Cleans up your local scratch disk between runs.
* Securely passes credentials for your storage account, container registry, and SSH account from the execution layer to your compute clusters using your key vault.

> [!TIP]
> The `hbi_workspace` flag does not impact encryption in transit, only encryption at rest.

## Prerequisites

* An Azure subscription.

## How workspace metadata is stored

The following resources store metadata for your workspace:

| Service | How it’s used |
| ----- | ----- |
| Azure Cosmos DB | Stores run history data. |
| Azure Search | Stores indices that are used to help query your machine learning content. |
| Azure Storage Account | Stores additional metadata such as Azure Machine Learning pipelines data. |

> [!TIP]
> The Azure Storage Account for metadata can be different than the default storage account for your workspace.

Azure Machine Learning reads and writes data using the workspace managed identity. An Azure role-based access control (Azure RBAC) role is used to grant the managed identity access to these resources.

### Customer-managed keys

When you __don't use a customer-managed key__, Microsoft creates and manages these resources in a Microsoft owned Azure subscription and uses a Microsoft-managed key to encrypt the data. 

When you __use a customer-managed key__, these resources are _in your Azure subscription_ and encrypted with your key.

> [!IMPORTANT]
> When using a customer-managed key, the costs for your subscription will be higher because these resources are in your subscription. To estimate the cost, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

## Bring your own resources

When you create a workspace using a customer-managed key, there are two options:

* Allow Microsoft to create and manage the resources.
* Create and manage your own resources.

__When you allow Microsoft to create and manage resources__, a separate resource group is created in your Azure subscription. Data stored in these services is encrypted using the key you provide. 

__Bringing your own resources__ allows for enhanced configuration, but you’re responsible for managing the resources that you bring.

> [!TIP]
> You can have a mix of resources that you bring and those that Microsoft manages. For example, you can select an existing Azure Cosmos DB and use Microsoft-managed for the Storage Account and Search services.

Use cases for choosing to manage your own data resources include:

* Enhanced key management. For example, you can set individual key rotation policies for each data resource.
* Use naming conventions aligned with your organization's standards.
* Customize resource configurations to comply with your organizations IT policies.

### Using Microsoft-managed resources

If you use a customer-managed key and allow Microsoft to manage the resources, a new Azure resource group. This is in addition to the resource group for your workspace. This resource group will contain the Microsoft-managed resources that your key is used with. The resource group will be named using the formula of `<Azure Machine Learning workspace resource group name><GUID>`.

> [!TIP]
> * If you use a mix of bring your own and Microsoft-managed resources, only the Microsoft-managed resources will be in this resource group.
> * If you use a Microsoft-managed Azure Cosmos DB, the [__Request Units__](/azure/cosmos-db/request-units) automatically scale as needed. The __minimum__ RU is __1200__. The __maximum__ RU is __12000__.
> * If your Azure Machine Learning workspace uses a private endpoint, this resource group will also contain a Microsoft-managed Azure Virtual Network. This VNet is used to secure communications between the managed services and the workspace. You __cannot provide your own VNet for use with the Microsoft-managed resources__. You also __cannot modify the virtual network__. For example, you cannot change the IP address range that it uses.

> [!IMPORTANT]
> If your subscription does not have enough quota for these services, a failure will occur.

> [!WARNING]
> __Don't delete the resource group__ that contains this Azure Cosmos DB instance, or any of the resources automatically created in this group. If you need to delete the resource group or Microsoft-managed services in it, you must delete the Azure Machine Learning workspace that uses it. The resource group resources are deleted when the associated workspace is deleted.


## Encrypted data at rest

### HBI_workspace flag

* The `hbi_workspace` flag can only be set when a workspace is created. It can’t be changed for an existing workspace.
* When this flag is set to True, it may increase the difficulty of troubleshooting issues because less telemetry data is sent to Microsoft. There’s less visibility into success rates or problem types. Microsoft may not be able to react as proactively when this flag is True.

To enable the `hbi_workspace` flag when creating an Azure Machine Learning workspace, follow the steps in one of the following articles:

* [How to create and manage a workspace](how-to-manage-workspace.md).
* [How to create and manage a workspace using the Azure CLI](how-to-manage-workspace-cli.md).
* [How to create a workspace using Hashicorp Terraform](how-to-manage-workspace-terraform.md).
* [How to create a workspace using Azure Resource Manager templates](how-to-create-workspace-template.md).

## How to rotate keys

* Cosmos DB: If you need to __rotate or revoke__ your key, you can do so at any time. When rotating a key, Cosmos DB will start using the new key (latest version) to encrypt data at rest. When revoking (disabling) a key, Cosmos DB takes care of failing requests. It usually takes an hour for the rotation or revocation to be effective.

## Next Steps