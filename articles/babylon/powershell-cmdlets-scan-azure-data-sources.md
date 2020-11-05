---
title: Use PowerShell cmdlets to scan Azure data sources
titleSuffix: Azure Purview
description: Learn how to use PowerShell cmdlets to register and scan Azure data sources.
author: chandrakavya
ms.author: kchandra
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: reference
ms.date: 10/12/2020
# Customer intent As a data steward, I want to perform scans so that I can classify my data.
---

# Use PowerShell cmdlets to scan Azure data sources

This article describes how to use PowerShell cmdlets to set up and run data source scans.

## Introduction

Babylon can scan and classify on-premises data at regular intervals, using either the catalog UI or PowerShell cmdlets. This article shows how to use PowerShell cmdlets to connect to a catalog session. It also shows how to use the connection to manage:

- Data sources.
- Scans.
- Triggers.
- Classification rules.

To set up a scan, first create a data source and then create a scan under the data source. The set of supported authentication methods for a scan depends on the data source type. For more information, see the authentication section of [Tutorial: Use the portal to scan Azure data sources](portal-scan-azure-data-sources.md#create-a-scan-and-authenticate). When the scan is created, you can associate a trigger with it.

> [!Note]
> The user that runs the PowerShell cmdlets should be the catalog or data source admin in the Babylon data plane.

## The cmdlets

The cmdlets enable you connect to sessions, and to create, read, update, and delete data sources, scans, triggers, and classification rules. The cmdlets are described below. To get the cmdlets, download the ManagedScanningPowerShell zip file. When you have them, run the following command before any other:

```PowerShell
Import-Module "pathtounzippedfolder\\Microsoft.DataCatalog.Management.Commands.dll"
```

## Connect to data catalog sessions

### Set-AzDataCatalogSessionSettings

> [!Important]
> Run this cmdlet to connect to a data catalog session before you run other cmdlets described in the following sections.

**Syntax 1:**

```PowerShell
Set-AzDataCatalogSessionSettings [-DataCatalogSession] [[-UserAuthentication]]
-TenantId <string> -DataCatalogAccountName <string>
[-Environment {Production | Dogfood}]
```

**Description:** Use user authentication to connect to an existing data catalog session.

**Parameters:**

- *TenantId*: The tenant ID for the service principal ID that's authorized to access the data source account.
- *DataCatalogAccountName*: The data catalog name.
- *Environment*: The environment in which the Babylon account is created.

    > The possible options are **Dogfood** or **Production**. If the Babylon account endpoint ends with .babylon.azure-test.com, the environment is **Dogfood**. If it ends with .babylon.azure.com, the environment is **Production**.

After you run the cmdlet, you'll be asked to open the page 'https://microsoft.com/devicelogin' in a web browser and enter the code provided to authenticate.

:::image type="content" source="media/scan-azure-data-sources-PowerShell/image1.png" alt-text="The message provides an authentication code." border="true":::

Once the code is verified, you'll be asked to sign in using your Azure Active Directory (Azure AD) credentials.:::image type="content" source="media/scan-azure-data-sources-PowerShell/image2.png" alt-text="Enter email, phone, or Skype to identify yourself for sign in to the application on a remote device or service. There are 'Back' and 'Next' buttons." border="true":::

**Example:**

```PowerShell
Set-AzDataCatalogSessionSettings -DataCatalogSession -UserAuthentication
-TenantId 'NNNNNNNN-76f1-41af-91ab-2d7cd011db47' -DataCatalogAccountName catalog03
-Environment Production
```

**Syntax 2:**

```PowerShell
Set-AzDataCatalogSessionSettings [-DataCatalogSession]
[-ServicePrincipalAuthentication] -TenantId <string>
-ServicePrincipalApplicationId <string> -ServicePrincipalKey <string>
-DataCatalogAccountName <string> [-Environment {Production | Dogfood}]
```

**Description:** Use service principal authentication to connect to an existing data catalog session.

**Parameters:**

- *TenantId*: The tenant ID for the service principal ID that's authorized to access the data source account.
- *ServicePrincipalApplicationId*: The service principal ID that's authorized to access the data source account. Make sure this ID is a catalog administrator.
- *ServicePrincipalKey*: The service principal key for the principal ID.
- *DataCatalogAccountName*: The data catalog name.
- *Environment*: The environment in which the Babylon account is created.

    > The possible options are **Dogfood** or **Production**. If the Babylon account endpoint ends with .babylon.azure-test.com, the environment is **Dogfood**. If it ends with .babylon.azure.com, the environment is **Production**.

Once the code is verified, you'll be asked to use your Active AD credentials to sign in.

**Example:**

```PowerShell
Set-AzDataCatalogSessionSettings -DataCatalogSession
-ServicePrincipalAuthentication -TenantId 'NNNNNNNN-76f1-41af-91ab-2d7cd011db47'
-ServicePrincipalApplicationId 'NNNNNNNN-g9e5-4707-8ecb-0340a9e9c6e4'
-ServicePrincipalKey '*****fTkg1V/0lzxqf_5EhDWDivbt@V_'
-DataCatalogAccountName catalog03 -Environment Production
```

## Create, view, and delete data sources

### New-AzDataCatalogDataSource

**Syntax 1:**

```PowerShell
New-AzDataCatalogDataSource -Name <string> -AccountName <string>
-AccountType
{AzureStorageBlob | AdlsGen1 | AdlsGen2 | AzureCosmosDb | AzureDataExplorer |
AzureFileService}
```

**Description**: Provide an account name to create a new data source.

**Parameters**:

- *Name*: The name of the data source.
- *AccountName*: The data source account name.
- *AccountType*: The data source account type ```{AzureStorageBlob | AdlsGen1 | AdlsGen2 | AzureCosmosDb | AzureDataExplorer | AzureFileService}```.

**Example:**

```PowerShell
New-AzDataCatalogDataSource -Name datasource01 -AccountName testblobaccount
-AccountType AzureStorageBlob
```

**Syntax 2:**

```PowerShell
New-AzDataCatalogDataSource -Name <string> -AccountUri <string>
-AccountType
{AzureStorageBlob | AdlsGen1 | AdlsGen2 | AzureCosmosDb | AzureDataExplorer |
AzureFileService }
```

**Description**: Provide an account URI to create a new data source.

**Parameters**:

- *Name*: The name of the data source.
- *AccountUri*: The data source account URI (the complete URI).
- *AccountType*: The data source account type ```{AzureStorageBlob | AdlsGen1 | AdlsGen2 | AzureCosmosDb | AzureDataExplorer | AzureFileService }```.

**Example**:

```PowerShell
New-AzDataCatalogDataSource -Name datasource01
-AccountUri https://testblobaccount.blob.core.windows.net -AccountType AzureStorageBlob
```

**Syntax 3**: **(Azure SQL DB, Azure SQL DataWarehouse, Azure SQL Managed Instance)**

```PowerShell
New-AzDataCatalogDataSource -Name <string> -ServerName <string>
-AccountType { AzureSqlDatabase | AzureSqlDataWarehouse | AzureSqlManagedInstance }
```

**Description**: Provide a SQL server name to create a new data source.

**Parameters**:

- *Name*: The name of the data source.
- *ServerName*: The SQL server name.
- *AccountType*: The data source account type.

Example: ```New-AzDataCatalogDataSource -Name sqlsource01 -ServerName sql01 -AccountType AzureSqlDatabase```

**Syntax 4: (Azure SQL DB, Azure SQL DataWarehouse, Azure SQL Managed
Instance)**

```PowerShell
New-AzDataCatalogDataSource -Name <string> -ServerEndpoint <string>
-AccountType { AzureSqlDatabase | AzureSqlDataWarehouse | AzureSqlManagedInstance }
```

**Description**: Provide a SQL server endpoint to create a new data source.

**Parameters**:

- *Name*: The name of the data source.
- *ServerEndpoint*: The SQL server endpoint.
- *AccountType*: The data source account type.

**Example**:

```PowerShell
New-AzDataCatalogDataSource -Name sqlsource02
-ServerEndpoint sql01.database.windows.net -AccountType AzureSqlDatabase
```

**Syntax 5: (Power BI)**

```PowerShell
New-AzDataCatalogDataSource -Name <string> -AccountType {PowerBI} -Tenant <string>
```

**Description**: Provide the tenant ID to create a new data source.

**Parameters**:

- *Name*: The name of the data source.
- *AccountType*: The data source account type ```{AzureStorageBlob | AdlsGen1 | AdlsGen2 | AzureCosmosDb | AzureDataExplorer | AzureFileService | AzureSqlDatabase | AzureSqlDataWarehouse | AzureSqlManagedInstance | PowerBI}```.
- *Tenant*: The tenant ID for the service principal ID that's authorized to access the data source account.

**Example**:

```PowerShell
New-AzDataCatalogDataSource -Name datasource01 -AccountType PowerBI
-Tenant 'NNNNNNNN-86f1-41af-91ab-2d7cd011db47'
```

**Syntax 6:**

```PowerShell
New-AzDataCatalogDataSource -Name <string>
-AccountType
{AzureStorageBlob | AdlsGen1 | AdlsGen2 | AzureCosmosDb | AzureDataExplorer |
AzureFileService | AzureSqlDatabase | AzureSqlDataWarehouse |
AzureSqlManagedInstance | PowerBI}
```

**Description**: Provide the account type to create a new data source.

**Parameters**:

- *Name*: The name of the data source.
- *AccountType*: The data source account type ```{AzureStorageBlob | AdlsGen1 | AdlsGen2 | AzureCosmosDb | AzureDataExplorer | AzureFileService | AzureSqlDatabase | AzureSqlDataWarehouse | AzureSqlManagedInstance | PowerBI}```.

**Example**:

```PowerShell
New-AzDataCatalogDataSource -Name datasource01 -AccountType AzureStorageBlob
```

### Get-AzDataCatalogDataSource

**Syntax:**

```PowerShell
Get-AzDataCatalogDataSource [-Name <string>]
```

**Description**: Provide the data source name to get a data source.

**Parameters**:

- *Name*: The name of the data source.

**Example**:

```PowerShell
Get-AzDataCatalogDataSource -Name datasource01
```

### Remove-AzDataCatalogDataSource

**Syntax1:**

```PowerShell
Remove-AzDataCatalogDataSource <string> -Name <string>
```

**Description**: Provide the data source name to remove a data source..

**Parameters**:

- *Name*: The name of the data source.

**Example**:

```PowerShell
Remove-AzDataCatalogDataSource -Name datasource01
```

**Syntax 2:**

```PowerShell
Remove-AzDataCatalogDataSource -InputObject <PSDataSource>
```

**Description**: Provide the data source object to remove a data source.

**Parameters**:

- *InputObject*: The data source object.

**Example**:

```PowerShell
$datasource = Get-AzDataCatalogDataSource -ResourceId /subscriptions/
   NNNNNNNN-9d2d-410e-8596-66662a550595/resourceGroups/test-rg/providers/
   Microsoft.DataCatalog/datacatalogs/catalog03/datasources/datasource01
Remove-AzDataCatalogDataSource -InputObject $datasource
```

## Create and view scan rule sets

### Set-AzDataCatalogScanRuleset

**Syntax:**

```PowerShell
Set-AzDataCatalogScanRuleset
-- AzureBlob
| AdlsGen1 | AdlsGen2 | AzureCosmosDb | AzureDataExplorer | AzureFileService |
AzureSqlDatabase | AzureSqlDatabaseManagedInstance | AzureSqlDataWarehouse | PowerBI |
-Name <String> [-Description <String>]
[-IncludedCustomClassificationRuleNames <string[]>]
[-AllowedFileExtensions @(<String>)]
```

**Description**: Provide custom classification names to create a scan rule set.

**Parameters**:

- *Name*: The name of the scan rule set.
- *Description*: The description of the scan rule set.
- *IncludedCustomClassificationRuleNames*: The names of the custom classifications to be included.
- *AllowedFileExtensions*: The file types for schema extraction and classification.

**Example:**

```PowerShell
Set-AzDataCatalogScanRuleset -AzureBlob -Name 'AzureStorageRuleSetCmdlet'
-Description 'testing from cmdlets'
-IncludedCustomClassificationRuleNames 'Test_CustomClassification'
-AllowedFileExtensions @('csv','json','psv','ssv','tsv','txt','xml','parquet')
```

### Get-AzDataCatalogScanRuleset

```PowerShell
Get-AzDataCatalogScanRuleset [-Name <String>]
```

**Description**: Provide a rule set name to get a scan rule set.

**Parameters**:

- *Name*: The name of the scan rule set.

**Example:**

```PowerShell
Get-AzDataCatalogScanRuleset -Name AzureStorageRuleSetCmdlet
```

## Create, view, and delete scans

### New-AzDataCatalogScan

**Syntax 1: (Authentication type: msi):**

```PowerShell
New-AzDataCatalogScan
[-AdlsGen1Msi|-AdlsGen2Msi|-AzureBlobMsi|-PowerBIManagedInstanceMsi]
-DataSourceName <string> -Name <string> [-ScanRulesetName <string>]
```

**Description**: Provide a data source name, scan name, and rule set name to create a new scan. Only the **AdlsGen1Msi**, **AdlsGen2Msi**, **AzureBlobMsi**, and **PowerBIManagedInstanceMsi** options are valid for this syntax.

 **Parameters**:

- *DataSourceName*: The name of the data source.
- *Name*: The name of the scan.
- *ScanRulesetName*: The name of the scan rule set.

**Example:**

```PowerShell
New-AzDataCatalogScan -AzureBlobMsi -DataSourceName ds01 -Name msiscan
-ScanRulesetName AzureStorageRuleSetCmdlet
```

**Syntax 2: (Authentication type: SQLAuthentication msi):**

```PowerShell
New-AzDataCatalogScan
[-AzureSqlDatabaseMsi|-AzureSqlDataWarehouseMsi|-AzureSqlManagedInstanceMsi]
-ServerEndpoint <string> -DatabaseName <string> -DataSourceName <string>
-Name <string> [-ScanRulesetName <string>]
```

**Description**: Provide a SQL Server endpoint, SQL database name, data source name, scan name, and rule set name to create a new scan. Only the **AzureSqlDatabaseMsi**, **AzureSqlDataWarehouseMsi**, and **AzureSqlManagedInstanceMsi** options are valid for this syntax.

**Parameters**:

- *ServerEndpoint*: The SQL server endpoint.
- *DatabaseName*: The SQL database name.
- *DataSourceName*: The name of the data source.
- *Name*: The name of the scan.
- *ScanRulesetName*: The name of the scan rule set.

**Example:**

```PowerShell
New-AzDataCatalogScan -AzureSqlDatabaseMsi -ServerEndpoint kk.database.windows.net
-DatabaseName db01 -DataSourceName ds01 -Name msiscan
-ScanRulesetName AzureStorageRuleSetCmdlet
```

**Syntax 3: (Authentication type: AccessKey):**

```PowerShell
New-AzDataCatalogScan [-AdlsGen2AccessKey|-AzureBlobAccessKey|-AzureCosmosDbAccessKey]
-AccessKey <string> -DataSourceName <string> -Name <string> [-ScanRulesetName <string>]
```

**Description**: Provide an access key, data source name, scan name, and rule set name to create a new scan. Only the **AdlsGen2AccessKey**, **AzureBlobAccessKey**, and **AzureCosmosDbAccessKey** options are valid for this syntax.

 **Parameters**:

- *AccessKey*: The access key for the data source account.
- *DataSourceName*: The name of the data source.
- *Name*: The name of the scan.
- *ScanRulesetName*: The name of the scan rule set.

**Example:**

```PowerShell
New-AzDataCatalogScan -AccessKey "ProvideAccountAccessKey"
-DataSourceName datasource01 -Name scan01 -ScanRulesetName AzureStorageRuleSetCmdlet
```

**Syntax 4: (Authentication type: AzureFileService AccessKey):**

```PowerShell
New-AzDataCatalogScan [-AzureFileServiceAccessKey] -FileShareName <string>
-AccessKey <string> -DataSourceName <string> -Name <string> [-ScanRulesetName <string>]
```

**Description**: Provide a file name, access key, data source name, scan name, and rule set name to create a new scan. Only the **AzureFileServiceAccessKey** option is valid for this syntax.

**Parameters**:

- *FileShareName*: The name of the Azure file.
- *AccessKey*: The access key for the data source account.
- *DataSourceName*: The name of the data source.
- *Name*: The name of the scan.
- *ScanRulesetName*: The name of the scan rule set.

**Example:**

```PowerShell
New-AzDataCatalogScan -FileShareName ContosoData -AccessKey "ProvideAccountAccessKey"
-DataSourceName datasource01 -Name scan01 -ScanRulesetName AzureStorageRuleSetCmdlet
```

**Syntax 5: (Authentication type: SaSToken):**

```PowerShell
New-AzDataCatalogScan [-AzureBlobSas] -SasUri <string> -DataSourceName <string>
-Name <string> [-ScanRulesetName <string>]
```

*Description**: Provide a shared access signature (SAS), data source name, scan name, and rule set name to create a new scan. Only the **AzureBlobSas** option is valid for this syntax.

**Parameters**:

- *SasUri*: The shared access signature (SAS) for the data source account.
- *DataSourceName*: The name of the data source.
- *Name*: The name of the scan.
- *ScanRulesetName*: The name of the scan rule set.

**Example:**

```PowerShell
New-AzDataCatalogScan -AzureBlobSas
-SasUri 'https://myaccount.blob.core.windows.net/pictures/profile.jpg?sv=2012-02-12&
    st=2009-02-09&se=2009-02-d&sig=dD80ihBh5jfNpymO5Hg1IdiJIEvHcJpCMiCMnN%2fRnbI%3d'
-DataSourceName datasource01 -Name scan01 -ScanRulesetName AzureStorageRuleSetCmdlet
```

**Syntax 6: (Authentication type: ServicePrincipalId):**

```PowerShell
New-AzDataCatalogScan
[-AdlsGen1ServicePrincipal|-AdlsGen2ServicePrincipal|-AzureBlobServicePrincipal|
-AzureDataExplorerServicePrincipal]
-ServicePrincipalId <string> -ServicePrincipalKey <string> -TenantId <string>
-DataSourceName <string> -Name <string> [-ScanRulesetName <string>]
```

**Description**: Provide a service principal ID and key, data source name, scan name, and rule set name to create a new scan. Only the **AdlsGen1ServicePrincipal**, **AdlsGen2ServicePrincipal**, **AzureBlobServicePrincipal**, and **AzureDataExplorerServicePrincipal** options are valid for this syntax.

**Parameters**:

- *ServicePrincipalId*: The service principal ID that's authorized to access the data source account.
- *ServicePrincipalKey*: The service principal key for the principal ID.
- *DataSourceName*: The name of the data source.
- *Name*: The name of the scan.
- *ScanRulesetName*: The name of the scan rule set.

**Example:**

```PowerShell
New-AzDataCatalogScan -AzureBlobServicePrincipal
-ServicePrincipalId NNNNNNNN-f884-402d-b89f-0711a7d0673d
-ServicePrincipalKey "The service principal key"
-TenantId NNNNNNN-0470-4035-92a7-dd63eddaa2b1
-DataSourceName datasource01 -Name scan01 -ScanRulesetName AzureStorageRuleSetCmdlet
```

**Syntax 7: (Authentication type: SQL ServicePrincipalId):**

```PowerShell
New-AzDataCatalogScan
[-AzureSqlDatabaseServicePrincipal|-AzureSqlDataWarehouseServicePrincipal|
-AzureSqlManagedInstanceServicePrincipal]
-ServerEndpoint <string> -DatabaseName <string> -ServicePrincipalId <string>
-ServicePrincipalKey <string> -TenantId <string> -DataSourceName <string>
-Name <string> [-ScanRulesetName <string>]
```

**Description**: Provide a SQL Server endpoint, SQL database name, service principal ID and key, data source name, scan name, and rule set name to create a new scan. Only the **AdlsGen1ServicePrincipal**, **AdlsGen2ServicePrincipal**, and **AzureBlobServicePrincipal** options are valid for this syntax.

**Parameters**:

- *ServerEndpoint*: The SQL server endpoint.
- *DatabaseName*: The SQL database name.
- *ServicePrincipalId*: The service principal ID that's authorized to access the data source account.
- *ServicePrincipalKey*: The service principal key for the principal ID.
- *DataSourceName*: The name of the data source.
- *Name*: The name of the scan.
- *ScanRulesetName*: The name of the scan rule set.

**Example:**

```PowerShell
New-AzDataCatalogScan -- AzureSqlDatabaseServicePrincipal
-ServerEndpoint kk.database.windows.net -DatabaseName db01
-ServicePrincipalId NNNNNNNN-f884-402d-b89f-0711a7d0673d
-ServicePrincipalKey "The service principal key" -DataSourceName datasource01
-Name scan01 -ScanRulesetName AzureStorageRuleSetCmdlet
```

**Syntax 8: (Authentication type: SQL Authentication):**

```PowerShell
New-AzDataCatalogScan
[-AzureSqlDatabaseConnectionString|-AzureSqlDataWarehouseConnectionString|
-AzureSqlManagedInstanceConnectionString]
-ServerEndpoint <string> -DatabaseName <string> -UserName <string> -Password <string>
-DataSourceName <string> -Name <string> [-ScanRulesetName <string>]
```

**Description**: Provide a SQL Server endpoint, SQL database name, database user name and password, data source name, scan name, and rule set name to create a new scan. Only the **AzureSqlDatabaseConnectionString**, **AzureSqlDataWarehouseConnectionString**, and **AzureSqlManagedInstanceConnectionString** options are valid for this syntax.

**Parameters**:

- *ServerEndpoint*: The SQL server endpoint.
- *DatabaseName*: The SQL database name.
- *UserName*: The database user name credentials.
- *Password*: The database password.
- *DataSourceName*: The name of the data source.
- *Name*: The name of the scan.
- *ScanRulesetName*: The name of the scan rule set.

**Example:**

```PowerShell
New-AzDataCatalogScan -- AzureSqlDatabaseConnectionString
-ServerEndpoint kk.database.windows.net -DatabaseName db01
-DataSourceName datasource01 -UserName pp -Password kk -Name scan01
-ScanRulesetName AzureStorageRuleSetCmdlet
```

**Syntax 9: (Authentication type: PBI Authentication):**

```PowerShell
New-AzDataCatalogScan -PowerBIDelegated -ServicePrincipalId <string>
-UserName <string> -Password <string> -DataSourceName <string> -Name <string>
[-ScanRulesetName <string>]
```

**Description**: Provide a service principal ID, database user name and password, data source name, scan name, and rule set name to create a new scan. Only the **PowerBIDelegated** option is valid for this syntax.

**Parameters**:

- *ServicePrincipalId*: The service principal ID that's authorized to access the data source account.
- *UserName*: The database user name credentials.
- *Password*: The database password.
- *DataSourceName*: The name of the data source.
- *Name*: The name of the scan.
- *ScanRulesetName*: The name of the scan rule set.

**Example:**

```PowerShell
New-AzDataCatalogScan -- PowerBIDelegated
-ServicePrincipalId NNNNNNNN-f884-402d-b89f-0711a7d0673d -UserName pp -Password kk
-Name scan01 -DataSourceName datasource01 -ScanRulesetName AzureStorageRuleSetCmdlet
```

### Get-AzDataCatalogScan

**Syntax:**

```PowerShell
Get-AzDataCatalogScan -DataSourceName <string> [-Name <string>]
```

**Description**: Provide the scan name to get a scan under a data source.

Parameters:

- *DataSourceName*: The name of the data source.
- *Name*: The name of the scan.

**Example**:

```PowerShell
Get-AzDataCatalogScan -DataSourceName datasource01 -Name scan01
```

### Remove-AzDataCatalogSca

**Syntax:**

```PowerShell
Remove-AzDataCatalogScan -DataSourceName <string> -Name <string>
```

**Description**: Provide the scan name to remove a scan under a data source.

**Parameters**:

- *DataSourceName*: The name of the data source.
- *Name*: The name of the scan.

**Example**:

```PowerShell
Remove-AzDataCatalogScan -DataSourceName datasource01 -Name scan01
```

## Start scans, stop scans, and view scan history

### Start-AzDataCatalogScan

**Syntax:**

```PowerShell
Start-AzDataCatalogScan -DataSourceName <string> -Name <string>
```

**Description**: Provide the scan name to start the scan.

**Parameters**:

- *DataSourceName*: The name of the data source.
- *Name*: The name of the scan.

Example:

```PowerShell
Start-AzDataCatalogScan -DataSourceName datasource01 -Name scan01
```

### Stop-AzDataCatalogScan

**Syntax:**

```PowerShell
Stop-AzDataCatalogScan -DataSourceName <string> -Name <string> -RunId <string>
```

**Description**: Provide the scan name and result ID to cancel the scan.

**Parameters**:

- *DataSourceName*: The name of the data source.
- *Name*: The name of the scan.
- *RunId*: The scan result ID.

**Example**:

```PowerShell
Cancel-AzDataCatalogScan -DataSourceName datasource01 -Name scan01
-RunId 2038c056-0290-4c08-99d9-05ed6a0c3538
```

### Get-AzDataCatalogScanHistory

**Syntax:**

```PowerShell
Get-AzDataCatalogScanHistory -DataSourceName <string> -Name <string>
```

**Description**: Provide the scan name to get the scan history.

**Parameters**:

- *DataSourceName*: The name of the data source.
- *Name*: The name of the scan.

**Example**:

```PowerShell
Get-AzDataCatalogScanHistory -DataSourceName datasource01 -Name scan01
```

## Create, view, and delete triggers

### New-AzDataCatalogTrigger

**Syntax**:

```PowerShell
New-AzDataCatalogTrigger -DataSourceName <string> -ScanName <string> -Name <string>
-RecurrenceInterval <string> -TimeoutInterval <string> -ScanLevel {Full | Incremental}
```

**Description**: Provide trigger information to create a new trigger.

**Parameters**:

- *DataSourceName*: The name of the data source.
- *ScanName*: The name of the scan.
- *Name*: The name of the trigger.
- *RecurrenceInterval*: The recurrence interval (in the range of 1.00:00:00 and 10675199.02:48*: 05.4775807).
- *TimeoutInterval*: The timeout interval.
- *ScanLevel*: The scan level, either **Full** or **Incremental**.

**Example**:

```PowerShell
New-AzDataCatalogTrigger -ResourceGroupName test-rg -DataCatalogName catalog03
-DataSourceName datasource01 -ScanName scan01 -Name trigger01
-RecurrenceInterval 1.00:00:00 -TimeoutInterval 0.07:00:00 -ScanLevel Full
```

### Get-AzDataCatalogTrigger

**Syntax:**

```PowerShell
Get-AzDataCatalogTrigger -DataSourceName <string> -ScanName <string> [-Name <string>]
```

**Description**: Provide the trigger name to get the trigger.

**Parameters**:

- *DataSourceName*: The name of the data source.
- *ScanName*: The name of the scan.
- *Name*: The name of the trigger.

**Example**:

```PowerShell
Get-AzDataCatalogTrigger -ResourceGroupName test-rg -DataCatalogName catalog03
-DataSourceName datasource01 -ScanName scan01 -Name trigger01
```

### Remove-AzDataCatalogTrigger

**Syntax**:

```PowerShell
Remove-AzDataCatalogTrigger -DataSourceName <string> -ScanName <string> -Name <string>
```

**Description**: Provide the trigger name to remove the trigger.

**Parameters**:

- *DataSourceName*: The name of the data source.
- *ScanName*: The name of the scan.
- *Name*: The name of the trigger.

**Example**:

```PowerShell
Remove-AzDataCatalogTRigger -DataSourceName datasource01 -ScanName scan01
-Name trigger01
```

## Create, update, and delete classification rules

### New-AzDataCatalogClassificationRule

**Syntax**:

```PowerShell
New-AzDataCatalogClassificationRule -Name <string> -ClassificationName <string>
-ColumnNamePatterns <string[]> -DataPatterns <string[]>
-RuleStatus {Enabled | Disabled} [-Description <string>]
[-MinimumDistinctMatchCount <int>] [-MinimumPercentageMatch <double>]
```

**Description**: Provide classification rule information to create a new classification rule.

**Parameters**:

- *Name*: The name of the classification rule. The maximum supported length is 100 characters.
- *Classification Name*: The name of the classification. The scanner applies it if a match is found.
- *ColumnNamePatterns*: The regular expression used to match against column names. The limit is large.
- *DataPatterns*: The regular expression used to match against the data that's stored in the data field. The limit is large.
- *RuleStatus*: The value that indicates whether the classification rule is enabled or disabled.
- *Description*: The description of the rule.
- *MinimumDistinctMatchCount*: The minimum number of distinct data values in a column needed for the scanner to run the data pattern on it. The range of allowed values is 2 to 32. The suggested value is 8. It can be manually adjusted. The value is intended to assure that the column contains enough data for the scanner to accurately classify it.
- *MinimumPercentageMatch*: The minimum percentage of value matches in a column for the classification. The suggested value is 60%. Take care with this setting—a value below 60% might introduce false-positive classifications into your catalog. If you specify multiple data patterns, this setting is disabled and the value is fixed at 60%.

**Example**:

```PowerShell
Set-AzDataCatalogClassificationRule -Name TestRule
-ClassificationName TestClassification -ColumnNamePatterns @('EmployeeId')
-DataPatterns @('^Employee[A-za-z0-9]') -RuleStatus Enabled
-Description 'TestClassificationRule' -MinimumDistinctMatchCount 8
-MinimumPercentageMatch 60
```

### Set-AzDataCatalogClassificationRule

**Syntax**:

```PowerShell
New-AzDataCatalogClassificationRule -Name <string> -ClassificationName <string>
-ColumnNamePatterns <string[]> -DataPatterns <string[]>
-RuleStatus {Enabled | Disabled} [-Description <string>]
[-MinimumDistinctMatchCount <int>] [-MinimumPercentageMatch <double>]
```

**Description**: Provide classification rule information to update a classification rule.

**Parameters**:

- *Name*: The name of the classification rule. The maximum supported length is 100 characters.
- *Classification Name*: The name of the classification. The scanner applies it if a match is found.
- *ColumnNamePatterns*: The regular expression used to match against column names. The limit is large.
- *DataPatterns*: The regular expression used to match against the data that's stored in the data field. The limit is large.
- *RuleStatus*: The value that indicates whether the classification rule is enabled or disabled.
- *Description*: The description of the rule.
- *MinimumDistinctMatchCount*: The minimum number of distinct data values in a column needed for the scanner to run the data pattern on it. The range of allowed values is 2 to 32. The suggested value is 8. It can be manually adjusted. The value is intended to assure that the column contains enough data for the scanner to accurately classify it.
- *MinimumPercentageMatch*: The minimum percentage of value matches in a column for the classification. The suggested value is 60%. Take care with this setting—a value below 60% might introduce false-positive classifications into your catalog. If you specify multiple data patterns, this setting is disabled and the value is fixed at 60%.

**Example**:

```PowerShell
Set-AzDataCatalogClassificationRule -Name TestRule
-ClassificationName TestClassification -ColumnNamePatterns @('EmployeeId')
-DataPatterns @('^Employee[A-za-z0-9]') -RuleStatus Enabled
-Description 'TestClassificationRule' -MinimumDistinctMatchCount 8
-MinimumPercentageMatch 60
```

### Remove-AzDataCatalogClassificationRule

**Syntax**:

```PowerShell
Remove-AzDataCatalogClassificationRule -Name <string>
```

**Description**: Provide the classification rule name to remove the rule.

**Parameters**:

- *Name*: The name of the classification rule.

**Example**:

```PowerShell
Remove-AzDataCatalogClassificationRule -Name TestRule
```

## Next steps

In this article, you learned how to use PowerShell cmdlets to register and scan an Azure data source.

Advance to the next article to learn how to create a scan rule set to quickly scan data sources.

> [!div class="nextstepaction"]
> [Create a scan rule set](create-a-scan-rule-set.md)
