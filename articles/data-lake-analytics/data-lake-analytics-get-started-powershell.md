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
ms.date: 04/06/2017
ms.author: edmaca

---
# Tutorial: get started with Azure Data Lake Analytics using Azure PowerShell
[!INCLUDE [get-started-selector](../../includes/data-lake-analytics-selector-get-started.md)]

Learn how to use Azure PowerShell to create Azure Data Lake Analytics accounts and then submit and run U-SQL jobs. For more information about Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

In this tutorial, you will develop a job that reads a tab separated values (TSV) file and converts it into a comma-separated values (CSV) file. To go through the same tutorial using other supported tools, click the tabs on the top of this section.

## Prerequisites
Before you begin this tutorial, you must have the following information:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **A workstation with Azure PowerShell**. See [How to install and configure Azure PowerShell](/powershell/azure/overview).
* **An Azure Resource Group**. 

## Preparing for the Tutorial
To create a Data Lake Analytics account, you first need to define:

* **Azure Resource Group**: A Data Lake Analytics account must be created within an Azure Resource group.
* **Data Lake Analytics account name**: The Data Lake account name must only contain lowercase letters and numbers.
* **Location**: one of the Azure data centers that supports Data Lake Analytics.
* **Default Data Lake Store account**: each Data Lake Analytics account has a default Data Lake Store account. These accounts must be in the same location.

The PowerShell snippets in this tutorial uses these variables to store this information

```
$rg = "<ResourceGroupName>"
$adls = "<DataLakeAccountName>"
$adla = "<DataLakeAnalyticsAccountName>"
$location = "East US 2"
```

## Create Data Lake Analytics account
If you don't already have a Data Lake account, you must create one.

```
New-AzureRmResourceGroup `
    -Name  $rg `
    -Location $location

New-AzureRmDataLakeStoreAccount `
    -ResourceGroupName $rg `
    -Name $adls `
    -Location $location

New-AzureRmDataLakeAnalyticsAccount `
    -Name $adla `
    -ResourceGroupName $rg `
    -Location $location `
    -DefaultDataLake $adls
```

## Get Information about a Data Lake Analytics Account

```
Get-AzureRmDataLakeAnalyticsAccount `
    -ResourceGroupName $rg `
    -Name $adla  
```

## Upload data to Data Lake Store

```
Import-AzureRmDataLakeStoreItem `
        -AccountName $adla `
        -Path "D:\SearchLog.tsv" `
        -Destination "/Samples/Data/SearchLog.tsv" 
```

## Submit Data Lake Analytics jobs
Create a text file with following U-SQL script:

```
@searchlog =
    EXTRACT UserId          int,
            Start           DateTime,
            Region          string,
            Query           string,
            Duration        int?,
            Urls            string,
            ClickedUrls     string
    FROM "/Samples/Data/SearchLog.tsv"
    USING Extractors.Tsv();

OUTPUT @searchlog   
    TO "/Output/SearchLog-from-Data-Lake.csv"
USING Outputters.Csv();
```

Submit this script to Data Lake Analytics account:

```
$job = Submit-AzureRmDataLakeAnalyticsJob `
        -Name "convertTSVtoCSV" `
        -AccountName $adla `
        –ScriptPath "c:\script.usql"

```

Get the states of a job.

```
Get-AzureRmDataLakeAnalyticsJob -AccountName $adla -JobId $job.JobId
```

Instead of calling Get-AzureRmDataLakeAnalyticsJob over and over until a job finishes, you can use the Wait-AdlJob cmdlet.

```
Wait-AdlJob -Account $dataLakeAnalyticsName -JobId $job.JobId
```

After the job is completed, download the output file.

```
$destFile = "c:\SearchLog-from-Data-Lake.csv"

Export-AzureRmDataLakeStoreItem `
        -AccountName $adls `
        -Path "/Output/SearchLog-from-Data-Lake.csv" `
        -Destination $destFile
```

## Useful Snippets

### Getting the Default Data Lake Store account for a Data Lake Analytics Account

```
$adla_acnt = Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $rg  -Name $adla
$adla_accnt.Properties.DefaultDataLakeStoreAccount
```

### Waiting for a job to complete
```
Wait-AdlJob -Account $dataLakeAnalyticsName -JobId $job.JobId
```

## See also
* To see the same tutorial using other tools, click the tab selectors on the top of the page.
* To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
* For management tasks, see [Manage Azure Data Lake Analytics using Azure portal](data-lake-analytics-manage-use-portal.md).
