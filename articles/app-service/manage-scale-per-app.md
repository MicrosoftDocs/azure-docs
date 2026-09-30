---
title: Per-app scaling for high-density hosting
description: Scale apps independently from the App Service plans and optimize the scaled-out instances in your plan.
author: msangapu-msft

ms.assetid: a903cb78-4927-47b0-8427-56412c4e3e64
ms.topic: how-to
ms.date: 08/24/2026
ms.author: msangapu
ms.custom: devx-track-azurepowershell, devx-track-arm-template
ms.service: azure-app-service 

# Customer intent: As a developer, I want to use per-app scaling to optimize the scaled out instances in my App Service plan. 
 
---

# Implement per-app scaling for high-density hosting

[!INCLUDE [updated-for-az](~/reusable-content/ce-skilling/azure/includes/updated-for-az.md)]

You can scale your Azure App Service apps by scaling the [App Service plan](overview-hosting-plans.md) they run on. By default, the plan-level `perSiteScaling` property is `false`, and every app and deployment slot uses all available instances in the plan.

When `perSiteScaling` is `true`, each app and deployment slot can have its own `siteConfig.numberOfWorkers` limit. For example, a plan can have a configured capacity of 10 workers while an app has a configured limit of five workers. Each deployment slot has its own limit; configuring the production app doesn't also configure its slots.

> [!NOTE]
> - Per-app scaling is available only for **Standard**, **Premium**, **Premium V2**, **Premium V3**, and **Isolated** pricing tiers.
> - A per-app limit doesn't reduce the dedicated capacity configured for the App Service plan or its billing by itself.

Keep these values distinct:

- **Configured plan capacity**: The plan's `sku.capacity` value.
- **Configured app or slot worker limit**: The resource's `siteConfig.numberOfWorkers` value.
- **Observed active app instances**: A point-in-time runtime observation. The actual count can't exceed the available plan workers. Plan scale-in can reduce this count below the configured app or slot limit.

The platform places an app on distinct available plan workers by using a best-effort approach. Placement is metric-independent.

| Scenario | Value semantics |
| --- | --- |
| Limit of `1` | The app or slot can use at most one available plan worker. Choose this value only when single-worker placement is acceptable for the workload. |
| Limit greater than `1` | The value caps how many distinct plan workers the app or slot can use. Actual active instances can be fewer. |
| Limit above available plan capacity | Available plan workers cap the actual app or slot instances. |
| Plan scale-in | The app or slot can run on fewer workers than its configured limit after plan workers are removed. |

Per-app scaling is fixed, metric-independent placement within the plan's available workers. It doesn't respond to demand or change plan capacity. To change capacity based on demand, use [automatic scaling](manage-automatic-scaling.md) or [Azure Monitor autoscale](/azure/azure-monitor/autoscale/autoscale-overview).

> [!IMPORTANT]
> [Zone redundancy](configure-zone-redundancy.md) distributes App Service plan instances; it doesn't create hidden app replicas. With per-app scaling, an app or slot limit of `1` permits placement on at most one plan instance and must not be treated as a simultaneous cross-zone replica. Limits of `2` or more permit placement on multiple distinct plan workers, but don't provide a public guarantee that those app instances span physical zones. For reliability design guidance, see [Reliability in App Service](/azure/reliability/reliability-app-service).

## Property model and prerequisites

Use a supported pricing tier, an account that can update the plan, app, and slot, and the current version of your chosen tool. The examples use Azure CLI 2.89.1 and Az PowerShell 16.2.0.

| Scope | Resource property | Example |
| --- | --- | --- |
| Plan feature | `properties.perSiteScaling` | `true` |
| Plan capacity | `sku.capacity` | `10` |
| App desired limit | `properties.siteConfig.numberOfWorkers` | `5` |
| Slot desired limit | `properties.siteConfig.numberOfWorkers` | `2` |
| App or slot configuration GET response | `properties.numberOfWorkers` | `5` or `2` |

