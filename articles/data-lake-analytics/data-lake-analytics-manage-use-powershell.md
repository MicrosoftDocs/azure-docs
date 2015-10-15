<properties 
   pageTitle="Manage Azure Data Lake Analytics using Azure PowerShell | Azure" 
   description="Learn how to manage Data Lake Analytics jobs, data sources, users. " 
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
   ms.date="10/14/2015"
   ms.author="jgao"/>

# Manage Azure Data Lake Analytics using Azure PowerShell

[I will copy the text from the manage use portal article]
Learn how to manage Azure Data Lake Analytics accounts, data sources, users, and jobs using the Azure PowerShell.

**Prerequisites**

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

This article includes:

- Use ARM
- Manage accounts
- Manage data sources
- Manage users
- Manage jobs
- Monitor account usage
- Manage catalog
	- tables
	- table valued functions
	- assemblies
	
To list the cmdlets:

	Get-Command *Azure*DataLakeAnalytics*

<!-- ################################ -->
<!-- ################################ -->
## Use Azure Resource Manager groups

[jgao: is ADL-Analytics a good usage case of ARM? If no, I can remove this section]

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

###Create accounts**

	$resourceGroupName = "<ResourceGroupName>"
	$dataLakeStoreName = "<DataLakeAccountName>"
	$dataLakeAnalyticsName = "<DataLakeAnalyticsAccountName>"
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
		-Name $dataLakeAnalyticsName `
		-ResourceGroupName $resourceGroupName `
		-Location $location `
		-DefaultDataLake $dataLakeStoreName
	
	Write-Host "The newly created Data Lake Analytics account ..."  -ForegroundColor Green
	Get-AzureRmDataLakeAnalyticsAccount `
		-ResourceGroupName $resourceGroupName `
		-Name $dataLakeAnalyticsName  

###List account

List Data Lake Analytics accounts within the current subscription

	Get-AzureRmDataLakeAnalyticsAccount

List Data Lake Analytics accounts within a specific resource group

	Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName

Get details of a specific Data Lake Analytics account

	Get-AzureRmDataLakeAnalyticsAccount -Name $adlAnalyticsAccountName

Test existence of a specific Data Lake Analytics account

	Test-AzureRmDataLakeAnalyticsAccount -Name $adlAnalyticsAccountName


###Delete Data Lake Analytics accounts

	$resourceGroupName = "<ResourceGroupName>"
	$dataLakeAnalyticsName = "<DataLakeAnalyticsAccountName>"
	
	Remove-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAnalyticsName 

Delete a Analytics account will not delete the dependent Data Lake Storage account. The following example deletes the Data Lake Analytics account and the default Data Lake Store account

	$resourceGroupName = "<ResourceGroupName>"
	$dataLakeAnalyticsName = "<DataLakeAnalyticsAccountName>"
	$dataLakeStoreName = (Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAnalyticName).Properties.DefaultDataLakeAccount

	Remove-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAnalyticName 
	Remove-AzureRmDataLakeStoreAccount -ResourceGroupName $resourceGroupName -Name $dataLakeStoreName

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

	$resourceGroupName = "<ResourceGroupName>"
	$dataLakeAnalyticsName = "<DataLakeAnalyticsAccountName>"
	$dataLakeStoreName = (Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAnalyticName).Properties.DefaultDataLakeAccount


### Add additional Azure Blob storage accounts

	$resourceGroupName = "<ResourceGroupName>"
	$dataLakeAnalyticsName = "<DataLakeAnalyticsAccountName>"
	$AzureStorageAccountName = "<AzureStorageAccountName>"
	$AzureStorageAccountKey = "<AzureStorageAccountKey>"
	
	Add-AzureRmDataLakeAnalyticsDataSource -ResourceGroupName $resourceGroupName -AccountName $dataLakeAnalyticName -AzureBlob $AzureStorageAccountName -AccessKey $AzureStorageAccountKey

### Add additional Data Lake Store accounts

	[jgao: this script is not working]
	$resourceGroupName = "<ResourceGroupName>"
	$dataLakeAnalyticsName = "<DataLakeAnalyticsAccountName>"
	$AzureDataLakeName = "<DataLakeStoreName>"
	
	Add-AzureRmDataLakeAnalyticsDataSource -ResourceGroupName $resourceGroupName -AccountName $dataLakeAnalyticName -DataLake $AzureDataLakeName 

### List data sources:

	$resourceGroupName = "<ResourceGroupName>"
	$dataLakeAnalyticsName = "<DataLakeAnalyticsAccountName>"

	(Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAnalyticName).Properties.DataLakeStoreAccounts
	(Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAnalyticName).Properties.StorageAccounts
	

## Manage users

ADL Analtyics uses role-based access control with Azure active directory. When you create a Data Lake Analytics 
account, a "Subscription admins" is added to the account. You can add additional users and security groups with 
the following roles:

|Role|Description|
|----|-----------|
|Owner|Lets you manage everything, including access to resources.|
|Contributor|Access the portal; submit and monitor jobs. To be able to submit jobs, a contributor also need the read or write permission to the Data Lake storage accounts.|
|Reader|Lets you view everything, but not make any changes.|  
|DevTest Lab User|Lets you view everything, and connect, start, restart, and shutdown virtual machines[jgao: I never seen discussion related to ABA and VM]|  
|User Access Administrator|Lets you manage user acess to Azure resources.|  

For information on creating Azure Active Directory users and security groups, See [What is Azure Active Directory](active-directory-whatis.md).

**To add users or security groups to an Analytics account**

1. Open the Analtyics account that you want to manage. For instructions see [Access Data Lake Analytics accounts](#access-adla-account).
2. Click **Settings**, and then click **Users**. You can also click **Access** on the **Essentials** title bar as shown in the following screenshot:

	![Azure Data Lake Analytics account add users](./media/data-lake-analytics-manage-use-portal/data-lake-analytics-access-button.png)
3. From the **User** blade, click **Add**.
4. Select a role and add a users, and then click **OK**.

**To configure job access**

1. Sign on to the new [Azure portal](https://portal.azure.com/signin/index/?Microsoft_Azure_Kona=true&Microsoft_Azure_DataLake=true&hubsExtension_ItemHideKey=AzureDataLake_BigStorage%2cAzureKona_BigCompute).
2. Click **BROWSE ALL** on the left menu, click **Big Data Services**, and the click the account you want to configure the user roles.
3. Click **Access**.



<!-- ################################ -->
<!-- ################################ -->
## Manage jobs

You must have an Data Lake Analytics account before you can create a job.  For more information, see [Manage Data Lake Analytics accounts](#manage-data-lake-analytics-accounts).

### List jobs

	$dataLakeAnalyticsName = "<DataLakeAnalyticsAccountName>"
	
	Get-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticName
	
	Get-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticName -State Running, Queued
	#States: Accepted, Compiling, Ended, New, Paused, Queued, Running, Scheduling, Starting
	
	Get-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticName -Result Cancelled
	#Results: Cancelled, Failed, None, Successed 
	
	Get-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticName -Name <Job Name>
	Get-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticName -Submitter <Job submitter>

	# List all jobs submitted on January 1 (local time)
	Get-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticName `
		-SubmittedAfter "2015/01/01"
		-SubmittedBefore "2015/01/02"	

	# List all jobs that succeeded on January 1 after 2 pm (UTC time)
	Get-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticName `
		-State Ended
		-Result Succeeded
		-SubmittedAfter "2015/01/01 2:00 PM -0"
		-SubmittedBefore "2015/01/02 -0"

	# List all jobs submitted in the past hour
	Get-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticName `
		-SubmittedAfter (Get-Date).AddHours(-1)

