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
   ms.topic="hero-article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="02/25/2016"
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

##Prerequisites

Before you begin this tutorial, you must have the following:

- **Visual Studio 2015, Visual Studio 2013 update 4, or Visual Studio 2012 with Visual C++ Installed**.
- **Microsoft Azure SDK for .NET version 2.5 or above**.  Install it using the [Web platform installer](http://www.microsoft.com/web/downloads/platform.aspx).
- **[Data Lake Tools for Visual Studio](http://aka.ms/adltoolsvs)**. 
- **A Data Lake Analytics account**.  See [Create an Azure Data Lake Analytics account](data-lake-analytics-get-started-portal.md#create_adl_analytics_account).

	Data Lake Tools for Visual Studio doesn't support creating Data Lake Analytics accounts.  To create one, use the Azure Portal, Azure PowerShell, Azure .NET SDK or Azure CLI. 

##Create console application

In this tutorial, you will process some search logs.  The search log can be stored in either Data Lake store or Azure Blob storage. 

A sample search log has been copied to a public Azure Blob container. In the application, you will download the file to your workstation, and then upload the file to the default Data Lake Store account.

**To create an application**

1. Open Visual Studio.
2. Create a C# console application.
3. Open Nuget Package Management console, and run the following commands:

        Install-Package Microsoft.Azure.Management.DataLake.Analytics -Pre
        Install-Package Microsoft.Azure.Management.DataLake.Store -Pre
        Install-Package Microsoft.Azure.Management.DataLake.StoreUploader -Pre
        Install-Package Microsoft.IdentityModel.Clients.ActiveDirectory
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
        using System.IO;
        using System.Security;
        using System.Text;
        using System.Collections.Generic;
        using System.Linq;

        using Microsoft.Azure.Management.DataLake.Analytics;
        using Microsoft.Azure.Management.DataLake.Analytics.Models;
        using Microsoft.Azure.Management.DataLake.Store;
        using Microsoft.Azure.Management.DataLake.Store.Models;
        using Microsoft.Azure.Management.DataLake.StoreUploader;
        using Microsoft.IdentityModel.Clients.ActiveDirectory;
        using Microsoft.Rest;
        using Microsoft.WindowsAzure.Storage.Blob;

        namespace SdkSample
        {
            class Program
            {
                private static DataLakeAnalyticsAccountManagementClient _adlaClient;
                private static DataLakeAnalyticsJobManagementClient _adlaJobClient;
                private static DataLakeAnalyticsCatalogManagementClient _adlaCatalogClient;
                private static DataLakeStoreAccountManagementClient _adlsClient;
                private static DataLakeStoreFileSystemManagementClient _adlsFileSystemClient;

                private static string _adlaAccountName;
                private static string _adlsAccountName;
                private static string _resourceGroupName;
                private static string _location;

                private static void Main(string[] args)
                {
                    _adlsAccountName = "<DATA-LAKE-STORE-NAME>"; // TODO: Replace this value with the name for a NEW Store account.
                    _adlaAccountName = "<DATA-LAKE-ANALYTICS-NAME>"; // TODO: Replace this value with the name for a NEW Analytics account.
                    _resourceGroupName = "<RESOURCE-GROUP-NAME>"; // TODO: Replace this value. This resource group should already exist.
                    _location = "East US 2";
                    
                    string localFolderPath = @"C:\local_path\"; // TODO: Make sure this exists and contains the U-SQL script.
                    
                    // Authenticate the user
                    // For more information about applications and instructions on how to get a client ID, see: 
                    //   https://azure.microsoft.com/en-us/documentation/articles/resource-group-create-service-principal-portal/
                    var tokenCreds = AuthenticateUser("common", "https://management.core.windows.net/",
                        "<APPLICATION-CLIENT-ID>", new Uri("https://<APPLICATION-REDIRECT-URI>")); // TODO: Replace bracketed values.
                    
                    SetupClients(tokenCreds, "<SUBSCRIPTION-ID>"); // TODO: Replace bracketed value.
                    
                    // Run sample scenarios
                    WaitForNewline("Authenticated.", "Creating NEW accounts.");
                    CreateAccounts();
                    WaitForNewline("Accounts created.", "Preparing the source data file.");

                    // Transfer the source file from a public Azure Blob container to Data Lake Store.
                    CloudBlockBlob blob = new CloudBlockBlob(new Uri("https://adltutorials.blob.core.windows.net/adls-sample-data/SearchLog.tsv"));
                    blob.DownloadToFile(localFolderPath + "SearchLog.tsv", FileMode.Create); // from WASB
                    UploadFile(localFolderPath + "SearchLog.tsv", "/Samples/Data/SearchLog.tsv"); // to ADLS
                    WaitForNewline("Source data file prepared.", "Submitting a job.");

                    // Submit the job
                    Guid jobId = SubmitJobByPath(localFolderPath + "SampleUSQLScript.txt", "My First ADLA Job");
                    WaitForNewline("Job submitted.", "Waiting for job completion.");

                    // Wait for job completion
                    WaitForJob(jobId);
                    WaitForNewline("Job completed.", "Downloading job output.");

                    // Download job output
                    DownloadFile("/Output/SearchLog-from-Data-Lake.csv", localFolderPath + "SearchLog-from-Data-Lake.csv");
                    WaitForNewline("Job output downloaded.", "Deleting accounts.");

                    // Delete accounts
                    DeleteAccounts();
                    WaitForNewline("Accounts deleted. You can now exit.");
                }

                // Helper function to show status and wait for user input
                public static void WaitForNewline(string reason, string nextAction = "")
                {
                    if (!String.IsNullOrWhiteSpace(nextAction))
                    {
                        Console.WriteLine(reason + "\r\nPress ENTER to continue...");
                        Console.ReadLine();
                        Console.WriteLine(nextAction);
                    }
                    else
                    {
                        Console.WriteLine(reason + "\r\nPress ENTER to continue...");
                        Console.ReadLine();
                    }
                }

                // Authenticate the user with AAD through an interactive popup.
                // You need to have an application registered with AAD in order to authenticate.
                //   For more information and instructions on how to register your application with AAD, see: 
                //   https://azure.microsoft.com/en-us/documentation/articles/resource-group-create-service-principal-portal/
                public static TokenCredentials AuthenticateUser(string tenantId, string resource, string appClientId, Uri appRedirectUri, string userId = "")
                {
                    var authContext = new AuthenticationContext("https://login.microsoftonline.com/" + tenantId);

                    var tokenAuthResult = authContext.AcquireToken(resource, appClientId, appRedirectUri,
                        PromptBehavior.Auto, UserIdentifier.AnyUser);

                    return new TokenCredentials(tokenAuthResult.AccessToken);
                }

                // Authenticate the application with AAD through the application's secret key.
                // You need to have an application registered with AAD in order to authenticate.
                //   For more information and instructions on how to register your application with AAD, see: 
                //   https://azure.microsoft.com/en-us/documentation/articles/resource-group-create-service-principal-portal/
                public static TokenCredentials AuthenticateApplication(string tenantId, string resource, string appClientId, Uri appRedirectUri, SecureString clientSecret)
                {
                    var authContext = new AuthenticationContext("https://login.microsoftonline.com/" + tenantId);
                    var credential = new ClientCredential(appClientId, clientSecret);

                    var tokenAuthResult = authContext.AcquireToken(resource, credential);

                    return new TokenCredentials(tokenAuthResult.AccessToken);
                }

                //Set up clients
                public static void SetupClients(TokenCredentials tokenCreds, string subscriptionId)
                {
                    _adlaClient = new DataLakeAnalyticsAccountManagementClient(tokenCreds);
                    _adlaClient.SubscriptionId = subscriptionId;

                    _adlaJobClient = new DataLakeAnalyticsJobManagementClient(tokenCreds);
                    _adlaJobClient.SubscriptionId = subscriptionId;

                    _adlaCatalogClient = new DataLakeAnalyticsCatalogManagementClient(tokenCreds);
                    _adlaCatalogClient.SubscriptionId = subscriptionId;

                    _adlsClient = new DataLakeStoreAccountManagementClient(tokenCreds);
                    _adlsClient.SubscriptionId = subscriptionId;

                    _adlsFileSystemClient = new DataLakeStoreFileSystemManagementClient(tokenCreds);
                    _adlsFileSystemClient.SubscriptionId = subscriptionId;
                }

                // Create accounts
                public static void CreateAccounts()
                {
                    // Create ADLS account
                    var adlsParameters = new DataLakeStoreAccount(location: _location);
                    _adlsClient.Account.Create(_resourceGroupName, _adlsAccountName, adlsParameters);

                    // Create ADLA account
                    var defaultAdlsAccount = new List<DataLakeStoreAccountInfo> { new DataLakeStoreAccountInfo(_adlsAccountName, new DataLakeStoreAccountInfoProperties()) };
                    var adlaProperties = new DataLakeAnalyticsAccountProperties(defaultDataLakeStoreAccount: _adlsAccountName, dataLakeStoreAccounts: defaultAdlsAccount);
                    var adlaParameters = new DataLakeAnalyticsAccount(properties: adlaProperties, location: _location);
                    _adlaClient.Account.Create(_resourceGroupName, _adlaAccountName, adlaParameters);
                }

                // Delete accounts
                public static void DeleteAccounts()
                {
                    _adlaClient.Account.Delete(_resourceGroupName, _adlaAccountName);

                    _adlsClient.Account.Delete(_resourceGroupName, _adlsAccountName);
                }

                // List all ADLA accounts within the subscription
                public static List<DataLakeAnalyticsAccount> ListAdlAnalyticsAccounts()
                {
                    var response = _adlaClient.Account.List(_adlaAccountName);
                    var accounts = new List<DataLakeAnalyticsAccount>(response);

                    while (response.NextPageLink != null)
                    {
                        response = _adlaClient.Account.ListNext(response.NextPageLink);
                        accounts.AddRange(response);
                    }

                    return accounts;
                }

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

                // Submit a U-SQL job by providing script contents.
                // Returns the job ID
                public static Guid SubmitJobByScript(string script, string jobName)
                {
                    var jobId = Guid.NewGuid();
                    var properties = new USqlJobProperties(script);
                    var parameters = new JobInformation(jobName, JobType.USql, properties);

                    var jobInfo = _adlaJobClient.Job.Create(jobId, parameters, _adlaAccountName);
                    
                    return jobId;
                }

                // Submit a U-SQL job by providing a path to the script
                public static Guid SubmitJobByPath(string scriptPath, string jobName)
                {
                    var script = File.ReadAllText(scriptPath);

                    var jobId = Guid.NewGuid();
                    var properties = new USqlJobProperties(script);
                    var parameters = new JobInformation(jobName, JobType.USql, properties, priority: 1000, degreeOfParallelism: 1);

                    var jobInfo = _adlaJobClient.Job.Create(jobId, parameters, _adlaAccountName);

                    return jobId;
                }

                public static JobResult WaitForJob(Guid jobId)
                {
                    var jobInfo = _adlaJobClient.Job.Get(jobId, _adlaAccountName);
                    while (jobInfo.State != JobState.Ended)
                    {
                        jobInfo = _adlaJobClient.Job.Get(jobId, _adlaAccountName);
                    }
                    return jobInfo.Result.Value;
                }

                // List jobs
                public static List<JobInformation> ListJobs()
                {
                    var response = _adlaJobClient.Job.List(_adlaAccountName);
                    var jobs = new List<JobInformation>(response);

                    while (response.NextPageLink != null)
                    {
                        response = _adlaJobClient.Job.ListNext(response.NextPageLink);
                        jobs.AddRange(response);
                    }

                    return jobs;
                }

                // Upload a file
                public static void UploadFile(string srcFilePath, string destFilePath, bool force = true)
                {
                    var parameters = new UploadParameters(srcFilePath, destFilePath, _adlsAccountName, isOverwrite: force);
                    var frontend = new DataLakeStoreFrontEndAdapter(_adlsAccountName, _adlsFileSystemClient);
                    var uploader = new DataLakeStoreUploader(parameters, frontend);
                    uploader.Execute();
                }

                // Download file
                public static void DownloadFile(string srcPath, string destPath)
                {
                    var stream = _adlsFileSystemClient.FileSystem.Open(srcPath, _adlsAccountName);
                    var fileStream = new FileStream(destPath, FileMode.Create);

                    stream.CopyTo(fileStream);
                    fileStream.Close();
                    stream.Close();
                }
            }
        }

7. Press **F5** to run the application.

## See also

- To see the same tutorial using other tools, click the tab selectors on the top of the page.
- To see a more complexed query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
- To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
- To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md), and [U-SQL language reference](http://go.microsoft.com/fwlink/?LinkId=691348).
- For management tasks, see [Manage Azure Data Lake Analytics using Azure Portal](data-lake-analytics-manage-use-portal.md).
- To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).
