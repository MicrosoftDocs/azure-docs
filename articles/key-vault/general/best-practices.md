---
title: Best practices for using Azure Key Vault  | Microsoft Docs
description: Learn about best practices for Azure Key Vault, including controlling access, when to use separate key vaults, backing up, logging, and recovery options.
services: key-vault
author: msmbaldwin
tags: azure-key-vault

ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
ms.date: 09/04/2022
ms.author: mbaldwin
# Customer intent: As a developer who's using Key Vault, I want to know the best practices so I can implement them.
---
# Best practices for using Azure Key Vault

Azure Key Vault safeguards encryption keys and secrets like certificates, connection strings, and passwords. This article helps you optimize your use of key vaults.

## Use separate key vaults

Our recommendation is to use a vault per application per environment (development, pre-production, and production), per region. Granular isolation helps you not share secrets across applications, environments and regions, and it also reduce the threat if there is a breach.

### Why we recommend separate key vaults

Key vaults define security boundaries for stored secrets. Grouping secrets into the same vault increases the *blast radius* of a security event because attacks might be able to access secrets across concerns. To mitigate access across concerns, consider what secrets a specific application *should* have access to, and then separate your key vaults based on this delineation. Separating key vaults by application is the most common boundary. Security boundaries, however, can be more granular for large applications, for example, per group of related services.

## Control access to your vault

Encryption keys and secrets like certificates, connection strings, and passwords are sensitive and business critical. You need to secure access to your key vaults by allowing only authorized applications and users. [Azure Key Vault security features](security-features.md) provides an overview of the Key Vault access model. It explains authentication and authorization. It also describes how to secure access to your key vaults.

Recommendations for controlling access to your vault are as follows:
- Lock down access to your subscription, resource group, and key vaults using role-based access control (RBAC).
  - Assign RBAC roles at Key Vault scope for applications, services, and workloads requiring persistent access to Key Vault
  - Assign just-in-time eligible RBAC roles for operators, administrators and other user accounts requiring privileged access to Key Vault using [Privileged Identity Management (PIM)](../../active-directory/privileged-identity-management/pim-configure.md) 
    - Require at least one approver
    - Enforce multi-factor authentication
- Restrict network access with [Private Link](private-link-service.md), [firewall and virtual networks](network-security.md)

## Turn on data protection for your vault

Turn on purge protection to guard against malicious or accidental deletion of the secrets and key vault even after soft-delete is turned on.

For more information, see [Azure Key Vault soft-delete overview](soft-delete-overview.md)

## Turn on logging

[Turn on logging](logging.md) for your vault. Also, [set up alerts](alert.md).

## Backup

Purge protection prevents malicious and accidental deletion of vault objects for up to 90 days. In scenarios, when purge protection is not a possible option, we recommend backup vault objects, which can't be recreated from other sources like encryption keys generated within the vault.

For more information about backup, see [Azure Key Vault backup and restore](backup.md)

## Multitenant solutions and Key Vault

A multitenant solution is built on an architecture where components are used to serve multiple customers or tenants. Multitenant solutions are often used to support software as a service (SaaS) solutions. If you're building a multitenant solution that includes Key Vault, review [Multitenancy and Azure Key Vault](/azure/architecture/guide/multitenant/service/key-vault).

## Frequently Asked Questions:
### Can I use Key Vault role-based access control (RBAC) permission model object-scope assignments to provide isolation for application teams within Key Vault?
No. RBAC permission model allows to assign access to individual objects in Key Vault to user or application, but only for read. Any administrative operations like network access control, monitoring, and objects management require vault level permissions. Having one Key Vault per application provides secure isolation for operators across application teams.

## Next steps

Learn more about key management best practices:
- [Best practices for secrets management in Key Vault](../secrets/secrets-best-practices.md)
- [Best practices for Azure Managed HSM](../managed-hsm/best-practices.md)


