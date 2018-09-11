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
ms.date: 08/21/2017
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

To be able to recover a deleted key vault or objects stored in a key vault, you must first enable soft-delete for that key vault.

### Existing key vault

For an existing key vault named ContosoVault, enable soft-delete as follows. 

>[!NOTE]
>Currently you need to use Azure Resource Manager resource manipulation to directly write the *enableSoftDelete* property to the Key Vault resource.

```powershell
($resource = Get-AzureRmResource -ResourceId (Get-AzureRmKeyVault -VaultName "ContosoVault").ResourceId).Properties | Add-Member -MemberType "NoteProperty" -Name "enableSoftDelete" -Value "true"

Set-AzureRmResource -resourceid $resource.ResourceId -Properties $resource.Properties
```

### New key vault

Enabling soft-delete for a new key vault is done at creation time by adding the soft-delete enable flag to your create command.

```powershell
New-AzureRmKeyVault -VaultName "ContosoVault" -ResourceGroupName "ContosoRG" -Location "westus" -EnableSoftDelete
```

### Verify soft-delete enablement

To verify that a key vault has soft-delete enabled, run the *get* command and look for the 'Soft Delete Enabled?' attribute and its setting, true or false.

```powershell
Get-AzureRmKeyVault -VaultName "ContosoVault"
```

## Deleting a key vault protected by soft-delete

The command to delete (or remove) a key vault remains the same, but its behavior changes depending on whether you have enabled soft-delete or not.

```powershell
Remove-AzureRmKeyVault -VaultName 'ContosoVault'
```

> [!IMPORTANT]
>If you run the previous command for a key vault that does not have soft-delete enabled, you will permanently delete this key vault and all its content without any options for recovery.

### How soft-delete protects your key vaults

With soft-delete enabled:

- When a key vault is deleted, it is removed from its resource group and placed in a reserved namespace that is only associated with the location where it was created. 
- Objects in a deleted key vault, such as keys, secrets and, certificates, are inaccessible and remain so while their containing key vault is in the deleted state. 
- The DNS name for a key vault in a deleted state is still reserved so, a new key vault with same name cannot be created.  

You may view deleted state key vaults, associated with your subscription, using the following command:

```powershell
PS C:\> Get-AzureRmKeyVault -InRemovedStateVault 

Name           : ContosoVault
Location             : westus
Id                   : /subscriptions/xxx/providers/Microsoft.KeyVault/locations/westus/deletedVaults/ContosoVault
Resource ID          : /subscriptions/xxx/resourceGroups/ContosoVault/providers/Microsoft.KeyVault/vaults/ContosoVault
Deletion Date        : 5/9/2017 12:14:14 AM
Scheduled Purge Date : 8/7/2017 12:14:14 AM
Tags                 :
```

The *Resource ID* in the output refers to the original resource ID of this vault. Since this key vault is now in a deleted state, no resource exists with that resource ID. The *Id* field can be used to identify the resource when recovering, or purging. The *Scheduled Purge Date* field indicates when the vault will be permanently deleted (purged) if no action is taken for this deleted vault. The default retention period, used to calculate the *Scheduled Purge Date*, is 90 days.

## Recovering a key vault

To recover a key vault, you need to specify the key vault name, resource group, and location. Note the location and the resource group of the deleted key vault as you need these for a key vault recovery process.

```powershell
Undo-AzureRmKeyVaultRemoval -VaultName ContosoVault -ResourceGroupName ContosoRG -Location westus
```

When a key vault is recovered, the result is a new resource with the key vault's original resource ID. If the resource group where the key vault existed has been removed, a new resource group with same name must be created before the key vault can be recovered.

## Key Vault objects and soft-delete

For a key, 'ContosoFirstKey', in a key vault named 'ContosoVault' with soft-delete enabled, here's how you would delete that key.

```powershell
Remove-AzureKeyVaultKey -VaultName ContosoVault -Name ContosoFirstKey
```

With your key vault enabled for soft-delete, a deleted key still appears like it's deleted except, when you explicitly list or retrieve deleted keys. Most operations on a key in the deleted state will fail except for listing a deleted key, recovering it or purging it. 

For example, to request to list deleted keys in a key vault, use the following command:

```powershell
Get-AzureKeyVaultKey -VaultName ContosoVault -InRemovedState
```

### Transition state 

