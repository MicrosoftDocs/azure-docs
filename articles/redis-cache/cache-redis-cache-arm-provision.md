<properties 
	pageTitle="Provision a Redis Cache | Microsoft Azure" 
	description="Use Azure Resource Manager template to deploy an Azure Redis Cache." 
	services="app-service" 
	documentationCenter="" 
	authors="steved0x" 
	manager="Erikre" 
	editor=""/>

<tags 
	ms.service="cache" 
	ms.workload="web" 
	ms.tgt_pltfrm="cache-redis" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="07/12/2016" 
	ms.author="sdanie"/>

# Create a Redis Cache using a template

In this topic, you will learn how to create an Azure Resource Manager template that deploys an Azure Redis Cache. The cache can be used with an existing storage account to keep diagnostic data. You will learn how to define which resources are deployed and 
how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements.

Currently, diagnostic settings are shared for all caches in the same region for a subscription. Updating one cache in the region will affect all other caches in the region.

For more information about creating templates, see [Authoring Azure Resource Manager Templates](../resource-group-authoring-templates.md).

For the complete template, see [Redis Cache template](https://github.com/Azure/azure-quickstart-templates/blob/master/101-redis-cache/azuredeploy.json).

>[AZURE.NOTE] ARM templates for the new [Premium tier](cache-premium-tier-intro.md) are available. 
>
>-    [Create a Premium Redis Cache with clustering](https://azure.microsoft.com/documentation/templates/201-redis-premium-cluster-diagnostics/)
>-    [Create Premium Redis Cache with data persistence](https://azure.microsoft.com/documentation/templates/201-redis-premium-persistence/)
>-    [Create Premium Redis Cache with VNet and optional clustering](https://azure.microsoft.com/documentation/templates/201-redis-premium-vnet-cluster-diagnostics/)
>
>To check for the latest templates, see [Azure Quickstart Templates](https://azure.microsoft.com/documentation/templates/) and search for `Redis Cache`.

## What you will deploy

In this template, you will deploy an Azure Redis Cache that uses an existing storage account for diagnostic data.

To run the deployment automatically, click the following button:

[![Deploy to Azure](./media/cache-redis-cache-arm-provision/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-redis-cache%2Fazuredeploy.json)

## Parameters

With Azure Resource Manager, you define parameters for values you want to specify when the template is deployed. The template includes a section called Parameters that contains all of the parameter values.
You should define a parameter for those values that will vary based on the project you are deploying or based on the 
environment you are deploying to. Do not define parameters for values that will always stay the same. Each parameter value is used in the template to define the resources that are deploy. 

We will describe each parameter in the template.

[AZURE.INCLUDE [app-service-web-deploy-redis-parameters](../../includes/cache-deploy-parameters.md)]

### redisCacheLocation

The location of the Redics Cache. For best perfomance, use the same location as the app to be used with the cache.

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

A value that indicates whether diagnostices is enabled. Use ON or OFF.

    "diagnosticsStatus": {
      "type": "string",
      "defaultValue": "ON",
      "allowedValues": [
            "ON",
            "OFF"
        ]
    }
    
## Resources to deploy

### Redis Cache

Creates the Azure Redis Cache.

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
          "apiVersion": "2015-07-01",
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

[AZURE.INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)] 

### PowerShell

    New-AzureRmResourceGroupDeployment -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-redis-cache/azuredeploy.json -ResourceGroupName ExampleDeployGroup -redisCacheName ExampleCache -redisCacheLocation "West US"

### Azure CLI

    azure group deployment create --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-redis-cache/azuredeploy.json -g ExampleDeployGroup


