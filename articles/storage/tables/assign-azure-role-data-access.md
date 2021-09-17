---
title: Assign an Azure role for access to table data (preview)
titleSuffix: Azure Storage
description: Learn how to assign permissions for table data (preview) to an Azure Active Directory security principal with Azure role-based access control (Azure RBAC). Azure Storage supports built-in and Azure custom roles for authentication and authorization via Azure AD.
services: storage
author: tamram

ms.service: storage
ms.topic: how-to
ms.date: 07/13/2021
ms.author: tamram
ms.reviewer: dineshm
ms.subservice: common 
ms.custom: devx-track-azurepowershell
---

# Assign an Azure role for access to table data (preview)

Azure Active Directory (Azure AD) authorizes access rights to secured resources through [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md). Azure Storage defines a set of Azure built-in roles that encompass common sets of permissions used to access table data in Azure Storage (preview).

When an Azure role is assigned to an Azure AD security principal, Azure grants access to those resources for that security principal. An Azure AD security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

To learn more about using Azure AD to authorize access to table data, see [Authorize access to tables using Azure Active Directory](authorize-access-azure-active-directory.md).

> [!IMPORTANT]
> Authorization with Azure AD for tables is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Assign an Azure role

You can use PowerShell, Azure CLI, or an Azure Resource Manager template to assign a role for data access.

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

To assign an Azure role to a security principal, use the [az role assignment create](/cli/azure/role/assignment#az_role_assignment_create) command. The format of the command can differ based on the scope of the assignment. The format of the command can differ based on the scope of the assignment. In order to run the command, you must have a role that includes **Microsoft.Authorization/roleAssignments/write** permissions assigned to you at the corresponding scope or above.

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
- The preview version of Storage Explorer in the Azure portal does not support using Azure AD credentials to view and modify table data. Storage Explorer in the Azure portal always uses the account keys to access data. To use Storage Explorer in the Azure portal, you must be assigned a role that includes **Microsoft.Storage/storageAccounts/listkeys/action**.

## Next steps

- [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md)
- [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md)
