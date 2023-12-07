---
title: "include file"
description: "include file"
services: storage
author: alexwolfmsft
ms.service: azure-storage
ms.topic: include
ms.date: 10/11/2022
ms.author: alexwolf
ms.custom: include file
---

When developing locally, make sure that the user account that is accessing blob data has the correct permissions. You'll need **Storage Blob Data Contributor** to read and write blob data. To assign yourself this role, you'll need to be assigned the **User Access Administrator** role, or another role that includes the **Microsoft.Authorization/roleAssignments/write** action. You can assign Azure RBAC roles to a user using the Azure portal, Azure CLI, or Azure PowerShell. You can learn more about the available scopes for role assignments on the [scope overview](../articles/role-based-access-control/scope-overview.md) page.

In this scenario, you'll assign permissions to your user account, scoped to the storage account, to follow the [Principle of Least Privilege](../articles/active-directory/develop/secure-least-privileged-access.md). This practice gives users only the minimum permissions needed and creates more secure production environments.

The following example will assign the **Storage Blob Data Contributor** role to your user account, which provides both read and write access to blob data in your storage account.

> [!IMPORTANT]
> In most cases it will take a minute or two for the role assignment to propagate in Azure, but in rare cases it may take up to eight minutes. If you receive authentication errors when you first run your code, wait a few moments and try again.

### [Azure portal](#tab/roles-azure-portal)

1. In the Azure portal, locate your storage account using the main search bar or left navigation.

2. On the storage account overview page, select **Access control (IAM)** from the left-hand menu.

3. On the **Access control (IAM)** page, select the **Role assignments** tab.

4. Select **+ Add** from the top menu and then **Add role assignment** from the resulting drop-down menu.

    :::image type="content" source="../articles/storage/common/media/assign-role-system-identity.png" lightbox="../articles/storage/common/media/assign-role-system-identity.png" alt-text="A screenshot showing how to assign a role.":::

5. Use the search box to filter the results to the desired role. For this example, search for *Storage Blob Data Contributor* and select the matching result and then choose **Next**.

6. Under **Assign access to**, select **User, group, or service principal**, and then choose **+ Select members**.

7. In the dialog, search for your Microsoft Entra username (usually your *user@domain* email address) and then choose **Select** at the bottom of the dialog.

8. Select **Review + assign** to go to the final page, and then **Review + assign** again to complete the process.

### [Azure CLI](#tab/roles-azure-cli)

To assign a role at the resource level using the Azure CLI, you first must retrieve the resource id using the `az storage account show` command. You can filter the output properties using the `--query` parameter.

```azurecli
az storage account show --resource-group '<your-resource-group-name>' --name '<your-storage-account-name>' --query id
```

Copy the output `Id` from the preceding command. You can then assign roles using the [az role](/cli/azure/role) command of the Azure CLI.

```azurecli
az role assignment create --assignee "<user@domain>" \
    --role "Storage Blob Data Contributor" \
    --scope "<your-resource-id>"
```

### [PowerShell](#tab/roles-powershell)

To assign a role at the resource level using Azure PowerShell, you first must retrieve the resource ID using the `Get-AzResource` command.

```azurepowershell
Get-AzResource -ResourceGroupName "<yourResourceGroupname>" -Name "<yourStorageAccountName>"
```

Copy the `Id` value from the preceding command output. You can then assign roles using the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command in PowerShell.

```azurepowershell
New-AzRoleAssignment -SignInName <user@domain> `
    -RoleDefinitionName "Storage Blob Data Contributor" `
    -Scope <yourStorageAccountId>
```

---
