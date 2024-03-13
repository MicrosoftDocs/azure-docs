---
title: Selecting the right deployment type - Azure Database for MariaDB
description: This article describes what factors to consider before you deploy Azure Database for MariaDB as either infrastructure as a service (IaaS) or platform as a service (PaaS).
ms.service: mariadb
author: mksuni
ms.author: sumuth
ms.topic: conceptual
ms.date: 06/24/2022
---

# Choose the right MariaDB Server option in Azure

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

With Azure, your MariaDB server workloads can run in a hosted virtual machine infrastructure as a service (IaaS) or as a hosted platform as a service (PaaS). PaaS has multiple deployment options, and there are service tiers within each deployment option. When you choose between IaaS and PaaS, you must decide if you want to manage your database, apply patches, and make backups, or if you want to delegate these operations to Azure.

When making your decision, consider the following two options:

- **Azure Database for MariaDB:** This option is a fully managed MariaDB database engine based on the stable version of MariaDB community edition. This relational database as a service (DBaaS), hosted on the Azure cloud platform, falls into the industry category of PaaS.

  With a managed instance of MariaDB on Azure, you can use built-in features that otherwise require extensive configuration when MariaDB Server is either on-premises or in an Azure VM.

  When using MariaDB as a service, you pay as you go with options to scale up or scale out for greater control with no interruption. And unlike standalone MariaDB Server, Azure Database for MariaDB has additional features like built-in high availability, intelligence, and management.

- **MariaDB on Azure VMs:** This option falls into the industry category of IaaS. With this service, you can run MariaDB Server inside a fully managed virtual machine on the Azure cloud platform. All recent versions and editions of MariaDB can be installed on an IaaS virtual machine.

  In the most significant difference from Azure Database for MariaDB, MariaDB on Azure VMs offers control over the database engine. However, this control comes at the cost of responsibility to manage the VMs and many database administration (DBA) tasks. These tasks include maintaining and patching database servers, database recovery, and high-availability design.

The main differences between these options are listed in the following table:

