---
title: Frequently asked questions (FAQ)
titleSuffix: Azure SQL Managed Instance 
description: Azure SQL Managed Instance frequently asked questions (FAQ)
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein
ms.date: 09/21/2020
---
# Azure SQL Managed Instance frequently asked questions (FAQ)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article contains the most common questions about [Azure SQL Managed Instance](sql-managed-instance-paas-overview.md).

## Supported features

**Where can I find a list of features supported on SQL Managed Instance?**

For a list of supported features in SQL Managed Instance, see [Azure SQL Managed Instance features](../database/features-comparison.md).

For differences in syntax and behavior between Azure SQL Managed Instance and SQL Server, see [T-SQL differences from SQL Server](transact-sql-tsql-differences-sql-server.md).


## Technical specification, resource limits and other limitations
 
**Where can I find technical characteristics and resource limits for SQL Managed Instance?**

For available hardware generation characteristics, see [Technical differences in hardware generations](resource-limits.md#hardware-generation-characteristics).
For available service tiers and their characteristics, see [Technical differences between service tiers](resource-limits.md#service-tier-characteristics).

**What service tier am I eligible for?**

Any customer is eligible for any service tier. However, if you want to exchange your existing licenses for discounted rates on Azure SQL Managed Instance by using [Azure Hybrid Benefit](https://azure.microsoft.com/pricing/hybrid-benefit/), bear in mind that SQL Server Enterprise Edition customers with Software Assurance are eligible for the [General Purpose](../database/service-tier-general-purpose.md) or [Business Critical](../database/service-tier-business-critical.md) performance tiers and SQL Server Standard Edition customers with Software Assurance are eligible for the General Purpose performance tier only. For more details, see [Specific rights of the AHB](../azure-hybrid-benefit.md?tabs=azure-powershell#what-are-the-specific-rights-of-the-azure-hybrid-benefit-for-sql-server).

**What subscription types are supported for SQL Managed Instance?**

For the list of supported subscription types, see [Supported subscription types](resource-limits.md#supported-subscription-types). 

**Which Azure regions are supported?**

Managed instances can be created in most of the Azure regions; see [Supported regions for SQL Managed Instance](https://azure.microsoft.com/global-infrastructure/services/?products=sql-database&regions=all). If you need managed instance in a region that is currently not supported, [send a support request via the Azure portal](../database/quota-increase-request.md).

**Are there any quota limitations for SQL Managed Instance deployments?**

Managed instance has two default limits: limit on the number of subnets you can use and a limit on the number of vCores you can provision. Limits vary across the subscription types and regions. For the list of regional resource limitations by subscription type, see table from [Regional resource limitation](resource-limits.md#regional-resource-limitations). These are soft limits that can be increased on demand. If you need to provision more managed instances in your current regions, send a support request to increase the quota using the Azure portal. For more information, see [Request quota increases for Azure SQL Database](../database/quota-increase-request.md).

**Can I increase the number of databases limit (100) on my managed instance on demand?**

No, and currently there are no committed plans to increase the number of databases on SQL Managed Instance. 

**Where can I migrate if I have more than 8TB of data?**
You can consider migrating to other Azure flavors that suit your workload: [Azure SQL Database Hyperscale](../database/service-tier-hyperscale.md) or [SQL Server on Azure Virtual Machines](../virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md).

**Where can I migrate if I have specific hardware requirements such as larger RAM to vCore ratio or more CPUs?**
You can consider migrating to [SQL Server on Azure Virtual Machines](../virtual-machines/windows/sql-server-on-azure-vm-iaas-what-is-overview.md) or [Azure SQL Database](../database/sql-database-paas-overview.md) memory/cpu optimized.

## Known issues and defects

**Where can I find known issues and defects?**

For product defects and known issues, see [Known issues](../database/doc-changes-updates-release-notes.md#known-issues).

## New features

**Where can I find latest features and the features in public preview?**

For new and preview features, see [Release notes](../database/doc-changes-updates-release-notes.md?tabs=managed-instance).

## Create, update, delete or move SQL Managed Instance

**How can I provision SQL Managed Instance?**

You can provision an instance from [Azure portal](instance-create-quickstart.md), [PowerShell](scripts/create-configure-managed-instance-powershell.md), [Azure CLI](https://techcommunity.microsoft.com/t5/azure-sql-database/create-azure-sql-managed-instance-using-azure-cli/ba-p/386281) and [ARM templates](/archive/blogs/sqlserverstorageengine/creating-azure-sql-managed-instance-using-arm-templates).

**Can I provision Managed Instances in an existing subscription?**

Yes, you can provision a Managed Instance in an existing subscription if that subscription belongs to the [Supported subscription types](resource-limits.md#supported-subscription-types).

**Why couldn't I provision a Managed Instance in the subnet which name starts with a digit?**

This is a current limitation on underlying component that verifies subnet name against the regex ^[a-zA-Z_][^\\\/\:\*\?\"\<\>\|\`\'\^]*(?<![\.\s])$. All names that pass the regex and are valid subnet names are currently supported.

**How can I scale my managed instance?**

You can scale your managed instance from [Azure portal](../database/service-tiers-vcore.md?tabs=azure-portal#selecting-a-hardware-generation), [PowerShell](/archive/blogs/sqlserverstorageengine/change-size-azure-sql-managed-instance-using-powershell), [Azure CLI](/cli/azure/sql/mi#az_sql_mi_update) or [ARM templates](/archive/blogs/sqlserverstorageengine/updating-azure-sql-managed-instance-properties-using-arm-templates).

**Can I move my Managed Instance from one region to another?**

Yes, you can. For instructions, see [Move resources across regions](../database/move-resources-across-regions.md).

**How can I delete my Managed Instance?**

You can delete Managed Instances via Azure portal, [PowerShell](/powershell/module/az.sql/remove-azsqlinstance), [Azure CLI](/cli/azure/sql/mi#az_sql_mi_delete) or [Resource Manager REST APIs](/rest/api/sql/managedinstances/delete).

**How much time does it take to create or update an instance, or to restore a database?**

Expected time to create a new managed instance or to change service tiers (vCores, storage), depends on several factors. See [Management operations](sql-managed-instance-paas-overview.md#management-operations).
 
## Naming conventions

**Can a managed instance have the same name as a SQL Server on-premises instance?**

Changing a managed instance name is not supported.

**Can I change DNS zone prefix?**

Yes, Managed Instance default DNS zone *.database.windows.net* can be changed. 

To use another DNS zone instead of the default, for example, *.contoso.com*: 
- Use CliConfig to define an alias. The tool is just a registry settings wrapper, so it can be done using group policy or a script as well.
- Use *CNAME* with the *TrustServerCertificate=true* option.

## Migration options

**How can I migrate from Azure SQL Database single or elastic pool to SQL Managed Instance?**

Managed instance offers the same performance levels per compute and storage size as other deployment options of Azure SQL Database. If you want to consolidate data on a single instance, or you simply need a feature supported exclusively in managed instance, you can migrate your data by using export/import (BACPAC) functionality. Here are other ways to consider for SQL Database migration to SQL Managed Instance: 
- Using [Data Source External](https://techcommunity.microsoft.com/t5/azure-database-support-blog/lesson-learned-129-using-data-source-external-from-azure-sql/ba-p/1443210)
- Using [SQLPackage](https://techcommunity.microsoft.com/t5/azure-database-support-blog/how-to-migrate-azure-sql-database-to-azure-sql-managed-instance/ba-p/369182)
- Using [BCP](https://medium.com/azure-sqldb-managed-instance/migrate-from-azure-sql-managed-instance-using-bcp-674c92efdca7)

**How can I migrate my instance database to a single Azure SQL Database?**

One option is to [export a database to BACPAC](../database/database-export.md) and then [import the BACPAC file](../database/database-import.md). This is the recommended approach if your database is smaller than 100 GB.

[Transactional replication](replication-two-instances-and-sql-server-configure-tutorial.md) can be used if all tables in the database have *primary* keys and there are no In-memory OLTP objects in the database.

Native COPY_ONLY backups taken from managed instance cannot be restored to SQL Server because managed instance has a higher database version compared to SQL Server. For more details, see [Copy-only backup](/sql/relational-databases/backup-restore/copy-only-backups-sql-server?preserve-view=true&view=sql-server-ver15).

**How can I migrate my SQL Server instance to SQL Managed Instance?**

To migrate your SQL Server instance, see [SQL Server instance migration to Azure SQL Managed Instance](migrate-to-instance-from-sql-server.md).

**How can I migrate from other platforms to SQL Managed Instance?**

For migration information about migrating from other platforms, see [Azure Database Migration Guide](https://datamigration.microsoft.com/).

## Switch hardware generation 

**Can I switch my managed instance hardware generation between Gen 4 and Gen 5 online?**

Automated online switching from Gen4 to Gen5 is possible if Gen5 hardware is available in the region where your managed instance is provisioned. In this case, you can check [vCore model overview page](../database/service-tiers-vcore.md) explaining how to switch between hardware generations.

This is a long-running operation as a new managed instance will be provisioned in the background and databases automatically transferred between the old and new instance with a quick failover at the end of the process.

Note: Gen4 hardware is being phased out and is no longer available for new deployments. All new databases must be deployed on Gen5 hardware. Switching from Gen5 to Gen4 is also not available.

## Performance 

**How can I compare Managed Instance performance to SQL Server performance?**

For a performance comparison between managed instance and SQL Server, a good starting point is [Best practices for performance comparison between Azure SQL managed instance and SQL Server](https://techcommunity.microsoft.com/t5/azure-sql-database/the-best-practices-for-performance-comparison-between-azure-sql/ba-p/683210) article.

**What causes performance differences between Managed Instance and SQL Server?**

See [Key causes of performance differences between SQL managed instance and SQL Server](https://azure.microsoft.com/blog/key-causes-of-performance-differences-between-sql-managed-instance-and-sql-server/). For more information about the log file size impact on General Purpose Managed Instance performance , see [Impact of log file size on General Purpose](https://medium.com/azure-sqldb-managed-instance/impact-of-log-file-size-on-general-purpose-managed-instance-performance-21ad170c823e).

**How do I tune performance of my managed instance?**

You can optimize the performance of your managed instance by:
- [Automatic tuning](../database/automatic-tuning-overview.md) that provides peak performance and stable workloads through continuous performance tuning based on AI and machine learning.
-    [In-memory OLTP](../in-memory-oltp-overview.md) that improves throughput and latency on transactional processing workloads and delivers faster business insights. 

To tune the performance even further, consider applying some of the *best practices* for [Application and database tuning](../database/performance-guidance.md#tune-your-database).
If your workload consists of lots of small transactions, consider [switching the connection type from proxy to redirect mode](connection-types-overview.md#changing-connection-type) for lower latency and higher throughput.

## Monitoring, Metrics and Alerts

**What are the options for monitoring and alerting for my managed instance?**

For all possible options to monitor and alert on SQL Managed Instance consumption and performance, see [Azure SQL Managed Instance monitoring options blog post](https://techcommunity.microsoft.com/t5/azure-sql-database/monitoring-options-available-for-azure-sql-managed-instance/ba-p/1065416). For the real-time performance monitoring for SQL MI, see [Real-time performance monitoring for Azure SQL DB Managed Instance](/archive/blogs/sqlcat/real-time-performance-monitoring-for-azure-sql-database-managed-instance).

**Can I use SQL Profiler for performance tracking?**

Yes, SQL Profiler is supported or SQL Managed Instance. For more details, see [SQL Profiler](/sql/tools/sql-server-profiler/sql-server-profiler?preserve-view=true&view=sql-server-ver15).

**Are Database Advisor and Query Performance Insight supported for Managed Instance databases?**

No, they are not supported. You can use [DMVs](../database/monitoring-with-dmvs.md) and [Query Store](/sql/relational-databases/performance/monitoring-performance-by-using-the-query-store?preserve-view=true&view=sql-server-ver15) together with [SQL Profiler](/sql/tools/sql-server-profiler/sql-server-profiler?preserve-view=true&view=sql-server-ver15) and [XEvents](/sql/relational-databases/extended-events/extended-events?preserve-view=true&view=sql-server-ver15) to monitor your databases.

**Can I create metric alerts on SQL Managed Instance?**

Yes. For instructions, see [Create alerts for SQL Managed Instance](alerts-create.md).

**Can I create metric alerts on a database in managed instance?**

You cannot, alerting metrics are available for managed instance only. Alerting metrics for individual databases in managed instance are not available.

## Storage size

**What is the maximum storage size for SQL Managed Instance?**

Storage size for SQL Managed Instance depends on the selected service tier (General Purpose or Business Critical). For storage limitations of these service tiers, see [Service tier characteristics](../database/service-tiers-general-purpose-business-critical.md).

**What is the minimum storage size available for a managed instance?**

The minimum amount of storage available in an instance is 32 GB. Storage can be added in increments of 32 GB up to the maximum storage size. First 32GB are free of charge.

**Can I increase storage space assigned to an instance, independently from compute resources?**

Yes, you can purchase add-on storage, independently from compute, to some extent. See *Max instance reserved storage* in the [Table](resource-limits.md#hardware-generation-characteristics).

**How can I optimize my storage performance in General Purpose service tier?**

To optimize storage performance, see [Storage best practices in General Purpose](https://techcommunity.microsoft.com/t5/datacat/storage-performance-best-practices-and-considerations-for-azure/ba-p/305525).

## Backup and restore

**Is the backup storage deducted from my managed instance storage?**

No, backup storage is not deducted from your managed instance storage space. The backup storage is independent from the instance storage space and it is not limited in size. Backup storage is limited by the time period to retain the backup of your instance databases, configurable up to 35 days. For details, see [Automated backups](../database/automated-backups-overview.md).

**How can I see when automated backups are made on my managed instance?**

To track when automated backups have been performed on Managed Instance, see [How to track the automated backup for an Azure SQL Managed Instance](https://techcommunity.microsoft.com/t5/azure-database-support-blog/lesson-learned-128-how-to-track-the-automated-backup-for-an/ba-p/1442355).

**Is on-demand backup supported?**

Yes, you can create a copy-only full backup in their Azure Blob Storage, but it will only be restorable in Managed Instance. For details, see [Copy-only backup](/sql/relational-databases/backup-restore/copy-only-backups-sql-server?preserve-view=true&view=sql-server-ver15). However, copy-only backup is impossible if the database is encrypted by service-managed TDE since the certificate used for encryption is inaccessible. In such case, use point-in-time-restore feature to move the database to another SQL Managed Instance, or switch to customer-managed key.

**Is native restore (from .bak files) to Managed Instance supported?**

Yes, it is supported and available for SQL Server 2005+ versions.  To use native restore, upload your .bak file to Azure blob storage and execute T-SQL commands. For more details, see [Native restore from URL](./migrate-to-instance-from-sql-server.md#native-restore-from-url).

## Business continuity

**Are my system databases replicated to the secondary instance in a failover group?**

System databases are not replicated to the secondary instance in a failover group. Therefore, scenarios that depend on objects from the system databases will be impossible on the secondary instance unless the objects are manually created on the secondary. For workaround, see [Enable scenarios dependent on the object from the system databases](../database/auto-failover-group-overview.md?tabs=azure-powershell#enable-scenarios-dependent-on-objects-from-the-system-databases).
 
## Networking requirements 

**What are the current inbound/outbound NSG constraints on the Managed Instance subnet?**

The required NSG and UDR rules are documented [here](connectivity-architecture-overview.md#mandatory-inbound-security-rules-with-service-aided-subnet-configuration), and automatically set by the service.
Please keep in mind that these rules are just the ones we need for maintaining the service. To connect to managed instance and use different features you will need to set additional, feature specific rules, that you need to maintain.

**How can I set inbound NSG rules on management ports?**

SQL Managed Instance is responsible for setting rules on management ports. This is achieved through functionality named [service-aided subnet configuration](connectivity-architecture-overview.md#service-aided-subnet-configuration).
This is to ensure uninterrupted flow of management traffic in order to fulfill an SLA.

**Can I get the source IP ranges that are used for the inbound management traffic?**

Yes. You could analyze traffic coming through your networks security group by [configuring Network Watcher flow logs](../../network-watcher/network-watcher-monitoring-overview.md#analyze-traffic-to-or-from-a-network-security-group).

**Can I set NSG to control access to the data endpoint (port 1433)?**

Yes. After a Managed Instance is provisioned you can set NSG that controls inbound access to the port 1433. It is advised to narrow its IP range as much as possible.

**Can I set the NVA or on-premises firewall to filter the outbound management traffic based on FQDNs?**

No. This is not supported for several reasons:
-    Routing traffic that represent response to inbound management request would be asymmetric and could not work.
-    Routing traffic that goes to storage would be affected by throughput constraints and latency so this way we won't be able to provide expected service quality and availability.
-    Based on experience, these configurations are error prone and not supportable.

**Can I set the NVA or firewall for the outbound non-management traffic?**

Yes. The simplest way to achieve this is to add 0/0 rule to a UDR associated with managed instance subnet to route traffic through NVA.
 
**How many IP addresses do I need for a Managed Instance?**

Subnet must have sufficient number of available [IP addresses](connectivity-architecture-overview.md#network-requirements). To determine VNet subnet size for SQL Managed Instance, see [Determine required subnet size and range for Managed Instance](./vnet-subnet-determine-size.md). 

**What if there are not enough IP addresses for performing instance update operation?**

In case there are not enough [IP addresses](connectivity-architecture-overview.md#network-requirements) in the subnet where your managed instance is provisioned, you will have to create a new subnet and a new managed instance inside it. We also suggest that the new subnet is created with more IP addresses allocated so future update operations will avoid similar situations. After the new instance is provisioned, you can manually back up and restore data between the old and new instances or perform cross-instance [point-in-time restore](point-in-time-restore.md?tabs=azure-powershell).

**Do I need an empty subnet to create a Managed Instance?**

No. You can use either an empty subnet or a subnet that already contains Managed Instance(s). 

**Can I change the subnet address range?**

Not if there are Managed Instances inside. This is an Azure networking infrastructure limitation. You are only allowed to [add additional address space to an empty subnet](../../virtual-network/virtual-network-manage-subnet.md#change-subnet-settings). 

**Can I move my managed instance to another subnet?**

No. This is a current Managed Instance design limitation. However, you can provision a new instance in another subnet and manually back up and restore data between the old and the new instance or perform cross-instance [point-in-time restore](point-in-time-restore.md?tabs=azure-powershell).

**Do I need an empty virtual network to create a Managed Instance?**

This is not required. You can either [Create a virtual network for Azure SQL Managed Instance](./virtual-network-subnet-create-arm-template.md) or [Configure an existing virtual network for Azure SQL Managed Instance](./vnet-existing-add-subnet.md).

**Can I place a Managed Instance with other services in a subnet?**

No. Currently we do not support placing Managed Instance in a subnet that already contains other resource types.

## Connectivity 

**Can I connect to my managed instance using IP address?**

No, this is not supported. A Managed Instance's host name maps to the load balancer in front of the Managed Instance's virtual cluster. As one virtual cluster can host multiple Managed Instances, a connection cannot be routed to the proper Managed Instance without specifying its name.
For more information on SQL Managed Instance virtual cluster architecture, see [Virtual cluster connectivity architecture](connectivity-architecture-overview.md#virtual-cluster-connectivity-architecture).

**Can my managed instance have a static IP address?**

This is currently not supported.

In rare but necessary situations, we might need to do an online migration of a managed instance to a new virtual cluster. If needed, this migration is because of changes in our technology stack aimed to improve security and reliability of the service. Migrating to a new virtual cluster results in changing the IP address that is mapped to the managed instance host name. The managed instance service doesn't claim static IP address support and reserves the right to change it without notice as a part of regular maintenance cycles.

For this reason, we strongly discourage relying on immutability of the IP address as it could cause unnecessary downtime.

**Does Managed Instance have a public endpoint?**

Yes. Managed Instance has a public endpoint that is by default used only for Service Management, but a customer may enable it for data access as well. For more details, see [Use SQL Managed Instance with public endpoints](./public-endpoint-overview.md). To configure public endpoint, go to [Configure public endpoint in SQL Managed Instance](public-endpoint-configure.md).

**How does Managed Instance control access to the public endpoint?**

Managed Instance controls access to the public endpoint at both the network and application level.

Management and deployment services connect to a managed instance by using a [management endpoint](./connectivity-architecture-overview.md#management-endpoint) that maps to an external load balancer. Traffic is routed to the nodes only if it's received on a predefined set of ports that only the managed instance's management components use. A built-in firewall on the nodes is set up to allow traffic only from Microsoft IP ranges. Certificates mutually authenticate all communication between management components and the management plane. For more details, see [Connectivity architecture for SQL Managed Instance](./connectivity-architecture-overview.md#virtual-cluster-connectivity-architecture).

**Could I use the public endpoint to access the data in Managed Instance databases?**

Yes. The customer will need to enable public endpoint data access from [Azure portal](public-endpoint-configure.md#enabling-public-endpoint-for-a-managed-instance-in-the-azure-portal) / [PowerShell](public-endpoint-configure.md#enabling-public-endpoint-for-a-managed-instance-using-powershell) / ARM and configure NSG to lock down access to the data port (port number 3342). For more information, see [Configure public endpoint in Azure SQL Managed Instance](public-endpoint-configure.md) and [Use Azure SQL Managed Instance securely with public endpoint](public-endpoint-overview.md). 

**Can I specify a custom port for SQL data endpoint(s)?**

No, this option is not available.  For private data endpoint, Managed Instance uses default port number 1433 and for public data endpoint, Managed Instance uses default port number 3342.

**What is the recommended way to connect Managed Instances placed in different regions?**

Express Route circuit peering is the preferred way to do that. Global virtual network peering is supported with the limitation described in the note below.  

> [!IMPORTANT]
> [On 9/22/2020 we announced global virtual network peering for newly created virtual clusters](https://azure.microsoft.com/en-us/updates/global-virtual-network-peering-support-for-azure-sql-managed-instance-now-available/). That means that global virtual network peering is supported for SQL Managed Instances created in empty subnets after the announcement date, as well for all the subsequent managed instances created in those subnets. For all the other SQL Managed Instances peering support is limited to the networks in the same region due to the [constraints of global virtual network peering](../../virtual-network/virtual-network-manage-peering.md#requirements-and-constraints). See also the relevant section of the [Azure Virtual Networks frequently asked questions](../../virtual-network/virtual-networks-faq.md#what-are-the-constraints-related-to-global-vnet-peering-and-load-balancers) article for more details. 

If Express Route circuit peering and global virtual network peering is not possible, the only other option is to create Site-to-Site VPN connection ([Azure portal](../../vpn-gateway/tutorial-site-to-site-portal.md), [PowerShell](../../vpn-gateway/vpn-gateway-create-site-to-site-rm-powershell.md), [Azure CLI](../../vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-cli.md)).

## Mitigate data exfiltration risks  

**How can I mitigate data exfiltration risks?**

To mitigate any data exfiltration risks, customers are recommended to apply a set of security settings and controls:

- Turn on [Transparent Data Encryption (TDE)](../database/transparent-data-encryption-tde-overview.md) on all databases.
- Turn off Common Language Runtime (CLR). This is recommended on-premises as well.
- Use Azure Active Directory (Azure AD) authentication only.
- Access the instance with a low-privileged DBA account.
- Configure JIT jumpbox access for the sysadmin account.
- Turn on [SQL auditing](/sql/relational-databases/security/auditing/sql-server-audit-database-engine), and integrate it with alerting mechanisms.
- Turn on [Threat Detection](../database/threat-detection-configure.md) from the [Azure Defender for SQL](../database/azure-defender-for-sql.md) suite.

## DNS

**Can I configure a custom DNS for SQL Managed Instance?**

Yes. See [How to configure a Custom DNS for Azure SQL Managed Instance](./custom-dns-configure.md).

**Can I do DNS refresh?**

Yes. See [Synchronize virtual network DNS servers setting on SQL Managed Instance virtual cluster](./synchronize-vnet-dns-servers-setting-on-virtual-cluster.md).

## Change time zone

**Can I change the time zone for an existing managed instance?**

Time zone configuration can be set when a managed instance is provisioned for the first time. Changing the time zone of an existing managed instance isn't supported. For details, see [Time zone limitations](timezones-overview.md#limitations).

Workarounds include creating a new managed instance with the proper time zone and then either performing a manual backup and restore, or what we recommend, performing a [cross-instance point-in-time restore](/archive/blogs/sqlserverstorageengine/cross-instance-point-in-time-restore-in-azure-sql-database-managed-instance).


## Security and database encryption

**Is the sysadmin server role available for SQL Managed Instance?**

Yes, customers can create logins that are members of the sysadmin role.  Customers who assume the sysadmin privilege are also assuming responsibility for operating the instance, which can negatively impact the SLA commitment. To add login to sysadmin server role, see [Azure AD authentication](./aad-security-configure-tutorial.md#azure-ad-authentication).

**Is Transparent Data Encryption supported for SQL Managed Instance?**

Yes, Transparent Data Encryption is supported for SQL Managed Instance. For details, see [Transparent Data Encryption for SQL Managed Instance](../database/transparent-data-encryption-tde-overview.md?tabs=azure-portal).

**Can I leverage the "bring your own key" model for TDE?**

Yes, Azure Key Vault for BYOK scenario is available for Azure SQL Managed Instance. For details, see [Transparent Data Encryption with customer-managed key](../database/transparent-data-encryption-tde-overview.md?tabs=azure-portal#customer-managed-transparent-data-encryption---bring-your-own-key).

**Can I migrate an encrypted SQL Server database?**

Yes, you can. To migrate an encrypted SQL Server database, you need to export and import your existing certificates into Managed Instance, then take a full database backup and restore it in Managed Instance. 

You can also use [Azure Database Migration Service](https://azure.microsoft.com/services/database-migration/) to migrate the TDE encrypted databases.

**How can I configure TDE protector rotation for SQL Managed Instance?**

You can rotate TDE protector for Managed Instance using Azure Cloud Shell. For instructions, see [Transparent Data Encryption in SQL Managed Instance using your own key from Azure Key Vault](scripts/transparent-data-encryption-byok-powershell.md).

**Can I restore my encrypted database to SQL Managed Instance?**

Yes, you don't need to decrypt your database to restore it to SQL Managed Instance. You do need to provide a certificate/key used as the encryption key protector on the source system to SQL Managed Instance to be able to read data from the encrypted backup file. There are two possible ways to do it:

- *Upload certificate-protector to SQL Managed Instance*. It can be done using PowerShell only. The [sample script](./tde-certificate-migrate.md) describes the whole process.
- *Upload asymmetric key-protector to Azure Key Vault and point SQL Managed Instance to it*. This approach resembles bring-your-own-key (BYOK) TDE use case that also uses Key Vault integration to store the encryption key. If you don't want to use the key as an encryption key protector, and just want to make the key available for SQL Managed Instance to restore encrypted database(s), follow instructions for [setting up BYOK TDE](../database/transparent-data-encryption-tde-overview.md#manage-transparent-data-encryption), and don't check the checkbox **Make the selected key the default TDE protector**.

Once you make the encryption protector available to SQL Managed Instance, you can proceed with the standard database restore procedure.

## Purchasing models and benefits

**What purchasing models are available for SQL Managed Instance?**

SQL Managed Instance offers [vCore-based purchasing model](sql-managed-instance-paas-overview.md#vcore-based-purchasing-model).

**What cost benefits are available for SQL Managed Instance?**

You can save costs with the Azure SQL benefits in the following ways:
-    Maximize existing investments in on-premises licenses and save up to 55 percent with [Azure Hybrid Benefit](../azure-hybrid-benefit.md?tabs=azure-powershell). 
-    Commit to a reservation for compute resources and save up to 33 percent with [Reserved Instance Benefit](../database/reserved-capacity-overview.md). Combine this with Azure Hybrid benefit for savings up to 82 percent. 
-    Save up to 55 percent versus list prices with [Azure Dev/Test Pricing Benefit](https://azure.microsoft.com/pricing/dev-test/) that offers discounted rates for your ongoing development and testing workloads.

**Who is eligible for Reserved Instance benefit?**

To be eligible for reserved Instance benefit, your subscription type must be an enterprise agreement (offer numbers: MS-AZR-0017P or MS-AZR-0148P) or an individual agreement with pay-as-you-go pricing (offer numbers: MS-AZR-0003P or MS-AZR-0023P). For more information about reservations, see [Reserved Instance Benefit](../database/reserved-capacity-overview.md). 

**Is it possible to cancel, exchange or refund reservations?**

You can cancel, exchange or refund reservations with certain limitations. For more information, see [Self-service exchanges and refunds for Azure Reservations](../../cost-management-billing/reservations/exchange-and-refund-azure-reservations.md).

## Billing for Managed Instance and backup storage

**What are the SQL Managed Instance pricing options?**

To explore Managed Instance pricing options, see [Pricing page](https://azure.microsoft.com/pricing/details/azure-sql/sql-managed-instance/single/).

**How can I track billing cost for my managed instance?**

You can do so using the [Azure Cost Management solution](../../cost-management-billing/index.yml). Navigate to **Subscriptions** in the [Azure portal](https://portal.azure.com) and select **Cost Analysis**. 

Use the **Accumulated costs** option and then filter by the **Resource type** as `microsoft.sql/managedinstances`.

**How much automated backups cost?**

You get the equal amount of free backup storage space as the reserved data storage space purchased, regardless of the backup retention period set. If your backup storage consumption is within the allocated free backup storage space, automated backups on managed instance will have no additional cost for you, therefore will be free of charge. Exceeding the use of backup storage above the free space will result in costs of about $0.20 - $0.24 per GB/month in US regions, or see the pricing page for details for your region. For more details, see [Backup storage consumption explained](https://techcommunity.microsoft.com/t5/azure-sql-database/backup-storage-consumption-on-managed-instance-explained/ba-p/1390923).

**How can I monitor billing cost for my backup storage consumption?**

You can monitor cost for backup storage via Azure portal. For instructions, see [Monitor costs for automated backups](../database/automated-backups-overview.md?tabs=managed-instance#monitor-costs). 

**How can I optimize my backup storage costs on the managed instance?**

To optimize your backup storage costs, see [Fine backup tuning on SQL Managed Instance](https://techcommunity.microsoft.com/t5/azure-sql-database/fine-tuning-backup-storage-costs-on-managed-instance/ba-p/1390935).

## Cost-saving use cases

**Where can I find use cases and resulting cost savings with SQL Managed Instance?**

SQL Managed Instance case studies:

- [Komatsu](https://customers.microsoft.com/story/komatsu-australia-manufacturing-azure)
- [KMD](https://customers.microsoft.com/en-ca/story/kmd-professional-services-azure-sql-database)
- [PowerDETAILS](https://customers.microsoft.com/story/powerdetails-partner-professional-services-azure-sql-database-managed-instance)
- [Allscripts](https://customers.microsoft.com/story/allscripts-partner-professional-services-azure)

To get a better understanding of the benefits, costs, and risks associated with deploying Azure SQL Managed Instance, there's also a Forrester study: [The Total Economic Impact of Microsoft Azure SQL Database Managed Instance](https://azure.microsoft.com/resources/forrester-tei-sql-database-managed-instance).

## Password policy 

**What password policies are applied for SQL Managed Instance SQL logins?**

SQL Managed Instance password policy for SQL logins inherits Azure platform policies that are applied to the VMs forming virtual cluster holding the managed instance. At the moment it is not possible to change any of these settings as these settings are defined by Azure and inherited by managed instance.

 > [!IMPORTANT]
 > Azure platform can change policy requirements without notifying services relying on that policies.

**What are current Azure platform policies?**

Each login must set its password upon login and change its password after it reaches maximum age.

| **Policy** | **Security Setting** |
| --- | --- |
| Maximum password age | 42 days |
| Minimum password age | 1 day |
| Minimum password length | 10 characters |
| Password must meet complexity requirements | Enabled |

**Is it possible to disable password complexity and expiration in SQL Managed Instance on login level?**

Yes, it is possible to control CHECK_POLICY and CHECK_EXPIRATION fields on login level. You can check current settings by executing following T-SQL command:

```sql
SELECT *
FROM sys.sql_logins
```

After that, you can modify specified login settings by executing :

```sql
ALTER LOGIN <login_name> WITH CHECK_POLICY = OFF;
ALTER LOGIN <login_name> WITH CHECK_EXPIRATION = OFF;
```

(replace 'test' with desired login name and adjust policy and expiration values)


## Service updates

**What is the Root CA change for Azure SQL Database & SQL Managed Instance?**

See [Certificate rotation for Azure SQL Database & SQL Managed Instance](../updates/ssl-root-certificate-expiring.md). 

**What is a planned maintenance event for SQL Managed Instance?**

See [Plan for Azure maintenance events in SQL Managed Instance](../database/planned-maintenance.md). 


## Azure feedback and support

**Where can I leave my ideas for SQL Managed Instance improvements?**

You can vote for a new Managed Instance feature or put a new improvement idea on voting on [SQL Managed Instance Feedback Forum](https://feedback.azure.com/forums/915676-sql-managed-instance). This way you can contribute to the product development and help us prioritize our potential improvements.

**How can I create Azure support request?**

To learn how to create Azure support request, see [How to create Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md).
