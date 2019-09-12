---
title: Selecting the right deployment type for your Azure Database for MySQL
description: This article describes what are the consideration that needs to be done before going ahead with Infrastucture-as-a-service (IAAS) or Platform-as-a-service (PaaS) for your Azure Database for MySQL.
author: kummanish
ms.author: manishku
ms.service: mysql
ms.topic: conceptual
ms.date: 08/05/2019
---

# Choose the right MySQL Server option in Azure

Whether you prioritize cost savings or minimal administration ahead of everything else, this article can help you decide which approach delivers against the business requirements you care about most.<br/>

In Azure, you can have your MySQL server workloads running in a hosted infrastructure VM (IaaS) or running as a hosted service (PaaS). Within PaaS, you have multiple service tiers to choose from, which gives you the option to select the best option that suits your business needs. The key question that you need to ask when deciding between PaaS or IaaS is do you want to manage your server, apply patches, take backups, or you want to delegate these operations to Azure? Depending on the answer, you have the following options: <br/><br/>
**Azure Database for MySQL** is a fully managed MySQL database engine, based on the stable version of the community edition. This is a relational database-as-a-service (DBaaS) hosted in the Azure cloud that falls into the industry category of Platform-as-a-Service (PaaS). With a managed MySQL server on Azure, you can use built-in features and functionality that require extensive configuration when using MySQL either on-premises or in an Azure virtual machine. When using MySQL as a service you pay-as-you-go with options to scale up or out for greater power with no interruption. Additionally, as a managed database service, Azure Database for MySQL provides additional features that are not available in standalone MySQL server, such as built-in high availability, intelligent capabilities, and management. <br/><br/>
**MySQL on Azure VM** falls into the industry category Infrastructure-as-a-Service (IaaS) and allows you to run MySQL server inside a virtual machine (VM) in Azure cloud. All recent versions and editions of MySQL can be installed on an IaaS virtual machine. The most significant difference from Azure Database for MySQL is that MySQL on Azure VMs allow control over the database engine. However, this control comes at the cost of additional responsibility to manage the virtual machines and numerous DBA tasks such as database server maintenance/patching, the recovery and high availability design etc.

The main differences between these options are listed in the following table:

