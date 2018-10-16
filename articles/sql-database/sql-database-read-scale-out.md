---
title: Azure SQL Database - read queries on replicas| Microsoft Docs
description: The Azure SQL Database provides the ability to load balance read-only workloads using the capacity of read-only replicas - called Read Scale-Out.
services: sql-database
ms.service: sql-database
ms.subservice: scale-out
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: anosov1960
ms.author: sashan
ms.reviewer: carlrab
manager: craigg
ms.date: 10/15/2018
---
# Use read-only replicas to load balance read-only query workloads (preview)

**Read Scale-Out** allows you to load balance Azure SQL Database read-only workloads using the capacity of one read-only replica.

## Overview of Read Scale-Out

Each database in the Premium tier ([DTU-based purchasing model](sql-database-service-tiers-dtu.md)) or in the Business Critical tier ([vCore-based purchasing model](sql-database-service-tiers-vcore.md)) is automatically provisioned with several AlwaysON replicas to support the availability SLA.

![Readonly replicas](media/sql-database-managed-instance/business-critical-service-tier.png)

These replicas are provisioned with the same compute size as the read-write replica used by the regular database connections. The **Read Scale-Out** feature allows you to load balance SQL Database read-only workloads using the capacity of one of the read-only replicas instead of sharing the read-write replica. This way the read-only workload will be isolated from the main read-write workload and will not affect its performance. The feature is intended for the applications that include logically separated read-only workloads, such as analytics, and therefore could gain performance benefits using this additional capacity at no extra cost.

