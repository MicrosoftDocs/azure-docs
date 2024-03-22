---
title: Azure PowerShell - Enable double encryption at rest - managed disks
description: Enable double encryption at rest for your managed disk data using Azure PowerShell.
author: roygara

ms.date: 02/06/2023
ms.topic: how-to
ms.author: rogarana
ms.service: azure-disk-storage
ms.custom: references_regions, devx-track-azurepowershell
---

# Use the Azure PowerShell module to enable double encryption at rest for managed disks

**Applies to:** :heavy_check_mark: Windows VMs 

Azure Disk Storage supports double encryption at rest for managed disks. For conceptual information on double encryption at rest, and other managed disk encryption types, see the [Double encryption at rest](../disk-encryption.md#double-encryption-at-rest) section of our disk encryption article.

## Restrictions

Double encryption at rest isn't currently supported with either Ultra Disks or Premium SSD v2 disks.

## Prerequisites

Install the latest [Azure PowerShell version](/powershell/azure/install-azure-powershell), and sign in to an Azure account using [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount).

## Getting started

1. Create an instance of Azure Key Vault and encryption key.

    When creating the Key Vault instance, you must enable soft delete and purge protection. Soft delete ensures that the Key Vault holds a deleted key for a given retention period (90 day default). Purge protection ensures that a deleted key can't be permanently deleted until the retention period lapses. These settings protect you from losing data due to accidental deletion. These settings are mandatory when using a Key Vault for encrypting managed disks.
    
    ```powershell
    $ResourceGroupName="yourResourceGroupName"
    $LocationName="westus2"
    $keyVaultName="yourKeyVaultName"
    $keyName="yourKeyName"
    $keyDestination="Software"
    $diskEncryptionSetName="yourDiskEncryptionSetName"

    $keyVault = New-AzKeyVault -Name $keyVaultName -ResourceGroupName $ResourceGroupName -Location $LocationName -EnableSoftDelete -EnablePurgeProtection

    $key = Add-AzKeyVaultKey -VaultName $keyVaultName -Name $keyName -Destination $keyDestination  
    ```

1. Retrieve the URL for the key you created, you'll need it for subsequent commands. The ID output from `Get-AzKeyVaultKey` is the key URL. 

    ```powershell
    Get-AzKeyVaultKey -VaultName $keyVaultName -KeyName $keyName
    ```

1. Get the resource ID for the Key Vault instance you created, you'll need it for subsequent commands.

    ```powershell
    Get-AzKeyVault -VaultName $keyVaultName
    ```

1.  Create a DiskEncryptionSet with encryptionType set as EncryptionAtRestWithPlatformAndCustomerKeys. Replace `yourKeyURL` and `yourKeyVaultURL` with the URLs you retrieved earlier.
    
    ```powershell
    $config = New-AzDiskEncryptionSetConfig -Location $locationName -KeyUrl "yourKeyURL" -SourceVaultId 'yourKeyVaultURL' -IdentityType 'SystemAssigned'
    
    $config | New-AzDiskEncryptionSet -ResourceGroupName $ResourceGroupName -Name $diskEncryptionSetName -EncryptionType EncryptionAtRestWithPlatformAndCustomerKeys
    ```

1. Grant the DiskEncryptionSet resource access to the key vault.

    > [!NOTE]
    > It may take few minutes for Azure to create the identity of your DiskEncryptionSet in your Microsoft Entra ID. If you get an error like "Cannot find the Active Directory object" when running the following command, wait a few minutes and try again.

    ```powershell  
    $des=Get-AzDiskEncryptionSet -name $diskEncryptionSetName -ResourceGroupName $ResourceGroupName
    Set-AzKeyVaultAccessPolicy -VaultName $keyVaultName -ObjectId $des.Identity.PrincipalId -PermissionsToKeys wrapkey,unwrapkey,get
    ```

## Next steps

Now that you've created and configured these resources, you can use them to secure your managed disks. The following links contain example scripts, each with a respective scenario, that you can use to secure your managed disks.

- [Azure PowerShell - Enable customer-managed keys with server-side encryption - managed disks](disks-enable-customer-managed-keys-powershell.md)
- [Azure Resource Manager template samples](https://github.com/Azure-Samples/managed-disks-powershell-getting-started/tree/master/DoubleEncryption)
