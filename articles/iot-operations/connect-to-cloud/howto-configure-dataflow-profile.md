---
title: Configure data flow profile in Azure IoT Operations
description: How to configure a data flow profile in Azure IoT Operations to change a data flow behavior.
author: PatAltimore
ms.author: patricka
ms.service: azure-iot-operations
ms.subservice: azure-data-flows
ms.topic: how-to
ms.date: 06/18/2025

#CustomerIntent: As an operator, I want to understand how to I can configure a a data flow profile to control a data flow behavior.
---

# Configure data flow profile

[!INCLUDE [kubernetes-management-preview-note](../includes/kubernetes-management-preview-note.md)]

Data flow profiles can be used to group data flows together so that they share the same configuration. You can create multiple data flow profiles to manage sets of different data flow configurations. 

The most important setting is the instance count. For a given data flow, the instance count determines the number of copies that run on your cluster. For example, you might have a data flow profile with a single instance for development and testing, and another profile with multiple instances for production. Or, you might use a data flow profile with low instance count for low-throughput data flows and a profile with high instance count for high-throughput data flows. Similarly, you can create a data flow profile with different diagnostic settings for debugging purposes.

## Default data flow profile

A data flow profile named *default* is created when Azure IoT Operations is deployed. You can use this data flow profile to get started with Azure IoT Operations.

# [Portal](#tab/portal)

1. To view the default data flow profile, go to your IoT Operations instance in the Azure portal.
1. In the left pane under **Components**, select **Data flow profiles**.
1. Select the **default** data flow profile.

    :::image type="content" source="media/howto-configure-dataflow-profile/default-profile.png" alt-text="Screenshot of the Azure portal displaying the default data flow profile details, including instance count and configuration options.":::

# [Azure CLI](#tab/azure-cli)

