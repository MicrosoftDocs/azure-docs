---
title: Manage Azure Data Lake Analytics using Azure .NET SDK | Microsoft Docs
description: 'Learn how to manage Data Lake Analytics jobs, data sources, users. '
services: data-lake-analytics
documentationcenter: ''
author: saveenr
manager: saveenr
editor: cgronlun

ms.assetid: 811d172d-9873-4ce9-a6d5-c1a26b374c79
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 03/3/2017
ms.author: jgao

---
# Manage Azure Data Lake Analytics using Azure .NET SDK
[!INCLUDE [manage-selector](../../includes/data-lake-analytics-selector-manage.md)]

Learn how to manage Azure Data Lake Analytics accounts, data sources, users, and jobs using the Azure .NET SDK. To see management topics using other tools, click the tab select above.

## Prerequisites

* **Visual Studio 2015, Visual Studio 2013 update 4, or Visual Studio 2012 with Visual C++ Installed**.
* **Microsoft Azure SDK for .NET version 2.5 or above**.  Install it using the [Web platform installer](http://www.microsoft.com/web/downloads/platform.aspx).
* **Required NuGet Packages**

### Install NuGet packages
   
Install the following NuGet packages:

* **Microsoft.Rest.ClientRuntime.Azure.Authentication** - This tutorial uses V2.2.12
* **Microsoft.Azure.Management.DataLake.Analytics** - This tutorial uses V2.1.0 preview
* **Microsoft.Azure.Management.DataLake.Store** - This tutorial uses V2.1.0 preview

## Common variables

```
string subId = "<Subscription ID>";
string tenantId = "<Tenant ID>"; // Replace this string with the user's Azure Active Directory tenant ID.
string rg == "<value>"; // resource  group name
string clientId = "1950a258-227b-4e31-a9cf-717495945fc2"; // Sample client ID for interactive auth
string webApp_clientId = "<AAD-application-clientid>"; // client ID for non-interactive auth

```

## Authenticate and connect to Azure Data Lake Analytics
You have multiple options for logging on to Azure Data Lake Analytics.

### Interactive with provided credentials
The following snippet shows the easiest authentication by the user providing credentials, such as a username and password or a pin number.

```
// User login via interactive popup
// Use the client ID of an existing AAD "native nlient" application.
SynchronizationContext.SetSynchronizationContext(new SynchronizationContext());
var uri = new Uri("urn:ietf:wg:oauth:2.0:oob");
var activeDirectoryClientSettings = 
    ActiveDirectoryClientSettings.UsePromptOnly(nativeClientApp_clientId, uri );
var creds = UserTokenProvider.LoginWithPromptAsync( tenantId, activeDirectoryClientSettings).Result;
```
We recommend creating your own application and service principal within your Azure Active Directory tenant, then using the client ID for that application, rather than the sample ID used here.

### Non-interactive with a client secret
You can use the following snippet to authenticate your application non-interactively, using the client secret / key for an application / service principal. Use this authentication option with an existing [Azure AD "Web App" Application](../azure-resource-manager/resource-group-create-service-principal-portal.md).

```
// Service principal / application authentication with client secret / key
// Use the client ID and certificate of an existing AAD "Web App" application.
SynchronizationContext.SetSynchronizationContext(new SynchronizationContext());
var webApp_clientId = "<AAD-application-clientid>";
var clientSecret = "<AAD-application-client-secret>";
var clientCredential = new ClientCredential(webApp_clientId, clientSecret);
var creds = ApplicationTokenProvider.LoginSilentAsync(tenantId, clientCredential).Result;
```

### Non-interactive with a service principal
As a third option, the following snippet can be used to authenticate your application non-interactively, using the certificate for an application / service principal. Use this authentication option with an existing [Azure AD "Web App" Application](../azure-resource-manager/resource-group-create-service-principal-portal.md).

```
// Service principal / application authentication with certificate
// Use the client ID and certificate of an existing AAD "Web App" application.
SynchronizationContext.SetSynchronizationContext(new SynchronizationContext());
System.Security.Cryptography.X509Certificates.X509Certificate2 clientCert = <AAD-application-client-certificate>
var clientAssertionCertificate = new ClientAssertionCertificate(webApp_clientId, clientCert);
var creds = ApplicationTokenProvider.LoginSilentWithCertificateAsync(tenantId, clientAssertionCertificate).Result;
```

## Create the client management objects

```
var adlsClient = new DataLakeStoreAccountManagementClient(creds);
adlsClient.SubscriptionId = subId;

var adlaClient = new DataLakeAnalyticsAccountManagementClient(creds);
adlaClient.SubscriptionId = subId;

var adlsFileSystemClient = new DataLakeStoreFileSystemManagementClient(creds);
var adlaCatalogClient = new DataLakeAnalyticsCatalogManagementClient(creds);
var adlaJobClient = new DataLakeAnalyticsJobManagementClient(creds);
```

### Create an Azure Resource Group

If you haven't already created one, you must have an Azure Resource Group to create your Data Lake Analytics components. You will need your authentication credentials, subscription ID, and a location. The following code shows how to create a resource group:

```
 var resourceManagementClient = new ResourceManagementClient(credential) { SubscriptionId = subscriptionId };
 var resourceGroup = new ResourceGroup { Location = location };
 resourceManagementClient.ResourceGroups.CreateOrUpdate(groupName, rgName);
```
For more information, see [Azure Resource Groups and Data Lake Analytics](#Azure-Resource-Groups-and-Data-Lake-Analytics).

### Create a Data Lake Store account
The following code shows how to create a Data Lake Store account. Before you use the Create method, you must define its parameters by specifying a location.

```
var adlsParameters = new DataLakeStoreAccount(location: _location);
adlsClient.Account.Create(_resourceGroupName, _adlsAccountName, adlsParameters);
```

### Create a Data Lake Analytics account
The following code shows how to create a Data Lake Analytics account, using the asynchronous method. The CreateAsync method takes a collection of Data Lake Store accounts as one of its parameters. This collection must be populated with instances of DataLakeStoreAccountInfo objects. In this example, these DataLakeStoreAccountInfo objects are obtained from a helper method (AdlaFromAdlsStoreAccounts).

For any Data Lake Analytics account, you only need to include the Data Lake Store accounts that you need to perform the needed analytics. One of these Data Lake Store accounts, must be the default Data Lake Store account.

```
var adlaAccount = new DataLakeAnalyticsAccount()
{
   DefaultDataLakeStoreAccount = adls,
   Location = location,
   DataLakeStoreAccounts = new DataLakeStoreAccountInfo[]{
       new DataLakeStoreAccountInfo(“Expenditures”),
       new DataLakeStoreAccountInfo(“Accounting”)
   }
};

adlaClient.Account.Create(_resourceGroupName, newAccountName, adlaAccount);
```

## Manage accounts

### List Data Lake Store and Data Lake Analytics accounts
The following code lists the Data Lake Store accounts in a subscription. List operations do not always provide all the properties of an object and that in some cases you need to do a Get operation on the object.

```
var adlsAccounts = adlsClient.Account.List().ToList();
foreach (var adls in adlsAccounts)
{
   Console.WriteLine($"\t{adls.Name});
}

var adlaAccounts = adlaClient.Account.List().ToList();
for (var adla in AdlaAccounts)
{
   Console.WriteLine($"\t{adla.Name}");
}
```

### Get an account
The following code uses a DataLakeAnalyticsAccountManagementClient to get a Data Lake Analytics account. First a check is made to see if the account exists.

```
DataLakeAnalyticsAccount adlaGet;
if (adlaClient.Account.Exists(_resourceGroupName, accountName))
{
   adlaGet = adlaClient.Account.Get(_resourceGroupName, accountName);
   Console.WriteLine($"{adlaGet.Name}\tCreated: {adlaGet.CreationTime}");
}
```

Similarly, you can use DataLakeStoreAccountManagementClient (adlsClient) in the same way to get a Data Lake Store account.

### Delete an account
The following code deletes a Data Lake Analytics account if it exists.

```
if (adlaClient.Account.Exists(_resourceGroupName, accountName))
{
   adlaClient.Account.Delete(_resourceGroupName, accountName);
   Console.WriteLine($"{accountName} Deleted");
}
```

You can also delete a Data Lake Store account in the same way with a DataLakeStoreAccountManagementClient.

### Get the default Data Lake Store account
Every Data Lake Analytics account requires a default Data Lake Store account. Use this code to determine the default Store account for an Analytics account.

```
if (adlaClient.Account.Exists(_resourceGroupName, adla))
{
  var adlaGet = adlaClient.Account.Get(_resourceGroupName, adla);
  Console.WriteLine($"{adlaGet.Name} default DL store account: {adlaGet.DefaultDataLakeStoreAccount}");
}
```

## Manage data sources
Data Lake Analytics currently supports the following data sources:

* [Azure Data Lake Store](../data-lake-store/data-lake-store-overview.md)
* [Azure Storage Account](../storage/storage-introduction.md)

When you create an Analytics account, you must designate an Azure Data Lake Store account to be the default
Data Lake Store account. The default Data Lake Store account is used to store job metadata and job audit logs. After you have
created an Analytics account, you can add additional Data Lake Store and links to Azure Storage (blobs) accounts.

### Link to an Azure Storage account from a Data Lake Analytics account
You can create links to Azure Storage accounts.

```
var addParams = new AddStorageAccountParameters(<storage key value>);            
adlaClient.StorageAccounts.Add(rg, adla, "<Azure Storage Account Name>", addParams);
```

### List Data Lake Store data sources
The following code lists the Data Lake Store accounts and the Azure Storage accounts used for a specified Data Lake Analytics account.

```
var stg_accounts = adlaClient.StorageAccounts.ListByAccount(rg, adla);

if (stg_accounts != null)
{
  Console.WriteLine("Azure Storage accounts:");
  foreach (var stg_account in stg_accounts)
  {
      Console.WriteLine($"\t{stg_account.Name}");
  }
}

var adls_accounts = adlsClient.Account.List();
if (adls_accounts != null)
{
  foreach (var s in adls_accounts)
  {
      Console.WriteLine($"\t{s.Name}");
  }
}
```

### Upload and download folders and files
You can use the Data Lake Store file system client management object to upload and download individual files or folders from Azure to your local computer, using the following methods:

- UploadFolder
- UploadFile
- DownloadFolder
- DownloadFile

The first parameter for these methods is the name of the Data Lake Store Account, followed by parameters for the source path and the destination path.

The following example shows how to download a folder in the Data Lake Store.


```
adlsFileSystemClient.FileSystem.DownloadFolder(adls, sourcePath, destinationPath);
```


### Create a file in a Data Lake Store account
You can use .NET Framework IO operations to create content for a file in a Data Lake Store. The following code writes the first four values of 100 random byte arrays to .csv file.

```
using (var azMem = new MemoryStream())
{
   using (var sw = new StreamWriter(azMem, UTF8Encoding.UTF8))
   {

      for (int i = 0; i < 100; i++)
      {
        byte[] gA = Guid.NewGuid().ToByteArray();
        string dataLine = string.Format($"{gA[0].ToString()},{gA[1].ToString()},{gA[2].ToString()},{gA[3].ToString()},{gA[4].ToString()}");
        sw.WriteLine(dataLine);
      }
      sw.Flush();
      azMem.Position = 0;

      adlsFileSystemClient.FileSystem.Create(adlsAccoutName, "/Samples/Output/randombytes.csv", azMem);
   }
}
```

### Verify Azure Storage account paths
The following code checks if an Azure Storage account (storageAccntName) exists in a Data Lake Analytics account (analyticsAccountName), and if a container (containerName) exists in the Azure Storage account.

```
bool accountExists = adlaClient.Account.StorageAccountExists(_resourceGroupName, analyticsAccountName, storageAccntName));
bool containerExists = adlaClient.Account.StorageContainerExists(_resourceGroupName, analyticsAccountName, storageAccntName, containerName));
```

## Manage catalog and jobs
The DataLakeAnalyticsCatalogManagementClient object provides methods for managing the SQL database provided for each Azure Data Lake Store. The DataLakeAnalyticsJobManagementClient provides methods to submit and manage jobs run on the database with U-SQL scripts.

### List databases and schemas
Among the several things, you can list, the most common are databases and their schema. The following code obtains a collection of databases, and then enumerates the schema for each database.

```
var databases = adlaCatalogClient.Catalog.ListDatabases(adlaAccountName);
foreach (var db in databases)
{
  Console.WriteLine($"Database: {db.Name}");
  Console.WriteLine(" - Schemas:");
  var schemas = adlaCatalogClient.Catalog.ListSchemas(dlaAccountName, db.Name);
  foreach (var schm in schemas)
  {
      Console.WriteLine($"\t{schm.Name}");
  }
}
```

### List table columns
The following code shows how to access the database with a Data Lake Analytics Catalog management client to list the columns in a specified table.

```
var tbl = adlaCatalogClient.Catalog.GetTable(_adlaAnalyticsAccountTest, "master", "dbo", "MyTableName");
IEnumerable<USqlTableColumn> columns = tbl.ColumnList;

foreach (USqlTableColumn utc in columns)
{
  string scriptPath = "/Samples/Scripts/SearchResults_Wikipedia_Script.txt";
  Stream scriptStrm = adlsFileSystemClient.FileSystem.Open(_adlsAccountName, scriptPath);
  string scriptTxt = string.Empty;
  using (StreamReader sr = new StreamReader(scriptStrm))
  {
      scriptTxt = sr.ReadToEnd();
  }

  var jobName = "SR_Wikipedia";
  var jobId = Guid.NewGuid();
  var properties = new USqlJobProperties(scriptTxt);
  var parameters = new JobInformation(jobName, JobType.USql, properties, priority: 1, degreeOfParallelism: 1, jobId: jobId);
  var jobInfo = adlaJobClient.Job.Create(_adlaAnalyticsAccountTest, jobId, parameters);
  Console.WriteLine($"Job {jobName} submitted.");

}
```

### List failed jobs
The following code lists information about jobs that failed.

```
var odq = new ODataQuery<JobInformation> { Filter = "result eq 'Failed'" };
var jobs = adlaJobClient.Job.List(adlaClient, odq );
foreach (var j in jobs)
{
   Console.WriteLine($"{j.Name}\t{j.JobId}\t{j.Type}\t{j.StartTime}\t{j.EndTime}");
}
```

## Next steps
* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md)
* [Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure portal](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md)
