<properties
	pageTitle="All topics for Data Factory service | Microsoft Azure"
	description="Table of all topics for the Azure service named Data Factory that exist on http://azure.microsoft.com/documentation/articles/, Title and description."
	services="data-factory"
	documentationCenter=""
	authors="spelluru"
	manager="jhubbard"
	editor="MightyPen"/>

<tags
	ms.service="data-factory"
	ms.workload="data-factory"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/05/2016"
	ms.author="spelluru"/>


# All topics for Azure Data Factory service

This topic lists every topic that applies directly to the **Data Factory** service of Azure. You can search this webpage for keywords by using **Ctrl+F**, to find the topics of current interest.




## New

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 1 | [Move data From Amazon Redshift using Azure Data Factory](data-factory-amazon-redshift-connector.md) | Learn about how to move data from Amazon Redshift using Azure Data Factory. |
| 2 | [Move data From Amazon Simple Storage Service using Azure Data Factory](data-factory-amazon-simple-storage-service-connector.md) | Learn about how to move data from Amazon Simple Storage Service (S3) using Azure Data Factory. |
| 3 | [Azure Data Factory - Copy Wizard](data-factory-azure-copy-wizard.md) | Learn about how to use the Data Factory Azure Copy Wizard to copy data from supported data sources to sinks. |
| 4 | [Tutorial: Build your first Azure data factory using Data Factory REST API](data-factory-build-your-first-pipeline-using-rest-api.md) | In this tutorial, you create a sample Azure Data Factory pipeline using Data Factory REST API. |
| 5 | [Tutorial: Create a pipeline with Copy Activity using .NET API](data-factory-copy-activity-tutorial-using-dotnet-api.md) | In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using .NET API. |
| 6 | [Tutorial: Create a pipeline with Copy Activity using REST API](data-factory-copy-activity-tutorial-using-rest-api.md) | In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using REST API. |
| 7 | [Data Factory Copy Wizard](data-factory-copy-wizard.md) | Learn about how to use the Data Factory Copy Wizard to copy data from supported data sources to sinks. |
| 8 | [Data Management Gateway](data-factory-data-management-gateway.md) | Set up a data gateway to move data between on-premises and the cloud. Use Data Management Gateway in Azure Data Factory to move your data. |
| 9 | [Move data from an on-premises Cassandra database using Azure Data Factory](data-factory-onprem-cassandra-connector.md) | Learn about how to move data from an on-premises Cassandra database using Azure Data Factory. |
| 10 | [Move data From MongoDB using Azure Data Factory](data-factory-on-premises-mongodb-connector.md) | Learn about how to move data from MongoDB database using Azure Data Factory. |
| 11 | [Move data from Salesforce by using Azure Data Factory](data-factory-salesforce-connector.md) | Learn about how to move data from Salesforce by using Azure Data Factory. |


## Updated articles, Data Factory

This section lists articles which were updated recently, where the update was big or significant. For each updated article, a rough snippet of the added markdown text is displayed. The articles were updated within the date range of **2016-08-22** to **2016-10-05**.

