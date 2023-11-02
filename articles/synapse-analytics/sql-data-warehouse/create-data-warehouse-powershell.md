---
title: "Quickstart: Create a dedicated SQL pool (formerly SQL DW) with Azure PowerShell"
description: Quickly create a dedicated SQL pool (formerly SQL DW) with a server-level firewall rule using Azure PowerShell.
author: joannapea
ms.author: joanpo
ms.reviewer: wiassaf
ms.date: 4/11/2019
ms.service: synapse-analytics
ms.subservice: sql-dw
ms.topic: quickstart
ms.custom:
  - devx-track-azurepowershell
  - seo-lt-2019
  - azure-synapse
  - mode-api
---

# Quickstart: Create a dedicated SQL pool (formerly SQL DW) with Azure PowerShell

Create an dedicated SQL pool (formerly SQL DW) in Azure Synapse Analytics using Azure PowerShell.

## Prerequisites

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

> [!IMPORTANT]
> Creating a dedicated SQL pool (formerly SQL DW) may result in a new billable service.  For more information, see [Azure Synapse Analytics pricing](https://azure.microsoft.com/pricing/details/sql-data-warehouse/).

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

## Sign in to Azure

Sign in to your Azure subscription using the [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) command and follow the on-screen directions.

```powershell
Connect-AzAccount
```

To see which subscription you're using, run [Get-AzSubscription](/powershell/module/az.accounts/get-azsubscription?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

```powershell
Get-AzSubscription
```

If you need to use a different subscription than the default, run [Set-AzContext](/powershell/module/az.accounts/set-azcontext?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

```powershell
Set-AzContext -SubscriptionName "MySubscription"
```

## Create variables

Define variables for use in the scripts in this quickstart.

```powershell
# The data center and resource name for your resources
$resourcegroupname = "myResourceGroup"
$location = "WestEurope"
# The server name: Use a random value or replace with your own value (don't capitalize)
$servername = "server-$(Get-Random)"
# Set an admin name and password for your database
# The sign-in information for the server
$adminlogin = "ServerAdmin"
$password = "ChangeYourAdminPassword1"
# The ip address range that you want to allow to access your server - change as appropriate
$startip = "0.0.0.0"
$endip = "0.0.0.0"
# The database name
$databasename = "mySampleDataWarehouse"
```

## Create a resource group

Create an [Azure resource group](../../azure-resource-manager/management/overview.md?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) command. A resource group is a container into which Azure resources are deployed and managed as a group. The following example creates a resource group named `myResourceGroup` in the `westeurope` location.

```powershell
New-AzResourceGroup -Name $resourcegroupname -Location $location
```

## Create a server

Create a [logical SQL server](/azure/azure-sql/database/logical-servers?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) using the [New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) command. A server contains a group of databases managed as a group. The following example creates a randomly named server in your resource group with an admin user named `ServerAdmin` and a password of `ChangeYourAdminPassword1`. Replace these pre-defined values as desired.

```powershell
New-AzSqlServer -ResourceGroupName $resourcegroupname `
    -ServerName $servername `
    -Location $location `
    -SqlAdministratorCredentials $(New-Object -TypeName System.Management.Automation.PSCredential -ArgumentList $adminlogin, $(ConvertTo-SecureString -String $password -AsPlainText -Force))
```

## Configure a server-level firewall rule

Create an [server-level firewall rule](/azure/azure-sql/database/firewall-configure?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) using the [New-AzSqlServerFirewallRule](/powershell/module/az.sql/new-azsqlserverfirewallrule?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json) command. A server-level firewall rule allows an external application, such as SQL Server Management Studio or the SQLCMD utility to connect to a dedicated SQL pool (formerly SQL DW) through the dedicated SQL pool service firewall.

In the following example, the firewall is only opened for other Azure resources. To enable external connectivity, change the IP address to an appropriate address for your environment. To open all IP addresses, use 0.0.0.0 as the starting IP address and 255.255.255.255 as the ending address.

```powershell
New-AzSqlServerFirewallRule -ResourceGroupName $resourcegroupname `
    -ServerName $servername `
    -FirewallRuleName "AllowSome" -StartIpAddress $startip -EndIpAddress $endip
```

> [!NOTE]
> SQL endpoints communicate over port 1433. If you're trying to connect from within a corporate network, outbound traffic over port 1433 may not be allowed by your network's firewall. If so, you won't be able to connect to your server unless your IT department opens port 1433.
>

## Create a dedicated SQL pool (formerly SQL DW)

The following example creates a dedicated SQL pool (formerly SQL DW) using the previously defined variables.  It specifies the service objective as DW100c, which is a lower-cost starting point for your dedicated SQL pool (formerly SQL DW).

```powershell
New-AzSqlDatabase `
    -ResourceGroupName $resourcegroupname `
    -ServerName $servername `
    -DatabaseName $databasename `
    -Edition "DataWarehouse" `
    -RequestedServiceObjectiveName "DW100c" `
    -CollationName "SQL_Latin1_General_CP1_CI_AS" `
    -MaxSizeBytes 10995116277760
```

Required Parameters are:

* **RequestedServiceObjectiveName**: The amount of [data warehouse units](what-is-a-data-warehouse-unit-dwu-cdwu.md) you're requesting. Increasing this amount increases compute cost. For a list of supported values, see [memory and concurrency limits](memory-concurrency-limits.md).
* **DatabaseName**: The name of the dedicated SQL pool (formerly SQL DW) that you're creating.
* **ServerName**: The name of the server that you're using for creation.
* **ResourceGroupName**: Resource group you're using. To find available resource groups in your subscription use Get-AzureResource.
* **Edition**: Must be "DataWarehouse" to create a dedicated SQL pool (formerly SQL DW).

Optional Parameters are:

* **CollationName**: The default collation if not specified is SQL_Latin1_General_CP1_CI_AS. Collation can't be changed on a database.
* **MaxSizeBytes**: The default max size of a database is 240TB. The max size limits rowstore data. There is unlimited storage for columnar data.

For more information on the parameter options, see [New-AzSqlDatabase](/powershell/module/az.sql/new-azsqldatabase?toc=/azure/synapse-analytics/sql-data-warehouse/toc.json&bc=/azure/synapse-analytics/sql-data-warehouse/breadcrumb/toc.json).

## Clean up resources

Other quickstart tutorials in this collection build upon this quickstart.

> [!TIP]
> If you plan to continue on to work with later quickstart tutorials, don't clean up the resources created in this quickstart. If you don't plan to continue, use the following steps to delete all resources created by this quickstart in the Azure portal.
>

```powershell
Remove-AzResourceGroup -ResourceGroupName $resourcegroupname
```

## Next steps

You've now created a dedicated SQL pool (formerly SQL DW), created a firewall rule, and connected to your dedicated SQL pool. To learn more, continue to the [Load data into a dedicated SQL pool](./load-data-from-azure-blob-storage-using-copy.md) article.
