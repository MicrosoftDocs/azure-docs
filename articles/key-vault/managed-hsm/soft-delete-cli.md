---
title: Managed HSM - How to use soft delete with CLI
description: Use case examples of soft-delete with CLI code snips
services: key-vault
author: msmbaldwin
manager: rkarlin

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 08/12/2019
ms.author: mbaldwin
---
# How to use Managed HSM soft-delete with CLI

Managed HSM's soft delete feature allows recovery of deleted HSM's. 

## Prerequisites

- Azure CLI - If you don't have this setup for your environment, see [Manage Key Vault using Azure CLI](key-vault-manage-with-cli2.md).

For Key Vault specific reference information for CLI, see [Azure CLI Key Vault reference](https://docs.microsoft.com/cli/azure/keyvault).

## Required permissions

Managed HSM operations are separately managed via role-based access control (RBAC) permissions as follows:

| Operation | Description | User permission |
|:--|:--|:--|
|List|Lists deleted key vaults.|Microsoft.KeyVault/deletedVaults/read|
|Recover|Restores a deleted key vault.|Microsoft.KeyVault/vaults/write|
|Purge|Permanently removes a deleted key vault and all its contents.|Microsoft.KeyVault/locations/deletedVaults/purge/action|

For more information on permissions and access control, see [Secure your HSM](secure-your-HSM.md).

## Enabling soft-delete

You enable "soft-delete" to allow recovery of a deleted HSM.

> [!IMPORTANT]
> Enabling 'soft delete' on an HSM is an irreversible action. Once the soft-delete property has been set to "true", it cannot be changed or removed.  

### Existing Managed HSM

For an existing HSM named ContosoHSM, enable soft-delete as follows. 

```azurecli
az resource update --id $(az keyvault --HSM show --name ContosoHSM -o tsv | awk '{print $1}') --set properties.enableSoftDelete=true
```

### New Managed HSM

Enabling soft-delete for a new HSM is done at creation time by adding the soft-delete enable flag to your create command.

```azurecli
az keyvault --HSM create --name ContosoHSM --resource-group ContosoRG --enable-soft-delete true --location westus
```

### Verify soft-delete enablement

To verify that a Managed HSM has soft-delete enabled, run the *show* command and look for the 'Soft Delete Enabled?' attribute:

```azurecli
az keyvault --HSM show --name ContosoHSM
```

## Deleting a soft-delete protected Managed HSM

The command to delete an HSM changes in behavior, depending on whether soft-delete is enabled.

> [!IMPORTANT]
>If you run the following command for a HSM that does not have soft-delete enabled, you will permanently delete this HSM and all its content with no options for recovery!

```azurecli
az keyvault --HSM delete --name ContosoHSM
```

### How soft-delete protects your HSM's

With soft-delete enabled:

- A deleted key vault is removed from its resource group and placed in a reserved namespace, associated with the location where it was created. 
- Deleted keys are inaccessible as long as their containing HSM is in the deleted state. 
- The DNS name for a deleted HSM is reserved, preventing a new HSM with same name from being created.  

You may view deleted state HSM's, associated with your subscription, using the following command:

```azurecli
az keyvault --HSM list-deleted
```
- *ID* can be used to identify the resource when recovering or purging. 
- *Resource ID* is the original resource ID of this vault. Since this key vault is now in a deleted state, no resource exists with that resource ID. 
- *Scheduled Purge Date* is when the HSM will be permanently deleted, if no action is taken. The default retention period, used to calculate the *Scheduled Purge Date*, is 90 days.

## Recovering an HSM

To recover an HSM, you specify the HSM name, resource group, and location. Note the location and the resource group of the deleted HSM, as you need them for the recovery process.

```azurecli
az keyvault --HSM recover --location westus --resource-group ContosoRG --name ContosoHSM
```

When an HSM is recovered, a new resource is created with the HSM's original resource ID. If the original resource group is removed, one must be created with same name before attempting recovery.

## Deleting and purging HSM keys

The following command will delete the 'ContosoFirstKey' key, in an HSM named 'ContosoHSM', which has soft-delete enabled:

```azurecli
az keyvault --HSM key delete --name ContosoFirstKey --vault-name ContosoHSM
```

With your HSM enabled for soft-delete, a deleted key still appears like it's deleted except, when you explicitly list or retrieve deleted keys. Most operations on a key in the deleted state will fail except for listing a deleted key, recovering it or purging it. 

For example, to request to list deleted keys in an HSM, use the following command:

```azurecli
az keyvault --HSM key list-deleted --vault-name ContosoHSM
```

### Transition state 

When you delete a key in an HSM with soft-delete enabled, it may take a few seconds for the transition to complete. During this transition, it may appear that the key isn't in the active state or the deleted state. 

### Using soft-delete with HSM keys

Just like HSM's, a deleted key remains in deleted state for up to 90 days, unless you recover it or purge it.

#### Keys

To recover a soft-deleted key:

```azurecli
az keyvault --HSM key recover --name ContosoFirstKey --vault-name ContosoHSM
```

To permanently delete (also known as purging) a soft-deleted key:

> [!IMPORTANT]
> Purging a key will permanently delete it, and it will not be recoverable! 

```azurecli
az keyvault --HSM key purge --name ContosoFirstKey --vault-name ContosoHSM
```

The **recover** and **purge** actions have their own permissions associated in a key vault access policy. For a user or service principal to be able to execute a **recover** or **purge** action, they must have the respective permission for that key or secret. By default, **purge** isn't added to a HSM's access policy, when the 'all' shortcut is used to grant all permissions. You must specifically grant **purge** permission. 

#### Set an HSM access policy

The following command grants user@contoso.com permission to use several operations on keys in *ContosoHSM* including **purge**:

```azurecli
az keyvault --HSM set-policy --name ContosoHSM --key-permissions get create delete list update import backup restore recover purge
```

>[!NOTE] 
> If you have an existing HSM that has just had soft-delete enabled, you may not have **recover** and **purge** permissions.


## Purging a soft-delete protected HSM

> [!IMPORTANT]
> Purging a key vault or its keys, will permanently delete it, meaning it will not be recoverable!

The purge function is used to permanently delete an HSM or it's keys, that was previously soft-deleted. Keys stored in an HSM with the soft-delete feature enabled, can go through multiple states:

- **Active**: before deletion.
- **Soft-Deleted**: after deletion, able to be listed and recovered back to active state.
- **Permanently-Deleted**: after purge, not able to be recovered.

The same is true for the HSM. In order to permanently delete a soft-deleted HSM and its keys, you must purge the HSM itself.

### Purging an HSM

When an HSM is purged, its entire contents are permanently deleted. To purge a soft-deleted HSM, use the `az keyvault --HSM purge` command. You can find the location of your subscription's deleted HSM's using the command `az keyvault --HSM list-deleted`.

```azurecli
az keyvault --HSM purge --location westus --name ContosoHSM
```

### Purge permissions required
- To purge a deleted HSM's, the user needs RBAC permission to the *Microsoft.KeyVault/locations/deletedHSMs/purge/action* operation. 
- To list a deleted HSM, the user needs RBAC permission to the *Microsoft.KeyVault/deletedHSMs/read* operation. 
- By default only a subscription administrator has these permissions. 

### Scheduled purge

Listing deleted HSM keys also shows when they're scheduled to be purged by Managed HSM. *Scheduled Purge Date* indicates when a key will be permanently deleted, if no action is taken. By default, the retention period for a deleted key vault object is 90 days.

>[!IMPORTANT]
>A purged key, triggered by its *Scheduled Purge Date* field, is permanently deleted. It is not recoverable!

## Enabling Purge Protection

When purge protection is turned on, an HSM or key in deleted state cannot be purged until the retention period of 90 days has passed. Such HSM or keys can still be recovered. This feature gives added assurance that an HSM or key can never be permanently deleted until the retention period has passed.

You can enable purge protection only if soft-delete is also enabled. 

To turn on both soft delete and purge protection when creating an HSM, use the [az keyvault --HSM create](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-create) command:

```
az keyvault --HSM create --name ContosoHSM --resource-group ContosoRG --location westus --enable-soft-delete true --enable-purge-protection true
```

To add purge protection to an existing HSM (that already has soft delete enabled), use the [az keyvault update](/cli/azure/keyvault?view=azure-cli-latest#az-keyvault-update) command:

```
az keyvault --HSM update --name ContosoVault --resource-group ContosoRG --enable-purge-protection true
```

## Other resources

- For an overview of Managed HSM's soft-delete feature, see [soft-delete overview](ovw-soft-delete.md).


