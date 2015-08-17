<properties
	title="Getting started with elastic database jobs"
	pageTitle="Getting started with elastic database jobs"
	description="how to use elastic database jobs"
	metaKeywords="azure sql database elastic jobs"
	services="sql-database"
	documentationCenter=""  
	manager="jeffreyg"
	authors="sidneyh"/>

<tags
	ms.service="sql-database"
	ms.workload="sql-database"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/04/2015"
	ms.author="sidneyh; ddove" />

# Getting started with Elastic Database jobs

Elastic Database jobs (preview) for Azure SQL Database allows you to reliability execute T-SQL scripts that span multiple databases while automatically retrying and providing eventual completion guarantees. For more information about the Elastic Database job feature, please see the [feature overview page](sql-database-elastic-jobs-overview.md).

This topic extends the sample found in [Getting started with Elastic Database tools](sql-database-elastic-scale-get-started.md). When completed, you will: learn how to create and manage jobs that manage a group of related databases.

## Prerequisites

Download and run the [Getting started with Elastic Database tools sample](sql-database-elastic-scale-get-started.md).

## Create a shard map manager using the sample app

Here you will create a shard map manager along with several shards, followed by insertion of data into the shards. If you happen to already have shards setup with sharded data in them, you can skip the following steps and move to the next section.

