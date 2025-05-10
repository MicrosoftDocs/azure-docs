---
title: Reliability in Azure Functions
description: Find out about reliability support in Azure Functions, including intra-regional resiliency and cross-region recovery and business continuity.
author: anaharris-ms
ms.author: anaharris
ms.topic: reliability-article
ms.service: azure-functions
ms.custom: references_regions, subject-reliability
ms.date: 05/09/2025
zone_pivot_groups: reliability-functions-hosting-plan

#Customer intent: I want to understand reliability support in Azure Functions so that I can respond to and/or avoid failures in order to minimize downtime and data loss.
---

# Reliability in Azure Functions

This article describes reliability support in [Azure Functions](../azure-functions/functions-overview.md), and covers both intra-regional resiliency with [availability zones](#availability-zone-support) and [cross-region recovery and business continuity](#cross-region-disaster-recovery-and-business-continuity). For a more detailed overview of reliability principles in Azure, see [Azure reliability](/azure/architecture/framework/resiliency/overview).

Availability zones support for Azure Functions depends on your [Functions hosting plan](../azure-functions/functions-scale.md): 

| Hosting plan | Support level | For more information... |
| ----- | ----- | ----- |
|[Flex Consumption plan](../azure-functions/flex-consumption-plan.md) | Preview | Select **Flex Consumption** at the top of this article. |
|[Elastic Premium plan](../azure-functions/functions-premium-plan.md) | GA | Select **Premium** at the top of this article. |
|[Dedicated (App Service) plan](../azure-functions/dedicated-plan.md) | GA | See [Reliability in Azure App Service](reliability-app-service.md). |
| [Consumption plan](../azure-functions/consumption-plan.md) | n/a | Not supported by the Consumption plan. |


[!INCLUDE [Availability zone description](includes/reliability-availability-zone-description-include.md)]

Azure Functions supports a [zone-redundant deployment](availability-zones-service-support.md).  

## <a name="availability-zone-support"></a>Availability zones support
::: zone pivot="flex-consumption-plan"

>[!IMPORTANT]  
>Support for availability zones when hosting your app in a Flex Consumption plan is currently in preview.

When you configure Flex Consumption plan apps as zone redundant, the platform automatically spreads instances of your function app across the zones in the selected region, with different rules for always-ready versus on-demand instances.

When zone redundancy is enabled in a Flex Consumption plan, instance spreading is determined inside the following rules:

- [Always-ready](../azure-functions/flex-consumption-plan.md#always-ready-instances) instances are distributed across zones in a round-robin fashion.
- On-demand instances, which are created as a result of event source volumes as the app scales beyond always-ready, are distributed across availability zones on a _best effort_ basis. This means that for on-demand instances, faster scale-out is given preference over even distribution across availability zones. The platform attempts to even-out distribution over time.
- To ensure zone resiliency with availability zones, the platform automatically maintains at least two always-ready instances for each [per-function scaling function or group](../azure-functions/flex-consumption-plan.md#per-function-scaling), regardless of the always-ready configuration for the app. Any instances created by the platform are platform-managed, billed as always-ready instances, and don't change the always-ready configuration settings.
::: zone-end 
::: zone pivot="premium-plan"  
When you configure Elastic Premium function app plans as zone redundant, the platform automatically spreads the function app instances across the zones in the selected region.

Instance spreading with a zone-redundant deployment is determined inside the following rules, even as the app scales in and out:

- The minimum function app instance count is three. 
- When you specify a capacity larger than the number of zones, the instances are spread evenly only when the capacity is a multiple of the number of zones. 
- For a capacity value more than Number of Zones * Number of instances, extra instances are spread across the remaining zones.

>[!IMPORTANT]
>Azure Functions can run on the Azure App Service platform. In the App Service platform, plans that host Premium plan function apps are referred to as Elastic Premium plans, with SKU names like `EP1`. If you choose to run your function app on a Premium plan, make sure to create a plan with an SKU name that starts with `E`, such as `EP1`. App Service plan SKU names that start with `P`, such as `P1V2` (Premium V2 Small plan), are [Dedicated hosting plans](../azure-functions/dedicated-plan.md). Because they're Dedicated and not Elastic Premium, plans with SKU names starting with `P` don't scale dynamically and can increase your costs.
::: zone-end  
### Regional availability
::: zone pivot="flex-consumption-plan"
Currently, not all regions support zone redundancy for Flex Consumption plans. You can use the Azure CLI to view the regions that do support it:

1. If you haven't done so already, install and sign in to Azure using the Azure CLI:

    ```azurecli
    az login
    ```

    The [`az login`](/cli/azure/reference-index#az-login) command signs you into your Azure account.

2. Use this [`az functionapp list-flexconsumption-locations`](/cli/azure/functionapp#az-functionapp-list-flexconsumption-locations) command with the `--zone-redundant=true` option to return a list of regions that currently support zone-redundant Flex Consumption plans: 

    ```azurecli-interactive
    az functionapp list-flexconsumption-locations --zone-redundant=true --query "sort_by(@, &name)[].{Region:name}" -o table
    ```

When you [create a Flex Consumption app](#create-a-function-app-in-a-zone-redundant-plan) in the Azure portal, the `Zone redundancy` section of the **Basics** page is enabled when your chosen region supports it.
::: zone-end  
::: zone pivot="premium-plan"  
Zone-redundant Premium plans are available in these regions:

| Americas         | Europe               | Middle East    | Africa             | Asia Pacific   |
|------------------|----------------------|----------------|--------------------|----------------|
| Brazil South     | France Central       | Israel Central | South Africa North | Australia East |
| Canada Central   | Germany West Central | Qatar Central  |                    | Central India  |
| Central US       | Italy North          | UAE North      |                    | China North 3  |
| East US          | North Europe         |                |                    | East Asia      |
| East US 2        | Norway East          |                |                    | Japan East     |
| South Central US | Sweden Central       |                |                    | Southeast Asia |
| West US 2        | Switzerland North    |                |                    |                |
| West US 3        | UK South             |                |                    |                |
|                  | West Europe          |                |                    |                |

::: zone-end 
### Prerequisites 
::: zone pivot="flex-consumption-plan"
Availability zone support is a property of the Flex Consumption plan. Here are current considerations for using availability zones:

- You can enable availability zones in the plan during app creation. You can also enable or disable this plan feature in an existing app via Azure CLI (Azure Portal support coming soon).
- You must use a [zone redundant storage account (ZRS)](../storage/common/storage-redundancy.md#zone-redundant-storage) for your function app's [default host storage account](../azure-functions/storage-considerations.md#storage-account-requirements). If you use a different type of storage account, your app might behave unexpectedly during a zonal outage.
- Must be hosted on a [Flex Consumption](../azure-functions/flex-consumption-plan.md) plan.
::: zone-end 
::: zone pivot="premium-plan" 
Availability zone support is a property of the Premium plan. Here are current considerations for availability zones:

- You can only enable availability zones in the plan when you create your app. You can't convert an existing Premium plan to use availability zones.
- You must use a [zone redundant storage account (ZRS)](../storage/common/storage-redundancy.md#zone-redundant-storage) for your function app's [default host storage account](../azure-functions/storage-considerations.md#storage-account-requirements). If you use a different type of storage account, your app might behave unexpectedly during a zonal outage.
- Both Windows and Linux are supported.
- Function apps hosted on a Premium plan must have a minimum of three [always ready instances](../azure-functions/functions-premium-plan.md#always-ready-instances).
- The platform enforces this minimum count behind the scenes if you specify an instance count fewer than three.
- If you aren't using Premium plan or a scale unit that supports availability zones, are in an unsupported region, or are unsure, see the [migration guidance](../reliability/migrate-functions.md).
::: zone-end 
### Pricing 
::: zone pivot="flex-consumption-plan"
There's no separate meter associated with enabling availability zones. Pricing for instances used for a zone-redundant Flex Consumption app is the same as a single zone Flex Consumption app. To learn more, see [Billing](../azure-functions/flex-consumption-plan.md#billing). 

When you enable availability zones in an app with always-ready instance configuration of fewer than two instances for each [per-function scaling function or group](../azure-functions/flex-consumption-plan.md#per-function-scaling), the platform automatically creates two instances of the [always-ready](../azure-functions/flex-consumption-plan.md#always-ready-instances) type for each per-function scaling function or group. These new instances are also billed as always-ready instances.
::: zone-end 
::: zone pivot="premium-plan" 
There's no extra cost associated with enabling availability zones. Pricing for a zone-redundant Premium App Service plan is the same as a single zone Premium plan. For each App Service plan you use, you're charged based on the SKU you choose, the capacity you specify, and any instances you scale to based on your autoscale criteria. If you enable availability zones on a plan with fewer than three instances, the platform enforces a minimum instance count of three for that App Service plan, and you're charged for all three instances.
::: zone-end 
### Create a function app in a zone-redundant plan 
::: zone pivot="flex-consumption-plan"
There are currently multiple ways to deploy a zone-redundant Flex Consumption app.

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to the **Create Function App** page. For more information about creating a function app in the portal, see [Create a function app](../azure-functions/functions-create-function-app-portal.md#create-a-function-app).

1. Select **Flex Consumption** and then select the **Select** button.

1. On the **Create Function App (Flex Consumption)** page, on the **Basics** tab, enter the settings for your function app. Pay special attention to the settings in the following table (also highlighted in the following screenshot), which have specific requirements for zone redundancy.

    | Setting      | Suggested value  | Notes for zone redundancy |
    | ------------ | ---------------- | ----------- |
    | **Region** | Your preferred supported region | The region in which your function app is created. You must select a region that supports availability zones. See the [region availability list](#regional-availability). |
    | **Zone redundancy** | Enabled | This setting specifies whether your app is zone redundant. You won't be able to select `Enabled` unless you have chosen a region that supports zone redundancy, as described previously. |
    
    :::image type="content" source="../azure-functions/media/functions-az-redundancy/azure-functions-flex-basics-az.png" alt-text="Screenshot of the Basics tab of the Flex Consumption function app create page.":::
    

1. On the **Storage** tab, enter the settings for your function app storage account. Pay special attention to the setting in the following table, which has specific requirements for zone redundancy.

    | Setting      | Suggested value  | Notes for zone redundancy |
    | ------------ | ---------------- | ----------- |
    | **Storage account** | A [zone-redundant storage account](../azure-functions/storage-considerations.md#storage-account-requirements) | As described in the [prerequisites](#prerequisites) section, we strongly recommend using a zone-redundant storage account for your zone-redundant function app. |
  
1. For the rest of the function app creation process, create your function app as normal. There are no settings in the rest of the creation process that affect zone redundancy.

#### [Azure CLI](#tab/azure-cli)

1. When creating the storage account for the function app, choose a zone redundant SKU, like `Standard_ZRS`. For example:

    ```azurecli
    az storage account create --name <STORAGE_NAME> --location <REGION> --resource-group <RESOURCE_GROUP> --sku Standard_ZRS --allow-blob-public-access false
    ``` 
 
1. When creating the Flex Consumption plan, add the `--zone-redundant true` parameter:

    ```azurecli
    az functionapp create --resource-group <RESOURCE_GROUP> --name <APP_NAME> --storage-account <STORAGE_NAME> --flexconsumption-location <REGION> --runtime <RUNTIME> --runtime-version <RUNTIME_VERSION> --zone-redundant true 
    ```

#### [Bicep template](#tab/bicep)

You can use a [Bicep template](../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md) to deploy to a zone-redundant Flex Consumption plan. To learn how to deploy function apps to a Flex Consumption, see [Automate resource deployment in Azure Functions](../azure-functions/functions-infrastructure-as-code.md?pivots=flex-consumption-plan).

The only properties to be aware of while creating a zone-redundant hosting plan are the `zoneRedundant` property. The `zoneRedundant` property must be set to `true`. 

Following is a Bicep template snippet for a zone-redundant, Flex Consumption plan. It shows the `zoneRedundant` field specification.

```bicep
resource flexFuncPlan 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: <YOUR_PLAN_NAME>
  location: <YOUR_REGION_NAME>
  kind: 'functionapp'
  sku: {
    tier: 'FlexConsumption'
    name: 'FC1'
  }
  properties: {
    reserved: true
    zoneRedundant: true
  }
}
```

To learn more about these templates, see [Automate resource deployment in Azure Functions](../azure-functions/functions-infrastructure-as-code.md).

#### [ARM template](#tab/arm-template)

You can use an [ARM template](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md) to deploy to a zone-redundant Flex Consumption plan. To learn how to deploy function apps to a Flex Consumption plan, see [Automate resource deployment in Azure Functions](../azure-functions/functions-infrastructure-as-code.md?pivots=flex-consumption-plan).

The only properties to be aware of while creating a zone-redundant hosting plan are the `zoneRedundant` property. The `zoneRedundant` property must be set to `true`. 

Following is an ARM template snippet for a zone-redundant, Flex Consumption plan. It shows the `zoneRedundant` field specification.

```json
"resources": [

    {
      "type": "Microsoft.Web/serverfarms",
      "apiVersion": "2024-04-01",
      "name": "<YOUR_PLAN_NAME>",
      "location": "<YOUR_REGION_NAME>",
      "kind": "functionapp",
      "sku": {
        "tier": "FlexConsumption",
        "name": "FC1"
      },
      "properties": {
        "reserved": true,
        "zoneRedundant": true
      }
    }
]
```

To learn more about these templates, see [Automate resource deployment in Azure Functions](../azure-functions/functions-infrastructure-as-code.md).

---

After the zone-redundant plan is created and deployed, the Flex Consumption function app hosted on your new plan is considered zone-redundant.

### Update a Flex Consumption plan to be zone-redundant 

Changing the zone redundancy of you app requires a restart, which causes downtime in your app.  

Before updating your Flex Consumption plan to be zone-redundant, you should update the default host storage account to also be zone redundant. If you use a separate storage account for the app's deployment container, should update it to be zone redundant as well. 

Use these steps to prepare your storage accounts for the change:

1. Review [Storage Considerations](../azure-functions/storage-considerations.md).
1. Create or identify a zone-redundant storage account to associate with the app.
1. Update the storage related application settings of the app, like `AzureWebJobsStorage`, to reference the zone redundant storage account. See [Work with application settings](../azure-functions/functions-how-to-use-azure-function-app-settings.md#use-application-settings).
1. Update the deployment storage account for the app, which can be the same or different as the storage account associated with the app. See [Configure deployment settings](../azure-functions/flex-consumption-how-to.md#configure-deployment-settings).

After the storage accounts used by your app are updated, you can update the Flex Consumption plan to be zone-redundant using Bicep or ARM templates. The Azure portal and Azure CLI don't currently support making zone redundancy updates to the plan. 

#### [Azure portal](#tab/azure-portal)
Not currently supported.

#### [Azure CLI](#tab/azure-cli)
Not currently supported.

<!-- Uncomment after AZ support is fixed:
1. Update the Flex Consumption app and set the `--zone-redundant true` parameter:

    ```azurecli
    PLAN_RESOURCE_ID=$(az functionapp show --resource-group <RESOURCE_GROUP> --name <APP_NAME> --query "properties.serverFarmId"  -o tsv) 

    az functionapp plan update --ids $PLAN_RESOURCE_ID --set zoneRedundant=true
    ```
-->
#### [Bicep template](#tab/bicep)

You can use this Bicep file to add the `zoneRedundant` property to `true` in an existing plan definition: 

```bicep
resource existingServerFarm 'Microsoft.Web/serverfarms@2024-04-01' existing = {
  name: '<YOUR_PLAN_NAME>'
  scope: resourceGroup()
}

resource updatedServerFarm 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: existingServerFarm.name
  location: '<YOUR_REGION_NAME>'
  kind: 'functionapp'
  sku: {
    tier: 'FlexConsumption'
    name: 'FC1'
  }
  properties: {
    reserved: true
    zoneRedundant: true  // Enables zone redundancy
  }
}
```

In this file, replace `<YOUR_PLAN_NAME>` and `<YOUR_REGION_NAME>` with the name of your plan and region, respectively. To learn how to deploy a Bicep file, see [Deploy your template](../azure-functions/functions-infrastructure-as-code.md#deploy-your-template).

#### [ARM template](#tab/arm-template)

You can use this ARM template fragment to set the `zoneRedundant` property to `true` in an existing plan definition: 

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Web/serverfarms",
      "apiVersion": "2024-04-01",
      "name": "<YOUR_PLAN_NAME>",
      "location": "<YOUR_REGION_NAME>",
      "kind": "functionapp",
      "sku": {
        "tier": "FlexConsumption",
        "name": "FC1"
      },
      "properties": {
        "reserved": true,
        "zoneRedundant": true
      }
    }
  ]
}
```

In this template, replace `<YOUR_PLAN_NAME>` and `<YOUR_REGION_NAME>` with the name of your plan and region, respectively. To learn how to deploy an ARM template, see [Deploy your template](../azure-functions/functions-infrastructure-as-code.md#deploy-your-template).

---

::: zone-end 
::: zone pivot="premium-plan" 
There are currently two ways to deploy a zone-redundant Premium plan and function app. You can use either the [Azure portal](https://portal.azure.com) or an ARM template.

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to the **Create Function App** page. For more information about creating a function app in the portal, see [Create a function app](../azure-functions/functions-create-function-app-portal.md#create-a-function-app).

1. Select **Functions Premium** and then select the **Select** button. 

1. On the **Create Function App (Functions Premium)** page, on the **Basics** tab, enter the settings for your function app. Pay special attention to the settings in the following table (also highlighted in the following screenshot), which have specific requirements for zone redundancy.

    | Setting      | Suggested value  | Notes for zone redundancy |
    | ------------ | ---------------- | ----------- |
    | **Region** | Your preferred supported region | The region under which the new function app is created. You must pick a region that supports availability zones. See the [region availability list](#regional-availability). |  
    | **Pricing plan** | One of the Elastic Premium plans. For more information, see [Available instance SKUs](../azure-functions/functions-premium-plan.md#available-instance-skus). | This article describes how to create a zone redundant app in a Premium plan. Zone redundancy isn't currently available in Consumption plans. For information on zone redundancy on App Service plans, see [Reliability in Azure App Service](./reliability-app-service.md). |
    | **Zone redundancy** | Enabled | This setting specifies whether your app is zone redundant. You won't be able to select `Enabled` unless you have chosen a region that supports zone redundancy, as described previously. |
    
    :::image type="content" source="../azure-functions/media/functions-az-redundancy/azure-functions-ep-basics-az.png" alt-text="Screenshot of the Basics tab of the function app create page.":::
    

1. On the **Storage** tab, enter the settings for your function app storage account. Pay special attention to the setting in the following table, which has specific requirements for zone redundancy.

    | Setting      | Suggested value  | Notes for zone redundancy |
    | ------------ | ---------------- | ----------- |
    | **Storage account** | A [zone-redundant storage account](../azure-functions/storage-considerations.md#storage-account-requirements) | As described in the [prerequisites](#prerequisites) section, we strongly recommend using a zone-redundant storage account for your zone-redundant function app. |
  
1. For the rest of the function app creation process, create your function app as normal. There are no settings in the rest of the creation process that affect zone redundancy.

#### [Azure CLI](#tab/azure-cli)

1. When creating the storage account for the function app, choose a zone redundant SKU, like `Standard_ZRS`. For example:

    ```azurecli
    az storage account create --name <STORAGE_NAME> --location <REGION> --resource-group <RESOURCE_GROUP> --sku Standard_ZRS --allow-blob-public-access false
    ``` 
 
1. When creating the Premium plan, add the `--zone-redundant true` parameter:

    ```azurecli
    az functionapp create --resource-group <RESOURCE_GROUP> --name <APP_NAME> --storage-account <STORAGE_NAME> --SKU EP1 --zone-redundant true 
    ```

#### [Bicep template](#tab/bicep)

You can use a [Bicep template](../azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code.md) to deploy to a zone-redundant Premium plan. To learn how to deploy function apps to a Premium plan, see [Automate resource deployment in Azure Functions](../azure-functions/functions-infrastructure-as-code.md?pivots=premium-plan).

The only properties to be aware of while creating a zone-redundant hosting plan are the `zoneRedundant` property and the plan's instance count (`capacity`) fields. The `zoneRedundant` property must be set to `true` and the `capacity` property should be set based on the workload requirement, but not less than `3`. Choosing the right capacity varies based on several factors and high availability / fault tolerance strategies. A good rule of thumb is to specify sufficient instances for the application to ensure that losing one zone instance leaves sufficient capacity to handle expected load.

> [!IMPORTANT]
> Azure Functions apps hosted on an Elastic Premium, zone-redundant plan must have a minimum [always ready instance](../azure-functions/functions-premium-plan.md#always-ready-instances) count of 3. This minimum ensures that a zone-redundant function app always has enough instances to satisfy at least one worker per zone.

Following is a Bicep template snippet for a zone-redundant, Premium plan. It shows the `zoneRedundant` field and the `capacity` specification.

```bicep
resource flexFuncPlan 'Microsoft.Web/serverfarms@2021-01-15' = {
    name: '<YOUR_PLAN_NAME>'
    location: '<YOUR_REGION_NAME>'
    sku: {
        name: 'EP1'
        tier: 'ElasticPremium'
        size: 'EP1'
        family: 'EP'
        capacity: 3
    }
    kind: 'elastic'
    properties: {
        perSiteScaling: false
        elasticScaleEnabled: true
        maximumElasticWorkerCount: 20
        isSpot: false
        reserved: false
        isXenon: false
        hyperV: false
        targetWorkerCount: 0
        targetWorkerSizeId: 0
        zoneRedundant: true
    }
}
```

To learn more about these templates, see [Automate resource deployment in Azure Functions](../azure-functions/functions-infrastructure-as-code.md).

#### [ARM template](#tab/arm-template)

You can use an [ARM template](../azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code.md) to deploy to a zone-redundant Premium plan. To learn how to deploy function apps to a Premium plan, see [Automate resource deployment in Azure Functions](../azure-functions/functions-infrastructure-as-code.md?pivots=premium-plan).

The only properties to be aware of while creating a zone-redundant hosting plan are the `zoneRedundant` property and the plan's instance count (`capacity`) fields. The `zoneRedundant` property must be set to `true` and the `capacity` property should be set based on the workload requirement, but not less than `3`. Choosing the right capacity varies based on several factors and high availability / fault tolerance strategies. A good rule of thumb is to specify sufficient instances for the application to ensure that losing one zone instance leaves sufficient capacity to handle expected load.

> [!IMPORTANT]
> Azure Functions apps hosted on an Elastic Premium, zone-redundant plan must have a minimum [always ready instance](../azure-functions/functions-premium-plan.md#always-ready-instances) count of 3. This minimum ensures that a zone-redundant function app always has enough instances to satisfy at least one worker per zone.

Following is an ARM template snippet for a zone-redundant, Premium plan. It shows the `zoneRedundant` field and the `capacity` specification.

```json
"resources": [
    {
        "type": "Microsoft.Web/serverfarms",
        "apiVersion": "2021-01-15",
        "name": "<YOUR_PLAN_NAME>",
        "location": "<YOUR_REGION_NAME>",
        "sku": {
            "name": "EP1",
            "tier": "ElasticPremium",
            "size": "EP1",
            "family": "EP", 
            "capacity": 3
        },
        "kind": "elastic",
        "properties": {
            "perSiteScaling": false,
            "elasticScaleEnabled": true,
            "maximumElasticWorkerCount": 20,
            "isSpot": false,
            "reserved": false,
            "isXenon": false,
            "hyperV": false,
            "targetWorkerCount": 0,
            "targetWorkerSizeId": 0, 
            "zoneRedundant": true
        }
    }
]
```

To learn more about these templates, see [Automate resource deployment in Azure Functions](../azure-functions/functions-infrastructure-as-code.md).

---

After the zone-redundant plan is created and deployed, any function app hosted on your new plan is considered zone-redundant.

### Availability zone migration

You can't currently change the availability zone support of an Elastic Premium plan for an existing function app. For information on how to migrate the public multitenant Premium plan from non-availability zone to availability zone support, see [Migrate App Service to availability zone support](../reliability/migrate-functions.md).
::: zone-end 
### Zone down experience
::: zone pivot="flex-consumption-plan"
All available function app instances of zone-redundant Flex Consumption plan apps are enabled and processing events. Flex Consumption apps continue to run even when other zones in the same region suffer an outage. However, it's possible that non-runtime behaviors might be impacted as a result of an outage in other availability zones. Standard function app behaviors can impact availability include:

+ Scaling
+ App creation 
+ Configuration changes
+ Deployments

Zone redundancy for Flex Consumption plans only guarantees continued uptime for deployed applications.

When a zone goes down, Functions detects lost instances and automatically attempts to locate or create replacement instances, as needed, in the available zones. During zonal outage, the platform tries to restore balance on the available zones remaining.
::: zone-end  
::: zone pivot="premium-plan" 
All available function app instances of zone-redundant function apps are enabled and processing events. When a zone goes down, Functions detect lost instances and automatically attempts to find new replacement instances if needed. Elastic scale behavior still applies. However, in a zone-down scenario there's no guarantee that requests for additional instances can succeed, since back-filling lost instances occurs on a best-effort basis.
Applications that are deployed in an availability zone enabled Premium plan continue to run even when other zones in the same region suffer an outage. However, it's possible that non-runtime behaviors could still be impacted from an outage in other availability zones. These impacted behaviors can include Premium plan scaling, application creation, application configuration, and application publishing. Zone redundancy for Premium plans only guarantees continued uptime for deployed applications.

When Functions allocates instances to a zone redundant Premium plan, it uses best effort zone balancing offered by the underlying Azure Virtual Machine Scale Sets. A Premium plan is considered balanced when each zone has either the same number of VMs (± 1 VM) in all of the other zones used by the Premium plan.
::: zone-end

## Cross-region disaster recovery and business continuity

[!INCLUDE [introduction to disaster recovery](includes/reliability-disaster-recovery-description-include.md)]

This section explains some of the strategies that you can use to deploy Functions to allow for disaster recovery.

For disaster recovery for Durable Functions, see [Disaster recovery and geo-distribution in Azure Durable Functions](../azure-functions/durable/durable-functions-disaster-recovery-geo-distribution.md).

### Multi-region disaster recovery

Because there is no built-in redundancy available, functions run in a function app in a specific Azure region. To avoid loss of execution during outages, you can redundantly deploy the same functions to function apps in multiple regions. To learn more about multi-region deployments, see the guidance in [Highly available multi-region web application](/azure/architecture/reference-architectures/app-service-web-app/multi-region).
 
When you run the same function code in multiple regions, there are two patterns to consider, [active-active](#active-active-pattern-for-http-trigger-functions) and [active-passive](#active-passive-pattern-for-non-https-trigger-functions).

#### Active-active pattern for HTTP trigger functions

With an active-active pattern, functions in both regions are actively running and processing events, either in a duplicate manner or in rotation. It's recommended that you use an active-active pattern in combination with [Azure Front Door](../frontdoor/front-door-overview.md) for your critical HTTP triggered functions, which can route and round-robin HTTP requests between functions running in multiple regions. Front door can also periodically check the health of each endpoint. When a function in one region stops responding to health checks, Azure Front Door takes it out of rotation, and only forwards traffic to the remaining healthy functions.  

![Architecture for Azure Front Door and Function](../azure-functions/media/functions-geo-dr/front-door.png)  

For an example please refer to the sample on how to [implement the geode pattern by deploying the API to geodes in distributed Azure regions.](https://github.com/mspnp/geode-pattern-accelerator).

>[!IMPORTANT]
>Although, it's highly recommended that you use the [active-passive pattern](#active-passive-pattern-for-non-https-trigger-functions) for non-HTTPS trigger functions. You can create active-active deployments for non-HTTP triggered functions. However, you need to consider how the two active regions interact or coordinate with one another. When you deploy the same function app to two regions with each triggering on the same Service Bus queue, they would act as competing consumers on de-queueing that queue. While this means each message is only being processed by either one of the instances, it also means there's still a single point of failure on the single Service Bus instance. 
>
>You could instead deploy two Service Bus queues, with one in a primary region, one in a secondary region. In this case, you could have two function apps, with each pointed to the Service Bus queue active in their region. The challenge with this topology is how the queue messages are distributed between the two regions.  Often, this means that each publisher attempts to publish a message to *both* regions, and each message is processed by both active function apps. While this creates the desired active/active pattern, it also creates other challenges around duplication of compute and when or how data is consolidated. 


### Active-passive pattern for non-HTTPS trigger functions

It's recommended that you use active-passive pattern for your event-driven, non-HTTP triggered functions, such as Service Bus and Event Hubs triggered functions.

To create redundancy for non-HTTP trigger functions, use an active-passive pattern. With an active-passive pattern, functions run actively in the region that's receiving events; while the same functions in a second region remain idle. The active-passive pattern provides a way for only a single function to process each message while providing a mechanism to fail over to the secondary region in a disaster. Function apps work with the failover behaviors of the partner services, such as [Azure Service Bus geo-recovery](../service-bus-messaging/service-bus-geo-dr.md) and [Azure Event Hubs geo-recovery](../event-hubs/event-hubs-geo-dr.md). 

Consider an example topology using an Azure Event Hubs trigger. In this case, the active/passive pattern requires involve the following components:

* Azure Event Hubs deployed to both a primary and secondary region.
* [Geo-disaster enabled](../service-bus-messaging/service-bus-geo-dr.md) to pair the primary and secondary event hubs. This also creates an _alias_ you can use to connect to event hubs and switch from primary to secondary without changing the connection info.
* Function apps are deployed to both the primary and secondary (failover) region, with the app in the secondary region essentially being idle because messages aren't being sent there.
* Function app triggers on the *direct* (non-alias) connection string for its respective event hub. 
* Publishers to the event hub should publish to the alias connection string. 

![Active-passive example architecture](../azure-functions/media/functions-geo-dr/active-passive.png)

Before failover, publishers sending to the shared alias route to the primary event hub. The primary function app is listening exclusively to the primary event hub. The secondary function app is passive and idle. As soon as failover is initiated, publishers sending to the shared alias are routed to the secondary event hub. The secondary function app now becomes active and starts triggering automatically. Effective failover to a secondary region can be driven entirely from the event hub, with the functions becoming active only when the respective event hub is active.

Read more on information and considerations for failover with [Service Bus](../service-bus-messaging/service-bus-geo-dr.md) and [Event Hubs](../event-hubs/event-hubs-geo-dr.md).


## Next steps

- [Disaster recovery and geo-distribution in Azure Durable Functions](../azure-functions/durable/durable-functions-disaster-recovery-geo-distribution.md)
- [Create Azure Front Door](../frontdoor/quickstart-create-front-door.md)
- [Event Hubs failover considerations](../event-hubs/event-hubs-geo-dr.md#considerations)
- [Azure Architecture Center's guide on availability zones](/azure/architecture/high-availability/building-solutions-for-high-availability)
- [Reliability in Azure](./overview.md)
