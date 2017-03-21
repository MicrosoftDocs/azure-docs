Copy Activity in Data Factory copies data from a source data store to a sink data store. Data Factory supports the following data stores. Data from any source can be written to any sink. Click a data store to learn how to copy data to and from that store.

| Category | Data store | Supported as a source | Supported as a sink |
|:--- |:--- |:--- |:--- |
| **Azure** |[Azure Blob storage](../articles/data-factory/data-factory-azure-blob-connector.md) |✓ |✓ |
| . |[Azure Data Lake Store](../articles/data-factory/data-factory-azure-datalake-connector.md) |✓ |✓ |
| . |[Azure SQL Database](../articles/data-factory/data-factory-azure-sql-connector.md) |✓ |✓ |
| . |[Azure SQL Data Warehouse](../articles/data-factory/data-factory-azure-sql-data-warehouse-connector.md) |✓ |✓ |
| . |[Azure Table storage](../articles/data-factory/data-factory-azure-table-connector.md) |✓ |✓ |
| . |[Azure DocumentDB](../articles/data-factory/data-factory-azure-documentdb-connector.md) |✓ |✓ |
| . |[Azure Search Index](../articles/data-factory/data-factory-azure-search-connector.md) | |✓ |
| **Databases** |[SQL Server](../articles/data-factory/data-factory-sqlserver-connector.md)* |✓ |✓ |
| . |[Oracle](../articles/data-factory/data-factory-onprem-oracle-connector.md)* |✓ |✓ |
| . |[MySQL](../articles/data-factory/data-factory-onprem-mysql-connector.md)* |✓ | |
| . |[DB2](../articles/data-factory/data-factory-onprem-db2-connector.md)* |✓ | |
| . |[Teradata](../articles/data-factory/data-factory-onprem-teradata-connector.md)* |✓ | |
| . |[PostgreSQL](../articles/data-factory/data-factory-onprem-postgresql-connector.md)* |✓ | |
| . |[Sybase](../articles/data-factory/data-factory-onprem-sybase-connector.md)* |✓ | |
| . |[SAP Business Warehouse](../articles/data-factory/data-factory-sap-business-warehouse-connector.md)* |✓ | |
| . |[SAP HANA](../articles/data-factory/data-factory-sap-hana-connector.md)* |✓ | |
| . |[Amazon Redshift](../articles/data-factory/data-factory-amazon-redshift-connector.md) |✓ | |
| . |[Cassandra](../articles/data-factory/data-factory-onprem-cassandra-connector.md)* |✓ | |
| . |[MongoDB](../articles/data-factory/data-factory-on-premises-mongodb-connector.md)* |✓ | |
| **File** |[File System](../articles/data-factory/data-factory-onprem-file-system-connector.md)* |✓ |✓ |
| . |[HDFS](../articles/data-factory/data-factory-hdfs-connector.md)* |✓ | |
| . |[Amazon S3](../articles/data-factory/data-factory-amazon-simple-storage-service-connector.md) |✓ | |
| . |[FTP](../articles/data-factory/data-factory-ftp-connector.md) |✓ | |
| **Others** |[Salesforce](../articles/data-factory/data-factory-salesforce-connector.md) |✓ | |
| . |[Generic ODBC](../articles/data-factory/data-factory-odbc-connector.md)* |✓ | |
| . |[Generic OData](../articles/data-factory/data-factory-odata-connector.md) |✓ | |
| . |[Web Table (table from HTML)](../articles/data-factory/data-factory-web-table-connector.md) |✓ | |
| . |[GE Historian](../articles/data-factory/data-factory-odbc-connector.md#ge-historian-store)* |✓ | | |

> [!NOTE]
> Data stores with * can be on-premises or on Azure IaaS, and require you to install [Data Management Gateway](../articles/data-factory/data-factory-data-management-gateway.md) on an on-premises/Azure IaaS machine.
>
>