To use the Read Scale-Out feature with a particular database, you must explicitly enable it when creating the database or afterwards by altering its configuration using PowerShell by invoking the [Set-AzureRmSqlDatabase](/powershell/module/azurerm.sql/set-azurermsqldatabase) or the [New-AzureRmSqlDatabase](/powershell/module/azurerm.sql/new-azurermsqldatabase) cmdlets or through the Azure Resource Manager REST API using the [Databases - Create or Update](https://docs.microsoft.com/rest/api/sql/databases/databases_createorupdate) method.

After Read Scale-Out is enabled for a database, applications connecting to that database will be directed to either the read-write replica or to a read-only replica of that database according to the `ApplicationIntent` property configured in the application’s connection string. For information on the `ApplicationIntent` property, see [Specifying Application Intent](https://docs.microsoft.com/sql/relational-databases/native-client/features/sql-server-native-client-support-for-high-availability-disaster-recovery#specifying-application-intent).

If Read Scale-Out is disabled or you set the ReadScale property in an unsupported service tier, all connections are directed to the read-write replica, independent of the `ApplicationIntent` property.

> [!NOTE]
> During preview, Query Data Store and Extended Events are not supported on the read-only replicas.

## Data consistency

One of the benefits of replicas is that the replicas are always in the transactionally consistent state, but at different points in time there may be some small latency between different replicas. Read Scale-Out supports session-level consistency. It means, if the read-only session reconnects after a connection error caused by replica unavailability, it can be redirected to a replica that is not 100% up-to-date with the read-write replica. Likewise, if an application writes data using a read-write session and immediately reads it using a read-only session, it is possible that the latest updates are not immediately visible. This is because the transaction log redo to the replicas is asynchronous.

> [!NOTE]
> Replication latencies within the region are low and this situation is rare.

## Connecting to a read-only replica

When you enable Read Scale-Out for a database, the `ApplicationIntent` option in the connection string provided by the client dictates whether the connection is routed to the write replica or to a read-only replica. Specifically, if the `ApplicationIntent` value is `ReadWrite` (the default value), the connection will be directed to the database’s read-write replica. This is identical to existing behavior. If the `ApplicationIntent` value is `ReadOnly`, the connection is routed to a read-only replica.

For example, the following connection string connects the client to a read-only replica (replacing the items in the angle brackets with the correct values for your environment and dropping the angle brackets):

```SQL
Server=tcp:<server>.database.windows.net;Database=<mydatabase>;ApplicationIntent=ReadOnly;User ID=<myLogin>;Password=<myPassword>;Trusted_Connection=False; Encrypt=True;
```

Either of the following connection strings connects the client to a read-write replica (replacing the items in the angle brackets with the correct values for your environment and dropping the angle brackets):

```SQL
Server=tcp:<server>.database.windows.net;Database=<mydatabase>;ApplicationIntent=ReadWrite;User ID=<myLogin>;Password=<myPassword>;Trusted_Connection=False; Encrypt=True;

Server=tcp:<server>.database.windows.net;Database=<mydatabase>;User ID=<myLogin>;Password=<myPassword>;Trusted_Connection=False; Encrypt=True;
```

You can verify whether you are connected to a read-only replica by running the following query. It will return READ_ONLY when connected to a read-only replica.

```SQL
SELECT DATABASEPROPERTYEX(DB_NAME(), 'Updateability')
```

> [!NOTE]
> At any given time only one of the AlwaysON replicas is accessible by the ReadOnly sessions.

## Enable and disable Read Scale-Out

Read Scale-Out is enabled by default in [Managed Instance](sql-database-managed-instance.md) Business Critical tier(Preview). It should be explicitly enabled in [database placed on logical server](sql-database-logical-servers.md) Premium and Business Critical tiers. The methods for enabling and disabling Read Scale-Out is described here.

### Enable and disable Read Scale-Out using Azure PowerShell

Managing Read Scale-Out in Azure PowerShell requires the December 2016 Azure PowerShell release or newer. For the newest PowerShell release, see [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps).

Enable or disable read scale-out in Azure PowerShell by invoking the [Set-AzureRmSqlDatabase](/powershell/module/azurerm.sql/set-azurermsqldatabase) cmdlet and passing in the desired value – `Enabled` or `Disabled` -- for the `-ReadScale` parameter. Alternatively, you may use the [New-AzureRmSqlDatabase](/powershell/module/azurerm.sql/new-azurermsqldatabase) cmdlet to create a new database with read scale-out enabled.

For example, to enable read scale-out for an existing database (replacing the items in the angle brackets with the correct values for your environment and dropping the angle brackets):

```powershell
Set-AzureRmSqlDatabase -ResourceGroupName <myresourcegroup> -ServerName <myserver> -DatabaseName <mydatabase> -ReadScale Enabled
```

To disable read scale-out for an existing database (replacing the items in the angle brackets with the correct values for your environment and dropping the angle brackets):

```powershell
Set-AzureRmSqlDatabase -ResourceGroupName <myresourcegroup> -ServerName <myserver> -DatabaseName <mydatabase> -ReadScale Disabled
```

To create a new database with read scale-out enabled (replacing the items in the angle brackets with the correct values for your environment and dropping the angle brackets):

```powershell
New-AzureRmSqlDatabase -ResourceGroupName <myresourcegroup> -ServerName <myserver> -DatabaseName <mydatabase> -ReadScale Enabled -Edition Premium
```

### Enabling and disabling Read Scale-Out using the Azure SQL Database REST API

To create a database with read scale-out enabled, or to enable or disable read scale-out for an existing database, create, or update the corresponding database entity with the `readScale` property set to `Enabled` or `Disabled` as in the below sample request.

```rest
Method: PUT
URL: https://management.azure.com/subscriptions/{SubscriptionId}/resourceGroups/{GroupName}/providers/Microsoft.Sql/servers/{ServerName}/databases/{DatabaseName}?api-version= 2014-04-01-preview
Body:
{
   "properties":
   {
      "readScale":"Enabled"
   }
}
```

For more information, see [Databases - Create or Update](https://docs.microsoft.com/rest/api/sql/databases/databases_createorupdate).

## Using Read Scale-Out with geo-replicated databases

If you are using read scale-out to load balance read-only workloads on a database that is geo-replicated (e.g. as a member of a failover group), make sure that read scale-out is enabled on both the primary and the geo-replicated secondary databases. This will ensure the same load-balancing effect when your application connects to the new primary after failover. If you are connecting to the geo-replicated secondary database with read-scale enabled, your sessions with `ApplicationIntent=ReadOnly` will be routed to one of the  replicas the same way we route connections on the primary database.  The sessions without `ApplicationIntent=ReadOnly` will be routed to the primary replica of the geo-replicated secondary, which is also read-only. Because geo-replicated secondary database has a different end-point than the primary database, historically to access the secondary it wasn't required to set `ApplicationIntent=ReadOnly`. To ensure backward compatibility, `sys.geo_replication_links` DMV shows `secondary_allow_connections=2` (any client connection is allowed).

> [!NOTE]
> During preview, round-robin or any other load balanced routing between the local replicas of the secondary database is not supported.

## Next steps

- For information about using PowerShell to set read scale-out, see the [Set-AzureRmSqlDatabase](/powershell/module/azurerm.sql/set-azurermsqldatabase) or the [New-AzureRmSqlDatabase](/powershell/module/azurerm.sql/new-azurermsqldatabase) cmdlets.
- For information about using the REST API to set read scale-out, see [Databases - Create or Update](https://docs.microsoft.com/rest/api/sql/databases/databases_createorupdate).