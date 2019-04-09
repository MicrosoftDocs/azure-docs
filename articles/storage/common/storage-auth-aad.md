---
title: Authenticate access to Azure blobs and queues using Azure Active Directory (Preview) | Microsoft Docs
description: Authenticate access to Azure blobs and queues using Azure Active Directory (Preview).
services: storage
author: tamram

ms.service: storage
ms.topic: article
ms.date: 02/13/2019
ms.author: tamram
ms.subservice: common
---

# Authenticate access to Azure blobs and queues using Azure Active Directory (Preview)

Azure Storage supports authentication and authorization with Azure Active Directory (AD) for the Blob and Queue services. With Azure AD, you can use role-based access control (RBAC) to grant access to users, groups, or application service principals. 

Authenticating users or applications using Azure AD credentials provides superior security and ease of use over other means of authorization. While you can continue to use Shared Key authorization with your applications, using Azure AD circumvents the need to store your account access key with your code. You can also continue to use shared access signatures (SAS) to grant fine-grained access to resources in your storage account, but Azure AD offers similar capabilities without the need to manage SAS tokens or worry about revoking a compromised SAS. Microsoft recommends using Azure AD authentication for your Azure Storage applications when possible.

[!INCLUDE [storage-auth-aad-note-include](../../../includes/storage-auth-aad-note-include.md)]

## About the preview

Keep in mind the following points about the preview:

- Azure AD integration is available for the Blob and Queue services only in the preview.
- Azure AD integration is available for GPv1, GPv2, and Blob storage accounts in all public regions. 
- Only storage accounts created with the Resource Manager deployment model are supported. 
- Support for caller identity information in Azure Storage Analytics logging is coming soon.
- Azure AD authorization of access to resources in standard storage accounts is currently supported. Authorization of access to page blobs in premium storage accounts will be supported soon.
- Azure Storage supports both built-in and custom RBAC roles. You can assign roles scoped to the subscription, the resource group, the storage account, or an individual container or queue.
- The Azure Storage client libraries that currently support Azure AD integration include:
    - [.NET](https://www.nuget.org/packages/WindowsAzure.Storage)
    - [Java](https://mvnrepository.com/artifact/com.microsoft.azure/azure-storage)
    - Python
        - [Blob, Queue and Files](https://github.com/Azure/azure-storage-python)
    - [Node.js](https://www.npmjs.com/package/azure-storage)
    - [JavaScript](https://aka.ms/downloadazurestoragejs)

## Overview of Azure AD for Storage

The first step in using Azure AD integration with Azure Storage is to assign RBAC roles for storage data to your service principal (a user, group, or application service principal) or managed identities for Azure resources. RBAC roles encompass common sets of permissions for containers and queues. To learn more about assigning RBAC roles for Azure Storage, see [Manage access rights to storage data with RBAC (Preview)](storage-auth-aad-rbac.md).

To use Azure AD to authorize access to storage resources in your applications, you need to request an OAuth 2.0 access token from your code. To learn how to request an access token and use it to authorize requests to Azure Storage, see [Authenticate with Azure AD from an Azure Storage application (Preview)](storage-auth-aad-app.md). If you are using a managed identity, see [Authenticate access to blobs and queues with Azure managed identities for Azure Resources (Preview)](storage-auth-aad-msi.md).

Azure CLI and PowerShell now support logging in with an Azure AD identity. After you log in with an Azure AD identity, your session runs under that identity. To learn more, see [Use an Azure AD identity to access Azure Storage with CLI or PowerShell (Preview)](storage-auth-aad-script.md).

## RBAC roles for blobs and queues

Azure Active Directory (Azure AD) authorizes access rights to secured resources through [role-based access control (RBAC)](../../role-based-access-control/overview.md). Azure Storage defines a set of built-in RBAC roles that encompass common sets of permissions used to access containers or queues. 

When an RBAC role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of the subscription, the resource group, the storage account, or an individual container or queue. An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). 

[!INCLUDE [storage-auth-rbac-roles-include](../../../includes/storage-auth-rbac-roles-include.md)]

To learn how to assign a built-in role in the Azure portal, see [Grant access to Azure containers and queues with RBAC in the Azure portal (preview)](storage-auth-aad-rbac.md).

### Access permissions granted by RBAC roles 

The following table summarizes the access rights granted by the built-in roles for different levels of scope:

|Scope|Blob Data Owner|Blob Data Contributor|Blob Data Reader|Queue Data Contributor|Queue Data Reader|
|---|---|---|---|---|---|
|Subscription level|Read/write access and POSIX access control management to all containers and blobs in the subscription|Read/write access to all containers and blobs in the subscription| Read access to all containers and blobs in the subscription|Read/write access to all queues in the subscription|Read access to all queues in the subscription|
|Resource group level|Read/write access and POSIX access control management to all containers and blobs in the resource group|Read/write access to all containers and blobs in the resource group|Read access to all containers and blobs in the resource group|Read/write access to all queues in the resource group|Read access to all queues in the resource group|
|Storage account level|Read/write access and POSIX access control management to all containers and blobs in the storage account|Read/write access to all containers and blobs in the storage account|Read access to all containers and blobs in the storage account|Read/write access to all queues in the storage account|Read access to all queues in the storage account|
|Container/queue level|Read/write access and POSIX access control management to the specified container and its blobs.|Read/write access to the specified container and its blobs|Read access to the specified container and its blobs|Read/write access to the specified queue|Read access to the specified queue|

For details on the permissions required to call Azure Storage operations, see [Permissions for calling REST operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-rest-operations).

## Next steps

For additional information about Azure AD integration for Azure Blobs and Queues, see the Azure Storage team blog post, [Announcing the Preview of Azure AD Authentication for Azure Storage](https://azure.microsoft.com/blog/announcing-the-preview-of-aad-authentication-for-storage/).
