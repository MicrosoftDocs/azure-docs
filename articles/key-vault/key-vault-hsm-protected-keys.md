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
ms.date: 02/17/2020
ms.author: ambapat

---

# Import HSM-protected keys to Key Vault

For added assurance, when you use Azure Key Vault, you can import or generate keys in hardware security modules (HSMs) that never leave the HSM boundary. This scenario is often referred to as *bring your own key*, or BYOK. Azure Key Vault uses nCipher nShield family of HSMs (FIPS 140-2 Level 2 validated) to protect your keys.

This functionality is not available for Azure China 21Vianet.

> [!NOTE]
> For more information about Azure Key Vault, see [What is Azure Key Vault?](key-vault-overview.md)  
> For a getting started tutorial, which includes creating a key vault for HSM-protected keys, see [What is Azure Key Vault?](key-vault-overview.md).

## Supported HSMs

Transferring HSM-protected keys to Key Vault is supported via two different methods depending on the HSMs you use. Use the table below to determine which method should be used for your HSMs to  generate, and then transfer your own HSM-protected keys to use with Azure Key Vault. 

|Vendor Name|Vendor Type|Supported HSM models|Supported HSM-key transfer method|
|---|---|---|---|
|nCipher|Manufacturer|<ul><li>nShield family of HSMs</li></ul>|[Use legacy BYOK method](hsm-protected-keys-legacy.md)|
|Thales|Manufacturer|<ul><li>SafeNet Luna HSM 7 family with firmware version 7.3 or newer</li></ul>| [Use new BYOK method (preview)](hsm-protected-keys-vendor-agnostic-byok.md)|
|Fortanix|HSM as a Service|<ul><li>Self-Defending Key Management Service (SDKMS)</li></ul>|[Use new BYOK method (preview)](hsm-protected-keys-vendor-agnostic-byok.md)|










## Next steps

Follow [Key Vault Best Practices](key-vault-best-practices.md) to ensure security, durability and monitoring for your keys.
