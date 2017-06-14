---
title: Manage Azure Data Lake Analytics using Azure PowerShell | Microsoft Docs
description: 'Learn how to manage Data Lake Analytics jobs, data sources, users. '
services: data-lake-analytics
documentationcenter: ''
author: saveenr
manager: saveenr
editor: cgronlun

ms.assetid: ad14d53c-fed4-478d-ab4b-6d2e14ff2097
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 12/05/2016
ms.author: edmaca

---
# Manage Azure Data Lake Analytics using Azure PowerShell
[!INCLUDE [manage-selector](../../includes/data-lake-analytics-selector-manage.md)]

Learn how to manage Azure Data Lake Analytics accounts, data sources, users, and jobs using the Azure PowerShell. 

## Prerequisites

To create a Data Lake Analytics account, you first need to define:

* **Azure Resource Group**: A Data Lake Analytics account must be created within an Azure Resource group.
* **Data Lake Analytics account name**: The Data Lake account name must only contain lowercase letters and numbers.
* **Location**: One of the Azure data centers that supports Data Lake Analytics.
* **Default Data Lake Store account**: Each Data Lake Analytics account has a default Data Lake Store account. These accounts must be in the same location.

The PowerShell snippets in this tutorial use these variables to store this information

```
$rg = "<ResourceGroupName>"
$adls = "<DataLakeAccountName>"
$adla = "<DataLakeAnalyticsAccountName>"
$location = "East US 2"
```


## Create a Data Lake Analytics account

If you don't already have a Resource Group to use, create one. 

```
New-AzureRmResourceGroup -Name  $rg -Location $location
```

Every Data Lake Analytics account requires a default Data Lake Store account that it uses for storing logs. You can reuse an existing account or create an account. 

```
New-AdlStore -ResourceGroupName $rg -Name $adls -Location $location
```

Once a Resource Group and Data Lake Store account is available, create a Data Lake Analytics account.

```
New-AdlAnalyticsAccount -ResourceGroupName $rg -Name $adla -Location $location -DefaultDataLake $adls
```

## Get information about a Data Lake Analytics account

```
Get-AdlAnalyticsAccount -ResourceGroupName $rg -Name $adla  
```

## Submit a U-SQL job

Create a text file with following U-SQL script.

```
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
```

Submit the script.

```
Submit-AdlJob -AccountName $adla –ScriptPath "d:\test.usql"Submit
```

## Monitor U-SQL jobs

List all the jobs in the account. The output includes the currently running jobs and those jobs that have recently completed.

```
Get-AdlJob -Account $adla
```

Get the status of a specific job.

```
Get-AdlJob -AccountName $adla -JobId $job.JobId
```

Instead of calling Get-AdlAnalyticsJob over and over until a job finishes, you can use the Wait-AdlJob cmdlet.

```
Wait-AdlJob -Account $adla -JobId $job.JobId
```

After the job is completed, check if the output file exists by listing the files in a folder.

```
Get-AdlStoreChildItem -Account $adls -Path "/"
```

Check for the existence of a file.

```
Test-AdlStoreItem -Account $adls -Path "/data.csv"
```

## Cancel jobs

```
Stop-AdlJob -Account $dataLakeAnalyticAccountName -JobID $jobID
```

## Upload and download files

Download the output of the U-SQL script.

```
Export-AdlStoreItem -AccountName $adls -Path "/data.csv"  -Destination "D:\data.csv"
```

Upload a file to be used as an unput to a U-SQL script.

```
Import-AdlStoreItem -AccountName $adls -Path "D:\data.tsv" -Destination "/data_copy.csv" 
```

### List accounts

List Data Lake Analytics accounts within the current subscription

    Get-AdlAnalyticsAccount

List Data Lake Analytics accounts within a specific resource group

    Get-AdlAnalyticsAccount -ResourceGroupName $rg

Get details of a specific Data Lake Analytics account

    Get-AdlAnalyticsAccount -Name $adla

Test existence of a specific Data Lake Analytics account

    Test-AdlAnalyticsAccount -Name $adla

The cmdlet returns either **True** or **False**.

## Manage account data sources
Data Lake Analytics currently supports the following data sources:

* [Azure Data Lake Store](../data-lake-store/data-lake-store-overview.md)
* [Azure Storage](../storage/storage-introduction.md)

When you create an Analytics account, you must designate an Azure Data Lake Storage account to be the default 
storage account. The default Data Lake Store account is used to store job metadata and job audit logs. After you have 
created an Analytics account, you can add additional Data Lake Storage accounts and/or Azure Storage account. 

### Find the default Data Lake Store account
    $dataLakeStoreName = (Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $rg -Name $adla).Properties.DefaultDataLakeAccount


### Add additional Azure Blob storage accounts
    $AzureStorageAccountName = "<AzureStorageAccountName>"
    $AzureStorageAccountKey = "<AzureStorageAccountKey>"
    Add-AdlAnalyticsDataSource -ResourceGroupName $rg -Account $adla -AzureBlob $AzureStorageAccountName -AccessKey $AzureStorageAccountKey

