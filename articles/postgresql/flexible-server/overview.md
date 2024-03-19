---
title: Overview
description: Provides an overview of Azure Database for PostgreSQL - Flexible Server.
author: sunilagarwal
ms.author: sunila
ms.reviewer: maghan
ms.date: 01/18/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: overview
ms.custom:
  - mvc
  - references_regions
---

# Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

[Azure Database for PostgreSQL](../single-server/overview.md) powered by the PostgreSQL community edition is available in two deployment modes:

- [Azure Database for PostgreSQL Flexible Server](overview.md)
- [Azure Database for PostgreSQL Single Server](../single-server/overview-single-server.md)

This article provides an overview and introduction to the core concepts of the Azure Database for PostgreSQL flexible server deployment model.
Whether you're just starting out or looking to refresh your knowledge, this introductory video offers a comprehensive overview of Azure Database for PostgreSQL flexible server, helping you get acquainted with its key features and capabilities.

>[!Video https://www.youtube.com/embed/NSEmJfUgNzE?si=8Ku9Z53PP455dICZ&amp;start=121]

## Overview

Azure Database for PostgreSQL flexible server is a fully managed database service designed to provide more granular control and flexibility over database management functions and configuration settings. The service generally provides more flexibility and server configuration customizations based on user requirements. The flexible server architecture allows users to collocate the database engine with the client tier for lower latency and choose high availability within a single availability zone and across multiple availability zones. Azure Database for PostgreSQL flexible server instances also provide better cost optimization controls with the ability to stop/start your server and a burstable compute tier ideal for workloads that don't need full compute capacity continuously. The service supports the community version of [PostgreSQL 11, 12, 13, 14, 15 and 16](./concepts-supported-versions.md). The service is available in various [Azure regions](https://azure.microsoft.com/global-infrastructure/services/).

:::image type="content" source="./media/overview/overview-flexible-server.png" alt-text="Diagram of Azure Database for PostgreSQL flexible server - Overview." lightbox="./media/overview/overview-flexible-server.png":::

Azure Database for PostgreSQL flexible server instances are best suited for

- Application developments requiring better control and customizations.
- Zone redundant high availability.
- Managed maintenance windows.

## Architecture and high availability

The Azure Database for PostgreSQL flexible server deployment model is designed to support high availability within a single availability zone and across multiple availability zones. The architecture separates compute and storage. The database engine runs on a container inside a Linux virtual machine, while data files reside on Azure storage. The storage maintains three locally redundant synchronous copies of the database files ensuring data durability.

If zone redundant high availability is configured, the service provisions and maintains a warm standby server across the availability zone within the same Azure region. The data changes on the source server are synchronously replicated to the standby server to ensure zero data loss. With zone redundant high availability, once the planned or unplanned failover event is triggered, the standby server comes online immediately and is available to process incoming transactions. This allows the service resiliency from availability zone failure within an Azure region that supports multiple availability zones, as shown in the picture below.

:::image type="content" source="./media/business-continuity/concepts-zone-redundant-high-availability-architecture.png" alt-text="Diagram of Zone redundant high availability." lightbox="./media/business-continuity/concepts-zone-redundant-high-availability-architecture.png":::

See [High availability](./concepts-high-availability.md) for more details.

## Automated patching with a managed maintenance window

The service performs automated patching of the underlying hardware, OS, and database engine. The patching includes security and software updates. For the PostgreSQL engine, minor version upgrades are included in the planned maintenance release. Users can configure the patching schedule to be system managed or define their custom schedule. During the maintenance schedule, the patch is applied, and the server may need to be restarted as part of the patching process to complete the update. With the custom schedule, users can make their patching cycle predictable and choose a maintenance window with minimum impact on the business. Generally, the service follows a monthly release schedule as part of the continuous integration and release.

## Automatic backups

Azure Database for PostgreSQL flexible server automatically creates server backups and stores them on the region's zone redundant storage (ZRS). Backups can restore your server to any point within the backup retention period. The default backup retention period is seven days. The retention can be optionally configured for up to 35 days. All backups are encrypted using AES 256-bit encryption. See [Backups](./concepts-backup-restore.md) for more details.

## Adjust performance and scale within seconds

Azure Database for PostgreSQL flexible server is available in three compute tiers: Burstable, General Purpose, and Memory Optimized. The Burstable tier is best suited for low-cost development and low concurrency workloads without continuous compute capacity. The General Purpose and Memory Optimized are better suited for production workloads requiring high concurrency, scale, and predictable performance. You can build your first application on a small database for a few dollars a month and then seamlessly adjust the scale to meet the needs of your solution.

## Stop/Start server to lower TCO

Azure Database for PostgreSQL flexible server allows you to stop and start the server on-demand to lower your TCO. The compute tier billing is stopped immediately when the server is stopped. This can allow significant cost savings during development, testing, and time-bound predictable production workloads. The server remains stopped for seven days unless restarted sooner.

## Enterprise-grade security

Azure Database for PostgreSQL flexible server uses the FIPS 140-2 validated cryptographic module for storage encryption of data at rest. Data are encrypted, including backups and temporary files created while running queries. The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys can be system-managed (default). Azure Database for PostgreSQL flexible server encrypts data in motion with transport layer security (SSL/TLS) enforced by default. The service enforces and supports TLS version 1.2 only.

Azure Database for PostgreSQL flexible server instances allow full private access to the servers using Azure virtual network (VNet integration). Servers in the Azure virtual network can only be reached and connected through private IP addresses. With VNet integration, public access is denied, and servers can't be reached using public endpoints.

## Monitor and alerting

Azure Database for PostgreSQL flexible server is equipped with built-in performance monitoring and alerting features. All Azure metrics have a one-minute frequency, each providing 30 days of history. You can configure alerts on the metrics. The service exposes host server metrics to monitor resource utilization and allows configuring slow query logs. Using these tools, you can quickly optimize your workloads and configure your server for the best performance.

## Built-in PgBouncer

An Azure Database for PostgreSQL flexible server instance has a [built-in PgBouncer](concepts-pgbouncer.md), a connection pooler. You can enable it and connect your applications to your Azure Database for PostgreSQL flexible server instance via PgBouncer using the same hostname and port 6432.

## Azure regions

One advantage of running your workload in Azure is global reach. Azure Database for PostgreSQL flexible server is currently available in the following Azure regions:

| Region | Intel V3/V4/V5/AMD Compute | Zone-Redundant HA | Same-Zone HA | Geo-Redundant backup |
| --- | --- | --- | --- | --- |
| Australia Central | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Australia Central 2 *| :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Australia East | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Australia Southeast | (v3/v4/v5 only) | :x: | :heavy_check_mark: | :heavy_check_mark: |
| Brazil South | :heavy_check_mark: (v3 only) | :x: $ | :heavy_check_mark: | :x: |
| Brazil Southeast * | :heavy_check_mark: (v3 only) | :x: $ | :heavy_check_mark: | :x: |
| Canada Central | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Canada East | :heavy_check_mark: | :x: | :heavy_check_mark: | :heavy_check_mark: |
| Central India | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Central US | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| China East 3 | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :heavy_check_mark: |
| China North 3 | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| East Asia | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: ** | :heavy_check_mark: | :heavy_check_mark: |
| East US | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| East US 2 | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| France Central | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| France South | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :heavy_check_mark: |
| Germany West Central | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: | :heavy_check_mark: |  :heavy_check_mark: |
| Germany North* | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: | :heavy_check_mark: |  :heavy_check_mark: |
| Israel Central | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :x: |
| Italy North | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :x: |
| Japan East | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Japan West | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :heavy_check_mark: |
| Jio India West | :heavy_check_mark: (v3 only) | :x: | :heavy_check_mark: | :x: |
| Korea Central | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: ** | :heavy_check_mark: | :heavy_check_mark: |
| Korea South | :heavy_check_mark: (v3/v4/v5 only) | :x: | :heavy_check_mark: | :heavy_check_mark: |
| Poland Central| :heavy_check_mark: (v3/v4 only) | :heavy_check_mark:  | :heavy_check_mark: | :x:|
| North Central US | :heavy_check_mark: | :x: | :heavy_check_mark: | :heavy_check_mark: |
| North Europe | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Norway East | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:  |
| Norway West * | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :heavy_check_mark:  |
| Qatar Central | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :x: |
| South Africa North | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| South Africa West* | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| South Central US | :heavy_check_mark: (v3/v4 only) | :x: $ | :heavy_check_mark: | :heavy_check_mark: |
| South India | :heavy_check_mark: (v3/v4/v5 only) | :x: | :heavy_check_mark: | :heavy_check_mark: |
| Southeast Asia | :heavy_check_mark:| :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Sweden Central | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Sweden South* | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Switzerland North | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| Switzerland West*| :heavy_check_mark: (v3/v4/v5 only) | :x: | :heavy_check_mark: | :heavy_check_mark: |
| UAE Central* | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :heavy_check_mark: |
| UAE North | :heavy_check_mark: (v3/v4/v5 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| US Gov Arizona | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :x: |
| US Gov Texas | :heavy_check_mark: (v3/v4 only) | :x: | :heavy_check_mark: | :heavy_check_mark: |
| US Gov Virginia | :heavy_check_mark: (v3/v4 only) | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark:|
| UK South | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: | :heavy_check_mark: |
| UK West | :heavy_check_mark: | :x: | :heavy_check_mark: | :heavy_check_mark: |
| West Central US | :heavy_check_mark: | :x: | :heavy_check_mark: | :heavy_check_mark: |
| West Europe | :heavy_check_mark: | :x: $ | :heavy_check_mark: | :heavy_check_mark: |
| West US | :heavy_check_mark: | :x: | :heavy_check_mark: | :heavy_check_mark: |
| West US 2 | :heavy_check_mark: (v3/v4 only) | :x: $ | :x: $ | :heavy_check_mark: |
| West US 3 | :heavy_check_mark: | :heavy_check_mark: ** | :heavy_check_mark: | :x: |

$ New Zone-redundant high availability deployments are temporarily blocked in these regions. Already provisioned HA servers are fully supported.

$$ New server deployments are temporarily blocked in these regions. Already provisioned servers are fully supported.

** Zone-redundant high availability can now be deployed when you provision new servers in these regions. Any existing servers deployed in AZ with *no preference* (which you can check on the Azure portal) before the region started to support AZ, even when you enable zone-redundant HA, the standby is provisioned in the same AZ (same-zone HA) as the primary server. To enable zone-redundant high availability, [follow the steps](how-to-manage-high-availability-portal.md#enabling-zone-redundant-ha-after-the-region-supports-az).

(*) Certain regions are access-restricted to support specific customer scenarios, such as in-country/region disaster recovery. These regions are available only upon request by creating a new support request.

<!-- We continue to add more regions for flexible servers. -->
> [!NOTE]  
> If your application requires Zone redundant HA and is unavailable in your preferred Azure region, consider using other regions within the same geography where Zone redundant HA is available, such as US East for US East 2, Central US for North Central US, etc.

## Migration

Azure Database for PostgreSQL flexible server runs the community version of PostgreSQL. This allows full application compatibility and requires a minimal refactoring cost to migrate an existing application developed on the PostgreSQL engine to Azure Database for PostgreSQL flexible server.

- **Azure Database for PostgreSQL singler server to Azure Database for PostgreSQL flexible server Migration tool (Preview)** - [This tool](../migrate/concepts-single-to-flexible.md) provides an easier migration capability from Azure Database for PostgreSQL single server to Azure Database for PostgreSQL flexible server.
- **Dump and Restore** – For offline migrations, where users can afford some downtime, dump and restore using community tools like pg_dump and pg_restore can provide the fastest way to migrate. See [Migrate using dump and restore](../howto-migrate-using-dump-and-restore.md) for details.
- **Azure Database Migration Service** – For seamless and simplified migrations to Azure Database for PostgreSQL flexible server with minimal downtime, Azure Database Migration Service can be used. See [DMS via portal](../../dms/tutorial-postgresql-azure-postgresql-online-portal.md) and [DMS via CLI](../../dms/tutorial-postgresql-azure-postgresql-online.md). You can migrate from your Azure Database for PostgreSQL single server instance to Azure Database for PostgreSQL flexible server. See this [DMS article](../../dms/tutorial-azure-postgresql-to-azure-postgresql-online-portal.md) for details.

## Frequently asked questions

### Will Azure Database for PostgreSQL flexible server replace Azure Database for PostgreSQL single server?

We continue to support Azure Database for PostgreSQL single server and encourage you to adopt Azure Database for PostgreSQL flexible server with richer capabilities such as zone resilient HA, predictable performance, maximum control, custom maintenance window, cost optimization controls, and simplified developer experience suitable for your enterprise workloads. If we decide to retire any service, feature, API or SKU, you receive advance notice, including a migration or transition path. Learn more about Microsoft Lifecycle policies [here](/lifecycle/faq/general-lifecycle).

### What is Microsoft's policy to address PostgreSQL engine defects?

Refer to  Microsoft's current policy [here](../../postgresql/flexible-server/concepts-supported-versions.md#managing-postgresql-engine-defects).

## Contacts

For any questions or suggestions you might have on Azure Database for PostgreSQL flexible server, send an email to the Azure Database for PostgreSQL flexible server team ([@Ask Azure DB for PostgreSQL](mailto:AskAzureDBforPostgreSQL@service.microsoft.com)).

> [!NOTE]  
> This email address isn't a technical support alias.

In addition, consider the following points of contact as appropriate:

- To contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To fix an issue with your account, file a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, create an entry via [UserVoice](https://feedback.azure.com/forums/597976-azure-database-for-postgresql).

## Next steps

Now that you've read an introduction to Azure Database for PostgreSQL flexible server deployment mode, you're ready to create your first server: [Create an Azure Database for PostgreSQL - Flexible Server using Azure portal](./quickstart-create-server-portal.md).
