---
title: Create logic apps with Azure Resource Manager templates - Azure Logic Apps | Microsoft Docs
description: Create and deploy logic app workflows with Azure Resource Manager templates in Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: ecfan
ms.author: estfan
ms.reviewer: klam, LADocs
ms.topic: article
ms.assetid: 7574cc7c-e5a1-4b7c-97f6-0cffb1a5d536
ms.date: 10/15/2017
---

# Create and deploy logic apps with Azure Resource Manager templates

Azure Logic Apps provides Azure Resource Manager templates 
that you can use, not only to create logic apps for automating workflows, 
but also to define the resources and parameters that are used for deployment. 
You can use this template for your own business scenarios or 
customize the template to meet your requirements. Learn more about the 
[Resource Manager template for logic apps](https://github.com/Azure/azure-quickstart-templates/blob/master/101-logic-app-create/azuredeploy.json) 
and [Azure Resource Manager template structure and syntax](../azure-resource-manager/resource-group-authoring-templates.md).

## Define the logic app

This example logic app definition runs once an hour, 
and pings the location specified in the `testUri` parameter.
The template uses parameter values for the logic app name (```logicAppName```) 
and the location to ping for testing (```testUri```). Learn more about 
[defining these parameters in your template](#define-parameters). 
The template also sets the location for the logic app to the same 
location as the Azure resource group. 

``` json
{
   "type": "Microsoft.Logic/workflows",
   "apiVersion": "2016-06-01",
   "name": "[parameters('logicAppName')]",
   "location": "[resourceGroup().location]",
   "tags": {
      "displayName": "LogicApp"
   },
   "properties": {
      "definition": {
         "$schema": "https://schema.management.azure.com/schemas/2016-06-01/Microsoft.Logic.json",
         "contentVersion": "1.0.0.0",
         "parameters": {
            "testURI": {
               "type": "string",
               "defaultValue": "[parameters('testUri')]"
            }
         },
         "triggers": {
            "Recurrence": {
               "type": "Recurrence",
               "recurrence": {
                  "frequency": "Hour",
                  "interval": 1
               }
            }
         },
         "actions": {
            "Http": {
              "type": "Http",
              "inputs": {
                  "method": "GET",
                  "uri": "@parameters('testUri')"
              },
              "runAfter": {}
           }
         },
         "outputs": {}
      },
      "parameters": {}
   }
}
``` 

<a name="define-parameters"></a>

### Define parameters

[!INCLUDE [app-service-logic-deploy-parameters](../../includes/app-service-logic-deploy-parameters.md)]

Here are descriptions for the parameters in the template:

| Parameter | Description | JSON definition example | 
| --------- | ----------- | ----------------------- | 
| `logicAppName` | Defines the name of the logic app that template creates. | "logicAppName": { "type": "string", "metadata": { "description": "myExampleLogicAppName" } } |
| `testUri` | Defines the location to ping for testing. | "testUri": { "type": "string", "defaultValue": "http://azure.microsoft.com/status/feed/"} | 
||||

Learn more about [REST API for Logic Apps Workflow definition and properties](https://docs.microsoft.com/rest/api/logic/workflows) 
and [building on logic app definitions with JSON](logic-apps-author-definitions.md).

## Deploy logic apps automatically

To create and automatically deploy a logic app to Azure, 
choose **Deploy to Azure** here:

[![Deploy to Azure](./media/logic-apps-create-deploy-azure-resource-manager-templates/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-logic-app-create%2Fazuredeploy.json)

This action signs you in to the Azure portal where you can provide your 
logic app's details and make any changes to the template or parameters. 
For example, the Azure portal prompts you for these details:

* Azure subscription name
* Resource group that you want to use
* Logic app location
* A name for your logic app
* A test URI
* Acceptance of the specified terms and conditions

## Deploy logic apps with commands

[!INCLUDE [app-service-deploy-commands](../../includes/app-service-deploy-commands.md)]

### PowerShell

```
New-AzureRmResourceGroupDeployment -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-logic-app-create/azuredeploy.json -ResourceGroupName ExampleDeployGroup
``` 

### Azure CLI

```
azure group deployment create --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-logic-app-create/azuredeploy.json -g ExampleDeployGroup
```

## Get support

* For questions, visit the [Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
* To submit or vote on feature ideas, visit the [Logic Apps user feedback site](http://aka.ms/logicapps-wish).

## Next steps

> [!div class="nextstepaction"]
> [Monitor logic apps](../logic-apps/logic-apps-monitor-your-logic-apps.md)