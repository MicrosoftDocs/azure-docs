---
title: Overview of key management in Azure
description: Overview of Azure key management solutions. Compare Azure Key Vault, Managed HSM, Cloud HSM, and Payment HSM by compliance, pricing, and capabilities.
services: security
author: msmbaldwin
ms.service: security
ms.topic: article
ms.date: 07/08/2026
ms.author: mbaldwin
ai-usage: ai-assisted
ms.collection:
  - zerotrust-extra
---

# Key management in Azure

[!INCLUDE [Zero Trust principles](~/reusable-content/ce-skilling/azure/includes/security/zero-trust-principles-key-management.md)]

Azure supports platform-managed and customer-managed encryption keys.

Azure generates, stores, and manages platform-managed keys (PMKs). You don't need to interact with PMKs. For example, the keys used for [Azure Data Encryption at Rest](encryption-atrest.md) are PMKs by default.

Customer-managed keys (CMKs) are keys that you create, delete, use, and manage. You can store CMKs in a customer-owned key vault or hardware security module (HSM). Bring your own key (BYOK) is a CMK scenario where you import keys from an external storage location into an Azure key management service. For more information, see [Azure Key Vault: Bring your own key specification](/azure/key-vault/keys/byok-specification).

A key encryption key (KEK) is a primary key that controls access to one or more encryption keys that it encrypts.

You can store CMKs on-premises or, more commonly, in a cloud key management service.

## Azure key management services

Azure offers several options for storing and managing your keys in the cloud, including Azure Key Vault, Azure Key Vault Managed HSM, Azure Cloud HSM, and Azure Payment HSM. These options differ in their FIPS compliance level, management overhead, and intended applications.

For a comprehensive guide to choosing the right key management solution, see [How to choose the right key management solution](key-management-choose.md).

### Azure Key Vault (standard tier)

Azure Key Vault standard tier is a FIPS 140-2 Level 1 validated multitenant cloud key management service. You can use it to store asymmetric keys, secrets, and certificates. Keys stored in Azure Key Vault standard tier are software-protected. You can use them for encryption at rest and custom applications. Azure Key Vault standard tier provides a modern API and broad regional deployments and integrations with Azure services. For more information, see [About Azure Key Vault](/azure/key-vault/general/overview).

### Azure Key Vault (premium tier)

Azure Key Vault premium tier is a FIPS 140-3 Level 3 validated, PCI-compliant, multitenant HSM offering. Use it to store asymmetric keys, secrets, and certificates. It stores keys in a secure hardware boundary by using Marvell LiquidSecurity HSMs. Microsoft manages and operates the underlying HSM. Use keys stored in Azure Key Vault premium tier for encryption at rest and custom applications. Azure Key Vault premium tier also provides a modern API, broad regional deployments, and integrations with Azure services.

> [!IMPORTANT]
> Azure Integrated HSM is a separate Azure infrastructure capability for cryptographic operations in supported virtual machines (VMs). This capability is generally available on supported AMD v7 VM SKUs for Windows Trusted Launch VMs with 8 vCPUs or more and requires customer opt-in. For more information, see [Azure Integrated HSM overview](azure-integrated-hardware-security-module-overview.md).

If you're an Azure Key Vault premium tier customer looking for key sovereignty, single tenancy, or higher crypto operations per second, consider Azure Key Vault Managed HSM instead. Key Vault premium tier uses shared HSMs operated by Microsoft. Use Managed HSM for workloads that require a customer-owned root of trust. For more information, see [About Azure Key Vault](/azure/key-vault/general/overview).

> [!NOTE]
> Azure Key Vault premium tier allows the creation of both software-protected and HSM-protected keys. If you use Azure Key Vault premium tier, verify that the key you create is HSM-protected.

### Azure Key Vault Managed HSM

Azure Key Vault Managed HSM is a FIPS 140-3 Level 3 validated, single-tenant HSM offering that gives you full control of an HSM for encryption at rest, Keyless SSL/TLS offload, [external key management](/azure/key-vault/managed-hsm/external-key-management-overview), and custom applications. External key management is in preview and supports wrap and unwrap operations only. Azure Key Vault Managed HSM is the only key management solution offering confidential keys. You receive a pool of three HSM partitions that act as one logical, highly available HSM appliance. A service front-end exposes cryptographic functionality through the Key Vault API. Microsoft handles HSM provisioning, patching, maintenance, and hardware failover, but doesn't have access to the keys. The customer owns and controls the security domain, which is the root of trust for the HSM. Loss of the security domain results in permanent, irrecoverable loss of all keys. Azure Key Vault Managed HSM integrates with Azure SQL, Azure Storage, Azure Information Protection, and Customer Key for Microsoft 365. It also supports Keyless TLS with F5 and NGINX. For more information, see [Azure Key Vault Managed HSM overview](/azure/key-vault/managed-hsm/overview).

### Azure Cloud HSM

