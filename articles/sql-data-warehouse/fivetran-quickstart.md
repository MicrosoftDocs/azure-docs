---
title: Fivetran quick start with Azure SQL Data Warehouse | Microsoft Docs
description: Get started quickly with Fivetran and Azure SQL Data Warehouse.
services: sql-data-warehouse
author: hirokib
manager: jrj
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 10/12/2018
ms.author: elbutter
ms.reviewer: craigg
---

# Get started quickly with Fivetran and SQL Data Warehouse

This quickstart assumes that you already have a pre-existing instance of SQL Data Warehouse.

## Setup connection

1. Find your fully qualified server name and database name for connecting to Azure SQL Data Warehouse.

   [How to find server name and database name from the portal?](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-connect-overview)

2. In the setup wizard, decide if you'd like to connect your database directly or via an SSH tunnel.

   If you decide to connect directly to your database, you will need to create a firewall rule to allow access. This method is the simplest and most secure method.

   If you decide to connect via an SSH tunnel, Fivetran will connect to a separate server in your network that provides an SSH tunnel to your database. This method is necessary if your database is in an inaccessible subnet on a virtual network.

3. Add "52.0.2.4" IP address in your server level firewall to allow incoming connections to your Azure SQL Data Warehouse from Fivetran.

   [How to add server level firewall?](https://docs.microsoft.com/azure/sql-data-warehouse/create-data-warehouse-portal#create-a-server-level-firewall-rule)

## Setup user credentials

Connect to your Azure SQL Data Warehouse using SQL Server Management Studio or tool of choice as server admin user and execute the following SQL commands to create a user for Fivetran:

In master database: ` CREATE LOGIN fivetran WITH PASSWORD = '<password>'; `

In SQL Data Warehouse database:

```
CREATE USER fivetran_user_without_login without login;
CREATE USER fivetran FOR LOGIN fivetran;
GRANT IMPERSONATE on USER::fivetran_user_without_login to fivetran;
```

Once user fivetran is created, grant it the following permissions to your warehouse:

```
GRANT CONTROL to fivetran;
```

Add a suitable resource class to the created user depending upon the memory requirement for columnstore index creation. For example, integrations like Marketo and Salesforce need higher resource class due to the large number of columns/ larger volume of data, which requires more memory to create columnstore indexes.

Using static resource classes is recommended. You can start with resource class `staticrc20`, which allocates 200 MB for user irrespective of the performance level you use. If columnstore indexing fails with the current resource class, we have to increase the resource class.

```
EXEC sp_addrolemember '<resource_class_name>', 'fivetran';
```

For more information, check out the documents for [memory and concurrency limits](https://docs.microsoft.com/azure/sql-data-warehouse/memory-and-concurrency-limits#data-warehouse-limits) and [resource classes](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-memory-optimizations-for-columnstore-compression#ways-to-allocate-more-memory)

CONTROL permission is needed to create database scoped credentials that will be used while loading files from Blob Storage using PolyBase.

Enter the credentials to access Azure SQL Data Warehouse

1. Host (Your server name)
2. Port
3. Database
4. User (User name should be `fivetran@<server_name>` where `<server_name>` is part of your azure host uri: `<server_name>.database.windows.net`)
5. Password