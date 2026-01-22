---
title: Configure App Service Environments and Isolated v2 App Service Plans for Zone Redundancy
description: Learn how to configure zone redundancy for App Service Environments and Isolated v2 App Service plans to boost reliability and minimize service disruption.
ms.topic: conceptual
ms.service: azure-app-service
ms.date: 10/24/2025
author: anaharris
ms.author: anaharris

---
# Configure App Service Environments and Isolated v2 App Service plans for zone redundancy

An [App Service Environment](./overview.md) is a single-tenant deployment of Azure App Service that integrates with an Azure virtual network. Each App Service Environment deployment requires a dedicated subnet that other resources can't use.

This article describes how to create and modify App Service Environment zone redundancy settings. It also describes how to set up and modify zone redundancy settings for your plan.

For more information about zone redundancy, see [Reliability in an App Service Environment](/azure/reliability/reliability-app-service-environment).

## Configure zone redundancy for an App Service Environment

- **To create a new zone-redundant App Service Environment**, follow the steps to [create an App Service Environment](creation.md). Make sure to select **Enabled** for **Zone redundancy**.

- **To enable or disable zone redundancy** for an existing App Service Environment, you can use the Azure portal, Azure CLI, or Bicep:
    
    # [Azure portal](#tab/portal)
    
    1. In the [Azure portal](https://portal.azure.com), go to your App Service Environment.
    1. Select **Settings > Configuration** in the left navigation pane.
    1. Select **Zone redundant** if you wish to enable zone redundancy. Deselect if you wish to disable it.
     
    :::image type="content" source="./media/configure-zone-redundancy/app-service-environment-enable-zone-redundancy.png" alt-text="Screenshot of zone redundancy property for an App Service Environment in the Azure portal.":::    
    
    # [Azure CLI](#tab/azurecli)
    
    - To *enable zone redundancy*, set the `zoneRedundant` property to `true`.
    
        ```azurecli
        az resource update \
            --ids /subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Web/hostingEnvironments/{aseName} \
            --set properties.zoneRedundant=true
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
    > A zone redundancy status change in an App Service Environment takes 12 to 24 hours to complete. During the upgrade process, no downtime or performance problems occur. However, all App Service plans with fewer than 3 instances are scaled to 3 instances. Any plan with 3 or more instances remains unchanged. Once the operation to enable zone redundancy completes, you can scale your App Service plans as needed, including to fewer than 3 instances.

### Check for zone redundancy support for an App Service Environment

To see whether an existing App Service Environment supports zone redundancy:

1. Get the maximum number of availability zones that the App Service Environment can use by using the Azure portal, Azure CLI, or Bicep/Resource Manager:

    # [Azure portal](#tab/portal)

    1. In the [Azure portal](https://portal.azure.com), navigate to your App Service Environment.
    
    1. Select **Settings > Configuration** in the left navigation pane.
    
        The maximum number of zones that your App Service Environment can use is shown in **Maximum available zones**. 
    
        :::image type="content" source="./media/configure-zone-redundancy/app-service-environment-maximum-zones.png" alt-text="Screenshot of maximum available zones property in the Configuration blade in the Azure portal for an App Service Environment.":::

    # [Azure CLI](#tab/azurecli)

    Query the environment's `maximumNumberOfZones` property:

    ```azurecli
    az appservice ase show \
        -n <app-service-environment-name> \
        -g <resource-group-name> \
        --query maximumNumberOfZones
    ```

    # [Bicep](#tab/bicep)

    Query the environment's `maximumNumberOfZones` property:

    ```bicep
    resource appServiceEnvironment 'Microsoft.Web/hostingEnvironments@2024-11-01' existing = {
        name: '<app-service-environment-name>'
    }

    #disable-next-line BCP053
    output maximumNumberOfZones bool = appServiceEnvironment.properties.maximumNumberOfZones
    ```

    ---

1. Compare the number with the following table to determine whether your plan supports zone redundancy:
    
    | Maximum Number of Zones  | Zone redundancy support |
    | ------------------------ | ----------------------- |
    | Greater than 1           | Supported               |
    | Equal to 1               | Not supported*          |

    \* If you're on a plan or a stamp that doesn't support availability zones, you must create a new App Service Environment in a new resource group so that you land on the App Service footprint that supports zones.

## Configure Isolated v2 App Service plans with zone redundancy

All App Service plans created in an App Service Environment must use the Isolated v2 pricing tier.

If you enable your App Service Environment to be zone redundant, you can also set the Isolated v2 App Service plans as zone redundant. Each plan has its own independent zone redundancy setting, so you can manually enable or disable zone redundancy on specific plans in an App Service Environment, as long as the environment is configured to be zone redundant.

- **To create a new Isolated v2 App Service plan with zone redundancy**, use the Azure portal, the Azure CLI, or Bicep.
    
    # [Azure portal](#tab/portal)
    
    Follow the guidance to [create an App Service plan](../app-service-plan-manage.md#create-an-app-service-plan). Configure the following settings:
    
    - For **Region**, select your App Service Environment.
    - For **Pricing plan**, select **Isolated v2**.
    - For **Zone redundancy**, select **Enabled**.

    :::image type="content" source="./media/configure-zone-redundancy/app-service-plan-zone-redundancy-portal-new-isolated.png" alt-text="Screenshot of zone redundancy property when creating a new App Service plan in the Azure portal.":::
    
    # [Azure CLI](#tab/azurecli)
    
    - Set the `--zone-redundant` argument.
    - Set the `--number-of-workers` argument, which is the number of instances, to a value of 2 or more.
    
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
    
    - Set the `zoneRedundant` property to `true`.
    - Set the `sku.capacity` property to a value of 2 or more. If you don't define the `sku.capacity` property, the value defaults to 1.
    
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

- **To enable or disable zone redundancy** on an existing Isolated v2 App Service plan, use the Azure portal, the Azure CLI, or Bicep.
    
    # [Azure portal](#tab/portal)
    
    1. In the [Azure portal](https://portal.azure.com), go to your App Service plan.
    1. Select **Settings** > **Scale out (App Service plan)** in the left navigation pane.
    1. Select **Zone redundancy** to enable zone redundancy. Deselect it to disable it.
     
    :::image type="content" source="./media/configure-zone-redundancy/app-service-plan-zone-redundancy-portal-isolated.png" alt-text="Screenshot of zone redundancy property for an App Service plan in the Azure portal.":::
    
    >[!IMPORTANT]
    >If you have *Rules Based* scaling enabled, you can't use the Azure portal to enable zone redundancy for your App Service plan. You must use the Azure CLI or Bicep and Azure Resource Manager instead.
    
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

- [Configure App Service plans for zone redundancy](../configure-zone-redundancy.md)
- [Reliability in App Service Environments](/azure/reliability/reliability-app-service-environment)
