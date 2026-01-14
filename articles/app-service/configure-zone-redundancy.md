---
title: Configure App Service Plans for Zone Redundancy
description: Learn how to configure an App Service plan for zone redundancy, see how plan instances spread across availability zones, and check for zone redundancy support.
ms.topic: conceptual
ms.service: azure-app-service
ms.date: 07/15/2025
author: anaharris
ms.author: anaharris

---
# Configure App Service plans for zone redundancy

Azure App Service provides built-in reliability features to help ensure that your applications remain available and resilient. This article describes how to create an App Service plan that includes zone redundancy. It also covers how to disable and enable zone redundancy on existing plans and how to check for zone redundancy support. For more information about zone redundancy, see [Reliability in App Service](../reliability/reliability-app-service.md).

## Create a new zone-redundant App Service plan

To create a new App Service plan that includes zone redundancy, follow the appropriate steps.

# [Azure portal](#tab/portal)

Follow the guidance to [create an App Service plan](../app-service/app-service-plan-manage.md#create-an-app-service-plan). Make sure to select **Enabled** for **Zone redundancy**.

:::image type="content" source="./media/configure-zone-redundancy/app-service-create-zr-plan.png" alt-text="Screenshot of zone redundancy enablement during App Service plan creation in the Azure portal.":::

# [Azure CLI](#tab/azurecli)

- Set the `--zone-redundant` argument.
- Set the `--number-of-workers` argument, which is the number of instances, to a value of 2 or more.

```azurecli
az appservice plan create \
    -n <app-service-plan-name> \
    -g <resource-group-name> \
    --zone-redundant \
    --number-of-workers 2 \
    --sku P1V3
```

# [Bicep](#tab/bicep)

- Set the `zoneRedundant` property to `true`.
- Set the `sku.capacity` property to a value of 2 or more. If you don't define the `sku.capacity` property, the value defaults to 1.

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

1. To enable zone redundancy on an existing App Service plan, [check for zone redundancy support](#check-for-zone-redundancy-support-on-an-app-service-plan).
1. **If your App Service plan supports zone redundancy,** use the Azure portal, the Azure CLI, or Bicep and Azure Resource Manager to enable or disable it.
    
    # [Azure portal](#tab/portal)
    
    1. In the [Azure portal](https://portal.azure.com), go to your App Service plan.
    1. Select **Settings** > **Scale out (App Service plan)** in the left navigation pane.
    1. Select **Zone Redundancy** to enable zone redundancy. Deselect it to disable it. 
    
        The zone redundancy status of an App Service plan changes almost instantaneously. No downtime or performance problems occur during the process. 
    
        :::image type="content" source="./media/configure-zone-redundancy/app-service-plan-zone-redundancy-portal.png" alt-text="Screenshot of zone redundancy property for an App Service plan in the Azure portal.":::

    > [!IMPORTANT]
    > If you have *Rules Based* scaling enabled, you can't use the Azure portal to enable zone redundancy. You must use the Azure CLI or Bicep and Resource Manager instead.
    
     # [Azure CLI](#tab/azurecli)
    
    - To *enable zone redundancy*, set the `zoneRedundant` property to `true`.
    - Set the `sku.capacity` argument, which is the number of instances, to a value of 2 or more.
    
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
    
    - To *enable zone redundancy*, set the `zoneRedundant` property to `true`.
    - Set the `sku.capacity` property to a value of 2 or more. If you don't define the `sku.capacity` property, the value defaults to 1.
    
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

1. **If your App Service plan is on a scale unit that doesn't support zone redundancy,** you can't enable zone redundancy on your plan. Instead, you need to [redeploy your apps to a new plan on a different scale unit](../azure-resource-manager/management/move-limitations/app-service-move-limitations.md).
 
## Check for zone redundancy support on an App Service plan

To check whether an existing App Service plan supports zone redundancy, do the following steps:

1. Determine the maximum number of availability zones that the App Service plan supports by using the Azure portal, the Azure CLI, or Bicep and Resource Manager.

    # [Azure portal](#tab/portal)
    
    1. In the [Azure portal](https://portal.azure.com), go to your App Service plan.
    
    1. Select **Scale out (App Service plan)**. 
    
        **Maximum available zones** shows the maximum number of zones that your App Service plan can use.
    
        :::image type="content" source="./media/configure-zone-redundancy/app-service-plan-max-zones-portal.png" alt-text="Screenshot of the maximum available zones property in the scale-out section in the Azure portal for an App Service plan.":::
    
    # [Azure CLI](#tab/azurecli)
    
    Query the plan's `maximumNumberOfZones` property.
    
    ```azurecli
    az appservice plan show \
        -n <app-service-plan-name> \
        -g <resource-group-name> \
        --query properties.maximumNumberOfZones
    ```
    
    # [Bicep](#tab/bicep)
    
    Query the plan's `maximumNumberOfZones` property.
    
    ```bicep
    resource appServicePlan 'Microsoft.Web/serverfarms@2024-11-01' existing = {
        name: '<app-service-plan-name>'
    }
    
    #disable-next-line BCP083
    output maximumNumberOfZones int = appServicePlan.properties.maximumNumberOfZones
    ```
    
    ---
    
1. Compare the number with the following table to determine whether your plan supports zone redundancy.
    
    | Maximum number of zones  | Zone redundancy support |
    | ------------------------ | ----------------------- |
    | More than 1           | Supported               |
    | Equal to 1               | Not supported*          |

    \* If you use a plan or a stamp that doesn't support availability zones, you must create a new App Service plan in a new resource group. This setup ensures that your deployment lands on App Service infrastructure that supports availability zones.

## View physical zones for an App Service plan

When you have a zone-redundant App Service plan, the platform automatically places the instances across [physical availability zones](../reliability/availability-zones-overview.md#physical-and-logical-availability-zones). To verify that your instances are spread across zones, use the Azure portal or the Azure CLI to check which physical availability zones your plan's instances use.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to your App Service app. If you have multiple apps in a plan, you can select any app.
 
1. Select **Health check**.

1. Select **Instances** to view the physical zone placement for each of your instances.
    
    :::image type="content" source="./media/configure-zone-redundancy/app-service-physical-zones.png" alt-text="Screenshot of the Instances tab in the Health Check section with the physical zone information in the Azure portal for an App Service app.":::

# [Azure CLI](#tab/azurecli)

Use the [REST API](/rest/api/appservice/web-apps/get-instance-info), which returns the `physicalZone` value for each instance in the App Service plan.

```azurecli
az rest --method get --url https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/sites/{appName}/instances?api-version=2024-04-01
```

# [Bicep](#tab/bicep)

Bicep doesn't support this operation. Use the Azure CLI or the Azure portal instead.

---

## Related content
- [Reliability in App Service](../reliability/reliability-app-service.md)
- [Configure an App Service Environment for zone redundancy](../app-service/environment/configure-zone-redundancy-environment.md)
