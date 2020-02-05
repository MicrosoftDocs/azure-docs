---
title: How to generate and transfer HSM-protected keys for Azure Key Vault - Azure Key Vault | Microsoft Docs
description: Use this article to help you plan for, generate, and then transfer your own HSM-protected keys to use with Azure Key Vault. Also known as BYOK or bring your own key.
services: key-vault
author: amitbapat
manager: devtiw
tags: azure-resource-manager

ms.service: key-vault
ms.topic: conceptual
ms.date: 02/17/2020
ms.author: ambapat

---

# How to generate and transfer HSM-protected keys to Azure Key Vault (preview)

For added assurance, when you use Azure Key Vault, you can import or generate keys in hardware security modules (HSMs) that never leave the HSM boundary. This scenario is often referred to as *bring your own key*, or BYOK. The HSMs are FIPS 140-2 Level 2 validated. Azure Key Vault uses nCipher nShield family of HSMs to protect your keys.

Use the information in this topic to help you plan for, generate, and then transfer your own HSM-protected keys to use with Azure Key Vault.

> [!NOTE]
> This feature is currently in preview and only available in **East US 2 EUAP** and **Central US EUAP** regions.

This functionality is not available for Azure China 21Vianet.
This import method is only available for [supported HSMs](#supported-hsms). 


> [!NOTE]
> For more information about Azure Key Vault, see [What is Azure Key Vault?](key-vault-overview.md)  
> For a getting started tutorial, which includes creating a key vault for HSM-protected keys, see [What is Azure Key Vault?](key-vault-overview.md).

## Overview

* Generate a key (referred to as Key Exchange Key or KEK) in Key Vault. This must be an RSA-HSM key with 'import' as the only key operation.
* Download the public key of KEK as a .pem file
* Transfer KEK public key to your offline workstation connected to your on-premise HSM.
* From your offline workstation, use the BYOK tool provided by your HSM vendor to create a byok file. 
* The target key is encrypted with a Key Exchange Key (KEK), which stays encrypted until it is transferred to the Azure Key Vault HSMs. Only the encrypted version of your key leaves the on-premise HSM.
* * The Key Exchange Key (KEK) that is used to encrypt your key is generated inside the Azure Key Vault HSMs and is not exportable. The HSMs enforce that there can be no clear version of the KEK outside the HSMs. 
* The KEK must be in the same key vault where the target key is to be imported.

## Prerequisites

See the following table for a list of prerequisites for bring your own key (BYOK) for Azure Key Vault.

| Requirement | More information |
| --- | --- |
| A subscription to Azure |To create an Azure Key Vault, you need an Azure subscription: [Sign up for free trial](https://azure.microsoft.com/pricing/free-trial/) |
| The Azure Key Vault Premium SKU to import HSM-protected keys |For more information about the service tiers and capabilities for Azure Key Vault, see the [Azure Key Vault Pricing](https://azure.microsoft.com/pricing/details/key-vault/) website. |
| An HSM from supported HSMs list and BYOK tool and instructions provided by your HSM vendor | You must have access to a Hardware Security Module and basic operational knowledge of your HSMs. See [Supported HSMs](#supported-hsms). |
| Azure CLI version 2.0.82 or newer | Please see [Install the Azure CLI](/cli/azure/install-azure-cli?view=azure-cli-latest) for more information.|

## Supported HSMs

|HSM Vendor Name|Supported HSM models|Additional details|
|---|---|---|
|Thales|<ul><li>SafeNet Luna HSM 7 family with firmware version 7.3 or newer</li><li>SafeNet Luna HSM 5 & 6 family (Key Export variant only)</li>| [SafeNet Luna BYOK tool and documentation](https://safenet.gemalto.com/blah-blah)|
|nCipher|nShield family of HSMs|[Use legacy BYOK procedure](key-vault-hsm-protected-keys-legacy.md)|


## Generate and transfer your key to Azure Key Vault HSM

You will use the following steps to generate and transfer your key to an Azure Key Vault HSM:

* [Step 1: Generate a KEK](#step-1-generate-a-kek)
* [Step 2: Download KEK public key](#step-2-download-kek-public-key)
* [Step 3: Generate and prepare your key for transfer](#step-3-generate-and-prepare-your-key-for-transfer)
* [Step 4: Transfer your key to Azure Key Vault](#step-4-transfer-your-key-to-azure-key-vault)

## Step 1: Generate a KEK

The KEK (Key Exchange Key) is an RSA key generated in Key Vault's HSM. This key is used to encrypt the key to be imported (target key).

KEK must be:
1. an **RSA-HSM** key (2048-bit or 3072-bit or 4096-bit)
2. generated in the same key vault where you intend to import the target key
3. created with allowed key operations set to **import**

Use the [az keyvault key create](/cli/azure/keyvault/key?view=azure-cli-latest#az-keyvault-key-create) command to create KEK with key operations set to import.

```azurecli
az keyvault key create --kty RSA-HSM --size 4096 --name KEKforBYOK --ops import --vault-name ContosoKeyVaultHSM
```

Note down the key identifier 'kid' returned from the above command. You'll need it in [Step 3](#step-3-generate-and-prepare-your-key-for-transfer).

## Step 2: Download KEK public key

Use the [az keyvault key download](/cli/azure/keyvault/key?view=azure-cli-latest#az-keyvault-key-download) to download the KEK public key into a .pem file. The target key you import is encrypted using the KEK public key.

```azurecli
az keyvault key download --name KEKforBYOK --vault-name ContosoKeyVaultHSM --file KEKforBYOK.publickey.pem
```

Transfer the .pem file to your offline workstation.

## Step 3: Generate and prepare your key for transfer

Please refer to your HSM vendor's documentation to download and install the BYOK tool. Follow instruction from your HSM vendor to generate a target key and then create a Key Transfer Package (a byok file). The BYOK tool will use the key identifier from [Step 1](#step-1-generate-a-kek) and .pem file you downloaded in [Step 2](#step-2-download-kek-public-key) to generate an encrypted target key in a byok file.

Transfer the byok file to your connected workstation.

> [!NOTE] 
> Target key must be an RSA key of size 2048-bit or 3072-bit or 4096-bit. Importing Elliptic Curve keys is not supported at this time.

## Step 4: Transfer your key to Azure Key Vault

For this final step, on the Internet-connected workstation, use the [az keyvault key import](/cli/azure/keyvault/key?view=azure-cli-latest#az-keyvault-key-import) command to upload the byok file that you copied from the disconnected workstation to the Azure Key Vault HSM, to complete the key import.

```azurecli
az keyvault key import --vault-name ContosoKeyVaultHSM --name ContosoFirstHSMkey --byok-file KeyTransferPackage-ContosoFirstHSMkey.byok
```

If the upload is successful, you see displayed the properties of the key that you just imported.

## Next steps

You can now use this HSM-protected key in your key vault. For more information, see this price and feature [comparison](https://azure.microsoft.com/pricing/details/key-vault/).
