---
title: Preview - Create an image version encrypted with your own keys 
description: Create a an image version in a Shared Image Gallery, using customer-managed encryption keys.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 05/06/2020
ms.author: cynthn
---

# Preview: Use customer-managed keys for encrypting images

Gallery images are stored as managed disks, so they are automatically encrypted using server-side encryption. Server-side encryption uses 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. For more information about the cryptographic modules underlying Azure managed disks, see [Cryptography API: Next Generation](/windows/desktop/seccng/cng-portal)

You can rely on platform-managed keys for the encryption of your images, or you can manage encryption using your own keys. If you choose to manage encryption with your own keys, you can specify a *customer-managed key* to use for encrypting and decrypting all disks in your images. 

Server-side encryption using customer-managed keys uses Azure Key Vault. You can either import [your RSA keys](../key-vault/keys/hsm-protected-keys.md) to your Key Vault or generate new RSA keys in Azure Key Vault.

To use customer managed keys for images, you first need an Azure Key Vault. You then create a disk encryption set. The disk encryption set is then used when creating you image versions.

For more information about creating and using disk encryption sets, see [Customer managed keys](./windows/disk-encryption.md#customer-managed-keys).

## Limitations

There are several limitations when using customer managed keys for encrypting shared image gallery images:	

- Encryption key sets must be in the same subscription and region as you image.

- You cannot share images that use customer managed keys. 

- You cannot replicate images that use customer managed keys to other regions.

- Once you have used your own keys to encrypt a disk or image, you cannot go back to using platform-managed keys for encrypting those disks or images.


> [!IMPORTANT]
> Encryption using customer-managed keys is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).


## PowerShell

For the public preview, you first need to register the feature.

```azurepowershell-interactive
Register-AzProviderFeature -FeatureName SIGEncryption -ProviderNamespace Microsoft.Compute
```

It takes a few minutes for the registration to complete. Use Get-AzProviderFeature to check on the status of the feature registration.

```azurepowershell-interactive
Get-AzProviderFeature -FeatureName SIGEncryption -ProviderNamespace Microsoft.Compute
```

When RegistrationState returns Registered, you can move on to the next step.

Check your provider registration. Make sure it returns `Registered`.

```azurepowershell-interactive
Get-AzResourceProvider -ProviderNamespace Microsoft.Compute | Format-table -Property ResourceTypes,RegistrationState
```

If it doesn't return `Registered`, use the following to register the providers:

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.Compute
```

To specify a disk encryption set to for an image version, use  [New-AzGalleryImageDefinition](/powershell/module/az.compute/new-azgalleryimageversion) with the `-TargetRegion` parameter. 

```azurepowershell-interactive

$sourceId = <ID of the image version source>

$osDiskImageEncryption = @{DiskEncryptionSetId='subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Compute/diskEncryptionSets/myDESet'}

$dataDiskImageEncryption1 = @{DiskEncryptionSetId='subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Compute/diskEncryptionSets/myDESet1';Lun=1}

$dataDiskImageEncryption2 = @{DiskEncryptionSetId='subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Compute/diskEncryptionSets/myDESet2';Lun=2}

$dataDiskImageEncryptions = @($dataDiskImageEncryption1,$dataDiskImageEncryption2)

$encryption1 = @{OSDiskImage=$osDiskImageEncryption;DataDiskImages=$dataDiskImageEncryptions}

$region1 = @{Name='West US';ReplicaCount=1;StorageAccountType=Standard_LRS;Encryption=$encryption1}

$targetRegion = @{$region1}


# Create the image
New-AzGalleryImageVersion `
   -ResourceGroupName $rgname `
   -GalleryName $galleryName `
   -GalleryImageDefinitionName $imageDefinitionName `
   -Name $versionName -Location $location `
   -SourceImageId $sourceId `
   -ReplicaCount 2 `
   -StorageAccountType Standard_LRS `
   -PublishingProfileEndOfLifeDate '2020-12-01' `
   -TargetRegion $targetRegion
```

### Create a VM

