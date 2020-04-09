---
title: Choose the right deployment option
description: Learn how to choose among the deployment options within Azure SQL between SQL databases, SQL managed instances, and SQL Server on Azure virtual machines.
services: sql-database
ms.service: sql-database
ms.subservice: service
ms.custom: 
ms.devlang: 
ms.topic: conceptual
keywords: SQL Server cloud, SQL Server in the cloud, PaaS database, cloud SQL Server, DBaaS
author: stevestein
ms.author: sstein
ms.reviewer: 
ms.date: 08/22/2019
---
# Choose the right deployment option in Azure SQL

Learn how each deployment option fits into Microsoft's Azure SQL data platform, and get help matching the right option for your business requirements. Whether you prioritize cost savings or minimal administration, this article can help you decide which approach delivers against the business requirements you care about most.

## Microsoft's Azure SQL data platform

From lift-and-shift migrations, to modernization of existing applications, to building modern cloud services, Azure SQL is a modern SQL platform that offers several deployment options, powered by an industry leading Microsoft SQL Server engine. Azure SQL is designed to support a wide variety of application patterns with different levels of control over the underlying platform to meet the most demanding migration and modernization requirements. Azure SQL eliminates the complexity of managing diverse collections of SQL Server-based applications at scale by providing a single, unified management experience.

One of the first things to understand in any discussion of Azure versus on-premises SQL Server databases is that you can use it all. Microsoft's data platform leverages SQL Server technology and makes it available across physical on-premises machines, private cloud environments, third-party hosted private cloud environments, and the public cloud. SQL Server on Azure virtual machines (SQL virtual machines) enables you to meet unique and diverse business needs through a combination of on-premises and cloud-hosted deployments, while using the same set of server products, development tools, and expertise across these environments.

   ![Cloud SQL Server options: SQL server on IaaS, or SaaS SQL database in the cloud.](./media/sql-database-paas-vs-sql-server-iaas/SQLIAAS_SQL_Server_Cloud_Continuum.png)

As seen in the diagram, each offering can be characterized by the level of administration you have over the infrastructure, and by the degree of cost efficiency.

