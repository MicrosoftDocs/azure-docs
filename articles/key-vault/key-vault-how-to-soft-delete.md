---
ms.assetid: 
title: How to: Azure Key Vault soft delete | Microsoft Docs
ms.service: key-vault
author: BrucePerlerMS
ms.author: bruceper
manager: mbaldwin
ms.date: 07/18/2017
---
# How to: Azure Key Vault soft-delete

Key Vault's soft delete feature allows recovery of the deleted vaults and vault objects, known as soft-delete. Specifically, we address the following scenarios:

- Support for recoverable deletion of a key vault
- Support for recoverable deletion of key vault objects (ex. keys, secrets, certificates)

## Prerequisites

- Azure PowerShell 4.0.0 or later
- Azure CLI 2.0

## Enabling soft-delete

To be able to recover a deleted vault or deleted keys/secrets inside a vault you must first enable soft-delete for that vault. Here's how.

### Existing vault
Say you have a key vault named 'ContosoVault', here's how you would enable soft-delete for this vault:

`($resource = Get-AzureRmResource -ResourceId (Get-AzureRmKeyVault -VaultName ContosoVault).ResourceId).Properties | Add-Member -MemberType NoteProperty -Name enableSoftDelete -Value 'True'`

`Set-AzureRmResource -resourceid $resource.ResourceId -Properties $resource.Properties`

### New vault

If you're creating a new vault, simply add '-EnableSoftDelete' parameter when running 'New-AzureRmKeyVault' cmdlet, like this:

`New-AzureRmKeyVault -VaultName ContosoVault -ResourceGroupName ContosoRG -Location westus -EnableSoftDelete`

### Verify soft-delete enablement

To check whether a vault has soft-delete enabled, run the 'Get-AzureRmKeyVault' cmdlet and look for the 'Soft Delete Enabled?' attribute. If it is set to 'True', soft-delete is enabled for this vault. If set to empty or 'False' soft-delete is disabled.

## Deleting a vault protected by soft-delete

The cmdlet to delete (or remove) a vault remains same, but it's behavior changes depending on whether you have enabled soft-delete or not.

`Remove-AzureRmKeyVault -VaultName ContosoVault`

Beware that, if you run the above cmdlet for a vault that does not have soft-delete enabled, you will permanently lose this vault and all its content without any options for recovery.

With soft-delete turned on, when a vault is deleted, it is removed from the resource group and placed in a different name space that is only associated with the location where it was created. All the keys and secrets in a deleted vault also become inaccessible. The DNS name for a vault in a deleted state is still reserved, so a new vault with same name cannot be created.  To see all the vaults in your subscription in deleted state, run this cmdlet:

  ```
  PS C:\> Get-AzureRmKeyVault -InRemovedState
  Vault Name           : ContosoVault
  Location             : westus
  Id                   : /subscriptions/xxx/providers/Microsoft.KeyVault/locations/westus/deletedVaults/ContosoVault
  Resource ID          : /subscriptions/xxx/resourceGroups/ContosoVault/providers/Microsoft.KeyVault/vaults/ContosoVault
  Deletion Date        : 5/9/2017 12:14:14 AM
  Scheduled Purge Date : 8/7/2017 12:14:14 AM
  Tags                 :
  ```

 The `Get-AzureRmKeyVault` cmdlet will only show deleted vault if you use *-InRemovedState* parameter. In other words, if you do not use the *-InRemovedState* parameter, you will not see deleted vaults listed.

The *Resource ID* in the above output refers to the original resource ID of this vault. Since this vault is now in a deleted state, no such resource exists with that resource ID. That's where the *Id* field above comes in, which can be used to identify the resource when recovering, or purging. The *Scheduled Purge Date* field indicates when the vault will be permanently deleted (purged) if no action is taken for this deleted vault.

## Recovering a vault

To recover a vault, you need to specify the vault name, resource group and location. Note the location and the resource group of the deleted vault. You'll need it when recovering.

`Undo-AzureRmKeyVaultRemoval -VaultName ContosoVault -ResourceGroupName ContosoRG-Location westus`

When a vault is recovered, all the keys/secrets in the vault will also become accessible again.

When a vault is recovered, the result is a new resource with the vault's original resource ID. If the resource group where the vault existed has been removed, a new resource group with same name will need to be recreated before the vault can be recovered. 

To purge, permanently delete:

` Remove-AzureRmKeyVault -VaultName ContosoVault -InRemovedState -Location westus `