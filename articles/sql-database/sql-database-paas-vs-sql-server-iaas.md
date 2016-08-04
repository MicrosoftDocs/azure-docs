<properties
	pageTitle="SQL (PaaS) Database vs. SQL Server in the cloud on VMs (IaaS) | Microsoft Azure"
	description="Learn which cloud SQL Server option fits your application: Azure SQL (PaaS) Database or SQL Server in the cloud on Azure Virtual Machines."
	services="sql-database, virtual-machines"
	keywords="SQL Server cloud, SQL Server in the cloud, PaaS database, cloud SQL Server, DBaaS"
	documentationCenter=""
	authors="CarlRabeler"
	manager="jhubbard"
	editor="cjgronlund"/>

<tags
	ms.service="sql-database"
	ms.workload="data-management"
	ms.tgt_pltfrm="vm-windows-sql-server"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="07/20/2016"
	ms.author="carlrab"/>

# Choose a cloud SQL Server option: Azure SQL (PaaS) Database  or SQL Server on Azure VMs (IaaS)

Azure has two options for hosting SQL Server workloads in Microsoft Azure:

* [Azure SQL Database](https://azure.microsoft.com/services/sql-database/): A SQL database native to the cloud, also known as a platform as a service (PaaS) database or a database as a service (DBaaS) that is optimized for software-as-a-service (SaaS) app development. It offers compatibility with the majority of SQL Server features. For more information on PaaS, see [What is PaaS](https://azure.microsoft.com/overview/what-is-paas/) and for a video, see [SAIIK: PaaS vs IaaS - Navigating the Decision Tree: Azure SQL DB vs SQL Server in a VM](https://channel9.msdn.com/Series/SAIIK-SQL-Server-on-Azure-IaaS-Implementation-Kit/SAIIK-PaaS-vs-IaaS).
* [SQL Server on Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/): SQL Server installed and hosted in the cloud on Windows Server Virtual Machines (VMs) running on Azure, also known as an infrastructure as a service (IaaS).

Learn how each option fits into the Microsoft data platform and get help matching the right option to your business requirements. Whether you prioritize cost savings or minimal administration ahead of everything else, this article can help you decide which approach delivers against the business requirements you care about most.


## Microsoft's data platform

One of the first things to understand in any discussion of Azure versus on-premises SQL Server databases is that you can use it all. Microsoft’s data platform leverages SQL Server technology and makes it available across physical on-premises machines, private cloud environments, third-party hosted private cloud environments, and public cloud. This enables you to meet unique and diverse business needs through a combination of on-premises and cloud-hosted deployments, while using the same set of server products, development tools, and expertise across these environments.

   ![Cloud SQL Server options: SQL server on IaaS, or SaaS SQL database in the cloud.](./media/sql-database-paas-vs-sql-server-iaas/SQLIAAS_SQL_Server_Cloud_Continuum.png)

As seen in the diagram, each offering can be characterized by the level of administration you have over the infrastructure (on the X axis), and by the degree of cost efficiency achieved by database level consolidation and automation (on the Y axis).

When designing an application, four basic options are available for hosting the SQL Server part of the application:

- SQL Server on non-virtualized physical machines
- SQL Server in on-premises virtualized machines (private cloud)
- SQL Server in Azure Virtual Machine (Microsoft public cloud)
- Azure SQL Database (Microsoft public cloud)

In the following sections, we will learn about SQL Server in the Microsoft public cloud: Azure SQL Database and SQL Server on Azure VMs. In addition, we will explore common business motivators for determining which option works best for your application.

## A closer look at Azure SQL Database and SQL Server on Azure VMs

**Azure SQL Database** is a relational database-as-a-service (DBaaS) hosted in the Azure cloud that falls into the industry categories of *Software-as-a-Service (SaaS)* and *Platform-as-a-Service (PaaS)*. [SQL database](sql-database-technical-overview.md) is built on standardized hardware and software that is owned, hosted, and maintained by Microsoft. With SQL Database, you can develop directly on the service using built-in features and functionality. When using SQL Database, you pay-as-you-go with options to scale up or out for greater power with no interruption.

**SQL Server on Azure Virtual Machines (VMs)** falls into the industry category *Infrastructure-as-a-Service (IaaS)* and allows you to run SQL Server inside a virtual machine in the cloud. Similar to SQL Database, it is built on standardized hardware that is owned, hosted, and maintained by Microsoft. When using SQL Server on a VM, you can either bring your own SQL Server license or use a pre-licensed SQL Server image from the Azure portal.

In general, these two SQL options are optimized for different purposes:

- **SQL Database** is optimized to reduce overall costs to the minimum for provisioning and managing many databases. It reduces ongoing administration costs because you do not have to manage any virtual machines, operating system or database software. This includes upgrades, high availability, and [backups](sql-database-automated-backups.md). In general, Azure SQL Database can dramatically increase the number of databases managed by a single IT or development resource.
- **SQL Server running on Azure VMs** is optimized for extending existing on-premises SQL Server applications to the cloud in a hybrid scenario or deploying an existing application to Azure in a migration or dev/test scenario. An example of the hybrid scenario is keeping secondary database replicas in Azure via use of [Azure Virtual Networks](../virtual-network/virtual-networks-overview.md). With SQL Server on Azure VMs, you have the full administrative rights over a dedicated SQL Server instance and a cloud-based VM. It is a perfect choice when an organization already has IT resources available to maintain the virtual machines. With SQL Server on VMs, you can build a highly customized system to address your application’s specific performance and availability requirements.

The following table summarizes the main characteristics of SQL Database and SQL Server on Azure VMs:

|       | SQL Database | SQL Server in an Azure Virtual Machine|
| -------------- | ------------ | ---------------------- |
| **Best for:** | New cloud-designed applications that have time constraints in development and marketing. | Existing applications that require fast migration to the cloud with minimal changes. Rapid development and test scenarios when you do not want to buy on-premises non-production SQL Server hardware. |
|| Applications that need built-in high availability, disaster recovery, and upgrade mechanisms. | Applications that do not need built-in high availability, disaster recovery, and upgrade mechanisms. |
||Teams that do not want to manage the underlying operating system and configuration settings.| If you need a customized IT environment with full administrative rights.|
||Databases of up to 1 TB in size, or larger databases that can be [horizontally or vertically partitioned](sql-database-elastic-scale-introduction.md#horizontal-and-vertical-scaling) using a scale-out pattern.|Databases that are bigger than 1 TB in size that cannot be [horizontally or vertically partitioned](sql-database-elastic-scale-introduction.md#horizontal-and-vertical-scaling).|
||[Building Software-as-a-Service (SaaS) applications](sql-database-design-patterns-multi-tenancy-saas-applications.md).| Building hybrid applications|
|||||
|**Resources:**|You do not want to employ IT resources for support and maintenance of the underlying infrastructure, but want to focus on the application layer.|You have IT resources for support and maintenance.|
|**Total cost of ownership:**|Eliminates hardware costs and reduces administrative costs.|Eliminates hardware costs.|
|**Business continuity:**|In addition to built-in fault tolerance infrastructure capabilities, Azure SQL Database provides features, such as [automated backups](sql-database-automated-backups.md), [Point-In-Time Restore](sql-database-recovery-using-backups.md#point-in-time-restore), [Geo-Restore](sql-database-recovery-using-backups.md#geo-restore), and [Active Geo-Replication](sql-database-active-geo-replication.md) to increase business continuity. For more information, see [SQL Database business continuity overview](sql-database-business-continuity.md).|SQL Server on Azure VMs lets you to set up a high availability and disaster recovery solution for your database’s specific needs. Therefore, you can have a system that is highly optimized for your application. You can test and run failovers by yourself when needed. For more information, see [High Availability and Disaster Recovery for SQL Server on Azure Virtual Machines](../virtual-machines/virtual-machines-windows-sql-high-availability-dr.md).|
|**Hybrid cloud:**|Your on-premises application can access data in Azure SQL Database.|With SQL Server on Azure VMs, you can have applications that run partly in the cloud and partly on-premises. For example, you can extend your on-premises network and Active Directory Domain to the cloud via [Azure Virtual Network](../virtual-network/virtual-networks-overview.md). In addition, you can store on-premises data files in Azure Storage using [SQL Server Data Files in Azure](http://msdn.microsoft.com/library/dn385720.aspx). For more information, see [Introduction to SQL Server 2014 Hybrid Cloud](http://msdn.microsoft.com/library/dn606154.aspx).|
||Supports [SQL Server transactional replication](https://msdn.microsoft.com/library/mt589530.aspx) as a subscriber.|Supports [SQL Server transactional replication](https://msdn.microsoft.com/library/mt589530.aspx), disaster recovery and [AlwaysOn replicas in Azure VMs](../virtual-machines/virtual-machines-windows-sql-high-availability-dr.md).|
|||||
|||||

## Business motivations for choosing Azure SQL Database or SQL Server on Azure VMs

### Cost

Whether you’re a startup that is strapped for cash, or a team in an established company that operates under tight budget constraints, limited funding is often the primary driver when deciding how to host your databases. In this section, we’ll first learn about the billing and licensing basics in Azure with regards to these two relational database options: SQL Database and SQL Server on Azure VMs. Then, we’ll see how we should calculate the total application cost.

#### Billing and licensing basics

**SQL Database** is sold to customers as a service, not with a license, whereas [licensing SQL Server on Azure VMs](../virtual-machines/virtual-machines-windows-sql-server-iaas-overview.md) requires either per-minute SQL Server licensing or your own license through Software Assurance.

Currently, **SQL Database** is available in several service tiers, all of which are billed hourly at a fixed rate based on the service tier and performance level you choose. In addition, you are billed for outgoing Internet traffic at regular [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/). The Basic, Standard, and Premium service tiers are designed to deliver predictable performance with multiple performance levels to match your application’s peak requirements. You can change between service tiers and performance levels to match your application’s varied throughput needs. If your database has high transactional volume and needs to support many concurrent users, we recommend the Premium service tier. For the latest information on the current supported service tiers, see [Azure SQL Database Service Tiers](sql-database-service-tiers.md). You can also create [elastic database pools](sql-database-elastic-pool.md) to share performance resources among database instances.

With **SQL Database**, the database software is automatically configured, patched, and upgraded by Microsoft, which reduces your administration costs. In addition, its [built-in backup](sql-database-automated-backups.md) capabilities help you achieve significant cost savings, especially when you have a large number of databases.

With **SQL Server on Azure VMs**, you can either use the platform-provided SQL Server image (which includes a license) or bring your SQL Server license. When using the Azure provided images, the operational cost depends on the VM size as well as the edition of SQL Server you choose. Regardless of VM size or SQL Server edition, you pay per-minute licensing cost of SQL Server and Windows Server, along with the Azure Storage cost for the VM disks. The per-minute billing option allows you to use SQL Server for as long as you need without buying addition SQL Server licenses. If you bring your own SQL Server license to Azure, you are charged for Windows Server and storage costs only. For more information on bring-your-own licensing, see [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility/).

#### Calculating the total application cost

When you start using a cloud platform, the cost of running your application primarily includes the development and administration costs along with the service costs that the public cloud platform requires.

Here is the detailed cost calculation for your application running in SQL Database and SQL Server on Azure VMs:

**When using Azure SQL Database:**

*Total cost of application = Highly minimized administration costs + software development costs + SQL Database service costs*

**When using SQL Server on Azure VMs:**

*Total cost of application = Minimized software development/modification costs + administration costs +  SQL Server and Windows Server licensing costs + Azure Storage costs*

For more information on pricing, see the following resources:

- [SQL Database Pricing](https://azure.microsoft.com/pricing/details/sql-database/)
- [Virtual Machine Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/) for [SQL](https://azure.microsoft.com/pricing/details/virtual-machines/#sql) and for [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/#windows)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

> [AZURE.NOTE] There is a small subset of features on SQL Server that are not applicable or not available with SQL Database. See [SQL Database General Limitations and Guidelines](sql-database-general-limitations.md) and [SQL Database Transact-SQL information](sql-database-transact-sql-information.md) for more information. If you are moving an existing SQL Server solution to the cloud, see [Migrating a SQL Server database to Azure SQL Database](sql-database-cloud-migrate.md). When you migrate an existing on-premises SQL Server application to SQL Database, consider updating the application to take advantage of the capabilities that cloud services offer. For example, you may consider using [Azure Web App Service](https://azure.microsoft.com/services/app-service/web/) or [Azure Cloud Services](https://azure.microsoft.com/services/cloud-services/) to host your application layer to increase cost benefits.

### Administration

For many businesses, the decision to transition to a cloud service is as much about offloading complexity of administration as it is cost. With **SQL Database**, Microsoft administers the underlying hardware, automatically replicates all data to provide high availability, configures and upgrades the database software, manages load balancing, and does transparent failover if there is a server failure. You can continue to administer your database, but you no longer need to manage the database engine, server operating sytem or hardware.  Examples of items you can continue to administer include databases and logins, index and query tuning, and auditing and security.

On the other hand, you might have in-house expertise and a desire to keep control over database location down to the location of disk. With **SQL Server running on Azure VMs**, you have full control over the operating system and SQL Server instance configuration. With a VM, it’s up to you to decide when to update/upgrade the operating system and database software and when to install any additional software such as anti-virus and backup tools. In addition, you can control the size of the VM, the number of disks, and their storage configurations.  For example, Azure allows you to change the size of a VM as needed. For information, see [Virtual Machine and Cloud Service Sizes for Azure](../virtual-machines/virtual-machines-linux-sizes.md).

### Service Level Agreement (SLA)

For many IT departments, meeting up-time obligations of a Service Level Agreement (SLA) is a top priority. In this section, we look at what SLA applies to each database hosting option.

For **SQL Database** Basic, Standard, and Premium service tiers Microsoft provides an availability SLA of 99.99%. For the latest information, see [Service Level Agreement](https://azure.microsoft.com/support/legal/sla/sql-database/). For the latest information on SQL Database service tiers and the supported business continuity plans, see [Service Tiers](sql-database-service-tiers.md).

For **SQL Server running on Azure VMs**, Microsoft provides an availability SLA of 99.95% that covers just the Virtual Machine. This SLA does not cover the processes (such as SQL Server) running on the VM and requires that you host at least two VM instances in an availability set. For the latest information, see the [VM SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/). For database high availability (HA) within VMs, you should configure one of the supported high availability options in SQL Server, such as [AlwaysOn Availability Groups](http://blogs.technet.com/b/dataplatforminsider/archive/2014/08/25/sql-server-alwayson-offering-in-microsoft-azure-portal-gallery.aspx).

### <a name="market"></a>Time to market

**SQL Database** is the right solution for cloud-designed applications when developer productivity and fast time-to-market are critical. With programmatic DBA-like functionality, it is perfect for cloud architects and developers as it lowers the need for managing the underlying operating system and database. For example, you can use the [REST API](http://msdn.microsoft.com/library/azure/dn505719.aspx) and [PowerShell Cmdlets](http://msdn.microsoft.com/library/azure/dn546726.aspx) to automate and manage administrative operations for thousands of databases. Features such as [Elastic Database Pools](sql-database-elastic-pool.md) allow you to focus on the application layer and deliver your solution to the market faster.

**SQL Server running on Azure VMs** is perfect if your existing or new applications require access and control to all features of a SQL Server instance. It is also a good fit when you want to migrate existing on-premises applications and databases to Azure as-is. Since you do not need to change the presentation, application, and data layers, you save time and budget on rearchitecting your existing solution. Instead, you can focus on migrating all your solutions to Azure and in doing some performance optimizations that may be required by the Azure platform. For more information, see [Performance Best Practices for SQL Server on Azure Virtual Machines](../virtual-machines/virtual-machines-windows-sql-performance.md).

## Summary

This article explored SQL Database and SQL Server on Azure Virtual Machines (VMs) and discussed common business motivators that might affect your decision. The following is a summary of suggestions for you to consider:

Choose **Azure SQL Database** if:

- You are building new cloud-based applications or you want to migrate your existing SQL Server solution to take advantage of the cost savings and performance optimization that cloud services provide. This approach provides the benefits of a fully managed cloud service, helps lower initial time-to-market, and can provide long term cost optimization.

- You want to have Microsoft perform common management operations on your databases and require stronger availability SLAs for databases.



Choose **SQL Server on Azure VMs** if:

- You have existing on-premises applications and want to stop maintaining your own hardware, or you are considering hybrid solutions. This approach lets you access high database capacity sooner while facilitating connection to your on-premises applications via a secure tunnel.

- You have existing IT resources, need full administrative rights over SQL Server, and require full compatibility with on-premises SQL Server. This approach lets you minimize costs for development or modifications of existing applications with the flexibility to run most applications. In addition, it provides full control of the VM, operating system, and database configuration.


## Next steps
- See [SQL Database tutorial: Create a SQL database in minutes using the Azure portal](sql-database-get-started.md) to get started with SQL Database.
- See [SQL Database pricing] (https://azure.microsoft.com/pricing/details/sql-database/).
- See [Provision a SQL Server virtual machine in Azure](../virtual-machines/virtual-machines-windows-portal-sql-server-provision.md) to get started with SQL Server on Azure VMs.
- See [SQL Server on an Azure Virtual Machine: Learning Path](https://azure.microsoft.com/documentation/learning-paths/sql-azure-vm/).
