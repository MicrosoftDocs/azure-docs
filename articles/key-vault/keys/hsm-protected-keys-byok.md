---
title: How to generate & transfer HSM-protected keys – BYOK – Azure Key Vault 
description: Use this article to help you plan for, generate, and transfer your own HSM-protected keys to use with Azure Key Vault. Also known as bring your own key (BYOK).
services: key-vault
author: mbaldwin
manager: devtiw
tags: azure-resource-manager
ms.custom: devx-track-azurepowershell, devx-track-azurecli

ms.service: key-vault
ms.subservice: keys
ms.topic: tutorial
ms.date: 10/23/2023
ms.author: mbaldwin
---

# Import HSM-protected keys to Key Vault (BYOK)

For added assurance when you use Azure Key Vault, you can import or generate a key in a hardware security module (HSM); the key will  never leave the HSM boundary. This scenario often is referred to as *bring your own key* (BYOK). Key Vault uses the nCipher nShield family of HSMs (FIPS 140-2 Level 2 validated) to protect your keys.

Use the information in this article to help you plan for, generate, and transfer your own HSM-protected keys to use with Azure Key Vault.

> [!NOTE]
> This functionality is not available for Microsoft Azure operated by 21Vianet.
>
> This import method is available only for [supported HSMs](#supported-hsms).

For more information, and for a tutorial to get started using Key Vault (including how to create a key vault for HSM-protected keys), see [What is Azure Key Vault?](../general/overview.md).

## Overview

Here's an overview of the process. Specific steps to complete are described later in the article.

* In Key Vault, generate a key (referred to as a *Key Exchange Key* (KEK)). The KEK must be an RSA-HSM key that has only the `import` key operation. Only Key Vault Premium and Managed HSM support RSA-HSM keys.
* Download the KEK public key as a .pem file.
* Transfer the KEK public key to an offline computer that is connected to an on-premises HSM.
* In the offline computer, use the BYOK tool provided by your HSM vendor to create a BYOK file.
* The target key is encrypted with a KEK, which stays encrypted until it is transferred to the Key Vault HSM. Only the encrypted version of your key leaves the on-premises HSM.
* A KEK that's generated inside a Key Vault HSM is not exportable. HSMs enforce the rule that no clear version of a KEK exists outside a Key Vault HSM.
* The KEK must be in the same key vault where the target key will be imported.
* When the BYOK file is uploaded to Key Vault, a Key Vault HSM uses the KEK private key to decrypt the target key material and import it as an HSM key. This operation happens entirely inside a Key Vault HSM. The target key always remains in the HSM protection boundary.

## Prerequisites

The following table lists prerequisites for using BYOK in Azure Key Vault:

| Requirement | More information |
| --- | --- |
| An Azure subscription |To create a key vault in Azure Key Vault, you need an Azure subscription. [Sign up for a free trial](https://azure.microsoft.com/pricing/free-trial/). |
| A Key Vault Premium or Managed HSM to import HSM-protected keys |For more information about the service tiers and capabilities in Azure Key Vault, see [Key Vault Pricing](https://azure.microsoft.com/pricing/details/key-vault/). |
| An HSM from the supported HSMs list and a BYOK tool and instructions provided by your HSM vendor | You must have permissions for an HSM and basic knowledge of how to use your HSM. See [Supported HSMs](#supported-hsms). |
| Azure CLI version 2.1.0 or later | See [Install the Azure CLI](/cli/azure/install-azure-cli).|

## Supported HSMs

|Vendor name|Vendor Type|Supported HSM models|More information|
|---|---|---|---|
|Cryptomathic|ISV (Enterprise Key Management System)|Multiple HSM brands and models including<ul><li>nCipher</li><li>Thales</li><li>Utimaco</li></ul>See [Cryptomathic site for details](https://www.cryptomathic.com/azurebyok)|[Cryptomathic BYOK tool and documentation](https://www.cryptomathic.com/azurebyok)|
|Entrust|Manufacturer,<br/>HSM as a service|<ul><li>nShield family of HSMs</li><li>nShield as a service</ul>|[nCipher new BYOK tool and documentation](https://www.entrust.com/digital-security/hsm/solutions/use-case/cloud-security/bring-your-own-key-hold-your-own-key)|
|Fortanix|Manufacturer,<br/>HSM as a service|<ul><li>Self-Defending Key Management Service (SDKMS)</li><li>Equinix SmartKey</li></ul>|[Exporting SDKMS keys to Cloud Providers for BYOK - Azure Key Vault](https://support.fortanix.com/hc/en-us/articles/360040071192-Exporting-SDKMS-keys-to-Cloud-Providers-for-BYOK-Azure-Key-Vault)|
|IBM|Manufacturer|IBM 476x, CryptoExpress|[IBM Enterprise Key Management Foundation](https://www.ibm.com/security/key-management/ekmf-bring-your-own-key-azure)|
|Marvell|Manufacturer|All LiquidSecurity HSMs with<ul><li>Firmware version 2.0.4 or later</li><li>Firmware version 3.2 or newer</li></ul>|[Marvell BYOK tool and documentation](https://www.marvell.com/products/security-solutions/exporting-marvell-hsm-keys-to-cloud-azure-key-vault.html)|
|nCipher|Manufacturer,<br/>HSM as a service|<ul><li>nShield family of HSMs</li><li>nShield as a service</ul>|[nCipher new BYOK tool and documentation](https://www.ncipher.com/products/key-management/cloud-microsoft-azure)|
|Securosys SA|Manufacturer,<br/>HSM as a service|Primus HSM family, Securosys Clouds HSM|[Primus BYOK tool and documentation](https://www.securosys.com/primus-azure-byok)|
|StorMagic|ISV (Enterprise Key Management System)|Multiple HSM brands and models including<ul><li>Utimaco</li><li>Thales</li><li>nCipher</li></ul>See [StorMagic site for details](https://stormagic.com/doc/svkms/Content/Integrations/Azure_KeyVault_BYOK.htm)|[SvKMS and Azure Key Vault BYOK](https://stormagic.com/doc/svkms/Content/Integrations/Azure_KeyVault_BYOK.htm)|
|Thales|Manufacturer|<ul><li>Luna HSM 7 family with firmware version 7.3 or newer</li></ul>| [Luna BYOK tool and documentation](https://supportportal.thalesgroup.com/csm?id=kb_article_view&sys_kb_id=3892db6ddb8fc45005c9143b0b961987&sysparm_article=KB0021016)|
|Utimaco|Manufacturer,<br/>HSM as a service|u.trust Anchor, CryptoServer| Utimaco BYOK tool and Integration guide |
||||

## Supported key types

|Key name|Key type|Key size/curve|Origin|Description|
|---|---|---|---|---|
|Key Exchange Key (KEK)|RSA| 2,048-bit<br />3,072-bit<br />4,096-bit|Azure Key Vault HSM|An HSM-backed RSA key pair generated in Azure Key Vault|
|Target key|
||RSA|2,048-bit<br />3,072-bit<br />4,096-bit|Vendor HSM|The key to be transferred to the Azure Key Vault HSM|
||EC|P-256<br />P-384<br />P-521|Vendor HSM|The key to be transferred to the Azure Key Vault HSM|
||||

## Generate and transfer your key to Key Vault Premium HSM or Managed HSM

To generate and transfer your key to a Key Vault Premium or Managed HSM:

* [Step 1: Generate a KEK](#generate-a-kek)
* [Step 2: Download the KEK public key](#download-the-kek-public-key)
* [Step 3: Generate and prepare your key for transfer](#generate-and-prepare-your-key-for-transfer)
* [Step 4: Transfer your key to Azure Key Vault](#transfer-your-key-to-azure-key-vault)

### Generate a KEK

A KEK is an RSA key that's generated in a Key Vault Premium or Managed HSM. The KEK is used to encrypt the key you want to import (the *target* key).

The KEK must be:
- An RSA-HSM key (2,048-bit; 3,072-bit; or 4,096-bit)
- Generated in the same key vault where you intend to import the target key
- Created with allowed key operations set to `import`

> [!NOTE]
> The KEK must have 'import' as the only allowed key operation. 'import' is mutually exclusive with all other key operations.

Use the [az keyvault key create](/cli/azure/keyvault/key#az-keyvault-key-create) command to create a KEK that has key operations set to `import`. Record the key identifier (`kid`) that's returned from the following command. (You will use the `kid` value in [Step 3](#generate-and-prepare-your-key-for-transfer).)

### [Azure CLI](#tab/azure-cli)

```azurecli
az keyvault key create --kty RSA-HSM --size 4096 --name KEKforBYOK --ops import --vault-name ContosoKeyVaultHSM
```

For Managed HSM:

```azurecli
az keyvault key create --kty RSA-HSM --size 4096 --name KEKforBYOK --ops import --hsm-name ContosoKeyVaultHSM
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Add-AzKeyVaultKey -VaultName 'ContosoKeyVaultHSM' -Name 'KEKforBYOK' -Destination 'HSM' -Size 4096 -KeyOps 'import'
```

For Managed HSM:

```azurepowershell
Add-AzKeyVaultKey -HsmName 'ContosoKeyVaultHSM' -Name 'KEKforBYOK' -Destination 'HSM' -Size 4096 -KeyOps 'import'
```

---

### Download the KEK public key

Use [az keyvault key download](/cli/azure/keyvault/key#az-keyvault-key-download) to download the KEK public key to a .pem file. The target key you import is encrypted by using the KEK public key.

### [Azure CLI](#tab/azure-cli)

```azurecli
az keyvault key download --name KEKforBYOK --vault-name ContosoKeyVaultHSM --file KEKforBYOK.publickey.pem
```

For Managed HSM:

```azurecli
az keyvault key download --name KEKforBYOK --hsm-name ContosoKeyVaultHSM --file KEKforBYOK.publickey.pem
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzKeyVaultKey -VaultName 'ContosoKeyVaultHSM' -KeyName 'KEKforBYOK' -OutFile 'KEKforBYOK.publickey.pem'
```

For Managed HSM

```azurepowershell
Get-AzKeyVaultKey -HsmName 'ContosoKeyVaultHSM' -KeyName 'KEKforBYOK' -OutFile 'KEKforBYOK.publickey.pem'
```

---

Transfer the KEKforBYOK.publickey.pem file to your offline computer. You will need this file in the next step.

### Generate and prepare your key for transfer

Refer to your HSM vendor's documentation to download and install the BYOK tool. Follow instructions from your HSM vendor to generate a target key, and then create a key transfer package (a BYOK file). The BYOK tool will use the `kid` from [Step 1](#generate-a-kek) and the KEKforBYOK.publickey.pem file you downloaded in [Step 2](#download-the-kek-public-key) to generate an encrypted target key in a BYOK file.

Transfer the BYOK file to your connected computer.

> [!NOTE]
> Importing RSA 1,024-bit keys is not supported. Importing Elliptic Curve key with curve P-256K is supported.
>
> **Known issue**: Importing an RSA 4K target key from Luna HSMs is only supported with firmware 7.4.0 or newer.

### Transfer your key to Azure Key Vault

To complete the key import, transfer the key transfer package (a BYOK file) from your disconnected computer to the internet-connected computer. Use the [az keyvault key import](/cli/azure/keyvault/key#az-keyvault-key-import) command to upload the BYOK file to the Key Vault HSM.

To import an RSA key use following command. Parameter --kty is optional and defaults to 'RSA-HSM'.

### [Azure CLI](#tab/azure-cli)

```azurecli
az keyvault key import --vault-name ContosoKeyVaultHSM --name ContosoFirstHSMkey --byok-file KeyTransferPackage-ContosoFirstHSMkey.byok
```

For Managed HSM

```azurecli
az keyvault key import --hsm-name ContosoKeyVaultHSM --name ContosoFirstHSMkey --byok-file KeyTransferPackage-ContosoFirstHSMkey.byok
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Add-AzKeyVaultKey -VaultName 'ContosoKeyVaultHSM' -KeyName 'ContosoFirstHSMkey' -KeyFilePath 'KeyTransferPackage-ContosoFirstHSMkey.byok'
```
For Managed HSM

```azurepowershell
Add-AzKeyVaultKey -HsmName 'ContosoKeyVaultHSM' -KeyName 'ContosoFirstHSMkey' -KeyFilePath 'KeyTransferPackage-ContosoFirstHSMkey.byok'
```

---

To import an EC key, you must specify key type and the curve name.

### [Azure CLI](#tab/azure-cli)

```azurecli
az keyvault key import --vault-name ContosoKeyVaultHSM --name ContosoFirstHSMkey --kty EC-HSM --curve-name "P-256" --byok-file KeyTransferPackage-ContosoFirstHSMkey.byok
```

For Managed HSM

```azurecli
az keyvault key import --hsm-name ContosoKeyVaultHSM --name ContosoFirstHSMkey --byok-file --kty EC-HSM --curve-name "P-256" KeyTransferPackage-ContosoFirstHSMkey.byok
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Add-AzKeyVaultKey -VaultName 'ContosoKeyVaultHSM' -KeyName 'ContosoFirstHSMkey' -KeyType EC -CurveName P-256  -KeyFilePath 'KeyTransferPackage-ContosoFirstHSMkey.byok'
```

For Managed HSM

```azurepowershell
Add-AzKeyVaultKey -HsmName 'ContosoKeyVaultHSM' -KeyName 'ContosoFirstHSMkey' -KeyType EC -CurveName P-256  -KeyFilePath 'KeyTransferPackage-ContosoFirstHSMkey.byok'
```

---

If the upload is successful, Azure CLI displays the properties of the imported key.

## Next steps

You can now use this HSM-protected key in your key vault. For more information, see [this price and feature comparison](https://azure.microsoft.com/pricing/details/key-vault/).
