---
title: Azure Quickstart - Set & retrieve a secret from Key Vault using PowerShell | Microsoft Docs
description: 
services: key-vault
author: barclayn
manager: mbaldwin
tags: azure-resource-manager

ms.assetid: 1126f665-2e6c-4cca-897e-7d61842e8334
ms.service: key-vault
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.date: 08/28/2018
ms.author: barclayn
#Customer intent:As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure

---
# Quickstart: Set and retrieve a secret from Azure Key Vault using PowerShell

Azure Key Vault is a cloud service that works as a secure secrets store. You can securely store keys, passwords, certificates, and other secrets. For more information on Key Vault, you may review the [Overview](key-vault-overview.md). In this quickstart, you use PowerShell to create a key vault. You then store a secret in the newly created vault.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use PowerShell locally, this tutorial requires Azure PowerShell module version 5.1.1 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Login-AzureRmAccount` to create a connection with Azure.

```azurepowershell-interactive
Login-AzureRmAccount
```

## Create a resource group

Create an Azure resource group with [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed. 

```azurepowershell-interactive
New-AzureRmResourceGroup -Name ContosoResourceGroup -Location EastUS
```

## Create a Key Vault

Next you create a Key Vault. When doing this step, you need some information:

Although we use “Contoso KeyVault2” as the name for our Key Vault throughout this quickstart, you must use a unique name.

- **Vault name** Contoso-Vault2.
- **Resource group name** ContosoResourceGroup.
- **Location** East US.

```azurepowershell-interactive
New-AzureRmKeyVault -VaultName 'Contoso-Vault2' -ResourceGroupName 'ContosoResourceGroup' -Location 'East US'
```

The output of this cmdlet shows properties of the newly created key vault. Take note of the two properties listed below:

* **Vault Name**: In the example that is **Contoso-Vault2**. You will use this name for other Key Vault cmdlets.
* **Vault URI**: In this example that is https://contosokeyvault.vault.azure.net/. Applications that use your vault through its REST API must use this URI.

After vault creation your Azure account is the only account allowed to do anything on this new vault.

![Output after Key Vault creation command completes](./media/quick-create-powershell/output-after-creating-keyvault.png)

## Adding a secret to Key Vault

To add a secret to the vault, you just need to take a couple of steps. In this case, you add a password that could be used by an application. The password is called **ExamplePassword** and stores the value of '''**Pa$$w0rd**''' in it.

First convert the value of Pa$$w0rd to a secure string by typing:

```azurepowershell-interactive
$secretvalue = ConvertTo-SecureString 'Pa$$w0rd' -AsPlainText -Force
```

Then, type the PowerShell commands below to create a secret in Key Vault called **ExamplePassword** with the value **Pa$$w0rd** :

```azurepowershell-interactive
$secret = Set-AzureKeyVaultSecret -VaultName 'ContosoKeyVault' -Name 'ExamplePassword' -SecretValue $secretvalue
```

To view the value contained in the secret as plain text:

```azurepowershell-interactive
(Get-AzureKeyVaultSecret -vaultName "Contosokeyvault" -name "ExamplePassword").SecretValueText
```

Now, you have created a Key Vault, stored a secret, and retrieved it.

## Clean up resources

 Other quickstarts and tutorials in this collection build upon this quickstart. If you plan to continue on to work with other quickstarts and tutorials, you may want to leave these resources in place.

When no longer needed, you can use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) command to remove the resource group, Key Vault, and all related resources.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name ContosoResourceGroup
```

## Next steps

In this quickstart, you have created a Key Vault and stored a software key in it. To learn more about Key Vault and how you can use it with your applications continue to the tutorial for web applications working with Key Vault.

> [!div class="nextstepaction"]
> To learn how to read a secret from Key Vault from a web application using managed identities for Azure resources, continue with the following tutorial [Configure an Azure web application to read a secret from Key vault](quick-create-net.md).
