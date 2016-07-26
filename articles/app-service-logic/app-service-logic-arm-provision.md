<properties 
	pageTitle="Create a Logic App using Azure Resource Manager templates in Azure App Service | Microsoft Azure" 
	description="Use an Azure Resource Manager template to deploy an empty Logic App for defining workflows." 
	services="app-service\logic" 
	documentationCenter="" 
	authors="MSFTMan" 
	manager="erikre" 
	editor=""/>

<tags 
	ms.service="logic-apps" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/27/2016" 
	ms.author="deonhe"/>

# Create a Logic App using a template

Use an Azure Resource Manager template to create an empty logic app that can be used to define workflows. You can define which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements.

For more details on the Logic app properties, see [Logic App Workflow Management API](https://msdn.microsoft.com/library/azure/mt643788.aspx). 

For examples of the definition itself, see [Author Logic App definitions](app-service-logic-author-definitions.md). 

For more information about creating templates, see [Authoring Azure Resource Manager Templates](../resource-group-authoring-templates.md).

For the complete template, see [Logic App template](https://github.com/Azure/azure-quickstart-templates/blob/master/101-logic-app-create/azuredeploy.json).

## What you will deploy

With this template, you deploy a logic app.

To run the deployment automatically, select the following button:  

[![Deploy to Azure](media/app-service-logic-arm-provision/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-logic-app-create%2Fazuredeploy.json)

## Parameters

[AZURE.INCLUDE [app-service-logic-deploy-parameters](../../includes/app-service-logic-deploy-parameters.md)]

### testUri

     "testUri": {
        "type": "string",
        "defaultValue": "http://azure.microsoft.com/en-us/status/feed/"
      }
    
## Resources to deploy

### App service plan

Creates an app service plan. 

It uses the same location as the resource group to which it is being deployed.

    {
      "apiVersion": "2015-08-01",
      "name": "[parameters('hostingPlanName')]",
      "type": "Microsoft.Web/serverfarms",
      "location": "[resourceGroup().location]",
      "tags": {
        "displayName": "HostingPlan"
      },
      "sku": {
        "name": "[parameters('hostingSkuName')]",
        "capacity": "[parameters('hostingSkuCapacity')]"
      },
      "properties": {
        "name": "[parameters('hostingPlanName')]"
      }
    },


### Logic app

Creates the logic app.

The templates uses a parameter value for the logic app name. It sets the location of the logic app to the same location as the resource group. 

This particular definition runs once an hour, and pings the location specified in the **testUri** parameter. 

    {
      "type": "Microsoft.Logic/workflows",
      "apiVersion": "2015-08-01-preview",
      "name": "[parameters('logicAppName')]",
      "location": "[resourceGroup().location]",
      "tags": {
        "displayName": "LogicApp"
      },
      "properties": {
        "sku": {
          "name": "[parameters('flowSkuName')]",
          "plan": {
            "id": "[concat(resourceGroup().id, '/providers/Microsoft.Web/serverfarms/',parameters('hostingPlanName'))]"
          }
        },
        "definition": {
          "$schema": "http://schema.management.azure.com/providers/Microsoft.Logic/schemas/2014-12-01-preview/workflowdefinition.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "testURI": {
              "type": "string",
              "defaultValue": "[parameters('testUri')]"
            }
          },
          "triggers": {
            "recurrence": {
              "type": "recurrence",
              "recurrence": {
                "frequency": "Hour",
                "interval": 1
              }
            }
          },
          "actions": {
            "http": {
              "type": "Http",
              "inputs": {
                "method": "GET",
                "uri": "@parameters('testUri')"
              }
            }
          },
          "outputs": {}
        },
        "parameters": {}
      }
    }


## Commands to run deployment

[AZURE.INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

### PowerShell

    New-AzureRmResourceGroupDeployment -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-logic-app-create/azuredeploy.json -ResourceGroupName ExampleDeployGroup

### Azure CLI

    azure group deployment create --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-logic-app-create/azuredeploy.json -g ExampleDeployGroup


 
