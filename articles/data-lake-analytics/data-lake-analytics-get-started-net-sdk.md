<properties 
   pageTitle="Get started with Azure Data Lake Analytics using .NET SDK | Azure" 
   description="Learn how to use the .NET SDK to create Data Lake Store accounts, create Data Lake Analytics jobs, and submit jobs written in U-SQL. " 
   services="data-lake-analytics" 
   documentationCenter="" 
   authors="edmacauley" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="10/21/2015"
   ms.author="edmaca"/>

# Tutorial: get started with Azure Data Lake Analytics using .NET SDK

[AZURE.INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

Learn how to use the Azure .NET SDK to create Azure Data Lake Analytics accounts, define Data Lake Analytics
jobs in [U-SQL](data-lake-analytics-u-sql-get-started.md), and submit jobs to Data Lake Analtyic accounts. For more 
information about Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

In this tutorial, you will develop a C# console application which contains a U-SQL script that reads a tab separated values (TSV) file and converts it into a comma 
separated values (CSV) file. To go through the same tutorial using other supported tools, click the tabs on the top of this section.

**The basic Data Lake Analytics process:**

![Azure Data Lake Analytics process flow diagram](./media/data-lake-analytics-get-started-portal/data-lake-analytics-process.png)

1. Create a Data Lake Analytics account.
2. Prepare the source data. Data Lake Analytic jobs can read data from either Azure Data Lake Store accounts or Azure Blob storage accounts.   
3. Develop a U-SQL script.
4. Submit a job (U-SQL script) to the Data Lake Analytics account. The job reads from the source data, process the data as instructed 
in the U-SQL script, and then save the output to either a Data Lake Store account or a Blob storage account.

**Prerequisites**

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial]https://azure.microsoft.com/en-us/pricing/free-trial/).
- **Visual Studio**. 

##Create a C# console application

In this tutorial, you will process some search logs.  The search log can be stored in either Data Lake store or Azure Blob storage. 

A sample search log has been copied to a public Azure Blob container. In the application, you will download the file to your workstation, and then upload the file to the default Data Lake Store account.

**To create an application**

1. Open Visual Studio.
2. Create a C# console application.
3. Open Nuget Package Management console, and run the following commands:

        Install-Package Microsoft.Azure.Common.Authentication -Pre
        Install-Package Microsoft.Azure.Management.DataLake.Analytics -Pre
        Install-Package Microsoft.Azure.Management.DataLake.AnalyticsCatalog -Pre
        Install-Package Microsoft.Azure.Management.DataLake.AnalyticsJob -Pre
        Install-Package Microsoft.Azure.Management.DataLake.Store -Pre
        Install-Package Microsoft.Azure.Management.DataLake.StoreFileSystem -Pre
        Install-Package Microsoft.Azure.Management.DataLake.StoreUploader -Pre
        Install-Package WindowsAzure.Storage

