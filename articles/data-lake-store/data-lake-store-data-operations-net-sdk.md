---
title: '.NET SDK: Filesystem operations on Azure Data Lake Store | Microsoft Docs'
description: Use Azure Data Lake Store .NET SDK to perform filesystem operations on Data Lake Store such as create folders, etc.
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.service: data-lake-store
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 10/11/2017
ms.author: nitinme

---
# Filesystem operations on Azure Data Lake Store using .NET SDK
> [!div class="op_single_selector"]
> * [.NET SDK](data-lake-store-data-operations-net-sdk.md)
> * [Java SDK](data-lake-store-get-started-java-sdk.md)
> * [REST API](data-lake-store-data-operations-rest-api.md)
> * [Python](data-lake-store-data-operations-python.md)
>
>

In this article, you learn how to perform filesytem operations on Data Lake Store using .NET SDK. Filesystem operations include creating folders in a Data Lake Store account, uploading files, downloading files, etc.

For instructions on how to perform account management operations on Data Lake Store using .NET SDK, see [Account management operations on Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md).

## Prerequisites
* **Visual Studio 2013, 2015, or 2017**. The instructions below use Visual Studio 2017.

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Azure Data Lake Store account**. For instructions on how to create an account, see [Get started with Azure Data Lake Store](data-lake-store-get-started-portal.md)

## Create a .NET application
1. Open Visual Studio and create a console application.
2. From the **File** menu, click **New**, and then click **Project**.
3. From **New Project**, type or select the following values:

   | Property | Value |
   | --- | --- |
   | Category |Templates/Visual C#/Windows |
   | Template |Console Application |
   | Name |CreateADLApplication |
4. Click **OK** to create the project.
5. Add the NuGet packages to your project.

   1. Right-click the project name in the Solution Explorer and click **Manage NuGet Packages**.
   2. In the **NuGet Package Manager** tab, make sure that **Package source** is set to **nuget.org** and that **Include prerelease** check box is selected.
   3. Search for and install the following NuGet packages:

      * `Microsoft.Azure.Management.DataLake.Store` - This tutorial uses v2.1.3-preview.
      * `Microsoft.Rest.ClientRuntime.Azure.Authentication` - This tutorial uses v2.2.12.

        ![Add a NuGet source](./media/data-lake-store-get-started-net-sdk/data-lake-store-install-nuget-package.png "Create a new Azure Data Lake account")
   4. Close the **NuGet Package Manager**.
6. Open **Program.cs**, delete the existing code, and then include the following statements to add references to namespaces.

        using System;
        using System.IO;
        using System.Linq;
        using System.Text;
        using System.Threading;
		using System.Collections.Generic;
        using System.Security.Cryptography.X509Certificates; // Required only if you are using an Azure AD application created with certificates
                
        using Microsoft.Rest;
        using Microsoft.Rest.Azure.Authentication;
        using Microsoft.Azure.Management.DataLake.Store;
		using Microsoft.Azure.Management.DataLake.Store.Models;
		using Microsoft.IdentityModel.Clients.ActiveDirectory;

7. Declare the variables as shown below, and provide the values for the placeholders. Also, make sure the local path and file name you provide here exist on the computer.

        namespace SdkSample
        {
            class Program
            {
                private static DataLakeStoreFileSystemManagementClient _adlsFileSystemClient;

                private static string _adlsAccountName;
                private static string _resourceGroupName;
                private static string _location;

                private static async void Main(string[] args)
                {
                    _adlsAccountName = "<DATA-LAKE-STORE-NAME>"; // TODO: Replace this value with the name of your existing Data Lake Store account.
                    _resourceGroupName = "<RESOURCE-GROUP-NAME>"; // TODO: Replace this value with the name of the resource group containing your Data Lake Store account.
                    _location = "East US 2";

                    string localFolderPath = @"C:\local_path\"; // TODO: Make sure this exists and can be overwritten.
                    string localFilePath = Path.Combine(localFolderPath, "file.txt"); // TODO: Make sure this exists and can be overwritten.
                    string remoteFolderPath = "/data_lake_path/";
                    string remoteFilePath = Path.Combine(remoteFolderPath, "file.txt");
                }
            }
        }

In the remaining sections of the article, you can see how to use the available .NET methods to perform operations such as authentication, file upload, etc.

## Authentication

* For end-user authentication for your application, see [End-user authentication with Data Lake Store using .NET SDK](data-lake-store-end-user-authenticate-net-sdk.md).
* For service-to-service authentication for your application, see [Service-to-service authentication with Data Lake Store using .NET SDK](data-lake-store-service-to-service-authenticate-net-sdk.md).


## Create client objects
The following snippet creates the Data Lake Store account and filesystem client objects, which are used to issue requests to the service.

    // Create client objects
    _adlsFileSystemClient = new DataLakeStoreFileSystemManagementClient(adlCreds);

## Create a directory
Add the following method to your class. The snippet shows a `CreateDirectory()` method that you can use to create a directory within a Data Lake Store account.

    // Create a directory
    public static void CreateDirectory(string path)
    {
            _adlsFileSystemClient.FileSystem.Mkdirs(_adlsAccountName, path);
    }

