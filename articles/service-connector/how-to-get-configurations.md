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

Service Connector will configure connection information, such as Dtabase connection string, while creating or updating service connections. After service connections are created, you might want to write code to consume these connection configurations in code. This page shows how to get connection configuration names added by Service Connector. 

There're multiple ways to get connection configurations of a service connection. You can get configuration names for specific target service type from doocumentation eg. https://learn.microsoft.com/en-us/azure/service-connector/how-to-integrate-postgres.

Or you can get connection configurations programmatically in below ways.

## [Azure CLI](#tab/azure-cli)
You can run below command in Azure CLI(https://aka.ms/cli) to list configurations of a service connection.
```azurecli
# for Azure Web App
az webapp connection list-configuration -g <myResourceGroupName> -n <myWebAppName> --connection <myConnectionName>

# for Azure ContainerApp
az containerapp connection list-configuration -g <myResourceGroupName> -n <myContainerAppName> --connection <myConnectionName>

# for Azure Spring App
az spring connection list-configuration --id /subscriptions/{subscription}/resourceGroups/{myResourceGroupName}/providers/Microsoft.AppPlatform/Spring/{mySpringAppName}/apps/{myAppName}/deployments/default/providers/Microsoft.ServiceLinker/linkers/{myConnectionName}
```
More info in Azure CLI reference docoumentations:
https://learn.microsoft.com/en-us/cli/azure/webapp/connection?view=azure-cli-latest#az-webapp-connection-list-configuration
https://learn.microsoft.com/en-us/cli/azure/containerapp/connection?view=azure-cli-latest#az-containerapp-connection-list-configuration
https://learn.microsoft.com/en-us/cli/azure/spring/connection?view=azure-cli-latest#az-spring-connection-list-configuration

## [Azure Powershell](#tab/azure-powershell)
You can run below command in Azure Powershell to list configurations of a service connection.
```azurepowershell
# for Azure Web App
Get-AzServiceLinkerConfigurationForWebApp -WebApp {myWebAppName} -ResourceGroupName {myResourceGroupName} -LinkerName {myConnectionName} | Format-List

# for Azure ContainerApp
Get-AzServiceLinkerConfigurationForContainerApp -ContainerApp {myContainerAppName} -ResourceGroupName {myResourceGroupName} -LinkerName {myConnectionName} | Format-List

# for Azure Spring App
Get-AzServiceLinkerConfigurationForSpringCloud -ServiceName {mySpringAppName} -AppName {myAppName} -ResourceGroupName {myResourceGroupName} -LinkerName {myConnectionName} | Format-List
```
More info in Azure CLI reference docoumentations: 
https://learn.microsoft.com/en-us/powershell/module/az.servicelinker/get-azservicelinkerconfigurationforwebapp?view=azps-10.0.0
https://learn.microsoft.com/en-us/powershell/module/az.servicelinker/get-azservicelinkerconfigurationforcontainerapp?view=azps-10.0.0
https://learn.microsoft.com/en-us/powershell/module/az.servicelinker/get-azservicelinkerconfigurationforspringcloud?view=azps-10.0.0


## Next Steps
[Explore connection configurations for specific target service type](./how-to-integrate-sql-database.md)