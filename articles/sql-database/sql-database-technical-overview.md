---
title: What is the Azure SQL Database service? | Microsoft Docs
description: 'Get an introduction to SQL Database: technical details and capabilities of Microsoft''s relational database management system (RDBMS) in the cloud.'
keywords: introduction to sql,intro to sql,what is sql database
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: cgronlun

ms.assetid: c561f600-a292-4e3b-b1d4-8ab89b81db48
ms.service: sql-database
ms.custom: overview
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 06/09/2017
ms.author: carlrab
---
# What is the Azure SQL Database service? 

The Azure SQL Database is a fully managed, relational Database-As-A-Service (DBaaS) in the Microsoft cloud ("Azure") and is based on the [Microsoft SQL Server engine](https://docs.microsoft.com/sql/sql-server/sql-server-technical-documentation). This service is currently in 38 data centers around the world and is managing millions of production databases running a wide range of applications and workloads - from straightforward transactional data to the most data-intensive, mission-critical applications requiring advanced data processing at global scale. SQL Database supports existing [SQL Server tools, libraries, and APIs](sql-database-manage-overview.md). As a result, it is easy for you to develop new solutions, to move your existing SQL Server solutions, and to extend your existing SQL Server solutions to the Microsoft cloud without having to learn new skills.

SQL Database delivers built-in intelligent optimization, global scalability and availability, advanced security options, and predictable performance at multiple service levels that provides dynamic scalability with no downtime — all with near-zero administration. These capabilities allow you to focus on rapid app development and accelerating your time to market, rather than allocating precious time and resources to managing virtual machines and infrastructure. 

This article is an introduction to SQL Database core concepts and features related to performance, scalability, and manageability, with links to explore details. See these quick starts to get you started:

 - [Create a SQL database in the Azure portal](sql-database-get-started-portal.md)  
 - [Create a SQL database with the Azure CLI](sql-database-get-started-cli.md)
 - [Create a SQL database using PowerShell](sql-database-get-started-powershell.md)

For a set of Azure CLI and PowerShell samples, see:
 - [Azure CLI samples for Azure SQL Database](sql-database-cli-samples.md)
 - [Azure PowerShell samples for Azure SQL Database](sql-database-powershell-samples.md)

## Managed databases and managed instances

Since the inception of the Azure SQL Database service in 2010, an Azure SQL database is conceptually a contained database - or a managed database. In May 2017, the concept of a [managed instance was announced](https://azure.microsoft.com/blog/new-options-to-modernize-your-application-with-azure-sql-database). A managed instance offers near 100% SQL Server compatibility with the benefits of platform as a service. Managed instances are currently in [private preview](https://sqldatabase-migrationpreview.azurewebsites.net/). 

### Managed database

With a managed database, each database is isolated from each other and portable, each with its own performance level - known as a [service tier](sql-database-service-tiers.md). With a managed database, you can perform all management functions from within the database itself. For manageability, databases are associated with logical servers that enable you to perform administrative tasks across multiple databases - including [logins](sql-database-manage-logins.md), [firewalls](sql-database-firewall-configure.md), [auditing](sql-database-auditing.md), [threat detection](sql-database-auditing.md), and [failover groups](sql-database-geo-replication-overview.md).

However, since databases are isolated from each other, features such as cross-database querying, jobs, and transactions are implemented using new techniques that require recoding of existing applications. Also, features such as SQL Server Agent, CLR, and three-part names are not supported.

### Managed instance

With a managed instance, features like SQL CLR, SQL Server Agent, and cross-database querying will be fully supported. Furthermore, a managed instance will have of the current capabilities of managed databases, including automatic backups, built-in HA, and continuous improvement and release of features in the Microsoft cloud-first development model. These capabilities are introduced in the remainder of this article.

>
> [!VIDEO https://channel9.msdn.com/Events/Build/2017/P4008/player]
>

A new [Azure Database Migration Service](https://azure.microsoft.com/en-us/blog/azure-database-migration-service-announcement-at-build) was also announced in May 2017 that will make the migration to managed instances automated, risk free, and with down time measured in minutes. This service will streamline moving SQL Server and non-Microsoft database systems such as Oracle to Azure SQL Database.

For customers in highly regulated industries, managed instances bringing two additional important innovations: 

- VNETs with support for private IP addresses: With VNETs, customers will be able to completely isolate their database tier from the public internet and join it to their other cloud VNETs or on-premise networks where their application and users reside.
- Controlled service updates.  With controlled service updates, customers can run their test environment deployed in a regular Azure public cloud subscription, where they will receive continuous service updates. After they have validated their application with the latest updates, they will be able to apply the updates in a scheduled manner to the production-managed instance environment.

## Built-in intelligent optimization

With Azure SQL Database, you get built-in intelligence that helps you dramatically reduce the costs of running and managing databases and maximizes both performance and security of your application.  Under this feature umbrella, we have [SQL Database Advisor](sql-database-advisor.md), [automatic tuning](sql-database-automatic-tuning.md), and adaptive query processing.

### SQL Database Advisor

Running millions of customer workloads around-the-clock, Azure SQL Database collects and processes a massive amount of telemetry data, while also fully respecting customer privacy behind the scenes. Various algorithms are continuously evaluating the telemetry data so that the service can learn and adapt with your application. Based on this analysis, the service comes up with [performance improving recommendations](sql-database-advisor.md) tailored to your specific workload. 

How exactly is this built-in intelligence surfaced? Azure SQL Database automatically identifies the right non-clustered indexes to create or drop and serve them to customers as actionable recommendations, or proactively implements the changes to the database, if the customer opts into [automatic tuning mode](sql-database-automatic-tuning.md). The feature also automatically tests and verifies each of its actions to ensure the performance keeps improving. This means that the performance of your database is carefully monitored and compared before and after every tuning action, and if the performance doesn’t improve, the tuning action is reverted.

### Automatic tuning

In addition to automatic index tuning, which is already available through SQL Database Advisor, Azure SQL Database will soon be receiving a new array of adaptability features. For example, the automatic tuning for query plans feature provides a “safety net” for query plan choices, helping your databases always run at top performance by automatically correcting plan regressions. Today, many of our partners running [SaaS multi-tenant apps](sql-database-design-patterns-multi-tenancy-saas-applications.md) on top of Azure SQL Database are relying on automatic performance tuning to make sure their applications always have stable and predictable performance. For them, this feature tremendously reduces the risk of having a performance incident in the middle of the night. In addition, since part of their customer base also uses SQL Server, they are using the same indexing recommendations provided by Azure SQL Database to help their SQL Server customers.

### Adaptive query processing

We are also adding the adaptive query processing family of features to Azure SQL Database, including [interleaved execution for multi-statement table-valued functions, batch mode memory grant feedback](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2017/04/19/introducing-interleaved-execution-for-multi-statement-table-valued-functions/), and [batch mode adaptive joins](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2017/04/19/introducing-batch-mode-adaptive-joins/). Each of these adaptive query processing features applies similar “learn and adapt” techniques, helping further address performance issues related to historically intractable query optimization problems.

## Global scalability and availability

Azure's industry leading 99.99% availability service level agreement [(SLA)](http://azure.microsoft.com/support/legal/sla/), powered by a global network of Microsoft-managed datacenters, helps keep your app running 24/7. In addition, Azure SQL Database provides out-of-the-box [business continuity and global scalability](sql-database-business-continuity.md) features, including [automatic backups](sql-database-automated-backups.md), [point-in-time restores](sql-database-recovery-using-backups.md), and [Active Geo-Replication](sql-database-geo-replication-overview.md), which allows you to configure up to four readable secondary databases in either the same or globally distributed Azure data centers.  For example, if you have a SaaS application with a catalog database that has a high volume of concurrent read-only transactions, with Active Geo-Replication you can enable global read scale and remove bottlenecks on the primary that were due to read workloads. What’s more, with recently released auto-failover groups you can enable high availability and load balancing at global scale, including transparent geo-replication and failover of large sets of databases and elastic pools. This enables creation of globally distributed SaaS applications with minimal administration overhead leaving all the complex monitoring, routing, and failover orchestration to SQL Database.

> [!NOTE]
> [Azure Trust Center](https://azure.microsoft.com/support/trust-center/security/) for information about Azure's platform security.
>

### Transparent Data Encryption

Azure SQL Database [transparent data encryption](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-with-azure-sql-database) helps protect against the threat of malicious activity by performing real-time encryption and decryption of the database, associated backups, and transaction log files at rest without requiring changes to the application. Starting in May 2017, all newly created Azure SQL databases are automatically protected with transparent data encryption (TDE). TDE is SQL’s proven encryption-at-rest technology that is required by many compliance standards to protect against theft of storage media. Customers can manage the TDE encryption keys and other secrets in a secure and compliant management using Azure Key Vault.

### SQL Threat Detection

 [SQL Threat Detection](sql-database-threat-detection.md) continuously monitors databases for potentially harmful attempts to access sensitive data. SQL threat detection provides a new layer of security, which enables customers to detect and respond to potential threats as they occur by providing security alerts on anomalous activities. Users will receive an alert upon suspicious database activities, potential vulnerabilities, and SQL injection attacks, and anomalous database access patterns. SQL threat detection alerts provide details of suspicious activity and recommend action on how to investigate and mitigate the threat. Users can explore the suspicious events using [SQL Database Auditing](sql-database-auditing.md) to determine if they result from an attempt to access, breach, or exploit data in the database. Threat detection makes it simple to address potential threats to the database without the need to be a security expert or manage advanced security monitoring systems.

### Always Encrypted

Azure SQL Database is the only database system to offer protection of sensitive data in flight, at rest and during query processing with [Always Encrypted]((https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine)). Always Encrypted is an industry-first that offers unparalleled data security against breaches involving the theft of critical data. For example, with Always Encrypted, customers’ credit card numbers are stored encrypted in the database always, even during query processing, allowing decryption at the point of use by authorized staff or applications that need to process that data.

### Multi-Factor Authentication

Users of Azure SQL Database benefit from single sign-on through Azure Active Directory Authentication, which now also supports [multi-factor authentication](sql-database-ssms-mfa-authentication.md) (MFA). MFA is an authentication option that works for a growing number of tools and services across SQL Server and Azure SQL Database, such as SSMS or Visual Studio.

## Dynamic scalability and elastic data pools

Azure SQL Database service provides different performance levels for different needs, and enables databases to be pooled to maximize the use of resources - and save money.

### Adjust performance and scale without downtime

 The SQL Database service offers four service tiers: Basic, Standard, Premium, and Premium RS. Each service tier offers [different levels of performance and capabilities](sql-database-service-tiers.md) to support lightweight to heavyweight database workloads. You can build your first app on a small database at a low cost per month and then [change its service tier](sql-database-service-tiers.md) manually or programmatically at any time to meet the needs of your solution. You can do this without downtime to your app or to your customers. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements and enables you to only pay for the resources that you need when you need them.

### Elastic pools to maximize resource utilization

For many businesses and apps, being able to create single databases and dial performance up or down on demand is enough, especially if usage patterns are relatively predictable. But if you have unpredictable usage patterns, it can make it hard to manage costs and your business model. [Elastic pools](sql-database-elastic-pool.md) are designed to solve this problem. The concept is simple. You allocate performance resources to a pool rather than an individual database, and pay for the collective performance resources of the pool rather than for single database performance. With elastic pools, you don’t need to focus on dialing database performance up and down as demand for resources fluctuates. The pooled databases consume the performance resources of the elastic pool as needed. Pooled databases consume but don’t exceed the limits of the pool, so your cost remains predictable even if individual database usage doesn’t. What’s more, you can [add and remove databases to the pool](sql-database-elastic-pool-manage-portal.md), scaling your app from a handful of databases to thousands, all within a budget that you control. Finally, you can also control the minimum and maximum resources available to databases in the pool to ensure that no database in the pool uses all the pool resource and that every pooled database has a guaranteed minimum amount of resources. To learn more about design patterns for SaaS applications using elastic pools, see [Design Patterns for Multi-tenant SaaS Applications with Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md).

### Blend single databases with pooled databases

Either way you go — single databases or elastic pools — you are not locked in. You can blend single databases with elastic pools, and change the service tiers of single databases and elastic pools quickly and easily to adapt to your situation. Moreover, with the power and reach of Azure, you can mix-and-match other Azure services with SQL Database to meet your unique app design needs, drive cost and resource efficiencies, and unlock new business opportunities.

### Monitoring and alerting

But how can you compare the relative performance of single databases and elastic pools? How do you know the right click-stop when you dial up and down? You use the [built-in performance monitoring](sql-database-performance.md) and [alerting](sql-database-insights-alerts-portal.md) tools, combined with the performance ratings based on [Database Transaction Units (DTUs) for single databases and elastic DTUs (eDTUs) for elastic pools](sql-database-what-is-a-dtu.md). Using these tools, you can quickly assess the impact of scaling up or down based on your current or project performance needs. See [SQL Database options and performance: Understand what's available in each service tier](sql-database-service-tiers.md) for details.

## Next steps
Now that you've read an introduction to SQL Database and answered the question "What is SQL Database?", you're ready to:

* See the [pricing page](https://azure.microsoft.com/pricing/details/sql-database/) for single database and elastic pools cost comparisons and calculators.
* Get started by [creating your first database](sql-database-get-started-portal.md).
