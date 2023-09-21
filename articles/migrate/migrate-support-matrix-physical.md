---
title: Support for physical discovery and assessment in Azure Migrate
description: Learn about support for physical discovery and assessment with Azure Migrate Discovery and assessment
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 05/15/2023
ms.custom: engagement-fy23
---

# Support matrix for physical server discovery and assessment 

This article summarizes prerequisites and support requirements when you assess physical servers for migration to Azure, using the [Azure Migrate: Discovery and assessment](migrate-services-overview.md#azure-migrate-discovery-and-assessment-tool) tool. If you want to migrate physical servers to Azure, review the [migration support matrix](migrate-support-matrix-physical-migration.md).

To assess physical servers, you create a project, and add the Azure Migrate: Discovery and assessment tool to the project. After adding the tool, you deploy the [Azure Migrate appliance](migrate-appliance.md). The appliance continuously discovers on-premises servers, and sends servers metadata and performance data to Azure. After discovery is complete, you gather discovered servers into groups, and run an assessment for a group.

## Limitations

**Support** | **Details**
--- | ---
**Assessment limits** | You can discover and assess up to 35,000 physical servers in a single [project](migrate-support-matrix.md#project).
**Project limits** | You can create multiple projects in an Azure subscription. In addition to physical servers, a project can include servers on VMware and on Hyper-V, up to the assessment limits for each.
**Discovery** | The Azure Migrate appliance can discover up to 1000 physical servers.
**Assessment** | You can add up to 35,000 servers in a single group.<br/><br/> You can assess up to 35,000 servers in a single assessment.

[Learn more](concepts-assessment-calculation.md) about assessments.

## Physical server requirements

**Physical server deployment:** The physical server can be standalone or deployed in a cluster.

**Type of servers:** Bare metal servers, virtualized servers running on-premises or other clouds like AWS, GCP, Xen etc.
> [!Note]
> Currently, Azure Migrate does not support the discovery of para-virtualized servers.

**Operating system:** All Windows and Linux operating systems can be assessed for migration.

## Permissions for Windows server

For Windows servers, use a domain account for domain-joined servers, and a local account for servers that aren't domain-joined. The user account can be created in one of the two ways:

### Option 1

- Create an account that has administrator privileges on the servers. Use this account to pull configuration and performance data through CIM connection and perform software inventory (discovery of installed applications) and enable agentless dependency analysis using PowerShell remoting.

> [!Note]
> If you want to perform software inventory (discovery of installed applications) and enable agentless dependency analysis on Windows servers, it recommended to use Option 1.

### Option 2
- Add the user account to these groups: Remote Management Users, Performance Monitor Users, and Performance Log Users.
- If Remote management Users group isn't present, then add user account to the group: **WinRMRemoteWMIUsers_**.
- The account needs these permissions for appliance to create a CIM connection with the server and pull the required configuration and performance metadata from the WMI classes listed here.
- In some cases, adding the account to these groups may not return the required data from WMI classes as the account might be filtered by [UAC](/windows/win32/wmisdk/user-account-control-and-wmi). To overcome the UAC filtering, user account needs to have necessary permissions on CIMV2 Namespace and sub-namespaces on the target server. You can follow the steps [here](troubleshoot-appliance.md) to enable the required permissions.

> [!Note]
> For Windows Server 2008 and 2008 R2, ensure that WMF 3.0 is installed on the servers.

> [!Note]
> To discover SQL Server databases on Windows Servers, both Windows and SQL Server authentication are supported. You can provide credentials of both authentication types in the appliance configuration manager. Azure Migrate requires a Windows user account that is a member of the sysadmin server role.

## Permissions for Linux server

For Linux servers, based on the features you want to perform, you can create a user account in one of two ways:

### Option 1
- You need a sudo user account on the servers that you want to discover. Use this account to pull configuration and performance metadata, perform software inventory (discovery of installed applications) and enable agentless dependency analysis using SSH connectivity.
- You need to enable sudo access on /usr/bin/bash to execute the commands listed [here](discovered-metadata.md#linux-server-metadata). In addition to these commands, the user account also needs to have permissions to execute ls and netstat commands to perform agentless dependency analysis.
- Make sure that you have enabled **NOPASSWD** for the account to run the required commands without prompting for a password every time sudo command is invoked.
- Azure Migrate supports the following Linux OS distributions for discovery using an account with sudo access:

    Operating system | Versions
    --- | ---
    Red Hat Enterprise Linux | 5.1, 5.3, 5.11, 6.x, 7.x, 8.x
    Cent OS | 5.1, 5.9, 5.11, 6.x, 7.x, 8.x
    Ubuntu | 12.04, 14.04, 16.04, 18.04, 20.04
    Oracle Linux | 6.1, 6.7, 6.8, 6.9, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8, 8.1, 8.3, 8.5
    SUSE Linux | 10, 11 SP4, 12 SP1, 12 SP2, 12 SP3, 12 SP4, 15 SP2, 15 SP3
    Debian | 7, 8, 9, 10, 11
    Amazon Linux | 2.0.2021
    CoreOS Container | 2345.3.0

> [!Note]
> If you want to perform software inventory (discovery of installed applications) and enable agentless dependency analysis on Linux servers, it's recommended to use Option 1.

### Option 2
- If you can't provide root account or user account with sudo access, then you can set 'isSudo' registry key to value '0' in HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\AzureAppliance registry on appliance server and provide a non-root account with the required capabilities using the following commands:

    **Command** | **Purpose**
    --- | --- |
    setcap CAP_DAC_READ_SEARCH+eip /usr/sbin/fdisk <br></br> setcap CAP_DAC_READ_SEARCH+eip /sbin/fdisk _(if /usr/sbin/fdisk is not present)_ | To collect disk configuration data
    setcap "cap_dac_override,cap_dac_read_search,cap_fowner,cap_fsetid,cap_setuid,<br> cap_setpcap,cap_net_bind_service,cap_net_admin,cap_sys_chroot,cap_sys_admin,<br> cap_sys_resource,cap_audit_control,cap_setfcap=+eip" /sbin/lvm | To collect disk performance data
    setcap CAP_DAC_READ_SEARCH+eip /usr/sbin/dmidecode | To collect BIOS serial number
    chmod a+r /sys/class/dmi/id/product_uuid | To collect BIOS GUID

- To perform agentless dependency analysis on the server, ensure that you also set the required permissions on /bin/netstat and /bin/ls files by using the following commands:<br /><code>sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/ls<br /> sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/netstat</code>

## Azure Migrate appliance requirements

Azure Migrate uses the [Azure Migrate appliance](migrate-appliance.md) for discovery and assessment. The appliance for physical servers can run on a VM or a physical server.

- Learn about [appliance requirements](migrate-appliance.md#appliance---physical) for physical servers.
- Learn about URLs that the appliance needs to access in [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.
- You set up the appliance using a [PowerShell script](how-to-set-up-appliance-physical.md) that you download from the Azure portal.
In Azure Government, deploy the appliance [using this script](deploy-appliance-script-government.md).

## Port access

The following table summarizes port requirements for assessment.

**Device** | **Connection**
--- | ---
**Appliance** | Inbound connections on TCP port 3389, to allow remote desktop connections to the appliance.<br/><br/> Inbound connections on port 44368, to remotely access the appliance management app using the URL: ``` https://<appliance-ip-or-name>:44368 ```<br/><br/> Outbound connections on ports 443 (HTTPS), to send discovery and performance metadata to Azure Migrate.
**Physical servers** | **Windows:** Inbound connection on WinRM port 5985 (HTTP) to pull configuration and performance metadata from Windows servers. <br/><br/> **Linux:**  Inbound connections on port 22 (TCP), to pull configuration and performance metadata from Linux servers. |

## Software inventory requirements

In addition to discovering servers, Azure Migrate: Discovery and assessment can perform software inventory on servers. Software inventory provides the list of applications, roles and features running on Windows and Linux servers, discovered using Azure Migrate. It helps you to identify and plan a migration path tailored for your on-premises workloads.

Support | Details
--- | ---
**Supported servers** | You can perform software inventory on up to 1,000 servers discovered from each Azure Migrate appliance.
**Operating systems** | Servers running all Windows and Linux versions that meet the server requirements and have the required access permissions are supported.
**Server requirements** | Windows servers must have PowerShell remoting enabled and PowerShell version 2.0 or later installed. <br/><br/> WMI must be enabled and available on Windows servers to gather the details of the roles and features installed on the servers.<br/><br/> Linux servers must have SSH connectivity enabled and ensure that the following commands can be executed on the Linux servers to pull the application data: list, tail, awk, grep, locate, head, sed, ps, print, sort, uniq. Based on the OS type and the type of package manager used, here are some additional commands: rpm/snap/dpkg, yum/apt-cache, mssql-server.
**Windows server access** | A guest user account for Windows servers
**Linux server access** | A standard user account (non-`sudo` access) for all Linux servers
**Port access** | For Windows server, need access on port 5985 (HTTP) and for Linux servers, need access on port 22(TCP).
**Discovery** | Software inventory is performed by directly connecting to the servers using the server credentials added on the appliance. <br/><br/> The appliance gathers the information about the software inventory from Windows servers using PowerShell remoting and from Linux servers using SSH connection. <br/><br/> Software inventory is agentless. No agent is installed on the servers.

## SQL Server instance and database discovery requirements

[Software inventory](how-to-discover-applications.md) identifies SQL Server instances. Using this information, the appliance attempts to connect to respective SQL Server instances through the Windows authentication or SQL Server authentication credentials provided in the appliance configuration manager. Appliance can connect to only those SQL Server instances to which it has network line of sight, whereas software inventory by itself may not need network line of sight.

After the appliance is connected, it gathers configuration and performance data for SQL Server instances and databases. The appliance updates the SQL Server configuration data once every 24 hours and captures the Performance data every 30 seconds.

Support | Details
--- | ---
**Supported servers** | supported only for servers running SQL Server in your VMware, Microsoft Hyper-V, and Physical/Bare metal environments as well as IaaS Servers of other public clouds such as AWS, GCP, etc. <br /><br /> You can discover up to 750 SQL Server instances or 15,000 SQL databases, whichever is less, from a single appliance. It is recommended that you ensure that an appliance is scoped to discover less than 600 servers running SQL to avoid scaling issues.
**Windows servers** | Windows Server 2008 and later are supported.
**Linux servers** | Currently not supported.
**Authentication mechanism** | Both Windows and SQL Server authentication are supported. You can provide credentials of both authentication types in the appliance configuration manager.
**SQL Server access** | To discover SQL Server instances and databases, the Windows or SQL Server account must be a member of the sysadmin server role or have [these permissions](#configure-the-custom-login-for-sql-server-discovery) for each SQL Server instance.
**SQL Server versions** | SQL Server 2008 and later are supported.
**SQL Server editions** | Enterprise, Standard, Developer, and Express editions are supported.
**Supported SQL configuration** | Discovery of standalone, highly available, and disaster protected SQL deployments is supported. Discovery of HADR SQL deployments powered by Always On Failover Cluster Instances and Always On Availability Groups is also supported.
**Supported SQL services** | Only SQL Server Database Engine is supported. <br /><br /> Discovery of SQL Server Reporting Services (SSRS), SQL Server Integration Services (SSIS), and SQL Server Analysis Services (SSAS) isn't supported.

> [!NOTE]
> By default, Azure Migrate uses the most secure way of connecting to SQL instances i.e. Azure Migrate encrypts communication between the Azure Migrate appliance and the source SQL Server instances by setting the TrustServerCertificate property to `true`. Additionally, the transport layer uses SSL to encrypt the channel and bypass the certificate chain to validate trust. Hence, the appliance server must be set up to trust the certificate's root authority. 
>
> However, you can modify the connection settings, by selecting **Edit SQL Server connection properties** on the appliance.[Learn more](/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine) to understand what to choose.

### Configure the custom login for SQL Server discovery

The following are sample scripts for creating a login and provisioning it with the necessary permissions.

#### Windows Authentication 
  
  ```sql
  -- Create a login to run the assessment
  use master;
	  DECLARE @SID NVARCHAR(MAX) = N'';
    CREATE LOGIN [MYDOMAIN\MYACCOUNT] FROM WINDOWS;
	SELECT @SID = N'0x'+CONVERT(NVARCHAR, sid, 2) FROM sys.syslogins where name = 'MYDOMAIN\MYACCOUNT'
	IF (ISNULL(@SID,'') != '')
		PRINT N'Created login [MYDOMAIN\MYACCOUNT] with SID = ' + @SID
	ELSE
		PRINT N'Login creation failed'
  GO    
 
  -- Create user in every database other than tempdb and model and provide minimal read-only permissions. 
  use master;
    EXECUTE sp_MSforeachdb 'USE [?]; IF (''?'' NOT IN (''tempdb'',''model''))  BEGIN TRY CREATE USER [MYDOMAIN\MYACCOUNT] FOR LOGIN [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH'
    EXECUTE sp_MSforeachdb 'USE [?]; IF (''?'' NOT IN (''tempdb'',''model''))  BEGIN TRY GRANT SELECT ON sys.sql_expression_dependencies TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH'
    EXECUTE sp_MSforeachdb 'USE [?]; IF (''?'' NOT IN (''tempdb'',''model''))  BEGIN TRY GRANT VIEW DATABASE STATE TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH'
  GO
 
  -- Provide server level read-only permissions
  use master;
    BEGIN TRY GRANT SELECT ON sys.sql_expression_dependencies TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT EXECUTE ON OBJECT::sys.xp_regenumkeys TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT VIEW DATABASE STATE TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT VIEW SERVER STATE TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT VIEW ANY DEFINITION TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
  GO
 
  -- Required from SQL 2014 onwards for database connectivity.
  use master;
    BEGIN TRY GRANT CONNECT ANY DATABASE TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
  GO
 
  -- Provide msdb specific permissions
  use msdb;
    BEGIN TRY GRANT EXECUTE ON [msdb].[dbo].[agent_datetime] TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[sysjobsteps] TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[syssubsystems] TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[sysjobhistory] TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[syscategories] TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[sysjobs] TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[sysmaintplan_plans] TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[syscollector_collection_sets] TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[sysmail_profile] TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[sysmail_profileaccount] TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[sysmail_account] TO [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
  GO
 
  -- Clean up
  --use master;
  -- EXECUTE sp_MSforeachdb 'USE [?]; BEGIN TRY DROP USER [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;'
  -- BEGIN TRY DROP LOGIN [MYDOMAIN\MYACCOUNT] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
  --GO
   ```

#### SQL Server Authentication
  
   ```sql
  -- Create a login to run the assessment
  use master;
	-- NOTE: SQL instances that host replicas of Always On Availability Groups must use the same SID for the SQL login. 
	  -- After the account is created in one of the members, copy the SID output from the script and include this value 
	  -- when executing against the remaining replicas.
	  -- When the SID needs to be specified, add the value to the @SID variable definition below.
    DECLARE @SID NVARCHAR(MAX) = N'';
	IF (@SID = N'')
	BEGIN
		CREATE LOGIN [evaluator]
			WITH PASSWORD = '<provide a strong password>'
	END
	ELSE
	BEGIN
		DECLARE @SQLString NVARCHAR(500) = 'CREATE LOGIN [evaluator]
			WITH PASSWORD = ''<provide a strong password>''
			, SID = '+@SID 
    EXEC SP_EXECUTESQL @SQLString
	END
	SELECT @SID = N'0x'+CONVERT(NVARCHAR(35), sid, 2) FROM sys.syslogins where name = 'evaluator'
	IF (ISNULL(@SID,'') != '')
		PRINT N'Created login [evaluator] with SID = '''+ @SID +'''. If this instance hosts any Always On Availability Group replica, use this SID value when executing the script against the instances hosting the other replicas'
	ELSE
		PRINT N'Login creation failed'
  GO    
 
  -- Create user in every database other than tempdb and model and provide minimal read-only permissions. 
  use master;
    EXECUTE sp_MSforeachdb 'USE [?]; IF (''?'' NOT IN (''tempdb'',''model''))  BEGIN TRY CREATE USER [evaluator] FOR LOGIN [evaluator]END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH'
    EXECUTE sp_MSforeachdb 'USE [?]; IF (''?'' NOT IN (''tempdb'',''model''))  BEGIN TRY GRANT SELECT ON sys.sql_expression_dependencies TO [evaluator]END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH'
    EXECUTE sp_MSforeachdb 'USE [?]; IF (''?'' NOT IN (''tempdb'',''model''))  BEGIN TRY GRANT VIEW DATABASE STATE TO [evaluator]END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH'
  GO
 
  -- Provide server level read-only permissions
  use master;
    BEGIN TRY GRANT SELECT ON sys.sql_expression_dependencies TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT EXECUTE ON OBJECT::sys.xp_regenumkeys TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT VIEW DATABASE STATE TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT VIEW SERVER STATE TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT VIEW ANY DEFINITION TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
  GO
 
  -- Required from SQL 2014 onwards for database connectivity.
  use master;
    BEGIN TRY GRANT CONNECT ANY DATABASE TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
  GO
 
  -- Provide msdb specific permissions
  use msdb;
    BEGIN TRY GRANT EXECUTE ON [msdb].[dbo].[agent_datetime] TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[sysjobsteps] TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[syssubsystems] TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[sysjobhistory] TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[syscategories] TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[sysjobs] TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[sysmaintplan_plans] TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[syscollector_collection_sets] TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[sysmail_profile] TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[sysmail_profileaccount] TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
    BEGIN TRY GRANT SELECT ON [msdb].[dbo].[sysmail_account] TO [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
  GO
 
  -- Clean up
  --use master;
  -- EXECUTE sp_MSforeachdb 'USE [?]; BEGIN TRY DROP USER [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;'
  -- BEGIN TRY DROP LOGIN [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
  --GO
   ```

## Web apps discovery requirements

[Software inventory](how-to-discover-applications.md) identifies web server role existing on discovered servers. If a server is found to have a web server installed, Azure Migrate discovers web apps on the server.
The user can add both domain and non-domain credentials on the appliance. Ensure that the account used has local admin privileges on source servers. Azure Migrate automatically maps credentials to the respective servers, so one doesn’t have to map them manually. Most importantly, these credentials are never sent to Microsoft and remain on the appliance running in the source environment.
After the appliance is connected, it gathers configuration data for ASP.NET web apps(IIS web server) and Java web apps(Tomcat servers). Web apps configuration data is updated once every 24 hours.

Support | ASP.NET web apps | Java web apps
--- | --- | ---
**Stack** | VMware, Hyper-V, and Physical servers | VMware, Hyper-V, and Physical servers
**Windows servers** | Windows Server 2008 R2 and later are supported. | Not supported.
**Linux servers** | Not supported. | Ubuntu Linux 16.04/18.04/20.04, Debian 7/8, CentOS 6/7, Red Hat Enterprise Linux 5/6/7. 
**Web server versions** | IIS 7.5 and later. | Tomcat 8 or later.
**Required privileges** | local admin | root or sudo user 

> [!NOTE]
> Data is always encrypted at rest and during transit.

## Dependency analysis requirements (agentless)

[Dependency analysis](concepts-dependency-visualization.md) helps you analyze the dependencies between the discovered servers, which can be easily visualized with a map view in Azure Migrate project and can be used to group related servers for migration to Azure. The following table summarizes the requirements for setting up agentless dependency analysis:

Support | Details
--- | ---
**Supported servers** | You can enable agentless dependency analysis on up to 1000 servers, discovered per appliance.
**Operating systems** | Servers running all Windows and Linux versions that meet the server requirements and have the required access permissions are supported.
**Server requirements** | Windows servers must have PowerShell remoting enabled and PowerShell version 2.0 or later installed. <br/><br/> Linux servers must have SSH connectivity enabled and ensure that the following commands can be executed on the Linux servers: touch, chmod, cat, ps, grep, echo, sha256sum, awk, netstat, ls, sudo, dpkg, rpm, sed, getcap, which, date
**Windows server access** | A user account (local or domain) with administrator permissions on servers.
**Linux server access** | Sudo user account with permissions to execute ls and netstat commands. If you're providing a sudo user account, ensure that you have enabled NOPASSWD for the account to run the required commands without prompting for a password every time sudo command is invoked. <br/> <br/> Alternatively, you can create a user account that has the CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE permissions on /bin/netstat and /bin/ls files, set using the following commands: <br/><br/> <code>sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep usr/bin/ls</code><br /><code>sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep usr/bin/netstat</code>
**Port access** | For Windows server, need access on port 5985 (HTTP) and for Linux servers, need access on port 22(TCP).
**Discovery method** |  Agentless dependency analysis is performed by directly connecting to the servers using the server credentials added on the appliance. <br/><br/> The appliance gathers the dependency information from Windows servers using PowerShell remoting and from Linux servers using SSH connection. <br/><br/> No agent is installed on the servers to pull dependency data.


## Agent-based dependency analysis requirements

[Dependency analysis](concepts-dependency-visualization.md) helps you to identify dependencies between on-premises servers that you want to assess and migrate to Azure. The table summarizes the requirements for setting up agent-based dependency analysis. Currently only agent-based dependency analysis is supported for physical servers.

**Requirement** | **Details**
--- | ---
**Before deployment** | You should have a project in place, with the Azure Migrate: Discovery and assessment tool added to the project.<br/><br/>  You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises servers<br/><br/> [Learn how](create-manage-projects.md) to create a project for the first time.<br/> [Learn how](how-to-assess.md) to add an assessment tool to an existing project.<br/> Learn how to set up the Azure Migrate appliance for assessment of [Hyper-V](how-to-set-up-appliance-hyper-v.md), [VMware](how-to-set-up-appliance-vmware.md), or physical servers.
**Azure Government** | Dependency visualization isn't available in Azure Government.
**Log Analytics** | Azure Migrate uses the [Service Map](/previous-versions/azure/azure-monitor/vm/service-map) solution in [Azure Monitor logs](../azure-monitor/logs/log-query-overview.md) for dependency visualization.<br/><br/> You associate a new or existing Log Analytics workspace with a project. The workspace for a project can't be modified after it's added. <br/><br/> The workspace must be in the same subscription as the project.<br/><br/> The workspace must reside in the East US, Southeast Asia, or West Europe regions. Workspaces in other regions can't be associated with a project.<br/><br/> The workspace must be in a region in which [Service Map is supported](../azure-monitor/vm/vminsights-configure-workspace.md#supported-regions).<br/><br/> In Log Analytics, the workspace associated with Azure Migrate is tagged with the Migration Project key, and the project name.
**Required agents** | On each server you want to analyze, install the following agents:<br/><br/> The [Microsoft Monitoring agent (MMA)](../azure-monitor/agents/agent-windows.md).<br/> The [Dependency agent](../azure-monitor/vm/vminsights-dependency-agent-maintenance.md).<br/><br/> If on-premises servers aren't connected to the internet, you need to download and install Log Analytics gateway on them.<br/><br/> Learn more about installing the [Dependency agent](how-to-create-group-machine-dependencies.md#install-the-dependency-agent) and [MMA](how-to-create-group-machine-dependencies.md#install-the-mma).
**Log Analytics workspace** | The workspace must be in the same subscription a project.<br/><br/> Azure Migrate supports workspaces residing in the East US, Southeast Asia, and West Europe regions.<br/><br/>  The workspace must be in a region in which [Service Map is supported](../azure-monitor/vm/vminsights-configure-workspace.md#supported-regions).<br/><br/> The workspace for a project can't be modified after adding it.
**Costs** | The Service Map solution doesn't incur any charges for the first 180 days (from the day that you associate the Log Analytics workspace with the project).<br/><br/> After 180 days, standard Log Analytics charges will apply.<br/><br/> Using any solution other than Service Map in the associated Log Analytics workspace incurs [standard charges](https://azure.microsoft.com/pricing/details/log-analytics/) for Log Analytics.<br/><br/> When the project is deleted, the workspace isn't deleted along with it. After deleting the project, Service Map usage isn't free, and each node will be charged as per the paid tier of Log Analytics workspace/<br/><br/>If you have projects that you created before Azure Migrate general availability (GA - 28 February 2018), you might have incurred additional Service Map charges. To ensure payment after 180 days only, we recommend that you create a new project since existing workspaces before GA are still chargeable.
**Management** | When you register agents to the workspace, you use the ID and key provided by the project.<br/><br/> You can use the Log Analytics workspace outside Azure Migrate.<br/><br/> If you delete the associated project, the workspace isn't deleted automatically. [Delete it manually](../azure-monitor/logs/manage-access.md).<br/><br/> Don't delete the workspace created by Azure Migrate, unless you delete the project. If you do, the dependency visualization functionality won't work as expected.
**Internet connectivity** | If servers aren't connected to the internet, you need to install the Log Analytics gateway on them.
**Azure Government** | Agent-based dependency analysis isn't supported.

## Next steps

[Prepare for physical Discovery and assessment](./tutorial-discover-physical.md).
