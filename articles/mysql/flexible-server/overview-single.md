---
title: Overview
description: Learn about Azure Database for MySQL - Flexible Server, a relational database service in the Microsoft cloud based on the MySQL Community Edition.
author: sudheeshgh
ms.author: sunaray
ms.service: mysql
ms.subservice: flexible-server
ms.custom: mvc
ms.topic: overview
ms.date: 06/20/2022 
---

# What is Azure Database for MySQL - Flexible Server?

[!INCLUDE[applies-to-mysql-single-flexible-server](../includes/applies-to-mysql-single-flexible-server.md)]

Azure Database for MySQL flexible server is a relational database service in the Microsoft cloud based on the [MySQL Community Edition](https://www.mysql.com/products/community/) (available under the GPLv2 license) database engine, versions 5.6 (retired), 5.7, and 8.0. Azure Database for MySQL flexible server delivers:

- Zone redundant and same zone high availability.
- Maximum control with ability to select your scheduled maintenance window.
- Data protection using automatic backups and point-in-time-restore for up to 35 days.
- Automated patching and maintenance for underlying hardware, operating system and database engine to keep the service secure and up to date.
- Predictable performance, using inclusive pay-as-you-go pricing.
- Elastic scaling within seconds.
- Cost optimization controls with low cost burstable SKU and ability to stop/start server.
- Enterprise grade security, industry-leading compliance, and privacy to protect sensitive data at-rest and in-motion.
- Monitoring and automation to simplify management and monitoring for large-scale deployments.
- Industry-leading support experience.

These capabilities require almost no administration and all are provided at no extra cost. They allow you to focus on rapid app development and accelerating your time to market rather than allocating precious time and resources to managing virtual machines and infrastructure. In addition, you can continue to develop your application with the open-source tools and platform of your choice to deliver with the speed and efficiency your business demands, all without having to learn new skills.

:::image type="content" source="media/overview-single/1-azure-db-for-mysql-conceptual-diagram.png" alt-text="Azure Database for MySQL flexible server conceptual diagram.":::

## Deployment models

Azure Database for MySQL powered by the MySQL community edition is available in two deployment modes:
- Azure Database for MySQL flexible server
- Azure Database for MySQL single server

### Azure Database for MySQL flexible server

Azure Database for MySQL flexible server is a fully managed production-ready database service designed for more granular control and flexibility over database management functions and configuration settings. The flexible server architecture allows users to opt for high availability within a single availability zone and across multiple availability zones. Azure Database for MySQL flexible server provides better cost optimization controls with the ability to stop/start server and burstable compute tier, ideal for workloads that don't need full compute capacity continuously. Azure Database for MySQL flexible server also supports reserved instances allowing you to save up to 63% cost, ideal for production workloads with predictable compute capacity requirements. The service supports community version of MySQL 5.7 and 8.0. The service is generally available today in a wide variety of [Azure regions](overview.md#azure-regions).

The Azure Database for MySQL flexible server deployment option offers three compute tiers: Burstable, General Purpose, and Memory Optimized. Each tier offers different compute and memory capacity to support your database workloads. You can build your first app on a burstable tier for a few dollars a month, and then adjust the scale to meet the needs of your solution. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements. You only pay for the resources you need, and only when you need them. See [Compute and Storage](concepts-compute-storage.md) for details.

Flexible servers are best suited for
- Ease of deployments, simplified scaling and low database management overhead for functions like backups, high availability, security and monitoring
- Application developments requiring community version of MySQL with better control and customizations
- Production workloads with same-zone, zone redundant high availability and managed maintenance windows
- Simplified development experience 
- Enterprise grade security

For detailed overview of flexible server deployment mode, refer to [Azure Database for MySQL flexible server overview](overview.md). For latest updates on Azure Database for MySQL flexible server, refer to [What's new in Azure Database for MySQL flexible server](whats-new.md).

### Azure Database for MySQL single server

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Azure Database for MySQL single server is a fully managed database service designed for minimal customization. The single server platform is designed to handle most of the database management functions such as patching, backups, high availability, security with minimal user configuration and control. The architecture is optimized for built-in high availability with 99.99% availability on single availability zone. It supports community version of MySQL 5.6 (retired), 5.7 and 8.0. The service is generally available today in a wide variety of [Azure regions](https://azure.microsoft.com/global-infrastructure/services/).

Single servers are best suited **only for existing applications already leveraging single server**. For all new developments or migrations, Azure Database for MySQL flexible server would be the recommended deployment option. To learn about the differences between flexible server and single server deployment options, refer to [select the right deployment option](../select-right-deployment-type.md).

## Contacts
For any questions or suggestions you might have about working with Azure Database for MySQL flexible server, send an email to the Azure Database for MySQL flexible server team ([@Ask Azure Database for MySQL flexible server](mailto:AskAzureDBforMySQL@service.microsoft.com)). This email address isn't a technical support alias.

In addition, consider the following points of contact as appropriate:

- To contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To fix an issue with your account, file a [support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, create an entry via [UserVoice](https://feedback.azure.com/d365community/forum/47b1e71d-ee24-ec11-b6e6-000d3a4f0da0).

## Next steps

Learn more about the two deployment modes for Azure Database for MySQL flexible server and choose the right options based on your needs.

- [Azure Database for MySQL flexible server](../index.yml)
- [Choose the right MySQL deployment option for your workload](../select-right-deployment-type.md)
