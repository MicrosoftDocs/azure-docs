---
title: Handle stored procedure execution timeout in the SQL connector
description: How to work with long-running stored procedures that exceed the SQL connector's timeout limit for Azure Logic Apps
services: logic-apps
ms.suite: integration
ms.reviewer: camerost, logicappspm
ms.topic: conceptual
ms.date: 10/26/2020
---

# Handle stored procedure execution timeout for the SQL connector in Azure Logic Apps

When your logic app works with result sets so large that the [SQL connector](connectors-create-api-sqlazure.md) doesn't return all the results at the same time, or you want better control over the size and structure for your result sets, you can create a [stored procedure](/sql/relational-databases/stored-procedures/stored-procedures-database-engine) that organizes the results the way that you want. The SQL connector provides many backend features that you can access by using Azure Logic Apps so that you can more easily automate business tasks that work with SQL database tables.

For example, when getting or inserting multiple rows, your logic app can iterate through these rows by using an [**Until** loop](../logic-apps/logic-apps-control-flow-loops.md#until-loop) within these [limits](../logic-apps/logic-apps-limits-and-config.md). However, when your logic app has to work with record sets so large, for example, thousands or millions of rows, that you want to minimize the costs resulting from calls to the database. For more information, see [Handle bulk data using the SQL connector](../connectors/connectors-create-api-sqlazure.md#handle-bulk-data).

<a name="timeout-limit"></a>

## Timeout limit on stored procedure execution

The SQL connector has a stored procedure timeout limit that's [less than 2-minutes](/connectors/sql/#known-issues-and-limitations). Some stored procedures might take longer than this limit to run and finish, generating a `504 TIMEOUT` error. Actually, some long-running processes are coded as stored procedures explicitly for this purpose. Due to the timeout limit, calling these procedures from Azure Logic Apps might create problems. Although the SQL connector doesn't natively support an asynchronous mode, you can simulate this mode by using a SQL completion trigger, native SQL pass-through query, a state table, and server-side jobs by using the [Azure Elastic Job Agent](../azure-sql/database/elastic-jobs-overview.md) for [Azure SQL Database](../azure-sql/database/sql-database-paas-overview.md). For [SQL Server on premises](/sql/sql-server/sql-server-technical-documentation) and [Azure SQL Managed Instance](../azure-sql/managed-instance/sql-managed-instance-paas-overview.md), you can use the [SQL Server Agent](/sql/ssms/agent/sql-server-agent).

For example, suppose that you have the following long-running stored procedure, which takes longer than the timeout limit to finish running. If you run this stored procedure from a logic app by using the SQL connector, you get an `HTTP 504 Gateway Timeout` error as the result.

```sql
CREATE PROCEDURE [dbo].[WaitForIt]
   @delay char(8) = '00:03:00'
AS
BEGIN
   SET NOCOUNT ON;
   WAITFOR DELAY @delay
END
```

Rather than directly call the stored procedure, you can run the procedure asynchronously in the background by using a job agent. You can store the inputs and outputs in a state table that you can then interact with by using a trigger in your logic app. If you don't need the inputs and outputs, or if you're already writing the results to a table in the stored procedure, you can simplify this approach.

> [!IMPORTANT]
> Make sure that your stored procedure can run multiple times without affecting the results. 
> If the asynchronous processing fails or times out, the job agent might have to retry your 
> stored procedure multiple times. To avoid duplicating output, before you create any objects, 
> make sure that you check for their existence.

<a name="azure-sql-database"></a>

## Job agent for Azure SQL Database

To create a job that can run the stored procedure for [Azure SQL Database](../azure-sql/database/sql-database-paas-overview.md), you can use the [Azure Elastic Job Agent](../azure-sql/database/elastic-jobs-overview.md). Create this job agent in the Azure portal, which adds several stored procedures to a database that the agent uses, also known as the *agent database*. You can then create a job that runs your stored procedure in the target database and captures the output when finished.

Before you can create the job, you need to set up permissions, groups, and targets as described by the [full documentation for the Azure Elastic Job Agent](../azure-sql/database/elastic-jobs-overview.md). Also, you need to create certain supporting tables and procedures in the agent database as described in the following sections.

<a name="create-state-table"></a>

### Create state table for registering parameters and storing inputs

SQL Agent Jobs doesn't accept input parameters for calling stored procedures. So instead, in the target database, create a state table where you register the parameters and store the inputs to use for calling your stored procedures. 
All agent job steps run against the target database, but job stored procedures run against the agent database. 

To create the state table, use this schema:

```sql
CREATE TABLE [dbo].[LongRunningState](
   [jobid] [uniqueidentifier] NOT NULL,
   [rowversion] [timestamp] NULL,
   [parameters] [nvarchar](max) NULL,
   [start] [datetimeoffset](7) NULL,
   [complete] [datetimeoffset](7) NULL,
   [code] [int] NULL,
   [result] [nvarchar](max) NULL,
   CONSTRAINT [PK_LongRunningState] PRIMARY KEY CLUSTERED
      (   [jobid] ASC
      )WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF) ON [PRIMARY]
      ) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
```

Here's how the resulting table looks in [SQL Server Management Studio (SMSS)](/sql/ssms/download-sql-server-management-studio-ssms):

![Screenshot that shows created state table that stores inputs for stored procedure.](media/handle-long-running-stored-procedures-sql-connector/state-table-input-parameters.png)

To ensure good performance and make sure that the agent job can find the associated record, the table uses the job execution ID (`jobid`) as the primary key. If you want, you can also add individual columns for the input parameters. If you want, the previously described schema can more generally handle multiple parameters but is limited to the size calculated by `NVARCHAR(MAX)`.

<a name="create-top-level-job"></a>

### Create a top-level job to run the stored procedure

To execute the long-running stored procedure, create this top-level job agent in the agent database:

```sql
EXEC jobs.sp_add_job 
   @job_name='LongRunningJob',
   @description='Execute Long-Running Stored Proc',
   @enabled = 1
```

Now, add steps to the job that parameterizes, runs, and completes the stored procedure. By default, a job step times out after 12 hours. If your stored procedure needs more time, or if you want the procedure to time out earlier, you can set the `step_timeout_seconds` parameter to another value in seconds. Also, by default, a step has 10 built-in retries with a back-off timeout between each retry, which you can use to your advantage.

Here are the steps to add:

1. Wait for the parameters to appear in the `LongRunningState` table.

   This first step waits for the parameters to get added in `LongRunningState` table, which happens soon after the job starts. If the job execution ID (`jobid`) doesn't get added to the `LongRunningState` table, the step merely fails, and the default retry or back-off does the waiting:

   ```sql
   EXEC jobs.sp_add_jobstep
      @job_name='LongRunningJob',
      @step_name= 'Parameterize WaitForIt',
      @step_timeout_seconds = 30,
      @command= N'
         IF NOT EXISTS(SELECT [jobid] FROM [dbo].[LongRunningState]
               WHERE jobid = $(job_execution_id))		
            THROW 50400, ''Failed to locate call parameters (Step1)'', 1',	@credential_name='JobRun',
      @target_group_name='DatabaseGroupLongRunning'
   ```

1. Query the parameters from the state table and pass them to the stored procedure. This step also runs the procedure in the background. 

   If your stored procedure doesn't need parameters, just directly call the stored procedure. Otherwise, to pass the `timespan` parameter, use the `@callparams`, which you can also extend to pass additional parameters.

   ```sql
   EXEC jobs.sp_add_jobstep
      @job_name='LongRunningJob',
      @step_name='Execute WaitForIt',
      @command=N'
         DECLARE @timespan char(8)
         DECLARE @callparams NVARCHAR(MAX)
         SELECT @callparams = [parameters] FROM [dbo].[LongRunningState]
            WHERE jobid = $(job_execution_id))
         SET @timespan = @callparams
         EXECUTE [dbo].[WaitForIt] @delay = @timespan', 
      @credential_name='JobRun',
      @target_group_name='DatabaseGroupLongRunning'
   ```

1. Complete the job and record the results.

   ```sql
   EXEC jobs.sp_add_jobstep
      @job_name='LongRunningJob',
      @step_name='Complete WaitForIt',
      @command=N'
         UPDATE [dbo].[LongRunningState]
            SET [complete] = GETUTCDATE(),
               [code] = 200,
               [result] = ''Success''
            WHERE jobid = $(job_execution_id)',
      @credential_name='JobRun',
      @target_group_name='DatabaseGroupLongRunning'
   ```

### Start job and pass parameters

To start the job, in your logic app, use the **Execute a SQL query** action with a passthrough native query and immediately push the parameters into the state table for the job to reference. The dynamic data output `Results JobExecutionId` as the input to the `jobid` attribute in the target table. Add the appropriate parameters for the job to unpackage them and pass them to the target stored procedure.



<a name="sql-on-premises-or-managed-instance"></a>

## Job agent for SQL Server or Azure SQL Managed Instance

For [SQL Server on premises](/sql/sql-server/sql-server-technical-documentation) and [Azure SQL Managed Instance](../azure-sql/managed-instance/sql-managed-instance-paas-overview.md), you can use the [SQL Server Agent](/sql/ssms/agent/sql-server-agent). Although some management details differ, the fundamental steps remain the same.

## Next steps

