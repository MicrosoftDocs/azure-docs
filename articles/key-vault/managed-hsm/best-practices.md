---
title: Best practices for using Azure Key Vault Managed HSM
description: Learn some of the best practices to use in Azure Key Vault Managed HSM.
services: key-vault
author: mbaldwin
tags: azure-key-vault

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: concept-article
ms.date: 01/04/2023
ms.author: mbaldwin

# Customer intent: As a developer using Managed HSM, I want to know best practices so that I can implement them.
---
# Best practices for using Azure Key Vault Managed HSM

This article provides best practices for securing your Azure Key Vault Managed HSM key management system. For a full list of security recommendations, see the [Azure Managed HSM security baseline](/security/benchmark/azure/baselines/key-vault-managed-hsm-security-baseline).

## Control access to your managed HSM

Managed HSM is a cloud service that safeguards encryption keys. Because these keys are sensitive and business critical, make sure that you secure access to your managed HSMs by allowing only authorized applications and users. This [article](access-control.md) provides an overview of the access model. It explains authentication, authorization, and role-based access control.

- Create an [Azure Active Directory security group](../../active-directory/fundamentals/active-directory-manage-groups.md) for the HSM Administrators (instead of assigning the Administrator role to individuals) to prevent "administration lockout" if an individual account is deleted.
- Lock down access to your management groups, subscriptions, resource groups, and managed HSMs. Use Azure RBAC to control access to your management groups, subscriptions, and resource groups.
- Create per-key role assignments by using [Managed HSM local RBAC](access-control.md#the-data-plane-and-managed-hsm-local-rbac).
- To maintain separation of duties, avoid assigning multiple roles to the same principals.
- Use the least-privilege access principal to assign roles.
- Create a custom role definition by using a precise set of permissions.

## Backup

- Make sure that you make regular backups of your managed HSM. You can make backups at the HSM level and for specific keys.

## Turn on logging

- [Turn on logging](logging.md) for your HSM. Also, set up alerts.

## Turn on recovery options

- [Soft-delete](soft-delete-overview.md) is on by default. You can choose a retention period of between 7 and 90 days.
- Turn on purge protection to prevent immediate permanent deletion of HSM or keys. When purge protection is on, the managed HSM or keys remain in a deleted state until the retention period has ended.

## Next steps

- [Azure Managed HSM security baseline](/security/benchmark/azure/baselines/key-vault-managed-hsm-security-baseline)
- [Full backup/restore](backup-restore.md)
- [Managed HSM logging](logging.md)
- [Manage managed HSM keys](key-management.md)
- [Managed HSM role management](role-management.md)
- [Managed HSM soft-delete overview](soft-delete-overview.md)
