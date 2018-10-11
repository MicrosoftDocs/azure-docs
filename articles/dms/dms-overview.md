---
title: Azure Database Migration Service Overview | Microsoft Docs
description: Overview of the Azure Database Migration Service, which provides seamless migrations from many database sources to Azure Data platforms.
services: database-migration
author: pochiraju
ms.author: rajpo
manager: 
ms.reviewer: douglasl
ms.service: database-migration
ms.workload: data-services
ms.topic: article
ms.date: 10/09/2018
---
# What is the Azure Database Migration Service?
The Azure Database Migration Service is a fully managed service designed to enable seamless migrations from multiple database sources to Azure Data platforms with minimal downtime (online migrations).

## Migrate databases to Azure with familiar tools
The Azure Database Migration Service integrates some of the functionality of our existing tools and services. It provides customers with a comprehensive, highly available solution. The service uses the [Data Migration Assistant](http://aka.ms/dma) to generate assessment reports that provide recommendations to guide you through the changes required prior to performing a migration. It's up to you to perform any remediation required. When you're ready to begin the migration process, the Azure Database Migration Service performs all of the required steps. You can fire and forget your migration projects with peace of mind, knowing that the process takes advantage of best practices as determined by Microsoft.

> [!NOTE]
> Using the Azure Database Migration Service to perform an online migration requires creating an instance based on the Business Critical (Preview) pricing tier.

## Regional availability
The Azure Database Migration Service is currently available in the following regions:

![Azure Database Migration Service regional availability](media\overview\dms-regional-availability.png)

For the most up-to-date information about regional availability of the Azure Database Migration Service, on the Azure global infrastructure site, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).

## Next steps
- [Create an instance of the Azure Database Migration Service by using the Azure portal](quickstart-create-data-migration-service-portal.md).
- [Migrate SQL Server to Azure SQL Database](tutorial-sql-server-to-azure-sql.md).
- [Overview of prerequisites for using the Azure Database Migration Service](pre-reqs.md).
- [FAQ about using the Azure Database Migration Service](faq.md).
