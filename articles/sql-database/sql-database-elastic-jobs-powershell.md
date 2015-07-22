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
	ms.date="07/20/2015" 
	ms.author="ddove; sidneyh" />

# Create and manage a SQL Database elastic database jobs using PowerShell (preview)

> [AZURE.SELECTOR]
- [Azure portal](sql-database-elastic-jobs-create-and-manage.md)
- [PowerShell](sql-database-elastic-jobs-powershell.md)

## Overview

The **Elastic Database jobs** feature, in preview, enables you to run a Transact-SQL script across a group of databases including custom-defined collection of databases, all databases in an [Elastic Database pool (preview)](sql-database-elastic-pool.md) or an **Elastic Database Shard set** in Azure SQL Database. In preview, **Elastic Database jobs** is currently a customer-hosted Azure Cloud Service that enables the execution of ad-hoc and scheduled administrative tasks, which are called jobs. Using this feature, you can easily and reliably manage Azure SQL Database at scale across an entire group of databases by running Transact-SQL scripts to perform administrative operations such as schema changes, credentials management, reference data updates, performance data collection or tenant (customer) telemetry collection. For more information about elastic database jobs, see [Elastic Database jobs overview](sql-database-elastic-jobs-overview.md).

![Elastic database job service][1]

This article shows you how create and manage **Elastic Database jobs** using PowerShell. In the initial preview, **Elastic Database jobs** was accessible only through the Azure portal. However, the Azure portal surfaces a reduced functionality set limited to Elastic Database pools. The PowerShell APIs included within this preview provides the full preview feature set of **Elastic Database jobs**. If you need an Azure subscription simply click **FREE TRIAL** in prerequisites.

This topic extends the sample found in [Getting started with Elastic Database tools](sql-database-elastic-scale-get-started.md). When completed, you will: learn how to create and manage jobs to perform administrative operations against a group of sharded databases defined by a **Shard set** and a custom-collection of databases.

**Elastic Database jobs** (preview) uses multiple Azure components to define the jobs to be performed, define when to perform the jobs, execute the jobs, track the success or failure of the jobs and optionally specify a results destination for queries which return results. Since the Powershell APIs included in this preview contains additional functionality since the initial preview of the Portal, it is suggested you install the latest **Elastic Database jobs** components. If already installed, you can simply upgrade the **Elastic Database jobs** components. For more information ad installation and upgrade, see [Install the Elastic Database jobs components](sql-database-elastic-jobs-service-installation.md).

## Download the Elastic Database jobs PowerShell package

