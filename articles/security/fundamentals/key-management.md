---
title: Overview of Key Management in Azure
description: This article provides an overview of Key Management in Azure.
services: security
author: msmbaldwin
ms.service: security
ms.topic: article
ms.date: 01/08/2026
ms.author: mbaldwin
ms.collection:
  - zerotrust-extra
---

# Key management in Azure

[!INCLUDE [Zero Trust principles](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-principles-key-management.md)]

In Azure, encryption keys can be either platform managed or customer managed.

Platform-managed keys (PMKs) are encryption keys generated, stored, and managed entirely by Azure. Customers do not interact with PMKs. The keys used for [Azure Data Encryption-at-Rest](/azure/security/fundamentals/encryption-atrest), for instance, are PMKs by default.  

Customer-managed keys (CMK), on the other hand, are keys read, created, deleted, updated, and/or administered by one or more customers. Keys stored in a customer-owned key vault or hardware security module (HSM) are CMKs. Bring Your Own Key (BYOK) is a CMK scenario in which a customer imports (brings) keys from an outside storage location into an Azure key management service (see the [Azure Key Vault: Bring your own key specification](/azure/key-vault/keys/byok-specification)).

A specific type of customer-managed key is the "key encryption key" (KEK). A KEK is a primary key that controls access to one or more encryption keys that are themselves encrypted.

Customer-managed keys can be stored on-premises or, more commonly, in a cloud key management service.

## Azure key management services

Azure offers several options for storing and managing your keys in the cloud, including Azure Key Vault, Azure Key Vault Managed HSM, Azure Cloud HSM, and Azure Payment HSM. These options differ in terms of their FIPS compliance level, management overhead, and intended applications.

For a comprehensive guide to choosing the right key management solution for your specific needs, see [How to Choose the Right Key Management Solution](/azure/security/fundamentals/key-management-choose).

### Azure Key Vault (Standard Tier)

A FIPS 140-2 Level 1 validated multitenant cloud key management service that can be used to store asymmetric keys, secrets, and certificates. Keys stored in Azure Key Vault are software-protected and can be used for encryption-at-rest and custom applications. Azure Key Vault Standard provides a modern API and a breadth of regional deployments and integrations with Azure Services. For more information, see [About Azure Key Vault](/azure/key-vault/general/overview).

### Azure Key Vault (Premium Tier)

A FIPS 140-3 Level 3 validated, PCI compliant, multitenant HSM offering that can be used to store asymmetric keys, secrets, and certificates. Keys are stored in a secure hardware boundary using Marvell LiquidSecurity HSMs*. Microsoft manages and operates the underlying HSM, and keys stored in Azure Key Vault Premium can be used for encryption-at-rest and custom applications. Azure Key Vault Premium also provides a modern API and a breadth of regional deployments and integrations with Azure Services. 

> [!IMPORTANT]
> **Azure Integrated HSM**: Starting with new Azure server hardware (AMD D and E Series v7 Preview), Microsoft-designed HSM chips are being embedded directly on servers, meeting FIPS 140-3 Level 3 standards. These tamper-resistant chips keep encryption keys within secure hardware boundaries, eliminating latency and exposure risks. The integrated HSM operates transparently by default for supported services like Azure Key Vault and Azure Storage encryption, providing hardware-enforced trust without additional configuration. This integration ensures that cryptographic operations benefit from hardware-level security isolation while maintaining the performance and scalability of cloud services.

If you are an Azure Key Vault Premium customer looking for key sovereignty, single tenancy, and/or higher crypto operations per second, you may want to consider Azure Key Vault Managed HSM instead. For more information, see [About Azure Key Vault](/azure/key-vault/general/overview).

### Azure Key Vault Managed HSM

A FIPS 140-3 Level 3 validated, single-tenant HSM offering that gives customers full control of an HSM for encryption-at-rest, Keyless SSL/TLS offload, and custom applications. Azure Key Vault Managed HSM is the only key management solution offering confidential keys. Customers receive a pool of three HSM partitions—together acting as one logical, highly available HSM appliance—fronted by a service that exposes crypto functionality through the Key Vault API. Microsoft handles the provisioning, patching, maintenance, and hardware failover of the HSMs, but doesn't have access to the keys themselves, because the service executes within Azure's Confidential Compute Infrastructure. Azure Key Vault Managed HSM is integrated with the Azure SQL, Azure Storage, and Azure Information Protection PaaS services and offers support for Keyless TLS with F5 and Nginx. For more information, see [What is Azure Key Vault Managed HSM?](/azure/key-vault/managed-hsm/overview).

### Azure Cloud HSM

