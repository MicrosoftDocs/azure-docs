---
title: Customer-Managed Keys for Azure AI services
titleSuffix: Azure AI services
description: Learn about using customer-managed keys to improve data security with Azure AI services.
author: deeikele
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 10/1/2023
ms.author: deeikele
---

# Customer-managed keys for encryption

Azure AI is built on top of multiple Azure services. While the data is stored securely using encryption keys that Microsoft provides, you can enhance security by providing your own (customer-managed) keys. The keys you provide are stored securely using Azure Key Vault.

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

* The customer-managed key for resources that Azure AI depends on can't be updated after Azure AI resource creation.
* Resources that are created in the Microsoft-managed Azure resource group in your subscription can't be modified by you or be provided by you at the time of creation as existing resources.
* You can't delete Microsoft-managed resources used for customer-managed keys without also deleting your project.

## How project metadata is stored

The following services are used by Azure AI to store metadata for your Azure AI resource and projects:

|Service|What it's used for|Example|
|-----|-----|-----|
|Azure Cosmos DB|Stores metadata for your Azure AI projects and tools|Flow creation timestamps, deployment tags, evaluation metrics|
|Azure AI Search|Stores indices that are used to help query your machine learning content.|An index based off your model deployment names|
|Azure Storage Account|Stores artifacts created by Azure AI projects and tools|Finetuned models|
|Azure AI services|Hosts a collection of model endpoints|Project metadata such as language tags|

All of the above services are encrypted using the same key at the time that you create your Azure AI resource for the first time. Your Azure AI resource and projects read and write data using managed identity. Managed identities are granted access to the resources using a role assignment (Azure role-based access control) on the data resources. The encryption key you provide is used to encrypt data that is stored on Microsoft-managed resources. It's also used to create indices for Azure AI Search, which are created at runtime.

## Customer-managed keys

When you don't use a customer-managed key, Microsoft creates and manages these resources in a Microsoft owned Azure subscription and uses a Microsoft-managed key to encrypt the data. 

When you use a customer-managed key, these resources are _in your Azure subscription_ and encrypted with your key. While they exist in your subscription, these resources are managed by Microsoft. They're automatically created and configured when you create your Azure AI resource. 

> [!IMPORTANT]
> When using a customer-managed key, the costs for your subscription will be higher because these resources are in your subscription. To estimate the cost, use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

These Microsoft-managed resources are located in a new Azure resource group is created in your subscription. This group is in addition to the resource group for your project. This resource group will contain the Microsoft-managed resources that your key is used with. The resource group will be named using the formula of `<Azure AI resource group name><GUID>`. It is not possible to change the naming of the resources in this managed resource group.

> [!TIP]
> * The [Request Units](../../cosmos-db/request-units.md) for the Azure Cosmos DB automatically scale as needed.
> * If your AI resource uses a private endpoint, this resource group will also contain a Microsoft-managed Azure Virtual Network. This VNet is used to secure communications between the managed services and the project. You cannot provide your own VNet for use with the Microsoft-managed resources. You also cannot modify the virtual network. For example, you cannot change the IP address range that it uses.

> [!IMPORTANT]
> If your subscription does not have enough quota for these services, a failure will occur.

> [!WARNING]
> Don't delete the managed resource group that contains this Azure Cosmos DB instance, or any of the resources automatically created in this group. If you need to delete the resource group or Microsoft-managed services in it, you must delete the Azure AI resources that uses it. The resource group resources are deleted when the associated AI resource is deleted.

The process to enable Customer-Managed Keys with Azure Key Vault for Azure AI services varies by product. Use these links for service-specific instructions:

* [Azure OpenAI encryption of data at rest](../openai/encrypt-data-at-rest.md)
* [Custom Vision encryption of data at rest](../custom-vision-service/encrypt-data-at-rest.md)
* [Face Services encryption of data at rest](../computer-vision/identity-encrypt-data-at-rest.md)
* [Document Intelligence encryption of data at rest](../../ai-services/document-intelligence/encrypt-data-at-rest.md)
* [Translator encryption of data at rest](../translator/encrypt-data-at-rest.md)
* [Language service encryption of data at rest](../language-service/concepts/encryption-data-at-rest.md)
* [Speech encryption of data at rest](../speech-service/speech-encryption-of-data-at-rest.md)
* [Content Moderator encryption of data at rest](../Content-Moderator/encrypt-data-at-rest.md)
* [Personalizer encryption of data at rest](../personalizer/encrypt-data-at-rest.md)

## How compute data is stored

Azure AI uses compute resources for compute instance and serverless compute when you finetune models or build flows. The following table describes the compute options and how data is encrypted by each one:

| Compute | Encryption |
| ----- | ----- |
| Compute instance | Local scratch disk is encrypted. |
| Serverless compute | OS disk encrypted in Azure Storage with Microsoft-managed keys. Temporary disk is encrypted. |

**Compute instance**
The OS disk for compute instance is encrypted with Microsoft-managed keys in Azure Machine Learning storage accounts. If the project was created with the `hbi_workspace` parameter set to `TRUE`, the local temporary disk on compute instance is encrypted with Microsoft managed keys. Customer managed key encryption isn't supported for OS and temp disk.

**Serverless compute**
The OS disk for each compute node stored in Azure Storage is encrypted with Microsoft-managed keys. This compute target is ephemeral, and clusters are typically scaled down when no jobs are queued. The underlying virtual machine is de-provisioned, and the OS disk is deleted. Azure Disk Encryption isn't supported for the OS disk. 

Each virtual machine also has a local temporary disk for OS operations. If you want, you can use the disk to stage training data. This environment is short-lived (only during your job) and encryption support is limited to system-managed keys only.

## Next steps

* [What is Azure Key Vault](../../key-vault/general/overview.md)?
* [Azure AI services Customer-Managed Key Request Form](https://aka.ms/cogsvc-cmk)
