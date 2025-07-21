---
title: Configure App Service plans for zone redundancy
description: Learn how to configure your App Service plan for zone redundancy. Understand how your App Service plan instances are distributed across availability zones and how to check for zone redundancy support.
ms.topic: conceptual
ms.service: azure-app-service
ms.date: 07/15/2025
author: anaharris
ms.author: anaharris

---
# Configure App Service plans for zone redundancy

Azure App Service provides built-in reliability features to help ensure your applications are available and resilient. This article describes how to create your App Service plan with zone redundancy. It also covers how to disable and enable zone redundancy on existing plans, and how to check for zone redundancy support. To learn more about how App Service supports zone redundancy, see [Reliability in Azure App Service](../reliability/reliability-app-service.md).

## Create a new App Service plan with zone redundancy

To create a new App Service plan with zone redundancy:

# [Azure portal](#tab/portal)

Follow the guidance in [Create an App Service plan](../app-service/app-service-plan-manage.md#create-an-app-service-plan). Make sure to select *Enabled* for **Zone redundancy**.

:::image type="content" source="./media/configure-zone-redundancy/app-service-create-zr-plan.png" alt-text="Screenshot of zone redundancy enablement during App Service plan creation in the Azure portal.":::

# [Azure CLI](#tab/azurecli)

Set the `--zone-redundant` argument. You must also specify the `--number-of-workers` argument, which is the number of instances, and set a value greater than or equal to 2.

```azurecli
az appservice plan create \
    -n <app-service-plan-name> \
    -g <resource-group-name> \
    --zone-redundant \
    --number-of-workers 2 \
    --sku P1V3
```

# [Bicep](#tab/bicep)

Set the `zoneRedundant` property to `true`. You must also define the `sku.capacity` property to a value of 2 or greater. If you don't define the `sku.capacity` property, the value defaults to 1.

```bicep
resource appServicePlan 'Microsoft.Web/serverfarms@2024-11-01' = {
    name: appServicePlanName
    location: location
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

## Set zone redundancy for an existing App Service plan

1. If you want to enable zone redundancy on an existing App Service plan, [check for zone redundancy support for your App Service plan](#check-for-zone-redundancy-support-on-an-app-service-plan).
1. If your App Service plan supports zone redundancy, you can enable or disable it by using the Azure portal, Azure CLI, or Bicep/Resource Manager.
    
    # [Azure portal](#tab/portal)
    
    1. In the [Azure portal](https://portal.azure.com), navigate to  your App Service plan.
    1. Select **Settings > Scale out (App Service plan)** in the left navigation pane.
    1. Select **Zone redundancy** if you wish to enable zone redundancy. Deselect if you wish to disable it. 
    
        Changing the zone redundancy status of an App Service plan is almost instantaneous. You don't experience downtime or performance problems during the process. 
    
        :::image type="content" source="./media/configure-zone-redundancy/app-service-plan-zone-redundancy-portal.png" alt-text="Screenshot of zone redundancy property for an App Service plan in the Azure portal.":::

    > [!IMPORTANT]
    > If you have *Rules Based* scaling enabled, you can't use the Azure portal to enable zone redundancy. You must use the Azure CLI or Bicep/Resource Manager instead.
    
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

## Check for zone redundancy support on an App Service plan

To see whether an existing App Service plan supports zone redundancy:

1. Get the maximum number of availability zones that the App Service plan can use by using the Azure portal, Azure CLI, or Bicep/Resource Manager:

    # [Azure portal](#tab/portal)
    
    1. In the [Azure portal](https://portal.azure.com), navigate to your App Service plan.
    
    1. Select **Scale out (App Service plan)**. 
    
        The maximum number of zones that your App Service plan can use is shown in **Maximum available zones**. 
    
        :::image type="content" source="./media/configure-zone-redundancy/app-service-plan-max-zones-portal.png" alt-text="Screenshot of maximum available zones property in the Scale out blade in the Azure portal for an App Service plan.":::
    
    # [Azure CLI](#tab/azurecli)
    
    Query the plan's `maximumNumberOfZones` property:
    
    ```azurecli
    az appservice plan show \
        -n <app-service-plan-name> \
        -g <resource-group-name> \
        --query properties.maximumNumberOfZones
    ```
    
    # [Bicep](#tab/bicep)
    
    Query the plan's `maximumNumberOfZones` property:
    
    ```bicep
    resource appServicePlan 'Microsoft.Web/serverfarms@2024-11-01' existing = {
        name: '<app-service-plan-name>'
    }
    
    #disable-next-line BCP083
    output maximumNumberOfZones int = appServicePlan.properties.maximumNumberOfZones
    ```
    
    ---
    
1. Compare the number with the following table to determine whether your plan supports zone redundancy:
    
    | Maximum Number of Zones  | Zone redundancy support |
    | ------------------------ | ----------------------- |
    | Greater than 1           | Supported               |
    | Equal to 1               | Not supported*          |

    \* If you're on a plan or a stamp that doesn't support availability zones, you must create a new App Service plan in a new resource group so that you land on the App Service footprint that supports zones.

## View physical zones for an App Service plan

When you have a zone-redundant App Service plan, the platform automatically places the instances across [physical availability zone](../reliability/availability-zones-overview.md#physical-and-logical-availability-zones). If you want to verify that your instances are spread across zones, you can check which physical availability zones your plan's instances use by using the Azure portal or Azure CLI:

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to your App Service app. If you have multiple apps in a plan, you can select any app.
 
1. Select the **Health check** blade.

1. Select the **Instances** tab to view the physical zone placement for each of your instances.
    
    :::image type="content" source="./media/configure-zone-redundancy/app-service-physical-zones.png" alt-text="Screenshot of the Instances tab in the Health Check blade with the physical zone information in the Azure portal for an App Service app.":::

# [Azure CLI](#tab/azurecli)

Use the [REST API](/rest/api/appservice/web-apps/get-instance-info), which returns the `physicalZone` value for each instance in the App Service plan:

```azurecli
az rest --method get --url https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/sites/{appName}/instances?api-version=2024-04-01
```

# [Bicep](#tab/bicep)

This operation is not supported in Bicep. Use the Azure CLI or Azure portal instead.

---

## Related content
- [Reliability in Azure App Service](../reliability/reliability-app-service.md)
- [Configure App Service Environment for zone redundancy](../app-service/environment/configure-zone-redundancy-environment.md)
