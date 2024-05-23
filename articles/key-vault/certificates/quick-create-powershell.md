---
title: Quickstart - Set & view Azure Key Vault certificates with Azure PowerShell
description: Quickstart showing how to set and retrieve a certificate from Azure Key Vault using Azure PowerShell
services: key-vault
author: msmbaldwin
ms.service: key-vault
ms.subservice: certificates
ms.topic: quickstart
ms.custom: mvc, devx-track-azurepowershell, mode-api
ms.date: 01/30/2024
ms.author: mbaldwin
#Customer intent: As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure
---
# Quickstart: Set and retrieve a certificate from Azure Key Vault using Azure PowerShell

In this quickstart, you create a key vault in Azure Key Vault with Azure PowerShell. Azure Key Vault is a cloud service that works as a secure secrets store. You can securely store keys, passwords, certificates, and other secrets. For more information on Key Vault, review the [Overview](../general/overview.md). Azure PowerShell is used to create and manage Azure resources using commands or scripts. Afterwards, you store a certificate.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this tutorial requires Azure PowerShell module version 1.0.0 or later. Type `$PSVersionTable.PSVersion` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

```azurepowershell-interactive
Connect-AzAccount
```

## Create a resource group

[!INCLUDE [Create a resource group](../../../includes/powershell-rg-create.md)]

## Create a key vault

[!INCLUDE [Create a key vault](../../../includes/key-vault-powershell-kv-creation.md)]

### Grant access to your key vault

[!INCLUDE [Using RBAC to provide access to a key vault](../../../includes/key-vault-quickstart-rbac-powershell.md)]

## Add a certificate to Key Vault

To can now add a certificate to the vault. This certificate could be used by an application.

Use these commands to create a self-signed certificate with policy called **ExampleCertificate** :

```azurepowershell-interactive
$Policy = New-AzKeyVaultCertificatePolicy -SecretContentType "application/x-pkcs12" -SubjectName "CN=contoso.com" -IssuerName "Self" -ValidityInMonths 6 -ReuseKeyOnRenewal

Add-AzKeyVaultCertificate -VaultName "<your-unique-keyvault-name>" -Name "ExampleCertificate" -CertificatePolicy $Policy
```

You can now reference this certificate that you added to Azure Key Vault by using its URI. Use **`https://<your-unique-keyvault-name>.vault.azure.net/certificates/ExampleCertificate`** to get the current version. 

To view previously stored certificate:

```azurepowershell-interactive
Get-AzKeyVaultCertificate -VaultName "<your-unique-keyvault-name>" -Name "ExampleCertificate"
```

**Troubleshooting**:

Operation returned an invalid status code 'Forbidden'

If you receive this error, the account accessing the Azure Key Vault does not have the proper permissions to create certificates.

Run the following Azure PowerShell command to assign the proper permissions:

```azurepowershell-interactive
Set-AzKeyVaultAccessPolicy -VaultName <KeyVaultName> -ObjectId <AzureObjectID> -PermissionsToCertificates get,list,update,create
```

## Clean up resources

[!INCLUDE [Create a key vault](../../../includes/powershell-rg-delete.md)]

## Next steps

In this quickstart, you created a Key Vault and stored a certificate in it. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the reference for the [Azure PowerShell Key Vault cmdlets](/powershell/module/az.keyvault/)
- Review the [Key Vault security overview](../general/security-features.md)
