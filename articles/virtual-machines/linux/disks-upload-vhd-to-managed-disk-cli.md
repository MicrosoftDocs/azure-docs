---
title: Upload a vhd to Azure using Azure CLI
description: Learn how to upload a vhd to an Azure managed disk, using the Azure CLI.    
services: "virtual-machines-linux,storage"
author: roygara
ms.author: rogarana
ms.date: 02/11/2019
ms.topic: article
ms.service: virtual-machines-linux
ms.tgt_pltfrm: linux
ms.subservice: disks
---

# Upload a vhd to Azure - Azure CLI

This article explains how to upload a vhd file from your local machine directly to an Azure managed disk. Previously, you needed to follow a much more involved process that included staging your data in a storage account. Now, you can skip that altogether, and upload directly to a managed disk. Currently, this process is supported for standard HDD, standard SSD, and premium SSD managed disks. It is not supported for ultra SSDs yet.

## Pre-requisites

- Download the latest [preview version of AzCopy](../../storage/common/storage-use-azcopy-v10.md#download-and-install-azcopy).
- [Install the Azure CLI](/cli/azure/install-azure-cli).
- A vhd file, stored locally

## Create an empty managed disk

In order to upload your vhd to Azure, you'll need an empty managed disk that was created specifically for uploading a vhd into it.

This kind of managed disk has two unique states:

- ReadToUpload, which means the disk is ready to receive an upload but, no SAS has been generated.
- ActiveUpload, which means that the disk is ready to receive an upload and the SAS has been generated.

While in either of these states, the managed disk will be billed at [standard HDD pricing](https://azure.microsoft.com/en-us/pricing/details/managed-disks/), regardless of the actual type of disk. For example, a P10 will be billed as an S10. This will only be true so long as either of the upload states are currently set.

Create an empty standard HDD managed disk for uploading by specifying the **–for-upload** parameter in the [disk create](/cli/azure/disk#az-disk-create) cmdlet:

```azurecli-interactive
az disk create -n contosodisk2 -g contosoteam2 -l westus2 --for-upload --size-gb 128 --sku standard_lrs
```

If you would like to upload either a premium SSD or a standard SSD, replace **standard_lrs** with either **Premium_LRS** or **standardssd_lrs**. Ultra SSD is not yet supported.

Now that you've created an empty managed disk, you'll need a writeable SAS so that you can reference it as the destination for your upload.

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

## Upload vhd

With the SAS for your empty managed disk, you can now use that as the destination for your upload command.

Use AzCopy v10 to upload your local VHD file to a managed disk by specifying the SAS URI generated in step #2.

```
AzCopy.exe copy "c:\somewhere\mydisk.vhd" "sas-URI" --blob-type PageBlob
```

If your SAS expires during upload, and you haven't called `revoke-access` yet, you can get a new SAS to continue the upload using `grant-access`, again.

After the upload is complete and you no longer need to write any more data to the disk, revoke the SAS. This will change the state of the managed disk and allow you to attach the disk to a VM.

```azurecli-interactive
az disk revoke-access -n contosodisk2 -g contosoteam2
```

## Next steps

Now that you've successfully uploaded a vhd to a managed disk, you can attach your disk to a VM and begin using it.

To learn how to accomplish that, see our article on the subject: [Add a disk to a Linux VM](add-disk.md).