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

# Microsoft.Authorization/locks

Creates a new management lock.

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



## Properties

### type

The resource type to create.  
Type: enum  
Permitted values: **Microsoft.Authorization/locks**  
Required: Yes  

### apiVersion

The API version to use for creating the resource.  
Type: enum  
Permitted values: **2015-01-01**  
Required: Yes  

### name

The name of the lock to create.  
Type: string  
Max length: 64 characters.  
Required: Yes

### dependsOn

The collection of resources this lock depends on.  
Type: array of strings containing resource names or resource unique identifiers.  
Required: No

### properties
An object that identifies the type of lock, and notes about the lock.  
Type: object  
Required: Yes

| Element | Type | Permitted Values | Required | Description |
| ------- | ---- | ---------------- | -------- | ----------- |
| level   | enum | "CannotDelete" or "ReadOnly" | Yes | The type of lock to apply to the scope.  CanNotDelete allows modification but prevents deletion, ReadOnly prevents modification or deletion. |
| notes   | string | max length: 512 characters | No | Description of the lock. |


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
