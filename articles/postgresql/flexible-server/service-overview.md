---
title: Service overview
description: Provides an overview of the Azure Database for PostgreSQL - Flexible Server relational database service.
author: gbowerman
ms.author: guybo
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: overview
ms.custom:
  - mvc
---

# What is Azure Database for PostgreSQL - Flexible Server?

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

> [!IMPORTANT]
> Azure Database for PostgreSQL - Hyperscale (Citus) is now [Azure Cosmos DB for PostgreSQL](../../cosmos-db/postgresql/introduction.md). To learn more about this change, see [Where is Hyperscale (Citus)?](../hyperscale/moved.md).

Azure Database for PostgreSQL flexible server is a relational database service in the Microsoft cloud based on the [PostgreSQL open source relational database](https://www.postgresql.org/). Azure Database for PostgreSQL flexible server delivers:

- Built-in high availability.
- Data protection using automatic backups and point-in-time-restore for up to 35 days.
- Automated maintenance for underlying hardware, operating system and database engine to keep the service secure and up to date.
- Predictable performance, using inclusive pay-as-you-go pricing.
- Elastic scaling within seconds.
- Enterprise grade security and industry-leading compliance to protect sensitive data at-rest and in-motion.
- Monitoring and automation to simplify management and monitoring for large-scale deployments.
- Industry-leading support experience.

:::image type="content" source="./media/service-overview/overview-what-is-azure-postgres.png" alt-text="Azure Database for PostgreSQL flexible server.":::

These capabilities require almost no administration, and all are provided at no extra cost. They allow you to focus on rapid application development and accelerating your time to market rather than allocating precious time and resources to managing virtual machines and infrastructure. In addition, you can continue to develop your application with the open-source tools and platform of your choice to deliver with the speed and efficiency your business demands, all without having to learn new skills.

## Deployment modes

Azure Database for PostgreSQL flexible server powered by the PostgreSQL community edition has two deployment modes:

- Azure Database for PostgreSQL flexible server 
- Azure Database for PostgreSQL single server 

### Azure Database for PostgreSQL flexible server

Azure Database for PostgreSQL flexible server is a fully managed database service designed to provide more granular control and flexibility over database management functions and configuration settings. In general, the service provides more flexibility and customizations based on the user requirements. The flexible server architecture allows users to opt for high availability within single availability zone and across multiple availability zones. Azure Database for PostgreSQL flexible server provides better cost optimization controls with the ability to stop/start server and burstable compute tier, ideal for workloads that don’t need full-compute capacity continuously. Azure Database for PostgreSQL flexible server currently supports community version of PostgreSQL [!INCLUDE [majorversionsascending](./includes/majorversionsascending.md)] with plans to add newer versions as they become available. Azure Database for PostgreSQL flexible server is generally available today in a wide variety of [Azure regions](overview.md#azure-regions).

Azure Database for PostgreSQL flexible server instances are best suited for:

- Application developments requiring better control and customizations
- Cost optimization controls with ability to stop/start server
- Zone redundant high availability
- Managed maintenance windows

For a detailed overview of Azure Database for PostgreSQL flexible server deployment mode, see [Azure Database for PostgreSQL - Flexible Server](overview.md).

### Azure Database for PostgreSQL single server

Azure Database for PostgreSQL single server is a fully managed database service with minimal requirements for customizations of database. The single server platform is designed to handle most of the database management functions such as patching, backups, high availability, security with minimal user configuration and control. The architecture is optimized for built-in high availability with 99.99% availability on single availability zone. It supports community version of PostgreSQL 9.5, 9,6, 10, and 11.

The Azure Database for PostgreSQL single server deployment option has three pricing tiers: Basic, General Purpose, and Memory Optimized. Each tier offers different resource capabilities to support your database workloads. You can build your first app on a small database for a few dollars a month, and then adjust the scale to meet the needs of your solution. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements. You only pay for the resources you need, and only when you need them. See [Pricing tiers](../single-server/concepts-pricing-tiers.md) for details.

Azure Database for PostgreSQL single server instances are best suited for cloud native applications designed to handle automated patching without the need for granular control on the patching schedule and custom PostgreSQL configuration settings.

For detailed overview of Azure Database for PostgreSQL single server deployment mode, see [Azure Database for PostgreSQL - Single Server](../single-server/overview-single-server.md).
