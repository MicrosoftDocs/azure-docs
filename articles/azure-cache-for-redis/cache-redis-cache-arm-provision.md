---
title: Deploy Azure Cache for Redis with Azure Resource Manager
description: Learn how to use an Azure Resource Manager template to deploy an Azure Cache for Redis resource. Templates are provided for common scenarios. 
author: yegu-ms
ms.author: yegu
ms.service: cache
ms.topic: conceptual
ms.date: 01/23/2017
---
# Create an Azure Cache for Redis using a template

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

In this topic, you learn how to create an Azure Resource Manager template that deploys an Azure Cache for Redis. The cache can be used with an existing storage account to keep diagnostic data. You also learn how to define which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements.

Currently, diagnostic settings are shared for all caches in the same region for a subscription. Updating one cache in the region affects all other caches in the region.

For more information about creating templates, see [Authoring Azure Resource Manager Templates](../azure-resource-manager/templates/template-syntax.md). To learn about the JSON syntax and properties for cache resource types, see [Microsoft.Cache resource types](/azure/templates/microsoft.cache/allversions).

For the complete template, see [Azure Cache for Redis template](https://github.com/Azure/azure-quickstart-templates/blob/master/101-redis-cache/azuredeploy.json).

> [!NOTE]
> Resource Manager templates for the new [Premium tier](cache-premium-tier-intro.md) are available. 
> 
> * [Create a Premium Azure Cache for Redis with clustering](https://azure.microsoft.com/resources/templates/201-redis-premium-cluster-diagnostics/)
> * [Create Premium Azure Cache for Redis with data persistence](https://azure.microsoft.com/resources/templates/201-redis-premium-persistence/)
> * [Create Premium Redis Cache deployed into a Virtual Network](https://azure.microsoft.com/resources/templates/201-redis-premium-vnet/)
> 
> To check for the latest templates, see [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/) and search for `Azure Cache for Redis`.
> 
> 

## What you will deploy
In this template, you will deploy an Azure Cache for Redis that uses an existing storage account for diagnostic data.

To run the deployment automatically, click the following button:

[![Deploy to Azure](./media/cache-redis-cache-arm-provision/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-redis-cache%2Fazuredeploy.json)

## Parameters
With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called Parameters that contains all of the parameter values.
You should define a parameter for those values that vary based on the project you are deploying or based on the 
environment you are deploying to. Do not define parameters for values that always stay the same. Each parameter value is used in the template to define the resources that are deployed. 

[!INCLUDE [app-service-web-deploy-redis-parameters](../../includes/cache-deploy-parameters.md)]

### redisCacheLocation
The location of the Azure Cache for Redis. For best performance, use the same location as the app to be used with the cache.

    "redisCacheLocation": {
      "type": "string"
    }

### existingDiagnosticsStorageAccountName
The name of the existing storage account to use for diagnostics. 

    "existingDiagnosticsStorageAccountName": {
      "type": "string"
    }

### enableNonSslPort
A boolean value that indicates whether to allow access via non-SSL ports.

    "enableNonSslPort": {
      "type": "bool"
    }

### diagnosticsStatus
A value that indicates whether diagnostics is enabled. Use ON or OFF.

    "diagnosticsStatus": {
      "type": "string",
      "defaultValue": "ON",
      "allowedValues": [
            "ON",
            "OFF"
        ]
    }

## Resources to deploy
### Azure Cache for Redis
Creates the Azure Cache for Redis.

    {
      "apiVersion": "2015-08-01",
      "name": "[parameters('redisCacheName')]",
      "type": "Microsoft.Cache/Redis",
      "location": "[parameters('redisCacheLocation')]",
      "properties": {
        "enableNonSslPort": "[parameters('enableNonSslPort')]",
        "sku": {
          "capacity": "[parameters('redisCacheCapacity')]",
          "family": "[parameters('redisCacheFamily')]",
          "name": "[parameters('redisCacheSKU')]"
        }
      },
      "resources": [
        {
          "apiVersion": "2017-05-01-preview",
          "type": "Microsoft.Cache/redis/providers/diagnosticsettings",
          "name": "[concat(parameters('redisCacheName'), '/Microsoft.Insights/service')]",
          "location": "[parameters('redisCacheLocation')]",
          "dependsOn": [
            "[concat('Microsoft.Cache/Redis/', parameters('redisCacheName'))]"
          ],
          "properties": {
            "status": "[parameters('diagnosticsStatus')]",
            "storageAccountName": "[parameters('existingDiagnosticsStorageAccountName')]"
          }
        }
      ]
    }

## Commands to run deployment
[!INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

### PowerShell

    New-AzResourceGroupDeployment -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-redis-cache/azuredeploy.json -ResourceGroupName ExampleDeployGroup -redisCacheName ExampleCache

### Azure CLI
    azure group deployment create --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-redis-cache/azuredeploy.json -g ExampleDeployGroup
