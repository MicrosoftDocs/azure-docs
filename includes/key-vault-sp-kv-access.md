---
author: msmbaldwin
ms.service: key-vault
ms.subservice: B2C
ms.topic: include
ms.date: 07/20/2020
ms.author: msmbaldwin

# Used by articles that register native client applications in the B2C tenant.

---

Create an access policy for your key vault that grants permission to your service principal by passing `clientId` to the [az keyvault set-policy](/cli/azure/keyvault#az_keyvault_set_policy) command. Give the service principal get, list, and set permissions for both keys and secrets.

```azurecli
az keyvault set-policy -n <your-unique-keyvault-name> --spn <clientId-of-your-service-principal> --secret-permissions delete get list set --key-permissions create decrypt delete encrypt get list unwrapKey wrapKey
```
