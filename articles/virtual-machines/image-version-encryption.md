---
title: Create an image version encrypted with your own keys 
description: Create a an image version in a Shared Image Gallery, using customer-managed encryption keys.
author: cynthn
ms.service: virtual-machines
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 05/01/2020
ms.author: cynthn
---

# Use customer-managed keys for encrypting images

Gallery images are stored as managed disks, so they are automatically encrypted using server-side encryption. Server-side encryption uses 256-bit [AES encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard), one of the strongest block ciphers available, and is FIPS 140-2 compliant. For more information about the cryptographic modules underlying Azure managed disks, see [Cryptography API: Next Generation](https://docs.microsoft.com/windows/desktop/seccng/cng-portal)

You can rely on platform-managed keys for the encryption of your images, or you can manage encryption using your own keys. If you choose to manage encryption with your own keys, you can specify a *customer-managed key* to use for encrypting and decrypting all disks in your images. 

Server-side encryption using customer-managed keys uses Azure Key Vault. You can either import [your RSA keys](../key-vault/keys/hsm-protected-keys.md) to your Key Vault or generate new RSA keys in Azure Key Vault.

To use customer managed keys for images, you first need an Azure Key Vault. You then create a disk encryption set. The disk encryption set is then used when creating you image versions.

For more information about creating and using disk encryption sets, see [Customer managed keys](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/disk-encryption#customer-managed-keys).

## Limitations

There are several limitations when using customer managed keys for encrypting shared image gallery images:	

- Encryption key sets must be in the same subscription and region as you image.

- You cannot share images that use customer managed keys. 

- You cannot replicate images that use customer managed keys to other regions.


## PowerShell

To specify a disk encryption set to for an image version, use  [New-AzGalleryImageDefinition](https://docs.microsoft.com/powershell/module/az.compute/new-azgalleryimageversion) with the `-TargetRegion` parameter. 

```azurepowershell-interactive

$sourceId = <ID of the image version source>

$osDiskImageEncryption = @{DiskEncryptionSetId='subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Compute/diskEncryptionSets/myDESet'}

$dataDiskImageEncryption1 = @{DiskEncryptionSetId='subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Compute/diskEncryptionSets/myDESet1';Lun=1}

$dataDiskImageEncryption2 = @{DiskEncryptionSetId='subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.Compute/diskEncryptionSets/myDESet2';Lun=2}

$dataDiskImageEncryptions = @($dataDiskImageEncryption1,$dataDiskImageEncryption2)

$encryption1 = @{OSDiskImage=$osDiskImageEncryption;DataDiskImages=$dataDiskImageEncryptions}

$region1 = @{Name='West US';ReplicaCount=1;StorageAccountType=Standard_LRS;Encryption=$encryption1}

$targetRegion = @{$region1}

# Create the VM
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

For more information, see [Create a Shared Image Gallery with Azure PowerShell](shared-images-powershell.md).

## CLI 

To specify a disk encryption set to for an image version, use  [az image gallery create-image-version](/cli/azure/sig/image-version#az-sig-image-version-create) with the `--target-region-encryption` parameter. The format for `--target-region-encryption` is a space-separated list of keys for encrypting the OS and data disks. It should look like this: `<encyption set for the OS disk>,<Lun number of the data disk>, <encryption set for the data disk>, <Lun number for the second data disk>, <encryption set for the second data disk>`. 

```azurecli-interactive
sourceId=<ID of the image version source>
az sig image-version create \
   -g MyResourceGroup \
   --gallery-image-version 1.0.0 \
   --target-regions westus=2=standard_lrs \
   --target-region-encryption DiskEncryptionSet1,0,DiskEncryptionSet2 \
   --gallery-name MyGallery \
   --gallery-image-definition MyImage \
   --managed-image $sourceId
```

For more information, see [Create a Shared Image Gallery with the Azure CLI](shared-images-cli.md).

## Portal

When you create your image version in the portal, you can use the **Encryption** tab to enter the information about your storage encryption sets.

1. In the **Create an image version** page, select the **Encryption** tab.
2. In **Encryption type**, select **Encryption at-rest with a customer-managed key**. 
3. For each disk in the image, select the **Disk encryption set** to use. 


## Next steps

Learn more about [server-side disk encryptio](/windows/disk-encryption.md)).
