---
title: Set up Key Vault using PowerShell
description: How to set up Key Vault for use with a virtual machine using PowerShell.
author: mimckitt
ms.service: virtual-machines
ms.subservice: security
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 01/24/2017
ms.author: mimckitt 
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli

---
# Set up Key Vault for virtual machines using Azure PowerShell

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets 

[!INCLUDE [learn-about-deployment-models](../../../includes/learn-about-deployment-models-rm-include.md)]

In Azure Resource Manager stack, secrets/certificates are modeled as resources that are provided by the resource provider of Key Vault. To learn more about Key Vault, see [What is Azure Key Vault?](../../key-vault/general/overview.md)

> [!NOTE]
> 1. In order for Key Vault to be used with Azure Resource Manager virtual machines, the **EnabledForDeployment** property on Key Vault must be set to true. You can do this in various clients.
> 2. The Key Vault needs to be created in the same subscription and location as the Virtual Machine.
>
>

## Use PowerShell to set up Key Vault
To create a key vault by using PowerShell, see [Set and retrieve a secret from Azure Key Vault using PowerShell](../../key-vault/secrets/quick-create-powershell.md).

For new key vaults, you can use this PowerShell cmdlet:

```azurepowershell
New-AzKeyVault -VaultName 'ContosoKeyVault' -ResourceGroupName 'ContosoResourceGroup' -Location 'East Asia' -EnabledForDeployment
```

For existing key vaults, you can use this PowerShell cmdlet:

```azurepowershell
Set-AzKeyVaultAccessPolicy -VaultName 'ContosoKeyVault' -EnabledForDeployment
```

## Use CLI to set up Key Vault
To create a key vault by using the command-line interface (CLI), see [Manage Key Vault using CLI](../../key-vault/general/manage-with-cli2.md#create-a-key-vault).

For CLI, you have to create the key vault before you assign the deployment policy. You can do this by using the following command:

```azurecli
az keyvault create --name "ContosoKeyVault" --resource-group "ContosoResourceGroup" --location "EastAsia"
```

Then to enable Key Vault for use with template deployment, run the following command:

```azurecli
az keyvault update --name "ContosoKeyVault" --resource-group "ContosoResourceGroup" --enabled-for-deployment "true"
```

## Use templates to set up Key Vault
While you use a template, you need to set the `enabledForDeployment` property to `true` for the Key Vault resource.

```config
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

For other options that you can configure when you create a key vault by using templates, see [Create a key vault](https://azure.microsoft.com/resources/templates/key-vault-create/).
