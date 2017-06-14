---
title: Get started with Azure Data Lake Analytics using Azure PowerShell | Microsoft Docs
description: 'Use Azure PowerShell to create a Data Lake Analytics account, create a Data Lake Analytics job using U-SQL, and submit the job. '
services: data-lake-analytics
documentationcenter: ''
author: saveenr
manager: saveenr
editor: cgronlun

ms.assetid: 8a4e901e-9656-4a60-90d0-d78ff2f00656
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 05/04/2017
ms.author: edmaca

---
# Tutorial: get started with Azure Data Lake Analytics using Azure PowerShell
[!INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

Learn how to use Azure PowerShell to create Azure Data Lake Analytics accounts and then submit and run U-SQL jobs. For more information about Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

## Prerequisites

Before you begin this tutorial, you must have the following information:

* **An Azure Data Lake Analytics account**. See [Get started with Data Lake Analytics](https://docs.microsoft.com/en-us/azure/data-lake-analytics/data-lake-analytics-get-started-portal).
* **A workstation with Azure PowerShell**. See [How to install and configure Azure PowerShell](/powershell/azure/overview).

## Log in to Azure

This tutorial assumes you are already familiar with using Azure PowerShell. In particular, you need to know how to log in to Azure. See the [Get started with Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/get-started-azureps) if you need help.

To log in with a subscription name:

```
Login-AzureRmAccount -SubscriptionName "ContosoSubscription"
```

Instead of the subscription name, you can also use a subscription id to log in:

```
Login-AzureRmAccount -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

If  successful, the output of this command looks like the following text:

```
Environment           : AzureCloud
Account               : joe@contoso.com
TenantId              : "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
SubscriptionId        : "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
SubscriptionName      : ContosoSubscription
CurrentStorageAccount :
```

## Preparing for the tutorial

The PowerShell snippets in this tutorial use these variables to store this information:

```
$rg = "<ResourceGroupName>"
$adls = "<DataLakeStoreAccountName>"
$adla = "<DataLakeAnalyticsAccountName>"
$location = "East US 2"
```

## Get information about a Data Lake Analytics account

```
Get-AdlAnalyticsAccount -ResourceGroupName $rg -Name $adla  
```

## Submit a U-SQL job

Create a PowerShell variable to hold the U-SQL script.

```
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

Submit the script.

```
$job = Submit-AdlJob -AccountName $adla –Script $script
```

Alternatively, you could save the script as a file and submit with the following command:

```
$filename = "d:\test.usql"
$script | out-File $filename
$job = Submit-AdlJob -AccountName $adla –ScriptPath $filename
```


Get the status of a specific job. Keep using this cmdlet until you see the job is done.

```
$job = Get-AdlJob -AccountName $adla -JobId $job.JobId
```

Instead of calling Get-AdlAnalyticsJob over and over until a job finishes, you can use the Wait-AdlJob cmdlet.

```
Wait-AdlJob -Account $adla -JobId $job.JobId
```

Download the output file.

```
Export-AdlStoreItem -AccountName $adls -Path "/data.csv" -Destination "C:\data.csv"
```

## See also
* To see the same tutorial using other tools, click the tab selectors on the top of the page.
* To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
* For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
