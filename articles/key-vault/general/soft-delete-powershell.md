---
title: Azure Key Vault - How to use soft-delete with PowerShell
description: Use case examples of soft-delete with PowerShell code snips
services: key-vault
author: msmbaldwin
manager: rkarlin

ms.service: key-vault
ms.subservice: general
ms.topic: tutorial
ms.date: 08/12/2019
ms.author: mbaldwin
---

# How to use Key Vault soft-delete with PowerShell

Azure Key Vault's soft-delete feature allows recovery of deleted vaults and vault objects. Specifically, soft-delete addresses the following scenarios:

- Support for recoverable deletion of a key vault
- Support for recoverable deletion of key vault objects; keys, secrets, and, certificates

## Prerequisites

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

- Azure PowerShell 1.0.0 or later - If you don't have this already setup, install Azure PowerShell and associate it with your Azure subscription, see [How to install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview). 

>[!NOTE]
> There is an outdated version of our Key Vault PowerShell output formatting file that **may** be loaded into your environment instead of the correct version. We are anticipating an updated version of PowerShell to contain the needed correction for the output formatting and will update this topic at that time. 
The current workaround, should you encounter this formatting problem, is:
> - Use the following query if you notice you're not seeing the soft-delete enabled property described in this topic: `$vault = Get-AzKeyVault -VaultName myvault; $vault.EnableSoftDelete`.


For Key Vault specific reference information for PowerShell, see [Azure Key Vault PowerShell reference](/powershell/module/az.keyvault).

## Required permissions

Key Vault operations are separately managed via role-based access control (RBAC) permissions as follows:

| Operation | Description | User permission |
|:--|:--|:--|
|List|Lists deleted key vaults.|Microsoft.KeyVault/deletedVaults/read|
|Recover|Restores a deleted key vault.|Microsoft.KeyVault/vaults/write|
|Purge|Permanently removes a deleted key vault and all its contents.|Microsoft.KeyVault/locations/deletedVaults/purge/action|

For more information on permissions and access control, see [Secure your key vault](secure-your-key-vault.md)).

## Enabling soft-delete

You enable "soft-delete" to allow recovery of a deleted key vault, or objects stored in a key vault.

> [!IMPORTANT]
> Enabling 'soft-delete' on a key vault is an irreversible action. Once the soft-delete property has been set to "true", it cannot be changed or removed.  

### Existing key vault

For an existing key vault named ContosoVault, enable soft-delete as follows. 

```powershell
($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "ContosoVault").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enableSoftDelete" -Value "true"

Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties
```

### New key vault

Enabling soft-delete for a new key vault is done at creation time by adding the soft-delete enable flag to your create command.

```powershell
New-AzKeyVault -Name "ContosoVault" -ResourceGroupName "ContosoRG" -Location "westus" -EnableSoftDelete
```

### Verify soft-delete enablement

To verify that a key vault has soft-delete enabled, run the *show* command and look for the 'Soft Delete Enabled?' attribute:

```powershell
Get-AzKeyVault -VaultName "ContosoVault"
```

## Deleting a soft-delete protected key vault

The command to delete a key vault changes in behavior, depending on whether soft-delete is enabled.

> [!IMPORTANT]
>If you run the following command for a key vault that does not have soft-delete enabled, you will permanently delete this key vault and all its content with no options for recovery!

```powershell
Remove-AzKeyVault -VaultName 'ContosoVault'
```

### How soft-delete protects your key vaults

With soft-delete enabled:

- A deleted key vault is removed from its resource group and placed in a reserved namespace, associated with the location where it was created. 
- Deleted objects such as keys, secrets, and certificates, are inaccessible as long as their containing key vault is in the deleted state. 
- The DNS name for a deleted key vault is reserved, preventing a new key vault with same name from being created.  

You may view deleted state key vaults, associated with your subscription, using the following command:

```powershell
Get-AzKeyVault -InRemovedState 
```

- *ID* can be used to identify the resource when recovering or purging. 
- *Resource ID* is the original resource ID of this vault. Since this key vault is now in a deleted state, no resource exists with that resource ID. 
- *Scheduled Purge Date* is when the vault will be permanently deleted, if no action is taken. The default retention period, used to calculate the *Scheduled Purge Date*, is 90 days.

