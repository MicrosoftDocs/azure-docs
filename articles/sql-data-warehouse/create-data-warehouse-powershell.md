---
title: 'Quickstart: Create an Azure SQL Data Warehouse - Azure Powershell | Microsoft Docs'
description: Quickly create a SQL Database logical server, server-level firewall rule, and data warehouse with Azure PowerShell.
services: sql-data-warehouse
author: kevinvngo
manager: craigg
ms.service: sql-data-warehouse
ms.topic: conceptual
ms.component: manage
ms.date: 08/01/2018
ms.author: kevin
ms.reviewer: igorstan
---

# Quickstart: Create and query an Azure SQL data warehouse with Azure PowerShell

Quickly create an Azure SQL data warehouse using Azure PowerShell.

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

This tutorial requires Azure PowerShell module version 5.1.1 or later. Run `Get-Module -ListAvailable AzureRM` to find the version you have currently. If you need to install or upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). 


> [!NOTE]
> Creating a SQL Data Warehouse may result in a new billable service.  For more information, see [SQL Data Warehouse pricing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/).
>
>

## Log in to Azure

Log in to your Azure subscription using the [Add-AzureRmAccount](/powershell/module/azurerm.profile/add-azurermaccount) command and follow the on-screen directions.

```powershell
Add-AzureRmAccount
```

To see which subscription you are using, run [Get-AzureRmSubscription](/powershell/module/azurerm.profile/get-azurermsubscription).

```powershell
Get-AzureRmSubscription
```

If you need to use a different subscription than the default, run [Select-AzureRmSubscription](/powershell/module/azurerm.profile/select-azurermsubscription).

```powershell
Select-AzureRmSubscription -SubscriptionName "MySubscription"
```


## Create variables

Define variables for use in the scripts in this quickstart.

```powershell
# The data center and resource name for your resources
$resourcegroupname = "myResourceGroup"
$location = "WestEurope"
# The logical server name: Use a random value or replace with your own value (do not capitalize)
$servername = "server-$(Get-Random)"
# Set an admin login and password for your database
# The login information for the server
$adminlogin = "ServerAdmin"
$password = "ChangeYourAdminPassword1"
# The ip address range that you want to allow to access your server - change as appropriate
$startip = "0.0.0.0"
$endip = "0.0.0.0"
# The database name
$databasename = "mySampleDataWarehosue"
```

## Create a resource group

Create an [Azure resource group](../azure-resource-manager/resource-group-overview.md) using the [New-AzureRmResourceGroup](/powershell/module/azurerm.resources/new-azurermresourcegroup) command. A resource group is a logical container into which Azure resources are deployed and managed as a group. The following example creates a resource group named `myResourceGroup` in the `westeurope` location.

```powershell
New-AzureRmResourceGroup -Name $resourcegroupname -Location $location
```
## Create a logical server

Create an [Azure SQL logical server](../sql-database/sql-database-logical-servers.md) using the [New-AzureRmSqlServer](/powershell/module/azurerm.sql/new-azurermsqlserver) command. A logical server contains a group of databases managed as a group. The following example creates a randomly named server in your resource group with an admin login named `ServerAdmin` and a password of `ChangeYourAdminPassword1`. Replace these pre-defined values as desired.

```powershell
New-AzureRmSqlServer -ResourceGroupName $resourcegroupname `
    -ServerName $servername `
    -Location $location `
    -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $adminlogin, $(ConvertTo-SecureString -String $password -AsPlainText -Force))
```

## Configure a server firewall rule

Create an [Azure SQL server-level firewall rule](../sql-database/sql-database-firewall-configure.md) using the [New-AzureRmSqlServerFirewallRule](/powershell/module/azurerm.sql/new-azurermsqlserverfirewallrule) command. A server-level firewall rule allows an external application, such as SQL Server Management Studio or the SQLCMD utility to connect to a SQL data warehouse through the SQL Data Warehouse service firewall. In the following example, the firewall is only opened for other Azure resources. To enable external connectivity, change the IP address to an appropriate address for your environment. To open all IP addresses, use 0.0.0.0 as the starting IP address and 255.255.255.255 as the ending address.

```powershell
New-AzureRmSqlServerFirewallRule -ResourceGroupName $resourcegroupname `
    -ServerName $servername `
    -FirewallRuleName "AllowSome" -StartIpAddress $startip -EndIpAddress $endip
```

> [!NOTE]
> SQL Database and SQL Data Warehouse communicate over port 1433. If you are trying to connect from within a corporate network, outbound traffic over port 1433 may not be allowed by your network's firewall. If so, you will not be able to connect to your Azure SQL server unless your IT department opens port 1433.
>


## Create a data warehouse with sample data
This example creates a data warehouse using the previously defined variables.  It specifies the service objective as DW400, which is a lower-cost starting point for your data warehouse. 

```Powershell
New-AzureRmSqlDatabase `
    -ResourceGroupName $resourcegroupname `
    -ServerName $servername `
    -DatabaseName $databasename `
    -Edition "DataWarehouse" `
    -RequestedServiceObjectiveName "DW400" `
    -CollationName "SQL_Latin1_General_CP1_CI_AS" `
    -MaxSizeBytes 10995116277760
```

Required Parameters are:

* **RequestedServiceObjectiveName**: The amount of [data warehouse units](what-is-a-data-warehouse-unit-dwu-cdwu.md) you are requesting. Increasing this amount increases compute cost. For a list of supported values, see [memory and concurrency limits](memory-and-concurrency-limits.md).
* **DatabaseName**: The name of the SQL Data Warehouse that you are creating.
* **ServerName**: The name of the server that you are using for creation.
* **ResourceGroupName**: Resource group you are using. To find available resource groups in your subscription use Get-AzureResource.
* **Edition**: Must be "DataWarehouse" to create a SQL Data Warehouse.

Optional Parameters are:

- **CollationName**: The default collation if not specified is SQL_Latin1_General_CP1_CI_AS. Collation cannot be changed on a database.
- **MaxSizeBytes**: The default max size of a database is 10 GB.

For more information on the parameter options, see [New-AzureRmSqlDatabase](/powershell/module/azurerm.sql/new-azurermsqldatabase).


## Clean up resources

Other quickstart tutorials in this collection build upon this quickstart. 

> [!TIP]
> If you plan to continue on to work with subsequent quickstart tutorials, do not clean up the resources created in this quickstart. If you do not plan to continue, use the following steps to delete all resources created by this quickstart in the Azure portal.
>

```powershell
Remove-AzureRmResourceGroup -ResourceGroupName $resourcegroupname
```

## Next steps

You have now created a data warehouse, created a firewall rule, connected to your data warehouse, and run a few queries. To learn more about Azure SQL Data Warehouse, continue to the tutorial for loading data.
> [!div class="nextstepaction"]
>[Load data into a SQL data warehouse](load-data-from-azure-blob-storage-using-polybase.md)
