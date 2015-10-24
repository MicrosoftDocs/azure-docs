<properties
   pageTitle="Resource Manager template for resource locks | Microsoft Azure"
   description="Shows the resource manager schema for resource locks."
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
   ms.date="10/23/2015"
   ms.author="tomfitz"/>

# Resource locks - template schema

Creates a new lock on a resource.

## Schema

To create a lock, add the following schema to the resources section of your template.
    
    {
        "type": "Microsoft.Authorization/locks",
        "apiVersion": "2015-01-01",
        "name": string,
        "dependsOn": array,
        "properties":
        {
            "level": enum,
            "notes": string
        }
    }



## Values

The following tables describe the values you need to set in the schema.

| Name | Type | Required | Permitted values | Description |
| ---- | ---- | -------- | ---------------- | ----------- |
| type | enum | Yes | **Microsoft.Authorization/locks** | The resource type to create. |
| apiVersion | enum | Yes | **2015-01-01** | The API version to use for creating the resource. |  
| name | string | Yes | 64 characters<br />It cannot contain <, > %, &, ?, or any control characters. | The name of the lock to create. |
| dependsOn | array | No |  | The collection of resources this lock depends on. Each value is a string containing either the resource name or resource unique identifier. You must specify the parent resource. | 
| properties | object | Yes | (shown below)  | An object that identifies the type of lock, and notes about the lock. |  

### properties object

| Name | Type | Required | Permitted Values | Description |
| ------- | ---- | ---------------- | -------- | ----------- |
| level   | enum | Yes | **"CannotDelete"** <br /> **"ReadOnly"**  | The type of lock to apply to the scope. CanNotDelete allows modification but prevents deletion, ReadOnly prevents modification or deletion. |
| notes   | string | No | 512 characters | Description of the lock. |


## How to use this resource

You add this resource to your template to apply a lock to the parent resource.

To create or delete management locks, you must have access to **Microsoft.Authorization/*** or **Microsoft.Authorization/locks/*** actions. Of the built-in roles, only **Owner** and **User Access Administrator** are 
granted those actions.

The lock is applied to the specified resource and any child resources. If you apply more than one lock to a resource, the most restrictive lock takes precedence. For example, if you apply ReadOnly at the 
parent level (such as the resource group) and CanNotDelete on a resource within that group, the more restrictive lock (ReadOnly) from the parent takes precedence. 

## Examples

The following example applies a read-only lock to a web app.

    {
        "apiVersion": "2015-08-01",
        "name": "[variables('siteName')]",
        "type": "Microsoft.Web/sites",
        "location": "[resourceGroup().location]",
        "dependsOn": [ "[resourceId('Microsoft.Web/serverfarms', parameters('hostingPlanName'))]" ],
        "properties": {
            "serverFarmId": "[parameters('hostingPlanName')]"
        },
        "resources": [
            {
                "type": "Microsoft.Authorization/locks",
                "apiVersion": "2015-01-01",
                "name": "SiteLock",
                "dependsOn": [ "[resourceId('Microsoft.Web/sites', variables('siteName'))]" ],
                "properties": {
                    "level": "ReadOnly",
                    "notes": "Web site cannot be modified during this time."
                }
            }
        ]
    }
