<properties 
   pageTitle="Manage Azure Data Lake Analytics using Azure PowerShell | Azure" 
   description="Learn how to manage Data Lake Analytics jobs, data sources, users. " 
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
   ms.date="05/16/2016"
   ms.author="edmaca"/>

# Manage Azure Data Lake Analytics using Azure PowerShell

[AZURE.INCLUDE [manage-selector](../../includes/data-lake-analytics-selector-manage.md)]

Learn how to manage Azure Data Lake Analytics accounts, data sources, users, and jobs using the Azure PowerShell. To see management topics using other tools, click the tab select above.

**Prerequisites**

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).


<!-- ################################ -->
<!-- ################################ -->


##Install Azure PowerShell 1.0 or greater

See the Prerequisite section of [Using Azure PowerShell with Azure Resource Manager](powershell-azure-resource-manager.md#prerequisites).
	
## Manage accounts

Before running any Data Lake Analytics jobs, you must have a Data Lake Analytics account. Unlike Azure HDInsight, you don't pay for an Analytics account when it is not 
running a job.  You only pay for the time when it is running a job.  For more information, see 
[Azure Data Lake Analytics Overview](data-lake-analytics-overview.md).  

###Create accounts

	$resourceGroupName = "<ResourceGroupName>"
	$dataLakeStoreName = "<DataLakeAccountName>"
	$dataLakeAnalyticsAccountName = "<DataLakeAnalyticsAccountName>"
	$location = "<Microsoft Data Center>"
	
	Write-Host "Create a resource group ..." -ForegroundColor Green
	New-AzureRmResourceGroup `
		-Name  $resourceGroupName `
		-Location $location
	
	Write-Host "Create a Data Lake account ..."  -ForegroundColor Green
	New-AzureRmDataLakeStoreAccount `
		-ResourceGroupName $resourceGroupName `
		-Name $dataLakeStoreName `
		-Location $location 
	
	Write-Host "Create a Data Lake Analytics account ..."  -ForegroundColor Green
	New-AzureRmDataLakeAnalyticsAccount `
		-Name $dataLakeAnalyticsAccountName `
		-ResourceGroupName $resourceGroupName `
		-Location $location `
		-DefaultDataLake $dataLakeStoreName
	
	Write-Host "The newly created Data Lake Analytics account ..."  -ForegroundColor Green
	Get-AzureRmDataLakeAnalyticsAccount `
		-ResourceGroupName $resourceGroupName `
		-Name $dataLakeAnalyticsAccountName  

You can also use an Azure Resource Group template. A template for creating a Data Lake Analytics account and the dependent Data Lake Store account is in [Appendix A](#appendix-a). Save the template into a file with .json template, and then use the following PowerShell script to call it:


	$AzureSubscriptionID = "<Your Azure Subscription ID>"
	
	$ResourceGroupName = "<New Azure Resource Group Name>"
	$Location = "EAST US 2"
	$DefaultDataLakeStoreAccountName = "<New Data Lake Store Account Name>"
	$DataLakeAnalyticsAccountName = "<New Data Lake Analytics Account Name>"
	
	$DeploymentName = "MyDataLakeAnalyticsDeployment"
	$ARMTemplateFile = "E:\Tutorials\ADL\ARMTemplate\azuredeploy.json"  # update the Json template path 
	
	Login-AzureRmAccount
	
	Select-AzureRmSubscription -SubscriptionId $AzureSubscriptionID
	
	# Create the resource group
	New-AzureRmResourceGroup -Name $ResourceGroupName -Location $Location
	
	# Create the Data Lake Analytics account with the default Data Lake Store account.
	$parameters = @{"adlAnalyticsName"=$DataLakeAnalyticsAccountName; "adlStoreName"=$DefaultDataLakeStoreAccountName}
	New-AzureRmResourceGroupDeployment -Name $DeploymentName -ResourceGroupName $ResourceGroupName -TemplateFile $ARMTemplateFile -TemplateParameterObject $parameters 

 
###List account

List Data Lake Analytics accounts within the current subscription

	Get-AzureRmDataLakeAnalyticsAccount
	
The output:

	Id         : /subscriptions/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/resourceGroups/learn1021rg/providers/Microsoft.DataLakeAnalytics/accounts/learn1021adla
	Location   : eastus2
	Name       : learn1021adla
	Properties : Microsoft.Azure.Management.DataLake.Analytics.Models.DataLakeAnalyticsAccountProperties
	Tags       : {}
	Type       : Microsoft.DataLakeAnalytics/accounts

List Data Lake Analytics accounts within a specific resource group

	Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName

Get details of a specific Data Lake Analytics account

	Get-AzureRmDataLakeAnalyticsAccount -Name $adlAnalyticsAccountName

Test existence of a specific Data Lake Analytics account

	Test-AzureRmDataLakeAnalyticsAccount -Name $adlAnalyticsAccountName

The cmdlet will return either **True** or **False**.

###Delete Data Lake Analytics accounts

	$resourceGroupName = "<ResourceGroupName>"
	$dataLakeAnalyticsAccountName = "<DataLakeAnalyticsAccountName>"
	
	Remove-AzureRmDataLakeAnalyticsAccount -Name $dataLakeAnalyticsAccountName 

Delete Data Lake Analytics account will not delete the dependent Data Lake Storage account. The following example deletes the Data Lake Analytics account and the default Data Lake Store account

	$resourceGroupName = "<ResourceGroupName>"
	$dataLakeAnalyticsAccountName = "<DataLakeAnalyticsAccountName>"
	$dataLakeStoreName = (Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAnalyticAccountName).Properties.DefaultDataLakeAccount

	Remove-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAnalyticAccountName 
	Remove-AzureRmDataLakeStoreAccount -ResourceGroupName $resourceGroupName -Name $dataLakeStoreName

<!-- ################################ -->
<!-- ################################ -->
## Manage account data sources

Data Lake Analytics currently supports the following data sources:

- [Azure Data Lake Storage](data-lake-storage-overview.md)
- [Azure Storage](storage-introduction.md)

When you create an Analytics account, you must designate an Azure Data Lake Storage account to be the default 
storage account. The default Data Lake Store account is used to store job metadata and job audit logs. After you have 
created an Analytics account, you can add additional Data Lake Storage accounts and/or Azure Storage account. 

### Find the default Data Lake Store account

	$resourceGroupName = "<ResourceGroupName>"
	$dataLakeAnalyticsAccountName = "<DataLakeAnalyticsAccountName>"
	$dataLakeStoreName = (Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAnalyticAccountName).Properties.DefaultDataLakeAccount


### Add additional Azure Blob storage accounts

	$resourceGroupName = "<ResourceGroupName>"
	$dataLakeAnalyticsAccountName = "<DataLakeAnalyticsAccountName>"
	$AzureStorageAccountName = "<AzureStorageAccountName>"
	$AzureStorageAccountKey = "<AzureStorageAccountKey>"
	
	Add-AzureRmDataLakeAnalyticsDataSource -ResourceGroupName $resourceGroupName -Account $dataLakeAnalyticAccountName -AzureBlob $AzureStorageAccountName -AccessKey $AzureStorageAccountKey

### Add additional Data Lake Store accounts

	$resourceGroupName = "<ResourceGroupName>"
	$dataLakeAnalyticsAccountName = "<DataLakeAnalyticsAccountName>"
	$AzureDataLakeName = "<DataLakeStoreName>"
	
	Add-AzureRmDataLakeAnalyticsDataSource -ResourceGroupName $resourceGroupName -Account $dataLakeAnalyticAccountName -DataLake $AzureDataLakeName 

### List data sources:

	$resourceGroupName = "<ResourceGroupName>"
	$dataLakeAnalyticsAccountName = "<DataLakeAnalyticsAccountName>"

	(Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAnalyticAccountName).Properties.DataLakeStoreAccounts
	(Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAnalyticAccountName).Properties.StorageAccounts
	


<!-- ################################ -->
<!-- ################################ -->
## Manage jobs

You must have a Data Lake Analytics account before you can create a job.  For more information, see [Manage Data Lake Analytics accounts](#manage-data-lake-analytics-accounts).

### List jobs

	$dataLakeAnalyticsAccountName = "<DataLakeAnalyticsAccountName>"
	
	Get-AzureRmDataLakeAnalyticsJob -Account $dataLakeAnalyticAccountName
	
	Get-AzureRmDataLakeAnalyticsJob -Account $dataLakeAnalyticAccountName -State Running, Queued
	#States: Accepted, Compiling, Ended, New, Paused, Queued, Running, Scheduling, Starting
	
	Get-AzureRmDataLakeAnalyticsJob -Account $dataLakeAnalyticAccountName -Result Cancelled
	#Results: Cancelled, Failed, None, Successed 
	
	Get-AzureRmDataLakeAnalyticsJob -Account $dataLakeAnalyticAccountName -Name <Job Name>
	Get-AzureRmDataLakeAnalyticsJob -Account $dataLakeAnalyticAccountName -Submitter <Job submitter>

	# List all jobs submitted on January 1 (local time)
	Get-AzureRmDataLakeAnalyticsJob -Account $dataLakeAnalyticAccountName `
		-SubmittedAfter "2015/01/01"
		-SubmittedBefore "2015/01/02"	

	# List all jobs that succeeded on January 1 after 2 pm (UTC time)
	Get-AzureRmDataLakeAnalyticsJob -Account $dataLakeAnalyticAccountName `
		-State Ended
		-Result Succeeded
		-SubmittedAfter "2015/01/01 2:00 PM -0"
		-SubmittedBefore "2015/01/02 -0"

	# List all jobs submitted in the past hour
	Get-AzureRmDataLakeAnalyticsJob -Account $dataLakeAnalyticAccountName `
		-SubmittedAfter (Get-Date).AddHours(-1)

### Get job details

	$dataLakeAnalyticsAccountName = "<DataLakeAnalyticsAccountName>"
	Get-AzureRmDataLakeAnalyticsJob -Account $dataLakeAnalyticAccountName -JobID <Job ID>
	
### Submit jobs

	$dataLakeAnalyticsAccountName = "<DataLakeAnalyticsAccountName>"

	#Pass script via path
	Submit-AzureRmDataLakeAnalyticsJob -Account $dataLakeAnalyticAccountName `
		-Name $jobName `
		-ScriptPath $scriptPath

	#Pass script contents
	Submit-AzureRmDataLakeAnalyticsJob -Account $dataLakeAnalyticAccountName `
		-Name $jobName `
		-Script $scriptContents

> [AZURE.NOTE] The default priority of a job is 1000, and the default degree of parallelism for a job is 1.


### Cancel jobs

	Stop-AzureRmDataLakeAnalyticsJob -Account $dataLakeAnalyticAccountName `
		-JobID $jobID


## Manage catalog items

The U-SQL catalog is used to structure data and code so they can be shared by U-SQL scripts. The catalog enables the highest performance possible with data in Azure Data Lake. For more information, see [Use U-SQL catalog](data-lake-analytics-use-u-sql-catalog.md).

###List catalog items

	#List databases
	Get-AzureRmDataLakeAnalyticsCatalogItem `
		-Account $adlAnalyticsAccountName `
		-ItemType Database
	
	
	
	#List tables
	Get-AzureRmDataLakeAnalyticsCatalogItem `
		-Account $adlAnalyticsAccountName `
		-ItemType Table `
		-Path "master.dbo"

###Get catalog item details 

	#Get a database
	Get-AzureRmDataLakeAnalyticsCatalogItem `
		-Account $adlAnalyticsAccountName `
		-ItemType Database `
		-Path "master"
	
	#Get a table
	Get-AzureRmDataLakeAnalyticsCatalogItem `
		-Account $adlAnalyticsAccountName `
		-ItemType Table `
		-Path "master.dbo.mytable"

###Test existence of  catalog item

	Test-AzureRmDataLakeAnalyticsCatalogItem  `
		-Account $adlAnalyticsAccountName `
		-ItemType Database `
		-Path "master"

###Create catalog secret
	New-AzureRmDataLakeAnalyticsCatalogSecret  `
			-Account $adlAnalyticsAccountName `
			-DatabaseName "master" `
			-Secret (Get-Credential -UserName "username" -Message "Enter the password")

### Modify catalog secret
	Set-AzureRmDataLakeAnalyticsCatalogSecret  `
			-Account $adlAnalyticsAccountName `
			-DatabaseName "master" `
			-Secret (Get-Credential -UserName "username" -Message "Enter the password")



###Delete catalog secret
	Remove-AzureRmDataLakeAnalyticsCatalogSecret  `
			-Account $adlAnalyticsAccountName `
			-DatabaseName "master"


## Use Azure Resource Manager groups

Applications are typically made up of many components, for example a web app, database, database server, storage,
and 3rd party services. Azure Resource Manager (ARM) enables you to work with the resources in your application 
as a group, referred to as an Azure Resource Group. You can deploy, update, monitor or delete all of the 
resources for your application in a single, coordinated operation. You use a template for deployment and that 
template can work for different environments such as testing, staging and production. You can clarify billing 
for your organization by viewing the rolled-up costs for the entire group. For more information, see [Azure 
Resource Manager Overview](../resource-group-overview.md). 

A Data Lake Analytics service can include the following components:

- Azure Data Lake Analytics account
- Required default Azure Data Lake Storage account
- Additional Azure Data Lake Storage accounts
- Additional Azure Storage accounts

You can create all these components under one ARM group to make them easier to manage.

![Azure Data Lake Analytics account and storage](./media/data-lake-analytics-manage-use-portal/data-lake-analytics-arm-structure.png)

A Data Lake Analytics account and the dependent storage accounts must be placed in the same Azure data center.
The ARM group however can be located in a different data center.  

##See also 

- [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
- [Get started with Data Lake Analytics using Azure Portal](data-lake-analytics-get-started-portal.md)
- [Manage Azure Data Lake Analytics using Azure Portal](data-lake-analytics-manage-use-portal.md)
- [Monitor and troubleshoot Azure Data Lake Analytics jobs using Azure Portal](data-lake-analytics-monitor-and-troubleshoot-jobs-tutorial.md)

##Appendix A - Data Lake Analytics ARM template

The following ARM template can be used to deploy a Data Lake Analytics account and its dependent Data Lake Store account.  Save it as a json file, and then use PowerShell script to call the template. For more information, see
[Deploy an application with Azure Resource Manager template](../resource-group-template-deploy.md#deploy-with-powershell) and [Authoring Azure Resource Manager templates](../resource-group-authoring-templates.md).

	{
	  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	  "contentVersion": "1.0.0.0",
	  "parameters": {
	    "adlAnalyticsName": {
	      "type": "string",
	      "metadata": {
	        "description": "The name of the Data Lake Analytics account to create."
	      }
	    },
	    "adlStoreName": {
	      "type": "string",
	      "metadata": {
	        "description": "The name of the Data Lake Store account to create."
	      }
	    }
	  },
	  "resources": [
	    {
	      "name": "[parameters('adlStoreName')]",
	      "type": "Microsoft.DataLakeStore/accounts",
	      "location": "East US 2",
	      "apiVersion": "2015-10-01-preview",
	      "dependsOn": [ ],
	      "tags": { }
	    },
	    {
	      "name": "[parameters('adlAnalyticsName')]",
	      "type": "Microsoft.DataLakeAnalytics/accounts",
	      "location": "East US 2",
	      "apiVersion": "2015-10-01-preview",
	      "dependsOn": [ "[concat('Microsoft.DataLakeStore/accounts/',parameters('adlStoreName'))]" ],
	      "tags": { },
	      "properties": {
	        "defaultDataLakeStoreAccount": "[parameters('adlStoreName')]",
	        "dataLakeStoreAccounts": [
	          { "name": "[parameters('adlStoreName')]" }
	        ]
	      }
	    }
	  ],
	  "outputs": {
	    "adlAnalyticsAccount": {
	      "type": "object",
	      "value": "[reference(resourceId('Microsoft.DataLakeAnalytics/accounts',parameters('adlAnalyticsName')))]"
	    },
	    "adlStoreAccount": {
	      "type": "object",
	      "value": "[reference(resourceId('Microsoft.DataLakeStore/accounts',parameters('adlStoreName')))]"
	    }
	  }
	}

