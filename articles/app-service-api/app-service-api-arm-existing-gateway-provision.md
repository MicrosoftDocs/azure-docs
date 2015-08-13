<properties 
	pageTitle="Deploy an API app with an existing gateway" 
	description="Use an Azure Resource Manager template to deploy an API app that uses an existing gateway and App Service plan." 
	services="app-service\api" 
	documentationCenter="" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-api" 
	ms.workload="web" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="08/04/2015" 
	ms.author="tomfitz"/>

# Provision an API app with an existing gateway

In this topic, you will learn how to create an Azure Resource Manager template that deploys an Azure API app and an existing gateway. You will learn how to define which resources are deployed and 
how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements.

For more information about creating templates, see [Authoring Azure Resource Manager Templates](../resource-group-authoring-templates.md).

For more information about deploying apps, see [Deploy a complex application predictably in Azure](../app-service-web/app-service-deploy-complex-application-predictably.md).

For the complete template, see [API App with existing gateway  template](https://github.com/Azure/azure-quickstart-templates/blob/master/201-api-app-gateway-existing/azuredeploy.json).

## What you will deploy

In this template, you will deploy an API app that is associated with an existing App Service hosting plan and an existing gateway.

To run the deployment automatically, click the following button:

[![Deploy to Azure](http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-api-app-gateway-existing%2Fazuredeploy.json)

## Parameters

[AZURE.INCLUDE [app-service-api-deploy-parameters](../../includes/app-service-api-deploy-parameters.md)]

### hostingPlanId

The identifier of the existing App Service hosting plan.

    "hostingPlanId": {
      "type": "string"
    }

### hostingPlanSettings

The settings of the existing hosting plan.

    "hostingPlanSettings": {
      "type": "Object",
      "defaultValue": {
        "hostingEnvironment": ""
      }
    }

## Variables

This template defines a variable which is used when deploying the resources.

    "variables": {
      "packageId": "Microsoft.ApiApp"
    }
    
The value is used below as **variables('packageId')**. It contains the NuGet package Id for API apps.

## Resources to deploy

### Web app to host API app

Creates a web app that hosts the API app. 

Notice that **kind** is set to **apiApp** which notifies the Azure portal that this web app is hosting an API app. The portal will hide the web app from the browse web apps blade. The app includes an extension 
to install the default empty API app package. A link is defined between the API app and the hosting web app. The app settings section includes necessary values for hosting the API app. The **serverFarmId** property is set to the value you provided in the **hostingPlanId** parameter.

    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2015-04-01",
      "name": "[parameters('apiAppName')]",
      "location": "[parameters('location')]",
      "kind": "apiApp",
      "resources": [
        {
          "type": "siteextensions",
          "apiVersion": "2015-02-01",
          "name": "[variables('packageId')]",
          "dependsOn": [
            "[resourceId('Microsoft.Web/sites', parameters('apiAppName'))]"
          ],
          "properties": {
            "type": "WebRoot",
            "feed_url": "http://apiapps-preview.nuget.org/api/v2/",
            "version": "0.9.4"
          }
        },
        {
          "type": "providers/links",
          "apiVersion": "2015-01-01",
          "name": "Microsoft.Resources/apiApp",
          "dependsOn": [
            "[resourceId('Microsoft.Web/sites', parameters('apiAppName'))]"
          ],
          "properties": {
            "targetId": "[resourceId('Microsoft.AppService/apiapps', parameters('apiAppName'))]"
          }
        }
      ],
      "properties": {
        "name": "[parameters('apiAppName')]",
        "gatewaySiteName": "[parameters('gatewayName')]",
        "serverFarmId": "[parameters('hostingPlanId')]",
        "hostingEnvironment": "[parameters('hostingPlanSettings').hostingEnvironment]",
        "siteConfig": {
          "appSettings": [
            {
              "name": "EMA_MicroserviceId",
              "value": "[parameters('apiAppName')]"
            },
            {
              "name": "EMA_Secret",
              "value": "[parameters('apiAppSecret')]"
            },
            {
              "name": "EMA_RuntimeUrl",
              "value": "[concat('https://', parameters('gatewayName'), '.azurewebsites.net')]"
            },
            {
              "name": "WEBSITE_START_SCM_ON_SITE_CREATION",
              "value": "1"
            }
          ]
        }
      }
    }

### API app

Create the API app.

Notice that the names of the hosting web app and gateway are defined as properties in the API app. 

    {
      "type": "Microsoft.AppService/apiapps",
      "apiVersion": "2015-03-01-preview",
      "name": "[parameters('apiAppName')]",
      "location": "[parameters('location')]",
      "resources": [
        {
          "type": "providers/links",
          "apiVersion": "2015-01-01",
          "name": "Microsoft.Resources/apiAppSite",
          "dependsOn": [
            "[resourceId('Microsoft.AppService/apiapps', parameters('apiAppName'))]"
          ],
          "properties": {
            "targetId": "[resourceId('Microsoft.Web/sites', parameters('apiAppName'))]"
          }
        }
      ],
      "dependsOn": [
        "[resourceId('Microsoft.Web/sites/siteextensions', parameters('apiAppName'), variables('packageId'))]"
      ],
      "properties": {
        "package": {
          "id": "[variables('packageId')]"
        },
        "host": {
          "resourceName": "[parameters('apiAppName')]"
        },
        "gateway": {
          "resourceName": "[parameters('gatewayName')]"
        }
      }
    }


## Commands to run deployment

[AZURE.INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

### PowerShell

    New-AzureResourceGroupDeployment -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-api-app-gateway-existing/azuredeploy.json

### Azure CLI

    azure group deployment create --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-api-app-gateway-existing/azuredeploy.json


 
