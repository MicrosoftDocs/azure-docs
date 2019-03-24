---
title: Authenticate access to Azure blobs and queues using Azure Active Directory | Microsoft Docs
description: Authenticate access to Azure blobs and queues using Azure Active Directory.
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 03/21/2019
ms.author: tamram
ms.subservice: common
---

# Authenticate access to Azure blobs and queues using Azure Active Directory

Azure Storage supports authentication and authorization with Azure Active Directory (AD) for the Blob and Queue services. With Azure AD, you can use role-based access control (RBAC) to grant access to users, groups, or application service principals. 

Authenticating users or applications using Azure AD credentials provides superior security and ease of use over other means of authorization. While you can continue to use Shared Key authorization with your applications, using Azure AD circumvents the need to store your account access key with your code. You can also continue to use shared access signatures (SAS) to grant fine-grained access to resources in your storage account, but Azure AD offers similar capabilities without the need to manage SAS tokens or worry about revoking a compromised SAS. Microsoft recommends using Azure AD authentication for your Azure Storage applications when possible.

Authentication and authorization with Azure AD credentials is available for all general-purpose v2, general-purpose v1, and Blob storage accounts in all public regions. Only storage accounts created with the Azure Resource Manager deployment model support Azure AD authorization.

[!INCLUDE [storage-auth-aad-note-include](../../../includes/storage-auth-aad-note-include.md)]

## Overview of Azure AD for blobs and queues

The first step in using Azure AD integration with Azure Storage is to assign RBAC roles for storage data to your service principal (a user, group, or application service principal) or managed identities for Azure resources. RBAC roles encompass common sets of permissions for containers and queues. To learn more about assigning RBAC roles for Azure Storage, see [Manage access rights to storage data with RBAC](storage-auth-aad-rbac.md).

To use Azure AD to authorize access to storage resources in your applications, you need to request an OAuth 2.0 access token from your code. To learn how to request an access token and use it to authorize requests to Azure Storage, see [Authenticate with Azure AD from an Azure Storage application](storage-auth-aad-app.md). If you are using a managed identity, see [Authenticate access to blobs and queues with Azure managed identities for Azure Resources](storage-auth-aad-msi.md).

Azure CLI and PowerShell now support logging in with an Azure AD identity. After you sign in with an Azure AD identity, your session runs under that identity. To learn more, see [Use an Azure AD identity to access Azure Storage with CLI or PowerShell](storage-auth-aad-script.md).

## RBAC roles for blobs and queues

Azure Active Directory (Azure AD) authorizes access rights to secured resources through [role-based access control (RBAC)](../../role-based-access-control/overview.md). Azure Storage defines a set of built-in RBAC roles that encompass common sets of permissions used to access containers or queues. 

When an RBAC role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of the subscription, the resource group, the storage account, or an individual container or queue. An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

[!INCLUDE [storage-auth-rbac-roles-include](../../../includes/storage-auth-rbac-roles-include.md)]

To learn how to assign a built-in role in the Azure portal, see [Grant access to Azure containers and queues with RBAC in the Azure portal](storage-auth-aad-rbac.md).

### Access permissions granted by RBAC roles 

For details on the permissions required to call Azure Storage operations, see [Permissions for calling REST operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-rest-operations).

## Next steps

- [Grant access to Azure containers and queues with RBAC in the Azure portal](storage-auth-aad-rbac.md)
- [Authenticate with Azure Active Directory from an application for access to blobs and queues](storage-auth-aad-app.md)
- [Authenticate access to blobs and queues with managed identities for Azure Resources](storage-auth-aad-msi.md)
- [Use an Azure AD identity to access Azure Storage with CLI or PowerShell](storage-auth-aad-script.md)