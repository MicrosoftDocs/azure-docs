<properties 
	pageTitle="Move data using Copy Activity | Microsoft Azure" 
	description="Learn about data movement in Data Factory pipelines: data migration between cloud stores, between on-premises and cloud. Use the Copy Activity." 
	keywords="copy data, data movement, data migration, transfer data"
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
	ms.date="08/08/2016" 
	ms.author="spelluru"/>

# Move data using Copy Activity

## Overview
Azure Data Factory allows you to use the Copy Activity to copy data of different shapes from a variety of on-premises and cloud data sources to Azure, so it can be further transformed and analyzed. Copy Activity can also be used to publish transformation and analysis results for Business Intelligence (BI) and application consumption.

![Role of copy activity](media/data-factory-data-movement-activities/copy-activity.png)

The Copy Activity is powered by a secure, reliable, scalable, and [globally available service](#global). This article provide details on data movement in Data Factory and Copy Activity. First, let's see how data migration occurs between two cloud data stores, and between an on-premises data store and a cloud data store

> [AZURE.NOTE] To learn about activities in general, see [Understanding Pipelines & Activities](data-factory-create-pipelines.md) article.

### Copy data between two cloud data stores
When both the source and sink (destination) data stores reside in the cloud, the copy Activity goes through the following stages to copy/move data from the source to the sink. The service that powers the Copy Activity performs the following: 

1. Reads data from source data store
2. Performs serialization/deserialization, compression/decompression, column mapping, and type conversion based on the configurations of input dataset, output dataset and the Copy Activity 
3.	Writes data to the destination data store

The service automatically chooses the optimal region to perform the data movement, usually the region closest to the sink data store. 

![cloud-to-cloud copy](./media/data-factory-data-movement-activities/cloud-to-cloud.png)


### Copy data between an on-premises data store and a cloud data store
To securely move data between on-premises data stores behind your corporate firewall and a cloud data store, you will need to install the Data Management Gateway, which is an agent that enables hybrid data movement and processing, on your on-premises machine. The Data Management Gateway can be installed on the same machine as the data store itself or on a separate machine that has access to reach the data store. In this scenario, the serialization/deserialization, compression/decompression, column mapping, and type conversion are performed by the Data Management Gateway. Data does not flow through Azure Data Factory service is such case. Data Management Gateway directly writes the data to the destination store. 

![onprem-to-cloud copy](./media/data-factory-data-movement-activities/onprem-to-cloud.png)

See [Move data between on-premises and cloud data stores](data-factory-move-data-between-onprem-and-cloud.md) article for an introduction and a walkthrough and [Data Management Gateway](data-factory-data-management-gateway.md) article for detailed information on Data Management Gateway.

You can also move data from/to supported data stores hosted on Azure IaaS VMs (Infrastructure-as-a-Service virtual machines) using the Data Management Gateway. In this case, the Data Management Gateway can be installed on the same Azure VM as the data store itself or on a separate VM that has access to reach the data store. 

## Supported data stores and formats
Copy Activity copies data from a **source** data store to a **sink** data store. Data factory supports the following data stores and **data from any source can be written to any sink**. Click on a data store to learn how to copy data from/to that store. 

Category | Data store | Supported as source | Supported as sink
:------- | :--------- | :------------------ | :-----------------
Azure | [Azure Blob](data-factory-azure-blob-connector.md) <br/> [Azure Data Lake Store](data-factory-azure-datalake-connector.md) <br/> [Azure SQL Database](data-factory-azure-sql-connector.md) <br/> [Azure SQL Data Warehouse](data-factory-azure-sql-data-warehouse-connector.md) <br/> [Azure Table](data-factory-azure-table-connector.md) <br/> [Azure DocumentDB](data-factory-azure-documentdb-connector.md) <br/> | ✓ <br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓ | ✓ <br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓ 
Databases | [SQL Server](data-factory-sqlserver-connector.md)\* <br/> [Oracle](data-factory-onprem-oracle-connector.md)\* <br/> [MySQL](data-factory-onprem-mysql-connector.md)\* <br/> [DB2](data-factory-onprem-db2-connector.md)\* <br/> [Teradata](data-factory-onprem-teradata-connector.md)\* <br/> [PostgreSQL](data-factory-onprem-postgresql-connector.md)\* <br/> [Sybase](data-factory-onprem-sybase-connector.md)\* <br/>[Cassandra](data-factory-onprem-cassandra-connector.md)\* <br/>[MongoDB](data-factory-on-premises-mongodb-connector.md)\* | ✓ <br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓<br/> ✓ <br/> ✓ <br/> ✓ | ✓ <br/> ✓ <br/> &nbsp; <br/> &nbsp; <br/> &nbsp; <br/> &nbsp;<br/> &nbsp;<br/> &nbsp;<br/> &nbsp; 
File | [File System](data-factory-onprem-file-system-connector.md)\* <br/> [Hadoop Distributed File System (HDFS)](data-factory-hdfs-connector.md)\* | ✓ <br/> ✓ <br/> | ✓ <br/> &nbsp; 
Others | [Salesforce](data-factory-salesforce-connector.md)<br/> [Generic ODBC](data-factory-odbc-connector.md)\* <br/> [Generic OData](data-factory-odata-connector.md) <br/> [Web Table (table from HTML)](data-factory-web-table-connector.md) <br/> [GE Historian](data-factory-odbc-connector.md#ge-historian-store)* | ✓ <br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓  | &nbsp; <br/> &nbsp; <br/> &nbsp; <br/> &nbsp;<br/> &nbsp;<br/> &nbsp;

> [AZURE.NOTE] Data stores with * can be on-premises or on Azure IaaS and require you to install [Data Management Gateway](data-factory-data-management-gateway.md) on an on-premises/Azure IaaS machine. 

If you need to move data to/from a data store that is not supported by the **Copy Activity**, you may use the **custom activity** in Data Factory with your own logic for copying/moving the data. See [Use custom activities in an Azure Data Factory pipeline](data-factory-use-custom-activities.md) article for details on creating and using a custom activity.

### Supported file formats
Copy Activity can copy files as-is between two file-based data stores such as Azure Blob, File System, and Hadoop Distributed File System (HDFS).  To do so, you can skip the [format section](data-factory-create-datasets.md) in both input and output dataset definitions, and the data is copied efficiently without any serialization/deserialization.

Copy Activity also reads from and write to files in specified formats: text, Avro, ORC, and JSON.  Here are some examples of copy activities you can achieve:

-	Copy data in text (CSV) format from Azure Blob and write to Azure SQL
-	Copy files in text (CSV) format from File System on-premises and write to Azure Blob in Avro format
-	Copy data in Azure SQL Database and write to HDFS on-premises in ORC format



## <a name="global"></a>Globally available data movement
The service powering the Copy Activity is available globally in the following regions and geographies even though the Azure Data Factory itself is available only in the West US, East US, and North Europe regions. The globally available topology ensures efficient data movement avoiding cross-region hops in most cases. See [Services by Region](https://azure.microsoft.com/regions/#services) for availability of Data Factory service and the Data Movement in a region. 

### Copy data between cloud data stores
When both the source and sink data stores reside in the cloud, Azure Data Factory uses a service deployment in the region that is closest to the sink location in the same geography to perform the data movement. Refer to the following table for mapping:

Region of the destination data store | Region used for data movement
:----------------------------------- | :----------------------------
East US | East US
East US 2 | East US 2
Central US | Central US
West US | West US
North Central US | North Central US
South Central US | South Central US
North Europe | North Europe
West Europe | West Europe
Southeast Asia | South East Asia
East Asia | South East Asia
Japan East | Japan East
Japan West | Japan East
Brazil South | Brazil South
Australia East | Australia East
Australia Southeast | Australia Southeast


> [AZURE.NOTE] If the region of the destination data store is not in the list above, the Copy Activity will fail instead of going through an alternative region. 

### Copy data between an on-premises data store and a cloud data store
When data is being copied between on-premises (or Azure IaaS VM) and cloud, data movement is performed by [Data Management Gateway](data-factory-data-management-gateway.md) on an on-premises machine or Azure IaaS VM.  The data does not flow through the service in the cloud, unless you use [staged copy](data-factory-copy-activity-performance.md#staged-copy) capability, in which case data flows through the staging Azure Blob storage before being written into the sink data store.


## Create pipeline with copy activity 
You can create a pipeline with a copy activity in a couple of ways:

### Using Copy Wizard
The **Data Factory Copy Wizard** allows you to create a pipeline with a copy activity to copy data from supported sources to destinations **without writing JSON** definitions for linked services, datasets, and pipelines. See [Data Factory Copy Wizard](data-factory-copy-wizard.md) tutorial for details about the wizard.  

### Using JSON scripts
You can use Data Factory Editor in Azure Portal (or) Visual Studio (or) Azure PowerShell to create a JSON definition for a pipeline with copy activity and deploy it to create the pipeline in Data Factory. See [Tutorial: Use Copy Activity in an Azure Data Factory Pipeline](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for a tutorial with step-by-step instructions.    

JSON properties like name, description, input and output tables, policies etc are available for all types of activities. Properties available in the **typeProperties** section of the activity on the other hand vary with each activity type. 

In case of Copy Activity, the **typeProperties** section varies depending on the types of sources and sinks. Click on a source/sink in the [Supported Sources/Sinks](#supported-data-stores) section to learn about type properties supported by the Copy Activity for that data store.   

Here is a sample JSON definition: 

	{
	  "name": "ADFTutorialPipeline",
	  "properties": {
	    "description": "Copy data from Azure blob to Azure SQL table",
	    "activities": [
	      {
	        "name": "CopyFromBlobToSQL",
	        "type": "Copy",
	        "inputs": [
	          {
	            "name": "InputBlobTable"
	          }
	        ],
	        "outputs": [
	          {
	            "name": "OutputSQLTable"
	          }
	        ],
	        "typeProperties": {
	          "source": {
	            "type": "BlobSource"
	          },
	          "sink": {
	            "type": "SqlSink",
	            "writeBatchSize": 10000,
	            "writeBatchTimeout": "60:00:00"
	          }
	        },
	        "Policy": {
	          "concurrency": 1,
	          "executionPriorityOrder": "NewestFirst",
	          "retry": 0,
	          "timeout": "01:00:00"
	        }
	      }
	    ],
	    "start": "2016-07-12T00:00:00Z",
	    "end": "2016-07-13T00:00:00Z"
	  }
	} 

The schedule defined in the output dataset determines when the activity runs (for example **daily**: frequency: day and interval: 1). The activity copies data from one input dataset (**source**) to one output dataset (**sink**). You can specify more than one input dataset to the copy activity and they are used to verify the dependencies before the activity is run but only the data from the first dataset is copied to the destination dataset. See [Scheduling and Execution](data-factory-scheduling-and-execution.md) for more details.  

## Performance & Tuning 
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) article, which describes key factors that impact performance of data movement (Copy Activity) in Azure Data Factory. It also lists the observed performance during internal testing, and discusses various ways to optimize the performance of the Copy Activity.

## Scheduling and sequential copy
See [Scheduling and Execution](data-factory-scheduling-and-execution.md) article for detailed information about how scheduling and execution works in  Data Factory. 

It is possible to run multiple copy operations one after another in a sequential/ordered manner. See [Ordered copy](data-factory-scheduling-and-execution.md#ordered-copy) section in the article. 

## Type conversions 
Different data stores have different native type systems. Copy Activity performs automatic type conversions from source types to sink types with the following 2 step approach:

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

You can find the mapping for a given native type system to .NET for the data store in the respective data store specific articles (click respective link in  the [Supported data stores](#supported-data-stores) table). You can use these mappings to determine appropriate types while creating your tables so that right conversions are performed during Copy Activity.

 
## Next Steps
- See [Copy data from Azure Blob to Azure SQL](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) to learn about how to use Copy Activity to move data from a source data store to a sink data store in general. 
- See [Move data from on-premises to cloud data stores](data-factory-move-data-between-onprem-and-cloud.md) to learn about moving data from an on-premises data store to a cloud data store. 
 
