---
title: Security Best Practices for Least Privileged Accounts in Azure Migrate.
description: Learn how to securely configure Azure Migrate Appliance with least privilege access by setting up read-only VMware roles with guest operations and scoped permissions, enabling efficient workload discovery, software inventory, and agentless migration..
author: molishv
ms.author: molir
ms.service: azure-migrate
ms.topic: conceptual
ms.date: 07/04/2025
monikerRange: migrate
ms.custom:
  - build-2025
# Customer intent: As a cloud migration specialist, I want to implement security best practices for deploying the migration appliance, so that I can ensure a secure and efficient migration process while protecting sensitive data.
---

# Credentials-Best Practices for Least Privileged Accounts in Azure Migrate

Azure Migrate Appliance is a lightweight tool that discovers on-premises servers and sends their configuration and performance data to Azure. It also performs software inventory, agentless dependency analysis, and detects workloads like web apps and SQL/MySQL Server instances. To use these features, users add server and guest credentials in the Appliance Config Manager. Following the principle of least privilege helps keep the setup secure and efficient.

## Discovery of VMware estate

To discover the basic settings of servers running in the VMware estate, the following permissions are needed.

### vCenter account permissions 

1. **Discovery of server metadata**: To discover basic server configurations in a VMware environment, you need read-only permissions.
    - **Read-only**: Use either the built-in read-only role or create a copy of it.
1. To discover server metadata and enable software inventory, dependency analysis, and performance assessments.
    - **Read-only**- Use the built-in read-only role or create a copy of it. 
    - **Guest operations** - Add guest operations privileges to the read-only role.
1. Scoped discovery of VMware servers:  
    - To discover specific VMs, **assign read permissions at the individual VMs**. To discover all VMs in a folder, assign read permissions at the folder level and turn on the 'propagate to children' option.
    - Assign guest operations permissions to the vCenter account along with read permissions to enable software inventory, dependency analysis, and performance assessments.
    - Give **read-only access to all parent objects that host the virtual machines**, such as the host, cluster, hosts folder, clusters folder, and data center. You don’t need to apply these permissions to all child objects.
    - In the vSphere client, check that read permissions are set on parent objects in both the Hosts and *Clusters* view and the *VMs & Templates* view.
1. Perform agentless migration: To perform agentless migration, ensure the vCenter account used by the Azure Migrate appliance has permissions at all required levels—datacenter, cluster, host, VM, and datastore. Apply permissions at each level to avoid replication errors.

    | Privilege Name in the vSphere Client  | The purpose for the privilege  | Required On | Privilege Name in the API  |
    | --- | --- | --- | --- |
    | Browse datastore  | Allow browsing of VM log files to troubleshoot snapshot creation and deletion.  | Data stores  | Datastore.Browse  |
    | Low level file operations  | Allow read/write/delete/rename operations in the datastore browser to troubleshoot snapshot creation and deletion. |Data stores  | Datastore.FileManagement  |
    | Change Configuration - Toggle disk change tracking  | Allow enable or disable change tracking of VM disks to pull changed blocks of data between snapshots.  | Virtual machines  | VirtualMachine.Config.ChangeTracking  |
    | Change Configuration - Acquire disk lease  | Allow disk lease operations for a VM to read the disk using the VMware vSphere Virtual Disk Development Kit (VDDK).  | Virtual machines  | VirtualMachine.Config.DiskLease |
    | Provisioning - Allow read-only disk access  | Allow read-only disk access: Allow opening a disk on a VM to read the disk using the VDDK. | Virtual machines  | VirtualMachine.Provisioning.DiskRandomRead  |
    | Provisioning - Allow disk access  | Allow opening a disk on a VM to read the disk using the VDDK.  | Virtual machines  | VirtualMachine.Provisioning.DiskRandomAccess  |
    | Provisioning - Allow virtual machine download  | Allow virtual machine download: Allows read operations on files associated with a VM to download the logs and troubleshoot if failure occurs.  | Root host or vCenter Server  | VirtualMachine.Provisioning.GetVmFiles  |
    | Snapshot management  | Allow Discovery, Software Inventory, and Dependency Mapping on VMs.  | Virtual machines  | VirtualMachine.State.*  |
    | Guest operations  | Allow creation and management of VM snapshots for replication. | Virtual machines | VirtualMachine.GuestOperations.*  |
    | Interaction Power Off | Allow the VM to be powered off during migration to Azure.  | Virtual machines | VirtualMachine.Interact.PowerOff  |