| &nbsp; | Article | Updated text, snippet | Updated when |
| --: | :-- | :-- | :-- |
| 12 | [Azure Data Factory - .NET API change log](data-factory-api-change-log.md) | This article provides information about changes to Azure Data Factory SDK in a specific version. You can find the latest NuGet package for Azure Data Factory  here (https://www.nuget.org/packages/Microsoft.Azure.Management.DataFactories) ** Version 4.11.0** Feature Additions: / The following linked service types have been added: 	-  OnPremisesMongoDbLinkedService (https://msdn.microsoft.com/library/mt765129.aspx) 	-  AmazonRedshiftLinkedService (https://msdn.microsoft.com/library/mt765121.aspx) 	-  AwsAccessKeyLinkedService (https://msdn.microsoft.com/library/mt765144.aspx) / The following dataset types have been added: 	-  MongoDbCollectionDataset (https://msdn.microsoft.com/library/mt765145.aspx) 	-  AmazonS3Dataset (https://msdn.microsoft.com/library/mt765112.aspx) / The following copy source types have been added: 	-  MongoDbSource (https://msdn.microsoft.com/en-US/library/mt765123.aspx) ** Version 4.10.0** / The following optional properties have been added to TextFormat: 	-  Ski | 2016-09-22 |
| 13 | [Move data to and from Azure Blob using Azure Data Factory](data-factory-azure-blob-connector.md) |  /  copyBehavior  /  Defines the copy behavior when the source is BlobSource or FileSystem.  /  **PreserveHierarchy:** preserves the file hierarchy in the target folder. The relative path of source file to source folder is identical to the relative path of target file to target folder..br/..br/.**FlattenHierarchy:** all files from the source folder are in the first level of target folder. The target files have auto generated name. .br/..br/.**MergeFiles: (default)** merges all files from the source folder to one file. If the File/Blob Name is specified, the merged file name would be the specified name; otherwise, would be auto-generated file name.  /  No  /  **BlobSource** also supports these two properties for backward compatibility. / **treatEmptyAsNull**: Specifies whether to treat null or empty string as null value. / **skipHeaderLineCount** - Specifies how many lines need be skipped. It is applicable only when input dataset is using TextFormat. Similarly, **BlobSink** supports th | 2016-09-28 |
| 14 | [Create predictive pipelines using Azure Machine Learning activities](data-factory-azure-ml-batch-execution-activity.md) | ** Web service requires multiple inputs** If the web service takes multiple inputs, use the **webServiceInputs** property instead of using **webServiceInput**. Datasets that are referenced by the **webServiceInputs** must also be included in the Activity **inputs**. In your Azure ML experiment, web service input and output ports and global parameters have default names ("input1", "input2") that you can customize. The names you use for webServiceInputs, webServiceOutputs, and globalParameters settings must exactly match the names in the experiments. You can view the sample request payload on the Batch Execution Help page for your Azure ML endpoint to verify the expected mapping. 	{ 		"name": "PredictivePipeline", 		"properties": { 			"description": "use AzureML model", 			"activities":  { 				"name": "MLActivity", 				"type": "AzureMLBatchExecution", 				"description": "prediction analysis on batch input", 				"inputs":  { 					"name": "inputDataset1" 				}, { 					"name": "inputDatase | 2016-09-13 |
| 15 | [Copy Activity performance and tuning guide](data-factory-copy-activity-performance.md) | 1.	**Establish a baseline**. During the development phase, test your pipeline by using Copy Activity against a representative data sample. You can use the Data Factory  slicing model (data-factory-scheduling-and-execution.md time-series-datasets-and-data-slices) to limit the amount of data you work with. 	Collect execution time and performance characteristics by using the **Monitoring and Management App**. Choose **Monitor & Manage** on your Data Factory home page. In the tree view, choose the **output dataset**. In the **Activity Windows** list, choose the Copy Activity run. **Activity Windows** lists the Copy Activity duration and the size of the data that's copied. The throughput is listed in **Activity Window Explorer**. To learn more about the app, see  Monitor and manage Azure Data Factory pipelines by using the Monitoring and Management App (data-factory-monitor-manage-app.md). 	! Activity run details (./media/data-factory-copy-activity-performance/mmapp-activity-run-details.pn | 2016-09-27 |
| 16 | [Tutorial: Create a pipeline with Copy Activity using Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) |   Note the following points: 	- dataset **type** is set to **AzureBlob**. 	- **linkedServiceName** is set to **AzureStorageLinkedService**. You created this linked service in Step 2. 	- **folderPath** is set to the **adftutorial** container. You can also specify the name of a blob within the folder using the **fileName** property. Since you are not specifying the name of the blob, data from all blobs in the container is considered as an input data. 	- format **type** is set to **TextFormat** 	- There are two fields in the text file ΓÇô **FirstName** and **LastName** ΓÇô separated by a comma character (**columnDelimiter**)	 	- The **availability** is set to **hourly** (**frequency** is set to **hour** and **interval** is set to **1**). Therefore, Data Factory looks for input data every hour in the root folder of blob container (**adftutorial**) you specified. 	if you don't specify a **fileName** for an **input** dataset, all files/blobs from the input folder (**folderPath**) are consid | 2016-09-29 |
| 17 | [Create, monitor, and manage Azure data factories using Data Factory .NET SDK](data-factory-create-data-factories-programmatically.md) | Note down the application ID and the password (client secret) and use it in the walkthrough. ** Get Azure subscription and tenant IDs** If you do not have latest version of PowerShell installed on your machine, follow instructions in  How to install and configure Azure PowerShell (../powershell-install-configure.md) article to install it. 1. Start Azure PowerShell and run the following command 2. Run the following command and enter the user name and password that you use to sign in to the Azure portal. 		Login-AzureRmAccount 	If you have only one Azure subscription associated with this account, you do not need to perform the next two steps. 3. Run the following command to view all the subscriptions for this account. 		Get-AzureRmSubscription 4. Run the following command to select the subscription that you want to work with. Replace **NameOfAzureSubscription** with the name of your Azure subscription. 		Get-AzureRmSubscription -SubscriptionName NameOfAzureSubscription  /  Set-AzureRmCo | 2016-09-14 |
| 18 | [Pipelines and Activities in Azure Data Factory](data-factory-create-pipelines.md) | 	  , 	  "start": "2016-07-12T00:00:00Z", 	  "end": "2016-07-13T00:00:00Z" 	  } 	} Note the following points: / In the activities section, there is only one activity whose **type** is set to **Copy**. / Input for the activity is set to **InputDataset** and output for the activity is set to **OutputDataset**. / In the **typeProperties** section, **BlobSource** is specified as the source type and **SqlSink** is specified as the sink type. For a complete walkthrough of creating this pipeline, see  Tutorial: Copy data from Blob Storage to SQL Database (data-factory-copy-data-from-azure-blob-storage-to-sql-database.md). ** Sample transformation pipeline** In the following sample pipeline, there is one activity of type **HDInsightHive** in the **activities** section. In this sample, the  HDInsight Hive activity (data-factory-hive-activity.md) transforms data from an Azure Blob storage by running a Hive script file on an Azure HDInsight Hadoop cluster. 	{ 	  "name": "TransformPipeline", 	  "p | 2016-09-27 |
| 19 | [Transform data in Azure Data Factory](data-factory-data-transformation-activities.md) | Data Factory supports the following data transformation activities that can be added to  pipelines (data-factory-create-pipelines.md) either individually or chained with another activity. .  AZURE.NOTE  For a walkthrough with step-by-step instructions, see  Create a pipeline with Hive transformation (data-factory-build-your-first-pipeline.md) article. ** HDInsight Hive activity** The HDInsight Hive activity in a Data Factory pipeline executes Hive queries on your own or on-demand Windows/Linux-based HDInsight cluster. See  Hive Activity (data-factory-hive-activity.md) article for details about this activity. ** HDInsight Pig activity** The HDInsight Pig activity in a Data Factory pipeline executes Pig queries on your own or on-demand Windows/Linux-based HDInsight cluster. See  Pig Activity (data-factory-pig-activity.md) article for details about this activity. ** HDInsight MapReduce activity** The HDInsight MapReduce activity in a Data Factory pipeline executes MapReduce programs on y | 2016-09-26 |
| 20 | [Data Factory scheduling and execution](data-factory-scheduling-and-execution.md) | CopyActivity2 would run only if the CopyActivity1 has run successfully and Dataset2 is available. Here is the sample pipeline JSON: 	{ 		"name": "ChainActivities", 	  "properties": { 			"description": "Run activities in sequence", 	  "activities":  	  { 	  "type": "Copy", 	  "typeProperties": { 	  "source": { 	  "type": "BlobSource" 	  }, 	  "sink": { 	  "type": "BlobSink", 	  "copyBehavior": "PreserveHierarchy", 	  "writeBatchSize": 0, 	  "writeBatchTimeout": "00:00:00" 	  } 	  }, 	  "inputs":  	  { 	  "name": "Dataset1" 	  } 	  , 	  "outputs":  	  { 	  "name": "Dataset2" 	  } 	  , 	  "policy": { 	  "timeout": "01:00:00" 	  }, 	  "scheduler": { 	  "frequency": "Hour", 	  "interval": 1 	  }, 	  "name": "CopyFromBlob1ToBlob2", 	  "description": "Copy data from a blob to another" 	  }, 	  { 	  "type": "Copy", 	  "typeProperties": { 	  "source": { 	  "type": "BlobSource" 	  }, 	  "sink": { 	  "type": "BlobSink", 	  "writeBatchSize": 0, 	  "writeBatchTimeout": "00:00:00" 	  } 	  }, 	  "in | 2016-09-28 |





## Tutorials

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 21 | [Tutorial: Build your first pipeline to process data using Hadoop cluster](data-factory-build-your-first-pipeline.md) | This Azure Data Factory tutorial shows you how to create and schedule a data factory that processes data using Hive script on a Hadoop cluster. |
| 22 | [Tutorial: Build your first Azure data factory using Azure Resource Manager template](data-factory-build-your-first-pipeline-using-arm.md) | In this tutorial, you create a sample Azure Data Factory pipeline using an Azure Resource Manager template. |
| 23 | [Tutorial: Build your first Azure data factory using Azure portal](data-factory-build-your-first-pipeline-using-editor.md) | In this tutorial, you create a sample Azure Data Factory pipeline using Data Factory Editor in the Azure portal. |
| 24 | [Tutorial: Build your first Azure data factory using Azure PowerShell](data-factory-build-your-first-pipeline-using-powershell.md) | In this tutorial, you create a sample Azure Data Factory pipeline using Azure PowerShell. |
| 25 | [Tutorial: Build your Azure first data factory using Microsoft Visual Studio](data-factory-build-your-first-pipeline-using-vs.md) | In this tutorial, you create a sample Azure Data Factory pipeline using Visual Studio. |
| 26 | [Tutorial: Create a pipeline with Copy Activity using Azure portal](data-factory-copy-activity-tutorial-using-azure-portal.md) | In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using the Data Factory Editor in the Azure portal. |
| 27 | [Tutorial: Create a pipeline with Copy Activity using Azure PowerShell](data-factory-copy-activity-tutorial-using-powershell.md) | In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using Azure PowerShell. |
| 28 | [Tutorial: Create a pipeline with Copy Activity using Visual Studio](data-factory-copy-activity-tutorial-using-visual-studio.md) | In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using Visual Studio. |
| 29 | [Copy data from Blob Storage to SQL Database using Data Factory](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) | This tutorial shows you how to use Copy Activity in an Azure Data Factory pipeline to copy data from Blob storage to SQL database. |
| 30 | [Tutorial: Create a pipeline with Copy Activity using Data Factory Copy Wizard](data-factory-copy-data-wizard-tutorial.md) | In this tutorial, you create an Azure Data Factory pipeline with a Copy Activity by using the Copy Wizard supported by Data Factory |



## Data Movement

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 31 | [Move data to and from Azure Blob using Azure Data Factory](data-factory-azure-blob-connector.md) | Learn how to copy blob data in Azure Data Factory. Use our sample: How to copy data to and from Azure Blob Storage and Azure SQL Database. |
| 32 | [Move data to and from Azure Data Lake Store using Azure Data Factory](data-factory-azure-datalake-connector.md) | Learn how to move data to/from Azure Data Lake Store using Azure Data Factory |
| 33 | [Move data to and from DocumentDB using Azure Data Factory](data-factory-azure-documentdb-connector.md) | Learn how move data to/from Azure DocumentDB collection using Azure Data Factory |
| 34 | [Move data to and from Azure SQL Database using Azure Data Factory](data-factory-azure-sql-connector.md) | Learn how to move data to/from Azure SQL Database using Azure Data Factory. |
| 35 | [Move data to and from Azure SQL Data Warehouse using Azure Data Factory](data-factory-azure-sql-data-warehouse-connector.md) | Learn how to move data to/from Azure SQL Data Warehouse using Azure Data Factory |
| 36 | [Move data to and from Azure Table using Azure Data Factory](data-factory-azure-table-connector.md) | Learn how to move data to/from Azure Table Storage using Azure Data Factory. |
| 37 | [Copy Activity performance and tuning guide](data-factory-copy-activity-performance.md) | Learn about key factors that affect the performance of data movement in Azure Data Factory when you use Copy Activity. |
| 38 | [Move data by using Copy Activity](data-factory-data-movement-activities.md) | Learn about data movement in Data Factory pipelines: data migration between cloud stores, and between an on-premises store and a cloud store. Use Copy Activity. |
| 39 | [Release notes for Data Management Gateway](data-factory-gateway-release-notes.md) | Data Management Gateway tory release notes |
| 40 | [Move data From on-premises HDFS using Azure Data Factory](data-factory-hdfs-connector.md) | Learn about how to move data from on-premises HDFS using Azure Data Factory. |
| 41 | [Monitor and manage Azure Data Factory pipelines using new Monitoring and Management App](data-factory-monitor-manage-app.md) | Learn how to use Monitoring and Management App to monitor and manage Azure data factories and pipelines. |
| 42 | [Move data between on-premises sources and the cloud with Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md) | Set up a data gateway to move data between on-premises and the cloud. Use Data Management Gateway in Azure Data Factory to move your data. |
| 43 | [Move data From a OData source using Azure Data Factory](data-factory-odata-connector.md) | Learn about how to move data from OData sources using Azure Data Factory. |
| 44 | [Move data From ODBC data stores using Azure Data Factory](data-factory-odbc-connector.md) | Learn about how to move data from ODBC data stores using Azure Data Factory. |
| 45 | [Move data from DB2 using Azure Data Factory](data-factory-onprem-db2-connector.md) | Learn about how move data from DB2 Database using Azure Data Factory |
| 46 | [Move data to and from an on-premises file system by using Azure Data Factory](data-factory-onprem-file-system-connector.md) | Learn how to move data to and from an on-premises file system by using Azure Data Factory. |
| 47 | [Move data From MySQL using Azure Data Factory](data-factory-onprem-mysql-connector.md) | Learn about how to move data from MySQL database using Azure Data Factory. |
| 48 | [Move data to/from on-premises Oracle using Azure Data Factory](data-factory-onprem-oracle-connector.md) | Learn how to move data to/from Oracle database that is on-premises using Azure Data Factory. |
| 49 | [Move data from PostgreSQL using Azure Data Factory](data-factory-onprem-postgresql-connector.md) | Learn about how to move data from PostgreSQL Database using Azure Data Factory. |
| 50 | [Move data from Sybase using Azure Data Factory](data-factory-onprem-sybase-connector.md) | Learn about how to move data from Sybase Database using Azure Data Factory. |
| 51 | [Move data from Teradata using Azure Data Factory](data-factory-onprem-teradata-connector.md) | Learn about Teradata Connector for the Data Factory service that lets you move data from Teradata Database |
| 52 | [Move data to and from SQL Server on-premises or on IaaS (Azure VM) using Azure Data Factory](data-factory-sqlserver-connector.md) | Learn about how to move data to/from SQL Server database that is on-premises or in an Azure VM using Azure Data Factory. |
| 53 | [Move data from a Web table source using Azure Data Factory](data-factory-web-table-connector.md) | Learn about how to move data from on-premises a table in a Web page using Azure Data Factory. |



## Data Transformation

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 54 | [Create predictive pipelines using Azure Machine Learning activities](data-factory-azure-ml-batch-execution-activity.md) | Describes how to create create predictive pipelines using Azure Data Factory and Azure Machine Learning |
| 55 | [Compute Linked Services](data-factory-compute-linked-services.md) | Learn about compute enviornments that you can use in Azure Data Factory pipelines to transform/process data. |
| 56 | [Process large-scale datasets using Data Factory and Batch](data-factory-data-processing-using-batch.md) | Describes how to process huge amounts of data in an Azure Data Factory pipeline by using parallel processing capability of Azure Batch. |
| 57 | [Transform data in Azure Data Factory](data-factory-data-transformation-activities.md) | Learn how to transform data or process data in Azure Data Factory using Hadoop, Machine Learning, or Azure Data Lake Analytics. |
| 58 | [Hadoop Streaming Activity](data-factory-hadoop-streaming-activity.md) | Learn how you can use the Hadoop Streaming Activity in an Azure data factory to run Hadoop Streaming programs on an on-demand/your own HDInsight cluster. |
| 59 | [Hive Activity](data-factory-hive-activity.md) | Learn how you can use the Hive Activity in an Azure data factory to run Hive queries on an on-demand/your own HDInsight cluster. |
| 60 | [Invoke MapReduce Programs from Data Factory](data-factory-map-reduce.md) | Learn how to process data by running MapReduce programs on an Azure HDInsight cluster from an Azure data factory. |
| 61 | [Pig Activity](data-factory-pig-activity.md) | Learn how you can use the Pig Activity in an Azure data factory to run Pig scripts on an on-demand/your own HDInsight cluster. |
| 62 | [Invoke Spark Programs from Data Factory](data-factory-spark.md) | Learn how to invoke Spark programs from an Azure data factory using the MapReduce Activity. |
| 63 | [SQL Server Stored Procedure Activity](data-factory-stored-proc-activity.md) | Learn how you can use the SQL Server Stored Procedure Activity to invoke a stored procedure in an Azure SQL Database or Azure SQL Data Warehouse from a Data Factory pipeline. |
| 64 | [Use custom activities in an Azure Data Factory pipeline](data-factory-use-custom-activities.md) | Learn how to create custom activities and use them in an Azure Data Factory pipeline. |
| 65 | [Run U-SQL script on Azure Data Lake Analytics from Azure Data Factory](data-factory-usql-activity.md) | Learn how to process data by running U-SQL scripts on Azure Data Lake Analytics compute service. |



## Samples

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 66 | [Azure Data Factory - Samples](data-factory-samples.md) | Provides details about samples that ship with the Azure Data Factory service. |



## Use Cases

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 67 | [Customer case studies](data-factory-customer-case-studies.md) | Learn about how some of our customers have been using Azure Data Factory. |
| 68 | [Use Case - Customer Profiling](data-factory-customer-profiling-usecase.md) | Learn how Azure Data Factory is used to create a data-driven workflow (pipeline) to profile gaming customers. |
| 69 | [Use Case - Product Recommendations](data-factory-product-reco-usecase.md) | Learn about an use case implemented by using Azure Data Factory along with other services. |



## Monitor and Manage

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 70 | [Monitor and manage Azure Data Factory pipelines](data-factory-monitor-manage-pipelines.md) | Learn how to use Azure Portal and Azure PowerShell to monitor and manage Azure data factories and pipelines you have created. |



## SDK

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 71 | [Azure Data Factory - .NET API change log](data-factory-api-change-log.md) | Describes breaking changes, feature additions, bug fixes etc... in a specific version of .NET API for the Azure Data Factory. |
| 72 | [Create, monitor, and manage Azure data factories using Data Factory .NET SDK](data-factory-create-data-factories-programmatically.md) | Learn how to programmatically create, monitor, and manage Azure data factories by using Data Factory SDK. |
| 73 | [Azure Data Factory Developer Reference](data-factory-sdks.md) | Learn about different ways to create, monitor, and manage Azure data factories |



## Miscellaneous

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 74 | [Azure Data Factory - Frequently Asked Questions](data-factory-faq.md) | Frequently asked questions about Azure Data Factory. |
| 75 | [Azure Data Factory - Functions and System Variables](data-factory-functions-variables.md) | Provides a list of Azure Data Factory functions and system variables |
| 76 | [Azure Data Factory - Naming Rules](data-factory-naming-rules.md) | Describes naming rules for Data Factory entities. |
| 77 | [Troubleshoot Data Factory issues](data-factory-troubleshoot.md) | Learn how to troubleshoot issues with using Azure Data Factory. |

