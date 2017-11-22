---
title: 'Sync data across multiple cloud and on-premises databases with Azure Database for MySQL Data Sync | Microsoft Docs'
description: 'This topic introduce the concepts of MySQL Data Sync, Suitable scenarios, limitations, etc.'
services: mysql
author: wuta
ms.author: wuta
manager: Jason.M.Anderson
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 10/10/2017
---
# Sync data across multiple cloud and on-premises databases with Azure Database for MySQL Data Sync 
Azure Database for MySQL supports slave server mode and standard MySQL data replication. MySQL Data Sync is a service built on Azure Database for MySQL that lets you synchronize the data from a MySQL server that is running locally or in other locations to a server that is running on Azure Database for MySQL.

## When to use Data Sync 
Data Sync is useful in cases where data needs to be kept up to date across Azure Database for MySQL or MySQL Server. Here are the main use cases for Data Sync:

- **Hybrid Data Synchronization**: With Data Sync, you can keep data synchronized between your on-premises servers and Azure Database for MySQL to enable hybrid applications. This capability may appeal to customers who have database server locally but want to have data in region close to end user. Or those who are considering moving to the cloud and would like to put some of their application in Azure. 

- **Distributed Applications**: In many cases, it's beneficial to separate different workloads across different servers. For example, if you have a large production database server, but you also need to run a reporting or analytics workload on this server, it's helpful to have a second server for this additional workload. This approach minimizes the performance impact on your production workload. You can use Data Sync to keep these two servers synchronized. 

- **Globally Distributed Applications**: Many businesses span several regions and even several countries. To minimize network latency, it's best to have your data in a region close to you. With Data Sync, you can easily keep servers in regions around the world synchronized. 

- **Migration from on-premises MySQL Server to Azure Database for MySQL**: Usually, customer uses [import and export](./concepts-migrate-import-export.md) to migrate data to an Azure Database for MySQL. If your server is relatively big, and you cannot afford to remove your MySQL Server from production while the migration is occurring, you can use Data Sync as your migration solution to shorten MySQL Server downtime. 

- **Multi-Cloud Synchronization**: Nowadays, customer’s cloud solution becomes more and more complex. With Data Sync, you can keep data synchronized between different cloud providers, ISV, or MySQL server in VM to Azure Database for MySQL.  

We don't recommend Data Sync for the following scenarios: 

- Disaster Recovery 
- Read Scale 
- ETL (OLTP to OLAP) 

## Limitations and considerations 

### Maximum number of replica server(slave) 
One primary server(master) can have up to 5 replica servers(slave).   

### Account and permissions are not replicated 
Changes on the primary server to accounts and permissions are not replicated. If you created an account on the primary server and this account needs to access the replica server, you will need to create the same account by yourself on replica server side. 

### Requirements 
- The primary and replica server versions must be the same. For example, both must be MySQL 5.6, or both must be MySQL 5.7. 
- Each table must have a primary key. Don't change the value of the primary key in any row. If you must do this, delete the row and recreate it with the new primary key value.  

## Next steps
- For more info about Azure Database for MySQL, see: [Azure Database for MySQL Overview](./overview.md)
