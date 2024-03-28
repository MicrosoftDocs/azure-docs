---
title: Migration service in Azure Database for PostgreSQL
description: Concepts about migrating into Azure Database for PostgreSQL - Flexible Server, including advantages, migration options.
author: hariramt
ms.author: hariramt
ms.reviewer: maghan
ms.date: 01/30/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# Migration service in Azure Database for PostgreSQL

[!INCLUDE [applies-to-postgresql-flexible-server](../../includes/applies-to-postgresql-flexible-server.md)]

The migration service in Azure Database for PostgreSQL simplifies the process of moving your PostgreSQL databases to Azure, offering migration options from an Azure Database for PostgreSQL single server, AWS RDS for PostgreSQL, on-premises servers, and Azure virtual machines (VMs). The migration service is designed to help you move to Azure Database for PostgreSQL - Flexible Server with ease and confidence.

Some advantages for using the migration service include:

- Managed migration service.
- Support for schema and data migrations.
- No complex setup.
- Simple to use portal/cli based migration experience.
- No limitations in terms of size of databases it can handle.


The below image provides a visual representation of the various PostgreSQL sources that can be migrated using migration service in Azure Database for PostgreSQL. It highlights the diversity of source environments, including on-premises databases, virtual machines, and cloud-hosted instances, which can be seamlessly transitioned to Azure Database for PostgreSQL.

:::image type="content" source="media/concepts-migration-service-postgresql/migrate-postgresql-sources.png" alt-text="Screenshot of different PostgreSQL sources.":::

Following is an overview of the migration process, specifically detailing the steps involved in migrating from Azure Database for PostgreSQL - Single Server to Azure Database for PostgreSQL - Flexible Server. The diagram illustrates the migration workflow and key stages of the migration, for a successful transition into the Azure Database for PostgreSQL - Flexible Server.

:::image type="content" source="media/concepts-migration-service-postgresql/concepts-flow-diagram.png" alt-text="Diagram that shows the migration from Single Server to Flexible Server." lightbox="media/concepts-migration-service-postgresql/concepts-flow-diagram.png":::

## Why choose flexible server?

Azure Database for PostgreSQL powered by the PostgreSQL community edition is available in this deployment mode: flexible server is the next-generation managed PostgreSQL service in Azure that provides maximum flexibility over your database and built-in cost-optimizations and offers several advantages over peer products.

- **[Superior performance](../../flexible-server/overview.md)** - Flexible server runs on Linux VM that is best suited to run PostgreSQL engine.

- **[Cost Savings](../../flexible-server/how-to-deploy-on-azure-free-account.md)** – Flexible server allows you to stop and start an on-demand server to lower your TCO. Your compute tier billing is stopped immediately, which allows you to have significant cost savings during development and testing and for time-bound predictable production workloads.

- **[Support for new PG versions](../../flexible-server/concepts-supported-versions.md)** - Flexible server supports all major PostgreSQL versions beginning with version 11.

- **Minimized Latency** – You can collocate your flexible server in the same availability zone as the application server, resulting in a minimal latency.

- **[Connection Pooling](../../flexible-server/concepts-pgbouncer.md)** - Flexible server has a built-in connection pooling mechanism using **pgBouncer** to support thousands of active connections with low overhead.

- **[Server Parameters](../../flexible-server/concepts-server-parameters.md)** - Flexible server offers a rich set of server parameters for configuration and tuning.

- **[Custom Maintenance Window](../../flexible-server/concepts-maintenance.md)** - You can schedule the maintenance window of the flexible server for a specific day and time of the week.

- **[High Availability](../../flexible-server/concepts-high-availability.md)** - Flexible server supports HA within the same availability zone and across availability zones by configuring a warm standby server in sync with the primary.

- **[Security](../../flexible-server/concepts-security.md)** - Flexible server offers multiple layers of information protection and encryption to protect your data.

- **Vector Search + Azure AI Extension** - With the integration of Vector Search and Azure AI extension for PostgreSQL, users can perform advanced search operations and leverage AI-driven insights directly within the database, further enhancing query capabilities and application intelligence. 

## How to migrate to Azure Database for PostgreSQL flexible server?

The options you can consider migrating from the source PostgreSQL instance to the Flexible server are:

**Offline migration** – In an offline migration, all applications connecting to your source instance are stopped, and the database(s) are copied to a flexible server.

