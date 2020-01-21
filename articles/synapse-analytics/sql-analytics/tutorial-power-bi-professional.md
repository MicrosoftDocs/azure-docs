---
title: Tutorial - Power BI Professional | Azure Synapse Analytics
description: In this tutorial, we will go through steps how to connect SQL on-demand with Power BI desktop.
services: synapse analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: tutorial
ms.subservice:
ms.date: 10/14/2019
ms.author: v-stazar
ms.reviewer: jrasnick
---

# Tutorial: Power BI Professional

In this tutorial, you learn how to connect SQL on-demand from Power BI Desktop.

## Prerequisites

tutorial-power-bi-professional to issue queries:

- Azure Data Studio
- SQL Server Management Studio
- Power BI Desktop

Parameters for this tutorial:

| Parameter                                 | Description                                                   |
| ----------------------------------------- | ------------------------------------------------------------- |
| SQL on-demand service endpoint address    | Used as server name                                   |
| SQL on-demand service endpoint region     | Used to determine what storage will we use in samples |
| Username and password for endpoint access | Used to access endpoint                               |
| The database used to create views     | Database used as starting point in samples       |

## First-time setup

Prior to using samples:

- Create database for your views
- Create credentials to be used by SQL on-demand to access files in storage

### Create database

Create your own database for demo purposes. This is the database in which you create your views. Use this database in the sample queries in this article.

> [!NOTE]
> The databases are used only for view metadata, not for actual data.
>
> Write down database name you use for use later in this tutorial.

Use the following query, changing `mydbname` to a name of your choice:

```sql
CREATE DATABASE mydbname
```

### Create credentials

To run queries using SQL on-demand, create credentials for SQL on-demand to use to access files in storage.

> [!NOTE]
> Create the credential for the storage account that is located in your endpoint region. Although SQL on-demand can access storage in different regions, having storage and endpoint in same region provides better performance.

Use the following code snippet to create credentials for the Census data containers:

```sql
IF EXISTS
  (
    SELECT * FROM sys.credentials
    WHERE name = 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer'
  )
  DROP CREDENTIAL [https://azureopendatastorage.blob.core.windows.net/censusdatacontainer]
GO

-- Create credentials for Census Data container which resides in a Azure open data storage account
-- There is no secret. We are using public storage account which doesn't need secret
CREATE CREDENTIAL [https://azureopendatastorage.blob.core.windows.net/censusdatacontainer]  
WITH IDENTITY='SHARED ACCESS SIGNATURE',  
SECRET = ''
GO
```

## Provided demo data

The demo data provided for this tutorial contains the following data sets:

- US population by gender and race for each US county sourced from 2000 and 2010 Decennial Census.
  - Parquet format

| Folder path                                                  | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| /release/                                                    | Parent folder for data in demo storage account               |
| /release/us_population_county/                               | US population data files in Parquet format, partitioned by year using Hive/Hadoop partitioning scheme. |

## Preparing view for Power BI Desktop

It is required to expose data as views or external tables for Power BI to consume it.
Following query is going to create a view called "usPopulationView" inside a database with name "demo".

```sql
DROP VIEW IF EXISTS usPopulationView
GO

CREATE VIEW usPopulationView AS
SELECT * FROM OPENROWSET
  (
      BULK 'https://azureopendatastorage.blob.core.windows.net/censusdatacontainer/release/us_population_county/year=20*/*.parquet'
    , FORMAT='PARQUET'
  ) AS uspv
```

## Creating Power BI desktop report

1. Open Power BI Desktop application and click **Get data**.
![Open Power BI desktop application and select get data.](./media/tutorial-bi-professional/step-0-open-powerbi.png)

2. To specify a data source, select **Azure** and then click **Azure SQL Database**.
![Select data source.](./media/tutorial-bi-professional/step-1-select-data-source.png)

3. To specify a database, enter the URL for the database and name of the database containing the view.
![Select database on the endpoint.](./media/tutorial-bi-professional/step-2-db.png)

4. To specify the view, select **usPopulationView**.
![Select a View on the database that is selected.](./media/tutorial-bi-professional/step-3-select-view.png)

5. When prompted, click **Apply changes**.
![Click apply changes.](./media/tutorial-bi-professional/step-4-apply-changes.png)

6. After clicking **Apply changes**, wait for the query to finish.
![Wait for a query to finish.](./media/tutorial-bi-professional/step-5-wait-for-query-to-finish.png)

7. After loading finishes, select following columns (with this order):

    - countyName
    - population
    - stateName

![Select columns of interest to generate a map report.](./media/tutorial-bi-professional/step-6-select-columns-of-interest.png)

## Clean up resources

If you're not going to continue to use this report, delete resources with the following steps:

1. Delete credential for storage account

    ```sql
    DROP CREDENTIAL [https://azureopendatastorage.blob.core.windows.net/censusdatacontainer]
    ```

2. Delete view

    ```sql
    DROP VIEW usPopulationView
    ```

## Next steps

Advance to the next article to learn how to query storage files using SQL Analytics.
> [!div class="nextstepaction"]
> [Query storage files](development-storage-files-overview.md)
