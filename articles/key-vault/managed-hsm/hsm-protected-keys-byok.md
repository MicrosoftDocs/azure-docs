---
title: How to generate and transfer HSM-protected keys for Azure Key Vault Managed HSM - Azure Key Vault | Microsoft Docs
description: Use this article to help you plan for, generate, and transfer your own HSM-protected keys to use with Managed HSM. Also known as bring your own key (BYOK).
services: key-vault
author: amitbapat
tags: azure-resource-manager

ms.service: key-vault
ms.topic: conceptual
ms.date: 02/04/2021
ms.author: ambapat
---

# Import HSM-protected keys to Managed HSM (BYOK)

 Azure Key Vault Managed HSM supports importing keys generated in your on-premise hardware security module (HSM); the keys will  never leave the HSM protection boundary. This scenario often is referred to as *bring your own key* (BYOK). Managed HSM uses the Marvell LiquidSecurity HSM adapters (FIPS 140-2 Level 3 validated) to protect your keys.

Use the information in this article to help you plan for, generate, and transfer your own HSM-protected keys to use with Managed HSM.

> [!NOTE]
> This functionality is not available for Azure China 21Vianet. This import method is available only for [supported HSMs](#supported-hsms). 

For more information, and for a tutorial to get started using Managed HSM, see [What is Managed HSM?](overview.md).

## Overview

Here's an overview of the process. Specific steps to complete are described later in the article.

* In Managed HSM, generate a key (referred to as a *Key Exchange Key* (KEK)). The KEK must be an RSA-HSM key that has only the `import` key operation. 
* Download the KEK public key as a .pem file.
* Transfer the KEK public key to an offline computer that is connected to an on-premises HSM.
* In the offline computer, use the BYOK tool provided by your HSM vendor to create a BYOK file. 
* The target key is encrypted with a KEK, which stays encrypted until it is transferred to the Managed HSM. Only the encrypted version of your key leaves the on-premises HSM.
* A KEK that's generated inside a Managed HSM is not exportable. HSMs enforce the rule that no clear version of a KEK exists outside a Managed HSM.
* The KEK must be in the same managed HSM where the target key will be imported.
* When the BYOK file is uploaded to Managed HSM, a Managed HSM uses the KEK private key to decrypt the target key material and import it as an HSM key. This operation happens entirely inside the HSM. The target key always remains in the HSM protection boundary.


## Prerequisites

To use the Azure CLI commands in this article, you must have the following items:

* A subscription to Microsoft Azure. If you don't have one, you can sign up for a [free trial](https://azure.microsoft.com/pricing/free-trial).
* The Azure CLI version 2.12.0 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install the Azure CLI]( /cli/azure/install-azure-cli).
* A managed HSM the [supported HSMs list](#supported-hsms) in your subscription. See [Quickstart: Provision and activate a managed HSM using Azure CLI](quick-create-cli.md) to provision and activate a managed HSM.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

To sign in to Azure using the CLI you can type:

```azurecli
az login
```

For more information on login options via the CLI take a look at [sign in with Azure CLI](/cli/azure/authenticate-azure-cli)

## Supported HSMs

|Vendor name|Vendor Type|Supported HSM models|More information|
|---|---|---|---|
|nCipher|Manufacturer,<br/>HSM as a service|<ul><li>nShield family of HSMs</li><li>nShield as a service</ul>|[nCipher new BYOK tool and documentation](https://www.ncipher.com/products/key-management/cloud-microsoft-azure)|
|Thales|Manufacturer|<ul><li>Luna HSM 7 family with firmware version 7.3 or newer</li></ul>| [Luna BYOK tool and documentation](https://supportportal.thalesgroup.com/csm?id=kb_article_view&sys_kb_id=3892db6ddb8fc45005c9143b0b961987&sysparm_article=KB0021016)|
|Fortanix|Manufacturer,<br/>HSM as a service|<ul><li>Self-Defending Key Management Service (SDKMS)</li><li>Equinix SmartKey</li></ul>|[Exporting SDKMS keys to Cloud Providers for BYOK - Azure Key Vault](https://support.fortanix.com/hc/en-us/articles/360040071192-Exporting-SDKMS-keys-to-Cloud-Providers-for-BYOK-Azure-Key-Vault)|
|Marvell|Manufacturer|All LiquidSecurity HSMs with<ul><li>Firmware version 2.0.4 or later</li><li>Firmware version 3.2 or newer</li></ul>|[Marvell BYOK tool and documentation](https://www.marvell.com/products/security-solutions/nitrox-hs-adapters/exporting-marvell-hsm-keys-to-cloud-azure-key-vault.html)|
|Cryptomathic|ISV (Enterprise Key Management System)|Multiple HSM brands and models including<ul><li>nCipher</li><li>Thales</li><li>Utimaco</li></ul>See [Cryptomathic site for details](https://www.cryptomathic.com/azurebyok)|[Cryptomathic BYOK tool and documentation](https://www.cryptomathic.com/azurebyok)|
|Securosys SA|Manufacturer, HSM as a service|Primus HSM family, Securosys Clouds HSM|[Primus BYOK tool and documentation](https://www.securosys.com/primus-azure-byok)|
|StorMagic|ISV (Enterprise Key Management System)|Multiple HSM brands and models including<ul><li>Utimaco</li><li>Thales</li><li>nCipher</li></ul>See [StorMagic site for details](https://stormagic.com/doc/svkms/Content/Integrations/Azure_KeyVault_BYOK.htm)|[SvKMS and Azure Key Vault BYOK](https://stormagic.com/doc/svkms/Content/Integrations/Azure_KeyVault_BYOK.htm)|
|IBM|Manufacturer|IBM 476x, CryptoExpress|[IBM Enterprise Key Management Foundation](https://www.ibm.com/security/key-management/ekmf-bring-your-own-key-azure)|
|Utimaco|Manufacturer,<br/>HSM as a service|u.trust Anchor, CryptoServer|[Utimaco BYOK tool and Integration guide](https://support.hsm.utimaco.com/support/downloads/byok)|
||||


## Supported key types

|Key name|Key type|Key size/curve|Origin|Description|
|---|---|---|---|---|
|Key Exchange Key (KEK)|RSA| 2,048-bit<br />3,072-bit<br />4,096-bit|Managed HSM|An HSM-backed RSA key pair generated in Managed HSM|
|Target key|
||RSA|2,048-bit<br />3,072-bit<br />4,096-bit|Vendor HSM|The key to be transferred to the Managed HSM|
||EC|P-256<br />P-384<br />P-521|Vendor HSM|The key to be transferred to the Managed HSM|
||Symmetric key (oct-HSM)|128-bit<br />192-bit<br />256-bit|Vendor HSM|The key to be transferred to the Managed HSM|
||||
## Generate and transfer your key to the Managed HSM

To generate and transfer your key to a Managed HSM:

* [Step 1: Generate a KEK](#step-1-generate-a-kek)
* [Step 2: Download the KEK public key](#step-2-download-the-kek-public-key)
* [Step 3: Generate and prepare your key for transfer](#step-3-generate-and-prepare-your-key-for-transfer)
* [Step 4: Transfer your key to Managed HSM](#step-4-transfer-your-key-to-managed-hsm)

### Step 1: Generate a KEK

A KEK is an RSA key that's generated in a Managed HSM. The KEK is used to encrypt the key you want to import (the *target* key).

The KEK must be:
- An RSA-HSM key (2,048-bit; 3,072-bit; or 4,096-bit)
- Generated in the same managed HSM where you intend to import the target key
- Created with allowed key operations set to `import`

> [!NOTE]
> The KEK must have 'import' as the only allowed key operation. 'import' is mutually exclusive with all other key operations.

Use the [az keyvault key create](/cli/azure/keyvault/key#az_keyvault_key_create) command to create a KEK that has key operations set to `import`. Record the key identifier (`kid`) that's returned from the following command. (You will use the `kid` value in [Step 3](#step-3-generate-and-prepare-your-key-for-transfer).)

```azurecli-interactive
az keyvault key create --kty RSA-HSM --size 4096 --name KEKforBYOK --ops import --hsm-name ContosoKeyVaultHSM
```
---


### Step 2: Download the KEK public key

Use [az keyvault key download](/cli/azure/keyvault/key#az_keyvault_key_download) to download the KEK public key to a .pem file. The target key you import is encrypted by using the KEK public key.

```azurecli-interactive
az keyvault key download --name KEKforBYOK --hsm-name ContosoKeyVaultHSM --file KEKforBYOK.publickey.pem
```
---

Transfer the KEKforBYOK.publickey.pem file to your offline computer. You will need this file in the next step.

### Step 3: Generate and prepare your key for transfer

Refer to your HSM vendor's documentation to download and install the BYOK tool. Follow instructions from your HSM vendor to generate a target key, and then create a key transfer package (a BYOK file). The BYOK tool will use the `kid` from [Step 1](#step-1-generate-a-kek) and the KEKforBYOK.publickey.pem file you downloaded in [Step 2](#step-2-download-the-kek-public-key) to generate an encrypted target key in a BYOK file.

Transfer the BYOK file to your connected computer.

> [!NOTE] 
> Importing RSA 1,024-bit keys is not supported. Currently, importing an Elliptic Curve (EC) key is not supported.
>
> **Known issue**: Importing an RSA 4K target key from Luna HSMs is only supported with firmware 7.4.0 or newer.

### Step 4: Transfer your key to Managed HSM

To complete the key import, transfer the key transfer package (a BYOK file) from your disconnected computer to the internet-connected computer. Use the [az keyvault key import](/cli/azure/keyvault/key#az_keyvault_key_import) command to upload the BYOK file to the Managed HSM.

```azurecli-interactive
az keyvault key import --hsm-name ContosoKeyVaultHSM --name ContosoFirstHSMkey --byok-file KeyTransferPackage-ContosoFirstHSMkey.byok
```

If the upload is successful, Azure CLI displays the properties of the imported key.

## Next steps

You can now use this HSM-protected key in your Managed HSM. For more information, see [this price and feature comparison](https://azure.microsoft.com/pricing/details/key-vault/).
