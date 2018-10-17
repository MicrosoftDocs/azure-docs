---
title: What is the Azure SQL Database service? | Microsoft Docs
description: 'Get an introduction to SQL Database: technical details and capabilities of Microsoft''s relational database management system (RDBMS) in the cloud.'
keywords: introduction to sql,intro to sql,what is sql database
services: sql-database
ms.service: sql-database
ms.subservice: 
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: CarlRabeler
ms.author: carlrab
ms.reviewer:
manager: craigg
ms.date: 10/15/2018
---

# The Azure SQL Database service

SQL Database is a general-purpose relational database managed service in Microsoft Azure that supports structures such as relational data, JSON, spatial, and XML. SQL Database delivers dynamically scalable performance within two different purchasing models: a [vCore-based purchasing model](sql-database-service-tiers-vcore.md) and a [DTU-based purchasing model](sql-database-service-tiers-dtu.md). SQL Database also provides options such as [columnstore indexes](https://docs.microsoft.com/sql/relational-databases/indexes/columnstore-indexes-overview) for extreme analytic analysis and reporting, and [in-memory OLTP](sql-database-in-memory.md) for extreme transactional processing. Microsoft handles all patching and updating of the SQL code base seamlessly and abstracts away all management of the underlying infrastructure.

Azure SQL Database provides the following deployment options for an Azure SQL database:

- As a single database with its own set of resources managed via a logical server
- As a pooled database in an [elastic pool](sql-database-elastic-pool.md) with a shared set of resources managed via a logical server
- As a part of a collection of databases known as a [managed instance](sql-database-managed-instance.md) that contains system and user databases and sharing a set of resources

The following illustration shows these deployment options:

![deployment-options](./media/sql-database-technical-overview/deployment-options.png)

SQL Database shares its code base with the [Microsoft SQL Server database engine](https://docs.microsoft.com/sql/sql-server/sql-server-technical-documentation). With Microsoft's cloud-first strategy, the newest capabilities of SQL Server are released first to SQL Database, and then to SQL Server itself. This approach provides you with the newest SQL Server capabilities with no overhead for patching or upgrading - and with these new features tested across millions of databases. For information about new capabilities as they are announced, see:

- **[Azure Roadmap for SQL Database](https://azure.microsoft.com/roadmap/?category=databases)**:

  A place to find out what’s new and what’s coming next.

- **[Azure SQL Database blog](https://azure.microsoft.com/blog/topics/database)**:

  A place where SQL Server product team members blog about SQL Database news and features.

> [!IMPORTANT]
> To understand the feature differences between SQL Database and SQL Server, see [SQL features](sql-database-features.md).

SQL Database delivers predictable performance with multiple resource types, service tiers, and compute sizes that provides dynamic scalability with no downtime, built-in intelligent optimization, global scalability and availability, and advanced security options — all with near-zero administration. These capabilities allow you to focus on rapid app development and accelerating your time to market, rather than allocating precious time and resources to managing virtual machines and infrastructure. The SQL Database service is currently in 38 data centers around the world, with more data centers coming online regularly, which enables you to run your database in a data center near you.

## Scalable performance and pools

With SQL Database, each database is isolated from each other and portable, each with its own service tier within the [DTU-based purchasing model](sql-database-service-tiers-dtu.md) or [vCore-based purchasing model](sql-database-service-tiers-vcore.md) and a guaranteed compute size. SQL Database provides different compute sizes for different needs, and enables databases to be pooled to maximize the use of resources and save money.

- With [SQL Database Managed Instance](sql-database-managed-instance.md), each instance is isolated from other instances with guaranteed resources. For more information, see [SQL Database Managed Instance](sql-database-managed-instance.md).
- With the [Hyperscale service tier](sql-database-service-tier-hyperscale.md) (preview) in the vCore purchasing model, you can scale to 100 TB with fast backup and restore capabilities.

### Adjust performance and scale without downtime

SQL Database offers a [DTU-based purchasing model](sql-database-service-tiers-dtu.md) or the [vCore-based purchasing model](sql-database-service-tiers-vcore.md).

- The DTU-based purchasing model offers a blend of compute, memory, and IO resources in three service tiers to support lightweight to heavyweight database workloads: Basic, Standard, and Premium. Compute sizes within each tier provide a different mix of these resources, to which you can add additional storage resources.
- The vCore-based purchasing model lets you choose the number of vCores, the amount or memory, and the amount and speed of storage.

You can build your first app on a small, single database at a low cost per month in the General Purpose service tier and then change its service tier manually or programmatically at any time to the Business Critical Service tier to meet the needs of your solution. You can adjust performance without downtime to your app or to your customers. Dynamic scalability enables your database to transparently respond to rapidly changing resource requirements and enables you to only pay for the resources that you need when you need them.

> [!IMPORTANT]
> The [Hyperscale service tier](sql-database-service-tier-hyperscale.md) is currently in public preview. We don't recommend running any production workload in Hyperscale databases yet. You can't update a Hyperscale database to other service tiers. For test purpose, we recommend you make a copy of your current database and update the copy to Hyperscale service tier.

Dynamic scalability is different from autoscale. Autoscale is when a service scales automatically based on criteria, whereas dynamic scalability allows for manual scaling without downtime. Single Azure SQL Database supports manual dynamic scalability, but not autoscale. For a more *automatic* experience, consider using elastic pools, which allow databases to share resources in a pool based on individual database needs. However, there are scripts that can help automate scalability for a single Azure SQL Database. For an example, see [Use PowerShell to monitor and scale a single SQL Database](scripts/sql-database-monitor-and-scale-database-powershell.md).

### Elastic pools to maximize resource utilization

For many businesses and applications, being able to create single databases and dial performance up or down on demand is enough, especially if usage patterns are relatively predictable. But if you have unpredictable usage patterns, it can make it hard to manage costs and your business model. [Elastic pools](sql-database-elastic-pool.md) are designed to solve this problem. The concept is simple. You allocate performance resources to a pool rather than an individual database and pay for the collective performance resources of the pool rather than for single database performance.

   ![elastic pools](./media/sql-database-what-is-a-dtu/sqldb_elastic_pools.png)

With elastic pools, you don’t need to focus on dialing database performance up and down as demand for resources fluctuates. The pooled databases consume the performance resources of the elastic pool as needed. Pooled databases consume but don’t exceed the limits of the pool, so your cost remains predictable even if individual database usage doesn’t. What’s more, you can [add and remove databases to the pool](sql-database-elastic-pool-manage-portal.md), scaling your app from a handful of databases to thousands, all within a budget that you control. You can also control the minimum and maximum resources available to databases in the pool to ensure that no database in the pool uses all the pool resources and that every pooled database has a guaranteed minimum amount of resources. To learn more about design patterns for SaaS applications using elastic pools, see [Design Patterns for Multi-tenant SaaS Applications with SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md).

Scripts can help with monitoring and scaling elastic pools. For an example, see [Use PowerShell to monitor and scale a SQL elastic pool in Azure SQL Database](scripts/sql-database-monitor-and-scale-pool-powershell.md)

> [!IMPORTANT]
> SQL Database Managed Instance does not support elastic pools.

### Blend single databases with pooled databases

Either way you go — single databases or elastic pools — you are not locked in. You can blend single databases with elastic pools and change the service tiers of single databases and elastic pools quickly and easily to adapt to your situation. With the power and reach of Azure, you can mix-and-match other Azure services with SQL Database to meet your unique app design needs, drive cost and resource efficiencies, and unlock new business opportunities.

### Extensive monitoring and alerting capabilities

But how can you compare the relative performance of single databases and elastic pools? How do you know the right click-stop when you dial up and down? You use the [built-in performance monitoring](sql-database-performance.md) and [alerting](sql-database-insights-alerts-portal.md) tools, combined with the performance ratings. Using these tools, you can quickly assess the impact of scaling up or down based on your current or project performance needs. See  [DTU-based purchasing model](sql-database-service-tiers-dtu.md) and [vCore-based purchasing model](sql-database-service-tiers-vcore.md) for details.

Additionally, SQL Database can [emit metrics and diagnostic logs](sql-database-metrics-diag-logging.md) for easier monitoring. You can configure SQL Database to store resource usage, workers and sessions, and connectivity into one of these Azure resources:

- **Azure Storage**: For archiving vast amounts of telemetry for a small price
- **Azure Event Hub**: For integrating SQL Database telemetry with your custom monitoring solution or hot pipelines
- **Azure Log Analytics**: For built-in monitoring solution with reporting, alerting, and mitigating capabilities. Azure Log Analytics is a feature of the [Operations Management Suite (OMS)](../operations-management-suite/operations-management-suite-overview.md)

    ![architecture](./media/sql-database-metrics-diag-logging/architecture.png)

## Availability capabilities

Azure's industry leading 99.99% availability service level agreement [(SLA)](http://azure.microsoft.com/support/legal/sla/), powered by a global network of Microsoft-managed datacenters, helps keep your app running 24/7. The Azure platform fully manages every Azure SQL Database and guarantees no data loss and high percentage of data availability. Azure automatically handles patching, backups, replication, failure detection, underlying potential hardware, software or network failures, deploying bug fixes, failovers, database upgrades and other maintenance tasks. Standard availability is achieved by a separation of compute and storage layers. Premium availability is achieved by integrating compute and storage on a single node for performance and then implementing technology similar to Always On Availability Groups under the covers. For a full discussion of the high availability capabilities of Azure SQL Database, see [SQL Database availability](sql-database-high-availability.md). In addition, SQL Database provides built-in [business continuity and global scalability](sql-database-business-continuity.md) features, including:

- **[Automatic backups](sql-database-automated-backups.md)**:

  SQL Database automatically performs full, differential, and transaction log backups.
- **[Point-in-time restores](sql-database-recovery-using-backups.md)**:

  SQL Database supports recovery to any point in time within the automatic backup retention period.
- **[Active geo-replication](sql-database-geo-replication-overview.md)**:

  SQL Database allows you to configure up to four readable secondary databases in either the same or globally distributed Azure data centers.  For example, if you have a SaaS application with a catalog database that has a high volume of concurrent read-only transactions, use active geo-replication to enable global read scale and remove bottlenecks on the primary that are due to read workloads.
- **[Failover groups](sql-database-geo-replication-overview.md)**:

  SQL Database allows you to enable high availability and load balancing at global scale, including transparent geo-replication and failover of large sets of databases and elastic pools. Failover groups and active geo-replication enables creation of globally distributed SaaS applications with minimal administration overhead leaving all the complex monitoring, routing, and failover orchestration to SQL Database.
- **[Zone-redundant databases](sql-database-high-availability.md)**:

  SQL Database allows you to provision Premium or Business Critical databases or elastic pools across multiple availability zones. Because these databases and elastic pools have multiple redundant replicas for high availability, placing these replicas into multiple availability zones provides higher resilience, including the ability to recover automatically from the datacenter scale failures without data loss.  

## Built-in intelligence

With SQL Database, you get built-in intelligence that helps you dramatically reduce the costs of running and managing databases and maximizes both performance and security of your application. Running millions of customer workloads around-the-clock, SQL Database collects and processes a massive amount of telemetry data, while also fully respecting customer privacy behind the scenes. Various algorithms are continuously evaluating the telemetry data so that the service can learn and adapt with your application. Based on this analysis, the service comes up with performance improving recommendations tailored to your specific workload.

### Automatic performance monitoring and tuning

SQL Database provides detailed insight into the queries that you need to monitor. SQL Database's learns about your database patterns and enables you to adapt your database schema to your workload. SQL Database provides [performance tuning recommendations](sql-database-advisor.md), where you can review tuning actions and apply them.

However, constantly monitoring database is a hard and tedious task, especially when dealing with many databases. [Intelligent Insights](sql-database-intelligent-insights.md) does this job for you by automatically monitoring SQL Database performance at scale and it informs you of performance degradation issues, it identifies the root cause of the issue and provides performance improvement recommendations when possible.

Managing a huge number of databases might be impossible to do efficiently even with all available tools and reports that SQL Database and Azure portal provide. Instead of monitoring and tuning your database manually, you might consider delegating some of the monitoring and tuning actions to SQL Database using [automatic tuning](sql-database-automatic-tuning.md). SQL Database automatically apply recommendations, tests, and verifies each of its tuning actions to ensure the performance keeps improving. This way, SQL Database automatically adapts to your workload in controlled and safe way. Automatic tuning means that the performance of your database is carefully monitored and compared before and after every tuning action, and if the performance doesn’t improve, the tuning action is reverted.

Today, many of our partners running [SaaS multi-tenant apps](sql-database-design-patterns-multi-tenancy-saas-applications.md) on top of SQL Database are relying on automatic performance tuning to make sure their applications always have stable and predictable performance. For them, this feature tremendously reduces the risk of having a performance incident in the middle of the night. In addition, since part of their customer base also uses SQL Server, they are using the same indexing recommendations provided by SQL Database to help their SQL Server customers.

There are two automatic tuning aspects that are [available in SQL Database](sql-database-automatic-tuning.md):

- **Automatic index management**: Identifies indexes that should be added in your database, and indexes that should be removed.
- **Automatic plan correction**: Identifies problematic plans and fixes SQL plan performance problems (coming soon, already available in SQL Server 2017).

### Adaptive query processing

We are also adding the [adaptive query processing](/sql/relational-databases/performance/adaptive-query-processing) family of features to SQL Database, including interleaved execution for multi-statement table-valued functions, batch mode memory grant feedback, and batch mode adaptive joins. Each of these adaptive query processing features applies similar “learn and adapt” techniques, helping further address performance issues related to historically intractable query optimization problems.

## Advanced security and compliance

SQL Database provides a range of [built-in security and compliance features](sql-database-security-overview.md) to help your application meet various security and compliance requirements.

### Advance Threat Protection

SQL Advanced Threat Protection is a unified package for advanced SQL security capabilities. It includes functionality for discovering and classifying sensitive data, managing your database vulnerabilities, and detecting anomalous activities that could indicate a threat to your database. It provides a single go-to location for enabling and managing these capabilities.

- [Data Discovery & Classification](sql-database-data-discovery-and-classification.md):

  This feature (currently in preview) provides capabilities built into Azure SQL Database for discovering, classifying, labeling & protecting the sensitive data in your databases. It can be used to provide visibility into your database classification state, and to track the access to sensitive data within the database and beyond its borders.
- [Vulnerability Assessment](sql-vulnerability-assessment.md):

  This service can discover, track, and help you remediate potential database vulnerabilities. It provides visibility into your security state, and includes actionable steps to resolve security issues, and enhance your database fortifications.
- [Threat Detection](sql-database-threat-detection.md):

  This feature detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit your database. It continuously monitors your database for suspicious activities, and provides immediate security alerts on potential vulnerabilities, SQL injection attacks, and anomalous database access patterns. Threat Detection alerts provide details of the suspicious activity and recommend action on how to investigate and mitigate the threat.

### Auditing for compliance and security

[SQL Database Auditing](sql-database-auditing.md) tracks database events and writes them to an audit log in your Azure storage account. Auditing can help you maintain regulatory compliance, understand database activity, and gain insight into discrepancies and anomalies that could indicate business concerns or suspected security violations.

### Data encryption

SQL Database secures your data by providing encryption for data in motion with [Transport Layer Security](https://support.microsoft.com/kb/3135244), for data at rest with [Transparent Data Encryption](https://docs.microsoft.com/sql/relational-databases/security/encryption/transparent-data-encryption-azure-sql), and for data in use with [Always Encrypted](https://docs.microsoft.com/sql/relational-databases/security/encryption/always-encrypted-database-engine).

### Azure Active Directory integration and multi-factor authentication

SQL Database enables you to centrally manage identities of database user and other Microsoft services with [Azure Active Directory integration](sql-database-aad-authentication.md). This capability simplifies permission management and enhances security. Azure Active Directory supports [multi-factor authentication](sql-database-ssms-mfa-authentication.md) (MFA) to increase data and application security while supporting a single sign-in process.

### Compliance certification

SQL Database participates in regular audits and has been certified against several compliance standards. For more information, see the [Microsoft Azure Trust Center](https://azure.microsoft.com/support/trust-center/), where you can find the most current list of [SQL Database compliance certifications](https://azure.microsoft.com/support/trust-center/services/).

## Easy-to-use tools

SQL Database makes building and maintaining applications easier and more productive. SQL Database allows you to focus on what you do best: building great apps. You can manage and develop in SQL Database using tools and skills you already have.

- **[The Azure portal](https://portal.azure.com/)**:

  A web-based application for managing all Azure services
- **[SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms)**:

  A free, downloadable client application for managing any SQL infrastructure, from SQL Server to SQL Database
- **[SQL Server Data Tools in Visual Studio](https://docs.microsoft.com/sql/ssdt/download-sql-server-data-tools-ssdt)**:

  A free, downloadable client application for developing SQL Server relational databases, Azure SQL databases, Integration Services packages, Analysis Services data models, and Reporting Services reports.
- **[Visual Studio Code](https://code.visualstudio.com/docs)**:

  A free, downloadable, open-source, code editor for Windows, macOS, and Linux that supports extensions, including the [mssql extension](https://aka.ms/mssql-marketplace) for querying Microsoft SQL Server, Azure SQL Database, and SQL Data Warehouse.

SQL Database supports building applications with Python, Java, Node.js, PHP, Ruby, and .NET on the MacOS, Linux, and Windows. SQL Database supports the same [connection libraries](sql-database-libraries.md) as SQL Server.

## Engage with the SQL Server engineering team

- [DBA Stack Exchange](https://dba.stackexchange.com/questions/tagged/sql-server): Ask database administration questions
- [Stack Overflow](http://stackoverflow.com/questions/tagged/sql-server): Ask development questions
- [MSDN Forums](https://social.msdn.microsoft.com/Forums/home?category=sqlserver): Ask technical questions
- [Feedback](http://aka.ms/sqlfeedback): Report bugs and request feature
- [Reddit](https://www.reddit.com/r/SQLServer/): Discuss SQL Server

## Next steps

- See the [pricing page](https://azure.microsoft.com/pricing/details/sql-database/) for single database and elastic pools cost comparisons and calculators.
- See these quickstarts to get you started:

  - [Create a SQL database in the Azure portal](sql-database-get-started-portal.md)  
  - [Create a SQL database with the Azure CLI](sql-database-get-started-cli.md)
  - [Create a SQL database using PowerShell](sql-database-get-started-powershell.md)

- For a set of Azure CLI and PowerShell samples, see:
  - [Azure CLI samples for SQL Database](sql-database-cli-samples.md)
  - [Azure PowerShell samples for SQL Database](sql-database-powershell-samples.md)
