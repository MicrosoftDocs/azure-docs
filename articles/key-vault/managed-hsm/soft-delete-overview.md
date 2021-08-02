---
title: Azure Key Vault Managed HSM soft-delete | Microsoft Docs
description: Soft-delete in Managed HSM allows you to recover deleted HSM instances and keys.
ms.service: key-vault
ms.subservice: managed-hsm
ms.topic: conceptual
author: mbaldwin
ms.author: mbaldwin
ms.date: 06/01/2021
---

# Managed HSM soft-delete overview

> [!IMPORTANT]
> Soft-delete is on by default for Managed HSM resources. It cannot be turned off.

> [!IMPORTANT]
> Soft-deleted Managed HSM resources will continue to be billed at their full hourly rate until they are purged.

Managed HSM's soft-delete feature allows recovery of the deleted HSMs and keys. Specifically, this safeguard offer the following protections:

- Once an HSM or a key is deleted, it remains recoverable for a configurable period of 7 to 90 calendar days. Retention period can be set during HSM creation. If no value is specified, the default retention period will be set to 90 days. This provides users with sufficient time to notice an accidental key or HSM deletion and respond.
- Two operations must be performed to permanently delete a key. First a user must delete the key, which puts it into the soft-deleted state. Second, a user must purge the key in the soft-deleted state. The purge operation requires user to have a "Managed HSM Crypto Officer" role assigned. These extra protections reduce the risk of a user accidentally or maliciously deleting a key or an HSM.


## Soft-delete behavior

For Managed-HSM soft-delete is on by default. You cannot create a Managed HSM resource with soft-delete disabled.

With soft-delete is enabled, resources marked as deleted are retained for a specified period (90 days by default). The service further provides a mechanism for recovering the deleted HSMs or keys, allowing to undo the deletion.

The default retention period is 90 days, however, during HSM resource creation, it is possible to set the retention policy interval to a value from 7 to 90 days. The purge protection retention policy uses the same interval. Once set, the retention policy interval cannot be changed.

You cannot reuse the name of an HSM resource that has been soft-deleted until the retention period has passed and the HSM resource is purged.

## Purge protection

Purge protection is an optional behavior and is **not enabled by default**. It can be turned on via [CLI](./recovery.md?tabs=azure-cli) or [PowerShell](./recovery.md?tabs=azure-powershell).

When purge protection is on, an HSM or a key in the deleted state cannot be purged until the retention period has passed. Soft-deleted HSMs and keys can still be recovered, ensuring that the retention policy will be followed.

The default retention period is 90 days, but it is possible to set the retention policy interval to a value from 7 to 90 days at the time of creating an HSM. Retention policy interval can only be set at the time of creating an HSM. It cannot be changed later.

See [How to use Managed HSM soft-delete with CLI](./recovery.md?tabs=azure-cli#managed-hsm-cli) or [How to use Managed HSM soft-delete with PowerShell](./recovery.md?tabs=azure-powershell#managed-hsm-powershell).

## Managed HSM recovery

Upon deleting an HSM, the service creates a proxy resource under the subscription, adding sufficient metadata for recovery. The proxy resource is a stored object, available in the same location as the deleted HSM. 

## Key recovery

Upon deleting a key, the service will place the it in a deleted state, making it inaccessible to any  operations. While in this state, the keys can be listed, recovered, or purged (permanently deleted). To view the objects, use the Azure CLI `az keyvault key list-deleted` command (as documented in [Managed HSM soft-delete and purge protection with CLI](./recovery.md?tabs=azure-cli#keys-cli)), or the Azure PowerShell `-InRemovedState` parameter (as described in [Managed HSM soft-delete and purge protection with PowerShell](./recovery.md?tabs=azure-powershell#keys-powershell)).  

At the same time, Managed HSM will schedule the deletion of the underlying data corresponding to the deleted HSM or key for execution after a predetermined retention interval. The DNS record corresponding to the HSM is also retained during the retention interval.

## Soft-delete retention period

Soft-deleted resources are retained for a set period of time, 90 days. During the soft-delete retention interval, the following apply:

- You may list all the HSMs and keys in the soft-delete state for your subscription as well as access deletion and recovery information about them.
  - Only users with Managed HSM Contributor role can list deleted HSMs. We recommend that our users create a custom role with these special permissions for handling deleted vaults.
- A managed HSM with the same name cannot be created in the same location; correspondingly, a key cannot be created in a given HSM if it contains a key with the same name in a deleted state.
- Only users with "Managed HSM Contributor" role can list, view, recover, and purge managed HSMs.
- Only users with "Managed HSM Crypto Officer" role can list, view, recover, and purge keys.
  
Unless a Managed HSM or key is recovered, at the end of the retention interval the service performs a purge of the soft-deleted HSM or key. Resource deletion may not be rescheduled.

### Billing implications

Managed HSM is a single-tenant service. When you create a Managed HSM, the service reserves underlying resources allocated to your HSM. These resources remain allocated even when the HSM is in deleted state. Therefore, you will be billed for the HSM while it is in deleted state.

## Next steps

The following two guides offer the primary usage scenarios for using soft-delete.

- [How to use Managed HSM soft-delete with PowerShell](./recovery.md?tabs=azure-powershell) 
- [How to use Managed HSM soft-delete with CLI](./recovery.md?tabs=azure-cli)
