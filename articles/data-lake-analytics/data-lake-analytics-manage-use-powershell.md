---
title: Manage Azure Data Lake Analytics using Azure PowerShell
description: This article describes how to use Azure PowerShell to manage Data Lake Analytics accounts, data sources, users, & jobs.
services: data-lake-analytics
ms.service: data-lake-analytics
author: matt1883
ms.author: mahi

ms.reviewer: jasonwhowell
ms.assetid: ad14d53c-fed4-478d-ab4b-6d2e14ff2097
ms.topic: conceptual
ms.date: 06/29/2018
---

# Manage Azure Data Lake Analytics using Azure PowerShell
[!INCLUDE [manage-selector](../../includes/data-lake-analytics-selector-manage.md)]

This article describes how to manage Azure Data Lake Analytics accounts, data sources, users, and jobs by using Azure PowerShell.

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

To use PowerShell with Data Lake Analytics, collect the following pieces of information: 

* **Subscription ID**: The ID of the Azure subscription that contains your Data Lake Analytics account.
* **Resource group**: The name of the Azure resource group that contains your Data Lake Analytics account.
* **Data Lake Analytics account name**: The name of your Data Lake Analytics account.
* **Default Data Lake Store account name**: Each Data Lake Analytics account has a default Data Lake Store account.
* **Location**: The location of your Data Lake Analytics account, such as "East US 2" or other supported locations.

The PowerShell snippets in this tutorial use these variables to store this information

```powershell
$subId = "<SubscriptionId>"
$rg = "<ResourceGroupName>"
$adla = "<DataLakeAnalyticsAccountName>"
$adls = "<DataLakeStoreAccountName>"
$location = "<Location>"
```

## Log in to Azure

### Log in using interactive user authentication

Log in using a subscription ID or by subscription name

```powershell
# Using subscription id
Connect-AzAccount -SubscriptionId $subId

# Using subscription name
Connect-AzAccount -SubscriptionName $subname 
```

## Saving authentication context

The `Connect-AzAccount` cmdlet always prompts for credentials. You can avoid being prompted by using the following cmdlets:

```powershell
# Save login session information
Save-AzAccounts -Path D:\profile.json  

# Load login session information
Select-AzAccounts -Path D:\profile.json 
```

### Log in using a Service Principal Identity (SPI)

```powershell
$tenantid = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"  
$spi_appname = "appname" 
$spi_appid = "XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" 
$spi_secret = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" 

$pscredential = New-Object System.Management.Automation.PSCredential ($spi_appid, (ConvertTo-SecureString $spi_secret -AsPlainText -Force))
Login-AzAccount -ServicePrincipal -TenantId $tenantid -Credential $pscredential -Subscription $subid
```

## Manage accounts


### List accounts

```powershell
# List Data Lake Analytics accounts within the current subscription.
Get-AdlAnalyticsAccount

# List Data Lake Analytics accounts within a specific resource group.
Get-AdlAnalyticsAccount -ResourceGroupName $rg
```

### Create an account

Every Data Lake Analytics account requires a default Data Lake Store account that it uses for storing logs. You can reuse an existing account or create an account. 

```powershell
# Create a data lake store if needed, or you can re-use an existing one
New-AdlStore -ResourceGroupName $rg -Name $adls -Location $location
New-AdlAnalyticsAccount -ResourceGroupName $rg -Name $adla -Location $location -DefaultDataLake $adls
```

### Get account information

Get details about an account.

```powershell
Get-AdlAnalyticsAccount -Name $adla
```

### Check if an account exists

```powershell
Test-AdlAnalyticsAccount -Name $adla
```

## Manage data sources
Azure Data Lake Analytics currently supports the following data sources:

* [Azure Data Lake Store](../data-lake-store/data-lake-store-overview.md)
* [Azure Storage](../storage/common/storage-introduction.md)

Every Data Lake Analytics account has a default Data Lake Store account. The default Data Lake Store account is used to store job metadata and job audit logs. 

### Find the default Data Lake Store account

```powershell
$adla_acct = Get-AdlAnalyticsAccount -Name $adla
$dataLakeStoreName = $adla_acct.DefaultDataLakeAccount
```

