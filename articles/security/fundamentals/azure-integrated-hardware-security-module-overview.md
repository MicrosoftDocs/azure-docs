---
title: Azure Integrated HSM overview
description: Learn how Azure Integrated HSM provides hardware-backed cryptographic key caching and crypto offload for supported Azure virtual machines.
services: security
author: simranparkhe
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 04/30/2026
ms.author: simranparkhe
ai-usage: ai-assisted
---

# Azure Integrated HSM overview

[Azure Integrated HSM](https://techcommunity.microsoft.com/blog/azureinfrastructureblog/securing-azure-infrastructure-with-silicon-innovation/4293834) is a hardware security module (HSM) cache and crypto offload designed to enhance the security and performance of cryptographic operations in virtual machines. For organizations that rely heavily on cryptography and have performance-intensive workloads, Azure Integrated HSM provides a secure hardware-backed way to store cryptographic keys for fast and secure usage.

Starting with new Azure server hardware [AMD D-series v7](/azure/virtual-machines/sizes/general-purpose/dasv7-series) and [AMD E-series v7](/azure/virtual-machines/sizes/memory-optimized/easv7-series), Microsoft-designed HSM chips are embedded directly on servers, meeting Federal Information Processing Standards (FIPS) 140-3 Level 3 standards. These tamper-resistant chips keep encryption keys within secure hardware boundaries, eliminating latency and exposure risks. The integrated HSM operates transparently by default for supported services like Azure Key Vault and Azure Storage encryption, providing hardware-enforced trust without extra configuration. This HSM integration ensures that cryptographic operations benefit from hardware-level security isolation while maintaining the performance and scalability of cloud services.

## Benefits of Azure Integrated HSM

* *Lower latency*
    * Reduce network round-trips to Azure Key Vault or Managed HSM by performing cryptographic operations locally on the same node as the virtual machine (VM).
* *Keys remain protected*
    * Keys stored in Azure Integrated HSM aren't exposed in clear text and remain within a FIPS 140-3 Level 3 HSM boundary.
* *Memory protection*
    * Protect against memory and crash-dump attacks.
* *Built-in infrastructure*
    * Azure Integrated HSM is attached to each supported node as part of Azure infrastructure.
* *No extra cost*
    * Available without extra cost

### Supported operations

The following cryptographic operations are supported for Azure Integrated HSM:

* **AES - Encrypt + Decrypt** (`BCRYPT_AES_ALGORITHM`)
    * **AES-CBC** (`BCRYPT_CHAIN_MODE_CBC`)
        * 128-bit
        * 192-bit
        * 256-bit
    * **AES-GCM** (`BCRYPT_CHAIN_MODE_GCM`)
        * 256-bit
    * **AES-XTS** (`BCRYPT_XTS_AES_ALGORITHM`)
        * 512-bit
* **RSA** (`BCRYPT_RSA_ALGORITHM`)
    * **Decrypt + Sign**
        * RSA 2048 (2k)
        * RSA 3072 (3k)
        * RSA 4096 (4k)
    * **Unwrap**
        * RSA 2048 (2k)
* **ECC**
    * **ECDSA - Sign** (`BCRYPT_ECDSA_ALGORITHM`)
        * ECC P256 (`BCRYPT_ECDSA_P256_ALGORITHM`)
        * ECC P384 (`BCRYPT_ECDSA_P384_ALGORITHM`)
        * ECC P521 (`BCRYPT_ECDSA_P521_ALGORITHM`)
    * **ECDH - Secret Exchange** (`BCRYPT_ECDH_ALGORITHM`)
        * ECC P256 (`BCRYPT_ECDH_P256_ALGORITHM`)
        * ECC P384 (`BCRYPT_ECDH_P384_ALGORITHM`)
        * ECC P521 (`BCRYPT_ECDH_P521_ALGORITHM`)
* **Key Derivation**
    * **HKDF** ("HMAC-based Key Derivation Function") (`BCRYPT_HKDF_ALGORITHM`)
        * As defined in [IETF RFC 5869](https://datatracker.ietf.org/doc/html/rfc5869), and referred to in NCrypt by the `BCRYPT_HKDF_ALGORITHM` string.

## Availability and pricing

Azure Integrated HSM is available on the AMD v7 generally available platform in all the AMD v7 supported regions. Azure Integrated HSM supports the general purpose [Dasv7-series](/azure/virtual-machines/sizes/general-purpose/dasv7-series), [Dadsv7-series](/azure/virtual-machines/sizes/general-purpose/dadsv7-series), [Easv7-series](/azure/virtual-machines/sizes/memory-optimized/easv7-series), and [Eadsv7-series](/azure/virtual-machines/sizes/memory-optimized/eadsv7-series) for 8 vCores and higher for Trusted Launch VMs. The Azure Integrated HSM general availability is for **Windows support only**. Linux support is coming soon. Azure Integrated HSM is offered at no extra cost.

The [Azure Integrated HSM GitHub repository](https://github.com/microsoft/AziHSM-Guest) has samples and instructions for using Azure Integrated HSM.

## Limitations

- Windows guest support only.
    - Windows guest images with WS2025 or WS2022 can support AziHSM. For more information about installing the guest driver and the key service provider required to interface with the device, see the [AziHSM-Guest GitHub repository](https://github.com/microsoft/AziHSM-Guest).
- Requires customer opt-in. Azure Integrated HSM isn't enabled by default for all SKUs.
    - For more information about how to opt in, see [How to deploy with Azure Integrated HSM enabled](./how-to-deploy-azure-integrated-hardware-security-module.md).
- Supported only on select VM SKUs.
    - [Dasv7-series](/azure/virtual-machines/sizes/general-purpose/dasv7-series), [Dadsv7-series](/azure/virtual-machines/sizes/general-purpose/dadsv7-series), [Easv7-series](/azure/virtual-machines/sizes/memory-optimized/easv7-series), and [Eadsv7-series](/azure/virtual-machines/sizes/memory-optimized/eadsv7-series)
- Minimum VM size requirement.
    - Azure Integrated HSM supports only sizes **8 vCores** and higher.
- Trusted Launch security type supported only.
    - This feature is available only for the Trusted Launch security type. Standard and Confidential security types aren't supported.
- No persistence of locally cached keys across VM deallocation and reboot scenarios.
    - Azure Integrated HSM is a local key cache designed to support ephemeral cryptographic operations. Keys won't persist across reboots of the virtual machine.

## Next steps

- [How to deploy with Azure Integrated HSM enabled](/azure/security/fundamentals/how-to-deploy-azure-integrated-hardware-security-module)
