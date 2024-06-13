---
author: ajithkr-ms
ms.service: sql-database
ms.topic: include
ms.date: 04/12/2023
ms.author: ajithkr-ms
---


# Permissions required for SQL Server Assessment 
The login used to connect to a source SQL Server instance needs certain minimal permissions to query the requisite information. The required permissions are as follows:

|Database|Permission|Object(s)|
|-|-|-|
|master|CONNECT ANY DATABASE||
|master|SELECT|sys.sql_expression_dependencies|
|master|EXECUTE|sys.xp_regenumkeys|
|master|VIEW DATABASE STATE||
|master|VIEW SERVER STATE||
|master|VIEW ANY DEFINITION||
|msdb|EXECUTE|dbo.agent_datetime|
|msdb|SELECT|dbo.sysjobsteps|
|msdb|SELECT|dbo.syssubsystems|
|msdb|SELECT|dbo.sysjobhistory|
|msdb|SELECT|dbo.syscategories|
|msdb|SELECT|dbo.sysjobs|
|msdb|SELECT|dbo.sysmaintplan_plans|
|msdb|SELECT|dbo.syscollector_collection_sets|
|msdb|SELECT|dbo.sysmail_profile|
|msdb|SELECT|dbo.sysmail_profileaccount|
|msdb|SELECT|dbo.sysmail_account|
|All User Databases|VIEW DATABASE STATE||
|All User Databases|SELECT|sys.sql_expression_dependencies|
  
## Special considerations for Always On Availability Groups
For SQL Server instances that host availability group replicas, it's recommended to provision a Windows Domain account with required permissions for assessment. 
  
When SQL Server Authentication or a local Windows login is used, mismatched SIDs can prevent the custom login from resolving on the other replicas of the Always On Availability Group. To prevent this issue, after the login is created on the first of all the instances that host an Always On Availability Group, note the SID of the login created. Provide this SID as a parameter when creating the login in the instances hosting the remaining replicas of the Always On Availability Group.
   
## Configure the custom login for Assessment

The following are sample scripts for creating a login and provisioning it with the necessary permissions.

### Windows Authentication 
  
  ```sql
  -- Create a login to run the assessment
  use master;
	-- If a SID needs to be specified, add here
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

### SQL Server Authentication
  
   ```sql
  -- Create a login to run the assessment
  use master;
	-- If a SID needs to be specified, add here
    DECLARE @SID NVARCHAR(MAX) = N'';
	IF (@SID = N'')
	BEGIN
		CREATE LOGIN [evaluator]
			WITH PASSWORD = '<provide a strong password>'
	END
	ELSE
	BEGIN
		CREATE LOGIN [evaluator]
			WITH PASSWORD = '<provide a strong password>'
			, SID = @SID 
	END
	SELECT @SID = N'0x'+CONVERT(NVARCHAR, sid, 2) FROM sys.syslogins where name = 'evaluator'
	IF (ISNULL(@SID,'') != '')
		PRINT N'Created login [evaluator] with SID = '+@SID
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

## How to use the permissions script

The permissions script can be used as follows:

- Save the appropriate permissions script (with valid password string) as an _.sql_ file, say _c:\workspace\MinPermissions.sql_
- Connect to the instance(s) using an account with sysadmin permissions and execute the script. You can use **SQL Server Management Studio** or **sqlcmd**. The following example uses a trusted connection.

   ```cmd
      sqlcmd.exe -S sourceserver\sourceinstance -d master -E -i c:\workspace\MinPermissions.sql
   ```
- Use the minimal permissions account for further connections.
