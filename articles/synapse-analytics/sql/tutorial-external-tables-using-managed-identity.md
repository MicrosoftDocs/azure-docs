---
title: 'Tutorial: create external tables or ingest data from on ADLS Gen2 using a managed identity'
description: This tutorial shows how to connect to external data for queries or ingestion using a managed identity.
author: periclesrocha
ms.service: azure-synapse-analytics
ms.topic: tutorial
ms.subservice: sql
ms.date: 01/04/2025
ms.custom: 
ms.author: periclesrocha
ms.reviewer: WilliamDAssafMSFT 
---

# Tutorial: create external tables or ingest data from on ADLS Gen2 using a managed identity

Applies to: Azure Synapse Analytics

This article explains how to create external tables or ingest data from Azure Data Lake Storage Gen2 accounts using a managed identity.

## Prerequisites:

This tutorial requires the following resources to be in place:

* An Azure Data Lake Storage Gen2 (ADLS Gen2) account
* An Azure Synapse Analytics workspace and a dedicated SQL Pool

## Give the workspace identity access to the storage account

Each Azure Synapse Analytics workspace automatically creates a managed identity that helps you configure secure access to external data from your workspace. To learn more about managed identities for Azure Synapse Analytics, visit [Managed service identity for Azure Synapse Analytics - Azure Synapse | Microsoft Learn](https://learn.microsoft.com/en-us/azure/synapse-analytics/synapse-service-identity).

To enable your managed identity to access data on ADLS Gen2 accounts, you need to give your identity access to the source account. To grant proper permissions, follow these steps:

1. In the Azure Portal, find your storage account.
2. Select **Data storage -> Containers**, and navigate to the folder where the source data the external table needs access to is.
3. Select **Access control (IAM)**.
4. Select **Add -> Add role assignment**.
5. In the list of job function roles, select **Storage Blob Data Contributor** and select **Next**.
6. In the Add role assignment page, select **+ Select members**. The Select members pane opens in the right-hand corner.
7. Type the name of your workspace identity until it is displayed. The workspace identity is the same as your workspace name. Pick your workspace identity and chose **Select**.
8. Back to the Add role assignment page, make sure the list of Members include your workspace identity. Once verified, select **Review + assign**.
9. In the confirmation page, review the changes and select **Review + assign**.

Your workspace identity is now a member of the Storage Blob Data Contributor role and has access to the source folder.

Note: these steps also apply to secure ADLS Gen2 accounts that are configured to restrict public access. To learn more about securing your ADLS Gen2 account, visit [Configure Azure Storage firewalls and virtual networks | Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/common/storage-network-security?tabs=azure-portal).

## Ingest data using COPY INTO

The COPY INTO statement provides flexible, high-throughput data ingestion into your tables, and is the primary strategy to ingest data into your dedicated SQL Pool tables. It allows users to ingest data from external locations without having to create any of the additional database objects that are required for external tables.

To run the COPY INTO statement using a workspace managed identity for authentication, use the following command:

```sql
COPY INTO <TableName>
FROM 'https://<AccountName>.dfs.core.windows.net/<Container>/<Folder>/ '
WITH
(
    CREDENTIAL = (IDENTITY = 'Managed Identity'),
    [<CopyIntoOptions>]
)
```

Where:

* \<TableName> is the name of the table you will ingest data into
* \<AccountName> is your ADLS Gen2 account name
* \<Container> is the name of the container within your storage account where the source data is stored
* \<Folder> is the folder (or path with subfolders) where the source data is stored within your container. You can also provide a file name if pointing directly to a single file.
* \<CopyIntoOptions> is the list of any other options you wish to provide to the COPY INTO statement.

To learn more and explore the full syntax of COPY INTO, refer to <https://learn.microsoft.com/en-us/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest>.

## Query data on ADLS Gen2 using external tables

External tables allow users to query data from ADLS Gen2 accounts without the need to ingest data first. Users can create an external table which points to files on an ADLS Gen2 container, and query it just like a regular user table.

The following steps describe the process to create a new external table pointing to data on ADLS Gen2, using a managed identity for authentication.

### Create the required database objects

External tables require the following objects to be created:

1. A database master key that encrypts the database scoped credential’s secret
2. A database scoped credential that uses your workspace identity.
3. An external data source that points to the source folder.
4. An external file format that defines the format of the source files.
5. An external table definition that is used for queries.

To follow these steps, you will need to use the SQL editor in the Azure Synapse Workspace, or your preferred SQL client connected to your dedicated SQL Pool. Let’s look at these steps in detail.

#### Create the database master key

The database master key is a symmetric key used to protect the private keys of certificates and asymmetric keys that are present in the database and secrets in database scoped credentials. If there is already a master key in the database, you do not need to create a new one.

To create a master key, use the following command:

```sql
-- Replace <Secure Password Here> with a secure password
CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<Secure Password Here>'
```

Where:

* \<Secure Password Here> should be replaced with a strong password. This password is used to encrypt the master key in the database

To learn more about the database master key, refer to <https://learn.microsoft.com/en-us/sql/t-sql/statements/create-master-key-transact-sql?view=azure-sqldw-latest>.

#### Create the database scoped credential

A database scoped credential uses your workspace identity and is needed to access to the external location anytime the external table requires access to the source data.

To create the database scoped credential, use the following command:

```sql
CREATE DATABASE SCOPED CREDENTIAL <CredentialName> WITH IDENTITY = 'Managed Service Identity'
```

Where:

* \<CredentialName> should be replaced with the name you would like to use for your database scoped credential

To learn more about database scoped credentials, refer to <https://learn.microsoft.com/en-us/sql/t-sql/statements/create-database-scoped-credential-transact-sql?view=azure-sqldw-latest>.

#### Create the external data source

The next step is to create an external data source that specifies where the source data used by the external table resides.

To create the external data source, use the following command:

```sql
CREATE EXTERNAL DATA SOURCE <ExternalDataSourceName>
WITH (
    TYPE = hadoop,
    LOCATION = 'abfss://<Container>@<AccountName>.dfs.core.windows.net/<Folder>/,
    CREDENTIAL = <CredentialName>
)
```

Where:

* \<ExternalDataSourceName> is the name you want to use for your external data source
* \<AccountName> is your ADLS Gen2 account name
* \<Container> is the name of the container within your storage account where the source data is stored
* \<Folder> is the folder (or path with subfolders) where the source data is stored within your container. You can also provide a file name if pointing directly to a single file.
* \<Credential> is the name of the database scoped credential you created in step b)

