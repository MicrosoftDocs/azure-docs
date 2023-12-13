---
title: "include file"
description: "include file"
services: storage
author: tamram
ms.service: azure-storage
ms.topic: "include"
ms.date: 06/07/2023
ms.author: tamram
ms.custom: "include file"
---

When you enable customer-managed keys for a new storage account, you must specify a user-assigned managed identity. An existing storage account supports using either a user-assigned managed identity or a system-assigned managed identity to configure customer-managed keys.

When you configure customer-managed keys with a user-assigned managed identity, the user-assigned managed identity is used to authorize access to the key vault that contains the key. You must create the user-assigned identity before you configure customer-managed keys.

A user-assigned managed identity is a standalone Azure resource. To learn more about user-assigned managed identities, see [Managed identity types](../articles/active-directory/managed-identities-azure-resources/overview.md#managed-identity-types). To learn how to create and manage a user-assigned managed identity, see [Manage user-assigned managed identities](../articles/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).

The user-assigned managed identity must have permissions to access the key in the key vault. Assign the **Key Vault Crypto Service Encryption User** role to the user-assigned managed identity with key vault scope to grant these permissions.

### [Azure portal](#tab/azure-portal)

Before you can configure customer-managed keys with a user-assigned managed identity, you must assign the **Key Vault Crypto Service Encryption User** role to the user-assigned managed identity, scoped to the key vault. This role grants the user-assigned managed identity permissions to access the key in the key vault. For more information on assigning Azure RBAC roles with the Azure portal, see [Assign Azure roles using the Azure portal](../articles/role-based-access-control/role-assignments-portal.md).

When you configure customer-managed keys with the Azure portal, you can select an existing user-assigned identity through the portal user interface.

### [PowerShell](#tab/azure-powershell)

The following example shows how to retrieve the user-assigned managed identity and assign to it the required RBAC role, scoped to the key vault. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples:

```azurepowershell
$userIdentity = Get-AzUserAssignedIdentity -Name <user-assigned-identity> `
    -ResourceGroupName $rgName

$principalId = $userIdentity.PrincipalId

New-AzRoleAssignment -ObjectId $principalId `
    -RoleDefinitionName "Key Vault Crypto Service Encryption User" `
    -Scope $keyVault.ResourceId
```

### [Azure CLI](#tab/azure-cli)

The following example shows how to retrieve the user-assigned managed identity and assign to it the required RBAC role, scoped to the key vault. Remember to replace the placeholder values in brackets with your own values and to use the variables defined in the previous examples:

```azurecli
identityResourceId=$(az identity show --name <user-assigned-identity> \
    --resource-group $rgName \
    --query id \
    --output tsv)

principalId=$(az identity show --name <user-assigned-identity> \
    --resource-group $rgName \
    --query principalId \
    --output tsv)

az role assignment create --assignee-object-id $principalId \
    --role "Key Vault Crypto Service Encryption User" \
    --scope $kvResourceId \
    --assignee-principal-type ServicePrincipal
```

---
