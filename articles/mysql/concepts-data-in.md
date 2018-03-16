---
title: 'Replicate data from multiple cloud or on-premises databases to Azure Database for MySQL | Microsoft Docs'
description: 'This topic introduce the concept about what MySQL Data-in Replication is, as well as suitable scenarios, limitations, etc.'
services: mysql
author: mswutao
ms.author: wuta
manager: Jason.M.Anderson
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 01/02/2018
---
# Replicate data from multiple cloud or on-premises databases to Azure Database for MySQL

Azure Database for MySQL supports slave server mode and standard MySQL data replication. Data-in Replication is a service built on Azure Database for MySQL that lets you synchronize the data from a MySQL server that is running locally or in other locations to a server that is running on Azure Database for MySQL.

## When to use Data-in Replication

Data-in Replication is useful in cases where data needs to be kept up to date across Azure Database for MySQL or MySQL Server. Here are the main use cases for Data-in Replicaton:

- **Hybrid Data Synchronization**: With Data-in Replication, you can keep data synchronized between your on-premises servers and Azure Database for MySQL to enable hybrid applications. This capability may appeal to customers who have database server locally but want to have data in region close to end user, or those who are considering moving to the cloud and would like to put some of their application in Azure.

- **Migrate from on-premises MySQL Server to Azure Database for MySQL**: Usually, customer uses [import and export](./concepts-migrate-import-export.md) to migrate data to an Azure Database for MySQL. If your database is relatively large, and you cannot afford to remove your MySQL Server from production while the migration is occurring, you can use Data-in Replication as your migration solution to shorten MySQL Server downtime. 

- **Multi-Cloud Synchronization**: Nowadays, customer’s cloud solution becomes more and more complex. With Data-in Replication, you can keep data synchronized between different cloud providers, ISV, or MySQL server in VM to Azure Database for MySQL.  

## Limitations and considerations 

### Account and permissions are not replicated 
Changes on the primary server to accounts and permissions are not replicated. If you create an account on the primary server and this account needs to access the replica server, you will need to create the same account by yourself on replica server side. 

### Requirements 
- The primary and replica server versions must be the same. For example, both must be MySQL 5.6, or both must be MySQL 5.7. 
- Each table must have a primary key.

## Next steps
- For more information about Azure Database for MySQL Data-in Replication, see: [Getting Started with Azure Database for MySQL Data-in Replication](./howto-data-in.md)