### Enable Guest Discovery with Server Credentials

Quick guest discovery: For quick discovery of software inventory, server dependencies, and database instances, you need the following permissions:

| Use case  | Discovered Metadata  | Credentials |Guest Account Configuration |
| --- | --- | --- |
| Quick guest discovery  | Software inventory <br /><br /> Server dependencies (limited data)* <br /><br />Inventory of Database instances  | Windows <br /><br /> Linux | Local guest user account <br /><br /> Any non-sudo guest user account. |

### Limitations

You can use a Windows guest or a Linux non-sudo user account to get dependency mapping data, but the following limitation can happen.

With least privileged accounts, you might not collect process information (like process name or app name) for some processes that run with higher privileges. These processes will show as **Unknown** processes under the machine in the single server view.

**In-depth guest discovery**: For in-depth discovery of software inventory, server dependencies, and web apps such as .NET and Java Tomcat, you need the following permissions:

| Use case  | Discovered Metadata  | Credentials  | Commands to Configure|
| --- | --- | --- |
| In-depth guest discovery  | Software inventory <br /><br /> Server dependencies (full data) <br /><br /> Inventory of Database instances <br /><br /> Web apps like .NET, Java Tomcat  | Windows <br /><br /> Linux <br /><br /> **Windows:** Administrator account <br /><br /> **Linux:** Following sudo permissions are required to identify server dependencies: <br /><br /> `/usr/bin/netstat, /usr/bin/ls` <br /><br /> If netstat is not available, sudo permissions on `ss` are required.<br /><br /> For Java webapps discovery (Tomcat servers), the user should have read and execute (r-x) permissions on all Catalina homes.<br /><br /> Execute the following command to find all catalina homes:<br /><br /> `ps -ef | grep catalina.home` <br /><br /> Here is a sample command to set up least privileged user: <br /><br /> `setfacl -m u:johndoe:rx <catalina/home/path>`|

## Discovery of Hyper-V estate

To find the basic settings of servers running in the Hyper-V estate, the following permissions are needed.

Hyper-V server account: On all the Hyper-V hosts, create a local user that’s part of the three groups:

- Hyper-V Administrators  
- Performance Monitor Users  
- Remote Management Users   

