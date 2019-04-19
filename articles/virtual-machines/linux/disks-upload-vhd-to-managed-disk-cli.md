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

# Getting Started - CLI 

This article explains how to upload a vhd file from your local machine to an Azure managed disk.

## Pre-requisites

Download the latest preview version of AzCopy:
- [Windows](https://aka.ms/downloadazcopy-v10-windows) (zip)
- [Linux](https://aka.ms/downloadazcopy-v10-linux) (tar)
- [MacOS](https://aka.ms/downloadazcopy-v10-mac) (zip)

- [Install the Azure CLI](/cli/azure/install-azure-cli).
- A vhd file, stored locally

## Create an empty managed disk

In order to upload your vhd to Azure, you'll need an empty managed disk with a special parameter that denotes it is meant for uploading.

Create an empty managed disk for upload by specifying –for-upload parameter in the [disk create](/cli/azure/disk/create) cmdlet:

```azurecli-interactive
az disk create -n contosodisk2 -g contosoteam2 -l westus2 --for-upload --size-gb 128 --sku standard_lrs
```
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


After the upload is complete, revoke the SAS, this will change the state of the managed disk and allow you to attach the disk to a VM.

```azurecli-interactive
az disk revoke-access -n contosodisk2 -g contosoteam2 
```

## Next steps

Now that you've successfully uploaded a vhd to a managed disk, you can attach your disk to a VM and begin using it.

To learn how to accomplish that, see our article on the subject: [Add a disk to a Linux VM](add-disk.md).