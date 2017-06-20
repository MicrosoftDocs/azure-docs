---
title: High density hosting on Azure App Service | Microsoft Docs
description: High density hosting on Azure App Service
author: btardif
manager: erikre
editor: ''
services: app-service\web
documentationcenter: ''

ms.assetid: a903cb78-4927-47b0-8427-56412c4e3e64
ms.service: app-service-web
ms.workload: web
ms.tgt_pltfrm: na
ms.devlang: multiple
ms.topic: article
ms.date: 06/12/2017
ms.author: byvinyal

---
# High density hosting on Azure App Service
When using App Service, your application is decoupled from the capacity 
allocated to it by two concepts:

* **The Application:** Represents the app and its runtime configuration. For 
example, it includes the version of .NET that the runtime should load, the 
app settings.
* **The App Service Plan:** Defines the characteristics of the capacity, 
available feature set, and locality of the application. For example, 
characteristics might be large (four cores) machine, four instances, Premium
 features in East US.

An app is always linked to an App Service plan, but an App Service plan can 
provide capacity to one or more apps.

As a result, the platform provides the flexibility to isolate a
single app or have multiple apps share resources by sharing an
App Service plan.

However, when multiple apps share an App Service plan, an
instance of that app runs on every instance of that
App Service plan.

## Per app scaling
*Per app scaling* is a feature that can be enabled at the
App Service plan level and then used per application.

Per app scaling scales an app independently from the
App Service plan that hosts it. This way, an App Service plan
can be scaled to 10 instances, but an app can be set to use only five.

   >[!NOTE]
   >Per app scaling is available only for **Premium** SKU App Service plans
   >

### Per app scaling using PowerShell

You can create a plan configured as a *Per app scaling* plan 
by passing in the ```-perSiteScaling $true``` attribute to the 
```New-AzureRmAppServicePlan``` commandlet

```
New-AzureRmAppServicePlan -ResourceGroupName $ResourceGroup -Name $AppServicePlan `
                            -Location $Location `
                            -Tier Premium -WorkerSize Small `
                            -NumberofWorkers 5 -PerSiteScaling $true
```

If you want to update an existing App Service plan to use this feature: 

- get the target plan ```Get-AzureRmAppServicePlan```
- modifying the property locally ```$newASP.PerSiteScaling = $true```
- posting your changes back to azure ```Set-AzureRmAppServicePlan``` 

```
# Get the new App Service Plan and modify the "PerSiteScaling" property.
$newASP = Get-AzureRmAppServicePlan -ResourceGroupName $ResourceGroup -Name $AppServicePlan
$newASP

#Modify the local copy to use "PerSiteScaling" property.
$newASP.PerSiteScaling = $true
$newASP
    
#Post updated app service plan back to azure
Set-AzureRmAppServicePlan $newASP
```

At the app level, we need to configure the number of instances the app can use in the app service plan.

In the example below, the app is limited to two instances regardless 
of how many instances the underlying app service plan scales out to.

```
# Get the app we want to configure to use "PerSiteScaling"
$newapp = Get-AzureRmWebApp -ResourceGroupName $ResourceGroup -Name $webapp
    
# Modify the NumberOfWorkers setting to the desired value.
$newapp.SiteConfig.NumberOfWorkers = 2
    
# Post updated app back to azure
Set-AzureRmWebApp $newapp
```

> [!IMPORTANT]
> $newapp.SiteConfig.NumberOfWorkers is different form $newapp.MaxNumberOfWorkers. Per app scaling uses $newapp.SiteConfig.NumberOfWorkers to determine the scale characteristics of the app.

### Per app scaling using Azure Resource Manager

The following *Azure Resource Manager template* creates:

- An App Service plan that's scaled out to 10 instances
- an app that's configured to scale to a max of five instances.

The App Service plan is setting the **PerSiteScaling** property 
to true ```"perSiteScaling": true```. The app is setting the **number of workers** 
to use to 5 ```"properties": { "numberOfWorkers": "5" }```.

```
{
    "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters":{
        "appServicePlanName": { "type": "string" },
        "appName": { "type": "string" }
        },
    "resources": [
    {
        "comments": "App Service Plan with per site perSiteScaling = true",
        "type": "Microsoft.Web/serverFarms",
        "sku": {
            "name": "P1",
            "tier": "Premium",
            "size": "P1",
            "family": "P",
            "capacity": 10
            },
        "name": "[parameters('appServicePlanName')]",
        "apiVersion": "2015-08-01",
        "location": "West US",
        "properties": {
            "name": "[parameters('appServicePlanName')]",
            "perSiteScaling": true
        }
    },
    {
        "type": "Microsoft.Web/sites",
        "name": "[parameters('appName')]",
        "apiVersion": "2015-08-01-preview",
        "location": "West US",
        "dependsOn": [ "[resourceId('Microsoft.Web/serverFarms', parameters('appServicePlanName'))]" ],
        "properties": { "serverFarmId": "[resourceId('Microsoft.Web/serverFarms', parameters('appServicePlanName'))]" },
        "resources": [ {
                "comments": "",
                "type": "config",
                "name": "web",
                "apiVersion": "2015-08-01",
                "location": "West US",
                "dependsOn": [ "[resourceId('Microsoft.Web/Sites', parameters('appName'))]" ],
                "properties": { "numberOfWorkers": "5" }
            } ]
        }]
}
```

## Recommended configuration for high density hosting
Per app scaling is a feature that is enabled in both global Azure regions
and App Service Environments. However, the recommended strategy is to
use App Service Environments to take advantage of their advanced features and the larger
pools of capacity.  

Follow these steps to configure
high density hosting for your apps:

1. Configure the App Service Environment and choose a worker pool that is dedicated to the high density hosting scenario.
1. Create a single App Service plan, and scale it to use all the available
   capacity on the worker pool.
1. Set the PerSiteScaling flag to true on the App Service plan.
1. New apps are created and assigned to that App Service plan with the
   **numberOfWorkers** property set to **1**. Using this configuration yields the 
   highest density possible on this worker pool.
1. The number of workers can be configured independently per app to grant
   additional resources as needed. For example:
    - A high-use app can set **numberOfWorkers** to **3** to have more 
      processing capacity for that app. 
    - Low-use apps would set **numberOfWorkers** to **1**.

## Next Steps

- [Azure App Service plans in-depth overview](azure-web-sites-web-hosting-plans-in-depth-overview.md)
- [Introduction to App Service Environment](../app-service-web/app-service-app-service-environment-intro.md)