You can create a VM from a shared image gallery and use customer-managed keys to encrypt the disks. The syntax is the same as creating a [generalized](vm-generalized-image-version-powershell.md) or [specialized](vm-specialized-image-version-powershell.md) VM from an image, you need to use the extended parameter set and add `Set-AzVMOSDisk -Name $($vmName +"_OSDisk") -DiskEncryptionSetId $diskEncryptionSet.Id -CreateOption FromImage` to the VM configuration.

For data disks, You need to add  the `-DiskEncryptionSetId $setID` parameter when you use [Add-AzVMDataDisk](/powershell/module/az.compute/add-azvmdatadisk).


## CLI 

For the public preview, you first need to register the feature.

```azurecli-interactive
az feature register --namespace Microsoft.Compute --name SIGEncryption
```

Check the status of the feature registration.

```azurecli-interactive
az feature show --namespace Microsoft.Compute --name SIGEncryption | grep state
```

When this returns `"state": "Registered"`, you can move on to the next step.

Check your registration.

```azurecli-interactive
az provider show -n Microsoft.Compute | grep registrationState
```

If it doesn't say registered, run the following:

```azurecli-interactive
az provider register -n Microsoft.Compute
```


To specify a disk encryption set to for an image version, use  [az image gallery create-image-version](/cli/azure/sig/image-version#az-sig-image-version-create) with the `--target-region-encryption` parameter. The format for `--target-region-encryption` is a space-separated list of keys for encrypting the OS and data disks. It should look like this: `<encryption set for the OS disk>,<Lun number of the data disk>, <encryption set for the data disk>, <Lun number for the second data disk>, <encryption set for the second data disk>`. 

If the source for the OS disk is a managed disk or a VM, use `--managed-image` to specify the source for the image version. In this example, the source is a managed image that has an OS disk as well as a data disk at LUN 0. The OS disk will be encrypted with DiskEncryptionSet1 and the data disk will be encrypted with DiskEncryptionSet2.

```azurecli-interactive
az sig image-version create \
   -g MyResourceGroup \
   --gallery-image-version 1.0.0 \
   --target-regions westus=2=standard_lrs \
   --target-region-encryption DiskEncryptionSet1,0,DiskEncryptionSet2 \
   --gallery-name MyGallery \
   --gallery-image-definition MyImage \
   --managed-image "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myImage"
```

If the source for the OS disk is a snapshot, use `--os-snapshot` to specify the OS disk. If there are data disk snapshots that should also be part of the image version, add those using `--data-snapshot-luns` to specify the LUN, and `--data-snapshots` to specify the snapshots.

In this example, the sources are disk snapshots. There is an OS disk, and also a data disk at LUN 0. The OS disk will be encrypted with DiskEncryptionSet1 and the data disk will be encrypted with DiskEncryptionSet2.

```azurecli-interactive
az sig image-version create \
   -g MyResourceGroup \
   --gallery-image-version 1.0.0 \
   --target-regions westus=2=standard_lrs \
   --target-region-encryption DiskEncryptionSet1,0,DiskEncryptionSet2 \
   --os-snapshot "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/myOSSnapshot"
   --data-snapshot-luns 0
   --data-snapshots "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/myDDSnapshot"
   --gallery-name MyGallery \
   --gallery-image-definition MyImage 
   
```

### Create the VM

You can create a VM from a shared image gallery and use customer-managed keys to encrypt the disks. The syntax is the same as creating a [generalized](vm-generalized-image-version-cli.md) or [specialized](vm-specialized-image-version-cli.md) VM from an image, you just need to add the `--os-disk-encryption-set` parameter with the ID of the encryption set. For data disks, add `--data-disk-encryption-sets` with a space delimited list of the disk encryption sets for the data disks.


## Portal

When you create your image version in the portal, you can use the **Encryption** tab to enter the information about your storage encryption sets.

1. In the **Create an image version** page, select the **Encryption** tab.
2. In **Encryption type**, select **Encryption at-rest with a customer-managed key**. 
3. For each disk in the image, select the **Disk encryption set** to use from the drop-down. 

### Create the VM

You can create a VM from a shared image gallery and use customer-managed keys to encrypt the disks. When you create the VM in the portal, on the **Disks** tab, select **Encryption at-rest with customer-managed keys** for the **Encryption type**. You can then select the encryption set from the drop-down.

## Next steps

Learn more about [server-side disk encryption](./windows/disk-encryption.md).