Azure Cloud HSM is a highly available, FIPS 140-3 Level 3 validated single-tenant service that gives you complete administrative authority over your HSMs. Azure Cloud HSM is the successor to Azure Dedicated HSM and provides a secure, customer-owned HSM cluster for storing cryptographic keys and performing cryptographic operations. Microsoft handles high availability, patching, and maintenance of the HSM infrastructure. The service supports various applications, including [PKCS#11](/azure/cloud-hsm/integration-guides), SSL/TLS offloading with Apache, NGINX, and F5 BIG-IP, certificate authority (CA) private key protection, transparent data encryption (TDE), and document and code signing. Azure Cloud HSM supports industry-standard APIs, including PKCS#11, OpenSSL, Java Cryptography Architecture (JCA), Java Cryptography Extension (JCE), Cryptography API: Next Generation (CNG), and key storage provider (KSP). These APIs make Azure Cloud HSM a good option for [migrating applications](/azure/cloud-hsm/onboarding-guide) from on-premises, Azure Dedicated HSM, or AWS CloudHSM. For more information, see [Azure Cloud HSM overview](/azure/cloud-hsm/overview).

### Azure Payment HSM

Azure Payment HSM is a FIPS 140-2 Level 3 and PCI HSM v3 validated single-tenant bare-metal HSM offering. You can lease a payment HSM appliance in Microsoft datacenters for payment operations, including payment PIN processing, payment credential issuing, key and authentication data security, and sensitive data protection. The service is PCI DSS, PCI 3DS, and PCI PIN compliant. Azure Payment HSM offers single-tenant HSMs so you have complete administrative control and exclusive access to the HSM. After Microsoft allocates the HSM to you, Microsoft has no access to customer data. When you no longer require the HSM, Microsoft zeroizes and erases customer data as soon as you release the HSM to help maintain privacy and security. For more information, see [Azure Payment HSM overview](/azure/payment-hsm/overview).

### Azure Dedicated HSM (retiring)

Azure Dedicated HSM is retiring. Microsoft will fully support existing Dedicated HSM customers until July 31, 2028. Microsoft doesn't accept new customer onboarding requests. For full details and required actions, see the [Azure Dedicated HSM retirement announcement](https://azure.microsoft.com/updates?id=499214).

If you're an Azure Dedicated HSM user, see [Transition from Azure Dedicated HSM to Azure Key Vault Managed HSM or Azure Cloud HSM](/azure/dedicated-hsm/migration-guide). Azure Cloud HSM is now generally available and the successor to Azure Dedicated HSM.

## Pricing

Azure Key Vault standard and premium tiers bill on a transactional basis, with an extra monthly per-key charge for premium hardware-backed keys. Azure Key Vault Managed HSM, Azure Cloud HSM, and Azure Payment HSM don't charge on a transactional basis. Instead, they're always-on devices that bill at a fixed hourly rate. For detailed pricing information, see [Key Vault pricing](https://azure.microsoft.com/pricing/details/key-vault/), [Cloud HSM pricing](https://azure.microsoft.com/pricing/details/azure-cloud-hsm/), and [Payment HSM pricing](https://azure.microsoft.com/pricing/details/payment-hsm/).

## Service limits

Azure Key Vault Managed HSM, Azure Cloud HSM, and Azure Payment HSM offer dedicated capacity. Azure Key Vault standard and premium tiers are multitenant offerings and have throttling limits. For service limits, see [Key Vault service limits](/azure/key-vault/general/service-limits) and [Cloud HSM service limits](/azure/cloud-hsm/service-limits).

## Encryption at rest

Azure Key Vault and Azure Key Vault Managed HSM integrate with Azure services and Microsoft 365 for customer-managed keys. You can use your own keys in Azure Key Vault and Azure Key Vault Managed HSM for encryption at rest of data stored in these services. For organizations with regulatory or contractual requirements that mandate key material physically reside outside Microsoft infrastructure, Azure Key Vault Managed HSM also supports [external key management](/azure/key-vault/managed-hsm/external-key-management-overview). External key management is in preview and keeps the key encryption key in a customer-operated HSM outside Azure. Azure Cloud HSM and Azure Payment HSM are infrastructure as a service (IaaS) offerings and don't integrate with Azure platform as a service (PaaS) or software as a service (SaaS) services. For an overview of encryption at rest with Azure Key Vault and Azure Key Vault Managed HSM, see [Azure Data Encryption at Rest](encryption-atrest.md).

## APIs

Azure Cloud HSM supports the PKCS#11, OpenSSL, JCA, JCE, CNG, and KSP APIs. Azure Payment HSM uses Thales payShield interfaces for HSM management and cryptographic operations. Azure Key Vault and Azure Key Vault Managed HSM don't support these APIs. Instead, they use the Azure Key Vault REST API and offer SDK support. For more information on the Azure Key Vault API, see [Azure Key Vault REST API Reference](/rest/api/keyvault/).

## Next steps

- [How to choose the right key management solution](key-management-choose.md)
- [Azure Key Vault](/azure/key-vault/general/overview)
- [Azure Key Vault Managed HSM](/azure/key-vault/managed-hsm/overview)
- [Azure Cloud HSM](/azure/cloud-hsm/overview)
- [Azure Payment HSM](/azure/payment-hsm/overview)
- [What is Zero Trust?](/security/zero-trust/zero-trust-overview)
