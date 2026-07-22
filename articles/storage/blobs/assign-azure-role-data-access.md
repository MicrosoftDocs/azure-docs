---
title: Assign an Azure Role for Blob Data Access
titleSuffix: Azure Storage
description: Assign Azure roles for blob data access with Azure RBAC and Microsoft Entra ID. Follow this guide to grant least-privilege permissions securely.
author: stevenmatthew
ms.author: shaas
ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 05/08/2026
ms.reviewer: dineshm
ms.devlang: powershell
# ms.devlang: powershell, azurecli
ms.custom: devx-track-azurepowershell, devx-track-azurecli
# Customer intent: As an IT administrator, I want to assign Azure roles for accessing blob data to security principals, so that I can ensure the right permissions are granted for secure and efficient data access management.
---

# Assign an Azure role for access to blob data

<!-- replaycheck-task id="cb105ef6" -->
<!-- replaycheck-task id="e3ce9356" -->
<!-- replaycheck-task id="2de8753c" -->
<!-- replaycheck-task id="542306be" -->
<!-- replaycheck-task id="57011072" -->
<!-- replaycheck-task id="c0f2f9d5" -->
Assign an Azure role for access to blob data by using [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) and Microsoft Entra ID. Azure Storage built-in and custom roles help you grant least-privilege access to users, groups, and applications.

When you assign an Azure role to a Microsoft Entra security principal, you grant access to those resources for that security principal. A Microsoft Entra security principal can be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

To learn more about using Microsoft Entra ID to authorize access to blob data, see [Authorize access to blobs using Microsoft Entra ID](authorize-access-azure-active-directory.md).

When you create an Azure Storage account, you aren't automatically assigned permissions to access data via Microsoft Entra ID. You must explicitly assign yourself an Azure role for Azure Storage. You can assign it at the level of your subscription, resource group, storage account, or container.

This article shows how to assign an Azure role for access to blob data in a storage account. To learn about assigning roles for management operations in Azure Storage, see [Use the Azure Storage resource provider to access management resources](../common/authorization-resource-provider.md).

> [!NOTE]
> You can create custom Azure RBAC roles for granular access to blob data. For more information, see [Azure custom roles](../../role-based-access-control/custom-roles.md).

## Assign an Azure role

You can use the Azure portal, PowerShell, Azure CLI, or an Azure Resource Manager template to assign a role for data access.

# [Azure portal](#tab/portal)

