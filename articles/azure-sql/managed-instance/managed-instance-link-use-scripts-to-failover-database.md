---
title: Fail over database with link feature with T-SQL and PowerShell scripts
titleSuffix: Azure SQL Managed Instance
description: This guide teaches you how to use the SQL Managed Instance link with scripts to fail over database from SQL Server to Azure SQL Managed Instance.
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

# Failover (migrate) database with Azure SQL Managed Instance link feature with T-SQL and PowerShell scripts

[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article teaches you to use T-SQL and PowerShell scripts for [Managed Instance link feature](link-feature.md) to fail over (migrate) your database from SQL Server to Azure SQL Managed Instance.

> [!NOTE]
> The link feature for Azure SQL Managed Instance is currently in preview.

> [!NOTE]
> Configuration on Azure side is done with PowerShell that calls SQL Managed Instance REST API. Support for Azure PowerShell and CLI will be released in the upcomming weeks. At that point this article will be updated with the simplified PowerShell scripts.

> [!TIP]
> SQL Managed Instance link database failover can be set up with [SSMS wizard](managed-instance-link-use-ssms-to-failover-database.md).

Database failover from SQL Server instance to SQL Managed Instance breaks the link between the two databases. Failover stops replication and leaves both databases in an independent state, ready for individual read-write workloads.

To start migrating database to the SQL Managed Instance, first stop the application workload to the SQL Server during your maintenance hours. This is required to enable SQL Managed Instance to catchup with the database replication and make migration to Azure without any data loss.

While database is a part of Always On Availability Group, it isn't possible to set it to read-only mode. You'll need to ensure that your application(s) aren't committing transactions to SQL Server.

## Switch the replication mode from asynchronous to synchronous

The replication between SQL Server and SQL Managed Instance is asynchronous by default. Before you perform database migration to Azure, the link needs to be switched to synchronous mode. Synchronous replication across distances might slow down transactions on the primary SQL Server.
Switching from async to sync mode requires replication mode change on SQL Managed Instance and SQL Server.

## Switch replication mode on Managed Instance

Use the following PowerShell script to call REST API that changes the replication mode from asynchronous to synchronous on SQL Managed Instance. We suggest you execute the REST API call using Azure Cloud Shell in Azure portal.

Replace `<YourSubscriptionID>` with your subscription ID and replace `<ManagedInstanceName>` with the name of your managed instance. Replace `<DAGName>` with the name of Distributed Availability Group link for which you’d like to get the status.

```powershell
# Execute in Azure Cloud Shell
# ====================================================================================
# POWERSHELL SCRIPT TO SWITCH REPLICATION MODE SYNC-ASYNC ON MANAGED INSTANCE
# USER CONFIGURABLE VALUES
# (C) 2021-2022 SQL Managed Instance product group
# ====================================================================================
# Enter your Azure Subscription ID
$SubscriptionID = "<SubscriptionID>"
# Enter your Managed Instance name – example "sqlmi1"
$ManagedInstanceName = "<ManagedInstanceName>"
# Enter the Distributed Availability Group name
$DAGName = "<DAGName>"

# ====================================================================================
# INVOKING THE API CALL -- THIS PART IS NOT USER CONFIGURABLE
# ====================================================================================
# Log in and select subscription if needed
if ((Get-AzContext ) -eq $null)
{
    echo "Logging to Azure subscription"
    Login-AzAccount
}
Select-AzSubscription -SubscriptionName $SubscriptionID

# Build URI for the API call
#
$miRG = (Get-AzSqlInstance -InstanceName $ManagedInstanceName).ResourceGroupName
$uriFull = "https://management.azure.com/subscriptions/" + $SubscriptionID + "/resourceGroups/" + $miRG+ "/providers/Microsoft.Sql/managedInstances/" + $ManagedInstanceName + "/distributedAvailabilityGroups/" + $DAGName + "?api-version=2021-05-01-preview"
echo $uriFull

# Build API request body
#

$bodyFull = "{`"properties`":{`"ReplicationMode`":`"sync`"}}"

echo $bodyFull 

# Get auth token and build the header
#
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$currentAzureContext = Get-AzContext
$profileClient = New-Object Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient($azProfile)    
$token = $profileClient.AcquireAccessToken($currentAzureContext.Tenant.TenantId)
$authToken = $token.AccessToken
$headers = @{}
$headers.Add("Authorization", "Bearer "+"$authToken")

# Invoke API call
#
echo "Invoking API call switch Async-Sync replication mode on Managed Instance"
Invoke-WebRequest -Method PATCH -Headers $headers -Uri $uriFull -ContentType "application/json" -Body $bodyFull
```

## Switch replication mode on SQL Server

Use the following T-SQL script on SQL Server to change the replication mode of Distributed Availability Group on SQL Server from async to sync. Replace `<DAGName>` with the name of Distributed Availability Group, and replace `<AGName>` with the name of Availability Group created on SQL Server. In addition, replace `<ManagedInstanceName>` with the name of your SQL Managed Instance.

```sql
-- Execute on SQL Server
-- Sets the Distributed Availability Group to synchronous commit.
-- ManagedInstanceName example 'sqlmi1'
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

To validate change of the link replication, execute the following DMV, and expected results are shown below. They're indicating SYNCHRONOUS_COMIT state.

```sql
-- Execute on SQL Server
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

With both SQL Managed Instance, and SQL Server being switched to Sync mode, the replication between the two entities is now synchronous. If you require to reverse this state, follow the same steps and set async state for both SQL Server and SQL Managed Instance.

## Check LSN values on both SQL Server and Managed Instance

To complete the migration, we need to ensure that the replication has completed. For this, you need to ensure that LSNs (Log Sequence Numbers) indicating the log records written for both SQL Server and SQL Managed Instance are the same. Initially, it's expected that SQL Server LSN will be higher than LSN number on SQL Managed Instance. The difference is caused by the fact that SQL Managed Instance might be lagging somewhat behind the primary SQL Server due to network latency. After some time, LSNs on SQL Managed Instance and SQL Server should match and stop changing, as the workload on SQL Server should be stopped.

Use the following T-SQL query on SQL Server to read the LSN number of the last recorded transaction log. Replace `<DatabaseName>` with your database name and look for the last hardened LSN number, as shown below.

```sql
-- Execute on SQL Server
-- Obtain last hardened LSN for a database on SQL Server.
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

Use the following T-SQL query on SQL Managed Instance to read the LSN number of the last hardened LSN number for your database. Replace `<DatabaseName>` with your database name.

Query shown below will work on General Purpose SQL Managed Instance. For Business Critical Managed Instance, you will need to uncomment `and drs.is_primary_replica = 1` at the end of the script. On Business Critical, this filter will make sure that only primary replica details are read.

```sql
-- Execute on Managed Instance
-- Obtain LSN for a database on SQL Managed Instance.
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
    -- for BC add the following as well
    -- AND drs.is_primary_replica = 1
```

Verify once again that your workload is stopped on SQL Server. Check that LSNs on both SQL Server and SQL Managed Instance match, and that they remain matched and unchanged for some time. Stable LSN numbers on both ends indicate that tail log has been replicated to SQL Managed Instance and workload is effectively stopped. Proceed to the next step to initiate database failover and migration to Azure.

## Initiate database failover and migration to Azure

SQL Managed Instance link database failover and migration to Azure is accomplished by invoking REST API call. This will close the link and complete the replication on SQL Managed Instance. Replicated database will become read-write on SQL Managed Instance.

Use the following API to initiate database failover to Azure. Replace `<YourSubscriptionID>` with your actual Azure subscription ID. Replace `<RG>` with the resource group where your SQL Managed Instance is deployed and replace `<ManagedInstanceName>` with the name of our SQL Managed Instance. In addition, replace `<DAGName>` with the name of Distributed Availability Group made on SQL Server.

```PowerShell
# Execute in Azure Cloud Shell
# ====================================================================================
# POWERSHELL SCRIPT TO FAILOVER AND MIGRATE DATABASE WITH SQL MANAGED INSTANCE LINK
# USER CONFIGURABLE VALUES
# (C) 2021-2022 SQL Managed Instance product group
# ====================================================================================
# Enter your Azure Subscription ID
$SubscriptionID = "<SubscriptionID>"
# Enter your Managed Instance name – example "sqlmi1"
$ManagedInstanceName = "<ManagedInstanceName>"
# Enter the Distributed Availability Group link name
$DAGName = "<DAGName>"

# ====================================================================================
# INVOKING THE API CALL -- THIS PART IS NOT USER CONFIGURABLE.
# ====================================================================================
# Log in and select subscription if needed
if ((Get-AzContext ) -eq $null)
{
    echo "Logging to Azure subscription"
    Login-AzAccount
}
Select-AzSubscription -SubscriptionName $SubscriptionID

# Build URI for the API call
#
$miRG = (Get-AzSqlInstance -InstanceName $ManagedInstanceName).ResourceGroupName
$uriFull = "https://management.azure.com/subscriptions/" + $SubscriptionID + "/resourceGroups/" + $miRG+ "/providers/Microsoft.Sql/managedInstances/" + $ManagedInstanceName + "/distributedAvailabilityGroups/" + $DAGName + "?api-version=2021-05-01-preview"
echo $uriFull

# Get auth token and build the header
#
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$currentAzureContext = Get-AzContext
$profileClient = New-Object Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient($azProfile)
$token = $profileClient.AcquireAccessToken($currentAzureContext.Tenant.TenantId)
$authToken = $token.AccessToken
$headers = @{}
$headers.Add("Authorization", "Bearer "+"$authToken")

# Invoke API call
#
Invoke-WebRequest -Method DELETE -Headers $headers -Uri $uriFull -ContentType "application/json"
```

## Cleanup Availability Group and Distributed Availability Group on SQL Server

After breaking the link and migrating database to Azure SQL Managed Instance, consider cleaning up Availability Group and Distributed Availability Group on SQL Server if they aren't used otherwise on SQL Server.
Replace `<DAGName>` with the name of the Distributed Availability Group on SQL Server and replace `<AGName>` with Availability Group name on the SQL Server.

``` sql
-- Execute on SQL Server
DROP AVAILABILITY GROUP <DAGName>
GO
DROP AVAILABILITY GROUP <AGName>
GO
```

With this step, the migration of the database from SQL Server to Managed Instance has been completed.

## Next steps

For more information on the link feature, see the following resources:

- [Managed Instance link – connecting SQL Server to Azure reimagined](https://aka.ms/mi-link-techblog).
- [Prepare for SQL Managed Instance link](./managed-instance-link-preparation.md).
- [Use SQL Managed Instance link with scripts to replicate database](./managed-instance-link-use-scripts-to-replicate-database.md).
- [Use SQL Managed Instance link via SSMS to replicate database](./managed-instance-link-use-ssms-to-replicate-database.md).
- [Use SQL Managed Instance link via SSMS to migrate database](./managed-instance-link-use-ssms-to-failover-database.md).
