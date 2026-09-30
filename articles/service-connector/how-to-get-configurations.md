---
title: Get connection configurations added by Service Connector
description: Get connection configurations added by Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 06/18/2026
---

# Get connection configurations added by Service Connector

Service Connector configures connection information, such as database connection strings, when creating or updating service connections. After service connections are created, you can write code to consume these connection configurations. This article shows how to get connection configurations added by Service Connector.

There are multiple ways to get the connection configurations for a service connection.

You can get configuration names for specific target service types from articles such as [Integrate Azure Database for PostgreSQL with Service Connector](./how-to-integrate-postgres.md). You can also get connection configurations programmatically by running the following commands.

## [Azure CLI](#tab/azure-cli)
You can run the following commands in [Azure CLI](/cli/azure) to list configurations of a service connection.

```azurecli
# for Azure Web App
az webapp connection list-configuration -g <myResourceGroupName> -n <myWebAppName> --connection <myConnectionName>

# for Azure Spring App
az spring connection list-configuration --id /subscriptions/{subscription}/resourceGroups/{myResourceGroupName}/providers/Microsoft.AppPlatform/Spring/{mySpringAppName}/apps/{myAppName}/deployments/default/providers/Microsoft.ServiceLinker/linkers/{myConnectionName}
```
For more information, see [az webapp connection list-configuration](/cli/azure/webapp/connection#az-webapp-connection-list-configuration).

## [Azure PowerShell](#tab/azure-powershell)
You can run the following commands in Azure PowerShell to list configurations of a service connection.
```azurepowershell
# for Azure Web App
Get-AzServiceLinkerConfigurationForWebApp -WebApp {myWebAppName} -ResourceGroupName {myResourceGroupName} -LinkerName {myConnectionName} | Format-List

# for Azure Spring App
Get-AzServiceLinkerConfigurationForSpringCloud -ServiceName {mySpringAppName} -AppName {myAppName} -ResourceGroupName {myResourceGroupName} -LinkerName {myConnectionName} | Format-List
```
For more information, see [Get-AzServiceLinkerConfigurationForWebApp](/powershell/module/az.servicelinker/get-azservicelinkerconfigurationforwebapp)

---

## Next steps
> [!div class="nextstepaction"]
> [Explore connection configurations for specific target service type](./how-to-integrate-sql-database.md)
