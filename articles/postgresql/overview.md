---
title: Overview of Azure Database for PostgreSQL relational database service | Microsoft Docs
description: Provides an overview of Azure Database for PostgreSQL relational database service.
services: postgresql
author: kamathsun
ms.author: sukamat
manager: jhubbard
editor: jasonwhowell
ms.custom: mvc
ms.service: postgresql-database
ms.topic: overview
ms.date: 05/31/2017
---
# What is Azure Database for PostgreSQL?

Azure Database for PostgreSQL is a relational database service in the Microsoft cloud built for developers based on the community version of open source [PostgreSQL](https://www.postgresql.org/) database engine. This service is in public preview. Azure Database for PostgreSQL delivers:
- Predictable performance at multiple service levels
- Dynamic scalability with no application downtime
- Built-in high availability
- Data protection

All those capabilities require almost no administration, and all are provided at no additional cost. These capabilities allow you to focus on rapid application development and accelerating your time to market, rather than allocating precious time and resources to managing virtual machines and infrastructure. In addition, you can continue to develop your application with the open source tools and platform of your choice, and deliver with the speed and efficiency your business demands without having to learn new skills. 

This article is an introduction to Azure Database for PostgreSQL core concepts and features related to performance, scalability, and manageability. See these quick starts to get you started:

- [Create an Azure Database for PostgreSQL using Azure portal](quickstart-create-server-database-portal.md)
- [Create an Azure Database for PostgreSQL using the Azure CLI](quickstart-create-server-database-azure-cli.md)

For a set of Azure CLI and PowerShell samples, see:

- [Azure CLI samples for Azure Database for PostgreSQL](./sample-scripts-azure-cli.md)

## Adjust performance and scale without downtime

Azure Database for PostgreSQL service currently offers two service tiers: Basic, and Standard. Each service tier offers [different levels of performance, IOPS guarantees and capabilities](concepts-service-tiers.md) to support lightweight to heavyweight database workloads. You can build your first app on a small server for a few bucks a month and then [change the performance level](scripts/sample-scale-server-up-or-down.md) within service tier manually or programmatically at any time to meet the needs of your solution. You can do this without downtime to your application or to your customers. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements and enables you to only pay for the resources that you need when you need them.

## Monitoring and Alerting

How do you decide when to dial up and down? You use the built-in performance monitoring and alerting features, combined with the performance ratings based on Compute Units. Using these tools, you can quickly assess the impact of scaling Compute Units up or down based on your current or projected performance needs. For details, see [Azure Database for PostgreSQL options and performance: Understand what's available in each service tier](./concepts-service-tiers.md).

## Keep your app and business running

Azure's industry leading 99.99% availability (not available in preview) service level agreement (SLA), powered by a global network of Microsoft-managed datacenters, helps keep your app running 24/7. With every Azure Database for PostgreSQL server, you take advantage of built-in security, fault tolerance, and data protection that you would otherwise have to buy or design, build, and manage. With Azure Database for PostgreSQL, each service tier offers a comprehensive set of business continuity features and options that you can use to get up and running and stay that way. You can use [point-in-time restore](howto-restore-server-portal.md) to return a database to an earlier state, as far back as 35 days. In addition, if the datacenter hosting your databases experiences an outage, you can restore databases from geo-redundant copies of recent backups.

## Secure your data

Azure database services have a tradition of data security that Azure Database for PostgreSQL upholds with features that limit access, protect data at-rest and in-motion, and help you monitor activity. Visit the [Azure Trust Center](https://www.microsoft.com/TrustCenter/Security/default.aspx) for information about Azure's platform security.

## Next steps
- See the [pricing page](https://azure.microsoft.com/pricing/details/postgresql/) for cost comparisons and calculators.
- Get started by [creating your first Azure Database for PostgreSQL](./quickstart-create-server-database-portal.md).
- Build your first app in Python, PHP, Ruby, C\#, Java, Node.js: [Connection libraries](./concepts-connection-libraries.md)
