---
title: Best practices using Azure Key Vault Managed HSM
description: This document explains some of the best practices to use Key Vault
services: key-vault
author: mbaldwin
tags: azure-key-vault

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: conceptual
ms.date: 01/04/2023
ms.author: mbaldwin
# Customer intent: As a developer using Managed HSM I want to know the best practices so I can implement them.
---
# Best practices when using Managed HSM

This article provides best practices for securing your Azure Managed HSM key management system.  For a full list of security recommendations, see the [Azure Managed HSM security baseline](/security/benchmark/azure/baselines/key-vault-managed-hsm-security-baseline).

## Control Access to your managed HSM

Managed HSM is a cloud service that safeguards encryption keys. As these keys are sensitive and business critical, make sure to secure access to your managed HSMs by allowing only authorized applications and users. This [article](access-control.md) provides an overview of the access model. It explains authentication and authorization, and role-based access control.
- Create an [Azure Active Directory Security Group](../../active-directory/fundamentals/active-directory-manage-groups.md) for the HSM Administrators (instead of assigning Administrator role to individuals), to prevent "administration lock-out" if there was individual account deletion.
- Lock down access to your management groups, subscriptions, resource groups and Managed HSMs - Use Azure RBAC to control access to your management groups, subscriptions, and resource groups
- Create per key role assignments using [Managed HSM local RBAC](access-control.md#data-plane-and-managed-hsm-local-rbac).
- To maintain separation of duties, avoid assigning multiple roles to same principals.
- Use least privilege access principal to assign roles.
- Create custom role definition with precise set of permissions.

## Backup

- Make sure you take regular backups of your HSM. Backups can be done at the HSM level and for specific keys.

## Turn on logging

- [Turn on logging](logging.md) for your HSM. Also set up alerts.

## Turn on recovery options

- [Soft Delete](soft-delete-overview.md) is on by default. You can choose a retention period between 7 and 90 days.
- Turn on purge protection to prevent immediate permanent deletion of HSM or keys. When purge protection is on HSM or keys will remain in deleted state until the retention days have passed.

## Next steps

- [Azure Managed HSM security baseline](/security/benchmark/azure/baselines/key-vault-managed-hsm-security-baseline)
- [Full backup/restore](backup-restore.md)
- [Managed HSM logging](logging.md)
- [Manage managed HSM keys](key-management.md)
- [Managed HSM role management](role-management.md)
- [Managed HSM soft-delete overview](soft-delete-overview.md)
