---
title: Azure Managed HSM Overview - Azure Managed HSM | Microsoft Docs
description: Azure Managed HSM is a cloud service that safeguards your cryptographic keys for cloud applications.
services: key-vault
author: msmbaldwin
manager: rkarlin
tags: azure-resource-manager

ms.service: key-vault
ms.topic: overview
ms.custom: mvc
ms.date: 01/07/2019
ms.author: mbaldwin
#Customer intent: As an IT Pro, Decision maker or developer I am trying to learn what Managed HSM is and if it offers anything that could be used in my organization.

---
# What is Azure Key Vault Managed HSM?

Managed HSM is a cloud service that safeguards cryptographic keys for your cloud application. Managed HSM is a fully managed, highly available, single-tenant key management service that uses a **FIPS (Federal Information Protection Standard) 140-2 Level 3** validated HSMs.

## Key Benefits

### Fully managed, highly available, single-tenant HSM as a service
- **Single-tenant** - Each Managed HSM instance is dedicated to a single customer and consists of a pool of multiple HSM partitions spread across  Availability Zones to provide high availability within the region. Each HSM pool uses a separate customer-specific security domain that cryptographically isolates each customer's HSM pool while using the same hardware infrastructure.
- **Highly available and zone resilient (where Availability zones are supported)** - Each HSM pool consists of multiple HSM partitions spans at least 2 availability zones
- **Fully managed** - 
- Further increase the durability and high availability further by extending the HSM pool to span multiple regions (coming soon)
    - All regional HSM pools are kept in sync automatically
    - Each HSM Pool in a region can be addressed through its regional endpoint
    - Managed HSM instance will also have a global endpoint that allows reaching closest available regional endpoint (can be cross-region)

### Integrated with Azure PaaS/SaaS services 
- Use cryptographic keys in Managed HSM pool to encrypt your data at rest  encryption at rest in Azure services, Office 365 Customer Key, Azure Information Protection




### Uses same API and management interfaces as Key Vault
- Easily migrate from Key Vault (a multi-tenant) service 
