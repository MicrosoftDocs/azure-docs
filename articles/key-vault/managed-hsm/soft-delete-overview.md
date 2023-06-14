---
title: Azure Key Vault Managed HSM soft-delete | Microsoft Docs
description: Soft-delete in Managed HSM allows you to recover deleted HSM instances and keys. This article provides an overview of the feature. 
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: conceptual
author: mbaldwin
ms.author: mbaldwin
ms.date: 11/14/2022
---

# Managed HSM soft-delete overview

> [!IMPORTANT]
> Soft-delete can't be turned off for Managed HSM resources.

> [!IMPORTANT]
> Soft-deleted Managed HSM resources will continue to be billed at their full hourly rate until they're purged.

The Managed HSM soft-delete feature allows recovery of deleted HSMs and keys. Specifically, this feature provides the following safeguards:

- After an HSM or key is deleted, it remains recoverable for a configurable period of 7 to 90 calendar days. You can set the retention period when you create an HSM. If you don't specify a value, the default retention period of 90 days will be used. This period gives users enough time to notice an accidental key or HSM deletion and respond.
- To permanently delete a key, users need to take two actions. First, they must delete the key, which puts it into the soft-deleted state. Second, they must purge the key in the soft-deleted state. The purge operation requires the Managed HSM Crypto Officer role. These extra safeguards reduce the risk of a user accidentally or maliciously deleting a key or an HSM.


## Soft-delete behavior

Soft-delete can't be turned off for Managed HSM resources.

Resources marked as deleted are kept for a specified period. There's also a mechanism for recovering deleted HSMs or keys, so you can undo deletions.

The default retention period is 90 days. When you create an HSM resource, you can set the retention policy interval to a value from 7 to 90 days. The purge protection retention policy uses the same interval. After you set the retention policy, you can't change it.

You can't reuse the name of an HSM resource that's been soft-deleted until the retention period ends and the HSM resource is purged (permanently deleted).

## Purge protection

Purge protection is an optional behavior. It's not enabled by default. You can turn it on by using the [Azure CLI](./recovery.md?tabs=azure-cli) or [PowerShell](./recovery.md?tabs=azure-powershell).

When purge protection is on, an HSM or key in the deleted state can't be purged until the retention period ends. Soft-deleted HSMs and keys can still be recovered, which ensures the retention policy will be in effect.

The default retention period is 90 days. You can set the retention policy interval to a value from 7 to 90 days when you create an HSM. The retention policy interval can be set only when you create an HSM. It can't be changed later.

See [How to use Managed HSM soft-delete with CLI](./recovery.md?tabs=azure-cli#managed-hsms-cli) or [How to use Managed HSM soft-delete with PowerShell](./recovery.md?tabs=azure-powershell#managed-hsms-powershell).

## Managed HSM recovery

When you delete an HSM, the service creates a proxy resource in the subscription, adding enough metadata to enable recovery. The proxy resource is a stored object. It's available in the same location as the deleted HSM. 

## Key recovery

When you delete a key, the service will put it in a deleted state, making it inaccessible to any  operations. While in this state, keys can be listed, recovered, or purged. To view the objects, use the Azure CLI `az keyvault key list-deleted` command (described in [Managed HSM soft-delete and purge protection with CLI](./recovery.md?tabs=azure-cli#keys-cli)) or the Azure PowerShell `-InRemovedState` parameter (described in [Managed HSM soft-delete and purge protection with PowerShell](./recovery.md?tabs=azure-powershell#keys-powershell)).  

When you delete the key, Managed HSM will schedule the deletion of the underlying data that corresponds to the deleted HSM or key to occur after a predetermined retention interval. The DNS record that corresponds to the HSM is also kept during the retention interval.

## Soft-delete retention period

Soft-deleted resources are kept for a set period of time: 90 days. During the soft-delete retention interval, these conditions apply:

- You can list all the HSMs and keys in the soft-delete state for your subscription. You can also access deletion and recovery information about them.
- Only users with the Managed HSM Contributor role can list deleted HSMs. We recommend that you create a custom role with these permissions for handling deleted vaults.
- Managed HSM names must be unique in a given location. When you create a key, you can't use a name if the HSM contains a key with that name in a deleted state.
- Only users with the Managed HSM Contributor role can list, view, recover, and purge managed HSMs.
- Only users with Managed HSM Crypto Officer role can list, view, recover, and purge keys.
  
Unless a managed HSM or key is recovered, at the end of the retention interval, the service performs a purge of the soft-deleted HSM or key. You can't reschedule the deletion of resources.

### Billing implications

Managed HSM is a single-tenant service. When you create a managed HSM, the service reserves underlying resources allocated to your HSM. These resources remain allocated even when the HSM is in a deleted state. You'll be billed for the HSM while it's in a deleted state.

## Next steps

These articles describe the main scenarios for using soft-delete:

- [How to use Managed HSM soft-delete with PowerShell](./recovery.md?tabs=azure-powershell) 
- [How to use Managed HSM soft-delete with the Azure CLI](./recovery.md?tabs=azure-cli)
