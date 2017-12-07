---
title: Overview of Azure Database for PostgreSQL relational database service | Microsoft Docs
description: Provides an overview of Azure Database for PostgreSQL relational database service.
services: postgresql
author: kamathsun
ms.author: sukamat
manager: jhubbard
editor: jasonwhowell
ms.custom: mvc
ms.service: postgresql
ms.topic: overview
ms.date: 10/20/2017
---
# What is Azure Database for PostgreSQL?

Azure Database for PostgreSQL is a relational database service in the Microsoft cloud built for developers based on the community version of open source [PostgreSQL](https://www.postgresql.org/) database engine. This service is in public preview. Azure Database for PostgreSQL delivers:

- Built-in high availability with no additional cost.
- Predictable performance, using inclusive pay-as-you-go pricing.
- Scale on the fly within seconds.
- Secured to protect sensitive data at-rest and in-motion.
- Automatic backups and point-in-time-restore for up to 35 days.
- Enterprise-grade security and compliance.

All those capabilities require almost no administration, and all are provided at no additional cost. These capabilities allow you to focus on rapid application development and accelerating your time to market, rather than allocating precious time and resources to managing virtual machines and infrastructure. In addition, you can continue to develop your application with the open source tools and platform of your choice, and deliver with the speed and efficiency your business demands without having to learn new skills. 

This article is an introduction to Azure Database for PostgreSQL core concepts and features related to performance, scalability, and manageability. See these quickstarts to get you started:

- [Create an Azure Database for PostgreSQL using Azure portal](quickstart-create-server-database-portal.md)
- [Create an Azure Database for PostgreSQL using the Azure CLI](quickstart-create-server-database-azure-cli.md)

For a set of Azure CLI samples, see:

- [Azure CLI samples for Azure Database for PostgreSQL](./sample-scripts-azure-cli.md)

## Adjust performance and scale within seconds
In preview, the Azure Database for PostgreSQL service offers two service tiers: Basic and Standard. Each tier offers different performance and capabilities to support lightweight to heavyweight database workloads. You can build your first app on a small database for a few dollars a month, and then adjust the scale to meet the needs of your solution. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements. You only pay for the resources you need, and only when you need them. See [Pricing tiers](concepts-service-tiers.md) for details.

## Monitoring and alerting
How do you decide when to dial up and down? You use the built-in performance monitoring and alerting features, combined with the performance ratings based on Compute Units. Using these tools, you can quickly assess the impact of scaling Compute Units up or down based on your current or projected performance needs. See [Alerts](howto-alert-on-metric.md) for details.

## Keep your app and business running
Azure's industry leading 99.99% availability (not available in preview) service level agreement (SLA), powered by a global network of Microsoft-managed datacenters, helps keep your app running 24/7. With every Azure Database for PostgreSQL server, you take advantage of built-in security, fault tolerance, and data protection that you would otherwise have to buy or design, build, and manage. With Azure Database for PostgreSQL, each service tier offers a comprehensive set of business continuity features and options that you can use to get up and running and stay that way. You can use [point-in-time restore](howto-restore-server-portal.md) to return a database to an earlier state, as far back as 35 days. In addition, if the datacenter hosting your databases experiences an outage, you can restore databases from geo-redundant copies of recent backups.

## Secure your data
Azure database services have a tradition of data security that Azure Database for PostgreSQL upholds with features that limit access, protect data at-rest and in-motion, and help you monitor activity. Visit the [Azure Trust Center](https://www.microsoft.com/TrustCenter/Security/default.aspx) for information about Azure's platform security.

The Azure Database for PostgreSQL service uses storage encryption for data at-rest. Data including backups are encrypted on disk (with the exception of temporary files created by the engine while running queries). The service uses AES 256-bit cipher that is included in Azure storage encryption, and the keys are system managed. Storage encryption is always on and cannot be disabled.

By default, the Azure Database for PostgreSQL service is configured to require [SSL connection security](./concepts-ssl-connection-security.md) for data in-motion across the network. Enforcing SSL connections between your database server and your client applications helps protect against "man in the middle" attacks by encrypting the data stream between the server and your application.  Optionally, you can disable requiring SSL for connecting to your database service if your client application does not support SSL connectivity.

## Next steps
- See the [pricing page](https://azure.microsoft.com/pricing/details/postgresql/) for cost comparisons and calculators.
- Get started by [creating your first Azure Database for PostgreSQL](./quickstart-create-server-database-portal.md).
- Build your first app in Python, PHP, Ruby, C\#, Java, Node.js: [Connection libraries](./concepts-connection-libraries.md)
