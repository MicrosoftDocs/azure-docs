---
title: Data encryption at rest in Microsoft Discovery
description: Learn how Microsoft Discovery encrypts data at rest, when Microsoft-managed keys are used by default, and when customer-managed keys are available.
author: mukesh-dua
ms.author: mukeshdua
ms.service: azure
ms.topic: concept-article
ms.date: 03/25/2026
---

# Data encryption at rest in Microsoft Discovery

Microsoft Discovery encrypts customer and system data at rest by using Azure platform encryption capabilities. Encryption at rest helps protect stored data from unauthorized access and is enabled automatically for Microsoft Discovery resources.

This article explains what data is encrypted, the available key management models, and when you might use customer-managed keys instead of the default Microsoft-managed keys.

## What data is encrypted at rest

Data persisted by Microsoft Discovery is encrypted before it's written to storage. This protection applies automatically and transparently to customer-provided data and service metadata stored by the platform.

Encryption at rest is enabled by default and doesn't require configuration unless you choose customer-managed keys for a supported resource.

## Key management options

Microsoft Discovery supports the following encryption key management models:

- **Microsoft-managed keys (default):** Microsoft Discovery uses keys managed by Microsoft. The platform handles key generation, storage, protection, and rotation. No customer action is required.
- **Customer-managed keys (CMK):** Supported Microsoft Discovery resources can use a key that you create and manage in Azure Key Vault. This model gives you more control over key lifecycle operations, such as rotation and revocation.

Customer-managed keys are supported for Bookshelf, Supercomputer, and Workspace resources.

> [!IMPORTANT]
> Customer-managed keys are configured when the resource is created. After the resource is created, you can't switch between Microsoft-managed keys and customer-managed keys for that resource.

## Compare Microsoft-managed keys and customer-managed keys

Use the following table to understand the difference between the two key management options.

| Key management model | Default | Customer action required | Supported scope |
| --- | --- | --- | --- |
| Microsoft-managed keys | Yes | No | All Microsoft Discovery tenants |
| Customer-managed keys | No | Yes. You configure Azure Key Vault, an encryption key, and a managed identity. | Bookshelf, Supercomputer, and Workspace resources |

Microsoft-managed keys are the right choice when you want encryption at rest with no extra setup. Customer-managed keys are useful when your organization requires direct control over the encryption key used to protect supported Microsoft Discovery resources.

## Access controls and key isolation

Encryption at rest works together with identity and access controls to protect stored data.

- Encryption keys aren't accessible to service operators, engineers, or support personnel.
- Access to encrypted data is governed by Microsoft Entra ID authentication, Azure role-based access control (Azure RBAC), and managed identities for service-to-service communication.
- The design follows least-privilege and separation-of-duties principles.

## Shared responsibility considerations

Encryption at rest helps protect stored data, but it doesn't mitigate every security risk. For example, encryption at rest doesn't protect against:

- Compromised credentials
- Misconfigured access controls
- Application-level vulnerabilities

Customers remain responsible for identity governance, access control, and protecting client-side data before it's ingested into Microsoft Discovery.

## Related content

- [Configure customer-managed keys (CMK) for Microsoft Discovery resources](howto-data-encryption-at-rest.md)
- [What is Microsoft Discovery?](overview-what-is-microsoft-discovery.md)
- [Azure Key Vault documentation](/azure/key-vault/general/overview)