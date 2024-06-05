---
title: Upload a VHD to Azure or copy a disk across regions - Azure PowerShell
description: Learn how to upload a VHD to an Azure managed disk and copy a managed disk across regions, using Azure PowerShell, via direct upload.    
author: roygara
ms.author: rogarana
ms.date: 10/17/2023
ms.topic: how-to
ms.service: azure-disk-storage
ms.tgt_pltfrm: linux
ms.custom: references_regions, devx-track-azurepowershell
---

# Upload a VHD to Azure or copy a managed disk to another region - Azure PowerShell

**Applies to:** :heavy_check_mark: Windows VMs 

This article explains how to either upload a VHD from your local machine to an Azure managed disk or copy a managed disk to another region, using the Azure PowerShell module. The process of uploading a managed disk, also known as direct upload, enables you to upload a VHD up to 32 TiB in size directly into a managed disk. Currently, direct upload is supported for Ultra Disks, Premium SSD v2, Premium SSD, Standard SSD, and Standard HDD.

If you're providing a backup solution for IaaS VMs in Azure, you should use direct upload to restore customer backups to managed disks. When uploading a VHD from a source external to Azure, speeds depend on your local bandwidth. When uploading or copying from an Azure VM, your bandwidth would be the same as standard HDDs.

<a name='secure-uploads-with-azure-ad'></a>

## Secure uploads with Microsoft Entra ID

If you're using [Microsoft Entra ID](../../active-directory/fundamentals/active-directory-whatis.md) to control resource access, you can now use it to restrict uploading of Azure managed disks. This feature is available as a GA offering in all regions. When a user attempts to upload a disk, Azure validates the identity of the requesting user in Microsoft Entra ID, and confirms that user has the required permissions. At a higher level, a system administrator could set a policy at the Azure account or subscription level to ensure that a Microsoft Entra identity has the necessary permissions for uploading before allowing a disk or a disk snapshot to be uploaded. If you have any questions on securing uploads with Microsoft Entra ID, reach out to this email: azuredisks@microsoft .com

### Prerequisites
[!INCLUDE [disks-azure-ad-upload-download-prereqs](../../../includes/disks-azure-ad-upload-download-prereqs.md)]

### Restrictions
[!INCLUDE [disks-azure-ad-upload-download-restrictions](../../../includes/disks-azure-ad-upload-download-restrictions.md)]

### Assign RBAC role

