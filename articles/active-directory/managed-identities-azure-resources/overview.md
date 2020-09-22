---
title: Managed identities for Azure resources
description: An overview of the managed identities for Azure resources.
services: active-directory
documentationcenter:
author: barclayn
manager: daveba
editor:
ms.assetid: 0232041d-b8f5-4bd2-8d11-27999ad69370
ms.service: active-directory
ms.subservice: msi
ms.devlang:
ms.topic: overview
ms.custom: mvc
ms.date: 09/22/2020
ms.author: barclayn

#As a developer, I'd like to securely manage the credentials that my application uses for authenticating to cloud services without having the credentials in my code or checked into source control.
ms.collection: M365-identity-device-management
---

# What are managed identities for Azure resources?

A common challenge for developers is the management of credentials. Since many projects involve multiple services working together your code needs access to backend services and that generally means that it needs to authenticate to them. We want to make sure that we are handling credential information in the most secure manner possible so we want to avoid storing any credential information in code, checking it into source control or perhaps even sharing it with our developers. [Azure Key Vault](../../key-vault/general/overview.md) helps achieve this by providing a secure storage for secrets, certificates, and keys but how does your code authenticate to Key Vault?

Managed identities for Azure resources is a feature of Azure Active Directory (Azure AD) that solves this problem. Managed identities provides Azure services with an automatically managed identity in Azure AD. Here are some of the benefits of using Managed identities:

- You don't need to store credential information in your code.
- You can use managed identities to authenticate to any Azure service that supports Azure AD authentication including Azure Key Vault.
- You don't need to worry about changing passwords because credential rotation is handled automatically by Azure. 
- Managed identities can be used without any additional cost.

> [!NOTE]
> Managed identities for Azure resources is the new name for the service formerly known as Managed Service Identity (MSI).

## Managed identity types

There are two types of managed identities:

- **System-assigned** Some Azure services allow you to enable a managed identity directly on a service instance. When you enable the managed identity option as part of the configuration of a service instance Azure creates an identity in your Azure AD. After the identity is created, the credentials are provisioned onto the service instance where you enabled it. The system assigned managed identity has its life cycle tied directly to the service instance that triggered its creation. If the instance is deleted, Azure automatically removes the system-assigned managed identity information from Azure AD.
- **User-assigned** You may also create a managed identity as a standalone Azure resource. You can [create a user-assigned managed identity](how-to-manage-ua-identity-portal.md) and assign it to one or more instances of an Azure service. In the case of user-assigned managed identities, the identity is managed separately from the resources that use it.

The table below shows you the differences between the two managed identities types

|  Property    | System-assigned managed identity | User-assigned managed identity |
|------|----------------------------------|--------------------------------|
| Creation |  Created as part of an Azure resource (for example, an Azure virtual machine or Azure App Service) | Created as a stand-alone Azure resource |
| Life cycle | Shared life cycle with the Azure resource that the managed identity is created with. <br/> When the parent resource is deleted, the managed identity is deleted as well. | Independent life cycle. <br/> Must be explicitly deleted. |
| Sharing across Azure resources | Cannot be shared. <br/> It can only be associated with a single Azure resource. | Can be shared <br/> The same user-assigned managed identity can be associated with more than one Azure resource. |
| Common use cases | Workloads that are contained within a single Azure resource <br/> Workloads for which you need independent identities. <br/> For example, an application that runs on a single virtual machine | Workloads that run on multiple resources and which can share a single identity. <br/> Workloads that need pre-authorization to a secure resource as part of a provisioning flow. <br/> Workloads where resources are recycled frequently, but permissions should stay consistent. <br/> For example, a workload where multiple virtual machines need to access the same resource |

>[!IMPORTANT]
>Regardless of the type of identity chosen a managed identity is a service principal of a special type that may only be used with Azure resources. When the managed identity is deleted, the corresponding service principal is automatically removed.

## How can I use managed identities for Azure resources?

To learn how to use managed identities to access different Azure resources, try these tutorials.

> [!NOTE]
> Check out the [Implementing Managed Identities for Microsoft Azure Resources](https://www.pluralsight.com/courses/microsoft-azure-resources-managed-identities-implementing) course for more information about managed identities, including detailed video walkthroughs of several supported scenarios.

Learn how to use a managed identity with a Windows VM:

* [Access Azure Data Lake Store](tutorial-windows-vm-access-datalake.md)
* [Access Azure Resource Manager](tutorial-windows-vm-access-arm.md)
* [Access Azure SQL](tutorial-windows-vm-access-sql.md)
* [Access Azure Storage by using an access key](tutorial-vm-windows-access-storage.md)
* [Access Azure Storage by using shared access signatures](tutorial-windows-vm-access-storage-sas.md)
* [Access a non-Azure AD resource with Azure Key Vault](tutorial-windows-vm-access-nonaad.md)

Learn how to use a managed identity with a Linux VM:

* [Access Azure Container Registry](../../container-registry/container-registry-authentication-managed-identity.md)
* [Access Azure Data Lake Store](tutorial-linux-vm-access-datalake.md)
* [Access Azure Resource Manager](tutorial-linux-vm-access-arm.md)
* [Access Azure Storage by using an access key](tutorial-linux-vm-access-storage.md)
* [Access Azure Storage by using shared access signatures](tutorial-linux-vm-access-storage-sas.md)
* [Access a non-Azure AD resource with Azure Key Vault](tutorial-linux-vm-access-nonaad.md)

Learn how to use a managed identity with other Azure services:

* [Azure App Service](../../app-service/overview-managed-identity.md)
* [Azure API Management](../../api-management/api-management-howto-use-managed-service-identity.md)
* [Azure Container Instances](../../container-instances/container-instances-managed-identity.md)
* [Azure Container Registry Tasks](../../container-registry/container-registry-tasks-authentication-managed-identity.md)
* [Azure Event Hubs](../../event-hubs/authenticate-managed-identity.md)
* [Azure Functions](../../app-service/overview-managed-identity.md)
* [Azure Kubernetes Service](../../aks/use-managed-identity.md)
* [Azure Logic Apps](../../logic-apps/create-managed-service-identity.md)
* [Azure Service Bus](../../service-bus-messaging/service-bus-managed-service-identity.md)
* [Azure Data Factory](../../data-factory/data-factory-service-identity.md)


## What Azure services support the feature?<a name="which-azure-services-support-managed-identity"></a>

Managed identities for Azure resources can be used to authenticate to services that support Azure AD authentication. For a list of Azure services that support the managed identities for Azure resources feature, see [Services that support managed identities for Azure resources](./services-support-managed-identities.md).

## Next steps

Get started with the managed identities for Azure resources feature with the following quickstarts:

* [Use a Windows VM system-assigned managed identity to access Resource Manager](tutorial-windows-vm-access-arm.md)
* [Use a Linux VM system-assigned managed identity to access Resource Manager](tutorial-linux-vm-access-arm.md)