---
title: Overview of Azure Database for PostgreSQL relational database service
description: Provides an overview of Azure Database for PostgreSQL relational database service.
author: jonels-msft
ms.author: jonels
ms.custom: mvc
ms.service: postgresql
ms.topic: overview
ms.date: 05/06/2019
---
# What is Azure Database for PostgreSQL?
Azure Database for PostgreSQL is a relational database service in the Microsoft cloud built for developers. It is based on the community version of open-source [PostgreSQL](https://www.postgresql.org/) database engine, and is available in two deployment options: Single Server and Hyperscale (Citus) (preview).

## Azure Database for PostgreSQL - Single Server
The Single Server deployment option delivers:

- Built-in high availability with no additional cost (99.99% SLA)
- Predictable performance, using inclusive pay-as-you-go pricing
- Vertical scale as needed within seconds
- Monitoring and alerting to quickly assess the impact of scaling
- Secured to protect sensitive data at-rest and in-motion
- Automatic backups and point-in-time-restore for up to 35 days
- Enterprise-grade security and compliance

All those capabilities require almost no administration, and all are provided at no additional cost. They allow you to focus on rapid application development and accelerating your time to market, rather than spending precious time and resources to manage virtual machines and infrastructure. You can continue to develop your application with the open-source tools and platform of your choice, without having to learn new skills.

The Single Server deployment option offers three pricing tiers: Basic, General Purpose, and Memory Optimized. Each tier offers different resource capabilities to support your database workloads. You can build your first app on a small database for a few dollars a month, and then adjust the scale to meet the needs of your solution. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements. You only pay for the resources you need, and only when you need them. See [Pricing tiers](concepts-pricing-tiers.md) for details.

## Azure Database for PostgreSQL - Hyperscale (Citus) (preview)
The Hyperscale (Citus) option horizontally scales queries across multiple machines using sharding. Its query engine parallelizes incoming SQL queries across these servers for faster responses on large datasets. It serves applications that require greater scale and performance, generally workloads that are approaching -- or already exceed -- 100 GB of data.

The Hyperscale (Citus) deployment option delivers:

- Horizontal scaling across multiple machines using sharding
- Query parallelization across these servers for faster responses on large datasets
- Excellent support for multi-tenant applications, real time operational analytics, and high throughput transactional workloads

Applications built for PostgreSQL can run distributed queries on Hyperscale (Citus) with standard [connection libraries](./concepts-connection-libraries.md) and minimal changes.

Note that Hyperscale (Citus) is in public preview, and as such does not yet offer an SLA.

## Data security
Azure Database for PostgreSQL upholds the Azure database services' tradition of data security. It has features that limit access, protect data at-rest and in-motion, and help you monitor activity. Visit the [Azure Trust Center](https://azure.microsoft.com/overview/trusted-cloud/) for information about Azure's platform security.

The Azure Database for PostgreSQL service uses storage encryption for data at-rest and is FIPS 140-2 compliant. Data, including backups, is encrypted on disk. The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys are system managed. Storage encryption is always on and can't be disabled. By default, the Azure Database for PostgreSQL service requires secure connections for data in-motion both across the network and between the database and client application.

## Contacts
For any questions or suggestions about working with Azure Database for PostgreSQL, send an email to the Azure Database for PostgreSQL Team ([@Ask Azure DB for PostgreSQL](mailto:AskAzureDBforPostgreSQL@service.microsoft.com)). This address is for general questions rather than support tickets.

In addition, consider these points of contact as appropriate:
- To contact Azure Support or fix an issue with your account, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To provide feedback or to request new features, create an entry via [UserVoice](https://feedback.azure.com/forums/597976-azure-database-for-postgresql).

## Next steps
- See the [pricing page](https://azure.microsoft.com/pricing/details/postgresql/) for cost comparisons and calculators.
- Get started by creating your first Azure Database for PostgreSQL [Single Server](./quickstart-create-server-database-portal.md) or [Hyperscale (Citus) (preview)](./quickstart-create-hyperscale-portal.md)
- Build your first app in Python, PHP, Ruby, C\#, Java, Node.js: [Connection libraries](./concepts-connection-libraries.md)
