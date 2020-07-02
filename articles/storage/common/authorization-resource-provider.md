---
title: Use the Azure Storage resource provider to access management resources
description: The Azure Storage resource provider is a service that provides access to management resources for Azure Storage. You can use the Azure Storage resource provider to create, update, manage, and delete resources such as storage accounts, private endpoints, and account access keys.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 12/12/2019
ms.author: tamram
ms.reviewer: ozgun
ms.subservice: common
---

# Use the Azure Storage resource provider to access management resources

Azure Resource Manager is the deployment and management service for Azure. The Azure Storage resource provider is a service that is based on Azure Resource Manager and that provides access to management resources for Azure Storage. You can use the Azure Storage resource provider to create, update, manage, and delete resources such as storage accounts, private endpoints, and account access keys. For more information about Azure Resource Manager, see [Azure Resource Manager overview](/azure/azure-resource-manager/resource-group-overview).

You can use the Azure Storage resource provider to perform actions such as creating or deleting a storage account or getting a list of storage accounts in a subscription. To authorize requests against the Azure Storage resource provider, use Azure Active Directory (Azure AD). This article describes how to assign permissions to management resources, and points to examples that show how to make requests against the Azure Storage resource provider.

## Management resources versus data resources

Microsoft provides two REST APIs for working with Azure Storage resources. These APIs form the basis of all actions you can perform against Azure Storage. The Azure Storage REST API enables you to work with data in your storage account, including blob, queue, file, and table data. The Azure Storage resource provider REST API enables you to work with the storage account and related resources.

A request that reads or writes blob data requires different permissions than a request that performs a management operation. RBAC provides fine-grained control over permissions to both types of resources. When you assign an RBAC role to a security principal, make sure that you understand what permissions that principal will be granted. For a detailed reference that describes which actions are associated with each built-in RBAC role, see [Built-in roles for Azure resources](../../role-based-access-control/built-in-roles.md).

Azure Storage supports using Azure AD to authorize requests against Blob and Queue storage. For information about RBAC roles for blob and queue data operations, see [Authorize access to blobs and queues using Active Directory](storage-auth-aad.md).

## Assign management permissions with role-based access control (RBAC)

Every Azure subscription has an associated Azure Active Directory that manages users, groups, and applications. A user, group, or application is also referred to as a security principal in the context of the [Microsoft identity platform](/azure/active-directory/develop/). You can grant access to resources in a subscription to a security principal that is defined in the Active Directory by using role-based access control (RBAC).

When you assign an RBAC role to a security principal, you also indicate the scope at which the permissions granted by the role are in effect. For management operations, you can assign a role at the level of the subscription, the resource group, or the storage account. You can assign an RBAC role to a security principal by using the [Azure portal](https://portal.azure.com/), the [Azure CLI tools](../../cli-install-nodejs.md), [PowerShell](/powershell/azureps-cmdlets-docs), or the [Azure Storage resource provider REST API](/rest/api/storagerp).

For more information, see [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md) and [Classic subscription administrator roles, Azure RBAC roles, and Azure AD administrator roles](../../role-based-access-control/rbac-and-directory-admin-roles.md).

### Built-in roles for management operations

Azure provides built-in roles that grant permissions to call management operations. Azure Storage also provides built-in roles specifically for use with the Azure Storage resource provider.

Built-in roles that grant permissions to call storage management operations include the roles described in the following table:

|    RBAC role    |    Description    |    Includes access to account keys?    |
|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| **Owner** | Can manage all storage resources and access to resources.  | Yes, provides permissions to view and regenerate the storage account keys. |
| **Contributor**  | Can manage all storage resources, but cannot manage assign to resources. | Yes, provides permissions to view and regenerate the storage account keys. |
| **Reader** | Can view information about the storage account, but cannot view the account keys. | No. |
| **Storage Account Contributor** | Can manage the storage account, get information about the subscription's resource groups and resources, and create and manage subscription resource group deployments. | Yes, provides permissions to view and regenerate the storage account keys. |
| **User Access Administrator** | Can manage access to the storage account.   | Yes, permits a security principal to assign any permissions to themselves and others. |
| **Virtual Machine Contributor** | Can manage virtual machines, but not the storage account to which they are connected.   | Yes, provides permissions to view and regenerate the storage account keys. |

The third column in the table indicates whether the built-in role supports the **Microsoft.Storage/storageAccounts/listkeys/action**. This action grants permissions to read and regenerate the storage account keys. Permissions to access Azure Storage management resources do not also include permissions to access data. However, if a user has access to the account keys, then they can use the account keys to access Azure Storage data via Shared Key authorization.

### Custom roles for management operations

Azure also supports defining custom RBAC roles for access to management resources. For more information about custom roles, see [Custom roles for Azure resources](../../role-based-access-control/custom-roles.md).

## Code samples

For code examples that show how to authorize and call management operations from the Azure Storage management libraries, see the following samples:

- [.NET](https://github.com/Azure-Samples/storage-dotnet-resource-provider-getting-started)
- [Java](https://github.com/Azure-Samples/storage-java-manage-storage-accounts)
- [Node.js](https://github.com/Azure-Samples/storage-node-resource-provider-getting-started)
- [Python](https://github.com/Azure-Samples/storage-python-manage)

## Azure Resource Manager versus classic deployments

The Resource Manager and classic deployment models represent two different ways of deploying and managing your Azure solutions. Microsoft recommends using the Azure Resource Manager deployment model when you create a new storage account. If possible, Microsoft also recommends that you recreate existing classic storage accounts with the Resource Manager model. Although you can create a storage account using the classic deployment model, the classic model is less flexible and will eventually be deprecated.

For more information about Azure deployment models, see [Resource Manager and classic deployment](../../azure-resource-manager/management/deployment-models.md).

## Next steps

- [Azure Resource Manager overview](/azure/azure-resource-manager/resource-group-overview)
- [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md)
- [Scalability targets for the Azure Storage resource provider](scalability-targets-resource-provider.md)