Use the [az iot operations dataflow profile show](/cli/azure/iot/ops/dataflow/profile/show#az-iot-ops-dataflow-profile-show) command to view the default data flow profile:

```azurecli
az iot operations dataflow profile show --resource-group <ResourceGroupName> --instance <AioInstanceName> --name default
```

Here's and example command to view the default data flow profile:

```azurecli
az iot operations dataflow profile show --resource-group myResourceGroup --instance myAioInstance --name default
```

# [Bicep](#tab/bicep)

```bicep
param aioInstanceName string = '<AIO_INSTANCE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

// Pointer to the Azure IoT Operations instance
resource aioInstance 'Microsoft.IoTOperations/instances@2024-11-01' existing = {
  name: aioInstanceName
}

// Pointer to your custom location where AIO is deployed
resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

// Pointer to the default data flow profile
resource defaultDataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-11-01' = {
  parent: aioInstance
  name: 'default'
  extendedLocation: {
    name: customLocation.id
    type: 'CustomLocation'
  }
  properties: {
    instanceCount: 1
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowProfile
metadata:
  name: default
  namespace: azure-iot-operations
spec:
  instanceCount: 1
```

---

Unless you need additional throughput or redundancy, you can use the default data flow profile for your data flows. If you need to adjust the instance count or other settings, you can create a new data flow profile.

## Create a new data flow profile

To create a new data flow profile, specify the name of the profile and the instance count.

> [!IMPORTANT]
> Data profile name length must be between 1 and 39 characters.


# [Portal](#tab/portal)

1. In the Azure portal, go to your IoT Operations instance.
1. In the left pane under **Components**, select **Data flow profiles**.
1. Select **+ Data flow profile** to create a new data flow profile.
1. In the **Create data flow profile** pane, enter a name for the data flow profile and set the instance count. You can also set other settings such as diagnostics settings.

    :::image type="content" source="media/howto-configure-dataflow-profile/create-profile.png" alt-text="Screenshot of the Azure portal displaying the create data flow profile pane, including fields for name, instance count, and configuration options.":::

# [Azure CLI](#tab/azure-cli)

Use the [az iot operations dataflow profile create](/cli/azure/iot/ops/dataflow/profile/create#az-iot-ops-dataflow-profile-create) command to create a new data flow profile:

```azurecli
az iot operations dataflow profile create --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <ProfileName>
```
Here's an example command to create a new data flow profile named `myDataFlowProfile`:

```azurecli
az iot operations dataflow profile create --resource-group myResourceGroup --instance myAioInstance --name myDataFlowProfile
```

# [Bicep](#tab/bicep)

```bicep
resource dataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-11-01' = {
  parent: aioInstance
  name: '<NAME>'
  properties: {
    instanceCount: <COUNT>
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowProfile
metadata:
  name: '<NAME>'
  namespace: azure-iot-operations
spec:
  instanceCount: <COUNT>
```

---

## Scaling

You can scale the data flow profile to adjust the number of instances that run the data flows. For a given data flow, instance count is the number of copies that run on your cluster. Increasing the instance count can improve the throughput of the data flows by creating multiple clients to process the data. When using data flows with cloud services that have rate limits per client, increasing the instance count can help you stay within the rate limits.

Scaling can also improve the resiliency of the data flows by providing redundancy in case of failures.

To manually scale the data flow profile, specify the number of instances you want to run. For example, to set the instance count to 3:

# [Portal](#tab/portal)

1. In the Azure portal, go to your IoT Operations instance.
1. In the left pane under **Components**, select **Data flow profiles**.
1. Select the data flow profile you want to configure.
1. Use the slider to set the instance count.

    :::image type="content" source="media/howto-configure-dataflow-profile/profile-scale.png" alt-text="Screenshot of the Azure portal displaying data flow details and the instance count slider set to 3.":::

# [Azure CLI](#tab/azure-cli)

Use the [az iot operations dataflow profile update](/cli/azure/iot/ops/dataflow/profile/update#az-iot-ops-dataflow-profile-update) command to update the instance count of a data flow profile:

```azurecli
az iot operations dataflow profile update --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <ProfileName> --profile-instance <InstanceCount>
```

Here's an example command to set the instance count to three for data flow profile `myDataFlowProfile`:

```azurecli
az iot operations dataflow profile update --resource-group myResourceGroup --instance myAioInstance --name myDataFlowProfile --profile-instances 3
```

# [Bicep](#tab/bicep)

```bicep
properties: {
  instanceCount: 3
}
```


# [Kubernetes (preview)](#tab/kubernetes)

```yaml
spec:
  instanceCount: 3
```

---

## Diagnostic settings

You can configure other diagnostics settings for a data flow profile such as log level.

In most cases, the default settings are sufficient. However, you can override the log level or other settings for debugging. 

To learn how to configure these diagnostic settings, see [ProfileDiagnostics](/rest/api/iotoperations/dataflow-profile/create-or-update?#profilediagnostics).

# [Portal](#tab/portal)

1. In the Azure portal, go to your IoT Operations instance.
1. Under **Components**, select **Data flow profiles**.
1. Select the data flow profile you want to configure.

    :::image type="content" source="media/howto-configure-dataflow-profile/profile-diagnostics.png" alt-text="Screenshot of the Azure portal displaying data flow details and the log level options listed.":::

# [Azure CLI](#tab/azure-cli)

Use the [az iot operations dataflow profile update](/cli/azure/iot/ops/dataflow/profile/update#az-iot-ops-dataflow-profile-update) command to update the diagnostics settings of a data flow profile:

```azurecli
az iot operations dataflow profile update --resource-group <ResourceGroupName> --instance <AioInstanceName> --name <ProfileName> --log-level <level>
```

Here's an example command to set the log level to `debug` for data flow profile `myDataFlowProfile`:

```azurecli
az iot operations dataflow profile update --resource-group myResourceGroup --instance myAioInstance --name myDataFlowProfile --log-level debug
```

# [Bicep](#tab/bicep)

```bicep
resource dataflowProfile 'Microsoft.IoTOperations/instances/dataflowProfiles@2024-11-01' = {
  parent: aioInstance
  name: '<NAME>'
  properties: {
    instanceCount: 1
    diagnostics: {
      {
        logs: {
          level: 'debug'
        }
      }
    }
  }
}
```

# [Kubernetes (preview)](#tab/kubernetes)

```yaml
apiVersion: connectivity.iotoperations.azure.com/v1
kind: DataflowProfile
metadata:
  name: '<NAME>'
  namespace: azure-iot-operations
spec:
  instanceCount: 1
  diagnostics:
    logs:
      level: debug
```

---

## Next steps

To learn more about data flows, see [Create a data flow](howto-create-dataflow.md).