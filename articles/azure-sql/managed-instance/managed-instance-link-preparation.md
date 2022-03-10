---
title: Preparation for Azure SQL Managed Instance link
titleSuffix: Azure SQL Managed Instance
description: This how-to article explains how to prepare for SQL Managed Instance link.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: data-movement
ms.custom: sqldbrb=1
ms.devlang: 
ms.topic: guide
author: sasapopo
ms.author: sasapopo
ms.reviewer: mathoma
ms.date: 03/07/2022
---

# Preparation for Azure SQL Managed Instance link
[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

This article provides details on how to prepare for Azure SQL Managed Instance link.

## Pre-requirements
Ensure the following requirements are met prior to setting up the link:
- Prepare SQL resources: SQL Server instance and Azure SQL Managed Instance.
- Prepare your SQL Server instance.
- Enable network connectivity between SQL Server and Managed Instance.
- Install SSMS version 18.11.1 (or higher).

## Prepare SQL resources

To use Managed Instance link, you need to have at least one SQL Server instance, and at least one Azure SQL Managed Instance. Currently supported SQL Server versions are:
- SQL Server 2019 Enterprise Edition (EE) with CU15 (or higher).
- SQL Server 2019 Developer Edition with CU15 (or higher).

If you need to create Azure SQL Managed Instance, instructions for that are available article [Create SQL Managed Instance](./instance-create-quickstart.md).

## Prepare your SQL Server instance

The following needs to be configured on your SQL Server. A restart will be required during the process.
1. Install CU15 or higher on SQL Server 2019.
2. Enable AlwaysOn Availability Groups feature on SQL Server.
3. Enable feature Trace Flags at startup on SQL Server.
4. Restart the SQL Server and validate SQL Server configuration.

### Install CU15 (or higher) on SQL Server

Run the script to check your SQL Server version.

```sql
-- Shows the version and CU of the SQL Server
SELECT @@VERSION
```

If it'sn't SQL Server 2019 CU15 or higher, upgrade your server. SQL Server 2019 CU15 can be downloaded from [here](https://support.microsoft.com/topic/kb5008996-cumulative-update-15-for-sql-server-2019-4b6a8ee9-1c61-482d-914f-36e429901fb6). Install the CU15 upgrade and restart the SQL Server.

### Enable AlwaysOn Availability Groups feature on SQL Server

Run the following T-SQL on SQL Server to understand if AlwaysOn is enabled.

```sql
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

If AlwaysOn isn't enabled, then you'll need to enable it. You can find official detailed instructions for this process [here](https://docs.microsoft.com/sql/database-engine/availability-groups/windows/enable-and-disable-always-on-availability-groups-sql-server). In the following paragraphs, we'll explain how Always On can be enabled.

To enable AlwaysOn on a SQL Server, you need to start the **SQL Server Configuration Manager**, go to the **SQL Server Services** properties, and enable **AlwaysOn High Availability**:
1. Start SQL Server Configuration Manager.
2. Select on the SQL Server Services.
3. Right-select on the SQL Server, then go Properties.

    :::image type="content" source="./media/managed-instance-link-preparation/sql-server-configuration-manager-sql-server-properties.png" alt-text="Screenshot showing S Q L Server configuration manager.":::

4. On SQL Server Configuration Manager properties window, select the AlwaysOn High Availability tab.
5. Use the Checkbox to enable AlwaysOn Availability Groups.
6. Select OK.

    :::image type="content" source="./media/managed-instance-link-preparation/always-on-availability-groups-properties.png" alt-text="Screenshot showing always on availability groups properties.":::

7. A dialog notification will say SQL Server service needs to be restarted for changes to take place.
8. Close the dialog (select OK)
9. Restart the SQL Service now. Alternatively, you can postpone server restart to be the final step.

### Enable feature Trace Flags at startup on SQL Server

For optimal performance of Manage Instance link feature, it's highly recommended to enable 1800 and 9567. Here are details on these trace flags and their functionality:
- 1800 – Highly recommended. This trace flag enables SQL Server optimization when disks of different sector sizes are used for primary and secondary replica log files, in SQL Server AlwaysOn environments. This trace flag improves performance on SQL Server instances with transaction log file residing on disk with sector size of 512 bytes. It isn't required to be enabled on disk with 4k sector sizes. For more information, see [KB3009974](https://support.microsoft.com/topic/kb3009974-fix-slow-synchronization-when-disks-have-different-sector-sizes-for-primary-and-secondary-replica-log-files-in-sql-server-ag-and-logshipping-environments-ed181bf3-ce80-b6d0-f268-34135711043c).
- 9567 – Highly recommended for large databases. This trace flag enables compression of the data stream for AlwaysOn Availability Groups during automatic seeding. Compression can significantly reduce the transfer time during automatic seeding and will increase the load on the processor.

Detailed official instructions for enabling SQL Server trace flags can be found [here](https://docs.microsoft.com/sql/t-sql/database-console-commands/dbcc-traceon-transact-sql). In the following paragraphs, we'll describe how traceflags can be set.
Recommended way to enable trace flags, which will persist through the SQL Server restart, is through the SQL Server Configuration Manager.
To enable the trace flags on a SQL Server, follow the steps:
1. Start SQL Server Configuration Manager.
2. Select SQL Server Services.
3. Open the SQL Server context menu, then select Properties.
    :::image type="content" source="./media/managed-instance-link-preparation/sql-server-configuration-manager-sql-server-properties.png" alt-text="Screenshot showing S Q L Server configuration manager.":::
4. Go to **Startup Parameters** tab.
5. Enter trace flag -T1800 and select Add button.
6. Enter trace flag -T9567 and select Add button.
7. Select OK.

    :::image type="content" source="./media/managed-instance-link-preparation/startup-parameters-properties.png" alt-text="Screenshot showing Startup parameter properties.":::

### Restart the SQL Server and validate SQL Server configuration.

After performing the above configuration steps, restart your SQL Server. To do this, go to SQL Server Configuration Manager, right select on the SQL Server, and then go Restart.
    :::image type="content" source="./media/managed-instance-link-preparation/sql-server-configuration-manager-sql-server-restart.png" alt-text="Screenshot showing S Q L Server restart command call.":::

After the restart use these steps to validate that SQL Server configuration has been successfully completed. With the following T-SQL you'll verify that you're running:
- Supported version of SQL Server
- Hadron AlwaysOn is enabled
- Recommended trace flags are turned on

Execute the following T-SQL query:
```sql
-- Shows the version and CU of the SQL Server
SELECT @@VERSION

-- Shows if AlwaysOn feature is enabled on SQL Server
SELECT SERVERPROPERTY ('IsHadrEnabled')

-- Lists all trace flags enabled on the SQL Server
DBCC TRACESTATUS
```
Below is an example of expected output for SQL Server 2019 with CU15.
    :::image type="content" source="./media/managed-instance-link-preparation/ssms-results-expected-outcome.png" alt-text="Screenshot showing expected outcome in S S M S.":::

## Enabling network connectivity between SQL Server and Managed Instance 

For Managed Instance link to work, network connectivity between the SQL Server and Managed Instance needs exists. Depending on where the SQL Server resides (on-premises, or in a VM), there are a couple of options to consider that will be covered in the following paragraphs.

### SQL Server in Azure (VNet)

If you can deploy SQL Server in Azure VM in the same Azure VNet that is hosting SQL Managed Instance, there will be network connectivity between the two servers. See detailed tutorial how to [Deploy and configure an Azure VM to connect to Azure SQL Managed Instance](./connect-vm-instance-configure.md).

> [!TIP]
> The easiest way to use the Managed Instance Link is through provisioning a new SQL Server 2019 VM into the same VNET where your Managed Instance is deployed. The VM will be placed in the same virtual network as Managed Instance. 

In case our SQL Server in Azure VM is deployed on another Azure VNet use [Global VNet peering](https://techcommunity.microsoft.com/t5/azure-sql/new-feature-global-vnet-peering-support-for-azure-sql-managed/ba-p/1746913) to connect the two Azure VNETs. Note that Global VNET peering is available to Managed Instances provisioned since November 2020 and onwards out of the box. In case you're using an older Managed Instance, raise a support ticket to have Global VNET peering enabled.

### SQL Server outside of Azure (VNet)

In case that you're using SQL Server isn't within Azure VNet, a VPN connection needs to be established. Here are available options:
- [Site-to-site virtual private network (VPN) connection](https://docs.microsoft.com/office365/enterprise/connect-an-on-premises-network-to-a-microsoft-azure-virtual-network)
- [Azure Express Route connection](https://azure.microsoft.com/services/expressroute/)

> [!TIP]
> For the best networking performance in replicating data, we recommend Azure Express Route connection. Please ensure to provision a gateway of a sufficiently large bandwidth for your use case.

### Open network ports between the environments

Inbound and outbound network ports need to be allowed on SQL Server and SQL Managed Instance environments to enable bidirectional communication.
Here are instructions on how to open the following network ports on both environments.

|Environment                      |What to do                                                                                                                                                                                             |
|:--------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|SQL Server environment           |Open the inbound port 5022 on the network firewall guarding the SQL Server to the entire subnet of SQL Managed Instance. If necessary, to the same on the Windows firewall hosting the SQL Server. |
|SQL Managed Instance environment |Open NSG in Azure portal for inbound port 5022 to the IP address of the SQL Server.                                                                                                                    |

On SQL Server host machine, ports can be allowed in Windows firewall with following PowerShell script.
```powershell
New-NetFirewallRule -DisplayName "Allow TCP port 5022 inbound" -Direction inbound -Profile Any -Action Allow -LocalPort 5022 -Protocol TCP
New-NetFirewallRule -DisplayName "Allow TCP port 5022 outbound" -Direction outbound -Profile Any -Action Allow -LocalPort 5022 -Protocol TCP
```

On Azure portal open Network Security Group for the Subnet of the VNet that is hosting the Managed Instance, and allow inbound and outbound traffic on port 5022.
The port 5022 is a standard port used for AlwaysOn High Availability data replication for the SQL Server. The same port is used for Availability group and Distributed Availability Group connectivity. This port can't be changed or customized.

### Test bidirectional network connectivity on the port 5022

Network connectivity through the port 5022 needs to work from SQL Server to Managed Instance, and vice versa. The following process will test connectivity and verify that firewall ports are opened on the SQL Server side, and Network Security Groups (NSGs) are configured for the Azure SQL Managed Instance or SQL Server in Azure SQL VM.

#### Verify the network connectivity from SQL Server to SQL Managed Instance

To check if SQL Server can reach Managed Instance use `tnc` command in PowerShell from SQL Server host machine. Replace <ManagedInstanceFQDN> with the fully qualified domain name of Azure SQL Managed Instance.

```powershell
tnc <ManagedInstanceFQDN> -port 5022
```

Successful test will show TcpTestSucceeded True.

:::image type="content" source="./media/managed-instance-link-preparation/powershell-output-tnc-command.png" alt-text="Screenshot showing output of T N C command in PowerShell.":::

If there is unsuccessful response, here is what you can check:
- Are NSG rules allowing communication on port 5022?

#### Verify the network connectivity from SQL Managed Instance to SQL Server

To check if Managed Instance can reach SQL Server create a test endpoint and use the SQL Agent PowerShell script with `tnc` command pinging SQL Server on the port 5022.

Connect to the Managed Instance and execute following T-SQL to create test endpoint.

```sql
-- Create certificate needed for the test endpoint
USE MASTER
CREATE CERTIFICATE TEST_CERT
WITH SUBJECT = N'Certificate for SQL Server',
EXPIRY_DATE = N'3/30/2051'
GO

-- Create test endpoint
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

Connect to Managed Instance and execute following T-SQL to create new SQL Agent job called “NetHelper”.

```sql
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

Execute the agent job by running the following T-SQL command.
```sql
EXEC msdb.dbo.sp_start_job @job_name = N'NetHelper'
```

Execute the following query to show the log of the Agent job.

```sql
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

If the connection is successful, the log will show True, otherwise False.

:::image type="content" source="./media/managed-instance-link-preparation/ssms-output-tnchelper.png" alt-text="Screenshot showing expected output of NetHelper S Q L Agent job.":::

Finally, drop the test endpoint and certificate.

```sql
DROP ENDPOINT TEST_ENDPOINT
GO
DROP CERTIFICATE TEST_CERT
GO
```

If the log doesn't show True, here is what you can check:
- Is firewall on SQL Server host allowing inbound and outbound communication on port 5022?
- Are Managed Instance NSGs allowing communication on port 5022?
- If SQL Server is hosted on Azure SQL VM, are Azure SQL VM NSGs allowing communication on port 5022?
- Is SQL Server running?

With this, we've verified that there is bidirectional network connectivity on the port 5022 between SQL Server and SQL Managed Instance.

> [!IMPORTANT]
> Only if the network connectivity check has passed, proceed with the next steps. Otherwise, please troubleshoot networking connectivity issues first before proceeding any further.

## Install SSMS with Managed Instance link functionality

SSMS with Managed Instance link wizard is the easiest and the most recommended way to use Managed Instance link. Download SSMS version 18.11.1 (or newer) from this [link](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) and install it on your client machine.
Once the installation is complete, start SSMS and connect to SQL Server that is prepared for Managed Instance link. In the context menu of a user database, you'll find “Azure SQL Managed Instance link” option.

:::image type="content" source="./media/managed-instance-link-preparation/ssms-database-context-menu-managed-instance-link.png" alt-text="Screenshot showing Azure S Q L Managed Instance link option in the context menu.":::

## Next steps

For more information about Managed Instance link feature, see the following resources:

- [Managed Instance link feature](./link-feature.md)