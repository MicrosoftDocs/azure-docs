---
title: FAQ about using Azure Database Migration Service for Azure Database MySQL Single Server to Flexible Server migrations
titleSuffix: "Azure Database Migration Service"
description: Frequently asked questions about using Azure Database Migration Service to perform database migrations from Azure Database MySQL Single Server to Flexible Server.
author: karlaescobar
ms.author: karlaescobar
ms.reviewer: maghan
ms.date: 09/17/2022
ms.service: dms
ms.topic: faq
ms.custom:
  - seo-lt-2019
  - sql-migration-content
---

# Frequently Asked Questions (FAQs)

- **When using Azure Database Migration Service, what’s the difference between an offline and an online migration?**
Azure Database Migration Service supports both offline and online migrations. With an offline migration, application downtime starts when the migration starts. With an online migration, downtime is limited to the time required to cut over at the end of migration. We suggest that you test an offline migration to determine whether the downtime is acceptable; if not, then perform an online migration.
Online and Offline migrations are compared in the following table:

    | Area | Online migration | Offline migration |
    | ------------- |:-------------:|:-------------:|
    | **Database availability for reads during migration** | Available | Available |
    | **Database availability for writes during migration** | Available | Generally, not recommended. Any ‘writes’ initiated after the migration is not captured or migrated |
    | **Application Suitability** | Applications that need maximum uptime | Applications that can afford a planned downtime window |
    | **Environment Suitability** | Production environment | Usually Development, Testing environment and some production that can afford downtime |
    | **Suitability for Write-heavy workloads** | Suitable but expected to reduce the workload during migration | Not Applicable. Writes at source after migration begins are not replicated to target |
    | **Manual Cutover** | Required | Not required |
    | **Downtime required** | Less | More |
    | **Migration time** | Depends on Database size and the write activity until cutover | Depends on Database size |

- **I’m setting up a migration project in DMS and I’m having difficulty connecting to my source database. What should I do?**
If you have trouble connecting to your source database system while working on migration, create a virtual machine in the same subnet of the virtual network with which you set up your DMS instance. In the virtual machine, you should be able to run a connect test. If the connection test succeeds, you shouldn't have an issue with connecting to your source database. If the connection test doesn't succeed, contact your network administrator.

- **Why is my Azure Database Migration Service unavailable or stopped?**
If the user explicitly stops Azure Database Migration Service (DMS) or if the service is inactive for a period of 24 hours, the service will be in a stopped or auto paused state. In each case, the service will be unavailable and in a stopped status. To resume active migrations, restart the service.

- **Are there any recommendations for optimizing the performance of Azure Database Migration Service?**
There are a couple of things to you can try to speed up your database migration using DMS: 
  - Use the multi CPU General Purpose Pricing Tier when you create your service instance to allow the service to take advantage of multiple vCPUs for parallelization and faster data transfer.
  - Temporarily scale up your Azure MySQL Database target instance to the Premium tier SKU during the data migration operation to minimize Azure MySQL Database throttling that may impact data transfer activities when using lower-level SKUs. 

- **Which data, schema, and metadata components are migrated as part of the migration?**
Azure Database Migration Service migrates schema, data, and metadata from the source to the destination. All of the following data, schema, and metadata components are migrated as part of the database migration:
  - Data Migration - All tables from all databases/schemas.
  - Schema Migration - Naming, Primary key, Data type,  Ordinal position, Default value,  Nullability, Auto-increment attributes, Secondary indexes
  - Metadata Migration, Stored Procedures, Functions, Triggers, Views, Foreign key constraints

- **Is there an option to rollback a Single Server to Flexible Server migration?**
You can perform any number of test migrations, and after gaining confidence through testing, perform the final migration. A test migration doesn’t affect the source single server, which remains operational and continues replicating until you perform the actual migration. If there are any errors during the test migration, you can choose to postpone the final migration and keep your source server running. You can then reattempt the final migration after you resolve the errors. Note that after you have performed a final migration to Flexible Server and the source single server has been shut down, you cannot perform a rollback from Flexible Server to Single Server. 

- **The size of my database is greater than 1 TB, so how should I proceed with migration?**
To support migrations of databases that are 1 TB+, raise a support ticket with Azure Database Migration Service to scale-up the migration agent to support your 1 TB+ database migrations.

- **Is cross-region migration supported?**
Azure Database Migration Service supports cross-region migrations, so you can migrate your single server to a flexible server that is deployed in a different region using DMS.  

- **Is cross-subscription migration supported?**
Azure Database Migration Service supports cross-subscription migrations, so you can migrate your single server to a flexible server that deployed on a different subscription using DMS.

- **Is cross-resource group subscription supported?**
Azure Database Migration Service supports cross-resource group migrations, so you can migrate your single server to a flexible server that is deployed in a different resource group using DMS.  

- **Is there cross-version support?**
Yes, migration from lower version MySQL servers (v5.6 and above) to higher versions is supported.
