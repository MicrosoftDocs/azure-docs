---
title: Configure App Service plans for zone redundancy
description: Learn how to configure your App Service plan for zone redundancy. Understand how your App Service plan instances are distributed across availability zones and how to check for zone redundancy support.
ms.topic: concept
ms.service: azure-app-service
ms.date: 07/09/2025
author: anaharris
ms.author: anaharris

---
# Configure App Service plans for zone redundancy

Azure App Service provides built-in reliability features to help ensure your applications are available and resilient. This article describes how to configure your App Service plan for reliability by using availability zones and zone redundancy.

This article describes how to configure your App Service plan with zone redundancy, instance distribution across zones, and how to check for zone redundancy support. To learn more about how App Service supports zone redundancy in [Reliability in Azure App Service](../../reliability/reliability-app-service.md).


## Prerequisites

Before you begin, ensure that you meet the following prerequisites:

- You have an Azure subscription. If you don't have one, [create a free account](https://azure.microsoft.com/free/).

## Create a new App Service plan with zone redundancy

To create a new App Service plan with zone redundancy:


# [Azure portal](#tab/portal)

Follow the guidance in [Create an App Service plan](../app-service/app-service-plan-manage.md#create-an-app-service-plan). Make sure to select *Enabled* for **Zone redundancy**.
  

:::image type="content" source="./media/configure-reliability/app-service-create-zr-plan.png" alt-text="Screenshot of zone redundancy enablement during App Service plan creation in the Azure portal.":::

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


### Set zone-redundancy for an existing App Service plan

To enable or disable an existing App Service plan to zone-redundancy:


# [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to  your App Service plan.
1. Select **Settings > Scale out (App Service plan)** in the left navigation pane.
1. Select **Zone redundancy** if you wish to enable zone redundancy. Deselect if you wish to disable it.

:::image type="content" source="./media/configure-reliability/app-service-plan-zone-redundancy-portal.png" alt-text="Screenshot of zone redundancy property for an App Service plan in the Azure portal.":::

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

## App Service plan instance distribution across zones

When you create an App Service plan with zone redundancy, the instances of your App Service plan are distributed across the availability zones in the region. The distribution is done automatically by Azure to ensure that your app remains available even if one zone experiences an outage.

Instance distribution in a zone-redundant deployment follows specific rules. These rules remain applicable as the app scales in and scales out:

- **Minimum instances:** Your App Service plan must have a minimum of two instances for zone redundancy.

- **Maximum availability zones supported by your plan:** Azure determines the number of availability zones that your plan can use. To view the number of availability zones that your plan is able to use, see [Zone redundancy support for an App Service plan](#check-for-zone-redundancy-support-for-an-app-service-plan).

- **Instance distribution:** When zone redundancy is enabled, plan instances are distributed across multiple availability zones automatically. The distribution is based on the following rules:

    - The instances distribute evenly if you specify a capacity (number of instances) greater than *maximumNumberOfZones* and the number of instances is divisible by *maximumNumberOfZones*.
    - Any remaining instances are distributed across the remaining zones.
    - When the App Service platform allocates instances for a zone-redundant App Service plan, it uses best-effort zone balancing that the underlying Azure virtual machine scale sets provide. An App Service plan is balanced if each zone has the same number of VMs or differs by plus one VM or minus one VM from all other zones. For more information, see [Zone balancing](/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-use-availability-zones#zone-balancing).

- **Physical zone placement:** To view the [physical availability zone](../reliability/availability-zones-overview.md#physical-and-logical-availability-zones) that's used for each of your App Service plan instances, see [View physical zones for an App Service plan](#view-physical-zones-for-an-app-service-plan).




### Check for zone redundancy support for an App Service plan

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


### View physical zones for an App Service plan

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
