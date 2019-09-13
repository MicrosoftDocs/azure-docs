---
title: Selecting the right deployment type for your Azure Database for MySQL
description: This article describes what are the consideration that needs to be done before going ahead with Infrastructure-as-a-service (IaaS) or Platform-as-a-service (PaaS) for your Azure Database for MySQL.
author: kummanish
ms.author: manishku
ms.service: mysql
ms.topic: conceptual
ms.date: 08/05/2019
---

# Choose the right MySQL Server option in Azure

With Azure, your MySQL server workloads can run in a hosted infrastructure VM (IaaS) or as a hosted service (PaaS). PaaS has multiple deployment options, and there are service tiers within each deployment option. When deciding between PaaS or IaaS, you need to determine whether you want to manage your database, apply patches, and take backups, or you want to delegate these operations to Azure.</br>

Based on your answer to that question, consider the following options: <br/>

**Azure Database for MySQL** is a fully managed MySQL database engine based on the stable version of the community edition. This relational database-as-a-service (DBaaS), hosted in the Azure cloud, falls into the industry category of Platform-as-a-Service (PaaS). With a managed instance of MySQL on Azure, you can use built-in features and functionality that require extensive configuration when using MySQL Server (either on-premises or in an Azure virtual machine). When using MySQL as a service, you pay-as-you-go with options to scale up or out for greater power with no interruption. In addition, unlike standalone MySQL server, Azure Database for MySQL has additional features such as built-in high availability, intelligence, and management. <br/><br/>
**MySQL on Azure VM** falls into the industry category Infrastructure-as-a-Service (IaaS) and allows you to run MySQL server inside a fully managed virtual machine in the Azure cloud. All recent versions and editions of MySQL can be installed on an IaaS virtual machine. The most significant difference from Azure Database for MySQL is that MySQL on Azure VMs allow control over the database engine. However, this control comes at the cost of additional responsibility to manage the virtual machines and numerous DBA tasks such as database server maintenance/patching, the recovery and high availability design etc.

The main differences between these options are listed in the following table:

