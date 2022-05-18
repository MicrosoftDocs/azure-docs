---
title: Managed identities for Azure resources
description: An overview of the managed identities for Azure resources.
services: active-directory
documentationcenter:
author: barclayn
manager: karenhoran
editor:
ms.assetid: 0232041d-b8f5-4bd2-8d11-27999ad69370
ms.service: active-directory
ms.subservice: msi
ms.devlang:
ms.topic: overview
ms.custom: mvc
ms.date: 01/25/2022
ms.author: barclayn
ms.collection: M365-identity-device-management

#Customer intent: As a developer, I'd like to securely manage the credentials that my application uses for authenticating to cloud services without having the credentials in my code or checked into source control.
---

# What are managed identities for Azure resources?

A common challenge for developers is the management of secrets and credentials used to secure communication between different components making up a solution. Managed identities eliminate the need for developers to manage credentials.

Managed identities provide an identity for applications to use when connecting to resources that support Azure Active Directory (Azure AD) authentication. Applications may use the managed identity to obtain Azure AD tokens. With [Azure Key Vault](../../key-vault/general/overview.md), developers can use managed identities to access resources. Key Vault stores credentials in a secure manner and gives access to storage accounts.

The following video shows how you can use managed identities:</br>

> [!VIDEO https://docs.microsoft.com/Shows/On-NET/Using-Azure-Managed-identities/player?format=ny]



Here are some of the benefits of using managed identities:

- You don't need to manage credentials. Credentials aren’t even accessible to you.
- You can use managed identities to authenticate to any resource that supports [Azure AD authentication](../authentication/overview-authentication.md), including your own applications.
- Managed identities can be used without any additional cost.

> [!NOTE]
> Managed identities for Azure resources is the new name for the service formerly known as Managed Service Identity (MSI).

## Managed identity types

There are two types of managed identities:

- **System-assigned**. Some Azure services allow you to enable a managed identity directly on a service instance. When you enable a system-assigned managed identity, an identity is created in Azure AD. The identity is tied to the lifecycle of that service instance. When the resource is deleted, Azure automatically deletes the identity for you. By design, only that Azure resource can use this identity to request tokens from Azure AD.
- **User-assigned**. You may also create a managed identity as a standalone Azure resource. You can [create a user-assigned managed identity](how-to-manage-ua-identity-portal.md) and assign it to one or more instances of an Azure service. For user-assigned managed identities, the identity is managed separately from the resources that use it. </br></br>


The following table shows the differences between the two types of managed identities:

|  Property    | System-assigned managed identity | User-assigned managed identity |
|------|----------------------------------|--------------------------------|
| Creation |  Created as part of an Azure resource (for example, Azure Virtual Machines or Azure App Service). | Created as a stand-alone Azure resource. |
| Life cycle | Shared life cycle with the Azure resource that the managed identity is created with. <br/> When the parent resource is deleted, the managed identity is deleted as well. | Independent life cycle. <br/> Must be explicitly deleted. |
| Sharing across Azure resources | Can’t be shared. <br/> It can only be associated with a single Azure resource. | Can be shared. <br/> The same user-assigned managed identity can be associated with more than one Azure resource. |
| Common use cases | Workloads that are contained within a single Azure resource. <br/> Workloads for which you need independent identities. <br/> For example, an application that runs on a single virtual machine. | Workloads that run on multiple resources and can share a single identity. <br/> Workloads that need pre-authorization to a secure resource, as part of a provisioning flow. <br/> Workloads where resources are recycled frequently, but permissions should stay consistent. <br/> For example, a workload where multiple virtual machines need to access the same resource. |

> [!IMPORTANT]
> Regardless of the type of identity chosen, a managed identity is a service principal of a special type that can only be used with Azure resources. When the managed identity is deleted, the corresponding service principal is automatically removed.

<br/>

## How can I use managed identities for Azure resources?

[![This flowchart shows examples of how a developer may use managed identities to get access to resources from their code without managing authentication information.](media/overview/when-use-managed-identities.png)](media/overview/when-use-managed-identities.png#lightbox)

## What Azure services support the feature?<a name="which-azure-services-support-managed-identity"></a>

Managed identities for Azure resources can be used to authenticate to services that support Azure AD authentication. For a list of supported Azure services, see [services that support managed identities for Azure resources](./services-support-managed-identities.md).

## Which operations can I perform using managed identities?

Resources that support system assigned managed identities allow you to:

- Enable or disable managed identities at the resource level.
- Use role-based access control (RBAC) to [grant permissions](howto-assign-access-portal.md).
- View the create, read, update, and delete (CRUD) operations in [Azure Activity logs](../../azure-monitor/essentials/activity-log.md).
- View sign in activity in Azure AD [sign in logs](../reports-monitoring/concept-sign-ins.md).

If you choose a user assigned managed identity instead:

- You can [create, read, update, and delete](how-to-manage-ua-identity-portal.md) the identities.
- You can use RBAC role assignments to [grant permissions](howto-assign-access-portal.md).
- User assigned managed identities can be used on more than one resource.
- CRUD operations are available for review in [Azure Activity logs](../../azure-monitor/essentials/activity-log.md).
- View sign in activity in Azure AD [sign in logs](../reports-monitoring/concept-sign-ins.md).

Operations on managed identities can be performed by using an Azure Resource Manager template, the Azure portal, Azure CLI, PowerShell, and REST APIs.

## Next steps

* [Use a Windows VM system-assigned managed identity to access Resource Manager](tutorial-windows-vm-access-arm.md)
* [Use a Linux VM system-assigned managed identity to access Resource Manager](tutorial-linux-vm-access-arm.md)
* [How to use managed identities for App Service and Azure Functions](../../app-service/overview-managed-identity.md)
* [How to use managed identities with Azure Container Instances](../../container-instances/container-instances-managed-identity.md)
* [Implementing managed identities for Microsoft Azure Resources](https://www.pluralsight.com/courses/microsoft-azure-resources-managed-identities-implementing)
