---
title: PowerShell for DNS alias Azure SQL | Microsoft Docs
description: PowerShell cmdlets such as New-AzureRMSqlServerDNSAlias enable you to redirect new client connections to a different Azure SQL Database server, without having to touch any client configuration.
keywords: dns sql database
services: sql-database
ms.service: sql-database
ms.subservice: operations
ms.devlang: PowerShell
ms.topic: conceptual
author: DhruvMsft
ms.author: dmalik
ms.reviewer: genemi,amagarwa,maboja
manager: craigg
ms.date: 02/05/2018
---
# PowerShell for DNS Alias to Azure SQL Database

This article provides a PowerShell script that demonstrates how you can manage a DNS alias for Azure SQL Database. The script runs the following cmdlets which takes the following actions:


The cmdlets used in the code example are the following:
- [New-AzureRMSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/AzureRM.Sql/New-AzureRmSqlServerDnsAlias?view=azurermps-5.1.1): Creates a new DNS alias in the Azure SQL Database service system. The alias refers to Azure SQL Database server 1.
- [Get-AzureRMSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/AzureRM.Sql/Get-AzureRmSqlServerDnsAlias?view=azurermps-5.1.1): Get and list all the DNS aliases that are assigned to SQL DB server 1.
- [Set-AzureRMSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/AzureRM.Sql/Set-AzureRmSqlServerDnsAlias?view=azurermps-5.1.1): Modifies the server name that the alias is configured to refer to, from server 1 to SQL DB server 2.
- [Remove-AzureRMSqlServerDNSAlias](https://docs.microsoft.com/powershell/module/AzureRM.Sql/Remove-AzureRmSqlServerDnsAlias?view=azurermps-5.1.1): Remove the DNS alias from SQL DB server 2, by using the name of the alias.


The preceding PowerShell cmdlets were added to the **AzureRm.Sql** module starting with version 5.1.1.




#### DNS alias in connection string

To connect a particular Azure SQL Database server, a client such as SQL Server Management Studio (SSMS) can provide the DNS alias name instead of the true server name. In the following example server string, the alias *any-unique-alias-name* replaces the first dot-delimited node in the four node server string:
- Example server string: `any-unique-alias-name.database.windows.net`.



## Prerequisites

If you want to run the demo PowerShell script given in this article, the following prerequisites apply:

- An Azure subscription and account. For a free trial, click [https://azure.microsoft.com/free/][https://azure.microsoft.com/free/].

- Azure PowerShell module, with cmdlet **New-AzureRMSqlServerDNSAlias**.
    - To install or upgrade, see [Install Azure PowerShell module][install-azurerm-ps-84p].
    - Run `Get-Module -ListAvailable AzureRM;` in powershell\_ise.exe, to find the version.

- Two Azure SQL Database servers.

## Code example

The following PowerShell code example starts by assign literal values to several variables. To run the code, you must first edit all the placeholder values to match real values in your system. Or you can just study the code. And the console output of the code is also provided.


```powershell
################################################################
###    Assign prerequisites.                                 ###
################################################################
cls;

$SubscriptionName             = '<EDIT-your-subscription-name>';
[string]$SubscriptionGuid_Get = '?'; # The script assigns this value, not you.

$SqlServerDnsAliasName = '<EDIT-any-unique-alias-name>';

$1ResourceGroupName = '<EDIT-rg-1>';  # Can be same or different than $2ResourceGroupName.
$1SqlServerName     = '<EDIT-sql-1>'; # Must differ from $2SqlServerName.

$2ResourceGroupName = '<EDIT-rg-2>';
$2SqlServerName     = '<EDIT-sql-2>';

# Login to your Azure subscription, first time per session.
Write-Host "You must log into Azure once per powershell_ise.exe session,";
Write-Host "  thus type 'yes' only the first time.";
Write-Host " ";
$yesno = Read-Host '[yes/no]  Do you need to log into Azure now?';
if ('yes' -eq $yesno)
{
    Connect-AzureRmAccount -SubscriptionName $SubscriptionName;
}

$SubscriptionGuid_Get = Get-AzureRmSubscription `
    -SubscriptionName $SubscriptionName;

################################################################
###    Working with DNS aliasing for Azure SQL DB server.    ###
################################################################

Write-Host '[1] Assign a DNS alias to SQL DB server 1.';
New-AzureRMSqlServerDNSAlias `
    –ResourceGroupName  $1ResourceGroupName `
    -ServerName         $1SqlServerName `
    -ServerDNSAliasName $SqlServerDnsAliasName;

Write-Host '[2] Get and list all the DNS aliases that are assigned to SQL DB server 1.';
Get-AzureRMSqlServerDNSAlias `
    –ResourceGroupName $1ResourceGroupName `
    -ServerName        $1SqlServerName;

Write-Host '[3] Move the DNS alias from 1 to SQL DB server 2.';
Set-AzureRMSqlServerDNSAlias `
    –ResourceGroupName  $2ResourceGroupName `
    -NewServerName      $2SqlServerName `
    -ServerDNSAliasName $SqlServerDnsAliasName `
    -OldServerResourceGroup  $1ResourceGroupName `
    -OldServerName           $1SqlServerName `
    -OldServerSubscriptionId $SubscriptionGuid_Get;

# Here your client, such as SSMS, can connect to your "$2SqlServerName"
# by using "$SqlServerDnsAliasName" in the server name.
# For example, server:  "any-unique-alias-name.database.windows.net".

# Remove-AzureRMSqlServerDNSAlias  - would fail here for SQL DB server 1.

Write-Host '[4] Remove the DNS alias from SQL DB server 2.';
Remove-AzureRMSqlServerDNSAlias `
    –ResourceGroupName  $2ResourceGroupName `
    -ServerName         $2SqlServerName `
    -ServerDNSAliasName $SqlServerDnsAliasName;
```


#### Actual console output from the PowerShell example

The following console output was copied and pasted from an actual run.


```
You must log into Azure once per powershell_ise.exe session,
  thus type 'yes' only the first time.
 
[yes/no]  Do you need to log into Azure now?: yes


Environment           : AzureCloud
Account               : gm@acorporation.com
TenantId              : 72f988bf-1111-1111-1111-111111111111
SubscriptionId        : 45651c69-2222-2222-2222-222222222222
SubscriptionName      : mysubscriptionname
CurrentStorageAccount : 

 
[1] Assign a DNS alias to SQL DB server 1.
[2] Get the DNS alias that is assigned to SQL DB server 1.
[3] Move the DNS alias from 1 to SQL DB server 2.
[4] Remove the DNS alias from SQL DB server 2.
ResourceGroupName ServerName         ServerDNSAliasName    
----------------- ----------         ------------------    
gm-rg-dns-1       gm-sqldb-dns-1     unique-alias-name-food
gm-rg-dns-1       gm-sqldb-dns-1     unique-alias-name-food
gm-rg-dns-2       gm-sqldb-dns-2     unique-alias-name-food


[C:\windows\system32\]
>> 
```

## Next steps

For a full explanation of the DNS Alias feature for SQL Database, see [DNS alias for Azure SQL Database][dns-alias-overview-37v].



<!-- Article links. -->

[https://azure.microsoft.com/free/]: https://azure.microsoft.com/free/

[install-azurerm-ps-84p]: https://docs.microsoft.com/powershell/azure/install-azurerm-ps

[dns-alias-overview-37v]: dns-alias-overview.md