In Azure, you can have your SQL Server workloads running as a hosted service ([PaaS](https://azure.microsoft.com/overview/what-is-paas/)), or a hosted infrastructure ([IaaS](https://azure.microsoft.com/overview/what-is-iaas/)). Within PaaS, you have multiple deployment options and service tiers within each deployment option. The key question that you need to ask when deciding between PaaS or IaaS is do you want to manage your database, apply patches, and take backups, or do you want to delegate these operations to Azure?

Depending on the answer, you have the following options:

- [**SQL databases**](sql-database-technical-overview.md): Best for modern cloud applications that want to use the latest stable SQL Server features and have time constraints in development and marketing. A fully-managed SQL database engine, based on the latest stable Enterprise Edition of SQL Server. This is a relational database-as-a-service (DBaaS) hosted in the Azure cloud that falls into the industry category of *Platform-as-a-Service (PaaS)*. SQL database has multiple deployment options, each of which is built on standardized hardware and software that is owned, hosted, and maintained by Microsoft. With SQL Server, you can use built-in features and functionality that require extensive configuration (either on-premises or in an Azure virtual machine). When using SQL Database, you pay-as-you-go with options to scale up or out for greater power with no interruption. SQL Database has some additional features that are not available in SQL Server, such as built-in high availability, intelligence, and management.


  Databases offer the following deployment options:
  - As a [***single database***](sql-database-single-database.md) with its own set of resources managed via a database server. A single database is similar to a [contained database](https://docs.microsoft.com/sql/relational-databases/databases/contained-databases) in SQL Server. This option is optimized for modern application development of new cloud-born applications. [Hyperscale](sql-database-service-tier-hyperscale.md) and [serverless](sql-database-serverless.md) options are available.
  - An [***elastic pool***](sql-database-elastic-pool.md), which is a collection of databases with a shared set of resources managed via a database server. Single databases can be moved into and out of an elastic pool. This option is optimized for modern application development of new cloud-born applications using the multi-tenant SaaS application pattern. Elastic pools provide a cost-effective solution for managing the performance of multiple databases that have variable usage patterns.
  - A [***database server***](sql-database-servers.md), which is used to manage groups of single databases and elastic pools. Database servers act as a central administrative point for multiple single or pooled databases, [logins](sql-database-manage-logins.md), [firewall rules](sql-database-firewall-configure.md), [auditing rules](sql-database-auditing.md), [threat detection policies](sql-database-threat-detection.md), and [failover groups](sql-database-auto-failover-group.md).

- [**SQL managed instances**](sql-database-managed-instance.md): Best for most migrations to the cloud. Managed instance is a collection of system and user databases with a shared set of resources that is lift-and-shift ready. Best for new applications or existing on-premises applications that want to use the latest stable SQL Server features and that are migrated to the cloud with minimal changes. A managed instance is similar to an instance of the [Microsoft SQL Server database engine](https://docs.microsoft.com/sql/database-engine/sql-server-database-engine-overview) offering shared resources for databases and additional instance-scoped features. Managed instance supports database migration from on-premises with minimal to no database change. This option provides all of the PaaS benefits of Azure SQL Database but adds capabilities that were previously only available in SQL VMs. This includes a native virtual network (VNet) and near 100% compatibility with on-premises SQL Server. Managed instances provide full SQL Server access and feature compatibility for migrating SQL Servers to Azure.


- [**SQL virtual machines**](virtual-machines/windows/overview.md): Best for migrations and applications requiring OS-level access. SQL virtual machines are lift-and-shift ready for existing applications that require fast migration to the cloud with minimal changes or no changes. SQL virtual machines offer full administrative control over the SQL Server instance and underlying OS for migration to Azure. Rapid development and test scenarios when you do not want to buy on-premises non-production SQL Server hardware. SQL virtual machines fall into the industry category *Infrastructure-as-a-Service (IaaS)* and allows you to run SQL Server inside a fully-managed virtual machine (VM) in the Azure cloud. SQL virtual machines also run on standardized hardware that is owned, hosted, and maintained by Microsoft. When using SQL virtual machines, you can either pay-as-you-go for a SQL Server license already included in a SQL Server image or easily use an existing license. You can also stop or resume the VM as needed. SQL Server installed and hosted in the cloud runs on Windows Server or Linux virtual machines running on Azure, also known as an infrastructure as a service (IaaS). SQL virtual machines is a good option for migrating on-premises SQL Server databases and applications without any database change. All recent versions and editions of SQL Server are available for installation in an IaaS virtual machine. The most significant difference from SQL databases and SQL managed instances, is that SQL Server VMs allow full control over the database engine. You can choose when to start maintenance/patching, change the recovery model to simple or bulk-logged, pause or start the service when needed, and you can fully customize the SQL Server database engine. With this additional control comes the added responsibility to manage the virtual machine.

  Optimized for migrating existing applications to Azure or extending existing on-premises applications to the cloud in hybrid deployments. In addition, you can use SQL Server in a virtual machine to develop and test traditional SQL Server applications. With SQL virtual machines, you have the full administrative rights over a dedicated SQL Server instance and a cloud-based VM. It is a perfect choice when an organization already has IT resources available to maintain the virtual machines. These capabilities allow you to build a highly customized system to address your application’s specific performance and availability requirements.


Additional differences are listed in the following table, but ***both databases and managed instances are optimized to reduce overall management costs to the minimum for provisioning and managing many databases.*** It reduces ongoing administration costs because you do not have to manage any virtual machines, operating system or database software. You do not have to manage upgrades, high availability, or [backups](sql-database-automated-backups.md). In general, Azure SQL Database can dramatically increase the number of databases managed by a single IT or development resource. [Elastic pools](sql-database-elastic-pool.md) also support SaaS multi-tenant application architectures with features including tenant isolation and the ability to scale to reduce costs by sharing resources across databases. [Managed instance](sql-database-managed-instance.md) provides support for instance-scoped features enabling easy migration of existing applications, as well as sharing resources amongst databases.

| SQL databases | SQL managed instances | SQL virtual machines |
| :--- | :--- | :--- |
|Supports most on-premises database-level capabilities. The most commonly used SQL Server features are available.<br/>99.995% availability guaranteed.<br/>Built-in backups, patching, recovery.<br/>Latest stable Database Engine version.<br/>Ability to assign necessary resources (CPU/storage) to individual databases.<br/>Built-in advanced intelligence and security.<br/>Online change of resources (CPU/storage).| Supports almost all on-premises instance-level and database-level capabilities. High compatibility with SQL Server on-premises.<br/>99.99% availability guaranteed.<br/>Built-in backups, patching, recovery.<br/>Latest stable Database Engine version.<br/>Easy migration from SQL Server.<br/>Private IP address within Azure VNet.<br/>Built-in advanced intelligence and security.<br/>Online change of resources (CPU/storage).| You have full control over the SQL Server engine. Supports all on-premises capabilities.<br/>Up to 99.99% availability.<br/>Full parity with the matching version of on-premises SQL Server.<br/>Fixed, well-known database engine version.<br/>Easy migration from SQL Server on-premises.<br/>Private IP address within Azure VNet.<br/>You have ability to deploy application or services on the host where SQL Server is placed.|
|Migration from SQL Server might be hard.<br/>Some SQL Server features are not available.<br/>No guaranteed exact maintenance time (but nearly transparent).<br/>Compatibility with the SQL Server version can be achieved only using database compatibility levels.<br/>Private IP address cannot be assigned (you can limit the access using firewall rules).|There is still some minimal number of SQL Server features that are not available.<br/>No guaranteed exact maintenance time (but nearly transparent).<br/>Compatibility with the SQL Server version can be achieved only using database compatibility levels.|You need to manage your backups and patches.<br>You need to implement your own High-Availability solution.<br/>There is a downtime while changing the resources(CPU/storage)|
| Databases of up to 100 TB. | Up to 8 TB. | SQL Server instances with up to 256 TB of storage. The instance can support as many databases as needed. |
| On-premises application can access data in Azure SQL Database. | [Native virtual network implementation](sql-database-managed-instance-vnet-configuration.md) and connectivity to your on-premises environment using Azure Express Route or VPN Gateway. | With SQL virtual machines, you can have applications that run partly in the cloud and partly on-premises. For example, you can extend your on-premises network and Active Directory Domain to the cloud via [Azure Virtual Network](../virtual-network/virtual-networks-overview.md). For more information on hybrid cloud solutions, see [Extending on-premises data solutions to the cloud](https://docs.microsoft.com/azure/architecture/data-guide/scenarios/hybrid-on-premises-and-cloud). |




## Business motivations for choosing databases, managed instances, or SQL virtual machines

There are several factors that can influence your decision to choose between the different data offerings:

- [Cost](#cost) - Both PaaS and IaaS option include base price that cover underlying infrastructure and licensing. However, with IaaS option you need to invest additional time and resources to manage your database, while in PaaS you are getting these administration features included in the price. IaaS option enables you to shut down your resources while you are not using them to decrease the cost, while PaaS version is always running unless if you drop and re-create your resources when they are needed.
- [Administration](#administration) - PaaS options reduce the amount of time that you need to invest to administer the database. However, it also limits the range of custom administration tasks and scripts that you can perform or run. For example, the CLR is not supported with single or pooled databases, but is supported for a managed instance. Also, no deployment options in PaaS support the use of trace flags.
- [Service-Level Agreement](#service-level-agreement-sla) - Both IaaS and PaaS provide high, industry standard SLA. PaaS option guarantees 99.99% SLA, while IaaS guarantees 99.95% SLA for infrastructure, meaning that you need to implement additional mechanisms to ensure availability of your databases. You can implement High-availability solution at 99.99% by creating an additional SQL Server in VM and configure AlwaysOn Availability groups.
- [Time to move to Azure](#market) - SQL Server in Azure VM is the exact match of your environment, so migration from on-premises to Azure SQL VM is not different than moving the databases from one on-premises server to another. Managed instance also enables extremely easy migration; however, there might be some changes that you need to apply before you migrate to a managed instance.

These factors will be discussed in more details in the following sections.

### Cost

Whether you’re a startup that is strapped for cash, or a team in an established company that operates under tight budget constraints, limited funding is often the primary driver when deciding how to host your databases. In this section, you learn about the billing and licensing basics in Azure with regards to these two relational database options: SQL Database and SQL virtual machines. You also learn about calculating the total application cost.

#### Billing and licensing basics

Currently, **SQL Database** is sold as a service and is available with several deployment options and in several service tiers with different prices for resources, all of which are billed hourly at a fixed rate based on the service tier and compute size you choose. For the latest information on the current supported service tiers, compute sizes, and storage amounts, see [DTU-based purchasing model](sql-database-service-tiers-dtu.md) and [vCore-based purchasing model](sql-database-service-tiers-vcore.md).

- With SQL database, you can choose a service tier that fits your needs from a wide range of prices starting from 5$/month for basic tier.
- You can create [elastic pools](sql-database-elastic-pool.md) to share resources among database instances to reduce costs and accommodate usage spikes.
- With SQL managed instance, you can also bring your own license. For more information on bring-your-own licensing, see [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility/) or use [Azure Hybrid Benefit calculator](https://azure.microsoft.com/pricing/hybrid-benefit/#sql-database) to see how to **save up to 40%**.

In addition, you are billed for outgoing Internet traffic at regular [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/). You can dynamically adjust service tiers and compute sizes to match your application’s varied throughput needs.

With **SQL databases and SQL managed instances**, the database software is automatically configured, patched, and upgraded by Microsoft, which reduces your administration costs. In addition, its [built-in backup](sql-database-automated-backups.md) capabilities help you achieve significant cost savings, especially when you have a large number of databases.

With **SQL virtual machines**, you can use any of the platform-provided SQL Server images (which includes a license) or bring your SQL Server license. All the supported SQL Server versions (2008R2, 2012, 2014, 2016) and editions (Developer, Express, Web, Standard, Enterprise) are available. In addition, Bring-Your-Own-License versions (BYOL) of the images are available. When using the Azure provided images, the operational cost depends on the VM size and the edition of SQL Server you choose. Regardless of VM size or SQL Server edition, you pay per-minute licensing cost of SQL Server and the Windows or Linux Server, along with the Azure Storage cost for the VM disks. The per-minute billing option allows you to use SQL Server for as long as you need without buying addition SQL Server licenses. If you bring your own SQL Server license to Azure, you are charged for server and storage costs only. For more information on bring-your-own licensing, see [License Mobility through Software Assurance on Azure](https://azure.microsoft.com/pricing/license-mobility/). In addition, you are billed for outgoing Internet traffic at regular [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/).

#### Calculating the total application cost

When you start using a cloud platform, the cost of running your application includes the cost for new development and ongoing administration costs, plus the public cloud platform service costs.

For more information on pricing, see the following resources:

- [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/)
- [Virtual machine pricing](https://azure.microsoft.com/pricing/details/virtual-machines/) for [SQL](https://azure.microsoft.com/pricing/details/virtual-machines/#sql) and for [Windows](https://azure.microsoft.com/pricing/details/virtual-machines/#windows)
- [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

### Administration

For many businesses, the decision to transition to a cloud service is as much about offloading complexity of administration as it is cost. With IaaS and PaaS, Microsoft administers the underlying infrastructure and automatically replicates all data to provide disaster recovery, configures and upgrades the database software, manages load balancing, and does transparent failover if there is a server failure within a data center.

- With **SQL databases and SQL managed instances**, you can continue to administer your database, but you no longer need to manage the database engine, the operating system, or the hardware. Examples of items you can continue to administer include databases and logins, index and query tuning, and auditing and security. Additionally, configuring high availability to another data center requires minimal configuration and administration.
- With **SQL virtual machines**, you have full control over the operating system and SQL Server instance configuration. With a VM, it’s up to you to decide when to update/upgrade the operating system and database software and when to install any additional software such as anti-virus. Some automated features are provided to dramatically simplify patching, backup, and high availability. In addition, you can control the size of the VM, the number of disks, and their storage configurations. Azure allows you to change the size of a VM as needed. For information, see [Virtual Machine and Cloud Service Sizes for Azure](../virtual-machines/windows/sizes.md).

### Service Level Agreement (SLA)

For many IT departments, meeting up-time obligations of a Service Level Agreement (SLA) is a top priority. In this section, we look at what SLA applies to each database hosting option.

For **SQL Database**, Microsoft provides an availability SLA of 99.99%. For the latest information, see [Service Level Agreement](https://azure.microsoft.com/support/legal/sla/sql-database/).

For **SQL virtual machines**, Microsoft provides an availability SLA of 99.95% that covers just the Virtual Machine. This SLA does not cover the processes (such as SQL Server) running on the VM and requires that you host at least two VM instances in an availability set. For the latest information, see the [VM SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/). For database high availability (HA) within VMs, you should configure one of the supported high availability options in SQL Server, such as [Always On Availability Groups](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/always-on-availability-groups-sql-server). Using a supported high availability option doesn't provide an additional SLA, but allows you to achieve >99.99% database availability.

### <a name="market"></a>Time to move to Azure

**SQL database** (single databases or elastic pools) are the right solution for cloud-designed applications when developer productivity and fast time-to-market for new solutions are critical. With programmatic DBA-like functionality, it is perfect for cloud architects and developers as it lowers the need for managing the underlying operating system and database.

**SQL managed instance** greatly simplifies the migration of existing applications to Azure SQL, enabling you to bring migrated database applications to market in Azure quickly.

**SQL virtual machines** are perfect if your existing or new applications require large databases or access to all features in SQL Server or Windows/Linux, and you want to avoid the time and expense of acquiring new on-premises hardware. It is also a good fit when you want to migrate existing on-premises applications and databases to Azure as-is - in cases where Azure SQL Database managed instance is not a good fit. Since you do not need to change the presentation, application, and data layers, you save time and budget on re-architecting your existing solution. Instead, you can focus on migrating all your solutions to Azure and in doing some performance optimizations that may be required by the Azure platform. For more information, see [Performance Best Practices for SQL Server on Azure Virtual Machines](virtual-machines/windows/performance.md).

[!INCLUDE [sql-database-create-manage-portal](includes/sql-database-create-manage-portal.md)]

## Next steps

- See [Your first Azure SQL database](sql-database-single-database-get-started.md) to get started with SQL Database.
- See [SQL Database pricing](https://azure.microsoft.com/pricing/details/sql-database/).
- See [Provision a SQL Server virtual machine in Azure](virtual-machines/windows/create-vm-portal.md) to get started with SQL Server on Azure VMs.
- [Identify the right SQL database or SQL managed instance SKU for your on-premises database](/sql/dma/dma-sku-recommend-sql-db/).
