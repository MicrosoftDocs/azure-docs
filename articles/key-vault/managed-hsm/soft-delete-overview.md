---
title: Managed HSM soft delete | Microsoft Docs
ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
author: msmbaldwin
ms.author: mbaldwin
manager: rkarlin
ms.date: 03/19/2019
---

# Managed HSM soft-delete overview

Managed HSM's soft delete feature allows recovery of deleted HSMs and keys. Specifically, we address the following scenarios:

- Support for recoverable deletion of a Managed HSM
- Support for recoverable deletion of keys

## Supporting interfaces

The soft-delete feature is initially available through the [REST](/rest/api/managedhsm/), [CLI](soft-delete-cli.md), [PowerShell](soft-delete-powershell.md) and [.NET/C#](/dotnet/api/microsoft.azure.managedhsm?view=azure-dotnet) interfaces.

## Scenarios

Managed HSM's are tracked resources, managed by Azure Resource Manager. Azure Resource Manager also specifies a well-defined behavior for deletion, which requires that a successful DELETE operation must result in that resource not being accessible anymore. The soft-delete feature addresses the recovery of the deleted object, whether the deletion was accidental or intentional.

1. In the typical scenario, a user may have inadvertently deleted an HSM or object in the HSM; if they were to be recoverable for a predetermined period, the user may undo the deletion and recover their data.

2. In a different scenario, a rogue user may attempt to delete a Managed HSM or a key, to cause a business disruption. Separating the deletion of the Managed HSM or key from the actual deletion of the underlying data can be used as a safety measure by, for instance, restricting permissions on data deletion to a different, trusted role. This approach effectively requires quorum for an operation which might otherwise result in an immediate data loss.

### Soft-delete behavior

When soft-delete is enabled, resources marked as deleted resources are retained for a specified period (90 days by default). The service further provides a mechanism for recovering the deleted object, essentially undoing the deletion.

When creating a new Managed HSM, soft-delete is on by default. You can create a Managed HSM without soft-delete through the [Azure CLI](soft-delete-cli.md) or [Azure Powershell](soft-delete-powershell.md). Once soft-delete is enabled, it cannot be disabled.

The default retention period is 90 days but, during key vault creation, it is possible to set the retention policy interval to a value from 7 to 90 days through the Azure portal. The purge protection retention policy uses the same interval. Once set, the retention policy interval cannot be changed.

You cannot reuse the name of a Managed HSM that has been soft-deleted until the retention period has passed.

### Purge protection 

Purge protection is an optional Managed HSM behavior and is **not enabled by default**. It can be turned on via [CLI](soft-delete-cli.md#enabling-purge-protection) or [Powershell](key-vault-soft-delete-powershell.md#enabling-purge-protection).

When purge protection is on, an HSM or an object in the deleted state cannot be purged until the retention period has passed. Soft-deleted HSMs and objects can still be recovered, ensuring that the retention policy will be followed. 

The default retention period is 90 days, but it is possible to set the retention policy interval to a value from 7 to 90 days through the Azure portal. Once the retention policy interval is set and saved it cannot be changed for that vault. 

### Permitted purge

Permanently deleting, or purging, a Managed HSM is possible via a POST operation on the proxy resource and requires special privileges. Generally, only the subscription owner will be able to purge. The POST operation triggers the immediate and irrecoverable deletion of that Managed HSM. 

Exceptions are:
- When the Azure subscription has been marked as *undeletable*. In this case, only the service may then perform the actual deletion, and does so as a scheduled process. 
- When the --enable-purge-protection flag is enabled on the vault itself. In this case, Key Vault will wait for 90 days from when the original secret object was marked for deletion to permanently delete the object.

### Managed HSM recovery

Upon deleting a Managed HSM, the service creates a proxy resource under the subscription, adding sufficient metadata for recovery. The proxy resource is a stored object, available in the same location as the deleted Managed HSM. 

### Managed HSM object recovery

Upon deleting an HSM object, such as a key, the service will place the object in a deleted state, making it inaccessible to any retrieval operations. While in this state, the object can only be listed, recovered, or forcefully/permanently deleted. 

At the same time, Managed HSM will schedule the deletion of the underlying data corresponding to the deleted Managed HSM or object for execution after a predetermined retention interval. The DNS record corresponding to the HSM is also retained for the duration of the retention interval.

### Soft-delete retention period

Soft deleted resources are retained for a set period of time, 90 days. During the soft-delete retention interval, the following apply:

- You may list all of the Managed HSMs and objects in the soft-delete state for your subscription as well as access deletion and recovery information about them.
    - Only users with special permissions can list deleted HSMs. We recommend that our users create a custom role with these special permissions for handling deleted vaults.
- A Managed HSM with the same name cannot be created in the same location; correspondingly, a Managed HSM object cannot be created in a given HSM if that HSM contains an object with the same name and which is in a deleted state. 
- Only a specifically privileged user may restore a Managed HSM or object by issuing a recover command on the corresponding proxy resource.
    - The user, member of the custom role, who has the privilege to create a Managed HSM under the resource group can restore the HSM.
- Only a specifically privileged user may forcibly delete a Managed HSM or object by issuing a delete command on the corresponding proxy resource.

Unless a Managed HSM or object is recovered, at the end of the retention interval the service performs a purge of the soft-deleted Managed HSM or object and its content. Resource deletion may not be rescheduled.


## Next steps

The following two guides offer the primary usage scenarios for using soft-delete.

- [How to use Managed HSM soft-delete with PowerShell](soft-delete-powershell.md) 
- [How to use Managed HSM soft-delete with CLI](soft-delete-cli.md)

