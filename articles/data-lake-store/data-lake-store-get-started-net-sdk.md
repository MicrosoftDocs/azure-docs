<properties
   pageTitle="Use Data Lake Store .NET SDK to develop applications | Microsoft Azure"
   description="Use Azure Data Lake Store .NET SDK to develop applications"
   services="data-lake-store"
   documentationCenter=""
   authors="nitinme"
   manager="jhubbard"
   editor="cgronlun"/>

<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="09/15/2016"
   ms.author="nitinme"/>

# Get started with Azure Data Lake Store using .NET SDK

> [AZURE.SELECTOR]
- [Portal](data-lake-store-get-started-portal.md)
- [PowerShell](data-lake-store-get-started-powershell.md)
- [.NET SDK](data-lake-store-get-started-net-sdk.md)
- [Java SDK](data-lake-store-get-started-java-sdk.md)
- [REST API](data-lake-store-get-started-rest-api.md)
- [Azure CLI](data-lake-store-get-started-cli.md)
- [Node.js](data-lake-store-manage-use-nodejs.md)

Learn how to use the [Azure Data Lake Store .NET SDK](https://msdn.microsoft.com/library/mt581387.aspx) to perform basic operations such as create folders, upload and download data files, etc. For more information about Data Lake, see [Azure Data Lake Store](data-lake-store-overview.md).

## Prerequisites

* **Visual Studio 2013 or 2015**. The instructions below use Visual Studio 2015.

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

* **Azure Data Lake Store account**. For instructions on how to create an account, see [Get started with Azure Data Lake Store](data-lake-store-get-started-portal.md)

* **Create an Azure Active Directory Application** if you want your application to automatically authenticate with Azure Active Directory.

	* **For non-interactive, service principal authentication** - In Azure Active Directory, you must create a **Web application**. Once you have created the application, retrieve the following values related to the application.
		- Get **client ID** and **client secret** for the application
		- Assign the Azure Active Directory application to a role. The role can be at the level of the scope at which you want to give permission to the Azure Active Directory application. For example, you can assign the application at the subscription level or at the level of a resource group. 

	See [Create Active Directory application and service principal using portal](../resource-group-create-service-principal-portal.md) for instructions on how to retrieve these values, set the permissions, and assign roles.

## Create a .NET application

1. Open Visual Studio and create a console application.

2. From the **File** menu, click **New**, and then click **Project**.

3. From **New Project**, type or select the following values:

	| Property | Value                       |
	|----------|-----------------------------|
	| Category | Templates/Visual C#/Windows |
	| Template | Console Application         |
	| Name     | CreateADLApplication        |

4. Click **OK** to create the project.

5. Add the Nuget packages to your project.

	1. Right-click the project name in the Solution Explorer and click **Manage NuGet Packages**.
	2. In the **Nuget Package Manager** tab, make sure that **Package source** is set to **nuget.org** and that **Include prerelease** check box is selected.
	3. Search for and install the following NuGet packages:

		* `Microsoft.Azure.Management.DataLake.Store` - This tutorial uses v0.12.5-preview.
		* `Microsoft.Azure.Management.DataLake.StoreUploader` - This tutorial uses v0.10.6-preview.
		* `Microsoft.Rest.ClientRuntime.Azure.Authentication` - This tutorial uses v2.2.8-preview.

		![Add a Nuget source](./media/data-lake-store-get-started-net-sdk/ADL.Install.Nuget.Package.png "Create a new Azure Data Lake account")

	4. Close the **Nuget Package Manager**.

6. Open **Program.cs**, delete the existing code, and then include the following statements to add references to namespaces.

        using System;
        using System.Threading;
        
        using Microsoft.Rest.Azure.Authentication;
        using Microsoft.Azure.Management.DataLake.Store;
        using Microsoft.Azure.Management.DataLake.StoreUploader;

7. Declare the variables as shown below, and provide the values for Data Lake Store name and the resource group name that already exist. Also, make sure the local path and file name you provide here must exist on the computer. Add the following code snippet after the namespace declarations.

        namespace SdkSample
        {
            class Program
            {
                private static DataLakeStoreAccountManagementClient _adlsClient;
                private static DataLakeStoreFileSystemManagementClient _adlsFileSystemClient;
                
                private static string _adlsAccountName;
                private static string _resourceGroupName;
                private static string _location;
                
                private static void Main(string[] args)
                {
                    _adlsAccountName = "<DATA-LAKE-STORE-NAME>"; // TODO: Replace this value with the name of your existing Data Lake Store account.
                    _resourceGroupName = "<RESOURCE-GROUP-NAME>"; // TODO: Replace this value with the name of the resource group containing your Data Lake Store account.
                    _location = "East US 2";
                    
                    string localFolderPath = @"C:\local_path\"; // TODO: Make sure this exists and can be overwritten.
                    string localFilePath = localFolderPath + "file.txt"; // TODO: Make sure this exists and can be overwritten.
                    string remoteFolderPath = "/data_lake_path/";
                    string remoteFilePath = remoteFolderPath + "file.txt";
                }
            }
        }

In the remaining sections of the article, you can see how to use the available .NET methods to perform operations such as authentication, file upload, etc.

## Authentication

The following snippet can be used use for an interactive log in experience.

    // User login via interactive popup
    //    Use the client ID of an existing AAD "Native Client" application.
    SynchronizationContext.SetSynchronizationContext(new SynchronizationContext());
    var domain = "common"; // Replace this string with the user's Azure Active Directory tenant ID or domain name, if needed.
    var nativeClientApp_clientId = "1950a258-227b-4e31-a9cf-717495945fc2";
    var activeDirectoryClientSettings = ActiveDirectoryClientSettings.UsePromptOnly(nativeClientApp_clientId, new Uri("urn:ietf:wg:oauth:2.0:oob"))
    var creds = UserTokenProvider.LoginWithPromptAsync(domain, activeDirectoryClientSettings).Result;

Alternatively, the following snippet can be used to authenticate your application non-interactively, using the client secret / key for an application / service principal.

    // Service principal / appplication authentication with client secret / key
    //    Use the client ID and certificate of an existing AAD "Web App" application.
    SynchronizationContext.SetSynchronizationContext(new SynchronizationContext());
    var domain = "<AAD-directory-domain>";
    var webApp_clientId = "<AAD-application-clientid>";
    var clientSecret = "<AAD-application-clientid>";
    var clientCredential = new ClientCredential(webApp_clientId, clientSecret);
    var creds = ApplicationTokenProvider.LoginSilentAsync(domain, clientCredential).Result;

As a third option, the following snippet can be used to authenticate your application non-interactively, using the certificate for an application / service principal.

    // Service principal / application authentication with certificate
    //    Use the client ID and certificate of an existing AAD "Web App" application.
    SynchronizationContext.SetSynchronizationContext(new SynchronizationContext());
    var domain = "<AAD-directory-domain>";
    var webApp_clientId = "<AAD-application-clientid>";
    System.Security.Cryptography.X509Certificates.X509Certificate2 clientCert = <AAD-application-client-certificate>
    var clientAssertionCertificate = new ClientAssertionCertificate(webApp_clientId, clientCert);
    var creds = ApplicationTokenProvider.LoginSilentWithCertificateAsync(domain, clientAssertionCertificate).Result;

## Create client objects

The following snippet creates the Data Lake Store account and filesystem client objects, which are used to issue requests to the service.

    // Create client objects
    var fileSystemClient = new DataLakeStoreFileSystemManagementClient(creds);

## List all Data Lake Store accounts within a subscription

The following snippet lists all Data Lake Store accounts within a given Azure subscription.

    // List all ADLS accounts within the subscription
    public static List<DataLakeStoreAccount> ListAdlStoreAccounts()
    {
        var response = _adlsClient.Account.List(_adlsAccountName);
        var accounts = new List<DataLakeStoreAccount>(response);
        
        while (response.NextPageLink != null)
        {
            response = _adlsClient.Account.ListNext(response.NextPageLink);
            accounts.AddRange(response);
        }
        
        return accounts;
    }

## Create a directory

The following snippet shows a `CreateDirectory` method that you can use to create a directory within a Data Lake Store account.

    // Create a directory
    public static void CreateDirectory(string path)
    {
        _adlsFileSystemClient.FileSystem.Mkdirs(_adlsAccountName, path);
    }

## Upload a file

The following snippet shows an `UploadFile` method that you can use to upload files to a Data Lake Store account.

    // Upload a file
    public static void UploadFile(string srcFilePath, string destFilePath, bool force = true)
    {
        var parameters = new UploadParameters(srcFilePath, destFilePath, _adlsAccountName, isOverwrite: force);
        var frontend = new DataLakeStoreFrontEndAdapter(_adlsAccountName, _adlsFileSystemClient);
        var uploader = new DataLakeStoreUploader(parameters, frontend);
        uploader.Execute();
    }

DataLakeStoreUploader supports recursive upload and download between a local file (or folder) path to Data Lake store.    

## Get file or directory info

The following snippet shows a `GetItemInfo` method that you can use to retrieve information about a file or directory available in Data Lake Store. 

    // Get file or directory info
    public static FileStatusProperties GetItemInfo(string path)
    {
        return _adlsFileSystemClient.FileSystem.GetFileStatus(_adlsAccountName, path).FileStatus;
    }

## List file or directories

The following snippet shows a `ListItem` method that can use to list the file and directories in a Data Lake Store account.

    // List files and directories
    public static List<FileStatusProperties> ListItems(string directoryPath)
    {
        return _adlsFileSystemClient.FileSystem.ListFileStatus(_adlsAccountName, directoryPath).FileStatuses.FileStatus.ToList();
    }

## Concatenate files

The following snippet shows a `ConcatenateFiles` method that you use to concatenate files. 

    // Concatenate files
    public static void ConcatenateFiles(string[] srcFilePaths, string destFilePath)
    {
        _adlsFileSystemClient.FileSystem.Concat(_adlsAccountName, destFilePath, srcFilePaths);
    }

## Append to a file

The following snippet shows a `AppendToFile` method that you use append data to a file already stored in a Data Lake Store account.

    // Append to file
    public static void AppendToFile(string path, string content)
    {
        var stream = new MemoryStream(Encoding.UTF8.GetBytes(content));
        
        _adlsFileSystemClient.FileSystem.Append(_adlsAccountName, path, stream);
    }

## Download a file

The following snippet shows a `DownloadFile` method that you use to download a file from a Data Lake Store account.

    // Download file
    public static void DownloadFile(string srcPath, string destPath)
    {
        var stream = _adlsFileSystemClient.FileSystem.Open(_adlsAccountName, srcPath);
        var fileStream = new FileStream(destPath, FileMode.Create);
        
        stream.CopyTo(fileStream);
        fileStream.Close();
        stream.Close();
    }

## Next steps

- [Secure data in Data Lake Store](data-lake-store-secure-data.md)
- [Use Azure Data Lake Analytics with Data Lake Store](../data-lake-analytics/data-lake-analytics-get-started-portal.md)
- [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)
- [Data Lake Store .NET SDK Reference](https://msdn.microsoft.com/library/mt581387.aspx)
- [Data Lake Store REST Reference](https://msdn.microsoft.com/library/mt693424.aspx)
