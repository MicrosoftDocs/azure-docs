---
title: What is Azure Database for PostgreSQL
description: Provides an overview of Azure Database for PostgreSQL relational database service in the context of single server.
ms.service: postgresql
ms.subservice: single-server
ms.topic: overview
ms.author: sunila
author: sunilagarwal
ms.custom: mvc, ignite-2022
ms.date: 06/24/2022
adobe-target: true
---

# What is Azure Database for PostgreSQL?

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

> [!IMPORTANT]
> Azure Database for PostgreSQL - Hyperscale (Citus) is now [Azure Cosmos DB for PostgreSQL](../../cosmos-db/postgresql/introduction.md). To learn more about this change, see [Where is Hyperscale (Citus)?](../hyperscale/moved.md).

Azure Database for PostgreSQL is a relational database service in the Microsoft cloud based on the [PostgreSQL open source relational database](https://www.postgresql.org/). Azure Database for PostgreSQL delivers:

- Built-in high availability.
- Data protection using automatic backups and point-in-time-restore for up to 35 days.
- Automated maintenance for underlying hardware, operating system and database engine to keep the service secure and up to date.
- Predictable performance, using inclusive pay-as-you-go pricing.
- Elastic scaling within seconds.
- Enterprise grade security and industry-leading compliance to protect sensitive data at-rest and in-motion.
- Monitoring and automation to simplify management and monitoring for large-scale deployments.
- Industry-leading support experience.

:::image type="content" source="./media/overview/overview-what-is-azure-postgres.png" alt-text="Azure Database for PostgreSQL":::

These capabilities require almost no administration, and all are provided at no additional cost. They allow you to focus on rapid application development and accelerating your time to market rather than allocating precious time and resources to managing virtual machines and infrastructure. In addition, you can continue to develop your application with the open-source tools and platform of your choice to deliver with the speed and efficiency your business demands, all without having to learn new skills.

## Deployment models

Azure Database for PostgreSQL powered by the PostgreSQL community edition is available in three deployment modes:

- Single Server
- Flexible Server

### Azure Database for PostgreSQL - Single Server

Azure Database for PostgreSQL Single Server is a fully managed database service with minimal requirements for customizations of database. The single server platform is designed to handle most of the database management functions such as patching, backups, high availability, security with minimal user configuration and control. The architecture is optimized for built-in high availability with 99.99% availability on single availability zone. It supports community version of PostgreSQL 9.5, 9,6, 10, and 11. The service is generally available today in wide variety of [Azure regions](https://azure.microsoft.com/global-infrastructure/services/).

The Single Server deployment option offers three pricing tiers: Basic, General Purpose, and Memory Optimized. Each tier offers different resource capabilities to support your database workloads. You can build your first app on a small database for a few dollars a month, and then adjust the scale to meet the needs of your solution. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements. You only pay for the resources you need, and only when you need them. See [Pricing tiers](./concepts-pricing-tiers.md) for details.

Single servers are best suited for cloud native applications designed to handle automated patching without the need for granular control on the patching schedule and custom PostgreSQL configuration settings.

For detailed overview of single server deployment mode, refer [single server overview](./overview-single-server.md).

### Azure Database for PostgreSQL - Flexible Server

Azure Database for PostgreSQL Flexible Server is a fully managed database service designed to provide more granular control and flexibility over database management functions and configuration settings. In general, the service provides more flexibility and customizations based on the user requirements. The flexible server architecture allows users to opt for high availability within single availability zone and across multiple availability zones. Flexible Server provides better cost optimization controls with the ability to stop/start server and burstable compute tier, ideal for workloads that don’t need full-compute capacity continuously. The service currently supports community version of PostgreSQL 11, 12, 13 and 14, with plans to add newer versions soon. The service is generally available today in wide variety of Azure regions.

Flexible servers are best suited for

- Application developments requiring better control and customizations
- Cost optimization controls with ability to stop/start server
- Zone redundant high availability
- Managed maintenance windows

For a detailed overview of flexible server deployment mode, see [flexible server overview](../flexible-server/overview.md).

## Next steps

Learn more about the three deployment modes for Azure Database for PostgreSQL and choose the right options based on your needs.

- [Single Server](./overview-single-server.md)
- [Flexible Server](../flexible-server/overview.md)
