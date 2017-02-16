---
title: Mount Azure File storage on Linux VMs by using SMB with Azure CLI 2.0 Preview | Microsoft Docs
description: How to mount Azure File storage on Linux VMs using SMB with Azure CLI 2.0 Preview
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
ms.date: 02/13/2017
ms.author: v-livech

---

# Mount Azure File storage on Linux VMs using SMB with Azure CLI 2.0 Preview

This article shows how to mount Azure File storage on a Linux VM by using the server message block (SMB) protocol. File storage offers file shares in the cloud via the standard SMB protocol. The requirements are:

* An [Azure account](https://azure.microsoft.com/pricing/free-trial/)
* [Secure Shell (SSH) public and private key files](virtual-machines-linux-mac-create-ssh-keys.md)

## CLI versions to use
You can complete the task using one of the following command-line interface (CLI) versions:

* Azure CLI 1.0: The CLI for the classic and Azure Resource Manager deployment models.
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

1. Create a resource group with [az group create](/cli/azure/group#create) to hold the file share.

    To create a resource group named `myResourceGroup` in the "West US" location, use the following example:

    ```azurecli
    az group create --name myResourceGroup --location westus
    ```

2. Create an Azure Storage account with [az storage account create](/cli/azure/storage/account#create) to store the actual files.

    To create a storage account named mystorageaccount by using the Standard_LRS storage SKU, use the following example:

    ```azurecli
    az storage account create --resource-group myResourceGroup \
        --name mystorageaccount \
        --location westus \
        --sku Standard_LRS
    ```

3. Show the Storage account keys.

    When you create a Storage account, the account keys are created in pairs so that they can be rotated without any service interruption. When you switch to the second key in the pair, you create a new key pair. New Storage account keys are always created in pairs, ensuring that you always have at least one unused Storage account key ready to switch to.

    View the Storage account keys with the [az storage account keys list](/cli/azure/storage/account/keys#list). The Storage account keys for the named `mystorageaccount` are listed in the following example:

    ```azurecli
    az storage account keys list --resource-group myResourceGroup \
        --account-name mystorageaccount
    ```

    To extract a single key, use the `--query` flag. The following example extracts the first key (`[0]`):

    ```azurecli
    az storage account keys list --resource-group myResourceGroup \
        --account-name mystorageaccount \
        --query '[0].{Key:value}' --output tsv
    ```

4. Create the File Storage share.

    The File storage share contains the SMB share with [az storage share create](/cli/azure/storage/share#create). The quota is always expressed in gigabytes (GB). Pass in one of the keys from the preceding `az storage account keys list` command. Create a share named mystorageshare with a 10-GB quota by using the following example:

    ```azurecli
    az storage share create --name mystorageshare \
        --quota 10 \
        --account-name mystorageaccount \
        --account-key nPOgPR<--snip-->4Q==
    ```

5. Create a mountpoint directory.

    Create a local directory in the Linux file system to mount the SMB share to. Anything written or read from the local mount directory is forwarded to the SMB share that's hosted on File storage. To create a local directory at /mnt/mymountdirectory, use the following example:

    ```bash
    sudo mkdir -p /mnt/mymountdirectory
    ```

6. Mount the SMB share to the local directory.

    Provide your own storage account username and storage account key for the mount credentials as follows:

    ```azurecli
    sudo mount -t cifs //myStorageAccount.file.core.windows.net/mystorageshare /mnt/mymountdirectory -o vers=3.0,username=mystorageaccount,password=mystorageaccountkey,dir_mode=0777,file_mode=0777
    ```

7. Persist the SMB mount through reboots.

    When you reboot the Linux VM, the mounted SMB share is unmounted during shutdown. To remount the SMB share on boot, add a line to the Linux /etc/fstab. Linux uses the fstab file to list the file systems that it needs to mount during the boot process. Adding the SMB share ensures that the File storage share is a permanently mounted file system for the Linux VM. Adding the File storage SMB share to a new VM is possible when you use cloud-init.

    ```bash
    //myaccountname.file.core.windows.net/mysharename /mymountpoint cifs vers=3.0,username=myaccountname,password=StorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777
    ```

## Next steps

- [Using cloud-init to customize a Linux VM during creation](virtual-machines-linux-using-cloud-init.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [Add a disk to a Linux VM](virtual-machines-linux-add-disk.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
- [Encrypt disks on a Linux VM by using the Azure CLI](virtual-machines-linux-encrypt-disks.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json)
