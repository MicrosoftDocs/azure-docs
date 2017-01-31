---
title: Manage Azure Data Lake Analytics using Azure .NET SDK | Microsoft Docs
description: 'Learn how to manage Data Lake Analytics jobs, data sources, users. '
services: data-lake-analytics
documentationcenter: ''
author: mumian
manager: jhubbard
editor: cgronlun

ms.assetid: 811d172d-9873-4ce9-a6d5-c1a26b374c79
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 01/30/2017
ms.author: jgao

---
# Manage Azure Data Lake Analytics using Azure .NET SDK
[!INCLUDE [manage-selector](../../includes/data-lake-analytics-selector-manage.md)]

Learn how to manage Azure Data Lake Analytics accounts, data sources, users, and jobs using the Azure .NET SDK. To see management topics using other tools, click the tab select above.

**Prerequisites**

Before you begin this tutorial, you must have the following:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

### Create an Azure Resource Group
If you haven't already created one, you must have an Azure Resource Group to create your Data Lake Analytics components. The following code shows how to create a resource group:

    public static async Task<ResourceGroup> CreateResourceGroupAsync(
        ServiceClientCredentials credential,
        string groupName,
        string subscriptionId,
        string location)
    {

        Console.WriteLine("Creating the resource group...");
        var resourceManagementClient = new ResourceManagementClient(credential)
        { SubscriptionId = subscriptionId };
        var resourceGroup = new ResourceGroup { Location = location };
        return await resourceManagementClient.ResourceGroups.CreateOrUpdateAsync(groupName, resourceGroup);
    }

