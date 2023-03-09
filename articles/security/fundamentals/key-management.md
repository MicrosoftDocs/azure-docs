---
title: Overview of Key Management in Azure
description: This article provides an overview of Key Management in Azure.
services: security
author: msmbaldwin

ms.service: security
ms.topic: article
ms.date: 02/28/2023
ms.author: mbaldwin
ms.collection:
  - zerotrust-services
---

# Key management in Azure

[!INCLUDE [Zero Trust principles ](../../../includes/security/zero-trust-principles-key-management.md)]

In Azure, encryption keys can be either platform managed or customer managed.

Platform-managed keys (PMKs) are encryption keys that are generated, stored, and managed entirely by Azure. Customers do not interact with PMKs. The keys used for [Azure Data Encryption-at-Rest](encryption-atrest.md), for instance, are PMKs by default.  

Customer-managed keys (CMK), on the other hand, are those that can be read, created, deleted, updated, and/or administered by one or more customers. Keys stored in a customer-owned key vault or hardware security module (HSM) are CMKs.  Bring Your Own Key (BYOK) is a CMK scenario in which a customer imports (brings) keys from an outside storage location into an Azure key management service (see the [Azure Key Vault: Bring your own key specification](../../key-vault/keys/byok-specification.md)).

A specific kind of customer-managed key is the "key encryption key" (KEK). A KEK is a primary key that controls access to one or more encryption keys that are themselves encrypted.

Customer-managed keys can be stored on-premises or, more commonly, in a cloud key management service.

## Azure key management services

Azure offers several options for storing and managing your keys in the cloud, including Azure Key Vault, Azure Managed HSM, Dedicated HSM, and Payments HSM. These options differ in terms of their FIPS compliance level, management overhead, and intended applications.

**Azure Key Vault (Standard Tier)**: A FIPS 140-2 Level 1 validated multi-tenant cloud key management service that can also be used to store secrets and certificates. Keys stored in Azure Key Vault are software-protected and can be used for encryption-at-rest and custom applications. Key Vault provides a modern API and the widest breadth of regional deployments and integrations with Azure Services. For more information, see [About Azure Key Vault](../../key-vault/general/overview.md).

**Azure Key Vault (Premium Tier)**: A FIPS 140-2 Level 2 validated multi-tenant HSM offering that can be used to store keys in a secure hardware boundary. Microsoft manages and operates the underlying HSM, and keys stored in Azure Key Vault Premium can be used for encryption-at-rest and custom applications. Key Vault Premium also provides a modern API and the widest breadth of regional deployments and integrations with Azure Services. For more information, see [About Azure Key Vault](../../key-vault/general/overview.md).

**Azure Managed HSM**: A FIPS 140-2 Level 3 validated single-tenant HSM offering that gives customers full control of an HSM for encryption-at-rest, Keyless SSL, and custom applications. Customers receive a pool of three HSM partitions—together acting as one logical, highly available HSM appliance--fronted by a service that exposes crypto functionality through the Key Vault API. Microsoft handles the provisioning, patching, maintenance, and hardware failover of the HSMs, but doesn't have access to the keys themselves, because the service executes within Azure's Confidential Compute Infrastructure. Managed HSM is integrated with the Azure SQL, Azure Storage, and Azure Information Protection PaaS services and offers support for Keyless TLS with F5 and Nginx. For more information, see [What is Azure Key Vault Managed HSM?](../../key-vault/managed-hsm/overview.md) 

**Azure Dedicated HSM**: A FIPS 140-2 Level 3 validated bare metal HSM offering, that lets customers lease a general-purpose HSM appliance that resides in Microsoft datacenters. The customer has complete and total ownership over the HSM device and is responsible for patching and updating the firmware when required. Microsoft has no permissions on the device or access to the key material, and Dedicated HSM is not integrated with any Azure PaaS offerings. Customers can interact with the HSM using the PKCS#11, JCE/JCA, and KSP/CNG APIs. This offering is most useful for legacy lift-and-shift workloads, PKI, SSL Offloading and Keyless TLS (supported integrations include F5, Nginx, Apache, Palo Alto, IBM GW and more), OpenSSL applications, Oracle TDE, and Azure SQL TDE IaaS. For more information, see [What is Azure Key Vault Managed HSM?](../../dedicated-hsm/overview.md) 

**Azure Payments HSM**: A FIPS 140-2 Level 3, PCI HSM v3, validated bare metal offering that lets customers lease a payment HSM appliance in Microsoft datacenters for payments operations, including payment processing, payment credential issuing, securing keys and authentication data, and sensitive data protection. The service is PCI DSS and PCI 3DS compliant. Azure Payment HSM offers single-tenant HSMs for customers to have complete administrative control and exclusive access to the HSM. Once the HSM is allocated to a customer, Microsoft has no access to customer data. Likewise, when the HSM is no longer required, customer data is zeroized and erased as soon as the HSM is released, to ensure complete privacy and security is maintained. For more information, see [About Azure Payment HSM](../../payment-hsm/overview.md).

### Pricing

The Azure Key Vault Standard and Premium tiers are billed on a transactional basis, with an additional monthly per-key charge for premium hardware-backed keys. Managed HSM, Dedicated HSM, and Payments HSM don't charge on a transactional basis; instead they are always-in-use devices that are billed at a fixed hourly rate. For detailed pricing information, see [Key Vault pricing](https://azure.microsoft.com/pricing/details/key-vault), [Dedicated HSM pricing](https://azure.microsoft.com/pricing/details/azure-dedicated-hsm), and [Payment HSM pricing](https://azure.microsoft.com/pricing/details/payment-hsm).

### Service Limits

Managed HSM, Dedicated HSM, and Payments HSM offer dedicated capacity. Key Vault Standard and Premium are multi-tenant offerings and have throttling limits. For service limits, see [Key Vault service limits](../../key-vault/general/service-limits.md). 

### Encryption-At-Rest

Azure Key Vault and Azure Key Vault Managed HSM have integrations with Azure Services and Microsoft 365 for Customer Managed Keys, meaning customers may use their own keys in Azure Key Vault and Azure Key Managed HSM for encryption-at-rest of data stored in these services. Dedicated HSM and Payments HSM are Infrastructure-as-Service offerings and do not offer integrations with Azure Services. For an overview of encryption-at-rest with Azure Key Vault and Managed HSM, see [Azure Data Encryption-at-Rest](encryption-atrest.md).

### APIs 

Dedicated HSM and Payments HSM support the PKCS#11, JCE/JCA, and KSP/CNG APIs, but Azure Key Vault and Managed HSM do not. Azure Key Vault and  Managed HSM use the Azure Key Vault REST API and offer SDK support. For more information on the Azure Key Vault API, see [Azure Key Vault REST API Reference](/rest/api/keyvault/).

## What's next

- [Azure Key Vault](../../key-vault/general/overview.md)
- [Azure Managed HSM](../../key-vault/managed-hsm/overview.md)
- [Azure Dedicated HSM](../../dedicated-hsm/overview.md)
- [Azure Payment HSM](../../payment-hsm/overview.md)
- [What is Zero Trust?](/security/zero-trust/zero-trust-overview)
