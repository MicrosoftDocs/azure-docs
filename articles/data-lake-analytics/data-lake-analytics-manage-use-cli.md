<properties 
   pageTitle="Manage Azure Data Lake Analytics using Azure Command-line Interface | Azure" 
   description="Learn how to manage Data Lake Analytics accounts, data sources, jobs and users using Azure CLI" 
   services="data-lake-analytics" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>
 
<tags
   ms.service="data-lake-analytics"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="10/21/2015"
   ms.author="jgao"/>

# Manage Azure Data Lake Analytics using Azure Command-line Interface (CLI)

[AZURE.INCLUDE [manage-selector](../../includes/data-lake-analytics-selector-manage.md)]

Learn how to manage Azure Data Lake Analytics accounts, data sources, users, and jobs using the Azure. To see management topic using other tools, click the tab select above.

>[AZURE.IMPORTANT] The UE team hasn't been able to successfully install CLI.  Matthew Hicks and Ben Goldsmith are investigating.


**Prerequisites**

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial]https://azure.microsoft.com/en-us/pricing/free-trial/).
- **Azure CLI**. See [Install and configure Azure CLI](xplat-cli.md).
- **Authentication**, using the following command:

		azure login
	For more information on authenticating using a work or school account, see [Connect to an Azure subscription from the Azure CLI](xplat-cli-connect.md).
- **Switch to the Azure Resource Manager mode**, using the following command:

		azure config mode arm


**To list the Data Lake Store and Data Lake Analytics commands:**

	azure datalake store
	azure datalake analytics

<!-- ################################ -->
<!-- ################################ -->
## Use Azure Resource Manager groups

[jgao: is ADL-Analytics a good usage case of ARM? If no, I will remove this section]

Applications are typically made up of many components, for example a web app, database, database server, storage,
and 3rd party services. Azure Resource Manager (ARM) enables you to work with the resources in your application 
as a group, referred to as an Azure Resource Group. You can deploy, update, monitor or delete all of the 
resources for your application in a single, coordinated operation. You use a template for deployment and that 
template can work for different environments such as testing, staging and production. You can clarify billing 
for your organization by viewing the rolled-up costs for the entire group. For more information, see [Azure 
Resource Manager Overview](resource-group-overview.md). 

An Data Lake Analtyics service can include the following components:

- Azure Data Lake Analytics account
- Required default Azure Data Lake Storage account
- Additional Azure Data Lake Storage accounts
- Additional Azure Storage accounts

You can create all these components under one ARM group to make them easier to manage.

![Azure Data Lake Analytics account and storage](./media/data-lake-analytics-manage-use-portal/data-lake-analytics-arm-structure.png)

An Data Lake Analytics account and the dependent storage accounts must be placed in the same Azure data center.
The ARM group however can be located in a different data center.  


<!-- ################################ -->
<!-- ################################ -->
## Manage accounts

Before running any Data Lake Analytics jobs, you must have a Data Lake Analytics account. Unlike Azure Data Lake
Managed cluster (Previously known as Azure HDInsight), you don't pay for an Analytics account when it is not 
running a job.  You only pay for the time when it is running a job.  For more informaiton, see 
[Azure Data Lake Analytics Overview](data-lake-analytics-overview.md).  

###Create accounts

  	azure datalake analytics account create [options] <dataLakeAnalyticsAccountName> <location> <resourceGroup> <defaultDataLake>
  	azure datalake analytics account set [options] <dataLakeAnalyticsAccountName>

	[jgao: add ARM template here]	  


###List account

List Data Lake Analytics accounts 

	azure datalake analytics account list

List Data Lake Analytics accounts within a specific resource group

	azure datalake analytics account list -g <Azure Resource Group Name>

Get details of a specific Data Lake Analytics account

	azure datalake analytics account show -g <Azure Resource Group Name> -n <Data Lake Analytics Account Name>



###Delete Data Lake Analytics accounts

  	azure datalake analytics account delete [options] <dataLakeAnalyticsAccountName>


