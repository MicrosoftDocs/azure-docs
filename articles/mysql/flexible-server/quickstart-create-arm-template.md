---
title: 'Quickstart: Create an Azure DB for MySQL - Flexible Server - ARM template'
description: In this Quickstart, learn how to create an Azure Database for MySQL - Flexible Server using ARM template.
author: mksuni
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
ms.custom: subject-armqs, devx-track-azurepowershell, mode-arm
ms.author: sumuth
ms.date: 10/23/2020
---

# Quickstart: Use an ARM template to create an Azure Database for MySQL - Flexible Server

[!INCLUDE [applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

[!INCLUDE [About Azure Database for MySQL - Flexible Server](../includes/azure-database-for-mysql-flexible-server-abstract.md)]

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

An Azure account with an active subscription. 

[!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]

## Review the template

An Azure Database for MySQL Flexible Server is the parent resource for one or more databases  within a region. It provides the scope for management policies that apply to its databases: login, firewall, users, roles, configurations.

Create a _mysql-flexible-server-template.json_ file and copy this JSON script into it.

### [Create server with public access](#tab/mysql-create-with-public-access)
```json
{
    "$schema": "http://schema.management.azure.com/schemas/2014-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "administratorLogin": {
        "type": "String"
      },
      "administratorLoginPassword": {
        "type": "SecureString"
      },
      "location": {
        "type": "String"
      },
      "serverName": {
        "type": "String"
      },
      "databaseName": {
        "type": "String"
      },
      "serverEdition": {
        "type": "String"
      },
      "serverSku": {
        "type": "String"
      },
      "storageSizeGB": {
        "type": "Int"
      },
      "haEnabled": {
        "type": "String",
        "defaultValue": "Disabled"
      },
      "availabilityZone": {
        "type": "String"
      },
      "version": {
        "type": "String"
      },
      "tags": {
        "defaultValue": {},
        "type": "Object"
      },
      "firewallRules": {
        "defaultValue": {},
        "type": "Object"
      },
      "backupRetentionDays": {
        "type": "Int"
      },
      "charset": {
        "type":"String"
      },
      "collation": {
        "type":"String"
      },      
      "firewallRuleName": {
        "type":"String"
      },
      "StartIpAddress": {
        "type":"String"
      },
      "EndIpAddress": {
        "type":"String"
      }      
    },
    "variables": {
      "api": "2021-12-01-preview",
      "firewallRules": "[parameters('firewallRules').rules]",
      "publicNetworkAccess": "Enabled"
    },
    "resources": [
      {
        "type": "Microsoft.DBforMySQL/flexibleServers",
        "apiVersion": "[variables('api')]",
        "name": "[parameters('serverName')]",
        "location": "[parameters('location')]",
        "sku": {
          "name": "[parameters('serverSku')]",
          "tier": "[parameters('serverEdition')]"
        },
        "tags": "[parameters('tags')]",
        "properties": {        
          "version": "[parameters('version')]",
          "administratorLogin": "[parameters('administratorLogin')]",
          "administratorLoginPassword": "[parameters('administratorLoginPassword')]",
          "storage": {
            "storageSizeGB": "[parameters('storageSizeGB')]",
            "iops": 360,
            "autoGrow": "Enabled"
        },
        "maintenanceWindow": {
            "customWindow": "Disabled",
            "dayOfWeek": 0,
            "startHour": 0,
            "startMinute": 0
        },
        "replicationRole": "None",
        "network": {},
        "backup": {
            "backupRetentionDays": "[parameters('backupRetentionDays')]",
            "geoRedundantBackup": "Disabled"
        },
        "highAvailability": {
            "mode": "[parameters('haEnabled')]"
        },
        "availabilityZone":  "[parameters('availabilityZone')]"
        }
      },
      {

        "type": "Microsoft.DBforMySQL/flexibleServers/databases",
        "apiVersion": "[variables('apiVersion')]",
        "name": "[format('{0}/{1}', parameters('serverName'), parameters('databaseName') )]",
        "dependsOn": [
                "[concat('Microsoft.DBforMySQL/flexibleServers/', parameters('serverName'))]"
        ],
        "properties": {
            "charset": "[parameters('charset')]",
            "collation": "[parameters('collation')]"

        }
    },  
    {
        "type": "Microsoft.DBforMySQL/flexibleServers/firewallRules",
        "apiVersion": "2021-05-01",
        "name": "[format('{0}/{1}', parameters('serverName'), parameters('firewallRuleName') )]",
        "dependsOn": [
            "[concat('Microsoft.DBforMySQL/flexibleServers/', parameters('serverName'))]"
        ],
        "properties": {
            "StartIpAddress": "0.0.0.0",
            "EndIpAddress": "0.0.0.0"
        }
    }
    ]
  }
```
### [Create with private access](#tab/mysql-create-with-private-access)

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2014-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "administratorLogin": {
        "type": "String"
      },
      "administratorLoginPassword": {
        "type": "SecureString"
      },
      "location": {
        "type": "String"
      },
      "serverName": {
        "type": "String"
      },
      "databaseName": {
        "type": "String"
      },
      "serverEdition": {
        "type": "String"
      },
      "serverSku": {
        "type": "String"
      },
      "storageSizeGB": {
        "type": "Int"
      },
      "haEnabled": {
        "type": "String",
        "defaultValue": "Disabled"
      },
      "availabilityZone": {
        "type": "String"
      },
      "version": {
        "type": "String"
      },
      "tags": {
        "defaultValue": {},
        "type": "Object"
      },
      "firewallRules": {
        "defaultValue": {},
        "type": "Object"
      },
      "backupRetentionDays": {
        "type": "Int"
      },
      "charset": {
        "type":"String"
      },
      "collation": {
        "type":"String"
      },      
      "firewallRuleName": {
        "type":"String"
      },
      "StartIpAddress": {
        "type":"String"
      },
      "EndIpAddress": {
        "type":"String"
      },
      "vnetName":{
        "type":"String"
      },
      "subnetName":{
        "type":"String"
      } ,
      "delegatedSubnetResourceIdUri":{
        "type":"String"
      },
      "privateDnsZoneResourceIdUri":{
        "type": "String"
      }
    },
    "variables": {
      "api": "2021-12-01-preview",
    },
    "resources": [
      {
        "type": "Microsoft.DBforMySQL/flexibleServers",
        "apiVersion": "[variables('api')]",
        "name": "[parameters('serverName')]",
        "location": "[parameters('location')]",
        "sku": {
          "name": "[parameters('serverSku')]",
          "tier": "[parameters('serverEdition')]"
        },
        "tags": "[parameters('tags')]",
        "properties": {        
          "version": "[parameters('version')]",
          "administratorLogin": "[parameters('administratorLogin')]",
          "administratorLoginPassword": "[parameters('administratorLoginPassword')]",
          "storage": {
            "storageSizeGB": "[parameters('storageSizeGB')]",
            "iops": 360,
            "autoGrow": "Enabled"
        },
        "maintenanceWindow": {
            "customWindow": "Disabled",
            "dayOfWeek": 0,
            "startHour": 0,
            "startMinute": 0
        },
        "replicationRole": "None",
        "network": {},
        "backup": {
            "backupRetentionDays": "[parameters('backupRetentionDays')]",
            "geoRedundantBackup": "Disabled"
        },
        "highAvailability": {
            "mode": "[parameters('haEnabled')]"
        },
        "availabilityZone":  "[parameters('availabilityZone')]",
        "network": {
            "publicNetworkAccess": "Disabled",
            "delegatedSubnetResourceId": "[parameters('delegatedSubnetResourceIdUri')]",
            "privateDnsZoneResourceId": "[parameters('rivateDnsZoneResourceIdUri')]"
          }
        }
      },
      {

        "type": "Microsoft.DBforMySQL/flexibleServers/databases",
        "apiVersion": "[variables('apiVersion')]",
        "name": "[format('{0}/{1}', parameters('serverName'), parameters('databaseName') )]",
        "dependsOn": [
                "[concat('Microsoft.DBforMySQL/flexibleServers/', parameters('serverName'))]"
        ],
        "properties": {
            "charset": "[parameters('charset')]",
            "collation": "[parameters('collation')]"

        }
    }
  ]
}
```


---

These resources are defined in the template:

- Microsoft.DBforMySQL/flexibleServers

## Deploy the template

Select **Try it** from the following PowerShell code block to open [Azure Cloud Shell](../../cloud-shell/overview.md).

```azurepowershell-interactive
$serverName = Read-Host -Prompt "Enter a name for the new Azure Database for MySQL server"
$resourceGroupName = Read-Host -Prompt "Enter a name for the new resource group where the server will exist"
$location = Read-Host -Prompt "Enter an Azure region (for example, centralus) for the resource group"
$adminUser = Read-Host -Prompt "Enter the Azure Database for MySQL server's administrator account name"
$adminPassword = Read-Host -Prompt "Enter the administrator password" -AsSecureString

