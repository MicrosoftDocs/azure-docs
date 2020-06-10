---
title: Azure Data Lake Storage Gen2 .NET SDK for files & ACLs
description: Use the Azure Storage client library to manage directories and file and directory access control lists (ACL) in storage accounts that has hierarchical namespace (HNS) enabled.
author: normesta
ms.service: storage
ms.date: 03/20/2020
ms.author: normesta
ms.topic: how-to
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
---

# Use .NET to manage directories, files, and ACLs in Azure Data Lake Storage Gen2

This article shows you how to use .NET to create and manage directories, files, and permissions in storage accounts that has hierarchical namespace (HNS) enabled. 

[Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Files.DataLake) | [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake) | [API reference](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake) | [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/GEN1_GEN2_MAPPING.md) | [Give Feedback](https://github.com/Azure/azure-sdk-for-net/issues)

## Prerequisites

> [!div class="checklist"]
> * An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
> * A storage account that has hierarchical namespace (HNS) enabled. Follow [these](data-lake-storage-quickstart-create-account.md) instructions to create one.

## Set up your project

To get started, install the [Azure.Storage.Files.DataLake](https://www.nuget.org/packages/Azure.Storage.Files.DataLake/) NuGet package.

For more information about how to install NuGet packages, see [Install and manage packages in Visual Studio using the NuGet Package Manager](https://docs.microsoft.com/nuget/consume-packages/install-use-packages-visual-studio).

Then, add these using statements to the top of your code file.

```csharp
using Azure.Storage.Files.DataLake;
using Azure.Storage.Files.DataLake.Models;
using Azure.Storage;
using System.IO;
using Azure;
```

## Connect to the account

To use the snippets in this article, you'll need to create a [DataLakeServiceClient](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance that represents the storage account. 

### Connect by using an account key

This is the easiest way to connect to an account. 

This example creates a [DataLakeServiceClient](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakeserviceclient?) instance by using an account key.

```cs
public void GetDataLakeServiceClient(ref DataLakeServiceClient dataLakeServiceClient,
    string accountName, string accountKey)
{
    StorageSharedKeyCredential sharedKeyCredential =
        new StorageSharedKeyCredential(accountName, accountKey);

    string dfsUri = "https://" + accountName + ".dfs.core.windows.net";

    dataLakeServiceClient = new DataLakeServiceClient
        (new Uri(dfsUri), sharedKeyCredential);
}
```

### Connect by using Azure Active Directory (AD)

You can use the [Azure identity client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity) to authenticate your application with Azure AD.

This example creates a [DataLakeServiceClient](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakeserviceclient?) instance by using a client ID, a client secret, and a tenant ID.  To get these values, see [Acquire a token from Azure AD for authorizing requests from a client application](../common/storage-auth-aad-app.md).

```cs
public void GetDataLakeServiceClient(ref DataLakeServiceClient dataLakeServiceClient, 
    String accountName, String clientID, string clientSecret, string tenantID)
{

    TokenCredential credential = new ClientSecretCredential(
        tenantID, clientID, clientSecret, new TokenCredentialOptions());

    string dfsUri = "https://" + accountName + ".dfs.core.windows.net";

    dataLakeServiceClient = new DataLakeServiceClient(new Uri(dfsUri), credential);
}

```

> [!NOTE]
> For more examples, see the [Azure identity client library for .NET](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/identity/Azure.Identity) documentation..

## Create a file system

A file system acts as a container for your files. You can create one by calling the [DataLakeServiceClient.CreateFileSystem](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakeserviceclient.createfilesystemasync) method.

This example creates a file system named `my-file-system`. 

```cs
public async Task<DataLakeFileSystemClient> CreateFileSystem
    (DataLakeServiceClient serviceClient)
{
        return await serviceClient.CreateFileSystemAsync("my-file-system");
}
```

## Create a directory

Create a directory reference by calling the [DataLakeFileSystemClient.CreateDirectoryAsync](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakefilesystemclient.createdirectoryasync) method.

This example adds a directory named `my-directory` to a file system, and then adds a sub-directory named `my-subdirectory`. 

```cs
public async Task<DataLakeDirectoryClient> CreateDirectory
    (DataLakeServiceClient serviceClient, string fileSystemName)
{
    DataLakeFileSystemClient fileSystemClient =
        serviceClient.GetFileSystemClient(fileSystemName);

    DataLakeDirectoryClient directoryClient =
        await fileSystemClient.CreateDirectoryAsync("my-directory");

    return await directoryClient.CreateSubDirectoryAsync("my-subdirectory");
}
```

## Rename or move a directory

Rename or move a directory by calling the [DataLakeDirectoryClient.RenameAsync](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakedirectoryclient.renameasync) method. Pass the path of the desired directory a parameter. 

This example renames a sub-directory to the name `my-subdirectory-renamed`.

```cs
public async Task<DataLakeDirectoryClient> 
    RenameDirectory(DataLakeFileSystemClient fileSystemClient)
{
    DataLakeDirectoryClient directoryClient =
        fileSystemClient.GetDirectoryClient("my-directory/my-subdirectory");

    return await directoryClient.RenameAsync("my-directory/my-subdirectory-renamed");
}
```

This example moves a directory named `my-subdirectory-renamed` to a sub-directory of a directory named `my-directory-2`. 

```cs
public async Task<DataLakeDirectoryClient> MoveDirectory
    (DataLakeFileSystemClient fileSystemClient)
{
    DataLakeDirectoryClient directoryClient =
            fileSystemClient.GetDirectoryClient("my-directory/my-subdirectory-renamed");

    return await directoryClient.RenameAsync("my-directory-2/my-subdirectory-renamed");                
}
```

## Delete a directory

Delete a directory by calling the [DataLakeDirectoryClient.Delete](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakedirectoryclient.delete) method.

This example deletes a directory named `my-directory`.  

```cs
public void DeleteDirectory(DataLakeFileSystemClient fileSystemClient)
{
    DataLakeDirectoryClient directoryClient =
        fileSystemClient.GetDirectoryClient("my-directory");

    directoryClient.Delete();
}
```

## Manage a directory ACL

Get the access control list (ACL) of a directory by calling the [DataLakeDirectoryClient.GetAccessControlAsync](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakedirectoryclient.getaccesscontrolasync) method and set the ACL by calling the [DataLakeDirectoryClient.SetAccessControlList](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakedirectoryclient.setaccesscontrollist) method.

> [!NOTE]
> If your application authorizes access by using Azure Active Directory (Azure AD), then make sure that the security principal that your application uses to authorize access has been assigned the [Storage Blob Data Owner role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner). To learn more about how ACL permissions are applied and the effects of changing them, see  [Access control in Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control). 

This example gets and sets the ACL of a directory named `my-directory`. The string `user::rwx,group::r-x,other::rw-` gives the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others read and write permission.

```cs
public async Task ManageDirectoryACLs(DataLakeFileSystemClient fileSystemClient)
{
    DataLakeDirectoryClient directoryClient =
        fileSystemClient.GetDirectoryClient("my-directory");

    PathAccessControl directoryAccessControl =
        await directoryClient.GetAccessControlAsync();

    Console.WriteLine(directoryAccessControl.AccessControlList);

    IList<PathAccessControlItem> accessControlList
        = PathAccessControlExtensions.ParseAccessControlList
        ("user::rwx,group::r-x,other::rw-");

    directoryClient.SetAccessControlList(accessControlList);

}

```

## Upload a file to a directory

First, create a file reference in the target directory by creating an instance of the [DataLakeFileClient](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakefileclient) class. Upload a file by calling the [DataLakeFileClient.AppendAsync](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakefileclient.appendasync) method. Make sure to complete the upload by calling the [DataLakeFileClient.FlushAsync](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakefileclient.flushasync) method.

This example uploads a text file to a directory named `my-directory`.    

```cs
public async Task UploadFile(DataLakeFileSystemClient fileSystemClient)
{
    DataLakeDirectoryClient directoryClient =
        fileSystemClient.GetDirectoryClient("my-directory");

    DataLakeFileClient fileClient = await directoryClient.CreateFileAsync("uploaded-file.txt");

    FileStream fileStream = 
        File.OpenRead("C:\\file-to-upload.txt");

    long fileSize = fileStream.Length;

    await fileClient.AppendAsync(fileStream, offset: 0);

    await fileClient.FlushAsync(position: fileSize);

}
```

> [!TIP]
> If your file size is large, your code will have to make multiple calls to the [DataLakeFileClient.AppendAsync](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakefileclient.appendasync). Consider using the [DataLakeFileClient.UploadAsync](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakefileclient.uploadasync?view=azure-dotnet#Azure_Storage_Files_DataLake_DataLakeFileClient_UploadAsync_System_IO_Stream_) method instead. That way, you can upload the entire file in a single call. 
>
> See the next section for an example.

## Upload a large file to a directory

Use the [DataLakeFileClient.UploadAsync](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakefileclient.uploadasync?view=azure-dotnet#Azure_Storage_Files_DataLake_DataLakeFileClient_UploadAsync_System_IO_Stream_) method to upload large files without having to make multiple calls to the [DataLakeFileClient.AppendAsync](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakefileclient.appendasync) method.

```cs
public async Task UploadFileBulk(DataLakeFileSystemClient fileSystemClient)
{
    DataLakeDirectoryClient directoryClient =
        fileSystemClient.GetDirectoryClient("my-directory");

    DataLakeFileClient fileClient = directoryClient.GetFileClient("uploaded-file.txt");

    FileStream fileStream =
        File.OpenRead("C:\\file-to-upload.txt");

    await fileClient.UploadAsync(fileStream);

}

```

## Manage a file ACL

Get the access control list (ACL) of a file by calling the [DataLakeFileClient.GetAccessControlAsync](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakefileclient.getaccesscontrolasync) method and set the ACL by calling the [DataLakeFileClient.SetAccessControlList](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakefileclient.setaccesscontrollist) method.

> [!NOTE]
> If your application authorizes access by using Azure Active Directory (Azure AD), then make sure that the security principal that your application uses to authorize access has been assigned the [Storage Blob Data Owner role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner). To learn more about how ACL permissions are applied and the effects of changing them, see  [Access control in Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control). 

This example gets and sets the ACL of a file named `my-file.txt`. The string `user::rwx,group::r-x,other::rw-` gives the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others read and write permission.

```cs
public async Task ManageFileACLs(DataLakeFileSystemClient fileSystemClient)
{
    DataLakeDirectoryClient directoryClient =
        fileSystemClient.GetDirectoryClient("my-directory");

    DataLakeFileClient fileClient = 
        directoryClient.GetFileClient("hello.txt");

    PathAccessControl FileAccessControl =
        await fileClient.GetAccessControlAsync();

    Console.WriteLine(FileAccessControl.AccessControlList);

    IList<PathAccessControlItem> accessControlList
        = PathAccessControlExtensions.ParseAccessControlList
        ("user::rwx,group::r-x,other::rw-");

    fileClient.SetAccessControlList(accessControlList);
}
```

## Download from a directory 

First, create a [DataLakeFileClient](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakefileclient) instance that represents the file that you want to download. Use the [DataLakeFileClient.ReadAsync](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakefileclient.readasync)  method, and parse the return value to obtain a [Stream](https://docs.microsoft.com/dotnet/api/system.io.stream) object. Use any .NET file processing API to save bytes from the stream to a file. 

This example uses a [BinaryReader](https://docs.microsoft.com/dotnet/api/system.io.binaryreader) and a [FileStream](https://docs.microsoft.com/dotnet/api/system.io.filestream) to save bytes to a file. 

```cs
public async Task DownloadFile(DataLakeFileSystemClient fileSystemClient)
{
    DataLakeDirectoryClient directoryClient =
        fileSystemClient.GetDirectoryClient("my-directory");

    DataLakeFileClient fileClient = 
        directoryClient.GetFileClient("my-image.png");

    Response<FileDownloadInfo> downloadResponse = await fileClient.ReadAsync();

    BinaryReader reader = new BinaryReader(downloadResponse.Value.Content);

    FileStream fileStream = 
        File.OpenWrite("C:\\my-image-downloaded.png");

    int bufferSize = 4096;

    byte[] buffer = new byte[bufferSize];

    int count;

    while ((count = reader.Read(buffer, 0, buffer.Length)) != 0)
    {
        fileStream.Write(buffer, 0, count);
    }

    await fileStream.FlushAsync();

    fileStream.Close();
}
```

## List directory contents

List directory contents by calling the [FileSystemClient.GetPathsAsync](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake.datalakefilesystemclient.getpathsasync) method, and then enumerating through the results.

This example, prints the names of each file that is located in a directory named `my-directory`.

```cs
public async Task ListFilesInDirectory(DataLakeFileSystemClient fileSystemClient)
{
    IAsyncEnumerator<PathItem> enumerator = 
        fileSystemClient.GetPathsAsync("my-directory").GetAsyncEnumerator();

    await enumerator.MoveNextAsync();

    PathItem item = enumerator.Current;

    while (item != null)
    {
        Console.WriteLine(item.Name);

        if (!await enumerator.MoveNextAsync())
        {
            break;
        }
                
        item = enumerator.Current;
    }

}
```

## See also

* [API reference documentation](https://docs.microsoft.com/dotnet/api/azure.storage.files.datalake)
* [Package (NuGet)](https://www.nuget.org/packages/Azure.Storage.Files.DataLake)
* [Samples](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake)
* [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-net/tree/master/sdk/storage/Azure.Storage.Files.DataLake/GEN1_GEN2_MAPPING.md)
* [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)
* [Give Feedback](https://github.com/Azure/azure-sdk-for-net/issues)

