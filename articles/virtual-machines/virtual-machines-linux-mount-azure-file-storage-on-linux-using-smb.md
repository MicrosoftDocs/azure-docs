---
title: Mount Azure File Storage on Linux VMs using SMB | Microsoft Docs
description: How to mount Azure File Storage on Linux VMs using SMB.
services: virtual-machines-linux
documentationcenter: virtual-machines-linux
author: vlivech
manager: timlt
editor: ''

ms.assetid:
ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 12/07/2016
ms.author: v-livech

---

# Mount Azure File Storage on Linux VMs using SMB

This article shows how to utilize the Azure File Storage service on a Linux VM using a SMB mount.  Azure File storage offers file shares in the cloud using the standard SMB protocol.  The requirements are:

- [an Azure account](https://azure.microsoft.com/pricing/free-trial/)

- [SSH public and private key files](virtual-machines-linux-mac-create-ssh-keys.md)

- `azure config mode arm`

## Quick Commands

If you need to quickly accomplish the task, the following section details the  commands needed. More detailed information and context for each step can be found the rest of the document, [starting here]().

Pre-requirments: Resource Group, VNet, NSG with SSH inbound, Subnet, Azure  Storage Account, Azure File Storage share, and a Linux VM. Replace any examples with your own settings.

Create a directory for the local mount

```bash
mkdir -p /mnt/mymountpoint
```

Mount the Azure File Storage SMB share to the mountpoint

```bash
sudo mount -t cifs //myaccountname.file.core.windows.net/mysharename ./mymountpoint -o vers=3.0,username=myaccountname,password=StorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777
```

To persist the mount after a reboot, add a line to the `/etc/fstab`

```bash
//myaccountname.file.core.windows.net/mysharename /mymountpoint cifs vers=3.0,username=myaccountname,password=StorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777
```

## Detailed walkthrough

Azure File storage offers file shares in the cloud using the standard SMB protocol.  And with the latest release of File storage, you can also mount a file share from an on-premises application that supports SMB 3.0.  Using a SMB mount on Linux allows for easy backups to a robust, permanent archiving storage location that is supported by an SLA.  

Moving logs to a storage location outside of the VM, which may be short lived, using SMB can work.  For real-time log archiving or for large logging environments, a dedicated logging solution is recommended, not SMB.

For this detailed walkthrough we will create the pre-requirments needed to first create the Azure File Storage share and then mount it via SMB on a Linux VM.

## Create the Azure Storage account

```azurecli
azure storage account create mystorageaccount \
--sku-name lrs \
--kind storage \
-l westus \
-g bmwrg
```

## Show the Storage account keys

The Azure Storage Account keys are created in pairs, when the storage account is deployed.  The storage account keys are created in pairs so that the keys can be rotated without any service interruption.

```azurecli
azure storage account keys list mystorageaccount \
--resource-group myRG
```

## Create the Azure File Storage Share

Create the File Storage share which contains the SMB share.  The quota is always in GigaBytes (GBs).

```azurecli
azure storage share create mystorageshare \
--quota 10 \
--account-name mystorageaccount \
--account-key nPOgPR<--snip-->4Q==
```

## Create the mount point directory

```bash
sudo mkdir -p /mnt/mymountdirectory
```

## Mount the SMB share

```azurecli
sudo mount -t cifs //mystorageaccount.file.core.windows.net/mystorageshare /mnt/mymountdirectory -o vers=3.0,username=mystorageaccount,password=mystorageaccountkey,dir_mode=0777,file_mode=0777
```
