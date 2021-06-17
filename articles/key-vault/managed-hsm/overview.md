---
title: Azure Managed HSM Overview - Azure Managed HSM | Microsoft Docs
description: Azure Managed HSM is a cloud service that safeguards your cryptographic keys for cloud applications.
services: key-vault
tags: azure-resource-manager

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: overview
ms.custom: mvc
ms.date: 04/01/2021
ms.author: mbaldwin
author: msmbaldwin
#Customer intent: As an IT Pro, Decision maker or developer I am trying to learn what Managed HSM is and if it offers anything that could be used in my organization.

---
# What is Azure Key Vault Managed HSM?

Azure Key Vault Managed HSM is a fully managed, highly available, single-tenant, standards-compliant cloud service that enables you to safeguard cryptographic keys for your cloud applications, using **FIPS  140-2 Level 3** validated HSMs. For pricing information please see Managed HSM Pools section on [Azure Key Vault pricing page](https://azure.microsoft.com/pricing/details/key-vault/). 

## Why use Managed HSM?

### Fully managed, highly available, single-tenant HSM as a service

- **Fully managed**: HSM provisioning, configuration, patching, and maintenance is handled by the service. 
- **Highly available and zone resilient** (where Availability zones are supported): Each HSM cluster consists of multiple HSM partitions that span across at least two availability zones. If the hardware fails, member partitions for your HSM cluster will be automatically migrated to healthy nodes.
- **Single-tenant**: Each Managed HSM instance is dedicated to a single customer and consists of a cluster of multiple HSM partitions. Each HSM cluster uses a separate customer-specific security domain that cryptographically isolates each customer's HSM cluster.


### Access control, enhanced data protection & compliance

- **Centralized key management**: Manage critical, high-value keys across your organization in one place. With granular per key permissions, control access to each key on the 'least privileged access' principle.
- **Isolated access control**: Managed HSM "local RBAC" access control model allows designated HSM cluster administrators to have complete control over the HSMs that even management group, subscription, or resource group administrators cannot override.
- **FIPS 140-2 Level 3 validated HSMs**: Protect your data and meet compliance requirements with FIPS ((Federal Information Protection Standard)) 140-2 Level 3 validated HSMs. Managed HSMs use Marvell LiquidSecurity HSM adapters.
- **Monitor and audit**: fully integrated with Azure monitor. Get complete logs of all activity via Azure Monitor. Use Azure Log Analytics for analytics and alerts.
- **Data residency**: Managed HSM doesn't store/process customer data outside the region the customer deploys the HSM instance in.

### Integrated with Azure and Microsoft PaaS/SaaS services 

- Generate (or import using [BYOK](hsm-protected-keys-byok.md)) keys and use them to encrypt your data at rest in Azure services such as [Azure Storage](../../storage/common/customer-managed-keys-overview.md), [Azure SQL](../../azure-sql/database/transparent-data-encryption-byok-overview.md), and [Azure Information Protection](/azure/information-protection/byok-price-restrictions).

### Uses same API and management interfaces as Key Vault

- Easily migrate your existing applications that use a vault (a multi-tenant) to use managed HSMs.
- Use same application development and deployment patterns for all your applications irrespective of key management solution in use: multi-tenant vaults or single-tenant managed HSMs

### Import keys from your on-premise HSMs

- Generate HSM-protected keys in your on-premise HSM and import them securely into Managed HSM

## Next steps
- See [Quickstart: Provision and activate a managed HSM using Azure CLI](quick-create-cli.md) to create and activate a managed HSM
- See [Best Practices using Azure Key Vault Managed HSM](best-practices.md)
