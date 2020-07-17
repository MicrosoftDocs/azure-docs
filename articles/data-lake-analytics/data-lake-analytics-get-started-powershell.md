---
title: Create & query Azure Data Lake Analytics - PowerShell
description: Use Azure PowerShell to create an Azure Data Lake Analytics account and submit a U-SQL job.
ms.service: data-lake-analytics
author: saveenr
ms.author: saveenr
ms.reviewer: jasonwhowell
ms.assetid: 8a4e901e-9656-4a60-90d0-d78ff2f00656
ms.topic: conceptual
ms.date: 05/04/2017
---
# Get started with Azure Data Lake Analytics using Azure PowerShell

[!INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

Learn how to use Azure PowerShell to create Azure Data Lake Analytics accounts and then submit and run U-SQL jobs. For more information about Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

## Prerequisites

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Before you begin this tutorial, you must have the following information:

* **An Azure Data Lake Analytics account**. See [Get started with Data Lake Analytics](https://docs.microsoft.com/azure/data-lake-analytics/data-lake-analytics-get-started-portal).
* **A workstation with Azure PowerShell**. See [How to install and configure Azure PowerShell](/powershell/azure/overview).

## Log in to Azure

This tutorial assumes you are already familiar with using Azure PowerShell. In particular, you need to know how to log in to Azure. See the [Get started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps) if you need help.

To log in with a subscription name:

```powershell
Connect-AzAccount -SubscriptionName "ContosoSubscription"
```

Instead of the subscription name, you can also use a subscription id to log in:

```powershell
Connect-AzAccount -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

If  successful, the output of this command looks like the following text:

```text
Environment           : AzureCloud
Account               : joe@contoso.com
TenantId              : "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
SubscriptionId        : "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
SubscriptionName      : ContosoSubscription
CurrentStorageAccount :
```

## Preparing for the tutorial

The PowerShell snippets in this tutorial use these variables to store this information:

```powershell
$rg = "<ResourceGroupName>"
$adls = "<DataLakeStoreAccountName>"
$adla = "<DataLakeAnalyticsAccountName>"
$location = "East US 2"
```

## Get information about a Data Lake Analytics account

```powershell
Get-AdlAnalyticsAccount -ResourceGroupName $rg -Name $adla  
```

## Submit a U-SQL job

Create a PowerShell variable to hold the U-SQL script.

```powershell
$script = @"
@a  = 
    SELECT * FROM 
        (VALUES
            ("Contoso", 1500.0),
            ("Woodgrove", 2700.0)
        ) AS 
              D( customer, amount );
OUTPUT @a
    TO "/data.csv"
    USING Outputters.Csv();

"@
```

Submit the script text with the `Submit-AdlJob` cmdlet and the `-Script` parameter.

```powershell
$job = Submit-AdlJob -Account $adla -Name "My Job" -Script $script
```

As an alternative, you can submit a script file using the `-ScriptPath` parameter:

```powershell
$filename = "d:\test.usql"
$script | out-File $filename
$job = Submit-AdlJob -Account $adla -Name "My Job" -ScriptPath $filename
```

Get the status of a job with `Get-AdlJob`. 

```powershell
$job = Get-AdlJob -Account $adla -JobId $job.JobId
```

Instead of calling Get-AdlJob over and over until a job finishes, use the `Wait-AdlJob` cmdlet.

```powershell
Wait-AdlJob -Account $adla -JobId $job.JobId
```

Download the output file using `Export-AdlStoreItem`.

```powershell
Export-AdlStoreItem -Account $adls -Path "/data.csv" -Destination "C:\data.csv"
```

## See also

* To see the same tutorial using other tools, click the tab selectors on the top of the page.
* To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
* For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
