---
title: Manually initiate a failover on SQL Managed Instance
description: Learn how to manually failover primary and secondary replicas on Azure SQL Managed Instance. 
services: sql-database
ms.service: sql-managed-instance
ms.custom: seo-lt-2019, sqldbrb=1
ms.devlang: 
ms.topic: how-to
author: danimir
ms.author: danil
ms.reviewer: douglas, sstein
ms.date: 02/27/2021
---

# User-initiated manual failover on SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article explains how to manually failover a primary node on SQL Managed Instance General Purpose (GP) and Business Critical (BC) service tiers, and how to manually failover a secondary read-only replica node on the BC service tier only.

## When to use manual failover

[High availability](../database/high-availability-sla.md) is a fundamental part of SQL Managed Instance platform that works transparently for your database applications. Failovers from primary to secondary nodes in case of node degradation or fault detection, or during regular monthly software updates are an expected occurrence for all applications using SQL Managed Instance in Azure.

You might consider executing a [manual failover](../database/high-availability-sla.md#testing-application-fault-resiliency) on SQL Managed Instance for some of the following reasons:
- Test application for failover resiliency before deploying to production
- Test end-to-end systems for fault resiliency on automatic failovers
- Test how failover impacts existing database sessions
- Verify if a failover changes end-to-end performance because of changes in the network latency
- In some cases of query performance degradations, manual failover can help mitigate the performance issue.

> [!NOTE]
> Ensuring that your applications are failover resilient prior to deploying to production will help mitigate the risk of application faults in production and will contribute to application availability for your customers. Learn more about testing your applications for cloud readiness with [Testing App Cloud Readiness for Failover Resiliency with SQL Managed Instance](https://youtu.be/FACWYLgYDL8) video recoding.

## Initiate manual failover on SQL Managed Instance

### Azure RBAC permissions required

User initiating a failover will need to have one of the following Azure roles:

- Subscription Owner role, or
- [Managed Instance Contributor](../../role-based-access-control/built-in-roles.md#sql-managed-instance-contributor) role, or
- Custom role with the following permission:
  - `Microsoft.Sql/managedInstances/failover/action`

### Using PowerShell

The minimum version of Az.Sql needs to be [v2.9.0](https://www.powershellgallery.com/packages/Az.Sql/2.9.0). Consider using [Azure Cloud Shell](../../cloud-shell/overview.md) from the Azure portal that always has the latest PowerShell version available. 

As a pre-requirement, use the following PowerShell script to install required Azure modules. In addition, select the subscription where Managed Instance you wish to failover is located.

```powershell
$subscription = 'enter your subscription ID here'
Install-Module -Name Az
Import-Module Az.Accounts
Import-Module Az.Sql

Connect-AzAccount
Select-AzSubscription -SubscriptionId $subscription
```

Use PowerShell command [Invoke-AzSqlInstanceFailover](/powershell/module/az.sql/invoke-azsqlinstancefailover) with the following example to initiate failover of the primary node, applicable to both BC and GP service tier.

```powershell
$ResourceGroup = 'enter resource group of your MI'
$ManagedInstanceName = 'enter MI name'
Invoke-AzSqlInstanceFailover -ResourceGroupName $ResourceGroup -Name $ManagedInstanceName
```

Use the following PS command to failover read secondary node, applicable to BC service tier only.

```powershell
$ResourceGroup = 'enter resource group of your MI'
$ManagedInstanceName = 'enter MI name'
Invoke-AzSqlInstanceFailover -ResourceGroupName $ResourceGroup -Name $ManagedInstanceName -ReadableSecondary
```

### Using CLI

Ensure to have the latest CLI scripts installed.

Use az sql mi failover CLI command with the following example to initiate failover of the primary node, applicable to both BC and GP service tier.

```cli
az sql mi failover -g myresourcegroup -n myinstancename
```

Use the following CLI command to failover read secondary node, applicable to BC service tier only.

```cli
az sql mi failover -g myresourcegroup -n myinstancename --replica-type ReadableSecondary
```

### Using Rest API

For advanced users who would perhaps need to automate failovers of their SQL Managed Instances for purposes of implementing continuous testing pipeline, or automated performance mitigators, this function can be accomplished through initiating failover through an API call. see [Managed Instances - Failover REST API](/rest/api/sql/managed%20instances%20-%20failover/failover) for details.

To initiate failover using REST API call, first generate the Auth Token using API client of your choice. The generated authentication token is used as Authorization property in the header of API request and it is mandatory.

The following code is an example of the API URI to call:

```HTTP
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Sql/managedInstances/{managedInstanceName}/failover?api-version=2019-06-01-preview
```

The following properties need to be passed in the API call:

| **API property** | **Parameter** |
| --- | --- |
| subscriptionId | Subscription ID to which managed instance is deployed |
| resourceGroupName | Resource group that contains managed instance |
| managedInstanceName | Name of managed instance |
| replicaType | (Optional) (Primary or ReadableSecondary). These parameters represent the type of replica to be failed over: primary or readable secondary. If not specified, failover will be initiated on the primary replica by default. |
| api-version | Static value and currently needs to be “2019-06-01-preview" |

API response will be one of the following two:

- 202 Accepted
- One of the 400 request errors.

Operation status can be tracked through reviewing API responses in response headers. For more information, see [Status of asynchronous Azure operations](../../azure-resource-manager/management/async-operations.md).

## Monitor the failover

To monitor the progress of user initiated failover for your BC instance, execute the following T-SQL query in your favorite client (such is SSMS) on SQL Managed Instance. It will read the system view sys.dm_hadr_fabric_replica_states and report replicas available on the instance. Refresh the same query after initiating the manual failover.

```T-SQL
SELECT DISTINCT replication_endpoint_url, fabric_replica_role_desc FROM sys.dm_hadr_fabric_replica_states
```

Before initiating the failover, your output will indicate the current primary replica on BC service tier containing one primary and three secondaries in the AlwaysOn Availability Group. Upon execution of a failover, running this query again would need to indicate a change of the primary node.

You will not be able to see the same output with GP service tier as the one above shown for BC. This is because GP service tier is based on a single node only. 
You can use alternative T-SQL query showing the time SQL process started on the node for GP service tier instance:

```T-SQL
SELECT sqlserver_start_time, sqlserver_start_time_ms_ticks FROM sys.dm_os_sys_info
```

The short loss of connectivity from your client during the failover, typically lasting under a minute, will be the indication of the failover execution regardless of the service tier.

> [!NOTE]
> Completion of the failover process (not the actual short unavailability) might take several minutes at a time in case of **high-intensity** workloads. This is because the instance engine is taking care of all current transactions on the primary and catch up on the secondary node, prior to being able to failover.

> [!IMPORTANT]
> Functional limitations of user-initiated manual failover are:
> - There could be one (1) failover initiated on the same Managed Instance every **15 minutes**.
> - For BC instances there must exist quorum of replicas for the failover request to be accepted.
> - For BC instances it is not possible to specify which readable secondary replica to initiate the failover on.
> - Failover will not be allowed until the first full backup for a new database is completed by automated backup systems.
> - Failover will not be allowed if there exists a database restore in progress.

## Next steps
- Learn more about testing your applications for cloud readiness with [Testing App Cloud Readiness for Failover Resiliency with SQL Managed Instance](https://youtu.be/FACWYLgYDL8) video recoding.
- Learn more about high availability of managed instance [High availability for Azure SQL Managed Instance](../database/high-availability-sla.md).
- For an overview, see [What is Azure SQL Managed Instance?](sql-managed-instance-paas-overview.md).
