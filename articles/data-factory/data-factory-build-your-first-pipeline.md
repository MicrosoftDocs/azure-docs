<properties
	pageTitle="Build your first pipeline using Azure Data Factory"
	description="This tutorial shows you how to create a sample data pipeline that transforms data using Azure HDInsight."
	services="data-factory"
	documentationCenter=""
	authors="spelluru"
	manager="jhubbard"
	editor="monicar"/>

<tags
	ms.service="data-factory"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article" 
	ms.date="09/22/2015"
	ms.author="spelluru"/>

# Build your first pipeline using Azure Data Factory
> [AZURE.SELECTOR]
- [Tutorial Overview](data-factory-build-your-first-pipeline.md)
- [Using Data Factory Editor](data-factory-build-your-first-pipeline-using-editor.md)
- [Using PowerShell](data-factory-build-your-first-pipeline-using-powershell.md)
- [Using Visual Studio](data-factory-build-your-first-pipeline-using-vs.md)

This article helps you get started with building your first pipeline, and deploy it to the Azure Data Factory. 

> [AZURE.NOTE] This article does not provide a conceptual overview of the Azure Data Factory service. For a detailed overview of the service, see the [Introduction to Azure Data Factory](data-factory-introduction.md) article.

## Tutorial Overview
This tutorial takes you through the steps needed to get your first pipeline up and running. You will be creating pipelines, and specifying all the resources needed from scratch.