1. Build and run the **Getting started with Elastic Database tools** sample application. Follow the steps until step 7 in the section [Download and run the sample app](sql-database-elastic-scale-get-started.md#Getting-started-with-elastic-database-tools). At the end of Step 7, you will see the following command prompt:

	![command prompt][1]

2.  In the command window, type "1" and press **Enter**. This creates the shard map manager, and adds two shards to the server. Then type "3" and press **Enter**; repeat the action four times. This inserts sample data rows in your shards.

3.  The [Azure preview portal](https://portal.azure.com) should show three new databases in your v12 server:

	![Visual Studio confirmation][2]

	At this point, we will create a custom database collection that reflects all the databases in the shard map. This will allow us to create and execute a job that add a new table across shards.

Now here we would usually create a shard map target, using the **New-AzureSqlJobTarget** cmdlet. The shard map manager database must be set as a database target and then the specific shard map is specified as a target. Instead, we are going to enumerate all the databases in the server and add the databases to the new custom collection with the exception of master database.

##Creates a custom collection and adds all databases in the server to the custom collection target with the exception of master.


	$customCollectionName = "dbs_in_server"
	New-AzureSqlJobTarget -CustomCollectionName $customCollectionName 
	$ResourceGroupName = "ddove_samples"
	$ServerName = "samples"
	$dbsinserver = Get-AzureSqlDatabase -ResourceGroupName $ResourceGroupName -ServerName $ServerName 
	$dbsinserver | %{
    $currentdb = $_.DatabaseName 
    $ErrorActionPreference = "Stop"
    Write-Output ""

    Try
    {
       New-AzureSqlJobTarget -ServerName $ServerName -DatabaseName $currentdb | Write-Output
    }
    Catch 
    {
        $ErrorMessage = $_.Exception.Message
        $ErrorCategory = $_.CategoryInfo.Reason
                
        if ($ErrorCategory -eq 'UniqueConstraintViolatedException')
        {
             Write-Host $currentdb "is already a database target." 
        }

        else
        {
            throw $_
        }
    
    }

    Try
    {
        if ($currentdb -eq "master")
        {
            Write-Host $currentdb "will not be added custom collection target" $CustomCollectionName "."
        }

        else
        {
            Add-AzureSqlJobChildTarget -CustomCollectionName $CustomCollectionName -ServerName $ServerName -DatabaseName $currentdb
            Write-Host $currentdb "was added to" $CustomCollectionName "."
        }

    }
    Catch 
    {
        $ErrorMessage = $_.Exception.Message
        $ErrorCategory = $_.CategoryInfo.Reason

        if ($ErrorCategory -eq 'UniqueConstraintViolatedException')
        {
             Write-Host $currentdb "is already in the custom collection target" $CustomCollectionName"."
        }

        else
        {
            throw $_
        }
    }
    $ErrorActionPreference = "Continue"
}
	
## Create a T-SQL Script for execution across databases

	$scriptName = "NewTable"
	$scriptCommandText = "
	IF NOT EXISTS (SELECT name FROM sys.tables WHERE name = 'Test')
	BEGIN
		CREATE TABLE Test(
			TestId INT PRIMARY KEY IDENTITY,
			InsertionTime DATETIME2
		);
	END
	GO
	INSERT INTO Test(InsertionTime) VALUES (sysutcdatetime());
	GO"

	$script = New-AzureSqlJobContent -ContentName $scriptName -CommandText $scriptCommandText
	Write-Output $script

##Create the job to execute a script across the custom group of databases

	$jobName = "create on server dbs"
	$scriptName = "NewTable"
	$customCollectionName = "dbs_in_server"
	$credentialName = "ddove66"
	$target = Get-AzureSqlJobTarget -CustomCollectionName $customCollectionName
	$job = New-AzureSqlJob -JobName $jobName -CredentialName $credentialName -ContentName $scriptName -TargetId $target.TargetId
	Write-Output $job


##Execute the job 

The following PowerShell script can be used to execute an existing job:

Update the following variable to reflect the desired job name to have executed:

	$jobName = "create on server dbs"
	$jobExecution = Start-AzureSqlJobExecution -JobName $jobName 
	Write-Output $jobExecution
 
## Retrieve the state of a single job execution

Use the same **Get-AzureSqlJobExecution** cmdlet with the **IncludeChildren** parameter to view the state of child job executions, namely the specific state for each job execution against each database targeted by the job.

	$jobExecutionId = "{Job Execution Id}"
	$jobExecutions = Get-AzureSqlJobExecution -JobExecutionId $jobExecutionId -IncludeChildren
	Write-Output $jobExecutions 

## View the state across multiple job executions

The **Get-AzureSqlJobExecution** cmdlet has multiple optional parameters that can be used to display multiple job executions, filtered through the provided parameters. The following demonstrates some of the possible ways to use Get-AzureSqlJobExecution:

Retrieve all active top level job executions:

	Get-AzureSqlJobExecution

Retrieve all top level job executions, including inactive job executions:

	Get-AzureSqlJobExecution -IncludeInactive

Retrieve all child job executions of a provided job execution ID, including inactive job executions:

	$parentJobExecutionId = "{Job Execution Id}"
	Get-AzureSqlJobExecution -AzureSqlJobExecution -JobExecutionId $parentJobExecutionId –IncludeInactive -IncludeChildren

Retrieve all job executions created using a schedule / job combination, including inactive jobs:

	$jobName = "{Job Name}"
	$scheduleName = "{Schedule Name}"
	Get-AzureSqlJobExecution -JobName $jobName -ScheduleName $scheduleName -IncludeInactive

Retrieve all jobs targeting a specified shard map, including inactive jobs:

	$shardMapServerName = "{Shard Map Server Name}"
	$shardMapDatabaseName = "{Shard Map Database Name}"
	$shardMapName = "{Shard Map Name}"
	$target = Get-AzureSqlJobTarget -ShardMapManagerDatabaseName $shardMapDatabaseName -ShardMapManagerServerName $shardMapServerName -ShardMapName $shardMapName
	Get-AzureSqlJobExecution -TargetId $target.TargetId –IncludeInactive

Retrieve all jobs targeting a specified custom collection, including inactive jobs:

	$customCollectionName = "{Custom Collection Name}"
	$target = Get-AzureSqlJobTarget -CustomCollectionName $customCollectionName
	Get-AzureSqlJobExecution -TargetId $target.TargetId –IncludeInactive
 
Retrieve the list of job task executions within a specific job execution:

	$jobExecutionId = "{Job Execution Id}"
	$jobTaskExecutions = Get-AzureSqlJobTaskExecution -JobExecutionId $jobExecutionId
	Write-Output $jobTaskExecutions 

Retrieve job task execution details:

The following PowerShell script can be used to view the details of a job task execution, which is particularly useful when debugging execution failures.

	$jobTaskExecutionId = "{Job Task Execution Id}"
	$jobTaskExecution = Get-AzureSqlJobTaskExecution -JobTaskExecutionId $jobTaskExecutionId
	Write-Output $jobTaskExecution

## Retrieve failures within job task executions

The JobTaskExecution object includes a property for the Lifecycle of the task along with a Message property. If a job task execution failed, the Lifecycle property will be set to *Failed* and the Message property will be set to the resulting exception message and its stack. If a job did not succeed, it is important to view the details of job tasks that did not succeed for a given job.

	$jobExecutionId = "{Job Execution Id}"
	$jobTaskExecutions = Get-AzureSqlJobTaskExecution -JobExecutionId $jobExecutionId
	Foreach($jobTaskExecution in $jobTaskExecutions) 
		{
		if($jobTaskExecution.Lifecycle -ne 'Succeeded')
    		{
        	Write-Output $jobTaskExecution
    		}
		}

## Waiting for a job execution to complete

The following PowerShell script can be used to wait for a job task to complete:

	$jobExecutionId = "{Job Execution Id}"
	Wait-AzureSqlJobExecution -JobExecutionId $jobExecutionId 

## Create a custom execution policy

Elastic Database jobs supports creating custom execution policies that can be applied when starting jobs.
  
Execution policies currently allow for defining:

* Name: Identifier for the execution policy.
* Job Timeout: Total time before a job will be canceled by Elastic Database Jobs.
* Initial Retry Interval: Interval to wait before first retry.
* Maximum Retry Interval: Cap of retry intervals to use.
* Retry Interval Backoff Coefficient: Coefficient used to calculate the next interval between retries.  The following formula is used: (Initial Retry Interval) * Math.pow((Interval Backoff Coefficient), (Number of Retries) - 2). 
* Maximum Attempts: The maximum number of retry attempts to perform within a job.

The default execution policy uses the following values:

* Name: Default execution policy
* Job Timeout: 1 week
* Initial Retry Interval:  100 milliseconds
* Maximum Retry Interval: 30 minutes
* Retry Interval Coefficient: 2
* Maximum Attempts: 2,147,483,647

Create the desired execution policy:

	$executionPolicyName = "{Execution Policy Name}"
	$initialRetryInterval = New-TimeSpan -Seconds 10
	$jobTimeout = New-TimeSpan -Minutes 30
	$maximumAttempts = 999999
	$maximumRetryInterval = New-TimeSpan -Minutes 1
	$retryIntervalBackoffCoefficient = 1.5
	$executionPolicy = New-AzureSqlJobExecutionPolicy -ExecutionPolicyName $executionPolicyName -InitialRetryInterval $initialRetryInterval -JobTimeout $jobTimeout -MaximumAttempts $maximumAttempts -MaximumRetryInterval $maximumRetryInterval -RetryIntervalBackoffCoefficient $retryIntervalBackoffCoefficient
	Write-Output $executionPolicy

### Update a custom execution policy

Update the desired execution policy to update:

	$executionPolicyName = "{Execution Policy Name}"
	$initialRetryInterval = New-TimeSpan -Seconds 15
	$jobTimeout = New-TimeSpan -Minutes 30
	$maximumAttempts = 999999
	$maximumRetryInterval = New-TimeSpan -Minutes 1
	$retryIntervalBackoffCoefficient = 1.5
	$updatedExecutionPolicy = Set-AzureSqlJobExecutionPolicy -ExecutionPolicyName $executionPolicyName -InitialRetryInterval $initialRetryInterval -JobTimeout $jobTimeout -MaximumAttempts $maximumAttempts -MaximumRetryInterval $maximumRetryInterval -RetryIntervalBackoffCoefficient $retryIntervalBackoffCoefficient
	Write-Output $updatedExecutionPolicy
 
## Cancel a job

Elastic Database Jobs supports cancellation requests of jobs.  If Elastic Database Jobs detects a cancellation request for a job currently being executed, it will attempt to stop the job.

There are two different ways that Elastic Database Jobs can perform a cancellation:

1. Canceling Currently Executing Tasks: If a cancellation is detected while a task is currently running, a cancellation will be attempted within the currently executing aspect of the task.  For example: If there is a long running query currently being performed when a cancellation is attempted, there will be an attempt to cancel the query.
2. Canceling Task Retries: If a cancellation is detected by the control thread before a task is launched for execution, the control thread will avoid launching the task and declare the request as canceled.

If a job cancellation is requested for a parent job, the cancellation request will be honored for the parent job and for all of its child jobs.
 
To submit a cancellation request, use the **Stop-AzureSqlJobExecution** cmdlet and set the **JobExecutionId** parameter.

	$jobExecutionId = "{Job Execution Id}"
	Stop-AzureSqlJobExecution -JobExecutionId $jobExecutionId

## Delete a job by name and the job's history

Elastic Database jobs supports asynchronous deletion of jobs. A job can be marked for deletion and the system will delete the job and all its job history after all job executions have completed for the job. The system will not automatically cancel active job executions.  

Instead, Stop-AzureSqlJobExecution must be invoked to cancel active job executions.

To trigger job deletion, use the **Remove-AzureSqlJob** cmdlet and set the **JobName** parameter.

	$jobName = "{Job Name}"
	Remove-AzureSqlJob -JobName $jobName
 
## Create a custom database target
Custom database targets can be defined in Elastic Database jobs which can be used either for execution directly or for inclusion within a custom database group. Since **Elastic Database pools** are not yet directly supported via the PowerShell APIs, you simply create a custom database target and custom database collection target which encompasses all the databases in the pool.

Set the following variables to reflect the desired database information:

	$databaseName = "{Database Name}"
	$databaseServerName = "{Server Name}"
	New-AzureSqlJobDatabaseTarget -DatabaseName $databaseName -ServerName $databaseServerName 

## Create a custom database collection target
A custom database collection target can be defined to enable execution across multiple defined database targets. After a database group is created, databases can be associated to the custom collection target.

Set the following variables to reflect the desired custom collection target configuration:

	$customCollectionName = "{Custom Database Collection Name}"
	New-AzureSqlJobTarget -CustomCollectionName $customCollectionName 

### Add databases to a custom database collection target

Database targets can be associated with custom database collection targets to create a group of databases. Whenever a job is created that targets a custom database collection target, it will be expanded to target the databases associated to the group at the time of execution.

Add the desired database to a specific custom collection:

	$serverName = "{Database Server Name}"
	$databaseName = "{Database Name}"
	$customCollectionName = "{Custom Database Collection Name}"
	Add-AzureSqlJobChildTarget -CustomCollectionName $customCollectionName -DatabaseName $databaseName -ServerName $databaseServerName 

#### Review the databases within a custom database collection target

Use the **Get-AzureSqlJobTarget** cmdlet to retrieve the child databases within a custom database collection target. 
 
	$customCollectionName = "{Custom Database Collection Name}"
	$target = Get-AzureSqlJobTarget -CustomCollectionName $customCollectionName
	$childTargets = Get-AzureSqlJobTarget -ParentTargetId $target.TargetId
	Write-Output $childTargets

### Create a job to execute a script across a custom database collection target

Use the **New-AzureSqlJob** cmdlet to create a job against a group of databases defined by a custom database collection target. Elastic Database jobs will expand the job into multiple child jobs each corresponding to a database associated with the custom database collection target and ensure that the script is executed against each database. Again, it is important that scripts are idempotent to be resilient to retries.

	$jobName = "{Job Name}"
	$scriptName = "{Script Name}"
	$customCollectionName = "{Custom Collection Name}"
	$credentialName = "{Credential Name}"
	$target = Get-AzureSqlJobTarget -CustomCollectionName $customCollectionName
	$job = New-AzureSqlJob -JobName $jobName -CredentialName $credentialName -ContentName $scriptName -TargetId $target.TargetId
	Write-Output $job

## Data collection across databases

**Elastic Database jobs** supports executing a query across a group of databases and sends the results to a specified database’s table. The table can be queried after the fact to see the query’s results from each database. This provides an asynchronous mechanism to execute a query across many databases. Failure cases such as one of the databases being temporarily unavailable are handled automatically via retries.

The specified destination table will be automatically created if it does not yet exist matching the schema of the returned result set. If a script execution returns multiple result sets, Elastic Database jobs will only send the first one to the provided destination table.

The following PowerShell script can be used to execute a script collecting its results into a specified table. This script assumes that a T-SQL script has been created which outputs a single result set and a custom database collection target has been created.

Set the following to reflect the desired script, credentials, and execution target:

	$jobName = "{Job Name}"
	$scriptName = "{Script Name}"
	$executionCredentialName = "{Execution Credential Name}"
	$customCollectionName = "{Custom Collection Name}"
	$destinationCredentialName = "{Destination Credential Name}"
	$destinationServerName = "{Destination Server Name}"
	$destinationDatabaseName = "{Destination Database Name}"
	$destinationSchemaName = "{Destination Schema Name}"
	$destinationTableName = "{Destination Table Name}"
	$target = Get-AzureSqlJobTarget -CustomCollectionName $customCollectionName

### Create and start a job for data collection scenarios
	$job = New-AzureSqlJob -JobName $jobName -CredentialName $executionCredentialName -ContentName $scriptName -ResultSetDestinationServerName $destinationServerName -ResultSetDestinationDatabaseName $destinationDatabaseName -ResultSetDestinationSchemaName $destinationSchemaName -ResultSetDestinationTableName $destinationTableName -ResultSetDestinationCredentialName $destinationCredentialName -TargetId $target.TargetId
	Write-Output $job
	$jobExecution = Start-AzureSqlJobExecution -JobName $jobName
	Write-Output $jobExecution

## Create a schedule for job execution using a job trigger

The following PowerShell script can be used to create a reoccurring schedule. This script uses a minute interval, but New-AzureSqlJobSchedule also supports -DayInterval, -HourInterval, -MonthInterval, and -WeekInterval parameters. Schedules that execute only once can be created by passing -OneTime.

Create a new schedule:

	$scheduleName = "Every one minute"
	$minuteInterval = 1
	$startTime = (Get-Date).ToUniversalTime()
	$schedule = New-AzureSqlJobSchedule -MinuteInterval $minuteInterval -ScheduleName $scheduleName -StartTime $startTime 
	Write-Output $schedule

### Create a job trigger to have a job executed on a time schedule

A job trigger can be defined to have a job executed according to a time schedule. The following PowerShell script can be used to create a job trigger.

Set the following variables to correspond to the desired job and schedule:

	$jobName = "{Job Name}"
	$scheduleName = "{Schedule Name}"
	$jobTrigger = New-AzureSqlJobTrigger -ScheduleName $scheduleName –JobName $jobName
	Write-Output $jobTrigger

### Remove a scheduled association to stop job from executing on schedule

To discontinue reoccurring job execution through a job trigger, the job trigger can be removed. 
Remove a job trigger to stop a job from being executed according to a schedule using the **Remove-AzureSqlJobTrigger** cmdlet.

	$jobName = "{Job Name}"
	$scheduleName = "{Schedule Name}"
	Remove-AzureSqlJobTrigger -ScheduleName $scheduleName -JobName $jobName





## Import elastic database query results to Excel

 You can import the results from of a query to an Excel file.

1. Launch Excel 2013.
2. 	Navigate to the **Data** ribbon.
3. 	Click **From Other Sources** and click **From SQL Server**.

	![Excel import from other sources][5]
4. 	In the **Data Connection Wizard** type the server name and login credentials. Then click **Next**.
5. 	In the dialog box **Select the database that contains the data you want**, select the **ElasticDBQuery** database.
6. 	Select the **Customers** table in the list view and click **Next**. Then click **Finish**.
7. 	In the **Import Data** form, under **Select how you want to view this data in your workbook**, select **Table** and click **OK**.

All the rows from **Customers** table, stored in different shards populate the Excel sheet.

## Next steps
You can now use Excel’s powerful data functions. You can use the connection string with your server name, database name and credentials to connect your BI and data integration tools to the elastic query database. Make sure that SQL Server is supported as a data source for your tool. You can refer to the elastic query database and external tables just like any other SQL Server database and SQL Server tables that you would connect to with your tool.

### Cost
There is no additional charge for using the Elastic Database Query feature. However, at this time this feature is available only on premium databases as an end point, but the shards can be of any service tier.

For pricing information see [SQL Database Pricing Details](http://azure.microsoft.com/pricing/details/sql-database/).


[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-query-getting-started/cmd-prompt.png
[2]: ./media/sql-database-elastic-query-getting-started/portal.png
[3]: ./media/sql-database-elastic-query-getting-started/tiers.png
[4]: ./media/sql-database-elastic-query-getting-started/details.png
[5]: ./media/sql-database-elastic-query-getting-started/exel-sources.png
<!--anchors-->
