---
title: Configure server parameters - Azure PowerShell - Azure Database for MariaDB
description: This article describes how to configure the service parameters in Azure Database for MariaDB using PowerShell.
author: ajlam
ms.author: andrela
ms.service: mariadb
ms.devlang: azurepowershell
ms.topic: conceptual
ms.date: 5/26/2020
---

# Configure server parameters in Azure Database for MariaDB using PowerShell

You can list, show, and update configuration parameters for an Azure Database for MariaDB server using
PowerShell. A subset of engine configurations is exposed at the server-level and can be modified.

## Prerequisites

To complete this how-to guide, you need:

- The [Az PowerShell module](https://docs.microsoft.com/powershell/azure/install-az-ps) installed locally or
  [Azure Cloud Shell](https://shell.azure.com/) in the browser
- An [Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-powershell.md)

> [!IMPORTANT]
> While the Az.MariaDb PowerShell module is in preview, you must install it separately from the Az
> PowerShell module using the following command: `Install-Module -Name Az.MariaDb -AllowPrerelease`.
> Once the Az.MariaDb PowerShell module is generally available, it becomes part of future Az
> PowerShell module releases and available natively from within Azure Cloud Shell.

If you choose to use PowerShell locally, connect to your Azure account using the
[Connect-AzAccount](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount) cmdlet.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## List server configuration parameters for Azure Database for MariaDB server

To list all modifiable parameters in a server and their values, run the `Get-AzMariaDbConfiguration`
cmdlet.

The following example lists the server configuration parameters for the server **mydemoserver** in
resource group **myresourcegroup**.

```azurepowershell-interactive
Get-AzMariaDbConfiguration -ResourceGroupName myresourcegroup -ServerName mydemoserver
```

For the definition of each of the listed parameters, see the MariaDB reference section on
[Server System Variables](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html).

## Show server configuration parameter details

To show details about a particular configuration parameter for a server, run the
`Get-AzMariaDbConfiguration` cmdlet and specify the **Name** parameter.

This example shows details of the **slow\_query\_log** server configuration parameter for server
**mydemoserver** under resource group **myresourcegroup**.

```azurepowershell-interactive
Get-AzMariaDbConfiguration -Name slow_query_log -ResourceGroupName myresourcegroup -ServerName mydemoserver
```

## Modify a server configuration parameter value

You can also modify the value of a certain server configuration parameter, which updates the
underlying configuration value for the MariaDB server engine. To update the configuration, use the
`Update-AzMariaDbConfiguration` cmdlet.

To update the **slow\_query\_log** server configuration parameter of server
**mydemoserver** under resource group **myresourcegroup**.

```azurepowershell-interactive
Update-AzMariaDbConfiguration -Name slow_query_log -ResourceGroupName myresourcegroup -ServerName mydemoserver -Value On
```

## Next steps

> [!div class="nextstepaction"]
> [Auto grow storage in Azure Database for MariaDB server using PowerShell](howto-auto-grow-storage-powershell.md).
