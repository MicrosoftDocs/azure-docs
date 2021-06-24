---
title: Prerequisites for Azure role assignment conditions (preview)
description: Prerequisites for Azure role assignment conditions (preview).
services: active-directory
author: rolyon
manager: mtillman
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: conceptual
ms.workload: identity
ms.date: 05/06/2021
ms.author: rolyon

#Customer intent: 
---

# Prerequisites for Azure role assignment conditions (preview)

> [!IMPORTANT]
> Azure ABAC and Azure role assignment conditions are currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To add or edit Azure role assignment conditions, you must have the following prerequisites.

## Storage accounts

For conditions that use blob index tags, you must use a storage account that is compatible with the blob index feature. For example, only General Purpose v2 (GPv2) storage accounts with hierarchical namespace (HNS) disabled are currently supported. For more information, see [Manage and find Azure Blob data with blob index tags (preview)](../storage/blobs/storage-manage-find-blobs.md#regional-availability-and-storage-account-support)

## Azure PowerShell

When using Azure PowerShell to add or update conditions, you must use the following versions:

- [Az module 5.5.0 or later](https://www.powershellgallery.com/packages/Az/5.5.0)
- [Az.Resources module 3.2.1 or later](https://www.powershellgallery.com/packages/Az.Resources/3.2.1)
    - Included with Az module v5.5.0 and later, but can be manually installed through PowerShell Gallery
- [Az.Storage preview module 2.5.2-preview or later](https://www.powershellgallery.com/packages/Az.Storage/2.5.2-preview)

## Azure CLI

When using Azure CLI to add or update conditions, you must use the following versions:

- [Azure CLI 2.18 or later](/cli/azure/install-azure-cli)

## Permissions

Just like role assignments, to add or update conditions, you must be signed in to Azure with a user that has the `Microsoft.Authorization/roleAssignments/write` and `Microsoft.Authorization/roleAssignments/delete` permissions, such as [User Access Administrator](built-in-roles.md#user-access-administrator) or [Owner](built-in-roles.md#owner).

## Next steps

- [Example Azure role assignment conditions (preview)](../storage/common/storage-auth-abac-examples.md)
- [Tutorial: Add a role assignment condition to restrict access to blobs using the Azure portal (preview)](../storage/common/storage-auth-abac-portal.md)
