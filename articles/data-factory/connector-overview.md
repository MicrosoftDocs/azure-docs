---
title: Connector overview 
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn the supported connectors in Azure Data Factory and Azure Synapse Analytics pipelines.
author: jianleishen
ms.subservice: data-movement
ms.custom: synapse
ms.topic: concept-article
ms.date: 09/30/2025
ms.author: jianleishen
---

# Azure Data Factory and Azure Synapse Analytics connector overview

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

Azure Data Factory and Azure Synapse Analytics pipelines support the following data stores and formats via Copy, Data Flow, Look up, Get Metadata, and Delete activities. Select each data store to learn the supported capabilities and the corresponding configurations in details.

## Supported data stores

[!INCLUDE [Connector overview](includes/data-factory-v2-connector-overview.md)]

## Integrate with more data stores

Azure Data Factory and Synapse pipelines can reach broader set of data stores than the list mentioned above. If you need to move data to/from a data store that isn't in the service built-in connector list, here are some extensible options:
- For database and data warehouse, usually you can find a corresponding ODBC driver, with which you can use [generic ODBC connector](connector-odbc.md).
- For SaaS applications:
    - If it provides RESTful APIs, you can use [generic REST connector](connector-rest.md).
    - If it has OData feed, you can use [generic OData connector](connector-odata.md).
    - If it provides SOAP APIs, you can use [generic HTTP connector](connector-http.md).
    - If it has ODBC driver, you can use [generic ODBC connector](connector-odbc.md).
- For others, check if you can load data to or expose data as any supported data stores, for example, Azure Blob/File/FTP/SFTP/etc, then let the service pick up from there. You can invoke custom data loading mechanism via [Azure Function](control-flow-azure-function-activity.md), [Custom activity](transform-data-using-dotnet-custom-activity.md), [Databricks](transform-data-databricks-notebook.md)/[HDInsight](transform-data-using-hadoop-hive.md), [Web activity](control-flow-web-activity.md), etc.

## Supported file formats

The following file formats are supported. Refer to each article for format-based settings.

- [Avro format](format-avro.md)
- [Binary format](format-binary.md)
- [Common Data Model format](format-common-data-model.md)
- [Delimited text format](format-delimited-text.md)
- [Delta format](format-delta.md)
- [Excel format](format-excel.md)
- [Iceberg format](format-iceberg.md)
- [JSON format](format-json.md)
- [ORC format](format-orc.md)
- [Parquet format](format-parquet.md)
- [XML format](format-xml.md)

## Support TLS 1.3

Transport Layer Security (TLS) is a widely adopted security protocol that's designed to secure connections and communications between servers and clients. In Azure App Service, you can use TLS and Secure Sockets Layer (SSL) certificates to help secure incoming requests in your web apps. TLS 1.3 is the latest and most secure version. For more information, see this [article](/azure/app-service/overview-tls). The following connectors support TLS 1.3 for Copy activity:
 
- [Amazon RDS for SQL Server (version 2.0)](connector-amazon-rds-for-sql-server.md)
- [Azure Data Explorer](connector-azure-data-explorer.md)
- [Azure Database for PostgreSQL (version 2.0)](connector-azure-database-for-postgresql.md)
- [Azure File Storage](connector-azure-file-storage.md)
- [Azure SQL Database (version 2.0)](connector-azure-sql-database.md)
- [Azure SQL Managed Instance (version 2.0)](connector-azure-sql-managed-instance.md)
- [Azure Synapse Analytics (version 2.0)](connector-azure-sql-data-warehouse.md)
- [Azure Table Storage](connector-azure-table-storage.md)
- [DB2](connector-db2.md)
- [Oracle (version 2.0)](connector-oracle.md)
- [PostgreSQL V2](connector-postgresql.md)
- [Snowflake V2](connector-snowflake.md)
- [SQL Server (version 2.0)](connector-sql-server.md)


## Related content

- [Copy activity](copy-activity-overview.md)
- [Mapping Data Flow](concepts-data-flow-overview.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Delete Activity](delete-activity.md)
