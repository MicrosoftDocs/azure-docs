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
> | Display name | DataAction | Suboperation |
> | :--- | :--- | :--- |
> | [List blobs](#list-blobs) | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` | NOT `Blob.List` |
> | [Read a blob](#read-a-blob) | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` | `Blob.List` |
> | [Read content from a blob with tag conditions](#read-content-from-a-blob-with-tag-conditions) | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` | `Blob.Read.WithTagConditions` |
> | [Sets the access tier on a blob](#sets-the-access-tier-on-a-blob) | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` | `Blob.Write.Tier` |
> | [Write to a blob with blob index tags](#write-to-a-blob-with-blob-index-tags) | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` <br/> `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` | `Blob.Write.WithTagHeaders` |

## Azure Storage actions and suboperations

This section lists the supported Azure Storage actions and suboperations you can targe for conditions.

### All read operations

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | All read operations |
> | **Description** | All Blob read operations. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |
> | **Suboperation** |  |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name |
> | **Request attributes** |  |
> | **Principal attributes** | Supported |

### List blobs

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | List blobs |
> | **Description** | List blobs operation. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |
> | **Suboperation** | NOT `Blob.List` |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name |
> | **Request attributes** | Blob prefix |
> | **Principal attributes** | Supported |

### Read a blob

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Read a blob |
> | **Description** | All blob read operations excluding list. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |
> | **Suboperation** | `Blob.List` |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Encryption scope name |
> | **Request attributes** | Version ID<br/>Snapshot |
> | **Principal attributes** | Supported |

### Read content from a blob with tag conditions

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Read content from a blob with tag conditions |
> | **Description** | Read blobs with tags. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |
> | **Suboperation** | `Blob.Read.WithTagConditions` |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Blob index tags [Values in key]<br/>Blob index tags [Keys]<br/>Encryption scope name |
> | **Request attributes** | Version ID<br/>Snapshot |
> | **Principal attributes** | Supported |

### Read blob index tags

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Read blob index tags |
> | **Description** | DataAction for reading blob index tags. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read` |
> | **Suboperation** |  |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Blob index tags [Values in key]<br/>Blob index tags [Keys] |
> | **Request attributes** | Version ID<br/>Snapshot |
> | **Principal attributes** | Supported |

### Find blobs by tags

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Find blobs by tags |
> | **Description** | DataAction for finding blobs by index tags. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/filter/action` |
> | **Suboperation** |  |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled |
> | **Request attributes** |  |
> | **Principal attributes** | Supported |

### Write to a blob

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Write to a blob |
> | **Description** | DataAction for writing to blobs. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` |
> | **Suboperation** |  |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Encryption scope name |
> | **Request attributes** |  |
> | **Principal attributes** | Supported |

### Sets the access tier on a blob

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Sets the access tier on a blob |
> | **Description** | DataAction for writing to blobs. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` |
> | **Suboperation** | `Blob.Write.Tier` |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Encryption scope name |
> | **Request attributes** | Version ID<br/>Snapshot |
> | **Principal attributes** | Supported |

### Write to a blob with blob index tags

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Write to a blob with blob index tags |
> | **Description** | REST operations: Put Blob, Put Block List, Copy Blob and Copy Blob From URL. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` |
> | **Suboperation** | `Blob.Write.WithTagHeaders` |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Encryption scope name |
> | **Request attributes** | Blob index tags [Values in key]<br/>Blob index tags [Keys] |
> | **Principal attributes** | Supported |

### Create a blob or snapshot, or append data

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Create a blob or snapshot, or append data |
> | **Description** | DataAction for creating blobs. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` |
> | **Suboperation** |  |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Encryption scope name |
> | **Request attributes** |  |
> | **Principal attributes** | Supported |

### Write blob index tags

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Write blob index tags |
> | **Description** | DataAction for writing blob index tags. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` |
> | **Suboperation** |  |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path<br/>Blob index tags [Values in key]<br/>Blob index tags [Keys] |
> | **Request attributes** | Blob index tags [Values in key]<br/>Blob index tags [Keys]<br/>Version ID<br/>Snapshot |
> | **Principal attributes** | Supported |

### Write Blob legal hold and immutability policy

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Write Blob legal hold and immutability policy |
> | **Description** | DataAction for writing Blob legal hold and immutability policy. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/immutableStorage/runAsSuperUser/action` |
> | **Suboperation** |  |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path |
> | **Request attributes** |  |
> | **Principal attributes** | Supported |

### Delete a blob

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Delete a blob |
> | **Description** | DataAction for deleting blobs. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete` |
> | **Suboperation** |  |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path |
> | **Request attributes** | Version ID<br/>Snapshot |
> | **Principal attributes** | Supported |

### Delete a version of a blob

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Delete a version of a blob |
> | **Description** | DataAction for deleting a version of a blob. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action` |
> | **Suboperation** |  |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path |
> | **Request attributes** | Version ID |
> | **Principal attributes** | Supported |

### Permanently delete a blob overriding soft-delete

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Permanently delete a blob overriding soft-delete |
> | **Description** | DataAction for permanently deleting a blob overriding soft-delete. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/permanentDelete/action` |
> | **Suboperation** |  |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path |
> | **Request attributes** | Version ID<br/>Snapshot |
> | **Principal attributes** | Supported |

### Modify permissions of a blob

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Modify permissions of a blob |
> | **Description** | DataAction for modifying permissions of a blob. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/modifyPermissions/action` |
> | **Suboperation** |  |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path |
> | **Request attributes** |  |
> | **Principal attributes** | Supported |

### Change ownership of a blob

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Change ownership of a blob |
> | **Description** | DataAction for changing ownership of a blob. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/manageOwnership/action` |
> | **Suboperation** |  |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path |
> | **Request attributes** |  |
> | **Principal attributes** | Supported |

### Rename a file or a directory

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Rename a file or a directory |
> | **Description** | DataAction for renaming files or directories. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action` |
> | **Suboperation** |  |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path |
> | **Request attributes** |  |
> | **Principal attributes** | Supported |

### All data operations for accounts with hierarchical namespace enabled

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | All data operations for accounts with hierarchical namespace enabled |
> | **Description** | DataAction for all data operations on storage accounts with hierarchical namespace enabled. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` |
> | **Suboperation** |  |
> | **Resource attributes** | Account name<br/>Is hierarchical namespace enabled<br/>Container name<br/>Blob path |
> | **Request attributes** |  |
> | **Principal attributes** | Supported |

## Azure Queue Storage actions

This section lists the supported Azure Queue Storage actions you can targe for conditions.

### Peek messages

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Peek messages |
> | **Description** | DataAction for peeking messages. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/queueServices/queues/messages/read` |
> | **Resource attributes** | Account name<br/>Queue name |
> | **Request attributes** |  |
> | **Principal attributes** | Supported |

### Put a message

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Put a message |
> | **Description** | DataAction for putting a message. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/queueServices/queues/messages/add/action` |
> | **Resource attributes** | Account name<br/>Queue name |
> | **Request attributes** |  |
> | **Principal attributes** | Supported |

### Put or update a message

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Put or update a message |
> | **Description** | DataAction for putting or updating a message. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/queueServices/queues/messages/write` |
> | **Resource attributes** | Account name<br/>Queue name |
> | **Request attributes** |  |
> | **Principal attributes** | Supported |

### Clear messages

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Clear messages |
> | **Description** | DataAction for clearing messages. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/queueServices/queues/messages/delete` |
> | **Resource attributes** | Account name<br/>Queue name |
> | **Request attributes** |  |
> | **Principal attributes** | Supported |

### Get or delete messages

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Get or delete messages |
> | **Description** | DataAction for getting or deleting messages. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/queueServices/queues/messages/process/action` |
> | **Resource attributes** | Account name<br/>Queue name |
> | **Request attributes** |  |
> | **Principal attributes** | Supported |

## Azure Storage attributes

This section lists the Azure Storage attributes you can use in your condition expressions depending on the action you target. If you select multiple actions for a single condition, there might be fewer attributes to choose from for your condition because the attributes must be available across the selected actions.

> [!NOTE]
> Attributes and values listed are considered case-insensitive, unless stated otherwise.

### Account name

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Account name |
> | **Description** | Name of a storage account. |
> | **Attribute** | `Microsoft.Storage/storageAccounts:name` |
> | **Source** | Resource |
> | **Type** | String |

### Blob index tags [Keys]

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Blob index tags [Keys] |
> | **Description** | Index tags on a blob resource.<br/>Arbitrary user-defined key-value properties that you can store alongside a blob resource. Use when you want to check the key in blob index tags. |
> | **Attribute** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags&$keys$&` |
> | **Source** | Resource<br/>Request |
> | **Type** | StringList |
> | **Is key case sensitive** | true |

> [!NOTE]
> Blob index tags are not supported for Data Lake Storage Gen2 storage accounts, which have a [hierarchical namespace](../blobs/data-lake-storage-namespace.md) (HNS). You should not author role assignment conditions using index tags on storage accounts that have HNS enabled.

### Blob index tags [Values in key]

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Blob index tags [Keys] |
> | **Description** | Index tags on a blob resource.<br/>Arbitrary user-defined key-value properties that you can store alongside a blob resource. Use when you want to check both the key (case-sensitive) and value in blob index tags. |
> | **Attribute** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags` |
> | **Example** | `@Resource[Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags:`*keyname*`<$key_case_sensitive$>` |
> | **Source** | Resource<br/>Request |
> | **Type** | String |
> | **Is key case sensitive** | true |

> [!NOTE]
> Blob index tags are not supported for Data Lake Storage Gen2 storage accounts, which have a [hierarchical namespace](../blobs/data-lake-storage-namespace.md) (HNS). You should not author role assignment conditions using index tags on storage accounts that have HNS enabled.

### Blob path

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Blob path |
> | **Description** | Path of a virtual directory, blob, folder or file resource.<br/>Use when you want to check the blob name or folders in a blob path. |
> | **Attribute** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` |
> | **Source** | Resource |
> | **Type** | String |

> [!NOTE]
> When specifying conditions for the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` attribute, the values shouldn't include the container name or a preceding slash (`/`) character. Use the path characters without any URL encoding.

### Blob prefix

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Blob prefix |
> | **Description** | Allowed prefix of blobs to be listed. |
> | **Attribute** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:prefix` |
> | **Source** | Request |
> | **Type** | String |

### Container name

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Container name |
> | **Description** | Name of a storage container or file system.<br/>Use when you want to check the container name. |
> | **Attribute** | `Microsoft.Storage/storageAccounts/blobServices/containers:name` |
> | **Source** | Resource |
> | **Type** | String |

### Encryption scope name

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Encryption scope name |
> | **Description** | Name of the encryption scope used to encrypt data.<br/>Available only for storage accounts where hierarchical namespace is not enabled. |
> | **Attribute** | `Microsoft.Storage/storageAccounts/encryptionScopes:name` |
> | **Source** | Resource |
> | **Type** | String |
> | **Exists supported** | true |

### Is hierarchical namespace enabled

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Is hierarchical namespace enabled |
> | **Description** | Whether hierarchical namespace is enabled on the storage account.<br/>Available only at resource group or above scope. |
> | **Attribute** | `Microsoft.Storage/storageAccounts:isHnsEnabled` |
> | **Source** | Resource |
> | **Type** | Boolean |

### Snapshot

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Snapshot |
> | **Description** | The Snapshot identifier for the Blob snapshot. |
> | **Attribute** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:snapshot` |
> | **Source** | Request |
> | **Type** | DateTime |
> | **Exists supported** | true |

### Version ID

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Version ID |
> | **Description** | The version ID of the versioned Blob.<br/>Available only for storage accounts where hierarchical namespace is not enabled. |
> | **Attribute** | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:versionId` |
> | **Source** | Request |
> | **Type** | DateTime |
> | **Exists supported** | true |

## Azure Queue Storage attributes

This section lists the Azure Queue Storage attributes you can use in your condition expressions depending on the action you target.

### Queue name

> [!div class="mx-tdCol2BreakAll"]
> | Element | Value |
> | --- | --- |
> | **Display name** | Queue name |
> | **Description** | Name of a storage queue. |
> | **Attribute** | `Microsoft.Storage/storageAccounts/queueServices/queues:name` |
> | **Source** | Resource |
> | **Type** | String |

## See also

- [Example Azure role assignment conditions (preview)](storage-auth-abac-examples.md)
- [Azure role assignment condition format and syntax (preview)](../../role-based-access-control/conditions-format.md)
- [Troubleshoot Azure role assignment conditions (preview)](../../role-based-access-control/conditions-troubleshoot.md)
