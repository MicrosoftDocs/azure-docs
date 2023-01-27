---
title: Set up Azure Key Vault using CLI 
description: How to set up Key Vault for virtual machine using the Azure CLI.
author: mimckitt
ms.service: virtual-machines
ms.topic: how-to
ms.date: 10/20/2022
ms.author: mimckitt 
ms.custom: devx-track-azurecli

---
# How to set up Key Vault for virtual machines with the Azure CLI

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

In the Azure Resource Manager stack, secrets/certificates are modeled as resources that are provided by Key Vault. To learn more about Azure Key Vault, see [What is Azure Key Vault?](../../key-vault/general/overview.md) In order for Key Vault to be used with Azure Resource Manager VMs, the *EnabledForDeployment* property on Key Vault must be set to true. This article shows you how to set up Key Vault for use with Azure virtual machines (VMs) using the Azure CLI. 

To perform these steps, you need the latest [Azure CLI](/cli/azure/install-az-cli2) installed and logged in to an Azure account using [az login](/cli/azure/reference-index).

## Create a Key Vault
Create a key vault and assign the deployment policy with [az keyvault create](/cli/azure/keyvault). The following example creates a key vault named `myKeyVault` in the `myResourceGroup` resource group:

```azurecli-interactive
az keyvault create -l westus -n myKeyVault -g myResourceGroup --enabled-for-deployment true
```

## Update a Key Vault for use with VMs
Set the deployment policy on an existing key vault with [az keyvault update](/cli/azure/keyvault). The following updates the key vault named `myKeyVault` in the `myResourceGroup` resource group:

```azurecli-interactive
az keyvault update -n myKeyVault -g myResourceGroup --set properties.enabledForDeployment=true
```

## Use templates to set up Key Vault
When you use a template, you need to set the `enabledForDeployment` property to `true` for the Key Vault resource as follows:

```json
{
    "type": "Microsoft.KeyVault/vaults",
    "name": "ContosoKeyVault",
    "apiVersion": "2015-06-01",
    "location": "<location-of-key-vault>",
    "properties": {
    "enabledForDeployment": "true",
    ....
    ....
    }
}
```

## Next steps
For other options that you can configure when you create a Key Vault by using templates, see [Create a key vault](https://azure.microsoft.com/resources/templates/key-vault-create/).
