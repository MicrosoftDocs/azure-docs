<properties
			pageTitle="How to use Azure File storage with PowerShell and .NET | Microsoft Azure"
            description="Learn how to use Azure File storage to create cloud file shares and manage file content. File storage enables enterprises to move applications that rely on SMB file shares to Azure. Persist your storage account credentials for the virtual machine so as to reconnect to the file share on reboot."
            services="storage"
            documentationCenter=".net"
            authors="tamram"
            manager="adinah"
            editor="" />

<tags ms.service="storage"
      ms.workload="storage"
      ms.tgt_pltfrm="na"
      ms.devlang="dotnet"
      ms.topic="hero-article"
      ms.date="08/04/2015"
      ms.author="tamram" />

# How to use Azure File storage with PowerShell and .NET

## Overview

The Azure File service exposes file shares using the standard SMB 2.1 protocol. Applications running in Azure can now easily share files between VMs using standard and familiar file system APIs like ReadFile and WriteFile. In addition, the files can also be accessed at the same time via a REST interface, which opens a variety of hybrid scenarios. Finally, Azure Files is built on the same technology as the Blob, Table, and Queue services, which means Azure Files is able to leverage the existing availability, durability, scalability, and geo-redundancy that is built into the Azure storage platform.

## About this tutorial

This getting started tutorial demonstrates the basics of using Microsoft Azure File storage. In this tutorial, we will:

- Use Azure PowerShell to show how to create a new Azure File share, add a directory, upload a local file to the share, and list the files in the directory.
- Mount the file share from an Azure virtual machine, just as you would mount any SMB share.
- Use the Azure Storage Client Library for .NET to access the file share from an on-premise application. Create a console application and perform these actions with the file share:
	- Write the contents of a file in the share to the console window.
	- Set the quota (maximum size) for the file share.
	- Create a shared access signature for a file that uses a shared access policy defined on the share.
	- Copy a file to another file in the same storage account.
	- Copy a file to a blob in the same storage account.

[AZURE.INCLUDE [storage-dotnet-client-library-version-include](../../includes/storage-dotnet-client-library-version-include.md)]

[AZURE.INCLUDE [storage-file-concepts-include](../../includes/storage-file-concepts-include.md)]


## Create an Azure storage account

Azure File storage is currently in preview. To request access to the preview, navigate to the [Azure preview portal](/services/preview/), and request access to **Azure Files**. Once your request is approved, you'll be notified that you can access the File storage preview. You can then create a storage account for accessing File storage.

> [AZURE.NOTE] File storage is currently available only for new storage accounts. After your subscription is granted access to File storage, create a new storage account for use with this guide.
>
> Azure File storage does not currently support shared access signatures.

[AZURE.INCLUDE [storage-create-account-include](../../includes/storage-create-account-include.md)]

## Use PowerShell to create a file share

Next, we'll use Azure PowerShell to create a file share. Once the file share has been created, you can mount it from any file system that supports SMB 2.1.

### Install the PowerShell cmdlets for Azure Storage

To prepare to use PowerShell, download and install the Azure PowerShell cmdlets. See [How to install and configure Azure PowerShell](../install-configure-powershell.md) for the install point and installation instructions.

> [AZURE.NOTE] The PowerShell cmdlets for the File service are available only in the latest Azure PowerShell module, version 0.8.5 and later. It's recommended that you download and install or upgrade to the latest Azure PowerShell module.

Open an Azure PowerShell window by clicking **Start** and typing **Azure PowerShell**. The Azure PowerShell window loads the Azure Powershell module for you.

### Create a context for your storage account and key