In Azure CLI, similarly named options have different scopes: `az appservice plan ... --number-of-workers` sets plan capacity, while `az webapp config set ... --number-of-workers` sets the app or slot limit.

## Configure per-app scaling

Use the tab for your preferred tool. Replace placeholder names and locations before running a command or deploying a template.

# [Azure CLI](#tab/azure-cli)

Choose either the create step or the update step for the plan. The update step changes only `perSiteScaling`; it doesn't change the existing plan capacity.

```azurecli
resourceGroup='<resource-group-name>'
planName='<app-service-plan-name>'
appName='<app-name>'
slotName='staging'
location='westus3'

# Create a plan with capacity 10 and per-app scaling.
az appservice plan create \
    --resource-group $resourceGroup \
    --name $planName \
    --location $location \
    --sku P1V3 \
    --number-of-workers 10 \
    --per-site-scaling

# Or enable per-app scaling on an existing plan without changing its capacity.
az appservice plan update \
    --resource-group $resourceGroup \
    --name $planName \
    --set properties.perSiteScaling=true

# Configure the production app and its staging slot independently.
az webapp config set \
    --resource-group $resourceGroup \
    --name $appName \
    --number-of-workers 5

az webapp config set \
    --resource-group $resourceGroup \
    --name $appName \
    --slot $slotName \
    --number-of-workers 2
```

Here, the plan `--number-of-workers 10` is capacity. The web app configuration option with the same name is the desired app or slot limit. Inspect the configured values:

```azurecli
az appservice plan show \
    --resource-group $resourceGroup \
    --name $planName \
    --query "{planCapacity:sku.capacity, perSiteScaling:perSiteScaling}"

az webapp config show \
    --resource-group $resourceGroup \
    --name $appName \
    --query "{appWorkerLimit:numberOfWorkers}"

az webapp config show \
    --resource-group $resourceGroup \
    --name $appName \
    --slot $slotName \
    --query "{slotWorkerLimit:numberOfWorkers}"
```

For command details, see [az appservice plan](/cli/azure/appservice/plan) and [az webapp config](/cli/azure/webapp/config).

# [Azure PowerShell](#tab/azure-powershell)

Choose either `New-AzAppServicePlan` or `Set-AzAppServicePlan`. When `Set-AzAppServicePlan` changes plan settings, explicitly repeat `-PerSiteScaling $true` so the intended feature state remains clear.

```powershell
$ResourceGroup = '<resource-group-name>'
$AppServicePlan = '<app-service-plan-name>'
$WebApp = '<app-name>'
$Slot = 'staging'
$Location = 'westus3'

# Create a plan with capacity 10 and per-app scaling.
New-AzAppServicePlan -ResourceGroupName $ResourceGroup `
    -Name $AppServicePlan `
    -Location $Location `
    -Tier PremiumV3 `
    -WorkerSize Small `
    -NumberofWorkers 10 `
    -PerSiteScaling $true

# Or set the intended capacity and feature state on an existing plan.
Set-AzAppServicePlan -ResourceGroupName $ResourceGroup `
    -Name $AppServicePlan `
    -NumberofWorkers 10 `
    -PerSiteScaling $true

Set-AzWebApp -ResourceGroupName $ResourceGroup `
    -Name $WebApp `
    -NumberOfWorkers 5

Set-AzWebAppSlot -ResourceGroupName $ResourceGroup `
    -Name $WebApp `
    -Slot $Slot `
    -NumberOfWorkers 2
```

Use the corresponding `Get` cmdlets to inspect the plan, app, and slot values:

