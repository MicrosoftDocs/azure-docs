---
title: 'Tutorial: load data using Entra ID'
description: This tutorial shows how to connect to external data for queries or ingestion using Entra ID passthrough
author: periclesrocha
ms.service: azure-synapse-analytics
ms.topic: tutorial
ms.subservice: sql
ms.date: 01/04/2025
ms.custom: 
ms.author: periclesrocha
ms.reviewer: WilliamDAssafMSFT 
---

# Tutorial: load data using EntraID

Applies to: Azure Synapse Analytics

This article explains how to create external tables using EntraID passthrough.

## Prerequisites:

This tutorial requires the following resources to be in place:

* An Azure Synapse Analytics workspace and a dedicated SQL Pool

## Give the EntraID account access to the storage account

This examples uses an EntraID account (or group) to authenticate to the source data.

To enable access to data on ADLS Gen2 accounts, you need to give your EntraID account (or group) access to the source account. To grant the proper permissions, follow these steps:

1. In the Azure Portal, find your storage account.
2. Select **Data storage -> Containers**, and navigate to the folder where the source data the external table needs access to is.
3. Select **Access control (IAM)**.
4. Select **Add -> Add role assignment**.
5. In the list of job function roles, select **Storage Blob Data Reader** and select **Next**.
6. In the Add role assignment page, select **+ Select members**. The Select members pane opens in the right-hand corner.
7. Type the name of the desired EntraID account or group until it is displayed. Pick your desired EntraID account and chose **Select**.
8. Back to the Add role assignment page, make sure the list of Members include your desired EntraID account. Once verified, select **Review + assign**.
9. In the confirmation page, review the changes and select **Review + assign**.

The EntraID account or group is now a member of the Storage Blob Data Reader role and has access to the source folder.

# Create the required database objects

External tables require the following objects to be created:

1. An external data source that points to the source folder.
2. An external file format that defines the format of the source files.
3. An external table definition that is used for queries.

To follow these steps, you will need to use the SQL editor in the Azure Synapse Workspace, or your preferred SQL client connected to your dedicated SQL Pool. Let’s look at these steps in detail.

### Create the external data source

The next step is to create an external data source that specifies where the source data used by the external table resides.

To create the external data source, use the following command:

```sql
CREATE EXTERNAL DATA SOURCE <ExternalDataSourceName>
WITH (
    TYPE = hadoop,
    LOCATION = 'abfss://<Container>@<AccountName>.dfs.core.windows.net/<Folder>/
)
```

Where:

* \<ExternalDataSourceName> is the name you want to use for your external data source
* \<AccountName> is your ADLS Gen2 account name
* \<Container> is the name of the container within your storage account where the source data is stored
* \<Folder> is the folder (or path with subfolders) where the source data is stored within your container

To learn more about external data sources, refer to <https://learn.microsoft.com/en-us/sql/t-sql/statements/create-external-data-source-transact-sql?view=azure-sqldw-latest&tabs=dedicated>.

### Create the external file format

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

### Create the external table

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