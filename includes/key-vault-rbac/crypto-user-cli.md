---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 04/04/2024
ms.author: msmbaldwin

# Used by articles that show how to assign a Key Vault access policy

---

To grant your application permissions to your key vault through [Role-Based Access Control (RBAC)](/azure/key-vault/general/rbac-guide.md), assign a role using the Azure CLI command [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create).

```azurecli
az role assignment create --role "Key Vault Crypto User" --assignee "<app-id>" --scope "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.KeyVault/vaults/<your-unique-keyvault-name>"
```

Replace \<app-id\>, \<subscription-id\>, \<resource-group-name\> and \<your-unique-keyvault-name\> with your actual values. \<app-id\> is the Application (client) ID of your registered application in Azure AD.
