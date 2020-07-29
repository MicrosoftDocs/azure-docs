---
title: Configure server parameters - Azure PowerShell - Azure Database for MySQL
description: This article describes how to configure the service parameters in Azure Database for MySQL using PowerShell.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.devlang: azurepowershell
ms.topic: conceptual
ms.date: 4/29/2020
---

# Configure server parameters in Azure Database for MySQL using PowerShell

You can list, show, and update configuration parameters for an Azure Database for MySQL server using
PowerShell. A subset of engine configurations is exposed at the server-level and can be modified.

## Prerequisites

To complete this how-to guide, you need:

- The [Az PowerShell module](/powershell/azure/install-az-ps) installed locally or
  [Azure Cloud Shell](https://shell.azure.com/) in the browser
- An [Azure Database for MySQL server](quickstart-create-mysql-server-database-using-azure-powershell.md)

> [!IMPORTANT]
> While the Az.MySql PowerShell module is in preview, you must install it separately from the Az
> PowerShell module using the following command: `Install-Module -Name Az.MySql -AllowPrerelease`.
> Once the Az.MySql PowerShell module is generally available, it becomes part of future Az
> PowerShell module releases and available natively from within Azure Cloud Shell.

If you choose to use PowerShell locally, connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) cmdlet.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## List server configuration parameters for Azure Database for MySQL server

To list all modifiable parameters in a server and their values, run the `Get-AzMySqlConfiguration`
cmdlet.

The following example lists the server configuration parameters for the server **mydemoserver** in
resource group **myresourcegroup**.

```azurepowershell-interactive
Get-AzMySqlConfiguration -ResourceGroupName myresourcegroup -ServerName mydemoserver
```

For the definition of each of the listed parameters, see the MySQL reference section on
[Server System Variables](https://dev.mysql.com/doc/refman/5.7/en/server-system-variables.html).

## Show server configuration parameter details

To show details about a particular configuration parameter for a server, run the
`Get-AzMySqlConfiguration` cmdlet and specify the **Name** parameter.

This example shows details of the **slow\_query\_log** server configuration parameter for server
**mydemoserver** under resource group **myresourcegroup**.

```azurepowershell-interactive
Get-AzMySqlConfiguration -Name slow_query_log -ResourceGroupName myresourcegroup -ServerName mydemoserver
```

## Modify a server configuration parameter value

You can also modify the value of a certain server configuration parameter, which updates the
underlying configuration value for the MySQL server engine. To update the configuration, use the
`Update-AzMySqlConfiguration` cmdlet.

To update the **slow\_query\_log** server configuration parameter of server
**mydemoserver** under resource group **myresourcegroup**.

```azurepowershell-interactive
Update-AzMySqlConfiguration -Name slow_query_log -ResourceGroupName myresourcegroup -ServerName mydemoserver -Value On
```

## Next steps

> [!div class="nextstepaction"]
> [Auto grow storage in Azure Database for MySQL server using PowerShell](howto-auto-grow-storage-powershell.md).
