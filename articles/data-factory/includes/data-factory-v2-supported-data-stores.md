---
title: include file
description: include file
author: jianleishen
ms.topic: include
ms.date: 07/12/2024
ms.author: jianleishen
ms.custom: include file
---

| Category | Data store | Supported as a source | Supported as a sink | Supported by [Azure IR](../concepts-integration-runtime.md#azure-integration-runtime) | Supported by [self-hosted IR](../concepts-integration-runtime.md#self-hosted-integration-runtime) |
|:--- |:--- |:--- |:--- |:--- |:--- |
| **Azure** |[Azure Blob storage](../connector-azure-blob-storage.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Azure AI Search index](../connector-azure-search.md) | |✓ |✓ |✓  |
| &nbsp; |[Azure Cosmos DB for NoSQL](../connector-azure-cosmos-db.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Azure Cosmos DB for MongoDB](../connector-azure-cosmos-db-mongodb-api.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Azure Data Explorer](../connector-azure-data-explorer.md) |✓ |✓ |✓ |✓ |
| &nbsp; |[Azure Data Lake Storage Gen1](../connector-azure-data-lake-store.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Azure Data Lake Storage Gen2](../connector-azure-data-lake-storage.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Azure Database for MariaDB](../connector-azure-database-for-mariadb.md) |✓ | |✓ |✓  |
| &nbsp; |[Azure Database for MySQL](../connector-azure-database-for-mysql.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Azure Database for PostgreSQL](../connector-azure-database-for-postgresql.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Azure Databricks Delta Lake](../connector-azure-databricks-delta-lake.md) |✓ |✓ |✓ |✓ |
| &nbsp; |[Azure Files](../connector-azure-file-storage.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Azure SQL Database](../connector-azure-sql-database.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Azure SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview) |✓ |✓ |✓ |✓  |
| &nbsp; |[Azure Synapse Analytics](../connector-azure-sql-data-warehouse.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Azure Table storage](../connector-azure-table-storage.md) |✓ |✓ |✓ |✓  |
| **Database** |[Amazon RDS for Oracle](../connector-amazon-rds-for-oracle.md) |✓ | |✓ |✓  |
| &nbsp; |[Amazon RDS for SQL Server](../connector-amazon-rds-for-sql-server.md) |✓ | |✓ |✓  |
| &nbsp; |[Amazon Redshift](../connector-amazon-redshift.md) |✓ | |✓ |✓  |
| &nbsp; |[DB2](../connector-db2.md) |✓ | |✓ |✓  |
| &nbsp; |[Drill](../connector-drill.md) |✓ | |✓ |✓  |
| &nbsp; |[Google BigQuery](../connector-google-bigquery.md) |✓ | |✓ |✓  |
| &nbsp; |[Greenplum](../connector-greenplum.md) |✓ | |✓ |✓  |
| &nbsp; |[HBase](../connector-hbase.md) |✓ | |✓ |✓  |
| &nbsp; |[Hive](../connector-hive.md) |✓ | |✓ |✓  |
| &nbsp; |[Apache Impala](../connector-impala.md) |✓ | |✓ |✓  |
| &nbsp; |[Informix](../connector-informix.md) |✓ |✓ | |✓  |
| &nbsp; |[MariaDB](../connector-mariadb.md) |✓ | |✓ |✓  |
| &nbsp; |[Microsoft Access](../connector-microsoft-access.md) |✓ |✓ | |✓  |
| &nbsp; |[MySQL](../connector-mysql.md) |✓ | |✓ |✓  |
| &nbsp; |[Netezza](../connector-netezza.md) |✓ | |✓ |✓  |
| &nbsp; |[Oracle](../connector-oracle.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Phoenix](../connector-phoenix.md) |✓ | |✓ |✓  |
| &nbsp; |[PostgreSQL](../connector-postgresql.md) |✓ | |✓ |✓  |
| &nbsp; |[Presto](../connector-presto.md) |✓ | |✓ |✓  |
| &nbsp; |[SAP Business Warehouse via Open Hub](../connector-sap-business-warehouse-open-hub.md) |✓ | | |✓  |
| &nbsp; |[SAP Business Warehouse via MDX](../connector-sap-business-warehouse.md) |✓ | | |✓  |
| &nbsp; |[SAP HANA](../connector-sap-hana.md) |✓ | Sink supported only with the [ODBC Connector and the SAP HANA ODBC driver](../connector-sap-hana.md#sap-hana-sink) | |✓  |
| &nbsp; |[SAP table](../connector-sap-table.md) |✓ | | |✓  |
| &nbsp; |[Snowflake](../connector-snowflake.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Spark](../connector-spark.md) |✓ | |✓ |✓  |
| &nbsp; |[SQL Server](../connector-sql-server.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Sybase](../connector-sybase.md) |✓ | | |✓  |
| &nbsp; |[Teradata](../connector-teradata.md) |✓ | |✓ |✓  |
| &nbsp; |[Vertica](../connector-vertica.md) |✓ | |✓ |✓  |
| **NoSQL** |[Cassandra](../connector-cassandra.md) |✓ | |✓ |✓  |
| &nbsp; |[Couchbase (Preview)](../connector-couchbase.md) |✓ | |✓ |✓  |
| &nbsp; |[MongoDB](../connector-mongodb.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[MongoDB Atlas](../connector-mongodb-atlas.md) |✓ |✓ |✓ |✓  |
| **File** |[Amazon S3](../connector-amazon-simple-storage-service.md) |✓ | |✓ |✓  |
| &nbsp; |[Amazon S3 Compatible Storage](../connector-amazon-s3-compatible-storage.md) |✓ | |✓ |✓  |
| &nbsp; |[File system](../connector-file-system.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[FTP](../connector-ftp.md) |✓ | |✓ |✓  |
| &nbsp; |[Google Cloud Storage](../connector-google-cloud-storage.md) |✓ | |✓ |✓  |
| &nbsp; |[HDFS](../connector-hdfs.md) |✓ | |✓ |✓  |
| &nbsp; |[Oracle Cloud Storage](../connector-oracle-cloud-storage.md) |✓ | |✓ |✓  |
| &nbsp; |[SFTP](../connector-sftp.md) |✓ |✓ |✓ |✓  |
| **Generic protocol** |[Generic HTTP](../connector-http.md) |✓ | |✓ |✓  |
| &nbsp; |[Generic OData](../connector-odata.md) |✓ | |✓ |✓  |
| &nbsp; |[Generic ODBC](../connector-odbc.md) |✓ |✓ | |✓  |
| &nbsp; |[Generic REST](../connector-rest.md) |✓ | ✓ |✓ |✓  |
| **Services and apps** |[Amazon Marketplace Web Service (Deprecated)](../connector-amazon-marketplace-web-service.md) | | | |  |
| &nbsp; |[Concur (Preview)](../connector-concur.md) |✓ | |✓ |✓  |
| &nbsp; |[Dataverse](../connector-dynamics-crm-office-365.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Dynamics 365](../connector-dynamics-crm-office-365.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Dynamics AX](../connector-dynamics-ax.md) |✓ | |✓ |✓  |
| &nbsp; |[Dynamics CRM](../connector-dynamics-crm-office-365.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Google AdWords](../connector-google-adwords.md) |✓ | |✓ |✓  |
| &nbsp; |[HubSpot](../connector-hubspot.md) |✓ | |✓ |✓  |
| &nbsp; |[Jira](../connector-jira.md) |✓ | |✓ |✓  |
| &nbsp; |[Magento (Preview)](../connector-magento.md) |✓ | |✓ |✓  |
| &nbsp; |[Marketo (Preview)](../connector-marketo.md) |✓ | |✓ |✓  |
| &nbsp; |[Microsoft 365](../connector-office-365.md) |✓ | |✓ |✓  |
| &nbsp; |[Oracle Eloqua (Preview)](../connector-oracle-eloqua.md) |✓ | |✓ |✓  |
| &nbsp; |[Oracle Responsys (Preview)](../connector-oracle-responsys.md) |✓ | |✓ |✓  |
| &nbsp; |[Oracle Service Cloud (Preview)](../connector-oracle-service-cloud.md) |✓ | |✓ |✓  |
| &nbsp; |[PayPal (Preview)](../connector-paypal.md) |✓ | |✓ |✓  |
| &nbsp; |[QuickBooks (Preview)](../connector-quickbooks.md) |✓ | |✓ |✓  |
| &nbsp; |[Salesforce](../connector-salesforce.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Salesforce Service Cloud](../connector-salesforce-service-cloud.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[Salesforce Marketing Cloud](../connector-salesforce-marketing-cloud.md) |✓ | |✓ |✓  |
| &nbsp; |[SAP Cloud for Customer (C4C)](../connector-sap-cloud-for-customer.md) |✓ |✓ |✓ |✓  |
| &nbsp; |[SAP ECC](../connector-sap-ecc.md) |✓ | |✓ |✓ |
| &nbsp; |[ServiceNow](../connector-servicenow.md) |✓ | |✓ |✓  |
|  |[SharePoint Online List](../connector-sharepoint-online-list.md) |✓ | |✓ |✓ |
| &nbsp; |[Shopify (Preview)](../connector-shopify.md) |✓ | |✓ |✓  |
| &nbsp; |[Square (Preview)](../connector-square.md) |✓ | |✓ |✓  |
| &nbsp; |[Web table (HTML table)](../connector-web-table.md) |✓ | | |✓  |
| &nbsp; |[Xero](../connector-xero.md) |✓ | |✓ |✓  |
| &nbsp; |[Zoho (Preview)](../connector-zoho.md) |✓ | |✓ |✓  |

> [!NOTE]
> If a connector is marked *Preview*, you can try it out and give us feedback. If you want to take a dependency on preview connectors in your solution, contact [Azure support](https://azure.microsoft.com/support/).
