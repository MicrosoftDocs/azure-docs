---
title: 'Quickstart: Create a server - Azure PowerShell - Azure Database for MySQL'
description: This quickstart describes how to use PowerShell to create an Azure Database for MySQL server in an Azure resource group.
ms.service: mysql
ms.subservice: single-server
author: SudheeshGH
ms.author: sunaray
ms.devlang: azurepowershell
ms.topic: quickstart
ms.date: 06/20/2022
ms.custom: mvc, devx-track-azurepowershell, mode-api
---

# Quickstart: Create an Azure Database for MySQL server using PowerShell

[!INCLUDE[applies-to-mysql-single-server](../includes/applies-to-mysql-single-server.md)]

[!INCLUDE[azure-database-for-mysql-single-server-deprecation](../includes/azure-database-for-mysql-single-server-deprecation.md)]

This quickstart describes how to use PowerShell to create an Azure Database for MySQL server in an
Azure resource group. You can use PowerShell to create and manage Azure resources interactively or
in scripts.

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

The following table contains a list of commonly used parameters and sample values for the
`New-AzMySqlServer` cmdlet.

|        **Setting**         | **Sample value** |                                                                                                                                                             **Description**                                                                                                                                                              |
| -------------------------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name                       | mydemoserver     | Choose a globally unique name in Azure that identifies your Azure Database for MySQL server. The server name can only contain letters, numbers, and the hyphen (-) character. Any uppercase characters that are specified are automatically converted to lowercase during the creation process. It must contain from 3 to 63 characters. |
| ResourceGroupName          | myresourcegroup  | Provide the name of the Azure resource group.                                                                                                                                                                                                                                                                                            |
| Sku                        | GP_Gen5_2        | The name of the SKU. Follows the convention **pricing-tier\_compute-generation\_vCores** in shorthand. For more information about the Sku parameter, see the information following this table.                                                                                                                                           |
| BackupRetentionDay         | 7                | How long a backup should be retained. Unit is days. Range is 7-35.                                                                                                                                                                                                                                                                       |
| GeoRedundantBackup         | Enabled          | Whether geo-redundant backups should be enabled for this server or not. This value cannot be enabled for servers in the basic pricing tier and it cannot be changed after the server is created. Allowed values: Enabled, Disabled.                                                                                                      |
| Location                   | westus           | The Azure region for the server.                                                                                                                                                                                                                                                                                                         |
| SslEnforcement             | Enabled          | Whether SSL should be enabled or not for this server. Allowed values: Enabled, Disabled.                                                                                                                                                                                                                                                 |
| StorageInMb                | 51200            | The storage capacity of the server (unit is megabytes). Valid StorageInMb is a minimum of 5120 MB and increases in 1024 MB increments. For more information about storage size limits, see [Azure Database for MySQL pricing tiers](./concepts-pricing-tiers.md).                                                                               |
| Version                    | 5.7              | The MySQL major version.                                                                                                                                                                                                                                                                                                                 |
| AdministratorUserName      | myadmin          | The username for the administrator login. It cannot be **azure_superuser**, **admin**, **administrator**, **root**, **guest**, or **public**.                                                                                                                                                                                            |
| AdministratorLoginPassword | `<securestring>` | The password of the administrator user in the form of a secure string. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers, and non-alphanumeric characters.                                       |

The **Sku** parameter value follows the convention **pricing-tier\_compute-generation\_vCores** as
shown in the following examples.

- `-Sku B_Gen5_1` maps to Basic, Gen 5, and 1 vCore. This option is the smallest SKU available.
- `-Sku GP_Gen5_32` maps to General Purpose, Gen 5, and 32 vCores.
- `-Sku MO_Gen5_2` maps to Memory Optimized, Gen 5, and 2 vCores.

For information about valid **Sku** values by region and for tiers, see
[Azure Database for MySQL pricing tiers](./concepts-pricing-tiers.md).

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

## Configure SSL settings

By default, SSL connections between your server and client applications are enforced. This default
ensures the security of _in-motion_ data by encrypting the data stream over the Internet. For this
quickstart, disable SSL connections for your server. For more information, see
[Configure SSL connectivity in your application to securely connect to Azure Database for MySQL](./how-to-configure-ssl.md).

