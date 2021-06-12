---
title: Quickstart - Set & view Azure Key Vault certificates with Azure PowerShell
description: Quickstart showing how to set and retrieve a certificate from Azure Key Vault using Azure PowerShell
services: key-vault
author: msmbaldwin
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: certificates
ms.topic: quickstart
ms.custom: mvc, seo-javascript-september2019, seo-javascript-october2019, devx-track-azurepowershell
ms.date: 01/27/2021
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

[!INCLUDE [Create a resource group](../../../includes/key-vault-powershell-rg-creation.md)]

## Create a key vault

[!INCLUDE [Create a key vault](../../../includes/key-vault-powershell-kv-creation.md)]

## Add a certificate to Key Vault

To add a certificate to the vault, you just need to take a couple of additional steps. This certificate could be used by an application. 

Type the commands below to create a self-signed certificate with policy called **ExampleCertificate** :

```azurepowershell-interactive
$Policy = New-AzKeyVaultCertificatePolicy -SecretContentType "application/x-pkcs12" -SubjectName "CN=contoso.com" -IssuerName "Self" -ValidityInMonths 6 -ReuseKeyOnRenewal

Add-AzKeyVaultCertificate -VaultName "<your-unique-keyvault-name>" -Name "ExampleCertificate" -CertificatePolicy $Policy
```

You can now reference this certificate that you added to Azure Key Vault by using its URI. Use **"https://<your-unique-keyvault-name>.vault.azure.net/certificates/ExampleCertificate"** to get the current version. 

To view previously stored certificate:

```azurepowershell-interactive
Get-AzKeyVaultCertificate -VaultName "<your-unique-keyvault-name>" -Name "ExampleCertificate"
```

Now, you have created a Key Vault, stored a certificate, and retrieved it.

**Troubleshooting**:

Operation returned an invalid status code 'Forbidden'

If you receive this error, the account accessing the Azure Key Vault does not have the proper permissions to create certificates.

Run the following Azure PowerShell command to assign the proper permissions:

```azurepowershell-interactive
Set-AzKeyVaultAccessPolicy -VaultName <KeyVaultName> -ObjectId <AzureObjectID> -PermissionsToCertificates get,list,update,create
```

## Clean up resources

[!INCLUDE [Create a key vault](../../../includes/key-vault-powershell-delete-resources.md)]

## Next steps

In this quickstart you created a Key Vault and stored a certificate in it. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the reference for the [Azure PowerShell Key Vault cmdlets](/powershell/module/az.keyvault/)
- Review the [Key Vault security overview](../general/security-features.md)
