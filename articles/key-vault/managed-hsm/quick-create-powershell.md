---
title: Create and retrieve attributes of a managed key in Azure Key Vault – Azure PowerShell
description: Quickstart showing how to set and retrieve a managed key from Azure Key Vault using Azure PowerShell
services: key-vault
author: msmbaldwin
ms.author: mbaldwin
ms.date: 01/26/2021
ms.topic: quickstart
ms.service: key-vault
ms.subservice: keys
tags:
  - azure-resource-manager
ms.custom:
  - mode-api
#Customer intent: As a security admin who is new to Azure, I want to use Key Vault to securely store keys and passwords in Azure
---
# Quickstart: Set and retrieve a managed key from Azure Key Vault using PowerShell

In this quickstart, you create a key vault in Azure Key Vault with Azure PowerShell. Azure Key Vault is a cloud service that works as a secure secrets store. You can securely store keys, passwords, certificates, and other secrets. For more information on Key Vault you may review the [Overview](../general/overview.md). Azure PowerShell is used to create and manage Azure resources using commands or scripts. Once that you have completed that, you will store a key.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use PowerShell locally, this tutorial requires Azure PowerShell module version 1.0.0 or later. Type `$PSVersionTable.PSVersion` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-az-ps). If you are running PowerShell locally, you also need to run `Login-AzAccount` to create a connection with Azure.

```azurepowershell-interactive
Login-AzAccount
```

## Create a resource group

A resource group is a logical container into which Azure resources are deployed and managed. Use the Azure PowerShell [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet to create a resource group named *myResourceGroup* in the *westus* location. 

```azurepowershell-interactive
New-AzResourceGroup -Name "myResourceGroup" -Location "WestUS"

## Get your principal ID

To create a managed HSM, you will need your Azure Active Directory principal ID.  To obtain your ID, use the Azure PowerShell [Get-AzADUser](/powershell/module/az.resources/get-azaduser) cmdlet, passing your email address to the "UserPrincipalName" parameter:

```azurepowershell-interactive
Get-AzADUser -UserPrincipalName "<your@email.address>"
```

Your principal ID will be returned in the format, "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx".

## Create a managed HSM

Use the Azure PowerShell [New-AzKeyVaultManagedHsm](/powershell/module/az.keyvault/new-azkeyvaultmanagedhsm) cmdlet to create a new Key Vault managed HSM. You will need to provide some information:

- Managed HSM name: A string of 3 to 24 characters that can contain only numbers (0-9), letters (a-z, A-Z), and hyphens (-)

  > [!Important]
  > Each managed HSM must have a unique name. Replace <your-unique-managed-hsm-name> with the name of your managed HSM in the following examples.

- Resource group name: **myResourceGroup**.
- The location: **EastUS**.
- Your principal ID: Pass the Azure Active Directory principal ID that you obtained in the last section to the "Administrator" parameter. 

```azurepowershell-interactive
New-AzKeyVaultManagedHsm -Name "<your-unique-managed-hsm-name>" -ResourceGroupName "myResourceGroup" -Location "West US" -Administrator "<your-principal-ID>"
```

The output of this cmdlet shows properties of the newly created managed HSM. Take note of the two properties listed below:

- **Managed HSM Name**: The name you provided to the --name parameter above.
- **Vault URI**: In the example, this is https://&lt;your-unique-managed-hsm-name&gt;.vault.azure.net/. Applications that use your vault through its REST API must use this URI.

At this point, your Azure account is the only one authorized to perform any operations on this new vault.

## Activate your managed HSM

All data plane commands are disabled until the HSM is activated. You will not be able to create keys or assign roles. Only the designated administrators that were assigned during the create command can activate the HSM. To activate the HSM you must download the [Security Domain](security-domain.md).

To activate your HSM you need:
- Minimum 3 RSA key-pairs (maximum 10)
- Specify minimum number of keys required to decrypt the security domain (quorum)

To activate the HSM you send at least 3 (maximum 10) RSA public keys to the HSM. The HSM encrypts the security domain with these keys and sends it back. Once this security domain download is successfully completed, your HSM is ready to use. You also need to specify quorum, which is the minimum number of private keys required to decrypt the security domain.

The example below shows how to use `openssl` (available for Windows [here](https://slproweb.com/products/Win32OpenSSL.html)) to generate 3 self signed certificate.

```console
openssl req -newkey rsa:2048 -nodes -keyout cert_0.key -x509 -days 365 -out cert_0.cer
openssl req -newkey rsa:2048 -nodes -keyout cert_1.key -x509 -days 365 -out cert_1.cer
openssl req -newkey rsa:2048 -nodes -keyout cert_2.key -x509 -days 365 -out cert_2.cer
```

> [!IMPORTANT]
> Create and store the RSA key pairs and security domain file generated in this step securely.

Use the Azure PowerShell [Export-AzKeyVaultSecurityDomain](/powershell/module/az.keyvault/export-azkeyvaultsecuritydomain) cmdlet to download the security domain and activate your managed HSM. The example below, uses 3 RSA key pairs (only public keys are needed for this command) and sets the quorum to 2.

```azurepowershell-interactive
Export-AzKeyVaultSecurityDomain -Name "<your-unique-managed-hsm-name>" -Certificates "cert_0.cer", "cert_1.cer", "cert_2.cer" -OutputPath "MHSMsd.ps.json" -Quorum 2
```

Please store the security domain file and the RSA key pairs securely. You will need them for disaster recovery or for creating another managed HSM that shares same security domain, so they can share keys.

After successfully downloading the security domain, your HSM will be in active state and ready for you to use.

## Clean up resources

[!INCLUDE [Create a key vault](../../../includes/key-vault-powershell-delete-resources.md)]

## Next steps

In this quickstart you created a Key Vault and stored a certificate in it. To learn more about Key Vault and how to integrate it with your applications, continue on to the articles below.

- Read an [Overview of Azure Key Vault](../general/overview.md)
- See the reference for the [Azure PowerShell Key Vault cmdlets](/powershell/module/az.keyvault/)
- Review the [Key Vault security overview](../general/security-features.md)
