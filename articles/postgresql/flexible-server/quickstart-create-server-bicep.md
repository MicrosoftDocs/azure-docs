---
title: 'Quickstart: Create an Azure DB for PostgresSQL Flexible Server - Bicep'
description: In this Quickstart, learn how to create an Azure Database for PostgresSQL Flexible server using Bicep.
author: mumian
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: quickstart
ms.author: jgao
ms.date: 05/12/2022
---

# Quickstart: Use a Bicep to create an Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Flexible server is a managed service that you use to run, manage, and scale highly available PostgreSQL databases in the cloud. You can use [Bicep](../../azure-resource-manager/bicep/overview.md) to provision a PostgreSQL Flexible Server to deploy multiple servers or multiple databases on a server.

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).

## Review the Bicep

An Azure Database for PostgresSQL Server is the parent resource for one or more databases within a region. It provides the scope for management policies that apply to its databases: login, firewall, users, roles, and configurations.

Create a _postgres-flexible-server.bicep_ file and copy the following Bicep into it.

```bicep
param administratorLogin string

@secure()
param administratorLoginPassword string
param location string = resourceGroup().location
param serverName string
param serverEdition string = 'GeneralPurpose'
param skuSizeGB int = 128
param dbInstanceType string = 'Standard_D4ds_v4'
param haMode string = 'ZoneRedundant'
param availabilityZone string = '1'
param version string = '12'
param virtualNetworkExternalId string = ''
param subnetName string = ''
param privateDnsZoneArmResourceId string = ''

resource serverName_resource 'Microsoft.DBforPostgreSQL/flexibleServers@2021-06-01' = {
  name: serverName
  location: location
  sku: {
    name: dbInstanceType
    tier: serverEdition
  }
  properties: {
    version: version
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorLoginPassword
    network: {
      delegatedSubnetResourceId: (empty(virtualNetworkExternalId) ? json('null') : json('${virtualNetworkExternalId}/subnets/${subnetName}'))
      privateDnsZoneArmResourceId: (empty(virtualNetworkExternalId) ? json('null') : privateDnsZoneArmResourceId)
    }
    highAvailability: {
      mode: haMode
    }
    storage: {
      storageSizeGB: skuSizeGB
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    availabilityZone: availabilityZone
  }
}
```

These resources are defined in the Bicep file:

- [Microsoft.DBforPostgreSQL/flexibleServers](/azure/templates/microsoft.dbforpostgresql/flexibleservers?tabs=bicep)

## Deploy the Bicep file

Select **Try it** from the following PowerShell code block to open Azure Cloud Shell.

```azurepowershell-interactive
$serverName = Read-Host -Prompt "Enter a name for the new Azure Database for PostgreSQL server"
$resourceGroupName = Read-Host -Prompt "Enter a name for the new resource group where the server will exist"
$location = Read-Host -Prompt "Enter an Azure region (for example, centralus) for the resource group"
$adminUser = Read-Host -Prompt "Enter the Azure Database for PostgreSQL server's administrator account name"
$adminPassword = Read-Host -Prompt "Enter the administrator password" -AsSecureString

New-AzResourceGroup -Name $resourceGroupName -Location $location # Use this command when you need to create a new resource group for your deployment
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
    -TemplateFile "postgres-flexible-server.bicep" `
    -serverName $serverName `
    -administratorLogin $adminUser `
    -administratorLoginPassword $adminPassword

Read-Host -Prompt "Press [ENTER] to continue ..."
```

## Review deployed resources

Follow these steps to verify if your server was created in Azure.

# [Azure portal](#tab/portal)

[!INCLUDE [!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

1. In the [Azure portal](https://portal.azure.com), search for and select **Azure Database for PostgreSQL Flexible Servers**.
1. In the database list, select your new server to view the **Overview** page to manage the server.

# [PowerShell](#tab/PowerShell)

[!INCLUDE [!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

You'll have to enter the name of the new server to view the details of your Azure Database for PostgreSQL Flexible server.

```azurepowershell-interactive
$serverName = Read-Host -Prompt "Enter the name of your Azure Database for PostgreSQL server"
Get-AzResource -ResourceType "Microsoft.DBforPostgreSQL/flexibleServers" -Name $serverName | ft
Write-Host "Press [ENTER] to continue..."
```

# [CLI](#tab/CLI)

[!INCLUDE [!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

You'll have to enter the name and the resource group of the new server to view details about your Azure Database for PostgreSQL Flexible Server.

```azurecli-interactive
echo "Enter your Azure Database for PostgreSQL Flexible Server name:" &&
read serverName &&
echo "Enter the resource group where the Azure Database for PostgreSQL Flexible Server exists:" &&
read resourcegroupName &&
az resource show --resource-group $resourcegroupName --name $serverName --resource-type "Microsoft.DBforPostgreSQL/flexibleServers"
```

---

## Clean up resources

Keep this resource group, server, and single database if you want to go to the [Next steps](#next-steps). The next steps show you how to connect and query your database using different methods.

To delete the resource group:

# [Portal](#tab/azure-portal)

[!INCLUDE [!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In the [portal](https://portal.azure.com), select the resource group you want to delete.

1. Select **Delete resource group**.
1. To confirm the deletion, type the name of the resource group

# [PowerShell](#tab/azure-powershell)

[!INCLUDE [!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

```azurepowershell-interactive
Remove-AzResourceGroup -Name ExampleResourceGroup
```

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

```azurecli-interactive
az group delete --name ExampleResourceGroup
```

---

## Next steps

> [!div class="nextstepaction"]
> [Migrate your database using dump and restore](../howto-migrate-using-dump-and-restore.md)
