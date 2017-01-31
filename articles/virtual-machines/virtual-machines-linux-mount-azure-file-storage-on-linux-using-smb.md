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

This article shows how to utilize the Azure File Storage service on a Linux VM using an SMB mount.  Azure File storage offers file shares in the cloud using the standard SMB protocol.  The requirements are:

- [an Azure account](https://azure.microsoft.com/pricing/free-trial/)

- [SSH public and private key files](virtual-machines-linux-mac-create-ssh-keys.md)

## Quick Commands

If you need to quickly accomplish the task, the following section details the  commands needed. More detailed information and context for each step can be found the rest of the document, [starting here](virtual-machines-linux-mount-azure-file-storage-on-linux-using-smb.md#detailed-walkthrough).

Prerequisites: Resource Group, VNet, NSG with SSH inbound, Subnet, Azure Storage Account, Azure Storage Account keys, Azure File Storage share, and a Linux VM. Replace any examples with your own settings.

Create a directory for the local mount

```bash
mkdir -p /mnt/mymountpoint
```

Mount the Azure File Storage SMB share to the mountpoint

```bash
sudo mount -t cifs //myaccountname.file.core.windows.net/mysharename /mymountpoint -o vers=3.0,username=myaccountname,password=StorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777
```

To persist the mount after a reboot, add a line to the `/etc/fstab`

```bash
//myaccountname.file.core.windows.net/mysharename /mymountpoint cifs vers=3.0,username=myaccountname,password=StorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777
```

## Detailed walkthrough

Azure File storage offers file shares in the cloud using the standard SMB protocol.  And with the latest release of File storage, you can also mount a file share from any OS that supports SMB 3.0.  Using an SMB mount on Linux allows for easy backups to a robust, permanent archiving storage location that is supported by an SLA.  

Moving files from a VM to an SMB mount hosted on Azure File Storage is a great way to debug logs as that same SMB share can be locally mounted to your Mac, Linux, or Windows workstation.  SMB would not be the best solution to stream Linux or application logs in real time as the SMB protocol is not built for logging duties as heavy as that.  A dedicated unified logging layer tool like Fluentd would be a better choice over SMB to collect Linux and application logging output.

For this detailed walkthrough, we create the prerequisites needed to first create the Azure File Storage share, and then mount it via SMB on a Linux VM.

## Create the Azure Storage account

```azurecli
azure storage account create myStorageAccount \
--sku-name lrs \
--kind storage \
-l westus \
-g myResourceGroup
```

## Show the Storage account keys

The Azure Storage Account keys are created in pairs, when the storage account is created.  The storage account keys are created in pairs so that the keys can be rotated without any service interruption.  Once you rotate keys to the second key in the pair, you create a new key pair.  New storage account keys are always created in pairs, ensuring you always have at least one unused storage key ready to rotate to.

```azurecli
azure storage account keys list myStorageAccount \
--resource-group myResourceGroup
```

## Create the Azure File Storage Share

Create the File Storage share, which contains the SMB share.  The quota is always in GigaBytes (GBs).

```azurecli
azure storage share create mystorageshare \
--quota 10 \
--account-name myStorageAccount \
--account-key nPOgPR<--snip-->4Q==
```

## Create the mount point directory

A local directory is needed on the Linux filesystem to mount the SMB share to.  Anything written or read from the local mount directory is forwarded to the SMB share hosted on Azure File Storage.

```bash
sudo mkdir -p /mnt/mymountdirectory
```

## Mount the SMB share

```azurecli
sudo mount -t cifs //myStorageAccount.file.core.windows.net/mystorageshare /mnt/mymountdirectory -o vers=3.0,username=myStorageAccount,password=myStorageAccountkey,dir_mode=0777,file_mode=0777
```

## Persist the SMB mount through reboots

Once you reboot the Linux VM, the mounted SMB share is unmounted during shutdown.  To remount the SMB share on boot, you must add a line to the Linux `/etc/fstab`.  Linux uses the `fstab` file to list what filesystems it needs to mount during bootup.  Adding the SMB share ensures that the Azure File Storage share is a permanently mounted filesystem for the Linux VM.  Adding the Azure File Storage SMB share to a new VM is possible using `cloud-init`.

```bash
//myaccountname.file.core.windows.net/mysharename /mymountpoint cifs vers=3.0,username=myaccountname,password=StorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777
```

## Next Steps

- [Using cloud-init to customize a Linux VM during creation](virtual-machines-linux-using-cloud-init.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [Add a disk to a Linux VM](virtual-machines-linux-add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [Encrypt disks on a Linux VM using the Azure CLI](virtual-machines-linux-encrypt-disks.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
