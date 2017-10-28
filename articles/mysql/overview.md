---
title: Overview of Azure Database for MySQL relational database service | Microsoft Docs
description: Overview of the Azure Database for MySQL relational database service.
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonwhowell
ms.service: mysql-database
ms.topic: article
ms.date: 07/05/2017
ms.custom: mvc
---


# What is Azure Database for MySQL? Service Introduction
Azure Database for MySQL is a relational database service in the Microsoft cloud based on [MySQL Community Edition](https://www.mysql.com/products/community/) database engine.  Azure Database for MySQL delivers:

- Predictable performance at multiple service levels
- Dynamic scalability with no application downtime
- Built-in high availability
- Data protection

These capabilities require almost no administration, and all are provided at no additional cost. They allow you to focus on rapid app development and accelerating your time to market, rather than allocating precious time and resources to managing virtual machines and infrastructure. In addition, you can continue to develop your application with the open source tools and platform of your choice, and deliver with the speed and efficiency your business demands without having to learn new skills.

![Azure Database for MySQL conceptual diagram](media/overview/1-azure-db-for-mysql-conceptual-diagram.png)

This article is an introduction to Azure Database for MySQL core concepts and features related to performance, scalability, and manageability, with links to explore details. See these quick starts to get you started:
- [Create an Azure Database for MySQL server using Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md)
- [Create an Azure Database for MySQL server using Azure CLI](quickstart-create-mysql-server-database-using-azure-cli.md)

For a set of Azure CLI samples, see:
- [Azure CLI samples for Azure Database for MySQL](sample-scripts-azure-cli.md)

## Adjust performance and scale without downtime
Azure Database for MySQL service offers two service tiers: Basic and Standard. Each tier offers different performance and capabilities to support lightweight to heavyweight database workloads. You can build your first app on a small database for a few dollars a month, then change your service tier to scale with needs of your solution with no downtime. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements. You only pay for the resources you need, when you need them.

## Monitoring and alerting
How do you know the right click-stop when you dial up and down? Use the built-in performance monitoring and alerting features, combined with the performance ratings based on Compute Unit. Using these features, you can quickly assess the impact of scaling up or down based on your current or project performance needs. See [Concepts: Service tiers](concepts-service-tiers.md) for details.

## Keep your app and business running
Azure's industry leading 99.99% availability service level agreement (SLA), powered by a global network of Microsoft-managed datacenters, helps keep your app running 24/7. With every Azure Database for MySQL server, you take advantage of built-in security, fault tolerance, and data protection that you would otherwise have to buy or design, build, and manage. With Azure Database for MySQL, you can use point-in-time restore to recover a server to an earlier state, as far back as 35 days.

## Secure your data
Azure database services have a tradition of data security that Azure Database for MySQL upholds with features that limit access, protect data at-rest and in-motion, and help you monitor activity. Visit the [Azure Trust Center](https://www.microsoft.com/en-us/TrustCenter/Security/default.aspx) for information about Azure's platform security.

The Azure Database for MySQL service uses storage encryption for data at-rest. All the data, including backups, are encrypted on disk. The service uses AES 256-bit cipher that is included in Azure storage encryption, and the keys are system managed. Storage encryption is always on and cannot be disabled.

By default, the Azure Database for MySQL service is configured to require [SSL connection security](./concepts-ssl-connection-security.md) for data in-motion across the network. Enforcing SSL connections between your database server and your client applications helps protect against "man in the middle" attacks by encrypting the data stream between the server and your application.  Optionally, you can disable requiring SSL for connecting to your database service if your client application does not support SSL connectivity.

## Next Steps
Now that you've read an introduction to Azure Database for MySQL and answered the question "What is Azure Database for MySQL?", you're ready to:
- See the pricing page for cost comparisons and calculators. [Pricing](https://azure.microsoft.com/pricing/details/mysql/)
- Get started by creating your first server. [Create an Azure Database for MySQL server using Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md)
- Build your first app in Python, PHP, Ruby, C\#, Java, Node.js: [Connectivity libraries used to connect to Azure Database for MySQL](concepts-connection-libraries.md)