Delete a Analytics account will not delete the dependent Data Lake Storage account. The following example deletes the Data Lake Analytics account and the default Data Lake Store account

	azure datalake analytics account delete [options] <dataLakeAnalyticsAccountName>
	azure datalake store account delete [options] <dataLakeStoreAccountName>

<!-- ################################ -->
<!-- ################################ -->
## Manage account data sources

Data Lake Analytics currently supports the following data sources:

- [Azure Data Lake Storage](data-lake-storage-overview.md)
- [Azure Storage](storage-introduction.md)

When you create an Analytics account, you must designate an Azure Data Lake Storage account to be the default 
storage account. The default ADL storage account is used to store job metadata and job audit logs. After you have 
created an Analytics account, you can add additional Data Lake Storage accounts and/or Azure Storage account. 

### Find the default ADL storage account

	[jgao: need work]
	
	azure datalake analytics account show [options] <dataLakeAnalyticsAccountName>


### Add additional Azure Blob storage accounts

  	azure datalake analytics account adddatasource [options] <dataLakeAnalyticsAccountName>
  	azure datalake analytics account setdatasource [options] <dataLakeAnalyticsAccountName>

### Add additional Data Lake Store accounts

  	azure datalake analytics account adddatasource [options] <dataLakeAnalyticsAccountName>
  	azure datalake analytics account setdatasource [options] <dataLakeAnalyticsAccountName>

### List data sources:

	azure datalake analytics account show [options] <dataLakeAnalyticsAccountName>
	
### delete data sources:

  	azure datalake analytics account removedatasource [options] <dataLakeAnalyticsAccountName>

## Manage users

[jgao: missing information]

<!-- ################################ -->
<!-- ################################ -->
## Manage jobs

You must have an Data Lake Analytics account before you can create a job.  For more information, see [Manage Data Lake Analytics accounts](#manage-data-lake-analytics-accounts).

### List jobs

  	azure datalake analytics job list [options] <dataLakeAnalyticsAccountName>


### Get job details

  	azure datalake analytics job get [options] <dataLakeAnalyticsAccountName> <jobId>
	
### Submit jobs

> [AZURE.NOTE] The default priority of a job is 1000, and the default degree of parallelism for a job is 1.

	azure datalake analytics job create [options] <dataLakeAnalyticsAccountName> <jobName> <script>

### Cancel jobs

  	azure datalake analytics job cancel [options] <dataLakeAnalyticsAccountName> <jobId>

## Manage catalog




###List catalog items

	#List databases
	azure datalake analytics catalog list [options] <dataLakeAnalyticsAccountName> <catalogItemType> <catalogItemPath>

	#List tables
	azure datalake analytics catalog list [options] <dataLakeAnalyticsAccountName> <catalogItemType> <catalogItemPath>

###Get catalog item details 

	#Get a database
	azure datalake analytics catalog list [options] <dataLakeAnalyticsAccountName> <catalogItemType> <catalogItemPath>
	
	#Get a table
	azure datalake analytics catalog list [options] <dataLakeAnalyticsAccountName> <catalogItemType> <catalogItemPath>

###Create catalog secret

	azure datalake analytics catalog createsecret [options] <dataLakeAnalyticsAccountName> <databaseName> <hostUri> <secretName>

### Modify catalog secret

  	azure datalake analytics catalog setsecret [options] <dataLakeAnalyticsAccountName> <databaseName> <hostUri> <secretName>


###Delete catalog secret

	azure datalake analytics catalog deletesecret [options] <dataLakeAnalyticsAccountName> <databaseName> <hostUri> <secretName>

##See also 

- [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
- [Get started with Data Lake Analytics using Azure Preview Portal](data-lake-analytics-get-started-portal.md)
- [Manage Azure Data Lake Analytics using Azure Preview portal](data-lake-analytics-use-portal.md)
- [Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure Preview Portal](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md)

