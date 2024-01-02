---
title: Overview - Azure Database for MySQL single server
description: Learn about the Azure Database for MySQL single server, a relational database service in the Microsoft cloud based on the MySQL Community Edition.
author: sudheeshgh
ms.author: sunaray
ms.service: mysql
ms.subservice: single-server
ms.custom: mvc
ms.topic: overview
ms.date: 06/20/2022
---

# Azure Database for MySQL single server

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

[Azure Database for MySQL](overview.md) powered by the MySQL community edition is available in two deployment modes:

- Flexible Server 
- Single Server

In this article, we'll provide an overview and introduction to core concepts of the Single Server deployment model. To learn about flexible server deployment mode, refer [flexible server overview](../flexible-server/index.yml). For information on how to decide what deployment option is appropriate for your workload, see [choosing the right MySQL server option in Azure](select-right-deployment-type.md).

## Overview
Azure Database for MySQL single server is a fully managed database service designed for minimal customization. The single server platform is designed to handle most of the database management functions such as patching, backups, high availability, security with minimal user configuration and control. The architecture is optimized for built-in high availability with 99.99% availability on single availability zone. It supports community version of MySQL 5.6 (retired), 5.7 and 8.0. The service is generally available today in wide variety of [Azure regions](https://azure.microsoft.com/global-infrastructure/services/).

Single servers are best suited **only for existing applications already leveraging single server**. For all new developments or migrations, Flexible Server would be the recommended deployment option. To learn about the differences between Flexible Server and Single Server deployment options, refer [select the right deployment option for you](select-right-deployment-type.md) documentation.

## High availability

The Single Server deployment model is optimized for built-in high availability, and elasticity at reduced cost. The architecture separates compute and storage. The database engine runs on a proprietary compute container, while data files reside on Azure storage. The storage maintains three locally redundant synchronous copies of the database files ensuring data durability. 

During planned or unplanned failover events, if the server goes down, the service maintains high availability of the servers using following automated procedure:

1. A new compute container is provisioned
2. The storage with data files is mapped to the new container 
3. MySQL database engine is brought online on the new compute container
4. Gateway service ensures transparent failover ensuring no application side changes requires. 
  
The typical failover time ranges from 60-120 seconds. The cloud native design of Single Server allows it to support 99.99% of availability eliminating the cost of passive hot standby.

Azure's industry leading 99.99% availability service level agreement (SLA), powered by a global network of Microsoft-managed datacenters, helps keep your applications running 24/7.

:::image type="content" source="media/single-server-overview/1-single-server-architecture.png" alt-text="Azure Database for MySQL - Single Server Architecture conceptual diagram"::: 

## Automated Patching

The service performs automated patching of the underlying hardware, OS, and database engine. The patching includes security and software updates. For MySQL engine, minor version upgrades are automatic and included as part of the patching cycle. There's no user action or configuration settings required for patching. The patching frequency is service managed based on the criticality of the payload. In general, the service follows monthly release schedule as part of the continuous integration and release. Users can subscribe to the [planned maintenance notification](concepts-monitoring.md) to receive notification of the upcoming maintenance 72 hours before the event.

## Automatic Backups

Single Server automatically creates server backups and stores them in user configured locally redundant or geo-redundant storage. Backups can be used to restore your server to any point-in-time within the backup retention period. The default backup retention period is seven days. The retention can be optionally configured up to 35 days. All backups are encrypted using AES 256-bit encryption. Refer to [Backups](concepts-backup.md) for details.

## Adjust performance and scale within seconds

Single Server is available in three SKU tiers: Basic, General Purpose, and Memory Optimized. The Basic tier is best suited for low-cost development and low concurrency workloads. The General Purpose and Memory Optimized are better suited for production workloads requiring high concurrency, scale, and predictable performance. You can build your first app on a small database for a few dollars a month, and then adjust the scale to meet the needs of your solution. The storage scaling is online and supports storage autogrowth. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements. You only pay for the resources you consume. See [Pricing tiers](./concepts-pricing-tiers.md) for details.

## Enterprise grade Security, Compliance, and Governance

Single Server uses the FIPS 140-2 validated cryptographic module for storage encryption of data at-rest. Data, including backups, and temporary files created while running queries are encrypted. The service uses the AES 256-bit cipher included in Azure storage encryption, and the keys can be system managed (default) or [customer managed](concepts-data-encryption-mysql.md). The service encrypts data in-motion with transport layer security (SSL/TLS) enforced by default. The service supports TLS versions 1.2, 1.1 and 1.0 with an ability to enforce [minimum TLS version](concepts-ssl-connection-security.md). 

The service allows private access to the servers using [private link](concepts-data-access-security-private-link.md) and offers threat protection through the optional [Microsoft Defender for open-source relational databases](../../defender-for-cloud/defender-for-databases-introduction.md) plan. Microsoft Defender for open-source relational databases detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases.

In addition to native authentication, Single Server supports [Microsoft Entra ID](../../active-directory/fundamentals/active-directory-whatis.md) authentication. Microsoft Entra authentication is a mechanism of connecting to the MySQL servers using identities defined and managed in Microsoft Entra ID. With Microsoft Entra authentication, you can manage database user identities and other Azure services in a central location, which simplifies and centralizes access control.

[Audit logging](concepts-audit-logs.md) is available to track all database level activity. 

Single Server is complaint with all the industry-leading certifications like FedRAMP, HIPAA, PCI DSS. Visit the [Azure Trust Center](https://www.microsoft.com/trustcenter/security) for information about Azure's platform security.

For more information about Azure Database for MySQL security features, see the [security overview](concepts-security.md).

## Monitoring and alerting

Single Server is equipped with built-in performance monitoring and alerting features. All Azure metrics have a one-minute frequency, and each metric provides 30 days of history. You can configure alerts on the metrics. The service allows configuring slow query logs and comes with a differentiated [Query store](concepts-query-store.md) feature. Query Store simplifies performance troubleshooting by helping you quickly find the longest running and most resource-intensive queries. Using these tools, you can quickly optimize your workloads, and configure your server for best performance. See [Monitoring](concepts-monitoring.md) for details.

## Migration

The service runs community version of MySQL. This allows full application compatibility and requires minimal refactoring cost to migrate existing application developed on MySQL engine to Single Server. The migration to the single server can be performed using one of the following options:

- **Dump and Restore** – For offline migrations, where users can afford some downtime, dump and restore using community tools like mysqldump/mydumper can provide fastest way to migrate. See [Migrate using dump and restore](concepts-migrate-dump-restore.md) for details. 
- **Azure Database Migration Service** – For seamless and simplified offline migrations to single server with high speed data migration, [Azure Database Migration Service](../../dms/tutorial-mysql-azure-mysql-offline-portal.md) can be leveraged. 
- **Data-in replication** – For minimal downtime migrations, data-in replication, which relies on binlog based replication can also be leveraged. Data-in replication is preferred for minimal downtime migrations by hands-on experts looking for more control over migration. See [data-in replication](concepts-data-in-replication.md) for details.

## Contacts

For any questions or suggestions you might have about working with Azure Database for MySQL, send an email to the Azure Database for MySQL Team ([@Ask Azure DB for MySQL](mailto:AskAzureDBforMySQL@service.microsoft.com)). This email address isn't a technical support alias.

In addition, consider the following points of contact as appropriate:

- To contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To fix an issue with your account, file a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, create an entry via [UserVoice](https://feedback.azure.com/d365community/forum/47b1e71d-ee24-ec11-b6e6-000d3a4f0da0).

## Next steps

Now that you've read an introduction to Azure Database for MySQL - Single Server deployment mode, you're ready to:

- Create your first server.
  - [Create an Azure Database for MySQL server using Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md)
  - [Create an Azure Database for MySQL server using Azure CLI](quickstart-create-mysql-server-database-using-azure-cli.md)
  - [Azure CLI samples for Azure Database for MySQL](sample-scripts-azure-cli.md)

- Build your first app using your preferred language:
  - [Python](./connect-python.md)
  - [Node.JS](./connect-nodejs.md)
  - [Java](./connect-java.md)
  - [Ruby](./connect-ruby.md)
  - [PHP](./connect-php.md)
  - [.NET (C#)](./connect-csharp.md)
  - [Go](./connect-go.md)
