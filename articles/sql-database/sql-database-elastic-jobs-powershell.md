<properties 
	title="Elastic database jobs overview" 
	pageTitle="Elastic database jobs overview" 
	description="Illustrates the elastic database job service" 
	metaKeywords="azure sql database elastic databases" 
	services="sql-database" documentationCenter=""  
	manager="jeffreyg" 
	authors="ddove"/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/27/2015" 
	ms.author="ddove; sidneyh" />

# Create and manage a SQL Database elastic database jobs using PowerShell (preview)

> [AZURE.SELECTOR]
- [Azure portal](sql-database-elastic-jobs-create-and-manage.md)
- [PowerShell](sql-database-elastic-jobs-powershell.md)

## Overview

The **Elastic Database jobs** feature (preview) enables you to run a Transact-SQL script across a group of databases including a custom-defined collection of databases, all databases in an [Elastic Database pool (preview)](sql-database-elastic-pool.md) or a shard set (created using  [Elastic Database client library](sql-database-elastic-scale-introduction.md)). While in preview, **Elastic Database jobs** is currently a customer-hosted Azure Cloud Service that enables the execution of ad-hoc and scheduled administrative tasks, which are called jobs. Using this feature, you can easily and reliably manage large numbers of Azure SQL Databases at scale by running Transact-SQL scripts to perform administrative operations such as schema changes, credentials management, reference data updates, performance data collection or tenant (customer) telemetry collection. For more information about Elastic Database jobs, see [Elastic Database jobs overview](sql-database-elastic-jobs-overview.md).

![Elastic database job service][1]

With the PowerShell APIs for **Elastic Database* jobs**, you have flexibility to define which group of databases against which scripts will execute. Currently, **Elastic Database jobs** functionality via the Azure portal has reduced feature set and is limited to execution against Elastic Database pools.

**Elastic Database jobs** (preview) uses multiple Azure components to define the jobs to be performed, define when to perform the jobs, execute the jobs, track the success or failure of the jobs and optionally specify a results destination for results returning queries. Since the Powershell APIs included in this preview contain additional functionality since the initial preview via the Portal, it is suggested you install the latest **Elastic Database jobs** components. If already installed, you can simply upgrade the **Elastic Database jobs** components. For more information about installation and upgrade, see [Install the Elastic Database jobs components](sql-database-elastic-jobs-service-installation.md).

This article will show you how to create everything you need to create and manage **Elastic Database jobs**, except for the Azure subscription. If you need an Azure subscription, simply click FREE TRIAL at the top of this page, and then come back to finish this article. This topic extends on the sample found in [Getting started with Elastic Database tools](sql-database-elastic-scale-get-started.md). When completed, you will learn how to create and manage jobs to perform administrative operations against a group of sharded databases defined by a **shard set** and alternatively custom-collection of databases.

