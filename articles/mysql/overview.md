---
title: Overview - Azure Database for MySQL
description: Learn about the Azure Database for MySQL service, a relational database service in the Microsoft cloud based on the MySQL Community Edition.
author: savjani
ms.service: mysql
ms.author: pariks
ms.custom: mvc
ms.topic: overview
ms.date: 3/18/2020
---

# What is Azure Database for MySQL?

Azure Database for MySQL is a relational database service in the Microsoft cloud based on the [MySQL Community Edition](https://www.mysql.com/products/community/) (available under the GPLv2 license) database engine, versions 5.6, 5.7, and 8.0. Azure Database for MySQL delivers:

- Built-in high availability.
- Data protection using automatic backups and point-in-time-restore for up to 35 days.
- Automated maintenance for underlying hardware, operating system and database engine to keep the service secure and up to date.
- Predictable performance, using inclusive pay-as-you-go pricing.
- Elastic scaling within seconds.
- Cost optimization controls with ability to stop/start server. 
- Enterprise grade security and industry-leading compliance to protect sensitive data at-rest and in-motion.
- Monitoring and automation to simplify management and monitoring for large-scale deployments.
- Industry-leading support experience.

These capabilities require almost no administration and all are provided at no additional cost. They allow you to focus on rapid app development and accelerating your time to market rather than allocating precious time and resources to managing virtual machines and infrastructure. In addition, you can continue to develop your application with the open-source tools and platform of your choice to deliver with the speed and efficiency your business demands, all without having to learn new skills.

:::image type="content" source="media/overview/1-azure-db-for-mysql-conceptual-diagram.png" alt-text="Azure Database for MySQL conceptual diagram":::

## Deployment models

Azure Database for MySQL powered by the MySQL community edition is available in two deployment modes:
- Single Server 
- Flexible Server (Preview)
  
### Azure Database for MySQL - Single Server

Azure Database for MySQL Single Server is a fully managed database service with minimal requirements for customizations of database. The single server platform is designed to handle most of the database management functions such as patching, backups, high availability, security with minimal user configuration and control. The architecture is optimized for built-in high availability with 99.99% availability on single availability zone. It supports community version of MySQL 5.6, 5.7 and 8.0. The service is generally available today in wide variety of [Azure regions](https://azure.microsoft.com/global-infrastructure/services/).

The Single Server deployment option offers three pricing tiers: Basic, General Purpose, and Memory Optimized. Each tier offers different resource capabilities to support your database workloads. You can build your first app on a small database for a few dollars a month, and then adjust the scale to meet the needs of your solution. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements. You only pay for the resources you need, and only when you need them. See [Pricing tiers](concepts-pricing-tiers.md) for details.

Single servers are best suited for cloud native applications designed to handle automated patching without the need for granular control on the patching schedule and custom MySQL configuration settings. 

For detailed overview of single server deployment mode, refer [single server overview](single-server-overview.md).

### Azure Database for MySQL - Flexible Server (Preview)

Azure Database for MySQL Flexible Server is a fully managed database service designed to provide more granular control and flexibility over database management functions and configuration settings. In general, the service provides more flexibility and customizations based on the user requirements. The flexible server architecture allows users to opt for high availability within single availability zone and across multiple availability zones. Flexible servers provides better cost optimization controls with the ability to stop/start server and burstable compute tier, ideal for workloads that do not need full compute capacity continuously. The service supports community version of MySQL 5.7 and 8.0. The service is currently in public preview, available today in wide variety of [Azure regions](https://azure.microsoft.com/global-infrastructure/services/).

Flexible servers are best suited for 
- Application developments requiring better control and customizations.
- Zone redundant high availability
- Managed maintenance windows

For detailed overview of flexible server deployment mode, refer [flexible server overview](flexible-server/overview.md).

## Contacts
For any questions or suggestions you might have about working with Azure Database for MySQL, send an email to the Azure Database for MySQL Team ([@Ask Azure DB for MySQL](mailto:AskAzureDBforMySQL@service.microsoft.com)). This email address is not a technical support alias.

In addition, consider the following points of contact as appropriate:

- To contact Azure Support, [file a ticket from the Azure portal](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade).
- To fix an issue with your account, file a [support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, create an entry via [UserVoice](https://feedback.azure.com/forums/597982-azure-database-for-mysql).

## Next steps

Learn more about the two deployment modes for Azure Database for MySQL and choose the right options based on your needs.

- [Single Server](single-server/index.yml)
- [Flexible Server](flexible-server/index.yml)
- [Choose the right MySQL deployment option for your workload](select-right-deployment-type.md)
