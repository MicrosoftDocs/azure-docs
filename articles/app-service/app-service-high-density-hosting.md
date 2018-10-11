---
title: High density hosting on Azure App Service using per-app scaling | Microsoft Docs
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
ms.date: 01/22/2018
ms.author: byvinyal

---
# High density hosting on Azure App Service using per-app scaling
By default, you scale App Service apps by scaling the [App Service plan](azure-web-sites-web-hosting-plans-in-depth-overview.md) they run on. When multiple apps are run in the same App Service plan, each scaled-out instance runs all the apps in the plan.

You can enable *per-app scaling* at the
App Service plan level. It scales an app independently from the
App Service plan that hosts it. This way, an App Service plan
can be scaled to 10 instances, but an app can be set to use only five.

> [!NOTE]
> Per-app scaling is available only for **Standard**, **Premium**, **Premium V2** and **Isolated** pricing tiers.
>

## Per app scaling using PowerShell

Create a plan with per-app scaling
by passing in the ```-PerSiteScaling $true``` parameter to the
```New-AzureRmAppServicePlan``` cmdlet.

```powershell
New-AzureRmAppServicePlan -ResourceGroupName $ResourceGroup -Name $AppServicePlan `
                            -Location $Location `
                            -Tier Premium -WorkerSize Small `
                            -NumberofWorkers 5 -PerSiteScaling $true
```

Enable per-app scaling with an existing App Service Plan
by passing in the `-PerSiteScaling $true` parameter to the
```Set-AzureRmAppServicePlan``` cmdlet.

```powershell
# Enable per-app scaling for the App Service Plan using the "PerSiteScaling" parameter.
Set-AzureRmAppServicePlan -ResourceGroupName $ResourceGroup `
   -Name $AppServicePlan -PerSiteScaling $true
```

At the app level, configure the number of instances the app can use in the App Service plan.

In the example below, the app is limited to two instances regardless 
of how many instances the underlying app service plan scales out to.

```powershell
# Get the app we want to configure to use "PerSiteScaling"
$newapp = Get-AzureRmWebApp -ResourceGroupName $ResourceGroup -Name $webapp
    
# Modify the NumberOfWorkers setting to the desired value.
$newapp.SiteConfig.NumberOfWorkers = 2
    
# Post updated app back to azure
Set-AzureRmWebApp $newapp
```

> [!IMPORTANT]
> `$newapp.SiteConfig.NumberOfWorkers` is different from `$newapp.MaxNumberOfWorkers`. Per-app scaling uses `$newapp.SiteConfig.NumberOfWorkers` to determine the scale characteristics of the app.

## Per-app scaling using Azure Resource Manager

The following Azure Resource Manager template creates:

- An App Service plan that's scaled out to 10 instances
- an app that's configured to scale to a max of five instances.

The App Service plan is setting the **PerSiteScaling** property 
to true `"perSiteScaling": true`. The app is setting the **number of workers** 
to use to 5 `"properties": { "numberOfWorkers": "5" }`.

```json
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
and [App Service Environments](environment/app-service-app-service-environment-intro.md). However, the recommended strategy is to
use App Service Environments to take advantage of their advanced features and the larger
pools of capacity.  

Follow these steps to configure
high density hosting for your apps:

1. Configure the App Service Environment and choose a worker pool that is dedicated to the high density hosting scenario.
1. Create a single App Service plan, and scale it to use all the available
   capacity on the worker pool.
1. Set the `PerSiteScaling` flag to true on the App Service plan.
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
- [Introduction to App Service Environment](environment/app-service-app-service-environment-intro.md)