### Add additional Data Lake Store accounts

    Add-AdlAnalyticsDataSource -ResourceGroupName $rg -Account $adla -DataLake $AzureDataLakeName 

### List data sources:

    $adla_acnt = Get-AzureRmDataLakeAnalyticsAccount -ResourceGroupName $rg -Name $adla
    $adla.Properties.DataLakeStoreAccounts
    $adla.Properties.StorageAccounts

## Manage catalog items
The U-SQL catalog is used to structure data and code so they can be shared by U-SQL scripts. The catalog enables the highest performance possible with data in Azure Data Lake. For more information, see [Use U-SQL catalog](data-lake-analytics-use-u-sql-catalog.md).

### List databases

    Get-AdlCatalogItem -Account $adla -ItemType Database

### List tables in a schema

    Get-AdlCatalogItem -Account $adla -ItemType Table -Path "master.dbo"

### Get details of a database

    Get-AdlCatalogItem  -Account $adla -ItemType Database -Path "master"

### Get details of a table in a database

    Get-AdlCatalogItem  -Account $adla -ItemType Table -Path "master.dbo.mytable"

### Test existence of a database

    Test-AdlCatalogItem  -Account $adla -ItemType Database -Path "master"


## Create a Data Lake Analytics account using a template

You can also use an Azure Resource Group template using the following  PowerShell script:

```
$AzureSubscriptionID = "<Your Azure Subscription ID>"

$ResourceGroupName = "<New Azure Resource Group Name>"
$Location = "EAST US 2"
$DefaultDataLakeStoreAccountName = "<New Data Lake Store Account Name>"
$DataLakeAnalyticsAccountName = "<New Data Lake Analytics Account Name>"

$DeploymentName = "MyDataLakeAnalyticsDeployment"
$ARMTemplateFile = "E:\Tutorials\ADL\ARMTemplate\azuredeploy.json"  # update the Json template path 

Login-AzureRmAccount

Select-AzureRmSubscription -SubscriptionId $AzureSubscriptionID

# Create the resource group
New-AzureRmResourceGroup -Name $ResourceGroupName -Location $Location

# Create the Data Lake Analytics account with the default Data Lake Store account.
$parameters = @{"adlAnalyticsName"=$DataLakeAnalyticsAccountName; "adlStoreName"=$DefaultDataLakeStoreAccountName}
New-AzureRmResourceGroupDeployment -Name $DeploymentName -ResourceGroupName $ResourceGroupName -TemplateFile $ARMTemplateFile -TemplateParameterObject $parameters 
```

For more information, see
[Deploy an application with Azure Resource Manager template](../azure-resource-manager/resource-group-template-deploy.md) and [Authoring Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md).

**Example template**

Save the following text as a `.json` file, and then use the preceding PowerShell script to use the template. 

```
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "adlAnalyticsName": {
      "type": "string",
      "metadata": {
        "description": "The name of the Data Lake Analytics account to create."
      }
    },
    "adlStoreName": {
      "type": "string",
      "metadata": {
        "description": "The name of the Data Lake Store account to create."
      }
    }
  },
  "resources": [
    {
      "name": "[parameters('adlStoreName')]",
      "type": "Microsoft.DataLakeStore/accounts",
      "location": "East US 2",
      "apiVersion": "2015-10-01-preview",
      "dependsOn": [ ],
      "tags": { }
    },
    {
      "name": "[parameters('adlAnalyticsName')]",
      "type": "Microsoft.DataLakeAnalytics/accounts",
      "location": "East US 2",
      "apiVersion": "2015-10-01-preview",
      "dependsOn": [ "[concat('Microsoft.DataLakeStore/accounts/',parameters('adlStoreName'))]" ],
      "tags": { },
      "properties": {
        "defaultDataLakeStoreAccount": "[parameters('adlStoreName')]",
        "dataLakeStoreAccounts": [
          { "name": "[parameters('adlStoreName')]" }
        ]
      }
    }
  ],
  "outputs": {
    "adlAnalyticsAccount": {
      "type": "object",
      "value": "[reference(resourceId('Microsoft.DataLakeAnalytics/accounts',parameters('adlAnalyticsName')))]"
    },
    "adlStoreAccount": {
      "type": "object",
      "value": "[reference(resourceId('Microsoft.DataLakeStore/accounts',parameters('adlStoreName')))]"
    }
  }
}
```

## Next steps
* [Overview of Microsoft Azure Data Lake Analytics](data-lake-analytics-overview.md)
* Get started with Data Lake Analytics using [Azure portal](data-lake-analytics-get-started-portal.md) | [Azure PowerShell](data-lake-analytics-get-started-powershell.md) | [CLI 2.0](data-lake-analytics-get-started-cli2.md)
* Manage Azure Data Lake Analytics using [Azure portal](data-lake-analytics-manage-use-portal.md) | [Azure PowerShell](data-lake-analytics-manage-use-powershell.md) |  [Azure portal](data-lake-analytics-manage-use-portal.md) | [CLI](data-lake-analytics-manage-use-cli.md) 