To access managed disks secured with Microsoft Entra ID, the requesting user must have either the [Data Operator for Managed Disks](../../role-based-access-control/built-in-roles.md#data-operator-for-managed-disks) role, or a [custom role](../../role-based-access-control/custom-roles-powershell.md) with the following permissions: 

- **Microsoft.Compute/disks/download/action**
- **Microsoft.Compute/disks/upload/action**
- **Microsoft.Compute/snapshots/download/action**
- **Microsoft.Compute/snapshots/upload/action**

For detailed steps on assigning a role, see [Assign Azure roles using Azure PowerShell](../../role-based-access-control/role-assignments-powershell.md). To create or update a custom role, see [Create or update Azure custom roles using Azure PowerShell](../../role-based-access-control/custom-roles-powershell.md).

## Get started

There are two ways you can upload a VHD with the Azure PowerShell module: You can either use the [Add-AzVHD](/powershell/module/az.compute/add-azvhd) command, which will automate most of the process for you, or you can perform the upload manually with AzCopy.

For Premium SSDs, Standard SSDs, and Standard HDDs, you should generally use [Add-AzVHD](#use-add-azvhd). However, if you're uploading to an Ultra Disk, or a Premium SSD v2, or if you need to upload a VHD that is larger than 50 GiB, you must [upload the VHD or VHDX manually with AzCopy](#manual-upload). VHDs 50 GiB and larger upload faster using AzCopy and Add-AzVhd doesn't currently support uploading to an Ultra Disk or a Premium SSD v2.

For guidance on how to copy a managed disk from one region to another, see [Copy a managed disk](#copy-a-managed-disk).

## Use Add-AzVHD

### Prerequisites

- [Install the Azure PowerShell module](/powershell/azure/install-azure-powershell).
- A VHD [has been prepared for Azure](prepare-for-upload-vhd-image.md), stored locally.
    - On Windows: You don't need to convert your VHD to VHDx, convert it a fixed size, or resize it to include the 512-byte offset. `Add-AZVHD` performs these functions for you.
        - [Hyper-V](/windows-server/virtualization/hyper-v/hyper-v-technology-overview) must be enabled for Add-AzVHD to perform these functions.
    - On Linux: You must perform these actions manually. See [Resizing VHDs](../linux/create-upload-generic.md?branch=pr-en-us-185925) for details.

### Upload a VHD

### (Optional) Grant access to the disk

If Microsoft Entra ID is used to enforce upload restrictions on a subscription or at the account level, [Add-AzVHD](/powershell/module/az.compute/add-azvhd) only succeeds if attempted by a user that has the [appropriate RBAC role or necessary permissions](#assign-rbac-role). You'll need to [assign RBAC permissions](../../role-based-access-control/role-assignments-powershell.md) to grant access to the disk and generate a writeable SAS.

```azurepowershell
New-AzRoleAssignment -SignInName <emailOrUserprincipalname> `
-RoleDefinitionName "Data Operator for Managed Disks" `
-Scope /subscriptions/<subscriptionId>
```

### Use Add-AzVHD

The following example uploads a VHD from your local machine to a new Azure managed disk using [Add-AzVHD](/powershell/module/az.compute/add-azvhd). Replace `<your-filepath-here>`, `<your-resource-group-name>`,`<desired-region>`, and `<desired-managed-disk-name>` with your parameters:

> [!NOTE]
> If you're using Microsoft Entra ID to enforce upload restrictions, add `DataAccessAuthMode 'AzureActiveDirectory'` to the end of your `Add-AzVhd` command.

```azurepowershell
# Required parameters
$path = <your-filepath-here>.vhd
$resourceGroup = <your-resource-group-name>
$location = <desired-region>
$name = <desired-managed-disk-name>

# Optional parameters
# $Zone = <desired-zone>
# $sku=<desired-SKU>
# -DataAccessAuthMode 'AzureActiveDirectory'
# -DiskHyperVGeneration = V1 or V2. This applies only to OS disks.

# To use $Zone or #sku, add -Zone or -DiskSKU parameters to the command
Add-AzVhd -LocalFilePath $path -ResourceGroupName $resourceGroup -Location $location -DiskName $name
```

## Manual upload

### Prerequisites

- Download the latest [version of AzCopy v10](../../storage/common/storage-use-azcopy-v10.md#download-and-install-azcopy).
- [Install the Azure PowerShell module](/powershell/azure/install-azure-powershell).
- A fixed size VHD that [has been prepared for Azure](prepare-for-upload-vhd-image.md), stored locally.

To upload your VHD to Azure, you'll need to create an empty managed disk that is configured for this upload process. Before you create one, there's some additional information you should know about these disks.

This kind of managed disk has two unique states:

- ReadyToUpload, which means the disk is ready to receive an upload but, no [secure access signature](../../storage/common/storage-sas-overview.md) (SAS) has been generated.
- ActiveUpload, which means that the disk is ready to receive an upload and the SAS has been generated.

> [!NOTE]
> While in either of these states, the managed disk will be billed at [standard HDD pricing](https://azure.microsoft.com/pricing/details/managed-disks/), regardless of the actual type of disk. For example, a P10 will be billed as an S10. This will be true until `revoke-access` is called on the managed disk, which is required in order to attach the disk to a VM.

### Create an empty managed disk

Before you can create an empty standard HDD for uploading, you'll need the file size of the VHD you want to upload, in bytes. The example code will get that for you but, to do it yourself you can use: `$vhdSizeBytes = (Get-Item "<fullFilePathHere>").length`. This value is used when specifying the **-UploadSizeInBytes** parameter.

Now, on your local shell, create an empty standard HDD for uploading by specifying the **Upload** setting in the **-CreateOption** parameter as well as the **-UploadSizeInBytes** parameter in the [New-AzDiskConfig](/powershell/module/az.compute/new-azdiskconfig) cmdlet. Then call [New-AzDisk](/powershell/module/az.compute/new-azdisk) to create the disk.

Replace `<yourdiskname>`, `<yourresourcegroupname>`, and `<yourregion>` then run the following commands:

> [!IMPORTANT]
> If you're creating an OS disk, add `-HyperVGeneration '<yourGeneration>'` to `New-AzDiskConfig`.
> 
> If you're using Microsoft Entra ID to secure your uploads, add `-dataAccessAuthMode 'AzureActiveDirectory'` to `New-AzDiskConfig`.  
> When uploading to an Ultra Disk or Premium SSD v2 you need to select the correct sector size of the target disk. If you're using a VHDX file with a 4k logical sector size, the target disk must be set to 4k. If you're using a VHD file with a 512 logical sector size, the target disk must be set to 512.
>
> VHDX files with logical sector size of 512k aren't supported.

```powershell
$vhdSizeBytes = (Get-Item "<fullFilePathHere>").length

## For Ultra Disks or Premium SSD v2, add -LogicalSectorSize and specify either 4096 or 512, depending on if you're using a VHDX or a VHD

$diskconfig = New-AzDiskConfig -SkuName 'Standard_LRS' -OsType 'Windows' -UploadSizeInBytes $vhdSizeBytes -Location '<yourregion>' -CreateOption 'Upload'

New-AzDisk -ResourceGroupName '<yourresourcegroupname>' -DiskName '<yourdiskname>' -Disk $diskconfig
```

If you would like to upload a different disk type, replace **Standard_LRS** with **Premium_LRS**, **Premium_ZRS**, **StandardSSD_ZRS**, **StandardSSD_LRS**, or **UltraSSD_LRS**.

### Generate writeable SAS

Now that you've created an empty managed disk that is configured for the upload process, you can upload a VHD to it. To upload a VHD to the disk, you'll need a writeable SAS, so that you can reference it as the destination for your upload.

To generate a writable SAS of your empty managed disk, replace `<yourdiskname>`and `<yourresourcegroupname>`, then use the following commands:

```powershell
$diskSas = Grant-AzDiskAccess -ResourceGroupName '<yourresourcegroupname>' -DiskName '<yourdiskname>' -DurationInSecond 86400 -Access 'Write'

$disk = Get-AzDisk -ResourceGroupName '<yourresourcegroupname>' -DiskName '<yourdiskname>'
```

### Upload a VHD or VHDX

Now that you have a SAS for your empty managed disk, you can use it to set your managed disk as the destination for your upload command.

Use AzCopy v10 to upload your local VHD or VHDX file to a managed disk by specifying the SAS URI you generated.

This upload has the same throughput as the equivalent [standard HDD](../disks-types.md#standard-hdds). For example, if you have a size that equates to S4, you will have a throughput of up to 60 MiB/s. But, if you have a size that equates to S70, you will have a throughput of up to 500 MiB/s.

```
AzCopy.exe copy "c:\somewhere\mydisk.vhd" $diskSas.AccessSAS --blob-type PageBlob
```

After the upload is complete, and you no longer need to write any more data to the disk, revoke the SAS. Revoking the SAS will change the state of the managed disk and allow you to attach the disk to a VM.

Replace `<yourdiskname>`and `<yourresourcegroupname>`, then run the following command:

```powershell
Revoke-AzDiskAccess -ResourceGroupName '<yourresourcegroupname>' -DiskName '<yourdiskname>'
```

## Copy a managed disk

Direct upload also simplifies the process of copying a managed disk. You can either copy within the same region or copy your managed disk to another region.

The following script will do this for you, the process is similar to the steps described earlier, with some differences, since you're working with an existing disk.

> [!IMPORTANT]
> You must add an offset of 512 when you're providing the disk size in bytes of a managed disk from Azure. This is because Azure omits the footer when returning the disk size. The copy will fail if you don't do this. The following script already does this for you.

Replace the `<sourceResourceGroupHere>`, `<sourceDiskNameHere>`, `<targetDiskNameHere>`, `<targetResourceGroupHere>`, `<yourOSTypeHere>` and `<yourTargetLocationHere>` (an example of a location value would be uswest2) with your values, then run the following script in order to copy a managed disk.

> [!TIP]
> If you are creating an OS disk, add `-HyperVGeneration '<yourGeneration>'` to `New-AzDiskConfig`.

```powershell

$sourceRG = <sourceResourceGroupHere>
$sourceDiskName = <sourceDiskNameHere>
$targetDiskName = <targetDiskNameHere>
$targetRG = <targetResourceGroupHere>
$targetLocate = <yourTargetLocationHere>
$targetVmGeneration = "V1" # either V1 or V2
#Expected value for OS is either "Windows" or "Linux"
$targetOS = <yourOSTypeHere>

$sourceDisk = Get-AzDisk -ResourceGroupName $sourceRG -DiskName $sourceDiskName

# Adding the sizeInBytes with the 512 offset, and the -Upload flag
$targetDiskconfig = New-AzDiskConfig -SkuName 'Standard_LRS' -osType $targetOS -UploadSizeInBytes $($sourceDisk.DiskSizeBytes+512) -Location $targetLocate -CreateOption 'Upload' -HyperVGeneration $targetVmGeneration

$targetDisk = New-AzDisk -ResourceGroupName $targetRG -DiskName $targetDiskName -Disk $targetDiskconfig

$sourceDiskSas = Grant-AzDiskAccess -ResourceGroupName $sourceRG -DiskName $sourceDiskName -DurationInSecond 86400 -Access 'Read'

$targetDiskSas = Grant-AzDiskAccess -ResourceGroupName $targetRG -DiskName $targetDiskName -DurationInSecond 86400 -Access 'Write'

azcopy copy $sourceDiskSas.AccessSAS $targetDiskSas.AccessSAS --blob-type PageBlob

Revoke-AzDiskAccess -ResourceGroupName $sourceRG -DiskName $sourceDiskName

Revoke-AzDiskAccess -ResourceGroupName $targetRG -DiskName $targetDiskName 
```

## Next steps

Now that you've successfully uploaded a VHD to a managed disk, you can attach your disk to a VM and begin using it.

To learn how to attach a data disk to a VM, see our article on the subject: [Attach a data disk to a Windows VM with PowerShell](attach-disk-ps.md). To use the disk as the OS disk, see [Create a Windows VM from a specialized disk](create-vm-specialized.md#create-the-new-vm).

If you've additional questions, see the section on [uploading a managed disk](../faq-for-disks.yml#uploading-to-a-managed-disk) in the FAQ.
