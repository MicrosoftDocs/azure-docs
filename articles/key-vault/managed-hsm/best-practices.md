---
title: Best Practices to use Key Vault - Azure Key Vault | Microsoft Docs
description: This document explains some of the best practices to use Key Vault
services: key-vault
author: amitbapat
manager: msmbaldwin
tags: azure-key-vault

ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: conceptual
ms.date: 09/17/2020
ms.author: ambapat
# Customer intent: As a developer using Key Vault I want to know the best practices so I can implement them.
---
# Best practices using Managed HSM

## Control Access to your Managed HSM

Managed HSM is a cloud service that safeguards encryption keys. As these keys are sensitive and business critical, make sure to secure access to your HSM pools by allowing only authorized applications and users. This [article](accerss-control.md) provides an overview of the access model. It explains authentication and authorization, and role-based access control.
- Create an [Azure Active Directory Security Group](../../active-directory/fundamentals/active-directory-manage-groups.md) for the HSM Administrators (instead of assigning Administrator role to individuals). This will prevent "administration lock-out" in case of individual account deletion.
- Lock down access to your management groups, subscriptions, resource groups and Managed HSMs - Use Azure RBAC to control access to your management groups, subscriptions, and resource groups
- Create per key role assignments using [Managed HSM local RBAC](access-control.md##Data-plane%20and%20Managed%20HSM%20local%20RBAC)
- Use least privilege access principal to assign roles

## Choose regions that support availability zones
- To ensure best high-availability and zone-resiliency, choose Azure regions where [Availability Zones](../../../azure/availability-zones/az-overview) are supported. These regions appear as "Recommended regions" in the Azure portal.

## Backup

- Make sure you take regular backups of your HSM. Backups can be done at the HSM level and for specific keys.

## Turn on Logging

- [Turn on logging](logging.md) for your HSM. Also set up alerts.

## Turn on recovery options

- [Soft Delete](../general/soft-delete-overview.md) is on by default.
- Turn on purge protection if you want to guard against force deletion of the HSM even after soft delete is turned on.
