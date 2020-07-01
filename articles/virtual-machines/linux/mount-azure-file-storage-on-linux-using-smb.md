---
title: Mount Azure File storage on Linux VMs using SMB 
description: How to mount Azure File storage on Linux VMs using SMB with the Azure CLI
author: cynthn
ms.service: virtual-machines-linux
ms.topic: how-to
ms.workload: infrastructure
ms.date: 06/28/2018
ms.author: cynthn
---

# Mount Azure File storage on Linux VMs using SMB

This article shows you how to use the Azure File storage service on a Linux VM using an SMB mount with the Azure CLI. Azure File storage offers file shares in the cloud using the standard SMB protocol. 

File storage offers file shares in the cloud that use the standard SMB protocol. You can mount a file share from any OS that supports SMB 3.0. When you use an SMB mount on Linux, you get easy backups to a robust, permanent archiving storage location that is supported by an SLA.

Moving files from a VM to an SMB mount that's hosted on File storage is a great way to debug logs. The same SMB share can be mounted locally to your Mac, Linux, or Windows workstation. SMB isn't the best solution for streaming Linux or application logs in real time, because the SMB protocol is not built to handle such heavy logging duties. A dedicated, unified logging layer tool such as Fluentd would be a better choice than SMB for collecting Linux and application logging output.

This guide requires that you're running the Azure CLI version 2.0.4 or later. Run **az --version** to find the version. If you need to install or upgrade, see [Install the Azure CLI](/cli/azure/install-azure-cli). 


## Create a resource group

Create a resource group named *myResourceGroup* in the *East US* location.

```azurecli
az group create --name myResourceGroup --location eastus
```

## Create a storage account

Create a new storage account, within the resource group that you created, using [az storage account create](/cli/azure/storage/account). This example creates a storage account named *mySTORAGEACCT\<random number>* and puts the name of that storage account in the variable **STORAGEACCT**. Storage account names must be unique, using `$RANDOM` appends a number to the end to make it unique.

```azurecli
STORAGEACCT=$(az storage account create \
    --resource-group "myResourceGroup" \
    --name "mystorageacct$RANDOM" \
    --location eastus \
    --sku Standard_LRS \
    --query "name" | tr -d '"')
```

## Get the storage key

When you create a storage account, the account keys are created in pairs so that they can be rotated without any service interruption. When you switch to the second key in the pair, you create a new key pair. New storage account keys are always created in pairs, so you always have at least one unused storage account key ready to switch to.

View the storage account keys using [az storage account keys list](/cli/azure/storage/account/keys). This example stores the value of key 1 in the **STORAGEKEY** variable.

```azurecli
STORAGEKEY=$(az storage account keys list \
    --resource-group "myResourceGroup" \
    --account-name $STORAGEACCT \
    --query "[0].value" | tr -d '"')
```

## Create a file share

Create the File storage share using [az storage share create](/cli/azure/storage/share). 

Share names need to be all lower case letters, numbers, and single hyphens but can't start with a hyphen. For complete details about naming file shares and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

This example creates a share named *myshare* with a 10-GiB quota. 

```azurecli
az storage share create --name myshare \
    --quota 10 \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY
```

## Create a mount point

To mount the Azure file share on your Linux computer, you need to make sure you have the **cifs-utils** package installed. For installation instructions, see [Install the cifs-utils package for your Linux distribution](../../storage/files/storage-how-to-use-files-linux.md#install-cifs-utils).

Azure Files uses SMB protocol, which communicates over TCP port 445.  If you're having trouble mounting your Azure file share, make sure your firewall is not blocking TCP port 445.


```bash
mkdir -p /mnt/MyAzureFileShare
```

## Mount the share

Mount the Azure file share to the local directory. 

```bash
sudo mount -t cifs //$STORAGEACCT.file.core.windows.net/myshare /mnt/MyAzureFileShare -o vers=3.0,username=$STORAGEACCT,password=$STORAGEKEY,dir_mode=0777,file_mode=0777,serverino
```

The above command uses the [mount](https://linux.die.net/man/8/mount) command to mount the Azure file share and options specific to [cifs](https://linux.die.net/man/8/mount.cifs). Specifically, the file_mode and dir_mode options set files and directories to permission `0777`. The `0777` permission gives read, write, and execute permissions to all users. You can change these permissions by replacing the values with other [chmod permissions](https://en.wikipedia.org/wiki/Chmod). You can also use other [cifs](https://linux.die.net/man/8/mount.cifs) options such as gid or uid. 


## Persist the mount

When you reboot the Linux VM, the mounted SMB share is unmounted during shutdown. To remount the SMB share on boot, add a line to the Linux /etc/fstab. Linux uses the fstab file to list the file systems that it needs to mount during the boot process. Adding the SMB share ensures that the File storage share is a permanently mounted file system for the Linux VM. Adding the File storage SMB share to a new VM is possible when you use cloud-init.

```bash
//myaccountname.file.core.windows.net/mystorageshare /mnt/mymountpoint cifs vers=3.0,username=mystorageaccount,password=myStorageAccountKeyEndingIn==,dir_mode=0777,file_mode=0777
```

For increased security in production environments, you should store your credentials outside of fstab.

## Next steps

- [Using cloud-init to customize a Linux VM during creation](using-cloud-init.md)
- [Add a disk to a Linux VM](add-disk.md)
- [Azure Disk Encryption for Linux VMs](disk-encryption-overview.md)

