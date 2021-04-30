---
title: Actions and attributes for Azure role assignment conditions in Azure Storage (preview)
titleSuffix: Azure Storage
description: Supported actions and attributes for Azure role assignment conditions and Azure attribute-based access control (Azure ABAC) in Azure Storage. 
services: storage
author: santoshc

ms.service: storage
ms.topic: conceptual
ms.date: 04/29/2021
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

In this case, the optional suboperation `Blobs.Write.WithTagHeaders` can be used to apply a condition to only those operations that support blob index tags as a request parameter.

Similarly, only select operations on the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` action can have support blob index tags as a precondition for access. This subset of operations is identified by the `Blobs.Read.WithTagConditions` suboperation.

> [!NOTE]
> Blobs also support the ability to store arbitrary user-defined key-value metadata. Although metadata is similar to blob index tags, you must use blob index tags with conditions. For more information, see [Manage and find data on Azure Blob Storage with Blob Index (Preview)](../blobs/storage-manage-find-blobs.md).

In this preview, storage accounts support the following suboperations:

> [!div class="mx-tableFixed"]
> | DataAction | Suboperation | Display name | Description |
> | :--- | :--- | :--- | :--- |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` | `Blobs.Read.WithTagConditions` | Blob read operations that support conditions on tags | Includes REST operations Get Blob, Get Blob Metadata, Get Blob Properties, Get Block List, Get Page Ranges, Query Blob Contents. |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` <br/> `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` | `Blobs.Write.WithTagHeaders` | Blob writes for content with optional tags | Includes REST operations Put Blob, Copy Blob, Copy Blob From URL and Put Block List. |

## Actions and suboperations

The following table lists the supported actions and suboperations for conditions in Azure Storage.

> [!div class="mx-tableFixed"]
> | Display name | Description | DataAction |
> | --- | --- | --- |
> | Delete a blob | DataAction for deleting blobs. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete` |
> | Read a blob | DataAction for reading blobs. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` |
> | Read content from a blob with tag conditions  | REST operations: Get Blob, Get Blob Metadata, Get Blob Properties, Get Block List, Get Page Ranges and Query Blob Contents. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`<br/>**Suboperation**<br/>`Blobs.Read.WithTagConditions` | 
> | Write to a blob | DataAction for writing to blobs. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` |
> | Write to a blob with blob index tags | REST operations: Put Blob, Put Block List, Copy Blob and Copy Blob From URL. |`Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write`<br/>**Suboperation**<br/>`Blobs.Write.WithTagHeaders` | 
> | Create a blob or snapshot, or append data | DataAction for creating blobs. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` |
> | Write content to a blob with blob index tags | REST operations: Put Blob, Put Block List, Copy Blob and Copy Blob From URL. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action`<br/>**Suboperation**<br/>`Blobs.Write.WithTagHeaders` | 
> | Delete a version of a blob | DataAction for deleting a version of a blob. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action` |
> | Changes ownership of a blob | DataAction for changing ownership of a blob. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/manageOwnership/action` |
> | Modify permissions of a blob | DataAction for modifying permissions of a blob. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/modifyPermissions/action` |
> | Rename file or directory | DataAction for renaming files or directories. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action` |
> | Permanently delete a blob overriding soft-delete | DataAction for permanently deleting a blob overriding soft-delete. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/permanentDelete/action` |
> | All data operations for accounts with HNS | DataAction for all data operations on storage accounts with HNS. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` |
> | Read blob index tags | DataAction for reading blob index tags. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read` |
> | Write blob index tags | DataAction for writing blob index tags. | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` |

## Attributes

The following table lists the descriptions for the supported attributes for conditions in Azure Storage.

> [!div class="mx-tableFixed"]
> | Display name | Description | Attribute |
> | --- | --- | --- |
> | Container name| Name of a storage container or file system. Use when you want to check the container name. | `container:name` |
> | Blob path | Path of a virtual directory, blob, folder or file resource. Use when you want to check the blob name or folders in a blob path. | `blobs:path` |
> | Blob index tags [Keys] | Index tags on a blob resource. Arbitrary user-defined key-value properties that you can store alongside a blob resource. Use when you want to check the key in blob index tags. | `tags&$keys$&` |
> | Blob index tags [Values in key] | Index tags on a blob resource. Arbitrary user-defined key-value properties that you can store alongside a blob resource. Use when you want to check both the key (case-sensitive) and value in blob index tags. | `tags:`*keyname*`<$key_case_sensitive$>` |

> [!NOTE]
> Attributes and values listed are considered case-insensitive, unless stated otherwise.

> [!NOTE]
> When specifying conditions for `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` attribute, the values shouldn't include the container name or a preceding '/' character. Use the path characters without any URL encoding.

## Attributes available for each action

The following table lists which attributes you can use in your condition expressions depending on the action you target. If you select multiple actions for a single condition, there might be fewer attributes to choose from for your condition because the attributes must be available across the selected actions.

> [!div class="mx-tableFixed"]
> | DataAction  | SubOperation | Attribute | Type | Applies To |
> | :--- | :--- | :--- | :--- | :--- |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers:name` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` | string |ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers:name` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` | string |ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` | `Blobs.Read.WithTagConditions` | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags` | dictionaryOfString | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers:name` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` | string |ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` | `Blobs.Write.WithTagHeaders` | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags` | dictionaryOfString | RequestAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers:name` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` | string |ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` | `Blobs.Write.WithTagHeaders` | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags` | dictionaryOfString | RequestAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers:name` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` | string |ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/manageOwnership/action` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers:name` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/manageOwnership/action` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` | string |ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/modifyPermissions/action` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers:name` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/modifyPermissions/action` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` | string |ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers:name` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` | string |ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers:name` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` | string |ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers:name` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` | string |ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags` | dictionaryOfString | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers:name` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` | string |ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` | N/A | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags` | dictionaryOfString | RequestAttributeOnly |

