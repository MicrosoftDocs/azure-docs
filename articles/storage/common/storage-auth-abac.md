---
title: Authorize access to blobs using Azure role assignment conditions (preview)
titleSuffix: Azure Storage
description: Authorize access to Azure blobs using Azure role assignment conditions and Azure attribute-based access control (Azure ABAC). Define conditions on role assignments using Storage attributes.
services: storage
author: santoshc

ms.service: storage
ms.topic: conceptual
ms.date: 05/06/2021
ms.author: santoshc
ms.reviewer: jiacfan
ms.subservice: common
---

# Authorize access to blobs using Azure role assignment conditions (preview)

> [!IMPORTANT]
> Azure ABAC and Azure role assignment conditions are currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Attribute-based access control (ABAC) is an authorization strategy that defines access levels based on attributes associated with security principals, resources, requests, and the environment. Azure ABAC builds on Azure role-based access control (Azure RBAC) by adding [conditions to Azure role assignments](../../role-based-access-control/conditions-overview.md) in the existing identity and access management (IAM) system. This preview includes support for role assignment conditions on Blobs and Data Lake Storage Gen2. It enables you to author role-assignment conditions based on resource and request attributes.

## Overview of conditions in Azure Storage

Azure Storage enables the [use of Azure Active Directory](authorize-data-access.md) (Azure AD) to authorize requests to Blob and Queue storage. Azure AD authorizes access rights to secured resources by using Azure RBAC. Azure Storage defines a set of Azure [built-in roles](../../role-based-access-control/built-in-roles.md#storage) that encompass common sets of permissions used to access blob and queue data. You can also define custom roles with select set of permissions. Azure Storage supports role assignments for storage accounts or blob containers.

However, in some cases you might need to enable finer-grained access to Storage resources or simplify the hundreds of role assignments for a storage resource. You can configure [conditions on role assignments](../../role-based-access-control/conditions-overview.md) for [DataActions](../../role-based-access-control/role-definitions.md#dataactions) to achieve these goals. You can use conditions with a [custom role](../../role-based-access-control/custom-roles.md) or select built-in roles. Note, conditions are not supported for management [Actions](../../role-based-access-control/role-definitions.md#actions) through the [Storage resource provider](/rest/api/storagerp).

Conditions in Azure Storage are supported for blobs. You can use conditions with accounts that have the [hierarchical namespace](../blobs/data-lake-storage-namespace.md) (HNS) feature enabled on them. Conditions are currently not supported for Files, Queues, and Tables.

## Supported attributes and operations

In this preview, you can add conditions to built-in roles or custom roles. Using custom roles allows you to grant only the essential permissions or data actions to your users. The built-in roles supported in this preview include [Storage Blob Data Reader](../../role-based-access-control/built-in-roles.md#storage-blob-data-reader), [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) and [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner).

If you're working with conditions based on [blob index tags](../blobs/storage-manage-find-blobs.md), you should use the *Storage Blob Data Owner* since permissions for tag operations are included in this role.

> [!NOTE]
> Blob index tags are not supported for Data Lake Storage Gen2 storage accounts, which use a hierarchical namespace. You should not author role-assignment conditions using index tags on storage accounts that have HNS enabled.

The [Azure role assignment condition format](../../role-based-access-control/conditions-format.md) allows use of `@Resource` or `@Request` attributes in the conditions. A `@Resource` attribute refers to an existing attribute of a storage resource that is being accessed, such as a storage account, a container, or a blob. A `@Request` attribute refers to an attribute included in a storage operation request.

For the full list of attributes supported for each DataAction, please see the [Actions and attributes for Azure role assignment conditions in Azure Storage (preview)](storage-auth-abac-attributes.md).

## See also

- [Security considerations for Azure role assignment conditions in Azure Storage (preview)](storage-auth-abac-security.md)
- [Actions and attributes for Azure role assignment conditions in Azure Storage (preview)](storage-auth-abac-attributes.md)
- [What is Azure attribute-based access control (Azure ABAC)? (preview)](../../role-based-access-control/conditions-overview.md)