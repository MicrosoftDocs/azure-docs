---
title: 'Quickstart: Set and retrieve a certificate from Azure Key Vault'
description: Quickstart showing how to set and retrieve a certificate from Azure Key Vault using Azure PowerShell
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: certificates
ms.topic: quickstart
ms.custom: mvc, seo-javascript-september2019, seo-javascript-october2019
ms.date: 09/03/2019
ms.author: mbaldwin
#Customer intent:As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure
---
# Quickstart: Set and retrieve a certificate from Azure Key Vault using Azure PowerShell

In this quickstart, you create a key vault in Azure Key Vault with Azure PowerShell. Azure Key Vault is a cloud service that works as a secure secrets store. You can securely store keys, passwords, certificates, and other secrets. For more information on Key Vault you may review the [Overview](../general/overview.md). Azure PowerShell is used to create and manage Azure resources using commands or scripts. Once that you have completed that, you will store a certificate.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this tutorial requires Azure PowerShell module version 1.0.0 or later. Type `$PSVersionTable.PSVersion` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Login-AzAccount` to create a connection with Azure.

```azurepowershell-interactive
Login-AzAccount
```

## Create a resource group

Create an Azure resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed. 

```azurepowershell-interactive
New-AzResourceGroup -Name ContosoResourceGroup -Location EastUS
```

## Create a Key Vault

Next you create a Key Vault. When doing this step, you need some information:

Although we use "Contoso KeyVault2" as the name for our Key Vault throughout this quickstart, you must use a unique name.

- **Vault name** Contoso-Vault2.
- **Resource group name** ContosoResourceGroup.
- **Location** East US.

```azurepowershell-interactive
New-AzKeyVault -Name 'Contoso-Vault2' -ResourceGroupName 'ContosoResourceGroup' -Location 'East US'
```

The output of this cmdlet shows properties of the newly created key vault. Take note of the two properties listed below:

* **Vault Name**: In the example that is **Contoso-Vault2**. You will use this name for other Key Vault cmdlets.
* **Vault URI**: In this example that is https://Contoso-Vault2.vault.azure.net/. Applications that use your vault through its REST API must use this URI.

After vault creation your Azure account is the only account allowed to do anything on this new vault.

![Output after Key Vault creation command completes](../media/quick-create-powershell/output-after-creating-keyvault.png)

## Add a certificate to Key Vault

To add a certificate to the vault, you just need to take a couple of additional steps. This certificate could be used by an application. 

Type the commands below to create a self-signed certificate with policy called **ExampleCertificate** :

```azurepowershell-interactive
$Policy = New-AzKeyVaultCertificatePolicy -SecretContentType "application/x-pkcs12" -SubjectName "CN=contoso.com" -IssuerName "Self" -ValidityInMonths 6 -ReuseKeyOnRenewal
Add-AzKeyVaultCertificate -VaultName "Contoso-Vault2" -Name "ExampleCertificate" -CertificatePolicy $Policy
```

You can now reference this certificate that you added to Azure Key Vault by using its URI. Use **https://Contoso-Vault2.vault.azure.net/certificates/ExampleCertificate** to get the current version. 

To view previously stored certificate:

```azurepowershell-interactive
Get-AzKeyVaultCertificate -VaultName "Contoso-Vault2" -Name "ExampleCertificate"
```

Now, you have created a Key Vault, stored a certificate, and retrieved it.

## Clean up resources

Other quickstarts and tutorials in this collection build upon this quickstart. If you plan to continue on to work with subsequent quickstarts and tutorials, you may wish to leave these resources in place.
When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) command to remove the resource group, and all related resources. You can delete the resources as follows:

```azurepowershell-interactive
Remove-AzResourceGroup -Name ContosoResourceGroup
```

## Next steps

In this quickstart you created a Key Vault and stored a certificate in it. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the reference for the [Azure PowerShell Key Vault cmdlets](/powershell/module/az.keyvault/)
- Review [Azure Key Vault best practices](../general/best-practices.md)
