<properties
   pageTitle="Resource Manager template for resource locks | Microsoft Azure"
   description="Shows the Resource Manager schema for deploying resource locks through a template."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="tfitzmac"
   manager="timlt"
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="04/05/2016"
   ms.author="tomfitz"/>

# Resource locks template schema

Creates a new lock on a resource and its child resources.

## Schema format

To create a lock, add the following schema to the resources section of your template.
    
    {
        "type": enum,
        "apiVersion": "2015-01-01",
        "name": string,
        "dependsOn": [ array values ],
        "properties":
        {
            "level": enum,
            "notes": string
        }
    }



## Values

The following tables describe the values you need to set in the schema.

| Name | Value |
| ---- | ---- | 
| type | Enum<br />Required<br />**{namespace}/{type}/providers/locks** - for resources or<br />**Microsoft.Authorization/locks** - for resource groups<br /><br />The resource type to create. |
| apiVersion | Enum<br />Required<br />**2015-01-01**<br /><br />The API version to use for creating the resource. |  
| name | String<br />Required<br />**{resource}/Microsoft.Authorization/{lockname}** - for resources or<br />**{lockname}** - for resource groups<br />up to 64 characters, and cannot contain <, > %, &, ?, or any control characters.<br /><br />A value that specifes both the resource to lock and a name for the lock. |
| dependsOn | Array<br />Optional<br />A comma-separated list of a resource names or resource unique identifiers.<br /><br />The collection of resources this lock depends on. If the resource you are locking is deployed in the same template, include that resource name in this element to ensure the resource is deployed first. | 
| properties | Object<br />Required<br />[properties object](#properties)<br /><br />An object that identifies the type of lock, and notes about the lock. |  

<a id="properties" />
### properties object

| Name | Value |
| ------- | ---- |
| level   | Enum<br />Required<br />**CannotDelete**<br /><br />The type of lock to apply to the scope. CanNotDelete allows modification but prevents deletion. |
| notes   | String<br />Optional<br />up to 512 characters<br /><br />Description of the lock. |


## How to use the lock resource

You add this resource to your template to prevent specified actions on a resource. The lock applies to all users and groups. Typically, you apply a lock for only a limited duration, such as, when a process is running and you want to make sure someone in your organization doesn't inadvertently modify or delete a resource.

To create or delete management locks, you must have access to **Microsoft.Authorization/*** or **Microsoft.Authorization/locks/*** actions. Of the built-in roles, only **Owner** and **User Access Administrator** are 
granted those actions. For information about role-based access control, see [Azure Role-based Access Control](./active-directory/role-based-access-control-configure.md).

The lock is applied to the specified resource and any child resources.

You can remove a lock with the PowerShell command **Remove-AzureRmResourceLock** or with the [delete operation](https://msdn.microsoft.com/library/azure/mt204562.aspx) of the REST API.

## Examples

The following example applies a cannot-delete lock to a web app.

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
                "name": "[variables('siteName')]",
                "type": "Microsoft.Web/sites",
                "location": "[resourceGroup().location]",
                "properties": {
                    "serverFarmId": "[parameters('hostingPlanName')]"
                },
            },
            {
                "type": "Microsoft.Web/sites/providers/locks",
                "apiVersion": "2015-01-01",
                "name": "[concat(variables('siteName'),'/Microsoft.Authorization/MySiteLock')]",
                "dependsOn": [ "[variables('siteName')]" ],
                "properties":
                {
                    "level": "CannotDelete",
                    "notes": "my notes"
                }
             }
        ],
        "outputs": {}
    }

The next example applies a cannot-delete lock to the resource group.

    {
        "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {},
        "variables": {},
        "resources": [
            {
                "type": "Microsoft.Authorization/locks",
                "apiVersion": "2015-01-01",
                "name": "MyGroupLock",
                "properties":
                {
                    "level": "CannotDelete",
                    "notes": "my notes"
                }
            }
        ],
        "outputs": {}
    }

## Next steps

- For information about the template structure, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
- For more information about locks, see [Lock resources with Azure Resource Manager](resource-group-lock-resources.md).
