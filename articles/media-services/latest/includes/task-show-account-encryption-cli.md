---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 05/13/2021
ms.author: inhenkel
ms.custom: CLI, devx-track-azurecli
---

<!--Show Media Services Managed Identity CLI-->

```azurecli-interactive
az ams account encryption show --account-name <your-media-services-account-name> --resource-group <your-resource-group-name>
```

Example JSON response:

```json

{
  "keyVaultProperties": {
    "currentKeyIdentifier": "https://your-key-vault-name.vault.azure.net/keys/your-key-name/523c33b607b644fc88e1640ac408caf9",
    "keyIdentifier": "https://your-key-vault-name.vault.azure.net/keys/your-key-name"
  },
  "type": "CustomerKey"
}
```
