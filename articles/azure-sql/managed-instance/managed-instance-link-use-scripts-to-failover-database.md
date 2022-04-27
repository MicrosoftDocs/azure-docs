---
title: Fail over a database with the link via T-SQL & PowerShell scripts
titleSuffix: Azure SQL Managed Instance
description: Learn how to use Transact-SQL and PowerShell scripts to fail over a database from SQL Server to SQL Managed Instance by using the Managed Instance link. 
services: sql-database
ms.service: sql-managed-instance
ms.subservice: data-movement
ms.custom: 
ms.devlang: 
ms.topic: guide
author: sasapopo
ms.author: sasapopo
ms.reviewer: mathoma, danil
ms.date: 03/15/2022
---

# Fail over (migrate) a database with a link via T-SQL and PowerShell scripts - Azure SQL Managed Instance 

[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article teaches you how to use Transact-SQL (T-SQL) and PowerShell scripts and a [Managed Instance link](managed-instance-link-feature-overview.md) to fail over (migrate) your database from SQL Server to SQL Managed Instance.

> [!NOTE]
> - The link is a feature of Azure SQL Managed Instance and is currently in preview. You can also use a [SQL Server Management Studio (SSMS) wizard](managed-instance-link-use-ssms-to-failover-database.md) to fail over a database with the link. 
> - The PowerShell scripts in this article make REST API calls on the SQL Managed Instance side. 


Database failover from SQL Server to SQL Managed Instance breaks the link between the two databases. Failover stops replication and leaves both databases in an independent state, ready for individual read/write workloads. 

To start migrating your database to SQL Managed Instance, first stop any application workloads on SQL Server during your maintenance hours. This enables SQL Managed Instance to catch up with database replication and migrate to Azure while mitigating data loss. 

While the primary database is a part of an Always On availability group, you can't set it to read-only mode. You need to ensure that your applications aren't committing transactions to SQL Server.

## Switch the replication mode

The replication between SQL Server and SQL Managed Instance is asynchronous by default. Before you migrate your database to Azure, switch the link to synchronous mode. Synchronous replication across large network distances might slow down transactions on the primary SQL Server instance.

Switching from async to sync mode requires a replication mode change on SQL Managed Instance and SQL Server.

### Switch replication mode (SQL Managed Instance)

Use the following PowerShell script to call a REST API that changes the replication mode from asynchronous to synchronous on SQL Managed Instance. We suggest that you make the REST API call by using Azure Cloud Shell in the Azure portal. In the script, replace:

- `<YourSubscriptionID>` with your subscription ID. 
- `<ManagedInstanceName>` with the name of your managed instance. 
- `<DAGName>` with the name of the distributed availability group that you want to get the status for. 

```powershell
# Run in Azure Cloud Shell
# ====================================================================================
# POWERSHELL SCRIPT TO SWITCH REPLICATION MODE SYNC-ASYNC ON MANAGED INSTANCE
# USER CONFIGURABLE VALUES
# (C) 2021-2022 SQL Managed Instance product group
# ====================================================================================
# Enter your Azure subscription ID
$SubscriptionID = "<SubscriptionID>"
# Enter your managed instance name – for example, "sqlmi1"
$ManagedInstanceName = "<ManagedInstanceName>"
# Enter the distributed availability group name (the link name)
$DAGName = "<DAGName>"

# ====================================================================================
# INVOKING THE API CALL -- THIS PART IS NOT USER CONFIGURABLE
# ====================================================================================
# Log in and select a subscription if needed
if ((Get-AzContext ) -eq $null)
{
    echo "Logging to Azure subscription"
    Login-AzAccount
}
Select-AzSubscription -SubscriptionName $SubscriptionID

# Build a URI for the API call
#
$miRG = (Get-AzSqlInstance -InstanceName $ManagedInstanceName).ResourceGroupName
$uriFull = "https://management.azure.com/subscriptions/" + $SubscriptionID + "/resourceGroups/" + $miRG+ "/providers/Microsoft.Sql/managedInstances/" + $ManagedInstanceName + "/distributedAvailabilityGroups/" + $DAGName + "?api-version=2021-05-01-preview"
echo $uriFull

# Build the API request body
#

$bodyFull = "{`"properties`":{`"ReplicationMode`":`"sync`"}}"

echo $bodyFull 

# Get an authentication token and build the header
#
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$currentAzureContext = Get-AzContext
$profileClient = New-Object Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient($azProfile)    
$token = $profileClient.AcquireAccessToken($currentAzureContext.Tenant.TenantId)
$authToken = $token.AccessToken
$headers = @{}
$headers.Add("Authorization", "Bearer "+"$authToken")

# Invoke the API call
#
echo "Invoking API call switch Async-Sync replication mode on Managed Instance"
Invoke-WebRequest -Method PATCH -Headers $headers -Uri $uriFull -ContentType "application/json" -Body $bodyFull
```

### Switch replication mode (SQL Server)

Use the following T-SQL script on SQL Server to change the replication mode of the distributed availability group on SQL Server from async to sync. Replace:

- `<DAGName>` with the name of the distributed availability group.
- `<AGName>` with the name of the availability group created on SQL Server. 
- `<ManagedInstanceName>` with the name of your managed instance.

```sql
-- Run on SQL Server
-- Sets the distributed availability group to a synchronous commit.
-- ManagedInstanceName example: 'sqlmi1'
USE master
GO
ALTER AVAILABILITY GROUP [<DAGName>] 
MODIFY 
AVAILABILITY GROUP ON
    '<AGName>' WITH
    (AVAILABILITY_MODE = SYNCHRONOUS_COMMIT),
    '<ManagedInstanceName>' WITH
    (AVAILABILITY_MODE = SYNCHRONOUS_COMMIT);
```

To confirm that you've changed the link's replication mode successfully, use the following dynamic management view. Results indicate the `SYNCHRONOUS_COMIT` state.

```sql
-- Run on SQL Server
-- Verifies the state of the distributed availability group
SELECT
    ag.name, ag.is_distributed, ar.replica_server_name,
    ar.availability_mode_desc, ars.connected_state_desc, ars.role_desc,
    ars.operational_state_desc, ars.synchronization_health_desc
FROM
    sys.availability_groups ag
    join sys.availability_replicas ar
    on ag.group_id=ar.group_id
    left join sys.dm_hadr_availability_replica_states ars
    on ars.replica_id=ar.replica_id
WHERE
    ag.is_distributed=1
```

Now that you've switched both SQL Managed Instance and SQL Server to sync mode, the replication between the two entities is synchronous. If you need to reverse this state, follow the same steps and set the async state for both SQL Server and SQL Managed Instance.

## Check LSN values on both SQL Server and SQL Managed Instance

To complete the migration, confirm that replication has finished. For this, ensure that the log sequence numbers (LSNs) indicating the log records written for both SQL Server and SQL Managed Instance are the same. 

Initially, it's expected that the SQL Server LSN will be higher than the SQL Managed Instance LSN. Network latency might cause SQL Managed Instance to lag somewhat behind the primary SQL Server instance. Because the workload has been stopped on SQL Server, you should expect the LSNs to match and stop changing after some time. 

Use the following T-SQL query on SQL Server to read the LSN of the last recorded transaction log. Replace `<DatabaseName>` with your database name and look for the last hardened LSN number.

```sql
-- Run on SQL Server
-- Obtain the last hardened LSN for the database on SQL Server.
SELECT
    ag.name AS [Replication group],
    db.name AS [Database name], 
    drs.database_id AS [Database ID], 
    drs.group_id, 
    drs.replica_id, 
    drs.synchronization_state_desc AS [Sync state], 
    drs.end_of_log_lsn AS [End of log LSN],
    drs.last_hardened_lsn AS [Last hardened LSN] 
FROM
    sys.dm_hadr_database_replica_states drs
    inner join sys.databases db on db.database_id = drs.database_id
    inner join sys.availability_groups ag on drs.group_id = ag.group_id
WHERE
    ag.is_distributed = 1 and db.name = '<DatabaseName>'
```

Use the following T-SQL query on SQL Managed Instance to read the last hardened LSN for your database. Replace `<DatabaseName>` with your database name.

This query will work on a General Purpose managed instance. For a Business Critical managed instance, you need to uncomment `and drs.is_primary_replica = 1` at the end of the script. On Business Critical, this filter ensures that only primary replica details are read.

```sql
-- Run on a managed instance
-- Obtain the LSN for the database on SQL Managed Instance.
SELECT
    db.name AS [Database name],
    drs.database_id AS [Database ID], 
    drs.group_id, 
    drs.replica_id, 
    drs.synchronization_state_desc AS [Sync state],
    drs.end_of_log_lsn AS [End of log LSN],
    drs.last_hardened_lsn AS [Last hardened LSN]
FROM
    sys.dm_hadr_database_replica_states drs
    inner join sys.databases db on db.database_id = drs.database_id
WHERE
    db.name = '<DatabaseName>'
    -- for Business Critical, add the following as well
    -- AND drs.is_primary_replica = 1
```

Verify once again that your workload is stopped on SQL Server. Check that LSNs on both SQL Server and SQL Managed Instance match, and that they remain matched and unchanged for some time. Stable LSNs on both instances indicate that the tail log has been replicated to SQL Managed Instance and the workload is effectively stopped.

## Start database failover and migration to Azure

Invoke a REST API call to fail over your database over the link and finalize your migration to Azure. The REST API call breaks the link and ends replication to SQL Managed Instance. The replicated database becomes read/write on the managed instance.

Use the following API to start database failover to Azure. Replace:

- `<YourSubscriptionID>` with your Azure subscription ID.
- `<RG>` with the resource group where your managed instance is deployed. 
- `<ManagedInstanceName>` with the name of your managed instance. 
- `<DAGName>` with the name of the distributed availability group made on SQL Server.

```PowerShell
# Run in Azure Cloud Shell
# ====================================================================================
# POWERSHELL SCRIPT TO FAIL OVER AND MIGRATE DATABASE WITH SQL MANAGED INSTANCE LINK
# USER CONFIGURABLE VALUES
# (C) 2021-2022 SQL Managed Instance product group
# ====================================================================================
# Enter your Azure subscription ID
$SubscriptionID = "<SubscriptionID>"
# Enter your managed instance name – for example, "sqlmi1"
$ManagedInstanceName = "<ManagedInstanceName>"
# Enter the distributed availability group link name
$DAGName = "<DAGName>"

# ====================================================================================
# INVOKING THE API CALL -- THIS PART IS NOT USER CONFIGURABLE.
# ====================================================================================
# Log in and select a subscription if needed
if ((Get-AzContext ) -eq $null)
{
    echo "Logging to Azure subscription"
    Login-AzAccount
}
Select-AzSubscription -SubscriptionName $SubscriptionID

# Build a URI for the API call
#
$miRG = (Get-AzSqlInstance -InstanceName $ManagedInstanceName).ResourceGroupName
$uriFull = "https://management.azure.com/subscriptions/" + $SubscriptionID + "/resourceGroups/" + $miRG+ "/providers/Microsoft.Sql/managedInstances/" + $ManagedInstanceName + "/distributedAvailabilityGroups/" + $DAGName + "?api-version=2021-05-01-preview"
echo $uriFull

# Get an authentication token and build the header
#
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$currentAzureContext = Get-AzContext
$profileClient = New-Object Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient($azProfile)
$token = $profileClient.AcquireAccessToken($currentAzureContext.Tenant.TenantId)
$authToken = $token.AccessToken
$headers = @{}
$headers.Add("Authorization", "Bearer "+"$authToken")

# Invoke the API call
#
Invoke-WebRequest -Method DELETE -Headers $headers -Uri $uriFull -ContentType "application/json"
```

## Clean up availability groups

After you break the link and migrate a database to Azure SQL Managed Instance, consider cleaning up the availability group and distributed availability group resources from SQL Server if they're no longer necessary. 

In the following code, replace:

- `<DAGName>` with the name of the distributed availability group on SQL Server. 
- `<AGName>` with the name of the availability group on SQL Server.

``` sql
-- Run on SQL Server
USE MASTER
GO
DROP AVAILABILITY GROUP <DAGName>
GO
DROP AVAILABILITY GROUP <AGName>
GO
```

With this step, you've finished the migration of the database from SQL Server to SQL Managed Instance.

## Next steps

For more information on the link feature, see the following resources:

- [Managed Instance link – connecting SQL Server to Azure reimagined](https://aka.ms/mi-link-techblog)
- [Prepare your environment for Managed Instance link](./managed-instance-link-preparation.md)
- [Use a Managed Instance link with scripts to replicate a database](./managed-instance-link-use-scripts-to-replicate-database.md)
- [Use a Managed Instance link via SSMS to replicate a database](./managed-instance-link-use-ssms-to-replicate-database.md)
- [Use a Managed Instance link via SSMS to migrate a database](./managed-instance-link-use-ssms-to-failover-database.md)
