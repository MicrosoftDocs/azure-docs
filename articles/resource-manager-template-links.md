<properties
   pageTitle="Resource Manager template for linking resources | Microsoft Azure"
   description="Shows the Resource Manager schema for deploying links between related resources through a template."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="wpickett"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="01/04/2016"
   ms.author="tomfitz"/>

# Resource links template schema

Creates a link between two resources. The link is applied to a resource known as the source resource. The second resource in the link is known as the target resource.

## Schema format

To create a link, add the following schema to the resources section of your template.
    
    {
        "type": enum,
        "apiVersion": "2015-01-01",
        "name": string,
        "dependsOn": [ array values ],
        "properties":
        {
            "targetId": string,
            "notes": string
        }
    }



## Values

The following tables describe the values you need to set in the schema.

| Name | Type | Required | Permitted values | Description |
| ---- | ---- | -------- | ---------------- | ----------- |
| type | enum | Yes | **{namespace}/{type}/providers/links** | The resource type to create. The {namespace} and {type} values refer to the provider namespace and resource type of the source resource. |
| apiVersion | enum | Yes | **2015-01-01** | The API version to use for creating the resource. |  
| name | string | Yes | **{resouce}/Microsoft.Resources/{linkname}**<br /><br />up to 64 characters<br />It cannot contain <, > %, &, ?, or any control characters. | A value that specifes both the name of source resource and a name for the link. |
| dependsOn | array | No |  A comma-separated list of a resource names or resource unique identifiers. | The collection of resources this link depends on. If the resources you are linking are deployed in the same template, include those resource names in this element to ensure they are deployed first. | 
| properties | object | Yes | (shown below)  | An object that identifies the resource to link to, and notes about the link. |  

### properties object

| Name | Type | Required | Permitted Values | Description |
| ------- | ---- | ---------------- | -------- | ----------- |
| targetId   | string | Yes |   | The identifier of the target resource to link to. |
| notes   | string | No | 512 characters | Description of the lock. |


## How to use the link resource

You apply a link between two resources when the resources have a dependency that continues after deployment. For example, an app may connect to a 
database in a different resource group. You can define that dependency by creating a link from the app to the database. Links enable you to document the 
relationship between two resources. Later, you or someone else in your organization can query a resource for links to discover how the resource works 
with other resources.

All linked resources must belong to the same subscription. Each resource can be linked to 50 other resources. If any of the linked resources are deleted or moved, the link owner must clean up the remaining link.

To work with links through REST, see [Linked Resources](https://msdn.microsoft.com/library/azure/mt238499.aspx).

Use the following Azure PowerShell command to see all of the links in your subscription. You can provide other parameters to limit the results.

    Get-AzureRmResource -ResourceType Microsoft.Resources/links -isCollection -OutputObjectFormat New

## Examples

The following example applies a read-only lock to a web app.

    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "hostingPlanName": {
                "type": "string"
            }
        },
        "variables": {
            "siteName": "[concat('site',uniqueString(resourceGroup().id))]"
        },
        "resources": [
            {
                "apiVersion": "2015-08-01",
                "type": "Microsoft.Web/serverfarms",
                "name": "[parameters('hostingPlanName')]",
                "location": "[resourceGroup().location]",
                "sku": {
                    "tier": "Free",
                    "name": "f1",
                    "capacity": 0
                },
                "properties": {
                    "numberOfWorkers": 1
                }
            },
            {
                "apiVersion": "2015-08-01",
                "name": "[variables('siteName')]",
                "type": "Microsoft.Web/sites",
                "location": "[resourceGroup().location]",
                "dependsOn": [ "[parameters('hostingPlanName')]" ],
                "properties": {
                    "serverFarmId": "[parameters('hostingPlanName')]"
                }
            },
            {
                "type": "Microsoft.Web/sites/providers/links",
                "apiVersion": "2015-01-01",
                "name": "[concat(variables('siteName'),'/Microsoft.Resources/SiteToStorage')]",
                "dependsOn": [ "[variables('siteName')]" ],
                "properties": {
                    "targetId": "[resourceId('Microsoft.Storage/storageAccounts','storagecontoso')]",
                    "notes": "This web site uses the storage account to store user information."
                }
    	    }
        ],
        "outputs": {}
    }

## Quickstart templates

The following quickstart templates deploy resources with a link.

- [Alert to queue with Logic app](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-queue-with-logic-app)
- [Alert to Slack with Logic app](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-slack-with-logic-app)
- [Provision an API app with an existing gateway](https://github.com/Azure/azure-quickstart-templates/tree/master/201-api-app-gateway-existing)
- [Provision an API app with a new gateway](https://github.com/Azure/azure-quickstart-templates/tree/master/201-api-app-gateway-new)
- [Create a Logic App plus API app using a template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-logic-app-api-app-create)
- [Logic app that sends a text message when an alert fires](https://github.com/Azure/azure-quickstart-templates/tree/master/201-alert-to-text-message-with-logic-app)


## Next steps

- For information about the template structure, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
