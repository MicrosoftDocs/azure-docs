---
ms.assetid: 
title: Azure Key Vault - How to use soft-delete with PowerShell
description: Use case examples of soft-delete with PowerShell code snips
services: key-vault
author: bryanla
manager: mbaldwin
ms.service: key-vault
ms.topic: conceptual
ms.workload: identity
ms.date: 10/16/2018
ms.author: bryanla
---
# How to use Key Vault soft-delete with PowerShell

Azure Key Vault's soft delete feature allows recovery of deleted vaults and vault objects. Specifically, soft-delete addresses the following scenarios:

- Support for recoverable deletion of a key vault
- Support for recoverable deletion of key vault objects; keys, secrets, and, certificates

## Prerequisites

- Azure PowerShell 4.0.0 or later - If you don't have this already setup, install Azure PowerShell and associate it with your Azure subscription, see [How to install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview). 

>[!NOTE]
> There is an outdated version of our Key Vault PowerShell output formatting file that **may** be loaded into your environment instead of the correct version. We are anticipating an updated version of PowerShell to contain the needed correction for the output formatting and will update this topic at that time. 
The current workaround, should you encounter this formatting problem, is:
> - Use the following query if you notice you're not seeing the soft-delete enabled property described in this topic: `$vault = Get-AzureRmKeyVault -VaultName myvault; $vault.EnableSoftDelete`.


