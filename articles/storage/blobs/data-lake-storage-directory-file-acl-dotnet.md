---
title: Manage directories, files, and ACLs in Azure Data Lake Storage Gen2 (.NET)
description: Use the Azure Storage client library to manage directories and file and directory access control lists (ACL) in storage accounts that have a hierarchical namespace.
author: normesta
ms.service: storage
ms.date: 10/31/2019
ms.author: normesta
ms.topic: article
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
---

# Manage directories, files, and ACLs in Azure Data Lake Storage Gen2 (.NET)

This article shows you how to use .NET to work with directories, files, and POSIX [access control lists](data-lake-storage-access-control.md) (ACLs) in storage accounts that have a hierarchical namespace. 

## Set up your project

To get started, install the **Azure.Storage.Files.DataLake** NuGet package.

Then, add these using statements to the top of your code file.

```csharp
using Azure.Storage.Files.DataLake;
using Azure.Storage.Files.DataLake.Models;
using System.IO;
using Azure;
```

## Connect to the account

To use the snippets in this article, you'll need to create a [DataLakeServiceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.blob.cloudblobclient?view=azure-dotnet) instance that represents the storage account. The easiest way to get one is to use a connection string. This example creates an instance of the [DataLakeServiceClient](https://docs.microsoft.com/dotnet/api/microsoft.azure.storage.blob.cloudblobclient?view=azure-dotnet) by using a connection string.

```cs
public void GetDataLakeServiceClient(ref DataLakeServiceClient dataLakeServiceClient,
    string accountName, string accountKey)
{
    StorageSharedKeyCredential sharedKeyCredential =
        new StorageSharedKeyCredential(accountName, accountKey);

    string dfsUri = "https://" + accountName + ".dfs.core.windows.net";

    dataLakeServiceClient = new DataLakeServiceClient
        (new Uri(dfsUri), sharedKeyCredential, new DataLakeClientOptions());
}
```

## Create a directory

Create a directory reference by calling the **FileSystemClient.CreateDirectoryAsync** method.

This example adds a directory named `my-directory` to a container, and then adds a sub-directory named `my-subdirectory`. 

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

## Rename a directory

Rename a directory by calling the **DirectoryClient.RenameAsync** method. Pass the path of the desired directory a parameter. 

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
## Move a directory

You can also use the **DirectoryClient.RenameAsync** method to move a directory. Pass the path of the desired directory location as a parameter to this method. 

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

Delete a directory by calling the **DirectoryClient.Delete** method.

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

Get the access control list (ACL) of a directory by calling the **directoryClient.GetAccessControlAsync** method and set the ACL by calling the **DirectoryClient.SetAccessControl** method.

This example gets and sets the ACL of a directory named `my-directory`. The string `user::rwx,group::r-x,other::rw-` gives the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others read and write permission.

```cs
public async Task ManageDirectoryACLs(DataLakeFileSystemClient fileSystemClient)
{
    DataLakeDirectoryClient directoryClient =
        fileSystemClient.GetDirectoryClient("my-directory");

    PathAccessControl directoryAccessControl =
        await directoryClient.GetAccessControlAsync();

    Console.WriteLine(directoryAccessControl.Acl);

    PathAccessControl updatedAccessControl = 
        DataLakeModelFactory.PathAccessControl
        (null, null, null, "user::rwx,group::r-x,other::rw-");

    directoryClient.SetAccessControl(updatedAccessControl);

    Console.WriteLine(updatedAccessControl.Acl);

}

```

## Upload a file to a directory

First, create a file reference in the target directory by creating an instance of the **DataLakeFileClient** class. Upload a file by calling the **FileClient.AppendAsync** method. Make sure to complete the upload by calling the **FileClient.FlushAsync** method.

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

## Manage a file ACL

Get the access control list (ACL) of a file by calling the **DataLakeFileClient.GetAccessControlAsync** method and set the ACL by calling the **FileClient.SetAccessControl** method.

This example gets and sets the ACL of a file named `my-file.txt`. The string `user::rwx,group::r-x,other::rw-` gives the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others read and write permission.

```cs
public async Task ManageFileACLs(DataLakeFileSystemClient fileSystemClient)
{
    DataLakeDirectoryClient directoryClient =
        fileSystemClient.GetDirectoryClient("my-directory");

    DataLakeFileClient fileClient = 
        directoryClient.GetFileClient("my-file.txt");

    PathAccessControl FileAccessControl =
        await fileClient.GetAccessControlAsync();

    Console.WriteLine(FileAccessControl.Acl);

    PathAccessControl updatedAccessControl =
        DataLakeModelFactory.PathAccessControl
        (null, null, null, "user::rwx,group::r-x,other::rw-");

    fileClient.SetAccessControl(updatedAccessControl);

    Console.WriteLine(updatedAccessControl.Acl);

}
```

## Download from a directory 

First, create a **DataLakeFileClient** instance that represents the file that you want to download. Use the **FileClient.ReadAsync** method, and parse the return value to obtain a [Stream](https://docs.microsoft.com/dotnet/api/system.io.stream) object. Use any .NET file processing API to save bytes from the stream to a file. 

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
        File.OpenWrite("C:\\\my-image-downloaded.png");

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

List directory contents by calling the **FileSystemClient.ListPathsAsync** method, and then enumerating through the results.

This example, prints the names of each file that is located in a directory named `my-directory`.

```cs
public async Task ListFilesInDirectory(DataLakeFileSystemClient fileSystemClient)
{
    Azure.AsyncPageable<PathItem> items = fileSystemClient.ListPathsAsync("my-directory");

    IAsyncEnumerator<PathItem> enumerator = items.GetAsyncEnumerator(new System.Threading.CancellationToken());

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

## Sample

Put link to github sample here along with some explanatory text.

[!INCLUDE [storage-blob-dotnet-resources-include](../../../includes/storage-blob-dotnet-resources-include.md)]

