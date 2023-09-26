---
title: 'Tutorial: Design a server - Azure PowerShell - Azure Database for MySQL'
description: This tutorial explains how to create and manage Azure Database for MySQL server and database using PowerShell.
ms.service: mysql
ms.subservice: single-server
ms.topic: tutorial
author: SudheeshGH
ms.author: sunaray
ms.devlang: azurepowershell
ms.custom: mvc, devx-track-azurepowershell
ms.date: 06/20/2022
---

# Tutorial: Design an Azure Database for MySQL using PowerShell

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

Azure Database for MySQL is a relational database service in the Microsoft cloud based on MySQL
Community Edition database engine. In this tutorial, you use PowerShell and other utilities to learn
how to:

> [!div class="checklist"]
> - Create an Azure Database for MySQL
> - Configure the server firewall
> - Use [mysql command-line tool](https://dev.mysql.com/doc/refman/5.6/en/mysql.html) to create a database
> - Load sample data
> - Query data
> - Update data
> - Restore data

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

If you choose to use PowerShell locally, this article requires that you install the Az PowerShell
module and connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) cmdlet. For more information
about installing the Az PowerShell module, see
[Install Azure PowerShell](/powershell/azure/install-azure-powershell).

> [!IMPORTANT]
> While the Az.MySql PowerShell module is in preview, you must install it separately from the Az
> PowerShell module using the following command: `Install-Module -Name Az.MySql -AllowPrerelease`.
> Once the Az.MySql PowerShell module is generally available, it becomes part of future Az
> PowerShell module releases and available natively from within Azure Cloud Shell.

If this is your first time using the Azure Database for MySQL service, you must register the
**Microsoft.DBforMySQL** resource provider.

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.DBforMySQL
```

[!INCLUDE [cloud-shell-try-it](../../../includes/cloud-shell-try-it.md)]

If you have multiple Azure subscriptions, choose the appropriate subscription in which the resources
should be billed. Select a specific subscription ID using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

```azurepowershell-interactive
Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
```

## Create a resource group

Create an [Azure resource group](../../azure-resource-manager/management/overview.md)
using the [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup) cmdlet. A
resource group is a logical container in which Azure resources are deployed and managed as a group.

The following example creates a resource group named **myresourcegroup** in the **West US** region.

```azurepowershell-interactive
New-AzResourceGroup -Name myresourcegroup -Location westus
```

## Create an Azure Database for MySQL server

Create an Azure Database for MySQL server with the `New-AzMySqlServer` cmdlet. A server can manage
multiple databases. Typically, a separate database is used for each project or for each user.

The following example creates a MySQL server in the **West US** region named **mydemoserver** in the
**myresourcegroup** resource group with a server admin login of **myadmin**. It is a Gen 5 server in
the general-purpose pricing tier with 2 vCores and geo-redundant backups enabled. Document the
password used in the first line of the example as this is the password for the MySQL server admin
account.

> [!TIP]
> A server name maps to a DNS name and must be globally unique in Azure.

```azurepowershell-interactive
$Password = Read-Host -Prompt 'Please enter your password' -AsSecureString
New-AzMySqlServer -Name mydemoserver -ResourceGroupName myresourcegroup -Sku GP_Gen5_2 -GeoRedundantBackup Enabled -Location westus -AdministratorUsername myadmin -AdministratorLoginPassword $Password
```

The **Sku** parameter value follows the convention **pricing-tier\_compute-generation\_vCores** as
shown in the following examples.

- `-Sku B_Gen5_1` maps to Basic, Gen 5, and 1 vCore. This option is the smallest SKU available.
- `-Sku GP_Gen5_32` maps to General Purpose, Gen 5, and 32 vCores.
- `-Sku MO_Gen5_2` maps to Memory Optimized, Gen 5, and 2 vCores.

For information about valid **Sku** values by region and for tiers, see
[Azure Database for MySQL pricing tiers](./concepts-pricing-tiers.md).

Consider using the basic pricing tier if light compute and I/O are adequate for your workload.

> [!IMPORTANT]
> Servers created in the basic pricing tier cannot be later scaled to general-purpose or memory-
> optimized and cannot be geo-replicated.

## Configure a firewall rule

Create an Azure Database for MySQL server-level firewall rule using the `New-AzMySqlFirewallRule`
cmdlet. A server-level firewall rule allows an external application, such as the `mysql`
command-line tool or MySQL Workbench to connect to your server through the Azure Database for MySQL
service firewall.

The following example creates a firewall rule named **AllowMyIP** that allows connections from a
specific IP address, 192.168.0.1. Substitute an IP address or range of IP addresses that correspond
to the location that you are connecting from.

```azurepowershell-interactive
New-AzMySqlFirewallRule -Name AllowMyIP -ResourceGroupName myresourcegroup -ServerName mydemoserver -StartIPAddress 192.168.0.1 -EndIPAddress 192.168.0.1
```

> [!NOTE]
> Connections to Azure Database for MySQL communicate over port 3306. If you try to connect from
> within a corporate network, outbound traffic over port 3306 might not be allowed. In this
> scenario, you can only connect to the server if your IT department opens port 3306.

## Get the connection information

To connect to your server, you need to provide host information and access credentials. Use the
following example to determine the connection information. Make a note of the values for
**FullyQualifiedDomainName** and **AdministratorLogin**.

```azurepowershell-interactive
Get-AzMySqlServer -Name mydemoserver -ResourceGroupName myresourcegroup |
  Select-Object -Property FullyQualifiedDomainName, AdministratorLogin