A highly available, FIPS 140-3 Level 3 validated single-tenant service that grants customers complete administrative authority over their HSMs. Azure Cloud HSM is the successor to Azure Dedicated HSM and provides a secure, customer-owned HSM cluster for storing cryptographic keys and performing cryptographic operations. Microsoft handles high availability, patching, and maintenance of the HSM infrastructure. The service supports various applications, including [PKCS#11](/azure/cloud-hsm/integration-guides), SSL/TLS offloading, certificate authority (CA) private key protection, transparent data encryption (TDE), and document and code signing. Azure Cloud HSM supports industry-standard APIs including PKCS#11, OpenSSL, JCA/JCE, and Microsoft CNG/KSP, making it ideal for [migrating applications](/azure/cloud-hsm/onboarding-guide) from on-premises, Azure Dedicated HSM, or AWS CloudHSM. For more information, see [What is Azure Cloud HSM?](/azure/cloud-hsm/overview).

### Azure Payment HSM

A FIPS 140-2 Level 3, PCI HSM v3, validated single-tenant bare metal HSM offering that lets customers lease a payment HSM appliance in Microsoft datacenters for payments operations, including payment PIN processing, payment credential issuing, securing keys and authentication data, and sensitive data protection. The service is PCI DSS, PCI 3DS, and PCI PIN compliant. Azure Payment HSM offers single-tenant HSMs for customers to have complete administrative control and exclusive access to the HSM. Once the HSM is allocated to a customer, Microsoft has no access to customer data. Likewise, when the HSM is no longer required, customer data is zeroized and erased as soon as the HSM is released, to ensure complete privacy and security is maintained. For more information, see [What Is Azure Payment HSM?](/azure/payment-hsm/overview).

> [!NOTE]
> \* Azure Key Vault Premium allows the creation of both software-protected and HSM protected keys. If using Azure Key Vault Premium, check to ensure that the key created is HSM protected.

### Azure Dedicated HSM (retiring)

Azure Dedicated HSM is being retired. Microsoft will fully support existing Dedicated HSM customers until July 31, 2028. No new customer onboardings are accepted. For full details and required actions, see the [official Azure update](https://azure.microsoft.com/updates/azure-dedicated-hsm-retirement/).

If you are an Azure Dedicated HSM user, see [Migrate from Azure Dedicated HSM to Azure Managed HSM or Azure Cloud HSM](/azure/dedicated-hsm/migration-guide). Azure Cloud HSM is now generally available and the successor to Azure Dedicated HSM.

## Pricing

The Azure Key Vault Standard and Premium tiers are billed on a transactional basis, with an extra monthly per-key charge for premium hardware-backed keys. Azure Key Vault Managed HSM, Azure Cloud HSM, and Azure Payment HSM don't charge on a transactional basis; instead they are always-in-use devices that are billed at a fixed hourly rate. For detailed pricing information, see [Key Vault pricing](https://azure.microsoft.com/pricing/details/key-vault), [Cloud HSM pricing](https://azure.microsoft.com/pricing/details/azure-cloud-hsm/), and [Payment HSM pricing](https://azure.microsoft.com/pricing/details/payment-hsm).

## Service Limits

Azure Key Vault Managed HSM, Azure Cloud HSM, and Azure Payment HSM offer dedicated capacity. Azure Key Vault Standard and Premium are multitenant offerings and have throttling limits. For service limits, see [Key Vault service limits](/azure/key-vault/general/service-limits) and [Cloud HSM service limits](/azure/cloud-hsm/service-limits). 

## Encryption-At-Rest

Azure Key Vault and Azure Key Vault Managed HSM have integrations with Azure Services and Microsoft 365 for Customer Managed Keys, meaning customers may use their own keys in Azure Key Vault and Azure Key Vault Managed HSM for encryption-at-rest of data stored in these services. Azure Cloud HSM and Azure Payment HSM are Infrastructure-as-Service offerings and do not offer integrations with Azure Services. For an overview of encryption-at-rest with Azure Key Vault and Azure Key Vault Managed HSM, see [Azure Data Encryption-at-Rest](/azure/security/fundamentals/encryption-atrest).

## APIs

Azure Cloud HSM supports the PKCS#11, OpenSSL, JCA/JCE, and KSP/CNG APIs. Azure Payment HSM uses Thales payShield interfaces for HSM management and cryptographic operations. Azure Key Vault and Azure Key Vault Managed HSM do not support these APIs; instead, they use the Azure Key Vault REST API and offer SDK support. For more information on the Azure Key Vault API, see [Azure Key Vault REST API Reference](/rest/api/keyvault/).

## What's next

- [How to Choose the Right Key Management Solution](/azure/security/fundamentals/key-management-choose)
- [Azure Key Vault](/azure/key-vault/general/overview)
- [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview)
- [Azure Cloud HSM](/azure/cloud-hsm/overview)
- [Azure Payment HSM](/azure/payment-hsm/overview)
- [What is Zero Trust?](/security/zero-trust/zero-trust-overview)
