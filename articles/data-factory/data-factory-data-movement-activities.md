<properties 
	pageTitle="Data movement activities" 
	description="Learn about Data Factory entities that you can use in a Data Factory pipelines to move data." 
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
	ms.date="12/01/2015" 
	ms.author="spelluru"/>

# Data movement activities
The [Copy Activity](#copyactivity) performs the data movement in Azure Data Factory and the activity is powered by a [globally available Data Movement Service](#global) that can copy data between various data stores in a secure, reliable, and scalable way. The service automatically chooses the most optimal region to perform the data movement operation based on the location of the source and sink data stores. Currently the region closest to the sink data store is used.
 
Let’s understand how this data movement occurs in different scenarios.

## Copying data between two cloud data stores
When both the source and sink (destination) data stores reside in the cloud, the copy Activity goes through the following stages to copy/move data from the source to the sink. The data movement service

1. Reads data from source data store
2.	Performs serialization/deserialization, compression/decompression, column mapping, and type conversion based on the configurations of input dataset, output dataset and the Copy Activity 
3.	Writes data to the destination data store

![cloud-to-cloud copy](.\media\data-factory-data-movement-activities\cloud-to-cloud.png)


## Copying data between an on-premises data store and a cloud data store
To [securely move data between on-premises data stores behind your corporate firewall and a cloud data store](#moveonpremtocloud), you will need to install the Data Management Gateway, which is an agent that enables hybrid data movement and processing, on your on-premises machine. The Data Management Gateway can be installed on the same machine as the data store itself or on a separate machine that has access to reach the data store. In this scenario, the serialization/deserialization, compression/decompression, column mapping, and type conversion are performed by the Data Management Gateway. The Data Movement Service is not involved in this scenario. 

![onprem-to-cloud copy](.\media\data-factory-data-movement-activities\onprem-to-cloud.png)

## Copy data from/to a data store on an Azure Iaas VM 
You can also move data from/to supported data stores hosted on Azure IaaS VMs (Infrastructure-as-a-Service virtual machines) using the Data Management Gateway. In this case, the Data Management Gateway can be installed on the same Azure VM as the data store itself or on a separate VM that has access to reach the data store. 

## Supported data stores
Copy Activity copies data from a **source** data store to a **sink** data store. Data factory supports the following data stores and **data can from any source can be written to any sink**. Click on a data store to learn how to copy data from/to that store. 

| Sources| Sinks |
|:------- | :---- |
| <ul><li>[Azure Blob](data-factory-azure-blob-connector.md)</li><li>[Azure Table](data-factory-azure-table-connector.md)</li><li>[Azure SQL Database](data-factory-azure-sql-connector.md)</li><li>[Azure SQL Data Warehouse](data-factory-azure-sql-data-warehouse-connector.md)</li><li>[Azure DocumentDB](data-factory-azure-documentdb-connector.md)</li><li>[Azure Data Lake Store](data-factory-azure-datalake-connector.md)</li><li>[SQL Server on-premises/Azure IaaS](data-factory-sqlserver-connector.md)</li><li>[File System On-premises/Azure IaaS](data-factory-onprem-file-system-connector.md)</li><li>[Oracle Database On-premises/Azure IaaS](data-factory-onprem-oracle-connector.md)</li><li>[MySQL Database On-premises/Azure IaaS ](data-factory-onprem-mysql-connector.md)</li><li>[DB2 Database On-premises/Azure IaaS](data-factory-onprem-db2-connector.md)</li><li>[Teradata Database On-premises/Azure IaaS ](data-factory-onprem-teradata-connector.md)</li><li>[Sybase Database On-premises/Azure IaaS](data-factory-onprem-sybase-connector.md)</li><li>[PostgreSQL Database On-premises/Azure IaaS](data-factory-onprem-postgresql-connector.md)</li></ul> | <ul><li>[Azure Blob](data-factory-azure-blob-connector.md)</li><li>[Azure Table](data-factory-azure-table-connector.md)</li><li>[Azure SQL Database](data-factory-azure-sql-connector.md)</li><li>[Azure SQL Data Warehouse](data-factory-azure-sql-data-warehouse-connector.md)</li><li>[Azure DocumentDB](data-factory-azure-documentdb-connector.md)</li><li>[Azure Data Lake Store](data-factory-azure-datalake-connector.md)</li><li>[SQL Server on-premises/Azure IaaS](data-factory-sqlserver-connector.md)</li><li>[File System On-premises/Azure IaaS](data-factory-onprem-file-system-connector.md)</li></ul> |


## Tutorial
For a quick tutorial on using the Copy Activity, please see [Tutorial: Use Copy Activity in an Azure Data Factory Pipeline](data-factory-get-started.md).  In the tutorial, you will use the Copy Activity to copy data from an Azure blob storage to an Azure SQL database. The following section lists all the sources and sinks supported by the Copy Activity. 

## <a name="copyactivity"></a>Copy Activity
Copy Activity takes one input dataset (**source**) and one output dataset (**sink**). Data copy is done in a batch fashion according to the schedule specified on the activity. To learn about defining activities in general at a high level such as various JSON sections and properties available for all activities, see [Understanding Pipelines & Activities](data-factory-create-pipelines.md) article.

Copy Activity provides the following capabilities:

### <a name="global"></a>Globally available data movement
Even though the Azure Data Factory itself is available only in the West US and North Europe regions, the data movement service powering the Copy Activity is available globally in the following regions and geographies. The globally available topology ensures efficient data movement avoiding cross-region hops in most cases.

| Region | Geography |
| ------ | --------- | 
| Central US | US |
| East US | US |
| East US2 | US |
| North Central US | US |
| South Central US | US |
| West US | US |
| Brazil South | LATAM |
| North Europe | EMEA |
| West Europe | EMEA |
| Southeast Asia | APAC |
| Japan East | APAC |

Note the following: 

- If you are copying data from an **on-premises data source** to **cloud** or vice-versa (for example: on-premises SQL Server -> Azure Blob), the data movement is actually done by the **Data Management Gateway** in your on-premises environment with no involvement from the Data Movement Service.
- If you are copying from a **cloud source** to a **cloud destination** (for example: Azure Blob -> Azure SQL), the **Data Movement Service** picks the deployment that is **closest to the sink location in the same geography** to do the transfer. For example, if you are copying from South East Asia to Japan West, the Data Movement Service deployment in Japan East is used to perform the copy. When source and destination are both in the same geography, and there is no Data Movement service available in that geography (for example Australia currently), the Copy Activity will fail instead of going through an alternative geography. Note: the data movement service would be extended to Australia too. 

### <a name="moveonpremtocloud"></a>Securely move data between on-premises location and cloud
One of the challenges for modern data integration is to seamlessly move data to and from on-premises to cloud. Data management gateway is an agent you can install on-premises to enable hybrid data pipelines. 

The data gateway provides the following capabilities: 

1.	Manage access to on-premises data stores securely.
2.	Model on-premises data stores and cloud data stores within the same data factory and move data.
3.	Have a single pane of glass for monitoring and management with visibility into gateway status with data factory cloud based dashboard.

You should treat your data source as an on-premises data source (that is behind a firewall) even when you use **ExpressRoute** and **use the gateway** to establish connectivity between the service and the data source. 

See [Move data between on-premises and cloud](data-factory-move-data-between-onprem-and-cloud.md) for more details.

### Reliable and cost effective data movement
Copy Activity is designed to move large volumes of data in a reliable way, resistant to transient errors across a large variety of data sources. Data can be copied in a cost effective way with the option to enable compression over the wire.

### Type conversions across different type systems
Different data stores have different native type systems. Copy Activity performs automatic type conversions from source types to sink types with the following 2 step approach:

1. Convert from native source types to .NET type
2. Convert from .NET type to native sink type

You can find the mapping for a given native type system to .NET for the data store in the respective data store connector articles. You can use these mappings to determine appropriate types while creating your tables so that right conversions are performed during Copy Activity.

### Working with different file formats
Copy Activity supports a variety of file formats including binary, text and Avro formats for file based stores. You can use the Copy Activity to convert data from one format to another. Example: text (CSV) to Avro.  If the data is unstructured, you can omit the **Structure** property in the JSON definition of the [dataset](data-factory-create-datasets.md). 

### Copy Activity properties
Properties like name, description, input and output tables, various policies etc are available for all types of activities. Properties available in the **typeProperties** section of the activity on the other hand vary with each activity type. 

In case of Copy Activity the **typeProperties** section varies depending on the types of sources and sinks. Each of the data store specific page listed above documents these properties specific to the data store type.


### Copy Activity Performance & Tuning 
See [Copy Activity Performance & Tuning Guide](data-factory-copy-activity-performance.md) article, which describes key factors that impact performance of data movement (Copy Activity) in Azure Data Factory. It also lists the observed performance during internal testing, and discusses various ways to optimize the performance of the Copy Activity.