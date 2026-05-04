---
title: Configure Zone Redundancy for Azure Functions
description: Learn how to configure zone redundancy for Azure Functions, create zone-redundant Function Apps, and migrate existing function apps to use multiple availability zones.
author: glynnniall
ms.author: glynnniall
ms.topic: how-to
ms.date: 02/19/2026
zone_pivot_groups: reliability-functions-hosting-plan

#Customer intent: I want to configure my Azure Functions with availability zone support to improve resilience and handle zone failures.
---

# Configure zone redundancy for Azure Functions

Zone redundancy enables your function apps to be resilient to problems in Azure availability zones, so your app remains available when a datacenter or zone has an outage. This article provides step-by-step guidance for configuring Azure Functions to be zone-redundant, depending on your hosting plan. For information about how availability zones work with Azure Functions, see [Reliability in Azure Functions](/azure/reliability/reliability-functions).

Availability zone configuration for Azure Functions depends on your [Functions hosting plan](/azure/azure-functions/functions-scale):

| Hosting plan | Support level | Configuration section |
| ----- | ----- | ----- |
| [Flex Consumption plan](/azure/azure-functions/flex-consumption-plan) | GA | Select **Flex Consumption** at the top of this article. |
| [Elastic Premium plan](/azure/azure-functions/functions-premium-plan) | GA | Select **Premium** at the top of this article. |
| [Dedicated (App Service) plan](/azure/azure-functions/dedicated-plan) | GA | See [Configure availability zones for App Service](../app-service/how-to-zone-redundancy.md). |
| [Consumption plan](/azure/azure-functions/consumption-plan) | n/a | Not supported by the Consumption plan. |

::: zone pivot="flex-consumption-plan"

