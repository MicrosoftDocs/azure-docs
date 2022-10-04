---
title: Actions and attributes for Azure role assignment conditions for Azure queues | Microsoft Docs
titleSuffix: Azure Storage
description: Supported actions and attributes for Azure role assignment conditions and Azure attribute-based access control (Azure ABAC) for Azure queues. 
services: storage
author: jimmart-dev

ms.service: storage
ms.topic: conceptual
ms.date: 10/04/2022
ms.author: jammart
ms.reviewer: nachakra
ms.subservice: queues
---

# Actions and attributes for Azure role assignment conditions for Azure queues

> [!IMPORTANT]
> Currently, Azure ABAC is generally available (GA) for controlling access to Azure blob storage and Data Lake Storage Gen2 only using `request` and `resource` attributes in the standard storage account performance tier. It is still in preview for premium storage accounts and for the security principal attribute in all tiers. Also, the snapshot resource attribute for Data Lake Storage Gen2 is still in preview.
>
> See [About the ABAC preview](../common/authorize-data-access.md#about-the-abac-preview) for a complete list of storage account performance tiers, resource types, and attributes for which ABAC is generally available or in preview.
>
> Features of ABAC still in preview are provided without a service level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This article describes the supported attribute dictionaries that can be used in conditions on Azure role assignments for each Azure Storage [DataAction](../../role-based-access-control/role-definitions.md#dataactions). For the list of Queue service operations that are affected by a specific permission or DataAction, see [Permissions for Queue service operations](/rest/api/storageservices/authorize-with-azure-active-directory#permissions-for-queue-service-operations).

To understand the role assignment condition format, see [Azure role assignment condition format and syntax](../../role-based-access-control/conditions-format.md).

## Azure Queue storage actions

This section lists the supported Azure Queue storage actions you can target for conditions.

### Peek messages

> [!div class="mx-tdCol2BreakAll"]
> | Property | Value |
> | --- | --- |
> | **Display name** | Peek messages |
> | **Description** | DataAction for peeking messages. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/queueServices/queues/messages/read` |
> | **Resource attributes** | [Account name](#account-name)<br/>[Queue name](#queue-name) |
> | **Request attributes** |  |
> | **Principal attributes support** | True |

### Put a message

> [!div class="mx-tdCol2BreakAll"]
> | Property | Value |
> | --- | --- |
> | **Display name** | Put a message |
> | **Description** | DataAction for putting a message. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/queueServices/queues/messages/add/action` |
> | **Resource attributes** | [Account name](#account-name)<br/>[Queue name](#queue-name) |
> | **Request attributes** |  |
> | **Principal attributes support** | True |

### Put or update a message

> [!div class="mx-tdCol2BreakAll"]
> | Property | Value |
> | --- | --- |
> | **Display name** | Put or update a message |
> | **Description** | DataAction for putting or updating a message. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/queueServices/queues/messages/write` |
> | **Resource attributes** | [Account name](#account-name)<br/>[Queue name](#queue-name) |
> | **Request attributes** |  |
> | **Principal attributes support** | True |

### Clear messages

> [!div class="mx-tdCol2BreakAll"]
> | Property | Value |
> | --- | --- |
> | **Display name** | Clear messages |
> | **Description** | DataAction for clearing messages. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/queueServices/queues/messages/delete` |
> | **Resource attributes** | [Account name](#account-name)<br/>[Queue name](#queue-name) |
> | **Request attributes** |  |
> | **Principal attributes support** | True |

### Get or delete messages

> [!div class="mx-tdCol2BreakAll"]
> | Property | Value |
> | --- | --- |
> | **Display name** | Get or delete messages |
> | **Description** | DataAction for getting or deleting messages. |
> | **DataAction** | `Microsoft.Storage/storageAccounts/queueServices/queues/messages/process/action` |
> | **Resource attributes** | [Account name](#account-name)<br/>[Queue name](#queue-name) |
> | **Request attributes** |  |
> | **Principal attributes support** | True |

## Azure Queue storage attributes

This section lists the Azure Queue storage attributes you can use in your condition expressions depending on the action you target. If you select multiple actions for a single condition, there might be fewer attributes to choose from for your condition because the attributes must be available across the selected actions.

> [!NOTE]
> Attributes and values listed are considered case-insensitive, unless stated otherwise.

### Account name

> [!div class="mx-tdCol2BreakAll"]
> | Property | Value |
> | --- | --- |
> | **Display name** | Account name |
> | **Description** | Name of a storage account. |
> | **Attribute** | `Microsoft.Storage/storageAccounts:name` |
> | **Attribute source** | Resource |
> | **Attribute type** | String |
> | **Examples** | `@Resource[Microsoft.Storage/storageAccounts:name] StringEquals 'sampleaccount'` |

### Queue name

> [!div class="mx-tdCol2BreakAll"]
> | Property | Value |
> | --- | --- |
> | **Display name** | Queue name |
> | **Description** | Name of a storage queue. |
> | **Attribute** | `Microsoft.Storage/storageAccounts/queueServices/queues:name` |
> | **Attribute source** | Resource |
> | **Attribute type** | String |

## See also

- [Example Azure role assignment conditions](../blobs\storage-auth-abac-examples.md)
- [Azure role assignment condition format and syntax](../../role-based-access-control/conditions-format.md)
- [Troubleshoot Azure role assignment conditions](../../role-based-access-control/conditions-troubleshoot.md)