Now, create the storage account context. The context encapsulates the storage account name and account key. For instructions on copying your account key from the Azure portal, see [View, copy, and regenerate storage access keys](storage-create-storage-account.md#view-copy-and-regenerate-storage-access-keys).

Replace `storage-account-name` and `storage-account-key` with your storage account name and key in the following example.

	# create a context for account and key
	$ctx=New-AzureStorageContext storage-account-name storage-account-key

### Create a new file share

Next, create the new share, named `logs`.

	# create a new share
	$s = New-AzureStorageShare logs -Context $ctx

You now have a file share in File storage. Next we'll add a directory and a file.

> [AZURE.IMPORTANT] The name of your file share must be all lowercase. For complete details on naming file shares and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](https://msdn.microsoft.com/library/azure/dn167011.aspx).

### Create a directory in the file share

Next, create a directory in the share. In the following example, the directory is named `CustomLogs`.

    # create a directory in the share
    New-AzureStorageDirectory -Share $s -Path CustomLogs

### Upload a local file to the directory

Now upload a local file to the directory. The following example uploads a file from `C:\temp\Log1.txt`. Edit the file path so that it points to a valid file on your local machine.

    # upload a local file to the new directory
    Set-AzureStorageFileContent -Share $s -Source C:\temp\Log1.txt -Path CustomLogs

### List the files in the directory

To see the file in the directory, you can list the directory's files. This command will also list subdirectories, but in this example, there is no subdirectory, so only the file will be listed.

	# list files in the new directory
	Get-AzureStorageFile -Share $s -Path CustomLogs

## Mount the share from an Azure virtual machine running Windows

To demonstrate how to mount an Azure file share, we'll now create an Azure virtual machine running Windows, and remote into it to mount the share.

1. First, create a new Azure virtual machine by following the instructions in [Create a virtual machine running Windows Server](../virtual-machines-windows-tutorial.md).
2. Next, remote into the virtual machine by following the instructions in [How to log on to a virtual machine running Windows Server](../virtual-machines-log-on-windows-server.md).
3. Open a PowerShell window on the virtual machine.

### Persist your storage account credentials for the virtual machine

Before mounting to the file share, first persist your storage account credentials on the virtual machine. This step allows Windows to automatically reconnect to the file share when the virtual machine reboots. To persist your account credentials, run the `cmdkey` command from the PowerShell window on the virtual machine. Replace `<storage-account-name>` with the name of your storage account, and `<storage-account-key>` with your storage account key.

	cmdkey /add:<storage-account-name>.file.core.windows.net /user:<storage-account-name> /pass:<storage-account-key>

Windows will now reconnect to your file share when the virtual machine reboots. You can verify that the share has been reconnected by running the `net use` command from a PowerShell window.

### Mount the file share using the persisted credentials

Once you have a remote connection to the virtual machine, you can run the `net use` command to mount the file share, using the following syntax. Replace `<storage-account-name>` with the name of your storage account, and `<share-name>` with the name of your File storage share.

    net use <drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name>

	example :
	net use z: \\samples.file.core.windows.net\logs

Since you persisted your storage account credentials in the previous step, you do not need to provide them with the `net use` command. If you have not already persisted your credentials, then include them as a parameter passed to the `net use` command, as shown in the following example.

    net use <drive-letter>: \\<storage-account-name>.file.core.windows.net\<share-name> /u:<storage-account-name> <storage-account-key>

	example :
	net use z: \\samples.file.core.windows.net\logs /u:samples <storage-account-key>

You can now work with the File Storage share from the virtual machine as you
would with any other drive. You can issue standard file commands from the command prompt, or view the mounted share and its contents from File Explorer. You can also run code within the virtual machine that accesses the file share using standard Windows file I/O APIs, such as those provided by the [System.IO namespaces](http://msdn.microsoft.com/library/gg145019.aspx) in the .NET Framework.

You can also mount the file share from a role running in an Azure cloud service by remoting into the role.

## Create an on-premises application to work with File storage

You can mount the file share from a virtual machine or a cloud service running in Azure, as demonstrated earlier. However, you cannot mount the file share from an on-premises application. To access share data from an on-premises application, you must use the File storage API. This example demonstrates how to work with a file share via the [Azure .NET Storage Client Library](http://go.microsoft.com/fwlink/?LinkID=390731&clcid=0x409).

To show how to use the API from an on-premises application, we'll create a simple console application running on the desktop.

### Create the console application and obtain the assembly

To create a new console application in Visual Studio and install the Azure Storage NuGet package:

1. In Visual Studio, choose **File** -> **New Project**, and choose **Windows** -> **Console Application** from the list of Visual C# templates.
2. Provide a name for the console application, and then click **OK**.
3. Once your project has been created, right-click the project in Solution Explorer and choose **Manage NuGet Packages**. Search online for "WindowsAzure.Storage" and click **Install** to install the Azure Storage package and dependencies.

### Save your storage account credentials to the app.config file

Next, save your credentials in your project's app.config file. Edit the app.config file so that it appears similar to the following example, replacing `myaccount` with your storage account name, and `mykey` with your storage account key.

	<?xml version="1.0" encoding="utf-8" ?>
	<configuration>
	    <startup>
	        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5" />
	    </startup>
	    <appSettings>
	        <add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=StorageAccountKeyEndingIn==" />
	    </appSettings>
	</configuration>

> [AZURE.NOTE] The latest version of the Azure storage emulator does not support File storage. Your connection string must target an Azure storage account in the cloud with access to the Files preview.


### Add namespace declarations

Open the program.cs file from Solution Explorer, and add the following namespace declarations to the top of the file.

	using Microsoft.WindowsAzure;
	using Microsoft.WindowsAzure.Storage;
	using Microsoft.WindowsAzure.Storage.Blob;
	using Microsoft.WindowsAzure.Storage.File;

### Retrieve your connection string programmatically

You can retrieve your saved credentials from the app.config file using either the `Microsoft.WindowsAzure.CloudConfigurationManager` class, or the `System.Configuration.ConfigurationManager `class. The Microsoft Azure Configuration Manager package, which includes the `Microsoft.WindowsAzure.CloudConfigurationManager` class, is available on [Nuget](https://www.nuget.org/packages/Microsoft.WindowsAzure.ConfigurationManager).

The example here shows how to retrieve your credentials using the `CloudConfigurationManager` class and encapsulate them with the `CloudStorageAccount` class. Add the following code to the `Main()` method in program.cs.

    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    	CloudConfigurationManager.GetSetting("StorageConnectionString"));

### Access the file share programmatically

Next, add the following code to the `Main()` method, after the code shown earlier to retrieve the connection string. This code gets a reference to the file we created earlier and outputs its contents to the console window.

	//Create a CloudFileClient object for credentialed access to File storage.
	CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

	//Get a reference to the file share we created previously.
	CloudFileShare share = fileClient.GetShareReference("logs");

	//Ensure that the share exists.
	if (share.Exists())
	{
	    //Get a reference to the root directory for the share.
	    CloudFileDirectory rootDir = share.GetRootDirectoryReference();

	    //Get a reference to the directory we created previously.
	    CloudFileDirectory sampleDir = rootDir.GetDirectoryReference("CustomLogs");

	    //Ensure that the directory exists.
	    if (sampleDir.Exists())
	    {
	        //Get a reference to the file we created previously.
	        CloudFile file = sampleDir.GetFileReference("Log1.txt");

	        //Ensure that the file exists.
	        if (file.Exists())
	        {
	            //Write the contents of the file to the console window.
	            Console.WriteLine(file.DownloadTextAsync().Result);
	        }
	    }
	}

Run the console application to see the output.

## Set the maximum size for a file share

Beginning with version 5.x of the Azure Storage Client Library, you can set set the quota (or maximum size) for a share, in gigabytes. By setting the quota for a share, you can limit the total size of the files stored on the share.

If the total size of files on the share exceeds the quota set on the share, then clients will be unable to increase the size of existing files or create new files, unless they are empty.

The following example shows how to set the quota for an existing file share.

    //Parse the connection string for the storage account.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        Microsoft.Azure.CloudConfigurationManager.GetSetting("StorageConnectionString"));

    //Create a CloudFileClient object for credentialed access to File storage.
    CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

    //Get a reference to the file share we created previously.
    CloudFileShare share = fileClient.GetShareReference("logs");

    //Ensure that the share exists.
    if (share.Exists())
    {
		//Specify the maximum size of the share, in GB.
	    share.Properties.Quota = 100;
	    share.SetProperties();
	}

To get the value of any existing quota for the share, call the **FetchAttributes()** method to retrieve the share's properties.

## Generate a shared access signature for a file or file share

Beginning with version 5.x of the Azure Storage Client Library, you can generate a shared access signature (SAS) for a file share or for an individual file. You can also create a shared access policy on a file share to manage shared access signatures. Creating a shared access policy is recommended, as it provides a means of revoking the SAS if it should be compromised.

The following example creates a shared access policy on a share, and then uses that policy to provide the constraints for a SAS on a file in the share.

    //Parse the connection string for the storage account.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        Microsoft.Azure.CloudConfigurationManager.GetSetting("StorageConnectionString"));

    //Create a CloudFileClient object for credentialed access to File storage.
    CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

    //Get a reference to the file share we created previously.
    CloudFileShare share = fileClient.GetShareReference("logs");

    //Ensure that the share exists.
    if (share.Exists())
    {
        string policyName = "sampleSharePolicy" + DateTime.UtcNow.Ticks;

        //Create a new shared access policy and define its constraints.
        SharedAccessFilePolicy sharedPolicy = new SharedAccessFilePolicy()
            {
                SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24),
                Permissions = SharedAccessFilePermissions.Read | SharedAccessFilePermissions.Write
            };

        //Get existing permissions for the share.
        FileSharePermissions permissions = share.GetPermissions();

        //Add the shared access policy to the share's policies. Note that each policy must have a unique name.
        permissions.SharedAccessPolicies.Add(policyName, sharedPolicy);
        share.SetPermissions(permissions);

        //Generate a SAS for a file in the share and associate this access policy with it.
        CloudFileDirectory rootDir = share.GetRootDirectoryReference();
        CloudFileDirectory sampleDir = rootDir.GetDirectoryReference("CustomLogs");
        CloudFile file = sampleDir.GetFileReference("Log1.txt");
        string sasToken = file.GetSharedAccessSignature(null, policyName);
        Uri fileSasUri = new Uri(file.StorageUri.PrimaryUri.ToString() + sasToken);

        //Create a new CloudFile object from the SAS, and write some text to the file.
        CloudFile fileSas = new CloudFile(fileSasUri);
        fileSas.UploadText("This write operation is authenticated via SAS.");
        Console.WriteLine(fileSas.DownloadText());
    }

For more information about creating and using shared access signatures, see [Shared Access Signatures: Understanding the SAS model](storage-dotnet-shared-access-signature-part-1.md) and [Create and use a SAS with the Blob service](storage-dotnet-shared-access-signature-part-2.md).

## Copy files

Beginning with version 5.x of the Azure Storage Client Library, you can copy a file to another file, a file to a blob, or a blob to a file. In the next sections we demonstrate how to perform these copy operations programmatically.

You can also use AzCopy to copy one file to another or to copy a blob to a file or vice versa. See [How to use AzCopy with Microsoft Azure Storage](storage-use-azcopy.md#copy-files-in-azure-file-storage-with-azcopy-preview-version-only) for details about copying files with AzCopy.

> [AZURE.NOTE] If you are copying a blob to a file, or a file to a blob, you must use a shared access signature (SAS) to authenticate the source object, even if you are copying within the same storage account.

### Copy a file to another file

The following example copies a file to another file in the same share. Because this copy operation copies between files in the same storage account, you can use Shared Key authentication to perform the copy.

    //Parse the connection string for the storage account.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        Microsoft.Azure.CloudConfigurationManager.GetSetting("StorageConnectionString"));

    //Create a CloudFileClient object for credentialed access to File storage.
    CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

    //Get a reference to the file share we created previously.
    CloudFileShare share = fileClient.GetShareReference("logs");

    //Ensure that the share exists.
    if (share.Exists())
    {
        //Get a reference to the root directory for the share.
        CloudFileDirectory rootDir = share.GetRootDirectoryReference();

        //Get a reference to the directory we created previously.
        CloudFileDirectory sampleDir = rootDir.GetDirectoryReference("CustomLogs");

        //Ensure that the directory exists.
        if (sampleDir.Exists())
        {
            //Get a reference to the file we created previously.
            CloudFile sourceFile = sampleDir.GetFileReference("Log1.txt");

            //Ensure that the source file exists.
            if (sourceFile.Exists())
            {
                //Get a reference to the destination file.
                CloudFile destFile = sampleDir.GetFileReference("Log1Copy.txt");

                //Start the copy operation.
                destFile.StartCopy(sourceFile);

                //Write the contents of the destination file to the console window.
                Console.WriteLine(destFile.DownloadText());
            }
        }
    }


### Copy a file to a blob

The following example creates a file and copies it to a blob within the same storage account. The example creates a SAS for the source file, which the service uses to authenticate access to the source file during the copy operation.

    //Parse the connection string for the storage account.
    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        Microsoft.Azure.CloudConfigurationManager.GetSetting("StorageConnectionString"));

    //Create a CloudFileClient object for credentialed access to File storage.
    CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

    //Create a new file share, if it does not already exist.
    CloudFileShare share = fileClient.GetShareReference("sample-share");
    share.CreateIfNotExists();

    //Create a new file in the root directory.
    CloudFile sourceFile = share.GetRootDirectoryReference().GetFileReference("sample-file.txt");
    sourceFile.UploadText("A sample file in the root directory.");

    //Get a reference to the blob to which the file will be copied.
    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
    CloudBlobContainer container = blobClient.GetContainerReference("sample-container");
    container.CreateIfNotExists();
    CloudBlockBlob destBlob = container.GetBlockBlobReference("sample-blob.txt");

    //Create a SAS for the file that's valid for 24 hours.
    //Note that when you are copying a file to a blob, or a blob to a file, you must use a SAS
    //to authenticate access to the source object, even if you are copying within the same
    //storage account.
    string fileSas = sourceFile.GetSharedAccessSignature(new SharedAccessFilePolicy()
    {
        //Only read permissions are required for the source file.
        Permissions = SharedAccessFilePermissions.Read,
        SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24)
    });

    //Construct the URI to the source file, including the SAS token.
    Uri fileSasUri = new Uri(sourceFile.StorageUri.PrimaryUri.ToString() + fileSas);

    //Copy the file to the blob.
    destBlob.StartCopy(fileSasUri);

    //Write the contents of the file to the console window.
    Console.WriteLine("Source file contents: {0}", sourceFile.DownloadText());
    Console.WriteLine("Destination blob contents: {0}", destBlob.DownloadText());

You can copy a blob to a file in the same way. If the source object is a blob, then create a SAS to authenticate access to that blob during the copy operation.

## Use File storage with Linux

To create and manage a file share from Linux, use the Azure CLI. See [Using the Azure CLI with Azure Storage](storage-azure-cli.md#create-and-manage-file-shares) for information about using the Azure CLI with File storage.

You can mount an Azure file share from a virtual machine running Linux. When you create your Azure virtual machine, you can specify a Linux image which supports SMB 2.1 from Azure image gallery, such as the latest version of Ubuntu. However, any Linux distribution that supports SMB 2.1 can mount the Azure file share.

To learn more about how to mount an Azure File share on Linux, see [Shared storage on Linux via Azure Files Preview - Part 1](http://channel9.msdn.com/Blogs/Open/Shared-storage-on-Linux-via-Azure-Files-Preview-Part-1) on Channel 9.

## Next steps

See these links for more information about Azure File storage.

### Tutorials and reference

- [Storage Client Library for .NET reference](https://msdn.microsoft.com/library/azure/dn261237.aspx)
- [File Service REST API reference](http://msdn.microsoft.com/library/azure/dn167006.aspx)
- [Use AzCopy with Microsoft Azure Storage](storage-use-azcopy.md)
- [Using Azure PowerShell with Azure Storage](storage-powershell-guide-full.md)
- [Using the Azure CLI with Azure Storage](storage-azure-cli.md)

### Blog posts

- [Introducing Microsoft Azure File Service](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/12/introducing-microsoft-azure-file-service.aspx)
- [Persisting connections to Microsoft Azure Files](http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/27/persisting-connections-to-microsoft-azure-files.aspx)
