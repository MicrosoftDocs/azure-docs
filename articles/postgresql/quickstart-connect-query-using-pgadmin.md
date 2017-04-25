---
title: 'Use Pgadmin SQL to connect and query Azure Database for PostgreSQL | Microsoft Docs'
description: This quick start shows how to use the pgadmin utility to connect to and query a database in an Azure PostgreSQL server.
services: postgresql
author: 
ms.author: 
manager: jhubbard
editor: jasonh
ms.assetid: 
ms.service: postgresql-database
ms.custom: quick start create
ms.tgt_pltfrm: portal
ms.devlang: na
ms.topic: hero-article
ms.date: 05/10/2017
---
# Connect and Query with pgadmin 

## This article is a placeholder. Do not review.

## Prerequisites

This quick start uses an existing Azure PostgreSQL server and database as its starting point. Make sure you have created an Azure PostgreSQL server and enabled server-level firewall rules with one of the following quick starts:
- [Create PostgreSQL server - Portal](postgresql-quickstart-create-server-database-portal.md)
- [Create PostgreSQL server - CLI](postgresql-quickstart-create-server-database-azure-cli.md)

Also make sure you have created a database with the Create an Azure PostgreSQL database quick start.

## Get connection information
Get the fully qualified server name for your Azure PostgreSQL server from the Azure portal. You use the fully qualified server name to connect to your server using any standard PostgreSQL client application and tools.
1. Log in to the [Azure portal](https://portal.azure.com/).
2. Click **All Resources** from the left-hand menu, and click your Azure PostgreSQL server.
3. In the Essentials pane in the Azure portal page for your server, locate and then copy the Server name.

![Get connection information from the Azure Portal > all resources> PostgreSQL server on the Overview page](./media/quickstart-connect-query-using-psql/1_all-resources.png)

In this example, the server name is mypgsql-27356.database.windows.net, the server admin login is ServerAdmin@mypgserver-27356 and ChangeYourAdminPassword1 was specified as the password when the server was created.

## Connect to the database

## Create a new table
The CREATE TABLE command creates a new, initially empty table in the current database. The table is owned by the user issuing the command

## Insert data into the table
The INSERT INTO command inserts new rows into a table. Copy and paste the following command at the **psql** prompt to add 2 rows to the **inventory** table:
```sql
INSERT INTO inventory (id, name, quantity) VALUES (1, 'banana', 150),
(2, 'orange', 154);
```
You should see the following output:
```sql
INSERT 0 2
```

## Query data in the table
The SELECT command selects rows from a table. Copy and paste the following command at the **psql** prompt to select all rows in the **inventory** table:
```sql
SELECT * FROM inventory;
```
You should see the following output:
```sql
id | name | quantity 
---+--------+---------- 
1 | banana | 150 
2 | orange | 154 
(2 rows)
```
## Update data in the table

## Delete data from the table

## Clean up resources
If you plan to continue on to work with subsequent quick starts or with the tutorials, do not clean up the table created in this quick start. If you do not plan to continue, use the following command to delete the table created in this quick start.


## Troubleshooting errors

## Next steps
- To connect and query using psql, see [Connect & query - psql](postgresql-quickstart-connect-query-using-psql.md)
- To migrate data from an existing PostgreSQL database, see [Migrate data](howto-migrate-using-export-and-import.md)
- For a technical overview, see [About Azure Database for PostgreSQL ](overview.md)
