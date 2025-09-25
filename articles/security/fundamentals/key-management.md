---
title: Overview of Key Management in Azure
description: This article provides an overview of Key Management in Azure.
services: security
author: msmbaldwin

ms.service: security
ms.topic: article
ms.date: 04/16/2025
ms.author: mbaldwin
ms.collection:
  - zerotrust-extra
---

# Key management in Azure

[!INCLUDE [Zero Trust principles](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-principles-key-management.md)]

In Azure, encryption keys can be either platform managed or customer managed.

Platform-managed keys (PMKs) are encryption keys generated, stored, and managed entirely by Azure. Customers do not interact with PMKs. The keys used for [Azure Data Encryption-at-Rest](encryption-atrest.md), for instance, are PMKs by default.  

Customer-managed keys (CMK), on the other hand, are keys read, created, deleted, updated, and/or administered by one or more customers. Keys stored in a customer-owned key vault or hardware security module (HSM) are CMKs. Bring Your Own Key (BYOK) is a CMK scenario in which a customer imports (brings) keys from an outside storage location into an Azure key management service (see the [Azure Key Vault: Bring your own key specification](/azure/key-vault/keys/byok-specification)).

A specific type of customer-managed key is the "key encryption key" (KEK). A KEK is a primary key that controls access to one or more encryption keys that are themselves encrypted.

Customer-managed keys can be stored on-premises or, more commonly, in a cloud key management service.

## Azure key management services

Azure offers several options for storing and managing your keys in the cloud, including Azure Key Vault, Azure Managed HSM, Azure Cloud HSM Preview, and Azure Payment HSM. These options differ in terms of their FIPS compliance level, management overhead, and intended applications.

For an overview of each key management service and a comprehensive guide to choosing the right key management solution for you, see [How to Choose the Right Key Management Solution](key-management-choose.md).

### Pricing

The Azure Key Vault Standard and Premium tiers are billed on a transactional basis, with an extra monthly per-key charge for premium hardware-backed keys. Managed HSM, Cloud HSM Preview, and Payments HSM don't charge on a transactional basis; instead they are always-in-use devices that are billed at a fixed hourly rate. For detailed pricing information, see [Key Vault pricing](https://azure.microsoft.com/pricing/details/key-vault) and [Payment HSM pricing](https://azure.microsoft.com/pricing/details/payment-hsm).

### Service Limits

Managed HSM, Cloud HSM Preview, and Payments HSM offer dedicated capacity. Key Vault Standard and Premium are multitenant offerings and have throttling limits. For service limits, see [Key Vault service limits](/azure/key-vault/general/service-limits). 

### Encryption-At-Rest

Azure Key Vault and Azure Key Vault Managed HSM have integrations with Azure Services and Microsoft 365 for Customer Managed Keys, meaning customers may use their own keys in Azure Key Vault and Azure Managed HSM for encryption-at-rest of data stored in these services. Cloud HSM Preview and Payments HSM are Infrastructure-as-Service offerings and do not offer integrations with Azure Services. For an overview of encryption-at-rest with Azure Key Vault and Managed HSM, see [Azure Data Encryption-at-Rest](encryption-atrest.md).

### APIs

Cloud HSM Preview and Payments HSM support the PKCS#11, JCE/JCA, and KSP/CNG APIs, but Azure Key Vault and Managed HSM do not. Azure Key Vault and Managed HSM use the Azure Key Vault REST API and offer SDK support. For more information on the Azure Key Vault API, see [Azure Key Vault REST API Reference](/rest/api/keyvault/).

## What's next

- [How to Choose the Right Key Management Solution](key-management-choose.md)
- [Azure Key Vault](/azure/key-vault/general/overview)
- [Azure Managed HSM](/azure/key-vault/managed-hsm/overview)
- [Azure Cloud HSM Preview](/azure/cloud-hsm/overview)
- [Azure Payment HSM](/azure/payment-hsm/overview)
- [What is Zero Trust?](/security/zero-trust/zero-trust-overview)
