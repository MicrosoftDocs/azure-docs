---
title: Support for physical discovery and assessment in Azure Migrate and Modernize
description: 'Learn about support for physical discovery and assessment with Azure Migrate: Discovery and assessment.'
author: molishv
ms.author: molir
ms.manager: ronai
ms.topic: concept-article
ms.service: azure-migrate
ms.reviewer: v-uhabiba
ms.date: 04/04/2025
ms.custom: engagement-fy23, linux-related-content
# Customer intent: As an IT administrator, I want to assess physical servers for migration to Azure using a discovery and assessment tool, so that I can plan and execute a successful migration of our on-premises infrastructure.
---

# Support matrix for physical server discovery and assessment

This article summarizes prerequisites and support requirements when you assess physical servers for migration to Azure by using the [Azure Migrate: Discovery and assessment](migrate-services-overview.md) tool. If you want to migrate physical servers to Azure, see the [migration support matrix](migrate-support-matrix-physical-migration.md).

To assess physical servers, you create a project and add the Azure Migrate: Discovery and assessment tool to the project. After you add the tool, you deploy the [Azure Migrate appliance](migrate-appliance.md). The appliance continuously discovers on-premises servers and sends servers metadata and performance data to Azure. After discovery is finished, you gather discovered servers into groups and run an assessment for a group.

## Limitations