## Prerequisites
* An Azure subscription. For a free trial, see [Free one-month trial](http://azure.microsoft.com/pricing/free-trial/).
* **Elastic Database jobs** PowerShell package must first be downloaded, imported and the Elastic Database jobs components installed. Follow these steps: [Installing Elastic Database jobs](sql-database-elastic-jobs-service-installation.md)
* Azure PowerShell version >= 0.8.16. Install the latest version (0.9.5) through the [Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376). For detailed information, see [How to install and configure Azure PowerShell](powershell-install-configure.md).

### Select your Azure subscription

To select the subscription you need your subscription Id (**-SubscriptionId**) or subscription name (**-SubscriptionName**). If you have multiple subscriptions you can run the **Get-AzureSubscription** cmdlet and copy the desired subscription information from the result set. Once you have your subscription information, run the following commandlet to set this subscription as the default, namely the target for creating and managing jobs:

	PS C:\>Select-AzureSubscription -SubscriptionId 4cac86b0-1e56-bbbb-aaaa-000000000000

The [PowerShell ISE](https://technet.microsoft.com/en-us/library/dd315244.aspx) is recommended for usage to develop and execute PowerShell scripts against the Elastic Database jobs.  To load the Elastic Database jobs PowerShell module, execute the following from an Azure PowerShell prompt such as the one within powershell_ise.exe:

## Elastic Database jobs objects

The following table lists out different object types within **Elastic Database jobs** along with its description and relevant PowerShell APIs.

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
    <td><a href="https://msdn.microsoft.com/en-us/library/ee210546.aspx">Data-tier application </a> package to be applied across databases.

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
    <td>Job Cleanup</td>
    <td>
	<p>Marks a job for deletion and the system will delete the job and all its job history after all job executions have completed for the job.</p>
	</td>
	<td>
	<p>Remove-AzureSqlJob</p>

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
	<p>Remove-AzureSqlJobTrigger/p>
	</td>
  </tr>
</table>

## Different Supported Elastic Database Jobs Group Types
**Elastic Database jobs** enables execution of Transact-SQL scripts or application of DACPACs across defined groups of databases. When a job is submitted to be executed across a group of databases, Elastic Database jobs will “expand” the job into child jobs where each which job performs the requested execution against a single database in the group.
 
The following is a list of current supported group types:
* [Elastic Scale Shard Map](sql-database-elastic-scale-shard-map-management.md): [Elastic Database tools](sql-database-elastic-scale-introduction/).  When a job is submitted to target an shard map, Elastic Database jobs will query the shard map to determine its current set of shards and then expand the job to child jobs matching each shard within the shard map.
* Custom Collection:  Specified to point to a custom defined set of databases.  When a job is submitted to target a custom collection, Elastic Database Jobs will expand the job to child jobs matching each database currently defined within the custom collection.

## Using the Elastic Database jobs PowerShell API

### Setting the Elastic Database Jobs Control Database Connection
After loading the Elastic Database Jobs PowerShell module, the Elastic Database Jobs control database connection needs to be set prior to using other APIs.  The following script can be used to accomplish setting the database connection.  Invocation of this cmdlet will trigger a credential window to pop up requesting the user name/password supplied when installing Elastic Database Jobs.  All examples provided within this documentation assume that this first step has already been performed.

#### Open a connection to the Elastic Database jobs Database
	PS C:\>Use-AzureSqlJobConnection -CurrentAzureSubscription 

### Creating encrypted credentials within the Elastic Database jobs

Database credentials can be inserted into Elastic Database jobs with its password encrypted within the Elastic Database Jobs control database.  It is necessary to store credentials to enable jobs to be executed at a later time.
 
Encryption works within Elastic Database jobs through a certificate created as part of the installation script. The installation script creates and then uploads the certificate into the Azure cloud service for decryption of the stored encrypted passwords. The Azure cloud service later stores the public key within the Elastic Database Jobs control database which enables the PowerShell API or Azure Portal interface to encrypt a provided password without requiring the certificate to be locally installed.
 
While the credential passwords are encrypted within the Elastic Database Jobs table and secure from users with read-only access to the Elastic Database jobs objects, it is possible for malicious user with read-write access to Elastic Database Jobs objects to extract out a password.  Credentials are designed to be reused across job executions.  Credentials are passed to target databases when establishing connections.  There are currently not any restrictions on the target databases used for each credential so it is possible for a malicious user to add a database target for a database in their control and subsequently start a job targeting this database to gain knowledge of the credential's password.

There are some security best practices for Elastic Database Jobs usage:
* Limit usage of the Elastic Database Jobs APIs to trusted individuals.
* Credentials should have the least privileges necessary to perform the job task.  More information can be seen within this [Authorization and Permissions](https://msdn.microsoft.com/en-us/library/bb669084.aspx) SQL Server MSDN article.

The following PowerShell script can be used to insert a provided user name and password as a credential:

	PS C:\>$credentialName = "{Credential Name}"

Create a credential for execution within the Elastic Database Jobs across databases

	PS C:\>$databaseCredential = Get-Credential
	PS C:\>$credential = New-AzureSqlJobCredential -Credential $databaseCredential -CredentialName $credentialName
	PS C:\>Write-Output $credential

### Updating Credentials within the Elastic Database Jobs
Database credentials can be updated within Elastic Database Jobs to support the case of having passwords changed. The following PowerShell script can be used to update a credential:

Set the following variables to reflect the desired credentials to be updated:

	PS C:\>$credentialName = "{Credential Name}"

	PS C:\>$updatedCredential = Get-Credential
	PS C:\>Set-AzureSqlJobCredential -CredentialName $credentialName -Credential $credential 

### Defining an Elastic Scale Shard Map Group Target
[Azure SQL Database Elastic Database tools shard map](sql-database-elastic-scale-get-started.md) defines a group of shards within a database application.  The shard maps can be registered within Elastic Database jobs to enable execution across each database within the shard map.
  
This example is dependent on you creating a shard application using the Elastic Database client library. Download and run the [Getting started with Elastic Database tools sample](sql-database-elastic-scale-get-started.md).

####Create a shard map manager using the sample app

Here you will create a shard map manager along with several shards, followed by insertion of data into the shards. If you happen to already have shards setup with sharded data in them, you can skip the following steps and move to the next section.

1. Build and run the **Getting started with Elastic Database tools** sample application. Follow the steps until step 7 in the section [Download and run the sample app](sql-database-elastic-scale-get-started.md#Getting-started-with-elastic-database-tools). At the end of Step 7, you will see the following command prompt:

	![command prompt][2]

2.  In the command window, type "1" and press **Enter**. This creates the shard map manager, and adds two shards to the server. Then type "3" and press **Enter**; repeat the action four times. This inserts sample data rows in your shards.
3.  The [Azure preview portal](https://portal.azure.com) should show three new databases in your v12 server:

	![Visual Studio confirmation][3]

The following PowerShell script can be used to create a shard map target in Elastic Database jobs. This script creates a database target pointing to the database holding the shard map and then registers the shard map as a target that can be later used for execution.

Set the following variables to reflect the shard map configuration with the provided credentials used to connect to the shard map database:

	PS C:\>$shardMapCredentialName = "{Credential Name}"
	PS C:\>$shardMapDatabaseName = "{ShardMapDatabaseName}"
	PS C:\>$shardMapDatabaseServerName = "{ShardMapServerName}.database.windows.net"
	PS C:\>$shardMapName = "MyShardMap"

Create a database target pointing to the shard map:

	PS C:\>$shardMapDatabaseTarget = New-AzureSqlJobTarget -DatabaseName $shardMapDatabaseName -ServerName $shardMapDatabaseServerName
	PS C:\>$shardMapTarget = New-AzureSqlJobTarget -ShardMapManagerCredentialName $shardMapCredentialName -ShardMapManagerDatabaseName $shardMapDatabaseName -ShardMapServerName $shardMapDatabaseServerName -ShardMapName $shardMapName
	PS C:\>Write-Output $shardMapTarget

### Creating a Transact-SQL Script for Execution across Databases

When creating T-SQL scripts for execution, it is highly recommended to build them to be idempotent and resilient against failures.  The Elastic Database Jobs service will retry execution of a script whenever execution encounters a failure, regardless of the classification of the failure.

Set the following variables to reflect the desired script to be added:

	PS C:\>$scriptName = "Create a EdjTestTable"
	PS C:\>$scriptCommandText = "
	IF NOT EXISTS (SELECT name FROM sys.tables WHERE name = 'EdjTestTable')
	BEGIN
	CREATE TABLE EdjTestTable(
		EdjTestTableId INT PRIMARY KEY IDENTITY,
		InsertionTime DATETIME2
	);
	END
	GO

	INSERT INTO EdjTestTable(InsertionTime) VALUES (sysutcdatetime());
	GO"

Create a new Elastic Database jobs script:

	PS C:\>$script = New-AzureSqlJobContent -ContentName $scriptName -CommandText $scriptCommandText
	PS C:\>Write-Output $script

#### Create a new Elastic Database jobs script from file
If the T-SQL script is defined within a file, the following script could be used to import the script:

	PS C:\>$scriptName = "My Script Imported from a File"
	PS C:\>$scriptPath = "{Path to SQL File}"

Create a new Elastic Database Jobs script from a file:

	PS C:\>$scriptCommandText = Get-Content -Path $scriptPath
	PS C:\>$script = New-AzureSqlJobContent -ContentName $scriptName -CommandText $scriptCommandText
	PS C:\>Write-Output $script

#### Update a T-SQL Script for Execution across Databases  

The following PowerShell script can be used to update the T-SQL command text for an existing script.

Set the following variables to reflect the desired script definition to be set:

	PS C:\>$scriptName = "Create a EdjTestTable"
	PS C:\>$scriptUpdateComment = "Adding AdditionalInformation column to EdjTestTable"
	PS C:\>$scriptCommandText = "
	IF NOT EXISTS (SELECT name FROM sys.tables WHERE name = 'EdjTestTable')
	BEGIN
	CREATE TABLE EdjTestTable(
		EdjTestTableId INT PRIMARY KEY IDENTITY,
		InsertionTime DATETIME2
	);
	END
	GO

	IF NOT EXISTS (SELECT columns.name FROM sys.columns INNER JOIN sys.tables on columns.object_id = tables.object_id WHERE tables.name = 'EdjTestTable' AND columns.name = 'AdditionalInformation')
	BEGIN
    ALTER TABLE EdjTestTable
    ADD AdditionalInformation NVARCHAR(400);
	END
	GO

	INSERT INTO EdjTestTable(InsertionTime, AdditionalInformation) VALUES (sysutcdatetime(), 'test');
	GO"

#### Update the definition to an existing script

	PS C:\>Set-AzureSqlJobScriptDefinition -ContentName $scriptName -CommandText $scriptCommandText -Comment $scriptUpdateComment 

###Create a Job to Execute a Script across an shard map

The following PowerShell script can be used to start a job for execution of a script across each shard in an Elastic Scale shard map.

Set the following variables to reflect the desired script and target:

	PS C:\>$jobName = "{Job Name}"
	PS C:\>$scriptName = "{Script Name}"
	PS C:\>$shardMapServerName = "{Shard Map Server Name}"
	PS C:\>$shardMapDatabaseName = "{Shard Map Database Name}"
	PS C:\>$shardMapName = "{Shard Map Name}"
	PS C:\>$credentialName = "{Credential Name}"

### Start a Elastic Database jobs *job*

	PS C:\>$shardMapTarget = Get-AzureSqlJobTarget -ShardMapManagerDatabaseName $shardMapDatabaseName -ShardMapManagerServerName $shardMapServerName -ShardMapName $shardMapName 
	PS C:\>$job = New-AzureSqlJob -ContentName $scriptName -CredentialName $credentialName -JobName $jobName -TargetId $shardMapTarget.TargetId
	PS C:\>Write-Output $job

###Executing a Job 

The following PowerShell script can be used to execute an existing job:

Update the following variable to reflect the desired job name to have executed:

	PS C:\>$jobName = "{Job Name}"
	PS C:\>$jobExecution = Start-AzureSqlJobExecution -JobName $jobName 
	PS C:\>Write-Output $jobExecution
 
### Obtaining state of a single job execution

The following PowerShell script can be used to view the state of job execution.

Set the following variables to reflect the desired job execution:

	PS C:\>$jobExecutionId = "{Job Execution Id}"

Get the Elastic database job execution information:

	PS C:\>$jobExecution = Get-AzureSqlJobExecution -JobExecutionId $jobExecutionId
	PS C:\>Write-Output $jobExecution

View the state of child job executions:

	PS C:\>$jobExecutionId = "{Job Execution Id}"

Get the elastic database job execution information:

	PS C:\>$jobExecutions = Get-AzureSqlJobExecution -JobExecutionId $jobExecutionId -IncludeChildren
	PS C:\>Write-Output $jobExecutions 

### Obtaining state across multiple job executions

The Get-AzureSqlJobExecution cmdlet has multiple optional parameters that can be used to display multiple job executions, filtered through the provided parameters.  The following script demonstrates some of the possible ways to use Get-AzureSqlJobExecution:

Retrieve all active top level job executions:

	PS C:\>Get-AzureSqlJobExecution

Retrieve all top level job executions, including inactive job executions:

	PS C:\>Get-AzureSqlJobExecution -IncludeInactive

Retrieve all child job executions of a provided job execution ID, including inactive job executions:

	PS C:\>$parentJobExecutionId = "{Job Execution Id}"
	PS C:\>-AzureSqlJobExecution -JobExecutionId $parentJobExecutionId –IncludeInactive -IncludeChildren

Retrieve all job executions created using a schedule / job combination, including inactive jobs:

	PS C:\>$jobName = "{Job Name}"
	PS C:\>$scheduleName = "{Schedule Name}"
	PS C:\>Get-AzureSqlJobExecution -JobName $jobName -ScheduleName $scheduleName -IncludeInactive

Retrieve all jobs targeting a specified shard map, including inactive jobs:

	PS C:\>$shardMapServerName = "{Shard Map Server Name}"
	PS C:\>$shardMapDatabaseName = "{Shard Map Database Name}"
	PS C:\>$shardMapName = "{Shard Map Name}"
	PS C:\>$target = Get-AzureSqlJobTarget -ShardMapManagerDatabaseName $shardMapDatabaseName -ShardMapManagerServerName $shardMapServerName -ShardMapName $shardMapName
	PS C:\>Get-AzureSqlJobExecution -TargetId $target.TargetId –IncludeInactive

Retrieve all jobs targeting a specified custom collection, including inactive jobs:

	PS C:\>$customCollectionName = "{Custom Collection Name}"
	PS C:\>$target = Get-AzureSqlJobTarget -CustomCollectionName $customCollectionName
	PS C:\>Get-AzureSqlJobExecution -TargetId $target.TargetId –IncludeInactive
 
Retrieve the list of job task executions within a specific job execution:

	PS C:\>$jobExecutionId = "{Job Execution Id}"

Retrieve the list of job task executions:

	PS C:\>$jobTaskExecutions = Get-AzureSqlJobTaskExecution -JobExecutionId $jobExecutionId
	PS C:\>Write-Output $jobTaskExecutions 

Retrieve job task execution details:

The following PowerShell script can be used to view the details of a job task execution, which is particularly useful when debugging execution failures.

Set the following variables to reflect the desired job task execution id:

	PS C:\>$jobTaskExecutionId = "{Job Task Execution Id}"

Get the details of an elastic database job task execution:

	PS C:\>$jobTaskExecution = Get-AzureSqlJobTaskExecution -JobTaskExecutionId $jobTaskExecutionId
	PS C:\>Write-Output $jobTaskExecution

### Obtaining Failures within Job Task Executions

The JobTaskExecution object includes a property for the Lifecycle of the task along with a Message property.  If a job task execution failed, the Lifecycle property will be set to “Failed” and the Message property will be set to the resulting exception message and its stack.  
The following PowerShell script can be used to view the details of job tasks that did not succeed for a given job.

Set the following variables to reflect the desired job task execution id:

	PS C:\>$jobExecutionId = "{Job Execution Id}"

	PS C:\>$jobTaskExecutions = Get-AzureSqlJobTaskExecution -JobExecutionId $jobExecutionId
	Foreach($jobTaskExecution in $jobTaskExecutions) 
		{
		if($jobTaskExecution.Lifecycle -ne 'Succeeded')
    		{
        	Write-Output $jobTaskExecution
    		}
		}

### Waiting for a job execution to complete

The following PowerShell script can be used to wait for a job task to complete:

	PS C:\>$jobExecutionId = "{Job Execution Id}"
	PS C:\>Wait-AzureSqlJobExecution -JobExecutionId $jobExecutionId 

### Create a custom execution policy

Elastic Database Jobs supports creating custom execution policies that can be applied when starting jobs.
  
Execution policies currently allow for defining:

* Name: Identifier for the execution policy.
* Job Timeout: Total time before a job will be canceled by Elastic Database Jobs.
* Initial Retry Interval: Interval to wait before first retry.
* Maximum Retry Interval: Cap of retry intervals to use.
* Retry Interval Backoff Coefficient: Coefficient used to calculate the next interval between retries.  The following formula is used: (Initial Retry Interval) * Math.pow((Interval Backoff Coefficient), (Number of Retries) - 2). 
* Maximum Attempts: The maximum number of retry attempts to perform within a job.

Elastic Database Jobs default execution policy uses the following values:

* Name: Default execution policy
* Job Timeout: 1 week
* Initial Retry Interval:  100 milliseconds
* Maximum Retry Interval: 30 minutes
* Retry Interval Coefficient: 2
* Maximum Attempts: 2,147,483,647

Set the following variables to reflect the desired execution policy:

	PS C:\>$executionPolicyName = "{Execution Policy Name}"
	PS C:\>$initialRetryInterval = New-TimeSpan -Seconds 10
	PS C:\>$jobTimeout = New-TimeSpan -Minutes 30
	PS C:\>$maximumAttempts = 999999
	PS C:\>$maximumRetryInterval = New-TimeSpan -Minutes 1
	PS C:\>$retryIntervalBackoffCoefficient = 1.5

Create an execution policy:

	PS C:\>$executionPolicy = New-AzureSqlJobExecutionPolicy -ExecutionPolicyName $executionPolicyName -InitialRetryInterval $initialRetryInterval -JobTimeout $jobTimeout -MaximumAttempts $maximumAttempts -MaximumRetryInterval $maximumRetryInterval -RetryIntervalBackoffCoefficient $retryIntervalBackoffCoefficient
	PS C:\>Write-Output $executionPolicy

#### Updating a custom execution Policy

Elastic Database jobs supports updating an existing custom execution policy. 

Set the following variables to reflect the desired execution policy to update:

	PS C:\>$executionPolicyName = "{Execution Policy Name}"
	PS C:\>$initialRetryInterval = New-TimeSpan -Seconds 15
	PS C:\>$jobTimeout = New-TimeSpan -Minutes 30
	PS C:\>$maximumAttempts = 999999
	PS C:\>$maximumRetryInterval = New-TimeSpan -Minutes 1
	PS C:\>$retryIntervalBackoffCoefficient = 1.5

Update an execution policy:

	PS C:\>$updatedExecutionPolicy = Set-AzureSqlJobExecutionPolicy -ExecutionPolicyName $executionPolicyName -InitialRetryInterval $initialRetryInterval -JobTimeout $jobTimeout -MaximumAttempts $maximumAttempts -MaximumRetryInterval $maximumRetryInterval -RetryIntervalBackoffCoefficient $retryIntervalBackoffCoefficient
	PS C:\>Write-Output $updatedExecutionPolicy
 
### Cancel a jobs

Elastic Database Jobs supports cancellation requests of jobs.  If Elastic Database Jobs detects a cancellation request for a job currently being executed, it will attempt to stop the job.

There are two different ways that Elastic Database Jobs can perform a cancellation:

1. Canceling Currently Executing Tasks: If a cancellation is detected while a task is currently running, a cancellation will be attempted within the currently executing aspect of the task.  For example: If there is a long running query currently being performed when a cancellation is attempted, there will be an attempt to cancel the query.
2. Canceling Task Retries: If a cancellation is detected by the control thread before a task is launched for execution, the control thread will avoid launching the task and declare the request as canceled.

If a job cancellation is requested for a parent job, the cancellation request will be honored for the parent job and for all of its child jobs.
 
To submit a cancellation request, the following PowerShell script can be used:

Set the following variables to reflect the job to be canceled:
	PS C:\>$jobExecutionId = "{Job Execution Id}"
	PS C:\>Stop-AzureSqlJobExecution -JobExecutionId $jobExecutionId

### Deleting jobs and job history

Elastic Database jobs supports asynchronous deletion of jobs. A job can be marked for deletion and the system will delete the job and all its job history after all job executions have completed for the job. The system will not automatically cancel active job executions.  

Instead, Stop-AzureSqlJobExecution must be invoked to cancel active job executions.

To trigger job deletion, the following PowerShell script can be used:
	PS C:\>$jobName = "{Job Name}"

Request a deletion of a job:
	PS C:\>Remove-AzureSqlJob -JobName $jobName
 
### Creating a custom database target
Custom database targets can be defined in Elastic Database jobs which can be used either for execution directly or for inclusion within a custom database group. Since **Elastic Database pools** are not yet directly supported via the PowerShell APIs, you simply create a custom database target and custom database collection target which encompasses all the databases in the pool.

Set the following variables to reflect the desired database information:

	PS C:\>$databaseName = "{Database Name}"
	PS C:\>$databaseServerName = "{Server Name}.database.windows.net"
	PS C:\>New-AzureSqlJobDatabaseTarget -DatabaseName $databaseName -ServerName $databaseServerName 

### Creating a custom database collection target
A custom database collection target can be defined to enable execution across multiple defined database targets.  After a database group is created, databases can be associated to the custom collection target.

Set the following variables to refect the desired custom collection target configuration:

	PS C:\>$customCollectionName = "{Custom Database Collection Name}"
	PS C:\>New-AzureSqlJobTarget -CustomCollectionName $customCollectionName 

#### Adding databases to a custom database collection target

Database targets can be associated with custom database collection targets to create a group of databases. Whenever a job is created that targets a custom database collection target, it will be expanded to target the databases associated to the group at the time of execution.

Set the following variables to add the desired database to a specific custom collection:

	PS C:\>$serverName = "{Database Server Name}"
	PS C:\>$databaseName = "{Database Name}"
	PS C:\>$customCollectionName = "{Custom Database Collection Name}"

Add a database target association to a custom collection:

	PS C:\>Add-AzureSqlJobChildTarget -CustomCollectionName $customCollectionName -DatabaseName $databaseName -ServerName $databaseServerName 

##### Obtaining the Databases within a Custom Database Collection Target

The following PowerShell script can be used to view the child databases within a custom database collection target:
 
Set the custom collection name to use:
 
	PS C:\>$customCollectionName = "{Custom Database Collection Name}"
	PS C:\>$target = Get-AzureSqlJobTarget -CustomCollectionName $customCollectionName
	PS C:\>$childTargets = Get-AzureSqlJobTarget -ParentTargetId $target.TargetId
	PS C:\>Write-Output $childTargets 

#### Create a job to execute a script across a custom database collection target

The following PowerShell script starts a job against a defined custom database collection targets. The Elastic Database jobs will expand the job into multiple child jobs each corresponding to a database associated with the custom database collection target.

Set the following variables to reflect the desired script and custom collection target:

	PS C:\>$jobName = "{Job Name}"
	PS C:\>$scriptName = "{Script Name}"
	PS C:\>$customCollectionName = "{Custom Collection Name}"
	PS C:\>$credentialName = "{Credential Name}"

Create a job that uses a custom collection:

	PS C:\>$target = Get-AzureSqlJobTarget -CustomCollectionName $customCollectionName
	PS C:\>$job = New-AzureSqlJob -JobName $jobName -CredentialName $credentialName -ContentName $scriptName -TargetId $target.TargetId
	PS C:\>Write-Output $job

### Data collection across databases

The Elastic Database jobs supports executing a query across a set of databases and having the results sent to a specified database’s table. The table can be queried after the fact to see the query’s results from each database. This provides an asynchronous mechanism to execute a query across many databases. Failure cases such as one of the databases being temporarily unavailable are handled by Elastic Database jobs via retries.

A provided destination table will be automatically created if it does not yet exist matching the schema of the returned result set. If a script execution returns multiple result sets, Elastic Database jobs will only send the first one to the provided destination table.

The following PowerShell script can be used to execute a script collecting its results into a specified table. This script assumes that a T-SQL script has been created which outputs a single result set and a custom database collection target has been created.

Set the following to reflect the desired script, credentials, and execution target:

	PS C:\>$jobName = "{Job Name}"
	PS C:\>$scriptName = "{Script Name}"
	PS C:\>$executionCredentialName = "{Execution Credential Name}"
	PS C:\>$customCollectionName = "{Custom Collection Name}"

Set the following to reflect the desired destination table and credential to use for insertion into the destination table:

	PS C:\>$destinationCredentialName = "{Destination Credential Name}"
	PS C:\>$destinationServerName = "{Destination Server Name}"
	PS C:\>$destinationDatabaseName = "{Destination Database Name}"
	PS C:\>$destinationSchemaName = "{Destination Schema Name}"
	PS C:\>$destinationTableName = "{Destination Table Name}"
	PS C:\>$target = Get-AzureSqlJobTarget -CustomCollectionName $customCollectionName

#### Create and start a job for data collection scenarios
	PS C:\>$job = New-AzureSqlJob -JobName $jobName -CredentialName $executionCredentialName -ContentName $scriptName -ResultSetDestinationServerName $destinationServerName -ResultSetDestinationDatabaseName $destinationDatabaseName -ResultSetDestinationSchemaName $destinationSchemaName -ResultSetDestinationTableName $destinationTableName -ResultSetDestinationCredentialName $destinationCredentialName -TargetId $target.TargetId
	PS C:\>Write-Output $job
	PS C:\>$jobExecution = Start-AzureSqlJobExecution -JobName $jobName
	PS C:\>Write-Output $jobExecution

### Create a schedule for job execution using a job trigger

The following PowerShell script can be used to create a reoccurring schedule. This script uses a minute interval, but New-AzureSqlJobSchedule also supports -DayInterval, -HourInterval, -MonthInterval, and -WeekInterval parameters. Schedules that execute only once can be created by passing -OneTime.

Set the following variables to correspond to the desired schedule:

	PS C:\>$scheduleName = "Every one minute"
	PS C:\>$minuteInterval = 1
	PS C:\>$startTime = (Get-Date).ToUniversalTime()

Create a new schedule:

	PS C:\>$schedule = New-AzureSqlJobSchedule -MinuteInterval $minuteInterval -ScheduleName $scheduleName -StartTime $startTime 
	PS C:\>Write-Output $schedule

#### Create a job trigger to have a job executed on a time schedule

A job trigger can be defined to have a job executed according to a time schedule. The following PowerShell script can be used to create a job trigger.

Set the following variables to correspond to the desired job and schedule:

	PS C:\>$jobName = "{Job Name}"
	PS C:\>$scheduleName = "{Schedule Name}"
	PS C:\>$jobTrigger = New-AzureSqlJobTrigger -ScheduleName $scheduleName –JobName $jobName
	PS C:\>Write-Output $jobTrigger

#### Remove a scheduled association to stop job from executing on schedule

To discontinue reoccurring job execution through a job trigger, the job trigger can be removed.  The following PowerShell script can be used to remove a job trigger:
 
Set the following variables to correspond to the desired job and schedule:

	PS C:\>$jobName = "{Job Name}"
	PS C:\>$scheduleName = "{Schedule Name}"

Remove a job trigger to stop a job from being executed according to a schedule:

	PS C:\>Remove-AzureSqlJobTrigger -ScheduleName $scheduleName -JobName $jobName

#### Retrieve job triggers bound to a time schedule

The following PowerShell script can be used to obtain and display the job triggers registered to a particular time schedule.

Set the following to reflect the desired schedule name to use to identify job triggers:

	PS C:\>$scheduleName = "{Schedule Name}"

Display the jobs registered to the schedule:

	PS C:\>$jobTriggers = Get-AzureSqlJobTrigger -ScheduleName $scheduleName
	PS C:\>Write-Output $jobTriggers

#### Retrieve job triggers bound to a job 

The following PowerShell script can be used to obtain and display schedules containing a registered job.

Set the following to reflect the desired job name to use to identify job triggers:

	PS C:\>$jobName = "{Job Name}"

Display the job triggers containing the specified job:

	PS C:\>$jobTriggers = Get-AzureSqlJobTrigger -JobName $jobName
	PS C:\>Write-Output $jobTriggers

### Create a Data-tier Application Deployment (DACPAC) for execution across databases

Elastic Database jobs can be used to deploy a data-tier application (DACPAC) to a group of databases. To create a DACPAC, please refer to this documentation.  For Elastic Database Jobs to deploy a DACPAC to a group of databases, the DACPAC must be accessible to the service. It is recommended to upload a created DACPAC to Azure Storage and create a signed URI for the DACPAC.

The following PowerShell script can be used to insert a DACPAC into Elastic Database Jobs:

	PS C:\>$dacpacUri = "{Uri}"
	PS C:\>$dacpacName = "{Dacpac Name}"
	PS C:\>$dacpac = New-AzureSqlJobContent -DacpacUri $dacpacUri -ContentName $dacpacName 
	PS C:\>Write-Output $dacpac

#### Updating a Data-tier Application Deployment (DACPAC) for execution across databases

Existing DACPACs registered within Elastic Database Jobs can be updated to point to new URIs.
The following PowerShell script can be used to update the DACPAC URI on an existing registered DACPAC:

	PS C:\>$dacpacName = "{Dacpac Name}"
	PS C:\>$newDacpacUri = "{Uri}"
	PS C:\>$updatedDacpac = Set-AzureSqlJobDacpacDefinition -ContentName $dacpacName -DacpacUri $newDacpacUri
	PS C:\>Write-Output $updatedDacpac

### Create a Job to Apply a Data-tier Application Deployment (DACPAC) across databases

After a DACPAC has been created within Elastic Database Jobs, a job can be created to apply the DACPAC across a group of databases.  The following PowerShell script can be used to create a DACPAC job across a custom collection of databases:

Set the following variables to reflect the desired script and target:

	PS C:\>$jobName = "{Job Name}"
	PS C:\>$dacpacName = "{Dacpac Name}"
	PS C:\>$customCollectionName = "{Custom Collection Name}"
	PS C:\>$credentialName = "{Credential Name}"

Create a job to apply a DACPAC across a custom collection:

	PS C:\>$target = Get-AzureSqlJobTarget -CustomCollectionName $customCollectionName
	PS C:\>$job = New-AzureSqlJob -JobName $jobName -CredentialName $credentialName -ContentName $dacpacName -TargetId $target.TargetId
	PS C:\>Write-Output $job 

[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-jobs-powershell/elastic-jobs-powershell.png
[2]: ./media/sql-database-elastic-jobs-powershell/cmd-prompt.png
[3]: ./media/sql-database-elastic-jobs-powershell/portal.png
<!--anchors-->