**Online migration** - In an online migration, applications connecting to your source instance aren't stopped while database(s) are copied to a flexible server. The initial copy of the databases is followed by replication to keep the flexible server in sync with the source instance. A cutover is performed when the flexible server completely syncs with the source instance, resulting in minimal downtime.

The following table gives an overview of offline and online options.

| Option | PROs | CONs | Recommended For
|------|------|------|------|
| Offline | - Simple, easy, and less complex to execute.<br />- Very fewer chances of failure.<br />- No restrictions regarding database objects it can handle | Downtime to applications. | - Best for scenarios where simplicity and a high success rate are essential.<br>- Ideal for scenarios where the database can be taken offline without significant impact on business operations.<br>- Suitable for  databases when the migration process can be completed within a planned maintenance window. |
| Online | - Very minimal downtime to application. <br /> - Ideal for large databases and customers having limited downtime requirements. | - Replication used in online migration has multiple [restrictions](https://www.postgresql.org/docs/current/logical-replication-restrictions.html) (for example, Primary Keys needed in all tables). <br /> - Tough and more complex to execute than offline migration. <br /> - Greater chances of failure due to the complexity of migration. <br /> - There's an impact on the source instance's storage and computing if the migration runs for a long time. The impact needs to be monitored closely during migration. | - Best suited for businesses where continuity is critical and downtime must be kept to an absolute minimum.<br>- Recommended for databases when the migration process needs to occur without interrupting ongoing operations. |

The following table lists the various sources supported by the migration service.

| PostgreSQL Source Type | Offline Migration | Online Migration |
|------------------------|-------------------|------------------| 
| [Azure Database for PostgreSQL – Single server](../how-to-migrate-single-to-flexible-portal.md) | Supported | Supported |
| [AWS RDS for PostgreSQL](tutorial-migration-service-aws.md) | Supported | Planned for future release |
| [On-premises](tutorial-migration-service-iaas.md) | Supported | Planned for future release |
| [Azure VM](tutorial-migration-service-iaas.md) | Supported | Planned for future release |


:::image type="content" source="media/concepts-migration-service-postgresql/migrate-different-sources-option.png" alt-text="Screenshot of the migration setup showing different sources." lightbox="media/concepts-migration-service-postgresql/migrate-different-sources-option.png":::

## Advantages of the migration service in Azure Database for PostgreSQL Over Azure DMS (Classic)

Below are the key benefits of using this service for your PostgreSQL migrations:
- **Fully Managed Service**: The migration Service in Azure Database for PostgreSQL is a fully managed service, meaning that we handle the complexities of the migration process.
- **Comprehensive Migration**: Supports both schema and data migrations, ensuring a complete and accurate transfer of your entire database environment to Azure
- **Ease of Setup**: Designed to be user-friendly, eliminating complex setup procedures that can often be a barrier to starting a migration project.
- **No Data Size Constraints**: With the ability to handle databases of any size, the service surpasses the 1TB data migration limit of Azure DMS(Classic), making it suitable for all types of database migrations.
- **Addressing DMS(Classic) Limitations**: The migration service resolves many of the issues and limitations encountered with Azure DMS (Classic), leading to a more reliable migration process.
- **Interface Options**: Users can choose between a portal-based interface for an intuitive experience or a command-line interface (CLI) for automation and scripting, accommodating various user preferences.


## Get started

Get started with the migration service by using any of the following methods:

- [Migration from Azure Database for PostgreSQL - Single Server](tutorial-migration-service-single-to-flexible.md)
- [Migration from on-premises or IaaS](tutorial-migration-service-iaas.md)
- [Migration from AWS RDS for PostgreSQL](tutorial-migration-service-aws.md)

## Additional information

The migration service is a hosted solution where we use binary called [pgcopydb](https://github.com/dimitri/pgcopydb) that provides a fast and efficient way of copying databases from the source PostgreSQL instance to the target.

## Related content

- [Premigration validations](concepts-premigration-migration-service.md)
- [Migration from Azure Database for PostgreSQL - Single Server](tutorial-migration-service-single-to-flexible.md)
- [Migrate from on-premises and Azure VMs](tutorial-migration-service-iaas.md)
- [Migrate from AWS RDS for PostgreSQL](tutorial-migration-service-aws.md)
- [Network setup](how-to-network-setup-migration-service.md)
- [Known issues and limitations](concepts-known-issues-migration-service.md)