Add the following snippet to your `Main()` method to invoke the `CreateDirectory()` method.

    CreateDirectory(remoteFolderPath);
    Console.WriteLine("Created a directory in the Data Lake Store account. Press any key to continue ...");
    Console.ReadLine();

## Upload a file
Add the following method to your class. The snippet shows an `UploadFile()` method that you can use to upload files to a Data Lake Store account. The SDK supports recursive upload and download between a local file path and a Data Lake Store file path.

    // Upload a file
    public static void UploadFile(string srcFilePath, string destFilePath, bool force = true)
    {
        _adlsFileSystemClient.FileSystem.UploadFile(_adlsAccountName, srcFilePath, destFilePath, overwrite:force);
    }

Add the following snippet to your `Main()` method to invoke the `UploadFile()` method.

    UploadFile(localFilePath, remoteFilePath, true);
    Console.WriteLine("Uploaded file in the directory. Press any key to continue...");
    Console.ReadLine();
    

## Get file or directory info
The following snippet shows a `GetItemInfo()` method that you can use to retrieve information about a file or directory available in Data Lake Store.

    public static FileStatusProperties GetItemInfo(string path)
    {
        return _adlsFileSystemClient.FileSystem.GetFileStatus(_adlsAccountName, path).FileStatus;
    }

Add the following snippet to your `Main()` method to invoke the `GetItemInfo()` method.

    
    var fileProperties = GetItemInfo(remoteFilePath);
    Console.WriteLine("The owner of the file at the path is:", fileProperties.Owner);
    Console.WriteLine("Press any key to continue...");
    Console.ReadLine();

## List file or directories
The following snippet shows a `ListItems()` method that can use to list the file and directories in a Data Lake Store account.

    // List files and directories
    public static List<FileStatusProperties> ListItems(string directoryPath)
    {
        return _adlsFileSystemClient.FileSystem.ListFileStatus(_adlsAccountName, directoryPath).FileStatuses.FileStatus.ToList();
    }

Add the following snippet to your `Main()` method to invoke the `ListItems()` method.

    var itemList = ListItems(remoteFolderPath);
    var fileMenuItems = itemList.Select(a => String.Format("{0,15} {1}", a.Type, a.PathSuffix));
    Console.WriteLine(String.Join("\r\n", fileMenuItems));
    Console.WriteLine("Files and directories listed. Press any key to continue ...");
    Console.ReadLine();

## Concatenate files
The following snippet shows a `ConcatenateFiles()` method that you use to concatenate files.

    // Concatenate files
    public static void ConcatenateFiles(string[] srcFilePaths, string destFilePath)
    {
        _adlsFileSystemClient.FileSystem.Concat(_adlsAccountName, destFilePath, srcFilePaths);
    }

Add the following snippet to your `Main()` method to invoke the `ConcatenateFiles()` method. This snippet assumes that you have uploaded another file to the Data Lake Store account, and that the path of the file is provided in the string *anotherRemoteFilePath*.

    string[] stringOfFiles = new String[] {remoteFilePath, anotherRemoteFilePath};
    string destFilePath = Path.Combine(remoteFolderPath, "Concatfile.txt");
    ConcatenateFiles(stringOfFiles, destFilePath);
    Console.WriteLine("Files concatinated. Press any key to continue ...");
    Console.ReadLine();

## Append to a file
The following snippet shows a `AppendToFile()` method that you use append data to a file already stored in a Data Lake Store account.

    // Append to file
    public static void AppendToFile(string path, string content)
    {
        using (var stream = new MemoryStream(Encoding.UTF8.GetBytes(content)))
        {
            _adlsFileSystemClient.FileSystem.AppendAsync(_adlsAccountName, path, stream);
        }
    }

Add the following snippet to your `Main()` method to invoke the `AppendToFile()` method.

    AppendToFile(remoteFilePath, "123");
    Console.WriteLine("Content appended. Press any key to continue ...");
    Console.ReadLine();

## Download a file
The following snippet shows a `DownloadFile()` method that you use to download a file from a Data Lake Store account.

    // Download file
    public static void DownloadFile(string srcFilePath, string destFilePath)
    {
        _adlsFileSystemClient.FileSystem.DownloadFile(_adlsAccountName, srcFilePath, destFilePath, overwrite:true);
    }

Add the following snippet to your `Main()` method to invoke the `DownloadFile()` method.

    DownloadFile(destFilePath, localFilePath);
    Console.WriteLine("File downloaded. Press any key to continue ...");
    Console.ReadLine();

## See also
* [Account management operations on Data Lake Store using .NET SDK](data-lake-store-get-started-net-sdk.md)
* [Data Lake Store .NET SDK Reference](https://docs.microsoft.com/dotnet/api/overview/azure/data-lake-store?view=azure-dotnet)

## Next steps
* [Secure data in Data Lake Store](data-lake-store-secure-data.md)