Use the [script](tutorial-discover-hyper-v.md#prepare-hyper-v-hosts) to prepare Hyper-V hosts.   

For deep discovery of Hyper-V estate and to perform software inventory and dependency analysis, guest account credentials are required. The guest account should have the following permissions:

### Discovery of physical and Cloud servers

#### Quick server discovery

| Discovered metadata  | Credentials | Access Configuration for Guest User | 
| --- | --- | --- |
| Software inventory <br /><br /> Agentless dependency analysis (limited data)* <br /><br /> Workload inventory of databases and web apps   | Windows  | A Windows user account that belongs to the following user groups <br /><br /> Remote Management Users <br /><br /> Performance Monitor Users <br /><br /> Performance Log Users <br /><br /> The guest user account needs permission to access the CIMV2 namespace and its sub-namespaces in the WMI Control Panel. Follow the below steps to set the access. |

1. On the target Windows server, open the **Start menu**, search for **Run**, and then select it.
1. In the **Run** dialog box, type `wmimgmt.msc` and then press **Enter**.
    The **wmimgmt console** opens where you can find **WMI Control** (Local) in the left pane
1. Right-click it, and then select **Properties** from the menu. 
1. In the **WMI Control** (Local) **Properties** dialog, and then select the **Securities** tab. 
1. On the **Securities** tab, expand the **Root** folder in the namespace tree and then select the `cimv2 namespace`. 
1. Select **Security** to open the Security for `ROOT\cimv2` dialog. 
    Under the **Group** or users names section, select **Add** to open the **Select Users**, Computers, Service Accounts or Groups dialog. 
1. Search for the user account, select it, and then select **OK** to return to the Security for `ROOT\cimv2` dialog. 
1. In the Group or users names section, select the guest user account. Validate if the following permissions are allowed: 
    -  Enable account 
    - Remote enable 

    :::image type="content" source="~/media/best-practices-least-privileged-accounts/security-for-root.png" alt-text="Screenshot shows the guest user permissions." lightbox="./media/best-practices-least-privileged-accounts/security-for-root.png" :::

1. Select **Apply** to enable the permissions set on the user account. 
1. Restart WinRM service after you add the new guest user.  

| Discovered metadata  | Credentials  | Commands to Configure | 
| --- | --- | --- | 
| Software inventory <br /><br /> Agentless dependency analysis (full data) <br /><br />Workload inventory of databases and web apps   | Linux  | The user account should have sudo privileges on the following file paths. <br /><br /> AzMigrateLeastprivuser ALL=(ALL) NOPASSWD: `/usr/sbin/dmidecode, /usr/sbin/fdisk -l, /usr/sbin/fdisk -l , /usr/bin/ls -l /proc//exe, /usr/bin/netstat -atnp, /usr/sbin/lvdisplay ""` Defaults:AzMigrateLeastprivuser !requiretty |

In-depth server discovery

| Discovered metadata  | Credentials  | Commands to Configure | 
| --- | --- | --- | 
| In-depth discovery of web apps such as .NET and Java Tomcat <br /><br />Agentless dependency analysis (full data)* <br /><br />In-depth discovery of web apps such as .NET and Java Tomcat | Windows <br /><br /> Linux  | Administrator <br /><br />For discovering Java webapps (Tomcat servers), the user account needs read and execute (r-x) permissions on all Catalina home directories.<br /><br />Execute the following command to find out all catalina homes: `ps -ef | grep catalina.home`<br /><br />Here is a sample command to set up least privileged user: `setfacl -m u:johndoe:rx <catalina/home/path>` |

### In-depth Databases discovery

Software inventory is required for initiating workload discovery. Ensure that guest credentials are added to enable it. The permissions to discover SQL and MySQL databases are the same for all appliance types—VMware, Hyper-V, and physical servers. 

#### Discover SQL server instances and database:    

Create least privileged accounts on individual SQL server instance. Use Windows authentication and assign only the required permissions.

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
> [!Note]
> Create Least privileged accounts on multiple SQL server instances, for more inforamtion to setup [least privileged](least-privilege-credentials.md) custom SQL accounts at scale.  

### Discover MySQL server instances and database    

To discover MySQL database, add MySQL DB credentials to appliance.  

Ensure that the user corresponding to the added MySQL credentials have the following privileges: 
- Select permission on information_schema tables. 
- Select permission on mysql.users table. 

Use the following commands to grant the necessary privileges to the MySQL user: 

`GRANT USAGE ON . TO 'newuser'@'localhost'; GRANT PROCESS ON . TO 'newuser'@'localhost'; GRANT SELECT (User, Host, Super_priv, File_priv, Create_tablespace_priv, Shutdown_priv) ON mysql.user TO 'newuser'@'localhost'; FLUSH PRIVILEGES;`

## Next steps

- Learn how to [Discover VMware estate](tutorial-discover-vmware.md).

- Learn how to [Discover Hyper-V estate](tutorial-discover-hyper-v.md).

- Learn how to [Discover physical servers or servers running in public cloud](tutorial-discover-physical.md).