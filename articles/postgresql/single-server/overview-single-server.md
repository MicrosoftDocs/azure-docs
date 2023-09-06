---
title: Azure Database for PostgreSQL Single Server
description: Provides an overview of Azure Database for PostgreSQL Single Server.
ms.service: postgresql
ms.subservice: single-server
ms.topic: overview
ms.author: sunila
author: sunilagarwal
ms.custom: mvc, ignite-2022
ms.date: 06/24/2022
---

# Azure Database for PostgreSQL Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

[Azure Database for PostgreSQL](./overview.md) powered by the PostgreSQL community edition is available in two deployment modes:

- [Single Server](./overview-single-server.md)
- [Flexible Server](../flexible-server/overview.md)

In this article, we will provide an overview and introduction to core concepts of single server deployment model. To learn about flexible server deployment mode, see [flexible server overview](../flexible-server/overview.md).

## Overview

Single Server is a fully managed database service with minimal requirements for customizations of the database. The single server platform is designed to handle most of the database management functions such as patching, backups, high availability, security with minimal user configuration and control. The architecture is optimized to provide 99.99% availability on single availability zone. It supports community version of PostgreSQL 10 and 11. The service is generally available today in wide variety of [Azure regions](https://azure.microsoft.com/global-infrastructure/services/).

Single servers are best suited for cloud native applications designed to handle automated patching without the need for granular control on the patching schedule and custom PostgreSQL configuration settings.

## High availability

The single server deployment model is optimized for built-in high availability, and elasticity at reduced cost. The architecture separates compute and storage. The database engine runs on a proprietary compute container, while data files reside on Azure storage. The storage maintains three locally redundant synchronous copies of the database files ensuring data durability.

During planned or unplanned failover events, if the server goes down, the service maintains high availability of the servers using following automated procedure:

1. A new compute container is provisioned.
2. The storage with data files is mapped to the new container.
3. PostgreSQL database engine is brought online on the new compute container.
4. Gateway service ensures transparent failover ensuring no application side changes requires.

:::image type="content" source="./media/overview/overview-azure-postgres-single-server.png" alt-text="Azure Database for PostgreSQL Single Server":::

The typical failover time ranges from 60-120 seconds. The cloud native design of the single server service allows it to support 99.99% of availability eliminating the cost of passive hot standby.

Azure's industry leading 99.99% availability service level agreement (SLA), powered by a global network of Microsoft-managed datacenters, helps keep your applications running 24/7.

## Automated patching

The service performs automated patching of the underlying hardware, OS, and database engine. The patching includes security and software updates. For PostgreSQL engine, minor version upgrades are automatic and included as part of the patching cycle. There is no user action or configuration settings required for patching. The patching frequency is service managed based on the criticality of the payload. In general, the service follows monthly release schedule as part of the continuous integration and release. Users can subscribe to the [planned maintenance notification]() to receive notification of the upcoming maintenance 72 hours before the event.

## Automatic backups

The single server service automatically creates server backups and stores them in user configured locally redundant (LRS) or geo-redundant storage. Backups can be used to restore your server to any point-in-time within the backup retention period. The default backup retention period is seven days. The retention can be optionally configured up to 35 days. All backups are encrypted using AES 256-bit encryption. See [Backups](./concepts-backup.md) for details.

## Adjust performance and scale within seconds

The single server service is available in three SKU tiers: Basic, General Purpose, and Memory Optimized. The Basic tier is best suited for low-cost development and low concurrency workloads. The General Purpose and Memory Optimized are better suited for production workloads requiring high concurrency, scale, and predictable performance. You can build your first app on a small database for a few dollars a month, and then adjust the scale to meet the needs of your solution. The storage scaling is online and supports storage auto-growth. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements. You only pay for the resources you consume. See [Pricing tiers]() for details.

## Enterprise grade security, compliance, and governance

The single server service uses the FIPS 140-2 validated cryptographic module for storage encryption of data at-rest. Data, including backups, and temporary files created while running queries are encrypted. The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys can be system managed (default) or [customer managed](). The service encrypts data in-motion with transport layer security (SSL/TLS) enforced by default. The service supports TLS versions 1.2, 1.1 and 1.0 with an ability to enforce [minimum TLS version]().

The service allows private access to the servers using private link and provides Advanced threat protection feature. Advanced threat protection detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

In addition to native authentication, the single server service supports Azure Active Directory authentication. Azure AD authentication is a mechanism of connecting to the PostgreSQL servers using identities defined and managed in Azure AD. With Azure AD authentication, you can manage database user identities and other Azure services in a central location, which simplifies and centralizes access control.

[Audit logging]() (in preview) is available to track all database level activity.

The single server service is compliant with all the industry-leading certifications like FedRAMP, HIPAA, PCI DSS. Visit the [Azure Trust Center]() for information about Azure's platform security.

For more information about Azure Database for PostgreSQL security features, see the [security overview]().

## Monitoring and alerting

The single server service is equipped with built-in performance monitoring and alerting features. All Azure metrics have a one-minute frequency, and each metric provides 30 days of history. You can configure alerts on the metrics. The service allows configuring slow query logs and comes with a differentiated [Query store](./concepts-query-store.md) feature. Query Store simplifies performance troubleshooting by helping you quickly find the longest running and most resource-intensive queries. Using these tools, you can quickly optimize your workloads, and configure your server for best performance. See [Monitoring](./concepts-monitoring.md) for details.

## Migration

The service runs community version of PostgreSQL. This allows full application compatibility and requires minimal refactoring cost to migrate existing application developed on PostgreSQL engine to single server service. The migration to the single server can be performed using one of the following options:

- **Dump and Restore** – For offline migrations, where users can afford some downtime, dump and restore using community tools like Pg_dump and Pg_restore can provide fastest way to migrate. See [Migrate using dump and restore](./how-to-migrate-using-dump-and-restore.md) for details.
- **Azure Database Migration Service** – For seamless and simplified migrations to single server with minimal downtime, Azure Database Migration Service can be leveraged. See [DMS via portal](../../dms/tutorial-postgresql-azure-postgresql-online-portal.md) and [DMS via CLI](../../dms/tutorial-postgresql-azure-postgresql-online.md).

## Frequently Asked Questions

Will Flexible Server replace Single Server or will Single Server be retired soon?

We continue to support Single Server and encourage you to adopt Flexible Server which has richer capabilities such as zone resilient HA, predictable performance, maximum control, custom maintenance window, cost optimization controls and simplified developer experience suitable for your enterprise workloads. If we decide to retire any service, feature, API or SKU, you will receive advance notice including a migration or transition path. Learn more about Microsoft Lifecycle policies [here](/lifecycle/faq/general-lifecycle).

## Contacts

For any questions or suggestions you might have about working with Azure Database for PostgreSQL, send an email to the Azure Database for PostgreSQL Team ([@Ask Azure DB for PostgreSQL](mailto:AskAzureDBforPostgreSQL@service.microsoft.com)). This email address is not a technical support alias.

In addition, consider the following points of contact as appropriate:

- To contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To fix an issue with your account, file a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, create an entry via [UserVoice](https://feedback.azure.com/d365community/forum/c5e32b97-ee24-ec11-b6e6-000d3a4f0da0).

## Next steps

Now that you've read an introduction to Azure Database for PostgreSQL single server deployment mode, you're ready to:
- Create your first server.
