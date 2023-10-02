---
title: Create an encrypted image version with customer-managed keys
description: Create an image version in an Azure Compute Gallery, by using customer-managed encryption keys.
author: mattmcinnes
ms.service: virtual-machines
ms.subservice: gallery
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 02/22/2023
ms.custom: devx-track-azurepowershell, devx-track-azurecli 
ms.devlang: azurecli
---

# Create an encrypted image version with customer-managed keys

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Images in an Azure Compute Gallery (formerly known as Shared Image Gallery) are stored as snapshots. These images are automatically encrypted through server-side 256-bit encryption [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard). Server-side encryption is also FIPS 140-2 compliant. For more information about the cryptographic modules underlying Azure managed disks, see [Cryptography API: Next Generation](/windows/desktop/seccng/cng-portal).

You can rely on platform-managed keys for the encryption of your images, or use your own keys. You can also use both of these features together for doubled encryption. If you choose to manage encryption with your own keys, you can specify a *customer-managed key* to use for encrypting and decrypting all disks in your images. 

Server-side encryption through customer-managed keys uses Azure Key Vault. You can either import [your RSA keys](../key-vault/keys/hsm-protected-keys.md) to your key vault or generate new RSA keys in Azure Key Vault.

## Prerequisites

This article requires that you already have a disk encryption set in each region where you want to replicate your image:

