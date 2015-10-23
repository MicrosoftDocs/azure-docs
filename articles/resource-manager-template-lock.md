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

This resource is used as a child resource to lock the parent resource.

## Schema
    
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

| Name | Type | Required | Permitted values | Description |
| ---- | ---- | -------- | ---------------- | ----------- |
| type | enum | Yes | **Microsoft.Authorization/locks** | The resource type to create. |
| apiVersion | enum | Yes | **2015-01-01** | The API version to use for creating the resource. |  
| name | string | Yes | 64 characters | The name of the lock to create. |
| dependsOn | array | No |  | The collection of resources this lock depends on. Each value is a string containing either the resource name or resource unique identifier.  
| properties | object | Yes |  | An object that identifies the type of lock, and notes about the lock. |  

### properties object

| Element | Type | Permitted Values | Required | Description |
| ------- | ---- | ---------------- | -------- | ----------- |
| level   | enum | **"CannotDelete"** <br /> **"ReadOnly"** | Yes | The type of lock to apply to the scope. CanNotDelete allows modification but prevents deletion, ReadOnly prevents modification or deletion. |
| notes   | string | 512 characters | No | Description of the lock. |


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
