---
title: Security considerations for Azure role assignment conditions in Azure Storage (preview)
titleSuffix: Azure Storage
description: Security considerations for Azure role assignment conditions and Azure attribute-based access control (Azure ABAC).
services: storage
author: santoshc

ms.service: storage
ms.topic: conceptual
ms.date: 05/06/2021
ms.author: santoshc
ms.reviewer: jiacfan
ms.subservice: common
---

# Security considerations for Azure role assignment conditions in Azure Storage (preview)

> [!IMPORTANT]
> Azure ABAC and Azure role assignment conditions are currently in preview.
> This preview version is provided without a service level agreement, and it is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To fully secure resources by using [Azure attribute-based access control (Azure ABAC)](storage-auth-abac.md), you must also protect the [attributes](storage-auth-abac-attributes.md) used in the [Azure role assignment conditions](../../role-based-access-control/conditions-format.md). This requires that you secure all the permissions or actions that can be used to modify the attributes used in role assignment conditions. For example, if you author a condition for a storage account based on a path, then you should keep in mind that access could be compromised if the principal has an unrestricted permission to rename a file path.

This article describes security considerations that you should factor into your role assignment conditions.

## Use of other authorization mechanisms 

Azure ABAC is implemented as conditions on role assignments. Since these conditions are evaluated only when using [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) with Azure Active Directory (Azure AD), they can be bypassed if you enable access by using alternate authorization methods. For example, conditions aren't evaluated when using Shared Key or shared access signature authorization. Similarly, conditions aren't evaluated when access is granted to a file or a folder by using [access control lists (ACLs)](../blobs/data-lake-storage-access-control.md) in accounts that have the hierarchical namespace feature enabled on them. 

You can prevent this by [disabling shared key authorization](shared-key-authorization-prevent.md) for your storage account.

## Securing storage attributes used in conditions

### Blob path

When using blob path as a *@Resource* attribute for a condition, you should also prevent users from renaming a blob to get access to a file when using accounts that have a hierarchical namespace. For example, if you want to author a condition based on blob path, you should also restrict the user's access to the following actions:

| Action | Description |
| :--- | :--- |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action` | This allows customers to rename a file using the Path Create API. |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` | This allows access to various file system and path operations. |

### Blob index tags

[Blob index tags](../blobs/storage-manage-find-blobs.md) are used as free-form attributes for conditions in storage. If you author any access conditions by using these tags, you must also protect the tags themselves. Specifically, the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` DataAction allows users to modify the tags on a storage object. A security principal's access to this action must also be suitably constrained to prevent them from modifying a tag key or value to gain access to a stored object that they'd otherwise be unable to access.

In addition, if blob index tags are used in conditions, data can be periodically vulnerable if the data and the associated index tags are updated in separate operations. To secure data from the instant that it's written to storage, the conditions for blob write operations should require the appropriate value for the associated index tags for the blob to be set to appropriate values in the same update operation.

#### Tags on copied blobs

Blob index tags aren't copied from a source blob to the destination by default when the [Copy Blob](/rest/api/storageservices/Copy-Blob) API or any of its variants is used. To preserve the scope of access for blob upon copy, its tags must also be explicitly copied as well.

#### Tags on snapshots

Update of tags on blob snapshots aren't supported in preview. This implies that you must update the tags on a blob before taking the snapshot. Any update to tags will apply only to the base blob. The tags on the snapshot will continue to have the previous value.

If a tag on the base blob is modified after a snapshot is taken, and if there's a condition that uses that tag, then the scope of access for the base blob might be different than that for the blob snapshot.

#### Tags on blob versions

Blob index tags aren't copied when a blob version is created through the [Put Blob](/rest/api/storageservices/put-blob), [Put Block List](/rest/api/storageservices/put-block-list) or [Copy Blob](/rest/api/storageservices/Copy-Blob) APIs. You can specify tags through the header for these APIs.

You can modify tags on different versions of a blob, but these aren’t updated automatically when the tags on a base blob are modified. If you want to change the scope of access for a blob and all its versions using tags, you must update the tags on the base blob as well as all its versions.

#### Querying and filtering limitations for versions and snapshots

When using tags to query and filter blobs in a container, only the base blobs are included in the response. Blob versions or snapshots with the requested keys and values aren't included.

## Roles and permissions

If you’re using role assignment conditions for [Azure built-in roles](../../role-based-access-control/built-in-roles.md), you should carefully review all the permissions that the role grants to a principal.

### Inherited role assignments

Role assignments can be configured for a management group, subscription, resource group, storage account, or a container, and are inherited at each level in the stated order. Azure RBAC has an additive model, so the effective permissions are the sum of role assignments at each level. If a security principal has a permission assigned to them through multiple roles or a given role at multiple levels, then access for an operation using that permission is evaluated separately for each assigned role at every level.

Since conditions are implemented as conditions on role assignments, any unconditional role assignment can allow users to bypass the access restrictions intended by the condition policy. For example, if a security principal is assigned a role, such as *Storage Blob Data Contributor*, at both the subscription and storage account levels and the role assignment condition is only defined at the storage account level, then the principal will have unrestricted access to the account through the role assignment at the subscription level, and vice versa.

Therefore, conditions must be consistently applied at all levels of a resource hierarchy where security principals have been granted access to a resource.

## Other considerations

### Condition operations that write blobs

Many of the operations that write blobs require either the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` or the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` permission. Built-in roles, such as [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) and [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) grant both permissions to a security principal.

When you define a role assignment condition on these roles, you should use identical conditions on both these permissions to ensure consistent access restrictions for write operations.

### Behavior for Copy Blob and Copy Blob from URL

For the [Copy Blob](/rest/api/storageservices/Copy-Blob) and [Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url) operations, `@Request` conditions using blob path as attribute on the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` action and its suboperations are evaluated only for the destination blob.

For conditions on the source blob, `@Resource` conditions on the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read` action are evaluated.

### Behavior for Get Page Ranges

For the [Get Page Ranges](/rest/api/storageservices/get-page-ranges) operation, `@Resource` conditions using `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags` as an attribute on the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read` action and its suboperations are evaluated only for the destination blob.

Conditions don't apply for access to the blob specified by the `prevsnapshot` URI parameter in the API.

## See also

- [Authorize access to blobs using Azure role assignment conditions (preview)](storage-auth-abac.md)
- [Actions and attributes for Azure role assignment conditions in Azure Storage (preview)](storage-auth-abac-attributes.md)
- [What is Azure attribute-based access control (Azure ABAC)? (preview)](../../role-based-access-control/conditions-overview.md)

