---
title: Handle Timeouts During Long SQL Operations
description: Learn to control the size and structure for SQL result sets and handle timeouts for long-running stored procedures in workflows for Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewers: estfan, camerost, azla
ms.topic: how-to
ms.custom: sfi-image-nochange
ms.date: 10/19/2025
#Customer intent: As an integration developer who works in Azure Logic Apps, I want to manage large result sets and timeouts during long-running stored procedures in SQL databases.
---

# Control large SQL result sets and timeouts during stored procedures in workflows for Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

To more easily automate business tasks that work with SQL databases, your workflow can use [**SQL Server** connector operations](../connectors/connectors-create-api-sqlazure.md), which provides many backend features for workflows to use in [Azure Logic Apps](logic-apps-overview.md).

In some situations, your workflow might have to handle large result sets. These result sets might be so large that **SQL Server** connector operations don't return all the results at the same time. In other situations, you might just want more control over the size and structure for your result sets. To organize the results in the way that you want, you can create a [stored procedure](/sql/relational-databases/stored-procedures/stored-procedures-database-engine).

For example, when a **SQL Server** connector action gets or inserts multiple rows, your workflow can iterate through these rows by using an [**Until** loop](logic-apps-control-flow-loops.md#until-loop) that works within these [limits](logic-apps-limits-and-config.md). If your workflow must handle thousands or millions of rows, you want to minimize the costs resulting from **SQL Server** connector action calls to the SQL database. For more information, see [Handle bulk data using the SQL connector](../connectors/connectors-create-api-sqlazure.md#handle-bulk-data).

This guide shows how to control the size, structure, and timeouts when processing large result sets using the **SQL Server** connector actions.

<a name="timeout-limit"></a>

## Timeout limit on stored procedure execution

The **SQL Server** connector has an **Execute stored procedure** action with timeout limit that's [less than two minutes](/connectors/sql/#known-issues-and-limitations). Some stored procedures might take longer than this limit to complete, which causes a **504 Timeout** error. Sometimes long-running processes are coded as stored procedures explicitly for this purpose. Due to the timeout limit, calling such procedures from Azure Logic Apps might create problems.

The **SQL Server** connector operations don't natively support an asynchronous mode. To work around this limitation, simulate this mode by using the following items:

 - SQL completion trigger
 - Native SQL pass-through query
 - State table
 - Server-side jobs

For example, suppose that you have the following long-running stored procedure. To finish running, the procedure exceeds the timeout limit. If you run this stored procedure from a workflow using the **SQL Server** connector action named **Execute stored procedure**, you get the **HTTP 504 Gateway Timeout** error.

```sql
CREATE PROCEDURE [dbo].[WaitForIt]
   @delay char(8) = '00:03:00'
AS
BEGIN
   SET NOCOUNT ON;
   WAITFOR DELAY @delay
END
```

Rather than directly call the stored procedure, you can asynchronously run the procedure in the background by using a *job agent*. You can store the inputs and outputs in a state table that you can then access and manage through your workflow. If you don't need the inputs and outputs, or if you're already writing the results to a table in the stored procedure, you can simplify this approach.

> [!IMPORTANT]
>
> Make sure that your stored procedure and all jobs are *idempotent*, which means that they can run multiple times without affecting the results. If the asynchronous processing fails or times out, the job agent might retry the stored procedure multiple times. Before you create any objects and to avoid duplicating output, see these [best practices and approaches](/azure/azure-sql/database/elastic-jobs-overview#idempotent-scripts).

To asynchronously run the procedure in the background with job agent for cloud-based SQL Server, follow the steps to [create and use the Azure Elastic Job Agent for Azure SQL Database](#azure-sql-database).

For on-premises SQL Server and Azure SQL Managed Instance, [create and use the SQL Server Agent](#sql-on-premises-or-managed-instance) instead. The fundamental steps remain the same as setting up a job agent for Azure SQL Database.

<a name="azure-sql-database"></a>

## Create job agent for Azure SQL Database

To create a job agent that can run stored procedures for Azure SQL Database, create and use the [Azure Elastic Job Agent](/azure/azure-sql/database/elastic-jobs-overview#elastic-job-agent). However, before you can create this job agent, you must set up the permissions, groups, and targets as described in the [Azure Elastic Job Agent documentation](/azure/azure-sql/database/elastic-jobs-overview). You must also create a supporting state table in the target database, as described in the following sections.

To create the job agent, perform this task in the Azure portal. This approach adds several stored procedures to the database used by the agent, also known as the *agent database*. You can then create a job agent that runs your stored procedure in the target database and captures the output when finished.


<a name="create-state-table"></a>

### Create state table for registering parameters and storing inputs

SQL Agent Jobs don't accept input parameters. Instead, in the target database, create a state table where you register the parameters and store the inputs to use for calling your stored procedures. All of the agent job steps run against the target database, but the job's stored procedures run against the agent database. 

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

:::image type="content" source="media/handle-long-running-stored-procedures-sql-connector/state-table-input-parameters.png" alt-text="Screenshot shows created state table that stores inputs for stored procedure.":::

To ensure good performance and make sure that the job agent can find the associated record, the table uses the job execution ID (`jobid`) as the primary key. If you want, you can also add individual columns for the input parameters. The previously described schema can more generally handle multiple parameters but is limited to the size calculated by the `NVARCHAR(MAX)` function.

<a name="create-top-level-job"></a>

### Create a top-level job to run the stored procedure

To execute the long-running stored procedure, create this top-level job agent in the agent database:

```sql
EXEC jobs.sp_add_job 
   @job_name='LongRunningJob',
   @description='Execute Long-Running Stored Proc',
   @enabled = 1
```

Add steps to the job that parameterize, run, and complete the stored procedure. By default, a job step times out after 12 hours. If your stored procedure needs more time, or if you want the procedure to time out earlier, you can change the `step_timeout_seconds` parameter to another value that's specified in seconds. By default, a step has 10 built-in retries with a backoff timeout between each retry, which you can use to your advantage.

Here are the steps to add:

1. Wait for the parameters to appear in the `LongRunningState` table.

   This first step waits for the parameters to get added in `LongRunningState` table, which happens soon after the job starts. If the job execution ID (`jobid`) doesn't get added to the `LongRunningState` table, the step merely fails. The default retry or backoff timeout does the waiting:

   ```sql
   EXEC jobs.sp_add_jobstep
      @job_name='LongRunningJob',
      @step_name= 'Parameterize WaitForIt',
      @step_timeout_seconds = 30,
      @command= N'
         IF NOT EXISTS(SELECT [jobid] FROM [dbo].[LongRunningState]
            WHERE jobid = $(job_execution_id))
            THROW 50400, ''Failed to locate call parameters (Step1)'', 1',
      @credential_name='JobRun',
      @target_group_name='DatabaseGroupLongRunning'
   ```

1. Query the parameters from the state table and pass them to the stored procedure. This step also runs the procedure in the background. 

   If your stored procedure doesn't need parameters, directly call the stored procedure. Otherwise, to pass the `@timespan` parameter, use the `@callparams`, which you can also extend to pass more parameters.

   ```sql
   EXEC jobs.sp_add_jobstep
      @job_name='LongRunningJob',
      @step_name='Execute WaitForIt',
      @command=N'
         DECLARE @timespan char(8)
         DECLARE @callparams NVARCHAR(MAX)
         SELECT @callparams = [parameters] FROM [dbo].[LongRunningState]
            WHERE jobid = $(job_execution_id)
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

<a name="start-job-pass-parameters"></a>

### Start the job and pass the parameters

To start the job, use a passthrough native query with the [**Execute a SQL query** action](/connectors/sql/#execute-a-sql-query-(v2)) and immediately push the job's parameters into the state table. To provide input to the `jobid` attribute in the target table, Azure Logic Apps adds a **For each** loop that iterates through the table output from the preceding action. For each job execution ID, run an **Insert row** action that uses the dynamic data output named `ResultSets JobExecutionId` to add the parameters for the job to unpack and pass to the target stored procedure.

:::image type="content" source="media/handle-long-running-stored-procedures-sql-connector/start-job-actions.png" alt-text="Screenshot shows the Insert row action and the preceding actions in the workflow." lightbox="media/handle-long-running-stored-procedures-sql-connector/start-job-actions.png":::

When the job completes, the job updates the `LongRunningState` table. From a different workflow, you can trigger on the result by using the trigger named [**When an item is modified**](/connectors/sql/#when-an-item-is-modified-(v2)). If you don't need the output, or if you already have a trigger that monitors an output table, you can skip this part.

:::image type="content" source="media/handle-long-running-stored-procedures-sql-connector/trigger-on-results-after-job-completes.png" alt-text="Screenshot shows the SQL trigger for when an item is modified." lightbox="media/handle-long-running-stored-procedures-sql-connector/trigger-on-results-after-job-completes.png":::

<a name="sql-on-premises-or-managed-instance"></a>

## Create job agent for SQL Server or Azure SQL Managed Instance

For [on-premises SQL Server](/sql/sql-server/sql-server-technical-documentation) and [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview), create and use the [SQL Server Agent](/sql/ssms/agent/sql-server-agent). Compared to the cloud-based job agent for Azure SQL Database, some management details differ, but the fundamental steps remain the same.

## Next step

- [Connect to SQL databases from workflows in Azure Logic Apps](../connectors/connectors-create-api-sqlazure.md)

