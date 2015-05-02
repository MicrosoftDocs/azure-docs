<properties 
	pageTitle="Using Azure PowerShell with Azure Storage" 
	description="Learn how to use Azure PowerShell for Azure Storage" 
	services="storage" 
	documentationCenter="na" 
	authors="Selcin,tamram" 
	manager="adinah"/>

<tags 
	ms.service="storage" 
	ms.workload="storage" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/12/2015" 
	ms.author="selcint"/>

# Using Azure PowerShell with Azure Storage 

## Overview

In this guide, we’ll explore how to use [Azure PowerShell](http://msdn.microsoft.com/library/azure/jj156055.aspx) to perform a variety of development and administration tasks with Azure Storage. 

Azure PowerShell is a module that provides cmdlets to manage Azure through Windows PowerShell. It is a task-based command-line shell and scripting language designed especially for system administration. With PowerShell, you can easily control and automate the administration of your Azure services and applications. For example, you can use the cmdlets to perform the same tasks that you can perform through the Azure Management Portal. 

This guide assumes that you have prior experience using [Azure Storage](http://azure.microsoft.com/documentation/services/storage/) and [Windows PowerShell](http://technet.microsoft.com/library/bb978526.aspx). The guide provides a number of scripts to demonstrate the usage of PowerShell with Azure Storage. You should update the script variables based on your configuration before running each script.

The first section in this guide provides a quick glance at Azure Storage and PowerShell. For detailed information and instructions, start from the [Prerequisites for using Azure PowerShell with Azure Storage](#pre).


## Getting started with Azure Storage and PowerShell in 5 minutes
This section shows you how to access Azure Storage via PowerShell in 5 minutes. 

**New to Azure:** Get a Microsoft Azure subscription and a Microsoft account associated with that subscription. For information on Azure purchase options, see [Free Trial](http://azure.microsoft.com/pricing/free-trial/), [Purchase Options](http://azure.microsoft.com/pricing/purchase-options/), and [Member Offers](http://azure.microsoft.com/pricing/member-offers/) (for members of MSDN, Microsoft Partner Network, and BizSpark, and other Microsoft programs). 

See [Manage Accounts, Subscriptions, and Administrative Roles](https://msdn.microsoft.com/library/azure/hh531793.aspx) for more information about Azure subscriptions.

**After creating a Microsoft Azure subscription and account:** 

1.	Download and install [Azure PowerShell](http://go.microsoft.com/?linkid=9811175&clcid=0x409).
2.	Start Windows PowerShell Integrated Scripting Environment (ISE): In your local computer, go to the **Start** menu. Type **Administrative Tools** and click to run it. In the **Administrative Tools** window, right-click **Windows PowerShell ISE**, click **Run as Administrator**. 
3.	In **Windows PowerShell ISE**, click **File** > **New** to create a new script file. 
4.	Now, we’ll give you a simple script that shows basic PowerShell commands to access Azure Storage. The script will first ask your Azure account credentials to add your Azure account to the local PowerShell environment. Then, the script will set the default Azure subscription and create a new storage account in Azure. Next, the script will create a new container in this new storage account and upload an existing image file (blob) to that container. After the script lists all blobs in that container, it will create a new destination directory in your local computer and download the image file.
5.	In the following code section, select the script between the remarks **#begin** and **#end**. Press CTRL+C to copy it to the clipboard. 

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
    
5.	In **Windows PowerShell ISE**, press CTRL+V to copy the script. Click **File** > **Save**. In the **Save As** dialog window, type the name of the script file, such as "mystoragescript". Click **Save**.

6.	Now, you need to update the script variables based on your configuration settings. You must update the **$SubscriptionName** variable with your own subscription. You can keep the other variables as specified in the script or update them as you wish.

	- **$SubscriptionName:** You must update this variable with your own subscription name. Follow one of the following three ways to locate the name of your subscription: 
	
		a. In **Windows PowerShell ISE**, click **File** > **New** to create a new script file. Copy the following script to the new script file and click **Debug** > **Run**. The following script will first ask your Azure account credentials to add your Azure account to the local PowerShell environment and then show all the subscriptions that are connected to the local PowerShell session. Take a note of the name of the subscription that you want to use while following this tutorial: 
	 
    		Add-AzureAccount 
       		Get-AzureSubscription | Format-Table SubscriptionName, IsDefault, IsCurrent, CurrentStorageAccountName 


		b. Currently, Azure supports two portals: the [Azure Management Portal](https://manage.windowsazure.com/) and the [Azure Preview Portal](https://portal.azure.com/). If you sign in to the current [Azure Management Portal](https://portal.azure.com/), scroll down and click **Settings** on the left side of the portal. Click **Subscriptions**. Copy the name of subscription that you want to use while running the scripts given in this guide. See the following screenshot as an example.

		![Azure Management Portal][Image1]

		c. If you sign in to the [Azure Preview Portal](https://portal.azure.com/), in the Hub menu on the left, click **BROWSE**. Then, click **Everything**, click **Subscriptions**. Copy the name of subscription that you want to use while running the scripts in this guide. See the following screenshot as an example.

		![Azure Preview Portal][Image2]
 

	- **$StorageAccountName:** Use the given name in the script or enter a new name for your storage account. **Important:** The name of the storage account must be unique in Azure. It must be lowercase, too!
	 
	- **$Location:** Use the given "West US" in the script or choose other Azure locations, such as East US, North Europe, and so on.
	  
	- **$ContainerName:** Use the given name in the script or enter a new name for your container.
	
	- **$ImageToUpload:** Enter a path to a picture on your local computer, such as: "C:\Images\HelloWorld.png".
	
	- **$DestinationFolder:** Enter a path to a local directory to store files downloaded from Azure Storage, such as: “C:\DownloadImages”.

7.	After updating the script variables in the "mystoragescript.ps1" file, click **File** > **Save**. Then, click **Debug** > **Run** or press **F5** to run the script.  

After the script runs, you should have a local destination folder that includes the downloaded image file. The following screenshot shows an example output:

![Download Blobs][Image3]


> [AZURE.NOTE] The "Getting started with Azure Storage and PowerShell in 5 minutes" section provided a quick introduction on how to use Azure PowerShell with Azure Storage. For detailed information and instructions, we encourage you to read the following sections.

## Prerequisites for using Azure PowerShell with Azure Storage
You need an Azure subscription and account to run the PowerShell cmdlets given in this guide, as described above.

Azure PowerShell is a module that provides cmdlets to manage Azure through Windows PowerShell. For information on installing and setting up Azure PowerShell, see [How to install and configure Azure PowerShell](powershell-install-configure.md). We recommend that you download and install or upgrade to the latest Azure PowerShell module before using this guide. 

You can run the cmdlets in the Azure PowerShell console, the standard Windows PowerShell console, or the Windows PowerShell Integrated Scripting Environment (ISE). For example, to open an **Azure PowerShell console**, go to the Start menu, type Microsoft Azure PowerShell, right-click and click Run as administrator. To open **Windows PowerShell ISE**, go to the Start menu, type Administrative Tools and click to run it. In the Administrative Tools window, right-click Windows PowerShell ISE, click Run as Administrator. 

## How to manage storage accounts in Azure

### How to set a default Azure subscription
To manage Azure Storage using Azure PowerShell, you need to authenticate your client environment with Azure via Azure Active Directory Authentication or Certificate-based Authentication. For detailed information, see [How to install and configure Azure PowerShell](powershell-install-configure.md) tutorial. This guide uses the Azure Active Directory authentication.

1.	In the Azure PowerShell console or in Windows PowerShell ISE, type the following command to add your Azure account to the local PowerShell environment:

    `Add-AzureAccount`

2.	In the “Sign in to Microsoft Azure” window, type the email address and password associated with your account. Azure authenticates and saves the credential information, and then closes the window.

3.	Next, run the following command to view the Azure accounts in your local PowerShell environment, and verify that your account is listed:
 
	`Get-AzureAccount`
  
4.	Then, run the following cmdlet to view all the subscriptions that are connected to the local PowerShell session, and verify that your subscription is listed:

	`Get-AzureSubscription | Format-Table SubscriptionName, IsDefault, IsCurrent, CurrentStorageAccountName`
 
5.	To set a default Azure subscription, run the Select-AzureSubscription cmdlet:
 
	    $SubscriptionName = 'Your subscription Name'
    	Select-AzureSubscription -SubscriptionName $SubscriptionName –Default

6.	Verify the name of the default subscription by running the Get-AzureSubscription cmdlet:

	`Get-AzureSubscription -Default`

7.	To see all the available PowerShell cmdlets for Azure Storage, run:

	`Get-Command -Module Azure -Noun *Storage*`

### How to create a new Azure storage account
To use Azure storage, you will need a storage account. You can create a new Azure storage account after you have configured your computer to connect to your subscription. 

1.	Run the Get-AzureLocation cmdlet to find all the available datacenter locations:

    `Get-AzureLocation | format-Table -Property Name, AvailableServices, StorageAccountTypes`

2.	Next, run the New-AzureStorageAccount cmdlet to create a new storage account. The following example creates a new storage account in the "West US" datacenter.
  
    	$location = "West US"
	    $StorageAccountName = "yourstorageaccount"
	    New-AzureStorageAccount –StorageAccountName $StorageAccountName -Location $location

> [AZURE.IMPORTANT] The name of your storage account must be unique within Azure and must be lowercase. For naming conventions and restrictions, see [About Azure Storage Accounts](storage-create-storage-account.md) and [Naming and Referencing Containers, Blobs, and Metadata](http://msdn.microsoft.com/library/azure/dd135715.aspx).

### How to set a default Azure storage account
You can have multiple storage accounts in your subscription. You can choose one of them and set it as the default storage account for all the storage commands in the same PowerShell session. This enables you to run the Azure PowerShell storage commands without specifying the storage context explicitly. 

1.	To set a default storage account for your subscription, you can run the Set-AzureSubscription cmdlet. 

		$SubscriptionName = "Your subscription name" 
     	$StorageAccountName = "yourstorageaccount"  
    	Set-AzureSubscription -CurrentStorageAccountName $StorageAccountName -SubscriptionName $SubscriptionName 

2.	Next, run the Get-AzureSubscription cmdlet to verify that the storage account is associated with your default subscription account. This command returns the subscription properties on the current subscription including its current storage account.

	    Get-AzureSubscription –Current

### How to list all Azure storage accounts in a subscription
Each Azure subscription can have up to 100 storage accounts. For the most up-to-date information on limits, see [Azure Subscription and Service Limits, Quotas, and Constraints](./azure-subscription-service-limits.md).

Run the following cmdlet to find out the name and status of the storage accounts in the current subscription:

    Get-AzureStorageAccount | Format-Table -Property StorageAccountName, Location, AccountType, StorageAccountStatus

### How to create an Azure storage context
Azure storage context is an object in PowerShell to encapsulate the storage credentials. Using a storage context while running any subsequent cmdlet enables you to authenticate your request without specifying the storage account and its access key explicitly. You can create a storage context in many ways, such as using storage account name and access key, shared access signature (SAS) token, connection string, or anonymous. For more information, see [New-AzureStorageContext](http://msdn.microsoft.com/library/azure/dn806380.aspx).  

Use one of the following three ways to create a storage context:

- Run the [Get-AzureStorageKey](http://msdn.microsoft.com/library/azure/dn495235.aspx) cmdlet to find out the primary storage access key for your Azure storage account. Next, call the [New-AzureStorageContext](http://msdn.microsoft.com/library/azure/dn806380.aspx) cmdlet to create a storage context:

    	$StorageAccountName = "yourstorageaccount"
    	$StorageAccountKey = Get-AzureStorageKey -StorageAccountName $StorageAccountName
    	$Ctx = New-AzureStorageContext $StorageAccountName -StorageAccountKey $StorageAccountKey.Primary


- Generate a shared access signature token for an Azure storage container and use it to create a storage context:

    	$sasToken = New-AzureStorageContainerSASToken -Container abc -Permission rl
    	$Ctx = New-AzureStorageContext -StorageAccountName $StorageAccountName -SasToken $sasToken

	For more information, see [New-AzureStorageContainerSASToken](http://msdn.microsoft.com/library/azure/dn806416.aspx) and [Shared Access Signatures, Part 1: Understanding the SAS Model ](storage-dotnet-shared-access-signature-part-1.md).

- In some cases, you may want to specify the service endpoints when you create a new storage context. This might be necessary when you have registered a custom domain name for your storage account with the Blob service or you want to use a shared access signature for accessing storage resources. Set the service endpoints in a connection string and use it to create a new storage context as shown below:

    	$ConnectionString = "DefaultEndpointsProtocol=http;BlobEndpoint=<blobEndpoint>;QueueEndpoint=<QueueEndpoint>;TableEndpoint=<TableEndpoint>;AccountName=<AccountName>;AccountKey=<AccountKey>"
    	$Ctx = New-AzureStorageContext -ConnectionString $ConnectionString

For more information on how to configure a storage connection string, see [Configuring Connection Strings](storage-configure-connection-string.md).

Now that you have set up your computer and learned how to manage subscriptions and storage accounts using Azure PowerShell. Go to the next section to learn how to manage Azure blobs and blob snapshots.

## How to manage Azure blobs and blob snapshots
Azure Blob storage is a service for storing large amounts of unstructured data, such as text or binary data, that can be accessed from anywhere in the world via HTTP or HTTPS. This section assumes that you are already familiar with the Azure Blob Storage Service concepts. For detailed information, see [How to use Blob Storage from .NET](storage-dotnet-how-to-use-blobs.md) and [Blob Service Concepts](http://msdn.microsoft.com/library/azure/dd179376.aspx).

### How to create a container
Every blob in Azure storage must be in a container. You can create a private container using the New-AzureStorageContainer cmdlet:

    $StorageContainerName = "yourcontainername"
    New-AzureStorageContainer -Name $StorageContainerName -Permission Off

> [AZURE.NOTE] There are three levels of anonymous read access: **Off**, **Blob**, and **Container**. To prevent anonymous access to blobs, set the Permission parameter to **Off**. By default, the new container is private and can be accessed only by the account owner. To allow anonymous public read access to blob resources, but not to container metadata or to the list of blobs in the container, set the Permission parameter to **Blob**. To allow full public read access to blob resources, container metadata, and the list of blobs in the container, set the Permission parameter to **Container**. For more information, see [Manage Access to Azure Storage Resources](storage-manage-access-to-resources.md).

### How to upload a blob into a container
Azure Blob Storage supports block blobs and page blobs. For more information, see [Understanding Block Blobs and Page Blobs](http://msdn.microsoft.com/library/azure/ee691964.aspx).

To upload blobs in to a container, you can use the [Set-AzureStorageBlobContent](http://msdn.microsoft.com/library/azure/dn806379.aspx) cmdlet. By default, this command uploads the local files to a block blob. To specify the type for the blob, you can use the -BlobType parameter. 

The following example runs the [Get-ChildItem](http://technet.microsoft.com/library/hh849800.aspx) cmdlet to get all the files in the specified folder, and then passes them to the next cmdlet by using the pipeline operator. The [Set-AzureStorageBlobContent](http://msdn.microsoft.com/library/azure/dn806379.aspx) cmdlet uploads the local files to your container:

    Get-ChildItem –Path C:\Images\* | Set-AzureStorageBlobContent -Container "yourcontainername"

### How to download blobs from a container
The following example demonstrates how to download blobs from a container. The example first establishes a connection to Azure Storage using the storage account context, which includes the storage account name and its primary access key. Then, the example retrieves a blob reference using the [Get-AzureStorageBlob](http://msdn.microsoft.com/library/azure/dn806392.aspx) cmdlet. Next, the example uses the [Get-AzureStorageBlobContent](http://msdn.microsoft.com/library/azure/dn806418.aspx) cmdlet to download blobs into the local destination folder. 

    #Define the variables.
	ContainerName = "yourcontainername" 
    $DestinationFolder = "C:\DownloadImages" 
    
    #Define the storage account and context.
    $StorageAccountName = "yourstorageaccount"
    $StorageAccountKey = "Storage key for yourstorageaccount ends with =="
    $Ctx = New-AzureStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey
    
    #List all blobs in a container.
    $blobs = Get-AzureStorageBlob -Container $ContainerName -Context $Ctx
    
    #Download blobs from a container. 
    New-Item -Path $DestinationFolder -ItemType Directory -Force 
    $blobs | Get-AzureStorageBlobContent -Destination $DestinationFolder -Context $Ctx

### How to copy blobs from one storage container to another
You can copy blobs across storage accounts and regions asynchronously. The following example demonstrates how to copy blobs from one storage container to another in two different storage accounts. The example first sets variables for source and destination storage accounts, and then creates a storage context for each account. Next, the example copies blobs from the source container to the destination container using the [Start-AzureStorageBlobCopy](http://msdn.microsoft.com/library/azure/dn806394.aspx) cmdlet. The example assumes that the source and destination storage accounts and containers already exist. 

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

Note that this example performs an asynchronous copy. You can monitor the status of each copy by running the [Get-AzureStorageBlobCopyState](http://msdn.microsoft.com/library/azure/dn806406.aspx) cmdlet.

### How to delete a blob
To delete a blob, first get a blob reference and then call the Remove-AzureStorageBlob cmdlet on it. The following example deletes all the blobs in a given container. The example first sets variables for a storage account, and then creates a storage context. Next, the example retrieves a blob reference using the [Get-AzureStorageBlob](http://msdn.microsoft.com/library/azure/dn806392.aspx) cmdlet and runs the [Remove-AzureStorageBlob](http://msdn.microsoft.com/library/azure/dn806399.aspx) cmdlet to remove blobs from a container in Azure storage. 

    #Define the storage account and context.
    $StorageAccountName = "yourstorageaccount"
    $StorageAccountKey = "Storage key for yourstorageaccount ends with =="
    $ContainerName = "containername"
    $Ctx = New-AzureStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey
    
    #Get a reference to all the blobs in the container.
    $blobs = Get-AzureStorageBlob -Container $ContainerName -Context $Ctx
    
    #Delete blobs in a specified container.
    $blobs| Remove-AzureStorageBlob 

## How to manage Azure blob snapshots
Azure lets you create a snapshot of a blob. A snapshot is a read-only version of a blob that's taken at a point in time. Once a snapshot has been created, it can be read, copied, or deleted, but not modified. Snapshots provide a way to back up a blob as it appears at a moment in time. For more information, see [Creating a Snapshot of a Blob](http://msdn.microsoft.com/library/azure/hh488361.aspx).

### How to create a blob snapshot
To create a snaphot of a blob, first get a blob reference and then call the `ICloudBlob.CreateSnapshot` method on it. The following example first sets variables for a storage account, and then creates a storage context. Next, the example retrieves a blob reference using the [Get-AzureStorageBlob](http://msdn.microsoft.com/library/azure/dn806392.aspx) cmdlet and runs the [ICloudBlob.CreateSnapshot](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.blob.icloudblob.aspx) method to create a snapshot. 

    #Define the storage account and context.
    $StorageAccountName = "yourstorageaccount"
    $StorageAccountKey = "Storage key for yourstorageaccount ends with =="
    $ContainerName = "yourcontainername"
    $BlobName = "yourblobname"
    $Ctx = New-AzureStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey
    
    #Get a reference to a blob.
    $blob = Get-AzureStorageBlob -Context $Ctx -Container $ContainerName -Blob $BlobName
    
    #Create a snapshot of the blob.
    $snap = $blob.ICloudBlob.CreateSnapshot() 

### How to list a blob's snapshots
You can create as many snapshots as you want for a blob. You can list the snapshots associated with your blob to track your current snapshots. The following example uses a predefined blob and calls the [Get-AzureStorageBlob](http://msdn.microsoft.com/library/azure/dn806392.aspx) cmdlet to list the snapshots of that blob.  

    #Define the blob name.
    $BlobName = "yourblobname"
    
    #List the snapshots of a blob.
    Get-AzureStorageBlob –Context $Ctx -Prefix $BlobName -Container $ContainerName  | Where-Object  { $_.ICloudBlob.IsSnapshot -and $_.Name -eq $BlobName }

### How to copy a snapshot of a blob
You can copy a snapshot of a blob to restore the snapshot. For detailed information and restrictions, see [Creating a Snapshot of a Blob](http://msdn.microsoft.com/library/azure/hh488361.aspx). The following example first sets variables for a storage account, and then creates a storage context. Next, the example defines the container and blob name variables. The example retrieves a blob reference using the [Get-AzureStorageBlob](http://msdn.microsoft.com/library/azure/dn806392.aspx) cmdlet and runs the [ICloudBlob.CreateSnapshot](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.blob.icloudblob.aspx) method to create a snapshot. Then, the example runs the [Start-AzureStorageBlobCopy](http://msdn.microsoft.com/library/azure/dn806394.aspx) cmdlet to copy the snapshot of a blob using the ICloudBlob object for the source blob. Be sure to update the variables based on your configuration before running the example. Note that the following example assumes that the source and destination containers, and the source blob already exist. 

    #Define the storage account and context.
    $StorageAccountName = "yourstorageaccount"
    $StorageAccountKey = "Storage key for yourstorageaccount ends with =="
    $Ctx = New-AzureStorageContext -StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey
    
    #Define the variables.
    $SrcContainerName = "yoursourcecontainername"
    $DestContainerName = "yourdestcontainername"
    $SrcBlobName = "yourblobname"
    $DestBlobName = "CopyBlobName"
    
    #Get a reference to a blob.
    $blob = Get-AzureStorageBlob -Context $Ctx -Container $SrcContainerName -Blob $SrcBlobName
    
    #Create a snapshot of a blob.
    $snap = $blob.ICloudBlob.CreateSnapshot() 
    
    #Copy the snapshot to another container.
    Start-AzureStorageBlobCopy –Context $Ctx -ICloudBlob $snap -DestBlob $DestBlobName -DestContainer $DestContainerName

Now that you have learned how to manage Azure blobs and blob snapshots with Azure PowerShell. Go to the next section to learn how to manage tables, queues, and files.

## How to manage Azure tables and table entities
Azure Table storage service is a NoSQL datastore, which you can use to store and query huge sets of structured, non-relational data. The main components of the service are tables, entities, and properties. A table is a collection of entities. An entity is a set of properties. Each entity can have up to 252 properties, which are all name-value pair. This section assumes that you are already familiar with the Azure Table Storage Service concepts. For detailed information, see [Understanding the Table Service Data Model](http://msdn.microsoft.com/library/azure/dd179338.aspx) and [How to use Table Storage from .NET](storage-dotnet-how-to-use-tables.md).

In the following sub sections, you’ll learn how to manage Azure Table storage service using Azure PowerShell. The scenarios covered include **creating**, **deleting**, and **retrieving** **tables**, as well as **adding**, **querying**, and **deleting table entities**.

### How to create a table
Every table must reside in an Azure storage account. The following example demonstrates how to create a table in Azure Storage. The example first establishes a connection to Azure Storage using the storage account context, which includes the storage account name and its access key. Next, it uses the [New-AzureStorageTable](http://msdn.microsoft.com/library/azure/dn806417.aspx) cmdlet to create a table in Azure Storage. 

    #Define the storage account and context.
    $StorageAccountName = "yourstorageaccount"
    $StorageAccountKey = "Storage key for yourstorageaccount ends with =="
    $Ctx = New-AzureStorageContext $StorageAccountName -StorageAccountKey $StorageAccountKey 
    
    #Create a new table.
    $tabName = "yourtablename"
    New-AzureStorageTable –Name $tabName –Context $Ctx 

### How to retrieve a table
You can query and retrieve one or all tables in a Storage account. The following example demonstrates how to retrieve a given table using the [Get-AzureStorageTable](http://msdn.microsoft.com/library/azure/dn806411.aspx) cmdlet.

    #Retrieve a table.
    $tabName = "yourtablename"
    Get-AzureStorageTable –Name $tabName –Context $Ctx 

If you call the Get-AzureStorageTable cmdlet without any parameters, it gets all storage tables for a Storage account.

### How to delete a table
You can delete a table from a storage account by using the [Remove-AzureStorageTable](http://msdn.microsoft.com/library/azure/dn806393.aspx) cmdlet.  

    #Delete a table.
    $tabName = "yourtablename"
    Remove-AzureStorageTable –Name $tabName –Context $Ctx 

### How to manage table entities
Currently, Azure PowerShell does not provide cmdlets to manage table entities directly. To perform operations on table entities, you can use the classes given in the [Azure Storage Client Library for .NET](http://msdn.microsoft.com/library/azure/wa_storage_30_reference_home.aspx). 

#### How to add table entities
To add an entity to a table, first create an object that defines your entity properties. An entity can have up to 255 properties, including 3 system properties: **PartitionKey**, **RowKey**, and **Timestamp**. You are responsible for inserting and updating the values of **PartitionKey** and **RowKey**. The server manages the value of **Timestamp**, which cannot be modified. Together the **PartitionKey** and **RowKey** uniquely identify every entity within a table. 

-	**PartitionKey**: Determines the partition that the entity is stored in.
-	**RowKey**: Uniquely identifies the entity within the partition.

You may define up to 252 custom properties for an entity. For more information, see [Understanding the Table Service Data Model](http://msdn.microsoft.com/library/azure/dd179338.aspx).

The following example demonstrates how to add entities to a table. The example shows how to retrieve the employee table and add several entities into it. First, it establishes a connection to Azure Storage using the storage account context, which includes the storage account name and its access key. Next, it retrieves the given table using the [Get-AzureStorageTable](http://msdn.microsoft.com/library/azure/dn806411.aspx) cmdlet. If the table does not exist, the [New-AzureStorageTable](http://msdn.microsoft.com/library/azure/dn806417.aspx) cmdlet is used to create a table in Azure Storage. Next, the example defines a custom function Add-Entity to add entities to the table by specifying each entity’s partition and row key. The Add-Entity function calls the [New-Object](http://technet.microsoft.com/library/hh849885.aspx) cmdlet on the [Microsoft.WindowsAzure.Storage.Table.DynamicTableEntity](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.table.dynamictableentity.aspx) class to create an entity object. Later, the example calls the [Microsoft.WindowsAzure.Storage.Table.TableOperation.Insert](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.table.tableoperation.insert.aspx) method on this entity object to add it to a table. 

    #Function Add-Entity: Adds an employee entity to a table.
    function Add-Entity()
    {
    param(
       $table, 
       [String]$partitionKey, 
       [String]$rowKey,
       [String]$name, 
       [Int]$id
    )
    
      $entity = New-Object Microsoft.WindowsAzure.Storage.Table.DynamicTableEntity $partitionKey, $rowKey
      $entity.Properties.Add("Name", $name)
      $entity.Properties.Add("ID", $id)
    
      $result = $table.CloudTable.Execute([Microsoft.WindowsAzure.Storage.Table.TableOperation]::Insert($entity))
    }
    
    #Define the storage account and context.
    $StorageAccountName = "yourstorageaccount"
    $StorageAccountKey = "Storage key for yourstorageaccount ends with =="
    $Ctx = New-AzureStorageContext $StorageAccountName -StorageAccountKey $StorageAccountKey
    $TableName = "Employees"
    
    #Retrieve the table if it already exists.
    $table = Get-AzureStorageTable –Name $TableName -Context $Ctx -ErrorAction Ignore
    
    #Create a new table if it does not exist.
    if ($table -eq $null)
    {
       $table = New-AzureStorageTable –Name $TableName -Context $Ctx
    }
    
    #Add multiple entities to a table.
    Add-Entity $table "Partition1" "Row1" "Chris" 1 
    Add-Entity $table "Partition1" "Row2" "Jessie" 2 
    Add-Entity $table "Partition2" "Row1" "Christine" 3 
    Add-Entity $table "Partition2" "Row2" "Steven" 4 


#### How to query table entities
To query a table, use the [Microsoft.WindowsAzure.Storage.Table.TableQuery](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.table.tablequery.aspx) class. The following example assumes that you’ve already run the script given in the How to add entities section of this guide. The example first establishes a connection to Azure Storage using the storage context, which includes the storage account name and its access key. Next, it tries to retrieve the previously created “Employees” table using the [Get-AzureStorageTable](http://msdn.microsoft.com/library/azure/dn806411.aspx) cmdlet. Calling the [New-Object](http://technet.microsoft.com/library/hh849885.aspx) cmdlet on the Microsoft.WindowsAzure.Storage.Table.TableQuery class creates a new query object. The example looks for the entities that have an ‘ID’ column whose value is 1 as specified in a string filter. For detailed information, see [Querying Tables and Entities](http://msdn.microsoft.com/library/azure/dd894031.aspx). When you run this query, it returns all entities that match the filter criteria.    

    #Define the storage account and context.
    $StorageAccountName = "yourstorageaccount"
    $StorageAccountKey = "Storage key for yourstorageaccount ends with =="
    $Ctx = New-AzureStorageContext –StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey
    $TableName = "Employees"
    
    #Get a reference to a table.
    $table = Get-AzureStorageTable –Name $TableName -Context $Ctx
    
    #Create a table query.
    $query = New-Object Microsoft.WindowsAzure.Storage.Table.TableQuery
    
    #Define columns to select. 
    $list = New-Object System.Collections.Generic.List[string] 
    $list.Add("RowKey")
    $list.Add("ID")
    $list.Add("Name")
    
    #Set query details.
    $query.FilterString = "ID gt 0"
    $query.SelectColumns = $list
    $query.TakeCount = 20
    
    #Execute the query.
    $entities = $table.CloudTable.ExecuteQuery($query)
    
    #Display entity properties with the table format.
    $entities  | Format-Table PartitionKey, RowKey, @{ Label = "Name"; Expression={$_.Properties["Name"].StringValue}}, @{ Label = "ID"; Expression={$_.Properties[“ID”].Int32Value}} -AutoSize 

#### How to delete table entities
You can delete an entity using its partition and row keys. The following example assumes that you’ve already run the script given in the How to add entities section of this guide. The example first establishes a connection to Azure Storage using the storage context, which includes the storage account name and its access key. Next, it tries to retrieve the previously created “Employees” table using the [Get-AzureStorageTable](http://msdn.microsoft.com/library/azure/dn806411.aspx) cmdlet. If the table exists, the example calls the [Microsoft.WindowsAzure.Storage.Table.TableOperation.Retrieve](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.table.tableoperation.retrieve.aspx) method to retrieve an entity based on its partition and row key values. Then, pass the entity to the  [Microsoft.WindowsAzure.Storage.Table.TableOperation.Delete](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.table.tableoperation.delete.aspx) method to delete. 

    #Define the storage account and context.
    $StorageAccountName = "yourstorageaccount"
    $StorageAccountKey = "Storage key for yourstorageaccount ends with =="
    $Ctx = New-AzureStorageContext –StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey
    
    #Retrieve the table.
    $TableName = "Employees"
    $table = Get-AzureStorageTable -Name $TableName -Context $Ctx -ErrorAction Ignore

    #If the table exists, start deleting its entities.
    if ($table -ne $null)
    {
       #Together the PartitionKey and RowKey uniquely identify every  
       #entity within a table.
       $tableResult = $table.CloudTable.Execute([Microsoft.WindowsAzure.Storage.Table.TableOperation]::Retrieve(“Partition2”, "Row1"))
       $entity = $tableResult.Result;
    if ($entity -ne $null) 
    {
       #Delete the entity.$table.CloudTable.Execute([Microsoft.WindowsAzure.Storage.Table.TableOperation]::Delete($entity))
    }
    }

## How to manage Azure queues and queue messages
Azure Queue storage is a service for storing large numbers of messages that can be accessed from anywhere in the world via authenticated calls using HTTP or HTTPS. This section assumes that you are already familiar with the Azure Queue Storage Service concepts. For detailed information, see [How to use Queue Storage from .NET](storage-dotnet-how-to-use-queues.md).

This section will show you how to manage Azure Queue storage service using Azure PowerShell. The scenarios covered include **inserting** and **deleting** queue messages, as well as **creating**, **deleting**, and **retrieving queues**.
 
### How to create a queue
The following example first establishes a connection to Azure Storage using the storage account context, which includes the storage account name and its access key. Next, it calls [New-AzureStorageQueue](http://msdn.microsoft.com/library/azure/dn806382.aspx) cmdlet to create a queue named ‘queuename’. 

    #Define the storage account and context.
    $StorageAccountName = "yourstorageaccount"
    $StorageAccountKey = "Storage key for yourstorageaccount ends with =="
    $Ctx = New-AzureStorageContext –StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey
    $QueueName = "queuename"
    $Queue = New-AzureStorageQueue –Name $QueueName -Context $Ctx 

For information on naming conventions for Azure Queue Service, see [Naming Queues and Metadata](http://msdn.microsoft.com/library/azure/dd179349.aspx).

### How to retrieve a queue
You can query and retrieve a specific queue or a list of all the queues in a Storage account. The following example demonstrates how to retrieve a specified queue using the [Get-AzureStorageQueue](http://msdn.microsoft.com/library/azure/dn806377.aspx) cmdlet.

    #Retrieve a queue.
    $QueueName = "queuename"
    $Queue = Get-AzureStorageQueue –Name $QueueName –Context $Ctx 

If you call the [Get-AzureStorageQueue](http://msdn.microsoft.com/library/azure/dn806377.aspx) cmdlet without any parameters, it gets a list of all the queues.

### How to delete a queue
To delete a queue and all the messages contained in it, call the Remove-AzureStorageQueue cmdlet. The following example shows how to delete a specified queue using the Remove-AzureStorageQueue cmdlet. 

    #Delete a queue.
    $QueueName = "yourqueuename"
    Remove-AzureStorageQueue –Name $QueueName –Context $Ctx 

### How to manage queue messages
Currently, Azure PowerShell does not provide cmdlets to manage queue messages directly. To perform operations on queue messages, you can use the classes given in the [Azure Storage Client Library for .NET](http://msdn.microsoft.com/library/azure/wa_storage_30_reference_home.aspx). 

#### How to insert a message into a queue
To insert a message into an existing queue, first create a new instance of the [Microsoft.WindowsAzure.Storage.Queue.CloudQueueMessage](http://msdn.microsoft.com/library/azure/jj732474.aspx) class. Next, call the [AddMessage](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.queue.cloudqueue.addmessage.aspx) method. A CloudQueueMessage can be created from either a string (in UTF-8 format) or a byte array.
 
The following example demonstrates how to add message to a queue. The example first establishes a connection to Azure Storage using the storage account context, which includes the storage account name and its access key. Next, it retrieves the specified queue using the [Get-AzureStorageQueue](https://msdn.microsoft.com/library/azure/dn806377.aspx) cmdlet. If the queue exists, the [New-Object](http://technet.microsoft.com/library/hh849885.aspx) cmdlet is used to create an instance of the [Microsoft.WindowsAzure.Storage.Queue.CloudQueueMessage](http://msdn.microsoft.com/library/azure/jj732474.aspx) class. Later, the example calls the [AddMessage](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.queue.cloudqueue.addmessage.aspx) method on this message object to add it to a queue. Here is code which retrieves a queue and inserts the message 'MessageInfo':

    #Define the storage account and context.
    $StorageAccountName = "yourstorageaccount"
    $StorageAccountKey = "Storage key for yourstorageaccount ends with =="
    $Ctx = New-AzureStorageContext –StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey
    
    #Retrieve the queue.
    $QueueName = "queuename"
    $Queue = Get-AzureStorageQueue -Name $QueueName -Context $ctx 
    
    #If the queue exists, add a new message.
    if ($Queue -ne $null)
    {
       # Create a new message using a constructor of the CloudQueueMessage class.
       $QueueMessage = New-Object "Microsoft.WindowsAzure.Storage.Queue.CloudQueueMessage" "MessageInfo"
    
       #Add a new message to the queue.
       $Queue.CloudQueue.AddMessage($QueueMessage)
    } 


#### How to de-queue at the next message
Your code de-queues a message from a queue in two steps. When you call the [Microsoft.WindowsAzure.Storage.Queue.CloudQueue.GetMessage](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.queue.cloudqueue.getmessage.aspx) method, you get the next message in a queue. A message returned from **GetMessage** becomes invisible to any other code reading messages from this queue. To finish removing the message from the queue, you must also call the [Microsoft.WindowsAzure.Storage.Queue.CloudQueue.DeleteMessage](http://msdn.microsoft.com/library/azure/microsoft.windowsazure.storage.queue.cloudqueue.deletemessage.aspx) method. This two-step process of removing a message assures that if your code fails to process a message due to hardware or software failure, another instance of your code can get the same message and try again. Your code calls **DeleteMessage** right after the message has been processed.

    #Define the storage account and context.
    $StorageAccountName = "yourstorageaccount"
    $StorageAccountKey = "Storage key for yourstorageaccount ends with =="
    $Ctx = New-AzureStorageContext –StorageAccountName $StorageAccountName -StorageAccountKey $StorageAccountKey
    
    #Retrieve the queue.
    $QueueName = "queuename"
    $Queue = Get-AzureStorageQueue -Name $QueueName -Context $ctx
    
    $InvisibleTimeout = [System.TimeSpan]::FromSeconds(10)
    
    #Get the message object from the queue.
    $QueueMessage = $Queue.CloudQueue.GetMessage($InvisibleTimeout)
    #Delete the message.
    $Queue.CloudQueue.DeleteMessage($QueueMessage) 

## How to manage Azure file shares and files
Azure File storage offers shared storage for applications using the standard SMB 2.1 protocol. Microsoft Azure virtual machines and cloud services can share file data across application components via mounted shares, and on-premises applications can access file data in a share via the File storage API or Azure PowerShell.

For more information on Azure File storage, see [How to use Azure File storage](storage-dotnet-how-to-use-files.md) and [File Service REST API](http://msdn.microsoft.com/library/azure/dn167006.aspx).

## How to set and query storage analytics
You can use [Azure Storage Analytics](storage-analytics.md) to collect metrics for your Azure storage accounts and log data about requests sent to your storage account. You can use storage metrics to monitor the health of a storage account, and storage logging to diagnose and troubleshoot issues with your storage account.
By default, storage metrics is not enabled for your storage services. You can enable monitoring using either the Azure Management Portal, Windows PowerShell, or programmatically through a storage API. Storage logging happens server-side and enables you to record details for both successful and failed requests in your storage account. These logs enable you to see details of read, write, and delete operations against your tables, queues, and blobs as well as the reasons for failed requests.

To learn how to enable and view Storage Metrics data using PowerShell, see [How to enable Storage Metrics using PowerShell](http://msdn.microsoft.com/library/azure/dn782843.aspx#HowtoenableStorageMetricsusingPowerShell).

To learn how to enable and retrieve Storage Logging data using PowerShell, see 
[How to enable Storage Logging using PowerShell](http://msdn.microsoft.com/library/azure/dn782840.aspx#HowtoenableStorageLoggingusingPowerShell) and [Finding your Storage Logging log data](http://msdn.microsoft.com/library/azure/dn782840.aspx#FindingyourStorageLogginglogdata).
For detailed information on using Storage Metrics and Storage Logging to troubleshoot storage issues, see [Monitoring, Diagnosing, and Troubleshooting Microsoft Azure Storage](./storage-monitoring-diagnosing-troubleshooting.md).

## How to manage Shared Access Signature (SAS) and Stored Access Policy
Shared access signatures are an important part of the security model for any application using Azure Storage. They are useful for providing limited permissions to your storage account to clients that should not have the account key. By default, only the owner of the storage account may access blobs, tables, and queues within that account. If your service or application needs to make these resources available to other clients without sharing your access key, you have three options:

- Set a container's permissions to permit anonymous read access to the container and its blobs. This is not allowed for tables or queues.
- Use a shared access signature that grants restricted access rights to containers, blobs, queues, and tables for a specific time interval.
- Use a stored access policy to obtain an additional level of control over shared access signatures for a container or its blobs, for a queue, or for a table. The stored access policy allows you to change the start time, expiry time, or permissions for a signature, or to revoke it after it has been issued.

A shared access signature can be in one of two forms:

- **Ad hoc SAS**: When you create an ad hoc SAS, the start time, expiry time, and permissions for the SAS are all specified on the SAS URI. This type of SAS may be created on a container, blob, table, or queue and it is non-revokable.
- **SAS with stored access policy**: A stored access policy is defined on a resource container a blob container, table, or queue - and you can use it to manage constraints for one or more shared access signatures. When you associate a SAS with a stored access policy, the SAS inherits the constraints - the start time, expiry time, and permissions - defined for the stored access policy. This type of SAS is revokable.

For more information, see [the Shared Access Signatures tutorial](storage-dotnet-shared-access-signature-part-1.md) and [Manage Access to Azure Storage Resources](storage-manage-access-to-resources.md).

In the next sections, you will learn how to create a shared access signature token and stored access policy for Azure tables. Azure PowerShell provides similar cmdlets for containers, blobs, and queues as well. To run the scripts in this section, download the [Azure PowerShell version 0.8.14](http://go.microsoft.com/?linkid=9811175&clcid=0x409) or later.

### How to create a policy based Shared Access Signature token
Use the New-AzureStorageTableStoredAccessPolicy cmdlet to create a new stored access policy. Then, call the [New-AzureStorageTableSASToken](http://msdn.microsoft.com/library/azure/dn806400.aspx) cmdlet to create a new policy-based shared access signature token for an Azure Storage table.

    $policy = "policy1"
    New-AzureStorageTableStoredAccessPolicy -Name $tableName -Policy $policy -Permission "rd" -StartTime "2015-01-01" -ExpiryTime "2016-01-01" -Context $Ctx
    New-AzureStorageTableSASToken -Name $tableName -Policy $policy -Context $Ctx

### How to create an ad hoc (non-revokable) Shared Access Signature token
Use the [New-AzureStorageTableSASToken](http://msdn.microsoft.com/library/azure/dn806400.aspx) cmdlet to create a new ad hoc (non-revokable) Shared Access Signature token for an Azure Storage table:

    New-AzureStorageTableSASToken -Name $tableName -Permission "rqud" -StartTime "2015-01-01" -ExpiryTime "2015-02-01" -Context $Ctx

### How to create a stored access policy
Use the New-AzureStorageTableStoredAccessPolicy cmdlet to create a new stored access policy for an Azure Storage table:

    $policy = "policy1"
    New-AzureStorageTableStoredAccessPolicy -Name $tableName -Policy $policy -Permission "rd" -StartTime "2015-01-01" -ExpiryTime "2016-01-01" -Context $Ctx

### How to update a stored access policy
Use the Set-AzureStorageTableStoredAccessPolicy cmdlet to update an existing stored access policy for an Azure Storage table:

    Set-AzureStorageTableStoredAccessPolicy -Policy $policy -Table $tableName -Permission "rd" -NoExpiryTime -NoStartTime -Context $Ctx

### How to delete a stored access policy
Use the Remove-AzureStorageTableStoredAccessPolicy cmdlet to delete a stored access policy on an Azure Storage table:

    Remove-AzureStorageTableStoredAccessPolicy -Policy $policy -Table $tableName -Context $Ctx


## How to use Azure Storage for U.S. government and Azure China
An Azure environment is an independent deployment of Microsoft Azure, such as [Azure Government for U.S. government](http://azure.microsoft.com/features/gov/), [AzureCloud for global Azure](https://manage.windowsazure.com), and [AzureChinaCloud for Azure operated by 21Vianet in China](http://www.windowsazure.cn/). You can deploy new Azure environments for U.S government and Azure China. 

To use Azure Storage with AzureChinaCloud, you need to create a storage context that is associated with AzureChinaCloud. Follow these steps to get you started:

1.	Run the [Get-AzureEnvironment](https://msdn.microsoft.com/library/azure/dn790368.aspx) cmdlet to see the available Azure environments:

    `Get-AzureEnvironment`

2.	Add an Azure China account to Windows PowerShell:

    `Add-AzureAccount –Environment AzureChinaCloud`

3.	Create a storage context for an AzureChinaCloud account:

    	$Ctx = New-AzureStorageContext -StorageAccountName $AccountName -StorageAccountKey $AccountKey> -Environment AzureChinaCloud

To use Azure Storage with [U.S. Azure Government](http://azure.microsoft.com/features/gov/), you should define a new environment and then create a new storage context with this environment:

1. Call the [Add-AzureEnvironment](http://msdn.microsoft.com/library/azure/dn790364.aspx) cmdlet to create a new Azure environment for your private datacenter. 

    	Add-AzureEnvironment -Name $EnvironmentName -PublishSettingsFileUrl $publishSettingsFileUrl -ServiceEndpoint $serviceEndpoint -ManagementPortalUrl $managementPortalUrl -StorageEndpoint $storageEndpoint -ActiveDirectoryEndpoint $activeDirectoryEndpoint -ResourceManagerEndpoint $resourceManagerEndpoint -GalleryEndpoint $galleryEndpoint -ActiveDirectoryServiceEndpointResourceId $activeDirectoryServiceEndpointResourceId -GraphEndpoint $graphEndpoint -SubscriptionDataFile $subscriptionDataFile

2. Run the [New-AzureStorageContext](http://msdn.microsoft.com/library/azure/dn806380.aspx) cmdlet to create a new storage context for this new environment as shown below. 
   
	    $Ctx = New-AzureStorageContext -StorageAccountName $AccountName -StorageAccountKey $AccountKey> -Environment $EnvironmentName

For more information, see:

- [Microsoft Azure Government Developer Guide](azure-government-developer-guide.md). 
- [Differences between AzureCloud for global Azure and AzureChinaCloud for Azure operated by 21Vianet in China](https://msdn.microsoft.com/library/azure/dn578439.aspx)

## Next Steps
In this guide, you've learned how to manage Azure Storage with Azure PowerShell. Here are some related articles and resources for learning more about them.

- [Azure Storage Documentation](http://azure.microsoft.com/documentation/services/storage/)
- [Azure Storage MSDN Reference](http://msdn.microsoft.com/library/azure/gg433040.aspx)
- [Azure Storage PowerShell Cmdlets](http://msdn.microsoft.com/library/azure/dn806401.aspx)
- [Windows PowerShell Reference](https://msdn.microsoft.com/library/ms714469.aspx)

[Image1]: ./media/storage-powershell-guide-full/Subscription_currentportal.png
[Image2]: ./media/storage-powershell-guide-full/Subscription_Previewportal.png
[Image3]: ./media/storage-powershell-guide-full/Blobdownload.png


[Getting started with Azure Storage and PowerShell in 5 minutes]: #getstart
[Prerequisites for using Azure PowerShell with Azure Storage]: #pre
[How to manage storage accounts in Azure]: #manageaccount
[How to set a default Azure subscription]: #setdefsub
[How to create a new Azure storage account]: #createaccount
[How to set a default Azure storage account]: #defaultaccount
[How to list all Azure storage accounts in a subscription]: #listaccounts
[How to create an Azure storage context]: #createctx
[How to manage Azure blobs and blob snapshots]: #manageblobs
[How to create a container]: #container
[How to upload a blob into a container]: #uploadblob
[How to download blobs from a container]: #downblob
[How to copy blobs from one storage container to another]: #copyblob
[How to delete a blob]: #deleteblob
[How to manage Azure blob snapshots]: #manageshots
[How to create a blob snapshot]: #createshot
[How to list snapshots of a blob]: #listshot
[How to copy a snapshot of a blob]: #copyshot
[How to manage Azure tables and table entities]: #managetables
[How to create a table]: #createtable
[How to retrieve a table]: #gettable
[How to delete a table]: #remtable
[How to manage table entities]: #mngentity
[How to add table entities]: #addentity
[How to query table entities]: #queryentity
[How to delete table entities]: #deleteentity
[How to manage Azure queues and queue messages]: #managequeues
[How to create a queue]: #createqueue
[How to retrieve a queue]: #getqueue
[How to delete a queue]: #remqueue
[How to manage queue messages]: #mngqueuemsg
[How to insert a message into a queue]: #addqueuemsg
[How to de-queue at the next message]: #dequeuemsg
[How to manage Azure file shares and files]: #files
[How to set and query storage analytics]: #stganalytics
[How to manage Shared Access Signature (SAS) and Stored Access Policy]: #sas
[How to use Azure Storage for U.S. government and Azure China]: #gov
[Next Steps]: #next
