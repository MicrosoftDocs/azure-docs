---
title: Authorize access to blobs and queues using Active Directory
titleSuffix: Azure Storage
description: Authorize access to Azure blobs and queues using Azure Active Directory.
services: storage
author: tamram

ms.service: storage
ms.topic: conceptual
ms.date: 2/23/2020
ms.author: tamram
ms.reviewer: cbrooks
ms.subservice: common
---

# Authorize access to blobs and queues using Azure Active Directory

Azure Storage supports using Azure Active Directory (Azure AD) to authorize requests to Blob and Queue storage. With Azure AD, you can use role-based access control (RBAC) to grant permissions to a security principal, which may be a user, group, or application service principal. The security principal is authenticated by Azure AD to return an OAuth 2.0 token. The token can then be used to authorize a request against Blob or Queue storage.

Authorizing requests against Azure Storage with Azure AD provides superior security and ease of use over Shared Key authorization. Microsoft recommends using Azure AD authorization with your blob and queue applications when possible to minimize potential security vulnerabilities inherent in Shared Key.

Authorization with Azure AD is available for all general-purpose and Blob storage accounts in all public regions and national clouds. Only storage accounts created with the Azure Resource Manager deployment model support Azure AD authorization.

Blob storage additionally supports creating shared access signatures (SAS) that are signed with Azure AD credentials. For more information, see [Grant limited access to data with shared access signatures](storage-sas-overview.md).

Azure Files supports authorization with AD (preview) or Azure AD DS (GA) over SMB for domain-joined VMs only. To learn about using AD (preview) or Azure AD DS (GA) over SMB for Azure Files, see [Overview of Azure Files identity-based authentication support for SMB access](../files/storage-files-active-directory-overview.md).

Authorization with Azure AD is not supported for Azure Table storage. Use Shared Key to authorize requests to Table storage.

## Overview of Azure AD for blobs and queues

When a security principal (a user, group, or application) attempts to access a blob or queue resource, the request must be authorized, unless it is a blob available for anonymous access. With Azure AD, access to a resource is a two-step process. First, the security principal's identity is authenticated and an OAuth 2.0 token is returned. Next, the token is passed as part of a request to the Blob or Queue service and used by the service to authorize access to the specified resource.

The authentication step requires that an application request an OAuth 2.0 access token at runtime. If an application is running from within an Azure entity such as an Azure VM, a virtual machine scale set, or an Azure Functions app, it can use a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) to access blobs or queues. To learn how to authorize requests made by a managed identity to the Azure Blob or Queue service, see [Authorize access to blobs and queues with Azure Active Directory and managed identities for Azure Resources](storage-auth-aad-msi.md).

The authorization step requires that one or more RBAC roles be assigned to the security principal. Azure Storage provides RBAC roles that encompass common sets of permissions for blob and queue data. The roles that are assigned to a security principal determine the permissions that the principal will have. To learn more about assigning RBAC roles for Azure Storage, see [Manage access rights to storage data with RBAC](storage-auth-aad-rbac.md).

Native applications and web applications that make requests to the Azure Blob or Queue service can also authorize access with Azure AD. To learn how to request an access token and use it to authorize requests for blob or queue data, see [Authorize access to Azure Storage with Azure AD from an Azure Storage application](storage-auth-aad-app.md).

## Assign RBAC roles for access rights

Azure Active Directory (Azure AD) authorizes access rights to secured resources through [role-based access control (RBAC)](../../role-based-access-control/overview.md). Azure Storage defines a set of built-in RBAC roles that encompass common sets of permissions used to access blob and queue data. You can also define custom roles for access to blob and queue data.

When an RBAC role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of the subscription, the resource group, the storage account, or an individual container or queue. An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

### Built-in RBAC roles for blobs and queues

[!INCLUDE [storage-auth-rbac-roles-include](../../../includes/storage-auth-rbac-roles-include.md)]

To learn how to assign a built-in RBAC role to a security principal, see one of the following articles:

- [Grant access to Azure blob and queue data with RBAC in the Azure portal](storage-auth-aad-rbac-portal.md)
- [Grant access to Azure blob and queue data with RBAC using Azure CLI](storage-auth-aad-rbac-cli.md)
- [Grant access to Azure blob and queue data with RBAC using PowerShell](storage-auth-aad-rbac-powershell.md)

For more information about how built-in roles are defined for Azure Storage, see [Understand role definitions](../../role-based-access-control/role-definitions.md#management-and-data-operations). For information about creating custom RBAC roles, see [Create custom roles for Azure Role-Based Access Control](../../role-based-access-control/custom-roles.md).

### Access permissions for data operations

For details on the permissions required to call specific Blob or Queue service operations, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations).

## Resource scope

[!INCLUDE [storage-auth-resource-scope-include](../../../includes/storage-auth-resource-scope-include.md)]

## Access data with an Azure AD account

Access to blob or queue data via the Azure portal, PowerShell, or Azure CLI can be authorized either by using the user's Azure AD account or by using the account access keys (Shared Key authorization).

### Data access from the Azure portal

The Azure portal can use either your Azure AD account or the account access keys to access blob and queue data in an Azure storage account. Which authorization scheme the Azure portal uses depends on the RBAC roles that are assigned to you.

When you attempt to access blob or queue data, the Azure portal first checks whether you have been assigned an RBAC role with **Microsoft.Storage/storageAccounts/listkeys/action**. If you have been assigned a role with this action, then the Azure portal uses the account key for accessing blob and queue data via Shared Key authorization. If you have not been assigned a role with this action, then the Azure portal attempts to access data using your Azure AD account.

To access blob or queue data from the Azure portal using your Azure AD account, you need permissions to access blob and queue data, and you also need permissions to navigate through the storage account resources in the Azure portal. The built-in roles provided by Azure Storage grant access to blob and queue resources, but they don't grant permissions to storage account resources. For this reason, access to the portal also requires the assignment of an Azure Resource Manager role such as the [Reader](../../role-based-access-control/built-in-roles.md#reader) role, scoped to the level of the storage account or higher. The **Reader** role grants the most restricted permissions, but another Azure Resource Manager role that grants access to storage account management resources is also acceptable. To learn more about how to assign permissions to users for data access in the Azure portal with an Azure AD account, see [Grant access to Azure blob and queue data with RBAC in the Azure portal](storage-auth-aad-rbac-portal.md).

The Azure portal indicates which authorization scheme is in use when you navigate to a container or queue. For more information about data access in the portal, see [Use the Azure portal to access blob or queue data](storage-access-blobs-queues-portal.md).

### Data access from PowerShell or Azure CLI

Azure CLI and PowerShell support signing in with Azure AD credentials. After you sign in, your session runs under those credentials. To learn more, see [Run Azure CLI or PowerShell commands with Azure AD credentials to access blob or queue data](authorize-active-directory-powershell.md).

## Next steps

- [Authorize access to blobs and queues with Azure Active Directory and managed identities for Azure Resources](storage-auth-aad-msi.md)
- [Authorize with Azure Active Directory from an application for access to blobs and queues](storage-auth-aad-app.md)
- [Azure Storage support for Azure Active Directory based access control generally available](https://azure.microsoft.com/blog/azure-storage-support-for-azure-ad-based-access-control-now-generally-available/)
