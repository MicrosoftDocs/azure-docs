---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 04/04/2024
ms.author: msmbaldwin

# Used by articles that show how to assign a Key Vault access policy

---

To gain permissions to your key vault through [Role-Based Access Control (RBAC)](/azure/key-vault/general/rbac-guide.md), assign a role to your "User Principal Name" (UPN) using the Azure CLI command [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create).

```azurecli
az role assignment create --role "Key Vault Secrets User" --assignee "<upn>" --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.KeyVault/vaults/<your-unique-keyvault-name>"
```

Replace \<upn\>, \<subscription-id\>, \<resource-group-name\> and \<your-unique-keyvault-name\> with your actual values. Your UPN will typically be in the format of an email address (e.g., username@domain.com).
