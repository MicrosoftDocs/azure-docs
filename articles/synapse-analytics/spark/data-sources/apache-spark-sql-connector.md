---
title: Azure SQL and SQL Server 
description: This article provides information on how to use the  connector for moving data between Azure MS SQL and serverless Apache Spark pools.
services: synapse-analytics 
author: eskot
ms.author: eskot 
ms.service: synapse-analytics
ms.topic: overview
ms.subservice: spark
ms.date: 05/19/2020 
ms.custom: has-adal-ref
---

# Azure SQL Database and SQL Server connector for Apache Spark
The Apache Spark connector for Azure SQL Database and SQL Server enables these databases to act as input data sources and output data sinks for Apache Spark jobs. It allows you to use real-time transactional data in big data analytics and persist results for ad-hoc queries or reporting.

Compared to the built-in JDBC connector, this connector provides the ability to bulk insert data into SQL databases. It can outperform row-by-row insertion with 10x to 20x faster performance. The Spark connector for SQL Server and Azure SQL Database also supports Azure Active Directory (Azure AD) [authentication](/sql/connect/spark/connector#azure-active-directory-authentication), enabling you to connect securely to your Azure SQL databases from Azure Synapse Analytics. 

This article covers how to use the DataFrame API to connect to SQL databases using the MS SQL connector. This article provides detailed examples using the PySpark API. For all of the supported arguments and samples for connecting to SQL databases using the MS SQL connector, see [Azure Data SQL samples](https://github.com/microsoft/sql-server-samples#azure-data-sql-samples-repository).


  
## Connection details
In this example, we will use the Microsoft Spark utilities to facilitate acquiring secrets from a pre-configured Key Vault. To learn more about Microsoft Spark utilities, please visit [introduction to Microsoft Spark Utilities](../microsoft-spark-utilities.md).

```python
# The servername is in the format "jdbc:sqlserver://<AzureSQLServerName>.database.windows.net:1433"
servername = "<< server name >>"
dbname = "<< database name >>"
url = servername + ";" + "databaseName=" + dbname + ";"
dbtable = "<< table name >> "
user = "<< username >>" 
principal_client_id = "<< service principal client id >>" 
principal_secret = "<< service principal secret ho>>"
password = mssparkutils.credentials.getSecret('azure key vault name','secret name')
```

> [!NOTE]
> Currently, there is no linked service or AAD pass-through support with the Azure SQL connector.

## Use the Azure SQL and SQL Server connector

### Read data
```python
#Read from SQL table using MS SQL Connector
print("read data from SQL server table  ")
jdbcDF = spark.read \
        .format("com.microsoft.sqlserver.jdbc.spark") \
        .option("url", url) \
        .option("dbtable", dbtable) \
        .option("user", user) \
        .option("password", password).load()

jdbcDF.show(5)
```

### Write data
```python
try:
  df.write \
    .format("com.microsoft.sqlserver.jdbc.spark") \
    .mode("overwrite") \
    .option("url", url) \
    .option("dbtable", dbtable) \
    .option("user", user) \
    .option("password", password) \
    .save()
except ValueError as error :
    print("MSSQL Connector write failed", error)

print("MSSQL Connector write(overwrite) succeeded  ")
```
### Append data
```python
try:
  df.write \
    .format("com.microsoft.sqlserver.jdbc.spark") \
    .mode("append") \
    .option("url", url) \
    .option("dbtable", table_name) \
    .option("user", username) \
    .option("password", password) \
    .save()
except ValueError as error :
    print("Connector write failed", error)
```

## Azure Active Directory authentication

### Python example with service principal
```python
import msal

# Located in App Registrations from Azure Portal
tenant_id = "<< tenant id >> "

# Located in App Registrations from Azure Portal
resource_app_id_url = "https://database.windows.net/"

# Define scope of the Service for the app registration before requesting from AAD
scope ="https://database.windows.net/.default"

# Authority
authority = "https://login.microsoftonline.net/" + tenant_id

# Get service principal 
service_principal_id = mssparkutils.credentials.getSecret('azure key vault name','principal_client_id')
service_principal_secret = mssparkutils.credentials.getSecret('azure key vault name','principal_secret')


context = msal.ConfidentialClientApplication(
    service_principal_id, service_principal_secret, authority
    )

token = app.acquire_token_silent([scope])
access_token = token["access_token"]

jdbc_df = spark.read \
        .format("com.microsoft.sqlserver.jdbc.spark") \
        .option("url", url) \
        .option("dbtable", dbtable) \
        .option("accessToken", access_token) \
        .option("encrypt", "true") \
        .option("hostNameInCertificate", "*.database.windows.net") \
        .load()
```

### Python example with Active Directory password
```python
jdbc_df = spark.read \
        .format("com.microsoft.sqlserver.jdbc.spark") \
        .option("url", url) \
        .option("dbtable", table_name) \
        .option("authentication", "ActiveDirectoryPassword") \
        .option("user", user_name) \
        .option("password", password) \
        .option("encrypt", "true") \
        .option("hostNameInCertificate", "*.database.windows.net") \
        .load()
```

> [!IMPORTANT]
> - A required dependency must be installed in order to authenticate using Active Directory. 
> - The format of `user` when using ActiveDirectoryPassword should be the UPN format, for example `username@domainname.com`. 
>   - For **Scala**, the `com.microsoft.aad.adal4j` artifact will need to be installed.
>   - For **Python**, the `adal` library will need to be installed.  This is available via pip.
> - Check the [sample notebooks](https://github.com/microsoft/sql-spark-connector/tree/master/samples) for examples and for latest drivers and versions, visit [Apache Spark connector: SQL Server & Azure SQL](/sql/connect/spark/connector).

## Support

The Apache Spark Connector for Azure SQL and SQL Server is an open-source project. This connector does not come with any Microsoft support. For issues with or questions about the connector, create an Issue in this project repository. The connector community is active and monitoring submissions.

## Next steps
- [Learn more about the SQL Server and Azure SQL connector](/sql/connect/spark/connector)
- Visit the [SQL Spark connector GitHub repository](https://github.com/microsoft/sql-spark-connector).
- [View Azure Data SQL Samples](https://github.com/microsoft/sql-server-samples)
