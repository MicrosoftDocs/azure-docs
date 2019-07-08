---
title: Develop for Azure Files with .NET | Microsoft Docs
description: Learn how to develop .NET applications and services that use Azure Files to store file data.
services: storage
author: roygara
ms.service: storage
ms.devlang: dotnet
ms.topic: conceptual
ms.date: 11/22/2017
ms.author: rogarana
ms.subservice: files
---

# Develop for Azure Files with .NET

[!INCLUDE [storage-selector-file-include](../../../includes/storage-selector-file-include.md)]

This tutorial demonstrates the basics of using .NET to develop applications that use [Azure Files](storage-files-introduction.md) to store file data. This tutorial creates a simple console application to perform basic actions with .NET and Azure Files:

* Get the contents of a file
* Set the quota (maximum size) for the file share.
* Create a shared access signature (SAS key) for a file that uses a shared access policy defined on the share.
* Copy a file to another file in the same storage account.
* Copy a file to a blob in the same storage account.
* Use Azure Storage Metrics for troubleshooting

To learn more about Azure Files, see [Introduction to Azure Files](storage-files-introduction.md).

[!INCLUDE [storage-check-out-samples-dotnet](../../../includes/storage-check-out-samples-dotnet.md)]

## Understanding the .NET APIs

Azure Files provides two broad approaches to client applications: Server Message Block (SMB) and REST. Within .NET, these approaches are abstracted by the `System.IO` and `WindowsAzure.Storage` APIs.

