---
title: Overview - Azure Database for MySQL - Flexible Server
description: Learn about the Azure Database for MySQL Flexible server, a relational database service in the Microsoft cloud based on the MySQL Community Edition.
author: savjani
ms.author: pariks
ms.service: mysql
ms.custom: mvc, references_regions
ms.topic: overview
ms.date: 08/10/2021
---
# Azure Database for MySQL - Flexible Server (Preview)

[[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]


Azure Database for MySQL powered by the MySQL community edition is available in two deployment modes:

- Single Server
- Flexible Server (Preview)

In this article, we'll provide an overview and introduction to core concepts of flexible server deployment model. For information on how to decide what deployment option is appropriate for your workload, see [choosing the right MySQL server option in Azure](./../select-right-deployment-type.md).

## Overview

Azure Database for MySQL Flexible Server is a fully managed database service designed to provide more granular control and flexibility over database management functions and configuration settings. In general, the service provides more flexibility and server configuration customizations based on the user requirements. The flexible server architecture allows users to opt for high availability within single availability zone and across multiple availability zones. Flexible servers also provide better cost optimization controls with ability to stop/start your server and burstable skus, ideal for workloads that don't need full compute capacity continuously. The service currently supports community version of MySQL 5.7 and 8.0. The service is currently in preview, available today in wide variety of [Azure regions](https://azure.microsoft.com/global-infrastructure/services/).

Flexible servers are best suited for:

- Application developments requiring better control and customizations.
- Zone redundant high availability
- Managed maintenance windows

![Flexible Server conceptual diagram](media/overview/1-flexible-server-conceptual-diagram.png) 

## High availability within and across availability zones

The flexible server deployment model is designed to support high availability within single availability zone and across multiple availability zones. The architecture separates compute and storage. The database engine runs on a Linux virtual machine, while data files reside on remote Azure premium storage. The storage maintains three locally redundant synchronous copies of the database files ensuring data durability at all times.

Within a single availability zone, if the server goes down due to planned or unplanned events, the service maintains high availability of the servers using following automated procedure:

1. A new compute VM is provisioned.
2. The storage with data files is mapped to the new Virtual Machine
3. MySQL database engine is brought online on the new Virtual Machine.
4. Client applications can reconnect once the server is ready to accept connections.

:::image type="content" source="media/overview/2-flexible-server-architecture.png" alt-text="Single Zone high availability conceptual diagram":::

If zone redundant high availability is configured, the service provisions and maintains a hot standby server across availability zone within the same Azure region. The data changes on the source server are synchronously replicated to the standby server to ensure zero data loss. With zone redundant high availability, once the planned or unplanned failover event is triggered, the standby server comes online immediately and is available to process incoming transactions. The typical failover time ranges from 60-120 seconds. This allows the service to support high availability and provide improved resiliency with tolerance for single availability zone failures in a given Azure region.

For more information, see [high availability concepts](concepts-high-availability.md).

:::image type="content" source="media/overview/3-flexible-server-overview-zone-redundant-ha.png" alt-text="Zone Redundant high availability conceptual diagram":::

## Automated patching with managed maintenance window

The service performs automated patching of the underlying hardware, OS, and database engine. The patching includes security and software updates. For MySQL engine, minor version upgrades are also included as part of the planned maintenance release. Users can configure the patching schedule to be system managed or define their custom schedule. During the maintenance schedule, the patch is applied and server may require a restart as part of the patching process to complete the update. With the custom schedule, users can make their patching cycle predictable and choose a maintenance window with minimum impact to the business. In general, the service follows monthly release schedule as part of the continuous integration and release.

See [Scheduled Maintenance](concepts-maintenance.md) for more details. 

## Automatic backups

The flexible server service automatically creates server backups and stores them in user configured locally redundant or geo-redundant storage. Backups can be used to restore your server to any point-in-time within the backup retention period. The default backup retention period is seven days. The retention can be optionally configured up to 35 days. All backups are encrypted using AES 256-bit encryption.

See [Backup concepts](concepts-backup-restore.md) to learn more.

## Network Isolation

You have two networking options to connect to your Azure Database for MySQL Flexible Server. The options are **private access (VNet integration)** and **public access (allowed IP addresses)**. 

- **Private access (VNet Integration)** – You can deploy your flexible server into your [Azure Virtual Network](../../virtual-network/virtual-networks-overview.md). Azure virtual networks provide private and secure network communication. Resources in a virtual network can communicate through private IP addresses.

  Choose the VNet Integration option if you want the following capabilities:

  - Connect from Azure resources in the same virtual network to your flexible server using private IP addresses
  - Use VPN or ExpressRoute to connect from non-Azure resources to your flexible server
  - No public endpoint

- **Public access (allowed IP addresses)** – You can deploy your flexible server with a public endpoint. The public endpoint is a publicly resolvable DNS address. The phrase "allowed IP addresses" refers to a range of IPs you choose to give permission to access your server. These permissions are called **firewall rules**.

See [Networking concepts](concepts-networking.md) to learn more.

## Adjust performance and scale within seconds

The flexible server service is available in three SKU tiers: Burstable, General Purpose, and Memory Optimized. The Burstable tier is best suited for low-cost development and low concurrency workloads that don't need full compute capacity continuously. The General Purpose and Memory Optimized are better suited for production workloads requiring high concurrency, scale, and predictable performance. You can build your first app on a small database for a few dollars a month, and then seamlessly adjust the scale to meet the needs of your solution. The storage scaling is online and supports storage autogrowth. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements. You only pay for the resources you consume. 

See [Compute and Storage concepts](concepts-compute-storage.md) to learn more.

## Scale out your read workload with up to 10 read replicas

MySQL is one of the popular database engines for running internet-scale web and mobile applications. Many of our customers use it for their online education services, video streaming services, digital payment solutions, e-commerce platforms, gaming services, news portals, government, and healthcare websites. These services are required to serve and scale as the traffic on the web or mobile application increases.

On the applications side, the application is typically developed in Java or PHP and migrated to run on [Azure virtual machine scale sets](../../virtual-machine-scale-sets/overview.md) or [Azure App Services](../../app-service/overview.md) or are containerized to run on [Azure Kubernetes Service (AKS)](../../aks/intro-kubernetes.md). With virtual machine scale set, App Service or AKS as underlying infrastructure, application scaling is simplified by instantaneously provisioning new VMs and replicating the stateless components of applications to cater to the requests but often, database ends up being a bottleneck as centralized stateful component.

The read replica feature allows you to replicate data from an Azure Database for MySQL flexible server to a read-only server. You can replicate from the source server to **up to 10 replicas**. Replicas are updated asynchronously using the MySQL engine's native [binary log (binlog) file position-based replication technology](https://dev.mysql.com/doc/refman/5.7/en/replication-features.html). You can use a load balancer proxy solution like [ProxySQL](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/load-balance-read-replicas-using-proxysql-in-azure-database-for/ba-p/880042) to seamlessly scale out your application workload to read replicas without any application refactoring cost. 

For more information, see [Read Replica concepts](concepts-read-replicas.md).

## Setup Hybrid or Multi-Cloud Data synchronization with Data-in replication

Data-in replication allows you to synchronize data from an external MySQL server into the Azure Database for MySQL Flexible service. The external server can be on-premises, in virtual machines, Azure Database for MySQL Single Server, or a database service hosted by other cloud providers. Data-in replication is based on the binary log (binlog) file position-based. The main scenarios to consider about using Data-in replication are:
* Hybrid Data Synchronization
* Multi-Cloud Synchronization
* Minimal downtime migration to Flexible Server

For more information, see [Data-in replication concepts](concepts-data-in-replication.md).


## Stop/Start server to optimize cost

The flexible server service allows you to stop and start server on-demand to optimize cost. The compute tier billing is stopped immediately when the server is stopped. This can allow you to have significant cost savings during development, testing and for time-bound predictable production workloads. The server remains in stopped state for seven days unless re-started sooner.

For more information, see [Server concepts](concept-servers.md).

## Enterprise grade security and privacy

The flexible server service uses the FIPS 140-2 validated cryptographic module for storage encryption of data at-rest. Data, including backups, and temporary files created while running queries are encrypted. The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys can be system managed (default).

The service encrypts data in-motion with transport layer security enforced by default. Flexible Server only supports encrypted connections using Transport Layer Security (TLS 1.2) and all incoming connections with TLS 1.0 and TLS 1.1 will be denied.

For more information, see [how to use encrypted connections to flexible servers](https://docs.mongodb.com/manual/tutorial/configure-ssl).

Flexible Server allows full private access to the servers using [Azure virtual network](../../virtual-network/virtual-networks-overview.md) (VNet) integration. Servers in Azure virtual network can only be reached and connected through private IP addresses. With VNet integration, public access is denied and servers cannot be reached using public endpoints.

For more information, see [Networking concepts](concepts-networking.md).

## Monitoring and alerting

The flexible server service is equipped with built-in performance monitoring and alerting features. All Azure metrics have a one-minute frequency, and each metric provides 30 days of history. You can configure alerts on the metrics. The service exposes host server metrics to monitor resources utilization and allows configuring slow query logs. Using these tools, you can quickly optimize your workloads, and configure your server for best performance.

For more information, see [Monitoring concepts](concepts-monitoring.md).

## Migration

The service runs the community version of MySQL. This allows full application compatibility and requires minimal refactoring cost to migrate existing applications developed on MySQL engine to Flexible Server. Migration to Flexible Server can be performed using the following option:

### Offline Migrations
*	Using Azure Data Migration Service when network bandwidth between source and Azure is good (for example: High speed ExpressRoute). Learn more with step by step instructions - [Migrate MySQL to Azure Database for MySQL offline using DMS - Azure Database Migration Service](../../dms/tutorial-mysql-azure-mysql-offline-portal.md)
*	Use mydumper/myloader to take advantage of compression settings to efficiently move data over low speed networks (such as public internet). Learn more with step by step instructions [Migrate large databases to Azure Database for MySQL using mydumper/myloader](../../mysql/concepts-migrate-mydumper-myloader.md)

### Online or Minimal downtime migrations
Use data-in replication with mydumper/myloader consistent backup/restore for initial seeding. Learn more with step by step instructions - [Tutorial: Minimal Downtime Migration of Azure Database for MySQL – Single Server to Azure Database for MySQL – Flexible Server](../../mysql/howto-migrate-single-flexible-minimum-downtime.md)

For more information, see [Migration Guide for Azure Database for MySQL](../../mysql/migrate/mysql-on-premises-azure-db/01-mysql-migration-guide-intro.md)

## Azure regions

One advantage of running your workload in Azure is its global reach. The flexible server for Azure Database for MySQL is available today in following Azure regions:

| Region | Availability | Zone redundant HA |
| --- | --- | --- |
| Australia East | :heavy_check_mark: | :heavy_check_mark: |
| Brazil South | :heavy_check_mark: | :x: |
| Canada Central | :heavy_check_mark: | :x: |
| Central US | :heavy_check_mark: | :x: |
| East US | :heavy_check_mark: | :heavy_check_mark: |
| East US 2 | :heavy_check_mark: | :heavy_check_mark: |
| France Central | :heavy_check_mark: | :heavy_check_mark:|
| Germany West Central | :heavy_check_mark: | :x: |
| Japan East | :heavy_check_mark: | :heavy_check_mark: |
| Korea Central | :heavy_check_mark: | :x: |
| North Europe | :heavy_check_mark: | :heavy_check_mark: |
| Southeast Asia | :heavy_check_mark: | :heavy_check_mark: |
| Switzerland North | :heavy_check_mark: | :x: |
| UK South | :heavy_check_mark: | :heavy_check_mark: |
| West US | :heavy_check_mark: | :x: |
| West US 2 | :heavy_check_mark: | :heavy_check_mark: |
| West Europe | :heavy_check_mark: | :heavy_check_mark: |
## Contacts

For any questions or suggestions you might have on Azure Database for MySQL flexible server, send an email to the Azure Database for MySQL Team ([@Ask Azure DB for MySQL](mailto:AskAzureDBforMySQL@service.microsoft.com)). This email address isn't a technical support alias.

In addition, consider the following points of contact as appropriate:

- To contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To fix an issue with your account, file a [support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, create an entry via [UserVoice](https://feedback.azure.com/forums/597982-azure-database-for-mysql).

## Next steps

Now that you've read an introduction to Azure Database for MySQL - Single Server deployment mode, you're ready to:

- Create your first server.
  - [Create an Azure Database for MySQL flexible server using Azure portal](quickstart-create-server-portal.md)
  - [Create an Azure Database for MySQL flexible server using Azure CLI](quickstart-create-server-cli.md)
  - [Manage an Azure Database for MySQL Flexible Server using the Azure CLI](how-to-manage-server-portal.md)

- Build your first app using your preferred language:
  - [Python](connect-python.md)
  - [PHP](connect-php.md)
