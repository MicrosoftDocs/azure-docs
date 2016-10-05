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
   ms.date="10/04/2016"
   ms.author="jgao"/>

# Get started with Azure Data Lake Analytics using REST APIs

[AZURE.INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

Learn how to use WebHDFS REST APIs and Data Lake Analytics REST APIs to manage Data Lake Analytics accounts, jobs, and catalog. 

## Prerequisites

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- **Create an Azure Active Directory Application**. You use the Azure AD application to authenticate the Data Lake Analytics application with Azure AD. There are different approaches to authenticate with Azure AD, which are **end-user authentication** or **service-to-service authentication**. For instructions and more information on how to authenticate, see [Authenticate with Data Lake Analytics using Azure Active Directory](data-lake-store-authenticate-using-active-directory.md).

- [cURL](http://curl.haxx.se/). This article uses cURL to demonstrate how to make REST API calls against a Data Lake Analytics account.

## Authenticate with Azure Active Directory?

See [Authenticate using Azure Active Directory](data-lake-store-get-started-rest-api.md#how-do-i-authenticate-using-azure-active-directory).

## Create a Data Lake Analytics account

You must first create an Azure Resource group, and a Data Lake Store account.  See [Create a Data Lake Store account](data-lake-store-get-started-rest-api.md#create-a-data-lake-store-account).

The following the the Curl command:

	curl -i -X PUT -H "Authorization: Bearer <REDACTED>" -H "Content-Type: application/json" https://management.azure.com/subscriptions/<AzureSubscriptionID>/resourceGroups/<AzureResourceGroupName>/providers/Microsoft.DataLakeAnalytics/accounts/<NewAzureDataLakeAnalyticsAccountName>?api-version=2015-10-01-preview -d@"C:\tutorials\adla\CreateDataLakeAnalyticsAccountRequest.json"

Replace \<`REDACTED`\> with the authorization token, <AzureSubscriptionID> with your subscription ID, <AzureResourceGroupName> with an existing Azure Resource Group name, and <NewAzureDataLakeAnalyticsAccountName> with a new Data Lake Analytics Account name. The request payload for this command is contained in the **CreateDatalakeAnalyicsAccountRequest.json** file that is provided for the `-d` parameter above. The contents of the input.json file resemble the following:

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

The following the the Curl command:

	curl -i -X GET -H "Authorization: Bearer <REDACTED>" https://management.azure.com/subscriptions/<AzureSubscriptionID>/providers/Microsoft.DataLakeAnalytics/Accounts?api-version=2015-10-01-preview

Replace \<`REDACTED`\> with the authorization token, <AzureSubscriptionID> with your subscription ID. The output is simliar to:

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

## Get information about an Data Lake Analytic account

The following is the Curl command:

	curl -i -X GET -H "Authorization: Bearer <REDACTED>" https://management.azure.com/subscriptions/<AzureSubscriptionID>/resourceGroups/<AzureResourceGroupName>/providers/Microsoft.DataLakeAnalytics/accounts/<DataLakeAnalyticsAccountName>?api-version=2015-11-01

Replace \<`REDACTED`\> with the authorization token, <AzureSubscriptionID> with your subscription ID, <AzureResourceGroupName> with an existing Azure Resource Group name, and <DataLakeAnalyticsAccountName> with the name of an existing Data Lake Analytics Account. The output is similar to:

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

The following is the Curl command:

	curl -i -X GET -H "Authorization: Bearer <REDACTED>" https://management.azure.com/subscriptions/<AzureSubscriptionID>/resourceGroups/<AzureResourceGroupName>/providers/Microsoft.DataLakeAnalytics/accounts/<DataLakeAnalyticsAccountName>/DataLakeStoreAccounts/?api-version=2015-10-01-preview

Replace \<`REDACTED`\> with the authorization token, <AzureSubscriptionID> with your subscription ID, <AzureResourceGroupName> with an existing Azure Resource Group name, and <DataLakeAnalyticsAccountName> with the name of an existing Data Lake Analytics Account. The output is similar to:

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

The following is the Curl command:

	curl -i -X PUT -H "Authorization: Bearer <REDACTED>" https://<DataLakeAnalyticsAccountName>.azuredatalakeanalytics.net/Jobs/<NewGUID>?api-version=2016-03-20-preview -d@"C:\tutorials\adla\SubmitADLAJob.json"

Replace \<`REDACTED`\> with the authorization token, <DataLakeAnalyticsAccountName> with the name of an existing Data Lake Analytics Account. The request payload for this command is contained in the **SubmitADLAJob.json** file that is provided for the `-d` parameter above. The contents of the input.json file resemble the following:

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




[jgao: The following call works in PowerShell but failed in Curl]

	curl -i -X Get -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlliUkFRUlljRV9tb3RXVkpLSHJ3TEJiZF85cyIsImtpZCI6IlliUkFRUlljRV9tb3RXVkpLSHJ3TEJiZF85cyJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNDc1NjcyNDAzLCJuYmYiOjE0NzU2NzI0MDMsImV4cCI6MTQ3NTY3NjMwMywiYXBwaWQiOiI1OWRlZmQ0Ny1jZDk5LTQ1ODYtOWVmNC03MDRjMzBmNTY0NjEiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwib2lkIjoiYTI4ODM4M2ItZTQ2MS00OTU4LTg4NjktOThlMjg3NjMyZDU1Iiwic3ViIjoiYTI4ODM4M2ItZTQ2MS00OTU4LTg4NjktOThlMjg3NjMyZDU1IiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidmVyIjoiMS4wIn0.fLdZhyFPBggFRZa5n43dvOGO2BaQ7g32P_PwctesrrqqtO8O36euwrYlS0gZUuCFu_qFjfjxaae4lchiMW236WvfGJZpJyzpvfczMTxQb97CMWcGAbAoeH9CASFfr4vonPb8cS4ntPRV0K4jzDAF6sTAycsUW3cyUBK3kKK47ureUm9rLaX-WHRPrbrXxw67a1EeE1bRG2x5zlUi6aKFeucpSf_dZscBvD3J6IVjc8WVreylNfkw6BRN1MQ1guyJmuqLUm2aEDDxmR_ZkXvQ5IBP_QC12BeBU43G3WYbBAe20YOYvI17xNxMCuGjapQI1Qyh7xpRMAv4C_dSopNa3Q" https://myadla0831.azuredatalakeanalytics.net/Jobs?api-version=2016-03-20-preview

	HTTP/1.1 404 Not Found
	Server: Microsoft-IIS/8.5
	X-Content-Type-Options: nosniff
	Strict-Transport-Security: max-age=15724800; includeSubDomains
	Date: Wed, 05 Oct 2016 13:35:12 GMT
	Connection: close
	Content-Length: 0

## Get catalog items:

[jgao: The following call works in PowerShell but failed in Curl]

	C:\Tutorials\Curl>curl -i -X Get -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IlliUkFRUlljRV9tb3RXVkpLSHJ3TEJiZF85cyIsImtpZCI6IlliUkFRUlljRV9tb3RXVkpLSHJ3TEJiZF85cyJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuY29yZS53aW5kb3dzLm5ldC8iLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNDc1NjcyNDAzLCJuYmYiOjE0NzU2NzI0MDMsImV4cCI6MTQ3NTY3NjMwMywiYXBwaWQiOiI1OWRlZmQ0Ny1jZDk5LTQ1ODYtOWVmNC03MDRjMzBmNTY0NjEiLCJhcHBpZGFjciI6IjEiLCJpZHAiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwib2lkIjoiYTI4ODM4M2ItZTQ2MS00OTU4LTg4NjktOThlMjg3NjMyZDU1Iiwic3ViIjoiYTI4ODM4M2ItZTQ2MS00OTU4LTg4NjktOThlMjg3NjMyZDU1IiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidmVyIjoiMS4wIn0.fLdZhyFPBggFRZa5n43dvOGO2BaQ7g32P_PwctesrrqqtO8O36euwrYlS0gZUuCFu_qFjfjxaae4lchiMW236WvfGJZpJyzpvfczMTxQb97CMWcGAbAoeH9CASFfr4vonPb8cS4ntPRV0K4jzDAF6sTAycsUW3cyUBK3kKK47ureUm9rLaX-WHRPrbrXxw67a1EeE1bRG2x5zlUi6aKFeucpSf_dZscBvD3J6IVjc8WVreylNfkw6BRN1MQ1guyJmuqLUm2aEDDxmR_ZkXvQ5IBP_QC12BeBU43G3WYbBAe20YOYvI17xNxMCuGjapQI1Qyh7xpRMAv4C_dSopNa3Q" https://myadla0831.azuredatalakeanalytics.net/catalog?api-version=2016-03-20-preview
	HTTP/1.1 404 Not Found
	Server: Microsoft-IIS/8.5
	X-Content-Type-Options: nosniff
	Strict-Transport-Security: max-age=15724800; includeSubDomains
	Date: Wed, 05 Oct 2016 14:08:41 GMT
	Connection: close
	Content-Length: 0

## See also

- [Open Source Big Data applications compatible with Azure Data Lake Analytics](data-lake-store-compatible-oss-other-applications.md)
 
