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

# How to generate and transfer HSM-protected keys to Azure Key Vault

For added assurance, when you use Azure Key Vault, you can import or generate keys in hardware security modules (HSMs) that never leave the HSM boundary. This scenario is often referred to as *bring your own key*, or BYOK. . Azure Key Vault uses nCipher nShield family of HSMs (FIPS 140-2 Level 2 validated) to protect your keys.

Transferring HSM-protected keys to Key Vault is supported via two different methods. The method you need to use depends on the HSMs you use. Use the information in the table below to determine which method should be used for your HSMs to  generate, and then transfer your own HSM-protected keys to use with Azure Key Vault. 


This functionality is not available for Azure China 21Vianet.

> [!NOTE]
> For more information about Azure Key Vault, see [What is Azure Key Vault?](key-vault-overview.md)  
> For a getting started tutorial, which includes creating a key vault for HSM-protected keys, see [What is Azure Key Vault?](key-vault-overview.md).

## Supported HSMs

|HSM Vendor Name|Supported HSM models|Supported HSM-key transfer method|
|---|---|---|
|Thales|<ul><li>SafeNet Luna HSM 7 family with firmware version 7.3 or newer</li><li>SafeNet Luna HSM 5 & 6 family (Key Export variant only)</li>| [Use new BYOK method](key-vault-hsm-protected-keys-vendor-agnostic-byok.md)|
|nCipher|nShield family of HSMs|[Use legacy BYOK method](key-vault-hsm-protected-keys-legacy.md)|




## Next steps

You can now use this HSM-protected key in your key vault. For more information, see this price and feature [comparison](https://azure.microsoft.com/pricing/details/key-vault/).
