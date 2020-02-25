---
title: Quickstart for managing Azure file shares using the Azure CLI
description: Use this quickstart to learn how to use Azure CLI to manage Azure Files.
author: roygara
ms.service: storage
ms.topic: quickstart
ms.date: 10/26/2018
ms.author: rogarana
ms.subservice: files
#Customer intent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Create and manage Azure file shares using Azure CLI
This guide walks you through the basics of working with [Azure file shares](storage-files-introduction.md) with the Azure CLI. Azure file shares are just like other file shares, but stored in the cloud and backed by the Azure platform. Azure File shares support the industry standard SMB protocol and enable file sharing across multiple machines, applications, and instances. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you decide to install and use Azure CLI locally, for the steps in this article, you must be running Azure CLI version 2.0.4 or later. Run **az --version** to find your Azure CLI version. If you need to install or upgrade, see [Install Azure CLI 2.0](/cli/azure/install-azure-cli). 

By default, Azure CLI commands return JavaScript Object Notation (JSON). JSON is the standard way to send and receive messages from REST APIs. To facilitate working with JSON responses, some of the examples in this article use the *query* parameter on Azure CLI commands. This parameter uses the [JMESPath query language](http://jmespath.org/) to parse JSON. To learn more about how to use the results of Azure CLI commands by following the JMESPath query language, see the [JMESPath tutorial](http://jmespath.org/tutorial.html).

## Create a resource group
A resource group is a logical container in which Azure resources are deployed and managed. If you don't already have an Azure resource group, you can use the [az group create](/cli/azure/group) command to create one. 

The following example creates a resource group named *myResourceGroup* in the *West US 2* location:

```azurecli-interactive 
export resourceGroupName="myResourceGroup"
region="westus2"

az group create \
    --name $resourceGroupName \
    --location $region \
    --output none
```

## Create a storage account
A storage account is a shared pool of storage in which you can deploy Azure file shares or other storage resources, such as blobs or queues. A storage account can contain an unlimited number of file shares. A share can store an unlimited number of files, up to the capacity limits of the storage account.

The following example creates a storage account using the [az storage account create](/cli/azure/storage/account) command. Storage account names must be unique, so use `$RANDOM` to append a number to the name to make it unique.

```azurecli-interactive 
export storageAccountName="mystorageacct$RANDOM"

az storage account create \
    --resource-group $resourceGroupName \
    --name $storageAccountName \
    --location $region \
    --kind StorageV2 \
    --sku Standard_LRS \
    --enable-large-file-share \
    --output none
```

> [!Note]  
> Shares greater than 5 TiB (up to a maximum of 100 TiB per share) are only available in locally redundant (LRS) and zone redundant (ZRS) storage accounts. To create a geo-redundant (GRS) or geo-zone-redundant (GZRS) storage account, remove the `--enable-large-file-share` parameter.

### Get the storage account key
Storage account keys control access to resources in a storage account. The keys are automatically created when you create a storage account. You can get the storage account keys for your storage account by using the [az storage account keys list](/cli/azure/storage/account/keys) command: 

```azurecli-interactive 
export storageAccountKey=$(az storage account keys list \
    --resource-group $resourceGroupName \
    --account-name $storageAccountName \
    --query "[0].value" | tr -d '"')
```

## Create an Azure file share
Now, you can create your first Azure file share. Create file shares by using the [az storage share create](/cli/azure/storage/share) command. This example creates an Azure file share named *myshare*: 

```azurecli-interactive
shareName="myshare"

az storage share create \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --name $shareName \
    --quota 1024 \
    --output none
```

Share names can contain only lowercase letters, numbers, and single hyphens (but they can't start with a hyphen). For complete details about naming file shares and files, see [Naming and referencing shares, directories, files, and metadata](https://docs.microsoft.com/rest/api/storageservices/Naming-and-Referencing-Shares--Directories--Files--and-Metadata).

## Use your Azure file share
Azure Files provides two methods of working with files and folders within your Azure file share: the industry standard [Server Message Block (SMB) protocol](https://msdn.microsoft.com/library/windows/desktop/aa365233.aspx) and the [File REST protocol](https://docs.microsoft.com/rest/api/storageservices/file-service-rest-api). 

To mount a file share with SMB, see the following document based on your OS:
- [Linux](storage-how-to-use-files-linux.md)
- [macOS](storage-how-to-use-files-mac.md)
- [Windows](storage-how-to-use-files-windows.md)

### Using an Azure file share with the File REST protocol 
It is possible work directly with the File REST protocol directly (handcrafting REST HTTP calls yourself), but the most common way to use the File REST protocol is to use the Azure CLI, the [Azure PowerShell module](storage-how-to-use-files-powershell.md), or an Azure Storage SDK, all of which provide a nice wrapper around the File REST protocol in the scripting/programming language of your choice.  

We expect most uses of Azure Files will want to work with their Azure file share over the SMB protocol, as this allows them to use the existing applications and tools they expect to be able to use, but there are several reasons why it is advantageous to use the File REST API rather than SMB, such as:

- You are browsing your file share from the Azure Bash Cloud Shell (which cannot mount file shares over SMB).
- You are taking advantage of serverless resources, such as [Azure Functions](../../azure-functions/functions-overview.md). 
- You are creating a value-add service that will interact with many Azure file shares, such as performing backup or antivirus scans.

The following examples show how to use the Azure CLI to manipulate your Azure file share with the File REST protocol. 

### Create a directory
To create a new directory named *myDirectory* at the root of your Azure file share, use the [`az storage directory create`](/cli/azure/storage/directory) command:

```azurecli-interactive
az storage directory create \
   --account-name $storageAccountName \
   --account-key $storageAccountKey \
   --share-name $shareName \
   --name "myDirectory" \
   --output none
```

### Upload a file
To demonstrate how to upload a file by using the [`az storage file upload`](/cli/azure/storage/file) command, first create a file to upload on the Cloud Shell scratch drive. In the following example, you create and then upload the file:

```azurecli-interactive
cd ~/clouddrive/
date > SampleUpload.txt

az storage file upload \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --share-name $shareName \
    --source "SampleUpload.txt" \
    --path "myDirectory/SampleUpload.txt"
```

If you're running Azure CLI locally, substitute `~/clouddrive` with a path that exists on your machine.

After you upload the file, you can use the [`az storage file list`](/cli/azure/storage/file) command to make sure that the file was uploaded to your Azure file share:

```azurecli-interactive
az storage file list \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --share-name $shareName \
    --path "myDirectory" \
    --output table
```

### Download a file
You can use the [`az storage file download`](/cli/azure/storage/file) command to download a copy of the file that you uploaded to the Cloud Shell scratch drive:

```azurecli-interactive
# Delete an existing file by the same name as SampleDownload.txt, if it exists, because you've run this example before
rm -f SampleDownload.txt

az storage file download \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --share-name $shareName \
    --path "myDirectory/SampleUpload.txt" \
    --dest "SampleDownload.txt" \
    --output none
```

### Copy files
A common task is to copy files from one file share to another file share. To demonstrate this functionality, create a new share. Copy the file that you uploaded to this new share by using the [az storage file copy](/cli/azure/storage/file/copy) command: 

```azurecli-interactive
otherShareName="myshare2"

az storage share create \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --name $otherShareName \
    --quota 1024 \
    --output none

az storage directory create \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --share-name $otherShareName \
    --name "myDirectory2" \
    --output none

az storage file copy start \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --source-share $shareName \
    --source-path "myDirectory/SampleUpload.txt" \
    --destination-share $otherShareName \
    --destination-path "myDirectory2/SampleCopy.txt"
```

Now, if you list the files in the new share, you should see your copied file:

```azurecli-interactive
az storage file list \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --share-name $otherShareName \
    --path "myDirectory2" \
    --output table
```

While the `az storage file copy start` command is convenient for file moves between Azure file shares, for migrations and larger data movements, we recommend `rsync` on macOS and Linux and `robocopy` on Windows. `rsync` and `robocopy` use SMB to perform the data movements instead of the FileREST API.

## Create and manage share snapshots
Another useful task that you can do with an Azure file share is create share snapshots. A snapshot preserves a point-in-time copy of an Azure file share. Share snapshots are similar to some operating system technologies that you might already be familiar with:

- [Logical Volume Manager (LVM)](https://en.wikipedia.org/wiki/Logical_Volume_Manager_(Linux)#Basic_functionality) snapshots for Linux systems.
- [Apple File System (APFS)](https://developer.apple.com/library/content/documentation/FileManagement/Conceptual/APFS_Guide/Features/Features.html) snapshots for macOS.
- [Volume Shadow Copy Service (VSS)](https://docs.microsoft.com/windows/desktop/VSS/volume-shadow-copy-service-portal) for Windows file systems, such as NTFS and ReFS.
 
You can create a share snapshot by using the [`az storage share snapshot`](/cli/azure/storage/share) command:

```azurecli-interactive
snapshot=$(az storage share snapshot \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --name $shareName \
    --query "snapshot" | tr -d '"')
```

### Browse share snapshot contents
You can browse the contents of a share snapshot by passing the time stamp of the share snapshot that you captured in the `$snapshot` variable to the `az storage file list` command:

```azurecli-interactive
az storage file list \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --share-name $shareName \
    --snapshot $snapshot \
    --output table
```

### List share snapshots
To see the list of snapshots that you've taken for your share, use the following command:

```azurecli-interactive
az storage share list \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --include-snapshot \
    --query "[? name== '$shareName' && snapshot!=null].snapshot" \
    --output tsv
```

### Restore from a share snapshot
You can restore a file by using the `az storage file copy start` command that you used earlier. First, delete the SampleUpload.txt file that you uploaded, so you can restore it from the snapshot:

```azurecli-interactive
# Delete SampleUpload.txt
az storage file delete \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --share-name $shareName \
    --path "myDirectory/SampleUpload.txt" \
    --output none

# Build the source URI for a snapshot restore
URI=$(az storage account show \
    --resource-group $resourceGroupName \
    --name $storageAccountName \
    --query "primaryEndpoints.file" | tr -d '"')

URI=$URI$shareName"/myDirectory/SampleUpload.txt?sharesnapshot="$snapshot

# Restore SampleUpload.txt from the share snapshot
az storage file copy start \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --source-uri $URI \
    --destination-share $shareName \
    --destination-path "myDirectory/SampleUpload.txt"
```

### Delete a share snapshot
You can delete a share snapshot by using the [`az storage share delete`](/cli/azure/storage/share) command. Use the variable that contains the `$SNAPSHOT` reference to the `--snapshot` parameter:

```azurecli-interactive
az storage share delete \
    --account-name $storageAccountName \
    --account-key $storageAccountKey \
    --name $shareName \
    --snapshot $snapshot \
    --output none
```

## Clean up resources
When you are done, you can use the [`az group delete`](/cli/azure/group) command to remove the resource group and all related resources: 

```azurecli-interactive 
az group delete --name $resourceGroupName
```

Alternatively, you can remove resources individually.
- To remove the Azure file shares that you created for this article:

    ```azurecli-interactive
    az storage share list \
            --account-name $storageAccountName \
            --account-key $storageAccountKey \
            --query "[].name" \
            --output tsv | \
        xargs -L1 bash -ec '\
            az storage share delete \
                --account-name "$storageAccountName" \
                --account-key "$storageAccountKey" \
                --name $0 \
                --delete-snapshots include \
                --output none'
    ```

- To remove the storage account itself. (This implicitly removes the Azure file shares that you created, and any other storage resources that you might have created, such as an Azure Blob storage container.)

    ```azurecli-interactive
    az storage account delete \
        --resource-group $resourceGroupName \
        --name $storageAccountName \
        --yes
    ```

## Next steps
> [!div class="nextstepaction"]
> [What is Azure Files?](storage-files-introduction.md)