---
title: 'Azure PowerShell: Create a single SQL database | Microsoft Docs'
description: Learn how to create a SQL Database logical server, server-level firewall rule, and databases in the Azure portal.
keywords: sql database tutorial, create a sql database
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: sql-database
ms.custom: quick start
ms.workload: data-management
ms.tgt_pltfrm: na
ms.devlang: PowerShell
ms.topic: hero-article
ms.date: 03/13/2017
ms.author: carlrab
---

# Create a single Azure SQL database using PowerShell

PowerShell is used to create and manage Azure resources from the command line or in scripts. This guide details using PowerShell to deploy an Azure SQL database in an Azure resource group in a SQL Database logical server.

Before you start, make sure that the latest version of PowerShell is installed. Azure CLI has been installed. For detailed information, see [How to install and configure Azure PowerShell](/powershell/azureps-cmdlets-docs). 

## Log in to Azure

Log in to your Azure subscription with the [Add-AzureRmAccount](https://docs.microsoft.com/en-us/powershell/resourcemanager/azurerm.profile/v2.5.0/add-azurermaccount) command and follow the on-screen directions.

```powershell
Add-AzureRmAccount
```

## Create a resource group

Create a resource group with the [New-AzureRmResourceGroup](https://docs.microsoft.com/powershell/resourcemanager/azurerm.resources/v3.5.0/new-azurermresourcegroup) command. An Azure resource group is a logical container into which Azure resources are deployed and managed. The following example creates a resource group named `myResourceGroup` in the `northcentralus` location.

```powershell
New-AzureRmResourceGroup -Name "myResourceGroup" -Location "northcentralus"
```
## Create a logical server

Create a SQL Database logical server with the [New-AzureRmSqlServer](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.5.0/new-azurermsqlserver) command. The following example creates a randomly-named server in your resource group with an admin login named `ServerAdmin` and a password of `ChangeYourAdminPassword1`. Replace these pre-defined values as desired.

```powershell
$servername = "server-$(Get-Random)"
New-AzureRmSqlServer -ResourceGroupName "myResourceGroup" `
    -ServerName $servername `
    -Location "northcentralus" `
    -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList "ServerAdmin", $(ConvertTo-SecureString -String "ChangeYourAdminPassword1" -AsPlainText -Force))
```

## Configure a server firewall rule

Create a SQL Database server-level firewall rule with the [New-AzureRmSqlServerFirewallRule](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.5.0/new-azurermsqlserverfirewallrule) command. A server-level firewall rule allows an external application, such as SQL Server Management Studio or the SQLCMD utility to connect to a SQL database through the SQL Database service firewall. The following example creates a firewall rule for a predefined address range, which, in this example, is the entire possible range of IP addresses. Replace these predefined values with the values for your external IP address or IP address range. 

```powershell
New-AzureRmSqlServerFirewallRule -ResourceGroupName "myResourceGroup" `
    -ServerName $servername `
    -FirewallRuleName "AllowSome" -StartIpAddress "0.0.0.0" -EndIpAddress "255.255.255.255"
```

## Create a blank database

Create a blank SQL database with an S0 performance level in the server with the [New-AzureRmSqlDatabase](https://docs.microsoft.com/powershell/resourcemanager/azurerm.sql/v2.5.0/new-azurermsqldatabase) command. The following example creates a database called `mySampleDatabase`. Replace this predefined value as desired.

```powershell
New-AzureRmSqlDatabase  -ResourceGroupName "myResourceGroup" `
    -ServerName $servername `
    -DatabaseName "MySampleDatabase" `
    -RequestedServiceObjectiveName "S0"
```

## Clean up resources

To remove all the resources created by this QuickStart, run the following command:

```powershell
Remove-AzureRmResourceGroup -ResourceGroupName "myResourceGroup"
```

## Next steps

- To connect and query using SQL Server Management Studio, see [Connect and query with SSMS](sql-database-connect-query-ssms.md)
- To connect using Visual Studio, see [Connect and query with Visual Studio](sql-database-connect-query.md).
* For a technical overview of SQL Database, see [About the SQL Database service](sql-database-technical-overview.md).
