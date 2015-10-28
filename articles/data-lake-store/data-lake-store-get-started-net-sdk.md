<properties 
   pageTitle="Use Data Lake Store .NET SDK to develop applications | Azure" 
   description="Use Azure Data Lake Store .NET SDK to develop applications" 
   services="data-lake-store" 
   documentationCenter="" 
   authors="nitinme" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="10/28/2015"
   ms.author="nitinme"/>

# Get started with Azure Data Lake Store using .NET SDK

> [AZURE.SELECTOR]
- [Using Portal](data-lake-store-get-started-portal.md)
- [Using PowerShell](data-lake-store-get-started-powershell.md)
- [Using .NET SDK](data-lake-store-get-started-net-sdk.md)

Learn how to use the Azure Data Lake Store .NET SDK to create an Azure Data Lake account and perform basic operations such as create folders, upload and download data files, delete your account, etc. For more information about Data Lake, see [Azure Data Lake Store](data-lake-store-overview.md).

## Prerequisites

* Visual Studio 2013 or 2015. The instructions below use Visual Studio 2015.
* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/en-us/pricing/free-trial/).
* **Enable your Azure subscription** for Data Lake Store public preview. See [instructions](data-lake-store-get-started-portal.md#signup).

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

5. Add the Nuget package to your project. 

	1. Right-click the project name in the Solution Explorer and click **Manage NuGet Packages**.
	2. In the **Nuget Package Manager** dialog box, make sure that **Package source** is set to **nuget.org** and that **Include Prerelease** check box is selected.
	3. Search for and install the following packages:
	
		* Microsoft.Azure.Common.Authentication
		* Microsoft.Azure.Management.DataLake.Store
		* Microsoft.Azure.Management.DataLake.StoreFileSystem
		* Microsoft.Azure.Management.DataLake.StoreUploader

		![Add a Nuget source](./media/data-lake-store-get-started-net-sdk/ADL.Install.Nuget.Package.png "Create a new Azure Data Lake account")

	4. Close the **Nuget Package Manager**.

7. Open **Program.cs** and replace the existing code block with the following code. Also, provide the values for parameters in the code snippet. 

	This code goes through the process of creating a Data Lake Store, creating folders in the store, uploading files, downloading files, and finally deleting the account. If you are looking for some sample data to upload, you can get the **Ambulance Data** folder from the [Azure Data Lake Git Repository](https://github.com/MicrosoftBigData/ProjectKona/tree/master/SQLIPSamples/SampleData/AmbulanceData).
	
		using System;
		using System.Collections.Generic;
		using System.Linq;
		using System.Security;
		using System.IO;
		
		using Microsoft.Azure;
		using Microsoft.Azure.Common.Authentication;
		using Microsoft.Azure.Common.Authentication.Models;
		using Microsoft.Azure.Management.DataLake.Store;
		using Microsoft.Azure.Management.DataLake.Store.Models;
		using Microsoft.Azure.Management.DataLake.StoreFileSystem;
		using Microsoft.Azure.Management.DataLake.StoreFileSystem.Models;
		using Microsoft.Azure.Management.DataLake.StoreUploader;
		using Microsoft.Azure.Common.Authentication.Factories;
		
		
		namespace CreateADLApplication
		{
		    class CreateADLApplication
		    {
		        private static DataLakeStoreManagementClient _dataLakeStoreClient;
		        private static DataLakeStoreFileSystemManagementClient _dataLakeStoreFileSystemClient;
		        private const string ResourceGroupName = "<resource_grp_name>"; //THIS SHOULD ALREADY EXIST
		
		        static void Main(string[] args)
		        {
		            var subscriptionId = new Guid("<subscription_ID>");
		            var _credentials = GetAccessToken();
		            string dataLakeAccountName = "<data_lake_store_name>";
		            string location = "East US 2";
		
		            _credentials = GetCloudCredentials(_credentials, subscriptionId);
		            _dataLakeStoreClient = new DataLakeStoreManagementClient(_credentials);
		            _dataLakeStoreFileSystemClient = new DataLakeStoreFileSystemManagementClient(_credentials);
		
		            var parameters = new DataLakeStoreAccountCreateOrUpdateParameters();
		            parameters.DataLakeStoreAccount = new DataLakeStoreAccount
		            {
		                Name = dataLakeAccountName,
		                Location = location
		            };
		
		            // Create a Data Lake Store account
		            Console.WriteLine("Creating an Azure Data Lake Store account ...");
		            _dataLakeStoreClient.DataLakeStoreAccount.Create(ResourceGroupName, parameters);
		
		            Console.WriteLine("Account created. Press ENTER to continue...");
		            Console.ReadLine();
		
		            // Create a directory called MYTEMPDIR in the store
		            Console.WriteLine("Creating a directory under the Azure Data Lake Store account");
		            CreateDir(_dataLakeStoreFileSystemClient, "/mytempdir", dataLakeAccountName, "777");
		            Console.WriteLine("Directory created. Press ENTER to continue...");
		            Console.ReadLine();
		
		            // Upload a file under MYTEMPDIR
		            Console.WriteLine("Uploading a file to the Azure Data Lake Store account");
		            bool force = false; //Set this to true if you want to overwrite existing data
		            UploadFile(_dataLakeStoreFileSystemClient, dataLakeAccountName, "C:\\users\\nitinme\\desktop\\vehicle1_09142014.csv", "/mytempdir/vehicle1_09142014.csv", force);
		            Console.WriteLine("File uploaded. Press ENTER to continue...");
		            Console.ReadLine();
		
		            // List the files in the Data Lake Store
		            Console.WriteLine("Listing all files in the Azure Data Lake Store account");
		            var fileList = ListItems(_dataLakeStoreFileSystemClient, dataLakeAccountName, "/mytempdir");
		            var fileMenuItems = fileList.Select(a => String.Format("{0,15} {1}", a.Type, a.PathSuffix)).ToList();
		            foreach (var filename in fileMenuItems)
		            {
		                Console.WriteLine(filename);
		
		            }
		            Console.WriteLine("Files listed. Press ENTER to continue...");
		            Console.ReadLine();
		
		            // Download the files from the Data Lake Store
		            Console.WriteLine("Downloading files from an Azure Data Lake Store account");
		            DownloadFile(_dataLakeStoreFileSystemClient, dataLakeAccountName, "/mytempdir/vehicle1_09142014.csv", "C:\\users\\nitinme\\desktop\\vehicle1_09142014_copy.csv", force);
		            Console.WriteLine("Files downloaded. Press ENTER to continue...");
		            Console.ReadLine();
		
		            // Delete the Data Lake Store account
		            Console.WriteLine("Azure Data Lake Store account will be deleted. Press ENTER to continue...");
		            _dataLakeStoreClient.DataLakeStoreAccount.Delete(ResourceGroupName, dataLakeAccountName);
		            Console.ReadLine();
		            Console.WriteLine("Account deleted. Press ENTER to exit...");
		            Console.ReadLine();
		        }
		
		        public static SubscriptionCloudCredentials GetAccessToken(string username = null, SecureString password = null)
		        {
		            var authFactory = new AuthenticationFactory();
		
		            var account = new AzureAccount { Type = AzureAccount.AccountType.User };
		
		            if (username != null && password != null)
		                account.Id = username;
		
		            var env = AzureEnvironment.PublicEnvironments[EnvironmentName.AzureCloud];
		            return new TokenCloudCredentials(authFactory.Authenticate(account, env, AuthenticationFactory.CommonAdTenant, password, ShowDialog.Auto).AccessToken);
		        }
		
		        public static SubscriptionCloudCredentials GetCloudCredentials(SubscriptionCloudCredentials creds, Guid subId)
		        {
		            return new TokenCloudCredentials(subId.ToString(), ((TokenCloudCredentials)creds).Token);
		        }
		
		        public static bool CreateDir(DataLakeStoreFileSystemManagementClient dataLakeStoreFileSystemClient, string path, string dlAccountName, string permission)
		        {
		            dataLakeStoreFileSystemClient.FileSystem.Mkdirs(path, dlAccountName, permission);
		            return true;
		        }
		
		        public static bool UploadFile(DataLakeStoreFileSystemManagementClient dataLakeStoreFileSystemClient, string dlAccountName, string srcPath, string destPath, bool force = false)
		        {
		            var parameters = new UploadParameters(srcPath, destPath, dlAccountName, isOverwrite: true);
		            var frontend = new DataLakeStoreFrontEndAdapter(dlAccountName, dataLakeStoreFileSystemClient);
		            var uploader = new DataLakeStoreUploader(parameters, frontend);
		            uploader.Execute();
		            return true;
		        }
		
		        public static void DownloadFile(DataLakeStoreFileSystemManagementClient dataLakeFileSystemClient,
		        string dataLakeAccountName, string srcPath, string destPath, bool force)
		        {
		            var beginOpenResponse = dataLakeFileSystemClient.FileSystem.BeginOpen(srcPath, dataLakeAccountName,
		                new FileOpenParameters());
		            var openResponse = dataLakeFileSystemClient.FileSystem.Open(beginOpenResponse.Location);
		            if (force || !File.Exists(destPath))
		                File.WriteAllBytes(destPath, openResponse.FileContents);
		        }
		
		        public static List<FileStatusProperties> ListItems(DataLakeStoreFileSystemManagementClient dataLakeFileSystemClient, string dataLakeAccountName, string path)
		        {
		            var response = dataLakeFileSystemClient.FileSystem.ListFileStatus(path, dataLakeAccountName, new DataLakeStoreFileSystemListParameters());
		            return response.FileStatuses.FileStatus.ToList();
		        }
		    }
		}


8. Build and run the application. Follow the prompts to run and complete the application.

## Other ways of creating a Data Lake Store account

- [Get Started with Data Lake Store using Portal](data-lake-store-get-started-portal.md)
- [Get Started with Data Lake Store using PowerShell](data-lake-store-get-started-powershell.md) 


## Next steps

- [Secure data in Data Lake Store](data-lake-store-secure-data.md)
- [Use Azure Data Lake Analytics with Data Lake Store](data-lake-analytics-get-started-portal.md)
- [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)