New-AzResourceGroup -Name $resourceGroupName -Location $location # Use this command when you need to create a new resource group for your deployment
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
    -TemplateFile "D:\Azure\Templates\EngineeringSite.json
    -serverName $serverName `
    -administratorLogin $adminUser `
    -administratorLoginPassword $adminPassword

Read-Host -Prompt "Press [ENTER] to continue ..."
```

## Review deployed resources

Follow these steps to verify if your server was created in Azure.

### Azure portal

1. In the [Azure portal](https://portal.azure.com), search for and select **Azure Database for MySQL servers**.
1. In the database list, select your new server. The **Overview** page for your new Azure Database for MySQL server appears.

### PowerShell

You'll have to enter the name of the new server to view the details of your Azure Database for MySQL Flexible Server.

```azurepowershell-interactive
$serverName = Read-Host -Prompt "Enter the name of your Azure Database for MySQL server"
Get-AzResource -ResourceType "Microsoft.DBforMySQL/flexibleServers" -Name $serverName | ft
Write-Host "Press [ENTER] to continue..."
```

### CLI

You'll have to enter the name and the resource group of the new server to view details about your Azure Database for MySQL Flexible Server.

```azurecli-interactive
echo "Enter your Azure Database for MySQL server name:" &&
read serverName &&
echo "Enter the resource group where the Azure Database for MySQL server exists:" &&
read resourcegroupName &&
az resource show --resource-group $resourcegroupName --name $serverName --resource-type "Microsoft.DbForMySQL/flexibleServers"
```

## Clean up resources

Keep this resource group, server, and single database if you want to go to the [Next steps](#next-steps). The next steps show you how to connect and query your database using different methods.

To delete the resource group:

### Azure portal

1. In the [Azure portal](https://portal.azure.com), search for and select **Resource groups**.
1. In the resource group list, choose the name of your resource group.
1. In the **Overview** page of your resource group, select **Delete resource group**.
1. In the confirmation dialog box, type the name of your resource group, and then select **Delete**.

### PowerShell

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
Remove-AzResourceGroup -Name $resourceGroupName
Write-Host "Press [ENTER] to continue..."
```

### CLI

```azurecli-interactive
echo "Enter the Resource Group name:" &&
read resourceGroupName &&
az group delete --name $resourceGroupName &&
echo "Press [ENTER] to continue ..."
```
---

## Next steps

For a step-by-step tutorial that guides you through the process of creating an ARM template, see:

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](../../azure-resource-manager/templates/template-tutorial-create-first-template.md)

For a step-by-step tutorial to build an app with App Service using MySQL, see:

> [!div class="nextstepaction"]
>[Build a PHP (Laravel) web app with MySQL](tutorial-php-database-app.md)