```

```Output
FullyQualifiedDomainName                    AdministratorLogin
------------------------                    ------------------
mydemoserver.mysql.database.azure.com       myadmin
```

## Connect to the server using the mysql command-line tool

Connect to your server using the `mysql` command-line tool. To download and install the command-line
tool, see [MySQL Community Downloads](https://dev.mysql.com/downloads/shell/). You can also access a
pre-installed version of the `mysql` command-line tool in Azure Cloud Shell by selecting the **Try
It** button on a code sample in this article. Other ways to access Azure Cloud Shell are to select
the **>_** button on the upper-right toolbar in the Azure portal or by visiting
[shell.azure.com](https://shell.azure.com/).

```azurepowershell-interactive
mysql -h mydemoserver.mysql.database.azure.com -u myadmin@mydemoserver -p
```

## Create a database

Once you’re connected to the server, create a blank database.

```sql
mysql> CREATE DATABASE mysampledb;
```

At the prompt, run the following command to switch the connection to this newly created database:

```sql
mysql> USE mysampledb;
```

## Create tables in the database

Now that you know how to connect to the Azure Database for MySQL database, complete some basic
tasks.

First, create a table and load it with some data. Let's create a table that stores inventory
information.

```sql
CREATE TABLE inventory (
  id serial PRIMARY KEY,
  name VARCHAR(50),
  quantity INTEGER
);
```

## Load data into the tables

Now that you have a table, insert some data into it. At the open command prompt window, run the
following query to insert some rows of data.

```sql
INSERT INTO inventory (id, name, quantity) VALUES (1, 'banana', 150);
INSERT INTO inventory (id, name, quantity) VALUES (2, 'orange', 154);
```

Now you have two rows of sample data into the table you created earlier.

## Query and update the data in the tables

Execute the following query to retrieve information from the database table.

```sql
SELECT * FROM inventory;
```

You can also update the data in the tables.

```sql
UPDATE inventory SET quantity = 200 WHERE name = 'banana';
```

The row gets updated accordingly when you retrieve data.

```sql
SELECT * FROM inventory;
```

## Restore a database to a previous point in time

You can restore the server to a previous point-in-time. The restored data is copied to a new server,
and the existing server is left unchanged. For example, if a table is accidentally dropped, you can
restore to the time just the drop occurred. Then, you can retrieve the missing table and data from
the restored copy of the server.

To restore the server, use the `Restore-AzMySqlServer` PowerShell cmdlet.

### Run the restore command

To restore the server, run the following example from PowerShell.

```azurepowershell-interactive
$restorePointInTime = (Get-Date).AddMinutes(-10)
Get-AzMySqlServer -Name mydemoserver -ResourceGroupName myresourcegroup |
  Restore-AzMySqlServer -Name mydemoserver-restored -ResourceGroupName myresourcegroup -RestorePointInTime $restorePointInTime -UsePointInTimeRestore
```

When you restore a server to an earlier point-in-time, a new server is created. The original server
and its databases from the specified point-in-time are copied to the new server.

The location and pricing tier values for the restored server remain the same as the original server.

After the restore process finishes, locate the new server and verify that the data is restored as
expected. The new server has the same server admin login name and password that was valid for the
existing server at the time the restore was started. The password can be changed from the new
server's **Overview** page.

The new server created during a restore does not have the VNet service endpoints that existed on the
original server. These rules must be set up separately for the new server. Firewall rules from the
original server are restored.

## Clean up resources

If the resources created in this tutorial aren't needed for another quickstart or tutorial, you
can delete them by running the following example.

> [!CAUTION]
> The following example deletes the specified resource group and all resources contained within it.
> If resources outside the scope of this tutorial exist in the specified resource group, they will
> also be deleted.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myresourcegroup
```

To delete only the server created in this tutorial without deleting the resource group, use the
`Remove-AzMySqlServer` cmdlet.

```azurepowershell-interactive
Remove-AzMySqlServer -Name mydemoserver -ResourceGroupName myresourcegroup
```

## Next steps

> [!div class="nextstepaction"]
> [How to back up and restore an Azure Database for MySQL server using PowerShell](how-to-restore-server-powershell.md)