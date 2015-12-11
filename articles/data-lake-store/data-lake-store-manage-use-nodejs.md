<properties 
   pageTitle="Manage Azure Data Lake Stores using Azure SDK for Node.js | Azure" 
   description="Learn how to manage Data Lake Store accounts, and the file system." 
   services="data-lake-store" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-store"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="12/11/2015"
   ms.author="jgao"/>

# Manage Azure Data Lake Store using Azure SDK for Node.js

> [AZURE.SELECTOR]
- [Using Portal](data-lake-store-get-started-portal.md)
- [Using PowerShell](data-lake-store-get-started-powershell.md)
- [Using .NET SDK](data-lake-store-get-started-net-sdk.md)
- [Using Azure CLI](data-lake-store-get-started-cli.md)
- [Using Node.js](data-lake-store-manage-use-nodejs.md)


The Azure ADK for Node.js can be used for managing Azure Data Lake store accounts, and the file system:

- Accoutn management: create, get, list, update and delete.
- File system management: create, get, upload, append, download, read, delete, list.

**Prerequisites**

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
- **An Azure Data Lake Store account**. See [Get started with Azure Data Lake Store using the Azure Portal](data-lake-store-get-started-portal.md) to create an account.
- **A service principal with permissions to access the Data Lake Analytics account**. See [Authenticating a service principal with Azure Resource Manager](resource-group-authenticate-service-principal.md).

## Install the SDK

Use the following steps to install the SDK:

1. Install [Node.js](https://nodejs.org/).
2. Run the following commands from Command Prompt, Terminal or Bash window:

		npm install async
		npm install adal-node
		npm install azure-common
		npm install azure-arm-datalake-store
	
## A Node.js sample

The following example creates a file in a Data Lake Store account and appends data to it.

	var async = require('async');
	var adalNode = require('adal-node');
	var azureCommon = require('azure-common');
	var azureDataLakeStore = require('azure-arm-datalake-store');
	
	var resourceUri = 'https://management.core.windows.net/';
	var loginUri = 'https://login.windows.net/'
	
	var clientId = 'application_id_(guid)';
	var clientSecret = 'application_password';
	
	var tenantId = 'aad_tenant_id';
	var subscriptionId = 'azure_subscription_id';
	var resourceGroup = 'adls_resourcegroup_name';
	
	var accountName = 'adls_account_name';
	
	var context = new adalNode.AuthenticationContext(loginUri+tenantId);
	
	var client;
	var response;
	
	var destinationFilePath = '/newFileName.txt';
	var content = 'desired file contents';
	
	async.series([
		function (next) {
			context.acquireTokenWithClientCredentials(resourceUri, clientId, clientSecret, function(err, result){
				if (err) throw err;
				response = result;
				next();
			});
		},
		function (next) {
			var credentials = new azureCommon.TokenCloudCredentials({
				subscriptionId : subscriptionId,
				authorizationScheme : response.tokenType,
				token : response.accessToken
			});
		
			client = azureDataLakeStore.createDataLakeStoreFileSystemManagementClient(credentials, 'azuredatalakestore.net');
	
			next();
		},
		function (next) {
			client.fileSystem.directCreate(destinationFilePath, accountName, content, function(err, result){
				if (err) throw err;
			});
		}
	]);


##See also 

- [Azure SDK for Node.js](http://azure.github.io/azure-sdk-for-node/)
- [Manage Azure Data Lake Analytics using Node.js](data-lake-analytics-use-nodejs.md)

