---
title: 'Quickstart: Create an Azure DB for MySQL - Flexible Server - ARM template'
description: In this Quickstart, learn how to create an Azure Database for MySQL - Flexible Server using ARM template.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: shreyaaithal
ms.author: shaithal
ms.custom: subject-armqs, devx-track-azurepowershell, mode-arm
ms.date: 02/16/2023
---

# Quickstart: Use an ARM template to create an Azure Database for MySQL - Flexible Server

[!INCLUDE [applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

[!INCLUDE [About Azure Database for MySQL - Flexible Server](../includes/azure-database-for-mysql-flexible-server-abstract.md)]

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

- An Azure account with an active subscription.

[!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]

## Create server with public access

Create an **azuredeploy.json** file with the following content to create a server using public access connectivity method and also create a database on the server. Update the **firewallRules** default value if needed.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "resourceNamePrefix": {
      "type": "string",
      "metadata": {
        "description": "Provide a prefix for creating resource names."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "administratorLogin": {
      "type": "string"
    },
    "administratorLoginPassword": {
      "type": "securestring"
    },
    "firewallRules": {
      "type": "array",
      "defaultValue": [
        {
          "name": "rule1",
          "startIPAddress": "192.168.0.1",
          "endIPAddress": "192.168.0.255"
        },
        {
          "name": "rule2",
          "startIPAddress": "192.168.1.1",
          "endIPAddress": "192.168.1.255"
        }
      ]
    },
    "serverEdition": {
      "type": "string",
      "defaultValue": "Burstable",
      "allowedValues": [
        "Burstable",
        "Generalpurpose",
        "MemoryOptimized"
      ],
      "metadata": {
        "description": "The tier of the particular SKU. High Availability is available only for GeneralPurpose and MemoryOptimized sku."
      }
    },
    "version": {
      "type": "string",
      "defaultValue": "8.0.21",
      "allowedValues": [
        "5.7",
        "8.0.21"
      ],
      "metadata": {
        "description": "Server version"
      }
    },
    "availabilityZone": {
      "type": "string",
      "defaultValue": "1",
      "metadata": {
        "description": "Availability Zone information of the server. (Leave blank for No Preference)."
      }
    },
    "haEnabled": {
      "type": "string",
      "defaultValue": "Disabled",
      "allowedValues": [
        "Disabled",
        "SameZone",
        "ZoneRedundant"
      ],
      "metadata": {
        "description": "High availability mode for a server : Disabled, SameZone, or ZoneRedundant"
      }
    },
    "standbyAvailabilityZone": {
      "type": "string",
      "defaultValue": "2",
      "metadata": {
        "description": "Availability zone of the standby server."
      }
    },
    "storageSizeGB": {
      "type": "int",
      "defaultValue": 20
    },
    "storageIops": {
      "type": "int",
      "defaultValue": 360
    },
    "storageAutogrow": {
      "type": "string",
      "defaultValue": "Enabled",
      "allowedValues": [
        "Enabled",
        "Disabled"
      ]
    },
    "skuName": {
      "type": "string",
      "defaultValue": "Standard_B1ms",
      "metadata": {
        "description": "The name of the sku, e.g. Standard_D32ds_v4."
      }
    },
    "backupRetentionDays": {
      "type": "int",
      "defaultValue": 7
    },
    "geoRedundantBackup": {
      "type": "string",
      "defaultValue": "Disabled",
      "allowedValues": [
        "Disabled",
        "Enabled"
      ]
    },
    "serverName": {
      "type": "string",
      "defaultValue": "[format('{0}mysqlserver', parameters('resourceNamePrefix'))]"
    },
    "databaseName": {
      "type": "string",
      "defaultValue": "[format('{0}mysqldb', parameters('resourceNamePrefix'))]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.DBforMySQL/flexibleServers",
      "apiVersion": "2021-12-01-preview",
      "name": "[parameters('serverName')]",
      "location": "[parameters('location')]",
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
        "storage": {
          "storageSizeGB": "[parameters('storageSizeGB')]",
          "iops": "[parameters('storageIops')]",
          "autoGrow": "[parameters('storageAutogrow')]"
        },
        "backup": {
          "backupRetentionDays": "[parameters('backupRetentionDays')]",
          "geoRedundantBackup": "[parameters('geoRedundantBackup')]"
        }
      }
    },
    {
      "type": "Microsoft.DBforMySQL/flexibleServers/databases",
      "apiVersion": "2021-12-01-preview",
      "name": "[format('{0}/{1}', parameters('serverName'), parameters('databaseName'))]",
      "properties": {
        "charset": "utf8",
        "collation": "utf8_general_ci"
      },
      "dependsOn": [
        "[resourceId('Microsoft.DBforMySQL/flexibleServers', parameters('serverName'))]"
      ]
    },
    {
      "copy": {
        "name": "createFirewallRules",
        "count": "[length(range(0, if(greater(length(parameters('firewallRules')), 0), length(parameters('firewallRules')), 1)))]",
        "mode": "serial",
        "batchSize": 1
      },
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2020-10-01",
      "name": "[format('firewallRules-{0}', range(0, if(greater(length(parameters('firewallRules')), 0), length(parameters('firewallRules')), 1))[copyIndex()])]",
      "properties": {
        "expressionEvaluationOptions": {
          "scope": "inner"
        },
        "mode": "Incremental",
        "parameters": {
          "ip": {
            "value": "[parameters('firewallRules')[range(0, if(greater(length(parameters('firewallRules')), 0), length(parameters('firewallRules')), 1))[copyIndex()]]]"
          },
          "serverName": {
            "value": "[parameters('serverName')]"
          }
        },
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "serverName": {
              "type": "string"
            },
            "ip": {
              "type": "object"
            }
          },
          "resources": [
            {
              "type": "Microsoft.DBforMySQL/flexibleServers/firewallRules",
              "apiVersion": "2021-12-01-preview",
              "name": "[format('{0}/{1}', parameters('serverName'), parameters('ip').name)]",
              "properties": {
                "startIpAddress": "[parameters('ip').startIPAddress]",
                "endIpAddress": "[parameters('ip').endIPAddress]"
              }
            }
          ]
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.DBforMySQL/flexibleServers', parameters('serverName'))]"
      ]
    }
  ]
}
```

## Create a server with private access

Create an **azuredeploy.json** file with the following content to create a server using private access connectivity method inside a virtual network.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "resourceNamePrefix": {
      "type": "string",
      "metadata": {
        "description": "Provide a prefix for creating resource names."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "administratorLogin": {
      "type": "string"
    },
    "administratorLoginPassword": {
      "type": "securestring"
    },
    "firewallRules": {
      "type": "array",
      "defaultValue": [
        {
          "name": "rule1",
          "startIPAddress": "192.168.0.1",
          "endIPAddress": "192.168.0.255"
        },
        {
          "name": "rule2",
          "startIPAddress": "192.168.1.1",
          "endIPAddress": "192.168.1.255"
        }
      ]
    },
    "serverEdition": {
      "type": "string",
      "defaultValue": "Burstable",
      "allowedValues": [
        "Burstable",
        "Generalpurpose",
        "MemoryOptimized"
      ],
      "metadata": {
        "description": "The tier of the particular SKU. High Availability is available only for GeneralPurpose and MemoryOptimized sku."
      }
    },
    "version": {
      "type": "string",
      "defaultValue": "8.0.21",
      "allowedValues": [
        "5.7",
        "8.0.21"
      ],
      "metadata": {
        "description": "Server version"
      }
    },
    "availabilityZone": {
      "type": "string",
      "defaultValue": "1",
      "metadata": {
        "description": "Availability Zone information of the server. (Leave blank for No Preference)."
      }
    },
    "haEnabled": {
      "type": "string",
      "defaultValue": "Disabled",
      "allowedValues": [
        "Disabled",
        "SameZone",
        "ZoneRedundant"
      ],
      "metadata": {
        "description": "High availability mode for a server : Disabled, SameZone, or ZoneRedundant"
      }
    },
    "standbyAvailabilityZone": {
      "type": "string",
      "defaultValue": "2",
      "metadata": {
        "description": "Availability zone of the standby server."
      }
    },
    "storageSizeGB": {
      "type": "int",
      "defaultValue": 20
    },
    "storageIops": {
      "type": "int",
      "defaultValue": 360
    },
    "storageAutogrow": {
      "type": "string",
      "defaultValue": "Enabled",
      "allowedValues": [
        "Enabled",
        "Disabled"
      ]
    },
    "skuName": {
      "type": "string",
      "defaultValue": "Standard_B1ms",
      "metadata": {
        "description": "The name of the sku, e.g. Standard_D32ds_v4."
      }
    },
    "backupRetentionDays": {
      "type": "int",
      "defaultValue": 7
    },
    "geoRedundantBackup": {
      "type": "string",
      "defaultValue": "Disabled",
      "allowedValues": [
        "Disabled",
        "Enabled"
      ]
    },
    "serverName": {
      "type": "string",
      "defaultValue": "[format('{0}mysqlserver', parameters('resourceNamePrefix'))]"
    },
    "databaseName": {
      "type": "string",
      "defaultValue": "[format('{0}mysqldb', parameters('resourceNamePrefix'))]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.DBforMySQL/flexibleServers",
      "apiVersion": "2021-12-01-preview",
      "name": "[parameters('serverName')]",
      "location": "[parameters('location')]",
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
        "storage": {
          "storageSizeGB": "[parameters('storageSizeGB')]",
          "iops": "[parameters('storageIops')]",
          "autoGrow": "[parameters('storageAutogrow')]"
        },
        "backup": {
          "backupRetentionDays": "[parameters('backupRetentionDays')]",
          "geoRedundantBackup": "[parameters('geoRedundantBackup')]"
        }
      }
    },
    {
      "type": "Microsoft.DBforMySQL/flexibleServers/databases",
      "apiVersion": "2021-12-01-preview",
      "name": "[format('{0}/{1}', parameters('serverName'), parameters('databaseName'))]",
      "properties": {
        "charset": "utf8",
        "collation": "utf8_general_ci"
      },
      "dependsOn": [
        "[resourceId('Microsoft.DBforMySQL/flexibleServers', parameters('serverName'))]"
      ]
    },
    {
      "copy": {
        "name": "createFirewallRules",
        "count": "[length(range(0, if(greater(length(parameters('firewallRules')), 0), length(parameters('firewallRules')), 1)))]",
        "mode": "serial",
        "batchSize": 1
      },
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2020-10-01",
      "name": "[format('firewallRules-{0}', range(0, if(greater(length(parameters('firewallRules')), 0), length(parameters('firewallRules')), 1))[copyIndex()])]",
      "properties": {
        "expressionEvaluationOptions": {
          "scope": "inner"
        },
        "mode": "Incremental",
        "parameters": {
          "ip": {
            "value": "[parameters('firewallRules')[range(0, if(greater(length(parameters('firewallRules')), 0), length(parameters('firewallRules')), 1))[copyIndex()]]]"
          },
          "serverName": {
            "value": "[parameters('serverName')]"
          }
        },
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "serverName": {
              "type": "string"
            },
            "ip": {
              "type": "object"
            }
          },
          "resources": [
            {
              "type": "Microsoft.DBforMySQL/flexibleServers/firewallRules",
              "apiVersion": "2021-12-01-preview",
              "name": "[format('{0}/{1}', parameters('serverName'), parameters('ip').name)]",
              "properties": {
                "startIpAddress": "[parameters('ip').startIPAddress]",
                "endIpAddress": "[parameters('ip').endIPAddress]"
              }
            }
          ]
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.DBforMySQL/flexibleServers', parameters('serverName'))]"
      ]
    }
  ]
}
```

