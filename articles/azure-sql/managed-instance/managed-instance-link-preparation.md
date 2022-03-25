---
title: Prepare environment for link feature
titleSuffix: Azure SQL Managed Instance
description: This guide teaches you how to prepare your environment to use the SQL Managed Instance link to replicate your database over to Azure SQL Managed Instance, and possibly failover. 
services: sql-database
ms.service: sql-managed-instance
ms.subservice: data-movement
ms.custom: 
ms.devlang: 
ms.topic: guide
author: sasapopo
ms.author: sasapopo
ms.reviewer: mathoma, danil
ms.date: 03/22/2022
---

# Prepare environment for link feature - Azure SQL Managed Instance
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article teaches you to prepare your environment for the [Managed Instance link feature](link-feature.md) so that you can replicate databases from SQL Server instance to Azure SQL Managed Instance.

> [!NOTE]
> The link feature for Azure SQL Managed Instance is currently in preview. 

## Prerequisites 

To use the Managed Instance link feature, you need the following prerequisites: 

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [SQL Server 2019 Enterprise or Developer edition](https://www.microsoft.com/en-us/evalcenter/evaluate-sql-server-2019?filetype=EXE), starting with [CU15 (15.0.4198.2)](https://support.microsoft.com/topic/kb5008996-cumulative-update-15-for-sql-server-2019-4b6a8ee9-1c61-482d-914f-36e429901fb6).
- An instance of Azure SQL Managed Instance. [Get started](instance-create-quickstart.md) if you don't have one. 

## Prepare your SQL Server instance

To prepare your SQL Server instance, you need to validate:
- you're on the minimum supported version;
- you've enabled the availability group feature;
- you've added the proper trace flags at startup;
- your databases are in full recovery mode and backed up.

You'll need to restart SQL Server for these changes to take effect.

### Install CU15 (or higher)

The link feature for SQL Managed Instance was introduced in CU15 of SQL Server 2019.

To check your SQL Server version, run the following Transact-SQL (T-SQL) script on SQL Server: 

```sql
-- Execute on SQL Server
-- Shows the version and CU of the SQL Server
SELECT @@VERSION
```

If your SQL Server version is lower than CU15 (15.0.4198.2), either install the [CU15](https://support.microsoft.com/topic/kb5008996-cumulative-update-15-for-sql-server-2019-4b6a8ee9-1c61-482d-914f-36e429901fb6), or the current latest cumulative update. Your SQL Server instance will be restarted during the update. 

### Create database master key in the master database

Create database master key in the master database by running the following T-SQL script on SQL Server.

```sql
-- Execute on SQL Server
-- Create MASTER KEY
USE MASTER
CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<strong_password>'
```

To check if you have database master key, use the following T-SQL script on SQL Server.

```sql
-- Execute on SQL Server
SELECT * FROM sys.symmetric_keys WHERE name LIKE '%DatabaseMasterKey%'
```

### Enable availability groups feature

The link feature for SQL Managed Instance relies on the Always On availability groups feature, which isn't enabled by default. To learn more, review [enabling the Always On availability groups feature](/sql/database-engine/availability-groups/windows/enable-and-disable-always-on-availability-groups-sql-server). 

To confirm the Always On availability groups feature is enabled, run the following Transact-SQL (T-SQL) script on SQL Server: 

```sql
-- Execute on SQL Server
-- Is HADR enabled on this SQL Server?
declare @IsHadrEnabled sql_variant = (select SERVERPROPERTY('IsHadrEnabled'))
select
    @IsHadrEnabled as IsHadrEnabled,
    case @IsHadrEnabled
        when 0 then 'The Always On availability groups is disabled.'
        when 1 then 'The Always On availability groups is enabled.'
        else 'Unknown status.'
    end as 'HadrStatus'
```

If the availability groups feature isn't enabled, follow these steps to enable it: 

1. Open the **SQL Server Configuration Manager**. 
1. Choose the SQL Server service from the navigation pane. 
1. Right-click on the SQL Server service, and select **Properties**: 
 
   :::image type="content" source="./media/managed-instance-link-preparation/sql-server-configuration-manager-sql-server-properties.png" alt-text="Screenshot showing S Q L Server configuration manager.":::

1. Go to the **Always On Availability Groups** tab. 
1. Select the checkbox to enable **Always On Availability Groups**. Select **OK**: 

   :::image type="content" source="./media/managed-instance-link-preparation/always-on-availability-groups-properties.png" alt-text="Screenshot showing always on availability groups properties.":::

1. Select **OK** on the dialog box to restart the SQL Server service.

### Enable startup trace flags

To optimize Managed Instance link performance, enabling trace flags `-T1800` and `-T9567` at startup is highly recommended: 

- **-T1800**: This trace flag optimizes performance when the log files for the primary and secondary replica in an availability group are hosted on disks with different sector sizes, such as 512 bytes and 4k. If both primary and secondary replicas have a disk sector size of 4k, this trace flag isn't required. To learn more, review [KB3009974](https://support.microsoft.com/topic/kb3009974-fix-slow-synchronization-when-disks-have-different-sector-sizes-for-primary-and-secondary-replica-log-files-in-sql-server-ag-and-logshipping-environments-ed181bf3-ce80-b6d0-f268-34135711043c).
- **-T9567**: This trace flag enables compression of the data stream for availability groups during automatic seeding. The compression increases the load on the processor but can significantly reduce transfer time during seeding.

To enable these trace flags at startup, follow these steps: 

1. Open **SQL Server Configuration Manager**. 
1. Choose the SQL Server service from the navigation pane. 
1. Right-click on the SQL Server service, and select **Properties**: 

   :::image type="content" source="./media/managed-instance-link-preparation/sql-server-configuration-manager-sql-server-properties.png" alt-text="Screenshot showing S Q L Server configuration manager.":::

1. Go to the **Startup Parameters** tab. In **Specify a startup parameter**, enter `-T1800` and select **Add** to add the startup parameter. After the trace flag has been added, enter `-T9567` and select **Add** to add the other trace flag as well. Select **Apply** to save your changes: 

   :::image type="content" source="./media/managed-instance-link-preparation/startup-parameters-properties.png" alt-text="Screenshot showing Startup parameter properties.":::

1. Select **OK** to close the **Properties** window. 

To learn more, review [enabling trace flags](/sql/t-sql/database-console-commands/dbcc-traceon-transact-sql). 

### Restart SQL Server and validate configuration

After you've validated you're on a supported version of SQL Server, enabled the Always On availability groups feature, and added your startup trace flags, restart your SQL Server instance to apply all of these changes. 

To restart your SQL Server instance, follow these steps:

1. Open **SQL Server Configuration Manager**. 
1. Choose the SQL Server service from the navigation pane. 
1. Right-click on the SQL Server service, and select **Restart**: 

    :::image type="content" source="./media/managed-instance-link-preparation/sql-server-configuration-manager-sql-server-restart.png" alt-text="Screenshot showing S Q L Server restart command call.":::

After the restart, use Transact-SQL to validate the configuration of your SQL Server. Your SQL Server version should be 15.0.4198.2 or greater, the Always On availability groups feature should be enabled, and you should have the Trace flags -T1800 and -T9567 enabled.

To validate your configuration, run the following Transact-SQL (T-SQL) script: 

```sql
-- Execute on SQL Server
-- Shows the version and CU of SQL Server
SELECT @@VERSION

-- Shows if Always On availability groups feature is enabled 
SELECT SERVERPROPERTY ('IsHadrEnabled')

-- Lists all trace flags enabled on the SQL Server
DBCC TRACESTATUS
```

The following screenshot is an example of the expected outcome for a SQL Server that's been properly configured: 

:::image type="content" source="./media/managed-instance-link-preparation/ssms-results-expected-outcome.png" alt-text="Screenshot showing expected outcome in S S M S.":::

### User database recovery mode and backup

All databases that are to be replicated via instance link must be in full recovery mode and have at least one backup. Execute the following on SQL Server:

```sql
-- Execute on SQL Server
-- Set full recovery mode for all databases you want to replicate.
ALTER DATABASE [<DatabaseName>] SET RECOVERY FULL
GO

-- Execute backup for all databases you want to replicate.
BACKUP DATABASE [<DatabaseName>] TO DISK = N'<DiskPath>'
GO
```

## Configure network connectivity

For the instance link to work, there must be network connectivity between SQL Server and SQL Managed Instance. The network option that you choose depends on where your SQL Server resides - whether it's on-premises or on a virtual machine (VM). 

### SQL Server on Azure VM 

Deploying your SQL Server to an Azure VM in the same Azure virtual network (VNet) that hosts your SQL Managed Instance is the simplest method, as there will automatically be network connectivity between the two instances. To learn more, see the detailed tutorial [Deploy and configure an Azure VM to connect to Azure SQL Managed Instance](./connect-vm-instance-configure.md). 

If your SQL Server on Azure VM is in a different VNet to your managed instance, either connect the two Azure VNets using [Global VNet peering](https://techcommunity.microsoft.com/t5/azure-sql/new-feature-global-vnet-peering-support-for-azure-sql-managed/ba-p/1746913), or configure [VPN gateways](../../vpn-gateway/tutorial-create-gateway-portal.md). 

>[!NOTE]
> Global VNet peering is enabled by default on managed instances provisioned after November 2020. [Raise a support ticket](../database/quota-increase-request.md) to enable Global VNet peering on older instances. 

### SQL Server outside of Azure 

If your SQL Server is hosted outside of Azure, establish a VPN connection between your SQL Server and your SQL Managed Instance with either option: 

- [Site-to-site virtual private network (VPN) connection](/office365/enterprise/connect-an-on-premises-network-to-a-microsoft-azure-virtual-network)
- [Azure Express Route connection](../../expressroute/expressroute-introduction.md)

> [!TIP]
> Azure Express Route is recommended for the best network performance when replicating data. Ensure to provision a gateway with sufficiently large bandwidth for your use case. 

### Open network ports between the environments

Port 5022 needs to allow inbound and outbound traffic between SQL Server and SQL Managed Instance. Port 5022 is the standard port used for availability groups, and can't be changed or customized. 

The following table describes port actions for each environment: 

|Environment|What to do|
|:---|:-----|
|SQL Server (in Azure) | Open both inbound and outbound traffic on port 5022 for the network firewall to the entire subnet of the SQL Managed Instance. If necessary, do the same on the Windows firewall as well. Create an NSG rule in the virtual network hosting the VM that allows communication on port 5022.  |
|SQL Server (outside of Azure) | Open both inbound and outbound traffic on port 5022 for the network firewall to the entire subnet of the SQL Managed Instance. If necessary, do the same on the Windows firewall as well.  |
|SQL Managed Instance |[Create an NSG rule](../../virtual-network/manage-network-security-group.md#create-a-security-rule) in the Azure portal to allow inbound and outbound traffic from the IP address of the SQL Server on port 5022 to the virtual network hosting the SQL Managed Instance. |

Use the following PowerShell script on the Windows host of the SQL Server to open ports in the Windows Firewall: 

```powershell
New-NetFirewallRule -DisplayName "Allow TCP port 5022 inbound" -Direction inbound -Profile Any -Action Allow -LocalPort 5022 -Protocol TCP
New-NetFirewallRule -DisplayName "Allow TCP port 5022 outbound" -Direction outbound -Profile Any -Action Allow -LocalPort 5022 -Protocol TCP
```

## Test bidirectional network connectivity

Bidirectional network connectivity between SQL Server and SQL Managed Instance is necessary for the Managed Instance link feature to work. After opening your ports on the SQL Server side, and configuring an NSG rule on the SQL Managed Instance side, test connectivity. 

### Test connection from SQL Server to SQL Managed Instance 

To check if SQL Server can reach your SQL Managed Instance, use the `tnc` command in PowerShell from the SQL Server host machine. Replace `<ManagedInstanceFQDN>` with the fully qualified domain (FQDN) name of the Azure SQL Managed Instance. You can copy this information from the managed instance overview page in Azure portal.

```powershell
tnc <ManagedInstanceFQDN> -port 5022
```

A successful test shows `TcpTestSucceeded : True`: 

:::image type="content" source="./media/managed-instance-link-preparation/powershell-output-tnc-command.png" alt-text="Screenshot showing output of T N C command in PowerShell.":::

If the response is unsuccessful, verify the following network settings:
- There are rules in both the network firewall *and* the windows firewall that allow traffic to the *subnet* of the SQL Managed Instance. 
- There's an NSG rule allowing communication on port 5022 for the virtual network hosting the SQL Managed Instance. 

#### Test connection from SQL Managed Instance to SQL Server

To check that the SQL Managed Instance can reach your SQL Server, create a test endpoint on SQL Server, and then use the SQL Agent on Managed Instance to execute a PowerShell script with the `tnc` command pinging SQL Server on port 5022 from Managed Instance. 

Connect to SQL Server and run the following Transact-SQL (T-SQL) script to create a test endpoint: 

```sql
-- Execute on SQL Server
-- Create certificate needed for the test endpoint on SQL Server
USE MASTER
CREATE CERTIFICATE TEST_CERT
WITH SUBJECT = N'Certificate for SQL Server',
EXPIRY_DATE = N'3/30/2051'
GO

-- Create test endpoint on SQL Server
USE MASTER
CREATE ENDPOINT TEST_ENDPOINT
    STATE=STARTED   
    AS TCP (LISTENER_PORT=5022, LISTENER_IP = ALL)
    FOR DATABASE_MIRRORING (
        ROLE=ALL,
        AUTHENTICATION = CERTIFICATE TEST_CERT, 
        ENCRYPTION = REQUIRED ALGORITHM AES
    )
```

To verify that SQL Server endpoint is receiving connections on the port 5022, execute the following PowerShell command on the host OS of your SQL Server:

```powershell
tnc localhost -port 5022
```

A successful test shows `TcpTestSucceeded : True`. We can then proceed creating an SQL Agent job on Managed Instance to attempt testing the SQL Server test endpoint on port 5022 from the managed instance.

Next, create a new SQL Agent job on managed instance called `NetHelper`, using the public IP address or DNS name that can be resolved from the SQL Managed Instance for `SQL_SERVER_ADDRESS`. 

To create the SQL Agent Job, run the following Transact-SQL (T-SQL) script on managed instance: 

```sql
-- Execute on Managed Instance
-- SQL_SERVER_ADDRESS should be public IP address, or DNS name that can be resolved from the Managed Instance host machine.
DECLARE @SQLServerIpAddress NVARCHAR(MAX) = '<SQL_SERVER_ADDRESS>'
DECLARE @tncCommand NVARCHAR(MAX) = 'tnc ' + @SQLServerIpAddress + ' -port 5022 -InformationLevel Quiet'
DECLARE @jobId BINARY(16)

EXEC msdb.dbo.sp_add_job @job_name=N'NetHelper', 
    @enabled=1, 
    @description=N'Test Managed Instance to SQL Server network connectivity on port 5022.', 
    @category_name=N'[Uncategorized (Local)]', 
    @owner_login_name=N'cloudSA', @job_id = @jobId OUTPUT

EXEC msdb.dbo.sp_add_jobstep @job_id=@jobId, @step_name=N'tnc step', 
    @step_id=1, 
    @os_run_priority=0, @subsystem=N'PowerShell', 
    @command = @tncCommand, 
    @database_name=N'master', 
    @flags=40

EXEC msdb.dbo.sp_update_job @job_id = @jobId, @start_step_id = 1

EXEC msdb.dbo.sp_add_jobserver @job_id = @jobId, @server_name = N'(local)'

EXEC msdb.dbo.sp_start_job @job_name = N'NetHelper'
```

Execute the SQL Agent job by running the following T-SQL command on managed instance: 

```sql
-- Execute on Managed Instance
EXEC msdb.dbo.sp_start_job @job_name = N'NetHelper'
```

Execute the following query on managed instance to show the log of the SQL Agent job: 

```sql
-- Execute on Managed Instance
SELECT 
    sj.name JobName, sjs.step_id, sjs.step_name, sjsl.log, sjsl.date_modified
FROM
    msdb.dbo.sysjobs sj
    LEFT OUTER JOIN msdb.dbo.sysjobsteps sjs
    ON sj.job_id = sjs.job_id
    LEFT OUTER JOIN msdb.dbo.sysjobstepslogs sjsl
    ON sjs.step_uid = sjsl.step_uid
WHERE
    sj.name = 'NetHelper'
```

If the connection is successful, the log will show `True`. If the connection is unsuccessful, the log will show `False`. 

:::image type="content" source="./media/managed-instance-link-preparation/ssms-output-tnchelper.png" alt-text="Screenshot showing expected output of NetHelper S Q L Agent job.":::

Finally, drop the test endpoint and certificate on SQL Server with the following Transact-SQL (T-SQL) commands: 

```sql
-- Execute on SQL Server
DROP ENDPOINT TEST_ENDPOINT
GO
DROP CERTIFICATE TEST_CERT
GO
```

If the connection is unsuccessful, verify the following items: 
- The firewall on the host SQL Server allows inbound and outbound communication on port 5022. 
- There's an NSG rule for the virtual network hosting the SQL Managed instance that allows communication on port 5022. 
- If your SQL Server is on an Azure VM, there's an NSG rule allowing communication on port 5022 on the virtual network hosting the VM.
- SQL Server is running. 

> [!CAUTION]
> Proceed with the next steps only if there is validated network connectivity between your source and target environments. Otherwise, please troubleshoot network connectivity issues before proceeding any further.

## Migrate a certificate of a TDE-protected database

If you are migrating a database on SQL Server protected by Transparent Data Encryption to a managed instance, the corresponding encryption certificate from the on-premises or Azure VM SQL Server needs to be migrated to managed instance before using the link. For detailed steps, see [Migrate a TDE cert to a managed instance](tde-certificate-migrate.md).

## Install SSMS

SQL Server Management Studio (SSMS) v18.11.1 is the easiest way to use the Managed Instance Link. [Download SSMS version 18.11.1 or later](/sql/ssms/download-sql-server-management-studio-ssms) and install it to your client machine. 

After installation completes, open SSMS and connect to your supported SQL Server instance. Right-click a user database, and validate you see the "Azure SQL Managed Instance link" option in the menu: 

:::image type="content" source="./media/managed-instance-link-preparation/ssms-database-context-menu-managed-instance-link.png" alt-text="Screenshot showing Azure S Q L Managed Instance link option in the context menu.":::

## Next steps

After your environment has been prepared, you're ready to start [replicating your database](managed-instance-link-use-ssms-to-replicate-database.md). To learn more, review [Link feature in Azure SQL Managed Instance](link-feature.md). 
