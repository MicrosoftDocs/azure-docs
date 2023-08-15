---
title: Configure server parameters - Azure PowerShell - Azure Database for PostgreSQL
description: This article describes how to configure the service parameters in Azure Database for PostgreSQL using PowerShell.
ms.service: postgresql
ms.subservice: single-server
ms.topic: how-to
ms.author: sunila
author: sunilagarwal
ms.devlang: azurepowershell
ms.custom: devx-track-azurepowershell
ms.date: 06/24/2022
---

# Customize Azure Database for PostgreSQL server parameters using PowerShell

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

You can list, show, and update configuration parameters for an Azure Database for PostgreSQL server using
PowerShell. A subset of engine configurations is exposed at the server-level and can be modified.

## Prerequisites

To complete this how-to guide, you need:

- The [Az PowerShell module](/powershell/azure/install-azure-powershell) installed locally or
  [Azure Cloud Shell](https://shell.azure.com/) in the browser
- An [Azure Database for PostgreSQL server](quickstart-create-postgresql-server-database-using-azure-powershell.md)

> [!IMPORTANT]
> While the Az.PostgreSql PowerShell module is in preview, you must install it separately from the Az
> PowerShell module using the following command: `Install-Module -Name Az.PostgreSql -AllowPrerelease`.
> Once the Az.PostgreSql PowerShell module is generally available, it becomes part of future Az
> PowerShell module releases and available natively from within Azure Cloud Shell.

If you choose to use PowerShell locally, connect to your Azure account using the
[Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) cmdlet.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## List server configuration parameters for Azure Database for PostgreSQL server

To list all modifiable parameters in a server and their values, run the `Get-AzPostgreSqlConfiguration`
cmdlet.

The following example lists the server configuration parameters for the server **mydemoserver** in
resource group **myresourcegroup**.

```azurepowershell-interactive
Get-AzPostgreSqlConfiguration -ResourceGroupName myresourcegroup -ServerName mydemoserver
```

For the definition of each of the listed parameters, see the PostgreSQL reference section on
[Environment Variables](https://www.postgresql.org/docs/12/libpq-envars.html).

## Show server configuration parameter details

To show details about a particular configuration parameter for a server, run the
`Get-AzPostgreSqlConfiguration` cmdlet and specify the **Name** parameter.

This example shows details of the **slow\_query\_log** server configuration parameter for server
**mydemoserver** under resource group **myresourcegroup**.

```azurepowershell-interactive
Get-AzPostgreSqlConfiguration -Name slow_query_log -ResourceGroupName myresourcegroup -ServerName mydemoserver
```

## Modify a server configuration parameter value

You can also modify the value of a certain server configuration parameter, which updates the
underlying configuration value for the PostgreSQL server engine. To update the configuration, use the
`Update-AzPostgreSqlConfiguration` cmdlet.

To update the **slow\_query\_log** server configuration parameter of server
**mydemoserver** under resource group **myresourcegroup**.

```azurepowershell-interactive
Update-AzPostgreSqlConfiguration -Name slow_query_log -ResourceGroupName myresourcegroup -ServerName mydemoserver -Value On
```

## Next steps

> [!div class="nextstepaction"]
> [Auto grow storage in Azure Database for PostgreSQL server using PowerShell](how-to-auto-grow-storage-powershell.md).