> [!div class="mx-tableFixed"]
> | DataAction | Attribute | Type | Applies to |
> | --- | --- | --- | --- |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`<br/>**Suboperation**<br/>`Blobs.Read.WithTagConditions` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> |  | `tags` | dictionaryOfString | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write`<br/>**Suboperation**<br/>`Blobs.Write.WithTagHeaders` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> |  | `tags` | dictionaryOfString | RequestAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action`<br/>**Suboperation**<br/>`Blobs.Write.WithTagHeaders` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> |  | `tags` | dictionaryOfString | RequestAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/manageOwnership/action` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/modifyPermissions/action` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/permanentDelete/action` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> |  | `tags` | dictionaryOfString | ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` | `containers:name` | string | ResourceAttributeOnly |
> |  | `blobs:path` | string | ResourceAttributeOnly |
> |  | `tags` | dictionaryOfString | RequestAttributeOnly |

> [!div class="mx-tableFixed"]
> | DataAction | Attribute | Type | Applies to |
> | --- | --- | --- | --- |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete` | `containers:name`<br/>`blobs:path` | string<br/>string | ResourceAttributeOnly<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` | `containers:name`<br/>`blobs:path` | string<br/>string | ResourceAttributeOnly<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`<br/>**Suboperation**<br/>`Blobs.Read.WithTagConditions` | `containers:name`<br/>`blobs:path`</br>`tags` | string<br/>string<br/>dictionaryOfString | ResourceAttributeOnly<br/>ResourceAttributeOnly<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` | `containers:name`<br/>`blobs:path` | string<br/>string | ResourceAttributeOnly<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write`<br/>**Suboperation**<br/>`Blobs.Write.WithTagHeaders` | `containers:name`<br/>`blobs:path`</br>`tags` | string<br/>string<br/>dictionaryOfString | ResourceAttributeOnly<br/>ResourceAttributeOnly<br/>RequestAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` | `containers:name`<br/>`blobs:path` | string<br/>string | ResourceAttributeOnly<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action`<br/>**Suboperation**<br/>`Blobs.Write.WithTagHeaders` | `containers:name`<br/>`blobs:path`</br>`tags` | string<br/>string<br/>dictionaryOfString | ResourceAttributeOnly<br/>ResourceAttributeOnly<br/>RequestAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action` | `containers:name`<br/>`blobs:path` | string<br/>string | ResourceAttributeOnly<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/manageOwnership/action` | `containers:name`<br/>`blobs:path` | string<br/>string | ResourceAttributeOnly<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/modifyPermissions/action` | `containers:name`<br/>`blobs:path` | string<br/>string | ResourceAttributeOnly<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action` | `containers:name`<br/>`blobs:path` | string<br/>string | ResourceAttributeOnly<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/permanentDelete/action` | `containers:name`<br/>`blobs:path` | string<br/>string | ResourceAttributeOnly<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action` | `containers:name`<br/>`blobs:path` | string<br/>string | ResourceAttributeOnly<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read` | `containers:name`<br/>`blobs:path`</br>`tags` | string<br/>string<br/>dictionaryOfString | ResourceAttributeOnly<br/>ResourceAttributeOnly<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write` | `containers:name`<br/>`blobs:path`</br>`tags` | string<br/>string<br/>dictionaryOfString | ResourceAttributeOnly<br/>ResourceAttributeOnly<br/>RequestAttributeOnly |

> [!div class="mx-tableFixed"]
> | DataAction | Attribute info |
> | --- | --- |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete` | `containers:name`<br/>string<br/>ResourceAttributeOnly |
> |  | `blobs:path`<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` | `containers:name`<br/>string<br/>ResourceAttributeOnly |
> |  | `blobs:path`<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read`<br/>**Suboperation**<br/>`Blobs.Read.WithTagConditions` | `containers:name`<br/>string<br/>ResourceAttributeOnly |
> |  | `blobs:path`<br/>ResourceAttributeOnly |
> |  | `tags`<br/>dictionaryOfString<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` | `containers:name`<br/>string<br/>ResourceAttributeOnly |
> |  | `blobs:path`<br/>ResourceAttributeOnly |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write`<br/>**Suboperation**<br/>`Blobs.Write.WithTagHeaders` | `containers:name`<br/>string<br/>ResourceAttributeOnly |
> |  | `blobs:path`<br/>ResourceAttributeOnly |
> |  | `tags`<br/>dictionaryOfString<br/>RequestAttributeOnly |

## See also

- [Example Azure role assignment conditions (Preview)](storage-auth-abac-examples.md)
- [Azure role assignment condition format and syntax (Preview)](../../role-based-access-control/conditions-format.md)
- [What is Azure attribute-based access control (Azure ABAC)? (Preview)](../../role-based-access-control/conditions-overview.md)

