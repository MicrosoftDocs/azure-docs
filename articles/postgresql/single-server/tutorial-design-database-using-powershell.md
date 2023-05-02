---
title: 'Tutorial: Design an Azure Database for PostgreSQL - Single Server - Azure PowerShell'
description: This tutorial shows how to create, configure, and query your first Azure Database for PostgreSQL - Single Server using Azure PowerShell.
ms.service: postgresql
ms.subservice: single-server
ms.topic: tutorial
ms.author: sunila
author: sunilagarwal
ms.devlang: azurepowershell
ms.custom: mvc, devx-track-azurepowershell
ms.date: 06/24/2022
---

# Tutorial: Design an Azure Database for PostgreSQL - Single Server using PowerShell

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

Azure Database for PostgreSQL is a relational database service in the Microsoft cloud based on PostgreSQL
Community Edition database engine. In this tutorial, you use PowerShell and other utilities to learn
how to:

> [!div class="checklist"]
> - Create an Azure Database for PostgreSQL
> - Configure the server firewall
> - Use [**psql**](https://www.postgresql.org/docs/9.6/static/app-psql.html) utility to create a database
> - Load sample data
> - Query data
> - Update data
> - Restore data

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account
before you begin.

If you choose to use PowerShell locally, this article requires that you install the Az PowerShell
module and connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount)
cmdlet. For more information about installing the Az PowerShell module, see
[Install Azure PowerShell](/powershell/azure/install-az-ps).

> [!IMPORTANT]
> While the Az.PostgreSql PowerShell module is in preview, you must install it separately from the Az
> PowerShell module using the following command: `Install-Module -Name Az.PostgreSql -AllowPrerelease`.
> Once the Az.PostgreSql PowerShell module is generally available, it becomes part of future Az
> PowerShell module releases and available natively from within Azure Cloud Shell.

If this is your first time using the Azure Database for PostgreSQL service, you must register the
**Microsoft.DBforPostgreSQL** resource provider.

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.DBforPostgreSQL
```

[!INCLUDE [cloud-shell-try-it](../../../includes/cloud-shell-try-it.md)]

If you have multiple Azure subscriptions, choose the appropriate subscription in which the resources
should be billed. Select a specific subscription ID using the
[Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet.

```azurepowershell-interactive
Set-AzContext -SubscriptionId 00000000-0000-0000-0000-000000000000
```

## Create a resource group

Create an
[Azure resource group](../../azure-resource-manager/management/overview.md)
using the
[New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup)
cmdlet. A resource group is a logical container in which Azure resources are deployed and managed as
a group.

The following example creates a resource group named **myresourcegroup** in the **West US** region.

```azurepowershell-interactive
New-AzResourceGroup -Name myresourcegroup -Location westus
```

## Create an Azure Database for PostgreSQL server

Create an Azure Database for PostgreSQL server with the `New-AzPostgreSqlServer` cmdlet. A server can manage
multiple databases. Typically, a separate database is used for each project or for each user.

The following example creates a PostgreSQL server in the **West US** region named **mydemoserver** in the
**myresourcegroup** resource group with a server admin login of **myadmin**. It is a Gen 5 server in
the general-purpose pricing tier with 2 vCores and geo-redundant backups enabled. Document the
password used in the first line of the example as this is the password for the PostgreSQL server admin
account.

> [!TIP]
> A server name maps to a DNS name and must be globally unique in Azure.

```azurepowershell-interactive
$Password = Read-Host -Prompt 'Please enter your password' -AsSecureString
New-AzPostgreSqlServer -Name mydemoserver -ResourceGroupName myresourcegroup -Sku GP_Gen5_2 -GeoRedundantBackup Enabled -Location westus -AdministratorUsername myadmin -AdministratorLoginPassword $Password
```

The **Sku** parameter value follows the convention **pricing-tier\_compute-generation\_vCores** as
shown in the following examples.

- `-Sku B_Gen5_1` maps to Basic, Gen 5, and 1 vCore. This option is the smallest SKU available.
- `-Sku GP_Gen5_32` maps to General Purpose, Gen 5, and 32 vCores.
- `-Sku MO_Gen5_2` maps to Memory Optimized, Gen 5, and 2 vCores.

For information about valid **Sku** values by region and for tiers, see
[Azure Database for PostgreSQL pricing tiers](./concepts-pricing-tiers.md).

Consider using the basic pricing tier if light compute and I/O are adequate for your workload.

> [!IMPORTANT]
> Servers created in the basic pricing tier cannot be later scaled to general-purpose or memory-
> optimized and cannot be geo-replicated.

## Configure a firewall rule

Create an Azure Database for PostgreSQL server-level firewall rule using the `New-AzPostgreSqlFirewallRule`
cmdlet. A server-level firewall rule allows an external application, such as the `psql`
command-line tool or PostgreSQL Workbench to connect to your server through the Azure Database for PostgreSQL
service firewall.

The following example creates a firewall rule named **AllowMyIP** that allows connections from a
specific IP address, 192.168.0.1. Substitute an IP address or range of IP addresses that correspond
to the location that you are connecting from.

```azurepowershell-interactive
New-AzPostgreSqlFirewallRule -Name AllowMyIP -ResourceGroupName myresourcegroup -ServerName mydemoserver -StartIPAddress 192.168.0.1 -EndIPAddress 192.168.0.1
```

> [!NOTE]
> Connections to Azure Database for PostgreSQL communicate over port 5432. If you try to connect from
> within a corporate network, outbound traffic over port 5432 might not be allowed. In this
> scenario, you can only connect to the server if your IT department opens port 5432.

## Get the connection information

To connect to your server, you need to provide host information and access credentials. Use the
following example to determine the connection information. Make a note of the values for
**FullyQualifiedDomainName** and **AdministratorLogin**.

```azurepowershell-interactive
Get-AzPostgreSqlServer -Name mydemoserver -ResourceGroupName myresourcegroup |
  Select-Object -Property FullyQualifiedDomainName, AdministratorLogin
