---
title: Assign an Azure role for access to blob data
titleSuffix: Azure Storage
description: Learn how to assign permissions for blob data to a Microsoft Entra security principal with Azure role-based access control (Azure RBAC). Azure Storage supports built-in and Azure custom roles for authentication and authorization via Microsoft Entra ID.
author: akashdubey-ms

ms.service: azure-blob-storage
ms.topic: how-to
ms.date: 04/19/2022
ms.author: akashdubey
ms.reviewer: dineshm
ms.devlang: powershell, azurecli
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Assign an Azure role for access to blob data

Microsoft Entra authorizes access rights to secured resources through [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md). Azure Storage defines a set of Azure built-in roles that encompass common sets of permissions used to access blob data.

When an Azure role is assigned to a Microsoft Entra security principal, Azure grants access to those resources for that security principal. A Microsoft Entra security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

To learn more about using Microsoft Entra ID to authorize access to blob data, see [Authorize access to blobs using Microsoft Entra ID](authorize-access-azure-active-directory.md).

> [!NOTE]
> This article shows how to assign an Azure role for access to blob data in a storage account. To learn about assigning roles for management operations in Azure Storage, see [Use the Azure Storage resource provider to access management resources](../common/authorization-resource-provider.md).

## Assign an Azure role

You can use the Azure portal, PowerShell, Azure CLI, or an Azure Resource Manager template to assign a role for data access.

# [Azure portal](#tab/portal)

To access blob data in the Azure portal with Microsoft Entra credentials, a user must have the following role assignments:

- A data access role, such as **Storage Blob Data Reader** or **Storage Blob Data Contributor**
- The Azure Resource Manager **Reader** role, at a minimum

