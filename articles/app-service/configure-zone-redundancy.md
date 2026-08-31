---
title: Configure App Service plans for zone redundancy
description: Learn how to configure an App Service plan for zone redundancy, see how plan instances spread across availability zones, and check for zone redundancy support.
ms.topic: how-to
ms.service: azure-app-service
ms.date: 08/24/2026
author: anaharris
ms.author: anaharris

---
# Configure App Service plans for zone redundancy

Azure App Service provides built-in reliability features to help ensure that your applications remain available and resilient. This article describes how to create an App Service plan that includes zone redundancy. It also covers how to disable and enable zone redundancy on existing plans and how to check for zone redundancy support. For more information about zone redundancy, see [Reliability in App Service](/azure/reliability/reliability-app-service).

> [!IMPORTANT]
> Zone redundancy distributes App Service plan instances across availability zones; it doesn't create guaranteed app replicas. If `perSiteScaling` is `true` and an app or deployment slot has a worker limit of `1`, don't infer that the app or slot has a second hot replica. Limits of `2` or more permit placement on multiple distinct plan workers but don't guarantee that those instances span physical zones. Review [per-app scaling](manage-scale-per-app.md) and [Reliability in App Service](/azure/reliability/reliability-app-service) when you design the workload.

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

    > [!IMPORTANT]
    > Before you enable zone redundancy, record the current plan capacity and scaling mode. If per-app scaling is enabled, review the configured worker limit for each app and deployment slot. A limit of `1` doesn't provide a simultaneous replica in another zone. For **Rules Based** scaling, ensure that every applicable autoscale profile has minimum, default, and maximum capacities of at least `2`.
    
    # [Azure portal](#tab/portal)
    
    1. In the [Azure portal](https://portal.azure.com), go to your App Service plan.
    1. Select **Settings** > **Scale out (App Service plan)** in the left navigation pane.
    1. Follow the instructions for the scaling mode configured for the plan:
       - **Manual**: If **Instance count** is less than `2`, increase it to `2`; preserve a higher value. Select **Zone Redundancy**, and then save your changes.
       - **Automatic**: **Minimum instances** is managed and unavailable in the portal. Select **Zone Redundancy**, save your changes, and then confirm that the resulting plan capacity is at least `2`.
       - **Rules Based**: You can't perform this workflow in the portal. First, separately update every applicable autoscale profile so that its minimum, default, and maximum are each at least `2`, preserving higher values. Then use the Azure CLI or Bicep and Azure Resource Manager to enable zone redundancy.

        :::image type="content" source="./media/configure-zone-redundancy/app-service-plan-zone-redundancy-portal.png" alt-text="Screenshot of zone redundancy property for an App Service plan in the Azure portal.":::

    For **Manual** or **Automatic** scaling, to disable zone redundancy, deselect **Zone Redundancy**, and then save your changes.
    
     # [Azure CLI](#tab/azurecli)

    > [!IMPORTANT]
    > For **Rules Based** scaling, first update every applicable autoscale profile so that its minimum, default, and maximum are each at least `2`. Preserve higher values. Changing only the current `sku.capacity` doesn't prevent autoscale from later requesting a lower capacity.
    
    - To *enable zone redundancy* when the current `sku.capacity` is already `2` or greater, set only the `zoneRedundant` property to `true`. This update preserves the current capacity.
    
       ```azurecli
      az appservice plan update \
          -n <app-service-plan-name> \
          -g <resource-group-name> \
          --set zoneRedundant=true
      ```

    - If the current `sku.capacity` is less than `2`, raise it to `2` while enabling zone redundancy.

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

    > [!IMPORTANT]
    > For **Rules Based** scaling, update the autoscale configuration separately before this deployment. Every applicable profile must have minimum, default, and maximum values of at least `2`, with higher values preserved. The `sku.capacity` expression in this template doesn't update autoscale profiles.
    
    - To *enable zone redundancy*, set the `zoneRedundant` property to `true`.
    - Set `currentPlanCapacity` to the plan's current configured capacity. The `max` expression preserves a value that's already `2` or greater and raises only a lower value to `2`.
    - Keep the current plan values for `sku`, `kind`, `reserved`, and other settings when you adapt the example.
    
        ```bicep
        param currentPlanCapacity int

        resource appServicePlan 'Microsoft.Web/serverfarms@2024-11-01' = {
            name: appServicePlanName
            location: location
            sku: {
                name: sku
                capacity: max(2, currentPlanCapacity)
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

When you have a zone-redundant App Service plan, the platform places plan instances across [physical availability zones](/azure/reliability/availability-zones-overview#physical-and-logical-availability-zones). Use the Azure portal or the Azure CLI to inspect the physical zone reported for an app's currently observed instances.

> [!NOTE]
> Observed `physicalZone` values are point-in-time placement information. They don't prove that hidden app replicas exist or guarantee physical-zone diversity for an app or deployment slot. By using [per-app scaling](manage-scale-per-app.md), an app can run on fewer instances than the plan.

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), go to the App Service app that you want to inspect.
 
1. Select **Health check**.

1. Select **Instances** to view the physical zone placement for each of your instances.
    
    :::image type="content" source="./media/configure-zone-redundancy/app-service-physical-zones.png" alt-text="Screenshot of the Instances tab in the Health Check section with the physical zone information in the Azure portal for an App Service app.":::

# [Azure CLI](#tab/azurecli)

Use the [REST API](/rest/api/appservice/web-apps/list-instance-identifiers?view=rest-appservice-2024-04-01), which returns the `physicalZone` value for each currently observed instance of the specified app.

```azurecli
az rest --method get --url /subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/sites/{appName}/instances?api-version=2024-04-01
```

# [Bicep](#tab/bicep)

Bicep doesn't support this operation. Use the Azure CLI or the Azure portal instead.

---

## Related content
- [Reliability in App Service](/azure/reliability/reliability-app-service)
- [Implement per-app scaling for high-density hosting](manage-scale-per-app.md)
- [Configure an App Service Environment for zone redundancy](../app-service/environment/configure-zone-redundancy-environment.md)
