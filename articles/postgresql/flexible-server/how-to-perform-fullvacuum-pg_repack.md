---
title: Optimize Azure Database for PostgreSQL Flexible Server by using pg_repack 
description: Perform full vacuum using pg_Repack extension in Azure Database for PostgreSQL - Flexible Server
ms.author: sbalijepalli
author: sarat0681
ms.reviewer: 
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 08/03/2022
---

# Optimize Azure Database for PostgreSQL Flexible Server by using pg_repack 

In this article, you'll learn how to use pg_repack to remove bloat and to improve performance in your Azure Database for PostgreSQL Flexible Server. Bloat is the unnecessary data that accumulates in tables and indexes due to frequent updates and deletes. Bloat can cause the database size to grow larger than expected and can also affect the query performance. By using pg_repack, you can reclaim the wasted space and reorganize the data in a more efficient way.

## What is pg_repack? 
pg_repack is a PostgreSQL extension that enables you to remove bloat from tables and indexes and reorganize them in a more efficient manner. pg_repack works by creating a new copy of the target table or index, applying any changes that occurred during the process, and then swapping the old and new versions atomically. pg_repack doesn't require any downtime or exclusive locks on the target table or index, except for a brief period at the beginning and end of the operation. You can use pg_repack to optimize any table or index in your PostgreSQL database, except for the default database named postgres. 

### How to use pg_repack? 
To use pg_repack, you need to install the extension in your PostgreSQL database and then run the pg_repack command, specifying the name of the table or index that you want to optimize. The extension acquires locks on the table or index to prevent other operations from being performed while the optimization is in progress. It will then remove the bloat and reorganize the data in a more efficient manner.

### How full table repack works

To perform a full table repack, pg_repack will follow these steps: 

-    Create a log table to record changes made to the original table.
-    Add a trigger to the original table, logging INSERTs, UPDATEs, and DELETEs into the log table.
-    Create a new table containing all the rows in the old table.
-    Build indexes on the new table.
-    Apply all changes recorded in the log table to the new table.
-    Swap the tables, including indexes and toast tables, using the system catalogs.
-    Drop the original table. 

During these steps, pg_repack will only hold an ACCESS EXCLUSIVE lock for a short period during initial setup (steps 1 and 2) and during the final swap-and-drop phase (steps 6 and 7). For the rest of the time, pg_repack will only need to hold an ACCESS SHARE lock on the original table, allowing INSERTs, UPDATEs, and DELETEs to proceed as usual. 

### Limitations 

pg_repack has some limitations that you should be aware of before using it: 

-    The pg_repack extension cannot be used to repack the default database named postgres. This is due to pg_repack not having the necessary permissions to operate against extensions installed by default on this database. The extension can be created in postgres database, but it will not be able to run.
-    The target table must have either a PRIMARY KEY or a UNIQUE index on a NOT NULL column for the operation to be successful. 
-    While pg_repack is running, you will not be able to perform any DDL commands on the target table(s) except for VACUUM or ANALYZE. To ensure that these restrictions are enforced, pg_repack will hold an ACCESS SHARE lock on the target table during a
     full table repack.

## Setup 
Using the extension requires a client with psql and pg_repack installed. All examples in this document are using a ubuntu VM with Postgres 11 to 15.

### Install the packages for Ubuntu virtual machine: 

Run the following packages on ubuntu machine to install the pg_repack client 1.4.7

```
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list' && \ 
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add - && \ 
sudo apt-get update && \ 
sudo apt install -y postgresql-server-dev-14 && \ 
sudo apt install -y unzip make gcc && \ 
sudo apt-get install -y libssl-dev liblz4-dev zlib1g-dev libreadline-dev && \ 
wget 'https://api.pgxn.org/dist/pg_repack/1.4.7/pg_repack-1.4.7.zip' && \ 
unzip pg_repack-1.4.7.zip && \ 
cd pg_repack-1.4.7 && \ 
sudo make && \ 
sudo cp bin/pg_repack /usr/local/bin && \ 
pg_repack -V 

```
 
## Use pg_repack 
Example of how to run pg_repack on a table named info in a public schema within the flexible server with endpoint pgserver.postgres.database.azure.com, username azureuser, and database foo using the following command.

```
1.    connect to the flexible server instance. This article uses psql for simplicity. 
psql "host=xxxxxxxxx.postgres.database.azure.com port=5432 dbname=foo user=xxxxxxxxxxxxx password=[my_password] sslmode=require" 


2.    Create the pg_repack extension in the databases intended to be repacked. 

foo=> create extension pg_repack; 
CREATE EXTENSION 
 

3.    Find the pg_repack version installed in the server. 

foo=> \dx 
List of installed extensions 

   Name    | Version |   Schema   |                         Description                           

-----------+---------+------------+-------------------------------------------------------------- 

 pg_repack | 1.4.7   | public     | Reorganize tables in PostgreSQL databases with minimal locks 

 (1 row) 

This version should match with the pg_repack in the virtual machine. Check this by running the following. 

azureuser@azureuser:~$ pg_repack --version 
pg_repack 1.4.7 

4.    Run pg_repack client against a table *info* within database *foo*. 
 
pg_repack --host=xxxxxxxxxxxx.postgres.database.azure.com --username=xxxxxxxxxx --dbname=foo --table=info --jobs=2 --no-kill-backend --no-superuser-check 

``` 
### pg_repack options

Useful pg_repack options for production workloads: 

-    -k, --no-superuser-check 
    Skip the superuser checks in the client. This setting is useful for using pg_repack on platforms that support running it as non-superusers like Azure Database for PostgreSQL Flexible Servers. 

-    -j, --jobs 
    Create the specified number of extra connections to PostgreSQL and use these extra connections to parallelize the rebuild of indexes on each table. Parallel index builds are only supported for full-table repacks, not

-    --index or --only indexes options
    If your PostgreSQL server has extra cores and disk I/O available, this can be a useful way to speed up pg_repack. 

-    -D, --no-kill-backend
    Skip to repack table if the lock cannot be taken for duration specified --wait-timeout default 60 sec, instead of canceling conflicting queries. The default is false. 

-    -E LEVEL, --elevel=LEVEL
    Choose the output message level from DEBUG, INFO, NOTICE, WARNING, ERROR, LOG, FATAL, and PANIC. The default is INFO. 

To understand all the options, refer to [pg_repack options](https://reorg.github.io/pg_repack/)


## Next steps

- Troubleshoot and tune Autovacuum [Autovacuum Tuning](./how-to-high-cpu-utilization.md).
