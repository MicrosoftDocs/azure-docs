---
title: Upload a vhd to Azure
description: Learn how to upload a vhd to an Azure managed disk, using the Azure CLI.    
services: "virtual-machines-linux,storage"
author: roygara
ms.author: rogarana
ms.date: 05/06/2019
ms.topic: article
ms.service: virtual-machines-linux
ms.tgt_pltfrm: linux
ms.subservice: disks
---

# Upload a vhd to Azure

This article explains how to upload a vhd file from your local machine to an Azure managed disk. Previously, you had to follow a more involved process that included staging your data in a storage account and managing that storage account. Now, you no longer need to manage a storage account or stage data in it to upload a vhd. Instead, you create an empty managed disk and upload a vhd directly to it. This makes it much easier to upload on premises VMs to Azure and enables you to upload a vhd up to 32 TiB directly into a large managed disk.

If you are providing a backup solution for IaaS VMs in Azure, we recommend you use direct upload to restore customer backups to managed disks.

Currently, direct upload is supported for standard HDD, standard SSD, and premium SSD managed disks. It is not yet supported for ultra SSDs.

## Prerequisites

- Download the latest [preview version of AzCopy](../../storage/common/storage-use-azcopy-v10.md#download-and-install-azcopy).
- [Install the Azure CLI](/cli/azure/install-azure-cli).
- A vhd file, stored locally

### Create an empty managed disk

To upload your vhd to Azure, you'll need to create an empty managed disk specifically to receive an upload of a vhd.

This kind of managed disk has two unique states:

- ReadToUpload, which means the disk is ready to receive an upload but, no [secure access signature](https://docs.microsoft.com/en-us/azure/storage/common/storage-dotnet-shared-access-signature-part-1) (SAS) has been generated.
- ActiveUpload, which means that the disk is ready to receive an upload and the SAS has been generated.

While in either of these states, the managed disk will be billed at [standard HDD pricing](https://azure.microsoft.com/en-us/pricing/details/managed-disks/), regardless of the actual type of disk. For example, a P10 will be billed as an S10. This will be true until `revoke-access` is called on the managed disk, which is required in order to attach the disk to a VM.

Create an empty standard HDD for uploading by specifying the **–for-upload** parameter in the [disk create](/cli/azure/disk#az-disk-create) cmdlet:

```azurecli-interactive
az disk create -n contosodisk2 -g contosoteam2 -l westus2 --for-upload --size-gb 128 --sku standard_lrs
```

If you would like to upload either a premium SSD or a standard SSD, replace **standard_lrs** with either **premium_LRS** or **standardssd_lrs**. Ultra SSD is not yet supported.

Now that you've created an empty managed disk, you'll need a writeable SAS, so that you can reference it as the destination for your upload.

To generate a writable SAS of your empty managed disk, use the following command:

```azurecli-interactive
az disk grant-access -n contosodisk2 -g contosoteam2 --access-level Write --duration-in-seconds 86400
```

Sample returned value:

```
{
  "accessSas": "https://md-impexp-t0rdsfgsdfg4.blob.core.windows.net/w2c3mj0ksfgl/abcd?sv=2017-04-17&sr=b&si=600a9281-d39e-4cc3-91d2-923c4a696537&sig=xXaT6mFgf139ycT87CADyFxb%2BnPXBElYirYRlbnJZbs%3D"
}
```

### Upload vhd

Now that you have a SAS for your empty managed disk, you can use it to set your managed disk as the destination for your upload command.

Use AzCopy v10 to upload your local VHD file to a managed disk by specifying the SAS URI you generated.

This upload has the same throughput as the equivalent [standard HDD](disks-types.md#standard-hdd). For example, if you have a size which equates to S4, you will have a throughput of up to 60 MiB/s. But, if you have a size which equates to S70, you will have a throughput of up to 500 MiB/s.

```
AzCopy.exe copy "c:\somewhere\mydisk.vhd" "sas-URI" --blob-type PageBlob
```

If your SAS expires during upload, and you haven't called `revoke-access` yet, you can get a new SAS to continue the upload using `grant-access`, again.

After the upload is complete, and you no longer need to write any more data to the disk, revoke the SAS. Revoking the SAS will change the state of the managed disk and allow you to attach the disk to a VM.

```azurecli-interactive
az disk revoke-access -n contosodisk2 -g contosoteam2
```

### Next steps

Now that you've successfully uploaded a vhd to a managed disk, you can attach your disk to a VM and begin using it.

To learn how to attach a disk to a VM, see our article on the subject: [Add a disk to a Linux VM](add-disk.md).