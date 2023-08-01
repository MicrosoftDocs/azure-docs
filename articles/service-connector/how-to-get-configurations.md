---
title: Get connection configurations added by Service Connector
description: Get connection configurations added by Service Connector
author: mcleanbyron
ms.author: mcleans
ms.service: service-connector
ms.topic: how-to
ms.date: 07/04/2023
---

# Get connection configurations added by Service Connector

Service Connector configures connection information, such as Database connection string, while creating or updating service connections. After service connections are created, you might want to write code to consume these connection configurations in code. This page shows how to get connection configurations added by Service Connector. 

There are multiple ways to get connection configurations of a service connection. You can get configuration names for specific target service type from the following articles [Integrate Azure Database for PostgreSQL with Service Connector](./how-to-integrate-postgres.md).

Or you can get connection configurations programmatically in the following ways.

## [Azure CLI](#tab/azure-cli)
You can run the following commands in Azure CLI(/cli/azure) to list configurations of a service connection.
```azurecli
# for Azure Web App
az webapp connection list-configuration -g <myResourceGroupName> -n <myWebAppName> --connection <myConnectionName>

# for Azure Container App
az containerapp connection list-configuration -g <myResourceGroupName> -n <myContainerAppName> --connection <myConnectionName>

# for Azure Spring App
az spring connection list-configuration --id /subscriptions/{subscription}/resourceGroups/{myResourceGroupName}/providers/Microsoft.AppPlatform/Spring/{mySpringAppName}/apps/{myAppName}/deployments/default/providers/Microsoft.ServiceLinker/linkers/{myConnectionName}
```
For more information, see the following articles in Azure CLI reference documentations:
- [az webapp connection list-configuration](/cli/azure/webapp/connection#az-webapp-connection-list-configuration)
- [az containerapp connection list-configuration](/cli/azure/containerapp/connection#az-containerapp-connection-list-configuration)
- [az spring connection list-configuration](/cli/azure/spring/connection#az-spring-connection-list-configuration)

## [Azure PowerShell](#tab/azure-powershell)
You can run the following commands in Azure PowerShell to list configurations of a service connection.
```azurepowershell
# for Azure Web App
Get-AzServiceLinkerConfigurationForWebApp -WebApp {myWebAppName} -ResourceGroupName {myResourceGroupName} -LinkerName {myConnectionName} | Format-List

# for Azure Container App
Get-AzServiceLinkerConfigurationForContainerApp -ContainerApp {myContainerAppName} -ResourceGroupName {myResourceGroupName} -LinkerName {myConnectionName} | Format-List

# for Azure Spring App
Get-AzServiceLinkerConfigurationForSpringCloud -ServiceName {mySpringAppName} -AppName {myAppName} -ResourceGroupName {myResourceGroupName} -LinkerName {myConnectionName} | Format-List
```
For more information, see the following articles in Azure PowerShell reference documentations: 
- [Get-AzServiceLinkerConfigurationForWebApp](/powershell/module/az.servicelinker/get-azservicelinkerconfigurationforwebapp)
- [Get-AzServiceLinkerConfigurationForContainerApp](/powershell/module/az.servicelinker/get-azservicelinkerconfigurationforcontainerapp)
- [Get-AzServiceLinkerConfigurationForSpringApp](/powershell/module/az.servicelinker/get-azservicelinkerconfigurationforspringcloud)



---
## Next steps
> [!div class="nextstepaction"]
> [Explore connection configurations for specific target service type](./how-to-integrate-sql-database.md)
