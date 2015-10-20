<properties 
   pageTitle="Get started with Azure Data Lake Analytics using Azure PowerShell | Azure" 
   description="Learn how to use the Azure PowerShell to create a Data Lake Store account, create a Data Lake Analytics job using U-SQL, and submit the job. " 
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
   ms.date="10/19/2015"
   ms.author="jgao"/>

# Tutorial: Get Started with Azure Data Lake Analytics using Azure PowerShell

[jgao: copy this part from the get stared using portal article]

**Prerequisites**

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- **Azure PowerShell**. The Azure PowerShell can be installed using the Microsoft Web Platform installer.  For more information, see [Install and configure Azure PowerShell](powershell-install-configure.md).

	[jgao: until the public preview, use https://github.com/MicrosoftBigData/ProjectKona/blob/master/docs/PowerShell/FirstSteps.md]

##Create Data Lake Analytics account

You must have a Data Lake Analytics account before you can run jobs. To create a Data Lake Analytics account, you must specify the following:

- **Azure Resource Group**: A Data Lake Analytics account must be created within a Azure Resource group. [Azure Resource Manager](resource-group-overview.md) enables you to work with the resources in your application as a group. You can deploy, update or delete all of the resources for your application in a single, coordinated operation.  

	To enumerate the resource groups in your subscription:
    
    	Get-AzureRmResourceGroup
    
	To create a new resource group:

    	New-AzureRmResourceGroup `
			-Name "<Your resource group name>" `
			-Location "<Azure Data Center>" # For example, "East US 2"

- **Data Lake Analytics account name**
- **Location**: one of the Azure data centers that supports Data Lake Analytics.
- **Default Data Lake account**: each Data Lake Analytics account has a default Data Lake account.

	To create a new Data Lake account:

	    New-AzureRmDataLakeStoreAccount `
	        -ResourceGroupName "<Your Azure resource group name>" `
	        -Name "<Your Data Lake account name>" `
	        -Location "<Azure Data Center>"  # For example, "East US 2"

	> [AZURE.NOTE] The Data Lake account name must only contain lowercase letters and numbers.


To create a new Data Lake Analytics account
   
    New-AzureRmDataLakeAnalyticsAccount `
        -ResourceGroupName "<You Azure resource group name>" `
        -Name "<Your Azure Data Lake Analytics account name>" `
        -Location "<Azure Data Center>"  #"East US 2" `
        -DefaultDataLake "<Your Knoa account name>"

> [AZURE.NOTE] The Data Lake Analytics account name must only contain lowercase letters and numbers.


**To create a Data Lake Analytics account**

1. Open PowerShell ISE from your Windows workstation.
2. Run the following script:

		$resourceGroupName = "<ResourceGroupName>"
		$dataLakeStoreName = "<DataLakeAccountName>"
		$dataLakeAnalyticsName = "<DataLakeAnalyticsAccountName>"
		$location = "East US 2"
		
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

##Upload data to Data Lake

In this tutorial, you will process some search logs.  The search log can be stored in either Data Lake store or Azure Blob storage. 

A sample search log has been uploaded to an public Azure Blob container. Use the following PowerShell script to download the file to your workstation, and then upload the file to your default Data Lake Store account.

>[AZURE.NOTE] The Azure Preview portal provides an user interface to upload the sample data files. For instructions, see [Get Started with Azure Data Lake Analytics using Azure Preview Portal](data-lake-analytics-get-started-portal.md#upload-data-to-the-default-data-lake-store-account).

	$adlStore = "<The default Data Lake Store account name"
	
	$localFolder = "C:\Tutorials\Downloads\" # A temp location for the file. 
	$storageAccount = "adltutorials"  # Don't modify this value.
	$container = "adls-sample-data"  #Don't modify this value.

	# Create the temp location	
	New-Item -Path $localFolder -ItemType Directory -Force 

	# Download the sample file from Azure Blob storage
	$context = New-AzureStorageContext -StorageAccountName $storageAccount -Anonymous
	$blobs = Azure\Get-AzureStorageBlob -Container $container -Context $context
	$blobs | Get-AzureStorageBlobContent -Context $context -Destination $localFolder

	# Upload the file to the default Data Lake Store account	
	Import-AzureRmDataLakeStoreItem -AccountName $adlStore -Path $localFolder"SearchLog.tsv" -Destination "/Samples/Data/SearchLog.tsv"

For more information on uploading data to Data Lake, see ....

Data Lake Analytics can also access Azure Blob storage.  For uploading data to Azure Blob storage, see [Using Azure PowerShell with Azure Storage](storage-powershell-guide-full.md).

##Submit Data Lake Analytics jobs

**To create a Data Lake Analytics job script**

- Create a text file with following U-SQL script, and save the text file to your workstation:

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

	This U-SQL script reads the input data file using the Extractors.tsv(), and then creates a csv file using
    theOutputters.csv(). 
    
    Notice the path is a relative path. You can also use absolute path.  For example 
    
        Data Lake://<Data LakeStorageAccountName>.azuredatalake.net/Samples/Data/SearchLog.tsv
        
    You must use absolute path to access the files in the linked Storage accounts.  The syntax for files stored in linked Azure Storage account is:
    
        wasb://<BlobContainerName>@<StorageAccountName>.blob.core.windows.net/Samples/Data/SearchLog.tsv

    >[AZURE.NOTE] Azure Blob container with public blobs or public containers access permissions are not currently supported.    

	The U-SQL extension is .usql.  However, you can use any extension. For example, .txt.
	
	For more about U-SQL, see [U-SQL reference](http://go.microsoft.com/fwlink/?LinkId=690701).
	
**To submit the job**

1. Open PowerShell ISE from your Windows workstation.
2. Run the following script:

		$dataLakeAnalyticsName = "<DataLakeAnalyticsAccountName>"
		$usqlScript = "c:\tutorials\data-lake-analytics\copyFile.usql"
		
		Submit-AzureRmDataLakeAnalyticsJob -Name "convertTSVtoCSV" -AccountName $dataLakeAnalyticsName –ScriptPath $usqlScript 
		                
		While (($t = Get-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticsName -JobId $job.JobId).State -ne "Ended"){
			Write-Host "Job status: "$t.State"..."
			Start-Sleep -seconds 5
		}
		
		Get-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticsName -JobId $job.JobId

	In the script, the U-SQL script file is stored at c:\tutorials\data-lake-analytics\copyFile.usql.  Update the file path accordingly.
 
After the job is completed, you can use the following cmdlets to list the file, and download the file:
	
	$resourceGroupName = "<Resource Group Name>"
	$dataLakeAnalyticName = "<Data Lake Analytic Account Name>"
	$destFile = "C:\tutorials\data-lake-analytics\SearchLog-from-Data-Lake.csv"
	
	$dataLakeStoreName = (Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAnalyticName).Properties.DefaultDataLakeAccount
	
	Get-AzureRmDataLakeStoreChildItem -AccountName $dataLakeStoreName -path "/Output"
	
	Export-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Path "/Output/SearchLog-from-Data-Lake.csv" -Destination $destFile


##See also

- [Azure Data Lake Analytics overview](data-lake-analytics-overview.md)
- [Get started with Azure Data Lake Analytics using Azure Preview Portal](data-lake-analytics-get-started-portal.md)
- [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md)
- [Use Azure Data Lake Analytics interactive tutorials](data-lake-analytics-use-interactive-tutorials.md)
- [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md)
- [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md)
- [Manage Azure Data Lake Analytics using Azure Preview Portal](data-lake-analytics-manage-use-portal.md)

