---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 04/04/2024
ms.author: msmbaldwin

# Used by articles that show how to assign a Key Vault access policy

---

To grant your application permissions to your key vault through Role-Based Access Control (RBAC), assign a role using the Azure PowerShell cmdlet [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment).

```azurepowershell
New-AzRoleAssignment -RoleDefinitionName "Key Vault Secrets User" -SignInName "<your-email-address>" -Scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.KeyVault/vaults/<your-unique-keyvault-name>"
```

Replace \<your-email-address\>, \<subscription-id\>, \<resource-group-name\> and \<your-unique-keyvault-name\> with your actual values. \<your-email-address\> is your sign-in name; you can instead use the `-ObjectId` parameter and a Microsoft Entra Object ID.