```powershell
$Plan = Get-AzAppServicePlan -ResourceGroupName $ResourceGroup -Name $AppServicePlan
[pscustomobject]@{
    PlanCapacity = $Plan.Sku.Capacity
    PerSiteScaling = $Plan.PerSiteScaling
}

(Get-AzWebApp -ResourceGroupName $ResourceGroup -Name $WebApp).SiteConfig.NumberOfWorkers
(Get-AzWebAppSlot -ResourceGroupName $ResourceGroup -Name $WebApp -Slot $Slot).SiteConfig.NumberOfWorkers
```

For cmdlet details, see [New-AzAppServicePlan](/powershell/module/az.websites/new-azappserviceplan), [Set-AzAppServicePlan](/powershell/module/az.websites/set-azappserviceplan), and [Set-AzWebApp](/powershell/module/az.websites/set-azwebapp).

# [Bicep](#tab/bicep)

This Bicep file creates a plan, an app, and a staging slot with the example values.

```bicep
param location string = resourceGroup().location
param appServicePlanName string
param appName string

resource appServicePlan 'Microsoft.Web/serverfarms@2024-11-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'P1v3'
    tier: 'PremiumV3'
    capacity: 10
  }
  properties: {
    perSiteScaling: true
  }
}

resource app 'Microsoft.Web/sites@2024-11-01' = {
  name: appName
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      numberOfWorkers: 5
    }
  }
}

resource stagingSlot 'Microsoft.Web/sites/slots@2024-11-01' = {
  parent: app
  name: 'staging'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      numberOfWorkers: 2
    }
  }
}
```

Save the file as *main.bicep*, compile it with `az bicep build --file main.bicep`, and deploy it with `az deployment group create --resource-group <resource-group-name> --template-file main.bicep`. A successful compile validates syntax and resource types; inspect the configured values after deployment. For resource definitions, see [App Service plans](/azure/templates/microsoft.web/2024-11-01/serverfarms), [apps](/azure/templates/microsoft.web/2024-11-01/sites), and [deployment slots](/azure/templates/microsoft.web/2024-11-01/sites/slots).

# [ARM template](#tab/arm-template)

This ARM template defines the same plan, app, and staging slot. The app depends on the plan, and the slot depends on its parent app.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "appServicePlanName": {
      "type": "string"
    },
    "appName": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Web/serverfarms",
      "apiVersion": "2024-11-01",
      "name": "[parameters('appServicePlanName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "P1v3",
        "tier": "PremiumV3",
        "capacity": 10
      },
      "properties": {
        "perSiteScaling": true
      }
    },
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2024-11-01",
      "name": "[parameters('appName')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', parameters('appServicePlanName'))]"
      ],
      "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('appServicePlanName'))]",
        "siteConfig": {
          "numberOfWorkers": 5
        }
      }
    },
    {
      "type": "Microsoft.Web/sites/slots",
      "apiVersion": "2024-11-01",
      "name": "[format('{0}/{1}', parameters('appName'), 'staging')]",
      "location": "[parameters('location')]",
      "dependsOn": [
        "[resourceId('Microsoft.Web/sites', parameters('appName'))]"
      ],
      "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', parameters('appServicePlanName'))]",
        "siteConfig": {
          "numberOfWorkers": 2
        }
      }
    }
  ]
}
```

Save the template as *azuredeploy.json*, validate it with `az deployment group validate --resource-group <resource-group-name> --template-file azuredeploy.json`, and then deploy it with `az deployment group create --resource-group <resource-group-name> --template-file azuredeploy.json`. Validation and deployment require an Azure context; JSON parsing alone doesn't validate the resources against your subscription. For schema details, see [App Service plans](/azure/templates/microsoft.web/2024-11-01/serverfarms), [apps](/azure/templates/microsoft.web/2024-11-01/sites), and [deployment slots](/azure/templates/microsoft.web/2024-11-01/sites/slots).

# [REST](#tab/rest)

Use the Azure Resource Manager endpoint for your cloud as `{managementEndpoint}`. For public Azure, this value is `https://management.azure.com`; other clouds use their own endpoint.

