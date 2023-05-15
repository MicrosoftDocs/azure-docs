---
title: Create and retrieve attributes of a managed key in Azure Key Vault – Azure PowerShell
description: Quickstart showing how to set and retrieve a managed key from Azure Key Vault using Azure PowerShell
author: msmbaldwin
ms.author: mbaldwin
ms.date: 05/05/2023
ms.topic: quickstart
ms.service: key-vault
ms.subservice: keys
tags: azure-resource-manager
ms.custom: devx-track-azurepowershell, mode-api
#Customer intent: As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure
---
# Quickstart: Provision and activate a Managed HSM using PowerShell

In this quickstart, you will create and activate an Azure Key Vault Managed HSM (Hardware Security Module) with PowerShell. Managed HSM is a fully managed, highly available, single-tenant, standards-compliant cloud service that enables you to safeguard cryptographic keys for your cloud applications, using **FIPS  140-2 Level 3** validated HSMs. For more information on Managed HSM, you may review the [Overview](overview.md). 

If you choose to install and use PowerShell locally, this tutorial requires Azure PowerShell module version 1.0.0 or later. Type `$PSVersionTable.PSVersion` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azure-powershell). If you are running PowerShell locally, you also need to run `Connect-AzAccount` to create a connection with Azure.

```azurepowershell-interactive
Connect-AzAccount
```

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Use the Azure PowerShell [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet to create a resource group named *myResourceGroup* in the *eastus2* location. 

```azurepowershell-interactive
New-AzResourceGroup -Name "myResourceGroup" -Location "eastus2"
```

## Get your principal ID

To create a Managed HSM, you will need your Azure Active Directory principal ID.  To obtain your ID, use the Azure PowerShell [Get-AzADUser](/powershell/module/az.resources/get-azaduser) cmdlet, passing your email address to the "UserPrincipalName" parameter:

```azurepowershell-interactive
Get-AzADUser -UserPrincipalName "<your@email.address>"
```

Your principal ID will be returned in the format, "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".

## Create a Managed HSM

Creating a Managed HSM is a two-step process:
1. Provision a Managed HSM resource.
2. Activate your Managed HSM by downloading an artifact called the *security domain*.

### Provision a Managed HSM

Use the Azure PowerShell [New-AzKeyVaultManagedHsm](/powershell/module/az.keyvault/new-azkeyvaultmanagedhsm) cmdlet to create a new Managed HSM. You will need to provide some information:

- Managed HSM name: A string of 3 to 24 characters that can contain only numbers (0-9), letters (a-z, A-Z), and hyphens (-)

  > [!Important]
  > Each Managed HSM must have a unique name. Replace \<your-unique-managed-hsm-name\> with the name of your Managed HSM in the following examples.

- Resource group name: **myResourceGroup**.
- The location: **East US 2**.
- Your principal ID: Pass the Azure Active Directory principal ID that you obtained in the last section to the "Administrator" parameter. 

```azurepowershell-interactive
New-AzKeyVaultManagedHsm -Name "your-unique-managed-hsm-name" -ResourceGroupName "myResourceGroup" -Location "eastus2" -Administrator "your-principal-ID" -SoftDeleteRetentionInDays "# of days to retain the managed hsm after softdelete"
```
> [!NOTE]
> The create command can take a few minutes. Once it returns successfully you are ready to activate your HSM.

The output of this cmdlet shows properties of the newly created Managed HSM. Take note of these two properties:

- **Name**: The name you provided for the Managed HSM.
- **HsmUri**: In the example, this is https://&lt;your-unique-managed-hsm-name&gt;.managedhsm.azure.net/. Applications that use your vault through its REST API must use this URI.

At this point, your Azure account is the only one authorized to perform any operations on this new HSM.

### Activate your Managed HSM

All data plane commands are disabled until the HSM is activated. You will not be able to create keys or assign roles. Only the designated administrators that were assigned during the create command can activate the HSM. To activate the HSM, you must download the [Security Domain](security-domain.md).

To activate your HSM, you will need:
- To provide a minimum of three RSA key-pairs (up to a maximum of 10)
- To specify the minimum number of keys required to decrypt the security domain (called a *quorum*)


To activate the HSM, you send at least three (maximum 10) RSA public keys to the HSM. The HSM encrypts the security domain with these keys and sends it back. Once this security domain download is successfully completed, your HSM is ready to use. You also need to specify quorum, which is the minimum number of private keys required to decrypt the security domain.

The following example shows how to use `openssl` (available for Windows [here](https://slproweb.com/products/Win32OpenSSL.html)) to generate three self-signed certificates.

```console
openssl req -newkey rsa:2048 -nodes -keyout cert_0.key -x509 -days 365 -out cert_0.cer
openssl req -newkey rsa:2048 -nodes -keyout cert_1.key -x509 -days 365 -out cert_1.cer
openssl req -newkey rsa:2048 -nodes -keyout cert_2.key -x509 -days 365 -out cert_2.cer
```

> [!IMPORTANT]
> Create and store the RSA key pairs and security domain file generated in this step securely.

Use the Azure PowerShell [Export-AzKeyVaultSecurityDomain](/powershell/module/az.keyvault/export-azkeyvaultsecuritydomain) cmdlet to download the security domain and activate your Managed HSM. The following example uses three RSA key pairs (only public keys are needed for this command) and sets the quorum to two.

```azurepowershell-interactive
Export-AzKeyVaultSecurityDomain -Name "<your-unique-managed-hsm-name>" -Certificates "cert_0.cer", "cert_1.cer", "cert_2.cer" -OutputPath "MHSMsd.ps.json" -Quorum 2
```

Please store the security domain file and the RSA key pairs securely. You will need them for disaster recovery or for creating another Managed HSM that shares same security domain so the two can share keys.

After successfully downloading the security domain, your HSM will be in an active state and ready for you to use.

## Clean up resources

[!INCLUDE [Create a key vault](../../../includes/powershell-rg-delete.md)]

> [!WARNING]
> Deleting the resource group puts the Managed HSM into a soft-deleted state. The Managed HSM will continue to be billed until it is purged. See [Managed HSM soft-delete and purge protection](recovery.md)
## Next steps

In this quickstart, you created and activated a Managed HSM. To learn more about Managed HSM and how to integrate it with your applications, continue on to these articles:

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the reference for the [Azure PowerShell Key Vault cmdlets](/powershell/module/az.keyvault/)
- Review the [Key Vault security overview](../general/security-features.md)