> [!WARNING]
> Disabling SSL is not recommended for production servers.

The following example disables SSL on your Azure Database for MySQL server.

```azurepowershell-interactive
Update-AzMySqlServer -Name mydemoserver -ResourceGroupName myresourcegroup -SslEnforcement Disabled
```

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

1. Connect to the server using the `mysql` command-line tool.

   ```azurepowershell-interactive
   mysql -h mydemoserver.mysql.database.azure.com -u myadmin@mydemoserver -p
   ```

1. View server status.

   ```sql
   mysql> status
   ```

    ```Output
    C:\Users\>mysql -h mydemoserver.mysql.database.azure.com -u myadmin@mydemoserver -p
    Enter password: *************
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 65512
    Server version: 5.6.42.0 MySQL Community Server (GPL)

    Copyright (c) 2000, 2020, Oracle and/or its affiliates. All rights reserved.

    Oracle is a registered trademark of Oracle Corporation and/or its
    affiliates. Other names may be trademarks of their respective
    owners.

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

    mysql> status
    --------------
    mysql  Ver 14.14 Distrib 5.7.29, for Win64 (x86_64)

    Connection id:          65512
    Current database:
    Current user:           myadmin@myipaddress
    SSL:                    Not in use
    Using delimiter:        ;
    Server version:         5.6.42.0 MySQL Community Server (GPL)
    Protocol version:       10
    Connection:             mydemoserver.mysql.database.azure.com via TCP/IP
    Server characterset:    latin1
    Db     characterset:    latin1
    Client characterset:    utf8
    Conn.  characterset:    utf8
    TCP port:               3306
    Uptime:                 1 hour 2 min 12 sec

    Threads: 7  Questions: 952  Slow queries: 0  Opens: 66  Flush tables: 3  Open tables: 16  Queries per second avg: 0.255
    --------------

    mysql>
    ```

For additional commands, see [MySQL 5.7 Reference Manual - Chapter 4.5.1](https://dev.mysql.com/doc/refman/5.7/en/mysql.html).

## Connect to the server using MySQL Workbench

1. Launch the MySQL Workbench application on your client computer. To download and install MySQL
   Workbench, see [Download MySQL Workbench](https://dev.mysql.com/downloads/workbench/).

1. In the **Setup New Connection** dialog box, enter the following information on the **Parameters**
   tab:

   :::image type="content" source="./media/quickstart-create-mysql-server-database-using-azure-powershell/setup-new-connection.png" alt-text="setup new connection":::

    |    **Setting**    |           **Suggested Value**           |                      **Description**                       |
    | ----------------- | --------------------------------------- | ---------------------------------------------------------- |
    | Connection Name   | My Connection                           | Specify a label for this connection                        |
    | Connection Method | Standard (TCP/IP)                       | Use TCP/IP protocol to connect to Azure Database for MySQL |
    | Hostname          | `mydemoserver.mysql.database.azure.com` | Server name you previously noted                           |
    | Port              | 3306                                    | The default port for MySQL                                 |
    | Username          | myadmin@mydemoserver                    | The server admin login you previously noted                |
    | Password          | *************                           | Use the admin account password you configured earlier      |

1. To test if the parameters are configured correctly, click the **Test Connection** button.

1. Select the connection to connect to the server.

## Clean up resources

If the resources created in this quickstart aren't needed for another quickstart or tutorial, you
can delete them by running the following example.

> [!CAUTION]
> The following example deletes the specified resource group and all resources contained within it.
> If resources outside the scope of this quickstart exist in the specified resource group, they will
> also be deleted.

```azurepowershell-interactive
Remove-AzResourceGroup -Name myresourcegroup
```

To delete only the server created in this quickstart without deleting the resource group, use the
`Remove-AzMySqlServer` cmdlet.

```azurepowershell-interactive
Remove-AzMySqlServer -Name mydemoserver -ResourceGroupName myresourcegroup
```

## Next steps

> [!div class="nextstepaction"]
> [Design an Azure Database for MySQL using PowerShell](tutorial-design-database-using-powershell.md)
