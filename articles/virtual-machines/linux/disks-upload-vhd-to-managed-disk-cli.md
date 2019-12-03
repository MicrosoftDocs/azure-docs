---
title: Upload a vhd to Azure using Azure CLI
description: Learn how to upload a vhd to an Azure managed disk and copy a managed disk across regions, using the Azure CLI, via direct upload.
services: "virtual-machines-linux,storage"
author: roygara
ms.author: rogarana
ms.date: 09/20/2019
ms.topic: article
ms.service: virtual-machines-linux
ms.tgt_pltfrm: linux
ms.subservice: disks
---

# Upload a vhd to Azure using Azure CLI

This article explains how to upload a vhd from your local machine to an Azure managed disk. Previously, you had to follow a more involved process that included staging your data in a storage account, and managing that storage account. Now, you no longer need to manage a storage account, or stage data in it to upload a vhd. Instead, you create an empty managed disk, and upload a vhd directly to it. This simplifies uploading on-premises VMs to Azure and enables you to upload a vhd up to 32 TiB directly into a large managed disk.

If you are providing a backup solution for IaaS VMs in Azure, we recommend you use direct upload to restore customer backups to managed disks. If you are uploading a VHD from a machine external to Azure, speeds will depend on your local bandwidth. If you are using an Azure VM, then your bandwidth will be the same as standard HDDs.

Currently, direct upload is supported for standard HDD, standard SSD, and premium SSD managed disks. It is not yet supported for ultra SSDs.

## Prerequisites

- Download the latest [version of AzCopy v10](../../storage/common/storage-use-azcopy-v10.md#download-and-install-azcopy).
- [Install the Azure CLI](/cli/azure/install-azure-cli).
- A vhd file, stored locally
- If you intend to upload a vhd from on-premises: A vhd that [has been prepared for Azure](../windows/prepare-for-upload-vhd-image.md), stored locally.
- Or, a managed disk in Azure, if you intend to perform a copy action.

## Create an empty managed disk

To upload your vhd to Azure, you'll need to create an empty managed disk that is configured for this upload process. Before you create one, there's some additional information you should know about these disks.

This kind of managed disk has two unique states:

- ReadToUpload, which means the disk is ready to receive an upload but, no [secure access signature](https://docs.microsoft.com/azure/storage/common/storage-dotnet-shared-access-signature-part-1) (SAS) has been generated.
- ActiveUpload, which means that the disk is ready to receive an upload and the SAS has been generated.

While in either of these states, the managed disk will be billed at [standard HDD pricing](https://azure.microsoft.com/pricing/details/managed-disks/), regardless of the actual type of disk. For example, a P10 will be billed as an S10. This will be true until `revoke-access` is called on the managed disk, which is required in order to attach the disk to a VM.

Before you can create an empty standard HDD for uploading, you'll need to have the file size of the vhd you want to upload, in bytes. To get that, you can use either `wc -c <yourFileName>.vhd` or `ls -al <yourFileName>.vhd`. This value is used when specifying the **--upload-size-bytes** parameter.

Create an empty standard HDD for uploading by specifying both the **-–for-upload** parameter and the **--upload-size-bytes** parameter in a [disk create](/cli/azure/disk#az-disk-create) cmdlet:

```bash
az disk create -n mydiskname -g resourcegroupname -l westus2 --for-upload --upload-size-bytes 34359738880 --sku standard_lrs
```

If you would like to upload either a premium SSD or a standard SSD, replace **standard_lrs** with either **premium_LRS** or **standardssd_lrs**. Ultra SSD is not yet supported.

You have now created an empty managed disk that is configured for the upload process. To upload a vhd to the disk, you'll need a writeable SAS, so that you can reference it as the destination for your upload.

To generate a writable SAS of your empty managed disk, use the following command:

```bash
az disk grant-access -n mydiskname -g resourcegroupname --access-level Write --duration-in-seconds 86400
```

Sample returned value:

```
{
  "accessSas": "https://md-impexp-t0rdsfgsdfg4.blob.core.windows.net/w2c3mj0ksfgl/abcd?sv=2017-04-17&sr=b&si=600a9281-d39e-4cc3-91d2-923c4a696537&sig=xXaT6mFgf139ycT87CADyFxb%2BnPXBElYirYRlbnJZbs%3D"
}
```

## Upload vhd

Now that you have a SAS for your empty managed disk, you can use it to set your managed disk as the destination for your upload command.

Use AzCopy v10 to upload your local VHD file to a managed disk by specifying the SAS URI you generated.

This upload has the same throughput as the equivalent [standard HDD](disks-types.md#standard-hdd). For example, if you have a size that equates to S4, you will have a throughput of up to 60 MiB/s. But, if you have a size that equates to S70, you will have a throughput of up to 500 MiB/s.

```bash
AzCopy.exe copy "c:\somewhere\mydisk.vhd" "sas-URI" --blob-type PageBlob
```

If your SAS expires during upload, and you haven't called `revoke-access` yet, you can get a new SAS to continue the upload using `grant-access`, again.

After the upload is complete, and you no longer need to write any more data to the disk, revoke the SAS. Revoking the SAS will change the state of the managed disk and allow you to attach the disk to a VM.

```bash
az disk revoke-access -n mydiskname -g resourcegroupname
```

## Copy a managed disk

Direct upload also simplifies the process of copying a managed disk. You can either copy within the same region or cross-region (to another region).

The follow script will do this for you, the process is similar to the steps described earlier, with some differences since you're working with an existing disk.

> [!IMPORTANT]
> You need to add an offset of 512 when you're providing the disk size in bytes of a managed disk from Azure. This is because Azure omits the footer when returning the disk size. The copy will fail if you do not do this. The following script already does this for you.

Replace the `<sourceResourceGroupHere>`, `<sourceDiskNameHere>`, `<targetDiskNameHere>`, `<targetResourceGroupHere>`, and `<yourTargetLocationHere>` (an example of a location value would be uswest2) with your values, then run the following script in order to copy a managed disk.

```bash
sourceDiskName = <sourceDiskNameHere>
sourceRG = <sourceResourceGroupHere>
targetDiskName = <targetDiskNameHere>
targetRG = <targetResourceGroupHere>
targetLocale = <yourTargetLocationHere>

sourceDiskSizeBytes= $(az disk show -g $sourceRG -n $sourceDiskName --query '[uniqueId]' -o tsv)

az disk create -g $targetRG -n $targetDiskName -l $targetLocale --for-upload --upload-size-bytes $(($sourceDiskSizeBytes+512)) --sku standard_lrs

targetSASURI = $(az disk grant-access -n $targetDiskName -g $targetRG  --access-level Write --duration-in-seconds 86400 -o tsv)

sourceSASURI=$(az disk grant-access -n $sourceDiskName -g $sourceRG --duration-in-seconds 86400 --query [accessSas] -o tsv)

.\azcopy copy $sourceSASURI $targetSASURI --blob-type PageBlob

az disk revoke-access -n $sourceDiskName -g $sourceRG

az disk revoke-access -n $targetDiskName -g $targetRG
```

## Next steps

Now that you've successfully uploaded a vhd to a managed disk, you can attach the disk as a [data disk to an existing VM](add-disk.md) or [attach the disk to a VM as an OS disk](upload-vhd.md#create-the-vm), to create a new VM. 

