---
title: Azure Managed HSM Overview - Azure Managed HSM | Microsoft Docs
description: Azure Managed HSM is a cloud service that safeguards your cryptographic keys for cloud applications.
services: key-vault
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: overview
ms.date: 02/28/2023
ms.author: mbaldwin
author: msmbaldwin
ms.collection:
  - zerotrust-extra

#Customer intent: As an IT Pro, Decision maker or developer I am trying to learn what Managed HSM is and if it offers anything that could be used in my organization.

---
# What is Azure Key Vault Managed HSM?

Azure Key Vault Managed HSM (Hardware Security Module) is a fully managed, highly available, single-tenant, standards-compliant cloud service that enables you to safeguard cryptographic keys for your cloud applications, using **FIPS 140-2 Level 3** validated HSMs. It is one of several [key management solutions in Azure](../../security/fundamentals/key-management.md).

For pricing information, please see Managed HSM Pools section on [Azure Key Vault pricing page](https://azure.microsoft.com/pricing/details/key-vault/). For supported key types, see [About keys](../keys/about-keys.md).

The term "Managed HSM instance" is synonymous with "Managed HSM pool". To avoid confusion, we use "Managed HSM instance" throughout these articles.

[!INCLUDE [Zero Trust principles ](../../../includes/security/zero-trust-principles-key-management.md)]

## Why use Managed HSM?

### Fully managed, highly available, single-tenant HSM as a service

- **Fully managed**: HSM provisioning, configuration, patching, and maintenance is handled by the service.
- **Highly available**: Each HSM cluster consists of multiple HSM partitions. If the hardware fails, member partitions for your HSM cluster will be automatically migrated to healthy nodes. For more information, see [Managed HSM Service Level Agreement](https://azure.microsoft.com/support/legal/sla/key-vault-managed-hsm/v1_0/)
- **Single-tenant**: Each Managed HSM instance is dedicated to a single customer and consists of a cluster of multiple HSM partitions. Each HSM cluster uses a separate customer-specific security domain that cryptographically isolates each customer's HSM cluster.


### Access control, enhanced data protection & compliance

- **Centralized key management**: Manage critical, high-value keys across your organization in one place. With granular per key permissions, control access to each key on the 'least privileged access' principle.
- **Isolated access control**: Managed HSM "local RBAC" access control model allows designated HSM cluster administrators to have complete control over the HSMs that even management group, subscription, or resource group administrators cannot override.
- **Private endpoints**: Use private endpoints to securely and privately connect to Managed HSM from your application running in a virtual network.
- **FIPS 140-2 Level 3 validated HSMs**: Protect your data and meet compliance requirements with FIPS (Federal Information Protection Standard) 140-2 Level 3 validated HSMs. Managed HSMs use Marvell LiquidSecurity HSM adapters.
- **Monitor and audit**: fully integrated with Azure monitor. Get complete logs of all activity via Azure Monitor. Use Azure Log Analytics for analytics and alerts.
- **Data residency**: Managed HSM doesn't store/process customer data outside the region the customer deploys the HSM instance in.

### Integrated with Azure and Microsoft PaaS/SaaS services

- Generate (or import using [BYOK](hsm-protected-keys-byok.md)) keys and use them to encrypt your data at rest in Azure services such as [Azure Storage](../../storage/common/customer-managed-keys-overview.md), [Azure SQL](/azure/azure-sql/database/transparent-data-encryption-byok-overview), [Azure Information Protection](/azure/information-protection/byok-price-restrictions), and [Customer Key for Microsoft 365](/microsoft-365/compliance/customer-key-set-up). For a more complete list of Azure services which work with Managed HSM, see [Data Encryption Models](../../security/fundamentals/encryption-models.md#supporting-services).

### Uses same API and management interfaces as Key Vault

- Easily migrate your existing applications that use a vault (a multi-tenant) to use Managed HSMs.
- Use same application development and deployment patterns for all your applications irrespective of key management solution in use: multi-tenant vaults or single-tenant Managed HSMs.

### Import keys from your on-premises HSMs

- Generate HSM-protected keys in your on-premises HSM and import them securely into Managed HSM.

## Next steps
- [Key management in Azure](../../security/fundamentals/key-management.md)
- For technical details, see [How Managed HSM implements key sovereignty, availability, performance, and scalability without tradeoffs](managed-hsm-technical-details.md)
- See [Quickstart: Provision and activate a managed HSM using Azure CLI](quick-create-cli.md) to create and activate a managed HSM
- [Azure Managed HSM security baseline](/security/benchmark/azure/baselines/key-vault-managed-hsm-security-baseline)
- See [Best Practices using Azure Key Vault Managed HSM](best-practices.md)
- [Managed HSM Status](https://azure.status.microsoft)
- [Managed HSM Service Level Agreement](https://azure.microsoft.com/support/legal/sla/key-vault-managed-hsm/v1_0/)
- [Managed HSM region availability](https://azure.microsoft.com/global-infrastructure/services/?products=key-vault)
- [What is Zero Trust?](/security/zero-trust/zero-trust-overview)
