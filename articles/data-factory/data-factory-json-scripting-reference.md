---
title: Data Factory - JSON Scripting Reference | Microsoft Docs
description: Provides JSON schemas for Data Factory entities. 
services: data-factory
documentationcenter: ''
author: spelluru
manager: jhubbard
editor: 

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 03/28/2017
ms.author: spelluru

---
# Azure Data Factory - JSON Scripting Reference
The following sections provide links to sections in other articles that has JSON schemas specific to the store or compute. 

## Data stores
Click the link for the store you are interested in to see the JSON schemas for linked service, dataset, and the source/sink for the copy activity.

| Category | Data store 
|:--- |:--- |
| **Azure** |[Azure Blob storage](../articles/data-factory/data-factory-azure-blob-connector.mdlinked-service-properties) |
| &nbsp; |[Azure Data Lake Store](../articles/data-factory/data-factory-azure-datalake-connector.md#linked-service-properties) |
| &nbsp; |[Azure DocumentDB](../articles/data-factory/data-factory-azure-documentdb-connector.md#linked-service-properties) |
| &nbsp; |[Azure SQL Database](../articles/data-factory/data-factory-azure-sql-connector.md#linked-service-properties) |
| &nbsp; |[Azure SQL Data Warehouse](../articles/data-factory/data-factory-azure-sql-data-warehouse-connector.md#linked-service-properties) |
| &nbsp; |[Azure Search Index](../articles/data-factory/data-factory-azure-search-connector.md#linked-service-properties) |
| &nbsp; |[Azure Table storage](../articles/data-factory/data-factory-azure-table-connector.md#linked-service-properties) |
| **Databases** |[Amazon Redshift](../articles/data-factory/data-factory-amazon-redshift-connector.md#linked-service-properties) |
| &nbsp; |[DB2](../articles/data-factory/data-factory-onprem-db2-connector.md#linked-service-properties) |
| &nbsp; |[MySQL](../articles/data-factory/data-factory-onprem-mysql-connector.md#linked-service-properties) |
| &nbsp; |[Oracle](../articles/data-factory/data-factory-onprem-oracle-connector.md#linked-service-properties) |
| &nbsp; |[PostgreSQL](../articles/data-factory/data-factory-onprem-postgresql-connector.md#linked-service-properties) |
| &nbsp; |[SAP Business Warehouse](../articles/data-factory/data-factory-sap-business-warehouse-connector.md#linked-service-properties) |
| &nbsp; |[SAP HANA](../articles/data-factory/data-factory-sap-hana-connector.md#linked-service-properties) |
| &nbsp; |[SQL Server](../articles/data-factory/data-factory-sqlserver-connector.md#linked-service-properties) |
| &nbsp; |[Sybase](../articles/data-factory/data-factory-onprem-sybase-connector.md#linked-service-properties) |
| &nbsp; |[Teradata](../articles/data-factory/data-factory-onprem-teradata-connector.md#linked-service-properties) |
| **NoSQL** |[Cassandra](../articles/data-factory/data-factory-onprem-cassandra-connector.md#linked-service-properties) |
| &nbsp; |[MongoDB](../articles/data-factory/data-factory-on-premises-mongodb-connector.md#linked-service-properties) |
| **File** |[Amazon S3](../articles/data-factory/data-factory-amazon-simple-storage-service-connector.md#linked-service-properties) |
| &nbsp; |[File System](../articles/data-factory/data-factory-onprem-file-system-connector.md#linked-service-properties) |
| &nbsp; |[FTP](../articles/data-factory/data-factory-ftp-connector.md#linked-service-properties) |
| &nbsp; |[HDFS](../articles/data-factory/data-factory-hdfs-connector.md#linked-service-properties) |
| &nbsp; |[SFTP](../articles/data-factory/data-factory-sftp-connector.md#linked-service-properties) |
| **Others** |[Generic HTTP](../articles/data-factory/data-factory-http-connector.md#linked-service-properties) |
| &nbsp; |[Generic OData](../articles/data-factory/data-factory-odata-connector.md#linked-service-properties) |
| &nbsp; |[Generic ODBC](../articles/data-factory/data-factory-odbc-connector.md#linked-service-properties) |
| &nbsp; |[Salesforce](../articles/data-factory/data-factory-salesforce-connector.md#linked-service-properties) |
| &nbsp; |[Web Table (table from HTML)](../articles/data-factory/data-factory-web-table-connector.md#linked-service-properties) |


## Computes
Click the link for the compute you are interested in to see the JSON schemas for linked service to link it to a data factory.

| Compute environment | activities |
| --- | --- |
| [On-demand HDInsight cluster](#azure-hdinsight-on-demand-linked-service) or [your own HDInsight cluster](#azure-hdinsight-linked-service) |[DotNet](data-factory-use-custom-activities.md), [Hive](data-factory-hive-activity.md), [Pig](data-factory-pig-activity.md), [MapReduce](data-factory-map-reduce.md), [Hadoop Streaming](data-factory-hadoop-streaming-activity.md) |
| [Azure Batch](#azure-batch-linked-service) |[DotNet](data-factory-use-custom-activities.md) |
| [Azure Machine Learning](#azure-machine-learning-linked-service) |[Machine Learning activities: Batch Execution and Update Resource](data-factory-azure-ml-batch-execution-activity.md) |
| [Azure Data Lake Analytics](#azure-data-lake-analytics-linked-service) |[Data Lake Analytics U-SQL](data-factory-usql-activity.md) |
| [Azure SQL](#azure-sql-linked-service), [Azure SQL Data Warehouse](#azure-sql-data-warehouse-linked-service), [SQL Server](#sql-server-linked-service) |[Stored Procedure](data-factory-stored-proc-activity.md) |
