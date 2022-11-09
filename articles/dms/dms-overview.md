---
title: What is Azure Database Migration Service? 
description: Overview of Azure Database Migration Service, which provides seamless migrations from many database sources to Azure Data platforms.
services: database-migration
author: croblesm
ms.author: roblescarlos
manager: craigg
ms.reviewer: craigg
ms.service: dms
ms.workload: data-services
ms.topic: overview
ms.date: 09/28/2021
---
# What is Azure Database Migration Service?

Azure Database Migration Service is a fully managed service designed to enable seamless migrations from multiple database sources to Azure data platforms with minimal downtime (online migrations).

[!INCLUDE [database-migration-service-ads](../../includes/database-migration-service-ads.md)]

## Migrate databases to Azure with familiar tools

Azure Database Migration Service integrates some of the functionality of our existing tools and services. It provides customers with a comprehensive, highly available solution. The service uses the [Data Migration Assistant](/sql/dma/dma-overview) to generate assessment reports that provide recommendations to guide you through the required changes before a migration. It's up to you to perform any remediation required. Azure Database Migration Service performs all the required steps when ready to begin the migration process. Knowing that the process takes advantage of Microsoft's best practices, you can fire and forget your migration projects with peace of mind. 

> [!NOTE]
> Using Azure Database Migration Service to perform an online migration requires creating an instance based on the Premium pricing tier.

## Regional availability

For up-to-date info about the regional availability of Azure Database Migration Service, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/?products=database-migration).

## Pricing

For up-to-date info about Azure Database Migration Service pricing, see [Azure Database Migration Service pricing](https://azure.microsoft.com/pricing/details/database-migration/).

## Next steps

* [Status of migration scenarios supported by Azure Database Migration Service](./resource-scenario-status.md)
* [Services and tools available for data migration scenarios](./dms-tools-matrix.md)
* [Migrate databases with Azure SQL Migration extension for Azure Data Studio](./migration-using-azure-data-studio.md)
* [FAQ about using Azure Database Migration Service](./faq.yml)