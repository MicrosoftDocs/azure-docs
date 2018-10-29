---
title: Create and manage elastic jobs using PowerShell | Microsoft Docs
description: PowerShell used to manage Azure SQL Database pools
services: sql-database
ms.service: sql-database
subservice: operations
ms.custom: 
ms.devlang: pwershell
ms.topic: conceptual
author: stevestein
ms.author: sstein
ms.reviewer: 
manager: craigg
ms.date: 06/14/2018
---
# Create and manage SQL Database elastic jobs using PowerShell (preview)


[!INCLUDE [elastic-database-jobs-deprecation](../../includes/sql-database-elastic-jobs-deprecate.md)]


The PowerShell APIs for **Elastic Database jobs** (in preview), let you define a group of databases against which scripts will execute. This article shows how to create and manage **Elastic Database jobs** using PowerShell cmdlets. See [Elastic jobs overview](sql-database-elastic-jobs-overview.md). 

## Prerequisites
* An Azure subscription. For a free trial, see [Free one-month trial](https://azure.microsoft.com/pricing/free-trial/).
* A set of databases created with the Elastic Database tools. See [Get started with Elastic Database tools](sql-database-elastic-scale-get-started.md).
* Azure PowerShell. For detailed information, see [How to install and configure Azure PowerShell](https://docs.microsoft.com/powershell/azure/overview).
* **Elastic Database jobs** PowerShell package: See [Installing Elastic Database jobs](sql-database-elastic-jobs-service-installation.md)

### Select your Azure subscription
To select the subscription you need your subscription Id (**-SubscriptionId**) or subscription name (**-SubscriptionName**). If you have multiple subscriptions you can run the **Get-AzureRmSubscription** cmdlet and copy the desired subscription information from the result set. Once you have your subscription information, run the following commandlet to set this subscription as the default, namely the target for creating and managing jobs:

    Select-AzureRmSubscription -SubscriptionId {SubscriptionID}

The [PowerShell ISE](https://technet.microsoft.com/library/dd315244.aspx) is recommended for usage to develop and execute PowerShell scripts against the Elastic Database jobs.

## Elastic Database jobs objects
The following table lists out all the object types of **Elastic Database jobs** along with its description and relevant PowerShell APIs.

<table style="width:100%">
  <tr>
    <th>Object Type</th>
    <th>Description</th>
    <th>Related PowerShell APIs</th>
  </tr>
  <tr>
    <td>Credential</td>
    <td>Username and password to use when connecting to databases for execution of scripts or application of DACPACs. <p>The password is encrypted before sending to and storing in the Elastic Database Jobs database.  The password is decrypted by the Elastic Database Jobs service via the credential created and uploaded from the installation script.</td>
    <td><p>Get-AzureSqlJobCredential</p>
    <p>New-AzureSqlJobCredential</p><p>Set-AzureSqlJobCredential</p></td></td>
  </tr>

  <tr>
    <td>Script</td>
    <td>Transact-SQL script to be used for execution across databases.  The script should be authored to be idempotent since the service will retry execution of the script upon failures.
    </td>
    <td>
    <p>Get-AzureSqlJobContent</p>
    <p>Get-AzureSqlJobContentDefinition</p>
    <p>New-AzureSqlJobContent</p>
    <p>Set-AzureSqlJobContentDefinition</p>
    </td>
  </tr>

  <tr>
    <td>DACPAC</td>
    <td><a href="https://msdn.microsoft.com/library/ee210546.aspx">Data-tier application </a> package to be applied across databases.
    </td>
    <td>
    <p>Get-AzureSqlJobContent</p>
    <p>New-AzureSqlJobContent</p>
    <p>Set-AzureSqlJobContentDefinition</p>
    </td>
  </tr>
  <tr>
    <td>Database Target</td>
    <td>Database and server name pointing to an Azure SQL Database.
    </td>
    <td>
    <p>Get-AzureSqlJobTarget</p>
    <p>New-AzureSqlJobTarget</p>
    </td>
  </tr>
  <tr>
    <td>Shard Map Target</td>
    <td>Combination of a database target and a credential to be used to determine information stored within an Elastic Database shard map.
    </td>
    <td>
    <p>Get-AzureSqlJobTarget</p>
    <p>New-AzureSqlJobTarget</p>
    <p>Set-AzureSqlJobTarget</p>
    </td>
  </tr>
<tr>
    <td>Custom Collection Target</td>
    <td>Defined group of databases to collectively use for execution.</td>
    <td>
    <p>Get-AzureSqlJobTarget</p>
    <p>New-AzureSqlJobTarget</p>
    </td>
  </tr>
<tr>
    <td>Custom Collection Child Target</td>
    <td>Database target that is referenced from a custom collection.</td>
    <td>
    <p>Add-AzureSqlJobChildTarget</p>
    <p>Remove-AzureSqlJobChildTarget</p>
    </td>
  </tr>

<tr>
    <td>Job</td>
    <td>
    <p>Definition of parameters for a job that can be used to trigger execution or to fulfill a schedule.</p>
    </td>
    <td>
    <p>Get-AzureSqlJob</p>
    <p>New-AzureSqlJob</p>
    <p>Set-AzureSqlJob</p>
    </td>
  </tr>

<tr>
    <td>Job Execution</td>
    <td>
    <p>Container of tasks necessary to fulfill either executing a script or applying a DACPAC to a target using credentials for database connections with failures handled in accordance to an execution policy.</p>
    </td>
    <td>
    <p>Get-AzureSqlJobExecution</p>
    <p>Start-AzureSqlJobExecution</p>
    <p>Stop-AzureSqlJobExecution</p>
    <p>Wait-AzureSqlJobExecution</p>
  </tr>

<tr>
    <td>Job Task Execution</td>
    <td>
    <p>Single unit of work to fulfill a job.</p>
    <p>If a job task is not able to successfully execute, the resulting exception message will be logged and a new matching job task will be created and executed in accordance to the specified execution policy.</p></p>
    </td>
    <td>
    <p>Get-AzureSqlJobExecution</p>
    <p>Start-AzureSqlJobExecution</p>
    <p>Stop-AzureSqlJobExecution</p>
    <p>Wait-AzureSqlJobExecution</p>
  </tr>

<tr>
    <td>Job Execution Policy</td>
    <td>
    <p>Controls job execution timeouts, retry limits and intervals between retries.</p>
    <p>Elastic Database jobs includes a default job execution policy which cause essentially infinite retries of job task failures with exponential backoff of intervals between each retry.</p>
    </td>
    <td>
    <p>Get-AzureSqlJobExecutionPolicy</p>
    <p>New-AzureSqlJobExecutionPolicy</p>
    <p>Set-AzureSqlJobExecutionPolicy</p>
    </td>
  </tr>

<tr>
    <td>Schedule</td>
    <td>
    <p>Time based specification for execution to take place either on a reoccurring interval or at a single time.</p>
    </td>
    <td>
    <p>Get-AzureSqlJobSchedule</p>
    <p>New-AzureSqlJobSchedule</p>
    <p>Set-AzureSqlJobSchedule</p>
    </td>
  </tr>

<tr>
    <td>Job Triggers</td>
    <td>
    <p>A mapping between a job and a schedule to trigger job execution according to the schedule.</p>
    </td>
    <td>
    <p>New-AzureSqlJobTrigger</p>
    <p>Remove-AzureSqlJobTrigger</p>
    </td>
  </tr>
</table>

## Supported Elastic Database jobs group types
The job executes Transact-SQL (T-SQL) scripts or application of DACPACs across a group of databases. When a job is submitted to be executed across a group of databases, the job “expands” the into child jobs where each performs the requested execution against a single database in the group. 

There are two types of groups that you can create: 

* [Shard Map](sql-database-elastic-scale-shard-map-management.md) group: When a job is submitted to target a shard map, the job queries the shard map to determine its current set of shards, and then creates child jobs for each shard in the shard map.
* Custom Collection group: A custom defined set of databases. When a job targets a custom collection, it creates child jobs for each database currently in the custom collection.

## To set the Elastic Database jobs connection
A connection needs to be set to the jobs *control database* prior to using the jobs APIs. Running this cmdlet triggers a credential window to pop up requesting the user name and password created when installing Elastic Database jobs. All examples provided within this topic assume that this first step has already been performed.

Open a connection to the Elastic Database jobs:

    Use-AzureSqlJobConnection -CurrentAzureSubscription 

## Encrypted credentials within the Elastic Database jobs
Database credentials can be inserted into the jobs *control database*  with its password encrypted. It is necessary to store credentials to enable jobs to be executed at a later time, (using job schedules).

Encryption works through a certificate created as part of the installation script. The installation script creates and uploads the certificate into the Azure Cloud Service for decryption of the stored encrypted passwords. The Azure Cloud Service later stores the public key within the jobs *control database* which enables the PowerShell API or Azure portal interface to encrypt a provided password without requiring the certificate to be locally installed.

The credential passwords are encrypted and secure from users with read-only access to Elastic Database jobs objects. But it is possible for a malicious user with read-write access to Elastic Database Jobs objects to extract a password. Credentials are designed to be reused across job executions. Credentials are passed to target databases when establishing connections. There are currently no restrictions on the target databases used for each credential, malicious user could add a database target for a database under the malicious user's control. The user could subsequently start a job targeting this database to gain the credential's password.

Security best practices for Elastic Database jobs include:

* Limit usage of the APIs to trusted individuals.
* Credentials should have the least privileges necessary to perform the job task.  More information can be seen within this [Authorization and Permissions](https://msdn.microsoft.com/library/bb669084.aspx) SQL Server MSDN article.

### To create an encrypted credential for job execution across databases
To create a new encrypted credential, the [**Get-Credential cmdlet**](/powershell/module/microsoft.powershell.security/get-credential) prompts for a user name and password that can be passed to the [**New-AzureSqlJobCredential cmdlet**](/powershell/module/elasticdatabasejobs/new-azuresqljobcredential).

    $credentialName = "{Credential Name}"
    $databaseCredential = Get-Credential
    $credential = New-AzureSqlJobCredential -Credential $databaseCredential -CredentialName $credentialName
    Write-Output $credential

### To update credentials
When passwords change, use the [**Set-AzureSqlJobCredential cmdlet**](/powershell/module/elasticdatabasejobs/set-azuresqljobcredential) and set the **CredentialName** parameter.

    $credentialName = "{Credential Name}"
    Set-AzureSqlJobCredential -CredentialName $credentialName -Credential $credential 

## To define an Elastic Database shard map target
To execute a job against all databases in a shard set (created using [Elastic Database client library](sql-database-elastic-database-client-library.md)), use a shard map as the database target. This example requires a sharded application created using the Elastic Database client library. See [Getting started with Elastic Database tools sample](sql-database-elastic-scale-get-started.md).

The shard map manager database must be set as a database target and then the specific shard map must be specified as a target.

    $shardMapCredentialName = "{Credential Name}"
    $shardMapDatabaseName = "{ShardMapDatabaseName}" #example: ElasticScaleStarterKit_ShardMapManagerDb
    $shardMapDatabaseServerName = "{ShardMapServerName}"
    $shardMapName = "{MyShardMap}" #example: CustomerIDShardMap
    $shardMapDatabaseTarget = New-AzureSqlJobTarget -DatabaseName $shardMapDatabaseName -ServerName $shardMapDatabaseServerName
    $shardMapTarget = New-AzureSqlJobTarget -ShardMapManagerCredentialName $shardMapCredentialName -ShardMapManagerDatabaseName $shardMapDatabaseName -ShardMapManagerServerName $shardMapDatabaseServerName -ShardMapName $shardMapName
    Write-Output $shardMapTarget

## Create a T-SQL Script for execution across databases
When creating T-SQL scripts for execution, it is highly recommended to build them to be [idempotent](https://en.wikipedia.org/wiki/Idempotence) and resilient against failures. Elastic Database jobs will retry execution of a script whenever execution encounters a failure, regardless of the classification of the failure.

Use the [**New-AzureSqlJobContent cmdlet**](/powershell/module/elasticdatabasejobs/new-azuresqljobcontent) to create and save a script for execution and set the **-ContentName** and **-CommandText** parameters.

    $scriptName = "Create a TestTable"

    $scriptCommandText = "
    IF NOT EXISTS (SELECT name FROM sys.tables WHERE name = 'TestTable')
    BEGIN
        CREATE TABLE TestTable(
            TestTableId INT PRIMARY KEY IDENTITY,
            InsertionTime DATETIME2
        );
    END
    GO
    INSERT INTO TestTable(InsertionTime) VALUES (sysutcdatetime());
    GO"

    $script = New-AzureSqlJobContent -ContentName $scriptName -CommandText $scriptCommandText
    Write-Output $script

### Create a new script from a file
If the T-SQL script is defined within a file, use this to import the script:

    $scriptName = "My Script Imported from a File"
    $scriptPath = "{Path to SQL File}"
    $scriptCommandText = Get-Content -Path $scriptPath
    $script = New-AzureSqlJobContent -ContentName $scriptName -CommandText $scriptCommandText
    Write-Output $script

### To update a T-SQL script for execution across databases
This PowerShell script updates the T-SQL command text for an existing script.

Set the following variables to reflect the desired script definition to be set:

    $scriptName = "Create a TestTable"
    $scriptUpdateComment = "Adding AdditionalInformation column to TestTable"
    $scriptCommandText = "
    IF NOT EXISTS (SELECT name FROM sys.tables WHERE name = 'TestTable')
    BEGIN
    CREATE TABLE TestTable(
        TestTableId INT PRIMARY KEY IDENTITY,
        InsertionTime DATETIME2
    );
    END
    GO

    IF NOT EXISTS (SELECT columns.name FROM sys.columns INNER JOIN sys.tables on columns.object_id = tables.object_id WHERE tables.name = 'TestTable' AND columns.name = 'AdditionalInformation')
    BEGIN
    ALTER TABLE TestTable
    ADD AdditionalInformation NVARCHAR(400);
    END
    GO

    INSERT INTO TestTable(InsertionTime, AdditionalInformation) VALUES (sysutcdatetime(), 'test');
    GO"

### To update the definition to an existing script
    Set-AzureSqlJobContentDefinition -ContentName $scriptName -CommandText $scriptCommandText -Comment $scriptUpdateComment 

## To create a job to execute a script across a shard map
This PowerShell script starts a job for execution of a script across each shard in an Elastic Scale shard map.

Set the following variables to reflect the desired script and target:

    $jobName = "{Job Name}"
    $scriptName = "{Script Name}"
    $shardMapServerName = "{Shard Map Server Name}"
    $shardMapDatabaseName = "{Shard Map Database Name}"
    $shardMapName = "{Shard Map Name}"
    $credentialName = "{Credential Name}"
    $shardMapTarget = Get-AzureSqlJobTarget -ShardMapManagerDatabaseName $shardMapDatabaseName -ShardMapManagerServerName $shardMapServerName -ShardMapName $shardMapName 
    $job = New-AzureSqlJob -ContentName $scriptName -CredentialName $credentialName -JobName $jobName -TargetId $shardMapTarget.TargetId
    Write-Output $job

## To execute a job
This PowerShell script executes an existing job:

Update the following variable to reflect the desired job name to have executed:

    $jobName = "{Job Name}"
    $jobExecution = Start-AzureSqlJobExecution -JobName $jobName 
    Write-Output $jobExecution

## To retrieve the state of a single job execution
Use the [**Get-AzureSqlJobExecution cmdlet**](/powershell/module/elasticdatabasejobs/get-azuresqljobexecution) and set the **JobExecutionId** parameter to view the state of job execution.

    $jobExecutionId = "{Job Execution Id}"
    $jobExecution = Get-AzureSqlJobExecution -JobExecutionId $jobExecutionId
    Write-Output $jobExecution

Use the same **Get-AzureSqlJobExecution** cmdlet with the **IncludeChildren** parameter to view the state of child job executions, namely the specific state for each job execution against each database targeted by the job.

    $jobExecutionId = "{Job Execution Id}"
    $jobExecutions = Get-AzureSqlJobExecution -JobExecutionId $jobExecutionId -IncludeChildren
    Write-Output $jobExecutions 

## To view the state across multiple job executions
The [**Get-AzureSqlJobExecution cmdlet**](/powershell/module/elasticdatabasejobs/new-azuresqljob) has multiple optional parameters that can be used to display multiple job executions, filtered through the provided parameters. The following demonstrates some of the possible ways to use Get-AzureSqlJobExecution:

Retrieve all active top level job executions:

    Get-AzureSqlJobExecution

Retrieve all top level job executions, including inactive job executions:

    Get-AzureSqlJobExecution -IncludeInactive

Retrieve all child job executions of a provided job execution ID, including inactive job executions:

    $parentJobExecutionId = "{Job Execution Id}"
    Get-AzureSqlJobExecution -AzureSqlJobExecution -JobExecutionId $parentJobExecutionId -IncludeInactive -IncludeChildren

Retrieve all job executions created using a schedule / job combination, including inactive jobs:

    $jobName = "{Job Name}"
    $scheduleName = "{Schedule Name}"
    Get-AzureSqlJobExecution -JobName $jobName -ScheduleName $scheduleName -IncludeInactive

Retrieve all jobs targeting a specified shard map, including inactive jobs:

    $shardMapServerName = "{Shard Map Server Name}"
    $shardMapDatabaseName = "{Shard Map Database Name}"
    $shardMapName = "{Shard Map Name}"
    $target = Get-AzureSqlJobTarget -ShardMapManagerDatabaseName $shardMapDatabaseName -ShardMapManagerServerName $shardMapServerName -ShardMapName $shardMapName
    Get-AzureSqlJobExecution -TargetId $target.TargetId -IncludeInactive

Retrieve all jobs targeting a specified custom collection, including inactive jobs:

    $customCollectionName = "{Custom Collection Name}"
    $target = Get-AzureSqlJobTarget -CustomCollectionName $customCollectionName
    Get-AzureSqlJobExecution -TargetId $target.TargetId -IncludeInactive

Retrieve the list of job task executions within a specific job execution:

    $jobExecutionId = "{Job Execution Id}"
    $jobTaskExecutions = Get-AzureSqlJobTaskExecution -JobExecutionId $jobExecutionId
    Write-Output $jobTaskExecutions 

Retrieve job task execution details:

The following PowerShell script can be used to view the details of a job task execution, which is particularly useful when debugging execution failures.

    $jobTaskExecutionId = "{Job Task Execution Id}"
    $jobTaskExecution = Get-AzureSqlJobTaskExecution -JobTaskExecutionId $jobTaskExecutionId
    Write-Output $jobTaskExecution

## To retrieve failures within job task executions
The **JobTaskExecution object** includes a property for the lifecycle of the task along with a message property. If a job task execution failed, the lifecycle property will be set to *Failed* and the message property will be set to the resulting exception message and its stack. If a job did not succeed, it is important to view the details of job tasks that did not succeed for a given job.

    $jobExecutionId = "{Job Execution Id}"
    $jobTaskExecutions = Get-AzureSqlJobTaskExecution -JobExecutionId $jobExecutionId
    Foreach($jobTaskExecution in $jobTaskExecutions) 
        {
        if($jobTaskExecution.Lifecycle -ne 'Succeeded')
            {
            Write-Output $jobTaskExecution
            }
        }

## To wait for a job execution to complete
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
    $executionPolicy = New-AzureSqlJobExecutionPolicy -ExecutionPolicyName $executionPolicyName -InitialRetryInterval $initialRetryInterval -JobTimeout $jobTimeout -MaximumAttempts $maximumAttempts -MaximumRetryInterval $maximumRetryInterval 
    -RetryIntervalBackoffCoefficient $retryIntervalBackoffCoefficient
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

1. Cancel currently executing tasks: If a cancellation is detected while a task is currently running, a cancellation will be attempted within the currently executing aspect of the task.  For example: If there is a long running query currently being performed when a cancellation is attempted, there will be an attempt to cancel the query.
2. Canceling task retries: If a cancellation is detected by the control thread before a task is launched for execution, the control thread will avoid launching the task and declare the request as canceled.

If a job cancellation is requested for a parent job, the cancellation request will be honored for the parent job and for all of its child jobs.

To submit a cancellation request, use the [**Stop-AzureSqlJobExecution cmdlet**](/powershell/module/elasticdatabasejobs/stop-azuresqljobexecution) and set the **JobExecutionId** parameter.

    $jobExecutionId = "{Job Execution Id}"
    Stop-AzureSqlJobExecution -JobExecutionId $jobExecutionId

## To delete a job and job history asynchronously
Elastic Database jobs supports asynchronous deletion of jobs. A job can be marked for deletion and the system will delete the job and all its job history after all job executions have completed for the job. The system will not automatically cancel active job executions.  

Invoke [**Stop-AzureSqlJobExecution**](/powershell/module/elasticdatabasejobs/stop-azuresqljobexecution) to cancel active job executions.

To trigger job deletion, use the [**Remove-AzureSqlJob cmdlet**](/powershell/module/elasticdatabasejobs/remove-azuresqljob) and set the **JobName** parameter.

    $jobName = "{Job Name}"
    Remove-AzureSqlJob -JobName $jobName

## To create a custom database target
You can define custom database targets either for direct execution or for inclusion within a custom database group. For example, because **elastic pools** are not yet directly supported using PowerShell APIs, you can create a custom database target and custom database collection target which encompasses all the databases in the pool.

Set the following variables to reflect the desired database information:

    $databaseName = "{Database Name}"
    $databaseServerName = "{Server Name}"
    New-AzureSqlJobTarget -DatabaseName $databaseName -ServerName $databaseServerName 

## To create a custom database collection target
Use the [**New-AzureSqlJobTarget**](/powershell/module/elasticdatabasejobs/new-azuresqljobtarget) cmdlet to define a custom database collection target to enable execution across multiple defined database targets. After creating a database group, databases can be associated with the custom collection target.

Set the following variables to reflect the desired custom collection target configuration:

    $customCollectionName = "{Custom Database Collection Name}"
    New-AzureSqlJobTarget -CustomCollectionName $customCollectionName 

### To add databases to a custom database collection target
To add a database to a specific custom collection use the [**Add-AzureSqlJobChildTarget**](/powershell/module/elasticdatabasejobs/add-azuresqljobchildtarget) cmdlet.

    $databaseServerName = "{Database Server Name}"
    $databaseName = "{Database Name}"
    $customCollectionName = "{Custom Database Collection Name}"
    Add-AzureSqlJobChildTarget -CustomCollectionName $customCollectionName -DatabaseName $databaseName -ServerName $databaseServerName 

#### Review the databases within a custom database collection target
Use the [**Get-AzureSqlJobTarget**](/powershell/module/elasticdatabasejobs/new-azuresqljobtarget) cmdlet to retrieve the child databases within a custom database collection target. 

    $customCollectionName = "{Custom Database Collection Name}"
    $target = Get-AzureSqlJobTarget -CustomCollectionName $customCollectionName
    $childTargets = Get-AzureSqlJobTarget -ParentTargetId $target.TargetId
    Write-Output $childTargets

### Create a job to execute a script across a custom database collection target
Use the [**New-AzureSqlJob**](/powershell/module/elasticdatabasejobs/new-azuresqljob) cmdlet to create a job against a group of databases defined by a custom database collection target. Elastic Database jobs will expand the job into multiple child jobs each corresponding to a database associated with the custom database collection target and ensure that the script is executed against each database. Again, it is important that scripts are idempotent to be resilient to retries.

    $jobName = "{Job Name}"
    $scriptName = "{Script Name}"
    $customCollectionName = "{Custom Collection Name}"
    $credentialName = "{Credential Name}"
    $target = Get-AzureSqlJobTarget -CustomCollectionName $customCollectionName
    $job = New-AzureSqlJob -JobName $jobName -CredentialName $credentialName -ContentName $scriptName -TargetId $target.TargetId
    Write-Output $job

## Data collection across databases
You can use a job to execute a query across a group of databases and send the results to a specific table. The table can be queried after the fact to see the query’s results from each database. This provides an asynchronous method to execute a query across many databases. Failed attempts are handled automatically via retries.

The specified destination table will be automatically created if it does not yet exist. The new table matches the schema of the returned result set. If a script returns multiple result sets, Elastic Database jobs will only send the first to the destination table.

The following PowerShell script executes a script and collects its results into a specified table. This script assumes that a T-SQL script has been created which outputs a single result set and that a custom database collection target has been created.

This script uses the [**Get-AzureSqlJobTarget**](/powershell/module/elasticdatabasejobs/new-azuresqljobtarget) cmdlet. Set the parameters for script, credentials, and execution target:

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

### To create and start a job for data collection scenarios
This script uses the [**Start-AzureSqlJobExecution**](/powershell/module/elasticdatabasejobs/start-azuresqljobexecution) cmdlet.

    $job = New-AzureSqlJob -JobName $jobName 
    -CredentialName $executionCredentialName 
    -ContentName $scriptName 
    -ResultSetDestinationServerName $destinationServerName 
    -ResultSetDestinationDatabaseName $destinationDatabaseName 
    -ResultSetDestinationSchemaName $destinationSchemaName 
    -ResultSetDestinationTableName $destinationTableName 
    -ResultSetDestinationCredentialName $destinationCredentialName 
    -TargetId $target.TargetId
    Write-Output $job
    $jobExecution = Start-AzureSqlJobExecution -JobName $jobName
    Write-Output $jobExecution

## To schedule a job execution trigger
The following PowerShell script can be used to create a recurring schedule. This script uses a minute interval, but [**New-AzureSqlJobSchedule**](/powershell/module/elasticdatabasejobs/new-azuresqljobschedule) also supports -DayInterval, -HourInterval, -MonthInterval, and -WeekInterval parameters. Schedules that execute only once can be created by passing -OneTime.

Create a new schedule:

    $scheduleName = "Every one minute"
    $minuteInterval = 1
    $startTime = (Get-Date).ToUniversalTime()
    $schedule = New-AzureSqlJobSchedule 
    -MinuteInterval $minuteInterval 
    -ScheduleName $scheduleName 
    -StartTime $startTime 
    Write-Output $schedule

### To trigger a job executed on a time schedule
A job trigger can be defined to have a job executed according to a time schedule. The following PowerShell script can be used to create a job trigger.

Use [New-AzureSqlJobTrigger](/powershell/module/elasticdatabasejobs/new-azuresqljobtrigger) and set the following variables to correspond to the desired job and schedule:

    $jobName = "{Job Name}"
    $scheduleName = "{Schedule Name}"
    $jobTrigger = New-AzureSqlJobTrigger
    -ScheduleName $scheduleName
    -JobName $jobName
    Write-Output $jobTrigger

### To remove a scheduled association to stop job from executing on schedule
To discontinue reoccurring job execution through a job trigger, the job trigger can be removed. 
Remove a job trigger to stop a job from being executed according to a schedule using the [**Remove-AzureSqlJobTrigger cmdlet**](/powershell/module/elasticdatabasejobs/remove-azuresqljobtrigger).

    $jobName = "{Job Name}"
    $scheduleName = "{Schedule Name}"
    Remove-AzureSqlJobTrigger 
    -ScheduleName $scheduleName 
    -JobName $jobName

### Retrieve job triggers bound to a time schedule
The following PowerShell script can be used to obtain and display the job triggers registered to a particular time schedule.

    $scheduleName = "{Schedule Name}"
    $jobTriggers = Get-AzureSqlJobTrigger -ScheduleName $scheduleName
    Write-Output $jobTriggers

### To retrieve job triggers bound to a job
Use [Get-AzureSqlJobTrigger](/powershell/module/elasticdatabasejobs/get-azuresqljobtrigger) to obtain and display schedules containing a registered job.

    $jobName = "{Job Name}"
    $jobTriggers = Get-AzureSqlJobTrigger -JobName $jobName
    Write-Output $jobTriggers

## To create a data-tier application (DACPAC) for execution across databases
To create a DACPAC, see [Data-Tier applications](https://msdn.microsoft.com/library/ee210546.aspx). To deploy a DACPAC, use the [New-AzureSqlJobContent cmdlet](/powershell/module/elasticdatabasejobs/new-azuresqljobcontent). The DACPAC must be accessible to the service. It is recommended to upload a created DACPAC to Azure Storage and create a [Shared Access Signature](../storage/common/storage-dotnet-shared-access-signature-part-1.md) for the DACPAC.

    $dacpacUri = "{Uri}"
    $dacpacName = "{Dacpac Name}"
    $dacpac = New-AzureSqlJobContent -DacpacUri $dacpacUri -ContentName $dacpacName 
    Write-Output $dacpac

### To update a data-tier application (DACPAC) for execution across databases
Existing DACPACs registered within Elastic Database Jobs can be updated to point to new URIs. Use the [**Set-AzureSqlJobContentDefinition cmdlet**](/powershell/module/elasticdatabasejobs/set-azuresqljobcontentdefinition) to update the DACPAC URI on an existing registered DACPAC:

    $dacpacName = "{Dacpac Name}"
    $newDacpacUri = "{Uri}"
    $updatedDacpac = Set-AzureSqlJobDacpacDefinition -ContentName $dacpacName -DacpacUri $newDacpacUri
    Write-Output $updatedDacpac

## To create a job to apply a data-tier application (DACPAC) across databases
After a DACPAC has been created within Elastic Database Jobs, a job can be created to apply the DACPAC across a group of databases. The following PowerShell script can be used to create a DACPAC job across a custom collection of databases:

    $jobName = "{Job Name}"
    $dacpacName = "{Dacpac Name}"
    $customCollectionName = "{Custom Collection Name}"
    $credentialName = "{Credential Name}"
    $target = Get-AzureSqlJobTarget 
    -CustomCollectionName $customCollectionName
    $job = New-AzureSqlJob 
    -JobName $jobName 
    -CredentialName $credentialName 
    -ContentName $dacpacName -TargetId $target.TargetId
    Write-Output $job 

[!INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-jobs-powershell/cmd-prompt.png
[2]: ./media/sql-database-elastic-jobs-powershell/portal.png
<!--anchors-->
