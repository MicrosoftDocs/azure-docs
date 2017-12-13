---
title: Data loading guidance - Azure SQL Data Warehouse | Microsoft Docs
description: Recommendations for loading data and performing ELT with Azure SQL Data Warehouse. 
services: sql-data-warehouse
documentationcenter: NA
author: barbkess
manager: jenniehubbard
editor: ''

ms.assetid: 7b698cad-b152-4d33-97f5-5155dfa60f79
ms.service: sql-data-warehouse
ms.devlang: NA
ms.topic: get-started-article
ms.tgt_pltfrm: NA
ms.workload: data-services
ms.custom: performance
ms.date: 12/13/2017
ms.author: barbkess

---
# Guidance for loading data into Azure SQL Data Warehouse
Recommendations and performance optimizations for loading data into Azure SQL Data Warehouse. 

- To learn more about PolyBase and designing an Extract, Load, and Transform (ELT) process, see [Design ELT for SQL Data Warehouse](design-elt-data-loading.md).
- For a loading tutorial, [Use PolyBase to load data from Azure blob storage to Azure SQL Data Warehouse](load-data-from-azure-blob-storage-using-polybase.md).


## Extract source data

When exporting data into an ORC File Format from SQL Server or Azure SQL Data Warehouse text heavy columns can be limited to as few as 50 columns due to java out of memory errors. To work around this, export only a subset of the columns.


## Land data to Azure
PolyBase cannot load rows that have more than one million bytes of data. When you put data into the text files in Azure Blob storage or Azure Data Lake Store, they must have fewer than one million bytes of data. This is true regardless of the table schema defined.

Co-locate your storage layer and your data warehouse to minimize latency.

## Data preparation

All file formats have different performance characteristics. For the fastest load, use compressed delimited text files. The difference between UTF-8 and UTF-16 performance is minimal.

Split large compressed files into smaller compressed files.

## Create designated loading users
To run loads with appropriate compute resources, create loading users designated for running loads. Assign each loading user to a specific resource class. To run a load, log in as one of the loading users, and then run the load. The load runs with the user's resource class.  This method is simpler than trying to change a user's resource class to fit the current resource class need.

This code creates a loading user for the staticrc20 resource class. It gives use users control permission on a database and then adds the user as a member of the staticrc20 database role. To run a load with resources for the staticRC20 resource classes, simply log in as LoaderRC20 and run the load. 

    ```sql
    CREATE LOGIN LoaderRC20 WITH PASSWORD = 'a123STRONGpassword!';
    CREATE USER LoaderRC20 FOR LOGIN LoaderRC20;
    GRANT CONTROL ON DATABASE::[mySampleDataWarehouse] to LoaderRC20;
    EXEC sp_addrolemember 'staticrc20', 'LoaderRC20';
    ```

Run loads under static rather than dynamic resource classes. Using the static resource classes guarantees the same resources regardless of your [service level](performance-tiers.md#service-levels). If you use a dynamic resource class, the resources vary according to your service level. For dynamic classes, a lower service level means you probably need to use a larger resource class for your loading user.

### Example for isolating loading users

There is often a need to have multiple users that can load data into a SQL DW. Because the [CREATE TABLE AS SELECT (Transact-SQL)][CREATE TABLE AS SELECT (Transact-SQL)] requires CONTROL permissions of the database, you will end up with multiple users with control access over all schemas. To limit this, you can use the DENY CONTROL statement.

For example, consider database schemas, schema_A for dept A, and schema_B for dept B. Let database users user_A and user_B be users for PolyBase loading in dept A and B, respectively. They both have been granted CONTROL database permissions. The creators of schema A and B now lock down their schemas using DENY:

```sql
   DENY CONTROL ON SCHEMA :: schema_A TO user_B;
   DENY CONTROL ON SCHEMA :: schema_B TO user_A;
```   

User_A and user_B are now locked out from the other dept’s schema.


## Load to a staging table

For fastest loading speed, load into a round_robin, heap staging table. This will be the most efficient way to move the data from the Azure Storage layer to SQl Data Warehouse.

Scale up your data warehouse if you expect a large loading job.

Run only one load job at a time for optimal load performance

### Optimize columnstore index loads

Columnstore indexes require a lot of memory to compress data into high quality rowgroups. For best compression and index efficiency, the columnstore index needs to compress 1,048,576 rows into each rowgroup. This is the maximum number of rows per rowgroup. When there is memory pressure, the columnstore index might not be able to achieve maximum compression rates. This in turn effects query performance. For a deep dive, see [Columnstore memory optimizations](sql-data-warehouse-memory-optimizations-for-columnstore-compression.md).

- To ensure the loading user has enough memory to achieve maximum compression rates, use loading users that are a member of a medium or large resource class. 
- Load enough rows to completely fill new rowgroups. During a bulk load, each 1,048,576 rows goes directly to the columnstore. Loads with fewer than 102,400 rows send the rows to the deltastore, which holds rows in a clustered index until there are enough for compression. If you load too few rows, they might all go to the deltastore and not get compressed immediately into columnstore format.


### Handling loading failures

A load using an external table can fail with the error *"Query aborted-- the maximum reject threshold was reached while reading from an external source"*. This indicates that your external data contains *dirty* records. A data record is considered 'dirty' if the actual data types/number of columns do not match the column definitions of the external table or if the data doesn't conform to the specified external file format. 

To fix this, ensure that your external table and external file format definitions are correct and your external data conforms to these definitions. In case a subset of external data records are dirty, you can choose to reject these records for your queries by using the reject options in CREATE EXTERNAL TABLE DDL.



## Insert data into production table
These are recommendations for inserting rows into the production tables.


### Batch INSERT statements
A one-time load to a small table with an [INSERT statement](/sql/t-sql/statements/insert-transact-sql.md) or even a periodic reload of a look-up might perform just fine for your needs with a statement like `INSERT INTO MyLookup VALUES (1, 'Type 1')`.  Single ton inserts are not as efficient as performing a bulk load. 

If you have thousands or more single inserts throughout the day, batch the inserts so you can bulk load them.  Develop your processes to append the single inserts to a file, and then create another process that periodically loads the file.

### Create statistics after the load

To improve query performance, it's important to create statistics on all columns of all tables after the first load, or substantial changes occur in the data.  For a detailed explanation of statistics, see [Statistics][Statistics]. The following example creates statistics on five columns of the Customer_Speed table.

```sql
create statistics [SensorKey] on [Customer_Speed] ([SensorKey]);
create statistics [CustomerKey] on [Customer_Speed] ([CustomerKey]);
create statistics [GeographyKey] on [Customer_Speed] ([GeographyKey]);
create statistics [Speed] on [Customer_Speed] ([Speed]);
create statistics [YearMeasured] on [Customer_Speed] ([YearMeasured]);
```

## Rotate storage keys
It is good security practice to change the access key to your blob storage on a regular basis. You have two storage keys for your blob storage account. This is so that you can transition the keys.

To rotate Azure Storage account keys:

1. Create a second database scoped credential based on the secondary storage access key.
2. Create a second external data source based off this new credential.
3. Drop and create the external table(s) so they point to the new external data sources. 

After migrating your external tables to the new data source, perform these clean up tasks:

1. Drop the first external data source.
2. Drop the first database scoped credential based on the primary storage access key.
3. Log in to Azure and regenerate the primary access key so it is ready for your next rotation.


## Next steps
To monitor the load process, see [Monitor your workload using DMVs](sql-data-warehouse-manage-monitor.md).



