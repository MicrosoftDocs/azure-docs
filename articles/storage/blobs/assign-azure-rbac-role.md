---
title: Assign an Azure RBAC role for access to blob data
titleSuffix: Azure Storage
description: Learn how to assign permissions for blob data to an Azure Active Directory security principal with Azure role-based access control (Azure RBAC). Azure Storage supports built-in and Azure custom roles for authentication and authorization via Azure AD.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 06/07/2021
ms.author: tamram
ms.reviewer: sohamnc
ms.subservice: common 
ms.custom: devx-track-azurepowershell
---

# Use PowerShell to assign an Azure role for access to blob data

Azure Active Directory (Azure AD) authorizes access rights to secured resources through [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md). Azure Storage defines a set of Azure built-in roles that encompass common sets of permissions used to access containers.

When an Azure role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. Access can be scoped to the level of the subscription, the resource group, the storage account, or an individual container. An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

This article describes how to list Azure built-in roles and assign them to users.

## Azure RBAC roles for blobs

[!INCLUDE [storage-auth-rbac-roles-blob-include](../../../includes/storage-auth-rbac-roles-include.md)]

## Determine resource scope

[!INCLUDE [storage-auth-resource-scope-blob-include](../../../includes/storage-auth-resource-scope-blob-include.md)]

## TBD

# [Azure portal](#tab/portal)

TBD

# [PowerShell](#tab/powershell)

TBD

# [Azure CLI](#tab/azure-cli)

TBD

---

## Assign an Azure role to a security principal

To assign an Azure role to a security principal, use the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command. The format of the command can differ based on the scope of the assignment. In order to run the command, you need to have Owner or Contributor role assigned at the corresponding scope. The following examples show how to assign a role to a user at various scopes, but you can use the same command to assign a role to any security principal.

> [!IMPORTANT]
> When you create an Azure Storage account, you are not automatically assigned permissions to access data via Azure AD. You must explicitly assign yourself an Azure RBAC role for data access. You can assign it at the level of your subscription, resource group, storage account, or container.
>
> If the storage account is locked with an Azure Resource Manager read-only lock, then the lock prevents the assignment of Azure RBAC roles that are scoped to the storage account or to a blob container.

### Container scope

To assign a role scoped to a container, specify a string containing the scope of the container for the `--scope` parameter. The scope for a container is in the form:

```
/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobServices/default/containers/<container-name>
```

The following example assigns the **Storage Blob Data Contributor** role to a user, scoped to a container named *sample-container*. Make sure to replace the sample values and the placeholder values in brackets with your own values: 

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Storage Blob Data Contributor" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/sample-resource-group/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobServices/default/containers/sample-container"
```

### Storage account scope

To assign a role scoped to the storage account, specify the scope of the storage account resource for the `--scope` parameter. The scope for a storage account is in the form:

```
/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>
```

The following example shows how to scope the **Storage Blob Data Reader** role to a user at the level of the storage account. Make sure to replace the sample values with your own values: 

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Storage Blob Data Reader" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/sample-resource-group/providers/Microsoft.Storage/storageAccounts/<storage-account>"
```

### Resource group scope

To assign a role scoped to the resource group, specify the resource group name or ID for the `--resource-group` parameter. The following example assigns the **Storage Blob Data Reader** role to a user at the level of the resource group. Make sure to replace the sample values and placeholder values in brackets with your own values: 

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Storage Blob Data Reader" `
    -ResourceGroupName "sample-resource-group"
```

### Subscription scope

To assign a role scoped to the subscription, specify the scope for the subscription for the `--scope` parameter. The scope for a subscription is in the form:

```
/subscriptions/<subscription>
```

The following example shows how to assign the **Storage Blob Data Reader** role to a user at the level of the storage account. Make sure to replace the sample values with your own values:

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Storage Blob Data Reader" `
    -Scope  "/subscriptions/<subscription>"
```

## Next steps

- [Add or remove Azure role assignments using the Azure PowerShell module](../../role-based-access-control/role-assignments-powershell.md)
- [Use the Azure CLI to assign an Azure role for access to blob and queue data](../common/storage-auth-aad-rbac-cli.md)
- [Use the Azure portal to assign an Azure role for access to blob and queue data](../common/storage-auth-aad-rbac-portal.md)