## Deploy the template

Deploy the Bicep file using either Azure CLI or Azure PowerShell.

# [CLI](#tab/CLI)

```azurecli
az group create --name exampleRG --location eastus
az deployment group create --resource-group exampleRG --template-file azuredeploy.json
```

# [PowerShell](#tab/PowerShell)

<<<<<<< HEAD
Follow these steps to verify if your server was created in Azure.

### Azure portal

1. In the [Azure portal](https://portal.azure.com), search for and select **Azure Database for MySQL servers**.
1. In the database list, select your new server. The **Overview** page for your new Azure Database for MySQL server appears.

### PowerShell

You'll have to enter the name of the new server to view the details of your Azure Database for MySQL - Flexible Server.

```azurepowershell-interactive
$serverName = Read-Host -Prompt "Enter the name of your Azure Database for MySQL server"
Get-AzResource -ResourceType "Microsoft.DBforMySQL/flexibleServers" -Name $serverName | ft
Write-Host "Press [ENTER] to continue..."
```

### CLI

You'll have to enter the name and the resource group of the new server to view details about your Azure Database for MySQL - Flexible Server.

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
=======
```azurepowershell
New-AzResourceGroup -Name exampleRG -Location eastus
New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile azuredeploy.json
>>>>>>> 60651a3d247d2413e6b9c5a301d846ded7170aa7
```

---

Follow the instructions to enter the parameter values. When the deployment finishes, you should see a message indicating the deployment succeeded.

## Review deployed resources

Follow these steps to verify if your server was created in the resource group.

# [CLI](#tab/CLI)

```azurecli
az resource list --resource-group exampleRG

```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Get-AzResource -ResourceGroupName exampleRG
```
---

## Clean up resources

To delete the resource group and the resources contained in the resource group:

# [CLI](#tab/CLI)

```azurecli
az group delete --name exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Remove-AzResourceGroup -Name exampleRG
```

---


## Next steps

For a step-by-step tutorial that guides you through the process of creating an ARM template, see:

> [!div class="nextstepaction"]
> [Tutorial: Create and deploy your first ARM template](../../azure-resource-manager/templates/template-tutorial-create-first-template.md)

For a step-by-step tutorial to build an app with App Service using MySQL, see:

> [!div class="nextstepaction"]
> [Build a PHP (Laravel) web app with MySQL](tutorial-php-database-app.md)
