---
title: Manage Azure Data Lake Analytics using Azure PowerShell | Microsoft Docs
description: 'Learn how to manage Data Lake Analytics accounts, data sources, jobs, and catalog items. '
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
ms.date: 06/26/2017
ms.author: mahi

---
# Manage Azure Data Lake Analytics using Azure PowerShell
[!INCLUDE [manage-selector](../../includes/data-lake-analytics-selector-manage.md)]

Learn how to manage Azure Data Lake Analytics accounts, data sources, jobs, and catalog items using Azure PowerShell. 

## Prerequisites

When creating a Data Lake Analytics account, you need to know:

* **Subscription ID**: The Azure subscription ID under which your Data Lake Analytics account resides.
* **Resource group**: The name of the Azure resource group that contains your Data Lake Analytics account.
* **Data Lake Analytics account name**: The account name must only contain lowercase letters and numbers.
* **Default Data Lake Store account**: Each Data Lake Analytics account has a default Data Lake Store account. These accounts must be in the same location.
* **Location**: The location of your Data Lake Analytics account, such as "East US 2" or other supported locations. Supported locations can be seen on our [pricing page](https://azure.microsoft.com/en-us/pricing/details/data-lake-analytics/).

The PowerShell snippets in this tutorial use these variables to store this information

```powershell
$subId = "<SubscriptionId>"
$rg = "<ResourceGroupName>"
$adla = "<DataLakeAnalyticsAccountName>"
$adls = "<DataLakeStoreAccountName>"
$location = "<Location>"
```

## Log in

```powershell
Login-AzureRmAccount -SubscriptionId $subId
```

> [!NOTE]
> To save your login session for future use, use ``Save-AzureRmProfile``. To load the login session again, use ``Select-AzureRmProfile``.

## Managing accounts

### Create a Data Lake Analytics account

If you don't already have a [resource group](../azure-resource-manager/resource-group-overview.md#resource-groups) to use, create one. 

```powershell
New-AzureRmResourceGroup -Name  $rg -Location $location
```

Every Data Lake Analytics account requires a default Data Lake Store account that it uses for storing logs. You can reuse an existing account or create an account. 

```powershell
New-AdlStore -ResourceGroupName $rg -Name $adls -Location $location
```

Once a Resource Group and Data Lake Store account is available, create a Data Lake Analytics account.

```powershell
New-AdlAnalyticsAccount -ResourceGroupName $rg -Name $adla -Location $location -DefaultDataLake $adls
```

### Get information about an account

Get details about an account.

```powershell
Get-AdlAnalyticsAccount -Name $adla
```

Check the existence of a specific Data Lake Analytics account. The cmdlet returns either `True` or `False`.

```powershell
Test-AdlAnalyticsAccount -Name $adla
```

### Listing accounts

List Data Lake Analytics accounts within the current subscription.

```powershell
Get-AdlAnalyticsAccount
```

List Data Lake Analytics accounts within a specific resource group.

```powershell
Get-AdlAnalyticsAccount -ResourceGroupName $rg
```

## Managing firewall rules

### Add or remove firewall rules

List firewall rules.

```powershell
Get-AdlAnalyticsFirewallRule -Account $adla
```

Add a firewall rule.

```powershell
$ruleName = "Allow access from on-prem server"
$startIpAddress = "<start IP address>"
$endIpAddress = "<end IP address>"

Add-AdlAnalyticsFirewallRule -Account $adla -Name $ruleName -StartIpAddress $startIpAddress -EndIpAddress $endIpAddress
```

Change a firewall rule.

```powershell
Set-AdlAnalyticsFirewallRule -Account $adla -Name $ruleName -StartIpAddress $startIpAddress -EndIpAddress $endIpAddress
```

Remove a firewall rule.

```powershell
Remove-AdlAnalyticsFirewallRule -Account $adla -Name $ruleName
```

### Enable or disable firewall rules

Enable firewall rules.

```powershell
Set-AdlAnalyticsAccount -Name $adla -FirewallState Enabled
```

Allow Azure IP addresses.

```powershell
Set-AdlAnalyticsAccount -Name $adla -AllowAzureIpState Enabled
```

Disable firewall rules.

```powershell
Set-AdlAnalyticsAccount -Name $adla -FirewallState Disabled
```

## Managing data sources
Azure Data Lake Analytics currently supports the following data sources:

* [Azure Data Lake Store](../data-lake-store/data-lake-store-overview.md)
* [Azure Storage](../storage/storage-introduction.md)

When you create an Analytics account, you must designate a Data Lake Store account to be the default 
data source. The default Data Lake Store account is used to store job metadata and job audit logs. After you have 
created a Data Lake Analytics account, you can add additional Data Lake Store accounts and/or Storage accounts. 

### Find the default Data Lake Store account

```powershell
$dataLakeStoreName = (Get-AdlAnalyticsAccount -Name $adla).Properties.DefaultDataLakeAccount
```

### Add data sources

Add an additional Storage (Blob) account.

```powershell
$AzureStorageAccountName = "<AzureStorageAccountName>"
$AzureStorageAccountKey = "<AzureStorageAccountKey>"

Add-AdlAnalyticsDataSource -Account $adla -Blob $AzureStorageAccountName -AccessKey $AzureStorageAccountKey
```

Add an additional Data Lake Store account.

```powershell
$AzureDataLakeStoreName = "<AzureDataLakeStoreAccountName"
Add-AdlAnalyticsDataSource -Account $adla -DataLakeStore $AzureDataLakeStoreName 
```

### List data sources

List all attached data sources.

```powershell
Get-AdlAnalyticsDataSource -Name $adla
```

List attached Data Lake Store accounts.

```powershell
Get-AdlAnalyticsDataSource -Name $adla | where -Property Type -EQ "DataLakeStore"
```

List attached Storage accounts.

```powershell
Get-AdlAnalyticsDataSource -Name $adla | where -Property Type -EQ "Blob"
```

## Managing jobs

### Submit a job

Create a local text file with following U-SQL script.

```
@a  = 
    SELECT * FROM 
        (VALUES
            ("Contoso", 1500.0),
            ("Woodgrove", 2700.0)
        ) AS D( customer, amount );
OUTPUT @a
    TO "/data.csv"
    USING Outputters.Csv();
```

Submit the script.

```powershell
Submit-AdlJob -AccountName $adla –ScriptPath "<LocalPathToScriptFile>"
```

### List jobs

List all the jobs in the account. The output includes the currently running jobs and those jobs that have recently completed.

```powershell
Get-AdlJob -Account $adla
```

List all failed jobs submitted by "joe@contoso.com" within the past seven days.

```powershell
Get-AdlJob -Account $adla `
    -Submitter "joe@contoso.com" `
    -SubmittedAfter (Get-Date).AddDays(-7) `
    -Result Failed
```

### Get information about a job

Get the status of a specific job.

```powershell
Get-AdlJob -AccountName $adla -JobId $job.JobId
```

Instead of repeating `Get-AdlAnalyticsJob` until a job finishes, you can use the `Wait-AdlJob` cmdlet to wait for the job to end.

```powershell
Wait-AdlJob -Account $adla -JobId $job.JobId
```

After the job has ended, check if the output file exists by listing the files in a folder.

```powershell
Get-AdlStoreChildItem -Account $adls -Path "/"
```

Check for the existence of a file.

```powershell
Test-AdlStoreItem -Account $adls -Path "/data.csv"
```

### Cancel a job

```powershell
Stop-AdlJob -Account $adls -JobID $jobID
```

## Uploading and downloading

Upload a file.

```powershell
Import-AdlStoreItem -AccountName $adls `
    -Path "<LocalPath>\data.tsv" `
    -Destination "/data_copy.csv" 
```

Upload an entire folder.

```powershell
Import-AdlStoreItem -AccountName $adls `
    -Path "<LocalPath>\myData\" `
    -Destination "/myData/" `
    -Recurse
```

Download a file.

```powershell
Export-AdlStoreItem -AccountName $adls `
    -Path "/data.csv" `
    -Destination "<LocalPath>\data.csv"
```

Download an entire folder.

```powershell
Export-AdlStoreItem -AccountName $adls `
    -Path "/" `
    -Destination "<LocalPath>\myData\" `
    -Recurse
```

> [!NOTE]
> If the upload or download process is interrupted, you can attempt to resume the process by running the cmdlet again with the ``-Resume`` flag.

## Manage catalog items
The U-SQL catalog is used to structure data and code so they can be shared by U-SQL scripts. The catalog enables the highest performance possible with data in Azure Data Lake. For more information, see [Use U-SQL catalog](data-lake-analytics-use-u-sql-catalog.md).

### List items

List U-SQL databases.

```powershell
Get-AdlCatalogItem -Account $adla -ItemType Database 
```

List tables within a database.

```powershell
Get-AdlCatalogItem -Account $adla -ItemType Table -Path "master"
```

List tables within a schema.

```powershell
Get-AdlCatalogItem -Account $adla -ItemType Table -Path "master.dbo"
```

### Get information about a catalog item

Get details of a U-SQL database.

```powershell
Get-AdlCatalogItem  -Account $adla -ItemType Database -Path "master"
```

Get details of a table in a U-SQL database.

```powershell
Get-AdlCatalogItem  -Account $adla -ItemType Table -Path "master.dbo.mytable"
```

Test existence of a U-SQL database.

```powershell
Test-AdlCatalogItem  -Account $adla -ItemType Database -Path "master"
```

### Create catalog items

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

## Create a Data Lake Analytics account using a template

You can also use an Azure Resource Group template using the following  PowerShell script:

```powershell
$subId = "<Your Azure Subscription ID>"

$rg = "<New Azure Resource Group Name>"
$location = "<Location (such as East US 2)>"
$adls = "<New Data Lake Store Account Name>"
$adla = "<New Data Lake Analytics Account Name>"

$deploymentName = "MyDataLakeAnalyticsDeployment"
$armTemplateFile = "<LocalFolderPath>\azuredeploy.json"  # update the JSON template path 

# Log in to Azure
Login-AzureRmAccount -SubscriptionId $subId

# Create the resource group
New-AzureRmResourceGroup -Name $rg -Location $location

# Create the Data Lake Analytics account with the default Data Lake Store account.
$parameters = @{"adlAnalyticsName"=$adla; "adlStoreName"=$adls}
New-AzureRmResourceGroupDeployment -Name $deploymentName -ResourceGroupName $rg -TemplateFile $armTemplateFile -TemplateParameterObject $parameters 
```

For more information, see
[Deploy an application with Azure Resource Manager template](../azure-resource-manager/resource-group-template-deploy.md) and [Authoring Azure Resource Manager templates](../azure-resource-manager/resource-group-authoring-templates.md).

**Example template**

Save the following text as a `.json` file, and then use the preceding PowerShell script to use the template. 

```json
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
