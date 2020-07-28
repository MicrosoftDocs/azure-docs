---
title: Configure & manage content reference
titleSuffix: Azure SQL Managed Instance
description: A reference guide of content that teaches you how to configure and manage Azure SQL Managed Instance.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: operations
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: conceptual
author: jovanpop-msft
ms.author: jovanpop
ms.reviewer: sstein, carlr
ms.date: 04/16/2019
---
# Azure SQL Managed Instance content reference
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

In this article you can find a content reference to various guides, scripts, and explanations that help you manage and configure Azure SQL Managed Instance.

## Load data

- [Migrate to Azure SQL Managed Instance](migrate-to-instance-from-sql-server.md): Learn about the recommended migration process and tools for migration to Azure SQL Managed Instance.
- [Migrate TDE cert to Azure SQL Managed Instance](tde-certificate-migrate.md): If your SQL Server database is protected with transparent data encryption (TDE), you would need to migrate the certificate that SQL Managed Instance can use to decrypt the backup that you want to restore in Azure.
- [Import a DB from a BACPAC](../database/database-import.md)
- [Export a DB to BACPAC](../database/database-export.md)
- [Load data with BCP](../load-from-csv-with-bcp.md)
- [Load data with Azure Data Factory](../../data-factory/connector-azure-sql-database.md?toc=/azure/sql-database/toc.json)

## Network configuration

- [Determine subnet size](vnet-subnet-determine-size.md):
  Since the subnet cannot be resized after SQL Managed Instance is deployed, you need to calculate what IP range of addresses is required for the number and types of managed instances you plan to deploy to the subnet. 
- [Create a new VNet and subnet](virtual-network-subnet-create-arm-template.md):
  Configure the virtual network and subnet according to the [network requirements](connectivity-architecture-overview.md#network-requirements). 
- [Configure an existing VNet and subnet](vnet-existing-add-subnet.md):
  Verify network requirements and configure your existing virtual network and subnet to deploy SQL Managed Instance. 
- [Configure custom DNS](custom-dns-configure.md):
  Configure custom DNS to grant external resource access to  custom domains from SQL Managed Instance via a linked server of db mail profiles. 
- [Sync network configuration](azure-app-sync-network-configuration.md):
  Refresh the networking configuration plan if you can't establish a connection after [integrating your app with an Azure virtual network](../../app-service/web-sites-integrate-with-vnet.md).
- [Find the management endpoint IP address](management-endpoint-find-ip-address.md): 
  Determine the public endpoint that SQL Managed Instance is using for management purposes. 
- [Verify built-in firewall protection](management-endpoint-verify-built-in-firewall.md):
  Verify that SQL Managed Instance allows traffic only on necessary ports, and other built-in firewall rules. 
- [Connect applications](connect-application-instance.md): 
  Learn about different patterns for connecting the applications to SQL Managed Instance.

## Feature configuration

- [Configure Azure AD auth](../database/authentication-aad-configure.md)
- [Configure conditional access](../database/conditional-access-configure.md)
- [Multi-factor Azure AD auth](../database/authentication-mfa-ssms-overview.md)
- [Configure multi-factor auth](../database/authentication-mfa-ssms-configure.md)
- [Configure a temporal retention policy](../database/temporal-tables-retention-policy.md)
- [Configure TDE with BYOK](../database/transparent-data-encryption-byok-configure.md)
- [Rotate TDE BYOK keys](../database/transparent-data-encryption-byok-key-rotation.md)
- [Remove a TDE protector](../database/transparent-data-encryption-byok-remove-tde-protector.md)
- [Configure In-Memory OLTP](../in-memory-oltp-configure.md)
- [Configure Azure Automation](../database/automation-manage.md)
- [Transactional replication](replication-between-two-instances-configure-tutorial.md) enables you to replicate your data between managed instances, or from SQL Server on-premises to SQL Managed Instance, and vice versa.
- [Configure threat detection](threat-detection-configure.md) – [threat detection](../database/threat-detection-overview.md) is a built-in Azure SQL Managed Instance feature that detects various potential attacks such as SQL injection or access from suspicious locations. 
- [Creating alerts](alerts-create.md) enables you to set up alerts on monitored metrics such as CPU utilization, storage space consumption, IOPS and others for SQL Managed Instance. 

## Monitoring and tuning

- [Manual tuning](../database/performance-guidance.md)
- [Use DMVs to monitor performance](../database/monitoring-with-dmvs.md)
- [Use Query Store to monitor performance](https://docs.microsoft.com/sql/relational-databases/performance/best-practice-with-the-query-store#Insight)
- [Troubleshoot performance with Intelligent Insights](../database/intelligent-insights-troubleshoot-performance.md)
- [Use the Intelligent Insights diagnostics log](../database/intelligent-insights-use-diagnostics-log.md)
- [Monitor In-Memory OLTP space](../in-memory-oltp-monitor-space.md)

### Extended events

- [Extended events](../database/xevent-db-diff-from-svr.md)
- [Store extended events into an event file](../database/xevent-code-event-file.md)
- [Store extended events into a ring buffer](../database/xevent-code-ring-buffer.md)

## Develop applications

- [Connectivity](../database/connect-query-content-reference-guide.md#libraries)
- [Use Spark Connector](../../cosmos-db/spark-connector.md)
- [Authenticate an app](../database/application-authentication-get-client-id-keys.md)
- [Use batching for better performance](../performance-improve-use-batching.md)
- [Connectivity guidance](../database/troubleshoot-common-connectivity-issues.md)
- [DNS aliases](../database/dns-alias-overview.md)
- [Set up a DNS alias by using PowerShell](../database/dns-alias-powershell-create.md)
- [Ports - ADO.NET](../database/adonet-v12-develop-direct-route-ports.md)
- [C and C ++](../database/develop-cplusplus-simple.md)
- [Excel](../database/connect-excel.md)

## Design applications

- [Design for disaster recovery](../database/designing-cloud-solutions-for-disaster-recovery.md)
- [Design for elastic pools](../database/disaster-recovery-strategies-for-applications-with-elastic-pool.md)
- [Design for app upgrades](../database/manage-application-rolling-upgrade.md)

### Design Multi-tenant SaaS applications

- [SaaS design patterns](../database/saas-tenancy-app-design-patterns.md)
- [SaaS video indexer](../database/saas-tenancy-video-index-wingtip-brk3120-20171011.md)
- [SaaS app security](../database/saas-tenancy-elastic-tools-multi-tenant-row-level-security.md)



## Next steps

Get started by [deploying SQL Managed Instance](instance-create-quickstart.md).
