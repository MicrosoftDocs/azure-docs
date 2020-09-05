---
title: Selecting the right deployment type - Azure Database for MySQL
description: This article describes what factors to consider before you deploy Azure Database for MySQL as either infrastructure as a service (IaaS) or platform as a service (PaaS).
author: savjani
ms.author: pariks
ms.service: mysql
ms.topic: conceptual
ms.date: 08/26/2020
---

# Choose the right MySQL Server option in Azure

With Azure, your MySQL server workloads can run in a hosted virtual machine infrastructure as a service (IaaS) or as a hosted platform as a service (PaaS). PaaS has multiple deployment options, and there are service tiers within each deployment option. When you choose between IaaS and PaaS, you must decide if you want to manage your database, apply patches, and make backups, or if you want to delegate these operations to Azure.

When making your decision, consider the following two options:

- **Azure Database for MySQL**. This option is a fully managed MySQL database engine based on the stable version of MySQL community edition. This relational database as a service (DBaaS), hosted on the Azure cloud platform, falls into the industry category of PaaS.

  With a managed instance of MySQL on Azure, you can use built-in features viz automated patching, high availability, automated backups,elastic scaling, enterprise grade security, compliance and governance, monitoring and alerting that otherwise require extensive configuration when MySQL Server is either on-premises or in an Azure VM. When using MySQL as a service, you pay-as-you-go, with options to scale up or scale out for greater control with no interruption. 
  
  [Azure Database for MySQL](overview.md), powered by the MySQL community edition is available in two deployment modes:
    - [Single Server](single-server-overview.md) is a fully managed database service with minimal requirements for customizations of the database. The single server platform is designed to handle most of the database management functions such as patching, backups, high availability, security with minimal user configuration and control. The architecture is optimized to provide 99.99% availability on single availability zone. Single servers are best suited for cloud native applications designed to handle automated patching without the need for granular control on the patching schedule and custom MySQL configuration settings. 
    
    - [Flexible Server (Preview)](flexible-server/overview.md) is a fully managed database service designed to provide more granular control and flexibility over database management functions and configuration settings. In general, the service provides more flexibility and server configuration customizations compared to the single server deployment based on the user requirements. The flexible server architecture allows users to opt for high availability within a single availability zone and across multiple availability zones. Flexible servers also provide better cost optimization controls with the ability to start/stop your server and burstable SKUs, ideal for workloads that do not need full compute capacity continuously. 
    Flexible servers are best suited for:
     
      - Application development requiring better control and customizations of MySQL engine.
      - Zone redundant high availability
      - Managed maintenance windows

- **MySQL on Azure VMs**. This option falls into the industry category of IaaS. With this service, you can run MySQL Server inside a managed virtual machine on the Azure cloud platform. All recent versions and editions of MySQL can be installed in the virtual machine.

## Comparing the MySQL deployment options in Azure

The main differences between these options are listed in the following table:


