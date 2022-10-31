---
title: Prerequisites for Azure role assignment conditions (preview)
description: Prerequisites for Azure role assignment conditions (preview).
services: active-directory
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: conceptual
ms.workload: identity
ms.date: 10/19/2022
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

For conditions that use blob index tags, you must use a storage account that is compatible with the blob index feature. For example, only General Purpose v2 (GPv2) storage accounts with hierarchical namespace (HNS) disabled are currently supported. For more information, see [Manage and find Azure Blob data with blob index tags](../storage/blobs/storage-manage-find-blobs.md#regional-availability-and-storage-account-support)

## Azure PowerShell

When using Azure PowerShell to add or update conditions, you must use the following versions:

- [Az module 5.5.0 or later](https://www.powershellgallery.com/packages/Az/5.5.0)
- [Az.Resources module 3.2.1 or later](https://www.powershellgallery.com/packages/Az.Resources/3.2.1)
    - Included with Az module v5.5.0 and later, but can be manually installed through PowerShell Gallery
- [Az.Storage preview module 2.5.2-preview or later](https://www.powershellgallery.com/packages/Az.Storage/2.5.2-preview)

## Azure CLI

When using Azure CLI to add or update conditions, you must use the following versions:

- [Azure CLI 2.18 or later](/cli/azure/install-azure-cli)

## REST API

When using the REST API to add or update conditions, you must use the following versions:

- `2020-03-01-preview` or later
- `2020-04-01-preview` or later if you want to utilize the `description` property for role assignments
- `2022-04-01` is the first stable version

For more information, see [API versions of Azure RBAC REST APIs](/rest/api/authorization/versions).

## Permissions

Just like role assignments, to add or update conditions, you must be signed in to Azure with a user that has the `Microsoft.Authorization/roleAssignments/write` and `Microsoft.Authorization/roleAssignments/delete` permissions, such as [User Access Administrator](built-in-roles.md#user-access-administrator) or [Owner](built-in-roles.md#owner).

## Principal attributes

To use principal attributes ([custom security attributes in Azure AD](../active-directory/fundamentals/custom-security-attributes-overview.md)), you must have **all** of the following:

- Azure AD Premium P1 or P2 license
- [Attribute Assignment Administrator](../active-directory/roles/permissions-reference.md#attribute-assignment-administrator) at attribute set or tenant scope
- Custom security attributes defined in Azure AD

For more information about custom security attributes, see:

- [Principal does not appear in Attribute source](conditions-troubleshoot.md#symptom---principal-does-not-appear-in-attribute-source)
- [Add or deactivate custom security attributes in Azure AD](../active-directory/fundamentals/custom-security-attributes-add.md)

## Next steps

- [Example Azure role assignment conditions for Blob Storage (preview)](../storage/blobs/storage-auth-abac-examples.md)
- [Tutorial: Add a role assignment condition to restrict access to blobs using the Azure portal (preview)](../storage/blobs/storage-auth-abac-portal.md)
