---
author: ajithkr-ms
ms.service: sql-database
ms.topic: include
ms.date: 12/19/2022
ms.author: ajithkr-ms
---

  The login used to connect to a source SQL Server instance requires certain minimal permissions to query the requisite information. The following script shows creation of a SQL Server login with the requisite permissions.

   ```sql
    -- Create a login to run the assessment
    use master;
        CREATE LOGIN [evaluator]
            WITH PASSWORD = '<provide a strong password>'
    GO    
    
    -- Create user in every database other than tempdb and model and provide minimal read-only permissions. 
    use master;
        EXECUTE sp_MSforeachdb 'USE [?]; IF (''?'' NOT IN (''tempdb'',''model''))  CREATE USER [evaluator] FOR LOGIN [evaluator]'
        EXECUTE sp_MSforeachdb 'USE [?]; IF (''?'' NOT IN (''tempdb'',''model''))  GRANT SELECT ON sys.sql_expression_dependencies TO [evaluator]'
        EXECUTE sp_MSforeachdb 'USE [?]; IF (''?'' NOT IN (''tempdb'',''model''))  GRANT VIEW DATABASE STATE TO [evaluator]'
    GO
    
    -- Provide server level read-only permissions
    use master;
        GRANT SELECT ON sys.sql_expression_dependencies TO [evaluator]
        GRANT EXECUTE ON OBJECT::sys.xp_regenumkeys TO [evaluator];
        GRANT VIEW DATABASE STATE TO evaluator
        GRANT VIEW SERVER STATE TO evaluator
        GRANT VIEW ANY DEFINITION TO evaluator
    GO
    
    -- Required from SQL 2014 onwards for database connectivity.
    use master;
        GRANT CONNECT ANY DATABASE TO evaluator
    GO
    
    -- Provide msdb specific permissions
    use msdb;
        GRANT EXECUTE ON [msdb].[dbo].[agent_datetime] TO [evaluator]
        GRANT SELECT ON [msdb].[dbo].[sysjobsteps] TO [evaluator]
        GRANT SELECT ON [msdb].[dbo].[syssubsystems] TO [evaluator]
        GRANT SELECT ON [msdb].[dbo].[sysjobhistory] TO [evaluator]
        GRANT SELECT ON [msdb].[dbo].[syscategories] TO [evaluator]
        GRANT SELECT ON [msdb].[dbo].[sysjobs] TO [evaluator]
        GRANT SELECT ON [msdb].[dbo].[sysmaintplan_plans] TO [evaluator]
        GRANT SELECT ON [msdb].[dbo].[syscollector_collection_sets] TO [evaluator]
        GRANT SELECT ON [msdb].[dbo].[sysmail_profile] TO [evaluator]
        GRANT SELECT ON [msdb].[dbo].[sysmail_profileaccount] TO [evaluator]
        GRANT SELECT ON [msdb].[dbo].[sysmail_account] TO [evaluator]
    GO
    
    -- Clean up
    --use master;
    -- EXECUTE sp_MSforeachdb 'USE [?]; DROP USER [evaluator]'
    -- DROP LOGIN [evaluator]
    --GO
   ```

  Here's how the permissions script can be used:

   - Save the permissions script (with valid password string) as an _.sql_ file, say _c:\workspace\MinPermissions.sql_
   - Connect to the instance(s) using an account with sysadmin permissions and execute the script. You can use **SQL Server Management Studio** or **sqlcmd**. The following example uses a trusted connection.
   ```cmd
      sqlcmd.exe -S sourceserver\sourceinstance -d master -E -i c:\workspace\MinPermissions.sql
   ```
   - Use the minimal permissions account so created for further connections.

