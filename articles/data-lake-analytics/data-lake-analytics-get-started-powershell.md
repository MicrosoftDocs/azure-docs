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

Learn how to use the Azure PowerShell to create Azure Data Lake Analytics accounts, define Data Lake Analytics jobs in [U-SQL](data-lake-analytics-u-sql-get-started.md), and submit jobs to Data Lake Analytic accounts. For more  information about Data Lake Analytics, see [Azure Data Lake Analytics overview](data-lake-analytics-overview.md).

In this tutorial, you will develop a job that reads a tab separated values (TSV) file and converts it into a comma separated values (CSV) file. To go through the same tutorial using other supported tools, click the tabs on the top of this section.

## Prerequisites
Before you begin this tutorial, you must have the following:

* **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
* **A workstation with Azure PowerShell**. See [How to install and configure Azure PowerShell](/powershell/azure/overview).
* **An Azure Resource Group**. 

## Create Data Lake Analytics account
You must have a Data Lake Analytics account before you can run any jobs. To create a Data Lake Analytics account, you must specify the following:

* **Azure Resource Group**: A Data Lake Analytics account must be created within a Azure Resource group. [Azure Resource Manager](../azure-resource-manager/resource-group-overview.md) enables you to work with the resources in your application as a group. You can deploy, update or delete all of the resources for your application in a single, coordinated operation.  
* **Data Lake Analytics account name**: The Data Lake account name must only contain lowercase letters and numbers.
* **Location**: one of the Azure data centers that supports Data Lake Analytics.
* **Default Data Lake Store  account**: each Data Lake Analytics account has a default Data Lake Store account.

        $resourceGroupName = "<ResourceGroupName>"
        $dataLakeStoreName = "<DataLakeAccountName>"
        $dataLakeAnalyticsName = "<DataLakeAnalyticsAccountName>"
        $location = "East US 2"

        New-AzureRmResourceGroup `
            -Name  $resourceGroupName `
            -Location $location

        New-AzureRmDataLakeStoreAccount `
            -ResourceGroupName $resourceGroupName `
            -Name $dataLakeStoreName `
            -Location $location

        New-AzureRmDataLakeAnalyticsAccount `
            -Name $dataLakeAnalyticsName `
            -ResourceGroupName $resourceGroupName `
            -Location $location `
            -DefaultDataLake $dataLakeStoreName

        Get-AzureRmDataLakeAnalyticsAccount `
            -ResourceGroupName $resourceGroupName `
            -Name $dataLakeAnalyticsName  

## Upload data to Data Lake Store

```
Import-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Path "D:\SearchLog.tsv" -Destination "/Samples/Data/SearchLog.tsv"
```

## Getting the Default Data Lake Store account for a Data Lake Analytics Account

```
$dataLakeAnalyticsAccount = Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAnalyticsName
$dataLakeStoreName = $dataLakeAnalyticsAccount.Properties.DefaultDataLakeStoreAccount
echo $dataLakeStoreName
```

## Submit Data Lake Analytics jobs
The Data Lake Analytics jobs are written in the U-SQL language. To learn more about U-SQL, see [Get started with U-SQL language](data-lake-analytics-u-sql-get-started.md) and [U-SQL language reference](http://go.microsoft.com/fwlink/?LinkId=691348).

Create a text file with following U-SQL script, and save the text file to your workstation:

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

**To submit the job**

1. Open PowerShell ISE.
2. Run the following script:

```
$usqlScript = "c:\script.usql"

$job = Submit-AzureRmDataLakeAnalyticsJob -Name "convertTSVtoCSV" -AccountName $dataLakeAnalyticsName –ScriptPath $usqlScript

Wait-AdlJob -Account $dataLakeAnalyticsName -JobId $job.JobId

Get-AzureRmDataLakeAnalyticsJob -AccountName $dataLakeAnalyticsName -JobId $job.JobId
```


After the job is completed, you can use the following cmdlets to list the file, and download the file:

```
$destFile = "c:\SearchLog-from-Data-Lake.csv"

$dataLakeStoreAccount = Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $resourceGroupName -Name $dataLakeAnalyticName
$dataLakeStoreName = $dataLakeStoreAccount.Properties.DefaultDataLakeAccount
Get-AzureRmDataLakeStoreChildItem -AccountName $dataLakeStoreName -path "/Output"
Export-AzureRmDataLakeStoreItem -AccountName $dataLakeStoreName -Path "/Output/SearchLog-from-Data-Lake.csv" -Destination $destFile

```

## See also
* To see the same tutorial using other tools, click the tab selectors on the top of the page.
* To learn U-SQL, see [Get started with Azure Data Lake Analytics U-SQL language](data-lake-analytics-u-sql-get-started.md).
* For management tasks, see [Manage Azure Data Lake Analytics using Azure Portal](data-lake-analytics-manage-use-portal.md).
