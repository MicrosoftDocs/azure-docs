<properties 
	pageTitle="Azure Data Factory - Terminology" 
	description="This article introduces you to the terminology used in creating data factories using the Azure Data Factory service" 
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
	ms.topic="article" 
	ms.date="04/14/2015" 
	ms.author="spelluru"/>

#Azure Data Factory - Terminology

## Data factory
An **Azure data factory** has one or more pipelines that process data in linked data stores (Azure Storage, Azure SQL Database, on-premises SQL Server etc...) by using linked compute services such as Azure HDInsight. An Azure data factory itself does not contain data within it; The data is rather stored in data stores mentioned above.  

## Linked Service
A **linked service** is a service that is linked to an Azure data factory. A linked service can be one of the following:

- A **data storage** service such as Azure Storage, Azure SQL Database or on-premises SQL Server database. A data store is a container of input/output data sets.    
- A **compute** service such as Azure HDInsight and Azure Machine Learning. A compute service process the input data and produces the output data.  

## Data set
A **data set** is a named view of data. The data being described can vary from simple bytes, semi-structured data like CSV files all the way up to relational tables or even models. A  Data Factory **table** is a data set that has a schema and is rectangular. After creating a linked service in a data store that refers to a data store, you define data sets that represent input/output data that is stored in the data store. 


##Pipeline
A **pipeline** in an Azure data factory processes data in linked storage services by using linked compute services. It contains a sequence of activities where each activity performing a specific processing operation. For example, a **Copy Activity** copies data from a source storage to a destination storage and **HDInsight Activity** use an Azure HDInsight cluster to process data using Hive queries or Pig scripts. A data factory can have one or more pipelines. 

Typical steps for creating an Azure Data Factory instance are:

1. Create a **data factory**.
2. Create a **linked service** for each data store or compute service.
3. Create input and output **datasets**.
4. Create a **pipeline**. 

##Activity
A data processing step in a pipeline that takes one or more input datasets and produces one or more output datasets.  Activities run in an execution environment (for example: Azure HDInsight cluster) and read/write data to a data store associated/linked with the Azure data factory. 

Azure Data Factory service supports the following activities in a pipeline: 

- **Copy Activity** copies the data from a data store to another data store. See [Copy data with Azure Data Factory][copy-data-with-adf] for details about what data stores the Copy Activity supports. 
- **HDInsight Activity** processes data by running Hive/Pig scripts or MapReduce programs on an HDInsight cluster. See [Use Pig and Hive with Data Factory][use-pig-hive] and [Invoke MapReduce Programs from Data Factory][run-map-reduce] for details. 
- **Azure Machine Learning Batch Scoring Activity** invokes the Azure Machine Learning batch scoring API. See [Create Predictive Pipelines using Azure Data Factory and Azure Machine Learning][azure-ml-adf] for details. 
- **Stored Procedure Activity** invokes a stored procedure in an Azure SQL Database. See the [Stored Procedure Activity][msdn-stored-procedure-activity] on MSDN Library for details.   

##Slice
A table in an Azure data factory is composed of slices. The width of a slice is determined by the schedule – hourly/daily. When the schedule is “hourly”, a slice is produced hourly with in the start time and end time of a pipeline. For example, if the pipeline start date-time is 03/03/2015 06:00:00 (6 AM) and end date-time is 03-03/2015 09:00:00 (9 AM on the same day), three data slices are produced, a slice for each 1 hour interval: 6-7 AM, 7-8 AM, and 8-9 AM.    

Slices provide the ability to work with a subset of overall data for a specific time window (for example: the slice that is produced for the duration (hour): 1:00 PM to 2:00 PM). 

## Activity run for a slice
The **run** or an activity run is a unit of processing for a slice. There could be one or more runs for a slice in case of retries or if you rerun your slice in case of a failure. A slice is identified by its start time.

##Data Management Gateway
Microsoft **Data Management Gateway** is software that connects on-premises data sources to cloud services for consumption. You must have at least one gateway installed in your corporate environment and register it with the Azure Data Factory portal before adding on-premises data sources as linked services.
 
##Data Hub
A **Data Hub** is a logical container for data storage and compute services. For example, a Hadoop cluster with HDFS as storage and Hive/Pig as compute (processing) is a data hub. Similarly, an enterprise data warehouse (EDW) can be modeled as a data hub (database as storage, stored procedures and/or ETL tool as compute services).  Pipelines use data stores and run on compute resources in a data hub. Only HDInsight hub is supported at this moment.

The Data Hub allows a data factory to be divided into logical or domain specific groupings, such as the “West US Azure Hub” which manages all of the linked services (data stores and compute) and pipelines focused in the West US data center, or the “Sales EDW Hub” which manages all the linked services and pipelines concerned with populating and processing data for the Sales Enterprise Data Warehouse.

An important characteristic of Hub is that a pipeline runs on a single hub. This means that when defining a pipeline, all of the linked services referenced by tables or activities within that pipeline must have the same hub name as the pipeline itself. If the HubName property is not specified for a linked service, the linked service is placed in the “Default” Hub.

# See Also

1. [Introduction to Azure Data Factory][adf-intro]. This article provides an overview of the Azure Data Factory service, the value it provides, and the scenarios it supports.
2. [Get started with Data Factory][datafactory-getstarted]. This article provides an end-to-end tutorial that shows you how to create a sample Azure data factory that copies data from an Azure blob to an Azure SQL database.


[Power-Query-Azure-Table]: http://office.microsoft.com/en-001/excel-help/connect-to-microsoft-azuretable-storage-HA104122607.aspx
[Power-Query-Azure-Blob]: http://office.microsoft.com/en-001/excel-help/connect-to-microsoft-azure-blob-storage-HA104113447.aspx
[Power-Query-Azure-SQL]: http://office.microsoft.com/en-001/excel-help/connect-to-a-microsoft-azure-sql-database-HA104019809.aspx
[Power-Query-OnPrem-SQL]: http://office.microsoft.com/en-001/excel-help/connect-to-a-sql-server-database-HA104019808.aspx

[adf-faq]: data-factory-faq.md
[adf-intro]: data-factory-introduction.md
[copy-data-with-adf]: data-factory-copy-activity.md
[use-pig-hive]: data-factory-pig-hive-activities.md
[run-map-reduce]: data-factory-map-reduce.md
[azure-ml-adf]: data-factory-create-predictive-pipelines.md
[adf-common-scenarios]: data-factory-common-scenarios.md
[create-factory-using-dotnet-sdk]: data-factory-create-data-factories-programmatically.md
[data-factory-editor]: data-factory-editor.md
[create-data-factory-using-powershell]: data-factory-monitor-manage-using-powershell.md

[adf-powershell-reference]: https://msdn.microsoft.com/library/dn820234.aspx 


[msdn-stored-procedure-activity]: https://msdn.microsoft.com/library/dn912649.aspx
[msdn-class-library-reference]: https://msdn.microsoft.com/library/dn883654.aspx
[msdn-rest-api-reference]: https://msdn.microsoft.com/library/dn906738.aspx

[adf-tutorial]: data-factory-tutorial.md
[datafactory-getstarted]: data-factory-get-started.md

[image-data-factory-introduction-traditional-ETL]: ./media/data-factory-introduction/TraditionalETL.PNG

[image-data-factory-introduction-todays-diverse-processing-landspace]:./media/data-factory-introduction/TodaysDiverseDataProcessingLandscape.PNG

[image-data-factory-application-model]:./media/data-factory-introduction/DataFactoryApplicationModel.png

[image-data-factory-data-flow]:./media/data-factory-introduction/DataFactoryDataFlow.png