You can find the default Data Lake Store account by filtering the list of datasources by the `IsDefault` property:

```powershell
Get-AdlAnalyticsDataSource -Account $adla  | ? { $_.IsDefault } 
```

### Add a data source

```powershell

# Add an additional Storage (Blob) account.
$AzureStorageAccountName = "<AzureStorageAccountName>"
$AzureStorageAccountKey = "<AzureStorageAccountKey>"
Add-AdlAnalyticsDataSource -Account $adla -Blob $AzureStorageAccountName -AccessKey $AzureStorageAccountKey

# Add an additional Data Lake Store account.
$AzureDataLakeStoreName = "<AzureDataLakeStoreAccountName"
Add-AdlAnalyticsDataSource -Account $adla -DataLakeStore $AzureDataLakeStoreName 
```

### List data sources

```powershell
# List all the data sources
Get-AdlAnalyticsDataSource -Account $adla

# List attached Data Lake Store accounts
Get-AdlAnalyticsDataSource -Account $adla | where -Property Type -EQ "DataLakeStore"

# List attached Storage accounts
Get-AdlAnalyticsDataSource -Account $adla | where -Property Type -EQ "Blob"
```

## Submit U-SQL jobs

### Submit a string as a U-SQL job

```powershell
$script = @"
@a  = 
    SELECT * FROM 
        (VALUES
            ("Contoso", 1500.0),
            ("Woodgrove", 2700.0)
        ) AS D( customer, amount );
OUTPUT @a
    TO "/data.csv"
    USING Outputters.Csv();
"@

$scriptpath = "d:\test.usql"
$script | Out-File $scriptpath 

Submit-AdlJob -AccountName $adla -Script $script -Name "Demo"
```

### Submit a file as a U-SQL job

```powershell
$scriptpath = "d:\test.usql"
$script | Out-File $scriptpath 
Submit-AdlJob -AccountName $adla –ScriptPath $scriptpath -Name "Demo"
```

### List jobs

The output includes the currently running jobs and those jobs that have recently completed.

```powershell
Get-AdlJob -Account $adla
```

### List the top N jobs

By default the list of jobs is sorted on submit time. So the most recently submitted jobs appear first. By default, The ADLA account remembers jobs for 180 days, but the Get-AdlJob cmdlet by default returns only the first 500. Use -Top parameter to list a specific number of jobs.

```powershell
$jobs = Get-AdlJob -Account $adla -Top 10
```

### List jobs by job state

Using the `-State` parameter. You can combine any of these values:

* `Accepted`
* `Compiling`
* `Ended`
* `New`
* `Paused`
* `Queued`
* `Running`
* `Scheduling`
* `Start`

```powershell
# List the running jobs
Get-AdlJob -Account $adla -State Running

# List the jobs that have completed
Get-AdlJob -Account $adla -State Ended

# List the jobs that have not started yet
Get-AdlJob -Account $adla -State Accepted,Compiling,New,Paused,Scheduling,Start
```

### List jobs by job result

Use the `-Result` parameter to detect whether ended jobs completed successfully. It has these values:

* Cancelled
* Failed
* None
* Succeeded

``` powershell
# List Successful jobs.
Get-AdlJob -Account $adla -State Ended -Result Succeeded

# List Failed jobs.
Get-AdlJob -Account $adla -State Ended -Result Failed
```

### List jobs by job submitter

The `-Submitter` parameter helps you identify who submitted a job.

```powershell
Get-AdlJob -Account $adla -Submitter "joe@contoso.com"
```

### List jobs by submission time

The `-SubmittedAfter` is useful in filtering to a time range.


```powershell
# List  jobs submitted in the last day.
$d = [DateTime]::Now.AddDays(-1)
Get-AdlJob -Account $adla -SubmittedAfter $d

# List  jobs submitted in the last seven day.
$d = [DateTime]::Now.AddDays(-7)
Get-AdlJob -Account $adla -SubmittedAfter $d
```

### Get job status

Get the status of a specific job.

```powershell
Get-AdlJob -AccountName $adla -JobId $job.JobId
```


### Cancel a job

```powershell
Stop-AdlJob -Account $adla -JobID $jobID
```

