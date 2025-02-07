---
title: VMware server discovery support in Azure Migrate and Modernize
description: Learn about Azure Migrate and Modernize discovery and assessment support for servers in a VMware environment.
author: Vikram1988
ms.author: vibansa
ms.manager: abhemraj
ms.topic: conceptual
ms.service: azure-migrate
ms.date: 02/04/2025
ms.custom: vmware-scenario-422, engagement-fy24
---

# Support matrix for VMware discovery

This article summarizes prerequisites and support requirements for using the [Azure Migrate: Discovery and assessment](../migrate-services-overview.md) tool to discover and assess servers in a VMware environment for migration to Azure.

[!INCLUDE [scenario-banner.md](../includes/scenario-banner.md)]

To assess servers, first, create an Azure Migrate project. The Azure Migrate: Discovery and assessment tool is automatically added to the project. Then, deploy the Azure Migrate appliance. The appliance continuously discovers on-premises servers and sends configuration and performance metadata to Azure. When discovery is finished, gather the discovered servers into groups and run assessments per group.

As you plan your migration of VMware servers to Azure, see the [migration support matrix](../migrate-support-matrix-vmware-migration.md).


## VMware requirements

VMware | Details
--- | ---
vCenter Server | Servers that you want to discover and assess must be managed by vCenter Server version 8.0, 7.0, 6.7, 6.5, 6.0, or 5.5.<br /><br /> Discovering servers by providing ESXi host details in the appliance currently isn't supported. <br /><br /> IPv6 addresses aren't supported for vCenter Server (for discovery and assessment of servers) and ESXi hosts (for replication of servers).
Permissions | The Azure Migrate: Discovery and assessment tool requires a vCenter Server read-only account.<br /><br /> If you want to use the tool for software inventory, agentless dependency analysis, web apps, and SQL discovery, the account must have privileges for guest operations on VMware virtual machines (VMs).


## Server requirements

VMware | Details
--- | ---
Operating systems | All Windows and Linux operating systems can be assessed for migration.
Storage | Disks attached to SCSI, IDE, and SATA-based controllers are supported.


## Azure Migrate appliance requirements

