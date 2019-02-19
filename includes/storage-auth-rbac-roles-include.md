---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: storage
ms.topic: "include"
ms.date: 02/19/2019
ms.author: tamram
ms.custom: "include file"
---

Azure Active Directory (Azure AD) authorizes access rights to secured resources through [role-based access control (RBAC)](../articles/role-based-access-control/overview.md). Azure Storage defines a set of built-in RBAC roles that encompass common sets of permissions used to access containers or queues. 

When an RBAC role is assigned to an Azure AD security principal, that security principal is granted access to those resources, according to the specified scope. Access can be scoped to the level of the subscription, the resource group, the storage account, or an individual container or queue. An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../articles/active-directory/managed-identities-azure-resources/overview.md). For an overview of identity in Azure AD, see [Understand Azure identity solutions](../articles/active-directory/understand-azure-identity-solutions.md).

Azure Storage provides the following built-in RBAC roles for access to storage resources:

- [Storage Blob Data Owner (Preview)](../articles/role-based-access-control/built-in-roles.md#storage-blob-data-owner-preview): Use to set ownership and manage POSIX access control for Azure Data Lake Storage Gen2 (preview). For more information, see [Access control in Azure Data Lake Storage Gen2](../blobs/data-lake-storage-access-control.md).
- [Storage Blob Data Contributor (Preview)](../articles/role-based-access-control/built-in-roles.md#storage-blob-data-contributor-preview): Use to grant read/write/delete permissions to Blob storage resources.
- [Storage Blob Data Reader (Preview)](../articles/role-based-access-control/built-in-roles.md#storage-blob-data-reader-preview): Use to grant read-only permissions to Blob storage resources.
- [Storage Queue Data Contributor (Preview)](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-contributor-preview): Use to grant read/write/delete permissions to Azure queues.
- [Storage Queue Data Reader (Preview)](../articles/role-based-access-control/built-in-roles.md#storage-queue-data-reader-preview): Use to grant read-only permissions to Azure queues.

For more information about how built-in roles are defined for Azure Storage, see [Understand role definitions](../articles/role-based-access-control/role-definitions#management-and-data-operations-preview.md).

Azure Storage also supports custom RBAC roles. For more information, see [Create custom roles for Azure Role-Based Access Control](../articles/role-based-access-control/custom-roles.md). 
