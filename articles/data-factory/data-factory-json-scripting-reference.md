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
The following sections provide links to sections in other articles that have JSON schemas specific to the store or compute. 

## Data stores
Click the link for the store you are interested in to see the JSON schemas for linked service, dataset, and the source/sink for the copy activity.

| Category | Data store 
|:--- |:--- |
| **Azure** |[Azure Blob storage](data-factory-azure-blob-connector.md#linked-service-properties) |
| &nbsp; |[Azure Data Lake Store](data-factory-azure-datalake-connector.md#linked-service-properties) |
| &nbsp; |[Azure DocumentDB](data-factory-azure-documentdb-connector.md#linked-service-properties) |
| &nbsp; |[Azure SQL Database](data-factory-azure-sql-connector.md#linked-service-properties) |
| &nbsp; |[Azure SQL Data Warehouse](data-factory-azure-sql-data-warehouse-connector.md#linked-service-properties) |
| &nbsp; |[Azure Search Index](data-factory-azure-search-connector.md#linked-service-properties) |
| &nbsp; |[Azure Table storage](data-factory-azure-table-connector.md#linked-service-properties) |
| **Databases** |[Amazon Redshift](data-factory-amazon-redshift-connector.md#linked-service-properties) |
| &nbsp; |[DB2](data-factory-onprem-db2-connector.md#linked-service-properties) |
| &nbsp; |[MySQL](data-factory-onprem-mysql-connector.md#linked-service-properties) |
| &nbsp; |[Oracle](data-factory-onprem-oracle-connector.md#linked-service-properties) |
| &nbsp; |[PostgreSQL](data-factory-onprem-postgresql-connector.md#linked-service-properties) |
| &nbsp; |[SAP Business Warehouse](data-factory-sap-business-warehouse-connector.md#linked-service-properties) |
| &nbsp; |[SAP HANA](data-factory-sap-hana-connector.md#linked-service-properties) |
| &nbsp; |[SQL Server](data-factory-sqlserver-connector.md#linked-service-properties) |
| &nbsp; |[Sybase](data-factory-onprem-sybase-connector.md#linked-service-properties) |
| &nbsp; |[Teradata](data-factory-onprem-teradata-connector.md#linked-service-properties) |
| **NoSQL** |[Cassandra](data-factory-onprem-cassandra-connector.md#linked-service-properties) |
| &nbsp; |[MongoDB](data-factory-on-premises-mongodb-connector.md#linked-service-properties) |
| **File** |[Amazon S3](data-factory-amazon-simple-storage-service-connector.md#linked-service-properties) |
| &nbsp; |[File System](data-factory-onprem-file-system-connector.md#linked-service-properties) |
| &nbsp; |[FTP](data-factory-ftp-connector.md#linked-service-properties) |
| &nbsp; |[HDFS](data-factory-hdfs-connector.md#linked-service-properties) |
| &nbsp; |[SFTP](data-factory-sftp-connector.md#linked-service-properties) |
| **Others** |[Generic HTTP](data-factory-http-connector.md#linked-service-properties) |
| &nbsp; |[Generic OData](data-factory-odata-connector.md#linked-service-properties) |
| &nbsp; |[Generic ODBC](data-factory-odbc-connector.md#linked-service-properties) |
| &nbsp; |[Salesforce](data-factory-salesforce-connector.md#linked-service-properties) |
| &nbsp; |[Web Table (table from HTML)](data-factory-web-table-connector.md#linked-service-properties) |


## Computes
Click the link for the compute you are interested in to see the JSON schemas for linked service to link it to a data factory.

| Compute environment | activities |
| --- | --- |
| [On-demand HDInsight cluster](#azure-hdinsight-on-demand-linked-service) or [your own HDInsight cluster](#azure-hdinsight-linked-service) |[DotNet](data-factory-use-custom-activities.md), [Hive](data-factory-hive-activity.md), [Pig](data-factory-pig-activity.md), [MapReduce](data-factory-map-reduce.md), [Hadoop Streaming](data-factory-hadoop-streaming-activity.md) |
| [Azure Batch](#azure-batch-linked-service) |[DotNet](data-factory-use-custom-activities.md) |
| [Azure Machine Learning](#azure-machine-learning-linked-service) |[Machine Learning activities: Batch Execution and Update Resource](data-factory-azure-ml-batch-execution-activity.md) |
| [Azure Data Lake Analytics](#azure-data-lake-analytics-linked-service) |[Data Lake Analytics U-SQL](data-factory-usql-activity.md) |
| [Azure SQL](#azure-sql-linked-service), [Azure SQL Data Warehouse](#azure-sql-data-warehouse-linked-service), [SQL Server](#sql-server-linked-service) |[Stored Procedure](data-factory-stored-proc-activity.md) |
