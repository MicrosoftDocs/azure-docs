---
title: Turn off Key-based access on cache accounts.
description: Learn how to turn off Key-based access on cache accounts.
services: site-recovery
author: swapnilbel
ms.service: azure-site-recovery
ms.topic: concept-article
ms.date: 10/09/2025
ms.author: swbela

# Customer intent: Turn off key-based authentication on cache account used by Azure Site Recovery.
---

# Turn off key based access on cache account
Previously, key-based access was required for cache storage accounts used by Azure Site Recovery. Azure Site Recovery now supports cache accounts with key-based authentication disabled. This article explains how to turn off key-based access without disrupting replication.

## Prerequisites
Before proceeding, ensure the following:
* [Enable Managed Identity on the Recovery Services Vault](/azure/site-recovery/azure-to-azure-how-to-enable-replication-private-endpoints#enable-the-managed-identity-for-the-vault)

* [Grant access to Recovery services vault managed identity to read-write to cache account](/azure/site-recovery/azure-to-azure-how-to-enable-replication-private-endpoints#grant-required-permissions-to-the-vault)

## Turn off key-based access on storage accounts
For higher security of Azure storage, we recommend you to turn off of key-based authentication.

### Scenario 1 
If the Recovery Services Vault already has a managed identity enabled, follow the steps in the [Related Content](#related-content).

### Scenario 2
If the vault lacked a managed identity when virtual machines were initially protected, you can add it afterward. Once prerequisites are met, you can safely disable key-based access on the cache account.


> [!NOTE]  
> Replication continues without interruption if prerequisites are completed before disabling key-based access. Don't disable and re-enable protection for existing VMs or servers after completing prerequisites.

## Related content
- [Disable shared key authorization on cache accounts](/azure/storage/common/shared-key-authorization-prevent?tabs=portal#disable-shared-key-authorization)
