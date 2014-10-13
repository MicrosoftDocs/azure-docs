<properties urlDisplayName="File Service" pageTitle="How to use Azure File storage | Microsoft Azure" metaKeywords="Get started Azure file  Azure file share  Azure file shares  Azure file   Azure file storage   Azure file .NET   Azure file C#   Azure file PowerShell" description="Learn how to use Microsoft Azure File storage to create file shares and manage file content. Samples are written in PowerShell and C#." metaCanonical="" disqusComments="1" umbracoNaviHide="1" services="storage" documentationCenter=".NET" title="How to use Microsoft Azure File storage in .NET" authors="tamram" manager="adinah" editor="cgronlun" />

<tags ms.service="storage" ms.workload="storage" ms.tgt_pltfrm="na" ms.devlang="dotnet" ms.topic="article" ms.date="01/01/1900" ms.author="tamram" />

# How to use Azure File storage

In this getting started guide, we demonstrate the basics of using Microsoft Azure File storage. First we use PowerShell to show how to create a new Azure File share, add a directory, upload a local file to the share, and list the files in the directory. Then we show how to mount the file share from an Azure virtual machine, just as you would any SMB share.

For users who may want to access files in a share from an on-premise application as well as from an Azure virtual machine or cloud service, we show how to use the Azure .NET Storage Client Library to work with the file share from a desktop application.

