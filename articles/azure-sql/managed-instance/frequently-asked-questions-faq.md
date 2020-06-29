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
ms.reviewer: sstein, carlrab
ms.date: 03/17/2020
---
# Azure SQL Managed Instance frequently asked questions (FAQ)
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article contains the most common questions about [Azure SQL Managed Instance](sql-managed-instance-paas-overview.md).

## Supported features

**Where can I find a list of features supported on SQL Managed Instance?**

For a list of supported features in SQL Managed Instance, see [Azure SQL Managed Instance features](../database/features-comparison.md).

For differences in syntax and behavior between Azure SQL Managed Instance and SQL Server, see [T-SQL differences from SQL Server](transact-sql-tsql-differences-sql-server.md).


## Tech spec & resource limits
 
**Where can I find technical characteristics and resource limits for SQL Managed Instance?**

For available hardware generation characteristics, see [Technical differences in hardware generations](resource-limits.md#hardware-generation-characteristics).
For available service tiers and their characteristics, see [Technical differences between service tiers](resource-limits.md#service-tier-characteristics).

## Known issues & bugs

**Where can I find known issues and bugs?**

For bugs and known issues, see [known issues](../database/doc-changes-updates-release-notes.md#known-issues).

## New features

**Where can I find latest features and the features in public preview?**

For new and preview features, see [Release notes](../database/doc-changes-updates-release-notes.md?tabs=managed-instance).

## Deployment times 

**How much time does it take to create or update instance, or to restore a database?**

Expected time to create a managed instance or change service tier (vCores, storage) depends on several factors. Take a look at the [management operations](/azure/sql-database/sql-database-managed-instance#managed-instance-management-operations). 

## Naming conventions

**Can a managed instance have the same name as a SQL Server on-premises instance?**

Changing a managed instance name is not supported.

The default DNS zone *.database.windows.net* for a managed instance could be changed. 

To use another DNS zone instead of the default, for example, *.contoso.com*: 
- Use CliConfig to define an alias. The tool is just a registry settings wrapper, so it could be done using group policy or a script as well.
- Use *CNAME* with the *TrustServerCertificate=true* option.

## Move a database from SQL Managed Instance 

**How can I move a database from SQL Managed Instance back to SQL Server or Azure SQL Database?**

You can [export a database to BACPAC](../database/database-export.md) and then [import the BACPAC file](../database/database-import.md). This is the recommended approach if your database is smaller than 100 GB.

Transactional replication can be used if all tables in the database have primary keys.

Native `COPY_ONLY` backups taken from SQL Managed Instance cannot be restored to SQL Server because SQL Managed Instance has a higher database version compared to SQL Server.

## Migrate an instance database

**How can I migrate my instance database to Azure SQL Database?**

One option is to [export the database to a BACPAC](../database/database-export.md) and then [import the BACPAC file](../database/database-import.md). 

This is the recommended approach if your database is smaller than 100 GB. Transactional replication can be used if all tables in the database have primary keys.

## Switch hardware generation 

**Can I switch my SQL Managed Instance hardware generation between Gen 4 and Gen 5 online?**

Automated online switching between hardware generations is possible if both hardware generations are available in the region where SQL Managed Instance is provisioned. In this case, you can check the [vCore model overview page](../database/service-tiers-vcore.md), which explains how to switch between hardware generations.

This is a long-running operation, as a new managed instance will be provisioned in the background and databases automatically transferred between the old and new instances, with a quick failover at the end of the process. 

**What if both hardware generations are not supported in the same region?**

If both hardware generations are not supported in the same region, changing the hardware generation is possible but must be done manually. This requires you to provision a new instance in the region where the wanted hardware generation is available, and manually back up and restore data between the old and new instances.

**What if there are not enough IP addresses for performing update operation?**

In case there are not enough IP addresses in the subnet where your managed instance is provisioned, you will have to create a new subnet and a new managed instance inside it. We also suggest that the new subnet is created with more IP addresses allocated so future update operations will avoid similar situations. (For proper subnet size, check [how to determine the size of a VNet subnet](vnet-subnet-determine-size.md).) After the new instance is provisioned, you can manually back up and restore data between the old and new instances or perform cross-instance [point-in-time restore](point-in-time-restore.md?tabs=azure-powershell). 


## Tune performance

**How do I tune performance of SQL Managed Instance?**

SQL Managed Instance in the General Purpose tier uses remote storage, so the size of data and log files matters to performance. For more information, see [Impact of log file size on General Purpose SQL Managed Instance performance](https://medium.com/azure-sqldb-managed-instance/impact-of-log-file-size-on-general-purpose-managed-instance-performance-21ad170c823e).

If your workload consists of lots of small transactions, consider switching the connection type from proxy to redirect mode.

## Maximum storage size

**What is the maximum storage size for SQL Managed Instance?**

Storage size for SQL Managed Instance depends on the selected service tier (General Purpose or Business Critical). For storage limitations of these service tiers, see [Service tier characteristics](../database/service-tiers-general-purpose-business-critical.md).

## Backup storage cost 

**Is the backup storage deducted from my SQL Managed Instance storage?**

No, backup storage is not deducted from your SQL Managed Instance storage space. The backup storage is independent from the instance storage space and it is not limited in size. Backup storage is limited by the time period to retain the backup of your instance databases, configurable from 7 to 35 days. For details, see [Automated backups](../database/automated-backups-overview.md).

## Track billing

**Is there a way to track my billing cost for SQL Managed Instance?**

You can do so using the [Azure Cost Management solution](/azure/cost-management/). Navigate to **Subscriptions** in the [Azure portal](https://portal.azure.com) and select **Cost Analysis**. 

Use the **Accumulated costs** option and then filter by the **Resource type** as `microsoft.sql/managedinstances`. 
  
## Inbound NSG rules

**How can I set inbound NSG rules on management ports?**

The SQL Managed Instance control plane maintains NSG rules that protect management ports.

Here is what management ports are used for:

Ports 9000 and 9003 are used by Azure Service Fabric infrastructure. The Service Fabric primary role is to keep the virtual cluster healthy and keep the goal state in terms of the number of component replicas.

Ports 1438, 1440, and 1452 are used by the node agent. The node agent is an application that runs inside the cluster and is used by the control plane to execute management commands.

In addition to NSG rules, the built-in firewall protects the instance on the network layer. On the application layer, communication is protected with the certificates.

For more information and to learn how to verify the built-in firewall, see [Azure SQL Managed Instance built-in firewall](management-endpoint-verify-built-in-firewall.md).


## Mitigate data exfiltration risks  

**How can I mitigate data exfiltration risks?**

To mitigate any data exfiltration risks, customers are recommended to apply a set of security settings and controls:

- Turn on [Transparent Data Encryption (TDE)](https://docs.microsoft.com/azure/sql-database/transparent-data-encryption-azure-sql) on all databases.
- Turn off Common Language Runtime (CLR). This is recommended on-premises as well.
- Use Azure Active Directory (Azure AD) authentication only.
- Access the instance with a low-privileged DBA account.
- Configure JIT jumpbox access for the sysadmin account.
- Turn on [SQL auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine), and integrate it with alerting mechanisms.
- Turn on [Threat Detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection) from the [advanced data security (ADS)](https://docs.microsoft.com/azure/sql-database/sql-database-advanced-data-security) suite.


## Cost-saving use cases

**Where can I find use cases and resulting cost savings with SQL Managed Instance?**

SQL Managed Instance case studies:

- [Komatsu](https://customers.microsoft.com/story/komatsu-australia-manufacturing-azure)
- [KMD](https://customers.microsoft.com/en-ca/story/kmd-professional-services-azure-sql-database)
- [PowerDETAILS](https://customers.microsoft.com/story/powerdetails-partner-professional-services-azure-sql-database-managed-instance)
- [Allscripts](https://customers.microsoft.com/story/allscripts-partner-professional-services-azure)

To get a better understanding of the benefits, costs, and risks associated with deploying Azure SQL Managed Instance, there's also a Forrester study: [The Total Economic Impact of Microsoft Azure SQL Database Managed Instance](https://azure.microsoft.com/resources/forrester-tei-sql-database-managed-instance).


## DNS refresh 

**Can I do DNS refresh?**

Currently, we don't provide a feature to refresh DNS server configuration for SQL Managed Instance.

DNS configuration is eventually refreshed:

- When DHCP lease expires.
- On platform upgrade.

As a workaround, downgrade SQL Managed Instance to 4 vCores and upgrade it again afterward. This has a side effect of refreshing the DNS configuration.


## IP address

**Can I connect to SQL Managed Instance using an IP address?**

Connecting to SQL Managed Instance using an IP address is not supported. The SQL Managed Instance host name maps to a load balancer in front of the SQL Managed Instance virtual cluster. As one virtual cluster could host multiple managed instances, connections cannot be routed to the proper managed instance without specifying the name explicitly.

For more information on SQL Managed Instance virtual cluster architecture, see [Virtual cluster connectivity architecture](connectivity-architecture-overview.md#virtual-cluster-connectivity-architecture).

**Can SQL Managed Instance have a static IP address?**

In rare but necessary situations, we might need to do an online migration of SQL Managed Instance to a new virtual cluster. If needed, this migration is because of changes in our technology stack aimed to improve security and reliability of the service. Migrating to a new virtual cluster results in changing the IP address that is mapped to the SQL Managed Instance host name. The SQL Managed Instance service doesn't claim static IP address support and reserves the right to change it without notice as a part of regular maintenance cycles.

For this reason, we strongly discourage relying on immutability of the IP address as it could cause unnecessary downtime.

## Change time zone

**Can I change the time zone for an existing managed instance?**

Time zone configuration can be set when a managed instance is provisioned for the first time. Changing the time zone of an existing managed instance isn't supported. For details, see [Time zone limitations](timezones-overview.md#limitations).

Workarounds include creating a new managed instance with the proper time zone and then either performing a manual backup and restore, or what we recommend, performing a [cross-instance point-in-time restore](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2018/06/07/cross-instance-point-in-time-restore-in-azure-sql-database-managed-instance/).


## Resolve performance issues

**How do I resolve performance issues with SQL Managed Instance?**

For a performance comparison between SQL Managed Instance and SQL Server, a good starting point is [Best practices for performance comparison between Azure SQL Managed Instance and SQL Server](https://techcommunity.microsoft.com/t5/Azure-SQL-Database/The-best-practices-for-performance-comparison-between-Azure-SQL/ba-p/683210).

Data loading is often slower on SQL Managed Instance than in SQL Server due to the mandatory full recovery model and [limits](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-resource-limits#service-tier-characteristics) on transaction log write throughput. Sometimes, this can be worked around by loading transient data into tempdb instead of the user database, or by using clustered columnstore or memory-optimized tables.


## Restore encrypted backup

**Can I restore my encrypted database to SQL Managed Instance?**

Yes, you don't need to decrypt your database to restore it to SQL Managed Instance. You do need to provide a certificate/key used as the encryption key protector on the source system to SQL Managed Instance to be able to read data from the encrypted backup file. There are two possible ways to do it:

- *Upload certificate-protector to SQL Managed Instance*. It can be done using PowerShell only. The [sample script](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-migrate-tde-certificate) describes the whole process.
- *Upload asymmetric key-protector to Azure Key Vault and point SQL Managed Instance to it*. This approach resembles bring-your-own-key (BYOK) TDE use case that also uses Key Vault integration to store the encryption key. If you don't want to use the key as an encryption key protector, and just want to make the key available for SQL Managed Instance to restore encrypted database(s), follow instructions for [setting up BYOK TDE](https://docs.microsoft.com/azure/sql-database/transparent-data-encryption-azure-sql#manage-transparent-data-encryption), and don’t check the checkbox **Make the selected key the default TDE protector**.

Once you make the encryption protector available to SQL Managed Instance, you can proceed with the standard database restore procedure.

## Migrate from SQL Database 

**How can I migrate from Azure SQL Database to SQL Managed Instance?**

SQL Managed Instance offers the same performance levels per compute and storage size as Azure SQL Database. If you want to consolidate data on a single instance, or you simply need a feature supported exclusively in SQL Managed Instance, you can migrate your data by using export/import (BACPAC) functionality.

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
