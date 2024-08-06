---
title: Azure Database Migration Service tools matrix
description: Learn about the services and tools available to migrate databases and to support various phases of the migration process.
author: abhims14
ms.author: abhishekum
ms.reviewer: randolphwest
ms.date: 07/25/2024
ms.service: azure-database-migration-service
ms.topic: reference
ms.custom:
  - mvc
  - sql-migration-content
---

# Services and tools available for data migration scenarios

This article provides a matrix of the Microsoft and third-party services and tools available to assist you with various database and data migration scenarios and specialty tasks.

The following tables identify the services and tools you can use to plan for data migration and complete its various phases successfully.

> [!NOTE]  
> In the following tables, items marked with an asterisk (`*`) represent third-party tools.

## Business justification phase

| Source | Target | Discover /<br />Inventory | Target and SKU<br />recommendation | TCO/ROI and<br />Business case |
| --- | --- | --- | --- | --- |
| SQL Server | Azure SQL Database | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/)<br />[Cloudamize*](https://cloudamize.com/) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[DMA](/sql/dma/dma-overview)<br />[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br />[Cloudamize*](https://cloudamize.com/) | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| SQL Server | Azure SQL Managed Instance | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/)<br />[Cloudamize*](https://cloudamize.com/) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[DMA](/sql/dma/dma-overview)<br />[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br />[Cloudamize*](https://cloudamize.com/) | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| SQL Server | SQL Server on Azure VM | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/)<br />[Cloudamize*](https://cloudamize.com/) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[DMA](/sql/dma/dma-overview)<br />[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br />[Cloudamize*](https://cloudamize.com/) | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| SQL Server | Azure Synapse Analytics | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/)<br />[Cloudamize*](https://cloudamize.com/) | | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| Amazon RDS for SQL Server | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[DMA](/sql/dma/dma-overview) | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| Oracle | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br />[MigVisor*](https://solutionshub.epam.com/solution/migvisor-by-epam) | |
| Oracle | Azure Synapse Analytics | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | [SSMA](/sql/ssma/sql-server-migration-assistant) | |
| Oracle | Azure Database for PostgreSQL -<br />Single server | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | | |
| MongoDB | Azure Cosmos DB | [Cloudamize*](https://cloudamize.com/) | [Cloudamize*](https://cloudamize.com/) | |
| Cassandra | Azure Cosmos DB | | | |
| MySQL | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br />[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/) | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| MySQL | Azure Database for MySQL | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| Amazon RDS for MySQL | Azure Database for MySQL | | | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| PostgreSQL | Azure Database for PostgreSQL -<br />Single server | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| Amazon RDS for PostgreSQL | Azure Database for PostgreSQL -<br />Single server | | | [TCO Calculator](https://azure.microsoft.com/pricing/tco/calculator/) |
| DB2 | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | [SSMA](/sql/ssma/sql-server-migration-assistant) | |
| Access | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | [SSMA](/sql/ssma/sql-server-migration-assistant) | |
| Sybase - SAP ASE | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [Azure Migrate](https://azure.microsoft.com/services/azure-migrate/) | [SSMA](/sql/ssma/sql-server-migration-assistant) | |
| Sybase - SAP IQ | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | | | |

## Premigration phase

| Source | Target | App Data Access<br />Layer Assessment | Database<br />Assessment | Performance<br />Assessment |
| --- | --- | --- | --- | --- |
| SQL Server | Azure SQL Database | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [DMA](/sql/dma/dma-overview) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[DMA](/sql/dma/dma-overview)<br />[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br />[Cloudamize*](https://cloudamize.com/) | [DEA](https://www.microsoft.com/download/details.aspx?id=54090)<br />[Cloudamize*](https://cloudamize.com/) |
| SQL Server | Azure SQL Managed Instance | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [DMA](/sql/dma/dma-overview) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[DMA](/sql/dma/dma-overview)<br />[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br />[Cloudamize*](https://cloudamize.com/) | [DEA](https://www.microsoft.com/download/details.aspx?id=54090)<br />[Cloudamize*](https://cloudamize.com/) |
| SQL Server | SQL Server on Azure VM | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [DMA](/sql/dma/dma-overview) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[DMA](/sql/dma/dma-overview)<br />[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br />[Cloudamize*](https://cloudamize.com/) | [DEA](https://www.microsoft.com/download/details.aspx?id=54090)<br />[Cloudamize*](https://cloudamize.com/) |
| SQL Server | Azure Synapse Analytics | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) | | |
| Amazon RDS for SQL | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [DMA](/sql/dma/dma-overview) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[DMA](/sql/dma/dma-overview) | [DEA](https://www.microsoft.com/download/details.aspx?id=54090) |
| Oracle | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [SSMA](/sql/ssma/sql-server-migration-assistant) | [SSMA](/sql/ssma/sql-server-migration-assistant) | |
| Oracle | Azure Synapse Analytics | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [SSMA](/sql/ssma/sql-server-migration-assistant) | [SSMA](/sql/ssma/sql-server-migration-assistant) | |
| Oracle | Azure Database for PostgreSQL -<br />Single server | | [Ora2Pg*](https://ora2pg.darold.net/start.html) | |
| Oracle | Azure Database for PostgreSQL -<br />Flexible server | | [Ora2Pg*](https://ora2pg.darold.net/start.html) | |
| MongoDB | Azure Cosmos DB | | [Cloudamize*](https://cloudamize.com/) | [Cloudamize*](https://cloudamize.com/) |
| Cassandra | Azure Cosmos DB | | | |
| MySQL | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [SSMA](/sql/ssma/sql-server-migration-assistant) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br />[Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/) | |
| MySQL | Azure Database for MySQL | | | |
| Amazon RDS for MySQL | Azure Database for MySQL | | | |
| PostgreSQL | Azure Database for PostgreSQL -<br />Single server | | | |
| PostgreSQL | Azure Database for PostgreSQL -<br />Flexible server | | | |
| Amazon RDS for PostgreSQL | Azure Database for PostgreSQL -<br />Single server | | | |
| DB2 | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [SSMA](/sql/ssma/sql-server-migration-assistant) | [SSMA](/sql/ssma/sql-server-migration-assistant) | |
| Access | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | | [SSMA](/sql/ssma/sql-server-migration-assistant) | |
| Sybase - SAP ASE | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [DAMT](https://marketplace.visualstudio.com/items?itemName=ms-databasemigration.data-access-migration-toolkit) / [SSMA](/sql/ssma/sql-server-migration-assistant) | [SSMA](/sql/ssma/sql-server-migration-assistant) | |
| Sybase - SAP IQ | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | | | |

## Migration phase

| Source | Target | Schema | Data<br />(Offline) | Data<br />(Online) |
| --- | --- | --- | --- | --- |
| SQL Server | Azure SQL Database | [SQL Database Projects extension](/azure-data-studio/extensions/sql-database-project-extension)<br />[DMA](/sql/dma/dma-overview)<br />[Cloudamize*](https://cloudamize.com/) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[DMA](/sql/dma/dma-overview)<br />[Cloudamize*](https://cloudamize.com/) | [Cloudamize*](https://cloudamize.com/)<br />[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| SQL Server | Azure SQL Managed Instance | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[Cloudamize*](https://cloudamize.com/) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[Cloudamize*](https://cloudamize.com/) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[Cloudamize*](https://cloudamize.com/)<br />[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| SQL Server | SQL Server on Azure VM | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[DMA](/sql/dma/dma-overview)<br />[Cloudamize*](https://cloudamize.com/) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[DMA](/sql/dma/dma-overview)<br />[Cloudamize*](https://cloudamize.com/) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[Cloudamize*](https://cloudamize.com/)<br />[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| SQL Server | Azure Synapse Analytics | | | |
| Amazon RDS for SQL Server | Azure SQL Database | [SQL Database Projects extension](/azure-data-studio/extensions/sql-database-project-extension)<br />[DMA](/sql/dma/dma-overview) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[DMA](/sql/dma/dma-overview) | [Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Amazon RDS for SQL | Azure SQL Managed Instance | [Azure SQL Migration extension](migration-using-azure-data-studio.md) | [Azure SQL Migration extension](migration-using-azure-data-studio.md) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Amazon RDS for SQL Server | SQL Server on Azure VM | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[DMA](/sql/dma/dma-overview) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[DMA](/sql/dma/dma-overview) | [Azure SQL Migration extension](migration-using-azure-data-studio.md)<br />[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Oracle | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [SSMA](/sql/ssma/sql-server-migration-assistant)<br />[SharePlex*](https://www.quest.com/products/shareplex/)<br />[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br />[SharePlex*](https://www.quest.com/products/shareplex/)<br />[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [SharePlex*](https://www.quest.com/products/shareplex/)<br />[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Oracle | Azure Synapse Analytics | [SSMA](/sql/ssma/sql-server-migration-assistant)<br />[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br />[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [SharePlex*](https://www.quest.com/products/shareplex/)<br />[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Oracle | Azure Database for PostgreSQL -<br />Single server | [Ora2Pg*](https://ora2pg.darold.net/start.html)<br />[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [Ora2Pg*](https://ora2pg.darold.net/start.html)<br />[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) |<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Oracle | Azure Database for PostgreSQL -<br />Flexible server | [Ora2Pg*](https://ora2pg.darold.net/start.html)<br />[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [Ora2Pg*](https://ora2pg.darold.net/start.html)<br />[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) |<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| MongoDB | Azure Cosmos DB | [DMS](https://azure.microsoft.com/services/database-migration/)<br />[Cloudamize*](https://cloudamize.com/)<br />[Imanis Data*](https://azuremarketplace.microsoft.com/marketplace/apps/talena-inc.talena-solution-template?tab=Overview) | [DMS](https://azure.microsoft.com/services/database-migration/)<br />[Cloudamize*](https://cloudamize.com/)<br />[Imanis Data*](https://azuremarketplace.microsoft.com/marketplace/apps/talena-inc.talena-solution-template?tab=Overview) | [DMS](https://azure.microsoft.com/services/database-migration/)<br />[Cloudamize*](https://cloudamize.com/)<br />[Imanis Data*](https://azuremarketplace.microsoft.com/marketplace/apps/talena-inc.talena-solution-template?tab=Overview)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Cassandra | Azure Cosmos DB | [Imanis Data*](https://azuremarketplace.microsoft.com/marketplace/apps/talena-inc.talena-solution-template?tab=Overview) | [Imanis Data*](https://azuremarketplace.microsoft.com/marketplace/apps/talena-inc.talena-solution-template?tab=Overview) | [Imanis Data*](https://azuremarketplace.microsoft.com/marketplace/apps/talena-inc.talena-solution-template?tab=Overview) |
| MySQL | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [SSMA](/sql/ssma/sql-server-migration-assistant)<br />[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br />[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| MySQL | Azure Database for MySQL | [MySQL dump*](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html) | [DMS](https://azure.microsoft.com/services/database-migration/) | [MyDumper/MyLoader*](https://centminmod.com/mydumper.html) with [data-in replication](../mysql/concepts-data-in-replication.md)<br />[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Amazon RDS for MySQL | Azure Database for MySQL | [MySQL dump*](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html) | [DMS](https://azure.microsoft.com/services/database-migration/) | [MyDumper/MyLoader*](https://centminmod.com/mydumper.html) with [data-in replication](../mysql/concepts-data-in-replication.md)<br />[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| PostgreSQL | Azure Database for PostgreSQL -<br />Single server | [PG dump*](https://www.postgresql.org/docs/current/app-pgdump.html) | [PG dump*](https://www.postgresql.org/docs/current/app-pgdump.html) | [DMS](https://azure.microsoft.com/services/database-migration/)<br />[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Amazon RDS for PostgreSQL | Azure Database for PostgreSQL -<br />Single server | [PG dump*](https://www.postgresql.org/docs/current/app-pgdump.html) | [PG dump*](https://www.postgresql.org/docs/current/app-pgdump.html) | [DMS](https://azure.microsoft.com/services/database-migration/)<br />[Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| DB2 | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [SSMA](/sql/ssma/sql-server-migration-assistant)<br />[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br />[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Access | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [SSMA](/sql/ssma/sql-server-migration-assistant) | [SSMA](/sql/ssma/sql-server-migration-assistant) | [SSMA](/sql/ssma/sql-server-migration-assistant) |
| Sybase - SAP ASE | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [SSMA](/sql/ssma/sql-server-migration-assistant)<br />[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [SSMA](/sql/ssma/sql-server-migration-assistant)<br />[Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [Qlik*](https://www.qlik.com/us/products/qlik-replicate)<br />[Striim*](https://www.striim.com/partners/striim-and-microsoft-azure/) |
| Sybase - SAP IQ | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | [Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | [Ispirer*](https://www.ispirer.com/blog/migration-to-the-microsoft-technology-stack) | |

## Post-migration phase

| Source | Target | Optimize |
| --- | --- | --- |
| SQL Server | Azure SQL Database | [Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br />[Cloudamize*](https://cloudamize.com/) |
| SQL Server | Azure SQL Managed Instance | [Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br />[Cloudamize*](https://cloudamize.com/) |
| SQL Server | SQL Server on Azure VM | [Cloud Atlas*](https://www.unifycloud.com/cloud-migration-tool/)<br />[Cloudamize*](https://cloudamize.com/) |
| SQL Server | Azure Synapse Analytics | |
| RDS SQL | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | |
| Oracle | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | |
| Oracle | Azure Synapse Analytics | |
| Oracle | Azure Database for PostgreSQL -<br />Single server | |
| MongoDB | Azure Cosmos DB | [Cloudamize*](https://cloudamize.com/) |
| Cassandra | Azure Cosmos DB | |
| MySQL | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | |
| MySQL | Azure Database for MySQL | |
| Amazon RDS for MySQL | Azure Database for MySQL | |
| PostgreSQL | Azure Database for PostgreSQL -<br />Single server | |
| PostgreSQL | Azure Database for PostgreSQL -<br />Flexible server | |
| Amazon RDS for PostgreSQL | Azure Database for PostgreSQL -<br />Single server | |
| DB2 | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | |
| Access | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | |
| Sybase - SAP ASE | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | |
| Sybase - SAP IQ | Azure SQL Database, Azure SQL Managed Instance, SQL Server on Azure VM | |

## Related content

- [What is the Azure Database Migration Service](dms-overview.md)
