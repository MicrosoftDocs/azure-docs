---
title: Configure App Service Environment for zone redundancy
description: Learn how to configure your App Service Environment for zone redundancy by using availability zones and zone redundancy
ms.topic: conceptual
ms.service: azure-app-service
ms.date: 07/11/2025
author: anaharris
ms.author: anaharris

---
# Configure App Service Environment for zone redundancy

App Service Environment is a single-tenant deployment of Azure App Service. You use it with an Azure virtual network, and you're the only user of this system. Apps deployed are subject to the networking features that are applied to the subnet. There aren't any additional features that need to be enabled on your apps to be subject to those networking features.

This article describes how to configure your App Service Environment and its plans to be zone redundant. To learn more about how App Service supports zone redundancy, see [Reliability in Azure App Service](../../reliability/reliability-app-service.md).

## Prerequisites

Before you begin, make sure that you have an Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).

## Create a zone-redundant App Service Environment

To create a zone-redundant App Service Environment, follow the guidance in [Create a new App Service Environment plan with zone redundancy](./creation.md). Make sure to set **Zone redundancy** to *Enabled*.

## Set zone redundancy for an existing App Service Environment

To enable or disable zone redundancy on an existing App Service Environment, you can use the Azure CLI or Bicep:

# [Azure portal](#tab/portal)

This operation is not yet supported in the Azure portal. Use the Azure CLI or Bicep instead.

# [Azure CLI](#tab/azurecli)

- To *enable zone redundancy*, set the `zoneRedundant` property to `true`. You must also define the `sku.capacity` property to a value of 2 or greater. If you don't define the `sku.capacity` property, the value defaults to 1.

    ```azurecli
    az resource update \
        --ids /subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/hostingEnvironments/{aseName} \
        --set properties.zoneRedundant=true sku.capacity=2
    ```

- To *disable zone redundancy*, set the `zoneRedundant` property to `false`.

    ```azurecli
    az resource update \
        --ids /subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/hostingEnvironments/{aseName} \
        --set properties.zoneRedundant=false
    ```

# [Bicep](#tab/bicep)

- To *enable zone redundancy*, set the `zoneRedundant` property to `true`.

    ```bicep
    resource appServiceEnvironment 'Microsoft.Web/hostingEnvironment@2024-11-01' = {
        name: appServiceEnvironmentName
        location: location
        properties: {
            zoneRedundant: true
        }
    }
    ```

- To *disable zone redundancy*, set the `zoneRedundant` property to `false`.

---

> [!NOTE]
> When you change the zone redundancy status of the App Service Environment plans, you initiate an upgrade that takes 12-24 hours to complete. During the upgrade process, you don't experience any downtime or performance problems.

## Check for zone redundancy support for an App Service Environment

To see whether an existing App Service Environment supports zone redundancy:

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your App Service Environment.

1. The zone redundancy state for your App Service Environment is shown in **Zone redundant**. 

    :::image type="content" source="./media/configure-reliability/app-service-environment-zone-redundancy-portal.png" alt-text="Screenshot of Zone redundant property in the Overview blade in the Azure portal for an App Service Environment.":::

# [Azure CLI](#tab/azurecli)

Query the environment's `zoneRedundant` property:

```azurecli
az appservice ase show \
    -n <app-service-environment-name> \
    -g <resource-group-name> \
    --query zoneRedundant
```

# [Bicep](#tab/bicep)

Query the environment's `zoneRedundant` property:

```bicep
resource appServiceEnvironment 'Microsoft.Web/hostingEnvironments@2024-11-01' existing = {
    name: '<app-service-environment-name>'
}

output zoneRedundant bool = appServiceEnvironment.properties.zoneRedundant
```

---

## Create a new Isolated v2 App Service plan with zone redundancy

All App Service plans created in an App Service Environment must be in an Isolated v2 pricing tier.