> [WACOM.NOTE] Running the .NET code examples in this guide requires the Azure .NET Storage Client Library 4.x or later. The Storage Client Library is available via [NuGet](https://www.nuget.org/packages/WindowsAzure.Storage/).


##Table of contents

-   [What is File storage?][]
-   [File storage concepts][]
-   [Create an Azure storage account][]
-   [Use PowerShell to create a file share][]
-	[Mount the share from an Azure virtual machine][]
-   [Create an on-premise application to access File storage][]
-   [Next steps][]


##<a name="what-is-file-storage"></a><span class="short-header">What is Azure File storage?</span>What is Azure File storage?

File storage offers shared storage for applications using the standard SMB 2.1 protocol. Microsoft Azure virtual machines and cloud services can share file data across application components via mounted shares, and on-premise applications can access file data in a share via the File storage API.

Applications running in Azure virtual machines or cloud services can mount a File storage share to access file data, just as a desktop application would mount a typical SMB share. Any number of Azure virtual machines or roles can mount and access the File storage share simultaneously.

Since a File storage share is a standard SMB 2.1 file share, applications running in Azure can access data in the share via file I/O APIs. Developers can therefore leverage their existing code and skills to migrate existing applications. IT Pros can use PowerShell cmdlets to create, mount, and manage File storage shares as part of the administration of Azure applications. This guide will show examples of both.

Common uses of File storage include:

- Migrating on-premise applications that rely on file shares to run on Azure virtual machines or cloud services, without expensive rewrites
- Storing shared application settings, for example in configuration files
- Storing diagnostic data such as logs, metrics, and crash dumps in a shared location 
- Storing tools and utilities needed for developing or administering Azure virtual machines or cloud services

##<a name="file-storage-concepts"></a><span class="short-header">File storage concepts</span>File storage concepts

File storage contains the following components:

![files-concepts][files-concepts]


-   **Storage Account:** All access to Azure Storage is done
    through a storage account. See [Azure Storage Scalability and Performance Targets](http://msdn.microsoft.com/en-us/library/dn249410.aspx) for details about storage account capacity.

-   **Share:** A File storage share is an SMB 2.1 file share in Azure. 
    All directories and files must be created in a parent share. An account can contain an
    unlimited number of shares, and a share can store an unlimited
    number of files, up to the capacity limits of the storage account.

-   **Directory:** An optional hierarchy of directories. 

-	**File:** A file in the share. A file may be up to 1 TB in size.

-   **URL format:** Files are addressable using the following URL
    format:   
    https://`<storage
    account>`.file.core.windows.net/`<share>`/`<directory/directories>`/`<file>`  
    
    The following example URL could be used to address one of the files in the
    diagram above:  
    `http://acmecorp.file.core.windows.net/cloudfiles/diagnostics/log.txt`



For details about how to name shares, directories, and files, see [Naming and Referencing Shares, Directories, Files, and Metadata](http://msdn.microsoft.com/en-us/library/azure/dn167011.aspx).

##<a name="create-account"></a><span class="short-header">Create an Azure Storage account</span>Create an Azure Storage account

Azure File storage is currently in preview. To request access to the preview, navigate to the [Microsoft Azure Preview page](/en-us/services/preview/), and request access to **Azure Files**. Once your request is approved, you'll be notified that you can access the File storage preview. You can then create a storage account for accessing File storage.

> [WACOM.NOTE] File storage is currently available only for new storage accounts. After your subscription is granted access to File storage, create a new storage account for use with this guide.

[WACOM.INCLUDE [create-storage-account](../includes/create-storage-account.md)]

##<a name="use-cmdlets"></a><span class="short-header">Use PowerShell to create a file share</span>Use PowerShell to create a file share

###Install the PowerShell cmdlets for Azure Storage

To prepare to use PowerShell, download and install the Azure PowerShell cmdlets. See [How to install and configure Azure PowerShell](/en-us/documentation/articles/install-configure-powershell/) for the install point and installation instructions.

> [WACOM.NOTE] The PowerShell cmdlets for the File service are available only in the latest Azure PowerShell module, version 0.8.5 and later. It's recommended that you download and install or upgrade to the latest Azure PowerShell module.

Open an Azure PowerShell window by clicking **Start** and typing **Windows Azure PowerShell**. The Azure PowerShell window loads the Azure Powershell module for you.

###Create a context for your storage account and key

Now, create the storage account context. The context encapsulates the account name and account key. Replace `account-name` and `account-key` with your account name and key in the following example:

    # create a context for account and key
    $ctx=New-AzureStorageContext account-name account-key
    
###Create a new file share

Next, create the new share, named `sampleshare` in this example:

    # create a new share
    $s = New-AzureStorageShare sampleshare -Context $ctx

You now have a file share in File storage. Next we'll add a directory and a file.

###Create a directory in the file share

Next, create a directory in the share. In the following example, the directory is named `sampledir`:

    # create a directory in the share
    New-AzureStorageDirectory -Share $s -Path sampledir

###Upload a local file to the directory

Now upload a local file to the directory. The following example uploads a file from `C:\temp\samplefile.txt`. Edit the file path so that it points to a valid file on your local machine: 
    
    # upload a local file to the new directory
    Set-AzureStorageFileContent -Share $s -Source C:\temp\samplefile.txt -Path sampledir

###List the files in the directory

To see the file in the directory, you can list the directory's files. This command will also list subdirectories, but in this example, there is no subdirectory, so only the file will be listed.  

    # list files in the new directory
    Get-AzureStorageFile -Share $s -Path sampledir

##<a name="mount-share"></a><span class="short-header">Mount the share from an Azure virtual machine</span>Mount the share from an Azure virtual machine

To demonstrate how to mount an Azure file share, we'll now create an Azure virtual machine, and remote into it to mount the share. 

1. First, create a new Azure virtual machine by following the instructions in [Create a Virtual Machine Running Windows Server](/en-us/documentation/articles/virtual-machines-windows-tutorial/).
2. Next, remote into the virtual machine by following the instructions in [How to Log on to a Virtual Machine Running Windows Server](/en-us/documentation/articles/virtual-machines-log-on-windows-server/).
3. Open a PowerShell window on the virtual machine. 

###Persist your storage account credentials for the virtual machine

Before mounting to the file share, first persist your storage account credentials on the virtual machine. This step allows Windows to automatically reconnect to the file share when the virtual machine reboots. To persist your account credentials, execute the `cmdkey` command from within the PowerShell window on the virtual machine. Replace `<storage-account>` with the name of your storage account, and `<account-key>` with your storage account key:

	cmdkey /add:<storage-account>.file.core.windows.net /user:<storage-account> /pass:<account-key>

Windows will now reconnect to your file share when the virtual machine reboots. You can verify that the share has been reconnected by executing the `net use` command from within a PowerShell window.

###Mount the file share using the persisted credentials

Once you have a remote connection to the virtual machine, you can execute the `net use` command to mount the file share, using the following syntax. Replace `<storage-account>` with the name of your storage account, and `<share-name>` with the name of your File storage share.

	net use z: \\<storage-account>.file.core.windows.net\<share-name>

> [WACOM.NOTE] Since you persisted your storage account credentials in the previous step, you do not need to provide them with the `net use` command. If you have not already persisted your credentials, then include them as a parameter passed to the `net use` command. Replace `<storage-account>` with the name of your storage account, `<share-name>` with the name of your File storage share, and `<account-key>` with your storage account key:
	   
	net use z: \\<storage-account>.file.core.windows.net\<share-name> /u:<storage-account> <account-key>

You can now work with the File storage share from within the virtual machine as you would with any other drive. You can issue standard file commands from the command prompt, or view the mounted share and its contents from File Explorer. You can also run code within the virtual machine that accesses the file share using standard Windows file I/O APIs, such as those provided by the [System.IO namespaces](http://msdn.microsoft.com/en-us/library/gg145019(v=vs.110).aspx) in the .NET Framework. 

You can also mount the file share from a role running in an Azure cloud service by remoting into the role.

##<a name="create-console-app"></a><span class="short-header">Create an on-premise application to work with File storage</span>Create a on-premise application to work with File storage

You can mount a File storage share from within a virtual machine or a cloud service running in Azure, as demonstrated above. However, you cannot mount a File storge share from an on-premise application. To access share data from an on-premise application, you must use the File storage API. This example demonstrates how to work with a file share via the [Azure .NET Storage Client Library](http://go.microsoft.com/fwlink/?LinkID=390731&clcid=0x409). 

To show how to use the API from an on-premise application, we'll create a simple console application running on the desktop.

###Create the console application and obtain the assembly

To create a new console application in Visual Studio and install the Azure Storage NuGet package:

1. In Visual Studio, choose **File** -> **New Project**, and choose **Windows** -> **Console Application** from the list of Visual C# templates.
2. Provide a name for the console application, and click **OK**.
3. Once your project has been created, right-click the project in Solution Explorer and choose **Manage NuGet Packages**. Search online for "WindowsAzure.Storage" and click **Install** to install the Azure Storage package and dependencies.

###Save your storage account credentials to the app.config file

Next, save your credentials in your project's app.config file. Edit the app.config file so that it appears similar to the following example, replacing `myaccount` with your storage account name, and `mykey` with your storage account key:

    <?xml version="1.0" encoding="utf-8" ?>
	<configuration>
		<startup> 
			<supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5" />
		</startup>
		<appSettings>
			<add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=mykey" />
		</appSettings>
	</configuration>

> [WACOM.NOTE] The latest version of the Azure storage emulator does not support File storage. Your connection string must target an Azure storage account in the cloud with access to the Files preview.


###Add namespace declarations
Open the program.cs file from Solution Explorer, and add the following namespace declarations to the top of the file:

    using Microsoft.WindowsAzure;
	using Microsoft.WindowsAzure.Storage;
	using Microsoft.WindowsAzure.Storage.File;

###Retrieve your connection string programmatically
You can retrieve your saved credentials from the app.config file using either the `Microsoft.WindowsAzure.CloudConfigurationManager` class, or the `System.Configuration.ConfigurationManager `class. The example here shows how to retrieve your credentials using the `CloudConfigurationManager` class and encapsulate them with the `CloudStorageAccount` class. Add the following code to the `Main()` method in program.cs:

    CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        CloudConfigurationManager.GetSetting("StorageConnectionString"));

###Access the File storage share programmatically

Next, add the following code to the `Main()` method, after the code shown above to retrieve the connection string. This code gets a reference to the file we created earlier and outputs its contents to the console window.

	//Create a CloudFileClient object for credentialed access to File storage.
    CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

	//Get a reference to the file share we created previously.
    CloudFileShare share = fileClient.GetShareReference("sampleshare");

	//Ensure that the share exists.
    if (share.Exists())
    {
		//Get a reference to the root directory for the share.
        CloudFileDirectory rootDir = share.GetRootDirectoryReference();

		//Get a reference to the sampledir directory we created previously.
        CloudFileDirectory sampleDir = rootDir.GetDirectoryReference("sampledir");

		//Ensure that the directory exists.
        if (sampleDir.Exists())
        {
			//Get a reference to the file we created previously.
            CloudFile file = sampleDir.GetFileReference("samplefile.txt");

			//Ensure that the file exists.
            if (file.Exists())
            {
				//Write the contents of the file to the console window.
                Console.WriteLine(file.DownloadTextAsync().Result);
            }
        }
    }

Run the console application to see the output.

## <a name="next-steps"></a><span  class="short-header">Next steps</span>Next steps

Now that you've learned the basics of File storage, follow these links
for more detailed information.
<ul>
<li>View the File service reference documentation for complete details about available APIs:
  <ul>
    <li><a href="http://go.microsoft.com/fwlink/?LinkID=390731&clcid=0x409">Storage Client Library for .NET reference</a>
    </li>
    <li><a href="http://msdn.microsoft.com/en-us/library/azure/dn167006.aspx">File Service REST API reference</a></li>
  </ul>
</li>
<li>View the Azure Storage Team's blog posts relating to the File service:
  <ul>
    <li><a href="http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/12/introducing-microsoft-azure-file-service.aspx">Introducing Microsoft Azure File Service</a>
    </li>
    <li><a href="http://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/27/persisting-connections-to-microsoft-azure-files.aspx">Persisting connections to Microsoft Azure Files</a></li>
  </ul>
</li><li>View more feature guides to learn about additional options for storing data in Azure.
  <ul>
    <li>Use <a href="/en-us/documentation/articles/storage-dotnet-how-to-use-blobs/">Blob Storage</a> to store unstructured data.</li>
    <li>Use <a href="/en-us/documentation/articles/storage-dotnet-how-to-use-tables/">Table Storage</a> to store structured data.</li>
    <li>Use <a href="/en-us/documentation/articles/storage-dotnet-how-to-use-queues/">Queue Storage</a> to store messages reliably.</li>
    <li>Use <a href="/en-us/documentation/articles/sql-database-dotnet-how-to-use/">SQL Database</a> to store relational data.</li>
  </ul>
</li>
</ul>

[Next Steps]: #next-steps
[What is File storage?]: #what-is-file-storage 
[File storage concepts]: #file-storage-concepts
[Create an Azure storage account]: #create-account
[Use PowerShell to create a file share]: #use-cmdlets
[Mount the share from an Azure virtual machine]: #mount-share
[Create an on-premise application to access File storage]: #create-console-app

[files-concepts]: ./media/storage-dotnet-how-to-use-files/files-concepts.png