| Attribute          | Azure Database for MySQL<br/>Single Server |Azure Database for MySQL<br/>Flexible Server  |MySQL on Azure VMs                      |
|:-------------------|:-------------------------------------------|:---------------------------------------------|:---------------------------------------|
| MySQL Version Support | 5.6, 5.7 & 8.0| 5.7 | Any version|
| Compute scaling | Supported (Scaling from and to Basic tier is not supported)| Supported | Supported|
| Storage size | 5 GiB to 16 TiB| 5 GiB to 16 TiB | 32 GiB to 32,767 GiB|
| Online Storage scaling | Supported| Supported| Not supported|
| Auto storage scaling | Supported| Not supported in preview| Not supported|
| Network Connectivity | - Public endpoints with server firewall.<br/> - Private access with Private Link support.|- Public endpoints with server firewall.<br/> - Private access with Virtual Network integration.| - Public endpoints with server firewall.<br/> - Private access with Private Link support.|
| Service-level agreement (SLA) | 99.99% availability SLA |No SLA in preview| 99.99% using Availability Zones|
| Operating system patching| Automatic  | Automatic with custom maintenance window control | Managed by end users |
| MySQL patching     | Automatic  | Automatic with custom maintenance window control | Managed by end users |
| High availability | Built-in HA within single availability zone| Built-in HA within and across availability zones | Custom managed using clustering, replication etc|
| Zone redundancy | Not supported | Supported | Supported|
| Hybrid scenarios | Supported with [Data-in Replication](https://docs.microsoft.com/azure/mysql/concepts-data-in-replication)| Not available in preview | Managed by end users |
| Read replicas | Supported| Supported | Managed by end users |
| Backup | Automated with 7-35 days retention | Automated with 1-35 days retention | Managed by end users |
| Monitoring database operations | Supported | Supported | Managed by end users |
| Disaster recovery | Supported with geo-redundant backup storage and cross region read replicas | Not supported in preview| Custom Managed with replication technologies |
| Query Performance Insights | Supported | Not available in preview| Managed by end users |
| Reserved Instance Pricing | Supported | Not available in preview | Supported |
| Azure AD Authentication | Supported | Not available in preview | Not Supported|
| Data Encryption at rest | Supported with customer managed keys | Supported with service managed keys | Not Supported|
| SSL/TLS | Enabled by default with support for TLS v1.2, 1.1 and 1.0 | Enforced with TLS v1.2 | Supported with TLS v1.2, 1.1 and 1.0 | 
| Fleet Management | Supported with Azure CLI, PowerShell, REST and Azure Resource Manager | Supported with Azure CLI, PowerShell, REST and Azure Resource Manager  | Supported for VMs with Azure CLI, PowerShell, REST and Azure Resource Manager |


## Business motivations for choosing PaaS or IaaS

There are several factors that can influence your decision to choose PaaS or IaaS to host your MySQL databases.

### Cost

Cost reduction is often the primary consideration that determines the best solution for hosting your databases. This is true whether you're a startup with little cash or a team in an established company that operates under tight budget constraints. This section describes billing and licensing basics in Azure as they apply to Azure Database for MySQL and MySQL on Azure VMs.

#### Billing

Azure Database for MySQL is currently available as a service in several tiers with different prices for resources. All resources are billed hourly at a fixed rate. For the latest information on the currently supported service tiers, compute sizes, and storage amounts, see [pricing page](https://azure.microsoft.com/pricing/details/mysql/). You can dynamically adjust service tiers and compute sizes to match your application's varied throughput needs. You're billed for outgoing Internet traffic at regular [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/).

With Azure Database for MySQL, Microsoft automatically configures, patches, and upgrades the database software. These automated actions reduce your administration costs. Also, Azure Database for MySQL has [automated backups](https://docs.microsoft.com/azure/mysql/concepts-backup) capabilities. These capabilities help you achieve significant cost savings, especially when you have a large number of databases. In contrast, with MySQL on Azure VMs you can choose and run any MySQL version. No matter what MySQL version you use, you pay for the provisioned VM, storage cost associated with the data, backup, monitoring data and log storage and the costs for the specific MySQL license type used (if any).

Azure Database for MySQL provides built-in high availability for any kind of node-level interruption while still maintaining the 99.99% SLA guarantee for the service. However, for database high availability within VMs, you use the high availability options like [MySQL replication](https://dev.mysql.com/doc/refman/8.0/en/replication.html) that are available on a MySQL database. Using a supported high availability option doesn't provide an additional SLA. But it does let you achieve greater than 99.99% database availability at additional cost and administrative overhead.

For more information on pricing, see the following articles:
* [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/)
* [Virtual machine pricing](https://azure.microsoft.com/pricing/details/virtual-machines/)
* [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/)

### Administration

For many businesses, the decision to transition to a cloud service is as much about offloading complexity of administration as it is about cost. 

With IaaS, Microsoft:

- Administers the underlying infrastructure.
- Provides automated patching for underlying hardware and OS.
  
With PaaS, Microsoft:

- Administers the underlying infrastructure.
- Provides automated patching for underlying hardware, OS and database engine.
- Manages high availability of the database.
- Automatically performs backups and replicates all data to provide disaster recovery.
- Encrypts the data at rest and in motion by default.
- Monitors your server and provides features for query performance insights and performance recommendations

The following list describes administrative considerations for each option:

* With Azure Database for MySQL, you can continue to administer your database. But you no longer need to manage the database engine, the operating system, or the hardware. Examples of items you can continue to administer include:

  - Databases
  - Sign-in
  - Index tuning
  - Query tuning
  - Auditing
  - Security

  Additionally, configuring high availability to another data center requires minimal to no configuration or administration.

* With MySQL on Azure VMs, you have full control over the operating system and the MySQL server instance configuration. With a VM, you decide when to update or upgrade the operating system and database software and what patches to apply. You also decide when to install any additional software such as an antivirus application. Some automated features are provided to greatly simplify patching, backup, and high availability. You can control the size of the VM, the number of disks, and their storage configurations. For more information, see [Virtual machine and cloud service sizes for Azure](https://docs.microsoft.com/azure/virtual-machines/windows/sizes).

### Time to move to Azure

* Azure Database for MySQL is the right solution for cloud-designed applications when developer productivity and fast time to market for new solutions are critical. With programmatic functionality that is like DBA, the service is suitable for cloud architects and developers because it lowers the need for managing the underlying operating system and database.

* When you want to avoid the time and expense of acquiring new on-premises hardware, MySQL on Azure VMs is the right solution for applications that require a granular control and customization of MySQL engine not supported by the service or requiring access of the underlying OS. This solution is also suitable for migrating existing on-premises applications and databases to Azure intact, for cases where Azure Database for MySQL is a poor fit.

Because there's no need to change the presentation, application, and data layers, you save time and budget on rearchitecting your existing solution. Instead, you can focus on migrating all your solutions to Azure and addressing some performance optimizations that the Azure platform might require.

## Next steps

* See [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/MySQL/).
* Get started by [creating your first server](https://docs.microsoft.com/azure/MySQL/quickstart-create-MySQL-server-database-using-azure-portal).
