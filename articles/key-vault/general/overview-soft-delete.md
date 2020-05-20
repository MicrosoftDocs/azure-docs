---
title: Azure Key Vault soft-delete | Microsoft Docs
description: Soft-delete in Azure Key Vault allows you to recover deleted key vaults and key vault objects, such as keys, secrets, and certificates.
ms.service: key-vault
ms.subservice: general
ms.topic: conceptual
author: msmbaldwin
ms.author: mbaldwin
manager: rkarlin
ms.date: 03/19/2019
---

# Azure Key Vault soft-delete overview

Key Vault's soft-delete feature allows recovery of the deleted vaults and vault objects, known as soft-delete. Specifically, we address the following scenarios:

- Support for recoverable deletion of a key vault
- Support for recoverable deletion of key vault objects (ex. keys, secrets, certificates)

## Supporting interfaces

The soft-delete feature is initially available through the [REST](/rest/api/keyvault/), [CLI](soft-delete-cli.md), [PowerShell](soft-delete-powershell.md), and [.NET/C#](/dotnet/api/microsoft.azure.keyvault?view=azure-dotnet) interfaces, as well as [ARM templates](https://docs.microsoft.com/azure/templates/microsoft.keyvault/2019-09-01/vaults).

## Scenarios

Azure Key Vaults are tracked resources, managed by Azure Resource Manager. Azure Resource Manager also specifies a well-defined behavior for deletion, which requires that a successful DELETE operation must result in that resource not being accessible anymore. The soft-delete feature addresses the recovery of the deleted object, whether the deletion was accidental or intentional.

1. In the typical scenario, a user may have inadvertently deleted a key vault or a key vault object; if that key vault or key vault object were to be recoverable for a predetermined period, the user may undo the deletion and recover their data.

2. In a different scenario, a rogue user may attempt to delete a key vault or a key vault object, such as a key inside a vault, to cause a business disruption. Separating the deletion of the key vault or key vault object from the actual deletion of the underlying data can be used as a safety measure by, for instance, restricting permissions on data deletion to a different, trusted role. This approach effectively requires quorum for an operation which might otherwise result in an immediate data loss.

### Soft-delete behavior

When soft-delete is enabled, resources marked as deleted resources are retained for a specified period (90 days by default). The service further provides a mechanism for recovering the deleted object, essentially undoing the deletion.

When creating a new key vault, soft-delete is on by default. You can create a key vault without soft-delete through the [Azure CLI](soft-delete-cli.md) or [Azure PowerShell](soft-delete-powershell.md). Once soft-delete is enabled on a key vault it cannot be disabled

The default retention period is 90 days but, during key vault creation, it is possible to set the retention policy interval to a value from 7 to 90 days through the Azure portal. The purge protection retention policy uses the same interval. Once set, the retention policy interval cannot be changed.

You cannot reuse the name of a key vault that has been soft-deleted until the retention period has passed.

### Purge protection 

Purge protection is an optional Key Vault behavior and is **not enabled by default**. Purge protection can only be enabled once soft-delete is enabled.  It can be turned on via [CLI](soft-delete-cli.md#enabling-purge-protection) or [PowerShell](soft-delete-powershell.md#enabling-purge-protection).

When purge protection is on, a vault or an object in the deleted state cannot be purged until the retention period has passed. Soft-deleted vaults and objects can still be recovered, ensuring that the retention policy will be followed. 

The default retention period is 90 days, but it is possible to set the retention policy interval to a value from 7 to 90 days through the Azure portal. Once the retention policy interval is set and saved it cannot be changed for that vault. 

### Permitted purge

Permanently deleting, purging, a key vault is possible via a POST operation on the proxy resource and requires special privileges. Generally, only the subscription owner will be able to purge a key vault. The POST operation triggers the immediate and irrecoverable deletion of that vault. 

Exceptions are:
- When the Azure subscription has been marked as *undeletable*. In this case, only the service may then perform the actual deletion, and does so as a scheduled process. 
- When the `--enable-purge-protection flag` is enabled on the vault itself. In this case, Key Vault will wait for 90 days from when the original secret object was marked for deletion to permanently delete the object.

### Key vault recovery

Upon deleting a key vault, the service creates a proxy resource under the subscription, adding sufficient metadata for recovery. The proxy resource is a stored object, available in the same location as the deleted key vault. 

### Key vault object recovery

Upon deleting a key vault object, such as a key, the service will place the object in a deleted state, making it inaccessible to any retrieval operations. While in this state, the key vault object can only be listed, recovered, or forcefully/permanently deleted. 

At the same time, Key Vault will schedule the deletion of the underlying data corresponding to the deleted key vault or key vault object for execution after a predetermined retention interval. The DNS record corresponding to the vault is also retained for the duration of the retention interval.

### Soft-delete retention period

Soft-deleted resources are retained for a set period of time, 90 days. During the soft-delete retention interval, the following apply:

- You may list all of the key vaults and key vault objects in the soft-delete state for your subscription as well as access deletion and recovery information about them.
    - Only users with special permissions can list deleted vaults. We recommend that our users create a custom role with these special permissions for handling deleted vaults.
- A key vault with the same name cannot be created in the same location; correspondingly, a key vault object cannot be created in a given vault if that key vault contains an object with the same name and which is in a deleted state 
- Only a specifically privileged user may restore a key vault or key vault object by issuing a recover command on the corresponding proxy resource.
    - The user, member of the custom role, who has the privilege to create a key vault under the resource group can restore the vault.
- Only a specifically privileged user may forcibly delete a key vault or key vault object by issuing a delete command on the corresponding proxy resource.

Unless a key vault or key vault object is recovered, at the end of the retention interval the service performs a purge of the soft-deleted key vault or key vault object and its content. Resource deletion may not be rescheduled.

### Billing implications

In general, when an object (a key vault or a key or a secret) is in deleted state, there are only two operations possible: 'purge' and 'recover'. All the other operations will fail. Therefore, even though the object exists, no operations can be performed and hence no usage will occur, so no bill. However there are following exceptions:

- 'purge' and 'recover' actions will count towards normal key vault operations and will be billed.
- If the object is an HSM-key, the 'HSM Protected key' charge per key version per month charge will apply if a key version has been used in last 30 days. After that, since the object is in deleted state no operations can be performed against it, so no charge will apply.

## Next steps

The following two guides offer the primary usage scenarios for using soft-delete.

- [How to use Key Vault soft-delete with PowerShell](soft-delete-powershell.md) 
- [How to use Key Vault soft-delete with CLI](soft-delete-cli.md)

