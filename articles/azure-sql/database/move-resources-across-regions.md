---
title: Move resources to new region
titleSuffix: Azure SQL Database & Azure SQL Managed Instance
description: Learn how to move your database or managed instance to another region.
services: sql-database
ms.service: sql-database
ms.subservice: data-movement
ms.custom: sqldbrb=2
ms.devlang: 
ms.topic: conceptual
author: MashaMSFT
ms.author: mathoma
ms.reviewer: carlrab
ms.date: 06/25/2019
---

# Move resources to new region - Azure SQL Database & Azure SQL Managed Instance
[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

This article teaches you a generic workflow for how to move your database or managed instance to a new region.

## Overview

There are various scenarios in which you'd want to move your existing database or managed instance from one region to another. For example, you're expanding your business to a new region and want to optimize it for the new customer base. Or you need to move the operations to a different region for compliance reasons. Or Azure released a new region that provides a better proximity and improves the customer experience.  

This article provides a general workflow for moving resources to a different region. The workflow consists of the following steps:

1. Verify the prerequisites for the move.
1. Prepare to move the resources in scope.
1. Monitor the preparation process.
1. Test the move process.
1. Initiate the actual move.
1. Remove the resources from the source region.

> [!NOTE]
> This article applies to migrations within the Azure public cloud or within the same sovereign cloud.

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Move a database

### Verify prerequisites

1. Create a target server for each source server.
1. Configure the firewall with the right exceptions by using [PowerShell](scripts/create-and-configure-database-powershell.md).  
1. Configure the servers with the correct logins. If you're not the subscription administrator or SQL server administrator, work with the administrator to assign the permissions that you need. For more information, see [How to manage Azure SQL Database security after disaster recovery](active-geo-replication-security-configure.md).
1. If your databases are encrypted with transparent data encryption and use your own encryption key in Azure Key Vault, ensure that the correct encryption material is provisioned in the target regions. For more information, see [Azure SQL transparent data encryption with customer-managed keys in Azure Key Vault](transparent-data-encryption-byok-overview.md).
1. If database-level audit is enabled, disable it and enable server-level auditing instead. After failover, database-level auditing will require the cross-region traffic, which isn't desired or possible after the move.
1. For server-level audits, ensure that:
   - The storage container, Log Analytics, or event hub with the existing audit logs is moved to the target region.
   - Auditing is configured on the target server. For more information, see [Get started with SQL Database auditing](../../azure-sql/database/auditing-overview.md).
1. If your instance has a long-term retention policy (LTR), the existing LTR backups will remain associated with the current server. Because the target server is different, you'll be able to access the older LTR backups in the source region by using the source server, even if the server is deleted.

      > [!NOTE]
      > This will be insufficient for moving between the sovereign cloud and a public region. Such a migration will require moving the LTR backups to the target server, which is not currently supported.

### Prepare resources

1. Create a [failover group](failover-group-add-single-database-tutorial.md#2---create-the-failover-group) between the server of the source and the server of the target.  
1. Add the databases you want to move to the failover group.
  
    Replication of all added databases will be initiated automatically. For more information, see [Best practices for using failover groups with single databases](auto-failover-group-overview.md#best-practices-for-sql-database).

### Monitor the preparation process

You can periodically call [Get-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/get-azsqldatabasefailovergroup) to monitor replication of your databases from the source to the target. The output object of `Get-AzSqlDatabaseFailoverGroup` includes a property for the **ReplicationState**:

- **ReplicationState = 2** (CATCH_UP) indicates the database is synchronized and can be safely failed over.
- **ReplicationState = 0** (SEEDING) indicates that the database is not yet seeded, and an attempt to fail over will fail.

### Test synchronization

After **ReplicationState** is `2`, connect to each database or subset of databases using the secondary endpoint `<fog-name>.secondary.database.windows.net` and perform any query against the databases to ensure connectivity, proper security configuration, and data replication.

### Initiate the move

1. Connect to the target server using the secondary endpoint `<fog-name>.secondary.database.windows.net`.
1. Use [Switch-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/switch-azsqldatabasefailovergroup) to switch the secondary managed instance to be the primary with full synchronization. This operation will succeed or it will roll back.
1. Verify that the command has completed successfully by using `nslook up <fog-name>.secondary.database.windows.net` to ascertain that the DNS CNAME entry points to the target region IP address. If the switch command fails, the CNAME won't be updated.

### Remove the source databases

Once the move completes, remove the resources in the source region to avoid unnecessary charges.

1. Delete the failover group using [Remove-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/remove-azsqldatabasefailovergroup).
1. Delete each source database using [Remove-AzSqlDatabase](/powershell/module/az.sql/remove-azsqldatabase) for each of the databases on the source server. This will automatically terminate geo-replication links.
1. Delete the source server using [Remove-AzSqlServer](/powershell/module/az.sql/remove-azsqlserver).
1. Remove the key vault, audit storage containers, event hub, Azure Active Directory (Azure AD) instance, and other dependent resources to stop being billed for them.

## Move elastic pools

### Verify prerequisites

1. Create a target server for each source server.
1. Configure the firewall with the right exceptions using [PowerShell](scripts/create-and-configure-database-powershell.md).
1. Configure the servers with the correct logins. If you're not the subscription administrator or server administrator, work with the administrator to assign the permissions that you need. For more information, see [How to manage Azure SQL Database security after disaster recovery](active-geo-replication-security-configure.md).
1. If your databases are encrypted with transparent data encryption and use your own encryption key in Azure Key Vault, ensure that the correct encryption material is provisioned in the target region.
1. Create a target elastic pool for each source elastic pool, making sure the pool is created in the same service tier, with the same name and the same size.
1. If a database-level audit is enabled, disable it and enable server-level auditing instead. After failover, database-level auditing will require cross-region traffic, which is not desired, or possible after the move.
1. For server-level audits, ensure that:
    - The storage container, Log Analytics, or event hub with the existing audit logs is moved to the target region.
    - Audit configuration is configured at the target server. For more information, see [SQL Database auditing](../../azure-sql/database/auditing-overview.md).
1. If your instance has a long-term retention policy (LTR), the existing LTR backups will remain associated with the current server. Because the target server is different, you'll be able to access the older LTR backups in the source region using the source server, even if the server is deleted.

      > [!NOTE]
      > This will be insufficient for moving between the sovereign cloud and a public region. Such a migration will require moving the LTR backups to the target server, which is not currently supported.

### Prepare to move

1. Create a separate [failover group](failover-group-add-elastic-pool-tutorial.md#3---create-the-failover-group) between each elastic pool on the source server and its counterpart elastic pool on the target server.
1. Add all the databases in the pool to the failover group.

    Replication of the added databases will be initiated automatically. For more information, see [Best practices for failover groups with elastic pools](auto-failover-group-overview.md#best-practices-for-sql-database).

      > [!NOTE]
      > While it is possible to create a failover group that includes multiple elastic pools, we strongly recommend that you create a separate failover group for each pool. If you have a large number of databases across multiple elastic pools that you need to move, you can run the preparation steps in parallel and then initiate the move step in parallel. This process will scale better and will take less time compared to having multiple elastic pools in the same failover group.

### Monitor the preparation process

You can periodically call [Get-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/get-azsqldatabasefailovergroup) to monitor replication of your databases from the source to the target. The output object of `Get-AzSqlDatabaseFailoverGroup` includes a property for the **ReplicationState**:

- **ReplicationState = 2** (CATCH_UP) indicates the database is synchronized and can be safely failed over.
- **ReplicationState = 0** (SEEDING) indicates that the database is not yet seeded, and an attempt to fail over will fail.

### Test synchronization

Once **ReplicationState** is `2`, connect to each database or subset of databases using the secondary endpoint `<fog-name>.secondary.database.windows.net` and perform any query against the databases to ensure connectivity, proper security configuration, and data replication.

### Initiate the move

1. Connect to the target server using the secondary endpoint `<fog-name>.secondary.database.windows.net`.
1. Use [Switch-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/switch-azsqldatabasefailovergroup) to switch the secondary managed instance to be the primary with full synchronization. This operation will either succeed, or it will roll back.
1. Verify that the command has completed successfully by using `nslook up <fog-name>.secondary.database.windows.net` to ascertain that the DNS CNAME entry points to the target region IP address. If the switch command fails, the CNAME won't be updated.

### Remove the source elastic pools

Once the move completes, remove the resources in the source region to avoid unnecessary charges.

1. Delete the failover group using [Remove-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/remove-azsqldatabasefailovergroup).
1. Delete each source elastic pool on the source server using [Remove-AzSqlElasticPool](/powershell/module/az.sql/remove-azsqlelasticpool).
1. Delete the source server using [Remove-AzSqlServer](/powershell/module/az.sql/remove-azsqlserver).
1. Remove the key vault, audit storage containers, event hub, Azure AD instance, and other dependent resources to stop being billed for them.

## Move a managed instance

### Verify prerequisites

1. For each source managed instance, create a target instance of SQL Managed Instance of the same size in the target region.  
1. Configure the network for a managed instance. For more information, see [network configuration](../managed-instance/how-to-content-reference-guide.md#network-configuration).
1. Configure the target master database with the correct logins. If you're not the subscription or SQL Managed Instance administrator, work with the administrator to assign the permissions that you need.
1. If your databases are encrypted with transparent data encryption and use your own encryption key in Azure Key Vault, ensure that the Azure Key Vault with identical encryption keys exists in both source and target regions. For more information, see [Transparent data encryption with customer-managed keys in Azure Key Vault](transparent-data-encryption-byok-overview.md).
1. If audit is enabled for the managed instance, ensure that:
    - The storage container or event hub with the existing logs is moved to the target region.
    - Audit is configured on the target instance. For more information, see [Auditing with SQL Managed Instance](../managed-instance/auditing-configure.md).
1. If your instance has a long-term retention policy (LTR), the existing LTR backups will remain associated with the current instance. Because the target instance is different, you'll be able to access the older LTR backups in the source region using the source instance, even if the instance is deleted.

  > [!NOTE]
  > This will be insufficient for moving between the sovereign cloud and a public region. Such a migration will require moving the LTR backups to the target instance, which is not currently supported.

### Prepare resources

Create a failover group between each source managed instance and the corresponding target instance of SQL Managed Instance.

Replication of all databases on each instance will be initiated automatically. For more information, see [Auto-failover groups](auto-failover-group-overview.md).

### Monitor the preparation process

You can periodically call [Get-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/get-azsqldatabasefailovergroup?view=azps-2.3.2) to monitor replication of your databases from the source to the target. The output object of `Get-AzSqlDatabaseFailoverGroup` includes a property for the **ReplicationState**:

- **ReplicationState = 2** (CATCH_UP) indicates the database is synchronized and can be safely failed over.
- **ReplicationState = 0** (SEEDING) indicates that the database isn't yet seeded, and an attempt to fail over will fail.

### Test synchronization

Once **ReplicationState** is `2`, connect to each database, or subset of databases using the secondary endpoint `<fog-name>.secondary.database.windows.net` and perform any query against the databases to ensure connectivity, proper security configuration, and data replication.

### Initiate the move

1. Connect to the target managed instance by using the secondary endpoint `<fog-name>.secondary.database.windows.net`.
1. Use [Switch-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/switch-azsqldatabasefailovergroup?view=azps-2.3.2) to switch the secondary managed instance to be the primary with full synchronization. This operation will succeed, or it will roll back.
1. Verify that the command has completed successfully by using `nslook up <fog-name>.secondary.database.windows.net` to ascertain that the DNS CNAME entry points to the target region IP address. If the switch command fails, the CNAME won't be updated.

### Remove the source managed instances

Once the move finishes, remove the resources in the source region to avoid unnecessary charges.

1. Delete the failover group using [Remove-AzSqlDatabaseFailoverGroup](/powershell/module/az.sql/remove-azsqldatabasefailovergroup). This will drop the failover group configuration and terminate geo-replication links between the two instances.
1. Delete the source managed instance using [Remove-AzSqlInstance](/powershell/module/az.sql/remove-azsqlinstance).
1. Remove any additional resources in the resource group, such as the virtual cluster, virtual network, and security group.

## Next steps

[Manage](manage-data-after-migrating-to-database.md) your database after it has been migrated.