When you delete a key in a key vault with soft-delete enabled, it may take a few seconds for the transition to complete. During this transition state, it may appear that the key is not in the active state or the deleted state. This command will list all deleted keys in your key vault named 'ContosoVault'.

```powershell
  Get-AzureKeyVaultKey -VaultName ContosoVault -InRemovedState
  Vault Name           : ContosoVault
  Name                 : ContosoFirstKey
  Id                   : https://ContosoVault.vault.azure.net:443/keys/ContosoFirstKey
  Deleted Date         : 2/14/2017 8:20:52 PM
  Scheduled Purge Date : 5/15/2017 8:20:52 PM
  Enabled              : True
  Expires              :
  Not Before           :
  Created              : 2/14/2017 8:16:07 PM
  Updated              : 2/14/2017 8:16:07 PM
  Tags                 :
```

### Using soft-delete with key vault objects

Just like key vaults, a deleted key, secret or, certificate will remain in deleted state for up to 90 days unless you recover it or purge it. 

#### Keys

To recover a deleted key:

```powershell
Undo-AzureKeyVaultKeyRemoval -VaultName ContosoVault -Name ContosoFirstKey
```

To permanently delete a key:

```powershell
Remove-AzureKeyVaultKey -VaultName ContosoVault -Name ContosoFirstKey -InRemovedState
```

>[!NOTE]
>Purging a key will permanently delete it, meaning it will not be recoverable.

The **recover** and **purge** actions have their own permissions associated in a key vault access policy. For a user or service principal to be able to execute a **recover** or **purge** action they must have the respective permission for that object (key or secret) in the key vault access policy. By default, the **purge** permission is not added to a key vault's access policy when the 'all' shortcut is used to grant all permissions to a user. You must explicitly grant **purge** permission. For example, the following command grants user@contoso.com permission to perform several operations on keys in *ContosoVault* including **purge**.

#### Set a key vault access policy

```powershell
Set-AzureRmKeyVaultAccessPolicy -VaultName ContosoVault -UserPrincipalName user@contoso.com -PermissionsToKeys get,create,delete,list,update,import,backup,restore,recover,purge
```

>[!NOTE] 
> If you have an existing key vault that has just had soft-delete enabled, you may not have **recover** and **purge** permissions.

#### Secrets

Like keys, secrets in a key vault are operated on with their own commands. Following, are the commands for deleting, listing, recovering, and purging secrets.

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
```powershell
Remove-AzureKeyVaultSecret -VaultName ContosoVault -InRemovedState -name SQLPassword
```

>[!NOTE]
>Purging a secret will permanently delete it, meaning it will not be recoverable.

## Purging and key vaults

### Key vault objects

Purging a key, secret or, certificate will permanently delete it, meaning it will not be recoverable. The key vault that contained the deleted object will however remain intact as will all other objects in the key vault. 

### Key vaults as containers
When a key vault is purged, all of its contents, including keys, secrets, and certificates, are permanently deleted. To purge a key vault, use the `Remove-AzureRmKeyVault` command with the option `-InRemovedState` and by specifying the location of the deleted key vault with the `-Location location` argument. You can find the location of a deleted vault using the command `Get-AzureRmKeyVault -InRemovedState`.

```powershell
Remove-AzureRmKeyVault -VaultName ContosoVault -InRemovedState -Location westus
```

>[!NOTE]
>Purging a key vault will permanently delete it, meaning it will not be recoverable.

### Purge permissions required
- To purge a deleted key vault, such that the vault and all its contents are permanently removed, the user needs RBAC permission to perform a *Microsoft.KeyVault/locations/deletedVaults/purge/action* operation. 
- To list the deleted key, the vault a user needs RBAC permission to perform *Microsoft.KeyVault/deletedVaults/read* permission. 
- By default only a subscription administrator has these permissions. 

### Scheduled purge

Listing your deleted key vault objects shows when they are schedled to be purged by Key Vault. The *Scheduled Purge Date* field indicates when a key vault object will be permanently deleted, if no action is taken. By default, the retention period for a deleted key vault object is 90 days.

>[!NOTE]
>A purged vault object, triggered by its *Scheduled Purge Date* field, is permanently deleted. It is not recoverable.

## Other resources

- For an overview of Key Vault's soft-delete feature, see [Azure Key Vault soft-delete overview](key-vault-ovw-soft-delete.md).
- For a general overview of Azure Key Vault usage, see [Get started with Azure Key Vault](key-vault-get-started.md).

