<properties
   pageTitle="Monitor your workload using DMVs | Microsoft Azure"
   description="Learn how to monitor your workload using DMVs."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="sahaj08"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="08/06/2015"
   ms.author="sahajs"/>

# Monitor your workload using DMVs

This article describes how to use Dynamic Management Views (DMVs) to monitor your workload and investigate query execution in Azure SQL Data Warehouse.

## Permissions

In SQL Data Warehouse, querying a dynamic management view requires **VIEW DATABASE STATE** permissions. The **VIEW DATABASE STATE** permission returns information about all objects within the current database.
To grant the **VIEW DATABASE STATE** permission to a specific database user, run the following query:

    GRANT VIEW DATABASE STATE TO database_user;


## Monitor Connections

You can use the *sys.dm_pdw_nodes_exec_connections* view to retrieve information about the connections established to your Azure SQL Data Warehouse database. In addition, the *sys.dm_exec_sessions* view is helpful when retrieving information about all active user connections.

    SELECT * FROM sys.dm_pdw_nodes_exec_connections;
    SELECT * FROM sys.dm_pdw_nodes_exec_sessions;

Use the following query to retrieve the information on the current connection.

    SELECT * 
    FROM sys.dm_pdw_nodes_exec_connections AS c 
        JOIN sys.dm_pdw_nodes_exec_sessions AS s 
        ON c.session_id = s.session_id 
    WHERE c.session_id = @@SPID;

  

## Investigate Data Skew

    -- Find data skew for a distributed table
    DBCC PDW_SHOWSPACEUSED("dbo.FactInternetSales");

The result of this query will show you the number of table rows that are stored in each of the 60 distributions of your database. For optimal performance, the rows in your distributed table should be spread evenly across all the distributions.
To learn more, see [table design][].


## Investigate Query Execution
You might encounter situations where your query is not completing or is running longer than expected. In such cases you can use the following steps to collect data and narrow down the issue.

### STEP 1: Find the query to investigate

    -- Monitor running queries
    SELECT * FROM sys.dm_pdw_exec_requests WHERE status = 'Running';
    
    -- Find the longest running queries
    SELECT * FROM sys.dm_pdw_exec_requests ORDER BY total_elapsed_time DESC;

Save the Request ID of the query.

  
### STEP 2: Check if the query is waiting for resources

    -- Find waiting tasks for your session.
    -- Replace request_id with value from Step 1.
    
    SELECT waits.session_id,
            waits.request_id,  
            requests.command,
            requests.status, 
            requests.start_time,  
            waits.type,  
            waits.object_type, 
            waits.object_name,  
            waits.state  
    FROM   sys.dm_pdw_waits waits 
      JOIN  sys.dm_pdw_exec_requests requests
      ON waits.request_id=requests.request_id 
    WHERE waits.request_id = 'QID33188'
    ORDER BY waits.object_name, waits.object_type, waits.state;

The results of the above query will show you the wait state of your request.
- If the query is waiting on resources from another query, then the state will be **AcquireResources**.
- If the query has all the required resources and is not waiting, then the state will be **Granted**. In this case, proceed to look at the query steps.


### STEP 3: Find the longest running step of the query

    -- Find the distributed query plan steps for a specific query.
    -- Replace request_id with value from Step 1.
    
    SELECT * FROM sys.dm_pdw_request_steps
    WHERE request_id = 'QID33209'
    ORDER BY step_index;

Use the Request ID to retrieve a list of all the distributed query steps. Find the long-running step by looking at the total elapsed time. Save the Step Index.


### STEP 4: Find the execution progress of a SQL Step

    -- Find the distribution run times for a SQL step.
    -- Replace request_id and step_index with values from Step 1 and 3.
    
    SELECT * FROM sys.dm_pdw_sql_requests
    WHERE request_id = 'QID33209' AND step_index = 2;

Use the Request ID and the Step Index to retrieve information about the SQL Step. 


### STEP 5: Find the execution progress of a DMS Step

    -- Find the information about all the workers completing a Data Movement Step.
    -- Replace request_id and step_index with values from Step 1 and 3.
    
    SELECT * FROM sys.dm_pdw_dms_workers
    WHERE request_id = 'QID33209' AND step_index = 2;

Use the Request ID and the Step Index to retrieve information about the Data Movement Step.
  


## Next steps
For more tips on managing your SQL Data Warehouse, see [manage overview][].

<!--Image references-->

<!--Article references-->
[manage overview]: sql-data-warehouse-overview-manage.md
[table design]: sql-data-warehouse-develop-table-design.md

<!--MSDN references-->


