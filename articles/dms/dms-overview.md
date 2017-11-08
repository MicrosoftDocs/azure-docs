---
title: Azure Database Migration Service Overview | Microsoft Docs
description: Overview of the Azure Database Migration Service, which provides seamless migrations from many database sources to Azure Data platforms.
services: database-migration
author: HJToland3
ms.author: jtoland
manager: 
ms.reviewer: 
ms.service: database-migration
ms.workload: data-services
ms.topic: article
ms.date: 11/08/2017
---
# What is the Azure Database Migration Service?
The Azure Database Migration Service is a fully managed service designed to enable seamless migrations from multiple database sources to Azure Data platforms with minimal downtime. The service is currently in Public Preview, with development efforts focused on:

- Reliability and performance.
- Iterative addition of source-target pairs.
- Continued investment in friction-free migrations.

## Integrates Data Migration Assistant
Azure Database Migration Service integrates some functionality of our existing tools and services.  It provides customers with a comprehensive, highly available solution. Azure Database Migration Service uses [Data Migration Assistant](http://aka.ms/dma) to provide assessment reports.  These recommendations guide you through the changes that are required prior to performing a migration. It's up to you to perform any remediation required. When you are ready to begin the migration process, Azure Database Migration Service performs all the associated steps. You can fire and forget your migration projects with the peace of mind of knowing that the process takes advantage of best practices determined by Microsoft. 


## Next steps
- See the [pricing page](https://azure.microsoft.com/pricing/details/dms/) for costs and pricing tiers.
- Get started by [migrating the AdventureWorks2014 database from SQL Server to Azure SQL](/quickstart-sql-server-to-azure-sql.md).
- Request a [preview of DMS](https://aka.ms/get-dms)