A plan `PUT` is a complete create-or-update request. Include the plan's location, SKU, capacity, and properties; don't send the following request as a properties-only update.

```http
PUT {managementEndpoint}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/serverfarms/{planName}?api-version=2024-11-01
Content-Type: application/json

{
  "location": "westus3",
  "sku": {
    "name": "P1v3",
    "tier": "PremiumV3",
    "capacity": 10
  },
  "properties": {
    "perSiteScaling": true
  }
}
```

For an existing plan, use a partial `PATCH` to change only the shown scalar property:

```http
PATCH {managementEndpoint}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/serverfarms/{planName}?api-version=2024-11-01
Content-Type: application/json

{
  "properties": {
    "perSiteScaling": true
  }
}
```

For the production app, update and read the `config/web` resource:

```http
PATCH {managementEndpoint}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/sites/{appName}/config/web?api-version=2024-11-01
Content-Type: application/json

{
  "properties": {
    "numberOfWorkers": 5
  }
}

GET {managementEndpoint}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/sites/{appName}/config/web?api-version=2024-11-01
```

For the staging slot, include `/slots/{slotName}` in the resource path:

```http
PATCH {managementEndpoint}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/sites/{appName}/slots/{slotName}/config/web?api-version=2024-11-01
Content-Type: application/json

{
  "properties": {
    "numberOfWorkers": 2
  }
}

GET {managementEndpoint}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/sites/{appName}/slots/{slotName}/config/web?api-version=2024-11-01
```

Read the plan with `GET {managementEndpoint}/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/serverfarms/{planName}?api-version=2024-11-01`. Partial scalar `PATCH` requests are safe for the fields shown because omitted settings are preserved. For operation details, see the [App Service REST API reference](/rest/api/appservice/).

---

## Verify the configuration

Check each configured value after a change or deployment.

| Value | Expected example | Where to verify |
| --- | --- | --- |
| Plan feature | `true` | Plan response `properties.perSiteScaling` |
| Plan capacity | `10` | Plan response `sku.capacity` |
| Production app desired limit | `5` | Production `config/web` response `properties.numberOfWorkers` |
| Staging slot desired limit | `2` | Slot `config/web` response `properties.numberOfWorkers` |

These values are configuration, not observed active instance counts. Runtime placement remains best effort and is bounded by available plan workers. Before combining per-app scaling with zone redundancy, review the plan capacity and each app or slot limit in [Set zone redundancy for an existing App Service plan](configure-zone-redundancy.md#set-zone-redundancy-for-an-existing-app-service-plan).

## Configure high-density hosting for your scenario

Per-app scaling is available in both global Azure regions and [App Service Environments](environment/overview.md). Choose app and slot limits according to workload capacity and reliability requirements rather than applying one limit to every workload.

For a high-density hosting scenario:

1. Designate an App Service plan as the high-density plan and scale it out to the desired capacity.

1. Set the `PerSiteScaling` flag to true on the App Service plan.

1. Set each app and deployment slot's `numberOfWorkers` limit based on its needs.
   - A limit of `1` provides the highest density, but use it only for workloads where placement on at most one plan worker is acceptable.
   - Use a limit of `2` or more when the workload should be eligible for placement on multiple distinct plan workers, subject to available plan capacity.

1. Review limits independently as workload requirements change. For example, a higher-use app can use a limit of `3` for more processing capacity, while another app can use `1` when single-worker placement is appropriate.

## Related content

- [What are Azure App Service plans?](overview-hosting-plans.md)
- [Configure automatic scaling](manage-automatic-scaling.md)
- [Configure zone redundancy](configure-zone-redundancy.md)
- [Reliability in App Service](/azure/reliability/reliability-app-service)
- [App Service Environment overview](environment/overview.md)
- [Tutorial: Run a load test to identify performance bottlenecks in a web app](../app-testing/load-testing/tutorial-identify-bottlenecks-azure-portal.md)
