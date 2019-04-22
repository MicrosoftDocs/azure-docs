---
title: Authenticate access to Azure blobs and queues using Azure Active Directory | Microsoft Docs
description: Authenticate access to Azure blobs and queues using Azure Active Directory.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 04/21/2019
ms.author: tamram
ms.subservice: common
---

# Authenticate access to Azure blobs and queues using Azure Active Directory

Azure Storage supports authentication and authorization with Azure Active Directory (AD) for the Blob and Queue services. With Azure AD, you can use role-based access control (RBAC) to grant access to users, groups, or application service principals. 

Authenticating users or applications using Azure AD credentials provides superior security and ease of use over other means of authorization. While you can continue to use Shared Key authorization with your applications, using Azure AD circumvents the need to store your account access key with your code. You can also continue to use shared access signatures (SAS) to grant fine-grained access to resources in your storage account, but Azure AD offers similar capabilities without the need to manage SAS tokens or worry about revoking a compromised SAS. Microsoft recommends using Azure AD authentication for your Azure Storage applications when possible.

Authentication and authorization with Azure AD credentials is available for all general-purpose and Blob storage accounts in all public regions. Only storage accounts created with the Azure Resource Manager deployment model support Azure AD authorization.

## Overview of Azure AD for blobs and queues

When a security principal (a user, group, or application) attempts to access a blob or queue resource, the request must be authorized, unless it is a blob available for anonymous access. With Azure AD, access to a resource is a two-step process. First, the security principal's identity is authenticated and an OAuth 2.0 token is returned. Next, the token is passed as part of a request to the Blob or Queue service and used by the service to authorize access to the specified resource.

The authentication step requires that one or more RBAC roles be assigned to to the security principal. Azure Storage provides RBAC roles that encompass common sets of permissions for blob and queue data. The roles that are assigned to a security principal determine the access that that principal will have. To learn more about assigning RBAC roles for Azure Storage, see [Manage access rights to storage data with RBAC](storage-auth-aad-rbac.md).

The authorization step requires that an application requests an OAuth 2.0 access token at runtime. If an application is running from within an Azure entity such as an Azure VM, a virtual machine scale set, or an Azure Functions app, it can use a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to access blobs or queues. To learn how to authorize requests made by a managed identity to the Azure Blob or Queue service, see [Authenticate access to blobs and queues with Azure Active Directory and managed identities for Azure Resources](storage-auth-aad-msi.md).

Native applications and web applications that make requests to the Azure Blob or Queue service can also authenticate with Azure AD. To learn how to request an access token and use it to authorize requests for blob or queue data, see [Authenticate with Azure AD from an Azure Storage application](storage-auth-aad-app.md).

## Assigning RBAC roles for access rights

Azure Active Directory (Azure AD) authorizes access rights to secured resources through [role-based access control (RBAC)](../../role-based-access-control/overview.md). Azure Storage defines a set of built-in RBAC roles that encompass common sets of permissions used to access blob and queue data. You can also define custom roles for access to blob and queue data.

When an RBAC role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of the subscription, the resource group, the storage account, or an individual container or queue. An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

### Built-in RBAC roles for blobs and queues

[!INCLUDE [storage-auth-rbac-roles-include](../../../includes/storage-auth-rbac-roles-include.md)]

To learn how to assign a built-in RBAC role to a security principal, see one of the following articles:

- [Grant access to Azure blob and queue data with RBAC in the Azure portal](storage-auth-aad-rbac-portal.md)
- [Grant access to Azure blob and queue data with RBAC using Azure CLI](storage-auth-aad-rbac-cli.md)
- [Grant access to Azure blob and queue data with RBAC using PowerShell](storage-auth-aad-rbac-powershell.md)

For more information about how built-in roles are defined for Azure Storage, see [Understand role definitions](../../role-based-access-control/role-definitions.md#management-and-data-operations-preview). For information about creating custom RBAC roles, see [Create custom roles for Azure Role-Based Access Control](../../role-based-access-control/custom-roles.md).

### Access permissions for data operations

For details on the permissions required to call specific Blob or Queue service operations, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations).

## Resource scope

[!INCLUDE [storage-auth-resource-scope-include](../../../includes/storage-auth-resource-scope-include.md)]

## Access data with an Azure AD account

Access to blob or queue data via the Azure portal, PowerShell, or Azure CLI can be authorized either by using the user's Azure AD account or by using the account access keys (Shared Key authentication).

### Data access from the Azure portal

The Azure portal can use either your Azure AD account or the account access keys to access blob and queue data in an Azure storage account. Which authorization scheme the Azure portal uses depends on the RBAC roles that are assigned to you.

When you attempt to access blob or queue data, the Azure portal first checks whether you have been assigned an RBAC role with **Microsoft.Storage/storageAccounts/listkeys/action**. If you have been assigned a role with this action, then the Azure portal uses the account key for accessing blob and queue data via Shared Key authorization. If you have not been assigned a role with this action, then the Azure portal attempts to access data using your Azure AD account.

To access blob or queue data from the Azure portal using your Azure AD account, both of the following statements must be true for you:

- You have been assigned the Azure Resource Manager [Reader](../../role-based-access-control/built-in-roles.md#reader) role, at a minimum, scoped to the level of the storage account or higher. The **Reader** role grants the most restricted permissions, but another Azure Resource Manager role that grants access to storage account management resources is also acceptable.
- You have been assigned either a built-in or custom RBAC role that provides access to blob or queue data.

The Azure portal indicates which scheme is in use when you navigate to a container or queue. For more information about data access in the portal, see [Use the Azure portal to access blob or queue data](storage-access-blobs-queues-portal.md).

To learn more about how to assign permissions to users for data access in the Azure portal with an Azure AD account, see [Grant access to Azure blob and queue data with RBAC in the Azure portal](storage-auth-aad-rbac-portal.md).

### Data access from PowerShell or Azure CLI

Azure CLI and PowerShell support signing in with Azure AD credentials. After you sign in, your session runs under those credentials. To learn more, see [Run Azure CLI or PowerShell commands with Azure AD credentials to access blob or queue data](storage-auth-aad-script.md).

## Azure AD authentication over SMB for Azure Files

Azure Files supports authentication with Azure AD over SMB for domain-joined VMs only (preview). To learn about using Azure AD over SMB for Azure Files,see [Overview of Azure Active Directory authentication over SMB for Azure Files (preview)](../files/storage-files-active-directory-overview.md).

## Next steps

- [Authenticate access to blobs and queues with Azure Active Directory and managed identities for Azure Resources](storage-auth-aad-msi.md)
- [Authenticate with Azure Active Directory from an application for access to blobs and queues](storage-auth-aad-app.md)
- [Azure Storage support for Azure Active Directory based access control generally available](https://azure.microsoft.com/blog/azure-storage-support-for-azure-ad-based-access-control-now-generally-available/)
