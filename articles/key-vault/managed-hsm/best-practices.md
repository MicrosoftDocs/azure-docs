---
title: Best practices for securing Azure Key Vault Managed HSM
description: Learn some of the best practices to use to secure your instance of Azure Key Vault Managed HSM.
services: key-vault
author: msmbaldwin
tags: azure-key-vault

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: concept-article
ms.date: 01/04/2023
ms.author: mbaldwin

# Customer intent: As a developer using Managed HSM, I want to know best practices for securing my managed HSM, so that I can implement them.
---
# Best practices for securing Managed HSM

This article provides best practices for securing your Azure Key Vault Managed HSM key management system. For a full list of security recommendations, see the [Azure Managed HSM security baseline](/security/benchmark/azure/baselines/key-vault-managed-hsm-security-baseline).

## Control access to your managed HSM

Managed HSM is a cloud service that safeguards cryptographic keys. Because these keys are sensitive and critical to your business, make sure that you secure your managed HSMs by allowing access only by  authorized applications and users. [Managed HSM access control](access-control.md) provides an overview of the access model. It explains authentication, authorization, and role-based access control (RBAC).

To control access to your managed HSM:

- Create an [Azure Active Directory security group](../../active-directory/fundamentals/active-directory-manage-groups.md) for the HSM Administrators (instead of assigning the Administrator role to individuals) to prevent "administration lockout" if an individual account is deleted.
- Lock down access to your management groups, subscriptions, resource groups, and managed HSMs. Use Azure role-based access control (Azure RBAC) to control access to your management groups, subscriptions, and resource groups.
- Create per-key role assignments by using [Managed HSM local RBAC](access-control.md#data-plane-and-managed-hsm-local-rbac).
- To maintain separation of duties, avoid assigning multiple roles to the same principals.
- Use the least-privilege access principle to assign roles.
- Create a custom role definition by using a precise set of permissions.

## Create backups

- Be sure that you create regular backups of your managed HSM.

   You can create backups at the HSM level and for specific keys.

## Turn on logging

- [Turn on logging](logging.md) for your HSM.

   You also can set up alerts.

## Turn on recovery options

- [Soft-delete](soft-delete-overview.md) is on by default. You can choose a retention period of between 7 and 90 days.
- Turn on purge protection to prevent immediate permanent deletion of the HSM or keys.

  When purge protection is on, the managed HSM or keys remain in a deleted state until the retention period has ended.

## Next steps

- [Managed HSM security baseline](/security/benchmark/azure/baselines/key-vault-managed-hsm-security-baseline)
- [Full backup and restore](backup-restore.md)
- [Managed HSM logging](logging.md)
- [Manage your Managed HSM keys](key-management.md)
- [Managed HSM role management](role-management.md)
- [Managed HSM soft-delete overview](soft-delete-overview.md)