1. First, decide which roles you want to assign. To find a list of blob data access roles, see [Azure built-in roles for blobs](authorize-access-azure-active-directory.md#azure-built-in-roles-for-blobs).

   > [!NOTE]
   > To access blob data in the Azure portal by using Microsoft Entra credentials, a user must have the Azure Resource Manager **Reader** role, at a minimum, in addition to a data access role such as the **Storage Blob Data Reader** or **Storage Blob Data Contributor** role. See [Data access from the Azure portal](authorize-access-azure-active-directory.md#data-access-from-the-azure-portal).

1. Assign roles to users. To assign an Azure role, see [Assign Azure roles using the Azure portal](/azure/role-based-access-control/role-assignments-portal). While that article isn't specific to Azure Storage, the steps to assign roles are consistent for all Azure services. 

# [PowerShell](#tab/powershell)

To assign an Azure role to a security principal by using PowerShell, call the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command. To run the command, you need a role that includes **Microsoft.Authorization/roleAssignments/write** permissions assigned to you at the corresponding scope or higher. 

The format of the command can differ based on the scope of the assignment, but the `-ObjectId` and `-RoleDefinitionName` parameters are required. While the `-Scope` parameter isn't required, include it to retain the principle of least privilege. By limiting roles and scopes, you limit the resources that are at risk if the security principal is ever compromised.

The `-ObjectId` parameter is the Microsoft Entra object ID of the user, group, or service principal to which you're assigning the role. To retrieve the identifier, use [Get-AzADUser](/powershell/module/az.resources/get-azaduser) to filter Microsoft Entra users, as shown in the following example.

```azurepowershell
Get-AzADUser -DisplayName '<Display Name>'
(Get-AzADUser -StartsWith '<substring>').Id
```

The first response returns the security principal, and the second returns the security principal's object ID.

```Response
UserPrincipalName : markpdaniels@contoso.com
ObjectType        : User
DisplayName       : Mark P. Daniels
Id                : aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb
Type              : 

aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb
```

The `-RoleDefinitionName` parameter value is the name of the RBAC role that needs to be assigned to the principal. To access blob data in the Azure portal with Microsoft Entra credentials, a user must have the following role assignments:

- A data access role, such as **Storage Blob Data Contributor** or **Storage Blob Data Reader**
- The Azure Resource Manager **Reader** role

To assign a role scoped to a blob container or a storage account, specify a string containing the scope of the resource for the `-Scope` parameter. This action conforms to the principle of least privilege, an information security concept in which a user is given the minimum level of access required to perform their job functions. This practice reduces the potential risk of accidental or intentional damage that unnecessary privileges can bring about.

The scope for a container is in the form:

```
/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>/blobServices/default/containers/<container-name>
```

The scope for a storage account is in the form:

```
/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>
```

To assign a role scoped to a storage account, specify a string containing the scope of the container for the `--scope` parameter.

The following example assigns the **Storage Blob Data Contributor** role to a user. The role assignment is scoped to level of the container. Make sure to replace the sample values and the placeholder values in brackets (`<>`) with your own values:

<!-- replaycheck-task id="fee1778" -->
```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Storage Blob Data Contributor" `
    -Scope  "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>/blobServices/default/containers/<container-name>"
```

The following example assigns the **Storage Blob Data Reader** role to a user by specifying the object ID. The role assignment is scoped to the level of the storage account. Make sure to replace the sample values and the placeholder values in brackets (`<>`) with your own values: 

<!-- replaycheck-task id="3361d580" -->
```powershell
New-AzRoleAssignment -ObjectID "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb" `
    -RoleDefinitionName "Storage Blob Data Reader" `
    -Scope  "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"
```

Your output should be similar to the following:

```Response
RoleAssignmentId   : /subscriptions/<subscription ID>/resourceGroups/<Resource Group>/providers/Microsoft.Storage/storageAccounts/<Storage Account>/providers/Microsoft.Authorization/roleAssignments/<Role Assignment ID>
Scope              : /subscriptions/<subscription ID>/resourceGroups/<Resource Group>/providers/Microsoft.Storage/storageAccounts/<Storage Account>
DisplayName        : Mark Patrick
SignInName         : markpdaniels@contoso.com
RoleDefinitionName : Storage Blob Data Reader
RoleDefinitionId   : <Role Definition ID>
ObjectId           : <Object ID>
ObjectType         : User
CanDelegate        : False
```
For information about assigning roles with PowerShell at the subscription or resource group scope, see [Assign Azure roles using Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md).

# [Azure CLI](#tab/azure-cli)

To assign an Azure role to a security principal by using Azure CLI, use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command. The format of the command can differ based on the scope of the assignment. To run the command, you must have a role that includes **Microsoft.Authorization/roleAssignments/write** permissions assigned to you at the corresponding scope or higher.

To assign a role scoped to a container, specify a string containing the scope of the container for the `--scope` parameter. The scope for a container is in the form:

```
/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>/blobServices/default/containers/<container-name>
```

The following example assigns the **Storage Blob Data Contributor** role to a user. The role assignment is scoped to the level of the container. Make sure to replace the sample values and the placeholder values in brackets (`<>`) with your own values:

<!-- replaycheck-task id="60f1639b" -->
```azurecli-interactive
az role assignment create \
    --role "Storage Blob Data Contributor" \
    --assignee <email> \
    --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>/blobServices/default/containers/<container-name>"
```

The following example assigns the **Storage Blob Data Reader** role to a user by specifying the object ID. To learn more about the `--assignee-object-id` and `--assignee-principal-type` parameters, see [az role assignment](/cli/azure/role/assignment). In this example, the role assignment is scoped to the level of the storage account. Make sure to replace the sample values and the placeholder values in brackets (`<>`) with your own values: 

<!-- replaycheck-task id="8cdad632" -->
```azurecli-interactive
az role assignment create \
    --role "Storage Blob Data Reader" \
    --assignee-object-id "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb" \
    --assignee-principal-type "User" \
    --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Storage/storageAccounts/<storage-account-name>"
```

When you assign roles or remove role assignments, it can take up to 10 minutes for changes to take effect.

For information about assigning roles with Azure CLI at the subscription, resource group, or storage account scope, see [Assign Azure roles using Azure CLI](../../role-based-access-control/role-assignments-cli.md).

# [Template](#tab/template)

To learn how to use an Azure Resource Manager template to assign an Azure role, see [Assign Azure roles using Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md).

---

When you assign roles or remove role assignments, it can take up to 10 minutes for changes to take effect. If you assign roles at the management group scope, it can take much longer. See [Role assignment propagation delays for blob data access](authorize-access-azure-active-directory.md#role-assignment-propagation-delays-for-blob-data-access).

> [!NOTE]
> If the storage account is locked with an Azure Resource Manager read-only lock, then the lock prevents the assignment of Azure roles that are scoped to the storage account or a container.



## Next steps

- [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md)
- [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md)

