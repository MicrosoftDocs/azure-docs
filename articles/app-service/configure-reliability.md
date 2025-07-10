---
title: Configure App Service plans for reliability
description: Learn how to configure your App Service plan for reliability by using availability zones and zone redundancy
ms.topic: concept
ms.service: azure-app-service
ms.date: 07/09/2025
author: anaharris
ms.author: anaharris

---
# Configure App Service plans for reliability

Azure App Service provides built-in reliability features to help ensure your applications are available and resilient. This article describes how to configure your App Service plan for reliability by using availability zones and zone redundancy.

To learn how to configure your App Service Environments plan for reliability, see [Configure App Service Environment plans for reliability](../reliability/configure-reliability-ase.md).


## Check for zone redundancy support for an App Service plan

To see whether an App Service plan supports zone redundancy, you need to get the maximum number of availability zones that the App Service plan can use. Then you can determine whether zone redundancy is supported based on the maximum number of zones.

Once you have the maximum number of zones, compare the number with the following table to determine whether your plan supports zone redundancy:

| Maximum Number of Zones  | Zone redundancy support |
| ------------------------ | ----------------------- |
| Greater than 1           | Supported               |
| Equal to 1               | Not supported           |


To get the maximum number of availability zones that your App Service plan can use, you can use the Azure portal, Azure CLI, or Bicep:

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your App Service plan.

1. Select **Scale out (App Service plan)**. 

    The maximum number of zones that your App Service plan can use is shown in **Maximum available zones**. 

    :::image type="content" source="./media/reliability-app-service/app-service-plan-max-zones-portal.png" alt-text="Screenshot of maximum available zones property in the Scale out blade in the Azure portal for an App Service plan.":::

# [Azure CLI](#tab/azurecli)

    ```azurecli
    az appservice plan show -n <app-service-plan-name> -g <resource-group-name> --query properties.maximumNumberOfZones
    ```
    
# [Bicep](#tab/bicep)
    
    <!-- Jordan: ChatGPT inserted this. Please correct as needed. -->
    
    ```bicep
    resource appService 'Microsoft.Web/sites@2024-04-01' existing = {
        name: '{appName}'
        resourceGroup: '{resourceGroup}'
    }
    
    output physicalZones array = [for instance in appService.instances: instance.physicalZone]
    
---


## View physical zones for an App Service plan

<!-- Jordan: Why would we want to see this? Just need a little blurb here. -->

To view the [physical availability zone](availability-zones-overview.md#physical-and-logical-availability-zones) for an App Service plan, you can use the Azure portal, Azure CLI, or Bicep:

# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your App Service plan.
 
1. Select the **Health check** blade.

1. Select the **Instances** tab to view the physical zone placement for each of your instances.
    
    :::image type="content" source="./media/reliability-app-service/app-service-physical-zones.png" alt-text="Screenshot of the Instances tab in the Health Check blade with the physical zone information in the Azure portal for an App Service app.":::

    # [Azure CLI](#tab/azurecli)

    Use the [REST API](/rest/api/appservice/web-apps/get-instance-info), which returns the `physicalZone` value for each instance in the App Service plan:

    ```azurecli
    az rest --method get --url https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/sites/{appName}/instances?api-version=2024-04-01
    ```
    # [Bicep](#tab/bicep)

        ```bicep
        resource appService 'Microsoft.Web/sites@2024-04-01' existing = {
          name: '{appName}'
          resourceGroup: '{resourceGroup}'
        }
    
        output physicalZones array = [for instance in appService.instances: instance.physicalZone]
        ```
---

### Create a new App Service plan with zone redundancy

To create a new App Service plan with zone redundancy:


# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to **App Service plans**.
1. Select **Add** to create a new App Service plan.
1. In the **Basics** tab, fill in the required information.
1. In the **Hosting** tab, select **Enable zone redundancy**.
1. Complete the remaining steps to create the App Service plan.


:::image type="content" source="./media/reliability-app-service/app-service-create-zr-plan.png" alt-text="Screenshot of zone redundancy enablement during App Service plan creation in the Azure portal.":::

# [Azure CLI](#tab/azurecli)

```azurecli
az appservice plan create -g MyResourceGroup -n MyPlan --zone-redundant --number-of-workers 2 --sku P1V3
```

> [!NOTE]
> If you use the Azure CLI to modify the `zone-redundant` property, you must specify the `--number-of-workers` property, which is the number of instances, and use a capacity greater than or equal to 2.

# [Bicep](#tab/bicep)

```bicep
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
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


### Enable or disable zone-redundancy for an existing App Service plan

To enable or disable an existing App Service plan to zone-redundancy:



# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to  your App Service plan.
1. Select **Settings > Scale out (App Service plan)** in the left navigation pane.
1. Select **Zone redundancy** if you wish to enable zone redundancy. Deselect if you wish to disable it.

:::image type="content" source="./media/reliability-app-service/app-service-plan-zone-redundancy-portal.png" alt-text="Screenshot of zone redundancy property for an App Service plan in the Azure portal.":::

> [!IMPORTANT]
> If you have *Rules Based* scaling enabled, you can't use the Azure portal to enable zone redundancy. You must use the Azure CLI or Bicep/Resource Manager instead.

 # [Azure CLI](#tab/azurecli)

To disable zone redundancy, set the `zoneRedundant` property to `false`.
To enable zone redundancy, set the `zoneRedundant` property to `true` and ensure that you define the `sku.capacity` property. If you don't define the `sku.capacity` property, the value defaults to 1.

```azurecli
az appservice plan update -g <resource group name> -n <app service plan name> --set zoneRedundant=<true|false> sku.capacity=2
```

> [!NOTE]
> If you use the Azure CLI to modify the `zoneRedundant` property, you must define the `sku.capacity` property (the number of instances) as greater than or equal to 2.

# [Bicep](#tab/bicep)
<-- Jordan: Please provide bicep. -->

---

If you're on a plan or a stamp that doesn't support availability zones, you must create a new App Service plan in a new resource group so that you land on the App Service footprint that supports zones.

> [!NOTE]
> Changing the zone redundancy status of an App Service plan is almost instantaneous. You don't experience downtime or performance problems during the process.