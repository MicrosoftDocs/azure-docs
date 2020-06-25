---
title: How to generate and transfer HSM-protected keys for Azure Key Vault - Azure Key Vault | Microsoft Docs
description: Use this article to help you plan for, generate, and then transfer your own HSM-protected keys to use with Azure Key Vault. Also known as BYOK or bring your own key.
services: key-vault
author: amitbapat
manager: devtiw
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: keys
ms.topic: conceptual
ms.date: 05/29/2020
ms.author: ambapat

---

# Import HSM-protected keys to Key Vault

For added assurance, when you use Azure Key Vault, you can import or generate keys in hardware security modules (HSMs) that never leave the HSM boundary. This scenario is often referred to as *bring your own key*, or BYOK. Azure Key Vault uses nCipher nShield family of HSMs (FIPS 140-2 Level 2 validated) to protect your keys.

This functionality is not available for Azure China 21Vianet.

> [!NOTE]
> For more information about Azure Key Vault, see [What is Azure Key Vault?](../general/overview.md)  
> For a getting started tutorial, which includes creating a key vault for HSM-protected keys, see [What is Azure Key Vault?](../general/overview.md).

## Supported HSMs

Transferring HSM-protected keys to Key Vault is supported via two different methods depending on the HSMs you use. Use the table below to determine which method should be used for your HSMs to  generate, and then transfer your own HSM-protected keys to use with Azure Key Vault. 

|Vendor Name|Vendor Type|Supported HSM models|Supported HSM-key transfer method|
|---|---|---|---|
|[nCipher](https://www.ncipher.com/products/key-management/cloud-microsoft-azure)|Manufacturer,<br/>HSM as a Service|<ul><li>nShield family of HSMs</li><li>nShield as a service</ul>|**Method 1:** [nCipher BYOK](hsm-protected-keys-ncipher.md) (with strong attestation for key import and HSM validation)<br/>**Method 2:** [Use new BYOK method](hsm-protected-keys-byok.md) |
|Thales|Manufacturer|<ul><li>Luna HSM 7 family with firmware version 7.3 or newer</li></ul>| [Use new BYOK method](hsm-protected-keys-byok.md)|
|Fortanix|Manufacturer,<br/>HSM as a Service|<ul><li>Self-Defending Key Management Service (SDKMS)</li><li>Equinix SmartKey</li></ul>|[Use new BYOK method](hsm-protected-keys-byok.md)|
|Marvell|Manufacturer|All LiquidSecurity HSMs with<ul><li>Firmware version 2.0.4 or later</li><li>Firmware version 3.2 or newer</li></ul>|[Use new BYOK method](hsm-protected-keys-byok.md)|
|Cryptomathic|ISV (Enterprise Key Management System)|Multiple HSM brands and models including<ul><li>nCipher</li><li>Thales</li><li>Utimaco</li></ul>See [Cryptomathic site for details](https://www.cryptomathic.com/azurebyok)|[Use new BYOK method](hsm-protected-keys-byok.md)|


## Next steps

* Follow [Key Vault Best Practices](../general/best-practices.md) to ensure security, durability and monitoring for your keys.
* Refer to [BYOK specification](https://docs.microsoft.com/azure/key-vault/keys/byok-specification) for a complete description of the new BYOK method