Azure Migrate and Modernize uses the [Azure Migrate appliance](../migrate-appliance.md) for discovery and assessment. You can deploy the appliance as a server in your VMware environment by using a VMware Open Virtualization Appliance template imported into vCenter Server. You can also use a [PowerShell script](../deploy-appliance-script.md). Learn more about [appliance requirements for VMware](../migrate-appliance.md#appliance---vmware).

Here are more requirements for the appliance:

- In Azure Government, you must deploy the appliance by using a [script](../deploy-appliance-script-government.md).
- The appliance must be able to access specific URLs in [public clouds](../migrate-appliance.md#public-cloud-urls) and [government clouds](../migrate-appliance.md#government-cloud-urls).

## Port access requirements

Device | Connection
--- | ---
Azure Migrate appliance | Inbound connections on TCP port 3389 to allow remote desktop connections to the appliance.<br /><br /> Inbound connections on port 44368 to remotely access the appliance management app by using the URL `https://<appliance-ip-or-name>:44368`. <br /><br />Outbound connections on port 443 (HTTPS) to send discovery and performance metadata to Azure Migrate and Modernize.
vCenter Server | Inbound connections on TCP port 443 to allow the appliance to collect configuration and performance metadata for assessments. <br /><br /> The appliance connects to vCenter on port 443 by default. If vCenter Server listens on a different port, you can modify the port when you set up discovery.
ESXi hosts | For [discovery of software inventory](../how-to-discover-applications.md) or [agentless dependency analysis](../concepts-dependency-visualization.md#agentless-analysis), the appliance connects to ESXi hosts on TCP port 443 to discover software inventory and dependencies on the servers.


## Software inventory requirements

In addition to discovering servers, Azure Migrate: Discovery and assessment can perform software inventory on servers. Software inventory provides the list of applications, roles, and features running on Windows and Linux servers that are discovered by using Azure Migrate and Modernize. It allows you to identify and plan a migration path tailored for your on-premises workloads.

Support | Details
--- | ---
Supported servers | You can perform software inventory on up to 10,000 servers running across vCenter Servers added to each Azure Migrate appliance.
Operating systems | Servers running all Windows and Linux versions are supported.
Server requirements | For software inventory, VMware Tools must be installed and running on your servers. The VMware Tools version must be version 10.2.1 or later.<br /><br /> Windows servers must have PowerShell version 2.0 or later installed.<br/><br/>Windows Management Instrumentation (WMI) must be enabled and available on Windows servers to gather the details of the roles and features installed on the servers.
vCenter Server account | To interact with the servers for software inventory, the vCenter Server read-only account used for assessment must have privileges for guest operations on VMware VMs.
Server access | You can add multiple domain and nondomain (Windows/Linux) credentials in the appliance configuration manager for software inventory.<br /><br /> You must have a guest user account for Windows servers and a standard user account (non-sudo access) for all Linux servers.
Port access | The Azure Migrate appliance must be able to connect to TCP port 443 on ESXi hosts running servers on which you want to perform software inventory. The server running vCenter Server returns an ESXi host connection to download the file that contains the details of the software inventory. <br /><br /> If you use domain credentials, the Azure Migrate appliance must be able to connect to the following TCP and UDP ports: <br /> <br />TCP 135 – RPC Endpoint<br />TCP 389 – LDAP<br />TCP 636 – LDAP SSL<br />TCP 445 – SMB<br />TCP/UDP 88 – Kerberos authentication<br />TCP/UDP 464 – Kerberos change operations
Discovery | Software inventory is performed from vCenter Server by using VMware Tools installed on the servers.<br/><br/> The appliance gathers the information about the software inventory from the server running vCenter Server through vSphere APIs.<br/><br/> Software inventory is agentless. No agent is installed on the server, and the appliance doesn't connect directly to the servers.

## SQL Server instance and database discovery requirements

[Software inventory](../how-to-discover-applications.md) identifies SQL Server instances. The appliance attempts to connect to the respective SQL Server instances through the Windows authentication or SQL Server authentication credentials in the appliance configuration manager by using this information. The appliance can connect to only those SQL Server instances to which it has network line of sight. Software inventory by itself might not need network line of sight.

After the appliance is connected, it gathers configuration and performance data for SQL Server instances and databases. The appliance updates the SQL Server configuration data once every 24 hours and captures the performance data every 30 seconds.

Support | Details
--- | ---
Supported servers | Supported only for servers running SQL Server in your VMware, Microsoft Hyper-V, and physical/bare-metal environments and infrastructure as a service (IaaS) servers of other public clouds, such as Amazon Web Services (AWS) and Google Cloud Platform (GCP). <br /><br /> You can discover up to 750 SQL Server instances or 15,000 SQL databases, whichever is less, from a single appliance. We recommend that you ensure that an appliance is scoped to discover less than 600 servers running SQL to avoid scaling issues.
Windows servers | Windows Server 2008 and later are supported.
Linux servers | Currently not supported.
Authentication mechanism | Both Windows and SQL Server authentication are supported. You can provide credentials of both authentication types in the appliance configuration manager.
SQL Server access | To discover SQL Server instances and databases, the Windows or SQL Server account must be a member of the sysadmin server role or have [these permissions](#configure-the-custom-login-for-sql-server-discovery) for each SQL Server instance.
SQL Server versions | SQL Server 2008 and later are supported.
SQL Server editions | Enterprise, Standard, Developer, and Express editions are supported.
Supported SQL configuration | Discovery of standalone, highly available, and disaster-protected SQL deployments is supported. Discovery of high-availability disaster recovery SQL deployments powered by Always On failover cluster Instances and Always On availability groups is also supported.
Supported SQL services | Only SQL Server Database Engine is supported. <br /><br /> Discovery of SQL Server Reporting Services, SQL Server Integration Services, and SQL Server Analysis Services isn't supported.

> [!NOTE]
> By default, Azure Migrate and Modernize uses the most secure way of connecting to SQL instances. That is, Azure Migrate and Modernize encrypts communication between the Azure Migrate appliance and the source SQL Server instances by setting the `TrustServerCertificate` property to `true`. Also, the transport layer uses Secure Socket Layer to encrypt the channel and bypass the certificate chain to validate trust. For this reason, the appliance server must be set up to trust the certificate's root authority.
>
> However, you can modify the connection settings by selecting **Edit SQL Server connection properties** on the appliance. [Learn more](/sql/database-engine/configure-windows/enable-encrypted-connections-to-the-database-engine) to understand what to choose.

### Configure the custom login for SQL Server discovery

Use the following sample scripts to create a login and provision it with the necessary permissions.

#### Windows authentication
  
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

  -- Create user in every database other than tempdb, model, and secondary AG databases (with connection_type = ALL) and provide minimal read-only permissions.
  USE master;
  EXECUTE sp_MSforeachdb '
    USE [?];
    IF (''?'' NOT IN (''tempdb'',''model''))
    BEGIN
      DECLARE @is_secondary_replica BIT = 0;
      IF CAST(PARSENAME(CAST(SERVERPROPERTY(''ProductVersion'') AS VARCHAR), 4) AS INT) >= 11
      BEGIN
        DECLARE @innersql NVARCHAR(MAX);
        SET @innersql = N''
          SELECT @is_secondary_replica = IIF(
            EXISTS (
                SELECT 1
                FROM sys.availability_replicas a
                INNER JOIN sys.dm_hadr_database_replica_states b
                ON a.replica_id = b.replica_id
                WHERE b.is_local = 1
                AND b.is_primary_replica = 0
                AND a.secondary_role_allow_connections = 2
                AND b.database_id = DB_ID()
            ), 1, 0
          );
        '';
        EXEC sp_executesql @innersql, N''@is_secondary_replica BIT OUTPUT'', @is_secondary_replica OUTPUT;
      END
      IF (@is_secondary_replica = 0)
      BEGIN
        CREATE USER [MYDOMAIN\MYACCOUNT] FOR LOGIN [MYDOMAIN\MYACCOUNT];
        GRANT SELECT ON sys.sql_expression_dependencies TO [MYDOMAIN\MYACCOUNT];
        GRANT VIEW DATABASE STATE TO [MYDOMAIN\MYACCOUNT];
      END
    END'
  GO

  -- Provide server level read-only permissions
  use master;
  GRANT SELECT ON sys.sql_expression_dependencies TO [MYDOMAIN\MYACCOUNT];
  GRANT EXECUTE ON OBJECT::sys.xp_regenumkeys TO [MYDOMAIN\MYACCOUNT];
  GRANT EXECUTE ON OBJECT::sys.xp_instance_regread TO [MYDOMAIN\MYACCOUNT];
  GRANT VIEW DATABASE STATE TO [MYDOMAIN\MYACCOUNT];
  GRANT VIEW SERVER STATE TO [MYDOMAIN\MYACCOUNT];
  GRANT VIEW ANY DEFINITION TO [MYDOMAIN\MYACCOUNT];
  GO

  -- Provide msdb specific permissions
  use msdb;
  GRANT EXECUTE ON [msdb].[dbo].[agent_datetime] TO [MYDOMAIN\MYACCOUNT];
  GRANT SELECT ON [msdb].[dbo].[sysjobsteps] TO [MYDOMAIN\MYACCOUNT];
  GRANT SELECT ON [msdb].[dbo].[syssubsystems] TO [MYDOMAIN\MYACCOUNT];
  GRANT SELECT ON [msdb].[dbo].[sysjobhistory] TO [MYDOMAIN\MYACCOUNT];
  GRANT SELECT ON [msdb].[dbo].[syscategories] TO [MYDOMAIN\MYACCOUNT];
  GRANT SELECT ON [msdb].[dbo].[sysjobs] TO [MYDOMAIN\MYACCOUNT];
  GRANT SELECT ON [msdb].[dbo].[sysmaintplan_plans] TO [MYDOMAIN\MYACCOUNT];
  GRANT SELECT ON [msdb].[dbo].[syscollector_collection_sets] TO [MYDOMAIN\MYACCOUNT];
  GRANT SELECT ON [msdb].[dbo].[sysmail_profile] TO [MYDOMAIN\MYACCOUNT];
  GRANT SELECT ON [msdb].[dbo].[sysmail_profileaccount] TO [MYDOMAIN\MYACCOUNT];
  GRANT SELECT ON [msdb].[dbo].[sysmail_account] TO [MYDOMAIN\MYACCOUNT];
  GO
  
  -- Clean up
  --use master;
  -- EXECUTE sp_MSforeachdb 'USE [?]; DROP USER [MYDOMAIN\MYACCOUNT]'
  -- DROP LOGIN [MYDOMAIN\MYACCOUNT];
  --GO
  ```

#### SQL Server authentication
  
   ```sql
  --- Create a login to run the assessment
  use master;
  -- NOTE: SQL instances that host replicas of Always On availability groups must use the same SID for the SQL login.
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
      , SID = ' + @SID
    EXEC SP_EXECUTESQL @SQLString
  END
  SELECT @SID = N'0x'+CONVERT(NVARCHAR(100), sid, 2) FROM sys.syslogins where name = 'evaluator'
  IF (ISNULL(@SID,'') != '')
    PRINT N'Created login [evaluator] with SID = '''+ @SID +'''. If this instance hosts any Always On Availability Group replica, use this SID value when executing the script against the instances hosting the other replicas'
  ELSE
    PRINT N'Login creation failed'
  GO
  
  -- Create user in every database other than tempdb, model, and secondary AG databases (with connection_type = ALL) and provide minimal read-only permissions.
  USE master;
  EXECUTE sp_MSforeachdb '
    USE [?];
    IF (''?'' NOT IN (''tempdb'',''model''))
    BEGIN
      DECLARE @is_secondary_replica BIT = 0;
      IF CAST(PARSENAME(CAST(SERVERPROPERTY(''ProductVersion'') AS VARCHAR), 4) AS INT) >= 11
      BEGIN
        DECLARE @innersql NVARCHAR(MAX);
        SET @innersql = N''
          SELECT @is_secondary_replica = IIF(
            EXISTS (
              SELECT 1
              FROM sys.availability_replicas a
              INNER JOIN sys.dm_hadr_database_replica_states b
                ON a.replica_id = b.replica_id
              WHERE b.is_local = 1
                AND b.is_primary_replica = 0
                AND a.secondary_role_allow_connections = 2
                AND b.database_id = DB_ID()
            ), 1, 0
          );
        '';
        EXEC sp_executesql @innersql, N''@is_secondary_replica BIT OUTPUT'', @is_secondary_replica OUTPUT;
      END

      IF (@is_secondary_replica = 0)
      BEGIN
          CREATE USER [evaluator] FOR LOGIN [evaluator];
          GRANT SELECT ON sys.sql_expression_dependencies TO [evaluator];
          GRANT VIEW DATABASE STATE TO [evaluator];
      END
    END'
  GO
  
  -- Provide server level read-only permissions
  USE master;
  GRANT SELECT ON sys.sql_expression_dependencies TO [evaluator];
  GRANT EXECUTE ON OBJECT::sys.xp_regenumkeys TO [evaluator];
  GRANT EXECUTE ON OBJECT::sys.xp_instance_regread TO [evaluator];
  GRANT VIEW DATABASE STATE TO [evaluator];
  GRANT VIEW SERVER STATE TO [evaluator];
  GRANT VIEW ANY DEFINITION TO [evaluator];
  GO
  
  -- Provide msdb specific permissions
  USE msdb;
  GRANT EXECUTE ON [msdb].[dbo].[agent_datetime] TO [evaluator];
  GRANT SELECT ON [msdb].[dbo].[sysjobsteps] TO [evaluator];
  GRANT SELECT ON [msdb].[dbo].[syssubsystems] TO [evaluator];
  GRANT SELECT ON [msdb].[dbo].[sysjobhistory] TO [evaluator];
  GRANT SELECT ON [msdb].[dbo].[syscategories] TO [evaluator];
  GRANT SELECT ON [msdb].[dbo].[sysjobs] TO [evaluator];
  GRANT SELECT ON [msdb].[dbo].[sysmaintplan_plans] TO [evaluator];
  GRANT SELECT ON [msdb].[dbo].[syscollector_collection_sets] TO [evaluator];
  GRANT SELECT ON [msdb].[dbo].[sysmail_profile] TO [evaluator];
  GRANT SELECT ON [msdb].[dbo].[sysmail_profileaccount] TO [evaluator];
  GRANT SELECT ON [msdb].[dbo].[sysmail_account] TO [evaluator];
  GO
  
  -- Clean up
  --use master;
  -- EXECUTE sp_MSforeachdb 'USE [?]; BEGIN TRY DROP USER [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;'
  -- BEGIN TRY DROP LOGIN [evaluator] END TRY BEGIN CATCH PRINT ERROR_MESSAGE() END CATCH;
  --GO
   ```


## Web apps discovery requirements

[Software inventory](../how-to-discover-applications.md) identifies the web server role existing on discovered servers. If a server has a web server installed, Azure Migrate and Modernize discovers web apps on the server.

You can add both domain and nondomain credentials on the appliance. Ensure that the account used has local admin privileges on source servers. Azure Migrate and Modernize automatically maps credentials to the respective servers, so you don't have to map them manually. Most importantly, these credentials are never sent to Microsoft and remain on the appliance running in the source environment.

After the appliance is connected, it gathers configuration data for ASP.NET web apps (IIS web server) and Java web apps (Tomcat servers). Web apps configuration data is updated once every 24 hours.

Support | ASP.NET web apps | Java web apps
--- | --- | ---
Stack |VMware, Hyper-V, and physical servers. | VMware, Hyper-V, and physical servers.
Windows servers | Windows Server 2008 R2 and later are supported. | Not supported.
Linux servers | Not supported. | Ubuntu Linux 16.04/18.04/20.04, Debian 7/8, and Red Hat Enterprise Linux 5/6/7.
Web server versions | IIS 7.5 and later. | Tomcat 8 or later.
Protocol | WinRM port 5985 (HTTP) | SSH port 22 (TCP)
Required privileges | Local admin. | Root or sudo user.

> [!NOTE]
> Data is always encrypted at rest and during transit.


## Dependency analysis requirements (agentless)

[Dependency analysis](../concepts-dependency-visualization.md) helps you analyze the dependencies between the discovered servers. You can easily visualize dependencies with a map view in an Azure Migrate project. You can use dependencies to group related servers for migration to Azure. The following table summarizes the requirements for setting up agentless dependency analysis.

Support | Details
--- | ---
Supported servers | You can enable agentless dependency analysis on up to 1,000 servers (across multiple vCenter Servers) discovered per appliance.
Windows servers | Windows Server 2022 <br/> Windows Server 2019<br /> Windows Server 2016<br /> Windows Server 2012 R2<br /> Windows Server 2012<br /> Windows Server 2008 R2 (64-bit)<br /> Windows Server 2008 (32-bit)
Linux servers | Red Hat Enterprise Linux 5.1, 5.3, 5.11, 6.x, 7.x, 8.x, 9.x <br /> Ubuntu 12.04, 14.04, 16.04, 18.04, 20.04, 22.04 <br /> OracleLinux 6.1, 6.7, 6.8, 6.9, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8, 8.1, 8.3, 8.5 <br /> SUSE Linux 10, 11 SP4, 12 SP1, 12 SP2, 12 SP3, 12 SP4, 15 SP2, 15 SP3 <br /> Debian 7, 8, 9, 10, 11
Server requirements | VMware Tools (10.2.1 and later) must be installed and running on servers you want to analyze.<br /><br /> Servers must have PowerShell version 2.0 or later installed.<br /><br /> WMI should be enabled and available on Windows servers.
vCenter Server account | The read-only account used by Azure Migrate and Modernize for assessment must have privileges for guest operations on VMware VMs.
Windows server access |  A Guest user account with minimal privileges.
Linux server access | A sudo user account with permissions to execute ls and netstat commands. If you're providing a sudo user account, ensure that you enable **NOPASSWD** for the account to run the required commands without prompting for a password every time a sudo command is invoked. <br /><br /> Alternatively, you can create a user account that has the CAP_DAC_READ_SEARCH and CAP_SYS_PTRACE permissions on /bin/netstat and /bin/ls files set by using the following commands:<br /><code>sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/ls<br /> sudo setcap CAP_DAC_READ_SEARCH,CAP_SYS_PTRACE=ep /bin/netstat</code>|
|Port access | The Azure Migrate appliance must be able to connect to TCP port 443 on ESXi hosts running the servers that have dependencies you want to discover. The server running vCenter Server returns an ESXi host connection to download the file containing the dependency data.
Discovery method |  Dependency information between servers is gathered by using VMware Tools installed on the server running vCenter Server.<br /><br /> The appliance gathers the information from the server by using vSphere APIs.<br /><br /> No agent is installed on the server, and the appliance doesn't connect directly to servers.

> [!Note]
> In some recent Linux OS versions, the netstat command was replaced by the `ss` command; have that in mind when preparing the servers.


## Dependency analysis requirements (agent-based)

[Dependency analysis](../concepts-dependency-visualization.md) helps you identify dependencies between on-premises servers that you want to assess and migrate to Azure. The following table summarizes the requirements for setting up agent-based dependency analysis.

Requirement | Details
--- | ---
Before deployment | You should have a project in place with the Azure Migrate: Discovery and assessment tool added to the project.<br /><br />You deploy dependency visualization after setting up an Azure Migrate appliance to discover your on-premises servers.<br /><br />Learn how to [create a project for the first time](../create-manage-projects.md).<br /> Learn how to [add a discovery and assessment tool to an existing project](../how-to-assess.md).<br /> Learn how to set up the Azure Migrate appliance for assessment of [Hyper-V](../how-to-set-up-appliance-hyper-v.md), [VMware](../how-to-set-up-appliance-vmware.md), or physical servers.
Supported servers | Supported for all servers in your on-premises environment.
Log Analytics | Azure Migrate and Modernize uses the [Service Map](/previous-versions/azure/azure-monitor/vm/service-map) solution in [Azure Monitor logs](/azure/azure-monitor/logs/log-query-overview) for dependency visualization.<br /><br /> You associate a new or existing Log Analytics workspace with a project. You can't modify the workspace for a project after you add the workspace. <br /><br /> The workspace must be in the same subscription as the project.<br /><br /> The workspace must be located in the East US, Southeast Asia, or West Europe regions. Workspaces in other regions can't be associated with a project.<br /><br /> The workspace must be in a [region in which Service Map is supported](https://azure.microsoft.com/global-infrastructure/services/?products=monitor&regions=all). You can monitor Azure VMs in any region. The VMs themselves aren't limited to the regions supported by the Log Analytics workspace.<br /><br /> In Log Analytics, the workspace associated with Azure Migrate is tagged with the project key and project name.
Required agents | On each server that you want to analyze, install the following agents:<br />- Azure Monitor agent (AMA)<br />- [Dependency agent](/azure/azure-monitor/vm/vminsights-dependency-agent-maintenance)<br /><br /> If on-premises servers aren't connected to the internet, download and install the Log Analytics gateway on them.<br /><br /> Learn more about installing the [Dependency agent](../how-to-create-group-machine-dependencies.md#install-the-dependency-agent) and the Azure Monitor agent.
Log Analytics workspace | The workspace must be in the same subscription as the project.<br /><br /> Azure Migrate supports workspaces that are located in the East US, Southeast Asia, and West Europe regions.<br /><br />  The workspace must be in a region in which [Service Map is supported](https://azure.microsoft.com/global-infrastructure/services/?products=monitor&regions=all). You can monitor Azure VMs in any region. The VMs themselves aren't limited to the regions supported by the Log Analytics workspace.<br /><br /> You can't modify the workspace for a project after you add the workspace.
Cost | The Service Map solution doesn't incur any charges for the first 180 days. The count starts from the day you associate the Log Analytics workspace with the project.<br /><br /> After 180 days, standard Log Analytics charges apply.<br /><br /> Using any solution other than Service Map in the associated Log Analytics workspace incurs [standard charges](https://azure.microsoft.com/pricing/details/log-analytics/) for Log Analytics.<br /><br /> When the project is deleted, the workspace isn't automatically deleted. After you delete the project, Service Map usage isn't free. Each node is charged according to the paid tier of the Log Analytics workspace.<br /><br />If you have projects that you created before Azure Migrate general availability (GA on February 28, 2018), you might incur other Service Map charges. To ensure that you're charged only after 180 days, we recommend that you create a new project. Workspaces that were created before GA are still chargeable.
Management | When you register agents to the workspace, use the ID and key provided by the project.<br /><br /> You can use the Log Analytics workspace outside Azure Migrate and Modernize.<br /><br /> If you delete the associated project, the workspace isn't deleted automatically. [Delete it manually](/azure/azure-monitor/logs/manage-access).<br /><br /> Don't delete the workspace created by Azure Migrate and Modernize unless you delete the project. If you do, the dependency visualization functionality doesn't work as expected.
Internet connectivity | If servers aren't connected to the internet, install the Log Analytics gateway on the servers.
Azure Government | Agent-based dependency analysis isn't supported.


## Limitations

Requirement | Details
--- | ---
Project limits | You can create multiple Azure Migrate projects in an Azure subscription.<br /><br /> You can discover and assess up to 50,000 servers in a VMware environment in a single [project](../migrate-support-matrix.md#project). A project can include physical servers and servers from a Hyper-V environment, up to the assessment limits.
Discovery | The Azure Migrate appliance can discover up to 10,000 servers running across multiple vCenter Servers.<br /><br /> The appliance supports adding multiple vCenter Servers. You can add up to 10 vCenter Servers per appliance.<br /><br />The scale is also valid to access discovered servers for Azure Migrate VMWare Solution (AVS).<br /><br />The same vCenter can be discovered by multiple appliances within the same project, but it is not recommended to have same VM discovered by multiple appliances. More details on how to set [discovery scope](./set-discovery-scope.md).
Assessment | You can add up to 35,000 servers in a single group.<br /><br /> You can assess up to 35,000 servers in a single assessment.

Learn more about [assessments](../concepts-assessment-calculation.md).


## Import servers using RVTools XLSX (preview)

As part of your migration journey to Azure by using the Azure Migrate appliance, you first discover servers, inventory, and workloads. However, for a quick assessment before you deploy the appliance, you can [import the servers by using the RVTools XLSX file (preview)](../tutorial-import-vmware-using-rvtools-xlsx.md).

### Key benefits

Using an RVTools XLSX file:

- Helps to create a business case or assess the servers before you deploy the appliance.
- Aids as an alternative when there's an organizational restriction to deploy the Azure Migrate appliance.
- Is helpful when you can't share credentials that allow access to on-premises servers.
- Is useful when security constraints prevent you from gathering and sending data collected by the appliance to Azure.

### Limitations

This section discusses limitations to consider.

#### [Business case considerations](#tab/businesscase)

If you're importing servers by using an RVTools XLSX file and building a business case, here are a few limitations:

- Performance history duration in Azure settings aren't applicable.
- Servers are classified as unknown in the business case utilization insights chart and are sized as is without right sizing for Azure or Azure VMware Solution cost.

#### [Assessment considerations](#tab/assessmentcase)

If you're importing servers by using an RVTools XLSX file for creating an assessment with the following criteria:

- Sizing criteria as **performance-based** on the configured CPU and memory (based on the CPUs and Memory columns from the RVTools XLSX).
- Storage criteria (In use MiB and In use MB for versions prior to 4.1.2).

You won't be able to provide performance history or percentile information.

To get an accurate operating system suitability/readiness in Azure VM and Azure VMware Solution assessment, enter the **Operating system** version and **architecture** in the respective columns.

---

## Next steps

* Review [assessment best practices](../best-practices-assessment.md).
* Learn how to [prepare for a VMware assessment](../tutorial-discover-vmware.md).
