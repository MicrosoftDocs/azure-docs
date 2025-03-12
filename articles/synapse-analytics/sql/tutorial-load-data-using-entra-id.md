---
title: "Tutorial: Load External Data Using Microsoft Entra ID"
description: This tutorial shows how to connect to external data for queries or ingestion using Microsoft Entra ID passthrough.
author: WilliamDAssafMSFT
ms.author: wiassaf
ms.reviewer: periclesrocha
ms.date: 12/27/2024
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: tutorial
---

# Tutorial: Load external data using Microsoft Entra ID

This article explains how to create external tables using Microsoft Entra ID passthrough.

## Prerequisites

The following resources are required to complete this tutorial:

- An Azure Synapse Analytics workspace and a dedicated SQL pool

## Give the Microsoft Entra ID account access to the storage account

This example uses a Microsoft Entra ID account (or group) to authenticate to the source data.

To enable access to data on Azure Data Lake Storage (ADLS) Gen2 accounts, you need to give your Microsoft Entra ID account (or group) access to the source account. To grant the proper permissions, follow these steps:

1. In the Azure portal, find your storage account.
1. Select **Data storage** -> **Containers**, and navigate to the folder where the source data the external table needs access to is.
1. Select **Access control (IAM)**.
1. Select **Add -> Add role assignment**.
1. In the list of job function roles, select **Storage Blob Data Reader** and select **Next**. If write permissions are needed, select **Storage Blob Data Contributor**. 
1. In the **Add role assignment** page, select **+ Select members**. The **Select members** pane opens in the right-hand corner.
1. Type the name of the desired Microsoft Entra ID account. When displayed, pick your desired account and chose **Select**.
1. In the **Add role assignment** page, make sure the list of Members include your desired Microsoft Entra ID account. Once verified, select **Review + assign**.
1. In the confirmation page, review the changes and select **Review + assign**.

The Microsoft Entra ID account or group is now a member of the Storage Blob Data Reader role and has access to the source folder.

## Ingest data using COPY INTO

The `COPY INTO` T-SQL statement provides flexible, high-throughput data ingestion into your tables, and is the primary strategy to ingest data into your dedicated SQL pool tables. It allows users to ingest data from external locations without having to create any of the extra database objects that are required for external tables.

The `COPY INTO` statement uses the `CREDENTIAL` argument to specify the authentication method used to connect to the source account. However, when authenticating using Microsoft Entra ID or to a public storage account, `CREDENTIAL` doesn't need to be specified. To run the `COPY INTO` statement using Entra ID authentication, use the following T-SQL command:

```sql
COPY INTO <TableName>
FROM 'https://<AccountName>.dfs.core.windows.net/<Container>/<Folder>/ '
WITH
(
    [<CopyIntoOptions>]
);
```

Where:

- `<TableName>` is the name of the table to ingest data into.
- `<AccountName>` is your ADLS Gen2 account name.
- `<Container>` is the name of the container within your storage account where the source data is stored
- `<Folder>` is the folder (or path with subfolders) where the source data is stored within your container. You can also provide a file name if pointing directly to a single file.
- `<CopyIntoOptions>` is the list of any other options you wish to provide to the `COPY INTO` statement. 

To learn more and explore the full syntax, see [COPY INTO (Transact-SQL)](/sql/t-sql/statements/copy-into-transact-sql?view=azure-sqldw-latest&preserve-view=true).

## Query data on ADLS Gen2 using external tables

External tables allow users to query data from Azure Data Lake Storage (ADLS) Gen2 accounts without the need to ingest data first. Users can create an external table which points to files on an ADLS Gen2 container, and query it just like a regular user table.

The following steps describe the process to create a new external table pointing to data on ADLS Gen2, using Entra ID authentication.

### Create the required database objects

External tables require the following objects to be created:

1. An external data source that points to the source folder
1. An external file format that defines the format of the source files
1. An external table definition that is used for queries

To follow these steps, you need to use the SQL editor in the Azure Synapse Workspace, or your preferred SQL client connected to your dedicated SQL pool. Let's look at these steps in detail.

#### Create the external data source

The next step is to create an external data source that specifies where the source data used by the external table resides.

To create the external data source, use the following T-SQL command:

```sql
CREATE EXTERNAL DATA SOURCE <ExternalDataSourceName>
WITH (
    TYPE = HADOOP,
    LOCATION = 'abfss://<Container>@<AccountName>.dfs.core.windows.net/<Folder>/'
);
```

Where:

- `<ExternalDataSourceName>` is the name you want to use for your external data source.
- `<AccountName>` is your ADLS Gen2 account name.
- `<Container>` is the name of the container within your storage account where the source data is stored.
- `<Folder>` is the folder (or path with subfolders) where the source data is stored within your container.

To learn more about external data sources, see [CREATE EXTERNAL DATA SOURCE (Transact-SQL)](/sql/t-sql/statements/create-external-data-source-transact-sql?view=azure-sqldw-latest&preserve-view=true&tabs=dedicated).

#### Create the external file format

The next step is to create the external file format. It specifies the actual layout of the data referenced by the external table.

To create the external file format, use the following T-SQL command. Replace `<FileFormatName>` with the name you want to use for your external file format.

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
);
```

In this example, adjust parameters such as `FIELD_TERMINATOR`, `STRING_DELIMITER`, `FIRST_ROW`, and others as needed in accordance with your source data. For more formatting options and to learn more, see [CREATE EXTERNAL FILE FORMAT (Transact-SQL)](/sql/t-sql/statements/create-external-file-format-transact-sql?view=azure-sqldw-latest&preserve-view=true&tabs=delimited).

#### Create the external table

Now that the necessary objects that hold the metadata to securely access external data are created, it's time to create the external table. To create the external table, use the following T-SQL command:

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
);
```

Where:

- `<ExternalTableName>` is the name you want to use for your external table.
- `<Path>` is the path of the source data, relative to the location specified in the external data source.
- `<ExternalDataSourceName>` is the name of [the external data source you created](#create-the-external-data-source).
- `<FileFormatName>` is the name of [the external file format you created](#create-the-external-file-format).

Make sure to adjust the table name and schema to the desired name and the schema of the data in your source files.

### Query the external table

At this point, all the metadata required to access the external table are created. To test your external table, use a query such as the following T-SQL sample to validate your work:

```sql
SELECT TOP 10 Col1, Col2 FROM <ExternalTableName>;
```

If everything was configured properly, you should see the data from your source data as a result of this query.

For more information about `CREATE EXTERNAL TABLE`, see [CREATE EXTERNAL TABLE (Transact-SQL)](/sql/t-sql/statements/create-external-table-transact-sql?view=azure-sqldw-latest&preserve-view=true&tabs=dedicated).

## Related content

- [Tutorial: Load external data using a managed identity](tutorial-external-tables-using-managed-identity.md)
- [Load Contoso retail data into dedicated SQL pools in Azure Synapse Analytics](../sql-data-warehouse/sql-data-warehouse-load-from-azure-blob-storage-with-polybase.md)
- [Use Microsoft Entra authentication for authentication with Synapse SQL](active-directory-authentication.md)
