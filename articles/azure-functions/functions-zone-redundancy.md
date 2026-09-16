---
title: Configure Zone Redundancy for Azure Functions
description: Learn how to configure zone redundancy for Azure Functions, create zone-redundant Function Apps, and migrate existing function apps to use multiple availability zones.
author: ggailey777
ms.author: glenga
ms.topic: how-to
ms.date: 08/03/2026
zone_pivot_groups: functions-hosting-plan

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

::: zone pivot="consumption-plan"

[!INCLUDE [hosting-plan-not-supported](../../includes/functions-hosting-plan-not-supported.md)]

Zone redundancy isn't supported in the Consumption plan. Consider migrating to the [Flex Consumption plan](flex-consumption-plan.md) or [Premium plan](functions-premium-plan.md) for availability zone support.

::: zone-end

::: zone pivot="dedicated-plan"

[!INCLUDE [hosting-plan-not-supported](../../includes/functions-hosting-plan-not-supported.md)]

For Dedicated (App Service) plan zone redundancy configuration, see [Configure availability zones for App Service](../app-service/how-to-zone-redundancy.md).

::: zone-end

::: zone pivot="container-apps"

[!INCLUDE [hosting-plan-not-supported](../../includes/functions-hosting-plan-not-supported.md)]

When running functions on Azure Container Apps, availability zone redundancy is configured at the Container Apps environment level. See [Reliability in Azure Container Apps](/azure/reliability/reliability-azure-container-apps).

::: zone-end

::: zone pivot="flex-consumption-plan"

