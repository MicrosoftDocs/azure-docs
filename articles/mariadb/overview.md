---
title: Overview - Azure Database for MariaDB
description: Learn about the Azure Database for MariaDB service, a relational database service in the Microsoft cloud based on the MySQL community edition.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.topic: overview
ms.custom: mvc
ms.date: 3/18/2020
---

# What is Azure Database for MariaDB?

Azure Database for MariaDB is a relational database service in the Microsoft cloud. Azure Database for MariaDB is based on the [MariaDB community edition](https://mariadb.org/download/) (available under the GPLv2 license) database engine, version 10.2 and 10.3.

Azure Database for MariaDB delivers:

- Built-in high availability with no additional cost.
- Predictable performance, using inclusive pay-as-you-go pricing.
- Scaling as needed within seconds.
- Secured protection of sensitive data at rest and in motion.
- Automatic backups and point-in-time-restore for up to 35 days.
- Enterprise-grade security and compliance.

These capabilities require almost no administration. They're provided at no additional cost. Azure Database for MariaDB can help you rapidly develop your app and accelerate your time to market. You don't have to allocate precious time and resources to managing virtual machines and infrastructure. You can also continue to develop your application by using the open-source tools and platform of your choice. Deliver with the speed and efficiency your business demands, all without learning new skills.

To learn about core concepts and features in Azure Database for MariaDB, including performance, scalability, and manageability, see these quickstarts:

- [Create an Azure Database for MariaDB server by using the Azure portal](quickstart-create-mariadb-server-database-using-azure-portal.md)
- [Create an Azure Database for MariaDB server by using the Azure CLI](quickstart-create-mariadb-server-database-using-azure-cli.md)

<!--
For a set of Azure CLI samples, see:
- [Azure CLI samples for Azure Database for MariaDB](sample-scripts-azure-cli.md) 
-->

## Adjust performance and scale within seconds

The Azure Database for MariaDB service offers several service tiers: Basic, General Purpose, and Memory Optimized. Each tier offers different performance and capabilities to support lightweight to heavyweight database workloads. You can build your first app on a small database for a few dollars a month, and then adjust the scale to meet the needs of your solution. Dynamic scalability helps your database transparently respond to rapidly changing resource requirements. You pay only for the resources you need, and only when you need them. See [Pricing tiers](concepts-pricing-tiers.md) for details.

## Monitoring and alerting

How do you decide when to scale up or down? You can use the built-in performance monitoring and alerting features of Azure Database for MariaDB, combined with the performance ratings based on vCores. By using these tools, you can quickly assess the effect of scaling vCores up or down based on your current or projected performance needs. See [Alerts](howto-alert-metric.md) for details.

## Keep your app and business running

Azure's industry-leading 99.99% availability SLA is powered by a global network of Microsoft-managed datacenters. The network helps keep your app running 24/7. You benefit from the built-in security, fault tolerance, and data protection in Azure Database for MariaDB. With Azure Database for MariaDB, you can use point-in-time restore to recover a server to an earlier state, as far back as 35 days.

## Secure your data

Azure database services have a tradition of data security that Azure Database for MariaDB upholds. Azure Database for MariaDB offers features that limit access, protect data at rest and in motion, and help you monitor activity. Visit the [Azure Trust Center](https://www.microsoft.com/trustcenter/security) for information about Azure's platform security. For more information about Azure Database for MariaDB security features, see the [security overview](concepts-security.md).

## Contacts

You can send any questions or suggestions you have about working with Azure Database for MariaDB to the [Azure Database for MariaDB Team](mailto:AskAzureDBforMariaDB@service.microsoft.com) (not a technical support alias).

You can also use the following points of contact:
- To contact Azure Support, [open a support request](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) in the Azure portal.
- To fix an issue with your account, [open a support request](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest) in the Azure portal.
- To provide feedback or to request new features, create an entry in the [Azure Feedback Forums](https://feedback.azure.com/forums/915439-azure-database-for-mariadb).

## Next steps

Now that you've read an introduction to Azure Database for MariaDB, you're ready to:
- See the [pricing](https://azure.microsoft.com/pricing/details/mariadb/) page for cost comparisons and calculators. 
- Get started by [creating your first server](quickstart-create-mariadb-server-database-using-azure-portal.md).

<!--- - Build your first app using your preferred language: [Python](./connect-python.md) | [Node.JS](./connect-nodejs.md) | [Java](./connect-java.md) | [Ruby](./connect-ruby.md) | [PHP](./connect-php.md) | [.NET (C#)](./connect-csharp.md) | [Go](./connect-go.md) --->
