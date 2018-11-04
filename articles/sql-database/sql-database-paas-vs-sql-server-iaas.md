---
title: SQL (PaaS) Database vs. SQL Server in the cloud on VMs (IaaS) | Microsoft Docs
description: 'Learn which cloud SQL Server option fits your application: Azure SQL (PaaS) Database or SQL Server in the cloud on Azure Virtual Machines.'
services: sql-database
ms.service: sql-database
ms.subservice: 
ms.custom: 
ms.devlang: 
ms.topic: conceptual
keywords: SQL Server cloud, SQL Server in the cloud, PaaS database, cloud SQL Server, DBaaS
author: CarlRabeler
ms.author: carlrab
ms.reviewer:
manager: craigg
ms.date: 10/15/2018
---
# Choose a cloud SQL Server option: Azure SQL (PaaS) Database or SQL Server on Azure VMs (IaaS)

In Azure, you can have your SQL Server workloads running in a hosted infrastructure (IaaS) or running as a hosted service ([PaaS](https://azure.microsoft.com/overview/what-is-paas/)):

- [Azure SQL Database](https://azure.microsoft.com/services/sql-database/): A SQL database engine, based on the Enterprise Edition of SQL Server, that is optimized for modern application development. Azure SQL Database offers several deployment options:

  - You can deploy a single database to a [logical server](sql-database-logical-servers.md).
  - You can deploy into an [elastic pool](sql-database-elastic-pool.md) on a [logical server](sql-database-logical-servers.md) to share resources and reduce costs.
  - You can deploy to a [Azure SQL Database Managed Instances](sql-database-managed-instance.md).

   The following illustration shows these deployment options:

     ![deployment-options](./media/sql-database-technical-overview/deployment-options.png)

     > [!NOTE]
     > With all three versions, Azure SQL Database adds additional features that are not available in SQL Server, such as built-in intelligence and management. A logical server containing single and pooled databases offers most of database-scoped features of SQL Server. With Azure SQL Database Managed Instance, Azure SQL Database offers shared resources for databases and additional instance-scoped features. Azure SQL Database Managed Instance supports database migration with minimal to no database change.

- [SQL Server on Azure Virtual Machines](https://azure.microsoft.com/services/virtual-machines/sql-server/): SQL Server installed and hosted in the cloud on Windows Server or Linux virtual machines (VMs) running on Azure, also known as an infrastructure as a service (IaaS). SQL Server on Azure virtual machines is a good option for migrating on-premises SQL Server databases and applications without any database change. All recent versions and editions of SQL Server are available for installation in an IaaS virtual machine. The most significant difference from SQL Database is that SQL Server VMs allow full control over the database engine. You can choose when maintenance/patching will start, to change the recovery model to simple or bulk logged to enable faster load less log, to pause or start engine when needed, and you can fully customize the SQL Server database engine. With this additional control comes with added responsibility to manage the virtual machines.

Learn how each deployment option fits into the Microsoft data platform and get help matching the right option to your business requirements. Whether you prioritize cost savings or minimal administration ahead of everything else, this article can help you decide which approach delivers against the business requirements you care about most.

## Microsoft's SQL data platform

One of the first things to understand in any discussion of Azure versus on-premises SQL Server databases is that you can use it all. Microsoft’s data platform leverages SQL Server technology and makes it available across physical on-premises machines, private cloud environments, third-party hosted private cloud environments, and public cloud. SQL Server on Azure virtual machines enables you to meet unique and diverse business needs through a combination of on-premises and cloud-hosted deployments, while using the same set of server products, development tools, and expertise across these environments.

   ![Cloud SQL Server options: SQL server on IaaS, or SaaS SQL database in the cloud.](./media/sql-database-paas-vs-sql-server-iaas/SQLIAAS_SQL_Server_Cloud_Continuum.png)

As seen in the diagram, each offering can be characterized by the level of administration you have over the infrastructure (on the X axis), and by the degree of cost efficiency achieved by database level consolidation and automation (on the Y axis).

When designing an application, four basic options are available for hosting the SQL Server part of the application:

- SQL Server on non-virtualized physical machines
- SQL Server in on-premises virtualized machines (private cloud)
- SQL Server in Azure Virtual Machine (Microsoft public cloud)
- Azure SQL Database (Microsoft public cloud)

In the following sections, you learn about SQL Server in the Microsoft public cloud: Azure SQL Database and SQL Server on Azure VMs. In addition, you explore common business motivators for determining which option works best for your application.

## A closer look at Azure SQL Database and SQL Server on Azure VMs

- **Azure SQL Database**

A relational database-as-a-service (DBaaS) hosted in the Azure cloud that falls into the industry category of *Platform-as-a-Service (PaaS)*. [SQL database](sql-database-technical-overview.md) is built on standardized hardware and software that is owned, hosted, and maintained by Microsoft. With SQL Database, you can use built-in features and functionality that require extensive configuration in SQL Server. When using SQL Database, you pay-as-you-go with options to scale up or out for greater power with no interruption. Azure SQL Database is an ideal environment for developing new applications in the cloud. And, with [Azure SQL Database Managed Instance](sql-database-managed-instance.md), you can bring your own license. Additionally, this option provides all of the PaaS benefits of Azure SQL Database but adds capabilities that were previously only available in SQL VMs. This includes a native virtual network (VNet) and near 100% compatibility with on-premises SQL Server. [Managed Instance](sql-database-managed-instance.md) is ideal for on-premises database migrations to Azure with minimal changes required.

- **SQL Server on Azure Virtual Machines (VMs)**

Falls into the industry category *Infrastructure-as-a-Service (IaaS)* and allows you to run SQL Server inside a virtual machine in the cloud. [SQL Server virtual machines](../virtual-machines/windows/sql/virtual-machines-windows-sql-server-iaas-overview.md) also run on standardized hardware that is owned, hosted, and maintained by Microsoft. When using SQL Server on a VM, you can either pay-as you-go for a SQL Server license already included in a SQL Server image or easily use an existing license. You can also stop or resume the VM as needed.

In general, these two SQL options are optimized for different purposes:

- **Azure SQL Database**

Optimized to reduce overall management costs to the minimum for provisioning and managing many databases. It reduces ongoing administration costs because you do not have to manage any virtual machines, operating system or database software. You do not have to manage upgrades, high availability, or [backups](sql-database-automated-backups.md). In general, Azure SQL Database can dramatically increase the number of databases managed by a single IT or development resource. [Elastic pools](sql-database-elastic-pool.md) also support SaaS multi-tenant application architectures with features including tenant isolation and the ability to scale to reduce costs by sharing resources across databases. [Azure SQL Database Managed Instance](sql-database-managed-instance.md) provides support for instance-scoped features enabling easy migration of existing applications, as well as sharing resources amongst databases.

- **SQL Server running on Azure VMs**

Optimized for migrating existing applications to Azure or extending existing on-premises applications to the cloud in hybrid deployments. In addition, you can use SQL Server in a virtual machine to develop and test traditional SQL Server applications. With SQL Server on Azure VMs, you have the full administrative rights over a dedicated SQL Server instance and a cloud-based VM. It is a perfect choice when an organization already has IT resources available to maintain the virtual machines. These capabilities allow you to build a highly customized system to address your application’s specific performance and availability requirements.

The following table summarizes the main characteristics of SQL Database and SQL Server on Azure VMs:

| | Azure SQL Database<br>Logical servers, elastic pools, and single databases | Azure SQL Database<br>Managed Instance |Azure Virtual Machine<br>SQL Server |
| --- | --- | --- |---|
| **Best for:** |New cloud-designed applications that want to use the latest stable SQL Server features and have time constraints in development and marketing. | New applications or existing on-premises applications that want to use the latest stable SQL Server features and that are migrated to the cloud with minimal changes.  | Existing applications that require fast migration to the cloud with minimal changes or no changes. Rapid development and test scenarios when you do not want to buy on-premises non-production SQL Server hardware. |
|  | Teams that need built-in high availability, disaster recovery, and upgrade for the database. | Same as SQL Database. | Teams that can configure, fine tune, customize, and manage high availability, disaster recovery, and patching for SQL Server. Some provided automated features dramatically simplify this. | |
|  | Teams that do not want to manage the underlying operating system and configuration settings. | Same as SQL Database. | You need a customized environment with full administrative rights. | |
|  | Databases of up to 100 TB. | Same as SQL Database. | SQL Server instances with up to 64 TB of storage. The instance can support as many databases as needed. |
| **Compatibility** | Supports most on-premises database-level capabilities. | Supports almost all on-premises instance-level and database-level capabilities. | Supports all on-premises capabilities. |
| **Resources:** | You do not want to employ IT resources for configuration and management of the underlying infrastructure but want to focus on the application layer. | Same as SQL Database. | You have some IT resources for configuration and management. Some provided automated features dramatically simplify this. |
| **Total cost of ownership:** | Eliminates hardware costs and reduces administrative costs. | Same as SQL Database. | Eliminates hardware costs. |
| **Business continuity:** |In addition to [built-in fault tolerance infrastructure capabilities](sql-database-high-availability.md), Azure SQL Database provides features, such as [automated backups](sql-database-automated-backups.md), [Point-In-Time Restore](sql-database-recovery-using-backups.md#point-in-time-restore), [geo-restore](sql-database-recovery-using-backups.md#geo-restore), and [failover groups and active geo-replication](sql-database-geo-replication-overview.md) to increase business continuity. For more information, see [SQL Database business continuity overview](sql-database-business-continuity.md). | Same as SQL Database, plus user-initiated, copy-only backups are available. | SQL Server on Azure VMs lets you set up a high availability and disaster recovery solution for your database’s specific needs. Therefore, you can have a system that is highly optimized for your application. You can test and run failovers by yourself when needed. For more information, see [High Availability and Disaster Recovery for SQL Server on Azure Virtual Machines](../virtual-machines/windows/sql/virtual-machines-windows-sql-high-availability-dr.md). |
| **Hybrid cloud:** |Your on-premises application can access data in Azure SQL Database. | [Native virtual network implementation](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-vnet-configuration) and connectivity to your on-premises environment using Azure Express Route or VPN Gateway. | With SQL Server on Azure VMs, you can have applications that run partly in the cloud and partly on-premises. For example, you can extend your on-premises network and Active Directory Domain to the cloud via [Azure Virtual Network](../virtual-network/virtual-networks-overview.md). In addition, you can store on-premises data files in Azure Storage using [SQL Server Data Files in Azure](http://msdn.microsoft.com/library/dn385720.aspx). For more information, see [Introduction to SQL Server 2014 Hybrid Cloud](http://msdn.microsoft.com/library/dn606154.aspx). |
|  | Supports [SQL Server transactional replication](https://msdn.microsoft.com/library/mt589530.aspx) as a subscriber to replicate data. | Replication is not supported for Azure SQL Database Managed Instance. | Fully supports [SQL Server transactional replication](https://msdn.microsoft.com/library/mt589530.aspx), [Always On Availability Groups](../virtual-machines/windows/sql/virtual-machines-windows-sql-high-availability-dr.md), Integration Services, and Log Shipping to replicate data. Also, traditional SQL Server backups are fully supported | |
|  | | |

## Business motivations for choosing Azure SQL Database or SQL Server on Azure VMs

### Cost

Whether you’re a startup that is strapped for cash, or a team in an established company that operates under tight budget constraints, limited funding is often the primary driver when deciding how to host your databases. In this section, you learn about the billing and licensing basics in Azure with regards to these two relational database options: SQL Database and SQL Server on Azure VMs. You also learn about calculating the total application cost.

#### Billing and licensing basics

Currently, **SQL Database** is sold as a service and is available in several service tiers with different prices for resources, all of which are billed hourly at a fixed rate based on the service tier and compute size you choose. With SQL Database Managed Instance, you can also bring your own license. For more information on bring-your-own licensing, see [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility/). In addition, you are billed for outgoing Internet traffic at regular [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/). You can dynamically adjust service tiers and compute sizes to match your application’s varied throughput needs. For the latest information on the current supported service tiers, see [DTU-based purchasing model](sql-database-service-tiers-dtu.md) and [vCore-based purchasing model](sql-database-service-tiers-vcore.md). You can also create [elastic pools](sql-database-elastic-pool.md) to share resources among database instances to reduce costs and accommodate usage spikes.

With **SQL Database**, the database software is automatically configured, patched, and upgraded by Microsoft, which reduces your administration costs. In addition, its [built-in backup](sql-database-automated-backups.md) capabilities help you achieve significant cost savings, especially when you have a large number of databases.

With **SQL Server on Azure VMs**, you can use any of the platform-provided SQL Server images (which includes a license) or bring your SQL Server license. All the supported SQL Server versions (2008R2, 2012, 2014, 2016) and editions (Developer, Express, Web, Standard, Enterprise) are available. In addition, Bring-Your-Own-License versions (BYOL) of the images are available. When using the Azure provided images, the operational cost depends on the VM size and the edition of SQL Server you choose. Regardless of VM size or SQL Server edition, you pay per-minute licensing cost of SQL Server and the Windows or Linux Server, along with the Azure Storage cost for the VM disks. The per-minute billing option allows you to use SQL Server for as long as you need without buying addition SQL Server licenses. If you bring your own SQL Server license to Azure, you are charged for server and storage costs only. For more information on bring-your-own licensing, see [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility/). In addition, you are billed for outgoing Internet traffic at regular [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/).

#### Calculating the total application cost

When you start using a cloud platform, the cost of running your application includes the cost for new development and ongoing administration costs, plus the public cloud platform service costs.

**When using Azure SQL Database:**

- Highly minimized administration costs
- Limited development costs for migrated applications
- SQL Database service costs
- No hardware purchasing costs

**When using SQL Server on Azure VMs:**

- Higher administration costs
- Limited to no development costs for migrated applications
- Virtual Machine service costs
- SQL Server license costs
- No hardware purchasing costs

For more information on pricing, see the following resources:

- [SQL Database Pricing](https://azure.microsoft.com/pricing/details/sql-database/)
- [Virtual Machine Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/) for [SQL](https://azure.microsoft.com/pricing/details/virtual-machines/#sql) and for [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/#windows)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

### Administration

For many businesses, the decision to transition to a cloud service is as much about offloading complexity of administration as it is cost. With IaaS and PaaS, Microsoft administers the underlying infrastructure and automatically replicates all data to provide disaster recovery, configures and upgrades the database software, manages load balancing, and does transparent failover if there is a server failure within a data center.

- With **Azure SQL Database**, you can continue to administer your database, but you no longer need to manage the database engine, server operating system or hardware.  Examples of items you can continue to administer include databases and logins, index and query tuning, and auditing and security. Additionally, configuring high availability to another data center requires minimal configuration and administration.
- With **SQL Server on Azure VMs**, you have full control over the operating system and SQL Server instance configuration. With a VM, it’s up to you to decide when to update/upgrade the operating system and database software and when to install any additional software such as anti-virus. Some automated features are provided to dramatically simplify patching, backup, and high availability. In addition, you can control the size of the VM, the number of disks, and their storage configurations. Azure allows you to change the size of a VM as needed. For information, see [Virtual Machine and Cloud Service Sizes for Azure](../virtual-machines/windows/sizes.md).

### Service Level Agreement (SLA)

For many IT departments, meeting up-time obligations of a Service Level Agreement (SLA) is a top priority. In this section, we look at what SLA applies to each database hosting option.

For **SQL Database**, Microsoft provides an availability SLA of 99.99%. For the latest information, see [Service Level Agreement](https://azure.microsoft.com/support/legal/sla/sql-database/).

For **SQL Server running on Azure VMs**, Microsoft provides an availability SLA of 99.95% that covers just the Virtual Machine. This SLA does not cover the processes (such as SQL Server) running on the VM and requires that you host at least two VM instances in an availability set. For the latest information, see the [VM SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/). For database high availability (HA) within VMs, you should configure one of the supported high availability options in SQL Server, such as [Always On Availability Groups](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/always-on-availability-groups-sql-server). Using a supported high availability option doesn't provide an additional SLA, but allows you to achieve >99.99% database availability.

### <a name="market"></a>Time to move to Azure

**SQL Database logical servers, elastic pools, and single databases** is the right solution for cloud-designed applications when developer productivity and fast time-to-market for new solutions are critical. With programmatic DBA-like functionality, it is perfect for cloud architects and developers as it lowers the need for managing the underlying operating system and database.

**SQL Database Managed Instance** greatly simplifies the migration of existing applications to Azure SQL Database, enabling you to bring migrated database applications to market in Azure quickly.

**SQL Server running on Azure VMs** is perfect if your existing or new applications require large databases or access to all features in SQL Server or Windows/Linux, and you want to avoid the time and expense of acquiring new on-premises hardware. It is also a good fit when you want to migrate existing on-premises applications and databases to Azure as-is - in cases where Azure SQL Database Managed Instance is not a good fit. Since you do not need to change the presentation, application, and data layers, you save time and budget on re-architecting your existing solution. Instead, you can focus on migrating all your solutions to Azure and in doing some performance optimizations that may be required by the Azure platform. For more information, see [Performance Best Practices for SQL Server on Azure Virtual Machines](../virtual-machines/windows/sql/virtual-machines-windows-sql-performance.md).

## Next steps

- See [Your first Azure SQL Database](sql-database-get-started-portal.md) to get started with SQL Database.
- See [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/).
- See [Provision a SQL Server virtual machine in Azure](../virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision.md) to get started with SQL Server on Azure VMs.