Support | Details
--- | ---
Assessment limits | You can discover and assess up to 35,000 physical servers in a single [project](migrate-support-matrix.md#project).
Project limits | You can create multiple projects in an Azure subscription. In addition to physical servers, a project can include servers on VMware and on Hyper-V, up to the assessment limits for each.
Discovery | The Azure Migrate appliance can discover up to 1,000 physical servers.
Assessment | You can add up to 35,000 servers in a single group.<br/><br/> You can assess up to 35,000 servers in a single assessment.

[Learn more](concepts-assessment-calculation.md) about assessments.

## Physical server requirements

- **Physical server deployment:** The physical server can be standalone or deployed in a cluster.
- **Type of servers:** Bare-metal servers, virtualized servers running on-premises, or other clouds like Amazon Web Services (AWS), Google Cloud Platform (GCP), and Xen.
   > [!Note]
   > Currently, Azure Migrate doesn't support the discovery of paravirtualized servers.

- **Operating system:** All Windows and Linux operating systems can be assessed for migration.

    [!INCLUDE [end-of-life-notes-windows-server-2008.md](./includes/end-of-life-notes-windows-server-2008.md)]

As a result, Azure Migrate doesn’t guarantee consistent or reliable outcomes for these OS versions. Customers may face problems and are strongly advised to upgrade to a supported Windows Server version before starting migration.

## Azure Migrate appliance requirements

Azure Migrate uses the [Azure Migrate appliance](migrate-appliance.md) for discovery and assessment. The appliance for physical servers can run on a virtual machine (VM) or a physical server.

- Learn about [appliance requirements](migrate-appliance.md#appliance---physical) for physical servers.
- Learn about URLs that the appliance needs to access in [public](migrate-appliance.md#public-cloud-urls) and [government](migrate-appliance.md#government-cloud-urls) clouds.
- Use a [PowerShell script](how-to-set-up-appliance-physical.md) that you download from the Azure portal to set up the appliance.
- [Use this script](deploy-appliance-script-government.md) to deploy the appliance in Azure Government.

## Port access

The following table summarizes port requirements for assessment.

Device | Connection
--- | ---
Appliance | Inbound connections on TCP port 3389 to allow remote desktop connections to the appliance.<br/><br/> Inbound connections on port 44368 to remotely access the appliance management app by using the URL ``` https://<appliance-ip-or-name>:44368 ```.<br/><br/> Outbound connections on ports 443 (HTTPS) to send discovery and performance metadata to Azure Migrate and Modernize.
Physical servers | **Windows**: Inbound connections on the WinRM port 5986 (HTTPS) are used to pull configuration and performance metadata from Windows servers. <br/><br/> If the HTTPS prerequisites aren't configured on the target Hyper-V servers, the appliance communication will fall back to WinRM port 5985 (HTTP).<br/><br/> To enforce HTTPS communication without fallback, toggle the Appliance Config Manager. <br/><br/> After enabling, ensure that the prerequisites are configured on the target servers. <br/><br/> - If certificates aren't configured on the target servers, discovery will fail on both the currently discovered servers and the newly added servers. <br/><br/> - WinRM HTTPS requires a local computer Server Authentication certificate with a common name (CN) matching the hostname. The certificate must not be expired, revoked, or self-signed. Refer to the [article](/troubleshoot/windows-client/system-management-components/configure-winrm-for-https) for configuring WinRM for HTTPS.<br/><br/> - Linux: Inbound connections on port 22 (TCP) to pull configuration and performance metadata from Linux servers. |

## Software inventory requirements

In addition to discovering servers, Azure Migrate: Discovery and assessment can perform software inventory on servers. Software inventory provides the list of applications, roles, and features running on Windows and Linux servers that are discovered by using Azure Migrate and Modernize. It helps you to identify and plan a migration path tailored for your on-premises workloads.

Support | Details
--- | ---
Supported servers | You can perform software inventory on up to 1,000 servers discovered from each Azure Migrate appliance.
Operating systems | Servers running all Windows and Linux versions that meet the server requirements and have the required access permissions are supported.
Server requirements | Windows servers must have PowerShell remoting enabled and PowerShell version 2.0 or later installed. <br/><br/> WMI must be enabled and available on Windows servers to gather the details of the roles and features installed on the servers.<br/><br/> Linux servers must have SSH connectivity enabled and ensure that the following commands can be executed on the Linux servers to pull the application data: list, tail, awk, grep, locate, head, sed, ps, print, sort, uniq. Based on the OS type and the type of package manager used, here are some more commands: rpm/snap/dpkg, yum/apt-cache, mssql-server.
Windows server access | A guest user account for Windows servers.
Linux server access | A standard user account (non-sudo access) for all Linux servers.
Port access | Windows servers need access on port 5986 (HTTPS) or 5985 (HTTP). Linux servers need access on port 22 (TCP).
Discovery | Software inventory is performed by directly connecting to the servers by using the server credentials added on the appliance. <br/><br/> The appliance gathers the information about the software inventory from Windows servers by using PowerShell remoting and from Linux servers by using the SSH connection. <br/><br/> Software inventory is agentless. No agent is installed on the servers.

## SQL Server instance and database discovery requirements

[Software inventory](how-to-discover-applications.md) identifies SQL Server instances. The appliance attempts to connect to respective SQL Server instances through the Windows authentication or SQL Server authentication credentials provided in the appliance configuration manager by using this information. The appliance can connect to only those SQL Server instances to which it has network line of sight. Software inventory by itself might not need network line of sight.

After the appliance is connected, it gathers configuration and performance data for SQL Server instances and databases. The appliance updates the SQL Server configuration data once every 24 hours and captures the performance data every 30 seconds.

Support | Details
--- | ---
Supported servers | Supported only for servers running SQL Server in your VMware, Microsoft Hyper-V, and physical/bare-metal environments and infrastructure as a service (IaaS) servers of other public clouds, such as AWS and GCP. <br /><br /> You can discover up to 750 SQL Server instances or 15,000 SQL databases, whichever is less, from a single appliance. We recommend that you ensure that an appliance is scoped to discover less than 600 servers running SQL to avoid scaling issues.
Windows servers | Windows Server 2008 and later are supported.
Linux servers | Currently not supported.
Authentication mechanism | Both Windows and SQL Server authentication are supported. You can provide credentials of both authentication types in the appliance configuration manager.
SQL Server access | To discover SQL Server instances and databases, the Windows/ Domain account, or SQL Server account [requires these low privilege read permissions](migrate-support-matrix-vmware.md) for each SQL Server instance. You can use the [low-privilege account provisioning utility](least-privilege-credentials.md) to create custom accounts or use any existing account that is a member of the sysadmin server role for simplicity.
SQL Server versions | SQL Server 2008 and later are supported.
SQL Server editions | Enterprise, Standard, Developer, and Express editions are supported.
Supported SQL configuration | Discovery of standalone, highly available, and disaster-protected SQL deployments is supported. Discovery of high-availability and disaster recovery SQL deployments powered by Always On failover cluster instances and Always On availability groups is also supported.
Supported SQL services | Only SQL Server Database Engine is supported. <br /><br /> Discovery of SQL Server Reporting Services, SQL Server Integration Services, and SQL Server Analysis Services isn't supported.

> [!NOTE]
> By default, Azure Migrate uses the most secure way of connecting to SQL instances. That is, Azure Migrate and Modernize encrypts communication between the Azure Migrate appliance and the source SQL Server instances by setting the `TrustServerCertificate` property to `true`. Also, the transport layer uses Secure Socket Layer to encrypt the channel and bypass the certificate chain to validate trust. For this reason, the appliance server must be set up to trust the certificate's root authority.
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

[Software inventory](how-to-discover-applications.md) identifies the web server role that exists on discovered servers. If a server is found to have a web server installed, Azure Migrate and Modernize discovers web apps on the server.

You can add both domain and nondomain credentials on the appliance. Ensure that the account used has local admin privileges on the source servers. Azure Migrate and Modernize automatically maps credentials to the respective servers, so you don't have to map them manually. Most importantly, these credentials are never sent to Microsoft and remain on the appliance running in the source environment.

After the appliance is connected, it gathers configuration data for ASP.NET web apps (IIS web server) and Java web apps (Tomcat servers). Web apps configuration data is updated once every 24 hours.

Support | ASP.NET web apps | Java web apps
--- | --- | ---
Stack | VMware, Hyper-V, and physical servers | VMware, Hyper-V, and physical servers
Windows servers | Windows Server 2008 R2 and later are supported | Not supported
Linux servers | Not supported | Servers that meet the [requirements](migrate-support-matrix-physical.md#physical-server-requirements)
Web server versions | IIS 7.5 and later | Tomcat 8 and later
Protocol | WinRM port 5986 (HTTPS) by default, if HTTPS prerequisites aren't configured on the target servers, communication falls back to WinRM port 5985 (HTTP) | SSH port 22 (TCP)
Required privileges | The least privileged user should be a part of the two user groups 1. Remote Management Users 2. IIS_IUSRS. The users must have read permissions to the following locations: C:\Windows\system32\inetsrv\config, C:\Windows\system32\inetsrv\config\applicationHost.config and C:\Windows\system32\inetsrv\config\redirection.config. </br></br> Add the user to 'log on as batch job' using secpol.msc and ensure user is not part of 'deny log on as batch job'. | **Read (r)** and **Execute (x)** permissions recursively on all CATALINA_HOME directories.

> [!NOTE]
> Data is always encrypted at rest and during transit.

## Dependency analysis requirements (agentless)

[Dependency analysis](concepts-dependency-visualization.md) helps you analyze the dependencies between the discovered servers. You can easily visualize dependencies with a map view in an Azure Migrate project. You can use dependencies to group related servers for migration to Azure. The following table summarizes the requirements for setting up agentless dependency analysis.

Support | Details
--- | ---
Supported servers | You can enable agentless dependency analysis on up to 1,000 servers discovered per appliance.
Operating systems | Servers running all Windows and Linux versions that meet the server requirements and have the required access permissions are supported.
Server requirements | Windows servers must have PowerShell remoting enabled and PowerShell version 2.0 or later installed. <br/><br/> Linux servers must have SSH connectivity enabled and ensure that the following commands can be executed on the Linux servers: touch, chmod, cat, ps, grep, echo, sha256sum, awk, netstat, ls, sudo, dpkg, rpm, sed, getcap, which, date.
Windows server access | A user account (local or domain) with administrator permissions on servers.
Linux server access | Refer this [link](tutorial-discover-physical.md#prepare-linux-server) for Linux server access. 
Port access | Windows servers need access on port 5986 (HTTPS) or 5985 (HTTP). Linux servers need access on port 22 (TCP).
Discovery method |  Agentless dependency analysis is performed by directly connecting to the servers by using the server credentials added on the appliance. <br/><br/> The appliance gathers the dependency information from Windows servers by using PowerShell remoting and from Linux servers by using the SSH connection. <br/><br/> No agent is installed on the servers to pull dependency data.

## Agent-based dependency analysis requirements

**Agent-based dependency analysis** is supported only in the classic view and isn't available in the new experience. The classic view is scheduled for deprecation by the end of 2026. Until then, you can continue to access Log Analytics workspaces for servers where agent-based dependency analysis is already enabled. However, you can't onboard new servers for agent-based dependency analysis. For information, see [Set up dependency visualization](how-to-create-group-machine-dependencies.md).

If you are using Service Map for agent-based dependency analysis, migrate to VM Insights. [ServiceMap](/azure/azure-monitor/vm/vminsights-migrate-from-service-map) is retired.

>[!NOTE]
> Agent-based dependency analysis isn't free. Log Analytics workspace usage charges apply. For pricing details, see [Azure Monitor pricing](https://azure.microsoft.com/pricing/details/monitor/).

## Next steps

Prepare for [discovery](./tutorial-discover-physical.md) of physical servers.
