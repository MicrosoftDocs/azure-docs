---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 06/15/2020
 ms.author: rogarana
 ms.custom: include file
---
1. Make sure that you have installed latest [Azure PowerShell version](/powershell/azure/install-az-ps), and you are signed in to an Azure account in with Connect-AzAccount

1. Create an instance of Azure Key Vault and encryption key.

    When creating the Key Vault instance, you must enable purge protection. Purge protection ensures that a deleted key cannot be permanently deleted until the retention period lapses. These settings protect you from losing data due to accidental deletion. These settings are mandatory when using a Key Vault for encrypting managed disks.
    
    ```powershell
    $ResourceGroupName="yourResourceGroupName"
    $LocationName="westcentralus"
    $keyVaultName="yourKeyVaultName"
    $keyName="yourKeyName"
    $keyDestination="Software"
    $diskEncryptionSetName="yourDiskEncryptionSetName"

    $keyVault = New-AzKeyVault -Name $keyVaultName `
    -ResourceGroupName $ResourceGroupName `
    -Location $LocationName `
    -EnablePurgeProtection

    $key = Add-AzKeyVaultKey -VaultName $keyVaultName `
          -Name $keyName `
          -Destination $keyDestination 
    ```

1.    Create an instance of a DiskEncryptionSet. You can set RotationToLatestKeyVersionEnabled equal to $true to enable automatic rotation of the key. When you enable automatic rotation, the system will automatically update all managed disks, snapshots, and images referencing the disk encryption set to use the new version of the key within one hour.  
    
        ```powershell
      $desConfig=New-AzDiskEncryptionSetConfig -Location $LocationName `
            -SourceVaultId $keyVault.ResourceId `
            -KeyUrl $key.Key.Kid `
            -IdentityType SystemAssigned `
            -RotationToLatestKeyVersionEnabled $false

       $des=New-AzDiskEncryptionSet -Name $diskEncryptionSetName `
               -ResourceGroupName $ResourceGroupName `
               -InputObject $desConfig
        ```

1.    Grant the DiskEncryptionSet resource access to the key vault.

        > [!NOTE]
        > It may take few minutes for Azure to create the identity of your DiskEncryptionSet in your Azure Active Directory. If you get an error like "Cannot find the Active Directory object" when running the following command, wait a few minutes and try again.
        
        ```powershell  
        Set-AzKeyVaultAccessPolicy -VaultName $keyVaultName -ObjectId $des.Identity.PrincipalId -PermissionsToKeys wrapkey,unwrapkey,get
        ```
