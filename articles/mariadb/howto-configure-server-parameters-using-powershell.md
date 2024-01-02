---
title: Configure Azure Database for MariaDB - Azure PowerShell
description: This article describes how to configure the service parameters in Azure Database for MariaDB using PowerShell.
ms.service: mariadb
author: SudheeshGH
ms.author: sunaray
ms.devlang: azurepowershell
ms.topic: how-to
ms.date: 06/24/2022
ms.custom: 
- devx-track-azurepowershell
- kr2b-contr-experiment
---

# Configure server parameters in Azure Database for MariaDB using PowerShell

[!INCLUDE [azure-database-for-mariadb-deprecation](includes/azure-database-for-mariadb-deprecation.md)]

You can list, show, and update configuration parameters for an Azure Database for MariaDB server using
PowerShell. A subset of engine configurations is exposed at the server-level and can be modified.

>[!Note]
> Server parameters can be updated globally at the server-level, use the [Azure CLI](./howto-configure-server-parameters-cli.md), [PowerShell](./howto-configure-server-parameters-using-powershell.md), or [Azure portal](./howto-server-parameters.md).

## Prerequisites

To complete this how-to guide, you need:

- The [Az PowerShell module](/powershell/azure/install-azure-powershell) installed locally or
  [Azure Cloud Shell](https://shell.azure.com/) in the browser
- An [Azure Database for MariaDB server](quickstart-create-mariadb-server-database-using-azure-powershell.md)

> [!IMPORTANT]
> While the Az.MariaDb PowerShell module is in preview, you must install it separately from the Az
> PowerShell module using the following command: `Install-Module -Name Az.MariaDb -AllowPrerelease`.
> Once the Az.MariaDb PowerShell module is generally available, it becomes part of future Az
> PowerShell module releases and available natively from within Azure Cloud Shell.

If you choose to use PowerShell locally, connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

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
