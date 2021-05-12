---
author: IngridAtMicrosoft
ms.service: media-services 
ms.topic: include
ms.date: 08/17/2020
ms.author: inhenkel
ms.custom: CLI
---

<!-- Create a resource group -->

Use the following commands to create a Key Vault and key. Change `your-resource-group-name`, `your-keyvault-name` and `your-key-name`  to the values you want to use. The command assumes that you have already created a resource group.

> [!NOTE]
> The `--bypass AzureServices` value is for using a Managed Identity with the Key Vault, which is required for this use case. The  `--enable-purge-protection` value is optional and is to keep your data from accidental deletion.

### Create the keyvault

```azurecli-interactive

az keyvault create \
  --resource-group your-resource-group-name \
  --bypass AzureServices \
  --enable-purge-protection \
  --name your-keyvault-name

```

### Create the key

```azurecli-interactive
az keyvault key create --kty RSA --name your-key-name --vault-name your-keyvault-name

```