> [!IMPORTANT]  
> Before configuring zone redundancy, review the requirements and details listed in [Reliability in Azure Functions - Resilience to availability zone failures](/azure/reliability/reliability-functions?pivots=flex-consumption#resilience-to-availability-zone-failures).

::: zone-end

::: zone pivot="premium-plan"

> [!IMPORTANT]  
> Before configuring zone redundancy, review the requirements and details listed in [Reliability in Azure Functions - Resilience to availability zone failures](/azure/reliability/reliability-functions?pivots=premium#resilience-to-availability-zone-failures).
> 
> You can enable or disable availability zones on existing Elastic Premium plans using the Azure CLI. See [Enable zone redundancy on an existing plan](#enable-zone-redundancy-on-an-existing-plan) for important details about Elastic Premium-specific capacity behavior.

::: zone-end

::: zone pivot="flex-consumption-plan"

## View regions that support availability zones

Zone-redundant Flex Consumption plans can be deployed into a specific set of regions. For the current list, use the Azure CLI:

1. If you haven't done so already, install and sign in to Azure using the Azure CLI:

    ```azurecli
    az login
    ```

1. Use the [`az functionapp list-flexconsumption-locations`](/cli/azure/functionapp#az-functionapp-list-flexconsumption-locations) command with the `--zone-redundant=true` argument, which returns a list of regions that currently support zone-redundant Flex Consumption plans:

    ```azurecli-interactive
    az functionapp list-flexconsumption-locations --zone-redundant=true --query "sort_by(@, &name)[].{Region:name}" -o table
    ```

::: zone-end

## Create a zone-redundant function app

::: zone pivot="flex-consumption-plan"

Follow these steps to create a zone-redundant Flex Consumption plan when you create your app.

#### [Azure portal](#tab/azure-portal)

1. To create a function app in a zone-redundant plan, you must have an existing [zone-redundant storage account](/azure/azure-functions/storage-considerations#storage-account-requirements). If you don't already have a zone-redundant storage account, create one before you proceed.

1. In the Azure portal, go to the **Create Function App** page. For more information about creating a function app in the portal, see [Create a function app](/azure/azure-functions/functions-create-function-app-portal#create-a-function-app).

1. Select **Flex Consumption** and then select the **Select** button.

1. On the **Create Function App (Flex Consumption)** page, on the **Basics** tab, enter the settings for your function app. Pay special attention to the settings in the following table (also highlighted in the following screenshot), which have specific requirements for zone redundancy.

    |Setting|Suggested value|Notes for zone redundancy|
    |-------|---------------|-------------------------|
    |**Region**|Your preferred supported region|The region in which your Flex Consumption plan is created. For a list of regions that support zone redundancy for Azure Functions Premium plans, see [Reliability in Azure Functions - Resilience to availability zone failures - Requirements](/azure/reliability/reliability-functions#requirements).|
    |**Zone redundancy**|Enabled|This setting specifies whether your app is zone redundant. You can only select `Enabled` when you've chosen a region that supports zone redundancy.|

    :::image type="content" source="./media/functions-az-redundancy/azure-functions-flex-basics-az.png" alt-text="Screenshot of the Basics tab of the Flex Consumption function app create page.":::

1. On the **Storage** tab, select the zone-redundant storage account for your function app. Pay special attention to the setting in the following table, which has specific requirements for zone redundancy.

    |Setting|Suggested value|Notes for zone redundancy|
    |-------|---------------|-------------------------|
    |**Storage account**|A [zone-redundant storage account](/azure/azure-functions/storage-considerations#storage-account-requirements)|As described in the [reliability guide for Azure Functions](/azure/reliability/reliability-functions?pivots=flex-consumption#resilience-to-availability-zone-failures), we strongly recommend using a zone-redundant storage account for your zone-redundant function app.|
  
1. For the rest of the function app creation process, create your function app as normal. There are no settings in the rest of the creation process that affect zone redundancy.

#### [Azure CLI](#tab/azure-cli)

1. When creating the storage account for the function app, choose a zone redundant SKU, like `Standard_ZRS`. For example:

    ```azurecli
    az storage account create \
      --name <STORAGE_NAME> \
      --location <REGION> \
      --resource-group <RESOURCE_GROUP> \
      --sku Standard_ZRS \
      --allow-blob-public-access false
    ```

1. When creating the Flex Consumption plan and app, add the `--zone-redundant true` parameter:

    ```azurecli
    az functionapp create \
      --resource-group <RESOURCE_GROUP> \
      --name <APP_NAME> \
      --storage-account <STORAGE_NAME> \
      --flexconsumption-location <REGION> \
      --runtime <RUNTIME> \
      --runtime-version <RUNTIME_VERSION> \
      --zone-redundant true 
    ```

#### [Bicep](#tab/bicep)

You can use a [Bicep file](/azure/azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code) to deploy to a zone-redundant Flex Consumption plan. To learn how to deploy function apps to a Flex Consumption, see [Automate resource deployment in Azure Functions](/azure/azure-functions/functions-infrastructure-as-code?pivots=flex-consumption-plan).

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

To learn more about these templates, see [Automate resource deployment in Azure Functions](/azure/azure-functions/functions-infrastructure-as-code).

#### [ARM template](#tab/arm-template)

You can use an [ARM template](/azure/azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code) to deploy to a zone-redundant Flex Consumption plan. To learn how to deploy function apps to a Flex Consumption plan, see [Automate resource deployment in Azure Functions](/azure/azure-functions/functions-infrastructure-as-code?pivots=flex-consumption-plan).

The only properties to be aware of while creating a zone-redundant hosting plan are the `zoneRedundant` property. The `zoneRedundant` property must be set to `true`.

Following is an ARM template snippet for a zone-redundant, Flex Consumption plan. It shows the `zoneRedundant` field specification.

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

To learn more about these templates, see [Automate resource deployment in Azure Functions](/azure/azure-functions/functions-infrastructure-as-code).

---

After the zone-redundant plan is created and deployed, the Flex Consumption function app hosted on your new plan is considered zone-redundant.

::: zone-end

::: zone pivot="premium-plan"

Follow these steps to create a zone-redundant Premium plan and app.

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to the **Create Function App** page. For more information about creating a function app in the portal, see [Create a function app](/azure/azure-functions/functions-create-function-app-portal#create-a-function-app).

1. Select **Functions Premium** and then select the **Select** button.

1. On the **Create Function App (Functions Premium)** page, on the **Basics** tab, enter the settings for your function app. Pay special attention to the settings in the following table (also highlighted in the following screenshot), which have specific requirements for zone redundancy.

    |Setting|Suggested value|Notes for zone redundancy|
    |-------|---------------|-------------------------|
    |**Region**|Your preferred supported region|The region in which your Elastic Premium plan is created. You must pick a region that supports availability zones. For a list of regions that support zone redundancy for Azure Functions Premium plans, see [Reliability in Azure Functions - Resilience to availability zone failures - Requirements](/azure/reliability/reliability-functions#requirements).|
    |**Pricing plan**|One of the Elastic Premium plans. For more information, see [Available instance SKUs](/azure/azure-functions/functions-premium-plan#available-instance-skus).|This article describes how to create a zone redundant app in a Premium plan. Zone redundancy isn't currently available in Consumption plans. For information on zone redundancy on App Service plans, see [Configure availability zones for App Service](../app-service/how-to-zone-redundancy.md).|
    |**Zone redundancy**|Enabled|This setting specifies whether your app is zone redundant. You won't be able to select `Enabled` unless you have chosen a region that supports zone redundancy, as described previously.|

    :::image type="content" source="./media/functions-az-redundancy/azure-functions-ep-basics-az.png" alt-text="Screenshot of the Basics tab of the function app create page.":::

1. On the **Storage** tab, enter the settings for your function app storage account. Pay special attention to the setting in the following table, which has specific requirements for zone redundancy.

    |Setting|Suggested value|Notes for zone redundancy|
    |-------|---------------|-------------------------|
    |**Storage account**|A [zone-redundant storage account](/azure/azure-functions/storage-considerations#storage-account-requirements)|As described in the [reliability guide for Azure Functions](/azure/reliability/reliability-functions?pivots=premium#resilience-to-availability-zone-failures), we strongly recommend using a zone-redundant storage account for your zone-redundant function app.|
  
1. For the rest of the function app creation process, create your function app as normal. There are no settings in the rest of the creation process that affect zone redundancy.

#### [Azure CLI](#tab/azure-cli)

1. When creating the storage account for the function app, choose a zone redundant SKU, like `Standard_ZRS`. For example:

    ```azurecli
    az storage account create \
      --name <STORAGE_NAME> \
      --location <REGION> \
      --resource-group <RESOURCE_GROUP> \
      --sku Standard_ZRS \
      --allow-blob-public-access false
    ```

1. When creating the Premium plan, add the `--zone-redundant true` parameter:

    ```azurecli
    az functionapp plan create \
      --resource-group <RESOURCE_GROUP> \
      --name <PLAN_NAME> \
      --location <REGION> \
      --sku EP1 \
      --zone-redundant true
    ```

1. Create the function app and associate it with the zone-redundant Premium plan:

    ```azurecli
    az functionapp create \
      --resource-group <RESOURCE_GROUP> \
      --name <APP_NAME> \
      --storage-account <STORAGE_NAME> \
      --plan <PLAN_NAME> \
      --runtime <RUNTIME> \
      --runtime-version <RUNTIME_VERSION>
    ```

#### [Bicep template](#tab/bicep)

You can use a [Bicep file](/azure/azure-resource-manager/bicep/quickstart-create-bicep-use-visual-studio-code) to deploy to a zone-redundant Premium plan. To learn how to deploy function apps to a Premium plan, see [Automate resource deployment in Azure Functions](/azure/azure-functions/functions-infrastructure-as-code?pivots=premium-plan).

The only properties to be aware of while creating a zone-redundant hosting plan are the `zoneRedundant` property and the plan's instance count (`capacity`) fields. The `zoneRedundant` property must be set to `true` and the `capacity` property should be set based on the workload requirement, but not less than `3`. Choosing the right capacity varies based on several factors and high availability / fault tolerance strategies. A good rule of thumb is to specify sufficient instances for the application to ensure that losing one zone instance leaves sufficient capacity to handle expected load.

> [!IMPORTANT]
> Azure Functions apps hosted on an Elastic Premium, zone-redundant plan must have a minimum [always ready instance](/azure/azure-functions/functions-premium-plan#always-ready-instances) count of 2. This minimum ensures that a zone-redundant function app always has enough instances to satisfy at least one worker per zone.

Following is a Bicep template snippet for a zone-redundant, Premium plan. It shows the `zoneRedundant` field and the `capacity` specification.

```bicep
resource EPFuncPlan 'Microsoft.Web/serverfarms@2024-04-01' = {
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

To learn more about these templates, see [Automate resource deployment in Azure Functions](/azure/azure-functions/functions-infrastructure-as-code).

#### [ARM template](#tab/arm-template)

You can use an [ARM template](/azure/azure-resource-manager/templates/quickstart-create-templates-use-visual-studio-code) to deploy to a zone-redundant Premium plan. To learn how to deploy function apps to a Premium plan, see [Automate resource deployment in Azure Functions](/azure/azure-functions/functions-infrastructure-as-code?pivots=premium-plan).

The only properties to be aware of while creating a zone-redundant hosting plan are the `zoneRedundant` property and the plan's instance count (`capacity`) fields. The `zoneRedundant` property must be set to `true` and the `capacity` property should be set based on the workload requirement, but not less than `3`. Choosing the right capacity varies based on several factors and high availability / fault tolerance strategies. A good rule of thumb is to specify sufficient instances for the application to ensure that losing one zone instance leaves sufficient capacity to handle expected load.

> [!IMPORTANT]
> Azure Functions apps hosted on an Elastic Premium, zone-redundant plan must have a minimum [always ready instance](/azure/azure-functions/functions-premium-plan#always-ready-instances) count of 2. This minimum ensures that a zone-redundant function app always has enough instances to satisfy at least one worker per zone.

Following is an ARM template snippet for a zone-redundant, Premium plan. It shows the `zoneRedundant` field and the `capacity` specification.

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
}
```

To learn more about these templates, see [Automate resource deployment in Azure Functions](/azure/azure-functions/functions-infrastructure-as-code).

---

After the zone-redundant plan is created and deployed, any function app hosted on your new plan is considered zone-redundant.

::: zone-end

## Enable zone redundancy on an existing plan

::: zone pivot="flex-consumption-plan"

Changing the zone redundancy of your app requires a restart, which causes downtime in your app.

Before updating your Flex Consumption plan to be zone-redundant, you should update the default host storage account to also be zone redundant. If you use a separate storage account for the app's deployment container, you should update it to be zone redundant as well.

Use these steps to prepare your storage accounts for the change:

1. Review [Storage Considerations](/azure/azure-functions/storage-considerations).
1. Create or identify a zone-redundant storage account to be the default host storage account for the app.
1. Update the storage related application settings of the app, like `AzureWebJobsStorage`, to reference the zone redundant storage account. See [Work with application settings](/azure/azure-functions/functions-how-to-use-azure-function-app-settings#use-application-settings).
1. Update the deployment storage account for the app, which can be the same or different as the storage account associated with the app. See [Configure deployment settings](/azure/azure-functions/flex-consumption-how-to#configure-deployment-settings).

After the storage accounts used by your app are updated, you can update the Flex Consumption plan to be zone-redundant using Bicep or ARM templates. The Azure portal currently doesn't support making zone redundancy updates to the plan.

### Update zone redundancy settings

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, search for and select the function app to update.

1. Under **Settings**, select **Scale and Concurrency**.

1. On the **Zone redundancy** tab, check **Add zone redundancy** to enable the feature. If already checked, you can uncheck this box to disable the feature.

1. Select **Save** to commit your changes and restart the app.

:::image type="content" source="./media/functions-az-redundancy/azure-functions-flex-update-az.png" alt-text="Screenshot of the Scale and Concurrency tab of a Flex Consumption function app.":::

#### [Azure CLI](#tab/azure-cli)

Update the app by using the `--zone-redundant` parameter of the [az functionapp plan update](/cli/azure/functionapp/plan#az-functionapp-plan-update) command. Use a value of `true` to enable zone redundancy and `false` disable the feature. This example enables zone redundancy for an existing app in a Flex Consumption plan:

```azurecli
PLAN_RESOURCE_ID=$(az functionapp show --resource-group <RESOURCE_GROUP> --name <APP_NAME> --query "properties.serverFarmId"  -o tsv) 

az functionapp plan update --ids $PLAN_RESOURCE_ID --set zoneRedundant=true
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with the names of your resource group and app, respectively.

#### [Bicep](#tab/bicep)

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

In this file, replace `<YOUR_PLAN_NAME>` and `<YOUR_REGION_NAME>` with the name of your plan and region, respectively. To learn how to deploy a Bicep file, see [Deploy your template](/azure/azure-functions/functions-infrastructure-as-code#deploy-your-template).

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

In this template, replace `<YOUR_PLAN_NAME>` and `<YOUR_REGION_NAME>` with the name of your plan and region, respectively. To learn how to deploy an ARM template, see [Deploy your template](/azure/azure-functions/functions-infrastructure-as-code#deploy-your-template).

---

::: zone-end

::: zone pivot="premium-plan"

You can enable or disable zone redundancy on existing Elastic Premium plans using the Azure CLI. The `zoneRedundant` property is mutable for Elastic Premium plans, allowing you to toggle availability zone support without creating a new plan.

> [!IMPORTANT]
> Elastic Premium plans capacity behavior differs from Dedicated (App Service) plans. In Elastic Premium, the plan's instance count (`sku.capacity`) is **derived from the app level**, not set directly on the plan. Each function app in the plan has a `minimumElasticInstanceCount` property (always-ready instances), and the control plane automatically sets the plan's `sku.capacity` to the **highest `minimumElasticInstanceCount` across all apps** in the plan. 
>
> When enabling zone redundancy, you must update **both** the plan-level `zoneRedundant` property to `true` and `sku.capacity` to `2` **and** the app-level `minimumElasticInstanceCount` to at least 2 on each function app that you want to be zone redundant. Setting in the plan update command alone does not enforce a minimum of 2 instances.

#### [Azure portal](#tab/azure-portal)

Portal support for toggling availability zone redundancy on existing Elastic Premium plans is not yet available. Use the Azure CLI tab for the current supported workflow.

#### [Azure CLI](#tab/azure-cli)

Follow these steps to enable zone redundancy on an existing Elastic Premium plan:

1. Enable zone redundancy on the plan:

    ```azurecli
    az appservice plan update \
      --resource-group <RESOURCE_GROUP> \
      --name <PLAN_NAME> \
      --set zoneRedundant=true sku.capacity=2
    ```

    > [!NOTE]
    > The `sku.capacity=2` parameter in this command sets the intended minimum, but it is not enforced until you complete step 2.

1. Update always-ready instances to at least 2 for each function app that needs to be zone zone redundant in the plan:

    ```azurecli
    az functionapp update \
      --resource-group <RESOURCE_GROUP> \
      --name <APP_NAME> \
      --set siteConfig.minimumElasticInstanceCount=2
    ```

    The plan's actual `sku.capacity` will update to reflect the highest `minimumElasticInstanceCount` across all apps.

To disable zone redundancy on an existing plan:

```azurecli
az appservice plan update \
  --resource-group <RESOURCE_GROUP> \
  --name <PLAN_NAME> \
  --set zoneRedundant=false
```

After disabling zone redundancy, you can optionally reduce `minimumElasticInstanceCount` back to 1 on your function apps if desired.

#### [Bicep template](#tab/bicep)

You can update an existing Elastic Premium plan to be zone-redundant using Bicep templates. The following example shows how to enable zone redundancy:

```bicep
resource EPFuncPlan 'Microsoft.Web/serverfarms@2024-04-01' existing = {
  name: '<YOUR_PLAN_NAME>'
}

resource EPFuncPlanUpdate 'Microsoft.Web/serverfarms@2024-04-01' = {
  name: EPFuncPlan.name
  location: EPFuncPlan.location
  sku: {
    name: 'EP1'
    tier: 'ElasticPremium'
    size: 'EP1'
    family: 'EP'
    capacity: 2
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

resource FunctionApp 'Microsoft.Web/sites@2024-04-01' = {
  name: '<YOUR_APP_NAME>'
  location: EPFuncPlan.location
  kind: 'functionapp'
  properties: {
    serverFarmId: EPFuncPlan.id
    siteConfig: {
      minimumElasticInstanceCount: 2
    }
  }
}
```

> [!NOTE]
> Remember to update the `minimumElasticInstanceCount` property to at least 2 on all function apps in the plan to ensure zone redundancy requirements are met.

#### [ARM template](#tab/arm-template)

You can update an existing Elastic Premium plan to be zone-redundant using ARM templates. The following example shows how to enable zone redundancy:

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
      "sku": {
        "name": "EP1",
        "tier": "ElasticPremium",
        "size": "EP1",
        "family": "EP",
        "capacity": 2
      },
      ...
      "properties": {
        ...
        "zoneRedundant": true
      }
    },
    {
      "type": "Microsoft.Web/sites",
      "apiVersion": "2024-04-01",
      "name": "<YOUR_APP_NAME>",
      "location": "<YOUR_REGION_NAME>",
      "kind": "functionapp",
      "properties": {
        "serverFarmId": "[resourceId('Microsoft.Web/serverfarms', '<YOUR_PLAN_NAME>')]",
        "siteConfig": {
          "minimumElasticInstanceCount": 2
        }
      },
      "dependsOn": [
        "[resourceId('Microsoft.Web/serverfarms', '<YOUR_PLAN_NAME>')]"
      ]
    }
  ]
}
```

> [!NOTE]
> Remember to update the `minimumElasticInstanceCount` property to at least 2 on all function apps in the plan to ensure zone redundancy requirements are met.

---

### Verify instance zone placement

After enabling zone redundancy, you can verify that your function app instances are distributed across availability zones.

In the Azure portal, navigate to your function app in the Azure portal. Under **Settings**, select **Instances**. The **Instances** page shows each running instance and the availability zone it's placed in.

Using the Azure CLI, use the following commands to query instance zone placement:

```azurecli-interactive
RESOURCE_ID=$(az functionapp show \
  --resource-group <RESOURCE_GROUP> \
  --name <APP_NAME> \
  --query id -o tsv)

az rest \
  --method get \
  --url "${RESOURCE_ID}/instances?api-version=2024-04-01" \
  --query "value[].{machineName:properties.machineName, physicalZone:properties.physicalZone}" \
  -o table
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with the names of your resource group and function app, respectively.

Example output:

```output
MachineName     PhysicalZone
--------------  --------------
pl1sdlwk0002Q7  westus3-az3
pl0sdlwk0002HP  westus3-az1
```

In the output:
- `machineName` is the internal name of the worker instance
- `physicalZone` shows the actual availability zone the instance is placed in (format: `{region}-az{N}`)
- For a zone-redundant plan with 2+ instances, you should see instances distributed across different zones

### Troubleshooting

If zone redundancy is not working as expected after following these steps, review the [Common Issues and Solutions](https://techcommunity.microsoft.com/blog/appsonazureblog/deep-dive-on-availability-zones-in-azure-app-service/4433526) section in the deep dive blog post on Availability Zones in Azure App Service. While the blog post focuses on App Service plans, many troubleshooting steps apply to Elastic Premium plans as well.

---

::: zone-end

## Next steps

- [Reliability in Azure Functions](/azure/reliability/reliability-functions) - Conceptual guidance on availability zone support and other reliability approaches and patterns
- [Automate resource deployment in Azure Functions](/azure/azure-functions/functions-infrastructure-as-code) - Learn more about Infrastructure as Code options
- [Azure Functions hosting plans](/azure/azure-functions/functions-scale) - Compare different hosting options
- [Storage considerations for Azure Functions](/azure/azure-functions/storage-considerations) - Understand storage requirements for zone-redundant setups