If you want to explore the various capabilities of the data factory quickly, without creating one from scratch, you can use the samples that we provide in the Azure Preview Portal. See [Azure Data Factory Update: Simplified sample deployment](http://azure.microsoft.com/blog/2015/04/24/azure-data-factory-update-simplified-sample-deployment/) on how to deploy an use-case based sample using the Azure Preview Portal.

## Pre-requisites
Before you begin this tutorial, you must have the following pre-requisites:

1.	**Azure subscription** - If you don't have an Azure subscription, you can create a free trial account in just a couple of minutes. See the [Free Trial](http://azure.microsoft.com/pricing/free-trial/) article on how you can obtain a free trial account.

2.	**Azure Storage** – You will use an Azure storage account for storing the data in this tutorial. If you don't have an Azure storage account, see the [Create a storage account](../storage-create-storage-account/#create-a-storage-account) article. After you have created the storage account, you will need to obtain the account key used to access the storage. See [View, copy and regenerate storage access keys](../storage-create-storage-account/#view-copy-and-regenerate-storage-access-keys).

## What’s covered in this tutorial?	
Azure Data Factory enables you to compose data movement and data processing tasks as a data driven workflow. You will learn how to build your first pipeline that uses HDInsight to transform and analyze web logs on a monthly basis.  

In this tutorial, you will be performing the following steps:

1.	Create a data factory.
2.	Create following linked services:
	1.	**Azure Storage Account** – The Azure storage account will be used to store files used by the on-demand HDInsight cluster.
	2.	**On-Demand HDInsight Cluster** – A HDInsight cluster will be started on-demand to transform and analyze the data.
3.	Create  the output dataset 
4.	Create the pipeline that runs a Hive script, and stores the result in the output dataset. The Hive script first creates an external table, referencing the raw web log data stored in Azure blob storage. The next step in the Hive script then partitions the raw data by year and month.

Your first pipeline, called **MyFirstPipeline**, uses a Hive activity to transform and analyze web logs that are deployed as part of the HDInsight cluster, and stored in **/HdiSamples/WebsiteLogSampleData/SampleLog/**. 

![Diagram View](./media/data-factory-build-your-first-pipeline/diagram-view.png)

After the Hive script executes, the results will be stored in an Azure blob storage container: **data/partitioneddata**.

The availability defined on the **AzureBlobOutput** dataset determines how often the Hive activity is run. In this tutorial, this is set to monthly.

## Prepare Azure Storage for the tutorial
Before starting the tutorial, you need to prepare the Azure storage with files needed for the tutorial.

1. Launch notepad, paste the following text, and save it as **partitionweblogs.hql** in the C:\adfgettingstarted folder on your hard drive. This Hive scripts creates two external tables: **WebLogsRaw** and **WebLogsPartitioned**.

		set hive.exec.dynamic.partition.mode=nonstrict;
		
		DROP TABLE IF EXISTS WebLogsRaw; 
		CREATE TABLE WebLogsRaw (
		  date  date,
		  time  string,
		  ssitename string,
		  csmethod  string,
		  csuristem  string,
		  csuriquery string,
		  sport int,
		  susername string,
		  cipcsUserAgent string,
		  csCookie string,
		  csReferer string,
		  cshost  string,
		  scstatus  int,
		  scsubstatus  int,
		  scwin32status  int,
		  scbytes int,
		  csbytes int,
		  timetaken int
		)
		ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
		LINES TERMINATED BY '\n' 
		tblproperties ("skip.header.line.count"="2");
		
		LOAD DATA INPATH '/HdiSamples/WebsiteLogSampleData/SampleLog/909f2b.log' OVERWRITE INTO TABLE WebLogsRaw;
		
		DROP TABLE IF EXISTS WebLogsPartitioned ; 
		create external table WebLogsPartitioned (  
		  date  date,
		  time  string,
		  ssitename string,
		  csmethod  string,
		  csuristem  string,
		  csuriquery string,
		  sport int,
		  susername string,
		  cipcsUserAgent string,
		  csCookie string,
		  csReferer string,
		  cshost  string,
		  scstatus  int,
		  scsubstatus  int,
		  scwin32status  int,
		  scbytes int,
		  csbytes int,
		  timetaken int
		)
		partitioned by ( year int, month int)
		ROW FORMAT DELIMITED FIELDS TERMINATED BY ',' 
		STORED AS TEXTFILE 
		LOCATION '${hiveconf:partitionedtable}';
		
		INSERT INTO TABLE WebLogsPartitioned  PARTITION( year , month) 
		SELECT
		  date,
		  time,
		  ssitename,
		  csmethod,
		  csuristem,
		  csuriquery,
		  sport,
		  susername,
		  cipcsUserAgent,
		  csCookie,
		  csReferer,
		  cshost,
		  scstatus,
		  scsubstatus,
		  scwin32status,
		  scbytes,
		  csbytes,
		  timetaken,
		  year(date),
		  month(date)
		FROM WebLogsRaw
	
 
2. To prepare the Azure storage for the tutorial:
	1. Download the [latest version of **AzCopy**](http://aka.ms/downloadazcopy), or the [latest preview version](http://aka.ms/downloadazcopypr). See [How to use AzCopy](../storage/storage-use-azcopy.md) article for instructions on using the utility.
	2. After AzCopy has been installed, you can add it to the system path by running the following command at a command prompt. 
	
			set path=%path%;C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy			 

	3. Navigate to the c:\adfgettingstarted folder, and run the following command to upload the Hive .HQL file to the storage account. Replace **StorageAccountName** with the name of your storage account, and **Storage Key** with the storage account key.

			AzCopy /Source:. /Dest:https://<StorageAccountName>.blob.core.windows.net/script /DestKey:<Storage Key>

		> [AZURE.NOTE] The above command creates a container named **script** in your Azure Blob storage and copies the **partitionweblogs.hql** file from to the container. 
	>
	5. After the file has been successfully uploaded, you will see the following output from AzCopy.
	
			Finished 1 of total 1 file(s).
			[2015/06/15 15:47:13] Transfer summary:
			-----------------
			Total files transferred: 1
			Transfer successfully:   1
			Transfer skipped:        0
			Transfer failed:         0
			Elapsed time:            00.00:00:01

Do the following:

- Click [Using Data Factory Editor](data-factory-build-your-first-pipeline-using-editor.md) link at the top to perform the tutorial by using Data Factory Editor, which is part of the Azure Portal.
- Click [Using PowerShell](data-factory-build-your-first-pipeline-using-powershell.md) link at the top to perform the tutorial by using Azure PowerShell.
- Click [Using Visual Studio](data-factory-build-your-first-pipeline-using-vs.md) link at the top to perform the tutorial by using Visual Studio. 

## Send Feedback
We would really appreciate your feedback on this article. Please take a few minutes to submit your feedback via [email](mailto:adfdocfeedback@microsoft.com?subject=data-factory-build-your-first-pipeline.md). 