<properties 
	pageTitle="Create a Logic App with an API app | Microsoft Azure" 
	description="Use an Azure Resource Manager template to deploy a Logic App and an API app." 
	services="app-service\logic" 
	documentationCenter="" 
	authors="tfitzmac" 
	manager="wpickett" 
	editor=""/>

<tags 
	ms.service="app-service-logic" 
	ms.workload="integration" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/04/2016" 
	ms.author="tomfitz"/>

# Create a Logic App plus API app using a template

In this topic, you learn how to create an Azure Resource Manager template to create a logic app with an App Service API app. You can use the logic app to design workflows that articulate intent through a trigger and a series of steps, each invoking the API app while securely taking care of authentication and best practices like durable execution.

You learn how to define which resources are deployed and how to define parameters that are specified when the deployment is executed. You can use this template for your own deployments, or customize it to meet your requirements.

For more details on the logic app properties, see [Logic App Workflow Management API](https://msdn.microsoft.com/library/azure/mt643788.aspx). 

For examples of the definition itself, see [Author Logic App definitions](app-service-logic-author-definitions.md). 

For more information about creating templates, see [Authoring Azure Resource Manager Templates](../resource-group-authoring-templates.md).

For the complete template, see [Logic App with API app template](https://github.com/Azure/azure-quickstart-templates/blob/master/201-logic-app-api-app-create/azuredeploy.json).

## What you will deploy

With this template, you provision:

- Logic App
- API app

To run the deployment automatically, select the following button:

[![Deploy to Azure](media/app-service-logic-arm-with-api-app-provision/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-logic-app-api-app-create%2Fazuredeploy.json) 

## Parameters

[AZURE.INCLUDE [app-service-logic-deploy-parameters](../../includes/app-service-logic-deploy-parameters.md)]

### apiAppName

The name of the API app.

    "apiAppName": {
        "type": "string"
    }

### gatewayName

The name of the gateway.

    "gatewayName": {
        "type": "string"
    }

### gatewayToApiAppSecret

The secret for the API app.

    "gatewayToApiAppSecret": {
        "defaultValue": "0000000000000000000000000000000000000000000000000000000000000000",
        "type": "securestring"
    }
    
## Resources to deploy

### App service plan

Creates an app service plan. 

It uses the same location as the resource group to which it is being deployed.

    {
        "apiVersion": "2014-06-01",
        "name": "[parameters('svcPlanName')]",
        "type": "Microsoft.Web/serverfarms",
        "location": "[resourceGroup().location]",
        "tags": {
            "displayName": "AppServicePlan"
        },
        "properties": {
            "name": "[parameters('svcPlanName')]",
            "sku": "[parameters('sku')]",
            "workerSize": "[parameters('svcPlanSize')]",
            "numberOfWorkers": 1
        }
    }

### Web app that hosts the gateway

Creates the web app to host the gateway.

    {
        "type": "Microsoft.Web/sites",
        "apiVersion": "2015-04-01",
        "name": "[parameters('gatewayName')]",
        "location": "[resourceGroup().location]",
        "kind": "gateway",
        "tags": {
            "displayName": "GatewayHost"
        },
        "resources": [
            {
                "type": "providers/links",
                "apiVersion": "2015-01-01",
                "name": "Microsoft.Resources/gateway",
                "dependsOn": [
                    "[resourceId('Microsoft.Web/sites',parameters('gatewayName'))]"
                ],
                "properties": {
                    "targetId": "[resourceId('Microsoft.AppService/gateways', parameters('gatewayName'))]"
                }
            }
        ],
        "dependsOn": [
            "[concat(resourceGroup().id, '/providers/Microsoft.Web/serverfarms/',parameters('svcPlanName'))]"
        ],
        "properties": {
            "name": "[parameters('gatewayName')]",
            "gatewaySiteName": "[parameters('gatewayName')]",
            "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('svcPlanName'))]",
            "siteConfig": {
                "appSettings": [
                    {
                        "name": "ApiAppsGateway_EXTENSION_VERSION",
                        "value": "latest"
                    },
                    {
                        "name": "EmaStorage",
                        "value": "D:\\home\\data\\apiapps"
                    },
                    {
                        "name": "WEBSITE_START_SCM_ON_SITE_CREATION",
                        "value": "1"
                    }
                ]
            }
        }
    }

### Gateway

Notice that the gateway includes a child resource for an authentication token. This token is used by the Logic app to call into the gateway.

    {
        "type": "Microsoft.AppService/gateways",
        "apiVersion": "2015-03-01-preview",
        "name": "[parameters('gatewayName')]",
        "location": "[resourceGroup().location]",
        "tags": {
            "displayName": "Gateway"
        },
        "resources": [
            {
                "type": "providers/links",
                "apiVersion": "2015-01-01",
                "name": "Microsoft.Resources/gatewaySite",
                "dependsOn": [
                    "[resourceId('Microsoft.AppService/gateways',parameters('gatewayName'))]"
                ],
                "properties": {
                    "targetId": "[resourceId('Microsoft.Web/sites',parameters('gatewayName'))]"
                }
            },
            {
                "type": "tokens",
                "apiVersion": "2015-03-01-preview",
                "location": "[resourceGroup().location]",
                "name": "[parameters('logicAppName')]",
                "tags": {
                    "displayName": "AuthenticationToken"
                },
                "dependsOn": [
                    "[resourceId('Microsoft.AppService/gateways', parameters('gatewayName'))]"
                ]
            }
        ],
        "dependsOn": [
            "[resourceId('Microsoft.Web/sites', parameters('gatewayName'))]"
        ],
        "properties": {
            "host": {
                "resourceName": "[parameters('gatewayName')]"
            }
        }
    }

### Web app to host the API app

    {
        "type": "Microsoft.Web/sites",
        "apiVersion": "2015-04-01",
        "name": "[parameters('apiAppName')]",
        "location": "[resourceGroup().location]",
        "kind": "apiApp",
        "tags": {
            "displayName": "APIAppHost"
        },
        "dependsOn": [
            "[resourceId('Microsoft.AppService/gateways', parameters('gatewayName'))]"
        ],
        "resources": [
            {
                "type": "siteextensions",
                "tags": {
                    "displayName": "APIAppExtension"
                },
                "apiVersion": "2015-04-01",
                "name": "[variables('$packageId')]",
                "dependsOn": [
                    "[resourceId('Microsoft.Web/sites', parameters('apiAppName'))]"
                ],
                "properties": {
                    "type": "WebRoot",
                    "feed_url": "[variables('$nugetFeed')]"
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
            "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('svcPlanName'))]",
            "siteConfig": {
                "appSettings": [
                    {
                        "name": "EMA_MicroserviceId",
                        "value": "[parameters('apiAppName')]"
                    },
                    {
                        "name": "EMA_Secret",
                        "value": "[parameters('gatewayToAPIappSecret')]"
                    },
                    {
                        "name": "EMA_RuntimeUrl",
                        "value": "[concat('https://', reference(resourceId('Microsoft.Web/sites', parameters('gatewayName'))).hostNames[0])]"
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

    {
        "type": "Microsoft.AppService/apiapps",
        "apiVersion": "2015-03-01-preview",
        "name": "[parameters('apiAppName')]",
        "location": "[resourceGroup().location]",
        "tags": {
            "displayName": "APIApp"
        },
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
            "[resourceId('Microsoft.Web/sites/siteextensions', parameters('apiAppName'), 'Microsoft.ApiApp')]"
        ],
        "properties": {
            "package": {
                "id": "Microsoft.ApiApp"
            },
            "host": {
                "resourceName": "[parameters('apiAppName')]"
            },
            "gateway": {
                "resourceName": "[parameters('gatewayName')]"
            },
            "dependencies": [ ]
        }
    }

### Logic app

Creates the logic app.

A logic app requires a name, location, SKU (which points to that App service plan), definition, and, optionally, parameters.

Notice that the logic app uses the token to call the gateway.

    {
        "type": "Microsoft.Logic/workflows",
        "apiVersion": "2015-02-01-preview",
        "name": "[parameters('logicAppName')]",
        "location": "[resourceGroup().location]",
        "tags": {
            "displayName": "LogicApp"
        },
        "dependsOn": [
            "[resourceId('Microsoft.AppService/apiApps', parameters('apiAppName'))]"
        ],
        "properties": {
            "sku": {
                "name": "[parameters('sku')]",
                "plan": {
                    "id": "[concat(resourceGroup().id, '/providers/Microsoft.Web/serverfarms/',parameters('svcPlanName'))]"
                }
            },
            "definition": {
                "$schema": "http://schema.management.azure.com/providers/Microsoft.Logic/schemas/2014-12-01-preview/workflowdefinition.json#",
                "contentVersion": "1.0.0.0",
                "parameters": {
                    "token": {
                        "defaultValue": "[reference(resourceId('Microsoft.AppService/gateways/tokens', parameters('gatewayName'), parameters('logicAppName'))).token]",
                        "type": "String",
                        "metadata": {
                            "token": {
                                "name": "token"
                            }
                        }
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
                    "getValues": {
                        "type": "ApiApp",
                        "inputs": {
                            "apiVersion": "2015-01-14",
                            "host": {
                                "id": "[concat(resourceGroup().id, '/providers/Microsoft.AppServices/apiApps/',parameters('apiAppName'))]",
                                "gateway": "[concat('https://', reference(resourceId('Microsoft.Web/sites', parameters('gatewayName'))).hostNames[0])]"
                            },
                            "operation": "Values_Get",
                            "parameters": { },
                            "authentication": {
                                "type": "Raw",
                                "scheme": "Zumo",
                                "parameter": "@parameters('token')"
                            }
                        }
                    }
                },
                "outputs": {
                    "result": {
                        "type": "array",
                        "value": "@body('readValues')"
                    }
                }
            },
            "parameters": { }
        }
    }

## Commands to run deployment

[AZURE.INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

### PowerShell

    New-AzureRmResourceGroupDeployment -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-logic-app-api-app-create/azuredeploy.json -ResourceGroupName ExampleDeployGroup

### Azure CLI

    azure group deployment create --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-logic-app-api-app-create/azuredeploy.json -g ExampleDeployGroup


 