For Key Vault specific refernece information for PowerShell, see [Azure Key Vault PowerShell reference](https://docs.microsoft.com/powershell/module/azurerm.keyvault/?view=azurermps-4.2.0).

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

```powershell
($resource = Get-AzureRmResource -ResourceId (Get-AzureRmKeyVault -VaultName "ContosoVault").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enableSoftDelete" -Value "true"

Set-AzureRmResource -resourceid $resource.ResourceId -Properties $resource.Properties
```

### New key vault

Enabling soft-delete for a new key vault is done at creation time by adding the soft-delete enable flag to your create command.

```powershell
New-AzureRmKeyVault -Name "ContosoVault" -ResourceGroupName "ContosoRG" -Location "westus" -EnableSoftDelete
```

### Verify soft-delete enablement

To verify that a key vault has soft-delete enabled, run the *show* command and look for the 'Soft Delete Enabled?' attribute:

```powershell
Get-AzureRmKeyVault -VaultName "ContosoVault"
```

## Deleting a key vault protected by soft-delete

The command to delete a key vault changes in behavior, depending on whether soft-delete is enabled.

> [!IMPORTANT]
>If you run the following command for a key vault that does not have soft-delete enabled, you will permanently delete this key vault and all its content with no options for recovery!

```powershell
Remove-AzureRmKeyVault -VaultName 'ContosoVault'
```

### How soft-delete protects your key vaults

With soft-delete enabled:

- A deleted key vault is removed from its resource group and placed in a reserved namespace, associated with the location where it was created. 
- Deleted objects such as keys, secrets, and certificates, are inaccessible as long as their containing key vault is in the deleted state. 
- The DNS name for a deleted key vault is reserved, preventing a new key vault with same name from being created.  

You may view deleted state key vaults, associated with your subscription, using the following command:

```powershell
PS C:\> Get-AzureRmKeyVault -InRemovedState 
```

- *Id* can be used to identify the resource when recovering, or purging. 
- *Resource ID* is the original resource ID of this vault. Since this key vault is now in a deleted state, no resource exists with that resource ID. 
- *Scheduled Purge Date* is when the vault will be permanently deleted, if no action is taken. The default retention period, used to calculate the *Scheduled Purge Date*, is 90 days.

## Recovering a key vault

To recover a key vault, you specify the key vault name, resource group, and location. Note the location and the resource group of the deleted key vault, as you need them for the recovery process.

```powershell
Undo-AzureRmKeyVaultRemoval -VaultName ContosoVault -ResourceGroupName ContosoRG -Location westus
```

When a key vault is recovered, a new resource is created with the key vault's original resource ID. If the original resource group is removed, one must be created with same name before attempting recovery.

## Key Vault objects and soft-delete

The following command will delete the 'ContosoFirstKey' key, in a key vault named 'ContosoVault', which has soft-delete enabled:

```powershell
Remove-AzureKeyVaultKey -VaultName ContosoVault -Name ContosoFirstKey
```

With your key vault enabled for soft-delete, a deleted key still appears to be deleted, unless you explicitly list deleted keys. Most operations on a key in the deleted state will fail, except for listing, recovering, purging a deleted key. 

For example, the following command lists deleted keys in the 'ContosoVault' key vault:

```powershell
Get-AzureKeyVaultKey -VaultName ContosoVault -InRemovedState
```

### Transition state 

When you delete a key in a key vault with soft-delete enabled, it may take a few seconds for the transition to complete. During this transition, it may appear that the key is not in the active state or the deleted state. 

### Using soft-delete with key vault objects

Just like key vaults, a deleted key, secret, or certificate, remains in deleted state for up to 90 days, unless you recover it or purge it. 

#### Keys

To recover a soft-deleted key:

```powershell
Undo-AzureKeyVaultKeyRemoval -VaultName ContosoVault -Name ContosoFirstKey
```

To permanently delete (also known as purging) a soft-deleted key:

> [!IMPORTANT]
> Purging a key will permanently delete it, and it will not be recoverable! 

```powershell
Remove-AzureKeyVaultKey -VaultName ContosoVault -Name ContosoFirstKey -InRemovedState
```

The **recover** and **purge** actions have their own permissions associated in a key vault access policy. For a user or service principal to be able to execute a **recover** or **purge** action, they must have the respective permission for that key or secret. By default, **purge** isn't added to a key vault's access policy, when the 'all' shortcut is used to grant all permissions. You must specifically grant **purge** permission. 

#### Set a key vault access policy

The following command grants user@contoso.com permission to use several operations on keys in *ContosoVault* including **purge**:

```powershell
Set-AzureRmKeyVaultAccessPolicy -VaultName ContosoVault -UserPrincipalName user@contoso.com -PermissionsToKeys get,create,delete,list,update,import,backup,restore,recover,purge
```

>[!NOTE] 
> If you have an existing key vault that has just had soft-delete enabled, you may not have **recover** and **purge** permissions.

#### Secrets

Like keys, secrets are managed with their own commands:

- Delete a secret named SQLPassword: 
```powershell
Remove-AzureKeyVaultSecret -VaultName ContosoVault -name SQLPassword
```

- List all deleted secrets in a key vault: 
```powershell
Get-AzureKeyVaultSecret -VaultName ContosoVault -InRemovedState
```

- Recover a secret in the deleted state: 
```powershell
Undo-AzureKeyVaultSecretRemoval -VaultName ContosoVault -Name SQLPAssword
```

- Purge a secret in deleted state: 

  > [!IMPORTANT]
  > Purging a secret will permanently delete it, and it will not be recoverable!

  ```powershell
  Remove-AzureKeyVaultSecret -VaultName ContosoVault -InRemovedState -name SQLPassword
  ```

## Purging and key vaults

### Key vault objects

Purging a key, secret, or certificate, causes permanent deletion and it will not be recoverable. The key vault that contained the deleted object will however remain intact as will all other objects in the key vault. 

### Key vaults as containers
When a key vault is purged, its entire contents are permanently deleted, including keys, secrets, and certificates. To purge a key vault, use the `Remove-AzureRmKeyVault` command with the option `-InRemovedState` and by specifying the location of the deleted key vault with the `-Location location` argument. You can find the location of a deleted vault using the command `Get-AzureRmKeyVault -InRemovedState`.

>[!IMPORTANT]
>Purging a key vault will permanently delete it, meaning it will not be recoverable!

```powershell
Remove-AzureRmKeyVault -VaultName ContosoVault -InRemovedState -Location westus
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

