---
title: Mount Azure File storage on Linux VMs by using SMB with Azure CLI 1.0 | Microsoft Docs
description: How to mount Azure File storage on Linux VMs using SMB
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

# Mount Azure File storage on Linux VMs by using SMB with Azure CLI 1.0

This article shows how to mount Azure File storage on a Linux VM by using the server message block (SMB) protocol. File storage offers file shares in the cloud via the standard SMB protocol. The requirements are:

* An [Azure account](https://azure.microsoft.com/pricing/free-trial/)
* [Secure Shell (SSH) public and private key files](virtual-machines-linux-mac-create-ssh-keys.md)

## CLI versions to use
You can complete the task by using one of the following command-line interface (CLI) versions:

* Azure CLI 1.0: The CLI for the classic and Azure Resource Manager deployment models. Learn about it in the "Quick commands" section.
* [Azure CLI 2.0 Preview](virtual-machines-linux-mount-azure-file-storage-on-linux-using-smb-nodejs.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json): The next-generation CLI for the Resource Manager deployment model.


## Quick commands

To accomplish the task quickly, follow the steps in this section. For more detailed information and context, begin at the ["Detailed walkthrough"](virtual-machines-linux-mount-azure-file-storage-on-linux-using-smb.md#detailed-walkthrough) section.

### Prerequisites
* A resource group
* An Azure Virtual Network
* A network security group with an SSH inbound
* A subnet
* An Azure Storage account
* Azure Storage account keys
* An Azure File storage share
* A Linux VM

Replace any examples with your own settings.

### Create a directory for the local mount

```bash
mkdir -p /mnt/mymountpoint
```

### Mount the File storage SMB share to the mountpoint

```bash
sudo mount -t cifs //myaccountname.file.core.windows.net/mysharename /mymountpoint -o vers=3.0,username=myaccountname,password=StorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777
```

### Persist the mount after a reboot
To do so, add the following line to the `/etc/fstab`:

```bash
//myaccountname.file.core.windows.net/mysharename /mymountpoint cifs vers=3.0,username=myaccountname,password=StorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777
```

## Detailed walkthrough

File storage offers file shares in the cloud that use the standard SMB protocol. With the latest release of File storage, you can also mount a file share from any OS that supports SMB 3.0. When you use an SMB mount on Linux, you get easy backups to a robust, permanent archiving storage location that is supported by an SLA.

Moving files from a VM to an SMB mount that's hosted on File storage is a great way to debug logs. That's because the same SMB share can be mounted locally to your Mac, Linux, or Windows workstation. SMB isn't the best solution for streaming Linux or application logs in real time, because the SMB protocol is not built to handle such heavy logging duties. A dedicated, unified logging layer tool such as Fluentd would be a better choice than SMB for collecting Linux and application logging output.

For this detailed walkthrough, we create the prerequisites needed to first create the File storage share, and then mount it via SMB on a Linux VM.

1. Create an Azure Storage account by using the following code:

    ```azurecli
    azure storage account create myStorageAccount \
    --sku-name lrs \
    --kind storage \
    -l westus \
    -g myResourceGroup
    ```

2. Show the Storage account keys.

    When you create a Storage account, the account keys are created in pairs so that they can be rotated without any service interruption. When you switch to the second key in the pair, you create a new key pair. New Storage account keys are always created in pairs, ensuring that you always have at least one unused storage key ready to switch to. To show the Storage account keys, use the following code:

    ```azurecli
    azure storage account keys list myStorageAccount \
    --resource-group myResourceGroup
    ```
3. Create the File storage share.

    The File storage share contains the SMB share. The quota is always expressed in gigabytes (GB). To create the File storage share, use the following code:

    ```azurecli
    azure storage share create mystorageshare \
    --quota 10 \
    --account-name myStorageAccount \
    --account-key nPOgPR<--snip-->4Q==
    ```

4. Create the mountpoint directory.

    You must create a local directory in the Linux file system to mount the SMB share to. Anything written or read from the local mount directory is forwarded to the SMB share that's hosted on File storage. To create the directory, use the following code:

    ```bash
    sudo mkdir -p /mnt/mymountdirectory
    ```

5. Mount the SMB share by using the following code:

    ```azurecli
    sudo mount -t cifs //myStorageAccount.file.core.windows.net/mystorageshare /mnt/mymountdirectory -o vers=3.0,username=myStorageAccount,password=myStorageAccountkey,dir_mode=0777,file_mode=0777
    ```

6. Persist the SMB mount through reboots.

    When you reboot the Linux VM, the mounted SMB share is unmounted during shutdown. To remount the SMB share on boot, you must add a line to the Linux /etc/fstab. Linux uses the fstab file to list the file systems that it needs to mount during the boot process. Adding the SMB share ensures that the File storage share is a permanently mounted file system for the Linux VM. Adding the File storage SMB share to a new VM is possible when you use cloud-init.

    ```bash
    //myaccountname.file.core.windows.net/mysharename /mymountpoint cifs vers=3.0,username=myaccountname,password=StorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777
    ```

## Next steps

- [Using cloud-init to customize a Linux VM during creation](virtual-machines-linux-using-cloud-init.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [Add a disk to a Linux VM](virtual-machines-linux-add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [Encrypt disks on a Linux VM by using the Azure CLI](virtual-machines-linux-encrypt-disks.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