| Attribute          | Azure Database for MariaDB | MariaDB on Azure VMs    |
|:-------------------|:-----------------------------|:--------------------|
| Service-level agreement (SLA)                | Offers SLA of 99.99% availability| Up to 99.95% availability with two or more instances in the same availability set.<br/><br/>99.9% availability with a single instance VM using premium storage.<br/><br/>99.99% using Availability Zones with multiple instances in multiple availability sets.<br/><br/>See the [Virtual Machines SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/v1_8/). |
| Operating system patching        | Automatic  | Managed by customers |
| MariaDB patching     | Automatic  | Managed by customers |
| High availability | The high availability (HA) model is based on built-in failover mechanisms for when a node-level interruption occurs. In such cases, the service automatically creates a new instance and attaches storage to this instance. | Customers architect, implement, test, and maintain high availability. Capabilities might include always-on failover clustering, always-on group replication, log shipping, or transactional replication.|
| Zone redundancy | Currently not supported | Azure VMs can be set up to run in different availability zones. For an on-premises solution, customers must create, manage, and maintain their own secondary data center.|
| Hybrid scenarios | With [Data-in Replication](concepts-data-in-replication.md), you can synchronize data from an external MariaDB server into the Azure Database for MariaDB service. The external server can be on-premises, in virtual machines, or a database service hosted by other cloud providers.<br/><br/> With the [read replica](concepts-read-replicas.md) feature, you can replicate data from an Azure Database for MariaDB source server to up to five read-only replica servers. The replicas are either within the same Azure region or across regions. Read-only replicas are asynchronously updated using binlog replication technology.<br/><br/>Cross-region read replication is currently in public preview.| Managed by customers
| Backup and restoration | Automatically creates [server backups](concepts-backup.md#backups) and stores them in user-configured storage that is either locally redundant or geo-redundant. The service takes full, differential, and transaction log backups | Managed by customers |
| Monitoring database operations | Offers customers the ability to [set alerts](concepts-monitoring.md) on the database operation and act upon reaching thresholds. | Managed by customers |
| Advanced Threat Protection | Provides Advanced Threat Protection. This protection detects anomalous activities that indicate unusual and potentially harmful attempts to access or exploit databases.<br/><br/>Advanced Threat Protection is currently in public preview.| Customers must build this protection for themselves.
| Disaster recovery | Stores automated backups in user-configured [locally redundant or geo-redundant storage](howto-restore-server-portal.md). Backups can also restore a server to a point in time. The retention period is anywhere from 7 to 35 days. Restoration is accomplished by using the Azure portal. | Fully managed by customers. Responsibilities include but aren't limited to scheduling, testing, archiving, storage, and retention. An additional option is to use an Azure Recovery Services vault to back up Azure VMs and databases on VMs. This option is in preview. |
| Performance recommendations | Provides customers with [performance recommendations](https://techcommunity.microsoft.com/t5/Azure-Database-for-MariaDB/Azure-brings-intelligence-and-high-performance-to-Azure-Database/ba-p/769110) based on system-generated usage log files. The recommendations help to optimize workloads.<br/><br/>Performance recommendations are currently in public preview. | Managed by customers |

## Business motivations for choosing PaaS or IaaS

There are several factors that can influence your decision to choose PaaS or IaaS to host your MariaDB databases.

### Cost

Limited funding is often the primary consideration that determines the best solution for hosting your databases. This is true whether you're a startup with little cash or a team in an established company that operates under tight budget constraints. This section describes billing and licensing basics in Azure as they apply to Azure Database for MariaDB and MariaDB on Azure VMs.

#### Billing

Azure Database for MariaDB is currently available as a service in several tiers with different prices for resources. All resources are billed hourly at a fixed rate. For the latest information on the currently supported service tiers, compute sizes, and storage amounts, see [vCore-based purchasing model](concepts-pricing-tiers.md). You can dynamically adjust service tiers and compute sizes to match your application's varied throughput needs. You're billed for outgoing Internet traffic at regular [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/).

With Azure Database for MariaDB, Microsoft automatically configures, patches, and upgrades the database software. These automated actions reduce your administration costs. Also, Azure Database for MariaDB has [built-in backup](concepts-backup.md) capabilities. These capabilities help you achieve significant cost savings, especially when you have a large number of databases. In contrast, with MariaDB on Azure VMs you can choose and run any MariaDB version. No matter what MariaDB version you use, you pay for the provisioned VM and the costs for the specific MariaDB license type used.

Azure Database for MariaDB provides built-in high availability for any kind of node-level interruption while still maintaining the 99.99% SLA guarantee for the service. However, for database high availability within VMs, customers should use the high availability options like [MariaDB replication](https://mariadb.com/kb/en/library/setting-up-replication/) that are available on a MariaDB database. Using a supported high availability option doesn't provide an additional SLA. But it does let you achieve greater than 99.99% database availability at additional cost and administrative overhead.

For more information on pricing, see the following articles:
* [Azure Database for MariaDB pricing](https://azure.microsoft.com/pricing/details/MariaDB/)
* [Virtual machine pricing](https://azure.microsoft.com/pricing/details/virtual-machines/)
* [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/)

### Administration

For many businesses, the decision to transition to a cloud service is as much about offloading complexity of administration as it is about cost. With IaaS and PaaS, Microsoft:

- Administers the underlying infrastructure.
- Automatically replicates all data to provide disaster recovery.
- Configures and upgrades the database software.
- Manages load balancing.
- Does transparent fail-over if there's a server failure.

The following list describes administrative considerations for each option:

* With Azure Database for MariaDB, you can continue to administer your database. But you no longer need to manage the database engine, the operating system, or the hardware. Examples of items you can continue to administer include:

  - Databases
  - Sign-in
  - Index tuning
  - Query tuning
  - Auditing
  - Security

  Additionally, configuring high availability to another data center requires minimal to no configuration or administration.

* With MariaDB on Azure VMs, you have full control over the operating system and the MariaDB server instance configuration. With a VM, you decide when to update or upgrade the operating system and database software. You also decide when to install any additional software such as an antivirus application. Some automated features are provided to greatly simplify patching, backup, and high availability. You can control the size of the VM, the number of disks, and their storage configurations. For more information, see [Virtual machine and cloud service sizes for Azure](../virtual-machines/sizes.md).

### Time to move to Azure

* Azure Database for MariaDB is the right solution for cloud-designed applications when developer productivity and fast time to market for new solutions are critical. With programmatic functionality that is like DBA, the service is suitable for cloud architects and developers because it lowers the need for managing the underlying operating system and database.

* When you want to avoid the time and expense of acquiring new on-premises hardware, MariaDB on Azure VMs is the right solution for applications that require a MariaDB database or access to MariaDB features on Windows or Linux. This solution is also suitable for migrating existing on-premises applications and databases to Azure intact, for cases where Azure Database for MariaDB is a poor fit.

  Because there's no need to change the presentation, application, and data layers, you save time and budget on rearchitecting your existing solution. Instead, you can focus on migrating all your solutions to Azure and addressing some performance optimizations that the Azure platform might require.

## Next steps

* See [Azure Database for MariaDB pricing](https://azure.microsoft.com/pricing/details/MariaDB/).
* Get started by [creating your first server](quickstart-create-mariadb-server-database-using-azure-portal.md).
