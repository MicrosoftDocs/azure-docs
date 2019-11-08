---
title: How to move resources to another region
description: Learn how to move  your Azure SQL Database, Azure SQL elastic pool, or Azure SQL managed instance to another region.
services: sql-database
ms.service: sql-database
ms.subservice: data-movement
ms.custom: 
ms.devlang: 
ms.topic: conceptual
author: MashaMSFT
ms.author: mathoma
ms.reviewer: carlrab
ms.date: 06/25/2019
---

# How to move Azure SQL resources to another region

This article teaches you a generic workflow for how to move your Azure SQL Database single database, elastic pool, and managed instance to a new region. 

## Overview

There are various scenarios in which you'd want to move your existing Azure SQL resources from one region to another. For example, you expand your business to a new region and want to optimize it for the new customer base. Or you need to move the operations to a different region for compliance reasons. Or Azure released a brand-new region that provides a better proximity and improves the customer experience.  

This article provides a general workflow for moving resources to a different region. The workflow consists of the following steps: 

- Verify the prerequisites for the move 
- Prepare to move the resources in scope
- Monitor the preparation process
- Test the move process
- Initiate the actual move 
- Remove the resources from the source region 


> [!NOTE]
> This article applies to migrations within the Azure public cloud, or within the same sovereign cloud. 


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Move single database

### Verify prerequisites 

1. Create a target logical server for each source server. 
1. Configure the firewall with the right exceptions using [PowerShell](scripts/sql-database-create-and-configure-database-powershell.md).  
1. Configure the logical servers with the correct logins. If you're not the subscription administrator or SQL server administrator, work with the administrator to assign the permissions that you need. For more information, see [How to manage Azure SQL database security after disaster recovery](sql-database-geo-replication-security-config.md). 
1. If your databases are encrypted with TDE and use your own encryption key in Azure key vault, ensure that the correct encryption material is provisioned in the target regions. For more information, see [Azure SQL Transparent Data Encryption with customer-managed keys in Azure Key Vault](transparent-data-encryption-byok-azure-sql.md)
1. If database-level audit is enabled, disable it and enable server-level auditing instead. After failover, database level auditing will require the cross-region traffic, which will is not desired or possible after the move. 
1. For server-level audits, ensure that:
   - The storage container, Log Analytics, or event hub with the existing audit logs is moved to the target region. 
   - Auditing is configured on the target server. For more information, see [Get started with SQL database auditing](sql-database-auditing.md). 
1. If your instance has a long-term retention policy (LTR), the existing LTR backups will remain associated with the current server. Because the target server is different, you will be able to access the older LTR backups in the source region using the source server, even if the server is deleted. 

  > [!NOTE]
  > This will be insufficient for moving between the sovereign cloud and a public region. Such a migration will require moving the LTR backups to the target server, which is not currently supported. 

### Prepare resources