- To use only a customer-managed key, see the articles about enabling customer-managed keys with server-side encryption by using the [Azure portal](./disks-enable-customer-managed-keys-portal.md) or [PowerShell](./windows/disks-enable-customer-managed-keys-powershell.md#set-up-an-azure-key-vault-and-diskencryptionset-optionally-with-automatic-key-rotation).

- To use both platform-managed and customer-managed keys (for double encryption), see the articles about enabling double encryption at rest by using the [Azure portal](./disks-enable-double-encryption-at-rest-portal.md) or [PowerShell](./windows/disks-enable-double-encryption-at-rest-powershell.md).

   > [!IMPORTANT]
   > You must use the link [https://aka.ms/diskencryptionupdates](https://aka.ms/diskencryptionupdates) to access the Azure portal. Double encryption at rest is not currently visible in the public Azure portal unless you use that link.

## Limitations

When you're using customer-managed keys for encrypting images in an Azure Compute Gallery, these limitations apply:

- Encryption key sets must be in the same subscription as your image.

- Encryption key sets are regional resources, so each region requires a different encryption key set.

- After you've used your own keys to encrypt an image, you can't go back to using platform-managed keys for encrypting those images.

- VM image version source doesn't currently support customer-managed key encryption.

- Some of the features like replicating an SSE+CMK image, creating an image from SSE+CMK encrypted disk etc. are not supported through portal.

## PowerShell

To specify a disk encryption set for an image version, use  [New-AzGalleryImageVersion](/powershell/module/az.compute/new-azgalleryimageversion) with the `-TargetRegion` parameter: 

```azurepowershell-interactive

$sourceId = <ID of the image version source>

$osDiskImageEncryption = @{DiskEncryptionSetId='subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Compute/diskEncryptionSets/myDESet'}

$dataDiskImageEncryption1 = @{DiskEncryptionSetId='subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Compute/diskEncryptionSets/myDESet1';Lun=1}

$dataDiskImageEncryption2 = @{DiskEncryptionSetId='subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Compute/diskEncryptionSets/myDESet2';Lun=2}

$dataDiskImageEncryptions = @($dataDiskImageEncryption1,$dataDiskImageEncryption2)

$encryption1 = @{OSDiskImage=$osDiskImageEncryption;DataDiskImages=$dataDiskImageEncryptions}

$region1 = @{Name='West US';ReplicaCount=1;StorageAccountType=Standard_LRS;Encryption=$encryption1}

$eastUS2osDiskImageEncryption = @{DiskEncryptionSetId='subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Compute/diskEncryptionSets/myEastUS2DESet'}

$eastUS2dataDiskImageEncryption1 = @{DiskEncryptionSetId='subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Compute/diskEncryptionSets/myEastUS2DESet1';Lun=1}

$eastUS2dataDiskImageEncryption2 = @{DiskEncryptionSetId='subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Compute/diskEncryptionSets/myEastUS2DESet2';Lun=2}

$eastUS2DataDiskImageEncryptions = @($eastUS2dataDiskImageEncryption1,$eastUS2dataDiskImageEncryption2)

$encryption2 = @{OSDiskImage=$eastUS2osDiskImageEncryption;DataDiskImages=$eastUS2DataDiskImageEncryptions}

$region2 = @{Name='East US 2';ReplicaCount=1;StorageAccountType=Standard_LRS;Encryption=$encryption2}

$targetRegion = @($region1, $region2)


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

You can create a virtual machine (VM) from an Azure Compute Gallery and use customer-managed keys to encrypt the disks. The syntax is the same as creating a [generalized](vm-generalized-image-version.md) or [specialized](vm-specialized-image-version.md) VM from an image. Use the extended parameter set and add `Set-AzVMOSDisk -Name $($vmName +"_OSDisk") -DiskEncryptionSetId $diskEncryptionSet.Id -CreateOption FromImage` to the VM configuration.

For data disks, add the `-DiskEncryptionSetId $setID` parameter when you use [Add-AzVMDataDisk](/powershell/module/az.compute/add-azvmdatadisk).


## CLI 

To specify a disk encryption set for an image version, use [az image gallery create-image-version](/cli/azure/sig/image-version#az-sig-image-version-create) with the `--target-region-encryption` parameter. The format for `--target-region-encryption` is a comma-separated list of keys for encrypting the OS and data disks. It should look like this: `<encryption set for the OS disk>,<Lun number of the data disk>,<encryption set for the data disk>,<Lun number for the second data disk>,<encryption set for the second data disk>`. 

If the source for the OS disk is a managed disk or a VM, use `--managed-image` to specify the source for the image version. In this example, the source is a managed image that has an OS disk and a data disk at LUN 0. The OS disk will be encrypted with DiskEncryptionSet1, and the data disk will be encrypted with DiskEncryptionSet2.

```azurecli-interactive
az sig image-version create \
   -g MyResourceGroup \
   --gallery-image-version 1.0.0 \
   --location westus \
   --target-regions westus=2=standard_lrs eastus2 \
   --target-region-encryption WestUSDiskEncryptionSet1,0,WestUSDiskEncryptionSet2 EastUS2DiskEncryptionSet1,0,EastUS2DiskEncryptionSet2 \
   --gallery-name MyGallery \
   --gallery-image-definition MyImage \
   --managed-image "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myImage"
```

If the source for the OS disk is a snapshot, use `--os-snapshot` to specify the OS disk. Add any other data disk snapshots that should also be part of the image version. Use `--data-snapshot-luns` to specify the LUN, and use `--data-snapshots` to specify the snapshots.

In this example, the sources are disk snapshots. There's an OS disk and a data disk at LUN 0. The OS disk will be encrypted with DiskEncryptionSet1, and the data disk will be encrypted with DiskEncryptionSet2.

```azurecli-interactive
az sig image-version create \
   -g MyResourceGroup \
   --gallery-image-version 1.0.0 \
   --location westus\
   --target-regions westus=2=standard_lrs eastus\
   --target-region-encryption WestUSDiskEncryptionSet1,0,WestUSDiskEncryptionSet2 EastUS2DiskEncryptionSet1,0,EastUS2DiskEncryptionSet2 \
   --os-snapshot "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/myOSSnapshot" \
   --data-snapshot-luns 0 \
   --data-snapshots "/subscriptions/<subscription ID>/resourceGroups/myResourceGroup/providers/Microsoft.Compute/snapshots/myDDSnapshot" \
   --gallery-name MyGallery \
   --gallery-image-definition MyImage 
   
```

### Create the VM

You can create a VM from an Azure Compute Gallery and use customer-managed keys to encrypt the disks. The syntax is the same as creating a [generalized](vm-generalized-image-version.md) or [specialized](vm-specialized-image-version.md) VM with the addition of the `--os-disk-encryption-set` parameter. For data disks, add `--data-disk-encryption-sets` with a space-delimited list of the disk encryption sets for the data disks.


## Portal

When you create your image version in the portal, you can use the **Encryption** tab to apply your storage encryption sets.

1. On the **Create an image version** page, select the **Encryption** tab.
2. In **Encryption type**, select **Encryption at-rest with a customer-managed key** or **Double encryption with platform-managed and customer-managed keys**. 
3. For each disk in the image, select an encryption set from the **Disk encryption set** drop-down list. 

### Create the VM

You can create a VM from an image version and use customer-managed keys to encrypt the disks. When you create the VM in the portal, on the **Disks** tab, select **Encryption at-rest with customer-managed keys** or **Double encryption with platform-managed and customer-managed keys** for **Encryption type**. You can then select the encryption set from the drop-down list.

## Next steps

Learn more about [server-side disk encryption](./disk-encryption.md).

For information about how to supply purchase plan information, see [Supply Azure Marketplace purchase plan information when creating images](marketplace-images.md).
