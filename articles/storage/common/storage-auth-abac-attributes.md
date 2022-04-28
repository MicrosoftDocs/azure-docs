---
title: Actions and attributes for Azure role assignment conditions in Azure Storage (preview)
titleSuffix: Azure Storage
description: Supported actions and attributes for Azure role assignment conditions and Azure attribute-based access control (Azure ABAC) in Azure Storage. 
services: storage
author: santoshc

ms.service: storage
ms.topic: conceptual
ms.date: 04/05/2022
ms.author: santoshc
ms.reviewer: jiacfan
ms.subservice: common
---

# Actions and attributes for Azure role assignment conditions in Azure Storage (preview)

> [!IMPORTANT]
> Azure ABAC and Azure role assignment conditions are currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article describes the supported attribute dictionaries that can be used in conditions on Azure role assignments for each Azure Storage [DataAction](../../role-based-access-control/role-definitions.md#dataactions). For the list of Blob service operations that are affected by a specific permission or DataAction, see [Permissions for Blob service operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-blob-service-operations).

To understand the role assignment condition format, see [Azure role assignment condition format and syntax](../../role-based-access-control/conditions-format.md).

## Suboperations

Multiple Storage service operations can be associated with a single permission or DataAction. However, each of these operations that are associated with the same permission might support different parameters. *Suboperations* enable you to differentiate between service operations that require the same permission but support different set of attributes for conditions. Thus, by using a suboperation, you can specify one condition for access to a subset of operations that support a given parameter. Then, you can use another access condition for operations with the same action that doesn't support that parameter.

For example, the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` action is required for over a dozen different service operations. Some of these operations can accept blob index tags as request parameter, while others don't. For operations that accept blob index tags as a parameter, you can use blob index tags in a Request condition. However, if such a condition is defined on the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` action, all operations that don't accept tags as a request parameter cannot evaluate this condition, and will fail the authorization access check.

In this case, the optional suboperation `Blob.Write.WithTagHeaders` can be used to apply a condition to only those operations that support blob index tags as a request parameter.

Similarly, only select operations on the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` action can have support blob index tags as a precondition for access. This subset of operations is identified by the `Blob.Read.WithTagConditions` suboperation.

> [!NOTE]
> Blobs also support the ability to store arbitrary user-defined key-value metadata. Although metadata is similar to blob index tags, you must use blob index tags with conditions. For more information, see [Manage and find data on Azure Blob Storage with Blob Index (preview)](../blobs/storage-manage-find-blobs.md).

In this preview, storage accounts support the following suboperations:

> [!div class="mx-tableFixed"]
> | DataAction | Suboperation | Display name | Description |
> | :--- | :--- | :--- | :--- |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` | `Blob.Read.WithTagConditions` | Blob read operations that support conditions on tags | Includes REST operations Get Blob, Get Blob Metadata, Get Blob Properties, Get Block List, Get Page Ranges, Query Blob Contents. |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` <br/> `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` | `Blob.Write.WithTagHeaders` | Blob writes for content with optional tags | Includes REST operations Put Blob, Copy Blob, Copy Blob From URL and Put Block List. |

## Actions and suboperations

The following table lists the supported actions and suboperations for conditions in Azure Storage.

> [!div class="mx-tableFixed"]
> | Display name | Description | DataAction |
> | --- | --- | --- |
> | All read operations | All Blob read operations. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |
> | List blobs | List blobs operation. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`<br/>**Suboperation**<br/>`Blob.List` |
> | Read a blob | All blob read operations excluding list. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`<br/>**NOT Suboperation**<br/>`Blob.List` |
> | Read content from a blob with tag conditions  | Read blobs with tags. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`<br/>**Suboperation**<br/>`Blob.Read.WithTagConditions` |
> | Read blob index tags | DataAction for reading blob index tags. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read` |
> | Find blobs by tags | DataAction for finding blobs by index tags. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/filter/action` |
> | Write to a blob | DataAction for writing to blobs. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` |
> | Sets the access tier on a blob | REST operations: Set Blob Tier. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write`<br/>**Suboperation**<br/>`Blob.Write.Tier` |
> | Write to a blob with blob index tags | REST operations: Put Blob, Put Block List, Copy Blob and Copy Blob From URL. |`Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write`<br/>**Suboperation**<br/>`Blob.Write.WithTagHeaders` |
> | Create a blob or snapshot, or append data | DataAction for creating blobs. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` |
> | Write to a blob with blob index tags | REST operations: Put Blob, Put Block List, Copy Blob and Copy Blob From URL. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action`<br/>**Suboperation**<br/>`Blob.Write.WithTagHeaders` |
> | Write blob index tags | DataAction for writing blob index tags. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` |
> | Write Blob legal hold and immutability policy | DataAction for writing Blob legal hold and immutability policy. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/immutableStorage/runAsSuperUser/action` |
> | Delete a blob | DataAction for deleting blobs. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete` |
> | Delete a version of a blob | DataAction for deleting a version of a blob. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action` |
> | Permanently delete a blob overriding soft-delete | DataAction for permanently deleting a blob overriding soft-delete. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/permanentDelete/action` |
> | Modify permissions of a blob | DataAction for modifying permissions of a blob. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/modifyPermissions/action` |
> | Changes ownership of a blob | DataAction for changing ownership of a blob. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/manageOwnership/action` |
> | Rename file or directory | DataAction for renaming files or directories. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action` |
> | All data operations for accounts with hierarchical namespace enabled | DataAction for all data operations on storage accounts with hierarchical namespace enabled. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` |

## Attributes

The following table lists the descriptions for the supported attributes for conditions in Azure Storage.

> [!div class="mx-tableFixed"]
> | Display name | Description | Attribute | Type |
> | --- | --- | --- | --- |
> | Account name | Name of a storage account. | `@Resource[Microsoft.Storage/storageAccounts:name]` | String |
> | Blob index tags [Keys] | Index tags on a blob resource. Arbitrary user-defined key-value properties that you can store alongside a blob resource. Use when you want to check the key in blob index tags. | `@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags&$keys$&]` | StringList |
> | Blob index tags [Values in key] | Index tags on a blob resource. Arbitrary user-defined key-value properties that you can store alongside a blob resource. Use when you want to check both the key (case-sensitive) and value in blob index tags. | `@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:`*keyname*`<$key_case_sensitive$>` | String |
> | Blob path | Path of a virtual directory, blob, folder or file resource. Use when you want to check the blob name or folders in a blob path. | `@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path]` | String |
> | Blob prefix | Allowed prefix of blobs to be listed. | `@Request[Microsoft.Storage/storageAccounts/blobServices/containers/blobs:prefix]` | String |
> | Container name| Name of a storage container or file system. Use when you want to check the container name. | `@Resource[Microsoft.Storage/storageAccounts/blobServices/containers:name]` | String |
> | Encryption scope name | Name of the encryption scope used to encrypt data. Available only for storage accounts where hierarchical namespace is not enabled. | `@Resource[Microsoft.Storage/storageAccounts/encryptionScopes:name]` | String |
> | Is hierarchical namespace enabled | Indicates whether hierarchical namespace is enabled on a storage account. Available only at resource group or above scope. | `@Resource[Microsoft.Storage/storageAccounts:isHnsEnabled]` | Boolean |
> | Snapshot | Snapshot identifier for a blob snapshot. | `@Request[Microsoft.Storage/storageAccounts/blobServices/containers/blobs:snapshot]` | DateTime |
> | Version ID | Version ID of a version blob. Available only for storage accounts where hierarchical namespace is not enabled. | `@Request[Microsoft.Storage/storageAccounts/blobServices/containers/blobs:versionId]` | DateTime |

> [!NOTE]
> Attributes and values listed are considered case-insensitive, unless stated otherwise.

> [!NOTE]
> When specifying conditions for `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` attribute, the values shouldn't include the container name or a preceding '/' character. Use the path characters without any URL encoding.

> [!NOTE]
> Blob index tags are not supported for Data Lake Storage Gen2 storage accounts, which have a [hierarchical namespace](../blobs/data-lake-storage-namespace.md) (HNS). You should not author role-assignment conditions using index tags on storage accounts that have HNS enabled.

## Attributes available for each action

The following table lists which attributes you can use in your condition expressions depending on the action you target. If you select multiple actions for a single condition, there might be fewer attributes to choose from for your condition because the attributes must be available across the selected actions.


> [!div class="mx-tableFixed"]
> | Action | Attributes |
> | --- | --- |
> | All read operations | Account name<br/>Is hierarchical namespace enabled<br/>Container name |
> | List blobs | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob prefix |
> | Read a blob | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Encryption scope name<br/>Version ID<br/>Snapshot |
> | Read content from a blob with tag conditions | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Blob index tags [Values in key]<br/>Blob index tags [Keys]<br/>Encryption scope name<br/>Version ID<br/>Snapshot |
> | Read blob index tags | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Blob index tags [Values in key]<br/>Blob index tags [Keys]<br/>Version ID<br/>Snapshot |
> | Find blobs by tags | Account name<br/>Is hierarchical namespace enabled |
> | Write to a blob | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Encryption scope name |
> | Sets the access tier on a blob | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Encryption scope name<br/>Version ID<br/>Snapshot |
> Write to a blob with blob index tags | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Blob index tags [Values in key]<br/>Blob index tags [Keys]<br/>Encryption scope name |
> | Create a blob or snapshot, or append data | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Encryption scope name |
> | Write to a blob with blob index tags | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Blob index tags [Values in key]<br/>Blob index tags [Keys]<br/>Encryption scope name |
> | Write blob index tags | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Blob index tags [Values in key]<br/>Version ID<br/>Snapshot |
> | Write Blob legal hold and immutability policy | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path |
> | Delete a blob | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Version ID<br/>Snapshot |
> | Delete a version of a blob | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Version ID |
> | Permanently delete a blob overriding soft-delete | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Version ID<br/>Snapshot |
> | Modify permissions of a blob | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path |
> | Change ownership of a blob | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path |
> | Rename a file or a directory | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path |
> | All data operations for accounts with hierarchical namespace enabled | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path |

## See also

- [Example Azure role assignment conditions (preview)](storage-auth-abac-examples.md)
- [Azure role assignment condition format and syntax (preview)](../../role-based-access-control/conditions-format.md)
- [Troubleshoot Azure role assignment conditions (preview)](../../role-based-access-control/conditions-troubleshoot.md)
