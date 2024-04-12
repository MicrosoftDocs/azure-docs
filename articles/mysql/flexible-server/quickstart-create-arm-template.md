---
title: 'Quickstart: Create a flexible server by using Azure Resource Manager'
description: In this quickstart, learn how to deploy a database in an instance of Azure Database for MySQL - Flexible Server by using an Azure Resource Manager template.
ms.service: mysql
ms.subservice: flexible-server
ms.topic: quickstart
author: shreyaaithal
ms.author: shaithal
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
ms.date: 02/16/2023
---

# Quickstart: Create an instance of Azure Database for MySQL - Flexible Server by using Azure Resource Manager

[!INCLUDE[applies-to-mysql-flexible-server](../includes/applies-to-mysql-flexible-server.md)]

[!INCLUDE [azure-database-for-mysql-flexible-server-abstract](../includes/Azure-database-for-mysql-flexible-server-abstract.md)]

[!INCLUDE [About Azure Resource Manager](../../../includes/resource-manager-quickstart-introduction.md)]

## Prerequisites

- An Azure account with an active subscription.

[!INCLUDE [flexible-server-free-trial-note](../includes/flexible-server-free-trial-note.md)]

## Create a server that has public access

To create an Azure Database for MySQL - Flexible Server instance by using the public access connectivity method and create a database on the server, create an *azuredeploy.json* file that has the following code examples. If necessary, update the default value for `firewallRules`.

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
        "GeneralPurpose",
        "MemoryOptimized"
      ],
      "metadata": {
        "description": "The tier of the specific SKU. High availability is available only for GeneralPurpose and MemoryOptimized SKUs."
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
        "description": "The availability zone information of the server. (If you don't have a preference, leave this setting blank.)"
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
        "description": "High availability mode for a server: Disabled, SameZone, or ZoneRedundant."
      }
    },
    "standbyAvailabilityZone": {
      "type": "string",
      "defaultValue": "2",
      "metadata": {
        "description": "The availability zone of the standby server."
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
        "description": "The name of the SKU. For example, Standard_D32ds_v4."
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

## Create a server that has private access

Modify the following code examples to create an Azure Database for MySQL flexible server that has private access connectivity inside a virtual network:

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
        "GeneralPurpose",
        "MemoryOptimized"
      ],
      "metadata": {
        "description": "The tier of the specific SKU. High availability is available only for GeneralPurpose and MemoryOptimized SKUs."
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
        "description": "The availability zone information of the server. (If you have no preference, leave blank.)"
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
        "description": "High availability mode for a server: Disabled, SameZone, or ZoneRedundant"
      }
    },
    "standbyAvailabilityZone": {
      "type": "string",
      "defaultValue": "2",
      "metadata": {
        "description": "The availability zone of the standby server."
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
        "description": "The name of the SKU. For example, Standard_D32ds_v4."
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

Deploy the JSON file by using either the Azure CLI or Azure PowerShell.

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create --name exampleRG --location eastus
az deployment group create --resource-group exampleRG --template-file azuredeploy.json
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup -Name exampleRG -Location eastus
New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile azuredeploy.json
```

---

Complete the steps to enter the parameter values. When the deployment finishes, a message indicates a successful deployment.

## Review deployed resources

To verify that your Azure Database for MySQL flexible server was created in the resource group:

# [Azure CLI](#tab/azure-cli)

```azurecli
az resource list --resource-group exampleRG

```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Get-AzResource -ResourceGroupName exampleRG
```

---

## Clean up resources

To delete the resource group and all the resources that are in the resource group:

# [Azure CLI](#tab/azure-cli)

```azurecli
az group delete --name exampleRG
```

# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell
Remove-AzResourceGroup -Name exampleRG
```

---

## Related content

- For a step-by-step tutorial that guides you through the process of creating an ARM template, see [Tutorial: Create and deploy your first ARM template](../../azure-resource-manager/templates/template-tutorial-create-first-template.md).
- For a step-by-step tutorial that demonstrates how to build an app by using Azure App Service and MySQL, see [Build a PHP (Laravel) web app with MySQL](tutorial-php-database-app.md).