1. Download the latest NuGet version from [NuGet](http://docs.nuget.org/docs/start-here/installing-nuget).
2. Open a command prompt and navigate to the directory where you downloaded nuget.exe.
3. Download the latest Elastic database jobs package into the current directory with the below command:
`nuget install Microsoft.Azure.SqlDatabase.Jobs.PowerShell`  

The steps above download the **Elastic Database jobs** files to the current directory. The files are placed in a directory named **Microsoft.Azure.SqlDatabase.Jobs.PowerShell.dll.x.x.xxx.x** where *x.x.xxx.x* reflects the version number. You will find all the **Elastic Database jobs** PowerShell cmdlets (including required client .dlls), and PowerShell scripts to install, upgrade and uninstall **Elastic Database jobs**. The files will reside in the **content** sub-directory.

* FIX
To use this PowerShell module, copy the ElasticDatabaseJobs directory (not just the contents of the directory, but the entire directory itself) into your $home\Documents\WindowsPowerShell\Modules directory (e.g. C:\Users\MyUserName\Documents\WindowsPowerShell\Modules). Then in a PowerShell command window, execute this command to import the module:

Import-Module ElasticDatabaseJobs

If this fails, ensure that the the ElasticDatabaseJobs manifest file has been copied to the correct location by running the below command:

dir $home\Documents\WindowsPowerShell\Modules\ElasticDatabaseJobs\ElasticDatabaseJobs.psd1

* FIX

## Prerequisites
* An Azure subscription. For a free trial, see [Free one-month trial](http://azure.microsoft.com/pricing/free-trial/).
* An Azure SQL Database server. If you do not have a server, create one following the steps: [Create your first Azure SQL Database](sql-database-get-started.md).
* Download and run the [Getting started with Elastic Database tools sample](sql-database-elastic-scale-get-started.md).
* Azure PowerShell version >= 0.8.11. You can download and install the Azure PowerShell modules by running the [Microsoft Web Platform Installer](http://go.microsoft.com/fwlink/p/?linkid=320376&clcid=0x409). For detailed information, see [How to install and configure Azure PowerShell](../powershell-install-configure.md).

To create **Elastic Database jobs** with PowerShell, you need to have Azure PowerShell installed and running, and switch it into resource manager mode to access the Azure Resource Manager PowerShell Cmdlets.

### Install Azure PowerShell
To install Azure Powershell, see [How to install and configure Azure PowerShell](http://azure.microsoft.com/documentation/articles/install-configure-powershell/).

We recommend [PowerShell ISE](https://technet.microsoft.com/en-us/library/dd315244.aspx) to develop and execute PowerShell scripts.

### Switch to Azure Resource Manager

The cmdlets for creating and managing Azure SQL Databases are located in the Azure Resource Manager module. When you start Azure PowerShell, the cmdlets in the Azure module are imported by default. To switch to the Azure Resource Manager module, use the Switch-AzureMode cmdlet.

	PS C:\>Switch-AzureMode -Name AzureResourceManager

For detailed information, see [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).





### Select your Azure subscription

To select the subscription you need your subscription Id or subscription name (**-SubscriptionName**). If you have multiple subscriptions you can run the **Get-AzureSubscription** cmdlet and copy the desired subscription information from the resultset. Once you have your subscription run the following cmdlet:

	PS C:\>Select-AzureSubscription -SubscriptionId 4cac86b0-1e56-bbbb-aaaa-000000000000

## How elastic database jobs work

  1. An Azure SQL Database is designated a control database which stores all metadata and state data.  
  2. The control database is accessed by the Elastic Database Jobs service to both launch and track jobs to execute.
  3. Two different roles communicate with the control database:
  	* **Controller**: Determines which jobs require tasks to perform the requested job, and retries failed jobs by creating new job tasks.
  	* **Job Task Execution**: Carries out the job tasks.

### Job task types

There are multiple types of job tasks that carry out execution of jobs:

  * ShardMapRefresh: Queries the shard map to determine all the databases used as shards.  

  * ScriptSplit: Splits the script across ‘GO’ statements into batches.

  * ExpandJob: Creates child jobs for each database from a job that targets a group of databases.

  * ScriptExecution: Executes a script against a particular database using defined credentials.

  * Dacpac: Applies a DACPAC to a particular database using particular credentials.

## Sample Scenario: end-to-end job execution workflow
  1. Using the PowerShell API, a job is inserted into the control database. The job requests execution of a T-SQL script against a group of databases using specific credentials.

  2. The controller identifies the new job. Job tasks are created and executed to split the script and to refresh the group’s databases. Lastly, a new job is created and executed to expand the job and create new child jobs where each child job is specified to execute the T-SQL script against an individual database in the group.

  3. The controller identifies the created child jobs.  For each job, the controller creates and triggers a job task to execute the script against a database.

  4. After all job tasks have completed, the controller updates the jobs to a completed state.

At any point during job execution, the PowerShell API can be used to view the current state of job execution.  All times returned by the PowerShell APIs are represented in UTC.  If desired, a cancelation request can be initiated to stop a job.


## Install elastic database jobs

To use the Elastic Database jobs feature, you must walk through the following steps to create the **Elastic Database** jobs components.

1. Launch a **Microsoft Azure PowerShell** window.
2. From the current directory used above to download the **Elastic Database jobs** files, navigate to the **content\elasticjobs\service** sub-directory.
3. Execute the **InstallElasticDatabaseJobs.ps1** Azure Powershell Script and supply values for its requested variables. This script will create the components described above along with configuring the Azure Cloud Service to appropriately use the dependent components.   An example invocation of the script is shown below. An example invocation of the script:

    PS C:\>Unblock-File .\InstallElasticDatabaseJobs.ps1
    PS C:\>.\InstallElasticDatabaseJobs.ps1

The installation will default to installing the Azure components within the Central US location.  Default settings trigger an A0 Azure Cloud Service with a single worker along with a Standard S0 Azure SQL Database.
Alternatively, Elastic Database Jobs can also be [installed through the Azure Portal](https://azure.microsoft.com/en-us/documentation/articles/sql-database-elastic-jobs-service-installation/) if using a SQL Azure elastic database pool.


The parameters provided on this sample invocation can be modified for your desired settings. The following provides more information on the behavior of each parameter:
<table style="width:100%">
  <tr>
    <th>Parameter</th>
    <th>Description</th>
  </tr>

<tr>
	<td>-ResourceGroupName</td>
	<td>Provides the Azure resource group name to create to contain the newly created Azure components.  This parameter defaults to **__ElasticDatabaseJob** which is a hard-coded name that the Azure portal specifically seeks to identify the presence of an Elastic Database Jobs installation.  It is not recommended to change this value.</td>
	</tr>

</tr>

	<tr>
	<td>-ResourceGroupLocation</td>
	<td>Provides the Azure location to be used for the newly created Azure components.  This parameter defaults to the Central US location.</td>
</tr>

<tr>
	<td>-ServiceWorkerCount</td>
	<td>Provides the number of service workers to install.  This parameter defaults to 1.  A higher number of workers can be used to scale out the service and to provide high availability.  It is recommended to use “2” for deployments that require high availability of the service.</td>
	</tr>

</tr>

	<tr>
	<td>-ServiceVmSize</td>
	<td>Provides the VM size for usage within the cloud service.  This parameter defaults to A0.  Parameters values of A0/A1/A2/A3 are accepted which cause the worker role to use an ExtraSmall/Small/Medium/Large size, respectively. Fo more information on worker role sizes, see [Elastic Database Jobs Components and Pricing](http://azure.microsoft.com/en-us/documentation/articles/sql-database-elastic-jobs-overview/#components-and-pricing).</td>
</tr>

</tr>
	<tr>
	<td>-SqlServerDatabaseSlo</td>
	<td>Provides the SQL Server service level objective for a Standard edition.  This parameter defaults to S0.  Parameter values of S0/S1/S2/S3 are accepted which cause the SQL Server Database to use the respective SLO. For more information on SQL Server Database SLOs, see [Elastic Database Jobs Components and Pricing](http://azure.microsoft.com/en-us/documentation/articles/sql-database-elastic-jobs-overview/#components-and-pricing).</td>
</tr>

</tr>
	<tr>
	<td>-SqlServerAdministratorUserName</td>
	<td>Provides the admin username for the newly created Azure SQL Database.  When not provided, a PowerShell credentials window will open to prompt for the credentials.</td>
</tr>

</tr>
	<tr>
	<td>-SqlServerAdministratorPassword</td>
	<td>Provides the admin password for the newly created Azure SQL Database.  When not provided, a PowerShell credentials window will open to prompt for the credentials.</td>
</tr>

</table>

We are working on providing specific guidance for how to tune your SLO and VM sizes given your workload. For production systems that target having large numbers of jobs running in parallel, it is recommended to specify parameters such as: -ServiceWorkerCount 2 -ServiceVmSize A2 -SqlServerDatabaseSlo S2.

    PS C:\>Unblock-File .\InstallElasticDatabaseJobs.ps1
    PS C:\>.\InstallElasticDatabaseJobs.ps1UpdateElasticDatabaseJobs.ps1 -ServiceWorkerCount 2 -ServiceVmSize A2 -SqlServerDatabaseSlo S2

## Updating the VM size of an existing elastic database jobs installation

**Elastic Database jobs** can be updated within an existing installation. This process allows for future upgrades of service code without having to drop and recreate the control database. This process can also be used within the same version to modify the service VM size or the server worker count.

**Elastic Database jobs** can also be [installed through the Azure Portal](https://azure.microsoft.com/en-us/documentation/articles/sql-database-elastic-jobs-service-installation/) if using a **Elastic Database pool**. If this was done prior to usage of this private preview, this update script can be used to update service binaries to the latest version. However, it is not necessary to do so as the PowerShell API will work correctly with the service binaries that are installed both through the Azure Portal and the provided installation script with the exception of the RemoveJob API.

To update the VM size of an installation, run the following script with parameters updated to the values of your choice.

    PS C:\>Unblock-File .\InstallElasticDatabaseJobs.ps1
    PS C:\>.\UpdateElasticDatabaseJobs.ps1 -ServiceVmSize A1 -ServiceWorkerCount 2

<table style="width:100%">
  <tr>
  <th>Parameter</th>
  <th>Description</th>
</tr>

  <tr>
	<td>-ResourceGroupName</td>
	<td>Provides the Azure resource group name to create to contain the newly created Azure components.  This parameter defaults to **__ElasticDatabaseJob** which is a hard-coded name that the Azure portal specifically seeks to identify the presence of an Elastic Database Jobs installation.  It is not recommended to change this value.</td>
</tr>

</tr>

  <tr>
	<td>-ServiceWorkerCount</td>
	<td>Provides the number of service workers to install.  This parameter defaults to 1.  A higher number of workers can be used to scale out the service and to provide high availability.  It is recommended to use “2” for deployments that require high availability of the service.</td>
</tr>

</tr>

	<tr>
	<td>-ServiceVmSize</td>
	<td>Provides the VM size for usage within the cloud service.  This parameter defaults to A0.  Parameters values of A0/A1/A2/A3 are accepted which cause the worker role to use an ExtraSmall/Small/Medium/Large size, respectively. Fo more information on worker role sizes, see [Elastic Database Jobs Components and Pricing](http://azure.microsoft.com/en-us/documentation/articles/sql-database-elastic-jobs-overview/#components-and-pricing).</td>
</tr>

</table>

If uninstallation is required, delete the resource group. See [How to uninstall the elastic database job components](sql-database-elastic-jobs-uninstall.md).

## Import the elastic database jobs PowerShell commandlets

PowerShell scripts are used to manage Elastic Database Jobs job definition. Elastic Database Jobs is a preview feature of Azure SQL Database used to coordinate large scale administrative tasks against databases.

The [PowerShell ISE](https://technet.microsoft.com/en-us/library/dd315244.aspx) is recommended for usage to develop and execute PowerShell scripts against the Elastic Database jobs.  To load the Elastic Database jobs PowerShell module, execute the following from an Azure PowerShell prompt such as the one within powershell_ise.exe:



## Create an elastic Database job







## Objects

This table describes the objects used in Fleet Management.

<table style="width:100%">
  <tr>
    <th>Object Type</th>
    <th>Description</th>
    <th>Related PowerShell APIs</th>

  </tr>
  <tr>
    <td>Credential</td>
    <td>Username and password. <p>The password is encrypted before sending.</p>The password is decrypted by the Fleet Management service via the credential created and uploaded from the installation script.</td>
	<td><p>Get-FleetManagementCredential</p>
	<p>New-FleetManagementCredential</td><.P</td>
  </tr>

  <tr>
    <td>Script</td>
    <td>A T-SQL script to be executed across databases. The script should be authored to be idempotent since the service will retry execution of the script upon failures.
	</td>
	<td>
	<p>Get-FleetManagementScript</p>
	<p>Get-FleetManagementScriptDefinition</p>
	<p>New-FleetManagementScript </p>
	<p>Set-FleetManagementScriptDefinition</p>
	</td>
  </tr>

  <tr>
    <td>DACPAC</td>
    <td><a href="https://msdn.microsoft.com/en-us/library/ee210546.aspx">Data-tier application </a> package to be applied across databases.

	</td>
	<td>
	<p>Get-FleetManagementDacpac</p>
	<p>New-FleetManagementDacpac</p>
	</td>
  </tr>
  <tr>
    <td>Database Target</td>
    <td>Database and server name pointing to an Azure SQL Database.

	</td>
	<td>
	<p>Get-FleetManagementShardMapTarget</p>
	<p>New-FleetManagementShardMapTarget</p>
	</td>
  </tr>

<tr>
    <td>Custom Collection Child Target</td>
    <td>Database target that is referenced from a custom collection. </td>
	<td>
	<p>Add-FleetManagementChildTarget</p>
	<p>Remove-FleetManagementChildTarget</p>
	</td>
  </tr>

<tr>
    <td>Job</td>
    <td>
	<p>Container of tasks necessary to fulfill either execution of a script or application of a DACPAC to a target. The taskes are executed using credentials for database connections. Failures are handled in accordance to an execution policy.</p>
	<p>When a job is executed against a target representing multiple databases, the service expands the job into multiple child jobs. Each job targets a single database within the requested target.</p>
	</td>
	<td>
	<p>Get-FleetManagementJob</p>
	<p>Get-FleetManagementScriptDefinition</p>
	<p>Start-FleetManagementJob</p>
	<p>Stop-FleetManagementJob</p>
	<p>Wait-FleetManagementJob</p>
	</td>
  </tr>

<tr>
    <td>Job Task</td>
    <td>
	<p>Single unit of work to fulfill a job.</p>
	<p>If a job task is not executed successfully, an exception message will be logged and a new matching job task will be created and executed in accordance to the specified execution policy.</p>
	</td>
	<td>
	<p>Get-FleetManagmentJobTask</p>
  </tr>

<tr>
    <td>Job Execution Policy</td>
    <td>
	<p>Controls job execution timeouts, retry limits and intervals between retries.</p>
	<p>The default job execution policy causes infinite retries of job task failures with exponential backoff of intervals between each retry.</p>
	</td>
	<td>
	<p>Get-FleetManagementExecutionPolicy</p>
	<p>New-FleetManagementExecutionPolicy</p>
	</td>
  </tr>

<tr>
    <td>Schedule</td>
    <td>
	<p>Time based specification for execution to take place either on a reoccurring interval or at a single time.</p>
	</td>
	<td>
	<p>Get-FleetManagementSchedule</p>
	<p>New-FleetManagementSchedule</p>
	</td>
  </tr>

<tr>
    <td>Job Template</td>
    <td>
	<p>Definition of parameters for a job that can be used to fulfill a schedule.</p>
	</td>
	<td>
	<p>Get-FleetManagementJobTemplate</p>
	<p>New-FleetManagementJobTemplate/p>
	</td>
  </tr>
<tr>
    <td>Scheduled Job Template Registration</td>
    <td>
	<p>Mapping of job templates to schedules. In accordance to the schedule definition, jobs will be created for each associated job template.</p>
	</td>
	<td>
	<p>Register-FleetManagementScheduledJobTemplate</p>
	<p>FleetManagementScheduledJobTemplate Unregister-FleetManagementScheduledJobTemplate /p>
	</td>
  </tr>
</table>

## Fleet Management Group Types
Fleet Management enables execution of T-SQL scripts or application of DACPACs across defined groups of databases. When a job is submitted to be executed across a group of databases, Fleet Management “expands” the job into child jobs where each which job performs the requested execution against a single database in the group.

### Supported Group Types
* [Elastic Scale Shard Map](http://azure.microsoft.com/documentation/articles/sql-database-elastic-scale-shard-map-management/): An [Azure SQL Database Elastic Scale](http://azure.microsoft.com/documentation/articles/sql-database-elastic-scale-introduction/) shard map.  When a job is submitted to target an Elastic Scale Shard Map, Fleet Management will query the shard map to determine its current set of shards and then expand the job to child jobs matching each shard within the shard map.

* Custom Collection: A custom defined set of databases. When a job is submitted to target a custom collection, Fleet Management will expand the job to child jobs matching each database currently defined within the custom collection. To create a new custom collection, see below, "Defining an Elastic Scale Shard Map Group Target."




## Connection Object

To load the Fleet Management PowerShell module, execute the following from a PowerShell prompt:

	Import-Module {Local Path}\Microsoft.FleetManagement.PowerShell.dll

The PowerShell scripts provided here assume that a Fleet Management database connection object exists.The following script fragment can be executed once per PowerShell session to setup the database connection object for usage.

	  # TODO: Set the following variables to reflect the Fleet Management control database configuration
	$fmsDatabaseName = "fms150206"
	$fmsDatabaseServerName = "myserver.database.windows.net"
	$fmsDatabaseUsername = "MySqlUsername"
	$fmsDatabasePassword = "MySqlPassword"
	# Open a connection to the Fleet Management Database
	$fmsDatabaseSecurePassword = ConvertTo-SecureString $fmsDatabasePassword -AsPlainText -Force
	$fmsDatabaseCredential = New-Object System.Management.Automation.PSCredential ($fmsDatabaseUsername, $fmsDatabaseSecurePassword)
	$fmsDatabaseConnection = New-FleetManagementConnection -Credential $fmsDatabaseCredential -DatabaseName $fmsDatabaseName -ServerName $fmsDatabaseServerName
	Select-FleetManagementConnection -FleetManagementConnection $fmsDatabaseConnection  

## Credentials
Database credentials can be inserted into Fleet Management with its password
encrypted within the Fleet Management database.

Encryption works within Fleet Management through a certificate created as part of the installation script.  The installation script creates and then uploads the certificate into the Azure cloud service for decryption of the stored encrypted passwords.  The installation script also stores the public key within

the Fleet Management database which enables the PowerShell API to encrypt the provided password without having access to the private key.

The following PowerShell script can be used to insert a provided username and password as a credential:

	# TODO: Set the following variables to reflect the desired credentials to be inserted
	$credentialName = "{Credential Name}"
	$username = "myusername"
	$password = "MyNewPassw0rd"
	# Create a credential for execution within the Fleet Management across databases
	$securePassword = ConvertTo-SecureString $password -AsPlainText -Force
	$databaseCredential = New-Object System.Management.Automation.PSCredential ($username, $securePassword)
	$credential = New-FleetManagementCredential -Credential $databaseCredential -Name $credentialName
	Write-Output $credential

## Defining an Elastic Scale Shard Map Group Target
[Azure SQL Database Elastic Scale](http://azure.microsoft.com/en-us/documentation/articles/sql-database-elastic-scale-get-started/) shard maps define a group of shards within a database application. Elastic Scale shard maps can be registered within Fleet Management to enable execution across each database within the shard map.

The following PowerShell script can be used to create an Elastic Scale shard map target in Fleet Management.  This script creates a database target pointing to the database holding the Elastic Scale shard map and then registers the shard map as a target that can be later used for execution.

	# TODO: Set the following variables to reflect the Elastic Scale shard map configuration with the provided credentials used to connect to the shard map database
	$shardMapCredentialName = "{Credential Name}"
	$shardMapDatabaseName = "{ShardMapDatabaseName}"
	$shardMapDatabaseServerName = "{ShardMapServerName}.database.windows.net"
	$shardMapName = "MyShardMap"

	# Create a database target pointing to the Elastic Scale shard map manager
	$shardMapCredential = Get-FleetManagementCredential -Name $shardMapCredentialName
	$shardMapDatabaseTarget = New-FleetManagementDatabaseTarget -DatabaseName $shardMapDatabaseName -ServerName $shardMapDatabaseServerName
	$shardMapTarget = New-FleetManagementShardMapTarget -ShardMapManagerCredential $shardMapCredential -ShardMapManagerDatabase $shardMapDatabaseTarget -ShardMapName $shardMapName
	Write-Output $shardMapTarget  

## Creating a T-SQL Script for Execution across Databases

When creating T-SQL scripts for execution, it is recommended you build them to be idempotent and resilient against failures. The Fleet Management service will retry execution of a script whenever execution encounters a failure, regardless of the classification of the failure.

The following PowerShell script can be used to create a T-SQL script for execution across databases.

	# TODO: Set the following variables to reflect the desired script to be added
	$scriptName = "Create a FmsTestTable"
	$scriptCommandText = "
	IF NOT EXISTS (SELECT name FROM sys.tables WHERE name = 'FmsTestTable')
	BEGIN
	 CREATE TABLE FmsTestTable(
	  FmsTestTableId INT PRIMARY KEY IDENTITY,
	  InsertionTime DATETIME2
	 );
	END
	GO

	INSERT INTO FmsTestTable(InsertionTime) VALUES (sysutcdatetime());
	GO
	"

	# Create a new Fleet Management script  
	$script = New-FleetManagementScript -CommandText $scriptCommandText -Name $scriptName
	Write-Output $script


If the T-SQL script is defined within a file, the following script could be used to import the script:

	# TODO: Set the following variables to reflect the desired script to be added
	$scriptName = "My Script Imported from a File"
	$scriptPath = "{Path to SQL File}"
	# Create a new Fleet Management script from a file
	$scriptCommandText = Get-Content -Path $scriptPath
	$script = New-FleetManagementScript -Name $scriptName -CommandText $scriptCommandText
	Write-Output $script

## Update a T-SQL Script for Execution across Databases  

The following PowerShell script can be used to update the T-SQL command text for an existing script.

	# TODO: Set the following variables to reflect the desired script definition to be set
	$scriptName = "Create a FmsTestTable"
	$scriptUpdateComment = "Adding AdditionalInformation column to FmsTestTable"
	$scriptCommandText = "
	IF NOT EXISTS (SELECT name FROM sys.tables WHERE name = 'FmsTestTable')
	BEGIN
	 CREATE TABLE FmsTestTable(
	  FmsTestTableId INT PRIMARY KEY IDENTITY,
	  InsertionTime DATETIME2
	 );
	END
	GO

	IF NOT EXISTS (SELECT columns.name FROM sys.columns INNER JOIN sys.tables on columns.object_id = tables.object_id WHERE tables.name = 'FmsTestTable' AND columns.name = 'AdditionalInformation')
	BEGIN

    ALTER TABLE FmsTestTable

    ADD AdditionalInformation NVARCHAR(400);
	END
	GO

	INSERT INTO FmsTestTable(InsertionTime, AdditionalInformation) VALUES (sysutcdatetime(), 'test');
	GO
	"
	# Update the definition to an existing script
	$script = Get-FleetManagementScript -Name $scriptName
	Set-FleetManagementScriptDefinition -CommandText $scriptCommandText -Script $script -Comment $scriptUpdateComment  

## Starting a Job to Execute a Script across an Elastic Scale Shard Map
The following PowerShell script can be used to start a job for execution of a script across each shard in an Elastic Scale shard map.

	# TODO: Set the following variables to reflect the desired script and target
	$scriptName = "{Script Name}"
	$shardMapServerName = "{Shard Map Server Name}"
	$shardMapDatabaseName = "{Shard Map Database Name}"
	$shardMapName = "{Shard Map Name}"
	$credentialName = "{Credential Name}"

	# Start a Fleet Management job
	$credential = Get-FleetManagementCredential -Name $credentialName
	$script = Get-FleetManagementScript -Name $scriptName
	$shardMapDatabaseTarget = Get-FleetManagementDatabaseTarget -ServerName $shardMapServerName -DatabaseName $shardMapDatabaseName
	$shardMapTarget = Get-FleetManagementShardMapTarget -ShardMapManagerDatabase $shardMapDatabaseTarget -ShardMapName $shardMapName
	$job = Start-FleetManagementJob -Credential $credential -Content $script -Target $shardMapTarget  
	Write-Output $job

## Viewing Job Execution State

	The following PowerShell script can be used to view the state of job execution.
	# TODO: Set the following variables to reflect the desired job
	$jobId = "{Job Id}"

	# Get the Fleet Management Job information
	$job = Get-FleetManagementJob -JobId $jobId
	Write-Output $job  

## Viewing Execution State of Child Jobs

The following PowerShell script can be used to view the state of child jobs.

	# TODO: Set the following variables to reflect the desired parent job
	$parentJobId = "{Parent Job Id}"

	# Get the Fleet Management Job information
	$jobs = Get-FleetManagementJob -ParentJobId $parentJobId
	Write-Output $jobs  

## Viewing List of Job Tasks within a Job

The following PowerShell script can be used to view the list of job tasks within a job.

	# TODO: Set the following variables to reflect the desired job
	$jobId = "{Job Id}"

	# Get the list of Fleet Management job tasks
	$job = Get-FleetManagementJob -JobId $jobId
	$jobTasks = Get-FleetManagementJobTask -Job $job  
	Write-Output $jobTasks

## Viewing Details of a Job Task

The following PowerShell script can be used to view the details of a job task, which is particularly useful when debugging execution failures.

	# TODO: Set the following variables to reflect the desired job task ID
	$jobTaskId = "{Job Task Id}"
	# Get the details of a Fleet Management job task
	$jobTask = Get-FleetManagementJobTask -JobTaskId $jobTaskId
	Write-Output $jobTask  

## Waiting for a Job to Complete

The following PowerShell script can be used to wait for a job task to complete:
	# TODO: Set the following variables to reflect the desired job
	$jobId = "{Job Id}"
	# Get the list of Fleet Management job tasks
	$job = Get-FleetManagementJob -JobId $jobId
	Wait-FleetManagementJob -Job $job  

## Creating a Custom Execution Policy

Fleet Management supports creating custom execution policies that can be applied when starting jobs.
Execution policies currently allow for defining:

* Name: Identifier for the execution policy.

* Job Timeout: Total time before a job will be canceled by Fleet Management.

* Initial Retry Interval: Interval to wait before first retry.

* Maximum Retry Interval: Cap of retry intervals to use.

* Retry Interval Backoff Coefficient: Coefficient used to calculate the next interval between retries.  The following formula is used: (Initial Retry Interval) * Math.pow((Interval Backoff Coefficient), (Number of Retries) - 2).  

* Maximum Attempts: The maximum number of retry attempts to perform within a job.

Fleet Management default execution policy uses the following values:

* Name: Default execution policy

* Job Timeout: 1 week

* Initial Retry Interval:  100 milliseconds

* Maximum Retry Interval: 30 minutes

* Retry Interval Coefficient: 2

* Maximum Attempts: 2,147,483,647


		TODO: Set the following variables to reflect the desired execution policy
		$name = "My Execution Policy"
		$initialRetryInterval = New-TimeSpan -Seconds 10
		$jobTimeout = New-TimeSpan -Minutes 30
		$maximumAttempts = 999999
		$maximumRetryInterval = New-TimeSpan -Minutes 1
		$retryIntervalBackoffCoefficient = 1.5
		# Create an execution policy
		$executionPolicy = New-FleetManagementExecutionPolicy -Name $name -InitialRetryInterval $initialRetryInterval -JobTimeout $jobTimeout -MaximumAttempts $maximumAttempts -MaximumRetryInterval $maximumRetryInterval -RetryIntervalBackoffCoefficient $retryIntervalBackoffCoefficient
		Write-Output $executionPolicy
## Canceling Jobs

The Fleet Management supports cancelation requests of jobs.  If Fleet Management detects a cancelation request for a job currently being executed, it will attempt to stop the job.

There are two different ways that Fleet Management can perform a cancelation:

1. Canceling Currently Executing Tasks: If a cancelation is detected while a task is currently running, a cancelation will be attempted within the currently executing aspect of the task.  For example: If there is a long running query currently being performed when a cancelation is attempted, there will be an attempt to cancel the query.
2.  Canceling Task Retries: If a cancelation is detected by the control thread before a task is launched for execution, the control thread will avoid launching the task and declare the request as canceled.

If a job cancellation is requested for a parent job, the cancellation request will be honored for the parent job and for all of its child jobs.


To submit a cancellation request, the following PowerShell script can be used:

	# TODO: Set the following variables to reflect the job to be canceled
	$jobId = "{Job Id}"

	# Open a connection to the Fleet Management Database
	$job = Get-FleetManagementJob -JobId $jobId
	Stop-FleetManagementJob -Job $job

## Creating a Custom Database Target
Custom database targets can be defined in Fleet Management which can be used either for execution directly or for inclusion within a custom database group.  The following PowerShell script can be used to insert a database target.

	# TODO: Set the following variables to reflect the desired database information
	$databaseName = "{Database Name}"
	$databaseServerName = "{Server Name}.database.windows.net"
	# Create a custom database target
	New-FleetManagementDatabaseTarget -DatabaseName $databaseName -ServerName $databaseServerName  

## Creating a Custom Database Collection Target
A custom database collection target can be defined to enable execution across multiple defined database targets.  After a database group is created, databases can be associated to the custom collection target.  The following PowerShell script can be used to create a custom database group.

	# TODO: Set the following variables to refect the desired custom collection target configuration
	$customCollectionTargetName = "MyCustomDatabaseCollection"

	# Create a new custom collection target
	New-FleetManagementCustomCollectionTarget -Name $customCollectionTargetName  

## Adding Databases to a Custom Database Collection Target

Database targets can be associated to custom database collection targets.  Whenever a job is created that targets a custom database collection target, it will be expanded to target the databases associated to the group at the time of execution.  The following PowerShell script can be used to associate databases to a custom database group.

	# TODO: Set the following variables to add the desired database to a desired custom collection
	$serverName = "{Database Server Name}"
	$databaseName = "{Database Name}"
	$customCollectionTargetName = "MyCustomDatabaseCollection"

	# Add a database target association to a custom collection
	$customCollectionTarget = Get-FleetManagementCustomCollectionTarget -Name $customCollectionTargetName
	$databaseTarget = Get-FleetManagementDatabaseTarget -ServerName $serverName -DatabaseName $databaseName
	Add-FleetManagementChildTarget -CustomCollectionTarget $customCollectionTarget -Target $databaseTarget  

## Viewing the Databases within a Custom Database Collection Target

The following PowerShell script can be used to view the child databases within a custom database collection target:

	# TODO: Set the custom collection name to use  
	$customCollectionName = "MyCustomCollection"

	# Output the child targets belonging to the custom collection
	$customCollection = Get-FleetManagementCustomCollectionTarget -Name $customCollectionName
	Write-Output $customCollection.ChildTargets  
## Starting a Job to Execute a Script across a Custom Database Collection Target

The following PowerShell script starts a job against a defined custom database collection targets.  The Fleet Management will expand the job into multiple child jobs each corresponding to a database associated with the custom database collection target.

	# TODO: Set the following variables to reflect the desired script and custom collection target
	$scriptName = "{Script Name}"
	$customCollectionTargetName = "{Custom Collection Target Name}"
	$credentialName = "{Credential Name}"

	# Start a Fleet Management job
	$credential = Get-FleetManagementCredential -Name $credentialName
	$script = Get-FleetManagementScript -Name $scriptName
	$customCollectionTarget = Get-FleetManagementCustomCollectionTarget -Name $customCollectionTargetName
	$job = Start-FleetManagementJob -Credential $credential -FleetManagementConnection $fmsDatabaseConnection -Content $script -Target $customCollectionTarget  
	Write-Output $job  

## Data Collection across Databases

The Fleet Management supports executing a query across a set of databases and having the results sent to a specified database’s table.  The table can be queried after the fact to see the query’s results from each database.  This provides an asynchronous mechanism to execute a

query across many databases.  Failure cases such as one of the databases being temporarily unavailable are handled through Fleet Management via retries.


A provided destination table will be automatically created if it does not yet exist matching the schema of the returned result set.  If a script execution returns multiple result sets, Fleet Management will only send the first one to the provided destination table.

The following PowerShell script can be used to execute a script collecting its results into a specified table.  This script assumes that a T-SQL has been created which outputs a single result set and a custom database collection target has been created.
	# TODO: Set the following to reflect the desired script, credentials, and execution target
	$scriptName = "{Script Name}"
	$executionCredentialName = "{Execution Credential Name}"
	$customCollectionTargetName = "{Custom Collection Name}"

	# TODO: Set the following to reflect the desired destination table and credential to use for insertion into the destination table
	$destinationCredentialName = "{Destination Credential Name}"
	$destinationServerName = "{Destination Server Name}"
	$destinationDatabaseName = "{Destination Database Name}"
	$destinationSchemaName = "{Destination Schema Name}"
	$destinationTableName = "{Destination Table Name}"

	# Start a Fleet Management job
	$script = Get-FleetManagementScript -Name $scriptName
	$executionCredential = Get-FleetManagementCredential -Name $executionCredentialName
	$executionTarget = Get-FleetManagementCustomCollectionTarget -Name $customCollectionTargetName

	$destinationTarget = Get-FleetManagementDatabaseTarget -ServerName $destinationServerName -DatabaseName $destinationDatabaseName
	$destinationCredential = Get-FleetManagementCredential -Name $destinationCredentialName

	$job = Start-FleetManagementJob -Content $script -Credential $executionCredential -ResultSetDestinationCredential $destinationCredential -ResultSetDestinationDatabaseTarget $destinationDatabaseTarget -ResultSetDestinationSchemaName $destinationSchemaName -ResultSetDestinationTableName $destinationTableName -Target $executionTarget
	Write-Output $job  

##Creating a Time Schedule
The following PowerShell script can be used to create a reoccurring schedule.  This script uses a minute interval, but New-FleetManagementSchedule also supports -DayInterval, -HourInterval, -MonthInterval, and -WeekInterval parameters.  Schedules that execute only once can be created by passing -OneTime.

	# TODO: Set the following variables to correspond to the desired schedule
	$scheduleName = "Every one minute"
	$minuteInterval = 1
	$startTime = (Get-Date).ToUniversalTime()

	# Create a new schedule
	New-FleetManagementSchedule -MinuteInterval $minuteInterval -Name $scheduleName -StartTime $startTime  

## Creating a Job Template for Reoccurring Execution
A job template needs to be defined to be used for reoccurring execution against a schedule.  The following script can be used to create a job template:

	# TODO: Set the following to reflect the new job template name and its desired script, credentials, and execution target
	$jobTemplateName = "{Job Template Name}"
	$scriptName = "{Script Name}"
	$executionCredentialName = "{Execution Credential Name}"
	$customCollectionTargetName = "{Custom Collection Name}"

	# TODO: Set the following to reflect the desired destination table and credential to use for insertion into the destination table
	$destinationCredentialName = "{Destination Credential Name}"
	$destinationServerName = "{Destination Server Name}"
	$destinationDatabaseName = "{Destination Database Name}"
	$destinationSchemaName = "{Destination Schema Name}"
	$destinationTableName = "{Destination Table Name}"

	# Create a Fleet Management job template
	$script = Get-FleetManagementScript -Name $scriptName
	$executionCredential = Get-FleetManagementCredential -Name $executionCredentialName
	$executionTarget = Get-FleetManagementCustomCollectionTarget -Name $customCollectionTargetName
	$destinationTarget = Get-FleetManagementDatabaseTarget -ServerName $destinationServerName -DatabaseName $destinationDatabaseName
	$destinationCredential = Get-FleetManagementCredential –Name $destinationCredentialName

	New-FleetManagementJobTemplate -Content $script -Credential $executionCredential -Name $jobTemplateName -ResultSetDestinationCredential $destinationCredential -ResultSetDestinationDatabaseTarget $destinationDatabaseTarget -ResultSetDestinationSchemaName $destinationSchemaName -ResultSetDestinationTableName $destinationTableName -Target $executionTarget  

## Registering a Job Template to a Time Schedule

A defined job template can be registered to a time schedule to trigger reoccurring execution in accordance to the job template and schedule.  The following PowerShell script can be used to register a job template to a time schedule:

	# TODO: Set the following variables to correspond to the desired job template and schedule
	$jobTemplateName = "{Job Template Name}"
	$scheduleName = "{Schedule Name}"

	# Register a job template to a schedule
	$jobTemplate = Get-FleetManagementJobTemplate -Name $jobTemplateName
	$schedule = Get-FleetManagementSchedule -Name $scheduleName

	Register-FleetManagementScheduledJobTemplate -Schedule $schedule -JobTemplate $jobTemplate  

## Unregistering a Job Template to a Time Schedule

To discontinue reoccurring job execution, a job template can be unregistered from a time schedule. The following PowerShell script can be used to unregister a job template from a time schedule:

	# TODO: Set the following variables to correspond to the desired job template and schedule
	$jobTemplateName = "{Job Template Name}"
	$scheduleName = "{Schedule Name}"

	# Register a job template to a schedule
	$jobTemplate = Get-FleetManagementJobTemplate -Name $jobTemplateName
	$schedule = Get-FleetManagementSchedule -Name $scheduleName
	Unregister-FleetManagementScheduledJobTemplate -Schedule $schedule -JobTemplate $jobTemplate  

The destination table provided can be queried occasionally to see that results are collected in accordance with the specified schedule.

## Creating a Data-tier Application Deployment (DACPAC) for Application across Databases

Fleet Management can be used to deploy a data-tier application (DACPAC) to a group of databases. To create a DACPAC, please refer to this documentation. For Fleet Management to deploy a DACPAC to a group of databases, the DACPAC must be accessible to the service.  It is recommended to upload a created DACPAC to Azure Storage and create a signed URI for the DACPAC.

The following PowerShell script can be used to insert a DACPAC into Fleet Management:

	# TODO: Set the following variables to point to and to name the DACPAC
	$dacpacUri = "{Uri}"
	$dacpacName = "{Dacpac Name}"

	# Create a new DACPAC in Fleet Management
	New-FleetManagementDacpac -DacpacUri $dacpacUri -Name $dacpacName  

## Applying a Data-tier Application Deployment (DACPAC) Across Databases
After a DACPAC has been created within Fleet Management, a job can be started to apply the DACPAC across a group of databases.  The following PowerShell script can be used to apply a DACPAC across a custom collection of databases:

	# TODO: Set the following variables to reflect the desired script and target
	$dacpacName = "{Dacpac Name}"
	$customCollectionTargetName = "{Custom Collection Name}"
	$credentialName = "{Credential Name}"

	# Start a Fleet Management job to apply a DACPAC across a custom collection
	$credential = Get-FleetManagementCredential -CredentialName $credentialName
	$dacpac = Get-FleetManagementDacpac -Name $dacpacName
	$customCollectionTarget = Get-FleetManagementCustomCollectionTarget -Name $customCollectionTargetName
	$job = Start-FleetManagementJob -Credential $credential -Content $dacpac -Target $customCollectionTarget  
	Write-Output $job

## Troubleshooting

### Configure your credentials and select your subscription

If you receive an error that your credentials have expired when trying to select the subscription into which you want to install/upgrade the **Elastic Database jobs** components, you might need to update you credentials by running the following and you will be presented with a sign in screen to enter your credentials. Use the same email and password that you use to sign in to the Azure portal.

	PS C:\>Add-AzureAccount

After successfully signing in you should see some information on screen that includes the Id you signed in with and the Azure subscriptions you have access to.

[AZURE.INCLUDE [elastic-scale-include](../../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-jobs-powershell/elastic-jobs-powershell.png
<!--anchors-->
