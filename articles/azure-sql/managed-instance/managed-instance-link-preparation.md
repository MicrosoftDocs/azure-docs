---
title: Prepare your environment for the link feature
titleSuffix: Azure SQL Managed Instance
description: Learn how to prepare your environment for using an Azure SQL Managed Instance link to replicate and fail over your database to SQL Managed Instance. 
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

# Prepare your environment for a SQL Managed Instance link
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article teaches you how to prepare your environment for an [Azure SQL Managed Instance link](link-feature.md) so that you can replicate databases from SQL Server to SQL Managed Instance.

> [!NOTE]
> A SQL Managed Instance link is a feature of SQL Server and is currently in preview. 

## Prerequisites 

To use a SQL Managed Instance link, you need the following prerequisites: 

- An active Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- [SQL Server 2019 Enterprise or Developer edition](https://www.microsoft.com/en-us/evalcenter/evaluate-sql-server-2019?filetype=EXE), starting with [CU15 (15.0.4198.2)](https://support.microsoft.com/topic/kb5008996-cumulative-update-15-for-sql-server-2019-4b6a8ee9-1c61-482d-914f-36e429901fb6).
- Azure SQL Managed Instance. [Get started](instance-create-quickstart.md) if you don't have it. 

## Prepare your SQL Server instance

To prepare your SQL Server instance, you need to validate that:

- You're on the minimum supported version.
- You've enabled the availability groups feature.
- You've added the proper trace flags at startup.
- Your databases are in full recovery mode and backed up.

You'll need to restart SQL Server for these changes to take effect.

### Install CU15 (or later)

The link feature for SQL Managed Instance was introduced in CU15 of SQL Server 2019.

To check your SQL Server version, run the following Transact-SQL (T-SQL) script on SQL Server: 

```sql
-- Run on SQL Server
-- Shows the version and CU of the SQL Server
SELECT @@VERSION
```

If your SQL Server version is earlier than CU15 (15.0.4198.2), install [CU15](https://support.microsoft.com/topic/kb5008996-cumulative-update-15-for-sql-server-2019-4b6a8ee9-1c61-482d-914f-36e429901fb6) or the latest cumulative update. You must restart your SQL Server instance during the update. 

### Create a database master key in the master database

Create database master key in the master database by running the following T-SQL script on SQL Server:

```sql
-- Run on SQL Server
-- Create a master key
USE MASTER
CREATE MASTER KEY ENCRYPTION BY PASSWORD = '<strong_password>'
```

To make sure that you have the database master key, use the following T-SQL script on SQL Server:

```sql
-- Run on SQL Server
SELECT * FROM sys.symmetric_keys WHERE name LIKE '%DatabaseMasterKey%'
```

### Enable availability groups

The link feature for SQL Managed Instance relies on the Always On availability groups feature, which isn't enabled by default. To learn more, review [Enable the Always On availability groups feature](/sql/database-engine/availability-groups/windows/enable-and-disable-always-on-availability-groups-sql-server). 

To confirm that the Always On availability groups feature is enabled, run the following T-SQL script on SQL Server: 

```sql
-- Run on SQL Server
-- Is Always On enabled on this SQL Server instance?
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

1. Open SQL Server Configuration Manager. 
1. Select **SQL Server Services** from the left pane. 
1. Right-click the SQL Server service, and then select **Properties**. 
 
   :::image type="content" source="./media/managed-instance-link-preparation/sql-server-configuration-manager-sql-server-properties.png" alt-text="Screenshot that shows SQL Server Configuration Manager, with selections for opening properties for the service.":::

1. Go to the **Always On Availability Groups** tab. 
1. Select the **Always On Availability Groups** checkbox, and then select **OK**. 

   :::image type="content" source="./media/managed-instance-link-preparation/always-on-availability-groups-properties.png" alt-text="Screenshot that shows the properties for Always On availability groups.":::

1. Select **OK** in the dialog to restart the SQL Server service.

### Enable startup trace flags

To optimize the performance of your SQL Managed Instance link, we recommend enabling the following trace flags at startup: 

- `-T1800`: This trace flag optimizes performance when the log files for the primary and secondary replicas in an availability group are hosted on disks with different sector sizes, such as 512 bytes and 4K. If both primary and secondary replicas have a disk sector size of 4K, this trace flag isn't required. To learn more, review [KB3009974](https://support.microsoft.com/topic/kb3009974-fix-slow-synchronization-when-disks-have-different-sector-sizes-for-primary-and-secondary-replica-log-files-in-sql-server-ag-and-logshipping-environments-ed181bf3-ce80-b6d0-f268-34135711043c).
- `-T9567`: This trace flag enables compression of the data stream for availability groups during automatic seeding. The compression increases the load on the processor but can significantly reduce transfer time during seeding.

To enable these trace flags at startup, use the following steps: 

1. Open SQL Server Configuration Manager. 
1. Select **SQL Server Services** from the left pane. 
1. Right-click the SQL Server service, and then select **Properties**. 

   :::image type="content" source="./media/managed-instance-link-preparation/sql-server-configuration-manager-sql-server-properties.png" alt-text="Screenshot that shows SQL Server Configuration Manager.":::

1. Go to the **Startup Parameters** tab. In **Specify a startup parameter**, enter `-T1800` and select **Add** to add the startup parameter. Then enter `-T9567` and select **Add** to add the other trace flag. Select **Apply** to save your changes. 

   :::image type="content" source="./media/managed-instance-link-preparation/startup-parameters-properties.png" alt-text="Screenshot that shows startup parameter properties.":::

1. Select **OK** to close the **Properties** window.

To learn more, review the [syntax for enabling trace flags](/sql/t-sql/database-console-commands/dbcc-traceon-transact-sql). 

### Restart SQL Server and validate the configuration

After you've ensured that you're on a supported version of SQL Server, enabled the Always On availability groups feature, and added your startup trace flags, restart your SQL Server instance to apply all of these changes:

1. Open **SQL Server Configuration Manager**. 
1. Select **SQL Server Services** from the left pane. 
1. Right-click the SQL Server service, and then select **Restart**. 

    :::image type="content" source="./media/managed-instance-link-preparation/sql-server-configuration-manager-sql-server-restart.png" alt-text="Screenshot that shows the SQL Server restart command call.":::

After the restart, run the following T-SQL script on SQL Server to validate the configuration of your SQL Server instance: 

```sql
-- Run on SQL Server
-- Shows the version and CU of SQL Server
SELECT @@VERSION

-- Shows if the Always On availability groups feature is enabled 
SELECT SERVERPROPERTY ('IsHadrEnabled')

-- Lists all trace flags enabled on SQL Server
DBCC TRACESTATUS
```

Your SQL Server version should be 15.0.4198.2 or later, the Always On availability groups feature should be enabled, and you should have the trace flags `-T1800` and `-T9567` enabled. The following screenshot is an example of the expected outcome for a SQL Server instance that has been properly configured: 

:::image type="content" source="./media/managed-instance-link-preparation/ssms-results-expected-outcome.png" alt-text="Screenshot that shows the expected outcome in S S M S.":::

### Set up database recovery and backup

All databases that will be replicated via SQL Managed Instance link must be in full recovery mode and have at least one backup. Run the following code on SQL Server:

```sql
-- Run on SQL Server
-- Set full recovery mode for all databases you want to replicate.
ALTER DATABASE [<DatabaseName>] SET RECOVERY FULL
GO

-- Execute backup for all databases you want to replicate.
BACKUP DATABASE [<DatabaseName>] TO DISK = N'<DiskPath>'
GO
```

## Configure network connectivity

For the SQL Managed Instance link to work, you must have network connectivity between SQL Server and SQL Managed Instance. The network option that you choose depends on where your SQL Server instance resides - whether it's on-premises or on a virtual machine (VM). 

### SQL Server on Azure Virtual Machines 

Deploying SQL Server on Azure Virtual Machines in the same Azure virtual network that hosts SQL Managed Instance is the simplest method, because network connectivity will automatically exist between the two instances. To learn more, see the detailed tutorial [Deploy and configure an Azure VM to connect to Azure SQL Managed Instance](./connect-vm-instance-configure.md). 

If your SQL Server on Azure Virtual Machines instance is in a different virtual network from your managed instance, either connect the two Azure virtual networks by using [global virtual network peering](https://techcommunity.microsoft.com/t5/azure-sql/new-feature-global-vnet-peering-support-for-azure-sql-managed/ba-p/1746913) or configure [VPN gateways](../../vpn-gateway/tutorial-create-gateway-portal.md). 

>[!NOTE]
> Global virtual network peering is enabled by default on managed instances provisioned after November 2020. [Raise a support ticket](../database/quota-increase-request.md) to enable global virtual network peering on older instances. 


### SQL Server outside Azure 

If your SQL Server instance is hosted outside Azure, establish a VPN connection between SQL Server and SQL Managed Instance by using either of these options: 

- [Site-to-site VPN connection](/office365/enterprise/connect-an-on-premises-network-to-a-microsoft-azure-virtual-network)
- [Azure ExpressRoute connection](../../expressroute/expressroute-introduction.md)

> [!TIP]
> We recommend ExpressRoute for the best network performance when you're replicating data. Provision a gateway with enough bandwidth for your use case. 

### Network ports between the environments

Port 5022 needs to allow inbound and outbound traffic between SQL Server and SQL Managed Instance. Port 5022 is the standard database mirroring endpoint port for availability groups. It can't be changed or customized. 

The following table describes port actions for each environment: 

|Environment|What to do|
|:---|:-----|
|SQL Server (in Azure) | Open both inbound and outbound traffic on port 5022 for the network firewall to the entire subnet of SQL Managed Instance. If necessary, do the same on the Windows firewall. Create a network security group (NSG) rule in the virtual network that hosts the VM to allow communication on port 5022.  |
|SQL Server (outside Azure) | Open both inbound and outbound traffic on port 5022 for the network firewall to the entire subnet of SQL Managed Instance. If necessary, do the same on the Windows firewall.  |
|SQL Managed Instance |[Create an NSG rule](../../virtual-network/manage-network-security-group.md#create-a-security-rule) in the Azure portal to allow inbound and outbound traffic from the IP address of SQL Server on port 5022 to the virtual network that hosts SQL Managed Instance. |

Use the following PowerShell script on the Windows host of the SQL Server instance to open ports in the Windows firewall: 

```powershell
New-NetFirewallRule -DisplayName "Allow TCP port 5022 inbound" -Direction inbound -Profile Any -Action Allow -LocalPort 5022 -Protocol TCP
New-NetFirewallRule -DisplayName "Allow TCP port 5022 outbound" -Direction outbound -Profile Any -Action Allow -LocalPort 5022 -Protocol TCP
```

## Test bidirectional network connectivity

Bidirectional network connectivity between SQL Server and SQL Managed Instance is necessary for the SQL Managed Instance link feature to work. After you open ports on the SQL Server side and configure an NSG rule on the SQL Managed Instance side, test connectivity. 

### Test the connection from SQL Server to SQL Managed Instance 

To check if SQL Server can reach SQL Managed Instance, use the following `tnc` command in PowerShell from the SQL Server host machine. Replace `<ManagedInstanceFQDN>` with the fully qualified domain name (FQDN) of the managed instance. You can copy the FQDN from the managed instance's overview page in the Azure portal.

```powershell
tnc <ManagedInstanceFQDN> -port 5022
```

A successful test shows `TcpTestSucceeded : True`. 

:::image type="content" source="./media/managed-instance-link-preparation/powershell-output-tnc-command.png" alt-text="Screenshot that shows the output of the command for testing a network connection in PowerShell.":::

If the response is unsuccessful, verify the following network settings:
- There are rules in both the network firewall *and* the Windows firewall that allow traffic to the *subnet* of SQL Managed Instance. 
- There's an NSG rule that allows communication on port 5022 for the virtual network that hosts SQL Managed Instance. 


### Test the connection from SQL Managed Instance to SQL Server

To check that SQL Managed Instance can reach SQL Server, you first create a test endpoint. Then you use the SQL Agent to run a PowerShell script with the `tnc` command pinging SQL Server on port 5022 from the managed instance.

To create a test endpoint, connect to SQL Server and run the following T-SQL script: 

```sql
-- Run on SQL Server
-- Create the certificate needed for the test endpoint
USE MASTER
CREATE CERTIFICATE TEST_CERT
WITH SUBJECT = N'Certificate for SQL Server',
EXPIRY_DATE = N'3/30/2051'
GO

-- Create the test endpoint on SQL Server
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

To verify that the SQL Server endpoint is receiving connections on port 5022, run the following PowerShell command on the host operating system of your SQL Server instance:

```powershell
tnc localhost -port 5022
```

A successful test shows `TcpTestSucceeded : True`. You can then proceed to creating a SQL Agent job on the managed instance to try testing the SQL Server test endpoint on port 5022 from the managed instance.

Next, create a SQL Agent job on the managed instance called `NetHelper` by using the public IP address or DNS name that can be resolved from the managed instance for `SQL_SERVER_ADDRESS`. Run the following T-SQL script on the managed instance: 

```sql
-- Run on the managed instance
-- SQL_SERVER_ADDRESS should be a public IP address, or the DNS name that can be resolved from the SQL Managed Instance host machine.
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


Run the SQL Agent job by running the following T-SQL command on the managed instance: 

```sql
-- Run on the managed instance
EXEC msdb.dbo.sp_start_job @job_name = N'NetHelper'
```

Run the following query on the managed instance to show the log of the SQL Agent job: 

```sql
-- Run on the managed instance
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

:::image type="content" source="./media/managed-instance-link-preparation/ssms-output-tnchelper.png" alt-text="Screenshot that shows the expected output of the NetHelper SQL Agent job.":::

Finally, drop the test endpoint and certificate on SQL Server by using the following T-SQL commands: 

```sql
-- Run on SQL Server
DROP ENDPOINT TEST_ENDPOINT
GO
DROP CERTIFICATE TEST_CERT
GO
```

If the connection is unsuccessful, verify the following items: 

- The firewall on the host SQL Server instance allows inbound and outbound communication on port 5022. 
- An NSG rule for the virtual network that hosts SQL Managed Instance allows communication on port 5022. 
- If your SQL Server instance is on an Azure VM, an NSG rule allows communication on port 5022 on the virtual network that hosts the VM.
- SQL Server is running. 

> [!CAUTION]
> Proceed with the next steps only if you've validated network connectivity between your source and target environments. Otherwise, troubleshoot network connectivity issues before proceeding.

## Migrate a certificate of a TDE-protected database

If you are migrating a database on SQL Server protected by Transparent Data Encryption to a managed instance, the corresponding encryption certificate from the on-premises or Azure VM SQL Server needs to be migrated to managed instance before using the link. For detailed steps, see [Migrate a TDE cert to a managed instance](tde-certificate-migrate.md).

## Install SSMS

SQL Server Management Studio (SSMS) v18.11.1 is the easiest way to use a SQL Managed Instance link. [Download SSMS version 18.11.1 or later](/sql/ssms/download-sql-server-management-studio-ssms) and install it to your client machine. 

After installation finishes, open SSMS and connect to your supported SQL Server instance. Right-click a user database, and validate that the **Azure SQL Managed Instance link** option appears on the menu. 

:::image type="content" source="./media/managed-instance-link-preparation/ssms-database-context-menu-managed-instance-link.png" alt-text="Screenshot that shows the Azure SQL Managed Instance link option on the context menu.":::

## Next steps

After you've prepared your environment, you're ready to start [replicating your database](managed-instance-link-use-ssms-to-replicate-database.md). To learn more, review [Link feature for Azure SQL Managed Instance](link-feature.md). 
