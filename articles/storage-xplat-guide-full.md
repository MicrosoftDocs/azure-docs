<properties 
    pageTitle="Using Azure xplat-cli with Azure Storage" 
    description="Learn how to use Azure xplat-cli for Azure Storage" 
    services="storage" 
    documentationCenter="na" 
    authors="chunli,jiyang,yaxia" 
    manager="mingqxu"/>

<tags 
    ms.service="storage" 
    ms.workload="storage" 
    ms.tgt_pltfrm="na" 
    ms.devlang="na" 
    ms.topic="article" 
    ms.date="04/12/2015" 
    ms.author="chungli"/>

# Using Azure xplat-cli with Azure Storage 

## Overview

In this guide, we’ll explore how to use [Azure Cross-Platform Command-Line Interface (xplat-cli)](http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/) (xplat-cli in short) to perform a variety of development and administration tasks with Azure Storage.

Azure xplat-cli provides a set of open source, cross-platform commands for working with the Azure Platform. It provides much of the same functionality found in the Azure Management Portal as well as rich functionality of data access.

This guide assumes that you have prior experience using [Azure Storage](http://azure.microsoft.com/documentation/services/storage/). The guide provides a number of scripts to demonstrate the usage of xplat-cli with Azure Storage. You should update the script variables based on your configuration before running each script.

The first section in this guide provides a quick glance at Azure Storage and xplat-cli. For detailed information and instructions, start from the [Prerequisites for using Azure PowerShell with Azure Storage](#pre).

## Getting started with Azure Storage and xplat-cli in 5 minutes
This section shows you how to access Azure Storage via xplat-cli in 5 minutes. Note that xplat-cli can be installed and run on different platforms such as Windows, Linux and Mac. For this documentation, we take Ubuntu as an example but it should not be difficult to follow these steps in other OS platforms. 

**New to Azure:** Get a Microsoft Azure subscription and a Microsoft account associated with that subscription. For information on Azure purchase options, see [Free Trial](http://azure.microsoft.com/pricing/free-trial/), [Purchase Options](http://azure.microsoft.com/pricing/purchase-options/), and [Member Offers](http://azure.microsoft.com/pricing/member-offers/) (for members of MSDN, Microsoft Partner Network, and BizSpark, and other Microsoft programs). 

See [Manage Accounts, Subscriptions, and Administrative Roles](https://msdn.microsoft.com/library/azure/hh531793.aspx) for more information about Azure subscriptions.

**After creating a Microsoft Azure subscription and account:** 

1. Download and install Azure xplat-cli following [Install and Configure the Azure Cross-Platform Command-Line Interface](http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/#install).
2. Once the xplat-cli has been installed, you will be able to use the azure command from your command-line interface (Bash, Terminal, Command prompt) to access the xplat-cli commands. Type `azure` command and you should see the following output.

    ![Azure Command Output][Image1]

3. In the command line interface, type `azure storage` to list out all the azure storage commands and get a first impression of the functionalities xplat-cli provides. You can type command name with **-h** parameter (for example, `azure storage share create -h`) to see details of command syntax. 
4. Now, we’ll give you a simple script that shows basic xplat-cli commands to access Azure Storage. The script will first ask you to set two variables for your storage account and key. Then, the script will create a new container in this new storage account and upload an existing image file (blob) to that container. After the script lists all blobs in that container, it will download the image file to the destination directory which exists on the local computer.

		#!/bin/bash
		# A simple Azure storage example

		export AZURE_STORAGE_ACCOUNT=<storage_account_name>
		export AZURE_STORAGE_ACCESS_KEY=<storage_account_key>

		export container_name=<container_name>
		export blob_name=<blob_name>
		export image_to_upload=<image_to_upload>
		export destination_folder=<destination_folder>
			   
		echo "Creating the container..."       
		azure storage container create $container_name

		echo "Uploading the image..."       
		azure storage blob upload $image_to_upload $container_name $blob_name

		echo "Listing the blobs..."       
		azure storage blob list $container_name

		echo "Downloading the image..."       
		azure storage blob download $container_name $blob_name $destination_folder

		echo "Done"
     
5. In your local computer, open your preferred text editor (vim for example). Type the above script into your text editor.

6. Now, you need to update the script variables based on your configuration settings.
    
    - **<storage_account_name>** Use the given name in the script or enter a new name for your storage account. **Important:** The name of the storage account must be unique in Azure. It must be lowercase, too!

    - **<storage_account_key>** The access key of your storage account. 
      
    - **<container_name>** Use the given name in the script or enter a new name for your container.
    
    - **<image_to_upload>** Enter a path to a picture on your local computer, such as: "~/images/HelloWorld.png".
    
    - **<destination_folder>** Enter a path to a local directory to store files downloaded from Azure Storage, such as: “~/downloadImages”.

7. After you’ve updated the necessary variables in vim, press key combinations “Esc, : , wq!” to save the script. 

8. To run this script, simply type the script file name in the bash console. After this script runs, you should have a local destination folder that includes the downloaded image file. The following screenshot shows an example output:

After the script runs, you should have a local destination folder that includes the downloaded image file. 

> [AZURE.NOTE] The [Getting started with Azure Storage and xplat-cli in 5 minutes](#Getting) section provided a quick introduction on how to use Azure xplat-cli with Azure Storage. For detailed information and instructions, we encourage you to read the following sections.

## Prerequisites for using Azure xplat-cli with Azure Storage
You need an Azure subscription and account to run the xplat-cli commands given in this guide, as described above.

Azure xplat-cli is a command line interface that provides a full set of commands to manage Azure. For information on installing and setting up Azure xplat-cli, see [How to install and configure Azure xplat-cli](http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/#install). We recommend that you download and install or upgrade to the latest Azure xplat-cli before using this guide. 

## How to manage storage accounts in Azure

### How to connect to your Azure subscription
While most of the storage commands will work without an Azure subscription, we recommend you to connect to your subscription from xplat-cli. To configure the xplat-cli to work with your subscription, follow the steps in [How to connect to your Azure subscription](http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/#configure). 

### How to create a new Azure storage account
To use Azure storage, you will need a storage account. You can create a new Azure storage account after you have configured your computer to connect to your subscription. 

        azure storage account create <account_name>

> [AZURE.IMPORTANT] The name of your storage account must be unique within Azure and must be lowercase. For naming conventions and restrictions, see [About Azure Storage Accounts](storage-create-storage-account.md) and [REST API reference of Storage Account Create](https://msdn.microsoft.com/en-us/library/azure/hh264518.aspx).

### How to set a default Azure storage account in environment variables 
You can have multiple storage accounts in your subscription. You can choose one of them and set it in the environment variables for all the storage commands in the same session. This enables you to run the Azure xplat-cli storage commands without specifying the storage account and key explicitly. 

        export AZURE_STORAGE_ACCOUNT=<account_name>
        export AZURE_STORAGE_ACCESS_KEY=<key>

Another way to set a default storage account is using connection string. Firstly get the connection string by command:
        
        azure storage account connectionstring show <account_name>

Then copy the output connection string and set it to environment variable:

        export AZURE_STORAGE_CONNECTION_STRING=<connection_string>

## How to manage Azure blobs
Azure Blob storage is a service for storing large amounts of unstructured data, such as text or binary data, that can be accessed from anywhere in the world via HTTP or HTTPS. This section assumes that you are already familiar with the Azure Blob Storage Service concepts. For detailed information, see [How to use Blob Storage from .NET](storage-dotnet-how-to-use-blobs.md) and [Blob Service Concepts](http://msdn.microsoft.com/library/azure/dd179376.aspx).

### How to create a container
Every blob in Azure storage must be in a container. You can create a private container using the `azure storage container create` command:

        azure storage container create mycontainer

> [AZURE.NOTE] There are three levels of anonymous read access: **Off**, **Blob**, and **Container**. To prevent anonymous access to blobs, set the Permission parameter to **Off**. By default, the new container is private and can be accessed only by the account owner. To allow anonymous public read access to blob resources, but not to container metadata or to the list of blobs in the container, set the Permission parameter to **Blob**. To allow full public read access to blob resources, container metadata, and the list of blobs in the container, set the Permission parameter to **Container**. For more information, see [Manage Access to Azure Storage Resources](storage-manage-access-to-resources.md).

### How to upload a blob into a container
Azure Blob Storage supports block blobs and page blobs. For more information, see [Understanding Block Blobs and Page Blobs](http://msdn.microsoft.com/library/azure/ee691964.aspx).

To upload blobs in to a container, you can use the `azure storage blob upload`. By default, this command uploads the local files to a block blob. To specify the type for the blob, you can use the `--blobtype` parameter. 

        azure storage blob upload '~/images/HelloWorld.png' mycontainer myBlockBlob

### How to download blobs from a container
The following example demonstrates how to download blobs from a container. 
    
        azure storage blob download mycontainer myBlockBlob '~/downloadImages/downloaded.png'

### How to copy blobs from one storage container to another
You can copy blobs across storage accounts and regions asynchronously. The following example demonstrates how to copy blobs from one storage container to another in two different storage accounts. 

        azure storage container create mycontainer2 -a <accountName2> -k <accountKey2> -p Blob
        
        azure storage blob upload '~/Images/HelloWorld.png' mycontainer2 myBlockBlob2 -a <accountName2> -k <accountKey2>
        
        azure storage blob copy start 'https://<accountname2>.blob.core.windows.net/mycontainer2/myBlockBlob2' mycontainer

> Please note that source url in the command should contain the SAS token or is publically accessible. In this sample we created a container with public access for the blobs. Please also note that this sample performs an asynchronous copy. You can monitor the status of each copy by running the `azure storage blob copy show`.

### How to delete a blob
To delete a blob, use the below command: 

        azure storage blob delete mycontainer myBlockBlob2

## How to manage Azure file shares and files
Azure File storage offers shared storage for applications using the standard SMB 2.1 protocol. Microsoft Azure virtual machines and cloud services can share file data across application components via mounted shares, and on-premises applications can access file data in a share via the File storage API or Azure xplat-cli.

### How to create a file share
A File storage share is an SMB 2.1 file share in Azure. All directories and files must be created in a parent share. An account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account. The following example creates a file share named **myshare**.

        azure storage share create myshare
        
### How to create a directory
Directory is an optional hierarchy of azure file service. The following example creates a directory named **myDir** in the file share.

        azure storage directory create myshare myDir

> Note that directory path can be multiple sections like **a/b**. However, you need to ensure all the parent directories exists; for example, for path **a/b**, you need to create **a** firstly.
        
### How to upload a local file to directory
You can store your files in azure file shares and directories. A file in the share can be up to 1 TB in size. The following example uploads a file from **~/temp/samplefile.txt** to the **myDir** directory. Edit the file path so that it points to a valid file on your local machine: 

        azure storage file upload '~/temp/samplefile.txt' myshare myDir

### How to list the files in the directory
You can list the files and subdirectories in a share root or a directory by command:

        azure storage file list myshare myDir

> Note the directory name **myDir** can be omitted, which lists the root directory of the share, or multiple sections.
        
## Next Steps
In this guide, you've learned how to manage Azure Storage with Azure xplat-cli. Here are some related articles and resources for learning more about them.

- [Azure Storage Documentation](http://azure.microsoft.com/documentation/services/storage/)
- [Azure Storage MSDN Reference](http://msdn.microsoft.com/library/azure/gg433040.aspx)


[Image1]: ./media/storage-xplat-guide-full/azure_command.png
