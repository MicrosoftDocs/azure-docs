---
title: Assign an Azure role for access to table data
titleSuffix: Azure Storage
description: Learn how to assign permissions for table data to an Azure Active Directory security principal with Azure role-based access control (Azure RBAC). Azure Storage supports built-in and Azure custom roles for authentication and authorization via Azure AD.
services: storage
author: akashdubey-ms

ms.service: azure-table-storage
ms.topic: how-to
ms.date: 03/03/2022
ms.author: akashdubey
ms.reviewer: nachakra
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
---

# Assign an Azure role for access to table data

Azure Active Directory (Azure AD) authorizes access rights to secured resources through [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md). Azure Storage defines a set of Azure built-in roles that encompass common sets of permissions used to access table data in Azure Storage.

When an Azure role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

To learn more about using Azure AD to authorize access to table data, see [Authorize access to tables using Azure Active Directory](authorize-access-azure-active-directory.md).

## Assign an Azure role

You can use PowerShell, Azure CLI, or an Azure Resource Manager template to assign a role for data access.

> [!IMPORTANT]
> The Azure portal does not currently support assigning an Azure RBAC role that is scoped to the table. To assign a role with table scope, use PowerShell, Azure CLI, or Azure Resource Manager.
>
> You can use the Azure portal to assign a role that grants access to table data to an Azure Resource Manager resource, such as the storage account, resource group, or subscription.

# [PowerShell](#tab/powershell)

To assign an Azure role to a security principal, call the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command. The format of the command can differ based on the scope of the assignment. In order to run the command, you must have a role that includes **Microsoft.Authorization/roleAssignments/write** permissions assigned to you at the corresponding scope or above.

To assign a role scoped to a table, specify a string containing the scope of the table for the `--scope` parameter. The scope for a table is in the form:

```
/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/tableServices/default/tables/<table-name>
```

The following example assigns the **Storage Table Data Contributor** role to a user, scoped to a table. Make sure to replace the sample values and the placeholder values in brackets with your own values:

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Storage Table Data Contributor" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/tableServices/default/tables/<table>"
```

For information about assigning roles with PowerShell at the subscription, resource group, or storage account scope, see [Assign Azure roles using Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md).

# [Azure CLI](#tab/azure-cli)

To assign an Azure role to a security principal, use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command. The format of the command can differ based on the scope of the assignment. The format of the command can differ based on the scope of the assignment. In order to run the command, you must have a role that includes **Microsoft.Authorization/roleAssignments/write** permissions assigned to you at the corresponding scope or above.

To assign a role scoped to a table, specify a string containing the scope of the table for the `--scope` parameter. The scope for a table is in the form:

```
/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/tableServices/default/tables/<table-name>
```

The following example assigns the **Storage Table Data Contributor** role to a user, scoped to the level of the table. Make sure to replace the sample values and the placeholder values in brackets with your own values:

```azurecli-interactive
az role assignment create \
    --role "Storage Table Data Contributor" \
    --assignee <email> \
    --scope "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/tableServices/default/tables/<table>"
```

For information about assigning roles with PowerShell at the subscription, resource group, or storage account scope, see [Assign Azure roles using Azure CLI](../../role-based-access-control/role-assignments-cli.md).

# [Template](#tab/template)

To learn how to use an Azure Resource Manager template to assign an Azure role, see [Assign Azure roles using Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md).

---

Keep in mind the following points about Azure role assignments in Azure Storage:

- When you create an Azure Storage account, you are not automatically assigned permissions to access data via Azure AD. You must explicitly assign yourself an Azure role for Azure Storage. You can assign it at the level of your subscription, resource group, storage account, or table.
- If the storage account is locked with an Azure Resource Manager read-only lock, then the lock prevents the assignment of Azure roles that are scoped to the storage account or a table.

## Next steps

- [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md)
- [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md)