## Recovering a key vault

To recover a key vault, you specify the key vault name, resource group, and location. Note the location and the resource group of the deleted key vault, as you need them for the recovery process.

```powershell
Undo-AzKeyVaultRemoval -VaultName ContosoVault -ResourceGroupName ContosoRG -Location westus
```

When a key vault is recovered, a new resource is created with the key vault's original resource ID. If the original resource group is removed, one must be created with same name before attempting recovery.

## Deleting and purging key vault objects

The following command will delete the 'ContosoFirstKey' key, in a key vault named 'ContosoVault', which has soft-delete enabled:

```powershell
Remove-AzKeyVaultKey -VaultName ContosoVault -Name ContosoFirstKey
```

With your key vault enabled for soft-delete, a deleted key still appears to be deleted, unless you explicitly list deleted keys. Most operations on a key in the deleted state will fail, except for listing, recovering, purging a deleted key. 

For example, the following command lists deleted keys in the 'ContosoVault' key vault:

```powershell
Get-AzKeyVaultKey -VaultName ContosoVault -InRemovedState
```

### Transition state 

When you delete a key in a key vault with soft-delete enabled, it may take a few seconds for the transition to complete. During this transition, it may appear that the key is not in the active state or the deleted state. 

### Using soft-delete with key vault objects

Just like key vaults, a deleted key, secret, or certificate, remains in deleted state for up to 90 days, unless you recover it or purge it. 

#### Keys

To recover a soft-deleted key:

```powershell
Undo-AzKeyVaultKeyRemoval -VaultName ContosoVault -Name ContosoFirstKey
```

To permanently delete (also known as purging) a soft-deleted key:

> [!IMPORTANT]
> Purging a key will permanently delete it, and it will not be recoverable! 

```powershell
Remove-AzKeyVaultKey -VaultName ContosoVault -Name ContosoFirstKey -InRemovedState
```

The **recover** and **purge** actions have their own permissions associated in a key vault access policy. For a user or service principal to be able to execute a **recover** or **purge** action, they must have the respective permission for that key or secret. By default, **purge** isn't added to a key vault's access policy, when the 'all' shortcut is used to grant all permissions. You must specifically grant **purge** permission. 

#### Set a key vault access policy

The following command grants user@contoso.com permission to use several operations on keys in *ContosoVault* including **purge**:

```powershell
Set-AzKeyVaultAccessPolicy -VaultName ContosoVault -UserPrincipalName user@contoso.com -PermissionsToKeys get,create,delete,list,update,import,backup,restore,recover,purge
```

>[!NOTE] 
> If you have an existing key vault that has just had soft-delete enabled, you may not have **recover** and **purge** permissions.

#### Secrets

Like keys, secrets are managed with their own commands:

- Delete a secret named SQLPassword: 
  ```powershell
  Remove-AzKeyVaultSecret -VaultName ContosoVault -name SQLPassword
  ```

- List all deleted secrets in a key vault: 
  ```powershell
  Get-AzKeyVaultSecret -VaultName ContosoVault -InRemovedState
  ```

- Recover a secret in the deleted state: 
  ```powershell
  Undo-AzKeyVaultSecretRemoval -VaultName ContosoVault -Name SQLPAssword
  ```

- Purge a secret in deleted state: 

  > [!IMPORTANT]
  > Purging a secret will permanently delete it, and it will not be recoverable!

  ```powershell
  Remove-AzKeyVaultSecret -VaultName ContosoVault -InRemovedState -name SQLPassword
  ```

#### Certificates

You can manage certificates using below commands:

- Delete a Certificate named SQLPassword: 
  ```powershell
  Remove-AzKeyVaultCertificate -VaultName ContosoVault -Name 'MyCert'
  ```

- List all deleted certificates in a key vault: 
  ```powershell
  Get-AzKeyVaultCertificate -VaultName ContosoVault -InRemovedState
  ```

