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
- Fully managed, highly available, single-tenant, uses FIPS 140-2 Level 3 validated HSMs
- Zone resilient (where Availability zones are supported)
- Integrated with Azure PaaS/SaaS services (same as Azure Key Vault) for encryption at rest with customer managed keys
- Each Managed HSM instance is dedicated to a single customer and consists of a pool of multiple HSM partitions spread across  Availability Zones to provide high availability within the region
- You can increase the durability and high availability further by extending the HSM pool to span multiple regions (coming soon)
    - All regional HSM pools are kept in sync automatically
    - Each HSM Pool in a region can be addressed through its regional endpoint
    - Managed HSM instance will also have a global endpoint that allows reaching closest available regional endpoint (can be cross-region)