### Get job details

	$dataLakeAnalyticsName = "<DataLakeAnalyticsAccountName>"
	Get-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticName -JobID <Job ID>
	
### Submit jobs

> [AZURE.NOTE] The default priority of a job is 1000, and the default degree of parallelism for a job is 1.


	$dataLakeAnalyticsName = "<DataLakeAnalyticsAccountName>"

	#Pass script via path
	Submit-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticName `
		-Name $jobName `
		-ScriptPath $scriptPath
	
	

	#Pass script contents
	Submit-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticName `
		-Name $jobName `
		-Script $scriptContents

### Cancel jobs

	Stop-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticName `
		-JobID $jobID


## Enumerate catalog



###List catalog items

	#List databases
	Get-AzureRmDataLakeAnalyticsCatalogItem `
		-AccountName $adlAnalyticsAccountName `
		-ItemType Database
	
	
	
	#List tables
	Get-AzureRmDataLakeAnalyticsCatalogItem `
		-AccountName $adlAnalyticsAccountName `
		-ItemType Table `
		-Path "master.dbo"




###Get catalog item details 

	#Get a database
	Get-AzureRmDataLakeAnalyticsCatalogItem `
		-AccountName $adlAnalyticsAccountName `
		-ItemType Database `
		-Path "master"
	
	#Get a table
	Get-AzureRmDataLakeAnalyticsCatalogItem `
		-AccountName $adlAnalyticsAccountName `
		-ItemType Table `
		-Path "master.dbo.mytable"

###Test existence of  catalog item

	Test-AzureRmDataLakeAnalyticsCatalogItem  `
		-AccountName $adlAnalyticsAccountName `
		-ItemType Database `
		-Path "master"

###Create catalog secret
	New-AzureRmDataLakeAnalyticsCatalogSecret  `
			-AccountName $adlAnalyticsAccountName `
			-DatabaseName "master" `
			-Secret (Get-Credential -UserName "username" -Message "Enter the password")



### Modify catalog secret
	Set-AzureRmDataLakeAnalyticsCatalogSecret  `
			-AccountName $adlAnalyticsAccountName `
			-DatabaseName "master" `
			-Secret (Get-Credential -UserName "username" -Message "Enter the password")



###Delete catalog secret
	Remove-AzureRmDataLakeAnalyticsCatalogSecret  `
			-AccountName $adlAnalyticsAccountName `
			-DatabaseName "master"





##See also 

- bla
- bla

## Manage Kona users using PowerShell 

[**jgao:** If this is not needed to go through the tutorial, then we shall separated it into a management topic]
[saveenr - sounds good - talk to mahi about the correct way to do user management]

To add a user to your Kona Account:


	New-KonaUser –UserEmail user1@aadtenant.onmicrosoft.com –UserRole User 


To list the existing Kona users:

	Get-KonaUser 

The following is a sample output:

	CreationTime                LastModifiedTime            Name                        Roles                      
	------------                ----------------            ----                        -----                      
	Mon, 13 Oct 2014 18:42:3... Mon, 13 Oct 2014 18:42:3... KiwiPublicTest@JianywKiw... {Admin}                    
	Tue, 14 Oct 2014 02:24:3... Tue, 14 Oct 2014 02:24:3... konauser2@test              {Admin}                    
	Tue, 14 Oct 2014 02:26:0... Tue, 14 Oct 2014 02:26:0... konauser1@onboardflow.on... {Admin}                    
	Wed, 15 Oct 2014 00:14:1... Wed, 15 Oct 2014 00:14:1... This Obviously Isn't a user {ReadOnly}  
	               

To remove a Kona user account:

	Remove-KonaUser –UserEmail user1@aadtenant.onmicrosoft.com 


