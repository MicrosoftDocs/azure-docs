---
title: Attributes and Operations supported for ABAC in Azure Storage
titleSuffix: Azure Storage
description: Supported attributes and operations for ABAC in Azure Storage. Understanding subOperations.
services: storage
author: santoshc

ms.service: storage
ms.topic: conceptual
ms.date: 04/16/2021
ms.author: santoshc
ms.reviewer: jiacfan
ms.subservice: common
---
# Attributes and operations supported for attribute-based access control in Azure Storage

This article describes the supported attribute dictionaries that can be used in conditions on role assignments for each Azure Storage [DataAction](../../role-based-access-control/role-definitions.md#dataactions). For the list of Blob service operations that are affected by a specific permission or DataAction, please see [Permissions for Blob service operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-blob-service-operations).

To understand the role assignment condition format, please refer to the [Azure role assignment condition format and syntax](../../role-based-access-control/conditions-format.md).

## Understanding subOperations

Multiple Storage service operations can be associated with a single permission or DataAction. However, each of these operations associated with the same permission may support different parameters. *SubOperations* enable you to differentiate between service operations which require the same permission but support different set of attributes for ABAC. Thus, using a subOperation you can specify one ABAC condition for access to a subset of operations that support a given parameter, and another access condition for operations with the same action that don’t support that parameter.

For instance, the *Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write* action is required for over a dozen different service operations. Some of these operations can accept blob index tags as request parameter, while others don't. For operations that accept them as a parameter, you can use blob index tags in a Request condition. However, if such a condition is defined on the Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write action, all operations that do not accept tags as a request parameter cannot evaluate this condition, and will fail the authorization access check.

In this case, the optional subOperation Blobs.Write.WithTagHeaders can be used to apply an ABAC condition to only those operations that support blob index tags as a request parameter.

Similarly, only select operations on the Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read action can have support blob index tags as a precondition for access. This subset of operations is identified by the Blobs.Read.WithTagConditions subOperation.

In this preview, the subOperations supported for storage actions are:

> [!div class="mx-tableFixed"]
> | Action | SubOperation | Display Name | Description |
> | :--- | :--- | :--- | :--- |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read` | `Blobs.Read.WithTagConditions` | Blob read operations that support conditions on tags | Includes REST operations Get Blob, Get Blob Metadata, Get Blob Properties, Get Block List, Get Page Ranges, Query Blob Contents |
> | `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write` <br/> `Microsoft.Storage/storageAccounts/blobServices/containers/blobs/add/action` | `Blobs.Write.WithTagHeaders` | Blob writes for content with optional tags | Includes REST operations Put Blob, Copy Blob, Copy Blob From URL and Put Block List |

## Actions, subOperations and attributes

The table below compiles the full list of supported actions, subOperations and attribute dictionaries for ABAC in Azure Storage.

> [!NOTE]
> Attributes and values listed are considered case-insensitive, unless stated otherwise.

> [!NOTE]
> When specifying conditions for `Microsoft.Storage/storageAccounts/blobServices/containers/blobs:path` attribute, the values should not include the container name or a preceding '/' character. Use the path characters without any URL encoding.

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

## Next Steps
- [Security considerations for attribute-based access control](storage-blob-auth-abac-security.md)

