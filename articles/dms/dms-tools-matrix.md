---
title: Azure Database Migration Service tools matrix
description: Learn about the services and tools available to migrate databases and to support various phases of the migration process.
author: abhims14
ms.author: abhishekum
ms.reviewer: randolphwest
ms.date: 08/23/2023
ms.service: dms
ms.topic: reference
ms.custom:
  - mvc
  - ignite-2022
  - sql-migration-content
---

# Services and tools available for data migration scenarios

This article provides a matrix of the Microsoft and third-party services and tools available to assist you with various database and data migration scenarios and specialty tasks.

The following tables identify the services and tools you can use to plan for data migration and complete its various phases successfully.

> [!NOTE]
> In the following tables, items marked with an asterisk (*) represent third-party tools.

## Business justification phase

| Source | Target | Discover /<br/>Inventory | Target and SKU<br/>recommendation | TCO/ROI and<br/>Business case |
| --- | --- | --- | --- | --- |
| SQL Server | Azure SQL DB | [MAP Toolkit](/previous-versions//bb977556(v=technet.10))<br/>[Azure Migrate](https://azure.microsoft.com/services/azure-migrate/)<br/>[Cloudamize*](https://www.cloudamize.com/) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/> [DMA](/sql/dma/dma-overview)<br/>[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br/>[Cloudamize*](https://www.cloudamize.com/) | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
 SQL Server | Azure SQL MI | [MAP Toolkit](/previous-versions//bb977556(v=technet.10))<br/>[Azure Migrate](https://azure.microsoft.com/services/azure-migrate/)<br/>[Cloudamize*](https://www.cloudamize.com/) |  [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/> [DMA](/sql/dma/dma-overview)<br/>[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br/>[Cloudamize*](https://www.cloudamize.com/) | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| SQL Server | Azure SQL VM | [MAP Toolkit](/previous-versions//bb977556(v=technet.10))<br/>[Azure Migrate](https://azure.microsoft.com/services/azure-migrate/)<br/>[Cloudamize*](https://www.cloudamize.com/) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/> [DMA](/sql/dma/dma-overview)<br/>[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br/>[Cloudamize*](https://www.cloudamize.com/) | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| SQL Server | Azure Synapse Analytics | [MAP Toolkit](/previous-versions//bb977556(v=technet.10))<br/>[Azure Migrate](https://azure.microsoft.com/services/azure-migrate/)<br/>[Cloudamize*](https://www.cloudamize.com/) |  | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| Amazon RDS for SQL Server | Azure SQL DB, MI, VM |  |  [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/> [DMA](/sql/dma/dma-overview) | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| Oracle | Azure SQL DB, MI, VM | [MAP Toolkit](/previous-versions//bb977556(v=technet.10))<br/>[Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br/>[MigVisor*](https://www.migvisor.com/) |  |
| Oracle | Azure Synapse Analytics | [MAP Toolkit](/previous-versions//bb977556(v=technet.10))<br/>[Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | [SSMA](/sql/ssma/sql-server-migration-assistant) |  |
| Oracle | Azure DB for PostgreSQL -<br/>Single server | [MAP Toolkit](/previous-versions//bb977556(v=technet.10))<br/>[Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) |  |  |
| MongoDB | Azure Cosmos DB | [Cloudamize*](https://www.cloudamize.com/) | [Cloudamize*](https://www.cloudamize.com/) |  |
| Cassandra | Azure Cosmos DB |  |  |  |
| MySQL | Azure SQL DB, MI, VM | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br/>[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/) | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| MySQL | Azure DB for MySQL | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) |  | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| Amazon RDS for MySQL | Azure DB for MySQL |  |  | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| PostgreSQL | Azure DB for PostgreSQL -<br/>Single server | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) |  | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| Amazon RDS for PostgreSQL | Azure DB for PostgreSQL -<br/>Single server |  |  | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| DB2 | Azure SQL DB, MI, VM | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | [SSMA](/sql/ssma/sql-server-migration-assistant) |  |
| Access | Azure SQL DB, MI, VM | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | [SSMA](/sql/ssma/sql-server-migration-assistant) |  |
| Sybase - SAP ASE | Azure SQL DB, MI, VM | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | [SSMA](/sql/ssma/sql-server-migration-assistant) |  |
| Sybase - SAP IQ | Azure SQL DB, MI, VM |  |  |  |
| | | | | |

## Pre-migration phase

| Source | Target | App Data Access<br/>Layer Assessment | Database<br/>Assessment | Performance<br/>Assessment |
| --- | --- | --- | --- | --- |
| SQL Server | Azure SQL DB | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [DMA](/sql/dma/dma-overview) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[DMA](/sql/dma/dma-overview)<br/>[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br/>[Cloudamize*](https://www.cloudamize.com/) | [DEA](https://www.microsoft.com/download/details.aspx?id=54090)<br/>[Cloudamize*](https://www.cloudamize.com/) |
| SQL Server | Azure SQL MI | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [DMA](/sql/dma/dma-overview) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[DMA](/sql/dma/dma-overview)<br/>[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br/>[Cloudamize*](https://www.cloudamize.com/) | [DEA](https://www.microsoft.com/download/details.aspx?id=54090)<br/>[Cloudamize*](https://www.cloudamize.com/) |
| SQL Server | Azure SQL VM | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [DMA](/sql/dma/dma-overview) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[DMA](/sql/dma/dma-overview)<br/>[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br/>[Cloudamize*](https://www.cloudamize.com/) | [DEA](https://www.microsoft.com/download/details.aspx?id=54090)<br/>[Cloudamize*](https://www.cloudamize.com/) |
| SQL Server | Azure Synapse Analytics | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) |  |  |
| Amazon RDS for SQL | Azure SQL DB, MI, VM | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [DMA](/sql/dma/dma-overview) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[DMA](/sql/dma/dma-overview) | [DEA](https://www.microsoft.com/download/details.aspx?id=54090) |
| Oracle | Azure SQL DB, MI, VM | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [SSMA](/sql/ssma/sql-server-migration-assistant) | [SSMA](/sql/ssma/sql-server-migration-assistant) |  |
| Oracle | Azure Synapse Analytics | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [SSMA](/sql/ssma/sql-server-migration-assistant) | [SSMA](/sql/ssma/sql-server-migration-assistant) |  |
| Oracle | Azure DB for PostgreSQL -<br/>Single server |  | [Ora2Pg*](http://ora2pg.darold.net/start.html) |  |
| Oracle | Azure DB for PostgreSQL -<br/>Flexible server |  | [Ora2Pg*](http://ora2pg.darold.net/start.html) |  |
| MongoDB | Azure Cosmos DB |  | [Cloudamize*](https://www.cloudamize.com/) | [Cloudamize*](https://www.cloudamize.com/) |
| Cassandra | Azure Cosmos DB |  |  |  |
| MySQL | Azure SQL DB, MI, VM | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [SSMA](/sql/ssma/sql-server-migration-assistant) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br/>[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/) |  |
| MySQL | Azure DB for MySQL |  |  |  |
| Amazon RDS for MySQL | Azure DB for MySQL |  |  |  |
| PostgreSQL | Azure DB for PostgreSQL -<br/>Single server |  |  |  |
| PostgreSQL | Azure DB for PostgreSQL -<br/>Flexible server |  |  |  |
| Amazon RDS for PostgreSQL | Azure DB for PostgreSQL -<br/>Single server |  |  |  |
| DB2 | Azure SQL DB, MI, VM | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [SSMA](/sql/ssma/sql-server-migration-assistant) | [SSMA](/sql/ssma/sql-server-migration-assistant) |  |
| Access | Azure SQL DB, MI, VM |  | [SSMA](/sql/ssma/sql-server-migration-assistant) |  |
| Sybase - SAP ASE | Azure SQL DB, MI, VM | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [SSMA](/sql/ssma/sql-server-migration-assistant) | [SSMA](/sql/ssma/sql-server-migration-assistant) |  |
| Sybase - SAP IQ | Azure SQL DB, MI, VM |  | |  |
| | | | | |

## Migration phase

| Source | Target | Schema | Data<br/>(Offline) | Data<br/>(Online) |
| --- | --- | --- | --- | --- |
| SQL Server | Azure SQL DB | [SQL Database Projects extension](/sql/azure-data-studio/extensions/sql-database-project-extension)<br/>[DMA](/sql/dma/dma-overview)<br/>[Cloudamize*](https://www.cloudamize.com/) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[DMA](/sql/dma/dma-overview)<br/>[Cloudamize*](https://www.cloudamize.com/) | [Cloudamize*](https://www.cloudamize.com/)<br/>[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| SQL Server | Azure SQL MI | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[Cloudamize*](https://www.cloudamize.com/) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[Cloudamize*](https://www.cloudamize.com/) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[Cloudamize*](https://www.cloudamize.com/)<br/>[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| SQL Server | Azure SQL VM | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[DMA](/sql/dma/dma-overview)<br>[Cloudamize*](https://www.cloudamize.com/) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[DMA](/sql/dma/dma-overview)<br>[Cloudamize*](https://www.cloudamize.com/) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[Cloudamize*](https://www.cloudamize.com/)<br/>[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| SQL Server | Azure Synapse Analytics |  |  |  |
| Amazon RDS for SQL Server| Azure SQL DB | [SQL Database Projects extension](/sql/azure-data-studio/extensions/sql-database-project-extension)<br/>[DMA](/sql/dma/dma-overview) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[DMA](/sql/dma/dma-overview)| [Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Amazon RDS for SQL | Azure SQL MI |[Azure SQL Migration extension](./migration-using-azure-data-studio.md) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Amazon RDS for SQL Server | Azure SQL VM | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[DMA](/sql/dma/dma-overview) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[DMA](/sql/dma/dma-overview) | [Azure SQL Migration extension](./migration-using-azure-data-studio.md)<br/>[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Oracle | Azure SQL DB, MI, VM | [SSMA](/sql/ssma/sql-server-migration-assistant)<br/>[SharePlex*](https://www.quest.com/products/shareplex/)<br/>[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br/>[SharePlex*](https://www.quest.com/products/shareplex/)<br/>[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [SharePlex*](https://www.quest.com/products/shareplex/)<br/>[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Oracle | Azure Synapse Analytics | [SSMA](/sql/ssma/sql-server-migration-assistant)<br/>[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br/>[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [SharePlex*](https://www.quest.com/products/shareplex/)<br/>[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Oracle | Azure DB for PostgreSQL -<br/>Single server | [Ora2Pg*](http://ora2pg.darold.net/start.html)<br/>[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [Ora2Pg*](http://ora2pg.darold.net/start.html)<br/>[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | <br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Oracle | Azure DB for PostgreSQL -<br/>Flexible server | [Ora2Pg*](http://ora2pg.darold.net/start.html)<br/>[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [Ora2Pg*](http://ora2pg.darold.net/start.html)<br/>[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | <br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| MongoDB | Azure Cosmos DB | [DMS](https://azure.microsoft.com/services/database-migration/)<br/>[Cloudamize*](https://www.cloudamize.com/)<br/>[Imanis Data*](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/talena-inc.talena-solution-template?tab=Overview) | [DMS](https://azure.microsoft.com/services/database-migration/)<br/>[Cloudamize*](https://www.cloudamize.com/)<br/>[Imanis Data*](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/talena-inc.talena-solution-template?tab=Overview) | [DMS](https://azure.microsoft.com/services/database-migration/)<br/>[Cloudamize*](https://www.cloudamize.com/)<br/>[Imanis Data*](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/talena-inc.talena-solution-template?tab=Overview)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Cassandra | Azure Cosmos DB | [Imanis Data*](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/talena-inc.talena-solution-template?tab=Overview) | [Imanis Data*](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/talena-inc.talena-solution-template?tab=Overview) | [Imanis Data*](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/talena-inc.talena-solution-template?tab=Overview) |
| MySQL | Azure SQL DB, MI, VM | [SSMA](/sql/ssma/sql-server-migration-assistant)<br/>[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br/>[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| MySQL | Azure DB for MySQL | [MySQL dump*](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html) | [DMS](https://azure.microsoft.com/services/database-migration/) | [MyDumper/MyLoader*](https://centminmod.com/mydumper.html) with [data-in replication](../mysql/concepts-data-in-replication.md)<br/>[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Amazon RDS for MySQL | Azure DB for MySQL | [MySQL dump*](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html) | [DMS](https://azure.microsoft.com/services/database-migration/) | [MyDumper/MyLoader*](https://centminmod.com/mydumper.html) with [data-in replication](../mysql/concepts-data-in-replication.md)<br/>[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| PostgreSQL | Azure DB for PostgreSQL -<br/>Single server | [PG dump*](https://www.postgresql.org/docs/current/static/app-pgdump.html) | [PG dump*](https://www.postgresql.org/docs/current/static/app-pgdump.html) | [DMS](https://azure.microsoft.com/services/database-migration/)<br/>[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Amazon RDS for PostgreSQL | Azure DB for PostgreSQL -<br/>Single server | [PG dump*](https://www.postgresql.org/docs/current/static/app-pgdump.html) | [PG dump*](https://www.postgresql.org/docs/current/static/app-pgdump.html) | [DMS](https://azure.microsoft.com/services/database-migration/)<br/>[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| DB2 | Azure SQL DB, MI, VM | [SSMA](/sql/ssma/sql-server-migration-assistant)<br/>[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br/>[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Access | Azure SQL DB, MI, VM | [SSMA](/sql/ssma/sql-server-migration-assistant) | [SSMA](/sql/ssma/sql-server-migration-assistant) | [SSMA](/sql/ssma/sql-server-migration-assistant) |
| Sybase - SAP ASE | Azure SQL DB, MI, VM | [SSMA](/sql/ssma/sql-server-migration-assistant)<br/>[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br/>[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br/>[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Sybase - SAP IQ | Azure SQL DB, MI, VM | [Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | |
| | | | | |

## Post-migration phase

| Source | Target | Optimize |
| --- | --- | --- |
| SQL Server | Azure SQL DB | [Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br/>[Cloudamize*](https://www.cloudamize.com/) |
| SQL Server | Azure SQL MI | [Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br/>[Cloudamize*](https://www.cloudamize.com/) |
| SQL Server | Azure SQL VM | [Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br/>[Cloudamize*](https://www.cloudamize.com/) |
| SQL Server | Azure Synapse Analytics |  |
| RDS SQL | Azure SQL DB, MI, VM |  |
| Oracle | Azure SQL DB, MI, VM |  |
| Oracle | Azure Synapse Analytics |  |
| Oracle | Azure DB for PostgreSQL -<br/>Single server |  |
| MongoDB | Azure Cosmos DB | [Cloudamize*](https://www.cloudamize.com/) |
| Cassandra | Azure Cosmos DB |  |
| MySQL | Azure SQL DB, MI, VM |  |
| MySQL | Azure DB for MySQL |  |
| Amazon RDS for MySQL | Azure DB for MySQL |  |
| PostgreSQL | Azure DB for PostgreSQL -<br/>Single server |  |
| PostgreSQL | Azure DB for PostgreSQL -<br/>Flexible server |  |
| Amazon RDS for PostgreSQL | Azure DB for PostgreSQL -<br/>Single server |  |
| DB2 | Azure SQL DB, MI, VM |  |
| Access | Azure SQL DB, MI, VM |  |
| Sybase - SAP ASE | Azure SQL DB, MI, VM |  |
| Sybase - SAP IQ | Azure SQL DB, MI, VM |  |
| | | |

## Next steps

For an overview of the Azure Database Migration Service, see the article [What is the Azure Database Migration Service](dms-overview.md).
