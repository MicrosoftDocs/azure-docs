---
title: 'Quickstart: Create an Azure Database for PostgreSQL Flexible Server - ARM template'
description: In this Quickstart, learn how to create an Azure Database for PostgreSQL Flexible server using ARM template.
author: mksuni
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: quickstart
ms.custom: subject-armqs, mode-arm
ms.author: sumuth
ms.date: 05/12/2022
---

# Quickstart: Use an ARM template to create an Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Flexible server is a managed service that you use to run, manage, and scale highly available PostgreSQL databases in the cloud. You can use an Azure Resource Manager template (ARM template) to provision a PostgreSQL Flexible Server to deploy multiple servers or multiple databases on a server.

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

Azure Resource Manager is the deployment and management service for Azure. It provides a management layer that enables you to create, update, and delete resources in your Azure account. You use management features, like access control, locks, and tags, to secure and organize your resources after deployment. To learn about Azure Resource Manager templates, see [Template deployment overview](../../azure-resource-manager/templates/overview.md).

## Prerequisites

An Azure account with an active subscription. [Create one for free](https://azure.microsoft.com/free/).

## Review the template

An Azure Database for PostgreSQL Server is the parent resource for one or more databases within a region. It provides the scope for management policies that apply to its databases: login, firewall, users, roles, and configurations.

Create a _postgres-flexible-server-template.json_ file and copy the following JSON script into it.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "administratorLogin": {
      "type": "string"
    },
    "administratorLoginPassword": {
      "type": "secureString"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "serverName": {
      "type": "string"
    },
    "serverEdition": {
      "type": "string",
      "defaultValue": "GeneralPurpose"
    },
    "skuSizeGB": {
      "type": "int",
      "defaultValue": 128
    },
    "dbInstanceType": {
      "type": "string",
      "defaultValue": "Standard_D4ds_v4"
    },
    "haMode": {
      "type": "string",
      "defaultValue": "ZoneRedundant"
    },
    "availabilityZone": {
      "type": "string",
      "defaultValue": "1"
    },
    "version": {
      "type": "string",
      "defaultValue": "12"
    },
    "virtualNetworkExternalId": {
      "type": "string",
      "defaultValue": ""
    },
    "subnetName": {
      "type": "string",
      "defaultValue": ""
    },
    "privateDnsZoneArmResourceId": {
      "type": "string",
      "defaultValue": ""
    }
  },
  "resources": [
    {
      "type": "Microsoft.DBforPostgreSQL/flexibleServers",
      "apiVersion": "2021-06-01",
      "name": "[parameters('serverName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('dbInstanceType')]",
        "tier": "[parameters('serverEdition')]"
      },
      "properties": {
        "version": "[parameters('version')]",
        "administratorLogin": "[parameters('administratorLogin')]",
        "administratorLoginPassword": "[parameters('administratorLoginPassword')]",
        "network": {
          "delegatedSubnetResourceId": "[if(empty(parameters('virtualNetworkExternalId')), json('null'), json(format('{0}/subnets/{1}', parameters('virtualNetworkExternalId'), parameters('subnetName'))))]",
          "privateDnsZoneArmResourceId": "[if(empty(parameters('virtualNetworkExternalId')), json('null'), parameters('privateDnsZoneArmResourceId'))]"
        },
        "highAvailability": {
          "mode": "[parameters('haMode')]"
        },
        "storage": {
          "storageSizeGB": "[parameters('skuSizeGB')]"
        },
        "backup": {
          "backupRetentionDays": 7,
          "geoRedundantBackup": "Disabled"
        },
        "availabilityZone": "[parameters('availabilityZone')]"
      }
    }
  ]
}
```

These resources are defined in the template:

- [Microsoft.DBforPostgreSQL/flexibleServers](/azure/templates/microsoft.dbforpostgresql/flexibleservers?tabs=json)

## Deploy the template

Select **Try it** from the following PowerShell code block to open Azure Cloud Shell.

```azurepowershell-interactive
$serverName = Read-Host -Prompt "Enter a name for the new Azure Database for PostgreSQL server"
$resourceGroupName = Read-Host -Prompt "Enter a name for the new resource group where the server will exist"
$location = Read-Host -Prompt "Enter an Azure region (for example, centralus) for the resource group"
$adminUser = Read-Host -Prompt "Enter the Azure Database for PostgreSQL server's administrator account name"
$adminPassword = Read-Host -Prompt "Enter the administrator password" -AsSecureString

New-AzResourceGroup -Name $resourceGroupName -Location $location # Use this command when you need to create a new resource group for your deployment
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
    -TemplateFile "postgres-flexible-server-template.json" `
    -serverName $serverName `
    -administratorLogin $adminUser `
    -administratorLoginPassword $adminPassword

Read-Host -Prompt "Press [ENTER] to continue ..."
```

## Review deployed resources

Follow these steps to verify if your server was created in Azure.

# [Azure portal](#tab/portal)

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

1. In the [Azure portal](https://portal.azure.com), search for and select **Azure Database for PostgreSQL Flexible Servers**.
1. In the database list, select your new server to view the **Overview** page to manage the server.

# [PowerShell](#tab/PowerShell)

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

You'll have to enter the name of the new server to view the details of your Azure Database for PostgreSQL Flexible server.

```azurepowershell-interactive
$serverName = Read-Host -Prompt "Enter the name of your Azure Database for PostgreSQL server"
Get-AzResource -ResourceType "Microsoft.DBforPostgreSQL/flexibleServers" -Name $serverName | ft
Write-Host "Press [ENTER] to continue..."
```

# [CLI](#tab/CLI)

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

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

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In the [portal](https://portal.azure.com), select the resource group you want to delete.

1. Select **Delete resource group**.
1. To confirm the deletion, type the name of the resource group

# [PowerShell](#tab/azure-powershell)

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

```azurepowershell-interactive
Remove-AzResourceGroup -Name ExampleResourceGroup
```

# [Azure CLI](#tab/azure-cli)

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

```azurecli-interactive
az group delete --name ExampleResourceGroup
```

---

## Next steps

> [!div class="nextstepaction"]
> [Migrate your database using dump and restore](../howto-migrate-using-dump-and-restore.md)