To learn how to assign these roles to a user, follow the instructions provided in [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

The [Reader](../../role-based-access-control/built-in-roles.md#reader) role is an Azure Resource Manager role that permits users to view storage account resources, but not modify them. It does not provide read permissions to data in Azure Storage, but only to account management resources. The **Reader** role is necessary so that users can navigate to blob containers in the Azure portal.

For example, if you assign the **Storage Blob Data Contributor** role to user Mary at the level of a container named **sample-container**, then Mary is granted read, write, and delete access to all of the blobs in that container. However, if Mary wants to view a blob in the Azure portal, then the **Storage Blob Data Contributor** role by itself will not provide sufficient permissions to navigate through the portal to the blob in order to view it. The additional permissions are required to navigate through the portal and view the other resources that are visible there.

A user must be assigned the **Reader** role to use the Azure portal with Microsoft Entra credentials. However, if a user has been assigned a role with **Microsoft.Storage/storageAccounts/listKeys/action** permissions, then the user can use the portal with the storage account keys, via Shared Key authorization. To use the storage account keys, Shared Key access must be permitted for the storage account. For more information on permitting or disallowing Shared Key access, see [Prevent Shared Key authorization for an Azure Storage account](../common/shared-key-authorization-prevent.md).

You can also assign an Azure Resource Manager role that provides additional permissions beyond than the **Reader** role. Assigning the least possible permissions is recommended as a security best practice. For more information, see [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md).

> [!NOTE]
> Prior to assigning yourself a role for data access, you will be able to access data in your storage account via the Azure portal because the Azure portal can also use the account key for data access. For more information, see [Choose how to authorize access to blob data in the Azure portal](../blobs/authorize-data-operations-portal.md).

# [PowerShell](#tab/powershell)

To assign an Azure role to a security principal with PowerShell, call the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command. In order to run the command, you must have a role that includes **Microsoft.Authorization/roleAssignments/write** permissions assigned to you at the corresponding scope or above. 

The format of the command can differ based on the scope of the assignment, but the `-ObjectId` and `-RoleDefinitionName` are required parameters. Passing a value for the `-Scope` parameter, while not required, is highly recommended to retain the principle of least privilege. By limiting roles and scopes, you limit the resources which are at risk if the security principal is ever compromised.

The `-ObjectId` parameter is the Microsoft Entra object ID of the user, group or service principal to which the role will be assigned. To retrieve the identifier, you can use [Get-AzADUser](/powershell/module/az.resources/get-azaduser) to filter Microsoft Entra users, as shown in the following example.

```azurepowershell
Get-AzADUser -DisplayName '<Display Name>'
(Get-AzADUser -StartsWith '<substring>').Id
```

The first response returns the security principal, and the second returns the security principal's object ID.

```Response
UserPrincipalName : markpdaniels@contoso.com
ObjectType        : User
DisplayName       : Mark P. Daniels
Id                : ab12cd34-ef56-ab12-cd34-ef56ab12cd34
Type              : 

ab12cd34-ef56-ab12-cd34-ef56ab12cd34
```

The `-RoleDefinitionName` parameter value is the name of the RBAC role that needs to be assigned to the principal. To access blob data in the Azure portal with Microsoft Entra credentials, a user must have the following role assignments:

- A data access role, such as **Storage Blob Data Contributor** or **Storage Blob Data Reader**
- The Azure Resource Manager **Reader** role

To assign a role scoped to a blob container or a storage account, you should specify a string containing the scope of the resource for the `-Scope` parameter. This action conforms to the principle of least privilege, an information security concept in which a user is given the minimum level of access required to perform their job functions. This practice reduces the potential risk of accidental or intentional damage that unnecessary privileges can bring about.

The scope for a container is in the form:

```
/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobServices/default/containers/<container-name>
```

The scope for a storage account is in the form:

```
/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>
```

To assign a role scoped to a storage account, specify a string containing the scope of the container for the `--scope` parameter.

The following example assigns the **Storage Blob Data Contributor** role to a user, scoped to a container named *sample-container*. Make sure to replace the sample values and the placeholder values in brackets with your own values:

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Storage Blob Data Contributor" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/sample-resource-group/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobServices/default/containers/sample-container"
```

The following example assigns the **Storage Blob Data Reader** role to a user by specifying the object ID. The role assignment is scoped to a storage account named **storage-account**. Make sure to replace the sample values and the placeholder values in brackets with your own values: 

```powershell
New-AzRoleAssignment -ObjectID "ab12cd34-ef56-ab12-cd34-ef56ab12cd34" `
    -RoleDefinitionName "Storage Blob Data Reader" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/sample-resource-group/providers/Microsoft.Storage/storageAccounts/storage-account"
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

To assign an Azure role to a security principal with Azure CLI, use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command. The format of the command can differ based on the scope of the assignment. The format of the command can differ based on the scope of the assignment. In order to run the command, you must have a role that includes **Microsoft.Authorization/roleAssignments/write** permissions assigned to you at the corresponding scope or above.

To assign a role scoped to a container, specify a string containing the scope of the container for the `--scope` parameter. The scope for a container is in the form:

```
/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobServices/default/containers/<container-name>
```

The following example assigns the **Storage Blob Data Contributor** role to a user, scoped to the level of the container. Make sure to replace the sample values and the placeholder values in brackets with your own values:

```azurecli-interactive
az role assignment create \
    --role "Storage Blob Data Contributor" \
    --assignee <email> \
    --scope "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/blobServices/default/containers/<container>"
```

For information about assigning roles with PowerShell at the subscription, resource group, or storage account scope, see [Assign Azure roles using Azure CLI](../../role-based-access-control/role-assignments-cli.md).

# [Template](#tab/template)

To learn how to use an Azure Resource Manager template to assign an Azure role, see [Assign Azure roles using Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md).

---

Keep in mind the following points about Azure role assignments in Azure Storage:

- When you create an Azure Storage account, you are not automatically assigned permissions to access data via Microsoft Entra ID. You must explicitly assign yourself an Azure role for Azure Storage. You can assign it at the level of your subscription, resource group, storage account, or container.
- If the storage account is locked with an Azure Resource Manager read-only lock, then the lock prevents the assignment of Azure roles that are scoped to the storage account or a container.
- If you have set the appropriate allow permissions to access data via Microsoft Entra ID and are unable to access the data, for example you are getting an "AuthorizationPermissionMismatch" error. Be sure to allow enough time for the permissions changes you have made in Microsoft Entra ID to replicate, and be sure that you do not have any deny assignments that block your access, see [Understand Azure deny assignments](../../role-based-access-control/deny-assignments.md).

> [!NOTE]
> You can create custom Azure RBAC roles for granular access to blob data. For more information, see [Azure custom roles](../../role-based-access-control/custom-roles.md).

## Next steps

- [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md)
- [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md)
