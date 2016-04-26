<properties
   pageTitle="Manage Azure Data Lake Analytics using Azure SDK for Node.js | Azure"
   description="Learn how to manage Data Lake Analytics accounts, data sources, jobs and users using Azure SDK for Node.js"
   services="data-lake-analytics"
   documentationCenter=""
   authors="edmacauley"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="data-lake-analytics"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="04/26/2016"
   ms.author="edmaca"/>

# Manage Azure Data Lake Analytics using Azure SDK for Node.js


[AZURE.INCLUDE [manage-selector](../../includes/data-lake-analytics-selector-manage.md)]

The Azure ADK for Node.js can be used for managing Azure Data Lake Analytics accounts, jobs and catalogs. To see management topic using other tools, click the tab select above.

**Prerequisites**

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
- **An Azure Data Lake Analytics account**. See [get started with Azure Data Lake Analytics using Azure Portal](data-lake-analytics-get-started-portal.md) to create an account.
- **A service principal with permissions to access the Data Lake Analytics account**. See [Authenticating a service principal with Azure Resource Manager](../resource-group-authenticate-service-principal.md).

## Install the SDK

Use the following steps to install the SDK:

1. Install [Node.js](https://nodejs.org/).
2. Run the following commands from Command Prompt, Terminal or Bash window:

		npm install async
		npm install adal-node
		npm install azure-common
		npm install azure-arm-datalake-analytics

## A Node.js sample

The following example gets the job list for a given Azure Data Lake Analytics account.

	var async = require('async');
	var adalNode = require('adal-node');
	var azureCommon = require('azure-common');
	var azureDataLakeAnalytics = require('azure-arm-datalake-analytics');

	var resourceUri = 'https://management.core.windows.net/';
	var loginUri = 'https://login.windows.net/'

	var clientId = 'application_id_(guid)';
	var clientSecret = 'application_password';

	var tenantId = 'aad_tenant_id';
	var subscriptionId = 'azure_subscription_id';
	var resourceGroup = 'adla_resourcegroup_name';

	var accountName = 'adla_account_name';

	var context = new adalNode.AuthenticationContext(loginUri+tenantId);

	var client;
	var response;

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

			client = azureDataLakeAnalytics.createDataLakeAnalyticsJobManagementClient(credentials, 'azuredatalakeanalytics.net');

			next();
		},
		function (next) {
			client.jobs.list(resourceGroup, accountName, function(err, result){
				if (err) throw err;
				console.log(result);
			});
		}
	]);


##See also

- [Azure SDK for Node.js](http://azure.github.io/azure-sdk-for-node/)
- [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
- [Get started with Data Lake Analytics using Azure Portal](data-lake-analytics-get-started-portal.md)
- [Manage Azure Data Lake Analytics using Azure Portal](data-lake-analytics-manage-use-portal.md)
- [Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure Portal](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md)
