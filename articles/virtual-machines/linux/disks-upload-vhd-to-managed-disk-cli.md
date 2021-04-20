---
title: Upload a VHD to Azure or copy a disk across regions - Azure CLI
description: Learn how to upload a VHD to an Azure managed disk and copy a managed disk across regions, using the Azure CLI, via direct upload.
services: "virtual-machines,storage"
author: roygara
ms.author: rogarana
ms.date: 06/15/2020
ms.topic: how-to
ms.service: virtual-machines
ms.subservice: disks
---

# Upload a VHD to Azure or copy a managed disk to another region - Azure CLI

[!INCLUDE [disks-upload-vhd-to-disk-intro](../../../includes/disks-upload-vhd-to-disk-intro.md)]

## Prerequisites

- Download the latest [version of AzCopy v10](../../storage/common/storage-use-azcopy-v10.md#download-and-install-azcopy).
- [Install the Azure CLI](/cli/azure/install-azure-cli).
- If you intend to upload a VHD from on-premises: A fixed size VHD that [has been prepared for Azure](../windows/prepare-for-upload-vhd-image.md), stored locally.
- Or, a managed disk in Azure, if you intend to perform a copy action.

## Getting started

If you'd prefer to upload disks through a GUI, you can do so using Azure Storage Explorer. For details refer to: [Use Azure Storage Explorer to manage Azure managed disks](../disks-use-storage-explorer-managed-disks.md)

To upload your VHD to Azure, you'll need to create an empty managed disk that is configured for this upload process. Before you create one, there's some additional information you should know about these disks.

This kind of managed disk has two unique states:

- ReadToUpload, which means the disk is ready to receive an upload but, no [secure access signature](../../storage/common/storage-sas-overview.md) (SAS) has been generated.
- ActiveUpload, which means that the disk is ready to receive an upload and the SAS has been generated.

> [!NOTE]
> While in either of these states, the managed disk will be billed at [standard HDD pricing](https://azure.microsoft.com/pricing/details/managed-disks/), regardless of the actual type of disk. For example, a P10 will be billed as an S10. This will be true until `revoke-access` is called on the managed disk, which is required in order to attach the disk to a VM.

## Create an empty managed disk

Before you can create an empty standard HDD for uploading, you'll need the file size of the VHD you want to upload, in bytes. To get that, you can use either `wc -c <yourFileName>.vhd` or `ls -al <yourFileName>.vhd`. This value is used when specifying the **--upload-size-bytes** parameter.

Create an empty standard HDD for uploading by specifying both the **-–for-upload** parameter and the **--upload-size-bytes** parameter in a [disk create](/cli/azure/disk#az_disk_create) cmdlet:

Replace `<yourdiskname>`, `<yourresourcegroupname>`, `<yourregion>` with values of your choosing. The `--upload-size-bytes` parameter contains an example value of `34359738880`, replace it with a value appropriate for you.

> [!TIP]
> If you are creating an OS disk, add --hyper-v-generation <yourGeneration> to `az disk create`.

```azurecli
az disk create -n <yourdiskname> -g <yourresourcegroupname> -l <yourregion> --for-upload --upload-size-bytes 34359738880 --sku standard_lrs
```

If you would like to upload either a premium SSD or a standard SSD, replace **standard_lrs** with either **premium_LRS** or **standardssd_lrs**. Ultra disks are not supported for now.

Now that you've created an empty managed disk that is configured for the upload process, you can upload a VHD to it. To upload a VHD to the disk, you'll need a writeable SAS, so that you can reference it as the destination for your upload.

To generate a writable SAS of your empty managed disk, replace `<yourdiskname>`and `<yourresourcegroupname>`, then use the following command:

```azurecli
az disk grant-access -n <yourdiskname> -g <yourresourcegroupname> --access-level Write --duration-in-seconds 86400
```

Sample returned value:

```output
{
  "accessSas": "https://md-impexp-t0rdsfgsdfg4.blob.core.windows.net/w2c3mj0ksfgl/abcd?sv=2017-04-17&sr=b&si=600a9281-d39e-4cc3-91d2-923c4a696537&sig=xXaT6mFgf139ycT87CADyFxb%2BnPXBElYirYRlbnJZbs%3D"
}
```

## Upload a VHD

Now that you have a SAS for your empty managed disk, you can use it to set your managed disk as the destination for your upload command.

Use AzCopy v10 to upload your local VHD file to a managed disk by specifying the SAS URI you generated.

This upload has the same throughput as the equivalent [standard HDD](../disks-types.md#standard-hdd). For example, if you have a size that equates to S4, you will have a throughput of up to 60 MiB/s. But, if you have a size that equates to S70, you will have a throughput of up to 500 MiB/s.

```bash
AzCopy.exe copy "c:\somewhere\mydisk.vhd" "sas-URI" --blob-type PageBlob
```

After the upload is complete, and you no longer need to write any more data to the disk, revoke the SAS. Revoking the SAS will change the state of the managed disk and allow you to attach the disk to a VM.

Replace `<yourdiskname>`and `<yourresourcegroupname>`, then use the following command to make the disk usable:

```azurecli
az disk revoke-access -n <yourdiskname> -g <yourresourcegroupname>
```

## Copy a managed disk

Direct upload also simplifies the process of copying a managed disk. You can either copy within the same region or cross-region (to another region).

The follow script will do this for you, the process is similar to the steps described earlier, with some differences since you're working with an existing disk.

> [!IMPORTANT]
> You need to add an offset of 512 when you're providing the disk size in bytes of a managed disk from Azure. This is because Azure omits the footer when returning the disk size. The copy will fail if you do not do this. The following script already does this for you.

Replace the `<sourceResourceGroupHere>`, `<sourceDiskNameHere>`, `<targetDiskNameHere>`, `<targetResourceGroupHere>`, and `<yourTargetLocationHere>` (an example of a location value would be uswest2) with your values, then run the following script in order to copy a managed disk.

> [!TIP]
> If you are creating an OS disk, add --hyper-v-generation <yourGeneration> to `az disk create`.

```azurecli
sourceDiskName=<sourceDiskNameHere>
sourceRG=<sourceResourceGroupHere>
targetDiskName=<targetDiskNameHere>
targetRG=<targetResourceGroupHere>
targetLocation=<yourTargetLocationHere>

sourceDiskSizeBytes=$(az disk show -g $sourceRG -n $sourceDiskName --query '[diskSizeBytes]' -o tsv)

az disk create -g $targetRG -n $targetDiskName -l $targetLocation --for-upload --upload-size-bytes $(($sourceDiskSizeBytes+512)) --sku standard_lrs

targetSASURI=$(az disk grant-access -n $targetDiskName -g $targetRG  --access-level Write --duration-in-seconds 86400 -o tsv)

sourceSASURI=$(az disk grant-access -n $sourceDiskName -g $sourceRG --duration-in-seconds 86400 --query [accessSas] -o tsv)

.\azcopy copy $sourceSASURI $targetSASURI --blob-type PageBlob

az disk revoke-access -n $sourceDiskName -g $sourceRG

az disk revoke-access -n $targetDiskName -g $targetRG
```

## Next steps

Now that you've successfully uploaded a VHD to a managed disk, you can attach the disk as a [data disk to an existing VM](add-disk.md) or [attach the disk to a VM as an OS disk](upload-vhd.md#create-the-vm), to create a new VM.