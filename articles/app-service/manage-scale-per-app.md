---
title: Per-App Scaling for High-Density Hosting
description: Scale apps independently from the App Service plans and optimize the scaled-out instances in your plan.
author: msangapu-msft

ms.assetid: a903cb78-4927-47b0-8427-56412c4e3e64
ms.topic: how-to
ms.date: 05/02/2025
ms.author: msangapu
ms.custom: devx-track-azurepowershell, devx-track-arm-template
ms.service: azure-app-service 

# Customer intent: As a developer, I want to use per-app scaling to optimize the scaled out instances in my App Service plan. 
 
---

# Implement per-app scaling for high-density hosting

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

You can scale your Azure App Service apps by scaling the [App Service plan](overview-hosting-plans.md) they run on. When multiple apps run in the same App Service plan, each scaled-out instance runs all the apps in the plan.

In contrast, *per-app scaling* can be enabled at the App Service plan level to scale an app independently from the
App Service plan that hosts it. This way, an App Service plan can be scaled to 10 instances, but an app can be set to use only five.

> [!NOTE]
> Per-app scaling is available only for **Standard**, **Premium**, **Premium V2**, **Premium V3**, and **Isolated** pricing tiers.
>

Apps are allocated to the available App Service plan using a best-effort approach for an even distribution across instances. While an even distribution isn't guaranteed, the platform makes sure that two instances of the same app aren't hosted on the same App Service plan instance.

The platform doesn't rely on metrics to decide on worker allocation. Applications are rebalanced only when instances are added or removed from the App Service plan.

## Per-app scaling using PowerShell

Create a plan with per-app scaling by passing in the `-PerSiteScaling $true` parameter to the `New-AzAppServicePlan` cmdlet.

```powershell
New-AzAppServicePlan -ResourceGroupName $ResourceGroup -Name $AppServicePlan `
                            -Location $Location `
                            -Tier Premium -WorkerSize Small `
                            -NumberofWorkers 5 -PerSiteScaling $true
```

Enable per-app scaling with an existing App Service Plan by passing in the `-PerSiteScaling $true` parameter to the `Set-AzAppServicePlan` cmdlet.

```powershell
Set-AzAppServicePlan -ResourceGroupName $ResourceGroup `
   -Name $AppServicePlan -PerSiteScaling $true
```

At the app level, configure the number of instances the app can use in the App Service plan.

In the following example, the app is limited to two instances regardless of how many instances the underlying app service plan scales out to.

```powershell
# Get the app we want to configure to use "PerSiteScaling"
$newapp = Get-AzWebApp -ResourceGroupName $ResourceGroup -Name $webapp

# Modify the NumberOfWorkers setting to the desired value
$newapp.SiteConfig.NumberOfWorkers = 2

# Post updated app back to Azure
Set-AzWebApp $newapp
```

> [!IMPORTANT]
> `$newapp.SiteConfig.NumberOfWorkers` is different from `$newapp.MaxNumberOfWorkers`. Per-app scaling uses `$newapp.SiteConfig.NumberOfWorkers` to determine the scale characteristics of the app.

## Per-app scaling using Azure Resource Manager

The following Azure Resource Manager template creates:

- An App Service plan that's scaled out to 10 instances.
- An app that's configured to scale to a max of five instances.

The App Service plan is setting the `PerSiteScaling` property to true `"perSiteScaling": true`. The app is setting the `number of workers` to use to 5 `"properties": { "numberOfWorkers": "5" }`.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
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

## Recommended configuration for high-density hosting

Per-app scaling is a feature that's enabled in both global Azure regions and [App Service Environments](environment/app-service-app-service-environment-intro.md). However, the recommended strategy is to use App Service Environments to take advantage of their advanced features and the larger App Service plan capacity.  

Follow these steps to configure high-density hosting for your apps:

1. Designate an App Service plan as the high-density plan and scale it out to the desired capacity.

1. Set the `PerSiteScaling` flag to true on the App Service plan.

1. New apps are created and assigned to that App Service plan with the `numberOfWorkers` property set to *1*.
   - Using this configuration yields the highest density possible.

1. The number of workers can be configured independently per app to grant additional resources as needed. For example:
   - A high-use app can set `numberOfWorkers` to *3* to have more processing capacity for that app.
   - Low-use apps would set `numberOfWorkers` to *1*.

## Related content

- [What are Azure App Service plans?](overview-hosting-plans.md)
- [App Service Environment overview](environment/overview.md)
- [Tutorial: Run a load test to identify performance bottlenecks in a web app](../app-testing/load-testing/tutorial-identify-bottlenecks-azure-portal.md)
