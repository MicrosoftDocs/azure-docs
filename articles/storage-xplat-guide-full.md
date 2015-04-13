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

In this guide, we’ll explore how to use [Azure Cross-Platform Command-Line Interface (xplat-cli)](http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/) to perform a variety of development and administration tasks with Azure Storage. 

Xplat-cli provides a set of open source, cross-platform commands for working with the Azure Platform. The xplat-cli provides much of the same functionality found in the Azure Management Portal. 

This guide assumes that you have prior experience using [Azure Storage](http://azure.microsoft.com/documentation/services/storage/). The guide provides a number of scripts to demonstrate the usage of xplat-cli with Azure Storage. You should update the script variables based on your configuration before running each script.

The first section in this guide provides a quick glance at Azure Storage and xplat-cli. For detailed information and instructions, start from the [Prerequisites for using Azure PowerShell with Azure Storage](#pre).


## Getting started with Azure Storage and xplat-cli in 5 minutes
This section shows you how to access Azure Storage via xplat-cli in 5 minutes. Note that xplat-cli can be installed and run on different platforms such as Windows, Linux and Mac. For this documentation, we take Ubuntu as an example but it should not be difficult to follow these steps in other OS platform. 

**New to Azure:** Get a Microsoft Azure subscription and a Microsoft account associated with that subscription. For information on Azure purchase options, see [Free Trial](http://azure.microsoft.com/pricing/free-trial/), [Purchase Options](http://azure.microsoft.com/pricing/purchase-options/), and [Member Offers](http://azure.microsoft.com/pricing/member-offers/) (for members of MSDN, Microsoft Partner Network, and BizSpark, and other Microsoft programs). 

See [Manage Accounts, Subscriptions, and Administrative Roles](https://msdn.microsoft.com/library/azure/hh531793.aspx) for more information about Azure subscriptions.

**After creating a Microsoft Azure subscription and account:** 

1.	Download and install Azure xplat-cli following [Install and Configure the Azure Cross-Platform Command-Line Interface](http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/#install).
2.	Once the xplat-cli has been installed, you will be able to use the azure command from your command-line interface (Bash, Terminal, Command prompt) to access the xplat-cli commands. Type **azure** command and you should see the following output. 
![Azure Command Output][Image1]
3.	In the command line interface, type **azure storage** to list out all the azure storage commands and get a first impression of the functionalities xplat-cli provides. You can type command name with **-h** parameter (for example, **azure storage share create -h**) to see details of command syntax. 
4.	Now, we’ll give you a simple script that shows basic xplat-cli commands to access Azure Storage. The script will first ask you to set two variables for your storage account and key. Then, the script will create a new container in this new storage account and upload an existing image file (blob) to that container. After the script lists all blobs in that container, it will create a new destination directory in your local computer and download the image file.

    	#begin
    	# Update with the name of your subscription.
    	$SubscriptionName="YourSubscriptionName"
    
    	# Give a name to your new storage account. It must be lowercase! 
    	$StorageAccountName="yourstorageaccountname"
    
    	# Choose "West US" as an example.
    	$Location = "West US"
    
    	# Give a name to your new container.
    	$ContainerName = "imagecontainer"
    
    	# Have an image file and a source directory in your local computer.
    	$ImageToUpload = "C:\Images\HelloWorld.png"
    
    	# A destination directory in your local computer.
    	$DestinationFolder = "C:\DownloadImages"
    
    	# Add your Azure account to the local PowerShell environment.
    	Add-AzureAccount
    
    	# Set a default Azure subscription.
    	Select-AzureSubscription -SubscriptionName $SubscriptionName –Default
    
    	# Create a new storage account.
    	New-AzureStorageAccount –StorageAccountName $StorageAccountName -Location $Location
    
    	# Set a default storage account.
    	Set-AzureSubscription -CurrentStorageAccountName $StorageAccountName -SubscriptionName $SubscriptionName
    
    	# Create a new container.
    	New-AzureStorageContainer -Name $ContainerName -Permission Off
    
    	# Upload a blob into a container.
    	Set-AzureStorageBlobContent -Container $ContainerName -File $ImageToUpload 
    
    	# List all blobs in a container.
    	Get-AzureStorageBlob -Container $ContainerName
    
    	# Download blobs from the container:
    	# Get a reference to a list of all blobs in a container.
    	$blobs = Get-AzureStorageBlob -Container $ContainerName
    
    	# Create the destination directory.
    	New-Item -Path $DestinationFolder -ItemType Directory -Force  
    
    	# Download blobs into the local destination directory.
    	$blobs | Get-AzureStorageBlobContent –Destination $DestinationFolder
    	#end
    
5.	In your local computer, open your preferred text editor (vim for example). Type the above script into your text editor.

6.	Now, you need to update the script variables based on your configuration settings.
	
	- **$StorageAccountName:** Use the given name in the script or enter a new name for your storage account. **Important:** The name of the storage account must be unique in Azure. It must be lowercase, too!

	- **$StorageAccountKey:** The access key of your storage account. 
	 
	- **$Location:** Use the given "West US" in the script or choose other Azure locations, such as East US, North Europe, and so on.
	  
	- **$ContainerName:** Use the given name in the script or enter a new name for your container.
	
	- **$ImageToUpload:** Enter a path to a picture on your local computer, such as: "C:\Images\HelloWorld.png".
	
	- **$DestinationFolder:** Enter a path to a local directory to store files downloaded from Azure Storage, such as: “C:\DownloadImages”.

7.	After you’ve updated the necessary variables in vim, press key combinations “Esc, : , wq!” to save the script. 

8.	To run this script, simply type the script file name in the bash console. After this script runs, you should have a local destination folder that includes the downloaded image file. The following screenshot shows an example output:

After the script runs, you should have a local destination folder that includes the downloaded image file. 

![Download Blobs][Image2]


[Image1]: ./media/storage-xplat-guide-full/azure_command.png
[Image2]: ./media/storage-xplat-guide-full/Subscription_Previewportal.png

> [AZURE.NOTE] The "Getting started with Azure Storage and xplat-cli in 5 minutes" section provided a quick introduction on how to use Azure xplat-cli with Azure Storage. For detailed information and instructions, we encourage you to read the following sections.

## Prerequisites for using Azure xplat-cli with Azure Storage
You need an Azure subscription and account to run the xplat-cli commands given in this guide, as described above.

Azure xplat-cli is a command line interface that provides a full set of commands to manage Azure. For information on installing and setting up Azure xplat-cli, see [How to install and configure Azure xplat-cli](http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/#install). We recommend that you download and install or upgrade to the latest Azure xplat-cli before using this guide. 

## How to manage storage accounts in Azure

### How to connect to your Azure subscription
While most of the storage commands will work without an Azure subscription, we recommend you to connect to your subscription from xplat-cli. To configure the xplat-cli to work with your subscription, follow the steps in [How to connect to your Azure subscription](http://azure.microsoft.com/en-us/documentation/articles/xplat-cli/#configure). 

### How to create a new Azure storage account
To use Azure storage, you will need a storage account. You can create a new Azure storage account after you have configured your computer to connect to your subscription. 

		azure storage account create

> [AZURE.IMPORTANT] The name of your storage account must be unique within Azure and must be lowercase. For naming conventions and restrictions, see [About Azure Storage Accounts](storage-create-storage-account.md) and [Naming and Referencing Containers, Blobs, and Metadata](http://msdn.microsoft.com/library/azure/dd135715.aspx).

### How to set a default Azure storage account in environment variables 
You can have multiple storage accounts in your subscription. You can choose one of them and set it in the environment variables for all the storage commands in the same session. This enables you to run the Azure xplat-cli storage commands without specifying the storage account and key explicitly. 

		Export AZURE_STORAGE_ACCOUNT=<accountname>
		Export AZURE_STORAGE_ACCOUNT=<key>

## How to manage Azure blobs
Azure Blob storage is a service for storing large amounts of unstructured data, such as text or binary data, that can be accessed from anywhere in the world via HTTP or HTTPS. This section assumes that you are already familiar with the Azure Blob Storage Service concepts. For detailed information, see [How to use Blob Storage from .NET](storage-dotnet-how-to-use-blobs.md) and [Blob Service Concepts](http://msdn.microsoft.com/library/azure/dd179376.aspx).

### How to create a container
Every blob in Azure storage must be in a container. You can create a private container using the New-AzureStorageContainer cmdlet:

    $StorageContainerName = "yourcontainername"
    New-AzureStorageContainer -Name $StorageContainerName -Permission Off

> [AZURE.NOTE] There are three levels of anonymous read access: **Off**, **Blob**, and **Container**. To prevent anonymous access to blobs, set the Permission parameter to **Off**. By default, the new container is private and can be accessed only by the account owner. To allow anonymous public read access to blob resources, but not to container metadata or to the list of blobs in the container, set the Permission parameter to **Blob**. To allow full public read access to blob resources, container metadata, and the list of blobs in the container, set the Permission parameter to **Container**. For more information, see [Manage Access to Azure Storage Resources](storage-manage-access-to-resources.md).

### How to upload a blob into a container
Azure Blob Storage supports block blobs and page blobs. For more information, see [Understanding Block Blobs and Page Blobs](http://msdn.microsoft.com/library/azure/ee691964.aspx).

To upload blobs in to a container, you can use the **azure storage blob upload**. By default, this command uploads the local files to a block blob. To specify the type for the blob, you can use the -BlobType parameter. 

    Get-ChildItem –Path C:\Images\* | Set-AzureStorageBlobContent -Container "yourcontainername"

### How to download blobs from a container
The following example demonstrates how to download blobs from a container. 
    
    #Download blobs from a container. 
    New-Item -Path $DestinationFolder -ItemType Directory -Force 
    $blobs | Get-AzureStorageBlobContent -Destination $DestinationFolder -Context $Ctx

### How to copy blobs from one storage container to another
You can copy blobs across storage accounts and regions asynchronously. The following example demonstrates how to copy blobs from one storage container to another in two different storage accounts. 

    #Define the source storage account and context.
    $SourceStorageAccountName = "yoursourcestorageaccount"
    $SourceStorageAccountKey = "Storage key for yoursourcestorageaccount"
    $SrcContainerName = "yoursrccontainername"
    $SourceContext = New-AzureStorageContext -StorageAccountName $SourceStorageAccountName -StorageAccountKey $SourceStorageAccountKey
    
    #Define the destination storage account and context.
    $DestStorageAccountName = "yourdeststorageaccount"
    $DestStorageAccountKey = "Storage key for yourdeststorageaccount"
    $DestContainerName = "destcontainername"
    $DestContext = New-AzureStorageContext -StorageAccountName $DestStorageAccountName -StorageAccountKey $DestStorageAccountKey
    
    #Get a reference to blobs in the source container.
    $blobs = Get-AzureStorageBlob -Container $SrcContainerName -Context $SourceContext
    
    #Copy blobs from one container to another.
    $blobs| Start-AzureStorageBlobCopy -DestContainer $DestContainerName -DestContext $DestContext

Note that this example performs an asynchronous copy. You can monitor the status of each copy by running the **azure storage blob show**.

### How to delete a blob
To delete a blob, first get a blob reference and then call the Remove-AzureStorageBlob cmdlet on it. The following example deletes all the blobs in a given container. 

    #Define the storage account and context.
    $StorageAccountName = "yourstorageaccount"
    $StorageAccountKey = "Storage key for yourstorageaccount ends with =="
    $ContainerName = "containername"
    $Ctx = New-AzureStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey
    
    #Get a reference to all the blobs in the container.
    $blobs = Get-AzureStorageBlob -Container $ContainerName -Context $Ctx
    
    #Delete blobs in a specified container.
    $blobs| Remove-AzureStorageBlob 

## How to manage Azure file shares and files
Azure File storage offers shared storage for applications using the standard SMB 2.1 protocol. Microsoft Azure virtual machines and cloud services can share file data across application components via mounted shares, and on-premises applications can access file data in a share via the File storage API or Azure xplat-cli.

### How to create a file share
A File storage share is an SMB 2.1 file share in Azure. All directories and files must be created in a parent share. An account can contain an unlimited number of shares, and a share can store an unlimited number of files, up to the capacity limits of the storage account. The following example creates a file share named sampleshare.

		azure storage share create
		
### How to create a directory
Directory is an optional hierarchy of azure file service. The following example creates a directory named sampledir in the file share.

		azure storage directory create
		
### How to upload a local file to directory
You can store your files in azure file shares and directories. A file in the share can be up to 1 TB in size. The following example uploads a file from C:\temp\samplefile.txt to the sampledir directory. Edit the file path so that it points to a valid file on your local machine: 

		azure storage file upload

### How to list the files in the directory
To see the file in the directory, you can list the directory's files. This command will also list subdirectories, but in this example, there is no subdirectory, so only the file will be listed. 

		azure storage file list
		
## Next Steps
In this guide, you've learned how to manage Azure Storage with Azure xplat-cli. Here are some related articles and resources for learning more about them.

- [Azure Storage Documentation](http://azure.microsoft.com/documentation/services/storage/)
- [Azure Storage MSDN Reference](http://msdn.microsoft.com/library/azure/gg433040.aspx)