4. Add a new file to the project called **SampleUSQLScript.txt**, and then paste the following U-SQL script. The Data Lake Analtyics jobs are written in the U-SQL language. To learn more about U-SQL, see [Get started with U-SQL language](data-lake-analytics-u-sql-get-started.md) and [U-SQL language reference](http://go.microsoft.com/fwlink/?LinkId=691348).

        @searchlog =
            EXTRACT UserId          int,
                    Start           DateTime,
                    Region          string,
                    Query           string,
                    Duration        int?,
                    Urls            string,
                    ClickedUrls     string
            FROM "/Samples/Data/SearchLog.tsv"
            USING Extractors.Tsv();
        
        OUTPUT @searchlog   
            TO "/Output/SearchLog-from-Data-Lake.csv"
        USING Outputters.Csv();

	This U-SQL script reads the source data file using **Extractors.Tsv()**, and then creates a csv file using **Outputters.Csv()**. 
    
    In the C# program, you will need to prepare the **/Samples/Data/SearchLog.tsv** file, and the **/Output/** folder.    
	
	It is simpler to use relative paths for files stored in default data Lake accounts. You can also use absolute paths.  For example 
    
        adl://<Data LakeStorageAccountName>.azuredatalakestore.net:443/Samples/Data/SearchLog.tsv
        
    You must use absolute paths to access  files in  linked Storage accounts.  The syntax for files stored in linked Azure Storage account is:
    
        wasb://<BlobContainerName>@<StorageAccountName>.blob.core.windows.net/Samples/Data/SearchLog.tsv

    >[AZURE.NOTE] Azure Blob container with public blobs or public containers access permissions are not currently supported.    
       
       
5. In Program.cs, paste the following code:

        using System;
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
        
        using Microsoft.Azure.Management.DataLake.Analytics;
        using Microsoft.Azure.Management.DataLake.Analytics.Models;
        using Microsoft.Azure.Management.DataLake.AnalyticsJob;
        using Microsoft.Azure.Management.DataLake.AnalyticsJob.Models;
        
        using Microsoft.WindowsAzure.Storage.Blob;
        
        namespace data_lake_analytics_get_started
        {
            class Program
            {
        
                private const string AzureSubscriptionID = "<Your Azure Subscription ID>";
        
                private const string ResourceGroupName = "<Existing Azure Resource Group Name>"; //See the Get started using portal article
                private const string Location = "<Azure Data Center>";  //For example, EAST US 2
                private const string DataLakeStoreAccountName = "<Data Lake Store Account Name>"; // The application will create this account.
                private const string DataLakeAnalyticsAccountName = "<Data Lake Analytics Account Name>"; //The application will create this account.
        
                private const string LocalFolder = @"C:\tutorials\downloads\";  //local folder with write permission for file transferring.
        
                private static DataLakeStoreManagementClient _dataLakeStoreClient;
                private static DataLakeStoreFileSystemManagementClient _dataLakeStoreFileSystemClient;
        
                private static DataLakeAnalyticsManagementClient _dataLakeAnalyticsClient;
                private static DataLakeAnalyticsJobManagementClient _dataLakeAnalyticsJobClient;
        
                static void Main(string[] args)
                {
                    var subscriptionId = new Guid(AzureSubscriptionID);
                    var _credentials = GetAccessToken();
        
                    _credentials = GetCloudCredentials(_credentials, subscriptionId);
                    _dataLakeStoreClient = new DataLakeStoreManagementClient(_credentials);
                    _dataLakeStoreFileSystemClient = new DataLakeStoreFileSystemManagementClient(_credentials);
                    _dataLakeAnalyticsClient = new DataLakeAnalyticsManagementClient(_credentials);
                    _dataLakeAnalyticsJobClient = new DataLakeAnalyticsJobManagementClient(_credentials);
        
                    //=========================
                    Console.WriteLine("Creating the Azure Data Lake Store account ...");
                    var storeAccountParameters = new DataLakeStoreAccountCreateOrUpdateParameters();
                    storeAccountParameters.DataLakeStoreAccount = new Microsoft.Azure.Management.DataLake.Store.Models.DataLakeStoreAccount
                    {
                        Name = DataLakeStoreAccountName,
                        Location = Location
                    };
                    _dataLakeStoreClient.DataLakeStoreAccount.Create(ResourceGroupName, storeAccountParameters);
        
                    //=========================
                    Console.WriteLine("Preparing the source data file and output folder ...");
        
                    // Download the source file from a public Azure Blob container.
                    CloudBlockBlob blob = new CloudBlockBlob(new Uri("https://adltutorials.blob.core.windows.net/adls-sample-data/SearchLog.tsv"));
                    blob.DownloadToFile(LocalFolder + "SearchLog.tsv", System.IO.FileMode.Create);
        
                    // Create a folder in the default Data Lake Store account.
                    _dataLakeStoreFileSystemClient.FileSystem.Mkdirs("/Samples/Data/", DataLakeStoreAccountName, "777");
        
                    // Create the output folder in the default Data Lake Store account
                    _dataLakeStoreFileSystemClient.FileSystem.Mkdirs("/Output/", DataLakeStoreAccountName, "777");
        
                    // Upload the source file to the default Data Lake Store account
                    var uploadParameters = new UploadParameters(LocalFolder + "SearchLog.tsv", "/Samples/Data/SearchLog.tsv", DataLakeStoreAccountName, isOverwrite: true);
                    var uploader = new DataLakeStoreUploader(uploadParameters, new DataLakeStoreFrontEndAdapter(DataLakeStoreAccountName, _dataLakeStoreFileSystemClient));
                    uploader.Execute();
        
                    //=========================
                    Console.WriteLine("Creating the Data Lake Analytics account ...");
                    var analyticsAccountParameters = new DataLakeAnalyticsAccountCreateOrUpdateParameters();
                    analyticsAccountParameters.DataLakeAnalyticsAccount = new DataLakeAnalyticsAccount
                    {
                        Name = DataLakeAnalyticsAccountName,
                        Location = Location,
                        Properties = new DataLakeAnalyticsAccountProperties()
                    };
        
                    //create a DataLakeStoreAccount object, add it to the analytics client and then set it as the default ADL Store account
                    Microsoft.Azure.Management.DataLake.Analytics.Models.DataLakeStoreAccount storeAccountObject = new Microsoft.Azure.Management.DataLake.Analytics.Models.DataLakeStoreAccount();
                    storeAccountObject.Name = DataLakeStoreAccountName;
                    analyticsAccountParameters.DataLakeAnalyticsAccount.Properties.DataLakeStoreAccounts.Add(storeAccountObject);
                    analyticsAccountParameters.DataLakeAnalyticsAccount.Properties.DefaultDataLakeStoreAccount = DataLakeStoreAccountName;
        
                    _dataLakeAnalyticsClient.DataLakeAnalyticsAccount.Create(ResourceGroupName, analyticsAccountParameters);
        
                    //=========================
                    Console.WriteLine("Submitting the job ...");
        
                    USqlProperties uSQLProperties = new USqlProperties
                    {
                        Type = JobType.USql,
                        Script = File.ReadAllText("SampleUSQLScript.txt")
                    };
        
                    JobInformation jobParameters = new JobInformation
                    {
                        JobId = Guid.NewGuid(),
                        Name = "myfirstdatalakeanalyticsjob",
                        Properties = uSQLProperties,
                        Type = JobType.USql,
                        DegreeOfParallelism = 1,
                        Priority = 1
                    };
        
                    _dataLakeAnalyticsJobClient.Jobs.Create(ResourceGroupName, DataLakeAnalyticsAccountName, new JobInfoBuildOrCreateParameters { Job = jobParameters });
        
                    Console.WriteLine(" Downloading results ...");
                    FileCreateOpenAndAppendResponse beginOpenResponse = _dataLakeStoreFileSystemClient.FileSystem.BeginOpen("/Output/SearchLog-from-Data-Lake.csv", DataLakeStoreAccountName, new FileOpenParameters());
                    FileOpenResponse openResponse = _dataLakeStoreFileSystemClient.FileSystem.Open(beginOpenResponse.Location);
                    System.IO.File.WriteAllBytes(LocalFolder + "SearchLog-from-Data-Lake.csv", openResponse.FileContents);
        
                    Console.WriteLine("Done");
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
            }
        }

7. Press **F5** to run the application.

## See also

- To see the same tutorial using other tools, click the tab selectors on the top of the page.
- To see a more complexed query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
- To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
- To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
- For management tasks, see [Manage Azure Data Lake Analytics using Azure Preview Portal](data-lake-analytics-manage-use-portal.md).
- To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