See [Azure Resource Groups and Data Lake Analytics](## Azure Resource Groups and Data Lake Analytics) for more information.


## Connect to Azure Data Lake
You will need the following Nuget packages:

    Install-Package Microsoft.Rest.ClientRuntime.Azure.Authentication -Pre
    Install-Package Microsoft.Azure.Common
    Install-Package Microsoft.Azure.Common.Dependencies
    Install-Package Microsoft.Azure.Management.ResourceManager -Pre
    Install-Package Microsoft.Azure.Management.DataLake.Analytics -Pre
    Install-Package Microsoft.Azure.Management.DataLake.Store -Pre
    Install-Package Microsoft.Azure.Management.DataLake.StoreUploader -Pre
    Install-Package Microsoft.WindowsAzure.Common
    Install-Package Microsoft.WindowsAzure.Common.Dependencies


The following code sample Main method how to connect to Azure and initialize a Data Lake client management object for an Analytics account, and a Store account.

    using System;
    using System.Collections.Generic;
    using System.Threading;

    using Microsoft.Rest;
    using Microsoft.Rest.Azure.Authentication;
    using Microsoft.Azure.Management.ResourceManager;
    using Microsoft.Azure.Management.DataLake.Analytics;
    using Microsoft.Azure.Management.DataLake.Analytics.Models;
    using Microsoft.Azure.Management.DataLake.Store;
    using Microsoft.Azure.Management.DataLake.Store.Models;
    using Microsoft.Azure.Management.DataLake.StoreUploader;

    namespace ConsoleAcplication1
    {
        class Program
        {

            private const string _SubID = "<Specify your Azure subscription ID>"; 
            private const string _ClientID = "1950a258-227b-4e31-a9cf-717495945fc2"; // a reservied ID availble for develoeprs

            // Replace 'common' with user's Azure Active Directory tenant ID or domain name, if needed.
            private const string _Domain = "common"; // Replace this string with the 

            // Data Lake client management objects
            private static DataLakeAnalyticsAccountManagementClient _adlaClient;
            private static DataLakeStoreAccountManagementClient _adlsClient;
            private static DataLakeAnalyticsAccountManagementClient _adlaClient;
            private static DataLakeStoreFileSystemManagementClient _adlsFileSystemClient;
            private static DataLakeAnalyticsCatalogManagementClient _adlaCatalogClient;
            private static DataLakeAnalyticsJobManagementClient _adlaJobsClient;

            private static void Main(string[] args)
            {

                var creds = AuthenticateAzure(_Domain, _ClientID);

                // Initialize Data Lake management client objects, using
                // your credentials (creds). Initialize others as needed.
                _adlsClient = new DataLakeStoreAccountManagementClient(creds);
                _adlsClient.SubscriptionId = _SubID;
                
                _adlaClient = new DataLakeAnalyticsAccountManagementClient(creds);
                _adlaClient.SubscriptionId = _SubID; 


                // Methods to create and manage Data Lake accounts and resources
                . . .

            }

            // Interactive logon
            public static ServiceClientCredentials AuthenticateAzure(string domainName, string nativeClientAppCLIENTID)
            {
                // User login via interactive popup
                SynchronizationContext.SetSynchronizationContext(new SynchronizationContext());

                // Use the client ID of an existing AAD "Native Client" application.
                var activeDirectoryClientSettings = ActiveDirectoryClientSettings.UsePromptOnly(nativeClientAppCLIENTID, new Uri("urn:ietf:wg:oauth:2.0:oob"));
                
                return UserTokenProvider.LoginWithPromptAsync(domainName, activeDirectoryClientSettings).Result;
            }
        }
    }

## Data Lake client management objects
The Azure Data Lake Analytics SDK includes sets of client management object from which you will do most of your programming. These types are in the Mirosoft.Azure.Management.DataLake.Analytics and in the Management.DataLake.Store namespaces.

To create an instance of these objects, you must provide your credentials as shown in the connection example at the beginning of this article.

Data Lake Store management client objects:
* DataLakeStoreAccountManagementClient - Use to create and manage Data Lake stores.
* DataLakeFileSystemAccountManagementClient - Use to create folders and files, upload files, list files, acess ACL's and credentials, and add references to Azure Storage blobs.
Data Lake Analytics management client objects

* DataLakeAnaylyticsAccountManagementClient - Use to create and manage Data Lake analytic accounts.
* DataLakeAnalyticsCatalogManagementClient - Use to configure SQL databases, including listing schema
* DataLakeAnalyticsJobManagementClient - Use to create and manage U-SQL jobs.

The following table lists the variables for these objects that are used in code examples this article.

| Client Management Object                  | Code Variable         |
| ----------------------------------------- | --------------------- |
| DataLakeStoreAccountManagementClient      | _adlsClient           |
| DataLakeAnalyticsAccountManagementClient  | _adlaClient           |
| DataLakeStoreFileSystemManagementClient   | _adlsFileSystemClient |
| DataLakeAnalyticsCatalogManagementClient  | _adlaCatalogClient    |
| DataLakeAnalyticsJobManagementClient      | _adlaJobsClient       |

## Create accounts
Before running any Data Lake Analytics jobs, you must have a Data Lake Analytics account. Unlike Azure HDInsight, you don't pay for an Analytics account when it is not 
running a job.  You only pay for the time when it is running a job.  For more information, see 
[Azure Data Lake Analytics Overview](data-lake-analytics-overview.md).

In addition, each Data Lake Analytics account requires at least one Data Lake Store account.
  
### Create a Data Lake Store account
The following code shows how to create a Data Lake store account. 

    var adlsParameters = new DataLakeStoreAccount(location: _location);
    _adlsClient.Account.Create(_resourceGroupName, _adlsAccountName, adlsParameters);

### Create a Data Lake Analytics account
The following code shows how to create a Data Lake analytics account. 

Note that the DataLakeAnalytics constructor takes a collection of Data Lake store accounts (using the dlaInfos variable in this example), that must be populated with instances of DataLakeStoreAccountInfo objects. In this example, these DataLakeStoreAccountInfo objects are obtained from a helper method (AdlaFromAdlsStoreAccounts). In addition, not all Data Lake store accounts in a subscription should necessarilly be in a single Data Lake analytics account, so this code checks names against an approved list.

        // create analytics account
        public void CreateAnalyticsAccount(string acctname)
        {
            List<DataLakeStoreAccount> adlsAccounts = ListADLSAccounts();

            IEnumerable<DataLakeStoreAccountInfo> dlaInfos = AdlaFromAdlsStoreAccounts();

            var dlInfo = new DataLakeAnalyticsAccount()
            {
                DefaultDataLakeStoreAccount = _adlsAccountName,
                Location = _location,
                DataLakeStoreAccounts = dlaInfos.ToList<DataLakeStoreAccountInfo>()
            };

            _adlaClient.Account.Create(_resourceGroupName, acctname, dlInfo);
        }

        // A helper method to collect Data Lake Store account information to create an  
        // an analytics account, and also validates accounts before including.
        public IEnumerable<DataLakeStoreAccountInfo> AdlaFromAdlsStoreAccounts()
        {
            List<DataLakeStoreAccount> accountsfromAdls = ListADLSAccounts();

            // Verify that data store account should be added to the analytics account
            List<DataLakeStoreAccount> approvedAccounts = new List<DataLakeStoreAccount>();

            foreach (DataLakeStoreAccount dlsa in accountsfromAdls)
            {
                // The IsApprovedDataStore method (not shown) 
                // returns true for an approved data store name.
                if (IsApprovedDataStore(dlsa.Name))
                {
                    approvedAccounts.Add(dlsa);
                }
            }

            return approvedAccounts.Select(element => new DataLakeStoreAccountInfo(element.Name));
        }

## Manage accounts

### List Data Lake Store accounts
The following code lists the Data Lake store accounts within a subscription.
            
        // List Data Lake storage accounts within the subscription.

        var adlsAccounts = ListADLSAccounts();        
        Console.WriteLine($"You have {adlsAccounts.Count} Data Lake store account(s).");
        for (int i = 0; i < adlaAccounts.Count; i ++)
        {
            Console.WriteLine(adlaAccounts[i].Name);
        }
        . . .
        public static List<DataLakeStoreAccount> ListADLSAccounts()
        {
            var response = _adlsClient.Account.List();
            var accounts = new List<DataLakeStoreAccount>(response);

            while (response.NextPageLink != null)
            {
                response = _adlsClient.Account.ListNext(response.NextPageLink);
                accounts.AddRange(response);
            }

            return accounts;
        }
        
### List Data Lake Analytics accounts  
The following code lists the Data Lake analytics accounts within a subscription.
 
        // List Data Lake Analytic accounts within the subscription.

        var adlaAccounts = ListADLAAccounts();
        Console.WriteLine($"You have {adlaAccounts.Count} Data Lake analytics account(s).");
        for (int i = 0; i < adlaAccounts.Count; i ++)
        {
            Console.WriteLine(adlaAccounts[i].Name);
        }
                
        // List Data Lake analytics accounts within a subscription
        public static List<DataLakeAnalyticsAccount> ListADLAAccounts()
        {
            var response = _adlaClient.Account.List();
            var accounts = new List<DataLakeAnalyticsAccount>(response);

            while (response.NextPageLink != null)
            {
                response = _adlaClient.Account.ListNext(response.NextPageLink);
                accounts.AddRange(response);
            }

            return accounts;
        }
        
### Find a Data Lake Analytics account
After you get an object of a list of Data Lake Analytics accounts, you can use the following to find an account:

    // Get a list of Data Lake Analytic accounts
    var adlaAccounts = ListADLAAccounts();

    Predicate<DataLakeAnalyticsAccount> accountFinder = (DataLakeAnalyticsAccount a) => { return a.Name == adlaAccountName; };
    var myAdlaAccount = adlaAccounts.Find(accountFinder);

Similarly, you can use find a Data Lake Store account in the same manner.

### Delete Data Lake Analytics account
The following code snippet deletes a Data Lake analytics account:

    _adlaClient.Account.Delete(resourceGroupName, adlaAccountName);

Similarly, you can use delete a Data Lake Store account with the DataLakeStoreAccountManagementClient object (_adlsClient in examples).


## Manage account data sources
Data Lake Analytics currently supports the following data sources:

* [Azure Data Lake Storage](../data-lake-store/data-lake-store-overview.md)
* [Azure Storage](../storage/storage-introduction.md)

When you create an Analytics account, you must designate an Azure Data Lake Storage account to be the default 
storage account. The default Data Lake Store account is used to store job metadata and job audit logs. After you have 
created an Analytics account, you can add additional Data Lake Storage accounts and/or Azure Storage account. 

### Include Azure Storage in Data Lake
You can create references to Azure Storae blogs to use in a Data Lake analytivs account. 

    string storageKey = "<paste the key value here>";

    AddStorageAccountParameters addParams = new AddStorageAccountParameters(storageKey);            
    _adlaClient.StorageAccounts.Add(_resourceGroupName, _adlaAccountName, "<Azure Storage Account Name>", addParams);

### List Data Lake data sources
The following code lists the Data Lake Store accounts and the Data Lake Storage accouts (for Azure Storage) for a specified Data Lake Analytics account.

    var sAccnts = _adlaClient.StorageAccounts.ListByAccount(_resourceGroupName, acctName);

    if (sAccnts != null)
    {
        Console.WriteLine("Storage accounts:");
        foreach (var a in sAccnts)
        {
            Console.WriteLine($"\t{a.Name}");
        }
    }

    var stores = _adlsClient.Account.List();
    if (stores != null)
    {
        Console.WriteLine("\nData stores:");
        foreach (var s in stores)
        {
            Console.WriteLine($"\t{s.Name}");
        }
    }

### Upload a file to a Data Lake Store account
The following code shows how to upload a local file into a Data Lake Store account.

    bool force = true;
    string adlsAccnt = "Accounting";
    string srcFilePath = @"c:\DataLakeTemp\localData.csv";
    string dstFilePath = "/library/2016data.csv";
    var parameters = new UploadParameters(srcFilePath, dstFilePath, adlsAccnt, isOverwrite: force);
    var frontend = new DataLakeStoreFrontEndAdapter(adlsAccnt, _adlsFileSystemClient);
    var uploader = new DataLakeStoreUploader(parameters, frontend);
    uploader.Execute();

### Create a file in a Data Lake Store Account
In addition to oploading files, you can easily programmatically create files in your Data Lake Store account for analyis. The following code writes the first four byte values of 100 random byte arrays to .csv file.

        MemoryStream azMem = new MemoryStream();
        StreamWriter sw = new StreamWriter(azMem, UTF8Encoding.UTF8);

        for (int i = 0; i < 100; i++)
        {
            byte[] gA = Guid.NewGuid().ToByteArray();
            string dataLine = string.Format($"{gA[0].ToString()},{gA[1].ToString()},{gA[2].ToString()},{gA[3].ToString()},{gA[4].ToString()}");
            sw.WriteLine(dataLine);
        }
        sw.Flush();
        azMem.Position = 0;

        _adlsFileSystemClient.FileSystem.Create(adlsAccoutName, "/Samples/Output/randombytes.csv", azMem);

        sw.Dispose();
        azMem.Dispose();

### Copy files from a Data Lake Store account
The following code demonstrates file system operations using a DataLakeFileSystemAccountManagementClient object. It copies the spreadsheet (.csv) files from the Samples/Data/AmbulanceData directory to a local directory on your computer.

    // This method takes the name of a Data Lake Store account,
    // and the the path to a directory in the account. In this

    public void CopyCSVFiles(string accnt, string fPath)
    {
        try
        {
            if (_adlsFileSystemClient.FileSystem.PathExists(accnt,fPath))
            {
                var fStatus = _adlsFileSystemClient.FileSystem.ListFileStatus(accnt, fPath);
                foreach (var fs in fStatus.FileStatuses.FileStatus)
                {
                    string localF = string.Empty;
                    if (fs.Type == Microsoft.Azure.Management.DataLake.Store.Models.FileType.FILE &&
                        fs.PathSuffix.Contains("csv"))
                    {
                        Stream fStream = _adlsFileSystemClient.FileSystem.Open(accnt, fPath + "/" + fs.PathSuffix);
                        localF = @"c:\DataLakeTemp\" + fs.PathSuffix;
                        FileStream localStream = new FileStream(localF, FileMode.Create);
                        fStream.CopyTo(localStream);

                    }
                    Console.WriteLine($"Copied {localF}.");
                }
            }
            else
            {
                Console.WriteLine($"File path {fPath} does not exist.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
        }
    }

### List Azure Storage containers
The following code lists the containers for a specived Azure storage account.
    string DLAName = "<specify Data Lake Analytics account name>";
    string azStorageName = "<specify Azure Storage account name>";
    var containers = _adlaClient.StorageAccounts.ListStorageContainers(_resourceGroupName, DLAName, azStorageName);
    foreach (var c in containers)
    {
       Console.WriteLine(c.Name);
    }

### Verify Azure Storage account paths
The following code checks if an Azure Storage account (storageAccntName) exists in a Data Lake Analytics account (analyticsAccountName), and if a container (containerName) exists in the Azure Storage account. 

    bool accountExists = _adlaClient.Account.StorageAccountExists(_resourceGroupName, analyticsAccountName, storageAccntName));
    bool containerExists = _adlaClient.Account.StorageContainerExists(_resourceGroupName, analyticsAccountName, storageAccntName, containerName));

## Manage catalog and jobs
The DataLakeAnalyticsCatalogManagementClient object provides method for managing the SQL database provided for each Azure Data Lake Store. The DataLakeAnalyticsJobManagementClient provides methods to submit and manage jobs run on the database with U-SQL scriptps.

### List table columns
The following code shows how to access the database with a Data Lake Analytics Catalog managemet client to list the columns in a specified table.

    var tbl = _adlaCatalogClient.Catalog.GetTable(_adlaAnalyticsAccountTest, "master", "dbo", "MyTableName");
    IEnumerable<USqlTableColumn> columns = tbl.ColumnList;

    foreach (USqlTableColumn utc in columns)
    {
        Console.WrieLine(utc.Name);
    }

### Submit a job using a query stored in Data Lake
There are multiple ways you can provide a script, a string variable, for a job. The following code shows how to read a U-SQL script from a file stored on a Data Lake Store account, and then submit a job using that script.

    try
    {
        string scriptPath = "/Samples/Scripts/SearchResults_Wikipedia_Script.txt";
        Stream scriptStrm = _adlsFileSystemClient.FileSystem.Open(_adlsAccountName, scriptPath);
        string scriptTxt = string.Empty;
        using (StreamReader sr = new StreamReader(scriptStrm))
        {
            scriptTxt = sr.ReadToEnd();
        }

        var jobName = "SR_Wikipedia";
        var jobId = Guid.NewGuid();
        var properties = new USqlJobProperties(scriptTxt);
        var parameters = new JobInformation(jobName, JobType.USql, properties, priority: 1, degreeOfParallelism: 1, jobId: jobId);
        var jobInfo = _adlaJobsClient.Job.Create(_adlaAnalyticsAccountTest, jobId, parameters);
        Console.WriteLine($"Job {jobName} submitted.");

    }
    catch (Exception ex)
    {
        MessageBox.Show(ex.Message, "DataPurr", MessageBoxButton.OK, MessageBoxImage.Error);
    }


### List failed jobs
The following code lists information about jobs that failed.

    var jobs = _adlaJobsClient.Job.List(_adlaAnalyticsAccountName);

    foreach (var j in jobs)
    {
        if (j.Result == JobResult.Failed)
        {
            Console.WriteLine($"{j.Name}\t{j.JobId}\t{j.Type}\t{j.StartTime}\t{j.EndTime}");
        }
    }
### Reference Azure Storage in U-SQL Scripts
The following is the beginning of a U-SQL script. This script specifies to read the data from a file on a Data Lake Store account: "/Samples/Data/SearchLog.tsv"

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

To read data from a blob on a linked Azure Storage account, you must use the full URL to the blob in the following format:

    wasb://<BlobContainerName>@<StorageAccountName>.blob.core.windows.net/<path to source>

For example, if a source file (SearchLog.tsv) is stored in a blob container named "samples" in the "contso_33" sorage account, the path for the FROM statement would be:

    FROM: "wasb://samples@constoso_33.blob.core.windows.net/SearchLog.tsv"

## Azure Resource Groups and Data Lake Analytics
Applications are typically made up of many components, for example a web app, database, database server, storage,
and 3rd party services. Azure Resource Manager enables you to work with the resources in your application 
as a group, referred to as an Azure Resource Group. You can deploy, update, monitor or delete all of the 
resources for your application in a single, coordinated operation. You use a template for deployment and that 
template can work for different environments such as testing, staging and production. You can clarify billing 
for your organization by viewing the rolled-up costs for the entire group. For more information, see [Azure 
Resource Manager Overview](../azure-resource-manager/resource-group-overview.md). 

A Data Lake Analytics service can include the following components:

* Azure Data Lake Analytics account
* Required default Azure Data Lake Storage account
* One or more Azure Data Lake Analytics accounts
* One or more Azure Data Lake Store accounts, at least one is required
* AdditionalLinked Azure Data Lake Storage accounts
* Additional Azure Storage accounts

You can create all these components under one Resource Management group to make them easier to manage.

![Azure Data Lake Analytics account and storage](./media/data-lake-analytics-manage-use-portal/data-lake-analytics-arm-structure.png)

A Data Lake Analytics account and the dependent storage accounts must be placed in the same Azure data center.
The Resource Management group however can be located in a different data center.  

## See also
* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Get started with Data Lake Analytics using Azure portal](data-lake-analytics-get-started-portal.md)
* [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md)
* [Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure portal](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md)
