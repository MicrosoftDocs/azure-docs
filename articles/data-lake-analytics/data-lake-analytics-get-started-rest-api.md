<properties 
   pageTitle="Get started with Data Lake Analytics using REST API| Microsoft Azure" 
   description="Use WebHDFS REST APIs to perform operations on Data Lake Analytics" 
   services="data-lake-analytics" 
   documentationCenter="" 
   authors="mumian" 
   manager="jhubbard" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="10/13/2016"
   ms.author="jgao"/>

# Get started with Azure Data Lake Analytics using REST APIs

[AZURE.INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

Learn how to use WebHDFS REST APIs and Data Lake Analytics REST APIs to manage Data Lake Analytics accounts, jobs, and catalog. 

## Prerequisites

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- **Create an Azure Active Directory Application**. You use the Azure AD application to authenticate the Data Lake Analytics application with Azure AD. There are different approaches to authenticate with Azure AD, which are **end-user authentication** or **service-to-service authentication**. For instructions and more information on how to authenticate, see [Authenticate with Data Lake Analytics using Azure Active Directory](../data-lake-store/data-lake-store-authenticate-using-active-directory.md).

- [cURL](http://curl.haxx.se/). This article uses cURL to demonstrate how to make REST API calls against a Data Lake Analytics account.

## Authenticate with Azure Active Directory

See [Authenticate using Azure Active Directory](,./data-lake-store/data-lake-store-get-started-rest-api.md#how-do-i-authenticate-using-azure-active-directory).

## Create a Data Lake Analytics account

You must create an Azure Resource group, and a Data Lake Store account before you can create a Data Lake Analytics account.  See [Create a Data Lake Store account](../data-lake-store/data-lake-store-get-started-rest-api.md#create-a-data-lake-store-account).

The following Curl command shows how to create an account:

	curl -i -X PUT -H "Authorization: Bearer <REDACTED>" -H "Content-Type: application/json" https://management.azure.com/subscriptions/<AzureSubscriptionID>/resourceGroups/<AzureResourceGroupName>/providers/Microsoft.DataLakeAnalytics/accounts/<NewAzureDataLakeAnalyticsAccountName>?api-version=2015-10-01-preview -d@"C:\tutorials\adla\CreateDataLakeAnalyticsAccountRequest.json"

Replace \<`REDACTED`\> with the authorization token, \<`AzureSubscriptionID`\> with your subscription ID, \<`AzureResourceGroupName`\> with an existing Azure Resource Group name, and \<`NewAzureDataLakeAnalyticsAccountName`\> with a new Data Lake Analytics Account name. The request payload for this command is contained in the **CreateDatalakeAnalyticsAccountRequest.json** file that is provided for the `-d` parameter above. The contents of the input.json file resemble the following:

	{  
		"location": "East US 2",  
		"name": "myadla1004",  
		"tags": {},  
		"properties": {  
			"defaultDataLakeStoreAccount": "my1004store",  
			"dataLakeStoreAccounts": [  
				{  
					"name": "my1004store"  
				}     
			]
		}  
	}  


## List Data Lake Analytics accounts in a subscription

The following Curl command shows how to list accounts in a subscription:

	curl -i -X GET -H "Authorization: Bearer <REDACTED>" https://management.azure.com/subscriptions/<AzureSubscriptionID>/providers/Microsoft.DataLakeAnalytics/Accounts?api-version=2015-10-01-preview

Replace \<`REDACTED`\> with the authorization token, \<`AzureSubscriptionID`\> with your subscription ID. The output is similar to:

	{
		"value": [
			{
			"properties": {
				"provisioningState": "Succeeded",
				"state": "Active",
				"endpoint": "myadla0831.azuredatalakeanalytics.net",
				"accountId": "21e74660-0941-4880-ae72-b143c2615ea9",
				"creationTime": "2016-09-01T12:49:12.7451428Z",
				"lastModifiedTime": "2016-09-01T12:49:12.7451428Z"
			},
			"location": "East US 2",
			"tags": {},
			"id": "/subscriptions/65a1016d-0f67-45d2-b838-b8f373d6d52e/resourceGroups/myadla0831rg/providers/Microsoft.DataLakeAnalytics/accounts/myadla0831",
			"name": "myadla0831",
			"type": "Microsoft.DataLakeAnalytics/accounts"
			},
			{
			"properties": {
				"provisioningState": "Succeeded",
				"state": "Active",
				"endpoint": "myadla1004.azuredatalakeanalytics.net",
				"accountId": "3ff9b93b-11c4-43c6-83cc-276292eeb350",
				"creationTime": "2016-10-04T20:46:42.287147Z",
				"lastModifiedTime": "2016-10-04T20:46:42.287147Z"
			},
			"location": "East US 2",
			"tags": {},
			"id": "/subscriptions/65a1016d-0f67-45d2-b838-b8f373d6d52e/resourceGroups/myadla1004rg/providers/Microsoft.DataLakeAnalytics/accounts/myadla1004",
			"name": "myadla1004",
			"type": "Microsoft.DataLakeAnalytics/accounts"
			}
		]
	}

## Get information about a Data Lake Analytics account

The following Curl command shows how to get an account information:

	curl -i -X GET -H "Authorization: Bearer <REDACTED>" https://management.azure.com/subscriptions/<AzureSubscriptionID>/resourceGroups/<AzureResourceGroupName>/providers/Microsoft.DataLakeAnalytics/accounts/<DataLakeAnalyticsAccountName>?api-version=2015-11-01

Replace \<`REDACTED`\> with the authorization token, \<`AzureSubscriptionID`\> with your subscription ID, \<`AzureResourceGroupName`\> with an existing Azure Resource Group name, and \<`DataLakeAnalyticsAccountName`\> with the name of an existing Data Lake Analytics Account. The output is similar to:

	{
		"properties": {
			"defaultDataLakeStoreAccount": "my1004store",
			"dataLakeStoreAccounts": [
			{
				"properties": {
				"suffix": "azuredatalakestore.net"
				},
				"name": "my1004store"
			}
			],
			"provisioningState": "Creating",
			"state": null,
			"endpoint": null,
			"accountId": "3ff9b93b-11c4-43c6-83cc-276292eeb350",
			"creationTime": null,
			"lastModifiedTime": null
		},
		"location": "East US 2",
		"tags": {},
		"id": "/subscriptions/65a1016d-0f67-45d2-b838-b8f373d6d52e/resourceGroups/myadla1004rg/providers/Microsoft.DataLakeAnalytics/accounts/myadla1004",
		"name": "myadla1004",
		"type": "Microsoft.DataLakeAnalytics/accounts"
	}

## List Data Lake Stores of a Data Lake Analytics account

The following Curl command shows how to list Data Lake Stores of an account:

	curl -i -X GET -H "Authorization: Bearer <REDACTED>" https://management.azure.com/subscriptions/<AzureSubscriptionID>/resourceGroups/<AzureResourceGroupName>/providers/Microsoft.DataLakeAnalytics/accounts/<DataLakeAnalyticsAccountName>/DataLakeStoreAccounts/?api-version=2015-10-01-preview

Replace \<`REDACTED`\> with the authorization token, \<`AzureSubscriptionID`\> with your subscription ID, \<`AzureResourceGroupName`\> with an existing Azure Resource Group name, and \<`DataLakeAnalyticsAccountName`\> with the name of an existing Data Lake Analytics Account. The output is similar to:

	{
		"value": [
			{
			"properties": {
				"suffix": "azuredatalakestore.net"
			},
			"id": "/subscriptions/65a1016d-0f67-45d2-b838-b8f373d6d52e/resourceGroups/myadla1004rg/providers/Microsoft.DataLakeAnalytics/accounts/myadla1004/dataLakeStoreAccounts/my1004store",
			"name": "my1004store",
			"type": "Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts"
			}
		]
	}

## Submit U-SQL jobs

The following Curl command shows how to submit a U-SQL job:

	curl -i -X PUT -H "Authorization: Bearer <REDACTED>" https://<DataLakeAnalyticsAccountName>.azuredatalakeanalytics.net/Jobs/<NewGUID>?api-version=2016-03-20-preview -d@"C:\tutorials\adla\SubmitADLAJob.json"

Replace \<`REDACTED`\> with the authorization token, \<`DataLakeAnalyticsAccountName`\> with the name of an existing Data Lake Analytics Account. The request payload for this command is contained in the **SubmitADLAJob.json** file that is provided for the `-d` parameter above. The contents of the input.json file resemble the following:

	{
		"jobId": "8f8ebf8c-4b63-428a-ab46-a03d2cc5b65a",
		"name": "convertTSVtoCSV",
		"type": "USql",
		"degreeOfParallelism": 1,
		"priority": 1000,
		"properties": {
			"type": "USql",
			"script": "@searchlog =\n    EXTRACT UserId          int,\n            Start           DateTime,\n            Region          string,\n            Query          
		string,\n            Duration        int?,\n            Urls            string,\n            ClickedUrls     string\n    FROM \"/Samples/Data/SearchLog.tsv\"\n    US
		ING Extractors.Tsv();\n\nOUTPUT @searchlog   \n    TO \"/Output/SearchLog-from-Data-Lake.csv\"\nUSING Outputters.Csv();"
		}
	}

The output is similar to:

	{
		"jobId": "8f8ebf8c-4b63-428a-ab46-a03d2cc5b65a",
		"name": "convertTSVtoCSV",
		"type": "USql",
		"submitter": "myadl@SPI",
		"degreeOfParallelism": 1,
		"priority": 1000,
		"submitTime": "2016-10-05T13:54:59.9871859+00:00",
		"state": "Compiling",
		"result": "Succeeded",
		"stateAuditRecords": [
			{
			"newState": "New",
			"timeStamp": "2016-10-05T13:54:59.9871859+00:00",
			"details": "userName:myadl@SPI;submitMachine:N/A"
			}
		],
		"properties": {
			"owner": "myadl@SPI",
			"resources": [],
			"runtimeVersion": "default",
			"rootProcessNodeId": "00000000-0000-0000-0000-000000000000",
			"algebraFilePath": "adl://myadls0831.azuredatalakestore.net/system/jobservice/jobs/Usql/2016/10/05/13/54/8f8ebf8c-4b63-428a-ab46-a03d2cc5b65a/algebra.xml",
			"compileMode": "Semantic",
			"errorSource": "Unknown",
			"totalCompilationTime": "PT0S",
			"totalPausedTime": "PT0S",
			"totalQueuedTime": "PT0S",
			"totalRunningTime": "PT0S",
			"type": "USql"
		}
	}


## List U-SQL jobs

The following Curl command shows how to list U-SQL jobs:

	curl -i -X GET -H "Authorization: Bearer <REDACTED>" https://<DataLakeAnalyticsAccountName>.azuredatalakeanalytics.net/Jobs?api-version=2015-10-01-preview 

Replace \<`REDACTED`\> with the authorization token, and \<`DataLakeAnalyticsAccountName`\> with the name of an existing Data Lake Analytics Account. 


The output is similar to:

	{
	"value": [
		{
		"jobId": "65cf1691-9dbe-43cd-90ed-1cafbfb406fb",
		"name": "convertTSVtoCSV",
		"type": "USql",
		"submitter": "someone@microsoft.com",
		"account": null,
		"degreeOfParallelism": 1,
		"priority": 1000,
		"submitTime": "Wed, 05 Oct 2016 13:46:53 GMT",
		"startTime": "Wed, 05 Oct 2016 13:47:33 GMT",
		"endTime": "Wed, 05 Oct 2016 13:48:07 GMT",
		"state": "Ended",
		"result": "Succeeded",
		"errorMessage": null,
		"storageAccounts": null,
		"stateAuditRecords": null,
		"logFilePatterns": null,
		"properties": null
		},
		{
		"jobId": "8f8ebf8c-4b63-428a-ab46-a03d2cc5b65a",
		"name": "convertTSVtoCSV",
		"type": "USql",
		"submitter": "someoneadl@SPI",
		"account": null,
		"degreeOfParallelism": 1,
		"priority": 1000,
		"submitTime": "Wed, 05 Oct 2016 13:54:59 GMT",
		"startTime": "Wed, 05 Oct 2016 13:55:43 GMT",
		"endTime": "Wed, 05 Oct 2016 13:56:11 GMT",
		"state": "Ended",
		"result": "Succeeded",
		"errorMessage": null,
		"storageAccounts": null,
		"stateAuditRecords": null,
		"logFilePatterns": null,
		"properties": null
		}
	],
	"nextLink": null,
	"count": null
	}


## Get catalog items

The following Curl command shows how to get the databases from the catalog:

	curl -i -X GET -H "Authorization: Bearer <REDACTED>" https://<DataLakeAnalyticsAccountName>.azuredatalakeanalytics.net/catalog/usql/databases?api-version=2015-10-01-preview

The output is similar to:

{
  "@odata.context":"https://myadla0831.azuredatalakeanalytics.net/sqlip/$metadata#databases","value":[
    {
      "computeAccountName":"myadla0831","databaseName":"mytest","version":"f6956327-90b8-4648-ad8b-de3ff09274ea"
    },{
      "computeAccountName":"myadla0831","databaseName":"master","version":"e8bca908-cc73-41a3-9564-e9bcfaa21f4e"
    }
  ]
}

## See also

- To see a more complex query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
- To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
- To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
- For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
- To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).
- To see the same tutorial using other tools, click the tab selectors on the top of the page.
- To log diagnostics information, see [Accessing diagnostics logs for Azure Data Lake Analytics](data-lake-analytics-diagnostic-logs.md)
