---
author: msmbaldwin
ms.service: key-vault
ms.topic: include
ms.date: 07/20/2020
ms.author: msmbaldwin

# Used by articles that register native client applications in the B2C tenant.

---

Let's create a secret called **mySecret**, with a value of **Success!**. A secret might be a password, a SQL connection string, or any other information that you need to keep both secure and available to your application. 

To add a secret to your newly created key vault, use the Azure CLI [az keyvault secret set](/cli/azure/keyvault/secret?view=azure-cli-latest#az-keyvault-secret-set) command:

```azurecli
az keyvault secret set --vault-name "<your-unique-keyvault-name>" --name "mySecret" --value "Success!"
```