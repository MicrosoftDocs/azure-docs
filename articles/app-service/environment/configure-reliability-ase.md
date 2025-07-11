---
title: Configure App Service Environment Isolated v2 App Service plans for zone redundancy
description: Learn how to configure your App Service Environment Isolated v2 App Service plans for zone redundancy by using availability zones and zone redundancy
ms.topic: conceptual
ms.service: azure-app-service
ms.date: 07/11/2025
author: anaharris
ms.author: anaharris

---
# Configure App Service Environment Isolated v2 App Service plans for zone redundancy

App Service Environment is a single-tenant deployment of Azure App Service. You use it with an Azure virtual network, and you're the only user of this system. Apps deployed are subject to the networking features that are applied to the subnet. There aren't any additional features that need to be enabled on your apps to be subject to those networking features.

This article describes how to configure your App Service Environment Isolated v2 App Service plan with zone redundancy. To learn more about how App Service supports zone redundancy in [Reliability in Azure App Service](../../reliability/reliability-app-service.md).

## Prerequisites

Before you begin, ensure that you meet the following prerequisites:
- You have an Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).
- You have an App Service Environment that supports zone redundancy. If you don't have one, see [Create a new App Service Environment plan with zone redundancy](./creation.md).

## Create a new Isolated v2 App Service plan with zone redundancy

All App Service plans created in an App Service Environment must be in an isolated v2 pricing tier.

To create a new App Service plan with zone redundancy, you can use the Azure portal, Azure CLI, or Bicep:

# [Azure portal](#tab/portal)

Follow the guidance in [Create an App Service plan](../app-service-plan-manage.md#create-an-app-service-plan). Make sure to:

- For **Region**, select your App Service Environment.
- For **Pricing plan**, select *Isolated v2*.
- Select **Zone redundancy** to enable zone redundancy.

<!-- Jordan: We need a good screenshot showing Environment and correct pricing tier. -->

:::image type="content" source="../media/configure-reliability/app-service-create-zr-plan.png" alt-text="Screenshot of zone redundancy enablement during App Service plan creation in the Azure portal.":::

# [Azure CLI](#tab/azurecli)

To modify the `zoneRedundant` property, you must specify the `number-of-workers` property, which is the number of instances, and use a capacity greater than or equal to 2.

```azurecli
az appservice plan create -g MyResourceGroup -n MyPlan --app-service-environment MyAse --zone-redundant --number-of-workers 2 --sku I1V2
```


 # [Bicep](#tab/bicep)

```bicep
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
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


## Set zone-redundancy for an existing Isolated v2 App Service plan

For Isolated v2 App Service plans, if the App Service Environment is zone redundant, the App Service plans can also be set as zone redundant. However, each App Service plan has its own independent zone redundancy setting, which means that you can have a mix of zone redundant and non-zone redundant plans in an App Service Environment.

>[!IMPORTANT]
>If you have *Rules Based* scaling enabled, you can't use the Azure portal to enable zone redundancy for your App Service plan. You must use the Azure CLI or Bicep/Resource Manager instead.

To enable or disable an existing App Service plan to zone-redundancy:

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to  your App Service plan.
1. Select **Settings > Scale out (App Service plan)** in the left navigation pane.
1. Select **Zone redundancy** if you wish to enable zone redundancy. Deselect if you wish to disable it.
 
:::image type="content" source="./media/configure-reliability/app-service-plan-zone-redundancy-portal-isolated.png" alt-text="Screenshot of zone redundancy property for an App Service plan in the Azure portal.":::


# [Azure CLI](#tab/azurecli)

To disable zone redundancy, set the `zoneRedundant` property to `false`.
To enable zone redundancy, set the `zoneRedundant` property to `true` and ensure that you define the `sku.capacity` property. If you don't define the `sku.capacity` property, the value defaults to 1.

```azurecli
az resource update --ids /subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/hostingEnvironments/{aseName} --set properties.zoneRedundant=true
```

# [Bicep](#tab/bicep)

```bicep
resource asev3 'Microsoft.Web/hostingEnvironments@2020-12-01' = {
    name: aseName
    location: location
    kind: 'ASEV3'
    dependsOn: [
        virtualnetwork
    ] 
    properties: {
        ...
        zoneRedundant: true
    }
}
```

---

> [!NOTE]
> When you change the zone redundancy status of the App Service Environment, you initiate an upgrade that takes 12-24 hours to complete. During the upgrade process, you don't experience any downtime or performance problems.

## Related content
- [Create an App Service Environment](creation.md)
- [Configure App Service plans for reliability](../configure-reliability.md)
- [Reliability in Azure App Service](../../reliability/reliability-app-service.md)