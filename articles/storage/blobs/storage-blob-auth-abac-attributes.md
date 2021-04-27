---
title: Attributes and operations supported for Azure role assignment conditions in Azure Storage (preview)
titleSuffix: Azure Storage
description: Supported attributes and operations for Azure role assignment conditions and Azure attribute-based access control (Azure ABAC) in Azure Storage. 
services: storage
author: santoshc

ms.service: storage
ms.topic: conceptual
ms.date: 04/16/2021
ms.author: santoshc
ms.reviewer: jiacfan
ms.subservice: common
---

# Attributes and operations supported for Azure role assignment conditions in Azure Storage (preview)

> [!IMPORTANT]
> Azure ABAC and Azure role assignment conditions are currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article describes the supported attribute dictionaries that can be used in conditions on Azure role assignments for each Azure Storage [DataAction](../../role-based-access-control/role-definitions.md#dataactions). For the list of Blob service operations that are affected by a specific permission or DataAction, see [Permissions for Blob service operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-blob-service-operations).

To understand the role assignment condition format, see [Azure role assignment condition format and syntax](../../role-based-access-control/conditions-format.md).

## Understanding suboperations

Multiple Storage service operations can be associated with a single permission or DataAction. However, each of these operations that are associated with the same permission might support different parameters. *Suboperations* enable you to differentiate between service operations that require the same permission but support different set of attributes for conditions. Thus, by using a suboperation, you can specify one condition for access to a subset of operations that support a given parameter. Then, you can use another access condition for operations with the same action that doesn't support that parameter.

For example, the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` action is required for over a dozen different service operations. Some of these operations can accept blob index tags as request parameter, while others don't. For operations that accept blob index tags as a parameter, you can use blob index tags in a Request condition. However, if such a condition is defined on the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` action, all operations that don't accept tags as a request parameter cannot evaluate this condition, and will fail the authorization access check.

In this case, the optional suboperation `Blobs.Write.WithTagHeaders` can be used to apply a condition to only those operations that support blob index tags as a request parameter.

Similarly, only select operations on the `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` action can have support blob index tags as a precondition for access. This subset of operations is identified by the `Blobs.Read.WithTagConditions` suboperation.

In this preview, storage accounts support the following suboperations:

> [!div class="mx-tableFixed"]
> | Action | SubOperation | Display Name | Description |
> | :--- | :--- | :--- | :--- |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` | `Blobs.Read.WithTagConditions` | Blob read operations that support conditions on tags | Includes REST operations Get Blob, Get Blob Metadata, Get Blob Properties, Get Block List, Get Page Ranges, Query Blob Contents. |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` <br/> `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` | `Blobs.Write.WithTagHeaders` | Blob writes for content with optional tags | Includes REST operations Put Blob, Copy Blob, Copy Blob From URL and Put Block List. |

## Actions, suboperations, and attributes

The following table shows the full list of supported actions, suboperations, and attribute dictionaries for conditions in Azure Storage.

> [!NOTE]
> Attributes and values listed are considered case-insensitive, unless stated otherwise.

> [!NOTE]
> When specifying conditions for `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` attribute, the values shouldn't include the container name or a preceding '/' character. Use the path characters without any URL encoding.

> [!div class="mx-tableFixed"]
> | Action  | SubOperation | Attribute | Type | Applies To |
> | :--- | :--- | :--- | :--- | :--- |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete | N/A | Microsoft.Storage/storageAccounts/blobServices/containers:name | string | ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete | N/A | Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path | string |ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read | N/A | Microsoft.Storage/storageAccounts/blobServices/containers:name | string | ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read | N/A | Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path | string |ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read | Blobs.Read.WithTagConditions | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags | dictionaryOfString | ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write | N/A | Microsoft.Storage/storageAccounts/blobServices/containers:name | string | ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write | N/A | Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path | string |ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write | Blobs.Write.WithTagHeaders | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags | dictionaryOfString | RequestAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action | N/A | Microsoft.Storage/storageAccounts/blobServices/containers:name | string | ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action | N/A | Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path | string |ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action | Blobs.Write.WithTagHeaders | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags | dictionaryOfString | RequestAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action | N/A | Microsoft.Storage/storageAccounts/blobServices/containers:name | string | ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/deleteBlobVersion/action | N/A | Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path | string |ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/manageOwnership/action | N/A | Microsoft.Storage/storageAccounts/blobServices/containers:name | string | ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/manageOwnership/action | N/A | Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path | string |ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/modifyPermissions/action | N/A | Microsoft.Storage/storageAccounts/blobServices/containers:name | string | ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/modifyPermissions/action | N/A | Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path | string |ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action | N/A | Microsoft.Storage/storageAccounts/blobServices/containers:name | string | ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/move/action | N/A | Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path | string |ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action | N/A | Microsoft.Storage/storageAccounts/blobServices/containers:name | string | ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/runAsSuperUser/action | N/A | Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path | string |ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read | N/A | Microsoft.Storage/storageAccounts/blobServices/containers:name | string | ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read | N/A | Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path | string |ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/read | N/A | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags | dictionaryOfString | ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write | N/A | Microsoft.Storage/storageAccounts/blobServices/containers:name | string | ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write | N/A | Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path | string |ResourceAttributeOnly |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags/write | N/A | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/tags | dictionaryOfString | RequestAttributeOnly |

## See also

- [Security considerations for Azure role assignment conditions in Azure Storage (preview)](storage-blob-auth-abac-security.md)
- [Attributes and operations supported for Azure role assignment conditions in Azure Storage (preview)](storage-blob-auth-abac-attributes.md)
- [What is Azure attribute-based access control (Azure ABAC)?](../../role-based-access-control/conditions-overview.md)

