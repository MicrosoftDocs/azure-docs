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
- [Portal](data-lake-store-get-started-portal.md)
- [PowerShell](data-lake-store-get-started-powershell.md)
- [.NET SDK](data-lake-store-get-started-net-sdk.md)
- [Azure CLI](data-lake-store-get-started-cli.md)

Learn how to use the Azure Data Lake Store .NET SDK to create an Azure Data Lake account and perform basic operations such as create folders, upload and download data files, delete your account, etc. For more information about Data Lake, see [Azure Data Lake Store](data-lake-store-overview.md).

## Prerequisites

* Visual Studio 2013
* **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
* **Enable your Azure subscription** for Data Lake Store public preview. See [instructions](data-lake-store-get-started-portal.md#signup).

## Create a .NET application

1. Open Visual Studio 2013 and create a console application.

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
	2. In the **Manage Nuget Packages** dialog box, click **Settings**.
	3. [ TBD: Fix this step ]From the drop-down select **Include Prerelease**, and then search for **Data Lake Store**. From the result, install the following packages.

		![Add a Nuget source](./media/data-lake-store-get-started-net-sdk/ADL.Install.Nuget.Package.png "Create a new Azure Data Lake account")

	5. Click **Close** in the **Manage Nuget Packages** dialog box.

7. Open Program.cs and replace the existing code block with the following code:

	
			using System;
			using System.Collections.Generic;
			using System.Linq;
			using System.Text;
			using System.Threading.Tasks;
			using System.Security;
			using System.Diagnostics;
			using System.IO;
			
			using Microsoft.Azure;
			using Microsoft.Azure.Common.Authentication;
			using Microsoft.Azure.Common.Authentication.Models;
			using Microsoft.Azure.Management.DataLake;
			using Microsoft.Azure.Management.DataLake.Store;
			using Microsoft.Azure.Management.DataLake.Store.Models;
			using Microsoft.Azure.Management.DataLake.StoreFileSystem;
			using Microsoft.Azure.Management.DataLake.StoreFileSystem.Models;
			using Microsoft.Azure.Management.DataLake.StoreUploader;
			using Microsoft.IdentityModel.Clients.ActiveDirectory;
			using Microsoft.Azure.Common.Authentication.Factories;
			
			
			namespace CreateADLApplication
			{
			    class CreateADLApplication
			    {
			        private static DataLakeStoreManagementClient _dataLakeStoreClient;
			        private static DataLakeStoreFileSystemManagementClient _dataLakeStoreFileSystemClient;
			        private const string ResourceGroupName = "myresourcegroup"; \\This should already exist
			
					static void Main(string[] args)
			        {
			            var subscriptionId = new Guid("<subscription id>");
			            var _credentials = GetAccessToken();
			
			            _credentials = GetCloudCredentials(_credentials, subscriptionId);
			            _dataLakeStoreClient = new DataLakeStoreManagementClient(_credentials);
			            _dataLakeStoreFileSystemClient = new DataLakeStoreFileSystemManagementClient(_credentials);
			
			            var parameters = new DataLakeStoreAccountCreateOrUpdateParameters();
			            parameters.DataLakeStoreAccount = new DataLakeStoreAccount
			            {
			                Name = "adlstoredotnetaccount",
			                Location = "East US 2"
			            };
			
			            // Create an ADL Store account
			            Console.WriteLine("Creating an Azure Data Lake Store account ...");
			            _dataLakeStoreClient.DataLakeStoreAccount.Create(ResourceGroupName, parameters);
			
			            Console.WriteLine("Account created. Press any key to continue...");
			            Console.ReadLine();
			
			            // Create a directory
			            Console.WriteLine("Creating a directory under the Azure Data Lake Store account");
			            CreateDir(_dataLakeStoreFileSystemClient, "/mytempdir", "adlstoredotnetaccount", "777");
			            Console.WriteLine("Directory created. Press any key to continue...");
			            Console.ReadLine();
			
			            // Upload a file
			            Console.WriteLine("Uploading a file to the Azure Data Lake Store account");
			            bool force = true;
			            UploadFile(_dataLakeStoreFileSystemClient, "adlstoredotnetaccount", "C:\\users\\nitinme\\desktop\\filename.txt", "/mytempdir/filename.txt", force);
			            Console.WriteLine("File uploaded. Press any key to continue...");
			            Console.ReadLine();
			
			            // List the files
			            Console.WriteLine("Listing all files in the Azure Data Lake Store account");
			            var fileList = ListItems(_dataLakeStoreFileSystemClient, "adlstoredotnetaccount", "/mytempdir");
			            var fileMenuItems = fileList.Select(a => String.Format("{0,15} {1}", a.Type, a.PathSuffix)).ToList();
			            foreach (var filename in fileMenuItems)
			            {
			                Console.WriteLine(filename);
			
			            }
			            Console.WriteLine("Files listed. Press any key to continue...");
			            Console.ReadLine();
			
			            // Download the files
			            Console.WriteLine("Downloading files from an Azure Data Lake Store account");
			            bool force = true;
			            DownloadFile(_dataLakeStoreFileSystemClient, "adlstoredotnetaccount", "/mytempdir/filename.txt", "C:\\users\\nitinme\\desktop\\filenamecopied.txt", force);
			            Console.WriteLine("Files downloaded. Press any key to continue...");
			            Console.ReadLine();
			
			            // Delete the ADL Store account
			            _dataLakeStoreClient.DataLakeStoreAccount.Delete(ResourceGroupName, "adlstoredotnetaccount");
			            Console.WriteLine("Azure Data Lake Store account will be deleted. Press any key to continue...");
			            Console.ReadLine();
			            Console.WriteLine("Account deleted. Press any key to exit...");
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
 
## See also

- [Use Azure Data Lake Analytics with Data Lake Store](data-lake-analytics-get-started-portal.md)
- [Use Azure HDInsight with Data Lake Store](data-lake-store-hdinsight-hadoop-use-portal.md)
- [Get Started with Data Lake Store using Portal](data-lake-store-get-started-portal.md)
- [Get Started with Data Lake Store using PowerShell](data-lake-store-get-started-powershell.md) 
