---
title: Configure App Service Isolated v2 App Service plan for zone redundancy
description: Learn how to configure your Isolated v2 App Service plan for zone redundancy by using availability zones and zone redundancy
ms.topic: conceptual
ms.service: azure-app-service
ms.date: 07/16/2025
author: anaharris
ms.author: anaharris

---

# Configure Isolated v2 App Service plans with zone redundancy

All App Service plans created in an App Service Environment must be in an Isolated v2 pricing tier.

If you've enabled your App Service Environment to be zone redundant, the Isolated v2 App Service plans can also be set as zone redundant. However, because each plan has its own independent zone redundancy setting, you can manually enable or disable zone-redundancy on specific plans in an App Service Environment, regardless of the App Service Environment's zone redundancy setting.


## Create a new Isolated v2 App Service plan with zone redundancy

To create a new Isolated v2 App Service plan with zone redundancy, you can use the Azure portal, Azure CLI, or Bicep:

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

To enable or disable zone redundancy on an existing  Isolated v2 App Service plan, you can use the Azure portal, Azure CLI, or Bicep:

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to your App Service plan.
1. Select **Settings > Scale out (App Service plan)** in the left navigation pane.
1. Select **Zone redundancy** if you wish to enable zone redundancy. Deselect if you wish to disable it.
 
:::image type="content" source="./media/configure-zone-redundancy/app-service-plan-zone-redundancy-portal-isolated.png" alt-text="Screenshot of zone redundancy property for an App Service plan in the Azure portal.":::

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
- [Reliability in Azure App Service Environments](../../reliability/reliability-app-service-environment.md)
- [Configure App Service Environment for zone redundancy](configure-zone-redundancy-ase.md)