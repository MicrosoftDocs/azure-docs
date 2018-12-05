---
title: '.NET SDK: Filesystem operations on Azure Data Lake Storage Gen1 | Microsoft Docs'
description: Use Azure Data Lake Storage Gen1 .NET SDK to perform filesystem operations on Data Lake Storage Gen1 such as create folders, etc.
services: data-lake-store
documentationcenter: ''
author: nitinme
manager: jhubbard
editor: cgronlun

ms.service: data-lake-store
ms.devlang: na
ms.topic: conceptual
ms.date: 05/29/2018
ms.author: nitinme

---
# Filesystem operations on Azure Data Lake Storage Gen1 using .NET SDK
> [!div class="op_single_selector"]
> * [.NET SDK](data-lake-store-data-operations-net-sdk.md)
> * [Java SDK](data-lake-store-get-started-java-sdk.md)
> * [REST API](data-lake-store-data-operations-rest-api.md)
> * [Python](data-lake-store-data-operations-python.md)
>
>

In this article, you learn how to perform filesytem operations on Data Lake Storage Gen1 using .NET SDK. Filesystem operations include creating folders in a Data Lake Storage Gen1 account, uploading files, downloading files, etc.

For instructions on how to perform account management operations on Data Lake Storage Gen1 using .NET SDK, see [Account management operations on Data Lake Storage Gen1 using .NET SDK](data-lake-store-get-started-net-sdk.md).

## Prerequisites
* **Visual Studio 2013, 2015, or 2017**. The instructions below use Visual Studio 2017.

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Azure Data Lake Storage Gen1 account**. For instructions on how to create an account, see [Get started with Azure Data Lake Storage Gen1](data-lake-store-get-started-portal.md)

## Create a .NET application
The code sample available [on GitHub](https://github.com/Azure-Samples/data-lake-store-adls-dot-net-get-started/tree/master/AdlsSDKGettingStarted) walks you through the process of creating files in the store, concatenating files, downloading a file, and deleting some files in the store. This section of the article walks you through the main parts of the code.

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

      * `Microsoft.Azure.DataLake.Store` - This tutorial uses v1.0.0.
      * `Microsoft.Rest.ClientRuntime.Azure.Authentication` - This tutorial uses v2.3.1.
    
    Close the **NuGet Package Manager**.

6. Open **Program.cs**, delete the existing code, and then include the following statements to add references to namespaces.

        using System;
        using System.IO;using System.Threading;
        using System.Linq;
        using System.Text;
        using System.Collections.Generic;
        using System.Security.Cryptography.X509Certificates; // Required only if you are using an Azure AD application created with certificates
                
        using Microsoft.Rest;
        using Microsoft.Rest.Azure.Authentication;
        using Microsoft.Azure.DataLake.Store;
    	using Microsoft.IdentityModel.Clients.ActiveDirectory;

7. Declare the variables as shown below, and provide the values for the placeholders. Also, make sure the local path and file name you provide here exist on the computer.

        namespace SdkSample
        {
            class Program
            {
                private static string _adlsg1AccountName = "<DATA-LAKE-STORAGE-GEN1-NAME>.azuredatalakestore.net";        
            }
        }

In the remaining sections of the article, you can see how to use the available .NET methods to perform operations such as authentication, file upload, etc.

## Authentication

* For end-user authentication for your application, see [End-user authentication with Data Lake Storage Gen1 using .NET SDK](data-lake-store-end-user-authenticate-net-sdk.md).
* For service-to-service authentication for your application, see [Service-to-service authentication with Data Lake Storage Gen1 using .NET SDK](data-lake-store-service-to-service-authenticate-net-sdk.md).


## Create client object
The following snippet creates the Data Lake Storage Gen1 filesystem client object, which is used to issue requests to the service.

    // Create client objects
    AdlsClient client = AdlsClient.CreateClient(_adlsg1AccountName, adlCreds);

## Create a file and directory
Add the following snippet to your application. This snippet adds a file as well as any parent directory that do not exist.

    // Create a file - automatically creates any parent directories that don't exist
    // The AdlsOutputStream preserves record boundaries - it does not break records while writing to the store
    using (var stream = client.CreateFile(fileName, IfExists.Overwrite))
    {
        byte[] textByteArray = Encoding.UTF8.GetBytes("This is test data to write.\r\n");
        stream.Write(textByteArray, 0, textByteArray.Length);

        textByteArray = Encoding.UTF8.GetBytes("This is the second line.\r\n");
        stream.Write(textByteArray, 0, textByteArray.Length);
    }

## Append to a file
The following snippet appends data to an existing file in Data Lake Storage Gen1 account.

    // Append to existing file
    using (var stream = client.GetAppendStream(fileName))
    {
        byte[] textByteArray = Encoding.UTF8.GetBytes("This is the added line.\r\n");
        stream.Write(textByteArray, 0, textByteArray.Length);
    }

## Read a file
The following snippet reads the contents of a file in Data Lake Storage Gen1.

    //Read file contents
    using (var readStream = new StreamReader(client.GetReadStream(fileName)))
    {
        string line;
        while ((line = readStream.ReadLine()) != null)
        {
            Console.WriteLine(line);
        }
    }

## Get file properties
The following snippet returns the properties associated with a file or a directory.

    // Get file properties
    var directoryEntry = client.GetDirectoryEntry(fileName);
    PrintDirectoryEntry(directoryEntry);

The definition of the `PrintDirectoryEntry` method is available as part of the sample [on Github](https://github.com/Azure-Samples/data-lake-store-adls-dot-net-get-started/tree/master/AdlsSDKGettingStarted). 

## Rename a file
The following snippet renames an existing file in a Data Lake Storage Gen1 account.

    // Rename a file
    string destFilePath = "/Test/testRenameDest3.txt";
    client.Rename(fileName, destFilePath, true);

## Enumerate a directory
The following snippet enumerates directories in a Data Lake Storage Gen1 account

    // Enumerate directory
    foreach (var entry in client.EnumerateDirectory("/Test"))
    {
        PrintDirectoryEntry(entry);
    }

The definition of the `PrintDirectoryEntry` method is available as part of the sample [on Github](https://github.com/Azure-Samples/data-lake-store-adls-dot-net-get-started/tree/master/AdlsSDKGettingStarted).

## Delete directories recursively
The following snippet deletes a directory, and all its sub-directories, recursively.

    // Delete a directory and all its subdirectories and files
    client.DeleteRecursive("/Test");

## Samples
Here are a couple of samples on how to use the Data Lake Storage Gen1 Filesystem SDK.
* [Basic sample on Github](https://github.com/Azure-Samples/data-lake-store-adls-dot-net-get-started/tree/master/AdlsSDKGettingStarted)
* [Advanced sample on Github](https://github.com/Azure-Samples/data-lake-store-adls-dot-net-samples)

## See also
* [Account management operations on Data Lake Storage Gen1 using .NET SDK](data-lake-store-get-started-net-sdk.md)
* [Data Lake Storage Gen1 .NET SDK Reference](https://docs.microsoft.com/dotnet/api/overview/azure/data-lake-store?view=azure-dotnet)

## Next steps
* [Secure data in Data Lake Storage Gen1](data-lake-store-secure-data.md)
