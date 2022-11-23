---
title: 'Quickstart: Create an Azure DB for MySQL - Flexible Server - ARM template'
description: In this Quickstart, learn how to create an Azure Database for MySQL - Flexible Server using ARM template.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: shreyaaithal
ms.author: shaithal
ms.custom: subject-armqs, devx-track-azurepowershell, mode-arm
ms.date: 07/07/2022
---

# Quickstart: Use an ARM template to create an Azure Database for MySQL - Flexible Server

[!INCLUDE [applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

[!INCLUDE [About Azure Database for MySQL - Flexible Server](../includes/azure-database-for-mysql-flexible-server-abstract.md)]

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

- An Azure account with an active subscription.

[!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]

## Create server with public access

Create a _mysql-flexible-server-template.json_ file and copy this JSON script to create a server using public access connectivity method and also create a database on the server.

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "administratorLogin": {
      "type": "string"
    },
    "administratorLoginPassword": {
      "type": "securestring"
    },
    "location": {
      "type": "string"
    },
    "serverName": {
      "type": "string"
    },
    "serverEdition": {
      "type": "string",
      "defaultValue": "Burstable",
      "metadata": {
        "description": "The tier of the particular SKU, e.g. Burstable, GeneralPurpose, MemoryOptimized. High Availability is available only for GeneralPurpose and MemoryOptimized sku."
      }
    },
    "skuName": {
      "type": "string",
      "defaultValue": "Standard_B1ms",
      "metadata": {
        "description": "The name of the sku, e.g. Standard_D32ds_v4."
      }
    },
    "storageSizeGB": {
      "type": "int"
    },
    "storageIops": {
      "type": "int"
    },
    "storageAutogrow": {
      "type": "string",
      "defaultValue": "Enabled"
    },
    "availabilityZone": {
      "type": "string",
      "metadata": {
        "description": "Availability Zone information of the server. (Leave blank for No Preference)."
      }
    },
    "version": {
      "type": "string"
    },
    "tags": {
      "type": "object",
      "defaultValue": {}
    },
    "haEnabled": {
      "type": "string",
      "defaultValue": "Disabled",
      "metadata": {
        "description": "High availability mode for a server : Disabled, SameZone, or ZoneRedundant"
      }
    },
    "standbyAvailabilityZone": {
      "type": "string",
      "metadata": {
        "description": "Availability zone of the standby server."
      }
    },
    "firewallRules": {
      "type": "object",
      "defaultValue": {}
    },
    "backupRetentionDays": {
      "type": "int"
    },
    "geoRedundantBackup": {
      "type": "string"
    },
    "databaseName": {
      "type": "string"
    }
  },
  "variables": {
    "api": "2021-05-01",
    "firewallRules": "[parameters('firewallRules').rules]"
  },
  "resources": [
    {
      "type": "Microsoft.DBforMySQL/flexibleServers",
      "apiVersion": "[variables('api')]",
      "location": "[parameters('location')]",
      "name": "[parameters('serverName')]",
      "sku": {
        "name": "[parameters('skuName')]",
        "tier": "[parameters('serverEdition')]"
      },
      "properties": {
        "version": "[parameters('version')]",
        "administratorLogin": "[parameters('administratorLogin')]",
        "administratorLoginPassword": "[parameters('administratorLoginPassword')]",
        "availabilityZone": "[parameters('availabilityZone')]",
        "highAvailability": {
          "mode": "[parameters('haEnabled')]",
          "standbyAvailabilityZone": "[parameters('standbyAvailabilityZone')]"
        },
        "Storage": {
          "storageSizeGB": "[parameters('storageSizeGB')]",
          "iops": "[parameters('storageIops')]",
          "autogrow": "[parameters('storageAutogrow')]"
        },
        "Backup": {
          "backupRetentionDays": "[parameters('backupRetentionDays')]",
          "geoRedundantBackup": "[parameters('geoRedundantBackup')]"
        }
      },
      "tags": "[parameters('tags')]"
    },
    {
      "condition": "[greater(length(variables('firewallRules')), 0)]",
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "[concat('firewallRules-', copyIndex())]",
      "copy": {
        "count": "[if(greater(length(variables('firewallRules')), 0), length(variables('firewallRules')), 1)]",
        "mode": "Serial",
        "name": "firewallRulesIterator"
      },
      "dependsOn": [
        "[concat('Microsoft.DBforMySQL/flexibleServers/', parameters('serverName'))]"
      ],
      "properties": {
        "mode": "Incremental",
        "template": {
          "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "resources": [
            {
              "type": "Microsoft.DBforMySQL/flexibleServers/firewallRules",
              "name": "[concat(parameters('serverName'),'/',variables('firewallRules')[copyIndex()].name)]",
              "apiVersion": "[variables('api')]",
              "properties": {
                "StartIpAddress": "[variables('firewallRules')[copyIndex()].startIPAddress]",
                "EndIpAddress": "[variables('firewallRules')[copyIndex()].endIPAddress]"
              }
            }
          ]
        }
      }
    },
    {
      "type": "Microsoft.DBforMySQL/flexibleServers/databases",
      "apiVersion": "[variables('api')]",
      "name": "[concat(parameters('serverName'),'/',parameters('databaseName'))]",
      "dependsOn": [
        "[concat('Microsoft.DBforMySQL/flexibleServers/', parameters('serverName'))]"
      ],
      "properties": {
        "charset": "utf8",
        "collation": "utf8_general_ci"
      }
    }
  ]
}
```

## Create a server with private access

Create a _mysql-flexible-server-template.json_ file and copy this JSON script to create a server using private access connectivity method inside a virtual network.

```json
{
  "$schema": "http://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "administratorLogin": {
      "type": "string"
    },
    "administratorLoginPassword": {
      "type": "securestring"
    },
    "location": {
      "type": "string"
    },
    "serverName": {
      "type": "string"
    },
    "serverEdition": {
      "type": "string",
      "defaultValue": "Burstable",
      "metadata": {
        "description": "The tier of the particular SKU, e.g. Burstable, GeneralPurpose, MemoryOptimized. High Availability is available only for GeneralPurpose and MemoryOptimized sku."
      }
    },
    "skuName": {
      "type": "string",
      "defaultValue": "Standard_B1ms",
      "metadata": {
        "description": "The name of the sku, e.g. Standard_D32ds_v4."
      }
    },
    "storageSizeGB": {
      "type": "int"
    },
    "storageIops": {
      "type": "int"
    },
    "storageAutogrow": {
      "type": "string",
      "defaultValue": "Enabled"
    },
    "availabilityZone": {
      "type": "string",
      "metadata": {
        "description": "Availability Zone information of the server. (Leave blank for No Preference)."
      }
    },
    "version": {
      "type": "string"
    },
    "tags": {
      "type": "object",
      "defaultValue": {}
    },
    "haEnabled": {
      "type": "string",
      "defaultValue": "Disabled",
      "metadata": {
        "description": "High availability mode for a server : Disabled, SameZone, or ZoneRedundant"
      }
    },
    "standbyAvailabilityZone": {
      "type": "string",
      "metadata": {
        "description": "Availability zone of the standby server."
      }
    },
    "vnetName": {
      "type": "string",
      "defaultValue": "azure_mysql_vnet",
      "metadata": { "description": "Virtual Network Name" }
    },
    "subnetName": {
      "type": "string",
      "defaultValue": "azure_mysql_subnet",
      "metadata": { "description": "Subnet Name" }
    },
    "vnetAddressPrefix": {
      "type": "string",
      "defaultValue": "10.0.0.0/16",
      "metadata": { "description": "Virtual Network Address Prefix" }
    },
    "subnetPrefix": {
      "type": "string",
      "defaultValue": "10.0.0.0/24",
      "metadata": { "description": "Subnet Address Prefix" }
    },
    "backupRetentionDays": {
      "type": "int"
    },
    "geoRedundantBackup": {
      "type": "string"
    },
    "databaseName": {
      "type": "string"
    }
  },
  "variables": {
    "api": "2021-05-01"
  },
  "resources": [
    {
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2021-05-01",
      "name": "[parameters('vnetName')]",
      "location": "[parameters('location')]",
      "properties": {
        "addressSpace": {
          "addressPrefixes": [
            "[parameters('vnetAddressPrefix')]"
          ]
        }
      }
    },
    {
      "type": "Microsoft.Network/virtualNetworks/subnets",
      "apiVersion": "2021-05-01",
      "name": "[concat(parameters('vnetName'),'/',parameters('subnetName'))]",
      "dependsOn": [
        "[concat('Microsoft.Network/virtualNetworks/', parameters('vnetName'))]"
      ],
      "properties": {
        "addressPrefix": "[parameters('subnetPrefix')]",
        "delegations": [
          {
            "name": "MySQLflexibleServers",
            "properties": {
              "serviceName": "Microsoft.DBforMySQL/flexibleServers"
            }
          }
        ]
      }
    },
    {
      "type": "Microsoft.DBforMySQL/flexibleServers",
      "apiVersion": "[variables('api')]",
      "location": "[parameters('location')]",
      "name": "[parameters('serverName')]",
      "dependsOn": [
        "[resourceID('Microsoft.Network/virtualNetworks/subnets/', parameters('vnetName'), parameters('subnetName'))]"
      ],
      "sku": {
        "name": "[parameters('skuName')]",
        "tier": "[parameters('serverEdition')]"
      },
      "properties": {
        "version": "[parameters('version')]",
        "administratorLogin": "[parameters('administratorLogin')]",
        "administratorLoginPassword": "[parameters('administratorLoginPassword')]",
        "availabilityZone": "[parameters('availabilityZone')]",
        "highAvailability": {
          "mode": "[parameters('haEnabled')]",
          "standbyAvailabilityZone": "[parameters('standbyAvailabilityZone')]"
        },
        "Storage": {
          "storageSizeGB": "[parameters('storageSizeGB')]",
          "iops": "[parameters('storageIops')]",
          "autogrow": "[parameters('storageAutogrow')]"
        },
        "network": {
          "delegatedSubnetResourceId": "[resourceID('Microsoft.Network/virtualNetworks/subnets', parameters('vnetName'), parameters('subnetName'))]"
        },
        "Backup": {
          "backupRetentionDays": "[parameters('backupRetentionDays')]",
          "geoRedundantBackup": "[parameters('geoRedundantBackup')]"
        }
      },
      "tags": "[parameters('tags')]"
    },
    {
      "type": "Microsoft.DBforMySQL/flexibleServers/databases",
      "apiVersion": "[variables('api')]",
      "name": "[concat(parameters('serverName'),'/',parameters('databaseName'))]",
      "dependsOn": [
        "[concat('Microsoft.DBforMySQL/flexibleServers/', parameters('serverName'))]"
      ],
      "properties": {
        "charset": "utf8",
        "collation": "utf8_general_ci"
      }
    }

  ]
}
```

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
> [Build a PHP (Laravel) web app with MySQL](tutorial-php-database-app.md)