For Isolated v2 App Service plans, if the App Service Environment is zone redundant, the App Service plans can also be set as zone redundant. However, each App Service plan has its own independent zone redundancy setting, which means that you can have a mix of zone redundant and non-zone redundant plans in an App Service Environment.

To create a new App Service plan with zone redundancy, you can use the Azure portal, Azure CLI, or Bicep:

# [Azure portal](#tab/portal)

Follow the guidance in [Create an App Service plan](../app-service-plan-manage.md#create-an-app-service-plan). Make sure to:

- For **Region**, select your App Service Environment.
- For **Pricing plan**, select *Isolated v2*.
- For **Zone redundancy**, select **Enabled**.

# [Azure CLI](#tab/azurecli)

Set the `--zone-redundant` argument. You must also specify the `--number-of-workers` argument, which is the number of instances, and set a value greater than or equal to 2.

```azurecli
az appservice plan create \
    -n <app-service-plan-name> \
    -g <resource-group-name> \
    --app-service-environment MyAse \
    --zone-redundant \
    --number-of-workers 2 \
    --sku I1V2
```

# [Bicep](#tab/bicep)

Set the `zoneRedundant` property to `true`. You must also define the `sku.capacity` property to a value of 2 or greater. If you don't define the `sku.capacity` property, the value defaults to 1.

```bicep
resource appServicePlan 'Microsoft.Web/serverfarms@2024-11-01' = {
    name: appServicePlanName
    location: location
    hostingEnvironmentProfile: {
        id: '...'
    }
    sku: {
        name: sku
        capacity: 2
    }
    kind: 'linux'
    properties: {
        reserved: true
        zoneRedundant: true
    }
}
```

---

## Set zone redundancy for an existing Isolated v2 App Service plan

To enable or disable zone redundancy on an existing App Service plan, you can use the Azure portal, Azure CLI, or Bicep:

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your App Service plan.
1. Select **Settings > Scale out (App Service plan)** in the left navigation pane.
1. Select **Zone redundancy** if you wish to enable zone redundancy. Deselect if you wish to disable it.
 
:::image type="content" source="./media/configure-reliability/app-service-plan-zone-redundancy-portal-isolated.png" alt-text="Screenshot of zone redundancy property for an App Service plan in the Azure portal.":::

>[!IMPORTANT]
>If you have *Rules Based* scaling enabled, you can't use the Azure portal to enable zone redundancy for your App Service plan. You must use the Azure CLI or Bicep/Resource Manager instead.

# [Azure CLI](#tab/azurecli)

- To *enable zone redundancy*, set the `zoneRedundant` property to `true`. You must also specify the `sku.capacity` argument, which is the number of instances, and set a value greater than or equal to 2.

    ```azurecli
    az appservice plan update \
        -n <app-service-plan-name> \
        -g <resource-group-name> \
        --set zoneRedundant=true sku.capacity=2
    ```

- To *disable zone redundancy*, set the `zoneRedundant` property to `false`.

    ```azurecli
    az appservice plan update \
        -n <app-service-plan-name> \
        -g <resource-group-name> \
        --set zoneRedundant=false
    ```

# [Bicep](#tab/bicep)

- To *enable zone redundancy*, set the `zoneRedundant` property to `true`. You must also define the `sku.capacity` property to a value of 2 or greater. If you don't define the `sku.capacity` property, the value defaults to 1.

    ```bicep
    resource appServicePlan 'Microsoft.Web/serverfarms@2024-11-01' = {
        name: appServicePlanName
        location: location
        hostingEnvironmentProfile: {
            id: '...'
        }
        sku: {
            name: sku
            capacity: 2
        }
        kind: 'linux'
        properties: {
            reserved: true
            zoneRedundant: true
        }
    }
    ```

- To *disable zone redundancy*, set the `zoneRedundant` property to `false`.

---

## Related content
- [Create an App Service Environment](creation.md)
- [Configure App Service plans for reliability](../configure-zone-redundancy.md)
- [Reliability in Azure App Service](../../reliability/reliability-app-service.md)
