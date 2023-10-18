---
title: Provision Web App with Azure Cache for Redis
description: Use Azure Resource Manager template to deploy web app with Azure Cache for Redis.
services: app-service
author: flang-msft
ms.service: cache
ms.custom: devx-track-arm-template
ms.topic: conceptual
ms.date: 01/06/2017
ms.author: franlanglois 
---

# Create a Web App plus Azure Cache for Redis using a template

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

In this article, you learn how to create an Azure Resource Manager template that deploys an Azure Web App with Azure Cache for Redis. You'll learn the following deployment details:

- How to define which resources are deployed
- How to define parameters that are specified when the deployment is executed

You can use this template for your own deployments, or customize it to meet your requirements.

For more information about creating templates, see [Authoring Azure Resource Manager templates](../azure-resource-manager/templates/syntax.md). To learn about the JSON syntax and properties for cache resource types, see [Microsoft.Cache resource types](/azure/templates/microsoft.cache/allversions).

For the complete template, see [Web App with Azure Cache for Redis template](https://github.com/Azure/azure-quickstart-templates/blob/master/quickstarts/microsoft.web/web-app-with-redis-cache/azuredeploy.json).

## What you will deploy

In this template, you deploy:

- Azure Web App
- Azure Cache for Redis

To run the deployment automatically, select the following button:

[![Deploy to Azure](./media/cache-web-app-arm-with-redis-cache-provision/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.web%2Fweb-app-with-redis-cache%2Fazuredeploy.json)

## Parameters to specify
[!INCLUDE [app-service-web-deploy-web-parameters](../../includes/app-service-web-deploy-web-parameters.md)]

[!INCLUDE [cache-deploy-parameters](../../includes/cache-deploy-parameters.md)]

## Variables for names
This template uses variables to construct names for the resources. It uses the [uniqueString](../azure-resource-manager/templates/template-functions-string.md#uniquestring) function to construct a value based on the
resource group id.

```json
"variables": {
  "hostingPlanName": "[concat('hostingplan', uniqueString(resourceGroup().id))]",
  "webSiteName": "[concat('webSite', uniqueString(resourceGroup().id))]",
  "cacheName": "[concat('cache', uniqueString(resourceGroup().id))]"
},
```


## Resources to deploy
[!INCLUDE [app-service-web-deploy-web-host](../../includes/app-service-web-deploy-web-host.md)]

### Azure Cache for Redis
Creates the Azure Cache for Redis that is used with the web app. The name of the cache is specified in the **cacheName** variable.

The template creates the cache in the same location as the resource group.

```json
{
  "name": "[variables('cacheName')]",
  "type": "Microsoft.Cache/Redis",
  "location": "[resourceGroup().location]",
  "apiVersion": "2015-08-01",
  "dependsOn": [ ],
  "tags": {
    "displayName": "cache"
  },
  "properties": {
    "sku": {
      "name": "[parameters('cacheSKUName')]",
      "family": "[parameters('cacheSKUFamily')]",
      "capacity": "[parameters('cacheSKUCapacity')]"
    }
  }
}
```


### Web app (Azure Cache for Redis)
Creates the web app with name specified in the **webSiteName** variable.

Notice that the web app is configured with app setting properties that enable it to work with the Azure Cache for Redis. These app settings are dynamically created based on values provided during deployment.

```json
{
  "apiVersion": "2015-08-01",
  "name": "[variables('webSiteName')]",
  "type": "Microsoft.Web/sites",
  "location": "[resourceGroup().location]",
  "dependsOn": [
    "[concat('Microsoft.Web/serverFarms/', variables('hostingPlanName'))]"
  ],
  "tags": {
    "[concat('hidden-related:', resourceGroup().id, '/providers/Microsoft.Web/serverfarms/', variables('hostingPlanName'))]": "empty",
    "displayName": "Website"
  },
  "properties": {
    "name": "[variables('webSiteName')]",
    "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]"
  },
  "resources": [
    {
      "apiVersion": "2015-08-01",
      "type": "config",
      "name": "appsettings",
      "dependsOn": [
        "[concat('Microsoft.Web/Sites/', variables('webSiteName'))]",
        "[concat('Microsoft.Cache/Redis/', variables('cacheName'))]"
      ],
      "properties": {
       "CacheConnection": "[concat(variables('cacheHostName'),'.redis.cache.windows.net,abortConnect=false,ssl=true,password=', listKeys(resourceId('Microsoft.Cache/Redis', variables('cacheName')), '2015-08-01').primaryKey)]"
      }
    }
  ]
}
```


### Web app (RedisEnterprise)
For RedisEnterprise, because the resource types are slightly different, the way to do **listKeys** is different:

```json
{
  "apiVersion": "2015-08-01",
  "name": "[variables('webSiteName')]",
  "type": "Microsoft.Web/sites",
  "location": "[resourceGroup().location]",
  "dependsOn": [
    "[concat('Microsoft.Web/serverFarms/', variables('hostingPlanName'))]"
  ],
  "tags": {
    "[concat('hidden-related:', resourceGroup().id, '/providers/Microsoft.Web/serverfarms/', variables('hostingPlanName'))]": "empty",
    "displayName": "Website"
  },
  "properties": {
    "name": "[variables('webSiteName')]",
    "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', variables('hostingPlanName'))]"
  },
  "resources": [
    {
      "apiVersion": "2015-08-01",
      "type": "config",
      "name": "appsettings",
      "dependsOn": [
        "[concat('Microsoft.Web/Sites/', variables('webSiteName'))]",
        "[concat('Microsoft.Cache/RedisEnterprise/databases/', variables('cacheName'), "/default")]",
      ],
      "properties": {
       "CacheConnection": "[concat(variables('cacheHostName'),abortConnect=false,ssl=true,password=', listKeys(resourceId('Microsoft.Cache/RedisEnterprise', variables('cacheName'), 'default'), '2020-03-01').primaryKey)]"
      }
    }
  ]
}
```

## Commands to run deployment
[!INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

### PowerShell

```azurepowershell
New-AzResourceGroupDeployment -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/web-app-with-redis-cache/azuredeploy.json -ResourceGroupName ExampleDeployGroup
```

### Azure CLI

```azurecli
azure group deployment create --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.web/web-app-with-redis-cache/azuredeploy.json -g ExampleDeployGroup
```
