---
title: Configure App Service Environment for zone redundancy
description: Learn how to configure your App Service Environment for zone redundancy by using availability zones and zone redundancy
ms.topic: conceptual
ms.service: azure-app-service
ms.date: 07/16/2025
author: anaharris
ms.author: anaharris

---
# Configure App Service Environment for zone redundancy

[App Service Environment](./overview.md) is a single-tenant deployment of Azure App Service that integrates with an Azure virtual network. Each App Service Environment deployment requires a dedicated subnet, which you can't use for other resources.

This article shows you how to create and modify your App Service Environment zone redundancy settings, as well as how to check for zone redundancy support. To learn more details about how App Service Environment supports zone redundancy, see [Reliability in Azure App Service Environment](../../reliability/reliability-app-service.md).


## Create an App Service Environment with zone redundancy

To create a new App Service Environment with zone redundancy, follow the steps in [Create an App Service Environment](../app-service/environment/creation.md). Make sure to select *Enabled* for **Zone redundancy**.

To create plans in your App Service Environment, you must use the Isolated v2 pricing tier. To learn how to create an Isolated v2 App Service plan with zone redundancy, see [Configure Isolated v2 App Service plans with zone redundancy](../app-service/environment/configure-zone-redundancy-isolated.md).

## Set zone redundancy for an existing App Service Environment

To enable or disable zone redundancy on an existing App Service Environment, you can use Azure portal, Azure CLI, or Bicep:

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
> When you change the zone redundancy status of the App Service Environment, you initiate an upgrade that takes 12-24 hours to complete. During the upgrade process, you don't experience any downtime or performance problems.

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


## Related content
- [Configure zone redundancy for Isolated v2 App Service plans](../app-service/environment/configure-zone-redundancy-isolated.md)
- [Configure App Service plans for reliability](../configure-zone-redundancy.md)
- [Reliability in Azure App Service Environments](../../reliability/reliability-app-service-environments.md)
