---
title: Azure SQL Database - read queries on replicas| Microsoft Docs
description: The Azure SQL Database provides the ability to load balance read-only workloads using the capacity of read-only replicas - called Read Scale-Out.
services: sql-database
author: anosov1960
manager: craigg
ms.service: sql-database
ms.custom: monitor & tune
ms.topic: article
ms.date: 04/07/2018
ms.author: sashan

---
# Use read-only replicas to load balance read-only query workloads

**Read Scale-Out** allows you to load balance Azure SQL Database read-only workloads using the capacity of read-only replicas. 

## Overview of Read Scale-Out

Each database in the Premium tier ([DTU-based resourcing model](sql-database-service-tiers.md#dtu-based-resourcing-model)) or in the Business Critical tier ([vCore-based resourcing model](sql-database-service-tiers.md#vcore-based-resourcing-model)) is automatically provisioned with several replicas to support the availability SLA. These replicas have the same performance characteristics and Service Level Objective (SLO) as the read-write replica used by the regular database connections. The **Read Scale-Out** feature allows you to load balance SQL Database read-only workloads using the capacity of the read-only replicas instead of sharing the read-write replica. Because read-only replicas are isolated from the read-write replica, the read-only queries will not affect the primary read-write workload. The feature is intended for the applications that include logically separated read-only workloads, such as analytics, and therefore could gain performance benefits using this additional capacity.

To use the Read Scale-Out feature with a particular database, you must explicitly enable it when creating the database or afterwards by altering its configuration using PowerShell commands or, or through the Azure Resource Manager REST API. <!---add link-->

After Read Scale-Out is enabled for a database, applications connecting to that database will be directed to either the read-write replica or to a read-only replica of that database according to the `ApplicationIntent` property configured in the application’s connection string. For information on the `ApplicationIntent` property, see [Specifying Application Intent](https://docs.microsoft.com/sql/relational-databases/native-client/features/sql-server-native-client-support-for-high-availability-disaster-recovery#specifying-application-intent) 

## Data Consistency

Read Scale-Out feature supports session-level consistency. Strong data consistency guarantees across different connections are not provided. That is to say: if an application uses two sessions to read from read-only replicas using Read Scale-Out, or reconnects after a connection failure, it is possible for the second session to return state corresponding to an earlier point in time than the first read. Likewise, if an application writes to the read-write replica in a read-write session and later reads from the read-only replica, it is possible that the read may see a state prior to the write. This is because replication to the replicas is asynchronous (replication latencies within the region are low and this situation is rare).

## Connecting to a Read-Only Replica

When you enable Read Scale-Out for a database, the `ApplicationIntent` option provided by the client during connection to that database dictates whether the connection is routed to the write replica or to a read-only replica. Specifically, if ApplicationIntent is ReadWrite (the default value), the connection will be directed to the database’s read-write replica. This is identical to existing behavior. But if ApplicationIntent is ReadOnly, the connection is routed to a readable replica.

For example, the following connection string would connect the client to a read-only replica:

Server=tcp:dlem-svr-westus.database.windows.net;Database=dlem-db1;ApplicationIntent=ReadOnly;User ID=myLogin;Password=myPassword;Trusted_Connection=False; Encrypt=True;

While either of the below connection strings would connect the client to a read-write replica:

Server=tcp:dlem-svr-westus.database.windows.net;Database=dlem-db1;ApplicationIntent=ReadWrite;User ID=myLogin;Password=myPassword;Trusted_Connection=False; Encrypt=True;

Server=tcp:dlem-svr-westus.database.windows.net;Database=dlem-db1;User ID=myLogin;Password=myPassword;Trusted_Connection=False; Encrypt=True;

Enabling and Disabling Read Scale-Out Using Azure PowerShell

Managing read scale-out in Azure PowerShell requires at least the December 2016 Azure PowerShell release, which can be downloaded here: https://github.com/Azure/azure-powershell/releases/tag/v3.3.0-December2016

Enable or disable read scale-out in Azure PowerShell by invoking the ‘Set-AzureRmSqlDatabase’ commandlet and passing in the desired value – ‘Enabled’ or ‘Disabled’ -- for the ‘-ReadScale’ parameter. Alternatively, you may use the ‘New-AzureRmSqlDatabase’ commandlet to create a new database with read scale-out enabled.

For example, to enable read scale-out for an existing database:

Set-AzureRmSqlDatabase -ResourceGroupName dlem-rg -ServerName dlem-svr-westus -DatabaseName dlem-db1 -ReadScale Enabled

To disable read scale-out for an existing database:

Set-AzureRmSqlDatabase -ResourceGroupName dlem-rg -ServerName dlem-svr-westus -DatabaseName dlem-db1 -ReadScale Disabled

To create a new database with read scale-out enabled:

New-AzureRmSqlDatabase -ResourceGroupName dlem-rg -ServerName dlem-svr-westus -DatabaseName dlem-db1 -ReadScale Enabled -Edition Premium

Enabling and Disabling Read Scale-Out Through the Azure Resource Manager REST API

To create a database with read scale-out enabled, or to enable or disable read scale-out for an existing database, create or update the corresponding database entity with the ‘readScale’ property set to ‘Enabled’ or ‘Disabled’ as in the below sample request.

Method: PUT

URL: https://management.azure.com/subscriptions/{SubscriptionId}/resourceGroups/{GroupName}/providers/Microsoft.Sql/servers/{ServerName}/databases/{DatabaseName}?api-version= 2014-04-01-preview

Body:

{

"properties":{

"readScale":"Enabled"

}

} For additional information on the PUT database API, go to https://msdn.microsoft.com/en-us/library/azure/mt163685.aspx. For additional information on the common parameters and headers for the Azure Resource Manager SQL Database APIs, go to https://msdn.microsoft.com/en-us/library/azure/mt163571.aspx.


## Next steps