```

```Output
FullyQualifiedDomainName                    AdministratorLogin
------------------------                    ------------------
mydemoserver.postgresql.database.azure.com       myadmin
```

## Connect to PostgreSQL database using psql

If your client computer has PostgreSQL installed, you can use a local instance of
[psql](https://www.postgresql.org/docs/current/static/app-psql.html) to connect to an Azure
PostgreSQL server. You can also access a pre-installed version of the `psql` command-line tool in
Azure Cloud Shell by selecting the **Try It** button on a code sample in this article. Other ways to
access Azure Cloud Shell are to select the **>_** button on the upper-right toolbar in the Azure
portal or by visiting [shell.azure.com](https://shell.azure.com/).

1. Connect to your Azure PostgreSQL server using the `psql` command-line utility.

   ```azurepowershell-interactive
   psql --host=<servername> --port=<port> --username=<user@servername> --dbname=<dbname>
   ```

   For example, the following command connects to the default database called **postgres** on your
   PostgreSQL server `mydemoserver.postgres.database.azure.com` using access credentials. Enter
   the `<server_admin_password>` you chose when prompted for password.

   ```azurepowershell-interactive
   psql --host=mydemoserver.postgres.database.azure.com --port=5432 --username=myadmin@mydemoserver --dbname=postgres
   ```

   > [!TIP]
   > If you prefer to use a URL path to connect to Postgres, URL encode the @ sign in the username
   > with `%40`. For example the connection string for psql would be,
   > `psql postgresql://myadmin%40mydemoserver@mydemoserver.postgres.database.azure.com:5432/postgres`

1. Once you are connected to the server, create a blank database at the prompt.

   ```sql
   CREATE DATABASE mypgsqldb;
   ```

1. At the prompt, execute the following command to switch connection to the newly created database **mypgsqldb**:

   ```sql
   \c mypgsqldb
   ```

## Create tables in the database

Now that you know how to connect to the Azure Database for PostgreSQL database, complete some basic
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

To restore the server, use the `Restore-AzPostgreSqlServer` PowerShell cmdlet.

### Run the restore command

To restore the server, run the following example from PowerShell.

```azurepowershell-interactive
$restorePointInTime = (Get-Date).AddMinutes(-10)
Get-AzPostgreSqlServer -Name mydemoserver -ResourceGroupName myresourcegroup |
  Restore-AzPostgreSqlServer -Name mydemoserver-restored -ResourceGroupName myresourcegroup -RestorePointInTime $restorePointInTime -UsePointInTimeRestore
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

In the preceding steps, you created Azure resources in a server group. If you don't expect to need these resources in the future, delete the server group. Press the *Delete* button in the *Overview* page for your server group. When prompted on a pop-up page, confirm the name of the server group and select the final *Delete* button.

## Next steps

> [!div class="nextstepaction"]
> [How to back up and restore an Azure Database for PostgreSQL server using PowerShell](how-to-restore-server-powershell.md)
