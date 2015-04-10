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
2.	Once the xplat-cli has been installed, you will be able to use the azure command from your command-line interface (Bash, Terminal, Command prompt) to access the xplat-cli commands. Type azure command and you should see the following output. 
![Azure Command Output][Image1]
3.	Now, we’ll give you a simple script that shows basic xplat-cli commands to access Azure Storage. The script will first ask you to set two variables for your storage account and key. Then, the script will create a new container in this new storage account and upload an existing image file (blob) to that container. After the script lists all blobs in that container, it will create a new destination directory in your local computer and download the image file.

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
    
4.	In your local computer, open your preferred text editor (vim for example). Type the above script into your text editor.

5.	Now, you need to update the script variables based on your configuration settings.
	
	- **$StorageAccountName:** Use the given name in the script or enter a new name for your storage account. **Important:** The name of the storage account must be unique in Azure. It must be lowercase, too!

	- **$StorageAccountKey:** The access key of your storage account. 
	 
	- **$Location:** Use the given "West US" in the script or choose other Azure locations, such as East US, North Europe, and so on.
	  
	- **$ContainerName:** Use the given name in the script or enter a new name for your container.
	
	- **$ImageToUpload:** Enter a path to a picture on your local computer, such as: "C:\Images\HelloWorld.png".
	
	- **$DestinationFolder:** Enter a path to a local directory to store files downloaded from Azure Storage, such as: “C:\DownloadImages”.

6.	After you’ve updated the necessary variables in vim, press key combinations “Esc, : , wq!” to save the script. 

7.	To run this script, simply type the script file name in the bash console. After this script runs, you should have a local destination folder that includes the downloaded image file. The following screenshot shows an example output:

After the script runs, you should have a local destination folder that includes the downloaded image file. 

![Download Blobs][Image3]


[Image1]: ./media/storage-xplat-guide-full/azure_command.png
[Image2]: ./media/storage-powershell-guide-full/Subscription_Previewportal.png
