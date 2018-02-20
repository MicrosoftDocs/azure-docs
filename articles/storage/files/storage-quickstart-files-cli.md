---
title: Managing Azure file shares with Azure CLI
description: Learn to use the Azure CLI to manage Azure Files.
services: storage
documentationcenter: na
author: wmgries
manager: klaasl
editor: cynthn

ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 02/17/2018
ms.author: wgries
---

# Managing Azure file shares with the Azure CLI
This guide walks you through the basics of working with Azure file shares using Azure CLI. Learn how to: 
- Create a resource group and a storage account
- Create an Azure file share within the storage account 
- Create a directory within the share, and upload and download files to it
- Copy files between Azure file shares
- Work with share snapshots 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you decide to install and use the Azure CLI locally, this guide requires that you are running the Azure CLI version 2.0.4 or later. Run **az --version** to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

## Install jq
By default, the Azure CLI commands return JSON (JavaScript Object Notation), which is the de facto way of sending and receiving messages from REST APIs. To facilitate working with the JSON responses, this guide uses the jq package. The following sections show how to install this package for various platforms. 

> [!Note]  
> The jq package is preinstalled on the Azure CLI Cloud Shell.

### Install jq on Linux
The jq package can be installed using the package manager on the Linux distribution of your choice.

On **Ubuntu** and **Debian-based** distributions, use the `apt-get` package manager:

```bash
sudo apt-get install jq
```

On **Red Hat Enterprise Linux** and **CentOS**, use the `yum` package manager:

```bash
sudo yum install jq
```

On **openSUSE** and **SUSE Linux Enterprise Server**:

```bash
sudo zypper install jq
```

### Install jq on macOS
The preferred way to install jq on macOS is using the Homebrew package management system. If you don't already have Homebrew installed, you can install Homebrew by following the [instructions from the Homebrew project](https://brew.sh/). You can install jq with the following command:

```bash
brew install jq
```

