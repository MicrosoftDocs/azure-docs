---
title: SQL Database managed instance FAQ | Microsoft Docs
description: SQL Database managed instance frequently asked questions (FAQ)
services: sql-database
ms.service: sql-database
ms.subservice: managed-instance
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein, carlrab
ms.date: 07/16/2019
---
# SQL Database managed instance frequently asked questions (FAQ)

This article contains many of the most common questions about [SQL Database managed instance](sql-database-managed-instance.md).

## Where can I find a list of features supported on managed instance?

For a list of supported features in managed instance, see [Azure SQL Database versus SQL Server](sql-database-features.md).

For differences in syntax and behavior between Azure SQL Database managed instance and on-premises SQL Server, see [T-SQL differences from SQL Server](sql-database-managed-instance-transact-sql-information.md).


## Where can I find technical characteristics and resource limits for managed instance?

For available hardware generation characteristics, see [technical differences in hardware generations](sql-database-managed-instance-resource-limits.md#hardware-generation-characteristics).
For available service tiers and their characteristics, see [technical differences between service tiers](sql-database-managed-instance-resource-limits.md#service-tier-characteristics).

## Where can I find known issues and bugs?

For bugs and known issues see [known issues](sql-database-managed-instance-transact-sql-information.md#Issues).

## Where can I find latest features and the features in public preview?

For new and preview features see [release notes](/azure/sql-database/sql-database-release-notes?tabs=managed-instance).

## How much time takes to create or update instance, or to restore a database?

Expected time to create new managed instance or change service tier (vCores, storage) depend on several factors. Take a look at the [Management operations](/azure/sql-database/sql-database-managed-instance#managed-instance-management-operations) 

## Can a managed instance have the same name as on-premises SQL Server?

Managed instance must have a name that ends with *database.windows.net*. To use another DNS zone instead of the default, for example, **mi-another-name**.contoso.com: 
- Use CliConfig to define an alias. The tool is just a registry settings wrapper, so it could be done using group policy or script as well.
- Use *CNAME* with *TrustServerCertificate=true* option.

## How can I move database from managed instance back to SQL Server or Azure SQL Database?

You can [export database to BACPAC](sql-database-export.md) and then [import the BACPAC file]( sql-database-import.md). This is a recommended approach if your database is smaller than 100 GB.

Transactional replication can be used if all tables in the database have primary keys.

Native `COPY_ONLY` backups taken from managed instance cannot be restored to SQL Server because managed instance has a higher database version compared to SQL Server.

## How can I migrate my instance database to a single Azure SQL Database?

One option is to [export the database to a BACPAC](sql-database-export.md) and then [import the BACPAC file](sql-database-import.md). 

This is the recommended approach if your database is smaller than 100 GB. Transactional replication can be used if all tables in the database have primary keys.

## How do I choose between Gen 4 and Gen 5 hardware generation for managed instance?

It depends on your workload as some hardware generation is better for certain types of workloads than the other. While the subject of performance is rather a complex one to simplify, the following differences between the hardware generations affecting the workload performance:
- Gen 4 provides a better compute support as it is based on physical processors, versus Gen 5 that is based on vCore processors. It might be more advantageous for compute intensive workloads.
- Gen 5 supports accelerated networking resulting in a better IO bandwidth to remote storage. It might be advantageous for IO intensive workloads on General Purpose service tiers. Gen 5 uses faster SSD local disks compared to Gen 4. It might be advantageous for IO intensive workloads on business critical service tiers.

It is strongly advised to test the performance of actual workloads intended for production before going live to determine which hardware generation will work better in a specific case.

## Can I switch my managed instance hardware generation between Gen 4 and Gen 5 online? 

Automated online switching between hardware generations is possible if both hardware generations are available in the region where your managed instance is provisioned. In this case, you can use [script from blog post](https://techcommunity.microsoft.com/t5/Azure-SQL-Database/Change-hardware-generation-on-Managed-Instance/ba-p/699824) explaining how to switch between hardware generations.

This is a long-running operation as a new managed instance will be provisioned in the background and databases automatically transferred between the old and new instance with a quick failover at the end of the process. 

If both hardware generations are not supported in the same region, changing the hardware generation is possible but must be done manually. This requires you to provision a new instance in the region where the wanted hardware generation is available, and manually back up and restore data between the old and new instance.


## How do I tune performance of my managed instance? 

General Purpose managed instance uses remote storage due to which size of data and log files matters to performance. For more information, see [Impact of log file size on General Purpose Managed Instance performance](https://medium.com/azure-sqldb-managed-instance/impact-of-log-file-size-on-general-purpose-managed-instance-performance-21ad170c823e).

For IO intensive workloads consider using Gen 5 hardware, versus using Gen 4 for compute intensive workloads. For more information, see [How do I choose between Gen 4 and Gen 5](#how-do-i-choose-between-gen-4-and-gen-5-hardware-generation-for-managed-instance).

If your workload consists of lots of small transactions, consider switching the connection type from proxy to redirect mode.

## What is the maximum storage size for managed instance? 

Storage size for managed instance depends on the selected service tier (General Purpose or Business Critical). For storage limitations of these service tiers, see [Service tier characteristic](sql-database-service-tiers-general-purpose-business-critical.md).

## Is the backup storage deducted from my managed instance storage? 

No, backup storage is not deducted from your managed instance storage space. The backup storage is independent from the instance storage space and it is not limited in size. Backup storage is limited by the time period to retain the backup of your instance databases, configurable from 7 to 35 days. For details, see [Automated backups](https://docs.microsoft.com/azure/sql-database/sql-database-automated-backups).
  
## How can I set inbound NSG rules on management ports?

The built-in firewall feature configures Windows firewall on all virtual machines in the cluster to allow inbound connections from IP ranges associated only to Microsoft management/deployment machines and secure admin workstations effectively preventing intrusions through the network layer.

Here is what ports are used for:

Ports 9000 and 9003 are used by Service Fabric infrastructure. Service Fabric primary role is to keep the virtual cluster healthy and keep goal state in terms of number of component replicas.

Ports 1438, 1440, and 1452 are used by Node Agent. Node agent is an application that runs inside the cluster and is used by the control plane to execute management commands.

In addition to the built-in firewall on the network layer, communication is also protected with certificates.
  
For more information and how to verify the built-in firewall, see [Azure SQL Database managed instance built-in firewall](sql-database-managed-instance-management-endpoint-verify-built-in-firewall.md).


## How can I mitigate networking risks? 

To mitigate any networking risks, customers are recommended to apply a set of security settings and controls:

- Turn on [Transparent Data Encryption (TDE)](https://docs.microsoft.com/azure/sql-database/transparent-data-encryption-azure-sql) on all databases.
- Turn off Common Language Runtime (CLR). This is recommended on-premises as well.
- Use Azure Active Directory (AAD) authentication only.
- Access instance with low privileged DBA account.
- Configure JiT jumpbox access for sysadmin account.
- Turn on [SQL auditing](https://docs.microsoft.com/sql/relational-databases/security/auditing/sql-server-audit-database-engine), and integrate it with alerting mechanisms.
- Turn on the [Threat Detection](https://docs.microsoft.com/azure/sql-database/sql-database-threat-detection) from the [Advanced Data Security (ADS)](https://docs.microsoft.com/azure/sql-database/sql-database-advanced-data-security) suite.


## Where can I find use cases and resulting cost savings with managed instance?

Managed instance case studies:

- [Komatsu](https://customers.microsoft.com/story/komatsu-australia-manufacturing-azure)
- [KMD](https://customers.microsoft.com/en-ca/story/kmd-professional-services-azure-sql-database)
- [PowerDETAILS](https://customers.microsoft.com/story/powerdetails-partner-professional-services-azure-sql-database-managed-instance)
- [Allscripts](https://customers.microsoft.com/story/allscripts-partner-professional-services-azure)
  
To get a better understanding of the benefits, costs, and risks associated with deploying Azure SQL Database managed instance, there's also a Forrester’s study: [Total Economic Impact of MI](https://azure.microsoft.com/resources/forrester-tei-sql-database-managed-instance).


## Can I do DNS refresh? 
  
Currently, we don't provide a feature to refresh DNS server configuration for managed instance.

DNS configuration is eventually refreshed:

- When DHCP lease expires.
- On platform upgrade.

As a workaround, downgrade the managed instance to 4 vCore and upgrade it again afterward. This has a side effect of refreshing the DNS configuration.


## Can a managed instance have a static IP address?

In rare but necessary situations, we might need to do an online migration of a managed instance to a new virtual cluster. If needed, this migration is because of changes in our technology stack aimed to improve security and reliability of the service. Migrating to a new virtual cluster results in changing the IP address that is mapped to the managed instance host name. The managed instance service doesn't claim static IP address support and reserves the right to change it without notice as a part of regular maintenance cycles.

For this reason, we strongly discourage relying on immutability of the IP address as it could cause unnecessary downtime.

## Can I move a managed instance or its VNet to another resource group?

No, this is current platform limitation. After a managed instance is created, moving the managed instance or VNet to another resource group or subscription is not supported.

## Can I change the time zone for an existing managed instance?

Time zone configuration can be set when a managed instance is provisioned for the first time. Changing the time zone of the existing managed instance isn't supported. For details, see [time zone limitations](sql-database-managed-instance-timezone.md#limitations).

Workarounds include creating a new managed instance with the proper time zone and then either perform a manual backup and restore, or what we recommend, perform a [cross-instance point-in-time restore](https://blogs.msdn.microsoft.com/sqlserverstorageengine/2018/06/07/cross-instance-point-in-time-restore-in-azure-sql-database-managed-instance/).


## How do I resolve performance issues with my managed instance

For a performance comparison between managed instance and SQL Server, a good starting point is [Best practices for performance comparison between Azure SQL managed instance and SQL Server](https://techcommunity.microsoft.com/t5/Azure-SQL-Database/The-best-practices-for-performance-comparison-between-Azure-SQL/ba-p/683210) article.

Data loading is often slower on managed instance than in SQL Server due to mandatory full recovery model and [limits](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-resource-limits#service-tier-characteristics) on transaction log write throughput. Sometimes, this can be worked around by loading transient data into tempdb instead of user database, or using clustered columnstore, or memory-optimized tables.


## Can I restore my encrypted database to managed instance?

Yes, you don't need to decrypt your database to be able to restore it to managed instance. You do need to provide a certificate/key used as an encryption key protector in the source system to the managed instance to be able to read data from the encrypted backup file. There are two possible ways to do it:

- *Upload certificate-protector to the managed instance*. It can be done using PowerShell only. The [sample script](https://docs.microsoft.com/azure/sql-database/sql-database-managed-instance-migrate-tde-certificate) describes the whole process.
- *Upload asymmetric key-protector to Azure Key Vault (AKV) and point managed instance to it*. This approach resembles bring-your-own-key (BYOK) TDE use case that also uses AKV integration to store the encryption key. If you don't want to use the key as an encryption key protector, and just want to make the key available for managed instance to restore encrypted database(s), follow instructions for [setting up BYOK TDE](https://docs.microsoft.com/azure/sql-database/transparent-data-encryption-azure-sql#manage-transparent-data-encryption), and don’t check the checkbox *Make the selected key the default TDE protector*.

Once you make the encryption protector available to managed instance, you can proceed with the standard database restore procedure.

## How can I migrate from Azure SQL Database single or elastic pool to managed instance? 

Managed instance offers the same performance levels per compute and storage size as other deployment options of Azure SQL Database. If you want to consolidate data on a single instance, or you simply need a feature supported exclusively in managed instance, you can migrate your data by using export/import (BACPAC) functionality.
