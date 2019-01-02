---
ms.assetid: 
title: Azure Key Vault - How to use soft delete with CLI
description: Use case examples of soft-delete with CLI code snips
author: bryanla
manager: mbaldwin
ms.service: key-vault
ms.topic: conceptual
ms.workload: identity
ms.date: 10/15/2018
ms.author: bryanla
---
# How to use Key Vault soft-delete with CLI

Azure Key Vault's soft delete feature allows recovery of deleted vaults and vault objects. Specifically, soft-delete addresses the following scenarios:

- Support for recoverable deletion of a key vault
- Support for recoverable deletion of key vault objects; keys, secrets, and, certificates

## Prerequisites

- Azure CLI - If you don't have this setup for your environment, see [Manage Key Vault using Azure CLI](key-vault-manage-with-cli2.md).

For Key Vault specific reference information for CLI, see [Azure CLI Key Vault reference](https://docs.microsoft.com/cli/azure/keyvault).

## Required permissions

Key Vault operations are separately managed via role-based access control (RBAC) permissions as follows:

| Operation | Description | User permission |
|:--|:--|:--|
|List|Lists deleted key vaults.|Microsoft.KeyVault/deletedVaults/read|
|Recover|Restores a deleted key vault.|Microsoft.KeyVault/vaults/write|
|Purge|Permanently removes a deleted key vault and all its contents.|Microsoft.KeyVault/locations/deletedVaults/purge/action|

For more information on permissions and access control, see [Secure your key vault](key-vault-secure-your-key-vault.md).

## Enabling soft-delete

You enable "soft-delete" to allow recovery of a deleted key vault, or objects stored in a key vault.

> [!IMPORTANT]
> Enabling 'soft delete' on a key vault is an irreversible action. Once the soft-delete property has been set to "true", it cannot be changed or removed.  

### Existing key vault

For an existing key vault named ContosoVault, enable soft-delete as follows. 

```azurecli
az resource update --id $(az keyvault show --name ContosoVault -o tsv | awk '{print $1}') --set properties.enableSoftDelete=true
```

### New key vault

Enabling soft-delete for a new key vault is done at creation time by adding the soft-delete enable flag to your create command.

```azurecli
az keyvault create --name ContosoVault --resource-group ContosoRG --enable-soft-delete true --location westus
```

### Verify soft-delete enablement

To verify that a key vault has soft-delete enabled, run the *show* command and look for the 'Soft Delete Enabled?' attribute:

```azurecli
az keyvault show --name ContosoVault
```

## Deleting a key vault protected by soft-delete

The command to delete a key vault changes in behavior, depending on whether soft-delete is enabled.

> [!IMPORTANT]
>If you run the following command for a key vault that does not have soft-delete enabled, you will permanently delete this key vault and all its content with no options for recovery!

```azurecli
az keyvault delete --name ContosoVault
```

### How soft-delete protects your key vaults

With soft-delete enabled:

- A deleted key vault is removed from its resource group and placed in a reserved namespace, associated with the location where it was created. 
- Deleted objects such as keys, secrets, and certificates, are inaccessible as long as their containing key vault is in the deleted state. 
- The DNS name for a deleted key vault is reserved, preventing a new key vault with same name from being created.  

You may view deleted state key vaults, associated with your subscription, using the following command:

```azurecli
az keyvault list-deleted
```
- *Id* can be used to identify the resource when recovering, or purging. 
- *Resource ID* is the original resource ID of this vault. Since this key vault is now in a deleted state, no resource exists with that resource ID. 
- *Scheduled Purge Date* is when the vault will be permanently deleted, if no action is taken. The default retention period, used to calculate the *Scheduled Purge Date*, is 90 days.

## Recovering a key vault

To recover a key vault, you specify the key vault name, resource group, and location. Note the location and the resource group of the deleted key vault, as you need them for the recovery process.

```azurecli
az keyvault recover --location westus --resource-group ContosoRG --name ContosoVault
```

When a key vault is recovered, a new resource is created with the key vault's original resource ID. If the original resource group is removed, one must be created with same name before attempting recovery.

## Key Vault objects and soft-delete

For a key, 'ContosoFirstKey', in a key vault named 'ContosoVault' with soft-delete enabled, here's how you would delete that key.

```azurecli
az keyvault key delete --name ContosoFirstKey --vault-name ContosoVault
```

With your key vault enabled for soft-delete, a deleted key still appears like it's deleted except, when you explicitly list or retrieve deleted keys. Most operations on a key in the deleted state will fail except for listing a deleted key, recovering it or purging it. 

For example, to request to list deleted keys in a key vault, use the following command:

```azurecli
az keyvault key list-deleted --vault-name ContosoVault
```

### Transition state 

When you delete a key in a key vault with soft-delete enabled, it may take a few seconds for the transition to complete. During this transition, it may appear that the key isn't in the active state or the deleted state. 

### Using soft-delete with key vault objects

Just like key vaults, a deleted key, secret, or certificate, remains in deleted state for up to 90 days, unless you recover it or purge it.

#### Keys

To recover a soft-deleted key:

```azurecli
az keyvault key recover --name ContosoFirstKey --vault-name ContosoVault
```

To permanently delete (also known as purging) a soft-deleted key:

> [!IMPORTANT]
> Purging a key will permanently delete it, and it will not be recoverable! 

```azurecli
az keyvault key purge --name ContosoFirstKey --vault-name ContosoVault
```

The **recover** and **purge** actions have their own permissions associated in a key vault access policy. For a user or service principal to be able to execute a **recover** or **purge** action, they must have the respective permission for that key or secret. By default, **purge** isn't added to a key vault's access policy, when the 'all' shortcut is used to grant all permissions. You must specifically grant **purge** permission. 

#### Set a key vault access policy

The following command grants user@contoso.com permission to use several operations on keys in *ContosoVault* including **purge**:

```azurecli
az keyvault set-policy --name ContosoVault --key-permissions get create delete list update import backup restore recover purge
```

>[!NOTE] 
> If you have an existing key vault that has just had soft-delete enabled, you may not have **recover** and **purge** permissions.

#### Secrets

Like keys, secrets are managed with their own commands:

- Delete a secret named SQLPassword: 
```azurecli
az keyvault secret delete --vault-name ContosoVault -name SQLPassword
```

- List all deleted secrets in a key vault: 
```azurecli
az keyvault secret list-deleted --vault-name ContosoVault
```

- Recover a secret in the deleted state: 
```azurecli
az keyvault secret recover --name SQLPassword --vault-name ContosoVault
```

- Purge a secret in deleted state: 

  > [!IMPORTANT]
  > Purging a secret will permanently delete it, and it will not be recoverable! 

  ```azurecli
  az keyvault secret purge --name SQLPAssword --vault-name ContosoVault
  ```

## Purging and key vaults

### Key vault objects

Purging a key, secret, or certificate, causes permanent deletion and it will not be recoverable. The key vault that contained the deleted object will however remain intact as will all other objects in the key vault. 

### Key vaults as containers
When a key vault is purged, its entire contents are permanently deleted, including keys, secrets, and certificates. To purge a key vault, use the `az keyvault purge` command. You can find the location your subscription's deleted key vaults using the command `az keyvault list-deleted`.

>[!IMPORTANT]
>Purging a key vault will permanently delete it, meaning it will not be recoverable!

```azurecli
az keyvault purge --location westus --name ContosoVault
```

### Purge permissions required
- To purge a deleted key vault, the user needs RBAC permission to the *Microsoft.KeyVault/locations/deletedVaults/purge/action* operation. 
- To list a deleted key vault, the user needs RBAC permission to the *Microsoft.KeyVault/deletedVaults/read* operation. 
- By default only a subscription administrator has these permissions. 

### Scheduled purge

Listing deleted key vault objects also shows when they're scheduled to be purged by Key Vault. *Scheduled Purge Date* indicates when a key vault object will be permanently deleted, if no action is taken. By default, the retention period for a deleted key vault object is 90 days.

>[!IMPORTANT]
>A purged vault object, triggered by its *Scheduled Purge Date* field, is permanently deleted. It is not recoverable!

## Other resources

- For an overview of Key Vault's soft-delete feature, see [Azure Key Vault soft-delete overview](key-vault-ovw-soft-delete.md).
- For a general overview of Azure Key Vault usage, see [Get started with Azure Key Vault](key-vault-get-started.md).

