---
title: Assign an Azure role for access to queue data
titleSuffix: Azure Storage
description: Learn how to assign permissions for queue data to a Microsoft Entra security principal with Azure role-based access control (Azure RBAC). Azure Storage supports built-in and Azure custom roles for authentication and authorization via Microsoft Entra ID.
services: storage
author: akashdubey-ms

ms.service: azure-queue-storage
ms.topic: how-to
ms.date: 07/13/2021
ms.author: akashdubey
ms.reviewer: dineshm
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
---

# Assign an Azure role for access to queue data

Microsoft Entra authorizes access rights to secured resources through [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md). Azure Storage defines a set of Azure built-in roles that encompass common sets of permissions used to access queue data.

When an Azure role is assigned to a Microsoft Entra security principal, Azure grants access to those resources for that security principal. A Microsoft Entra security principal may be a user, a group, an application service principal, or a [managed identity for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md).

To learn more about using Microsoft Entra ID to authorize access to queue data, see [Authorize access to queues using Microsoft Entra ID](authorize-access-azure-active-directory.md).

> [!NOTE]
> This article shows how to assign an Azure role for access to queue data in a storage account. To learn about assigning roles for management operations in Azure Storage, see [Use the Azure Storage resource provider to access management resources](../common/authorization-resource-provider.md).

## Assign an Azure role

You can use the Azure portal, PowerShell, Azure CLI, or an Azure Resource Manager template to assign a role for data access.

# [Azure portal](#tab/portal)

To access queue data in the Azure portal with Microsoft Entra credentials, a user must have the following role assignments:

- A data access role, such as **Storage Queue Data Contributor**
- The Azure Resource Manager **Reader** role

To learn how to assign these roles to a user, follow the instructions provided in [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

The [Reader](../../role-based-access-control/built-in-roles.md#reader) role is an Azure Resource Manager role that permits users to view storage account resources, but not modify them. It does not provide read permissions to data in Azure Storage, but only to account management resources. The **Reader** role is necessary so that users can navigate to queues and messages in the Azure portal.

For example, if you assign the **Storage Queue Data Contributor** role to user Mary at the level of a queue named **sample-queue**, then Mary is granted read, write, and delete access to that queue. However, if Mary wants to view a queue in the Azure portal, then the **Storage Queue Data Contributor** role by itself will not provide sufficient permissions to navigate through the portal to the queue in order to view it. The additional permissions are required to navigate through the portal and view the other resources that are visible there.

A user must be assigned the **Reader** role to use the Azure portal with Microsoft Entra credentials. However, if a user has been assigned a role with **Microsoft.Storage/storageAccounts/listKeys/action** permissions, then the user can use the portal with the storage account keys, via Shared Key authorization. To use the storage account keys, Shared Key access must be permitted for the storage account. For more information on permitting or disallowing Shared Key access, see [Prevent Shared Key authorization for an Azure Storage account](../common/shared-key-authorization-prevent.md).

You can also assign an Azure Resource Manager role that provides additional permissions beyond than the **Reader** role. Assigning the least possible permissions is recommended as a security best practice. For more information, see [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md).

> [!NOTE]
> Prior to assigning yourself a role for data access, you will be able to access data in your storage account via the Azure portal because the Azure portal can also use the account key for data access. For more information, see [Choose how to authorize access to queue data in the Azure portal](../queues/authorize-data-operations-portal.md).

# [PowerShell](#tab/powershell)

To assign an Azure role to a security principal, call the [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment) command. The format of the command can differ based on the scope of the assignment. In order to run the command, you must have a role that includes **Microsoft.Authorization/roleAssignments/write** permissions assigned to you at the corresponding scope or above.

To assign a role scoped to a queue, specify a string containing the scope of the queue for the `--scope` parameter. The scope for a queue is in the form:

```
/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/queueServices/default/queues/<queue-name>
```

The following example assigns the **Storage Queue Data Contributor** role to a user, scoped to a queue named *sample-queue*. Make sure to replace the sample values and the placeholder values in brackets with your own values: 

```powershell
New-AzRoleAssignment -SignInName <email> `
    -RoleDefinitionName "Storage Queue Data Contributor" `
    -Scope  "/subscriptions/<subscription>/resourceGroups/sample-resource-group/providers/Microsoft.Storage/storageAccounts/<storage-account>/queueServices/default/queues/sample-queue"
```

For information about assigning roles with PowerShell at the subscription, resource group, or storage account scope, see [Assign Azure roles using Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md).

# [Azure CLI](#tab/azure-cli)

To assign an Azure role to a security principal, use the [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) command. The format of the command can differ based on the scope of the assignment. The format of the command can differ based on the scope of the assignment. In order to run the command, you must have a role that includes **Microsoft.Authorization/roleAssignments/write** permissions assigned to you at the corresponding scope or above.

To assign a role scoped to a queue, specify a string containing the scope of the queue for the `--scope` parameter. The scope for a queue is in the form:

```
/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/queueServices/default/queues/<queue-name>
```

The following example assigns the **Storage Queue Data Contributor** role to a user, scoped to the level of the queue. Make sure to replace the sample values and the placeholder values in brackets with your own values:

```azurecli-interactive
az role assignment create \
    --role "Storage Queue Data Contributor" \
    --assignee <email> \
    --scope "/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/queueServices/default/queues/<queue>"
```

For information about assigning roles with PowerShell at the subscription, resource group, or storage account scope, see [Assign Azure roles using Azure CLI](../../role-based-access-control/role-assignments-cli.md).

# [Template](#tab/template)

To learn how to use an Azure Resource Manager template to assign an Azure role, see [Assign Azure roles using Azure Resource Manager templates](../../role-based-access-control/role-assignments-template.md).

---

Keep in mind the following points about Azure role assignments in Azure Storage:

- When you create an Azure Storage account, you are not automatically assigned permissions to access data via Microsoft Entra ID. You must explicitly assign yourself an Azure role for Azure Storage. You can assign it at the level of your subscription, resource group, storage account, or queue.
- If the storage account is locked with an Azure Resource Manager read-only lock, then the lock prevents the assignment of Azure roles that are scoped to the storage account or a queue.

## Next steps

- [What is Azure role-based access control (Azure RBAC)?](../../role-based-access-control/overview.md)
- [Best practices for Azure RBAC](../../role-based-access-control/best-practices.md)