|            | **Azure Database for MySQL** | **MySQL on Azure VMs**    |
|:-------------------|:-----------------------------|:--------------------|
| **SLA**                | Offers SLA of 99.99% availability| **SLA (for IaaS in Azure)** <br/>Up to 99.95% availability with 2 or more instance in same Availability Set. <br/>99.9% Single-Instance VM using Premium storage <br/> 99.99% with Availability Zone with 2 or more instance in 2 or more Availability Set.<br/> *[Virtual Machine SLA](https://azure.microsoft.com/en-us/support/legal/sla/virtual-machines/v1_8/) |
| **OS Patching**        | Automatic  | Managed by customers |
|**MySQL Patching**     | Automatic  | Managed by customers |
| **High Availability** | The high availability (HA) model is based on built-in failover mechanisms when a node-level interruption occurs. In such cases, the service automatically creates instance and attaches storage to this new instance. | High Availability is architected, implemented, tested, and maintained by the customer. This may include, Always-On (Failover Clustering or Group replication), Log Shipping, Transactional Replication depending on the version of MySQL engine that is being used.|
| **Zone Redundancy** | Currently not supported. | Azure VMs can be set up to run in different availability zones. For an on-premises solution, customers are expected to create, manage, and maintain their own secondary data center.|
| **Hybrid Scenarios** | [Data-in Replication](https://docs.microsoft.com/azure/mysql/concepts-data-in-replication) allows you to synchronize data from an external MySQL server into the Azure Database for MySQL service. The external server can be on-premises, in virtual machines, or a database service hosted by other cloud providers.  <br/> <br/> The [read replica](https://docs.microsoft.com/azure/postgresql/concepts-read-replicas) feature allows you to replicate data from an Azure Database for MySQL server (master) to up to five read-only servers (replicas) within the same Azure region, or across regions. Read-only replicas are asynchronously updated using binlog replication technology.   <br/> <br/> Note - Cross-region read replication is currently in public preview.| Managed by customers <br/>
| **Backup and restore** | Azure Database for MySQL automatically creates [server backups](https://docs.microsoft.com/azure/mysql/concepts-backup#backups) and stores them in user configured locally redundant or geo-redundant storage. A new database based on a backup can be created using [Point-in-time Recovery](https://docs.microsoft.com/azure/mysql/howto-restore-server-portal#point-in-time-restore) (PITR) option. Restores can be done from the Azure Portal, Azure CLI, or through REST API. | Managed by customers |
| **Monitoring database operations** | Customer can [set alerts](https://docs.microsoft.com/azure/mysql/concepts-monitoring) on the database operation and act upon reaching thresholds.   |  Managed by customers |
| **Advanced thread protection** | [Advanced Threat Protection](https://docs.microsoft.com/azure/mysql/howto-database-threat-protection-portal) for Azure Database for MySQL detects anomalous activities indicating unusual and potentially harmful attempts to access or exploit server.  | Not provided for the customers.
| **Backups (Disaster Recovery)** | Automated backups are stored in locally redundant or geo-redundant storage [locally redundant or geo-redundant storage](https://docs.microsoft.com/azure/mysql/howto-restore-server-portal). They can also be used to restore your server. <br/>The retention period can be set from 7 days to up to 35 days. Restore can be accomplished done using the Azure portal. <br/> | Fully managed by customer, including scheduling, testing, archiving, storage and retention. An additional option is to use Azure Recovery Services Vault to backup Azure VMs and Databases on VMs (Preview). |
| **Performance Recommendation** | Receive proactive [performance recommendation](https://techcommunity.microsoft.com/t5/Azure-Database-for-MySQL/Azure-brings-intelligence-and-high-performance-to-Azure-Database/ba-p/769110) based on the usage telemetry that helps in optimizing workloads  | Managed by customers |


## Business motivations for choosing Azure Database for MySQL or MySQL on Azure VMs

There are several factors that can influence your decision to choose PaaS or IaaS to host your MySQL databases:

### Cost

Whether you’re a startup that is strapped for cash, or a team in an established company that operates under tight budget constraints, limited funding is often the primary driver when deciding how to host your databases server. In this section, you learn about the billing and licensing basics in Azure with regards to these two relational database options Azure Database for MySQL and MySQL on Azure VMs:

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

* **With Azure Database for MySQL**, you can continue to administer your database, but you no longer need to manage the database engine, the operating system, or the hardware. Examples of items you can continue to administer include databases and logins, index and query tuning, and auditing and security. Additionally, configuring high availability to another data center requires minimal or no configuration and administration.<br/><br/>
* **With MySQL on Azure VMs**, you have full control over the operating system and MySQL server instance configuration. With a VM, it’s up to you to decide when to update/upgrade the operating system and database software and when to install any additional software such as anti-virus. Some automated features are provided to dramatically simplify patching, backup, and high availability. In addition, you can control the size of the VM, the number of disks, and their storage configurations. For information, see Virtual Machine and Cloud Service Sizes for Azure. However, these controls come at the cost of additional administration to manage the virtual machines and numerous DBA tasks such as database server maintenance/patching, the recovery and high availability design etc. which negatively impacts the benefits of transitioning to cloud.

### Time to move to Azure <br/>
* **Azure Database for MySQL** is the right solution for cloud-designed applications when developer's productivity and fast time-to-market is critical. With programmatic DBA-like functionality, it is perfect for cloud architects and developers as it lowers administrative tasks of managing the underlying operating system and database.<br/><br/>
* **MySQL on Azure VMs** is perfect if your existing or new applications require MySQL database or access to features in MySQL database on Windows/Linux, and you want to avoid the time and expense of acquiring new on-premises hardware while still want to control and administration of the database. It is also a good fit when you want to migrate existing on-premises applications and databases to Azure as is. Since you do not need to change the presentation, application, and data layers, you save time and budget on re-architecting your existing solution. Instead, you can focus doing performance optimizations that may be required on the Azure platform.

## Next Steps

* See [Azure Database for MySQL Pricing](https://azure.microsoft.com/pricing/details/mysql/)
* Get started by [creating your first server](https://review.docs.microsoft.com/en-us/azure/mysql/quickstart-create-mysql-server-database-using-azure-portal).