To learn more about external data sources, refer to <https://learn.microsoft.com/en-us/sql/t-sql/statements/create-external-data-source-transact-sql?view=azure-sqldw-latest&tabs=dedicated>.

#### Create the external file format

The next step is to create the external file format. It specifies the actual layout of the data referenced by the external table.

To create the external file format, use the following command:

```sql
CREATE EXTERNAL FILE FORMAT <FileFormatName>
WITH (
    FORMAT_TYPE = DELIMITEDTEXT,
    FORMAT_OPTIONS (
        FIELD_TERMINATOR = ',',
        STRING_DELIMITER = '"',
        FIRST_ROW = 2,
        USE_TYPE_DEFAULT = True
    )
)
```

Where:

* \<FileFormatName> is the name you want to use for your external file format

In the example above, adjust parameters such as FIELD\_TERMINATOR, STRING\_DELIMITER, FIRST\_ROW and others as needed in accordance with your source data. For more formatting options and to learn more about EXTERNAL FILE FORMAT, visit <https://learn.microsoft.com/en-us/sql/t-sql/statements/create-external-file-format-transact-sql?view=azure-sqldw-latest&tabs=delimited>.

#### Create the external table

Now that we’ve created all the necessary objects that hold the metadata to securely access external data, it is time to create the external table. To create the external table, use the following command:

```sql
-- Adjust the table name and columns to your desired name and external table schema
CREATE EXTERNAL TABLE <ExternalTableName> (
    Col1 INT,
    Col2 NVARCHAR(100),
    Col4 INT
)
WITH
(
    LOCATION = '<Path>',
    DATA_SOURCE = <ExternalDataSourceName>,
    FILE_FORMAT = <FileFormatName>
)
```

Where:

* \<ExternalTableName> is the name you want to use for your external table
* \<Path> is the relative path of the source data from the location specified in the external data source on step c)
* \<ExternalDataSourceName> is the name of the external data source you created previously c)
* \<FileFormatName> is the name of the external file format you created in step d)

Make sure to adjust the table name and schema to the desired name and the schema of the data in your source files.

At this point, all the metadata required to access the external table has been created. To test your external table, use a simple query such as the one below:

```sql
SELECT TOP 10 Col1, Col2 FROM <ExternalTableName>
```

If everything was configured properly, you should see the data from your source data as a result of this query.

To learn more and explore the full syntax of EXTERNAL TABLE, refer to <https://learn.microsoft.com/en-us/sql/t-sql/statements/create-external-table-transact-sql?view=azure-sqldw-latest&tabs=dedicated>.