1. Create a [failover group](sql-database-single-database-failover-group-tutorial.md#2---create-the-failover-group) between the logical server of the source to the logical server of the target.  
1. Add the databases you want to move to the failover group. 
    - Replication of all added databases will be initiated automatically. For more information, see [Best practices for using failover groups with single databases](sql-database-auto-failover-group.md#best-practices-of-using-failover-groups-with-single-databases-and-elastic-pools). 
 
### Monitor the preparation process

You can periodically call [Get-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/get-azsqldatabasefailovergroup) to monitor replication of your databases from the source to the target. The output object of `Get-AzSqlDatabaseFailoverGroup` includes a property for the **ReplicationState**: 
   - **ReplicationState = 2** (CATCH_UP) indicates the database is synchronized and can be safely failed over. 
   - **ReplicationState = 0** (SEEDING) indicates that the database is not yet seeded, and an attempt to failover will fail. 

### Test synchronization

Once **ReplicationState** is `2`, connect to each database, or subset of databases using the secondary endpoint `<fog-name>.secondary.database.windows.net` and perform any query against the databases to ensure connectivity, proper security configuration, and data replication. 

### Initiate the move

1. Connect to the target server using the secondary endpoint `<fog-name>.secondary.database.windows.net`.
1. Use [Switch-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/switch-azsqldatabasefailovergroup) to switch the secondary managed instance to be the primary with full synchronization. This operation will either succeed, or it will roll back. 
1. Verify that the command has completed successfully by using `nslook up <fog-name>.secondary.database.windows.net` to ascertain that the DNS CNAME entry points to the target region IP address. If the switch command fails, the CNAME will not get updated. 

### Remove the source databases

Once the move completes, remove the resources in the source region to avoid unnecessary charges. 

1. Delete the failover group using [Remove-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/remove-azsqldatabasefailovergroup). 
1. Delete each source database using [Remove-AzSqlDatabase](/powershell/module/az.sql/remove-azsqldatabase) for each of the databases on the source server. This will automatically terminate geo-replication links. 
1. Delete the source server using [Remove-AzSqlServer](/powershell/module/az.sql/remove-azsqlserver). 
1. Remove the key vault, audit storage containers, event hub, AAD instance, and other dependent resources to stop being billed for them. 

## Move elastic pools

### Verify prerequisites 

1. Create a target logical server for each source server. 
1. Configure the firewall with the right exceptions using [PowerShell](scripts/sql-database-create-and-configure-database-powershell.md). 
1. Configure the logical servers with the correct logins. If you're not the subscription administrator or SQL server administrator, work with the administrator to assign the permissions that you need. For more information, see [How to manage Azure SQL database security after disaster recovery](sql-database-geo-replication-security-config.md). 
1. If your databases are encrypted with TDE and use your own encryption key in Azure key vault, ensure that the correct encryption material is provisioned in the target region.
1. Create a target elastic pool for each source elastic pool, making sure the pool is created in the same service tier, with the same name and the same size. 
1. If a database-level audit is enabled, disable it and enable server-level auditing instead. After failover, database-level auditing will require cross-region traffic, which is not desired, or possible after the move. 
1. For server-level audits, ensure that:
    - The storage container, Log Analytics, or event hub with the existing audit logs is moved to the target region.
    - Audit configuration is configured at the target server. For more information, see [SQL database auditing](sql-database-auditing.md).
1. If your instance has a long-term retention policy (LTR), the existing LTR backups will remain associated with the current server. Because the target server is different, you will be able to access the older LTR backups in the source region using the source server, even if the server is deleted. 

  > [!NOTE]
  > This will be insufficient for moving between the sovereign cloud and a public region. Such a migration will require moving the LTR backups to the target server, which is not currently supported. 

### Prepare to move
 
1.  Create a separate [failover group](sql-database-elastic-pool-failover-group-tutorial.md#3---create-the-failover-group) between each elastic pool on the source logical server and its counterpart elastic pool on the target server. 
1.  Add all the databases in the pool to the failover group. 
    - Replication of the added databases will be initiated automatically. For more information, see [best practices for failover groups with elastic pools](sql-database-auto-failover-group.md#best-practices-of-using-failover-groups-with-single-databases-and-elastic-pools). 

  > [!NOTE]
  > While it is possible to create a failover group that includes multiple elastic pools, we strongly recommend that you create a separate failover group for each pool. If you have a large number of databases across multiple elastic pools that you need to move, you can run the preparation steps in parallel and then initiate the move step in parallel. This process will scale better and will take less time compared to having multiple elastic pools in the same failover group. 

### Monitor the preparation process

You can periodically call [Get-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/get-azsqldatabasefailovergroup) to monitor replication of your databases from the source to the target. The output object of `Get-AzSqlDatabaseFailoverGroup` includes a property for the **ReplicationState**: 
   - **ReplicationState = 2** (CATCH_UP) indicates the database is synchronized and can be safely failed over. 
   - **ReplicationState = 0** (SEEDING) indicates that the database is not yet seeded, and an attempt to failover will fail. 

### Test synchronization
 
Once **ReplicationState** is `2`, connect to each database, or subset of databases using the secondary endpoint `<fog-name>.secondary.database.windows.net` and perform any query against the databases to ensure connectivity, proper security configuration, and data replication. 

### Initiate the move
 
1. Connect to the target server using the secondary endpoint `<fog-name>.secondary.database.windows.net`.
1. Use [Switch-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/switch-azsqldatabasefailovergroup) to switch the secondary managed instance to be the primary with full synchronization. This operation will either succeed, or it will roll back. 
1. Verify that the command has completed successfully by using `nslook up <fog-name>.secondary.database.windows.net` to ascertain that the DNS CNAME entry points to the target region IP address. If the switch command fails, the CNAME will not get updated. 

### Remove the source elastic pools
 
Once the move completes, remove the resources in the source region to avoid unnecessary charges. 

1. Delete the failover group using [Remove-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/remove-azsqldatabasefailovergroup).
1. Delete each source elastic pool on the source server using [Remove-AzSqlElasticPool](/powershell/module/az.sql/remove-azsqlelasticpool). 
1. Delete the source server using [Remove-AzSqlServer](/powershell/module/az.sql/remove-azsqlserver). 
1. Remove the key vault, audit storage containers, event hub, AAD instance, and other dependent resources to stop being billed for them. 

## Move managed instance

### Verify prerequisites
 
1. For each source managed instance create a target managed instance of the same size in the target region.  
1. Configure the network for a managed instance. For more information, see [network configuration](sql-database-howto-managed-instance.md#network-configuration).
1. Configure the target master database with the correct logins. If you're not the subscription administrator or SQL server administrator, work with the administrator to assign the permissions that you need. 
1. If your databases are encrypted with TDE and use your own encryption key in Azure key vault, ensure that the AKV with identical encryption keys exists in both source and target regions. For more information, see [TDE with customer-managed keys in Azure Key Vault](transparent-data-encryption-byok-azure-sql.md).
1. If audit is enabled for the instance, ensure that:
    - The storage container or event hub with the existing logs is moved to the target region. 
    - Audit is configured on the target instance. For more information, see [auditing with managed instance](sql-database-managed-instance-auditing.md).
1. If your instance has a long-term retention policy (LTR), the existing LTR backups will remain associated with the current server. Because the target server is different, you will be able to access the older LTR backups in the source region using the source server, even if the server is deleted. 

  > [!NOTE]
  > This will be insufficient for moving between the sovereign cloud and a public region. Such a migration will require moving the LTR backups to the target server, which is not currently supported. 

### Prepare resources

Create a failover group between each source instance and the corresponding target instance.
    - Replication of all databases on each instance will be initiated automatically. See [Auto-failover groups](sql-database-auto-failover-group.md) for more information.

 
### Monitor the preparation process

You can periodically call [Get-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/get-azsqldatabasefailovergroup?view=azps-2.3.2) to monitor replication of your databases from the source to the target. The output object of `Get-AzSqlDatabaseFailoverGroup` includes a property for the **ReplicationState**: 
   - **ReplicationState = 2** (CATCH_UP) indicates the database is synchronized and can be safely failed over. 
   - **ReplicationState = 0** (SEEDING) indicates that the database is not yet seeded, and an attempt to failover will fail. 

### Test synchronization

Once **ReplicationState** is `2`, connect to each database, or subset of databases using the secondary endpoint `<fog-name>.secondary.database.windows.net` and perform any query against the databases to ensure connectivity, proper security configuration, and data replication. 

### Initiate the move 

1. Connect to the target server using the secondary endpoint `<fog-name>.secondary.database.windows.net`.
1. Use [Switch-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/switch-azsqldatabasefailovergroup?view=azps-2.3.2) to switch the secondary managed instance to be the primary with full synchronization. This operation will either succeed, or it will roll back. 
1. Verify that the command has completed successfully by using `nslook up <fog-name>.secondary.database.windows.net` to ascertain that the DNS CNAME entry points to the target region IP address. If the switch command fails, the CNAME will not get updated. 

### Remove the source managed instances
Once the move completes, remove the resources in the source region to avoid unnecessary charges. 

1. Delete the failover group using [Remove-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/remove-azsqldatabasefailovergroup). This will drop the failover group configuration and terminate geo-replication links between the two instances. 
1. Delete the source managed instance using [Remove-AzSqlInstance](/powershell/module/az.sql/remove-azsqlinstance). 
1. Remove any additional resources in the resource group, such as the virtual cluster, virtual network, and security group. 

## Next steps 

[Manage](sql-database-manage-after-migration.md) your Azure SQL Database once it's been migrated. 

