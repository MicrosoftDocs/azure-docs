---
title: Security considerations for Azure role assignment conditions in Azure Blob Storage
titleSuffix: Azure Storage
description: Security considerations for Azure role assignment conditions and Azure attribute-based access control (Azure ABAC).
author: akashdubey-ms

ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 05/09/2023
ms.author: akashdubey
ms.reviewer: nachakra
---

# Security considerations for Azure role assignment conditions in Azure Blob Storage

To fully secure resources using [Azure attribute-based access control (Azure ABAC)](storage-auth-abac.md), you must also protect the [attributes](storage-auth-abac-attributes.md) used in the [Azure role assignment conditions](../../role-based-access-control/conditions-format.md). For instance, if your condition is based on a file path, then you should beware that access can be compromised if the principal has an unrestricted permission to rename a file path.

This article describes security considerations that you should factor into your role assignment conditions.

[!INCLUDE [storage-abac-preview](../../../includes/storage-abac-preview.md)]

## Use of other authorization mechanisms

Role assignment conditions are only evaluated when using Azure RBAC for authorization. These conditions can be bypassed if you allow access using alternate authorization methods:
- [Shared Key](/rest/api/storageservices/authorize-with-shared-key) authorization
- [Account shared access signature](/rest/api/storageservices/create-account-sas) (SAS)
- [Service SAS](/rest/api/storageservices/create-service-sas).

Similarly, conditions aren't evaluated when access is granted using [access control lists (ACLs)](data-lake-storage-access-control.md) in storage accounts with a [hierarchical namespace](data-lake-storage-namespace.md) (HNS).

You can prevent shared key, account-level SAS, and service-level SAS authorization by [disabling shared key authorization](../common/shared-key-authorization-prevent.md) for your storage account. Since user delegation SAS depends on Azure RBAC, role-assignment conditions are evaluated when using this method of authorization.

## Securing storage attributes used in conditions

### Blob path

When using blob path as a *@Resource* attribute for a condition, you should also prevent users from renaming a blob to get access to a file when using accounts that have a hierarchical namespace. For example, if you want to author a condition based on blob path, you should also restrict the user's access to the following actions:

| Action | Description |
| :--- | :--- |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action` | This action allows customers to rename a file using the Path Create API. |
| `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` | This action allows access to various file system and path operations. |

### Blob index tags

[Blob index tags](storage-manage-find-blobs.md) are used as free-form attributes for conditions in storage. If you author any access conditions by using these tags, you must also protect the tags themselves. Specifically, the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` DataAction allows users to modify the tags on a storage object. You can restrict this action to prevent users from manipulating a tag key or value to gain access to unauthorized objects.

In addition, if blob index tags are used in conditions, data may be vulnerable if the data and the associated index tags are updated in separate operations. You can use `@Request` conditions on blob write operations to require that index tags be set in the same update operation. This approach can help secure data from the instant it's written to storage.

#### Tags on copied blobs

By default, blob index tags aren't copied from a source blob to the destination when you use [Copy Blob](/rest/api/storageservices/Copy-Blob) API or any of its variants. To preserve the scope of access for blob upon copy, you should copy the tags as well.

#### Tags on snapshots

Tags on blob snapshots can't be modified. Therefore, you must update the tags on a blob before taking the snapshot. If you modify the tags on a base blob, the tags on its snapshot continue to have their previous value.

If a tag on a base blob is modified after a snapshot is taken, the scope of access may be different for the base blob and the snapshot.

#### Tags on blob versions

Blob index tags aren't copied when a blob version is created through the [Put Blob](/rest/api/storageservices/put-blob), [Put Block List](/rest/api/storageservices/put-block-list) or [Copy Blob](/rest/api/storageservices/Copy-Blob) APIs. You can specify tags through the header for these APIs.

Tags can be set individually on a current base blob and on each blob version. When you modify tags on a base blob, the tags on previous versions aren't updated. If you want to change the scope of access for a blob and all its versions using tags, you must update the tags on each version.

#### Querying and filtering limitations for versions and snapshots

When you use tags to query and filter blobs in a container, only the base blobs are included in the response. Blob versions or snapshots with the requested keys and values aren't included.

## Roles and permissions

If you're using role assignment conditions for [Azure built-in roles](../../role-based-access-control/built-in-roles.md), you should carefully review all the permissions that the role grants to a principal.

### Inherited role assignments

Role assignments can be configured for a management group, subscription, resource group, storage account, or a container, and are inherited at each level in the stated order. Azure RBAC has an additive model, so the effective permissions are the sum of role assignments at each level. If a principal has the same permission assigned to them through multiple role assignments, then access for an operation using that permission is evaluated separately for each assignment at every level.

Since conditions are implemented as conditions on role assignments, any unconditional role assignment can allow users to bypass the condition. Let's say you assign the *Storage Blob Data Contributor* role to a user for a storage account and on a subscription, but add a condition only to the assignment for the storage account. The result will be that the user has unrestricted access to the storage account through the role assignment at the subscription level.

Therefore, you should apply conditions consistently for all role assignments across a resource hierarchy.

## Other considerations

### Condition operations that write blobs

Many operations that write blobs require either the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` or the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` permission. Built-in roles, such as [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) and [Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor) grant both permissions to a security principal.

When you define a role assignment condition on these roles, you should use identical conditions on both these permissions to ensure consistent access restrictions for write operations.

### Behavior for Copy Blob and Copy Blob from URL

For the [Copy Blob](/rest/api/storageservices/Copy-Blob) and [Copy Blob From URL](/rest/api/storageservices/copy-blob-from-url) operations, `@Request` conditions using blob path as attribute on the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` action and its suboperations are evaluated only for the destination blob.

For conditions on the source blob, `@Resource` conditions on the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read` action are evaluated.

## See also

- [Authorize access to blobs using Azure role assignment conditions](storage-auth-abac.md)
- [Actions and attributes for Azure role assignment conditions for Azure Blob Storage](storage-auth-abac-attributes.md)
- [What is Azure attribute-based access control (Azure ABAC)?](../../role-based-access-control/conditions-overview.md)
