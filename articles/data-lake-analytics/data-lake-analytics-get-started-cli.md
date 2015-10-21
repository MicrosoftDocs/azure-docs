<properties 
   pageTitle="Get started with Azure Data Lake Analytics using Azure Command-line Interface | Azure" 
   description="Learn how to use the Azure Command-line Interface to create a Data Lake Store account, create a Data Lake Analytics job using U-SQL, and submit the job. " 
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

# Tutorial: Get Started with Azure Data Lake Analytics using Azure Command-line Interface (CLI)

[AZURE.INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

[AZURE.IMPORTANT] List and create data lake account failed.  Working with Matthew and Ben Goldsmith.

Learn how to use Azure CLI to create an Azure Data Lake Analytics account, define a Data Lake Analytics
job in [U-SQL](data-lake-analytics-u-sql-get-started.md), and submit the job. This job reads a tab separated values (TSV) file and convert it into a comma 
separated values (CSV) file. For more information about Data Lake Analytics, see 
[Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

To go through the same tutorial using other supported tools, click the tabs on the top of this section.

**Basic Data Lake Analytics process:**

![Azure Data Lake Analytics process flow diagram](./media/data-lake-analytics-get-started-portal/data-lake-analytics-process.png)

1. Create a Data Lake Analytics account.
2. Prepare/upload the source data.
3. Develop a U-SQL script.
4. Submit a job (U-SQL script) to the Data Lake Analytics account. The job reads the data from Data Lake Store accounts and/or Azure Blob 
storage accounts, process the data as instructed in the U-SQL script, and save the output to a Data Lake Store 
account or an Azure Blob storage account.

**Prerequisites**

Before you begin this tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial]https://azure.microsoft.com/en-us/pricing/free-trial/).
- **Azure CLI**. See [Install and configure Azure CLI](xplat-cli.md).
- **Authentication**, using the following command:

		azure login
	For more information on authenticating using a work or school account, see [Connect to an Azure subscription from the Azure CLI](xplat-cli-connect.md).
- **Switch to the Azure Resource Manager mode**, using the following command:

		azure config mode arm
		
##Create Data Lake Analytics account

You must have a Data Lake Analytics account before you can run any jobs. To create a Data Lake Analytics account, you must specify the following:

- **Azure Resource Group**: A Data Lake Analytics account must be created within a Azure Resource group. [Azure Resource Manager](resource-group-overview.md) enables you to work with the resources in your application as a group. You can deploy, update or delete all of the resources for your application in a single, coordinated operation.  

	To enumerate the resource groups in your subscription:
    
    	azure group list -g "<
    
	To create a new resource group:

		azure group create -n "<Your resource group name>" -l "<Azure data center>"

- **Data Lake Analytics account name**
- **Location**: one of the Azure data centers that supports Data Lake Analytics.
- **Default Data Lake account**: each Data Lake Analytics account has a default Data Lake account.

	To list the existing Data Lake account:
	
		azure datalake store account list [options]

	To create a new Data Lake account:

		azure datalake store account create [options] <dataLakeStoreAccountName> <location> <resourceGroup>

	> [AZURE.NOTE] The Data Lake account name must only contain lowercase letters and numbers.



**To create a Data Lake Analytics account**

		azure datalake analytics account create [options] <dataLakeAnalyticsAccountName> <location> <resourceGroup> <defaultDataLake>

		azure datalake analytics account list [options]
		azure datalake analytics account show [options] <dataLakeAnalyticsAccountName>				

	> [AZURE.NOTE] The Data Lake Analytics account name must only contain lowercase letters and numbers.


##Upload data to Data Lake

In this tutorial, you will process some search logs.  The search log can be stored in either Data Lake store or Azure Blob storage. 

A sample search log has been copied to a public Azure Blob container. Use the following CLI script to download the file to your workstation, and then upload the file to your default Data Lake Store account.

See [Using the Azure CLI with Azure Storage](storage-azure-cli.md).

	#!/bin/bash
	# A simple Azure storage example
	
	export AZURE_STORAGE_ACCOUNT=<storage_account_name>
	export AZURE_STORAGE_ACCESS_KEY=<storage_account_key>
	
	export container_name=<container_name>
	export blob_name=<blob_name>
	export image_to_upload=<image_to_upload>
	export destination_folder=<destination_folder>
	
	echo "Creating the container..."
	azure storage container create $container_name
	
	echo "Uploading the image..."
	azure storage blob upload $image_to_upload $container_name $blob_name
	
	echo "Listing the blobs..."
	azure storage blob list $container_name
	
	echo "Downloading the image..."
	azure storage blob download $container_name $blob_name $destination_folder
	
	echo "Done"


=======================
  azre datalake store filesystem import [options] <dataLakeStoreAccountName> <path> <destination>
  azure datalake store filesystem list [options] <dataLakeStoreAccountName> <path>


>[AZURE.NOTE] The Azure Preview portal provides an user interface to copy the sample data files to the default Data Lake Store account. For instructions, see [Get Started with Azure Data Lake Analytics using Azure Preview Portal](data-lake-analytics-get-started-portal.md#upload-data-to-the-default-data-lake-store-account).

Data Lake Analytics can also access Azure Blob storage.  For uploading data to Azure Blob storage, see [Using the Azure CLI with Azure Storage](storage-azure-cli.md).

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

	This U-SQL script reads the input data file using **Extractors.Tsv()**, and then creates a csv file using
    **Outputters.Csv()*. 
    
    Notice the paths are relative paths, because it is simpler to use relative paths for the files stored in the default data Lake account. You can also use absolute path.  For example 
    
        adl://<Data LakeStorageAccountName>.azuredatalake.net/Samples/Data/SearchLog.tsv
        
    You must use absolute path to access the files in the linked Storage accounts.  The syntax for files stored in linked Azure Storage account is:
    
        wasb://<BlobContainerName>@<StorageAccountName>.blob.core.windows.net/Samples/Data/SearchLog.tsv

    >[AZURE.NOTE] Azure Blob container with public blobs or public containers access permissions are not currently supported.    

    For more about U-SQL, see [U-SQL language reference](http://go.microsoft.com/fwlink/?LinkId=690701).
	
**To submit the job**


	azure datalake analytics job create [options] <dataLakeAnalyticsAccountName> <jobName> <script>
	azure  datalake analytics job get [options] <dataLakeAnalyticsAccountName> <jobId>
  	azure datalake analytics job cancel [options] <dataLakeAnalyticsAccountName> <jobId>
  	azure datalake analytics job list [options] <dataLakeAnalyticsAccountName>


	In the script, the U-SQL script file is stored at c:\tutorials\data-lake-analytics\copyFile.usql. Update the file path accordingly.
 
After the job is completed, you can use the following cmdlets to list the file, and download the file:
	
	azure datalake store filesystem list [options] <dataLakeStoreAccountName> <path>
	azure datalake store filesystem show [options] <dataLakeStoreAccountName> <path>
	azure datalake store filesystem delete [options] <dataLakeStoreAccountName> <path>
	azure datalake store filesystem create [options] <dataLakeStoreAccountName> <path>
	azure datalake store filesystem import [options] <dataLakeStoreAccountName> <path> <destination>
	azure datalake store filesystem concat [options] <dataLakeStoreAccountName> <paths> <destination>
	azure datalake store filesystem move [options] <dataLakeStoreAccountName> <path> <destination>
	azure datalake store filesystem addcontent [options] <dataLakeStoreAccountName> <path> <value>
	azure datalake store filesystem export [options] <dataLakeStoreAccountName> <path> <destination>
	azure datalake store filesystem read [options] <dataLakeStoreAccountName> <path>


## See also

- To see the same tutorial using other tools, click the tab selectors on the top of the page.
- To see a more complexed query, see [Analyze Website logs using Azure Data Lake Analytics](data-lake-analytics-analyze-weblogs.md).
- To get started developing U-SQL applications, see [Develop U-SQL scripts using Data Lake Tools for Visual Studio](data-lake-analytics-data-lake-tools-get-started.md).
- To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
- For management tasks, see [Manage Azure Data Lake Analytics using Azure Preview Portal](data-lake-analytics-manage-use-portal.md).
- To get an overview of Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

