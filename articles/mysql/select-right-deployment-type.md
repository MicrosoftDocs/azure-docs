---
title: Selecting the right deployment type - Azure Database for MySQL
description: This article describes what factors to consider before you deploy Azure Database for MySQL as either infrastructure as a service (IaaS) or platform as a service (PaaS).
author: savjani
ms.author: pariks
ms.reviewer: maghan
ms.date: 03/27/2023
ms.service: mysql
ms.topic: conceptual
---

# Choose the right MySQL Server option in Azure

[!INCLUDE [applies-to-mysql-single-flexible-server](includes/applies-to-mysql-single-flexible-server.md)]

[!INCLUDE [azure-database-for-mysql-single-server-deprecation](includes/Azure-database-for-mysql-single-server-deprecation.md)]

With Azure, your MySQL server workloads can run in a hosted virtual machine infrastructure as a service (IaaS) or as a hosted platform as a service (PaaS). PaaS has two deployment options, and there are service tiers within each deployment option. When you choose between IaaS and PaaS, you must decide if you want to manage your database, apply patches, backups, security, monitoring, and scaling, or delegate these operations to Azure.

When making your decision, consider the following two options:

- **Azure Database for MySQL**. This option is a fully managed MySQL database engine based on the stable version of the MySQL community edition. This relational database as a service (DBaaS), hosted on the Azure cloud platform, falls into the industry category of PaaS. With a managed instance of MySQL on Azure, you can use built-in features viz automated patching, high availability, automated backups, elastic scaling, enterprise-grade security, compliance and governance, monitoring and alerting that require extensive configuration when MySQL Server is either on-premises or in an Azure VM. When using MySQL as a service, you pay-as-you-go, with options to scale up or out for greater control without interruption. [Azure Database for MySQL](flexible-server/overview.md), powered by the MySQL community edition, is available in two deployment modes:

   - [Flexible Server](flexible-server/overview.md) - Azure Database for MySQL Flexible Server is a fully managed production-ready database service designed for more granular control and flexibility over database management functions and configuration settings. The flexible server architecture allows users to opt for high availability within a single availability zone and across multiple availability zones. Flexible servers provide better cost optimization controls with the ability to stop/start the server and burstable compute tier, ideal for workloads that don't need full compute capacity continuously. Flexible Server also supports reserved instances allowing you to save up to 63% cost, which is ideal for production workloads with predictable compute capacity requirements. The service supports the community version of MySQL 5.7 and 8.0. The service is generally available today in various [Azure regions](flexible-server/overview.md#azure-regions). Flexible servers are best suited for all new developments and migration of production workloads to Azure Database for MySQL service.

   - [Single Server](single-server/single-server-overview.md) is a fully managed database service designed for minimal customization. The single server platform is designed to handle most database management functions such as patching, backups, high availability, and security with minimal user configuration and control. The architecture is optimized for built-in high availability with 99.99% availability in a single availability zone. It supports the community version of MySQL 5.6 (retired), 5.7, and 8.0. The service is generally available today in various [Azure regions](https://azure.microsoft.com/global-infrastructure/services/). Single servers are best-suited **only for existing applications already leveraging single servers**. A Flexible Server would be the recommended deployment option for all new developments or migrations.

- **MySQL on Azure VMs**. This option falls into the industry category of IaaS. With this service, you can run MySQL Server inside a managed virtual machine on the Azure cloud platform. All recent versions and editions of MySQL can be installed on the virtual machine.

## Compare the MySQL deployment options in Azure

The main differences between these options are listed in the following table:

| Attribute | Azure Database for MySQL<br />Single Server | Azure Database for MySQL<br />Flexible Server | MySQL on Azure VMs |
| :--- | :--- | :--- | :--- |
| [**General**](flexible-server/overview.md) | | | |
| General availability | Generally available | Generally available | Generally available |
| Service-level agreement (SLA) | 99.99% availability SLA | 99.99% using Availability Zones | 99.99% using Availability Zones |
| Underlying O/S | Windows | Linux | User Managed |
| MySQL Edition | Community Edition | Community Edition | Community or Enterprise Edition |
| MySQL Version Support | 5.6(Retired), 5.7 & 8.0 | 5.7 & 8.0 | Any version |
| Availability zone selection for application colocation | No | Yes | Yes |
| Username in connection string | `<user_name>@server_name`. For example, `mysqlusr@mypgServer` | Just username. For example, `mysqlusr` | Just username. For example, `mysqlusr` |
| [**Compute & Storage Scaling**](flexible-server/concepts-service-tiers-storage.md) | | | |
| Compute tiers | Basic, General Purpose, Memory Optimized | Burstable, General Purpose, Memory Optimized | Burstable, General Purpose, Memory Optimized |
| Compute scaling | Supported (Scaling from and to Basic tier is **not supported**) | Supported | Supported |
| Storage size | 5 GiB to 16 TiB | 20 GiB to 16 TiB | 32 GiB to 32,767 GiB |
| Online Storage scaling | Supported | Supported | Not Supported |
| Auto storage scaling | Supported | Supported | Not Supported |
| IOPs scaling | Not Supported | Supported | Not Supported |
| [**Cost Optimization**](https://azure.microsoft.com/pricing/details/mysql/flexible-server/) | | | |
| Reserved Instance Pricing | Supported | Supported | Supported |
| Stop/Start Server for development | Server can be stopped up to seven days | Server can be stopped up to 30 days | Supported |
| Low cost Burstable SKU | Not Supported | Supported | Supported |
| [[**Networking/Security**](single-server/concepts-security.md) | | | |
| Network Connectivity | - Public endpoints with server firewall.<br />- Private access with Private Link support. | - Public endpoints with server firewall.<br />- Private access with Virtual Network integration. | - Public endpoints with server firewall.<br />- Private access with Private Link support. |
| SSL/TLS | Enabled by default with support for TLS v1.2, 1.1 and 1.0 | Enabled by default with support for TLS v1.2, 1.1 and 1.0 | Supported with TLS v1.2, 1.1 and 1.0 |
| Data Encryption at rest | Supported with customer-managed keys (BYOK) | Supported with service managed keys | Not Supported |
| Azure AD Authentication | Supported | Supported | Not Supported |
| Microsoft Defender for Cloud support | Yes | No | No |
| Server Audit | Supported | Supported | User Managed |
| [**Patching & Maintenance**](flexible-server/concepts-maintenance.md) | | |
| Operating system patching | Automatic | Automatic | User managed |
| MySQL minor version upgrade | Automatic | Automatic | User managed |
| MySQL in-place major version upgrade | Supported from 5.6 to 5.7 | Not Supported | User Managed |
| Maintenance control | System managed | Customer managed | User managed |
| Maintenance window | Anytime within 15-hrs window | 1 hr window | User managed |
| Planned maintenance notification | Three days | Five days | User managed |
| [**High Availability**](flexible-server/concepts-high-availability.md) | | | |
| High availability | Built-in HA (without hot standby) | Built-in HA (without hot standby), Same-zone and zone-redundant HA with hot standby | User managed |
| Zone redundancy | Not supported | Supported | Supported |
| Standby zone placement | Not supported | Supported | Supported |
| Automatic failover | Yes (spins another server) | Yes | User Managed |
| User initiated Forced failover | No | Yes | User Managed |
| Transparent Application failover | Yes | Yes | User Managed |
| [**Replication**](flexible-server/concepts-read-replicas.md) | | | |
| Support for read replicas | Yes | Yes | User Managed |
| Number of read replicas supported | 5 | 10 | User Managed |
| Mode of replication | Asynchronous | Asynchronous | User Managed |
| Gtid support for read replicas | Supported | Supported | User Managed |
| Cross-region support (Geo-replication) | Yes | Not supported | User Managed |
| Hybrid scenarios | Supported with [Data-in Replication](single-server/concepts-data-in-replication.md) | Supported with [Data-in Replication](flexible-server/concepts-data-in-replication.md) | User Managed |
| Gtid support for data-in replication | Supported | Not Supported | User Managed |
| Data-out replication | Not Supported | Supported | Supported |
| [**Backup and Recovery**](flexible-server/concepts-backup-restore.md) | | | |
| Automated backups | Yes | Yes | No |
| Backup retention | 7-35 days | 1-35 days | User Managed |
| Long term retention of backups | User Managed | User Managed | User Managed |
| Exporting backups | Supported using logical backups | Supported using logical backups | Supported |
| Point in time restore capability to any time within the retention period | Yes | Yes | User Managed |
| Fast restore point | No | Yes | No |
| Ability to restore on a different zone | Not supported | Yes | Yes |
| Ability to restore to a different VNET | No | Yes | Yes |
| Ability to restore to a different region | Yes (Geo-redundant) | Yes (Geo-redundant) | User Managed |
| Ability to restore a deleted server | Yes | Yes | No |
| [**Disaster Recovery**](flexible-server/concepts-business-continuity.md) | | | |
| DR across Azure regions | Using cross-region read replicas, geo-redundant backup | Using geo-redundant backup | User Managed |
| Automatic failover | No | Not Supported | No |
| Can use the same r/w endpoint | No | Not Supported | No |
| [**Monitoring**](flexible-server/concepts-monitoring.md) | | | |
| Azure Monitor integration & alerting | Supported | Supported | User Managed |
| Monitoring database operations | Supported | Supported | User Managed |
| Query Performance Insights | Supported | Supported (using Workbooks) | User Managed |
| Server Logs | Supported | Supported (using Diagnostics logs) | User Managed |
| Audit Logs | Supported | Supported | Supported |
| Error Logs | Not Supported | Supported | Supported |
| Azure advisor support | Supported | Not Supported | Not Supported |
| **Plugins** | | | |
| validate_password | Not Supported | In preview | Supported |
| caching_sha2_password | Not Supported | In preview | Supported |
| [**Developer Productivity**](flexible-server/quickstart-create-server-cli.md) | | | |
| Fleet Management | Supported with Azure CLI, PowerShell, REST, and Azure Resource Manager | Supported with Azure CLI, PowerShell, REST, and Azure Resource Manager | Supported for VMs with Azure CLI, PowerShell, REST, and Azure Resource Manager |
| Terraform Support | Supported | Supported | Supported |
| GitHub Actions | Supported | Supported | User Managed |

## Business motivations for choosing PaaS or IaaS

Several factors can influence whether you choose PaaS or IaaS to host your MySQL databases.

### Cost

Cost reduction is often the primary consideration in determining the best solution for hosting your databases. This is true whether you're a startup with little cash or a team in an established company that operates under tight budget constraints. This section describes billing and licensing basics in Azure as they apply to Azure Database for MySQL and MySQL on Azure VMs.

#### Bill

Azure Database for MySQL is currently available as a service in several tiers with different resource prices. All resources are billed hourly at a fixed rate. For the latest information on the currently supported service tiers, compute sizes, and storage amounts, see [pricing page](https://azure.microsoft.com/pricing/details/mysql/). You can dynamically adjust service tiers and compute sizes to match your application's varied throughput needs. You're billed for outgoing Internet traffic at regular [data transfer rates](https://azure.microsoft.com/pricing/details/data-transfers/).

With Azure Database for MySQL, Microsoft automatically configures, patches, and upgrades the database software. These automated actions reduce your administration costs. Also, Azure Database for MySQL has [automated backups](./concepts-backup.md) capabilities. These capabilities help you achieve significant cost savings, especially when you have many databases. In contrast, with MySQL on Azure VMs, you can choose and run any MySQL version. No matter what MySQL version you use, you pay for the provisioned VM, storage cost associated with the data, backup, monitoring data, and log storage, and the costs for the specific MySQL license type used (if any).

Azure Database for MySQL provides built-in high availability for node-level interruption while maintaining the service's 99.99% SLA guarantee. However, for database high availability within VMs, you use the high availability options like [MySQL replication](https://dev.mysql.com/doc/refman/8.0/en/replication.html) that are available on a MySQL database. Using a supported high-availability option doesn't provide an additional SLA. But it lets you achieve more than 99.99% database availability at extra cost and administrative overhead.

For more pricing information, see the following articles:

- [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/mysql/)
- [Virtual machine pricing](https://azure.microsoft.com/pricing/details/virtual-machines/)
- [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/)

### Administration

For many businesses, the decision to transition to a cloud service is as much about offloading the complexity of administration as it is about cost.

With IaaS, Microsoft:

- Administers the underlying infrastructure.
- Provides automated patching for underlying hardware and OS.

With PaaS, Microsoft:

- Administers the underlying infrastructure.
- Provides automated patching for underlying hardware, OS, and database engine.
- Manages high availability of the database.
- Automatically performs backups and replicates all data to provide disaster recovery.
- Encrypts the data at rest and in motion by default.
- Monitors your server and provides features for query performance insights and performance recommendations

The following list describes administrative considerations for each option:

- With Azure Database for MySQL, you can continue administering your database. But you no longer need to manage the database engine, the operating system, or the hardware. Examples of items you can continue to administer include:

  - Databases
  - Sign-in
  - Index tuning
  - Query tuning
  - Auditing
  - Security

  Additionally, configuring high availability to another data center requires minimal to no configuration or administration.

- With MySQL on Azure VMs, you can control the operating system and the MySQL server instance configuration. You decide when to update or upgrade the operating system and database software with a VM and what patches to apply. You also choose when to install any additional software such as an antivirus application. Some automated features are provided to simplify significantly patching, backup, and high availability. You can control the size of the VM, the number of disks, and their storage configurations. For more information, see [Virtual machine and cloud service sizes for Azure](../virtual-machines/sizes.md).

### Time to move to Azure

- Azure Database for MySQL is the right solution for cloud-designed applications when developer productivity and fast time to market for new solutions are critical. With programmatic functionality like DBA, the service suits cloud architects and developers because it lowers the need to manage the underlying operating system and database.

- When you want to avoid the time and expense of acquiring new on-premises hardware, MySQL on Azure VMs is the right solution for applications that require granular control and customization of MySQL engine not supported by the service or requiring access to the underlying OS. This solution is also suitable for migrating existing on-premises applications and databases to Azure intact for cases where Azure Database for MySQL is poorly fit.

Because there's no need to change the presentation, application, and data layers, you save time and budget on rearchitecting your existing solution. Instead, you can focus on migrating all your solutions to Azure and addressing some performance optimizations that the Azure platform might require.

## Next steps

- See [Azure Database for MySQL pricing](https://azure.microsoft.com/pricing/details/MySQL/).
- Get started by [creating your first server](flexible-server/quickstart-create-server-portal.md).