> [!IMPORTANT]  
> Before configuring zone redundancy, review the requirements and details listed in [Reliability in Azure Functions - Resilience to availability zone failures](/azure/reliability/reliability-functions?pivots=flex-consumption#resilience-to-availability-zone-failures).

::: zone-end

::: zone pivot="premium-plan"

> [!IMPORTANT]  
> Before configuring zone redundancy, review the requirements and details listed in [Reliability in Azure Functions - Resilience to availability zone failures](/azure/reliability/reliability-functions?pivots=premium#resilience-to-availability-zone-failures).
> 
> You can enable or disable availability zones on existing Elastic Premium plans using the Azure CLI. For more information, including important details about Elastic Premium-specific capacity behaviors, see [Enable zone redundancy on an existing plan](#enable-zone-redundancy-on-an-existing-plan).

::: zone-end

::: zone pivot="flex-consumption-plan"

## View regions that support availability zones

You can deploy zone-redundant apps to a Flex Consumption plan only in specific regions. To see the current list of supported regions, use Azure CLI:

1. If you didn't already, install Azure CLI and sign in to Azure.

    ```azurecli
    az login
    ```

1. Use the [`az functionapp list-flexconsumption-locations`](/cli/azure/functionapp#az-functionapp-list-flexconsumption-locations) command with the `--zone-redundant=true` argument. This command returns a list of regions that currently support zone-redundant Flex Consumption plans:

    ```azurecli-interactive
    az functionapp list-flexconsumption-locations --zone-redundant=true --query "sort_by(@, &name)[].{Region:name}" -o table
    ```

::: zone-end

::: zone pivot="flex-consumption-plan,premium-plan"

## Create a zone-redundant function app

::: zone-end

::: zone pivot="flex-consumption-plan"

Follow these steps to create a zone-redundant Flex Consumption plan when you create your app.

#### [Azure portal](#tab/azure-portal)

1. To create a function app in a zone-redundant plan, you must have an existing [zone-redundant storage account](/azure/azure-functions/storage-considerations#storage-account-requirements). If you don't already have a zone-redundant storage account, create one before you proceed.

1. In the Azure portal, go to **Create Function App**. For more information about creating a function app in the portal, see [Create a function app](/azure/azure-functions/functions-create-function-app-portal#create-a-function-app).

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
    |**Storage account**|A [zone-redundant storage account](/azure/azure-functions/storage-considerations#storage-account-requirements)|As described in the [reliability guide for Azure Functions](/azure/reliability/reliability-functions?pivots=flex-consumption#resilience-to-availability-zone-failures), use a zone-redundant storage account for your zone-redundant function app.|
  
1. For the rest of the function app creation process, create your function app as normal. There are no settings in the rest of the creation process that affect zone redundancy.

#### [Azure CLI](#tab/azure-cli)

1. When creating the storage account for the function app, choose a zone redundant SKU, such as `Standard_ZRS`. For example:

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

The only property to be aware of while creating a zone-redundant hosting plan is the `zoneRedundant` property. Set the `zoneRedundant` property to `true`.

The following Bicep template snippet is for a zone-redundant, Flex Consumption plan. It shows the `zoneRedundant` field specification.

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

The only property to be aware of while creating a zone-redundant hosting plan is the `zoneRedundant` property. Set the `zoneRedundant` property to `true`.

The following ARM template snippet is for a zone-redundant, Flex Consumption plan. It shows the `zoneRedundant` field specification.

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

After you create and deploy the zone-redundant plan, the Flex Consumption function app hosted on your new plan is considered zone-redundant.

::: zone-end

::: zone pivot="premium-plan"

Follow these steps to create a zone-redundant Premium plan and app.

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, go to **Create Function App**. For more information about creating a function app in the portal, see [Create a function app](/azure/azure-functions/functions-create-function-app-portal#create-a-function-app).

1. Select **Functions Premium** and then select **Select**.

1. On **Create Function App (Functions Premium)**, on the **Basics** tab, enter the settings for your function app. Pay special attention to the settings in the following table (also highlighted in the following screenshot), which have specific requirements for zone redundancy.

    |Setting|Suggested value|Notes for zone redundancy|
    |-------|---------------|-------------------------|
    |**Region**|Your preferred supported region|The region in which you create your Elastic Premium plan. Pick a region that supports availability zones. For a list of regions that support zone redundancy for Azure Functions Premium plans, see [Reliability in Azure Functions - Resilience to availability zone failures - Requirements](/azure/reliability/reliability-functions#requirements).|
    |**Pricing plan**|One of the Elastic Premium plans. For more information, see [Available instance SKUs](/azure/azure-functions/functions-premium-plan#available-instance-skus).|This article describes how to create a zone redundant app in a Premium plan. Zone redundancy isn't currently available in Consumption plans. For information on zone redundancy on App Service plans, see [Configure availability zones for App Service](../app-service/how-to-zone-redundancy.md).|
    |**Zone redundancy**|Enabled|This setting specifies whether your app is zone redundant. You can't select `Enabled` unless you choose a region that supports zone redundancy, as described previously.|

    :::image type="content" source="./media/functions-az-redundancy/azure-functions-ep-basics-az.png" alt-text="Screenshot of the Basics tab of the function app create page.":::

1. On the **Storage** tab, enter the settings for your function app storage account. Pay special attention to the setting in the following table, which has specific requirements for zone redundancy.

    |Setting|Suggested value|Notes for zone redundancy|
    |-------|---------------|-------------------------|
    |**Storage account**|A [zone-redundant storage account](/azure/azure-functions/storage-considerations#storage-account-requirements)|As described in the [reliability guide for Azure Functions](/azure/reliability/reliability-functions?pivots=premium#resilience-to-availability-zone-failures), use a zone-redundant storage account for your zone-redundant function app.|
  
1. For the rest of the function app creation process, create your function app as normal. There are no settings in the rest of the creation process that affect zone redundancy.

#### [Azure CLI](#tab/azure-cli)

1. When creating the storage account for the function app, choose a zone redundant SKU, such as `Standard_ZRS`. For example:

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

The only properties to be aware of while creating a zone-redundant hosting plan are the `zoneRedundant` property and the plan's instance count (`capacity`) fields. Set the `zoneRedundant` property to `true` and set the `capacity` property based on the workload requirement, but not less than `3`. Choosing the right capacity varies based on several factors and high availability and fault tolerance strategies. A good rule of thumb is to specify sufficient instances for the application to ensure that losing one zone instance leaves sufficient capacity to handle expected load.

> [!IMPORTANT]
> Azure Functions apps hosted on an Elastic Premium, zone-redundant plan must have a minimum [always ready instance](/azure/azure-functions/functions-premium-plan#always-ready-instances) count of 2. This minimum ensures that a zone-redundant function app always has enough instances to satisfy at least one worker per zone.

The following snippet is a Bicep template for a zone-redundant, Premium plan. It shows the `zoneRedundant` field and the `capacity` specification.

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

The only properties to be aware of while creating a zone-redundant hosting plan are the `zoneRedundant` property and the plan's instance count (`capacity`) fields. Set the `zoneRedundant` property to `true` and set the `capacity` property based on the workload requirement, but not less than `3`. Choosing the right capacity varies based on several factors and high availability and fault tolerance strategies. A good rule of thumb is to specify sufficient instances for the application to ensure that losing one zone instance leaves sufficient capacity to handle expected load.

> [!IMPORTANT]
> Azure Functions apps hosted on an Elastic Premium, zone-redundant plan must have a minimum [always ready instance](/azure/azure-functions/functions-premium-plan#always-ready-instances) count of 2. This minimum ensures that a zone-redundant function app always has enough instances to satisfy at least one worker per zone.

The following snippet is an ARM template for a zone-redundant, Premium plan. It shows the `zoneRedundant` field and the `capacity` specification.

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

After you create and deploy the zone-redundant plan, any function app you host on your new plan is considered zone-redundant.

::: zone-end

::: zone pivot="flex-consumption-plan,premium-plan"

## Enable zone redundancy on an existing plan

::: zone-end

::: zone pivot="flex-consumption-plan"

Changing the zone redundancy of your app requires a restart, which causes downtime in your app. Before updating your Flex Consumption plan to be zone-redundant, update the default host storage account to also be zone redundant. 

>[!TIP]  
>If you use a separate storage account for the app's deployment container, update it to be zone redundant as well.

Use these steps to prepare your storage accounts for the change:

1. Review [Storage Considerations](/azure/azure-functions/storage-considerations).
1. Create or identify a zone-redundant storage account to be the default host storage account for the app.
1. Update the storage-related application settings of the app, like `AzureWebJobsStorage`, to reference the zone-redundant storage account. See [Work with application settings](/azure/azure-functions/functions-how-to-use-azure-function-app-settings#use-application-settings).
1. Update the deployment storage account for the app, which can be the same or different as the storage account associated with the app. See [Configure deployment settings](/azure/azure-functions/flex-consumption-how-to#configure-deployment-settings).

After you update the storage accounts used by your app, update the Flex Consumption plan to be zone-redundant.

#### [Azure portal](#tab/azure-portal)

1. In the Azure portal, search for and select the function app to update.

1. Under **Settings**, select **Scale and Concurrency**.

1. On the **Zone redundancy** tab, check **Add zone redundancy** to enable the feature. If already checked, you can uncheck this box to disable the feature.

1. Select **Save** to commit your changes and restart the app.

:::image type="content" source="./media/functions-az-redundancy/azure-functions-flex-update-az.png" alt-text="Screenshot of the Scale and Concurrency tab of a Flex Consumption function app.":::

#### [Azure CLI](#tab/azure-cli)

Update the app by using the `--zone-redundant` parameter of the [az functionapp plan update](/cli/azure/functionapp/plan#az-functionapp-plan-update) command. Use a value of `true` to enable zone redundancy and `false` to disable the feature. This example enables zone redundancy for an existing app in a Flex Consumption plan:

```azurecli
PLAN_RESOURCE_ID=$(az functionapp show --resource-group <RESOURCE_GROUP> --name <APP_NAME> --query "properties.serverFarmId"  -o tsv) 

az functionapp plan update --ids $PLAN_RESOURCE_ID --set zoneRedundant=true
```

In this example, replace `<RESOURCE_GROUP>` and `<APP_NAME>` with the names of your resource group and app, respectively.

#### [Bicep](#tab/bicep)

You can use this Bicep file to add the `zoneRedundant` property set to `true` in an existing plan definition:

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

Keep these important considerations in mind before you enable zone redundancy in your Premium plan hosted app:

+ The `zoneRedundant` property of an Elastic Premium plan is mutable, so you can toggle availability zone support without creating a new plan. 

+ Unlike in a Dedicated (App Service) plan, an Elastic Premium capacity behavior (`sku.capacity`) for each app is derived from app-level settings not just the plan setting.

+ To enable zone redundancy, you must update settings at both the plan level and the app level:

   | Level | Property | Required value | Notes |
   | --- | --- | --- | --- |
   | Plan | `zoneRedundant` | `true` | Enables availability zone distribution |
   | Plan | `sku.capacity` | `2` or higher | Sets the intended minimum instance count |
   | App (each) | `minimumElasticInstanceCount` | `2` or higher | The control plane sets plan `sku.capacity` to the **highest** value across all apps. Setting `sku.capacity` alone doesn't enforce a minimum, so you must also set this app-level property. |

+ You can't currently configure availability zone redundancy on existing Elastic Premium plans from the portal.

To enable availability zone redundancy in your Premium plan app:

#### [Azure portal](#tab/azure-portal)

Not currently supported, choose another tab.

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
    > The `sku.capacity=2` parameter in this command sets the intended minimum, but the system doesn't enforce it until you complete step 2.

1. Update always-ready instances to at least 2 for each function app that needs to be zone redundant in the plan:

    ```azurecli
    az functionapp update \
      --resource-group <RESOURCE_GROUP> \
      --name <APP_NAME> \
      --set siteConfig.minimumElasticInstanceCount=2
    ```

    The plan's actual `sku.capacity` updates to reflect the highest `minimumElasticInstanceCount` across all apps.

To disable zone redundancy on an existing plan:

```azurecli
az appservice plan update \
  --resource-group <RESOURCE_GROUP> \
  --name <PLAN_NAME> \
  --set zoneRedundant=false
```

After disabling zone redundancy, you can optionally reduce `minimumElasticInstanceCount` back to 1 on your function apps if desired.

#### [Bicep template](#tab/bicep)

You can update an existing Elastic Premium plan to be zone-redundant by using Bicep templates. The following example shows how to enable zone redundancy:

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

You can update an existing Elastic Premium plan to be zone-redundant by using ARM templates. The following example shows how to enable zone redundancy:

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

::: zone-end

::: zone pivot="flex-consumption-plan,premium-plan"

### Verify instance zone placement

After you enable zone redundancy, you can confirm that your function app instances are distributed across availability zones by using either the Azure portal or Azure CLI.

#### [Azure portal](#tab/azure-portal-verify)

In the Azure portal, go to your function app. Under **Settings**, select **Instances**. The **Instances** page shows each running instance and the availability zone it's placed in.

#### [Azure CLI](#tab/azure-cli-verify)

Use the following commands to query instance zone placement:

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
- `machineName` is the internal name of the worker instance.
- `physicalZone` shows the actual availability zone the instance is placed in (format: `{region}-az{N}`).
- For a zone-redundant plan with two or more instances, you see instances distributed across different zones.

---

### Troubleshooting

If zone redundancy isn't working as expected after following these steps, check the following items:

- Verify the region supports availability zones for your plan type. See [Reliability in Azure Functions - Requirements](/azure/reliability/reliability-functions#requirements).

- Ensure your storage account uses a zone-redundant SKU (ZRS or GZRS).

::: zone-end

::: zone pivot="premium-plan"

- Confirm that `minimumElasticInstanceCount` is set to at least 2 on each app.

- For issues related to scale units and SKU requirements, review the [Common Issues and Solutions](https://techcommunity.microsoft.com/blog/appsonazureblog/deep-dive-on-availability-zones-in-azure-app-service/4433526) section in the deep dive blog post on Availability Zones in Azure App Service.

::: zone-end

## Next steps

- [Reliability in Azure Functions](/azure/reliability/reliability-functions) - Conceptual guidance on availability zone support and other reliability approaches and patterns.
- [Automate resource deployment in Azure Functions](/azure/azure-functions/functions-infrastructure-as-code) - Learn more about Infrastructure as Code options.
- [Azure Functions hosting plans](/azure/azure-functions/functions-scale) - Compare different hosting options.
- [Storage considerations for Azure Functions](/azure/azure-functions/storage-considerations) - Understand storage requirements for zone-redundant setups.