API | When to use | Notes
----|-------------|------
[System.IO](https://docs.microsoft.com/dotnet/api/system.io) | Your application: <ul><li>Needs to read/write files via SMB</li><li>Is running on a device that has access over port 445 to your Azure Files account</li><li>Doesn't need to manage any of the administrative settings of the file share</li></ul> | Coding file I/O with Azure Files over SMB is generally the same as coding I/O with any network file share or local storage device. See [this tutorial](https://docs.microsoft.com/dotnet/csharp/tutorials/console-teleprompter) for an introduction to a number of features in .NET, including file I/O.
[Microsoft.Azure.Storage.File](https://docs.microsoft.com/dotnet/api/overview/azure/storage#client-library) | Your application: <ul><li>Can't access Azure Files via SMB on port 445 due to firewall or ISP constraints</li><li>Requires administrative functionality, such as the ability to set a file share's quota or create a shared access signature</li></ul> | This article demonstrates the usage of `Microsoft.Azure.Storage.File` for file I/O using REST (instead of SMB) and management of the file share.

## Create the console application and obtain the assembly
In Visual Studio, create a new Windows console application. The following steps show you how to create a console application in Visual Studio 2017, however, the steps are similar in other versions of Visual Studio.

1. Select **File** > **New** > **Project**
2. Select **Installed** > **Templates** > **Visual C#** > **Windows Classic Desktop**
3. Select **Console App (.NET Framework)**
4. Enter a name for your application in the **Name:** field
5. Select **OK**

All code examples in this tutorial can be added to the `Main()` method of your console application's `Program.cs` file.

You can use the Azure Storage client library in any type of .NET application, including an Azure cloud service or web app, and desktop and mobile applications. In this guide, we use a console application for simplicity.

## Use NuGet to install the required packages
There are two packages you need to reference in your project to complete this tutorial:

* [Microsoft Azure Storage common library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Storage.Common/): This package provides programmatic access to common resources in your storage account.
* [Microsoft Azure Storage Blob library for .NET](https://www.nuget.org/packages/Microsoft.Azure.Storage.Blob/): This package provides programmatic access to Blob resources in your storage account.
* [Microsoft Azure Configuration Manager library for .NET](https://www.nuget.org/packages/Microsoft.Azure.ConfigurationManager/): This package provides a class for parsing a connection string in a configuration file, regardless of where your application is running.

You can use NuGet to obtain both packages. Follow these steps:

1. Right-click your project in **Solution Explorer** and choose **Manage NuGet Packages**.
2. Search online for "WindowsAzure.Storage" and click **Install** to install the Storage Client Library and its dependencies.
3. Search online for "WindowsAzure.ConfigurationManager" and click **Install** to install the Azure Configuration Manager.

## Save your storage account credentials to the app.config file
Next, save your credentials in your project's app.config file. Edit the app.config file so that it appears similar to the following example, replacing `myaccount` with your storage account name, and `mykey` with your storage account key.

```xml
<?xml version="1.0" encoding="utf-8" ?>
<configuration>
    <startup>
        <supportedRuntime version="v4.0" sku=".NETFramework,Version=v4.5" />
    </startup>
    <appSettings>
        <add key="StorageConnectionString" value="DefaultEndpointsProtocol=https;AccountName=myaccount;AccountKey=StorageAccountKeyEndingIn==" />
    </appSettings>
</configuration>
```

> [!NOTE]
> The latest version of the Azure storage emulator does not support Azure Files. Your connection string must target an Azure Storage Account in the cloud to work with Azure Files.

## Add using directives
Open the `Program.cs` file from Solution Explorer, and add the following using directives to the top of the file.

```csharp
using Microsoft.Azure; // Namespace for Azure Configuration Manager
using Microsoft.Azure.Storage; // Namespace for Storage Client Library
using Microsoft.Azure.Storage.Blob; // Namespace for Azure Blobs
using Microsoft.Azure.Storage.File; // Namespace for Azure Files
```

[!INCLUDE [storage-cloud-configuration-manager-include](../../../includes/storage-cloud-configuration-manager-include.md)]

## Access the file share programmatically
Next, add the following code to the `Main()` method (after the code shown above) to retrieve the connection string. This code gets a reference to the file we created earlier and outputs its contents to the console window.

```csharp
// Create a CloudFileClient object for credentialed access to Azure Files.
CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

// Get a reference to the file share we created previously.
CloudFileShare share = fileClient.GetShareReference("logs");

// Ensure that the share exists.
if (share.Exists())
{
    // Get a reference to the root directory for the share.
    CloudFileDirectory rootDir = share.GetRootDirectoryReference();

    // Get a reference to the directory we created previously.
    CloudFileDirectory sampleDir = rootDir.GetDirectoryReference("CustomLogs");

    // Ensure that the directory exists.
    if (sampleDir.Exists())
    {
        // Get a reference to the file we created previously.
        CloudFile file = sampleDir.GetFileReference("Log1.txt");

        // Ensure that the file exists.
        if (file.Exists())
        {
            // Write the contents of the file to the console window.
            Console.WriteLine(file.DownloadTextAsync().Result);
        }
    }
}
```

Run the console application to see the output.

## Set the maximum size for a file share
Beginning with version 5.x of the Azure Storage Client Library, you can set the quota (or maximum size) for a file share, in gigabytes. You can also check to see how much data is currently stored on the share.

By setting the quota for a share, you can limit the total size of the files stored on the share. If the total size of files on the share exceeds the quota set on the share, then clients will be unable to increase the size of existing files or create new files, unless those files are empty.

The example below shows how to check the current usage for a share and how to set the quota for the share.

```csharp
// Parse the connection string for the storage account.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    Microsoft.Azure.CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create a CloudFileClient object for credentialed access to Azure Files.
CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

// Get a reference to the file share we created previously.
CloudFileShare share = fileClient.GetShareReference("logs");

// Ensure that the share exists.
if (share.Exists())
{
    // Check current usage stats for the share.
    // Note that the ShareStats object is part of the protocol layer for the File service.
    Microsoft.Azure.Storage.File.Protocol.ShareStats stats = share.GetStats();
    Console.WriteLine("Current share usage: {0} GB", stats.Usage.ToString());

    // Specify the maximum size of the share, in GB.
    // This line sets the quota to be 10 GB greater than the current usage of the share.
    share.Properties.Quota = 10 + stats.Usage;
    share.SetProperties();

    // Now check the quota for the share. Call FetchAttributes() to populate the share's properties.
    share.FetchAttributes();
    Console.WriteLine("Current share quota: {0} GB", share.Properties.Quota);
}
```

### Generate a shared access signature for a file or file share
Beginning with version 5.x of the Azure Storage Client Library, you can generate a shared access signature (SAS) for a file share or for an individual file. You can also create a shared access policy on a file share to manage shared access signatures. Creating a shared access policy is recommended, as it provides a means of revoking the SAS if it should be compromised.

The following example creates a shared access policy on a share, and then uses that policy to provide the constraints for a SAS on a file in the share.

```csharp
// Parse the connection string for the storage account.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    Microsoft.Azure.CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create a CloudFileClient object for credentialed access to Azure Files.
CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

// Get a reference to the file share we created previously.
CloudFileShare share = fileClient.GetShareReference("logs");

// Ensure that the share exists.
if (share.Exists())
{
    string policyName = "sampleSharePolicy" + DateTime.UtcNow.Ticks;

    // Create a new shared access policy and define its constraints.
    SharedAccessFilePolicy sharedPolicy = new SharedAccessFilePolicy()
        {
            SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24),
            Permissions = SharedAccessFilePermissions.Read | SharedAccessFilePermissions.Write
        };

    // Get existing permissions for the share.
    FileSharePermissions permissions = share.GetPermissions();

    // Add the shared access policy to the share's policies. Note that each policy must have a unique name.
    permissions.SharedAccessPolicies.Add(policyName, sharedPolicy);
    share.SetPermissions(permissions);

    // Generate a SAS for a file in the share and associate this access policy with it.
    CloudFileDirectory rootDir = share.GetRootDirectoryReference();
    CloudFileDirectory sampleDir = rootDir.GetDirectoryReference("CustomLogs");
    CloudFile file = sampleDir.GetFileReference("Log1.txt");
    string sasToken = file.GetSharedAccessSignature(null, policyName);
    Uri fileSasUri = new Uri(file.StorageUri.PrimaryUri.ToString() + sasToken);

    // Create a new CloudFile object from the SAS, and write some text to the file.
    CloudFile fileSas = new CloudFile(fileSasUri);
    fileSas.UploadText("This write operation is authorized via SAS.");
    Console.WriteLine(fileSas.DownloadText());
}
```

For more information about creating and using shared access signatures, see [Using Shared Access Signatures (SAS)](../common/storage-dotnet-shared-access-signature-part-1.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

## Copy files
Beginning with version 5.x of the Azure Storage Client Library, you can copy a file to another file, a file to a blob, or a blob to a file. In the next sections, we demonstrate how to perform these copy operations programmatically.

You can also use AzCopy to copy one file to another or to copy a blob to a file or vice versa. See [Transfer data with the AzCopy Command-Line Utility](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json).

> [!NOTE]
> If you are copying a blob to a file, or a file to a blob, you must use a shared access signature (SAS) to authorize access to the source object, even if you are copying within the same storage account.
> 
> 

**Copy a file to another file**
The following example copies a file to another file in the same share. Because this copy operation copies between files in the same storage account, you can use Shared Key authentication to perform the copy.

```csharp
// Parse the connection string for the storage account.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    Microsoft.Azure.CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create a CloudFileClient object for credentialed access to Azure Files.
CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

// Get a reference to the file share we created previously.
CloudFileShare share = fileClient.GetShareReference("logs");

// Ensure that the share exists.
if (share.Exists())
{
    // Get a reference to the root directory for the share.
    CloudFileDirectory rootDir = share.GetRootDirectoryReference();

    // Get a reference to the directory we created previously.
    CloudFileDirectory sampleDir = rootDir.GetDirectoryReference("CustomLogs");

    // Ensure that the directory exists.
    if (sampleDir.Exists())
    {
        // Get a reference to the file we created previously.
        CloudFile sourceFile = sampleDir.GetFileReference("Log1.txt");

        // Ensure that the source file exists.
        if (sourceFile.Exists())
        {
            // Get a reference to the destination file.
            CloudFile destFile = sampleDir.GetFileReference("Log1Copy.txt");

            // Start the copy operation.
            destFile.StartCopy(sourceFile);

            // Write the contents of the destination file to the console window.
            Console.WriteLine(destFile.DownloadText());
        }
    }
}
```

**Copy a file to a blob**
The following example creates a file and copies it to a blob within the same storage account. The example creates a SAS for the source file, which the service uses to authorize access to the source file during the copy operation.

```csharp
// Parse the connection string for the storage account.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
    Microsoft.Azure.CloudConfigurationManager.GetSetting("StorageConnectionString"));

// Create a CloudFileClient object for credentialed access to Azure Files.
CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

// Create a new file share, if it does not already exist.
CloudFileShare share = fileClient.GetShareReference("sample-share");
share.CreateIfNotExists();

// Create a new file in the root directory.
CloudFile sourceFile = share.GetRootDirectoryReference().GetFileReference("sample-file.txt");
sourceFile.UploadText("A sample file in the root directory.");

// Get a reference to the blob to which the file will be copied.
CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
CloudBlobContainer container = blobClient.GetContainerReference("sample-container");
container.CreateIfNotExists();
CloudBlockBlob destBlob = container.GetBlockBlobReference("sample-blob.txt");

// Create a SAS for the file that's valid for 24 hours.
// Note that when you are copying a file to a blob, or a blob to a file, you must use a SAS
// to authorize access to the source object, even if you are copying within the same
// storage account.
string fileSas = sourceFile.GetSharedAccessSignature(new SharedAccessFilePolicy()
{
    // Only read permissions are required for the source file.
    Permissions = SharedAccessFilePermissions.Read,
    SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24)
});

// Construct the URI to the source file, including the SAS token.
Uri fileSasUri = new Uri(sourceFile.StorageUri.PrimaryUri.ToString() + fileSas);

// Copy the file to the blob.
destBlob.StartCopy(fileSasUri);

// Write the contents of the file to the console window.
Console.WriteLine("Source file contents: {0}", sourceFile.DownloadText());
Console.WriteLine("Destination blob contents: {0}", destBlob.DownloadText());
```

You can copy a blob to a file in the same way. If the source object is a blob, then create a SAS to authorize access to that blob during the copy operation.

## Share snapshots
Beginning with version 8.5 of the Azure Storage Client Library, you can create a share snapshot. You can also list or browse share snapshots and delete share snapshots. Share snapshots are read-only so no write operations are allowed on share snapshots.

**Create share snapshots**

The following example creates a file share snapshot.

```csharp
storageAccount = CloudStorageAccount.Parse(ConnectionString); 
fClient = storageAccount.CreateCloudFileClient(); 
string baseShareName = "myazurefileshare"; 
CloudFileShare myShare = fClient.GetShareReference(baseShareName); 
var snapshotShare = myShare.Snapshot();

```
**List share snapshots**

The following example lists the share snapshots on a share.

```csharp
var shares = fClient.ListShares(baseShareName, ShareListingDetails.All);
```

**Browse files and directories within share snapshots**

The following example browses files and directory within share snapshots.

```csharp
CloudFileShare mySnapshot = fClient.GetShareReference(baseShareName, snapshotTime); 
var rootDirectory = mySnapshot.GetRootDirectoryReference(); 
var items = rootDirectory.ListFilesAndDirectories();
```

**List shares and share snapshots and restore file shares or files from share snapshots** 

Taking a snapshot of a file share enables you to recover individual files or the entire the file share in the future. 

You can restore a file from a file share snapshot by querying the share snapshots of a file share. You can then retrieve a file that belongs to a particular share snapshot and use that version to either directly read and compare or to restore.

```csharp
CloudFileShare liveShare = fClient.GetShareReference(baseShareName);
var rootDirOfliveShare = liveShare.GetRootDirectoryReference();

       var dirInliveShare = rootDirOfliveShare.GetDirectoryReference(dirName);
var fileInliveShare = dirInliveShare.GetFileReference(fileName);

           
CloudFileShare snapshot = fClient.GetShareReference(baseShareName, snapshotTime);
var rootDirOfSnapshot = snapshot.GetRootDirectoryReference();

       var dirInSnapshot = rootDirOfSnapshot.GetDirectoryReference(dirName);
var fileInSnapshot = dir1InSnapshot.GetFileReference(fileName);

string sasContainerToken = string.Empty;
       SharedAccessFilePolicy sasConstraints = new SharedAccessFilePolicy();
       sasConstraints.SharedAccessExpiryTime = DateTime.UtcNow.AddHours(24);
       sasConstraints.Permissions = SharedAccessFilePermissions.Read;
       //Generate the shared access signature on the container, setting the constraints directly on the signature.
sasContainerToken = fileInSnapshot.GetSharedAccessSignature(sasConstraints);

string sourceUri = (fileInSnapshot.Uri.ToString() + sasContainerToken + "&" + fileInSnapshot.SnapshotTime.ToString()); ;
fileInliveShare.StartCopyAsync(new Uri(sourceUri));

```


**Delete share snapshots**

The following example deletes a file share snapshot.

```csharp
CloudFileShare mySnapshot = fClient.GetShareReference(baseShareName, snapshotTime); mySnapshot.Delete(null, null, null);
```

## Troubleshooting Azure Files using metrics
Azure Storage Analytics now supports metrics for Azure Files. With metrics data, you can trace requests and diagnose issues.

You can enable metrics for Azure Files from the [Azure portal](https://portal.azure.com). You can also enable metrics programmatically by calling the Set File Service Properties operation via the REST API, or one of its analogs in the Storage Client Library.

The following code example shows how to use the Storage Client Library for .NET to enable metrics for Azure Files.

First, add the following `using` directives to your `Program.cs` file, in addition to those you added above:

```csharp
using Microsoft.Azure.Storage.File.Protocol;
using Microsoft.Azure.Storage.Shared.Protocol;
```

Note that while Azure Blobs, Azure Table, and Azure Queues use the shared `ServiceProperties` type in the `Microsoft.Azure.Storage.Shared.Protocol` namespace, Azure Files uses its own type, the `FileServiceProperties` type in the `Microsoft.Azure.Storage.File.Protocol` namespace. Both namespaces must be referenced from your code, however, for the following code to compile.

```csharp
// Parse your storage connection string from your application's configuration file.
CloudStorageAccount storageAccount = CloudStorageAccount.Parse(
        Microsoft.Azure.CloudConfigurationManager.GetSetting("StorageConnectionString"));
// Create the File service client.
CloudFileClient fileClient = storageAccount.CreateCloudFileClient();

// Set metrics properties for File service.
// Note that the File service currently uses its own service properties type,
// available in the Microsoft.Azure.Storage.File.Protocol namespace.
fileClient.SetServiceProperties(new FileServiceProperties()
{
    // Set hour metrics
    HourMetrics = new MetricsProperties()
    {
        MetricsLevel = MetricsLevel.ServiceAndApi,
        RetentionDays = 14,
        Version = "1.0"
    },
    // Set minute metrics
    MinuteMetrics = new MetricsProperties()
    {
        MetricsLevel = MetricsLevel.ServiceAndApi,
        RetentionDays = 7,
        Version = "1.0"
    }
});

// Read the metrics properties we just set.
FileServiceProperties serviceProperties = fileClient.GetServiceProperties();
Console.WriteLine("Hour metrics:");
Console.WriteLine(serviceProperties.HourMetrics.MetricsLevel);
Console.WriteLine(serviceProperties.HourMetrics.RetentionDays);
Console.WriteLine(serviceProperties.HourMetrics.Version);
Console.WriteLine();
Console.WriteLine("Minute metrics:");
Console.WriteLine(serviceProperties.MinuteMetrics.MetricsLevel);
Console.WriteLine(serviceProperties.MinuteMetrics.RetentionDays);
Console.WriteLine(serviceProperties.MinuteMetrics.Version);
```

Also, you can refer to [Azure Files Troubleshooting Article](storage-troubleshoot-windows-file-connection-problems.md) for end-to-end troubleshooting guidance.

## Next steps
See these links for more information about Azure Files.

### Conceptual articles and videos
* [Azure Files: a frictionless cloud SMB file system for Windows and Linux](https://azure.microsoft.com/documentation/videos/azurecon-2015-azure-files-storage-a-frictionless-cloud-smb-file-system-for-windows-and-linux/)
* [How to use Azure Files with Linux](storage-how-to-use-files-linux.md)

### Tooling support for File storage
* [How to use AzCopy with Microsoft Azure Storage](../common/storage-use-azcopy.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json)
* [Using the Azure CLI with Azure Storage](../common/storage-azure-cli.md?toc=%2fazure%2fstorage%2ffiles%2ftoc.json#create-and-manage-file-shares)
* [Troubleshooting Azure Files problems](https://docs.microsoft.com/azure/storage/storage-troubleshoot-file-connection-problems)

### Reference
* [Storage Client Library for .NET reference](https://msdn.microsoft.com/library/azure/dn261237.aspx)
* [File Service REST API reference](https://msdn.microsoft.com/library/azure/dn167006.aspx)

### Blog posts
* [Azure Files is now generally available](https://azure.microsoft.com/blog/azure-file-storage-now-generally-available/)
* [Inside Azure Files](https://azure.microsoft.com/blog/inside-azure-file-storage/)
* [Introducing Microsoft Azure File Service](https://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/12/introducing-microsoft-azure-file-service.aspx)
* [Persisting connections to Microsoft Azure Files](https://blogs.msdn.com/b/windowsazurestorage/archive/2014/05/27/persisting-connections-to-microsoft-azure-files.aspx)