- Recover a certificate in the deleted state: 
  ```powershell
  Undo-AzKeyVaultCertificateRemoval -VaultName ContosoVault -Name 'MyCert'
  ```

- Purge a certificate in deleted state: 

  > [!IMPORTANT]
  > Purging a certificate will permanently delete it, and it will not be recoverable!

  ```powershell
  Remove-AzKeyVaultcertificate -VaultName ContosoVault -Name 'MyCert' -InRemovedState 
  ```
  
## Purging a soft-delete protected key vault

> [!IMPORTANT]
> Purging a key vault or one of its contained objects, will permanently delete it, meaning it will not be recoverable!

The purge function is used to permanently delete a key vault object or an entire key vault, that was previously soft-deleted. As demonstrated in the previous section, objects stored in a key vault with the soft-delete feature enabled, can go through multiple states:
- **Active**: before deletion.
- **Soft-Deleted**: after deletion, able to be listed and recovered back to active state.
- **Permanently-Deleted**: after purge, not able to be recovered.


The same is true for the key vault. In order to permanently delete a soft-deleted key vault and its contents, you must purge the key vault itself.

### Purging a key vault

When a key vault is purged, its entire contents are permanently deleted, including keys, secrets, and certificates. To purge a soft-deleted key vault, use the `Remove-AzKeyVault` command with the option `-InRemovedState` and by specifying the location of the deleted key vault with the `-Location location` argument. You can find the location of a deleted vault using the command `Get-AzKeyVault -InRemovedState`.

```powershell
Remove-AzKeyVault -VaultName ContosoVault -InRemovedState -Location westus
```

### Purge permissions required
- To purge a deleted key vault, the user needs RBAC permission to the *Microsoft.KeyVault/locations/deletedVaults/purge/action* operation. 
- To list a deleted key vault, the user needs RBAC permission to the *Microsoft.KeyVault/deletedVaults/read* operation. 
- By default only a subscription administrator has these permissions. 

### Scheduled purge

Listing deleted key vault objects also shows when they're scheduled to be purged by Key Vault. *Scheduled Purge Date* indicates when a key vault object will be permanently deleted, if no action is taken. By default, the retention period for a deleted key vault object is 90 days.

>[!IMPORTANT]
>A purged vault object, triggered by its *Scheduled Purge Date* field, is permanently deleted. It is not recoverable!

## Enabling Purge Protection

When purge protection is turned on, a vault or an object in deleted state cannot be purged until the retention period has passed. Such vault or object can still be recovered. This feature gives added assurance that a vault or an object can never be permanently deleted until the retention period has passed. The default retention period is 90 days but, during key vault creation, it is possible to set the retention policy interval to a value from 7 to 90 days. The purge protection retention policy uses the same interval. Once set, the retention policy interval cannot be changed.

You can enable purge protection only if soft-delete is also enabled. Disabling purge protection isn't supported at this time. 

To turn on both soft-delete and purge protection when creating a vault, use the [New-AzKeyVault](/powershell/module/az.keyvault/new-azkeyvault?view=azps-1.5.0) cmdlet:

```powershell
New-AzKeyVault -Name ContosoVault -ResourceGroupName ContosoRG -Location westus -EnableSoftDelete -EnablePurgeProtection
```

To add purge protection to an existing vault (that already has soft-delete enabled), use the [Get-AzKeyVault](/powershell/module/az.keyvault/Get-AzKeyVault?view=azps-1.5.0), [Get-AzResource](/powershell/module/az.resources/get-azresource?view=azps-1.5.0), and [Set-AzResource](/powershell/module/az.resources/set-azresource?view=azps-1.5.0) cmdlets:

```
($resource = Get-AzResource -ResourceId (Get-AzKeyVault -VaultName "ContosoVault").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enablePurgeProtection" -Value "true"

Set-AzResource -resourceid $resource.ResourceId -Properties $resource.Properties
```

## Other resources

- For an overview of Key Vault's soft-delete feature, see [Azure Key Vault soft-delete overview](overview-soft-delete.md)).
- For a general overview of Azure Key Vault usage, see [What is Azure Key Vault?](overview.md)).
