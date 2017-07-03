---
title: Using the Azure CLI 2.0 with Azure Storage | Microsoft Docs
description: Learn how to use the Azure Command-Line Interface (Azure CLI) 2.0 with Azure Storage to create and manage storage accounts and work with Azure blobs and files. The Azure CLI 2.0 is a cross-platform tool written in Python.
services: storage
documentationcenter: na
author: mmacy
manager: timlt
editor: tysonn

ms.assetid:
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: azurecli
ms.topic: article
ms.date: 06/02/2017
ms.author: marsma

---
# Using the Azure CLI 2.0 with Azure Storage

The open-source, cross-platform Azure CLI 2.0 provides a set of commands for working with the Azure platform. It provides much of the same functionality found in the [Azure portal](https://portal.azure.com), including rich data access.

In this guide, we show you how to use the [Azure CLI 2.0](https://docs.microsoft.com/cli/azure/get-started-with-az-cli2) to perform several tasks working with resources in your Azure Storage account. We recommend that you download and install or upgrade to the latest version of the CLI 2.0 before using this guide.

The examples in the guide assume the use of the Bash shell on Ubuntu, but other platforms should perform similarly. 

[!INCLUDE [storage-cli-versions](../../includes/storage-cli-versions.md)]

## Prerequisites
This guide assumes that you understand the basic concepts of Azure Storage. It also assumes that you're able to satisfy the account creation requirements that are specified below for Azure and the Storage service.

### Accounts
* **Azure account**: If you don't already have an Azure subscription, [create a free Azure account](https://azure.microsoft.com/free/).
* **Storage account**: See [Create a storage account](../storage/storage-create-storage-account.md#create-a-storage-account) in [About Azure storage accounts](../storage/storage-create-storage-account.md).

### Install the Azure CLI 2.0

Download and install the Azure CLI 2.0 by following the instructions outlined in [Install Azure CLI 2.0](/cli/azure/install-az-cli2).

> [!TIP]
> If you have trouble with the installation, check out the [Installation Troubleshooting](/cli/azure/install-az-cli2#installation-troubleshooting) section of the article, and the [Install Troubleshooting](https://github.com/Azure/azure-cli/blob/master/doc/install_troubleshooting.md) guide on GitHub.
>

## Working with the CLI

Once you've installed the CLI, you can use the `az` command in your command-line interface (Bash, Terminal, Command Prompt) to access the Azure CLI commands. Type the `az` command to see a full list of the base commands (the following example output has been truncated):

```
     /\
    /  \    _____   _ _ __ ___
   / /\ \  |_  / | | | \'__/ _ \
  / ____ \  / /| |_| | | |  __/
 /_/    \_\/___|\__,_|_|  \___|


Welcome to the cool new Azure CLI!

Here are the base commands:

    account          : Manage subscriptions.
    acr              : Manage Azure container registries.
    acs              : Manage Azure Container Services.
    ad               : Synchronize on-premises directories and manage Azure Active Directory
                       resources.
    ...
```

In your command-line interface, execute the command `az storage --help` to list the `storage` command subgroups. The descriptions of the subgroups provide an overview of the functionality the Azure CLI provides for working with your storage resources.

```
Group
    az storage: Durable, highly available, and massively scalable cloud storage.

Subgroups:
    account  : Manage storage accounts.
    blob     : Object storage for unstructured data.
    container: Manage blob storage containers.
    cors     : Manage Storage service Cross-Origin Resource Sharing (CORS).
    directory: Manage file storage directories.
    entity   : Manage table storage entities.
    file     : File shares that use the standard SMB 3.0 protocol.
    logging  : Manage Storage service logging information.
    message  : Manage queue storage messages.
    metrics  : Manage Storage service metrics.
    queue    : Use queues to effectively scale applications according to traffic.
    share    : Manage file shares.
    table    : NoSQL key-value storage using semi-structured datasets.
```

## Connect the CLI to your Azure subscription

To work with the resources in your Azure subscription, you must first log in to your Azure account with `az login`. There are several ways you can log in:

* **Interactive login**: `az login`
* **Log in with user name and password**: `az login -u johndoe@contoso.com -p VerySecret`
  * This doesn't work with Microsoft accounts or accounts that use multi-factor authentication.
* **Log in with a service principal**: `az login --service-principal -u http://azure-cli-2016-08-05-14-31-15 -p VerySecret --tenant contoso.onmicrosoft.com`

## Azure CLI 2.0 sample script

Next, we'll work with a small shell script that issues a few basic Azure CLI 2.0 commands to interact with Azure Storage resources. The script first creates a new container in your storage account, then uploads an existing file (as a blob) to that container. It then lists all blobs in the container, and finally, downloads the file to a destination on your local computer that you specify.

```bash
#!/bin/bash
# A simple Azure Storage example script

export AZURE_STORAGE_ACCOUNT=<storage_account_name>
export AZURE_STORAGE_ACCESS_KEY=<storage_account_key>

export container_name=<container_name>
export blob_name=<blob_name>
export file_to_upload=<file_to_upload>
export destination_file=<destination_file>

echo "Creating the container..."
az storage container create --name $container_name

echo "Uploading the file..."
az storage blob upload --container-name $container_name --file $file_to_upload --name $blob_name

echo "Listing the blobs..."
az storage blob list --container-name $container_name --output table

echo "Downloading the file..."
az storage blob download --container-name $container_name --name $blob_name --file $destination_file --output table

echo "Done"
```

**Configure and run the script**

1. Open your favorite text editor, then copy and paste the preceding script into the editor.

2. Next, update the script's variables to reflect your configuration settings. Replace the following values as specified:

   * **\<storage_account_name\>** The name of your storage account.
   * **\<storage_account_key\>** The primary or secondary access key for your storage account.
   * **\<container_name\>** A name the new container to create, such as "azure-cli-sample-container".
   * **\<blob_name\>** A name for the destination blob in the container.
   * **\<file_to_upload\>** The path to small file on your local computer, such as "~/images/HelloWorld.png".
   * **\<destination_file\>** The destination file path, such as "~/downloadedImage.png".

3. After you've updated the necessary variables, save the script and exit your editor. The next steps assume you've named your script **my_storage_sample.sh**.

4. Mark the script as executable, if necessary: `chmod +x my_storage_sample.sh`

5. Execute the script. For example, in Bash: `./my_storage_sample.sh`

You should see output similar to the following, and the **\<destination_file\>** you specified in the script should appear on your local computer.

```
Creating the container...
{
  "created": true
}
Uploading the file...
Percent complete: %100.0
Listing the blobs...
Name       Blob Type      Length  Content Type              Last Modified
---------  -----------  --------  ------------------------  -------------------------
README.md  BlockBlob        6700  application/octet-stream  2017-05-12T20:54:59+00:00
Downloading the file...
Name
---------
README.md
Done
```

> [!TIP]
> The preceding output is in **table** format. You can specify which output format to use by specifying the `--output` argument in your CLI commands, or set it globally using `az configure`.
>

## Manage storage accounts

### Create a new storage account
To use Azure Storage, you need a storage account. You can create a new Azure Storage account after you've configured your computer to [connect to your subscription](#connect-to-your-azure-subscription).

```azurecli
az storage account create \
    --location <location> \
    --name <account_name> \
    --resource-group <resource_group> \
    --sku <account_sku>
```

* `--location` [Required]: Location. For example, "West US".
* `--name` [Required]: The storage account name. The name must be 3 to 24 characters in length, and use only lowercase alphanumeric characters.
* `--resource-group` [Required]: Name of resource group.
* `--sku` [Required]: The storage account SKU. Allowed values:
  * `Premium_LRS`
  * `Standard_GRS`
  * `Standard_LRS`
  * `Standard_RAGRS`
  * `Standard_ZRS`

### Set default Azure storage account environment variables
You can have multiple storage accounts in your Azure subscription. To select one of them to use for all subsequent storage commands, you can set these environment variables:

```azurecli
export AZURE_STORAGE_ACCOUNT=<account_name>
export AZURE_STORAGE_ACCESS_KEY=<key>
```

Another way to set a default storage account is by using a connection string. First, get the connection string with the `show-connection-string` command:

```azurecli
az storage account show-connection-string \
    --name <account_name> \
    --resource-group <resource_group>
```

Then copy the output connection string and set the `AZURE_STORAGE_CONNECTION_STRING` environment variable (you might need to enclose the connection string in quotes):

```azurecli
export AZURE_STORAGE_CONNECTION_STRING="<connection_string>"
```

> [!NOTE]
> All examples in the following sections of this article assume that you've set the `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_ACCESS_KEY` environment variables.
>

## Create and manage blobs
Azure Blob storage is a service for storing large amounts of unstructured data, such as text or binary data, that can be accessed from anywhere in the world via HTTP or HTTPS. This section assumes that you are already familiar with Azure Blob storage concepts. For detailed information, see [Get started with Azure Blob storage using .NET](storage-dotnet-how-to-use-blobs.md) and [Blob Service Concepts](/rest/api/storageservices/blob-service-concepts).

### Create a container
Every blob in Azure storage must be in a container. You can create a container by using the `az storage container create` command:

```azurecli
az storage container create --name <container_name>
```

You can set one of three levels of read access for a new container by specifying the optional  `--public-access` argument:

* `off` (default): Container data is private to the account owner.
* `blob`: Public read access for blobs.
* `container`: Public read and list access to the entire container.

For more information, see [Manage anonymous read access to containers and blobs](storage-manage-access-to-resources.md).

### Upload a blob to a container
Azure Blob storage supports block, append, and page blobs. Upload blobs to a container by using the `blob upload` command:

```azurecli
az storage blob upload \
    --file <local_file_path> \
    --container-name <container_name> \
    --name <blob_name>
```

 By default, the `blob upload` command uploads *.vhd files to page blobs, or block blobs otherwise. To specify another type when you upload a blob, you can use the `--type` argument--allowed values are `append`, `block`, and `page`.

 For more information on the different blob types, see [Understanding Block Blobs, Append Blobs, and Page Blobs](/rest/api/storageservices/Understanding-Block-Blobs--Append-Blobs--and-Page-Blobs).


### Download a blob from a container
This example demonstrates how to download a blob from a container:

```azurecli
az storage blob download \
    --container-name mycontainer \
    --name myblob.png \
    --file ~/mydownloadedblob.png
```

### List the blobs in a container

List the blobs in a container with the [az storage blob list](/cli/azure/storage/blob#list) command.

```azurecli
az storage blob list \
    --container-name mycontainer \
    --output table
```

### Copy blobs
You can copy blobs within or across storage accounts and regions asynchronously.

The following example demonstrates how to copy blobs from one storage account to another. We first create a container in the source storage account, specifying public read-access for its blobs. Next, we upload a file to the container, and finally, copy the blob from that container into a container in the destination storage account.

```azurecli
# Create container in source account
az storage container create \
    --account-name sourceaccountname \
    --account-key sourceaccountkey \
    --name sourcecontainer \
    --public-access blob

# Upload blob to container in source account
az storage blob upload \
    --account-name sourceaccountname \
    --account-key sourceaccountkey \
    --container-name sourcecontainer \
    --file ~/Pictures/sourcefile.png \
    --name sourcefile.png

# Copy blob from source account to destination account (destcontainer must exist)
az storage blob copy start \
    --account-name destaccountname \
    --account-key destaccountkey \
    --destination-blob destfile.png \
    --destination-container destcontainer \
    --source-uri https://sourceaccountname.blob.core.windows.net/sourcecontainer/sourcefile.png
```

In the above example, the destination container must already exist in the destination storage account for the copy operation to succeed. Additionally, the source blob specified in the `--source-uri` argument must either include a shared access signature (SAS) token, or be publicly accessible, as in this example.

### Delete a blob
To delete a blob, use the `blob delete` command:

```azurecli
az storage blob delete --container-name <container_name> --name <blob_name>
```

## Create and manage file shares
Azure File storage offers shared storage for applications using the Server Message Block (SMB) protocol. Microsoft Azure virtual machines and cloud services, as well as on-premises applications, can share file data via mounted shares. You can manage file shares and file data via the Azure CLI. For more information on Azure File storage, see [Get started with Azure File storage on Windows](storage-dotnet-how-to-use-files.md) or [How to use Azure File storage with Linux](storage-how-to-use-files-linux.md).

### Create a file share
An Azure File share is an SMB file share in Azure. All directories and files must be created in a file share. An account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account. The following example creates a file share named **myshare**.

```azurecli
az storage share create --name myshare
```

### Create a directory
A directory provides a hierarchical structure in an Azure file share. The following example creates a directory named **myDir** in the file share.

```azurecli
az storage directory create --name myDir --share-name myshare
```

A directory path can include multiple levels, for example **dir1/dir2**. However, you must ensure that all parent directories exist before creating a subdirectory. For example, for path **dir1/dir2**, you must first create directory **dir1**, then create directory **dir2**.

### Upload a local file to a share
The following example uploads a file from **~/temp/samplefile.txt** to root of the **myshare** file share. The `--source` argument specifies the existing local file to upload.

```azurecli
az storage file upload --share-name myshare --source ~/temp/samplefile.txt
```

As with directory creation, you can specify a directory path within the share to upload the file to an existing directory within the share:

```azurecli
az storage file upload --share-name myshare/myDir --source ~/temp/samplefile.txt
```

A file in the share can be up to 1 TB in size.

### List the files in a share
You can list files and directories in a share by using the `az storage file list` command:

```azurecli
# List the files in the root of a share
az storage file list --share-name myshare --output table

# List the files in a directory within a share
az storage file list --share-name myshare/myDir --output table

# List the files in a path within a share
az storage file list --share-name myshare --path myDir/mySubDir/MySubDir2 --output table
```

### Copy files		
You can copy a file to another file, a file to a blob, or a blob to a file. For example, to copy a file to a directory in a different share:		
		
```azurecli
az storage file copy start \
--source-share share1 --source-path dir1/file.txt \
--destination-share share2 --destination-path dir2/file.txt		
```

## Next steps
Here are some additional resources for learning more about working with the Azure CLI 2.0.

* [Get started with Azure CLI 2.0](https://docs.microsoft.com/cli/azure/get-started-with-az-cli2)
* [Azure CLI 2.0 command reference](/cli/azure)
* [Azure CLI 2.0 on GitHub](https://github.com/Azure/azure-cli)
