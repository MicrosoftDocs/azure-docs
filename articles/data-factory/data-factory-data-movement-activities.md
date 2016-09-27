<properties
	pageTitle="Move data by using Copy Activity | Microsoft Azure"
	description="Learn about data movement in Data Factory pipelines: data migration between cloud stores, and between an on-premises store and a cloud store. Use Copy Activity."
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

# Move data by using Copy Activity

## Overview
In Azure Data Factory, you can use Copy Activity to copy data of different shapes from various on-premises and cloud data sources to Azure. After data is copied, it can be further transformed and analyzed. You can also use Copy Activity to publish transformation and analysis results for business intelligence (BI) and application consumption.

![Role of Copy Activity](media/data-factory-data-movement-activities/copy-activity.png)

Copy Activity is powered by a secure, reliable, scalable, and [globally available service](#global). This article provides details on data movement in Data Factory and Copy Activity.

First, let's see how data migration occurs between two cloud data stores, and between an on-premises data store and a cloud data store.

> [AZURE.NOTE] To learn about activities in general, see [Understanding pipelines and activities](data-factory-create-pipelines.md).

### Copy data between two cloud data stores
When both source and sink data stores are in the cloud, Copy Activity goes through the following stages to copy data from the source to the sink. The service that powers Copy Activity:

1. Reads data from the source data store.
2. Performs serialization/deserialization, compression/decompression, column mapping, and type conversion. It does these operations based on the configurations of the input dataset, output dataset, and Copy Activity.
3.	Writes data to the destination data store.

The service automatically chooses the optimal region to perform the data movement. This region is usually the one closest to the sink data store.

![Cloud-to-cloud copy](./media/data-factory-data-movement-activities/cloud-to-cloud.png)


### Copy data between an on-premises data store and a cloud data store
To securely move data between an on-premises data store and a cloud data store, install Data Management Gateway on your on-premises machine. Data Management Gateway is an agent that enables hybrid data movement and processing. You can install it on the same machine as the data store itself, or on a separate machine that has access to the data store.

In this scenario, Data Management Gateway performs the serialization/deserialization, compression/decompression, column mapping, and type conversion. Data does not flow through the Azure Data Factory service. Instead, Data Management Gateway directly writes the data to the destination store.

![On-premises-to-cloud copy](./media/data-factory-data-movement-activities/onprem-to-cloud.png)

See [Move data between on-premises and cloud data stores](data-factory-move-data-between-onprem-and-cloud.md) for an introduction and walkthrough. See [Data Management Gateway](data-factory-data-management-gateway.md) for detailed information about this agent.

You can also move data from/to supported data stores that are hosted on Azure IaaS virtual machines (VMs) by using Data Management Gateway. In this case, you can install Data Management Gateway on the same VM as the data store itself, or on a separate VM that has access to the data store.

## Supported data stores and formats
Copy Activity copies data from a source data store to a sink data store. Data Factory supports the following data stores. Data from any source can be written to any sink. Click a data store to learn how to copy data to and from that store.

Category | Data store | Supported as a source | Supported as a sink
:------- | :--------- | :------------------ | :-----------------
Azure | [Azure Blob storage](data-factory-azure-blob-connector.md) <br/> [Azure Data Lake Store](data-factory-azure-datalake-connector.md) <br/> [Azure SQL Database](data-factory-azure-sql-connector.md) <br/> [Azure SQL Data Warehouse](data-factory-azure-sql-data-warehouse-connector.md) <br/> [Azure Table storage](data-factory-azure-table-connector.md) <br/> [Azure DocumentDB](data-factory-azure-documentdb-connector.md) <br/> | ✓ <br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓ | ✓ <br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓
Databases | [SQL Server](data-factory-sqlserver-connector.md)\* <br/> [Oracle](data-factory-onprem-oracle-connector.md)\* <br/> [MySQL](data-factory-onprem-mysql-connector.md)\* <br/> [DB2](data-factory-onprem-db2-connector.md)\* <br/> [Teradata](data-factory-onprem-teradata-connector.md)\* <br/> [PostgreSQL](data-factory-onprem-postgresql-connector.md)\* <br/> [Sybase](data-factory-onprem-sybase-connector.md)\* <br/>[Cassandra](data-factory-onprem-cassandra-connector.md)\* <br/>[MongoDB](data-factory-on-premises-mongodb-connector.md)\*<br/>[Amazon Redshift](data-factory-amazon-redshift-connector.md) | ✓ <br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓<br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓ | ✓ <br/> ✓ <br/> &nbsp; <br/> &nbsp; <br/> &nbsp; <br/> &nbsp;<br/> &nbsp;<br/> &nbsp;<br/> &nbsp; <br/>&nbsp;
File | [File System](data-factory-onprem-file-system-connector.md)\* <br/> [HDFS](data-factory-hdfs-connector.md)\* <br/> [Amazon S3](data-factory-amazon-simple-storage-service-connector.md) | ✓ <br/> ✓ <br/> ✓ | ✓ <br/> &nbsp;<br/>&nbsp;
Others | [Salesforce](data-factory-salesforce-connector.md)<br/> [Generic ODBC](data-factory-odbc-connector.md)\* <br/> [Generic OData](data-factory-odata-connector.md) <br/> [Web Table (table from HTML)](data-factory-web-table-connector.md) <br/> [GE Historian](data-factory-odbc-connector.md#ge-historian-store)* | ✓ <br/> ✓ <br/> ✓ <br/> ✓ <br/> ✓  | &nbsp; <br/> &nbsp; <br/> &nbsp; <br/> &nbsp;<br/> &nbsp;<br/> &nbsp;

> [AZURE.NOTE] Data stores with * can be on-premises or on Azure IaaS, and require you to install [Data Management Gateway](data-factory-data-management-gateway.md) on an on-premises/Azure IaaS machine.

If you need to move data to/from a data store that Copy Activity doesn't support, use a **custom activity** in Data Factory with your own logic for copying/moving data. For details on creating and using a custom activity, see [Use custom activities in an Azure Data Factory pipeline](data-factory-use-custom-activities.md).

### Supported file formats
You can use Copy Activity to copy files as-is between two file-based data stores, such as Azure Blob, File System, and HDFS. To do so, you can skip the [format section](data-factory-create-datasets.md) in both the input and output dataset definitions. The data is copied efficiently without any serialization/deserialization.

Copy Activity also reads from and writes to files in specified formats: text, Avro, ORC, and JSON. You can do the following copy activities, for example:

-	Copy data in text (CSV) format from Azure Blob and write to Azure SQL Database.
-	Copy files in text (CSV) format from File System on-premises and write to Azure Blob in Avro format.
-	Copy data in Azure SQL Database and write to HDFS on-premises in ORC format.



## <a name="global"></a>Globally available data movement
Azure Data Factory is available only in the West US, East US, and North Europe regions. However, the service that powers Copy Activity is available globally in the following regions and geographies. The globally available topology ensures efficient data movement that usually avoids cross-region hops. See [Services by region](https://azure.microsoft.com/regions/#services) for availability of Data Factory and Data Movement in a region.

### Copy data between cloud data stores
When both source and sink data stores are in the cloud, Data Factory uses a service deployment in the region that is closest to the sink in the same geography to move the data. Refer to the following table for mapping:

Region of the destination data store | Region used for data movement
:----------------------------------- | :----------------------------
East US | East US
East US 2 | East US 2
West US | West US
West US 2 | West US
Central US | Central US
West Central US | Central US
North Central US | North Central US
South Central US | South Central US
North Europe | North Europe
West Europe | West Europe
Southeast Asia | Southeast Asia
East Asia | Southeast Asia
Japan East | Japan East
Japan West | Japan East
Brazil South | Brazil South
Australia East | Australia East
Australia Southeast | Australia Southeast
Central India | Central India
South India | Central India
West India | Central India


> [AZURE.NOTE] If the region of the destination data store is not in the preceding list, Copy Activity fails instead of going through an alternative region.

### Copy data between an on-premises data store and a cloud data store
When data is being copied between on-premises (or Azure virtual machines/IaaS) and cloud stores, [Data Management Gateway](data-factory-data-management-gateway.md) performs data movement on an on-premises machine or virtual machine. The data does not flow through the service in the cloud, unless you use the [staged copy](data-factory-copy-activity-performance.md#staged-copy) capability. In this case, data flows through the staging Azure Blob storage before it is written into the sink data store.

## Create a pipeline with Copy Activity
You can create a pipeline with Copy Activity in a couple of ways:

### By using the Copy Wizard
The Data Factory Copy Wizard helps you to create a pipeline with Copy Activity. This pipeline allows you to copy data from supported sources to destinations *without writing JSON* definitions for linked services, datasets, and pipelines. See [Data Factory Copy Wizard](data-factory-copy-wizard.md) for details about the wizard.  

### By using JSON scripts
You can use Data Factory Editor in the Azure portal, Visual Studio, or Azure PowerShell to create a JSON definition for a pipeline (by using Copy Activity). Then, you can deploy it to create the pipeline in Data Factory. See [Tutorial: Use Copy Activity in an Azure Data Factory pipeline](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md) for a tutorial with step-by-step instructions.    

JSON properties (such as name, description, input and output tables, and policies) are available for all types of activities. Properties that are available in the `typeProperties` section of the activity vary with each activity type.

For Copy Activity, the `typeProperties` section varies depending on the types of sources and sinks. Click a source/sink in the [Supported sources and sinks](#supported-data-stores) section to learn about type properties that Copy Activity supports for that data store.   

Here's a sample JSON definition:

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

The schedule that is defined in the output dataset determines when the activity runs (for example: **daily**, frequency as **day**, and interval as **1**). The activity copies data from an input dataset (**source**) to an output dataset (**sink**).

You can specify more than one input dataset to Copy Activity. They are used to verify the dependencies before the activity is run. However, only the data from the first dataset is copied to the destination dataset. For more details, see [Scheduling and execution](data-factory-scheduling-and-execution.md).  

## Performance and tuning
See the [Copy Activity performance and tuning guide](data-factory-copy-activity-performance.md), which describes key factors that affect the performance of data movement (Copy Activity) in Azure Data Factory. It also lists the observed performance during internal testing and discusses various ways to optimize the performance of Copy Activity.

## Scheduling and sequential copy
See [Scheduling and execution](data-factory-scheduling-and-execution.md) for detailed information about how scheduling and execution works in Data Factory. It is possible to run multiple copy operations one after another in a sequential/ordered manner. See the [Ordered copy](data-factory-scheduling-and-execution.md#ordered-copy) section.

## Type conversions
Different data stores have different native type systems. Copy Activity performs automatic type conversions from source types to sink types with the following two-step approach:

1. Convert from native source types to a .NET type.
2. Convert from a .NET type to a native sink type.

The mapping for a native type system to a .NET type for a data store is in the respective data store article. (Click the specific link in the [Supported data stores](#supported-data-stores) table). You can use these mappings to determine appropriate types while creating your tables, so that Copy Activity performs the right conversions.


## Next steps
- To learn about the Copy Activity more, see [Copy data from Azure Blob storage to Azure SQL Database](data-factory-copy-data-from-azure-blob-storage-to-sql-database.md).
- To learn about moving data from an on-premises data store to a cloud data store, see [Move data from on-premises to cloud data stores](data-factory-move-data-between-onprem-and-cloud.md).