### Wait for a job to finish

Instead of repeating `Get-AdlAnalyticsJob` until a job finishes, you can use the `Wait-AdlJob` cmdlet to wait for the job to end.

```powershell
Wait-AdlJob -Account $adla -JobId $job.JobId
```

## Analyzing job history

Using Azure PowerShell to analyze the history of jobs that have run in Data Lake analytics is a powerful technique. You can use it to gain insights into usage and cost. You can learn more by looking at the [Job History Analysis sample repo](https://github.com/Azure-Samples/data-lake-analytics-powershell-job-history-analysis)  

## List job pipelines and recurrences

Use the `Get-AdlJobPipeline` cmdlet to see the pipeline information previously submitted jobs.

```powershell
$pipelines = Get-AdlJobPipeline -Account $adla
$pipeline = Get-AdlJobPipeline -Account $adla -PipelineId "<pipeline ID>"
```

Use the `Get-AdlJobRecurrence` cmdlet to see the recurrence information for previously submitted jobs.

```powershell
$recurrences = Get-AdlJobRecurrence -Account $adla

$recurrence = Get-AdlJobRecurrence -Account $adla -RecurrenceId "<recurrence ID>"
```


## Manage compute policies

### List existing compute policies

The `Get-AdlAnalyticsComputePolicy` cmdlet retrieves info about compute policies for a Data Lake Analytics account.

```powershell
$policies = Get-AdlAnalyticsComputePolicy -Account $adla
```

### Create a compute policy

The `New-AdlAnalyticsComputePolicy` cmdlet creates a new compute policy for a Data Lake Analytics account. This example sets the maximum AUs available to the specified user to 50, and the minimum job priority to 250.

```powershell
$userObjectId = (Get-AzAdUser -SearchString "garymcdaniel@contoso.com").Id

New-AdlAnalyticsComputePolicy -Account $adla -Name "GaryMcDaniel" -ObjectId $objectId -ObjectType User -MaxDegreeOfParallelismPerJob 50 -MinPriorityPerJob 250
```
## Manage files

### Check for the existence of a file.

```powershell
Test-AdlStoreItem -Account $adls -Path "/data.csv"
```

### Uploading and downloading

Upload a file.

```powershell
Import-AdlStoreItem -AccountName $adls -Path "c:\data.tsv" -Destination "/data_copy.csv" 
```

Upload an entire folder recursively.

```powershell
Import-AdlStoreItem -AccountName $adls -Path "c:\myData\" -Destination "/myData/" -Recurse
```

Download a file.

```powershell
Export-AdlStoreItem -AccountName $adls -Path "/data.csv" -Destination "c:\data.csv"
```

Download an entire folder recursively.

```powershell
Export-AdlStoreItem -AccountName $adls -Path "/" -Destination "c:\myData\" -Recurse
```

> [!NOTE]
> If the upload or download process is interrupted, you can attempt to resume the process by running the cmdlet again with the ``-Resume`` flag.

## Manage the U-SQL catalog

The U-SQL catalog is used to structure data and code so they can be shared by U-SQL scripts. The catalog enables the highest performance possible with data in Azure Data Lake. For more information, see [Use U-SQL catalog](data-lake-analytics-use-u-sql-catalog.md).

### List items in the U-SQL catalog

```powershell
# List U-SQL databases
Get-AdlCatalogItem -Account $adla -ItemType Database 

# List tables within a database
Get-AdlCatalogItem -Account $adla -ItemType Table -Path "database"

# List tables within a schema.
Get-AdlCatalogItem -Account $adla -ItemType Table -Path "database.schema"
```

### List all the assemblies the U-SQL catalog

```powershell
$dbs = Get-AdlCatalogItem -Account $adla -ItemType Database

foreach ($db in $dbs)
{
    $asms = Get-AdlCatalogItem -Account $adla -ItemType Assembly -Path $db.Name

    foreach ($asm in $asms)
    {
        $asmname = "[" + $db.Name + "].[" + $asm.Name + "]"
        Write-Host $asmname
    }
}
```

### Get details about a catalog item

```powershell
# Get details of a table
Get-AdlCatalogItem  -Account $adla -ItemType Table -Path "master.dbo.mytable"

# Test existence of a U-SQL database.
Test-AdlCatalogItem  -Account $adla -ItemType Database -Path "master"
```

### Store credentials in the catalog

Within a U-SQL database, create a credential object for a database hosted in Azure. Currently, U-SQL credentials are the only type of catalog item that you can create through PowerShell.

```powershell
$dbName = "master"
$credentialName = "ContosoDbCreds"
$dbUri = "https://contoso.database.windows.net:8080"

New-AdlCatalogCredential -AccountName $adla `
          -DatabaseName $db `
          -CredentialName $credentialName `
          -Credential (Get-Credential) `
          -Uri $dbUri
```

## Manage firewall rules

### List firewall rules

```powershell
Get-AdlAnalyticsFirewallRule -Account $adla
```

### Add a firewall rule

```powershell
$ruleName = "Allow access from on-prem server"
$startIpAddress = "<start IP address>"
$endIpAddress = "<end IP address>"

Add-AdlAnalyticsFirewallRule -Account $adla -Name $ruleName -StartIpAddress $startIpAddress -EndIpAddress $endIpAddress
```

### Modify a firewall rule

```powershell
Set-AdlAnalyticsFirewallRule -Account $adla -Name $ruleName -StartIpAddress $startIpAddress -EndIpAddress $endIpAddress
```

### Remove a firewall rule

```powershell
Remove-AdlAnalyticsFirewallRule -Account $adla -Name $ruleName
```

### Allow Azure IP addresses

```powershell
Set-AdlAnalyticsAccount -Name $adla -AllowAzureIpState Enabled
```

```powershell
Set-AdlAnalyticsAccount -Name $adla -FirewallState Enabled
Set-AdlAnalyticsAccount -Name $adla -FirewallState Disabled
```


## Working with Azure

### Get error details

```powershell
Resolve-AzError -Last
```

### Verify if you are running as an Administrator on your Windows machine

```powershell
function Test-Administrator  
{  
    $user = [Security.Principal.WindowsIdentity]::GetCurrent();
    $p = New-Object Security.Principal.WindowsPrincipal $user
    $p.IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)  
}
```

### Find a TenantID

From a subscription name:

```powershell
function Get-TenantIdFromSubscriptionName( [string] $subname )
{
    $sub = (Get-AzSubscription -SubscriptionName $subname)
    $sub.TenantId
}

Get-TenantIdFromSubscriptionName "ADLTrainingMS"
```

From a subscription ID:

```powershell
function Get-TenantIdFromSubscriptionId( [string] $subid )
{
    $sub = (Get-AzSubscription -SubscriptionId $subid)
    $sub.TenantId
}

$subid = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
Get-TenantIdFromSubscriptionId $subid
```

From a domain address such as "contoso.com"

```powershell
function Get-TenantIdFromDomain( $domain )
{
    $url = "https://login.windows.net/" + $domain + "/.well-known/openid-configuration"
    return (Invoke-WebRequest $url|ConvertFrom-Json).token_endpoint.Split('/')[3]
}

$domain = "contoso.com"
Get-TenantIdFromDomain $domain
```

### List all your subscriptions and tenant IDs

```powershell
$subs = Get-AzSubscription
foreach ($sub in $subs)
{
    Write-Host $sub.Name "("  $sub.Id ")"
    Write-Host "`tTenant Id" $sub.TenantId
}
```

## Create a Data Lake Analytics account using a template

You can also use an Azure Resource Group template using the following sample: [Create a Data Lake Analytics account using a template](https://github.com/Azure-Samples/data-lake-analytics-create-account-with-arm-template)

## Next steps
* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* Get started with Data Lake Analytics using the [Azure portal](data-lake-analytics-get-started-portal.md) | [Azure PowerShell](data-lake-analytics-get-started-powershell.md) | [Azure CLI](data-lake-analytics-get-started-cli.md)
* Manage Azure Data Lake Analytics using [Azure portal](data-lake-analytics-manage-use-portal.md) | [Azure PowerShell](data-lake-analytics-manage-use-powershell.md) | [CLI](data-lake-analytics-manage-use-cli.md) 