Alternatively, you can install jq by downloading the binary from [the jq project](https://stedolan.github.io/jq/download/#os_x).

### Install jq on Windows
The preferred way to install jq on Windows is using the Chocolately package management system. If you don't already have Chocolately installed, you can install Chocolately by following the [instructions from the Chocolately project](https://chocolatey.org/install). You can install jq with the following command:

```
chocolatey install jq
```

Alternatively, you can opt to use the [Windows Subsystem for Linux](https://docs.microsoft.com/windows/wsl/install-win10). If you choose this installation method, follow the instructions for Linux above. This installation is only available for Windows 10.

> [!Note]  
> If you install jq in a Linux distribution on Windows using the Windows Subsystem for Linux, you should also install the Azure CLI there as well.

## Create a resource group
A resource group is a logical container into which Azure resources are deployed and managed. If you don't already have an Azure resource group, you can create a new one with the [az group create](/cli/azure/group#create) command. 

The following example creates a resource group named *myResourceGroup* in the *eastus* location.

```azurecli-interactive 
az group create --name myResourceGroup --location eastus
```

## Create a storage account
A storage account is a shared pool of storage in which you can deploy Azure file share, or other storage resources such as blobs or queues. A storage account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account.

If you don't already have an existing storage account, you can create a new one using the [az storage account create](/cli/azure/storage/account#create) command. This example creates a storage account named `mystorageaccount<random number>` and puts the name of that storage account in the variable `$STORAGEACCT`. Storage account names must be unique, so we use `$RANDOM` to append a pseudorandom number to the end to make it unique. 

```azurecli-interactive 
STORAGEACCT=$(az storage account create \
    --resource-group "myResourceGroup" \
    --name "mystorageaccount$RANDOM" \
    --location eastus \
    --sku Standard_LRS | \
jq ".name" | \
tr -d '"')
```

### Get the storage account key
Storage account keys are used to control access to resources in a storage account. They are automatically created when you create a storage account. View the storage account keys using [az storage account keys list](/cli/azure/storage/account/keys#list). This example displays the storage account keys for *mystorageaccount* in table format.

```azurecli-interactive 
STORAGEKEY=$(az storage account keys list \
    --resource-group "myResourceGroup" \
    --account-name $STORAGEACCT | \
jq ".[0].value" | \
tr -d '"')
```

## Create an Azure file share
Now you can create your first Azure file share. You can create file shares using [az storage share create](/cli/azure/storage/share#create) command. This example creates a share named `myshare`. 

```azurecli-interactive
az storage share create \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --name "myshare" 
```

> [!Important]  
> Share names need to be all lower case letters, numbers, and single hyphens but cannot start with a hyphen. For complete details about naming file shares and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

## Manipulating the contents of the Azure file share
Now that you have created an Azure file share, you can mount the file share with SMB on [Windows](storage-how-to-use-files-windows.md), [Linux](storage-how-to-use-files-linux.md), or [macOS](storage-how-to-use-files-mac.md). Alternatively, you can manipulate your Azure file share with the Azure CLI. This is advantageous over mounting the file share with SMB, because all requests made with the Azure CLI are made with the File REST API enabling you to create, modify, and delete files and directories in your file share from:

- The Bash Cloud Shell (which cannot mount file shares over SMB).
- Clients which cannot mount SMB shares, such as on-premises clients which do not have port 445 unblocked.
- Serverless scenarios, such as in [Azure Functions](../../azure-functions/functions-overview.md). 

### Create directory
To create a new directory named *myDirectory* at the root of your Azure file share, use the [`az storage directory create`](/cli/azure/storage/directory#az_storage_directory_create) command.

```azurecli-interactive
az storage directory create \
   --account-name $STORAGEACCT \
   --account-key $STORAGEKEY \
   --share-name "myshare" \
   --name "myDirectory" 
```

### Upload a file
To demonstrate how to upload a file using the [`az storage file upload`](/cli/azure/storage/file#az_storage_file_upload) command, we first need to create a file inside your Azure CLI Cloud Shell's scratch drive to upload. The following commands will create and then upload the file.

```azurecli-interactive
date > ~/clouddrive/SampleUpload.txt

az storage file upload \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
	--share-name "myshare" \
	--source "~/clouddrive/SampleUpload.txt" \
    --path "myDirectory/SampleUpload.txt"
```

If you're running the Azure CLI locally, you should substitute `~/clouddrive` with a path that exists on your machine.

After uploading the file, you can use the [`az storage file list`](/cli/azure/storage/file#az_storage_file_list) command to check to make sure that the file was uploaded to your Azure file share.

```azurecli-interactive
az storage file list \
    --account-name $STORAGEACCT \
	--account-key $STORAGEKEY \
	--share-name "myshare" \
    --path "myDirectory" \
	--output table
```

### Download a file
You can use the [`az storage file download`](/cli/azure/storage/file#az_storage_file_download) command to download a copy of the file you just uploaded to the scratch drive of your Cloud Shell.

```azurecli-interactive
# Delete an existing file by the same name as SampleDownload.txt, if it exists because you've run this example before
rm -rf ~/clouddrive/SampleDownload.txt

az storage file download \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --share-name "myshare" \
    --path "myDirectory/SampleUpload.txt" \
    --dest "~/clouddrive/SampleDownload.txt"
```

### Copy files
One common task is to copy files from one file share to another file share, or to/from an Azure Blob storage container. To demonstrate this functionality, you can create a new share and copy the file you uploaded over to this new share using the [az storage file copy](/cli/azure/storage/file/copy) command. 

```azurecli-interactive
az storage share create \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --name "myshare2"

az storage directory create \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --share-name "myshare2" \
    --name "myDirectory2"

az storage file copy start \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --source-share "myshare" \
	--source-path "myDirectory/SampleUpload.txt" \
    --destination-share "myshare2" \
	--destination-path "myDirectory2/SampleCopy.txt"
```

Now, if you list the files in the new share, you should see your copied file.

```azurecli-interactive
az storage file list \
    --account-name $STORAGEACCT \
	--account-key $STORAGEKEY \
	--share-name "myshare2" \
	--output table
```

While the `az storage file copy start` command is convenient for ad-hoc file moves between Azure file shares and Azure Blob storage containers, we recommend AzCopy for larger moves (in terms of number or size of files being moved). Learn more about [AzCopy for Linux](../common/storage-use-azcopy-linux.md) and [AzCopy for Windows](../common/storage-use-azcopy.md). AzCopy must be installed locally - it is not available in Cloud Shell 

## Create and modify share snapshots (preview)
One additional useful task you can do with an Azure file share is to create share snapshots (preview). A snapshot preserves a point in time for an Azure file share. Share snapshots are similar to operating system technologies you may already be familiar with such as:
- [Logical Volume Manager (LVM)](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)#Basic_functionality) snapshots for Linux systems
- [Apple File System (APFS)](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/APFS_Guide/Features/Features.html) snapshots for macOS. 
- [Volume Shadow Copy Service (VSS)](https://docs.microsoft.com/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/ee923636) for Windows file systems such as NTFS and ReFS

You can create a share snapshot by using the [`az storage share snapshot`](/cli/azure/storage/share#az_storage_share_snapshot) command.

```azurecli-interactive
SNAPSHOT=$(az storage share snapshot \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --name "myshare" | \
    jq ".snapshot" |
    tr -d '"')
```

### Browse share snapshot contents
You can browse the contents of a share snapshot by passing the timestamp of the share snapshot we captured in the variable `$SNAPSHOT` to the `az storage file list` command.

```azurecli-interactive
az storage file list \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --share-name "myshare" \
    --snapshot $SNAPSHOT \
    --output table
```

### List share snapshots
You can see the list of snapshots you've taken for your share with the following command.

```azurecli-interactive
az storage share list \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --include-snapshot | \
jq '.[] | select(.name == "myshare") | select(.snapshot != null) | .snapshot' | \
tr -d '"'
```

### Restore from a share snapshot
You can restore a file by using the `az storage file copy start` command we used before. For the purposes of this quickstart, we'll first delete our `SampleUpload.txt` file we previously uploaded so we can restore it from the snapshot.

```azurecli-interactive
# Delete SampleUpload.txt
az storage file delete \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --share-name "myshare" \
    --path "myDirectory/SampleUpload.txt"

# Build the source URI for snapshot restore
URI=$(az storage account show \
    --resource-group "myResourceGroup" \
    --name $STORAGEACCT | \
    jq ".primaryEndpoints.file" | \
    tr -d '"')

URI=$URI"myshare/myDirectory/SampleUpload.txt?sharesnapshot="$SNAPSHOT

# Restore SampleUpload.txt from the share snapshot
az storage file copy start \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --source-uri $URI \
    --destination-share "myshare" \
    --destination-path "myDirectory/SampleUpload.txt"
```

### Delete a share snapshot
You can delete a share snapshot by using the [`az storage share delete`](/cli/azure/storage/share#az_storage_share_delete) command, with the variable containing the `$SNAPSHOT` reference to the `--snapshot` parameter.

```azurecli-interactive
az storage share delete \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY \
    --name "myshare" \
    --snapshot $SNAPSHOT
```

## Clean up resources
When you are done, you can use the [`az group delete`](/cli/azure/group#delete) command to remove the resource group and all related resources. 

```azurecli-interactive 
az group delete --name "myResourceGroup"
```

You can alternatively remove resources one by one:
- To remove the Azure file shares we created for this quickstart.  
```azurecli-interactive
az storage share list \
    --account-name $STORAGEACCT \
    --account-key $STORAGEKEY | 
jq ".[].name" | tr -d '"' |
while read SHARE
do 
    az storage share delete \
        --account-name $STORAGEACCT \
        --account-key $STORAGEKEY \
        --name $SHARE \
        --delete-snapshots include
done
```

- To remove the storage account itself (this will implicitly remove the Azure file shares we created as well as any other storage resources you may have created such as an Azure Blob storage container).  
```azurecli-interactive
az storage account delete \
    --resource-group "myResourceGroup" \
    --name $STORAGEACCT \
    --yes
```

## Next steps
- [Managing file shares with Azure PowerShell](storage-how-to-use-files-powershell.md)
- [Managing file shares with the Azure portal](storage-how-to-use-files-portal.md)
- [Planning for an Azure Files deployment](storage-files-planning.md)