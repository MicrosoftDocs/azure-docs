---
title: Overview of Azure Database for PostgreSQL - Hyperscale (Citus)
description: Provides an overview of the Hyperscale (Citus) deployment option
author: jonels-msft
ms.author: jonels
ms.custom: mvc
ms.service: postgresql
ms.topic: overview
ms.date: 09/01/2020
---

# What is Azure Database for PostgreSQL - Hyperscale (Citus)?

Azure Database for PostgreSQL is a relational database service in the Microsoft
cloud built for developers. It's based on the community version of open-source
[PostgreSQL](https://www.postgresql.org/) database engine.

Hyperscale (Citus) is a deployment option that horizontally scales queries
across multiple machines using sharding. Its query engine parallelizes incoming
SQL queries across these servers for faster responses on large datasets. It
serves applications that require greater scale and performance than other
deployment options: generally workloads that are approaching--or already
exceed--100 GB of data.

Hyperscale (Citus) delivers:

- Horizontal scaling across multiple machines using sharding
- Query parallelization across these servers for faster responses on large
  datasets
- Excellent support for multi-tenant applications, real-time operational
  analytics, and high throughput transactional workloads

Applications built for PostgreSQL can run distributed queries on Hyperscale
(Citus) with standard [connection
libraries](./concepts-connection-libraries.md) and minimal changes.

## Contacts

For any questions or suggestions about working with Azure Database for
PostgreSQL, send an email to the Azure Database for PostgreSQL Team ([@Ask
Azure DB for
PostgreSQL](mailto:AskAzureDBforPostgreSQL@service.microsoft.com)). This
address is for general questions rather than support tickets.

These contacts may also be useful:
- To contact Azure Support or fix an issue with your account, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To provide feedback or to request new features, create an entry via [UserVoice](https://feedback.azure.com/forums/597976-azure-database-for-postgresql).

## Next steps

- See the [pricing
  page](https://azure.microsoft.com/pricing/details/postgresql/) for cost
comparisons and calculators. Hyperscale (Citus) also offers prepaid Reserved
Instance discounts as well, see [Hyperscale RI
pricing](concepts-hyperscale-reserved-pricing.md) pages for details.
- Get started by [creating your
  first](./quickstart-create-hyperscale-portal.md) Azure Database for
PostgreSQL Hyperscale (Citus)server group 