|            | **Azure Database for MySQL** | **MySQL on Azure VMs**    |
|:-------------------|:-----------------------------|:--------------------|
| **SLA**                | Offers SLA of 99.99% availability| Up to 99.95% availability with 2 or more instance in same Availability Set. <br/>99.9% Single-Instance VM using Premium storage <br/> 99.99% with Availability Zone with 2 or more instance in 2 or more Availability Set.<br/> Note - [Virtual Machine SLA](https://azure.microsoft.com/en-us/support/legal/sla/virtual-machines/v1_8/) |
| **OS Patching**        | Automatic  | Managed by customers |
|**MySQL Patching**     | Automatic  | Managed by customers |
| **High Availability** | The high availability (HA) model is based on built-in failover mechanisms when a node-level interruption occurs. In such cases, the service automatically creates instance and attaches storage to this new instance. | High Availability is architected, implemented, tested, and maintained by the customer. This may include Always-On (Failover Clustering or Group replication), Log Shipping, and Transactional Replication, depending on the version of MySQL engine in use.|
| **Zone Redundancy** | Currently not supported. | Azure VMs can be set up to run in different availability zones. For an on-premises solution, customers are expected to create, manage, and maintain their own secondary data center.|
| **Hybrid Scenarios** | [Data-in Replication](https://docs.microsoft.com/azure/mysql/concepts-data-in-replication) allows you to synchronize data from an external MySQL server into the Azure Database for MySQL service. The external server can be on-premises, in virtual machines, or a database service hosted by other cloud providers.  <br/> <br/> The [read replica](https://docs.microsoft.com/azure/postgresql/concepts-read-replicas) feature allows you to replicate data from an Azure Database for MySQL server (master) to up to five read-only servers (replicas) within the same Azure region, or across regions. Read-only replicas are asynchronously updated using binlog replication technology.   <br/> <br/> Note - Cross-region read replication is currently in public preview.| Managed by customers <br/>
| **Backup and restore** | Automatically creates [server backups](https://docs.microsoft.com/azure/mysql/concepts-backup#backups) and stores them in user configured locally redundant or geo-redundant storage. The service takes full, differential, and transaction log backups | Managed by customers |
| **Monitoring database operations** | Allows customers to [set alerts](https://docs.microsoft.com/azure/mysql/concepts-monitoring) on the database operation and act upon reaching thresholds. | Managed by customers |
| **Advanced thread protection** | Provides [Advanced Threat Protection](https://docs.microsoft.com/azure/mysql/howto-database-threat-protection-portal) which detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit databases. | Customers must build for themselves.
| **Backups (Disaster Recovery)** | Stores automated backups in user configured in  [locally redundant or geo-redundant storage](https://docs.microsoft.com/azure/mysql/howto-restore-server-portal). Backups can also be used to restore a server to a point-in-time. The retention period can be set from 7-35 days. Restore can be accomplished using the Azure portal. <br/> | Fully managed by customer, including but not limited to scheduling, testing, archiving, storage and retention. An additional option is to use Azure Recovery Services Vault to backup Azure VMs and Databases on VMs (in Preview). |
| **Performance Recommendation** | Provides customers with proactive [performance recommendation](https://techcommunity.microsoft.com/t5/Azure-Database-for-MySQL/Azure-brings-intelligence-and-high-performance-to-Azure-Database/ba-p/769110) based on the usage telemetry to help in optimizing workloads. | Managed by customers |


## Business motivations for choosing Azure Database for MySQL or MySQL on Azure VMs

There are several factors that can influence your decision to choose PaaS or IaaS to host your MySQL databases:

### Cost

Whether you’re a startup strapped for cash or a team in an established company that operates under tight budget constraints, limited funding is often the primary consideration when determining the best solution for hosting your databases. This section describes billing and licensing basics in Azure with regards to Azure Database for MySQL and MySQL on Azure VMs:

#### Billing

Currently, Azure Database for MySQL is available as a service in several tiers with different prices for resources, all of which are billed hourly at a fixed rate. For the latest information on the current supported service tiers, compute sizes, and storage amounts, see [vCore-based purchasing model](https://docs.microsoft.com/azure/mysql/concepts-pricing-tiers). You can dynamically adjust service tiers and compute sizes to match your application’s varied throughput needs. You are billed for outgoing Internet traffic at regular [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/).

With Azure Database for MySQL, the database software is automatically configured, patched, and upgraded by Microsoft, which reduces your administration costs. In addition, its [built-in backup](https://docs.microsoft.com/azure/mysql/concepts-backup) capabilities help you achieve significant cost savings, especially when you have a large number of databases. With MySQL on Azure VMs you can choose and run any of the MySQL version. Regardless of the MySQL version you use, you pay for the VM provisioned and the costs for the specific license type used for MySQL.

Azure Database for MySQL provides built in high availability for any kind of node level interruption and still maintains the 99.99 % SLA for the service. However, for database high availability (HA) within VMs, customer should go through the high availability options available on MySQL database, such as [MySQL Replication](https://dev.mysql.com/doc/refman/8.0/en/replication.html). Using a supported high availability option doesn't provide an additional SLA, but allows you to achieve >99.99% database availability at an additional cost and administrative overhead.

For more information on pricing, see the following resources:
* [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/)
* [Virtual machine pricing](https://azure.microsoft.com/pricing/details/virtual-machines/)
* [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/)

### Administration

For many businesses, the decision to transition to a cloud service is as much about offloading complexity of administration. With IaaS and PaaS, Microsoft administers the underlying infrastructure and automatically replicates all data to provide disaster recovery, configures and upgrades the database software, manages load balancing, and does transparent fail-over if there is a server failure.

* **With Azure Database for MySQL**, you can continue to administer your database, but you no longer need to manage the database engine, the operating system, or the hardware. Examples of items you can continue to administer include databases and logins, index and query tuning, and auditing and security. Additionally, configuring high availability to another data center requires minimal or no configuration or administration.<br/><br/>
* **With MySQL on Azure VMs**, you have full control over the operating system and MySQL server instance configuration. With a VM, you decide when to update/upgrade the operating system and database software and when to install any additional software such as an anti-virus application. Some automated features are provided to dramatically simplify patching, backup, and high availability. In addition, you can control the size of the VM, the number of disks, and their storage configurations. For information, see Virtual Machine and Cloud Service Sizes for Azure.

### Time to move to Azure <br/>
* **Azure Database for MySQL** is the right solution for cloud-designed applications when developer productivity and fast time-to-market for new solutions are critical. With programmatic DBA-like functionality, the service is perfect for cloud architects and developers because it lowers the need for managing the underlying operating system and database.<br/><br/>
* **MySQL on Azure VMs** is perfect for existing or new applications that require MySQL database or access to features in MySQL database on Windows/Linux, and you want to avoid the time and expense of acquiring new on-premises hardware. This option is also a good fit for migrating existing on-premises applications and databases to Azure as-is – for cases in which an Azure Database for MySQL instance is not a good fit. Since there is no need to change the presentation, application, and data layers, you save time and budget on re-architecting your existing solution. Instead, you can focus on migrating all your solutions to Azure and in addressing some performance optimizations that may be required by the Azure platform.

## Next Steps

* See [Azure Database for MySQL Pricing](https://azure.microsoft.com/pricing/details/mysql/)
* Get started by [creating your first server](https://review.docs.microsoft.com/en-us/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal).

